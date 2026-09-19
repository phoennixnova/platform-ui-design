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

## Pass 0 — Scope and inventory (no findings; decides what the other passes may touch)

Do this before reading any other reference file. Its output is a short block at the top of the
review; everything in Passes 1–8 is conditional on it.

1. **Platforms in scope.** Only platforms the product ships or is actively building. Evidence:
   the project's CLAUDE.md / README / build config — `src-tauri/gen/<platform>`, `*.xcodeproj`,
   `AndroidManifest.xml`, `Package.appxmanifest`, `capacitor.config.*`, `app.json`. A platform
   described as "future", "later", "not yet scaffolded", or with no build target is **out of
   scope**: name it in one line ("Android: future target, not audited") and do not audit it.
2. **Surface type.** Native (SwiftUI / UIKit / Compose / WinUI) or web-in-shell (Tauri,
   Electron, Capacitor, PWA, plain browser). For web-in-shell surfaces the platform's *native
   component catalogue does not apply*: absence of a FAB, navigation rail, tab bar,
   NavigationView, CommandBar, Mica, ContentDialog, SF Symbols / Material Symbols / Segoe icons
   is not a finding. What still applies: safe areas and insets, hit targets, back handling,
   text scaling, contrast, keyboard access, window-size behaviour, focus order, motion.
3. **Inventory.** List the screens and control types that actually exist — from the routes,
   component directory, or the screenshots supplied. Passes 1–8 apply only to inventory items.
   A platform component the product lacks is a finding *only* when the product needs that
   function and has no equivalent of its own.
4. **Recorded deviations.** Read CLAUDE.md, the design README and any decision log the project
   keeps. A deliberate, documented deviation is reported once under "Deviations noted", never
   as a P0–P3 finding.
5. **References to load.** From 1–2, name the reference files this review needs and read only
   those. A web-in-shell review on Windows + iPad needs `accessibility.md`, `device-metrics.md`
   and the foundations files for those two platforms — not the component catalogues.

Output block:

```
Scope: Windows (Tauri desktop), iPadOS (Tauri) — in scope. Android — future target, not audited.
Surface: web-in-shell (React + Tauri 2). Native component catalogues not applied.
Inventory: 3 pages, ribbon (14 sections), popovers, context menu, pull-down, 2 dialogs, tool rail.
Deviations noted: design README §3.2 (popovers stay open on choose), §5 platform-exception table.
References: accessibility.md, device-metrics.md, apple-foundations.md, windows-fluent.md.
```

If Pass 0 removes a platform or a whole pass, say so in one line and move on. Do not run a
pass "for completeness" on something the inventory does not contain.

## Interview — triage, then ask, then go deep

An audit runs in three stages. Stage 1 and 2 together should cost one or two turns.

**Stage 1 — Triage.** Pass 0, plus a skim of the inventory that yields one line per design
area below: a *candidate* ("Layout: popovers unclamped below 820 px") or "nothing observed".
No file:line evidence yet. Read the project's known-issues / plan document if it has one and
mark candidates already filed there as *known*. If `docs/ui-review-scope.md` exists, read it
and skip straight to the confirmation question in Stage 2.

**Stage 2 — One `AskUserQuestion` round, multi-select where marked.**

| # | Question | Options |
|---|---|---|
| 1 | Which pages / control groups? *(multi)* | the inventory, grouped; "everything" |
| 2 | Which design areas? *(multi)* | Platform idiom (P1) · Sizes & hit targets (P2) · Color, theming & contrast (P3 + the contrast half of P6) · Layout & window sizes (P4) · States & feedback (P5, P7) · Accessibility — semantics, focus, keyboard, screen reader (P6) · Motion (P7) · Copy & content (P8). Default = areas with a candidate. |
| 3 | Anything to leave out? *(multi)* | each candidate, each *known* item, each documented deviation |
| 4 | Depth | Findings only · Findings + fixes · Findings + fixes + tests |

When a scope file exists, ask one question instead: "Last time: <3-line summary>. Reuse, or
adjust?" — and only fall back to the four questions on "adjust".

**Stage 3 — Deep pass**, only on the chosen pages × areas. File:line or screenshot evidence
for every finding; references loaded by *section* (`grep -n "^##" references/<file>.md`, then
read the named sections); screenshots only for Layout at the in-scope breakpoints.

**Persist.** Write the answers to `docs/ui-review-scope.md` in the project:

```markdown
# UI review scope
Updated: 2026-09-19
Platforms: Windows (Tauri), iPadOS (Tauri). Out: Android (future).
Surface: web-in-shell.
Pages / controls: Design page — Text ribbon section, Move popover, tool rail.
Areas: Layout & window sizes, Accessibility, Sizes & hit targets.
Excluded: loop-command popover placement (deliberate, README §3.2); Space-key activation (filed, Plan §3).
Depth: findings + fixes.
```

Write the findings to `docs/ui-review-<YYYY-MM-DD>.md` in the Output shape below; the chat
reply is the Summary plus the P0/P1 titles. A rerun on the same scope diffs against the last
file and reports only new, changed and resolved items.

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
