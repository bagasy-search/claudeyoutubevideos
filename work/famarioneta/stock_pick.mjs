import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { SPEC } from "./spec.mjs";
const P = {0:1,1:1,2:4,3:1,4:2,5:0,6:1,7:7,8:3,9:1,10:1,11:2,12:2,13:0,14:2,15:4,16:7,17:2,18:2,19:5,20:1,21:4,22:7,24:0,25:7,28:0,29:1,30:2,31:6,32:5,33:2,34:5,35:2,36:1,37:0,38:1,39:0,42:5,43:3,44:7,45:2,46:1,47:1,51:0,53:1,54:0,56:6,57:1,58:0,59:1,60:7,62:5,63:3,64:4,65:1,66:3,67:4,68:5,69:4,70:7,71:7};
const ALT = {25:0,2:6}; // segunda elección si la query se repite
const qs = JSON.parse(fs.readFileSync("work/famarioneta/stock/qs.json", "utf8"));
const byq = JSON.parse(fs.readFileSync("work/famarioneta/stock/byq.json", "utf8"));
const out = "public/broll/famarioneta/stock"; fs.mkdirSync(out, { recursive: true });
const res = {}, usedQ = {}, sin = [];
const RECH = new Set(["m080", "m082", "m102", "m199"]);
const prev = fs.existsSync("_v3/famarioneta_stock_pick.json") ? JSON.parse(fs.readFileSync("_v3/famarioneta_stock_pick.json", "utf8")) : {};
for (const [name, s] of Object.entries(SPEC)) {
  if (s.t !== "S" || RECH.has(name)) continue;
  const qi = qs.indexOf(s.q);
  let pick = s.alt !== undefined ? s.alt : P[qi];
  if (s.alt === undefined && usedQ[qi]) pick = ALT[qi];
  if (pick === undefined) { sin.push(name + " " + s.q); continue; }
  if (s.alt === undefined) usedQ[qi] = true;
  const c = byq[s.q][pick];
  const raw = `${out}/${name}_raw.mp4`;
  if (prev[name] && prev[name].id !== c.id) { for (const f of [raw, `${out}/${name}.mp4`]) if (fs.existsSync(f)) fs.renameSync(f, `work/famarioneta/stock/old_${name}_${prev[name].id}_${path.basename(f)}`); }
  if (!fs.existsSync(raw)) execFileSync("curl", ["-sSL", "--retry", "3", "--max-time", "900", "-o", raw, c.link]);
  res[name] = { q: s.q, id: c.id, raw, dur: c.dur };
  console.log("↓", name, c.id, c.dur);
}
fs.writeFileSync("_v3/famarioneta_stock_pick.json", JSON.stringify(res, null, 1));
console.log("MEDIDO", Object.keys(res).length, "bajados · sin stock:", sin.length); sin.forEach((x) => console.log("  ", x));
