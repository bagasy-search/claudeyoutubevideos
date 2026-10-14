// COMPUERTA DEL PLAN (antes de pagar RunPod/imágenes) — reglas 13-oct medidas en Bertha Cooks. SLUG=x node vlog/claudio/plan_lint.mjs
// Duras (exit 1): cuadro 0 = avatar desde 0 s y ≥5,5 s · hueco máx sin avatar ≤20 s · avatar 22-32 % · cortes minuto 1 ≥30 en el plan
//                 (margen: el auditor por escena junta fotos parecidas) · ningún componente/foto >5 s sin movimiento (sólo aviso: lo
//                 resuelve el Ken-Burns) · ClChapter >5 s.
// Informa: ventanas de avatar (n, mediana, min, max) · b-roll p25/mediana/p75 y fuera de 2,3-5,2 s · cortes/min · mezcla foto/clip/stock.
import { J, V3 } from "./env.mjs";
const { END, shots } = J(V3 + "shots.json");
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
const f1 = (x) => x.toFixed(1);
const errs = [], warn = [];
const av = shots.filter((s) => s.kind === "av");
if (!(shots[0].kind === "av" && shots[0].start < 0.05)) errs.push(`cuadro 0 no es avatar (${shots[0].kind}:${shots[0].name})`);
if (shots[0].kind === "av" && shots[0].dur < 5.5) errs.push(`la 1ª ventana de avatar dura ${f1(shots[0].dur)} s (<5,5)`);
let gmax = 0, gat = 0, last = 0;
for (const s of av) { if (s.start - last > gmax) { gmax = s.start - last; gat = last; } last = s.end; }
if (END - last > gmax) { gmax = END - last; gat = last; }
if (gmax > 20) errs.push(`hueco sin avatar de ${f1(gmax)} s desde ${f1(gat)} s`);
const avT = av.reduce((a, s) => a + s.dur, 0), avP = (100 * avT) / END;
if (avP < 22 || avP > 32) errs.push(`avatar ${f1(avP)} % (fuera de 22-32)`);
const d = av.slice(1).map((s) => s.dur);
const largos = av.slice(1).filter((s) => s.dur > 6.5); if (largos.length) warn.push(`ventanas de avatar >6,5 s: ${largos.map((s) => `@${f1(s.start)}(${f1(s.dur)})`).join(" ")}`);
const m1 = shots.filter((s) => s.start < 60).length - 1;
if (m1 < 30) errs.push(`minuto 1: ${m1} cortes en el plan (<30)`);
const br = shots.filter((s) => ["bi", "cl", "kf", "vl"].includes(s.kind) && s.start >= 60).map((s) => s.dur);
const fuera = shots.filter((s) => ["bi", "cl"].includes(s.kind) && s.start >= 60 && (s.dur > 5.2 || s.dur < 2.3));
const comp = shots.filter((s) => s.kind === "c");
for (const s of comp) if (s.name === "ClChapter" && s.dur > 5) errs.push(`ClChapter de ${f1(s.dur)} s @${f1(s.start)} (poné una toma debajo)`);
const cpm = ((shots.length - 1) / END) * 60;
const kinds = {}; for (const s of shots) kinds[s.kind] = (kinds[s.kind] || 0) + s.dur;
const brT = shots.filter((s) => ["bi", "cl", "kf", "vl"].includes(s.kind));
const moving = brT.filter((s) => s.q || s.anim || s.kind === "kf" || s.kind === "vl" || s.clip).reduce((a, s) => a + s.dur, 0), brSum = brT.reduce((a, s) => a + s.dur, 0);
console.log(`PLAN ${f1(END)} s · ${shots.length} tomas · ${f1(cpm)} cortes/min`);
console.log(`avatar ${f1(avP)} % · ${av.length} ventanas · mediana ${f1(q(d, 0.5))} s (min ${f1(Math.min(...d))} · max ${f1(Math.max(...d))}) · 1ª ${f1(shots[0].dur)} s · hueco máx ${f1(gmax)} s @${f1(gat)}`);
console.log(`minuto 1: ${m1} cortes · b-roll (después del min 1) p25 ${f1(q(br, 0.25))} · mediana ${f1(q(br, 0.5))} · p75 ${f1(q(br, 0.75))} · fuera de 2,3-5,2 s: ${fuera.length}`);
console.log(`b-roll con movimiento propio (stock/clip) ${f1((100 * moving) / Math.max(1, brSum))} % del b-roll (objetivo ~28) · fotos ${(100 - (100 * moving) / Math.max(1, brSum)).toFixed(0)} %`);
console.log("por tipo:", Object.entries(kinds).map(([k, v]) => `${k} ${f1((100 * v) / END)}%`).join(" · "));
console.log("tomas cl (Claudio haciendo):", new Set(shots.filter((s) => s.kind === "cl").map((s) => s.name)).size, "· componentes", comp.length, "(", [...new Set(comp.map((s) => s.name))].join(" "), ")");
if (fuera.length) warn.push(`fuera de rango: ${fuera.slice(0, 14).map((s) => `${s.name}@${f1(s.start)}(${f1(s.dur)})`).join(" ")}`);
for (const w of warn) console.log("⚠️", w);
if (errs.length) { for (const e of errs) console.log("⛔", e); process.exit(1); }
console.log("✅ plan OK");
