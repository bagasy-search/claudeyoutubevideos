// agnes_vlog.mjs — "VLOG CONTINUO": el presentador HACIENDO algo en su set, hablando con SU voz, en tomas
// continuas sin cortes. Validado 23-sep-2026 (1:02 Federer mascarilla de arroz, 7 clips en 7 min, $0 + ~$0,10 de anclas).
// Memoria: reference_agnes_modelos_25_sep2026.md · skill agnes-broll § VLOG CONTINUO.
//
//   node scripts/agnes_vlog.mjs <plan.json> anclas   → gpt-image-2 LOW edits, K(n) desde K(n-1) + recorte de cara SIEMPRE
//   node scripts/agnes_vlog.mjs <plan.json> clips    → agnes-video-2.5-flash `reference`, TODOS en paralelo, ancla→ancla
//   node scripts/agnes_vlog.mjs <plan.json> check    → whisper-1 por clip vs texto esperado + costuras (dif. media /255)
//   node scripts/agnes_vlog.mjs <plan.json> armar    → une con fundido 0,1 s; audio = tramos (o audio propio del clip)
//   (clips/check aceptan ids: `clips c4 c7` regenera sólo esos, con sufijo r)
//
// plan.json:
// { "dir": "D:/…/vlog_<slug>",                     // salida (anc/, clips/)
//   "face": "…/ref_face.png",                        // RECORTE de la cara del presentador (no la foto entera: se cuelan sus objetos)
//   "k0_from": "…/ref_presentador_en_su_set.png",    // foto base del set (K0 se edita desde acá)
//   "extra": { "W": "…/cara_señora.png", "COVER": "…/portada.jpg" },   // refs con nombre, usables en anclas y clips
//   "anchors": [ { "id":"K0", "from":["k0"], "prompt":"…" }, { "id":"K1", "from":["K0"], "prompt":"…" }, { "id":"K5", "from":["K4","W","COVER"], "prompt":"…" } ],
//   "clips": [ { "id":"c1", "a":"K0", "b":"K1", "audio":"…/tramo1.wav", "text":"lo que dice", "action":"qué hace (inglés)" },
//              { "id":"c5", "a":"K4", "b":"K5", "secs":10, "line":"diálogo literal", "voice":"in Spanish with a warm Mexican accent, the lively voice of a 76-year-old grandmother", "refs":["W"], "action":"…" } ],
//   "out": "…/vlog_<slug>.mp4" }
// · clip con `audio` → se rellena con silencio hasta segundo ENTERO (el ancla final cae justo en la costura) y va como audios[].
// · clip con `line` (personaje secundario SIN audio ref) → el modelo dice el texto literal con ese acento; en el armado suena SU audio.
// · Límites 2.5-flash: 4-12 s, sólo 720P, sin fps, cola GLOBAL (`video_queue_full` con todas las claves) → reintento cada ~30 s.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [, , planPath, fase, ...soloIds] = process.argv;
if (!planPath || !["anclas", "clips", "check", "armar"].includes(fase)) { console.error("uso: node scripts/agnes_vlog.mjs <plan.json> anclas|clips|check|armar [ids…]"); process.exit(1); }
const P = JSON.parse(fs.readFileSync(planPath, "utf8"));
const ENVF = new URL("../.env", import.meta.url);
const env = Object.fromEntries(fs.readFileSync(ENVF, "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#"))
  .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = (env.AGNES_KEYS || env.AGNES_KEY).split(",").map(s => s.trim()).filter(Boolean);
const B = "https://apihub.agnes-ai.com/v1", ROOT = "https://apihub.agnes-ai.com", MODEL = "agnes-video-2.5-flash";
const DIR = P.dir.replace(/\\/g, "/").replace(/\/?$/, "/"), ANC = DIR + "anc/", CL = DIR + "clips/";
fs.mkdirSync(ANC, { recursive: true }); fs.mkdirSync(CL, { recursive: true });
let k = Math.floor(Math.random() * KS.length); const key = () => KS[(k++) % KS.length];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const mime = f => f.endsWith(".png") ? "image/png" : /\.(mp3)$/.test(f) ? "audio/mpeg" : /\.wav$/.test(f) ? "audio/wav" : "image/jpeg";
const uri = f => `data:${mime(f)};base64,` + fs.readFileSync(f).toString("base64");
const refPath = n => n === "k0" ? P.k0_from : /^K\d+$/.test(n) ? ANC + n + ".png" : (P.extra || {})[n] || n;
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

