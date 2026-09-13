#!/usr/bin/env node
/**
 * make-artboards.mjs — generate platform-correct Claude Design artboards.
 *
 * Emits one `<Screen>.dc.html` per screen plus a `canvas.json`, ready to hand to
 * the `design` skill's seeder. Each artboard is a real device frame at its exact
 * logical size, with the platform's semantic color tokens, type ramp, chrome
 * heights and safe-area insets already wired — so the design work is content,
 * not metrics archaeology.
 *
 * Usage:
 *   node make-artboards.mjs --platform ios --device iphone \
 *        --screens Main,Detail,Settings --out ./design
 *
 *   --platform  ios | android | windows | both   (both = ios + android pair per screen)
 *   --device    preset name (see --list)
 *   --screens   comma-separated PascalCase names; the first becomes Main.dc.html
 *               unless one is already named Main
 *   --out       output directory (created if absent)
 *   --chrome    comma-separated regions to scaffold: topbar,bottomnav,fab,none
 *               default: topbar,bottomnav
 *   --list      print device presets and exit
 *
 * Metrics source: ../references/device-metrics.md (values flagged there as
 * "convention (unverified)" are used as defaults and marked in the output).
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/* ------------------------------------------------------------------ presets */

const DEVICES = {
  ios: {
    "iphone-se":   { label: "iPhone SE (3rd gen)", w: 375,  h: 667,  top: 20, bottom: 0  },
    "iphone":      { label: "iPhone 15/16 base",   w: 393,  h: 852,  top: 59, bottom: 34 },
    "iphone-pro":  { label: "iPhone 16/17 Pro",    w: 402,  h: 874,  top: 62, bottom: 34 },
    "iphone-max":  { label: "iPhone Pro Max",      w: 440,  h: 956,  top: 62, bottom: 34 },
    "ipad":        { label: "iPad Air 11\"",       w: 820,  h: 1180, top: 24, bottom: 20, regular: true },
    "ipad-pro":    { label: "iPad Pro 13\"",       w: 1032, h: 1376, top: 24, bottom: 20, regular: true },
  },
  android: {
    "phone-compact": { label: "Material compact ref", w: 360, h: 800,  top: 24, bottom: 24, sizeClass: "compact" },
    "phone":         { label: "Pixel 8/9 class",      w: 412, h: 915,  top: 24, bottom: 24, sizeClass: "compact" },
    "fold-open":     { label: "Foldable, unfolded",   w: 775, h: 930,  top: 24, bottom: 24, sizeClass: "medium"  },
    "tablet":        { label: "10\" tablet",          w: 800, h: 1280, top: 24, bottom: 24, sizeClass: "medium"  },
    "tablet-lg":     { label: "Large tablet",         w: 929, h: 1486, top: 24, bottom: 24, sizeClass: "expanded" },
  },
  windows: {
    "desktop":    { label: "Windows window, medium", w: 1008, h: 720, top: 32, bottom: 0, breakpoint: "medium" },
    "desktop-lg": { label: "Windows window, large",  w: 1440, h: 900, top: 32, bottom: 0, breakpoint: "large"  },
    "desktop-sm": { label: "Windows window, small",  w: 640,  h: 720, top: 32, bottom: 0, breakpoint: "small"  },
  },
};

// Chrome metrics. Fields not consumed by the scaffold (topBarLarge, rail, navPane, gutter…)
// are carried deliberately: they are the values an author needs when extending an artboard,
// and `--tokens --format json` emits them. See references/device-metrics.md for provenance.
const CHROME = {
  ios:     { topBar: 44, topBarLarge: 96, bottomNav: 49, margin: 16, marginRegular: 20, row: 44, radius: 10 },
  android: { topBar: 64, topBarMedium: 112, bottomNav: 80, rail: 80, margin: 16, marginMedium: 24, row: 56, fab: 56, radius: 12 },
  windows: { topBar: 48, titleBar: 32, bottomNav: 0, navPane: 320, navCompact: 48, margin: 24, gutter: 12, row: 40, radius: 4 },
};

/** Resolve a --device key for a platform. One rule, used everywhere, so the emitted
 *  artboard and its canvas.json entry can never disagree about the frame size. */
