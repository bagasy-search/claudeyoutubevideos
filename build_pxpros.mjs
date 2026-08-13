// build_pxpros.mjs — arma el video COMPLETO pxpros desde los planes del DIRECTOR (P1..P8).
// Historia "la cotización que se va tachando". Footage-first (POOL verificado) + kit premium rojo/negro/blanco.
// Los directores eligen el CLIP real directo (b.clip) → sin capa de remap. Guard anti-crash para comps cortos.
import fs from "fs";

const PLANS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];

// ── juntar beats ──────────────────────────────────────────────────────────────
let beats = [];
for (const tag of PLANS) {
  const path = `_v3/pxpros_plan_${tag}.json`;
  const p = JSON.parse(fs.readFileSync(path, "utf8").replace(/^﻿/, ""));
  for (const b of p.beats) beats.push(b);
}
beats.sort((a, b) => a.ms_in - b.ms_in);
// recorte de solapes
for (let i = 0; i < beats.length - 1; i++) {
  if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
}
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

const sec = (ms) => +(ms / 1000).toFixed(3);

// ── GUARD anti-crash: componente < 0.9s (ChapterTrailCard y choreografías crashean) → avatar full ──
let guarded = 0;
for (const b of beats) {
  if (b.tipo === "componente" && (b.ms_out - b.ms_in) < 900) {
    b.tipo = "avatar"; b.avatar = "full"; b.componente = null; b.props = null; guarded++;
  }
}

// ── DIVERSIFICACIÓN por SUBJETO: balancea el uso de clips (mata la repetición y sube distintos ≥28) ──
// Cada grupo = clips intercambiables del MISMO subjeto (todos verificados on-subject en el contact sheet).
// (pxpool_siding_3 = pared con GRAFFITI → EXCLUIDO del pool; off-subject en la auditoría)
const GROUPS = [
  ["pxpool_siding_1", "pxpool_siding_2", "pxpool_wash_2", "pxpool_wash_1"],
  ["pxpool_deck_1", "pxpool_deck_2", "pxpool_deck_3"],
  ["pxpool_concrete_1", "pxpool_concrete_2", "pxpool_concrete_3"],
  ["pxpool_moss_1", "pxpool_pavers_3", "pxpool_pavers_2"],
  ["pxpros_roofstreak_2", "pxpool_roof_3", "pxpool_roof_4"],
  ["pxpros_cushionmold_1", "pxpool_cushion_2", "pxpool_cushion_1"],
  ["pxpool_garbage_1", "pxpool_garbage_2"],
  ["pxpool_bottle_1", "pxpool_pour_1"],
  ["pxpros_rust_1", "pxpros_oil_2"],
  ["pxpool_safety_1", "pxpool_safety_2"],
];
const clipGroup = new Map();
GROUPS.forEach((g) => g.forEach((c) => { if (!clipGroup.has(c)) clipGroup.set(c, g); }));
const grpIdx = new Map();
let prevClip = null;
for (const b of beats) {
  if (b.tipo !== "clip" || !b.clip) continue;
  const g = clipGroup.get(b.clip);
  if (!g || g.length < 2) { prevClip = b.clip; continue; }
  let i = (grpIdx.get(g) || 0) % g.length;
  let pick = g[i];
  if (pick === prevClip) { i = (i + 1) % g.length; pick = g[i]; }
  grpIdx.set(g, i + 1);
  b.clip = pick; prevClip = pick;
}
// REMAP_OUT: por si un director referenció directo un clip off-subject → a uno on-subject.
const REMAP_OUT = { pxpool_siding_3: "pxpool_siding_1" };
for (const b of beats) { if (b.tipo === "clip" && REMAP_OUT[b.clip]) b.clip = REMAP_OUT[b.clip]; }

// duraciones reales de clips (anti-congelado)
let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/pxpros_clipdurs.json", "utf8")); } catch {}

// ── clasificación de componentes ────────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "center" };

const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

