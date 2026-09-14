#!/usr/bin/env node
/**
 * build-kit.mjs — assemble a platform kit for Claude Design from kits/<platform>/.
 *
 *   node build-kit.mjs --platform ios|android|windows|all --out <dir> [--check] [--kits <dir>]
 *
 * Reads kit.json + fragments, lints them (see lib/kit-lint.mjs), wraps each into a complete
 * @dsCard HTML file (see lib/kit-wrap.mjs), and writes <out>/components, <out>/foundations
 * and <out>/manifest.json ({ path: sha256 }). Writes go to a temp dir and are renamed into
 * place, so <out> is never half-written. --check does everything except the final write, and
 * --out is only required when not --check.
 *
 * Platform discovery for `--platform all`: every subdirectory of the kits root that
 * contains a kit.json, in sorted order — not a hardcoded list, so a new platform (e.g.
 * macOS) needs no change here. A named platform must both have a kit.json and a
 * platform-tokens.mjs TOKENS entry.
 *
 * kit.json widths ("width"/"defaultWidth") are per-panel content widths; the card viewport
 * (the @dsCard width written into each built file) is derived from that by wrapCard.
 *
 * Exit codes: 0 ok · 1 lint failure · 2 bad arguments or missing kit.json.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lintFragment, lintKit, parseHeader } from "./lib/kit-lint.mjs";
import { wrapCard, colorsCard } from "./lib/kit-wrap.mjs";
import { TOKENS } from "./platform-tokens.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
function die(msg, code) { console.error(`error: ${msg}`); process.exit(code); }

const platformArg = arg("platform");
if (!platformArg || platformArg === true) die("--platform is required (a platform name or all)", 2);
const check = arg("check") === true;
const outArg = arg("out");
if (!check && (!outArg || outArg === true)) die("--out is required", 2);
const kitsRoot = resolve(String(arg("kits", join(here, "..", "kits"))));

// Discover which platforms exist under kitsRoot: any subdirectory holding a kit.json.
// (When --kits points directly at a single kit fixture, that dir itself is the only "platform" —
// resolved from the kit's own "platform" field, since the directory name carries no platform info.)
function discoverPlatforms() {
  const rootKitPath = join(kitsRoot, "kit.json");
  if (existsSync(rootKitPath)) {
    const kit = JSON.parse(readFileSync(rootKitPath, "utf8"));
    return [String(kit.platform ?? platformArg).toLowerCase()];
  }
  if (!existsSync(kitsRoot)) return [];
  return readdirSync(kitsRoot)
    .filter(name => {
      const full = join(kitsRoot, name);
      return statSync(full).isDirectory() && existsSync(join(full, "kit.json"));
    })
    .sort();
}

let platforms;
if (String(platformArg).toLowerCase() === "all") {
  platforms = discoverPlatforms();
  if (platforms.length === 0) die(`no platform kit.json found under ${kitsRoot}`, 2);
} else {
  platforms = [String(platformArg).toLowerCase()];
}

for (const p of platforms)
  if (!Object.prototype.hasOwnProperty.call(TOKENS, p)) die(`platform "${p}" has no entry in platform-tokens.mjs`, 2);

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const read = (p) => readFileSync(p, "utf8");

function loadKit(platform) {
  // When --kits points at a single kit (fixture), use it directly; otherwise kits/<platform>.
  const dir = existsSync(join(kitsRoot, "kit.json")) ? kitsRoot : join(kitsRoot, platform);
  const kitPath = join(dir, "kit.json");
  if (!existsSync(kitPath)) die(`no kit.json for ${platform} — expected ${kitPath}`, 2);
  const kit = JSON.parse(read(kitPath));
  const compDir = join(dir, "components");
  const fragments = existsSync(compDir)
    ? readdirSync(compDir).filter(f => f.endsWith(".html")).sort().map(f => {
        const cssPath = join(compDir, f.replace(/\.html$/, ".css"));
        return { path: `components/${f}`, html: read(join(compDir, f)), css: existsSync(cssPath) ? read(cssPath) : undefined };
      })
    : [];
  const foundDir = join(dir, "foundations");
  const foundations = (kit.foundations ?? []).map(meta => {
    if (meta.generated) return { meta, path: `foundations/${meta.id}.html`, generated: true };
    const p = join(foundDir, `${meta.id}.html`);
    if (!existsSync(p)) die(`foundation "${meta.id}" declared in kit.json but ${p} is missing`, 2);
    return { meta, path: `foundations/${meta.id}.html`, html: read(p) };
  });
  return { kit, fragments, foundations };
}

function buildPlatform(platform) {
  const { kit, fragments, foundations } = loadKit(platform);
  const findings = [
    ...fragments.flatMap(f => lintFragment({ ...f, isComponent: true })),
    ...foundations.filter(f => !f.generated).flatMap(f => lintFragment({ path: f.path, html: f.html, isComponent: false })),
    ...lintKit({ kit, fragments }),
  ];
  if (findings.length) {
    for (const f of findings) console.error(`${f.file}:${f.line}: ${f.rule} — ${f.detail}`);
    return { ok: false };
  }
  const widthFor = (slot) => (kit.components.find(c => c.slot === slot)?.width) ?? kit.defaultWidth ?? 720;
  const files = new Map();
  for (const f of fragments) {
    const { fields } = parseHeader(f.html);
    const body = f.html.replace(/^<!--[\s\S]*?-->\r?\n?/, "");
    files.set(f.path, wrapCard({ platform, header: fields, body, css: f.css, width: widthFor(fields.slot) }));
  }
  for (const f of foundations) {
    const width = f.meta.width ?? kit.defaultWidth ?? 720;
    if (f.generated) {
      const { header, body } = colorsCard(platform);
      files.set(f.path, wrapCard({ platform, header: { ...header, ...pick(f.meta, ["group", "title", "subtitle"]) }, body, width }));
    } else {
      const { fields } = parseHeader(f.html);
      const body = f.html.replace(/^<!--[\s\S]*?-->\r?\n?/, "");
      files.set(f.path, wrapCard({ platform, header: { ...pick(f.meta, ["group", "title", "subtitle"]), ...fields }, body, width }));
    }
  }
  const manifest = {};
  for (const p of [...files.keys()].sort()) manifest[p] = sha(files.get(p));
  files.set("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  return { ok: true, files, kit };
}

function pick(o, keys) { const r = {}; for (const k of keys) if (o[k] != null) r[k] = o[k]; return r; }

function writeBundle(outDir, files) {
  const parent = dirname(resolve(outDir));
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  const tmp = mkdtempSync(join(parent, ".kit-tmp-"));
  for (const [p, content] of files) {
    const full = join(tmp, p);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
  }
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  renameSync(tmp, outDir);
}

async function renderCheck(files) {
  let pw;
  try { pw = await import("playwright"); } catch { console.log("render check skipped (playwright not importable)"); return 0; }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  let errors = 0;
  page.on("pageerror", e => { errors++; console.error(`render: ${e.message}`); });
  page.on("console", m => { if (m.type() === "error") { errors++; console.error(`render: ${m.text()}`); } });
  for (const [p, html] of files) if (p.endsWith(".html")) await page.setContent(html, { waitUntil: "load" });
  await browser.close();
  console.log(`render check: ${errors} errors`);
  return errors;
}

let failed = false;
for (const platform of platforms) {
  const outDir = platforms.length > 1 ? join(String(outArg), `kit-${platform}`) : String(outArg);
  const r = buildPlatform(platform);
  if (!r.ok) { failed = true; continue; }
  const cards = [...r.files.keys()].filter(p => p.endsWith(".html")).length;
  if (check) {
    const errs = await renderCheck(r.files);
    if (errs) failed = true;
    console.log(`ok: ${platform} — ${cards} cards lint clean (check only, nothing written)`);
  } else {
    writeBundle(outDir, r.files);
    console.log(`ok: ${platform} — ${cards} cards -> ${outDir}`);
    console.log(`    project: ${r.kit.projectName}   next: see references/design-system-sync.md`);
  }
}
process.exit(failed ? 1 : 0);
