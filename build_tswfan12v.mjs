// build_tswfan12v.mjs — MONTAJE VLOG CRUDO de "The Scrap Workshop" (estufa de aceite usado
// con ventilador de 12 V). NARRADOR PURO: no hay avatar, o sea que NO HAY PISO GARANTIZADO.
// Un plano por MOMENTO, material a sangre, CERO componentes (vara del canal:
// feedback_edicion_vlog_casero_claudio). El asset se indexa por el INDICE DEL MOMENTO.
//
//   node build_tswfan12v.mjs
//
// Emite: src/tswfan12v/cues_tswfan12v.gen.tsx + Main_tswfan12v.tsx
//        + src/index_tswfan12v.tsx + _tswfan12v_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "tswfan12v";
const COMP = "Tswfan12v";
const UP = "TSWFAN12V";
const FPS = 30;
const FFPROBE = process.env.FFPROBE || `${process.env.HOME || process.env.USERPROFILE}/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe`;
const WAV = `public/${SLUG}.wav`;
const AUDIO = `${SLUG}.m4a`;                     // el WAV de 156 MB no viaja al farm: cada chunk se baja el tar entero
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;
const MAX_STRETCH = 0.5;                         // el clip se estira hasta 0.5x antes de ceder a la foto
const EPS = 0.01;
const MIN_COBERTURA = 98.0;

const ffdur = (p) => Number(execFileSync(FFPROBE,
  ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" }).trim());
const exists = (p) => fs.existsSync(p);

// ── copiar assets generados (viven fuera de public/) a public/ para el tar ────────
fs.mkdirSync(`public/${IMGDIR}`, { recursive: true });
fs.mkdirSync(`public/${CLIPDIR}`, { recursive: true });
let cpImg = 0, cpClip = 0;
for (const f of (exists(`imgsrc_${SLUG}`) ? fs.readdirSync(`imgsrc_${SLUG}`) : [])) {
  if (f.endsWith(".jpg")) { fs.copyFileSync(`imgsrc_${SLUG}/${f}`, `public/${IMGDIR}/${f}`); cpImg++; }
}
for (const f of (exists(`clipsrc_${SLUG}`) ? fs.readdirSync(`clipsrc_${SLUG}`) : [])) {
  if (f.endsWith(".mp4")) { fs.copyFileSync(`clipsrc_${SLUG}/${f}`, `public/${CLIPDIR}/${f}`); cpClip++; }
}
console.log(`assets copiados a public/: ${cpImg} img (incl. _blur) · ${cpClip} clips`);

const WAV_DUR = ffdur(WAV);
const TOTAL = Math.ceil(WAV_DUR * FPS) + 1;
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_anchored.json`, "utf8").replace(/^﻿/, ""));
plan.sort((a, b) => a.i - b.i);

// ── COMPUERTA DE FPS: todo clip tiene que estar a 30/1 CFR o el video tiembla ─────
let malFps = [];
for (const p of plan) {
  const c = `public/${CLIPDIR}/${p.name}.mp4`;
  if (!exists(c)) continue;
  const r = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v",
    "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", c], { encoding: "utf8" }).trim();
  if (r !== "30/1") malFps.push(`${p.name}:${r}`);
}
console.log(`[fps] clips medidos ${plan.filter((p) => exists(`public/${CLIPDIR}/${p.name}.mp4`)).length} · fuera de 30/1: ${malFps.length}`);
if (malFps.length) { console.error("X conformá los clips a 30/1 CFR antes de buildear:", malFps.slice(0, 6)); process.exit(1); }

// ⛔⛔ CLIPS QUE SE REINVENTARON LA ESCENA (agnes i2v): se les cae el clip y los sostiene SU foto.
const CLIP_REINVENTADO = new Set(
  exists(`_v3/${SLUG}_clips_malos.json`)
    ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_clips_malos.json`, "utf8"))
    : []);

for (const p of plan) {
  p.hasClip = exists(`public/${CLIPDIR}/${p.name}.mp4`) && !CLIP_REINVENTADO.has(p.name);
  p.hasImg = exists(`public/${IMGDIR}/${p.name}.jpg`);
  p.clipDur = p.hasClip ? ffdur(`public/${CLIPDIR}/${p.name}.mp4`) : 0;
}

// ⛔⛔ SIN AVATAR NO HAY FONDO: un momento sin ningún asset = pantalla negra.
const sinAsset = plan.filter((p) => !p.hasClip && !p.hasImg);
if (sinAsset.length) {
  console.error(`X ${sinAsset.length} momentos sin asset (narrador puro = pantalla negra):`,
    sinAsset.slice(0, 10).map((p) => p.name));
  process.exit(1);
}

