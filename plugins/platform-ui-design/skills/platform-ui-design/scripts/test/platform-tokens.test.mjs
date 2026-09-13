import { test } from "node:test";
import assert from "node:assert/strict";
import { TOKENS, PREFIX, SURFACE, CHROME, DEVICES } from "../platform-tokens.mjs";

const PLATFORMS = ["ios", "android", "windows"];

for (const p of PLATFORMS) {
  test(`${p}: light and dark define the same roles`, () => {
    assert.deepEqual(Object.keys(TOKENS[p].light).sort(), Object.keys(TOKENS[p].dark).sort());
  });
  test(`${p}: every color value is a hex or rgba literal`, () => {
    const ok = /^(#[0-9A-Fa-f]{6}|rgba\(\d+,\d+,\d+,[0-9.]+\))$/;
    for (const theme of ["light", "dark"])
      for (const [k, v] of Object.entries(TOKENS[p][theme]))
        assert.match(v, ok, `${p}.${theme}.${k} = ${v}`);
    assert.match(TOKENS[p].accentDefault, ok);
    assert.match(TOKENS[p].accentDark, ok);
  });
  test(`${p}: type ramp rows are [name, size, lineHeight, weight]`, () => {
    for (const row of TOKENS[p].type) {
      assert.equal(row.length, 4);
      assert.match(row[0], /^[a-z0-9-]+$/);
      assert.ok(row[1] > 0 && row[2] >= row[1], `${row[0]} line-height < size`);
      assert.ok([400, 500, 600, 700].includes(row[3]), `${row[0]} weight`);
    }
  });
  test(`${p}: SURFACE roles exist in the token set`, () => {
    assert.ok(TOKENS[p].light[SURFACE[p].bg], SURFACE[p].bg);
    assert.ok(TOKENS[p].light[SURFACE[p].fg], SURFACE[p].fg);
  });
  test(`${p}: PREFIX, CHROME and DEVICES present`, () => {
    assert.ok(PREFIX[p]);
    assert.ok(CHROME[p].topBar >= 0 && CHROME[p].margin > 0);
    assert.ok(Object.keys(DEVICES[p]).length >= 3);
  });
}
