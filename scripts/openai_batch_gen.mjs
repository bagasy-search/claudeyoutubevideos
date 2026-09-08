// openai_batch_images.mjs — pool del PRESENTADOR por la Batch API (mitad de precio del token).
//   node scripts/openai_batch_images.mjs submit <lista.json> <outDir> [size] [quality]
//   node scripts/openai_batch_images.mjs poll   <batch_id>
//   node scripts/openai_batch_images.mjs fetch  <batch_id> <lista.json> <outDir>
//
// ⛔ La forma de la referencia en JSONL NO es la de multipart: va `images: [{image_url: "data:..."}]`
//    — objeto con SOLO `image_url`, sin `type`, sin `file_id` (todo lo demás rebota 400).
// ⛔ El `endpoint` del batch tiene que coincidir con el `url` de TODAS las filas: no se pueden
//    mezclar /v1/images/generations con /v1/images/generations en el mismo batch.
// 💰 Batch = 50% del precio del token, y se SUMA al ahorro del crop de cara 128x192 (que baja los
//    tokens de la referencia de 576 a 96). Los dos juntos: $0,00207 por imagen.
import fs from "node:fs";
import path from "node:path";

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
const H = { Authorization: `Bearer ${KEY}` };
// ⛔ `/files/<id>/content` devuelve JSONL (una linea por request), NO un objeto: parsearlo
// entero revienta y ademas escupe megabytes. Se baja CRUDO con raw=true.
const api = async (p, opt = {}, raw = false) => {
  const r = await fetch("https://api.openai.com/v1" + p, { ...opt, headers: { ...H, ...(opt.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${p} :: ${t.slice(0, 400)}`);
  if (raw) return t;
  return t.startsWith("{") || t.startsWith("[") ? JSON.parse(t) : t;
};
const dataUri = (p) => `data:${p.endsWith(".jpg") ? "image/jpeg" : "image/png"};base64,${fs.readFileSync(p).toString("base64")}`;

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === "submit") {
  const [LIST, OUT, SIZE = "1792x1008", QUALITY = "low"] = rest;
  const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
  const pend = items.filter((it) => !fs.existsSync(path.join(OUT, `${it.name}.png`)));
  const refCache = new Map();
  const lines = pend.map((it) => {
    return JSON.stringify({
      custom_id: it.name, method: "POST", url: "/v1/images/generations",
      body: { model: "gpt-image-2", prompt: it.prompt, size: SIZE, quality: QUALITY, n: 1 },
    });
  });
  const jsonl = lines.join("\n") + "\n";
  console.log(`${pend.length} items · JSONL ${(jsonl.length / 1048576).toFixed(2)} MB`);
  const fd = new FormData();
  fd.append("purpose", "batch");
  fd.append("file", new Blob([jsonl], { type: "application/jsonl" }), "batch.jsonl");
  const file = await api("/files", { method: "POST", body: fd });
  console.log("file:", file.id);
  const b = await api("/batches", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input_file_id: file.id, endpoint: "/v1/images/generations", completion_window: "24h" }) });
  console.log("batch:", b.id, "·", b.status);
  fs.writeFileSync(LIST.replace(/\.json$/, "") + ".batchid", b.id);
} else if (cmd === "poll") {
  const b = await api("/batches/" + rest[0]);
  console.log(b.status, JSON.stringify(b.request_counts), b.errors ? JSON.stringify(b.errors).slice(0, 300) : "");
} else if (cmd === "fetch") {
  const [ID, LIST, OUT] = rest;
  const b = await api("/batches/" + ID);
  if (b.status !== "completed") { console.log("todavía", b.status, JSON.stringify(b.request_counts)); process.exit(2); }
  fs.mkdirSync(OUT, { recursive: true });
  let ok = 0, fail = 0;
  for (const fid of [b.output_file_id, b.error_file_id].filter(Boolean)) {
    const body = await api(`/files/${fid}/content`, {}, true);
    for (const ln of String(body).split("\n").filter(Boolean)) {
      const r = JSON.parse(ln);
      const d = r.response?.body?.data?.[0];
      if (d?.b64_json) { fs.writeFileSync(path.join(OUT, `${r.custom_id}.png`), Buffer.from(d.b64_json, "base64")); ok++; }
      else { fail++; console.log("  ✗", r.custom_id, JSON.stringify(r.response?.body?.error || r.error || {}).slice(0, 200)); }
    }
  }
  console.log(`=== ok ${ok} · fail ${fail} ===`);
} else console.error("uso: submit | poll | fetch");
