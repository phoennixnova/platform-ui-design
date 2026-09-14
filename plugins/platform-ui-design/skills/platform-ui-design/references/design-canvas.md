# Claude Design handoff

How this skill produces visual mockups. Two paths: **direct** (this skill authors canvas
artboards and the `design` skill publishes them) and **prompt** (this skill emits a complete
Claude Design brief when the canvas isn't reachable).

---

## Path A — direct (preferred)

Available when the session has the `design` skill (`/design`). The two skills share a file
contract: this skill writes `.dc.html` artboards + `canvas.json`, the `design` skill seeds and
publishes them. Neither needs to know the other's internals.

### A1. Generate the scaffold

```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/platform-ui-design/scripts/make-artboards.mjs \
  --platform ios --device iphone --screens Main,Detail,Settings \
  --chrome topbar,bottomnav --out ./design
```

| Flag | Values |
|---|---|
| `--platform` | `ios` · `android` · `windows` · `both` (ios+android pair per screen, stacked in two rows) |
| `--device` | preset key — run `--list` to print all with dimensions |
| `--screens` | comma-separated PascalCase names; one is forced to `Main` (the canvas entry artboard) |
| `--chrome` | any of `topbar,bottomnav,fab,none` |
| `--out` | output directory |

Each artboard arrives with:

- the device's **exact logical size** as the frame, matched in `canvas.json` `w`/`h` and in
  `$preview` — so the frame neither scrolls nor clips
- **real safe-area insets** reserved as empty space (never a drawn status bar — the OS paints
  the real one on top; a painted fake reads as doubled-up)
- **real chrome heights** (44 pt nav bar / 64 dp top app bar / 48 px command bar, 49 pt tab bar
  / 80 dp navigation bar) with the platform's margins
- the platform's **semantic color tokens** as CSS custom properties, light and dark
- the platform's **full type ramp** as classes (`.ios-body`, `.md-title-large`, `.win-subtitle`…)
- two tweaks and only two: `dark` (boolean) and `accent` (color)

With `--platform both`, iOS artboards land on the top row and Android below, so the pair reads
as a comparison. The iOS main screen is `Main.dc.html` (the canvas entry artboard must carry
that name); its siblings take `…IOS` / `…Android` suffixes.

### A2. Fill the artboards

Edit the generated files. Rules that matter:

- **Keep the metrics.** They are the point of the scaffold. Changing a bar height or a margin
  to make something fit is a bug; change the content instead.
- **Keep the tokens.** Style through `var(--ios-label)`, `var(--md-on-surface)`,
  `var(--win-text-primary)`. A literal hex in an artboard defeats the dark-mode tweak and
  misrepresents the platform.
- **Use the type classes**, not ad-hoc `font-size`.
- **Hit targets ≥44 px** in the mockup, and Android rows ≥48.
- **Icons are inline SVG** on a 24 px grid, stroke-based, one consistent style. Never emoji,
  never a dingbat glyph.
- **Flex/grid with `gap`**, never margin-spaced inline siblings — gap survives the canvas
  editor's drag, delete and duplicate operations; whitespace text nodes do not.
- **No fake keyboards, no fake status bars, no fake window controls.**
- Copy is literal text in the markup, not a prop — so the viewer can retype it in place.

Delete the scaffold's placeholder rows entirely; don't leave "Row item 1" anywhere.

### A3. Publish

Hand off to the `design` skill and let it seed and publish. Give it the directory and the
artboard list; do not try to seed the payload yourself.

### A4. Check before handing over

- Content height fits the frame with ~5% slack — a fixed frame clips, it does not shrink.
- Toggle `dark` mentally (or in the published canvas) and confirm every surface, border and
  icon has a dark value.
- Run the artboard past `references/review-rubric.md` passes 1–3.
- Check by reading the `.dc.html` and `canvas.json` (frame size vs. `w`/`h`, tokens, no
  literal hex) — do not open artboards in a browser tab; the published canvas is the place
  to look, and the `design` skill handles that.

---

## Path B — prompt handoff

When the `design` skill is not in the session, emit a brief the user can paste into Claude
Design. Fill every bracket; a brief with unfilled brackets is not a deliverable.

```
Design [N] artboards on one canvas: [screen names].

PLATFORM: [iOS 26 / Android 16 Material 3 / Windows 11 Fluent]
FRAME: [W]×[H] px per artboard, exactly — [device name] logical size.
Lay them out left to right with 120 px gaps, Main first.

RESERVED SPACE — leave empty, draw nothing in it:
- Top safe area: [top] px  (the OS draws the status bar; do not paint one)
- Bottom safe area / gesture inset: [bottom] px
[Windows: Title bar 32 px reserved; the shell draws window controls]

CHROME — use these exact heights:
- [Navigation bar 44 px, translucent, title centered, back chevron leading, primary action trailing]
- [Tab bar 49 px, N destinations max 5, icon above 11 px label]
[or the Android / Windows equivalents]

GRID: side margin [16/24] px. Vertical rhythm on a [8] px step. List rows [44/56] px minimum.

TYPE — use this ramp and nothing else:
[paste the platform ramp rows this design uses: name, size/line-height/weight]

COLOR — semantic roles, no literal hex outside this table:
[paste the token rows this design uses, light and dark values]

ACCENT: [hex]

CONTENT per screen:
[Screen 1]: [what is on it, in reading order, with the real copy]
[Screen 2]: …

RULES:
- Every interactive element ≥44 px tall (Android: ≥48).
- Icons: inline SVG, 24 px grid, stroke-based, consistent weight. No emoji.
- Text contrast ≥4.5:1; UI component contrast ≥3:1. Both themes.
- No fake status bar, no fake keyboard, no lorem ipsum, no invented data.
- One primary action per screen.
- Deliver a light and a dark variant of each screen.
```

Pull the ramp and token rows from `apple-foundations.md`, `android-foundations.md` or
`windows-fluent.md`; pull the frame and chrome numbers from `device-metrics.md`. Paste the
actual rows — a brief that says "use the Material type scale" gets a guessed type scale back.

---

## Updating a canvas later

A canvas already published belongs to the `design` skill's update flow: it reads the artifact
back, extracts the working files, and re-seeds. This skill's job on an update is only to check
the changed artboards against the metrics and the rubric. Do not regenerate the scaffold over a
canvas that has been edited — that discards the design.
