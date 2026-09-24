// falaurel — línea de tiempo final: mp4 por escena (agnes_vlog armar) + tráiler (cortes de T) + lámina + QR + FraseCinetica.
// Escribe src/falaurel/timeline_falaurel.gen.ts, public/falaurel_voz.wav (voz del vlog, 48k mono) y _falaurel_assets.txt
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
const R = "D:/Proyectos/video2-wt/falaurel/", V = R + "vlog/falaurel/", FPS = 30, PV = R + "public/vid/falaurel/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const nfr = f => Number((execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).toString().match(/\d+/) || [0])[0]);
fs.mkdirSync(PV, { recursive: true });
const SC = TXT.map(s => s.id);
const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
const voz = TXT.flatMap(s => s.lines.filter(l => l[1] !== "w").map(l => l[0]));
const TR = Object.fromEntries(voz.map((id, i) => [id, tr[i]]));
const caps = JSON.parse(fs.readFileSync(R + "public/captions_falaurel.json", "utf8"));
const norm = w => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9]/g, "");
const wordAt = (id, word, n = 0) => { const t = TR[id]; const h = caps.filter(c => c.startMs / 1000 >= t.s - 0.05 && c.startMs / 1000 < t.e && norm(c.text) === word); if (!h.length) throw new Error(`palabra ${word} no está en ${id}`); return h[Math.min(n, h.length - 1)].startMs / 1000 - t.s; };
// ---- escenas
const info = {};
for (const S of SC) {
  const plan = JSON.parse(fs.readFileSync(V + `plan_${S}.json`, "utf8"));
  const st = JSON.parse(fs.readFileSync(plan.dir + "/clips/state.json", "utf8"));
  const Ts = plan.clips.map(c => st[c.id].T), total = Ts.reduce((a, b) => a + b, 0);
  const src = `vid/falaurel/${S}.mp4`;
  if (!fs.existsSync(R + "public/" + src) || fs.statSync(R + "public/" + src).mtimeMs < fs.statSync(plan.out).mtimeMs) fs.copyFileSync(plan.out, R + "public/" + src);
  const nf = nfr(R + "public/" + src), want = Math.round(total * FPS);
  if (Math.abs(nf - want) > 2) throw new Error(`${S}: ${nf} cuadros vs ${want} esperados`);
  const aud = plan.dir + "/clips/_audio_total.wav";
  if (Math.abs(dur(aud) - total) > 0.05) throw new Error(`${S}: audio ${dur(aud)} vs ${total}`);
  const startF = {}; let acc = 0; plan.clips.forEach((c, i) => { startF[c.id] = Math.round(acc * FPS); acc += Ts[i]; });
  info[S] = { src, aud, want, startF };
}
// ---- tráiler: 3 tramos de voz en off, cada uno con sus cortes de T (planos de detalle 4 s, sin habla)
const TP = JSON.parse(fs.readFileSync(V + "plan_T.json", "utf8")), TS = JSON.parse(fs.readFileSync(V + "T/clips/state.json", "utf8"));
for (const c of TP.clips) { const o = PV + `T_${c.id}.mp4`; if (!fs.existsSync(o)) ff("-i", V + "T/clips/" + TS[c.id].file, "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-an", o); }
const TRAILER = [["s1_v1", ["t07", "t03", "t06"]], ["s1_v2", ["t01", "t02", "t10", "t04"]], ["s1_v3", ["t05", "t09", "t08"]]];
// ---- segmentos
const SEG = [["S1", null, "s1_02"], ["TRL"], ["S1", "s1_02", null], ["S2"], ["S3"], ["S4", null, "s4_09"], ["LAM"], ["S4", "s4_09", null],
  ["S5"], ["S6"], ["S7"], ["S8"], ["S9"], ["S10"], ["S11"], ["S12"], ["S13"]];
