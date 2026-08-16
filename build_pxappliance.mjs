// build_pxappliance.mjs — "11 Hydrogen Peroxide Secrets Gardeners Don't Want You to Know" (EN).
// Clon de build_pxjardin.mjs + tipo "imagen" (QR/fotos) + SFX cableados desde public/sfx/lib.
// Lee _v3/pxappliance_plan.json, remapea clips a POOL por SECCIÓN, emite .gen + Main + index. Comp PxAppliance.
import fs from "fs";

let beats = JSON.parse(fs.readFileSync("_v3/pxappliance_plan.json", "utf8").replace(/^﻿/, "")).beats;
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);
// GUARD: componente < 0.9s rompe su choreografía → pasarlo a clip (RawShot aguanta cualquier dur).
for (const b of beats) if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) { b.tipo = "clip"; b.avatar = "hidden"; delete b.componente; delete b.props; }

// ── POOL curado por SECCIÓN (clips Pexels por APARATO, 40 en public/broll) ──────
// t1 washer smell · t2 detergent drawer · t3 door gasket (rescue) · t4 dishwasher ·
// t5 fridge · t6 ice maker · t7 microwave · t8 oven · t9 coffee maker · t10 sponge/board · t11 stainless
const POOL = {
  hook:   ["pxappliance_bottle_1", "pxappliance_mold_1", "pxappliance_kitchen_1", "pxappliance_bottle_2", "pxappliance_mold_2"],
  quim:   ["pxappliance_foam_1", "pxappliance_bottle_3", "pxappliance_mold_1", "pxappliance_pour_1"],
  t1:     ["pxappliance_washer_1", "pxappliance_washer_2", "pxappliance_washer_3", "pxappliance_laundry_1"],
  t2:     ["pxappliance_drawer_1", "pxappliance_drawer_2", "pxappliance_washer_3"],
  t3:     ["pxappliance_gasket_1", "pxappliance_washer_3", "pxappliance_mold_2", "pxappliance_washer_2"],
  t4:     ["pxappliance_dish_1", "pxappliance_dish_2", "pxappliance_dish_3", "pxappliance_drawer_2"],
  t5:     ["pxappliance_fridge_1", "pxappliance_fridge_2", "pxappliance_fridge_3", "pxappliance_steel_2"],
  t6:     ["pxappliance_ice_1", "pxappliance_ice_2", "pxappliance_ice_3"],
  t7:     ["pxappliance_micro_1", "pxappliance_micro_2", "pxappliance_spray_1"],
  t8:     ["pxappliance_oven_1", "pxappliance_oven_2", "pxappliance_oven_3"],
  t9:     ["pxappliance_coffee_1", "pxappliance_coffee_2", "pxappliance_coffee_3"],
  t10:    ["pxappliance_sponge_1", "pxappliance_sponge_2", "pxappliance_board_1"],
  t11:    ["pxappliance_steel_1", "pxappliance_steel_2", "pxappliance_steel_3", "pxappliance_fridge_3"],
  seg:    ["pxappliance_spray_1", "pxappliance_gloves_1", "pxappliance_kitchen_1", "pxappliance_bottle_3"],
  cierre: ["pxappliance_bottle_1", "pxappliance_bottle_2", "pxappliance_kitchen_1", "pxappliance_spray_1"],
};
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  const pool = POOL[b.sec];
  if (!pool || !pool.length) { if (!b.clip) b.clip = "pxappliance_kitchen_1"; continue; }
  if (b.clip && pool.includes(b.clip) && b.clip !== lastClip) { lastClip = b.clip; continue; }
  let i = (cnt[b.sec] = (cnt[b.sec] || 0)) % pool.length;
  let pick = pool[i];
  if (pick === lastClip && pool.length > 1) { i = (i + 1) % pool.length; pick = pool[i]; cnt[b.sec]++; }
  cnt[b.sec]++;
  b.clip = pick; lastClip = pick;
}

let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/pxappliance_clipdurs.json", "utf8")); } catch {}

// ── ANTI-HUECO: ningún beat de CONTENIDO más largo que su choreografía/clip real.
// El excedente (cuando Whisper no cortó la oración) se rellena con AVATAR FULL → nunca
// se ve el fondo/placeholder crema entre transiciones. (bug medido en pxgarden 62s.)
{
  const CAP_COMP = 9.5, CAP_IMG = 6.8;
  const out = [];
  for (const b of beats) {
    const durS = (b.ms_out - b.ms_in) / 1000;
    let cap = Infinity;
    if (b.tipo === "componente") cap = b.componente === "ChapterTrailCard" ? 9.5 : CAP_COMP;
    else if (b.tipo === "imagen") cap = CAP_IMG;
    else if (b.tipo === "clip") cap = Math.min(9.5, (durs[b.clip] || 10) - 0.2);
    if (durS > cap + 0.5) {
      const cut = b.ms_in + Math.round(cap * 1000);
      out.push({ ...b, ms_out: cut });
      out.push({ ms_in: cut, ms_out: b.ms_out, tipo: "avatar", avatar: "full" });
    } else out.push(b);
  }
  const nSplit = out.length - beats.length;
  beats = out;
  console.log(`ANTI-HUECO: ${nSplit} beats de contenido recortados → avatar full en el excedente`);
}

