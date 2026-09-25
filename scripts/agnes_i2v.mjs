// agnes_i2v.mjs — GENERADOR COMPARTIDO de clips imagen-a-video con agnes-video-v2.0, para TODOS los
// canales. Reemplaza a los 90+ `gen_agnes_i2v_<slug>.mjs` clonados (cada clon arrastraba lo que tenía
// el anterior: 24 fps, 5 s, sin cláusula de escena vacía...). NO CLONAR ESTE ARCHIVO: se invoca.
//
//   node scripts/agnes_i2v.mjs <lista.json> <slug> [imgDir=public/img/<slug>] [outDir=public/broll/<slug>]
//   lista = [{ nombre, motion, change?, person?|pres?, gente?, causality?, harden? }]
//
// ⭐ RALENTÍ POR DEFECTO (medido 8-sep-2026, friogranero; perdido después y re-instalado acá):
//   agnes genera 121 cuadros a 60 fps = 2,0 s de inferencia (menos tiempo para derretir manos, meter
//   gente o cambiar de escena) → ffmpeg `setpts=2.0*PTS` + fps=30 → 4,03 s a 30/1 CFR con CERO
//   cuadros repetidos: cámara lenta real, sin tirón. El creador validó "2 s a 0,5×".
//   Crudo en <outDir>/_raw/<nombre>.mp4 · final en <outDir>/<nombre>.mp4 (1920x1080, 30/1, sin audio).
//   AG_FRAMES / AG_FPS / AG_SLOW sólo si se sabe lo que se hace (8n+1 cuadros o la API rebota).
//
// ⛔ Después de generar SIEMPRE: `node scripts/agnes_qc.mjs <slug> --fix`. El farm no rendea clips de
// agnes sin ese sello (scripts/agnes_qc_gate.mjs).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [LIST, SLUG, IMGDIR0, OUT0] = process.argv.slice(2);
if (!LIST || !SLUG) { console.error("uso: node scripts/agnes_i2v.mjs <lista.json> <slug> [imgDir] [outDir]"); process.exit(1); }
const IMGDIR = IMGDIR0 || `public/img/${SLUG}`;
const OUT = OUT0 || `public/broll/${SLUG}`;
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const B = process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const ROOT = B.replace(/\/v1$/, "");
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

