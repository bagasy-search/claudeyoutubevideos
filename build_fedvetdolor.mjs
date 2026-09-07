// build_fedvetdolor.mjs — MONTAJE del video `fedvetdolor` (canal Federer Veterinario, ES).
//   "Los Perros Nunca se Quejan: 10 Señales de Dolor que tu Perro te Está Escondiendo"
//
//   node gen_fedvetdolor_plan.mjs   # DIRECTOR → _v3/fedvetdolor_plan.json
//   node build_fedvetdolor.mjs      # plan → cues + Main + index + _fedvetdolor_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render):
//  · El AVATAR es el FONDO GARANTIZADO: base FULL SIEMPRE, montado UNA sola vez. Los momentos que el
//    plan deja sin beat son justamente donde se lo ve. El audio de TODO el video es UN solo <Audio>
//    con el master (el avatar va MUTEADO).
//  · OffthreadVideo en TODOS lados (avatar + clips). NUNCA <Video> (busca por tiempo → tirón).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los overlays van ENCIMA, no ocultan la base.
//  · Cama de foto debajo de TODO componente (los componentes traen su prop `bed`).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fedvetdolor", COMP = "Fedvetdolor", UP = "FEDVETDOLOR";
const FPS = 30;

const WAV_FILE = `${SLUG}.m4a`;      // el RENDER usa m4a; el wav queda suelto para el stitch
const AVATAR = `${SLUG}_opt.mp4`;    // el avatar encodeado (crop 1920x1080 + fps=30, SIN minterpolate)

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
if (!existe(AVATAR)) { console.error(`⛔ falta public/${AVATAR} (el avatar encodeado)`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
let { beats, overlays = [], totalMs } = plan;
beats.sort((a, b) => a.ms_in - b.ms_in);
overlays.sort((a, b) => a.ms_in - b.ms_in);

const WAV_S = durDe(WAV_FILE);
const AVATAR_S = durDe(AVATAR);
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const AVATAR_FRAMES = Math.floor(AVATAR_S * FPS);
const F = (s) => Math.round(s * FPS);
const sec = (ms) => +(ms / 1000).toFixed(3);

// ⛔ COMPUERTA DE AVATAR PARCIAL: si el avatar no llega al final del audio, la cola queda SIN fondo
//    garantizado y hay que aplicar la costura por palabra (video-pipeline 2.bis). No se sigue a ciegas.
// El creador grabó 628,4 s de un máster de 1436,6 s. Tramo 1: el avatar corre EN SINCRO (su propio
// audio es el que quedó en el máster, sin re-timing). Tramo 2: BUCLE MUTEADO como piso — la boca ya
// no coincide con la voz, así que en la cola el b-roll cubre el 100 % y el bucle sólo se ve debajo.
// `gen_*_plan.mjs` no reserva ningún momento de avatar a la vista después de la costura.
const COSTURA = JSON.parse(fs.readFileSync(`_v3/${SLUG}_costura.json`, "utf8"));
const AVATAR_END = COSTURA.corte_parrafo_ms / 1000;
if (AVATAR_S < AVATAR_END - 0.5) {
  console.error(`⛔ el avatar dura ${AVATAR_S.toFixed(1)}s pero la costura está en ${AVATAR_END.toFixed(1)}s: el encode salió corto. PARÁ.`);
  process.exit(1);
}
const LOOP_FRAMES = Math.max(1, Math.floor(AVATAR_S * FPS) - 2);
console.log(`avatar PARCIAL: sincro 0..${AVATAR_S.toFixed(1)}s · bucle ${AVATAR_S.toFixed(1)}..${WAV_S.toFixed(1)}s (costura ${AVATAR_END.toFixed(1)}s)`);

// ── assets + validaciones ──────────────────────────────────────────────────────────────────────
const assets = new Set([AVATAR]);
const faltan = [];
const scanProps = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) assets.add(v); return; }
  if (Array.isArray(v)) return v.forEach(scanProps);
  if (v && typeof v === "object") return Object.values(v).forEach(scanProps);
};

// ── alineación por FRAME (evita huecos/solapes de 1 cuadro entre planos) ─────────────────────────
// Redondear start y dur por separado deja destellos del fondo de 33 ms. Se deriva la duración del
// FRAME FINAL y se pega la frontera al arranque del vecino si cae a ±1.
// ⚠️ Acá los beats NO son contiguos a propósito (los huecos son el avatar), así que la frontera se
//    pega SÓLO cuando el vecino arranca a ±1 frame — nunca se estira sobre un hueco de avatar.
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

