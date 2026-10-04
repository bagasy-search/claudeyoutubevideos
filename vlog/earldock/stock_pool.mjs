// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/earldock_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/earldock_stock_judge.json", "utf8"));
const ALIAS = { st_shrimp: ["st_shrimp", "st_shrimp2", "st_shrimp3", "st_shrimp4"], st_seafood: ["st_seafood", "st_store3", "st_seafood2", "st_ice2", "st_shrimp2"], st_store: ["st_store", "st_store3", "st_store2", "st_receipt"], st_shrimpboat: ["st_shrimpboat", "st_shrimpboat4", "st_shrimpboat2", "st_shrimpboat3"], st_harbor: ["st_harbor", "st_harbor3", "st_harbor2", "st_gulf"], st_fishermen: ["st_fishermen", "st_shrimpboat4", "st_harbor3"], st_warehouse: ["st_warehouse", "st_warehouse2"], st_truck: ["st_truck3", "st_truck2", "st_truck"], st_frozen: ["st_frozen", "st_store2", "st_ice2", "st_warehouse"], st_ice: ["st_ice", "st_ice2"], st_gumbo: ["st_gumbo", "st_cooking"], st_peel: ["st_peel", "st_shrimp3", "st_cooking", "st_shrimp4"], st_cash: ["st_cash", "st_receipt"] };
const EXCLUDE = new Set(["st_shrimpboat3_1", "st_shrimpboat3_2", "st_harbor3_6", "st_harbor3_7", "st_shrimp2_7", "st_shrimpboat2_5", "st_shrimpboat3_4", "st_shrimp2_1", "st_ice2_0", "st_fishermen_4", "st_harbor3_1", "st_harbor3_2", "st_harbor3_3", "st_harbor3_4", "st_harbor3_5", "st_harbor_0", "st_harbor_3", "st_ice_0", "st_ice_7", "st_store3_0", "st_store3_3", "st_store3_6", "st_store_3", "st_fishermen_0", "st_fishermen_1", "st_fishermen_2", "st_frozen_4", "st_harbor_1", "st_harbor_4", "st_harbor_5", "st_harbor_6", "st_ice_1", "st_ice_2", "st_ice_3", "st_ice_5", "st_seafood_1", "st_seafood_2", "st_seafood_4", "st_seafood_5", "st_seafood_7", "st_shrimpboat2_1", "st_shrimpboat2_2", "st_store_1", "st_store_4", "st_store_5", "st_store2_7", "st_truck_1", "st_truck_3", "st_truck_5", "st_shrimp_1"]);
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger).filter((i) => !EXCLUDE.has(`${b}_${i}`)); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/ed_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/earldock_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
