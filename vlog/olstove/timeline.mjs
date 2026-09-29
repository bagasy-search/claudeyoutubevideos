// Arma la línea de tiempo desde el DIRECTOR (dir.mjs) anclada al ms real (difflib global) → _v3/olstove_shots.json
// + reportes: tomas por tipo, % avatar / real, ventanas de los clips agnes (4-12 s), repetidos, planos largos, minuto 1.
import fs from "node:fs";
import { SHOTS } from "./dir.mjs";
const R = "D:/Proyectos/video2-wt/olstove/";
const P = JSON.parse(fs.readFileSync(R + "_v3/olstove_paras.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olstove_wordms.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const END = +process.env.MASTER_END || W[W.length - 1].e + 0.6;
const shots = SHOTS.map((s) => ({ ...s }));
const errs = [];
const flat = W.map((w) => norm(w.w).join(""));
export function findFrom(ph, i0) { const q = norm(ph); for (let i = i0; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; }
for (const s of shots) {
  const p = P[s.p];
  if (!s.at) { s.start = p.s; s.w0 = p.w0; continue; }
  const hit = findFrom(s.at, p.w0);
  if (hit < 0 || hit >= p.w0 + p.nw) { errs.push(`p${s.p} no encuentro "${s.at}"`); s.start = p.s; continue; }
  s.start = W[hit].s - 0.04; s.w0 = hit; // el corte cae 40 ms antes de la palabra
}
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
shots.sort((a, b) => a.start - b.start);
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); s.start = +s.start.toFixed(3); });
if (shots[0].start > 0) shots[0].start = 0;
const vl = {};
for (const s of shots.filter((s) => s.kind === "vl")) { const v = (vl[s.name] ||= { s: s.start, e: s.end }); v.s = Math.min(v.s, s.start); v.e = Math.max(v.e, s.end); }
const bad = Object.entries(vl).filter(([, v]) => v.e - v.s > 11.8 || v.e - v.s < 3.2);
const by = {}; for (const s of shots) by[s.kind] = (by[s.kind] || 0) + s.dur;
console.log("tomas", shots.length, "· dur", END.toFixed(1), "s");
for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(4)} ${v.toFixed(1).padStart(7)} s  ${(100 * v / END).toFixed(1)}%`);
console.log("  REAL (st+ar)", (((by.st || 0) + (by.ar || 0)) / END * 100).toFixed(1) + "%", "· AVATAR", ((by.av || 0) / END * 100).toFixed(1) + "%");
const m1 = shots.filter((s) => s.start < 60);
console.log("minuto 1: cortes", m1.length - 1, "· toma máx", Math.max(...m1.map((s) => Math.min(s.end, 60) - s.start)).toFixed(2), "s");
const largos = shots.filter((s) => s.dur > 12 && !["c", "av"].includes(s.kind)); if (largos.length) console.log("⚠️ planos >12 s:", largos.map((s) => `${s.kind}:${s.name}@${s.start}(${s.dur})`).join(" "));
const avLargos = shots.filter((s) => s.kind === "av" && s.dur > 14); if (avLargos.length) console.log("⚠️ avatar >14 s:", avLargos.map((s) => `@${s.start}(${s.dur})`).join(" "));
if (bad.length) console.log("⛔ clips fuera de 3,2-11,8 s:", bad.map(([k, v]) => `${k} ${(v.e - v.s).toFixed(2)} (${v.s.toFixed(2)}-${v.e.toFixed(2)})`).join(" · "));
const dups = {}; for (const s of shots.filter((s) => ["bi", "ole", "st", "ar", "kf"].includes(s.kind))) dups[s.name] = (dups[s.name] || 0) + 1;
const rep = Object.entries(dups).filter(([, n]) => n > 1); if (rep.length) console.log("⛔ assets repetidos:", rep.map(([k]) => k).join(" "));
const kfLong = shots.filter((s) => s.kind === "kf" && s.dur > 8); if (kfLong.length) console.log("⚠️ kf >8 s:", kfLong.map((s) => `${s.name}(${s.dur})`).join(" "));
const stLong = shots.filter((s) => s.kind === "st" && s.dur > 7); if (stLong.length) console.log("⚠️ stock >7 s:", stLong.map((s) => `${s.name}(${s.dur})`).join(" "));
fs.writeFileSync(R + "_v3/olstove_shots.json", JSON.stringify({ END, shots, vl }, null, 1));
console.log("clips vl:", Object.keys(vl).length, "·", Object.entries(vl).map(([k, v]) => `${k} ${v.s.toFixed(2)}-${v.e.toFixed(2)}`).join(" | "));
console.log("kf:", shots.filter((s) => s.kind === "kf").length, "· bi/ole:", shots.filter((s) => ["bi", "ole"].includes(s.kind)).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
