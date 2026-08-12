// build_pxtecnicos.mjs — arma el video COMPLETO pxtecnicos desde los planes del DIRECTOR (A..F).
// Junta beats, recorta solapes, remapea clips a un POOL curado por subjeto (indoor/electrodomésticos),
// clasifica componentes, emite cues_pxtecnicos.gen.tsx + Main + index. Clonado de build_pxtrucos.mjs.
import fs from "fs";

const PLANS = ["A", "B", "C", "D", "E", "F"];

// ── juntar beats ──────────────────────────────────────────────────────────────
let beats = [];
for (const tag of PLANS) {
  let p;
  try { p = JSON.parse(fs.readFileSync(`_v3/pxtecnicos_plan_${tag}.json`, "utf8").replace(/^﻿/, "")); }
  catch (e) { console.log(`⚠️ falta/ilegible plan ${tag}: ${e.message}`); continue; }
  for (const b of p.beats) beats.push(b);
}
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) {
  if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
}
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

// ── REMAP a POOL curado por subjeto (clips REALES verificados on-topic, indoor) ─────
// Los directores piden clips hiper-específicos que Pexels no tiene bien → los reasignamos a un
// pool genérico por subjeto (por sub-tag de sección), round-robin, sin repetir seguido.
const POOL = {
  hook:   ["pxtec_bottle_1", "pxtec_washer_2", "pxtec_mold_3", "pxtec_kitchen_1", "pxtec_gloves_1", "pxtec_pour_1", "pxtec_fridge_3", "pxtec_stainless_1"],
  quim:   ["pxtec_pour_1", "pxtec_pour_2", "pxtec_bottle_1", "pxtec_bottle_2", "pxtec_mold_3", "pxtec_spray_1"],
  t1:     ["pxtec_washer_1", "pxtec_washer_2", "pxtec_drum_1", "pxtec_drum_2", "pxtec_pour_1"],
  t2:     ["pxtec_detergent_1", "pxtec_detergent_2", "pxtec_mold_2", "pxtec_spray_1", "pxtec_wipe_1"],
  t3:     ["pxtec_seal_2", "pxtec_seal_3", "pxtec_washer_3", "pxtec_drum_1", "pxtec_mold_3", "pxtec_wipe_2"],
  t4:     ["pxtec_dishwasher_2", "pxtec_dishwasher_3", "pxtec_spray_2", "pxtec_wipe_1"],
  t5:     ["pxtec_fridge_2", "pxtec_fridge_3", "pxtec_seal_2", "pxtec_mold_2", "pxtec_gloves_1"],
  t6:     ["pxtec_ice_3", "pxtec_mold_3", "pxtec_wipe_2", "pxtec_pour_1"],
  t7:     ["pxtec_microwave_2", "pxtec_microwave_3", "pxtec_spray_1", "pxtec_wipe_1"],
  t8:     ["pxtec_oven_1", "pxtec_oven_2", "pxtec_oven_3", "pxtec_gloves_2", "pxtec_wipe_2"],
  t9:     ["pxtec_coffee_1", "pxtec_coffee_2", "pxtec_coffee_3", "pxtec_pour_2", "pxtec_kitchen_1"],
  t10:    ["pxtec_sponge_1", "pxtec_sponge_2", "pxtec_sponge_3", "pxtec_board_1", "pxtec_board_3", "pxtec_wipe_1"],
  t11:    ["pxtec_stainless_1", "pxtec_stainless_2", "pxtec_stainless_3", "pxtec_wipe_2", "pxtec_fridge_3"],
  hon:    ["pxtec_washer_2", "pxtec_fridge_2", "pxtec_gloves_2", "pxtec_kitchen_1", "pxtec_oven_1"],
  seg:    ["pxtec_bottle_1", "pxtec_bottle_2", "pxtec_gloves_1", "pxtec_spray_2", "pxtec_pour_1"],
  cierre: ["pxtec_bottle_1", "pxtec_kitchen_1", "pxtec_fridge_3", "pxtec_washer_2", "pxtec_stainless_1"],
};
// prunear del POOL lo que no existe en disco (por si algún subjeto no bajó)
for (const k of Object.keys(POOL)) {
  POOL[k] = POOL[k].filter((n) => fs.existsSync(`public/broll/${n}.mp4`));
}
const FALLBACK = [...new Set(Object.values(POOL).flat())]; // cualquier clip real, por si un subtag quedó vacío
const secOf = (name) => { const m = /^pxtecnicos_([a-z0-9]+)_/.exec(name || ""); return m ? m[1] : null; };
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  const s = secOf(b.clip);
  let pool = (POOL[s] && POOL[s].length) ? POOL[s] : FALLBACK;
  if (!pool.length) continue;
  let i = (cnt[s] = (cnt[s] || 0)) % pool.length;
  let pick = pool[i];
  if (pick === lastClip && pool.length > 1) { i = (i + 1) % pool.length; pick = pool[i]; cnt[s]++; }
  cnt[s]++;
  b.clip = pick; lastClip = pick;
}

