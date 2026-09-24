// build_cme2.mjs — arma el video 2 (panel solar más barato, canal Claudio energía) desde _v3/cme2_beats.json.
// Flujo match_v3 (assets ya en public/broll + public/img). Kit premium reskin THEME_VOLT (negro + verde-voltio).
// Tileo contiguo, ventanas de avatar heurísticas, 9 componentes del kit inyectados por índice (historia panel $49 / Ernesto).
import fs from "fs";
import { execSync } from "child_process";

const beats = JSON.parse(fs.readFileSync("_v3/cme2_beats.json", "utf8").replace(/^﻿/, ""));
beats.sort((a, b) => a.ms - b.ms);

// ── componentes inyectados por índice (arco de la historia) ──────────────────────
const COMP = {
  0:   ["HookCaption", { words: [{ text: "Compré el panel" }, { text: "MÁS BARATO", boxed: true }, { text: "de internet" }, { text: "¿bajó la factura?", boxed: true }], sub: "lo medí con la pinza, con Ernesto mirando" }],
  22:  ["BigStatReveal", { eyebrow: "Lo que pagué", value: 49, prefix: "$", support: "el panel solar más barato que encontré" }],
  40:  ["MythTruth", { mythLabel: "Ernesto", truthLabel: "La pinza", myth: "Eso no te baja ni un centavo", truth: "Sí baja la factura, con límites" }],
  62:  ["NumberedSteps", { eyebrow: "Cómo se conecta", title: "En 4 pasos", steps: [{ title: "Panel al sol" }, { title: "Al controlador de carga" }, { title: "A la batería" }, { title: "Enchufás y listo" }] }],
  85:  ["BulletCascade", { eyebrow: "Qué mueve de verdad", bullets: [{ pre: "Luces LED,", key: "toda la casa" }, { pre: "Wifi y", key: "los teléfonos" }, { pre: "NO", key: "la heladera ni el aire" }] }],
  105: ["ChecklistReveal", { kicker: "Para no tirar la plata", title: "Antes de comprar, fijate", items: ["Controlador de carga incluido", "Potencia real en watts", "Que no arruine la batería", "Opiniones reales, no pagadas"], stamp: "OK" }],
  125: ["VsDuel", { eyebrow: "La diferencia que importa", title: "Con o sin controlador", left: { label: "Sin controlador", sub: "batería muerta en 1 semana", good: false }, right: { label: "Con controlador", sub: "batería sana por años", good: true } }],
  150: ["HighlightSweep", { pre: "La factura bajó", highlight: "y Ernesto perdió la apuesta", post: ".", note: "diez dólares, mirando la pinza" }],
  170: ["PullQuote", { quote: "Eso es un cachivache chino, no te baja ni un centavo", author: "Ernesto", role: "el vecino escéptico" }],
  183: ["HighlightSweep", { pre: "Te dejo el kit con controlador", highlight: "en la descripción", post: "", note: "suscribite: acá se mide todo con la pinza" }],
};
// merge de componentes autorados por el DIRECTOR (agentes) si existe
try {
  const ext = JSON.parse(fs.readFileSync("_v3/cme2_components.json", "utf8").replace(/^﻿/, ""));
  for (const [k, v] of Object.entries(ext)) COMP[Number(k)] = v;  // [comp, props]
  console.log("↳ merge componentes externos:", Object.keys(ext).length);
} catch {}
const compIdx = new Set(Object.keys(COMP).map(Number));

// avatar full: ~2 de cada 11 beats, evitando los beats de componente
const isAvFull = (i) => !compIdx.has(i) && (i % 11 === 4 || i % 11 === 5);

const PREMIUM = new Set(["BigStatReveal", "MythTruth", "HighlightSweep", "BulletCascade", "HookCaption", "VsDuel", "FlowSteps", "NumberedSteps", "ChecklistReveal", "BeforeAfter", "PullQuote", "CtaCard"]);
const ZONE = { BigStatReveal: "topLeft", MythTruth: "topLeft", HighlightSweep: "top", BulletCascade: "left", HookCaption: "center", VsDuel: "left", NumberedSteps: "left", ChecklistReveal: "left", PullQuote: "center" };

const resolveAsset = (name) => {
  if (fs.existsSync(`public/broll/${name}.mp4`)) return { src: `broll/${name}.mp4`, isImg: false };
  for (const [dir, ext] of [["img", "png"], ["img", "jpg"], ["real", "png"], ["real", "jpg"]]) {
    if (fs.existsSync(`public/${dir}/${name}.${ext}`)) return { src: `${dir}/${name}.${ext}`, isImg: true };
  }
  return null;
};

let durs = {};
try { durs = JSON.parse(fs.readFileSync("_v3/cme2_clipdurs.json", "utf8")); } catch {}

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => JSON.stringify(p || {});