const LIGHT = " BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic, not retouched.";
const IDENT = " IDENTITY: the presenter must have EXACTLY the face of the man/woman in the LAST input image (a close-up of the real face): same face shape, eyes, nose, eyebrows, hair and beard, same age — copy that face, do not let it drift, do not make them younger or more attractive. The last image is only for the face; the scene comes from the first image. Do NOT add objects that are not described.";
const LOOK = " Ultra realistic casual home video, handheld phone footage with small natural shakes, BRIGHT correctly exposed image, big soft daylight from the window, neutral white balance, no grading, no vignette, no dark moody look; real skin with visible pores and fine lines, not smooth, not plastic; natural hands; nothing polished, no music.";
const SE = "The video STARTS EXACTLY on the first reference image and ENDS EXACTLY on the second reference image: the very first frame is the first image and the very last frame is the second image — same place, same framing, same light, same objects in the same places; in between, one continuous take without cutting or changing angle. The third reference image is only the presenter's real face: keep exactly that face the whole time. ";

// ---------- anclas ----------
async function edit(out, prompt, inputs) {
  if (fs.existsSync(out)) return log("ya", path.basename(out));
  for (let t = 0, fails = 0; fails < 4 && t < 200; t++) { // rate limit de la org (input-images/min) → esperar sin contar como fallo
    const fd = new FormData();
    fd.append("model", "gpt-image-2"); fd.append("quality", "low"); fd.append("size", "1536x1024"); fd.append("prompt", prompt);
    for (const f of inputs) fd.append("image[]", new Blob([fs.readFileSync(f)], { type: mime(f) }), path.basename(f));
    const j = await (await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd })).json().catch(() => ({}));
    const b = j?.data?.[0]?.b64_json;
    if (b) { const raw = out.replace(".png", "_raw.png"); fs.writeFileSync(raw, Buffer.from(b, "base64")); ff("-i", raw, "-vf", "crop=1536:864:0:24", out); return log("OK", path.basename(out)); }
    const rl = /rate limit/i.test(JSON.stringify(j)); if (!rl) fails++;
    log(rl ? "rate-limit, espero" : "retry", path.basename(out), rl ? "" : JSON.stringify(j).slice(0, 160)); await sleep(rl ? 20000 + Math.random() * 25000 : 15000);
  }
  throw new Error("falló " + out);
}
if (fase === "anclas") {
  for (const a of P.anchors) {
    const inputs = a.from.map(refPath); inputs.push(P.face);
    await edit(ANC + a.id + ".png", a.prompt + (a.id === "K0" ? "" : " Everything else identical.") + IDENT + LIGHT, inputs);
  }
  log("anclas listas → mirá la hoja: identidad igual en todas, sin objetos colados");
}

