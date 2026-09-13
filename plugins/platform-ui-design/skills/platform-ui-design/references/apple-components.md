# Apple HIG Components → SwiftUI / UIKit / AppKit

Dense reference. Source of record: Apple Human Interface Guidelines.
`BASE` = `https://developer.apple.com/design/human-interface-guidelines`
Every entry cites `BASE/<slug>`. Content retrieved 2026-09-13 (HIG changelogs through 2026-06-08).

**Platform key:** `iOS` `iPad`(iPadOS) `mac`(macOS) `watch`(watchOS) `tv`(tvOS) `vis`(visionOS). `✓` supported, `–` not supported, `~` supported with caveats.

**Framework key:** SwiftUI symbol first; `(UIKit / AppKit)` in parentheses. `TVUIKit` marked where tvOS-only.

**Structural note:** the standalone `navigation-bars` page no longer exists — `BASE/navigation-bars` canonicalizes to `BASE/toolbars`. Navigation bar guidance was folded into Toolbars on 2025-06-09. Treat "navigation bar" as *the top toolbar on iOS/iPadOS*.

---

## 0. Index

| Group | Components |
|---|---|
| Layout & organization | boxes, collections, column-views, disclosure-controls, labels, lists-and-tables, lockups, outline-views, split-views, tab-views |
| Menus & actions | activity-views, buttons, context-menus, dock-menus, edit-menus, menus, ornaments, pop-up-buttons, pull-down-buttons, toolbars |
| Navigation & search | toolbars (ex nav-bars), path-controls, search-fields, sidebars, tab-bars, token-fields |
| Presentation | action-sheets, alerts, page-controls, panels, popovers, scroll-views, sheets, windows |
| Selection & input | color-wells, combo-boxes, digit-entry-views, image-wells, pickers, segmented-controls, sliders, steppers, text-fields, text-views, toggles, virtual-keyboards |
| Status | activity-rings, gauges, progress-indicators, rating-indicators |
| System experiences | notifications, widgets, live-activities, app-shortcuts, home-screen-quick-actions, share/action extensions, going-full-screen, multitasking, complications |

---

# 1. Layout & organization

## Boxes — `BASE/boxes`
Visually distinct group of logically related content; border or background, optional title.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | ✓ |

- **Use:** small grouped cluster inside a larger view.
- **Don't:** let a box approach the size of its window/screen — it stops communicating separation and crowds other content. Don't nest boxes for subgroups; use padding + alignment instead.
- **Title:** brief phrase, **sentence-style** capitalization, no ending punctuation — *except* in a macOS settings pane, where you append a colon.
- iOS/iPadOS default to secondary + tertiary background colors. macOS draws the title **above** the box.
- **API:** `GroupBox` (– / `NSBox`)

## Collections — `BASE/collections`
Ordered set of content in a customizable, highly visual layout. Image-first.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | ✓ | ✓ |

- **Use:** image-based content; items varying widely in size; grids.
- **Don't:** use for primarily textual content — a list/table is simpler and more efficient to scan. Don't invent custom layouts that draw attention to themselves; default row or grid is what people expect.
- Adequate padding around images so focus/hover effects stay visible and items don't overlap.
- Default gestures: tap to select, touch-and-hold to edit, swipe to scroll. Animate insert/delete/reorder.
- iOS/iPadOS: avoid dynamic layout changes while people are interacting, unless in response to an explicit action.
- **API:** SwiftUI has no direct equivalent — use `LazyVGrid`/`LazyHGrid` (`UICollectionView` / `NSCollectionView`)

## Column views (browser) — `BASE/column-views`
Series of vertical columns, one per hierarchy level; triangle marks parents.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- **Use:** deep hierarchies people traverse back and forth often, and where sorting isn't needed.
- Root level in the **first** column so people can scroll back to the top of the hierarchy. Show item info when a selection has no children (Finder shows date/type/size). Let people resize columns.
- On iPad/visionOS use a **split view** instead.
- **API:** – (– / `NSBrowser`)

## Disclosure controls — `BASE/disclosure-controls`
Reveal/hide related information.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | ✓ |

- Keep the most-used controls at the top of the disclosure hierarchy, always visible; hide advanced functionality by default.
- **Disclosure triangle:** points **inward from the leading edge** when collapsed, **down** when expanded. Used for views/lists (Finder list view, Keynote export options). Always give it a descriptive label ("Advanced Options").
- **Disclosure button:** points **down** when hidden, **up** when shown. Attached to a specific control (macOS Save sheet next to Save As). **No more than one disclosure button per view.** Place it near the content it reveals.
- **API:** `DisclosureGroup` (– / `NSButton.BezelStyle.disclosure`, `.pushDisclosure`)

## Labels — `BASE/labels`
Static, uneditable, often copyable text.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Use:** small amounts of non-editable text. Editable → text field. Large body → text view.
- Prefer system fonts; labels support Dynamic Type by default.
- Make useful values (error message, IP address, serial number) selectable/copyable.
- **Four semantic label colors** — use them to communicate relative importance:

| Role | Use | iOS/iPad/tv/vis | mac |
|---|---|---|---|
| Primary | main information | `UIColor.label` | `NSColor.labelColor` |
| Secondary | subheading / supplemental | `UIColor.secondaryLabel` | `NSColor.secondaryLabelColor` |
| Tertiary | unavailable item or behavior | `UIColor.tertiaryLabel` | `NSColor.tertiaryLabelColor` |
| Quaternary | watermark | `UIColor.quaternaryLabel` | `NSColor.quaternaryLabelColor` |

- watchOS: system date/time and countdown-timer text components auto-fit available space and self-update without app input — use them in complications.
- **API:** `Label`, `Text` (`UILabel` / `NSTextField` with `isEditable = false`)

## Lists and tables — `BASE/lists-and-tables`
Data in one or more columns of rows.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Use:** scannable text. **Don't:** use for items varying widely in size or requiring many images — use a collection.
- Selection feedback differs by purpose: navigation lists **persistently** highlight the selected row; option lists highlight **briefly** then show a confirmation mark (checkmark).
- Keep item text succinct; titles in list, body in detail view. Truncate with a **middle ellipsis** in narrow tables so start and end both stay readable.
- Column headings: nouns / short noun phrases, **title-style** capitalization, no ending punctuation. Single-column tables still need a label or header.
- iOS/iPad/vis: **info button (detail disclosure) ≠ disclosure indicator.** Info button reveals more info only; `UITableViewCell.AccessoryType.disclosureIndicator` means "drills into a subview." Don't put an alphabetic index on a table whose rows carry trailing controls — they fight for the same space.
- macOS: allow column sort (second click reverses) and column resize; use **alternating row colors** in multicolumn tables; hierarchical data → outline view.
- tvOS: focused rows highlight, grow slightly, and round their corners — don't apply your own corner masks.
- watchOS: limit row count; show most-relevant items with a path to more. Vertical page-based detail navigation only when detail views are short enough not to scroll.
- **API:** `List`, `Table`, `ListStyle` (`UITableView`, `UIListContentConfiguration` / `NSTableView`)

## Lockups — `BASE/lockups`
Header + content view + footer combined into one focusable unit. **tvOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | – | – | ✓ | – |

- Four types: **Card** (`TVCardView`, ratings/reviews), **Caption button** (`TVCaptionButtonView`, title+subtitle beneath; tilts with swipe direction), **Monogram** (`TVMonogramContentView`, circular person image, initials fallback — *prefer images over initials*), **Poster** (`TVPosterView`, image + title/subtitle revealed on focus).
- A focused lockup **expands** — leave room between lockups so they don't overlap or displace each other.
- Keep widths and heights consistent within a row or group.
- **API:** `TVLockupView`, `TVLockupHeaderFooterView` (TVUIKit)

## Outline views — `BASE/outline-views`
Hierarchical data in a scrolling list of columns and rows with disclosure triangles.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- Expose hierarchy in the **first column only**; other columns hold attributes.
- Non-hierarchical data → use a table.
- Column headings mandatory in multi-column views; labels for single-column. Sortable (sorting the primary column sorts within each level of the hierarchy). Resizable.
- Option-click a triangle expands all subfolders; plain click expands one. **Persist expansion state** across visits.
- Alternating row colors in wide multicolumn views. Single-click to edit a cell, double-click for a different action (edit filename vs. open file). Truncate with a **centered ellipsis**. Add a toolbar search field for long outlines.
- **API:** `OutlineGroup` (– / `NSOutlineView`)

## Split views — `BASE/split-views`
Multiple adjacent panes; selection in the primary drives the secondary (and tertiary).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ~ | ✓ | ✓ | ~ | ✓ | ✓ |

- **Persistently highlight** the current selection in every pane that leads to a detail view. Support drag and drop between panes.
- **iOS:** prefer split views **only in regular size classes** — a compact environment (portrait iPhone) makes them illegible and hard to hit.
- **iPadOS:** two or three vertical panes; account for narrow, compact and intermediate window widths since iPad windows resize fluidly.
- **macOS:** panes vertical, horizontal, or both. Prefer the **thin divider style (1 pt)** for maximum content area; thicker only when table rows make a thin divider hard to see. Set sensible min/max pane sizes so the divider stays visible. Allow hiding panes and provide **multiple** reveal paths (toolbar button + menu command with keyboard shortcut).
- **tvOS:** default **one-third primary / two-thirds secondary** (half-and-half also acceptable). One title above the whole split view, not per-pane. Center the title for collection secondaries; place it above the primary when the secondary holds a single important item.
- **visionOS:** prefer a split view over opening a new window for supplementary info. Sheets for small requests.
- **watchOS:** shows list **or** detail full-screen. Auto-open the most relevant detail at launch; multiple detail pages go in a vertical tab view driven by the Digital Crown.
- **API:** `NavigationSplitView`, `HSplitView`, `VSplitView` (`UISplitViewController` / `NSSplitViewController`, `NSSplitViewDividerStyle`)

## Tab views — `BASE/tab-views`
Mutually exclusive panes switched by a tabbed control at the top of a content area. **Not a tab bar.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | ✓ (as pages) | – | – |

- **Max 6 tabs.** More than 6 overwhelms and breaks layout — use a pop-up button menu of view options instead.
- Controls inside a pane must affect only that pane.
- Tab labels: nouns/short noun phrases, **title-style** capitalization.
- **Don't** use a pop-up button to switch tabs (2 clicks vs. 1, and hides the choices) unless there are too many panes for tabs.
- Inset the tab view with a margin of window-body area on all sides; extending to window edges is unusual.
- iOS/iPadOS equivalent: **segmented control.** watchOS renders `TabView` as page controls.
- **API:** `TabView` (– / `NSTabView`)

---

# 2. Menus & actions

## Buttons — `BASE/buttons`
Initiates an instantaneous action. Three attributes: **style** (size/color/shape), **content** (symbol, text, or both), **role** (semantic meaning).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Hit region ≥ 44×44 pt** (**≥ 60×60 pt in visionOS**). Always include a press state on custom buttons or they read as unresponsive.
- **Keep prominent buttons to one or two per view.** Distinguish preferred choices by **style, not size** — same-size buttons read as a coherent set.
- Avoid similar colors between button labels and content backgrounds; prefer monochromatic labels over bright content (Liquid Glass).
- Text labels: **title-style** capitalization, start with a verb ("Add to Cart"). Reuse familiar SF Symbols (`square.and.arrow.up` = share).
- **Roles:** Normal · Primary · Cancel · Destructive. Primary responds to Return and enables automatic view dismissal in sheets/alerts/editable views. **Never assign the primary role to a destructive action.**
- **iOS/iPadOS:** configure activity indicators for slow actions; the label can change ("Checkout" → "Checking out…") while the image hides.
- **macOS button types:**
  - *Push button* — text/symbol/icon; can be the default button and be tinted. Append a **trailing ellipsis** when the action opens another window/view/app. Flexible height only for tall/variable content. Supports spring loading.
  - *Square (gradient) button* — symbols/icons only, **no text**; for view-related actions (add/remove rows). Use in views, not window frames or toolbars.
  - *Help button* — circular "?", **max one per window**; lower corner opposite the dismissal buttons in dialogs, lower-left/right in settings. Open context-specific help.
  - *Image button* — image/symbol/icon; use in views, not window frames; **~10 px padding** between image edges and button edges; labels go **below**.
- **visionOS shapes:** icon-only → circle; text-only → rounded rect or capsule; icon+text → capsule. Prefer circular/capsule (easier to fixate). Vertical stacks → rounded rect; horizontal rows → capsule. States: idle, hover, selected, unavailable. Dwell reveals a tooltip on icon-only buttons. **Custom hover effects are not supported.**
- **visionOS sizes:** mini **28 pt** (circular only) · small **32 pt** · regular **44 pt** · large **52 pt** · extra large **64 pt** (circular and text+icon capsule only). Button centers **≥ 60 pt apart**; **4 pt** padding for 60 pt+ buttons. Thin material on glass windows; glass material when floating in space.
- **watchOS:** all inline buttons are capsules with a material effect. Prefer **full-width** buttons for primary actions. Two side-by-side buttons must share the same height and use short text/images. Vertical text stacks use identical heights.
- **API:** `Button` (`UIButton` / `NSButton`)

## Activity views (share sheet) — `BASE/activity-views`
Range of tasks for the current context; sheet or popover.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – (extensions only) | – | – | ✓ |

