// build_tswgold.mjs — MONTAJE VLOG CRUDO de "The Scrap Workshop" · `tswgold` · NARRADOR PURO.
// Un plano por MOMENTO, material a sangre, CERO componentes (vara del canal:
// feedback_edicion_vlog_casero_claudio).
//
// ⛔⛔ DIFERENCIA CON LOS DOS VIDEOS ANTERIORES DEL CANAL: **NO HAY AVATAR**. En `tswoil3in1` y
// `tswminioil` el avatar era el fondo garantizado y tapaba cualquier hueco. Acá el b-roll sostiene
// el 100 % de la pantalla, así que la cobertura pasa de "anti-hueco" a COMPUERTA DURA: si un
// momento no tiene ni clip ni foto, no hay nada abajo y queda NEGRO. El build aborta.
//
//   node build_tswgold.mjs
//
// Emite: src/tswgold/cues_tswgold.gen.tsx + Main_tswgold.tsx
//        + src/index_tswgold.tsx + _tswgold_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "tswgold";
const COMP = "Tswgold";
const UP = "TSWGOLD";
const FPS = 30;
const FFPROBE = process.env.FFPROBE || `${process.env.HOME || process.env.USERPROFILE}/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe`;
const WAV = `public/${SLUG}.wav`;
const AUDIO = `${SLUG}.m4a`;                     // el WAV de 148 MB no viaja al farm: cada chunk se baja el tar entero
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;
const MAX_STRETCH = 0.5;                         // el clip se estira hasta 0.5x antes de ceder a la foto
const EPS = 0.01;
const COBERTURA_MIN = 98;                        // %

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

// ⛔⛔ CLIPS QUE SE REINVENTARON LA ESCENA (agnes i2v): el clip arranca fiel a la foto y a partir
// del segundo ~1 REDIBUJA todo si el `motion` REVELA o CREA algo que no estaba en la foto.
// Se les cae el clip y los sostiene SU foto, que sí está bien.
const CLIP_REINVENTADO = new Set((() => {
  try { return JSON.parse(fs.readFileSync(`_v3/${SLUG}_clips_malos.json`, "utf8")); } catch { return []; }
})());

for (const p of plan) {
  p.hasClip = exists(`public/${CLIPDIR}/${p.name}.mp4`) && !CLIP_REINVENTADO.has(p.name);
  p.hasImg = exists(`public/${IMGDIR}/${p.name}.jpg`);
  p.clipDur = p.hasClip ? ffdur(`public/${CLIPDIR}/${p.name}.mp4`) : 0;
}

// ⛔ COMPUERTA SIN AVATAR: cada momento TIENE que traer al menos su foto. Si no, queda negro.
const sinAsset = plan.filter((p) => !p.hasClip && !p.hasImg);
if (sinAsset.length) {
  console.error(`X ${sinAsset.length} momentos SIN NINGUN ASSET — sin avatar eso es pantalla negra:`,
    sinAsset.slice(0, 12).map((p) => p.name));
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
      if (slot - cov > 0.25 && p.hasImg) {
        cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start + cov, b: slotEnd, seed: seed++, i: p.i });
      }
    }
  } else {
    cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start, b: slotEnd, seed: seed++, i: p.i });
  }
}

// ⛔⛔ PASADA FINAL — cada cue se ESTIRA hasta el arranque del siguiente (Math.max, nunca
// Math.min: recortar deja huecos). Con esto la cobertura es 100 % POR CONSTRUCCIÓN, que es la
// única forma de no depender de la suerte cuando no hay avatar abajo.
cues.sort((x, y) => x.a - y.a);
for (let i = 0; i < cues.length - 1; i++) cues[i].b = Math.max(cues[i].b, cues[i + 1].a);
if (cues.length) cues[cues.length - 1].b = Math.max(cues[cues.length - 1].b, TOTAL / FPS);
if (cues.length) cues[0].a = 0;

// alineación a frames + pegado de fronteras (anti destello de 1 frame)
const out = cues.map((c) => ({ ...c, f0: F(c.a), f1: F(c.b) }));
for (let i = 0; i < out.length - 1; i++) {
  if (Math.abs(out[i + 1].f0 - out[i].f1) <= 1) out[i].f1 = out[i + 1].f0;
}
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
// Sin avatar no hay fondo garantizado: el negro de abajo es sólo una red, no un piso.
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
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

// ── lista de assets para el tar del farm ────────────────────────────────────────
// ⛔⛔ EL .m4a TIENE QUE ESTAR EN LA LISTA o los 60 chunks mueren con 404 sobre el <Audio>.
// ⚠️ Este kit NO usa `_blur.jpg` (`Foto` de Piezas.tsx renderiza sólo el jpg y le hace Ken-Burns).
//    Los builds anteriores del canal igual los empaquetaban: eran ~la mitad del peso de imagen del
//    tar, bajado por cada uno de los 60 chunks, para nada. Acá no van.
const assets = new Set([AUDIO]);
for (const c of out) assets.add(c.src);
const faltan = [...assets].filter((a) => !exists(`public/${a}`));
console.log(`[assets] ${assets.size} referenciados · faltan en disco ${faltan.length}`);
if (faltan.length) { console.error("X faltan assets:", faltan.slice(0, 8)); process.exit(1); }
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

// ── medidas + COMPUERTA DE COBERTURA ────────────────────────────────────────────
const cubierto = out.reduce((s, c) => s + c.dur, 0);
const cob = 100 * cubierto / TOTAL;
const durs = out.map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor((durs.length - 1) * p)];
console.log(`cues ${out.length} · TOTAL ${TOTAL}f (${(TOTAL / FPS).toFixed(1)}s) · wav ${WAV_DUR.toFixed(1)}s`);
console.log(`cobertura ${cob.toFixed(2)}%`);
console.log(`plano: mediana ${q(.5).toFixed(2)}s · p75 ${q(.75).toFixed(2)}s · max ${q(1).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5 - EPS).length / durs.length).toFixed(0)}%`);
console.log(`clips ${out.filter((c) => c.kind === "clip").length} · fotos ${out.filter((c) => c.kind === "foto").length} · clips descartados ${CLIP_REINVENTADO.size}`);
if (cob < COBERTURA_MIN) { console.error(`X cobertura ${cob.toFixed(2)}% < ${COBERTURA_MIN}% — sin avatar eso es pantalla negra`); process.exit(1); }
console.log(`TOTAL_FRAMES=${TOTAL}`);
