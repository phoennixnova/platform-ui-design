# Accessibility Reference: iOS + Android

Scope: the WCAG 2.2 AA criteria that actually apply to native apps, the
Apple-specific and Android-specific obligations layered on top, and a checklist
you can run against a single screen. Sources cited inline; where the Apple HIG
page is client-rendered, the corroborating server-rendered Apple page (App Store
Connect evaluation criteria, or the API reference) is cited alongside it.

---

## Part 1 — WCAG 2.2 Level AA essentials for apps

WCAG is written for the web, but the App Store, Google Play, the European
Accessibility Act, Section 508 and EN 301 549 all reference it, and both
platform teams calibrate to it. Treat AA as the floor.
Full list: [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).

### Contrast

**1.4.3 Contrast (Minimum) — AA.** *"The visual presentation of text and images
of text has a contrast ratio of at least 4.5:1"*, except **large text** — ≥18pt
or ≥14pt bold (24px / 18.66px bold in CSS) — which needs only **3:1**; plus
**incidental** content (inactive controls, decoration, invisible text) and
**logotypes**.

**1.4.11 Non-text Contrast — AA.** *"contrast ratio of at least 3:1 against
adjacent color(s)"* for **UI components** — the parts you need to see to
identify the control and its state (an unchecked checkbox's border, a toggle's
track, a field boundary, a focus ring) — and for **graphical objects** required
to understand the content (chart series, meaningful icons).

Both platforms restate these numbers. Apple: *"a minimum contrast ratio of 4.5
to 1 between foreground text and its background"* and *"Meeting a 3:1 minimum
contrast ratio is commonly recommended for non-text contrast"*
([Sufficient Contrast criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/sufficient-contrast-evaluation-criteria)).
Android: 4.5:1 for text, 3:1 for surfaces vs non-text elements
([Android foundations](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility)).

Consequences: **placeholder text is text** (4.5:1 or it fails); **disabled
controls are exempt**, but if "disabled" is the *only* signal you have a 1.4.1
problem instead; contrast is measured against **what is actually behind it**, so
glass/blur, images and gradients must be tested at their worst pixel; ratios are
computed on **sRGB relative luminance** — don't eyeball.

**1.4.12 Text Spacing — AA.** No loss of content at line height 1.5×, paragraph
spacing 2×, letter spacing 0.12×, word spacing 0.16× of font size. In apps:
don't pin text into fixed-height boxes.

### Target size

**2.5.8 Target Size (Minimum) — AA.** *"The size of the target for pointer
inputs is at least 24 by 24 CSS pixels"*, with five exceptions
([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)):
**spacing** — *"Undersized targets… are positioned so that if a 24 CSS pixel
diameter circle is centered on the bounding box of each, the circles do not
intersect another target or the circle for another undersized target"*;
**equivalent** (the same function exists elsewhere on the screen at full size);
**inline** (the target sits in a sentence or is constrained by surrounding
line-height); **user agent control** (the platform sets the size and you haven't
changed it); and **essential**. **2.5.5 (AAA)** raises the bar to 44×44 CSS px.

