/**
 * kit-lint.mjs — pure checks for kit fragments. No I/O. Findings are { file, line, rule, detail }.
 */

const HEADER_RE = /^<!--\s*(.*?)\s*-->/;

export function parseHeader(html) {
  const m = html.match(HEADER_RE);
  if (!m) return { ok: false, reason: "first line must be a <!-- key: value · key: value --> header" };
  const fields = {};
  for (const part of m[1].split(" · ")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    fields[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  for (const req of ["group", "title"])
    if (!fields[req]) return { ok: false, reason: `header is missing "${req}"` };
  return { ok: true, fields };
}

// CSS named colors (the full CSS Color Level 4 list minus the three we allow).
const NAMED = new Set(("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(" "));

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_RE = /\b(?:rgba?|hsla?)\s*\(/i;
// A named color only counts as a value: after ":" (css/style) or inside fill=/stroke=/color= attributes.
const NAMED_RE = /(?::\s*|\b(?:fill|stroke|color)\s*=\s*["']?)([a-zA-Z]+)\b/g;

function colorLiteralOnLine(line) {
  if (HEX_RE.test(line)) return "hex literal";
  if (FUNC_RE.test(line)) return "rgb()/hsl() literal";
  for (const m of line.matchAll(NAMED_RE)) {
    if (NAMED.has(m[1].toLowerCase())) return `named color "${m[1]}"`;
  }
  return null;
}

const EMOJI_RE = /\p{Extended_Pictographic}/u;
const IMG_RE = /<img\b/i;
const FONT_SIZE_RE = /font-size\s*:/i;

function scan(text, file, isComponent, findings) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const n = i + 1;
    if (isComponent) {
      const c = colorLiteralOnLine(line);
      if (c) findings.push({ file, line: n, rule: "color-literal", detail: c });
    }
    if (FONT_SIZE_RE.test(line)) findings.push({ file, line: n, rule: "font-size", detail: "use a type-ramp class" });
    if (EMOJI_RE.test(line)) findings.push({ file, line: n, rule: "emoji", detail: "icons are inline SVG" });
    if (IMG_RE.test(line)) findings.push({ file, line: n, rule: "img-tag", detail: "icons are inline SVG" });
  });
}

export function lintFragment({ path, html, css, isComponent }) {
  const findings = [];
  const h = parseHeader(html);
  if (!h.ok) findings.push({ file: path, line: 1, rule: "header-missing", detail: h.reason });
  else if (isComponent && !h.fields.slot) findings.push({ file: path, line: 1, rule: "header-field", detail: 'component header needs "slot"' });
  scan(html, path, isComponent, findings);
  if (css != null) scan(css, path.replace(/\.html$/, ".css"), isComponent, findings);
  return findings;
}

export function lintKit({ kit, fragments }) {
  const findings = [];
  const declared = new Set((kit.components ?? []).map(c => c.slot));
  const found = new Map();
  for (const f of fragments) {
    const h = parseHeader(f.html);
    if (h.ok && h.fields.slot) found.set(h.fields.slot, f.path);
  }
  for (const slot of declared)
    if (!found.has(slot)) findings.push({ file: "kit.json", line: 0, rule: "slot-missing", detail: slot });
  for (const [slot, path] of found)
    if (!declared.has(slot)) findings.push({ file: path, line: 1, rule: "slot-unknown", detail: slot });
  return findings;
}
