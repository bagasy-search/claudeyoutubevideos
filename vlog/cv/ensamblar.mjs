// ENSAMBLADO GLOBAL del VLOG Vaquero: cada segmento de segs.json ocupa EXACTAMENTE su tramo de la voz máster
// [s.s, siguiente.s) en cuadros de 30 fps (sin deriva), con corte seco entre segmentos:
//   hablado → su pedazo del out.mp4 de la escena (timeline_out.json: vstart) · DET → det/clips/<id>.mp4 desde 0
//   STOCK   → public/broll/<slug>_st/<id>_1 + _2 (mitad y mitad; si falta uno, el otro entero, en cámara lenta si no alcanza)
// Salida: vid/<slug>/vlog_raw.mp4 (mudo) + vlog/<slug>/edl.json + vlog/<slug>/det_bed.wav (sonido REAL de los DET en su lugar,
// para la mezcla). El audio de los clips hablados NO se usa (es la voz otra vez).
//   SLUG=x node vlog/cv/ensamblar.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process"; import { pathToFileURL } from "node:url";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`, FPS = 30;
const { STOCK, DET } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8"));
const MASTER = R + `public/${S}.wav`, ST = R + `public/broll/${S}_st/`, TMP = D + "_ens/", OUTD = R + `public/vid/${S}/`;
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(OUTD, { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: ["ignore", "inherit", "inherit"] });
const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim();
const total = dur(MASTER);
const TL = {}; for (const sc of new Set(segs.map((s) => s.sc))) { const f = D + `${sc}/timeline_out.json`; if (fs.existsSync(f)) for (const t of JSON.parse(fs.readFileSync(f, "utf8"))) TL[t.id] = { ...t, out: D + `${sc}/out.mp4` }; }
const V = ["-r", String(FPS), "-fps_mode", "cfr", "-an", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];
const POST = (n, slow = 1) => `${slow !== 1 ? `setpts=PTS/${slow.toFixed(4)},` : ""}fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=3,trim=end_frame=${n},setpts=PTS-STARTPTS`;
const edl = [], falta = [], parts = [];
segs.forEach((s, i) => {
  const f0 = i === 0 ? 0 : Math.round(s.s * FPS), f1 = i === segs.length - 1 ? Math.round(total * FPS) : Math.round(segs[i + 1].s * FPS), n = f1 - f0, d = n / FPS;
  const piece = (src, ss, nn, tag, slow = 1) => { const o = TMP + `${String(parts.length).padStart(4, "0")}_${tag}.mp4`;
    if (!fs.existsSync(o)) ff("-ss", ss.toFixed(4), "-i", src, "-vf", POST(nn, slow), "-frames:v", String(nn), ...V, o);
    parts.push(o); return o; };
  if (STOCK[s.id]) {
    const a = ST + `${s.id}_1.mp4`, b = ST + `${s.id}_2.mp4`, have = [a, b].filter((x) => fs.existsSync(x));
    if (!have.length) { falta.push(s.id + " (stock)"); return; }
    const na = have.length === 2 ? Math.round(n / 2) : n;
    have.forEach((x, k) => { const nn = k === 0 ? na : n - na, L = dur(x), slow = Math.min(1, (L - 0.05) / (nn / FPS));
      piece(x, 0, nn, `${s.id}_${k + 1}`, slow); edl.push({ id: s.id, kind: "stock", file: x.replace(R + "public/", ""), f0: f0 + (k ? na : 0), n: nn, slow: slow < 1 ? +slow.toFixed(3) : undefined }); });
  } else if (DET[s.id]) {
    const x = D + `det/clips/${s.id}.mp4`; if (!fs.existsSync(x)) { falta.push(s.id + " (det)"); return; }
    const L = dur(x), slow = Math.min(1, (L - 0.05) / d);
    piece(x, 0, n, s.id, slow); edl.push({ id: s.id, kind: "det", file: x, f0, n, slow: slow < 1 ? +slow.toFixed(3) : undefined, L });
  } else {
    const t = TL[s.id]; if (!t) { falta.push(s.id + " (hablado: falta armar de " + s.sc + ")"); return; }
    piece(t.out, t.vstart, n, s.id); edl.push({ id: s.id, kind: "talk", sc: s.sc, f0, n, vdur: t.vdur, diff: +(t.vdur - d).toFixed(3) });
  }
});
if (falta.length) { console.log("⛔ FALTAN", falta.length + ":", falta.join(" · ")); process.exit(2); }
fs.writeFileSync(D + "edl.json", JSON.stringify(edl, null, 1));
fs.writeFileSync(TMP + "list.txt", parts.map((p) => `file '${p}'\n`).join(""));
const OUT = OUTD + "vlog_raw.mp4"; ff("-f", "concat", "-safe", "0", "-i", TMP + "list.txt", "-c", "copy", "-movflags", "+faststart", OUT);
// sonido real de los DET, cada uno en su lugar (mismo slow → atempo), el resto silencio
const dets = edl.filter((e) => e.kind === "det"), ins = [], fl = [];
dets.forEach((e, k) => { ins.push("-i", e.file); const at = e.slow ? `atempo=${Math.max(0.5, e.slow).toFixed(4)},` : "";
  fl.push(`[${k}:a]${at}atrim=0:${(e.n / FPS).toFixed(4)},afade=t=in:d=0.15,afade=t=out:st=${(e.n / FPS - 0.25).toFixed(3)}:d=0.25,adelay=${Math.round(e.f0 / FPS * 1000)}:all=1[d${k}]`); });
if (dets.length) { fl.push(`${dets.map((_, k) => `[d${k}]`).join("")}amix=inputs=${dets.length}:normalize=0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[o]`);
  fs.writeFileSync(TMP + "det_graph.txt", fl.join(";\n")); ff(...ins, "-/filter_complex", TMP + "det_graph.txt", "-map", "[o]", "-ac", "2", "-ar", "48000", D + "det_bed.wav"); }
const nfr = +execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", OUT]).toString().trim();
const k = (x) => edl.filter((e) => e.kind === x).reduce((a, e) => a + e.n, 0) / FPS;
console.log(`MEDIDO ensamblado: ${OUT} · cuadros ${nfr}/${Math.round(total * FPS)}${nfr === Math.round(total * FPS) ? " ✓" : " ⛔ NO COINCIDEN"} · hablado ${k("talk").toFixed(1)}s · det ${k("det").toFixed(1)}s · stock ${k("stock").toFixed(1)}s = ${(100 * k("stock") / total).toFixed(1)}% · desfasados >0,15 s: ${edl.filter((e) => e.kind === "talk" && Math.abs(e.diff) > 0.15).map((e) => e.id + "@" + e.diff).join(" ") || "-"}`);
