import fs from "node:fs";
import { SPEC } from "./spec.mjs";
const M = JSON.parse(fs.readFileSync("_v3/famarioneta_moments.json", "utf8"));
const tipo = new Array(M.length).fill(null);
const faltan = [];
for (let i = 0; i < M.length; i++) {
  const s = SPEC[M[i].name];
  if (!s) { if (!tipo[i]) faltan.push(M[i].name); continue; }
  for (let k = 0; k < (s.span || 1); k++) if (i + k < M.length) tipo[i + k] = s.t;
}
const faltaReal = M.filter((m, i) => !tipo[i]).map((m) => m.name);
const tot = M.reduce((a, m) => a + (m.dur ?? m.txt.length), 0);
const by = {};
M.forEach((m, i) => { by[tipo[i]] = (by[tipo[i]] || 0) + (m.dur ?? m.txt.length); });
console.log("sin tipo:", faltaReal.join(","));
for (const [k, v] of Object.entries(by)) console.log(k, (100 * v / tot).toFixed(1) + "%");
const comps = Object.values(SPEC).filter((s) => s.t === "C").map((s) => s.c).concat(Object.values(SPEC).filter((s) => s.ov).map((s) => s.ov.c));
console.log("componentes", comps.length, "tipos", new Set(comps).size, [...new Set(comps)].join(" "));
