// _v3/olcabin_shots.json → src/olcabin/timeline_olcabin.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco, "@frase" en props (segundos desde el inicio de la toma, ms real del anclaje),
// sonido (sfx/foley) y compuertas del build. node vlog/olcabin/gen_timeline.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcabin/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/olcabin_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olcabin_wordms.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/olcabin_avwin.json", "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const flat = W.map((w) => norm(w.w).join(""));
const findFrom = (ph, i0) => { const q = ph.split(/\s+/).map((x) => norm(x).join("")).filter(Boolean); for (let i = i0; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; };
// arranque del tramo de audio de cada clip hablado (el que se le dio a agnes: vlog/olcabin/tramos.py)
const CLIP0 = JSON.parse(fs.readFileSync(R + "vlog/olcabin/tramos/_tramos.json", "utf8")); for (const k of Object.keys(CLIP0)) CLIP0[k] = CLIP0[k][0];
// foley de respaldo para los detalles sin clip (sfx reales de la biblioteca)
const KF_SFX = { d_pour: "px_gluglu.mp3", d_spoon: "px_bubble.mp3", d_salt: "px_fizz_alt1.mp3", d_sort: "px_wipe.mp3", d_skim: "px_bubble_alt1.mp3", d_lid: "px_capPop.mp3", d_kettle: "px_gluglu_alt2.mp3", d_soda: "px_fizz.mp3", d_liquor: "px_gluglu_alt1.mp3", d_layer: "px_wipe_alt1.mp3", d_liftpot: "Crackling_campfire_w_#1-1780924416643.mp3", d_lidoff: "px_bubble_alt2.mp3" };
const AV = "avatar_clips/olcabin/reel30.mp4", AV_READY = ex(AV);
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [];
const warn = [];
let lastBed = null;
// resuelve "@frase" (recursivo) → segundos desde el inicio de la toma
const resolve = (o, s) => {
  if (typeof o === "string" && o.startsWith("@")) { const i = findFrom(o.slice(1), s.w0 ?? 0); if (i < 0) { warn.push(`@ no encontrado "${o}" en ${s.name}`); return 0; } return +(W[i].s - s.start).toFixed(2); }
  if (Array.isArray(o)) return o.map((x) => resolve(x, s));
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, resolve(v, s)]));
  return o;
};
const avAt = (t) => avwin.find((w) => t >= w.s - 0.06 && t < w.e + 0.06);
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0 };
  if (s.kind === "av") {
    const w = avAt(s.start); if (!w) warn.push(`av sin ventana @${s.start}`);
    c.src = AV_READY ? AV : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0;
  } else if (s.kind === "vl") {
    const p = `vid/olcabin/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else { const w = avAt(s.start); if (!w) warn.push(`vl ${s.name} sin ventana de avatar @${s.start}`); c.k = "av"; c.src = AV_READY ? AV : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/olcabin/${s.name}.mp4`;
    if (ex(p)) { c.clipF = Math.floor(probeDur(p) * FPS) - 1; c.src = p; c.sf = Math.max(0, Math.min(F(s.sf || 0), c.clipF - c.dur)); c.clipF -= c.sf; if (ex(`vid/olcabin/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/olcabin/${s.name}_foley.m4a`, sf: c.sf }); }
    else { // respaldo: el ancla "a" del detalle (foto gpt de manos) con Ken-Burns + foley de sfx
      c.k = "img"; c.img = ex(`img/olcabin/kf/${s.name}.jpg`) ? `img/olcabin/kf/${s.name}.jpg` : null; c.fallback = s.name;
      if (KF_SFX[s.name]) foley.push({ from: f0, dur: c.dur, src: "sfx/" + KF_SFX[s.name], vol: 0.5 });
    }
  } else if (s.kind === "st") {
    const p = `broll/olcabin_st30/${s.name}.mp4`; // s.name = slot st_*
    c.k = "img"; c.real = 1; c.clip = ex(p) ? p : null; c.clipF = c.clip ? Math.floor(probeDur(p) * FPS) - 1 : 0; c.img = null;
    if (!c.clip) warn.push(`falta stock ${s.name}`); else lastBed = p;
  } else if (s.kind === "ar") {
    c.k = "arch"; c.real = 1; c.img = ex(`img/olcabin/ar/${s.name}.jpg`) ? `img/olcabin/ar/${s.name}.jpg` : null; if (!c.img) warn.push(`falta archivo ${s.name}`);
  } else if (s.kind === "bi" || s.kind === "ole") {
    const img = ex(`img/olcabin/${s.name}.png`) ? `img/olcabin/${s.name}.png` : ex(`img/olcabin/${s.name}.jpg`) ? `img/olcabin/${s.name}.jpg` : null;
    const clip = `broll/olcabin/${s.name}.mp4`;
    c.k = "img"; c.img = img; if (!img) warn.push(`falta imagen ${s.name}`); else lastBed = img;
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = resolve(s.props || {}, s);
  }
  if (c.k === "comp" && ["OleMythTrick", "OleHeatCurve", "OleSaltAcidTimeline", "OleRecapCard", "OleBeanSwell"].includes(c.name) && !c.props.bed && lastBed && !/\.mp4$/.test(lastBed)) c.props = { ...c.props, bed: lastBed };
  if (s.ov) ovs.push({ from: f0, dur: s.ov.ovDur ? Math.min(F(s.ov.ovDur), TOTAL - f0) : c.dur, name: s.ov.c, props: resolve(s.ov.props || {}, s) });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1; foley de fogón/hervor bajo los 3D y el pozo; papel/lápiz en tarjetas
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  else if (c.k === "comp" && i > 0) S(t - 0.1, "sfx_whoosh_soft.mp3", 0.14, 20);
  if (c.k === "comp" && ["OleBookPage", "CabinRecipeBook3D"].includes(c.name)) S(t + 0.1, "yc_page_flip.mp3", 0.3, 40);
  if (c.k === "comp" && ["OriginMap", "GrandmaCard"].includes(c.name)) S(t + 0.3, "yc_pencil.mp3", 0.22, Math.min(c.dur, 90));
  if (c.k === "comp" && c.name === "TinRecipeBox3D") S(t + 0.2, "soft_organic_wooden__#4-1780923840971.mp3", 0.3, 50);
  if (c.k === "comp" && c.name === "CabinCutaway3D") S(t, "amb_fuego.mp3", 0.3, Math.min(c.dur, 200));
  if (c.k === "comp" && c.name === "OleCTA") S(t, "warm_rising_tonal_sw_#3-1780924218410.mp3", 0.25, 60);
  if (c.k === "comp" && ["BooyahKettle3D", "PorridgeBowl3D"].includes(c.name)) S(t, "px_bubble.mp3", 0.3, Math.min(c.dur, 120));
  if (c.k === "arch") S(t + 0.1, "gentle_papercard_pop_#2-1780923860389.mp3", 0.22, 30);
});
for (const o of ovs) {
  const t = o.from / FPS;
  if (o.name === "RecipeCountdown") S(t + 0.05, "stinger_hit.mp3", 0.28, 40);
  else if (o.name === "OleRuleCard") S(t + 0.15, "yc_paper_tear.mp3", 0.18, 30);
  else S(t + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.22, 20);
}
// fuego/brasas REAL de stock: ambiente de fogón bajo esos planos (el stock viene mudo)
cues.forEach((c, i) => { const n = shots[i].name; if (["st_woodstove_fire", "st_cast_iron_skillet", "st_big_kettle_outdoor"].includes(n)) foley.push({ from: c.from, dur: c.dur, src: "sfx/amb_fuego.mp3", vol: 0.35 }); });
// ambiente continuo de estufa bajo el minuto 1 (compuerta: 0 silencios en el minuto 1)
foley.push({ from: 0, dur: F(64), src: "sfx/olcabin_amb_m1.m4a", vol: 0.85 });
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/olcabin/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_OLCABIN = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "olcabin.m4a";
export const MUSIC = "sfx/olcabin_bed.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`;
// cues de la capa base para la compuerta de repetición (agnes_qc)
const qc = [];
for (const c of cues) {
  if ((c.k === "vl" || c.k === "kf") && c.src) qc.push({ key: c.src + "@" + c.sf, src: c.src, start: c.from / FPS, dur: c.dur / FPS });
  if (c.k === "img" && c.clip) qc.push({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF) / FPS });
}
fs.writeFileSync(R + "_v3/olcabin_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/olcabin", { recursive: true });
fs.writeFileSync(R + "src/olcabin/timeline_olcabin.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm
const refs = new Set(["olcabin.m4a", "sfx/olcabin_bed.m4a", "ref_olcabin.png", "qr_ole_olcabin.png", "img/ole/portada.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_olcabin_assets.txt", [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos (asset aún no existe):", fb.length, fb.map((c) => c.fallback).join(" "));
const shortClip = cues.filter((c) => (c.k === "img" && c.clip && c.clipF < c.dur - 1 && c.real) || (c.k === "kf" && c.clipF < c.dur - 1)); if (shortClip.length) console.log("⚠️ clip más corto que su plano:", shortClip.map((c) => `${c.clip || c.src}(${c.clipF}<${c.dur})`).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 10).join(" · "));
