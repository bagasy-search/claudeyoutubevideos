// openai_batch.mjs — imágenes gpt-image por la Batch API, UN solo módulo para /edits (con cara) y
// /generations (sin cara). Reemplaza scripts/openai_batch_images.mjs + _v3/<slug>_batch_gen.mjs.
//
// Arreglos medidos:
//   · `fetch` bajaba el JSONL ENTERO a un string: crasheó con 140 imágenes (tcbriquetas). Acá se procesa
//     en STREAM, línea por línea, escribiendo cada PNG al vuelo.
//   · `fetch` con 2 args moría con `mkdirSync undefined` (tcfiltro). Acá los args son un objeto validado.
//   · `insufficient_quota` a mitad (castorglove/facrema81) → BlockedError, estado recuperable.
//   · el endpoint del batch tiene que coincidir con TODAS las filas: se arma un batch por endpoint.
import fs from "node:fs";
import path from "node:path";
import { env } from "./env.mjs";
import { BlockedError, esSinCredito } from "./budget.mjs";

const API = "https://api.openai.com/v1";
const key = () => env("OPENAI_API_KEY", { required: true });

async function api(p, opt = {}) {
  const r = await fetch(API + p, { ...opt, headers: { Authorization: `Bearer ${key()}`, ...(opt.headers || {}) }, signal: AbortSignal.timeout(opt.timeoutMs || 600_000) });
  if (!r.ok) {
    const t = await r.text();
    if (esSinCredito(t) || r.status === 429 && /quota/i.test(t)) throw new BlockedError(`OpenAI sin crédito (${r.status})`, t.slice(0, 300));
    throw new Error(`${r.status} ${p} :: ${t.slice(0, 400)}`);
  }
  return opt.raw ? r : r.json();
}

const dataUri = (p) => `data:${/\.jpe?g$/i.test(p) ? "image/jpeg" : "image/png"};base64,${fs.readFileSync(p).toString("base64")}`;

/** items: [{ name, prompt, ref? }] → { batchId, endpoint, n } (saltea los que ya existen en outDir). */
export async function submitBatch({ items, outDir, size = "1088x608", quality = "low", model = "gpt-image-2" }) {
  if (!items?.length) throw new Error("submitBatch: 0 items");
  const conRef = items.filter((i) => i.ref), sinRef = items.filter((i) => !i.ref);
  if (conRef.length && sinRef.length) throw new Error("submitBatch: no se mezclan /edits y /generations en un batch (partilo)");
  const endpoint = conRef.length ? "/v1/images/edits" : "/v1/images/generations";
  const pend = items.filter((it) => !["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`))));
  if (!pend.length) return { batchId: null, endpoint, n: 0, yaEstaban: items.length };
  const cache = new Map();
  const lines = pend.map((it) => {
    const body = { model, prompt: it.prompt, size, quality, n: 1 };
    if (it.ref) {
      const refs = [].concat(it.ref);
      for (const r of refs) { if (!fs.existsSync(r)) throw new Error(`ref inexistente ${r} (${it.name})`); if (!cache.has(r)) cache.set(r, dataUri(r)); }
      body.images = refs.map((r) => ({ image_url: cache.get(r) }));
    }
    return JSON.stringify({ custom_id: it.name, method: "POST", url: endpoint, body });
  });
  const fd = new FormData();
  fd.append("purpose", "batch");
  fd.append("file", new Blob([lines.join("\n") + "\n"], { type: "application/jsonl" }), "batch.jsonl");
  const file = await api("/files", { method: "POST", body: fd });
  const b = await api("/batches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: file.id, endpoint, completion_window: "24h" }) });
  return { batchId: b.id, endpoint, n: pend.length, yaEstaban: items.length - pend.length };
}

export async function pollBatch(batchId) {
  const b = await api(`/batches/${batchId}`);
  return { status: b.status, counts: b.request_counts, outputFileId: b.output_file_id, errorFileId: b.error_file_id, errors: b.errors };
}

/** Baja resultados en STREAM. → { ok, fail, fallidos: [{name, error}] } */
export async function fetchBatch({ batchId, outDir, onLog = () => {} }) {
  const b = await pollBatch(batchId);
  if (b.status !== "completed") throw new Error(`batch ${batchId} todavía ${b.status}`);
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0, fail = 0;
  const fallidos = [];
  for (const fid of [b.outputFileId, b.errorFileId].filter(Boolean)) {
    const r = await api(`/files/${fid}/content`, { raw: true, timeoutMs: 3600_000 });
    const dec = new TextDecoder();
    let buf = "";
    const procesar = (ln) => {
      if (!ln.trim()) return;
      const x = JSON.parse(ln);
      const d = x.response?.body?.data?.[0];
      if (d?.b64_json) { fs.writeFileSync(path.join(outDir, `${x.custom_id}.png`), Buffer.from(d.b64_json, "base64")); ok++; }
      else { fail++; const error = JSON.stringify(x.response?.body?.error || x.error || {}).slice(0, 200); fallidos.push({ name: x.custom_id, error }); onLog(`  ✗ ${x.custom_id} ${error}`); }
    };
    for await (const chunk of r.body) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) { procesar(buf.slice(0, i)); buf = buf.slice(i + 1); }
    }
    procesar(buf);
  }
  if (fallidos.some((f) => esSinCredito(f.error))) throw new BlockedError("OpenAI sin crédito dentro del batch", fallidos.slice(0, 3));
  return { ok, fail, fallidos };
}
