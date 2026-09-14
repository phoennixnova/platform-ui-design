# Platform UI Design

A Claude Code / Cowork plugin for designing and building app interfaces that actually follow
the platform rules — Apple's Human Interface Guidelines, Android's Material 3 and Android UI
guidance, and Microsoft's Fluent / Windows 11 guidance.

Ask for a screen, a component, a UI review or a mockup, and Claude works from ~6,900 lines of
sourced reference material instead of memory. Every metric, type size, color role and control
recommendation traces back to a cited page. Where a platform no longer publishes a number, the
reference says so rather than inventing one.

## Install

```
/plugin marketplace add phoennixnova/platform-ui-design
/plugin install platform-ui-design@btwelch-plugins
```

Or try it without installing:

```
claude --plugin-dir ./plugins/platform-ui-design
```

The skill loads on its own when a request involves platform UI work.

## What it does

| Mode | Produces |
|---|---|
| **Native code** | SwiftUI / UIKit / AppKit, Jetpack Compose, WinUI 3 / XAML |
| **Cross-platform code** | React Native, Flutter, web — with the platform forks in the right places |
| **Spec & critique** | Written specs and redlines; severity-ranked audits against an 8-pass rubric |
| **Visual mockups** | Platform-correct artboards published to a Claude Design canvas |

### Non-negotiables it enforces

44×44 pt / 48×48 dp / 40×40 px minimum targets. Dynamic Type and `sp`, never fixed sizes.
Semantic colors, color roles and theme brushes, never hardcoded hex. 4.5:1 text contrast.
Safe areas and window insets. Platform-correct back behavior. Size-class adaptivity instead of
a stretched phone layout. Dark mode everywhere.

## Claude Design integration

The plugin ships a generator that emits Claude Design artboards with the platform's real
geometry already wired in:

```bash
node plugins/platform-ui-design/skills/platform-ui-design/scripts/make-artboards.mjs \
  --platform ios --device iphone --screens Main,Detail,Settings --out ./design
```

Each artboard comes out at the device's exact logical size, with real safe-area insets
reserved (and no fake status bar drawn), real chrome heights, the platform's semantic color
tokens for light and dark, and its full type ramp as CSS classes — with `dark` and `accent`
wired as canvas tweaks. A `canvas.json` lays them out. Claude then hands the set to the
`design` skill to publish, so the mockup starts platform-correct instead of being corrected
afterwards.

| Flag | Values |
|---|---|
| `--platform` | `ios` · `android` · `windows` · `both` (matched iOS/Android pair per screen) |
| `--device` | preset key — `--list` prints all with dimensions |
| `--screens` | comma-separated PascalCase names |
| `--chrome` | any of `topbar,bottomnav,fab,none` |
| `--tokens` | `ios` · `android` · `windows` — dump the token set instead, `--format css\|json` |

When Claude Design isn't available in the session, the skill emits a complete paste-ready
Claude Design brief carrying the same metrics instead.

Requires Node 18+. No dependencies. Writes only to `--out`.

## Claude Design design systems

The plugin also ships each platform as a Claude Design design-system project, so screens
generated in claude.ai/design start from the platform's real components instead of guesses:

```bash
node plugins/platform-ui-design/skills/platform-ui-design/scripts/build-kit.mjs --platform ios --out ./dist/kit-ios
```

That writes 16 self-contained cards — 4 foundations (colors, type ramp, spacing & shape,
chrome metrics) and 12 components (navigation chrome, primary nav, buttons, icon buttons,
FAB-or-equivalent, list rows, text fields, toggles, selection, sheets & dialogs, search,
feedback) — each rendered light and dark from the same token module the artboards use, plus
a `manifest.json` of hashes. `kit.json` widths are per-panel content widths; the builder
derives each card's viewport from that (side by side ≤600, stacked above). Ask Claude to
"push the iOS kit to Claude Design" and it diffs the bundle against the `Platform UI · iOS`
project and writes only what changed. `--platform android` and `--platform windows` do the
same for Material 3 and Fluent; `--platform all` discovers every `kits/<platform>/kit.json`
directory, so a new platform folder is picked up automatically; `--render <dir>` screenshots every card (Playwright optional); `--check` lints without
writing.

Components are hand-authored fragments under `kits/<platform>/components/`; the build
refuses any fragment containing a color literal, a fixed `font-size`, an emoji or an `<img>`.

## Layout

