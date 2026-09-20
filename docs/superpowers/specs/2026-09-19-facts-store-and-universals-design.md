# Fact store + data-driven universals — design spec

Date: 2026-09-19
Status: approved (brainstorm), awaiting implementation plan
Follows: 2026-09-13 kits spec (v0.2.x), v0.3.0 interview-scoped audits.

## Goal

Make a Mode S review cheap and deterministic, and make the reference library extensible
without manual duplication:

1. **One read-only fact store** per reviewed app, produced by a zero-dependency script, that
   every review step reads instead of re-grepping the tree.
2. **Universal rules generated from per-platform data** so shared rules (contrast, targets,
   text scaling, dark theme, motion, focus, labels, tokens, back, insets) live once, with one
   column per platform; per-platform reference files keep only their deltas.
3. **Adding a platform or a source is one data file** — detection, universals column,
   attribution row and CI checks all follow from it.

## Measured motivation

Bracelet Designer review (2026-09-14/15): 267 agents, three of which re-grepped the source
tree independently (Bash×157 in one). Across the 7 reference files: contrast ratios appear in
5, text scaling in 6, dark theme in 5, focus indicators in 5, screen-reader labels in 4,
reduced motion in 3. 6 400 reference lines total; a scoped review reads most of them.

## Architecture

```
plugins/platform-ui-design/skills/platform-ui-design/
├── references/
│   ├── platforms/                 NEW — one JSON per platform (the single thing a contributor adds)
│   │   ├── _schema.json           JSON Schema for the files below (validated by the build)
│   │   ├── ios.json
│   │   ├── android.json
│   │   └── windows.json
│   ├── universals.md              GENERATED — shared rules, one column per platform
│   ├── apple-foundations.md …     hand-written deltas; § index header GENERATED in place
│   └── review-rubric.md           passes cite universals §ids
├── scripts/
│   ├── build-references.mjs       NEW — generates universals.md, § indexes, ATTRIBUTION table; lints deltas
│   ├── inspect-app.mjs            NEW — writes the fact store for an app under review
│   ├── lib/rules.mjs              NEW — rule catalogue (ids, groups, universal-phrase regexes)
│   └── test/…                     node --test suites + fixtures
├── ATTRIBUTION.md                 sources table GENERATED between markers
└── CONTRIBUTING.md                "Adding a platform" rewritten around platforms/<id>.json
```

Token data stays in `scripts/platform-tokens.mjs`; kits stay in `kits/<platform>/`. This spec
does not merge those (a follow-up may move token values into the platform JSON).

## `references/platforms/<id>.json`

```json
{
  "id": "android",
  "label": "Android",
  "guideline": "Material 3 / Android UI",
  "detect": {
    "files": ["src-tauri/gen/android/**", "**/AndroidManifest.xml", "**/build.gradle*"],
    "deps": ["react-native", "@capacitor/android", "expo"],
    "native": ["**/AndroidManifest.xml", "**/*.kt"]
  },
  "refs": {
    "foundations": "android-foundations.md",
    "components": "android-components.md",
    "a11y": "accessibility.md#part-3--android"
  },
  "rules": {
    "target.min":       { "value": "48×48 dp, 8 dp apart", "source": "https://developer.android.com/…" },
    "contrast.text":    { "value": "4.5:1 body, 3:1 large", "source": "https://www.w3.org/TR/WCAG22/…" },
    "text.scaling":     { "value": "sp for text, dp otherwise; non-linear on 14+", "source": "…" },
    "theme.dark":       { "value": "required; colorScheme roles", "source": "…" },
    "motion.reduce":    { "value": "honour Settings > Remove animations", "source": "…" },
    "focus.indicator":  { "value": "visible focus on all controls", "source": "…" },
    "label.control":    { "value": "contentDescription / Modifier.semantics", "source": "…" },
    "color.tokens":     { "value": "colorScheme.<role>; never hardcoded", "source": "…" },
    "nav.back":         { "value": "system + predictive back; BackHandler", "source": "…" },
    "layout.insets":    { "value": "WindowInsets; edge-to-edge on SDK 35+", "source": "…" },
    "layout.adaptive":  { "value": "600/840/1200/1600 dp width classes", "source": "…" },
    "icons":            { "value": "Material Symbols", "source": "…" },
    "shape.radius":     { "value": "4/8/12/16/28 dp scale", "source": "…" },
    "nav.primary":      { "value": "bar → rail → drawer by size class; ≤5 destinations", "source": "…" },
    "action.primary":   { "value": "FAB bottom-end, one per screen", "source": "…" }
  },
  "sources": [
    { "name": "developer.android.com", "url": "https://developer.android.com/design/ui", "owner": "Google LLC / AOSP", "license": "CC BY 2.5", "open": true, "use": "Summarized and adapted, with the attribution Google specifies." }
  ]
}
```

