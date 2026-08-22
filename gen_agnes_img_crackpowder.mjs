// gen_agnes.mjs — generador de imágenes por la API de agnes-ai (OpenAI-compatible).
//
//   node gen_agnes.mjs <lista.json> <outDir> [size] [modelo]
//
// lista.json = [{ "nombre": "...", "prompt": "..." }, ...]  (también acepta "name")
// Salta las que ya existen, reintenta, y baja la imagen desde la URL que devuelve.
// Medido 2026-08-21: ~25 s por imagen, 16:9 real (1792x1024 -> 1312x736), sin costo.
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST, OUT = "public/img", SIZE = "1792x1024", MODEL = "agnes-image-2.1-flash"] = process.argv.slice(2);
const KEY = process.env.AGNES_API_KEY;
const BASE = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
if (!KEY) { console.error("falta AGNES_API_KEY en .env"); process.exit(1); }

const CONC = Number(process.env.AGNES_CONC || 4);
const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });

const has = (n) => ["png", "jpg", "jpeg", "webp"].some((e) => fs.existsSync(path.join(OUT, `${n}.${e}`)));
const todo = items.filter((it) => { const n = it.nombre || it.name; return n && it.prompt && !has(n); });
console.log(`agnes (${MODEL}, ${SIZE}) · total ${items.length} · a generar ${todo.length} · ya existen ${items.length - todo.length}`);

let ok = 0, fail = 0, done = 0;
const one = async (it) => {
  const n = it.nombre || it.name;
  for (let intento = 1; intento <= 40; intento++) {
    try {
      const r = await fetch(`${BASE}/images/generations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: it.prompt, n: 1, size: SIZE }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const url = j?.data?.[0]?.url;
      const b64 = j?.data?.[0]?.b64_json;
      let buf;
      if (url) { const g = await fetch(url); if (!g.ok) throw new Error(`descarga ${g.status}`); buf = Buffer.from(await g.arrayBuffer()); }
      else if (b64) buf = Buffer.from(b64, "base64");
      else throw new Error("respuesta sin imagen");
      fs.writeFileSync(path.join(OUT, `${n}.png`), buf);
      ok++; return;
    } catch (e) {
      const congested = /HTTP (503|429)/.test(e.message);
      if (intento === 40) { console.log(`  ✗ ${n}: ${e.message}`); fail++; return; }
      // 503 = cola GLOBAL de la cuenta llena (otra tanda corriendo) · 429 = rate limit por clave.
      // Ninguno es un fallo del item: se espera y se reintenta, no se descarta.
      const wait = congested ? Math.min(45000, 8000 + 2000 * intento) : 3000 * Math.min(intento, 4);
      await new Promise((s) => setTimeout(s, wait));
    }
  }
};

const cola = [...todo];
await Promise.all(Array.from({ length: CONC }, async () => {
  while (cola.length) {
    await one(cola.shift());
    if (++done % 5 === 0 || done === todo.length) process.stdout.write(`  ${done}/${todo.length} (ok ${ok}, fail ${fail})\r`);
  }
}));
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} ===`);
