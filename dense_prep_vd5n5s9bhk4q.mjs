// dense_prep_vd5n5s9bhk4q.mjs — ancla la capa densa de b-roll al ms del caption y arma:
//   fase "prep"     → public/broll/shots_vd5n5s9bhk4q.json  (lista para fetchstock, AISLADA por slug)
//   fase "finalize" → src/_fed6/VideoEdit/federer_vd5n5s9bhk4q_broll.ts (solo clips que existen en disco)
// Uso: node dense_prep_vd5n5s9bhk4q.mjs prep | finalize
import fs from "fs";
import path from "path";

const SLUG = "vd5n5s9bhk4q";
const MODE = process.argv[2] || "prep";
const OUTDIR = path.join("public/broll", SLUG);

const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 1635) + 1.5;

const dense = JSON.parse(fs.readFileSync(`public/broll/dense_${SLUG}.json`, "utf8"));

// ── anclaje cronológico ──────────────────────────────────────────────────────
let cursor = 0;
let anchored = [];
let miss = 0;
for (const d of dense) {
  const ms = findMs(d.at, cursor + 0.35);
  if (ms == null) { miss++; continue; }
  if (ms <= cursor + 0.35) continue;
  cursor = ms;
  anchored.push({ start: +ms.toFixed(2), query: d.query, at: d.at });
}
// dedupe de queries exactas consecutivas
anchored = anchored.filter((x, i) => i === 0 || x.query !== anchored[i - 1].query);

// ── ADELGAZADO: Pexels free corta cerca de las 200 descargas/hora (gotcha del video de 34 min).
// Dejamos una toma cada ~6s: el resto de la pantalla lo cubren las fotos IA, los componentes y el
// avatar full (gap-fill). Además sube la mediana de duración: el enemigo es la sucesión PAREJA.
const MINGAP = 5.8;
const thin = [];
for (const a of anchored) { if (!thin.length || a.start - thin[thin.length - 1].start >= MINGAP) thin.push(a); }
anchored = thin;

// dur = hasta el siguiente clip (sin huecos), con techo variable para que el ritmo respire
for (let i = 0; i < anchored.length; i++) {
  const next = i + 1 < anchored.length ? anchored[i + 1].start : VIDEO_END;
  const room = next - anchored[i].start;
  const largo = i % 5 === 2;                       // ~20% de tomas que se dejan respirar
  const cap = largo ? 8.0 : 6.0;
  anchored[i].dur = +Math.max(2.2, Math.min(room, cap)).toFixed(2);
}

if (MODE === "prep") {
  const shots = anchored.map((a, i) => ({
    name: `d${String(i).padStart(3, "0")}`,
    query: a.query,
    type: "video",
    orientation: "landscape",
  }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/shots_${SLUG}.json`, JSON.stringify(shots, null, 1));
  fs.writeFileSync(`public/broll/anchored_${SLUG}.json`, JSON.stringify(anchored, null, 1));
  const durs = anchored.map((a) => a.dur).sort((x, y) => x - y);
  const med = durs[Math.floor(durs.length / 2)];
  console.log(`ancladas: ${anchored.length} / ${dense.length} (fallaron ${miss}) · mediana ${med}s · p90 ${durs[Math.floor(durs.length * 0.9)]}s`);
  console.log(`→ public/broll/shots_${SLUG}.json`);
} else {
  const anch = JSON.parse(fs.readFileSync(`public/broll/anchored_${SLUG}.json`, "utf8"));
  const out = [];
  anch.forEach((a, i) => {
    const name = `d${String(i).padStart(3, "0")}`;
    const f = path.join(OUTDIR, `${name}.mp4`);
    if (!fs.existsSync(f) || fs.statSync(f).size < 40000) return;
    out.push({ name: `${SLUG}_${name}`, src: `broll/${SLUG}/${name}.mp4`, start: a.start, dur: a.dur, query: a.query });
  });
  fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
    `// AUTO-GENERADO por dense_prep_${SLUG}.mjs — capa densa de b-roll AISLADA en broll/${SLUG}/.\n` +
    `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(out)};\n`);
  // cobertura por tramo de 5 min (el gotcha del throttle de Pexels: la 2ª mitad se queda sin b-roll)
  const BL = 300;
  const blocks = {};
  for (const o of out) { const b = Math.floor(o.start / BL); blocks[b] = (blocks[b] || 0) + 1; }
  console.log(`clips en disco: ${out.length} / ${anch.length}`);
  console.log("cobertura por bloque de 5min:", JSON.stringify(blocks));
  console.log(`→ src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`);
}
