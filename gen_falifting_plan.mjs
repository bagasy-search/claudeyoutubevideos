// gen_falifting_plan.mjs — DIRECTOR (spec + assets reales en disco) → _v3/falifting_plan.json
//   canal Federer Archivos · "¿Papilomas o Verrugas Después de los 60?" · 100 % Fish + RunPod (UN /run, ventanas)
// ⛔ Sin avatar de fondo: cobertura 100 % en el build. ⛔ Un componente nunca se come una ventana de avatar.
// ⛔ Tiempos por FRASE (`hit` → `at`) contra el mapa de palabras; compuerta si caen fuera del componente.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const SLUG = "falifting";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
const J = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
const MOM = J(`_v3/${SLUG}_moments.json`);
const SPEC = Object.fromEntries(J(`_v3/${SLUG}_spec_all.json`).map((s) => [s.name, s]));
const STOCK = J(`_v3/${SLUG}_stock_res.json`);
const WM = J(`_v3/${SLUG}_wordms.json`);
const QC = fs.existsSync(`_v3/${SLUG}_agnes_qc.json`) ? J(`_v3/${SLUG}_agnes_qc.json`).clips || {} : {};
const { COMPS } = await import(`./_v3/${SLUG}_comps.mjs`);
const WAV_S = durDe(`${SLUG}.m4a`) || durDe(`${SLUG}.wav`);
const TOTAL_S = WAV_S + 0.5;
const LAMINA = `img/${SLUG}/${SLUG}_lamina.jpg`;
if (!existe(LAMINA)) { console.error(`⛔ falta ${LAMINA}`); process.exit(1); }
let fails = 0;

// ── AVATAR: ventanas del reel único
const RP = J(`_v3/${SLUG}_rp_reel.json`);
const avatarBeats = [], WINS = [];
// ventanas del spec VIGENTE (si un momento dejó de ser avatar después de disparar RunPod, su tramo no se usa)
const AVM = MOM.filter((m) => SPEC[m.name]?.t === "avatar").map((m) => [m.t, m.t + m.dur]);
for (const sg of RP.segments) {
  const clip = `broll/${SLUG}_av/${sg.win}.mp4`;
  const real = process.env.DRY ? sg.seconds + 0.1 : durDe(clip);
  if (!real) { console.error(`⛔ falta ${clip}`); process.exit(1); }
  const a0 = sg.master_start_s, a1 = sg.master_start_s + Math.min(sg.seconds, real - 0.04);
  const parts = [];
  for (const [x, y] of AVM) { const s0 = Math.max(a0, x), s1 = Math.min(a1, y); if (s1 - s0 > 0.3) { if (parts.length && s0 - parts[parts.length - 1][1] < 0.05) parts[parts.length - 1][1] = s1; else parts.push([s0, s1]); } }
  for (const [s0, s1] of parts) {
    WINS.push({ start: s0, end: s1 });
    avatarBeats.push({ tipo: "avatar", ms_in: Math.round(s0 * 1000), ms_out: Math.round(s1 * 1000), clip, ...(s0 - a0 > 0.02 ? { startFrom: +(s0 - a0).toFixed(3) } : {}) });
  }
}
const enAvatar = (s) => WINS.some((w) => s >= w.start - 0.05 && s < w.end - 0.25);
const proxAvatar = (s) => { const w = WINS.find((x) => x.start >= s - 0.05); return w ? w.start : TOTAL_S; };

// ── assets por momento
const bedDir = `img/${SLUG}`;
const frameBed = (clipRel, name) => {
  const out = `${bedDir}/${name}_bed.jpg`;
  if (!existe(out)) spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.max(0.2, durDe(clipRel) * 0.4)), "-i", path.join("public", clipRel), "-frames:v", "1", "-q:v", "3", path.join("public", out)]);
  return existe(out) ? out : undefined;
};
const assetDe = (m) => {
  const s = SPEC[m.name];
  if (s?.t === "pres" || s?.t === "gen") {
    const c = `broll/${SLUG}/${m.name}.mp4`, f = `img/${SLUG}/${m.name}.jpg`;
    if (!s.still && existe(c) && QC[m.name]?.ok) return { tipo: "clip", src: c };
    if (existe(f)) return { tipo: "imagen", src: f };
    return null;
  }
  const r = STOCK[m.name];
  if (r?.kind === "clip" && existe(r.file)) return { tipo: "clip", src: r.file };
  if (r?.kind === "photo" && existe(r.file)) return { tipo: "imagen", src: r.file };
  if (existe(`img/${SLUG}/${m.name}.jpg`) && !(r?.kind === "photo")) return { tipo: "imagen", src: `img/${SLUG}/${m.name}.jpg`, ia: true };
  return null;
};
const stillDe = (m) => { const a = assetDe(m); return !a ? undefined : a.tipo === "imagen" ? a.src : frameBed(a.src, m.name); };

