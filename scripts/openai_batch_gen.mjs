// openai_batch_gen.mjs — pool de OBJETOS por Batch API vía /v1/images/generations (más barato, sin ref).
//   node scripts/openai_batch_gen.mjs submit <lista.json> <outDir> [size] [quality]
//   node scripts/openai_batch_gen.mjs poll   <batch_id>
//   node scripts/openai_batch_gen.mjs fetch  <batch_id> <lista.json> <outDir>
import fs from "node:fs";
import path from "node:path";
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
const H = { Authorization: `Bearer ${KEY}` };
const api = async (p, opt = {}, raw = false) => {
  const r = await fetch("https://api.openai.com/v1" + p, { ...opt, headers: { ...H, ...(opt.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${p} :: ${t.slice(0, 400)}`);
  if (raw) return t;
  return t.startsWith("{") || t.startsWith("[") ? JSON.parse(t) : t;
};
const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "submit") {
  const [LIST, OUT, SIZE = "1088x608", QUALITY = "low"] = rest;
  const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
  const pend = items.filter((it) => !fs.existsSync(path.join(OUT, `${it.name}.png`)));
  const jsonl = pend.map((it) => JSON.stringify({
    custom_id: it.name, method: "POST", url: "/v1/images/generations",
    body: { model: "gpt-image-2", prompt: it.prompt, size: SIZE, quality: QUALITY, n: 1 },
  })).join("\n") + "\n";
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
  if (b.status !== "completed" && b.status !== "failed") { console.log("todavía", b.status, JSON.stringify(b.request_counts)); process.exit(2); }
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
