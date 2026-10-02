// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/opalnolay_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/opalnolay_stock_judge.json", "utf8"));
const ALIAS = { st_hensyard: ["st_hensyard", "st_hens2", "st_hens3", "st_hens4", "st_hens5", "st_hens6"], st_snowhens: ["st_winter", "st_winter2"], st_feedstore: ["st_feed3"], st_fox: ["st_fox2"], st_cleaning: ["st_shovel"], st_feathers: ["st_feather2"] };
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/op_stock_cand/_candidates_all.json", "utf8"));
const vid = (t) => { const k = t.lastIndexOf("_"); return I[t.slice(0, k)]?.candidates?.find((c) => c.index === +t.slice(k + 1))?.id; };
const { SHOTS: A } = await import("./dir_a.mjs"); const { SHOTS: B } = await import("./dir_b.mjs"); const { SHOTS: C } = await import("./dir_c.mjs");
const want = new Set(); for (const s of [...A, ...B, ...C]) for (const n of [s.kind === "st" ? s.name : null, s.props?.bed]) if (/^st_\w+\.\d+$/.test(n || "")) want.add(n);
const falta = [];
for (const w of [...want].sort()) { const [b, n] = w.split("."); const pool = (ALIAS[b] || [b]).flatMap(tiles); const free = pool.filter((x) => !ids.has(vid(x)) || used.has(x)); const t = free[+n - 1]; if (!t) falta.push(w); else { map[w] = t; used.add(t); ids.add(vid(t)); } }
fs.writeFileSync("_v3/opalnolay_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
