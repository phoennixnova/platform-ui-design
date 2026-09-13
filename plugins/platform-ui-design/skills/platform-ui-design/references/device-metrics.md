---
description: Device-frame and chrome-metric reference for UI mockup artboards (Apple + Android/Material).
last_verified: 2026-09-13
---

# Device & Chrome Metrics Reference

All values are logical units (iOS/iPadOS/watchOS/tvOS = points @1x; Android = dp). Anything not confirmed
against a primary spec is explicitly marked **convention (unverified)** — treat it as a sane default, not
a guarantee. iPhone 17 (Sept 2025) is the newest shipping lineup as of this writing (2026-09-13); an
"iPhone 18" is rumored for a Sept 2026 event but was not a released product at time of research, so it is
omitted rather than guessed.

---

## 1. Apple device logical sizes (points, portrait)

| Device | Logical W×H (pt) | Native scale | Top safe-area (pt) | Bottom safe-area / home indicator (pt) | Notes |
|---|---|---|---|---|---|
| iPhone SE (3rd gen) | 375×667 | @2x | 20 | 0 | Home button, no notch |
| iPhone 13 mini | 375×812 | @3x (native px/pt ≈2.88) | 50 | 34 | Notch |
| iPhone 14 (base) | 390×844 | @3x | 47 | 34 | Notch (last base model with a notch) |
| iPhone 15 / 16 (base) | 393×852 | @3x | 59 | 34 | Dynamic Island; base matches Pro size starting w/ 15 |
| iPhone 16 Pro | 402×874 | @3x | 62 | 34 | Dynamic Island |
| iPhone 16 Pro Max | 440×956 | @3x | 62 | 34 | Dynamic Island |
| iPhone 17 / 17 Pro (newest base+Pro) | 402×874 | @3x | 62 | 34 | Dynamic Island; base unified with Pro size |
| iPhone 17 Pro Max | 440×956 | @3x | 62 | 34 | Dynamic Island |
| iPhone Air | 420×912 | @3x | 68 | 34 | Dynamic Island, slimmer chassis → taller top inset |
| iPad mini (6th gen) | 744×1133 | @2x | 20 — convention (unverified) | 20 — convention (unverified) | Touch ID side button, no notch/island |
| iPad Air 11" | 820×1180 | @2x | 24 — convention (unverified) | 20 — convention (unverified) | Touch ID side button, no notch/island |
| iPad Pro 13" | 1032×1376 | @2x | 24 — convention (unverified) | 20 — convention (unverified) | Face ID top bezel, no notch/island |
| Apple Watch 41mm | 352×430 | @2x | — | — | Rounded rect display |
| Apple Watch 45mm | 396×484 | @2x | — | — | Rounded rect display |
| Apple Watch 49mm (Ultra) | 422×514 | @2x | — | — | Rounded rect display |
| Apple TV (tvOS design canvas) | 1920×1080 | @1x | — | — | Design canvas per tvOS HIG; actual output scales to display (1080p/4K) |
| Mac default window | — | @1x/@2x (Retina) per display | — | — | Apple publishes no fixed default size — convention (unverified): apps typically restore last size or open ~1280×800 |

