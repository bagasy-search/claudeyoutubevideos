// tfbpiedra — línea de tiempo final: tráiler + receta (planos sueltos del plan T) + escenas (mp4 de `armar`) + lámina.
// Escribe src/tfbpiedra/timeline.gen.ts, vlog/tfbpiedra/voz.wav (voz + audio propio del vecino, 48k mono, cuadro-exacta),
// vlog/tfbpiedra/events.json (dónde van foley/SFX para mix.mjs) y _tfbpiedra_assets.txt.
// SKIP=S4,S5a  → escenas todavía sin armar (sólo para PRUEBAS; nunca para el render final).
import fs from "node:fs";
import { execFileSync as _e } from "node:child_process";
import { TXT } from "./txt.mjs";
import { FXPLAN } from "./fxplan.mjs";
const execFileSync = (c, a, o) => _e(c, a, { windowsHide: true, maxBuffer: 1 << 26, ...(o || {}) });
const R = "D:/Proyectos/video2-wt/tfbpiedra/", V = R + "vlog/tfbpiedra/", FPS = 30, PV = "vid/tfbpiedra/", PVA = R + "public/" + PV;
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const nfr = f => Number((execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).toString().match(/\d+/) || [0])[0]);
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
fs.mkdirSync(PVA, { recursive: true }); fs.mkdirSync(V + "_aud", { recursive: true });
const SKIP = (process.env.SKIP || "").split(",").filter(Boolean);
const VOZ = TXT.flatMap(s => s.lines.filter(l => !["w", "x"].includes(l[1])).map(l => l[0]));
const trA = J(V + "tramos.json"); if (trA.length !== VOZ.length) throw new Error("tramos != voz");
const TR = Object.fromEntries(VOZ.map((id, i) => [id, trA[i]]));
const TEXT = Object.fromEntries(TXT.flatMap(s => s.lines.map(l => [l[0], l[2]])));
const caps = J(V + "captions_c.json");
const norm = w => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9]/g, "");
/** segundo (dentro del tramo `id`) donde empieza la n-ésima palabra `word` */
function wordAt(id, word, n = 0) {
  const t = TR[id]; const w = norm(word);
  const h = caps.filter(c => c.startMs / 1000 >= t.s - 0.05 && c.startMs / 1000 < t.e && norm(c.text) === w);
  if (!h.length) { // el ASR escribe números ("1") o parte palabras: posición proporcional dentro del texto de la línea
    const ws = TEXT[id].split(/\s+/).map(norm); let k = -1, c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === w && c++ === n) { k = i; break; }
    if (k < 0) throw new Error(`palabra "${word}" no está en ${id} (${TEXT[id]})`);
    const chars = TEXT[id].split(/\s+/).slice(0, k).join(" ").length; console.log(`(aprox) "${word}" en ${id}`); return Math.max(0, t.d * chars / TEXT[id].length - 0.05);
  }
  return Math.max(0, h[Math.min(n, h.length - 1)].startMs / 1000 - t.s);
}
const master = R + "out/tfbpiedra/master_c2.wav";
function tramoWav(id, D) { // tramo del máster rellenado/cortado a D s exactos (48k mono)
  const o = V + `_aud/${id}_${D.toFixed(4)}.wav`; const t = TR[id];
  if (!fs.existsSync(o)) ff("-ss", t.s.toFixed(4), "-to", t.e.toFixed(4), "-i", master, "-af", `apad=whole_dur=${D.toFixed(4)}`, "-t", D.toFixed(4), "-ac", "1", "-ar", "48000", o);
  return o;
}
function clipWav(file, ss, D, tag) { const o = V + `_aud/${tag}.wav`; ff("-ss", ss.toFixed(4), "-i", file, "-vn", "-af", `apad=whole_dur=${D.toFixed(4)}`, "-t", D.toFixed(4), "-ac", "1", "-ar", "48000", o); return o; }
function silWav(D, tag) { const o = V + `_aud/${tag}.wav`; ff("-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", D.toFixed(4), o); return o; }
// el clip del plan T a 30 fps 1920x1080 en public (con su audio: el foley se toma de acá)
const TP = J(V + "plan_T.json"), TST = { ...(fs.existsSync(V + "T/clips/state.json") ? J(V + "T/clips/state.json") : {}), ...(fs.existsSync(V + "T/clips/state_det.json") ? J(V + "T/clips/state_det.json") : {}) };
function tclip(id) {
  if (!TST[id]) { if (!SKIP.length) throw new Error("falta el clip " + id + " del plan T"); console.log("PRUEBA: falta", id, "→ uso otro"); id = Object.keys(TST).find(k => k.startsWith(id.slice(0, 3))) || Object.keys(TST)[0]; }
  const src = V + "T/clips/" + TST[id].file, o = PVA + `T_${id}.mp4`;
  if (!fs.existsSync(o) || fs.statSync(o).mtimeMs < fs.statSync(src).mtimeMs)
    ff("-i", src, "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=3", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", o);
  return { rel: PV + `T_${id}.mp4`, abs: o, T: TST[id].T };
}

const TL = [], AUD = [], EV = [], LINE = {}; // LINE[id] = segundo global donde empieza ese tramo/clip
let fr = 0; // cuadro global
const F = s => Math.round(s * FPS);
// agrega un bloque de audio de D s y los planos que lo cubren (frames exactos)
function block(D, audio, cuts, id) {
  const nf = F(D), Dx = nf / FPS; if (id) LINE[id] = fr / FPS;
  AUD.push(audio(Dx));
  let f0 = 0; const tot = cuts.reduce((a, c) => a + (c.w || 1), 0); let acc = 0;
  cuts.forEach((c, i) => { acc += c.w || 1; const f1 = i === cuts.length - 1 ? nf : Math.round(nf * acc / tot);
    TL.push({ kind: c.kind || "vid", src: c.src, from: fr + f0, dur: f1 - f0, startFrom: c.ss != null ? F(c.ss) : 0, rate: c.rate, cam: c.cam, tag: c.tag });
    if (i > 0 || c.whoosh) EV.push({ t: (fr + f0) / FPS, sfx: c.sfx || "whoosh" });
    if (c.foley) EV.push({ t: (fr + f0) / FPS, foley: c.foleyFile, ss: c.ss || 0, d: (f1 - f0) / FPS, vol: c.foley, rate: c.rate || 1 });
    f0 = f1; });
  fr += nf;
}
const punchCam = (D, at = 0.5, s = 1.3) => { // saltos de zoom fuertes (se leen como corte, scene>0,3): uno cada ~2,2 s, alternando 1 ↔ s
  const n = Math.max(1, Math.round(D / 2.2) - 1), k = [[0, 1, 0, 0]];
  for (let i = 1; i <= n; i++) { const f = F(D * (n === 1 ? at : i / (n + 1))), z = i % 2 ? [s, -70, 70] : [1, 0, 0], p = k[k.length - 1]; k.push([f, p[1], p[2], p[3]], [f + 1, ...z]); }
  return { keys: k }; };

// ================= TRÁILER =================
{ const a = tclip("t_agua"); // 0-4 s: el chorro destapa las piedras. A normal, B en cámara lenta (rampa), sin voz: foley real
  const DA = 1.6, DB = 2.6;
  LINE.t_agua = 0;
  AUD.push(clipWav(a.abs, 0, DA + DB, "t_agua_foley"));
  TL.push({ kind: "vid", src: a.rel, from: 0, dur: F(DA), startFrom: 0, cam: { keys: [[0, 1.08, 0, 0], [F(DA), 1.02, 0, 0]] }, tag: "t_agua" });
  TL.push({ kind: "vid", src: a.rel, from: F(DA), dur: F(DB), startFrom: F(DA), rate: 0.6, cam: { keys: [[0, 1.02, 0, 0], [F(DB), 1.18, -60, 20]], shakes: [[0, 10]], flash: [0] }, tag: "t_agua_slow" });
  EV.push({ t: DA, sfx: "impact" }); fr = F(DA) + F(DB); }
{ const c = tclip("t_w1"); const sp = speechEnd(c.abs, c.T); // vecino: su audio
  LINE.t_w1 = fr / FPS; const D = Math.min(c.T, sp + 0.25), nf = F(D);
  AUD.push(clipWav(c.abs, 0, nf / FPS, "t_w1")); TL.push({ kind: "vid", src: c.rel, from: fr, dur: nf, startFrom: 0, cam: { ...punchCam(D), whipIn: 6 }, tag: "t_w1" }); EV.push({ t: fr / FPS, sfx: "whoosh" }); fr += nf; }
function hclip(id, D, cam) { const c = tclip(id); return { src: c.rel, ss: 0, cam: cam || (D > 3.6 ? punchCam(D) : undefined), tag: id }; }
function det(id, ss = 0.25, extra = {}) { const c = tclip(id); return { src: c.rel, ss, tag: id, foley: 0.35, foleyFile: c.abs, ...extra }; }
const TD = id => TR[id].d;
block(TD("t_01"), D => tramoWav("t_01", D), [hclip("t_01", TD("t_01"), punchCam(TD("t_01"), 0.3))], "t_01");
block(TD("t_02"), D => tramoWav("t_02", D), [det("t_c1"), det("t_c2"), det("t_c3")], "t_02");
// t_03: prueba del dedo · piedras · ANTES/DESPUÉS (la cortina de agua sobre las dos fotos del mismo encuadre)
fs.copyFileSync(V + "T/anc/" + TP.clips.find(c => c.id === "t_agua").a + ".png", R + "public/img/tfbpiedra/wipe_a.png");
fs.copyFileSync(V + "T/anc/" + TP.clips.find(c => c.id === "t_agua").b + ".png", R + "public/img/tfbpiedra/wipe_b.png");
block(TD("t_03"), D => tramoWav("t_03", D), [det("t_c4"), det("t_c5"), { kind: "still", src: "img/tfbpiedra/wipe_a.png", tag: "wipe", w: 1.3 }], "t_03");
block(TD("t_04"), D => tramoWav("t_04", D), [det("t_c7"), det("t_c8")], "t_04");
block(TD("t_05"), D => tramoWav("t_05", D), [hclip("t_05", TD("t_05"))], "t_05");
block(TD("t_06"), D => tramoWav("t_06", D), [hclip("t_06", TD("t_06"))], "t_06");
{ const D = TD("t_07"), y1 = wordAt("t_07", "y", 0), y2 = wordAt("t_07", "y", 1) - 0.05, c = tclip("t_07");
  block(D, D2 => tramoWav("t_07", D2), [det("t_c10", 0.2, { w: y1 }), det("t_c11", 0.2, { w: y2 - y1 }), { src: c.rel, ss: y2, tag: "t_07", w: D - y2, cam: { keys: [[0, 1.12, 0, 30]] } }], "t_07"); }
// ================= RECETA =================
block(TD("r_01"), D => tramoWav("r_01", D), [hclip("r_01", TD("r_01"))], "r_01");
for (const id of ["r_02", "r_03", "r_04", "r_05", "r_06", "r_07", "r_08"]) {
  const D = TD(id), c = tclip(id);
  block(D, D2 => tramoWav(id, D2), [{ src: c.rel, ss: 0, tag: id, foley: 0.3, foleyFile: c.abs, whoosh: true, cam: fr / FPS < 64 && D > 4 ? punchCam(D) : { keys: [[0, 1, 0, 0], [F(D), 1.08, 0, 0]] } }], id);
}
function speechEnd(file, T) { // fin de la voz en el audio propio del clip (−35 dB bajo el pico)
  const b = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vn", "-ac", "1", "-ar", "16000", "-t", String(T), "-f", "s16le", "-"]);
  const n = Math.floor(b.length / 320); let mx = -99, e = [];
  for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < 160; j++) { const v = b.readInt16LE((i * 160 + j) * 2) / 32768; s += v * v; } const d = 10 * Math.log10(s / 160 + 1e-12); e.push(d); mx = Math.max(mx, d); }
  let k = n - 1; while (k > 0 && e[k] < mx - 35) k--; return (k + 1) * 0.01;
}
// ================= ESCENAS =================
const ORDER = ["S2a", "S2b", "S3a", "S3b", "S3c", "S4", "S5a", "S5b", "S6a", "S6b", "S7", "S8a", "S8b"];
const chap = [["El resultado y la receta completa", 0]];
const CHAP = { S2a: "La base y el marco", S3a: "La mezcla", S4: "El colado", S5a: "El azúcar y el retardante", S6a: "La prueba del punto", S6b: "El lavado", S7: "El curado", S8a: "El piso terminado: ¿resbala?", S8b: "El secreto del momento exacto" };
for (const S of ORDER) {
  if (SKIP.includes(S)) continue;
  const P = J(V + `plan_${S}.json`), mp4 = P.out, base = mp4.replace(/\.mp4$/, "").split("/").pop();
  const tl = J(P.dir + "/timeline_" + base + ".json"), aud = P.dir + "/audio_" + base + ".wav";
  const rel = PV + S + ".mp4", pub = R + "public/" + rel;
  if (!fs.existsSync(pub) || fs.statSync(pub).mtimeMs < fs.statSync(mp4).mtimeMs) ff("-i", mp4, "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", pub);
  const NF = nfr(pub), last = tl[tl.length - 1], want = Math.round((last.vstart + last.vdur) * FPS);
  if (Math.abs(NF - want) > 1) throw new Error(`${S}: ${NF} cuadros vs ${want}`);
  if (CHAP[S]) chap.push([CHAP[S], fr]);
  // partes: S3c se parte en la lámina (entre s3_15 y s3_16)
  const cutAt = S === "S3c" ? tl.find(c => c.id === "s3_16") : null;
  const parts = cutAt ? [[0, Math.round(cutAt.vstart * FPS), "pre"], [Math.round(cutAt.vstart * FPS), NF, "post"]] : [[0, NF, "all"]];
  for (const [f0, f1, pn] of parts) {
    if (pn === "post") { // ---- LÁMINA
      const ids = ["l_01", "l_02", "l_03", "l_04"], D = ids.reduce((a, id) => a + TR[id].d, 0) + 0.3, nf = F(D);
      const o = V + "_aud/LAM.wav"; ff("-ss", TR.l_01.s.toFixed(4), "-to", TR.l_04.e.toFixed(4), "-i", master, "-af", `adelay=300:all=1,apad=whole_dur=${(nf / FPS).toFixed(4)}`, "-t", (nf / FPS).toFixed(4), "-ac", "1", "-ar", "48000", o);
      AUD.push(o); ids.forEach(id => LINE[id] = fr / FPS + 0.3 + (TR[id].s - TR.l_01.s));
      TL.push({ kind: "lam", src: "img/tfbpiedra/lamina.jpg", from: fr, dur: nf, tag: "LAM" }); chap.push(["La ficha completa", fr]); EV.push({ t: fr / FPS, sfx: "paper" }); fr += nf;
    }
    const seg = V + `_aud/${S}_${pn}.wav`; ff("-i", aud, "-ss", (f0 / FPS).toFixed(5), "-t", ((f1 - f0) / FPS).toFixed(5), "-af", `apad=whole_dur=${((f1 - f0) / FPS).toFixed(5)}`, "-ac", "1", "-ar", "48000", seg);
    AUD.push(seg);
    // cámara virtual: salto de zoom a mitad de cada 2º plano hablado largo (corte "de vlog"), nunca en detalles ni sobre FX de lupa
    const keys = [[0, 1, 0, 0]]; let k = 0;
    for (const c of tl) { const a = Math.round(c.vstart * FPS) - f0, b = a + Math.round(c.vdur * FPS); if (a < 0 || b > f1 - f0) continue;
      LINE[c.id] = (fr + a) / FPS + (c.start - c.vstart);
      if (c.detail || !TEXT[c.id] || TXT.flatMap(s => s.lines).find(l => l[0] === c.id)[1] === "w") { if (keys.at(-1)[1] !== 1) keys.push([a, 1, 0, 0]); continue; }
      k++; const m = Math.round((a + b) / 2);
      if (k % 2 === 0 && c.vdur > 4.5) { keys.push([a, 1, 0, 0], [m, 1, 0, 0], [m + 1, 1.15, 0, 45], [b - 1, 1.15, 0, 45], [b, 1, 0, 0]); }
      if (c.detail) EV.push({ t: (fr + a) / FPS, foleyClip: S + ":" + c.id, d: c.vdur, vol: 0.3 });
    }
    for (const c of tl) if (c.detail) { const a = Math.round(c.vstart * FPS) - f0; if (a >= 0 && a < f1 - f0) EV.push({ t: (fr + a) / FPS, foleyClip: S + ":" + c.id, d: c.vdur, vol: 0.3 }); }
    TL.push({ kind: "vid", src: rel, from: fr, dur: f1 - f0, startFrom: f0, cam: { keys: keys.sort((x, y) => x[0] - y[0]) }, tag: S + ":" + pn });
    fr += f1 - f0;
  }
}
const TOTAL = fr;
fs.writeFileSync(V + "_aud/list.txt", AUD.map(a => `file '${a}'\n`).join(""));
ff("-f", "concat", "-safe", "0", "-i", V + "_aud/list.txt", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", V + "voz.wav");
const AD = dur(V + "voz.wav");
console.log("TOTAL", TOTAL, "cuadros =", (TOTAL / FPS).toFixed(2), "s · voz", AD.toFixed(3), "s · Δ", (AD - TOTAL / FPS).toFixed(3));
if (Math.abs(AD - TOTAL / FPS) > 0.08) throw new Error("audio y video no cuadran");
// ---- FX (componentes) anclados a palabras
const at = (id, word, n = 0, off = 0) => { if (LINE[id] == null) throw new Error("línea sin ubicar " + id); return F(LINE[id] + (word ? wordAt(id, word, n) : 0) + off); };
const cueAt = f => TL.find(c => f >= c.from && f < c.from + c.dur);
const FX = [];
for (const x of FXPLAN) {
  if (x.skip || [x.at, x.until].some(a => a && LINE[a[0]] == null)) { if (!SKIP.length) throw new Error("FX sin línea: " + JSON.stringify(x.at)); continue; }
  const from = at(...x.at), to = x.until ? at(...x.until) : from + F(x.dur || 3);
  const fx = { kind: x.kind, from, dur: Math.max(12, to - from), p: typeof x.p === "function" ? x.p({ at, from, wordAt, LINE, F }) : x.p };
  if (["zoom", "freeze"].includes(x.kind)) { const c = cueAt(from); fx.media = { src: c.src, startFrom: (c.startFrom || 0) + Math.round((from - c.from) * (c.rate || 1)), rate: c.rate }; }
  FX.push(fx); if (x.sfx !== null) EV.push({ t: from / FPS, sfx: x.sfx || { zoom: "impact", wipe: "whoosh_big", step: "slam", dial: "tick", layer: "swell", prop: "ticks", errors: "slam", label: "pop", scribble: "marker", qr: "pop", freeze: "shutter" }[x.kind] || "pop" });
}
// lámina: teclas [segundo, cx, cy, escala] (cx, cy en fracción de la imagen 3:2)
const L0 = LINE.l_01 - 0.3, la = (id, w, n = 0) => LINE[id] + wordAt(id, w, n) - L0;
const LAM_KEYS = [[0, 0.5, 0.5, 1], [la("l_01", "arriba") - 0.2, 0.13, 0.55, 2.0], [la("l_02", "despues") - 0.1, 0.36, 0.52, 2.0], [la("l_03", "en") - 0.1, 0.63, 0.55, 1.9],
  [la("l_03", "esquina") + 0.6, 0.62, 0.62, 2.3], [la("l_04", "y") - 0.1, 0.5, 0.9, 1.7], [la("l_04", "desague") + 0.8, 0.5, 0.5, 1]];
const ts = `// GENERADO por vlog/tfbpiedra/mktimeline.mjs — no editar a mano
export type Media = { src: string; startFrom: number; rate?: number };
export type Cue = { kind: "vid" | "still" | "lam"; src: string; from: number; dur: number; startFrom?: number; rate?: number; cam?: any };
export type Fx = { kind: string; from: number; dur: number; p: Record<string, unknown>; media?: Media };
export const TOTAL_FRAMES_TFBPIEDRA = ${TOTAL};
export const AUDIO = "tfbpiedra_mix.m4a";
export const TL: Cue[] = ${JSON.stringify(TL.map(({ tag, ...x }) => x))};
export const FX: Fx[] = ${JSON.stringify(FX)};
export const LAM_KEYS: [number, number, number, number][] = ${JSON.stringify(LAM_KEYS.map(q => q.map(v => +(+v).toFixed(3))))};
`;
fs.writeFileSync(R + "src/tfbpiedra/timeline.gen.ts", ts);
fs.writeFileSync(V + "timeline.json", JSON.stringify({ TOTAL, TL, chap, LINE }, null, 1));
fs.writeFileSync(V + "events.json", JSON.stringify(EV, null, 1));
const assets = [...new Set([...TL.map(x => x.src), ...FX.flatMap(x => [x.media?.src, x.p?.beforeSrc, x.p?.afterSrc, x.p?.qr, x.p?.cover]).filter(Boolean)]), "tfbpiedra_mix.m4a"];
fs.writeFileSync(R + "_tfbpiedra_assets.txt", assets.join("\n") + "\n");
console.log("cortes en el minuto 1:", TL.filter(c => c.from < 1800).length + FX.filter(x => x.from < 1800 && x.kind === "zoom").length, "· planos >4 s en min 1:", TL.filter(c => c.from < 1800 && c.dur > 120 && !(c.cam?.keys || []).some(k => k[1] !== 1)).map(c => c.tag || c.src).join(" ") || "ninguno");
console.log("capítulos:", chap.map(([n, f]) => `${Math.floor(f / FPS / 60)}:${String(Math.floor(f / FPS % 60)).padStart(2, "0")} ${n}`).join(" | "));
