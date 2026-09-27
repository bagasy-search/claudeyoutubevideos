// tfbinodoro — línea de tiempo final: mp4 por escena (agnes_vlog armar) + tráiler (planos keyframe T con foley) + ficha +
// QR + capa Tfb anclada a la PALABRA (captions ASR). Escribe src/tfbinodoro/timeline_tfbinodoro.gen.ts,
// vlog/tfbinodoro/timeline.json (base + fx + eventos de audio para mix.py) y _tfbinodoro_assets.txt.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
const R = "D:/Proyectos/video2-wt/tfbinodoro/", V = R + "vlog/tfbinodoro/", O = R + "out/vlog/", FPS = 30, PV = R + "public/vid/tfbinodoro/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const nfr = f => Number((execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).toString().match(/\d+/) || [0])[0]);
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
fs.mkdirSync(PV, { recursive: true });
const tr = J(V + "tramos.json");
const voz = TXT.flatMap(s => s.lines.filter(l => l[1] !== "w").map(l => l[0]));
const TR = Object.fromEntries(voz.map((id, i) => [id, tr[i]]));
const caps = J(R + "public/captions_tfbinodoro.json");
const norm = w => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9]/g, "");

// ---- escenas armadas
const SCN = {};
const sceneInfo = S => {
  if (SCN[S]) return SCN[S];
  const plan = J(V + `plan_${S}.json`), d = plan.dir.replace(/\/?$/, "/");
  const mp4 = d + `vlog_${S}.mp4`, tl = J(d + `timeline_vlog_${S}.json`), aud = d + `audio_vlog_${S}.wav`;
  const src = `vid/tfbinodoro/${S}.mp4`;
  if (!fs.existsSync(R + "public/" + src) || fs.statSync(R + "public/" + src).mtimeMs < fs.statSync(mp4).mtimeMs) fs.copyFileSync(mp4, R + "public/" + src);
  const nf = nfr(R + "public/" + src);
  const startF = {}, clip = {}; tl.forEach(c => { startF[c.id] = Math.round(c.start * FPS); clip[c.id] = c; });
  return (SCN[S] = { src, aud, nf, startF, clip, plan, tl });
};
// ---- T (planos del tráiler): recodificados a 30 fps 1920x1080 + su audio (foley)
const TS = J(O + "T/clips/state.json");
const tSrc = id => { const o = PV + `T_${id}.mp4`, a = V + `foley/T_${id}.wav`; fs.mkdirSync(V + "foley", { recursive: true });
  if (!fs.existsSync(o)) ff("-i", O + "T/clips/" + TS[id].file, "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1", "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", "-an", o);
  if (!fs.existsSync(a)) ff("-i", O + "T/clips/" + TS[id].file, "-vn", "-ac", "1", "-ar", "48000", a);
  return { src: `vid/tfbinodoro/T_${id}.mp4`, wav: a }; };

