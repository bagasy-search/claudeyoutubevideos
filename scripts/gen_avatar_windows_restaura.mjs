// Regenera avatar_restaura.gen.ts con windowing full ↔ hidden (regla full-o-full).
// - avatar `full` en el hook + slots ~6s cada ~PERIOD s, ubicados en huecos SIN
//   componente overlay (el componente nunca queda tapado por el avatar) y snapeados
//   al inicio de palabra (captions) para no cortar a mitad de frase.
// - `hidden` el resto (b-roll + componentes mandan a pantalla completa).
// NADA de PiP en esquina (feedback_video_avatar_full_or_fullvisual).
import fs from "fs";

const TOTAL = 1445.74;
const HOOK_END = 9;       // avatar full al abrir
const PERIOD = 55;        // reaparece full ~cada 55s
const SLOT = 6;           // duración objetivo del full
const SEARCH = 26;        // ventana de búsqueda de hueco libre hacia adelante

const bs = JSON.parse(fs.readFileSync("beatsheet/restaura.json", "utf8"));
const beats = bs.beats || bs;
const comps = beats.filter(b => b.kind === "premium" && (b.overlay || b.comp))
  .map(b => [b.start, b.start + (b.dur || 3)]);
const cap = JSON.parse(fs.readFileSync("public/captions_restaura.json", "utf8"));
const words = (Array.isArray(cap) ? cap : cap.segments || []).map(w => (w.startMs || 0) / 1000);

const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (t) => {
  // inicio de palabra >= t más cercano (dentro de 1.2s), sino t
  let best = t;
  for (const w of words) { if (w >= t - 0.05) { best = w; break; } }
  return best;
};

// slots full: hook + cada PERIOD, empujando fuera de componentes
const fulls = [];
fulls.push([0, snapWord(HOOK_END)]);
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  let placed = null;
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t);
    const e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { placed = [s, e]; break; }
  }
  if (placed) fulls.push(placed);
}
// cierre full en los últimos ~8s si está libre de componentes
const cs = snapWord(TOTAL - 8);
if (!overlapsComp(cs, TOTAL)) fulls.push([cs, TOTAL - 0.05]);

// construir ventanas: hidden por defecto, full en los slots
fulls.sort((a, b) => a[0] - b[0]);
const wins = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) wins.push({ start: +cursor.toFixed(2), mode: "hidden" });
  wins.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) wins.push({ start: +cursor.toFixed(2), mode: "hidden" });
// primera ventana debe empezar en 0
if (wins[0].start !== 0) wins.unshift({ start: 0, mode: wins[0].mode });
wins.push({ start: TOTAL, mode: "hidden" });

const out = `// avatar_restaura.gen.ts — GENERADO por gen_avatar_windows_restaura.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_RESTAURA = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(wins, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_restaura.gen.ts", out);
const nf = wins.filter(w => w.mode === "full").length;
const secFull = fulls.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`ventanas: ${wins.length} · full: ${nf} · seg full: ${secFull.toFixed(0)}s (${(secFull/TOTAL*100).toFixed(0)}% del video)`);
console.log("primeras 6:", JSON.stringify(wins.slice(0,6)));
