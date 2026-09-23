// gen_famascarroz_plan.mjs — DIRECTOR (spec + assets reales en disco) → _v3/famascarroz_plan.json
//   canal Federer Archivos · "La Mascarilla Japonesa de Arroz…" · Fish + RunPod (1 reel) + VLOG agnes 2.5-flash (segmentos hablados)
// (clon de gen_fabolsasojos_plan.mjs + beats VLOG: cada clip agnes 2.5 va EXACTO en el segundo de su segmento)
//   node gen_famascarroz_plan.mjs && node build_famascarroz.mjs
// Clon de gen_fa70estudios_plan.mjs + tipo img · overlays también sobre avatar · ats/flipAt anclados al mapa de palabras
// ⛔ Sin avatar de fondo: cobertura 100 % (lo exige el build). ⛔ Un componente nunca se come una ventana de avatar.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO. ⛔ Tiempos por frase: si caen fuera → exit 1.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const SLUG = "famascarroz", FPS = 30;
const durDe = (rel) => { try { return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
const J = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));

const MOM = J(`_v3/${SLUG}_moments.json`);
if (MOM.some((m) => m.t === undefined)) { console.error("⛔ momentos sin ms"); process.exit(1); }
const WM = J(`_v3/${SLUG}_wordms.json`);
const SPEC = Object.fromEntries(J(`_v3/${SLUG}_spec_all.json`).map((s) => [s.name, s]));
const STOCK = fs.existsSync(`_v3/${SLUG}_stock_res.json`) ? J(`_v3/${SLUG}_stock_res.json`) : {};
const { COMPS } = await import(`./_v3/${SLUG}_comps.mjs`);
const WAV_S = durDe(`${SLUG}.m4a`);
const TOTAL_S = WAV_S + 0.5;
const LAMINA = `img/${SLUG}/${SLUG}_lamina.png`;
if (!existe(LAMINA)) { console.error(`⛔ falta ${LAMINA}`); process.exit(1); }
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");

// ── AVATAR: UN reel RunPod cortado en ventanas (origen = ms exacto del momento en el máster)
const RP = J(`_v3/${SLUG}_rp_groups.json`);
const CORTES = fs.existsSync(`_v3/${SLUG}_cortes_runpod.json`) ? J(`_v3/${SLUG}_cortes_runpod.json`) : [];
// ⛔ el QR tiene que estar EN PANTALLA mientras dice "escaneen el código": esas frases salen de la ventana de avatar
//    (arranca después) y la tarjeta de la guía se estira hasta ahí.
CORTES.push({ ventana: "win-018", en_ventana_s: 0, dur: 6.53 }, { ventana: "win-033", en_ventana_s: 0, dur: 6.69 }, { ventana: "win-056", en_ventana_s: 0, dur: 7.15 });
const avatarBeats = [], WINS_EF = [];
let recortadas = 0;
for (const g of RP.groups) for (const sg of g.segments) {
  const clip = `broll/${SLUG}_av/${sg.win}.mp4`;
  const real = durDe(clip);
  if (!real) { console.error(`⛔ falta ${clip}`); process.exit(1); }
  const dur = Math.min(sg.seconds, real - 0.05);
  const st = sg.master_start_s;
  let a = 0, z = dur;
  for (const c of CORTES.filter((x) => x.ventana === sg.win)) {
    if (c.en_ventana_s >= dur / 2) z = Math.min(z, c.en_ventana_s - 0.05);
    else a = Math.max(a, c.en_ventana_s + c.dur + 0.05);
  }
  if (a > 0 || z < dur) recortadas++;
  z = Math.max(a + 0.5, z);
  WINS_EF.push({ name: sg.win, start: st + a, end: st + z });
  avatarBeats.push({ tipo: "avatar", ms_in: Math.round((st + a) * 1000), ms_out: Math.round((st + z) * 1000), clip, ...(a ? { startFrom: +a.toFixed(3) } : {}) });
}
WINS_EF.sort((x, y) => x.start - y.start);
console.log(`avatar: ${WINS_EF.length} ventanas · cortes de audio RunPod ${CORTES.length} · recortadas ${recortadas}`);
// ── VLOG agnes 2.5-flash: cada segmento con sync OK = un plano EXACTO en su tramo del máster (como una ventana de presentador)
const VSEGS = fs.existsSync(`_v3/${SLUG}_vlog_segs.json`) ? J(`_v3/${SLUG}_vlog_segs.json`) : [];
const VST = fs.existsSync(`_v3/${SLUG}_ag25_state.json`) ? J(`_v3/${SLUG}_ag25_state.json`) : {};
const vlogBeats = [], VLOGMOM = new Set();
for (const g of VSEGS) {
  const clip = `broll/${SLUG}_ag25/${g.id}.mp4`;
  if (!VST[g.id]?.ok || !existe(clip)) continue;
  const real = durDe(clip);
  WINS_EF.push({ name: g.id, start: g.a, end: g.a + Math.min(g.z - g.a, real), vlog: true });
  vlogBeats.push({ tipo: "clip", vlog: true, ms_in: Math.round(g.a * 1000), ms_out: Math.round((g.a + Math.min(g.z - g.a, real)) * 1000), src: clip, name: g.id });
  g.moments.forEach((n) => VLOGMOM.add(n));
}
WINS_EF.sort((x, y) => x.start - y.start);
console.log(`vlog agnes 2.5: ${vlogBeats.length}/${VSEGS.length} segmentos con clip OK · ${vlogBeats.reduce((a, b) => a + (b.ms_out - b.ms_in), 0) / 1000} s`);
const enAvatar = (s) => WINS_EF.some((w) => s >= w.start - 0.05 && s < w.end - 0.25);
const proxAvatar = (s) => { const w = WINS_EF.find((x) => x.start >= s - 0.05); return w ? w.start : TOTAL_S; };

