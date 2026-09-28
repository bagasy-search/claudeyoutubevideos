// _v3/lorpies_shots.json → src/lorpies/timeline_lorpies.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco (clip agnes > foto), sonido (sfx/foley/música) y compuertas del build.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/lorpies/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/lorpies_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/lorpies_wordms.json", "utf8"));
const P = JSON.parse(fs.readFileSync(R + "_v3/lorpies_paras.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/lorpies_avwin.json", "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
// arranque del audio de cada clip hablado (el tramo que se le dio a agnes)
const CLIP0 = { m1: 0, m2: 6.80, m4: 38.62, m5: 46.42 };
for (const [k, v] of Object.entries(vl)) if (!(k in CLIP0)) CLIP0[k] = v.s - 0.03;
const AV_READY = ex("avatar_clips/lorpies/reel30.mp4");
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [];
const warn = [];
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0 };
  if (s.kind === "av") {
    const w = avwin.find((w) => s.start >= w.s - 0.06 && s.end <= w.e + 0.06);
    if (!w) warn.push(`av sin ventana @${s.start}`);
    c.src = AV_READY ? "avatar_clips/lorpies/reel30.mp4" : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0;
  } else if (s.kind === "vl") {
    const p = `vid/lorpies/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else { // repuesto: el avatar cubre el tramo (el reel incluye las ventanas de los clips)
      const w = avwin.find((w) => s.start >= w.s - 0.06 && s.end <= w.e + 0.06);
      c.k = "av"; c.src = AV_READY ? "avatar_clips/lorpies/reel30.mp4" : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; c.fallback = s.name;
    }
  } else if (s.kind === "kf") {
    const p = `vid/lorpies/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = 0; if (ex(`vid/lorpies/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/lorpies/${s.name}_foley.m4a` }); }
    else { c.k = "img"; c.src = null; c.fallback = s.name; }
  } else if (s.kind === "bi" || s.kind === "lor") {
    const st = `broll/lorpies_st30/${s.name}.mp4`; // stock REAL (Pexels, 30/1 CFR, mirado en hoja) manda sobre el clip agnes
    const clip = ex(st) ? st : `broll/lorpies/${s.name}.mp4`, img = `img/lorpies/${s.name}.jpg`;
    if (ex(st)) c.real = 1;
    c.img = ex(img) ? img : null;
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
    c.k = "img"; if (!c.img) warn.push(`falta imagen ${s.name}`);
  } else if (s.kind === "ei") {
    c.k = "snap"; c.img = ex(`img/lorpies/${s.name}.jpg`) ? `img/lorpies/${s.name}.jpg` : null; if (!c.img) warn.push(`falta snapshot ${s.name}`);
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = s.props || {};
    if (s.name === "LorRecipeSheet") { // zoom al pie que se nombra en ese segundo
      const p = P[s.p], ws = W.slice(p.w0, p.w0 + p.nw);
      const at = (word) => { const x = ws.find((w) => w.w.toLowerCase().replace(/[^a-z]/g, "") === word); return x ? x.s - s.start : null; };
      const cells = [["chess", 0.16, 0.34], ["sugar", 0.39, 0.34], ["shoofly", 0.62, 0.34], ["butterscotch", 0.85, 0.34], ["lemon", 0.16, 0.74], ["sour", 0.39, 0.74], ["mock", 0.62, 0.74]];
      const keys = [[0, 0.5, 0.5, 1]];
      for (const [wd, x, y] of cells) { const t = at(wd); if (t != null) keys.push([+(t + 0.3).toFixed(2), x, y, 2.05]); }
      keys.push([+(s.dur - 1.2).toFixed(2), 0.5, 0.5, 1]);
      c.props = { keys };
    }
  }
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: s.ov.props });
  cues.push(c);
});
// ── SONIDO: whoosh en los cortes rápidos del minuto 1, impacto en revelaciones, riser antes del loop, pops en overlays
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.22, 20);
  if (c.k === "comp" && c.name === "LorPieCount") { S(t, "lor_whoosh_airy.mp3", 0.3, 40); S(t + 0.4, "lor_impact.mp3", 0.32, 60); }
  if (c.k === "comp" && ["LorYear", "LorTrick"].includes(c.name)) S(t + 0.2, "text_slam.mp3", 0.28, 40);
  if (c.k === "comp" && c.name === "LorCookbook3D") S(t + 0.2, "sfx_paper_tick.mp3", 0.3, 40);
  if (c.k === "comp" && ["LorPie3D", "LorPotluckTable", "LorEraTimeline"].includes(c.name)) S(t, "lor_swell.mp3", 0.22, 80);
  if (c.k === "snap") S(t + 0.15, "lor_paper_pop.mp3", 0.3, 30);
});
for (const o of ovs) S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.25, 20);
S(44.2, "cp_riser.wav", 0.18, 70); // riser antes del loop abierto del minuto 1
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/lorpies/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_LORPIES = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "lorpies.m4a";
export const MUSIC = "sfx/lorpies_bed.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`;
// cues de la capa base para la compuerta de repetición de agnes_qc (un clip = un plano; los vl partidos por un
// inserto son UNA toma continua: se emite su tramo entero, que nunca repite cuadros)
const qc = [];
const vlSpan = {};
for (const c of cues) {
  if ((c.k === "vl" || c.k === "kf") && c.src) { const v = (vlSpan[c.src] ||= { key: c.src, src: c.src, a: c.from, b: c.from + c.dur, sf: c.sf }); v.b = c.from + c.dur; }
  if (c.k === "img" && c.clip) qc.push({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF) / FPS });
}
for (const v of Object.values(vlSpan)) qc.push({ key: v.key, src: v.src, start: v.a / FPS, dur: (v.b - v.a) / FPS });
fs.writeFileSync(R + "_v3/lorpies_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/lorpies", { recursive: true });
fs.writeFileSync(R + "src/lorpies/timeline_lorpies.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm: toda ruta citada en cues/props (recursivo) + derivadas (_last.jpg)
const refs = new Set(["lorpies.m4a", "sfx/lorpies_bed.m4a", "ref_lorpies.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_lorpies_assets.txt", [...refs].filter((r) => ex(r)).join(String.fromCharCode(10)) + String.fromCharCode(10));
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 6).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos (asset aún no existe):", fb.length, fb.slice(0, 12).map((c) => c.fallback).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 8).join(" · "));
