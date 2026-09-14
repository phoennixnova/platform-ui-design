import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, "..", "build-kit.mjs");
const FX = join(here, "fixtures");
const run = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
const tmp = () => mkdtempSync(join(tmpdir(), "pud-kit-"));
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

test("bad args exit 2", () => {
  assert.equal(run(["--platform", "amiga", "--out", "x"]).status, 2);
  assert.equal(run(["--out", "x"]).status, 2, "missing --platform");
  const r = run(["--platform", "ios", "--kits", join(FX, "nope"), "--out", "x"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /kit\.json/);
  const noOut = run(["--platform", "ios", "--kits", join(FX, "kit-good")]);
  assert.equal(noOut.status, 2, "--out still required for a real build");
});

test("--check without --out: no --out required, lints, writes nothing", () => {
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--check"]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /lint clean/);
});

test("good kit builds: cards, manifest, exit 0", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(readdirSync(out).sort(), ["components", "foundations", "manifest.json"]);
  assert.deepEqual(readdirSync(join(out, "components")), ["button.html"]);
  assert.deepEqual(readdirSync(join(out, "foundations")).sort(), ["colors.html", "type.html"]);
  const card = readFileSync(join(out, "components", "button.html"), "utf8");
  assert.match(card.split("\n")[0], /^<!-- @dsCard group="Buttons" name="Buttons" subtitle="Filled" width="720" -->$/);
  assert.match(card, /\.ios-btn \{ min-height: 44px;/);
  const manifest = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"));
  assert.deepEqual(Object.keys(manifest), ["components/button.html", "foundations/colors.html", "foundations/type.html"]);
  for (const [p, h] of Object.entries(manifest))
    assert.equal(h, sha(readFileSync(join(out, p))), p);
  // no color literal in the built component outside the generated <style> token block
  const afterStyle = card.slice(card.indexOf("</style>"));
  assert.doesNotMatch(afterStyle, /#[0-9a-fA-F]{6}\b/);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("bad kit: lint findings on stderr, exit 1, nothing written", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-bad"), "--out", out]);
  assert.equal(r.status, 1);
  for (const rule of ["color-literal", "font-size", "emoji", "img-tag", "slot-missing"])
    assert.match(r.stderr, new RegExp(rule), rule);
  assert.match(r.stderr, /components\/button\.html:2: color-literal/);
  assert.equal(existsSync(out), false);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("--check writes nothing and exits 0 on a good kit", () => {
  const out = join(tmp(), "kit-ios");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out, "--check"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(out), false);
  assert.match(r.stdout, /render check skipped|render check: 0 errors/);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("rebuild replaces the bundle atomically (no stale files)", () => {
  const out = join(tmp(), "kit-ios");
  run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  const stale = join(out, "components", "stale.html");
  writeFileSync(stale, "stale");
  const r = run(["--platform", "ios", "--kits", join(FX, "kit-good"), "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(stale), false);
  rmSync(dirname(out), { recursive: true, force: true });
});

test("--platform all discovers platform kit dirs, builds each, skips decoys", () => {
  const root = tmp();
  cpSync(join(FX, "kit-good"), join(root, "ios"), { recursive: true });
  cpSync(join(FX, "kit-good"), join(root, "android"), { recursive: true });
  mkdirSync(join(root, "decoy"), { recursive: true }); // no kit.json — must be skipped
  writeFileSync(join(root, "decoy", "notes.txt"), "not a kit");

  // Re-platform the android copy: kit.json platform field, ramp class, and accent token.
  const androidKitPath = join(root, "android", "kit.json");
  const androidKit = JSON.parse(readFileSync(androidKitPath, "utf8"));
  androidKit.platform = "android";
  writeFileSync(androidKitPath, JSON.stringify(androidKit, null, 2) + "\n");
  const typePath = join(root, "android", "foundations", "type.html");
  writeFileSync(typePath, readFileSync(typePath, "utf8").replace("ios-body", "md-label-large"));
  const cssPath = join(root, "android", "components", "button.css");
  writeFileSync(cssPath, readFileSync(cssPath, "utf8").replace("var(--ios-accent)", "var(--md-accent)"));

  const out = join(tmp(), "kits");
  const r = run(["--platform", "all", "--kits", root, "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(readdirSync(out).sort(), ["kit-android", "kit-ios"]);
  for (const dir of ["kit-android", "kit-ios"]) {
    const manifest = JSON.parse(readFileSync(join(out, dir, "manifest.json"), "utf8"));
    assert.equal(Object.keys(manifest).length, 3, dir);
  }
  rmSync(root, { recursive: true, force: true });
  rmSync(dirname(out), { recursive: true, force: true });
});

test("--platform all with no platform kit.json anywhere exits 2", () => {
  const root = tmp();
  mkdirSync(join(root, "decoy"), { recursive: true }); // no kit.json
  const out = join(tmp(), "kits");
  const r = run(["--platform", "all", "--kits", root, "--out", out]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /no platform kit\.json found/);
  rmSync(root, { recursive: true, force: true });
});

test("--platform all fails when a discovered platform has no TOKENS entry", () => {
  const root = tmp();
  cpSync(join(FX, "kit-good"), join(root, "amiga"), { recursive: true });
  const out = join(tmp(), "kits");
  const r = run(["--platform", "all", "--kits", root, "--out", out]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /platform "amiga" has no entry in platform-tokens\.mjs/);
  rmSync(root, { recursive: true, force: true });
});

test("--platform all in single-kit fixture mode resolves the kit's own platform field", () => {
  const out = join(tmp(), "kit-out");
  const r = run(["--platform", "all", "--kits", join(FX, "kit-good"), "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(readdirSync(out).sort(), ["components", "foundations", "manifest.json"]);
  rmSync(dirname(out), { recursive: true, force: true });
});
