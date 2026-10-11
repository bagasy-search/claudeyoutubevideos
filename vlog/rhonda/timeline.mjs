// DIRECTOR (vlog/<slug>/dir_*.mjs) → _v3/<slug>_shots.json anclado al ms real (difflib global). SLUG=x node vlog/rhonda/timeline.mjs
// Reglas: corte 40 ms antes de la palabra · plano fijo largo → avatar (presupuesto AV_AUTO s) · tomas <1,2 s se estiran o se caen ·
// reportes: % por tipo, minuto 1, ventanas vl (3,2-11,8 s), imágenes repetidas.
import fs from "node:fs";
import { R, SLUG, V3, J, W as WR } from "./env.mjs";
const P = J(V3 + "paras.json"), W = J(V3 + "wordms.json");
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const END = W[W.length - 1].e + 0.6;
let shots = [];
for (const f of ["dir_a", "dir_b", "dir_c", "dir_d"]) { const p = R + `vlog/${SLUG}/${f}.mjs`; if (fs.existsSync(p)) shots.push(...(await import("file:///" + p)).SHOTS); }
{ const qf = R + `vlog/${SLUG}/q.mjs`; if (fs.existsSync(qf)) { const { Q } = await import("file:///" + qf); for (const s of shots) if (Q[s.name] && !s.q) s.q = Q[s.name]; } }
// fotos que SÓLO viven dentro de un componente (skip): se generan (mk_imgs) pero no son toma
const extra = shots.filter((s) => s.skip); shots = shots.filter((s) => !s.skip);
const errs = [];
for (const s of shots) {
  const p = P[s.p]; if (!p) { errs.push(`párrafo ${s.p} no existe`); continue; }
  if (!s.at) { s.start = p.s; continue; }
  const pw = W.slice(p.w0, p.w0 + p.nw).map((w) => norm(w.w).join(""));
  const q = norm(s.at); let hit = -1;
  for (let i = 0; i + q.length <= pw.length && hit < 0; i++) if (q.every((t, k) => pw[i + k] === t)) hit = i;
  if (hit < 0) { errs.push(`p${s.p} no encuentro "${s.at}" [${s.name}]`); s.start = p.s; continue; }
  s.start = hit === 0 ? p.s : W[p.w0 + hit].s - 0.04;
}
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
shots.sort((a, b) => a.start - b.start);
shots[0].start = 0;
// plano fijo largo → corte a avatar en la palabra más cercana (nunca dos av seguidos)
const MAXFIX = { bi: 7.5, rh: 7.5, kf: 9.5, c: 9 }, KEEP = new Set([]);
// tope POR COMPONENTE (el resto pasa al avatar): un separador no se queda 8 s, un 3D lleva su tiempo
const CMAX = { RhChapter: 3.6, RhColorCode: 6.5, RhCheck: 10, RhBookPage: 8, RhQRCard: 9, RhNeverMix: 9, RhToiletCutaway3D: 10.5, RhTimer30: 6, RhMeasureCup: 5.5, RhDoDont: 6.5, RhPins: 8, RhBottle3D: 6.5, RhRimJets: 7, RhBleachVsRoots: 9, RhGroutJoint3D: 9, RhQuoteStamp: 6, RhFloorMap: 7, RhBrushCompare: 7, RhWipeReveal: 6.5 };
const capOf = (s) => (s.kind === "c" ? CMAX[s.name] || MAXFIX.c : MAXFIX[s.kind]);
const ws = W.map((w) => w.s); const nearW = (x) => ws.reduce((b, v) => (Math.abs(v - x) < Math.abs(b - x) ? v : b), ws[0]);
let budget = +process.env.AV_AUTO || 90; const cand = [];
for (let i = 0; i < shots.length; i++) {
  const s = shots[i], nx = shots[i + 1], e = nx ? nx.start : END, d = e - s.start;
  if (!(s.kind in MAXFIX) || s.start < 62 || KEEP.has(s.name) || d <= capOf(s)) continue;
  const cut = nearW(s.start + (s.kind === "c" ? Math.min(capOf(s), Math.max(3.2, d * 0.72)) : Math.max(3.6, d * 0.5))) - 0.04;
  if (cut < s.start + 2.4 || cut > e - 1.6) continue;
  cand.push({ s, nx, cut, e, d, add: e - cut });
}
cand.sort((x, y) => y.d - x.d);
for (const c of cand) { if (c.add > budget) continue; budget -= c.add; if (c.nx && c.nx.kind === "av") c.nx.start = c.cut; else shots.push({ kind: "av", name: "", p: c.s.p, at: "", start: c.cut, auto: 1 }); }
shots.sort((a, b) => a.start - b.start);
// tomas cortas (<1,2 s; fuera del minuto 1 <1,6 s): se corre la siguiente; si no entra, la toma se cae
const MIN = (t) => (t > 27 && t < 34.5 ? 0.5 : t < 62 ? 0.9 : 1.6);
for (let i = 0; i + 1 < shots.length; i++) {
  const a = shots[i], b = shots[i + 1], c = shots[i + 2], lim = c ? c.start : END;
  if (b.start - a.start >= MIN(a.start)) continue;
  const want = a.start + Math.max(MIN(a.start), 2.2);
  if (b.kind !== "av" && lim - want >= MIN(want)) b.start = want;
  else if (lim - (a.start + MIN(a.start)) >= MIN(a.start)) b.start = a.start + MIN(a.start) + 0.05;
  else { console.log("toma caída por corta:", a.kind, a.name, a.start.toFixed(2)); shots.splice(i, 1); i--; }
}
// dos av seguidos → uno
for (let i = shots.length - 1; i > 0; i--) if (shots[i].kind === "av" && shots[i - 1].kind === "av") shots.splice(i, 1);
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); s.start = +s.start.toFixed(3); s.end = +s.end.toFixed(3); });
// ── VARA edl.py / cltoilet Kit2 (rhgrout 10-oct): PUNCH-IN en la palabra del medio (plano ≥2,0 s; avatar ≥2,6 s) = mismo material
// más cerca en la 2ª mitad (clip sigue con su desfase) · BARRIDO al salir de un componente · cámara por golpes en componentes
// (nunca >2,6 s quietos) · rótulos (o.kick) · POP de palabra clave (≥6 s entre sí, nunca sobre componente ni rótulo).
if (process.env.VARA !== "0") {
  let seed = 7; const rr = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const wIn = (a, b) => W.filter((w) => w.s > a && w.s < b);
  const out = [];
  for (const s of shots) {
    const lim = s.kind === "av" ? 2.6 : 2.0;
    if (!["av", "bi", "rh", "kf"].includes(s.kind) || s.dur < lim) { out.push(s); continue; }
    const mid = s.start + s.dur / 2, cand = wIn(s.start + 0.8, s.end - 0.8);
    if (!cand.length) { out.push(s); continue; }
    const w = cand.reduce((x, y) => (Math.abs(y.s - mid) < Math.abs(x.s - mid) ? y : x)), cut = +(w.s - 0.04).toFixed(3);
    const o = [Math.round(35 + rr() * 30), Math.round(35 + rr() * 25)];
    const z1 = s.kind === "av" ? [1.0, 1.03] : [1.0, 1.06], z2 = s.kind === "av" ? [1.24, 1.28] : [1.3, Math.min(1.62, 1.36)];
    const A = { ...s, end: cut, dur: +(cut - s.start).toFixed(3), z: z1, o };
    const B = { ...s, start: cut, dur: +(s.end - cut).toFixed(3), z: z2, o, punch: 1, cofs: +(cut - s.start).toFixed(3) };
    delete B.ov; delete B.kick; out.push(A, B);
  }
  shots = out;
  shots.forEach((s, i) => { const pv = shots[i - 1]; if (pv && pv.kind === "c" && !s.punch && !(pv.name === "RhChapter" && s.kind === "av")) s.tin = "whip"; });
  for (const s of shots.filter((s) => s.kind === "c" && s.dur > 2.6)) {
    const bt = []; let t = s.start + 2.2;
    while (t < s.end - 0.8) { const w = wIn(t - 0.6, t + 0.6)[0]; const at = w ? w.s : t; bt.push(Math.round((at - s.start) * 30)); t = at + 2.2; }
    if (bt.length) s.beats = bt;
  }
  const OVK = [];
  for (const s of shots) if (s.kick) OVK.push({ s: s.start + 0.15, e: Math.min(s.end, s.start + 2.55) });
  const POPW = /^(never|nobody|gone|mud|white|dirt|twelve|fifteen|sealed|caulk|nylon|wire|acid|brown)$/;
  let lastPop = -99;
  for (const w of W) {
    const t = norm(w.w).join(""); if (!POPW.test(t) || w.s - lastPop < 6) continue;
    const sh = shots.find((x) => x.start <= w.s && x.end > w.s); if (!sh || sh.kind === "c" || sh.ov || OVK.some((k) => w.s < k.e && w.s + 1 > k.s)) continue;
    (sh.pops ||= []).push({ t: +(w.s - sh.start).toFixed(3), txt: t.toUpperCase() }); lastPop = w.s;
  }
}
const vl = {};
for (const s of shots.filter((s) => s.kind === "vl")) { const v = (vl[s.name] ||= { s: s.start, e: s.end }); v.s = Math.min(v.s, s.start); v.e = Math.max(v.e, s.end); }
const bad = Object.entries(vl).filter(([, v]) => v.e - v.s > 11.8 || v.e - v.s < 3.2);
const by = {}; for (const s of shots) by[s.kind] = (by[s.kind] || 0) + s.dur;
console.log("tomas", shots.length, "· dur", END.toFixed(1), "s");
for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(4)} ${v.toFixed(1).padStart(7)} s  ${(100 * v / END).toFixed(1)}%`);
const m1 = shots.filter((s) => s.start < 60);
{ const d = m1.map((s) => Math.min(s.end, 60) - s.start).sort((a, b) => a - b), q = (x) => d[Math.floor(x * (d.length - 1))].toFixed(2); console.log("minuto 1 dispersión p25", q(0.25), "· p50", q(0.5), "· p75", q(0.75), "· punch", m1.filter((s) => s.punch).length, "· whip", shots.filter((s) => s.tin).length, "· pops", shots.reduce((a, s) => a + (s.pops?.length || 0), 0), "· rótulos", shots.filter((s) => s.kick).length); }
console.log("minuto 1: cortes", m1.length - 1, "· toma máx", Math.max(...m1.map((s) => Math.min(s.end, 60) - s.start)).toFixed(2), "s");
const largos = shots.filter((s) => s.dur > 12 && !["c", "av"].includes(s.kind)); if (largos.length) console.log("⚠️ planos >12 s:", largos.map((s) => `${s.kind}:${s.name}@${s.start}(${s.dur})`).join(" "));
const avL = shots.filter((s) => s.kind === "av" && s.dur > 16); if (avL.length) console.log("⚠️ avatar >16 s:", avL.map((s) => `@${s.start}(${s.dur})`).join(" "));
if (bad.length) console.log("⛔ clips vl fuera de 3,2-11,8 s:", bad.map(([k, v]) => `${k} ${(v.e - v.s).toFixed(2)}`).join(" · "));
const dups = {}; for (const s of shots.filter((s) => ["bi", "rh"].includes(s.kind) && !s.punch)) dups[s.name] = (dups[s.name] || 0) + 1;
const rep = Object.entries(dups).filter(([, n]) => n > 1); if (rep.length) console.log("⛔ imágenes repetidas:", rep.map(([k]) => k).join(" "));
WR(V3 + "shots.json", { END, shots, vl, extra });
console.log("clips vl:", Object.keys(vl).length, "· kf:", new Set(shots.filter((s) => s.kind === "kf").map((s) => s.name)).size, "· imágenes:", Object.keys(dups).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
