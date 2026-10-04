// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hankwolf_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hankwolf_stock_judge.json", "utf8"));
const ALIAS = { st_wolf: ["st_wolf", "st_wolf4", "st_wolf5", "st_wolf6", "st_wolf2", "st_wolf3", "st_wolfsnow"], st_wolfsnow: ["st_wolfsnow", "st_wolf6", "st_wolf5", "st_snowforest"], st_meeting: ["st_meeting", "st_meeting2", "st_town"], st_cattle: ["st_cattle", "st_cattle2", "st_cattle3"], st_vote: ["st_vote", "st_vote2"], st_mountains: ["st_mountains", "st_mountains2", "st_snowforest", "st_sagebrush"], st_yellowstone: ["st_yellowstone", "st_yellowstone2", "st_elk"], st_elk: ["st_elk", "st_elk2"], st_ranch: ["st_ranch", "st_ranch2", "st_cattle3", "st_truck"], st_river: ["st_river", "st_yellowstone2"], st_town: ["st_town", "st_truck"], st_dusk: ["st_dusk", "st_mountains2"], st_beaver: ["st_beaver", "st_river"], st_hiking: ["st_hiking", "st_snowforest"], st_sheep: ["st_sheep", "st_ranch"] };
const EXCLUDE = new Set(["st_meeting2_1", "st_meeting2_2", "st_wolf6_5", "st_beaver_0", "st_cattle2_2", "st_elk_0", "st_hiking_4", "st_meeting_0", "st_meeting_1", "st_ranch_1", "st_wolf2_0", "st_wolf2_3", "st_wolf2_5", "st_wolf3_3", "st_wolfsnow_0"]);
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hkw_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/hankwolf_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
