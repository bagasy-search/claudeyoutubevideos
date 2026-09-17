// build_fapapilomas.mjs — MONTAJE (plan → cues + Main + index + assets list) + COMPUERTAS.
//   node gen_fapapilomas_plan.mjs && node build_fapapilomas.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const SLUG = "fapapilomas", COMP = "Fapapilomas", UP = "FAPAPILOMAS", FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, e) => { try { return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE}`); process.exit(1); }
let fails = 0;
const fail = (m) => { console.error("⛔ " + m); fails++; };

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const beats = plan.beats.sort((a, b) => a.ms_in - b.ms_in);
const overlays = (plan.overlays || []).sort((a, b) => a.ms_in - b.ms_in);
const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(plan.totalMs / 1000, WAV_S + 0.3);
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);
const AGNES = new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_i2v.json`, "utf8")).map((x) => `broll/${SLUG}/${x.nombre}.mp4`));

const assets = new Set([WAV_FILE]);
const faltan = [];
const scan = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) { if (existe(v)) assets.add(v); else faltan.push(v); } return; }
  if (Array.isArray(v)) return v.forEach(scan);
  if (v && typeof v === "object") Object.values(v).forEach(scan);
};
const lastFrame = (clip) => {
  const out = `img/${SLUG}/${path.basename(clip, ".mp4")}_last.jpg`;
  if (!existe(out)) spawnSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.15", "-i", path.join("public", clip), "-frames:v", "1", "-q:v", "3", path.join("public", out)]);
  return out;
};

const rows = beats.map((b) => ({ ...b, f0: F(b.ms_in / 1000), f1: F(b.ms_out / 1000) }));
rows[0].f0 = 0;
for (let i = 0; i < rows.length; i++) { rows[i].f1 = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES; if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1; }

const cues = [], cuesJson = [], used = new Set(), usedAgnes = new Map();
let avLargos = 0;
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS, key = `${b.tipo}_${b.f0}`;
  if (b.tipo === "avatar") {
    scan(b.clip);
    const sf = b.startFrom || 0;
    const cd = durDe(b.clip) - sf;
    if (dur > cd + 0.07) { avLargos++; console.error(`   avatar ${b.clip} ${dur.toFixed(2)} > ${cd.toFixed(2)}`); }
    cues.push({ key, start, dur, el: `(d) => <AvatarClip src=${JSON.stringify(b.clip)} seed={${b.f0}}${sf ? ` startFrom={${sf}}` : ""} />` });
  } else if (b.tipo === "clip" && AGNES.has(b.src)) {
    const cd = durDe(b.src), frames = Math.floor(cd * FPS) - 1;
    if (b.parte === 2 || usedAgnes.has(b.src)) {           // nunca repetir el clip: el 2º corte es su último cuadro
      const last = lastFrame(b.src); scan(last);
      cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(last)} seed={${b.f0}} punch />` });
      continue;
    }
    usedAgnes.set(b.src, 1); scan(b.src);
    cuesJson.push({ key, src: b.src, start, dur: Math.min(dur, cd) });
    if (dur > cd - 1 / FPS) { const last = lastFrame(b.src); scan(last); cues.push({ key, start, dur, el: `(d) => <ClipHold src=${JSON.stringify(b.src)} last=${JSON.stringify(last)} seed={${b.f0}} frames={${frames}} />` }); }
    else cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(b.src)} seed={${b.f0}} frames={${frames}} />` });
  } else if (b.tipo === "clip") {
    scan(b.src);
    const sf = b.startFrom || 0;
    const frames = Math.floor((durDe(b.src) - sf) * FPS) - 1;
    if (frames < 15) { fail(`clip ${b.src} startFrom ${sf}s deja ${frames} cuadros`); continue; }
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(b.src)} seed={${b.f0}} frames={${frames}}${sf ? ` startFrom={${sf}}` : ""} />` });
  } else if (b.tipo === "lamina") {
    scan(b.src);
    cues.push({ key, start, dur, el: `(d) => <Lamina src=${JSON.stringify(b.src)} zoom=${JSON.stringify(b.zoom || "completa")} desde=${JSON.stringify(b.desde || b.zoom || "completa")} />` });
  } else if (b.tipo === "imagen") {
    scan(b.src);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(b.src)} seed={${b.f0}}${b.punch ? " punch" : ""} />` });
  } else if (b.tipo === "componente") {
    used.add(b.componente); scan(b.props);
    if (!b.props?.bed) console.log(`⚠️ componente sin cama: ${b.componente} @${start.toFixed(1)}s`);
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} {...(${JSON.stringify(b.props)} as any)} />` });
  }
}
const ov = overlays.map((o) => {
  used.add(o.componente); scan(o.props);
  const f0 = F(o.ms_in / 1000); let f1 = F(o.ms_out / 1000); if (f1 <= f0) f1 = f0 + F(2);
  return { key: `ov_${f0}`, start: f0 / FPS, dur: (f1 - f0) / FPS, el: `(d) => <${o.componente} durationInFrames={d} {...(${JSON.stringify(o.props)} as any)} />` };
});
if (faltan.length) { console.error(`⛔ ${new Set(faltan).size} assets faltan:`); [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x)); process.exit(1); }
if (avLargos) fail(`${avLargos} ventanas de avatar duran más que su clip`);