// ── SFX: biblioteca por rol (public/sfx/lib) → picker que ROTA variantes ──────
let SFXLIB = {};
try {
  const lib = JSON.parse(fs.readFileSync("public/sfx/lib/px_sfx_library.json", "utf8"));
  for (const it of lib.items) (SFXLIB[it.role] ||= []).push(`sfx/lib/${it.file}`);
} catch (e) { console.warn("⚠️ sin biblioteca SFX lib:", e.message); }
const sfxCtr = {};
const usedSfx = new Set();
function pick(role, fallback) {
  const arr = SFXLIB[role] && SFXLIB[role].length ? SFXLIB[role] : (fallback && SFXLIB[fallback]) || [];
  if (!arr.length) return null;
  const i = (sfxCtr[role] = (sfxCtr[role] || 0)) % arr.length; sfxCtr[role]++;
  usedSfx.add(arr[i]); return arr[i];
}
// componente → {enter:[roles], accent:role}
const SFXMAP = {
  BigStatReveal: { accent: "coin_soft" }, ChapterTrailCard: { enter: "card_slide", accent: "ding_soft" },
  LightTrailCards: { accent: "sparkle" }, NodeRingToggle: { accent: "shimmer" }, BottleHero: { accent: "pop_soft" },
  FoamClean: { accent: "foam" }, GluGluPour: { accent: "pour_soft" }, MythTruth: { accent: "confirm" },
  FlowSteps: { accent: "success" }, NumberedSteps: { accent: "tick" }, ChecklistReveal: { accent: "tick" },
  HighlightSweep: { accent: "swish" }, HookCaption: { accent: "pop_soft" }, CtaCard: { accent: "chime" },
};
const sfxCues = [];
function addSfx(startSec, role, fallback, vol = 0.4, at = 0) {
  const src = pick(role, fallback); if (!src) return;
  sfxCues.push({ start: +(startSec + at).toFixed(3), src, vol });
}

// ── clasificación de componentes ──────────────────────────────────────────────
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "full" };

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

const cues = [], overlays = [], windows = [];
let lastMode = null, clipEntryCtr = 0;
const clipsUsed = new Set(), imgsUsed = new Set(), missing = [];

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms_in), dur = sec(b.ms_out - b.ms_in);
  const key = `${b.tipo}_${b.ms_in}`;
  const mode = b.avatar === "full" ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }
  if (mode === "full" && (i === 0 || beats[i - 1].avatar !== "full")) {
    const gs = Math.max(0, start - 0.4);
    overlays.push({ key: `glitch_${b.ms_in}`, start: gs, dur: 0.4, el: `(d) => <GlitchCut durationInFrames={d} />` });
    addSfx(gs, "glitch_soft", "swish", 0.35);
  }

  if (b.tipo === "avatar") continue;

  if (b.tipo === "clip") {
    const name = b.clip; clipsUsed.add(name);
    if (!fs.existsSync(`public/broll/${name}.mp4`)) missing.push(name);
    const cd = durs[name] ? ` clipDur={${(+durs[name]).toFixed(2)}}` : "";
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="broll/${name}.mp4" hue="red" darken={0.06}${cd} />` });
    if (clipEntryCtr++ % 3 === 0) addSfx(start, "swish", "whoosh_soft", 0.3); // swish suave en ~1 de 3 cortes
  } else if (b.tipo === "imagen") {
    const src = b.img; imgsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${src}" hue="red" darken={0} />` });
    addSfx(start, "success", "chime", 0.45); // reveal del QR
  } else if (b.tipo === "componente") {
    const c = b.componente, props = jprops(b.props);
    let el;
    if (PREMIUM.has(c)) { const zone = ZONE[c] || "topLeft"; el = `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_PEROXIDE}><${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${props} as any)} /></PremiumOverlay>`; }
    else el = `(d) => <${c} durationInFrames={d} {...(${props} as any)} />`;
    cues.push({ key, start, dur, el });
    const m = SFXMAP[c] || {};
    addSfx(start, m.enter || "whoosh_soft", "transition", 0.34);       // whoosh de entrada
    if (m.accent) addSfx(start, m.accent, "ding_soft", 0.42, 0.45);    // acento en el reveal
  }
}

