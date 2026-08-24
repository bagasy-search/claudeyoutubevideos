// gen_agnes_img_fcssenales.mjs — generador PACIENTE de imágenes agnes.
//
// Por qué existe (medido 24-ago-2026): `gen_agnes.mjs` usa UNA sola AGNES_API_KEY y sólo
// 3 reintentos. Con otra sesión generando en paralelo, el endpoint de imágenes devuelve
// HTTP 429 casi siempre → 251 de 345 fotos se perdieron para siempre en una corrida.
// Este runner: (a) ROTA las 16 AGNES_KEYS, (b) enfría la clave que devuelve 429 en vez de
// castigar al item, (c) reintenta el item hasta agotar el presupuesto de tiempo.
//
//   node gen_agnes_img_fcssenales.mjs <lista.json> [outDir] [size] [conc]
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST, OUT = "public/img", SIZE = "1792x1024", CONC = "6"] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const BASE = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const MODEL = process.env.AGNES_IMAGE_MODEL || "agnes-image-2.1-flash";
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 32_000;          // lo que se enfría una clave tras un 429
const MAX_TRIES = 40;             // por item
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });
const has = (n) => ["png", "jpg", "jpeg", "webp"].some((e) => fs.existsSync(path.join(OUT, `${n}.${e}`)));
const cola = items.filter((it) => { const n = it.nombre || it.name; return n && it.prompt && !has(n); });
console.log(`agnes-img PACIENTE (${MODEL}, ${SIZE}) · total ${items.length} · a generar ${cola.length} · claves ${KS.length}`);

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
  for (let t = 1; t <= MAX_TRIES; t++) {
    const ki = await pickKey();
    try {
      const r = await fetch(`${BASE}/images/generations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KS[ki]}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: it.prompt, n: 1, size: SIZE }),
      });
      if (r.status === 429) { free[ki] = Date.now() + COOLDOWN; r429++; continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const url = j?.data?.[0]?.url, b64 = j?.data?.[0]?.b64_json;
      let buf;
      if (url) { const g = await fetch(url); if (!g.ok) throw new Error(`descarga ${g.status}`); buf = Buffer.from(await g.arrayBuffer()); }
      else if (b64) buf = Buffer.from(b64, "base64");
      else throw new Error("sin imagen en la respuesta");
      fs.writeFileSync(path.join(OUT, `${n}.png`), buf);
      ok++;
      if (ok % 10 === 0) console.log(`  ✓ ${ok}/${cola.length}  (429 ${r429}, fail ${fail})`);
      return;
    } catch (e) {
      if (t === MAX_TRIES) { fail++; console.log(`  ✗ ${n}: ${String(e.message).slice(0, 80)}`); return; }
      await sleep(3000);
    }
  }
};

const workers = Array.from({ length: Math.min(Number(CONC), 12) }, async () => {
  for (;;) { const it = cola.shift(); if (!it) return; await one(it); }
});
await Promise.all(workers);
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} · 429 absorbidos ${r429} ===`);
