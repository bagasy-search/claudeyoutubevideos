// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hanklynx_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hanklynx_stock_judge.json", "utf8"));
const ALIAS = { st_highlands: ["st_highlands", "st_highlands2", "st_highlands3", "st_loch", "st_road"], st_lynx: ["st_lynx", "st_lynx2", "st_lynx3"], st_deer: ["st_deer", "st_deer2", "st_deer3"], st_sheep: ["st_sheep", "st_sheep2", "st_sheep3", "st_stonewall"], st_pineforest: ["st_pineforest", "st_pineforest2", "st_highlands3"], st_moor: ["st_moor", "st_highlands2", "st_stonewall"], st_village: ["st_village", "st_road"], st_squirrel: ["st_squirrel", "st_eagle"], st_beaver: ["st_beaver", "st_loch"], st_alps: ["st_alps", "st_village"], st_police: ["st_police", "st_village"], st_bison: ["st_bison", "st_deer3"] };
const EXCLUDE = new Set(["st_beaver_0", "st_road_0", "st_sheep2_1", "st_squirrel_3"]);
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hkl_stock_cand/_candidates.json", "utf8"));
const vid = (t) => { const k = t.lastIndexOf("_"); return I[t.slice(0, k)]?.candidates?.find((c) => c.index === +t.slice(k + 1))?.id; };
const { SHOTS: A } = await import("./dir_a.mjs"); const { SHOTS: B } = await import("./dir_b.mjs"); const { SHOTS: C } = await import("./dir_c.mjs");
const want = new Set(); for (const s of [...A, ...B, ...C]) for (const n of [s.kind === "st" ? s.name : null, s.props?.bed]) if (/^st_\w+\.\d+$/.test(n || "")) want.add(n);
const falta = [];
const cursor = {};
for (const w of [...want].sort((a, b) => { const [x, i] = a.split("."), [y, j] = b.split("."); return x < y ? -1 : x > y ? 1 : i - j; })) {
  const [b] = w.split("."); const pool = (ALIAS[b] || [b]).flatMap(tiles);
  let k = cursor[b] || 0; while (k < pool.length && ids.has(vid(pool[k]))) k++;
  const t = pool[k]; cursor[b] = k + 1;
  if (!t) falta.push(w); else { map[w] = t; used.add(t); ids.add(vid(t)); }
}
fs.writeFileSync("_v3/hanklynx_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
