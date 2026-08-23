// openai_batch_images.mjs — genera imagenes con la BATCH API de OpenAI (mitad de precio que
// la llamada normal, a cambio de esperar). Prueba empirica: si el endpoint de imagenes no
// esta soportado por Batch, la creacion falla al instante y no se gasta nada.
//
//   node scripts/openai_batch_images.mjs submit <lista.json> [size] [quality]
//   node scripts/openai_batch_images.mjs poll   <batch_id>
//   node scripts/openai_batch_images.mjs fetch  <batch_id> <outDir>
//
// lista.json = [{ "name": "...", "prompt": "..." }]
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY en .env"); process.exit(1); }
const H = { Authorization: `Bearer ${KEY}` };
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const API = "https://api.openai.com/v1";

const [cmd, arg, a3 = "1536x1024", a4 = "low"] = process.argv.slice(2);

async function j(url, opt = {}) {
  const r = await fetch(url, { ...opt, headers: { ...H, ...(opt.headers || {}) } });
  const t = await r.text();
  let d; try { d = JSON.parse(t); } catch { d = { raw: t }; }
  if (!r.ok) { console.error(`HTTP ${r.status}`, JSON.stringify(d).slice(0, 600)); process.exit(2); }
  return d;
}

// Un item con `ref` usa /v1/images/edits; sin `ref`, /v1/images/generations.
// ⛔ FORMA EXACTA de la referencia en JSON (probada 2026-08-23, las otras 3 rebotan 400):
//      images: [ { image_url: "data:image/png;base64,..." } ]
//    · `image:` (singular)        -> "Unknown parameter: 'image'. ... use 'images' (array)"
//    · images: ["data:..."]       -> "expected an object, but got a string"
//    · images:[{type:"input_image"...}] y {file_id} -> "Unknown parameter: 'images[0].type'"
const dataUrl = (p) => {
  const abs = fs.existsSync(p) ? p : path.join("public/img", p);
  const ext = path.extname(abs).slice(1).toLowerCase() === "jpg" ? "jpeg" : path.extname(abs).slice(1).toLowerCase();
  return `data:image/${ext};base64,${fs.readFileSync(abs).toString("base64")}`;
};

if (cmd === "submit") {
  const items = JSON.parse(fs.readFileSync(arg, "utf8").replace(/^﻿/, ""));
  const useEdits = items.some((it) => it.ref && it.ref.length);
  if (useEdits && !items.every((it) => it.ref && it.ref.length)) {
    console.error("un batch no puede mezclar items con y sin ref: son endpoints distintos");
    process.exit(4);
  }
  const jsonl = items.map((it) => {
    const body = { model: MODEL, prompt: it.prompt, size: it.size || a3, quality: a4, n: 1 };
    if (useEdits) body.images = it.ref.map((r) => ({ image_url: dataUrl(r) }));
    return JSON.stringify({
      custom_id: it.name,
      method: "POST",
      url: useEdits ? "/v1/images/edits" : "/v1/images/generations",
      body,
    });
  }).join("\n");
  const tmp = "_batch_in.jsonl";
  fs.writeFileSync(tmp, jsonl);
  console.log(`endpoint: ${useEdits ? "/v1/images/edits (con ref)" : "/v1/images/generations"} · ${items.length} items`);

  const form = new FormData();
  form.append("purpose", "batch");
  form.append("file", new Blob([fs.readFileSync(tmp)]), "batch.jsonl");
  const file = await j(`${API}/files`, { method: "POST", body: form });
  console.log("file:", file.id);

  const batch = await j(`${API}/batches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input_file_id: file.id,
      endpoint: useEdits ? "/v1/images/edits" : "/v1/images/generations",
      completion_window: "24h",
    }),
  });
  console.log("batch:", batch.id, batch.status);
  fs.writeFileSync("_batch_id.txt", batch.id);
}

if (cmd === "poll") {
  const b = await j(`${API}/batches/${arg}`);
  console.log(b.status, JSON.stringify(b.request_counts || {}),
    b.errors ? JSON.stringify(b.errors).slice(0, 400) : "");
  if (b.output_file_id) console.log("output:", b.output_file_id);
  if (b.error_file_id) console.log("errors:", b.error_file_id);
}

if (cmd === "fetch") {
  const out = a3;
  const b = await j(`${API}/batches/${arg}`);
  if (!b.output_file_id) { console.error("sin output todavia:", b.status); process.exit(3); }
  const r = await fetch(`${API}/files/${b.output_file_id}/content`, { headers: H });
  const lines = (await r.text()).trim().split("\n");
  fs.mkdirSync(out, { recursive: true });
  let ok = 0, toks = 0;
  for (const ln of lines) {
    const row = JSON.parse(ln);
    const body = row.response?.body;
    const b64 = body?.data?.[0]?.b64_json;
    toks += body?.usage?.output_tokens || 0;
    if (!b64) { console.log("✗", row.custom_id, JSON.stringify(row.response?.body).slice(0, 200)); continue; }
    fs.writeFileSync(path.join(out, `${row.custom_id}.png`), Buffer.from(b64, "base64"));
    ok++;
  }
  console.log(`bajadas ${ok}/${lines.length} · tokens_out totales ${toks}`);
}
