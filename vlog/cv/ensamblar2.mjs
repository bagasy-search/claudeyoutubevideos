// ENSAMBLADO HÍBRIDO del Vaquero (formato 10-oct: agnes NUNCA frena): cada segmento de segs.json ocupa EXACTAMENTE su tramo
// del máster [s.s, siguiente.s) a 30 fps, corte seco. Prioridad por segmento:
//   AVATAR (avatar.json, manda: gancho/cierre) → STOCK → broll/<slug>_st/<id>_1 + _2 · DET → det/clips/<id>.mp4 · AVATAR (avatar.json) → reel30 InfiniteTalk con lag+lipLead
//   hablado con clip agnes YA hecho (escena armada → out.mp4; si no, clips/<id>.mp4 crudo + la foto para el resto)
//   hablado sin clip → la foto K_i de ese segmento (ancla = lo que se dice) con Ken Burns (4 movimientos alternados).
// Salida igual que ensamblar.mjs: vid/<slug>/vlog_raw.mp4 (mudo) + edl.json + det_bed.wav (sonido real DET + clips agnes).
//   SLUG=x [LIPLEAD=0.10] node vlog/cv/ensamblar2.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process"; import { pathToFileURL } from "node:url";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`, FPS = 30, LIP = +(process.env.LIPLEAD ?? 0.10);
const { STOCK, DET } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8"));
const MASTER = R + `public/${S}.wav`, ST = R + `public/broll/${S}_st/`, TMP = D + "_ens2/", OUTD = R + `public/vid/${S}/`;
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(OUTD, { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: ["ignore", "inherit", "inherit"] });
const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim();
const total = dur(MASTER);
const TL = {}, ANC = {};
for (const sc of new Set(segs.map((s) => s.sc))) {
  const f = D + `${sc}/timeline_out.json`; if (fs.existsSync(f)) for (const t of JSON.parse(fs.readFileSync(f, "utf8"))) TL[t.id] = { ...t, out: D + `${sc}/out.mp4` };
  const p = D + `${sc}/plan.json`; if (fs.existsSync(p)) for (const c of JSON.parse(fs.readFileSync(p, "utf8")).clips) ANC[c.id] = D + `${sc}/anc/${c.b}.png`;
}
const AVIDS = new Set(fs.existsSync(D + "avatar.json") ? JSON.parse(fs.readFileSync(D + "avatar.json", "utf8")).ids : []);
const AVW = fs.existsSync(D + "avatar/avwin.json") ? JSON.parse(fs.readFileSync(D + "avatar/avwin.json", "utf8")).win : [];
const REEL = R + `public/avatar_clips/${S}/reel30.mp4`, HAVE_REEL = fs.existsSync(REEL);
const V = ["-r", String(FPS), "-fps_mode", "cfr", "-an", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];
const POST = (n, slow = 1) => `${slow !== 1 ? `setpts=PTS/${slow.toFixed(4)},` : ""}fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=3,trim=end_frame=${n},setpts=PTS-STARTPTS`;
const KB = (n, k) => { const N = Math.max(2, n), p = `on/${N - 1}`;
  const m = [[`1+0.10*${p}`, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"], [`1.10-0.10*${p}`, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"],
    ["1.08", `(iw-iw/zoom)*${p}`, "ih/2-(ih/zoom/2)"], ["1.08", `(iw-iw/zoom)*(1-${p})`, "ih/2-(ih/zoom/2)"]][k % 4];
  return `scale=3840:2160:flags=lanczos,zoompan=z='${m[0]}':x='${m[1]}':y='${m[2]}':d=${N}:s=1920x1080:fps=${FPS},setsar=1,trim=end_frame=${n},setpts=PTS-STARTPTS`; };
