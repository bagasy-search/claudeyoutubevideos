// build_v4dtvgrn83qy7.mjs — "¡Cómo construir un mini calefactor en casa!" (The Free Builder).
// Consolida los 10 tramos de dirección (_v3/out_NN.json) contra los segmentos anclados al ms
// (_v3/v4dtvgrn83qy7_segments.json) y produce:
//   · beatsheet/v4dtvgrn83qy7.json      → node beatsheet.mjs …  → cues_v4dtvgrn83qy7.gen.tsx
//   · src/VideoEdit/avatar_v4dtvgrn83qy7.gen.ts (ventanas full/hidden, sin PiP)
//   · ASSET_MANIFEST embebido en Main_ (para density_gate)
import fs from "fs";

const SLUG = "v4dtvgrn83qy7";
const AVATAR = `avatar_${SLUG}.mp4`;

const segs = JSON.parse(fs.readFileSync(`_v3/${SLUG}_segments.json`, "utf8").replace(/^﻿/, ""));
const segById = new Map(segs.map((s) => [s.i, s]));
const TOTAL = +(segs[segs.length - 1].e + 1.2).toFixed(2);

// ── 1) juntar la dirección de los 10 tramos ──
const dir = [];
for (let k = 1; k <= 10; k++) {
  const f = `_v3/out_${String(k).padStart(2, "0")}.json`;
  if (!fs.existsSync(f)) { console.warn(`⚠ falta ${f}`); continue; }
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "").replace(/^```json\s*/i, "").replace(/```\s*$/, "")); }
  catch (e) { console.error(`✖ ${f} no es JSON válido: ${e.message}`); process.exit(1); }
  if (!Array.isArray(arr)) { console.error(`✖ ${f} no es un array`); process.exit(1); }
  dir.push(...arr);
}

// ── 2) TOMAS DE FONDO: exactamente una por segmento ──
// La dirección puede traer varias o ninguna: la primera gana, y los segmentos huérfanos
// se rellenan con una imagen derivada del texto (nunca se deja un hueco negro).
const tomaBySeg = new Map();
for (const d of dir) {
  if (d.type !== "clip" && d.type !== "img") continue;
  if (!segById.has(d.i) || tomaBySeg.has(d.i)) continue;
  tomaBySeg.set(d.i, d);
}
let huerfanos = 0;
for (const s of segs) {
  if (tomaBySeg.has(s.i)) continue;
  huerfanos++;
  tomaBySeg.set(s.i, { i: s.i, type: "img", prompt: `objeto casero de invierno sobre un banco de madera vieja, macetas de barro y una vela, foto casera real, luz natural cálida, grano fino, sin texto` });
}

// listas de assets a producir
const shots = [];   // Pexels
const imgs = [];    // gpt-image-2
const rawBeats = [];
for (const s of segs) {
  const t = tomaBySeg.get(s.i);
  const name = `${SLUG}_s_${String(s.i).padStart(3, "0")}`;
  if (t.type === "clip") {
    shots.push({ name, query: t.query, type: "video", orientation: "landscape" });
    rawBeats.push({ id: name, start: s.t, kind: "raw", src: `broll/${SLUG}/${name}.mp4`, noSplit: true, hue: "amber", darken: 0, _clip: true });
  } else {
    const it = { name, prompt: t.prompt };
    if (t.ref) it.ref = `public/ref_${SLUG}.png`;
    imgs.push(it);
    rawBeats.push({ id: name, start: s.t, kind: "raw", src: `img/${name}.png`, hue: "amber", darken: 0, _clip: false });
  }
}
// duración contigua: cada toma llega hasta el arranque de la siguiente
rawBeats.sort((a, b) => a.start - b.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.9, next - rawBeats[i].start).toFixed(2);
}

// ── 3) COMPONENTES ──
const OPEN_CLEAR = 8.0; // los primeros 8s son avatar full SIN cartel (regla dura de apertura)
const beats = [...rawBeats];
const compCount = {};
let nOv = 0, dropOpen = 0, dropBad = 0;
const usados = new Set();
for (const d of dir) {
  if (d.type !== "comp" || !d.kind) { continue; }
  const s = segById.get(d.i);
  if (!s) { dropBad++; continue; }
  if (s.t < OPEN_CLEAR) { dropOpen++; continue; }
  const key = `${d.kind}@${s.i}`;
  if (usados.has(key)) continue;
  usados.add(key);
  const dur = Math.min(+d.dur || 5, 8);
  beats.push({
    id: `ov_${d.kind}_${s.i}`,
    start: s.t,
    dur,
    kind: d.kind,
    overlay: true,
    hue: "amber",
    ...(d.props || {}),
  });
  nOv++;
  compCount[d.kind] = (compCount[d.kind] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);
for (const b of beats) delete b._clip;

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── 4) listas de assets ──
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/dense_${SLUG}.json`, JSON.stringify(shots, null, 1));
fs.writeFileSync(`_v3/imgs_${SLUG}.json`, JSON.stringify(imgs, null, 1));

// ── 5) AVATAR WINDOWS — full-o-full (sin PiP) ──
// full en el hook (0→~9s, regla dura) + un slot de ~5s cada ~26s, siempre en huecos SIN componente.
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const HOOK_END = 9, PERIOD = 26, SLOT = 5, SEARCH = 18;
const comps = beats.filter((b) => b.overlay).map((b) => [b.start, b.start + (b.dur || 3)]);
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snapWord(TOTAL - 8);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);

// ── 6) manifiesto embebido en Main_ (para density_gate) ──
const manifest = rawBeats.map((b) => b.src);
const block = `\n/* ASSET_MANIFEST (${manifest.length} tomas · ${shots.length} clips de stock · ${imgs.length} imágenes):\n${manifest.map((s) => `"${s}"`).join(" ")}\n*/\n`;
const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
const main = fs.readFileSync(mainPath, "utf8").replace(/\n\/\* ASSET_MANIFEST[\s\S]*?\*\/\n/, "");
fs.writeFileSync(mainPath, main + block);

const mins = TOTAL / 60;
console.log(`beats ${beats.length} · tomas ${rawBeats.length} (clips ${shots.length} · imgs ${imgs.length} · huérfanos rellenados ${huerfanos})`);
console.log(`componentes ${nOv} usos · ${Object.keys(compCount).length} distintos · ${(nOv / mins).toFixed(1)}/min  (piso 7/min, mín 12 distintos)`);
console.log(`descartados: ${dropOpen} en la apertura · ${dropBad} sin segmento`);
console.log(`avatar full windows: ${windows.filter((w) => w.mode === "full").length} · TOTAL ${TOTAL}s (${mins.toFixed(1)} min)`);
console.log("kinds:", JSON.stringify(compCount));
