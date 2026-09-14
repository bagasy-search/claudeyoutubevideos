// build_fcspellizco.mjs — plan -> cues + Main + index + avatar_fcspellizco.gen.ts + _fcspellizco_assets.txt
// Clon de build_fcstaza9.mjs para AVATAR PROPIO POR VENTANAS (AvatarForever FP8), sin avatar parcial ni bucle.
//
// ORDEN (skill video-pipeline, "AVATAR PROPIO FP8"):
//   1) node gen_fcspellizco_plan.mjs && node build_fcspellizco.mjs     # sale avatar_fcspellizco.gen.ts
//   2) node avatar_fp8_ventanas.mjs fcspellizco --solo-full → farm → node avatar_fp8_ensamblar.mjs fcspellizco
//   3) node build_fcspellizco.mjs otra vez (ya con public/fcspellizco_opt.mp4 → compuerta de fps del avatar)
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render):
//  · OffthreadVideo en TODOS lados (avatar + clips). NUNCA <Video>.
//  · Frames alineados por FRAME FINAL (sin huecos de 1 cuadro entre planos).
//  · El master va en m4a en el tar; el wav suelto al release (lo agrega farm.mjs / a mano).
//  · El avatar fuera de sus ventanas es NEGRO en el mp4 ensamblado: la cobertura del b-roll tiene que ser total.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fcspellizco", COMP = "Fcspellizco", UP = "FCSPELLIZCO";
const FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const AVATAR = `${SLUG}_opt.mp4`;   // ensamblado por avatar_fp8_ensamblar.mjs (negro fuera de las ventanas)
const GAP_MAX_S = 30;               // regla del creador: nunca más de ~30 s sin ver al presentador
const APERTURA_AVATAR_S = 3;        // regla 1.bis: el video ABRE con el avatar hablando, piso 3 s

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const probe = (rel, entries) => {
  try {
    return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", `stream=${entries}`,
      "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8", timeout: 30000 }).trim().split("\n")[0]
      // ⛔ clips con side data (rotación/displaymatrix) devuelven "30/1," en csv: la coma sobrante hacía
      //    fallar la compuerta de fps sobre un clip SANO (pzpool_ventana_09).
      .replace(/[,\s]+$/, "");
  } catch { return ""; }
};
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
    path.join("public", rel)], { encoding: "utf8", timeout: 30000 }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
let { beats, overlays = [], totalMs } = plan;
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE} (encodear el máster a m4a)`); process.exit(1); }

const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(totalMs / 1000, WAV_S) + 0.5;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);
const sec = (ms) => +(ms / 1000).toFixed(3);

const HAY_AVATAR = existe(AVATAR);
if (!HAY_AVATAR) console.log(`· todavía no existe public/${AVATAR}: build de PASO 1 (sólo ventanas). Re-correr tras ensamblar el avatar.`);
else {
  const ad = durDe(AVATAR);
  if (ad < WAV_S - 0.5) { console.error(`⛔ el avatar ensamblado dura ${ad.toFixed(1)}s y el máster ${WAV_S.toFixed(1)}s: PARÁ.`); process.exit(1); }
}

// ── assets + validaciones ──────────────────────────────────────────────────────────────────────
const assets = new Set(HAY_AVATAR ? [AVATAR] : []);
const faltan = [];
const scanProps = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) assets.add(v); return; }
  if (Array.isArray(v)) return v.forEach(scanProps);
  if (v && typeof v === "object") return Object.values(v).forEach(scanProps);
};

// ── alineación por FRAME ─────────────────────────────────────────────────────────────────────────
const rows = beats.map((b) => ({ ...b, f0: F(sec(b.ms_in)), f1: F(sec(b.ms_out)) }));
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  if (rows[i].f1 > sig) rows[i].f1 = sig;
  if (Math.abs(sig - rows[i].f1) <= 1) rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

// ⛔ COMPUERTA regla 1.bis: ningún cue base antes de max(3 s, fin del primer momento de avatar)
if (rows.length && rows[0].f0 < F(APERTURA_AVATAR_S)) {
  console.error(`⛔ el primer plano de b-roll arranca a ${(rows[0].f0 / FPS).toFixed(2)}s: el video tiene que abrir con el avatar al menos ${APERTURA_AVATAR_S}s`);
  process.exit(1);
}

const cues = [];
const usedComps = new Set();
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS;
  const key = `${b.tipo}_${b.ms_in}`;
  if (b.tipo === "clip") {
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} />` });
  } else if (b.tipo === "clipslow") {
    const r = `broll/${b.clip}.mp4`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(r)} rate={${b.rate || 0.5}} />` });
  } else if (b.tipo === "imagen") {
    const r = `img/${b.imagen}.jpg`;
    if (!existe(r)) faltan.push(r); else assets.add(r);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(r)} seed={${b.f0}} />` });
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

