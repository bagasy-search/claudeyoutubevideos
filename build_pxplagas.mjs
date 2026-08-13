// build_pxplagas.mjs — arma "11 Secretos con Agua Oxigenada (jardineros)" desde el plan del DIRECTOR.
// Clon de build_pxtrucos.mjs, adaptado al video ES de jardinería. Comp PxPlagas.
// Lee _v3/pxplagas_plan.json (beats[] anclados al ms de Whisper), remapea clips a un
// POOL curado por SECCIÓN (b.sec), clasifica componentes y emite .gen + Main + index.
import fs from "fs";

// ── juntar beats ──────────────────────────────────────────────────────────────
let beats = JSON.parse(fs.readFileSync("_v3/pxplagas_plan.json", "utf8").replace(/^﻿/, "")).beats;
beats.sort((a, b) => a.ms_in - b.ms_in);
// recorte de solapes
for (let i = 0; i < beats.length - 1; i++) {
  if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
}
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);
// GUARD: un componente < 0.9s rompe su choreografía (interpolate no-monotónico). Pasalo a clip (aguanta cualquier dur).
for (const b of beats) if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) { b.tipo = "clip"; b.avatar = "hidden"; delete b.componente; delete b.props; }

// ── POOL curado por subjeto (clips Pexels verificados a mano en contact sheet) ──
// Relleno tras la curación (task #2). Cada sección reparte round-robin sin repetir seguido.
const POOL = {
  hook:    ["pxplagas_bottle_1", "pxplagas_house_1", "pxplagas_kitchen_1", "pxplagas_bottle_3", "pxplagas_garden_1"],
  quim:    ["pxplagas_foam_1", "pxplagas_bottle_2", "pxplagas_bottle_1", "pxplagas_water_2"],
  t1:      ["pxplagas_ants_1", "pxplagas_ants_2", "pxplagas_ants_3", "pxplagas_kitchen_2"],
  t2:      ["pxplagas_aphids_1", "pxplagas_aphids_2", "pxplagas_aphids_3", "pxplagas_pot_3"],
  t3:      ["pxplagas_pot_1", "pxplagas_pot_2", "pxplagas_pot_3", "pxplagas_aphids_2"],
  t4:      ["pxplagas_water_1", "pxplagas_water_2", "pxplagas_mosquito_1", "pxplagas_pot_1"],
  t5:      ["pxplagas_spray_2", "pxplagas_house_1", "pxplagas_house_2", "pxplagas_house_3", "pxplagas_spray_1"],
  t6:      ["pxplagas_mealy_1", "pxplagas_mealy_2", "pxplagas_pot_3", "pxplagas_aphids_3"],
  t7:      ["pxplagas_slug_1", "pxplagas_slug_2", "pxplagas_lettuce_1", "pxplagas_garden_1"],
  t8:      ["pxplagas_spidermite_1", "pxplagas_spidermite_2", "pxplagas_aphids_1", "pxplagas_pot_3"],
  t9:      ["pxplagas_fruitfly_2", "pxplagas_kitchen_1", "pxplagas_kitchen_2", "pxplagas_garden_1"],
  t10:     ["pxplagas_roach_1", "pxplagas_sink_1", "pxplagas_kitchen_2", "pxplagas_house_3"],
  t11:     ["pxplagas_pantry_1", "pxplagas_pantry_2", "pxplagas_seeds_1", "pxplagas_mealy_1"],
  hon:     ["pxplagas_house_1", "pxplagas_bottle_1", "pxplagas_garden_1", "pxplagas_spray_3"],
  seg:     ["pxplagas_bottle_1", "pxplagas_bottle_3", "pxplagas_spray_3", "pxplagas_foam_1"],
  cierre:  ["pxplagas_bottle_1", "pxplagas_house_1", "pxplagas_garden_1", "pxplagas_spray_1"],
};
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  const s = b.sec; const pool = POOL[s];
  if (!pool || !pool.length) { if (!b.clip) b.clip = "pxplagas_garden_1"; continue; }
  // si el director ya fijó un clip real del pool, respetarlo; si no, round-robin
  if (b.clip && pool.includes(b.clip) && b.clip !== lastClip) { lastClip = b.clip; continue; }
  let i = (cnt[s] = (cnt[s] || 0)) % pool.length;
  let pick = pool[i];
  if (pick === lastClip && pool.length > 1) { i = (i + 1) % pool.length; pick = pool[i]; cnt[s]++; }
  cnt[s]++;
  b.clip = pick; lastClip = pick;
}