// ── asset de cada momento: pres/img → clip i2v (broll/<slug>_pres) > foto gpt · stock → clip > foto
const bedDir = `img/${SLUG}`;
const frameBed = (clipRel, name) => {
  const out = `${bedDir}/${name}_bed.jpg`;
  if (!existe(out)) spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.max(0.2, durDe(clipRel) * 0.4)), "-i", path.join("public", clipRel), "-frames:v", "1", "-q:v", "3", path.join("public", out)]);
  return existe(out) ? out : undefined;
};
const RECHAZ = fs.existsSync(`_v3/${SLUG}_i2v_rechazados.json`) ? new Set(J(`_v3/${SLUG}_i2v_rechazados.json`)) : new Set();
const assetDe = (m) => {
  let s = SPEC[m.name];
  if (s?.use) { const nm = `${SLUG}_${s.use}`; const c = `broll/${SLUG}_pres/${nm}.mp4`, f = `img/${SLUG}/${nm}.jpg`;
    if (existe(c) && !RECHAZ.has(nm)) return { tipo: "clip", src: c, ia: true };
    if (existe(f)) return { tipo: "imagen", src: f, ia: true }; }
  if (s?.t === "vlog") {   // respaldo del vlog que no salió: foto gpt del presentador en ESE paso (+ i2v leve)
    const c = `broll/${SLUG}_pres/${m.name}.mp4`, f = `img/${SLUG}/${m.name}.jpg`;
    if (existe(c) && !RECHAZ.has(m.name)) return { tipo: "clip", src: c, ia: true };
    if (existe(f)) return { tipo: "imagen", src: f, ia: true };
  }
  if (s?.t === "pres" || s?.t === "img") {
    const c = `broll/${SLUG}_pres/${m.name}.mp4`, f = `img/${SLUG}/${m.name}.jpg`;
    if (existe(c) && !RECHAZ.has(m.name)) return { tipo: "clip", src: c, ia: true };
    if (existe(f)) return { tipo: "imagen", src: f, ia: true };
  }
  const r = STOCK[m.name];
  if (r?.kind === "clip" && existe(r.file)) return { tipo: "clip", src: r.file, real: true };
  if (r?.kind === "photo" && existe(r.file)) return { tipo: "imagen", src: r.file, real: true };
  return null;
};

const bDe = (m) => { const r = STOCK[m.name + "_b"];
  if (r?.kind === "clip" && existe(r.file)) return { tipo: "clip", src: r.file, real: true };
  if (r?.kind === "photo" && existe(r.file)) return { tipo: "imagen", src: r.file, real: true };
  return null; };
