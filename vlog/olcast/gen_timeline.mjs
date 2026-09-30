// _v3/olcast_shots.json → src/olcast/timeline_olcast.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco, "@frase" en props (segundos desde el inicio de la toma, ms real del anclaje),
// sonido (sfx/foley) y compuertas del build. node vlog/olcast/gen_timeline.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcast/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/olcast_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olcast_wordms.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/olcast_avwin.json", "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const flat = W.map((w) => norm(w.w).join(""));
const findFrom = (ph, i0) => { const q = norm(ph); for (let i = i0; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; };
// arranque del tramo de audio de cada clip hablado (el que se le dio a agnes: vlog/olcast/tramos.py)
const CLIP0 = { m1: 0.0, m2: 7.82, m3: 17.58, m4: 30.92, m5: 42.24, m6: 148.68, m7: 166.46, m8: 330.30, m9: 672.90 };
// foley de respaldo para los detalles sin clip (sfx reales de la biblioteca)
const KF_SFX = { d_pour: "px_gluglu.mp3", d_spoon: "px_bubble.mp3", d_salt: "px_fizz_alt1.mp3", d_sort: "px_wipe.mp3", d_skim: "px_bubble_alt1.mp3", d_lid: "px_capPop.mp3", d_kettle: "px_gluglu_alt2.mp3", d_soda: "px_fizz.mp3", d_liquor: "px_gluglu_alt1.mp3", d_layer: "px_wipe_alt1.mp3", d_liftpot: "Crackling_campfire_w_#1-1780924416643.mp3", d_lidoff: "px_bubble_alt2.mp3" };
const AV = "avatar_clips/olcast/reel30.mp4", AV_READY = ex(AV);
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
    const p = `vid/olcast/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else { const w = avAt(s.start); if (!w) warn.push(`vl ${s.name} sin ventana de avatar @${s.start}`); c.k = "av"; c.src = AV_READY ? AV : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/olcast/${s.name}.mp4`;
    if (ex(p)) { c.clipF = Math.floor(probeDur(p) * FPS) - 1; c.src = p; c.sf = Math.max(0, Math.min(F(s.sf || 0), c.clipF - c.dur)); c.clipF -= c.sf; if (ex(`vid/olcast/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/olcast/${s.name}_foley.m4a`, sf: c.sf }); }
    else { // respaldo: el ancla "a" del detalle (foto gpt de manos) con Ken-Burns + foley de sfx
      c.k = "img"; c.img = ex(`img/olcast/kf/${s.name}.jpg`) ? `img/olcast/kf/${s.name}.jpg` : null; c.fallback = s.name;
      if (KF_SFX[s.name]) foley.push({ from: f0, dur: c.dur, src: "sfx/" + KF_SFX[s.name], vol: 0.5 });
    }
  } else if (s.kind === "st") {
    const p = `broll/olcast_st30/${s.name}.mp4`;
    c.k = "img"; c.real = 1; c.clip = ex(p) ? p : null; c.clipF = c.clip ? Math.floor(probeDur(p) * FPS) - 1 : 0; c.img = null;
    if (!c.clip) warn.push(`falta stock ${s.name}`); else lastBed = p;
  } else if (s.kind === "ar") {
    c.k = "arch"; c.real = 1; c.img = ex(`img/olcast/ar/${s.name}.jpg`) ? `img/olcast/ar/${s.name}.jpg` : null; if (!c.img) warn.push(`falta archivo ${s.name}`);
  } else if (s.kind === "bi" || s.kind === "ole") {
    const img = ex(`img/olcast/${s.name}.png`) ? `img/olcast/${s.name}.png` : ex(`img/olcast/${s.name}.jpg`) ? `img/olcast/${s.name}.jpg` : null;
    const clip = `broll/olcast/${s.name}.mp4`;
    c.k = "img"; c.img = img; if (!img) warn.push(`falta imagen ${s.name}`); else lastBed = img;
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = resolve(s.props || {}, s);
  }
  if (c.k === "comp" && ["OleMythTrick", "OleHeatCurve", "OleSaltAcidTimeline", "OleRecapCard", "OleBeanSwell"].includes(c.name) && !c.props.bed && lastBed && !/\.mp4$/.test(lastBed)) c.props = { ...c.props, bed: lastBed };
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: resolve(s.ov.props || {}, s) });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1; foley de fogón/hervor bajo los 3D y el pozo; papel/lápiz en tarjetas
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS, d = c.dur / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  if (c.k === "comp" && c.name === "OleDutchOven3D") S(t, "Crackling_campfire_w_#1-1780924416643.mp3", 0.3, Math.min(c.dur, 300));
  if (c.k === "comp" && ["OleBookPage", "OleRecapCard"].includes(c.name)) S(t + 0.1, "yc_page_flip.mp3", 0.3, 40);
  if (c.k === "comp" && c.name === "OleCTA") S(t, "warm_rising_tonal_sw_#3-1780924218410.mp3", 0.25, 60);
  if (c.k === "comp" && ["OlcPanCross3D", "OlcPanRescue3D"].includes(c.name)) S(t, "section_swell.mp3", 0.25, Math.min(c.dur, 120));
  if (c.k === "comp" && c.name === "OlcPanRescue3D") { const sc = c.dur / FPS; S(t + (shots[i].props?.teaser ? 0.4 : sc * 0.16), "px_wipe_alt2.mp3", 0.5, 90); S(t + (shots[i].props?.teaser ? 0.7 : sc * 0.3), "px_wipe.mp3", 0.5, 90); S(t + (shots[i].props?.teaser ? 1.0 : sc * 0.44), "px_wipe_alt1.mp3", 0.5, 90); if (!shots[i].props?.teaser) S(t + sc * 0.78, "px_sparkleClean.mp3", 0.35, 60); }
  if (c.k === "comp" && ["OlcStoreVsCamp", "OlcFixTable", "OlcFirstWeeks", "OlcLayerCount", "OlcSmokeLadder"].includes(c.name)) S(t + 0.1, "gentle_papercard_pop_#2-1780923860389.mp3", 0.25, 30);
  if (c.k === "comp" && c.name === "OlcStoreVsCamp") S(t + (shots[i].props?.flipAt ?? 3), "yc_page_flip.mp3", 0.35, 40);
  if (c.k === "comp" && c.name === "OlcOvenStack") { S(t, "amb_fuego.mp3", 0.25, c.dur); S(t + 0.9, "soft_padded_stop_thu_#1-1780923893866.mp3", 0.4, 30); }
  if (c.k === "comp" && c.name === "OlcHeatMap") S(t + 1.5, "px_fizz.mp3", 0.3, 90);
  if (c.k === "comp" && c.name === "OlcFlick") S(t, "px_fizz_alt2.mp3", 0.4, 60);
  if (c.k === "comp" && c.name === "OlcBriquette") for (let k = 0; k < 8; k++) S(t + 9.5 + k * 0.5, "soft_organic_wooden__#4-1780923840971.mp3", 0.28, 20);
  if (c.k === "comp" && c.name === "OlcRustCheck") for (let k = 0; k < 6; k++) S(t + 1.4 + k * 0.62, "soft_organic_wooden__#4-1780923840971.mp3", 0.3 - k * 0.03, 20);
  if (c.k === "arch") S(t + 0.1, "gentle_papercard_pop_#2-1780923860389.mp3", 0.22, 30);
  if (c.real && c.k === "img" && /fire|ember|coal|stove/.test(JSON.stringify(shots[i].name))) {} // stock mudo
});
for (const o of ovs) {
  const t = o.from / FPS;
  if (o.name === "OleStamp") S(t + (typeof o.props.at === "number" ? o.props.at : 0.5), "yc_stamp.mp3", 0.3, 30);
  else if (o.name === "OleRuleCard") S(t + 0.15, "yc_paper_tear.mp3", 0.18, 30);
  else S(t + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.22, 20);
}
// foley REAL bajo las tomas mudas (stock Pexels y clips v2.0): sfx de la biblioteca por nombre de toma
const FOL = { b_oilpour: "px_gluglu.mp3", b_wipeback: "px_wipe.mp3", b_wipeoff: "px_wipe_alt1.mp3", b_rubpan: "px_wipe_alt2.mp3", b_dropsoil: "px_bubble.mp3", b_soap: "px_fizz.mp3", b_simmer: "px_bubble_alt1.mp3",
  b_thinoil: "px_wipe.mp3", b_stucksupper: "px_fizz_alt1.mp3", b_thickmess: "px_wipe_alt1.mp3", b_shockcrack: "px_fizz_alt2.mp3", b_vinegar: "px_bubble_alt2.mp3", b_eggslide: "px_gluglu_alt2.mp3", b_layerbuild: "px_bubble.mp3",
  b_lidlifter: "px_capPop.mp3", b_gummy: "px_wipe_alt2.mp3", b_sticky: "px_wipe_alt2.mp3", b_tacky: "px_wipe_alt2.mp3", b_knuckle: "soft_organic_wooden__#4-1780923840971.mp3", s_eggs: "px_fizz_alt1.mp3", s_campskillet: "Crackling_campfire_w_#1-1780924416643.mp3", s_oldcoals: "amb_fuego.mp3", s_potatocamp: "Crackling_campfire_w_#1-1780924416643.mp3", s_griddle: "px_fizz_alt2.mp3", s_dutchfire: "Crackling_campfire_w_#1-1780924416643.mp3", s_rubpan: "px_wipe_alt2.mp3", s_thinoil: "px_wipe.mp3", s_bacon: "px_fizz_alt1.mp3", s_sausage: "px_fizz.mp3", s_hashbrowns: "px_fizz_alt2.mp3",
  s_baconcold: "px_fizz_alt1.mp3", s_oilpan: "px_gluglu_alt1.mp3", s_oilbottle: "px_gluglu.mp3", s_oilpour: "px_gluglu_alt2.mp3", s_scrub: "px_wipe.mp3", s_washpan: "px_bubble_alt2.mp3", s_vinegar: "px_gluglu_alt1.mp3", s_highburner: "amb_fuego.mp3", s_smokepan: "px_fizz_alt2.mp3",
  s_embers: "Crackling_campfire_w_#1-1780924416643.mp3", s_charcoalsmoke: "amb_fuego.mp3", s_cornbread: "Crackling_campfire_w_#1-1780924416643.mp3", s_dryburner: "amb_fuego.mp3", s_ovendoor: "soft_mechanical_odom_#3-1780923982906.mp3" };
