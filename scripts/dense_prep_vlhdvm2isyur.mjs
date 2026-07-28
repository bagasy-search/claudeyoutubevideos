// dense_prep_vlhdvm2isyur.mjs — ancla el plan del DIRECTOR a los ms de Whisper y emite el track de b-roll.
//   entrada : public/broll/dense_vlhdvm2isyur.json  ({name, query, at, long})
//             public/captions_vlhdvm2isyur.json
//   salida  : src/_fed6/VideoEdit/federer_vlhdvm2isyur_broll.ts  (FEDZ_BROLL)
//             public/broll/dense_thinned_vlhdvm2isyur.json
// AISLAMIENTO: src = broll/vlhdvm2isyur/<name>.mp4 (carpeta propia + nombre con slug).
import fs from "fs";

const SLUG = "vlhdvm2isyur";
const DIR = `public/broll/${SLUG}`;
const MINGAP = 2.6;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs ?? x.start ?? 0) / 1000 }));

// anclaje: primero exacto con 6 palabras, después degrada a 4 y a 3 (whisper se come palabras)
const tryRun = (words, after) => {
  for (let i = 0; i < CW.length - words.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < words.length; j++) if (CW[i + j].t !== words[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (const n of [6, 5, 4, 3]) {
    if (p.length < n) continue;
    // probá ventanas deslizantes de la frase (por si whisper comió el arranque)
    for (let off = 0; off + n <= Math.min(p.length, n + 3); off++) {
      const hit = tryRun(p.slice(off, off + n), after);
      if (hit != null) return hit;
    }
  }
  return null;
};

const dense = JSON.parse(fs.readFileSync(`public/broll/dense_${SLUG}.json`, "utf8"));
let cursor = 0, kept = [], miss = 0, nofile = 0;
for (const b of dense) {
  if (!fs.existsSync(`${DIR}/${b.name}.mp4`)) { nofile++; continue; }   // no se bajó → no existe el asset
  const t = findMs(b.at, Math.max(0, cursor - 1));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) continue;
  cursor = t;
  kept.push({ name: b.name, at: b.at, query: b.query, long: !!b.long, t: +t.toFixed(2) });
}

const VEND = (CW[CW.length - 1]?.s || 1340) + 2;
const broll = kept.map((k, i) => ({
  name: k.name,
  src: `broll/${SLUG}/${k.name}.mp4`,
  start: k.t,
  dur: +((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t).toFixed(2),
  query: k.query,
}));

fs.writeFileSync(`public/broll/dense_thinned_${SLUG}.json`, JSON.stringify(kept, null, 1));
fs.writeFileSync(
  `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/dense_prep_${SLUG}.mjs — b-roll denso real (Pexels), aislado en broll/${SLUG}/.\n` +
    `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`
);

const gaps = broll.map((b) => b.dur).sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const long = gaps.filter((g) => g >= 5).length;
console.log(`dense ${dense.length} → ${kept.length} clips · sin archivo ${nofile} · no ancladas ${miss}`);
console.log(`mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s: ${((long / gaps.length) * 100).toFixed(0)}% · fin ${VEND.toFixed(1)}s`);
