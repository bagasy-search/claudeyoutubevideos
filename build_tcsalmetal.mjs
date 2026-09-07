// build_tcsalmetal.mjs — MONTAJE del video `tcsalmetal` (canal "Taller de Claudio", ES).
//   "¡Mezcla carbón con sal! La mayoría de la gente nunca sabría lo que pasó"
//
//   node gen_tcsalmetal_plan.mjs   # DIRECTOR → _v3/tcsalmetal_plan.json
//   node build_tcsalmetal.mjs      # plan → cues + Main + index + _tcsalmetal_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render):
//  · NARRADOR PURO: no hay avatar, no hay fondo garantizado. La cobertura tiene que dar ≥98 %
//    o el build ABORTA: cada hueco es pantalla plana de marca.
//  · OffthreadVideo en TODOS lados. NUNCA <Video> (busca por tiempo → tirón).
//  · COMPUERTA DE FPS: todo clip a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · ⛔⛔ TODO componente va en `overlays[]`, NUNCA como cue base: como plano base queda solo
//    sobre el fondo de marca = pantalla negra (mina medida en `dale1`, 13 s).
//  · El `.m4a` va SÍ o SÍ en la lista de assets, o los 60 chunks mueren con 404.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "tcsalmetal", COMP = "Tcsalmetal", UP = "TCSALMETAL";
const KIT = "tcsalmetal";
const IMGDIR = `img/${SLUG}`, CLIPDIR = `broll/${SLUG}`;        // ⛔ el kit de ESTE video (clon repintado de src/tcsalcarbon)
const FPS = 30;

const WAV_FILE = `${SLUG}.m4a`;   // el RENDER usa m4a; el wav queda para el stitch/entrega

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, entries) => {
  try {
    return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries",
      `stream=${entries}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim();
  } catch { return ""; }
};
const durDe = (rel) => {
  try {
    return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration",
      "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0;
  } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE} (el máster en m4a)`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
let { beats, overlays = [], totalMs } = plan;
beats.sort((a, b) => a.ms_in - b.ms_in);
overlays.sort((a, b) => a.ms_in - b.ms_in);

const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);
const sec = (ms) => +(ms / 1000).toFixed(3);

// ── COMPUERTA: ningún componente como cue base ─────────────────────────────────────────────────
{
  const malos = beats.filter((b) => b.tipo === "componente");
  if (malos.length) {
    console.error(`⛔⛔ ${malos.length} componentes están como CUE BASE. Van en overlays[]:`);
    malos.slice(0, 10).forEach((b) => console.error(`   ms ${b.ms_in} · ${b.componente}`));
    process.exit(1);
  }
}

const assets = new Set();
const faltan = [];
const scanProps = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) assets.add(v); return; }
  if (Array.isArray(v)) return v.forEach(scanProps);
  if (v && typeof v === "object") return Object.values(v).forEach(scanProps);
};

// ── alineación por FRAME (evita huecos/solapes de 1 cuadro entre planos) ─────────────────────────
const rows = beats.map((b) => ({ ...b, f0: F(sec(b.ms_in)), f1: F(sec(b.ms_out)) }));
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  if (rows[i].f1 > sig) rows[i].f1 = sig;                       // sin solape
  if (Math.abs(sig - rows[i].f1) <= 1) rows[i].f1 = sig;        // pega la frontera exacta
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

