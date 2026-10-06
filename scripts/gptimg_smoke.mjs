// gptimg_smoke.mjs — 2 imagenes SUELTAS para validar config antes de un batch de 40 min.
// Cuesta ~US$0,008 y evita descubrir a los 40 min que el tamanio rebota o que la ref no entra.
//   node scripts/gptimg_smoke.mjs <lista.json> <outDir> <name1> [name2] [size]
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

const [lista, outDir, ...rest] = process.argv.slice(2);
const size = /^\d+x\d+$/.test(rest[rest.length - 1]) ? rest.pop() : "1088x608";
const items = JSON.parse(fs.readFileSync(lista, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(outDir, { recursive: true });

const dataUrl = (p) => {
  const abs = fs.existsSync(p) ? p : path.join("public/img", p);
  const e = path.extname(abs).slice(1).toLowerCase();
  return `data:image/${e === "jpg" ? "jpeg" : e};base64,${fs.readFileSync(abs).toString("base64")}`;
};

for (const nm of rest) {
  const it = items.find((x) => x.name === nm);
  if (!it) { console.error(`no esta en la lista: ${nm}`); continue; }
  const useRef = Array.isArray(it.ref) && it.ref.length > 0;
  const url = `https://api.openai.com/v1/images/${useRef ? "edits" : "generations"}`;
  const body = { model: MODEL, prompt: it.prompt, size, quality: "low", n: 1 };
  if (useRef) body.images = it.ref.map((r) => ({ image_url: dataUrl(r) }));

  // el log DICE que via uso: [REF ...] vs [txt] — es la unica senal de que la cara entro
  process.stdout.write(`${nm}  ${useRef ? `[REF ${it.ref.length}]` : "[txt]"}  ${size} ... `);
  const t0 = Date.now();
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180000),
  });
  const d = await r.json();
  if (!r.ok) { console.log(`HTTP ${r.status}`, JSON.stringify(d).slice(0, 300)); continue; }
  const b64 = d.data?.[0]?.b64_json;
  if (!b64) { console.log("sin imagen", JSON.stringify(d).slice(0, 200)); continue; }
  const f = path.join(outDir, `${nm}.png`);
  fs.writeFileSync(f, Buffer.from(b64, "base64"));
  const u = d.usage || {};
  console.log(`OK ${((Date.now() - t0) / 1000).toFixed(1)}s · ${(fs.statSync(f).size / 1024).toFixed(0)} KB · usage in=${u.input_tokens ?? "?"} out=${u.output_tokens ?? "?"}`);
  if (u.input_tokens_details) console.log(`     detalle entrada: ${JSON.stringify(u.input_tokens_details)}`);
}
