// gen_video.mjs — genera CLIPS de video con deAPI.ai (LTX-Video-0.9.8 13B) por
// IMAGE-TO-VIDEO, en lote. Primero la imagen (gen_deapi.mjs), después acá la animamos:
// text-to-video rinde peor, así que SIEMPRE partimos de una imagen ya generada.
//
// LTX 0.9.8: fps fijo 30, steps fijo 1, máx 768x768, frames 30-120 (120 = 4s).
// Dimensión por defecto 768x432 (16:9). Muy barato.
//
// ── THROUGHPUT (mismo arreglo que gen_deapi.mjs) ─────────────────────────────
// API async (submit → poll → download). El 429 cuenta TODAS las requests por
// ventana, así que el cuello es spamear polls, NO la API. Acá: muchos jobs en
// vuelo + un "gate" global que espacia toda llamada >= GAP_MS, con backoff
// automático ante 429. Tuneable: DEAPI_GAP_MS, DEAPI_INFLIGHT, DEAPI_POLL_EVERY_MS.
//
// Requisitos:
//   - API key de deAPI. Pasala por:  set DEAPI_API_KEY=12669|...   (o en .env)
//   - Las imágenes de origen ya bajadas en public/img/<name>.png
//
// Lista de clips — public/vid/clips.json:
//   [
//     { "name": "estepa_pan", "image": "estepa_invierno", "prompt": "slow camera pan, wind moving the grass" },
//     { "name": "ger_humo",   "image": "ger_noche", "prompt": "smoke rising slowly", "frames": 90 }
//   ]
//   ("image" = nombre del png en public/img, sin extensión)
//
// Uso:
//   node gen_video.mjs [clips.json=public/vid/clips.json] [imgDir=public/img] [outDir=public/vid] [inflight=6]
import fs from "fs";
import path from "path";