// ── frases → segundos desde t0
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
const wmIdx = (ms) => { let lo = 0, hi = WM.length - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (WM[mid].ms < ms) lo = mid + 1; else hi = mid; } return lo; };
const hitAt = (hit, t0, name) => {
  const w = hit.split(/\s+/).map(norm).filter(Boolean);
  const i0 = Math.max(0, wmIdx(t0 * 1000 - 400));
  for (let i = i0; i < Math.min(WM.length, i0 + 160); i++) {
    if (w.every((x, k) => WM[i + k] && WM[i + k].w === x)) return +(WM[i].ms / 1000 - t0).toFixed(2);
  }
  console.error(`⛔ hit no encontrado en ${name}: "${hit}"`); fails++; return undefined;
};
const resolve = (c, t0) => {
  const p = JSON.parse(JSON.stringify(c.props));
  const ats = [];
  for (const v of Object.values(p)) if (Array.isArray(v)) for (const it of v) if (it && typeof it === "object" && it.hit) { it.at = hitAt(it.hit, t0, c.name); if (it.at !== undefined) ats.push(it.at); delete it.hit; }
  if (p.flipHit) { p.flipAt = hitAt(p.flipHit, t0, c.name); if (p.flipAt !== undefined) ats.push(p.flipAt); delete p.flipHit; }
  const fix = (img) => { if (!img || existe(img)) return img; const mm = MOM.find((x) => img.includes(x.name)); return (mm && stillDe(mm)) || undefined; };
  if (Array.isArray(p.cards)) for (const cd of p.cards) if (cd.image) cd.image = fix(cd.image);
  if (p.image) p.image = fix(p.image);
  return { p, ats };
};
const palabras = (p) => JSON.stringify(p).replace(/"[a-zA-Z]+":/g, " ").replace(/img\/[^"]+/g, "").split(/[\s,{}\[\]"]+/).filter((x) => x && isNaN(+x) && x.length > 1).length;

const compDe = Object.fromEntries(COMPS.map((c) => [c.name, c]));
const beats = [...avatarBeats];
const overlays = [];
let sinAsset = 0;
const skip = new Set();
const lastStill = () => { const b = [...beats].reverse().find((x) => x.tipo === "imagen" || x.tipo === "clip"); return b ? (b.tipo === "imagen" ? b.src : frameBed(b.src, b.name)) : undefined; };

for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i], s = SPEC[m.name];
  const t0 = Math.max(m.t, 0), t1 = m.t + m.dur;
  const c = compDe[m.name];
  if (c && c.overlay) {
    const { p } = resolve(c, t0);
    const piso = Math.min(6.5, 2.4 + 0.25 * Math.max(0, palabras(p) - 3));
    overlays.push({ componente: c.comp, props: p, ms_in: Math.round((t0 + 0.2) * 1000), ms_out: Math.round((t0 + Math.max(piso, Math.min(m.dur, 6))) * 1000) });
  }
  if (s.t === "avatar" || skip.has(i)) continue;
  if (enAvatar(t0 + 0.1)) continue;
  if (s.t === "lamina") {
    const prev = [...beats].reverse().find((x) => x.tipo === "lamina" && x.ms_out >= Math.round(t0 * 1000) - 400);
    beats.push({ tipo: "lamina", ms_in: Math.round(t0 * 1000), ms_out: Math.round(Math.min(t1, proxAvatar(t0 + 0.1)) * 1000), src: LAMINA, zoom: s.z, desde: prev ? prev.zoom : "completa", name: m.name });
    continue;
  }
  const a = assetDe(m);
  if (c && !c.overlay) {
    const { p, ats } = resolve(c, t0);
    const lastHit = ats.length ? Math.max(...ats) : 0;
    const piso = Math.min(11, 2.8 + 0.28 * Math.max(0, palabras(p) - 3));
    const want = c.props.durS ? c.props.durS : Math.min(lastHit + 2.6 > 13 ? Math.min(24, lastHit + 2.6) : 13, Math.max(m.dur, piso, lastHit + 2.6, c.comp === "GuideCTA" ? 6 : 0));
    const out = Math.min(t0 + want, proxAvatar(t0 + 0.1));
    for (const at of ats) if (at < 0 || at > out - t0 - 0.4) { console.error(`⛔ ${c.name} (${c.comp}): tiempo ${at}s fuera del componente (${(out - t0).toFixed(2)}s)`); fails++; }
    for (let j = i + 1; j < MOM.length && MOM[j].t < out - 0.3; j++) if (SPEC[MOM[j].name]?.t !== "avatar") skip.add(j);
    let bed = a ? (a.tipo === "imagen" ? a.src : frameBed(a.src, m.name)) : undefined;
    if (!bed) bed = lastStill();
    if (c.comp === "GuideCTA") bed = LAMINA;
    beats.push({ tipo: "componente", ms_in: Math.round(t0 * 1000), ms_out: Math.round(out * 1000), componente: c.comp, props: { ...p, ...(bed ? { bed } : {}) }, name: m.name });
    continue;
  }
  if (!a) { sinAsset++; console.log(`   sin asset: ${m.name} (${s.t})`); continue; }
  beats.push({ tipo: a.tipo, ms_in: Math.round(t0 * 1000), ms_out: Math.round(Math.min(t1, proxAvatar(t0 + 0.1)) * 1000), src: a.src, name: m.name, real: s.t === "stock" && !a.ia });
}

