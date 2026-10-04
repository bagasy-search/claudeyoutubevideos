// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hlpower_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hlpower_stock_judge.json", "utf8"));
const ALIAS = { st_lineman: ["st_lineman", "st_lineman2", "st_buckettruck"], st_buckettruck: ["st_buckettruck", "st_lineman2", "st_lineman"], st_storm: ["st_storm", "st_storm2", "st_storm3", "st_powerline"], st_hurricane: ["st_hurricane", "st_hurricane2", "st_storm2"], st_window: ["st_window", "st_candle", "st_lantern"], st_towers: ["st_towers", "st_powerline", "st_substation"], st_substation: ["st_substation", "st_towers"], st_hospital: ["st_hospital", "st_lights", "st_winterhouses"], st_winterhouses: ["st_winterhouses", "st_lights", "st_rural"], st_computer: ["st_computer", "st_phone"], st_candle: ["st_candle", "st_lantern", "st_family"] };
const EXCLUDE = new Set(["st_computer_3", "st_generator_7", "st_lights_1", "st_lineman2_3", "st_powerline_3", "st_storm_7"]); // revisadas a ojo
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hlp_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/hlpower_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
