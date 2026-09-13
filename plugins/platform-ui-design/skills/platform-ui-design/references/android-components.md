# Android / Material 3 — Components & Adaptive Layout Reference

Dense mapping of Material 3 (M3) components and Android adaptive-layout patterns to Jetpack Compose APIs.
View-system (XML) equivalents noted where useful. Sources cited inline.

Primary sources:
- M3 spec: https://m3.material.io/components (JS-rendered; specs below reflect the published M3 token values)
- Compose components: https://developer.android.com/develop/ui/compose/components
- Adaptive apps: https://developer.android.com/develop/adaptive-apps
- Compose adaptive layouts: https://developer.android.com/develop/ui/compose/layouts/adaptive
## 0. Global rules (read first)

| Rule | Value / API |
|---|---|
| Min touch target | 48×48dp (visual container may be smaller, e.g. 40dp icon button in 48dp target) |
| Color | Always `MaterialTheme.colorScheme.<role>`; never hardcode hex. Pair `x` with `onX`. |
| Shape | `MaterialTheme.shapes.{extraSmall 4, small 8, medium 12, large 16, extraLarge 28}` dp |
| Type | `MaterialTheme.typography.{display,headline,title,body,label}{Large,Medium,Small}` |
| Elevation | M3 uses **tonal** elevation (color overlay) + `shadowElevation`. `Surface(tonalElevation=, shadowElevation=)` |
| Dynamic color | `dynamicLightColorScheme(context)` / `dynamicDarkColorScheme(context)`, API 31+ |
| Edge-to-edge | Mandatory when targeting SDK 35+ (Android 15). `enableEdgeToEdge()` in `onCreate`. |
| Structure | `Scaffold(topBar, bottomBar, floatingActionButton, snackbarHost, contentWindowInsets) { innerPadding -> }` — **must** apply `innerPadding` |

Source: https://developer.android.com/develop/ui/compose/designsystems/material3 ,
https://developer.android.com/develop/ui/compose/components/scaffold

**M3 color roles (use these, not literals).** `primary`/`onPrimary` — highest-emphasis fills (filled button, FAB, active indicator). `primaryContainer`/`onPrimaryContainer` — lower-emphasis primary fills (selected nav indicator, tonal accents). `secondary*`, `tertiary*` — lower-emphasis and contrasting accents, filter chips. `surface`, `surfaceVariant`, `surfaceContainer{Lowest,Low,,High,Highest}` — backgrounds and elevation tiers (`surfaceContainerHighest` = filled text field / filled card). `error`/`onError`/`errorContainer` — error states. `outline` — outlined button & text-field borders; `outlineVariant` — dividers. `scrim` — modal scrims. `inverseSurface`/`inverseOnSurface`/`inversePrimary` — snackbar container/content/action.
**M3 type scale** (Roboto default): display 57/45/36, headline 32/28/24, title 22/16/14, body 16/14/12, label 14/12/11 sp.
Source: https://developer.android.com/develop/ui/compose/designsystems/material3

# PART 1 — ACTIONS

## 1.1 Common buttons (elevated / filled / filled tonal / outlined / text)

**What:** Single-action triggers with text label (+optional 18dp icon).
**Emphasis ladder (high → low):** Filled → Filled tonal → Elevated → Outlined → Text.

| Variant | Compose | Container | Content | Use when |
|---|---|---|---|---|
| Filled | `Button` | `primary` | `onPrimary` | The one primary action on the screen ("Save", "Confirm") |
| Filled tonal | `FilledTonalButton` | `secondaryContainer` | `onSecondaryContainer` | Secondary action that still needs weight ("Next" beside "Back") |
| Elevated | `ElevatedButton` | `surfaceContainerLow` + 1dp shadow | `primary` | Button must separate from a busy/patterned background |
| Outlined | `OutlinedButton` | transparent + 1dp `outline` border | `primary` | Important but not primary; pairs with a filled button |
| Text | `TextButton` | transparent | `primary` | Lowest emphasis: dialog actions, card actions, inline links |

