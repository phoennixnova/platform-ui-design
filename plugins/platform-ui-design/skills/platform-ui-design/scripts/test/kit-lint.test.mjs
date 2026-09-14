import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHeader, lintFragment, lintKit } from "../lib/kit-lint.mjs";

const HDR = "<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled / plain · ref: apple-components.md §Buttons -->\n";
const rules = (f) => f.map(x => x.rule);

test("parseHeader reads all fields", () => {
  const r = parseHeader(HDR + "<section></section>");
  assert.equal(r.ok, true);
  assert.deepEqual(r.fields, { slot: "button", group: "Buttons", title: "Buttons", subtitle: "Filled / plain", ref: "apple-components.md §Buttons" });
});
test("parseHeader rejects a missing header", () => {
  assert.equal(parseHeader("<section></section>").ok, false);
});
test("parseHeader requires group and title", () => {
  assert.equal(parseHeader("<!-- slot: x · group: G -->\n").ok, false);
});
test("parseHeader keeps \" · \" inside a subtitle value", () => {
  const r = parseHeader("<!-- slot: button · group: Buttons · title: Buttons · subtitle: Filled / plain · small, medium, large · ref: apple-components.md §Buttons -->\n");
  assert.equal(r.ok, true);
  assert.equal(r.fields.subtitle, "Filled / plain · small, medium, large");
  assert.equal(r.fields.ref, "apple-components.md §Buttons");
});
test("parseHeader treats an unrecognized colon segment as continuation text", () => {
  const r = parseHeader("<!-- slot: x · group: G · title: T · subtitle: Sizes: small · large · ref: x -->\n");
  assert.equal(r.ok, true);
  assert.equal(r.fields.subtitle, "Sizes: small · large");
});

test("clean fragment has no findings", () => {
  const html = HDR + `<section class="pud-card"><button class="ios-btn ios-body" style="color: var(--ios-accent); background: transparent">Go</button>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16"/></svg></section>`;
  const css = ".ios-btn { min-height: 44px; color: inherit; border: 1px solid var(--ios-separator); }";
  assert.deepEqual(lintFragment({ path: "components/button.html", html, css, isComponent: true }), []);
});

test("hex literal in html is a finding with a line number", () => {
  const html = HDR + `<section>\n<div style="background: #FF0000">x</div></section>`;
  const f = lintFragment({ path: "components/a.html", html, isComponent: true });
  assert.deepEqual(rules(f), ["color-literal"]);
  assert.equal(f[0].line, 3);
  assert.equal(f[0].file, "components/a.html");
});
test("rgb() and named colors in css are findings; transparent/currentColor/inherit are not", () => {
  const css = ".a{color:rgb(1,2,3)}\n.b{color:white}\n.c{color:transparent;fill:currentColor;background:inherit}";
  const f = lintFragment({ path: "components/a.html", html: HDR + "<i></i>", css, isComponent: true });
  assert.deepEqual(f.map(x => [x.rule, x.line]), [["color-literal", 1], ["color-literal", 2]]);
  assert.equal(f[0].file, "components/a.css");
});
test("font-size is a finding", () => {
  const f = lintFragment({ path: "components/a.html", html: HDR + `<p style="font-size: 12px">x</p>`, isComponent: true });
  assert.deepEqual(rules(f), ["font-size"]);
});
test("emoji and img are findings", () => {
  const f = lintFragment({ path: "components/a.html", html: HDR + `<p>🚀</p>\n<img src="x.png">`, isComponent: true });
  assert.deepEqual(rules(f), ["emoji", "img-tag"]);
});
test("foundation cards skip the color rule but keep the others", () => {
  const html = "<!-- group: Foundations · title: Type -->\n<p style=\"color:#000\">x</p><img src=x>";
  assert.deepEqual(rules(lintFragment({ path: "foundations/type.html", html, isComponent: false })), ["img-tag"]);
});

test("lintKit cross-checks slots both ways", () => {
  const kit = { components: [{ slot: "button" }, { slot: "toggle" }] };
  const fragments = [
    { path: "components/button.html", html: HDR },
    { path: "components/fab.html", html: HDR.replace("slot: button", "slot: fab") },
  ];
  const f = lintKit({ kit, fragments });
  assert.deepEqual(f.map(x => [x.rule, x.detail]), [
    ["slot-missing", "toggle"],
    ["slot-unknown", "fab"],
  ]);
});
