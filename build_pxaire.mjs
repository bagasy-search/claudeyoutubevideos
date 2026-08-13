// build_pxaire.mjs — arma el video COMPLETO pxaire (AC/electrodomésticos, ES) desde los planes del DIRECTOR.
// Junta A..F, recorta solapes, remapea clips a un POOL curado por subjeto, clasifica componentes, emite gen+Main+index.
import fs from "fs";

const PLANS = ["A", "B", "C", "D", "E", "F"];

// ── juntar beats ──────────────────────────────────────────────────────────────
let beats = [];
for (const tag of PLANS) {
  const p = JSON.parse(fs.readFileSync(`_v3/pxaire_plan_${tag}.json`, "utf8").replace(/^﻿/, ""));
  for (const b of p.beats) beats.push(b);
}
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) {
  if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
}
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

// ── REMAP a POOL curado por subjeto (clips REALES verificados on-topic) ──────────
// Los directores pidieron clips hiper-específicos; Pexels es escaso para AC/interiores →
// reasignamos a un pool de clips verificados, por sección, con variedad round-robin.
// POOL depurado tras verificación visual (contact sheet): se sacaron los off-topic
// (sillón, edificios, neumático, interior de auto, mecánico, hazmat, blur).
const POOL = {
  hook:   ["pxa_ac_6", "pxa_window_3", "pxa_dish_1", "pxa_washer_1", "pxa_humid_2", "pxa_bottle_1", "pxa_bottle_2", "pxa_mold_1", "pxa_clean_1", "pxa_drain_1"],
  quim:   ["pxa_pour_1", "pxa_foam_2", "pxa_foam_1", "pxa_mold_1", "pxa_bottle_1", "pxa_spray_1", "pxa_drain_2"],
  t1:     ["pxa_drain_1", "pxa_mold_3", "pxa_drain_3", "pxa_drain_2", "pxa_pour_1"],
  t2:     ["pxa_window_3", "pxa_coil_3", "pxa_gloves_1", "pxa_spray_1", "pxa_mold_1"],
  cta1:   ["pxa_clean_1", "pxa_spray_1", "pxa_dish_2", "pxa_bottle_1"],
  t3:     ["pxa_washer_1", "pxa_washer_2", "pxa_mold_1", "pxa_spray_1", "pxa_gloves_1"],
  t4:     ["pxa_fridge_2", "pxa_fridge_3", "pxa_clean_1", "pxa_pour_1", "pxa_gloves_1"],
  t5:     ["pxa_coil_3", "pxa_ac_6", "pxa_window_3", "pxa_spray_2", "pxa_mold_1", "pxa_bill_1"],
  cta2:   ["pxa_clean_1", "pxa_coil_3", "pxa_bottle_1", "pxa_dish_1"],
  t6:     ["pxa_dish_1", "pxa_dish_2", "pxa_gloves_1", "pxa_spray_1", "pxa_mold_1"],
  t7:     ["pxa_disposal_1", "pxa_disposal_2", "pxa_foam_2", "pxa_foam_1"],
  t8:     ["pxa_humid_1", "pxa_humid_2", "pxa_mold_1", "pxa_pour_1"],
  t9:     ["pxa_car_1", "pxa_car_2", "pxa_car_3", "pxa_spray_1"],
  seg:    ["pxa_safety_1", "pxa_safety_2", "pxa_bottle_1", "pxa_gloves_1", "pxa_pour_1", "pxa_spray_2"],
  cierre: ["pxa_bottle_1", "pxa_bottle_2", "pxa_ac_6", "pxa_clean_1", "pxa_window_3", "pxa_spray_1"],
};
const secOf = (name) => { const m = /^pxaire_([a-z0-9]+)_/.exec(name || ""); return m ? m[1] : null; };
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  // ya remapeado (empieza con pxa_) → respetar
  if (/^pxa_/.test(b.clip) && fs.existsSync(`public/broll/${b.clip}.mp4`)) { lastClip = b.clip; continue; }
  const s = secOf(b.clip); const pool = POOL[s];
  if (!pool || !pool.length) continue;
  let i = (cnt[s] = (cnt[s] || 0)) % pool.length;
  let pick = pool[i];
  if (pick === lastClip && pool.length > 1) { i = (i + 1) % pool.length; pick = pool[i]; cnt[s]++; }
  cnt[s]++;
  b.clip = pick; lastClip = pick;
}

// duraciones reales de clips (opcional, anti-congelado)
let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/pxaire_clipdurs.json", "utf8")); } catch {}

// ── clasificación de componentes ────────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const STANDALONE = new Set(["TypeCardBeside"]);
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "center" };

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

