# Task 8 report — iOS components 7–12

Commit: `5d721ca408b7709cc7cf338d513579d5263f6c98`
"feat(kit): iOS components — fields, toggles, sheets, search, feedback"

## Files touched

All under `plugins/platform-ui-design/skills/platform-ui-design/kits/ios/`:

- `components/text-field.html` / `.css` (kept from partial attempt, unmodified)
- `components/toggle.html` / `.css` (kept from partial attempt, unmodified)
- `components/selection.html` / `.css` (kept from partial attempt, unmodified)
- `components/sheet-dialog.html` (kept from partial attempt, unmodified) + `sheet-dialog.css` (new)
- `components/search.html` + `search.css` (new)
- `components/feedback.html` + `feedback.css` (new)
- `kit.json` — added `"width": 393` to the `search` component entry only (matches `top-chrome`/`primary-nav`/`fab`, since the anatomy is a search bar inside a 393pt nav bar)

## What was kept / changed from the uncommitted partial files

Read all four partial slots against the brief's per-slot table and the conventions in
`button.html/css`, `list-row.html/css`, `top-chrome.html/css` before touching anything.

- **text-field**: fully compliant as found — field 44pt/radius 10/padding 0 12, placeholder
  `--ios-label-tertiary`, clear glyph 17pt in a 44pt target (`.ios-field__clear` is 44×44 with a
  `-12px` margin to align its visual edge with the field's padding), focused ring via
  `box-shadow: inset 0 0 0 2px var(--ios-accent)`, error state via `--ios-red` (box-shadow ring
  + footnote error line). Kept verbatim.
- **toggle**: fully compliant as found — track 51×31/radius 15.5, knob 27, on = `--ios-green`,
  off = `--ios-fill`, disabled = `opacity: 0.35`. Notably the partial file's knob already used
  `var(--pud-on-accent)` rather than the table's literal `--ios-bg` — this is *correct* per the
  task's explicit global constraint ("switch knob stays white in dark mode — use
  `var(--pud-on-accent)` for the knob, not `--ios-bg`"), since `--ios-bg` inverts to near-black in
  dark mode and `--pud-on-accent` is a fixed `#FFFFFF`. Kept verbatim; no change needed.
- **selection**: fully compliant as found — 3-segment (2nd selected) + 2-segment variant, height
  32/outer radius 9/2px padding/segment radius 7, bg `--ios-fill`, selected bg
  `--ios-bg-grouped-secondary`. Kept verbatim.
- **sheet-dialog**: the `.html` was well-formed (alert with title/message/destructive+Cancel
  stacked bottom; action sheet with 3 actions + separated Cancel; bottom sheet with grabber) and
  needed no changes. Its `.css` did not exist — authored `sheet-dialog.css` from scratch to match
  the classes already referenced in the html: alert 270pt wide/radius 14/44pt button rows with
  hairline separators (`--ios-separator`) between message and buttons and between buttons;
  destructive button in `--ios-red`; action sheet rows 57pt/radius 13 grouped in one rounded
  block plus a separate Cancel block (8px gap, iOS convention); bottom sheet grabber 36×5,
  radius 2.5, 5px inset from the top edge. Verified the alert's button order (destructive on top,
  Cancel on bottom) against `apple-components.md` §Alerts' button-placement table ("Stack
  (vertical): default/most likely top, Cancel bottom") — already correct.
- **search** (new): nav bar (44pt) + field row (52pt) inside a 393pt-wide demo (two stacked
  states: idle with magnifier+placeholder+mic, and active with typed text + Cancel). Field 36pt
  tall/radius 10, bg `--ios-fill`, icons `--ios-label-secondary`, active state adds a focus ring.
  Added `"width": 393` to the `search` slot in `kit.json` per the brief's stated exception.
- **feedback** (new): determinate progress bar (4pt tall, radius 2, track `--ios-fill`, fill
  `--ios-accent`) and an 8-spoke spinner SVG (20pt, `stroke-linecap="round"`, opacities stepped
  1 → 0.87 → 0.75 → 0.62 → 0.5 → 0.37 → 0.25 → 0.12 around the circle to fake rotation). The
  `pud-note` paragraph includes the required exact sentence: "No toasts on iOS — use inline
  status, an alert, or a sheet."

