// fetch de un batch de imagenes por STREAMING.
// ⛔ El fetch normal hace `await r.text()` sobre el JSONL de salida y con >100 imagenes en base64
//    revienta con ERR_STRING_TOO_LONG (limite de string de V8). Hay que ir linea por linea.
//   node scripts/openai_batch_fetch_stream.mjs <batch_id> <outDir>
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Readable } from "node:stream";

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
const H = { Authorization: `Bearer ${KEY}` };
const [ID, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });

const b = await (await fetch("https://api.openai.com/v1/batches/" + ID, { headers: H })).json();
if (b.status !== "completed") { console.log("todavia", b.status, JSON.stringify(b.request_counts)); process.exit(2); }

let ok = 0, fail = 0;
for (const fid of [b.output_file_id, b.error_file_id].filter(Boolean)) {
  const r = await fetch(`https://api.openai.com/v1/files/${fid}/content`, { headers: H });
  const rl = readline.createInterface({ input: Readable.fromWeb(r.body), crlfDelay: Infinity });
  for await (const ln of rl) {
    if (!ln.trim()) continue;
    let j; try { j = JSON.parse(ln); } catch { fail++; continue; }
    const d = j.response?.body?.data?.[0];
    if (d?.b64_json) { fs.writeFileSync(path.join(OUT, `${j.custom_id}.png`), Buffer.from(d.b64_json, "base64")); ok++; }
    else { fail++; console.log("  ✗", j.custom_id, JSON.stringify(j.response?.body?.error || j.error || {}).slice(0, 180)); }
  }
}
console.log(`=== ok ${ok} · fail ${fail} ===`);
