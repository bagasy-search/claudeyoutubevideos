// agnes_keyframe_trans.mjs — TRANSICIONES SIN CORTE con agnes-video-2.5-flash en modo keyframe (receta validada 29-sep-2026).
// Un clip que arranca EXACTO en el último cuadro de lo que sale y termina EXACTO en el primero de lo que entra;
// agnes inventa el movimiento del medio y el corte se lee como UNA sola toma. GENÉRICO: nada por slug.
//
//   node scripts/agnes_keyframe_trans.mjs <pares.json> <outDir> [segTimeline=2]
//   pares = [{ "id": "t01", "first": "<png>", "last": "<png>", "prompt": "..." }, ...]
//   first/last: PNG del cuadro EXACTO (render `remotion still` con el Ken-Burns aplicado), cualquier tamaño 16:9
//
// Salidas: <outDir>/_raw/<id>.mp4 (crudo de agnes) · <outDir>/<id>.mp4 (1920x1080, 30/1, sin audio, dura segTimeline)
//          <outDir>/<id>_sheet.jpg (hoja fps=3 4x3 para mirar a OJO) · <outDir>/_report.json
// COMPUERTA (exit 1 si falla alguna): diferencia media 1er cuadro vs first y último vs last < 15/255 (luma, 160x90).
// La hoja de contacto se mira a ojo: sin corte de escena en el medio, sin caras deformadas. Si falla → regenerar (--force <id>).
// ⛔ seconds mínimo 4 · ⛔ NO agnes-video-v2.0 (ignora last_frame) · la consulta va con la MISMA clave que envió.
import fs from "node:fs";
import path from "node:path";
import { agnesSubmit } from "../factory/lib/agnes_pool.mjs";
import { execFileSync, spawnSync } from "node:child_process";

const [LIST, OUT, SEG0] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!LIST || !OUT) { console.error("uso: node scripts/agnes_keyframe_trans.mjs <pares.json> <outDir> [segTimeline=2] [--force id1,id2]"); process.exit(1); }
const SEG = +(SEG0 || 2);
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
  const body = { model: MODEL, mode: "keyframe", prompt: j.prompt, seconds: "4", size: "720P", aspect_ratio: "16:9", first_frame: uri(j._first), last_frame: uri(j._last) };
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

const pares = JSON.parse(fs.readFileSync(LIST, "utf8"));
// estado reanudable: un job ya ENVIADO no se reenvía (cupo diario de 2.5), se vuelve a consultar
const STF = path.join(OUT, "_state.json");
const state = fs.existsSync(STF) ? JSON.parse(fs.readFileSync(STF, "utf8")) : {};
const saveState = () => fs.writeFileSync(STF, JSON.stringify(state, null, 1));
const report = [];
await Promise.all(pares.map(async (j, i) => {
  const raw = path.join(OUT, "_raw", `${j.id}.mp4`), fin = path.join(OUT, `${j.id}.mp4`);
  j._first = prep(j.first, j.id, "first"); j._last = prep(j.last, j.id, "last");
  if (FORCE.has(j.id)) { for (const f of [raw, fin]) if (fs.existsSync(f)) fs.unlinkSync(f); }
  if (!fs.existsSync(raw)) {
    let s = state[j.id];
    if (!s) { await sleep(i * 4000); s = await submit(j); if (s) { state[j.id] = s; saveState(); } }
    const okPoll = s && (await poll(j, s.vid, s.ki));
    if (!okPoll) { delete state[j.id]; saveState(); report.push({ id: j.id, ok: false, motivo: "agnes falló" }); return; }
  }
  try {
  const d = dur(raw);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-an", "-vf", `setpts=(${SEG}/${d})*PTS,scale=1920:1080:flags=lanczos,fps=30,format=yuv420p`, "-r", "30", "-frames:v", String(Math.round(SEG * 30)), "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", fin]);
  // compuerta de extremos
  const d0 = diff(gray(fin, 0), gray(j._first)), d1 = diff(gray(fin, undefined, 0.05), gray(j._last));
  spawnSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "fps=3,scale=480:270,tile=4x3", "-frames:v", "1", path.join(OUT, `${j.id}_sheet.jpg`)]);
  const ok = d0 < 15 && d1 < 15;
  report.push({ id: j.id, ok, d_first: +d0.toFixed(1), d_last: +d1.toFixed(1), raw_s: +d.toFixed(2) });
  log(j.id, ok ? "✓" : "⛔", `extremos ${d0.toFixed(1)} / ${d1.toFixed(1)} (tope 15)`);
  } catch (e) { report.push({ id: j.id, ok: false, motivo: String(e.message).slice(0, 160) }); log(j.id, "⛔ post", String(e.message).slice(0, 160)); }
}));
fs.writeFileSync(path.join(OUT, "_report.json"), JSON.stringify(report, null, 1));
const malas = report.filter((r) => !r.ok);
console.log(`MEDIDO: ${report.length}/${pares.length} · buenas ${report.length - malas.length} · malas ${malas.map((r) => r.id).join(",") || "0"} → mirá las hojas *_sheet.jpg a ojo`);
process.exit(report.length === pares.length && !malas.length ? 0 : 1);
