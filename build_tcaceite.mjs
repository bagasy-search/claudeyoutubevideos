// build_tcaceite.mjs — MONTAJE VLOG CRUDO del canal "Taller de Claudio".
// Un plano por FRASE, material a sangre, cero componentes (la vara del canal:
// feedback_edicion_vlog_casero_claudio). El avatar es el PISO garantizado.
//
//   node build_tcaceite.mjs
//
// Emite: src/tcaceite/cues_tcaceite.gen.tsx + src/tcaceite/Main_tcaceite.tsx + _tcaceite_assets.txt
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "tcaceite";
const FPS = 30;
const WAV = `public/${SLUG}.wav`;
const AVATAR = `${SLUG}_opt.mp4`;
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;

const ffdur = (p) => Number(execFileSync("ffprobe",
  ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" }).trim());

const WAV_DUR = ffdur(WAV);
const TOTAL = Math.ceil(WAV_DUR * FPS) + 1;            // nunca cortar la ultima palabra
const plan = JSON.parse(fs.readFileSync("_v3/tcaceite_plan.json", "utf8").replace(/^﻿/, ""));

// ── duraciones REALES de cada clip (nunca asumirlas) ──────────────────────────────
const clipDur = {};
for (const p of plan) {
  if (p.tipo !== "clip") continue;
  const f = `public/${CLIPDIR}/${p.name}.mp4`;
  if (!fs.existsSync(f)) { console.error(`FALTA clip ${f}`); process.exit(1); }
  clipDur[p.name] = ffdur(f);
}

// ── que momentos van con el AVATAR a cara pelada ──────────────────────────────────
// El beat 1 abre con el avatar hablando (feedback_edicion_apertura_avatar_y_no_repetir) y los
// planos HERO tambien: sobre el avatar real, una foto fija de la misma persona es peor.
const AVATAR_SOLO = new Set([0, ...plan.filter((p) => p.hero).map((p) => p.i)]);
// ⛔ Dos momentos de avatar SEGUIDOS dan un tramo de 15-17 s sin material: se lee como que se
// quedo sin b-roll. Cuando se juntan, el SEGUNDO muestra su foto hero (que ya existe).
for (const p of plan) {
  if (AVATAR_SOLO.has(p.i) && AVATAR_SOLO.has(p.i - 1)) AVATAR_SOLO.delete(p.i);
}

// ── armado de cues, alineado al FRAME ─────────────────────────────────────────────
// ⛔ `from` y `durationInFrames` se redondean POR SEPARADO en el Main -> 1 frame de fondo entre
// planos (46 destellos medidos en cmeduelo). Se emiten ya alineados, derivando la duracion del
// FRAME FINAL, y si el proximo cue arranca a +-1 frame se pega la frontera exacta.
const F = (s) => Math.round(s * FPS);
const cues = [];
let seed = 7;

for (let k = 0; k < plan.length; k++) {
  const p = plan[k];
  const start = p.ms / 1000;
  const slotEnd = k + 1 < plan.length ? plan[k + 1].ms / 1000 : WAV_DUR;
  const slot = slotEnd - start;
  if (AVATAR_SOLO.has(p.i)) continue;                   // sin cue: se ve el avatar

  if (p.tipo === "clip") {
    const cd = Math.min(clipDur[p.name] - 0.01, slot);
    cues.push({ kind: "clip", src: `${CLIPDIR}/${p.name}.mp4`, a: start, b: start + cd, i: p.i });
    // Si sobra MUCHO, lo cubre la MISMA foto que genero el clip (mismo sujeto, otra lectura).
    // Si sobra poco, vuelve el AVATAR: la vara del canal pide planos largos (mediana ~7s) y
    // avatar de piso ~22% — una cola de foto de 2s fabrica un plano corto y rompe las dos cosas.
    // ⛔ jamas el asset del momento vecino (eso es el defecto "encaja con el tema, no con la frase").
    const resto = slot - cd;
    if (resto > 3.5) cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.png`, a: start + cd, b: slotEnd, seed: seed++, i: p.i });
  } else {
    cues.push({ kind: "foto", src: `${IMGDIR}/${p.name}.png`, a: start, b: slotEnd, seed: seed++, i: p.i });
  }
}

// alineacion a frames + pegado de fronteras
const out = cues.map((c) => ({ ...c, f0: F(c.a), f1: F(c.b) }));
for (let i = 0; i < out.length - 1; i++) {
  if (Math.abs(out[i + 1].f0 - out[i].f1) <= 1) out[i].f1 = out[i + 1].f0;
}
for (const c of out) c.dur = Math.max(1, c.f1 - c.f0);

// ── cues_<slug>.gen.tsx ───────────────────────────────────────────────────────────
const body = out.map((c, n) => {
  const el = c.kind === "clip"
    ? `<Clip src=${JSON.stringify(c.src)} />`
    : `<Foto src=${JSON.stringify(c.src)} seed={${c.seed}} />`;
  return `  { key: "c${n}", capa: "base", start: ${c.f0}, dur: ${c.dur}, el: () => (${el}) },`;
}).join("\n");

fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto } from "./Piezas";

export const CUES_TCACEITE: { key: string; capa: string; start: number; dur: number; el: (f: number) => React.ReactNode }[] = [
${body}
];
`);

// ── Main_<slug>.tsx ───────────────────────────────────────────────────────────────
// ⛔⛔ El avatar va con OffthreadVideo. Con <Video> el navegador sirve cuadros EQUIVOCADOS en el
// render (se lee como tiron) y es la causa #1 del "se ve lageado". El bucle ya viene horneado en
// el opt.mp4, asi que alcanza con una sola secuencia.
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TCACEITE } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_TCACEITE = ${TOTAL};

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del master).
 *  Push lento y ciclico: un avatar full quieto se lee como videollamada. */
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

export const MainTcaceite: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TCACEITE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.wav")} />
    </AbsoluteFill>
  );
};
`);

// ── lista de assets para el tar del farm (con los _blur hermanos) ─────────────────
const assets = new Set([AVATAR, `${SLUG}.wav`]);
for (const c of out) {
  assets.add(c.src);
  // ⛔ NADA de hermanos _blur.jpg: este kit (Piezas.tsx) dibuja la foto con <Img> directo y no los
  // lee nunca. Pedirlos mete 49 rutas inexistentes en el tar. (El pre-vuelo BLUR del farm tampoco
  // los exige acá: escanea public/img al ras y estas imagenes viven en public/img/<slug>/.)
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

// ── medidas ───────────────────────────────────────────────────────────────────────
const cubierto = out.reduce((s, c) => s + c.dur, 0);
const durs = out.map((c) => c.dur / FPS).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p75 = durs[Math.floor(durs.length * 0.75)];
console.log(`cues ${out.length} · TOTAL ${TOTAL}f (${(TOTAL / FPS).toFixed(1)}s) · wav ${WAV_DUR.toFixed(1)}s`);
console.log(`cobertura ${(100 * cubierto / TOTAL).toFixed(1)}% · avatar a cara pelada ${(100 * (1 - cubierto / TOTAL)).toFixed(1)}%`);
console.log(`plano: mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`assets ${assets.size} → _${SLUG}_assets.txt`);
