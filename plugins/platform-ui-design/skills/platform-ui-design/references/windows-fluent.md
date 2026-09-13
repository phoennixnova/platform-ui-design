# Windows App Design Reference — Fluent Design / WinUI 3 / Windows 11

Researched 2026-09-13 against `learn.microsoft.com/en-us/windows/apps/design/*` and
`fluent2.microsoft.design`. Values are Microsoft-published unless marked **[unverified]**.
Windows apps target **effective pixels (epx)** — a density-independent unit like dp/pt;
1 epx = 1 CSS px at 100% scaling. All layout numbers below are epx unless noted.

Design system name: **Fluent 2** (fluent2.microsoft.design). Windows-specific implementation
guidance lives under `/windows/apps/design/`; cross-platform Fluent 2 component specs (Web,
iOS, Android, Windows) live on the Fluent 2 site itself. WinUI 3 is the current-generation
native Windows UI framework (XAML + Windows App SDK); UWP/WinUI 2 is legacy.

---

## 1. Hard numbers cheat sheet

| Thing | Value | Source |
|---|---|---|
| Minimum touch target | 7.5mm ≈ **40×40 px** at 135 PPI / 1.0x scale | [guidelines-for-targeting](https://learn.microsoft.com/en-us/windows/apps/design/input/guidelines-for-targeting) |
| Mouse/pointer target | not numerically published; WinUI controls' default sizes assumed sufficient | same page |
| Default control height (Button/TextBox/ComboBox) | **32 px** [unverified — not stated in prose docs; matches generic.xaml MinHeight] | — |
| Title bar height | **32 px** standard, **48 px** with search box / person picture | [titlebar-design](https://learn.microsoft.com/en-us/windows/apps/design/basics/titlebar-design) |
| Title bar icon size | 16×16 px | titlebar-design |
| Page/content gutter, window < 640px | **12 epx** | [alignment-margin-padding](https://learn.microsoft.com/en-us/windows/apps/design/layout/alignment-margin-padding) |
| Page/content gutter, window ≥ 640px | **24 epx** | alignment-margin-padding |
| Layout increment rule | all dims/margins/padding in multiples of **4 epx** | alignment-margin-padding, screen-sizes-and-breakpoints |
| Control corner radius | **4 px** | [rounded-corner](https://learn.microsoft.com/en-us/windows/apps/design/style/rounded-corner), [geometry](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/geometry) |
| Overlay corner radius (dialog/flyout/menu/teaching tip) | **8 px** | same |
| Window corner radius (snapped/maximized) | **0 px** | same |
| ToolTip corner radius exception | 4 px (small-size exception to the 8px overlay rule) | geometry |
| NavigationView compact threshold | **640 px** window width | [navigationview](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview) |
| NavigationView expanded threshold | **1008 px** window width | navigationview |
| NavigationView expanded pane width | ~320 px | navigationview |
| NavigationView compact/minimal pane width | ~48 px | navigationview |
| Breakpoint: Small | up to 640 px | [screen-sizes-and-breakpoints](https://learn.microsoft.com/en-us/windows/apps/design/layout/screen-sizes-and-breakpoints-for-responsive-design) |
| Breakpoint: Medium | 641–1007 px | same |
| Breakpoint: Large | 1008 px and up | same |
| CommandBar primary icon size | 20×20 px | [command-bar](https://learn.microsoft.com/en-us/windows/apps/design/controls/command-bar) |
| CommandBar overflow icon size | 16×16 px | command-bar |
| CommandBar max primary commands at 320epx width | 4 | command-bar |
| Menu icon size | 16×16 px | [menus](https://learn.microsoft.com/en-us/windows/apps/design/controls/menus) |
| Segoe Fluent Icons recommended sizes | 16, 20, 24, 32, 40, 48, 64 px | [segoe-fluent-icons-font](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-fluent-icons-font) |
| Multi-line list icon size | 32 epx | [content-basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/content-basics) |
| InfoBadge dot / icon-numeric | 4px ellipse (dot) / 16px ellipse (icon, numeric) | [info-badge](https://learn.microsoft.com/en-us/windows/apps/design/controls/info-badge) |
| ProgressRing minimum size | 20×20 epx | [progress-controls](https://learn.microsoft.com/en-us/windows/apps/design/controls/progress-controls) |
| ColorPicker spectrum minimum | 256×256 px | [color-picker](https://learn.microsoft.com/en-us/windows/apps/design/controls/color-picker) |
| Button minimum width | 120 px; label ≤ 26 characters | [buttons](https://learn.microsoft.com/en-us/windows/apps/design/controls/buttons) |
| Expander child indent | 48 epx | content-basics |
| Spacing scale | 8 / 12 / 16 / 48 epx (see §5.2) | content-basics |
| Contrast minimum, text vs. background | **4.5:1** (WCAG 2.0 G18) | [accessible-text-requirements](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessible-text-requirements) |
| High-contrast theme contrast | **7:1 or higher** | [high-contrast-themes](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes) |
| Animation duration — faster | 83 ms | [timing-and-easing](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing) |
| Animation duration — fast | 167 ms | timing-and-easing |
| Animation duration — normal | 250 ms | timing-and-easing |
| Connected animation prep window | ~250 ms (element frozen), 3s hard timeout | [connected-animation](https://learn.microsoft.com/en-us/windows/apps/design/motion/connected-animation) |
| Connected animation "Direct" duration (back nav) | 150 ms fixed | connected-animation |
| Elevation values (surface depth) | Window/Dialog 128, Flyout 32, Tooltip 16, Card 8, Control 2, Layer 1 | [layering](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/layering) |

---

## 2. Design principles

Source: [design-principles](https://learn.microsoft.com/en-us/windows/apps/design/design-principles),
[signature-experiences/design-principles](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/design-principles).
Both resolve to the same five Windows 11 principles:

1. **Effortless** — "faster and more intuitive... easy to do what I want, with focus and precision."
2. **Calm** — "softer and decluttered; it fades into the background... warm, ethereal, and approachable."
3. **Personal** — "adapts seamlessly to the way I use my device... bends and flexes to my individual needs."
4. **Familiar** — "balances a new, refreshed look and feel with the familiarity of the Windows I already know."
5. **Complete + Coherent** — "a visually seamless experience across platforms."

These are expressed through **eight signature elements**: Color, Elevation and layering,
Iconography, Materials, Shapes and geometry, Typography, Motion (per the signature-experiences
index — a "Sound" element also exists on some listings but wasn't independently confirmed here).

Foundation reference for all of it: **Fluent 2** — `fluent2.microsoft.design`. What's-new page
([fluent2.microsoft.design/get-started/whatisnew](https://fluent2.microsoft.design/get-started/whatisnew))
lists six system-level changes versus Fluent 1: a cohesive color system, a token system,
standardized corner radii, greater customizability, deeper usage guidance, and accessibility
notation — no specific date was published on that page.

---

## 3. App silhouette & navigation

### 3.1 Four silhouette patterns
[app-silhouette](https://learn.microsoft.com/en-us/windows/apps/design/basics/app-silhouette)

| Silhouette | Nav placement | Content margin | Example app |
|---|---|---|---|
| Top Navigation | NavigationView at top of content layer | 56 epx (large media) or smaller | Windows 11 Photos |
| Left Navigation | NavigationView on base layer | 56 epx (content nested in Expanders) or smaller | Windows 11 Settings |
| Menu Bar | MenuBar + CommandBar on base layer | 12 epx (utility apps) | Windows 11 Notepad |
| Tab View | TabView integrated with base layer + title bar | 12 epx (code/composition apps) | Windows 11 Terminal |

Use larger margins (56 epx) when content needs visual cohesion (media, grouped/expander
content); use smaller margins (12 epx) for dense, utility-focused, tightly packed UI.

### 3.2 NavigationView — pane display modes
[navigationview](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview),
[navigation-basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics)

| Mode | Behavior | Use when |
|---|---|---|
| **Left (expanded)** | Full pane, ~320px, labels+icons | 5–10 top-level, equally important categories; content space less critical |
| **LeftCompact** | Icons only, ~48px, overlays on open | All categories need representing; icons are clear |
| **LeftMinimal** | Hamburger only, overlays on open | Smaller windows; maximize content space |
| **Top** | Horizontal bar above content | ≤5 categories; want max content height; icons can't disambiguate |

`PaneDisplayMode="Auto"` adapts automatically:

```
≤ 640px width   → LeftMinimal
641–1007px      → LeftCompact
≥ 1008px        → Left (expanded)
```

Controlled by `CompactModeThresholdWidth` (default 640) and `ExpandedModeThresholdWidth`
(default 1008) — same numbers as the general screen-size breakpoints (§4.1). An app can force
Top↔Left switching at the compact threshold via `AdaptiveTrigger` bound to those properties.

Structure guidance: flat/lateral nav for < 8 peer pages; hierarchical (parent-child) nav for
7+ pages or ordered traversal; avoid deep hierarchies — add **BreadcrumbBar** beyond 2 levels.

Back-button/history rules: add page-to-page transitions across different peer groups, or
same-peer-group without an on-screen nav element, to history. Do **not** add transient UI
(dialogs, keyboards) or item drill-in/out to history — dismiss instead.

### 3.3 Title bar
[titlebar-design](https://learn.microsoft.com/en-us/windows/apps/design/basics/titlebar-design)

- Height: **32px** standard, **48px** if it hosts a search box or PersonPicture.
- Default backdrop: **Mica**, extended in from the client area for a seamless look; a custom
  title bar must be made transparent so Mica shows through.
- Icon 16×16px, 16px from the leading edge (or 16px right of a back button); title text uses
  **Caption** style, 16px after icon; caption buttons (min/max/restore/close) stay fully
  visible even if title truncates.
- Caption button glyphs (Segoe Fluent Icons): Minimize E921, Maximize E922, Restore E923,
  Close E8BB. Back button glyph E830.
- Right-click/press-hold on the bar shows the system window menu; double-click toggles
  maximize/restore.
- **A custom-drawn title bar that doesn't correctly report caption-button hit-test regions
  breaks Snap Layouts** (the Windows 11 hover-maximize flyout) — see §11 mistakes.

### 3.4 Command surfaces
[commanding-basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/commanding-basics),
[command-bar](https://learn.microsoft.com/en-us/windows/apps/design/controls/command-bar),
[command-bar-flyout](https://learn.microsoft.com/en-us/windows/apps/design/controls/command-bar-flyout)

- **CommandBar**: general-purpose top/bottom command surface; primary commands (icons 20×20,
  always visible) + secondary commands (overflow `…`, icons 16×16). Closed states: Compact
  (icons, no labels, `…`), Minimal (thin bar acting as `…`), Hidden.
- **CommandBarFlyout**: floating, context-attached command surface — the recommended way to
  build modern context menus (Copy/Cut/Paste/Delete/Share) and proactive selection toolbars
  (e.g. text-selection formatting). Collapsed = primary commands only; Expanded = primary +
  secondary.
- **MenuBar** (File/Edit/View…): use when app functionality is too complex for a CommandBar.
- **App canvas commands**: place high-frequency commands next to the content they act on;
  don't overcrowd — push secondary commands elsewhere.
- Confirmation dialogs only for irreversible actions (delete, overwrite, purchase); prefer
  Undo for reversible ones.

### 3.5 Navigation container comparison
| Control | Use for | Don't use for |
|---|---|---|
| NavigationView (Left/Top) | Static top-level app sections | Dynamic, user-created tabs |
| TabView | Dynamically opened/closed/reordered documents, draggable between windows (browser-like) | Fixed settings-style navigation |
| BreadcrumbBar | Path display, > 2 navigation levels, "jump to any ancestor" | Flat, shallow nav |
| Pivot | **Not recommended for Windows 11** — superseded by SelectorBar/NavigationView/TabView | New Windows 11 apps |
| SplitView | Drawer pane + always-visible content (list/details) | Full app-level navigation menu (use NavigationView) |

### 3.6 Contrast with mobile navigation
Windows apps are **window-based, resizable, multi-monitor**, not full-screen single-stack —
this reshapes navigation entirely versus iOS/Android:

- No OS-level back gesture/button by default (Windows has no hardware/gesture back outside
  tablet mode) — apps must supply their own back affordance tied to NavigationView or a
  title-bar back button.
- iOS tab bar (bottom, ≤5 fixed items, always visible) has no direct Windows analogue; the
  closest are Left NavigationView (persistent categories) or Top NavigationView (≤5 items,
  more content height). Android's bottom nav bar is similar to iOS's; Windows instead defaults
  to a **left rail** because windows are typically wider than tall and mouse/keyboard favor a
  side list over a bottom bar.
- Because windows resize, Windows nav must be **breakpoint-adaptive** (LeftMinimal → LeftCompact
  → Left) — something neither iOS nor Android navigation needs to solve for, since their
  navigation containers don't get resized by the user.

---

## 4. Layout

### 4.1 Breakpoints & effective pixels
[screen-sizes-and-breakpoints](https://learn.microsoft.com/en-us/windows/apps/design/layout/screen-sizes-and-breakpoints-for-responsive-design)

| Class | Width | Typical devices |
|---|---|---|
| Small | up to 640 px | TVs (paired with 10-foot UI), small windows |
| Medium | 641–1007 px | Tablets, split-screen windows |
| Large | 1008 px+ | PCs, laptops, Surface Hub |

No "extra-large" tier is documented. **Effective pixels (epx)** normalize for viewing distance
and screen density so layout reads at a consistent *perceived* size regardless of physical PPI
— comparable to dp (Android) or pt (Apple), NOT raw device pixels. Design and size everything
in multiples of **4 epx**.

### 4.2 Responsive techniques
[responsive-design](https://learn.microsoft.com/en-us/windows/apps/design/layout/responsive-design)

Six documented techniques: **Reposition** (stack↔spread), **Resize** (grow margins/frames),
**Reflow** (single-column↔multi-column), **Show/Hide** (reveal metadata as space allows),
**Re-architect** (fork UI pattern, e.g. add list/details only when room exists), **Adaptive
layout** (swap whole UI at a breakpoint, e.g. NavigationView Top↔Left). "Responsive" = one
fluid layout that scales continuously; "Adaptive" = discrete layout swap at a breakpoint.

### 4.3 Margins, gutters, spacing
[alignment-margin-padding](https://learn.microsoft.com/en-us/windows/apps/design/layout/alignment-margin-padding),
[content-basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/content-basics)

- Page/content gutter: **12 epx** below 640px window width, **24 epx** at 640px and above.
- All margins/padding/dimensions in **4 epx increments** (keeps edges pixel-aligned after DPI
  scaling).
- Spacing scale used throughout controls and layouts:

| Value | Used between |
|---|---|
| 8 epx | Buttons; button↔flyout; control↔header |
| 12 epx | Control↔label; content areas; Title/Subtitle/Body blocks with room to spare |
| 16 epx | Surface edge↔text; control↔Expander toggle button |
| 48 epx | Indent of child controls inside an Expander |

- Text-hierarchy fallback under space pressure: full room → Title/Subtitle/Body with 12epx
  gaps; tight → Body Strong instead of Title, no extra gap; very tight → Caption-sized command
  buttons.
- List/grid text conventions: multi-line lists use Body+Caption with 32epx icons and Body
  Strong section headers; horizontal lists/grids use centered Caption text; large graphical
  items left-align Body text to the image.

---

## 5. Typography

[typography](https://learn.microsoft.com/en-us/windows/apps/design/style/typography)

### 5.1 Type ramp

| Style | Weight | Size / Line-height (epx) |
|---|---|---|
| Caption | Regular (Small optical) | 12 / 16 |
| Body | Regular (Text optical) | 14 / 20 |
| Body Strong | Semibold (Text optical) | 14 / 20 |
| Body Large | Regular (Text optical) | 18 / 24 |
| Body Large Strong | Semibold (Text optical) | 18 / 24 |
| Subtitle | Semibold (Display optical) | 20 / 28 |
| Title | Semibold (Display optical) | 28 / 36 |
| Title Large | Semibold (Display optical) | 40 / 52 |
| Display | Semibold (Display optical) | 68 / 92 |

All values epx (≈ px at 100% scale). **[unverified: the exact "Body Large Strong" and
"Title Large" row names/values were reconstructed from a rendered summary of the doc, not
a raw table dump — cross-check against the live page before shipping exact numbers.]**

### 5.2 Segoe UI Variable

System typeface since Windows 11; variable font on two axes:

- **Weight (wght)**: Light 300, Semilight 350, Regular 400, Semibold 600, Bold 700.
- **Optical size (opsz)**, auto-selected by rendered size:
  - **Small**: ~8–12pt — maximizes legibility at small sizes.
  - **Text**: ~12–20pt — balanced, for body copy.
  - **Display**: ~20–36pt+ — more character/personality, for headings.

Optical sizing is automatic in XAML and CSS when `font-size` is set — no manual optical-size
selection needed in most cases. Fallback: Segoe UI (non-variable).

---

## 6. Color & theme resources

[color](https://learn.microsoft.com/en-us/windows/apps/design/style/color),
[xaml-theme-resources](https://learn.microsoft.com/en-us/windows/apps/develop/platform/xaml/xaml-theme-resources)

### 6.1 Rule
**Always reference theme brushes (`{ThemeResource BrushName}`), never hardcode literal
colors.** Theme resources re-resolve automatically on Light/Dark/HighContrast switches and
on accent-color change; literals do not, and are the single most common Windows-app theming
bug (see §11).

- `{ThemeResource X}` — use on element properties, in Styles/Setters/templates/animations.
  Re-evaluates at load **and every theme change**.
- `{StaticResource X}` — use only *inside* a `ThemeDictionaries` block, to reference another
  resource within the same dictionary. Evaluates once at load; does not react to theme changes.
  Exception: system-agnostic `SystemColor*` resources may use `{ThemeResource}` even inside a
  `HighContrast` dictionary.
- Define separate `Light`, `Dark`, and `HighContrast` dictionaries — never rely on a generic
  `Default` bucket as your only definition.

### 6.2 Naming convention (fill/stroke resource families)

Pattern: `[Category][Attribute][Variant/State]`. Representative resources cited in Microsoft
docs (exact catalog is large; these are the load-bearing ones to know):

| Resource | Purpose |
|---|---|
| `TextFillColorPrimary` / `...Brush` | Primary text |
| `AccentFillColorDefault` | Default-state accent fill (buttons, selection) |
| `CardBackgroundFillColorDefault` | Card/panel background |
| `SolidBackgroundFillColorBase` | Opaque base background (Mica fallback) |
| `SubtleFillColorSecondary` | Subtle hover/secondary fill |
| `ControlStrokeColorDefault` | Default control border |
| `DividerStrokeColorDefault` | List/section dividers |
| `SystemFillColorSuccess` / `Caution` / `Critical` | Status colors (green/amber/red) |
| `SystemAccentColor` | User's chosen Windows accent color (system-level) |
| `SystemColorWindowColor` / `WindowTextColor` | High-contrast window bg/fg pair |
| `SystemColorHighlightColor` / `HighlightTextColor` | High-contrast selection bg/fg pair |
| `SystemColorHotlightColor` | High-contrast hyperlink color only |
| `SystemColorGrayTextColor` | High-contrast **disabled-only** text (don't reuse for secondary text) |
| `SystemColorButtonFaceColor` / `ButtonTextColor` | High-contrast button bg/fg pair |

**[unverified — full literal source table]**: the live `xaml-theme-resources` fetch above
returned a summarized description, not the raw resource table; verify exact resource names
against the WinUI 3 Gallery / `generic.xaml` before using them as authoritative API names.

### 6.3 Accent color
Auto-generated light/dark-optimized variants from the user's chosen system accent; used
*sparingly* to mark interactive/selected state, not for large surface fills. Never place
accent-colored text over Acrylic — fails contrast requirements (§9).

### 6.4 Layering (see also §7–8)
Two-tier model: **Base layer** (app foundation — window chrome, nav, commands; carries Mica or
solid `SolidBackgroundFillColorBase`) → **Content layer** (`LayerFillColorDefaultBrush`, a
low-opacity solid over the base — either one contiguous surface ["standard pattern"] or split
into cards ["card pattern"]). Mica Alt adds a third **commanding layer**
(`LayerOnMicaBaseAltFillColorDefaultBrush`) for tabbed-title-bar apps that need the nav/menu
band to read as visually distinct from both title bar and content.

---

## 7. Materials

[mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica),
[acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic),
[signature-experiences/materials](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/materials)

| Material | Opaque? | Theme-aware? | Use for | Availability |
|---|---|---|---|---|
| **Mica** | Yes | Yes | App window base layer (standard hierarchy) | Windows App SDK 1.0+ |
| **Mica Alt** | Yes | Yes | Base layer for tabbed-title-bar apps needing stronger command-band contrast | Windows App SDK 1.1+, Win11 22000+ |
| **Acrylic (in-app)** | No (translucent) | Yes | Supporting UI/nav panes that overlap content within the frame | — |
| **Acrylic (background)** | No (translucent) | Yes | Transient surfaces: context menus, flyouts, light-dismiss panes | — |
| **Smoke** | No (translucent black) | **No** (same both themes) | Modal dimming behind ContentDialog | — |

Rules:
- Apply a backdrop material **once per app/window**, on the base layer only — never directly
  on individual controls.
- Set backgrounds to transparent on every layer the material must show through.
- Never stack multiple Acrylic surfaces (especially background Acrylic) — causes distracting
  moiré/optical artifacts; never place Acrylic panes edge-to-edge (visible seams).
- Extend Acrylic to at least one app edge for a seamless look.
- Mica/Mica Alt should be visible **in the title bar** — implies a transparent custom title bar.
- Fallback to solid colors automatically in: High Contrast mode, Battery Saver, low-end
  hardware, "Transparency effects" off (Settings → Personalization → Colors), inactive window
  (Mica dims/desaturates; background-Acrylic falls back entirely), and on Xbox/HoloLens/tablet
  mode (background Acrylic only). Mica fallback color: `SolidBackgroundFillColorBase` (Alt:
  `...BaseAlt`).

---

## 8. Elevation & shadows

[layering](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/layering)

| Surface | Elevation value | Stroke |
|---|---|---|
| Window / Dialog | 128 | 1 |
| Flyout | 32 | 1 |
| Tooltip | 16 | 1 |
| Card | 8 | 1 |
| Control (rest/hover) | 2 | 1 |
| Control (pressed) | 1 | 1 |
| Layer (content layer) | 1 | 1 |

These are relative depth tokens, not shadow-blur px — Microsoft's page references them as
inputs to `ThemeShadow`/`DropShadow` rendering but **does not publish literal blur-radius,
offset, or opacity numbers** for each level; implementation lives in code (`ThemeShadow` API),
not in a design-doc table. **[gap — no numeric shadow spec found; treat elevation as an
ordering/z-index concept, not a literal CSS box-shadow recipe, when porting to web/React]**.
Shadows combine with 1px stroke "contour" outlines to reinforce depth, especially important
since shadows alone can be too subtle against Mica/Acrylic.

---

## 9. Geometry — corner radius

[rounded-corner](https://learn.microsoft.com/en-us/windows/apps/design/style/rounded-corner),
[signature-experiences/geometry](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/geometry)

| Radius | Token | Applies to |
|---|---|---|
| **4px** | `ControlCornerRadius` | Button, CheckBox, ComboBox, TextBox, ListView row, ProgressBar, ScrollBar, Slider — in-page controls |
| **8px** | `OverlayCornerRadius` | ContentDialog, Flyout, MenuFlyout, TeachingTip, app window — transient/top-level surfaces |
| 4px (exception) | — | ToolTip — small enough that it uses the control radius, not the overlay radius |
| **0px** | — | Two straight edges meeting with no gap (e.g. SplitButton halves); connected-flyout seam; snapped/maximized window corners |

Both tokens are global `App.xaml` resources — override once to reskin every control.
Win32 (non-XAML) desktop apps opt in separately via the DWM rounded-corners API.

---

## 10. Motion

[timing-and-easing](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing),
[connected-animation](https://learn.microsoft.com/en-us/windows/apps/design/motion/connected-animation)

### 10.1 Durations (ThemeResource tokens)
| Token | Duration |
|---|---|
| `ControlFasterAnimationDuration` | 83 ms |
| `ControlFastAnimationDuration` | 167 ms |
| `ControlNormalAnimationDuration` | 250 ms |

### 10.2 Easing
| Curve | cubic-bezier | Use for |
|---|---|---|
| Fast-out, slow-in | `(0, 0, 0, 1)` | Elements entering/spawning — starts fast, decelerates hard |
| Slow-out, fast-in | `(1, 0, 1, 1)` | Elements exiting — accelerates away, clears room for incoming content |

### 10.3 Connected animation
Shared-element transition (an image/control appears to "fly" from its position in the source
view to its new position in the destination view) via `ConnectedAnimationService`. Use only
when a real shared element exists between the two views. Hard constraints: **≤ ~250ms** between
`PrepareToAnimate` and starting the animation on the destination page (source element visually
freezes during that gap), and a **3-second** total timeout after which the prepared animation
is discarded and `TryStart` fails. "Gravity" configuration (scale+dip effect, respects
`DefaultDuration`) is recommended for forward navigation; "Direct" (flat 150ms) for back
navigation.

### 10.4 Reduce motion
Windows exposes a system "Animation effects" toggle at **Settings → Accessibility → Visual
effects**; WinUI respects it automatically for built-in control animations.
**[unverified via direct doc fetch in this pass — the dedicated motion-accessibility page
404'd; confirm the exact API (`AnimationsEnabledInSettings`) before citing it as a source]**.

---

## 11. Icons

[segoe-fluent-icons-font](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-fluent-icons-font),
[icons](https://learn.microsoft.com/en-us/windows/apps/design/style/icons)

- **Segoe Fluent Icons** is the default Windows 11 icon font (replaced Segoe MDL2 Assets),
  mapped into Unicode PUA range E700–F8CC. Ships in Windows 11; downloadable for Windows 10 /
  other platforms (can't redistribute to non-Windows targets).
- Render crisply only at: **16, 20, 24, 32, 40, 48, 64 px** — off-ramp sizes blur.
- Supports glyph layering (stack two `FontIcon`s with different colors) for two-tone icons, and
  has RTL-mirrored variants for many glyphs.

| Type | Use for |
|---|---|
| `SymbolIcon` | Any glyph present in the `Symbol` enum — simplest path |
| `FontIcon` | Any Segoe Fluent Icons glyph by codepoint, including ones without a `Symbol` entry |
| `PathIcon` | Custom vector shapes (raw XAML `Geometry` data) |
| `ImageIcon` | Color imagery — prefer **SVG** (stays sharp at any size) |
| `BitmapIcon` | Monochrome PNG only — **not recommended** (blurs on downscale, pixelates on upscale) |
| `AnimatedIcon` | Motion/Lottie-driven icons for interactive feedback |

`IconElement` (SymbolIcon/FontIcon/etc.) is usable directly in UI; `IconSource` variants are
usable only via `ResourceDictionary` sharing + `IconSourceElement`.

---

## 12. Controls table

XAML type namespace is `Microsoft.UI.Xaml.Controls` unless noted. "Nearest legacy" is WPF/
WinForms where materially different; for Electron/React web apps, **match the metrics and
interaction model, not the API** — there is no API parity story across stacks.

| Control | What / when | When NOT to use | Key sizes | XAML type | Nearest legacy |
|---|---|---|---|---|---|
| Button | Immediate action, Click/Command | Navigation → HyperlinkButton | min-width 120px, label ≤26 chars | `Button` | WPF `Button` |
| RepeatButton | Action that repeats while held (spinners) | One-shot actions | — | `RepeatButton` | WinForms none direct |
| HyperlinkButton | Text-styled navigation | In-app commands | — | `HyperlinkButton` | WPF `Hyperlink` |
| DropDownButton | Button that opens an attached flyout of options | Binary action | — | `DropDownButton` | — |
| SplitButton | Independent default action + attached options menu | Simple single action | — | `SplitButton` | — |
| ToggleButton / ToggleSplitButton | Two-state on/off with optional menu | — | — | `ToggleButton`/`ToggleSplitButton` | WPF `ToggleButton` |
| CheckBox | Multi-select or delayed/deferred binary status ("Remember me") | Immediate-effect binary (→ToggleSwitch); mutually-exclusive choice (→RadioButton) | 3 states incl. indeterminate | `CheckBox` | WinForms `CheckBox` |
| RadioButton | Single choice from a small mutually-exclusive set | Binary on/off (→ToggleSwitch/CheckBox) | — | `RadioButton` | WinForms `RadioButton` |
| ToggleSwitch | Binary setting that **takes effect immediately** | Deferred/form-submit choices (→CheckBox) | — | `ToggleSwitch` | — (no direct WPF/WinForms equiv) |
| Slider | Contiguous/discrete range, ≥4 values, relative-quantity feel | Exact known numeric value (→NumberBox); binary (→ToggleSwitch) | thumb size fixed, don't resize | `Slider` | WinForms `TrackBar` |
| RatingControl | View/set a satisfaction rating; read-only for large virtualized lists | — | compact mode available | `RatingControl` | — |
| TextBox | Single/multi-line plain text entry | Read-only (→TextBlock); secrets (→PasswordBox); rich text (→RichEditBox); search suggestions (→AutoSuggestBox) | height ~32px [unverified] | `TextBox` | WinForms `TextBox` |
| PasswordBox | Masked secret entry | — | — | `PasswordBox` | WinForms `TextBox` (PasswordChar) |
| RichEditBox | Rich/formatted text editing | Plain text (→TextBox) | — | `RichEditBox` | WPF `RichTextBox` |
| AutoSuggestBox | Text entry + live filtered suggestion dropdown | Static option list (→ComboBox) | — | `AutoSuggestBox` | — |
| NumberBox | Numeric entry with spinner/validation | Free text (→TextBox) | — | `NumberBox` | WinForms `NumericUpDown` |
| ComboBox | Space-saving single choice from a secondary-importance list, has a sensible default | Important choice needing full visibility (→ListBox); 2–3 options (→RadioButton) | single-line text items | `ComboBox` | WinForms `ComboBox` |
| ListBox | Always-visible single-select list, 3–9 items, all options equally important | >9 items or virtualization needed (→ListView) | — | `ListBox` | WinForms `ListBox` |
| CalendarView | Always-visible single/multi date picking surface | Compact/dropdown context (→CalendarDatePicker) | — | `CalendarView` | — |
| CalendarDatePicker | Dropdown date pick where calendar context (day-of-week) matters | Context-free known date (→DatePicker) | — | `CalendarDatePicker` | — |
| DatePicker | Vertical scroll-wheel date entry, context not important (e.g. birthdate) | Needs calendar grid (→CalendarDatePicker) | — | `DatePicker` | WinForms `DateTimePicker` |
| TimePicker | Vertical scroll-wheel time entry (static, doesn't auto-update) | — | — | `TimePicker` | WinForms `DateTimePicker` |
| ColorPicker | Spectrum/RGB/HSV/Hex color selection | — | spectrum ≥256×256px | `ColorPicker` | — |
| ListView | Text-heavy, single-column vertical collections; grouping, D&D, reorder | Image-heavy grids (→GridView); modern flexible layouts (→ItemsView) | — | `ListView` | WinForms `ListView` (Details) |
| GridView | Image-heavy, wrapped multi-column collections, scrolls vertically | Text-heavy lists (→ListView) | — | `GridView` | WinForms `ListView` (Tile) |
| ItemsView | Modern flexible-layout collection (swappable layouts at runtime) — MS's current recommendation over ListView/GridView | Legacy-targeted apps needing ListView-specific features | built on ItemsRepeater | `ItemsView` | — |
| TreeView | Hierarchical/nested data with expand-collapse | Flat drill-in lists (→ListView) | N-level nesting | `TreeView` | WinForms `TreeView` |
| FlipView | Swipe/flip through one item at a time (galleries, wizards) | — | **[not independently verified this pass — page 404'd]** | `FlipView` | — |
| NavigationView | App-level primary navigation, adaptive Left/Top/Compact | Dynamic user-managed tabs (→TabView) | see §3.2 | `NavigationView` | — |
| TabView | Dynamic, closable, reorderable, cross-window-draggable tabs (browser-like) | Static nav (→NavigationView) | — | `TabView` | — |
| Pivot | **Not recommended for Windows 11** | New Windows 11 apps | — | `Pivot` | — |
| BreadcrumbBar | Path/ancestor trail, collapses to `…` when tight | ≤2 levels (plain back suffices) | — | `BreadcrumbBar` | — |
| CommandBar | App/page-level command surface, primary+overflow | — | see §3.4 | `CommandBar` | WPF `ToolBar` |
| CommandBarFlyout | Context menu / selection toolbar, collapsed↔expanded | — | see §3.4 | `CommandBarFlyout` | — |
| MenuFlyout / MenuBar | Context menu / traditional File-Edit-View menu bar | Arbitrary rich content (→Flyout/Dialog) | icon 16×16px | `MenuFlyout`, `MenuBar` | WinForms `ContextMenuStrip`, `MenuStrip` |
| ContentDialog | Modal, blocking, must-acknowledge (security, destructive confirm, critical error) | Non-critical/ignorable info (→Flyout/InfoBar) | Primary=left "do it", Close=right "safe" | `ContentDialog` | WPF modal `Window` |
| Flyout | Non-modal contextual info, light-dismiss | Must-block interaction (→ContentDialog) | — | `Flyout` | WinForms `ToolTip`/popup |
| TeachingTip | Transient, semi-persistent feature callout/teaching moment | Errors/critical status (→InfoBar/ContentDialog) | 13 placement modes | `TeachingTip` | — |
| InfoBar | Inline, persistent app-status banner (not floating); 4 severities | Contextual per-element info (→Flyout); blocking (→ContentDialog) | icon 20px | `InfoBar` | — |
| InfoBadge | Small non-interactive notification dot/count, esp. on NavigationView items | Critical errors (→ContentDialog); persistent status (→InfoBar) | Dot 4px, Icon/Numeric 16px | `InfoBadge` | — |
| ProgressBar | Linear, non-blocking (determinate % or indeterminate) | Modal wait states (→ProgressRing) | — | `ProgressBar` | WinForms `ProgressBar` |
| ProgressRing | Circular, blocking/modal wait (determinate or indeterminate) | Non-blocking background work (→ProgressBar) | min 20×20epx, set H=W | `ProgressRing` | — |
| ToolTip | Hover/focus/press-hold label for icon-only or ambiguous controls | Errors/status (→Flyout/InfoBar); essential info | dismiss via Ctrl since Win11 21H2 | `ToolTip` | WinForms `ToolTip` |
| Expander | Show/hide secondary content, pushes siblings (no overlay) | Overlaying content needed (→Flyout) | child indent 48epx | `Expander` | WPF `Expander` |
| PipsPager | Paginate linear, unnumbered content (photo viewers, carousels) | Numbered/large page sets | 5 pips default visible | `PipsPager` | — |
| ScrollView | Scrollable content container (successor to ScrollViewer) | — | **[not independently verified this pass]** | `ScrollView` | WPF `ScrollViewer` |
| SplitView | Drawer pane (Overlay/Inline/CompactOverlay/CompactInline) + content | Full nav menu (→NavigationView) | compact pane 48px default | `SplitView` | — |
| PersonPicture | Avatar image, falls back to initials/generic glyph | — | — | `PersonPicture` | — |
| MediaPlayerElement | Audio/video playback with transport controls | **[not independently verified this pass]** | — | `MediaPlayerElement` | — |

---

## 13. Accessibility

[accessibility-overview](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-overview),
[high-contrast-themes](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes),
[keyboard-accessibility](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/keyboard-accessibility),
[accessible-text-requirements](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessible-text-requirements),
[gamepad-and-remote-interactions](https://learn.microsoft.com/en-us/windows/apps/design/input/gamepad-and-remote-interactions)

### 13.1 Contrast
- Body text vs. background: **≥ 4.5:1** (WCAG 2.0 technique G18). Exempt: logos, incidental
  text (inactive UI), decorative/interchangeable text.
- High-contrast themes target **7:1+**. High contrast is **not** an acceptable substitute for
  getting default-theme contrast right — design for 4.5:1 first.
- Contrast checks are luminance-only — don't rely on hue difference alone (e.g. red-on-green
  can fail for color-vision-deficient users even when "visually distinct").

### 13.2 High contrast implementation
- Windows ships 4 built-in HC themes (Aquatic, Desert, Dusk, Night sky); toggle via
  Settings → Accessibility → Contrast themes, or **Left Alt+Left Shift+PrtScn**.
- Provide a `HighContrast` `ThemeDictionaries` entry; pair `SystemColorWindowColor` with
  `WindowTextColor`, `HighlightColor` with `HighlightTextColor`, `ButtonFaceColor` with
  `ButtonTextColor`; reserve `SystemColorHotlightColor` for hyperlinks only, and
  `SystemColorGrayTextColor` for genuinely **disabled** content only (not general secondary
  text).
- Set `HighContrastAdjustment="None"` once your own brushes correctly resolve to `SystemColor*`
  — otherwise Windows forces a default white-on-black override on top of your UI.
- Test in all 4 themes; a common bug is a `TextBlock.Foreground` set directly in a
  `ListView` `DataTemplate`, which then fails to invert on selection in HC mode — omit the
  setter in the HC dictionary instead so state-driven inheritance can take over.

### 13.3 Keyboard & focus
- Keyboard is a **primary** interaction model, not a fallback.
- `TabIndex` ordering: default = `int.MaxValue` (ordered by declaration); explicit `0` values
  are ordered by declaration; positive values ascend; negative values come first.
  `IsEnabled="false"` removes an element from focus entirely; `IsTabStop="false"` keeps it
  interactive (e.g. mouse-clickable) but skips it in Tab order.
- **F6** (Shift+F6 reverse) moves focus between major UI *regions* (panes, toolbars) — must be
  wired up explicitly; give each region a name via `AutomationProperties.Name`.
- Access keys (Alt+letter, move focus) vs. accelerators (Ctrl+letter, invoke directly) are
  distinct — expose both via `AutomationProperties.AccessKey` /
  `AutomationProperties.AcceleratorKey` **and** implement the actual `KeyboardAccelerator` /
  key handler; setting the automation property alone does nothing functionally.
- Any pointer-only custom control (e.g. an `Image` with `PointerPressed`) needs a real
  keyboard-operable wrapper (e.g. `Button` + `AutomationProperties.Name`) — never ship
  mouse/touch-only interaction.
- Focus rectangle: WinUI renders a system focus visual automatically on focusable controls;
  no separate documented "N px" spec was found in the prose docs fetched here —
  **[unverified numeric focus-rect thickness/offset — treat "use the built-in FocusVisual,
  don't hand-roll it" as the load-bearing rule instead]**.

### 13.4 Screen reader / UI Automation
- **Narrator** is the built-in Windows screen reader; supports full-UI read-through and
  single-control focus reading.
- The most important single accessibility property on any control is its **accessible name**
  — set via `AutomationProperties.Name`. Also commonly used: `AutomationProperties.HelpText`,
  `AutomationProperties.LiveSetting` (for dynamically-updating regions, e.g. InfoBar/status
  text a screen reader should announce).
- Custom controls need an `AutomationPeer` subclass to describe role/content/patterns to AT
  clients; built-in WinUI controls already expose these.

### 13.5 Gamepad / Xbox ("10-foot") model
- XY-focus: D-pad/left-stick moves focus in 4 directions; arrow keys auto-map to D-pad, so
  **keyboard support is a prerequisite for gamepad support** — build/test keyboard first.
- Every focusable control needs `IsTabStop="True"` and to be visible; debug via
  `FocusManager.GetFocusedElement()`.
- A/Select ≈ Spacebar/Enter; B/Back ≈ Escape (fires `BackRequested`).
- `IsFocusEngagementEnabled="True"` forces an explicit "engage" (A) / "disengage" (B) step
  before a composite control's internal items get focus — prevents focus getting trapped
  inside complex controls (on by default for CalendarDatePicker, Slider).
- Enable `FocusVisualKind = FocusVisualKind.Reveal` specifically on Xbox for a more visible
  glow-style focus indicator; keep a focusable element on-screen at all times and start focus
  top-left.
- "Mouse mode" (`RequiresPointerMode` / per-control `RequiresPointer`) is opt-in for free-form
  UIs like maps — disabled by default on Xbox.

---

## 14. Input model — keyboard+mouse first, touch second

[input-primer](https://learn.microsoft.com/en-us/windows/apps/design/input/input-primer),
[guidelines-for-targeting](https://learn.microsoft.com/en-us/windows/apps/design/input/guidelines-for-targeting)

**This is the inverse of mobile design assumptions**, and it's the single biggest platform
delta to internalize:

| | Windows (desktop/laptop) | iOS / Android |
|---|---|---|
| Primary input | Mouse + keyboard | Touch |
| Secondary input | Touch, pen, gamepad | (Keyboard rare, external) |
| Pointer has hover state | **Yes** | No |
| Right-click / secondary click | Ubiquitous (context menus) | Long-press, less standardized |
| Window is resizable | Yes, arbitrarily, plus Snap Layouts, plus multi-monitor/multi-DPI | No (fixed device viewport) |
| Density | Denser — mouse precision allows smaller, closer-packed targets | Sparser — finger precision needs 44pt/48dp targets |
| Tooltips | Expected, hover-triggered | Rare — no hover to trigger them |

Consequences for design:
- **Hover states are mandatory** — buttons, list rows, links all need a documented hover
  visual (WinUI controls provide this by default; custom controls must add it).
- **Right-click context menus are a first-class surface**, not an edge case — build
  `CommandBarFlyout`/`MenuFlyout` context menus for anything a mouse user would expect to
  right-click (list items, canvas objects, text selections).
- Controls can run **denser** than mobile equivalents because the mouse pointer is precise;
  the 40×40px touch minimum is a floor for touch-reachable UI, not a floor for every control —
  mouse-only controls can be smaller as long as touch is genuinely not a target input for that
  surface.
- **Tooltips fill the "what does this icon mean" gap** that mobile solves with always-visible
  labels or long-press previews — icon-only buttons need a `ToolTipService.ToolTip`.
- **Window resize/Snap Layouts/multi-monitor DPI must all work** — a Windows app is a window
  the user drags between two 4K/1080p monitors with different scale factors, snaps to a
  quarter of the screen, and resizes to a sliver; mobile apps never face this because the
  viewport is fixed per device. Custom title bars are the most common thing that breaks Snap
  Layouts (see §15).

Input-device support per Microsoft's input-primer: **Touch** (direct manipulation, natural
multi-touch gestures), **Pen** (pixel precision + pressure/tilt for inking — active pens add
hover/palm-rejection over passive), **Mouse** (fine targeting + modifier-key power, but weak at
direct manipulation), **Keyboard** (fast entry/nav/commands, and the accessibility backbone),
**Gamepad** (XY-focus, games/10-foot UI, not general productivity), **Speech**, **Haptics**.
Core rule: never gate a *critical* action behind exactly one input modality — always provide a
keyboard-reachable equivalent even for touch/pointer-primary flows.

---

## 15. Common mistakes (~25)

1. Hardcoding hex colors instead of `{ThemeResource}` brushes — breaks Dark mode, accent-color
   changes, and High Contrast simultaneously.
2. Custom-drawn title bars that don't correctly extend content into the non-client area or
   mis-report caption-button hit-test regions — **breaks Windows 11 Snap Layouts** (the
   hover-on-maximize flyout) and system window menu (right-click title bar).
3. Ignoring the Windows 11 corner-radius system (4px controls / 8px overlays / 0px on touching
   straight edges) — mixing arbitrary radii reads as visibly off-brand.
4. Using a hamburger (LeftMinimal) NavigationView when a Top NavigationView fits ≤5 categories
   and more content height is available — hides navigation unnecessarily on large windows.
5. Blocking keyboard access — mouse/touch-only custom controls (e.g. `PointerPressed` on a
   bare `Image`) with no keyboard path and no accessible name.
6. Touch targets sized only for mouse precision — sub-40×40px hit areas on anything meant to
   also be touch-reachable.
7. Ignoring window resize entirely — fixed-pixel layouts that clip, overflow, or look broken
   below ~640px or above ultrawide widths.
8. Ignoring Snap Layouts / multi-monitor DPI — assuming one fixed DPI/scale factor; not
   re-laying-out on a DPI change when a window is dragged to a different-DPI monitor.
9. Applying Acrylic/Mica to individual controls instead of once on the base layer — breaks the
   documented layering model and often looks muddy.
10. Stacking multiple Acrylic surfaces, or placing Acrylic panes edge-to-edge — causes visible
    seams/moiré.
11. Skipping the `HighContrast` theme dictionary, or hardcoding colors inside it — text becomes
    unreadable for HC users even though Light/Dark both work.
12. Using `SystemColorGrayTextColor` for ordinary secondary text in HC mode instead of reserving
    it for genuinely disabled content.
13. Setting `Foreground` directly in a `ListView` item `DataTemplate` — breaks the
    selected/hover text-color inversion in High Contrast.
14. No visible focus indicator on custom/retemplated controls — silently fails keyboard and
    Narrator users.
15. `AutomationProperties.AccessKey`/`AcceleratorKey` set without an actual
    `KeyboardAccelerator`/key handler wired up — the shortcut is announced but doesn't work.
16. Missing `AutomationProperties.Name` on icon-only buttons and custom controls — Narrator
    reads nothing meaningful.
17. Using ContentDialog for non-critical, ignorable information — should be an InfoBar,
    Flyout, or TeachingTip instead; overuse trains users to reflexively dismiss dialogs.
18. Using confirmation dialogs for routine reversible actions instead of providing Undo.
19. Missing hover states on custom controls — the single most obvious "this wasn't built for
    mouse" tell on Windows.
20. Missing right-click context menus on canvas/list content a mouse user would expect to
    right-click.
21. Icon-only buttons with no `ToolTip` — no way for a mouse user to learn what the icon means.
22. Off-ramp icon sizing (rendering Segoe Fluent Icons at sizes other than 16/20/24/32/40/48/64)
    — icons blur.
23. Using `Pivot` in a new Windows 11 app — it's explicitly no longer recommended; use
    SelectorBar, NavigationView (Top), or TabView instead.
24. Using ListBox for >9 items or ComboBox for an *important* decision the user should see all
    options for at a glance — picking the wrong selection control for the list's importance/size.
25. Ignoring the documented button minimum width (120px) / label length (≤26 chars) guidance,
    producing cramped or wrapping button labels.
26. Building a NavigationView without responsive `PaneDisplayMode="Auto"` (or equivalent
    `AdaptiveTrigger` wiring) — pane stays wide/narrow regardless of window size.
27. Treating "elevation" purely as a numeric shadow recipe instead of Microsoft's actual model
    (relative depth tokens + 1px stroke contour + theme-aware shadow rendering) when porting
    Fluent to web/React.

---

## 16. Cross-platform delta table — Windows vs iOS vs Android

| Dimension | Windows (Fluent/WinUI) | iOS (HIG) | Android (Material) |
|---|---|---|---|
| Top-level nav | NavigationView: Left rail (5–10 items) or Top bar (≤5); adaptive by width | Tab bar, bottom, ≤5 fixed items | Bottom nav bar / Navigation rail, similar item-count limits |
| Back | No system-level back gesture by default; app supplies its own (title-bar back button or breadcrumb); NavigationView history rules | Swipe-from-left-edge system gesture + nav-bar back button | System/gesture back (bottom gesture or hardware/soft back button) |
| Window chrome | User-resizable window, custom or system title bar, Snap Layouts, multi-monitor | Full-screen or resizable (iPadOS/macOS-Catalyst) with system chrome | Full-screen (or resizable on foldables/desktop mode), system chrome |
| Primary action | CommandBar / in-canvas buttons; primary/secondary command split | Bottom-of-screen full-width buttons; nav-bar trailing button | FAB (Floating Action Button), bottom app bar |
| Modal | ContentDialog (blocking, modal) vs. Flyout (non-modal) | `.sheet`/full-screen-cover modals | Full-screen dialogs / Material `AlertDialog` |
| Lists | ListView (text) / GridView (image) / ItemsView (modern flexible) | `List`/`Table` with cells, swipe actions | `RecyclerView`/Lists with Material list items |
| Controls source | WinUI 3 (`Microsoft.UI.Xaml.Controls`) | SwiftUI / UIKit | Jetpack Compose / Material Components |
| Typography | Segoe UI Variable, epx-based type ramp (§5) | SF Pro, Dynamic Type, pt-based | Roboto, Material type scale, sp-based |
| Icon set | **Segoe Fluent Icons** (font, PUA-mapped) | **SF Symbols** (font-based, weight/scale matched to text) | **Material Symbols** (variable font: fill/weight/grade/optical size) |
| Units | **Effective pixels (epx)** — density-independent, viewing-distance-normalized | **Points (pt)** — logical pixels at reference density | **Density-independent pixels (dp)**, text in **sp** |
| Density | Denser — mouse-precision-driven | Sparser — finger-precision-driven (44pt targets) | Sparser (48dp targets), similar to iOS |
| Keyboard/mouse | **Primary** input; hover states, right-click menus, tooltips all expected | Secondary (external keyboard/trackpad support exists but isn't assumed) | Secondary (Chromebook/desktop mode support growing but not assumed) |
| Min touch target | 40×40px (7.5mm) | 44×44pt | 48×48dp |
| Contrast minimum | 4.5:1 (WCAG AA), 7:1 in HC themes | 4.5:1 (≤17pt), 3:1 (≥18pt/bold) | 4.5:1 (WCAG AA), Material also recommends 3:1 for large text/icons |
| Corner radius | 4px controls / 8px overlays / 0px snapped | Continuous "squircle" corners, per-control | Material 3 shape scale (0/4/8/12/16/28dp + full) |

---

## 17. Windows 11 / current direction (2025–2026)

- **Fluent 2** is the live cross-platform design system (`fluent2.microsoft.design`); its
  "what's new" page (no date published) frames it as a system-level refresh over Fluent 1:
  unified color system, a formal token system, standardized corner radii, more customizability,
  deeper usage guidance, and accessibility notation.
- **WinUI is being pushed further into the shell itself.** Reporting from mid-to-late 2026
  (Windows Latest, July–August 2026) describes Microsoft actively porting long-standing legacy
  Win32 shell surfaces to WinUI 3: the File Explorer **Properties dialog** has been fully
  rebuilt in WinUI 3, the **file-copy dialog**, **Run dialog**, and **common file-open dialog**
  are migrated or in progress, and a "Switch to a local account" dialog is planned. Microsoft's
  Partner Director of Design (March Rogers) is quoted confirming the direction and that some
  legacy-UI surfaces got quick dark-mode patches only as a stopgap ahead of full WinUI rebuilds.
  **[secondary/press source, not a Microsoft Learn doc — treat as directionally reliable but
  not an authoritative spec]**
- Per the same reporting, Microsoft announced at **Build 2026** that it does not intend to
  build another UI framework after WinUI and is dropping the "3" suffix to signal WinUI's
  permanence as *the* Windows UI framework going forward.
- Known rough edges as of that reporting: WinUI surfaces (e.g. File Explorer's Home tab) can
  load slower than un-migrated legacy equivalents; visible tearing during window resize on some
  WinUI surfaces; Windows Search still runs on WebView2, not WinUI; a full Start menu rewrite
  is delayed pending performance work.
- No evidence found of a distinct, separately-named "Fluent 3" or a 2025/2026 visual-language
  break from Windows 11's original Fluent 2/WinUI 3 direction — the throughline since Windows
  11's 2021 launch is **more of the same system**, implemented more completely, not a new look.

---

## 18. Gaps — could not verify in this pass

- Exact literal shadow blur/offset/opacity per elevation level (§8) — Microsoft documents
  relative elevation *values*, not a CSS-style shadow recipe.
- Default control height (32px) for Button/TextBox/ComboBox — plausible from ecosystem
  knowledge and consistent with the 32px title-bar height, but not found stated in the
  Microsoft Learn prose pages fetched in this pass.
- Full literal names for every `xaml-theme-resources` brush (only a representative subset is
  confirmed) — the live page returned a summarized fetch, not the raw resource table.
- Numeric focus-rectangle thickness/offset (§13.3) — not found in fetched pages; Microsoft
  appears to rely on "use the system FocusVisual" as the guidance rather than publishing a
  pixel spec.
- Reduce-motion API name/behavior (§10.4) — the dedicated animation-accessibility page 404'd
  in this research pass; the Settings-level toggle location is well known but the exact WinUI
  API surface wasn't independently re-confirmed here.
- FlipView, ScrollView, and MediaPlayerElement rows in §12 — pages either 404'd or weren't
  fetched in depth this pass; entries are included for completeness but flagged individually.
- Whether "Sound" is formally the 9th/8th signature element alongside the seven confirmed in
  §2 — seen referenced in secondary listings, not confirmed on the primary
  signature-experiences index page fetched here.