// ---- segmentos (orden del video)
const SEG = [
  { k: "T", id: "t01", secs: 3.0, rate: 1, shakes: [4, 40] },
  { k: "T", id: "t02", secs: 3.5, rate: 0.72, shakes: [34] },
  { k: "S", s: "S1", from: "s1_01", to: "s1_w1", punches: [{ at: 75, dur: 999, s: 1.16, oy: 38 }] },
  { k: "V", line: "s1_v1", cuts: ["t03", "t04", "t13"] },
  { k: "S", s: "S1", from: "s1_w1", to: "s1_03" },
  { k: "V", line: "s1_v2", cuts: ["t06", "t07", "t08", "t09", "t10", "t12"] },
  { k: "S", s: "S1", from: "s1_03", to: null, inserts: [["t14", 0.30, 0.50], ["t15", 0.50, 0.70], ["t16", 0.70, 0.86]] },
  { k: "V", line: "s1_v3", cuts: ["t11", "t05"], rate: 0.8 },
  { k: "S", s: "S2", whip: true, punches: [{ at: 110, dur: 60, s: 1.15, oy: 40 }] }, { k: "S", s: "S3", whip: true }, { k: "S", s: "S4", whip: true },
  { k: "S", s: "S6", to: "s6_06", whip: true }, { k: "LAM" }, { k: "S", s: "S6", from: "s6_06" },
  { k: "S", s: "SC", whip: true }, { k: "S", s: "S5", whip: true }, { k: "S", s: "S8", whip: true }, { k: "S", s: "S7", whip: true },
  { k: "S", s: "S7b", whip: true }, { k: "S", s: "S9", whip: true },
];
const TL = [], AUD = [], SFX = [], FOLEY = [], chap = [], LS = {}; // LS[lineId] = {f0, S, sf0} para anclar palabras
let fr = 0;
const master = R + "out/tfbinodoro/master_c.wav";
for (const g of SEG) {
  if (g.k === "T") {
    const t = tSrc(g.id), n = Math.round(g.secs * FPS);
    TL.push({ kind: "vid", src: t.src, from: fr, dur: n, rate: g.rate, shakes: g.shakes, t: g.id });
    FOLEY.push({ wav: t.wav, at: fr / FPS, from: 0, dur: n / FPS, rate: g.rate, gain: 1.0, t: g.id });
    fr += n; continue;
  }
  if (g.k === "V" || g.k === "LAM") {
    const id = g.k === "LAM" ? "LAM" : g.line, T = TR[id], n = Math.round((T.e - T.s) * FPS) + (g.k === "LAM" ? 6 : 0);
    AUD.push({ wav: master, at: fr / FPS, ss: T.s, dur: (T.e - T.s), line: id });
    LS[id] = { f0: fr, n };
    if (g.k === "LAM") { TL.push({ kind: "lam", from: fr, dur: n }); chap.push(["La ficha completa", fr]); SFX.push({ k: "paper", at: fr / FPS }); }
    else {
      let f0 = 0; g.cuts.forEach((c, i) => { const t = tSrc(c), f1 = Math.round(n * (i + 1) / g.cuts.length);
        TL.push({ kind: "vid", src: t.src, from: fr + f0, dur: f1 - f0, startFrom: 6, rate: g.rate || 1, t: c });
        FOLEY.push({ wav: t.wav, at: (fr + f0) / FPS, from: 6 / FPS, dur: (f1 - f0) / FPS, rate: g.rate || 1, gain: 0.55, t: c });
        if (i) SFX.push({ k: "whoosh", at: (fr + f0) / FPS - 0.12 }); f0 = f1; });
    }
    fr += n; continue;
  }
  const I = sceneInfo(g.s), f0 = g.from ? I.startF[g.from] : 0, f1 = g.to ? I.startF[g.to] : I.nf;
  if (f0 === undefined || f1 === undefined) throw new Error("segmento " + g.s + " " + g.from + " " + g.to);
  const n = f1 - f0;
  TL.push({ kind: "vid", src: I.src, from: fr, dur: n, startFrom: f0, whipIn: g.whip ? 7 : 0, punches: g.punches, s: g.s });
  if (g.whip) SFX.push({ k: "whoosh_big", at: fr / FPS - 0.15 });
  if (g.inserts) for (const [c, a, b] of g.inserts) { const t = tSrc(c), fa = Math.round(n * a), fb = Math.round(n * b);
    TL.push({ kind: "vid", src: t.src, from: fr + fa, dur: fb - fa, startFrom: 6, t: c });
    FOLEY.push({ wav: t.wav, at: (fr + fa) / FPS, from: 6 / FPS, dur: (fb - fa) / FPS, rate: 1, gain: 0.5, t: c }); SFX.push({ k: "whoosh", at: (fr + fa) / FPS - 0.1 }); }
  AUD.push({ wav: I.aud, at: fr / FPS, ss: f0 / FPS, dur: n / FPS, scene: g.s });
  // foley de los planos detalle (keyframe) de la escena: su propio audio bajo la voz
  for (const c of I.plan.clips) if (c.kf) { const cl = I.clip[c.id]; if (!cl) continue; const cs = Math.round(cl.start * FPS); if (cs < f0 || cs >= f1) continue;
    FOLEY.push({ mp4: I.plan.dir.replace(/\/?$/, "/") + "clips/" + cl.file, at: (fr + cs - f0) / FPS, from: 0, dur: cl.dur, rate: 1, gain: 0.45, t: c.id }); }
  for (const c of I.tl) { const cs = Math.round(c.start * FPS); if (cs >= f0 && cs < f1) LS[c.id] = { f0: fr + cs - f0, n: Math.round(c.dur * FPS), S: g.s, sf0: cs }; }
  if (!g.from || g.s === "S1") chap.push([g.s, fr]);
  fr += n;
}
const TOTAL = fr;
// ---- anclas de palabra
const lineStartF = id => { if (!LS[id]) throw new Error("línea sin ubicar " + id); return LS[id].f0; };
const wordF = (id, word, n = 0, dt = 0) => { const T = TR[id]; const h = caps.filter(c => c.startMs / 1000 >= T.s - 0.05 && c.startMs / 1000 < T.e && norm(c.text) === norm(word));
  if (!h.length) throw new Error(`palabra "${word}" no está en ${id}`); return lineStartF(id) + Math.round((h[Math.min(n, h.length - 1)].startMs / 1000 - T.s + dt) * FPS); };