if (faltan.length) {
  console.error(`⛔ ${[...new Set(faltan)].length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ── COMPUERTA DE FPS (30/1 CFR en TODO clip + el avatar si ya existe) ────────────────────────────
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = [];
  for (const rel of vids) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (!vids.length) { console.error("⛔ la compuerta de fps midió 0 videos — no es un OK"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${vids.length} videos a ${FPS}/1 CFR${HAY_AVATAR ? " (avatar incluido)" : " (avatar todavía no ensamblado)"}`);
}

// ── COMPUERTA DE ASPECTO (16:9) sobre las imágenes usadas ───────────────────────────────────────
{
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/i.test(a));
  const malos = [];
  for (const rel of imgs) {
    const wh = probe(rel, "width,height").split(",");
    const w = +wh[0], h = +wh[1];
    if (w && h) { const ar = w / h; if (Math.abs(ar - 16 / 9) > 0.06) malos.push(`${rel} ${w}x${h} (ar ${ar.toFixed(3)})`); }
  }
  if (!imgs.length) { console.error("⛔ la compuerta de aspecto midió 0 imágenes — no es un OK"); process.exit(1); }
  if (malos.length) {
    console.error(`⛔ ${malos.length} imágenes NO son 16:9:`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`aspecto ✓ ${imgs.length} imágenes 16:9`);
}

// ── AVATAR_WINDOWS = todo lo que el b-roll NO cubre (ahí se ve el avatar full) ───────────────────
const covered = new Uint8Array(TOTAL_FRAMES);
for (const b of rows) for (let x = b.f0; x < Math.min(TOTAL_FRAMES, b.f1); x++) covered[x] = 1;
const windows = [];
let lastMode = null;
for (let x = 0; x < TOTAL_FRAMES; x++) {
  const mode = covered[x] ? "hidden" : "full";
  if (mode !== lastMode) { windows.push({ start: +(x / FPS).toFixed(3), mode }); lastMode = mode; }
}

// ⛔ COMPUERTA DE CONEXIÓN: hueco máximo entre dos apariciones del avatar (medido sobre frames)
{
  const tramos = [];
  for (let i = 0; i < windows.length; i++) {
    const a = windows[i].start, z = i + 1 < windows.length ? windows[i + 1].start : TOTAL_FRAMES / FPS;
    tramos.push({ mode: windows[i].mode, a, z });
  }
  const full = tramos.filter((t) => t.mode === "full" && t.z - t.a >= 1.0);
  const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8"));
  const fraseEn = (s) => (MOM.filter((m) => m.t <= s).pop() || MOM[0]).txt.slice(0, 70);
  const huecos = [];
  let prevZ = 0;
  for (const t of full) { if (t.a - prevZ > GAP_MAX_S) huecos.push({ desde: prevZ, hasta: t.a }); prevZ = t.z; }
  if (TOTAL_FRAMES / FPS - prevZ > GAP_MAX_S + 15) huecos.push({ desde: prevZ, hasta: TOTAL_FRAMES / FPS });
  console.log(`conexión: ${full.length} apariciones del avatar ≥1 s medidas · huecos > ${GAP_MAX_S}s: ${huecos.length}`);
  if (huecos.length) {
    huecos.forEach((h) => console.error(`   ${h.desde.toFixed(0)}s → ${h.hasta.toFixed(0)}s (${(h.hasta - h.desde).toFixed(0)}s) · a mitad dice: "${fraseEn((h.desde + h.hasta) / 2)}"`));
    console.error(`⛔ hay tramos de más de ${GAP_MAX_S}s sin el presentador: agregá frases a AVATAR_FRAGS en el plan`);
    process.exit(1);
  }
}