- Reveal via the **Share button**; people expect system activities there.
- **Don't duplicate common actions** already present — if you need similar functionality, give it a custom title ("Print Transaction", not "Print").
- Custom activity icon: center it in an area of about **70×70 px**; prefer SF Symbols.
- Action titles: single verb or brief verb phrase; **no company or product name**.
- App-specific actions list **before** system/multi-app actions by default; people can edit the list.
- **API:** `ShareLink` (`UIActivityViewController`, `UIActivity` / –)

## Context menus — `BASE/context-menus`
Hidden until revealed: touch/pinch-and-hold (iOS/iPad/vis), Control-click or secondary click (mac/iPad).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | ✓ | ✓ |

- **Every context-menu item must also exist in the main interface** (toolbar, menu bar). Context menus are an accelerator, never the only path.
- Keep them small and only contextually relevant. Provide them **consistently** across the app or people won't look for them.
- **Submenus: one level maximum.**
- **Hide** unavailable items rather than dimming them — exception: Cut/Copy/Paste on macOS may appear unavailable.
- Order by frequency, reading **from the point closest to where the menu was revealed** — reverse the order when the menu opens above the content.
- **Omit keyboard shortcuts** in context menus; show them in main menus only.
- Separators: limit to ~**3 groups**.
- iOS/iPad/vis: put **destructive items last** and mark them `.destructive` (system renders red text). Provide **either a context menu or an edit menu**, not both. The menu can show a **preview** of the target content — match the preview's clipping path to the content's rounded shape so the animation lands cleanly.
- visionOS: use context menus instead of panels/inspectors to avoid extra windows. Don't let a menu exceed the window height — it obscures window-management controls and the Share menu.
- **API:** `View.contextMenu(menuItems:)` (`UIContextMenuInteraction`, `UIMenuElement.Attributes.destructive` / `NSMenu.popUpContextMenu(_:with:for:)`)

## Dock menus — `BASE/dock-menus`
Secondary-click the Dock icon. **macOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- List currently/recently open windows, plus actions useful when the app isn't frontmost or has no windows open (Mail: Get New Mail, New Message).
- Make every custom item available elsewhere too (menu bar / in-app).
- iOS/iPadOS analogue: **Home Screen quick actions.**
- **API:** – (– / `NSApplicationDelegate.applicationDockMenu(_:)`)

## Edit menus — `BASE/edit-menus`
Commands on selected content: Copy, Select, Translate, Look Up. The system auto-detects data types and adds relevant actions (addresses → Get Directions).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | ✓ |

- **iOS:** compact horizontal bar on touch-and-hold or double-tap; a chevron expands to a context menu.
- **iPadOS:** Multi-Touch → horizontal compact style; keyboard/pointer → vertical context menu. **Support both.**
- **visionOS:** pinch-and-hold.
- Prefer the system menu (`UIResponderStandardEditActions`) and system-defined invocation gestures — don't invent custom ones.
- Remove or dim inapplicable commands (no Copy with nothing selected; no Paste with an empty pasteboard).
- Place custom commands **near** the related system commands.
- Let people copy useful non-editable text (captions, status) — but not control labels.
- Support **undo/redo** without a confirmation prompt.
- **Delete ≠ Cut** — Cut writes to the pasteboard first; differentiate the two commands.
- Don't duplicate edit commands with additional on-screen controls.
- **API:** – (`UIEditMenuInteraction` / `NSMenu`)

## Menus (general) — `BASE/menus`
Applies to pop-up buttons, pull-down buttons, context menus, and the menu bar.

- **Labels:** verb or verb phrase for actions; **title-style** capitalization; drop articles (a/an/the); append an **ellipsis (…)** when the command needs more info before it can complete.
- **Dim** unavailable items and keep the menu itself available even when everything in it is unavailable.
- **Icons:** use sparingly and with purpose — common actions (Share, Print, Search), file-system locations and devices, visual concepts (rotate, flip), user-generated content. Don't force an icon where no clear representation exists. **All items in a group get icons, or none do.**
- **Organization:** most important/frequent first; group related items with separators; keep related commands together even when importance differs. Long dynamic content (History, Bookmarks) may scroll.
- **Submenus:** use sparingly; **one level**; consider one when a term repeats in more than two items in a group (use the shared term as the submenu title: "Sort by"). If a submenu would hold **more than ~5** items, make it a separate menu. Prefer submenus to indenting. Keep submenus available even when their items aren't.
- **Toggled items:** changeable labels describing the current state ("Show Map" ↔ "Hide Map"); add a verb when unclear ("Turn HDR On"). Use **checkmarks** for in-effect attributes. Offer a removal item ("Plain") to clear multiple toggled attributes at once.
- **iOS/iPadOS layouts** (`UIMenu.preferredElementSize`):

| Layout | Shape | Use for |
|---|---|---|
| Small | row of **4** symbol-only items on top + list below | tightly related actions with unmistakable symbols (Bold/Italic/Underline/Strikethrough) |
| Medium | row of **3** symbol-over-label items + list below | 3 important frequent actions (Notes: Scan, Lock, Pin) |
| Large (default) | all items in a list | everything else |

- **visionOS:** small or large layouts only. Present menus near the content they control. `presentationBreakthroughEffect()` keeps a menu visible through occluding 3D content — `.automatic` resolves to `.subtle` (preferred); `.prominent` only for whole-scene menus; `.none` fully occludes.
- **API:** `Menu` (`UIMenu` / AppKit Menus)

## Ornaments — `BASE/ornaments`
**visionOS only.** Floats in a plane parallel to the window, slightly in front on the z-axis; moves with the window; unaffected by content scrolling.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | – | – | – | ✓ |

- The system already builds toolbars, tab bars, and video playback controls as ornaments — **don't hand-roll those**; use the system components.
- Keep an ornament **visible** by default; hide only when diving into content (video, photos).
- Keep the ornament's width **≤ the window's width** — wider ornaments interfere with tab bars and side content.
- Limit the total number; prefer visual balance and move elements back into the window rather than adding ornaments.
- Prefer **borderless** buttons (the glass background supplies the container; the system applies hover effects automatically).
- **API:** `View.ornament(visibility:attachmentAnchor:contentAlignment:ornament:)`

## Pop-up buttons — `BASE/pop-up-buttons`
Menu of **mutually exclusive options**; button content updates to show the current selection.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | ✓ |

- **Use for:** a flat list of mutually exclusive options/states. **Use a pull-down button instead** for a list of actions, multiple selection, or when you need a submenu.
- Provide a useful **default selection** — the item most people will want.
- Give context with an introductory label or a descriptive button label so people can predict the options without opening the menu.
- Include a **Custom** option (plus explanatory text below) to avoid cluttering the UI with rarely used items.
- iPadOS: inside a popover or modal, prefer a pop-up button over a disclosure indicator for a list item's options — avoids a detail-view round trip.
- **API:** `Picker` + `.pickerStyle(.menu)` / `MenuPickerStyle` (`UIButton.changesSelectionAsPrimaryAction` / `NSPopUpButton`)

## Pull-down buttons — `BASE/pull-down-buttons`
Menu of items/actions that relate to the button's purpose (Add ▾, Sort ▾, Back ▾).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | ✓ |

- **List a minimum of 3 items** — with one or two, use plain buttons or toggles instead. Don't list so many that scanning slows down.
- **Don't bury a view's primary actions** in a pull-down; they must stay discoverable.
- Show a menu title only if it adds meaning.
- Destructive items render in red; confirm intent with an **action sheet (iOS)** or **popover (iPadOS)**.
- iOS/iPadOS: a **More** button trades discoverability for space — weigh that consciously.
- **API:** `Menu` (`UIControl.showsMenuAsPrimaryAction` / `NSPopUpButton.pullsDown`)

## Toolbars (incl. iOS/iPadOS navigation bars) — `BASE/toolbars`
Sets of controls along the top or bottom edge: current view **title**, **navigation** controls (back, forward, search), and **actions**. A toolbar acts on content; a tab bar navigates app sections.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Three placement regions:**

| Region | Contents | Customizable | Overflow behavior |
|---|---|---|---|
| Leading edge | back button, sidebar toggle, view title, document menu (Duplicate/Rename/Move/Export) | **No** — always available | never collapses |
| Center | common controls, title (if not leading) | Yes (mac/iPadOS) | collapses into overflow menu as the window narrows |
| Trailing edge | must-stay-available items, inspector buttons, search field, More menu, **primary action (Done)** | partly | remains visible at all window sizes |

- **Window title ≤ ~15 characters** (one word or short phrase) to leave room for controls. **Never title a window with your app name.** Leaving a title empty is fine when redundant.
- Use the **standard Back and Close buttons** — standard symbols, no "Back"/"Close" text. Custom versions must look and behave identically.
- Prefer **system symbols without borders** (the section supplies the container). Use text only where a symbol can't carry the meaning ("Edit").
- **`.prominent` style for the key action (Done, Submit) — only one primary action, on the trailing side.**
- **Group logically; aim for a maximum of 3 groups.** Keep navigation and critical actions (Done/Close/Save) in their own visually distinct section. Keep placement consistent across platforms.
- Don't mix text-labeled and symbol actions adjacently — separate them (`UIBarButtonItem.SystemItem.fixedSpace`).
- Don't add an overflow menu manually; the system adds one on macOS/iPadOS. Don't design a layout that overflows by default. Define which items go to overflow first.
- Reduce toolbar backgrounds and tinted controls; let the content layer inform the appearance; use `ScrollEdgeEffectStyle` when separation is needed.
- **iOS:** prioritize only the most important items; use a More menu for the rest. Large title transitions to standard on scroll and back at the top (`UINavigationBar.prefersLargeTitles`).
- **iPadOS:** toolbar and tab bar can share the top horizontal band.
- **macOS:** **every toolbar item must also exist as a menu bar command** — the toolbar is customizable and hideable.
- **visionOS:** system toolbar appears along the **bottom edge**, above window-management controls, in a parallel plane in front of the window; uses variable blur. Supply a symbol or text label; looking at a symbol reveals its label. **Never build a vertical toolbar** (tab bars are vertical). Don't let windows resize narrower than the toolbar — there's no menu bar fallback. Avoid pull-down menus in the toolbar; they can obscure the window controls below.
- **watchOS:** placements `topBarLeading`, `topBarTrailing`, `bottomBar`; buttons stay visible as content scrolls beneath. A **scrolling toolbar button** (placement `primaryAction`) stays hidden until revealed by scrolling up — use it for an important action that isn't a primary app function (Mail's New Message at the top of Inbox).
- **API:** `.toolbar { ToolbarItem(placement:) }` (`UIToolbar`, `UINavigationBar`, `UIBarButtonItem` / `NSToolbar`)

---

# 3. Navigation & search

## Tab bars — `BASE/tab-bars`
Navigate between **top-level sections**. Not for actions.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – | – | ✓ | ✓ |

- **Navigation only.** Controls that act on the current view belong in a toolbar.
- **Keep the tab bar visible** as people navigate within a section; only modal views may cover it.
- **Never disable or hide a tab bar button**, even when its content is unavailable — explain the unavailability instead.
- **Avoid overflow.** When horizontal space runs out on iOS/iPadOS the trailing tab becomes a **More** tab and the remainder move into a list — harder to reach and to notice. **Aim for 5 or fewer default tabs** (stated for iPadOS, and it preserves continuity between compact and regular widths).
- Always include labels — single words where possible. Prefer **filled** SF Symbols.
- Badges (red oval, white number or "!") are for **critical** information only.
- Avoid similar colors between tab labels and content backgrounds; prefer monochromatic tab bars over bright content.
- **iOS:** floats above content at the bottom on Liquid Glass. With an attached accessory (Music MiniPlayer), the bar can minimize and move the accessory inline on scroll-down (`TabBarMinimizeBehavior` / `UITabBarController.MinimizeBehavior`). May include a dedicated **search tab at the trailing end**.
- **iPadOS:** near the top; can be fixed or convertible to a sidebar (`TabViewStyle.tabBarOnly`, `TabViewStyle.sidebarAdaptable`). Let people customize which items appear (`TabViewCustomization`, `UITab.Placement`). For a sidebar with no conversion option, use `NavigationSplitView` instead.
- **tvOS:** height **68 pt**, top edge **46 pt** from the top of the screen, both fixed. Translucent except the selected tab, which is opaque and gains a drop shadow when focused. Rightmost item truncates with a fade when items exceed the width. The bar scrolls offscreen by default when the tab holds a single main view; it stays pinned in split views. Menu returns focus to the bar. Live-viewing apps order tabs: live → Cloud DVR/recorded → other.
- **visionOS:** always **vertical**, floating fixed at the window's leading side; expands when looked at. Supply a symbol (always visible) **and** a short text label (revealed on gaze). For deep hierarchies, put a sidebar inside a tab — sidebar selections must not change the open tab.
- **API:** `TabView`, `Tab`, `TabViewBottomAccessoryPlacement` (`UITabBar`, `UITabBarController` / –)

## Sidebars — `BASE/sidebars`
Leading-side navigation among app areas or top-level collections (folders, playlists).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | ✓ | ✓ |

