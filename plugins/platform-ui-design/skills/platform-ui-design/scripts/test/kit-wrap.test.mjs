import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenStyle, baseCardCss, wrapCard, colorsCard, dsCardComment } from "../lib/kit-wrap.mjs";
import { TOKENS } from "../platform-tokens.mjs";

test("dsCardComment escapes quotes and carries width", () => {
  assert.equal(
    dsCardComment({ group: "Buttons", title: 'Say "hi"', subtitle: "A / B" }, 720),
    '<!-- @dsCard group="Buttons" name="Say &quot;hi&quot;" subtitle="A / B" width="720" -->'
  );
});

test("tokenStyle has light on :root, dark on .pud-dark, and the ramp", () => {
  const s = tokenStyle("ios");
  assert.match(s, /:root \{[^}]*--ios-label: #000000;/);
  assert.match(s, /\.pud-dark \{[^}]*--ios-label: #FFFFFF;/);
  assert.match(s, /--ios-accent: #007AFF;[\s\S]*\.pud-dark \{[^}]*--ios-accent: #0A84FF;/);
  assert.match(s, /\.ios-body \{ font-size: 17px;/);
  assert.match(s, /:root \{[^}]*--pud-on-accent: #FFFFFF;/);
  assert.match(s, /\.pud-dark \{[^}]*--pud-on-accent: #FFFFFF;/);
  assert.match(s, /--ios-font: -apple-system/);
});

test("tokenStyle puts black on-accent text on the Windows dark accent", () => {
  const s = tokenStyle("windows");
  assert.match(s, /\.pud-dark \{[^}]*--pud-on-accent: #000000;/);
});

test("wrapCard produces the documented structure", () => {
  const out = wrapCard({
    platform: "android",
    header: { group: "Buttons", title: "Buttons", subtitle: "Filled", ref: "android-components.md §Buttons" },
    body: "<section class=\"pud-card\"><button class=\"md-btn md-label-large\">Go</button></section>",
    css: ".md-btn { min-height: 48px; }",
    width: 720,
  });
  const lines = out.split("\n");
  // width 720 > 600 -> panels stack vertically; viewport is one panel + padding (720 + 48 = 768)
  assert.equal(lines[0], '<!-- @dsCard group="Buttons" name="Buttons" subtitle="Filled" width="768" -->');
  assert.match(out, /<style>[\s\S]*--md-primary: #6750A4;[\s\S]*\.md-btn \{ min-height: 48px; \}[\s\S]*<\/style>/);
  assert.equal((out.match(/<section class="pud-card">/g) ?? []).length, 2, "fragment appears twice");
  assert.match(out, /<div class="pud-pair pud-pair--stack">/);
  assert.match(out, /<div class="pud-theme"><span class="pud-label">Light<\/span>/);
  assert.match(out, /<div class="pud-theme pud-dark"><span class="pud-label">Dark<\/span>/);
  assert.match(out, /<p class="pud-caption">Source: android-components.md §Buttons<\/p>\s*$/);
});

test("wrapCard keeps panels side by side under the 600px threshold", () => {
  const out = wrapCard({
    platform: "android",
    header: { group: "Buttons", title: "Buttons" },
    body: "<section class=\"pud-card\"><button class=\"md-btn\">Go</button></section>",
    width: 360,
  });
  const lines = out.split("\n");
  // width 360 <= 600 -> panels side by side; viewport = 2 * (360 + 48) + 24 = 840
  assert.equal(lines[0], '<!-- @dsCard group="Buttons" name="Buttons" width="840" -->');
  assert.match(out, /<div class="pud-pair">\n/);
  assert.doesNotMatch(out, /<div class="pud-pair pud-pair--stack">/);
});

test("wrapCard without ref omits the caption", () => {
  const out = wrapCard({ platform: "ios", header: { group: "G", title: "T" }, body: "<i></i>", width: 720 });
  assert.doesNotMatch(out, /pud-caption/);
});

test("colorsCard lists every role with light and dark values", () => {
  const { header, body } = colorsCard("windows");
  assert.equal(header.group, "Foundations");
  assert.equal(header.title, "Colors");
  for (const [role, v] of Object.entries(TOKENS.windows.light)) {
    assert.ok(body.includes(`--win-${role}`), role);
    assert.ok(body.includes(v), `${role} light value`);
    assert.ok(body.includes(TOKENS.windows.dark[role]), `${role} dark value`);
  }
  assert.ok(body.includes("#0067C0") && body.includes("#60CDFF"), "accent both themes");
});

test("baseCardCss paints the card surface from the platform's SURFACE pair", () => {
  assert.match(baseCardCss("ios"), /\.pud-theme \{[^}]*background: var\(--ios-bg\);[^}]*color: var\(--ios-label\);/);
  assert.match(baseCardCss("android"), /background: var\(--md-surface\);[^}]*color: var\(--md-on-surface\);/);
});