const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ── POOL de keys que ROTA POR-CLIP (no por-request: el polling de un clip debe ir a
// la MISMA cuenta que lo creó). Con N cuentas free, cada una ve solo 1/N de las
// requests → se reparte el rate-limit de ~10 RPM. Regla: GAP × N ≥ 6000ms para que
// ninguna key pase los 10 RPM. Pasá varias con DEAPI_KEYS=key1,key2,key3 (o una sola
// en DEAPI_API_KEY). Cada key free trae su crédito → sumás velocidad Y saldo gratis.
const KEYS = (process.env.DEAPI_KEYS || process.env.DEAPI_API_KEY || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
if (!KEYS.length) {
  console.error("Falta DEAPI_API_KEY o DEAPI_KEYS=key1,key2,... en el entorno o .env.");
  process.exit(1);
}
const authH = (k) => ({ Authorization: `Bearer ${k}`, Accept: "application/json" });
if (KEYS.length > 1) console.log(`deAPI: POOL de ${KEYS.length} keys rotando por-clip. Para free tier (~10 RPM) usá GAP × ${KEYS.length} ≥ 6000ms (ej. DEAPI_GAP_MS=${Math.ceil(6000 / KEYS.length)}).`);

const [clipsArg, imgArg, outArg, concArg] = process.argv.slice(2);
const CLIPS = clipsArg || "public/vid/clips.json";
const IMGDIR = imgArg || "public/img";
const OUT = outArg || "public/vid";
// "inflight" = trabajos en vuelo a la vez (submit + poll). El gate global controla
// el ritmo real de requests, así que se puede tener varios sin comerse el 429.
const INFLIGHT = Number(concArg) || Number(process.env.DEAPI_INFLIGHT) || 6;
const MODEL = process.env.DEAPI_VIDEO_MODEL || "Ltxv_13B_0_9_8_Distilled_FP8";
const DEFAULT_W = Number(process.env.DEAPI_VIDEO_W) || 768;
const DEFAULT_H = Number(process.env.DEAPI_VIDEO_H) || 432;
const DEFAULT_FRAMES = Number(process.env.DEAPI_VIDEO_FRAMES) || 120; // 4s @30fps
const FPS = 30; // LTX 0.9.8: fijo
const STEPS = 1; // LTX 0.9.8: fijo

const BASE = "https://api.deapi.ai/api/v1/client";

fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(CLIPS)) {
  console.error("No existe la lista de clips:", CLIPS);
  process.exit(1);
}
const list = JSON.parse(fs.readFileSync(CLIPS, "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Gate global de requests (igual que gen_deapi.mjs): espacia TODA llamada HTTP
// >= GAP_MS y hace backoff automático ante 429/503. Es lo que mantiene el ritmo
// bajo aunque haya varios jobs en vuelo. Tuneable: DEAPI_GAP_MS, DEAPI_INFLIGHT. ──
let GAP = Number(process.env.DEAPI_GAP_MS) || 650; // ms mínimos entre dos requests
const GAP_MAX = Number(process.env.DEAPI_GAP_MAX_MS) || 6000;
let lastAt = 0;
let chain = Promise.resolve();
function reserve() {
  const mine = chain.then(async () => {
    const wait = Math.max(0, lastAt + GAP - Date.now());
    if (wait) await sleep(wait);
    lastAt = Date.now();
  });
  chain = mine.catch(() => {});
  return mine;
}
async function api(url, opts = {}, tries = 8) {
  for (let t = 0; t < tries; t++) {
    await reserve();
    let res;
    try {
      res = await fetch(url, opts);
    } catch (e) {
      await sleep(800 * (t + 1));
      continue; // error de red transitorio
    }
    if (res.status === 429 || res.status === 503) {
      GAP = Math.min(Math.round(GAP * 1.6), GAP_MAX); // backoff
      const ra = Number(res.headers.get("retry-after"));
      await sleep(ra ? ra * 1000 : GAP);
      continue;
    }
    if (res.ok && GAP > 650) GAP = Math.max(650, Math.round(GAP * 0.92)); // relajar
    return res;
  }
  throw new Error(`api ${url.split("/").pop()} agotó reintentos (gap=${GAP}ms)`);
}

const POLL_EVERY = Number(process.env.DEAPI_POLL_EVERY_MS) || 4000;
async function pollResult(requestId, label, H) {
  for (let i = 0; i < 240; i++) {
    const res = await api(`${BASE}/request-status/${requestId}`, { headers: H });
    const j = await res.json();
    const d = j?.data || {};
    if (d.status === "done") return d.result_url;
    if (d.status === "error") throw new Error(`job error: ${JSON.stringify(d).slice(0, 200)}`);
    await sleep(POLL_EVERY);
  }
  throw new Error(`timeout esperando ${label}`);
}

const genOne = async (item, jobIdx = 0) => {
  const H = authH(KEYS[jobIdx % KEYS.length]); // esta cuenta hace submit + polls de ESTE clip
  const {
    name,
    image,
    prompt,
    width = DEFAULT_W,
    height = DEFAULT_H,
    frames = DEFAULT_FRAMES,
    negative_prompt,
  } = item;
  const dest = path.join(OUT, `${name}.mp4`);
  if (fs.existsSync(dest)) {
    console.log(`= ya existe  ${name}.mp4`);
    return { name, image, prompt, file: `${name}.mp4`, skipped: true };
  }
  const imgPath = path.join(IMGDIR, `${image}.png`);
  if (!fs.existsSync(imgPath)) throw new Error(`falta imagen de origen: ${imgPath}`);

  const seed = item.seed ?? Math.floor(Math.random() * 1e9);
  const fd = new FormData();
  fd.set("model", MODEL);
  fd.set("prompt", prompt);
  fd.set("width", String(width));
  fd.set("height", String(height));
  fd.set("steps", String(STEPS));
  fd.set("frames", String(frames));
  fd.set("fps", String(FPS));
  fd.set("seed", String(seed));
  if (negative_prompt) fd.set("negative_prompt", negative_prompt);
  const bytes = fs.readFileSync(imgPath);
  fd.set("first_frame_image", new Blob([bytes], { type: "image/png" }), `${image}.png`);

  const sub = await api(`${BASE}/img2video`, { method: "POST", headers: H, body: fd });
  if (!sub.ok) throw new Error(`submit ${sub.status} ${(await sub.text()).slice(0, 200)}`);
  const requestId = (await sub.json())?.data?.request_id;
  if (!requestId) throw new Error("respuesta sin request_id");

  const url = await pollResult(requestId, name, H);
  const vid = await fetch(url); // descarga directa del CDN (no cuenta para el límite)
  const buf = Buffer.from(await vid.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`↓ ${name}.mp4  ${(buf.length / 1e6).toFixed(2)}MB  ${width}x${height}  ${frames}f@${FPS}fps  seed=${seed}`);
  return { name, image, prompt, file: `${name}.mp4`, width, height, frames, fps: FPS, seed, model: MODEL, request_id: requestId };
};

const index = new Array(list.length);
let next = 0;
const worker = async () => {
  while (next < list.length) {
    const i = next++;
    const item = list[i];
    try {
      index[i] = await genOne(item, i);
    } catch (e) {
      console.error(`✗ ${item.name} — ${e.message}`);
      index[i] = { name: item.name, error: e.message };
    }
  }
};
await Promise.all(Array.from({ length: Math.min(INFLIGHT, list.length) }, worker));

fs.writeFileSync(path.join(OUT, "vid_index.json"), JSON.stringify(index, null, 2));
const ok = index.filter((x) => x && !x.error).length;
console.log(`\n=== LISTO === ${ok}/${list.length} clips · índice en ${OUT}/vid_index.json`);
