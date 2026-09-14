# Contributing

The most valuable contribution here is a **correction**: a number that's wrong, a guideline
that's moved, a source that's mis-attributed, a value marked *convention (unverified)* that you
can confirm against a primary source.

## Ground rules for reference content

1. **Cite the primary source.** Every value needs a link to the page that publishes it. A
   secondary blog is acceptable only when no primary page publishes the number, and then the
   entry must be marked `convention (unverified)`.
2. **Never present a convention as a published rule.** Apple no longer publishes numeric layout
   margins; much of the Material spec site can't be fetched. Where the platform is silent, say
   so. This distinction is the point of the library.
3. **Don't paste vendor prose.** Restate specifications in your own words. Apple documentation
   in particular is all-rights-reserved and excluded from this repo's license — see
   [ATTRIBUTION.md](ATTRIBUTION.md). Facts and numbers are fine; sentences are not.
4. **Attribute open sources properly.** Content from developer.android.com (CC BY 2.5),
   MicrosoftDocs (CC BY 4.0), W3C, Flutter or React Native must keep its required notice. If
   you add a new source, add it to the table in ATTRIBUTION.md in the same PR.
5. **No vendor artwork.** No SF Symbols, no Material Symbols files, no logos, no screenshots
   from vendor docs.

## Changing the skill

- `SKILL.md` is instructions for Claude, not documentation for a reader. Imperative, terse,
  under ~3,000 words. Detail belongs in `references/`.
- Keep the reference table in `SKILL.md` in sync when adding or renaming a reference file.
- Bump `version` in **both** `plugins/platform-ui-design/.claude-plugin/plugin.json` and the
  matching entry in `.claude-plugin/marketplace.json`. Nothing enforces this automatically, and
  users only get updates when the version string changes.

## Changing the generator

`scripts/make-artboards.mjs` has no dependencies and must stay that way. It writes only to
`--out`. Before opening a PR, confirm that every emitted artboard's frame size matches its
`canvas.json` entry:

```bash
node scripts/make-artboards.mjs --platform both --screens Main,Detail --out /tmp/check
node scripts/make-artboards.mjs --platform windows --screens Main --out /tmp/check-win
```

Artboards must remain valid Design Components: the `<script src="./support.js"></script>` head
line exactly as-is, `data-props` single-quoted with `&` and `'` escaped, one artboard named
`Main.dc.html`, and only known keys in `canvas.json`.

Token values for both generators — artboards and kits — live in one place,
`scripts/platform-tokens.mjs`. Run the test suite after any change to it:

```
node --test "plugins/platform-ui-design/skills/platform-ui-design/scripts/test/*.test.mjs"
```

(the glob form, not a bare directory — Node 22+ resolves a directory argument differently and
the suite will not be found). The golden test will fail if artboard output changes;
regenerate the fixtures with the commands in Task 1 step 1 **only** when the change to output
is intended, and say so in the commit message.

Kit fragments: run `node scripts/build-kit.mjs --platform all --check` before opening a PR
that touches anything under `kits/`.

## Adding a platform

To add a fourth platform kit (say, macOS):

1. Add `TOKENS`, `CHROME`, `DEVICES`, `PREFIX`, and `SURFACE` entries for it in
   `scripts/platform-tokens.mjs` (plus `onAccent` in the token set — every existing platform
   defines one and the kit build assumes it does too).
2. Create `kits/<platform>/kit.json` plus `foundations/type.html`,
   `foundations/spacing-shape.html`, `foundations/chrome-metrics.html`, and 12
   `components/<slot>.html` fragments using the same slot ids the other platforms use:
   `top-chrome`, `primary-nav`, `button`, `icon-button`, `fab`, `list-row`, `text-field`,
   `toggle`, `selection`, `sheet-dialog`, `search`, `feedback`.
3. Add `references/<platform>.md` following the sourcing rules in "Ground rules for
   reference content" above — cited primary sources, no vendor prose, conventions marked as
   such.
4. Run the test suite and `node scripts/build-kit.mjs --platform <platform> --check`.
   `--platform all` discovers every `kits/*/kit.json` directory automatically, so once the kit
   passes `--check` it is already included in `--platform all` runs — no registration step.
5. Add the platform to the SKILL.md §1 non-negotiables table and to the §2 reference list.

## Suggesting a source

To propose a new best-practice page for the reference library, open a GitHub issue using the
"Source suggestion" template with the page's URL, its license, which `references/*.md` file
and section it affects, and what number or rule it adds or corrects. Maintainers fold accepted
sources into `references/*.md` with a citation and a new row in `ATTRIBUTION.md`. Apple-owned
prose is never copied into this repository regardless of what the suggestion quotes — see
`ATTRIBUTION.md` for why, and restate any Apple-sourced fact in this project's own words.

## Validating before you push

```bash
claude plugin validate ./plugins/platform-ui-design
```

CI runs a structural check on every PR.