// ── construir CUES / OVERLAYS / WINDOWS ──────────────────────────────────────────
const cues = [];
const overlays = [];
const windows = [];
let lastMode = null;
const clipsUsed = new Set();
const missing = [];
let lastClip = null;

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms_in), dur = sec(b.ms_out - b.ms_in);
  const key = `${b.tipo}_${b.ms_in}`;

  const mode = b.avatar === "full" ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }

  if (mode === "full" && (i === 0 || beats[i - 1].avatar !== "full")) {
    const gs = Math.max(0, start - 0.4);
    overlays.push({ key: `glitch_${b.ms_in}`, start: gs, dur: 0.4, el: `(d) => <GlitchCut durationInFrames={d} />` });
  }

  if (b.tipo === "avatar") continue;

  if (b.tipo === "clip") {
    let name = b.clip;
    if (!name || !fs.existsSync(`public/broll/${name}.mp4`)) { missing.push(name || `(null@${b.ms_in})`); if (!name) continue; }
    // evitar mismo clip dos veces seguidas
    clipsUsed.add(name);
    const cd = durs[name] ? ` clipDur={${(+durs[name]).toFixed(2)}}` : "";
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="broll/${name}.mp4" hue="red" darken={0.06}${cd} />` });
    lastClip = name;
  } else if (b.tipo === "componente") {
    const c = b.componente;
    const props = jprops(b.props);
    let el;
    if (PREMIUM.has(c)) {
      const zone = ZONE[c] || "topLeft";
      el = `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_PEROXIDE}><${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${props} as any)} /></PremiumOverlay>`;
    } else {
      el = `(d) => <${c} durationInFrames={d} {...(${props} as any)} />`;
    }
    cues.push({ key, start, dur, el });
  }
}

const TOTAL = sec(Math.max(...beats.map((b) => b.ms_out)));

const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;
const genTsx = `// cues_pxpros.gen.tsx — GENERADO por build_pxpros.mjs. NO editar a mano.
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { LightTrailCards, ChapterTrailCard, NodeRingToggle, BottleHero, GlitchCut, TypeCardBeside } from "../peroxide/PeroxideHero";
import { FoamClean, GluGluPour } from "../peroxide/PeroxideKit";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { BigStatReveal, BulletCascade, MythTruth, FlowSteps, VsDuel, NumberedSteps, BeforeAfter, PullQuote, ChecklistReveal, HighlightSweep, HookCaption, CtaCard, THEME_PEROXIDE } from "./kit/premium";

export type Cue = { key: string; start: number; dur: number; kind?: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];
`;
fs.writeFileSync("src/VideoEdit/cues_pxpros.gen.tsx", genTsx);

const avTs = `// avatar_pxpros.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXPROS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_pxpros.gen.ts", avTs);

const main = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxpros.gen";
import { AVATAR_WINDOWS, TOTAL_PXPROS } from "./avatar_pxpros.gen";

// "9 Cosas que los Profesionales de Limpieza…" (canal Agua Oxigenada, ES). Historia: la cotización que se va tachando.
export const TOTAL_FRAMES_PXPROS = Math.round(TOTAL_PXPROS * 30);

export const MainPxpros: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="red" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="pxpros_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
`;
fs.writeFileSync("src/VideoEdit/Main_pxpros.tsx", main);

const idx = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxpros, TOTAL_FRAMES_PXPROS } from "./VideoEdit/Main_pxpros";

const RootPxpros: React.FC = () => (
  <>
    <Composition id="PxPros" component={MainPxpros} durationInFrames={TOTAL_FRAMES_PXPROS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxpros);
`;
fs.writeFileSync("src/index_pxpros.tsx", idx);

// recolectar imágenes referenciadas por componentes (LightTrailCards.images[], VsDuel left/right.image, CtaCard.image, etc.)
const imgAssets = new Set();
const collectImgs = (o) => {
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === "image" || k === "src") && typeof v === "string" && /\.(jpg|jpeg|png|webp)$/i.test(v)) imgAssets.add(v.replace(/^\//, ""));
    else if (k === "images" && Array.isArray(v)) v.forEach((s) => typeof s === "string" && imgAssets.add(s.replace(/^\//, "")));
    else if (v && typeof v === "object") collectImgs(v);
  }
};
for (const b of beats) if (b.tipo === "componente") collectImgs(b.props);
const imgMissing = [...imgAssets].filter((p) => !fs.existsSync(`public/${p}`));
fs.writeFileSync("_pxpros_assets.txt", [...[...clipsUsed].map((n) => `broll/${n}.mp4`), ...imgAssets].join("\n") + "\n");
if (imgMissing.length) console.log(`⚠️ IMÁGENES FALTANTES (${imgMissing.length}): ${imgMissing.join(", ")}`);
else console.log(`imágenes de componentes: ${imgAssets.size} (todas presentes)`);

const nClip = beats.filter((b) => b.tipo === "clip").length;
const nComp = beats.filter((b) => b.tipo === "componente").length;
const nAv = beats.filter((b) => b.tipo === "avatar").length;
const compKinds = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar) · comps distintos: ${compKinds.size} [${[...compKinds].join(", ")}]`);
console.log(`clips únicos: ${clipsUsed.size} | CUES: ${cues.length} | OVERLAYS(glitch): ${overlays.length} | windows: ${windows.length} | guard<0.9s→avatar: ${guarded}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
let gaps = 0; for (let i = 0; i < beats.length - 1; i++) if (beats[i + 1].ms_in - beats[i].ms_out > 120) gaps++;
console.log(`huecos >0.12s: ${gaps}`);
// pacing stats
const ds = beats.map((b) => (b.ms_out - b.ms_in) / 1000).sort((a, b) => a - b);
const med = ds[Math.floor(ds.length / 2)];
const p75 = ds[Math.floor(ds.length * 0.75)];
const ge5 = ds.filter((d) => d >= 5).length;
console.log(`pacing: mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s: ${ge5}/${ds.length} (${Math.round(100 * ge5 / ds.length)}%)`);
if (missing.length) console.log(`⚠️ CLIPS FALTANTES (${missing.length}): ${[...new Set(missing)].slice(0, 30).join(", ")}`);
