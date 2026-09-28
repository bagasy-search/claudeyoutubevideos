// montaje.mjs — arma el montaje global de tfbcola a partir de los `armar` por escena:
//   · copia vlog_<S>.mp4 a public/tfbcola/, parte S7 para meter la FICHA con sus tramos de voz
//   · voz global = audios de escena + tramos L (public/tfbcola/tfbcola_voz.m4a)
//   · resuelve cues.json (anclados a tramo + palabra por ASR) a cuadros → src/tfbcola/timeline.gen.ts
//   node vlog/tfbcola/montaje.mjs            (necesita out/vlog/<S>/vlog_<S>.mp4 de todas las escenas)
import fs from "node:fs"; import path from "node:path"; import { execFileSync as _efs } from "node:child_process"; const execFileSync = (c, a, o) => _efs(c, a, { windowsHide: true, ...(o || {}) });
const HERE = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1"), ROOT = path.resolve(HERE, "../..").replace(/\\/g, "/");
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
const FPS = 30, PUB = ROOT + "/public/", OUTP = "tfbcola/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { maxBuffer: 1 << 26 });
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const SCENES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S9m", "S9b", "S10", "S10b", "S11", "S12", "S13"];
const BJ = J(HERE + "/beats.json"), TR = J(HERE + "/tramos.json"), ASR = Object.values(J(HERE + "/asr.json"))[0];
const trById = Object.fromEntries(TR.map(t => [t.id, t]));
fs.mkdirSync(PUB + OUTP + "det", { recursive: true }); fs.mkdirSync(PUB + OUTP + "img", { recursive: true });

