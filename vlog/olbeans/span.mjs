// span.mjs "<frase inicio>" "<frase fin>" → s/e en el máster (ms del anclaje difflib global). Uso: node vlog/olbeans/span.mjs "There's a bowl" "in water."
import fs from "node:fs";
const W = JSON.parse(fs.readFileSync("_v3/olbeans_wordms.json", "utf8"));
const n = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const flat = W.map((w) => n(w.w).join(""));
export function find(ph, from = 0) { const q = n(ph); for (let i = from; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; }
export function span(a, b) { const i = find(a); const j = find(b, i); if (i < 0 || j < 0) throw new Error(`no encuentro ${i < 0 ? a : b}`); const e = j + n(b).length - 1; return { s: W[i].s, e: W[e].e, text: W.slice(i, e + 1).map((w) => w.w).join(" ") }; }
if (process.argv[2]) { const r = span(process.argv[2], process.argv[3]); console.log(r.s.toFixed(2), r.e.toFixed(2), (r.e - r.s).toFixed(2), r.text); }