const edl = [], falta = [], parts = []; let nkb = 0;
const piece = (args, tag) => { const o = TMP + `${String(parts.length).padStart(4, "0")}_${tag}.mp4`; if (!fs.existsSync(o)) ff(...args, ...V, o); parts.push(o); return o; };
const still = (img, n, tag) => piece(["-i", img, "-vf", KB(n, nkb++), "-frames:v", String(n)], tag);
segs.forEach((s, i) => {
  const f0 = i === 0 ? 0 : Math.round(s.s * FPS), f1 = i === segs.length - 1 ? Math.round(total * FPS) : Math.round(segs[i + 1].s * FPS), n = f1 - f0, d = n / FPS;
  if (AVIDS.has(s.id)) {
    const w = AVW.find((w) => w.ids.includes(s.id)); if (!w || !HAVE_REEL) { falta.push(s.id + " (avatar)"); return; }
    const sf = Math.max(0, f0 / FPS - w.ms + w.off + (w.lag || 0) + LIP);
    piece(["-ss", sf.toFixed(4), "-i", REEL, "-vf", POST(n), "-frames:v", String(n)], s.id + "_av"); edl.push({ id: s.id, kind: "avatar", f0, n, sf: +sf.toFixed(3) });
  } else if (STOCK[s.id]) {
    const a = ST + `${s.id}_1.mp4`, b = ST + `${s.id}_2.mp4`, have = [a, b].filter((x) => fs.existsSync(x));
    if (!have.length) { if (ANC[s.id]) { still(ANC[s.id], n, s.id + "_kb"); edl.push({ id: s.id, kind: "img", f0, n, nota: "stock faltante" }); } else falta.push(s.id + " (stock)"); return; }
    const na = have.length === 2 ? Math.round(n / 2) : n;
    have.forEach((x, k) => { const nn = k === 0 ? na : n - na, L = dur(x), slow = Math.min(1, (L - 0.05) / (nn / FPS));
      piece(["-i", x, "-vf", POST(nn, slow), "-frames:v", String(nn)], `${s.id}_${k + 1}`); edl.push({ id: s.id, kind: "stock", file: x.replace(R + "public/", ""), f0: f0 + (k ? na : 0), n: nn, slow: slow < 1 ? +slow.toFixed(3) : undefined }); });
  } else if (DET[s.id] && fs.existsSync(D + `det/clips/${s.id}.mp4`)) {
    const x = D + `det/clips/${s.id}.mp4`, L = dur(x), slow = Math.min(1, (L - 0.05) / d);
    piece(["-i", x, "-vf", POST(n, slow), "-frames:v", String(n)], s.id); edl.push({ id: s.id, kind: "det", file: x, f0, n, slow: slow < 1 ? +slow.toFixed(3) : undefined, L });
  } else if (TL[s.id]) {
    const t = TL[s.id]; piece(["-ss", t.vstart.toFixed(4), "-i", t.out, "-vf", POST(n), "-frames:v", String(n)], s.id); edl.push({ id: s.id, kind: "talk", sc: s.sc, f0, n });
  } else {
    if (!ANC[s.id] || !fs.existsSync(ANC[s.id])) { falta.push(s.id + " (sin foto)"); return; }
    const cl = D + `${s.sc}/clips/${s.id}.mp4`;
    if (fs.existsSync(cl)) { const L = dur(cl), nc = Math.min(n, Math.floor((L - 0.05) * FPS));
      piece(["-i", cl, "-vf", POST(nc), "-frames:v", String(nc)], s.id + "_ag"); edl.push({ id: s.id, kind: "agnes", file: cl, f0, n: nc });
      if (n - nc > 0) { still(ANC[s.id], n - nc, s.id + "_kb"); edl.push({ id: s.id, kind: "img", f0: f0 + nc, n: n - nc }); } }
    else { still(ANC[s.id], n, s.id + "_kb"); edl.push({ id: s.id, kind: "img", img: ANC[s.id].replace(D, ""), f0, n }); }
  }
});
if (falta.length) { console.log("⛔ FALTAN", falta.length + ":", falta.join(" · ")); process.exit(2); }
fs.writeFileSync(D + "edl.json", JSON.stringify(edl, null, 1));
fs.writeFileSync(TMP + "list.txt", parts.map((p) => `file '${p}'\n`).join(""));
const OUT = OUTD + "vlog_raw.mp4"; ff("-f", "concat", "-safe", "0", "-i", TMP + "list.txt", "-c", "copy", "-movflags", "+faststart", OUT);
// sonido REAL (DET + clips agnes), cada uno en su lugar; el resto silencio. Los clips agnes hablados traen voz → sólo DET.
const dets = edl.filter((e) => e.kind === "det"), ins = [], fl = [];
dets.forEach((e, k) => { ins.push("-i", e.file); const at = e.slow ? `atempo=${Math.max(0.5, e.slow).toFixed(4)},` : "";
  fl.push(`[${k}:a]${at}atrim=0:${(e.n / FPS).toFixed(4)},afade=t=in:d=0.15,afade=t=out:st=${(e.n / FPS - 0.25).toFixed(3)}:d=0.25,adelay=${Math.round(e.f0 / FPS * 1000)}:all=1[d${k}]`); });
if (dets.length) { fl.push(`${dets.map((_, k) => `[d${k}]`).join("")}amix=inputs=${dets.length}:normalize=0,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[o]`);
  fs.writeFileSync(TMP + "det_graph.txt", fl.join(";\n")); ff(...ins, "-/filter_complex", TMP + "det_graph.txt", "-map", "[o]", "-ac", "2", "-ar", "48000", D + "det_bed.wav"); }
const nfr = +execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", OUT]).toString().trim();
const k = (x) => edl.filter((e) => e.kind === x).reduce((a, e) => a + e.n, 0) / FPS, pc = (x) => (100 * k(x) / total).toFixed(1);
console.log(`MEDIDO ensamblado2: cuadros ${nfr}/${Math.round(total * FPS)}${nfr === Math.round(total * FPS) ? " ✓" : " ⛔ NO COINCIDEN"} · avatar ${k("avatar").toFixed(0)}s ${pc("avatar")}% · stock ${pc("stock")}% · det ${pc("det")}% · agnes ${pc("agnes")}%+${pc("talk")}% · fotos KB ${k("img").toFixed(0)}s ${pc("img")}%`);