const TOTAL = sec(Math.max(...beats.map((b) => b.ms_out)));
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

// imports SOLO de lo usado
const usedComp = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
usedComp.add("GlitchCut");
const heroAll = ["LightTrailCards", "ChapterTrailCard", "NodeRingToggle", "BottleHero", "GlitchCut", "TypeCardBeside"];
const kitAll = ["FoamClean", "GluGluPour"];
const premAll = ["BigStatReveal", "BulletCascade", "MythTruth", "FlowSteps", "VsDuel", "NumberedSteps", "BeforeAfter", "PullQuote", "ChecklistReveal", "HighlightSweep", "HookCaption", "CtaCard"];
const heroUsed = heroAll.filter((c) => usedComp.has(c)), kitUsed = kitAll.filter((c) => usedComp.has(c)), premUsed = premAll.filter((c) => usedComp.has(c));
const imp = [`import { ReactNode } from "react";`, `import { RawShot } from "./scenes/RawShot";`];
if (heroUsed.length) imp.push(`import { ${heroUsed.join(", ")} } from "../peroxide/PeroxideHero";`);
if (kitUsed.length) imp.push(`import { ${kitUsed.join(", ")} } from "../peroxide/PeroxideKit";`);
if (premUsed.length) imp.push(`import { PremiumOverlay } from "./scenes/PremiumOverlay";`);
if (premUsed.length) imp.push(`import { ${[...premUsed, "THEME_PEROXIDE"].join(", ")} } from "./kit/premium";`);

const genTsx = `// cues_pxappliance.gen.tsx — GENERADO por build_pxappliance.mjs. NO editar a mano.
${imp.join("\n")}

export type Cue = { key: string; start: number; dur: number; kind?: string; el: (d: number) => ReactNode };
export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];
export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];
export const SFXCUES: { start: number; src: string; vol: number }[] = ${JSON.stringify(sfxCues)};
`;
fs.writeFileSync("src/VideoEdit/cues_pxappliance.gen.tsx", genTsx);

fs.writeFileSync("src/VideoEdit/avatar_pxappliance.gen.ts", `// avatar_pxappliance.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXAPPLIANCE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const main = `import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS, SFXCUES } from "./cues_pxappliance.gen";
import { AVATAR_WINDOWS, TOTAL_PXAPPLIANCE } from "./avatar_pxappliance.gen";

// "11 Hydrogen Peroxide Secrets Gardeners Don't Want You to Know" (canal Agua Oxigenada EN).
export const TOTAL_FRAMES_PXAPPLIANCE = Math.round(TOTAL_PXAPPLIANCE * 30);

export const MainPxappliance: React.FC = () => {
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
          <AvatarLayer src="pxappliance_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {SFXCUES.map((s, i) => (
            <Sequence key={"sfx" + i} from={sec(s.start)} durationInFrames={60} layout="none">
              <Audio src={staticFile(s.src)} volume={s.vol} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
`;
fs.writeFileSync("src/VideoEdit/Main_pxappliance.tsx", main);

fs.writeFileSync("src/index_pxappliance.tsx", `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxappliance, TOTAL_FRAMES_PXAPPLIANCE } from "./VideoEdit/Main_pxappliance";
const RootPxappliance: React.FC = () => (
  <><Composition id="PxAppliance" component={MainPxappliance} durationInFrames={TOTAL_FRAMES_PXAPPLIANCE} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootPxappliance);
`);

// assets list: clips + imgs (+ _blur) + SFX usados
const assets = [...[...clipsUsed].map((n) => `broll/${n}.mp4`), ...[...imgsUsed], ...[...imgsUsed].map((s) => s.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg")), ...[...usedSfx]];
fs.writeFileSync("_pxappliance_assets.txt", assets.join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length, nComp = beats.filter((b) => b.tipo === "componente").length, nAv = beats.filter((b) => b.tipo === "avatar").length, nImg = beats.filter((b) => b.tipo === "imagen").length;
const compTypes = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar / ${nImg} img)`);
console.log(`clips únicos: ${clipsUsed.size} | comp distintos: ${compTypes.size} (${[...compTypes].join(", ")})`);
console.log(`CUES: ${cues.length} | OVERLAYS: ${overlays.length} | SFX cues: ${sfxCues.length} (${usedSfx.size} archivos) | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ FALTANTES (${missing.length}): ${[...new Set(missing)].slice(0, 20).join(", ")}`);
