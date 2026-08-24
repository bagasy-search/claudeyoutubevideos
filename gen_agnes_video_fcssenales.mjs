// gen_agnes_video_fast.mjs — igual que gen_agnes_video.mjs pero DESACOPLA envío y polling.
//
//   node gen_agnes_video_fast.mjs <lista.json> <outDir> [ancho] [alto] [frames]
//
// POR QUÉ EXISTE (medido 2026-08-21): el generador original hacía submit→esperar→bajar
// dentro de cada worker, o sea 1 worker bloqueado por clip. Con 10 claves eso daba
// ~0.7 clips/min (320 clips = 8 h) porque cada render de agnes tarda varios minutos.
// El límite real de agnes es de ENVÍO (1 video por minuto POR CLAVE), NO de trabajos en
// vuelo. Separando las dos cosas el techo pasa a ser 10 envíos/min = ~32 min para 320.
//
// · submit: en cuanto una clave cumple su minuto, sale el próximo item
// · poll:   todos los jobs en vuelo se consultan en paralelo cada POLL_MS
// · download: apenas aparece la url
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST, OUT = "public/vid", W = "1280", H = "720", FR = "49"] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const B = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const ROOT = B.replace(/\/v1$/, "");
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 31_000;      // MEDIDO 21-ago-2026: la API dice "allows 2 requests per 1 minute(s)"
                              // POR CLAVE. Con 61s se tiraba la mitad del techo.
const QUEUE_RETRY = 8_000;    // 503 video_queue_full = cola GLOBAL llena (compartida entre sesiones).
                              // NO es culpa de la clave: reintentar pronto, sin quemarle su minuto.
const POLL_MS = 10_000;       // cada cuanto se consultan los jobs en vuelo
const MAX_WAIT = 25 * 60_000; // si un job no termina en 15 min, se da por perdido
const MAX_INFLIGHT = Number(process.env.AGNES_INFLIGHT || 14); // agnes devuelve queue_full si te pasas

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });
const pend = items.filter((it) => !fs.existsSync(path.join(OUT, `${it.nombre}.mp4`)));
console.log(`agnes-video-v2.0 · ${W}x${H} · ${FR}f (~${(FR / 24).toFixed(1)}s) · ${KS.length} claves`);
console.log(`total ${items.length} · ya estaban ${items.length - pend.length} · a generar ${pend.length}`);
console.log(`techo teorico: ${KS.length}/min -> ~${Math.ceil(pend.length / KS.length)} min\n`);

const free = KS.map(() => 0);
// PRIORIDAD: primero el clip PRINCIPAL de cada momento; las variantes 'b' despues.
// Asi, si hay que cortar por tiempo, ningun momento se queda sin visual.
const cola = [...pend].sort((a, c) => (/b$/.test(a.nombre) ? 1 : 0) - (/b$/.test(c.nombre) ? 1 : 0));
const inflight = new Map();   // videoId -> {item, ki, t0}
let ok = 0, fail = 0, sent = 0, requeued = 0, qfull = 0, rlim = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Un submit rechazado por CUPO (rate limit / cola llena) NO es un fallo del item:
// vuelve a la cola y la clave se enfria. Contarlo como fallo descartaba el clip para siempre.
const submit = async (it, ki) => {
  try {
    const r = await fetch(B + "/videos", {
      method: "POST",
      headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
      // ⛔ API CAMBIADA (ago 2026): width/height/num_frames/frame_rate son FORBIDDEN.
      // Ahora manda `mode` (ti2vid | keyframes | multi_reference) + aspect_ratio. Salen 5s.
      body: JSON.stringify({ model: "agnes-video-v2.0", ...(it.img_url ? { image: it.img_url } : {}),
        prompt: it.prompt_mov, mode: "ti2vid", aspect_ratio: "16:9" }),
    });
    const j = await r.json();
    const vid = j.video_id || j.id;
    if (!vid) {
      const msg = JSON.stringify(j);
      const queueFull = /queue is full|queue_full/i.test(msg);
      const rateLimited = /rate limit|too many/i.test(msg);
      if (queueFull || rateLimited) {
        cola.unshift(it);                 // se reintenta
        // ⛔ FIX MEDIDO: antes los dos casos quemaban 61s de la clave. Un queue_full es de la COLA
        // GLOBAL, no de la clave: castigarla dejaba las 14 claves congeladas justo cuando la cola
        // se liberaba. Ahora el queue_full reintenta a los 8s y solo el 429 real espera su turno.
        free[ki] = Date.now() + (queueFull ? QUEUE_RETRY : COOLDOWN);
        requeued++;
        if (queueFull) qfull++; else rlim++;
        return;
      }
      throw new Error(msg.slice(0, 120));
    }
    inflight.set(vid, { item: it, ki, t0: Date.now() });
    sent++;
  } catch (e) {
    it._try = (it._try || 0) + 1;
    if (it._try < 3) { cola.push(it); requeued++; return; }
    fail++;
    console.log(`  ✗ submit ${it.nombre}: ${String(e.message).slice(0, 90)}`);
  }
};

const poll = async (vid, st) => {
  try {
    const g = await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}`,
      { headers: { Authorization: "Bearer " + KS[st.ki] } });
    const s = await g.json().catch(() => ({}));
    if (s.url) {
      const v = await fetch(s.url);
      fs.writeFileSync(path.join(OUT, `${st.item.nombre}.mp4`), Buffer.from(await v.arrayBuffer()));
      inflight.delete(vid); ok++;
      if (ok % 10 === 0 || ok < 5) console.log(`  ✓ ${ok}/${pend.length}  (en vuelo ${inflight.size}, enviados ${sent}, cola-llena ${qfull}, rate-limit ${rlim})`);
      return;
    }
    // ⛔⛔ EL BUG QUE TIRABA CLIPS BUENOS (medido 21-ago-2026): agnes tambien limita las CONSULTAS
    // DE ESTADO ("video status query rate limit exceeded", 429). Con 10-14 jobs en vuelo y POLL_MS
    // bajo, esas 429 llegan seguido — y el codigo original tomaba CUALQUIER respuesta con .error
    // como "el render fallo" y DESCARTABA un job que estaba andando bien. 52 de 273 clips se
    // perdieron asi. Un 429 de polling es TRANSITORIO: no se toca el job, se reintenta despues.
    const raw = JSON.stringify(s || {});
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(s.status || ""))) return;
    if (s.status === "failed" || s.error) { inflight.delete(vid); fail++;
      const det = typeof s.error === "string" ? s.error : JSON.stringify(s.error || s.status || "?");
      console.log(`  ✗ ${st.item.nombre}: ${String(det).slice(0, 160)}`); return; }
    if (Date.now() - st.t0 > MAX_WAIT) { inflight.delete(vid); fail++; console.log(`  ✗ ${st.item.nombre}: timeout`); }
  } catch { /* transitorio: se reintenta en la proxima vuelta */ }
};

while (cola.length || inflight.size) {
  const now = Date.now();
  for (let i = 0; i < KS.length && cola.length && inflight.size < MAX_INFLIGHT; i++) {
    if (free[i] <= now) { free[i] = now + COOLDOWN; submit(cola.shift(), i); }
  }
  await Promise.all([...inflight.entries()].map(([v, s]) => poll(v, s)));
  await sleep(POLL_MS);
}
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} ===`);
