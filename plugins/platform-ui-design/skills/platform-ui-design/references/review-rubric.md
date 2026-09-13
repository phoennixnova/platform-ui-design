# UI Review Rubric

Work through the passes in order. Each finding gets: **severity · what's wrong · the guideline
it violates (with URL) · the concrete fix**. Rank findings by severity, not by pass order.
Do not pad with praise; do not invent problems to fill a pass.

Severity scale:

| | Meaning |
|---|---|
| **P0** | Blocks a user, or fails an accessibility floor, or would fail App Store / Play review |
| **P1** | Breaks a platform convention; users will misread or mis-tap the interface |
| **P2** | Inconsistent with the platform or the product's own system; looks unfinished |
| **P3** | Polish; worth doing, safe to defer |

State your evidence source up front. From a **screenshot** you can judge layout, hierarchy,
contrast and idiom, but you cannot verify Dynamic Type, insets, semantics, focus order or
state coverage — say so rather than guessing. From **source** you can verify everything.

---

## Pass 1 — Platform idiom (P0/P1)

- Is the navigation model the platform's? Tab bar / nav stack / split view on Apple;
  nav bar → rail → drawer by window size class on Android; NavigationView pane modes on Windows.
- Is the back affordance correct and unsuppressed? Apple: nav-bar back + interactive edge swipe.
  Android: system back + predictive back honored. Windows: title-bar back button / `BackRequested`.
- Is the primary action where the platform puts it? Apple: nav-bar trailing or a prominent
  button — **no FAB**. Android: FAB bottom-end, one per screen. Windows: CommandBar.
- Modal presentation: sheet with detents (Apple) vs bottom sheet / dialog (Android) vs
  ContentDialog (Windows). No iOS-style action sheet on Android; no toast on iOS.
- Controls: stock control or a custom reimplementation of one? A custom control that mimics a
  stock control is a P1 unless it does something stock cannot.
- Icon set matches the platform (SF Symbols / Material Symbols / Segoe Fluent Icons). Emoji
  used as icons is always a finding.
- Cross-platform ports: any chrome from the other platform leaking through — a hamburger on
  iOS, a chevron-back on Android, iOS-style grouped insets on a Material list.

## Pass 2 — Metrics (P1/P2)

- Hit targets: ≥44×44 pt Apple, ≥48×48 dp Android with ≥8 dp between, ≥40×40 px Windows
  (larger for touch). Measure the *hit region*, not the glyph.
- Side margins and safe areas / insets respected. Android edge-to-edge handled, not faked.
- Control heights, bar heights and list row heights match the platform (see
  `device-metrics.md`). A 36 dp "list row" is a finding.
- Spacing follows a grid — 4/8 dp on Android, a consistent step on Apple. Arbitrary values
  (13, 17, 22) that don't come from the product's own token set are a finding.
- Corner radii consistent and platform-appropriate; Apple concentricity respected where
  nested.
- Type sizes come from the platform ramp (Dynamic Type styles / M3 type scale / Windows type
  ramp), not arbitrary pt values.

## Pass 3 — Color, theming, elevation (P1/P2)

- Semantic colors / color roles / theme brushes used, never literal hex. Every hardcoded color
  in the source is a finding.
- `x`/`onX` pairing correct on Android; contrast-safe pairs only.
- Dark mode: does every surface, border, shadow, icon and illustration have a dark treatment?
  Check disabled states and overlays specifically — they are where dark mode breaks.
- Elevation used meaningfully: Android tonal + shadow, Windows Mica/Acrylic layering, Apple
  materials. Shadows on everything is a finding; so is a flat hierarchy with no depth cue at all.
- Brand color used for identity, not for every affordance. One primary action per screen.

## Pass 4 — Layout adaptivity (P1)

- Does the layout respond to size classes / window size classes / breakpoints, or is it a
  stretched phone layout? A single-column phone layout at tablet width is a P1.
- Two-pane opportunities taken where the content is list-detail or content-supporting.
- Rotation, split-screen / Stage Manager, foldables (hinge, tabletop posture), resizable
  desktop windows, external display.
- Text at 200% scale: does the layout reflow or does it clip? Check buttons, tab labels,
  single-line rows, and anything with a fixed height.
- Long content and long strings (localization: German is ~35% longer) — truncation should be
  deliberate, not accidental.

## Pass 5 — States (P1/P2)

Every screen owes eight states. Missing ones are findings.

| State | Check |
|---|---|
| Loading | Skeleton or progress indicator; determinate where progress is known |
| Empty (first run) | Explains what goes here and offers the action that fills it |
| Empty (no results) | Different from first-run empty; offers a way to widen the search |
| Error | Says what failed and what to do; retry affordance; no raw error codes |
| Offline | Distinguished from generic error; says what still works |
| Permission denied | Explains the value, routes to Settings, degrades gracefully |
| Partial / stale | Cached data labeled as such |
| Success | Confirmed without a blocking dialog where possible |

Also: destructive actions confirmed or undoable (prefer undo over confirm); disabled controls
explain why they're disabled; forms validate inline, not only on submit.

## Pass 6 — Accessibility (P0)

Run the full checklist at the end of `accessibility.md`. The floors that make a finding P0:

- Text contrast below 4.5:1 (3:1 for large text); UI component contrast below 3:1.
- Any control without an accessible name.
- Color as the only carrier of meaning.
- Text that doesn't scale, or clips at 200%.
- Focus order that doesn't follow reading order, or focus that can't escape a trap.
- Touch target below the platform floor.
- Motion with no reduce-motion path.
- Media without captions or a text alternative.

## Pass 7 — Motion and feedback (P2/P3)

- Transitions match the platform's easing and duration tokens; nothing arbitrary.
- Motion carries meaning (origin of a sheet, continuity of a shared element), not decoration.
- Reduce Motion honored with a cross-fade, not a disabled feature.
- Haptics used sparingly and semantically on mobile; none on desktop.
- Every tap has a visible press state within 100 ms.

## Pass 8 — Content (P2/P3)

- Sentence case where the platform uses it; no ALL CAPS labels on iOS.
- Button labels are verbs matching the action ("Delete draft", not "OK").
- No lorem ipsum, no placeholder that ships, no invented data presented as real.
- Error and empty copy is written for a person, not for a developer.
- Terminology consistent across screens and with the platform's own vocabulary.

---

## Output shape

```
## Summary
<2-3 sentences: what this is, the overall verdict, the single most important fix>

## Findings
### P0 — <title>
**What:** …
**Why it matters:** … [guideline name](url)
**Fix:** …

### P1 — …
```

Close with **"Not verifiable from what I was given"** listing anything the evidence couldn't
support. Never let an unverifiable item silently become a pass.
