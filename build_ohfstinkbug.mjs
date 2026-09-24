// build_ohfstinkbug.mjs — "Stink Bugs in Your House Every Fall" (The Old House Fix, EN).
//
//   node build_ohfstinkbug.mjs
//
// VLOG HIPERREALISTA, como el resto del canal: el b-roll son planos de ÉL haciendo cada acción
// —clips i2v y fotos a sangre— sin cine, sin componentes gráficos, sin subtítulos, sin SFX.
// El avatar es el PISO: real en los primeros 657 s (su propio lipsync) y en bucle mudo después,
// donde la voz la pone la cola de Fish clonada de él mismo.
//
// ⛔ EL AVATAR VA CON BASE "full" Y NO SE OCULTA NUNCA. Es la regla anti-hueco: si la base es
//    "hidden" y el contenido no llena su slot, se ve el fondo muerto. Acá el avatar está siempre
//    debajo y el b-roll se apoya encima, así que un hueco es imposible por construcción — los
//    momentos "de avatar" simplemente no llevan cue.
//
// ⛔ TODO lo que dibuja video usa OffthreadVideo (copias locales en src/ohfstinkbug/). Con <Video>
//    el navegador busca por TIEMPO y devuelve cuadros equivocados de forma irregular: es la causa
//    real del "se ve lageado" en todo el metraje, y no la detecta ninguna medición sobre el mp4.
//
// ⛔ Las fronteras se emiten YA ALINEADAS A FRAME. Redondear `start` y `dur` por separado deja
//    huecos de 1 cuadro entre cues (33 ms de fondo a la vista) que `blackdetect` no ve y el ojo sí.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "ohfstinkbug", COMP = "OhfStinkbug", FPS = 30;

// ⛔ Un cue puede durar más que su clip (los i2v miden ~5,1 s y hay cues de hasta 9 s). Si no se
//    hace nada, el clip termina y quedan cuadros congelados. La regla del creador es NO repetir el
//    clip: se RALENTIZA hasta cubrir el slot. `speed` = duracionClip / duracionCue, con piso 0.5.
const durCache = new Map();
const durClip = (rel) => {
  if (!durCache.has(rel)) {
    const d = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
      "-of", "csv=p=0", `public/${rel}`], { encoding: "utf8" }).trim();
    durCache.set(rel, d);
  }
  return durCache.get(rel);
};
const { beats, totalMs } = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));

const sec = (ms) => +(ms / 1000).toFixed(3);
const cues = [], missing = [], clipsUsed = new Set(), fotosUsed = new Set();

for (const b of beats) {
  if (b.tipo === "avatar") continue;
  const key = `${b.tipo}_${b.ms_in}`;
  if (b.tipo === "clip") {
    const src = `broll/${SLUG}/${b.clip}.mp4`;
    clipsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    const cueDur = (b.ms_out - b.ms_in) / 1000;
    const speed = fs.existsSync(`public/${src}`)
      ? Math.max(0.5, Math.min(1, +(durClip(src) / cueDur).toFixed(3))) : 1;
    cues.push({ key, start: sec(b.ms_in), dur: sec(b.ms_out - b.ms_in),
      el: `(d) => <MdClipOhf durationInFrames={d} src="${src}" speed={${speed}} />` });
  } else {
    const src = `img/${SLUG}/${b.foto}.jpg`;
    fotosUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    // pan alternado: dos fotos seguidas no pueden tener el mismo movimiento de cámara
    const pan = [0, 26, -22, 14][cues.length % 4];
    cues.push({ key, start: sec(b.ms_in), dur: sec(b.ms_out - b.ms_in),
      el: `(d) => <MdFotoOhf durationInFrames={d} src="${src}" pan={${pan}} />` });
  }
}

// ── alineación a frame: la duración se deriva del FRAME FINAL, no del largo
const F = (s) => Math.round(s * FPS);
cues.sort((a, b) => a.start - b.start);
for (let i = 0; i < cues.length; i++) {
  const c = cues[i], sig = cues[i + 1];
  const f0 = F(c.start);
  let f1 = F(c.start + c.dur);
  if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);   // pegar la frontera exacta
  c.start = f0 / FPS;
  c.dur = Math.max(1, f1 - f0) / FPS;
}
let solapes = 0, huecos1f = 0;
for (let i = 0; i + 1 < cues.length; i++) {
  const fin = F(cues[i].start + cues[i].dur), sig = F(cues[i + 1].start);
  if (sig < fin) solapes++;
  else if (sig - fin === 1) huecos1f++;
}