- Every rule id in `lib/rules.mjs` must be present in every platform file, either as
  `{ value, source }` or `{ "na": "<reason>" }`. The build fails otherwise.
- `detect.files` are globs relative to the app root; `deps` are package.json dependency names.
  `native` globs mark a native surface; a platform detected only via web-framework deps or a
  shell (`tauri.conf.json`, `electron`, `capacitor.config.*`) is web-in-shell.
- `sources` rows are merged into ATTRIBUTION.md's table between `<!-- sources:start -->` /
  `<!-- sources:end -->` markers, sorted by platform then name. Hand-written rows outside the
  markers are untouched.

## `lib/rules.mjs`

```js
export const RULE_GROUPS = [
  { id: "input",  title: "Input & targets",  rules: ["target.min", "nav.back", "focus.indicator"] },
  { id: "text",   title: "Text",             rules: ["text.scaling", "contrast.text"] },
  { id: "color",  title: "Color & theme",    rules: ["color.tokens", "theme.dark"] },
  { id: "layout", title: "Layout",           rules: ["layout.insets", "layout.adaptive", "shape.radius"] },
  { id: "nav",    title: "Navigation & actions", rules: ["nav.primary", "action.primary", "icons"] },
  { id: "motion", title: "Motion & a11y",    rules: ["motion.reduce", "label.control"] },
];
export const RULES = {
  "target.min":      { title: "Minimum hit target",  phrases: [/\b44\s?(pt|×\s?44)\b/, /\b48\s?(dp|×\s?48)\b/, /\b40\s?(px|×\s?40)\b.*touch/i] },
  "contrast.text":   { title: "Text contrast",       phrases: [/4\.5:1/, /\b3:1\b/] },
  …
};
```

`phrases` are the delta lint: a per-platform reference file may not contain a universal
phrase except on a line that also contains `universals.md` (a pointer) or inside a fenced code
block. This is what stops the duplication returning.

## `scripts/build-references.mjs`

```
node build-references.mjs [--check]
```

1. Load `platforms/*.json`, validate against `_schema.json` (hand-rolled checks, no dependency)
   and against `RULES` — every rule present for every platform.
