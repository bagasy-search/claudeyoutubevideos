// _v3/olsup_shots.json → src/olsup/timeline_olsup.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco (stock real, archivo, clips agnes, imágenes) + sonido + compuertas del build.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olsup/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/olsup_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olsup_wordms.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/olsup_avwin.json", "utf8")).win;
const ARCH = JSON.parse(fs.readFileSync(R + "vlog/olsup/arch_map.json", "utf8"));
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const AV_SRC = "avatar_clips/olsup/reel30.mp4";
const AV_READY = ex(AV_SRC);
// arranque del audio de cada clip hablado (el tramo que se le dio a agnes)
const CLIP0 = {}; for (const [k, v] of Object.entries(vl)) CLIP0[k] = Math.max(0, v.s - 0.03);
// anclas de los detalles (keyframe) por si el clip 2.5 no llega: la ancla final con Ken-Burns
const KF_FALLBACK = { d_beans: "anc_D1b", d_cakes: "anc_D2b", d_stove: "anc_D3b", d_coffee: "anc_D4b" };
// foley de lo que se ve (real, de public/sfx) — por palabras del nombre de la toma, bajo la voz
const FOL_RULES = [[/fry|skillet|brown|bacon|donut|hash|sausage|fried|sizzle|crisp|griddle|pancake|liver/, "sfx/lor_sizzle.mp3", 0.16], [/simmer|stew|soup|boil|chowder|broth|kettle|steam|pot_|_pot|beans|barley|rice_milk|starter/, "sfx/px_bubble.mp3", 0.14], [/pour|coffee|molasses|milk|gravy|syrup|batter|splash/, "sfx/px_gluglu.mp3", 0.16], [/fire|embers|coals|stove|night_fire|castiron_coals/, "sfx/Crackling_campfire_w_#1-1780924416643.mp3", 0.2], [/axe|wood|firewood|chop/, "sfx/lor_wood.mp3", 0.2], [/forest|snow|frozen|winter|sleigh|horse|door/, "sfx/cold_winter_wind,_lo_#1-1780924461333.mp3", 0.16]];
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [];
const warn = [], miss = [];
let lastImg = null;
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0, name: s.name };
  const avShot = () => { const w = avwin.find((w) => s.start >= w.s - 0.06 && s.start < w.e + 0.06); if (!w) warn.push(`av sin ventana @${s.start} ${s.name}`); c.k = "av"; c.src = AV_READY ? AV_SRC : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; };
  if (s.kind === "av") avShot();
  else if (s.kind === "vl") {
    const p = `vid/olsup/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); } else { avShot(); c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/olsup/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = 0; if (ex(`vid/olsup/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/olsup/${s.name}_foley.m4a` }); }
    else { const a = KF_FALLBACK[s.name]; c.k = "img"; c.img = a && ex(`img/olsup/${a}.jpg`) ? `img/olsup/${a}.jpg` : null; c.fallback = s.name; if (!c.img) miss.push("kf " + s.name); }
  } else if (s.kind === "bi" || s.kind === "ole" || s.kind === "swap") {
    const img = `img/olsup/${s.name}.jpg`, clip = `broll/olsup/${s.name}.mp4`;
    c.k = "img"; c.img = ex(img) ? img : null; if (!c.img) miss.push("img " + s.name);
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
  } else if (s.kind === "st") {
    const st = `broll/olsup_st30/${s.name}.mp4`;
    if (ex(st)) { c.k = "st"; c.src = st; c.real = 1; c.clipF = Math.floor(probeDur(st) * FPS) - 1; } else { miss.push("st " + s.name); c.k = "img"; c.img = null; }
  } else if (s.kind === "ar") {
    const a = ARCH[s.arch]; c.k = "ar"; if (!a) miss.push("arch " + s.arch); else { c.real = 1; c.props = { src: a.file, caption: a.cap, credit: a.credit, seed: (f0 % 97) + 1 }; }
  } else if (s.kind === "c") {
    c.k = "comp"; c.cname = s.name; c.props = { ...(s.props || {}) };
    if (s.bed) c.props.bed = s.bed;
    if (!c.props.bed && lastImg && ["OleTrick", "OleFact", "OleSupperCard", "OleTwoCards", "OleDayClock", "OleCalorieMeter"].includes(s.name)) c.props.bed = lastImg;
  }
  if ((c.k === "img") && c.img) lastImg = c.img;
  if (c.k === "st" || c.k === "img") { // foley real bajo la voz según lo que se ve
    for (const [rx, f, vol] of FOL_RULES) if (rx.test(s.name) && ex(f)) { foley.push({ from: f0, dur: Math.min(c.dur, 150), src: f, vol }); break; }
  }
  if (s.ov) ovs.push({ from: f0, dur: s.ov.dur || c.dur, name: s.ov.c, props: s.ov.props });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1, impactos en componentes, pops en overlays
const S = (at, file, vol, dur = 45) => ex(file) ? sfx.push({ from: Math.max(0, F(at)), dur, src: file, vol }) : null;
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 62 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "sfx/whoosh.mp3" : "sfx/sfx_whoosh_soft.mp3", 0.22, 20);
  if (c.k === "comp" && ["OleFact", "OleTrick"].includes(c.cname)) S(t + 0.2, "sfx/text_slam.mp3", 0.26, 40);
  if (c.k === "comp" && c.cname === "OleCountdownCard") { S(t, "sfx/deep-cinematic-impact-1.mp3", 0.3, 60); }
  if (c.k === "comp" && c.cname === "OleBookPage") S(t + 0.2, "sfx/sfx_paper_tick.mp3", 0.3, 40);
  if (c.k === "comp" && ["OleCookhouse3D", "OleBeanhole3D"].includes(c.cname)) S(t, "sfx/section_swell.mp3", 0.2, 90);
  if (c.k === "ar") S(t + 0.1, "sfx/gentle_papercard_pop_#2-1780923860389.mp3", 0.25, 30);
  if (c.k === "comp" && c.cname === "OleCTA") S(t + 0.2, "sfx/sfx_chime.mp3", 0.22, 60);
});
for (const o of ovs) { if (o.name === "OleCountdown") S(o.from / FPS + 0.15, "sfx/number_slam.mp3", 0.22, 40); else S(o.from / FPS + 0.2, "sfx/floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.22, 20); }
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/olsup/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_OLSUP = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "olsup.m4a";
export const MUSIC = "sfx/olsup_bed.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`;
// cues de la capa base para agnes_qc (un clip = un plano)
const qc = []; const vlSpan = {};
for (const c of cues) {
  if ((c.k === "vl" || c.k === "kf") && c.src) { const v = (vlSpan[c.src] ||= { key: c.src, src: c.src, a: c.from, b: c.from + c.dur, sf: c.sf }); v.b = c.from + c.dur; }
  if (c.k === "img" && c.clip) qc.push({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF) / FPS });
}
for (const v of Object.values(vlSpan)) qc.push({ key: v.key, src: v.src, start: v.a / FPS, dur: (v.b - v.a) / FPS });
fs.writeFileSync(R + "_v3/olsup_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/olsup", { recursive: true });
fs.writeFileSync(R + "src/olsup/timeline_olsup.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm
const refs = new Set(["olsup.m4a", "sfx/olsup_bed.m4a", "ref_olsup.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o) || o === "qr_ole_suppers.png") refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) { if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg")); if (c.k === "st" && c.clipF < c.dur) refs.add(c.src.replace(/\.mp4$/, "_last.jpg")); }
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_olsup_assets.txt", [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 6).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
if (miss.length) console.log("⚠️ faltan assets de tomas:", miss.length, miss.slice(0, 40).join(" "));
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("↩ repuestos:", fb.map((c) => c.fallback).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 8).join(" · "));
