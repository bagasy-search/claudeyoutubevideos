// build_mddrain.mjs — "It cleans the drain better than a plumber's machine" (canal Mike Dalton, EN).
//
//   node build_mddrain.mjs
//
// Lee `_v3/mddrain_plan.json` (el DIRECTOR) y escribe:
//   src/VideoEdit/cues_mddrain.gen.tsx · src/VideoEdit/avatar_mddrain.gen.ts
//   src/VideoEdit/Main_mddrain.tsx     · src/index_mddrain.tsx
//
// Clon de build_mdtoilet con dos diferencias:
//   · MdGuidePage y MdQrCta son overlays FULL-SCREEN propios (no van dentro de PremiumOverlay,
//     que los encajaría en un tercio) y traen su propia cama de foto.
//   · La lista de assets del farm incluye las IMÁGENES citadas por los overlays + sus `_blur.jpg`.
import fs from "fs";

const SLUG = "mddrain", COMP = "MdDrain";
let { beats, totalMs, overlays: ovPlan = [] } = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

// ⛔ GUARD del canal: un ChapterTrailCard de menos de 0,9 s rompe su propia choreografía
// (`interpolate` con rango no monótono) y MATA el chunk en el farm. Si quedó corto, pasa a clip.
for (const b of beats) {
  if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) {
    b.tipo = "clip"; b.clip = b.clip || "mddrain_h01_smellnight"; b.startFrom = 0; delete b.componente; delete b.props;
  }
}
// ⛔ `number` de ChapterTrailCard SIEMPRE string (adentro hace number.match → un number crudo mata el chunk).
for (const b of beats) if (b.props && b.props.number != null) b.props.number = String(b.props.number);

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

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