const palabras = (p) => JSON.stringify(Object.entries(p).filter(([k]) => !/image|cover|qr|bed|tone|side|hue|medico|active|hour|onImage|tag|domain/.test(k)).map(([, v]) => v))
  .replace(/"(img|broll)\/[^"]+"/g, "").split(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9¿?¡!]+/).filter(Boolean).length;

// palabra → ms: busca la secuencia `ws` dentro de [i0, i0+span) del guion
const buscarWords = (i0, ws, span = 120) => {
  const out = []; let k = i0;
  for (const w of ws) {
    const n = norm(w); if (!n) { out.push(null); continue; }
    let hit = -1;
    for (let j = k; j < Math.min(WM.length, i0 + span); j++) if (WM[j].w === n) { hit = j; break; }
    if (hit < 0) return null;
    out.push(WM[hit].ms); k = hit + 1;
  }
  return out;
};
const tiempoErr = [];
const STOCKFIRST = new Set(["036", "044", "061", "147", "161", "164", "166", "217", "224", "052", "222", "034", "120", "127", "190", "104"]);

const compDe = Object.fromEntries(COMPS.filter((c) => !c.overlay).map((c) => [c.name, c]));
const ovDe = Object.fromEntries(COMPS.filter((c) => c.overlay).map((c) => [c.name, c]));
const beats = [...avatarBeats, ...vlogBeats];
const overlays = [];
let sinAsset = 0, recortados = 0;
const skip = new Set();
const CAP = { ErrorStinger: 2.6, GuiaCTA3D: 16, RecetaEscena: 12, PhotoTriptych: 10 };
const PISO = { GuiaCTA3D: 16, RecetaEscena: 9, MitoVerdad: 8, HourDial: 5 };