const TOTAL = sec(totalMs);
const TOTAL_FRAMES = Math.ceil(TOTAL * FPS);
const U = SLUG.toUpperCase();
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { ReactNode } from "react";
import { MdClipOhf } from "../${SLUG}/MdClip";
import { MdFotoOhf } from "../${SLUG}/MdFoto";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_${U} = ${TOTAL};
export const TOTAL_FRAMES_${U} = ${TOTAL_FRAMES};
// base FULL y una sola ventana: el avatar es el piso garantizado, el b-roll se apoya encima.
export const AVATAR_WINDOWS: AvatarWindow[] = [{ start: 0, mode: "full" }];
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { AvatarLayerOhf } from "../${SLUG}/AvatarLayerOhf";
import { CUES } from "./cues_${SLUG}.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_${U} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * 30);
const QR_IN = 1835.5, QR_DUR = 10;

// El audio máster lo muxea el FARM en el stitch, por eso acá no hay <Audio>. \`wav\` apunta al de
// 8 kHz: el borde audio-reactivo sólo necesita 16 bandas, y el máster no se baja entero en cada chunk.
export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerOhf src="${SLUG}_opt.mp4" wav="${SLUG}_vis.wav" windows={AVATAR_WINDOWS} accent="#E0A32E" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {/* QR del CTA: el guion promete "a code on the screen". Tamano EXACTO del PNG (480x480),
        sin objectFit, para que no se estire y siga decodificando. */}
    <Sequence from={F(QR_IN)} durationInFrames={F(QR_DUR)}>
      <AbsoluteFill>
        <Img src={staticFile("${SLUG}_qr.png")}
             style={{ position: "absolute", right: 96, bottom: 96, width: 480, height: 480,
                      borderRadius: 12, boxShadow: "0 18px 60px rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${U} };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_${U} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition
    id="${COMP}"
    component={Main${COMP}}
    durationInFrames={TOTAL_FRAMES_${U}}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root${COMP});
`);

// ── assets del farm ─────────────────────────────────────────────────────────────────────────────
// ⛔ Toda foto necesita su hermano `_blur.jpg`: el kit lo pide en runtime y el pre-vuelo aborta.
const blurs = new Set(), faltanBlur = [];
for (const im of fotosUsed) {
  const blur = im.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
  if (fs.existsSync(`public/${blur}`)) blurs.add(blur); else faltanBlur.push(blur);
}
// ⛔ El wav del borde audio-reactivo que pide `AvatarLayerOhf wav=` NO lo agrega el farm solo.
const VIS = `${SLUG}_vis.wav`;

console.log(`beats ${beats.length} · cues ${cues.length} (clips ${clipsUsed.size} · fotos ${fotosUsed.size}) · avatar a la vista ${beats.filter((b) => b.tipo === "avatar").length}`);
console.log(`fronteras: solapes ${solapes} · huecos de 1 cuadro ${huecos1f}`);
console.log(`TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames`);
console.log(`blurs: ${blurs.size} en disco · faltan ${faltanBlur.length}`);
if (faltanBlur.length) { faltanBlur.slice(0, 8).forEach((m) => console.log("   falta " + m)); process.exit(1); }
if (!fs.existsSync(`public/${VIS}`)) { console.log(`⛔ falta public/${VIS} (lo pide AvatarLayerOhf)`); process.exit(1); }
if (missing.length) {
  console.log(`⛔ FALTAN ${missing.length} assets en disco (de ${cues.length} cues):`);
  missing.slice(0, 12).forEach((m) => console.log("   " + m));
  process.exit(1);
}
if (solapes) { console.log("⛔ hay cues solapados"); process.exit(1); }
const assets = [`${SLUG}_opt.mp4`, `${SLUG}_qr.png`, ...clipsUsed, ...fotosUsed, ...blurs, VIS].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, assets.join("\n") + "\n");
console.log(`assets → _${SLUG}_assets.txt (${assets.length})`);