// ── COMPUERTAS de contenido
{
  const cov = new Uint8Array(TOTAL_FRAMES);
  for (const r of rows) for (let x = r.f0; x < Math.min(TOTAL_FRAMES, r.f1); x++) cov[x] = 1;
  const sin = cov.length - cov.reduce((a, b) => a + b, 0);
  if (sin > 0) fail(`${sin} frames SIN plano`);
  const S = (pred) => rows.filter(pred).reduce((a, r) => a + r.f1 - r.f0, 0) / FPS;
  const avS = S((r) => r.tipo === "avatar");
  const realS = S((r) => (r.tipo === "clip" || r.tipo === "imagen") && r.real);
  const lamS = S((r) => r.tipo === "lamina");
  const compS = S((r) => r.tipo === "componente");
  if (rows[0].tipo !== "avatar" || rows[0].f1 < F(3)) fail("el video no abre con ≥3 s de avatar");
  let prev = 0, peor = 0;
  for (const r of rows.filter((r) => r.tipo === "avatar" || r.tipo === "lamina")) { peor = Math.max(peor, r.f0 - prev); prev = r.f1; }
  const kinds = new Set([...rows.filter((r) => r.tipo === "componente").map((r) => r.componente), ...overlays.map((o) => o.componente)]);
  const nComp = rows.filter((r) => r.tipo === "componente").length + overlays.length;
  const pct = (x) => (100 * x / TOTAL_S).toFixed(1);
  console.log(`cobertura ✓ ${TOTAL_FRAMES} frames medidos · avatar ${pct(avS)} % · REAL ${pct(realS)} % · componentes ${pct(compS)} % · lámina ${lamS.toFixed(0)} s · hueco máx sin avatar ${(peor / FPS).toFixed(1)} s`);
  console.log(`componentes: ${nComp} (full ${nComp - overlays.length} + overlays ${overlays.length}) · tipos ${kinds.size}`);
  if (nComp < 40) fail(`componentes ${nComp} < 40`);
  if (kinds.size < 15) fail(`tipos ${kinds.size} < 15`);
  if (avS / TOTAL_S < 0.24 || avS / TOTAL_S > 0.32) fail(`avatar visible ${pct(avS)} % fuera de 25-30 %`);
  if (realS / TOTAL_S < 0.2) fail(`metraje real ${pct(realS)} % < 20 %`);
  const d = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(d.length * p)];
  console.log(`pacing (${d.length} planos) · mediana ${q(0.5).toFixed(2)} s · p75 ${q(0.75).toFixed(2)} s · ≥5 s ${(100 * d.filter((x) => x >= 5).length / d.length).toFixed(0)} % · máx ${d[d.length - 1].toFixed(1)} s`);
  const qrCues = rows.filter((r) => r.componente === "GuideCTA");
  console.log(`CTAs con QR: ${qrCues.length} en ${qrCues.map((r) => (r.f0 / FPS / 60).toFixed(2) + " min (" + ((r.f1 - r.f0) / FPS).toFixed(1) + " s)").join(", ")}`);
  for (const r of qrCues) if ((r.f1 - r.f0) / FPS < 4) fail(`CTA con QR dura < 4 s @${(r.f0 / FPS).toFixed(1)}`);
  if (qrCues.length < 3) fail(`CTAs con QR ${qrCues.length} < 3`);
  const firstCta = qrCues.length ? qrCues[0].f0 / FPS : 0;
  if (firstCta < 360) fail(`primera CTA antes del minuto 6 (${(firstCta / 60).toFixed(2)})`);
  const lam = rows.filter((r) => r.tipo === "lamina");
  if (lam.length) console.log(`lámina desde el min ${(lam[0].f0 / FPS / 60).toFixed(2)}`);
}
// ── fps (30/1) y aspecto (16:9)
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
  console.log(`fps: ${vids.length} videos medidos`);
  if (!vids.length) fail("fps: 0 videos medidos");
  if (malos.length) { fail(`${malos.length} videos no están a 30/1`); malos.slice(0, 10).forEach((x) => console.error("   " + x + " " + probe(x, "r_frame_rate"))); }
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qr\.png$|_portada\.jpg$/.test(a));
  const malas = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return w && h && Math.abs(w / h - 16 / 9) > 0.06; });
  console.log(`aspecto: ${imgs.length} imágenes medidas`);
  if (malas.length) { fail(`${malas.length} imágenes no son 16:9`); malas.slice(0, 10).forEach((x) => console.error("   " + x)); }
}

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AvatarClip, Clip, ClipHold, Foto, Lamina } from "../${SLUG}/Piezas";
import { ${[...used].sort().join(", ")} } from "../${SLUG}/Kit";

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
  <AbsoluteFill style={{ backgroundColor: "#F4EEDD" }}>
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
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(cuesJson, null, 1));
{
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `src/${SLUG}/Piezas.tsx`, `src/${SLUG}/Kit.tsx`];
  const malos = files.filter((f) => fs.readFileSync(f, "utf8").split("\n").filter((L) => !/^\s*(\/\/|\*|\/\*)/.test(L)).join("\n").match(/<Video[\s>]/));
  if (malos.length) fail(`<Video> legacy en ${malos}`);
  console.log(`OffthreadVideo ✓ (${files.length} archivos mirados)`);
}
// sfx del kit (runtime) → al tar
const kit = fs.readFileSync(`src/${SLUG}/Kit.tsx`, "utf8");
for (const m of kit.matchAll(/src="([^"]+\.mp3)"/g)) { const r = `sfx/${m[1]}`; if (existe(r)) assets.add(r); else fail(`sfx faltante ${r}`); }
const lista = [];
for (const a of [...assets].sort()) { lista.push(a); if (/\.(png|jpe?g)$/i.test(a)) { const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"); if (existe(b)) lista.push(b); } }
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");
console.log(`cues ${cues.length} · overlays ${ov.length} · assets ${lista.length} · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_S / 60).toFixed(2)} min`);
if (fails) { console.error(`⛔ ${fails} compuertas fallaron`); process.exitCode = 1; }
