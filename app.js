/* ════════════════════════════════════════════════
   AI Engineer Roadmap — Application Logic
   Pyodide (Python in browser) + CodeMirror + routing
   ════════════════════════════════════════════════ */

'use strict';

// ── App State ─────────────────────────────────────────────
const state = {
  view:          'dashboard',   // 'dashboard' | 'stage' | 'lesson'
  stageId:       null,
  lessonId:      null,
  pyodide:       null,
  pyodideReady:  false,
  pyodideError:  false,
  loadedPkgs:    new Set(),
  editors:       {},            // CodeMirror instances keyed by editorId
  progress:      new Set(),     // set of completed lesson IDs
  activeTab:     'theory',
};

// ── Progress Persistence ──────────────────────────────────
function loadProgress() {
  try {
    const saved = localStorage.getItem('ai-roadmap-progress');
    if (saved) state.progress = new Set(JSON.parse(saved));
  } catch (_) {}
}

function saveProgress() {
  localStorage.setItem('ai-roadmap-progress', JSON.stringify([...state.progress]));
}

function markComplete(lessonId) {
  if (state.progress.has(lessonId)) {
    state.progress.delete(lessonId);
  } else {
    state.progress.add(lessonId);
    showToast(lessonId);
  }
  saveProgress();
  updateSidebar();
  updateCompleteBtn(lessonId);
}

// ── Helpers ───────────────────────────────────────────────
function getLessonById(id) {
  for (const stage of CURRICULUM.stages) {
    for (const lesson of stage.lessons) {
      if (lesson.id === id) return { lesson, stage };
    }
  }
  return null;
}

function getStageById(id) {
  return CURRICULUM.stages.find(s => s.id === id);
}

function totalLessons() {
  return CURRICULUM.stages.reduce((sum, s) => sum + s.lessons.length, 0);
}

function stageLessonsCompleted(stage) {
  return stage.lessons.filter(l => state.progress.has(l.id)).length;
}

function stageColor(stageId) {
  return `--c${stageId}`;
}

// ── Navigation ────────────────────────────────────────────
function navigate(view, id) {
  state.view    = view;
  state.editors = {};   // clear editor refs on navigate

  if (view === 'dashboard') {
    state.stageId  = null;
    state.lessonId = null;
    window.location.hash = '';
  } else if (view === 'stage') {
    state.stageId  = id;
    state.lessonId = null;
    window.location.hash = `stage/${id}`;
  } else if (view === 'lesson') {
    state.lessonId = id;
    const found = getLessonById(id);
    if (found) state.stageId = found.stage.id;
    window.location.hash = `lesson/${id}`;
  }

  render();
}

function handleHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) {
    navigate('dashboard');
  } else if (hash.startsWith('stage/')) {
    navigate('stage', parseInt(hash.split('/')[1]));
  } else if (hash.startsWith('lesson/')) {
    navigate('lesson', hash.split('/')[1]);
  }
}

// ── Pyodide Initialization ────────────────────────────────
async function initPyodide() {
  const statusEl   = document.getElementById('loading-status');
  const progressEl = document.getElementById('loading-bar');

  function setStatus(msg, pct) {
    statusEl.textContent   = msg;
    progressEl.style.width = pct + '%';
  }

  try {
    setStatus('Loading Python runtime…', 15);
    state.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });

    setStatus('Loading NumPy & Pandas…', 45);
    await state.pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);

    setStatus('Loading scikit-learn…', 72);
    await state.pyodide.loadPackage('scikit-learn');

    setStatus('Finalizing…', 92);
    // Set up matplotlib Agg backend + stdout redirect helpers
    state.pyodide.runPython(`
import sys, io, matplotlib
matplotlib.use('Agg')
`);

    state.pyodideReady = true;
    state.loadedPkgs.add('numpy');
    state.loadedPkgs.add('pandas');
    state.loadedPkgs.add('matplotlib');
    state.loadedPkgs.add('scikit-learn');

    setStatus('Ready!', 100);
    setPythonStatus('ready', 'Python ready');

  } catch (err) {
    console.error('Pyodide init failed:', err);
    state.pyodideError = true;
    setStatus('Python load failed — display mode only', 100);
    setPythonStatus('error', 'Python unavailable');
  }
}

function setPythonStatus(type, text) {
  const dot  = document.getElementById('py-dot');
  const span = document.getElementById('py-status-text');
  if (!dot || !span) return;
  dot.className  = `py-dot ${type}`;
  span.textContent = text;
}

