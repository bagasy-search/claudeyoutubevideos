// medir_timeline.mjs — audita un build YA GENERADO (sin rendear): avatar tapado, placa, cobertura,
// destellos, repetidos. Sirve para videos entregados (G1: ¿tcestufa tiene el bug de tcbriquetas?).
//
//   node factory/tools/medir_timeline.mjs <slug> [<slug> ...]   [--json]
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/env.mjs";
import { medirTimeline, parseBuildGenerado } from "../lib/timeline.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const slugs = args.filter((a) => !a.startsWith("--"));
if (!slugs.length) { console.error("uso: node factory/tools/medir_timeline.mjs <slug> [...] [--json]"); process.exit(1); }

const out = [];
let malos = 0;
for (const slug of slugs) {
  const gen = path.join(ROOT, "src", slug, `cues_${slug}.gen.tsx`);
  const main = path.join(ROOT, "src", slug, `Main_${slug}.tsx`);
  if (!fs.existsSync(gen) || !fs.existsSync(main)) { out.push({ slug, error: "sin build generado (cues_<slug>.gen.tsx + Main_<slug>.tsx)" }); malos++; continue; }
  const b = parseBuildGenerado(fs.readFileSync(gen, "utf8"), fs.readFileSync(main, "utf8"));
  if (!b.base.length || !b.total) { out.push({ slug, error: `no pude leer el build (cues ${b.base.length}, total ${b.total})` }); malos++; continue; }
  const m = medirTimeline(b);
  out.push({ slug, ...m });
  if (m.avatarTapadoInteriorSec > 1) malos++;
}
if (json) console.log(JSON.stringify(out, null, 1));
else for (const r of out) {
  if (r.error) { console.log(`${r.slug}: ⛔ ${r.error}`); continue; }
  console.log(`${r.slug}: ${r.totalSec}s · cues ${r.cues} · ventanas ${r.ventanas} (${r.ventanaSec}s) · AVATAR TAPADO ${r.avatarTapadoInteriorSec}s (${r.avatarTapadoPct}%) ${r.avatarTapadoInteriorSec > 1 ? "⛔" : "✓"} · placa ${r.placaVistaSec}s · cobertura ${r.coberturaPct}% · destellos ${r.destellos} · repes ${r.repesConsecutivos}`);
  for (const w of r.peoresVentanas.slice(0, 5)) console.log(`    w${w.k} @${w.desdeSec}s (${w.durSec}s): tapado ${w.tapadoSec}s`);
}
process.exit(malos ? 1 : 0);