Sources: [iOS Resolution — ios-resolution.com](https://iosref.com/res) · [Use Your Loaf — iPhone 17 Screen Sizes](https://useyourloaf.com/blog/iphone-17-screen-sizes/) · [Use Your Loaf — iPhone 16](https://useyourloaf.com/blog/iphone-16-screen-sizes/) · [Use Your Loaf — iPhone 15](https://useyourloaf.com/blog/iphone-15-screen-sizes/) · [Use Your Loaf — iPhone 14](https://useyourloaf.com/blog/iphone-14-screen-sizes/) · [Use Your Loaf — iPhone 13](https://useyourloaf.com/blog/iphone-13-screen-sizes/)

iPad/Watch/TV/Mac rows above are logical resolutions from device spec aggregators; iPad safe-area figures specifically are the standard convention (24pt status bar / 20pt home-indicator strip for non-notch iPads) and were **not** independently confirmed against an Apple-published table this pass.

---

## 2. Apple chrome heights (points)

| Element | Height (pt) | Source / status |
|---|---|---|
| Status bar — no notch (SE) | 20 | Derived from safe-area data above |
| Status bar — notch (13 mini) | 50 | Derived from safe-area data above |
| Status bar — notch (14 base) | 47 | Derived from safe-area data above |
| Status bar — Dynamic Island (15/16/17 base, all Pro) | 54–62 (54 status-bar glyph row; 59–62 full safe-area top inset incl. island clearance) | [Use Your Loaf](https://useyourloaf.com/blog/iphone-15-screen-sizes/) |
| Navigation bar — standard (iPhone) | 44 | Long-standing `UINavigationBar` default; still the value shipped in Xcode templates |
| Navigation bar — standard (iPad, iOS 12+) | 50 | Changed from 44→50 in iOS 12 per [Apple Developer Forums #103659](https://developer.apple.com/forums/thread/103659) |
| Navigation bar — large title | ≈96 (44 bar + ≈52 large-title row) | Convention (unverified) — widely cited by iOS devs, not a single published Apple constant |
| Toolbar (iPhone) | 44 | Same construction as nav bar |
| Toolbar (iPad, iOS 12+) | 50 | Same forum source as above |
| Tab bar (iPhone, iOS ≤18 style) | 49 (+ bottom safe-area inset) | Long-standing `UITabBar` default height |
| Tab bar (iPad, legacy) | 50 (+ bottom safe-area inset) | Convention (unverified) |
| iOS 26 floating tab bar | Convention (unverified) — no published numeric height; visually a shorter capsule-shaped bar inset from the bottom edge, replacing the full-width 49pt bar | [Medium — "Don't Design Junk in the New iOS 26 Tab Bar"](https://medium.com/design-bootcamp/dont-design-junk-in-the-new-ios-26-tab-bar-4de8e842da89) |
| Search bar (`UISearchBar`) | ≈56 | Convention (unverified) |
| Table row — standard (`UITableView` default `rowHeight`) | 44 | [Apple Developer Docs — `UITableView.rowHeight`](https://developer.apple.com/documentation/uikit/uitableview/1614852-rowheight) |
| Table row — subtitle style (two-line) | ≈60 | Convention (unverified) |
| List section header (grouped style) | ≈32–40 | Convention (unverified) |
| Sheet detent — `.medium` | ≈50% of screen height (dynamic, not a fixed pt) | [Apple Developer Docs — `UISheetPresentationController.Detent`](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/detent) |
| Sheet detent — `.large` | Screen height minus top safe-area inset (dynamic) | Same doc |
| Keyboard height — Face ID iPhones, portrait QWERTY | ≈291 | Convention (unverified) — Apple does not publish this; varies by iOS version |
| Keyboard height — Home-button iPhones, portrait QWERTY | ≈216 | Convention (unverified); corroborated at pixel level by [The Apple Wiki — Dev:iOS Keyboard](https://theapplewiki.com/wiki/Dev:IOS_Keyboard) (216px portrait) |
| Keyboard height — iPad, floating | ≈264 | Convention (unverified) |
| Keyboard height — iPad, docked/split | ≈313–397 (varies by size) | Convention (unverified) |

**Layout margins — explicit note:** current Apple HIG text (`developer.apple.com/design/human-interface-guidelines/layout`) is prose-only and no longer publishes a numeric margin table (confirmed by attempting to fetch it this pass — it only speaks qualitatively about keeping margins suitable, with no pt values attached). The **16pt (compact width) / 20pt (regular width)** side-margin pair that most designers use is a convention carried over from Apple's Design Resources (Sketch/Figma) templates and default Xcode/SwiftUI safe-area/readable-content-guide behavior — it is **not** a number currently printed in the HIG prose itself.

---

## 3. Android device logical sizes (dp, portrait)

| Device | W×H (dp) | Width size class | Height size class | Density notes |
|---|---|---|---|---|
| Material compact reference | 360×800 | Compact (<600dp) | Medium (480–900dp) | Baseline reference used across Material spec examples |
| Pixel 8/9-class phone | ~412×915 (Pixel 9, confirmed) / ~412×917 (Pixel 8, convention) | Compact | Expanded (≥900dp) | ~420–422 ppi actual density (non-bucketed `DENSITY_DEVICE_STABLE`) |
| Pixel Fold — folded (cover screen) | ≈423×820 (computed) | Compact | Expanded | 1080×2092 px @ 408 ppi — convention (unverified): computed from px/density, not an official Google dp table |
| Pixel Fold — unfolded (inner screen) | ≈775×930 (computed, book/portrait orientation) | Medium/Expanded boundary | Expanded | 2208×1840 px @ 380 ppi — convention (unverified), same caveat |
| Pixel Tablet | ≈929×1486 (computed, portrait) | Expanded | Expanded | 2560×1600 px @ 276 ppi — convention (unverified), computed |
| Generic 7" tablet | 600×1024 | Medium | Expanded | Classic `sw600dp` Android reference bucket |
| Generic 10" tablet | 720×1280 (some sources use 800×1280) | Expanded | Expanded | Classic `sw720dp` Android reference bucket — convention (unverified this pass; long-standing, widely cited AOSP figure) |
| Wear OS round — small | 192–224 (diameter) | — | — | [Android Developers — Wear screen sizes](https://developer.android.com/design/ui/wear/guides/m2-5/foundations/screen-sizes) |
| Wear OS round — large | 225–240+ (diameter) | — | — | Same source; 225dp is Google's recommended small/large breakpoint |
| Android TV, 1080p | 960×540 | — | — | TV UI baseline is xhdpi (2x) on a 1920×1080px panel → 960×540dp; corroborated by [Ionic forum report of TV WebView resolution](https://forum.ionicframework.com/t/android-tv-webview-resolution-seems-to-be-1-2-hd-960x540-for-all-devices-hd-4k-8k/246839) — treat exact figure as convention (unverified against an official Google page this pass) |
| ChromeOS / freeform desktop window default | Convention (unverified) — no single published default; resizable windows commonly default in the ~800×600–1280×800dp range | — | — | — |

Window size class breakpoints (official, confirmed): **width** compact <600dp, medium 600–839dp, expanded 840–1199dp, large 1200–1599dp, extra-large ≥1600dp. **Height** compact <480dp, medium 480–899dp, expanded ≥900dp.
Source: [Android Developers — Window size classes](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes)

---

## 4. Android chrome heights (dp)

| Element | Height/width (dp) | Source / status |
|---|---|---|
| Status bar | 24 | Long-standing AOSP `status_bar_height` constant; widely and consistently documented, not re-confirmed against a single current Google page this pass |
| Gesture nav handle area (edge-to-edge, gesture nav) | ≈24 (bottom inset reserved for the gesture handle) | Convention (unverified) |
| 3-button nav bar | 48 | Long-standing AOSP `navigation_bar_height` constant; convention (unverified against a current single page this pass) |
| Top app bar — small | 64 — convention (unverified) | m3.material.io is JS-rendered and could not be fetched directly this pass; 64dp is the figure consistently cited by secondary M3 docs/tutorials |
| Top app bar — center-aligned | 64 — convention (unverified) | Same caveat |
| Top app bar — medium (flexible) | 112 — convention (unverified) | Same caveat |
| Top app bar — large (flexible) | 152 — convention (unverified) | Same caveat |
| Legacy `actionBarSize` (pre-M3 toolbar) | 56 | Long-standing Android default, widely documented |
| Bottom navigation bar | 80 (M3 default) / 64 (M3 Expressive) | [material-components-android — BottomNavigation.md](https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md) |
| Navigation rail width | 80 (default) / 96 (M3 Expressive) | [material-components-android — NavigationRail.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md) |
| Navigation drawer — modal (max width) | 280 (library default, `NavigationView.android:maxWidth`) / 360 commonly cited for the M3 spec itself — convention (unverified) | [material-components-android — NavigationDrawer.md](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationDrawer.md) |
| Navigation drawer — standard | 360 — convention (unverified) | Widely cited M3 figure; not independently confirmed against m3.material.io this pass |
| FAB — small | 40 | [material-components-android — FloatingActionButton.md](https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/FloatingActionButton.md) |
| FAB — standard | 56 | Same source |
| FAB — medium (M3) | 64 | Same source |
| FAB — large | 96 | Same source |
| FAB — extended (height) | 56 — convention (unverified) | Widely cited to match standard FAB height |
| List item — one-line | 56 — convention (unverified) | Long-standing M2/M3 figure repeated across secondary docs; primary m3.material.io table not directly fetchable this pass |
| List item — two-line | 72 — convention (unverified) | Same caveat |
| List item — three-line | 88 — convention (unverified) | Same caveat |
| Text field — filled, default | 56 — convention (unverified) | Same caveat |
| Text field — outlined, default | 56 — convention (unverified) | Same caveat |
| Snackbar — min width | 344 — convention (unverified) | Commonly cited M2/M3 figure |
| Snackbar — max width | 672 — (M2) / effectively unconstrained-ish on M3 per open bug reports — convention (unverified) | [flutter/flutter#150780](https://github.com/flutter/flutter/issues/150780), [issuetracker.google.com #229824412](https://issuetracker.google.com/issues/229824412) |
| Dialog — max width | 560 | [flutter/flutter#163709 — quotes M3 guideline directly](https://github.com/flutter/flutter/issues/163709) |
| Dialog — min width | 280 — convention (unverified) | Long-standing M2/M3 figure |
| Tab height | 48 — convention (unverified) | Widely cited M3 figure |
| Search bar (docked) height | 56 — convention (unverified) | Widely cited M3 figure |
| Chip height | 32 — convention (unverified) | Widely cited M3 figure (assist/filter/input/suggestion chips) |
| IME/keyboard height | No fixed convention — varies by device, language, and whether a suggestion strip is shown; treat as measure-at-runtime (`WindowInsets.ime`), not a static constant | — |

---

## 5. Cross-check row (Apple vs Android, at a glance)

| UI element | Apple (pt) | Android (dp) | Delta / note |
|---|---|---|---|
| Top bar (standard) | 44 (+ status bar 20–62 on top) | 64 small top app bar (+ status bar 24 on top) | Android's top app bar itself runs taller (64 vs 44); combined top chrome is comparable once status bars are added |
| Bottom nav / tab bar | 49 (+ home-indicator inset 0–34) | 80 (M3) / 64 (M3 Expressive) | Android's default bottom nav is noticeably taller than iOS's 49pt tab bar |
| Primary button height | 44–50 (HIG minimum tap target 44pt; common button height 44–50pt) | 40 (Material `Button` default) | Android's default filled button is shorter than iOS's typical 44–50pt, though both meet their platform's min target size once padding/tap area is counted |
| List row height | 44 (standard `UITableView` row) | 56 (one-line list item) — convention (unverified) | Android's baseline list row runs ~12dp/pt taller |
| Side margin | 16 (compact) / 20 (regular) — convention, not current HIG text | 16 (Material's standard body margin) — convention (unverified) | Both platforms converge on 16 at phone width; Apple grows to 20 at regular width, Material generally holds 16 or steps to 24 on larger breakpoints |
| Minimum touch target | 44×44 pt | 48×48 dp | Android's official minimum (48dp) is larger in absolute terms than Apple's (44pt), even before accounting for the dp/pt vs. px difference |

Sources for this row: same citations as sections 1–4 above; the touch-target minimums are the most solidly documented figures on this page — 44pt is stated throughout Apple's HIG components pages, 48dp is stated throughout Material's accessibility guidance.

---

## Verification gaps (things a follow-up pass should re-check with rendered-page access)

- All raw `m3.material.io/**/specs` numeric tables (top app bar, list, text field, snackbar, dialog min-width, tabs, chips, search) — the site is JS-rendered and a headless-render-capable fetch was not available this pass; every M3 number above sourced only from secondary docs is flagged "convention (unverified)".
- Exact current-iOS large-title nav bar height, subtitle table row height, and section header height — not published as single Apple constants; long-standing dev-community figures used.
- iOS 26 floating tab bar exact height/inset — Apple has not published a numeric spec as of this writing; only qualitative design commentary exists.
- Pixel Fold / Pixel Tablet dp figures — computed from published px + ppi rather than read off an official dp table; flagged accordingly.
- Android TV dp baseline, 3-button nav bar height, and status bar height — all long-standing, extremely widely repeated AOSP constants, but not re-confirmed against one current canonical Google page this pass.