const endF = id => LS[id].f0 + LS[id].n;
const footAt = (id, df = 0) => { const L = LS[id]; if (!L.S) throw new Error("footAt sólo en escenas: " + id); return { src: SCN[L.S].src, startFrom: L.sf0 + df }; };
const anc = (S, K) => `img/tfbinodoro/anc/${S}_${K}.jpg`;
const ANC_USED = new Set(); const ancImg = (S, K) => { ANC_USED.add(`${S}/${K}`); return anc(S, K); };
const { buildFx } = await import("./fx.mjs");
const FX = buildFx({ wordF, lineStartF, endF, footAt, ancImg, TL, SFX, FPS });
for (const k of ANC_USED) { const [S, K] = k.split("/"); const o = R + "public/" + anc(S, K); fs.mkdirSync(R + "public/img/tfbinodoro/anc", { recursive: true });
  if (!fs.existsSync(o)) ff("-i", O + `${S}/anc/${K}.png`, "-vf", "scale=1920:1080:flags=lanczos", "-q:v", "2", o); }
// ---- salida
const LAM_KEYS = (() => { const L = LS.LAM.f0, t = (w, n = 0) => (wordF("LAM", w, n) - L) / FPS;
  return [[0, 0.5, 0.5, 1], [t("paso", 0) - 0.2, 0.47, 0.37, 2.1], [t("paso", 1) - 0.2, 0.47, 0.47, 2.1], [t("paso", 2) - 0.2, 0.47, 0.57, 2.1], [t("paso", 3) - 0.2, 0.47, 0.67, 2.1],
    [t("paso", 4) - 0.2, 0.47, 0.77, 2.1], [t("errores") - 0.6, 0.78, 0.55, 1.8], [(LS.LAM.n / FPS) - 1.2, 0.5, 0.5, 1]]; })();
const ts = `// GENERADO por vlog/tfbinodoro/mktimeline.mjs — no editar a mano
export const TOTAL_FRAMES_TFBINODORO = ${TOTAL};
export const AUDIO = "tfbinodoro.m4a";
export const LAM_SRC = "img/tfbinodoro/lamina.jpg";
export const QR_SRC = "img/tfbinodoro/qr_tfbinodoro.png";
export const COVER_SRC = "img/tfbinodoro/portada-coleccion.jpg";
export type Foot = { src?: string; img?: string; startFrom?: number; rate?: number };
export type Cue = { kind: "vid" | "lam"; src?: string; img?: string; from: number; dur: number; startFrom?: number; rate?: number;
  push?: { from: number; to: number; s0: number; s1: number; ox?: number; oy?: number }; punches?: { at: number; dur: number; s: number; ox?: number; oy?: number }[];
  shakes?: number[]; whipIn?: number; whipOut?: number; whipDir?: 1 | -1 };
export type Fx = { kind: string; from: number; dur: number; foot?: Foot; p?: Record<string, unknown> };
export const LAM_KEYS: [number, number, number, number][] = ${JSON.stringify(LAM_KEYS.map(q => q.map(v => +(+v).toFixed(3))))};
export const TL: Cue[] = ${JSON.stringify(TL.map(({ t, s, ...x }) => x))};
export const FX: Fx[] = ${JSON.stringify(FX)};
`;
fs.writeFileSync(R + "src/tfbinodoro/timeline_tfbinodoro.gen.ts", ts);
fs.writeFileSync(V + "timeline.json", JSON.stringify({ TOTAL, TL, FX, AUD, SFX, FOLEY, chap, LS }, null, 1));
const assets = [...new Set([...TL.filter(x => x.src).map(x => x.src), ...TL.filter(x => x.img).map(x => x.img), ...FX.flatMap(x => [x.foot?.src, x.foot?.img, x.p?.beforeFoot?.img, x.p?.afterFoot?.img, x.p?.beforeFoot?.src, x.p?.afterFoot?.src]).filter(Boolean)]),
  "img/tfbinodoro/lamina.jpg", "img/tfbinodoro/qr_tfbinodoro.png", "img/tfbinodoro/portada-coleccion.jpg", "tfbinodoro.m4a"];
fs.writeFileSync(R + "_tfbinodoro_assets.txt", assets.join("\n") + "\n");
const mm = f => `${Math.floor(f / FPS / 60)}:${String(Math.floor(f / FPS % 60)).padStart(2, "0")}`;
console.log("TOTAL", TOTAL, "cuadros =", (TOTAL / FPS).toFixed(2), "s ·", mm(TOTAL), "· FX", FX.length, "· SFX", SFX.length, "· FOLEY", FOLEY.length);
console.log("capítulos:", chap.map(([n, f]) => `${n} ${mm(f)}`).join(" | "));
console.log("hitos: arreglo base visto", mm(endF("s2_07")), "· lámina", mm(LS.LAM.f0), "→", ((LS.LAM.n) / FPS).toFixed(1), "s");
