// agnes_kf_sonido.mjs — PLANO DETALLE keyframe first→last con el SONIDO REAL de agnes-video-2.5-flash (Claudio Cocina, 10-oct-2026).
// Igual que agnes_keyframe_trans.mjs pero: seconds = ceil(dur) entre 4 y 12 (por par: "dur"), velocidad 1x (no se estira) y se
// GUARDA el audio del clip (hervor, chisporroteo) salvo que whisper-1 encuentre VOZ inventada → se mutea. GENÉRICO: nada por slug.
//   node scripts/agnes_kf_sonido.mjs <pares.json> <outDir> [--force id1,id2]
//   pares = [{ "id": "k01", "first": "<png>", "last": "<png>", "prompt": "...", "dur": 7.25 }, ...]   (sin "last" = i2v sólo desde el 1er cuadro:
//   agnes_img_pro no sostiene el encuadre entre a y b, y un par desparejo = la cámara "viaja"; medido 10-oct)
// Salidas: <outDir>/<id>.mp4 (1920x1080 30 fps, audio AAC o mudo, dura `seconds`) · _sheet.jpg · _report.json (audio: ok|voz-muteado)
import fs from "node:fs";
import path from "node:path";
import { agnesSubmit } from "../factory/lib/agnes_pool.mjs";
import { execFileSync, spawnSync } from "node:child_process";

const [LIST, OUT, SEG0] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!LIST || !OUT) { console.error("uso: node scripts/agnes_keyframe_trans.mjs <pares.json> <outDir> [--force id1,id2]"); process.exit(1); }
const FORCE = new Set((process.argv.includes("--force") ? process.argv[process.argv.indexOf("--force") + 1] : "").split(",").filter(Boolean));
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }
const B = "https://apihub.agnes-ai.com/v1", ROOT = "https://apihub.agnes-ai.com", MODEL = "agnes-video-2.5-flash";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(path.join(OUT, "_raw"), { recursive: true });
const log = (...a) => { const s = `[${new Date().toISOString().slice(11, 19)}] ` + a.join(" "); console.log(s); fs.appendFileSync(path.join(OUT, "_log.txt"), s + "\n"); };

