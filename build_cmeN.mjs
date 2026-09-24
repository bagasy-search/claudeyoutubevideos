// build_cmeN.mjs — build GENÉRICO para los videos del canal Claudio energía (match_v3 + THEME_VOLT).
// Uso: node build_cmeN.mjs <slug>   (ej. cme4). Lee _v3/<slug>_beats.json + _v3/<slug>_components.json.
// Resuelve assets por subcarpeta slug (public/img/<slug>/, public/broll/<slug>/) o flat. Emite cues/Main/index por slug.
import fs from "fs";
import { execSync } from "child_process";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node build_cmeN.mjs <slug>"); process.exit(1); }
const Slug = slug.charAt(0).toUpperCase() + slug.slice(1);        // Cme4
const UP = slug.toUpperCase();                                    // CME4

const beats = JSON.parse(fs.readFileSync(`_v3/${slug}_beats.json`, "utf8").replace(/^﻿/, ""));
beats.sort((a, b) => a.ms - b.ms);

const COMP = {};
try { const ext = JSON.parse(fs.readFileSync(`_v3/${slug}_components.json`, "utf8").replace(/^﻿/, "")); for (const [k, v] of Object.entries(ext)) COMP[Number(k)] = v; } catch {}
const compIdx = new Set(Object.keys(COMP).map(Number));
const isAvFull = (i) => !compIdx.has(i) && (i % 11 === 4 || i % 11 === 5);

const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", NumberedSteps: "left", ChecklistReveal: "left", PullQuote: "center" };
const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => JSON.stringify(p || {});

const resolveAsset = (name) => {
  for (const p of [`broll/${slug}/${name}.mp4`, `broll/${name}.mp4`]) if (fs.existsSync(`public/${p}`)) return { src: p, isImg: false };
  for (const p of [`img/${slug}/${name}.png`, `img/${slug}/${name}.jpg`, `img/${name}.png`]) if (fs.existsSync(`public/${p}`)) return { src: p, isImg: true };
  return null;
};

let durs = {};
try { durs = JSON.parse(fs.readFileSync(`_v3/${slug}_clipdurs.json`, "utf8")); } catch {}

const cues = [], overlays = [], windows = [];
const clipsUsed = new Set(), imgsUsed = new Set(), missing = [];
let lastMode = null;
const usedComp = new Set();

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms);
  const nextMs = i < beats.length - 1 ? beats[i + 1].ms : b.ms + Math.round((b.dur || 4) * 1000);
  const dur = sec(Math.max(200, nextMs - b.ms));
  const key = `b_${b.ms}_${i}`;
  const mode = isAvFull(i) ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }
  if (mode === "full" && (i === 0 || !isAvFull(i - 1))) overlays.push({ key: `glitch_${b.ms}`, start: Math.max(0, start - 0.4), dur: 0.4, el: `(d) => <GlitchCut durationInFrames={d} />` });

  if (COMP[i]) {
    const [c, props] = COMP[i]; usedComp.add(c);
    const zone = ZONE[c] || "topLeft";
    cues.push({ key, start, dur, el: `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_VOLT}><${c} durationInFrames={d} theme={THEME_VOLT} {...(${jprops(props)} as any)} /></PremiumOverlay>` });
    continue;
  }
  const a = resolveAsset(b.name);
  if (!a) { missing.push(b.name); continue; }
  if (a.isImg) imgsUsed.add(a.src); else clipsUsed.add(a.src);
  const cd = !a.isImg && durs[b.name] ? ` clipDur={${(+durs[b.name]).toFixed(2)}}` : "";
  cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${a.src}" hue="cold" darken={0.08}${cd} />` });
}

let TOTAL = sec(Math.max(...beats.map((b, i) => i < beats.length - 1 ? beats[i + 1].ms : b.ms + Math.round((b.dur || 4) * 1000))));
let wavSec = 0;
try { wavSec = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 public/${slug}.wav`).toString().trim()); } catch {}
if (wavSec > TOTAL && cues.length) { const last = cues[cues.length - 1]; last.dur = +(last.dur + (wavSec - TOTAL)).toFixed(3); TOTAL = +wavSec.toFixed(3); }

const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;
const compImports = "BigStatReveal, BulletCascade, MythTruth, VsDuel, NumberedSteps, PullQuote, ChecklistReveal, HighlightSweep, HookCaption";
fs.writeFileSync(`src/VideoEdit/cues_${slug}.gen.tsx`, `// cues_${slug}.gen.tsx — GENERADO por build_cmeN.mjs. NO editar a mano.
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { GlitchCut } from "../peroxide/PeroxideHero";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { ${compImports}, THEME_VOLT } from "./kit/premium";
export type Cue = { key: string; start: number; dur: number; kind?: string; el: (d: number) => ReactNode };
export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];
export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/avatar_${slug}.gen.ts`, `// avatar_${slug}.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_${UP} = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync(`src/VideoEdit/Main_${slug}.tsx`, `import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { THEME_VOLT } from "./kit/premium";
import { CUES, OVERLAYS } from "./cues_${slug}.gen";
import { AVATAR_WINDOWS, TOTAL_${UP} } from "./avatar_${slug}.gen";
export const TOTAL_FRAMES_${UP} = Math.round(TOTAL_${UP} * 30);
export const Main${Slug}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
        {CUES.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>{cue.el(sec(cue.dur))}</Sequence>))}
        <AvatarLayer src="${slug}_opt.mp4" windows={AVATAR_WINDOWS} accent="#C8F000" />
        {OVERLAYS.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>{cue.el(sec(cue.dur))}</Sequence>))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${slug}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${Slug}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${slug}";
const Root${Slug}: React.FC = () => (<><Composition id="${Slug}" component={Main${Slug}} durationInFrames={TOTAL_FRAMES_${UP}} fps={30} width={1920} height={1080} /></>);
registerRoot(Root${Slug});
`);

const imgLines = [];
for (const src of imgsUsed) { imgLines.push(src); imgLines.push(src.replace(/\.(png|jpe?g)$/i, "_blur.jpg")); }
fs.writeFileSync(`_${slug}_assets.txt`, [...clipsUsed, ...imgLines].join("\n") + "\n");

console.log(`${slug}: beats ${beats.length} | CUES ${cues.length} | comp ${compIdx.size} (${usedComp.size} distintos) | clips ${clipsUsed.size} | imgs ${imgsUsed.size} | windows ${windows.length} | TOTAL ${TOTAL}s (${Math.round(TOTAL*30)}f, ${(TOTAL/60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ FALTAN (${missing.length}): ${missing.slice(0,12).join(", ")}`);