function lumaMedia(f) { // media de 12 cuadros repartidos, en gris 0-255
  const D = dur(f); let tot = 0, n = 0;
  for (let i = 1; i <= 12; i++) { const b = execFileSync("ffmpeg", ["-v", "error", "-ss", (D * i / 13).toFixed(2), "-i", f, "-frames:v", "1", "-vf", "scale=64:36,format=gray", "-f", "rawvideo", "-"], { windowsHide: true });
    for (const v of b) tot += v; n += b.length; }
  return tot / n;
}
// ---- segmentos de base + voz ----
const SEGS = [], AUDS = [], CLIPAT = {}; // CLIPAT[id] = {g: segundo global de la VOZ, vg: segundo global del video, seg}
let t = 0; // segundos globales
const TMP = ROOT + "/out/montaje/"; fs.mkdirSync(TMP, { recursive: true });
for (const S of SCENES) {
  const D = `${ROOT}/out/vlog/${S}/`, mp4 = D + `vlog_${S}.mp4`, tl = J(D + `timeline_vlog_${S}.json`), aud = D + `audio_vlog_${S}.wav`;
  const pub = OUTP + `vlog_${S}.mp4`;
  if (!fs.existsSync(PUB + pub) || fs.statSync(PUB + pub).mtimeMs < fs.statSync(mp4).mtimeMs) {
    // agnes devuelve el garaje más oscuro y contrastado que las anclas: se levantan los medios con GAMMA (no brillo lineal,
    // que quema la puerta abierta) hasta una luma media ~92, sin tocar el color. Medido por escena.
    const y = lumaMedia(mp4), g = Math.min(1.45, Math.max(1, Math.log(y / 255) / Math.log(92 / 255)));
    if (g > 1.03) ff("-i", mp4, "-vf", `eq=gamma=${g.toFixed(3)}`, "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", "-an", "-movflags", "+faststart", PUB + pub);
    else fs.copyFileSync(mp4, PUB + pub);
    console.log(S, "luma", y.toFixed(0), "gamma", g.toFixed(2));
  }
  const total = tl.at(-1).vstart + tl.at(-1).vdur;
  const splitAfter = S === "S7" ? tl.findIndex(c => c.id === "b073") : -1;
  const parts = splitAfter >= 0 ? [[0, tl[splitAfter + 1].vstart, 0, tl[splitAfter + 1].start], [tl[splitAfter + 1].vstart, total, tl[splitAfter + 1].start, null]] : [[0, total, 0, null]];
  for (const [pi, [v0, v1, a0, a1]] of parts.entries()) {
    const seg = { key: `${S}_${pi}`, kind: "video", src: pub, from: Math.round(t * FPS), dur: Math.round((v1 - v0) * FPS), startFrom: Math.round(v0 * FPS), scene: S };
    SEGS.push(seg);
    for (const c of tl) if (c.vstart >= v0 - 0.001 && c.vstart < v1 - 0.001) CLIPAT[c.id] = { g: t + (c.start - a0), vg: t + (c.vstart - v0), c, seg, S };
    const o = TMP + `a_${S}_${pi}.wav`; ff("-i", aud, "-ss", String(a0), ...(a1 != null ? ["-to", String(a1)] : []), "-ac", "2", "-ar", "48000", o); AUDS.push(o);
    t += (v1 - v0);
    if (pi === 0 && splitAfter >= 0) { // la FICHA: tramos L seguidos
      const L = TR.filter(x => x.type === "L"); const lo = TMP + "a_lamina.wav";
      fs.writeFileSync(TMP + "lam.txt", L.map(x => `file '${x.audio}'\n`).join("")); ff("-f", "concat", "-safe", "0", "-i", TMP + "lam.txt", "-ac", "2", "-ar", "48000", lo);
      const ld = dur(lo); let acc = 0; for (const x of L) { CLIPAT[x.id] = { g: t + acc, vg: t + acc, lamina: true }; acc += x.len; }
      SEGS.push({ key: "lamina", kind: "lamina", src: OUTP + "img/lamina_tfbcola.jpg", from: Math.round(t * FPS), dur: Math.round(ld * FPS), startFrom: 0, scene: "LAM" });
      AUDS.push(lo); t += ld;
    }
  }
}
// voz global (los audios de escena ya traen el foley de los planos X y la voz del vecino)
fs.writeFileSync(TMP + "voz.txt", AUDS.map(a => `file '${a}'\n`).join(""));
ff("-f", "concat", "-safe", "0", "-i", TMP + "voz.txt", "-c:a", "pcm_s16le", TMP + "voz.wav");
ff("-i", TMP + "voz.wav", "-c:a", "aac", "-b:a", "192k", PUB + OUTP + "tfbcola_voz.m4a");
if (!fs.existsSync(PUB + OUTP + "img/lamina_tfbcola.jpg")) fs.copyFileSync(PUB + "img/tfbcola/lamina_tfbcola.jpg", PUB + OUTP + "img/lamina_tfbcola.jpg");
for (const f of ["qr_tfbcola.png", "portada-coleccion.jpg"]) fs.copyFileSync(PUB + "img/tfbcola/" + f, PUB + OUTP + "img/" + f);
const TOTAL = Math.round(t * FPS);
console.log("total", (TOTAL / FPS).toFixed(2), "s ·", SEGS.length, "segmentos · voz", dur(TMP + "voz.wav").toFixed(2));

// ---- palabra → segundo global ----
const norm = w => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
function wordAt(id, w, nth = 1) {
  const A = CLIPAT[id]; if (!A) throw new Error("clip/tramo sin ubicar: " + id);
  if (!w) return A.g;
  const tr = trById[id]; if (!tr) throw new Error("sin tramo: " + id);
  const ws = ASR.filter(x => x.startMs / 1000 >= tr.start - 0.05 && x.startMs / 1000 < tr.start + tr.len);
  const hits = ws.filter(x => norm(x.text).startsWith(norm(w)));
  if (hits.length < nth) throw new Error(`palabra "${w}" no está en ${id}: ${ws.map(x => x.text).join(" ")}`);
  return A.g + (hits[nth - 1].startMs / 1000 - tr.start);
}
const segAt = fr => SEGS.find(s => fr >= s.from && fr < s.from + s.dur);

