// build_pxpest.mjs — "11 Hydrogen Peroxide Secrets Exterminators Don't Want You to Know" (EN).
// Clon de build_pxgarden.mjs. B-ROLL = SOLO imágenes gpt-image-2 LOW: el POOL mapea sección → IMÁGENES
// (pxpest_<sec>_N) y los beats "clip" se renderizan como RawShot de foto (Ken-Burns). Comp PxPest.
import fs from "fs";

let beats = JSON.parse(fs.readFileSync("_v3/pxpest_plan.json", "utf8").replace(/^﻿/, "")).beats;
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);
// GUARD: componente < 0.9s rompe su choreografía → pasarlo a clip (RawShot aguanta cualquier dur).
for (const b of beats) if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) { b.tipo = "clip"; b.avatar = "hidden"; delete b.componente; delete b.props; }

// ── POOL curado por SECCIÓN — IMÁGENES gpt-image-2 LOW (public/img/pxpest_*.png) ──────
const POOL = {
  hook:    ["pxpest_hook_1", "pxpest_hook_5", "pxpest_hook_3", "pxpest_hook_2", "pxpest_hook_4"],
  quim:    ["pxpest_quim_1", "pxpest_quim_2", "pxpest_quim_3", "pxpest_quim_4"],
  t1:      ["pxpest_t1_1", "pxpest_t1_2", "pxpest_t1_3", "pxpest_t1_4", "pxpest_t1_5"],
  t2:      ["pxpest_t2_1", "pxpest_t2_2", "pxpest_t2_3", "pxpest_t2_4"],
  t3:      ["pxpest_t3_1", "pxpest_t3_2", "pxpest_t3_3", "pxpest_t3_4"],
  t4:      ["pxpest_t4_1", "pxpest_t4_2", "pxpest_t4_3", "pxpest_t4_4"],
  t5:      ["pxpest_t5_1", "pxpest_t5_2", "pxpest_t5_3", "pxpest_t5_4", "pxpest_t5_5", "pxpest_t5_6"],
  t6:      ["pxpest_t6_1", "pxpest_t6_2", "pxpest_t6_3"],
  t7:      ["pxpest_t7_1", "pxpest_t7_2", "pxpest_t7_3"],
  t8:      ["pxpest_t8_1", "pxpest_t8_2", "pxpest_t8_3", "pxpest_t8_4"],
  t9:      ["pxpest_t9_1", "pxpest_t9_2", "pxpest_t9_3", "pxpest_t9_4"],
  t10:     ["pxpest_t10_1", "pxpest_t10_2", "pxpest_t10_3"],
  t11:     ["pxpest_t11_1", "pxpest_t11_2", "pxpest_t11_3", "pxpest_t11_4"],
  honesty: ["pxpest_honesty_1", "pxpest_honesty_2", "pxpest_honesty_3"],
  safety:  ["pxpest_safety_1", "pxpest_safety_2", "pxpest_safety_3"],
  secret:  ["pxpest_secret_1", "pxpest_secret_2"],
  cta:     ["pxpest_cta_1", "pxpest_cta_2", "pxpest_cta_proof1", "pxpest_cta_proof2"],
  cierre:  ["pxpest_cierre_1", "pxpest_cierre_2", "pxpest_cierre_3"],
};
const cnt = {}; let lastClip = null;
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  const pool = POOL[b.sec];
  if (!pool || !pool.length) { if (!b.clip) b.clip = "pxpest_hook_1"; continue; }
  let i = (cnt[b.sec] = (cnt[b.sec] || 0)) % pool.length;
  let pick = pool[i];
  if (pick === lastClip && pool.length > 1) { i = (i + 1) % pool.length; pick = pool[i]; cnt[b.sec]++; }
  cnt[b.sec]++;
  b.clip = pick; lastClip = pick;
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
const SFXMAP = {
  BigStatReveal: { accent: "coin_soft" }, ChapterTrailCard: { enter: "card_slide", accent: "ding_soft" },
  LightTrailCards: { accent: "sparkle" }, NodeRingToggle: { accent: "shimmer" }, BottleHero: { accent: "pop_soft" },
  FoamClean: { accent: "foam" }, GluGluPour: { accent: "pour_soft" }, MythTruth: { accent: "confirm" },
  FlowSteps: { accent: "success" }, NumberedSteps: { accent: "tick" }, ChecklistReveal: { accent: "tick" },
  HighlightSweep: { accent: "swish" }, HookCaption: { accent: "pop_soft" }, CtaCard: { accent: "chime" },
  VsDuel: { accent: "confirm" },
};
const sfxCues = [];
function addSfx(startSec, role, fallback, vol = 0.4, at = 0) {
  const src = pick(role, fallback); if (!src) return;
  sfxCues.push({ start: +(startSec + at).toFixed(3), src, vol });
}