// ── cierre de huecos: una ventana de avatar nunca se estira; los comps no se estiran de más
beats.sort((a, b) => a.ms_in - b.ms_in);
let rellenos = 0, maxHueco = 0;
const rellenoDe = (msA, msB, idx) => {
  let ia = null;
  for (const m of MOM) {
    if (m.t * 1000 < msA - 50 || m.t * 1000 >= msB) continue;
    if (SPEC[m.name]?.t === "avatar") continue;
    const a = assetDe(m); if (!a) continue;
    const real = SPEC[m.name].t === "stock" && !a.ia;
    if (real) return { tipo: a.tipo, src: a.src, name: m.name, real };
    ia ??= { tipo: a.tipo, src: a.src, name: m.name, real };
  }
  if (ia) return ia;
  for (let k = idx; k >= 0; k--) if (beats[k].tipo === "imagen" || beats[k].tipo === "clip") return { tipo: beats[k].tipo, src: beats[k].src, name: beats[k].name, real: beats[k].real };
  return null;
};
if (beats[0].tipo !== "avatar") { console.error("⛔ no abre con avatar"); fails++; }
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round(TOTAL_S * 1000);
  const h = sig - beats[i].ms_out;
  maxHueco = Math.max(maxHueco, h);
  if (beats[i].tipo === "avatar") {
    if (h <= 0) { beats[i].ms_out = Math.min(beats[i].ms_out, sig); continue; }
    if (i + 1 < beats.length && (beats[i + 1].tipo === "clip" || beats[i + 1].tipo === "imagen")) { beats[i + 1].ms_in = beats[i].ms_out; continue; }
    const r = rellenoDe(beats[i].ms_out, sig, i);
    if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; }
    continue;
  }
  if (beats[i].tipo === "componente" && h > 800) {
    const r = rellenoDe(beats[i].ms_out, sig, i);
    if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; continue; }
  }
  beats[i].ms_out = Math.max(beats[i].ms_in + 1, sig);
}
// ── planos > 7 s → dos cortes del MISMO asset
{
  const out = [];
  for (const b of beats) {
    const d = (b.ms_out - b.ms_in) / 1000;
    if ((b.tipo === "clip" || b.tipo === "imagen") && d > 7) {
      const corte = b.ms_in + Math.round((b.ms_out - b.ms_in) * (0.42 + 0.16 * (((b.ms_in / 1000) * 7.31) % 1)));
      const d1 = (corte - b.ms_in) / 1000, d2 = (b.ms_out - corte) / 1000;
      if (b.tipo === "clip") { const cd = durDe(b.src); const off = Math.max(0, Math.min(cd - d2 - 0.2, Math.max(d1 + 0.5, cd * 0.45))); out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, startFrom: +off.toFixed(2), parte: 2 }); }
      else out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, punch: true, parte: 2 });
    } else out.push(b);
  }
  beats.length = 0; beats.push(...out);
}
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays }, null, 1));
const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · avatar ${n("avatar")} · clip ${n("clip")} · imagen ${n("imagen")} · componente ${n("componente")} · lamina ${n("lamina")} · overlays ${overlays.length}`);
console.log(`momentos sin asset ${sinAsset} · rellenos ${rellenos} · hueco máx ${(maxHueco / 1000).toFixed(1)} s`);
if (fails) { console.error(`⛔ ${fails} fallas de compuerta`); process.exitCode = 1; }
