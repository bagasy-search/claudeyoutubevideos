// _v3/olstove_shots.json → src/olstove/timeline_olstove.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco, "@frase" en props (segundos desde el inicio de la toma, ms real del anclaje),
// sonido (sfx/foley) y compuertas del build. node vlog/olstove/gen_timeline.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olstove/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/olstove_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olstove_wordms.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/olstove_avwin.json", "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const flat = W.map((w) => norm(w.w).join(""));
const findFrom = (ph, i0) => { const q = norm(ph); for (let i = i0; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; };
// arranque del tramo de audio de cada clip hablado (el que se le dio a agnes: vlog/olstove/tramos.py)
const CLIP0 = { m1: 0.0, m2: 4.0, m3: 13.3, m4: 28.1, m5: 39.8, m6: 43.6, m7: 49.9, m8: 97.2, m9: 515.1, m10: 926.3 };
// foley de respaldo para los detalles sin clip (sfx reales de la biblioteca)
const KF_SFX = { d_stack: "soft_organic_wooden__#4-1780923840971.mp3", d_damper: "soft_mechanical_odom_#3-1780923982906.mp3", d_alarm: "juniorsoundays-ui-sound-14-527823.mp3", d_aircontrol: "soft_mechanical_odom_#3-1780923982906.mp3", d_sweepash: "px_wipe.mp3", d_openair: "soft_padded_stop_thu_#1-1780923893866.mp3", d_rake: "px_wipe_alt1.mp3", d_towel: "px_wipe_alt2.mp3", d_dumplings: "px_bubble.mp3", d_batteries: "floraphonic-casual-click-pop-ui-2-262119.mp3", d_doorair: "soft_mechanical_odom_#3-1780923982906.mp3", b_ashpail: "cold_winter_wind,_lo_#1-1780924461333.mp3", b_boilwater: "px_bubble_alt1.mp3", b_storm: "cold_winter_wind,_lo_#1-1780924461333.mp3", b_smokeback: "px_spray_alt1.mp3", b_hatchet: "soft_organic_wooden__#4-1780923840971.mp3", b_thread: "smooth_airy_whoosh_m_#2-1780923688387.mp3", b_creosote: "px_wipe_alt2.mp3", b_woodshed_door: "cold_winter_wind,_lo_#1-1780924461333.mp3", b_weather: "px_wipe.mp3", b_towelrail: "px_wipe_alt1.mp3", b_pinekindling: "soft_organic_wooden__#4-1780923840971.mp3", b_dumped: "soft_organic_wooden__#4-1780923840971.mp3", b_blackglass: "amb_fuego.mp3", b_pipehot: "amb_fuego.mp3", b_twist: "sfx_paper_tick.mp3", b_label: "sfx_paper_tick.mp3" };
const AV = "avatar_clips/olstove/reel30.mp4", AV_READY = ex(AV);
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [];
const warn = [];
let lastBed = null;
// resuelve "@frase" (recursivo) → segundos desde el inicio de la toma
const resolve = (o, s) => {
  if (typeof o === "string" && o.startsWith("~")) { const i = findFrom(o.slice(1), 0); if (i < 0) { warn.push(`~ no encontrado "${o}" en ${s.name}`); return 0; } return +(s.start - W[i].s).toFixed(2); }
  if (typeof o === "string" && o.startsWith("^")) { const [a, b] = o.slice(1).split("|"); const i = findFrom(a, 0), j = findFrom(b, 0); if (i < 0 || j < 0) { warn.push(`^ no encontrado "${o}"`); return 0; } return +(W[i].s - W[j].s).toFixed(2); }
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
    const p = `vid/olstove/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else { const w = avAt(s.start); if (!w) warn.push(`vl ${s.name} sin ventana de avatar @${s.start}`); c.k = "av"; c.src = AV_READY ? AV : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/olstove/${s.name}.mp4`;
    if (ex(p)) { c.clipF = Math.floor(probeDur(p) * FPS) - 1; c.src = p; c.sf = Math.max(0, Math.min(F(s.sf || 0), c.clipF - c.dur)); c.clipF -= c.sf; if (ex(`vid/olstove/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/olstove/${s.name}_foley.m4a`, sf: c.sf }); }
    else { // respaldo: el ancla "a" del detalle (foto gpt de manos) con Ken-Burns + foley de sfx
      c.k = "img"; c.img = ex(`img/olstove/kf/${s.name}.jpg`) ? `img/olstove/kf/${s.name}.jpg` : null; c.fallback = s.name;
      if (KF_SFX[s.name]) foley.push({ from: f0, dur: c.dur, src: "sfx/" + KF_SFX[s.name], vol: 0.5 });
    }
  } else if (s.kind === "st") {
    const p = `broll/olstove_st30/${s.name}.mp4`;
    c.k = "img"; c.real = 1; c.clip = ex(p) ? p : null; c.clipF = c.clip ? Math.floor(probeDur(p) * FPS) - 1 : 0; c.img = null;
    if (!c.clip) warn.push(`falta stock ${s.name}`); else lastBed = p;
  } else if (s.kind === "ar") {
    c.k = "arch"; c.real = 1; c.img = ex(`img/olstove/ar/${s.name}.jpg`) ? `img/olstove/ar/${s.name}.jpg` : null; if (!c.img) warn.push(`falta archivo ${s.name}`);
  } else if (s.kind === "bi" || s.kind === "ole") {
    const img = ex(`img/olstove/${s.name}.png`) ? `img/olstove/${s.name}.png` : ex(`img/olstove/${s.name}.jpg`) ? `img/olstove/${s.name}.jpg` : null;
    const clip = `broll/olstove/${s.name}.mp4`;
    c.k = "img"; c.img = img; if (!img) warn.push(`falta imagen ${s.name}`); else lastBed = img;
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; if (KF_SFX[s.name]) foley.push({ from: f0, dur: Math.min(c.dur, c.clipF), src: "sfx/" + KF_SFX[s.name], vol: 0.5 }); }
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = resolve(s.props || {}, s);
  }
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: resolve(s.ov.props || {}, s) });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1; foley de fogón/hervor bajo los 3D y el pozo; papel/lápiz en tarjetas
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS, d = c.dur / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  if (c.k === "comp" && ["StvStove3D", "StvFireStack3D"].includes(c.name)) S(t, "Crackling_campfire_w_#1-1780924416643.mp3", 0.3, c.dur);
  if (c.k === "comp" && ["StvCabinHeat3D"].includes(c.name)) S(t, "warm_rising_tonal_sw_#3-1780924218410.mp3", 0.22, Math.min(c.dur, 90));
  if (c.k === "comp" && ["StvMoistureMeter", "StvDamperDial"].includes(c.name)) S(t + 0.2, "soft_mechanical_odom_#3-1780923982906.mp3", 0.25, Math.min(c.dur, 60));
  if (c.k === "comp" && ["StvCreosoteWarning", "StvCordStack", "StvChimneyDraft", "StvSeasonCalendar"].includes(c.name)) S(t + 0.2, "yc_pencil.mp3", 0.22, Math.min(c.dur, 90));
  if (c.k === "comp" && ["OleBookPage", "OleRecapCard"].includes(c.name)) S(t + 0.1, "yc_page_flip.mp3", 0.3, 40);
  if (c.k === "comp" && c.name === "OleCTA") S(t, "warm_rising_tonal_sw_#3-1780924218410.mp3", 0.25, 60);
  if (c.k === "arch") S(t + 0.1, "gentle_papercard_pop_#2-1780923860389.mp3", 0.22, 30);
  if (c.real && c.k === "img" && /fire|ember|coal|stove/.test(JSON.stringify(shots[i].name))) {} // stock mudo
});
for (const o of ovs) {
  const t = o.from / FPS;
  if (o.name === "OleStamp") S(t + (typeof o.props.at === "number" ? o.props.at : 0.5), "yc_stamp.mp3", 0.3, 30);
  else if (o.name === "OleRuleCard") S(t + 0.15, "yc_paper_tear.mp3", 0.18, 30);
  else S(t + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.22, 20);
}
// fuego/brasas REAL de stock: ambiente de fogón bajo esos planos (el stock viene mudo)
cues.forEach((c, i) => { const n = shots[i].name; if (/^st_(fire|embers|stove|kindling)_/.test(n)) foley.push({ from: c.from, dur: c.dur, src: "sfx/amb_fuego.mp3", vol: 0.35 }); });
// ambiente continuo de estufa bajo el minuto 1 (compuerta: 0 silencios en el minuto 1; las pausas naturales de la voz quedaban mudas)
foley.push({ from: 0, dur: F(64), src: "sfx/olstove_amb_m1.m4a", vol: 0.85 });
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/olstove/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_OLSTOVE = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "olstove.m4a";
export const MUSIC = "sfx/olstove_bed.m4a";
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
fs.writeFileSync(R + "_v3/olstove_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/olstove", { recursive: true });
fs.writeFileSync(R + "src/olstove/timeline_olstove.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm
const refs = new Set(["olstove.m4a", "sfx/olstove_bed.m4a", "ref_olstove.png", "qr_ole_olstove.png", "img/ole/portada.png", "img/olstove/pagina_36.png", "img/olstove/pagina_30.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_olstove_assets.txt", [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos (asset aún no existe):", fb.length, fb.map((c) => c.fallback).join(" "));
const shortClip = cues.filter((c) => (c.k === "img" && c.clip && c.clipF < c.dur - 1 && c.real) || (c.k === "kf" && c.clipF < c.dur - 1)); if (shortClip.length) console.log("⚠️ clip más corto que su plano:", shortClip.map((c) => `${c.clip || c.src}(${c.clipF}<${c.dur})`).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 10).join(" · "));