// ⛔ Los directores mandaron formas SIMPLIFICADAS que NO matchean el shape real de los
// componentes → cada componente caía a su TEXTO DEFAULT ("Juntar ceniza fina", "La garantía
// cubre todo", VsDuel sin labels, BigStat en "$OOO"). Este normalizador traduce director→componente.
const wrapStr = (v, key) => (typeof v === "string" ? { [key]: v } : v);
const normProps = (comp, raw) => {
  const p = { ...(raw || {}) };
  if (comp === "BigStatReveal") {
    const nums = String(p.value ?? "").match(/\d[\d.,]*/g)?.map((s) => +s.replace(/[.,]/g, "")) || [0];
    const out = { value: Math.max(...nums), prefix: "$" };
    if (p.label) out.support = p.label;
    if (p.eyebrow) out.eyebrow = p.eyebrow;
    return out;
  }
  if (comp === "NumberedSteps") {
    if (Array.isArray(p.steps)) p.steps = p.steps.map((s) => wrapStr(s, "title"));
    return p;
  }
  if (comp === "FlowSteps") {
    if (Array.isArray(p.steps)) { p.nodes = p.steps.map((s) => wrapStr(s, "label")); delete p.steps; }
    if (Array.isArray(p.nodes)) p.nodes = p.nodes.map((s) => wrapStr(s, "label"));
    return p;
  }
  if (comp === "BulletCascade") {
    const src = p.bullets || p.items;
    if (Array.isArray(src)) { p.bullets = src.map((s) => wrapStr(s, "key")); delete p.items; }
    return p;
  }
  if (comp === "VsDuel") {
    if (p.left) p.left = wrapStr(p.left, "label");
    if (p.right) { p.right = wrapStr(p.right, "label"); if (/per[oó]xido|oxigenad/i.test(p.right.label || "")) p.right.good = true; }
    return p;
  }
  if (comp === "HighlightSweep") {
    if (p.text && !p.highlight) { p.highlight = p.text; p.pre = p.pre || ""; p.post = p.post || ""; delete p.text; }
    return p;
  }
  return p;
};

// ── construir CUES / OVERLAYS / WINDOWS ──────────────────────────────────────────
const cues = [];
const overlays = [];
const windows = [];
let lastMode = null;
const clipsUsed = new Set();
const missing = [];

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
    const name = b.clip;
    clipsUsed.add(name);
    if (!fs.existsSync(`public/broll/${name}.mp4`)) missing.push(name);
    const cd = durs[name] ? ` clipDur={${(+durs[name]).toFixed(2)}}` : "";
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="broll/${name}.mp4" hue="red" darken={0.06}${cd} />` });
  } else if (b.tipo === "componente") {
    const c = b.componente;
    const props = jprops(normProps(c, b.props));
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
const genTsx = `// cues_pxaire.gen.tsx — GENERADO por build_pxaire.mjs. NO editar a mano.
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
fs.writeFileSync("src/VideoEdit/cues_pxaire.gen.tsx", genTsx);

const avTs = `// avatar_pxaire.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXAIRE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_pxaire.gen.ts", avTs);

const main = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxaire.gen";
import { AVATAR_WINDOWS, TOTAL_PXAIRE } from "./avatar_pxaire.gen";

// "9 Trucos con Agua Oxigenada… Técnicos de Aire" (canal Agua Oxigenada, ES). Footage-first + kit premium rojo/negro/blanco.
export const TOTAL_FRAMES_PXAIRE = Math.round(TOTAL_PXAIRE * 30);

export const MainPxaire: React.FC = () => {
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
          <AvatarLayer src="pxaire_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
fs.writeFileSync("src/VideoEdit/Main_pxaire.tsx", main);

const idx = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxaire, TOTAL_FRAMES_PXAIRE } from "./VideoEdit/Main_pxaire";

const RootPxaire: React.FC = () => (
  <>
    <Composition id="PxAire" component={MainPxaire} durationInFrames={TOTAL_FRAMES_PXAIRE} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxaire);
`;
fs.writeFileSync("src/index_pxaire.tsx", idx);

fs.writeFileSync("_pxaire_assets.txt", [...clipsUsed].map((n) => `broll/${n}.mp4`).join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length;
const nComp = beats.filter((b) => b.tipo === "componente").length;
const nAv = beats.filter((b) => b.tipo === "avatar").length;
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar)`);
console.log(`clips únicos: ${clipsUsed.size} | CUES: ${cues.length} | OVERLAYS(glitch): ${overlays.length} | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
let gaps = 0; for (let i = 0; i < beats.length - 1; i++) if (beats[i + 1].ms_in - beats[i].ms_out > 120) gaps++;
console.log(`huecos >0.12s: ${gaps}`);
if (missing.length) console.log(`⚠️ CLIPS FALTANTES (${missing.length}): ${missing.slice(0, 20).join(", ")}`);