// ⭐ AG_MODEL=agnes-video-2.5-flash (24-sep-2026, cmenino): GRATIS y con AUDIO nativo ultra real.
//   Otra API: mode "keyframe" + first_frame por URL PÚBLICA (se hostea en Supabase), `seconds` 4-12,
//   la tarea sólo la ve la CLAVE que la creó (consultar con otra da 404). Sale a 24 fps / 1280x704:
//   se conforma a 30 CFR por duplicación (`fps=30`, la cadencia validada) SIN ralentí, para no
//   deformar el sonido. ⛔ Inventa VOCES si el prompt insinúa a alguien hablando (medido: "OK, 1, 2, 3
//   volts" en inglés): el prompt pide sólo ambiente y cada clip pasa por un detector de voz — si hay
//   palabras, el clip queda MUDO (el video se usa igual).
const MODEL = process.env.AG_MODEL || "agnes-video-v2.0";
const FLASH = /^agnes-video-2\.5/.test(MODEL);
const FRAMES = Number(process.env.AG_FRAMES || 121);
const FPS = Number(process.env.AG_FPS || 60);
const SLOW = Number(process.env.AG_SLOW || FPS / 30);            // 60 fps → ×2 → 30 CFR sin repetidos
if ((FRAMES - 1) % 8) { console.error(`⛔ AG_FRAMES=${FRAMES} no cumple 8n+1 (la API rebota sin decir por qué)`); process.exit(1); }
// ⛔⛔ REGLA DEL CREADOR (18-sep-2026), para TODOS los nichos y canales: agnes anima 2 SEGUNDOS y se
// reproduce a 0,5× de velocidad. "Es demasiado tonto agnes": cuanto más tiempo le pedís, más se le
// derriten las manos, mete gente o cambia de escena. 121f @60 = 2,0 s de inferencia · setpts=2.0*PTS
// -> 4,03 s a 30 CFR. Bajar el fps o el ralentí NO es una preferencia de nicho: rompe la regla.
const INFER_S = FRAMES / FPS;
if (!FLASH && !process.env.AG_FORCE && (INFER_S > 2.2 || SLOW < 2)) {
  console.error(`⛔ fuera de la regla: ${INFER_S.toFixed(2)} s de inferencia a ralentí ×${SLOW} (la regla es ~2 s a ×2 = 0,5 de velocidad).`);
  console.error(`   medido: FRAMES=${FRAMES} FPS=${FPS} SLOW=${SLOW}. Si de verdad lo querés, AG_FORCE=1.`);
  process.exit(1);
}
const COOLDOWN = 62_000, QUEUE_RETRY = 8_000, POLL_MS = 12_000, MAX_WAIT = 25 * 60_000;
const MAX_INFLIGHT = Number(process.env.AGNES_INFLIGHT || 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const NEG = "identity drift, face morphing, different person, extra person, new person entering, crowd, " +
  "plastic skin, waxy skin, airbrushed face, glossy CGI, extra fingers, melting hands, melting objects, " +
  "background morphing, new scene, scene cut, camera movement, dolly, zoom, pan, text, watermark, logo";

// ⛔ Reglas de la skill agnes-broll que viven en el prompt (no las saques):
//  · el aparato NO se nombra (dibuja el trípode); se habla del ENCUADRE.
//  · el bloque de continuidad NO es opcional (sin él inventa otra escena a los 0,5 s).
//  · plano SIN persona → la escena se declara VACÍA: agnes puebla los cuartos con gente inventada
//    (pinvacas 69/117; tcbriquetas p170 metió unos pies a los 4 s). Arreglo medido: 53/69 y 13/14.
//  · el movimiento de un plano sin persona va en VOZ DE OBJETO ("the pencil moves"), nunca "his hand".
const conPersona = (it) => !!(it.person || it.pres || it.gente);
const SONIDO = (it) => `Sound: only the natural ambient sound of this place${it.sonido ? ` (${it.sonido})` : ""}, clearly audible at its natural real-life level, rich and realistic like a location recording (not silence). No voices, nobody talks, no speech, no words, no singing, no music, no narration.`;
const buildPrompt = (it) => [
  it.pres ? "Exact identity and appearance: the same person from the input image, same face, same hair, same facial hair, same age, same skin tone, same clothing, same body proportions." : null,
  it.gente && !it.pres ? "Exact identity and appearance: every person already in the input image stays the same person, same face, same age, same clothes. No new person appears." : null,
  `Scene continuity: the shot stays in the same place for the whole take. ${it.change || ""} Same walls, same fixtures, same objects in the same positions, nothing in the background changes, appears or moves.`,
  conPersona(it) ? null : "The scene is UNOCCUPIED: there is nobody in the frame, no person appears at any moment, nobody walks in, no face and no body become visible. Only the objects already in the picture move.",
  `Action: ${it.motion}. One single gentle continuous action.`,
  it.causality ? `Physical causality: ${it.causality}. Continuous uninterrupted action, no jump cuts.` : null,
  "Camera: the framing never changes, no dolly, no zoom, no pan, one continuous uninterrupted take, no cuts, no new scene.",
  (it.harden || process.env.HARDEN) ? "Stability: every object stays solid and keeps its shape and size for the whole take; hands keep five separate fingers and never merge with objects; nothing new appears anywhere in the frame; the movement is small and slow." : null,
  FLASH ? SONIDO(it) : null,
].filter(Boolean).join("\n");

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const srcImg = (n) => [".jpg", ".png", ".webp"].map((e) => path.join(IMGDIR, n + e)).find((f) => fs.existsSync(f));
const dataURI = (f) => `data:${MIME[path.extname(f).toLowerCase()]};base64,` + fs.readFileSync(f).toString("base64");

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(path.join(OUT, "_raw"), { recursive: true });
const pend = items.filter((it) => {
  if (!srcImg(it.nombre)) { console.log(`  (sin imagen base, salteo) ${it.nombre}`); return false; }
  return !fs.existsSync(path.join(OUT, `${it.nombre}.mp4`));
});
console.log(FLASH ? `agnes i2v · ${MODEL} · ${process.env.AG_SECS || 4} s ${process.env.AG_SIZE || "720P"} con AUDIO → 30 CFR sin ralentí · ${KS.length} claves`
  : `agnes i2v · ${FRAMES}f @${FPS} → ralentí ×${SLOW} a 30 CFR (${((FRAMES / FPS) * SLOW).toFixed(2)} s) · ${KS.length} claves`);
console.log(`total ${items.length} · ya estaban ${items.length - pend.length} · a generar ${pend.length}\n`);

// registro: qué clips salieron de agnes (el gate del farm exige QC sobre TODOS estos)
const REG = `_v3/${SLUG}_agnes_clips.json`;
const reg = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, "utf8")) : {};
const guardarReg = () => fs.writeFileSync(REG, JSON.stringify(reg, null, 1));

