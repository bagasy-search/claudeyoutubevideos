// build_tswcement.mjs — MONTAJE del video `tswcement` (canal EN "The Scrap Workshop").
//   "NO WELDING! The best USED OIL STOVE 2026 | Made from Cement, Blue Flame and Easily at home"
//
//   node gen_tswcement_plan.mjs   # DIRECTOR → _v3/tswcement_plan.json
//   node build_tswcement.mjs      # plan → cues + Main + index + _tswcement_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render):
//  · NARRADOR PURO: NO hay avatar, así que NO hay fondo garantizado. La compuerta de cobertura
//    es DURA (>=98%) y aborta el build: cada hueco es pantalla plana en el video entregado.
//  · OffthreadVideo en TODOS lados. NUNCA <Video> (busca por tiempo → tirón en todo el metraje).
//  · COMPUERTA DE FPS: todo clip a 30/1 CFR.
//  · Los COMPONENTES van en `overlays[]`, NUNCA como cue base: son paneles laterales y no
//    dibujan fondo completo, así que como plano base dejan pantalla muerta (mina de `dale1`).
//  · El .m4a se empuja a la lista de assets (el farm sólo conoce el .wav) o los 60 chunks dan 404.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "tswcement", COMP = "Tswcement", UP = "TSWCEMENT";
const KIT = "tswcement";          // ⛔ el kit de ESTE video es src/tswcement (no src/dale, no el compartido)
const STAGE_FILE = "ScrapStage";  // de acá salen Clip y Foto
const FPS = 30;

const WAV_FILE = `${SLUG}.m4a`;   // el RENDER usa m4a; el wav suelto queda para el stitch

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

if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE} (el master)`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
let { beats, overlays = [], totalMs } = plan;
beats.sort((a, b) => a.ms_in - b.ms_in);
overlays.sort((a, b) => a.ms_in - b.ms_in);

const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);
const sec = (ms) => +(ms / 1000).toFixed(3);

// ── assets + validaciones ──────────────────────────────────────────────────────────────────────
const assets = new Set();
const faltan = [];
const scanProps = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) assets.add(v); return; }
  if (Array.isArray(v)) return v.forEach(scanProps);
  if (v && typeof v === "object") return Object.values(v).forEach(scanProps);
};

// ── alineación por FRAME (evita huecos/solapes de 1 cuadro entre planos) ────────────────────────
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
  if (b.tipo === "clip" || b.tipo === "clipslow") {
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    const rate = b.tipo === "clipslow" ? (b.rate || 0.5) : 1;
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} rate={${rate}} />` });
  } else if (b.tipo === "imagen") {
    const r = `img/${b.imagen}.jpg`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(r)} seed={${b.f0}} />` });
  } else if (b.tipo === "componente") {
    console.error(`⛔ beat BASE de tipo componente en ms_in=${b.ms_in}: los componentes de este canal son PANELES y van en overlays[].`);
    process.exit(1);
  }
}

const ovCues = [];
for (const o of overlays) {
  const f0 = F(sec(o.ms_in));
  let f1 = F(sec(o.ms_out));
  if (f1 <= f0) f1 = f0 + F(2);
  usedComps.add(o.componente);
  scanProps(o.props);
  ovCues.push({ key: `ov_${o.ms_in}`, start: f0 / FPS, dur: (f1 - f0) / FPS,
    el: `(d) => <${o.componente} durationInFrames={d} {...(${JSON.stringify(o.props || {})} as any)} />` });
}

// ── COMPUERTA: assets en disco ─────────────────────────────────────────────────────────────────
if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO clip) ───────────────────────────────────────────────────
{
  const malos = [];
  for (const rel of [...assets].filter((a) => a.endsWith(".mp4"))) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${[...assets].filter((a) => a.endsWith(".mp4")).length} videos a ${FPS}/1 CFR`);
}

// ── COMPUERTA DE ASPECTO (16:9 ± tolerancia) ───────────────────────────────────────────────────
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

// ── cobertura / pacing ─────────────────────────────────────────────────────────────────────────
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const starts = rows.map((r) => r.f0 / FPS);
const gaps = []; for (let i = 0; i < starts.length - 1; i++) gaps.push(starts[i + 1] - starts[i]);
gaps.sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const largos = 100 * gaps.filter((x) => x >= 5).length / (gaps.length || 1);
const COBER = 100 * cov / TOTAL_FRAMES;
if (COBER < 98) { console.error(`⛔ cobertura ${COBER.toFixed(1)}% — NARRADOR PURO: sin avatar no hay fondo garantizado y cada hueco es pantalla plana.`); process.exit(1); }
console.log(`cobertura base ${COBER.toFixed(1)}% · pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s ${largos.toFixed(0)}%`);

// ── imports del cues (sólo los componentes usados) ─────────────────────────────────────────────
const STAGE = new Set(["Clip", "Foto", "Panel", "Kick", "Head", "Body"]);
const fromStage = ["Clip", "Foto"].concat([...usedComps].filter((c) => STAGE.has(c)));
const fromFiles = [...usedComps].filter((c) => !STAGE.has(c));
const imports = [
  `import React from "react";`,
  `import { ${[...new Set(fromStage)].sort().join(", ")} } from "../${KIT}/${STAGE_FILE}";`,
  ...fromFiles.sort().map((c) => `import { ${c} } from "../${KIT}/${c}";`),
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

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
`// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano. (canal NARRADOR PURO: sin avatar)
export const TOTAL_${UP} = ${(+TOTAL_S).toFixed(3)};
export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0D0F0D" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta >=98%). */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: paneles laterales POR ENCIMA de la base, nunca la ocultan del todo */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    <Audio src={staticFile("${WAV_FILE}")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${UP} };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── COMPUERTA <Video>: NUNCA <Video> en el kit de ESTE video ni en el Main/build ───────────────
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

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ──────────────────────────
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
if (sinBlur.length) { console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\``); sinBlur.slice(0, 8).forEach((x) => console.log("   " + x)); }
conBlur.push(WAV_FILE);   // ⛔ el .m4a NO lo agrega el farm (sólo conoce el .wav) -> 404 en los 60 chunks
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base) · overlays ${ovCues.length} · componentes distintos ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