2. Generate `references/universals.md`: front matter line "GENERATED — edit
   references/platforms/*.json, then run build-references.mjs"; one `## <group>` per
   `RULE_GROUPS`; one table per group: `| Rule | <label per platform>… |` with values and a
   footnote list of sources per row (`[ios]`, `[android]`, `[windows]` links). Rule anchors are
   `### target.min` so the rubric can cite `universals.md#targetmin`.
3. Rewrite the `§` index at the top of every `references/*.md` that has a marker pair
   `<!-- index:start -->` / `<!-- index:end -->`: a one-line-per-`##` list `§n title — line`.
   Files without markers are left alone (`universals.md` gets one too).
4. Regenerate the ATTRIBUTION.md sources table between its markers.
5. Delta lint (above). Findings as `file:line: rule-id — phrase`.
6. `--check`: run 1–5 without writing; exit 1 if any generated output differs from disk or
   any lint finding exists. Exit 2 on schema failure. CI runs `--check`.

## `scripts/inspect-app.mjs`

```
node inspect-app.mjs --root <app dir> [--out <file>] [--force]
```

Default `--out` is `<root>/docs/ui-review-facts.json`. Zero dependencies. Never modifies the
app. Skips work when `src` hash (sha256 of sorted paths+mtimes+sizes under the scanned dirs)
matches the previous output's `hash`, unless `--force`.

Output:

```json
{
  "generatedAt": "2026-09-19T…", "root": "…", "hash": "…",
  "platforms": {
    "ios":     { "detected": true,  "evidence": ["src-tauri/gen/apple/…"], "surface": "web-in-shell" },
    "android": { "detected": false, "evidence": [], "mentions": ["CLAUDE.md:41: Android is a future target"] },
    "windows": { "detected": true,  "evidence": ["src-tauri/tauri.conf.json"], "surface": "web-in-shell" }
  },
  "surface": "web-in-shell",
  "frameworks": ["react", "tauri"],
  "inventory": {
    "pages":      [ { "name": "Design", "file": "src/pages/Design.tsx" } ],
    "components": [ { "name": "RibbonSection", "file": "src/ui/RibbonSection.tsx", "kinds": ["popover", "button"] } ],
    "controlKinds": { "button": 41, "textbox": 6, "dialog": 2, "menu": 3, "popover": 14, "tabs": 1, "switch": 0 }
  },
  "tokens": {
    "cssVars": 128, "cssVarFiles": ["src/ui/tokens.css"],
    "hexLiterals":   [ { "file": "src/ui/x.css", "line": 12, "text": "#FF3B30" } ],
    "fontSizeLiterals": [ … ],
    "breakpoints": [640, 681, 790, 820, 1008]
  },
  "a11y": {
    "clickableWithoutRole": [ { "file": "…", "line": 88 } ],
    "iconOnlyButtonsWithoutLabel": [ … ],
    "focusVisibleRules": 3, "reducedMotionQueries": 1, "colorSchemeQueries": 2, "liveRegions": 1
  },
  "targets": { "small": [ { "file": "…", "line": 40, "selector": ".tool-rail__btn", "px": 38 } ] },
  "docs": {
    "claudeMd": "CLAUDE.md", "readme": "README.md",
    "knownIssues": ["docs/Plan and Feature List.md"],
    "deviationSections": [ { "file": "docs/design/README.md", "heading": "§5 Platform exceptions", "line": 210 } ]
  }
}
```

Detection heuristics are simple, cited and tested against fixtures. Control kinds come from
JSX/HTML tag names plus `role=`; `menu`/`popover`/`dialog` also from class or component
names containing those words. The store is facts with locations, not judgments.

## Review flow changes

- Rubric Pass 0 becomes: run `inspect-app.mjs`, read the JSON, fill the scope block from
  `platforms`/`surface`/`inventory`/`docs`. Triage candidates cite the JSON.
- Interview page/control options come from `inventory.pages` and `controlKinds`.
- Deep pass: reviewers read universals + the delta sections Pass 0 named; open source only
  at cited lines. Subagents (if any) get the JSON path, never a tree to grep.
- SKILL.md §1 table → generated from the same rule data? No: §1 stays a hand-written short
  summary with a pointer to `universals.md` (SKILL.md must stay small); the build's lint does
  not run on SKILL.md.

## Reference file surgery (deltas)

For each of `apple-foundations.md`, `android-foundations.md`, `windows-fluent.md`,
`accessibility.md`, `cross-platform.md`: paragraphs that restate a universal rule are replaced
by a one-line pointer `See universals.md §<group> — <rule.title>.` keeping any platform-only
detail (API names, per-OS numbers not in the table) in place. Component catalogues are not
touched. `accessibility.md` Part 1 (WCAG) keeps its numbers — it is the source for the
universal rows and is listed as such in `rules.mjs` (`sourceFile`), and the lint exempts it.

Expected: −20–30 % on the three foundations files, −30 % on accessibility.md, all citations
preserved. The delta lint is the acceptance test.

## Contributor flow ("Adding a platform")

1. `references/platforms/<id>.json` with every rule filled or `na`.
2. `scripts/platform-tokens.mjs` entry (unchanged from today).
3. `references/<id>-foundations.md` (+ `-components.md`) holding only deltas.
4. `kits/<id>/` (unchanged from today).
5. `node scripts/build-references.mjs` → universals column, index, attribution rows appear;
   `--check` and `node --test` green.

"Suggesting a source": the issue form is unchanged; maintainers add the row to the platform
JSON `sources`, never to ATTRIBUTION.md directly.

## Testing

`node --test` suites, fixtures under `scripts/test/fixtures/`:
- `rules.test.mjs` — every RULE id appears in exactly one group; phrases compile.
- `build-references.test.mjs` — fixture platforms dir (two platforms, one missing rule →
  exit 2); generated universals table has one column per platform; index regeneration is
  idempotent; delta lint flags a planted phrase and exempts pointer lines / code fences /
  `sourceFile`; `--check` exits 1 on drift.
- `inspect-app.test.mjs` — fixture app (`fixtures/app-web-tauri/` with a tauri.conf, a
  React page, a component with an icon-only button, a css file with a hex literal and a 38px
  button, a CLAUDE.md saying "Android is a future target"): platforms/surface/inventory/
  tokens/a11y/targets/docs assertions; hash skip; `--force`.
- CI: `build-references.mjs --check`, tests, kits check (existing).

## Out of scope

- Moving token values into platform JSON.
- Generating SKILL.md §1 from data.
- Canvas round-trip (sub-project 2 from the original brief).
