// fetch_bing.mjs — descarga MASIVA de imágenes REALES de la web vía Bing Images
// (sin API key, sin captcha — Bing es permisivo). Replica lo que hace el canal
// competidor: imágenes editoriales/reales de buscador, NO stock genérico.
//
// ⚠ Estas imágenes son de TERCEROS con copyright (zona gris, igual que rippear
// clips de YouTube). Para fuentes con licencia libre usá fetch_real.mjs (Wikimedia/
// Openverse). Revisá antes de monetizar; preferí desduplicar/recortar/transformar.
//
// Uso:
//   node fetch_bing.mjs "una query suelta"                 → solo lista URLs (prueba)
//   node fetch_bing.mjs public/real/bing_<slug>.json       → baja según lista
//      lista = [{ "name":"rafael_fabrica", "query":"old man factory worker 1970s", "count":3 }]
//
// Salida: public/real/<name>.<ext>  (+ no pisa existentes)

import fs from "fs";
import path from "path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const H = { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" };

// DuckDuckGo Images (sin API key) → JSON limpio con {image,width,height,source,title}.
// Flujo: 1) pedir token vqd  2) pegarle a /i.js con ese token.
// dominios de stock/cutout/marca de agua a descartar (ampliado)
const STOCK =
  /shutterstock|dreamstime|istockphoto|gettyimages|alamy|123rf|depositphotos|stock\.adobe|adobestock|ftcdn\.net|fotolia|envato|bigstock|stockcake|pngtree|favpng|kindpng|pngitem|cleanpng|rawpixel|vecteezy|freepik|pond5|pixabay|canstock|lovepik|pikbest|seekpng/i;

// calidad mínima — FILTRO DURO (feedback usuario: maxear lo gratis): foto real apaisada,
// resolución decente, sin cuadrados/verticales (cutouts) ni ultrapanorámicas.
function goodPhoto(o) {
  if (!o.w || !o.h) return false; // sin datos de tamaño → descartar (no arriesgar)
  if (o.w < 820 || o.h < 460) return false; // muy chica
  const ar = o.w / o.h;
  if (ar < 1.1) return false; // cuadrado o vertical → fuera (queremos apaisado ~16:9)
  if (ar > 2.6) return false; // banner ultrapanorámico → fuera
  return true;
}