function resolveDevice(platform, key) {
  const devs = DEVICES[platform];
  if (key && devs[key]) return [key, devs[key]];
  const fallback = Object.keys(devs)[1] ?? Object.keys(devs)[0];
  return [fallback, devs[fallback]];
}

/* ------------------------------------------------------------------- tokens */

const TOKENS = {
  ios: {
    font: `-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif`,
    light: {
      "label": "#000000",
      "label-secondary": "rgba(60,60,67,0.60)",
      "label-tertiary": "rgba(60,60,67,0.30)",
      "bg": "#FFFFFF",
      "bg-secondary": "#F2F2F7",
      "bg-grouped": "#F2F2F7",
      "bg-grouped-secondary": "#FFFFFF",
      "separator": "rgba(60,60,67,0.29)",
      "separator-opaque": "#C6C6C8",
      "fill": "rgba(120,120,128,0.20)",
      "fill-secondary": "rgba(120,120,128,0.16)",
      "red": "#FF3B30", "green": "#34C759", "orange": "#FF9500", "gray": "#8E8E93",
      "chrome": "rgba(249,249,249,0.94)",
    },
    dark: {
      "label": "#FFFFFF",
      "label-secondary": "rgba(235,235,245,0.60)",
      "label-tertiary": "rgba(235,235,245,0.30)",
      "bg": "#000000",
      "bg-secondary": "#1C1C1E",
      "bg-grouped": "#000000",
      "bg-grouped-secondary": "#1C1C1E",
      "separator": "rgba(84,84,88,0.65)",
      "separator-opaque": "#38383A",
      "fill": "rgba(120,120,128,0.36)",
      "fill-secondary": "rgba(120,120,128,0.32)",
      "red": "#FF453A", "green": "#30D158", "orange": "#FF9F0A", "gray": "#8E8E93",
      "chrome": "rgba(30,30,30,0.94)",
    },
    accentDefault: "#007AFF",
    accentDark: "#0A84FF",
    type: [
      ["large-title", 34, 41, 400], ["title1", 28, 34, 400], ["title2", 22, 28, 400],
      ["title3", 20, 25, 400], ["headline", 17, 22, 600], ["body", 17, 22, 400],
      ["callout", 16, 21, 400], ["subheadline", 15, 20, 400], ["footnote", 13, 18, 400],
      ["caption1", 12, 16, 400], ["caption2", 11, 13, 400],
    ],
  },
  android: {
    font: `Roboto, "Roboto Flex", system-ui, -apple-system, sans-serif`,
    light: {
      "primary": "#6750A4", "on-primary": "#FFFFFF",
      "primary-container": "#EADDFF", "on-primary-container": "#21005D",
      "secondary": "#625B71", "on-secondary": "#FFFFFF",
      "secondary-container": "#E8DEF8", "on-secondary-container": "#1D192B",
      "tertiary": "#7D5260", "on-tertiary": "#FFFFFF",
      "tertiary-container": "#FFD8E4", "on-tertiary-container": "#31111D",
      "error": "#B3261E", "on-error": "#FFFFFF",
      "error-container": "#F9DEDC", "on-error-container": "#410E0B",
      "surface": "#FEF7FF", "on-surface": "#1D1B20", "on-surface-variant": "#49454F",
      "surface-container-lowest": "#FFFFFF", "surface-container-low": "#F7F2FA",
      "surface-container": "#F3EDF7", "surface-container-high": "#ECE6F0",
      "surface-container-highest": "#E6E0E9",
      "outline": "#79747E", "outline-variant": "#CAC4D0",
      "inverse-surface": "#322F35", "inverse-on-surface": "#F5EFF7",
      "scrim": "rgba(0,0,0,0.32)",
    },
    dark: {
      "primary": "#D0BCFF", "on-primary": "#381E72",
      "primary-container": "#4F378B", "on-primary-container": "#EADDFF",
      "secondary": "#CCC2DC", "on-secondary": "#332D41",
      "secondary-container": "#4A4458", "on-secondary-container": "#E8DEF8",
      "tertiary": "#EFB8C8", "on-tertiary": "#492532",
      "tertiary-container": "#633B48", "on-tertiary-container": "#FFD8E4",
      "error": "#F2B8B5", "on-error": "#601410",
      "error-container": "#8C1D18", "on-error-container": "#F9DEDC",
      "surface": "#141218", "on-surface": "#E6E0E9", "on-surface-variant": "#CAC4D0",
      "surface-container-lowest": "#0F0D13", "surface-container-low": "#1D1B20",
      "surface-container": "#211F26", "surface-container-high": "#2B2930",
      "surface-container-highest": "#36343B",
      "outline": "#938F99", "outline-variant": "#49454F",
      "inverse-surface": "#E6E0E9", "inverse-on-surface": "#322F35",
      "scrim": "rgba(0,0,0,0.32)",
    },
    accentDefault: "#6750A4",
    accentDark: "#D0BCFF",
    type: [
      ["display-large", 57, 64, 400], ["display-medium", 45, 52, 400], ["display-small", 36, 44, 400],
      ["headline-large", 32, 40, 400], ["headline-medium", 28, 36, 400], ["headline-small", 24, 32, 400],
      ["title-large", 22, 28, 400], ["title-medium", 16, 24, 500], ["title-small", 14, 20, 500],
      ["body-large", 16, 24, 400], ["body-medium", 14, 20, 400], ["body-small", 12, 16, 400],
      ["label-large", 14, 20, 500], ["label-medium", 12, 16, 500], ["label-small", 11, 16, 500],
    ],
  },
  // Windows alpha values below are the WinUI 3 theme-resource alphas (e.g. TextFillColorPrimary
  // = #E4000000 → 0.8956). references/windows-fluent.md §18 records that Microsoft's published
  // theme-resource table could not be fetched to confirm them: treat as convention, not spec.
  windows: {
    font: `"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif`,
    light: {
      "text-primary": "rgba(0,0,0,0.8956)",
      "text-secondary": "rgba(0,0,0,0.6063)",
      "text-tertiary": "rgba(0,0,0,0.4458)",
      "text-disabled": "rgba(0,0,0,0.3614)",
      "bg-base": "#F3F3F3",
      "bg-layer": "rgba(255,255,255,0.50)",
      "bg-mica": "#F3F3F3",
      "card": "rgba(255,255,255,0.70)",
      "card-secondary": "rgba(246,246,246,0.50)",
      "subtle-secondary": "rgba(0,0,0,0.0373)",
      "stroke-default": "rgba(0,0,0,0.0578)",
      "divider": "rgba(0,0,0,0.0803)",
      "success": "#0F7B0F", "caution": "#9D5D00", "critical": "#C42B1C",
    },
    dark: {
      "text-primary": "#FFFFFF",
      "text-secondary": "rgba(255,255,255,0.786)",
      "text-tertiary": "rgba(255,255,255,0.5442)",
      "text-disabled": "rgba(255,255,255,0.3628)",
      "bg-base": "#202020",
      "bg-layer": "rgba(58,58,58,0.30)",
      "bg-mica": "#202020",
      "card": "rgba(255,255,255,0.0512)",
      "card-secondary": "rgba(255,255,255,0.0326)",
      "subtle-secondary": "rgba(255,255,255,0.0605)",
      "stroke-default": "rgba(255,255,255,0.0698)",
      "divider": "rgba(255,255,255,0.0837)",
      "success": "#6CCB5F", "caution": "#FCE100", "critical": "#FF99A4",
    },
    accentDefault: "#0067C0",
    accentDark: "#60CDFF",
    type: [
      ["caption", 12, 16, 400], ["body", 14, 20, 400], ["body-strong", 14, 20, 600],
      ["body-large", 18, 24, 400], ["subtitle", 20, 28, 600], ["title", 28, 36, 600],
      ["title-large", 40, 52, 600], ["display", 68, 92, 600],
    ],
  },
};

