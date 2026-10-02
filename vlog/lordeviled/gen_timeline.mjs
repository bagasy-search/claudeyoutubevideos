// _v3/lordeviled_shots.json → src/lordeviled/timeline_lordeviled.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco (stock real > clip agnes v2.0 > foto gpt), sonido (sfx/foley/música) y compuertas del build.
//   node vlog/lordeviled/gen_timeline.mjs [--final]     (--final: ningún placeholder ni repuesto sin asset: exit 1)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/lordeviled/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const FINAL = process.argv.includes("--final");
const { END, DELTA = 0, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_wordms.json", "utf8"));
const P = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_paras.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_avwin.json", "utf8")).win; // tiempos del máster VIEJO (el reel se cortó antes de comprimir el minuto 1)
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const CLIP0 = {}; for (const [k, v] of Object.entries(vl)) CLIP0[k] = Math.max(0, v.s - 0.03); // arranque del audio de cada clip hablado (el tramo que se le dio a agnes)
const AV_READY = ex("avatar_clips/lordeviled/reel30.mp4");
const AVSRC = "avatar_clips/lordeviled/reel30.mp4";
// toma que no llegó (clip kf): se muestra la foto de la misma acción (nunca placeholder en la entrega)
const KF_FALL = { d_fill: "b_perfect", d_mayo: "b_mayojar", d_gray: "b_grayring2", d_lump: "b_lumpybowl", d_wet: "b_puddleplate", d_peel: "b_moonegg", d_sieve: "b_scrapesieve",
  d_ice: "b_twobowls", d_cut: "b_popyolks", d_pipe: "b_startip", d_pap: "b_papdust" };
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [], warn = [], fallback = [];
let lastImg = null;
const Wo = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_wordms_old.json", "utf8"));
const toOld = (t) => { // Δ exacto (duración del máster viejo − nuevo) después del seg 64; dentro del minuto 1 (pausas comprimidas) el desfase LOCAL de la palabra más cercana
  if (t > 64) return t + DELTA;
  let lo = 0, hi = 240; while (lo < hi) { const m = (lo + hi) >> 1; if (W[m].s < t) lo = m + 1; else hi = m; }
  return t + (Wo[lo].s - W[lo].s);
};
const avFor = (s0, s1) => { // ventana del reel que contiene [s0,s1] (en tiempo del máster viejo)
  const o0 = toOld(s0), o1 = toOld(s1);
  return avwin.find((w) => o0 >= w.s - 0.15 && o1 <= w.e + 0.2);
};
const avCue = (c, s) => {
  const w = avFor(s.start, s.end);
  if (!w) warn.push(`av sin ventana @${s.start.toFixed(1)}`);
  c.k = "av"; c.src = AV_READY ? AVSRC : null; c.sf = w ? F(toOld(s.start) - w.ms + w.off + (w.lag || 0)) : 0;
};
const imgOf = (name) => (ex(`img/lordeviled/${name}.jpg`) ? `img/lordeviled/${name}.jpg` : null);
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0 };
  if (s.kind === "av") avCue(c, s);
  else if (s.kind === "vl") {
    const p = `vid/lordeviled/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else if (avFor(s.start, s.end)) { avCue(c, s); c.fallback = s.name; fallback.push(s.name); } // repuesto: el reel incluye las ventanas de los clips hablados
    else { c.k = "img"; c.img = null; c.fallback = s.name; fallback.push(s.name); }
  } else if (s.kind === "kf") {
    const p = `vid/lordeviled/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = 0; const fo = `vid/lordeviled/${s.name}_foley.m4a`; if (ex(fo)) foley.push({ from: f0, dur: c.dur, src: fo }); }
    else { c.k = "img"; c.img = imgOf(KF_FALL[s.name]); c.fallback = s.name; fallback.push(s.name); }
  } else if (s.kind === "bi" || s.kind === "lor") {
    const st = `broll/lordeviled_st/${s.name}.mp4`; // stock REAL (Pexels, 30/1 CFR, juzgado en hoja) manda sobre el clip agnes v2.0
    const v2 = `broll/lordeviled/${s.name}.mp4`;
    const clip = ex(st) ? st : ex(v2) ? v2 : null, img = imgOf(s.name);
    if (ex(st)) c.real = 1;
    c.img = img;
    if (clip) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
    c.k = "img"; if (!c.img && !(c.clip && c.real)) warn.push(`falta imagen ${s.name}`);
  } else if (s.kind === "ei") {
    c.k = "snap"; c.img = imgOf(s.name); if (!c.img) warn.push(`falta snapshot ${s.name}`);
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = s.props || {};
  }
  // cama de foto bajo TODO componente de tarjeta (regla 2.quater): la última foto del video antes de esta toma
  if (c.k === "comp" && ["LorRecipeCard", "LorTwoCards", "LorTrick", "LorSignUpSheet", "LorYear"].includes(c.name) && !c.props.bed && lastImg) c.props = { ...c.props, bed: lastImg };
  if (c.k === "comp" && c.props.bed && !ex(c.props.bed)) { warn.push(`cama inexistente ${c.props.bed}`); c.props = { ...c.props, bed: lastImg || undefined }; }
  if ((c.k === "img" || c.k === "snap") && c.img) lastImg = c.img;
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: s.ov.props });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1, impacto en revelaciones, riser antes del loop abierto, pops en overlays
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.22, 20);
  if (c.k === "comp" && c.name === "LorStepCount") { S(t, "lor_whoosh_airy.mp3", 0.3, 40); S(t + 0.4, "lor_impact.mp3", 0.3, 60); }
  if (c.k === "comp" && ["LorYear", "LorTrick"].includes(c.name)) S(t + 0.2, "text_slam.mp3", 0.28, 40);
  if (c.k === "comp" && ["LorEgg3D", "LorDevilTray3D", "LorYolkCrossSection", "LorSieve"].includes(c.name)) S(t, "lor_swell.mp3", 0.22, 80);
  if (c.k === "comp" && c.name === "LorEggTimer") S(t + 0.1, "digit_tick.mp3", 0.25, 40);
  if (c.k === "snap") S(t + 0.15, "lor_paper_pop.mp3", 0.3, 30);
});
for (const o of ovs) S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.25, 20);
S(P[3].s - 2.3, "cp_riser.wav", 0.18, 70); // riser antes del loop abierto del minuto 1
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/lordeviled/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_LORDEVILED = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "lordeviled.m4a";
export const MUSIC = "sfx/lordeviled_bed.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`;
// cues de la capa base para la compuerta de repetición de agnes_qc (un clip = un plano; los vl partidos por un inserto son UNA toma continua)
const qc = [], vlSpan = {};
for (const c of cues) {
  if ((c.k === "vl" || c.k === "kf") && c.src) { const v = (vlSpan[c.src] ||= { key: c.src, src: c.src, a: c.from, b: c.from + c.dur, sf: c.sf }); v.b = c.from + c.dur; }
  if (c.k === "img" && c.clip) qc.push({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF) / FPS });
}
for (const v of Object.values(vlSpan)) qc.push({ key: v.key, src: v.src, start: v.a / FPS, dur: (v.b - v.a) / FPS });
fs.writeFileSync(R + "_v3/lordeviled_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/lordeviled", { recursive: true });
fs.writeFileSync(R + "src/lordeviled/timeline_lordeviled.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm: toda ruta citada en cues/props (recursivo) + derivadas (_last.jpg)
const refs = new Set(["lordeviled.m4a", "sfx/lordeviled_bed.m4a", "ref_lordeviled.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_lordeviled_assets.txt", [...refs].filter((r) => ex(r)).join(String.fromCharCode(10)) + String.fromCharCode(10));
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 6).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
if (fallback.length) console.log("⚠️ repuestos (asset aún no existe):", fallback.length, fallback.slice(0, 14).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 8).join(" · "));
const real = cues.filter((c) => c.real).reduce((a, c) => a + Math.min(c.dur, c.clipF || c.dur), 0) + cues.filter((c) => (c.k === "vl" || c.k === "kf") && c.src && !c.fallback).reduce((a, c) => a + c.dur, 0) + cues.filter((c) => c.k === "snap").reduce((a, c) => a + c.dur, 0);
console.log(`metraje REAL (stock + clips agnes de Loretta + fotos de época): ${(real / FPS).toFixed(0)} s = ${(100 * real / TOTAL).toFixed(1)} %`);
if (FINAL && (faltan.length || warn.length || fallback.length || !AV_READY)) { console.error("⛔ --final: faltan assets/repuestos/avatar"); process.exit(1); }
