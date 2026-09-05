// build_raybar1.mjs — MONTAJE del video `rksafe` (canal Ray Kessler, EN/US, retired locksmith).
//   "Where to Hide a Safe — Best & Worst Places in Your Bedroom"
//
//   node gen_raybar1_plan.mjs   # DIRECTOR → _v3/rksafe_plan.json
//   node build_raybar1.mjs      # plan → cues + Main + index + _rksafe_assets.txt
//
// Lee   _v3/rksafe_plan.json  (beats base + overlays, anclados al ms de la voz)
// Emite src/VideoEdit/{cues_rksafe.gen.tsx, avatar_rksafe.gen.ts, Main_rksafe.tsx}
//     + src/index_rksafe.tsx + _rksafe_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render):
//  · El AVATAR es el FONDO GARANTIZADO: base FULL SIEMPRE. Es PARCIAL (0..685,37s) → BUCLE muteado
//    para la cola (685,71..1320,7s). El audio de TODO el video es UN solo <Audio> con el master.
//  · OffthreadVideo en TODOS lados (avatar + clips). NUNCA <Video> (busca por tiempo → tirón).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los overlays van ENCIMA, no ocultan la base (un overlay que oculta deja negro si abajo no hay nada).
//  · Cama de foto debajo de TODO componente (los componentes traen su prop `bed`).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale1", COMP = "Dale1", UP = "DALE1";
const FPS = 30;

const WAV_FILE = `${SLUG}.m4a`;   // el RENDER usa m4a (31MB vs 115MB x60 chunks); el wav queda para el stitch

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
const AVATAR_S = 0;
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const AVATAR_FRAMES = 0; // canal NARRADOR PURO: no hay avatar
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

// ── alineación por FRAME (evita huecos/solapes de 1 cuadro entre planos) ─────────────────────────
// mdmold/cmesilencio: redondear start y dur por separado deja destellos del fondo de 33 ms.
// Se deriva la duración del FRAME FINAL y se pega la frontera al arranque del vecino si cae a ±1.
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
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} />` });
  } else if (b.tipo === "clipslow") {
    // clip de ~3 s reproducido a 0,5x -> 6 s en pantalla. Movimiento en todo el video sin repetir.
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} rate={${b.rate || 0.5}} />` });
  } else if (b.tipo === "imagen") {
    const r = `img/${b.imagen}.jpg`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(r)} seed={${b.f0}} />` });
  } else if (b.tipo === "componente") {
    usedComps.add(b.componente);
    scanProps(b.props);
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} {...(${JSON.stringify(b.props || {})} as any)} />` });
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

// ── COMPUERTA: assets en disco (+ sus _blur.jpg) ────────────────────────────────────────────────
if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO clip + el avatar) ────────────────────────────────────────
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

// ── COMPUERTA DE ASPECTO (16:9 ± tolerancia) sobre las imágenes usadas ──────────────────────────
{
  const malos = [];
  // El QR va dentro de una caja chica con objectFit:"contain" (no cover), asi que es cuadrado a proposito.
  for (const rel of [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/i.test(a))) {
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

// ── AVATAR_WINDOWS (para density_gate: full = avatar solo · hidden = tapado por contenido base) ──
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
const windows = [];
let lastMode = null;
for (let x = 0; x < TOTAL_FRAMES; x++) {
  const mode = covered[x] ? "hidden" : "full";
  if (mode !== lastMode) { windows.push({ start: +(x / FPS).toFixed(3), mode }); lastMode = mode; }
}

// ── cobertura / pacing ──────────────────────────────────────────────────────────────────────────
let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const starts = rows.map((r) => r.f0 / FPS);
const gaps = []; for (let i = 0; i < starts.length - 1; i++) gaps.push(starts[i + 1] - starts[i]);
gaps.sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const largos = 100 * gaps.filter((x) => x >= 5).length / (gaps.length || 1);
const COBER = 100 * cov / TOTAL_FRAMES;
if (COBER < 98) { console.error(`⛔ cobertura ${COBER.toFixed(1)}% — sin avatar NO hay fondo garantizado, cada hueco es pantalla plana.`); process.exit(1); }
console.log(`cobertura base ${COBER.toFixed(1)}% · pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s ${largos.toFixed(0)}%`);

// ── imports del cues (sólo los componentes usados) ──────────────────────────────────────────────
const STAGE = new Set(["Clip", "Foto", "StatBug", "Label", "Keyring"]);
const fromStage = ["Clip", "Foto"].concat([...usedComps].filter((c) => STAGE.has(c)));
const fromFiles = [...usedComps].filter((c) => !STAGE.has(c));
const imports = [
  `import React from "react";`,
  `import { ${[...new Set(fromStage)].sort().join(", ")} } from "../dale/RayStage";`,
  ...fromFiles.sort().map((c) => `import { ${c} } from "../dale/${c}";`),
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
`// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_${UP} = ${(+TOTAL_S).toFixed(3)};
export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
export const AVATAR_FRAMES_${UP} = ${AVATAR_FRAMES};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta ≥98%). */}

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master: cubre TODO el video (avatar parcial + cola). */}
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

// ── COMPUERTA <Video>: NUNCA <Video> en las piezas del slug ni en el Main/build ─────────────────
{
  const KIT = "rksafe"; // raybar1 REUSA el kit del canal (src/rksafe), no clona uno propio
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `build_${SLUG}.mjs`];
  for (const fn of fs.readdirSync(`src/${KIT}`)) if (/\.tsx?$/.test(fn)) files.push(`src/${KIT}/${fn}`);
  const malos = [];
  for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    const src = fs.readFileSync(fpath, "utf8").split("\n")
      .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); })
      .join("\n");
    const needle1 = "<Vid" + "eo ", needle2 = "<Vid" + "eo>"; // concatenado: el literal no aparece en este archivo
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
if (sinBlur.length) { console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\``); sinBlur.slice(0, 8).forEach((x) => console.log("   " + x)); }
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base) · overlays ${ovCues.length} · componentes distintos ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`avatar bucle ${AVATAR_FRAMES} frames (${AVATAR_S.toFixed(1)}s) · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