/* -------------------------------------------------------------------- utils */

const args = process.argv.slice(2);
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
function die(msg) { console.error(`error: ${msg}`); process.exit(1); }

if (arg("list")) {
  for (const [plat, devs] of Object.entries(DEVICES)) {
    console.log(`\n${plat}:`);
    for (const [k, d] of Object.entries(devs)) {
      console.log(`  ${k.padEnd(15)} ${String(d.w).padStart(5)}×${String(d.h).padEnd(5)}  ${d.label}`);
    }
  }
  process.exit(0);
}

const platformArg = String(arg("platform", "ios")).toLowerCase();
if (!["ios", "android", "windows", "both"].includes(platformArg))
  die(`--platform must be ios, android, windows or both`);

const platforms = platformArg === "both" ? ["ios", "android"] : [platformArg];
const outDir = String(arg("out", "./design"));
const chromeArg = String(arg("chrome", "topbar,bottomnav")).toLowerCase().split(",").map(s => s.trim());
const wantTopBar = chromeArg.includes("topbar");
const wantBottomNav = chromeArg.includes("bottomnav") && !chromeArg.includes("none");
const wantFab = chromeArg.includes("fab");

let screens = String(arg("screens", "Main")).split(",").map(s => s.trim()).filter(Boolean);
screens = screens.map(s => s.replace(/[^A-Za-z0-9]/g, ""));
if (!screens.length) die("--screens produced no usable names");
if (!screens.some(s => s.toLowerCase() === "main")) screens[0] = "Main";