const TL = [], auds = [], chap = [];
let fr = 0, k = 0;
const seg = (id, o) => { const t = TR[id]; ff("-ss", t.s.toFixed(3), "-to", t.e.toFixed(3), "-i", R + "out/falaurel/master.wav", "-ac", "1", "-ar", "48000", o); return t.e - t.s; };
for (const [S, from, to] of SEG) {
  if (S === "TRL") {
    for (const [vid, cuts] of TRAILER) {
      const o = V + `_aud_${vid}.wav`, d = seg(vid, o), nf = Math.round(d * FPS);
      ff("-i", o, "-af", `apad=whole_dur=${(nf / FPS).toFixed(4)}`, "-t", (nf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", o + ".p.wav"); auds.push(o + ".p.wav");
      let f0 = 0; cuts.forEach((c, i) => { const f1 = Math.round(nf * (i + 1) / cuts.length); TL.push({ kind: "vid", src: `vid/falaurel/T_${c}.mp4`, from: fr + f0, dur: f1 - f0, startFrom: 15, trl: c }); f0 = f1; });
      if (vid === "s1_v1") { const a = wordAt(vid, "en", 0), b = wordAt(vid, "serio"); const s0 = Math.round(a * FPS) - 3; TL.push({ kind: "txt", from: fr + s0, dur: nf - s0, words: [{ t: "¿EN", hl: true }, { t: "SERIO?", hl: true }], ats: [3, 3 + Math.round((b - a) * FPS)] }); }
      if (vid === "s1_v3") { const a = wordAt(vid, "error"); const s0 = Math.round(a * FPS) - 12; TL.push({ kind: "txt", from: fr + s0, dur: Math.min(nf - s0, 75), words: [{ t: "EL" }, { t: "ERROR", hl: true }, { t: "QUE" }, { t: "ARRUINA" }, { t: "TODO", hl: true }], perWord: 5 }); }
      fr += nf;
    }
    chap.push(["tráiler", 0]); continue;
  }
  if (S === "LAM") {
    const o = V + "_aud_LAM.wav", d = seg("LAM", o), lf = Math.round(d * FPS) + 9;
    ff("-i", o, "-af", `adelay=150:all=1,apad=whole_dur=${(lf / FPS).toFixed(4)}`, "-t", (lf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", o + ".p.wav"); auds.push(o + ".p.wav");
    TL.push({ kind: "lam", from: fr, dur: lf }); chap.push(["LAMINA", fr]); fr += lf; continue;
  }
  const I = info[S], f0 = from ? I.startF[from] : 0, f1 = to ? I.startF[to] : I.want;
  if (f0 === undefined || f1 === undefined) throw new Error("segmento " + S + from + to);
  TL.push({ kind: "vid", src: I.src, from: fr, dur: f1 - f0, startFrom: f0 });
  if (!from) chap.push([S, fr]);
  if (S === "S4" && from === "s4_09") TL.push({ kind: "qr", from: fr, dur: I.startF["s4_10"] - f0 + 75 });
  if (S === "S13") TL.push({ kind: "qr", from: fr + I.startF["s13_05"], dur: I.startF["s13_07"] - I.startF["s13_05"] });
  const o = V + `_aud_seg${k++}.wav`;
  ff("-i", I.aud, "-ss", (f0 / FPS).toFixed(5), "-t", ((f1 - f0) / FPS).toFixed(5), "-ac", "1", "-ar", "48000", o);
  auds.push(o); fr += f1 - f0;
}
fs.writeFileSync(V + "_aud_final.txt", auds.map(a => `file '${a}'\n`).join(""));
ff("-f", "concat", "-safe", "0", "-i", V + "_aud_final.txt", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", R + "public/falaurel_voz.wav");
const TOTAL = fr, AD = dur(R + "public/falaurel_voz.wav");
console.log("TOTAL", TOTAL, "frames =", (TOTAL / FPS).toFixed(2), "s · voz", AD.toFixed(2), "s · Δ", (AD - TOTAL / FPS).toFixed(3));
if (Math.abs(AD - TOTAL / FPS) > 0.1) throw new Error("audio y video no cuadran");
// lámina: teclas [segundo, cx, cy, escala] sobre lamina_a
const L0 = TR.LAM.s, la = (w, n = 0) => { const h = caps.filter(c => c.startMs / 1000 >= L0 - 0.05 && c.startMs / 1000 < TR.LAM.e && norm(c.text) === w); return h[Math.min(n, h.length - 1)].startMs / 1000 - L0 + 0.15; };
const K = [[0, 0.5, 0.5, 1], [la("paso", 0) - 0.3, 0.26, 0.31, 1.9], [la("paso", 1) - 0.3, 0.26, 0.46, 1.9], [la("paso", 2) - 0.3, 0.26, 0.64, 1.9], [la("paso", 3) - 0.3, 0.26, 0.8, 1.9],
  [la("flechas") - 0.4, 0.74, 0.38, 1.7], [la("recuadro") - 0.3, 0.73, 0.82, 1.9], [la("ocho") - 0.3, 0.5, 0.93, 1.5], [la("sacale") - 0.4, 0.5, 0.5, 1]];
const ts = `// GENERADO por vlog/falaurel/mktimeline.mjs — no editar a mano
export const TOTAL_FRAMES_FALAUREL = ${TOTAL};
export const AUDIO = "falaurel.m4a";
export type Cue = { kind: "vid" | "lam" | "qr" | "txt"; src?: string; from: number; dur: number; startFrom?: number; words?: { t: string; hl?: boolean }[]; ats?: number[]; perWord?: number };
export const TL: Cue[] = ${JSON.stringify(TL.map(({ trl, ...x }) => x))};
export const LAM_KEYS: [number, number, number, number][] = ${JSON.stringify(K.map(q => q.map(v => +(+v).toFixed(3))))};
`;
fs.writeFileSync(R + "src/falaurel/timeline_falaurel.gen.ts", ts);
fs.writeFileSync(V + "timeline.json", JSON.stringify({ TOTAL, TL, chap }, null, 1));
const assets = [...new Set(TL.filter(x => x.src).map(x => x.src)), "img/falaurel/lamina.jpg", "img/falaurel/qr_falaurel.png", "falaurel.m4a"];
fs.writeFileSync(R + "_falaurel_assets.txt", assets.join("\n") + "\n");
const lam = TL.find(x => x.kind === "lam"), qrs = TL.filter(x => x.kind === "qr");
console.log("lámina", (lam.from / FPS).toFixed(1), "s →", (lam.dur / FPS).toFixed(1), "s · QR", qrs.map(q => `${(q.from / FPS).toFixed(1)}s por ${(q.dur / FPS).toFixed(1)}s`).join(" · "));
console.log("capítulos:", chap.map(([n, f]) => `${n} ${Math.floor(f / FPS / 60)}:${String(Math.floor(f / FPS % 60)).padStart(2, "0")}`).join(" | "));