// ---- cues ----
const CQ = J(HERE + "/cues.json");
const CUES = [], CAM = [], SFX = [];
const sfx = (fr, src, vol = 0.5, d = 60) => SFX.push({ key: `sfx${SFX.length}`, from: Math.max(0, fr), dur: d, src: "sfx/" + src, vol });
for (const [i, q] of CQ.entries()) {
  const g = wordAt(q.at, q.w, q.nth) + (q.off || 0), fr = Math.round(g * FPS);
  const d = Math.round((q.dur || 3) * FPS);
  const props = JSON.parse(JSON.stringify(q.props || {}));
  if (props.src === "@base" || (props.left && props.left.src === "@base")) { // cuadro exacto del video de abajo
    const s = segAt(fr); props.src = s.src; props.startFrom = s.startFrom + (fr - s.from); if (q.kind === "TfbFreeze") props.frame = props.startFrom + (props.freezeOff || 0) * FPS | 0;
  }
  for (const side of ["left", "right"]) if (props[side]?.anc) { const [S, K] = props[side].anc.split("/"); const dst = OUTP + `img/${S}_${K}.jpg`;
    if (!fs.existsSync(PUB + dst)) ff("-i", `${ROOT}/out/vlog/${S}/anc/${K}.png`, "-q:v", "3", PUB + dst); props[side].src = dst; delete props[side].anc; }
  if (props.freezeAnc) { const [S, K] = props.freezeAnc.split("/"); const dst = OUTP + `img/${S}_${K}.jpg`; if (!fs.existsSync(PUB + dst)) ff("-i", `${ROOT}/out/vlog/${S}/anc/${K}.png`, "-q:v", "3", PUB + dst); props.src = dst; props.image = true; delete props.freezeAnc; }
  if (q.kind) CUES.push({ key: `c${i}_${q.kind}`, kind: q.kind, from: fr, dur: d, props });
  if (q.cam) CAM.push({ f: fr + (q.camOff || 0), kind: q.cam, ...(q.camAmt ? { amt: q.camAmt } : {}), ...(q.camDur ? { dur: q.camDur } : {}), ...(q.camXY ? { x: q.camXY[0], y: q.camXY[1] } : {}) });
  if (q.sfx) sfx(fr + (q.sfxOff || 0), q.sfx, q.vol ?? 0.5);
}
// transiciones: whip + whoosh en cada cambio de escena (no dentro de S7 partido ni hacia/desde la ficha)
for (let i = 1; i < SEGS.length; i++) {
  const a = SEGS[i - 1], b = SEGS[i]; if (a.scene === b.scene) continue;
  if (b.kind === "lamina" || a.kind === "lamina") { sfx(b.from - 4, "sfx_whoosh_soft.mp3", 0.45); continue; }
  CAM.push({ f: b.from, kind: "whip", dir: i % 2 ? 1 : -1 }); sfx(b.from - 6, "whoosh.mp3", 0.35);
}
// minuto 1: whoosh suave en cada corte limpio entre planos (ritmo del tráiler), salteando los que ya tienen sonido
for (const [id, A] of Object.entries(CLIPAT)) {
  if (A.lamina || A.vg > 62 || A.vg < 3) continue;
  const fr = Math.round(A.vg * FPS); if (SFX.some(s => Math.abs(s.from - fr) < 12)) continue;
  if (A.c && A.c.cut) sfx(fr - 3, ["sfx_trans1.mp3", "sfx_trans2.mp3", "sfx_trans3.mp3", "sfx_trans4.mp3"][fr % 4], 0.22);
}
// foley de los planos de detalle con voz encima (los X ya suenan en el audio de escena)
for (const [id, A] of Object.entries(CLIPAT)) {
  if (!A.c || !A.c.detail || !A.c.file) continue; const T = TR.find(x => x.id === id); if (!T) continue; // sólo D (con voz)
  const src = `${ROOT}/out/vlog/${A.S}/clips/${A.c.file}`, dst = OUTP + "det/" + A.c.file; if (!fs.existsSync(PUB + dst)) ff("-i", src, "-vn", "-ac", "2", "-ar", "48000", "-c:a", "aac", "-b:a", "128k", PUB + dst.replace(/\.mp4$/, ".m4a"));
  SFX.push({ key: `foley_${id}`, from: Math.round(A.vg * FPS), dur: Math.round(A.c.vdur * FPS), src: dst.replace(/\.mp4$/, ".m4a"), vol: 0.32 });
}
// música: cama del gancho desde el seg 6 (≈ −22 dB bajo la voz), vuelve bajo la ficha y en el cierre
const lam = SEGS.find(s => s.kind === "lamina");
const MUSIC = [
  { key: "m_hook", src: "sfx/music_federer.mp3", from: 6 * FPS, dur: 58 * FPS, vol: 0.075, fadeIn: 20, fadeOut: 45 },
  { key: "m_lam", src: "sfx/music_federer.mp3", from: lam.from - 15, dur: lam.dur + 30, vol: 0.05, fadeIn: 30, fadeOut: 30, startFrom: 40 * FPS },
  { key: "m_end", src: "sfx/music_federer.mp3", from: TOTAL - 45 * FPS, dur: 45 * FPS, vol: 0.07, fadeIn: 60, fadeOut: 60, startFrom: 70 * FPS },
];
CAM.sort((a, b) => a.f - b.f); SFX.sort((a, b) => a.from - b.from); CUES.sort((a, b) => a.from - b.from);
const TS = `// timeline.gen.ts — GENERADO por vlog/tfbcola/montaje.mjs. No editar a mano.
/* eslint-disable */
import type { CamEvent } from "../tfb/TfbCamera";
import type { LamStop } from "../tfb/TfbLamina";
export const TOTAL_FRAMES_TFBCOLA = ${TOTAL};
export const VOICE = "${OUTP}tfbcola_voz.m4a";
export const AMB: { src: string; vol: number } | null = { src: "sfx/amb_taller.mp3", vol: 0.035 };
export const SEGS: { key: string; kind: "video" | "lamina"; src: string; from: number; dur: number; startFrom: number; stops?: LamStop[] }[] = ${JSON.stringify(SEGS.map(({ scene, ...s }) => s.kind === "lamina" ? { ...s, stops: lamStops(s) } : s))};
export const CAM: CamEvent[] = ${JSON.stringify(CAM)};
export const CUES: { key: string; kind: string; from: number; dur: number; props: Record<string, unknown> }[] = ${JSON.stringify(CUES)};
export const SFX: { key: string; from: number; dur: number; src: string; vol: number }[] = ${JSON.stringify(SFX)};
export const MUSIC: { key: string; src: string; from: number; dur: number; vol: number; fadeIn: number; fadeOut: number; startFrom?: number }[] = ${JSON.stringify(MUSIC)};
`;
function lamStops(s) { // recorrido de la ficha anclado a los tramos L (coordenadas en % de la ficha 3:2 dentro del cuadro 16:9)
  const L = TR.filter(x => x.type === "L"), f0 = s.from, at = id => Math.round(CLIPAT[id].g * FPS) - f0;
  const W = (w, id, extra = 0) => wordAt(id, w) * FPS - f0 + extra | 0;
  return [
    { f: 0, x: 50, y: 50, z: 1 },
    { f: 40, x: 50, y: 50, z: 1 },
    { f: W("ingredientes", "b074") - 6, x: 14, y: 62, z: 1.9, box: { x: 8, y: 26, w: 20, h: 58 } },
    { f: at("b075") + 4, x: 44, y: 60, z: 1.65, box: { x: 30, y: 26, w: 38, h: 62 } },
    { f: at("b076") + 4, x: 88, y: 40, z: 2.0, box: { x: 72, y: 26, w: 22, h: 30 } },
    { f: W("abajo", "b077"), x: 88, y: 72, z: 2.1, box: { x: 72, y: 58, w: 22, h: 30 } },
    { f: at("b078") + 40, x: 50, y: 50, z: 1.0 },
  ].filter((p, i, a) => i === 0 || p.f > a[i - 1].f);
}
fs.writeFileSync(ROOT + "/src/tfbcola/timeline.gen.ts", TS);
// lista de assets del farm
const assets = new Set([OUTP + "tfbcola_voz.m4a", ...SEGS.map(s => s.src), ...SFX.map(s => s.src), ...MUSIC.map(m => m.src), "sfx/amb_taller.mp3",
  ...CUES.flatMap(c => [c.props.src, c.props.left?.src, c.props.right?.src, c.props.qr, c.props.cover].filter(Boolean))]);
fs.writeFileSync(ROOT + "/_tfbcola_assets.txt", [...assets].join("\n") + "\n");
console.log("cues", CUES.length, "cam", CAM.length, "sfx", SFX.length, "assets", assets.size);
fs.writeFileSync(TMP + "clipat.json", JSON.stringify(Object.fromEntries(Object.entries(CLIPAT).map(([k, v]) => [k, { g: +v.g.toFixed(3), vg: +v.vg.toFixed(3), S: v.S }])), null, 0));
