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

const FRAMES = Number(process.env.AG_FRAMES || 121);
const FPS = Number(process.env.AG_FPS || 60);
const SLOW = Number(process.env.AG_SLOW || FPS / 30);            // 60 fps → ×2 → 30 CFR sin repetidos
if ((FRAMES - 1) % 8) { console.error(`⛔ AG_FRAMES=${FRAMES} no cumple 8n+1 (la API rebota sin decir por qué)`); process.exit(1); }
// ⛔⛔ REGLA DEL CREADOR (18-sep-2026), para TODOS los nichos y canales: agnes anima 2 SEGUNDOS y se
// reproduce a 0,5× de velocidad. "Es demasiado tonto agnes": cuanto más tiempo le pedís, más se le
// derriten las manos, mete gente o cambia de escena. 121f @60 = 2,0 s de inferencia · setpts=2.0*PTS
// -> 4,03 s a 30 CFR. Bajar el fps o el ralentí NO es una preferencia de nicho: rompe la regla.
const INFER_S = FRAMES / FPS;
if (!process.env.AG_FORCE && (INFER_S > 2.2 || SLOW < 2)) {
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
const buildPrompt = (it) => [
  it.pres ? "Exact identity and appearance: the same person from the input image, same face, same hair, same facial hair, same age, same skin tone, same clothing, same body proportions." : null,
  it.gente && !it.pres ? "Exact identity and appearance: every person already in the input image stays the same person, same face, same age, same clothes. No new person appears." : null,
  `Scene continuity: the shot stays in the same place for the whole take. ${it.change || ""} Same walls, same fixtures, same objects in the same positions, nothing in the background changes, appears or moves.`,
  conPersona(it) ? null : "The scene is UNOCCUPIED: there is nobody in the frame, no person appears at any moment, nobody walks in, no face and no body become visible. Only the objects already in the picture move.",
  `Action: ${it.motion}. One single gentle continuous action.`,
  it.causality ? `Physical causality: ${it.causality}. Continuous uninterrupted action, no jump cuts.` : null,
  "Camera: the framing never changes, no dolly, no zoom, no pan, one continuous uninterrupted take, no cuts, no new scene.",
  (it.harden || process.env.HARDEN) ? "Stability: every object stays solid and keeps its shape and size for the whole take; hands keep five separate fingers and never merge with objects; nothing new appears anywhere in the frame; the movement is small and slow." : null,
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
console.log(`agnes i2v · ${FRAMES}f @${FPS} → ralentí ×${SLOW} a 30 CFR (${((FRAMES / FPS) * SLOW).toFixed(2)} s) · ${KS.length} claves`);
console.log(`total ${items.length} · ya estaban ${items.length - pend.length} · a generar ${pend.length}\n`);

// registro: qué clips salieron de agnes (el gate del farm exige QC sobre TODOS estos)
const REG = `_v3/${SLUG}_agnes_clips.json`;
const reg = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, "utf8")) : {};
const guardarReg = () => fs.writeFileSync(REG, JSON.stringify(reg, null, 1));

const ralenti = (raw, dst) => execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf",
  `setpts=${SLOW}*PTS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1`,
  "-an", "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", dst]);

const free = KS.map(() => 0);
const cola = [...pend];
const inflight = new Map();
let ok = 0, fail = 0, sent = 0, qfull = 0, rlim = 0;
const pickKey = () => { const now = Date.now(); let b = -1, t = Infinity; for (let i = 0; i < KS.length; i++) if (free[i] < t) { t = free[i]; b = i; } return t <= now ? b : -1; };

const submit = async (it, ki) => {
  try {
    const r = await fetch(B + "/videos", {
      method: "POST", signal: AbortSignal.timeout(90_000),
      headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-video-v2.0", image: dataURI(srcImg(it.nombre)), prompt: buildPrompt(it),
        negative_prompt: NEG, width: 1280, height: 720, num_frames: FRAMES, frame_rate: FPS }),
    });
    const j = await r.json().catch(() => ({}));
    const vid = j.video_id || j.id;
    if (!vid) {
      const msg = JSON.stringify(j);
      const qf = /queue is full|queue_full/i.test(msg), rl = /rate limit|too many/i.test(msg);
      if (qf || rl) { cola.unshift(it); free[ki] = Date.now() + (qf ? QUEUE_RETRY : COOLDOWN); qf ? qfull++ : rlim++; return; }
      throw new Error(msg.slice(0, 140));
    }
    free[ki] = Date.now() + COOLDOWN;
    inflight.set(vid, { item: it, t0: Date.now() });
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
    const g = await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}`,
      { headers: { Authorization: "Bearer " + KS[Math.floor(Math.random() * KS.length)] }, signal: AbortSignal.timeout(45_000) });
    const s = await g.json().catch(() => ({}));
    if (s.url) {
      const v = await fetch(s.url, { signal: AbortSignal.timeout(300_000) });
      const n = st.item.nombre;
      const raw = path.join(OUT, "_raw", `${n}.mp4`), dst = path.join(OUT, `${n}.mp4`);
      fs.writeFileSync(raw, Buffer.from(await v.arrayBuffer()));
      inflight.delete(vid);
      try { ralenti(raw, dst); } catch (e) { fail++; console.log(`  ✗ ralentí ${n}: ${String(e.message).slice(0, 100)}`); return; }
      reg[n] = { raw, fps: FPS, frames: FRAMES, slow: SLOW, pres: !!st.item.pres, gente: !!st.item.gente, person: conPersona(st.item),
        motion: st.item.motion, change: st.item.change || "", harden: !!(st.item.harden || process.env.HARDEN), at: new Date().toISOString() };
      guardarReg();
      ok++; console.log(`  ✓ ${ok}/${pend.length} ${n}`);
      return;
    }
    const raw = JSON.stringify(s || {});
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(s.status || ""))) return;   // 429 de CONSULTA: no tocar el job
    if (s.status === "failed" || s.error) { inflight.delete(vid); fail++; console.log(`  ✗ ${st.item.nombre}: ${raw.slice(0, 150)}`); return; }
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