## Reference sections used

- `references/apple-components.md` §Text fields, §Toggles, §Segmented controls, §Alerts,
  §Action sheets, §Sheets, §Search fields, §Progress indicators, and the top index table (used
  to confirm `search-fields` belongs to the "Navigation & search" group and
  `progress-indicators` to "Status", to pick each fragment's `group:` header field consistently
  with existing `top-chrome`/`primary-nav` = Navigation).
- `references/device-metrics.md` — cross-checked nav-bar (44pt) and search-bar (~56pt,
  "convention/unverified") figures; used the brief's own 44+52 split (from the per-slot table)
  as authoritative over the unverified device-metrics convention number, since the brief is the
  task's contract.

## Check output

```
node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --check
render check skipped (playwright not importable)
ok: ios — 16 cards lint clean (check only, nothing written)
```
Exit code 0.

## Browser inspection (built to a temp dir, deleted afterward)

Built with `node .../build-kit.mjs --platform ios --out .tmp-kit-ios-inspect` (a scratch dir
inside the worktree — the Browser pane could not render `file://` paths outside the project
folder as live pages, only as inert static snapshots, so the OS temp dir approach from the brief
was swapped for an in-repo scratch dir, deleted before finishing). Opened in the in-app browser
via `mcp__Claude_Browser__navigate` + screenshot:

- **sheet-dialog.html**: alert, action sheet, and bottom sheet all render in both halves;
  destructive red and accent blue both readable; dark-mode alert/action-sheet/sheet surfaces are
  a visibly lighter gray against the near-black backdrop (confirmed via a follow-up zoom) — no
  white-on-white, nothing clipped at either the 840px unstacked viewport.
- **toggle.html**: on (green + white knob), off (gray track + white knob), disabled (dimmed) all
  render correctly in light and dark; knob stays white in dark mode as required.
- **search.html**: idle and active nav-bar/search-bar states render side by side (906px viewport,
  393pt panels), magnifier/mic icons and Cancel button all legible in both themes, nothing clips.
- **foundations/colors.html**: pre-existing generated card, unaffected by this task — rendered
  correctly as a baseline sanity check of the token system.
- **text-field.html**: placeholder, filled+clear, focused (blue ring), and error (red ring +
  error line) all render correctly in both themes.
- **selection.html**: 3-segment and 2-segment controls both render with the selected segment
  clearly distinguished in light and dark.
- **feedback.html**: progress bar (partially filled) and spinner icon render in both themes; the
  "No toasts on iOS…" sentence is present in the note.

## Self-review

- Ran the lint script mentally against the new/kept fragments: no hex/rgb()/hsl()/named-color
  literals, no `font-size:`, no emoji, no `<img>`, only `var(--ios-*)`/`--pud-on-accent` tokens
  and `color-mix(...)` (not used here, but confirmed nothing needed it), all headers follow the
  `slot: · group: · title: · subtitle: · ref:` format with " · " separators, all roots are
  `<section class="pud-card">` (or `pud-card pud-stack`).
- Confirmed class naming follows `ios-<component>` / `ios-<component>--<variant>` /
  `ios-<component>__<part>` (e.g. `ios-field__clear`, `ios-alert__button--destructive`,
  `ios-search-field--active`) consistent with `button.css`/`list-row.css`.
- Confirmed each new component's `.css` is fully self-contained (no cross-file class reuse —
  e.g. `search.css` duplicates its own nav-bar-shaped classes rather than depending on
  `top-chrome.css`, since `kit-wrap.mjs` only ever pulls a fragment's own sibling `.css`).
- Verified `git status --short` before committing showed only the 12 intended new files plus the
  one `kit.json` line-edit (the pre-existing untracked `.superpowers/` directory from the session
  setup was left alone) — nothing outside `kits/ios/components/**` and the single `kit.json`
  width entry was touched.
- Confirmed the commit message matches the brief's Step 4 text exactly (with the session's
  required `Claude Opus 5` attribution line, per the task instructions overriding the brief's
  literal text).

## Concerns