// PNG 1280x720 exacto (lo que agnes espera)
const prep = (f, id, tag) => {
  const dst = path.join(OUT, "_raw", `${id}_${tag}.png`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-vf", "scale=1280:720:flags=lanczos", "-frames:v", "1", dst]);
  return dst;
};
const uri = (f) => "data:image/png;base64," + fs.readFileSync(f).toString("base64");

async function submit(j) {
  // envío con la RESERVA DE CLAVES COMPARTIDA (factory/lib/agnes_pool.mjs): 1 envío/min por clave entre TODOS los procesos
  const body = { model: MODEL, mode: "keyframe", prompt: j.prompt, seconds: String(Math.min(12, Math.max(4, Math.ceil(j.dur || 4)))), size: "720P", aspect_ratio: "16:9", first_frame: uri(j._first), ...(j._last ? { last_frame: uri(j._last) } : {}) };
  try {
    const { vid, key } = await agnesSubmit(body, { tag: "keyframe " + j.id });
    const ki = KS.indexOf(key);   // el estado guarda el índice: la consulta va con la MISMA clave
    log(j.id, "enviado", vid, "clave", ki); return { vid, ki };
  } catch (e) { log(j.id, "rechazo", String(e.message).slice(0, 160)); return null; }
}
async function poll(j, vid, ki) {
  const t0 = Date.now();
  for (;;) {
    await sleep(15000);
    try {
      const s = await (await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}&model_name=${MODEL}`, { headers: { Authorization: "Bearer " + KS[ki] }, signal: AbortSignal.timeout(45000) })).json();
      if (s.url) { const v = await fetch(s.url, { signal: AbortSignal.timeout(300000) }); fs.writeFileSync(path.join(OUT, "_raw", `${j.id}.mp4`), Buffer.from(await v.arrayBuffer())); log(j.id, "LISTO", Math.round((Date.now() - t0) / 1000) + "s"); return true; }
      if (/429|too many|rate/i.test(JSON.stringify(s)) && s.status !== "failed") { await sleep(30000); continue; }  // 429 de CONSULTA: el job sigue vivo
      if (s.status === "failed" || s.error) { log(j.id, "FALLO", JSON.stringify(s).slice(0, 200)); return false; }
    } catch {}
    if (Date.now() - t0 > 40 * 60000) { log(j.id, "timeout"); return false; }
  }
}
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const gray = (f, ss, sseof) => execFileSync("ffmpeg", ["-v", "error", ...(sseof ? ["-sseof", String(-Math.abs(sseof))] : ss !== undefined ? ["-ss", String(ss)] : []), "-i", f, "-frames:v", "1", "-vf", "scale=160:90,format=gray", "-f", "rawvideo", "-"], { maxBuffer: 1e7 });
const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };

const mudo = (f) => { const t = f.replace(/\.mp4$/, "_m.mp4"); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-an", "-c:v", "copy", t]); fs.renameSync(t, f); };
const hayVoz = async (mp4) => {
  const wav = mp4.replace(/\.mp4$/, "_voz.wav");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "16000", wav]);
  const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("response_format", "verbose_json");
  fd.append("file", new Blob([fs.readFileSync(wav)], { type: "audio/wav" }), "a.wav");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY || env.OPENAI_API_KEY}` }, body: fd, signal: AbortSignal.timeout(60_000) });
  fs.rmSync(wav, { force: true });
  const j = await r.json(); if (!Array.isArray(j.segments)) throw new Error("detector sin respuesta: " + JSON.stringify(j).slice(0, 120));
  const seg = j.segments.filter((x) => x.no_speech_prob < 0.5 && (x.text.match(/\p{L}{2,}/gu) || []).length >= 2);
  return { voz: seg.length > 0, texto: seg.map((x) => x.text.trim()).join(" ").slice(0, 120) };
};
const pares = JSON.parse(fs.readFileSync(LIST, "utf8"));
// estado reanudable: un job ya ENVIADO no se reenvía (cupo diario de 2.5), se vuelve a consultar
const STF = path.join(OUT, "_state.json");
const state = fs.existsSync(STF) ? JSON.parse(fs.readFileSync(STF, "utf8")) : {};
const saveState = () => fs.writeFileSync(STF, JSON.stringify(state, null, 1));
const report = [];
await Promise.all(pares.map(async (j, i) => {
  const raw = path.join(OUT, "_raw", `${j.id}.mp4`), fin = path.join(OUT, `${j.id}.mp4`);
  j._first = prep(j.first, j.id, "first"); j._last = j.last ? prep(j.last, j.id, "last") : null;
  if (FORCE.has(j.id)) { for (const f of [raw, fin]) if (fs.existsSync(f)) fs.unlinkSync(f); }
  if (!fs.existsSync(raw)) {
    let s = state[j.id];
    if (!s) { await sleep(i * 4000); s = await submit(j); if (s) { state[j.id] = s; saveState(); } }
    const okPoll = s && (await poll(j, s.vid, s.ki));
    if (!okPoll) { delete state[j.id]; saveState(); report.push({ id: j.id, ok: false, motivo: "agnes falló" }); return; }
  }
  try {
  const d = dur(raw);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", fin]);
  let audio = "ok";
  try { const v = await hayVoz(fin); if (v.voz) { mudo(fin); audio = "voz-muteado"; log(j.id, `🔇 VOZ inventada ("${v.texto}") → mudo`); } }
  catch (e) { mudo(fin); audio = "sin-veredicto-muteado"; log(j.id, "🔇 detector falló → mudo", String(e.message).slice(0, 80)); }
  // compuerta de extremos
  const d0 = diff(gray(fin, 0), gray(j._first)), d1 = j._last ? diff(gray(fin, undefined, 0.05), gray(j._last)) : 0;
  spawnSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "fps=3,scale=480:270,tile=4x3", "-frames:v", "1", path.join(OUT, `${j.id}_sheet.jpg`)]);
  const ok = d0 < 15 && d1 < 15;
  report.push({ id: j.id, ok, audio, d_first: +d0.toFixed(1), d_last: +d1.toFixed(1), raw_s: +d.toFixed(2) });
  log(j.id, ok ? "✓" : "⛔", `extremos ${d0.toFixed(1)} / ${d1.toFixed(1)} (tope 15)`);
  } catch (e) { report.push({ id: j.id, ok: false, motivo: String(e.message).slice(0, 160) }); log(j.id, "⛔ post", String(e.message).slice(0, 160)); }
}));
fs.writeFileSync(path.join(OUT, "_report.json"), JSON.stringify(report, null, 1));
const malas = report.filter((r) => !r.ok);
console.log(`MEDIDO: ${report.length}/${pares.length} · buenas ${report.length - malas.length} · malas ${malas.map((r) => r.id).join(",") || "0"} → mirá las hojas *_sheet.jpg a ojo`);
process.exit(report.length === pares.length && !malas.length ? 0 : 1);
