// build_feettingle.mjs — VLOG casero (Dr. Federer — The Nightly Remedy, EN).
// avatar parcial (0..AVATAR_END) + BUCLE muteado de fondo · un plano de Federer/insert o la lámina por momento.
// Lee _v3/feettingle_beats_map.json ({ms,kind:avatar|foto|lamina,name,text,focus?}).
// Emite src/feettingle/cues_feettingle.gen.tsx + Main_feettingle.tsx + src/index_feettingle.tsx + _feettingle_assets.txt
import fs from "node:fs";
import path from "node:path";

const SLUG = "feettingle", COMP = "Feettingle", UP = "FEETTINGLE";
const FPS = 30;
const WAV_S = 1030.679206;
const TOTAL_FRAMES = Math.ceil(WAV_S * FPS) + 1;
const AVATAR_END_MS = 436117;
const AVATAR_FRAMES = Math.round(AVATAR_END_MS / 1000 * FPS);
const LOOP_GAP_MS = 350;
const LOOP_START = Math.round((AVATAR_END_MS + LOOP_GAP_MS) / 1000 * FPS);

const f = (ms) => Math.round(ms / 1000 * FPS);
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const existe = (r) => fs.existsSync(path.join("public", r));

const FOTO_MAX = Math.round(9 * FPS);   // en el bucle una foto sostiene el slot
const INS_P1 = Math.round(5 * FPS);     // en la parte 1 (lipsync real) los inserts son cortos → vuelve el avatar
const LAM_MAX = Math.round(6.5 * FPS);  // cada beat de lámina se re-cuea (mantiene el push/zoom vivo)

const LAMINA = "img/ft_lamina_nightmap.jpg";
const QR = "ft_qr_docfederer.png";
const DOMAIN = "docfederer.com";

const BM = rd("_v3/feettingle_beats_map.json").sort((a, b) => a.ms - b.ms);

const assetOf = (b) => {
  if (b.kind === "avatar") return null;
  if (b.kind === "lamina") return { rel: LAMINA, tipo: "lamina", focus: b.focus || "full" };
  if (b.kind === "foto")   return { rel: `img/${b.name}.jpg`, tipo: "foto" };
  return null;
};

const assets = new Set();
const cues = [];
const faltan = [];
let prevName = null;
for (let i = 0; i < BM.length; i++) {
  const b = BM[i];
  const start = f(b.ms);
  const nextMs = i + 1 < BM.length ? BM[i + 1].ms : Math.round(TOTAL_FRAMES / FPS * 1000);
  const slot = Math.max(1, f(nextMs) - start);
  const a = assetOf(b);
  if (!a) { prevName = null; continue; }
  // clips-first: el beat vale si existe el JPG O el clip broll/<name>.mp4
  const clipRel0 = a.tipo === "foto" ? `broll/${b.name}.mp4` : null;
  const hayClip0 = clipRel0 && existe(clipRel0);
  if (!existe(a.rel) && !hayClip0) { faltan.push(a.rel); prevName = null; continue; }
  const dedupeKey = a.tipo === "lamina" ? `lam_${a.focus}` : b.name;
  if (dedupeKey === prevName && a.tipo !== "lamina") continue;   // no dos fotos/clips iguales seguidos
  prevName = dedupeKey;
  let dur;
  if (a.tipo === "lamina") dur = Math.min(slot, LAM_MAX);
  else dur = Math.min(slot, start < LOOP_START ? INS_P1 : FOTO_MAX);
  // —— clips-first: si hay broll/<name>.mp4, va el Clip (loop) en vez de la Foto quieta ——
  const clipRel = a.tipo === "foto" ? `broll/${b.name}.mp4` : null;
  const useClip = clipRel && existe(clipRel);
  const rel = useClip ? clipRel : a.rel;
  assets.add(rel);
  const el = a.tipo === "lamina"
    ? `<LaminaZoom src=${JSON.stringify(a.rel)} focus=${JSON.stringify(a.focus)} />`
    : useClip
    ? `<Clip src=${JSON.stringify(clipRel)} />`
    : `<Foto src=${JSON.stringify(a.rel)} />`;
  cues.push({ key: JSON.stringify(`b${i}_${b.name || a.focus}`), start, dur, capa: "base", el });
}