- None blocking. One judgment call worth flagging: the Browser pane's file-preview sandbox
  refused to render `file://` paths outside this project's own directory tree as live/interactive
  pages (treating them as inert data-URL "static snapshots" that still screenshot correctly, just
  via a slightly different code path than a normal navigation). I built the inspection output
  into a scratch folder *inside* the worktree (`.tmp-kit-ios-inspect`) instead of the OS `$TMP`
  the brief suggested, and deleted it before finishing — net effect on the deliverable is none,
  since nothing under that scratch path was committed.
- The `sheet-dialog.css` action-sheet "Cancel separated at the bottom" and bottom-sheet surface
  colors were not pinned to a specific token in the brief's table beyond "alert bg
  `--ios-bg-grouped-secondary`; destructive `--ios-red`" — I reused `--ios-bg-grouped-secondary`
  for the action-sheet group/cancel and the bottom-sheet surface too, for visual consistency with
  the alert and with `toggle.css`'s row-group background. This is a design choice, not a token
  violation; flagging in case a different elevated-surface token was intended.

## Fix round 1

Two review findings addressed:

- **CRITICAL — `sheet-dialog.css:3,13,17,19`**: alert, action-sheet group, action-sheet cancel
  button, and bottom sheet all painted `--ios-bg-grouped-secondary` (`#FFFFFF` in light mode),
  identical to the panel's `--ios-bg` (`#FFFFFF`), so the surfaces had no visible boundary in the
  light half. Fixed by following `list-row.css`'s wrap pattern: added a new `.ios-dialog-wrap`
  class (`background: var(--ios-bg-grouped)`, `padding: 16px`, `border-radius: 12px`) and wrapped
  each of the three demos (alert, action sheet, bottom sheet) in `sheet-dialog.html` with a
  `<div class="ios-dialog-wrap">` containing the existing label + demo markup. Removed the
  now-redundant `padding: 0 16px` from `.ios-action-sheet-demo` since the wrap's own padding
  supplies that inset. No literal colors or borders/shadows were introduced — only the existing
  `--ios-bg-grouped` token.
- **MINOR — `search.css:10` `.ios-search-cancel`**: had no explicit height, so its hit target was
  only as tall as its text line (~22px) within the 52pt field row. Fixed by adding
  `min-height: 44px; display: inline-flex; align-items: center;` (a fixed `min-height` rather than
  `height: 100%`, since the row has 8px vertical padding — `height: 100%` would have resolved
  against the row's 36px content-box, not the 44px target; `min-height: 44px` lets the button
  overflow symmetrically into the row's padding without clipping, landing flush within the row's
  52px outer bounds).

### Verify

```
node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --check
render check skipped (playwright not importable)
ok: ios — 16 cards lint clean (check only, nothing written)
```
Exit code 0.

Rebuilt to an in-repo scratch dir (`.tmp-kit-ios-fix1`, deleted afterward) and inspected in the
in-app browser:

- **sheet-dialog.html**: light half now shows a visible light-gray (`rgb(242,242,247)`) wrap
  boundary around each white (`rgb(255,255,255)`) alert/action-sheet/sheet surface — confirmed via
  `getComputedStyle` on `.pud-theme` (panel, `rgb(255,255,255)`), `.ios-dialog-wrap`
  (`rgb(242,242,247)`), and `.ios-alert` (`rgb(255,255,255)`): wrap and surface are now distinct
  colors, and wrap and panel are also distinct, so the alert reads as a bounded card rather than
  bleeding into the page. Dark half unaffected and still correct (`--ios-bg-grouped` dark is
  `#000000`, `--ios-bg-grouped-secondary` dark is `#1C1C1E`, already contrasting against the
  `#000000` panel).
- **search.html**: both light and dark Cancel buttons measured via
  `getBoundingClientRect().height` in the live DOM — both returned exactly `44`, confirming the
  ≥44pt hit target. Visual screenshot confirmed no layout shift or clipping from the taller hit
  area (the search field stays 36pt tall as designed; only the Cancel button's invisible tap
  target grew).

Scratch dir `.tmp-kit-ios-fix1` deleted after inspection.

Commit: `fix(kit): iOS sheet surfaces visible in light mode; search Cancel hit target`
