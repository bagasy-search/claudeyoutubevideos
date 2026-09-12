// gptimage_edits.mjs — fotos del presentador con gpt-image-2 `/v1/images/edits` + referencia.
// Se usa cuando la BATCH API no esta disponible (el batch de este proyecto rebota con
// "Cannot find file ... organization does not have access", con JSONL de 4 MB y de 58 MB).
// `quality: low` es la palanca de costo (la que pidio el creador); el tamanio es 1792x1008,
// el UNICO 16:9 real de gpt-image-2 (1536x1024 es 3:2 y el kit lo recorta).
//
//   node scripts/gptimage_edits.mjs <lista.json> <outDir> [size] [quality] [conc]
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [LIST, OUT, SIZE = "1792x1008", QUALITY = "low", CONC = "4"] = process.argv.slice(2);
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
const todo = items.filter((it) => !fs.existsSync(path.join(OUT, `${it.name}.png`)));
console.log(`gpt-image-2 edits · ${SIZE} · quality ${QUALITY} · ${todo.length}/${items.length} a generar`);

let ok = 0, fail = 0, done = 0;
const one = async (it) => {
  for (let t = 1; t <= 4; t++) {
    try {
      const form = new FormData();
      form.append("model", "gpt-image-2");
      form.append("prompt", it.prompt);
      form.append("size", SIZE);
      form.append("quality", QUALITY);
      form.append("n", "1");
      for (const r of it.ref) {
        const ext = path.extname(r).toLowerCase();
        form.append("image[]", new Blob([fs.readFileSync(r)], { type: MIME[ext] || "image/png" }), path.basename(r));
      }
      const r = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: form,
      });
      const txt = await r.text();
      if (!r.ok) {
        if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 5000 * t)); continue; }
        throw new Error(`HTTP ${r.status} ${txt.slice(0, 160)}`);
      }
      const j = JSON.parse(txt);
      const d = j?.data?.[0];
      const buf = d?.b64_json ? Buffer.from(d.b64_json, "base64")
        : Buffer.from(await (await fetch(d.url)).arrayBuffer());
      fs.writeFileSync(path.join(OUT, `${it.name}.png`), buf);
      ok++; return;
    } catch (e) {
      if (t === 4) { console.log(`  ✗ ${it.name}: ${e.message}`); fail++; return; }
      await new Promise((s) => setTimeout(s, 3000 * t));
    }
  }
};

const cola = [...todo];
await Promise.all(Array.from({ length: Number(CONC) }, async () => {
  while (cola.length) {
    await one(cola.shift());
    done++;
    process.stdout.write(`  ${done}/${todo.length} (ok ${ok}, fail ${fail})\r`);
  }
}));
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} ===`);
