// DIRECTOR → _v3/earlshrimpbag_shots.json: ancla cada toma a la palabra del guion (ms del ASR, alineación global) y
// mide la toma contra su tipo (compuertas: minuto 1 ≤4 s, foto+clip ≤6,5 s, stock ≤8,4 s, % avatar / real / comp).
import fs from "node:fs";
import { SHOTS as A } from "./dir_a.mjs";
import { SHOTS as B } from "./dir_b.mjs";
import { SHOTS as C } from "./dir_c.mjs";
const R = "D:/Proyectos/video2-wt/earlshrimpbag/";
const W = JSON.parse(fs.readFileSync(R + "_v3/earlshrimpbag_wordms.json", "utf8"));
const P = JSON.parse(fs.readFileSync(R + "_v3/earlshrimpbag_paras.json", "utf8"));
const errs0 = [];
const norm = (s) => s.replace(/-/g, "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const POOL = JSON.parse(fs.readFileSync(R + "_v3/earlshrimpbag_stock_pool.json", "utf8"));
const rs = (n) => (n && POOL[n]) || n;
const all = [...A, ...B, ...C].map((s) => ({ ...s, name: s.kind === "st" ? rs(s.name) : s.name, ...(s.props ? { props: { ...s.props, ...(s.props.bed ? { bed: rs(s.props.bed) } : {}) } } : {}) }));
for (const s of all) if (/^st_\w+\.\d+$/.test(s.name) || /^st_\w+\.\d+$/.test(s.props?.bed || "")) errs0.push("stock sin resolver " + s.name);
const errs = errs0;
const shots = all.map((s) => {
  const p = P[s.p]; let wi = p.w0;
  if (s.at) {
    const q = norm(s.at), ws = W.slice(p.w0, p.w0 + p.nw).map((x) => norm(x.w).join(""));
    const k = ws.findIndex((_, i) => q.every((t, j) => ws[i + j] === t.replace(/ /g, "")));
    if (k < 0) errs.push(`no encuentro "${s.at}" en p${s.p}`); else wi = p.w0 + k;
  }
  return { ...s, wi, start: Math.max(0, W[wi].s - 0.06) };
});
shots[0].start = 0;
for (let i = 1; i < shots.length; i++) if (shots[i].start <= shots[i - 1].start) errs.push(`orden: ${shots[i].name} @p${shots[i].p}`);
const END = W[W.length - 1].e + 0.6;
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); s.start = +s.start.toFixed(3); s.end = +s.end.toFixed(3); });
const warn = [];
for (const s of shots) {
  if (s.start < 62 && s.dur > 4.05) warn.push(`min1 >4s ${s.name} ${s.dur.toFixed(1)}`);
  if (s.kind === "bi" && s.dur > 6.6) warn.push(`bi largo ${s.name} ${s.dur.toFixed(1)}@${s.start.toFixed(0)}`);
  if (s.kind === "st" && s.dur > 8.4) warn.push(`st largo ${s.name} ${s.dur.toFixed(1)}@${s.start.toFixed(0)}`);
  if (s.kind === "hz" && s.dur > 8) warn.push(`hz largo ${s.name} ${s.dur.toFixed(1)}`);
  if (s.kind === "av" && s.dur > 13) warn.push(`av largo ${s.dur.toFixed(1)}@${s.start.toFixed(0)}`);
  if (s.kind === "c" && s.dur < 3.2) warn.push(`comp corto ${s.name} ${s.dur.toFixed(1)}@${s.start.toFixed(0)}`);
  if (s.kind === "c" && s.dur > 12) warn.push(`comp largo ${s.name} ${s.dur.toFixed(1)}@${s.start.toFixed(0)}`);
}
const names = {}; for (const s of shots) if (!["av", "c", "vl"].includes(s.kind)) { names[s.name] = (names[s.name] || 0) + 1; }
const rep = Object.entries(names).filter(([, n]) => n > 1); if (rep.length) errs.push("asset repetido: " + rep.map(([k]) => k).join(" "));
const tot = {}; for (const s of shots) tot[s.kind] = (tot[s.kind] || 0) + s.dur;
const T = END;
const real = shots.filter((s) => s.kind === "st" || (s.kind === "c" && /^st_/.test(s.props?.bed || ""))).reduce((a, s) => a + s.dur, 0);
const realN = shots.filter((s) => s.kind === "st" || (s.kind === "c" && /^st_/.test(s.props?.bed || ""))).length;
const durs = shots.map((s) => s.dur).sort((a, b) => a - b), q = (x) => durs[Math.floor(durs.length * x)];
const cuts1 = shots.filter((s) => s.start > 0 && s.start < 60).length;
fs.writeFileSync(R + "_v3/earlshrimpbag_shots.json", JSON.stringify({ END, shots }, null, 1));
console.log(`tomas ${shots.length} · fin ${END.toFixed(1)} s · cortes min1 ${cuts1}`);
console.log(Object.entries(tot).map(([k, v]) => `${k} ${v.toFixed(0)}s (${((100 * v) / T).toFixed(1)}%)`).join(" · "));
console.log(`REAL (stock + componentes sobre stock) ${real.toFixed(0)} s = ${((100 * real) / T).toFixed(1)}% · ${realN}/${shots.length} tomas`);
console.log(`duraciones: mediana ${q(0.5).toFixed(2)} · p75 ${q(0.75).toFixed(2)} · ≥5s ${((100 * durs.filter((d) => d >= 5).length) / durs.length).toFixed(0)}% · max ${durs[durs.length - 1].toFixed(1)}`);
if (warn.length) console.log("⚠️", warn.length, warn.join(" | "));
if (errs.length) { console.error("⛔", errs.join(" | ")); process.exit(1); }