// toda ruta de imagen citada por un componente entra al tarball (+ su hermano _blur.jpg)
const noteImgs = (props) => {
  for (const v of Object.values(props || {})) {
    if (typeof v === "string" && /^img\/.+\.(png|jpg|jpeg)$/i.test(v)) {
      imgsUsed.add(v);
      const blur = v.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
      if (fs.existsSync(`public/${blur}`)) imgsUsed.add(blur);
      if (!fs.existsSync(`public/${v}`)) missing.push(v);
    }
  }
};

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
    if (dur > 1.0 && cutCtr++ % 4 === 0) addSfx(start, "swish", "whoosh_soft", 0.26);
  } else if (b.tipo === "componente") {
    const c = b.componente;
    noteImgs(b.props);
    // ⛔ CAMA DE FOTO debajo del componente (regla 2.quater). El ChapterTrailCard pinta su PROPIO
    // fondo negro opaco, así que envolverlo en MdBed no serviría: la cama va como PROP y el
    // componente la dibuja debajo de su gradiente. Se le pasa el `_blur.jpg` ya horneado.
    const props = { ...(b.props || {}) };
    if (b.bed) {
      const blur = b.bed.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
      const use = fs.existsSync(`public/${blur}`) ? blur : b.bed;
      props.bed = use;
      noteImgs({ bed: use });
    }
    cues.push({ key, start, dur, el: `(d) => <${c} durationInFrames={d} {...(${jprops(props)} as any)} />` });
    addSfx(start, "card_slide", "whoosh_soft", 0.34);
    addSfx(start, "ding_soft", "sparkle", 0.36, 0.5);
  } else if (b.tipo === "movimiento") {
    // los movimientos que muestran fotos hero las reciben por prop
    const extra =
      b.componente === "MovTowelman"
        ? ` hallway="img/${SLUG}_h32_oldmanhall.jpg" face="img/${SLUG}_h33_facefalls.jpg" truck="img/${SLUG}_h31_truckseat.jpg"`
        : b.componente === "MovClose"
        ? ` qr="img/${SLUG}_qrcard.png" kitchen="img/${SLUG}_h77_wipehands.jpg"`
        : "";
    if (extra) noteImgs(Object.fromEntries(extra.trim().split(/\s+(?=[a-z]+=)/).map((kv) => {
      const m = kv.match(/^([a-z]+)="(.+)"$/); return m ? [m[1], m[2]] : ["_", ""];
    })));
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d}${extra} />` });
    addSfx(start, "transition", "whoosh_soft", 0.3);
  }
}

// ── OVERLAYS: la capa de ideas ENCIMA del b-roll ─────────────────────────────────────────────
// ⛔ NO tocan `windows`: un overlay que oculta el avatar deja NEGRO cuando debajo tampoco hay
// b-roll (medido en `estoalos70`). Van montados y ya está.
const FULLSCREEN = new Set(["MdGuidePage", "MdQrCta"]); // traen su propia cama de foto
const ovComps = new Set(), ovFull = new Set();
for (const o of ovPlan) {
  const start = sec(o.ms_in), dur = sec(o.ms_out - o.ms_in);
  noteImgs(o.props);
  if (FULLSCREEN.has(o.componente)) {
    ovFull.add(o.componente);
    // El QR es el CTA del embudo: no puede quedarse ni medio segundo sobre negro plano mientras
    // entra. Medido en el 1er render: 0,77 s de negro adentro de la tarjeta. Va con cama de foto,
    // como PROP (el componente pinta su propio fondo opaco, envolverlo no serviría).
    const p = { ...(o.props || {}) };
    if (o.componente === "MdQrCta") {
      const bed = `img/${SLUG}_h77_wipehands_blur.jpg`;
      if (fs.existsSync(`public/${bed}`)) { p.bed = bed; noteImgs({ bed }); }
    }
    overlays.push({ key: `ov_${o.ms_in}`, start, dur, el: `(d) => <${o.componente} durationInFrames={d} {...(${jprops(p)} as any)} />` });
  } else {
    ovComps.add(o.componente);
    overlays.push({
      key: `ov_${o.ms_in}`, start, dur,
      el: `(d) => <PremiumOverlay durationInFrames={d} zone="${o.zone}" theme={THEME_PEROXIDE}><${o.componente} durationInFrames={d} theme={THEME_PEROXIDE} {...(${jprops(o.props)} as any)} /></PremiumOverlay>`,
    });
  }
  addSfx(start, "card_slide", "whoosh_soft", 0.3);
  addSfx(start, "ding_soft", "sparkle", 0.34, 0.6);
}

const TOTAL = sec(totalMs);
const TOTAL_FRAMES = Math.ceil(TOTAL * 30);
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

const movs = [...new Set(beats.filter((b) => b.tipo === "movimiento").map((b) => b.componente))];
const comps = [...new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente))];

const imports = [
  `import { ReactNode } from "react";`,
  `import { MdClip } from "../${SLUG}/MdClip";`,
  ...movs.map((m) => `import { ${m} } from "../${SLUG}/${m}";`),
  ...[...ovFull].sort().map((m) => `import { ${m} } from "../${SLUG}/${m}";`),
  ...(comps.includes("ChapterTrailCard") ? [`import { ChapterTrailCard } from "../peroxide/PeroxideHero";`] : []),
  ...(ovComps.size ? [
    `import { PremiumOverlay } from "./scenes/PremiumOverlay";`,
    `import { ${[...ovComps].sort().join(", ")}, THEME_PEROXIDE } from "./kit/premium";`,
  ] : []),
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

// ⛔⛔ LOS MOVIMIENTOS HARDCODEAN SU PROPIO MATERIAL (clips y fotos dentro de las tarjetas de
// vidrio). Eso NO pasa por los props, así que `noteImgs` no lo ve y el asset se queda fuera del
// tarball → 404 en el farm y chunk muerto. Se escanean los .tsx de `src/mddrain/` buscando
// staticFile("broll/…") y staticFile("img/…"), y se suma cada uno (+ su `_blur.jpg`).
// ⚠️ Los movimientos arman las rutas con PLANTILLAS (`staticFile(\`img/${b}_blur.jpg\`)`), así que
// buscar el string literal completo NO alcanza: hay que cazar el IDENTIFICADOR del asset
// (`mddrain_h07_wettowel`, `mddrain_lam_towel`, `mddrain_qrcard`) y de ahí derivar sus archivos.
{
  const ids = new Set();
  for (const f of fs.readdirSync(`src/${SLUG}`)) {
    if (!f.endsWith(".tsx")) continue;
    const src = fs.readFileSync(`src/${SLUG}/${f}`, "utf8");
    // rutas literales completas
    for (const m of src.matchAll(/["'`]((?:broll|img)\/[A-Za-z0-9_./-]+\.(?:mp4|png|jpe?g))["'`]/g)) {
      const p = m[1];
      if (!fs.existsSync(`public/${p}`)) { missing.push(`${p} (literal en ${f})`); continue; }
      if (p.startsWith("broll/")) clipsUsed.add(p); else imgsUsed.add(p);
      const blur = p.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
      if (blur !== p && fs.existsSync(`public/${blur}`)) imgsUsed.add(blur);
    }
    // identificadores sueltos usados en plantillas
    for (const m of src.matchAll(new RegExp(`\\b(${SLUG}_[a-z0-9_]+)\\b`, "g"))) {
      ids.add(m[1].replace(/_blur$/, ""));
    }
    // y los que se escriben SIN el prefijo del slug, tipo "h59_hoseloop"
    for (const m of src.matchAll(/["'`](h\d{2}_[a-z0-9]+)["'`]/g)) ids.add(`${SLUG}_${m[1]}`);
  }
  let n = 0;
  for (const id of ids) {
    for (const cand of [`broll/${id}.mp4`, `img/${id}.jpg`, `img/${id}.png`, `img/${id}_blur.jpg`]) {
      if (!fs.existsSync(`public/${cand}`)) continue;
      if (cand.startsWith("broll/")) clipsUsed.add(cand); else imgsUsed.add(cand);
      n++;
    }
  }
  console.log(`material de los movimientos: ${ids.size} identificador(es) → ${n} archivo(s) al tarball`);
}

// lista de assets para el farm (⛔ el nombre del archivo NO lleva arroba: el farm hace pref.slice(1))
const assets = [...clipsUsed, ...imgsUsed, ...usedSfx].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, assets.join("\n") + "\n");

console.log(`cues ${cues.length} · overlays ${overlays.length} · sfx ${sfxCues.length} · ventanas avatar ${windows.length}`);
console.log(`clips distintos ${clipsUsed.size} · imgs ${imgsUsed.size} · movimientos ${movs.length} (${movs.join(", ")})`);
console.log(`componentes ${[...new Set([...comps, ...ovComps, ...ovFull])].join(", ") || "-"}`);
console.log(`TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames`);
if (missing.length) { console.log(`\n⛔ FALTAN ${missing.length} assets:`); missing.slice(0, 10).forEach((m) => console.log("   " + m)); process.exit(1); }
console.log(`assets → _${SLUG}_assets.txt (${assets.length})`);
