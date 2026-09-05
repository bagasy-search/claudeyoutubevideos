// build_tswoil3in1.mjs — MONTAJE VLOG CRUDO del canal EN "The Scrap Workshop".
// Un plano por FRASE, material a sangre, CERO componentes (vara del canal:
// feedback_edicion_vlog_casero_claudio). El avatar es el piso garantizado: real los primeros
// 13:14 y en bucle mudo el resto (el video dura 29:31 y la cola la narra la voz Fish clonada).
//
//   node build_tswoil3in1.mjs
//
// Emite: src/tswoil3in1/cues_tswoil3in1.gen.tsx + Main_tswoil3in1.tsx + src/index_tswoil3in1.tsx
//        + _tswoil3in1_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "tswoil3in1";
const FPS = 30;
const WAV = `public/${SLUG}.wav`;
const AVATAR = `${SLUG}_floor.mp4`;
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;
const SRCCLIP = "public/broll/tsw";
const HOOK_END_MS = 40000;
const FF = process.env.FFPROBE || "ffprobe";

const ffdur = (p) => Number(execFileSync(FF,
  ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" }).trim());
const exists = (p) => fs.existsSync(p);

// ── clips generados -> public/broll/<slug>/ (prefijados por slug: carpeta compartida) ──
fs.mkdirSync(`public/${CLIPDIR}`, { recursive: true });
let cp = 0;
for (const f of (exists(SRCCLIP) ? fs.readdirSync(SRCCLIP) : [])) {
  if (!f.endsWith(".mp4")) continue;
  const dst = `public/${CLIPDIR}/${f}`;
  if (!exists(dst)) { fs.copyFileSync(`${SRCCLIP}/${f}`, dst); cp++; }
}
console.log(`clips copiados a public/${CLIPDIR}: ${cp}`);

const WAV_DUR = ffdur(WAV);
const TOTAL = Math.ceil(WAV_DUR * FPS) + 1;
const plan = JSON.parse(fs.readFileSync(`_v3/plan_${SLUG}.json`, "utf8").replace(/^﻿/, ""));

// ⛔ COMPUERTA DE FPS: todo clip tiene que estar a 30/1 o Remotion reparte cuadros IRREGULARES
// (judder). agnes se le pidió a 30 explícito; se verifica igual, no se asume.
const malfps = [];
for (const p of plan) {
  p.hasClip = exists(`public/${CLIPDIR}/${p.name}.mp4`);
  p.hasImg = exists(`public/${IMGDIR}/${p.name}.jpg`);
  p.tipo = p.hasClip ? "clip" : "foto";
  p.clipDur = 0;
  if (!p.hasClip) continue;
  const f = `public/${CLIPDIR}/${p.name}.mp4`;
  p.clipDur = ffdur(f);
  const r = execFileSync(FF, ["-v", "error", "-select_streams", "v", "-show_entries",
    "stream=r_frame_rate", "-of", "csv=p=0", f], { encoding: "utf8" }).trim();
  if (r !== "30/1") malfps.push(`${p.name}=${r}`);
}
if (malfps.length) { console.error(`⛔ clips fuera de 30/1: ${malfps.slice(0, 8).join(" ")}`); process.exit(1); }
console.log(`fps ✓ · clips ${plan.filter((p) => p.hasClip).length} · fotos ${plan.filter((p) => !p.hasClip).length}`);

const sinAsset = plan.filter((p) => !p.hasClip && !p.hasImg);
if (sinAsset.length) console.log(`⚠ momentos sin ningún asset (los cubre el avatar): ${sinAsset.length}`);

// ── dónde se ve el AVATAR a cara pelada: sólo el arranque ────────────────────────
// Regla del canal: ABRIR con el avatar hablando. Después, cobertura casi total.
// ⛔ Sólo el PRIMER beat. Abrir con el avatar hablando es la regla del canal, pero dejar
// "todos los momentos sin clip del hook" en avatar fabrica tramos de 11 s sin material —
// exactamente el tramo muerto que el creador marca. El resto del hook va cubierto.
const AVATAR_SOLO = new Set([0]);

// ── cues, alineados al FRAME ──────────────────────────────────────────────────────
const F = (s) => Math.round(s * FPS);
const cues = [];
let seed = 11;
for (let k = 0; k < plan.length; k++) {
  const p = plan[k];
  const start = p.ms / 1000;
  const slotEnd = k + 1 < plan.length ? plan[k + 1].ms / 1000 : WAV_DUR;
  const slot = slotEnd - start;
  if (AVATAR_SOLO.has(p.i) || slot <= 0.1) continue;

  if (p.tipo === "clip") {
    const src = `${CLIPDIR}/${p.name}.mp4`;
    const realDur = p.clipDur - 0.05;
    if (slot <= realDur) {
      cues.push({ kind: "clip", src, a: start, b: slotEnd, i: p.i, speed: 1 });
    } else {
      // ⛔ NO REPETIR una imagen: si sobra tiempo el clip se ESTIRA hasta 0.5x (pedido del
      // creador). Si AÚN sobra, lo cubre la FOTO DE ESE MISMO MOMENTO — mismo sujeto, otra
      // lectura. Nunca el asset del vecino.
      const speed = Math.max(0.5, realDur / slot);
      const covered = Math.min(realDur / speed, slot);
      cues.push({ kind: "clip", src, a: start, b: start + covered, i: p.i, speed });
      if (slot - covered > 0.4 && p.hasImg)
        cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start + covered, b: slotEnd, seed: seed++, i: p.i });
    }
  } else if (p.hasImg) {
    cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start, b: slotEnd, seed: seed++, i: p.i });
  }
}

