// build_tswminioil.mjs — MONTAJE VLOG CRUDO de "The Scrap Workshop" (mini estufa de aceite).
// Un plano por MOMENTO, material a sangre, CERO componentes (vara del canal:
// feedback_edicion_vlog_casero_claudio). El avatar es el PISO garantizado (bucle mudo).
// El asset se indexa por el INDICE DEL MOMENTO, nunca por un contador corrido.
//
//   node build_tswminioil.mjs
//
// Emite: src/tswminioil/cues_tswminioil.gen.tsx + Main_tswminioil.tsx
//        + src/index_tswminioil.tsx + _tswminioil_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "tswminioil";
const FPS = 30;
const FFPROBE = process.env.FFPROBE || `${process.env.HOME || process.env.USERPROFILE}/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe`;
const WAV = `public/${SLUG}.wav`;
const AVATAR = `${SLUG}_opt.mp4`;                // avatar real, muteado, 30/1 CFR (se loopea en Remotion)
const AUDIO = `${SLUG}.m4a`;                     // el WAV de 165 MB no viaja al farm: cada chunk se baja el tar entero
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;
const HOOK_END = 26;                             // s — zona de hook: ahi se ve la cara del avatar
const MAX_STRETCH = 0.5;                         // el clip se estira hasta 0.5x antes de ceder a la foto
const EPS = 0.01;

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

const AV_FRAMES = Math.floor(ffdur(`public/${AVATAR}`) * FPS);
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

// ⛔⛔ CLIPS QUE SE REINVENTARON LA ESCENA (agnes i2v). El clip arranca fiel a la foto y a partir
// del segundo ~1 REDIBUJA todo si el `motion` REVELA o CREA algo que no estaba en la foto: una
// puerta que se abre, una llamarada que brota, alguien que camina. Medido acá: esos 4 tienen
// deriva 41-86 (primer cuadro vs cuadro tardío) contra 11-35 de los sanos, y en `tsm_236` la
// fachada de un taller se convirtió en su interior CON UNA PERSONA que no existe — el creador lo
// cazó mirando el render. Se les cae el clip y los sostiene SU foto, que sí está bien.
// Los micro-movimientos (humo, resplandor, una gota, un dedo que golpetea) no fallan nunca.
const CLIP_REINVENTADO = new Set(["tsm_119", "tsm_236", "tsm_233", "tsm_262"]);

for (const p of plan) {
  p.hasClip = exists(`public/${CLIPDIR}/${p.name}.mp4`) && !CLIP_REINVENTADO.has(p.name);
  p.hasImg = exists(`public/${IMGDIR}/${p.name}.jpg`);
  p.clipDur = p.hasClip ? ffdur(`public/${CLIPDIR}/${p.name}.mp4`) : 0;
}

// ── qué momentos muestran el AVATAR a cara pelada ────────────────────────────────
// Sólo el arranque: el video ABRE con él hablando (feedback_edicion_apertura_avatar_y_no_repetir),
// y después el material cubre todo. Nunca dos avatar seguidos (deja un tramo muerto largo).
const AVATAR_SOLO = new Set([0]);
for (const p of plan) if (p.ms < HOOK_END && !p.hasClip) AVATAR_SOLO.add(p.i);
for (const p of plan) if (AVATAR_SOLO.has(p.i) && AVATAR_SOLO.has(p.i - 1)) AVATAR_SOLO.delete(p.i);

// ── armado de cues ───────────────────────────────────────────────────────────────
const F = (s) => Math.round(s * FPS);
const cues = [];
let seed = 7;
for (const p of plan) {
  const start = p.ms, slotEnd = p.ms_end, slot = slotEnd - start;
  if (AVATAR_SOLO.has(p.i)) continue;                       // sin cue: se ve el avatar

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
      // jamás el asset del vecino). Si tampoco hay foto, queda el avatar.
      if (slot - cov > 0.5 && p.hasImg) {
        cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start + cov, b: slotEnd, seed: seed++, i: p.i });
      }
    }
  } else if (p.hasImg) {
    cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.jpg`, a: start, b: slotEnd, seed: seed++, i: p.i });
  }
}

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

export const CUES_TSWMINIOIL: { key: string; start: number; dur: number; el: (f: number) => React.ReactNode }[] = [
${body}
];
`);

// ── Main_<slug>.tsx ──────────────────────────────────────────────────────────────
// ⛔⛔ OffthreadVideo, NUNCA <Video>: al rendear, <Video> busca POR TIEMPO y devuelve
// cuadros equivocados de forma irregular = el "se ve lageado" de siempre.
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSWMINIOIL } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_TSWMINIOIL = ${TOTAL};

const AV_FRAMES_TSWMINIOIL = ${AV_FRAMES};
const LOOPS_TSWMINIOIL = ${Math.ceil(TOTAL / AV_FRAMES)};

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del máster).
 *  Se LOOPEA acá en vez de empaquetar un mp4 de 30 min: el tar lo baja cada uno de los 60 chunks.
 *  El push Ken-Burns usa el frame GLOBAL, así no se reinicia en cada vuelta del bucle. */
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
      {Array.from({ length: LOOPS_TSWMINIOIL }, (_, k) => (
        <Sequence key={k} from={k * AV_FRAMES_TSWMINIOIL} durationInFrames={AV_FRAMES_TSWMINIOIL} layout="none">
          <AbsoluteFill><OffthreadVideo src={staticFile("${AVATAR}")} muted style={est} /></AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MainTswminioil: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TSWMINIOIL.map((c) => (
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
import { MainTswminioil, TOTAL_FRAMES_TSWMINIOIL } from "./${SLUG}/Main_${SLUG}";
const Root: React.FC = () => (
  <Composition id="Tswminioil" component={MainTswminioil} durationInFrames={TOTAL_FRAMES_TSWMINIOIL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ── lista de assets para el tar del farm (toda imagen viaja con su _blur) ────────
const assets = new Set([AVATAR, AUDIO]);
for (const c of out) {
  assets.add(c.src);
  if (c.kind === "foto") assets.add(c.src.replace(/\.jpg$/, "_blur.jpg"));
}
const faltan = [...assets].filter((a) => !exists(`public/${a}`));
console.log(`[assets] ${assets.size} referenciados · faltan en disco ${faltan.length}`);
if (faltan.length) { console.error("X faltan assets:", faltan.slice(0, 8)); process.exit(1); }
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

// ── medidas ─────────────────────────────────────────────────────────────────────
const cubierto = out.reduce((s, c) => s + c.dur, 0);
const durs = out.map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor((durs.length - 1) * p)];
const sinAsset = plan.filter((p) => !AVATAR_SOLO.has(p.i) && !p.hasClip && !p.hasImg);
console.log(`cues ${out.length} · TOTAL ${TOTAL}f (${(TOTAL / FPS).toFixed(1)}s) · wav ${WAV_DUR.toFixed(1)}s`);
console.log(`cobertura ${(100 * cubierto / TOTAL).toFixed(1)}% · avatar a cara pelada ${(100 * (1 - cubierto / TOTAL)).toFixed(1)}%`);
console.log(`plano: mediana ${q(.5).toFixed(2)}s · p75 ${q(.75).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5 - EPS).length / durs.length).toFixed(0)}%`);
console.log(`clips descartados por reinventar la escena: ${CLIP_REINVENTADO.size}`);
console.log(`clips ${out.filter((c) => c.kind === "clip").length} · fotos ${out.filter((c) => c.kind === "foto").length} · momentos sin asset ${sinAsset.length}`);
