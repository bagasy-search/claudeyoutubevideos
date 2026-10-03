// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/earlboil_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/earlboil_stock_judge.json", "utf8"));
const ALIAS = { st_shrimp: ["st_shrimp", "st_shrimp2", "st_shrimp3", "st_shrimp4", "st_shrimp5", "st_shrimp6"], st_shrimp2: ["st_shrimp2", "st_shrimp5", "st_shrimp6", "st_shrimp", "st_shrimp3", "st_shrimp4"], st_shrimp3: ["st_shrimp3", "st_shrimp4", "st_shrimp"], st_corn: ["st_corn", "st_corn2", "st_potato", "st_potato2", "st_boil2"], st_potato: ["st_potato", "st_potato2", "st_corn2"], st_crawfish: ["st_crawfish", "st_crawfish2", "st_boil3"], st_eat: ["st_eat", "st_family"], st_restaurant: ["st_restaurant", "st_eat", "st_shrimp3", "st_shrimp5", "st_shrimp4"], st_gumbo: ["st_gumbo", "st_boil3", "st_boil"], st_peel: ["st_peel", "st_peel2"], st_shrimpboat: ["st_shrimpboat", "st_shrimpboat2", "st_boats"], st_harbor: ["st_harbor", "st_harbor2"], st_boil: ["st_boil", "st_boil2", "st_boil3"], st_cookout: ["st_cookout", "st_cookout2", "st_family"] };
const EXCLUDE = new Set(["st_cookout_0", "st_corn2_2", "st_eat_3", "st_eat_6", "st_harbor_5", "st_restaurant_3", "st_restaurant_4", "st_restaurant_5", "st_gumbo_5"]);
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger).filter((i) => !EXCLUDE.has(`${b}_${i}`)); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/eb_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/earlboil_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
