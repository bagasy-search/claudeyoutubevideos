// build_apafleas.mjs — MONTAJE de `apafleas` (The Amish Pest Almanac, EN/US).
//   "How to Get Rid of Yard Fleas Fast, Cheap and Easy"
//
//   node _v3/apafleas_plan.mjs   # DIRECTOR (4 pasadas) + wordms -> _v3/apafleas_plan.json
//   node build_apafleas.mjs      # plan -> cues + Main + index + _apafleas_assets.txt
//
// ⛔⛔ LA DIFERENCIA CON apayellow: aca el avatar NO es el fondo garantizado. Se genero con
//    AvatarForever SOLO para los 80 momentos full-frame (7,7 min de 25,4), asi que cada uno es
//    un clip propio en `av/` y el resto del metraje lo tiene que cubrir el b-roll AL 100%.
//    Por eso la compuerta de cobertura es la del narrador puro (>=99%), no el 90% del avatar.
// ⛔ OffthreadVideo en TODOS lados. NUNCA el elemento de video legacy.
// ⛔ COMPUERTA DE FPS: todo clip (avatar incluido) a 30/1 CFR o hay TIRON en todo el metraje.
// ⛔ Los overlays (CornerLabel) van ENCIMA, no ocupan slot ni ocultan la base.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "apafleas", COMP = "Apafleas", UP = "APAFLEAS";
const FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;   // el RENDER usa m4a; el wav master va SUELTO al release para el stitch

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, entries) => {
  try {
    return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries",
      `stream=${entries}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim();
  } catch { return ""; }
};
const durDe = (rel) => {
  try {
    return +execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of",
      "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim();
  } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));
const loopFCache = new Map();
const loopF = (rel) => {
  if (loopFCache.has(rel)) return loopFCache.get(rel);
  const d = durDe(rel);
  const f = Math.max(1, Math.round(d * FPS));
  loopFCache.set(rel, f);
  return f;
};

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
const beats = plan.beats, overlays = plan.overlays, totalMs = plan.totalMs;

const WAV_S = durDe(WAV_FILE) || durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);
const sec = (ms) => +(ms / 1000).toFixed(3);

// ── assets + validaciones ──────────────────────────────────────────────────────────────────────
const assets = new Set();
const faltan = [];
const scanProps = (v) => {
  if (typeof v === "string") {
    if (/^(img|med)\/.+\.(png|jpe?g)$/i.test(v) || /^(broll|av)\/.+\.mp4$/i.test(v)) assets.add(v);
    return;
  }
  if (Array.isArray(v)) return v.forEach(scanProps);
  if (v && typeof v === "object") return Object.values(v).forEach(scanProps);
};

// ── alineacion por FRAME (evita huecos/solapes de 1 cuadro entre planos) ────────────────────────
const rows = beats.map((b) => ({ ...b, f0: F(sec(b.ms_in)), f1: F(sec(b.ms_out)) }));
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  if (rows[i].f1 > sig) rows[i].f1 = sig;
  if (Math.abs(sig - rows[i].f1) <= 1) rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}
// el ultimo plano llega hasta el final: si no, el colchon de TOTAL_S deja medio segundo de fondo
// (y ademas `deliver_card` frena la entrega si el video dura mas que el audio).
rows[rows.length - 1].f1 = TOTAL_FRAMES;

const cues = [];
const usedComps = new Set();
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS;
  const key = `${b.tipo}_${b.ms_in}`;
  if (b.tipo === "avatar") {
    const r = `av/${b.n}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <ApaAvatar src=${JSON.stringify(r)} loopFrames={${existe(r) ? loopF(r) : 1}} />` });
  } else if (b.tipo === "clip") {
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <ApaClip src=${JSON.stringify(r)} loopFrames={${existe(r) ? loopF(r) : 1}} />` });
  } else if (b.tipo === "imagen") {
    const r = `img/${b.imagen}.jpg`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <ApaFoto src=${JSON.stringify(r)} seed={${b.f0}} />` });
  } else if (b.tipo === "componente") {
    usedComps.add(b.componente);
    scanProps(b.props);
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} {...(${JSON.stringify(b.props || {})} as any)} />` });
  }
}

const ovCues = [];
for (const o of overlays) {
  const f0 = F(sec(o.ms_in));
  let f1 = F(sec(o.ms_out));
  if (f1 <= f0) f1 = f0 + F(2);
  usedComps.add(o.componente);
  scanProps(o.props);
  ovCues.push({ key: `ov_${o.ms_in}`, start: f0 / FPS, dur: (f1 - f0) / FPS,
    el: `(d) => <${o.componente} durationInFrames={d} {...(${JSON.stringify(o.props || {})} as any)} />` });
}

// ── COMPUERTA: assets en disco ─────────────────────────────────────────────────────────────────
if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO video, avatar incluido) ─────────────────────────────────
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = [];
  for (const rel of vids) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (!vids.length) { console.error("⛔ la compuerta de fps midio CERO videos"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} de ${vids.length} videos NO estan a ${FPS}/1 CFR:`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${vids.length} videos a ${FPS}/1 CFR (incluye los ${vids.filter((v) => v.startsWith("av/")).length} clips de avatar)`);
}

