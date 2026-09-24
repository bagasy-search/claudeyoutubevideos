// build_vx41g9y9n8cz.mjs — DOCUMENTAL "¿Por qué este $1 truco elimina el moho para siempre?" (The Free Builder).
// HÍBRIDO: 324 momentos = clips de stock verificados (broll/vx41g9y9n8cz_s_*.mp4) donde hay footage real +
// imágenes on-topic Modal (public/img/vx41g9y9n8cz_s_*.png) para el resto, anclados al ms EXACTO de
// captions_vx41g9y9n8cz.json. Componentes KIT PREMIUM (THEME_EARTH) desde _v3/vx41g9y9n8cz_components.json.
// Avatar full↔hidden (full-o-full, sin PiP). CTA sin precio.
// Salida: beatsheet/vx41g9y9n8cz.json → node beatsheet.mjs beatsheet/vx41g9y9n8cz.json
import fs from "fs";

const SLUG = "vx41g9y9n8cz";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 55)); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// ── 0) beats fuente (324) ──
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));

// ── 1) B-ROLL — 1 clip o imagen por beat, anclada a su phrase real, contigua ──
const rawBeats = [];
let nClips = 0;
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) continue;
  const hasClip = fs.existsSync(`public/broll/${b.name}.mp4`);
  if (hasClip) nClips++;
  rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw",
    src: hasClip ? `broll/${b.name}.mp4` : `img/${b.name}.png`,
    ...(hasClip ? { noSplit: true } : {}), hue: "amber", darken: 0 });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM (leídos del JSON autorado) ──
const PREMIUM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_components.json`, "utf8").replace(/^﻿/, ""));

// ── ensamblar beats: raw + premium overlays anclados a su phrase real ──
const beats = [...rawBeats];
let nOv = 0;
const compCount = {};
const OPEN_CLEAR = 3.5; // los primeros ~3.5s son avatar full SIN cartel (regla dura de apertura)
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok || 8);
  if (s == null) continue;
  if (s < OPEN_CLEAR) { console.warn("⏭ componente en apertura (drop):", p.comp, s.toFixed(1)); continue; }
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`,
    start: +s.toFixed(2),
    dur: p.dur || 6,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: p.zone || "topLeft",
    ...(p.props || {}),
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

// ── AVATAR WINDOWS — full-o-full (sin PiP): full en hook + slots ~5s cada ~26s en huecos sin componente ──
const HOOK_END = 9, PERIOD = 26, SLOT = 5, SEARCH = 18;
const comps = beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]);
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

// ── manifiesto de assets embebido en Main (para que density_gate cuente los reales del cues) ──
const manifest = rawBeats.map((b) => b.src);
const block = `\n/* ASSET_MANIFEST (${manifest.length} tomas · ${nClips} clips reales):\n${manifest.map((s) => `"${s}"`).join(" ")}\n*/\n`;
const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
let main = fs.readFileSync(mainPath, "utf8").replace(/\n\/\* ASSET_MANIFEST[\s\S]*?\*\/\n/, "");
fs.writeFileSync(mainPath, main + block);

console.log(`beats totales ${beats.length} (raw ${rawBeats.length} de ${srcBeats.length} · ${nClips} clips reales) · premium ${nOv} · dur ${(TOTAL/60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
console.log("avatar windows:", windows.filter(w=>w.mode==="full").length, "full");
