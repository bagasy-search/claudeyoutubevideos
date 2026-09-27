// tfbpiso — línea de tiempo final: mp4 por escena (agnes_vlog armar) + tráiler (cortes de T) + lámina + overlays Tfb*
// anclados a la PALABRA (ASR) + diseño de sonido (foley de los keyframe, whoosh, impactos, riser, cama con ducking).
// Escribe src/tfbpiso/timeline_tfbpiso.gen.ts, public/tfbpiso_voz.wav, public/tfbpiso_music.wav y _tfbpiso_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
import { direccion } from "./director.mjs";
const R = "D:/Proyectos/video2-wt/tfbpiso/", V = R + "vlog/tfbpiso/", FPS = 30, PV = R + "public/vid/tfbpiso/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { maxBuffer: 1 << 28 });
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const nfr = f => Number((execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).toString().match(/\d+/) || [0])[0]);
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
fs.mkdirSync(PV, { recursive: true });
const SKIP = (process.env.SKIP || "").split(",").filter(Boolean); // PRUEBA: escenas aún sin armar (nunca para el render final)
const tr = J(V + "tramos.json");
const voz = TXT.flatMap(s => s.lines.filter(l => !["w", "k"].includes(l[1])).map(l => l[0]));
const TR = Object.fromEntries(voz.map((id, i) => [id, tr[i]]));
const caps = J(R + "public/captions_tfbpiso.json");
const norm = w => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9]/g, "");
// ---- escenas armadas
const info = {};
for (const s of TXT) {
  const S = s.id; if (SKIP.includes(S)) continue;
  const plan = J(V + `plan_${S}.json`), tl = J(plan.dir + `/timeline_vlog_${S}.json`);
  const src = `vid/tfbpiso/${S}.mp4`;
  if (!fs.existsSync(R + "public/" + src) || fs.statSync(R + "public/" + src).mtimeMs < fs.statSync(plan.out).mtimeMs) fs.copyFileSync(plan.out, R + "public/" + src);
  const nf = nfr(R + "public/" + src);
  const startF = {}, info1 = {}; tl.forEach(c => { startF[c.id] = Math.round(c.vstart * FPS); info1[c.id] = c; });
  info[S] = { src, nf, startF, tl: info1, aud: plan.dir + `/audio_vlog_${S}.wav`, plan };
}
// ---- T (tráiler): keyframes 4 s → 30 fps 1920x1080 sin audio + su foley aparte
const TP = J(V + "plan_T.json"), TS = fs.existsSync(V + "T/clips/state_det.json") ? J(V + "T/clips/state_det.json") : {};
const Tsrc = {};
for (const c of TP.clips) { if (!TS[c.id]) continue; const i = V + "T/clips/" + TS[c.id].file, o = PV + `T_${c.id}.mp4`, a = PV + `T_${c.id}.m4a`;
  if (!fs.existsSync(o) || fs.statSync(o).mtimeMs < fs.statSync(i).mtimeMs) { ff("-i", i, "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-an", o); ff("-i", i, "-vn", "-c:a", "aac", "-b:a", "128k", a); }
  Tsrc[c.id] = { v: `vid/tfbpiso/T_${c.id}.mp4`, a: `vid/tfbpiso/T_${c.id}.m4a` }; }
// ---- foley de los detalles DENTRO de escenas (el armar deja la voz; su sonido real va en una pista aparte, bajo la voz)
const detFoley = {};
for (const S of Object.keys(info)) { const st = fs.existsSync(info[S].plan.dir + "/clips/state_det.json") ? J(info[S].plan.dir + "/clips/state_det.json") : {};
  for (const [id, v] of Object.entries(st)) { const i = info[S].plan.dir + "/clips/" + v.file, a = PV + `fx_${id}.m4a`;
    if (!fs.existsSync(a) || fs.statSync(a).mtimeMs < fs.statSync(i).mtimeMs) ff("-i", i, "-vn", "-c:a", "aac", "-b:a", "128k", a);
    detFoley[id] = { S, a: `vid/tfbpiso/fx_${id}.m4a` }; } }
