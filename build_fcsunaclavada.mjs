// build_fcsunaclavada.mjs — clonado de build_fcsaspirina2.mjs (molde fcsmanos10 + addendum densidad).
// Lee _v3/fcsunaclavada_plan.json y escribe:
//   src/VideoEdit/cues_fcsunaclavada.gen.tsx      (fuente de verdad del density_gate)
//   src/_fed6/VideoEdit/Main_fcsunaclavada.tsx    (build que lee el density_gate)
//   src/_fed6/VideoEdit/avatar_fcsunaclavada.gen.ts (ventanas de avatar full, para el gate)
//   src/index_fcsunaclavada.tsx
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fcsunaclavada", COMP = "Fcsunaclavada", UP = "FCSUNACLAVADA", FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, e) => { try { return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE}`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const beats = plan.beats.slice().sort((a, b) => a.ms_in - b.ms_in);
const overlays = (plan.overlays || []).slice().sort((a, b) => a.ms_in - b.ms_in);
const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(plan.totalMs / 1000, WAV_S + 0.5);
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);

const assets = new Set([WAV_FILE]);
const faltan = [];
const scan = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) { if (existe(v)) assets.add(v); else faltan.push(v); } return; }
  if (Array.isArray(v)) return v.forEach(scan);
  if (v && typeof v === "object") Object.values(v).forEach(scan);
};

const rows = beats.map((b) => ({ ...b, f0: F(b.ms_in / 1000), f1: F(b.ms_out / 1000) }));
rows[0].f0 = 0;
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

// tags del kit premium de _fed6 que este build sabe instanciar (JSX DIRECTO: el density_gate
// cuenta por NOMBRE DE TAG, una función-dispatch le sería invisible).
const CON_THEME = new Set(["HookCaption", "PullQuote", "ChapterTitle", "NumberedSteps", "ChecklistReveal",
  "BulletCascade", "MythTruth", "CutawayCallouts", "FlowSteps", "CycleLoop", "LayerStack", "BigStatReveal",
  "StatGrid", "RankBars", "GaugeDial", "DonutPercent", "VsDuel", "DuelColumns", "TierRanking",
  "TimelinePlayhead", "SplitPanel", "FramedPhoto", "PhotoCarousel", "CtaCard", "StampBadge",
  "CornerEyebrow", "LowerThirdId", "HighlightSweep"]);

