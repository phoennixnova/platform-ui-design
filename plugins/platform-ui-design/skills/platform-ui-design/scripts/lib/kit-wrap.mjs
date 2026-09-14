/**
 * kit-wrap.mjs — turn a fragment into a complete, self-contained Claude Design card.
 * Pure functions; no I/O.
 */
import { TOKENS, PREFIX, SURFACE, cssVars, typeClasses } from "../platform-tokens.mjs";

const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export function dsCardComment(fields, width) {
  const parts = [`group="${attr(fields.group)}"`, `name="${attr(fields.title)}"`];
  if (fields.subtitle) parts.push(`subtitle="${attr(fields.subtitle)}"`);
  parts.push(`width="${width}"`);
  return `<!-- @dsCard ${parts.join(" ")} -->`;
}

export function tokenStyle(platform) {
  const t = TOKENS[platform];
  const p = PREFIX[platform];
  return [
    `:root {`,
    cssVars(t.light, p),
    `      --${p}-accent: ${t.accentDefault};`,
    `      --${p}-font: ${t.font};`,
    `      --pud-on-accent: ${t.onAccent.light};`,
    `}`,
    `.pud-dark {`,
    cssVars(t.dark, p),
    `      --${p}-accent: ${t.accentDark};`,
    `      --pud-on-accent: ${t.onAccent.dark};`,
    `}`,
    typeClasses(t.type, p),
  ].join("\n");
}

export function baseCardCss(platform) {
  const p = PREFIX[platform];
  const s = SURFACE[platform];
  return `
.pud-pair { display: flex; gap: 24px; align-items: flex-start; font-family: var(--${p}-font); -webkit-font-smoothing: antialiased; }
.pud-pair--stack { flex-direction: column; }
.pud-theme { flex: 0 0 auto; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; padding: 24px; border-radius: 12px; background: var(--${p}-${s.bg}); color: var(--${p}-${s.fg}); }
.pud-label { align-self: flex-end; font: 500 11px/16px var(--${p}-font); letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.55; }
.pud-card { display: flex; flex-direction: column; gap: 16px; }
.pud-variants { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.pud-stack { display: flex; flex-direction: column; gap: 12px; }
.pud-note { opacity: 0.7; }
.pud-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.pud-swatch { display: flex; flex-direction: column; gap: 6px; }
.pud-swatch > i { display: block; height: 40px; border-radius: 8px; border: 1px solid rgba(127,127,127,0.25); }
.pud-swatch > b { font: 500 12px/16px var(--${p}-font); }
.pud-swatch > small { font: 400 11px/14px var(--${p}-font); opacity: 0.7; word-break: break-all; }
`.trim();
}

export function wrapCard({ platform, header, body, css = "", width }) {
  const p = PREFIX[platform];
  const themed = (cls) => `<div class="${cls}"><span class="pud-label">${cls.includes("pud-dark") ? "Dark" : "Light"}</span>\n${body}\n</div>`;
  const caption = header.ref ? `\n<p class="pud-caption">Source: ${header.ref}</p>` : "";
  const captionCss = header.ref
    ? `.pud-caption { margin: 12px 0 0; font: 400 12px/16px var(--${p}-font); opacity: 0.6; }`
    : "";
  // kit.json's width is the per-panel content width the fragment is designed for. The card
  // viewport is derived from it: panels <= 600px sit side by side (viewport = both panels +
  // their padding + the gap between them); wider panels stack vertically instead (viewport =
  // one panel + its padding).
  const panelWidth = width + 48; // content width + 24px padding on each side
  const stacked = width > 600;
  const viewport = stacked ? panelWidth : 2 * panelWidth + 24;
  const pairClass = stacked ? "pud-pair pud-pair--stack" : "pud-pair";
  const panelCss = `.pud-theme { width: ${panelWidth}px; }`;
  return [
    dsCardComment(header, viewport),
    `<style>`,
    tokenStyle(platform),
    baseCardCss(platform),
    panelCss,
    captionCss,
    css.trim(),
    `</style>`,
    `<div class="${pairClass}">`,
    themed("pud-theme"),
    themed("pud-theme pud-dark"),
    `</div>${caption}`,
    ``,
  ].join("\n");
}

export function colorsCard(platform) {
  const t = TOKENS[platform];
  const p = PREFIX[platform];
  const rows = [
    ...Object.keys(t.light).map(role => [`--${p}-${role}`, t.light[role], t.dark[role]]),
    [`--${p}-accent`, t.accentDefault, t.accentDark],
  ];
  const swatches = rows.map(([v, l, d]) =>
    `<div class="pud-swatch"><i style="background: var(${v})"></i><b>${v}</b><small>${l} · ${d}</small></div>`
  ).join("\n");
  return {
    header: { group: "Foundations", title: "Colors", subtitle: `${rows.length} semantic roles, light and dark`, ref: `${platform === "ios" ? "apple" : platform}-foundations.md §Color`.replace("windows-foundations", "windows-fluent") },
    body: `<section class="pud-card"><div class="pud-swatches">\n${swatches}\n</div></section>`,
  };
}