// ── armado de cues ───────────────────────────────────────────────────────────────
const F = (s) => Math.round(s * FPS);
const cues = [];
let seed = 7;
for (const p of plan) {
  const start = p.ms, slotEnd = p.ms_end, slot = slotEnd - start;

  if (p.hasClip) {
    const real = p.clipDur - 0.05;
    if (slot <= real + EPS) {
      cues.push({ kind: "clip", src: `${CLIPDIR}/${p.name}.mp4`, a: start, b: slotEnd, i: p.i, speed: 1 });
    } else {
      // ⛔ NO REPETIR: si sobra tiempo el clip se ESTIRA hasta 0.5x (pedido del creador).
      const speed = Math.max(MAX_STRETCH, real / slot);
      const cov = real / speed;
      cues.push({ kind: "clip", src: `${CLIPDIR}/${p.name}.mp4`, a: start, b: start + Math.min(cov, slot), i: p.i, speed });
      // si AUN sobra, lo sostiene la FOTO DE ESE MISMO momento (mismo sujeto, otra lectura:
      // jamás el asset del vecino).
      if (slot - cov > 0.3 && p.hasImg) {
        cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start + cov, b: slotEnd, seed: seed++, i: p.i });
      }
    }
  } else {
    cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start, b: slotEnd, seed: seed++, i: p.i });
  }
}

// alineación a frames
const out = cues.map((c) => ({ ...c, f0: F(c.a), f1: F(c.b) }));
// ⛔⛔ PASADA FINAL: cada cue se ESTIRA hasta el f0 del siguiente (y el último hasta el final).
// Sin avatar, cualquier hueco es negro, así que la cobertura tiene que salir por CONSTRUCCIÓN,
// no por suerte. Math.max, nunca Math.min: recortar deja huecos.
for (let i = 0; i < out.length - 1; i++) out[i].f1 = Math.max(out[i].f1, out[i + 1].f0);
out[out.length - 1].f1 = Math.max(out[out.length - 1].f1, TOTAL);
if (out[0].f0 > 0) out[0].f0 = 0;
for (const c of out) c.dur = Math.max(1, c.f1 - c.f0);

// ── cues_<slug>.gen.tsx ──────────────────────────────────────────────────────────
const body = out.map((c, n) => {
  const el = c.kind === "clip"
    ? `<Clip src=${JSON.stringify(c.src)}${c.speed && c.speed < 0.999 ? ` speed={${c.speed.toFixed(3)}}` : ""} />`
    : `<Foto src=${JSON.stringify(c.src)} seed={${c.seed}} />`;
  return `  { key: "c${n}", start: ${c.f0}, dur: ${c.dur}, el: () => (${el}) },`;
}).join("\n");

fs.mkdirSync(`src/${SLUG}`, { recursive: true });
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto } from "./Piezas";

export const CUES_${UP}: { key: string; start: number; dur: number; el: (f: number) => React.ReactNode }[] = [
${body}
];
`);

// ── Main_<slug>.tsx ──────────────────────────────────────────────────────────────
// ⛔⛔ OffthreadVideo, NUNCA <Video>: al rendear, <Video> busca POR TIEMPO y devuelve
// cuadros equivocados de forma irregular = el "se ve lageado" de siempre.
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
// NARRADOR PURO: no hay avatar de piso. Los cues cubren el 100% por construcción.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_${UP} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL};

export const Main${COMP}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      {CUES_${UP}.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${AUDIO}")} />
    </AbsoluteFill>
  );
};
`);

// ── entry propio (evita el index.tsx COMPARTIDO que otra sesión deja apuntando a otro video) ──
fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./${SLUG}/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./${SLUG}/Main_${SLUG}";
const Root: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ── lista de assets para el tar del farm (toda imagen viaja con su _blur) ────────
// ⛔ el .m4a TIENE que estar en la lista o los 60 chunks mueren con 404.
// ⚠️ Este kit NO usa `_blur.jpg`: `Foto` de Piezas.tsx muestra la imagen NITIDA con Ken-Burns,
// no hay ningun fondo blureado. Meter los blur en el tar duplicaba el peso de las imagenes para
// nada (cada uno de los 60 chunks se baja el tar entero).
const assets = new Set([AUDIO]);
for (const c of out) assets.add(c.src);
const faltan = [...assets].filter((a) => !exists(`public/${a}`));
console.log(`[assets] ${assets.size} referenciados · faltan en disco ${faltan.length}`);
if (faltan.length) { console.error("X faltan assets:", faltan.slice(0, 8)); process.exit(1); }
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

// ── medidas + COMPUERTA DE COBERTURA (dura: sin avatar, el hueco es negro) ───────
const pintado = new Uint8Array(TOTAL);
for (const c of out) for (let f = Math.max(0, c.f0); f < Math.min(TOTAL, c.f1); f++) pintado[f] = 1;
let cubierto = 0;
for (let f = 0; f < TOTAL; f++) cubierto += pintado[f];
const cob = 100 * cubierto / TOTAL;
const durs = out.map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor((durs.length - 1) * p)];
console.log(`cues ${out.length} · TOTAL ${TOTAL}f (${(TOTAL / FPS).toFixed(1)}s) · wav ${WAV_DUR.toFixed(1)}s`);
console.log(`cobertura ${cob.toFixed(2)}% · cuadros negros ${TOTAL - cubierto}`);
console.log(`plano: mediana ${q(.5).toFixed(2)}s · p75 ${q(.75).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5 - EPS).length / durs.length).toFixed(0)}%`);
console.log(`clips ${out.filter((c) => c.kind === "clip").length} · fotos ${out.filter((c) => c.kind === "foto").length} · clips descartados ${CLIP_REINVENTADO.size}`);
if (cob < MIN_COBERTURA) { console.error(`X cobertura ${cob.toFixed(2)}% < ${MIN_COBERTURA}%`); process.exit(1); }
console.log(`TOTAL_FRAMES=${TOTAL}`);