/* --------------------------------------------------------------- generation */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
const cssVars = (obj, prefix) =>
  Object.entries(obj).map(([k, v]) => `      --${prefix}-${k}: ${v};`).join("\n");
const typeClasses = (type, prefix) =>
  type.map(([name, size, lh, weight]) =>
    `    .${prefix}-${name} { font-size: ${size}px; line-height: ${lh}px; font-weight: ${weight}; letter-spacing: 0; margin: 0; }`
  ).join("\n");

// --tokens <ios|android|windows> [--format css|json] : dump a token set and exit.
// Use for native code, web/Electron work, or seeding a design-system file.
const tokensFor = arg("tokens");
if (tokensFor && tokensFor !== true) {
  const key = String(tokensFor).toLowerCase();
  const t = TOKENS[key];
  if (!t) die("--tokens must be ios, android or windows");
  const p = key === "ios" ? "ios" : key === "android" ? "md" : "win";
  if (String(arg("format", "css")).toLowerCase() === "json") {
    console.log(JSON.stringify({
      platform: key, prefix: p, font: t.font,
      light: t.light, dark: t.dark,
      accent: { light: t.accentDefault, dark: t.accentDark },
      type: t.type.map(([n, s, l, w]) => ({ name: n, size: s, lineHeight: l, weight: w })),
      chrome: CHROME[key],
    }, null, 2));
  } else {
    console.log(`/* ${key} design tokens — generated by platform-ui-design */`);
    console.log(`:root {\n${cssVars(t.light, p)}\n  --${p}-accent: ${t.accentDefault};\n  --${p}-font: ${t.font};\n}`);
    console.log(`@media (prefers-color-scheme: dark) {\n  :root {\n${cssVars(t.dark, p)}\n    --${p}-accent: ${t.accentDark};\n  }\n}`);
    console.log(typeClasses(t.type, p));
  }
  process.exit(0);
}

