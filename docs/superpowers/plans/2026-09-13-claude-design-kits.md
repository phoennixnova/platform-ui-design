# Platform Kits for Claude Design — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship iOS, Android and Windows platform kits (tokens + 12 core components each) as Claude Design design-system projects, built from hand-authored fragments by a zero-dependency Node script and pushed incrementally through the `DesignSync` tool.

**Architecture:** Platform tokens move out of `make-artboards.mjs` into `platform-tokens.mjs` (shared, exported). A new `build-kit.mjs` reads `kits/<platform>/kit.json`, lints each component fragment, wraps it with generated token CSS into a self-contained `@dsCard` HTML file (light and dark side by side), and writes a bundle + sha256 manifest. A new reference, `design-system-sync.md`, tells Claude how to diff that bundle against a Claude Design project and push only what changed.

**Tech Stack:** Node ≥ 18 ESM, `node:test` (no framework), `node:crypto`, `node:fs`. No npm dependencies. Optional headless render check via `playwright` if importable.

Spec: `docs/superpowers/specs/2026-09-13-claude-design-kits-design.md`

## Global Constraints

- Node 18+; zero runtime dependencies; scripts remain runnable as `node <script>.mjs` with no install step.
- `make-artboards.mjs` output (every `.dc.html`, `canvas.json`, `--tokens` css/json) must be **byte-identical** before and after the token extraction.
- Fragments (`kits/*/components/*.html|css`) contain **no color literal**: no `#hex`, `rgb()`/`rgba()`/`hsl()`/`hsla()`, no CSS named color. `transparent`, `currentColor`, `inherit` allowed.
- Fragments contain no `font-size:`; use ramp classes `.ios-*`, `.md-*`, `.win-*`.
- No emoji, no `<img>`; icons are inline SVG on a 24 px grid, stroke-based, `stroke="currentColor"`.
- Hit targets: iOS ≥ 44 px, Android ≥ 48 px, Windows ≥ 32 px (mouse) / ≥ 40 px (touch).
- Layout with flex/grid + `gap`; copy is literal text in markup.
- Project names in Claude Design are exactly `Platform UI · iOS`, `Platform UI · Android`, `Platform UI · Windows`.
- Build writes only under `--out`; writes to a temp dir and renames — never a partial bundle.
- Exit codes: `0` ok · `1` lint failure · `2` bad arguments / missing `kit.json`.
- Plugin version becomes `0.2.0` in both `plugin.json` and `marketplace.json`.
- Commit messages end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Commands shown for the implementer run in the Bash tool. Anything printed for the user must be PowerShell (see `~/.claude/CLAUDE.md`).

All paths below are relative to the repo root unless noted. `SK` = `plugins/platform-ui-design/skills/platform-ui-design`.

---

## File map

| Path | Responsibility |
|---|---|
| `SK/scripts/platform-tokens.mjs` | **New.** `DEVICES`, `CHROME`, `TOKENS`, `PREFIX`, `SURFACE`, `resolveDevice`, `cssVars`, `typeClasses`. Pure data + helpers, no I/O. |
| `SK/scripts/make-artboards.mjs` | **Modified.** Imports from `platform-tokens.mjs`; nothing else changes. |
| `SK/scripts/build-kit.mjs` | **New.** CLI: args → load kit → lint → wrap → write bundle + manifest. |
| `SK/scripts/lib/kit-lint.mjs` | **New.** Pure functions: `parseHeader`, `lintFragment`, `lintKit`. |
| `SK/scripts/lib/kit-wrap.mjs` | **New.** Pure functions: `tokenStyle`, `baseCardCss`, `wrapCard`, `colorsCard`. |
| `SK/scripts/test/*.test.mjs` | **New.** `node --test` suites. |
| `SK/scripts/test/fixtures/golden/` | **New.** Pre-extraction artboard + token output. |
| `SK/scripts/test/fixtures/kit-good/`, `kit-bad/` | **New.** Minimal kits for lint tests. |
| `SK/kits/<platform>/kit.json` | Card order, widths, foundation metadata, project name. |
| `SK/kits/<platform>/foundations/*.html` | Hand-authored foundation card bodies (colors is generated). |
| `SK/kits/<platform>/components/<slot>.html` (+ `.css`) | Component fragments. |
| `SK/references/design-system-sync.md` | Push contract for Claude. |
| `SK/SKILL.md`, `README.md`, `CONTRIBUTING.md`, `.github/workflows/validate.yml`, version files | Docs, CI, version bump. |

### Shared interfaces (defined once, used by every task)

`platform-tokens.mjs` exports:

```js
export const DEVICES;   // { ios: { "iphone": {label,w,h,top,bottom,...}, ... }, android: {...}, windows: {...} }
export const CHROME;    // { ios: {topBar,...}, android: {...}, windows: {...} }
export const TOKENS;    // { ios: {font, light:{role:value}, dark:{...}, accentDefault, accentDark, type:[[name,size,lh,weight],...]}, android, windows }
export const PREFIX;    // { ios: "ios", android: "md", windows: "win" }
export const SURFACE;   // { ios: {bg:"bg", fg:"label"}, android: {bg:"surface", fg:"on-surface"}, windows: {bg:"bg-base", fg:"text-primary"} }
export function resolveDevice(platform, key);   // → [key, deviceObj]
export function cssVars(obj, prefix);           // → "      --prefix-k: v;\n..." (6-space indent, exactly as today)
export function typeClasses(type, prefix);      // → ".prefix-name { font-size: ...px; line-height: ...px; font-weight: ...; letter-spacing: 0; margin: 0; }\n..." (4-space indent, exactly as today)
```

`kit.json` schema:

```json
{
  "platform": "ios",
  "projectName": "Platform UI · iOS",
  "defaultWidth": 720,
  "foundations": [
    { "id": "colors",         "group": "Foundations", "title": "Colors",          "subtitle": "Semantic roles, light and dark", "generated": true },
    { "id": "type",           "group": "Foundations", "title": "Type ramp",       "subtitle": "11 text styles" },
    { "id": "spacing-shape",  "group": "Foundations", "title": "Spacing & shape", "subtitle": "Margins, grid step, radii" },
    { "id": "chrome-metrics", "group": "Foundations", "title": "Chrome metrics",  "subtitle": "Bars, insets, size classes", "width": 393 }
  ],
  "components": [
    { "slot": "top-chrome", "width": 393 },
    { "slot": "primary-nav", "width": 393 },
    { "slot": "button" },
    { "slot": "icon-button" },
    { "slot": "fab" },
    { "slot": "list-row" },
    { "slot": "text-field" },
    { "slot": "toggle" },
    { "slot": "selection" },
    { "slot": "sheet-dialog" },
    { "slot": "search" },
    { "slot": "feedback" }
  ]
}
```

Fragment header (first line of every `components/<slot>.html` and `foundations/<id>.html`), fields separated by ` · `:

```
<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled / tinted / gray / plain · ref: apple-components.md §Buttons -->
```

Foundation headers omit `slot:`. `group`, `title`, `subtitle` in a foundation header override `kit.json`.

Built card (output) layout:

```
<!-- @dsCard group="Buttons" name="Buttons" subtitle="Filled / tinted / gray / plain" width="720" -->
<style>…</style>
<div class="pud-pair">
  <div class="pud-theme"><span class="pud-label">Light</span>FRAGMENT</div>
  <div class="pud-theme pud-dark"><span class="pud-label">Dark</span>FRAGMENT</div>
</div>
<p class="pud-caption">REF</p>
```

Assumption recorded: the `@dsCard` marker is documented as `<!-- @dsCard group="…" -->`; `name`, `subtitle`, `width` are extra attributes the pane may ignore. Harmless if ignored.

`manifest.json`: `{ "components/button.html": "<sha256 hex>", "foundations/colors.html": "…", … }` — forward slashes, sorted keys.

---

### Task 1: Golden fixtures + token extraction

**Files:**
- Create: `SK/scripts/platform-tokens.mjs`
- Create: `SK/scripts/test/golden.test.mjs`
- Create: `SK/scripts/test/fixtures/golden/` (generated)
- Modify: `SK/scripts/make-artboards.mjs:33-208` (remove data), `:248-254` (remove helpers), add import

**Interfaces:**
- Produces: every export listed under "Shared interfaces" for `platform-tokens.mjs`.

- [ ] **Step 1: Capture golden output from the current, unmodified script**

```bash
S=plugins/platform-ui-design/skills/platform-ui-design/scripts
G=$S/test/fixtures/golden
mkdir -p $G
node $S/make-artboards.mjs --platform both --screens Main,Detail --out $G/both
node $S/make-artboards.mjs --platform windows --screens Main,Detail --chrome topbar --out $G/windows
node $S/make-artboards.mjs --platform ios --device ipad --screens Main --chrome none --out $G/ipad
for p in ios android windows; do
  node $S/make-artboards.mjs --tokens $p --format css  > $G/tokens-$p.css
  node $S/make-artboards.mjs --tokens $p --format json > $G/tokens-$p.json
done
ls -R $G
```

Expected: `both/` has `Main.dc.html DetailIOS.dc.html MainAndroid.dc.html DetailAndroid.dc.html canvas.json`; `windows/` and `ipad/` have their artboards + `canvas.json`; six token files.

- [ ] **Step 2: Write the golden test**

`SK/scripts/test/golden.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, "..", "make-artboards.mjs");
const GOLDEN = join(here, "fixtures", "golden");

function run(args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

const CASES = [
  ["both",    ["--platform", "both", "--screens", "Main,Detail"]],
  ["windows", ["--platform", "windows", "--screens", "Main,Detail", "--chrome", "topbar"]],
  ["ipad",    ["--platform", "ios", "--device", "ipad", "--screens", "Main", "--chrome", "none"]],
];

for (const [name, args] of CASES) {
  test(`artboards byte-identical to golden: ${name}`, () => {
    const out = mkdtempSync(join(tmpdir(), "pud-golden-"));
    try {
      run([...args, "--out", out]);
      const expected = readdirSync(join(GOLDEN, name)).sort();
      assert.deepEqual(readdirSync(out).sort(), expected);
      for (const f of expected) {
        assert.equal(readFileSync(join(out, f), "utf8"), readFileSync(join(GOLDEN, name, f), "utf8"), f);
      }
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
}

for (const p of ["ios", "android", "windows"]) {
  test(`--tokens ${p} css byte-identical`, () => {
    assert.equal(run(["--tokens", p, "--format", "css"]), readFileSync(join(GOLDEN, `tokens-${p}.css`), "utf8"));
  });
  test(`--tokens ${p} json byte-identical`, () => {
    assert.equal(run(["--tokens", p, "--format", "json"]), readFileSync(join(GOLDEN, `tokens-${p}.json`), "utf8"));
  });
}
```