// alineación a frames + pegado de fronteras (anti destello de 1 cuadro: `from` y `dur` se
// redondean por separado y dejan un hueco de 33 ms donde asoma el fondo)
const out = cues.map((c) => ({ ...c, f0: F(c.a), f1: F(c.b) }));
for (let i = 0; i < out.length - 1; i++) {
  if (Math.abs(out[i + 1].f0 - out[i].f1) <= 1) out[i].f1 = out[i + 1].f0;
}
for (const c of out) c.dur = Math.max(1, c.f1 - c.f0);

const body = out.map((c, n) => {
  const el = c.kind === "clip"
    ? `<Clip src=${JSON.stringify(c.src)}${c.speed && c.speed < 0.999 ? ` speed={${c.speed.toFixed(3)}}` : ""} />`
    : `<Foto src=${JSON.stringify(c.src)} seed={${c.seed}} />`;
  return `  { key: "c${n}", start: ${c.f0}, dur: ${c.dur}, el: () => (${el}) },`;
}).join("\n");

fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto } from "./Piezas";

export const CUES_TSW: { key: string; start: number; dur: number; el: (f: number) => React.ReactNode }[] = [
${body}
];
`);

fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSW } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_TSW = ${TOTAL};

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del máster). Push lento cíclico.
 *  ⛔ OffthreadVideo, NUNCA <Video>: al rendear, <Video> busca por TIEMPO y sirve cuadros
 *  equivocados de forma irregular — es la causa nº1 del "se ve lageado". */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile("${AVATAR}")} muted style={est} />
    </AbsoluteFill>
  );
};

export const MainTsw: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TSW.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.m4a")} />
    </AbsoluteFill>
  );
};
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./${SLUG}/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTsw, TOTAL_FRAMES_TSW } from "./${SLUG}/Main_${SLUG}";
const Root: React.FC = () => (
  <Composition id="Tswoil3in1" component={MainTsw} durationInFrames={TOTAL_FRAMES_TSW} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ── lista de assets para el tar. Toda imagen viaja CON su _blur.jpg (el kit lo pide en
//    runtime y el pre-vuelo BLUER del farm aborta si falta). ────────────────────────
const assets = new Set([AVATAR, `${SLUG}.m4a`]);
for (const c of out) {
  assets.add(c.src);
  if (c.kind === "foto") assets.add(c.src.replace(/\.jpg$/, "_blur.jpg"));
}
const faltan = [...assets].filter((a) => !exists(`public/${a}`));
if (faltan.length) { console.error(`⛔ assets citados que NO existen en disco: ${faltan.slice(0, 6).join(" ")}`); process.exit(1); }
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

// ── compuerta: ningún <Video> en el árbol del video ───────────────────────────────
for (const f of [`src/${SLUG}/Main_${SLUG}.tsx`, `src/${SLUG}/Piezas.tsx`, `src/${SLUG}/cues_${SLUG}.gen.tsx`]) {
  const crudo = fs.readFileSync(f, "utf8").split("\n")
    .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); }).join("\n");
  if (crudo.includes("<Video ") || crudo.includes("<Video>")) { console.error(`⛔ <Video> en ${f}`); process.exit(1); }
}

// ── medidas ───────────────────────────────────────────────────────────────────────
const cubierto = out.reduce((s, c) => s + c.dur, 0);
const durs = out.map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (x) => durs[Math.floor((durs.length - 1) * x)];
const huecos = [];
{
  let cur = 0;
  const orden = [...out].sort((a, b) => a.f0 - b.f0);
  for (const c of orden) { if (c.f0 - cur > 6 * FPS) huecos.push([cur / FPS, c.f0 / FPS]); cur = Math.max(cur, c.f1); }
  if (TOTAL - cur > 6 * FPS) huecos.push([cur / FPS, TOTAL / FPS]);
}
console.log(`cues ${out.length} · TOTAL ${TOTAL}f (${(TOTAL / FPS).toFixed(1)}s) · wav ${WAV_DUR.toFixed(1)}s`);
console.log(`cobertura ${(100 * cubierto / TOTAL).toFixed(1)}% · avatar a cara pelada ${(100 * (1 - cubierto / TOTAL)).toFixed(1)}%`);
console.log(`plano: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`clips ${out.filter((c) => c.kind === "clip").length} · fotos ${out.filter((c) => c.kind === "foto").length} · assets ${assets.size}`);
console.log(`huecos >6s: ${huecos.length}${huecos.length ? " -> " + huecos.slice(0, 5).map(([a, b]) => `${a.toFixed(0)}-${b.toFixed(0)}s`).join(" ") : ""}`);
