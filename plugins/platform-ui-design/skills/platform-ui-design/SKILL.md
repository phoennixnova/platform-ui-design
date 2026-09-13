---
name: platform-ui-design
description: >
  Design and build native-feeling mobile and desktop GUIs that follow Apple's Human Interface
  Guidelines, Android's Material 3 / Android UI guidance, and Microsoft's Fluent / Windows 11
  design guidance. Use when the request involves designing, building, reviewing, or critiquing
  an app interface, screen, or component for iOS, iPadOS, macOS, watchOS, tvOS, visionOS,
  Android phone/tablet/foldable, Wear OS, Android TV, ChromeOS, Android XR, or Windows —
  including SwiftUI, UIKit, AppKit, Jetpack Compose, WinUI/XAML, React Native and Flutter code;
  UI mockups, wireframes and screen flows; design specs, redlines and token systems; and
  HIG / Material / Fluent compliance audits. Triggers on: "design a screen", "iOS app UI",
  "Android app UI", "Windows app UI", "SwiftUI view", "Jetpack Compose screen", "WinUI",
  "does this follow the HIG", "Material 3", "Fluent design", "make this feel native",
  "mobile mockup", "adaptive layout", "tablet layout", "review my UI",
  "accessibility audit of this screen".
---

# Platform UI Design

Produce interfaces that a platform engineer would accept without rework: correct metrics,
correct components, correct idioms, correct accessibility. Never invent numbers — every
dimension, type size, color role and control choice in this skill's `references/` is sourced
from Apple or Google documentation and cited there.

## 0. Orient before designing

Answer these four before writing anything. Ask the user only what you genuinely cannot infer;
one AskUserQuestion round, not an interrogation.

1. **Platform(s)** — Apple, Android, Windows, or a combination. For more than one, read
   `references/cross-platform.md` first (and the delta table in `references/windows-fluent.md`
   if Windows is in scope); they decide what is shared and what forks.
2. **Form factor(s)** — phone / tablet / foldable / desktop / watch / TV / XR. This drives
   breakpoints and navigation chrome more than anything else. Windows and macOS are
   keyboard-and-mouse first with touch secondary — the inverse of mobile; that changes hover
   states, context menus, density and target sizes.
3. **Output mode** — one or more of:
   - **N (native code)** → SwiftUI, Jetpack Compose, or WinUI 3 / XAML. §3.
   - **X (cross-platform code)** → React Native, Flutter, or web. §4.
   - **S (spec / critique)** → written spec, redlines, or an audit of existing UI. §5.
   - **V (visual)** → mockups on a Claude Design canvas. §6.
4. **Design system** — if the user has one (a repo, tokens file, brand kit, existing screens),
   find it and lift exact values. Their system outranks both HIG and Material on color, type
   and spacing; the platform still owns navigation chrome, control anatomy and metrics.

> In a codebase, always search for the design system before drawing: `tokens.*`, `theme.*`,
> `Color.kt`, `Type.kt`, `Theme.kt`, `*.xcassets`, `DesignSystem/`, `tailwind.config.*`,
> Storybook. Say in one line what you matched.

## 1. Non-negotiables

These hold in every mode. Violating one is a bug, not a style choice.

| Rule | Apple | Android | Windows |
|---|---|---|---|
| Min hit target | 44×44 pt (28×28 floor; 60×60 visionOS) | 48×48 dp, 8 dp apart | 40×40 px touch (≈7.5 mm); no published mouse minimum |
| Text sizing | Dynamic Type styles, never fixed pt | `sp` for text, `dp` for all else | Windows type ramp; respect text scaling |
| Scaling support | to 200%+ (AX5 ≈ 300% body) | to 200%, non-linear on 14+ | to 225% display scaling + text scaling |
| Color | Semantic colors (`.label`, `.systemBackground`) | `colorScheme.<role>`, `x`/`onX` pairs | Theme brushes (`TextFillColorPrimary`…) |
| Contrast | 4.5:1 body, 3:1 large text and UI | same | same, plus High Contrast themes |
| Dark mode | Required | Required | Required |
| Layout | Safe areas + layout guides | Window insets; edge-to-edge on SDK 35+ | Resizable windows, snap layouts, DPI |
| Back | Nav-bar back + edge swipe; never suppress | System + predictive back; `BackHandler` | Title-bar back / `BackRequested` |
| Adaptivity | Size classes; iPad ≠ big iPhone | 600/840/1200/1600 dp width classes | 640 / 1008 px breakpoints |
| Icons | SF Symbols | Material Symbols | Segoe Fluent Icons |
| Corner radius | Concentric with the parent | 4/8/12/16/28 dp shape scale | 4 px controls, 8 px overlays |
| Never | Hamburger for primary nav, >5 tabs on iPhone, custom back button, toast | >5 nav destinations, stretched phone layout on tablet, hardcoded hex, ignored insets | Hardcoded colors, custom title bars that break snap, keyboard-inaccessible controls, mouse-only targets |

