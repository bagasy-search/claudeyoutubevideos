// build_famascarroz.mjs (clon de build_fabolsasojos.mjs + beats VLOG agnes 2.5) — MONTAJE del video `famascarroz` (plan → cues + Main + index + assets list).
//   node gen_famascarroz_plan.mjs && node build_famascarroz.mjs
// ⛔ Sin avatar de fondo: COBERTURA 100 % obligatoria (cualquier frame sin plano = pantalla negra).
// ⛔ OffthreadVideo en todos lados · todo clip a 30/1 CFR · imágenes 16:9 · cama bajo componentes.
// ⛔ Avatar: al menos una ventana cada 30 s (regla del creador) — se verifica sobre los beats.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "famascarroz", COMP = "Famascarroz", UP = "FAMASCARROZ", FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const FFPROBE = "ffprobe";
const probe = (rel, e) => { try { return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE}`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const beats = plan.beats.sort((a, b) => a.ms_in - b.ms_in);
const overlays = (plan.overlays || []).sort((a, b) => a.ms_in - b.ms_in);
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

// ── alineación por FRAME, contigua (sin avatar de fondo no hay huecos permitidos)
const rows = beats.map((b) => ({ ...b, f0: F(b.ms_in / 1000), f1: F(b.ms_out / 1000) }));
rows[0].f0 = 0;
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

// ⛔ la ventana de avatar no puede durar más que su clip (si no, se congela el último cuadro)
let avLargos = 0;
const cues = [];
const cuesJson = [];
const KITDE = {};
const used = new Set();
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS, key = `${b.tipo}_${b.f0}`;
  if (b.tipo === "avatar") {
    scan(b.clip);
    const sf = b.startFrom || 0;
    const cd = durDe(b.clip) - sf;                                        // lo que QUEDA del clip desde startFrom
    if (cd && dur > cd + 0.07) { avLargos++; console.error(`   avatar ${b.clip} dura ${dur.toFixed(2)} s y el clip da ${cd.toFixed(2)} s`); }
    cuesJson.push({ key, src: b.clip, start, dur });
    cues.push({ key, start, dur, el: `(d) => <AvatarClip src=${JSON.stringify(b.clip)} seed={${b.f0}}${sf ? ` startFrom={${sf}}` : ""} />` });
  } else if (b.tipo === "clip") {
    scan(b.src);
    const sf = b.startFrom || 0;
    const frames = Math.floor((durDe(b.src) - sf) * FPS) - 1;             // cuadros DISPONIBLES desde startFrom
    if (frames < 15) { console.error(`⛔ clip ${b.src} con startFrom ${sf}s deja ${frames} cuadros`); process.exit(1); }
    const need = b.f1 - b.f0;
    if (b.vlog && need > frames + 2) { console.error(`⛔ vlog ${b.src} (${frames} cuadros) no cubre su tramo (${need}): se congelaría la boca`); process.exit(1); }
    if (need <= frames || b.vlog) {
      cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(b.src)} seed={${b.f0}}${sf ? ` startFrom={${sf}}` : ""} />` });
      cuesJson.push({ key, src: b.src, start, dur });
    } else {
      const last = `img/${SLUG}/_last/${path.basename(b.src, ".mp4")}_last.jpg`;
      if (!existe(last)) {
        fs.mkdirSync(path.dirname(path.join("public", last)), { recursive: true });
        execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.2", "-i", path.join("public", b.src), "-frames:v", "1", "-q:v", "2", path.join("public", last)]);
      }
      assets.add(last);
      cues.push({ key, start, dur, el: `(d) => <ClipHold src=${JSON.stringify(b.src)} last=${JSON.stringify(last)} seed={${b.f0}} frames={${frames}}${sf ? ` startFrom={${sf}}` : ""} />` });
      cuesJson.push({ key, src: b.src, start, dur: frames / FPS }, { key: key + "_hold", src: last, start: start + frames / FPS, dur: dur - frames / FPS });
    }
  } else if (b.tipo === "lamina") {
    scan(b.src);
    cues.push({ key, start, dur, el: `(d) => <Lamina src=${JSON.stringify(b.src)} zoom=${JSON.stringify(b.zoom || "completa")} desde=${JSON.stringify(b.desde || b.zoom || "completa")} />` });
  } else if (b.tipo === "imagen") {
    scan(b.src);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(b.src)} seed={${b.f0}}${b.punch ? " punch" : ""} />` });
  } else if (b.tipo === "componente") {
    used.add(b.componente); KITDE[b.componente] = b.kit; scan(b.props);
    if (!b.props?.bed) console.log(`⚠️ componente sin cama: ${b.componente} @${start.toFixed(1)}s`);
    const cama = b.kit !== "fcsclv" && b.props?.bed ? `<Cama src=${JSON.stringify(b.props.bed)} seed={${b.f0}} />` : "";
    const sfx = b.componente === "CalloutMark" ? "" : `<Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.3} />`;
    cues.push({ key, start, dur, comp: b.componente, el: `(d) => <>${cama}<${b.componente} durationInFrames={d} {...(${JSON.stringify(b.props)} as any)} />${sfx}</>` });
  }
}
const ov = overlays.map((o) => {
  used.add(o.componente); KITDE[o.componente] = o.kit; scan(o.props);
  const f0 = F(o.ms_in / 1000); let f1 = F(o.ms_out / 1000); if (f1 <= f0) f1 = f0 + F(2);
  return { key: `ov_${f0}`, start: f0 / FPS, dur: (f1 - f0) / FPS, comp: o.componente, el: `(d) => <><${o.componente} durationInFrames={d} {...(${JSON.stringify(o.props)} as any)} /><Audio src={staticFile("sfx/sfx_pop.mp3")} volume={0.25} /></>` };
});

if (faltan.length) { console.error(`⛔ ${new Set(faltan).size} assets faltan:`); [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x)); process.exit(1); }
if (avLargos) { console.error(`⛔ ${avLargos} ventanas de avatar duran más que su clip`); process.exit(1); }

// ── COMPUERTA: cobertura 100 % + avatar cada ≤30 s + apertura con avatar
{
  const cov = new Uint8Array(TOTAL_FRAMES);
  for (const r of rows) for (let x = r.f0; x < Math.min(TOTAL_FRAMES, r.f1); x++) cov[x] = 1;
  const sin = cov.length - cov.reduce((a, b) => a + b, 0);
  if (sin > 0) { console.error(`⛔ ${sin} frames SIN plano (pantalla negra)`); process.exit(1); }
  const av = rows.filter((r) => r.tipo === "avatar");
  // la LÁMINA (EL momento pedido por el creador, 25-45 s) no cuenta como hueco sin avatar
  const avLam = rows.filter((r) => r.tipo === "avatar" || r.tipo === "lamina" || r.vlog);
  let prev = 0, peor = 0;
  for (const r of avLam) { peor = Math.max(peor, r.f0 - prev); prev = r.f1; }
  peor = Math.max(peor, TOTAL_FRAMES - prev);
  if (rows[0].tipo !== "avatar") { console.error("⛔ el video no abre con el avatar"); process.exit(1); }
  if (rows[0].f1 < F(3)) { console.error("⛔ la apertura con avatar dura menos de 3 s"); process.exit(1); }
  const avS = av.reduce((a, r) => a + r.f1 - r.f0, 0) / FPS;
  console.log(`cobertura ✓ 100 % de ${TOTAL_FRAMES} frames · avatar ${av.length} ventanas ${avS.toFixed(0)} s (${(100 * avS / TOTAL_S).toFixed(1)} %) · hueco máx sin avatar ${(peor / FPS).toFixed(1)} s`);
    if (peor / FPS > 45) { console.error("⛔ hay más de 45 s sin presentador"); process.exit(1); }
}

// ── pacing
{
  const d = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(d.length * p)];
  // ── VARA: real % y avatar % sobre lo VISIBLE · componentes ≥40 y ≥15 tipos
  const vis = (r) => (r.f1 - r.f0) / FPS;
  const realS = rows.filter((r) => (r.tipo === "clip" || r.tipo === "imagen") && r.real).reduce((a, r) => a + vis(r), 0);
  const avS2 = rows.filter((r) => r.tipo === "avatar").reduce((a, r) => a + vis(r), 0);
  const compN = rows.filter((r) => r.tipo === "componente").length + overlays.length;
  const tipos = new Set([...rows.filter((r) => r.tipo === "componente").map((r) => r.componente), ...overlays.map((o) => o.componente)]);
  const vlS = rows.filter((r) => r.vlog).reduce((a, r) => a + vis(r), 0);
  console.log(`VLOG agnes 2.5 (presentador en escena, no cuenta como avatar ni real): ${vlS.toFixed(0)} s (${(100 * vlS / TOTAL_S).toFixed(1)} %)`);
  console.log(`VARA · real ${(100 * realS / TOTAL_S).toFixed(1)} % · avatar ${(100 * avS2 / TOTAL_S).toFixed(1)} % · componentes ${compN} · tipos ${tipos.size}`);
  if (realS / TOTAL_S < 0.25) { console.error("⛔ metraje real < 25 % de lo visible"); process.exitCode = 1; }
  if (avS2 / TOTAL_S < 0.24 || avS2 / TOTAL_S > 0.32) { console.error("⛔ avatar visible fuera de 24-32 %"); process.exitCode = 1; }
  if (compN < 40 || tipos.size < 15) { console.error("⛔ componentes < 40 o tipos < 15"); process.exitCode = 1; }
  // repetidos: un mismo asset en planos que no son su propia 2ª parte ni relleno contiguo
  const usos = {};
  for (const r of rows) if (r.src && r.tipo !== "lamina" && !r.parte) (usos[r.src] ||= []).push(r);
  const rep = Object.entries(usos).filter(([, v]) => v.length > 1);
  console.log(`assets repetidos (fuera de su 2ª parte): ${rep.length}${rep.length ? " · " + rep.slice(0, 6).map(([k, v]) => k.split("/").pop() + "×" + v.length).join(", ") : ""}`);
  console.log(`pacing · mediana ${q(0.5).toFixed(2)} s · p75 ${q(0.75).toFixed(2)} s · ≥5 s ${(100 * d.filter((x) => x >= 5).length / d.length).toFixed(0)} % · máx ${d[d.length - 1].toFixed(1)} s`);
}

// ── COMPUERTAS de fps (30/1) y aspecto (16:9)
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
  if (!vids.length) { console.error("⛔ fps: 0 videos medidos"); process.exit(1); }
  if (malos.length) { console.error(`⛔ ${malos.length} videos no están a 30/1:`); malos.slice(0, 10).forEach((x) => console.error("   " + x + " " + probe(x, "r_frame_rate"))); process.exit(1); }
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_(qr|portada)\.(png|jpe?g)$/.test(a));
  const malas = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return w && h && Math.abs(w / h - 16 / 9) > 0.06; });
  if (!imgs.length) { console.error("⛔ aspecto: 0 imágenes medidas"); process.exit(1); }
  if (malas.length) { console.error(`⛔ ${malas.length} imágenes no son 16:9:`); malas.slice(0, 10).forEach((x) => console.error("   " + x)); process.exit(1); }
  console.log(`fps ✓ ${vids.length} videos a 30/1 · aspecto ✓ ${imgs.length} imágenes 16:9`);
}

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Audio, staticFile } from "remotion";
import { AvatarClip, Cama, Clip, ClipHold, Foto, Lamina } from "../${SLUG}/Piezas";
${[...used].sort().map((c) => `import { ${c} } from "../${KITDE[c]}/${c}";`).join("\n")}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };
export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
export const OVERLAYS: Cue[] = [
${ov.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";

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
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── COMPUERTA: ningún <Video> legacy
{
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `src/${SLUG}/Piezas.tsx`, ...[...used].map((c) => `src/${KITDE[c]}/${c}.tsx`)];
  const malos = files.filter((f) => fs.existsSync(f) && fs.readFileSync(f, "utf8").split("\n").filter((L) => !/^\s*(\/\/|\*|\/\*)/.test(L)).join("\n").match(/<Video[\s>]/));
  if (malos.length) { console.error("⛔ <Video> legacy en:", malos); process.exit(1); }
  console.log(`OffthreadVideo ✓ (${files.length} archivos mirados)`);
}

// ── lista de assets (+ _blur de cada imagen, que el kit pide en runtime)
const lista = [];
for (const a of [...assets].sort()) {
  lista.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) { const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"); if (existe(b)) lista.push(b); }
}
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(cuesJson, null, 1));
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");
console.log(`cues ${cues.length} · overlays ${ov.length} · componentes ${used.size} (${[...used].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur ${lista.length}) · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_S / 60).toFixed(2)} min`);