// ── Code Execution ────────────────────────────────────────
async function runPython(code, outputEl, plotEl, runBtn) {
  if (!state.pyodideReady) {
    showOutput(outputEl, '⏳ Python environment not ready yet. Please wait…', 'empty');
    return;
  }

  if (runBtn) runBtn.disabled = true;
  outputEl.className = 'output-body';
  outputEl.innerHTML = '<div class="output-running"><div class="spinner"></div>Running…</div>';
  if (plotEl) plotEl.innerHTML = '';

  try {
    // Reset stdout/stderr
    state.pyodide.runPython(`
import sys, io as _io
sys.stdout = _io.StringIO()
sys.stderr = _io.StringIO()
`);

    await state.pyodide.runPythonAsync(code);

    const stdout = state.pyodide.runPython('sys.stdout.getvalue()');
    const stderr = state.pyodide.runPython('sys.stderr.getvalue()');

    // Process output lines — detect __PLOT__:base64
    const lines     = stdout.split('\n');
    const textLines = [];

    for (const line of lines) {
      if (line.startsWith('__PLOT__:')) {
        if (plotEl) {
          const img = document.createElement('img');
          img.src   = 'data:image/png;base64,' + line.slice(9);
          img.alt   = 'Plot output';
          plotEl.appendChild(img);
        }
      } else {
        textLines.push(line);
      }
    }

    const textOut = textLines.join('\n').trim();
    if (textOut) {
      showOutput(outputEl, textOut, '');
    } else if (!plotEl || !plotEl.children.length) {
      showOutput(outputEl, '(no output)', 'empty');
    } else {
      showOutput(outputEl, '', 'empty');
    }

    if (stderr && stderr.trim()) {
      const errDiv       = document.createElement('div');
      errDiv.style.color = 'var(--error)';
      errDiv.style.marginTop = '.5rem';
      errDiv.textContent = stderr.trim();
      outputEl.appendChild(errDiv);
    }

  } catch (err) {
    showOutput(outputEl, '❌ ' + err.message, 'has-error');
  } finally {
    if (runBtn) runBtn.disabled = false;
  }
}

function showOutput(el, text, className) {
  el.className   = 'output-body ' + (className || '');
  el.textContent = text;
}

// ── CodeMirror Editor Factory ─────────────────────────────
function makeEditor(textareaEl, code) {
  return CodeMirror.fromTextArea(textareaEl, {
    mode:          'python',
    theme:         'dracula',
    lineNumbers:   true,
    indentUnit:    4,
    tabSize:       4,
    indentWithTabs: false,
    lineWrapping:  false,
    viewportMargin: Infinity,
    extraKeys: { Tab: 'indentMore', 'Shift-Tab': 'indentLess' }
  });
}

// ── Render Engine ─────────────────────────────────────────
function render() {
  updateSidebar();
  renderTopbar();

  const content = document.getElementById('content-area');
  content.innerHTML = '';
  content.scrollTop = 0;

  if (state.view === 'dashboard') renderDashboard(content);
  else if (state.view === 'stage') renderStage(content);
  else if (state.view === 'lesson') renderLesson(content);
}

