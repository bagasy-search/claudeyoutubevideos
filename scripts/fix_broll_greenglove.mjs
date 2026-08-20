// fix_broll_greenglove.mjs — reescribe greenglove_broll.ts con la DURACIÓN REAL de cada clip
// (display nunca excede el metraje → cero fondo negro) y DESCARTA clips rotos/near-white/near-black.
import fs from "fs";
import { execSync } from "child_process";

const TS = "src/_fed6/VideoEdit/greenglove_broll.ts";
const raw = fs.readFileSync(TS, "utf8");
const arr = JSON.parse(raw.match(/=\s*(\[[\s\S]*\]);/)[1]);

const probeDur = (f) => {
  try { return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`, { encoding: "utf8" }).trim()) || 0; }
  catch { return 0; }
};
const yavg = (f, t) => {
  try {
    const out = execSync(`ffmpeg -ss ${t.toFixed(2)} -i "${f}" -vf "signalstats,metadata=mode=print" -frames:v 1 -f null - 2>&1`, { encoding: "utf8" });
    const m = out.match(/YAVG=([0-9.]+)/); return m ? parseFloat(m[1]) : 128;
  } catch { return 128; }
};

const out = [];
let dropped = 0;
for (const b of arr) {
  const f = `public/${b.src}`;
  if (!fs.existsSync(f)) { console.warn(`  ✗ falta ${b.src}`); dropped++; continue; }
  const rd = probeDur(f);
  if (rd < 2.5) { console.warn(`  ✗ roto/corto ${b.src} (${rd}s)`); dropped++; continue; }
  const y = yavg(f, Math.min(rd / 2, 2));
  if (y > 232) { console.warn(`  ✗ near-WHITE ${b.src} (YAVG=${y.toFixed(0)})`); dropped++; continue; }
  if (y < 16) { console.warn(`  ✗ near-BLACK ${b.src} (YAVG=${y.toFixed(0)})`); dropped++; continue; }
  const dur = +Math.min(rd - 0.3, 6.5).toFixed(2);
  out.push({ name: b.name, src: b.src, start: b.start, dur, query: b.query });
}
out.sort((a, b) => a.start - b.start);
fs.writeFileSync(TS, `export const GB_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(out)};\n`);
console.log(`\nOK ${out.length} clips (drop ${dropped}) · duraciones reales, near-white/black descartados`);
