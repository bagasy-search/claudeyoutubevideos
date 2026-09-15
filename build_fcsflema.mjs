// build_fcsflema.mjs — genera cues_fcsflema.gen.tsx + Main_fcsflema.tsx + index_fcsflema.tsx + assets.
// Arquitectura: avatar en 21 ventanas (InfiniteTalk 832x464, colocado por avStart), resto 100% cubierto
// por clip/foto/componente. UN <Audio> master. OffthreadVideo siempre. Ken-Burns aleatorio.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "fcsflema";
const FPS = 30;
const F = (s) => Math.round(s * FPS);
const J = (v) => JSON.stringify(v);

const M = JSON.parse(fs.readFileSync("_v3/fcsflema_moments.json", "utf8"));
const plan = fs.readFileSync("_v3/fcsflema_plan_full.jsonl", "utf8").trim().split("\n").map((l) => JSON.parse(l));
const byI = {}; plan.forEach((p) => (byI[p.i] = p));
const segs = JSON.parse(fs.readFileSync("_v3/fcsflema_avatar_segs.json", "utf8"));
const TOTAL_S = M[M.length - 1].end;

const N = (i) => String(i).padStart(3, "0");
const exists = (p) => fs.existsSync(p);
const ffprobeFrames = (p) => {
  try {
    const r = execFileSync("ffprobe", ["-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", p]).toString().trim();
    const n = parseInt((r.match(/\d+/) || [0])[0], 10);
    return n > 1 ? n : 0;
  } catch { return 0; }
};
const AVATAR_SRC = `${SLUG}_avatar.mp4`; // se copia a public/

// --- resolver asset por momento ---
// devuelve {kind:"avatar"|"clip"|"foto"|"comp", src?, frames?, poster?}
const IMG = (i) => `img/${SLUG}_${N(i)}.png`;
const CLIP = (i) => `broll/${SLUG}_${N(i)}.mp4`;
const STJPG = (i) => `broll/${SLUG}_${N(i)}.jpg`;
const POSTER = (i) => `broll/${SLUG}_${N(i)}_poster.jpg`;

function heroPng(i) { return exists(`public/${IMG(i)}`) ? IMG(i) : null; }
function stockClip(i) { return exists(`public/${CLIP(i)}`) ? CLIP(i) : null; }
function stockJpg(i) { return exists(`public/${STJPG(i)}`) ? STJPG(i) : null; }

// poster de un clip (para usar de cama). Se genera una vez.
function ensurePoster(i) {
  const c = `public/${CLIP(i)}`, out = `public/${POSTER(i)}`;
  if (exists(out)) return POSTER(i);
  if (!exists(c)) return null;
  try {
    const d = M[i] ? M[i].dur : 4;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.min(1.2, d * 0.35)), "-i", c, "-frames:v", "1", "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720", out]);
    return POSTER(i);
  } catch { return null; }
}

// imagen "camable" para un momento (hero > stock jpg > poster de su clip)
function bedFor(i) {
  return heroPng(i) || stockJpg(i) || (stockClip(i) ? ensurePoster(i) : null);
}
// cama para un componente: la del momento vecino más cercano
function nearestBed(i) {
  for (let d = 0; d <= 8; d++) {
    for (const j of [i - d, i + d]) {
      if (j < 0 || j >= M.length) continue;
      const p = byI[j];
      if (!p) continue;
      if (p.t === "img" || p.t === "stock") { const b = bedFor(j); if (b) return b; }
    }
  }
  return null;
}

// avStart para un momento de avatar
function avStartFor(m) {
  const w = segs.find((s) => m.start >= s.vidStart - 0.05 && m.start < s.vidEnd + 0.05) || segs.find((s) => Math.abs(s.vidStart - m.start) < 0.5);
  if (!w) return 0;
  return +(w.avStart + (m.start - w.vidStart)).toFixed(3);
}

// --- construir cues (frame-aligned, sin huecos de 1 frame) ---
const raw = []; // {start,dur,jsx, split:boolean}
const missing = [];