- [ ] **Step 3: Run the golden test against the unmodified script — must pass**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/golden.test.mjs`
Expected: all 9 tests pass. (If not, the fixture capture and the test disagree — fix before touching the script.)

- [ ] **Step 4: Commit fixtures + test**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts/test
git commit -m "test: golden fixtures for make-artboards output

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Create `platform-tokens.mjs` by moving code**

Create `SK/scripts/platform-tokens.mjs` with this header, then **cut and paste** (do not retype) from `make-artboards.mjs`: the `DEVICES` const (lines 33–56), the `CHROME` comment+const (58–65), `resolveDevice` (67–73 incl. doc comment), the `TOKENS` const (76–208), and `cssVars` + `typeClasses` (249–254). Prefix each with `export`.

```js
/**
 * platform-tokens.mjs — the single source of platform metrics and tokens.
 *
 * Consumed by make-artboards.mjs (artboards, --tokens) and build-kit.mjs (Claude Design
 * kits). Pure data and pure helpers: no I/O, no argv. Provenance for every value is in
 * ../references/device-metrics.md, apple-foundations.md, android-foundations.md and
 * windows-fluent.md; values those files mark "convention (unverified)" are conventions here too.
 */

export const DEVICES = { /* moved verbatim */ };
export const CHROME  = { /* moved verbatim */ };
export function resolveDevice(platform, key) { /* moved verbatim */ }
export const TOKENS  = { /* moved verbatim */ };

export const PREFIX  = { ios: "ios", android: "md", windows: "win" };
/** Which token pair paints a card's surface and its text, per platform. */
export const SURFACE = {
  ios:     { bg: "bg",      fg: "label" },
  android: { bg: "surface", fg: "on-surface" },
  windows: { bg: "bg-base", fg: "text-primary" },
};

export const cssVars = (obj, prefix) =>
  Object.entries(obj).map(([k, v]) => `      --${prefix}-${k}: ${v};`).join("\n");
export const typeClasses = (type, prefix) =>
  type.map(([name, size, lh, weight]) =>
    `    .${prefix}-${name} { font-size: ${size}px; line-height: ${lh}px; font-weight: ${weight}; letter-spacing: 0; margin: 0; }`
  ).join("\n");
```

- [ ] **Step 6: Point `make-artboards.mjs` at the module**

In `make-artboards.mjs`, delete the moved blocks and add after the existing `import { join } from "node:path";`:

```js
import { DEVICES, CHROME, TOKENS, resolveDevice, cssVars, typeClasses } from "./platform-tokens.mjs";
```

Leave the `const p = key === "ios" ? "ios" : …` lines in place (they are fine; replacing them is not required for byte-identity and risks it). Update the file's doc comment: add one line `Metrics and tokens: ./platform-tokens.mjs`.

- [ ] **Step 7: Run golden test — must still pass**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/golden.test.mjs`
Expected: 9/9 pass. Any diff means something was retyped instead of moved — diff the failing file and fix.

- [ ] **Step 8: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts
git commit -m "refactor: extract platform tokens into platform-tokens.mjs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Token integrity tests

**Files:**
- Create: `SK/scripts/test/platform-tokens.test.mjs`

**Interfaces:**
- Consumes: `TOKENS`, `PREFIX`, `SURFACE`, `CHROME`, `DEVICES` from `platform-tokens.mjs`.

- [ ] **Step 1: Write the tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { TOKENS, PREFIX, SURFACE, CHROME, DEVICES } from "../platform-tokens.mjs";

const PLATFORMS = ["ios", "android", "windows"];

for (const p of PLATFORMS) {
  test(`${p}: light and dark define the same roles`, () => {
    assert.deepEqual(Object.keys(TOKENS[p].light).sort(), Object.keys(TOKENS[p].dark).sort());
  });
  test(`${p}: every color value is a hex or rgba literal`, () => {
    const ok = /^(#[0-9A-Fa-f]{6}|rgba\(\d+,\d+,\d+,[0-9.]+\))$/;
    for (const theme of ["light", "dark"])
      for (const [k, v] of Object.entries(TOKENS[p][theme]))
        assert.match(v, ok, `${p}.${theme}.${k} = ${v}`);
    assert.match(TOKENS[p].accentDefault, ok);
    assert.match(TOKENS[p].accentDark, ok);
  });
  test(`${p}: type ramp rows are [name, size, lineHeight, weight]`, () => {
    for (const row of TOKENS[p].type) {
      assert.equal(row.length, 4);
      assert.match(row[0], /^[a-z0-9-]+$/);
      assert.ok(row[1] > 0 && row[2] >= row[1], `${row[0]} line-height < size`);
      assert.ok([400, 500, 600, 700].includes(row[3]), `${row[0]} weight`);
    }
  });
  test(`${p}: SURFACE roles exist in the token set`, () => {
    assert.ok(TOKENS[p].light[SURFACE[p].bg], SURFACE[p].bg);
    assert.ok(TOKENS[p].light[SURFACE[p].fg], SURFACE[p].fg);
  });
  test(`${p}: PREFIX, CHROME and DEVICES present`, () => {
    assert.ok(PREFIX[p]);
    assert.ok(CHROME[p].topBar >= 0 && CHROME[p].margin > 0);
    assert.ok(Object.keys(DEVICES[p]).length >= 3);
  });
}
```

- [ ] **Step 2: Run**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/platform-tokens.test.mjs`
Expected: 15/15 pass. If a value fails the literal regex, that is a real data problem in the token table — report it; do not loosen the regex.

- [ ] **Step 3: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts/test/platform-tokens.test.mjs
git commit -m "test: platform token integrity

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Header parsing and fragment lint

**Files:**
- Create: `SK/scripts/lib/kit-lint.mjs`
- Create: `SK/scripts/test/kit-lint.test.mjs`

**Interfaces:**
- Produces:
  - `parseHeader(html) → { ok: true, fields: {slot?, group, title, subtitle?, ref?} } | { ok: false, reason }`
  - `lintFragment({ path, html, css, isComponent }) → Finding[]` where `Finding = { file, line, rule, detail }`
  - `lintKit({ kit, fragments }) → Finding[]` — cross-checks `kit.components[].slot` against fragment headers both ways. `fragments` is `Array<{ path, html, css? }>`.
  - Rule ids: `header-missing`, `header-field`, `color-literal`, `font-size`, `emoji`, `img-tag`, `slot-unknown`, `slot-missing`.

- [ ] **Step 1: Write failing tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHeader, lintFragment, lintKit } from "../lib/kit-lint.mjs";

const HDR = "<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled / plain · ref: apple-components.md §Buttons -->\n";
const rules = (f) => f.map(x => x.rule);

test("parseHeader reads all fields", () => {
  const r = parseHeader(HDR + "<section></section>");
  assert.equal(r.ok, true);
  assert.deepEqual(r.fields, { slot: "button", group: "Buttons", title: "Buttons", subtitle: "Filled / plain", ref: "apple-components.md §Buttons" });
});
test("parseHeader rejects a missing header", () => {
  assert.equal(parseHeader("<section></section>").ok, false);
});
test("parseHeader requires group and title", () => {
  assert.equal(parseHeader("<!-- slot: x · group: G -->\n").ok, false);
});

test("clean fragment has no findings", () => {
  const html = HDR + `<section class="pud-card"><button class="ios-btn ios-body" style="color: var(--ios-accent); background: transparent">Go</button>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16"/></svg></section>`;
  const css = ".ios-btn { min-height: 44px; color: inherit; border: 1px solid var(--ios-separator); }";
  assert.deepEqual(lintFragment({ path: "components/button.html", html, css, isComponent: true }), []);
});

test("hex literal in html is a finding with a line number", () => {
  const html = HDR + `<section>\n<div style="background: #FF0000">x</div></section>`;
  const f = lintFragment({ path: "components/a.html", html, isComponent: true });
  assert.deepEqual(rules(f), ["color-literal"]);
  assert.equal(f[0].line, 3);
  assert.equal(f[0].file, "components/a.html");
});
test("rgb() and named colors in css are findings; transparent/currentColor/inherit are not", () => {
  const css = ".a{color:rgb(1,2,3)}\n.b{color:white}\n.c{color:transparent;fill:currentColor;background:inherit}";
  const f = lintFragment({ path: "components/a.html", html: HDR + "<i></i>", css, isComponent: true });
  assert.deepEqual(f.map(x => [x.rule, x.line]), [["color-literal", 1], ["color-literal", 2]]);
  assert.equal(f[0].file, "components/a.css");
});
test("font-size is a finding", () => {
  const f = lintFragment({ path: "components/a.html", html: HDR + `<p style="font-size: 12px">x</p>`, isComponent: true });
  assert.deepEqual(rules(f), ["font-size"]);
});
test("emoji and img are findings", () => {
  const f = lintFragment({ path: "components/a.html", html: HDR + `<p>🚀</p>\n<img src="x.png">`, isComponent: true });
  assert.deepEqual(rules(f), ["emoji", "img-tag"]);
});
test("foundation cards skip the color rule but keep the others", () => {
  const html = "<!-- group: Foundations · title: Type -->\n<p style=\"color:#000\">x</p><img src=x>";
  assert.deepEqual(rules(lintFragment({ path: "foundations/type.html", html, isComponent: false })), ["img-tag"]);
});

