// beats_vgn0pnkzk0a7.mjs — parte las captions de Whisper en MOMENTOS de ~3.6s cortando
// en límite de palabra (y prefiriendo cortar después de un punto/coma) → _v3/vgn0pnkzk0a7_beats.json
// con la forma que consume build_vgn0pnkzk0a7.mjs: {name, section, ms, phrase, desc:"", queries:[], src:""}.
// Los campos desc/queries/src los llenan los subagentes DIRECTOR por rangos de tiempo.
import fs from "fs";

const SLUG = "vgn0pnkzk0a7";
const TARGET = 3.6;   // duración objetivo de cada momento (s)
const MINDUR = 2.6;
const MAXDUR = 4.6;

const raw = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const caps = (raw.words || raw).filter((c) => c && typeof c.text === "string" && c.text.trim());
if (!caps.length) { console.error("captions vacías"); process.exit(1); }

const dur = caps[caps.length - 1].endMs / 1000;

// Secciones por proporción del guion (hook → principio → fórmula → superficies → cierre).
const SECTIONS = [
  { name: "hook", until: 0.075 },
  { name: "principio", until: 0.20 },
  { name: "formula", until: 0.34 },
  { name: "banio", until: 0.50 },
  { name: "muros", until: 0.60 },
  { name: "materiales", until: 0.76 },
  { name: "prevencion", until: 0.86 },
  { name: "limites", until: 0.93 },
  { name: "cierre", until: 1.01 },
];
const sectionAt = (t) => (SECTIONS.find((s) => t / dur <= s.until) || SECTIONS[SECTIONS.length - 1]).name;

const beats = [];
let i = 0;
while (i < caps.length) {
  const startMs = caps[i].startMs;
  let j = i;
  let best = -1;
  // avanzar hasta pasar el objetivo; memorizar el mejor corte "de puntuación"
  while (j < caps.length) {
    const len = (caps[j].endMs - startMs) / 1000;
    if (len >= MINDUR && /[.,;:!?]$/.test(caps[j].text.trim())) best = j;
    if (len >= TARGET) break;
    j++;
  }
  if (j >= caps.length) j = caps.length - 1;
  // si hay un corte de puntuación razonable, usarlo
  if (best >= 0 && (caps[best].endMs - startMs) / 1000 <= MAXDUR) j = best;
  const endMs = caps[j].endMs;
  const phrase = caps.slice(i, j + 1).map((c) => c.text.trim()).join(" ").replace(/\s+/g, " ").trim();
  if (phrase) {
    beats.push({
      name: `${SLUG}_s_${String(beats.length).padStart(4, "0")}`,
      section: sectionAt(startMs / 1000),
      ms: startMs,
      phrase,
      desc: "",
      anchor: "",
      queries: [],
      shot: "",
      src: "",
    });
  }
  i = j + 1;
}

fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(beats, null, 1));

const gaps = beats.slice(1).map((b, k) => (b.ms - beats[k].ms) / 1000);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
const bySec = {};
for (const b of beats) bySec[b.section] = (bySec[b.section] || 0) + 1;
console.log(`captions ${caps.length} palabras · dur ${(dur / 60).toFixed(2)} min`);
console.log(`momentos ${beats.length} · separación media ${avg.toFixed(2)}s · min ${Math.min(...gaps).toFixed(2)} max ${Math.max(...gaps).toFixed(2)}`);
console.log("por sección:", JSON.stringify(bySec));

// capdump para anclar componentes a frases REALES
const dump = beats.map((b) => `[${(b.ms / 1000).toFixed(1)}s ${b.section}] ${b.phrase}`).join("\n");
fs.writeFileSync(`_v3/${SLUG}_capdump.txt`, dump);
console.log(`capdump → _v3/${SLUG}_capdump.txt`);