// duraciones reales de clips (anti-congelado)
let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/pxplagas_clipdurs.json", "utf8")); } catch {}

// ── clasificación de componentes ────────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const STANDALONE = new Set(["TypeCardBeside"]);
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
// imports SOLO de lo usado (evita TS6133 noUnusedLocals)
const usedComp = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
usedComp.add("GlitchCut"); // overlays siempre
const heroAll = ["LightTrailCards", "ChapterTrailCard", "NodeRingToggle", "BottleHero", "GlitchCut", "TypeCardBeside"];
const kitAll = ["FoamClean", "GluGluPour"];
const premAll = ["BigStatReveal", "BulletCascade", "MythTruth", "FlowSteps", "VsDuel", "NumberedSteps", "BeforeAfter", "PullQuote", "ChecklistReveal", "HighlightSweep", "HookCaption", "CtaCard"];
const heroUsed = heroAll.filter((c) => usedComp.has(c));
const kitUsed = kitAll.filter((c) => usedComp.has(c));
const premUsed = premAll.filter((c) => usedComp.has(c));
const usesPremium = premUsed.length > 0;
const imp = [`import { ReactNode } from "react";`, `import { RawShot } from "./scenes/RawShot";`];
if (heroUsed.length) imp.push(`import { ${heroUsed.join(", ")} } from "../peroxide/PeroxideHero";`);
if (kitUsed.length) imp.push(`import { ${kitUsed.join(", ")} } from "../peroxide/PeroxideKit";`);
if (usesPremium) imp.push(`import { PremiumOverlay } from "./scenes/PremiumOverlay";`);
if (usesPremium) imp.push(`import { ${[...premUsed, "THEME_PEROXIDE"].join(", ")} } from "./kit/premium";`);
const genTsx = `// cues_pxplagas.gen.tsx — GENERADO por build_pxplagas.mjs. NO editar a mano.
${imp.join("\n")}

export type Cue = { key: string; start: number; dur: number; kind?: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];
`;
fs.writeFileSync("src/VideoEdit/cues_pxplagas.gen.tsx", genTsx);

const avTs = `// avatar_pxplagas.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXPLAGAS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_pxplagas.gen.ts", avTs);

const main = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxplagas.gen";
import { AVATAR_WINDOWS, TOTAL_PXPLAGAS } from "./avatar_pxplagas.gen";

// "11 Secretos con Agua Oxigenada que los Jardineros No Quieren que Sepas" (canal Agua Oxigenada, ES).
export const TOTAL_FRAMES_PXPLAGAS = Math.round(TOTAL_PXPLAGAS * 30);

export const MainPxplagas: React.FC = () => {
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
          <AvatarLayer src="pxplagas_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
fs.writeFileSync("src/VideoEdit/Main_pxplagas.tsx", main);

const idx = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxplagas, TOTAL_FRAMES_PXPLAGAS } from "./VideoEdit/Main_pxplagas";

const RootPxplagas: React.FC = () => (
  <>
    <Composition id="PxPlagas" component={MainPxplagas} durationInFrames={TOTAL_FRAMES_PXPLAGAS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxplagas);
`;
fs.writeFileSync("src/index_pxplagas.tsx", idx);

fs.writeFileSync("_pxplagas_assets.txt", [...clipsUsed].map((n) => `broll/${n}.mp4`).join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length;
const nComp = beats.filter((b) => b.tipo === "componente").length;
const nAv = beats.filter((b) => b.tipo === "avatar").length;
const compTypes = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
console.log(`beats: ${beats.length} (${nClip} clip / ${nComp} comp / ${nAv} avatar)`);
console.log(`clips únicos: ${clipsUsed.size} | comp distintos: ${compTypes.size} (${[...compTypes].join(", ")})`);
console.log(`CUES: ${cues.length} | OVERLAYS(glitch): ${overlays.length} | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ CLIPS FALTANTES (${missing.length}): ${[...new Set(missing)].slice(0, 20).join(", ")}`);