let avLargos = 0;
const sinCama = [];
const cues = [];
const avatarWins = [];
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS, key = `${b.tipo}_${b.f0}`;
  if (b.tipo === "avatar") {
    scan(b.clip);
    if (!b.clip) { console.error(`⛔ avatar sin clip @${start.toFixed(1)}s`); process.exit(1); }
    const cd = durDe(b.clip);
    if (cd && dur > cd + 0.2) { avLargos++; console.error(`   avatar ${b.clip} dura ${dur.toFixed(2)}s y el clip da ${cd.toFixed(2)}s`); }
    avatarWins.push({ start: +start.toFixed(2), mode: "full" });
    cues.push({ key, start, dur, el: `(d) => <AvatarClip src=${JSON.stringify(b.clip)} seed={${b.f0}} />` });
  } else if (b.tipo === "clip") {
    scan(b.src);
    const frames = Math.floor(durDe(b.src) * FPS) - 1 || 120;
    if (frames < 15 && !process.env.SKIP_ASSETS) { console.error(`⛔ clip ${b.src} con solo ${frames} cuadros`); process.exit(1); }
    avatarWins.push({ start: +start.toFixed(2), mode: "broll" });
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(b.src)} seed={${b.f0}} frames={${frames}} />` });
  } else if (b.tipo === "imagen") {
    scan(b.src);
    avatarWins.push({ start: +start.toFixed(2), mode: "broll" });
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(b.src)} seed={${b.f0}} />` });
  } else if (b.tipo === "componente") {
    avatarWins.push({ start: +start.toFixed(2), mode: "broll" });
    if (b.componente === "FedWhiteboard") {
      cues.push({ key, start, dur, el: `(d) => <FedWhiteboard scene={SCENE_UNA_MEC} />` });
      continue;
    }
    if (!CON_THEME.has(b.componente)) { console.error(`⛔ componente desconocido: ${b.componente}`); process.exit(1); }
    const props = b.props || {};
    scan(props);
    // ── LA CAMA. En el kit _fed6 `Panel`/`Cinema` NO pintan placa opaca: tratan el FOOTAGE.
    // Un componente sin nada debajo trata el vacío y da NEGRO (medido: este video entregado
    // tenía 57 tramos negros, los 57 en el arranque de un cue de componente).
    // ⛔ FALLO DURO: el molde sólo advertía y seguía, y por eso salió defectuoso.
    // FedWhiteboard ya salió por `continue` más arriba: es la ÚNICA excepción legítima
    // (pinta su propia placa opaca, medido YAVG 204/211). Todo lo demás lleva cama.
    if (!props.bed) sinCama.push(`${b.componente} @${start.toFixed(1)}s`);
    else if (!existe(props.bed)) sinCama.push(`${b.componente} @${start.toFixed(1)}s (falta ${props.bed})`);
    const { bed, ...restoProps } = props;
    const propsCode = JSON.stringify(restoProps);
    const camaJsx = bed ? `<PhotoBed src=${JSON.stringify(bed)} />` : "";
    cues.push({ key, start, dur, el: `(d) => <>${camaJsx}<${b.componente} durationInFrames={d} theme={THEME_MEDICO} {...(${propsCode} as any)} /></>` });
  } else { console.error(`⛔ tipo desconocido: ${b.tipo}`); process.exit(1); }
}
const ov = overlays.map((o) => {
  scan(o.props);
  const f0 = F(o.ms_in / 1000); let f1 = F(o.ms_out / 1000); if (f1 <= f0) f1 = f0 + F(2);
  return { key: `ov_${f0}`, start: f0 / FPS, dur: (f1 - f0) / FPS, el: `(d) => <${o.componente} durationInFrames={d} theme={THEME_MEDICO} {...(${JSON.stringify(o.props)} as any)} />` };
});

if (sinCama.length) {
  console.error(`⛔ ${sinCama.length} cues de componente SIN CAMA (props.bed). Cada uno es un tramo negro:`);
  sinCama.slice(0, 12).forEach((x) => console.error("   " + x));
  console.error("   → corré: node scripts/gen_beds.mjs fcsunaclavada");
  process.exit(1);
}
if (faltan.length && !process.env.SKIP_ASSETS) { console.error(`⛔ ${new Set(faltan).size} assets faltan (primeros 5):`); [...new Set(faltan)].slice(0, 5).forEach((x) => console.error("   " + x)); process.exit(1); }
if (avLargos && !process.env.SKIP_ASSETS) { console.error(`⛔ ${avLargos} ventanas de avatar duran más que su clip`); process.exit(1); }

// cobertura 100% + apertura con avatar
{
  const cov = new Uint8Array(TOTAL_FRAMES);
  for (const r of rows) for (let x = r.f0; x < Math.min(TOTAL_FRAMES, r.f1); x++) cov[x] = 1;
  const sin = cov.length - cov.reduce((a, b) => a + b, 0);
  if (sin > 0 && !process.env.SKIP_ASSETS) { console.error(`⛔ ${sin} frames SIN plano`); process.exit(1); }
  if (rows[0].tipo !== "avatar") { console.error("⛔ el video no abre con el avatar"); process.exit(1); }
  if (rows[0].f1 < F(2)) { console.error("⛔ la apertura con avatar dura menos de 2s"); process.exit(1); }
  console.log(`cobertura ✓ 100% de ${TOTAL_FRAMES} frames`);
}
{
  const d = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(d.length * p)];
  console.log(`pacing · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · máx ${d[d.length - 1].toFixed(1)}s`);
}
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  if (process.env.SKIP_ASSETS) { console.log("SKIP_ASSETS: sin chequeo de fps/aspecto"); } else {
  const malos = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
  if (malos.length) { console.error(`⛔ ${malos.length} videos no están a 30/1 (primeros 5):`); malos.slice(0, 5).forEach((x) => console.error("   " + x + " " + probe(x, "r_frame_rate"))); process.exit(1); }
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/.test(a));
  const malas = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return w && h && Math.abs(w / h - 16 / 9) > 0.06; });
  if (malas.length) { console.error(`⛔ ${malas.length} imágenes no son 16:9 (primeras 5):`); malas.slice(0, 5).forEach((x) => console.error("   " + x)); process.exit(1); }
  console.log(`fps ✓ ${vids.length} videos a 30/1 · aspecto ✓ ${imgs.length} imágenes 16:9`);
  }
}