```
plugins/platform-ui-design/
├── .claude-plugin/plugin.json
└── skills/platform-ui-design/
    ├── SKILL.md                    the workflow and the non-negotiables
    ├── references/
    │   ├── apple-foundations.md    layout, Dynamic Type, semantic colors, materials,
    │   │                           per-platform matrix, Liquid Glass
    │   ├── apple-components.md     58 components → SwiftUI/UIKit/AppKit, 106 mistakes
    │   ├── android-foundations.md  window size classes, type scale, 48 color roles,
    │   │                           elevation, shape, motion tokens
    │   ├── android-components.md   M3 components → Compose, adaptive layouts, insets
    │   ├── windows-fluent.md       type ramp, theme brushes, Mica/Acrylic,
    │   │                           NavigationView, ~45 WinUI controls
    │   ├── device-metrics.md       device sizes, chrome heights, insets
    │   ├── cross-platform.md       25-row divergence table, RN/Flutter, pt↔dp↔px
    │   ├── accessibility.md        WCAG 2.2 AA for apps, VoiceOver/TalkBack/Narrator,
    │   │                           20-item acceptance checklist
    │   ├── design-canvas.md        the Claude Design handoff contract
    │   ├── design-system-sync.md   the Claude Design kit push/diff contract
    │   └── review-rubric.md        8-pass audit with P0–P3 severities
    ├── kits/                       Claude Design kit sources, one dir per platform
    │   ├── ios/                    kit.json, 3 foundation fragments, 12 component fragments
    │   ├── android/                same shape, Material 3 fragments
    │   └── windows/                same shape, Fluent fragments
    └── scripts/
        ├── make-artboards.mjs      Mode V artboard/token generator
        ├── build-kit.mjs           assembles a kits/<platform>/ into a Claude Design bundle
        ├── platform-tokens.mjs     shared token/metric source for both generators
        ├── lib/                    kit-lint.mjs, kit-wrap.mjs — used by build-kit.mjs
        └── test/                   node --test suite for the generators and kit build
```

## Sources

The reference library summarizes published design documentation. **The copyright in that
documentation belongs to its owners — Apple, Google, Microsoft, the W3C and Meta — not to this
project.** [ATTRIBUTION.md](ATTRIBUTION.md) carries the full source table, the license
governing each, and the notices those licenses require. In short:

| Source | License | Open? |
|---|---|---|
| developer.android.com | CC BY 2.5 | **Yes** |
| androidx token source | Apache-2.0 | **Yes** |
| MicrosoftDocs/windows-dev-docs | CC BY 4.0 | **Yes** |
| WCAG 2.2 (W3C) | W3C Document License | **Yes**, with conditions |
| Flutter docs, React Native docs | CC BY 4.0 | **Yes** |
| m3.material.io guidelines | no license notice published | **Unknown** — treated as closed |
| Apple HIG and developer docs | all rights reserved | **No** |
| SF Symbols | Apple's SF Symbols license | **No** — no artwork included here |

Apple's documentation is the one fully closed source, and it is **excluded from this
repository's license**. What appears here are factual specifications — sizes, ratios, type
scales — independently selected, arranged and worded, each linking to Apple's own page. Facts
are not copyrightable ([*Feist v. Rural*](https://supreme.justia.com/cases/federal/us/499/340/));
Apple's prose is, and none of it is redistributed. If you find a passage that reads as Apple's
wording rather than a restatement, please open an issue.

A sourcing caveat worth knowing: Apple's HIG and `m3.material.io` are client-rendered and
return nothing to ordinary fetchers. The Apple material was compiled from the DocC JSON
endpoints behind those pages; the Material numbers come from the generated token source in
androidx — the same pipeline the spec site renders. Anything that could not be confirmed
against a primary source is labelled **convention (unverified)** in the references, and the
skill is instructed to carry that distinction into its output rather than presenting a
convention as a published rule. Compiled 2026-09-13.

## Trademarks

This project is an independent, unofficial reference, **not affiliated with, sponsored by, or
endorsed by** Apple Inc., Google LLC, or Microsoft Corporation. Apple, iOS, iPadOS, macOS,
watchOS, tvOS, visionOS and SF Symbols are trademarks of Apple Inc. Android, Material Design
and Flutter are trademarks of Google LLC. Microsoft, Windows, WinUI and Fluent are trademarks
of the Microsoft group of companies. All product names and brands are the property of their
respective owners.

## Contributing

Corrections are the most useful contribution — a wrong number, a stale guideline, a
mis-attributed source. Open an issue or a PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache-2.0](LICENSE) for this project's own work: the skill instructions, the review rubric,
the Claude Design handoff, the generator script, and the organization and wording of the
reference files. Third-party documentation keeps its own licenses — see
[NOTICE](NOTICE) and [ATTRIBUTION.md](ATTRIBUTION.md).
