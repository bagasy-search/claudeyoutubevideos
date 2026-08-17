// build_pxhvac.mjs — "9 Hydrogen Peroxide Tricks HVAC Technicians Don't Want You to Know (#6 $900)" (EN).
// B-roll = SOLO imágenes gpt-image LOW (public/img) + componentes firma. Lee _v3/pxhvac_plan.json.
// Emite cues/avatar gen + Main + index. Comp PxHvac. Clon de build_pxaire (normProps) sin POOL de clips.
import fs from "fs";

let beats = JSON.parse(fs.readFileSync("_v3/pxhvac_plan.json", "utf8").replace(/^﻿/, "")).beats;
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);
// GUARD: componente < 0.9s rompe su choreografía → pasarlo a avatar-full (nunca hueco).
for (const b of beats) if (b.tipo === "componente" && b.ms_out - b.ms_in < 900) { b.tipo = "avatar"; b.avatar = "full"; delete b.componente; delete b.props; }

// resolvedor de imagen (img/ o real/). Devuelve src o null.
const resolveImg = (name) => {
  for (const [dir, ext] of [["img", "png"], ["img", "jpg"], ["real", "png"], ["real", "jpg"]]) {
    if (fs.existsSync(`public/${dir}/${name}.${ext}`)) return `${dir}/${name}.${ext}`;
  }
  return null;
};

// ── clasificación de componentes ─────────────────────────────────────────────
const SIGNATURE = new Set(["BottleHero", "LightTrailCards", "NodeRingToggle", "ChapterTrailCard", "FoamClean", "GluGluPour"]);
const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", FlowSteps: "top", NumberedSteps: "left", ChecklistReveal: "left", BeforeAfter: "center", PullQuote: "center", CtaCard: "center" };

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };
const wrapStr = (v, key) => (typeof v === "string" ? { [key]: v } : v);
const normProps = (comp, raw) => {
  const p = { ...(raw || {}) };
  if (comp === "BigStatReveal") {
    const nums = String(p.value ?? "").match(/\d[\d.,]*/g)?.map((s) => +s.replace(/[.,]/g, "")) || [0];
    const out = { value: Math.max(...nums, 0), prefix: p.prefix || "$" };
    if (p.label) out.support = p.label;
    if (p.eyebrow) out.eyebrow = p.eyebrow;
    return out;
  }
  if (comp === "NumberedSteps") { if (Array.isArray(p.steps)) p.steps = p.steps.map((s) => wrapStr(s, "title")); return p; }
  if (comp === "FlowSteps") {
    if (Array.isArray(p.steps)) { p.nodes = p.steps.map((s) => wrapStr(s, "label")); delete p.steps; }
    if (Array.isArray(p.nodes)) p.nodes = p.nodes.map((s) => wrapStr(s, "label"));
    return p;
  }
  if (comp === "BulletCascade") { const src = p.bullets || p.items; if (Array.isArray(src)) { p.bullets = src.map((s) => wrapStr(s, "key")); delete p.items; } return p; }
  if (comp === "VsDuel") { if (p.left) p.left = wrapStr(p.left, "label"); if (p.right) { p.right = wrapStr(p.right, "label"); } return p; }
  if (comp === "HighlightSweep") { if (p.text && !p.highlight) { p.highlight = p.text; p.pre = p.pre || ""; p.post = p.post || ""; delete p.text; } return p; }
  return p;
};

// ── construir CUES / WINDOWS ──────────────────────────────────────────────────
const cues = [], overlays = [], windows = [];
let lastMode = null;
const imgsUsed = new Set();
const missing = [];

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms_in), dur = sec(b.ms_out - b.ms_in);
  const key = `${b.tipo}_${b.ms_in}`;

  // ¿imagen faltante? → tratar el beat como avatar-full (jamás hueco)
  let imgSrc = null;
  if (b.tipo === "clip") { imgSrc = resolveImg(b.clip); if (!imgSrc) { missing.push(b.clip); b.tipo = "avatar"; b.avatar = "full"; } }

  const mode = b.avatar === "full" ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }
  // glitch óptico al volver a avatar full
  if (mode === "full" && (i === 0 || beats[i - 1].avatar !== "full")) {
    overlays.push({ key: `glitch_${b.ms_in}`, start: Math.max(0, start - 0.4), dur: 0.4, el: `(d) => <GlitchCut durationInFrames={d} />` });
  }

  if (b.tipo === "avatar") continue;

  if (b.tipo === "clip") {
    imgsUsed.add(imgSrc);
    cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${imgSrc}" hue="red" darken={0.06} />` });
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

fs.writeFileSync("src/VideoEdit/cues_pxhvac.gen.tsx", `// cues_pxhvac.gen.tsx — GENERADO por build_pxhvac.mjs. NO editar a mano.
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
`);

fs.writeFileSync("src/VideoEdit/avatar_pxhvac.gen.ts", `// avatar_pxhvac.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PXHVAC = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync("src/VideoEdit/Main_pxhvac.tsx", `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_pxhvac.gen";
import { AVATAR_WINDOWS, TOTAL_PXHVAC } from "./avatar_pxhvac.gen";

// "9 Hydrogen Peroxide Tricks HVAC Technicians Don't Want You to Know" (canal EN). Imagen-first + kit premium rojo/negro/blanco.
export const TOTAL_FRAMES_PXHVAC = Math.round(TOTAL_PXHVAC * 30);

export const MainPxhvac: React.FC = () => {
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
          <AvatarLayer src="pxhvac_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
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
`);

fs.writeFileSync("src/index_pxhvac.tsx", `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxhvac, TOTAL_FRAMES_PXHVAC } from "./VideoEdit/Main_pxhvac";

const RootPxhvac: React.FC = () => (
  <>
    <Composition id="PxHvac" component={MainPxhvac} durationInFrames={TOTAL_FRAMES_PXHVAC} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxhvac);
`);

// assets para el farm: imágenes usadas + sus _blur.jpg
const imgLines = [];
for (const src of imgsUsed) { imgLines.push(src); imgLines.push(src.replace(/\.(png|jpe?g)$/i, "_blur.jpg")); }
// imágenes de componentes (CtaCard) + su blur
for (const b of beats) if (b.componente === "CtaCard" && b.props?.image) { imgLines.push(`img/${b.props.image}.png`); imgLines.push(`img/${b.props.image}_blur.jpg`); }
fs.writeFileSync("_pxhvac_assets.txt", [...new Set(imgLines)].join("\n") + "\n");

const nA = beats.filter((b) => b.tipo === "avatar").length, nI = beats.filter((b) => b.tipo === "clip").length, nC = beats.filter((b) => b.tipo === "componente").length;
console.log(`beats: ${beats.length} (${nA} avatar / ${nI} imagen / ${nC} componente) | imgs únicas: ${imgsUsed.size}`);
console.log(`CUES: ${cues.length} | OVERLAYS: ${overlays.length} | windows: ${windows.length} | TOTAL: ${TOTAL}s (${(TOTAL / 60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ IMG FALTANTES (${missing.length}→avatar): ${[...new Set(missing)].slice(0, 30).join(", ")}`);
