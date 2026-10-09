// _v3/ollarder2_shots.json → src/ollarder2/timeline_ollarder2.gen.ts (cues en CUADROS exactos, fronteras pegadas),
// resolviendo assets reales en disco, "@frase" en props (segundos desde el inicio de la toma, ms real del anclaje),
// sonido (sfx/foley) y compuertas del build. node vlog/ollarder2/gen_timeline.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/ollarder2/", PUB = R + "public/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const { END, shots, vl } = JSON.parse(fs.readFileSync(R + "_v3/ollarder2_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/ollarder2_wordms.json", "utf8"));
const avwin = JSON.parse(fs.readFileSync(R + "_v3/ollarder2_avwin.json", "utf8")).win;
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const flat = W.map((w) => norm(w.w).join(""));
const findFrom = (ph, i0) => { const q = norm(ph); for (let i = i0; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) return i; return -1; };
// arranque del tramo de audio de cada clip hablado (el que se le dio a agnes: vlog/ollarder2/tramos.py)
const CLIP0 = JSON.parse(fs.readFileSync(R + "_v3/ollarder2_clip0.json", "utf8"));
// foley de respaldo para los detalles sin clip (sfx reales de la biblioteca)
const KF_SFX = {};
const AV = "avatar_clips/ollarder2/reel30.mp4", AV_READY = ex(AV);
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
    const p = `vid/ollarder2/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); }
    else { const w = avAt(s.start); if (!w) warn.push(`vl ${s.name} sin ventana de avatar @${s.start}`); c.k = "av"; c.src = AV_READY ? AV : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; c.fallback = s.name; }
  } else if (s.kind === "kf") {
    const p = `vid/ollarder2/${s.name}.mp4`;
    if (ex(p)) { c.clipF = Math.floor(probeDur(p) * FPS) - 1; c.src = p; c.sf = Math.max(0, Math.min(F(s.sf || 0), c.clipF - c.dur)); c.clipF -= c.sf; if (ex(`vid/ollarder2/${s.name}_foley.m4a`)) foley.push({ from: f0, dur: c.dur, src: `vid/ollarder2/${s.name}_foley.m4a`, sf: c.sf }); }
    else { // respaldo: el ancla "a" del detalle (foto gpt de manos) con Ken-Burns + foley de sfx
      c.k = "img"; c.img = ex(`img/ollarder2/kf/${s.name}.jpg`) ? `img/ollarder2/kf/${s.name}.jpg` : null; c.fallback = s.name;
      if (KF_SFX[s.name]) foley.push({ from: f0, dur: c.dur, src: "sfx/" + KF_SFX[s.name], vol: 0.5 });
    }
  } else if (s.kind === "st") {
    const p = `broll/ollarder2_st30/${s.name}.mp4`;
    c.k = "img"; c.real = 1; c.clip = ex(p) ? p : null; c.clipF = c.clip ? Math.floor(probeDur(p) * FPS) - 1 : 0; c.img = null;
    if (!c.clip) warn.push(`falta stock ${s.name}`); else lastBed = p;
  } else if (s.kind === "ar") {
    c.k = "arch"; c.real = 1; c.img = ex(`img/ollarder2/ar/${s.name}.jpg`) ? `img/ollarder2/ar/${s.name}.jpg` : null; if (!c.img) warn.push(`falta archivo ${s.name}`);
  } else if (s.kind === "bi" || s.kind === "ole") {
    const img = ex(`img/ollarder2/${s.name}.jpg`) ? `img/ollarder2/${s.name}.jpg` : ex(`img/ollarder2/${s.name}.png`) ? `img/ollarder2/${s.name}.png` : null;
    const clip = `broll/ollarder2/${s.name}.mp4`;
    c.k = "img"; c.img = img; if (!img) warn.push(`falta imagen ${s.name}`); else lastBed = img;
    if (ex(clip)) { c.clip = clip; c.clipF = Math.floor(probeDur(clip) * FPS) - 1; }
  } else if (s.kind === "c") {
    c.k = "comp"; c.name = s.name; c.props = resolve(s.props || {}, s);
  }
  if (c.k === "comp" && ["OleMythTrick", "OleHeatCurve", "OleSaltAcidTimeline", "OleRecapCard", "OleBeanSwell"].includes(c.name) && !c.props.bed && lastBed && !/\.mp4$/.test(lastBed)) c.props = { ...c.props, bed: lastBed };
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: resolve(s.ov.props || {}, s) });
  cues.push(c);
});
// ── SONIDO (sin música, sin whoosh en los cortes): foley del mundo según lo que se VE + ambiente continuo por lugar
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
const CSFX = { WinChalkMenu: ["chalk.mp3", 0.8], WinRecipeCard: ["crinkle.mp3", 0.7], CanJarTag: ["crinkle.mp3", 0.7], LarDoorTag: ["knock.mp3", 0.6], WinReceipt: ["crumple.mp3", 0.8], CanLedger: ["pencil.mp3", 0.8], OleBookPage: ["papers.mp3", 0.7], OleCTA: ["papers.mp3", 0.6], OleTrick: ["crinkle.mp3", 0.6], OleFact: ["scribble.mp3", 0.7], OleMythTrick: ["papers.mp3", 0.7], LarThermo: ["knock.mp3", 0.6], LarZones: ["crinkle.mp3", 0.7], CanBagVsCan: ["glassmetal.mp3", 0.7] };
const FOL = [[/fry|sizzl|bacon fat|skillet of|lard|patties|frying/, "fryegg.mp3", 0.75], [/boil|simmer|bubbl|soup pot|broth|steam/, "boil.mp3", 0.7], [/chop|slic|cutting board|knife/, "cutveg.mp3", 0.7], [/pour|ladl|kettle/, "pour.mp3", 0.7], [/lid /, "potlid.mp3", 0.6], [/door/, "doorcreak.mp3", 0.5]];
const AMB = (txt) => /outside|snowy road|logging road|in the snow|snowy woods|garden|hillside|porch|truck|sled/.test(txt) ? ["wind.mp3", 0.55] : /cellar/.test(txt) ? ["firewind.mp3", 0.35] : ["fire.mp3", 0.5];
const AV_AMB = { olwinter2: ["fire.mp3", 0.45], olcanned: ["fire.mp3", 0.45], ollarder2: ["firewind.mp3", 0.35] }["ollarder2"];
cues.forEach((c, i) => {
  const t = c.from / FPS, sh = shots[i], txt = String(sh.prompt || sh.q || "").toLowerCase();
  if (c.k === "comp" && CSFX[c.name]) S(t + 0.15, CSFX[c.name][0], CSFX[c.name][1], Math.min(c.dur, 120));
  if (c.k === "comp" && c.name === "OleDutchOven3D") foley.push({ from: c.from, dur: c.dur, src: "sfx/boil.mp3", vol: 0.7, loop: 1 });
  if (c.k === "comp" && c.name === "LarCellar3D") foley.push({ from: c.from, dur: c.dur, src: "sfx/wind.mp3", vol: 0.5, loop: 1 });
  if (c.k === "img" || c.k === "vl" || c.k === "kf") { const m = FOL.find(([rx]) => rx.test(txt)); if (m) foley.push({ from: c.from, dur: c.dur, src: "sfx/" + m[1], vol: m[2], loop: 1 }); }
  if (c.k === "arch") S(t + 0.1, "papers.mp3", 0.4, 25);
  // ambiente continuo del lugar (bajo la voz): estufa en la cabaña, viento afuera, casi nada en el sótano
  const [amb, av] = c.k === "av" ? AV_AMB : c.k === "comp" ? ["fire.mp3", 0.35] : AMB(txt);
  foley.push({ from: c.from, dur: c.dur, src: "sfx/" + amb, vol: av, loop: 1, amb: 1 });
});
for (const o of ovs) { const t = o.from / FPS; if (o.name === "OleStamp") S(t + (typeof o.props.at === "number" ? o.props.at : 0.5), "knock.mp3", 0.7, 30); else if (o.name === "OleRuleCard") S(t + 0.15, "crinkle.mp3", 0.5, 30); }
// ambiente: fusionar tomas contiguas del mismo lugar en UN tramo continuo (sin bajones en cada corte)
{ const amb = foley.filter((x) => x.amb).sort((a, b) => a.from - b.from), rest = foley.filter((x) => !x.amb); const m = [];
  for (const x of amb) { const L = m[m.length - 1]; if (L && L.src === x.src && L.vol === x.vol && Math.abs(L.from + L.dur - x.from) <= 1) L.dur = x.from + x.dur - L.from; else m.push({ ...x }); }
  foley.length = 0; foley.push(...rest, ...m); }
// ── compuertas del build
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const out = `// GENERADO por vlog/ollarder2/gen_timeline.mjs — no editar a mano
export const TOTAL_FRAMES_OLLARDER2 = ${TOTAL};
export const AV_READY = ${AV_READY};
export const AUDIO = "ollarder2.m4a";
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
fs.writeFileSync(R + "_v3/ollarder2_cues.json", JSON.stringify(qc, null, 1));
fs.mkdirSync(R + "src/ollarder2", { recursive: true });
fs.writeFileSync(R + "src/ollarder2/timeline_ollarder2.gen.ts", out);
// lista EXPLÍCITA de assets para el tar del farm
const refs = new Set(["ollarder2.m4a", "ref_ollarder2.png", "qr_ollarder2.png", "qr_ollarder2_book.png", ...fs.readdirSync(PUB + "img/ollarder2/book").map((f) => "img/ollarder2/book/" + f), ...fs.readdirSync(PUB + "img/ollarder2").filter((f) => /^bed_.*\.jpg$/.test(f)).map((f) => "img/ollarder2/" + f)]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + "_ollarder2_assets.txt", [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
const fb = cues.filter((c) => c.fallback); if (fb.length) console.log("⚠️ repuestos (asset aún no existe):", fb.length, fb.map((c) => c.fallback).join(" "));
const shortClip = cues.filter((c) => (c.k === "img" && c.clip && c.clipF < c.dur - 1 && c.real) || (c.k === "kf" && c.clipF < c.dur - 1)); if (shortClip.length) console.log("⚠️ clip más corto que su plano:", shortClip.map((c) => `${c.clip || c.src}(${c.clipF}<${c.dur})`).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 10).join(" · "));
