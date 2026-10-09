// gen_images_ref.mjs — genera imágenes realistas con la API de OpenAI usando una
// IMAGEN DE REFERENCIA del avatar (el presentador), para que las imágenes lo muestren
// A ÉL (preparando una mezcla, una anécdota, etc.). Usa /v1/images/edits cuando el
// prompt trae `ref`, y cae a /v1/images/generations (texto→imagen) cuando no.
//
// Estética objetivo (nicho jardinería/casero): foto/video handheld documental, real e
// imperfecta, SIN look de estudio. Cada prompt debe llevar su propio negative en el texto.
// Si una imagen lleva TEXTO, aclarar SIEMPRE que va en ESPAÑOL.
//
// Costo (low): ~US$0.005–0.01 por imagen.
//
// Lista de prompts — public/img/prompts_ref.json:
//   [
//     // con el avatar (usa referencia):
//     { "name": "el_mezcla", "ref": ["_avatar_ref.png"],
//       "prompt": "Realistic handheld 16:9 video frame... the SAME man from the reference image, mixing powder in a bucket... ultra realistic. Negative: studio, CGI, ..." },
//     // sin avatar (texto→imagen):
//     { "name": "gondola_producto",
//       "prompt": "Realistic handheld 16:9 video frame inside a hardware store shelf... ultra realistic. Negative: ..." }
//   ]
//
// Uso:
//   node gen_images_ref.mjs [prompts.json=public/img/prompts_ref.json] [outDir=public/img] [concurrency=3]
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

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("Falta OPENAI_API_KEY (set OPENAI_API_KEY=sk-... o ponela en .env).");
  process.exit(1);
}

const [promptsArg, outArg, concArg] = process.argv.slice(2);
const PROMPTS = promptsArg || "public/img/prompts_ref.json";
const OUT = outArg || "public/img";
const CONC = Number(concArg) || 3;
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "low";
const DEFAULT_SIZE = process.env.OPENAI_IMAGE_SIZE || "1536x1024"; // 16:9

fs.mkdirSync(OUT, { recursive: true });

if (!fs.existsSync(PROMPTS)) {
  console.error("No existe la lista de prompts:", PROMPTS);
  process.exit(1);
}
const list = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));

const mimeOf = (p) => (/\.jpe?g$/i.test(p) ? "image/jpeg" : "image/png");
const resolveRef = (r) => (fs.existsSync(r) ? r : path.join(OUT, r));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch con reintento ante 429 (rate limit). Respeta "try again in Xs" del cuerpo.
const fetchRetry = async (url, opts, label, tries = 6) => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    const txt = await res.text();
    if (res.status === 429 && attempt <= tries) {
      const m = txt.match(/try again in ([\d.]+)s/i);
      const wait = Math.ceil((m ? parseFloat(m[1]) : 15) + 2) * 1000;
      console.log(`… ${label} rate-limited, espero ${wait / 1000}s (intento ${attempt}/${tries})`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${label} ${res.status} ${txt.slice(0, 200)}`);
  }
};

// texto→imagen
const generate = async (prompt, size, bg) => {
  const body = { model: MODEL, prompt, size, quality: QUALITY, n: 1 };
  if (bg) body.background = bg;
  const res = await fetchRetry(
    (() => { throw new Error("⛔ REGLA 8-oct-2026: imágenes SIN cara → agnes-image GRATIS. Usá scripts/gptimg.mjs (desvía solo las sin ref a agnes) o scripts/agnes_img.mjs."); })(),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
    },
    "gen",
  );
  return res.json();
};

// imagen(es) de referencia + prompt → imagen (mantiene la persona)
const edit = async (prompt, size, refs, bg) => {
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", prompt);
  form.append("size", size);
  form.append("quality", QUALITY);
  form.append("n", "1");
  if (bg) form.append("background", bg);
  for (const r of refs) {
    const file = resolveRef(r);
    if (!fs.existsSync(file)) throw new Error(`ref no existe: ${file}`);
    const buf = fs.readFileSync(file);
    form.append("image[]", new Blob([buf], { type: mimeOf(file) }), path.basename(file));
  }
  const res = await fetchRetry(
    "https://api.openai.com/v1/images/edits",
    { method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: form },
    "edit",
  );
  return res.json();
};

const genOne = async (item) => {
  const { name, prompt, size = DEFAULT_SIZE, ref } = item;
  const dest = path.join(OUT, `${name}.png`);
  if (fs.existsSync(dest)) {
    console.log(`= ya existe  ${name}.png`);
    return { name, prompt, file: `${name}.png`, skipped: true };
  }
  const useRef = Array.isArray(ref) && ref.length > 0;
  const data = useRef ? await edit(prompt, size, ref, item.bg) : await generate(prompt, size, item.bg);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("respuesta sin b64_json");
  const buf = Buffer.from(b64, "base64");
  fs.writeFileSync(dest, buf);
  const usage = data.usage || {};
  console.log(
    `↓ ${name}.png  ${(buf.length / 1e6).toFixed(2)}MB  ${size}  ${useRef ? "[REF " + ref.join("+") + "]" : "[txt]"}  tokens_out=${usage.output_tokens ?? "?"}`,
  );
  return { name, prompt, file: `${name}.png`, size, quality: QUALITY, model: MODEL, ref: ref || null };
};

// pool de concurrencia simple
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
await Promise.all(Array.from({ length: Math.min(CONC, list.length) }, worker));

fs.writeFileSync(path.join(OUT, "img_index_ref.json"), JSON.stringify(index, null, 2));
const ok = index.filter((x) => x && !x.error).length;
console.log(`\n=== LISTO === ${ok}/${list.length} imágenes · índice en ${OUT}/img_index_ref.json`);
