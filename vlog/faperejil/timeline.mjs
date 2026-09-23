// faperejil — arma la línea de tiempo final desde los mp4 por escena (agnes_vlog armar) + lámina + QR + máster del vlog.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/faperejil/", V = R + "vlog/faperejil/", FPS = 30;
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const nfr = f => Number((execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).toString().match(/\d+/) || [0])[0]);
// Segmentos: [escena, clip desde (incl), clip hasta (excl)] · "LAM" = lámina. El bloque "por qué a esta edad" de S2
// (s2_12b…s2_12g) se muda después de la lámina (corte de vlog) para que la lámina caiga antes del min 8.
const SEG = [["S1"], ["S2", null, "s2_12b"], ["S2", "s2_13", null], ["S3"], ["S4"], ["S5", null, "s5_03"], ["LAM"], ["S5", "s5_03", null], ["S2", "s2_12b", "s2_13"], ["S6"], ["S7"], ["S8"]];
fs.mkdirSync(R + "public/vid/faperejil", { recursive: true });
const TL = [], auds = [];
let fr = 0, k = 0;
const lamWav = V + "tramos/LAM.wav", LAM_S = dur(lamWav);
const info = {};
for (const S of ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]) {
  const plan = JSON.parse(fs.readFileSync(V + `plan_${S}.json`, "utf8"));
  const st = JSON.parse(fs.readFileSync(plan.dir + "/clips/state.json", "utf8"));
  const Ts = plan.clips.map(c => st[c.id].T), total = Ts.reduce((a, b) => a + b, 0);
  const src = `vid/faperejil/${S}.mp4`;
  if (!fs.existsSync(R + "public/" + src) || fs.statSync(R + "public/" + src).mtimeMs < fs.statSync(plan.out).mtimeMs) fs.copyFileSync(plan.out, R + "public/" + src);
  const nf = nfr(R + "public/" + src), want = Math.round(total * FPS);
  if (Math.abs(nf - want) > 2) throw new Error(`${S}: ${nf} cuadros vs ${want} esperados`);
  const aud = plan.dir + "/clips/_audio_total.wav";
  if (Math.abs(dur(aud) - total) > 0.05) throw new Error(`${S}: audio ${dur(aud)} vs ${total}`);
  const startF = {}; let acc = 0; plan.clips.forEach((c, i) => { startF[c.id] = Math.round(acc * FPS); acc += Ts[i]; });
  info[S] = { src, aud, want, startF };
}
let qr = null;
for (const [S, from, to] of SEG) {
  if (S === "LAM") {
    const lf = Math.round(LAM_S * FPS), al = V + "_aud_LAM.wav";
    ff("-i", lamWav, "-af", `apad=whole_dur=${(lf / FPS).toFixed(4)}`, "-t", (lf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", al);
    TL.push({ kind: "lam", from: fr, dur: lf }); fr += lf; auds.push(al); continue;
  }
  const I = info[S], f0 = from ? I.startF[from] : 0, f1 = to ? I.startF[to] : I.want;
  if (f0 === undefined || f1 === undefined) throw new Error("segmento " + S + from + to);
  TL.push({ kind: "vid", src: I.src, from: fr, dur: f1 - f0, startFrom: f0 });
  if (S === "S5" && from === "s5_03") qr = { kind: "qr", from: fr, dur: I.startF["s5_06"] - f0 };
  const o = V + `_aud_seg${k++}.wav`;
  ff("-i", I.aud, "-ss", (f0 / FPS).toFixed(5), "-t", ((f1 - f0) / FPS).toFixed(5), "-ac", "1", "-ar", "48000", o);
  auds.push(o); fr += f1 - f0;
}
TL.push(qr);
// máster del vlog = concatenación EXACTA de los audios por escena (48 kHz mono)
fs.writeFileSync(V + "_aud_final.txt", auds.map(a => `file '${a}'\n`).join(""));
ff("-f", "concat", "-safe", "0", "-i", V + "_aud_final.txt", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", R + "public/faperejil.wav");
ff("-i", R + "public/faperejil.wav", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", R + "public/faperejil.m4a");
const TOTAL = fr, AD = dur(R + "public/faperejil.wav");
console.log("TOTAL", TOTAL, "frames =", (TOTAL / FPS).toFixed(2), "s · máster", AD.toFixed(2), "s · Δ", (AD - TOTAL / FPS).toFixed(3));
if (Math.abs(AD - TOTAL / FPS) > 0.1) throw new Error("audio y video no cuadran");
// lámina: teclas por palabra (lam_words.json)
const w = JSON.parse(fs.readFileSync(V + "lam_words.json", "utf8")).words;
const at = (word, n = 0) => { const h = w.filter(x => x.word.toLowerCase().replace(/[^a-záéíóúñ]/g, "") === word); return h[Math.min(n, h.length - 1)].start; };
const K = [
  [0, 0.5, 0.5, 1],
  [2.2, 0.25, 0.33, 1.85],             // receta: tarjetas 1-2
  [at("colar") - 0.2, 0.25, 0.72, 1.85], // tarjetas 3-4
  [at("medio") - 0.2, 0.74, 0.35, 1.75], // dibujo de la cara
  [at("dos") - 0.2, 0.73, 0.67, 2.0],   // mascarilla
  [at("recuadro") - 0.2, 0.73, 0.84, 2.0], // los 3 errores
  [at("abajo", 1) - 0.2, 0.5, 0.94, 1.45], // plazo
  [LAM_S - 1.9, 0.5, 0.5, 1],           // la hoja entera: "sácale una foto"
];
const ts = `// GENERADO por vlog/faperejil/timeline.mjs — no editar a mano
export const TOTAL_FRAMES_FAPEREJIL = ${TOTAL};
export const AUDIO = "faperejil.m4a";
export const TL: { kind: "vid" | "lam" | "qr"; src?: string; from: number; dur: number; startFrom?: number }[] = ${JSON.stringify(TL.map(({ lamFrom, ...x }) => x))};
export const LAM_KEYS: [number, number, number, number][] = ${JSON.stringify(K.map(k => k.map(v => +(+v).toFixed(3))))};
`;
fs.writeFileSync(R + "src/faperejil/timeline_faperejil.gen.ts", ts);
const assets = [...new Set(TL.filter(x => x.src).map(x => x.src)), "img/faperejil/lamina.jpg", "img/faperejil/qr_faperejil.png", "faperejil.m4a"];
fs.writeFileSync(R + "_faperejil_assets.txt", assets.join("\n") + "\n");
const lam = TL.find(x => x.kind === "lam");
console.log("lámina", (lam.from / FPS).toFixed(1), "s →", (lam.dur / FPS).toFixed(1), "s · QR", (qr.from / FPS).toFixed(1), "s por", (qr.dur / FPS).toFixed(1), "s");
