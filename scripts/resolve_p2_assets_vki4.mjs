// resolve_p2_assets_vki4.mjs — deja los beats de la parte 2 apuntando a un asset que EXISTE.
//
// Por qué: Pexels throttlea (429) y ~139 de los 187 clips de stock de la parte 2 no se
// pudieron bajar. En este canal el stock genérico con gente sale moderno y rompe la época,
// así que lo que no baja se resuelve como IMAGEN IA on-topic en vez de forzar un clip malo.
//
// Idempotente: correlo después de author_p2_vki4.mjs y antes de build_vki4lqtcboy0.mjs.
//   node scripts/author_p2_vki4.mjs 1110480
//   node scripts/resolve_p2_assets_vki4.mjs           → escribe los prompts que falten
//   (si imprime prompts pendientes: modal run modal_batch.py --list public/img/p2c_vki4_prompts.json)
//   node build_vki4lqtcboy0.mjs && node scripts/reapply_fx_vki4.mjs
import fs from "fs";

const P = "_v3/vki4lqtcboy0_beats_p2.json";
const SUFFIX = ", rustic 1950s Argentine country kitchen setting, warm natural light, casual amateur phone photo, natural imperfections";

const p2 = JSON.parse(fs.readFileSync(P, "utf8"));
const prompts = [];
let conv = 0;
for (const b of p2) {
  const hasImg = fs.existsSync(`public/img/${b.name}.png`);
  const hasVid = fs.existsSync(`public/broll/${b.name}.mp4`);
  if (b.src === "stock" && !hasVid) { b.src = "image"; conv++; }
  if (b.src === "image" && !hasImg) prompts.push({ name: b.name, prompt: b.desc + SUFFIX });
}
fs.writeFileSync(P, JSON.stringify(p2, null, 1));
fs.writeFileSync("public/img/p2c_vki4_prompts.json", JSON.stringify(prompts, null, 1));
// copia blindada: otro agente del worker re-corre el author y revierte este archivo
fs.writeFileSync("_v3/_vki4_beats_p2_RESUELTO.json", JSON.stringify(p2, null, 1));

const by = p2.reduce((a, b) => ((a[b.src] = (a[b.src] || 0) + 1), a), {});
console.log(`beats p2: ${p2.length} · ${JSON.stringify(by)} · stock→imagen: ${conv}`);
console.log(prompts.length ? `⚠ faltan generar ${prompts.length} imágenes → public/img/p2c_vki4_prompts.json` : "✓ todos los beats tienen asset en disco");
