// Arma la línea de tiempo desde el DIRECTOR (dir_a/b/c) anclada al ms real (difflib global) → _v3/lorham_shots.json
// + reportes: tomas por tipo, % avatar, ventanas de los clips agnes (4-12 s), imágenes a generar, planos largos.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SHOTS as A } from "./dir_a.mjs";
import { SHOTS as B } from "./dir_b.mjs";
import { SHOTS as C } from "./dir_c.mjs";
import { SHOTS as D } from "./dir_d.mjs";
import { SHOTS as F } from "./dir_fix.mjs";
const R = "D:/Proyectos/video2-wt/lorham/";
const P = JSON.parse(fs.readFileSync(R + "_v3/lorham_paras.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/lorham_wordms.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const END = +process.env.MASTER_END || W[W.length - 1].e + 0.6;
const shots = [...A, ...B, ...C, ...D, ...F];
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
// ⛔ AVATAR CONGELADO: el reel de RunPod se cortó del máster ANTES de comprimir las pausas del minuto 1 (−Δ s). Las tomas `av` salen de
// _v3/lorham_av_frozen.json (tiempos del máster viejo, desplazados Δ), no de la regla automática: así cada toma av cae dentro de su ventana del reel.
const FZF = R + "_v3/lorham_av_frozen.json", WO = R + "_v3/lorham_wordms_old.json";
let DELTA = 0, FROZEN = false;
if (fs.existsSync(FZF) && fs.existsSync(WO) && !process.env.NOFREEZE) {
  const dd = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8", windowsHide: true }).trim();
  DELTA = dd(R + "out/lorham_master_old.wav") - dd(R + "public/lorham.wav"); FROZEN = true; // Δ EXACTO por duración (todo lo comprimido está antes del seg 64)
  for (let i = shots.length - 1; i >= 0; i--) if (shots[i].kind === "av") shots.splice(i, 1);
  const fz = JSON.parse(fs.readFileSync(FZF, "utf8")).av.map((a) => ({ s: +(a.s - DELTA).toFixed(3), e: +(a.e - DELTA).toFixed(3) }));
  for (const a of fz) shots.push({ kind: "av", name: "", p: -1, at: "", start: a.s, frozen: 1 });
  // las tomas no-av que caen a ±0,45 s de una frontera del avatar (jitter del ASR entre corridas) se pegan a la frontera EXACTA del avatar congelado
  for (const s of shots) { if (s.kind === "av") continue;
    for (const a of fz) { if (Math.abs(s.start - a.e) < 0.8) { s.start = a.e; break; } if (s.start > a.s && s.start < a.e) { s.start = a.e; break; } } }
  console.log("avatar congelado: Δ", DELTA.toFixed(3), "s ·", shots.filter((s) => s.frozen).length, "tomas av");
}
shots.sort((a, b) => a.start - b.start);
// REGLA DEL DIRECTOR: plano fijo (foto/época/Loretta) ≤ 7,5 s y componente ≤ 11 s (salvo la tarjeta de receta y el cronograma):
// pasado el límite se corta al avatar en la palabra más cercana (si lo que sigue ya es avatar, el avatar se adelanta: nunca dos av seguidos).
const MAXFIX = { bi: 7.5, ei: 7.5, lor: 7.5, kf: 9.5, c: 11 }, KEEP = new Set(["LorRecipeCard", "LorSchedule"]);
const wstarts = W.map((w) => w.s);
const nearW = (x) => wstarts.reduce((b, v) => (Math.abs(v - x) < Math.abs(b - x) ? v : b), wstarts[0]);
let budget = FROZEN ? 0 : (+process.env.AV_AUTO || 70); // segundos de avatar que la regla puede sumar (el reel de RunPod no pasa de ~590 s)
shots.sort((a, b) => a.start - b.start);
const cand = [];
for (let i = 0; i < shots.length; i++) {
  const s = shots[i], nx = shots[i + 1], e = nx ? nx.start : END, d = e - s.start;
  if (!(s.kind in MAXFIX) || s.start < 62 || KEEP.has(s.name) || d <= MAXFIX[s.kind]) continue;
  const frac = s.kind === "c" ? 0.72 : 0.5;
  const cut = nearW(s.start + Math.max(3.6, d * frac)) - 0.04;
  if (cut < s.start + 2 || cut > e - 2) continue;
  cand.push({ s, nx, cut, e, d, add: e - cut });
}
// ⛔ REEL CONGELADO: el avatar ya se pagó/generó con las ventanas de _v3/lorham_avwin.json → la regla automática sólo puede cortar a avatar DENTRO de una ventana existente
const AVW = fs.existsSync(R + "_v3/lorham_avwin.json") ? JSON.parse(fs.readFileSync(R + "_v3/lorham_avwin.json", "utf8")).win : null;
if (AVW) for (let i = cand.length - 1; i >= 0; i--) { const c = cand[i]; if (!AVW.some((w) => c.cut >= w.s - 0.15 && c.e <= w.e + 0.2)) cand.splice(i, 1); }
cand.sort((x, y) => y.d - x.d);
for (const c of cand) {
  if (c.add > budget) continue; budget -= c.add;
  if (c.nx && c.nx.kind === "av") c.nx.start = c.cut; else shots.push({ kind: "av", name: "", p: c.s.p, at: "", start: c.cut, auto: 1 });
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
fs.writeFileSync(R + "_v3/lorham_shots.json", JSON.stringify({ END, DELTA, shots, vl }, null, 1));
console.log("clips vl:", Object.keys(vl).length, "· imágenes:", Object.keys(dups).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
