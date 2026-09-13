/**
 * platform-tokens.mjs — the single source of platform metrics and tokens.
 *
 * Consumed by make-artboards.mjs (artboards, --tokens) and build-kit.mjs (Claude Design
 * kits). Pure data and pure helpers: no I/O, no argv. Provenance for every value is in
 * ../references/device-metrics.md, apple-foundations.md, android-foundations.md and
 * windows-fluent.md; values those files mark "convention (unverified)" are conventions too.
 */

export const DEVICES = {
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
export const CHROME = {
  ios:     { topBar: 44, topBarLarge: 96, bottomNav: 49, margin: 16, marginRegular: 20, row: 44, radius: 10 },
  android: { topBar: 64, topBarMedium: 112, bottomNav: 80, rail: 80, margin: 16, marginMedium: 24, row: 56, fab: 56, radius: 12 },
  windows: { topBar: 48, titleBar: 32, bottomNav: 0, navPane: 320, navCompact: 48, margin: 24, gutter: 12, row: 40, radius: 4 },
};

/** Resolve a --device key for a platform. One rule, used everywhere, so the emitted
 *  artboard and its canvas.json entry can never disagree about the frame size. */
export function resolveDevice(platform, key) {
  const devs = DEVICES[platform];
  if (key && devs[key]) return [key, devs[key]];
  const fallback = Object.keys(devs)[1] ?? Object.keys(devs)[0];
  return [fallback, devs[fallback]];
}

export const TOKENS = {
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

export const PREFIX  = { ios: "ios", android: "md", windows: "win" };
/** Which token pair paints a card's surface and its text, per platform. */
export const SURFACE = {
  ios:     { bg: "bg",      fg: "label" },
  android: { bg: "surface", fg: "on-surface" },
  windows: { bg: "bg-base", fg: "text-primary" },
};

export const cssVars = (obj, prefix) =>
  Object.entries(obj).map(([k, v]) => `      --${prefix}-${k}: ${v};`).join("\n");
export const typeClasses = (type, prefix) =>
  type.map(([name, size, lh, weight]) =>
    `    .${prefix}-${name} { font-size: ${size}px; line-height: ${lh}px; font-weight: ${weight}; letter-spacing: 0; margin: 0; }`
  ).join("\n");