## 2. Load references on demand

Do not read all of these. Read the ones the task needs.

| File | Read it when |
|---|---|
| `references/apple-foundations.md` | Any Apple work: layout margins, Dynamic Type tables, semantic colors, materials, per-platform differences, Liquid Glass |
| `references/apple-components.md` | Choosing or specifying an Apple control; SwiftUI/UIKit/AppKit API mapping; 106-item mistakes list |
| `references/android-foundations.md` | Any Android work: window size classes, type scale, all 48 color roles, elevation, shape, motion tokens |
| `references/android-components.md` | Choosing or specifying a Material control; Compose API mapping; canonical adaptive layouts; insets |
| `references/windows-fluent.md` | Any Windows work: type ramp, theme brushes, Mica/Acrylic, NavigationView modes, WinUI controls, keyboard-first input |
| `references/device-metrics.md` | Any time you need a device size, bar height, inset or row height — the numbers, with what is published vs. convention marked |
| `references/cross-platform.md` | More than one platform at once; React Native / Flutter adaptation; pt↔dp↔px |
| `references/accessibility.md` | Any a11y question, and **always** before declaring a design done |
| `references/design-canvas.md` | Mode V — producing Claude Design artboards or prompts |
| `references/review-rubric.md` | Mode S — auditing or critiquing an existing interface |

Values in these files are sourced and cited. Where a platform does not publish a number
(Apple no longer publishes numeric layout margins; much of the Material spec site is
un-fetchable), the file says so and marks the working value as convention. Carry that
distinction into your output — never present a convention as a published rule.

## 3. Mode N — native code

**SwiftUI.** Start from the navigation container the IA demands (`NavigationStack`,
`NavigationSplitView`, `TabView`), not from a `VStack`. Use `.font(.body)` etc., never
`.font(.system(size:))`. Use semantic colors and `Color.accentColor`. Use `.safeAreaInset`,
`.scenePadding`, `.listStyle(.insetGrouped)`. Add `.accessibilityLabel` / `.accessibilityHint`
to every non-text control. Support `@Environment(\.dynamicTypeSize)` and
`@Environment(\.accessibilityReduceMotion)`. Use `ViewThatFits` and size classes for iPad.
Look up each control's page in `apple-components.md` before reaching for a custom view — the
stock control is almost always correct.

**Jetpack Compose.** Start from `Scaffold` and **apply its `innerPadding`**. Theme from
`MaterialTheme.colorScheme` / `.typography` / `.shapes` only. Call `enableEdgeToEdge()` and
handle `WindowInsets`. Select navigation by window size class — use `NavigationSuiteScaffold`
so bar→rail→drawer happens automatically. For two-pane screens use
`NavigableListDetailPaneScaffold` or `SupportingPaneScaffold`, not a hand-rolled `Row`.
Add `contentDescription` (or `Modifier.semantics`) to every icon-only control; `null` only for
genuinely decorative images. Use motion tokens for animation, not arbitrary durations.