// ── COMPUERTA DE ASPECTO (16:9) sobre las imagenes usadas ──────────────────────────────────────
{
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\d*\.png$/i.test(a) && !/(^|\/)qr[_-]|_qr\.png$/i.test(a));
  const malos = [];
  for (const rel of imgs) {
    const wh = probe(rel, "width,height").split(",");
    const w = +wh[0], h = +wh[1];
    if (w && h) { const ar = w / h; if (Math.abs(ar - 16 / 9) > 0.06) malos.push(`${rel} ${w}x${h} (ar ${ar.toFixed(3)})`); }
  }
  if (!imgs.length) { console.error("⛔ la compuerta de aspecto midio CERO imagenes"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} imagenes NO son 16:9:`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`aspecto ✓ ${imgs.length} imagenes 16:9`);
}

// ── COMPUERTA DE COBERTURA: aca NO hay avatar de piso, un hueco es PANTALLA PLANA ──────────────
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const COBER = 100 * cov / TOTAL_FRAMES;
{
  const huecos = []; let x = 0;
  while (x < TOTAL_FRAMES) {
    if (covered[x]) { x++; continue; }
    let y = x; while (y < TOTAL_FRAMES && !covered[y]) y++;
    huecos.push({ t: x / FPS, d: (y - x) / FPS });
    x = y;
  }
  const grandes = huecos.filter((h) => h.d >= 0.2);
  console.log(`cobertura ${COBER.toFixed(2)}% · huecos ${huecos.length} (>=0,2s: ${grandes.length})`);
  grandes.slice(0, 10).forEach((h) => console.log(`   hueco ${h.d.toFixed(2)}s en ${h.t.toFixed(1)}s`));
  // la cola despues del ultimo beat es el colchon de +0,5s del TOTAL_S, no un hueco real
  const colaF = TOTAL_FRAMES - rows[rows.length - 1].f1;
  if (COBER < 99 && (TOTAL_FRAMES - cov - colaF) > FPS) {
    console.error("⛔ cobertura por debajo del 99% y sin avatar de piso: se ve el fondo plano.");
    process.exit(1);
  }
}

const starts = rows.filter((r) => r.tipo !== "avatar").map((r) => r.f0 / FPS);
const gaps = []; for (let i = 0; i < starts.length - 1; i++) gaps.push(starts[i + 1] - starts[i]);
gaps.sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const largos = 100 * gaps.filter((x) => x >= 5).length / (gaps.length || 1);
console.log(`pacing (sin avatar) mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · >=5s ${largos.toFixed(0)}%`);

// ── imports del cues ───────────────────────────────────────────────────────────────────────────
const STAGE = new Set(["ApaClip", "ApaFoto", "ApaAvatar"]);
const fromStage = ["ApaFoto", "ApaAvatar"].concat([...usedComps].filter((c) => STAGE.has(c)));
if (cues.some((c) => c.el.includes("<ApaClip"))) fromStage.push("ApaClip");
const fromKit = [...usedComps].filter((c) => !STAGE.has(c)).sort();
const imports = [
  `import React from "react";`,
  `import { ${[...new Set(fromStage)].sort().join(", ")} } from "../apa/ApaStage";`,
  fromKit.length ? `import { ${fromKit.join(", ")} } from "./amish/AmishKit";` : "",
].filter(Boolean);

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
${imports.join("\n")}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];

export const OVERLAYS: Cue[] = [
${ovCues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
`// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export const TOTAL_${UP} = ${(+TOTAL_S).toFixed(3)};
export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1B1408" }}>
    {/* ⛔ NO hay capa de avatar de fondo: el avatar existe SOLO como cues (av/*.mp4) en los 80
        momentos full-frame. El resto lo cubre el b-roll, y la compuerta de cobertura del build
        exige >=99% para que este fondo nunca se vea. */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master */}
    <Audio src={staticFile("${WAV_FILE}")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${UP} };
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

// ── COMPUERTA elemento de video legacy ─────────────────────────────────────────────────────────
{
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `build_${SLUG}.mjs`];
  for (const fn of fs.readdirSync("src/apa")) if (/\.tsx?$/.test(fn)) files.push(`src/apa/${fn}`);
  files.push("src/VideoEdit/amish/AmishKit.tsx");
  const malos = [];
  for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    const src = fs.readFileSync(fpath, "utf8").split("\n")
      .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); })
      .join("\n");
    const n1 = "<Vid" + "eo ", n2 = "<Vid" + "eo>";
    if (src.includes(n1) || src.includes(n2)) malos.push(fpath);
  }
  if (malos.length) { console.error("⛔ elemento de video legacy (usa OffthreadVideo):"); malos.forEach((m) => console.error("   " + m)); process.exit(1); }
  console.log("OffthreadVideo ✓ (0 elementos legacy)");
}

// ── lista de assets para el tar del farm (+ los _blur) ─────────────────────────────────────────
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) {
    const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) { console.log(`⚠️ ${sinBlur.length} imagenes sin _blur.jpg`); sinBlur.slice(0, 8).forEach((x) => console.log("   " + x)); }
conBlur.push(WAV_FILE);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (avatar ${cues.filter((c) => c.el.includes("ApaAvatar")).length}) · overlays ${ovCues.length} · componentes distintos ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(1)}s)`);