The platform rules are stricter and they win. Apple: *"at least 44 points x 44
points"* ([UI Design Dos and Don'ts](https://developer.apple.com/design/tips/)).
Android/Material: *"at least 48dp×48dp. Larger is even better."*
([Android](https://developer.android.com/guide/topics/ui/accessibility/apps)).
Flutter's release checklist: *"All tappable targets should be at least 48x48
pixels."* ([Flutter](https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility)).

Ship **48** and you clear all four. Keep ≥8dp/pt between adjacent targets. When
the visual element must be small, grow the **hit area**, not the glyph:
`hitSlop` (React Native), `Modifier.minimumInteractiveComponentSize()` or
padding (Compose), a larger transparent frame or `point(inside:)` (UIKit).

### Focus

**2.4.7 Focus Visible — AA.** *"A keyboard operable user interface component has
a mode of operation where the keyboard focus indicator is visible."* In apps this
covers hardware-keyboard navigation (iPadOS/macOS Full Keyboard Access, Android
keyboard/D-pad), Switch Control and Switch Access. Custom controls frequently
render no focus ring at all — a straight fail.

**2.4.11 Focus Not Obscured (Minimum) — AA.** *"When a user interface component
receives keyboard focus, the component is not entirely hidden due to
author-created content."*
([Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html))
The app analogue of sticky headers and cookie banners: sticky bottom CTA bars,
mini-player bars, snackbars, and the **software keyboard** pushing a focused
field under a floating toolbar. Fix with content insets equal to the overlay
height, or scroll the focused element into a safe region. **2.4.13 Focus
Appearance (AAA)** is the styling target: ≥2px perimeter, 3:1 against both states.

### Motor / pointer

**2.5.7 Dragging Movements — AA.** Anything operable by dragging must also work
*"through a single pointer activation without dragging"*, unless dragging is
essential. This kills: reorderable lists with **only** a drag handle (add "Move
up"/"Move down" actions or a context menu); sliders with **only** a drag thumb
(add increment/decrement or tap-on-track); swipe-to-delete as the **only** path
(add a long-press menu or a custom action). Signature/canvas/map-pan is usually
"essential" — but the surrounding zoom and recenter controls must not be drag-only.

**2.1.1 Keyboard — A.** All functionality operable via keyboard; on mobile this
generalizes to Switch Control/Switch Access and Voice Control.
**2.5.1 Pointer Gestures — A.** Multipoint or path-based gestures (pinch,
two-finger rotate, swipe-path) need a single-pointer alternative unless essential.

### Cognitive / forms

**3.2.6 Consistent Help — A.** A help mechanism appearing on multiple screens
must appear *"in the same relative order"* relative to other content — not under
the overflow menu on one screen and in the tab bar on another.

**3.3.7 Redundant Entry — A.** Information previously entered by or provided to
the user is auto-populated or offered for selection, unless re-entry is
essential (confirming a password) or security-sensitive.

**3.3.8 Accessible Authentication (Minimum) — A.** A cognitive function test
(remembering a password, transcribing a code, solving a puzzle) cannot be the
*only* way to authenticate. Support password managers (don't block paste; set
`textContentType` / `autofillHints`), biometrics, or an email-link path.

Also at A/AA and easy to miss: **1.4.1 Use of Color**; **1.3.1 Info and
Relationships** (headings, lists, groups programmatically determined); **3.3.1 /
3.3.3 Error Identification & Suggestion**; **2.2.1 Timing Adjustable**
(auto-dismissing snackbars, OTP timers, session timeouts); **2.3.1 Three Flashes**.

---

## Part 2 — Apple platforms

### 2.1 Dynamic Type

Apple's App Store accessibility criteria require text to enlarge up to 200% of
its default size, or to the system's own maximum size if that's smaller; they
also point out that iOS Dynamic Type already clears 200% by the AX3 accessibility
size, with body text past 300% by AX5
([Larger Text criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria)).

`DynamicTypeSize` has twelve cases — `xSmall, small, medium, large` (default)`,
xLarge, xxLarge, xxxLarge`, then `accessibility1…accessibility5`, with
`isAccessibilitySize` true for the last five
([ref](https://developer.apple.com/documentation/swiftui/dynamictypesize)).
Body is 17pt at `.large` and 53pt at `.accessibility5` — about 3.1×; larger
styles grow proportionally less at the top of the range. Build against text
styles, never hardcoded sizes: `largeTitle, title1, title2, title3, headline,
subheadline, body, callout, footnote, caption1, caption2` (plus
`extraLargeTitle`, `extraLargeTitle2`)
([UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle)).

In practice:

- Use `Font.body` / `UIFont.preferredFont(forTextStyle:)`. For a custom face,
  `UIFontMetrics(forTextStyle:).scaledFont(for:)` or `.custom(_:relativeTo:)`.
- **Never truncate as the primary response.** Apple's guidance is to let text
  wrap across two or more lines rather than cut it off. `numberOfLines = 0` /
  `.lineLimit(nil)`.
- **Reflow at accessibility sizes.** Label+control rows become vertical stacks.
  SwiftUI: `@Environment(\.dynamicTypeSize)` → `.isAccessibilitySize`, or
  `ViewThatFits`. UIKit: switch `UIStackView.axis` on
  `traitCollection.preferredContentSizeCategory.isAccessibilityCategory`.
- **Scale the box, not just the glyph** — buttons, rows, adjacent icons
  (`Image(systemName:)` scales; raster assets don't). Cap only where genuinely
  necessary (a dense chart axis), never on body content.
- A custom in-app text-size control is permitted only if it mirrors what the
  system setting does, or gives at least as fine-grained control, and detects
  the system setting. Test at **small, medium, large, and extra
  large accessibility sizes** — Apple names all four.

### 2.2 VoiceOver

Apple's criteria for claiming VoiceOver support
([VoiceOver criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)):

**Labels.** Every control needs a short, correct text equivalent that stands on
its own **out of context** — no "Click here" or "Learn more". Do **not** put the
control type or state in the label itself (redundant doubling like "checkbox
checkbox"); that's what traits are for. Destructive actions must name exactly
what's being destroyed, e.g. "Delete item 3", not just "Delete".
Form fields separate label ("phone number") from value ("555-555-1212").
Decorative images are hidden; meaningful ones get descriptions; user-generated
media gets a way for the author to add one. Charts use
`accessibilityChartDescriptor` or a text alternative.

**Hints** say *what happens*, not what the thing is ("Double tap to open in
Safari"). Users can turn them off, so never put required information in a hint.

**Traits** carry type and state via `AccessibilityTraits` /
`UIAccessibilityTraits`: `.isButton`, `.isHeader`, `.isSelected`, `.isLink`,
`.isImage`, `.isSearchField`, `.isToggle`, `.isModal`, `.updatesFrequently`,
`.playsSound`. VoiceOver strings these together into one spoken line, e.g. a
checked toggle for emails reads out its label, its checked state, and the fact
that it's a checkbox. **Values** (`accessibilityValue`) carry anything that
changes: slider position, progress, stepper count.

**Navigation & focus order.** Users must reach **every** visible element by
swipe-right and leave it by swipe-left — nothing skipped, and no loop that
strands them cycling through the same elements. Test forward, backward, and rotor navigation in both directions. A
list row with several affordances is either individually traversable or a single
element with **custom actions** (reply / forward / delete) on the rotor; add
custom rotors (`accessibilityRotor`) for repeated categories.

**Announcements.** Status banners and alerts use `AccessibilityNotification` (or
`UIAccessibility.post(notification:argument:)` with `.announcement` /
`.screenChanged` / `.layoutChanged`) so they're spoken without hijacking focus.

### 2.3 SwiftUI accessibility modifiers

Full set: [Accessibility modifiers](https://developer.apple.com/documentation/swiftui/view-accessibility).

| Modifier | Use |
|---|---|
| `.accessibilityLabel(_:)` | The name. `.accessibilityInputLabels(_:)` adds Voice Control alternates |
| `.accessibilityValue(_:)` | Current value as text |
| `.accessibilityHint(_:)` | What happens on activation |
| `.accessibilityAddTraits(_:)` / `.accessibilityRemoveTraits(_:)` | Type and state |
| `.accessibilityElement(children:)` | `.combine` merges descendants into one element; `.contain` makes a container; `.ignore` drops them |
| `.accessibilityChildren(children:)` | Synthetic children for custom-drawn views and charts |
| `.accessibilityHidden(_:)` | Remove decoration from the tree |
| `.accessibilitySortPriority(_:)` | Reorder siblings (higher = earlier) |
| `.accessibilityAction(named:_:)` / `.accessibilityActions(_:)` | Rotor custom actions |
| `.accessibilityAdjustableAction(_:)` | Increment/decrement for custom sliders and steppers |
| `.accessibilityRepresentation(representation:)` | "This custom thing is really a `Slider`" |
| `.accessibilityRespondsToUserInteraction(_:)` | Whether Switch Control / Voice Control / **Full Keyboard Access** stops here |
| `.accessibilityFocused(_:)` / `.accessibilityDefaultFocus(_:_:)` | Move or seed AT focus |

Also: `.accessibilityHeading(_:)` (`.h1`…`.h6`), `.accessibilityRotor(_:entries:)`,
`.accessibilityIgnoresInvertColors(_:)`, `.accessibilityScrollAction` /
`.accessibilityZoomAction`, `.accessibilityDragPoint` / `.accessibilityDropPoint`,
`.accessibilityShowsLargeContentViewer()`, `.accessibilityTextContentType(_:)`,
the `speech*` family, and `.accessibilityIdentifier(_:)` — a **UI-test hook
only**, never user-facing. UIKit equivalents: `accessibilityLabel`,
`accessibilityValue`, `accessibilityHint`, `accessibilityTraits`,
`isAccessibilityElement`, `accessibilityElements`,
`accessibilityCustomActions`, `accessibilityViewIsModal`,
`accessibilityElementsHidden`, `accessibilityActivate()`.

### 2.4 System accessibility settings to honor

All on [`UIAccessibility`](https://developer.apple.com/documentation/uikit/uiaccessibility),
each with a matching `…StatusDidChangeNotification`; SwiftUI mirrors them as
`@Environment(\.accessibilityReduceMotion)` and friends.

| Setting | API | What you must do |
|---|---|---|
| **Reduce Motion** | `isReduceMotionEnabled` | Disable parallax, animated blur, depth-of-field, multi-axis/multi-speed motion, spinning and vortex effects, and auto-advancing carousels. Apple's rule: decorative → remove; meaningful → replace with a dissolve, highlight fade or color shift; status change → keep but use a motion-safe alternative ([Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)) |
| **Prefer Cross-Fade Transitions** | `prefersCrossFadeTransitions` | Replace slide/push transitions with cross-fades |
| **Reduce Transparency** | `isReduceTransparencyEnabled` | Replace blur/vibrancy materials with opaque fills — critical now that Liquid Glass puts translucency everywhere |
| **Increase Contrast** | `isDarkerSystemColorsEnabled` | Use higher-contrast color variants; asset catalogs have a "High Contrast" appearance, use it rather than branching by hand |
| **Bold Text** | `isBoldTextEnabled` | System fonts handle it; custom faces must switch to a heavier weight, and layouts must survive the extra width |
| **Differentiate Without Color** | `shouldDifferentiateWithoutColor` | Add shapes, glyphs, text or patterns wherever color alone carried meaning |
| **Button Shapes** | `buttonShapesEnabled` | Add visible backgrounds/underlines to text-only buttons |
| **On/Off Labels** | `isOnOffSwitchLabelsEnabled` | System switches add I/O glyphs; custom switches must too |
| **Invert Colors** | `isInvertColorsEnabled` | Exempt photos/video with `accessibilityIgnoresInvertColors` |

Also honor `isGrayscaleEnabled`, `isVideoAutoplayEnabled`,
`isClosedCaptioningEnabled`, `isMonoAudioEnabled` and `isShakeToUndoEnabled`.
Apple's contrast testing instruction: **turn Bold Text, Increase Contrast and
Reduce Transparency all on before testing**, in light and dark, and test
Increase Contrast on with Reduce Transparency both off and on.

### 2.5 Assistive technologies beyond VoiceOver

| Technology | Flag | What it requires of you |
|---|---|---|
| **VoiceOver** | `isVoiceOverRunning` | Labels, traits, values, order, custom actions, rotors |
| **Switch Control** | `isSwitchControlRunning` | Everything reachable by sequential scanning; visible focus; no drag-only interactions; `accessibilityRespondsToUserInteraction` set correctly on custom views |
| **Voice Control** | — | Every control needs a **speakable** label; icon-only buttons with no label are unusable. `accessibilityInputLabels` supplies synonyms ("Send", "Submit", "Go") |
| **AssistiveTouch** | `isAssistiveTouchRunning` | Gesture alternatives; no required multi-finger or force gestures |
| **Full Keyboard Access** (iPadOS 13.4+, macOS) | — | Tab reaches every control; **visible focus ring**; Space/Return activates; Escape dismisses. `accessibilityRespondsToUserInteraction(true)`, `.focusable()` / `FocusState` |
| **Zoom / Hover Text** | — | Don't register conflicting gestures (`registerGestureConflictWithZoom()`). Apple says these **do not count** as your Larger Text support |
| **Guided / Assistive Access** | `isGuidedAccessEnabled` | Degrade gracefully in single-app mode; `assistiveAccessNavigationIcon(_:)` for the iOS 17+ shell |

---

## Part 3 — Android

### 3.1 TalkBack and the semantics model

TalkBack reads a tree built from **semantics**, not the view hierarchy directly
— and in Compose there are two trees: the **merged** tree (what tests read by
default) and the **unmerged** tree (what accessibility services read)
([Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics)).

**Views** use `android:contentDescription`, `android:labelFor`,
`android:importantForAccessibility`, `android:accessibilityHeading`,
`android:accessibilityLiveRegion`, `android:screenReaderFocusable` and
`ViewCompat.setAccessibilityDelegate`. **Compose** routes everything through
`Modifier.semantics { }` (or `Modifier.semantics(mergeDescendants = true) { }`).

Android's own guidance: *"You do not need to provide a `contentDescription` for
`Text` composables"* — TalkBack announces the text itself — and *"Avoid
redundancies"*: say `"Submit"`, not `"Submit button"`, because `Role` already
carries the type ([Android](https://developer.android.com/guide/topics/ui/accessibility/apps)).

### 3.2 The semantics properties that matter

From [Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics)
and [accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles):

| Property | Use |
|---|---|
| `contentDescription` | Name for icons/images. `null` on decorative icons; `hideFromAccessibility()` (formerly `invisibleToUser()`) for other decoration |
| `stateDescription` | Replaces the default state label: `if (selected) "Subscribed" else "Not subscribed"` |
| `role` | `Role.Button`, `Role.Switch`, `Role.Checkbox`, `Role.RadioButton`, `Role.Tab`, `Role.Image`, `Role.DropdownList` |
| `heading()` | Marks a heading so TalkBack's heading navigation works |
| `paneTitle` | Names a window-like region — modal, bottom sheet, detail pane (API 28+). Must be unique |
| `error("…")` | Marks a field errored, with an expanded message |
| `liveRegion` | `LiveRegionMode.Polite` for ordinary updates; `Assertive` only for time-sensitive content |
| `collectionInfo` / `collectionItemInfo` | Row/column counts and positions, so TalkBack can say "item 3 of 40" |
| `progressBarRangeInfo` | `ProgressBarRangeInfo(current, range, steps)` for custom progress and sliders |
| `customActions` | `CustomAccessibilityAction(label, action)` — the alternative to drag/swipe gestures, and how you satisfy WCAG 2.5.7 |
| `onClick(label) { }` | Gives the activation action a descriptive label |
| `traversalIndex` / `isTraversalGroup` | Control reading order; group a region so TalkBack finishes it before moving on |

**`mergeDescendants = true`** collapses a subtree into one focusable node — use
it on card and list-row containers so TalkBack reads the row as one utterance
rather than five stops, and put the clickable modifier on the **parent**.

**`clearAndSetSemantics { }`** wipes a subtree's semantics and substitutes what
you specify (or nothing). The canonical use is a row that has moved its
affordances up to the parent as `customActions`:

```kotlin
ArticleRow(modifier = Modifier.semantics { customActions = listOf(
        CustomAccessibilityAction("Open article")     { openArticle(); true },
        CustomAccessibilityAction("Add to bookmarks") { bookmark(); true }) }) {
    Article(modifier = Modifier.clearAndSetSemantics { }, onClick = openArticle)
    BookmarkButton(modifier = Modifier.clearAndSetSemantics { }, onClick = bookmark)
}
```

Rule of thumb: **`mergeDescendants`** when the children's text should still be
read (just as one node); **`clearAndSetSemantics`** when it should not.

### 3.3 Targets, contrast, and text

**Touch targets: 48dp × 48dp minimum.** *"For touch interfaces, we recommend
that each interactive UI element have a focusable area, or touch target size, of
at least 48dp×48dp. Larger is even better."* Material components (`Button`,
`IconButton`, `ListItem`) already enforce it; custom composables need
`Modifier.minimumInteractiveComponentSize()` or explicit sizing
([Android](https://developer.android.com/guide/topics/ui/accessibility/apps)).
Keep 8dp between targets.

**Contrast:** 4.5:1 for text under 18sp (or bold under 14sp), 3:1 for larger
text and for surfaces vs non-text elements. **Minimum body size: 12sp** —
*"Don't make body text smaller than 12 sp, aligning with Material typescale
defaults"*
([design foundations](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility)).

**sp vs dp — the hard rule.** **sp for every text size and every `lineHeight`**
(line height in dp means the text grows but its leading doesn't, and it
collides); **dp for everything else**. Never size text in dp to stop it breaking
the layout; fix the layout.

**Font scale to 200%** on Android 14+, applied **non-linearly** so large text
scales less than small text and hierarchy survives
([Android 14](https://developer.android.com/about/versions/14/features#non-linear-font-scaling)):
*"the `scaledDensity` field is no longer accurate. The `fontScale` field should
be used for informational purposes only because fonts are no longer scaled with
a single scalar value."* Convert with `TypedValue.applyDimension()` (sp → px)
and `deriveDimension()` (px → sp) — never hardcode `size * fontScale` — and
don't compute padding from sp arithmetic: *"4sp + 20sp might not equal 24sp"*.
Test at max font size, and test **Display size** (which scales `dp`, the whole
layout) separately — many layouts survive one and not the other.

### 3.4 Services, headings, live regions, focus order

| Service | What it requires |
|---|---|
| **TalkBack** | Labels, roles, states, order, headings, live regions, custom actions |
| **Switch Access** | Every workflow completable by sequential highlight + select; *only actionable items* highlighted (stray focusable containers are a real failure mode); text input works; gesture-only interactions have selectable alternatives ([testing](https://developer.android.com/guide/topics/ui/accessibility/testing)) |
| **Voice Access** | Every control needs a speakable label; numbered overlays map to labeled nodes |
| **Magnification / Select to Speak / Live Caption / color correction** | Don't break on zoom or intercept the triple-tap; keep semantics correct; ship caption tracks; never rely on hue |

**Headings** (`semantics { heading() }` / `android:accessibilityHeading`) drive
TalkBack's "Headings" reading control, a primary navigation method on long
screens — without them users must swipe linearly through everything.

**Live regions:** `liveRegion = LiveRegionMode.Polite` on the node whose text
changes (result count, validation summary, sync status); `Assertive` interrupts,
so use it sparingly. Views also have `announceForAccessibility()` for one-shot
announcements; Compose prefers live regions.

**Focus order:** Compose derives traversal order from layout position; fix
exceptions with `isTraversalGroup = true` plus `traversalIndex` (lower first).
Views use `android:accessibilityTraversalBefore` / `...After`. Never reorder
without a reason — it desyncs the visual and non-visual experiences. And note
that an in-app back stack which doesn't honor `OnBackPressedCallback` strands
Switch Access and TalkBack users, whose back is the system gesture or key, not
your on-screen chevron.

### 3.5 Testing tooling

From [Test your app's accessibility](https://developer.android.com/guide/topics/ui/accessibility/testing):

| Tool | Catches |
|---|---|
| **Accessibility Scanner** (Play Store app, built on the [Accessibility Test Framework](https://github.com/google/Accessibility-Test-Framework-for-Android)) | Missing content labels, insufficient contrast, touch targets below 48dp, clickable-item issues |
| **Compose UI Check** (Android Studio, from the Compose Preview) | Text stretched on large screens, low contrast, color-vision-deficiency previews, with suggested fixes |
| **Play Console pre-launch report** | Touch target size, low contrast, content labeling, implementation/traversal-order issues |
| **Espresso `AccessibilityChecks.enable()`** / Compose `enableAccessibilityChecks()` | The same framework, inside instrumentation and Compose UI tests |
| **Android Lint** | Missing `contentDescription`, hardcoded text |
| **Layout Inspector / `printToLog`** | Inspect the semantics tree; `onRoot(useUnmergedTree = true).printToLog("A11Y")` dumps what TalkBack actually sees |

Automated tools catch a minority of real issues. **Manual TalkBack and Switch
Access passes are not optional** — Android frames tooling as one of four
approaches alongside manual service testing, automated tests, and user testing
with people with disabilities. Flutter has
`meetsGuideline(androidTapTargetGuideline)` (48×48), `iOSTapTargetGuideline`
(44×44), `labeledTapTargetGuideline` and `textContrastGuideline`
([Flutter](https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility)).
React Native exposes `accessible`, `accessibilityLabel/Hint/Role/State/Value`
and `accessibilityActions` on both platforms; `accessibilityLiveRegion`,
`importantForAccessibility` and `accessibilityLabelledBy` on Android;
`accessibilityViewIsModal`, `accessibilityElementsHidden`,
`accessibilityIgnoresInvertColors` and `onAccessibilityEscape` on iOS; plus
`AccessibilityInfo.isScreenReaderEnabled()` / `.isReduceMotionEnabled()` /
`.isBoldTextEnabled()` and `announceForAccessibility()`
([RN](https://reactnative.dev/docs/accessibility)).

---

## Part 4 — Accessibility acceptance checklist

Twenty items, run against **one screen**. Each is pass/fail by observation.

**Perception**

1. **Text contrast.** Every text run measures ≥4.5:1 against its actual
   background (≥3:1 if ≥18pt/24px, or ≥14pt/18.66px bold) — placeholders and
   captions included, text over images at its worst pixel. *(1.4.3)*
2. **Non-text contrast.** Every control boundary, state indicator, focus ring
   and meaning-bearing icon or chart element measures ≥3:1. *(1.4.11)*
3. **Not color-only.** In grayscale (iOS Color Filters; Android Color
   correction), every state, error, required field, link and chart series is
   still distinguishable. *(1.4.1)*
4. **Text scales to max.** At iOS `.accessibility5` and Android 200% font scale,
   nothing meaningful truncates, overlaps or clips, and every control still works.
5. **Layout reflows at large text.** Label-and-control rows stack vertically
   rather than squeezing; the screen scrolls if needed.
6. **Display/zoom scale.** The layout holds at Android's largest Display size
   and at iOS Display Zoom.

**Operation**

7. **Target size.** Every interactive element has a ≥48dp/pt hit area (the
   visual may be smaller), with ≥8dp/pt between adjacent targets.
   *(2.5.8; Apple 44pt; Android 48dp)*
8. **No drag-only functionality.** Every reorder, swipe-action, slider and pan
   has a single-tap or assistive-tech equivalent. *(2.5.7)*
9. **No gesture-only functionality.** Every multi-finger, path-based or force
   gesture has a single-pointer alternative. *(2.5.1)*
10. **Screen reader completes the task.** With VoiceOver (or TalkBack) on and
    the screen not looked at, the primary task completes start to finish.
11. **Reading order.** Swiping forward reaches every visible element exactly
    once in visual order; swiping back retraces it. No skips, no loops.
12. **Switch Control / Switch Access.** Sequential scanning reaches every
    actionable item and **only** actionable items; the task completes.
13. **Keyboard.** With a hardware keyboard, Tab reaches every control, focus is
    **visibly** indicated, Space/Return activates, Escape dismisses. *(2.1.1, 2.4.7)*
14. **Focus never hidden.** With the software keyboard up and any sticky bar,
    snackbar or mini-player showing, the focused control is never entirely
    covered. *(2.4.11)*

**Semantics**

15. **Every control is named.** Nothing announces as "button", "image",
    "unlabeled", or a filename; names make sense out of context.
16. **Type and state are announced.** Toggles, checkboxes, tabs and selected
    rows announce role + state via traits / `Role` + `stateDescription` —
    **not** baked into the label.
17. **Decoration hidden, groups grouped.** Decorative images are absent from the
    tree (`accessibilityHidden` / `contentDescription = null` /
    `hideFromAccessibility`); multi-element rows are one stop
    (`.accessibilityElement(children: .combine)` / `mergeDescendants = true`)
    with per-item affordances as custom actions.
18. **Headings exist.** Section titles carry heading semantics
    (`.accessibilityAddTraits(.isHeader)` / `semantics { heading() }`). *(1.3.1)*

**Change and state**

19. **Dynamic changes are announced.** Errors, result counts, sync status and
    snackbars reach assistive tech via a live region or explicit announcement,
    without stealing focus; errors are in text with a suggested correction.
    *(3.3.1, 3.3.3, 4.1.3)*
20. **System preferences are honored.** With Reduce Motion, Reduce Transparency,
    Increase Contrast, Bold Text, Differentiate Without Color and Button Shapes
    all ON (plus TalkBack + 200% font on Android): no parallax or auto-advancing
    motion, opaque surfaces, heavier type without clipping, non-color state cues,
    visible button affordances.

**For flows rather than single screens, add:** help in a consistent place
(3.2.6); previously entered data prefilled (3.3.7); authentication that allows
password managers and paste (3.3.8); adjustable time limits (2.2.1).

---

## Sources

**Apple** — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · App Store Connect evaluation criteria: [Sufficient Contrast](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/sufficient-contrast-evaluation-criteria), [Larger Text](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria), [VoiceOver](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria), [Reduced Motion](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria) · [UI Design Dos and Don'ts](https://developer.apple.com/design/tips/) · [SwiftUI accessibility modifiers](https://developer.apple.com/documentation/swiftui/view-accessibility) · [`DynamicTypeSize`](https://developer.apple.com/documentation/swiftui/dynamictypesize) · [`UIFont.TextStyle`](https://developer.apple.com/documentation/uikit/uifont/textstyle) · [`UIAccessibility`](https://developer.apple.com/documentation/uikit/uiaccessibility)

**Android / Material** — [Accessibility overview](https://developer.android.com/guide/topics/ui/accessibility) · [Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps) · [Principles](https://developer.android.com/guide/topics/ui/accessibility/principles) · [Testing](https://developer.android.com/guide/topics/ui/accessibility/testing) · [Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics) · [Design foundations](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility) · [Android 14 non-linear font scaling](https://developer.android.com/about/versions/14/features#non-linear-font-scaling) · [Material 3 accessible design](https://m3.material.io/foundations/accessible-design)

**W3C** — [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) · [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) · [Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

**Frameworks** — [React Native accessibility](https://reactnative.dev/docs/accessibility) · [Flutter accessibility](https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility)
