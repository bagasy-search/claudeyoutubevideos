// build_vgn0pnkzk0a7.mjs — DOCUMENTAL "El truco de $3 que elimina el moho de cualquier superficie"
// (The Free Builder / El Constructor Libre · 61 min con avatar Tomás).
// HÍBRIDO: 999 momentos = clips de stock recortados (broll/vgn0pnkzk0a7_cut/<name>.mp4) donde hay
// footage real + imágenes on-topic gpt-image-2 (img/<name>.jpg|png) para el resto, TODO anclado al ms
// EXACTO de captions_vgn0pnkzk0a7.json. Componentes KIT PREMIUM (THEME_EARTH) desde
// _v3/vgn0pnkzk0a7_components.json. Avatar full↔hidden (full-o-full, sin PiP). CTA sin precio.
// Salida: beatsheet/vgn0pnkzk0a7.json → node beatsheet.mjs beatsheet/vgn0pnkzk0a7.json
import fs from "fs";

const SLUG = "vgn0pnkzk0a7";
const AVATAR = `${SLUG}_opt.mp4`;
const AVATAR_DUR = 3662.4; // duración real del mp4 del avatar (ffprobe)

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const CAPS = caps.words || caps;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = CAPS.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  if (t.length < 3) return null;
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", String(phrase).slice(0, 55)); return v; };
const TOTAL = +Math.min(Wc[Wc.length - 1].e / 1000 + 1.2, AVATAR_DUR - 0.1).toFixed(2);

// ── 0) beats fuente ──
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));

// ── 1) B-ROLL — 1 clip o imagen por beat, anclada a su phrase real, contigua ──
// Los primeros 2.2s NO llevan ninguna toma: el avatar abre full y limpio (regla dura).
const OPEN_CLEAR_RAW = 2.2;
const clipOf = (n) => `public/broll/${SLUG}_cut/${n}.mp4`;
const imgOf = (n) => (fs.existsSync(`public/img/${n}.jpg`) ? `img/${n}.jpg` : fs.existsSync(`public/img/${n}.png`) ? `img/${n}.png` : null);

const rawBeats = [];
let nClips = 0, nImgs = 0, nSkip = 0;
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) { nSkip++; continue; }
  if (t < OPEN_CLEAR_RAW) { nSkip++; continue; }
  const hasClip = fs.existsSync(clipOf(b.name));
  const img = hasClip ? null : imgOf(b.name);
  if (!hasClip && !img) { nSkip++; continue; } // sin asset → no metemos beat (evita frame negro)
  if (hasClip) nClips++; else nImgs++;
  rawBeats.push({
    id: b.name,
    start: +t.toFixed(2),
    kind: "raw",
    src: hasClip ? `broll/${SLUG}_cut/${b.name}.mp4` : img,
    ...(hasClip ? { noSplit: true } : {}),
    hue: "amber",
    darken: 0,
  });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.25).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM ──
