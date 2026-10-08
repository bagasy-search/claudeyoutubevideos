// DIRECTOR (vlog/<slug>/dir_*.mjs) → _v3/<slug>_shots.json anclado al ms real (difflib global). SLUG=x node vlog/claudio/timeline.mjs
// Reglas: corte 40 ms antes de la palabra · plano fijo largo → avatar (presupuesto AV_AUTO s) · tomas <1,2 s se estiran o se caen ·
// reportes: % por tipo, minuto 1, ventanas vl (3,2-11,8 s), imágenes repetidas.
import fs from "node:fs";
import { R, SLUG, V3, J, W as WR } from "./env.mjs";
const P = J(V3 + "paras.json"), W = J(V3 + "wordms.json");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
const END = W[W.length - 1].e + 0.6;
let shots = [];
for (const f of ["dir_a", "dir_b", "dir_c", "dir_d", "dir_e"]) { const p = R + `vlog/${SLUG}/${f}.mjs`; if (fs.existsSync(p)) shots.push(...(await import("file:///" + p)).SHOTS); }
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
const CMAX = { ClPCV3D: 9, ClEnginePressure: 9, ClSevereChart: 9, ClColdStart: 9, ClFilterLight: 9, ClLogbook: 9, ClBatterySwap: 9, ClRangeMeter: 9, ClPanicWaves: 9, ClDoorUnlock: 9, ClProxStart: 9, ClFuelGauge: 9, ClCarMap: 9, ClKeyFob3D: 9, ClChildLock: 9, ClAirFlow: 9, ClTireLabel: 9, ClTread3D: 9, ClPoisonWall: 9, ClFlourMap: 9.5, ClCoinHole: 8.5, ClTrapSet: 8.5, ClDoorGap: 9, ClBarrierLine: 9, ClPerimeter30: 9, ClChapter: 3.6, ClColorCode: 6.5, ClCheck: 10, ClBookPage: 9, ClQRCard: 9, ClNeverMix: 9, ClRimCutaway3D: 10.5, ClTimer30: 6, ClMeasureCup: 5.5, ClDoDont: 6.5, ClPins: 8, ClBottle3D: 6.5, ClRimJets: 7, ClSplit: 9, ClMicroscope3D: 11, ClHallway3D: 6, ClBeforeAfter: 5, ClBowl3D: 10.5, ClValve3D: 8.5, ClPumiceTest: 8, ClPasteRecipe: 8.5, ClNotebook: 8, ClVideoRef: 6, ClWasher3D: 10, ClFilterFind: 8, ClDoseCap: 7, ClSmellTest: 8, ClPores3D: 10.5, ClSwab: 8, ClSpores: 7, ClFlashlight: 7, ClWallLeak: 9, ClHygrometer: 7, ClTray3D: 10.5, ClPasteCheck: 7, ClCoating: 8, ClTally: 8, ClReceipt: 8, ClCaulk3D: 10.5, ClFilmWrap: 8, ClTubMap: 9, ClCaulkGun: 9, ClFoilTest: 10, ClHouseMap: 8, ClWardrobeGap: 9, ClTapeTest: 8, ClHeatSides: 10, ClShadeGap: 9, ClCrossVent: 10, ClThermo: 7, ClEarthTube: 10, ClWickWall: 10.5, ClThreeDamp: 10, ClPencilLine: 9, ClWaterWalk: 10.5, ClHoseTest: 10.5, ClMembrane: 10.5, ClCoinTest: 8, ClPlasterTell: 10.5, ClCrackTypes: 10, ClVFill: 10, ClDesiccant: 10.5, ClClosetAir: 10, ClSaltTest: 10, ClHidden50: 8, ClFridgeBack: 10, ClPeroxide: 7, ClTrailMap: 9 };
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
const MIN = (t) => (t < 60 ? 0.9 : 1.6);
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
const dups = {}; for (const s of shots.filter((s) => ["bi", "cl"].includes(s.kind))) dups[s.name] = (dups[s.name] || 0) + 1;
const rep = Object.entries(dups).filter(([, n]) => n > 1); if (rep.length) console.log("⛔ imágenes repetidas:", rep.map(([k]) => k).join(" "));
WR(V3 + "shots.json", { END, shots, vl });
console.log("clips vl:", Object.keys(vl).length, "· kf:", new Set(shots.filter((s) => s.kind === "kf").map((s) => s.name)).size, "· imágenes:", Object.keys(dups).length, "· componentes:", shots.filter((s) => s.kind === "c").length);
