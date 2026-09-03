// gen_agnes_i2v_tcaceite.mjs — IMAGEN-A-VIDEO con agnes-video-v2.0: anima las fotos hero del
// presentador (su cara real) en clips de 5,04 s. Cada PNG generado con gen_agnes_ref.mjs entra
// como PRIMER FRAME, así el clip hereda la identidad exacta en vez de inventar otra persona.
//
//   node gen_agnes_i2v_mdmold.mjs <acciones.json> [outDir] [imgDir]
//
// ⛔ SOLO `agnes-video-v2.0` (2.5 devuelve 403 en esta cuenta). No probar 2.5 como fallback.
//
// MEDIDO 2026-08-25 (probe A vs B, mismo PNG, misma seed de cola):
//   · width/height/num_frames/frame_rate  -> mp4 REAL 1280x704, 121f @24 = 5,04 s  ✅
//   · mode:"ti2vid" + aspect_ratio:"16:9" -> mp4 REAL 1088x832 (casi 4:3)          ⛔ franjas
// O sea: los parámetros clásicos NO son "FORBIDDEN" (la skill decía eso y está desactualizado),
// y son los únicos que dan 16:9. La altura pedida (720) igual sale 704: leer `perf_params`.
//
// Rate limit medido hoy: "allows 1 requests per 1 minute(s)" POR CLAVE -> se ROTAN las 16.
import fs from "node:fs";
import path from "node:path";

// .env a mano (dotenv no esta instalado en este proyecto)
try {
  for (const l of fs.readFileSync(".env","utf8").split(String.fromCharCode(10))) {
    const k = l.indexOf("=");
    if (k <= 0) continue;
    const nm = l.slice(0, k).trim();
    let v = l.slice(k + 1).trim();
    if (v.length > 1 && (v[0] === "'" || v[0] === '"') && v[v.length-1] === v[0]) v = v.slice(1, -1);
    if (nm && !process.env[nm]) process.env[nm] = v;
  }
} catch {}

const [LIST, OUT = "public/broll", IMGDIR = "public/img"] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const B = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const ROOT = B.replace(/\/v1$/, "");
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 62_000;      // 1 request/min por clave -> 62 s de margen
const QUEUE_RETRY = 8_000;    // 503 queue_full = cola GLOBAL, no castigar la clave
const POLL_MS = 12_000;
const MAX_WAIT = 25 * 60_000;
const MAX_INFLIGHT = Number(process.env.AGNES_INFLIGHT || 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const NEG = "identity drift, face morphing, different person, changing beard, changing hairline, " +
  "plastic skin, waxy skin, airbrushed face, beauty filter, porcelain skin, glossy CGI, " +
  "extra fingers, melting hands, background morphing, new scene, scene cut, camera movement, " +
  "dolly, zoom, pan, cinematic lighting, text, watermark, logo";

// ⛔ COMPUERTA 4: el aparato NO se nombra nunca (nombrarlo dibujó un trípode y un celular dentro
// del cuadro). Se habla del ENCUADRE. Y el bloque de continuidad NO es opcional: sin él, el modelo
// se inventa otra escena a los 0,5 s — eso es lo que rompe el clip, no la cara.
const buildPrompt = (it) => (it.persona ? [
  "Exact identity and appearance: the same man from the input image, same face, same hairline, " +
  "same greying beard, same age, same skin tone, same clothing, same body proportions.",
  `Scene continuity: the shot stays in the same place for the whole take. ${it.change} ` +
  "Same walls, same fixtures, same objects in the same positions, nothing behind him changes.",
  `Action: ${it.motion}. One single continuous action.`,
  it.causality ? `Physical causality: ${it.causality}. Continuous uninterrupted action, no jump cuts.` : null,
  "Camera: the framing never changes, no dolly, no zoom, no pan, one continuous uninterrupted take.",
  "Texture: unretouched natural skin, visible pores, ordinary indoor light, low contrast.",
].filter(Boolean).join("\n") : [
  "Exact scene: keep everything from the input image exactly as it is, same objects, same shapes, " +
  "same materials, same colours, same positions, same background.",
  `Scene continuity: the shot stays in the same place for the whole take. ${it.change} ` +
  "Nothing new appears, nothing is removed, no person walks into frame.",
  `Action: ${it.motion}. One single small continuous action, everything else stays still.`,
  it.causality ? `Physical causality: ${it.causality}. Continuous uninterrupted action, no jump cuts.` : null,
  "Camera: the framing never changes, no dolly, no zoom, no pan, one continuous uninterrupted take.",
  "Texture: ordinary available light, low contrast, neutral white balance, real worn surfaces.",
].filter(Boolean).join("\n"));

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const dataURI = (f) => `data:${MIME[path.extname(f).toLowerCase()] || "image/png"};base64,` +
  fs.readFileSync(f).toString("base64");

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });
const pend = items.filter((it) => {
  const img = path.join(IMGDIR, `${it.nombre}.png`);
  if (!fs.existsSync(img)) { console.log(`  (sin imagen, salteo) ${it.nombre}`); return false; }
  return !fs.existsSync(path.join(OUT, `${it.nombre}.mp4`));
});
console.log(`agnes-video-v2.0 i2v · 1280x720 pedido (sale 704) · 121f @24 = 5,04 s · ${KS.length} claves`);
console.log(`total ${items.length} · ya estaban ${items.length - pend.length} · a generar ${pend.length}\n`);

