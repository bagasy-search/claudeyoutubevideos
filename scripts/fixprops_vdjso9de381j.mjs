// fixprops_vdjso9de381j.mjs — los directores escriben los props con nombres NATURALES
// ({title,text}, {big,unit}, {items}) y el kit los lee con OTROS nombres. Cuando no coinciden el
// componente no falla: renderiza VACÍO y pasa todas las compuertas. El creador cazó dos a ojo
// (callout en 0:34, board en 4:12) y la auditoría contra el despachador encontró 5 kinds más.
//
// Este script NO toca start/dur/kind: sólo AGREGA los alias que el kit espera, así el track sigue
// siendo frame-idéntico y se puede re-rendear PARCIAL (ONLY_CHUNKS) en vez de los 60 chunks.
//
//   rule   → ChapterTitle usa beat.title      (venía beat.text)
//   stat   → BigStatReveal usa value/suffix   (venía big/unit)
//   bars   → BarCompare usa beat.bars         (venía beat.items)
//   chips  → SplitPanel usa beat.chips        (venía beat.items)
//   process→ NumberedSteps usa steps[{title,desc}] (venían strings)
import fs from "fs";

const SLUG = "vdjso9de381j";
const BEATS_TS = `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`;
const SHEET = `beatsheet/${SLUG}.json`;

const sheet = JSON.parse(fs.readFileSync(SHEET, "utf8"));
const beats = sheet.beats;
const n = { rule: 0, stat: 0, bars: 0, chips: 0, process: 0 };

for (const b of beats) {
  switch (b.kind) {
    case "rule":
      if (!b.title && b.text) { b.title = b.text; n.rule++; }
      break;
    case "stat":
      if (b.value == null && b.big != null) {
        b.value = String(b.big);
        if (b.unit && !b.suffix) b.suffix = b.unit;
        n.stat++;
      }
      break;
    case "bars":
      if (!Array.isArray(b.bars) && Array.isArray(b.items)) {
        b.bars = b.items.map((it) => (typeof it === "string"
          ? { label: it, value: 60 }
          : { label: it.label ?? it.title, value: Number(it.value) || 0, tone: it.tone, note: it.note }));
        n.bars++;
      }
      break;
    case "chips":
      if (!Array.isArray(b.chips) && Array.isArray(b.items)) {
        b.chips = b.items.map((it) => (typeof it === "string" ? it : it.text ?? it.title ?? ""));
        n.chips++;
      }
      break;
    case "process":
      if (Array.isArray(b.steps) && b.steps.length && typeof b.steps[0] !== "object") {
        b.steps = b.steps.map((s) => ({ title: String(s) }));
        n.process++;
      } else if (Array.isArray(b.steps)) {
        // NumberedSteps lee s.desc, no s.sub
        b.steps = b.steps.map((s) => (s && s.sub && !s.desc ? { ...s, desc: s.sub } : s));
      }
      break;
  }
}

fs.writeFileSync(SHEET, JSON.stringify(sheet, null, 1));
fs.writeFileSync(BEATS_TS,
  `// AUTO-GENERADO por gen_${SLUG}.mjs (+ scripts/fixprops_${SLUG}.mjs)\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);

console.log("alias agregados:", n);

// ── verificación: ningún kind queda con los props que el kit NO lee ──────────
const need = {
  stat: (x) => x.value != null,
  bars: (x) => Array.isArray(x.bars) && x.bars.length,
  chips: (x) => Array.isArray(x.chips) && x.chips.length,
  quote: (x) => !!x.text,
  splitlist: (x) => Array.isArray(x.items) && x.items.length,
  checklist: (x) => Array.isArray(x.items) && x.items.length,
  process: (x) => Array.isArray(x.steps) && x.steps.length && typeof x.steps[0] === "object",
  annotated: (x) => !!x.image && Array.isArray(x.annotations),
  rule: (x) => !!x.title,
  nametag: (x) => !!x.name,
  diagram: (x) => Array.isArray(x.slides) && x.slides.some((s) => s && s.image),
  callout: (x) => !!x.title || !!x.text,
  board: (x) => !!x.title || (Array.isArray(x.items) && x.items.length),
  headline: (x) => Array.isArray(x.tokens) && x.tokens.length,
  focuscards: (x) => Array.isArray(x.items) && x.items.every((i) => i.image),
  avatarpizarra: (x) => x.items.every((i) => i.card || i.image),
  avatarkeyword: (x) => x.items.every((i) => i.word),
  freezezoom: (x) => !!x.image,
  mitoverdad: (x) => !!x.myth && !!x.truth,
  frasecinetica: (x) => Array.isArray(x.words) && x.words.length,
  errorstinger: (x) => !!x.title,
  guardaesto: (x) => Array.isArray(x.items) && x.items.length,
  lowerthird: (x) => !!x.title,
  raw: (x) => !!x.src,
};
const bad = [];
for (const b of beats) { const f = need[b.kind]; if (f && !f(b)) bad.push(`${b.kind}@${b.start.toFixed(1)}s`); }
console.log(bad.length ? `⛔ SIGUEN ROTOS (${bad.length}): ${bad.slice(0, 12).join(", ")}` : "✓ todos los kinds con props que el kit SÍ lee");
if (bad.length) process.exit(1);