function compJSX(comp, txt, bed, seed) {
  const b = bed ? J(bed) : "undefined";
  const t = J(txt || "");
  switch (comp) {
    case "titulo": return `<Chapter title={${t}} bed={${b}} seed={${seed}} />`;
    case "frase": case "frasecinetica": return `<Frase text={${t}} bed={${b}} seed={${seed}} />`;
    case "stat": case "stat3": return `<Stat text={${t}} bed={${b}} seed={${seed}} />`;
    case "mito": return `<MitoVerdad text={${t}} bed={${b}} seed={${seed}} />`;
    case "mitoverdad": return `<MitoVerdad text={${t}} verdad={true} bed={${b}} seed={${seed}} />`;
    case "checklist": return `<Checklist items={${J((txt || "").split(/\s{2,}|\s·\s/).filter(Boolean))}} bed={${b}} seed={${seed}} />`;
    case "diagrama": case "diagrama_moco": case "diagrama_moco_atrapa": case "diagrama_cilios": case "diagrama_cilios_mueven": case "diagrama_cilios_empujan": case "diagrama_escalera": case "reveal_secreto": case "flecha_arriba":
      return `<Pizarra text={${t}} bed={${b}} seed={${seed}} />`;
    case "circulo": return `<Circulo text={${t}} bed={${b}} seed={${seed}} />`;
    case "alerta": return `<Alerta text={${t}} bed={${b}} seed={${seed}} />`;
    case "alerta_panel": case "alerta_teaser": return `<Alerta text={${t}} panel={true} bed={${b}} seed={${seed}} />`;
    case "cta": return `<Cta text={${t}} bed={${b}} seed={${seed}} />`;
    case "split_dos": return `<SplitDos text={${t}} bed={${b}} seed={${seed}} />`;
    default: return `<Frase text={${t}} bed={${b}} seed={${seed}} />`;
  }
}

for (let i = 0; i < M.length; i++) {
  const m = M[i], p = byI[i];
  const seed = F(m.start);
  if (p.t === "avatar") {
    raw.push({ start: m.start, dur: m.dur, jsx: `<AvatarWin src={${J(AVATAR_SRC)}} startFrom={${F(avStartFor(m))}} seed={${seed}} />`, noSplit: true });
    continue;
  }
  if (p.t === "stock") {
    const clip = stockClip(i);
    if (clip) {
      const fr = ffprobeFrames(`public/${clip}`);
      const cj = `<Clip src={${J(clip)}} frames={${fr}} seed={${seed}} />`;
      if (m.dur > 11) {
        const po = ensurePoster(i);
        const first = Math.min(7, m.dur * 0.55);
        raw.push({ start: m.start, dur: first, jsx: cj, noSplit: true });
        raw.push({ start: +(m.start + first).toFixed(3), dur: +(m.dur - first).toFixed(3), jsx: po ? `<Foto src={${J(po)}} seed={${seed + 9}} />` : cj, noSplit: true });
      } else raw.push({ start: m.start, dur: m.dur, jsx: cj, noSplit: true });
    } else {
      const jpg = stockJpg(i);
      if (jpg) raw.push({ start: m.start, dur: m.dur, jsx: `<Foto src={${J(jpg)}} seed={${seed}} />`, noSplit: false });
      else {
        // sin footage: usar la foto REAL vecina más cercana (nunca pantalla vacía)
        const b = nearestBed(i);
        missing.push(i);
        if (b) raw.push({ start: m.start, dur: m.dur, jsx: `<Foto src={${J(b)}} seed={${seed + 3}} />`, noSplit: false });
        else raw.push({ start: m.start, dur: m.dur, jsx: `<Chapter title={${J("")}} bed={undefined} seed={${seed}} />`, noSplit: false, miss: true });
      }
    }
    continue;
  }
  if (p.t === "img") {
    const png = heroPng(i);
    if (png) raw.push({ start: m.start, dur: m.dur, jsx: `<Foto src={${J(png)}} seed={${seed}} />`, noSplit: false });
    else { missing.push(i); raw.push({ start: m.start, dur: m.dur, jsx: `<Foto src={${J(IMG(i))}} seed={${seed}} />`, noSplit: false, miss: true }); }
    continue;
  }
  // comp
  const bed = nearestBed(i);
  const heavy = /^(diagrama|circulo)/.test(p.comp || "");
  if (heavy && m.dur > 9.5 && bed) {
    // el diagrama anima y luego se quedaría estático: cortá a la foto real de cama
    const first = Math.min(8, m.dur * 0.6);
    raw.push({ start: m.start, dur: first, jsx: compJSX(p.comp, p.txt, bed, seed), noSplit: true });
    raw.push({ start: +(m.start + first).toFixed(3), dur: +(m.dur - first).toFixed(3), jsx: `<Foto src={${J(bed)}} seed={${seed + 5}} />`, noSplit: false });
  } else {
    raw.push({ start: m.start, dur: m.dur, jsx: compJSX(p.comp, p.txt, bed, seed), noSplit: heavy });
  }
}

