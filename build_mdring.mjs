// build_mdring.mjs — "Dump HYDROGEN PEROXIDE into your Toilet and WATCH WHAT HAPPENS" (Mike Dalton, EN).
//
//   node build_mdring.mjs
//
// Lee `_v3/mdring_plan.json` (el DIRECTOR) y escribe:
//   src/VideoEdit/cues_mdring.gen.tsx · src/VideoEdit/avatar_mdring.gen.ts
//   src/VideoEdit/Main_mdring.tsx     · src/index_mdring.tsx
//
// Diferencias con build_mdmold: acá hay LÁMINAS (páginas de la guía), CTA con QR, y todo
// componente del kit premium va sobre una CAMA DE FOTO (regla 2.quater) con el tema del canal.
import fs from "fs";

const SLUG = "mdring", COMP = "MdRing";
let { beats, totalMs, overlays: ovPlan = [] } = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

// ⛔ GUARD del canal: un ChapterTrailCard de menos de 0,9 s rompe su propia coreografía
// (`interpolate` con rango no monótono) y MATA el chunk en el farm.
for (const b of beats) {
  if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) {
    b.tipo = "clip"; b.clip = b.clip || "mdring_h01_doorwaylook"; b.startFrom = 0; delete b.componente; delete b.props;
  }
}

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

// ── de dónde sale cada componente ────────────────────────────────────────────────────────────
const FROM_PEROXIDE = new Set(["ChapterTrailCard", "LightTrailCards", "BottleHero"]);
const FROM_MDTANK = new Set(["MdGuidePage", "MdQrCta"]);
const OWN_BG = new Set(["MdGuidePage", "MdQrCta"]);           // ya traen su propio fondo/cama
const NEEDS_THEME = (c) => !FROM_PEROXIDE.has(c) && !FROM_MDTANK.has(c);

// la cama de cada componente = la foto hero del clip más cercano en el timeline
const clipBeats = beats.filter((b) => b.tipo === "clip");
const bedFor = (ms) => {
  let best = null, d = Infinity;
  for (const c of clipBeats) { const dd = Math.abs(c.ms_in - ms); if (dd < d) { d = dd; best = c.clip; } }
  return best ? `img/${best}.jpg` : null;
};

// ── SFX: biblioteca por rol del canal ────────────────────────────────────────────────────────
let SFXLIB = {};
try {
  const lib = JSON.parse(fs.readFileSync("public/sfx/lib/px_sfx_library.json", "utf8"));
  for (const it of lib.items) (SFXLIB[it.role] ||= []).push(`sfx/lib/${it.file}`);
} catch (e) { console.warn("⚠️ sin biblioteca SFX:", e.message); }
const sfxCtr = {}; const usedSfx = new Set();
const pickSfx = (role, fallback) => {
  const arr = (SFXLIB[role] && SFXLIB[role].length) ? SFXLIB[role] : (fallback && SFXLIB[fallback]) || [];
  if (!arr.length) return null;
  const i = (sfxCtr[role] = (sfxCtr[role] || 0)) % arr.length; sfxCtr[role]++;
  usedSfx.add(arr[i]); return arr[i];
};
const sfxCues = [];
const addSfx = (startSec, role, fallback, vol = 0.4, at = 0) => {
  const src = pickSfx(role, fallback); if (!src) return;
  sfxCues.push({ start: +(startSec + at).toFixed(3), src, vol });
};

