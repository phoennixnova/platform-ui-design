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

## Validating before you push

```bash
claude plugin validate ./plugins/platform-ui-design
```

CI runs a structural check on every PR.