- Sidebars need lots of vertical **and** horizontal space. When space is tight, a tab bar navigates better. **Consider a tab bar first on iPadOS** — more content space, enough flexibility for main areas.
- **Show no more than two levels of hierarchy.** Deeper → split view with a content list between sidebar and detail.
- Let people **customize** contents and order, and **hide** the sidebar (edge swipe on iPadOS; show/hide button or View menu on macOS). Group with disclosure controls.
- Extend visually rich content beneath the floating sidebar via horizontal scroll or `View.backgroundExtensionEffect()`.
- Icons default to the app accent color (macOS: the system accent the person chose). Use fixed colors sparingly and only to clarify meaning (Mail's yellow VIP).
- Short, descriptive group titles; drop unnecessary words. Prefer SF Symbols; custom **symbols**, not bitmaps.
- **macOS:** row height/text/glyph size follows the small/medium/large setting (General settings or programmatic). Consider auto-hiding on resize. **Don't put critical info or actions at the bottom** — people relocate windows over the bottom edge.
- **visionOS:** windows usually expand to fit a sidebar, so hiding is rarely needed. A sidebar inside a tab is the pattern for secondary navigation.
- **API:** `TabViewStyle.sidebarAdaptable`, `NavigationSplitView`, `ListStyle.sidebar` (`UISplitViewController`, `UICollectionLayoutListConfiguration.Appearance.sidebar` / `NSSplitViewController`)

## Search fields — `BASE/search-fields`
Editable field with Search icon, Clear button, placeholder; optionally a **scope bar** and **tokens**.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- Start searching **as people type**; show recent searches before typing and suggestions during.
- Most relevant results first; minimize scrolling; categorize when it helps.
- **Scope bar:** filter among clearly defined categories; **default to the broader scope** and let people narrow. **Tokens:** visual, selectable representations of a search term used as a filter; pair with suggestions so people learn which tokens exist.
- **iOS placement — three patterns:**

| Pattern | Behavior | Use when |
|---|---|---|
| Search **as a tab**, standard style | navigates to a search landing page, field at top | you provide suggestions, categories, browsable rich content (Apple TV) |
| Search **as a tab**, button appearance | focuses the field and raises the keyboard immediately; returns to the previous tab on exit | people need fast resolution |
| Search **in a toolbar** (bottom) | expanded field or button; animates into a field above the keyboard | search is a priority and should stay reachable (Settings, Mail, Notes) |
| Search **in a toolbar** (top / nav bar) | button that animates into a field above the keyboard or at the top | you must defer to bottom content, or there's no bottom toolbar (Wallet) |
| **Inline** field | sits with the content it filters | multiple search fields in one view; pin it when scrolling |

- **iPadOS + macOS** (keep these consistent if you ship both): search field at the **trailing side of the toolbar** for the common case; **top of the sidebar** when it filters sidebar navigation; a **sidebar/tab-bar item** for a dedicated discovery area. Focus the field immediately on entering a dedicated search area — **except** on iPad with only a virtual keyboard, where the keyboard would cover the view. Account for fluid window resizing; in compact widths, put search above the content list column.
- **tvOS:** a *search screen* = keyboard + results beneath. Minimize typing — offer popular, contextual, and recent suggestions.
- **watchOS:** tapping the field opens a full-screen text-input control; the app returns to the field only on Cancel or Search.
- **API:** `.searchable(text:placement:prompt:)`, `.searchScopes` (`UISearchBar`, `UISearchController`, `UISearchTextField` / `NSSearchField`)

## Path controls — `BASE/path-controls`
File-system path of a selected item. **macOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- **Standard style:** linear list (root disk → parents → item), icon + name each; hides intermediate names when too long. **Pop-up style:** like a pop-up button showing the selected item; the menu holds the path (plus a **Choose** command when editable).
- **Use in the window body, not the window frame** — not for toolbars or status bars. (Finder's path bar sits at the bottom of the body, not in the status bar.)
- Editable controls accept a dragged item to select it.
- **API:** – (– / `NSPathControl`)

## Token fields — `BASE/token-fields`
Text field that converts text into selectable, draggable tokens (Mail address fields). **macOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- Default conversion trigger is a **comma**; you can add more (Return).
- Give tokens a **context menu** (edit name, mark VIP, show contact card).
- Suggestions appear immediately by default — consider adding a delay so they don't distract while typing.
- **API:** – (– / `NSTokenField`)

---

# 4. Presentation

## Alerts — `BASE/alerts`
Critical information needed right away.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Anatomy:** required title, optional informative text, **up to 3 buttons**. Text field on iOS/iPadOS/macOS/visionOS. Icon + accessory view on macOS/visionOS. Suppression checkbox and Help button on macOS only.
- **Use sparingly.** No informational-only alerts. No alerts for common, undoable destructive actions (deleting an email you can undo) — reserve them for uncommon, irreversible destruction. **No alerts at app startup**; show cached/placeholder data with a non-intrusive label instead.
- **Title ≤ 2 lines.** Sentence-style capitalization with punctuation if it's a complete sentence; title-style with no punctuation if it's a fragment. Informative text only when it adds value; complete sentences, sentence case, proper punctuation.
- **Don't explain the buttons** in the alert text.
- **Button titles:** one or two words, verb or verb phrase tied to the alert text ("View All", "Reply", "Ignore"). Title-style capitalization, no ending punctuation. **"OK" only for purely informational alerts.** **Never "Yes"/"No".** Cancellation is always **"Cancel"**.
- **Avoid OK as the default** — ambiguous. Use "Erase", "Convert", "Clear", "Delete".
- **Button placement:**

| Layout | Default / most likely | Cancel |
|---|---|---|
| Row (horizontal) | **trailing side** | **leading side** |
| Stack (vertical) | **top** | **bottom** |

- **Destructive:** use the destructive style only for *unintentional* destruction — skip it when the person deliberately chose the action (Empty Trash). Always include a Cancel button alongside a destructive action.
- Alternative cancel paths people expect: Home Screen exit (iOS/iPadOS), **Esc** or **⌘.** (iOS/iPadOS/macOS/visionOS), **Menu** on the remote (tvOS).
- **iOS/iPadOS:** for choices tied to an *intentional* action, use an **action sheet**, not an alert. Keep titles/messages short enough to avoid scrolling.
- **macOS:** app icon shows automatically; you may supply an alternate. Add a suppression checkbox for repeating alerts. Accessory views via `NSAlert.accessoryView`. Use caution symbols (`exclamationmark.triangle`) **sparingly** — only for genuine data-loss risk, never for intentional data tasks (save, empty trash).
- **visionOS:** in the Shared Space the alert appears in front of the app window along z and stays anchored to it; in a Full Space it centers in the field of view. Accessory view **max 154 pt height, 16 pt corner radius**.
- **API:** `.alert(_:isPresented:actions:)` (`UIAlertController` / `NSAlert`)

## Action sheets — `BASE/action-sheets`
Modal view presenting choices related to an action the person initiated.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | – |

- **Action sheet vs. alert:** action sheet = multiple choices tied to a deliberate action (Mail: delete draft / save draft on cancel). Alert = confirm or cancel, without extra choices.
- Keep titles to **one line**; provide a message only when necessary.
- Include **Cancel** for data-destructive actions — at the **bottom** (upper-left on watchOS). SwiftUI confirmation dialogs add Cancel by default.
- Put **destructive choices at the top** with the destructive style (`ButtonRole.destructive` / `UIAlertAction.Style.destructive`).
- iOS/iPadOS: use an action sheet, not a menu, for action-related choices. **Don't let it scroll** — more decision time and more accidental taps.
- watchOS: **max 4 buttons including Cancel** — aim for ≤3 additional choices.
- **API:** `.confirmationDialog(_:isPresented:titleVisibility:actions:)` (`UIAlertController.Style.actionSheet` / –)

## Sheets — `BASE/sheets`
Scoped task closely related to the current context.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Modality:** always modal on macOS/tvOS/visionOS/watchOS. iOS/iPadOS sheets can be **nonmodal** (Notes formatting sheet affects the parent while open).
- **One sheet at a time** from the main interface. Close the first before showing a second.
- **Always pair Done with Cancel or Back** — never leave Done as the only exit. **Never show all three** (Cancel + Done + Back) at once. Back navigates a step; it is not a dismissal.
- Support **swipe to dismiss** on iOS/iPadOS.
- For complex or prolonged flows, use something else: full-screen modal (`UIModalPresentationStyle.fullScreen`), a new window or full-screen mode on macOS, or a Full Space transition on visionOS.
- **iOS/iPadOS button placement:**

| Step | Leading | Trailing |
|---|---|---|
| Single view | Cancel | Done |
| Multi-step, first step | Cancel | Done (inactive) |
| Multi-step, middle steps | Back | Done (inactive) |
| Multi-step, final step | Back | Done (active) |

- **Detents:** **Large** (fully expanded, supported automatically) and **Medium** (~half the fully expanded height). Specifying only medium prevents full expansion. Use medium for progressive disclosure (share sheet). **Don't** use medium when the content is more useful full height (Messages/Mail compose).
- Include a **grabber** on a resizable sheet (`UISheetPresentationController.prefersGrabberVisible`) — it signals draggability, cycles detents on tap, and works with VoiceOver.
- Prefer **page or form** presentation styles on iPadOS.
- **macOS:** card-like view with rounded corners over a dimmed parent; other app windows stay interactive. Give it a reasonable default size and support resizing. If people need to repeatedly provide input and observe results, use a **panel** instead.
- **visionOS:** floats in front of a dimmed parent. **Don't emerge it from the bottom edge** — center it in the field of view. Default size should preserve context; avoid covering most of the window. Consider a split view for supplementary items.
- **watchOS:** full-screen slide-over, semitransparent with blurred, desaturated background. Use only when a modal task needs a custom title or content presentation; keep interactions brief. Prefer alerts/action sheets for important information or choices. Avoid making it look like hierarchical navigation or like a page/app title.
- **API:** `.sheet(item:onDismiss:content:)`, `.presentationDetents([.medium, .large])` (`UISheetPresentationController`, `.detents` / `NSViewController.presentAsSheet(_:)`)

## Popovers — `BASE/popovers`
Transient view above other content, anchored to a control with an arrow.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ~ | ✓ | ✓ | – | – | ✓ |

- Small amounts of information or a few related tasks only.
- Arrow must point directly at the triggering element, must not cover it, and must not obscure essential content.
- Add Close/Cancel/Done **only** when confirmation matters (saving vs. discarding). Otherwise popovers dismiss on outside click or item selection.
- **Save work when a nonmodal popover auto-closes**; discard only on an explicit Cancel.
- **One popover at a time — never cascade.** Only **alerts** may appear above a popover. Allow single-click close-and-open transitions.
- Size to content; animate size changes between condensed and expanded states.
- **Don't use popovers for warnings** — they can be missed or dismissed accidentally; use an alert.
- Don't say "popover" in user-facing text.
- **iOS/iPadOS: avoid popovers in compact views** — use a full-screen modal sheet; reserve popovers for wide views.
- **macOS:** popovers can be **detachable** into a panel when dragged; keep appearance changes minimal so context survives.
- **API:** `.popover(isPresented:attachmentAnchor:arrowEdge:content:)` (`UIPopoverPresentationController` / `NSPopover`)

## Panels — `BASE/panels`
Floating supplementary controls/info above other windows. **macOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- **Use for:** quick access to controls affecting the active window's selection; **inspector** functionality (contents update as selection changes).
- **Inspector vs. Info window:** an inspector follows the selection → panel. An Info window keeps its contents when the selection changes → **regular window**, not a panel. A split-view pane is also a valid inspector container.
- Prefer **simple adjustment controls** (sliders, steppers). Avoid controls requiring typing or item selection.
- Title: noun/noun phrase, title-style capitalization ("Fonts", "Colors", "Inspector"). Refer to panels by title **without the word "panel"** ("Show Fonts"); help docs may say "Fonts window".
- Bring all panels forward when the app activates; **hide them when the app is inactive**. Don't list panels in the Window menu's documents list. Generally **disable the minimize button**.
- **HUD panels** (dark, translucent): only in media-oriented apps, or when a standard panel would obscure essential content, or when you need no controls (most system controls don't match the HUD look). Keep a single panel style across mode changes. Use color sparingly and keep HUDs small.
- **API:** – (– / `NSPanel`, `NSWindow.StyleMask.hudWindow`)

## Page controls — `BASE/page-controls`
Row of indicator dots for an ordered, flat list of pages.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – | ✓ | ✓ | ~ (non-interactive) |

- **Ordered navigation only** — never hierarchical or nonsequential relationships.
- **Horizontally centered near the bottom** of the view.
- **Don't exceed ~10 dots** — beyond that, people can't count them at a glance; use a grid layout that allows any-order navigation.
- Custom indicator images: simple and clear; no complex shapes, negative space, text, or inner lines. **No more than 2 different indicator images** in one control. **Don't color indicator images** — let the system color them.
- **iOS/iPadOS:** tap the leading/trailing side of the current dot to page; drag to **scrub**. `UIPageControl.InteractionState` distinguishes discrete (tap) from continuous (scrub). **Don't animate during scrubbing** — pages scroll fast and animations lag and flash; animate on tap only.
- Background styles (`UIPageControl.backgroundStyle`): **automatic** (visible during interaction; for non-primary navigation), **prominent** (always visible; primary navigational control), **minimal** (never visible). **Don't offer scrubbing with the minimal style** — no scrub feedback.
- **tvOS:** full-screen page collections only; extra controls interfere with focus during transitions.
- **watchOS:** horizontal at the bottom for horizontal pagination; next to the Digital Crown for vertical tab views. Prefer **vertical pagination** for distinct, purposeful pages. Limit page content to a **single screen height**; use variable-height pages sparingly and only after fixed-height ones.
- **API:** `TabView` + `.tabViewStyle(.page)` / `PageTabViewStyle` (`UIPageControl` / –)

## Scroll views — `BASE/scroll-views`
No appearance of their own; show a translucent scroll indicator once scrolling begins.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- Support default scrolling gestures and keyboard shortcuts; custom indicators must keep elastic behavior.
- **Make scrollability apparent** by showing partial content at the edges — indicators aren't always visible.
- **Never nest scroll views of the same orientation.** Horizontal inside vertical (or vice versa) is fine.
- Auto-scroll when: the app selects content or places an insertion point offscreen; input lands offscreen; the pointer passes the view edge during selection; before acting on a selection. Scroll **only as much as necessary** to keep context.
- **Scroll edge effects** (iOS/iPadOS/macOS) separate floating bars from scrolling content. Prefer `ScrollEdgeEffectStyle.automatic`. They're functional, not decorative — only behind floating elements. **One per view**; in split layouts each pane gets its own at a consistent height.
- **macOS:** the indicator is a "scroll bar"; use small/mini in tight panels, consistently sized.
- **tvOS:** scrolls automatically without distinct indicators; the system keeps the focused item visible.
- **visionOS:** small, fixed-size indicator — vertically centered at the trailing edge (vertical scroll) or horizontally centered at the bottom (horizontal). Gaze + drag engages a tick-mark **jog bar**. **Look to Scroll** (`ScrollInputKind.look`): support it in reading/browsing views; avoid it in UI-dense or control areas; be consistent across similar views; prefer full-width/height scroll areas; **remove custom parallax/scroll animations** — they break Look to Scroll.
- **watchOS:** prefer **vertical** scrolling (Digital Crown). Use tab views for page-by-page. Limit pages to a single screen height where possible.
- **API:** `ScrollView`, `PagingScrollTargetBehavior`, `ScrollEdgeEffectStyle` (`UIScrollView`, `UIScrollEdgeEffect.Style` / `NSScrollView`, `NSScrollEdgeEffectStyle`)

## Windows — `BASE/windows`
Primary (main navigation + content) vs. auxiliary (one dedicated task, includes a close button).

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | ✓ | ✓ | – | – | ✓ |

- Adapt fluidly to size. Open a new window when it helps multitasking or preserves context (Mail Compose) — not as a default behavior.
- Offer "open in new window" via context menu or File menu (`OpenWindowAction`).
- **Don't build custom window chrome.** In user-facing text say **"window"**, never "scene".
- **iPadOS:** full-screen mode or windowed mode (resizable, positions remembered across launches). Ensure **window controls don't hide leading-edge toolbar buttons** — move buttons inward when controls appear. Consider pinch-to-expand-into-new-window (`UIWindowSceneActivationInteraction`; `collectionView:sceneActivationConfigurationForItemAtIndexPath:point:` for collection views). Single-file viewers can use `QLPreviewSceneActivationConfiguration` but must still support multiple windows.
- **macOS states:** **main** (frontmost; one per app), **key** (accepts input; one onscreen — colored traffic lights + vibrancy), **inactive** (gray buttons, no vibrancy). Use system appearances so state changes are visible. **Avoid critical info in the bottom bar** — people cover window bottoms; reserve it for small status (Finder's item count / disk space). Use an inspector (trailing split-view pane) for extra info.
- **visionOS:** default window **1280×720 pt**, placed **~2 m** in front of the wearer (~3 m apparent width), dynamically scaled. **Keep the glass background** — removing it reduces legibility and coherence. Minimize empty area; match initial shape to content proportions; set min and max sizes. **Minimize 3D depth inside windows** — the system clips content extending far from the surface; use a **volume** for real depth. `PlainWindowStyle` drops the glass.
- **visionOS volumes** (`VolumetricWindowStyle`): for rich 3D content, not UI-centric interfaces. Pin 2D content with attachments so it reads from multiple angles. Prefer **dynamic scaling** for legibility at distance; **fixed scaling** (default) when representing real-world objects at true size. visionOS 2+: keep the default baseplate glow (disable only for full-bleed or custom baseplates); a volume may carry **one** ornament in addition to toolbar/tab bar — use attachment anchors (`topBack`, `bottomFront`) and avoid the edge that already holds a bar.
- **API:** `WindowGroup`, `DefaultWindowStyle`, `PlainWindowStyle`, `VolumetricWindowStyle`, `OpenWindowAction` (`UIWindow` / `NSWindow`)

---

# 5. Selection & input

| Component | iOS | iPad | mac | watch | tv | vis | SwiftUI | UIKit | AppKit |
|---|---|---|---|---|---|---|---|---|---|
| Color well | ✓ | ✓ | ✓ | – | – | ✓ | `ColorPicker` | `UIColorWell`, `UIColorPickerViewController` | `NSColorWell` |
| Combo box | – | – | ✓ | – | – | – | – | – | `NSComboBox` |
| Digit entry view | – | – | – | – | ✓ | – | – | `TVDigitEntryViewController` (TVUIKit) | – |
| Image well | – | – | ✓ | – | – | – | – | – | `NSImageView` (editable) |
| Picker | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `Picker`, `DatePicker` | `UIPickerView`, `UIDatePicker` | `NSDatePicker` |
| Segmented control | ✓ | ✓ | ✓ | – | ✓ | ✓ | `.pickerStyle(.segmented)` | `UISegmentedControl` | `NSSegmentedControl` |
| Slider | ✓ | ✓ | ✓ | ✓ | – | ✓ | `Slider` | `UISlider` | `NSSlider` |
| Stepper | ✓ | ✓ | ✓ | – | – | ✓ | `Stepper` | `UIStepper` | `NSStepper` |
| Text field | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `TextField`, `SecureField` | `UITextField` | `NSTextField` |
| Text view | ✓ | ✓ | ✓ | ✓ | ~ | ✓ | `TextEditor` / `Text` | `UITextView` | `NSTextView` |
| Toggle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `Toggle`, `ToggleStyle` | `UISwitch` | `NSSwitch`, `NSButton` |

## Color wells — `BASE/color-wells`
- Prefer the **system color picker** — consistent across apps and it carries the person's saved color set between apps and platforms.
- macOS: clicking highlights the well, then opens the picker; the well updates to the chosen color. Supports **drag and drop** between wells and from the picker.

## Combo boxes — `BASE/combo-boxes`
Text field + pull-down button. **macOS only.** A custom typed value is **not** added to the list.
- Populate with a **meaningful default** drawn from the list (need not be the first item).
- Introductory label: title-style capitalization, ending with a colon.
- **List items must not be wider than the text field** — the field truncates them.

## Digit entry views — `BASE/digit-entry-views`
Full-screen digit entry (PIN) with a digit-specific keyboard, optional title and prompt. **tvOS only.**
- Use **secure digit fields** (asterisks) for sensitive data. State clearly why digits are needed.

## Image wells — `BASE/image-wells`
Editable image view. **macOS only.**
- Revert to the default image when a required well is cleared.
- If copy/paste is supported, the standard Edit menu items and keyboard shortcuts must work.

## Pickers — `BASE/pickers`
One or more scrollable lists of distinct values.
- **Use for medium-to-long lists.** Short list → pull-down button. Very large set → list/table (adjustable height plus an index for faster targeting).
- Values must be **predictable and logically ordered** so people can anticipate hidden entries.
- **Don't switch views to show a picker** — present it near the field being edited, typically at the bottom of the window or in a popover.
- **Date picker minute granularity:** default is 60 values (0–59). You may increase the interval as long as it **divides evenly into 60** (0/15/30/45).
- **iOS/iPadOS date picker styles:** compact (button → modal editor; use when space is constrained), inline (wheels for time; calendar view for dates), wheels, automatic. **Modes:** date, time, date-and-time, **countdown timer (max 23 h 59 m; unavailable in inline and compact styles)**.
- **macOS styles:** textual (limited space, specific values) and graphical (browsing days, date ranges, clock face).
- **watchOS:** wheels style navigated by the Digital Crown; optional outline, caption, scroll indicator. For long lists use `PickerStyle.navigationLink` — a button that opens the list, scrubbable with the Crown without tapping.

## Segmented controls — `BASE/segmented-controls`
Linear set of 2+ equal-width segments; single choice (multiple choice also on macOS); can act as momentary action buttons with no selection state.
- **≤ 5–7 segments in a wide interface; ≤ 5 on iPhone.**
- **Don't mix modes:** no actions inside a control that shows selection state, and no selection state on action segments.
- **Don't mix text and images** in one control. Keep content of similar size so equal widths look balanced. Labels: nouns/noun phrases, title-style capitalization; no introductory text needed when segments are text.
- **iOS/iPadOS:** good for switching closely related **subviews** (Calendar's New Event sheet: event vs. reminder). Completely separate app sections → **tab bar**.
- **macOS:** add introductory text and labels below symbol segments; provide tooltips. **Use a tab view, not a segmented control, to switch views in the main window area** — segmented controls belong in toolbars and inspectors. Supports spring loading with a Magic Trackpad.
- **tvOS:** segments select when focus **moves** to them, not on click — don't place other focusable elements close by. Consider a split view for filtering screens.
- **visionOS:** gaze on an icon segment reveals the descriptive tooltip you supply.
- Momentary/action mode: `UISegmentedControl.isMomentary`, `NSSegmentedControl.SwitchTracking.momentary`.

## Sliders — `BASE/sliders`
Track + thumb between min and max; fill from min to thumb.
- Minimum **leading**, maximum **trailing** (horizontal); minimum **bottom**, maximum **top** (vertical).
- Pair with a text field (and a stepper) for wide ranges so people can read and enter exact values.
- **iOS/iPadOS: never build your own audio volume slider** — use a volume view, which also carries the output-device control.
- **macOS:** linear (lozenge thumb, filled track, optional end icons) vs. circular (small circle thumb, evenly spaced dot tick marks). **Horizontal for fixed endpoints** (0–100% opacity); **circular for repeating/indefinite values** (0–360° rotation, spin counts). Add tick marks for accuracy, labels on tick marks for clarity (at minimum label min and max), and a tooltip showing the thumb value on hover. Give live feedback as the value changes. Label: sentence-style capitalization ending with a colon.
- **visionOS:** prefer horizontal — side-to-side gestures beat up-and-down.
- **watchOS:** discrete steps or a continuous bar; side buttons increment/decrement by a fixed amount; system shows plus/minus glyphs by default — supply custom glyphs if they communicate better.

## Steppers — `BASE/steppers`
Two-segment increment/decrement. **The stepper itself displays no value** — it sits next to a field that does.
- Make the affected value obvious. Pair with a text field when values vary widely (print copies).
- macOS: support **Shift-click** for a larger jump (e.g. 10× the default increment) over large ranges.

## Text fields — `BASE/text-fields`
Small, specific pieces of text.
- Small amounts only — larger input → text view.
- Placeholder text ("Email", "Password") communicates purpose, but **also supply a separate label** since the placeholder disappears on typing.
- **Always use a secure field for passwords/private data** (`SecureField`).
- **Size the field to the anticipated quantity of text** — it's a visual cue about how much to enter. Space multiple fields evenly, stack vertically, use consistent widths per category (name fields one width, address fields another).
- Ensure a logical tab order. Validate contextually — email on field switch, username/password before switching.
- Use **number formatters** for numeric input (decimals, percentages, currency; locale-dependent).
- Line breaks: default clips; alternatives are character/word wrap or truncation at beginning, middle, or end. macOS/visionOS: show an **expansion tooltip** for clipped text on hover.
- Show a keyboard type matching the content (iOS/iPadOS/tvOS/visionOS). Minimize text entry on tvOS/watchOS — prefer buttons and option lists.
- iOS/iPadOS: include a **Clear button** at the trailing end. Leading end = purpose indicator; trailing end = additional features.

## Text views — `BASE/text-views`
Multiline styled, optionally editable text; any height, scrolls when content overflows. Leading-aligned, system label color by default.
- Use when text is long, editable, or specially formatted. Small text → label; small editable text → text field.
- Adopt **Dynamic Type**; test with accessibility options (bold text) on.
- Make useful values selectable/copyable.
- tvOS uses text **fields** for editable text because text input is minimal by design.

## Toggles — `BASE/toggles`
Two opposing states with a different appearance for each. Styles: **switch**, **checkbox**, **radio button**, and buttons that behave like toggles.
- Toggles manage **state**. For choosing from a list, use a pop-up button.
- **Don't rely on color alone** to communicate state — add/remove fill, show/hide a background shape, or change inner detail (checkmark, dot).
- **iOS/iPadOS:** use the **switch style only in a list row** — the row content supplies the label, so no separate label is needed. Default green works in most cases; change only if necessary, with sufficient contrast. **Outside a list, use a button that behaves like a toggle** (`UIButton.changesSelectionAsPrimaryAction`), not a switch — icon plus alternate background, no label.
- **macOS:**

| Style | States | Use when | API |
|---|---|---|---|
| Switch | on / off | settings you want to **emphasize** (more visual weight; controls more functionality) | `ToggleStyle.switch`, `NSSwitch` |
| Checkbox | on (blue fill + white checkmark) / off (no fill) / **mixed** (blue fill + white hyphen) | **hierarchies** of settings — alignment and indentation show dependencies; a parent checkbox goes mixed when children differ | `NSButton.ButtonType.toggle`, `allowsMixedState` |
| Radio button | selected (white dot on dark fill) / deselected (empty circle) | **mutually exclusive** choices, typically **2–5** | `NSButton` radio type |

  - **Avoid more than ~5 radio buttons** — use a pop-up button. For a single on/off setting prefer a **checkbox over a lone radio button**.
  - Use consistent horizontal spacing based on the longest label.
  - **Mini switches** keep row heights consistent in grouped forms; regular switches for primary settings, mini for subordinate ones (`GroupedFormStyle`, `ControlSize`).
  - **Don't replace existing checkboxes with switches** in an established interface.
  - Place toggles in the **window body**, not the toolbar or status bar.
  - macOS switches need a label describing what they control.

## Virtual keyboards — `BASE/virtual-keyboards`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – | ~ | ✓ | ✓ |

- Specify **semantic meaning** for input areas so the system supplies the right keyboard and refines autocorrection: `keyboardType(_:)` + `textContentType(_:)` (`UIKeyboardType`, `UITextContentType`).
- Types: ASCII capable · ASCII capable number pad · decimal pad · default · email address (`@`, `.`, `.com`) · name phone pad · number pad · numbers and punctuation (10 numbers + 15 punctuation marks) · phone pad (`+`, `*`, `#`) · Twitter (`@`, `#`) · URL (`.`, `/`, `.com`) · web search (Go key).
- Customize the Return key to the action: `submitLabel(_:)` / `UIReturnKeyType`.
- **Virtual keyboards don't support keyboard shortcuts.**
- **Custom input view** (replaces the keyboard inside your app only): make the substitution contextually obvious; play the standard click via `UIDevice.playInputClick()`.
- **Custom keyboard extension** (iOS/iPadOS/tvOS, systemwide): must provide an obvious **Globe** switching affordance; don't duplicate the system Emoji/Globe/Dictation keys; ship an in-app tutorial; **only build one for genuinely novel input methods or unsupported languages** — otherwise use a custom input view. Custom keyboards never appear in secure text fields or phone number fields.
- **iOS/iPadOS:** use the **keyboard layout guide** (`UIKeyboardLayoutGuide`) to keep important UI visible. Input accessory views above the keyboard (`UIResponder.inputAccessoryView` / `ToolbarItemPlacement`) must be relevant to the current task.
- **tvOS:** linear keyboard with the Siri Remote; grid keyboard with other devices; digit-specific keyboard for PINs.
- **visionOS:** system keyboard appears in its own **movable window** — no layout accommodation needed.
- **watchOS:** keyboard only on large screens; otherwise Dictation or Scribble, or text entry from a paired iPhone. **Keyboard type can't be changed**, but `textContentType(_:)` still applies.

---

# 6. Status

## Activity rings — `BASE/activity-rings`
Move / Exercise / Stand progress.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – | ✓ | – | – |

- watchOS always shows **three** rings. iOS shows **three** when an Apple Watch is paired, **Move only** when not.
- **Only** for Move/Exercise/Stand, **only** for a **single person** (label with a name, photo, or avatar). Never replicate or modify the rings for other data; never show Move/Exercise/Stand in some other ring-like element.
- **Appearance is fixed:** never change ring colors (no filters, no opacity changes); always on a **black background**; prefer enclosing rings + background in a circle by adjusting the container's **corner radius** rather than applying a circular mask; keep black visible around the outermost ring (add a thin black stroke if needed); no gradients, shadows, or effects; scale proportionally. **Design the surrounding UI to fit the rings — never the reverse.**
- Associated label/value colors (RGB): **Move 250, 17, 79** · **Exercise 166, 255, 0** · **Stand 0, 255, 246**.
- **Minimum outer margin ≥ the distance between rings**; nothing may crop, obstruct, or encroach on it.
- Differentiate any other ring-like elements with padding, lines, labels, color, or scale.
- **No redundant notifications** duplicating the Activity app's Move/Exercise/Stand updates, and **no Activity rings inside notifications**.
- Never decorative. Never in app icons or marketing materials.
- **API:** `HKActivityRingView` (HealthKit)

## Gauges — `BASE/gauges`
Numeric value within a range, on a circular or linear path.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | – | ✓ |

- **Standard** shows an indicator at the value; **capacity** fills the path up to the value; **accessory** variants echo watchOS complications and suit Lock Screen widgets (circular, linear, standard, capacity).
- Write succinct labels for the current value and **both endpoints** — VoiceOver reads the visible labels.
- Consider a gradient fill that reinforces meaning (red→blue for hot→cold).
- **macOS level indicator:** *continuous* (translucent track with a solid fill bar) or *discrete* (equally sized segments that fill completely, never partially). **Prefer continuous for large ranges** — discrete segments get too small. Default fill is green; change it at significant thresholds, or use tiered state for multiple colors in one indicator. *Rating* style → see rating indicators. *Relevance* style (shaded bar, e.g. search results) is rarely used.
- **API:** `Gauge` (– / `NSLevelIndicator`)

## Progress indicators — `BASE/progress-indicators`
Transient; appear only during an operation.

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- **Determinate** (known duration) vs **indeterminate** (unquantifiable). Forms: progress bar (fills leading→trailing), circular (fills clockwise), activity indicator/spinner.
- **Prefer determinate.** Switch indeterminate → determinate when you can. **Never switch circular ↔ bar** — different shapes and sizes, disruptive.
- Be accurate; **even out the pace** — 90% in 5 seconds then 10% in 5 minutes reads as a hang.
- **Keep it moving** — a stationary indicator reads as a frozen app.
- Optional description: accurate and succinct; **avoid vague terms like "loading" or "authenticating."**
- Consistent location across the app and across platforms.
- Offer **Cancel** when interruption is safe; add **Pause** as well when interrupting could have side effects; alert (with confirm/resume) when halting is destructive.
- **iOS/iPadOS refresh control:** hidden until pulled down; still perform periodic automatic refreshes. A title is usually unnecessary — and never use it to explain how to refresh.
- **macOS:** prefer a **spinner** for background operations and constrained space. **Don't label a spinner** — it appears right after a person initiates the process.
- **watchOS:** white over the scene background by default; set a tint color to change it.
- **API:** `ProgressView` (`UIProgressView`, `UIActivityIndicatorView`, `UIRefreshControl` / `NSProgressIndicator`)

## Rating indicators — `BASE/rating-indicators`
Horizontal row of symbols (stars by default) for a ranking level. **macOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | ✓ | – | – | – |

- **No partial symbols** — values round to whole symbols. Symbol spacing is fixed; symbols don't stretch to fill the component width.
- Let people change a rank **inline** in a ranked list, without a separate editing screen.
- If you replace the star, make the custom symbol's meaning unmistakable — the star is the recognized ranking symbol.
- **API:** – (– / `NSLevelIndicator.Style.rating`)

---

# 7. System experiences

## Notifications — `BASE/notifications`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

- Requires **explicit consent** before sending. Styles: banner/Lock Screen view, app icon badge, Notification Center item. Communication notifications show the sender's avatar and group name instead of the app icon.
- **Don't send duplicates for the same event** — people turn off all notifications. **Don't direct people to perform tasks** — provide notification actions instead. **Use alerts, not notifications, for errors.** Handle foreground arrivals discreetly (increment a badge, insert data).
- **Never include private or confidential information** — notifications are visible to bystanders.
- **Title:** short, title-style capitalization, no ending punctuation, legible at a glance on Apple Watch. Prefer real content (headline, event name, email subject); if only a generic title is possible, let the system show the app name instead.
- **Body:** complete sentences, sentence case, proper punctuation; **don't pre-truncate** — the system handles it. Provide a generic hidden-preview placeholder ("Friend request", "New comment", "Shipment") in sentence-style capitalization (`UNNotificationCategory.hiddenPreviewsBodyPlaceholder`).
- **Don't include your app name or icon in the content** — the system supplies them.
- **Actions: up to 4 buttons.** Short title-case labels, no app name; each with a recognizable SF Symbol (shown on the trailing side of the title). **No action that merely opens the app.** Prefer non-destructive actions; provide context when destructive. (`UNNotificationCategory`)
- **Badges** show the count of **unread notifications only** — never weather, dates, prices, or scores. Never rely on them alone (people disable badging). Keep them current; dropping to zero removes the notifications from Notification Center. Don't build look-alike badges.
- **watchOS Short Look** (wrist raise): minimal, privacy-safe — no sensitive info in the title, and never the only channel for critical info. **Long Look:** scrollable detail; sash at top carries the app icon and name (customizable color, or blurred when photos sit at the top of the content); content background default transparent, **white at 18% opacity** to match system notifications, or a brand color. **Up to 4 custom actions** below the content; the system always adds Dismiss at the bottom. A static interface is the minimum; a dynamic interface is richer. **Double tap invokes the first non-destructive action** — order actions by frequency.
- **API:** `UserNotifications`, `UserNotificationsUI`, `UNNotificationSound`, `UNNotificationCategory`

## Widgets — `BASE/widgets`
| iOS | iPad | mac | watch | tv | vis | CarPlay |
|---|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ |

**Families**

| Family | iPhone | iPad | Mac | Apple Watch | Vision Pro |
|---|---|---|---|---|---|
| System small | Home Screen, Today View, StandBy, CarPlay | Home Screen, Today View, Lock Screen | Desktop, Notification Center | – | surfaces |
| System medium | Home Screen, Today View | Home Screen, Today View | Desktop, Notification Center | – | surfaces |
| System large | Home Screen, Today View | Home Screen, Today View | Desktop, Notification Center | – | surfaces |
| System extra large | – | Home Screen, Today View | Desktop, Notification Center | – | surfaces |
| System XL portrait | – | – | – | – | surfaces |
| Accessory circular | Lock Screen | Lock Screen | – | complications, Smart Stack | – |
| Accessory corner | – | – | – | complications | – |
| Accessory inline | Lock Screen | Lock Screen | – | complications | – |
| Accessory rectangular | Lock Screen | Lock Screen | – | complications, Smart Stack | – |

**Key numbers**
- **Standard margin 16 pt**; **tight margin 11 pt** (graphics, buttons, background shapes). Smaller margins on Mac desktop, Lock Screen, StandBy. Use `ContainerRelativeShape` for concentric corners.
- **Minimum text size 11 pt.** Support Dynamic Type Large→AX5 on iOS/iPadOS/visionOS. Never rasterize text — always use text elements.
- **Update animations ≤ 2 seconds.**
- iPhone sizes (portrait, pt) — small / medium / large / circular / rectangular / inline:
  - 430×932 & 428×926: 170×170 / 364×170 / 364×382 / 76×76 / 172×76 / 257×26
  - 414×896: 169×169 / 360×169 / 360×379 / 76×76 / 160×72 / 248×26
  - 393×852 & 390×844: 158×158 / 338×158 / 338×354 / 72×72 / 160×72 / 234×26
  - 375×812 & 360×780: 155×155 / 329×155 / 329×345 / 72×72 / 157×72 / 225×26
  - 375×667: 148×148 / 321×148 / 321×324 / 68×68 / 153×68 / 225×26
  - 320×568: 141×141 / 292×141 / 292×311 / — / — / —
- visionOS sizes (pt at 100%): small 158×158 · medium 338×158 · large 338×354 · extra large 450×338 · XL portrait 338×450.
- watchOS Smart Stack (pt): 40 mm 152×69.5 · 41 mm 165×72.5 · 44 mm 173×76.5 · 45 mm 184×80.5 · 49 mm 191×81.5.

**Rendering modes** (`WidgetRenderingMode`): **fullColor** (support light and dark with semantic colors) · **accented** (system removes the background and splits content into accent and primary groups — mark with `.widgetAccentable()`; white tint on iPhone/iPad/Mac, watch-face color for accented content on Apple Watch; system palettes on visionOS) · **vibrant** (desaturates and blurs into the background — use **opaque grayscale**: brighter gray = more contrast).

**Practices**
- One simple idea tied to the app's main purpose. **Don't replicate the app icon.** Content should change over the day. Better to ship one right-sized widget than every size.
- Deep-link into the right location; don't drop people into navigation. Keep tap targets confident. **Inline accessory widgets support a single tap target.**
- If people check more often than the system refreshes, display a last-updated time. Let the system refresh dates/times to conserve update budget.
- Widget gallery: realistic preview (simulated data is fine), placeholder shapes while loading (rectangles for text lines, circles/squares for glyphs). Description starts with an action verb; **never** a description that just narrates the widget itself or tells people to add/use it. Group all sizes of one widget under a single description.
- **StandBy:** small widget scaled up with the background removed; use large glanceable text; **no background colors** (blend with black); low light applies a monochromatic red tint. `@Environment(\.showsWidgetContainerBackground)`.
- **visionOS:** persistent 3D object on horizontal/vertical surfaces at consistent real-world scale, surviving power cycles. **Mounting styles:** *elevated* (default; both orientations; tilts back and casts a shadow; customizable frame width) and *recessed* (vertical surfaces only). **Treatment styles:** *paper* (print-like, responds to ambient light) and *glass* (information-rich, separates fore/background). **Level of detail** (`@Environment(\.levelOfDetail)`): `.simplified` at distance — fewer details, larger type, **no interactive elements**; `.default` up close. Provide high-res assets for 75–125% scaling; test every system color palette.
- **watchOS Smart Stack:** colored background conveys meaning (red falling / green rising); default black. Use RelevanceKit for surfacing.
- **API:** `WidgetKit`, `WidgetConfiguration`, `.supportedMountingStyles(_:)`, `ContainerRelativeShape`, `.widgetAccentable()`

## Live Activities — `BASE/live-activities`
Track an ongoing activity at a glance.

| iPhone/iPad | Mac | Apple Watch | CarPlay |
|---|---|---|---|
| Lock Screen, Home Screen, Dynamic Island, StandBy | Menu bar (click → iPhone Mirroring) | Smart Stack (top) | Dashboard |

**Presentations**
- **Compact** — one active Live Activity; **two separate elements** (leading and trailing of the TrueDepth camera) that must read as one unit. Dynamic Island width **230 pt** (iPhone 17/16/15/14 Pro) or **250 pt** (Pro Max / Plus / Air). Compact leading/trailing ≈ **52.33×36.67 pt** (393×852) to **62.33×36.67 pt** (430×932). Keep it snug against the camera, no padding; balance element sizes (shorten units if needed); both elements link to the same screen.
- **Minimal** — multiple Live Activities; one attached + one detached. **36.67–45 pt wide × 36.67 pt tall.** Must show updated info, not just a logo.
- **Expanded** — touch-and-hold; wraps tightly around the camera; preserve the relative placement from compact. Width **371 pt** (17 Pro) / **408 pt** (17 Pro Max); **height 84–160 pt**.
- **Lock Screen** — banner at the bottom; **height 84–160 pt**; iPad 425–500 pt wide. **Standard 14 pt margins** to align with notifications. Don't replicate a notification layout. Verify the system-generated dismiss button color (`activitySystemActionForegroundColor(_:)`).
- **StandBy** — starts minimal; tap scales the Lock Screen presentation **2×**; custom background extends systemwide; verify Night Mode red tint contrast.
- **Dynamic Island corner radius 44 pt.** CarPlay sizes: 240×78, 240×100, 170×78 pt. watchOS Smart Stack sizes match widgets (40 mm 152×69.5 … 49 mm 191×81.5 pt).

**Practices**
- Tasks with a **defined beginning and end**, short to medium duration (**≤ 8 hours**).
- **No ads or promotions.** Avoid sensitive info (visible on Lock Screen and Always-On) — redact or summarize.
- Show the **logo mark without a container**, not the full app icon. Medium weight or heavier, large sizes; minimize small text. Bold colors read well on the black Dynamic Island.
- Concentric margins (`ContainerRelativeShape`) so nothing pokes into the rounded corners. Separate content blocks with inset containers or thick lines — don't extend to the Dynamic Island edge.
- **Animations ≤ 2 s**; animate layout changes by **moving** elements rather than removing and re-adding; avoid overlaps (animate out, then in); the system skips animations on reduced-luminance Always-On.
- **Prefer a single interactive element**; buttons/toggles only for essential frequent functions (playback, workout pause, recording).
- Start automatically at the expected moment; offer an **App Shortcut** to start one; provide in-app dismissal; **update only when content actually changes**; alert only for essential updates; **don't also send push notifications for the same updates**; end immediately on completion with a dismissal window proportional to duration (**typically 15–30 min**).
- **watchOS:** default combines the iPhone compact leading/trailing. A custom watchOS layout **also applies to CarPlay** — and CarPlay deactivates interactive elements while driving, so avoid buttons/toggles if the activity is likely observed while driving. Declare `ActivityFamily.small` for the supplemental layout.
- **API:** `ActivityKit`, `WidgetKit`, `ContainerRelativeShape`, `.activitySystemActionForegroundColor(_:)`

## App Shortcuts — `BASE/app-shortcuts`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – (App Intents only) | ✓ | – | ✓ |

- **Up to 10 App Shortcuts per app.** Available immediately on install; surfaced in Siri, Spotlight (Top Hit area, then a Shortcuts area below), the Shortcuts app, the Action button, and Apple Pencil squeeze.
- **Adopt app schema domains** where they exist — they let Siri and system experiences surface features contextually without individual shortcuts. Use App Shortcuts for unique features and custom content schemas don't cover.
- Favor tasks people can complete **without leaving their current context**; opening the app is acceptable for multistep tasks.
- **At most one optional parameter** per phrase, with predictable, familiar values ("Start [morning, daily, sleep] meditation"). Ask for clarification when a request omits it — suggest the most recent or time-appropriate value.
- **Keep phrases short and speakable** and include the app name; define natural variants ("Create a Keynote" / "Add a new presentation in Keynote").
- Make shortcuts discoverable in-app with occasional tips (`SiriTipUIView`).
- Responses: **snippets** (static or interactive info) or **Live Activities** (`LiveActivityIntent`). Put all critical information in the **full dialogue text** for audio-only devices (`IntentDialog.init(full:supporting:systemImageName:)`).
- Order shortcuts by general usefulness; the system re-prioritizes by actual usage.
- Terminology: **"Shortcuts"** = the app/feature; **"shortcuts"** = individual shortcuts.
- **API:** `AppIntents`, `AppShortcutPhrase`

## Home Screen quick actions — `BASE/home-screen-quick-actions`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | – | – | – | – |

- Touch and hold an app icon. **Maximum 4 quick actions.** People expect at least one useful action from every app.
- Each has a title, an interface icon (left or right depending on the icon's Home Screen position), and an optional subtitle; title/subtitle are always left-aligned in LTR languages.
- Titles must instantly communicate the result ("Directions Home", "New Message"); **no app name or extraneous text**; keep short to avoid truncation; plan for localization. Subtitles add context (Mail: unread counts).
- Dynamic actions are good, but changes must be **predictable** (location, recent activity, time of day, settings).
- **Prefer SF Symbols**; otherwise the Quick Action Icon Template in Apple Design Resources. **Never use an emoji** — quick action symbols are monochromatic and adapt in Dark Mode.
- **API:** – (`UIApplicationShortcutItem` — "Add Home Screen quick actions" / –)

## Share and action extensions — `BASE/activity-views`
- **Share extension:** share from the current context to apps/accounts/services. **Prefer the system-provided composition view.** Automatically uses your app icon.
- **Action extension:** content-specific tasks without leaving context (bookmark, copy link, edit an image inline, translate selected text). **Include your app name** and prefer SF Symbols or a custom interface icon.
- Streamline to a few steps. **Don't place a modal view above your extension** — the system already presents it modally.
- The activity view dismisses immediately on completion — continue long operations in the background and let people check status in the main app.
- macOS has no activity view but **does** support share and action extensions.

## Going full screen — `BASE/going-full-screen`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | – | – (expand windows / Digital Crown immersion) |

- Offer it for games, media viewing, and in-depth distraction-free tasks.
- **Adjust proportions, don't programmatically resize or remove visible items** — keep essential content prominent and avoid jarring transitions.
- Keep essential controls (playback, task controls) persistently available or trivially revealable; restore hidden chrome with familiar gestures (tap, swipe down, cursor to the top).
- **Preserve Dock access** on iPadOS/macOS. Games may defer the initial bottom-edge swipe or hide the Dock (`preferredScreenEdgesDeferringSystemGestures`, `NSApplicationPresentationOptions.hideDock`).
- Pause on switch-away and restore state on return. **Never auto-exit full screen when the person switches apps.**
- **iOS/iPadOS:** the Home Screen indicator hides shortly after launch and reappears on bottom-screen interaction, allowing a one-swipe exit — keep that default; require two swipes only when accidental exits are a real problem.
- **macOS:** use the system full-screen experience (`NSWindow.toggleFullScreen(_:)`) so camera-housing accommodation works. **Games must not change the display mode** — it doesn't improve performance and the person controls it. Entry via the window button, View menu, or ⌃⌘F; avoid custom window-mode menus.
- **API:** `.fullScreenCover(item:onDismiss:content:)` (`UIViewController.preferredScreenEdgesDeferringSystemGestures` / `NSWindow.toggleFullScreen(_:)`, `NSWindow.CollectionBehavior`)

## Multitasking — `BASE/multitasking`
| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| ✓ | ✓ | ✓ | – | ✓ | ✓ |

- **Every app must work with multitasking** — rare exceptions are some games and visionOS apps in a Full Space.
- Pause anything needing attention when people switch away; resume exactly where they left off.
- **Audio interruptions:** pause **indefinitely** for primary audio (music, podcasts, audiobooks); **duck or briefly pause** for short interruptions (GPS prompts), then restore.
- Finish user-initiated background tasks (downloads, video processing) before suspending.
- Notify on important/time-sensitive completions only — not routine or secondary tasks.
- **iOS:** app switcher; Picture in Picture for FaceTime and video.
- **iPadOS:** full-screen mode (app switcher) or **windowed** mode (resizable, arrangeable, system tiling/full-screen/minimize/close controls; frontmost window shown by colored controls and a drop shadow). **Apps don't control or get told which configuration is in use** — adapt to any size.
- **macOS:** the default experience; layered drop shadows and window-state effects.
- **visionOS:** multiple apps in the Shared Space; **only one window active at a time** — looking away makes the previous window translucent and recede along z. **Don't change window edge appearance** (the system applies a feathered mask). **Don't pause video when people look away.** Expect audio ducking unless you're the Now Playing app. Closing a window backgrounds the app without quitting; closing the Now Playing window pauses playback (resumable from Control Center).
- **API:** `UIKit` "Multitasking on iPad, Mac, and Apple Vision Pro"

## Complications — `BASE/complications`
Watch face data. **watchOS only.**

| iOS | iPad | mac | watch | tv | vis |
|---|---|---|---|---|---|
| – | – | – | ✓ | – | – |

- watchOS 9+ complications are built with **WidgetKit** (`Converting-A-ClockKit-App`); earlier versions use `CLKComplicationDataSource`.
- **Families:** Circular, Corner, Inline, Rectangular (plus legacy templates: Circular Small, Modular Small, Modular Large, Extra Large).
- **Support as many families as possible** — more families = more watch faces. Offer **multiple complications per family** with **different deep links** (a triathlon app with swim/bike/run complications).
- Content must be **dynamic**; static complications lose their place on the face. Privacy matters on the Always-On display.
- Choose timeline-entry times that maximize usefulness — the system limits daily updates and stored entries.
- **Gauge styles:** *closed* (percentage of a whole, e.g. battery), *open* (arbitrary min/max, e.g. speed), *segmented* (app-defined range, rapid changes, e.g. Noise).
- **Tinted mode:** the system applies a solid color to text, gauges and images and desaturates full-color images unless you supply tinted versions. **Don't use color as the sole carrier of information.**
- **Image line widths ≥ 2 pt** — thinner lines are hard to see at a glance, especially in motion. Provide a static placeholder per complication (`TimelineProvider.placeholder(in:)`); placeholder sizes may differ from real image sizes.
- **Circular image sizes (regular):** 40 mm **42×42 pt** · 41 mm **44.5×44.5** · 44 mm **47×47** · 45/49 mm **50×50**. Text: Rounded, Medium, **12 / 12.5 / 13 / 14.5 pt**. Bezel text curves ~**180°** before truncating. Circular images get a circular mask.
- **Extra-large circular:** 40 mm **120×120 pt** · 41 mm **127×127** · 44 mm **132×132** · 45/49 mm **143×143**. Text: Rounded, Medium, **34.5 / 36.5 / 36.5 / 41 pt**.
- **Corner:** circular content 32/34/36/38 pt; gauge and text content 20/21/22/24 pt (40/41/44/45–49 mm). Text: Rounded, Semibold, **10 / 10.5 / 11 / 12 pt**. Circular mask applied.
- **Rectangular:** large image with title 150×47 / 159×50 / 171×54 / 178.5×56 pt; without title 162×69 / 171.5×73 / 184×78 / 193×82 pt; body and text-gauge images 12×12 / 12.5×12.5 / 13.5×13.5 / 14.5×14.5 pt. Text: Rounded, Medium, **16.5 / 17.5 / 18 / 19.5 pt**. Large-image layouts get an automatic **4 pt corner radius**. From watchOS 10 these may appear in the **Smart Stack** — supply a background color, use App Intents for relevancy, and consider a Smart-Stack-optimized custom layout (`WidgetFamily.accessoryRectangular`).
- **API:** `WidgetKit` (legacy `ClockKit.CLKComplicationDataSource`)

---

# 8. Button hierarchy

## 8.1 Styles

| Intent | SwiftUI | UIKit | AppKit | When |
|---|---|---|---|---|
| **Prominent / filled** — the single most likely action | `.buttonStyle(.borderedProminent)`, `.glassProminent`; toolbars: `.prominent` | `UIButton.Configuration.filled()` | default `NSButton` with `keyEquivalent = "\r"` | Confirm/commit: Done, Submit, Continue, Buy, Save. **One, at most two, per view.** Only one in a toolbar, on the trailing side. |
| **Bordered / gray** — secondary, still a real action | `.buttonStyle(.bordered)`, `.glass` | `UIButton.Configuration.gray()` / `.tinted()` | `NSButton` push button | Alternatives beside the primary; visible-but-not-urgent commands. |
| **Plain / borderless** — tertiary, or inside containers | `.buttonStyle(.plain)`, `.borderless` | `UIButton.Configuration.plain()` | `NSButton.BezelStyle.accessoryBar`, borderless | Toolbar symbol items (the bar supplies the container), list-row buttons, links, visionOS ornaments. |
| **Link** | `Link`, `.buttonStyle(.link)` | `UIButton` plain w/ tint | `NSButton.BezelStyle.inline` | Navigating out, not committing. |

Rules that cut across all of them (`BASE/buttons`):
- **Distinguish by style, not size.** Buttons of the same size read as a coherent set; mixing sizes reads as accidental.
- **Max 1–2 prominent buttons per view.** Beyond that the emphasis cancels out.
- In toolbars prefer **system symbols without borders** — the bar section is already a visible container (`BASE/toolbars`).

## 8.2 Roles

| Role | SwiftUI | UIKit | Behavior / rule |
|---|---|---|---|
| Normal | (default) | default | no semantics |
| **Primary** | `.keyboardShortcut(.defaultAction)` | `UIAlertAction.Style.default` + preferred action | responds to **Return**; enables automatic dismissal of sheets, editable views, alerts |
| **Cancel** | `ButtonRole.cancel` | `UIAlertAction.Style.cancel` | always titled **"Cancel"**; responds to **Esc / ⌘.** |
| **Destructive** | `ButtonRole.destructive` | `UIAlertAction.Style.destructive` | red; **never also primary**; always paired with Cancel |

- **Never assign the primary role to a destructive action** (`BASE/buttons`).
- Use the destructive style only for *unintentional* destruction. If the person deliberately chose the destructive action (Empty Trash), don't style it destructively (`BASE/alerts`).
- Menus render destructive items in red; confirm intent with an action sheet (iOS) or popover (iPadOS) (`BASE/pull-down-buttons`).
- Put destructive items **last** in a context menu (`BASE/context-menus`), **first** in an action sheet (`BASE/action-sheets`).

## 8.3 Placement conventions

| Context | Confirming / primary | Cancelling / dismissing | Source |
|---|---|---|---|
| **Alert, horizontal row** | **trailing** | **leading** | `BASE/alerts` |
| **Alert, vertical stack** | **top** | **bottom** | `BASE/alerts` |
| **macOS dialog / sheet** | default button on the **right** (trailing), tinted, Return-activated | Cancel to its **left** | `BASE/alerts`, `BASE/buttons` |
| **iOS/iPadOS sheet, single view** | **Done, trailing** of the top toolbar | **Cancel, leading** | `BASE/sheets` |
| **iOS/iPadOS sheet, multi-step** | Done trailing (inactive until the final step) | Back leading after step 1, Cancel leading on step 1 | `BASE/sheets` |
| **iOS/iPadOS toolbar (nav bar)** | primary action `.prominent` on the **trailing** edge — only one | Back / Close on the **leading** edge, standard symbols | `BASE/toolbars` |
| **Action sheet** | choices in the middle | **Cancel at the bottom** (upper-left on watchOS); destructive **at the top** | `BASE/action-sheets` |
| **Context menu** | frequent items nearest the reveal point | destructive **last** | `BASE/context-menus` |
| **macOS Help button** | — | lower corner **opposite** the dismissal buttons in dialogs; lower-left/right in settings; **one per window** | `BASE/buttons` |
| **macOS image button label** | — | label goes **below** the button | `BASE/buttons` |
| **watchOS** | full-width primary action; corner/bottom toolbar buttons | — | `BASE/buttons`, `BASE/toolbars` |
| **visionOS toolbar** | bottom edge, in front of the window on z | — | `BASE/toolbars` |

---

# 9. Numbers cheat sheet

| Number | Meaning | Source |
|---|---|---|
| **44×44 pt** | minimum button hit region (iOS/iPadOS/macOS/watchOS/tvOS) | `BASE/buttons` |
| **60×60 pt** | minimum button hit region, visionOS | `BASE/buttons` |
| **60 pt** | minimum distance between visionOS button centers | `BASE/buttons` |
| **28 / 32 / 44 / 52 / 64 pt** | visionOS button sizes (mini/small/regular/large/XL) | `BASE/buttons` |
| **~10 px** | padding inside a macOS image button | `BASE/buttons` |
| **3** | max buttons in an alert | `BASE/alerts` |
| **154 pt / 16 pt** | visionOS alert accessory view max height / corner radius | `BASE/alerts` |
| **4** | max buttons in a watchOS action sheet (incl. Cancel) | `BASE/action-sheets` |
| **4** | max notification action buttons | `BASE/notifications` |
| **4** | max Home Screen quick actions | `BASE/home-screen-quick-actions` |
| **10** | max App Shortcuts per app | `BASE/app-shortcuts` |
| **6** | max tabs in a macOS tab view | `BASE/tab-views` |
| **5 or fewer** | target default tabs in a tab bar | `BASE/tab-bars` |
| **5–7 / 5** | max segments in a wide interface / on iPhone | `BASE/segmented-controls` |
| **2–5** | typical radio button group size; avoid >5 | `BASE/toggles` |
| **3** | minimum items to justify a pull-down button | `BASE/pull-down-buttons` |
| **~5** | submenu item count beyond which you should make a separate menu | `BASE/menus` |
| **1** | max submenu nesting level | `BASE/context-menus`, `BASE/menus` |
| **~3** | max separator-delimited groups in a context menu; max toolbar groups | `BASE/context-menus`, `BASE/toolbars` |
| **~10** | max page control dots | `BASE/page-controls` |
| **2** | max distinct page-control indicator images | `BASE/page-controls` |
| **2** | max hierarchy levels in a sidebar | `BASE/sidebars` |
| **~15 chars** | target window/toolbar title length | `BASE/toolbars` |
| **2 lines** | max alert title length | `BASE/alerts` |
| **1 pt** | preferred macOS split-view divider width | `BASE/split-views` |
| **1/3 : 2/3** | tvOS split-view default proportion | `BASE/split-views` |
| **68 pt / 46 pt** | tvOS tab bar height / distance from top of screen | `BASE/tab-bars` |
| **~70×70 px** | custom activity-view icon area | `BASE/activity-views` |
| **16 pt / 11 pt** | widget standard / tight margin | `BASE/widgets` |
| **11 pt** | widget minimum text size | `BASE/widgets` |
| **14 pt** | Live Activity Lock Screen margins | `BASE/live-activities` |
| **2 s** | max widget / Live Activity update animation | `BASE/widgets`, `BASE/live-activities` |
| **44 pt** | Dynamic Island corner radius | `BASE/live-activities` |
| **230 / 250 pt** | Dynamic Island width (Pro / Pro Max & Plus & Air) | `BASE/live-activities` |
| **84–160 pt** | Live Activity expanded & Lock Screen height range | `BASE/live-activities` |
| **≤ 8 h** | recommended Live Activity duration | `BASE/live-activities` |
| **15–30 min** | typical Live Activity post-completion dismissal window | `BASE/live-activities` |
| **1280×720 pt, ~2 m** | visionOS default window size and placement distance | `BASE/windows` |
| **2 pt** | minimum complication image line width | `BASE/complications` |
| **4 pt** | rectangular complication large-image corner radius | `BASE/complications` |
| **23 h 59 m** | date picker countdown-timer maximum | `BASE/pickers` |
| **60** | default minute-list length; custom intervals must divide evenly into 60 | `BASE/pickers` |
| **18%** | white opacity of the watchOS Long Look content background matching system notifications | `BASE/notifications` |
| **250,17,79 / 166,255,0 / 0,255,246** | Move / Exercise / Stand RGB | `BASE/activity-rings` |

---

# 10. Common mistakes

Each item is a documented violation, with the rule it breaks.

**Navigation**
1. **More than ~5 tabs on iPhone.** The trailing tab collapses into a **More** tab and the rest disappear into a list — harder to reach and to notice. Aim for 5 or fewer. `BASE/tab-bars`
2. **Hamburger / drawer menu instead of a tab bar or sidebar.** There is no hamburger pattern in the HIG. Top-level navigation is a **tab bar** (compact) or a **sidebar** (regular/adaptable). `BASE/tab-bars`, `BASE/sidebars`
3. **Custom back button.** Use the standard Back button and symbol, no "Back" text. If you must customize, it has to look and behave identically. `BASE/toolbars`
4. **Hiding or disabling tab bar buttons** when their content is unavailable — makes the app feel unstable. Keep them enabled and explain the unavailability in the destination. `BASE/tab-bars`
5. **Hiding the tab bar during in-section navigation.** Only modal views may cover it. `BASE/tab-bars`
6. **Using a tab bar for actions** or a toolbar for section navigation. Tab bar = navigate between sections; toolbar = act on content. `BASE/tab-bars`, `BASE/toolbars`
7. **Sidebar deeper than two levels.** Use a split view with an intermediate content list instead. `BASE/sidebars`
8. **Split view in a compact width** (portrait iPhone). Prefer regular environments only. `BASE/split-views`
9. **Titling the window with the app name.** It carries no hierarchy information. `BASE/toolbars`
10. **Manually adding a toolbar overflow menu**, or shipping a toolbar layout that overflows at the default size. The system adds overflow; you define the priority order. `BASE/toolbars`
11. **A vertical toolbar in visionOS** — tab bars are the vertical element there; a vertical toolbar reads as one. `BASE/toolbars`
12. **macOS toolbar items with no menu bar equivalent.** The toolbar is customizable and hideable, so every item needs a menu command. `BASE/toolbars`

**Alerts, sheets, and modals**
13. **Nonstandard alert button order.** Default/most-likely goes **trailing** in a row and **top** in a stack; Cancel goes **leading** / **bottom**. `BASE/alerts`
14. **"Yes"/"No" alert buttons**, or **"OK"** as the default for a consequential action. Use a specific verb: Erase, Convert, Clear, Delete. "OK" only in purely informational alerts. `BASE/alerts`
15. **More than 3 buttons in an alert.** `BASE/alerts`
16. **Informational-only alerts**, alerts at app startup, or alerts for common undoable destructive actions. `BASE/alerts`
17. **A destructive action without a Cancel button**, or a destructive action styled as the primary action. `BASE/alerts`, `BASE/buttons`
18. **Explaining the buttons inside the alert text.** A clear title and clear labels make it unnecessary. `BASE/alerts`
19. **A sheet whose only exit is Done.** Always pair Done with Cancel or Back. Equally wrong: showing Cancel + Done + Back together. `BASE/sheets`
20. **Treating Back as dismissal** in a sheet — Back goes up a step; it is not a way out. `BASE/sheets`
21. **Stacking sheets** or showing more than one at a time from the main interface. `BASE/sheets`
22. **Medium detent on a compose-style sheet** where the content is more useful full height. `BASE/sheets`
23. **A resizable sheet without a grabber.** `BASE/sheets`
24. **A visionOS sheet sliding up from the bottom edge** instead of centering in the field of view. `BASE/sheets`
25. **Cascading popovers, or a popover on top of a popover.** Only an alert may appear above a popover. `BASE/popovers`
26. **Popovers in compact iOS/iPadOS views** — use a full-screen modal sheet. `BASE/popovers`
27. **Using a popover for a warning.** It can be missed or dismissed accidentally; use an alert. `BASE/popovers`
28. **Discarding work when a nonmodal popover auto-closes.** Save it; discard only on an explicit Cancel. `BASE/popovers`
29. **An alert where an action sheet belongs** — if the choice follows a deliberate action and offers options, it's an action sheet. `BASE/action-sheets`, `BASE/alerts`
30. **A scrolling action sheet.** More decision time, more accidental taps. `BASE/action-sheets`

**Buttons and menus**
31. **Disabling the primary action with no explanation.** The HIG is explicit on this for tab bars — say why the content isn't available rather than just graying it out — and general for menus (**dim** unavailable items rather than silently removing affordance). If Done/Submit is inert, say what's missing. `BASE/tab-bars`, `BASE/menus`
32. **Three or more prominent buttons in one view.** One or two, maximum. `BASE/buttons`
33. **Signalling importance with button size** rather than style. `BASE/buttons`
34. **Custom buttons with no press state.** They read as unresponsive. `BASE/buttons`
35. **Hit regions below 44×44 pt (60×60 pt in visionOS).** `BASE/buttons`
36. **Tinting button labels close to the content background color** — especially over bright content, where monochromatic is correct. `BASE/buttons`, `BASE/toolbars`
37. **Text in a macOS square/gradient button** (symbols and icons only), or a square button in a window frame or toolbar. `BASE/buttons`
38. **More than one Help button per macOS window.** `BASE/buttons`
39. **A pop-up button used for a list of actions**, or a pull-down button used for mutually exclusive state. Pop-up = mutually exclusive options; pull-down = actions/items related to the button. `BASE/pop-up-buttons`, `BASE/pull-down-buttons`
40. **A pull-down button with only one or two items.** Use a plain button or toggle. `BASE/pull-down-buttons`
41. **Burying a view's primary actions inside a More menu.** `BASE/pull-down-buttons`
42. **Context-menu-only commands.** Every item must also be reachable from the main interface. `BASE/context-menus`
43. **Multi-level submenus.** One level. `BASE/menus`, `BASE/context-menus`
44. **Keyboard shortcuts shown in a context menu.** Redundant — main menus only. `BASE/context-menus`
45. **Dimming unavailable context menu items instead of hiding them** (macOS Cut/Copy/Paste excepted). `BASE/context-menus`
46. **Icons on some items of a menu group but not others.** All or none. `BASE/menus`
47. **Missing ellipsis** on a command that needs more information before it can complete. `BASE/menus`
48. **Providing both a context menu and an edit menu** on the same iOS/iPadOS content. `BASE/context-menus`
49. **Treating Delete and Cut as the same command.** Cut writes to the pasteboard. `BASE/edit-menus`
50. **Duplicating an existing share-sheet action** with the same name — give a custom variant a distinct title. `BASE/activity-views`

**Controls and input**
51. **A tab view / segmented control used for separate app sections.** Segmented controls switch closely related subviews; separate sections are a tab bar's job. `BASE/segmented-controls`
52. **Mixing text and images inside one segmented control**, or mixing action segments with selection-state segments. `BASE/segmented-controls`
53. **A segmented control for main-window view switching on macOS** — that's a tab view. `BASE/segmented-controls`
54. **A custom volume slider on iOS/iPadOS.** Use a volume view. `BASE/sliders`
55. **A slider whose maximum is at the leading edge or bottom.** `BASE/sliders`
56. **A stepper with no visible value nearby.** The stepper displays nothing itself. `BASE/steppers`
57. **Placeholder text with no separate label.** The placeholder disappears the moment people type. `BASE/text-fields`
58. **A plain text field for a password.** Use `SecureField`. `BASE/text-fields`
59. **A `UISwitch` outside a list row on iOS** — outside lists the pattern is a button that behaves like a toggle. `BASE/toggles`
60. **State communicated by color alone.** Change fill, shape, or inner detail too. `BASE/toggles`
61. **More than ~5 radio buttons**, or a single lone radio button for one on/off setting (use a checkbox). `BASE/toggles`
62. **Replacing established macOS checkboxes with switches.** `BASE/toggles`
63. **Toggles in a macOS toolbar or status bar.** Window body only. `BASE/toggles`
64. **Switching views to present a picker** instead of showing it in context. `BASE/pickers`
65. **A picker for a short list** (use a pull-down button) or for a very large set (use a list/table with an index). `BASE/pickers`
66. **A custom keyboard extension that only reskins the system keyboard.** Build one only for genuinely novel input or unsupported languages; otherwise a custom input view. `BASE/virtual-keyboards`
67. **A combo box whose menu items are wider than its text field.** They truncate. `BASE/combo-boxes`
68. **A path control in a toolbar or status bar.** Window body only. `BASE/path-controls`

**Layout and structure**
69. **A box nearly as large as its window.** It stops communicating grouping. Also: boxes nested inside boxes. `BASE/boxes`
70. **Nested scroll views with the same orientation.** `BASE/scroll-views`
71. **A collection used for primarily textual content.** A list is easier to scan. `BASE/collections`
72. **Confusing the info button with the disclosure indicator** — the info button reveals detail, the chevron means "drills in." `BASE/lists-and-tables`
73. **An alphabetic index alongside trailing row controls.** They compete for the same edge. `BASE/lists-and-tables`
74. **Your own corner masks on tvOS focusable rows/images** — the system already rounds them on focus. `BASE/lists-and-tables`
75. **Critical information or actions at the bottom edge** of a macOS window or sidebar. People cover that edge when repositioning windows. `BASE/windows`, `BASE/sidebars`
76. **More than 3 toolbar groups**, or text-labeled buttons adjacent to symbol-only buttons without separation. `BASE/toolbars`
77. **Removing the visionOS window glass background** — reduces legibility and coherence. `BASE/windows`
78. **Deep 3D content inside a visionOS window** — the system clips it; use a volume. `BASE/windows`
79. **A visionOS ornament wider than its window**, or too many ornaments crowding the content. `BASE/ornaments`
80. **Hand-building an ornament for a toolbar or tab bar in visionOS** — the system already renders those as ornaments. `BASE/ornaments`

**Status and system experiences**
81. **Switching a progress indicator between circular and bar styles** mid-operation. `BASE/progress-indicators`
82. **A determinate bar that races to 90% then crawls.** Even out the pace. `BASE/progress-indicators`
83. **A stationary progress indicator.** Reads as a hang. `BASE/progress-indicators`
84. **Vague progress text** ("Loading…", "Authenticating…"). `BASE/progress-indicators`
85. **Labeling a macOS spinner.** `BASE/progress-indicators`
86. **Recoloring, masking, or decoratively using Activity rings**, putting them on a non-black background, or using them in an app icon or marketing material. `BASE/activity-rings`
87. **Activity rings for anyone but a single identified person**, or for non-Move/Exercise/Stand data. `BASE/activity-rings`
88. **Notifications duplicating the Activity app's own Move/Exercise/Stand updates**, or Activity rings inside notifications. `BASE/activity-rings`
89. **Badging non-notification counts** (weather, scores, prices) or building look-alike badges. `BASE/notifications`
90. **Sensitive content in a notification, widget, Live Activity, or complication** — all are visible on Lock Screen / Always-On displays. `BASE/notifications`, `BASE/live-activities`, `BASE/complications`
91. **Notifications telling people to go do something** instead of offering an action button. `BASE/notifications`
92. **A notification action that just opens the app.** `BASE/notifications`
93. **Pre-truncating notification body text**, or putting your app name/icon in the content. `BASE/notifications`
94. **A widget that mirrors the app icon** or is a pure launch shortcut, or shipping every size just because the option exists. `BASE/widgets`
95. **Rasterized text in a widget**, text below 11 pt, or background colors in StandBy. `BASE/widgets`
96. **Widget descriptions that narrate the widget or instruct people to add it, instead of leading with an action verb.** `BASE/widgets`
97. **Ads, promotions, or unchanged data refreshes in a Live Activity**, or push notifications duplicating its updates. `BASE/live-activities`
98. **Multiple interactive controls in a Live Activity** — prefer one, and none if it's likely observed while driving (CarPlay). `BASE/live-activities`
99. **A Live Activity that outlives its task**, or one with no in-app way to turn it off. `BASE/live-activities`
100. **Emoji as Home Screen quick action icons** (they're monochromatic and Dark Mode-adaptive), or quick actions that change unpredictably. `BASE/home-screen-quick-actions`
101. **App Shortcut phrases with multiple parameters** or phrases too long to say comfortably. `BASE/app-shortcuts`
102. **Auto-exiting full screen when the person switches apps**, or a game that changes the display mode on macOS. `BASE/going-full-screen`
103. **Not pausing attention-requiring activity on app switch**, or not resuming state on return. `BASE/multitasking`
104. **Pausing visionOS video when the person looks at another window** — playback is expected to continue, as on macOS. `BASE/multitasking`
105. **Changing visionOS window edge appearance** — the system's feathered mask communicates the inactive state. `BASE/multitasking`
106. **Complication color as the only information carrier**, or line widths under 2 pt. `BASE/complications`

---

# 11. Framework mapping (one table)

| Component | SwiftUI | UIKit | AppKit |
|---|---|---|---|
| Box | `GroupBox` | — | `NSBox` |
| Button | `Button` | `UIButton` | `NSButton` |
| Collection | `LazyVGrid` / `LazyHGrid` | `UICollectionView` | `NSCollectionView` |
| Color well | `ColorPicker` | `UIColorWell`, `UIColorPickerViewController` | `NSColorWell` |
| Column view (browser) | — | — | `NSBrowser` |
| Combo box | — | — | `NSComboBox` |
| Confirmation dialog / action sheet | `.confirmationDialog(_:isPresented:titleVisibility:actions:)` | `UIAlertController.Style.actionSheet` | — |
| Context menu | `.contextMenu(menuItems:)` | `UIContextMenuInteraction` | `NSMenu.popUpContextMenu(_:with:for:)` |
| Digit entry | — | `TVDigitEntryViewController` (TVUIKit) | — |
| Disclosure | `DisclosureGroup` | — | `NSButton.BezelStyle.disclosure` / `.pushDisclosure` |
| Dock menu | — | — | `NSApplicationDelegate.applicationDockMenu(_:)` |
| Edit menu | — | `UIEditMenuInteraction`, `UIResponderStandardEditActions` | `NSMenu` |
| Alert | `.alert(_:isPresented:actions:)` | `UIAlertController` | `NSAlert` |
| Gauge / level indicator | `Gauge` | — | `NSLevelIndicator` |
| Image well | — | — | `NSImageView` (editable) |
| Label | `Label`, `Text` | `UILabel` | `NSTextField` (`isEditable = false`) |
| List / table | `List`, `Table`, `ListStyle` | `UITableView`, `UIListContentConfiguration` | `NSTableView` |
| Lockup | — | `TVLockupView`, `TVCardView`, `TVCaptionButtonView`, `TVMonogramContentView`, `TVPosterView` (TVUIKit) | — |
| Menu | `Menu` | `UIMenu`, `UIMenu.preferredElementSize` | AppKit Menus |
| Ornament | `.ornament(visibility:attachmentAnchor:contentAlignment:ornament:)` | — | — |
| Outline view | `OutlineGroup` | — | `NSOutlineView` |
| Page control | `TabView` + `.tabViewStyle(.page)` / `PageTabViewStyle` | `UIPageControl` | — |
| Panel | — | — | `NSPanel`, `NSWindow.StyleMask.hudWindow` |
| Path control | — | — | `NSPathControl` |
| Picker (date) | `Picker`, `DatePicker`, `PickerStyle.navigationLink` | `UIPickerView`, `UIDatePicker` | `NSDatePicker` |
| Pop-up button | `Picker` + `.menu` / `MenuPickerStyle` | `UIButton.changesSelectionAsPrimaryAction` | `NSPopUpButton` |
| Popover | `.popover(isPresented:attachmentAnchor:arrowEdge:content:)` | `UIPopoverPresentationController` | `NSPopover` |
| Progress | `ProgressView` | `UIProgressView`, `UIActivityIndicatorView`, `UIRefreshControl` | `NSProgressIndicator` |
| Pull-down button | `Menu` | `UIControl.showsMenuAsPrimaryAction` | `NSPopUpButton.pullsDown` |
| Rating indicator | — | — | `NSLevelIndicator.Style.rating` |
| Scroll view | `ScrollView`, `ScrollEdgeEffectStyle`, `ScrollInputKind.look` | `UIScrollView`, `UIScrollEdgeEffect.Style` | `NSScrollView`, `NSScrollEdgeEffectStyle` |
| Search field | `.searchable(text:placement:prompt:)` | `UISearchBar`, `UISearchController`, `UISearchTextField` | `NSSearchField` |
| Segmented control | `.pickerStyle(.segmented)` | `UISegmentedControl`, `.isMomentary` | `NSSegmentedControl`, `SwitchTracking.momentary` |
| Share / activity | `ShareLink` | `UIActivityViewController`, `UIActivity` | — (extensions only) |
| Sheet | `.sheet(item:onDismiss:content:)`, `.presentationDetents` | `UISheetPresentationController`, `.detents` | `NSViewController.presentAsSheet(_:)` |
| Sidebar | `TabViewStyle.sidebarAdaptable`, `ListStyle.sidebar`, `.backgroundExtensionEffect()` | `UICollectionLayoutListConfiguration.Appearance.sidebar` | `NSSplitViewController` |
| Slider | `Slider` | `UISlider` | `NSSlider` |
| Split view | `NavigationSplitView`, `HSplitView`, `VSplitView` | `UISplitViewController` | `NSSplitViewController`, `NSSplitViewDividerStyle` |
| Stepper | `Stepper` | `UIStepper` | `NSStepper` |
| Tab bar | `TabView`, `Tab`, `TabBarMinimizeBehavior`, `TabViewCustomization` | `UITabBar`, `UITabBarController`, `UITab.Placement` | — |
| Tab view | `TabView` | — | `NSTabView` |
| Text field | `TextField`, `SecureField` | `UITextField` | `NSTextField` |
| Text view | `TextEditor`, `Text` | `UITextView` | `NSTextView` |
| Toggle | `Toggle`, `ToggleStyle.switch`, `GroupedFormStyle`, `ControlSize` | `UISwitch`, `UIButton.changesSelectionAsPrimaryAction` | `NSSwitch`, `NSButton.ButtonType.toggle`, `allowsMixedState` |
| Token field | — | — | `NSTokenField` |
| Toolbar | `.toolbar { ToolbarItem(placement:) }` | `UIToolbar`, `UINavigationBar`, `UIBarButtonItem` | `NSToolbar` |
| Virtual keyboard | `.keyboardType(_:)`, `.textContentType(_:)`, `.submitLabel(_:)` | `UIKeyboardType`, `UITextContentType`, `UIReturnKeyType`, `UIKeyboardLayoutGuide`, `UIResponder.inputAccessoryView` | — |
| Window | `WindowGroup`, `DefaultWindowStyle`, `PlainWindowStyle`, `VolumetricWindowStyle`, `OpenWindowAction` | `UIWindow`, `UIWindowSceneActivationInteraction` | `NSWindow` |
| Widget / complication | `WidgetKit`, `ContainerRelativeShape`, `.widgetAccentable()` | — | — |
| Live Activity | `ActivityKit`, `.activitySystemActionForegroundColor(_:)` | — | — |
| App Shortcut | `AppIntents`, `AppShortcutPhrase`, `LiveActivityIntent` | `SiriTipUIView` | — |
| Quick action | — | `UIApplicationShortcutItem` | — |
| Activity rings | — | `HKActivityRingView` (HealthKit) | — |
| Full screen | `.fullScreenCover(item:onDismiss:content:)` | `preferredScreenEdgesDeferringSystemGestures` | `NSWindow.toggleFullScreen(_:)`, `NSApplicationPresentationOptions.hideDock` |

---

# 12. Volatility notes

Pages carrying 2025–2026 changelog entries — re-check these before relying on details:
- `buttons` (2025-12-16 Liquid Glass; 2025-06-09 styles/content)
- `toolbars` (2025-12-16 Liquid Glass; **2025-06-09 absorbed navigation bars**, added bar-item grouping)
- `tab-bars` (2026-06-08 terminology; 2025-12-16 and 2025-07-28 Liquid Glass)
- `sidebars` (2026-06-08 icon colors and adaptable style)
- `search-fields` (2026-06-08 search-as-a-tab; 2025-06-09 iOS placement, tokens)
- `menus` (2026-06-08 item icons; 2025-12-16 visionOS breakthrough effects)
- `sheets` (2026-03-24 button placement)
- `scroll-views` (2026-06-08 scroll edge effects; 2026-03-24 Look to Scroll)
- `widgets`, `live-activities` (2025-12-16, all platforms + CarPlay/macOS)
- `app-shortcuts` (2026-06-08 app schema domains)
- `windows`, `split-views`, `going-full-screen`, `multitasking`, `virtual-keyboards` (2025-06-09)

Component pages with **no** standalone HIG page (documented elsewhere): navigation bars → `toolbars`; share/action extensions → `activity-views`; watch complications → `complications`.