// ── COMPUERTA: assets en disco ──────────────────────────────────────────────────────────────────
if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO clip + el avatar) ────────────────────────────────────────
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = [];
  for (const rel of vids) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (!vids.length) { console.error("⛔ la compuerta de fps midió 0 videos — no es un OK"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${vids.length} videos a ${FPS}/1 CFR (avatar incluido)`);
}

// ── COMPUERTA DE ASPECTO (16:9 ± tolerancia) sobre las imágenes usadas ──────────────────────────
{
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/i.test(a));
  const malos = [];
  for (const rel of imgs) {
    const wh = probe(rel, "width,height").split(",");
    const w = +wh[0], h = +wh[1];
    if (w && h) { const ar = w / h; if (Math.abs(ar - 16 / 9) > 0.06) malos.push(`${rel} ${w}x${h} (ar ${ar.toFixed(3)})`); }
  }
  if (!imgs.length) { console.error("⛔ la compuerta de aspecto midió 0 imágenes — no es un OK"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} imágenes NO son 16:9 (se cortan con objectFit cover):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`aspecto ✓ ${imgs.length} imágenes 16:9`);
}

// ── AVATAR_WINDOWS (informativo para density_gate) + cobertura / pacing ─────────────────────────
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
const windows = [];
let lastMode = null;
for (let x = 0; x < TOTAL_FRAMES; x++) {
  const mode = covered[x] ? "hidden" : "full";
  if (mode !== lastMode) { windows.push({ start: +(x / FPS).toFixed(3), mode }); lastMode = mode; }
}

let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const starts = rows.map((r) => r.f0 / FPS);
const gaps = []; for (let i = 0; i < starts.length - 1; i++) gaps.push(starts[i + 1] - starts[i]);
gaps.sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const largos = 100 * gaps.filter((x) => x >= 5).length / (gaps.length || 1);
const COBER = 100 * cov / TOTAL_FRAMES;
// Con avatar NO hay pantalla plana posible: el piso es el presentador. Lo que se mide es que el
// b-roll no se coma el video entero (el avatar tiene que verse) ni deje al avatar de relleno.
if (COBER < 75) { console.error(`⛔ cobertura de b-roll ${COBER.toFixed(1)}% — demasiado avatar suelto, el video se lee como una charla`); process.exit(1); }
if (COBER > 96.5) { console.error(`⛔ cobertura de b-roll ${COBER.toFixed(1)}% — el avatar no se ve NUNCA; sacá beats en las entradas de sección`); process.exit(1); }
console.log(`cobertura b-roll ${COBER.toFixed(1)}% · avatar a la vista ${(100 - COBER).toFixed(1)}% (${((TOTAL_FRAMES - cov) / FPS).toFixed(0)}s)`);
console.log(`pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s ${largos.toFixed(0)}%`);

// ── imports del cues (sólo los componentes usados) ──────────────────────────────────────────────
const STAGE = new Set(["Clip", "Foto", "StatBug", "Label", "Keyring", "RayAvatar"]);
const fromStage = ["Clip", "Foto"].concat([...usedComps].filter((c) => STAGE.has(c)));
const fromFiles = [...usedComps].filter((c) => !STAGE.has(c));
const imports = [
  `import React from "react";`,
  `import { ${[...new Set(fromStage)].sort().join(", ")} } from "../fedvet/RayStage";`,
  ...fromFiles.sort().map((c) => `import { ${c} } from "../fedvet/${c}";`),
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
export const AVATAR_SRC_${UP} = ${JSON.stringify(AVATAR)};
export const LOOP_FRAMES_${UP} = ${LOOP_FRAMES};
export const AVATAR_END_${UP} = ${AVATAR_END.toFixed(3)};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { RayAvatar } from "../fedvet/RayStage";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP}, AVATAR_FRAMES_${UP}, AVATAR_SRC_${UP}, LOOP_FRAMES_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

// ⛔ OffthreadVideo, NUNCA <Video>: en el render <Video> busca por TIEMPO y devuelve cuadros
//    equivocados de forma irregular — es la causa #1 del "se ve lageado".
// ⛔ Nunca estático: push lento determinista (sub-píxel por transform, no horneado con ffmpeg).
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F15", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(AVATAR_SRC_${UP})}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\` }}
      />
    </AbsoluteFill>
  );
};

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* EL AVATAR ES EL FONDO GARANTIZADO. Tramo 1: en SINCRO (es su propio audio el que quedó en el
        máster). Tramo 2: BUCLE muteado, sólo como piso — la cola la cubre el b-roll al 100 %, así
        que la boca desincronizada no queda a la vista. */}
    <Sequence from={0} durationInFrames={AVATAR_FRAMES_${UP}} layout="none">
      <AvatarPiso />
    </Sequence>
    <Sequence from={AVATAR_FRAMES_${UP}} durationInFrames={Math.max(1, TOTAL_FRAMES_${UP} - AVATAR_FRAMES_${UP})} layout="none">
      <RayAvatar src={AVATAR_SRC_${UP}} loopFrames={LOOP_FRAMES_${UP}} />
    </Sequence>

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

    {/* UN solo <Audio> con el master: cubre TODO el video. */}
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

// ── COMPUERTA <Video>: NUNCA <Video> en las piezas del kit ni en el Main/build ──────────────────
{
  const KIT = "fedvet";   // el kit de ESTE canal
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `build_${SLUG}.mjs`];
  for (const fn of fs.readdirSync(`src/${KIT}`)) if (/\.tsx?$/.test(fn)) files.push(`src/${KIT}/${fn}`);
  const malos = [];
  let mirados = 0;
  for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    mirados++;
    const src = fs.readFileSync(fpath, "utf8").split("\n")
      .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); })
      .join("\n");
    const needle1 = "<Vid" + "eo ", needle2 = "<Vid" + "eo>";
    if (src.includes(needle1) || src.includes(needle2)) malos.push(fpath);
  }
  if (mirados < 5) { console.error(`⛔ la compuerta de video legacy sólo miró ${mirados} archivos — no es un OK`); process.exit(1); }
  if (malos.length) { console.error(`⛔ elemento de video legacy encontrado (usá OffthreadVideo):`); malos.forEach((m) => console.error("   " + m)); process.exit(1); }
  console.log(`OffthreadVideo ✓ (0 elementos legacy en ${mirados} archivos)`);
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
conBlur.push(WAV_FILE);   // ⛔ el .m4a NO lo agrega el farm (solo conoce el .wav) -> 404 en los 60 chunks
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base) · overlays ${ovCues.length} · componentes distintos ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`avatar ${AVATAR_S.toFixed(1)}s · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