let cov = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cov += covered[x];
const starts = rows.map((r) => r.f0 / FPS);
const gaps = []; for (let i = 0; i < starts.length - 1; i++) gaps.push(starts[i + 1] - starts[i]);
gaps.sort((a, b) => a - b);
const med = gaps[Math.floor(gaps.length / 2)] || 0;
const p75 = gaps[Math.floor(gaps.length * 0.75)] || 0;
const largos = 100 * gaps.filter((x) => x >= 5).length / (gaps.length || 1);
const COBER = 100 * cov / TOTAL_FRAMES;
if (COBER < 70) { console.error(`⛔ cobertura de b-roll ${COBER.toFixed(1)}% — demasiado avatar (y AvatarForever cobra por segundo visible)`); process.exit(1); }
if (COBER > 92) { console.error(`⛔ cobertura de b-roll ${COBER.toFixed(1)}% — el avatar casi no se ve: se pierde la conexión`); process.exit(1); }
console.log(`cobertura b-roll ${COBER.toFixed(1)}% · avatar a la vista ${(100 - COBER).toFixed(1)}% (${((TOTAL_FRAMES - cov) / FPS).toFixed(0)}s a renderizar en AvatarForever)`);
console.log(`pacing mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s ${largos.toFixed(0)}%`);

// ── imports del cues ────────────────────────────────────────────────────────────────────────────
const STAGE = new Set(["Clip", "Foto", "StatBug", "Label", "Keyring", "RayAvatar"]);
const fromStage = ["Clip", "Foto"].concat([...usedComps].filter((c) => STAGE.has(c)));
const fromFiles = [...usedComps].filter((c) => !STAGE.has(c));
const imports = [
  `import React from "react";`,
  `import { ${[...new Set(fromStage)].sort().join(", ")} } from "../fcsclv/RayStage";`,
  ...fromFiles.sort().map((c) => `import { ${c} } from "../fcsclv/${c}";`),
];

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

// ⚠️ avatar_fp8_ventanas.mjs lee `AVATAR_WINDOWS = [...] as const` y `TOTAL_FRAMES_<X> = N` con regex.
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
`// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export const TOTAL_${UP} = ${(+TOTAL_S).toFixed(3)};
export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
export const AVATAR_SRC_${UP} = ${JSON.stringify(AVATAR)};
export const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP}, AVATAR_SRC_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

// ⛔ OffthreadVideo, NUNCA <Video>. El mp4 del avatar es negro fuera de sus ventanas y lo tapa el b-roll.
// ⛔ Nunca estático: push lento determinista (sub-píxel por transform, no horneado con ffmpeg).
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F15", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(AVATAR_SRC_${UP})}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\` }}
      />
    </AbsoluteFill>
  );
};

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_${UP}} layout="none">
      <AvatarPiso />
    </Sequence>

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster: cubre TODO el video. */}
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

// ── COMPUERTA <Video> ───────────────────────────────────────────────────────────────────────────
{
  const KIT = "fcsclv";
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `build_${SLUG}.mjs`];
  for (const fn of fs.readdirSync(`src/${KIT}`)) if (/\.tsx?$/.test(fn)) files.push(`src/${KIT}/${fn}`);
  const malos = [];
  let mirados = 0;
  for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    mirados++;
    const src = fs.readFileSync(fpath, "utf8").split("\n")
      .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); })
      .join("\n");
    const needle1 = "<Vid" + "eo ", needle2 = "<Vid" + "eo>";
    if (src.includes(needle1) || src.includes(needle2)) malos.push(fpath);
  }
  if (mirados < 5) { console.error(`⛔ la compuerta de video legacy sólo miró ${mirados} archivos — no es un OK`); process.exit(1); }
  if (malos.length) { console.error(`⛔ elemento de video legacy encontrado (usá OffthreadVideo):`); malos.forEach((m) => console.error("   " + m)); process.exit(1); }
  console.log(`OffthreadVideo ✓ (0 elementos legacy en ${mirados} archivos)`);
}

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ────────────────────────────
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
if (sinBlur.length) { console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\``); sinBlur.slice(0, 8).forEach((x) => console.log("   " + x)); }
conBlur.push(WAV_FILE);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base) · overlays ${ovCues.length} · componentes distintos ${usedComps.size} (${[...usedComps].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur = ${conBlur.length}) → _${SLUG}_assets.txt`);
console.log(`TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (máster ${WAV_S.toFixed(1)}s)${HAY_AVATAR ? "" : " · ⚠️ falta ensamblar el avatar antes de farmear"}`);