// ── clasificación de componentes ──────────────────────────────────────────────
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "center", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "full" };

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

const cues = [], overlays = [], windows = [];
let lastMode = null, clipEntryCtr = 0;
const imgsUsed = new Set(), missing = [];

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
    // b-roll = IMAGEN gpt-image (Ken-Burns). src = img/<name>.png
    const name = b.clip; const src = `img/${name}.png`; imgsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${src}" hue="red" darken={0.06} />` });
    if (clipEntryCtr++ % 3 === 0) addSfx(start, "swish", "whoosh_soft", 0.3);
  } else if (b.tipo === "imagen") {
    const src = b.img; imgsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    const isQR = /qrcard/.test(src);
    const zoomAttr = isQR ? ` zoom={[1,1] as [number,number]}` : "";
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${src}" hue="red" darken={${isQR ? 0 : 0.04}}${zoomAttr} />` });
    addSfx(start, "success", isQR ? "chime" : "whoosh_soft", 0.42);
  } else if (b.tipo === "componente") {
    const c = b.componente, props = jprops(b.props);
    let el;
    if (PREMIUM.has(c)) { const zone = ZONE[c] || "topLeft"; el = `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_PEROXIDE}><${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${props} as any)} /></PremiumOverlay>`; }
    else el = `(d) => <${c} durationInFrames={d} {...(${props} as any)} />`;
    cues.push({ key, start, dur, el });
    const m = SFXMAP[c] || {};
    addSfx(start, m.enter || "whoosh_soft", "transition", 0.34);
    if (m.accent) addSfx(start, m.accent, "ding_soft", 0.42, 0.45);
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

const genTsx = `// cues_pxpest.gen.tsx — GENERADO por build_pxpest.mjs. NO editar a mano.
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
fs.writeFileSync("src/VideoEdit/cues_pxpest.gen.tsx", genTsx);

fs.writeFileSync("src/VideoEdit/avatar_pxpest.gen.ts", `// avatar_pxpest.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXPEST = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const main = `import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS, SFXCUES } from "./cues_pxpest.gen";
import { AVATAR_WINDOWS, TOTAL_PXPEST } from "./avatar_pxpest.gen";

// "11 Hydrogen Peroxide Secrets Exterminators Don't Want You to Know" (canal Agua Oxigenada EN, plagas).
export const TOTAL_FRAMES_PXPEST = Math.round(TOTAL_PXPEST * 30);

export const MainPxpest: React.FC = () => {
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
          <AvatarLayer src="pxpest_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
fs.writeFileSync("src/VideoEdit/Main_pxpest.tsx", main);

fs.writeFileSync("src/index_pxpest.tsx", `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxpest, TOTAL_FRAMES_PXPEST } from "./VideoEdit/Main_pxpest";
const RootPxpest: React.FC = () => (
  <><Composition id="PxPest" component={MainPxpest} durationInFrames={TOTAL_FRAMES_PXPEST} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootPxpest);
`);

// imágenes embebidas en props de componentes (VsDuel left/right.image, CtaCard.image, etc.)
for (const b of beats) {
  if (b.tipo !== "componente" || !b.props) continue;
  for (const m of JSON.stringify(b.props).matchAll(/"(img\/[^"]+\.(?:png|jpg|jpeg))"/gi)) { imgsUsed.add(m[1]); if (!fs.existsSync(`public/${m[1]}`)) missing.push(m[1]); }
}
// assets list: imgs (+ _blur) + SFX usados
const assets = [...[...imgsUsed], ...[...imgsUsed].map((s) => s.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg")), ...[...usedSfx]];
fs.writeFileSync("_pxpest_assets.txt", assets.join("\n") + "\n");

const nClip = beats.filter((b) => b.tipo === "clip").length, nComp = beats.filter((b) => b.tipo === "componente").length, nAv = beats.filter((b) => b.tipo === "avatar").length, nImg = beats.filter((b) => b.tipo === "imagen").length;
const compTypes = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
console.log(`beats: ${beats.length} (${nClip} clip-img / ${nComp} comp / ${nAv} avatar / ${nImg} img-anchor)`);
console.log(`imgs únicas: ${imgsUsed.size} | comp distintos: ${compTypes.size} (${[...compTypes].join(", ")})`);
console.log(`CUES: ${cues.length} | OVERLAYS: ${overlays.length} | SFX cues: ${sfxCues.length} (${usedSfx.size} archivos) | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL * 30)} frames, ${(TOTAL / 60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ FALTANTES (${missing.length}): ${[...new Set(missing)].slice(0, 30).join(", ")}`);