const ralenti = (raw, dst) => FLASH
  ? execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1",
    "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", dst])
  : execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf",
  `setpts=${SLOW}*PTS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1`,
  "-an", "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", dst]);

// hosting de la imagen base (flash pide URL pública) — mismo bucket que el avatar de RunPod
let SUPA = null;
const hostear = async (n, f) => {
  if (!SUPA) SUPA = await (await import("file:///" + path.resolve("scripts/supa_creds.mjs").split(path.sep).join("/"))).supaCreds();
  const obj = `tmp_avatar/agnes_${SLUG}_${n}${path.extname(f)}`;
  const r = await fetch(`${SUPA.U}/storage/v1/object/thumbnails/${obj}`, { method: "POST", signal: AbortSignal.timeout(120_000),
    headers: { apikey: SUPA.K, Authorization: `Bearer ${SUPA.K}`, "Content-Type": MIME[path.extname(f).toLowerCase()], "x-upsert": "true" }, body: fs.readFileSync(f) });
  if (!r.ok) throw new Error(`hosting ${n}: ${r.status}`);
  return `${SUPA.U}/storage/v1/object/public/thumbnails/${obj}`;
};
// detector de VOZ sobre el audio del clip (OpenAI whisper-1, ~US$0,0004 por clip de 4 s)
const mudo = (dst) => { const tmp = dst.replace(/\.mp4$/, "_mudo.mp4"); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", dst, "-an", "-c:v", "copy", tmp]); fs.renameSync(tmp, dst); };
const hayVoz = async (mp4) => {
  const wav = mp4.replace(/\.mp4$/, "_voz.wav");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "16000", wav]);
  const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("response_format", "verbose_json");
  fd.append("file", new Blob([fs.readFileSync(wav)], { type: "audio/wav" }), "a.wav");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY || env.OPENAI_API_KEY}` }, body: fd, signal: AbortSignal.timeout(60_000) });
  fs.rmSync(wav, { force: true });
  const j = await r.json();
  if (!Array.isArray(j.segments)) throw new Error("detector de voz sin respuesta: " + JSON.stringify(j).slice(0, 120));
  const seg = j.segments.filter((x) => x.no_speech_prob < 0.5 && (x.text.match(/\p{L}{2,}/gu) || []).length >= 2);
  return { voz: seg.length > 0, texto: seg.map((x) => x.text.trim()).join(" ").slice(0, 120) };
};

const free = KS.map(() => 0);
const cola = [...pend];
const inflight = new Map();
let ok = 0, fail = 0, sent = 0, qfull = 0, rlim = 0;
const pickKey = () => { const now = Date.now(); let b = -1, t = Infinity; for (let i = 0; i < KS.length; i++) if (free[i] < t) { t = free[i]; b = i; } return t <= now ? b : -1; };

const submit = async (it, ki) => {
  try {
    const body = FLASH
      ? { model: MODEL, mode: "keyframe", first_frame: it._url || (it._url = await hostear(it.nombre, srcImg(it.nombre))), prompt: buildPrompt(it),
          seconds: String(it.secs ? Math.max(4, Math.min(12, Math.round(it.secs))) : (process.env.AG_SECS || "4")), size: process.env.AG_SIZE || "720P", aspect_ratio: "16:9" }
      : { model: MODEL, image: dataURI(srcImg(it.nombre)), prompt: buildPrompt(it),
          negative_prompt: NEG, width: 1280, height: 720, num_frames: FRAMES, frame_rate: FPS };
    const r = await fetch(B + "/videos", {
      method: "POST", signal: AbortSignal.timeout(90_000),
      headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    const vid = j.video_id || j.id;
    if (!vid) {
      const msg = JSON.stringify(j);
      const qf = /queue is full|queue_full/i.test(msg), rl = /rate limit|too many|rate_limit/i.test(msg);
      if (qf || rl) { cola.unshift(it); free[ki] = Date.now() + (qf ? QUEUE_RETRY : COOLDOWN); qf ? qfull++ : rlim++; return; }
      throw new Error(msg.slice(0, 140));
    }
    free[ki] = Date.now() + COOLDOWN;
    inflight.set(vid, { item: it, t0: Date.now(), ki });
    sent++;
    console.log(`  → ${it.nombre} (enviados ${sent}/${pend.length}, en vuelo ${inflight.size})`);
  } catch (e) {
    it._try = (it._try || 0) + 1;
    if (it._try < 3) { cola.push(it); return; }
    fail++; console.log(`  ✗ submit ${it.nombre}: ${String(e.message).slice(0, 110)}`);
  }
};

const poll = async (vid, st) => {
  try {
    const g = FLASH
      ? await fetch(`${B}/videos/${encodeURIComponent(vid)}`, { headers: { Authorization: "Bearer " + KS[st.ki] }, signal: AbortSignal.timeout(45_000) })
      : await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}`,
      { headers: { Authorization: "Bearer " + KS[st.ki] }, signal: AbortSignal.timeout(45_000) });   // ⛔ sep-2026: la tarea sólo la ve la clave que la creó (con otra: 404 → 106/106 "fallidos")
    const s = await g.json().catch(() => ({}));
    const urlOut = s.url || s.metadata?.url;
    if (urlOut && (!FLASH || s.status === "completed")) {
      const v = await fetch(urlOut, { signal: AbortSignal.timeout(300_000) });
      const n = st.item.nombre;
      const raw = path.join(OUT, "_raw", `${n}.mp4`), dst = path.join(OUT, `${n}.mp4`);
      fs.writeFileSync(raw, Buffer.from(await v.arrayBuffer()));
      inflight.delete(vid);
      try { ralenti(raw, dst); } catch (e) { fail++; console.log(`  ✗ ralentí ${n}: ${String(e.message).slice(0, 100)}`); return; }
      let audio = FLASH ? "ok" : "sin";
      if (FLASH) {
        try {
          const d = await hayVoz(dst);
          if (d.voz) { mudo(dst); audio = "voz-muteado"; console.log(`  🔇 ${n}: el audio traía VOZ ("${d.texto}") → clip mudo`); }
        } catch (e) {   // sin veredicto del detector el audio no entra: no se arriesga una voz inventada
          mudo(dst); audio = "sin-veredicto-muteado"; console.log(`  🔇 ${n}: detector de voz falló (${String(e.message).slice(0, 80)}) → mudo`);
        }
      }
      reg[n] = { raw, modelo: MODEL, audio, fps: FLASH ? 24 : FPS, frames: FRAMES, slow: FLASH ? 1 : SLOW, pres: !!st.item.pres, gente: !!st.item.gente, person: conPersona(st.item),
        motion: st.item.motion, change: st.item.change || "", harden: !!(st.item.harden || process.env.HARDEN), at: new Date().toISOString() };
      guardarReg();
      ok++; console.log(`  ✓ ${ok}/${pend.length} ${n}`);
      return;
    }
    const raw = JSON.stringify(s || {});
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(s.status || ""))) return;   // 429 de CONSULTA: no tocar el job
    if (s.status === "failed" || (!FLASH && s.error)) { inflight.delete(vid); fail++; console.log(`  ✗ ${st.item.nombre}: ${raw.slice(0, 150)}`); return; }
    if (Date.now() - st.t0 > MAX_WAIT) { inflight.delete(vid); fail++; console.log(`  ✗ ${st.item.nombre}: timeout`); }
  } catch { /* transitorio */ }
};

let latido = 0;
while (cola.length || inflight.size) {
  while (cola.length && inflight.size < MAX_INFLIGHT) { const ki = pickKey(); if (ki < 0) break; await submit(cola.shift(), ki); }
  await sleep(POLL_MS);
  await Promise.all([...inflight].map(([vid, st]) => poll(vid, st)));
  if (++latido % 10 === 0) console.log(`  · latido: cola ${cola.length} · en vuelo ${inflight.size} · ok ${ok} · fail ${fail} · rate-limit ${rlim}`);
}
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} · cola-llena ${qfull} · rate-limit ${rlim} ===`);
console.log(`siguiente paso OBLIGATORIO: node scripts/agnes_qc.mjs ${SLUG} --fix`);
process.exit(fail ? 1 : 0);
