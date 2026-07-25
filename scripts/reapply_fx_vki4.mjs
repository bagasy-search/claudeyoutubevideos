// reapply_fx_vki4.mjs — vuelve a aplicar los 22 reemplazos de la AUDITORÍA de 93 frames
// sobre beatsheet/vki4lqtcboy0.json. Hay que correrlo DESPUÉS de cada build_vki4lqtcboy0.mjs,
// porque el build regenera el beatsheet desde _v3/*.json y pisa los arreglos.
//
// Cada entrada nació de mirar el frame con la frase que sonaba al lado:
// visuales off-topic (lechuga durante el arroz con leche), gente/cocinas modernas que
// rompen la época del canal, frames muertos ilegibles y dos en blanco y negro.
import fs from "fs";

const P = "beatsheet/vki4lqtcboy0.json";
// beat s_NNN  →  sufijo de la imagen de reemplazo (img/vki4lqtcboy0_fx_<sufijo>.png)
const MAP = {
  "003": "003", "006": "006c", "056": "056", "095": "095", "108": "108",
  "111": "111", "114": "114", "144": "144", "153": "153", "157": "157",
  "180": "180", "189": "189", "196": "196", "235": "235", "237": "237",
  "244": "244", "256": "256", "260": "260b", "284": "284", "287": "287",
  "290": "290", "297": "297",
  // segunda auditoría, ya sobre el video completo (parte 2, minutos 18:30-34:29)
  "379": "379", "416": "416", "475": "475", "497": "497", "630": "630",
};

const raw = JSON.parse(fs.readFileSync(P, "utf8"));
let n = 0;
const missing = [];
for (const b of raw.beats) {
  const m = /_s_(\d{3})$/.exec(b.id || "");
  if (!m) continue;
  const fx = MAP[m[1]];
  if (!fx) continue;
  const p = `img/vki4lqtcboy0_fx_${fx}.png`;
  if (!fs.existsSync(`public/${p}`)) { missing.push(p); continue; }
  b.src = p;
  n++;
}
if (missing.length) { console.error("✗ faltan en disco:", missing); process.exit(1); }
fs.writeFileSync(P, JSON.stringify(raw, null, 1));
console.log(`fx reaplicados: ${n}/${Object.keys(MAP).length}`);
if (n !== Object.keys(MAP).length) { console.error("✗ no se aplicaron todos — ¿cambiaron los ids?"); process.exit(1); }