fs.mkdirSync("src/_fed6/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AvatarClip, Clip, Foto } from "../${SLUG}/Piezas";
import {
  THEME_MEDICO, HookCaption, PullQuote, ChapterTitle, NumberedSteps, ChecklistReveal, BulletCascade,
  MythTruth, CutawayCallouts, FlowSteps, CycleLoop, LayerStack, BigStatReveal, StatGrid, RankBars,
  GaugeDial, DonutPercent, VsDuel, DuelColumns, TierRanking, TimelinePlayhead, SplitPanel,
  FramedPhoto, PhotoCarousel, CtaCard, StampBadge, CornerEyebrow, LowerThirdId, HighlightSweep,
} from "../_fed6/VideoEdit/kit/premium";
import { PhotoBed } from "../_fed6/VideoEdit/scenes/PhotoBed";
import FedWhiteboard from "../FedWhiteboard";
import { SCENE_UNA_MEC } from "../${SLUG}/WhiteboardScene";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };
export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
export const OVERLAYS: Cue[] = [
${ov.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/_fed6/VideoEdit/avatar_${SLUG}.gen.ts`,
`// avatar_${SLUG}.gen.ts — GENERADO. Ventanas para scripts/density_gate.mjs.
export const WINDOWS_${UP} = ${JSON.stringify(avatarWins, null, 1)};
`);

fs.writeFileSync(`src/_fed6/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "../../VideoEdit/cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#08110F" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={F(c.start)} durationInFrames={Math.max(1, F(c.dur))} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, F(c.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("${WAV_FILE}")} />
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./_fed6/VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

{
  const files = [`src/_fed6/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `src/${SLUG}/Piezas.tsx`];
  const malos = files.filter((f) => fs.existsSync(f) && fs.readFileSync(f, "utf8").split("\n").filter((L) => !/^\s*(\/\/|\*|\/\*)/.test(L)).join("\n").match(/<Video[\s>]/));
  if (malos.length) { console.error("⛔ <Video> legacy en:", malos); process.exit(1); }
}

const lista = [];
for (const a of [...assets].sort()) {
  lista.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) { const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"); if (existe(b)) lista.push(b); }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");
// _v3/<slug>_cues.json: lo exige agnes_qc (medición de repetición y de loops de la capa base).
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(rows
  .filter((b) => b.tipo === "clip" || b.tipo === "imagen" || b.tipo === "avatar")
  .map((b) => ({ key: `${b.tipo}_${b.f0}`, src: b.src || b.clip, start: b.f0 / FPS, dur: (b.f1 - b.f0) / FPS })), null, 0));
const porTipo = {}; for (const b of rows) porTipo[b.tipo] = (porTipo[b.tipo] || 0) + 1;
const comps = {}; for (const b of rows) if (b.tipo === "componente") comps[b.componente] = (comps[b.componente] || 0) + 1;
console.log(`cues ${cues.length} · overlays ${ov.length} · ${JSON.stringify(porTipo)}`);
console.log(`componentes distintos ${Object.keys(comps).length}`);
console.log(`assets ${assets.size} (+blur ${lista.length}) · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_S / 60).toFixed(2)} min`);