const free = KS.map(() => 0);
const cola = [...pend];
const inflight = new Map();
let ok = 0, fail = 0, sent = 0, qfull = 0, rlim = 0;

const pickKey = () => {
  const now = Date.now();
  let best = -1, bestT = Infinity;
  for (let i = 0; i < KS.length; i++) if (free[i] < bestT) { bestT = free[i]; best = i; }
  return bestT <= now ? best : -1;
};

const submit = async (it, ki) => {
  try {
    const r = await fetch(B + "/videos", {
      method: "POST",
      headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "agnes-video-v2.0",
        image: dataURI(path.join(IMGDIR, `${it.nombre}.png`)),
        prompt: buildPrompt(it),
        negative_prompt: NEG,
        width: 1280, height: 720, num_frames: 121, frame_rate: 24,
      }),
    });
    const j = await r.json().catch(() => ({}));
    const vid = j.video_id || j.id;
    if (!vid) {
      const msg = JSON.stringify(j);
      const queueFull = /queue is full|queue_full/i.test(msg);
      const rateLimited = /rate limit|too many/i.test(msg);
      if (queueFull || rateLimited) {
        cola.unshift(it);
        free[ki] = Date.now() + (queueFull ? QUEUE_RETRY : COOLDOWN);
        if (queueFull) qfull++; else rlim++;
        return;
      }
      throw new Error(msg.slice(0, 140));
    }
    free[ki] = Date.now() + COOLDOWN;
    inflight.set(vid, { item: it, ki, t0: Date.now() });
    sent++;
    console.log(`  → ${it.nombre} (enviados ${sent}/${pend.length}, en vuelo ${inflight.size})`);
  } catch (e) {
    it._try = (it._try || 0) + 1;
    if (it._try < 3) { cola.push(it); return; }
    fail++;
    console.log(`  ✗ submit ${it.nombre}: ${String(e.message).slice(0, 110)}`);
  }
};

const poll = async (vid, st) => {
  try {
    const ki = Math.floor(Math.random() * KS.length);
    const g = await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}`,
      { headers: { Authorization: "Bearer " + KS[ki] } });
    const s = await g.json().catch(() => ({}));
    if (s.url) {
      const v = await fetch(s.url);
      fs.writeFileSync(path.join(OUT, `${st.item.nombre}.mp4`), Buffer.from(await v.arrayBuffer()));
      inflight.delete(vid); ok++;
      const pp = s.perf_params ? `${s.perf_params.width}x${s.perf_params.height}` : "?";
      console.log(`  ✓ ${ok}/${pend.length} ${st.item.nombre} [${pp}]`);
      return;
    }
    // ⛔ COMPUERTA 0: el 429 de CONSULTA de estado es transitorio. Tratarlo como render fallido
    // fue lo que tiró 52 de 273 clips en taza9pm. No se toca el job.
    const raw = JSON.stringify(s || {});
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(s.status || ""))) return;
    if (s.status === "failed" || s.error) {
      inflight.delete(vid); fail++;
      console.log(`  ✗ ${st.item.nombre}: ${raw.slice(0, 150)}`);
      return;
    }
    if (Date.now() - st.t0 > MAX_WAIT) { inflight.delete(vid); fail++; console.log(`  ✗ ${st.item.nombre}: timeout`); }
  } catch { /* transitorio */ }
};

while (cola.length || inflight.size) {
  while (cola.length && inflight.size < MAX_INFLIGHT) {
    const ki = pickKey();
    if (ki < 0) break;
    await submit(cola.shift(), ki);
  }
  await sleep(POLL_MS);
  await Promise.all([...inflight].map(([vid, st]) => poll(vid, st)));
}
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} · cola-llena ${qfull} · rate-limit ${rlim} ===`);
