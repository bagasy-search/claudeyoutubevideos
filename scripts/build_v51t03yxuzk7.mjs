// Build del video v51t03yxuzk7 — "El truco de $2 para la humedad del sótano" (canal El Constructor Libre)
// Toma el mapa de los 10 directores (_v3/beats_all.json) y emite:
//   beatsheet/v51t03yxuzk7.json        → lo consume `node beatsheet.mjs`
//   src/VideoEdit/avatar_v51t03yxuzk7.gen.ts → AVATAR_WINDOWS + TOTAL_V51 (segundos)
import fs from "fs";

const SLUG = "v51t03yxuzk7";
const TOTAL = 2219.25; // segundos reales del avatar (ffprobe)

const beats = JSON.parse(fs.readFileSync("_v3/beats_all.json", "utf8"));
beats.sort((a, b) => a.start - b.start);

// ── 1. beatsheet ────────────────────────────────────────────────────────────
// Se limpian los campos propios del mapa (stock/gen2) que beatsheet.mjs no conoce.
const clean = beats.map((b) => {
  const { stock, gen2, ...rest } = b;
  return rest;
});

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(
  `beatsheet/${SLUG}.json`,
  JSON.stringify(
    {
      video: SLUG,
      avatar: `${SLUG}_opt.mp4`,
      total: TOTAL,
      maxRawDur: 4.2,
      beats: clean,
    },
    null,
    1
  )
);

// ── 2. ventanas del avatar ──────────────────────────────────────────────────
// `talk` = avatar a pantalla completa. Todo lo demás = oculto (el audio sigue sonando).
const windows = [];
let last = null;
for (const b of beats) {
  const mode = b.kind === "talk" ? "full" : "hidden";
  if (mode !== last) {
    windows.push({ start: +b.start.toFixed(2), mode });
    last = mode;
  }
}
// El video abre con la cara: si el primer beat no fuera talk, forzamos full en 0.
if (windows[0].start > 0 || windows[0].mode !== "full") {
  windows.unshift({ start: 0, mode: "full" });
}

fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// GENERADO por scripts/build_${SLUG}.mjs — no editar a mano\n` +
    `import type { AvatarWindow } from "./scenes/AvatarLayer";\n\n` +
    `export const TOTAL_V51 = ${TOTAL};\n\n` +
    `export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows)};\n`
);

const talk = beats.filter((b) => b.kind === "talk");
const talkSec = talk.reduce((a, b) => a + b.dur, 0);
console.log(`beats: ${beats.length} · ventanas avatar: ${windows.length}`);
console.log(`avatar full: ${talk.length} tramos · ${talkSec.toFixed(0)}s (${((talkSec / TOTAL) * 100).toFixed(0)}% del video)`);
console.log(`primer beat: ${beats[0].kind} @${beats[0].start}s dur ${beats[0].dur}s`);
