# Cross-Platform Reference: iOS / Android Divergence

Scope: what genuinely differs between Apple platforms (iOS/iPadOS) and Android
(Material 3), what to do about it in cross-platform frameworks, and where the
line between "share it" and "fork it" should fall.

Primary sources cited inline throughout. The Apple Human Interface Guidelines
(HIG) and m3.material.io are client-rendered; where a claim could be corroborated
from a server-rendered Apple or Google page (App Store Connect help,
developer.android.com, api.flutter.dev, reactnative.dev), that page is cited
instead or in addition.

---

## 1. Divergence table

Read this as: *the same user intent, expressed two different ways.* The column
"shared?" says whether a single implementation can serve both.

| Area | iOS / iPadOS | Android (Material 3) | Shared? |
|---|---|---|---|
| **Top-level navigation** | Tab bar pinned to the bottom, 2–5 tabs, icon + short label. Persistent; tapping the active tab pops that tab's stack to root and then scrolls to top. iPad: tab bar may render as a top tab bar or sidebar. | Navigation bar at the bottom for compact width; **navigation rail** at medium/expanded width; **navigation drawer** at large/extra-large. Breakpoints: compact `<600dp`, medium `600–839dp`, expanded `840–1199dp`, large `1200–1599dp`, extra-large `≥1600dp` ([Android window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes)) | IA yes, chrome no |
| **Secondary navigation** | Segmented control below the nav bar; sidebar on iPad | Tabs (primary/secondary) directly under the top app bar | No |
| **Back affordance** | Nav-bar back button, left-aligned, chevron + (often) previous screen's title. Plus **interactive edge-swipe from the left screen edge**. No hardware/system back. | **System back**: gesture (edge swipe from either edge) or the 3-button back key. Android 13+ adds **predictive back** — the swipe previews the destination before commit, with built-in back-to-home, cross-activity and cross-task animations ([predictive back](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back)). An in-app up arrow in the top app bar is *additional*, not a substitute. | No |
| **Back must be handled** | Provide the nav-bar back button; never suppress edge swipe on a pushed screen | Opt in to predictive back and honour `OnBackPressedCallback` / Compose `BackHandler` / `PredictiveBackHandler`; keep drag targets ~8dp clear of the gesture insets ([predictive back](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back)) | No |
| **Primary action placement** | Top-right of the navigation bar (e.g. "Add", "Done", `+`), or a prominent filled button in the content/toolbar. iOS has no FAB convention. | **FAB** (or extended FAB) bottom-right, above the navigation bar. One per screen. | No |
| **Destructive/confirm pair** | Cancel left, confirm right, in the nav bar or an alert; destructive action rendered red | Text buttons bottom-right of a dialog, dismiss then confirm; destructive uses the error color role | No |
| **Modal presentation** | **Sheet** sliding from the bottom with detents (medium/large), rounded top corners, grabber; dismiss by swipe-down. Full-screen cover for immersive flows. Popovers on iPad/regular width. | **Bottom sheet** (standard = persistent, modal = scrim + dismiss) with a drag handle, or a **dialog** for short decisions. Full-screen dialog for long forms on compact. | Concept yes, component no |
| **Alerts / short decisions** | `UIAlertController` / SwiftUI `.alert` — centered, title + message + 1–3 buttons. Action sheet (`.confirmationDialog`) for a list of choices from a control. | Material **dialog** — left-aligned title, supporting text, text buttons bottom-right. A bottom sheet replaces action sheets. | No |
| **Transient feedback** | No system toast. Use an inline banner, a status label, or a brief overlay you own. Toasts are *not* an iOS idiom. | **Snackbar** at the bottom, optionally with one action; native `Toast` for very short OS-level notices. | No |
| **Lists** | **Grouped / inset-grouped** tables: rounded section cards inset from the edges, section headers in caps or sentence case, separators inset to align with text, disclosure chevrons on the right for drill-in. | **Dividerless by default** — Material 3 lists rely on spacing, elevation/tonal surface and grouping rather than rules. Dividers only where grouping is otherwise ambiguous. No chevrons by default. | No |
| **Binary toggle** | **Switch** for immediately-applied settings. Checkboxes are essentially absent from iOS phone UI; multi-select lists use a trailing checkmark. | **Switch** for immediate settings; **Checkbox** for multi-select and for form/consent semantics; **Radio** for exclusive choice within a set. | No |
| **Date & time entry** | Inline/compact `DatePicker` — wheels, or the graphical calendar; commonly appears in a popover or inline row expansion. | Material **date picker** dialog (calendar grid, with a text-entry toggle) and **time picker** dialog (clock dial, with a text-entry toggle). | No |
| **Search placement** | Search bar attached below/inside the navigation bar (`.searchable`), often revealed on scroll; search may be its own tab. iOS 26 moves search toward the bottom on some surfaces. | **Search bar** floating near the top of content, expanding into a full-screen **search view**; or a search icon in the top app bar. | No |
| **Share** | **Share sheet** (`UIActivityViewController` / `ShareLink`) launched from the square-with-up-arrow icon | **Android Sharesheet** via `Intent.ACTION_SEND` + `Intent.createChooser()`, with `EXTRA_TEXT` / `EXTRA_STREAM` and a MIME `type`; custom actions via `EXTRA_CHOOSER_CUSTOM_ACTIONS` on Android 14+ ([sending simple data](https://developer.android.com/training/sharing/send)) | Intent yes, API no |
| **System typeface** | **SF Pro** (San Francisco) — Apple's license restricts it to Apple platforms, so it cannot be shipped as the Android face ([Flutter platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)) | **Roboto** (Material 3 also ships Roboto Flex / Google Sans variants) | No |
| **Type unit** | **pt** (points). 1pt = 1px @1x, 2px @2x, 3px @3x | **sp** for text, **dp** for everything else. Never size text in dp ([Android 14 non-linear font scaling](https://developer.android.com/about/versions/14/features#non-linear-font-scaling)) | No |
| **Type scale** | Dynamic Type text styles: `largeTitle, title1–3, headline, subheadline, body, callout, footnote, caption1–2` (+ `extraLargeTitle`, `extraLargeTitle2`) ([UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle)) | Material type scale: display/headline/title/body/label × large/medium/small | Roles yes, values no |
| **Icons** | **SF Symbols** — weight- and optical-size-matched to SF Pro, align to text baseline, scale with Dynamic Type. Apple-licensed; iOS-only. | **Material Symbols** — variable axes (weight, fill, grade, optical size), Apache-licensed | No |
| **Icon direction cues** | Back = thin chevron; overflow = **horizontal** ellipsis | Back = arrow with a stem/shaft; overflow = **vertical** ellipsis ([Flutter platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)) | No |
| **Haptics** | Rich, expected: `UIImpactFeedbackGenerator` (light/medium/heavy/soft/rigid), `UISelectionFeedbackGenerator` for picker/segment ticks, `UINotificationFeedbackGenerator` for success/warning/error. Used freely. | `HapticFeedbackConstants` / `View.performHapticFeedback`; hardware quality varies widely, so haptics are supportive rather than load-bearing. Flutter notes the divergence explicitly: Android buzzes on long-press word selection, iOS does not; iOS knocks on picker scroll, Android does not ([Flutter platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)) | Intent yes, curve no |
| **Settings for the app** | Two homes: in-app settings screen **plus** an OS Settings bundle under Settings › *App*. Permissions and notification prefs live in OS Settings. | In-app settings screen is canonical; the OS Settings app holds permissions and notification channels only. | No |
| **Permissions** | One-shot system alert per capability. **Deny is usually final** — re-asking requires deep-linking to Settings. Purpose strings (`NSCameraUsageDescription` et al.) are mandatory and user-visible. | Runtime permission dialog with Allow / Allow while using / Deny. `shouldShowRequestPermissionRationale()` lets you show a pre-prompt; repeated denial becomes "don't ask again". | Pre-prompt pattern yes |
| **App icon** | Single square source asset; the system applies the superellipse ("squircle") mask. iOS 18+ adds tinted/dark variants; iOS 26 adds layered/Liquid Glass icons. | **Adaptive icon**: separate foreground + background (+ monochrome for themed icons) layers, masked to the launcher's shape; the system may parallax the layers. | No |
| **Scroll physics** | Rubber-band **bounce** overscroll; lower static friction, gains speed gradually, decelerates less abruptly; fling momentum **stacks** across repeated flings; tapping the status bar scrolls to top ([Flutter platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)) | **Stretch/glow** overscroll indicator; higher static friction, reaches speed faster and stops more abruptly; no momentum stacking; no scroll-to-top-on-status-bar | No |
| **Scrollbars** | Minimal, appear during scroll and fade out | May remain visible; Material scrollbars are more present | No |
| **Text case** | **Sentence case** for buttons, labels, titles, and nav items. Section headers in grouped lists are the one historical all-caps exception, and modern iOS often uses sentence case there too. | **Sentence case** throughout since Material 2/3 (ALL CAPS buttons were a Material 1 idiom and are deprecated). | Mostly yes |
| **Text selection & cursor** | Tap places the cursor at the nearest **word edge**; long-press places the cursor (no selection); long-press-drag moves the cursor; iOS-style selection toolbar | Tap places the cursor at the tap point with a draggable handle; long-press **selects the word**; long-press-drag expands the selection; Android-style toolbar ([Flutter platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)) | No |
| **Page transitions** | Push slides **end-to-start** (RTL-aware) with the outgoing page parallaxing; `fullscreenDialog` presents bottom-up | `ZoomPageTransitionsBuilder` — the incoming UI zooms in, the outgoing zooms out (modeled on `startActivity()`) | No |
| **Empty states** | Centered glyph (SF Symbol) + title + one-line description + a single prominent button; `ContentUnavailableView` in SwiftUI | Centered illustration/icon + headline + supporting text + a filled or outlined button; Material empty-state patterns | Copy yes, chrome no |
| **Loading states** | Indeterminate spinner (`ProgressView` / `UIActivityIndicatorView`); skeletons and Redacted placeholders for content-shaped waits; **no** pull-to-refresh spinner in the Material style — use `.refreshable` (the iOS spinner unfurls from the top inset) | Circular/linear progress indicators; `RefreshIndicator` for pull-to-refresh (a floating circular badge); Material 3 adds wavy/contained progress variants | Skeleton strategy yes |

### Notes on the rows that bite hardest

**Back.** This is the #1 source of broken cross-platform apps. On Android the
system back must *always* do something sensible: if your JS/Dart router owns a
modal or a nested stack, you must wire it to the system back callback, or the
user gets thrown out of the app. On iOS the mirror failure is disabling the
left-edge interactive pop gesture (common when a custom gesture recognizer is
installed near the edge) — users lose the only ambient way back.

**Primary action.** Do not ship a FAB on iOS. It reads as a foreign object and it
collides with the home indicator and with iOS's own bottom chrome. Do not hide
Android's primary action in a top-right nav-bar text button only — it is far
from the thumb and Android users do not scan there first.

**Toasts.** `ToastAndroid` has no iOS counterpart. If you have a toast in your
design, decide now whether it is a snackbar on Android + an in-app banner on iOS,
or an in-app banner on both. The second option is legitimate and cheaper.

---

## 2. Unit conversion: pt vs dp vs CSS px

All three are **density-independent** units that resolve to different numbers of
physical pixels depending on the screen.

| Unit | Platform | Baseline | Conversion |
|---|---|---|---|
| **pt** (point) | iOS/iPadOS/macOS | 163ppi-ish reference; @1x = 1px | `px = pt × scale`, where scale is 1, 2 or 3 (`UIScreen.scale`). iPhone displays are @2x or @3x. |
| **dp** (dip) | Android | **160dpi = mdpi** is the baseline; 1dp ≈ 1px at 160dpi | `px = dp × (dpi / 160)`. Buckets: ldpi 120 (0.75×), mdpi 160 (1.0×), hdpi 240 (1.5×), xhdpi 320 (2.0×), xxhdpi 480 (3.0×), xxxhdpi 640 (4.0×) ([screen densities](https://developer.android.com/training/multiscreen/screendensities)) |
| **sp** | Android, text only | Same base as dp (1sp = 1dp at font scale 1.0) | Additionally multiplied by the user's font-scale preference. Android 14+ applies a **non-linear** curve, so `scaledDensity` is no longer a valid single scalar — use `TypedValue.applyDimension()` / `deriveDimension()` ([Android 14](https://developer.android.com/about/versions/14/features#non-linear-font-scaling)) |
| **CSS px** | Web / WCAG | 96dpi reference | `1 CSS px ≈ 1 dp ≈ 1 pt` for design purposes; the browser applies `devicePixelRatio` |

**Working equivalence for design:** `1pt ≈ 1dp ≈ 1 CSS px`. They are not
*identical* (the reference densities differ: 160dpi vs 96dpi), but on real
phones the rendered physical sizes land close enough that a shared spec in
abstract units is correct on both. Design your spacing scale in abstract units
(4/8-based) and let each platform resolve it.

**Never** use sp for layout dimensions, and never use dp/px for text sizes or
line height on Android. Mixing them breaks at high font scale: `4sp + 20sp` does
not reliably equal `24sp` under non-linear scaling, so don't compute padding
from sp values ([Android 14](https://developer.android.com/about/versions/14/features#non-linear-font-scaling)).

### Why 44pt vs 48dp — and what to use

- Apple: controls should be **at least 44×44 points** so a finger can hit them
  reliably. ([Apple UI Design Dos and Don'ts](https://developer.apple.com/design/tips/))
- Google: **"we recommend that each interactive UI element have a focusable
  area, or touch target size, of at least 48dp×48dp. Larger is even better."**
  ([Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps))
- WCAG 2.2 SC 2.5.8 (AA): **"The size of the target for pointer inputs is at
  least 24 by 24 CSS pixels"**, with spacing/inline/equivalent/user-agent/essential
  exceptions ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).
  WCAG 2.5.5 (AAA) raises it to 44×44 CSS px.

The 4-unit gap is not a measurement disagreement — it's two teams rounding the
same ~9mm fingertip contact patch to their own grid (Apple to a 44pt/11×4 value
inherited from the original iPhone, Google to a 48dp value that is 6 × its 8dp
grid). Neither number is "right".

**Rule for a shared design system: specify 48 and stop thinking about it.**
48 satisfies Apple (≥44), satisfies Google (=48), satisfies WCAG AA (≥24) and
clears WCAG AAA (≥44). It costs you 4 units of density on iOS, which is almost
never the constraint that matters. Where 48 genuinely won't fit (a dense table,
a text-inline control), keep the *visual* element small and expand the *hit
area* — `hitSlop` in React Native, `Modifier.minimumInteractiveComponentSize()`
or padding in Compose, `UIView` `pointInside`/larger transparent frame on iOS —
and check the WCAG spacing exception: undersized targets pass if a 24 CSS px
diameter circle centered on each does not intersect another target's circle
([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).

Spacing companion rule: **8dp/pt minimum between adjacent targets**, more if the
targets are near the minimum size.

---

## 3. Framework guidance

### 3.1 React Native

React Native gives you *mechanisms*, not adaptation. Almost nothing adapts for
free; you decide per component.

**Runtime branching** ([platform-specific code](https://reactnative.dev/docs/platform-specific-code)):

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios:     {backgroundColor: 'red'},
      android: {backgroundColor: 'green'},
      default: {backgroundColor: 'blue'},   // web, windows, macos
    }),
  },
});
```

`Platform.select` resolves keys in the order `ios`/`android` → `native` →
`default`. `Platform.OS` is `'ios' | 'android'`. `Platform.Version` is the
**Android API level** (a number) on Android and an **OS version string** on iOS
— parse it before comparing.

**File-extension branching** — the right tool when the divergence is structural
rather than a style value:

```
BigButton.ios.js
BigButton.android.js
// import BigButton from './BigButton';  ← no extension
```

`.native.js` splits React Native from web/Node builds (Metro picks `.native.js`,
webpack/Rollup picks the bare `.js`).

**What is already adaptive in RN core:**

| Component | Behavior |
|---|---|
| `ActivityIndicator` | Renders the platform spinner |
| `Switch` | Renders `UISwitch` / Material switch, including platform track/thumb colors |
| `Alert.alert()` | Maps to `UIAlertController` / `AlertDialog` |
| `RefreshControl` | Platform pull-to-refresh affordance |
| `StatusBar`, `Modal`, `TextInput` | Platform-native under the hood |
| `Pressable` | Adaptive only if you opt in — pass `android_ripple` for Material ripple |

**What is explicitly not adaptive** and needs a branch or a library:

- Navigation chrome. `@react-navigation/native-stack` wraps
  `UINavigationController` / Android's fragment transitions and gets you native
  push transitions, the iOS edge-swipe pop, and Android predictive back
  (with `react-native-screens` ≥ recent versions). The JS-only `stack` navigator
  does not. Prefer native-stack.
- Bottom-sheet vs sheet — use a sheet library and configure detents per platform.
- `ActionSheetIOS` is iOS-only; `ToastAndroid` is Android-only. Both need an
  explicit counterpart.
- Date/time — `@react-native-community/datetimepicker` renders each platform's
  native picker but with different props and different presentation (inline vs
  dialog); branch the wrapper.
- Fonts. Set `fontFamily: Platform.select({ios: 'SF Pro Text', android: 'Roboto'})`
  or ship one brand face on both and accept the loss of system-face familiarity.
- Icons. Two icon sets, one mapping layer. Build a `<Icon name="share">` that
  resolves to `square.and.arrow.up` / `share`.
- Shadows. `shadowColor/Offset/Opacity/Radius` are iOS; `elevation` is Android.
  Set both.

**Scroll physics** largely come free because RN uses the real
`UIScrollView`/`RecyclerView`. Don't override `decelerationRate` globally.

### 3.2 Flutter

Flutter ships two complete design languages, `material` and `cupertino`, and a
narrow adaptive layer between them.

**Free adaptations** — these happen with plain Material widgets on iOS
([platform adaptations](https://docs.flutter.dev/platform-integration/platform-adaptations)):

- Page transitions (end-to-start push on iOS with parallax; zoom on Android),
  edge-swipe pop on iOS, system back pop on Android
- Scroll physics: `BouncingScrollPhysics` + momentum stacking + status-bar
  scroll-to-top on iOS; `GlowingOverscrollIndicator` on Android
- Text editing: selection toolbars, tap/long-press/drag semantics, keyboard
  cursor gestures, and the associated haptics
- Iconography: overflow dots orientation and the back chevron/arrow;
  `Icons.adaptive` for the rest
- Typography default (San Francisco vs Roboto), with an automatic fallback face
  on Android since SF cannot be redistributed there

**`.adaptive()` constructors** — Material widget → Cupertino widget on iOS/macOS:

| Material | Cupertino | Constructor |
|---|---|---|
| `Switch` | `CupertinoSwitch` | `Switch.adaptive()` |
| `Slider` | `CupertinoSlider` | `Slider.adaptive()` |
| `CircularProgressIndicator` | `CupertinoActivityIndicator` | `CircularProgressIndicator.adaptive()` |
| `RefreshIndicator` | `CupertinoActivityIndicator` | `RefreshIndicator.adaptive()` |
| `Checkbox` | `CupertinoCheckbox` | `Checkbox.adaptive()` |
| `Radio` | `CupertinoRadio` | `Radio.adaptive()` |
| `AlertDialog` | `CupertinoAlertDialog` | `AlertDialog.adaptive()` |

`Switch.adaptive` renders Cupertino when `ThemeData.platform` is iOS or macOS
and Material elsewhere ([Switch.adaptive](https://api.flutter.dev/flutter/material/Switch/Switch.adaptive.html)).

**`ThemeData.adaptations`** takes a list of `Adaptation<T>` objects. Subclass
`Adaptation<SwitchThemeData>` and override `adapt(ThemeData theme, T defaultValue)`
to return a platform-specific component theme *without* disturbing
`ThemeData.switchTheme` for the Material path
([Adaptation](https://api.flutter.dev/flutter/material/Adaptation-class.html)).
Note the surface area is small — currently only `Switch.adaptive` consumes it.
There is no `ThemeData.adaptive()` factory; what exists is
`ThemeData.platform`, `ThemeData.adaptations`, and `ThemeData.cupertinoOverrideTheme`.

**What you must branch by hand:**

```dart
Scaffold(
  bottomNavigationBar: Platform.isIOS
      ? CupertinoTabBar(currentIndex: i, onTap: onTap, items: items)
      : NavigationBar(selectedIndex: i, onDestinationSelected: onTap,
                      destinations: destinations),
)
```

Same story for app bars (`AppBar` vs `CupertinoNavigationBar` —
`toolbarHeight: 44` and transparent surface tint get you most of the way,
per Flutter's own snippet), bottom sheets vs `showCupertinoModalPopup`, date
pickers, and search.

Prefer `Theme.of(context).platform` over `dart:io`'s `Platform.isIOS` — it is
overridable in tests and in widget previews, and it works on web.

### 3.3 Web / PWA — short note

A PWA is a third platform, not "both of the above".

- There is no system back button and no reliable system back gesture. Provide an
  in-app back control and keep the URL/history stack honest so the browser's own
  back works.
- Safari on iOS gives you edge-swipe *history* navigation, which will fight any
  horizontal-swipe UI near the edges.
- Use **CSS px**, not pt/dp. `1 CSS px` is the practical equivalent of 1dp/1pt;
  `devicePixelRatio` handles the rest.
- `env(safe-area-inset-*)` with `viewport-fit=cover` is mandatory for notch and
  home-indicator clearance.
- `overscroll-behavior: contain` stops rubber-banding the page behind a sheet.
- Respect `prefers-reduced-motion`, `prefers-color-scheme` and
  `prefers-contrast` — these are the web's equivalents of the platform
  accessibility switches.
- Don't imitate either native chrome closely. A half-convincing iOS tab bar in a
  browser is worse than an honest web layout, because it promises native
  gestures the browser cannot deliver.
- Don't fight platform scroll physics with JS "smooth scroll" libraries; they
  break momentum, accessibility and back/forward restoration.

---

## 4. Decision rule: what stays identical, what must diverge

The test is **"does the user's mental model live in the app, or in the OS?"**
If the OS taught it, follow the OS. If your product taught it, keep it identical.

### Stays identical across platforms

| Thing | Why |
|---|---|
| **Information architecture** — the set of top-level areas, their names, what nests under what | Learned once, carried across devices. A user with an iPhone and an Android tablet should find the same five things in the same conceptual places, even though one has a tab bar and the other a rail. |
| **Content and data** — every field, every record, every state | Parity failures here are bugs, not adaptations. |
| **Copy** — labels, error text, empty-state text, onboarding wording | Diverging copy doubles your localization cost and your support surface for no user benefit. Exception: names of platform affordances ("tap Share" vs "tap the share icon"). |
| **Brand color, logo, brand illustration** | Brand is yours. Note Android's *Material You* dynamic color is opt-in — you are not obliged to surrender brand color to the wallpaper palette. |
| **Core interaction semantics** — what a swipe-to-delete deletes, what a long-press reveals, what's undoable | |
| **Feature availability and ordering in flows** | Same steps, same order, same number of taps where the platform allows. |
| **Accessibility contract** — every control labeled, every flow completable with the screen reader | See `accessibility.md`. |

### Must diverge

| Thing | Why |
|---|---|
| **Navigation chrome** — tab bar vs navigation bar/rail/drawer; nav-bar back vs system back; up arrow semantics | These are OS-taught. Getting them wrong makes the app feel broken, not merely foreign. Android's system back in particular *must* work. |
| **Controls** — switch/checkbox choice, pickers, sliders, text-selection handles, search affordance | Users recognize their platform's control and know its states and gestures; a hand-rolled cross-platform control re-teaches both audiences at once. |
| **Typography** — face, scale, and units (pt vs sp/dp) | SF is unlicensable off Apple platforms; type scales are calibrated to their own faces' metrics. Map *roles* (title/body/caption), not sizes. |
| **Iconography** — SF Symbols vs Material Symbols | Licensing plus optical matching to the system face. Map by meaning. |
| **Motion** — transitions, durations, easing, scroll physics, overscroll | Bounce vs stretch, slide vs zoom. These are rendered by the platform scroll views anyway; fighting them costs performance and feels uncanny. |
| **System-integration surfaces** — share sheet, permissions, settings location, app icon format, notifications, widgets | These are literally the OS's UI. You supply data; the OS supplies presentation. |
| **Transient feedback** — snackbar vs in-app banner | |
| **Layout density and breakpoints** | Android must handle rail/drawer at ≥600dp and ≥1200dp ([window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes)); iPad has its own size classes and sidebar conventions. |

### The gray zone, resolved

Where a choice is *not* OS-taught — card layout, list row composition, color
usage beyond brand, chart style, illustration, spacing rhythm, elevation
language — **keep it identical**. That's where your design system earns its
keep, and it's also where divergence costs the most per unit of user benefit.

A useful budget: expect roughly **80–90% shared** (IA, content, copy, brand,
layout, business logic) and **10–20% forked** (navigation chrome, controls,
type, icons, motion, system integration). If you are forking more than that,
you are re-litigating settled questions; if you are forking less, you have
almost certainly shipped a FAB on iOS or broken Android's back button.

---

## Sources

- Apple Human Interface Guidelines — Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple UI Design Dos and Don'ts (44pt target, 11pt minimum text): https://developer.apple.com/design/tips/
- Apple, `UIFont.TextStyle` (Dynamic Type styles): https://developer.apple.com/documentation/uikit/uifont/textstyle
- Android, Make apps more accessible (48dp targets, 4.5:1 / 3:1): https://developer.android.com/guide/topics/ui/accessibility/apps
- Android, Support different pixel densities (dp, 160dpi, buckets): https://developer.android.com/training/multiscreen/screendensities
- Android 14 features — non-linear font scaling (200%, `TypedValue`): https://developer.android.com/about/versions/14/features#non-linear-font-scaling
- Android, Use window size classes (600/840/1200/1600dp): https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- Android, Predictive back design guidance: https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back
- Android, Send simple data to other apps (Sharesheet): https://developer.android.com/training/sharing/send
- Material 3, Accessible design: https://m3.material.io/foundations/accessible-design
- W3C, Understanding SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C, WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- React Native, Platform-specific code: https://reactnative.dev/docs/platform-specific-code
- Flutter, Automatic platform adaptations: https://docs.flutter.dev/platform-integration/platform-adaptations
- Flutter, `Switch.adaptive`: https://api.flutter.dev/flutter/material/Switch/Switch.adaptive.html
- Flutter, `Adaptation` class: https://api.flutter.dev/flutter/material/Adaptation-class.html
