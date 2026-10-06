// replan_legacy.mjs — corre el MOTOR de la fábrica (planVlog) sobre los datos de un video armado con el
// pipeline VIEJO (_v3/<slug>_mom.json, _plan.json, _ventanas.json + public/{img,broll}/<slug>) SIN escribir
// nada en src/. Sirve para comparar "lo que se entregó" contra "lo que haría la fábrica" con los mismos assets.
//
//   node factory/tools/replan_legacy.mjs <slug> [--json]
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/env.mjs";
import { planVlog } from "../lib/vlogplan.mjs";
import { durSec, frameCount } from "../lib/exec.mjs";

const [slug, ...rest] = process.argv.slice(2);
if (!slug) { console.error("uso: node factory/tools/replan_legacy.mjs <slug> [--json] [--wav <ruta>]"); process.exit(1); }
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${slug}_${f}.json`), "utf8"));
const mom = J("mom"), plan = J("plan"), vent = J("ventanas");
const wi = rest.indexOf("--wav");
const wav = wi >= 0 ? rest[wi + 1] : `D:/rtmp/${slug}_audio/${slug}.wav`;
const wavSec = await durSec(wav);

const IMG = path.join(ROOT, "public", "img", slug), CLIP = path.join(ROOT, "public", "broll", slug);
const frames = new Map();
const rels = [];
const assetOf = (name) => {
  if (fs.existsSync(path.join(CLIP, `${name}.mp4`))) { const src = `broll/${slug}/${name}.mp4`; rels.push(src); return { tipo: "clip", src }; }
  if (fs.existsSync(path.join(IMG, `${name}.jpg`))) return { tipo: "foto", src: `img/${slug}/${name}.jpg` };
  return null;
};
// pre-medición de cuadros (el motor es síncrono y puro: los números entran ya medidos)
for (const p of plan) { assetOf(p.name); assetOf(`${p.name}x`); }
const uniq = [...new Set(rels)];
let k = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (k < uniq.length) { const src = uniq[k++]; try { frames.set(src, await frameCount(path.join(ROOT, "public", src))); } catch { frames.set(src, 0); } }
}));
const r = planVlog({
  mom, plan, ventanasSec: vent, wavSec, assetOf,
  framesOf: (src) => frames.get(src) ?? 0,
  finFoto: (name) => ({ tipo: "foto", src: `img/${slug}/${name}_fin.jpg` }),
  cta: { regex: /^Si esto te sirvió, suscribite/i, head: "Suscribite", sub: "" },
});
if (rest.includes("--json")) console.log(JSON.stringify({ slug, medido: r.medido, problemas: r.problemas }, null, 1));
else {
  console.log(`=== FÁBRICA sobre ${slug} (clips medidos ${uniq.length}) ===`);
  for (const [a, b] of Object.entries(r.medido)) if (!Array.isArray(b)) console.log(`  ${a.padEnd(26, ".")} ${b}`);
  console.log(`  problemas ${r.problemas.length}`);
  for (const p of r.problemas) console.log("   ⛔ " + p);
}
