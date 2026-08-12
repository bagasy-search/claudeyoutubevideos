// build_pxtrucos.mjs — arma el video COMPLETO pxtrucos desde los planes del DIRECTOR.
// Junta FM + A..E, recorta solapes, clasifica componentes, emite los .gen + Main + index.
import fs from "fs";

const PLANS = ["FM", "A", "B", "C", "D", "E"];
const FM_END = 68500; // el primer minuto (aprobado) manda hasta acá; beats de otras secciones antes de esto se descartan

// ── juntar beats ──────────────────────────────────────────────────────────────
let beats = [];
for (const tag of PLANS) {
  const p = JSON.parse(fs.readFileSync(`_v3/pxtrucos_plan_${tag}.json`, "utf8").replace(/^﻿/, ""));
  for (const b of p.beats) {
    if (tag !== "FM" && b.ms_in < FM_END) continue; // no pisar el primer minuto
    beats.push(b);
  }
}
beats.sort((a, b) => a.ms_in - b.ms_in);
// recorte de solapes: cada beat termina como muy tarde donde arranca el siguiente
for (let i = 0; i < beats.length - 1; i++) {
  if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
}
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200); // descartá micro-beats < 0.2s

// ── REMAP a POOL curado por subjeto (clips verificados on-topic) ─────────────────
// Los directores pidieron clips hiper-específicos que Pexels no tiene bien; los
// reasignamos a un pool de clips REALES verificados, por sección, con variedad.
// Los del primer minuto (pxtrucosfm_) NO se tocan (ya aprobados).
const POOL = {
  hook: ["pxtrucosfm_algaewall", "pxtrucosfm_roofshingles", "pxtrucosfm_deck", "pxtrucosfm_oilstain", "pxtrucosfm_moss_patio", "pxtrucosfm_algae_macro", "pxtrucosfm_house", "pxtrucosfm_pressurewash", "pxtrucosfm_worker", "pxtrucosfm_mold_macro", "pxtrucosfm_pharmacyshelf"],
  quim: ["pxtrucosfm_pour", "pxpool_pour_1", "pxtrucosfm_algae_macro", "pxpool_moss_1", "pxpool_plants_1", "pxpool_bottle_1", "pxtrucosfm_mold_macro"],
  t1: ["pxtrucosfm_algaewall", "pxpool_siding_2", "pxpool_siding_3", "pxtrucosfm_washwall", "pxtrucosfm_worker"],
  t2: ["pxtrucosfm_deck", "pxpool_deck_1", "pxpool_deck_2", "pxpool_deck_3", "pxtrucosfm_worker"],
  t3: ["pxtrucosfm_pressurewash", "pxpool_concrete_1", "pxpool_concrete_2", "pxpool_concrete_3", "pxpool_moss_1"],
  t4: ["pxtrucosfm_oilstain", "pxpool_concrete_1", "pxpool_concrete_2", "pxtrucosfm_pour", "pxpool_pour_1"],
  t5: ["pxtrucosfm_roofshingles", "pxtrucosfm_roof_streaks", "pxpool_roof_1", "pxpool_roof_2", "pxpool_roof_3", "pxpool_roof_4", "pxtrucosfm_worker"],
  mid: ["pxpool_concrete_1", "pxpool_deck_1", "pxtrucosfm_house"],
  t6: ["pxpool_deck_1", "pxpool_deck_3", "pxpool_siding_2", "pxpool_siding_3", "pxtrucosfm_deck"],
  t7: ["pxpool_cushion_2", "pxtrucosfm_mold_macro", "pxpool_plants_1"],
  t8: ["pxpool_pavers_3", "pxpool_pavers_2", "pxtrucosfm_moss_patio", "pxpool_moss_1", "pxpool_concrete_2", "pxtrucosfm_pressurewash"],
  t9: ["pxpool_garbage_1", "pxpool_garbage_2", "pxpool_pour_1"],
  seg: ["pxpool_safety_1", "pxpool_safety_2", "pxpool_bottle_1", "pxpool_pour_1", "pxpool_roof_2", "pxpool_roof_3", "pxtrucosfm_house"],
  cierre: ["pxpool_bottle_1", "pxtrucosfm_house", "pxtrucosfm_roofshingles", "pxtrucosfm_pressurewash", "pxtrucosfm_algaewall"],
};
const secOf = (name) => { const m = /^pxtrucos_([a-z0-9]+)_/.exec(name || ""); return m ? m[1] : null; };
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  if (/^pxtrucosfm_/.test(b.clip)) { lastClip = b.clip; continue; } // FM aprobado, no tocar
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
try { durs = JSON.parse(fs.readFileSync("_v3/pxtrucos_clipdurs.json", "utf8")); } catch {}

// ── clasificación de componentes ────────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const STANDALONE = new Set(["TypeCardBeside"]); // overlay propio, sin PremiumOverlay ni theme
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "center" };

const sec = (ms) => +(ms / 1000).toFixed(3);
// ⛔ los directores a veces metieron theme:"THEME_PEROXIDE" (STRING) y durationInFrames en los props →
// pisaban el theme (objeto) y la duración reales que inyecta el builder → crash "reading 'gold'".
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

// ── construir CUES / OVERLAYS / WINDOWS ──────────────────────────────────────────
const cues = [];      // full-bleed (clips + componentes)
const overlays = [];  // glitch antes del avatar full
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
const genTsx = `// cues_pxtrucos.gen.tsx — GENERADO por build_pxtrucos.mjs. NO editar a mano.
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
fs.writeFileSync("src/VideoEdit/cues_pxtrucos.gen.tsx", genTsx);

const avTs = `// avatar_pxtrucos.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXTRUCOS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_pxtrucos.gen.ts", avTs);

const main = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxtrucos.gen";
import { AVATAR_WINDOWS, TOTAL_PXTRUCOS } from "./avatar_pxtrucos.gen";

// "9 Trucos con Agua Oxigenada…" (canal Agua Oxigenada, ES). Footage-first + kit premium rojo/negro/blanco.
export const TOTAL_FRAMES_PXTRUCOS = Math.round(TOTAL_PXTRUCOS * 30);

export const MainPxtrucos: React.FC = () => {
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
          <AvatarLayer src="pxtrucos_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
fs.writeFileSync("src/VideoEdit/Main_pxtrucos.tsx", main);

const idx = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxtrucos, TOTAL_FRAMES_PXTRUCOS } from "./VideoEdit/Main_pxtrucos";

const RootPxtrucos: React.FC = () => (
  <>
    <Composition id="PxTrucos" component={MainPxtrucos} durationInFrames={TOTAL_FRAMES_PXTRUCOS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxtrucos);
`;
fs.writeFileSync("src/index_pxtrucos.tsx", idx);

fs.writeFileSync("_pxtrucos_assets.txt", [...clipsUsed].map((n) => `broll/${n}.mp4`).join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length;
const nComp = beats.filter((b) => b.tipo === "componente").length;
const nAv = beats.filter((b) => b.tipo === "avatar").length;
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar)`);
console.log(`clips únicos: ${clipsUsed.size} | CUES: ${cues.length} | OVERLAYS(glitch): ${overlays.length} | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
let gaps = 0; for (let i = 0; i < beats.length - 1; i++) if (beats[i + 1].ms_in - beats[i].ms_out > 120) gaps++;
console.log(`huecos >0.12s: ${gaps}`);
if (missing.length) console.log(`⚠️ CLIPS FALTANTES (${missing.length}): ${missing.slice(0, 20).join(", ")}`);