function buildArtboard(platform, deviceKey, screenName) {
  const [, dev] = resolveDevice(platform, deviceKey);
  const t = TOKENS[platform];
  const c = CHROME[platform];
  const p = platform === "ios" ? "ios" : platform === "android" ? "md" : "win";

  const margin = platform === "ios"
    ? (dev.regular ? c.marginRegular : c.margin)
    : platform === "android"
      ? (dev.sizeClass === "compact" ? c.margin : c.marginMedium)
      : c.margin;

  const topBarH = wantTopBar ? c.topBar : 0;
  const bottomNavH = wantBottomNav ? (platform === "windows" ? 0 : c.bottomNav) : 0;

  const surface = platform === "ios" ? `var(--${p}-bg)`
    : platform === "android" ? `var(--${p}-surface)`
    : `var(--${p}-bg-base)`;
  const onSurface = platform === "ios" ? `var(--${p}-label)`
    : platform === "android" ? `var(--${p}-on-surface)`
    : `var(--${p}-text-primary)`;
  const onSurfaceDim = platform === "ios" ? `var(--${p}-label-secondary)`
    : platform === "android" ? `var(--${p}-on-surface-variant)`
    : `var(--${p}-text-secondary)`;
  const chromeBg = platform === "ios" ? `var(--${p}-chrome)`
    : platform === "android" ? `var(--${p}-surface-container)`
    : `var(--${p}-bg-mica)`;
  const divider = platform === "ios" ? `var(--${p}-separator)`
    : platform === "android" ? `var(--${p}-outline-variant)`
    : `var(--${p}-divider)`;

  const bodyClass = platform === "ios" ? "ios-body" : platform === "android" ? "md-body-large" : "win-body";
  const titleClass = platform === "ios" ? "ios-headline" : platform === "android" ? "md-title-large" : "win-subtitle";

  const props = {
    dark: { editor: "boolean", default: false, section: "Theme" },
    accent: { editor: "color", default: t.accentDefault, section: "Theme" },
  };

  const navLabels = ["Home", "Browse", "Activity", "Profile"];
  const navItems = navLabels.map((label, i) => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex-grow: 1; min-height: ${platform === "android" ? 48 : 44}px; justify-content: center;">
          <div style="width: 24px; height: 24px; border-radius: ${platform === "ios" ? "6px" : "12px"}; background: ${i === 0 ? "{{accent}}" : onSurfaceDim}; opacity: ${i === 0 ? "1" : "0.55"};"></div>
          <span class="${platform === "ios" ? "ios-caption2" : platform === "android" ? "md-label-medium" : "win-caption"}" style="color: ${i === 0 ? "{{accent}}" : onSurfaceDim};">${label}</span>
        </div>`).join("");

  const topBar = !wantTopBar ? "" : `
      <!-- Top bar · ${platform === "ios" ? "navigation bar 44pt" : platform === "android" ? "small top app bar 64dp" : "command bar 48px"} -->
      <div style="height: ${topBarH}px; flex-shrink: 0; display: flex; align-items: center; gap: ${platform === "android" ? 24 : 8}px; padding: 0 ${platform === "android" ? 16 : margin - 8}px; background: ${chromeBg}; border-bottom: 1px solid ${divider}; box-sizing: border-box;">
        <div style="width: ${platform === "ios" ? 28 : 24}px; height: ${platform === "ios" ? 28 : 24}px; border-radius: 6px; background: ${onSurfaceDim}; opacity: 0.4;"></div>
        <span class="${titleClass}" style="color: ${onSurface}; flex-grow: 1;">${screenName}</span>
        <div style="width: ${platform === "ios" ? 28 : 24}px; height: ${platform === "ios" ? 28 : 24}px; border-radius: 6px; background: {{accent}};"></div>
      </div>`;

  const bottomNav = !wantBottomNav || platform === "windows" ? "" : `
      <!-- Bottom navigation · ${platform === "ios" ? "tab bar 49pt" : "navigation bar 80dp"} · max ${platform === "ios" ? 5 : 5} destinations -->
      <div style="height: ${bottomNavH}px; flex-shrink: 0; display: flex; align-items: center; padding: 0 8px; background: ${chromeBg}; border-top: 1px solid ${divider}; box-sizing: border-box;">${navItems}
      </div>`;

  const fab = !wantFab || platform !== "android" ? "" : `
      <!-- FAB 56dp · bottom-end · one per screen -->
      <div style="position: absolute; right: 16px; bottom: ${bottomNavH + dev.bottom + 16}px; width: 56px; height: 56px; border-radius: 16px; background: {{accent}}; box-shadow: 0 3px 6px rgba(0,0,0,0.24); display: flex; align-items: center; justify-content: center;">
        <div style="width: 24px; height: 24px; border-radius: 4px; background: var(--${p}-on-primary); opacity: 0.9;"></div>
      </div>`;

  const contentRows = [1, 2, 3].map(i => `
        <div style="display: flex; align-items: center; gap: 16px; min-height: ${c.row}px; padding: 12px 0; border-bottom: 1px solid ${divider};">
          <div style="width: 40px; height: 40px; border-radius: ${platform === "ios" ? "10px" : platform === "android" ? "20px" : "4px"}; background: ${onSurfaceDim}; opacity: 0.25; flex-shrink: 0;"></div>
          <div style="display: flex; flex-direction: column; gap: 2px; flex-grow: 1;">
            <span class="${bodyClass}" style="color: ${onSurface};">Row item ${i}</span>
            <span class="${platform === "ios" ? "ios-footnote" : platform === "android" ? "md-body-medium" : "win-caption"}" style="color: ${onSurfaceDim};">Replace with real content</span>
          </div>
        </div>`).join("");

  const insetNote = platform === "windows"
    ? `<!-- Title bar 32px reserved. Do not draw window controls; the shell owns them. -->`
    : `<!-- Safe-area inset ${dev.top}pt reserved. DO NOT draw a status bar here — the OS renders it on top. -->`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    :root {
${cssVars(t.light, p)}
      --${p}-font: ${t.font};
    }
    .theme-dark {
${cssVars(t.dark, p)}
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: var(--${p}-font); -webkit-font-smoothing: antialiased; }
    a { color: ${t.accentDefault}; text-decoration: none; }
    a:hover { color: ${t.accentDark}; text-decoration: underline; }
${typeClasses(t.type, p)}
  </style>
</helmet>
<div class="{{themeClass}}" style="width: ${dev.w}px; height: ${dev.h}px; position: relative; overflow: hidden; background: ${surface}; color: ${onSurface}; display: flex; flex-direction: column; font-family: var(--${p}-font);">

  ${insetNote}
  <div style="height: ${dev.top}px; flex-shrink: 0;"></div>
${topBar}
  <!-- Content · side margin ${margin}${platform === "ios" ? "pt" : platform === "android" ? "dp" : "px"} · scrolls under nothing -->
  <div style="flex-grow: 1; overflow: hidden; padding: ${platform === "windows" ? 12 : 8}px ${margin}px 0;">
    <div style="display: flex; flex-direction: column; gap: 0;">${contentRows}
    </div>
  </div>
${bottomNav}
  <!-- Bottom safe-area / gesture inset ${dev.bottom}${platform === "ios" ? "pt" : "dp"} -->
  <div style="height: ${dev.bottom}px; flex-shrink: 0; background: ${bottomNavH ? chromeBg : surface};"></div>
${fab}
</div>
</x-dc>
<script data-dc-script data-props='${esc(JSON.stringify({ ...props, $preview: { width: dev.w, height: dev.h } }))}'>
class Component extends DCLogic {
  renderVals() {
    const dark = this.props.dark ?? false;
    return {
      themeClass: dark ? 'theme-dark' : '',
      accent: this.props.accent ?? (dark ? '${t.accentDark}' : '${t.accentDefault}'),
    };
  }
}
</script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------- output */

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const artboards = [];
let x = 0;
const GAP_X = 120, GAP_Y = 160;
let row = 0;

const requestedDevice = arg("device");
if (requestedDevice && requestedDevice !== true && platforms.length === 1) {
  if (!DEVICES[platforms[0]][String(requestedDevice)])
    die(`--device "${requestedDevice}" is not a ${platforms[0]} preset. Run --list to see them.`);
}

for (const platform of platforms) {
  const [deviceKey, dev] = resolveDevice(
    platform,
    requestedDevice && requestedDevice !== true ? String(requestedDevice) : null
  );
  x = 0;
  for (const screen of screens) {
    const name = platforms.length > 1
      ? (screen === "Main" && platform === "ios" ? "Main" : `${screen}${platform === "ios" ? "IOS" : platform === "android" ? "Android" : "Win"}`)
      : screen;
    const file = `${name}.dc.html`;
    writeFileSync(join(outDir, file), buildArtboard(platform, deviceKey, screen), "utf8");
    artboards.push({ file, x, y: row * (dev.h + GAP_Y), w: dev.w, h: dev.h, title: `${screen} · ${dev.label}` });
    x += dev.w + GAP_X;
  }
  row++;
}

const canvas = {
  artboards,
  annotations: [{
    id: "platform-note",
    x: 0,
    y: -110,
    w: 520,
    text: `Scaffold from platform-ui-design.\nMetrics are platform-correct — keep them.\nTokens are CSS custom properties; restyle via the theme, not literal hex.\nNo status bars or keyboards are drawn: the OS renders those on top.`,
  }],
  launch: { view: "canvas" },
};
writeFileSync(join(outDir, "canvas.json"), JSON.stringify(canvas, null, 2), "utf8");

console.log(`ok: ${artboards.length} artboard(s) + canvas.json -> ${outDir}`);
console.log(`    ${artboards.map(a => a.file).join(", ")}`);
console.log(`    next: fill the artboards with real content, then hand off to the design skill to publish.`);
