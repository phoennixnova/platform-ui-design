# Android UI Design Foundations — Dense Reference

Scope: Android design guidance (developer.android.com/design/ui) + Material 3 / Material 3 Expressive foundations.
Compiled 2026-09-13.

**Sourcing note.** `m3.material.io` is a client-side-rendered SPA and returns no extractable body text to fetchers. Every numeric token below that would normally be read off m3.material.io has instead been taken from the **generated token source of record** — `androidx.compose.material3.tokens.*` in AOSP/androidx, which is code-generated directly from the Material design token pipeline (files carry `// VERSION: v0_103` / `// GENERATED CODE - DO NOT MODIFY BY HAND`). These are the authoritative values the spec site renders. Source URLs are cited inline per table.

---

## 1. Form factors and where guidance lives

Source: https://developer.android.com/design/ui

| Form factor | Design hub | Notes |
|---|---|---|
| Mobile (phone / tablet / foldable) | https://developer.android.com/design/ui/mobile | Baseline M3 |
| Desktop (incl. ChromeOS, desktop windowing) | https://developer.android.com/design/ui/desktop | Adaptive + windowing |
| XR (headsets, wired XR glasses) | https://developer.android.com/design/ui/xr | Spatial panels, orbiters, spatial elevation |
| AI Glasses | https://developer.android.com/design/ui/ai-glasses | Newest surface |
| Widgets | https://developer.android.com/design/ui/widget | Figma kit |
| Wear OS | https://developer.android.com/design/ui/wear | M3 Expressive for Wear |
| TV | https://developer.android.com/design/ui/tv | Focus-first, 10-foot UI |
| Cars (Auto + AAOS) | https://developer.android.com/design/ui/cars | Driver-distraction constrained |

The hub itself is a router; all numerics live in the per-form-factor guides and in M3.

---

## 2. Window size classes (the single most load-bearing table)

Source of truth (constants): `androidx.window.core.layout.WindowSizeClass`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/window/window-core/src/commonMain/kotlin/androidx/window/core/layout/WindowSizeClass.kt
Docs: https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes · https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes

### 2.1 Width breakpoints