// split de planos de FOTO/comp-liviano largos en N (~5s c/u) — clips (Loop da movimiento) y
// avatar NO se parten; los diagramas pesados animan y tampoco. Cada parte re-siembra el Ken-Burns.
const cues = [];
for (const c of raw) {
  const isClip = c.jsx.includes("<Clip ") || c.jsx.includes("<AvatarWin ");
  if (!c.noSplit && !isClip && c.dur > 6.5) {
    const parts = Math.min(4, Math.max(2, Math.round(c.dur / 5.0)));
    const seg = +(c.dur / parts).toFixed(3);
    for (let k = 0; k < parts; k++) {
      const st = +(c.start + k * seg).toFixed(3);
      const du = k === parts - 1 ? +(c.start + c.dur - st).toFixed(3) : seg;
      const jx = k === 0 ? c.jsx : c.jsx.replace(/seed=\{(\d+)\}/, (_, s) => `seed={${+s + 11 * k}}`);
      cues.push({ start: st, dur: du, jsx: jx });
    }
  } else cues.push({ start: c.start, dur: c.dur, jsx: c.jsx });
}

// frame-align: pin boundaries, deriva dur del frame final
const aligned = cues.map((c, k) => {
  const f0 = F(c.start);
  let f1 = F(c.start + c.dur);
  const nx = cues[k + 1];
  if (nx && Math.abs(F(nx.start) - f1) <= 1) f1 = F(nx.start);
  return { f0, f1: Math.max(f0 + 1, f1), jsx: c.jsx };
});
const TOTAL_FRAMES = F(TOTAL_S) + 6;

// --- emitir cues_fcsflema.gen.tsx ---
const cueLines = aligned.map((c, k) => `  { key: "c${k}", from: ${c.f0}, dur: ${c.f1 - c.f0}, el: () => (${c.jsx}) },`).join("\n");
const cuesFile = `// cues_fcsflema.gen.tsx — GENERADO por build_fcsflema.mjs. NO editar a mano.
import React from "react";
import { Chapter, Frase, Stat, MitoVerdad, Checklist, Pizarra, Circulo, Alerta, Cta, SplitDos, Foto, Clip, AvatarWin } from "./Piezas";
export const CUES: { key: string; from: number; dur: number; el: () => React.ReactNode }[] = [
${cueLines}
];
`;
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`, cuesFile);

// --- Main ---
const HOOK = "La verdadera causa de la flema que no se va";
const main = `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_${SLUG}.gen";
import { Brand, HookOverlay } from "./Piezas";

export const TOTAL_FRAMES_FCSFLEMA = ${TOTAL_FRAMES};

export const MainFcsflema: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A141A" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={${F(M[1].end)}} layout="none">
      <HookOverlay text={${J(HOOK)}} />
    </Sequence>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_FCSFLEMA} layout="none">
      <Brand />
    </Sequence>
    <Audio src={staticFile("${SLUG}.m4a")} />
  </AbsoluteFill>
);
export default MainFcsflema;
`;
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`, main);

// --- index (entry propio) ---
const index = `import React from "react";
import { Composition } from "remotion";
import { MainFcsflema, TOTAL_FRAMES_FCSFLEMA } from "./${SLUG}/Main_${SLUG}";
import { registerRoot } from "remotion";
export const RootFcsflema: React.FC = () => (
  <Composition id="Fcsflema" component={MainFcsflema} durationInFrames={TOTAL_FRAMES_FCSFLEMA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsflema);
`;
fs.writeFileSync(`src/index_${SLUG}.tsx`, index);

// --- lista de assets ---
const assets = new Set();
assets.add(`${SLUG}_opt_placeholder`); // no aplica; avatar va aparte
assets.add(`${SLUG}.m4a`);
assets.add(AVATAR_SRC);
for (let i = 0; i < M.length; i++) {
  const p = byI[i];
  if (p.t === "stock") { if (stockClip(i)) { assets.add(CLIP(i)); const po = ensurePoster(i); if (po) assets.add(po); } else if (stockJpg(i)) assets.add(STJPG(i)); }
  if (p.t === "img" && heroPng(i)) assets.add(IMG(i));
}
// camas de componentes
for (let i = 0; i < M.length; i++) { const p = byI[i]; if (p.t === "comp") { const b = nearestBed(i); if (b) assets.add(b); } }
const assetList = [...assets].filter((a) => a !== `${SLUG}_opt_placeholder`);
fs.writeFileSync(`_${SLUG}_assets.txt`, assetList.join("\n"));

console.log(`cues: ${aligned.length} · frames: ${TOTAL_FRAMES} (${(TOTAL_FRAMES / FPS / 60).toFixed(1)}min)`);
console.log(`assets: ${assetList.length} · faltantes(momentos): ${missing.length}`, missing.slice(0, 30));
// pacing
const durs = aligned.map((c) => (c.f1 - c.f0) / FPS).sort((a, b) => a - b);
const pc = (p) => durs[Math.floor(p * durs.length)];
console.log(`pacing: mediana ${pc(0.5).toFixed(2)}s · p75 ${pc(0.75).toFixed(2)}s · p90 ${pc(0.9).toFixed(2)}s · >=5s ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%`);
// compuerta abre con avatar
console.log(`abre con avatar: ${aligned[0].jsx.includes("AvatarWin")}`);