let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/pxtecnicos_clipdurs.json", "utf8")); } catch {}

// ── clasificación de componentes ────────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const STANDALONE = new Set(["TypeCardBeside", "GlitchCut"]);
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "center" };

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

const cues = [];
const overlays = [];
const windows = [];
let lastMode = null;
const clipsUsed = new Set();
const missing = [];
const KNOWN = new Set([...SIGNATURE, ...STANDALONE, ...PREMIUM]);
const badComp = new Set();

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
    if (!name) continue;
    clipsUsed.add(name);
    if (!fs.existsSync(`public/broll/${name}.mp4`)) missing.push(name);
    const cd = durs[name] ? ` clipDur={${(+durs[name]).toFixed(2)}}` : "";
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="broll/${name}.mp4" hue="red" darken={0.06}${cd} />` });
  } else if (b.tipo === "componente") {
    const c = b.componente;
    if (!KNOWN.has(c)) { badComp.add(c); continue; } // componente inventado por el director → descartar
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
const genTsx = `// cues_pxtecnicos.gen.tsx — GENERADO por build_pxtecnicos.mjs. NO editar a mano.
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
fs.writeFileSync("src/VideoEdit/cues_pxtecnicos.gen.tsx", genTsx);

const avTs = `// avatar_pxtecnicos.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXTECNICOS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_pxtecnicos.gen.ts", avTs);

const main = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxtecnicos.gen";
import { AVATAR_WINDOWS, TOTAL_PXTECNICOS } from "./avatar_pxtecnicos.gen";

// "11 Cosas que los Técnicos de Electrodomésticos No Quieren que Sepas…" (canal Agua Oxigenada, ES).
export const TOTAL_FRAMES_PXTECNICOS = Math.round(TOTAL_PXTECNICOS * 30);

export const MainPxtecnicos: React.FC = () => {
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
          <AvatarLayer src="pxtecnicos_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
fs.writeFileSync("src/VideoEdit/Main_pxtecnicos.tsx", main);

const idx = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxtecnicos, TOTAL_FRAMES_PXTECNICOS } from "./VideoEdit/Main_pxtecnicos";

const RootPxtecnicos: React.FC = () => (
  <>
    <Composition id="PxTecnicos" component={MainPxtecnicos} durationInFrames={TOTAL_FRAMES_PXTECNICOS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxtecnicos);
`;
fs.writeFileSync("src/index_pxtecnicos.tsx", idx);

fs.writeFileSync("_pxtecnicos_assets.txt", [...clipsUsed].map((n) => `broll/${n}.mp4`).join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length;
const nComp = beats.filter((b) => b.tipo === "componente").length;
const nAv = beats.filter((b) => b.tipo === "avatar").length;
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar)`);
console.log(`clips únicos: ${clipsUsed.size} | CUES: ${cues.length} | OVERLAYS(glitch): ${overlays.length} | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
let gaps = 0; for (let i = 0; i < beats.length - 1; i++) if (beats[i + 1].ms_in - beats[i].ms_out > 120) gaps++;
console.log(`huecos >0.12s: ${gaps}`);
if (badComp.size) console.log(`⚠️ componentes inventados descartados: ${[...badComp].join(", ")}`);
if (missing.length) console.log(`⚠️ CLIPS FALTANTES (${missing.length}): ${missing.slice(0, 20).join(", ")}`);