// —— CTA over-layer (inglés) ——
const has = (t, ...ws) => ws.some((w) => (t || "").toLowerCase().includes(w));
let ctaLT = 0, ctaReveal = 0, revealDone = false;
for (let i = 0; i < BM.length; i++) {
  const b = BM[i];
  const start = f(b.ms);
  const nextMs = i + 1 < BM.length ? BM[i + 1].ms : Math.round(TOTAL_FRAMES / FPS * 1000);
  const dur = Math.max(1, f(nextMs) - start);
  const t = b.text || "";
  // lower-third recordando la descripción (varias veces, discreto)
  if (has(t, "in the description", "down in the description", "left it for you")) {
    cues.push({ key: JSON.stringify(`lt${i}`), start, dur: Math.max(dur, Math.round(3 * FPS)), capa: "over",
      el: `<LowerThird text={"Full guide + exact amounts in the description \u{1F447}"} />` });
    ctaLT++;
    // el PRIMER "in the description" del cuerpo (la revelación) = lámina full + QR ~8s
    if (!revealDone && start >= LOOP_START) {
      if (existe(LAMINA)) { cues.push({ key: JSON.stringify(`revlam${i}`), start, dur: Math.round(7 * FPS), capa: "over",
        el: `<LaminaZoom src=${JSON.stringify(LAMINA)} focus={"full"} />` }); assets.add(LAMINA); }
      if (existe(QR)) { cues.push({ key: JSON.stringify(`revqr${i}`), start, dur: Math.round(8 * FPS), capa: "over",
        el: `<QrCard qr=${JSON.stringify(QR)} domain={${JSON.stringify(DOMAIN)}} />` }); assets.add(QR); }
      revealDone = true; ctaReveal++;
    }
  }
}
// CTA final: lámina + QR en los últimos ~11s
if (existe(LAMINA)) { const s0 = TOTAL_FRAMES - Math.round(11 * FPS);
  cues.push({ key: `"cta_lam_fin"`, start: s0, dur: Math.round(6 * FPS), capa: "over", el: `<LaminaZoom src=${JSON.stringify(LAMINA)} focus={"full"} />` }); assets.add(LAMINA); }
if (existe(QR)) { const s0 = TOTAL_FRAMES - Math.round(10 * FPS);
  cues.push({ key: `"cta_qr_fin"`, start: s0, dur: Math.round(10 * FPS), capa: "over", el: `<QrCard qr=${JSON.stringify(QR)} domain={${JSON.stringify(DOMAIN)}} />` }); assets.add(QR); }

if (faltan.length) console.log(`⚠️ ${faltan.length} assets NO existen: ${[...new Set(faltan)].slice(0,8).join(", ")}`);

// —— cobertura + pacing ——
const base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start);
{
  const oc = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) oc[x] = 1;
  let cub = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cub += oc[x];
  const d = [];
  for (let i = 0; i < base.length - 1; i++) d.push((base[i + 1].start - base[i].start) / FPS);
  d.sort((a, b) => a - b);
  const med = d[Math.floor(d.length / 2)] || 0, p75 = d[Math.floor(d.length * 0.75)] || 0;
  const largos = 100 * d.filter((x) => x >= 5).length / (d.length || 1);
  console.log(`cobertura b-roll: ${(100 * cub / TOTAL_FRAMES).toFixed(1)}% · pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · >=5s ${largos.toFixed(1)}%`);
}

fs.mkdirSync(`src/${SLUG}`, { recursive: true });
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, LaminaZoom, LowerThird, QrCard } from "./Piezas";

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: () => React.ReactNode };

export const CUES_${UP}: Cue[] = [
${cues.sort((a, b) => a.start - b.start).map((c) =>
  `  { key: ${c.key}, start: ${c.start}, dur: ${c.dur}, capa: ${JSON.stringify(c.capa)}, el: () => ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_${UP} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const AVATAR_FRAMES = ${AVATAR_FRAMES};
const LOOP_START = ${LOOP_START};

const AvatarPiso: React.FC = () => {
  const fr = useCurrentFrame();
  const s = 1.035 + Math.sin(fr / 900) * 0.02;
  const dx = Math.sin(fr / 1300) * 0.5;
  const est: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\` };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_${UP} - LOOP_START}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Main${COMP}: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_${UP}.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el()}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_${UP}.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el()}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.wav")} />
    </AbsoluteFill>
  );
};
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./${SLUG}/Main_${SLUG}";
const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// —— assets para el tar (+ _blur de cada foto) ——
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  const esFoto = /\.jpg$/i.test(a);
  if (esFoto) {
    const b = a.replace(/\.jpg$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) console.log(`⚠️ ${sinBlur.length} fotos sin _blur.jpg — corré node preblur.mjs`);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base ${base.length} · over ${cues.length - base.length}) · CTA: ${ctaLT} lower-thirds, ${ctaReveal} reveal, 1 final`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) · duración ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
if (faltan.length) console.log(`⛔ FALTAN ${faltan.length} assets.`);