for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  const t0 = Math.max(m.t, 0), t1 = m.t + m.dur;
  // overlays: también sobre las ventanas de avatar (lower third sobre el médico)
  const ov = ovDe[m.name];
  if (ov) {
    const piso = Math.min(8, 2.6 + 0.28 * Math.max(0, palabras(ov.props) - 3));
    let t0 = Math.max(m.t, 0);
    let fin = Math.min(t0 + Math.max(Math.min(m.dur, 7), piso), TOTAL_S);
    const props = { ...ov.props };
    if (ov.ats) {
      const ms = buscarWords(WM.findIndex((w) => w.ms >= m.t * 1000 - 50), props.words.map((w) => w.t));
      if (!ms) tiempoErr.push(`${m.name} FraseCinetica: palabras no encontradas en la frase`);
      else {
        // la frase cinética entra 0,4 s antes de SU primera palabra y se queda 2 s después de la última
        t0 = Math.max(m.t, ms[0] / 1000 - 0.4);
        fin = Math.min(Math.max(t0 + piso, ms[ms.length - 1] / 1000 + 2), TOTAL_S);
        const base = ms[0];
        props.ats = ms.map((x) => Math.round(((x ?? base) - t0 * 1000 + 150) * FPS / 1000));
        const fr = Math.round((fin - t0) * FPS);
        if (props.ats.some((a) => a < 0 || a > fr - 15)) tiempoErr.push(`${m.name} FraseCinetica: ats ${props.ats} fuera de 0..${fr}`);
      }
    }
    overlays.push({ componente: ov.comp, kit: ov.kit, props, ms_in: Math.round(t0 * 1000), ms_out: Math.round(fin * 1000), name: m.name });
  }
  if (SPEC[m.name]?.t === "avatar" || VLOGMOM.has(m.name) || skip.has(i)) continue;
  if (enAvatar(t0 + 0.1)) continue;
  if (SPEC[m.name]?.t === "lamina") {
    const prev = [...beats].reverse().find((x) => x.tipo === "lamina" && x.ms_out >= Math.round(t0 * 1000) - 400);
    beats.push({ tipo: "lamina", ms_in: Math.round(t0 * 1000), ms_out: Math.round(Math.min(t1, proxAvatar(t0 + 0.1)) * 1000), src: LAMINA, zoom: SPEC[m.name].z, desde: prev ? prev.zoom : "completa", name: m.name });
    continue;
  }
  const c = compDe[m.name];
  let a = assetDe(m);
  if (c) {
    const cap = CAP[c.comp] ?? 11;
    const piso = Math.min(cap, Math.max(PISO[c.comp] ?? 0, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3)));
    let out = Math.min(t0 + Math.min(cap, Math.max(m.dur, piso)), proxAvatar(t0 + 0.1), TOTAL_S);
    if (out - t0 < piso - 0.05) recortados++;
    for (let j = i + 1; j < MOM.length && MOM[j].t < out - 0.3; j++) if (SPEC[MOM[j].name]?.t !== "avatar") skip.add(j);
    let bed;
    if (a?.tipo === "imagen") bed = a.src; else if (a?.tipo === "clip") bed = frameBed(a.src, m.name);
    if (!bed) {
      const prev = [...beats].reverse().find((x) => x.tipo === "imagen" || x.tipo === "clip");
      if (prev) bed = prev.tipo === "imagen" ? prev.src : frameBed(prev.src, `${m.name}_prev`);
    }
    const props = { ...c.props, ...(bed ? { bed } : {}) };
    if (c.flipWord) {
      const i0 = WM.findIndex((w) => w.ms >= t0 * 1000 - 50);
      const ms = buscarWords(i0, [c.flipWord], 200);
      const fr = ms ? Math.round((ms[0] - t0 * 1000) * FPS / 1000) : -1;
      const D = Math.round((out - t0) * FPS);
      if (fr < 20 || fr > D - 45) tiempoErr.push(`${m.name} MitoVerdad flipAt ${fr} fuera de 20..${D - 45} ("${c.flipWord}")`);
      props.flipAt = fr;
    }
    beats.push({ tipo: "componente", ms_in: Math.round(t0 * 1000), ms_out: Math.round(out * 1000), componente: c.comp, kit: c.kit, props, name: m.name });
    continue;
  }
  if (!a) { sinAsset++; continue; }
  const tEnd = Math.min(t1, proxAvatar(t0 + 0.1));
  let b2 = bDe(m);
  // metraje REAL primero en estos momentos (el stock _b muestra lo mismo que la foto IA; la IA queda de 2º plano o se cae)
  if (b2 && STOCKFIRST.has(m.name.slice(-3)) && a) { const t = a; a = b2; b2 = { ...t, real: false }; }
  // ⭐ PACING: un momento largo = DOS planos con DOS assets distintos (el suyo + un 2º real de ESA frase)
  if (b2 && tEnd - t0 > 4.2) {
    const agn = /_pres\//.test(a.src);
    const frac = 0.45 + 0.15 * ((t0 * 7.31) % 1);
    const cut = t0 + Math.min(agn ? 4.0 : 99, Math.max(2.2, (tEnd - t0) * frac));
    beats.push({ tipo: a.tipo, ms_in: Math.round(t0 * 1000), ms_out: Math.round(cut * 1000), src: a.src, name: m.name, real: !!a.real });
    beats.push({ tipo: b2.tipo, ms_in: Math.round(cut * 1000), ms_out: Math.round(tEnd * 1000), src: b2.src, name: m.name + "_b", real: true });
    continue;
  }
  beats.push({ tipo: a.tipo, ms_in: Math.round(t0 * 1000), ms_out: Math.round(tEnd * 1000), src: a.src, name: m.name, real: !!a.real });
}
if (tiempoErr.length) { tiempoErr.forEach((e) => console.error("⛔ [tiempo] " + e)); process.exitCode = 1; }

