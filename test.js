/**
 * AI Engineer Roadmap — Test Suite
 * Run: node test.js
 * Requires Node 18+ (uses built-in node:test and node:assert)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// ── Load curriculum data ──────────────────────────────────
// curriculum.js declares a global `const CURRICULUM = {...}`
// `const` in eval is block-scoped; replace with `var` so it leaks into module scope
eval(fs.readFileSync('./curriculum.js', 'utf8').replace(/\bconst CURRICULUM\b/, 'var CURRICULUM'));

// ── Pure functions from app.js (browser-independent) ─────

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

function stageLessonsCompleted(stage, progressSet) {
  return stage.lessons.filter(l => progressSet.has(l.id)).length;
}

// ═════════════════════════════════════════════════════════
// escapeHtml
// ═════════════════════════════════════════════════════════

describe('escapeHtml', () => {
  test('escapes ampersand', () => {
    assert.equal(escapeHtml('a & b'), 'a &amp; b');
  });

  test('escapes angle brackets', () => {
    assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
  });

  test('escapes double quotes', () => {
    assert.equal(escapeHtml('"hello"'), '&quot;hello&quot;');
  });

  test('returns empty string for null/undefined', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
  });

  test('leaves plain text unchanged', () => {
    assert.equal(escapeHtml('hello world'), 'hello world');
  });

  test('escapes multiple special chars in one string', () => {
    assert.equal(escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });
});

// ═════════════════════════════════════════════════════════
// Curriculum data structure
// ═════════════════════════════════════════════════════════

describe('CURRICULUM structure', () => {
  test('has a stages array', () => {
    assert.ok(Array.isArray(CURRICULUM.stages));
    assert.ok(CURRICULUM.stages.length > 0);
  });

  test('every stage has required fields', () => {
    for (const stage of CURRICULUM.stages) {
      assert.ok(typeof stage.id === 'number',       `stage.id must be a number`);
      assert.ok(typeof stage.title === 'string',    `stage "${stage.id}" missing title`);
      assert.ok(typeof stage.icon === 'string',     `stage "${stage.id}" missing icon`);
      assert.ok(typeof stage.duration === 'string', `stage "${stage.id}" missing duration`);
      assert.ok(Array.isArray(stage.lessons),       `stage "${stage.id}" missing lessons array`);
      assert.ok(stage.lessons.length > 0,           `stage "${stage.id}" has no lessons`);
    }
  });

  test('every lesson has required fields', () => {
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        assert.ok(typeof lesson.id === 'string',       `lesson missing id in stage ${stage.id}`);
        assert.ok(typeof lesson.title === 'string',    `lesson "${lesson.id}" missing title`);
        assert.ok(typeof lesson.duration === 'string', `lesson "${lesson.id}" missing duration`);
      }
    }
  });

  test('all lesson IDs are unique', () => {
    const ids = [];
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        ids.push(lesson.id);
      }
    }
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, `Duplicate lesson IDs found: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);
  });

  test('lesson IDs match pattern N-M', () => {
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        assert.match(lesson.id, /^\d+-\d+$/, `lesson ID "${lesson.id}" does not match N-M pattern`);
      }
    }
  });

  test('runnable lessons have code', () => {
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        if (lesson.runnable) {
          assert.ok(lesson.code && lesson.code.trim().length > 0,
            `lesson "${lesson.id}" is runnable but has no code`);
        }
      }
    }
  });

  test('project lessons have required project fields', () => {
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        if (lesson.isProject) {
          assert.ok(['easy', 'medium', 'hard'].includes(lesson.difficulty),
            `project "${lesson.id}" has invalid difficulty: "${lesson.difficulty}"`);
          assert.ok(Array.isArray(lesson.steps) && lesson.steps.length > 0,
            `project "${lesson.id}" missing steps`);
          assert.ok(Array.isArray(lesson.stack) && lesson.stack.length > 0,
            `project "${lesson.id}" missing stack`);
        }
      }
    }
  });

  test('exercises have starter and solution', () => {
    for (const stage of CURRICULUM.stages) {
      for (const lesson of stage.lessons) {
        if (lesson.exercise) {
          assert.ok(lesson.exercise.title,    `lesson "${lesson.id}" exercise missing title`);
          assert.ok(lesson.exercise.starter,  `lesson "${lesson.id}" exercise missing starter`);
          assert.ok(lesson.exercise.solution, `lesson "${lesson.id}" exercise missing solution`);
        }
      }
    }
  });
});

// ═════════════════════════════════════════════════════════
// getLessonById
// ═════════════════════════════════════════════════════════

describe('getLessonById', () => {
  test('returns lesson and stage for a valid ID', () => {
    const firstStage  = CURRICULUM.stages[0];
    const firstLesson = firstStage.lessons[0];
    const result = getLessonById(firstLesson.id);
    assert.ok(result, 'should find the first lesson');
    assert.equal(result.lesson.id, firstLesson.id);
    assert.equal(result.stage.id,  firstStage.id);
  });

  test('returns null for an unknown ID', () => {
    assert.equal(getLessonById('99-99'), null);
  });

  test('returns null for empty string', () => {
    assert.equal(getLessonById(''), null);
  });

  test('finds lessons from every stage', () => {
    for (const stage of CURRICULUM.stages) {
      const lesson = stage.lessons[0];
      const result = getLessonById(lesson.id);
      assert.ok(result, `should find lesson "${lesson.id}" in stage ${stage.id}`);
    }
  });
});

// ═════════════════════════════════════════════════════════
// getStageById
// ═════════════════════════════════════════════════════════

describe('getStageById', () => {
  test('returns the correct stage by numeric id', () => {
    for (const stage of CURRICULUM.stages) {
      const result = getStageById(stage.id);
      assert.ok(result, `should find stage ${stage.id}`);
      assert.equal(result.id, stage.id);
    }
  });

  test('returns undefined for an unknown stage id', () => {
    assert.equal(getStageById(999), undefined);
  });
});

// ═════════════════════════════════════════════════════════
// totalLessons
// ═════════════════════════════════════════════════════════

describe('totalLessons', () => {
  test('equals sum of all stage lesson counts', () => {
    const expected = CURRICULUM.stages.reduce((sum, s) => sum + s.lessons.length, 0);
    assert.equal(totalLessons(), expected);
  });

  test('is greater than zero', () => {
    assert.ok(totalLessons() > 0);
  });
});

// ═════════════════════════════════════════════════════════
// stageLessonsCompleted
// ═════════════════════════════════════════════════════════

describe('stageLessonsCompleted', () => {
  const stage = CURRICULUM.stages[0];

  test('returns 0 when progress is empty', () => {
    assert.equal(stageLessonsCompleted(stage, new Set()), 0);
  });

  test('returns full count when all lessons are in progress set', () => {
    const all = new Set(stage.lessons.map(l => l.id));
    assert.equal(stageLessonsCompleted(stage, all), stage.lessons.length);
  });

  test('counts only lessons belonging to this stage', () => {
    // Mark only the first lesson of this stage complete
    const progress = new Set([stage.lessons[0].id]);
    assert.equal(stageLessonsCompleted(stage, progress), 1);
  });

  test('ignores lesson IDs from other stages', () => {
    const otherStage = CURRICULUM.stages[1];
    if (!otherStage) return; // only one stage, skip
    const otherIds = new Set(otherStage.lessons.map(l => l.id));
    assert.equal(stageLessonsCompleted(stage, otherIds), 0);
  });
});
