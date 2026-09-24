// gen_deapi.mjs — genera imágenes con deAPI.ai (FLUX.2 Klein 4B) POR TEXTO, en lote.
// Mismo flujo que gen_images.mjs (OpenAI) pero MUCHO más barato (~US$0.004/imagen).
// Yo escribo los prompts, el script baja todo a public/img/<nombre>.png y arma índice.
// Así monto la edición leyendo SOLO nombres/prompts: 0 tokens de visión.
//
// FLUX.2 Klein: steps fijo en 4, SIN guidance ni negative prompt. Dimensión por
// defecto 1536x832 (16:9, máx permitido 1536). Resolución múltiplo de 16.
//
// ── THROUGHPUT (clave para no comerse el 429) ────────────────────────────────
// La API es async: submit → poll → download. El límite de deAPI cuenta TODAS las
// requests (submits + polls) por ventana de tiempo. El cuello de botella NO es la
// API (está hecha para miles de usuarios) sino spamearla con polls. Por eso acá:
//   1) Se mandan MUCHOS trabajos a la vez (el server los procesa en paralelo).
//   2) TODA llamada HTTP pasa por un "gate" global que la espacia >= GAP_MS, así
//      el ritmo de requests es parejo y bajo aunque haya 50 jobs en vuelo.
//   3) Si igual aparece un 429, el gate agranda el GAP solo (backoff) y reintenta.
// Resultado: 100 imágenes salen en el tiempo de las más lentas, no en lotes
// serializados con cooldowns. Tuneable por env: DEAPI_GAP_MS, DEAPI_INFLIGHT.
//
// Requisitos:
//   - API key de deAPI. Pasala por:  set DEAPI_API_KEY=12669|...   (o en .env)
//
// Lista de prompts — public/img/prompts.json:
//   [
//     { "name": "estepa_invierno", "prompt": "A realistic documentary photo ..." },
//     { "name": "ger_noche",       "prompt": "...", "width": 832, "height": 1536 }
//   ]
//
// Uso:
//   node gen_deapi.mjs [prompts.json=public/img/prompts.json] [outDir=public/img] [inflight=12]
import fs from "fs";
import path from "path";

// .env mínimo (sin dependencias)
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const KEY = process.env.DEAPI_API_KEY;
if (!KEY) {
  console.error("Falta DEAPI_API_KEY (set DEAPI_API_KEY=12669|... o ponela en .env).");
  process.exit(1);
}

const [promptsArg, outArg, concArg] = process.argv.slice(2);
const PROMPTS = promptsArg || "public/img/prompts.json";
const OUT = outArg || "public/img";
// "inflight" = cuántos trabajos tenemos en vuelo a la vez (submit + poll). Alto está
// bien: el server los hace en paralelo; el gate global controla el ritmo de requests.
const INFLIGHT = Number(concArg) || Number(process.env.DEAPI_INFLIGHT) || 12;
const MODEL = process.env.DEAPI_IMAGE_MODEL || "Flux_2_Klein_4B_BF16";
const DEFAULT_W = Number(process.env.DEAPI_IMAGE_W) || 1536;
const DEFAULT_H = Number(process.env.DEAPI_IMAGE_H) || 832;
const STEPS = Number(process.env.DEAPI_STEPS) || 4; // Klein=4; Z-Image-Turbo=8 (DEAPI_STEPS=8)

const BASE = "https://api.deapi.ai/api/v1/client";
const H = { Authorization: `Bearer ${KEY}`, Accept: "application/json" };

fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(PROMPTS)) {
  console.error("No existe la lista de prompts:", PROMPTS);
  process.exit(1);
}
const list = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Gate global de requests: espacia TODA llamada HTTP >= GAP_MS y hace backoff
// automático ante 429/5xx. Es lo que mantiene el ritmo bajo aunque haya N jobs. ──
let GAP = Number(process.env.DEAPI_GAP_MS) || 650; // ms mínimos entre dos requests
const GAP_MAX = Number(process.env.DEAPI_GAP_MAX_MS) || 6000;
let lastAt = 0;
let chain = Promise.resolve(); // serializa la "salida" de requests
function reserve() {
  // Encadena para que solo salga 1 request por vez, espaciado >= GAP.
  const mine = chain.then(async () => {
    const wait = Math.max(0, lastAt + GAP - Date.now());
    if (wait) await sleep(wait);
    lastAt = Date.now();
  });
  chain = mine.catch(() => {});
  return mine;
}
// fetch con gate + reintento ante 429 (agranda GAP) y errores de red transitorios.
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
      GAP = Math.min(Math.round(GAP * 1.6), GAP_MAX); // backoff: más espacio entre requests
      const ra = Number(res.headers.get("retry-after"));
      await sleep(ra ? ra * 1000 : GAP);
      continue;
    }
    // si venía agrandado y ahora va fino, relajar de a poco
    if (res.ok && GAP > 650) GAP = Math.max(650, Math.round(GAP * 0.92));
    return res;
  }
  throw new Error(`api ${url.split("/").pop()} agotó reintentos (gap=${GAP}ms)`);
}

// Espera a que un request_id termine y devuelve la URL del resultado.
// Poll espaciado (cada job no se re-consulta más seguido que POLL_EVERY); además
// cada poll pasa por el gate global, así que el ritmo total queda acotado.
const POLL_EVERY = Number(process.env.DEAPI_POLL_EVERY_MS) || 4000;
async function pollResult(requestId, label) {
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

const genOne = async (item) => {
  const { name, prompt, width = DEFAULT_W, height = DEFAULT_H } = item;
  const dest = path.join(OUT, `${name}.png`);
  if (fs.existsSync(dest)) {
    console.log(`= ya existe  ${name}.png`);
    return { name, prompt, file: `${name}.png`, skipped: true };
  }
  const seed = item.seed ?? Math.floor(Math.random() * 1e9);
  const body = { model: MODEL, prompt, width, height, steps: STEPS, seed };
  const sub = await api(`${BASE}/txt2img`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!sub.ok) throw new Error(`submit ${sub.status} ${(await sub.text()).slice(0, 200)}`);
  const requestId = (await sub.json())?.data?.request_id;
  if (!requestId) throw new Error("respuesta sin request_id");

  const url = await pollResult(requestId, name);
  const img = await fetch(url); // descarga directa del CDN (no cuenta para el límite de la API)
  const buf = Buffer.from(await img.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`↓ ${name}.png  ${(buf.length / 1e6).toFixed(2)}MB  ${width}x${height}  seed=${seed}`);
  return { name, prompt, file: `${name}.png`, width, height, seed, model: MODEL, request_id: requestId };
};

// Pool de jobs en vuelo: muchos a la vez, el gate global controla el ritmo real.
const index = new Array(list.length);
let next = 0;
const worker = async () => {
  while (next < list.length) {
    const i = next++;
    const item = list[i];
    try {
      index[i] = await genOne(item);
    } catch (e) {
      console.error(`✗ ${item.name} — ${e.message}`);
      index[i] = { name: item.name, prompt: item.prompt, error: e.message };
    }
  }
};
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(INFLIGHT, list.length) }, worker));

fs.writeFileSync(path.join(OUT, "img_index.json"), JSON.stringify(index, null, 2));
const ok = index.filter((x) => x && !x.error).length;
const secs = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`\n=== LISTO === ${ok}/${list.length} imágenes en ${secs}s · gap final ${GAP}ms · índice en ${OUT}/img_index.json`);
