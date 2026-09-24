// _find.mjs — ubica frases en captions_<slug>.json y devuelve su ms (para el mapa de secciones)
import fs from "fs";
const SLUG = process.argv[2] || "fedcolageno";
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findAll = (phrase) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  const out = [];
  for (let i = 0; i <= CW.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) out.push(+CW[i].s.toFixed(2));
  }
  return out;
};
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const phrases = fs.readFileSync(process.argv[3], "utf8").split(/\r?\n/).filter((x) => x.trim());
for (const ph of phrases) {
  const hits = findAll(ph);
  console.log(`${hits.length ? hits.map((h) => `${h} (${fmt(h)})`).join(" | ") : "!! NO MATCH"}   <- ${ph}`);
}
console.log(`TOTAL ${CW[CW.length - 1].s.toFixed(1)}s`);