const cues = [], overlays = [], windows = [];
let lastMode = null;
const missing = [], clipsUsed = new Set(), imgsUsed = new Set();
let cutCtr = 0;

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms_in), dur = sec(b.ms_out - b.ms_in);
  const key = `${b.tipo}_${b.ms_in}`;
  // el avatar es el FONDO GARANTIZADO: full cuando nada lo tapa, hidden cuando algo lo cubre
  const mode = b.tipo === "avatar" ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }

  if (b.tipo === "avatar") continue;

  if (b.tipo === "clip") {
    const src = `broll/${b.clip}.mp4`;
    clipsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    const flash = b.flash ? " flash" : "";
    cues.push({ key, start, dur, el: `(d) => <MdClip durationInFrames={d} src="${src}" startFrom={${b.startFrom || 0}}${flash} />` });
    // el swish no va en CADA corte (sería un tic): cada 4 planos, y nunca en los muy cortos
    if (dur > 1.0 && cutCtr++ % 4 === 0) addSfx(start, "swish", "whoosh_soft", 0.26);
  } else if (b.tipo === "componente") {
    const c = b.componente;
    const themed = NEEDS_THEME(c) ? " theme={THEME_PEROXIDE}" : "";
    const inner = `<${c} durationInFrames={d}${themed} {...(${jprops(b.props)} as any)} />`;
    if (OWN_BG.has(c)) {
      cues.push({ key, start, dur, el: `(d) => ${inner}` });
    } else {
      const bed = bedFor(b.ms_in);
      if (bed) { imgsUsed.add(bed); if (!fs.existsSync(`public/${bed}`)) missing.push(bed); }
      cues.push({ key, start, dur, el: `(d) => <MdBed durationInFrames={d}${bed ? ` img="${bed}"` : ""}>${inner}</MdBed>` });
    }
    // las imágenes que consume el propio componente (láminas, QR) también viajan al farm
    for (const v of Object.values(b.props || {})) {
      if (typeof v === "string" && /^img\/.+\.(jpg|png)$/.test(v)) {
        imgsUsed.add(v); if (!fs.existsSync(`public/${v}`)) missing.push(v);
      }
    }
    addSfx(start, "card_slide", "whoosh_soft", 0.34);
    addSfx(start, "ding_soft", "sparkle", 0.36, 0.5);
  } else if (b.tipo === "movimiento") {
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} />` });
    addSfx(start, "transition", "whoosh_soft", 0.3);
  }
}

// ── OVERLAYS (capa de ideas encima del b-roll) ───────────────────────────────────────────────
// ⛔ NO tocan `windows`: un overlay que oculta el avatar deja NEGRO cuando debajo tampoco hay b-roll.
const ovComps = new Set();
for (const o of ovPlan) {
  const start = sec(o.ms_in), dur = sec(o.ms_out - o.ms_in);
  ovComps.add(o.componente);
  overlays.push({
    key: `ov_${o.ms_in}`, start, dur,
    el: `(d) => <PremiumOverlay durationInFrames={d} zone="${o.zone}" theme={THEME_PEROXIDE}><${o.componente} durationInFrames={d} theme={THEME_PEROXIDE} {...(${jprops(o.props)} as any)} /></PremiumOverlay>`,
  });
  addSfx(start, "card_slide", "whoosh_soft", 0.3);
}

const TOTAL = sec(totalMs);
const TOTAL_FRAMES = Math.ceil(TOTAL * 30);
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

const movs = [...new Set(beats.filter((b) => b.tipo === "movimiento").map((b) => b.componente))];
const comps = [...new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente))];
const pxComps = comps.filter((c) => FROM_PEROXIDE.has(c));
const mdComps = comps.filter((c) => FROM_MDTANK.has(c));
const premComps = comps.filter((c) => NEEDS_THEME(c));
const needBed = comps.some((c) => !OWN_BG.has(c));

const imports = [
  `import { ReactNode } from "react";`,
  `import { MdClip } from "../mdtank/MdClip";`,
  ...(needBed ? [`import { MdBed } from "../mdtank/MdBed";`] : []),
  ...mdComps.map((m) => `import { ${m} } from "../mdtank/${m}";`),
  ...movs.map((m) => `import { ${m} } from "../mdring/${m}";`),
  ...(pxComps.length ? [`import { ${pxComps.sort().join(", ")} } from "../peroxide/PeroxideHero";`] : []),
  ...(premComps.length || ovComps.size
    ? [`import { ${[...new Set([...premComps, ...ovComps])].sort().join(", ")}${premComps.length || ovComps.size ? ", " : ""}THEME_PEROXIDE } from "./kit/premium";`]
    : []),
  ...(ovComps.size ? [`import { PremiumOverlay } from "./scenes/PremiumOverlay";`] : []),
];

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
${imports.join("\n")}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];

export const SFXCUES: { start: number; src: string; vol: number }[] = ${JSON.stringify(sfxCues)};
`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};
export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS, SFXCUES } from "./cues_${SLUG}.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * 30);

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* el avatar es el FONDO GARANTIZADO: dura el video entero y nunca deja hueco */}
    <AvatarLayer src="${SLUG}_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))}>
        {o.el(Math.max(1, F(o.dur)))}
      </Sequence>
    ))}

    {SFXCUES.map((s, i) => (
      <Sequence key={"sfx" + i} from={F(s.start)}>
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${SLUG.toUpperCase()} };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <>
    <Composition
      id="${COMP}"
      component={Main${COMP}}
      durationInFrames={TOTAL_FRAMES_${SLUG.toUpperCase()}}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root${COMP});
`);

// lista de assets para el farm (+ los hermanos _blur.jpg que arman componentes en runtime)
// el AVATAR es el fondo garantizado: su mp4 y su wav TIENEN que viajar en el tarball
const avatarAssets = [`${SLUG}_opt.mp4`, `${SLUG}.wav`];
for (const a of avatarAssets) if (!fs.existsSync(`public/${a}`)) missing.push(a);
const assets = [...clipsUsed, ...imgsUsed, ...avatarAssets, ...[...usedSfx]].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, assets.join("\n") + "\n");

console.log(`cues ${cues.length} · sfx ${sfxCues.length} · ventanas avatar ${windows.length}`);
console.log(`clips distintos ${clipsUsed.size} · imágenes ${imgsUsed.size} · movimientos ${movs.length} (${movs.join(", ")})`);
console.log(`componentes (${comps.length}): ${comps.join(", ")}`);
console.log(`TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames`);
if (missing.length) {
  console.log(`\n⛔ FALTAN ${missing.length} assets:`);
  [...new Set(missing)].slice(0, 12).forEach((m) => console.log("   " + m));
  process.exit(1);
}
console.log(`assets → _${SLUG}_assets.txt (${assets.length}) — se pasa al farm como @_${SLUG}_assets.txt`);