const cues = [], overlays = [], windows = [];
const clipsUsed = new Set(), imgsUsed = new Set(), missing = [];
let lastMode = null;

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = sec(b.ms);
  const nextMs = i < beats.length - 1 ? beats[i + 1].ms : b.ms + Math.round((b.dur || 4) * 1000);
  const dur = sec(Math.max(200, nextMs - b.ms));
  const key = `b_${b.ms}_${i}`;

  const mode = isAvFull(i) ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }
  if (mode === "full" && (i === 0 || !isAvFull(i - 1))) {
    overlays.push({ key: `glitch_${b.ms}`, start: Math.max(0, start - 0.4), dur: 0.4, el: `(d) => <GlitchCut durationInFrames={d} />` });
  }

  if (COMP[i]) {
    const [c, props] = COMP[i];
    const zone = ZONE[c] || "topLeft";
    cues.push({ key, start, dur, el: `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_VOLT}><${c} durationInFrames={d} theme={THEME_VOLT} {...(${jprops(props)} as any)} /></PremiumOverlay>` });
    continue;
  }
  const a = resolveAsset(b.name);
  if (!a) { missing.push(b.name); continue; }
  if (a.isImg) imgsUsed.add(a.src); else clipsUsed.add(b.name);
  const cd = !a.isImg && durs[b.name] ? ` clipDur={${(+durs[b.name]).toFixed(2)}}` : "";
  cues.push({ key, start, dur, el: `(d) => <RawShot durationInFrames={d} src="${a.src}" hue="cold" darken={0.08}${cd} />` });
}

let TOTAL = sec(Math.max(...beats.map((b, i) => i < beats.length - 1 ? beats[i + 1].ms : b.ms + Math.round((b.dur || 4) * 1000))));
// duración >= largo del wav del avatar (no cortar la última frase); extender el último cue si hace falta
let wavSec = 0;
try { wavSec = parseFloat(execSync('ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 public/cme2.wav').toString().trim()); } catch {}
if (wavSec > TOTAL && cues.length) {
  const last = cues[cues.length - 1];
  last.dur = +(last.dur + (wavSec - TOTAL)).toFixed(3);
  TOTAL = +wavSec.toFixed(3);
}
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

fs.writeFileSync("src/VideoEdit/cues_cme2.gen.tsx", `// cues_cme2.gen.tsx — GENERADO por build_cme2.mjs. NO editar a mano.
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { GlitchCut } from "../peroxide/PeroxideHero";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { BigStatReveal, BulletCascade, MythTruth, VsDuel, NumberedSteps, PullQuote, ChecklistReveal, HighlightSweep, HookCaption, THEME_VOLT } from "./kit/premium";

export type Cue = { key: string; start: number; dur: number; kind?: string; el: (d: number) => ReactNode };
export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];
export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];
`);

fs.writeFileSync("src/VideoEdit/avatar_cme2.gen.ts", `// avatar_cme2.gen.ts — GENERADO. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CME2 = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

fs.writeFileSync("src/VideoEdit/Main_cme2.tsx", `import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { THEME_VOLT } from "./kit/premium";
import { CUES, OVERLAYS } from "./cues_cme2.gen";
import { AVATAR_WINDOWS, TOTAL_CME2 } from "./avatar_cme2.gen";

// Video 2 canal Claudio energía — "Panel solar más barato" (ES). Footage-first + kit premium VOLT (negro/verde-voltio).
export const TOTAL_FRAMES_CME2 = Math.round(TOTAL_CME2 * 30);

export const MainCme2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}
        <AvatarLayer src="cme2_opt.mp4" windows={AVATAR_WINDOWS} accent="#C8F000" />
        {OVERLAYS.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
`);

fs.writeFileSync("src/index_cme2.tsx", `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme2, TOTAL_FRAMES_CME2 } from "./VideoEdit/Main_cme2";
const RootCme2: React.FC = () => (
  <><Composition id="Cme2" component={MainCme2} durationInFrames={TOTAL_FRAMES_CME2} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootCme2);
`);

const imgLines = [];
for (const src of imgsUsed) { imgLines.push(src); imgLines.push(src.replace(/\.(png|jpe?g)$/i, "_blur.jpg")); }
fs.writeFileSync("_cme2_assets.txt", [...[...clipsUsed].map((n) => `broll/${n}.mp4`), ...imgLines].join("\n") + "\n");

console.log(`beats: ${beats.length} | CUES: ${cues.length} | componentes: ${compIdx.size} (${[...new Set(Object.values(COMP).map(c=>c[0]))].length} distintos) | clips: ${clipsUsed.size} | imgs: ${imgsUsed.size} | windows: ${windows.length}`);
console.log(`TOTAL: ${TOTAL}s (${Math.round(TOTAL*30)} frames, ${(TOTAL/60).toFixed(1)}min)`);
if (missing.length) console.log(`⚠️ FALTAN assets (${missing.length}): ${missing.slice(0,15).join(", ")}`);