**WinUI 3 / XAML.** Pick the `NavigationView` pane mode by window width (top for few
destinations, left at ≥1008 px, left-compact between) rather than hardcoding one. Style from
theme resources — `{ThemeResource TextFillColorPrimaryBrush}` and friends — never literal
colors, or High Contrast and dark theme both break. Use Mica for the window base layer and
Acrylic for transient surfaces, not the reverse. Commands go in a `CommandBar`, not scattered
buttons. Set `AutomationProperties.Name` on every control without a visible label, keep tab
order correct, and give every action a keyboard path. Assume mouse and keyboard first: hover
states, tooltips, right-click context menus, and layouts that survive arbitrary window resize.

All three: write the screen at the smallest supported size first, then widen. State which
OS/SDK minimum you targeted.

Need the platform's tokens as a file — for a web/Electron build, a theme module, or a design
system starting point? Dump them:

```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/platform-ui-design/scripts/make-artboards.mjs \
  --tokens android --format css    # or: ios | windows, --format json
```

Emits the full light and dark color set (with a `prefers-color-scheme` block), the accent, the
font stack, the complete type ramp as classes, and the chrome metrics.

## 4. Mode X — cross-platform code

Share the information architecture, content, brand color and copy. Fork the navigation chrome,
control anatomy, typography, motion and back behavior. When a single value must serve both,
take the stricter one — hit targets ship at 48, not 44.

- **React Native** — `Platform.select`, `.ios.tsx` / `.android.tsx` files. Know which core
  components are already adaptive and which are not; `cross-platform.md` has the list.
- **Flutter** — Material vs Cupertino widget sets, the `.adaptive()` constructors,
  `ThemeData.platform` + `adaptations` + `cupertinoOverrideTheme`. There is no
  `ThemeData.adaptive()`.
- **Web/PWA** — follow no platform guideline literally; use WCAG 2.2 AA plus a 48 px target floor.
- **Electron / Tauri desktop** — match the host platform's chrome: traffic lights and a menu
  bar on macOS, Fluent metrics and snap-layout-safe title bars on Windows. A single web UI
  shipped identically to both reads as a website in a window.

Never ship one platform's chrome to the other: a bottom tab bar on Android with iOS chevrons,
or a FAB on iOS, reads as a port.

## 5. Mode S — spec and critique

For a **spec**, produce: screen inventory and IA → navigation model per size class →
per-screen anatomy with real numbers (margins, control heights, type styles, color roles) →
states (loading, empty, error, offline, permission-denied) → motion → accessibility notes →
token table. Cite the guideline behind any non-obvious rule.

For a **critique or audit**, work through `references/review-rubric.md` in order. Report
findings ranked by severity, each with: what is wrong, which guideline it violates (with the
URL from the reference file), and the concrete fix. Do not pad with praise. If you are given a
screenshot only, say what you cannot verify from pixels alone.

## 6. Mode V — visual mockups via Claude Design

Platform mockups belong on a Claude Design canvas, not in a loose HTML file. Read
`references/design-canvas.md` for the full contract; the short version:

1. Generate platform-correct artboard scaffolds:
   ```bash
   node ${CLAUDE_PLUGIN_ROOT}/skills/platform-ui-design/scripts/make-artboards.mjs \
     --platform ios --device iphone --screens Main,Detail,Settings --out ./design
   ```
   This writes one correctly-sized `.dc.html` per screen — real device frame, real safe-area
   insets, the platform type ramp and semantic colors already wired as CSS custom properties
   and tweak-able props — plus a `canvas.json` laying them out. `--platform android` does the
   same with Material 3 tokens, `--platform windows` with Fluent theme brushes, and
   `--platform both` produces a matched iOS/Android pair per screen. `--list` prints every
   device preset with its dimensions.
2. Fill the artboards with the actual design. Keep the tokens; do not hardcode hex.
3. Hand off to the `design` skill (`/design`) to seed and publish the canvas. If that skill is
   unavailable, emit the prompt template at the end of `design-canvas.md` instead — a complete,
   self-contained Claude Design brief carrying the same metrics.

Mockup discipline: no fake status bars, no fake keyboards, no emoji as icons (draw inline SVG
on a 24 px grid), hit targets ≥44 px in the mockup, and check the artboard at its real device
width before handing over.

## 7. Finish

Before calling any deliverable done, run the acceptance checklist at the end of
`references/accessibility.md` against it, and state which items you could not verify. Name the
platform version you targeted and any assumption you made.