const PREMIUM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_components.json`, "utf8").replace(/^﻿/, ""));

// ── 2b) AUTO-RELLENO DE IMÁGENES ──────────────────────────────────────────────────────────
// Los componentes del kit con prop `image` opcional dibujan un PLACEHOLDER (un degradado con
// un círculo) cuando no la reciben. En la cuadrícula de auditoría eso se ve como una caja vacía
// y da sensación de inacabado. Tenemos 774 imágenes on-topic ancladas al ms: le pasamos a cada
// componente la imagen del MOMENTO MÁS CERCANO en el tiempo, que por construcción habla de lo
// mismo que el cartel. Cada imagen puede repetirse acá (el chequeo de "1 uso por asset" es solo
// para los beats raw; como overlay es una foto de apoyo, no una toma).
const imgPool = rawBeats.filter((b) => /^img\//.test(b.src)).map((b) => ({ t: b.start, src: b.src }));
const nearestImg = (t, k = 0) => {
  if (!imgPool.length) return undefined;
  let bi = 0, bd = Infinity;
  for (let i = 0; i < imgPool.length; i++) { const d = Math.abs(imgPool[i].t - t); if (d < bd) { bd = d; bi = i; } }
  return imgPool[Math.min(imgPool.length - 1, bi + k)].src;
};
const fillImages = (comp, props, t) => {
  const p = { ...props };
  const set = (o, key, k) => { if (o && typeof o === "object" && !o[key]) o[key] = nearestImg(t, k); };
  switch (comp) {
    case "VsDuel": set(p.left, "image", 0); set(p.right, "image", 1); break;
    case "BeforeAfter": if (!p.beforeImage) p.beforeImage = nearestImg(t, 0); if (!p.afterImage) p.afterImage = nearestImg(t, 1); break;
    case "FramedPhoto": case "FloatingCutout": case "SplitPanel": case "CutawayCallouts":
    case "PullQuote": case "LowerThirdId": case "CtaCard":
      set(p, "image", 0); break;
    case "PhotoCarousel": if (Array.isArray(p.items)) p.items.forEach((it, i) => set(it, "image", i)); break;
    case "NumberedSteps": if (Array.isArray(p.steps)) p.steps.forEach((it, i) => set(it, "image", i)); break;
    case "FlowSteps": if (Array.isArray(p.nodes)) p.nodes.forEach((it, i) => set(it, "image", i)); break;
    default: break;
  }
  return p;
};
const beats = [...rawBeats];
let nOv = 0;
const compCount = {};
const OPEN_CLEAR = 4.0; // ningún cartel en la apertura
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok || 8);
  if (s == null) continue;
  if (s < OPEN_CLEAR) { console.warn("⏭ componente en apertura (drop):", p.comp, s.toFixed(1)); continue; }
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s * 10)}`,
    start: +s.toFixed(2),
    dur: p.dur || 5.5,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: p.zone || "topLeft",
    ...fillImages(p.comp, p.props || {}, s),
  });
  nOv++;
  compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);

// ── SEGURIDAD: 1 uso por asset raw ──
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── AVATAR WINDOWS — full-o-full (sin PiP): full en el hook + slots ~5.5s cada ~24s en huecos sin cartel ──
const HOOK_END = 9, PERIOD = 24, SLOT = 5.5, SEARCH = 16;
const comps = beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 5.5)]);
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of CAPS) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 14; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
// CIERRE: el final SIEMPRE es el presentador a cámara (es el cierre de identidad del canal).
// No se chequea solape con componentes acá a propósito: los OVERLAYS se dibujan DESPUÉS del
// AvatarLayer, así que un cartel sobre el avatar se ve bien. Sin esto el video cerraba con 14s
// de b-roll y sin cara — se veía en la cuadrícula de auditoría.
fulls.push([snapWord(TOTAL - 11), TOTAL - 0.05]);
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

// ── manifiesto de assets embebido en Main (para que density_gate cuente los reales del cues) ──
const manifest = rawBeats.map((b) => b.src);
const block = `\n/* ASSET_MANIFEST (${manifest.length} tomas · ${nClips} clips reales · ${nImgs} imágenes):\n${manifest.map((s) => `"${s}"`).join(" ")}\n*/\n`;
const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
let main = fs.readFileSync(mainPath, "utf8").replace(/\n\/\* ASSET_MANIFEST[\s\S]*?\*\/\n/, "");
fs.writeFileSync(mainPath, main + block);

// ── lista de assets para el farm ──
const assets = new Set([`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...manifest]);
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");

const fullCount = windows.filter((w) => w.mode === "full").length;
const fullSecs = (() => { let s = 0; for (let i = 0; i < windows.length - 1; i++) if (windows[i].mode === "full") s += windows[i + 1].start - windows[i].start; return s; })();
console.log(`beats ${beats.length} (raw ${rawBeats.length}/${srcBeats.length} · ${nClips} clips reales · ${nImgs} imgs · ${nSkip} sin asset) · premium ${nOv}`);
console.log("componentes:", JSON.stringify(compCount));
console.log(`dur ${(TOTAL / 60).toFixed(2)} min · frames ${Math.round(TOTAL * 30)}`);
console.log(`avatar full: ${fullCount} ventanas · ${fullSecs.toFixed(0)}s (${(fullSecs / TOTAL * 100).toFixed(1)}%)`);
console.log(`assets → _${SLUG}_assets.txt (${assets.size})`);
