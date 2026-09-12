// gen_agnes_i2v_rkfob.mjs — IMAGEN-A-VIDEO con agnes-video-v2.0 para el pool de `rkfob`.
// Clon de `gen_agnes_i2v_mdmold.mjs` (el runner PROBADO) con tres cambios:
//
//   1. La lista ya trae el PROMPT ARMADO (`_v3/rkfob_i2v.mjs` lo construye y lo LINTEA antes).
//      El de mdmold arma un prompt de identidad de presentador; acá el 85% de los planos son
//      objetos y escenas, y el prompt correcto es el de 4 bloques de "animación leve".
//   2. `frame_rate: 60` en vez de 24 → 121 cuadros = 2,0167 s, que con `setpts=2.0*PTS` da
//      4,033 s a 30 CFR con CERO cuadros repetidos (ralentí real, sin estrobo).
//   3. La imagen de origen viene con su RUTA en el item (el pool vive en JPG, no en PNG).
//
// ⛔ SOLO `agnes-video-v2.0` (2.5 devuelve 403 en esta cuenta). No probar 2.5 como fallback.
// ⛔ NO usar el compartido `gen_agnes_video_fast.mjs`: descarta clips sanos.
// ⛔ COMPUERTA 0 (heredada, costó 52 de 273 clips en taza9pm): el 429 al CONSULTAR estado es
//    transitorio. Tratarlo como render fallido tira el job que estaba rindiendo bien.
//
//   node gen_agnes_i2v_rkfob.mjs _v3/rkfob_i2v_list.json public/broll/rkfob
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST = "_v3/rkfob_i2v_list.json", OUT = "public/broll/rkfob"] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const B = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const ROOT = B.replace(/\/v1$/, "");
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 62_000;      // 1 request/min POR CLAVE → se rotan las 16
const QUEUE_RETRY = 8_000;    // 503 queue_full = cola GLOBAL, no castigar la clave
const POLL_MS = 12_000;
const MAX_WAIT = 25 * 60_000;
const MAX_INFLIGHT = Number(process.env.AGNES_INFLIGHT || 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ⛔ "agnes i2v METE GENTE QUE NO EXISTE" — el negativo de persona se queda aunque el plano sea
//    de objeto: es justo donde el modelo inventa un señor mayor de la nada.
const NEG = "new person, extra person, someone walking into frame, face morphing, different person, " +
  "plastic skin, waxy skin, airbrushed face, beauty filter, glossy CGI, " +
  "extra fingers, melting hands, background morphing, new scene, scene cut, camera movement, " +
  "dolly, zoom, pan, cinematic lighting, text, watermark, logo";

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const dataURI = (f) => `data:${MIME[path.extname(f).toLowerCase()] || "image/jpeg"};base64,` +
  fs.readFileSync(f).toString("base64");

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });

const sinImagen = [];
const pend = items.filter((it) => {
  if (!fs.existsSync(it.image)) { sinImagen.push(it.name); return false; }
  return !fs.existsSync(path.join(OUT, `${it.name}.mp4`));
});
console.log(`agnes-video-v2.0 i2v · 121f @60 = 2,017 s (→ setpts 2.0 = 4,033 s @30) · ${KS.length} claves`);
console.log(`total ${items.length} · sin imagen ${sinImagen.length} · ya estaban ${items.length - pend.length - sinImagen.length} · a generar ${pend.length}`);
if (sinImagen.length) console.log(`  ⛔ SIN IMAGEN: ${sinImagen.join(" ")}`);
if (!pend.length) { console.log("nada que hacer"); process.exit(0); }
console.log("");

const free = KS.map(() => 0);
const cola = [...pend];
const inflight = new Map();
let ok = 0, fail = 0, sent = 0, qfull = 0, rlim = 0;
const fallidos = [];

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
        image: dataURI(it.image),
        prompt: it.prompt,
        negative_prompt: NEG,
        width: 1280, height: 720,
        num_frames: it.num_frames || 121,
        frame_rate: it.frame_rate || 60,
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
    if (sent % 10 === 0 || sent <= 3) console.log(`  → enviados ${sent}/${pend.length} · en vuelo ${inflight.size} · listos ${ok}`);
  } catch (e) {
    it._try = (it._try || 0) + 1;
    if (it._try < 3) { cola.push(it); return; }
    fail++; fallidos.push(it.name);
    console.log(`  ✗ submit ${it.name}: ${String(e.message).slice(0, 110)}`);
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
      fs.writeFileSync(path.join(OUT, `${st.item.name}.mp4`), Buffer.from(await v.arrayBuffer()));
      inflight.delete(vid); ok++;
      if (ok % 10 === 0 || ok <= 3) {
        const pp = s.perf_params ? `${s.perf_params.width}x${s.perf_params.height}@${s.perf_params.frame_rate || "?"}` : "?";
        console.log(`  ✓ ${ok}/${pend.length} [${pp}] último: ${st.item.name}`);
      }
      return;
    }
    // ⛔ COMPUERTA 0: el 429 de CONSULTA es transitorio. No se toca el job.
    const raw = JSON.stringify(s || {});
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(s.status || ""))) return;
    if (s.status === "failed" || s.error) {
      inflight.delete(vid); fail++; fallidos.push(st.item.name);
      console.log(`  ✗ ${st.item.name}: ${raw.slice(0, 150)}`);
      return;
    }
    if (Date.now() - st.t0 > MAX_WAIT) {
      inflight.delete(vid); fail++; fallidos.push(st.item.name);
      console.log(`  ✗ ${st.item.name}: timeout`);
    }
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
if (fallidos.length) {
  fs.writeFileSync("_v3/rkfob_i2v_fallidos.json", JSON.stringify(fallidos, null, 1));
  console.log(`fallidos → _v3/rkfob_i2v_fallidos.json (${fallidos.length}). Su FOTO sostiene el plano; no es bloqueante.`);
}