| Class | Range (dp) | Constant | Device reality (Google's published stats) | Implied layout |
|---|---|---|---|---|
| Compact | `w < 600` | — | 99.96% of phones in portrait | 1 pane; bottom navigation bar |
| Medium | `600 ≤ w < 840` | `WIDTH_DP_MEDIUM_LOWER_BOUND = 600` | 93.73% of tablets in portrait; most unfolded inner displays in portrait | 1 pane (Material default) or 2 panes if you opt in; navigation rail |
| Expanded | `840 ≤ w < 1200` | `WIDTH_DP_EXPANDED_LOWER_BOUND = 840` | 97.22% of tablets in landscape; unfolded inner displays in landscape | 2 panes; navigation rail / permanent drawer |
| Large | `1200 ≤ w < 1600` | `WIDTH_DP_LARGE_LOWER_BOUND = 1200` | Large tablet displays | 2–3 panes |
| Extra-large | `w ≥ 1600` | `WIDTH_DP_EXTRA_LARGE_LOWER_BOUND = 1600` | Desktop displays | 3 panes |

### 2.2 Height breakpoints

| Class | Range (dp) | Constant | Device reality | Implied layout |
|---|---|---|---|---|
| Compact | `h < 480` | — | 99.78% of phones in landscape | Hide/collapse top app bar; avoid vertical stacking; force bottom bar |
| Medium | `480 ≤ h < 900` | `HEIGHT_DP_MEDIUM_LOWER_BOUND = 480` | 96.56% of tablets in landscape; 97.59% of phones in portrait | Standard |
| Expanded | `h ≥ 900` | `HEIGHT_DP_EXPANDED_LOWER_BOUND = 900` | 94.25% of tablets in portrait | Allows a 2-row vertical split |

### 2.3 Breakpoint sets — V1 vs V2

`WindowSizeClass.kt` defines two breakpoint sets:

| Set | Width breakpoints | Height breakpoints |
|---|---|---|
| V1 (legacy, 3 buckets) | `0, 600, 840` | `0, 480, 900` |
| V2 (current, 5 buckets) | `0, 600, 840, 1200, 1600` | `0, 480, 900` (unchanged) |

Large/extra-large are **opt-in** in Compose:

```kotlin
val wsc = currentWindowAdaptiveInfo(supportLargeAndXLargeWidth = true).windowSizeClass
val showTopAppBar = wsc.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)
```

### 2.4 Hard rules

- Size classes describe the **app window**, never the device. They change on rotation, multi-window/split-screen, fold/unfold, and free-form resize. Never branch on `Build.MODEL`, screen inches, or `isTablet`.
- **Width dominates.** Decide layout on width first; consult height only for the landscape-phone / tabletop cases (medium width + compact height).
- Recommended optimization order: compact (baseline) → expanded (most headroom) → medium (decide whether a specialized layout earns its keep).
- Size classes are for **top-level** decisions only. Inside a pane, measure available space (`BoxWithConstraints`) rather than re-reading the window class.

---

## 3. Panes, spacing and adaptive layout — concrete dp

Source of truth: `PaneScaffoldDirective.kt`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/adaptive/adaptive-layout/src/commonMain/kotlin/androidx/compose/material3/adaptive/layout/PaneScaffoldDirective.kt

### 3.1 `calculatePaneScaffoldDirective()` — the Material-recommended defaults

| Width class | maxHorizontalPartitions | horizontalPartitionSpacerSize | defaultPanePreferredWidth |
|---|---|---|---|
| Compact | 1 | **0 dp** | **360 dp** |
| Medium | 1 | **0 dp** | **360 dp** |
| Expanded | 2 | **24 dp** | **360 dp** |
| Large / Extra-large | 3 | **24 dp** | **412 dp** |

Vertical partitioning (same function):

| Condition | maxVerticalPartitions | verticalPartitionSpacerSize |
|---|---|---|
| Tabletop posture, **or** (single horizontal partition **and** height class = Expanded) | 2 | **24 dp** |
| Otherwise | 1 | **0 dp** |

`defaultPanePreferredHeight = 420 dp` (`PaneScaffoldDirective.DefaultPreferredHeight`).

Named constants: `DefaultPreferredWidth = 360.dp`, `DefaultPreferredWidthXL = 412.dp`, `DefaultPreferredHeight = 420.dp`.

### 3.2 Two panes at medium width (opt-in, "dense mode")

`calculatePaneScaffoldDirectiveWithTwoPanesOnMediumWidth()` overrides medium width to `maxHorizontalPartitions = 2`, `horizontalPartitionSpacerSize = 24.dp`, and collapses vertical partitioning to 1 / 0 dp unless tabletop. The source itself warns: *"We recommend to use calculatePaneScaffoldDirective, unless you have a strong use case … which can make your layout look too packed."*

### 3.3 Canonical layouts

Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts · https://developer.android.com/guide/topics/large-screens/large-screen-canonical-layouts

| Layout | Compact | Medium | Expanded+ |
|---|---|---|---|
| **List-detail** | List OR detail (single pane, navigate between) | Single pane by default | List + detail side by side, 24 dp spacer |
| **Supporting pane** | Supporting content below main, or in a bottom sheet | **50 / 50** split | **70 / 30** (main / supporting) |
| **Feed** | Single column (behaves as `LazyColumn`) | Adaptive grid | Adaptive grid |

Feed grid reference implementation: `LazyVerticalGrid(columns = GridCells.Adaptive(minSize = 180.dp))`.

### 3.4 Spacing / grid system

Material's layout grid is built on a **4 dp baseline grid**, with **8 dp** as the practical increment for component spacing and padding; 4 dp is reserved for fine adjustments (icon offsets, dense rows, TV vertical rhythm). Layout regions decompose as **margins → panes → gutters (spacers) → columns → padding**; the codelab (https://developer.android.com/codelabs/adaptive-material-guidance) works the 12-column grid model and shows 16 dp pane padding and 24 dp separation between stacked feed cards and beneath header groups.

Practical spacing ladder (4 dp multiples, in order of frequency of use):

| Step | dp | Typical use |
|---|---|---|
| 1× | 4 | Icon↔label nudge, dense list internal |
| 2× | 8 | Minimum gap between two touch targets; chip gaps |
| 3× | 12 | Card internal padding (compact) |
| 4× | 16 | **Default screen side margin, compact width**; list item padding |
| 6× | 24 | **Pane spacer (expanded+)**; section separation; margin at medium/expanded |
| 8× | 32 | Large section breaks |
| 12× | 48 | Minimum touch target; large-screen hero spacing |

**Max content width.** Android's guidance is explicit that you must cap measure: set a max width on text-bearing content so lines do not stretch on wide windows. The stated readability target is **~60 characters per line** (https://developer.android.com/codelabs/adaptive-material-guidance). The concrete mechanism is the pane preferred width above — **360 dp** per pane (412 dp at XL), which is the number to reach for when you need a hard cap on a single reading column.

### 3.5 Navigation component per size class

Source: `NavigationSuiteScaffoldDefaults` in
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3-adaptive-navigation-suite/src/commonMain/kotlin/androidx/compose/material3/adaptive/navigationsuite/NavigationSuiteScaffold.kt

Current (Expressive) selector, `navigationSuiteType(adaptiveInfo)`:

| Condition | Navigation component |
|---|---|
| width class == Compact | `ShortNavigationBarCompact` |
| tabletop posture **or** height class == Compact | `ShortNavigationBarMedium` |
| otherwise | `WideNavigationRailCollapsed` |

Legacy selector, `calculateFromAdaptiveInfo(adaptiveInfo)`:

| Condition | Navigation component |
|---|---|
| tabletop **or** height == Compact **or** width == Compact | `NavigationBar` |
| otherwise | `NavigationRail` |

`WideNavigationRailExpanded` and `NavigationDrawer` exist as explicit opt-in types for expanded/large windows. Navigation suite container color defaults to `colorScheme.background`, content to `colorScheme.onBackground`.

---

## 4. Type scale (Material 3 baseline)

Source of truth: `TypeScaleTokens.kt` (VERSION v0_103) + `TypefaceTokens.kt`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt
Docs: https://developer.android.com/develop/ui/compose/designsystems/material3

Baseline typeface: **Roboto** (`TypefaceTokens.Plain` and `.Brand` both resolve to Roboto in the baseline theme). Weights: Regular = `FontWeight.Normal` (400), Medium = `FontWeight.Medium` (500), Bold = `FontWeight.Bold` (700).

### 4.1 The 15 baseline styles

| Style | Size (sp) | Line height (sp) | Weight | Tracking (sp) |
|---|---|---|---|---|
| Display Large | 57 | 64 | Regular 400 | **−0.2** |
| Display Medium | 45 | 52 | Regular 400 | 0 |
| Display Small | 36 | 44 | Regular 400 | 0 |
| Headline Large | 32 | 40 | Regular 400 | 0 |
| Headline Medium | 28 | 36 | Regular 400 | 0 |
| Headline Small | 24 | 32 | Regular 400 | 0 |
| Title Large | 22 | 28 | Regular 400 | 0 |
| Title Medium | 16 | 24 | Medium 500 | 0.2 |
| Title Small | 14 | 20 | Medium 500 | 0.1 |
| Body Large | 16 | 24 | Regular 400 | 0.5 |
| Body Medium | 14 | 20 | Regular 400 | 0.2 |
| Body Small | 12 | 16 | Regular 400 | 0.4 |
| Label Large | 14 | 20 | Medium 500 | 0.1 |
| Label Medium | 12 | 16 | Medium 500 | 0.5 |
| Label Small | 11 | 16 | Medium 500 | 0.5 |

Display Large is the only negative-tracking style in the baseline scale.

### 4.2 Emphasized variants (Material 3 Expressive)

Expressive adds a parallel `*Emphasized` scale — same size and line height, heavier weight, retuned tracking. Use for a single emphasized element per view, not as a global upgrade.

| Style | Size (sp) | Line height (sp) | Weight | Tracking (sp) |
|---|---|---|---|---|
| Display Large Emphasized | 57 | 64 | Medium 500 | 0 |
| Display Medium Emphasized | 45 | 52 | Medium 500 | 0 |
| Display Small Emphasized | 36 | 44 | Medium 500 | 0 |
| Headline Large Emphasized | 32 | 40 | Medium 500 | 0 |
| Headline Medium Emphasized | 28 | 36 | Medium 500 | 0 |
| Headline Small Emphasized | 24 | 32 | Medium 500 | 0 |
| Title Large Emphasized | 22 | 28 | Medium 500 | 0 |
| Title Medium Emphasized | 16 | 24 | **Bold 700** | 0.15 |
| Title Small Emphasized | 14 | 20 | **Bold 700** | 0.1 |
| Body Large Emphasized | 16 | 24 | Medium 500 | 0.15 |
| Body Medium Emphasized | 14 | 20 | Medium 500 | 0.25 |
| Body Small Emphasized | 12 | 16 | Medium 500 | 0.4 |
| Label Large Emphasized | 14 | 20 | **Bold 700** | 0.1 |
| Label Medium Emphasized | 12 | 16 | **Bold 700** | 0.5 |
| Label Small Emphasized | 11 | 16 | **Bold 700** | 0.5 |

Note: baseline Display Large tracking is −0.2 sp, whereas Display Large **Emphasized** is 0 — the emphasized scale does not carry the negative tracking.

### 4.3 Role assignment

| Family | Use |
|---|---|
| Display | Short, high-impact hero text only. Large screens / expressive moments. Rarely more than a few words. |
| Headline | Top of a screen or a major section; short, high-emphasis. |
| Title | Medium-emphasis; section headers, list item primary text, app bar titles (Title Large = 22 sp). |
| Body | Long-form reading. Body Large (16/24) is the default reading size. |
| Label | UI chrome that is not prose: buttons (Label Large 14 sp), tabs, chips, captions, overline. |

### 4.4 sp vs dp — non-negotiable

- **All text sizes and text line heights use `sp`.** `sp` scales with the user's font-size accessibility setting; `dp` does not.
- **Everything else uses `dp`** — paddings, margins, corner radii, elevation, icon sizes, touch targets, stroke widths.
- Never set a fixed `dp` height on a text container. Let it grow; test at 200% font scale (Android supports up to 200% system font scaling, plus non-linear scaling from Android 14 onward, which compresses growth of already-large text so Display/Headline do not explode).
- Test with `@WearPreviewFontScales` / large-font previews. Font sizes change **non-linearly** under accessibility settings (https://developer.android.com/design/ui/wear/guides/foundations/adaptive-design).

---

## 5. Color system

### 5.1 Full color role list

Source of truth: `ColorScheme` constructor (48 roles)
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt
Docs: https://m3.material.io/styles/color/roles · https://developer.android.com/develop/ui/compose/designsystems/material3

**Accent groups (4 × 4 roles):**

| Role | Purpose |
|---|---|
| `primary` | Highest-emphasis fills: filled buttons, FAB container, active states, selected indicators |
| `onPrimary` | Content drawn **on** `primary` |
| `primaryContainer` | Lower-emphasis primary fill; a standout container |
| `onPrimaryContainer` | Content on `primaryContainer` |
| `secondary` | Less-prominent accents: filter chips, secondary toggles |
| `onSecondary` / `secondaryContainer` / `onSecondaryContainer` | Same pattern |
| `tertiary` | Contrasting accent to balance primary/secondary; used for highlights, input fields, badges |
| `onTertiary` / `tertiaryContainer` / `onTertiaryContainer` | Same pattern |
| `error` | Error indication |
| `onError` / `errorContainer` / `onErrorContainer` | Same pattern |

**Surface family:**

| Role | Purpose |
|---|---|
| `surface` | Default background for surfaces/components |
| `onSurface` | Highest-emphasis text/icons on any surface |
| `onSurfaceVariant` | Lower-emphasis text/icons, inactive icons, helper text |
| `surfaceVariant` | Differentiated surface fill (legacy-leaning; prefer `surfaceContainer*`) |
| `surfaceDim` | Dimmest surface tone in the scheme |
| `surfaceBright` | Brightest surface tone in the scheme |
| `surfaceContainerLowest` | Lowest container emphasis (furthest back) |
| `surfaceContainerLow` | |
| `surfaceContainer` | **Default container fill** — the workhorse |
| `surfaceContainerHigh` | |
| `surfaceContainerHighest` | Highest container emphasis (closest to viewer) |
| `surfaceTint` | The color used for tonal elevation overlay (= `primary` by default) |
| `background` / `onBackground` | Legacy pair; in M3 baseline it equals `surface`/`onSurface` |

**Outline and inverse:**

| Role | Purpose |
|---|---|
| `outline` | Important boundaries — text field borders, outlined button borders. Must meet 3:1 vs adjacent fill |
| `outlineVariant` | Decorative dividers/separators where 3:1 is *not* required |
| `inverseSurface` | Surface that contrasts with the current theme (snackbars) |
| `inverseOnSurface` | Content on `inverseSurface` |
| `inversePrimary` | Actionable accent on `inverseSurface` (snackbar action) |
| `scrim` | Behind modal sheets/dialogs/drawers; always Neutral tone 0 (black), applied with alpha |

**Fixed roles (12)** — identical in light and dark, for cross-theme surfaces (e.g. a card that must look the same in both):
`primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant`, and the same four for `secondary` and `tertiary`.

### 5.2 The contrast-safe pairing rule

**Rule: only ever pair a role with its `on`-prefixed counterpart.** The tonal palette is constructed so that each `X` / `onX` pair clears WCAG contrast. Any other combination is unverified and usually fails.

| Container role | Its only guaranteed-safe content role |
|---|---|
| `primary` | `onPrimary` |
| `primaryContainer` | `onPrimaryContainer` |
| `secondary` | `onSecondary` |
| `secondaryContainer` | `onSecondaryContainer` |
| `tertiary` | `onTertiary` |
| `tertiaryContainer` | `onTertiaryContainer` |
| `error` | `onError` |
| `errorContainer` | `onErrorContainer` |
| `surface`, and **every** `surfaceContainer*`, `surfaceDim`, `surfaceBright` | `onSurface` (high emphasis) or `onSurfaceVariant` (medium emphasis) |
| `background` | `onBackground` |
| `inverseSurface` | `inverseOnSurface`, with `inversePrimary` for actions |
| `surfaceVariant` | `onSurfaceVariant` |
| `primaryFixed` / `primaryFixedDim` | `onPrimaryFixed` (high) / `onPrimaryFixedVariant` (medium) |

```kotlin
// correct
containerColor = MaterialTheme.colorScheme.primary,
contentColor   = MaterialTheme.colorScheme.onPrimary

// wrong — two container roles, contrast unverified
containerColor = MaterialTheme.colorScheme.tertiaryContainer,
contentColor   = MaterialTheme.colorScheme.primaryContainer
```

Corollary: **all `surfaceContainer*` levels share the same `onSurface` / `onSurfaceVariant` pair.** That is the point of the 5-step container ramp — you can restack elevation without re-checking text contrast.

### 5.3 Tonal palettes and the tone→role mapping

M3 derives the scheme from **five key colors** (primary, secondary, tertiary, neutral, neutral-variant, plus error), each expanded into a **tonal palette** indexed 0 (black) → 100 (white).

Tones present in the baseline palette (`PaletteTokens.kt`):
`0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100`

The extra tones (4, 6, 12, 17, 22, 24, 87, 92, 94, 96) exist specifically to feed the `surfaceContainer*` ramp added in M3.

Source: `ColorLightTokens.kt` / `ColorDarkTokens.kt`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ColorLightTokens.kt

| Role | Light tone | Dark tone |
|---|---|---|
| `primary` | Primary **40** | Primary **80** |
| `onPrimary` | Primary 100 | Primary 20 |
| `primaryContainer` | Primary 90 | Primary 30 |
| `onPrimaryContainer` | Primary 10 | Primary 90 |
| `inversePrimary` | Primary 80 | Primary 40 |
| `secondary` | Secondary 40 | Secondary 80 |
| `onSecondary` | Secondary 100 | Secondary 20 |
| `secondaryContainer` | Secondary 90 | Secondary 30 |
| `onSecondaryContainer` | Secondary 10 | Secondary 90 |
| `tertiary` | Tertiary 40 | Tertiary 80 |
| `onTertiary` | Tertiary 100 | Tertiary 20 |
| `tertiaryContainer` | Tertiary 90 | Tertiary 30 |
| `onTertiaryContainer` | Tertiary 10 | Tertiary 90 |
| `error` | Error 40 | Error 80 |
| `onError` | Error 100 | Error 20 |
| `errorContainer` | Error 90 | Error 30 |
| `onErrorContainer` | Error 10 | Error 90 |
| `background` | Neutral 98 | Neutral 6 |
| `onBackground` | Neutral 10 | Neutral 90 |
| `surface` | Neutral **98** | Neutral **6** |
| `onSurface` | Neutral 10 | Neutral 90 |
| `surfaceVariant` | NeutralVariant 90 | NeutralVariant 30 |
| `onSurfaceVariant` | NeutralVariant 30 | NeutralVariant 80 |
| `surfaceDim` | Neutral 87 | Neutral 6 |
| `surfaceBright` | Neutral 98 | Neutral 24 |
| `surfaceContainerLowest` | Neutral **100** | Neutral **4** |
| `surfaceContainerLow` | Neutral 96 | Neutral 10 |
| `surfaceContainer` | Neutral 94 | Neutral 12 |
| `surfaceContainerHigh` | Neutral 92 | Neutral 17 |
| `surfaceContainerHighest` | Neutral **90** | Neutral **22** |
| `inverseSurface` | Neutral 20 | Neutral 90 |
| `inverseOnSurface` | Neutral 95 | Neutral 20 |
| `outline` | NeutralVariant 50 | NeutralVariant 60 |
| `outlineVariant` | NeutralVariant 80 | NeutralVariant 30 |
| `scrim` | Neutral 0 | Neutral 0 |
| `primaryFixed` | Primary 90 | Primary 90 |
| `primaryFixedDim` | Primary 80 | Primary 80 |
| `onPrimaryFixed` | Primary 10 | Primary 10 |
| `onPrimaryFixedVariant` | Primary 30 | Primary 30 |
| `secondaryFixed` / `Dim` / `on` / `onVariant` | Sec 90 / 80 / 10 / 30 | identical |
| `tertiaryFixed` / `Dim` / `on` / `onVariant` | Ter 90 / 80 / 10 / 30 | identical |

Read the surface ramp directionally: **light containers get *darker* as emphasis rises (100 → 90); dark containers get *lighter* (4 → 22).** Both move away from the base surface tone.

### 5.4 Dynamic color

Source: https://developer.android.com/develop/ui/compose/designsystems/material3

- Android **12 (API 31)** and above. Derives the source color from the user's wallpaper (or a user-picked theme color) and regenerates all tonal palettes.
- Compose: `dynamicLightColorScheme(context)` / `dynamicDarkColorScheme(context)`; gate on `Build.VERSION.SDK_INT >= Build.VERSION_CODES.S`.

```kotlin
val dynamicColor = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
val colors = when {
    dynamicColor && darkTheme  -> dynamicDarkColorScheme(LocalContext.current)
    dynamicColor && !darkTheme -> dynamicLightColorScheme(LocalContext.current)
    darkTheme -> DarkColorScheme
    else      -> LightColorScheme
}
```

- Always ship a **static fallback scheme** for API < 31 and for users who disable it.
- Never hardcode a hex where a role exists — dynamic color only works if the UI is expressed entirely in roles.
- Brand-critical color (a logo, a regulated status color) should be a **custom color role** added alongside the scheme, not `primary`.

---

## 6. Elevation

Source of truth: `ElevationTokens.kt` (VERSION v0_103)
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevationTokens.kt

### 6.1 The six levels

| Level | dp | Typical components |
|---|---|---|
| **0** | **0** | Default surfaces; filled/text/outlined buttons at rest; filled cards at rest; top app bar at rest; navigation rail; side sheets; full-screen surfaces |
| **1** | **1** | Elevated card at rest; filled button *pressed*; docked bottom/standard sheets; elevated chip; extended FAB lowered |
| **2** | **3** | Navigation bar; bottom app bar; menus/dropdowns; elevated button hover/focus; elevated card hover; top app bar on scroll |
| **3** | **6** | Dialogs; search bar; snackbar; filled card dragged; FAB at rest; extended FAB at rest; modal bottom sheet |
| **4** | **8** | Navigation drawer (modal); elevated card dragged; extended FAB hover/focus |
| **5** | **12** | FAB pressed/dragged; highest transient states |

(Component mappings verified against `NavigationBarTokens`, `BottomAppBarTokens`, `MenuTokens` → Level2; `DialogTokens`, `SearchBarTokens`, `SnackbarTokens` → Level3; `ElevatedCardTokens` → Level1/2/4; `FilledCardTokens` → Level0/1/3; `FilledButtonTokens` → Level0/1; `ElevatedButtonTokens` → Level0/1/2; `SheetBottomTokens` → Level1.)

### 6.2 M3 elevation is tonal + shadow

M3 splits elevation into two independent channels:

```kotlin
Surface(
    tonalElevation  = 8.dp,   // tints the surface toward surfaceTint (= primary)
    shadowElevation = 2.dp    // casts an actual drop shadow
) { /* … */ }
```

- **Tonal elevation** applies a color overlay derived from `surfaceTint`. The overlay alpha in Compose is computed as
  `alpha = ((4.5f * ln(elevation.value + 1f)) + 2f) / 100f`
  (`ColorScheme.kt`) — a logarithmic ramp, so the first dp of elevation buys the most separation.
- **Shadow elevation** is the classic z-shadow.
- In **light** theme, tonal overlay shifts the surface toward the primary hue and the shadow does most of the separation work.
- In **dark** theme, tonal overlay does most of the work (shadows are nearly invisible on dark ground) — this is why M3 raises surface *lightness* with elevation in dark mode.
- **Preferred modern approach:** express elevation with the `surfaceContainer*` ramp (§5.3) rather than `tonalElevation`, and reserve `shadowElevation` for components that genuinely float (FAB, dialog, menu). The container ramp is deterministic, contrast-checked, and does not tint content.
- Do not stack more than 2–3 elevation steps in one view; the ramp only has five perceptible stops.

---

## 7. Shape

Source of truth: `ShapeTokens.kt` (VERSION 14_1_0)
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt

### 7.1 Baseline shape scale

| Token | Corner radius | Typical components |
|---|---|---|
| **None** | **0 dp** (`RectangleShape`) | Full-bleed surfaces, edge-to-edge images, bottom of a bottom sheet |
| **Extra small** | **4 dp** | Menus, snackbars, text field containers, small chips |
| **Small** | **8 dp** | Chips, small components |
| **Medium** | **12 dp** | Cards, small FAB |
| **Large** | **16 dp** | Navigation drawer, FAB, extended FAB, large card |
| **Extra large** | **28 dp** | Dialogs, bottom sheets (top corners), large FAB, search bar results |
| **Full** | pill (`CircleShape`) | Buttons, chips (Expressive), toggle buttons, badges, FAB (Expressive) |

Note: the Compose `Shapes()` convenience API historically defaulted `extraLarge` to **24 dp** in older samples; the **token of record is 28 dp** (`CornerExtraLarge = RoundedCornerShape(28.dp)`). Trust the token.

### 7.2 Expressive additions

| Token | Corner radius |
|---|---|
| `CornerLargeIncreased` | **20 dp** |
| `CornerExtraLargeIncreased` | **32 dp** |
| `CornerExtraExtraLarge` | **48 dp** |

### 7.3 Directional variants

The token set ships pre-cut one-sided shapes so you do not hand-roll them:

| Token | Geometry |
|---|---|
| `CornerExtraSmallTop` | top 4 dp, bottom 0 |
| `CornerLargeTop` | top 16 dp, bottom 0 |
| `CornerExtraLargeTop` | top 28 dp, bottom 0 — **the bottom-sheet shape** |
| `CornerLargeStart` | start corners 16 dp, end 0 |
| `CornerLargeEnd` | end corners 16 dp, start 0 |

Directional variants exist because a surface anchored to an edge should not round the anchored side.

---

## 8. Motion

### 8.1 Easing tokens

Source of truth: `MotionTokens.kt` (VERSION v0_103)
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt

| Token | cubic-bezier | Use |
|---|---|---|
| **Emphasized** | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | The default for the most important transitions — elements that both enter and remain on screen |
| **Emphasized decelerate** | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` | Elements **entering** the screen at full velocity, settling |
| **Emphasized accelerate** | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` | Elements **exiting** the screen permanently |
| **Standard** | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Simple, small, utility transitions |
| **Standard decelerate** | `cubic-bezier(0.0, 0.0, 0.0, 1.0)` | Simple entrance |
| **Standard accelerate** | `cubic-bezier(0.3, 0.0, 1.0, 1.0)` | Simple exit |
| **Linear** | `cubic-bezier(0.0, 0.0, 1.0, 1.0)` | Progress indicators, continuous/looping motion, cross-fades of equal-weight content |
| Legacy (M2) | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | Deprecated; M2 standard |
| Legacy accelerate | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Deprecated |
| Legacy decelerate | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Deprecated |

Observation worth internalizing: **Emphasized and Standard share the same primary curve** `(0.2, 0, 0, 1)`; they diverge only in their accelerate/decelerate variants. The real difference between "emphasized" and "standard" motion in practice is **duration**, not curve.

### 8.2 Duration tokens

| Token | ms | Token | ms |
|---|---|---|---|
| `short1` | **50** | `long1` | **450** |
| `short2` | **100** | `long2` | **500** |
| `short3` | **150** | `long3` | **550** |
| `short4` | **200** | `long4` | **600** |
| `medium1` | **250** | `extraLong1` | **700** |
| `medium2` | **300** | `extraLong2` | **800** |
| `medium3` | **350** | `extraLong3` | **900** |
| `medium4` | **400** | `extraLong4` | **1000** |

Selection heuristic:

| Change | Duration band |
|---|---|
| Icon/state toggle, ripple, small fade | short1–short4 (50–200 ms) |
| Component expand/collapse, menu, chip selection | medium1–medium4 (250–400 ms) |
| Full-screen or container transform, shared-element | long1–long4 (450–600 ms) |
| Large-screen / very large travel distance, ambient | extraLong1–extraLong4 (700–1000 ms) |

Rules: exits are shorter than entrances; larger surfaces and longer travel distances take longer; never exceed ~1000 ms for a user-initiated transition; honor the system "Remove animations" / reduced-motion setting.

### 8.3 Motion schemes (Material 3 Expressive) — spring-based

Source: `MotionScheme.kt`, `StandardMotionTokens.kt`, `ExpressiveMotionTokens.kt`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MotionScheme.kt

Expressive replaces duration+easing with **physics springs**, split into *spatial* (things that move: position, size) and *effects* (things that do not: color, alpha). Effects springs are always critically damped (ratio 1.0) so color never overshoots.

| Spec | Standard damping / stiffness | Expressive damping / stiffness |
|---|---|---|
| `defaultSpatialSpec` | 0.9 / 700 | **0.8 / 380** |
| `fastSpatialSpec` | 0.9 / 1400 | **0.6 / 800** |
| `slowSpatialSpec` | 0.9 / 300 | **0.8 / 200** |
| `defaultEffectsSpec` | 1.0 / 1600 | 1.0 / 1600 |
| `fastEffectsSpec` | 1.0 / 3800 | 1.0 / 3800 |
| `slowEffectsSpec` | 1.0 / 800 | 1.0 / 800 |

Expressive spatial springs are **softer and bouncier** (lower damping, much lower stiffness) — that is the entire perceptual difference. Effects springs are identical between schemes. Access via `MaterialTheme.motionScheme` (`LocalMotionScheme` was deprecated in material3 1.5.0-alpha27).

### 8.4 Interaction state layers

Source of truth: `StateTokens.kt`
https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt

A state layer is a translucent overlay of the component's **content color** painted over its container.

| State | Opacity |
|---|---|
| Hovered | **0.08** |
| Focused | **0.10** |
| Pressed | **0.10** |
| Dragged | **0.16** |
| Enabled / resting | 0 (no layer) |

Disabled (Material convention, applied as alpha not as a state layer):

| Element | Alpha |
|---|---|
| Disabled content (text/icon) | **0.38** |
| Disabled container | **0.12** |

Every interactive component must express: enabled, disabled, hovered, focused, pressed, dragged (where applicable), plus selected/activated where it is a toggle. Focus must be visible — it is the keyboard, D-pad, and switch-access affordance, and on TV it is the *only* affordance.

---

## 9. Touch targets and accessibility

Source: https://developer.android.com/guide/topics/ui/accessibility/apps · `InteractiveComponentSize.kt`

### 9.1 Targets

| Rule | Value |
|---|---|
| Minimum touch target | **48 dp × 48 dp** |
| Minimum spacing between adjacent targets | **8 dp** |
| Compose enforcement | `Modifier.minimumInteractiveComponentSize()` reserves ≥ 48 dp; `LocalMinimumInteractiveComponentSize` controls it |
| Exception | Pointer-precise input (mouse/trackpad/stylus) may use smaller targets; touch may not |
| TV / D-pad | Target size is less critical than a visible, unambiguous **focus** state |

Built-in M3 components (`Button`, `IconButton`, `Checkbox`, `RadioButton`, `Switch`, `ListItem`) already enforce 48 dp even when their *visual* bounds are smaller — a 24 dp checkbox still consumes a 48 dp target. Do not defeat this by clamping size.

### 9.2 Contrast

| Content | Minimum ratio |
|---|---|
| Text < 18 sp, or bold text < 14 sp ("small text") | **4.5 : 1** |
| Text ≥ 18 sp, or bold ≥ 14 sp ("large text") | **3 : 1** |
| Meaningful non-text: icons, form-field borders, focus indicators, chart strokes | **3 : 1** |
| Decorative dividers (`outlineVariant`) | no requirement |

Baseline M3 tonal pairs are engineered to clear these. Custom colors are not — verify with Accessibility Scanner (`com.google.android.apps.accessibility.auditor`) or a contrast checker. M3 also ships **medium-contrast** and **high-contrast** scheme variants to satisfy the system's increased-contrast accessibility setting; generate them alongside your standard scheme.

Never encode meaning in color alone — pair with an icon, label, shape, or position.

### 9.3 Semantics

- Every non-text interactive element needs a `contentDescription`.
- Describe **purpose, not appearance**: "Share", not "Share button" (the `Role` supplies "button"), and never "share icon".
- Set `Role.Button` / `Role.Switch` / `Role.Checkbox` semantics so the correct affordance is announced.
- `Text` composables announce themselves — do not add a description.
- Decorative images: pass `contentDescription = null` or `Modifier.hideFromAccessibility()`.
- List items must have **unique** descriptions reflecting their content.
- Merge semantics for composite rows (`Modifier.semantics(mergeDescendants = true)`) so a list row is one swipe stop, not five.

---

## 10. Dark theme

Source: https://developer.android.com/develop/ui/views/theming/darktheme

### 10.1 Rules

| Rule | Detail |
|---|---|
| Never hardcode colors | Use roles (`colorScheme.*`) / theme attributes (`?attr/colorSurface`, `?attr/colorOnSurface`, `?android:attr/textColorPrimary`, `?attr/colorControlNormal`, `?android:attr/colorBackground`) |
| Surfaces are **not** pure black | M3 dark `surface` = Neutral **6**, `surfaceContainerLowest` = Neutral **4**. Pure black (#000) raises OLED smearing and crushes elevation cues |
| Text is **not** pure white | Dark `onSurface` = Neutral **90**, not 100. Full-white body text on near-black causes halation |
| Desaturate accents | Dark `primary` = tone **80** vs light tone **40** — lighter *and* lower chroma. Saturated brand colors vibrate against dark ground |
| Elevation raises lightness | In dark mode, higher surfaces get *lighter* (Neutral 4 → 10 → 12 → 17 → 22). Shadows barely read; tone carries the hierarchy |
| Preserve contrast ratios | The 4.5:1 / 3:1 requirements apply equally in dark; re-verify custom colors in both schemes |
| Follow the system | Default to `MODE_NIGHT_FOLLOW_SYSTEM`; offer explicit Light / Dark / System |
| Theme inheritance | `Theme.Material3.DayNight.*` (views) or a single `MaterialTheme(colorScheme = …)` swap (Compose) |
| Scrim | `scrim` is Neutral 0 in both schemes; only its alpha varies |

### 10.2 Anti-patterns

- Assuming the background is light.
- Hardcoding text color while theming the background (invisible text).
- Static single-color drawables/vector icons — tint them from theme attributes.
- Hardcoded colors in the launch/splash screen — use `?android:attr/colorBackground`.
- Reusing a light-theme elevation shadow strategy in dark mode instead of the surface ramp.

### 10.3 Force Dark

Android 10+ can auto-darken a light-only app: `android:forceDarkAllowed="true"` on the activity theme, disableable per-view via `setForceDarkAllowed(false)`. It is **not applied** if the app already uses a DayNight/dark theme. Treat it as a migration crutch, never a design.

---

## 11. Material 3 Expressive — status and dates

| Event | Date | Source |
|---|---|---|
| Material 3 Expressive announced | **May 13, 2025** | https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/ |
| Stated target platforms at announcement | Android 16, Wear OS 6 | same |
| Shipped to users (Pixel, Android 16 QPR1) | **September 3, 2025** | https://9to5google.com/2025/09/03/android-16-qpr1-pixel/ |
| Compose Material3 stable line carrying Expressive APIs | **1.4.0** | https://developer.android.com/jetpack/androidx/releases/compose-material3 |
| Current alpha line | **1.5.0-alpha28**, September 9, 2026 | same |

Caveat on dates: the compose-material3 release page's version table renders ambiguously to text extraction (the 1.4.0 row's date read back inconsistently across fetches). Treat "1.4.0 = current stable, 1.5.0-alphaN = current alpha as of Sept 2026" as reliable and re-verify the precise 1.4.0 GA day against the release notes page before quoting it.

### 11.1 What Expressive actually changes

Design (per blog.google, May 13 2025):
- Springy, physics-based animation replacing fixed-duration easing for spatial motion (§8.3).
- Emphasized typography — the parallel heavier type scale (§4.2).
- Shape-morphing elements; a wider shape scale up to 48 dp (§7.2).
- More dynamic color theming; customizable Quick Settings; Live Updates for real-time progress.
- Wear OS 6: round-display-first layouts, fluid scroll animation, shape-morphing at small sizes, watch-face-synced theming, stretch buttons, richer tiles, ~10% battery improvement.

API surface, per compose-material3 release notes:
- Graduated to stable during 1.5.0 alphas: expressive button APIs and `ToggleButton` (alpha19), `ButtonGroup` (alpha19), FAB and FAB Menu (alpha19), expressive menu APIs (alpha19), `SplitButton` (alpha22), `TopAppBar` / `MediumFlexibleTopAppBar` / `LargeFlexibleTopAppBar` / `TwoRowsTopAppBar` / `FlexibleBottomAppBar` (alpha23), SearchBar state APIs (alpha24), `BottomAppBar` (alpha26).
- Still experimental: `ExpressiveTimePicker` (alpha23), expressive non-interactive list items (alpha23), `material3-ripple` with focus rings (alpha24).
- `LocalMotionScheme` deprecated in favor of `MaterialTheme.motionScheme` (alpha27).
- New navigation components: `ShortNavigationBar` (Compact/Medium), `WideNavigationRail` (Collapsed/Expanded) — see §3.5.

Adoption guidance: Expressive is **additive**. The baseline type scale, color roles, elevation levels and shape scale are unchanged; Expressive layers on emphasized type, extra shape steps, spring motion and new component variants. Do not apply emphasis everywhere — its value is contrast against a calm baseline.

---

## 12. Per-form-factor numerics

### 12.1 TV

Source: https://developer.android.com/design/ui/tv/guides/styles/layouts

| Spec | Value |
|---|---|
| Design canvas | **960 × 540 dp** (mdpi); 16:9 fixed |
| Asset authoring | 1080p, downscale to 720p |
| Overscan safe margin, left/right | **48 dp** (5% of 960) |
| Overscan safe margin, top/bottom | **27 dp** (5% of 540; commonly rounded to 24 dp) |
| Alternative 5% margin spec | 58 dp sides, 28 dp top/bottom |
| Grid | **12 columns**, column width **52 dp**, gutter **20 dp** |
| Vertical rhythm | **4 dp** |

Card widths by column span: 1-up **844 dp**, 2-up **412 dp**, 3-up **268 dp**, 4-up **196 dp**, 5-up **124 dp**.

TV is **focus-first**: there is no pointer, so every interactive element needs an unmistakable focus state (scale + elevation + border), and focus order must follow D-pad geometry. See https://developer.android.com/design/ui/tv/guides/foundations/design-for-tv.

### 12.2 Wear OS

Sources: https://developer.android.com/design/ui/wear/guides/foundations/adaptive-design · https://developer.android.com/training/wearables/compose/screen-size

| Spec | Value |
|---|---|
| Small screens | **192–224 dp** |
| Large screens | **225 dp and above** |
| Small/large breakpoint | **225 dp** (`LARGE_DISPLAY_BREAKPOINT = 225`, compare against `screenWidthDp`) |
| Minimum size to test | **192 dp** |
| "Small first" design target | **204–216 dp** |
| Margins | **Percentage-based**, never absolute — top, bottom and sides. Use `rememberResponsiveColumnPadding` (Horologist) and pass it to both `ScreenScaffold.contentPadding` and `TransformingLazyColumn.contentPadding` |

Principles: scrolling layouts are the default (they absorb both screen-size and font-scale variance); larger screens must show **equal or more** content, never less; font sizes scale non-linearly under accessibility settings, so never pin heights. Preview with `@WearPreviewDevices` and `@WearPreviewFontScales`; screenshot-test across representative sizes.

### 12.3 XR

Source: https://developer.android.com/design/ui/xr

Concepts rather than dp: decompose the app into **spatial panels**; float chrome into **orbiters**; use **spatial elevation** for depth; adopt **larger target sizes** than touch (gaze + pinch is less precise than a fingertip); 3D content for scale and realism. Principles: start where users already are (a 2D app should spatialize progressively), keep users comfortable (avoid forced head motion, respect field of view), add discrete key XR moments rather than spatializing everything, stay accessible.

### 12.4 Desktop / large screens

Use the width classes in §2 with large/extra-large enabled. Expect free-form resize at any instant — layouts must be continuous, not snap-only. Support keyboard navigation, hover states, right-click, and window resize down to compact width. See https://developer.android.com/design/ui/desktop/guides/foundations/get-started.

---

## 13. Working checklist

**Layout**
- [ ] Branch on window size class, never device type; enable `supportLargeAndXLargeWidth` if targeting desktop.
- [ ] Compact/medium = 1 pane; expanded = 2 panes + 24 dp spacer; large/XL = 3 panes + 24 dp spacer.
- [ ] Cap reading columns near 360 dp (412 dp at XL) / ~60 characters.
- [ ] Handle compact **height** (landscape phone, tabletop): collapse the top app bar, keep a bottom bar.
- [ ] All spacing on the 4 dp grid; 8 dp increments for anything structural.

**Type**
- [ ] Only the 15 baseline roles; sizes in `sp`.
- [ ] Body Large (16/24) for reading; Label Large (14) for buttons; Title Large (22) for app bar.
- [ ] Test at 200% font scale with no clipping.

**Color**
- [ ] Roles only, no hex literals.
- [ ] `X` paired only with `onX`.
- [ ] `surfaceContainer*` ramp for hierarchy instead of `tonalElevation`.
- [ ] Dynamic color on API 31+ with a static fallback; light, dark, and high-contrast schemes all verified.

**Elevation & shape**
- [ ] Levels 0/1/3/6/8/12 dp only; ≤ 3 distinct steps per view.
- [ ] Shape from the token scale (0/4/8/12/16/28, plus 20/32/48 for Expressive); directional variants for edge-anchored surfaces.

**Motion**
- [ ] Emphasized `(0.2,0,0,1)` for primary transitions; accelerate on exit, decelerate on entrance.
- [ ] Durations from the token ladder; exits shorter than entrances; ≤ 1000 ms.
- [ ] Expressive: spring specs via `MaterialTheme.motionScheme`; spatial bouncy, effects critically damped.
- [ ] Reduced-motion setting honored.

**Accessibility**
- [ ] 48 dp targets, 8 dp apart.
- [ ] 4.5:1 small text, 3:1 large text and meaningful non-text.
- [ ] Content descriptions on every interactive non-text element; decorative images nulled out.
- [ ] Visible focus state on everything focusable.

---

## 14. Source index

| Topic | URL |
|---|---|
| Design hub | https://developer.android.com/design/ui |
| Mobile | https://developer.android.com/design/ui/mobile |
| Adapt layouts | https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout |
| Large screens | https://developer.android.com/guide/topics/large-screens |
| Window size classes (adaptive apps) | https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes |
| Window size classes (Compose) | https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes |
| Adaptive layouts (Compose) | https://developer.android.com/develop/ui/compose/layouts/adaptive |
| Canonical layouts | https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts |
| Adaptive design codelab | https://developer.android.com/codelabs/adaptive-material-guidance |
| M3 in Compose | https://developer.android.com/develop/ui/compose/designsystems/material3 |
| compose-material3 releases | https://developer.android.com/jetpack/androidx/releases/compose-material3 |
| Accessibility | https://developer.android.com/guide/topics/ui/accessibility/apps |
| Dark theme | https://developer.android.com/develop/ui/views/theming/darktheme |
| TV layouts | https://developer.android.com/design/ui/tv/guides/styles/layouts |
| TV foundations | https://developer.android.com/design/ui/tv/guides/foundations/design-for-tv |
| Wear adaptive design | https://developer.android.com/design/ui/wear/guides/foundations/adaptive-design |
| Wear screen sizes | https://developer.android.com/training/wearables/compose/screen-size |
| XR | https://developer.android.com/design/ui/xr |
| Desktop | https://developer.android.com/design/ui/desktop/guides/foundations/get-started |
| M3 color roles | https://m3.material.io/styles/color/roles |
| M3 type scale tokens | https://m3.material.io/styles/typography/type-scale-tokens |
| M3 elevation tokens | https://m3.material.io/styles/elevation/tokens |
| M3 motion tokens | https://m3.material.io/styles/motion/easing-and-duration/tokens-specs |
| M3 window size classes | https://m3.material.io/foundations/layout/applying-layout/window-size-classes |
| M3 spacing | https://m3.material.io/foundations/layout/understanding-layout/spacing |
| M3 Expressive launch | https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/ |
| Android 16 QPR1 rollout | https://9to5google.com/2025/09/03/android-16-qpr1-pixel/ |

**Token source files (authoritative numerics)** — all under
`https://raw.githubusercontent.com/androidx/androidx/androidx-main/`

| File | Path suffix |
|---|---|
| `WindowSizeClass.kt` | `window/window-core/src/commonMain/kotlin/androidx/window/core/layout/` |
| `PaneScaffoldDirective.kt` | `compose/material3/adaptive/adaptive-layout/src/commonMain/kotlin/androidx/compose/material3/adaptive/layout/` |
| `NavigationSuiteScaffold.kt` | `compose/material3/material3-adaptive-navigation-suite/src/commonMain/kotlin/androidx/compose/material3/adaptive/navigationsuite/` |
| `TypeScaleTokens.kt`, `TypefaceTokens.kt`, `MotionTokens.kt`, `StandardMotionTokens.kt`, `ExpressiveMotionTokens.kt`, `ElevationTokens.kt`, `ShapeTokens.kt`, `StateTokens.kt`, `PaletteTokens.kt`, `ColorLightTokens.kt`, `ColorDarkTokens.kt` | `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/` |
| `ColorScheme.kt`, `MotionScheme.kt`, `InteractiveComponentSize.kt` | `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/` |