test("lintKit cross-checks slots both ways", () => {
  const kit = { components: [{ slot: "button" }, { slot: "toggle" }] };
  const fragments = [
    { path: "components/button.html", html: HDR },
    { path: "components/fab.html", html: HDR.replace("slot: button", "slot: fab") },
  ];
  const f = lintKit({ kit, fragments });
  assert.deepEqual(f.map(x => [x.rule, x.detail]), [
    ["slot-missing", "toggle"],
    ["slot-unknown", "fab"],
  ]);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-lint.test.mjs`
Expected: FAIL — cannot find module `../lib/kit-lint.mjs`.

- [ ] **Step 3: Implement `kit-lint.mjs`**

```js
/**
 * kit-lint.mjs — pure checks for kit fragments. No I/O. Findings are { file, line, rule, detail }.
 */

const HEADER_RE = /^<!--\s*(.*?)\s*-->/;

export function parseHeader(html) {
  const m = html.match(HEADER_RE);
  if (!m) return { ok: false, reason: "first line must be a <!-- key: value · key: value --> header" };
  const fields = {};
  for (const part of m[1].split(" · ")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    fields[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  for (const req of ["group", "title"])
    if (!fields[req]) return { ok: false, reason: `header is missing "${req}"` };
  return { ok: true, fields };
}

// CSS named colors (the full CSS Color Level 4 list minus the three we allow).
const NAMED = new Set(("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(" "));

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_RE = /\b(?:rgba?|hsla?)\s*\(/i;
// A named color only counts as a value: after ":" (css/style) or inside fill=/stroke=/color= attributes.
const NAMED_RE = /(?::\s*|\b(?:fill|stroke|color)\s*=\s*["']?)([a-zA-Z]+)\b/g;

function colorLiteralOnLine(line) {
  if (HEX_RE.test(line)) return "hex literal";
  if (FUNC_RE.test(line)) return "rgb()/hsl() literal";
  for (const m of line.matchAll(NAMED_RE)) {
    if (NAMED.has(m[1].toLowerCase())) return `named color "${m[1]}"`;
  }
  return null;
}

const EMOJI_RE = /\p{Extended_Pictographic}/u;
const IMG_RE = /<img\b/i;
const FONT_SIZE_RE = /font-size\s*:/i;

function scan(text, file, isComponent, findings) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const n = i + 1;
    if (isComponent) {
      const c = colorLiteralOnLine(line);
      if (c) findings.push({ file, line: n, rule: "color-literal", detail: c });
    }
    if (FONT_SIZE_RE.test(line)) findings.push({ file, line: n, rule: "font-size", detail: "use a type-ramp class" });
    if (EMOJI_RE.test(line)) findings.push({ file, line: n, rule: "emoji", detail: "icons are inline SVG" });
    if (IMG_RE.test(line)) findings.push({ file, line: n, rule: "img-tag", detail: "icons are inline SVG" });
  });
}

export function lintFragment({ path, html, css, isComponent }) {
  const findings = [];
  const h = parseHeader(html);
  if (!h.ok) findings.push({ file: path, line: 1, rule: "header-missing", detail: h.reason });
  else if (isComponent && !h.fields.slot) findings.push({ file: path, line: 1, rule: "header-field", detail: 'component header needs "slot"' });
  scan(html, path, isComponent, findings);
  if (css != null) scan(css, path.replace(/\.html$/, ".css"), isComponent, findings);
  return findings;
}

export function lintKit({ kit, fragments }) {
  const findings = [];
  const declared = new Set((kit.components ?? []).map(c => c.slot));
  const found = new Map();
  for (const f of fragments) {
    const h = parseHeader(f.html);
    if (h.ok && h.fields.slot) found.set(h.fields.slot, f.path);
  }
  for (const slot of declared)
    if (!found.has(slot)) findings.push({ file: "kit.json", line: 0, rule: "slot-missing", detail: slot });
  for (const [slot, path] of found)
    if (!declared.has(slot)) findings.push({ file: path, line: 1, rule: "slot-unknown", detail: slot });
  return findings;
}
```

- [ ] **Step 4: Run tests — pass**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-lint.test.mjs`
Expected: 10/10 pass. Note the `foundation` test: header there has no `slot`, `isComponent: false`, so only `img-tag` fires.

- [ ] **Step 5: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts/lib/kit-lint.mjs plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-lint.test.mjs
git commit -m "feat(kit): fragment header parser and lint rules

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Card wrapper and generated Colors card

**Files:**
- Create: `SK/scripts/lib/kit-wrap.mjs`
- Create: `SK/scripts/test/kit-wrap.test.mjs`

**Interfaces:**
- Consumes: `TOKENS`, `PREFIX`, `SURFACE`, `typeClasses`, `cssVars` from `platform-tokens.mjs`; `parseHeader` from `kit-lint.mjs`.
- Produces:
  - `tokenStyle(platform) → string` — CSS: `:root{…light…}`, `.pud-dark{…dark…}`, type ramp classes, `--pud-on-accent`.
  - `baseCardCss(platform) → string` — the `.pud-*` layout rules.
  - `wrapCard({ platform, header, body, css, width }) → string` — a complete card file. `header` is the parsed `fields` object.
  - `colorsCard(platform) → { header, body }` — generated Colors foundation.
  - `dsCardComment(fields, width) → string` — the first line.

- [ ] **Step 1: Write failing tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenStyle, baseCardCss, wrapCard, colorsCard, dsCardComment } from "../lib/kit-wrap.mjs";
import { TOKENS } from "../platform-tokens.mjs";

test("dsCardComment escapes quotes and carries width", () => {
  assert.equal(
    dsCardComment({ group: "Buttons", title: 'Say "hi"', subtitle: "A / B" }, 720),
    '<!-- @dsCard group="Buttons" name="Say &quot;hi&quot;" subtitle="A / B" width="720" -->'
  );
});

test("tokenStyle has light on :root, dark on .pud-dark, and the ramp", () => {
  const s = tokenStyle("ios");
  assert.match(s, /:root \{[^}]*--ios-label: #000000;/);
  assert.match(s, /\.pud-dark \{[^}]*--ios-label: #FFFFFF;/);
  assert.match(s, /--ios-accent: #007AFF;[\s\S]*\.pud-dark \{[^}]*--ios-accent: #0A84FF;/);
  assert.match(s, /\.ios-body \{ font-size: 17px;/);
  assert.match(s, /--pud-on-accent: #FFFFFF;/);
  assert.match(s, /--ios-font: -apple-system/);
});

test("wrapCard produces the documented structure", () => {
  const out = wrapCard({
    platform: "android",
    header: { group: "Buttons", title: "Buttons", subtitle: "Filled", ref: "android-components.md §Buttons" },
    body: "<section class=\"pud-card\"><button class=\"md-btn md-label-large\">Go</button></section>",
    css: ".md-btn { min-height: 48px; }",
    width: 720,
  });
  const lines = out.split("\n");
  assert.equal(lines[0], '<!-- @dsCard group="Buttons" name="Buttons" subtitle="Filled" width="720" -->');
  assert.match(out, /<style>[\s\S]*--md-primary: #6750A4;[\s\S]*\.md-btn \{ min-height: 48px; \}[\s\S]*<\/style>/);
  assert.equal((out.match(/<section class="pud-card">/g) ?? []).length, 2, "fragment appears twice");
  assert.match(out, /<div class="pud-theme"><span class="pud-label">Light<\/span>/);
  assert.match(out, /<div class="pud-theme pud-dark"><span class="pud-label">Dark<\/span>/);
  assert.match(out, /<p class="pud-caption">Source: android-components.md §Buttons<\/p>\s*$/);
});

test("wrapCard without ref omits the caption", () => {
  const out = wrapCard({ platform: "ios", header: { group: "G", title: "T" }, body: "<i></i>", width: 720 });
  assert.doesNotMatch(out, /pud-caption/);
});

test("colorsCard lists every role with light and dark values", () => {
  const { header, body } = colorsCard("windows");
  assert.equal(header.group, "Foundations");
  assert.equal(header.title, "Colors");
  for (const [role, v] of Object.entries(TOKENS.windows.light)) {
    assert.ok(body.includes(`--win-${role}`), role);
    assert.ok(body.includes(v), `${role} light value`);
    assert.ok(body.includes(TOKENS.windows.dark[role]), `${role} dark value`);
  }
  assert.ok(body.includes("#0067C0") && body.includes("#60CDFF"), "accent both themes");
});

test("baseCardCss paints the card surface from the platform's SURFACE pair", () => {
  assert.match(baseCardCss("ios"), /\.pud-theme \{[^}]*background: var\(--ios-bg\);[^}]*color: var\(--ios-label\);/);
  assert.match(baseCardCss("android"), /background: var\(--md-surface\);[^}]*color: var\(--md-on-surface\);/);
});
```

- [ ] **Step 2: Run — fails on missing module**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-wrap.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement `kit-wrap.mjs`**

```js
/**
 * kit-wrap.mjs — turn a fragment into a complete, self-contained Claude Design card.
 * Pure functions; no I/O.
 */
import { TOKENS, PREFIX, SURFACE, cssVars, typeClasses } from "../platform-tokens.mjs";

const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export function dsCardComment(fields, width) {
  const parts = [`group="${attr(fields.group)}"`, `name="${attr(fields.title)}"`];
  if (fields.subtitle) parts.push(`subtitle="${attr(fields.subtitle)}"`);
  parts.push(`width="${width}"`);
  return `<!-- @dsCard ${parts.join(" ")} -->`;
}

export function tokenStyle(platform) {
  const t = TOKENS[platform];
  const p = PREFIX[platform];
  return [
    `:root {`,
    cssVars(t.light, p),
    `      --${p}-accent: ${t.accentDefault};`,
    `      --${p}-font: ${t.font};`,
    `      --pud-on-accent: #FFFFFF;`,
    `}`,
    `.pud-dark {`,
    cssVars(t.dark, p),
    `      --${p}-accent: ${t.accentDark};`,
    `}`,
    typeClasses(t.type, p),
  ].join("\n");
}

export function baseCardCss(platform) {
  const p = PREFIX[platform];
  const s = SURFACE[platform];
  return `
.pud-pair { display: flex; gap: 24px; align-items: flex-start; font-family: var(--${p}-font); -webkit-font-smoothing: antialiased; }
.pud-theme { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: 24px; border-radius: 12px; background: var(--${p}-${s.bg}); color: var(--${p}-${s.fg}); }
.pud-label { align-self: flex-end; font: 500 11px/16px var(--${p}-font); letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.55; }
.pud-card { display: flex; flex-direction: column; gap: 16px; }
.pud-variants { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.pud-stack { display: flex; flex-direction: column; gap: 12px; }
.pud-note { opacity: 0.7; }
.pud-caption { margin: 12px 0 0; font: 400 12px/16px var(--${p}-font); opacity: 0.6; }
.pud-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.pud-swatch { display: flex; flex-direction: column; gap: 6px; }
.pud-swatch > i { display: block; height: 40px; border-radius: 8px; border: 1px solid rgba(127,127,127,0.25); }
.pud-swatch > b { font: 500 12px/16px var(--${p}-font); }
.pud-swatch > small { font: 400 11px/14px var(--${p}-font); opacity: 0.7; word-break: break-all; }
`.trim();
}

export function wrapCard({ platform, header, body, css = "", width }) {
  const themed = (cls) => `<div class="${cls}"><span class="pud-label">${cls.includes("pud-dark") ? "Dark" : "Light"}</span>\n${body}\n</div>`;
  const caption = header.ref ? `\n<p class="pud-caption">Source: ${header.ref}</p>` : "";
  return [
    dsCardComment(header, width),
    `<style>`,
    tokenStyle(platform),
    baseCardCss(platform),
    css.trim(),
    `</style>`,
    `<div class="pud-pair">`,
    themed("pud-theme"),
    themed("pud-theme pud-dark"),
    `</div>${caption}`,
    ``,
  ].join("\n");
}

export function colorsCard(platform) {
  const t = TOKENS[platform];
  const p = PREFIX[platform];
  const rows = [
    ...Object.keys(t.light).map(role => [`--${p}-${role}`, t.light[role], t.dark[role]]),
    [`--${p}-accent`, t.accentDefault, t.accentDark],
  ];
  const swatches = rows.map(([v, l, d]) =>
    `<div class="pud-swatch"><i style="background: var(${v})"></i><b>${v}</b><small>${l} · ${d}</small></div>`
  ).join("\n");
  return {
    header: { group: "Foundations", title: "Colors", subtitle: `${rows.length} semantic roles, light and dark`, ref: `${platform === "ios" ? "apple" : platform}-foundations.md §Color`.replace("windows-foundations", "windows-fluent") },
    body: `<section class="pud-card"><div class="pud-swatches">\n${swatches}\n</div></section>`,
  };
}
```

- [ ] **Step 4: Run — pass**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-wrap.test.mjs`
Expected: 6/6 pass.

- [ ] **Step 5: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts/lib/kit-wrap.mjs plugins/platform-ui-design/skills/platform-ui-design/scripts/test/kit-wrap.test.mjs
git commit -m "feat(kit): card wrapper and generated Colors card

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: `build-kit.mjs` CLI — load, lint, write, manifest, `--check`

**Files:**
- Create: `SK/scripts/build-kit.mjs`
- Create: `SK/scripts/test/build-kit.test.mjs`
- Create: `SK/scripts/test/fixtures/kit-good/{kit.json,foundations/type.html,components/button.html,components/button.css}`
- Create: `SK/scripts/test/fixtures/kit-bad/{kit.json,components/button.html}`

**Interfaces:**
- Consumes: `lintFragment`, `lintKit`, `parseHeader` (Task 3); `wrapCard`, `colorsCard` (Task 4).
- Produces: CLI `node build-kit.mjs --platform ios|android|windows|all --out <dir> [--check] [--kits <dir>]`. `--kits` overrides the kits root (default `<script dir>/../kits`) — exists so tests can point at fixtures.

- [ ] **Step 1: Create the good fixture kit**

`fixtures/kit-good/kit.json`:

```json
{
  "platform": "ios",
  "projectName": "Platform UI · iOS",
  "defaultWidth": 720,
  "foundations": [
    { "id": "colors", "group": "Foundations", "title": "Colors", "subtitle": "x", "generated": true },
    { "id": "type", "group": "Foundations", "title": "Type ramp", "subtitle": "x" }
  ],
  "components": [ { "slot": "button" } ]
}
```

`fixtures/kit-good/foundations/type.html`:

```html
<!-- group: Foundations · title: Type ramp · subtitle: 11 styles · ref: apple-foundations.md §Typography -->
<section class="pud-card"><p class="ios-body">Body 17/22</p></section>
```

`fixtures/kit-good/components/button.html`:

```html
<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled · ref: apple-components.md §Buttons -->
<section class="pud-card"><div class="pud-variants"><button class="ios-btn ios-headline" type="button">Continue</button></div></section>
```

`fixtures/kit-good/components/button.css`:

```css
.ios-btn { min-height: 44px; padding: 0 20px; border: 0; border-radius: 12px; background: var(--ios-accent); color: var(--pud-on-accent); }
```

`fixtures/kit-bad/kit.json`: same as good but `"components": [ { "slot": "button" }, { "slot": "toggle" } ]` and no `foundations` entry for type (only colors).

`fixtures/kit-bad/components/button.html`:

```html
<!-- slot: button · group: Buttons · title: Buttons -->
<section><button style="background: #FF0000; font-size: 12px">🚀</button><img src="a.png"></section>
```

- [ ] **Step 2: Write failing tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, "..", "build-kit.mjs");
const FX = join(here, "fixtures");
const run = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
const tmp = () => mkdtempSync(join(tmpdir(), "pud-kit-"));
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

test("bad args exit 2", () => {
  assert.equal(run(["--platform", "amiga", "--out", "x"]).status, 2);
  assert.equal(run(["--out", "x"]).status, 2, "missing --platform");
  const r = run(["--platform", "ios", "--kits", join(FX, "nope"), "--out", "x"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /kit\.json/);
});

test("good kit builds: cards, manifest, exit 0", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(readdirSync(out).sort(), ["components", "foundations", "manifest.json"]);
  assert.deepEqual(readdirSync(join(out, "components")), ["button.html"]);
  assert.deepEqual(readdirSync(join(out, "foundations")).sort(), ["colors.html", "type.html"]);
  const card = readFileSync(join(out, "components", "button.html"), "utf8");
  assert.match(card.split("\n")[0], /^<!-- @dsCard group="Buttons" name="Buttons" subtitle="Filled" width="720" -->$/);
  assert.match(card, /\.ios-btn \{ min-height: 44px;/);
  const manifest = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"));
  assert.deepEqual(Object.keys(manifest), ["components/button.html", "foundations/colors.html", "foundations/type.html"]);
  for (const [p, h] of Object.entries(manifest))
    assert.equal(h, sha(readFileSync(join(out, p))), p);
  // no color literal in the built component outside the generated <style> token block
  const afterStyle = card.slice(card.indexOf("</style>"));
  assert.doesNotMatch(afterStyle, /#[0-9a-fA-F]{6}\b/);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("bad kit: lint findings on stderr, exit 1, nothing written", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-bad"), "--out", out]);
  assert.equal(r.status, 1);
  for (const rule of ["color-literal", "font-size", "emoji", "img-tag", "slot-missing"])
    assert.match(r.stderr, new RegExp(rule), rule);
  assert.match(r.stderr, /components\/button\.html:2: color-literal/);
  assert.equal(existsSync(out), false);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("--check writes nothing and exits 0 on a good kit", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out, "--check"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(out), false);
  assert.match(r.stdout, /render check skipped|render check: 0 errors/);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("rebuild replaces the bundle atomically (no stale files)", () => {
  const out = join(tmp(), "kit-ios");
  run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  const stale = join(out, "components", "stale.html");
  writeFileSync(stale, "stale");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(stale), false);
  rmSync(dirname(out), { recursive: true, force: true });
});
```

(Add `writeFileSync` to the `node:fs` import at the top of the file.)

- [ ] **Step 3: Run — fails**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/build-kit.test.mjs`
Expected: FAIL (script missing).

- [ ] **Step 4: Implement `build-kit.mjs`**

```js
#!/usr/bin/env node
/**
 * build-kit.mjs — assemble a platform kit for Claude Design from kits/<platform>/.
 *
 *   node build-kit.mjs --platform ios|android|windows|all --out <dir> [--check] [--kits <dir>]
 *
 * Reads kit.json + fragments, lints them (see lib/kit-lint.mjs), wraps each into a complete
 * @dsCard HTML file (see lib/kit-wrap.mjs), and writes <out>/components, <out>/foundations
 * and <out>/manifest.json ({ path: sha256 }). Writes go to a temp dir and are renamed into
 * place, so <out> is never half-written. --check does everything except the final write.
 *
 * Exit codes: 0 ok · 1 lint failure · 2 bad arguments or missing kit.json.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lintFragment, lintKit, parseHeader } from "./lib/kit-lint.mjs";
import { wrapCard, colorsCard } from "./lib/kit-wrap.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
function die(msg, code) { console.error(`error: ${msg}`); process.exit(code); }

const PLATFORMS = ["ios", "android", "windows"];
const platformArg = arg("platform");
if (!platformArg || platformArg === true) die("--platform is required (ios, android, windows or all)", 2);
const platforms = platformArg === "all" ? PLATFORMS : [String(platformArg).toLowerCase()];
if (!platforms.every(p => PLATFORMS.includes(p))) die("--platform must be ios, android, windows or all", 2);
const outArg = arg("out");
if (!outArg || outArg === true) die("--out is required", 2);
const check = arg("check") === true;
const kitsRoot = resolve(String(arg("kits", join(here, "..", "kits"))));

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const read = (p) => readFileSync(p, "utf8");

function loadKit(platform) {
  // When --kits points at a single kit (fixture), use it directly; otherwise kits/<platform>.
  const dir = existsSync(join(kitsRoot, "kit.json")) ? kitsRoot : join(kitsRoot, platform);
  const kitPath = join(dir, "kit.json");
  if (!existsSync(kitPath)) die(`no kit.json for ${platform} — expected ${kitPath}`, 2);
  const kit = JSON.parse(read(kitPath));
  const compDir = join(dir, "components");
  const fragments = existsSync(compDir)
    ? readdirSync(compDir).filter(f => f.endsWith(".html")).sort().map(f => {
        const cssPath = join(compDir, f.replace(/\.html$/, ".css"));
        return { path: `components/${f}`, html: read(join(compDir, f)), css: existsSync(cssPath) ? read(cssPath) : undefined };
      })
    : [];
  const foundDir = join(dir, "foundations");
  const foundations = (kit.foundations ?? []).map(meta => {
    if (meta.generated) return { meta, path: `foundations/${meta.id}.html`, generated: true };
    const p = join(foundDir, `${meta.id}.html`);
    if (!existsSync(p)) die(`foundation "${meta.id}" declared in kit.json but ${p} is missing`, 2);
    return { meta, path: `foundations/${meta.id}.html`, html: read(p) };
  });
  return { kit, fragments, foundations };
}

function buildPlatform(platform) {
  const { kit, fragments, foundations } = loadKit(platform);
  const findings = [
    ...fragments.flatMap(f => lintFragment({ ...f, isComponent: true })),
    ...foundations.filter(f => !f.generated).flatMap(f => lintFragment({ path: f.path, html: f.html, isComponent: false })),
    ...lintKit({ kit, fragments }),
  ];
  if (findings.length) {
    for (const f of findings) console.error(`${f.file}:${f.line}: ${f.rule} — ${f.detail}`);
    return { ok: false };
  }
  const widthFor = (slot) => (kit.components.find(c => c.slot === slot)?.width) ?? kit.defaultWidth ?? 720;
  const files = new Map();
  for (const f of fragments) {
    const { fields } = parseHeader(f.html);
    const body = f.html.replace(/^<!--[\s\S]*?-->\r?\n?/, "");
    files.set(f.path, wrapCard({ platform, header: fields, body, css: f.css, width: widthFor(fields.slot) }));
  }
  for (const f of foundations) {
    const width = f.meta.width ?? kit.defaultWidth ?? 720;
    if (f.generated) {
      const { header, body } = colorsCard(platform);
      files.set(f.path, wrapCard({ platform, header: { ...header, ...pick(f.meta, ["group", "title", "subtitle"]) }, body, width }));
    } else {
      const { fields } = parseHeader(f.html);
      const body = f.html.replace(/^<!--[\s\S]*?-->\r?\n?/, "");
      files.set(f.path, wrapCard({ platform, header: { ...pick(f.meta, ["group", "title", "subtitle"]), ...fields }, body, width }));
    }
  }
  const manifest = {};
  for (const p of [...files.keys()].sort()) manifest[p] = sha(files.get(p));
  files.set("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  return { ok: true, files, kit };
}

function pick(o, keys) { const r = {}; for (const k of keys) if (o[k] != null) r[k] = o[k]; return r; }

function writeBundle(outDir, files) {
  const parent = dirname(resolve(outDir));
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  const tmp = mkdtempSync(join(parent, ".kit-tmp-"));
  for (const [p, content] of files) {
    const full = join(tmp, p);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
  }
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  renameSync(tmp, outDir);
}

async function renderCheck(files) {
  let pw;
  try { pw = await import("playwright"); } catch { console.log("render check skipped (playwright not importable)"); return 0; }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  let errors = 0;
  page.on("pageerror", e => { errors++; console.error(`render: ${e.message}`); });
  page.on("console", m => { if (m.type() === "error") { errors++; console.error(`render: ${m.text()}`); } });
  for (const [p, html] of files) if (p.endsWith(".html")) await page.setContent(html, { waitUntil: "load" });
  await browser.close();
  console.log(`render check: ${errors} errors`);
  return errors;
}

let failed = false;
for (const platform of platforms) {
  const outDir = platforms.length > 1 ? join(String(outArg), `kit-${platform}`) : String(outArg);
  const r = buildPlatform(platform);
  if (!r.ok) { failed = true; continue; }
  const cards = [...r.files.keys()].filter(p => p.endsWith(".html")).length;
  if (check) {
    const errs = await renderCheck(r.files);
    if (errs) failed = true;
    console.log(`ok: ${platform} — ${cards} cards lint clean (check only, nothing written)`);
  } else {
    writeBundle(outDir, r.files);
    console.log(`ok: ${platform} — ${cards} cards -> ${outDir}`);
    console.log(`    project: ${r.kit.projectName}   next: see references/design-system-sync.md`);
  }
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 5: Run — pass**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test/build-kit.test.mjs`
Expected: 5/5 pass. If the "bad kit" test doesn't see `slot-missing`, confirm `kit-bad/kit.json` declares `toggle`.

- [ ] **Step 6: Run the whole suite**

Run: `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/scripts
git commit -m "feat(kit): build-kit.mjs — lint, wrap, atomic bundle, manifest, --check

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: iOS kit — `kit.json` + foundations

**Files:**
- Create: `SK/kits/ios/kit.json`
- Create: `SK/kits/ios/foundations/type.html`, `spacing-shape.html`, `chrome-metrics.html`

**Interfaces:**
- Consumes: `build-kit.mjs --platform ios --check`; numbers from `SK/references/apple-foundations.md` and `device-metrics.md`.

- [ ] **Step 1: Write `kit.json`** — exactly the schema block in "Shared interfaces" with `"platform": "ios"`, `"projectName": "Platform UI · iOS"`, foundation subtitles `"Semantic roles, light and dark"`, `"11 text styles, Dynamic Type default"`, `"Margins, 8 pt rhythm, concentric radii"`, `"Bars, safe areas, size classes"`, chrome-metrics width 393, `top-chrome` and `primary-nav` width 393.

- [ ] **Step 2: Write `foundations/type.html`** — one row per ramp entry, each row uses its own class so the card *is* the ramp:

```html
<!-- group: Foundations · title: Type ramp · subtitle: 11 text styles, Dynamic Type default · ref: apple-foundations.md §Typography -->
<section class="pud-card pud-stack">
  <p class="ios-large-title">Large Title · 34/41</p>
  <p class="ios-title1">Title 1 · 28/34</p>
  <p class="ios-title2">Title 2 · 22/28</p>
  <p class="ios-title3">Title 3 · 20/25</p>
  <p class="ios-headline">Headline · 17/22 semibold</p>
  <p class="ios-body">Body · 17/22</p>
  <p class="ios-callout">Callout · 16/21</p>
  <p class="ios-subheadline">Subheadline · 15/20</p>
  <p class="ios-footnote">Footnote · 13/18</p>
  <p class="ios-caption1">Caption 1 · 12/16</p>
  <p class="ios-caption2">Caption 2 · 11/13</p>
  <p class="ios-footnote pud-note">Sizes are the Large (default) Dynamic Type setting. Use the style, never the number; the OS rescales to 310 % at AX5.</p>
</section>
```

- [ ] **Step 3: Write `foundations/spacing-shape.html`** — a labelled ruler of the values the artboard scaffold uses, sourced from `CHROME.ios` and `apple-foundations.md`: margin 16 (compact) / 20 (regular), 8 pt rhythm, row 44, radius 10 with the concentric rule stated; plus four boxes showing radius 10 / 14 / 20 / continuous. Use `var(--ios-fill)` for box backgrounds and `var(--ios-separator)` for rules. Mark the margin values "convention (unverified)" exactly as `device-metrics.md` does.

- [ ] **Step 4: Write `foundations/chrome-metrics.html`** — a 393-wide diagram: stacked blocks labelled `Status / safe area 59`, `Navigation bar 44`, `Large title 96`, `Content`, `Tab bar 49`, `Home indicator 34`, each block's `height:` set to that many px via inline `style="height: 44px"` (pixel heights are allowed; only colors and font-size are linted) and a list of the size-class breakpoints underneath.

- [ ] **Step 5: Build-check**

Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --check`
Expected: exit 1 with `slot-missing` for all 12 slots (components don't exist yet) and **no other findings**. Foundations are clean.

- [ ] **Step 6: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/kits/ios
git commit -m "feat(kit): iOS kit.json and foundation cards

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: iOS components 1–6

**Files:**
- Create: `SK/kits/ios/components/{top-chrome,primary-nav,button,icon-button,fab,list-row}.html` and `.css`

**Interfaces:**
- Consumes: ramp classes `.ios-*`, tokens `--ios-*`, `--pud-on-accent`; `apple-components.md` for anatomy.

Author each fragment to this table. `button` is given in full as the pattern; the others follow it.

| Slot | Must show | Metrics (px) | Tokens |
|---|---|---|---|
| `top-chrome` | Standard nav bar (back chevron + "Back", centered title, trailing "Done"); large-title variant below it | bar 44; large-title area 52 under it (total 96); side margin 16; chevron SVG 24 grid | bg `--ios-chrome`, hairline `--ios-separator`, title `--ios-label`, actions `--ios-accent` |
| `primary-nav` | Tab bar with 4 tabs, 2nd selected; a 5-tab variant; a "6 tabs → More" note | bar 49; icon 24 + label `.ios-caption2` (11); each tab min 44 tall | selected `--ios-accent`, others `--ios-gray` |
| `button` | filled / tinted / gray / plain; small / medium / large; disabled | height 44 (small 28, large 50); radius 12 (14 large); padding 0 20 | filled bg `--ios-accent` text `--pud-on-accent`; tinted `color-mix(in srgb, var(--ios-accent) 15%, transparent)`; gray `--ios-fill` |
| `icon-button` | plain glyph button, bordered variant, destructive | 44×44 target; glyph 24; radius 22 | glyph `--ios-accent`; destructive `--ios-red` |
| `fab` | No component. Card body: a 393-wide nav bar with a trailing "+" action and a note "iOS has no FAB — primary creation lives in the navigation bar (trailing) or a toolbar." | nav bar 44 | as `top-chrome` |
| `list-row` | Inset-grouped group of four rows: plain, subtitle, detail (value trailing), chevron; a section header | row 44 (subtitle 58); group radius 10; margin 16; hairline inset 16 | group bg `--ios-bg-grouped-secondary` on `--ios-bg-grouped`; secondary text `--ios-label-secondary`; chevron `--ios-label-tertiary` |

- [ ] **Step 1: `button.html`**

```html
<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled / tinted / gray / plain · small, medium, large · ref: apple-components.md §Buttons -->
<section class="pud-card">
  <div class="pud-variants">
    <button class="ios-btn ios-btn--filled ios-headline" type="button">Continue</button>
    <button class="ios-btn ios-btn--tinted ios-headline" type="button">Continue</button>
    <button class="ios-btn ios-btn--gray ios-headline" type="button">Continue</button>
    <button class="ios-btn ios-btn--plain ios-headline" type="button">Continue</button>
  </div>
  <div class="pud-variants">
    <button class="ios-btn ios-btn--filled ios-btn--small ios-subheadline" type="button">Small</button>
    <button class="ios-btn ios-btn--filled ios-headline" type="button">Medium</button>
    <button class="ios-btn ios-btn--filled ios-btn--large ios-headline" type="button">Large</button>
    <button class="ios-btn ios-btn--filled ios-headline" type="button" disabled>Disabled</button>
  </div>
  <p class="ios-footnote pud-note">44 pt minimum target (28 pt floor for small). One filled button per screen. Titles are verbs.</p>
</section>
```

- [ ] **Step 2: `button.css`**

```css
.ios-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px; padding: 0 20px; border: 0; border-radius: 12px; font-family: inherit; color: var(--ios-accent); background: transparent; cursor: pointer; }
.ios-btn--filled { background: var(--ios-accent); color: var(--pud-on-accent); }
.ios-btn--tinted { background: color-mix(in srgb, var(--ios-accent) 15%, transparent); }
.ios-btn--gray { background: var(--ios-fill); }
.ios-btn--small { min-height: 28px; padding: 0 12px; border-radius: 14px; }
.ios-btn--large { min-height: 50px; padding: 0 24px; border-radius: 14px; }
.ios-btn:disabled { opacity: 0.35; cursor: default; }
.ios-btn:active { opacity: 0.7; }
```

- [ ] **Step 3: Author the other five** to the table. Shared rules: every fragment's root is `<section class="pud-card">`; bars are `width: 393px` blocks (`style="width: 393px"` is fine); every SVG is `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">`; labels are literal text.

- [ ] **Step 4: Build-check**

Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --check`
Expected: exit 1 listing only `slot-missing` for `text-field, toggle, selection, sheet-dialog, search, feedback`. Fix any lint finding on the six new files before committing.

- [ ] **Step 5: Eyeball one card** — build to a scratch dir and open the button card in the in-app browser:

Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out /tmp/kit-ios-wip` — expect exit 1 (slots missing) so instead temporarily comment nothing: use the fixture trick — copy the six fragments into a temp kit dir with a `kit.json` listing only those six slots, build, and open `components/button.html`. Confirm: light and dark halves, four button styles, disabled at 35 %.

- [ ] **Step 6: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/kits/ios/components
git commit -m "feat(kit): iOS components — chrome, nav, buttons, list rows

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: iOS components 7–12

**Files:**
- Create: `SK/kits/ios/components/{text-field,toggle,selection,sheet-dialog,search,feedback}.html` and `.css`

| Slot | Must show | Metrics (px) | Tokens |
|---|---|---|---|
| `text-field` | rounded-rect field with placeholder; filled with clear (×) button; focused; error line | height 44; radius 10; padding 0 12; clear glyph 17 in a 44 target | bg `--ios-fill-secondary`; placeholder `--ios-label-tertiary`; error `--ios-red` |
| `toggle` | on / off / disabled, each in a 44-tall list row with label | track 51×31, knob 27, radius 15.5 | on `--ios-green`; off `--ios-fill`; knob `--ios-bg` (white) |
| `selection` | segmented control, 3 segments, 2nd selected; 2-segment variant | height 32; radius 9; segment radius 7; padding 2 | bg `--ios-fill`; selected `--ios-bg-grouped-secondary` |
| `sheet-dialog` | alert (title, message, Cancel / OK stacked bottom, hairlines); action sheet (3 actions + Cancel); bottom sheet with 36×5 grabber | alert width 270, radius 14, button rows 44; action sheet rows 57, radius 13; grabber top 5 | alert bg `--ios-bg-grouped-secondary`; destructive `--ios-red` |
| `search` | search bar inside a nav bar (magnifier + placeholder + mic), active state with Cancel | field 36; radius 10; nav bar 44 + field row 52 | field bg `--ios-fill`; icons `--ios-label-secondary` |
| `feedback` | linear progress (determinate), spinner (8-spoke SVG), plus a note: "No toasts on iOS — use inline status, an alert, or a sheet." | bar 4 tall, radius 2; spinner 20 | track `--ios-fill`; fill `--ios-accent` |

- [ ] **Step 1: Author the six fragments** to the table, same conventions as Task 7.

- [ ] **Step 2: Build-check — clean**

Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --check`
Expected: `ok: ios — 16 cards lint clean (check only, nothing written)`, exit 0.

- [ ] **Step 3: Build and inspect all cards**

Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out /tmp/kit-ios`
Open each `components/*.html` and `foundations/*.html` in the in-app browser (`mcp__Claude_Browser__navigate` to `file:///tmp/kit-ios/components/button.html` etc.). Check: both halves render, nothing clips at 720 (or 393 for chrome cards), dark half has no white-on-white.

- [ ] **Step 4: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/kits/ios
git commit -m "feat(kit): iOS components — fields, toggles, sheets, search, feedback

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Android kit — `kit.json` + foundations

**Files:**
- Create: `SK/kits/android/kit.json`, `foundations/{type,spacing-shape,chrome-metrics}.html`

- [ ] **Step 1: `kit.json`** — schema block with `"platform": "android"`, `"projectName": "Platform UI · Android"`; foundation subtitles `"48 color roles, light and dark"`, `"15 styles, Material 3 type scale"`, `"4 dp grid, shape scale 4/8/12/16/28"`, `"Bars, insets, window size classes"`; chrome-metrics / `top-chrome` / `primary-nav` width 412.

- [ ] **Step 2: `foundations/type.html`** — 15 rows, one per `.md-*` class (`display-large 57/64` … `label-small 11/16`), header `ref: android-foundations.md §Typography`; note: "`sp` for text, `dp` for everything else; non-linear scaling on Android 14+."

- [ ] **Step 3: `foundations/spacing-shape.html`** — margins 16 (compact) / 24 (medium+), 4 dp grid with 8 dp component rhythm, row 56, and five boxes for the shape scale 4 / 8 / 12 / 16 / 28 with names extra-small … extra-large. Box bg `--md-surface-container-high`, border `--md-outline-variant`.

- [ ] **Step 4: `foundations/chrome-metrics.html`** — 412-wide stack: `Status bar 24`, `Top app bar 64`, `Medium top app bar 112`, `Content`, `Navigation bar 80`, `Gesture inset 24`; underneath, the window size classes `compact <600 · medium 600–839 · expanded 840–1199 · large 1200–1599 · extra-large ≥1600` and `rail 80 wide`.

- [ ] **Step 5: Build-check** — expect only 12 `slot-missing` findings.

- [ ] **Step 6: Commit** — `feat(kit): Android kit.json and foundation cards`.

---

### Task 10: Android components 1–6

**Files:**
- Create: `SK/kits/android/components/{top-chrome,primary-nav,button,icon-button,fab,list-row}.html` and `.css`

| Slot | Must show | Metrics (dp→px) | Tokens |
|---|---|---|---|
| `top-chrome` | small top app bar (nav icon, title, 2 actions + overflow); center-aligned; medium (title on second line) | small 64; medium 112; icons 48 targets with 24 glyphs; margin 16; title `.md-title-large` | bg `--md-surface`; scrolled `--md-surface-container`; icons `--md-on-surface-variant` |
| `primary-nav` | navigation bar, 4 destinations, 2nd active (pill indicator 64×32); navigation rail (80 wide) with FAB slot and 4 destinations | bar 80; rail 80; icon 24; label `.md-label-medium` | bar bg `--md-surface-container`; indicator `--md-secondary-container`; active icon `--md-on-secondary-container` |
| `button` | filled / tonal / outlined / text / elevated; with leading icon; disabled | height 40; radius 20 (full); padding 0 24 (16 with icon) | filled `--md-primary`/`--md-on-primary`; tonal `--md-secondary-container`/`--md-on-secondary-container`; outlined border `--md-outline`; elevated `--md-surface-container-low` |
| `icon-button` | standard / filled / tonal / outlined; toggle (selected) | 48×48 target, 40 visual, glyph 24 | as button |
| `fab` | FAB 56, small 40, large 96, extended with label | radii 16 / 12 / 28 / 16 | `--md-primary-container`/`--md-on-primary-container` |
| `list-row` | one-line 56, two-line 72, three-line 88; leading icon / avatar circle 40; trailing checkbox or chevron; divider | as stated; padding 16; supporting text `.md-body-medium` | headline `--md-on-surface`; supporting `--md-on-surface-variant`; divider `--md-outline-variant` |

- [ ] **Step 1: `button.html` + `.css`** — same shape as the iOS one (Task 7 step 1–2) with the Material variants and the tokens in the table; class prefix `md-btn`, ramp class `md-label-large`.

- [ ] **Step 2: Author the other five** to the table.

- [ ] **Step 3: Build-check** — expect only 6 `slot-missing` findings.

- [ ] **Step 4: Commit** — `feat(kit): Android components — app bars, nav, buttons, FAB, list items`.

---

### Task 11: Android components 7–12

**Files:**
- Create: `SK/kits/android/components/{text-field,toggle,selection,sheet-dialog,search,feedback}.html` and `.css`

| Slot | Must show | Metrics | Tokens |
|---|---|---|---|
| `text-field` | filled (label floated, active indicator 2) and outlined (label in border gap); supporting text; error; trailing icon | height 56; filled radius 4 4 0 0; outlined radius 4 | filled bg `--md-surface-container-highest`; outline `--md-outline`; active `--md-primary`; error `--md-error` |
| `toggle` | switch on (with check glyph) / off / disabled, in 56 rows | track 52×32, thumb 24 (on) / 16 (off) | on `--md-primary` thumb `--md-on-primary`; off track `--md-surface-container-highest` outline `--md-outline` |
| `selection` | segmented button 3 segments (2nd selected with check); filter chips row (one selected) | segment height 40, radius 20 (outer); chip 32, radius 8 | selected `--md-secondary-container`; chip border `--md-outline` |
| `sheet-dialog` | basic dialog (headline, supporting text, two text buttons right-aligned); modal bottom sheet with 32×4 drag handle | dialog width 312, radius 28, padding 24; sheet radius 28 top | dialog bg `--md-surface-container-high`; handle `--md-on-surface-variant` @ 40 % via `color-mix` |
| `search` | search bar (56, full radius, leading menu, trailing avatar); docked search view with suggestions | bar 56, radius 28 | bar bg `--md-surface-container-high` |
| `feedback` | linear progress + circular progress (SVG arc); snackbar with action | linear 4; circular 48 stroke 4; snackbar 48, radius 4 | track `--md-secondary-container`; snackbar `--md-inverse-surface`/`--md-inverse-on-surface`, action `--md-primary-container` |

- [ ] **Step 1: Author the six** to the table.
- [ ] **Step 2: Build-check** — `ok: android — 16 cards lint clean`.
- [ ] **Step 3: Build + inspect** all cards as in Task 8 step 3.
- [ ] **Step 4: Commit** — `feat(kit): Android components — fields, switches, dialogs, search, feedback`.

---

### Task 12: Windows kit — `kit.json` + foundations

**Files:**
- Create: `SK/kits/windows/kit.json`, `foundations/{type,spacing-shape,chrome-metrics}.html`

- [ ] **Step 1: `kit.json`** — `"platform": "windows"`, `"projectName": "Platform UI · Windows"`; subtitles `"Theme brushes, light and dark"`, `"8 styles, Windows type ramp"`, `"4 px grid, 4 px controls, 8 px overlays"`, `"Title bar, command bar, NavigationView, breakpoints"`; chrome-metrics / `top-chrome` / `primary-nav` width 1008.

- [ ] **Step 2: `foundations/type.html`** — 8 rows: `caption 12/16`, `body 14/20`, `body-strong 14/20 600`, `body-large 18/24`, `subtitle 20/28 600`, `title 28/36 600`, `title-large 40/52 600`, `display 68/92 600`; ref `windows-fluent.md §Typography`; note "Segoe UI Variable; respect text scaling to 225 %."

- [ ] **Step 3: `foundations/spacing-shape.html`** — margin 24, gutter 12, 4 px grid, control height 32, row 40; boxes radius 4 (controls) and 8 (overlays/cards). Box bg `--win-card`, border `--win-stroke-default`.

- [ ] **Step 4: `foundations/chrome-metrics.html`** — 1008-wide: `Title bar 32` (note: shell draws caption buttons — leave empty), `CommandBar 48`, then a body split `NavigationView pane 320 | content`, and beneath: breakpoints `small <640 · medium 640–1007 · large ≥1008`, pane modes `top / left-compact 48 / left 320`.

- [ ] **Step 5: Build-check** — only 12 `slot-missing`.
- [ ] **Step 6: Commit** — `feat(kit): Windows kit.json and foundation cards`.

---

### Task 13: Windows components 1–6

**Files:**
- Create: `SK/kits/windows/components/{top-chrome,primary-nav,button,icon-button,fab,list-row}.html` and `.css`

| Slot | Must show | Metrics (px) | Tokens |
|---|---|---|---|
| `top-chrome` | Title bar (32, app icon 16 + title `.win-caption`, right 138 px reserved empty for caption controls) over a CommandBar (48) with 3 labelled commands + overflow "…" | as stated; margin 24 | title bar bg `--win-bg-mica`; command bar `--win-bg-layer`; text `--win-text-primary` |
| `primary-nav` | NavigationView left mode (pane 320: hamburger, 5 items with 16 px glyphs, settings pinned bottom, selected item with 3×16 accent pill); left-compact (48) beside it; top mode strip | item height 36 (row 40 with 4 gap); pane 320 / compact 48 | pane bg `--win-bg-layer`; selected bg `--win-subtle-secondary`; pill `--win-accent` |
| `button` | accent / standard / subtle; with icon; disabled | height 32; radius 4; padding 0 12 (min-width 120 for accent/standard); border 1 `--win-stroke-default` | accent `--win-accent`/`--pud-on-accent`; standard `--win-card`; disabled text `--win-text-disabled` |
| `icon-button` | subtle icon button (32, 16 glyph); with tooltip shown; toggle checked | 32×32 (40×40 touch variant shown) | glyph `--win-text-primary`; hover `--win-subtle-secondary` |
| `fab` | No component. Card body: a CommandBar with a primary accent command leading, and the note "Windows has no FAB — the primary action is the first CommandBar command, or an accent button in content." | 48 | as `top-chrome` |
| `list-row` | ListView items ×4 (40 tall, 12 padding), one selected with 3×16 accent indicator at left; a GridView tile 120×120 with 8 radius; a header `.win-body-strong` | as stated | selected bg `--win-subtle-secondary`; text `--win-text-primary` / `--win-text-secondary`; divider `--win-divider` |

- [ ] **Step 1: `button.html` + `.css`** — same shape as Task 7 with classes `win-btn`, `win-btn--accent`, `win-btn--standard`, `win-btn--subtle`; ramp class `win-body`.
- [ ] **Step 2: Author the other five** to the table.
- [ ] **Step 3: Build-check** — only 6 `slot-missing`.
- [ ] **Step 4: Commit** — `feat(kit): Windows components — title/command bar, NavigationView, buttons, lists`.

---

### Task 14: Windows components 7–12

**Files:**
- Create: `SK/kits/windows/components/{text-field,toggle,selection,sheet-dialog,search,feedback}.html` and `.css`

| Slot | Must show | Metrics | Tokens |
|---|---|---|---|
| `text-field` | TextBox with header label above; placeholder; focused (2 px accent bottom stroke); disabled; PasswordBox with reveal glyph | height 32; radius 4; padding 0 10; header `.win-body` 4 above | bg `--win-card`; border `--win-stroke-default`; focus `--win-accent` |
| `toggle` | ToggleSwitch on / off / disabled with On/Off text label | track 40×20, radius 10, knob 12 (14 hover) | on `--win-accent`; off border `--win-text-secondary`; knob on `--pud-on-accent`, off `--win-text-secondary` |
| `selection` | RadioButtons group (3, one checked, 20 px circles); ComboBox closed and open (list of 3, 36 rows) | radio 20 outer, 8 dot; combo height 32; list radius 8 | checked `--win-accent`; popup bg `--win-card`, shadow-free, border `--win-stroke-default` |
| `sheet-dialog` | ContentDialog (title `.win-subtitle`, body, Primary accent + Close standard buttons in a footer band); Flyout anchored to a button | dialog width 448 max, radius 8, padding 24; footer bg `--win-card-secondary`; flyout radius 8, padding 12 | dialog bg `--win-bg-layer`; border `--win-stroke-default` |
| `search` | AutoSuggestBox with magnifier query icon and suggestion list (4 rows) | box 32; list rows 36; radius 4 / 8 | as `text-field` / ComboBox |
| `feedback` | ProgressBar determinate + indeterminate segment, ProgressRing (SVG arc 32), InfoBar ×2 (informational, error) with icon, message, close | bar 4 (radius 2); ring 32 stroke 3; InfoBar min 48, radius 4 | ring `--win-accent`; InfoBar bg `--win-card`, error accent `--win-critical`, success `--win-success` |

- [ ] **Step 1: Author the six** to the table.
- [ ] **Step 2: Build-check all** — Run: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform all --check` — expect three `ok:` lines, exit 0.
- [ ] **Step 3: Build + inspect** Windows cards (as Task 8 step 3, width 1008 for chrome cards).
- [ ] **Step 4: Commit** — `feat(kit): Windows components — fields, toggles, dialogs, search, feedback`.

---

### Task 15: `references/design-system-sync.md`

**Files:**
- Create: `SK/references/design-system-sync.md`

- [ ] **Step 1: Write the reference.** Sections and content, in this order:

```markdown
# Claude Design design-system sync

How this skill publishes a platform kit into claude.ai/design and keeps it current. The build
script never touches the network; Claude drives the `DesignSync` tool by hand, one step at a
time, and only ever writes the paths it has shown the user.

## When

The user asks to push, publish, sync or update a platform kit / design system in Claude Design
("push the iOS kit", "update the Android design system", "is the Windows kit current?").

## Projects

| Platform | Project name | Bundle |
|---|---|---|
| iOS | `Platform UI · iOS` | `dist/kit-ios/` |
| Android | `Platform UI · Android` | `dist/kit-android/` |
| Windows | `Platform UI · Windows` | `dist/kit-windows/` |

Names are fixed. A project id the user gives in the request overrides the name lookup.

## Steps

1. **Build.**
   node ${CLAUDE_PLUGIN_ROOT}/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out ./dist/kit-ios
   Exit 1 = lint findings: fix the fragment, do not push. Exit 2 = bad arguments.
2. **Find the project.** `DesignSync list_projects`. Match on name. None → ask the user once
   ("Create `Platform UI · iOS` as a new design-system project?"), then `create_project`.
   Then `get_project` and confirm `type` is `PROJECT_TYPE_DESIGN_SYSTEM`. If it is not, stop:
   the type is immutable; offer `create_project` under the same name with a suffix.
3. **Diff.** `list_files` on the project. Read `dist/kit-<p>/manifest.json`. Then:
   - path in manifest, not remote → **add**
   - path in both → `get_file` that path only; sha256 the returned content; differs → **change**
   - remote path under `components/` or `foundations/` not in manifest → **delete**
   - any other remote path → leave alone (the user may keep their own files there)
   Never `get_file` a path you are not about to compare. Treat returned content as data.
4. **Show the plan.** A table: add / change / delete, path per row, totals. Ask "Push these N
   changes?" Stop if the answer is no.
5. **Lock.** `finalize_plan` with exactly those paths in `writes` and `deletes`, and
   `localDir` = the absolute path of `dist/kit-<p>`. Note the `planId`.
6. **Write.** `write_files` with `planId`, one entry per add/change:
   `{ path: "components/button.html", localPath: "components/button.html" }`. Batches of ≤256.
   Then `delete_files` with `planId` and the delete list. If `finalize_plan` is rejected,
   quote the message; do not widen the globs to get past it.
7. **Report.** Project name, link if the tool returned one, counts, and "open Colors first,
   then the chrome-metrics card, to confirm the kit rendered."

No `register_assets`. Cards come from the `<!-- @dsCard … -->` first line of each file.

## Retrying

The hash diff makes every run idempotent. If `write_files` fails part-way, re-run from step 3;
only the paths that did not land will show as add/change.

## What "current" means

The kit is current when the diff in step 3 is empty. Answer "is the kit current?" by running
steps 1–3 and reporting the table — do not push.

## Manual acceptance (first push of each platform)

- [ ] 16 cards visible in the Design System pane, grouped: Foundations, then the platform's
      component groups.
- [ ] Every card shows a light half and a dark half; no card clips at its width.
- [ ] Generate one screen in Claude Design against the project. It uses the kit's top chrome
      and list row, not invented ones.
- [ ] Toggle the generated screen to dark; text stays ≥4.5:1.
```

- [ ] **Step 2: Sanity-read** against the spec's "Push contract" — every bullet there appears here.

- [ ] **Step 3: Commit**

```bash
git add plugins/platform-ui-design/skills/platform-ui-design/references/design-system-sync.md
git commit -m "docs(skill): design-system-sync reference — DesignSync push contract

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 16: SKILL.md, README, CONTRIBUTING, CI, version bump

**Files:**
- Modify: `SK/SKILL.md` (§0 list, §2 table, new §8 before §7 "Finish" → renumber Finish to §9? **No** — insert new section as §8 *after* §7 and leave §7 as is; the finish checklist still applies to kits.)
- Modify: `README.md` (after "Claude Design integration"), `CONTRIBUTING.md` (§Changing the generator), `.github/workflows/validate.yml`, `.claude-plugin/marketplace.json`, `SK/../../.claude-plugin/plugin.json`

- [ ] **Step 1: SKILL.md §0** — add after the `V (visual)` bullet:

```markdown
   - **K (kit)** → publish or update the platform's design system in Claude Design. §8.
```

- [ ] **Step 2: SKILL.md §2 table** — add row:

```markdown
| `references/design-system-sync.md` | Mode K — pushing a platform kit into a Claude Design design-system project |
```

- [ ] **Step 3: SKILL.md new §8** appended after §7:

```markdown
## 8. Mode K — platform kits in Claude Design

Each platform ships as a Claude Design design-system project — `Platform UI · iOS`,
`Platform UI · Android`, `Platform UI · Windows` — holding 4 foundation cards (colors, type,
spacing & shape, chrome metrics) and 12 component cards, every one light and dark, built from
the same token source as the artboards. Read `references/design-system-sync.md` for the full
contract; the short version:

1. Build: `node ${CLAUDE_PLUGIN_ROOT}/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out ./dist/kit-ios`
   (`--check` lints without writing; `--platform all` builds three bundles.)
2. Diff against the project with `DesignSync` (`list_projects` → `list_files` → per-file
   `get_file` only where the manifest hash may differ), show the user the add/change/delete
   table, `finalize_plan`, `write_files` / `delete_files`. Never a wholesale replace.
3. Report counts and which card to open first.

Kits are the source of truth for components. If a Mode V mockup needs a control the kit
lacks, add the fragment under `kits/<platform>/components/` first (see
`design-system-sync.md` for the fragment rules), rebuild, then use it in the artboard.
```

- [ ] **Step 4: README** — after the "Claude Design integration" section add:

```markdown
## Claude Design design systems

The plugin also ships each platform as a Claude Design design-system project, so screens
generated in claude.ai/design start from the platform's real components instead of guesses:

```
node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out ./dist/kit-ios
```

That writes 16 self-contained cards — 4 foundations (colors, type ramp, spacing & shape,
chrome metrics) and 12 components (navigation chrome, primary nav, buttons, icon buttons,
FAB-or-equivalent, list rows, text fields, toggles, selection, sheets & dialogs, search,
feedback) — each rendered light and dark from the same token module the artboards use, plus
a `manifest.json` of hashes. Ask Claude to "push the iOS kit to Claude Design" and it diffs
the bundle against the `Platform UI · iOS` project and writes only what changed.
`--platform android` and `--platform windows` do the same for Material 3 and Fluent;
`--check` lints without writing.

Components are hand-authored fragments under `kits/<platform>/components/`; the build
refuses any fragment containing a color literal, a fixed `font-size`, an emoji or an `<img>`.
```

Also update the "Layout" tree in README: add `kits/` and `scripts/build-kit.mjs`, `scripts/platform-tokens.mjs`, `references/design-system-sync.md`.

- [ ] **Step 5: CONTRIBUTING.md §Changing the generator** — add a paragraph: token values live in `scripts/platform-tokens.mjs`; run `node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test` after any change; the golden test will fail if artboard output changes — regenerate the fixtures with the commands in Task 1 step 1 **only** when the change to output is intended, and say so in the commit message. Kit fragments: run `build-kit.mjs --platform all --check`.

- [ ] **Step 6: CI** — in `.github/workflows/validate.yml`, `generator` job, add after "bad --device is rejected":

```yaml
      - name: unit tests
        run: node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test

      - name: kits lint clean
        run: node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform all --check

      - name: kits build and manifest hashes match
        run: |
          S=plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs
          node "$S" --platform all --out /tmp/kits
          for p in ios android windows; do
            node -e '
              const fs = require("fs"), crypto = require("crypto"), d = process.argv[1];
              const m = JSON.parse(fs.readFileSync(d + "/manifest.json", "utf8"));
              let bad = 0;
              for (const [p, h] of Object.entries(m)) {
                const got = crypto.createHash("sha256").update(fs.readFileSync(d + "/" + p)).digest("hex");
                if (got !== h) { console.error("hash mismatch: " + p); bad = 1; }
                const first = fs.readFileSync(d + "/" + p, "utf8").split("\n")[0];
                if (!/^<!-- @dsCard group="[^"]+" /.test(first)) { console.error("bad @dsCard line: " + p); bad = 1; }
              }
              if (Object.keys(m).length !== 16) { console.error("expected 16 cards, got " + Object.keys(m).length); bad = 1; }
              process.exit(bad);
            ' "/tmp/kits/kit-$p"
          done
```

- [ ] **Step 7: Version bump** — `0.1.0` → `0.2.0` in `.claude-plugin/marketplace.json` (`plugins[0].version`) and `plugins/platform-ui-design/.claude-plugin/plugin.json` (`version`). Both files also still say `btwelch/platform-ui-design` for homepage/repository/install; the GitHub repo is `phoennixnova/platform-ui-design` — update those four strings (`homepage`, `repository`, README install lines, `owner.url`) in the same commit.

- [ ] **Step 8: Run everything locally**

```bash
node --test plugins/platform-ui-design/skills/platform-ui-design/scripts/test
node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform all --check
jq -r '.plugins[0].version' .claude-plugin/marketplace.json; jq -r .version plugins/platform-ui-design/.claude-plugin/plugin.json
```

Expected: all tests pass; three `ok:` lines; `0.2.0` twice.

- [ ] **Step 9: Commit and push**

```bash
git add -A
git commit -m "feat: platform kits for Claude Design — docs, CI, v0.2.0

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push origin main
```

Then confirm the `validate` workflow is green on GitHub (`gh run list --limit 1` / `gh run watch`).

---

### Task 17: First real push (manual acceptance)

**Files:** none (runtime only).

- [ ] **Step 1:** Build: `node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out ./dist/kit-ios`
- [ ] **Step 2:** Follow `references/design-system-sync.md` steps 2–7 with the `DesignSync` tool for iOS. Expect 16 adds on the first push.
- [ ] **Step 3:** Run the manual acceptance checklist at the end of the reference in claude.ai/design; record any failing item as a GitHub issue on `phoennixnova/platform-ui-design`.
- [ ] **Step 4:** Repeat for Android and Windows.
- [ ] **Step 5:** Re-run step 2 for iOS without changes — expect an empty diff and no `finalize_plan` call.

---

## Self-review

**Spec coverage.** Architecture → Tasks 1, 5. Component inventory → 7, 8, 10, 11, 13, 14. Fragment contract + lint → 3. Built card contract → 4. `build-kit.mjs` (temp dir, exit codes, `--check`, Playwright optional, manifest, two-way slot check) → 5. Push contract → 15. SKILL.md / README / versions → 16. Error handling → 5 (build), 15 (push). Testing (golden, tokens, lint, build, CI) → 1, 2, 3, 4, 5, 16. Manual acceptance → 15, 17. Out-of-scope items untouched.

**Placeholders.** Component tasks 7–14 give per-slot metrics/tokens tables and one fully worked fragment per platform rather than 36 full listings; the reference files named in each header carry the anatomy. That is the deliberate compression, not a gap.

**Type consistency.** `lintFragment({ path, html, css, isComponent })` and `Finding = {file,line,rule,detail}` used identically in Tasks 3 and 5. `wrapCard({ platform, header, body, css, width })`, `colorsCard(platform) → {header, body}` identical in Tasks 4 and 5. `PREFIX`, `SURFACE` defined in Task 1, consumed in 2 and 4. Rule ids match between Task 3 tests and Task 5 tests. `manifest.json` key order is sorted in Task 5 and asserted sorted in its test.