const cues = [];
const usedComps = new Set();
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS;
  const key = `${b.tipo}_${b.ms_in}`;
  if (b.tipo === "clip") {
    const r = `${CLIPDIR}/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} />` });
  } else if (b.tipo === "clipslow") {
    // clip de ~5 s a 0,5x -> 10 s en pantalla. Cubre los momentos largos sin repetir imagen.
    const r = `${CLIPDIR}/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} speed={${b.speed || 0.5}} />` });
  } else if (b.tipo === "imagen") {
    const r = `${IMGDIR}/${b.imagen}.jpg`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(r)} seed={${b.f0}} />` });
  } else {
    console.error(`⛔ tipo de beat desconocido: ${b.tipo}`); process.exit(1);
  }
}

const ovCues = [];
for (const o of overlays) {
  const f0 = F(sec(o.ms_in));
  let f1 = F(sec(o.ms_out));
  if (f1 <= f0) f1 = f0 + F(2);
  if (f1 > TOTAL_FRAMES) f1 = TOTAL_FRAMES;
  usedComps.add(o.componente);
  scanProps(o.props);
  ovCues.push({ key: `ov_${o.ms_in}`, start: f0 / FPS, dur: (f1 - f0) / FPS,
    el: `(d) => <${o.componente} {...(${JSON.stringify(o.props || {})} as any)} />` });
}

// ── COMPUERTA: assets en disco ──────────────────────────────────────────────────────────────────
if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO clip) ────────────────────────────────────────────────────
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = [];
  for (const rel of vids) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${vids.length} videos a ${FPS}/1 CFR`);
}

// ── COMPUERTA DE ASPECTO (16:9 ± tolerancia) ────────────────────────────────────────────────────
{
  const malos = [];
  for (const rel of [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a))) {
    const wh = probe(rel, "width,height").split(",");
    const w = +wh[0], h = +wh[1];
    if (w && h) { const ar = w / h; if (Math.abs(ar - 16 / 9) > 0.06) malos.push(`${rel} ${w}x${h} (ar ${ar.toFixed(3)})`); }
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} imágenes NO son 16:9 (se cortan con objectFit cover):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`aspecto ✓ imágenes 16:9`);
}

// ── cobertura / pacing ──────────────────────────────────────────────────────────────────────────
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const durs = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)] || 0;
const p75 = durs[Math.floor(durs.length * 0.75)] || 0;
const largos = 100 * durs.filter((x) => x >= 5).length / (durs.length || 1);
const COBER = 100 * cov / TOTAL_FRAMES;
if (COBER < 98) {
  console.error(`⛔ cobertura ${COBER.toFixed(1)}% — sin avatar NO hay fondo garantizado, cada hueco es pantalla plana.`);
  process.exit(1);
}
console.log(`cobertura base ${COBER.toFixed(2)}% · pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s ${largos.toFixed(0)}%`);

// ── imports del cues ────────────────────────────────────────────────────────────────────────────
const fromPiezas = [...new Set(["Clip", "Foto", ...usedComps])].sort();
const imports = [
  `import React from "react";`,
  `import { ${fromPiezas.join(", ")} } from "../${KIT}/Piezas";`,
];

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
${imports.join("\n")}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];

export const OVERLAYS: Cue[] = [
${ovCues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};

const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta ≥98 %). */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA del metraje, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    <Audio src={staticFile("${WAV_FILE}")} />
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./${KIT}/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── COMPUERTA <Video>: NUNCA <Video> en las piezas del kit ni en el Main/build ──────────────────
{
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `build_${SLUG}.mjs`];
  for (const fn of fs.readdirSync(`src/${KIT}`)) if (/\.tsx?$/.test(fn)) files.push(`src/${KIT}/${fn}`);
  const malos = [];
  for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    const src = fs.readFileSync(fpath, "utf8").split("\n")
      .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); })
      .join("\n");
    const needle1 = "<Vid" + "eo ", needle2 = "<Vid" + "eo>";
    if (src.includes(needle1) || src.includes(needle2)) malos.push(fpath);
  }
  if (malos.length) { console.error(`⛔ elemento de video legacy encontrado (usá OffthreadVideo):`); malos.forEach((m) => console.error("   " + m)); process.exit(1); }
  console.log(`OffthreadVideo ✓ (0 elementos legacy en src/${KIT}, Main y build)`);
}

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ────────────────────────────
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) {
    const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) { console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg (el kit de este canal NO los usa — informativo)`); }
conBlur.push(WAV_FILE);   // ⛔ el .m4a NO lo agrega el farm (solo conoce el .wav) -> 404 en los 60 chunks
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base) · overlays ${ovCues.length} · componentes ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (lista ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
