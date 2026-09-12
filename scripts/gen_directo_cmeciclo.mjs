// gen_directo_cmeciclo.mjs — genera las imágenes de OBJETO directo por /v1/images/generations.
//
// Por qué existe: la tanda por Batch de estas 8 quedó 25+ min en 0/8 mientras la del presentador,
// enviada al mismo tiempo, terminaba. El modelo y la calidad son los MISMOS (gpt-image-2 low);
// lo único que se pierde es el 50% de descuento del Batch, que sobre 8 imágenes son centavos.
// ⛔ No cancelo el batch: si termina, su `fetch` saltea las que ya existan en disco.
//
//   node scripts/gen_directo_cmeciclo.mjs <lista.json> <outDir>
import fs from "node:fs";
import path from "node:path";

// ⛔⛔ Si el item trae `ref`, va por /v1/images/edits CON la imagen de referencia. Generarlo por
// /generations ignora la cara y devuelve OTRA PERSONA — me pasó: 10 planos del presentador salieron
// con un tipo distinto. La ref es el crop de cara 128x192 del canal.
const dataUri = (f) => `data:${f.endsWith(".jpg") ? "image/jpeg" : "image/png"};base64,${fs.readFileSync(f).toString("base64")}`;

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }

const [LIST, OUT = "public/img/cmeciclo", SIZE = "1792x1008", QUALITY = "low"] = process.argv.slice(2);
const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });
const pend = items.filter((it) => !fs.existsSync(path.join(OUT, `${it.name}.png`)));
console.log(`${items.length} en la lista · ya estaban ${items.length - pend.length} · a generar ${pend.length}`);

let ok = 0, fail = 0;
const uno = async (it) => {
  for (let intento = 1; intento <= 3; intento += 1) {
    try {
      // ⛔ timeout SIEMPRE: un fetch sin AbortSignal deja el proceso vivo y mudo si la API se cuelga
      const refs = (Array.isArray(it.ref) ? it.ref : [it.ref]).filter(Boolean);
      const url = refs.length ? "/images/edits" : "/images/generations";
      const body = { model: "gpt-image-2", prompt: it.prompt, size: SIZE, quality: QUALITY, n: 1 };
      if (refs.length) body.images = refs.map((f) => ({ image_url: dataUri(f) }));
      const r = await fetch("https://api.openai.com/v1" + url, {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180000),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(`${r.status} ${t.slice(0, 160)}`);
      const b64 = JSON.parse(t).data?.[0]?.b64_json;
      if (!b64) throw new Error("sin b64_json");
      fs.writeFileSync(path.join(OUT, `${it.name}.png`), Buffer.from(b64, "base64"));
      ok += 1; console.log(`  ✓ ${it.name}`);
      return;
    } catch (e) {
      if (intento === 3) { fail += 1; console.log(`  ✗ ${it.name} :: ${String(e.message).slice(0, 140)}`); }
      else await new Promise((s) => setTimeout(s, 4000 * intento));
    }
  }
};

const CONC = 4;
const cola = [...pend];
await Promise.all(Array.from({ length: CONC }, async () => { while (cola.length) await uno(cola.shift()); }));
console.log(`=== ok ${ok} · fail ${fail} ===`);