async function ddgImages(query, count = 60, { noStock = true } = {}) {
  // 1) token vqd
  const tokRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: H,
  });
  const tokHtml = await tokRes.text();
  const vqd =
    (tokHtml.match(/vqd=["']([\d-]+)["']/) || tokHtml.match(/vqd=([\d-]+)&/) || [])[1];
  if (!vqd) throw new Error("sin token vqd");
  // 2) páginas de resultados
  const out = [];
  let next = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`;
  for (let pg = 0; pg < 6 && out.length < count && next; pg++) {
    const r = await fetch(next, { headers: { ...H, Referer: "https://duckduckgo.com/" } });
    if (!r.ok) break;
    const j = await r.json();
    for (const it of j.results || []) {
      if (!/^https?:\/\//.test(it.image)) continue;
      if (noStock && STOCK.test(it.image + " " + (it.source || ""))) continue;
      const o = { url: it.image, w: it.width, h: it.height, source: it.source, title: it.title };
      if (!goodPhoto(o)) continue;
      out.push(o);
    }
    next = j.next ? `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&s=${(pg + 1) * 100}` : null;
    await new Promise((r) => setTimeout(r, 200));
  }
  // dedup por URL
  const seen = new Set();
  return out.filter((o) => (seen.has(o.url) ? false : seen.add(o.url)));
}
const bingSearch = (q, c) => ddgImages(q, c).then((a) => a.map((o) => o.url));

const extFromUrl = (u) => {
  const m = u.split("?")[0].match(/\.(jpg|jpeg|png|webp)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
};

async function download(url, dest) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 8000) throw new Error("muy chica");
    fs.writeFileSync(dest, buf);
    return buf.length;
  } finally {
    clearTimeout(to);
  }
}

const arg = process.argv[2];
if (!arg) {
  console.error('Uso: node fetch_bing.mjs "query"   |   node fetch_bing.mjs lista.json');
  process.exit(1);
}

// Modo prueba: query suelta → lista resultados con resolución + fuente
if (!arg.endsWith(".json")) {
  const t0 = Date.now();
  const res = await ddgImages(arg, 80);
  console.log(`"${arg}" → ${res.length} imágenes reales en ${Date.now() - t0}ms`);
  res.slice(0, 10).forEach((o) =>
    console.log(`  ${String(o.w + "x" + o.h).padEnd(11)} ${(o.source || "").padEnd(16)} ${o.url.slice(0, 80)}`),
  );
  process.exit(0);
}

// Modo lista: baja N por cada toma. Por defecto RE-RANKEA con CLIP local (0 tokens):
//   baja varios candidatos, CLIP puntúa cada uno contra el `concept` (o la query) y
//   PENALIZA marca de agua / texto quemado, y se queda con los `count` mejores.
//   Desactivar con RANK=0 (baja los primeros sin rankear). Más candidatos: RANK_CANDS.
const OUT = process.env.OUTDIR || "public/real";
const FORCE_PNG = process.env.ASPNG === "1"; // guardar como <name>.png (el navegador sniffea el formato real)
fs.mkdirSync(OUT, { recursive: true });
const shots = JSON.parse(fs.readFileSync(arg, "utf8").replace(/^﻿/, ""));
const RANK = process.env.RANK !== "0";
const RANK_CANDS = +(process.env.RANK_CANDS || 24); // candidatos a puntuar por toma (gratis → maxeado)

// ── CLIP local (mismo setup que matchclip.mjs): rankea relevancia + castiga marca/ texto ──
let clf = null;
if (RANK) {
  try {
    const { pipeline } = await import("@huggingface/transformers");
    const MODEL = process.env.MATCH_MODEL || "Xenova/clip-vit-base-patch32";
    // GPU (DirectML) por DEFECTO, igual que matchclip.mjs — es el mismo modelo y la misma librería,
    // y acá estaba cayendo a CPU/q8 sin motivo (~17 min extra por video). Override: CLIP_DEVICE=cpu
    const DEV = process.env.CLIP_DEVICE === "cpu" ? "" : (process.env.CLIP_DEVICE || "dml");
    const DTY = process.env.CLIP_DTYPE || (DEV ? "fp32" : "q8");
    console.log(`cargando CLIP local (${MODEL}, ${DTY}, ${DEV || "CPU"}) para re-ranking…`);
    clf = await pipeline("zero-shot-image-classification", MODEL, DEV ? { device: DEV, dtype: DTY } : { dtype: DTY });
  } catch (e) {
    console.warn(`(CLIP no disponible: ${e.message} → bajo sin rankear)`);
  }
}
const DISTRACTORS = [
  "an unrelated or random photo",
  "a blurry low quality image",
];
const TEXT_LABELS = [
  "a stock photo with a watermark across it",
  "large bold text or a caption overlaid on the image",
  "a logo or banner overlay",
];
const scoreImage = async (file, concept) => {
  const out = await clf(file, [concept, ...DISTRACTORS, ...TEXT_LABELS]);
  const get = (l) => out.find((o) => o.label === l)?.score || 0;
  const textMax = Math.max(...TEXT_LABELS.map(get));
  return get(concept) * (textMax > 0.14 ? 0.06 : 1); // marca/texto prominente → casi descartado (filtro duro)
};

const TMP = "_bingtmp";
fs.mkdirSync(TMP, { recursive: true });
let ok = 0,
  fail = 0;
for (const shot of shots) {
  const { name, query, count = 1 } = shot;
  const concept = shot.concept || query; // texto EN de lo que se debe VER
  if (!name || !query) continue;
  // skip incremental: si ya existe la imagen final, no re-bajar
  if (count === 1 && fs.existsSync(path.join(OUT, `${name}.${FORCE_PNG ? "png" : "jpg"}`))) { ok++; continue; }
  process.stdout.write(`• ${name} "${query}"${shot.concept ? ` [${concept}]` : ""} … `);
  try {
    const cands = await bingSearch(query, RANK && clf ? RANK_CANDS : Math.max(count * 4, 12));
    let got = 0;

    if (RANK && clf) {
      // bajar candidatos a temp, puntuar, quedarnos con los mejores
      const scored = [];
      for (let i = 0; i < cands.length && scored.length < RANK_CANDS; i++) {
        const ext = extFromUrl(cands[i]);
        const tmp = path.join(TMP, `${name}_${i}.${ext}`);
        try {
          await download(cands[i], tmp);
          const s = await scoreImage(tmp, concept);
          scored.push({ tmp, ext, s });
        } catch {
          /* skip */
        }
      }
      scored.sort((a, b) => b.s - a.s);
      for (const c of scored.slice(0, count)) {
        const ext = FORCE_PNG ? "png" : c.ext;
        const fname = count > 1 ? `${name}_${got + 1}.${ext}` : `${name}.${ext}`;
        fs.copyFileSync(c.tmp, path.join(OUT, fname));
        process.stdout.write(`✓${c.s.toFixed(2)} `);
        got++;
        ok++;
      }
      // limpiar temp de esta toma
      for (const c of scored) fs.rmSync(c.tmp, { force: true });
      const best = scored[0]?.s ?? 0;
      if (best < 0.5) process.stdout.write(" ⚠dudoso");
    } else {
      // sin CLIP: bajar los primeros que funcionen
      for (const u of cands) {
        if (got >= count) break;
        const ext = FORCE_PNG ? "png" : extFromUrl(u);
        const fname = count > 1 ? `${name}_${got + 1}.${ext}` : `${name}.${ext}`;
        const dest = path.join(OUT, fname);
        if (fs.existsSync(dest)) { got++; continue; }
        try {
          await download(u, dest);
          process.stdout.write("✓ ");
          got++;
          ok++;
        } catch {
          /* siguiente */
        }
      }
    }
    console.log(got ? "" : "✗ sin descargas");
    if (!got) fail++;
  } catch (e) {
    console.log(`✗ ${e.message}`);
    fail++;
  }
  await new Promise((r) => setTimeout(r, 250));
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`\nDONE · ${ok} imágenes${RANK && clf ? " (rankeadas por CLIP)" : ""} · ${fail} tomas sin resultado`);