**Specs** (https://m3.material.io/components/all-buttons):
- Height 40dp (default/medium); touch target ≥48dp.
- Shape: fully rounded (20dp radius) in M3; M3 Expressive toggles to a square-ish shape while pressed.
- Padding: 24dp horizontal text-only; with leading icon 16dp start / 24dp end; TextButton 12dp.
- Icon size 18dp, 8dp gap to label. Label `labelLarge` (14sp medium).
- M3 Expressive size scale: XS 32dp, S 40dp, M 56dp, L 96dp, XL 136dp (radius scales with height).
- Disabled: content `onSurface` @38%, container `onSurface` @12%; elevation removed.

**States:** enabled, disabled, hovered, focused, pressed (state-layer opacities 8%/10%/10%).
```kotlin
Button(
  onClick = {},
  modifier = Modifier,
  enabled = true,
  shape = ButtonDefaults.shape,
  colors = ButtonDefaults.buttonColors(),       // .elevatedButtonColors() / .filledTonalButtonColors() / .outlinedButtonColors() / .textButtonColors()
  elevation = ButtonDefaults.buttonElevation(),
  border = null,                                 // ButtonDefaults.outlinedButtonBorder for OutlinedButton
  contentPadding = ButtonDefaults.ContentPadding,
  interactionSource = remember { MutableInteractionSource() }
) { Text("Label") }
```
Source: https://developer.android.com/develop/ui/compose/components/button

**Icon inside a button:** `Icon(..., Modifier.size(ButtonDefaults.IconSize)); Spacer(Modifier.size(ButtonDefaults.IconSpacing))`
**XML equivalents:** `com.google.android.material.button.MaterialButton` with
`style=@style/Widget.Material3.Button` (filled) / `.TonalButton` / `.ElevatedButton` / `.OutlinedButton` / `.TextButton`.

**Don't:** more than one filled button per screen region; use a button where a link/text is meant; put destructive + confirm at equal emphasis.
## 1.2 Button groups (M3 Expressive)

`ButtonGroup` / `ToggleButton` — row of related buttons that shrink/expand as neighbours are pressed.
Use for related sibling actions (e.g. text formatting). Not a substitute for segmented buttons (which express selection).
Source: https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary
## 1.3 FAB (small / standard / large / extended) + FAB menu

**What:** The single most important, screen-level action. Floats above content.
**Use when:** one constructive primary action (compose, add, create).
**Don't:** more than one FAB per screen; a FAB for a destructive/minor action; a FAB where the action isn't visible in the current view.

| Type | Container | Corner | Icon | Compose |
|---|---|---|---|---|
| Small | 40×40dp | 12dp | 24dp | `SmallFloatingActionButton` |
| Standard | 56×56dp | 16dp | 24dp | `FloatingActionButton` |
| Large | 96×96dp | 28dp | 36dp | `LargeFloatingActionButton` |
| Extended | h 56dp, min-w 80dp | 16dp | 24dp + `labelLarge` | `ExtendedFloatingActionButton` |

- Default colors: `primaryContainer` / `onPrimaryContainer`; elevation 6dp (3dp lowered variant).
- Placement: 16dp from screen edges (compact); bottom-end. In a `BottomAppBar`, pass via `floatingActionButton =`.
- Extended FAB collapses to icon-only on scroll: `expanded = !listState.isScrollInProgress` / `expanded = listState.firstVisibleItemIndex == 0`.
- Large screens: FAB moves into the `NavigationRail(header = { FloatingActionButton(...) })` or drawer header — do not leave it floating bottom-right on a 1200dp window.
```kotlin
FloatingActionButton(onClick = {}, shape = FloatingActionButtonDefaults.shape,
  containerColor = MaterialTheme.colorScheme.primaryContainer,
  contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
  elevation = FloatingActionButtonDefaults.elevation()) { Icon(Icons.Filled.Add, "Add") }
ExtendedFloatingActionButton(
  onClick = {}, expanded = expanded,
  icon = { Icon(Icons.Filled.Edit, null) }, text = { Text("Compose") })
```
Source: https://developer.android.com/develop/ui/compose/components/fab

**M3 Expressive:** `FloatingActionButtonMenu` + `FloatingActionButtonMenuItem` + `ToggleFloatingActionButton` replace the old "speed dial" pattern.
**XML:** `FloatingActionButton`, `ExtendedFloatingActionButton` (material components).
## 1.4 Icon buttons (standard / filled / tonal / outlined; toggle variants)

**What:** Single icon action, no label. Icon must be unambiguous — pair with a tooltip.
**Specs:** container 40×40dp (M3 Expressive: XS 32 → XL 104), icon 24dp, touch target 48dp, circular. Toggle variants swap filled/outlined icon on select.

| Emphasis | Compose | Toggle version |
|---|---|---|
| Standard (transparent) | `IconButton` | `IconToggleButton` |
| Filled | `FilledIconButton` | `FilledIconToggleButton` |
| Filled tonal | `FilledTonalIconButton` | `FilledTonalIconToggleButton` |
| Outlined | `OutlinedIconButton` | `OutlinedIconToggleButton` |
```kotlin
IconButton(onClick = {}, enabled = true, colors = IconButtonDefaults.iconButtonColors()) {
  Icon(Icons.Filled.Favorite, contentDescription = "Add to favorites")
}
IconToggleButton(checked = checked, onCheckedChange = { checked = it }) { /* swap icon */ }
```
Source: https://developer.android.com/develop/ui/compose/components/icon-button

**Always** set `contentDescription`, and change it with state ("Add to favorites" → "Remove from favorites"). Wrap in `TooltipBox` + `PlainTooltip` for hover/long-press labels (required on desktop/ChromeOS).
## 1.5 Segmented buttons (single-select / multi-select)

**What:** 2–5 side-by-side options in a shared container; expresses **selection**, not navigation.
**Use when:** toggling a view mode or filter with few, equal options (Day/Week/Month).
**Don't:** use for navigation (use tabs); >5 options (use chips or a menu); a single option (use a toggle/switch).
**Specs:** height 40dp; container fully rounded on the outer ends, 0dp between; selected item gets `secondaryContainer` + leading check 18dp; 1dp `outline` divider between items.
```kotlin
SingleChoiceSegmentedButtonRow {
  options.forEachIndexed { i, label ->
    SegmentedButton(
      shape = SegmentedButtonDefaults.itemShape(index = i, count = options.size),
      selected = i == selectedIndex,
      onClick = { selectedIndex = i },
      label = { Text(label) }
    )
  }
}
MultiChoiceSegmentedButtonRow {
  SegmentedButton(shape = …, checked = state[i], onCheckedChange = { … },
    icon = { SegmentedButtonDefaults.Icon(state[i]) }, label = { Text(label) })
}
```
Source: https://developer.android.com/develop/ui/compose/components/segmented-button

**XML:** `MaterialButtonToggleGroup` with `Widget.Material3.Button.OutlinedButton`.
## 1.6 Split button

**What:** A leading primary action + a trailing chevron that opens a menu of related actions.
**Use when:** one common default action with variants (Send / Send later, Save / Save as).
**Don't:** use when the two halves are unrelated, or when there is no sensible default.
**Specs:** 40dp height; leading corner set rounded on the start, trailing on the end; 2dp spacing between halves; trailing icon rotates 180° when the menu opens.
```kotlin
SplitButtonLayout(
  leadingButton  = { SplitButtonDefaults.LeadingButton(onClick = {}) { Text("Send") } },
  trailingButton = { SplitButtonDefaults.AnimatedTrailingButton(onClick = { expanded = !expanded },
                        checked = expanded) { Icon(Icons.Filled.KeyboardArrowDown, "More options") } },
  spacing = SplitButtonDefaults.Spacing
)
```
Also: `SplitButtonDefaults.TonalLeadingButton`, `.OutlinedLeadingButton`, `.ElevatedLeadingButton`.
Source: https://developer.android.com/reference/kotlin/androidx/compose/material3/SplitButtonLayout.composable

# PART 2 — COMMUNICATION

## 2.1 Badges

**What:** Small numeric/dot marker on an icon or nav item indicating new or unread items.
**Use when:** count of unseen items, or "something new here" (dot).
**Don't:** badge more than a couple of destinations; use a badge for a persistent state (use a chip/label).
**Specs:** dot 6dp diameter; numeric badge 16dp height, min 16dp width, 8dp radius, `labelSmall`; cap at 3 digits ("999+"). Colors `error` / `onError`.
```kotlin
BadgedBox(badge = { Badge { Text("8") } }) { Icon(Icons.Filled.Mail, "Mail") }
BadgedBox(badge = { Badge() }) { Icon(…) }   // dot only
// In nav: NavigationBarItem(icon = { BadgedBox(badge = { Badge { Text("99+") } }) { Icon(…) } }, …)
// In drawer: NavigationDrawerItem(badge = { Text("20") }, …)
```
Source: https://m3.material.io/components/badges ; drawer badge param:
https://developer.android.com/develop/ui/compose/components/drawer

**A11y:** the count must also reach TalkBack — put it in the parent's `contentDescription` ("Mail, 8 unread").
## 2.2 Progress indicators (linear / circular, determinate / indeterminate)

**What:** Status of an in-flight operation.
**Determinate** when you know the fraction (`progress = { 0f..1f }`); **indeterminate** when you don't (omit `progress`).

| | Linear | Circular |
|---|---|---|
| Compose | `LinearProgressIndicator` | `CircularProgressIndicator` |
| Size | 4dp track height, full width of its container | 48dp diameter, 4dp stroke |
| Use | Bounded process tied to a region/page top; file upload | In-place/inline waits, pull-to-refresh, buttons |
```kotlin
LinearProgressIndicator(progress = { p }, modifier = Modifier.fillMaxWidth(),
  color = ProgressIndicatorDefaults.linearColor,
  trackColor = ProgressIndicatorDefaults.linearTrackColor,
  strokeCap = ProgressIndicatorDefaults.LinearStrokeCap,
  gapSize = ProgressIndicatorDefaults.LinearIndicatorTrackGapSize)
CircularProgressIndicator(modifier = Modifier.size(48.dp),
  color = MaterialTheme.colorScheme.secondary,
  trackColor = MaterialTheme.colorScheme.surfaceVariant)
```
Source: https://developer.android.com/develop/ui/compose/components/progress

**Rules:** M3 indicators have a visible **track gap** and rounded caps by default — don't strip them. Keep one indicator per operation. Never animate `progress` backwards. Use `Modifier.progressSemantics()` on custom indicators. Prefer skeletons/placeholders over a full-screen spinner for content loads.

## 2.3 Loading indicators (M3 Expressive)

`LoadingIndicator` / `ContainedLoadingIndicator` — the shape-morphing indeterminate indicator used for short waits and
pull-to-refresh (`PullToRefreshBox(indicator = { ... })`). Use instead of an indeterminate circular spinner where
the wait is brief and expressive motion is wanted; still indeterminate-only.
Source: https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary
## 2.4 Snackbars

**What:** Brief, bottom-anchored message about a process, with at most **one** action.
**Use when:** confirming a completed action, offering "Undo", reporting a transient failure.
**Don't:** for errors the user must resolve (use a dialog or inline error); more than one action; a "Dismiss"/"OK"-only action (use `withDismissAction`); stacking multiple snackbars.
**Specs:** single-line 48dp, two-line 68dp; max width 600dp (centered on large windows); 4dp corners; `inverseSurface` container / `inverseOnSurface` text / `inversePrimary` action. Durations: `Short` ≈4s, `Long` ≈10s, `Indefinite` (must have an action or dismiss). Max 2 lines of text.
```kotlin
val snackbarHostState = remember { SnackbarHostState() }
Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { …
  scope.launch {
    val result = snackbarHostState.showSnackbar(
      message = "Message deleted",
      actionLabel = "Undo",
      withDismissAction = false,
      duration = SnackbarDuration.Short)
    when (result) {
      SnackbarResult.ActionPerformed -> undo()
      SnackbarResult.Dismissed -> Unit
    }
  }
}
```
Source: https://developer.android.com/develop/ui/compose/components/snackbar

Passing `snackbarHost` to `Scaffold` makes the snackbar sit above the bottom bar/FAB and respect insets — do not place a bare `SnackbarHost` in a `Box`.
**XML:** `Snackbar.make(view, msg, LENGTH_SHORT).setAction(...)`, anchored via `setAnchorView(fab)`.
## 2.5 Tooltips (plain / rich)

| | Plain | Rich |
|---|---|---|
| Content | One short line, no title/actions | Subhead + body (multi-line) + optional action buttons |
| Trigger | Hover (mouse) / long-press (touch) | Same, or programmatic; `isPersistent = true` to keep it open |
| Use | Label an icon button | Explain a new/complex feature |

**Specs:** plain tooltip `inverseSurface`/`inverseOnSurface`, 4dp corners, min height 24dp; rich tooltip `surfaceContainer`, 12dp corners, max width 320dp. Optional `caret` pointing at the anchor.
```kotlin
TooltipBox(
  positionProvider = TooltipDefaults.rememberPlainTooltipPositionProvider(),
  tooltip = { PlainTooltip { Text("Add to favorites") } },
  state = rememberTooltipState()
) { IconButton(onClick = {}) { Icon(Icons.Filled.Favorite, "Add to favorites") } }
TooltipBox(
  positionProvider = TooltipDefaults.rememberRichTooltipPositionProvider(),
  tooltip = { RichTooltip(title = { Text("Title") },
                action = { TextButton(onClick = { scope.launch { state.dismiss() } }) { Text("Got it") } }) {
                Text("Longer explanatory text.") } },
  state = rememberTooltipState(isPersistent = true)
) { IconButton(onClick = {}) { Icon(Icons.Filled.Info, "More info") } }
```
Source: https://developer.android.com/develop/ui/compose/components/tooltip

Tooltips are **not** a substitute for `contentDescription`, and must never carry information required to complete the task (they're unavailable to touch users who don't long-press).

# PART 3 — CONTAINMENT

## 3.1 Bottom sheets (standard / modal)

| | Standard | Modal |
|---|---|---|
| Compose | `BottomSheetScaffold(sheetContent=, sheetPeekHeight=)` | `ModalBottomSheet(onDismissRequest=, sheetState=)` |
| Blocks content? | No — coexists, user can interact with the page | Yes — scrim, blocks interaction |
| Use | Persistent secondary content (now-playing, map details) | A menu/choice/form that must be resolved |

**Specs:** top corners 28dp, container `surfaceContainerLow`; drag handle 32×4dp, `onSurfaceVariant` @40%; default peek 56dp; on **expanded-width windows a modal sheet becomes inappropriate** — use a dialog or side sheet instead. Max width 640dp (centered) on wide windows.
```kotlin
val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = false)
ModalBottomSheet(
  onDismissRequest = { show = false },
  sheetState = sheetState,
  dragHandle = { BottomSheetDefaults.DragHandle() },
  contentWindowInsets = { BottomSheetDefaults.windowInsets },
  shape = BottomSheetDefaults.ExpandedShape
) { /* ColumnScope content */ }
scope.launch { sheetState.hide() }.invokeOnCompletion { if (!sheetState.isVisible) show = false }
```
Source: https://developer.android.com/develop/ui/compose/components/bottom-sheets

`ModalBottomSheet` has **built-in predictive-back** (scales down as you swipe). Always call `hide()` then clear the flag — don't just set the boolean, or the exit animation is skipped.
**XML:** `BottomSheetBehavior` on a child of `CoordinatorLayout`; `BottomSheetDialogFragment` for modal.

## 3.2 Side sheets

**What:** The expanded-window counterpart to a bottom sheet — anchored to the end edge.
**Use when:** supporting/secondary content on medium+ windows (filters, details, comments).
**Specs:** width 256–400dp (default 320dp); start corners 16dp (modal) / 0dp (standard, docked full-height).
Compose M3 does not yet ship a `SideSheet`; build with `SupportingPaneScaffold` (preferred), or a `Row` + `Surface`
of fixed width, or `ModalNavigationDrawer` with `drawerContent` on the end via `LocalLayoutDirection`.
Source: https://m3.material.io/components/side-sheets

## 3.3 Cards (elevated / filled / outlined)

**What:** Container for a single coherent piece of content + actions.
**Use when:** a self-contained item in a collection (product, article, message).
**Don't:** nest cards; use a card as a page background; use a card where a list item suffices (cards cost vertical space).

| Variant | Compose | Container | Separation |
|---|---|---|---|
| Elevated | `ElevatedCard` | `surfaceContainerLow` | 1dp shadow (6dp when raised) |
| Filled | `Card` (default) | `surfaceContainerHighest` | tone only |
| Outlined | `OutlinedCard` | `surface` | 1dp `outlineVariant` border |

**Specs:** corner 12dp (`shapes.medium`); internal padding 16dp; default elevation: filled 0dp, elevated 1dp, outlined 0dp.
```kotlin
Card(onClick = {}, enabled = true, shape = CardDefaults.shape,
  colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHighest),
  elevation = CardDefaults.cardElevation(defaultElevation = 0.dp, pressedElevation = 2.dp)) { /* Column */ }
```
Source: https://developer.android.com/develop/ui/compose/components/card

Cards have no built-in scroll or dismiss: add `Modifier.verticalScroll` or wrap in `SwipeToDismissBox`.
The whole card should be clickable **or** the buttons inside should be — not both ambiguously.
**XML:** `com.google.android.material.card.MaterialCardView`.

## 3.4 Carousel

**What:** Horizontally scrolling, size-varying collection of visual items.
**Use when:** browsing images/media where relative prominence helps; **not** for text-heavy or navigational content.

| Type | Compose | Sizing param |
|---|---|---|
| Multi-browse | `HorizontalMultiBrowseCarousel` | `preferredItemWidth` (fits as many as possible; last items shrink) |
| Uncontained | `HorizontalUncontainedCarousel` | `itemWidth` (fixed; flows past the edge) |
| Hero / full-screen | build from `HorizontalMultiBrowseCarousel` with large `preferredItemWidth` / a pager | — |
```kotlin
HorizontalMultiBrowseCarousel(
  state = rememberCarouselState { items.count() },
  preferredItemWidth = 186.dp,
  itemSpacing = 8.dp,
  contentPadding = PaddingValues(horizontal = 16.dp)
) { i -> Image(..., modifier = Modifier.height(205.dp).maskClip(MaterialTheme.shapes.extraLarge)) }
```
`Modifier.maskClip(shape)` is required so items clip to the morphing carousel mask (28dp extraLarge is the M3 default).
Source: https://developer.android.com/develop/ui/compose/components/carousel

## 3.5 Dialogs (basic / full-screen)

**What:** Modal interruption requiring a decision or a small amount of input.
**Use when:** destructive confirmation, a blocking choice, an error the user must acknowledge.
**Don't:** for transient confirmations (snackbar); for long forms (full-screen dialog or a new screen); stacked dialogs.
**Specs:** 28dp corners, `surfaceContainerHigh`; min width 280dp, max 560dp; 24dp padding; icon 24dp (optional, centered); title `headlineSmall`; body `bodyMedium`; actions right-aligned `TextButton`s, confirming action **last** (end). Max 2 actions. Full-screen dialog (compact windows, complex input): top app bar with a close ✕ and a confirming text action.
```kotlin
AlertDialog(
  onDismissRequest = { … },
  icon = { Icon(Icons.Filled.Warning, null) },
  title = { Text("Delete file?") },
  text = { Text("This can't be undone.") },
  confirmButton = { TextButton(onClick = onConfirm) { Text("Delete") } },
  dismissButton  = { TextButton(onClick = onDismiss) { Text("Cancel") } }
)
Dialog(onDismissRequest = {}, properties = DialogProperties(
    dismissOnBackPress = true, dismissOnClickOutside = true, usePlatformDefaultWidth = false)) {
  Card(Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(28.dp)) { /* custom */ }
}
// BasicAlertDialog: M3 shell with no prescribed slots.
```
Source: https://developer.android.com/develop/ui/compose/components/dialog

Set `usePlatformDefaultWidth = false` when you need the dialog wider than the platform default on large screens.
**XML:** `MaterialAlertDialogBuilder`, `DialogFragment`.

## 3.6 Dividers

**What:** 1dp line grouping content. **Use sparingly** — whitespace and headers are usually better.
**Specs:** `thickness = 1.dp` (DividerDefaults.Thickness), `color = outlineVariant` (DividerDefaults.color). Full-bleed, or inset 16dp to align with list text.
```kotlin
HorizontalDivider(thickness = DividerDefaults.Thickness, color = DividerDefaults.color)
VerticalDivider()   // requires a bounded height: Row(Modifier.height(IntrinsicSize.Min))
```
Source: https://developer.android.com/develop/ui/compose/components/divider
**XML:** `com.google.android.material.divider.MaterialDivider`.

Don't put a divider between every list item when the items already have clear internal spacing — divide *groups*.

## 3.7 Lists

**What:** Vertical stack of same-type items with text and optional leading/trailing content.
**Specs (M3 list item heights):** one-line 56dp, two-line 72dp, three-line 88dp.
Leading: icon 24dp, avatar 40dp, image 56dp, video 64×114dp. Trailing: icon 24dp, `labelSmall` meta text, control (checkbox/switch). Padding 16dp horizontal; three-line uses 12dp vertical.
```kotlin
ListItem(
  headlineContent   = { Text("Primary") },
  overlineContent   = { Text("OVERLINE") },
  supportingContent = { Text("Secondary text") },
  leadingContent    = { Icon(Icons.Filled.Person, null) },
  trailingContent   = { Text("meta") },
  colors = ListItemDefaults.colors(),
  tonalElevation = ListItemDefaults.Elevation,
  modifier = Modifier.clickable { }
)
LazyColumn(contentPadding = PaddingValues(vertical = 8.dp),
  verticalArrangement = Arrangement.spacedBy(0.dp)) {
  stickyHeader { … }
  items(items, key = { it.id }) { ListItem(…) }
}
```
Source: https://m3.material.io/components/lists ; https://developer.android.com/develop/ui/compose/lists

**Always** pass a stable `key` to `items()` — without it, scroll position and animations break on reorder.
**XML:** `RecyclerView` + `LinearLayoutManager` (and `ListAdapter`/`DiffUtil`).

# PART 4 — NAVIGATION

## 4.1 Navigation component selection by window size (the single most important adaptive rule)

| Window width | Component | Compose | `NavigationSuiteType` |
|---|---|---|---|
| Compact (<600dp) | Navigation **bar** (bottom) | `NavigationBar` | `NavigationBar` / `ShortNavigationBarCompact` |
| Medium (600–839dp) | Navigation **rail** | `NavigationRail` | `NavigationRail` |
| Expanded (≥840dp) | Navigation **rail (expanded)** or permanent **drawer** | `PermanentNavigationDrawer` / wide rail | `NavigationDrawer` / `WideNavigationRailExpanded` |
| Tabletop posture (any width) | Navigation bar (keeps controls below the fold) | — | `NavigationBar` |

`NavigationSuiteScaffold` does this automatically:
```kotlin
NavigationSuiteScaffold(
  navigationSuiteItems = {
    AppDestinations.entries.forEach {
      item(selected = it == current, onClick = { current = it },
           icon = { Icon(it.icon, stringResource(it.contentDescription)) },
           label = { Text(stringResource(it.label)) })
    }
  },
  layoutType = NavigationSuiteScaffoldDefaults.calculateFromAdaptiveInfo(currentWindowAdaptiveInfo()),
  navigationSuiteColors = NavigationSuiteDefaults.colors(),
  containerColor = …, contentColor = …
) { /* destination content */ }
```
Override, e.g. force a drawer on expanded:
```kotlin
val info = currentWindowAdaptiveInfo()
val type = if (info.windowSizeClass.isWidthAtLeastBreakpoint(WIDTH_DP_EXPANDED_LOWER_BOUND))
    NavigationSuiteType.NavigationDrawer
  else NavigationSuiteScaffoldDefaults.calculateFromAdaptiveInfo(info)
```
Dependency: `androidx.compose.material3:material3-adaptive-navigation-suite`.
Source: https://developer.android.com/develop/adaptive-apps/guides/build-adaptive-navigation

## 4.2 Navigation bar (bottom)

**What:** 3–5 top-level destinations, always reachable, compact windows only.
**Don't:** 6+ items (use a drawer/rail); fewer than 3 (use tabs); mix navigation with actions; hide it on scroll for primary navigation.
**Specs:** height 80dp; icon 24dp; active indicator 64×32dp pill, `secondaryContainer`; label `labelMedium`, always visible (preferred) or selected-only; equal-width items. Selected icon filled, unselected outlined.
```kotlin
Scaffold(bottomBar = {
  NavigationBar(windowInsets = NavigationBarDefaults.windowInsets,
    containerColor = NavigationBarDefaults.containerColor) {
    destinations.forEach { d ->
      NavigationBarItem(
        selected = d == current, onClick = { navController.navigate(d.route) { launchSingleTop = true; restoreState = true
            popUpTo(navController.graph.findStartDestination().id) { saveState = true } } },
        icon = { Icon(d.icon, d.contentDescription) }, label = { Text(d.label) }, alwaysShowLabel = true,
        colors = NavigationBarItemDefaults.colors())
    }
  }
}) { padding -> AppNavHost(navController, start, Modifier.padding(padding)) }
```
Source: https://developer.android.com/develop/ui/compose/components/navigation-bar
**XML:** `BottomNavigationView` → `com.google.android.material.navigation.NavigationBarView` / `NavigationBarView` with `menu` of ≤5 items.

M3 Expressive adds `ShortNavigationBar` (horizontal icon+label items, shorter container).

## 4.3 Bottom app bar

**What:** Bottom container for 3–4 **screen-level actions** plus an optional FAB — not navigation.
**Use when:** an editing/content screen needs quick actions within thumb reach. Never use together with a navigation bar.
**Specs:** height 80dp; icons 24dp; FAB docked at the end; `surfaceContainer`.
```kotlin
BottomAppBar(
  actions = { IconButton(onClick = {}) { Icon(Icons.Filled.Check, "Check") } /* … */ },
  floatingActionButton = { FloatingActionButton(onClick = {}, elevation = FloatingActionButtonDefaults.bottomAppBarFabElevation()) { Icon(Icons.Filled.Add, "Add") } },
  containerColor = …, contentColor = …, windowInsets = BottomAppBarDefaults.windowInsets)
// M3 Expressive: FlexibleBottomAppBar (scroll behavior, arrangement)
```
Source: https://developer.android.com/develop/ui/compose/components/app-bars

## 4.4 Navigation rail

**What:** Vertical navigation for medium/expanded windows; 3–7 destinations.
**Specs:** width 80dp (standard) / 96dp+ (wide, M3 Expressive `WideNavigationRail`); items 56dp tall with 24dp icon + `labelMedium`; optional `header` slot for a FAB or menu button; top/center/bottom arrangement.
```kotlin
NavigationRail(
  header = { FloatingActionButton(onClick = {}) { Icon(Icons.Filled.Add, "Add") } },
  containerColor = …, windowInsets = NavigationRailDefaults.windowInsets
) {
  destinations.forEach { NavigationRailItem(selected = …, onClick = …, icon = { Icon(...) }, label = { Text(...) }) }
}
```
Source: https://developer.android.com/develop/ui/compose/components/navigation-rail

The rail must sit **beside** content, not over it — put it in a `Row` (or let `NavigationSuiteScaffold` place it), and it takes the start edge's `safeDrawing` insets.

## 4.5 Navigation drawer (standard / modal / dismissible)

| Variant | Compose | Behavior | Use for |
|---|---|---|---|
| Modal | `ModalNavigationDrawer` | Overlays with scrim, swipe/menu-triggered | Compact/medium windows; many destinations |
| Standard (permanent) | `PermanentNavigationDrawer` | Always visible, shares space | Expanded windows ≥840dp |
| Dismissible | `DismissibleNavigationDrawer` | Pushes content, can be hidden | Expanded windows where space is tight |

**Specs:** width 360dp (max), item height 56dp, item shape 28dp fully rounded, 12dp horizontal padding inside a 16dp-padded sheet; section headers `titleSmall`; icon 24dp; selected item `secondaryContainer`.
```kotlin
val drawerState = rememberDrawerState(DrawerValue.Closed)
ModalNavigationDrawer(
  drawerState = drawerState, gesturesEnabled = true, scrimColor = DrawerDefaults.scrimColor,
  drawerContent = {
    ModalDrawerSheet {                       // or DismissibleDrawerSheet / PermanentDrawerSheet
      Text("Title", Modifier.padding(16.dp), style = MaterialTheme.typography.titleLarge)
      HorizontalDivider()
      NavigationDrawerItem(label = { Text("Inbox") }, selected = true, onClick = {},
        icon = { Icon(Icons.Outlined.Inbox, null) }, badge = { Text("24") })
    } }
) { /* content; toggle via scope.launch { if (drawerState.isClosed) drawerState.open() else drawerState.close() }
       from a TopAppBar navigationIcon IconButton with contentDescription "Open navigation menu" */ }
```
Source: https://developer.android.com/develop/ui/compose/components/drawer

Make the drawer sheet scrollable (`Modifier.verticalScroll`) — drawers overflow on short/landscape windows.
**XML:** `DrawerLayout` + `com.google.android.material.navigation.NavigationView`.

## 4.6 Tabs (primary / secondary)

| | Primary | Secondary |
|---|---|---|
| Compose | `PrimaryTabRow` / `PrimaryScrollableTabRow` | `SecondaryTabRow` / `SecondaryScrollableTabRow` |
| Placement | Directly under the top app bar | Inside content, below a primary tab row |
| Indicator | Short pill under the label/icon only, `primary` | Full-width underline, `primary` |

**Specs:** height 48dp (text-only or icon-only), 64dp (icon + label stacked); min tab width 90dp, max 360dp; label `titleSmall`; indicator 3dp (primary) / 2dp (secondary). Use `ScrollableTabRow` when tabs exceed the width — **never** truncate or wrap tab labels onto 3 lines.
```kotlin
PrimaryTabRow(selectedTabIndex = index, indicator = { TabRowDefaults.PrimaryIndicator(
    Modifier.tabIndicatorOffset(index)) }) {
  titles.forEachIndexed { i, t ->
    Tab(selected = i == index, onClick = { index = i },
        text = { Text(t, maxLines = 2, overflow = TextOverflow.Ellipsis) },
        icon = { Icon(...) }, enabled = true)
  }
}
// LeadingIconTab for icon-beside-label
```
Source: https://developer.android.com/develop/ui/compose/components/tabs

Tabs are **peer** content within one destination; they are not top-level navigation. Pair with `HorizontalPager` so swipe and tap stay in sync.
**XML:** `TabLayout` + `ViewPager2` via `TabLayoutMediator`.

## 4.7 Top app bar (small / center-aligned / medium / large)

| Variant | Height (collapsed→expanded) | Compose | Use |
|---|---|---|---|
| Small | 64dp | `TopAppBar` | Default; title start-aligned |
| Center-aligned | 64dp | `CenterAlignedTopAppBar` | Single short title, ≤1 action (often the root screen) |
| Medium | 112dp → 64dp | `MediumTopAppBar` (`MediumFlexibleTopAppBar`) | Screen title deserves emphasis |
| Large | 152dp → 64dp | `LargeTopAppBar` (`LargeFlexibleTopAppBar`) | Top-level landing/hero screens |

**Specs:** title `titleLarge` (small/center) / `headlineSmall`–`headlineMedium` (medium/large); nav icon 24dp at 16dp start inset; max **3** action icons (overflow the rest into a `DropdownMenu`); container `surface`, and `surfaceContainer` when scrolled under.
```kotlin
val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior(rememberTopAppBarState())
//  pinnedScrollBehavior()          – never collapses
//  enterAlwaysScrollBehavior()     – collapses up, reappears on any downward scroll
//  exitUntilCollapsedScrollBehavior() – expands only when the list is back at the top
Scaffold(
  modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
  topBar = { LargeTopAppBar(
    title = { Text("Title") },
    navigationIcon = { IconButton(onClick = {}) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") } },
    actions = { IconButton(onClick = {}) { Icon(Icons.Filled.MoreVert, "More") } },
    colors = TopAppBarDefaults.topAppBarColors(),
    windowInsets = TopAppBarDefaults.windowInsets,
    scrollBehavior = scrollBehavior) }
) { padding -> … }
```
Source: https://developer.android.com/develop/ui/compose/components/app-bars

Use `Icons.AutoMirrored.*` for back/forward/list icons so RTL mirrors correctly.
On **compact-height** windows (landscape phone), drop medium/large app bars to small — check
`windowSizeClass.isHeightAtLeastBreakpoint(HEIGHT_DP_MEDIUM_LOWER_BOUND)`.
**XML:** `AppBarLayout` + `MaterialToolbar` (+ `CollapsingToolbarLayout` for medium/large) inside `CoordinatorLayout`.

## 4.8 Search (search bar / search view)

**What:** Persistent search entry that expands in place into a full search view with suggestions/results.
**Use when:** search is a primary way to navigate the app's content.
**Don't:** use a plain `TextField` styled like a search bar; put a search icon in the app bar if search is the main task.
**Specs:** collapsed bar 56dp height, 28dp corners, `surfaceContainerHigh`; full-width on compact with 16dp margins; `DockedSearchBar` max 360dp wide (medium/expanded); expanded view fills the window on compact.
```kotlin
SearchBar(                                    // expands to full-screen view
  inputField = {
    SearchBarDefaults.InputField(
      query = query, onQueryChange = { query = it },
      onSearch = { expanded = false; search(it) },
      expanded = expanded, onExpandedChange = { expanded = it },
      placeholder = { Text("Search") },
      leadingIcon = { Icon(Icons.Default.Search, null) },
      trailingIcon = { if (expanded) IconButton({ query = "" }) { Icon(Icons.Default.Close, "Clear") } })
  },
  expanded = expanded, onExpandedChange = { expanded = it },
  colors = SearchBarDefaults.colors()
) { LazyColumn { items(results) { ListItem(headlineContent = { Text(it) }, modifier = Modifier.clickable { … }) } } }
DockedSearchBar(inputField = { … }, expanded = …, onExpandedChange = …) { … }  // suggestions in a dropdown
```
Wrap in `Box(Modifier.semantics { isTraversalGroup = true })` and set `traversalIndex` so TalkBack reaches the bar first.
`SearchBar` supports **predictive back** out of the box (collapses on back gesture).
Source: https://developer.android.com/develop/ui/compose/components/search-bar
**XML:** `com.google.android.material.search.SearchBar` + `SearchView`.

## 4.9 Back handling & predictive back

**Requirements**
- `AndroidManifest.xml`: `<application android:enableOnBackInvokedCallback="true">` — required on Android 13–15; default on API 36+ (`targetSdk 36`).
- Never intercept back without a reason; never make back do "forward" navigation.

**APIs**
```kotlin
BackHandler(enabled = drawerOpen) { closeDrawer() }             // androidx.activity.compose
PredictiveBackHandler(enabled = isOpen) { progress: Flow<Float> ->
  try {
    progress.collect { p -> offset = p * maxOffset }            // animate with the gesture, 0f..1f
    close()                                                     // gesture committed
  } catch (e: CancellationException) { offset = 0f }            // gesture cancelled
}
```
Source: https://developer.android.com/develop/ui/compose/system/predictive-back

**Built-in predictive-back support:** `ModalBottomSheet`, `SearchBar`, `ModalNavigationDrawer`, Navigation Compose
(`NavHost` with `popEnterTransition`/`popExitTransition`), and `NavigableListDetailPaneScaffold` /
`NavigableSupportingPaneScaffold`.

**Back semantics in multi-pane layouts:** `BackNavigationBehavior`
| Value | Effect |
|---|---|
| `PopUntilScaffoldValueChange` (default) | Back only when the visible pane *arrangement* changes — right for most apps |
| `PopUntilContentChange` | Back returns to the previously viewed content regardless of layout |
| `PopUntilCurrentDestinationChange` | Back moves focus between panes |
| `PopLatest` | Pops exactly one back-stack entry |

# PART 5 — SELECTION

## 5.1 Checkbox

**What:** Independent on/off selection; multiple selections allowed; changes usually apply on confirm.
**Don't:** use for mutually exclusive options (radio) or for an immediately-applied setting (switch).
**Specs:** box 18dp, 2dp corner, 2dp stroke `onSurfaceVariant`; checked fill `primary`, check `onPrimary`; 48dp touch target; label `bodyLarge`, 16dp gap.
**States:** unchecked, checked, indeterminate (`TriStateCheckbox` only), + enabled/disabled/hover/focus/press.
```kotlin
Checkbox(checked = c, onCheckedChange = { c = it }, enabled = true, colors = CheckboxDefaults.colors())
TriStateCheckbox(state = parentState, onClick = { … })   // ToggleableState.On/Off/Indeterminate
// Whole-row selection (preferred for a11y and target size):
Row(Modifier.toggleable(value = c, role = Role.Checkbox, onValueChange = { c = it })
      .fillMaxWidth().padding(horizontal = 16.dp), verticalAlignment = Alignment.CenterVertically) {
  Checkbox(checked = c, onCheckedChange = null); Text("Label", Modifier.padding(start = 16.dp))
}
```
Source: https://developer.android.com/develop/ui/compose/components/checkbox

Parent/child ("select all") pattern: derive parent `ToggleableState` from children; parent uses `TriStateCheckbox`.
**XML:** `MaterialCheckBox` (supports `checkedState` with indeterminate since Material 1.7).

## 5.2 Radio button

**What:** Exactly one choice from a visible set of 2–5 mutually exclusive options.
**Don't:** use for >5 options (menu/dropdown); allow zero selections without an explicit "None" option.
**Specs:** 20dp circle, 2dp stroke; 48dp target; selected `primary`.
```kotlin
Column(Modifier.selectableGroup()) {
  options.forEach { opt ->
    Row(Modifier.selectable(selected = opt == sel, role = Role.RadioButton, onClick = { sel = opt })
          .fillMaxWidth().height(56.dp).padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically) {
      RadioButton(selected = opt == sel, onClick = null, colors = RadioButtonDefaults.colors())
      Text(opt, Modifier.padding(start = 16.dp), style = MaterialTheme.typography.bodyLarge)
    }
  }
}
```
`Modifier.selectableGroup()` is required so TalkBack announces "1 of 3".

## 5.3 Switch

**What:** Immediately-applied binary setting.
**Use when:** the change takes effect at once (Wi-Fi, notifications). **Don't** use in a form that has a Save button — use a checkbox.
**Specs:** track 52×32dp, 16dp corner; thumb 24dp when checked, 16dp unchecked (28dp while pressed); icon inside thumb 16dp; checked track `primary`, thumb `onPrimary`; unchecked track `surfaceContainerHighest` + `outline` border.
```kotlin
Switch(checked = c, onCheckedChange = { c = it }, enabled = true,
  thumbContent = if (c) { { Icon(Icons.Filled.Check, null, Modifier.size(SwitchDefaults.IconSize)) } } else null,
  colors = SwitchDefaults.colors())
```
Source: https://developer.android.com/develop/ui/compose/components/switch

Label goes at the **start**, switch at the end; the whole row should be toggleable. Never put "On/Off" text next to a switch.
**XML:** `com.google.android.material.materialswitch.MaterialSwitch`.

## 5.4 Chips (assist / filter / input / suggestion)

| Type | Compose | Purpose | Selectable? | Removable? |
|---|---|---|---|---|
| Assist | `AssistChip` / `ElevatedAssistChip` | Smart/contextual action for the current task ("Add to calendar") | No | No |
| Filter | `FilterChip` / `ElevatedFilterChip` | Filter a collection; toggles on/off, shows a check | Yes | No |
| Input | `InputChip` | Represents a discrete user entry (a recipient, a tag) | Yes | Yes (trailing ✕) |
| Suggestion | `SuggestionChip` / `ElevatedSuggestionChip` | System-generated suggestion to narrow intent (smart replies) | No | No |

**Specs:** height 32dp (input chip 32dp; M3 Expressive adds 40/48/56dp sizes); corner 8dp (`shapes.small`); leading icon 18dp; input chip avatar 24dp; outline 1dp `outline` (flat variants); label `labelLarge`; 8dp spacing between chips; 16dp/8dp internal padding.
```kotlin
AssistChip(onClick = {}, label = { Text("Assist") },
  leadingIcon = { Icon(Icons.Filled.Settings, null, Modifier.size(AssistChipDefaults.IconSize)) })
FilterChip(selected = sel, onClick = { sel = !sel }, label = { Text("Filter") },
  leadingIcon = if (sel) { { Icon(Icons.Filled.Done, null, Modifier.size(FilterChipDefaults.IconSize)) } } else null)
InputChip(selected = true, onClick = onRemove, label = { Text(name) },
  avatar = { Icon(Icons.Filled.Person, null, Modifier.size(InputChipDefaults.AvatarSize)) },
  trailingIcon = { Icon(Icons.Default.Close, "Remove $name") })
SuggestionChip(onClick = {}, label = { Text("Suggestion") })
```
Source: https://developer.android.com/develop/ui/compose/components/chip

Chips are not buttons — never use a chip as the primary CTA. Filter chip rows should scroll horizontally
(`LazyRow` + `contentPadding = PaddingValues(horizontal = 16.dp)`) rather than wrap ambiguously.
**XML:** `ChipGroup` + `Chip` with `Widget.Material3.Chip.{Assist,Filter,Input,Suggestion}`.

## 5.5 Date pickers

| Form | Compose | Use |
|---|---|---|
| Docked | `DatePicker` in a `Popup` anchored to a text field | Compact layouts / desktop; near-term dates |
| Modal | `DatePickerDialog { DatePicker(state) }` | Full focus; browsing months |
| Modal input | `rememberDatePickerState(initialDisplayMode = DisplayMode.Input)` | Typing a known date (birth date, far past/future) |
| Range | `DateRangePicker` + `rememberDateRangePickerState()` | Start/end selection (travel, reports) |

**Specs:** modal container 328dp wide, 28dp corners; date cell 40dp, selected fill `primary`, today ringed 1dp `primary`; headline `headlineLarge`. Always offer the keyboard-input toggle (`showModeToggle = true`) — required for accessible date entry.
```kotlin
val state = rememberDatePickerState(initialSelectedDateMillis = null,
  yearRange = DatePickerDefaults.YearRange, initialDisplayMode = DisplayMode.Picker,
  selectableDates = object : SelectableDates { override fun isSelectableDate(d: Long) = d >= today })
DatePickerDialog(onDismissRequest = onDismiss,
  confirmButton = { TextButton({ onPick(state.selectedDateMillis); onDismiss() }) { Text("OK") } },
  dismissButton = { TextButton(onDismiss) { Text("Cancel") } }) { DatePicker(state = state) }
val rangeState = rememberDateRangePickerState()   // selectedStartDateMillis / selectedEndDateMillis
```
Source: https://developer.android.com/develop/ui/compose/components/datepickers
(Experimental API; values are UTC millis — format with `java.time` + desugaring, not `Date`.)

## 5.6 Time pickers

| Form | Compose | Use |
|---|---|---|
| Dial | `TimePicker(state)` | Picking a nearby/approximate time |
| Input | `TimeInput(state)` | Entering a precise known time; keyboard/a11y |

**Specs:** dial 256dp diameter; number fields 96×80dp; vertical layout on compact-portrait, horizontal on compact-landscape (`layoutType = TimePickerDefaults.layoutType()`). Always provide a toggle between dial and input.
```kotlin
val state = rememberTimePickerState(initialHour = 9, initialMinute = 30, is24Hour = true)
TimePicker(state = state, colors = TimePickerDefaults.colors(), layoutType = TimePickerDefaults.layoutType())
TimeInput(state = state)
// read: state.hour, state.minute ; wrap in an AlertDialog/BasicAlertDialog for the modal form
```
Source: https://developer.android.com/develop/ui/compose/components/time-pickers

Respect the user's 24-hour setting: `is24Hour = DateFormat.is24HourFormat(context)`.

## 5.7 Menus (dropdown / exposed dropdown / context)

**What:** Temporary list of choices anchored to a trigger.
**Use when:** 4+ actions that don't fit as icons; choosing one value from a longer list.
**Don't:** use a menu for primary navigation; nest menus more than one level.
**Specs:** min width 112dp, max 280dp; item height 48dp; corner 4dp (`shapes.extraSmall`); container `surfaceContainer`, elevation 2dp; item text `labelLarge`; leading/trailing icons 24dp; trailing shortcut text `labelLarge` `onSurfaceVariant`.
```kotlin
Box {
  IconButton({ expanded = true }) { Icon(Icons.Default.MoreVert, "More options") }
  DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }, offset = DpOffset(0.dp, 0.dp)) {
    DropdownMenuItem(text = { Text("Profile") }, onClick = { … }, enabled = true,
      leadingIcon = { Icon(Icons.Outlined.Person, null) }, trailingIcon = { Text("⌘P") })
    HorizontalDivider()
    DropdownMenuItem(text = { Text("Settings") }, onClick = { … })
  }
}
// Exposed dropdown = text field that opens a menu (the M3 "spinner")
ExposedDropdownMenuBox(expanded = e, onExpandedChange = { e = it }) {
  TextField(value = sel, onValueChange = {}, readOnly = true, label = { Text("Option") },
    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(e) },
    modifier = Modifier.menuAnchor(MenuAnchorType.PrimaryNotEditable))
  ExposedDropdownMenu(expanded = e, onDismissRequest = { e = false }) {
    options.forEach { DropdownMenuItem(text = { Text(it) }, onClick = { sel = it; e = false },
      contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding) } }
}
```
`DropdownMenu` scrolls automatically when content overflows.
**Right-click / context menus (desktop, ChromeOS):** wire a secondary click — see §7.4.
Source: https://developer.android.com/develop/ui/compose/components/menu

## 5.8 Sliders

**What:** Selecting a value (or range) from a continuous or stepped range where the exact number matters less than the relative position.
**Don't:** use for precise numeric entry (text field); ranges with <5 meaningful steps (segmented buttons/radio).
**Specs:** track 4dp (M3 Expressive: 16dp track, 4dp thumb waist); thumb 20dp; active track `primary`, inactive `surfaceContainerHighest`; tick marks 2dp on stepped sliders; touch target 48dp tall.
```kotlin
Slider(value = v, onValueChange = { v = it }, valueRange = 0f..50f, steps = 3,
  onValueChangeFinished = { commit(v) }, enabled = true,
  colors = SliderDefaults.colors(thumbColor = …, activeTrackColor = …, inactiveTrackColor = …),
  thumb = { SliderDefaults.Thumb(interactionSource = it) },
  track = { SliderDefaults.Track(sliderState = it) })
RangeSlider(value = 20f..80f, onValueChange = { range = it }, valueRange = 0f..100f, steps = 5,
  onValueChangeFinished = { … })
```
`steps` counts the positions *between* the ends: `steps = 3` over `0f..50f` → stops at 0, 12.5, 25, 37.5, 50.
Do the expensive work in `onValueChangeFinished`, not `onValueChange`.
Always show the current value as text or a label; set `Modifier.semantics { contentDescription = … }` for a11y.
Source: https://developer.android.com/develop/ui/compose/components/slider

# PART 6 — TEXT INPUTS

## 6.1 Text fields (filled / outlined)

| Variant | Compose | Container | Use |
|---|---|---|---|
| Filled | `TextField` | `surfaceContainerHighest`, 4dp top corners, 1dp bottom indicator | Higher visual emphasis; dense forms; the default on mobile |
| Outlined | `OutlinedTextField` | transparent, 1dp `outline` border, 4dp corners all round | Lower emphasis; forms on light/busy surfaces; many adjacent fields |

Pick one and use it consistently — never mix filled and outlined in the same form.

**Specs:** height 56dp (single-line, with label); 48dp without label; horizontal padding 16dp; leading/trailing icons 24dp at 12dp inset; label floats to `bodySmall` on focus; input `bodyLarge`; supporting text `bodySmall` with 16dp start / 4dp top padding; focused indicator 2dp `primary`; error `error` for border, label, supporting text and trailing icon.
**Current recommended API is state-based (`TextFieldState`)**:
```kotlin
val state = rememberTextFieldState(initialText = "")
TextField(
  state = state, label = { Text("Email") }, placeholder = { Text("name@example.com") },
  supportingText = { Text(if (isError) "Enter a valid email" else "We'll never share it") },
  isError = isError, enabled = true, readOnly = false, prefix = null, suffix = null,
  leadingIcon = { Icon(Icons.Default.Email, null) },
  trailingIcon = { if (isError) Icon(Icons.Filled.Error, "Error") },
  lineLimits = TextFieldLineLimits.SingleLine,            // or MultiLine(minHeightInLines, maxHeightInLines)
  inputTransformation = InputTransformation.maxLength(64),
  outputTransformation = null,                            // display formatting without changing state
  keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
  colors = TextFieldDefaults.colors(), shape = TextFieldDefaults.shape)
OutlinedTextField(state = state, …)   // same surface | SecureTextField(state = pwState, …) for passwords
BasicTextField(state = state, decorator = { … })          // fully custom
```
Legacy value-based overload (`value`/`onValueChange`, `visualTransformation`, `singleLine`, `maxLines`) still works but is no longer recommended.
Source: https://developer.android.com/develop/ui/compose/text/user-input

**XML:** `com.google.android.material.textfield.TextInputLayout` (`Widget.Material3.TextInputLayout.FilledBox` / `.OutlinedBox`) wrapping `TextInputEditText`; `app:helperText`, `app:error`, `app:counterEnabled`.

## 6.2 Supporting text, counters, errors

- **Supporting text** sits under the field, `bodySmall`, `onSurfaceVariant`. Use it for format hints ("8+ characters"), not for restating the label. It reserves vertical space — decide up-front whether every field has it, so the form doesn't jump when an error appears.
- **Character counter**: right-aligned in the supporting-text row; pair with `InputTransformation.maxLength(n)`.
- **Error state**: set `isError = true` **and** replace/append the supporting text with a specific, actionable message. Never rely on red color alone (contrast/color-blindness) — always add text and, ideally, an error trailing icon.
- Validate on blur or submit, not on every keystroke; clear the error as soon as the input becomes valid.
- Announce errors: `Modifier.semantics { error("Enter a valid email") }` (or rely on `isError` + supportingText, which M3 merges into the field's semantics).
- `enabled = false` (whole field unusable) vs `readOnly = true` (focusable, selectable, copyable) — use `readOnly` for computed values such as a date populated from a picker.

# PART 7 — ADAPTIVE LAYOUT

## 7.1 Window size classes (breakpoints)

| Class | Width | Height | Typical |
|---|---|---|---|
| Compact | < 600dp | < 480dp | Phone portrait (99.96% of phones) |
| Medium | 600–839dp | 480–899dp | Tablet portrait, unfolded phone, split-screen |
| Expanded | 840–1199dp | ≥ 900dp | Tablet landscape, small desktop window |
| Large | 1200–1599dp | — | Large tablet / desktop |
| Extra-large | ≥ 1600dp | — | Desktop displays |
```kotlin
val info = currentWindowAdaptiveInfo(supportLargeAndXLargeWidth = true)
val wsc = info.windowSizeClass
val wide = wsc.isWidthAtLeastBreakpoint(WindowSizeClass.WIDTH_DP_EXPANDED_LOWER_BOUND)
val tall = wsc.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)
```
Constants: `WIDTH_DP_MEDIUM_LOWER_BOUND` 600, `WIDTH_DP_EXPANDED_LOWER_BOUND` 840, `WIDTH_DP_LARGE_LOWER_BOUND` 1200,
`WIDTH_DP_EXTRA_LARGE_LOWER_BOUND` 1600; `HEIGHT_DP_MEDIUM_LOWER_BOUND` 480, `HEIGHT_DP_EXPANDED_LOWER_BOUND` 900.
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes

**Critical:** size classes describe the **app window**, not the device, and change at runtime (rotation, split-screen, fold, desktop resize). Hoist the size class as state and pass it down; never branch on `Build.MODEL`, screen inches, or `isTablet` booleans, and never read `Display.getSize()` (deprecated — use `WindowMetricsCalculator`/`currentWindowAdaptiveInfo`).
**Dependencies**
```kotlin
implementation("androidx.compose.material3.adaptive:adaptive")             // Posture, HingeInfo, currentWindowAdaptiveInfo
implementation("androidx.compose.material3.adaptive:adaptive-layout")      // ListDetailPaneScaffold, SupportingPaneScaffold
implementation("androidx.compose.material3.adaptive:adaptive-navigation")  // Navigable* + navigators
implementation("androidx.compose.material3:material3-adaptive-navigation-suite")
```
(min `compose-material3-adaptive` 1.1.0 for the `Navigable*` scaffolds.)
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/list-detail

## 7.2 Canonical layouts

### List-detail
**What:** A list of peer items; selecting one shows its detail.
**Use when:** detail content is meaningful on its own — messaging, mail, contacts, file browsers, settings.
**Behavior:** compact/medium → one pane at a time (list ⇄ detail); expanded → both side by side (≈ 50/50, or list at a fixed 360dp with detail flexible).
**Config-change continuity:** expanded→compact keeps the *detail* visible; compact(detail)→expanded shows list + detail with the selection marked; compact(list)→expanded shows list + placeholder.
```kotlin
val navigator = rememberListDetailPaneScaffoldNavigator<MyItem>()   // MyItem must be Parcelable/Serializable
val scope = rememberCoroutineScope()
NavigableListDetailPaneScaffold(
  navigator = navigator,
  defaultBackBehavior = BackNavigationBehavior.PopUntilScaffoldValueChange,
  listPane = { AnimatedPane {
      ListContent(onItemClick = { item ->
        scope.launch { navigator.navigateTo(ListDetailPaneScaffoldRole.Detail, item) } })
  } },
  detailPane = { AnimatedPane {
      DetailContent(item = navigator.currentDestination?.contentKey,
        onBack = { scope.launch { navigator.navigateBack() } })
  } },
  extraPane = null                                       // optional third pane
)
```
`ThreePaneScaffoldNavigator`: `currentDestination` (`.pane`, `.contentKey`), `scaffoldValue` (which panes are visible),
`navigateTo(role, content)`, `navigateBack(behavior)`, `canNavigateBack()`.
Roles: `ListDetailPaneScaffoldRole.{List, Detail, Extra}`.
Lower-level: `ListDetailPaneScaffold(directive = navigator.scaffoldDirective, value = navigator.scaffoldValue, …)`.
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/list-detail

**View-system equivalent:** `SlidingPaneLayout` (+ Navigation component with two-pane destinations), or activity embedding
(`SplitPairRule` via Jetpack WindowManager) for legacy two-activity apps.

### Supporting pane
**What:** Primary content plus secondary content that is only meaningful *in relation to it*.
**Use when:** document + comments, video + up-next, editor + properties/tool palette, form + help.
**Split:** expanded ≈ 70/30 main/supporting; medium ≈ 50/50; compact → supporting content collapses below the main content or into a bottom sheet.
**vs list-detail:** if the second pane makes sense on its own screen, it's a detail pane; if it only makes sense next to the first, it's a supporting pane.
```kotlin
val navigator = rememberSupportingPaneScaffoldNavigator()
NavigableSupportingPaneScaffold(
  navigator = navigator,
  mainPane       = { AnimatedPane { MainContent(onShowSupporting = {
                        scope.launch { navigator.navigateTo(SupportingPaneScaffoldRole.Supporting) } }) } },
  supportingPane = { AnimatedPane { SupportingContent() } },
  extraPane      = null
)
// roles: SupportingPaneScaffoldRole.{Main, Supporting, Extra}
```
Source: https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts

### Feed
**What:** A scrolling grid of equivalent (or emphasis-varying) content cards.
**Use when:** news, social, storefronts, photo galleries — content is browsed, not traversed.
**Behavior:** one column on compact → multi-column on medium/expanded, driven by a **minimum item width**, not by a device check.
```kotlin
LazyVerticalGrid(
  columns = GridCells.Adaptive(minSize = 180.dp),      // NOT GridCells.Fixed(n) keyed off a device check
  contentPadding = PaddingValues(16.dp),
  horizontalArrangement = Arrangement.spacedBy(8.dp),
  verticalArrangement = Arrangement.spacedBy(8.dp)
) {
  item(span = { GridItemSpan(maxLineSpan) }) { SectionHeader() }   // full-width row
  items(items, key = { it.id }) { FeedCard(it) }
}
// LazyVerticalStaggeredGrid(StaggeredGridCells.Adaptive(180.dp)) for variable-height media
```
Source: https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts

Cap text line length on wide windows: a feed card or article body should not exceed ~60–70 characters per line —
constrain with `Modifier.widthIn(max = 640.dp)` rather than `fillMaxWidth()`.

## 7.3 Foldables: posture, hinge, table-top
```kotlin
val folds by collectFoldingFeaturesAsState()          // androidx.compose.material3.adaptive
val fold = folds.firstOrNull()
val isTabletop = fold?.state == FoldingFeature.State.HALF_OPENED &&
                 fold.orientation == FoldingFeature.Orientation.HORIZONTAL
val isBook     = fold?.state == FoldingFeature.State.HALF_OPENED &&
                 fold.orientation == FoldingFeature.Orientation.VERTICAL
// or:
val isTabletop2 = currentWindowAdaptiveInfo().windowPosture.isTabletop
```
`FoldingFeature`: `state` (`FLAT`, `HALF_OPENED`), `orientation` (`HORIZONTAL`, `VERTICAL`),
`occlusionType` (`NONE`, `FULL`), `isSeparating` (creates two logical areas), `bounds` (Rect, for positioning).
Underlying: `WindowInfoTracker.getOrCreate(activity).windowLayoutInfo(activity)` (Jetpack WindowManager, views + Compose).
Source: https://developer.android.com/develop/adaptive-apps/guides/foldables/make-your-app-fold-aware

**Rules**
- **Table-top** (half-open, horizontal fold): media/content above the fold, controls/list below. Video calls, players, camera.
- **Book** (half-open, vertical fold): two-page reading, or list-detail across the fold.
- Never place a control, a focal image, or a text column **under** the hinge when `isSeparating` is true or `occlusionType == FULL`. Use `fold.bounds` to lay out around it.
- The hinge **angle is not exposed** — never build logic on a precise angle.
- Dual-screen devices report `FLAT` but `isSeparating = true` — treat them like the folded postures.
- Keep `NavigationSuiteScaffold` defaults: tabletop posture forces the navigation **bar** so nav stays in the bottom half.
- Expect rapid, repeated configuration changes: hoist state into `ViewModel`/`rememberSaveable`, don't re-fetch on every fold.

## 7.4 Desktop, ChromeOS & multi-window

**Manifest / behavior**
- `android:resizeableActivity="true"` (default from API 24; on API 31+ large screens force multi-window anyway).
- Never lock `android:screenOrientation` — Android 16 (API 36) **ignores** orientation, aspect-ratio and resizability restrictions on displays ≥600dp.
- Declare `android:configChanges="screenSize|smallestScreenSize|screenLayout|orientation|density|keyboard|keyboardHidden|navigation|uiMode"` only if you actually handle them; Compose handles resize natively.
- `<layout android:defaultWidth android:defaultHeight android:minWidth android:minHeight android:gravity/>` sets freeform/desktop launch geometry.
- Multi-resume (API 29+): all visible activities are `RESUMED`. Release exclusive resources (camera, mic) in `onTopResumedActivityChanged(false)`.
- Use `WindowMetricsCalculator` / `currentWindowMetrics`, never `Display.getSize()`.
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/support-multi-window-mode

**Input (required for ChromeOS/desktop/XR quality)**
| Need | Compose API |
|---|---|
| Focusable custom element | `Modifier.focusable()`, `Modifier.focusRequester()`, `Modifier.onFocusChanged {}` |
| Tab order in a collection | `Modifier.focusGroup()`, `focusProperties { next = …; previous = … }` |
| Key handling / shortcuts | `Modifier.onKeyEvent { it.isCtrlPressed && it.key == Key.S }`, `onPreviewKeyEvent` |
| Hover state | `Modifier.hoverable(interactionSource)`, `interactionSource.collectIsHoveredAsState()` |
| Cursor shape | `Modifier.pointerHoverIcon(PointerIcon.Hand / .Text)` |
| Right-click / secondary click | `Modifier.pointerInput { awaitPointerEventScope { … event.button… } }`, or `View.OnContextClickListener` via `AndroidView` |
| Scroll wheel | handled by `verticalScroll`/Lazy lists automatically |
| Stylus pressure/tilt/palm | `Modifier.pointerInteropFilter { motionEvent }` → `getToolType()`, `getPressure()`, `getAxisValue(AXIS_TILT)`, `FLAG_CANCELED` |
| Drag & drop across apps | `Modifier.dragAndDropSource/Target`; ChromeOS: `requestDragAndDropPermissions()`, `View.DRAG_FLAG_GLOBAL` |

Checklist: every action reachable by keyboard alone; visible focus ring; Tab/arrow order matches visual order; Ctrl+C/V/Z/S wired; right-click opens a context menu; hover feedback on every clickable; tooltips on icon-only buttons.
Source: https://developer.android.com/develop/ui/compose/touch-input/input-compatibility-on-large-screens

**Android XR**
- Existing Compose apps run unchanged in **Home Space** (a flat panel). Opt into **Full Space** for spatialized UI.
- Spatial APIs: `SpatialPanel` (a floating 2D panel), `Orbiter` (controls anchored around a panel — put nav bars/app bars here), `SubspaceModifier` (`.width/.height/.depth/.offset/.movable/.resizable`), `SpatialRow/SpatialColumn/SpatialBox`.
- Gate spatial code: `LocalSpatialCapabilities.current.isSpatialUiEnabled` — always ship a working 2D fallback.
- XR panels are resizable by the user: treat them exactly like a resizable desktop window (window size classes still apply). Hover and gaze states matter; keep touch targets ≥48dp equivalent.
Source: https://developer.android.com/develop/xr

## 7.5 Edge-to-edge & window insets (required)
```kotlin
class MainActivity : ComponentActivity() {
  override fun onCreate(b: Bundle?) {
    enableEdgeToEdge()                                  // androidx.activity — required, SDK 35+ enforces it
    super.onCreate(b); setContent { AppTheme { App() } }
  }
}
```
**Inset types:** `statusBars` (top bar) · `navigationBars` (gesture/3-button bar — bottom, or the side in landscape) · `systemBars` (status+nav+caption) · `ime` (keyboard) · `displayCutout` (notch) · `waterfall` (curved edges) · **`safeDrawing` — the default choice**, everything you must not draw under · `safeGestures` (system-gesture reservations) · `safeContent` (safeDrawing ∪ safeGestures) · `*IgnoringVisibility` variants stay non-zero when a bar is hidden.
```kotlin
Modifier.windowInsetsPadding(WindowInsets.safeDrawing)
Modifier.safeDrawingPadding()
Modifier.imePadding()                                   // lift content above the keyboard
Modifier.imeNestedScroll()                              // scroll the keyboard in/out with the list
Modifier.consumeWindowInsets(innerPadding)              // stop double-applying inside a Scaffold
WindowInsets.safeDrawing.asPaddingValues()
Scaffold(contentWindowInsets = WindowInsets.safeDrawing) { … }
LazyColumn(contentPadding = innerPadding)               // scroll UNDER the bars, don't clip
```
Source: https://developer.android.com/develop/ui/compose/layouts/insets

**Rules**
- Backgrounds go edge-to-edge; **interactive/readable content** gets inset padding.
- For scrolling content use `contentPadding`, not `Modifier.padding` — content should scroll *behind* translucent bars.
- `Scaffold`, `TopAppBar`, `BottomAppBar`, `NavigationBar`, `NavigationRail`, `ModalBottomSheet` each consume their own insets; passing `innerPadding` *and* `safeDrawingPadding()` double-pads.
- Handle the **IME** explicitly on every screen with a text field (`imePadding()` or `imeNestedScroll()`).
- `android:windowSoftInputMode="adjustResize"` for the IME-animation APIs to work.
- Landscape phones and foldables put navigation insets on the **side** — never hardcode "bottom padding = 48dp".

# PART 8 — COMMON MISTAKES

**Navigation**
1. Bottom navigation bar with 6+ destinations — the M3 cap is 3–5; use a rail or drawer.
2. Keeping the bottom navigation bar on a tablet/desktop window instead of switching to a rail/drawer (`NavigationSuiteScaffold` does this for free).
3. Using tabs for top-level navigation, or a navigation bar for peer content within one screen.
4. Mixing actions into the navigation bar (that's a bottom **app** bar), or showing both bars at once.
5. Losing back-stack state on re-selection — omit `saveState`/`restoreState`/`launchSingleTop` and every tab switch rebuilds the screen.
6. Not declaring `android:enableOnBackInvokedCallback="true"`, so predictive back silently doesn't work.
7. Intercepting back with `BackHandler(enabled = true)` unconditionally.

**Adaptive**
8. Stretching a phone layout to fill a 1200dp window — a single column of full-width buttons and 120-character text lines.
9. Branching on `isTablet` / smallest-width resource buckets / `Build.MODEL` instead of the runtime window size class.
10. Treating the size class as fixed: reading it once at launch, or locking orientation so it can't change.
11. `GridCells.Fixed(2)` hardcoded instead of `GridCells.Adaptive(minSize)`.
12. Losing state across fold/rotate/resize (state in composables instead of `rememberSaveable`/`ViewModel`) — the most visible large-screen bug.
13. Placing controls under the hinge, or assuming a fold is always vertical.
14. `android:screenOrientation="portrait"` + `resizeableActivity="false"` — ignored on Android 16 large screens, and it fails large-screen quality guidelines.
15. Using a modal bottom sheet on an expanded window where a dialog or side/supporting pane belongs.
16. Building a two-pane layout by hand with `if (isWide) Row else Column` instead of `ListDetailPaneScaffold` — you then own back handling, pane animation, and state restoration yourself.

**Insets / edge-to-edge**
17. Not calling `enableEdgeToEdge()`, or calling it and then ignoring insets so content sits under the status bar.
18. Ignoring `Scaffold`'s `innerPadding`.
19. Applying insets *and* Scaffold padding (double padding, or a gap under the app bar).
20. Using `Modifier.padding(innerPadding)` on a `LazyColumn` instead of `contentPadding` — content clips at the bars instead of scrolling under them.
21. Forgetting `imePadding()` — the keyboard covers the field being typed into.
22. Hardcoding status/navigation bar heights, or assuming the nav bar is always at the bottom.

**Theming / components**
23. Hardcoded `Color(0xFF...)` instead of `MaterialTheme.colorScheme.*` — breaks dark theme, dynamic color and contrast settings.
24. Mismatched pairs (`primary` container with `onSurface` content) → contrast failures.
25. `Color.White`/`Color.Black` for text; fixed `dp` text sizes instead of `sp` (breaks font scaling — test at 200%).
26. Mixing filled and outlined text fields, or two filled buttons of equal weight, in one form.
27. Icon-only buttons with no `contentDescription` and no tooltip.
28. Touch targets under 48dp (icons at 24dp with no padding; dense list rows).
29. Nested cards, or cards used purely as page backgrounds.
30. More than one FAB, or a FAB for a secondary action.
31. More than 3 actions in a top app bar instead of an overflow menu.
32. Snackbar used for a blocking error, or stacked/queued snackbars; a snackbar with two actions.
33. A dialog for something a snackbar or inline validation should do; stacked dialogs.
34. Red text alone to signal an error, with no message or icon.
35. `Switch` in a form that has a Save button (should be a checkbox); checkbox for mutually exclusive options.
36. `LazyColumn`/`LazyVerticalGrid` `items()` without a stable `key`.
37. Dividers between every item where spacing or group headers would read better.
38. An indeterminate full-screen spinner where a skeleton/placeholder preserves layout better.
39. Missing hover, focus and right-click affordances on desktop/ChromeOS/XR.
40. Non-mirrored directional icons in RTL — use `Icons.AutoMirrored.*`.

# PART 9 — QUICK REFERENCE

## Key dp values
**Heights:** touch target 48 · button 40 · segmented button 40 · icon button 40 (icon 24) · chip 32 · text field 56 · search bar 56 · list item 56/72/88 (1/2/3-line) · drawer item 56 · tab 48 (64 icon+label) · top app bar 64/112/152 (small/medium/large) · nav bar & bottom app bar 80.
**Widths:** nav rail 80 · nav drawer 360 max · docked search bar 360 max · dialog 280–560 · snackbar 600 max · menu 112–280 · bottom sheet 640 max · screen margin 16 (compact) / 24 (medium+).
**FAB:** small 40 / standard 56 / large 96 / extended h56 min-w80.
**Corners:** extraSmall 4 (menu, text field) · small 8 (chip) · medium 12 (card) · large 16 (FAB) · extraLarge 28 (dialog, bottom sheet, search bar, carousel item) · full (button, nav indicator).
**Small parts:** divider 1 · linear progress track 4 · slider track 4 / thumb 20 · circular progress 48 (stroke 4) · checkbox 18 · radio 20 · switch track 52×32, thumb 24/16 · badge dot 6 / numeric h16 · drag handle 32×4 · button icon 18 · component icon 24 · avatar 40 · list image 56.

## Compose ↔ XML/View cheat sheet
| Compose (M3) | View system | Compose (M3) | View system |
|---|---|---|---|
| `Scaffold` | `CoordinatorLayout`+`AppBarLayout` | `AlertDialog` | `MaterialAlertDialogBuilder` |
| `Button`/`OutlinedButton`/`TextButton` | `MaterialButton`+style | `ModalBottomSheet` | `BottomSheetDialogFragment` |
| `FloatingActionButton` | `FloatingActionButton` | `LazyColumn`+`ListItem` | `RecyclerView`+`ListAdapter` |
| `TopAppBar`/`LargeTopAppBar` | `MaterialToolbar`/`CollapsingToolbarLayout` | `Card` | `MaterialCardView` |
| `NavigationBar` | `NavigationBarView` (`BottomNavigationView`) | `FilterChip` etc. | `ChipGroup`+`Chip` |
| `NavigationRail` | `NavigationRailView` | `Switch`/`Checkbox`/`RadioButton` | `MaterialSwitch`/`MaterialCheckBox`/`MaterialRadioButton` |
| `ModalNavigationDrawer` | `DrawerLayout`+`NavigationView` | `HorizontalDivider` | `MaterialDivider` |
| `PrimaryTabRow`+`HorizontalPager` | `TabLayout`+`ViewPager2` | `ListDetailPaneScaffold` | `SlidingPaneLayout` / activity embedding |
| `TextField`/`OutlinedTextField` | `TextInputLayout`+`TextInputEditText` | `currentWindowAdaptiveInfo()` | `WindowMetricsCalculator`+`WindowInfoTracker` |
| `SearchBar` | `SearchBar`+`SearchView` | `WindowInsets.safeDrawing` | `ViewCompat.setOnApplyWindowInsetsListener` |

## Testing
```kotlin
@PreviewScreenSizes @PreviewFontScale @PreviewLightDark @PreviewDynamicColors
@Composable fun MyScreenPreview() { AppTheme { MyScreen() } }
// DeviceConfigurationOverride(DeviceConfigurationOverride.ForcedSize(DpSize(840.dp, 900.dp))) { … } in tests
```
Test matrix: compact portrait, compact landscape (short height!), medium, expanded, split-screen, table-top fold,
200% font scale, dark theme, RTL, keyboard-only, TalkBack.
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive
