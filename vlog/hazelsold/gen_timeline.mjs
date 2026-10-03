// _v3/hazelsold_shots.json → src/hazelsold/timeline_hazelsold.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco (clip agnes > foto), camas de los componentes, sonido y compuertas del build.
//   node vlog/hazelsold/gen_timeline.mjs [--final]   (--final: falla si queda algún placeholder)
import fs from "node:fs";
const TRAMOS0 = JSON.parse(fs.readFileSync("D:/Proyectos/video2-wt/hazelsold/vlog/hazelsold/M1/clip0.json", "utf8"));
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/hazelsold/", PUB = R + "public/";
const FINAL = process.argv.includes("--final");
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots } = JSON.parse(fs.readFileSync(R + "_v3/hazelsold_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/hazelsold_wordms.json", "utf8"));
const avj = R + "_v3/hazelsold_avwin.json";
const avwin = JSON.parse(fs.readFileSync(avj, "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const nFrames = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-count_packets", "-select_streams", "v", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim().replace(/,$/, ""); } catch { return 0; } };
const CLIP0 = TRAMOS0;
const AVSRC = "avatar_clips/hazelsold/reel30.mp4";
const AV_READY = ex(AVSRC);
const img = (n) => (ex(`img/hazelsold/${n}.jpg`) ? `img/hazelsold/${n}.jpg` : null);
// cama/imagen de un componente: st_* = video de stock real · b_/h_/kf_ = foto
const media = (n) => { if (!n) return undefined; if (/^st_/.test(n)) return ex(`broll/hazelsold_st/${n}.mp4`) ? `broll/hazelsold_st/${n}.mp4` : undefined; return img(n) || undefined; };
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [], warn = [];
const avAt = (t0) => avwin.find((w) => t0 >= w.s - 0.06 && t0 < w.e + 0.06);
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0, name: s.name };
  const asAvatar = () => { const w = avAt(s.start); if (!w) warn.push(`sin ventana de avatar @${s.start}`); c.k = "av"; c.src = AV_READY ? AVSRC : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; };
  if (s.kind === "av") asAvatar();
  else if (s.kind === "vl") {
    const p = `vid/hazelsold/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else if (img(s.name + "_still")) { c.k = "img"; c.img = img(s.name + "_still"); c.fallback = s.name + "(still)"; }
    else { asAvatar(); c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/hazelsold/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = 0; if (ex(`vid/hazelsold/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/hazelsold/${s.name}_foley.m4a` }); }
    else { c.k = "img"; c.img = img(s.name.replace(/^d_/, "kf_")); c.fallback = s.name; }
  } else if (s.kind === "bi" || s.kind === "hz") {
    c.k = "img"; c.img = img(s.name);
    const clip = `broll/hazelsold/${s.name}.mp4`;
    if (s.kind === "bi" && ex(clip)) { c.clip = clip; c.clipF = nFrames(clip) - 1; }
    if (!c.img) warn.push(`falta imagen ${s.name}`);
    if (c.clip && c.dur > c.clipF + 75) warn.push(`${s.name}: el plano (${(c.dur / 30).toFixed(1)}s) pasa el clip + 2,5 s`);
  } else if (s.kind === "st") {
    const p = `broll/hazelsold_st/${s.name}.mp4`;
    c.k = "clip"; c.src = ex(p) ? p : null; c.real = 1; if (!c.src) warn.push(`falta stock ${s.name}`);
    if (c.src) { const n = nFrames(p); if (c.dur > n) { if (c.dur - n > 75) warn.push(`stock ${s.name} corto: ${(n / 30).toFixed(1)}s < plano ${(c.dur / 30).toFixed(1)}s`); c.k = "img"; c.clip = p; c.clipF = n - 1; c.img = null; delete c.src; } }
  } else if (s.kind === "c") {
    c.k = "comp"; c.props = { ...(s.props || {}) };
    if (c.props.bed) { const b = c.props.bed; c.props.bed = media(b); if (!c.props.bed) warn.push(`cama ${b} no existe (${s.name})`); if (/^st_/.test(b)) { c.real = 1; const n = nFrames(c.props.bed || ""); if (n && c.dur > n / 0.4) warn.push(`cama stock ${b} corta para ${s.name}`); } }
    if (c.props.img) { const b = c.props.img; c.props.img = media(b); if (!c.props.img) warn.push(`img ${b} no existe (${s.name})`); }
  }
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: s.ov.props });
  cues.push(c);
});
// ── SONIDO: whoosh en cortes del minuto 1, sello en lotes/sellos, impacto en cada revelación de precio, riser antes del loop
const S = (at, file, vol, dur = 45) => { if (ex("sfx/" + file)) sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol }); else warn.push("sfx falta " + file); };
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 62 && i > 0 && c.k !== "av" && c.k !== "vl") S(t - 0.1, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  if (c.k !== "comp") return;
  if (c.name === "HzLotCard") { S(t, "yc_whoosh_warm.mp3", 0.25, 30); S(t + 14 / 30, "yc_stamp.mp3", 0.45, 30); }
  if (c.name === "HzPriceTag") { S(t, "gentle_papercard_pop_#2-1780923860389.mp3", 0.35, 30); S(t + 36 / 30, "deep-cinematic-impact-1.mp3", 0.3, 60); S(t + 50 / 30, "yc_stamp.mp3", 0.35, 30); }
  if (c.name === "HzSoldListings") S(t + 0.4, "yc_typewriter.mp3", 0.18, Math.min(c.dur, 150));
  if (c.name === "HzWhereToSell") { S(t + 0.6, "line_draw.mp3", 0.25, 40); }
  if (c.name === "HzWorthNothing") S(t + 1.0, "yc_stamp.mp3", 0.5, 30);
  if (c.name === "HzLotVsPiece") { S(t + 0.7, "gentle_papercard_pop_#2-1780923860389.mp3", 0.3, 30); }
  if (c.name === "HzMagnetTest") { S(t + 1.1, "tiny_soft_tickclick__#3-1780923823227.mp3", 0.4, 20); S(t + 1.75, "yc_stamp.mp3", 0.4, 30); }
  if (c.name === "HzHallmark3D" || c.name === "HzRing3D") S(t, "smooth_airy_whoosh_m_#2-1780923688387.mp3", 0.28, 50);
  if (c.name === "HzDealerClock") S(t, "fast_vintage_mechani_#2-1780924051971.mp3", 0.22, Math.min(c.dur, 90));
  if (c.name === "HzRuleCard") S(t + 0.2, "yc_typewriter.mp3", 0.16, Math.min(c.dur, 120));
  if (c.name === "HzRecap") S(t, "yc_paper_tear.mp3", 0.15, 30);
  if (c.name === "HzPyrex3D") S(t, "smooth_airy_whoosh_m_#2-1780923688387.mp3", 0.25, 50);
  if (c.name === "HzBowl3D") { S(t, "smooth_airy_whoosh_m_#2-1780923688387.mp3", 0.28, 50); S(t + 1.4, "tiny_soft_tickclick__#3-1780923823227.mp3", 0.3, 20); }
  if (c.name === "HzRingWave") S(t + 0.5, "gentle_papercard_pop_#2-1780923860389.mp3", 0.3, 30);
  if (c.name === "HzEdgeCompare" || c.name === "HzEraStrip") S(t + 0.3, "line_draw.mp3", 0.25, 50);
});
for (const o of ovs) S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.25, 20);
S(50.5 - 2.2, "cp_riser.wav", 0.16, 70);
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
if (cues[0].k !== "vl" && cues[0].k !== "av") { console.error("⛔ el video no abre con Hazel hablando"); process.exit(1); }
const used = new Map(); for (const c of cues) for (const p of [c.k === "clip" ? c.src : null, c.clip, c.k === "comp" && /\.mp4$/.test(c.props?.bed || "") ? c.props.bed : null].filter(Boolean)) used.set(p, (used.get(p) || 0) + 1);
const dup = [...used].filter(([, n]) => n > 1); if (dup.length) { console.error("⛔ clip usado 2 veces:", dup.map(([p]) => p).join(" ")); process.exit(1); }
const out = `// GENERADO por vlog/hazelsold/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_HAZELSOLD = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "hazelsold.m4a";
export const MUSIC = "sfx/hazelsold_bed.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`;
// cues para la compuerta de repetición de agnes_qc (los vl partidos son UNA toma continua)
const qc = [], vlSpan = {};
for (const c of cues) {
  if ((c.k === "vl" || c.k === "kf") && c.src) { const v = (vlSpan[c.src] ||= { key: c.src, src: c.src, a: c.from, b: c.from + c.dur }); v.b = c.from + c.dur; }
  if (c.k === "img" && c.clip) qc.push({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF) / FPS });
}
for (const v of Object.values(vlSpan)) qc.push({ key: v.key, src: v.src, start: v.a / FPS, dur: (v.b - v.a) / FPS });
fs.writeFileSync(R + "_v3/hazelsold_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/hazelsold", { recursive: true });
fs.writeFileSync(R + "src/hazelsold/timeline_hazelsold.gen.ts", out);
// lista EXPLÍCITA de assets del tar: toda ruta citada (recursivo) + derivadas (_last.jpg)
const refs = new Set(["hazelsold.m4a", "sfx/hazelsold_bed.m4a", "ref_hazelsold.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_hazelsold_assets.txt", [...refs].filter((r) => ex(r)).join(String.fromCharCode(10)) + String.fromCharCode(10));
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
const ph = cues.filter((c) => (c.k === "av" && !c.src) || (c.k === "img" && !c.img && !c.clip) || (c.k === "clip" && !c.src));
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder", "· placeholders", ph.length);
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos:", fb.length, fb.map((c) => c.fallback).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 12).join(" · "));
if (FINAL && (ph.length || faltan.length)) { console.error("⛔ --final con placeholders/assets faltantes"); process.exit(1); }