cues.forEach((c, i) => { const n = shots[i].name; if (FOL[n]) foley.push({ from: c.from, dur: Math.min(c.dur, 150), src: "sfx/" + FOL[n], vol: 0.55 }); });
// pausas de la voz > 0,28 s en el minuto 1: un golpe corto de sfx en el medio (la compuerta exige 0 silencios de >0,3 s a -32 dB)
{ const FX = ["whoosh.mp3", "sfx_thump.mp3", "cam_zoom_punch.mp3", "sfx_pop.mp3", "cam_travel.mp3"]; let k = 0;
  for (let i = 1; i < W.length; i++) { const g0 = W[i - 1].e, g1 = W[i].s; if (g1 < 62 && g1 - g0 > 0.26) sfx.push({ from: F(g0 + 0.02), dur: Math.max(6, Math.min(F(0.55), F(g1 - g0 - 0.03))), src: "sfx/" + FX[k++ % FX.length], vol: 1.0 }); } }
// ambiente continuo de estufa bajo el minuto 1 (compuerta: 0 silencios en el minuto 1; las pausas naturales de la voz quedaban mudas)
foley.push({ from: 0, dur: F(64), src: "sfx/olcast_amb_m1.m4a", vol: 2.2 });
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/olcast/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_OLCAST = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "olcast.m4a";
export const MUSIC = "sfx/olcast_bed.m4a";
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
fs.writeFileSync(R + "_v3/olcast_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/olcast", { recursive: true });
fs.writeFileSync(R + "src/olcast/timeline_olcast.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm
const refs = new Set(["olcast.m4a", "sfx/olcast_bed.m4a", "ref_olcast.png", "qr_ole_olcast.png", "img/ole/portada.png", "img/olcast/addon_p3.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_olcast_assets.txt", [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos (asset aún no existe):", fb.length, fb.map((c) => c.fallback).join(" "));
const shortClip = cues.filter((c) => (c.k === "img" && c.clip && c.clipF < c.dur - 1 && c.real) || (c.k === "kf" && c.clipF < c.dur - 1)); if (shortClip.length) console.log("⚠️ clip más corto que su plano:", shortClip.map((c) => `${c.clip || c.src}(${c.clipF}<${c.dur})`).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 10).join(" · "));
