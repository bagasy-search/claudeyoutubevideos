// Asigna a cada toma `st_<clave>_<n>` un video aprobado por el juez (rústico desc.), sin repetir, y arma la hoja de contactos.
// node vlog/olstove/stock_select.mjs → D:/rtmp/olstove_src/pex/sel.json + D:/rtmp/olstove/sel_sheet.jpg
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olstove/", P = "D:/rtmp/olstove_src/pex/";
const pool = JSON.parse(fs.readFileSync(P + "pool.json", "utf8")), J = JSON.parse(fs.readFileSync(P + "juez.json", "utf8"));
const QK = JSON.parse(fs.readFileSync(R + "vlog/olstove/pexels_pool.mjs", "utf8").match(/const QK = (\{.*?\});/s)[1]);
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olstove_shots.json", "utf8"));
const old = fs.existsSync(P + "sel.json") ? JSON.parse(fs.readFileSync(P + "sel.json", "utf8")) : {};
const sel = { ...old }, used = new Set(Object.values(sel));
const need = shots.filter((s) => s.kind === "st").map((s) => ({ name: s.name, key: s.name.split("_")[1], dur: s.dur }));
for (const n of need) {
  if (sel[n.name]) continue;
  const qs = QK[n.key] || [];
  const cands = Object.values(pool).filter((v) => qs.includes(v.q) && !used.has(String(v.id)) && J[v.id] && J[v.id].ontopic && !J[v.id].modern && !J[v.id].text && J[v.id].rustic >= 5 && v.dur >= Math.min(6, n.dur + 1))
    .sort((a, b) => (J[b.id].rustic - J[a.id].rustic) || (b.dur - a.dur));
  if (!cands.length) { console.log("⛔ sin candidato:", n.name); continue; }
  sel[n.name] = String(cands[0].id); used.add(String(cands[0].id));
}
fs.writeFileSync(P + "sel.json", JSON.stringify(sel, null, 1));
console.log("asignados", Object.keys(sel).length, "de", need.length);
