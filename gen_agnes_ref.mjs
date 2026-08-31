// gen_agnes_ref.mjs — agnes IMAGE-TO-IMAGE con REFERENCIAS (identidad real del presentador).
//
// ⛔ Lo que veníamos haciendo mal: `gen_agnes.mjs` es text-to-image puro (nunca mandó una
// referencia), así que cada foto inventaba una cara distinta. La referencia NO va en el nivel
// superior del JSON: va DENTRO de `extra_body.image` como ARRAY de data-URIs base64, y
// `response_format` también va dentro de `extra_body`. Sin `tags:["img2img"]` (agnes no lo usa).
//
//   node gen_agnes_ref.mjs <lista.json> [outDir] [conc]
//
// lista.json = [{ nombre, prompt, ref?: ["public/ref_x.png", ...], preserve?, change?, style?,
//                 size?: "2K", ratio?: "16:9" }, ...]
// Referencias por defecto para TODA la lista: AGNES_REF="public/ref_pxhvac.png[,otra.png]"
// La 1ª referencia es SIEMPRE la de IDENTIDAD; las siguientes son ropa/escena.
//
// Si el item trae `change` (y opcionalmente preserve/style) se arma el prompt con el andamio
// PRESERVE / CHANGE / STYLE. Si trae `prompt`, se usa tal cual.
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST, OUT = "public/img", CONC = "6"] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const BASE = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const MODEL = process.env.AGNES_IMAGE_MODEL || "agnes-image-2.1-flash";
const DEF_REFS = (process.env.AGNES_REF || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 32_000;
const MAX_TRIES = 40;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- data-URI de un archivo local (NUNCA mandar la ruta ni file://) ----------
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const cacheURI = new Map();
const dataURI = (p) => {
  if (cacheURI.has(p)) return cacheURI.get(p);
  const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  if (!fs.existsSync(abs)) throw new Error(`referencia inexistente: ${p}`);
  const mime = MIME[path.extname(abs).toLowerCase()] || "image/png";
  const uri = `data:${mime};base64,${fs.readFileSync(abs).toString("base64")}`;
  cacheURI.set(p, uri);
  return uri;
};

// ---------- andamio PRESERVE / CHANGE / STYLE ----------
const PRESERVE_DEF =
  "This is a controlled image-to-image edit. Use the input image as the primary identity reference. " +
  "Preserve the exact same face, eyes, nose, mouth, hair, beard, age, skin tone, body proportions, " +
  "clothing and natural facial asymmetry. Do not create a different person, do not beautify, " +
  "de-age or smooth the skin.";
// ⛔ COMPUERTA 1 de la skill agnes-broll: CERO vocabulario de foto en el STYLE.
// "casual phone snapshot" / "cinematic" / "35mm" mandan al modelo al cliché del género (o le dibujan
// el celular dentro del cuadro). Se describe la LUZ y la MATERIA, no el género de la imagen.
const STYLE_DEF =
  "STYLE: ordinary indoor light from the room's own lamps or a small window, muted colors, " +
  "visible skin pores and stubble, worn everyday surfaces, hands with normal knuckles and nails, " +
  "nothing staged, nothing polished, no beauty retouching.";

const buildPrompt = (it, nRefs) => {
  if (it.prompt && !it.change) return it.prompt;
  const multi = nRefs > 1
    ? " The first image is the identity reference; the following images are only clothing or environment references."
    : "";
  return [
    `PRESERVE: ${it.preserve || PRESERVE_DEF}${multi}`,
    `CHANGE: ${it.change || it.prompt}`,
    it.style || STYLE_DEF,
  ].join("\n");
};

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });
const has = (n) => ["png", "jpg", "jpeg", "webp"].some((e) => fs.existsSync(path.join(OUT, `${n}.${e}`)));
const cola = items.filter((it) => { const n = it.nombre || it.name; return n && (it.prompt || it.change) && !has(n); });
console.log(`agnes-REF (${MODEL}) · total ${items.length} · a generar ${cola.length} · claves ${KS.length} · refs def ${DEF_REFS.length || 0}`);

const free = KS.map(() => 0);
let ok = 0, fail = 0, r429 = 0;
const pickKey = async () => {
  for (;;) {
    const now = Date.now();
    let best = -1, bestT = Infinity;
    for (let i = 0; i < KS.length; i++) if (free[i] < bestT) { bestT = free[i]; best = i; }
    if (bestT <= now) return best;
    await sleep(Math.min(2000, bestT - now));
  }
};

const one = async (it) => {
  const n = it.nombre || it.name;
  const refs = (it.ref && it.ref.length ? it.ref : DEF_REFS);
  let images;
  try { images = refs.map(dataURI); }
  catch (e) { fail++; console.log(`  ✗ ${n}: ${e.message}`); return; }
  const prompt = buildPrompt(it, images.length);

  for (let t = 1; t <= MAX_TRIES; t++) {
    const ki = await pickKey();
    try {
      const body = {
        model: MODEL,
        prompt,
        size: it.size || "2K",
        ratio: it.ratio || "16:9",
      };
      if (images.length) body.extra_body = { image: images, response_format: "b64_json" };
      // ⛔ COMPUERTA 0.bis: SIN referencia, `b64_json` no contesta NUNCA (se cuelga hasta
      // agotar los intentos y el item muere en silencio). Sin imagen va `url`.
      else body.extra_body = { response_format: "url" };

      const r = await fetch(`${BASE}/images/generations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KS[ki]}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.status === 429) { free[ki] = Date.now() + COOLDOWN; r429++; continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
      const j = await r.json();
      const url = j?.data?.[0]?.url, b64 = j?.data?.[0]?.b64_json;
      let buf;
      if (b64) buf = Buffer.from(b64, "base64");
      else if (url) { const g = await fetch(url); if (!g.ok) throw new Error(`descarga ${g.status}`); buf = Buffer.from(await g.arrayBuffer()); }
      else throw new Error("sin imagen en la respuesta");
      fs.writeFileSync(path.join(OUT, `${n}.png`), buf);
      ok++;
      if (ok % 10 === 0) console.log(`  ✓ ${ok}/${cola.length}  (429 ${r429}, fail ${fail})`);
      return;
    } catch (e) {
      if (t === MAX_TRIES) { fail++; console.log(`  ✗ ${n}: ${String(e.message).slice(0, 120)}`); return; }
      await sleep(3000);
    }
  }
};

const workers = Array.from({ length: Math.min(Number(CONC), 12) }, async () => {
  for (;;) { const it = cola.shift(); if (!it) return; await one(it); }
});
await Promise.all(workers);
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} · 429 absorbidos ${r429} ===`);
