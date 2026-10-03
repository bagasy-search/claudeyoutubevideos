// pool de stock: base pedida por el DIRECTOR ("st_x.n") → n-ésimo tile aprobado por el juez, juntando bases alias
// (mejor tile primero). Escribe _v3/hlheater_stock_pool.json {"st_x.n": "st_y_k"} + lista para bajar.
import fs from "node:fs";
const J = JSON.parse(fs.readFileSync("_v3/hlheater_stock_judge.json", "utf8"));
const ALIAS = { st_plug: ["st_plug", "st_outlet2", "st_cord"], st_breaker: ["st_breaker", "st_electrician"], st_fire: ["st_fire", "st_fire2", "st_firetruck"], st_firetruck: ["st_firetruck", "st_fire2"], st_heater: ["st_heater", "st_heater2", "st_heater3", "st_heater4", "st_heater5", "st_heater6", "st_fireplace", "st_blanket"], st_smoke: ["st_smoke", "st_smoke2", "st_fire2", "st_firetruck", "st_bedroom"], st_thermostat: ["st_thermostat", "st_thermostat2", "st_socks", "st_blanket", "st_fireplace"], st_socks: ["st_socks", "st_blanket", "st_fireplace"], st_lineman: ["st_lineman", "st_lineman2", "st_powerline"], st_electrician: ["st_electrician", "st_electrician2"], st_cat: ["st_cat", "st_dog"], st_winter: ["st_winter", "st_winter2", "st_powerline", "st_family"], st_outlet: ["st_outlet", "st_outlet2", "st_cord", "st_electrician2", "st_electrician"], st_home: ["st_fireplace", "st_family", "st_blanket", "st_socks", "st_bedroom", "st_heater6", "st_cat"], st_generator: ["st_generator", "st_powerline"] };
const EXCLUDE = new Set(["st_plug_1", "st_heater4_4", "st_heater4_5", "st_heater4_6", "st_heater4_7", "st_heater6_0", "st_electrician2_1", "st_electrician2_5", "st_generator_4", "st_winter2_2", "st_breaker_2", "st_cord_2", "st_electrician_4", "st_electrician_5", "st_fire_0", "st_firetruck_2", "st_heater_2", "st_heater5_3", "st_outlet_0", "st_outlet_1", "st_outlet2_4", "st_smoke2_7", "st_thermostat_1", "st_thermostat_7", "st_winter2_0", "st_winter2_1"]); // revisadas a ojo
const tiles = (b) => { const v = J[b]; if (!v) return []; const g = (v.good || []).filter(Number.isInteger); const o = (g.includes(v.best) ? [v.best] : []).concat(g.filter((x) => x !== v.best)); return o.map((i) => `${b}_${i}`).filter((t) => !EXCLUDE.has(t)); };
const map = {}; const used = new Set(); const ids = new Set();
const I = JSON.parse(fs.readFileSync("D:/rtmp/hlh_stock_cand/_candidates.json", "utf8"));
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
fs.writeFileSync("_v3/hlheater_stock_pool.json", JSON.stringify(map, null, 1));
console.log("stock usados", used.size, falta.length ? "⛔ FALTAN " + falta.join(" ") : "");
