# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Open `index.html` directly in Chrome/Edge, or use the local dev server:

```bash
node serve.js   # http://localhost:5500
```

Pyodide loads from CDN (~100 MB of WASM), so the first load takes 10–30 seconds depending on connection speed. An internet connection is required.

## Architecture

Four source files:

| File | Role |
|------|------|
| `index.html` | App shell: loading screen, sidebar skeleton, content mount point |
| `styles.css` | Dark theme, CSS custom properties for stage colors (`--c1` through `--c6`) |
| `curriculum.js` | All lesson data as a `CURRICULUM` global constant |
| `app.js` | All rendering, routing, Pyodide execution, editor management |

### Routing

Hash-based, no router library. Three views:
- `#` / `""` → dashboard
- `#stage/N` → stage overview
- `#lesson/N-M` → lesson detail

`navigate(view, id)` sets `window.location.hash` and calls `render()`. `handleHash()` parses the hash on load and `hashchange` events.

### Curriculum Data Structure (`curriculum.js`)

```js
CURRICULUM.stages = [{
  id: Number,           // 1–6
  title, icon, color, duration, description,
  lessons: [{
    id: "N-M",          // e.g. "1-1"
    title, icon, duration, tags,
    runnable: Boolean,  // true = interactive CodeMirror editor with Run button
    theory: String,     // raw HTML rendered into .theory-body
    code: String,       // Python code string
    exercise: {
      title, description, tasks: String[],
      starter: String,  // starter code shown in exercise editor
      solution: String
    },
    // Project lessons only:
    isProject: Boolean,
    difficulty: "easy"|"medium"|"hard",
    stack: String[],
    steps: String[]
  }]
}]
```

### Python Execution (`app.js`)

Pyodide (WebAssembly CPython) runs in the browser. Packages pre-loaded at boot: `numpy`, `pandas`, `matplotlib`, `scikit-learn`. Matplotlib uses the `Agg` backend.

**Plot protocol:** Python code must print `__PLOT__:<base64png>` to stdout. `runPython()` in `app.js` scans stdout lines for this prefix and injects `<img>` elements into `.plot-container`.

### Editors

CodeMirror 5 instances are created after lesson DOM renders (via `setTimeout(..., 50)`). Stored in `state.editors` keyed by `editor-<lessonId>` and `ex-editor-<lessonId>`. Cleared on every navigation.

### Progress

Stored in `localStorage` under key `ai-roadmap-progress` as a JSON array of completed lesson IDs (e.g. `["1-1","1-2"]`). Loaded into `state.progress` (a `Set`) on boot.

## Adding Lessons

1. Add a lesson object to the appropriate `stage.lessons` array in `curriculum.js`.
2. Set `runnable: true` to get an interactive editor; omit or `false` for display-only code with a Copy button.
3. For matplotlib plots, end the code with:
   ```python
   import io, base64, matplotlib.pyplot as plt
   buf = io.BytesIO()
   plt.savefig(buf, format='png', bbox_inches='tight')
   print('__PLOT__:' + base64.b64encode(buf.getvalue()).decode())
   ```
4. Stage colors are CSS variables `--c1` through `--c6` defined in `styles.css`.
