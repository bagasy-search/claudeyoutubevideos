// match_v3/1_segment.mjs — narración → beats por frase, anclados al ms de Whisper.
// Cada beat = una unidad de sentido (cláusula) de ~PACE segundos, cortada en puntuación.
// dur CONTIGUA (dur = próximo.ms - ms) para no dejar huecos (bug dulcesv2). Output: esqueleto
// que el AGENTE DE AUTORÍA completa con desc/queries/shot/src.
//
// Uso: node match_v3/1_segment.mjs <captions.json> <beatsSkelOut.json> [startsJson] [PACE=4.5]
import fs from "fs";

const [capArg, outArg, startsArg, paceArg] = process.argv.slice(2);
if (!capArg || !outArg) { console.error("Uso: node 1_segment.mjs <captions.json> <out.json> [starts.json] [pace]"); process.exit(1); }
const PACE = +(paceArg || 4.5);
const words = JSON.parse(fs.readFileSync(capArg, "utf8").replace(/^﻿/, ""));
const starts = startsArg && fs.existsSync(startsArg) ? JSON.parse(fs.readFileSync(startsArg, "utf8")) : null;

// sección para un ms dado (el anchor más grande <= ms)
const secEntries = starts ? Object.entries(starts).filter(([k]) => k !== "__end").map(([k, v]) => [k, v * 1000]).sort((a, b) => a[1] - b[1]) : null;
const sectionAt = (ms) => {
  if (!secEntries) return "s";
  let cur = secEntries[0]?.[0] || "s";
  for (const [k, v] of secEntries) { if (ms >= v) cur = k; else break; }
  return cur;
};

const STRONG = /[.!?]$/;   // fin de oración → corte seguro
const SOFT = /[,;:]$/;     // coma → corte si ya juntamos suficiente
const beats = [];
let cur = null;
const secCount = {};
const flush = () => {
  if (!cur || !cur.words.length) return;
  const sec = sectionAt(cur.ms);
  secCount[sec] = (secCount[sec] || 0) + 1;
  beats.push({ name: `${sec}_${String(secCount[sec]).padStart(2, "0")}`, section: sec, ms: cur.ms, phrase: cur.words.join("").trim() });
  cur = null;
};
for (const w of words) {
  const t = (w.text || "");
  if (!cur) cur = { ms: w.startMs, words: [] };
  cur.words.push(t);
  const spoken = (w.endMs - cur.ms) / 1000;
  const tok = t.trim();
  if (STRONG.test(tok) && spoken >= PACE * 0.5) flush();
  else if (SOFT.test(tok) && spoken >= PACE) flush();
  else if (spoken >= PACE * 1.6) flush(); // corte duro si una cláusula es larguísima
}
flush();
// dur contigua
for (let i = 0; i < beats.length; i++) {
  const next = beats[i + 1];
  beats[i].dur = +(((next ? next.ms : beats[i].ms + PACE * 1000) - beats[i].ms) / 1000).toFixed(2);
  // campos que llena el agente de autoría:
  beats[i].desc = ""; beats[i].queries = []; beats[i].shot = ""; beats[i].src = "youtube";
}
fs.writeFileSync(outArg, JSON.stringify(beats, null, 1));
const bySec = Object.entries(secCount).map(([k, v]) => `${k}:${v}`).join("  ");
console.log(`${beats.length} beats · pace ~${PACE}s · dur media ${(beats.reduce((a, b) => a + b.dur, 0) / beats.length).toFixed(1)}s`);
console.log(`por sección: ${bySec}`);
console.log(`→ ${outArg}  (falta: autoría llena desc/queries/shot/src por beat)`);
