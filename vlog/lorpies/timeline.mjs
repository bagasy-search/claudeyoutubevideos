// Arma la línea de tiempo desde el DIRECTOR (dir_a/b/c) anclada al ms real (difflib global) → _v3/lorpies_shots.json
// + reportes: tomas por tipo, % avatar, ventanas de los clips agnes (4-12 s), imágenes a generar, planos largos.
import fs from "node:fs";
import { SHOTS as A } from "./dir_a.mjs";
import { SHOTS as B } from "./dir_b.mjs";
import { SHOTS as C } from "./dir_c.mjs";
import { SHOTS as F } from "./dir_fix.mjs";
const R = "D:/Proyectos/video2-wt/lorpies/";
const P = JSON.parse(fs.readFileSync(R + "_v3/lorpies_paras.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/lorpies_wordms.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const END = +process.env.MASTER_END || W[W.length - 1].e + 0.6;
const shots = [...A, ...B, ...C, ...F];
const errs = [];
for (const s of shots) {
  const p = P[s.p];
  if (!s.at) { s.start = p.s; continue; }
  const pw = W.slice(p.w0, p.w0 + p.nw).map((w) => norm(w.w).join(""));
  const q = norm(s.at).map((x) => x);
  let hit = -1;
  for (let i = 0; i + q.length <= pw.length && hit < 0; i++) if (q.every((t, k) => pw[i + k] === t.replace(/ /g, ""))) hit = i;
  if (hit < 0) { errs.push(`p${s.p} no encuentro "${s.at}"`); s.start = p.s; continue; }
  s.start = W[p.w0 + hit].s - 0.04; // el corte cae 40 ms antes de la palabra
}
shots.sort((a, b) => a.start - b.start);
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); s.start = +s.start.toFixed(3); });
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
// ventanas de los clips hablados: desde la 1ª toma que lo usa hasta el FIN de la última (audio del máster)
const vl = {};
for (const s of shots.filter((s) => s.kind === "vl")) { const v = (vl[s.name] ||= { s: s.start, e: s.end }); v.s = Math.min(v.s, s.start); v.e = Math.max(v.e, s.end); }
const bad = Object.entries(vl).filter(([, v]) => v.e - v.s > 11.8 || v.e - v.s < 3.2);
// resumen
const by = {}; for (const s of shots) by[s.kind] = (by[s.kind] || 0) + s.dur;
const tot = END;
console.log("tomas", shots.length, "· dur", tot.toFixed(1), "s");
for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(4)} ${v.toFixed(1).padStart(7)} s  ${(100 * v / tot).toFixed(1)}%`);
const m1 = shots.filter((s) => s.start < 60);
console.log("minuto 1: cortes", m1.length - 1, "· toma máx", Math.max(...m1.map((s) => Math.min(s.end, 60) - s.start)).toFixed(2), "s");
const largos = shots.filter((s) => s.dur > 12 && !["c", "av"].includes(s.kind)); if (largos.length) console.log("⚠️ planos >12 s:", largos.map((s) => `${s.kind}:${s.name}@${s.start}(${s.dur})`).join(" "));
const avLargos = shots.filter((s) => s.kind === "av" && s.dur > 14); if (avLargos.length) console.log("⚠️ avatar >14 s:", avLargos.map((s) => `@${s.start}(${s.dur})`).join(" "));
if (bad.length) console.log("⛔ clips fuera de 3,2-11,8 s:", bad.map(([k, v]) => `${k} ${(v.e - v.s).toFixed(2)} (${v.s.toFixed(2)}-${v.e.toFixed(2)})`).join(" · "));
const dups = {}; for (const s of shots.filter((s) => ["bi", "lor", "ei"].includes(s.kind))) dups[s.name] = (dups[s.name] || 0) + 1;
const rep = Object.entries(dups).filter(([, n]) => n > 1); if (rep.length) console.log("⛔ imágenes repetidas:", rep.map(([k]) => k).join(" "));
fs.writeFileSync(R + "_v3/lorpies_shots.json", JSON.stringify({ END, shots, vl }, null, 1));
console.log("clips vl:", Object.keys(vl).length, "· imágenes:", Object.keys(dups).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
