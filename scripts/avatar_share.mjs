// avatar_share.mjs — cuánto tiempo está la BATA en pantalla, por video.
//
// Por qué existe: density_gate mide componentes y momentos visuales, y `AvatarLayer`/`AvatarWindow`
// están en su set ESTRUCTURA, o sea que NO cuentan para nada. Cada segundo de avatar full le
// empeora al agente las dos métricas que sí se le exigen (1 visual cada 5s, 7 comp/min), así que
// el sistema empuja a esconderlo. Esto MIDE lo que esa compuerta ignora.
//
//   node scripts/avatar_share.mjs            → todos los videos con avatar_*.gen.ts
//   node scripts/avatar_share.mjs <slug>     → uno solo, con el detalle de los tramos
import { readFileSync, readdirSync, existsSync } from "fs";

const DIRS = ["src/VideoEdit", "src/_fed6/VideoEdit"];
const arg = process.argv[2];

const leer = (p) => {
  const txt = readFileSync(p, "utf8");
  const total = +(txt.match(/export const TOTAL_[A-Z0-9_]+\s*=\s*([\d.]+)/)?.[1] || 0);
  const wins = [...txt.matchAll(/"start":\s*([\d.]+),\s*"mode":\s*"(\w+)"/g)].map((m) => ({ t: +m[1], mode: m[2] }));
  if (!total || wins.length < 2) return null;
  wins.sort((a, b) => a.t - b.t);
  const dur = {};
  for (let i = 0; i < wins.length; i++) {
    const fin = i + 1 < wins.length ? wins[i + 1].t : total;
    dur[wins[i].mode] = (dur[wins[i].mode] || 0) + Math.max(0, fin - wins[i].t);
  }
  // "full" es la bata a pantalla completa. Cualquier cornerXX es PiP (que el creador prohibió).
  const full = dur.full || 0;
  const pip = Object.entries(dur).filter(([m]) => /^corner/i.test(m)).reduce((s, [, v]) => s + v, 0);
  return { total, dur, full, pip, wins };
};

const filas = [];
for (const d of DIRS) {
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d).filter((f) => /^avatar_.*\.gen\.ts$/.test(f))) {
    const slug = f.replace(/^avatar_|\.gen\.ts$/g, "");
    if (arg && slug !== arg) continue;
    const r = leer(`${d}/${f}`);
    if (r) filas.push({ slug, ...r });
  }
}
if (!filas.length) { console.error(arg ? `sin datos para ${arg}` : "sin avatar_*.gen.ts"); process.exit(1); }

const pct = (x, t) => (100 * x / t);
filas.sort((a, b) => pct(a.full, a.total) - pct(b.full, b.total));

console.log(`\n${"slug".padEnd(14)} ${"min".padStart(6)} ${"full".padStart(7)} ${"seg full".padStart(9)} ${"PiP".padStart(6)}   tramos full`);
console.log("─".repeat(74));
for (const f of filas) {
  const tramos = [];
  for (let i = 0; i < f.wins.length; i++) {
    if (f.wins[i].mode !== "full") continue;
    const fin = i + 1 < f.wins.length ? f.wins[i + 1].t : f.total;
    tramos.push(fin - f.wins[i].t);
  }
  const med = tramos.length ? [...tramos].sort((a, b) => a - b)[Math.floor(tramos.length / 2)] : 0;
  console.log(
    `${f.slug.padEnd(14)} ${(f.total / 60).toFixed(1).padStart(6)} ${(pct(f.full, f.total).toFixed(1) + "%").padStart(7)} ` +
    `${Math.round(f.full).toString().padStart(9)} ${(pct(f.pip, f.total).toFixed(0) + "%").padStart(6)}   ` +
    `${tramos.length} tramos · mediana ${med.toFixed(1)}s · más largo ${(Math.max(0, ...tramos)).toFixed(1)}s`
  );
}
const share = filas.map((f) => pct(f.full, f.total)).sort((a, b) => a - b);
const med = share[Math.floor(share.length / 2)];
console.log("─".repeat(74));
console.log(`${filas.length} videos · avatar full: mediana ${med.toFixed(1)}%  ·  mínimo ${share[0].toFixed(1)}%  ·  máximo ${share[share.length - 1].toFixed(1)}%`);
if (arg) {
  console.log(`\nmodos en ${arg}:`);
  const f = filas[0];
  for (const [m, v] of Object.entries(f.dur).sort((a, b) => b[1] - a[1]))
    console.log(`  ${m.padEnd(12)} ${Math.round(v).toString().padStart(5)}s  ${pct(v, f.total).toFixed(1)}%`);
}