// ---------- clips ----------
function tramo(c) { // audio rellenado a segundo entero → mp3
  const T = Math.min(12, Math.max(4, Math.ceil(dur(c.audio) + 0.15)));
  const mp3 = CL + c.id + "_tramo.mp3"; ff("-i", c.audio, "-af", `apad=whole_dur=${T}`, "-t", String(T), "-ac", "1", "-ar", "44100", "-b:a", "160k", mp3);
  return { T, mp3 };
}
async function gen(id, body) {
  let vid;
  for (let t = 0; t < 200 && !vid; t++) {
    const j = await (await fetch(B + "/videos", { method: "POST", headers: { Authorization: "Bearer " + key(), "Content-Type": "application/json" }, body: JSON.stringify({ model: MODEL, size: "720P", aspect_ratio: "16:9", ...body }) })).json().catch(() => ({}));
    vid = j.video_id || j.id;
    if (!vid) { const m = JSON.stringify(j); if (!/queue|rate/i.test(m)) { log("REJECT", id, m.slice(0, 200)); return; } await sleep(25000 + Math.random() * 10000); }
  }
  if (!vid) return log("GAVE UP", id);
  log("en cola", id);
  const t0 = Date.now();
  while (Date.now() - t0 < 40 * 60e3) {
    await sleep(15000);
    const g = await (await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}&model_name=${MODEL}`, { headers: { Authorization: "Bearer " + key() } })).json().catch(() => ({}));
    if (g.status === "completed" && g.url) { fs.writeFileSync(CL + id + ".mp4", Buffer.from(await (await fetch(g.url)).arrayBuffer())); return log("OK", id, Math.round((Date.now() - t0) / 1000) + "s"); }
    if (/fail|error|cancel/i.test(g.status || "")) return log("FAIL", id, JSON.stringify(g).slice(0, 200));
  }
  log("TIMEOUT", id);
}
// semáforo ENTRE procesos (varias escenas en paralelo comparten la cola global): VLOG_SLOTS_DIR + VLOG_MAX (default 12)
const SLOTS = process.env.VLOG_SLOTS_DIR, MAXS = Number(process.env.VLOG_MAX || 12);
async function acquire() {
  if (!SLOTS) return () => {};
  fs.mkdirSync(SLOTS, { recursive: true });
  for (;;) {
    for (let i = 0; i < MAXS; i++) {
      const f = path.join(SLOTS, "slot" + i);
      try { fs.writeFileSync(f, String(process.pid), { flag: "wx" }); return () => { try { fs.unlinkSync(f); } catch {} }; } catch {}
    }
    await sleep(5000 + Math.random() * 5000);
  }
}
const state = () => fs.existsSync(CL + "state.json") ? JSON.parse(fs.readFileSync(CL + "state.json", "utf8")) : {};
if (fase === "clips") {
  const st = state(), sel = P.clips.filter(c => !soloIds.length || soloIds.includes(c.id));
  await Promise.all(sel.map((c, i) => sleep(i * 3000).then(async () => {
    const out = soloIds.length ? c.id + "r" + Date.now().toString(36).slice(-3) : c.id;
    const imgs = [uri(refPath(c.a)), uri(refPath(c.b)), uri(P.face), ...(c.refs || []).map(n => uri(refPath(n)))];
    let body, T;
    if (c.kf) { // plano de DETALLE sin habla: keyframe clava primer y último cuadro; la voz del tramo suena encima en el armado
      const tr = tramo(c); T = tr.T;
      body = { mode: "keyframe", seconds: String(T), first_frame: uri(refPath(c.a)), last_frame: uri(refPath(c.b)),
        prompt: "The video starts exactly on the first frame and ends exactly on the last frame, one continuous close-up take without cutting or changing angle. " + c.action + LOOK + " Nobody speaks, no voices, only quiet natural room sounds." };
    } else if (c.audio) {
      const tr = tramo(c); T = tr.T;
      body = { mode: "reference", seconds: String(T), images: imgs, audios: [uri(tr.mp3)],
        prompt: SE + "The presenter is the one speaking: the voice and every word are exactly the reference audio, lips perfectly synced; do not add, repeat or change any word — the audio is the only speech. " + c.action + LOOK + " No other voices." };
    } else {
      T = c.secs;
      body = { mode: "reference", seconds: String(T), images: imgs,
        prompt: SE + `The person speaking is ${c.who || "the other person (last reference image is their face)"}, ${c.voice}, lips perfectly synced, saying exactly: "${c.line}" Nobody else speaks. ` + c.action + LOOK };
    }
    const rel = await acquire();
    try { await gen(out, body); } finally { rel(); }
    if (fs.existsSync(CL + out + ".mp4")) { const s = state(); s[c.id] = { file: out + ".mp4", T, own: !c.audio }; fs.writeFileSync(CL + "state.json", JSON.stringify(s, null, 1)); }
  })));
  log("clips listos → corré `check`");
}

// ---------- check ----------
if (fase === "check") {
  const st = state(); const fr = (f, t, o) => { ff("-ss", t.toFixed(3), "-i", f, "-frames:v", "1", "-vf", "scale=320:180,format=gray", "-f", "rawvideo", o); return fs.readFileSync(o); };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  let prevEnd = null;
  for (const c of P.clips) {
    const s = st[c.id]; if (!s) { log("FALTA", c.id); prevEnd = null; continue; }
    const f = CL + s.file, wav = CL + c.id + "_chk.wav";
    if (c.kf) { const st0 = fr(f, 0, CL + "_s.raw"); let costura = ""; if (prevEnd) { let d = 0; for (let i = 0; i < st0.length; i++) d += Math.abs(st0[i] - prevEnd[i]); costura = ` · costura con el anterior ${(d / st0.length).toFixed(1)}/255 (corte a detalle)`; } prevEnd = fr(f, Math.min(s.T, dur(f)) - 0.1, CL + "_e.raw"); log(`${c.id} [${s.file}] detalle (keyframe, sin habla)` + costura); continue; }
    ff("-i", f, "-vn", "-ac", "1", "-ar", "16000", "-t", String(s.T), wav);
    const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", P.lang || "es"); fd.append("response_format", "text");
    fd.append("file", new Blob([fs.readFileSync(wav)], { type: "audio/wav" }), "a.wav");
    let txt = "(timeout)";
    for (let t = 0; t < 3 && txt === "(timeout)"; t++) try { txt = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd, signal: AbortSignal.timeout(45000) })).text(); } catch (e) { log("whisper timeout, reintento", c.id); }
    const esperado = c.text || c.line || "";
    const NUM = /^(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cuarenta|cincuenta|cien)$/;
    const wa = norm(esperado).split(" ").filter(w => w && !NUM.test(w)), b = norm(txt).split(" ").filter(w => w && !NUM.test(w));
    const a = new Set(wa), extra = b.filter(w => !a.has(w)), falta = [...a].filter(w => !b.includes(w));
    const rep = b.length - wa.length; // palabras de más aunque existan (frases repetidas)
    const start = fr(f, 0, CL + "_s.raw"), end = fr(f, Math.min(s.T, dur(f)) - 0.1, CL + "_e.raw");
    let costura = ""; if (prevEnd) { let d = 0; for (let i = 0; i < start.length; i++) d += Math.abs(start[i] - prevEnd[i]); costura = ` · costura con el anterior ${(d / start.length).toFixed(1)}/255`; }
    prevEnd = end;
    log(`${c.id} [${s.file}] ${extra.length + falta.length > 2 || rep > 2 || txt === "(timeout)" ? "⛔ REGENERAR" : rep > 0 ? "⚠️ revisar" : "ok"} · dice: "${txt.trim()}"` + (extra.length ? ` · de más: ${extra.join(" ")}` : "") + (falta.length ? ` · falta: ${falta.join(" ")}` : "") + (rep > 0 ? ` · ${rep} palabra(s) de más (¿repitió?)` : "") + costura);
  }
  log("⛔ = el modelo cambió palabras → `clips <id>` y volvé a `check`. Costura >30 → mirá esos 2 cuadros.");
}

// ---------- armar ----------
if (fase === "armar") {
  const st = state(), X = 0.1, C = P.clips.map(c => ({ ...c, ...st[c.id] }));
  if (C.some(c => !c.file)) throw new Error("faltan clips");
  const parts = C.map((c, i) => { const o = CL + `_aud${i}.wav`; ff("-i", c.own ? CL + c.file : c.audio, "-vn", "-t", String(c.T), "-af", `apad=whole_dur=${c.T}`, "-ac", "1", "-ar", "48000", o); return o; });
  fs.writeFileSync(CL + "_aud.txt", parts.map(p => `file '${path.basename(p)}'\n`).join(""));
  ff("-f", "concat", "-safe", "0", "-i", CL + "_aud.txt", "-c", "copy", CL + "_audio_total.wav");
  const ins = [], fl = [];
  C.forEach((c, i) => { const L = c.T + (i < C.length - 1 ? X : 0); ins.push("-t", L.toFixed(3), "-i", CL + c.file);
    fl.push(`[${i}:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=0.5,trim=duration=${L.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`); });
  let prev = "v0", off = 0;
  for (let i = 1; i < C.length; i++) { off += C[i - 1].T; fl.push(`[${prev}][v${i}]xfade=transition=fade:duration=${X}:offset=${off.toFixed(3)}[x${i}]`); prev = `x${i}`; }
  ff(...ins, "-i", CL + "_audio_total.wav", "-filter_complex", fl.join(";"), "-map", `[${prev}]`, "-map", `${C.length}:a`,
    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", P.out);
  log("OK", P.out, dur(P.out).toFixed(2) + "s (30 fps, 1920x1080) — hoja de contactos antes de usarlo");
}
