// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/earlshrimpbag_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/earlshrimpbag_stock_judge.json", "utf8"));
const ALIAS = { st_shrimpboat: ["st_shrimpboat", "st_shrimpboat2"], st_harbor: ["st_harbor", "st_harbor2"], st_dockmarket: ["st_dockmarket", "st_dockmarket2"], st_shrimpice: ["st_shrimpice", "st_shrimpice2"], st_shrimpfarm: ["st_shrimpfarm", "st_shrimpfarm2", "st_shrimpfarm3"], st_freezer: ["st_freezer", "st_freezer2", "st_freezer3", "st_freezer4"], st_shrimppeel: ["st_shrimppeel", "st_shrimppeel2"], st_container: ["st_container", "st_container2"] };
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/el_stock_cand/_candidates.json", "utf8"));
const vid = (t) => { const k = t.lastIndexOf("_"); return I[t.slice(0, k)]?.candidates?.find((c) => c.index === +t.slice(k + 1))?.id; };
const { SHOTS: A } = await import("./dir_a.mjs"); const { SHOTS: B } = await import("./dir_b.mjs"); const { SHOTS: C } = await import("./dir_c.mjs");
const want = new Set(); for (const s of [...A, ...B, ...C]) for (const n of [s.kind === "st" ? s.name : null, s.props?.bed]) if (/^st_\w+\.\d+$/.test(n || "")) want.add(n);
const falta = [];
for (const w of [...want].sort((a, b) => { const [x, i] = a.split("."), [y, j] = b.split("."); return x < y ? -1 : x > y ? 1 : i - j; })) { const [b, n] = w.split("."); const pool = (ALIAS[b] || [b]).flatMap(tiles); const free = pool.filter((x) => !ids.has(vid(x)) || used.has(x)); const t = free[+n - 1]; if (!t) falta.push(w); else { map[w] = t; used.add(t); ids.add(vid(t)); } }
fs.writeFileSync("_v3/earlshrimpbag_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