// ── CIERRE DE HUECOS (sin avatar de fondo, todo hueco se cierra; la ventana de avatar nunca se estira)
beats.sort((a, b) => a.ms_in - b.ms_in);
let huecosCerrados = 0, maxHueco = 0, rellenos = 0;
const ultimoNoAvatar = (idx) => { for (let k = idx; k >= 0; k--) if (beats[k].tipo !== "avatar" && beats[k].tipo !== "lamina" && !beats[k].vlog && beats[k].src) return beats[k]; return null; };
const rellenoDe = (msA, msB, idx) => {
  const usados = new Set(beats.map((b) => b.src).filter(Boolean));
  const cand = [];
  for (const m of MOM) {
    if (m.t * 1000 < msA - 50 || m.t * 1000 >= msB) continue;
    if (SPEC[m.name]?.t === "avatar") continue;
    cand.push(assetDe(m), bDe(m));
  }
  for (const m of MOM) {                                  // cualquier asset SIN USAR de la zona (±45 s)
    if (Math.abs(m.t * 1000 - msA) > 120000 || SPEC[m.name]?.t === "avatar") continue;
    cand.push(bDe(m), assetDe(m));
  }
  const prevB = ultimoNoAvatar(idx);
  if (prevB) { const pm = MOM.find((x) => x.name === String(prevB.name).replace(/_b$/, "")); if (pm) cand.push(bDe(pm), assetDe(pm)); }
  for (const a of cand) if (a && !usados.has(a.src)) return { tipo: a.tipo, src: a.src, name: "relleno", real: !!a.real };
  const prev = ultimoNoAvatar(idx);
  return prev ? { tipo: prev.tipo, src: prev.src, name: prev.name, real: prev.real } : null;
};
if (beats[0].ms_in > 0 && beats[0].tipo !== "avatar") beats[0].ms_in = 0;
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round(TOTAL_S * 1000);
  const h = sig - beats[i].ms_out;
  if (beats[i].tipo === "avatar" || beats[i].vlog) {
    if (h <= 0) { beats[i].ms_out = Math.min(beats[i].ms_out, sig); continue; }
    if (i + 1 < beats.length && beats[i + 1].tipo !== "avatar" && !beats[i + 1].vlog) beats[i + 1].ms_in = beats[i].ms_out;
    else {
      const r = rellenoDe(beats[i].ms_out, sig, i);
      if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; }
    }
    huecosCerrados++; maxHueco = Math.max(maxHueco, h);
    continue;
  }
  if (beats[i].tipo === "componente" && h > 800 && h <= 3500 && beats[i].componente !== "ErrorStinger") {   // se estira el componente, no se repite un plano
    beats[i].ms_out = sig; huecosCerrados++; maxHueco = Math.max(maxHueco, h); continue;
  }
  if (beats[i].tipo === "componente" && h > 800) {
    const r = rellenoDe(beats[i].ms_out, sig, i);
    if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; huecosCerrados++; maxHueco = Math.max(maxHueco, h); continue; }
  }
  if (h > 0) { huecosCerrados++; maxHueco = Math.max(maxHueco, h); }
  beats[i].ms_out = Math.max(beats[i].ms_in + 1, sig);
}
console.log(`rellenos insertados: ${rellenos}`);

// ── PACING: planos >7 s → dos cortes del MISMO asset (clip: otro tramo · foto: punch-in)
{
  const out = []; let partidos = 0;
  for (const b of beats) {
    const d = (b.ms_out - b.ms_in) / 1000;
    if (b.tipo === "imagen" && d > 7) {   // ⛔ los clips NO se parten (agnes_qc: un clip = un plano)
      const frac = 0.42 + 0.16 * (((b.ms_in / 1000) * 7.31) % 1);
      const corte = b.ms_in + Math.round((b.ms_out - b.ms_in) * frac);
      const d1 = (corte - b.ms_in) / 1000, d2 = (b.ms_out - corte) / 1000;
      if (b.tipo === "clip") {
        const cd = durDe(b.src);
        const off = Math.max(0, Math.min(cd - d2 - 0.2, Math.max(d1 + 1.2, cd * 0.45)));
        out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, startFrom: +off.toFixed(2), parte: 2 });
      } else out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, punch: true, parte: 2 });
      partidos++;
    } else out.push(b);
  }
  beats.length = 0; beats.push(...out);
  console.log(`planos largos partidos: ${partidos}`);
}
const ult = beats[beats.length - 1];
if (ult.tipo === "avatar" && TOTAL_S * 1000 - ult.ms_out > 600) console.log(`⚠️ el video termina ${((TOTAL_S * 1000 - ult.ms_out) / 1000).toFixed(1)} s después de la última ventana`);

fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays }, null, 1));
const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · avatar ${n("avatar")} · clip ${n("clip")} · imagen ${n("imagen")} · componente ${n("componente")} · lámina ${n("lamina")} · overlays ${overlays.length}`);
console.log(`momentos sin asset ${sinAsset} · huecos cerrados ${huecosCerrados} (máx ${(maxHueco / 1000).toFixed(1)} s) · comps recortados por avatar ${recortados} · total ${(TOTAL_S / 60).toFixed(2)} min`);