// ---- segmentos
const TRAILER = [["s1_v1", ["t03", "t14", "t04", "t05"]], ["s1_v2", ["t15", "t06", "t07", "t08", "t09"]], ["s1_v3", ["t10", "t11"]]];
const INTRO = [["t01", 66], ["t02", 54]]; // cuadros: 0-2,2 s y 2,2-4 s (foley puro, sin voz ni música)
const SEG = [["INTRO"], ["S1", null, "s1_02"], ["TRL"], ["S1", "s1_02", null], ["S2"], ["S3"], ["S3B"], ["S4"], ["S4B"], ["S5", null, "s5_02b"], ["LAM"], ["S5", "s5_02b", null],
  ["S6"], ["S7"], ["S8"], ["S9"], ["S9B"], ["S10"], ["S11"]];
const TL = [], auds = [], chap = [], lineAt = {}, FOLEY = [];
let fr = 0, k = 0;
const seg = (id, o) => { const t = TR[id]; ff("-ss", t.s.toFixed(3), "-to", t.e.toFixed(3), "-i", R + "out/tfbpiso/master.wav", "-ac", "1", "-ar", "48000", o); return t.e - t.s; };
const padTo = (i, o, nf) => ff("-i", i, "-af", `apad=whole_dur=${(nf / FPS).toFixed(4)}`, "-t", (nf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", o);
for (const [S, from, to] of SEG) {
  if (S === "INTRO") {
    for (const [id, n] of INTRO) { if (!Tsrc[id]) throw new Error("falta T " + id); TL.push({ kind: "vid", src: Tsrc[id].v, from: fr, dur: n, startFrom: 4, trl: id }); FOLEY.push({ src: Tsrc[id].a, from: fr, dur: n, startFrom: 4, vol: 1.0 }); fr += n; }
    const o = V + "_aud_intro.wav"; ff("-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", (fr / FPS).toFixed(4), o); auds.push(o); chap.push(["gancho", 0]); continue;
  }
  if (S === "TRL") {
    for (const [vid, cuts] of TRAILER) {
      const o = V + `_aud_${vid}.wav`, d = seg(vid, o), nf = Math.round(d * FPS); padTo(o, o + ".p.wav", nf); auds.push(o + ".p.wav");
      lineAt[vid] = { f: fr, t0: TR[vid].s };
      let f0 = 0; cuts.forEach((c, i) => { const f1 = Math.round(nf * (i + 1) / cuts.length); if (!Tsrc[c]) throw new Error("falta T " + c);
        TL.push({ kind: "vid", src: Tsrc[c].v, from: fr + f0, dur: f1 - f0, startFrom: 12, trl: c }); FOLEY.push({ src: Tsrc[c].a, from: fr + f0, dur: f1 - f0, startFrom: 12, vol: 0.35 }); f0 = f1; });
      fr += nf;
    }
    continue;
  }
  if (S === "LAM") {
    const o = V + "_aud_LAM.wav", d = seg("LAM", o), lf = Math.round(d * FPS) + 12;
    ff("-i", o, "-af", `adelay=250:all=1,apad=whole_dur=${(lf / FPS).toFixed(4)}`, "-t", (lf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", o + ".p.wav"); auds.push(o + ".p.wav");
    lineAt.LAM = { f: fr + Math.round(0.25 * FPS), t0: TR.LAM.s };
    TL.push({ kind: "lam", src: "img/tfbpiso/lamina.jpg", from: fr, dur: lf, lam: true }); chap.push(["LÁMINA", fr]); fr += lf; continue;
  }
  if (SKIP.includes(S)) continue;
  const I = info[S], f0 = from ? I.startF[from] : 0, f1 = to ? I.startF[to] : I.nf;
  if (f0 === undefined || f1 === undefined) throw new Error("segmento " + S + from + to);
  TL.push({ kind: "vid", src: I.src, from: fr, dur: f1 - f0, startFrom: f0, scene: S, sceneFrom: f0 });
  for (const [id, c] of Object.entries(I.tl)) { const cf = Math.round(c.start * FPS); if (cf >= f0 && cf < f1) lineAt[id] = { f: fr + cf - f0, t0: TR[id] ? TR[id].s : null, S };
    if (detFoley[id] && cf >= f0 && cf < f1) FOLEY.push({ src: detFoley[id].a, from: fr + Math.round(c.vstart * FPS) - f0, dur: Math.round(c.vdur * FPS), startFrom: 0, vol: 0.3 }); }
  if (!from) chap.push([S, fr]);
  const o = V + `_aud_seg${k++}.wav`;
  ff("-i", I.aud, "-ss", (f0 / FPS).toFixed(5), "-t", ((f1 - f0) / FPS).toFixed(5), "-ac", "1", "-ar", "48000", o);
  auds.push(o); fr += f1 - f0;
}
fs.writeFileSync(V + "_aud_final.txt", auds.map(a => `file '${a}'\n`).join(""));
ff("-f", "concat", "-safe", "0", "-i", V + "_aud_final.txt", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", R + "public/tfbpiso_voz.wav");
const TOTAL = fr, AD = dur(R + "public/tfbpiso_voz.wav");
console.log("TOTAL", TOTAL, "cuadros =", (TOTAL / FPS).toFixed(2), "s · voz", AD.toFixed(2), "s · Δ", (AD - TOTAL / FPS).toFixed(3));
if (Math.abs(AD - TOTAL / FPS) > 0.1) throw new Error("audio y video no cuadran");
// ---- anclaje a la palabra: W(línea, palabra, n) → cuadro global
const W = (id, word, n = 0, dt = 0) => { const L = lineAt[id]; if (!L) throw new Error("línea sin ubicar " + id); const t = TR[id]; const w = norm(word);
  const h = caps.filter(c => c.startMs / 1000 >= t.s - 0.05 && c.startMs / 1000 < t.e && norm(c.text) === w);
  if (!h.length) throw new Error(`palabra "${word}" no está en ${id}: ${t.t}`);
  return L.f + Math.round((h[Math.min(n, h.length - 1)].startMs / 1000 - t.s + dt) * FPS); };
const Lf = id => { if (!lineAt[id]) throw new Error("línea sin ubicar " + id); return lineAt[id].f; };
const Le = id => Lf(id) + Math.round((TR[id].e - TR[id].s) * FPS);
// ---- dirección (overlays, inserts, cámara, sfx) — vive en director.mjs
const D = direccion({ W, Lf, Le, TL, Tsrc, TOTAL, info, FPS });
const OV = D.OV.filter(Boolean).sort((a, b) => a.from - b.from), SFX = D.SFX.filter(Boolean);
for (const c of D.INSERTS) { TL.push(c); if (c.foley) FOLEY.push({ src: c.foley, from: c.from, dur: c.dur, startFrom: c.startFrom || 0, vol: c.foleyVol ?? 0.35 }); }
// cámara: punch/shake/whip por segmento (director devuelve {matchFrom, ...cam})
for (const cam of D.CAM) { const c = TL.find(x => x.kind === "vid" && x.from <= cam.at && cam.at < x.from + x.dur && !x.insert);
  if (!c) continue; const rel = cam.at - c.from;
  if (cam.punch) (c.punch ||= []).push({ f: rel, s: cam.punch, x: cam.x, y: cam.y });
  if (cam.shake) (c.shakes ||= []).push(rel); }
for (const c of TL) { if (c.punch) c.punch.sort((a, b) => a.f - b.f); }
// whip entre escenas (entrada de cada escena nueva, 6 cuadros) + whoosh
for (const [n, f] of chap) if (f > 0 && n !== "LÁMINA") { const c = TL.find(x => x.from === f && x.kind === "vid"); if (c) c.whipIn = 7; SFX.push({ src: "sfx/lib/whoosh_soft_3.mp3", from: Math.max(0, f - 5), vol: 0.5 }); }
// ---- cama musical con DUCKING (sube en las pausas, baja bajo la voz): volumen por cuadro desde la envolvente de la voz
const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", R + "public/tfbpiso_voz.wav", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], { maxBuffer: 1 << 30 });
const spf = 8000 / FPS, env = [];
for (let f = 0; f < TOTAL; f++) { let s = 0; const a = Math.floor(f * spf), b = Math.min(pcm.length / 2, Math.floor((f + 1) * spf)); for (let i = a; i < b; i++) { const v = pcm.readInt16LE(2 * i) / 32768; s += v * v; } env.push(Math.sqrt(s / Math.max(1, b - a))); }
const MUSIC_FROM = D.MUSIC_FROM, MUSIC_END = TOTAL - 30;
const vol = []; let g = 0;
for (let f = 0; f < TOTAL; f++) { const speaking = env.slice(Math.max(0, f - 3), f + 4).some(v => v > 0.02); const tgt = speaking ? D.MUSIC_LOW : D.MUSIC_HIGH; g += (tgt - g) * (tgt > g ? 0.12 : 0.35); vol.push(+g.toFixed(3)); }
// la música se renderiza A DISCO con su curva ya aplicada (no 50.000 valores en el bundle): wav 48k mono
{ const mdur = (MUSIC_END - MUSIC_FROM) / FPS; const raw = V + "_music_raw.wav";
  ff("-stream_loop", "-1", "-i", R + "public/sfx/music_federer.mp3", "-t", mdur.toFixed(3), "-ac", "2", "-ar", "48000", raw);
  const expr = []; for (let f = MUSIC_FROM; f < MUSIC_END; f += 6) expr.push(`${((f - MUSIC_FROM) / FPS).toFixed(3)} ${vol[f]}`);
  fs.writeFileSync(V + "_music_vol.txt", expr.join("\n"));
  // curva por tramos con el filtro volume (eval=frame) a partir de una tabla → usamos asendcmd
  const cmds = expr.map(l => { const [t, v] = l.split(" "); return `${t} volume volume ${v};`; }).join("\n");
  fs.writeFileSync(V + "_music_cmd.txt", cmds);
  ff("-i", raw, "-af", `asendcmd=f='${(V + "_music_cmd.txt").replace(/:/g, "\\:")}',volume=0:eval=frame,afade=t=in:d=1.5,afade=t=out:st=${(mdur - 3).toFixed(2)}:d=3`, "-ac", "2", "-ar", "48000", R + "public/tfbpiso_music.wav"); }
const MUSIC = [{ src: "tfbpiso_music.wav", from: MUSIC_FROM, dur: MUSIC_END - MUSIC_FROM, vol: 1, fadeIn: 1, fadeOut: 1 }];
// ---- lámina: teclas y marcas
const lam = TL.find(x => x.kind === "lam"); Object.assign(lam, D.LAM);
// ---- escribir
const clean = x => { const { trl, scene, sceneFrom, insert, lam: _l, foley, foleyVol, ...y } = x; return y; };
const ts = `// GENERADO por vlog/tfbpiso/mktimeline.mjs — no editar a mano
export const TOTAL_FRAMES_TFBPISO = ${TOTAL};
export const VOICE = "tfbpiso_voz.wav";
export type Cue = { kind: "vid" | "lam"; src?: string; from: number; dur: number; startFrom?: number; rate?: number; punch?: { f: number; s: number; x?: number; y?: number }[]; shakes?: number[]; whipIn?: number; whipOut?: number; push?: number; keys?: [number, number, number, number][]; marks?: { from: number; to: number; x: number; y: number; w: number; h: number }[] };
export type Ov = { c: string; from: number; dur: number; props: Record<string, unknown> };
export type Snd = { src: string; from: number; dur: number; startFrom?: number; vol: number; fadeIn?: number; fadeOut?: number };
export const TL: Cue[] = ${JSON.stringify(TL.map(clean))};
export const OV: Ov[] = ${JSON.stringify(OV)};
export const SFX: Snd[] = ${JSON.stringify(SFX.map(s => ({ dur: 90, ...s })))};
export const FOLEY: Snd[] = ${JSON.stringify(FOLEY)};
export const MUSIC: Snd[] = ${JSON.stringify(MUSIC)};
`;
fs.writeFileSync(R + "src/tfbpiso/timeline_tfbpiso.gen.ts", ts);
fs.writeFileSync(V + "timeline.json", JSON.stringify({ TOTAL, TL, OV, chap, lineAt }, null, 1));
const imgs = new Set(); const walk = o => { if (typeof o === "string" && /^(img|vid|sfx)\//.test(o)) imgs.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(TL); walk(OV); walk(SFX); walk(FOLEY);
const assets = [...imgs, "tfbpiso_voz.wav", "tfbpiso_music.wav"];
fs.writeFileSync(R + "_tfbpiso_assets.txt", assets.join("\n") + "\n");
console.log("capítulos:", chap.map(([n, f]) => `${n} ${Math.floor(f / FPS / 60)}:${String(Math.floor(f / FPS % 60)).padStart(2, "0")}`).join(" | "));
console.log("overlays", OV.length, "· sfx", SFX.length, "· foley", FOLEY.length, "· assets", assets.length);
fs.writeFileSync(V + "chapters.json", JSON.stringify(chap));
