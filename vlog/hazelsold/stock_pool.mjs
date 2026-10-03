// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hazelsold_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hazelsold_stock_judge.json", "utf8"));
const ALIAS = { st_figurine: ["st_figurine", "st_figurine2", "st_figurine3", "st_antique"], st_attic: ["st_attic", "st_attic2", "st_moving"], st_dishes: ["st_dishes", "st_dishes2", "st_crystal"], st_books: ["st_books", "st_books2"], st_piano: ["st_piano", "st_piano3", "st_piano2"], st_jewelry: ["st_jewelry", "st_jewelry2"], st_midcentury: ["st_midcentury", "st_midcentury2", "st_midcentury3"], st_vintage: ["st_vintage", "st_vintage2", "st_antique"], st_garagesale: ["st_garagesale3", "st_garagesale4", "st_vintage", "st_antique"], st_quilt: ["st_quilt", "st_quilt2", "st_antique"], st_sewing: ["st_sewing", "st_antique", "st_vintage2"], st_magazines: ["st_magazines", "st_books2"], st_oldhouse: ["st_oldhouse", "st_moving"], st_glass: ["st_glass", "st_crystal"], st_antique: ["st_antique", "st_vintage2", "st_figurine2"] };
const EXCLUDE = new Set(["st_jewelry_5", "st_quilt_3", "st_sewing_5", "st_vintage_4", "st_books_2", "st_castiron_0", "st_dishes_4", "st_figurine_7", "st_figurine_3", "st_garagesale_0", "st_garagesale_2", "st_garagesale_3", "st_glass_1", "st_jewelry_7", "st_magazines_0", "st_oldhouse_0", "st_quilt_0", "st_quilt_2", "st_vintage_5", "st_vintage_7", "st_piano2_0"]); // revisadas a ojo: fuera de tema
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hso_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/hazelsold_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
