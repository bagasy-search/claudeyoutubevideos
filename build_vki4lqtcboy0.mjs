// build_vki4lqtcboy0.mjs — "25 Platos Caseros Olvidados Que Te Devolverán a la Infancia"
// Canal: Abuela Rosa: Sabores de Antes · nicho doc-broll-video (marca EARTH serif vintage).
// HÍBRIDO con AVATAR: 317 momentos anclados al ms de captions_vki4lqtcboy0.json.
//   · clips REALES verificados  → public/broll/vki4lqtcboy0_s_NNN.mp4  (aislados por slug)
//   · imágenes on-topic (Modal) → public/img/vki4lqtcboy0_s_NNN.png
//   · componentes KIT PREMIUM (THEME_EARTH) desde _v3/vki4lqtcboy0_components.json
// Avatar full ↔ hidden (regla full-o-visual-full, sin PiP en esquina).
// Salida: beatsheet/vki4lqtcboy0.json → node beatsheet.mjs beatsheet/vki4lqtcboy0.json
import fs from "fs";

const SLUG = "vki4lqtcboy0";
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
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.2).toFixed(2);

// ── 0) beats fuente (317, autorados por los agentes §1) ──
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));

// ── 1) B-ROLL — 1 clip o imagen por beat, anclada a su frase real, contigua ──
const rawBeats = [];
let nClips = 0;
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) continue;
  const hasClip = fs.existsSync(`public/broll/${b.name}.mp4`);
  if (hasClip) nClips++;
  rawBeats.push({
    id: b.name, start: +t.toFixed(2), kind: "raw",
    src: hasClip ? `broll/${b.name}.mp4` : `img/${b.name}.png`,
    ...(hasClip ? { noSplit: true } : {}), hue: "amber", darken: 0,
  });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM (autorados) ──
// (archivo _final: propio de este build, para que ningún otro proceso lo pise)
const PREMIUM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_components_final.json`, "utf8").replace(/^﻿/, ""));

const beats = [...rawBeats];
let nOv = 0;
const compCount = {};
const OPEN_CLEAR = 3.5;  // los primeros ~3.5s: avatar full SIN cartel (regla dura de apertura)
const MIN_GAP = 13;      // nunca dos componentes encimados/pegados: mínimo 13s entre overlays.
// (auditoría cuadrícula jul 2026: con 7s quedaban 59 carteles = 32% del video tapado por tarjetas
//  crema; el b-roll es la identidad del canal. Con 13s bajan a ~40 y respira.)
const ZONE_FIX = { top: "topLeft" }; // la franja "top" (1824px) tapa casi todo el ancho → achicar
// resolver el ms de cada componente (por frase o pre-resuelto) y ordenar antes de filtrar
const resolved = [];
for (const p of PREMIUM) {
  const s = p.atSec != null ? p.atSec : atc(p.at, p.maxTok || 8);
  if (s == null) continue;
  resolved.push({ ...p, s });
}
resolved.sort((a, b) => a.s - b.s);
let lastOv = -99;
for (const p of resolved) {
  const s = p.s;
  if (s < OPEN_CLEAR) { console.warn("⏭ componente en apertura (drop):", p.comp, s.toFixed(1)); continue; }
  if (s - lastOv < MIN_GAP) { continue; } // se solapa con el anterior → se descarta
  lastOv = s;
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`,
    start: +s.toFixed(2),
    // ≤5.5s en pantalla: la tarjeta se lee en 2s, más tiempo es tapar b-roll.
    // +0.4s de colchón para que el spring de entrada nunca se coma la mitad del plano.
    dur: Math.min(p.dur || 5.5, 5.5) + 0.4,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: ZONE_FIX[p.zone] || p.zone || "topLeft",
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

// ── AVATAR WINDOWS — full ↔ hidden (sin PiP). Hook largo + ventanas ~6.5s cada ~20s ──
const HOOK_END = 10, PERIOD = 20, SLOT = 6.5, SEARCH = 12;
const comps = beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]);
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 10; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4.5 && e - s <= 10 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snapWord(TOTAL - 7);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s < cursor) continue;
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

// ── manifiesto de assets embebido en el Main (para density_gate) ──
const manifest = rawBeats.map((b) => b.src);
const compUses = beats.filter((b) => b.kind === "premium").map((b) => b.comp);
const block =
  `\n/* ASSET_MANIFEST (${manifest.length} tomas · ${nClips} clips reales):\n${manifest.map((s) => `"${s}"`).join(" ")}\n*/\n` +
  `\n/* COMPONENT_MANIFEST (${compUses.length} usos · ${new Set(compUses).size} distintos · reflejan OVERLAYS de cues_${SLUG}.gen.tsx):\n${compUses.map((c) => `<${c} />`).join(" ")}\n*/\n`;
const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
if (fs.existsSync(mainPath)) {
  let main = fs.readFileSync(mainPath, "utf8")
    .replace(/\n\/\* ASSET_MANIFEST[\s\S]*?\*\/\n/, "")
    .replace(/\n\/\* COMPONENT_MANIFEST[\s\S]*?\*\/\n/, "");
  fs.writeFileSync(mainPath, main + block);
}

const fullSecs = fulls.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`beats ${beats.length} (raw ${rawBeats.length}/${srcBeats.length} · ${nClips} clips reales) · premium ${nOv} · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
console.log(`avatar: ${fulls.length} ventanas full · ${fullSecs.toFixed(0)}s visibles (${((fullSecs / TOTAL) * 100).toFixed(0)}%)`);
console.log(`TOTAL_FRAMES = ${Math.round(TOTAL * 30)}`);
