// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hazeljewel_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hazeljewel_stock_judge.json", "utf8"));
const ALIAS = { st_jewelry: ["st_jewelry", "st_jewelry2", "st_brooch", "st_jewelry3"], st_ring: ["st_ring", "st_ring2"], st_cameo: ["st_cameo", "st_brooch", "st_jewelry2"], st_watch: ["st_watch", "st_watch2"], st_silver: ["st_silver", "st_antique", "st_jewelry2", "st_magnify"], st_civilwar: ["st_civilwar", "st_oldphoto"], st_oldphoto: ["st_oldphoto", "st_letters"], st_oldhouse: ["st_oldhouse", "st_closet", "st_antique", "st_kitchen"], st_estatesale: ["st_estatesale", "st_antique", "st_oldhouse", "st_jewelry2", "st_closet"], st_closet: ["st_closet", "st_oldhouse", "st_antique", "st_kitchen"], st_brooch: ["st_brooch", "st_cameo", "st_jewelry2"], st_jeweler: ["st_jeweler", "st_jeweler2", "st_magnify"], st_kitchen: ["st_kitchen", "st_family"], st_pearls: ["st_pearls", "st_jewelry2"] };
const EXCLUDE = new Set(["st_civilwar_1", "st_civilwar_3", "st_closet_5", "st_closet_6", "st_jewelry2_3", "st_jewelry2_4", "st_jewelry3_4", "st_jewelry3_5", "st_magnify_4", "st_ring_0", "st_watch_4", "st_watch_5"]); // revisadas a ojo: fuera de tema
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hj_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/hazeljewel_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
