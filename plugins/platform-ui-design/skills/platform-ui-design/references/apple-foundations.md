# Apple Human Interface Guidelines — Foundations Reference

Researched 2026-09-13 against `developer.apple.com/design/human-interface-guidelines/`.
All values below are Apple-published. Anything Apple does not publish is flagged in
[§16 Gaps](#16-gaps--values-apple-does-not-publish). HIG pages are JS-rendered; the raw
content lives at `developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`.

Foundations index (18 pages): Accessibility, App icons, Branding, Color, Dark Mode, Icons,
Images, Immersive experiences, Inclusion, Layout, Materials, Motion, Privacy, Right to left,
SF Symbols, Spatial layout, Typography, Writing.
[foundations](https://developer.apple.com/design/human-interface-guidelines/foundations)

---

## 1. Hard numbers cheat sheet

| Thing | Value | Platform |
|---|---|---|
| Default control size | 44x44 pt | iOS, iPadOS, watchOS |
| Minimum control size | 28x28 pt | iOS, iPadOS, watchOS, visionOS |
| Default control size | 28x28 pt / min 20x20 pt | macOS |
| Default control size | 66x66 pt / min 56x56 pt | tvOS |
| Default control size | 60x60 pt / min 28x28 pt | visionOS |
| Padding around bezeled elements | ~12 pt | all |
| Padding around unbezeled elements | ~24 pt | all |
| Default body text size | 17 pt (min 11 pt) | iOS, iPadOS |
| Default body text size | 13 pt (min 10 pt) | macOS |
| Default body text size | 29 pt (min 23 pt) | tvOS |
| Default body text size | 17 pt (min 12 pt) | visionOS |
| Default body text size | 16 pt (min 12 pt) | watchOS |
| Contrast min, text ≤17 pt | 4.5:1 (WCAG AA) | all |
| Contrast min, text 18 pt or bold | 3:1 | all |
| Contrast target for custom colors | 7:1, especially small text | all (Dark Mode page) |
| Text enlargement people should get | ≥200% (≥140% watchOS) | all |
| tvOS safe area inset | 60 pt top/bottom, 80 pt sides | tvOS |
| tvOS tab bar height | 68 pt, 46 pt from top | tvOS |
| tvOS grid vertical spacing (min) | 100 pt | tvOS |
| tvOS grid horizontal spacing | 40 pt | tvOS |
| visionOS button center-to-center | ≥60 pt apart, ≥16 pt gap | visionOS |
| visionOS default window | 1280x720 pt, placed ~2 m away (~3 m apparent width) | visionOS |
| Game frame rate target | 30–60 fps sustained | all |
| visionOS oscillation to avoid | ~0.2 Hz | visionOS |
| Clear-glass dimming layer | 35% opacity over bright content | all Liquid Glass platforms |
| RTL font bump next to all-caps Latin | +~2 pt | all |

---

## 2. Typography — Dynamic Type

System fonts: **SF Pro** (iOS, iPadOS, macOS, tvOS, visionOS), **SF Compact** (watchOS;
SF Compact Rounded in complications), **New York (NY)** serif available everywhere
(macOS only via Mac Catalyst). SF family also includes SF Arabic, SF Armenian, SF Georgian,
SF Hebrew, SF Mono, plus Rounded variants. All shipped as **variable fonts** with
**dynamic optical sizes** — do not pick discrete Text/Display optical sizes.
Weights Ultralight→Black; widths include Condensed and Expanded.
Download: `developer.apple.com/fonts/`.

- Avoid Ultralight / Thin / Light. Prefer Regular, Medium, Semibold, Bold.
- Text style = weight + point size + leading, as one token. Use styles, not raw sizes.
- macOS does **not** support Dynamic Type.
- Dynamic Type exists on iOS, iPadOS, tvOS, visionOS, watchOS.
- Emphasized weight is reachable via symbolic traits (`.bold()` / `traitBold`).
- Symbolic traits also give loose/tight leading. Avoid tight leading at ≥3 lines.
- Don't embed system fonts; use `Font.Design.default` / `.serif`.
- In mockups you may need to hand-adjust tracking (the running system adjusts it per point size).

### 2.1 iOS / iPadOS Dynamic Type — standard sizes (size / leading, pt)

| Style | Weight | xSmall | Small | Medium | **Large (default)** | xLarge | xxLarge | xxxLarge | Emphasized |
|---|---|---|---|---|---|---|---|---|---|
| Large Title | Regular | 31/38 | 32/39 | 33/40 | **34/41** | 36/43 | 38/46 | 40/48 | Bold |
| Title 1 | Regular | 25/31 | 26/32 | 27/33 | **28/34** | 30/37 | 32/39 | 34/41 | Bold |
| Title 2 | Regular | 19/24 | 20/25 | 21/26 | **22/28** | 24/30 | 26/32 | 28/34 | Bold |
| Title 3 | Regular | 17/22 | 18/23 | 19/24 | **20/25** | 22/28 | 24/30 | 26/32 | Semibold |
| Headline | Semibold | 14/19 | 15/20 | 16/21 | **17/22** | 19/24 | 21/26 | 23/29 | Semibold |
| Body | Regular | 14/19 | 15/20 | 16/21 | **17/22** | 19/24 | 21/26 | 23/29 | Semibold |
| Callout | Regular | 13/18 | 14/19 | 15/20 | **16/21** | 18/23 | 20/25 | 22/28 | Semibold |
| Subhead | Regular | 12/16 | 13/18 | 14/19 | **15/20** | 17/22 | 19/24 | 21/28 | Semibold |
| Footnote | Regular | 12/16 | 12/16 | 12/16 | **13/18** | 15/20 | 17/22 | 19/24 | Semibold |
| Caption 1 | Regular | 11/13 | 11/13 | 11/13 | **12/16** | 14/19 | 16/21 | 18/23 | Semibold |
| Caption 2 | Regular | 11/13 | 11/13 | 11/13 | **11/13** | 13/18 | 15/20 | 17/22 | Semibold |

Point sizes assume 144 ppi @2x / 216 ppi @3x.

### 2.2 iOS / iPadOS — Larger Accessibility sizes (size / leading, pt)

| Style | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|
| Large Title | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1 | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2 | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3 | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Callout | 26/32 | 32/39 | 38/46 | 44/52 | 51/60 |
| Subhead | 25/31 | 30/37 | 36/43 | 42/50 | 49/58 |
| Footnote | 23/29 | 27/33 | 33/40 | 38/46 | 44/52 |
| Caption 1 | 22/28 | 26/32 | 32/39 | 37/44 | 43/51 |
| Caption 2 | 20/25 | 24/30 | 29/35 | 34/41 | 40/48 |

Body at AX5 is 53 pt vs 17 pt at Large — a **3.1x** range. Layouts must survive this.

### 2.3 macOS built-in text styles (no Dynamic Type)

| Style | Weight | Size pt | Line height pt | Emphasized |
|---|---|---|---|---|
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | **Bold** | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | **Medium** | 10 | 13 | Semibold |

Point sizes assume 144 ppi @2x.

macOS dynamic system font variants (match standard controls):
`controlContentFont`, `labelFont`, `menuFont`, `menuBarFont`, `messageFont`, `paletteFont`,
`titleBarFont`, `toolTipsFont`, `userFont`, `userFixedPitchFont`, `boldSystemFont`, `systemFont`
— all `NSFont.<name>(ofSize:)`.

### 2.4 tvOS built-in text styles

| Style | Weight | Size pt | Leading pt | Emphasized |
|---|---|---|---|---|
| Title 1 | Medium | 76 | 96 | Bold |
| Title 2 | Medium | 57 | 66 | Bold |
| Title 3 | Medium | 48 | 56 | Bold |
| Headline | Medium | 38 | 46 | Bold |
| Subtitle 1 | Regular | 38 | 46 | Medium |

(tvOS table continues past Subtitle 1 in Apple's page — Body/Callout/Caption rows exist but
were not retrievable in full; treat 29 pt default / 23 pt minimum as the floor.)

### 2.5 visionOS / watchOS type

- visionOS uses **bolder** variants of Dynamic Type body and title styles, and adds **Extra Large Title 1** and **Extra Large Title 2** for wide editorial layouts. Apple does not publish a visionOS point-size table on the Typography page.
- watchOS: SF Compact; default 16 pt, min 12 pt. No published per-style table.
- visionOS: prefer 2D text; default text color is **white** for contrast against glass; bold unbacked text; use **billboarding** so text stays perpendicular to line of sight.

### 2.6 Dynamic Type layout rules

- Increase interface-icon size as font size increases. SF Symbols do this automatically.
- At large sizes: stack horizontally-adjacent views vertically; reduce column count; grow row heights; keep primary elements near the top.
- Aim to show as much text at the largest AX size as at the largest standard size.
- Test at Settings → Accessibility → Display & Text Size → Larger Text.

[typography](https://developer.apple.com/design/human-interface-guidelines/typography)

---

## 3. Color

### 3.1 The rule

**Never hard-code system color values.** Documented RGB values are design-time reference only;
actual values fluctuate release to release with environmental variables. Use `SwiftUI Color` /
`UIColor` / `NSColor` semantic APIs. Never redefine a semantic color's meaning (don't use
`separator` as text color, don't use `secondaryLabel` as a background).

Supply light **and** dark variants plus an **increased-contrast** variant for every custom color —
even if your app ships single-appearance — so Liquid Glass adaptivity works.

### 3.2 iOS / iPadOS foreground content colors

| Color | Use for | API |
|---|---|---|
| Label | Primary text | `UIColor.label` |
| Secondary label | Secondary text | `UIColor.secondaryLabel` |
| Tertiary label | Tertiary text | `UIColor.tertiaryLabel` |
| Quaternary label | Quaternary text | `UIColor.quaternaryLabel` |
| Placeholder text | Placeholder in controls/text views | `UIColor.placeholderText` |
| Separator | Separator that lets content show through | `UIColor.separator` |
| Opaque separator | Separator with no show-through | `UIColor.opaqueSeparator` |
| Link | Text acting as a link | `UIColor.link` |

### 3.3 iOS / iPadOS backgrounds — two sets, three levels each

| Set | Primary | Secondary | Tertiary |
|---|---|---|---|
| System (default) | `systemBackground` | `secondarySystemBackground` | `tertiarySystemBackground` |
| Grouped (grouped table views) | `systemGroupedBackground` | `secondarySystemGroupedBackground` | `tertiarySystemGroupedBackground` |

Hierarchy convention:
- **Primary** → the overall view
- **Secondary** → grouping content/elements within the overall view
- **Tertiary** → grouping within secondary elements

Use grouped set when you have a grouped table view; system set otherwise.

### 3.4 System gray fills

`UIColor.systemGray`, `systemGray2` … `systemGray6`. Each has default light, default dark,
increased-contrast light, increased-contrast dark variants. In SwiftUI, `Color.gray`
corresponds to `systemGray`.

### 3.5 Unified system tint colors (RGB, all platforms)

| Name | SwiftUI | Light | Dark | ↑Contrast light | ↑Contrast dark |
|---|---|---|---|---|---|
| Red | `Color.red` | 255,56,60 | 255,66,69 | 233,21,45 | 255,97,101 |
| Orange | `Color.orange` | 255,141,40 | 255,146,48 | 197,83,0 | 255,160,86 |
| Yellow | `Color.yellow` | 255,204,0 | 255,214,0 | 161,106,0 | 254,223,67 |
| Green | `Color.green` | 52,199,89 | 48,209,88 | 0,137,50 | 74,217,104 |
| Mint | `Color.mint` | 0,200,179 | 0,218,195 | 0,133,117 | 84,223,203 |
| Teal | `Color.teal` | 0,195,208 | 0,210,224 | 0,129,152 | 59,221,236 |
| Cyan | `Color.cyan` | 0,192,232 | 60,211,254 | 0,126,174 | 109,217,255 |
| Blue | `Color.blue` | 0,136,255 | 0,145,255 | 30,110,244 | 92,184,255 |
| Indigo | `Color.indigo` | 97,85,245 | 109,124,255 | 86,74,222 | 167,170,255 |
| Purple | `Color.purple` | 203,48,224 | 219,52,242 | 176,47,194 | 234,141,255 |
| Pink | `Color.pink` | 255,45,85 | 255,55,95 | 231,18,77 | 255,138,196 |
| Brown | `Color.brown` | 172,127,94 | 183,138,102 | 149,109,81 | 219,166,121 |

visionOS uses the **dark** column values. Values updated June 9, 2025 (Liquid Glass refresh) —
note Blue moved from the old 0,122,255 to 0,136,255.

### 3.6 macOS semantic colors

Large named set including: alternate selected control text, alternating content backgrounds,
control accent, control background, control, control text, current control tint, unavailable
control text, find highlight, grid, header text, highlight, keyboard focus indicator, label,
link, placeholder text, quaternary label, secondary label, selected content background,
selected control, selected control text, selected menu item text, selected text background,
selected text, separator, shadow, tertiary label, text background, text, under page background,
unemphasized selected content background, unemphasized selected text background,
unemphasized selected text, window background.

**App accent color** (macOS 11+): applied to buttons, selection highlighting, sidebar icons —
only when the user's Accent color setting is **multicolor**. Any other user choice overrides
yours. Exception: a sidebar icon with a *fixed* color you specify is never overridden.

### 3.7 Color practice

- Never use the same color to mean two different things.
- Never rely on color alone — pair with text labels, shapes, or icons.
- Test under bright sun and dim light; bright surroundings make colors look darker/more muted, dark surroundings make them look brighter/more saturated.
- Test on True Tone displays; test tvOS on multiple TV brands; test macOS across P3 and sRGB profiles.
- Color spaces: sRGB is safe everywhere. Display P3 at 16 bits/channel, exported PNG, for wide color. Two similar P3 colors can collapse on sRGB; P3 gradients can clip. Ship per-color-space asset variants from the asset catalog if needed.
- Cultural meaning varies (red = danger vs. luck; white = death vs. purity).

[color](https://developer.apple.com/design/human-interface-guidelines/color) ·
[dark-mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) ·
[inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion)

---

## 4. Materials, vibrancy, and Liquid Glass

Two distinct systems:
1. **Liquid Glass** — the *functional layer* above content (controls + navigation).
2. **Standard materials** — differentiation *within* the content layer.

### 4.1 Liquid Glass (introduced June 9, 2025 at WWDC25)

Dynamic material combining glass optics with fluidity. Forms a distinct functional layer for
controls and navigation (tab bars, sidebars, toolbars, sheets, popovers) that floats above content.
Standard SwiftUI / UIKit / AppKit components adopt it automatically when built with the latest SDK.

Variants:

| Variant | Behavior | Use when |
|---|---|---|
| **Regular** | Blurs + adjusts luminosity of background to preserve legibility; scroll edge effects blur and reduce opacity | Background could hurt legibility; component carries significant text (alerts, sidebars, popovers) |
| **Clear** | Highly translucent, prioritizes underlying content | Components floating over media (photos, video) |

Clear variant contrast rule: if underlying content is **bright**, add a **dark dimming layer at
35% opacity**. If content is already dark or these are standard media playback controls, no dimming.

Rules:
- Do **not** use Liquid Glass in the content layer. Exception: transient interactive elements (sliders, toggles) take on the Liquid Glass appearance *while activated*.
- Use sparingly on custom controls — limit to the most important functional elements.
- No inherent color by default; it picks up color from content behind it.
- Small elements (toolbars, tab bars) adapt light↔dark monochromatically against underlying content.
- Larger elements (sidebars) render **more opaque** to preserve legibility.
- Apply color to *backgrounds* of primary actions, not to symbols/text, and to only one control.
- If your app has colorful content: prefer monochromatic toolbars/tab bars.
- Combine custom glass effects in a `GlassEffectContainer` for performance + fluid morphing.
- APIs: `View.glassEffect(_:in:)`, `UIGlassEffect`, `NSGlassEffectView`; button styles `.glass` / `.glassProminent` / UIKit `.glass()`, `.prominentGlass()`, `.clearGlass()`, `.prominentClearGlass()`; AppKit `NSButton.BezelStyle.glass`.
- Opt-out escape hatch: `UIDesignRequiresCompatibility` Info.plist key keeps the pre-Liquid-Glass look.

### 4.2 Standard materials — iOS / iPadOS

Four, thinnest → thickest: **ultraThin → thin → regular (default) → thick**.

- Thicker = more opaque = better contrast for text and fine features.
- Thinner = more translucent = retains more background context.
- Choose by **semantic meaning**, never by apparent color (system settings change appearance).

Vibrancy for labels: `label` (default), `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel`.
Quaternary is unavailable on `thin` and `ultraThin` (contrast too low).
Vibrancy for fills: `fill` (default), `secondaryFill`, `tertiaryFill` — all work on all materials.
Separator: single default vibrancy value, works on all materials.

### 4.3 Standard materials — tvOS

| Material | Use for |
|---|---|
| ultraThin | Full-screen views needing a light color scheme |
| thin | Overlays partially obscuring content, light color scheme |
| regular | Overlays partially obscuring content |
| thick | Overlays partially obscuring content, dark color scheme |

Buttons and image views adopt Liquid Glass **on focus**. Apple TV 4K (2nd gen) and newer support
Liquid Glass effects; older devices keep the prior appearance.

### 4.4 Standard materials — visionOS

Windows use an unmodifiable system material called **glass**. Never replace it with an opaque
background. Custom component materials:

| Material | Use for |
|---|---|
| thin | Draw attention to interactive elements and selected items |
| regular | Visually separate sections (sidebar, grouped table view) |
| thick | A dark element that must stay distinct over a regular background |

Vibrancy: `label` (standard text), `secondaryLabel` (footnotes/subtitles),
`tertiaryLabel` (inactive elements only, where legibility isn't critical).

### 4.5 macOS / watchOS materials

- macOS: several purpose-designated materials plus vibrant versions of all system colors. Choose a background blending mode: **behind window** or **within window**.
- watchOS: materials provide context in full-screen modal views. Do not remove or replace the default material background on modal sheets.

[materials](https://developer.apple.com/design/human-interface-guidelines/materials) ·
[Liquid Glass overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass) ·
[Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)

---

## 5. Layout

### 5.1 Visual hierarchy

- Order by importance: most important near top + leading side (reading order).
- Align to aid scanning; indent to convey subordination. Aligned = related, indented = child.
- Group with negative space, container shapes, or separator lines.
- Progressive disclosure: disclosure triangles, menus, nested views, scrollable sections.
- **Differentiate controls from content** with Liquid Glass. Do *not* put a solid/semi-opaque background behind controls — use a **scroll edge effect** to elevate them.
- Extend full-screen background content underneath sidebars, toolbars, tab bars.
- **Background extension effect** (`backgroundExtensionEffect()` / `UIBackgroundExtensionView`): flips and blurs the background image beneath adjacent sidebars/inspectors so it reads as continuous.

### 5.2 Adaptability

Characteristics to handle: regular/compact horizontal + vertical size classes; screen sizes;
orientations and aspect ratios; Dynamic Island; external displays, Display Zoom, resizable
windows on iPad and Mac; text-size changes; locale (LTR/RTL, date/number formats, font variation,
text length).

**Size classes** (iOS/iPadOS): each of horizontal and vertical is `compact` or `regular`.
Horizontal = narrow/wide; vertical = short/tall. Set by device type, window configuration, and
multitasking state.

- Base layout on **size classes**, never device type (idiom) or orientation.
- Consider all four combinations in both portrait and landscape aspect ratios.
- Keep *functionality* identical across size classes; vary only how much is visible at once (e.g. tab bar → sidebar at larger widths; surface items otherwise in an overflow menu).
- Idiom stays constant even as size classes change — keep the layout recognizable to the platform.
- Even orientation-locked apps must resize well.
- Don't change artwork aspect ratio on display change — scale to fill. Windows can be very wide and short or tall and narrow, so background art often must extend well past a standard frame.

### 5.3 Guides and safe areas

- **Layout guide**: rectangular region for positioning/alignment/spacing. Predefined guides give standard margins and a readable-width restriction for text. `UILayoutGuide` / `NSLayoutGuide`.
- **Safe area**: region not covered by hardware features or by toolbars/tab bars/status bar. Respect it so the Dynamic Island and system UI don't obstruct content.

### 5.4 Per-platform layout

**macOS**
- Avoid controls or critical info at the **bottom** of a window — people drag windows partly offscreen.
- Avoid content behind the camera housing at the top edge (`NSPrefersDisplaySafeAreaCompatibilityMode`).

**tvOS**
- Inset primary content **60 pt from top and bottom, 80 pt from the sides**.
- Pad between focusable elements — focused elements grow and must not overlap important info.
- Grid specs (all: horizontal spacing 40 pt, minimum vertical spacing 100 pt):

| Columns | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| Unfocused content width (pt) | 860 | 560 | 410 | 320 | 260 | 217 | 184 | 160 |

- Add extra vertical space for titled rows (above the title's center, and below the title).
- Keep partially-hidden offscreen content the same width on both sides (symmetry).

**visionOS**
- Support resizing (standard behavior, as on macOS/iPadOS). Keep content horizontally centered at very large sizes.
- Set min and max window/volume sizes to prevent overlap or unusable scale — but not to block resizing.
- Use 3D content in windows sparingly and inset, so it can't collide with controls or escape the frame.
- Put supplemental content in an **adjacent window** (`defaultWindowPlacement(_:)`), not an ornament.
- Space controls so their **centers are ≥60 pt apart**.

**watchOS**
- Max 3 glyph buttons, or 2 text buttons, side by side in a row.
- Prefer full-width text buttons; two short side-by-side labels are acceptable if the screen doesn't scroll.
- Support autorotation for views people show to others (QR codes, images).

[layout](https://developer.apple.com/design/human-interface-guidelines/layout)

---

## 6. Accessibility

Three properties of an accessible interface: **intuitive**, **perceivable**, **adaptable**.

### 6.1 Contrast (Accessibility Inspector uses WCAG AA)

| Text size | Weight | Min ratio |
|---|---|---|
| ≤17 pt | any | 4.5:1 |
| 18 pt | any | 3:1 |
| any | Bold | 3:1 |

If you can't meet this by default, at minimum ship a higher-contrast scheme that activates with
**Increase Contrast**. Check both light and dark appearances.
Dark Mode page adds: aim for **7:1** for custom foreground/background pairs, especially small text.

### 6.2 Control size and spacing

See §1. Plus: **spacing matters as much as size** — ~12 pt padding around bezeled elements,
~24 pt around unbezeled elements' visible edges.

### 6.3 Reduce Motion behaviors

When Reduce Motion is on: tighten animation springs to cut bounce; track animations directly to
gestures; avoid animating z-axis depth changes; replace x/y/z transitions with fades; avoid
animating into and out of blurs. Also respond to **Dim Flashing Lights** in video playback.

### 6.4 Other

- Vision: support ≥200% text enlargement (≥140% watchOS). Prefer system colors (they carry accessible variants). Convey information with more than color.
- Hearing: captions (synchronized, e.g. cutscenes), subtitles (live dialogue in preferred language), audio descriptions (spoken narration in natural pauses), transcripts (whole-media text). Pair audio cues with haptics and visual cues.
- Mobility: avoid custom multifinger/multihand gestures; always offer a non-gesture alternative; support Voice Control, Siri/Shortcuts, AssistiveTouch, Full Keyboard Access, Pointer Control, Switch Control.
- Cognitive: minimize time-boxed auto-dismissing UI; prefer explicit dismissal; offer game difficulty accommodations; never autoplay AV without controls.
- **Assistive Access** (iOS/iPadOS): strip noncritical workflows, one interaction per screen, double-confirm irreversible actions.
- visionOS comfort: content in field of view; prefer horizontal over vertical layouts (neck strain); slow peripheral motion; gentle camera motion; **don't anchor content to the head**; minimize large repetitive gestures.
- Tools: Accessibility Inspector; publish **Accessibility Nutrition Labels** in App Store Connect.

[accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

---

## 7. SF Symbols

- **9 weights** (Ultralight → Black), each matching an SF font weight for exact weight-matching with adjacent text.
- **3 scales**: small, **medium (default)**, large — defined relative to SF's **cap height**. Scale changes emphasis without breaking weight match at the same point size.
- **4 rendering modes**: - **Monochrome** — one color across all layers. - **Hierarchical** — one color, opacity varied per layer's hierarchy level. - **Palette** — 2+ colors, one per layer. Two colors on a three-level symbol → secondary and tertiary share. - **Multicolor** — intrinsic meaningful colors (`leaf` green, `trash.slash` red).
- Symbols are layered (e.g. `cloud.sun.rain.fill` = cloud / sun+rays / raindrops).
- **Gradients** (SF Symbols 7+): smooth linear gradient from a single source color, works across all rendering modes, system and custom colors, custom symbols. Best at larger sizes.
- **Variable color**: maps layers to thresholds 0–100% to show capacity/strength over time (`speaker.wave.3`). Layers can opt out. Use for **change**, not depth — use Hierarchical for depth.
- **Design variants**: outline (most common), fill, slash, enclosed (circle/square/rectangle); enclosed and slash often combine with outline/fill. - Outline → toolbars, lists, next to text. - Enclosed → better legibility at small sizes. - Fill → iOS tab bars, swipe actions, accent-colored selection. - Views often pick for you (tab bar prefers fill, toolbar prefers outline).
- Script/language variants ship for Latin, Arabic, Hebrew, Hindi, Thai, Chinese, Japanese, Korean, Cyrillic, Devanagari and several Indic numeral systems; they swap automatically with device language.
- Symbols animate (SF Symbols 5+); custom symbols need annotated layers, Z-order drives front-to-back vs back-to-front; animate by layer groups for related layers.
- Custom symbols: export a similar template, edit as vector. Match system detail level, optical weight, alignment, position, perspective. Use negative side margins for optical alignment (naming pattern `left-margin-Regular-M`). Draw whole shapes rather than cutouts so animation works; use erase layers for gaps. Use the component library for enclosures/badges rather than hand-drawing them. Always supply accessibility descriptions.
- **You may display but not customize** Apple product/feature symbols — the app badges them with an Info icon. Never replicate Apple hardware.
- SF Symbols 8 beta shipped June 8, 2026.

[sf-symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)

---

## 8. App icons

### 8.1 Specifications

| Platform | Layout shape | Masked shape | Layout size | Style | Appearances |
|---|---|---|---|---|---|
| iOS, iPadOS, macOS | Square | Rounded rectangle | **1024x1024 px** | Layered | default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | Rectangle (landscape) | Rounded rectangle | **800x480 px** | Layered (parallax) | — |
| visionOS | Square | **Circular** | **1024x1024 px** | Layered (3D) | — |
| watchOS | Square | **Circular** | **1088x1088 px** | Layered | — |

Color spaces: sRGB, Gray Gamma 2.2, Display P3 (wide gamut on iOS/iPadOS/macOS/tvOS/watchOS only).
System auto-scales down for Settings, notifications, etc.

### 8.2 Layers

- iOS / iPadOS / macOS / watchOS: background layer + one or more foreground layers; picks up Liquid Glass specular highlights, refraction, translucency.
- tvOS: **2–5 layers** for parallax; icon elevates and sways on focus.
- visionOS: background + one or two layers; system adds shadows and uses the alpha channel of upper layers for an embossed look; icon expands subtly on gaze.

### 8.3 Rules

- Corner rounding is **system-applied** and concentric with other rounded UI and the device bezel. **Ship unmasked square (or rectangular for tvOS) layers.** Pre-masked layers break specular highlights and produce jagged edges.
- Keep primary content centered (critical for visionOS and watchOS circular masking).
- Avoid soft/feathered edges on foreground shapes.
- Vary foreground-layer opacity for depth; import fully opaque and adjust transparency in Icon Composer.
- Prefer vector (SVG, PDF); PNG for mesh gradients and raster. Outline artwork, convert text to outlines.
- Background: solid color or gradient is usually enough — Icon Composer supports both natively. An imported background must be full-bleed and opaque.
- Let the system draw highlights, shadows, bevels, blurs, glows. Don't bake them in.
- Group layers in Icon Composer to apply effects at group level; groups expose extra Liquid Glass attributes (specular highlights, refraction, translucency).
- Text in icons: only if essential. No localization, no accessibility, often illegible. In tvOS, put any text **above** other layers or parallax crops it.
- No photos, no replicated UI components, no screenshots, no Apple hardware replicas.
- Keep the design **visually consistent across every platform** you ship on.
- Appearances: keep core features identical across default / dark / clear / tinted. Base the dark icon on the light one; avoid excessively bright imagery; color backgrounds give best dark contrast.
- Alternate icons: iOS, iPadOS, tvOS, and compatible apps in visionOS. iOS/iPadOS alternates need their own dark, clear, and tinted variants. All are subject to App Review.
- tvOS: keep a safe zone — focus crops edges, and foreground layers crop more than background.
- visionOS: don't add hole/concave shapes to the background — system shadows make them protrude.
- watchOS: don't use black backgrounds (icon blends into the display).
- Tooling: **Icon Composer** (in Xcode, also standalone from Apple Design Resources); **Icon Composer 2 beta** shipped June 8, 2026.

[app-icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

---

## 9. Interface icons (glyphs)

- Express one concept; streamlined shapes and touches of color, not shading/texture/highlights.
- Consistent size, detail level, **stroke weight**, and perspective across your whole icon set. Adjust individual dimensions to equalize *visual* weight.
- Match icon weight to adjacent text weight unless deliberately emphasizing one.
- Optically center asymmetric icons; bake the offset into the asset as padding so geometric centering works downstream.
- Don't build selected-state variants — standard toolbars, tab bars, and buttons handle it.
- Use **vector (PDF or SVG)**, not PNG — vectors scale to all resolutions from one asset.
- Gender-neutral figures; avoid culturally ambiguous imagery; localize any characters shown.
- Always supply accessibility descriptions.
- No Apple hardware replicas — use Apple Design Resources or SF Symbols.

macOS document icon sizes — background fill: 512², 256², 128², 32², 16² px @1x (and @2x doubles).
Center image: 256², 128², 32², 16² px @1x (and @2x doubles). Center image margin ≈10%, i.e. keep
the image inside ~80% of the canvas.

[icons](https://developer.apple.com/design/human-interface-guidelines/icons)

---

## 10. Images and resolution

A **point** maps to a variable number of pixels on 2D platforms; in **visionOS a point is an
angular value**, which is what lets content scale by distance.

| Platform | Scale factors required |
|---|---|
| iPadOS, watchOS | @2x |
| iOS | @2x and @3x |
| visionOS | @2x or higher |
| macOS, tvOS | @1x and @2x |

Naming: append `@1x` / `@2x` / `@3x` in the asset catalog.
Design at the lowest resolution and scale up; put vector control points on whole values so they
stay grid-aligned at 2x and 3x.

| Content | Format |
|---|---|
| Bitmap / raster | De-interlaced PNG |
| PNG not needing 24-bit color | 8-bit palette |
| Photos | JPEG (optimized) or HEIC |
| Stereo / spatial photos | Stereo HEIC |
| Flat icons, interface icons, flat art needing scaling | PDF or SVG |

- Always embed a color profile.
- Always test on real devices.

**watchOS autoscaling PDF** — design for the 40 mm / 42 mm screens at @2x:

| Screen | 38 mm | 40 mm | 41 mm | 42 mm | 44 mm | 45 mm | 49 mm |
|---|---|---|---|---|---|---|---|
| Image scale | 90% | 100% | 106% | 100% | 110% | 119% | 119% |

Avoid transparency in watchOS images to keep files small — except complication images, menu
icons, and template interface icons, where the system uses alpha to place color.

**tvOS** — layered images (2–5 layers) are required for the app icon, strongly encouraged for
other focusable images including Top Shelf. Keep text in the foreground; keep the background
layer opaque; keep layering subtle; leave a safe zone around foreground layers; always preview.

**visionOS** — prefer vector for 2D images; the system dynamically rescales, and image pixels
may not map 1:1 to screen pixels. @2x rasters look fine at typical distances but won't scale
dynamically and go soft up close; higher resolutions cost file size and runtime performance,
especially **above @6x**. Spatial photos use stereo HEIC; prefer the feathered glass background
for text over them; show spatial photos/scenes in standalone views with minimal UI.

[images](https://developer.apple.com/design/human-interface-guidelines/images)

---

## 11. Dark Mode

Supported in **iOS, iPadOS, macOS, tvOS**. **Not supported in visionOS or watchOS.**

- Never offer an app-specific appearance setting — it duplicates a system setting and reads as a bug.
- Users can also pick **Auto**, which flips appearance mid-session. Handle it live.
- Dark palette is **not** an inversion — some colors invert, some don't.
- Use semantic colors (`labelColor`, `controlColor`, `separatorColor`). For custom colors, add a Color Set to the asset catalog with bright + dim variants. Never hard-code.
- Contrast: ≥4.5:1 minimum, target **7:1** for custom pairs, especially small text.
- Test with **Increase Contrast** and **Reduce Transparency** on, separately and together — Increase Contrast in Dark Mode can *reduce* contrast between dark text and dark backgrounds.
- Slightly darken content images that carry white backgrounds so they don't glow.
- SF Symbols adapt automatically. Design separate light/dark interface icons where an outline is needed on only one background. Combine into one named image via asset catalog.
- Use system label colors (primary/secondary/tertiary/quaternary) and system text views/fields rather than drawing text yourself.
- A permanently dark UI is acceptable in rare cases (immersive media viewing).

**iOS/iPadOS base vs elevated**: in Dark Mode the system keeps two background sets. **Base** is
dimmer (recedes), **elevated** is brighter (advances). The system swaps base → elevated
automatically for foreground interfaces (popovers, modal sheets) and to separate apps in
multitasking and windows in multi-window. Custom background colors defeat this — prefer system
background colors.

**macOS desktop tinting**: with the graphite accent color, window backgrounds pick up color from
the desktop picture. Add transparency to custom component backgrounds that have a visible
background/bezel, **only in neutral states** — adding it to a colored state makes the color
fluctuate as the desktop changes.

[dark-mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

---

## 12. Motion

- Add motion purposefully; motion with no purpose is a distraction and can leave people queasy.
- **Make motion optional** — never the sole carrier of important information. Supplement with haptics and audio.
- Feedback motion should follow gestures and expectations: if a view slides down to appear, it shouldn't dismiss sideways.
- Aim for brief and precise feedback animations.
- Avoid adding motion to frequent UI interactions — the system already animates standard elements.
- Let people cancel/skip motion; never make them wait through an animation, especially repeatedly.
- Animated SF Symbols (SF Symbols 5+) are a good default for custom motion.
- Games: sustained **30–60 fps**. Let people switch power modes (e.g. when an external power source is detected).

**visionOS**
- Avoid motion at the edge of the field of view — in peripheral vision it pulls attention and can trick people into feeling like they or the room around them just moved.
- For large objects filling much of the FOV, increase translucency or lower contrast so the motion reads as the object's, not the world's.
- Use fades to relocate objects.
- Don't let people spin the whole virtual world — it's disorienting even at a subtle rate and even under the person's own control.
- Give a stationary frame of reference.
- Avoid sustained oscillation, especially near **0.2 Hz** — keep amplitude low and content translucent.

**watchOS** — layout/appearance animations include built-in easing at start and end that cannot
be disabled or customized.

**iOS / iPadOS / macOS / tvOS** — no additional considerations.

[motion](https://developer.apple.com/design/human-interface-guidelines/motion)

---

## 13. Per-platform differences

| | iOS | iPadOS | macOS | watchOS | tvOS | visionOS |
|---|---|---|---|---|---|---|
| **Display** | Medium, high-res | Large, high-res | Large, high-res, multi-display (incl. iPad) | Small, high-res, Always On | Very large, high-res | Limitless spatial canvas |
| **Viewing distance** | ≤1–2 ft | ~3 ft | ~1–3 ft | ≤1 ft | 8 ft+ | Head-relative, system-placed |
| **Primary input** | Multi-Touch, virtual keyboard, voice; gyro/accel | Multi-Touch, hardware keyboard, trackpad/pointer, Apple Pencil, voice — often combined | Keyboard, pointing device, game controllers, Siri; high-precision/pixel-perfect | Digital Crown, tap/swipe/drag, Action button, Shortcuts | Siri Remote, game controller, voice, companion devices | **Eyes + hands**: gaze + indirect pinch (default); direct touch for near objects |
| **Selection model** | Touch target | Touch + pointer | Pointer + keyboard focus | Touch + crown | **Focus engine** (elements grow on focus) | **Gaze hover effect** (private — system-drawn, not exposed to app) |
| **Default control size** | 44x44 pt | 44x44 pt | 28x28 pt | 44x44 pt | 66x66 pt | 60x60 pt |
| **Min control size** | 28x28 pt | 28x28 pt | 20x20 pt | 28x28 pt | 56x56 pt | 28x28 pt |
| **Default text** | 17 pt (min 11) | 17 pt (min 11) | 13 pt (min 10) | 16 pt (min 12) | 29 pt (min 23) | 17 pt (min 12) |
| **Density** | Low; one primary task | Medium; large display, minimize modality | High; more content, fewer nested levels, no strain | Lowest; single-screen glances <1 min | Low; big type, edge-to-edge art | Medium; comfort-first |
| **Dynamic Type** | Yes | Yes | **No** | Yes | Yes | Yes (bolder body/title + XL Title 1/2) |
| **Dark Mode** | Yes | Yes | Yes | **No** | Yes | **No** |
| **Navigation model** | Tab bar floating over bottom; search can be its own trailing tab; tab bar can minimize on scroll | Tab bar near top, or adaptive sidebar; menu bar (new); split views + inspector | Menu bar + windows + sidebar/split view; toolbar | Shallow hierarchy; Digital Crown for vertical nav; complications + notifications as primary entry | Tab bar 68 pt tall, 46 pt from top; focus-driven | Vertical tab bar on window's leading side, expands on gaze; sidebar within a tab for depth |
| **Typical margins** | System safe areas + layout guides (no published numeric margin) | Same | Same; avoid bottom-edge controls; avoid camera housing | Full-width buttons; ≤3 glyph / ≤2 text buttons per row | **60 pt top/bottom, 80 pt sides** | ≥60 pt between control centers, ≥16 pt gaps |
| **Windowing** | None (full screen); PiP / FaceTime overlay | Full-screen or **windowed** (free resize, window controls, tiling, minimize, remembers size/placement) | Main / key / inactive window states; frame + body; optional bottom bar | None | None; PiP where supported | Shared Space (multi-app) or Full Space (solo); windows + volumes; only one window active at a time |
| **Session length** | 1–2 min to 1 hr+ | Quick actions to hours | Minutes to hours | <1 min | Hours | Varies by immersion level |
| **Distinct system features** | Widgets, Home Screen quick actions, Spotlight, Shortcuts, activity views | Multitasking, widgets, drag and drop | Menu bar, file management, full screen, Dock menus | Complications, notifications, Always On, watch faces | Focus + parallax, Top Shelf, multiuser sign-in | Passthrough (Digital Crown controls amount), Spatial Audio, immersion levels, SharePlay spatial Personas |

Notes:
- **tvOS focus**: elements enlarge on focus (pad accordingly). Never indicate focus by color alone — subtle scaling and responsive animation are the primary affordances.
- **visionOS input privacy**: hover effects are drawn by the system; the app never learns where the user is looking before a tap.
- **visionOS scale**: `dynamic` scale keeps windows apparently constant-size with distance (default for windows); `fixed` scale makes objects shrink with distance like real objects (default for volumes) — reserve fixed for non-interactive, realistically-sized objects.
- **macOS window states**: Main (frontmost, one per app), Key (accepts input, one onscreen), Inactive (no vibrancy, appears subdued/farther). Key window colors its traffic-light controls; others gray them.
- **iPadOS/visionOS window sizing**: visionOS default window **1280x720 pt**, placed ~2 m away (≈3 m apparent width). iPadOS resizes **continuously** down to a minimum, no preset steps.

[designing-for-ios](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios) ·
[designing-for-ipados](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados) ·
[designing-for-macos](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos) ·
[designing-for-watchos](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos) ·
[designing-for-tvos](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos) ·
[designing-for-visionos](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos) ·
[spatial-layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout) ·
[windows](https://developer.apple.com/design/human-interface-guidelines/windows)

---

## 14. Patterns

### 14.1 Launching
- Launch instantly; people won't wait more than a couple of seconds.
- Launch screen **required**: iOS, iPadOS, tvOS. **Not required**: macOS, visionOS, watchOS.
- A launch screen is not branding and not onboarding. Make it nearly identical to screen one (solid color → solid color) to avoid a flash; match current orientation and appearance mode. **No text** (it can't be localized). No logos unless fixed in screen one. tvOS's is static, not layered.
- Need a splash screen? Put it at the start of onboarding instead.
- Restore state granularly: scroll position, window state and location.
- iOS/iPadOS: launch in the current orientation; landscape-only UIs must work rotated either way.
- tvOS live-viewing: consider auto-playing after a few seconds of inactivity.
- visionOS: consider launching into the **Shared Space** even for immersive apps, with a control to enter the Full Space.

### 14.2 Onboarding
- Happens **after** launching; it is not part of launch.
- Teach through **interactivity**, not instructional screens.
- Prefer **context-specific tips** (TipKit) near the UI they describe over one upfront flow.
- Prerequisite flows: brief, enjoyable, low memorization. Separate tutorials: optional, skippable, never re-shown after a skip, findable later in help/account/settings.
- Teach your app, not the system or device.
- Postpone nonessential setup; ship good defaults.
- Fold a permission request into onboarding **only** if the app can't function without it; otherwise request at point of use.
- Let people use the app before prompting for ratings or purchases.
- Don't block on large downloads; keep licensing out of the flow.

### 14.3 Loading
- Best case: content is ready before anyone notices it was loading.
- Show something immediately — placeholder text/graphics/animation — then replace.
- Let people act while content loads in the background.
- Long loads: show hints, tips, or new features, timed to the actual remaining load.
- **Determinate** indicator when duration is known; **indeterminate** when not.
- Games: custom loading view matching the game's style. Use Background Assets for large packs.
- **watchOS**: avoid indeterminate/loading indicators — they imply the person must keep watching; say they'll get a notification. For 1–2 s, an indicator still beats a blank screen.

### 14.4 Feedback
- Match delivery to significance: passive status display vs. interrupting alert.
- Use multiple channels (color + text + sound + haptics) so it lands when silenced, unwatched, or on VoiceOver.
- Integrate status near what it describes (Mail's toolbar: last update + unread count).
- Alerts = critical, ideally actionable. Overuse destroys impact.
- Warn before **unexpected and irreversible** loss. Don't warn when loss is expected (Finder trash).
- Confirm completion only for important actions (Apple Pay); people assume success.
- When a command can't run, say why.

### 14.5 Modality
Use for: guaranteeing critical info is seen; confirming/modifying a recent action; a distinct
narrow task without losing context; an immersive or high-concentration experience.
- Only when there's a clear benefit. Keep modal tasks simple, short, streamlined.
- Never an app-within-an-app. If subviews are unavoidable, one path through, and no buttons that could be mistaken for dismiss.
- Full-screen modal suits in-depth content or complex multistep tasks (video, photos, camera, markup, editing). In visionOS Shared Space it fills the window; in a Full Space it can become more immersive.
- Always give an obvious dismissal per platform: iOS/iPadOS/watchOS → top-toolbar button or swipe down; macOS/tvOS → button in the main content view.
- Confirm before closing if user-generated content would be lost (iOS: action sheet with Save).
- Title the modal with its task. One modal at a time; never two alerts at once (alerts may stack over other modals).
- Components: alerts (all platforms), sheets, popovers, action sheets / confirmation dialogs, activity views; iPadOS/macOS/visionOS may use a separate **window** instead.

### 14.6 Multitasking
- Every app must work with multitasking. Rare exceptions: some games, visionOS Full Space apps.
- Pause attention-requiring activity on switch-away; resume exactly where they left off.
- Audio: **pause indefinitely** for primary audio (music, podcasts, audiobooks); **duck or briefly pause** for short interruptions (GPS prompts), then restore.
- Finish user-initiated background tasks (downloads, video processing) before suspending.
- Notify only on important/time-sensitive completions.
- **Not supported in watchOS.**
- iOS: PiP / FaceTime alongside another app.
- iPadOS: full-screen **or** windowed; free resizing; window controls for tiling, full screen, minimize, close; frontmost window gets colored controls + drop shadow on those behind; multiple windows per app; PiP in both modes. Apps neither control nor are told the active configuration.
- macOS: multitasking is the default; layered shadows and state effects differentiate windows.
- tvOS: browse/play while PiP shows movies or TV.
- visionOS: multiple apps in the Shared Space, but **only one window active at a time** — the looked-at window activates, the previous one becomes more translucent and recedes along z. Closing a window backgrounds the app without quitting. Closing the Now Playing app's window pauses audio (resumable in Control Center). Don't alter window edge appearance (system applies a feathered mask). Don't pause video when a person looks away. Expect ducking when not Now Playing.

### 14.7 Navigation and search
Index covers: path controls, search fields, sidebars, tab bars, token fields.

**Tab bars**
- Navigation only — use a toolbar for actions on the current view. Keep visible while navigating; only modals may cover it.
- Avoid overflow/"More" tabs. Don't disable or hide tab buttons when content is unavailable.
- Label every tab, ideally one word, under or beside an SF Symbol.
- Badges (red oval, white text/number or "!") for critical new/updated info only.
- Prefer monochromatic tab bars over bright, colorful content.
- iOS: floats above the bottom on Liquid Glass; can minimize on scroll (`.tabBarMinimizeBehavior(.onScrollDown)`); supports an accessory (MiniPlayer); search can be a dedicated trailing tab (`Tab(role: .search)` / `UISearchTab`).
- iPadOS: near the top; fixed or convertible to a sidebar; **aim for ≤5 tabs**; user-customizable.
- tvOS: **68 pt tall, 46 pt from top**; scrolls offscreen in single-view tabs, pinned in split views; live-viewing order = live → Cloud DVR/recorded → other.
- visionOS: always vertical on the leading side; expands on gaze, tap to open; symbol + short label.
- watchOS: not supported.

**Sidebars**
- Extend rich content beneath the sidebar (horizontal scroll or `backgroundExtensionEffect()`).
- Let people customize contents/order and hide it, but don't hide by default.
- **Show no more than two levels of hierarchy.** Deeper → split view with a content-list column. Group with disclosure controls; title groups succinctly.
- Sidebar icons default to the app accent color; a macOS user accent change should recolor them. Fixed colors only where they carry meaning (Mail's yellow VIP).
- iOS/iPadOS: consider a tab bar first. `sidebarAdaptable` TabView gives a sidebar/tab-bar toggle adapting to rotation and resize. Non-SwiftUI: collection view list layout `sidebar` appearance.
- macOS: row height / text / glyph size follow sidebar size (small, medium, large), settable in code and by the user in General settings. Consider auto hide/reveal on resize. No critical info at the bottom.
- visionOS: a sidebar **inside** a tab for deep hierarchies; sidebar selection must not change the tab.
- tvOS: no extra considerations. watchOS: not supported.

**Search**
- iOS: bottom toolbar with other important actions (Notes); the field slides up with the keyboard on focus — verify your app matches.
- iPadOS / macOS: toolbar, upper trailing corner.
- Tab-based apps (iOS, iPadOS, macOS): a dedicated search tab (Photos, Apple TV) via the semantic API, so the system separates and pins it to the trailing end.
- Local search: offer as a filter on the current view for section-based apps (Music).
- Aim for **one** clearly identified searchable location. Always show current scope — placeholder text, scope bar, or title (Mail names the mailbox).
- Offer recent searches before typing and predictive suggestions while typing (`searchSuggestions(_:)`).
- Privacy: always offer a way to clear search history.

[launching](https://developer.apple.com/design/human-interface-guidelines/launching) ·
[onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) ·
[loading](https://developer.apple.com/design/human-interface-guidelines/loading) ·
[feedback](https://developer.apple.com/design/human-interface-guidelines/feedback) ·
[modality](https://developer.apple.com/design/human-interface-guidelines/modality) ·
[multitasking](https://developer.apple.com/design/human-interface-guidelines/multitasking) ·
[navigation-and-search](https://developer.apple.com/design/human-interface-guidelines/navigation-and-search) ·
[tab-bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) ·
[sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) ·
[searching](https://developer.apple.com/design/human-interface-guidelines/searching)

---

## 15. Right to left, inclusion, privacy, branding, writing

### 15.1 Right to left
**Flip**: progress controls (sliders, progress indicators, plus their start/end glyphs);
navigation and fixed-order controls (back button points **right**; next/previous); icons
representing text or reading direction; icons showing forward/backward motion; the *order* of
numerals showing progress or sequence.

**Don't flip**: photos, illustrations, artwork (meaning changes; possible copyright breach);
logos; universal marks (checkmark); real-world-object icons (clocks, right-handed tools); controls
meaning an actual direction ("to the right"); **digits inside a specific number** (541, phone and
card numbers keep their order).

- Text: match alignment to interface direction, but align a **paragraph** (3+ lines) to its own language. Keep alignment consistent across all items in a list even when scripts differ.
- Numerals: Hebrew uses Western Arabic; Arabic may use Western or Eastern Arabic, varying by country and even within a region. Rely on system number representations unless number-centric.
- Arabic and Hebrew have no uppercase and look small beside all-caps Latin — **increase the RTL font size by ~2 pt** to balance.
- SF Symbols ships RTL variants and localized symbols (Arabic, Hebrew, others); custom symbols can declare directionality. Localize icons that must show real text; better, redesign to avoid text.
- Decompose complex icons before flipping — badge, slash, and magnifying-glass components follow the design language regardless of locale; preserve a tool's handedness while flipping the base.

[right-to-left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)

### 15.2 Inclusion
- An inoffensive app is not automatically inclusive.
- Address people as "you"/"your", not "the user"/"the player". Reserve "we"/"our" for your company/software — and mostly avoid it (see Writing).
- Define specialized terms; replace colloquialisms (they don't translate, and "peanut gallery" / "grandfathered in" have exclusionary origins); be careful with humor.
- Avoid unnecessary gender references (e.g. rewrite copy so it names the role — "Members can upload photos" — rather than a gendered pronoun). Prefer nongendered figures; SF Symbols provides them. Where gender is legally/medically required, include nonbinary, self-identify, and decline-to-state; let people set pronouns.
- Represent a range of races, body types, ages, and physical capabilities; avoid stereotypical roles; avoid high-affluence settings as default.
- Audit hidden assumptions — security questions like a childhood pet's name or first job assume a particular life experience. Prefer universal ones.
- Disability is a spectrum and can be permanent, temporary, or situational. People-first framing: accomplishments and goals before disabilities.
- Color meaning is cultural (white = grief in some cultures, purity in others).

[inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion)

### 15.3 Privacy
Permission required for: personal data (location, health, financial, contact, PII);
user-generated content (email, messages, calendar, contacts, gameplay info, Apple Music activity,
HomeKit data, audio/video/photos); protected resources (Bluetooth peripherals, home automation,
Wi-Fi and local networks); device capabilities (camera, microphone); visionOS ARKit data in a Full
Space (hand tracking, plane estimation, image anchoring, world tracking); the advertising identifier.

- Request only what a feature needs, only when the person uses that feature. Avoid launch-time requests unless the data is required to function at all.
- **Purpose strings**: brief, complete, active-voice, sentence case, ending in a period. - Good: a plain statement of what the app does with the data and why, e.g. it listens overnight to catch snoring. - Bad (passive, vague): implying access is needed without saying for what. - Bad (imperative, no justification): telling the person to flip on a permission with no reason given.
- A pre-alert screen may explain but must have **exactly one button** that opens the system alert, titled "Continue" or "Next" — **never "Allow"**. No cancel/close, no other actions.
- Tracking: never precede the ATT alert with anything misleading. Prohibited and App-Store-rejected: incentives or withholding functionality; imitation requests; images of the standard alert; visual cues pointing at the Allow button.
- **Location Button** (iOS, iPadOS, watchOS, Core Location) grants one-time access on tap. Customizable: system-provided title, filled/outlined glyph, background color, title+glyph color, corner radius — nothing else. The system warns about low contrast or excessive translucency; text must fit at all accessibility sizes and in every localization. Persistent problems make the system **stop granting location** on tap.
- Process on-device where possible (Apple Neural Engine, CreateML). CloudKit encrypts and manages keys for strings, numbers, dates (iOS 15+).
- Prefer passkeys; else two-factor plus Face ID / Optic ID / Touch ID. Keychain for secrets, never plain text. Don't invent authentication schemes.
- macOS: sign with Developer ID; sandbox (required for Mac App Store); don't assume who is signed in (fast user switching).
- visionOS: ARKit always runs but sends **no data** to Shared Space apps — a Full Space is required for ARKit APIs, and Plane Estimation, Scene Reconstruction, Image Anchoring, and Hand Tracking each need permission. Gaze is private by design. The back camera returns blank input (compatibility only); the front camera serves spatial Personas with permission.
- Publish App Store privacy details in App Store Connect.

[privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)

### 15.4 Branding
- Apply your accent color **judiciously** — minimize on controls; reserve for primary actions or status indicators (unread badges, selected tab icon). Prefer brand color in the **content layer**, where it scrolls beneath Liquid Glass and is picked up dynamically.
- Custom fonts: verify legibility at all sizes, with bold text and Dynamic Type. Common pattern — custom font for headlines/subheads, system fonts for body and captions.
- Express brand with **familiar components**; customization must preserve platform-appropriate sizing, placement, and behavior.
- Branding always defers to content. Don't spend screen space on brand-only elements; don't repeat your logo through the app.
- **Never use a launch screen as branding** — use an onboarding/welcome screen.
- Apple trademarks must not appear in your app name or images (Apple Trademark List; Guidelines for Using Apple Trademarks).
- No additional considerations on any platform.

[branding](https://developer.apple.com/design/human-interface-guidelines/branding)

### 15.5 Writing
- Establish a **voice** (consistent) and vary **tone** by context. Read it aloud; cut every unnecessary word. Most important information first; split multiple ideas across screens.
- Button and link labels: use a **verb**; clarity over cleverness (a plain "Save" beats a cute "You got this!"). Never "Click here".
- **Capitalization**: title case reads formal, sentence case casual. Pick per UI element type and apply consistently. Note: lists/tables/forms now render **section headers in title-style capitalization**, no longer all caps — update your strings.
- Multi-step flows: "Get Started" → "Continue"/"Next" (or a hint at the next step) → "Done".
- Possessive pronouns sparingly — a bare "Favorites" beats "Your Favorites". **Avoid "we" entirely**: a flat "Content didn't load" beats "We're sorry, we couldn't load this content."
- Per device: "tap" on touch, "click" on Mac. iPhone and Apple Watch reward brevity and personalization; TV text must be brief and large, and is often seen by several people at once.
- Empty states: welcome, educate, give an action. Don't put crucial information there — it disappears.
- Errors: prevent first; then place near the problem, avoid blame, say what to do — spell out the actual requirement ("needs at least 8 characters") rather than just flagging failure ("too short"). No "Oops!"/"Uh-oh".
- Text fields: label every field; hint/placeholder shows format ("name@example.com", "Your name"). Errors next to the field, instructive not scolding — state the fix positively ("letters only in this field") rather than just the prohibition ("no numbers or symbols").
- Settings labels: practical, with an explanation if the label alone isn't enough. Describe what the setting does when **on**.

[writing](https://developer.apple.com/design/human-interface-guidelines/writing)

---

## 16. Gaps — values Apple does NOT publish

Do not invent these; they are absent from the current HIG.

- **iOS/iPadOS numeric layout margins** (the commonly-cited 16 pt / 20 pt). The HIG describes layout guides and safe areas qualitatively. `UIViewController.systemMinimumLayoutMargins` is documented as a read-only system value with **no published numbers** — Apple's own example in that doc uses "20 points" only illustratively. Use the layout guides; don't hard-code.
- **macOS minimum window sizes.** The Windows page gives no numbers. Only visionOS publishes a default (1280x720 pt) and tells you to set your own min/max.
- **Corner-radius values.** Apple never publishes numeric radii. The guidance is **concentricity**: hardware curvature informs control, sheet, popover, and window curvature. Use `ConcentricRectangle` / `Shape.rect(corners:isUniform:)` (SwiftUI) or `UIView.cornerConfiguration` / `UICornerConfiguration` (UIKit) rather than constants.
- **iOS/iPadOS device screen-size and margin specification tables.** Formerly on the Layout page; the current page carries no per-device table. Use Apple Design Resources templates.
- **watchOS and visionOS Dynamic Type point-size tables.** Only default/minimum sizes are published.
- **tvOS text styles below Subtitle 1** (Body, Callout, Caption rows exist on the page but were not retrievable in full here).
- **Standard spacing scale** (a 4/8 pt grid). Apple publishes only the accessibility padding figures (~12 pt bezeled, ~24 pt unbezeled), the tvOS grid numbers, and the visionOS 60/16 pt rule. The Liquid Glass guidance directs you to the system's built-in spacing metrics rather than hand-rolled values.
- **Standard system color hex values.** RGB triplets above are Apple's design-time reference and are explicitly documented as subject to change. Use semantic APIs.

---

## 17. Recent and changed (dated)

| Date | Change |
|---|---|
| 2026-06-23 | iOS 27 / iPadOS 27 and macOS 27 Figma UI kits updated |
| 2026-06-08 | Icon Composer 2 beta; SF Symbols 8 beta; Pass Designer; design principles reintroduced; Siri revised for Siri AI; new Snippets page; menu item icon guidance; sidebar icon color + adaptable sidebar guidance; scroll edge effect guidance; app icon Liquid Glass refinements; search field/searching terminology and iOS search-as-a-tab; tab bar terminology; generative AI guidance; Apple Pay and Wallet for iOS 27 |
| 2026-06-08 | App icons: "Refined guidance for Liquid Glass" |
| 2026-03-24 | Sheets: button placement; Scroll views: Look to Scroll in visionOS |
| 2025-12-16 | **Typography: emphasized weights added to Dynamic Type specs for every platform**; Color updated for Liquid Glass; Buttons/Toolbars/Tab bars updated for Liquid Glass; Widgets and Live Activities updated across platforms (+visionOS/CarPlay/macOS); Menus breakthrough effects in visionOS; Images: spatial photos and spatial scenes; Writing: language patterns + possessive pronouns |
| 2025-09-09 | Layout: iPhone 17 / iPhone Air / 17 Pro / 17 Pro Max, Apple Watch SE 3 / Series 11 / Ultra 3 specs; Materials: Liquid Glass guidance updated |
| **2025-06-09** | **Liquid Glass introduced** (WWDC25). Layout, Color (system color values updated), Materials, App icons (layered icons, cross-platform consistency), Windows (iPadOS resizable windows) all updated. Accessibility: Assistive Access, Switch Control, Accessibility Nutrition Labels |
| 2025-03-07 | Accessibility expanded/refined; Dynamic Type guidance moved to Typography; VoiceOver split to its own page. Layout: iPhone 16e, iPad 11-inch, iPad Air 11/13-inch |
| 2024-09-09 | Layout: iPhone 16 family, Apple Watch Series 10 |
| 2024-06-10 | App icons: dark and tinted variants for iOS/iPadOS |
| 2023-06-21 | visionOS guidance added across Foundations; Privacy consolidated |

Liquid Glass is documented under Technology Overviews, not only the HIG. Adoption is largely
automatic: rebuild with the latest Xcode/SDKs and standard SwiftUI/UIKit/AppKit components pick it
up. Opt out with `UIDesignRequiresCompatibility` in Info.plist.

[design/whats-new](https://developer.apple.com/design/whats-new/) ·
[HIG root](https://developer.apple.com/design/human-interface-guidelines/) ·
[WWDC25 219 "Meet Liquid Glass"](https://developer.apple.com/videos/play/wwdc2025/219/) ·
[WWDC25 356 "Get to know the new design system"](https://developer.apple.com/videos/play/wwdc2025/356/)
