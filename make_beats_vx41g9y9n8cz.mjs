// make_beats_vx41g9y9n8cz.mjs — DIRECTOR: chunkea captions en momentos ~3.5s → _v3/vx41g9y9n8cz_beats.json
// Cada momento: {name, section, ms, phrase, desc:"", anchor:"", queries:[], shot:"", src:"photo"}.
// desc/queries los llenan los subagentes. Corte preferente tras puntuación. Canal The Free Builder (moho $1).
import fs from "fs";
const SLUG = "vx41g9y9n8cz";
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const WIN = 3.0; // seg objetivo por momento (imágenes ≤3.5s, alta densidad)
const moments = [];
let cur = [];
const flush = () => {
  if (!cur.length) return;
  const phrase = cur.map((w) => w.text).join(" ").replace(/\s+/g, " ").trim();
  moments.push({ ms: cur[0].startMs, phrase });
  cur = [];
};
for (let i = 0; i < caps.length; i++) {
  const w = caps[i];
  cur.push(w);
  const span = (w.endMs - cur[0].startMs) / 1000;
  const endsPunct = /[.,;:!?]$/.test(w.text.trim());
  const next = caps[i + 1];
  const gap = next ? (next.startMs - w.endMs) / 1000 : 99;
  if ((span >= WIN && (endsPunct || gap > 0.18)) || span >= WIN + 1.0) flush();
}
flush();

const total = moments.length;
const beats = moments.map((m, i) => {
  const frac = i / total;
  let section = "cuerpo";
  if (frac < 0.08) section = "hook";
  else if (frac > 0.93) section = "cierre";
  return {
    name: `${SLUG}_s_${String(i).padStart(3, "0")}`,
    section, ms: m.ms, phrase: m.phrase,
    desc: "", anchor: "", queries: [], shot: "", src: "photo",
  };
});
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(beats, null, 1));
const dur = caps[caps.length - 1].endMs / 1000;
console.log(`momentos: ${beats.length} · dur ${dur.toFixed(0)}s · medio ${(dur / beats.length).toFixed(1)}s/momento`);
console.log(`por sección: hook ${beats.filter(b=>b.section==="hook").length} · cuerpo ${beats.filter(b=>b.section==="cuerpo").length} · cierre ${beats.filter(b=>b.section==="cierre").length}`);
