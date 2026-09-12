import fs from "fs";
const c = JSON.parse(fs.readFileSync("public/captions_replantar.json", "utf8"));
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = c.map(w => ({ n: norm(w.text), ms: w.startMs, t: w.text }));
const at = p => { const t = norm(p).split(" "); for (let i = 0; i <= W.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; } if (ok) return W[i].ms / 1000; } return null; };
const fmt = s => s == null ? "  --MISS" : (Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0"));

console.log("=== primeros 8s ===");
console.log(W.filter(w => w.ms < 8000).map(w => `${(w.ms/1000).toFixed(1)}:${w.t}`).join(" "));

// scan loops
const wn = W.map(w => w.n);
const N = 8, seen = {};
for (let i = 0; i + N <= wn.length; i++) { const g = wn.slice(i, i + N).join(" "); (seen[g] = seen[g] || []).push(W[i].ms / 1000); }
const reps = Object.entries(seen).filter(([g, ts]) => ts.length >= 2 && g.replace(/ /g, "").length > 24).sort((a, b) => b[1].length - a[1].length);
console.log(`\n=== LOOPS (8-grams repetidos): ${reps.length} ===`);
for (const [g, ts] of reps.slice(0, 8)) console.log(`x${ts.length} [${ts.slice(0,5).map(t=>fmt(t)).join(", ")}${ts.length>5?"...":""}] ${g}`);

console.log("\n=== sección cebolla #1 (texto, chequear limpio) ===");
const u = at("empecemos por el numero uno");
if (u != null) { const i = W.findIndex(w => w.ms / 1000 >= u); console.log(W.slice(i, i + 110).map(w => w.t).join(" ")); }

const SECT = ["para cuando termines","quedate conmigo hasta el final","me llamo levi","pero antes dejame contarte","empecemos por el numero uno","el numero dos es la lechuga|el numero 2 es la lechuga","el numero tres es el apio|el numero 3 es el apio","el numero cuatro es el bok choy|el numero 4 es el bok choy","el numero cinco es el puerro|el numero 5 es el puerro","el numero seis es la albahaca|el numero 6 es la albahaca","el numero siete es la menta|el numero 7 es la menta","contarte el error","el numero ocho es el cilantro|el numero 8 es el cilantro","el numero nueve es el ajo|el numero 9 es el ajo","el numero diez es el jengibre|el numero 10 es el jengibre","llegamos al numero once|llegamos al numero 11","el numero doce es la prima dulce|el numero 12 es la prima dulce","el numero trece es la zanahoria|el numero 13 es la zanahoria","el numero catorce es el tomate|el numero 14 es el tomate","llegamos al numero quince|llegamos al numero 15","aqui esta tu regalo","asi que hagamos la cuenta","esto es lo que quiero que hagas hoy","suscribete al canal"];
console.log("\n=== SECT (con variantes dígito|texto) ===");
let miss = 0;
for (const spec of SECT) { const opts = spec.split("|"); let t = null, used = ""; for (const o of opts) { const r = at(o); if (r != null) { t = r; used = o; break; } } if (t == null) { miss++; console.log(`  --MISS  ${opts[0]}`); } else console.log(`${fmt(t).padEnd(7)} ${used}`); }
console.log(`\n>>> SECT faltantes: ${miss} · palabras: ${W.length} · ultima: ${(W[W.length-1].ms/1000).toFixed(1)}s`);
