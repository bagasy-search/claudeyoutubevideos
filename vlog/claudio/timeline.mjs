// DIRECTOR (vlog/<slug>/dir_*.mjs) → _v3/<slug>_shots.json anclado al ms real (difflib global). SLUG=x node vlog/claudio/timeline.mjs
// Reglas: corte 40 ms antes de la palabra · plano fijo largo → avatar (presupuesto AV_AUTO s) · tomas <1,2 s se estiran o se caen ·
// reportes: % por tipo, minuto 1, ventanas vl (3,2-11,8 s), imágenes repetidas.
import fs from "node:fs";
import { R, SLUG, V3, J, W as WR } from "./env.mjs";
const P = J(V3 + "paras.json"), W = J(V3 + "wordms.json");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
const END = W[W.length - 1].e + 0.6;
let shots = [];
for (const f of ["dir_a", "dir_b", "dir_c", "dir_d"]) { const p = R + `vlog/${SLUG}/${f}.mjs`; if (fs.existsSync(p)) shots.push(...(await import("file:///" + p)).SHOTS); }
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
const CMAX = { ClFilterTest: 8, ClPotBoil: 8, ClGrainWipe: 8, ClMattressLayers3D: 9, ClDampSoaked: 8, ClSprayMix: 9, ClDryFan: 8, ClThreeRounds: 8, ClFlushJet3D: 9, ClRiseOrSpin: 8, ClTankMark: 8, ClTwoDays: 8, ClStickWire: 7, ClChapter: 3.6, ClColorCode: 6.5, ClCheck: 10, ClBookPage: 9, ClQRCard: 9, ClNeverMix: 9, ClRimCutaway3D: 10.5, ClTimer30: 6, ClMeasureCup: 5.5, ClDoDont: 6.5, ClPins: 8, ClBottle3D: 6.5, ClRimJets: 7, ClSplit: 9, ClMicroscope3D: 11, ClHallway3D: 6, ClBeforeAfter: 5, ClBowl3D: 10.5, ClValve3D: 8.5, ClPumiceTest: 8, ClPasteRecipe: 8.5, ClNotebook: 8, ClVideoRef: 6, ClWasher3D: 10, ClFilterFind: 8, ClDoseCap: 7, ClSmellTest: 8, ClPores3D: 10.5, ClSwab: 8, ClSpores: 7, ClFlashlight: 7, ClWallLeak: 9, ClHygrometer: 7, ClTray3D: 10.5, ClPasteCheck: 7, ClCoating: 8, ClTally: 8, ClReceipt: 8, ClCaulk3D: 10.5, ClFilmWrap: 8, ClTubMap: 9, ClCaulkGun: 9, ClMixCloud3D: 9, ClStoreLabel: 9, ClMixLight: 6, ClProtocol: 9, ClLabelLens: 7 };
const capOf = (s) => (s.kind === "c" ? CMAX[s.name] || MAXFIX.c : MAXFIX[s.kind]);
const ws = W.map((w) => w.s); const nearW = (x) => ws.reduce((b, v) => (Math.abs(v - x) < Math.abs(b - x) ? v : b), ws[0]);
let budget = process.env.AV_AUTO !== undefined ? +process.env.AV_AUTO : (process.env.AV_CAD === "0" ? 90 : 0); const cand = [];
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
// ── CADENCIA DE AVATAR (regla 13-oct, medida en Bertha Cooks): ventanas de 3,2-5,8 s (objetivo 4,5) en HUECOS DE ORACIÓN,
// una cada ~11-13 s (7,5 s de b-roll entre ventanas), nunca >20 s sin avatar. No corta componentes: los salta. Las tomas de
// b-roll que quedan tapadas se caen; la última se corre al final de la ventana (su frase sigue). AV_CAD=0 = cadena vieja.
const tapadas = [];
if (process.env.AV_CAD !== "0") {
  const RUN0 = +process.env.AV_RUN || 11.5, WIN0 = +process.env.AV_WIN || 4.5, GAPMAX = 19.5;
  const endS = (w) => /[.?!:…]["»”)]*$/.test(w.w), endC = (w) => /[,;]["»”)]*$/.test(w.w);
  const bnd = []; // fronteras candidatas: inicio de palabra tras fin de oración (peso 2) o coma (peso 1)
  for (let i = 1; i < W.length; i++) bnd.push({ t: W[i].s - 0.04, k: endS(W[i - 1]) ? 2 : endC(W[i - 1]) ? 1 : 0, gap: W[i].s - W[i - 1].e });
  const prot = shots.filter((s) => s.kind === "c" || s.kind === "av" || s.keep).map((s, _, a) => s);
  const spanOf = (s) => { const i = shots.indexOf(s); return [s.start, i + 1 < shots.length ? shots[i + 1].start : END]; };
  const inProt = (t0, t1) => prot.some((s) => { if (s.kind === "av") return false; const [a, b] = spanOf(s); return t0 < b - 0.05 && t1 > a + 0.05; });
  const score = (c, want) => Math.abs(c.t - want) - c.k * 0.9 - Math.min(c.gap, 0.5);
  const explicit = shots.filter((s) => s.kind === "av").map((s) => spanOf(s));
  let t = explicit.length && explicit[0][0] < 0.1 ? explicit[0][1] : 0;
  const wins = [];
  while (t < END - 6) {
    const nextEx = explicit.find(([a, b]) => a >= t - 0.05 && a > 0.1 && b > t + 0.05);
    if (nextEx && nextEx[0] - t <= GAPMAX) { t = nextEx[1]; continue; } // la ventana manual llega a tiempo: no se pega otra antes
    const M1 = t < 55, RUN = M1 ? 14 : RUN0, WIN = M1 ? 3.4 : WIN0; // minuto 1: ventanas cortas y espaciadas (los cortes mandan)
    const want = t + RUN;
    let c = bnd.filter((b) => b.t >= t + 5.2 && b.t <= t + GAPMAX - 1 && b.k > 0).sort((x, y) => score(x, want) - score(y, want));
    let pick = null;
    for (const b of c) {
      const ends = bnd.filter((e) => e.t >= b.t + 3.2 && e.t <= b.t + 5.8 && e.t < END - 0.3).sort((x, y) => score(x, b.t + WIN) - score(y, b.t + WIN));
      const e = ends.find((e) => !inProt(b.t, e.t));
      if (e && !inProt(b.t, e.t)) { pick = { s: b.t, e: e.t }; break; }
    }
    if (!pick) { // sin hueco de oración libre: el primer hueco de palabra después del componente que estorba
      const b = bnd.find((b) => b.t >= t + 5.2 && !inProt(b.t, b.t + 3.4));
      if (!b) break; const e = bnd.filter((e) => e.t >= b.t + 3.4 && e.t <= b.t + 5.8).sort((x, y) => score(x, b.t + WIN) - score(y, b.t + WIN))[0];
      pick = { s: b.t, e: e ? e.t : b.t + 4.5 };
    }
    wins.push(pick); t = pick.e;
  }
  for (const w of wins) {
    const inside = shots.filter((s) => s.kind !== "av" && s.start >= w.s - 0.01 && s.start < w.e);
    const before = shots.filter((s) => s.start < w.s - 0.01).pop();
    for (const s of inside) shots.splice(shots.indexOf(s), 1);
    const last = inside.length ? inside[inside.length - 1] : before && ["bi", "cl"].includes(before.kind) && !before.q && !before.anim ? { ...before, cont: 1 } : null;
    const nxt = shots.find((s) => s.start >= w.e);
    if (last && (!nxt || nxt.start - w.e >= 2.0)) { last.start = w.e; shots.push(last); }
    tapadas.push(...inside.slice(0, -1).map((s) => s.name));
    shots.push({ kind: "av", name: "", p: 0, at: "", start: w.s, auto: 2 });
  }
  shots.sort((a, b) => a.start - b.start);
  // una toma "continuada" (copia de la anterior) nunca repite imagen pegada a sí misma
  for (let i = shots.length - 1; i > 0; i--) if (shots[i].cont && shots[i - 1].name === shots[i].name && shots[i - 1].kind === shots[i].kind) shots.splice(i, 1);
  console.log("cadencia avatar:", wins.length, "ventanas auto · tomas tapadas", tapadas.length);
}
// tomas cortas (<1,2 s; fuera del minuto 1 <1,6 s): se corre la siguiente; si no entra, la toma se cae
const MIN = (t) => (t < 60 ? 0.9 : t < 90 ? 1.7 : 2.3); // b-roll medido en Bertha: 2,3-5,2 s (los loops del hook, más rápidos)
for (let i = 0; i + 1 < shots.length; i++) {
  const a = shots[i], b = shots[i + 1], c = shots[i + 2], lim = c ? c.start : END;
  if (b.start - a.start >= MIN(a.start)) continue;
  const want = a.start + Math.max(MIN(a.start), a.start < 60 ? 1.6 : 2.6);
  if (b.kind !== "av" && lim - want >= MIN(want)) b.start = want;
  else if (b.kind !== "av" && c && c.kind !== "av" && want - (b.a0 ??= b.start) <= 3.5) b.start = want; // en cascada: la siguiente se corre detrás
  else if (lim - (a.start + MIN(a.start)) >= MIN(a.start)) b.start = a.start + MIN(a.start) + 0.05;
  else { console.log("toma caída por corta:", a.kind, a.name, a.start.toFixed(2)); shots.splice(i, 1); i--; }
}
// dos av seguidos → uno
for (let i = shots.length - 1; i > 0; i--) if (shots[i].kind === "av" && shots[i - 1].kind === "av") shots.splice(i, 1);
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); s.start = +s.start.toFixed(3); s.end = +s.end.toFixed(3); });
const vl = {};
for (const s of shots.filter((s) => s.kind === "vl")) { const v = (vl[s.name] ||= { s: s.start, e: s.end }); v.s = Math.min(v.s, s.start); v.e = Math.max(v.e, s.end); }
const bad = Object.entries(vl).filter(([, v]) => v.e - v.s > 11.8 || v.e - v.s < 3.2);
const by = {}; for (const s of shots) by[s.kind] = (by[s.kind] || 0) + s.dur;
console.log("tomas", shots.length, "· dur", END.toFixed(1), "s");
for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(4)} ${v.toFixed(1).padStart(7)} s  ${(100 * v / END).toFixed(1)}%`);
const m1 = shots.filter((s) => s.start < 60);
console.log("minuto 1: cortes", m1.length - 1, "· toma máx", Math.max(...m1.map((s) => Math.min(s.end, 60) - s.start)).toFixed(2), "s");
const largos = shots.filter((s) => s.dur > 12 && !["c", "av"].includes(s.kind)); if (largos.length) console.log("⚠️ planos >12 s:", largos.map((s) => `${s.kind}:${s.name}@${s.start}(${s.dur})`).join(" "));
const avL = shots.filter((s) => s.kind === "av" && s.dur > 16); if (avL.length) console.log("⚠️ avatar >16 s:", avL.map((s) => `@${s.start}(${s.dur})`).join(" "));
if (bad.length) console.log("⛔ clips vl fuera de 3,2-11,8 s:", bad.map(([k, v]) => `${k} ${(v.e - v.s).toFixed(2)}`).join(" · "));
const dups = {}; for (const s of shots.filter((s) => ["bi", "cl"].includes(s.kind) && !s.cont)) dups[s.name] = (dups[s.name] || 0) + 1;
const rep = Object.entries(dups).filter(([, n]) => n > 1); if (rep.length) console.log("⛔ imágenes repetidas:", rep.map(([k]) => k).join(" "));
WR(V3 + "shots.json", { END, shots, vl });
console.log("clips vl:", Object.keys(vl).length, "· kf:", new Set(shots.filter((s) => s.kind === "kf").map((s) => s.name)).size, "· imágenes:", Object.keys(dups).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
