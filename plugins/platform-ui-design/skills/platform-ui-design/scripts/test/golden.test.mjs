import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, "..", "make-artboards.mjs");
const GOLDEN = join(here, "fixtures", "golden");

function run(args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

const CASES = [
  ["both",    ["--platform", "both", "--screens", "Main,Detail"]],
  ["windows", ["--platform", "windows", "--screens", "Main,Detail", "--chrome", "topbar"]],
  ["ipad",    ["--platform", "ios", "--device", "ipad", "--screens", "Main", "--chrome", "none"]],
];

for (const [name, args] of CASES) {
  test(`artboards byte-identical to golden: ${name}`, () => {
    const out = mkdtempSync(join(tmpdir(), "pud-golden-"));
    try {
      run([...args, "--out", out]);
      const expected = readdirSync(join(GOLDEN, name)).sort();
      assert.deepEqual(readdirSync(out).sort(), expected);
      for (const f of expected) {
        assert.equal(readFileSync(join(out, f), "utf8"), readFileSync(join(GOLDEN, name, f), "utf8"), f);
      }
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
}

for (const p of ["ios", "android", "windows"]) {
  test(`--tokens ${p} css byte-identical`, () => {
    assert.equal(run(["--tokens", p, "--format", "css"]), readFileSync(join(GOLDEN, `tokens-${p}.css`), "utf8"));
  });
  test(`--tokens ${p} json byte-identical`, () => {
    assert.equal(run(["--tokens", p, "--format", "json"]), readFileSync(join(GOLDEN, `tokens-${p}.json`), "utf8"));
  });
}