// ── Sidebar ───────────────────────────────────────────────
function updateSidebar() {
  const nav   = document.getElementById('sidebar-nav');
  const done  = state.progress.size;
  const total = totalLessons();
  const pct   = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('sp-pct').textContent  = pct + '%';
  document.getElementById('sp-fill').style.width = pct + '%';

  nav.innerHTML = CURRICULUM.stages.map(stage => {
    const completed = stageLessonsCompleted(stage);
    const isOpen    = stage.id === state.stageId;
    return `
      <div class="snav-stage ${isOpen ? 'open' : ''}" data-stage="${stage.id}">
        <div class="snav-stage-header ${state.stageId === stage.id && state.view !== 'lesson' ? 'active' : ''}"
             onclick="navigate('stage', ${stage.id})">
          <span class="snav-dot" style="background:var(--c${stage.id})"></span>
          <span class="snav-stage-name">${stage.title}</span>
          <span class="snav-count">${completed}/${stage.lessons.length}</span>
          <span class="snav-chevron">▶</span>
        </div>
        <div class="snav-lessons">
          ${stage.lessons.map(l => `
            <div class="snav-lesson ${state.lessonId === l.id ? 'active' : ''} ${state.progress.has(l.id) ? 'done' : ''}"
                 onclick="navigate('lesson', '${l.id}')">
              <span class="snav-check">✓</span>
              <span>${l.title}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

// ── Topbar ────────────────────────────────────────────────
function renderTopbar() {
  const tb = document.getElementById('topbar');
  if (state.view === 'dashboard') {
    tb.innerHTML = `<div class="breadcrumb"><span class="bc-current">Dashboard</span></div>`;
  } else if (state.view === 'stage') {
    const stage = getStageById(state.stageId);
    tb.innerHTML = `<div class="breadcrumb">
      <span class="bc-link" onclick="navigate('dashboard')">Dashboard</span>
      <span class="bc-sep">/</span>
      <span class="bc-current">${stage ? stage.icon + ' ' + stage.title : ''}</span>
    </div>`;
  } else if (state.view === 'lesson') {
    const found = getLessonById(state.lessonId);
    if (found) {
      const { lesson, stage } = found;
      tb.innerHTML = `<div class="breadcrumb">
        <span class="bc-link" onclick="navigate('dashboard')">Dashboard</span>
        <span class="bc-sep">/</span>
        <span class="bc-link" onclick="navigate('stage', ${stage.id})">${stage.title}</span>
        <span class="bc-sep">/</span>
        <span class="bc-current">${lesson.title}</span>
      </div>`;
    }
  }
}

// ── Dashboard View ────────────────────────────────────────
function renderDashboard(container) {
  const done  = state.progress.size;
  const total = totalLessons();
  const weeks = CURRICULUM.stages.reduce((s, st) => {
    const parts = st.duration.split('–');
    return s + parseInt(parts[parts.length - 1]);
  }, 0);

  container.innerHTML = `
    <div class="dashboard-hero">
      <h1>Become an AI Engineer</h1>
      <p>A structured, hands-on curriculum — from Python data science basics to deploying production AI systems. Theory + real Python code you can run right here.</p>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">${done}/${total}</div>
        <div class="stat-label">Lessons Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${CURRICULUM.stages.length}</div>
        <div class="stat-label">Learning Stages</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">~${weeks}wk</div>
        <div class="stat-label">Estimated Duration</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">5</div>
        <div class="stat-label">Portfolio Projects</div>
      </div>
    </div>

    <div class="section-title">Learning Stages</div>
    <div class="stage-cards-grid">
      ${CURRICULUM.stages.map(stage => {
        const completed = stageLessonsCompleted(stage);
        const pct       = Math.round((completed / stage.lessons.length) * 100);
        return `
          <div class="stage-card" style="--stage-color: var(--c${stage.id})"
               onclick="navigate('stage', ${stage.id})">
            <div class="sc-header">
              <div class="sc-icon">${stage.icon}</div>
              <div class="sc-meta">
                <div class="sc-num">Stage ${stage.id}</div>
                <div class="sc-title">${stage.title}</div>
              </div>
              <span class="sc-badge">${stage.duration}</span>
            </div>
            <div class="sc-desc">${stage.description}</div>
            <div class="sc-progress">
              <div class="sc-progress-row">
                <span class="sc-progress-label">Progress</span>
                <span class="sc-progress-frac">${completed}/${stage.lessons.length}</span>
              </div>
              <div class="sc-bar-track">
                <div class="sc-bar-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="sc-lessons-preview">
              ${stage.lessons.map(l =>
                `<span class="sc-lesson-dot ${state.progress.has(l.id) ? 'done' : ''}">${l.icon || '○'} ${l.title.split(':')[0]}</span>`
              ).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>

    <div style="margin-top:2.5rem; padding:1.2rem; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-lg);">
      <div style="font-weight:600; margin-bottom:.5rem;">Career Goals After This Roadmap</div>
      <div style="display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.6rem;">
        ${['AI Engineer','ML Engineer','Applied AI Engineer','LLM Engineer','AI Backend Engineer'].map(role =>
          `<span style="background:var(--accent-dim);color:var(--accent);padding:.3rem .8rem;border-radius:99px;font-size:.8rem;font-weight:500;">${role}</span>`
        ).join('')}
      </div>
    </div>`;
}

// ── Stage View ────────────────────────────────────────────
function renderStage(container) {
  const stage = getStageById(state.stageId);
  if (!stage) return;
  const completed = stageLessonsCompleted(stage);

  container.innerHTML = `
    <div class="stage-header" style="--stage-color:var(--c${stage.id})">
      <div class="stage-header-top">
        <div class="stage-big-icon">${stage.icon}</div>
        <div class="stage-title-block">
          <div class="stage-subtitle">Stage ${stage.id}</div>
          <h2>${stage.title}</h2>
        </div>
      </div>
      <p class="stage-desc">${stage.description}</p>
      <div class="stage-meta-row">
        <span class="stage-chip">⏱ ${stage.duration}</span>
        <span class="stage-chip">📚 ${stage.lessons.length} lessons</span>
        <span class="stage-chip" style="color:var(--success)">✓ ${completed} completed</span>
      </div>
    </div>

    <div class="section-title">Lessons</div>
    <div class="lesson-list-grid">
      ${stage.lessons.map(lesson => {
        const isDone = state.progress.has(lesson.id);
        return `
          <div class="lesson-card ${isDone ? 'done' : ''}" style="--stage-color:var(--c${stage.id})"
               onclick="navigate('lesson', '${lesson.id}')">
            <div class="lc-icon">${lesson.icon || '📖'}</div>
            <div class="lc-body">
              <div class="lc-title">${lesson.title}</div>
              <div class="lc-footer">
                <span class="lc-duration">⏱ ${lesson.duration}</span>
                ${lesson.runnable ? '<span class="lc-tag">▶ Interactive</span>' : ''}
                ${lesson.isProject ? '<span class="lc-tag">🏗 Project</span>' : ''}
                ${isDone ? '<span class="lc-done-badge">✓ Done</span>' : ''}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── Lesson View ───────────────────────────────────────────
function renderLesson(container) {
  const found = getLessonById(state.lessonId);
  if (!found) return;

  const { lesson, stage } = found;
  const isDone = state.progress.has(lesson.id);
  const lessons = stage.lessons;
  const idx     = lessons.findIndex(l => l.id === lesson.id);
  const prevL   = lessons[idx - 1];
  const nextL   = lessons[idx + 1];

  container.innerHTML = `
    <div class="lesson-hero" style="--stage-color:var(--c${stage.id})">
      <div class="lesson-hero-row">
        <div class="lesson-hero-icon">${lesson.icon || stage.icon}</div>
        <div class="lesson-hero-meta">
          <div class="lesson-number">${stage.title} › Lesson ${lesson.id}</div>
          <h2>${lesson.title}</h2>
          <div class="lesson-tags">
            <span class="tag">⏱ ${lesson.duration}</span>
            ${(lesson.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            ${lesson.runnable ? '<span class="tag" style="color:var(--success)">▶ Runnable in browser</span>' : ''}
          </div>
        </div>
        <button class="lesson-complete-btn ${isDone ? 'done' : ''}"
                id="complete-btn-${lesson.id}"
                onclick="markComplete('${lesson.id}')">
          ${isDone ? '✓ Completed' : '○ Mark Complete'}
        </button>
      </div>
    </div>

    <div class="tab-bar">
      ${lesson.theory ? `<button class="tab-btn active" data-tab="theory" onclick="switchTab(event, 'theory')">📖 Theory</button>` : ''}
      ${lesson.code   ? `<button class="tab-btn" data-tab="code"   onclick="switchTab(event, 'code')">▶ Code Lab</button>` : ''}
      ${lesson.exercise ? `<button class="tab-btn" data-tab="exercise" onclick="switchTab(event, 'exercise')">✏️ Exercise</button>` : ''}
    </div>

    <div id="tab-theory"   class="tab-panel ${lesson.theory ? 'active' : ''}">
      ${renderTheory(lesson, stage)}
    </div>
    <div id="tab-code"     class="tab-panel">
      ${lesson.code ? renderCodeLab(lesson, stage) : ''}
    </div>
    <div id="tab-exercise" class="tab-panel">
      ${lesson.exercise ? renderExercise(lesson, stage) : ''}
    </div>

    <div class="lesson-nav-row">
      ${prevL ? `<button class="nav-arrow" onclick="navigate('lesson','${prevL.id}')">← ${prevL.title}</button>` : '<div></div>'}
      ${nextL ? `<button class="nav-arrow primary" onclick="navigate('lesson','${nextL.id}')">${nextL.title} →</button>` : '<div></div>'}
    </div>`;

  // Initialise CodeMirror editors after DOM is ready
  setTimeout(() => {
    initEditors(lesson, stage);
  }, 50);
}

function switchTab(event, tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

function updateCompleteBtn(lessonId) {
  const btn = document.getElementById('complete-btn-' + lessonId);
  if (!btn) return;
  const isDone = state.progress.has(lessonId);
  btn.className   = 'lesson-complete-btn ' + (isDone ? 'done' : '');
  btn.textContent = isDone ? '✓ Completed' : '○ Mark Complete';
}

// ── Theory ────────────────────────────────────────────────
function renderTheory(lesson, stage) {
  if (lesson.isProject) return renderProjectCard(lesson, stage);
  return `<div class="theory-body">${lesson.theory || ''}</div>`;
}

function renderProjectCard(lesson, stage) {
  const diffClass = { easy: 'easy', medium: 'medium', hard: 'hard' }[lesson.difficulty] || 'medium';
  return `
    <div class="theory-body">
      <div class="project-card" style="--stage-color:var(--c${stage.id}); max-width:640px;">
        <div class="project-card-top">
          <div class="project-num">${lesson.icon} ${lesson.id}</div>
          <div class="project-title">${lesson.title}</div>
          <div class="project-desc">${lesson.description}</div>
        </div>
        <div class="project-card-body">
          <span class="difficulty ${diffClass}">${lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}</span>
          <div class="project-stack">${(lesson.stack || []).map(s => `<span class="stack-chip">${s}</span>`).join('')}</div>
          <div class="project-steps-title">Implementation Steps</div>
          <ol class="project-steps">
            ${(lesson.steps || []).map((s, i) => `<li><span class="step-num">${i+1}</span>${s}</li>`).join('')}
          </ol>
        </div>
      </div>
    </div>`;
}

// ── Code Lab ──────────────────────────────────────────────
function renderCodeLab(lesson, stage) {
  if (!lesson.code) return '';

  if (!lesson.runnable) {
    // Display-only with copy + colab buttons
    return `
      <div class="code-display">
        <div class="code-display-header">
          <span class="code-display-lang">🐍 Python</span>
          <div class="code-display-actions">
            <button class="copy-btn" onclick="copyCode(this, 'display-code-${lesson.id}')">Copy</button>
            <a href="https://colab.research.google.com/drive/" target="_blank" class="colab-btn">Open Colab ↗</a>
          </div>
        </div>
        <pre id="display-code-${lesson.id}">${escapeHtml(lesson.code)}</pre>
      </div>`;
  }

  // Interactive runner
  return `
    <div class="code-lab-wrap">
      <div class="editor-panel">
        <div class="editor-header">
          <div class="editor-title"><span class="dot"></span> Python — edit and run</div>
          <div class="editor-actions">
            <button class="reset-btn" onclick="resetEditor('editor-${lesson.id}', '${lesson.id}')">Reset</button>
            <button class="run-btn" id="runbtn-${lesson.id}" onclick="runLesson('${lesson.id}')">
              <span class="run-icon">▶</span> Run
            </button>
          </div>
        </div>
        <textarea id="editor-${lesson.id}" style="display:none;">${escapeHtml(lesson.code)}</textarea>
      </div>
      <div class="output-panel">
        <div class="output-header">
          <span>Output</span>
          <span style="font-size:.7rem">stdout + plots</span>
        </div>
        <div class="output-body empty" id="output-${lesson.id}">Run your code to see output here…</div>
        <div class="plot-container" id="plot-${lesson.id}"></div>
      </div>
    </div>`;
}

// ── Exercise ──────────────────────────────────────────────
function renderExercise(lesson, stage) {
  if (!lesson.exercise) return '';
  const ex = lesson.exercise;
  return `
    <div class="exercise-panel">
      <div class="exercise-prompt">
        <h4>🎯 ${ex.title}</h4>
        <p>${ex.description}</p>
        ${ex.tasks ? `<ul>${ex.tasks.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      </div>
      <div class="editor-panel">
        <div class="editor-header">
          <div class="editor-title"><span class="dot"></span> Your Solution</div>
          <div class="editor-actions">
            <button class="reset-btn" onclick="resetExEditor('ex-editor-${lesson.id}', '${lesson.id}')">Reset</button>
            <button class="run-btn" id="ex-runbtn-${lesson.id}" onclick="runExercise('${lesson.id}')">
              <span class="run-icon">▶</span> Run
            </button>
          </div>
        </div>
        <textarea id="ex-editor-${lesson.id}" style="display:none;">${escapeHtml(ex.starter)}</textarea>
      </div>
      <div class="output-panel">
        <div class="output-header"><span>Output</span></div>
        <div class="output-body empty" id="ex-output-${lesson.id}">Run your solution…</div>
        <div class="plot-container" id="ex-plot-${lesson.id}"></div>
      </div>
      <button class="solution-toggle" onclick="toggleSolution('${lesson.id}')">
        👁 Show Solution
      </button>
      <div id="solution-${lesson.id}" style="display:none;">
        <div class="code-display">
          <div class="code-display-header">
            <span class="code-display-lang">✅ Solution</span>
            <button class="copy-btn" onclick="copyCode(this, 'sol-${lesson.id}')">Copy</button>
          </div>
          <pre id="sol-${lesson.id}">${escapeHtml(ex.solution)}</pre>
        </div>
      </div>
    </div>`;
}

// ── Editor Init ───────────────────────────────────────────
function initEditors(lesson, stage) {
  // Main code lab editor
  const mainTa = document.getElementById(`editor-${lesson.id}`);
  if (mainTa && lesson.runnable) {
    const cm = makeEditor(mainTa, lesson.code);
    state.editors[`editor-${lesson.id}`] = { cm, original: lesson.code };
  }

  // Exercise editor
  if (lesson.exercise) {
    const exTa = document.getElementById(`ex-editor-${lesson.id}`);
    if (exTa) {
      const exCm = makeEditor(exTa, lesson.exercise.starter);
      state.editors[`ex-editor-${lesson.id}`] = { cm: exCm, original: lesson.exercise.starter };
    }
  }
}

function makeEditor(ta, code) {
  return CodeMirror.fromTextArea(ta, {
    mode:           'python',
    theme:          'dracula',
    lineNumbers:    true,
    indentUnit:     4,
    tabSize:        4,
    indentWithTabs: false,
    viewportMargin: Infinity,
    extraKeys:      { 'Tab': 'indentMore', 'Shift-Tab': 'indentLess' }
  });
}

// ── Run Handlers ──────────────────────────────────────────
async function runLesson(lessonId) {
  const edInfo = state.editors[`editor-${lessonId}`];
  if (!edInfo) return;
  const code    = edInfo.cm.getValue();
  const outputEl = document.getElementById(`output-${lessonId}`);
  const plotEl   = document.getElementById(`plot-${lessonId}`);
  const runBtn   = document.getElementById(`runbtn-${lessonId}`);
  await runPython(code, outputEl, plotEl, runBtn);
}

async function runExercise(lessonId) {
  const edInfo  = state.editors[`ex-editor-${lessonId}`];
  if (!edInfo) return;
  const code    = edInfo.cm.getValue();
  const outputEl = document.getElementById(`ex-output-${lessonId}`);
  const plotEl   = document.getElementById(`ex-plot-${lessonId}`);
  const runBtn   = document.getElementById(`ex-runbtn-${lessonId}`);
  await runPython(code, outputEl, plotEl, runBtn);
}

function resetEditor(editorKey, lessonId) {
  const edInfo = state.editors[editorKey];
  if (edInfo) edInfo.cm.setValue(edInfo.original);
}

function resetExEditor(editorKey, lessonId) {
  resetEditor(editorKey, lessonId);
}

// ── Utilities ─────────────────────────────────────────────
function toggleSolution(lessonId) {
  const el = document.getElementById(`solution-${lessonId}`);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function copyCode(btn, preId) {
  const pre = document.getElementById(preId);
  if (!pre) return;
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(lessonId) {
  const found = getLessonById(lessonId);
  if (!found) return;
  const toast = document.createElement('div');
  toast.className = 'completion-toast';
  toast.innerHTML = `
    <div class="toast-icon">🎉</div>
    <div>
      <div class="toast-title">Lesson Complete!</div>
      <div class="toast-sub">${found.lesson.title}</div>
    </div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Boot Sequence ─────────────────────────────────────────
async function boot() {
  loadProgress();

  // Start Pyodide loading in parallel with rendering
  const pyodidePromise = initPyodide();

  // Show app shell as soon as Pyodide starts loading
  await new Promise(res => setTimeout(res, 500));  // small delay so progress bar is visible

  await pyodidePromise;

  // Hide loading screen, show app
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  // Handle initial route
  window.addEventListener('hashchange', handleHash);
  handleHash();
}

document.addEventListener('DOMContentLoaded', boot);
