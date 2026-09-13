# Sources and attribution

This repository's own contribution — the skill instructions, the review rubric, the Claude
Design handoff, the artboard generator, and the organization and wording of the reference
files — is licensed under Apache-2.0 (see [LICENSE](LICENSE)).

The *subject matter* of the reference library is other people's published documentation.
**The copyright in that documentation belongs to its respective owners — Apple Inc.,
Google LLC, Microsoft Corporation, the W3C, and Meta Platforms, Inc. — not to this project
or its author.** Nothing here transfers, dilutes, or claims any right in it. Where a source's
license permits reuse, this file carries the attribution that license requires. Where it does
not, the material was restated rather than reproduced.

A note on what is actually being reused: most of this library is **measurements and rules** —
44pt, 48dp, 4.5:1, a type ramp, a breakpoint table. Facts are not copyrightable in the US
([*Feist Publications v. Rural Telephone Service*, 499 U.S. 340 (1991)](https://supreme.justia.com/cases/federal/us/499/340/)),
and this project selected, arranged and worded them independently. Expression is a different
question, and the table below is where that distinction is tracked.

None of this is legal advice.

---

## Source status at a glance

| Source | Copyright | License | Open? | How it is used here |
|---|---|---|---|---|
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) | Apple Inc. | All rights reserved | **No** | Specifications restated in this project's own words; links to the originals. No Apple prose redistributed. |
| [Apple Developer Documentation](https://developer.apple.com/documentation/) | Apple Inc. | All rights reserved | **No** | API and symbol *names* only (nominative use), plus links. |
| [SF Symbols](https://developer.apple.com/sf-symbols/) | Apple Inc. | Apple's own SF Symbols license | **No** | Named and described only. **No symbol artwork is included in this repo.** The license restricts use to building UI for Apple-platform software — read it before using symbols in your own work. |
| [developer.android.com](https://developer.android.com/design/ui) | Google LLC / AOSP | **CC BY 2.5** (content); Apache-2.0 (code samples) | **Yes** | Summarized and adapted, with the attribution Google specifies. |
| [androidx source](https://github.com/androidx/androidx) (`compose.material3.tokens`) | The Android Open Source Project | **Apache-2.0** | **Yes** | Token values extracted and reformatted into tables. Modified. |
| [m3.material.io](https://m3.material.io/) (Material 3 guidelines) | Google LLC | **Not established** — no license notice is published on the current site | **Unknown** | Treated as all-rights-reserved. Numbers taken from the androidx token source above, not from the site; the site is cited for spec authority only. |
| [MicrosoftDocs/windows-dev-docs](https://github.com/MicrosoftDocs/windows-dev-docs) | Microsoft Corporation | **CC BY 4.0** (content); MIT (code) | **Yes** | Summarized and adapted, with changes. Rendered pages on learn.microsoft.com carry stricter terms of use; this project relies on the open repo. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | W3C (MIT, ERCIM, Keio, Beihang) | **W3C Document License** | **Yes**, with conditions | Success criteria quoted and summarized, with the required notice and link. |
| [docs.flutter.dev](https://docs.flutter.dev/) | Google LLC | **CC BY 4.0** (content); BSD-3-Clause (code) | **Yes** | Platform-adaptation guidance summarized. |
| [reactnative.dev](https://github.com/facebook/react-native-website) | Meta Platforms, Inc. | **CC BY 4.0** (docs); MIT (code) | **Yes** | Platform-adaptation guidance summarized. |
| [useyourloaf.com](https://useyourloaf.com/), [iosref.com](https://iosref.com/res) | Keith Harrison; iosref | All rights reserved | **No** | Device dimensions cross-checked as *facts*; no prose reproduced. |

---

## Required attribution notices

### Android Open Source Project — CC BY 2.5

> Portions of this work are modifications based on work created and shared by the Android
> Open Source Project and used according to terms described in the
> [Creative Commons 2.5 Attribution License](https://creativecommons.org/licenses/by/2.5/).

Source pages are linked inline throughout `references/android-foundations.md` and
`references/android-components.md`. License terms: <https://developer.android.com/license>

### androidx / AOSP — Apache-2.0

Design token values in `references/android-foundations.md` are derived from generated token
source in the androidx repository, Copyright The Android Open Source Project, licensed under
the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The values
were extracted and reformatted into tables by this project; they are not reproduced as source
code. The same values appear in `scripts/make-artboards.mjs` as a token map.

### Microsoft — CC BY 4.0

> © Microsoft Corporation. Portions of `references/windows-fluent.md` are adapted from
> [MicrosoftDocs/windows-dev-docs](https://github.com/MicrosoftDocs/windows-dev-docs),
> licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes were made:
> the material was condensed into reference tables and reorganized.

### W3C — W3C Document License

> Copyright © 2020–2024 World Wide Web Consortium.
> [W3C liability, trademark and document use rules](https://www.w3.org/copyright/document-license/) apply.

Applies to WCAG 2.2 material summarized in `references/accessibility.md`.
Original: <https://www.w3.org/TR/WCAG22/>

### Flutter and React Native — CC BY 4.0

Platform-adaptation guidance in `references/cross-platform.md` is adapted from
[docs.flutter.dev](https://docs.flutter.dev/) (© Google LLC) and the
[React Native documentation](https://github.com/facebook/react-native-website)
(© Meta Platforms, Inc.), both under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes were made.

### Apple — no license granted

Apple's Human Interface Guidelines and developer documentation are **© Apple Inc., all rights
reserved**, and are **excluded from this repository's Apache-2.0 grant**. Apple publishes no
open license for that content, so this project does not redistribute it. What appears in
`references/apple-foundations.md` and `references/apple-components.md` is:

- **Factual specifications** — sizes, ratios, type scales, platform support — independently
  selected, arranged and worded here, with a link to Apple's page for each.
- **Names** — of components, APIs, symbols and features, used referentially.

If you find a passage that reads as Apple's own wording rather than a restatement, please
[open an issue](../../issues) and it will be rewritten.

---

## Trademarks

This project is an independent, unofficial reference. It is **not affiliated with, sponsored
by, or endorsed by** Apple Inc., Google LLC, or Microsoft Corporation.

- Apple, iOS, iPadOS, macOS, watchOS, tvOS, visionOS, SF Symbols and the Apple logo are
  trademarks of Apple Inc., registered in the U.S. and other countries.
- Android, Material Design, Wear OS, ChromeOS, Flutter and the Android logo are trademarks
  of Google LLC.
- Microsoft, Windows, WinUI and Fluent are trademarks of the Microsoft group of companies.
- React Native is a trademark of Meta Platforms, Inc.
- Claude and Claude Code are trademarks of Anthropic, PBC.

All product names, logos and brands are the property of their respective owners. All company,
product and service names used here are for identification purposes only.

---

## Keeping this honest

These guidelines change — Apple ships HIG revisions annually, Material moves continuously, and
several values in the references are marked *convention (unverified)* because the publishers'
sites could not be fetched to confirm them. If you spot a value that is wrong, out of date, or
attributed to the wrong source, please open an issue. Corrections to this file are as welcome
as corrections to the content.
