// Baja el resultado de un batch de imágenes SIN cargarlo entero en memoria.
//
// ⛔ Por qué existe: `openai_batch_images.mjs fetch` hace `String(body)` sobre el JSONL completo.
//    Con 309 imágenes en base64 eso pasa el límite de string de Node (~512 MB) y muere con
//    ERR_STRING_TOO_LONG *después* de haber bajado todo. El batch está bien; el lector no.
//
//   node scripts/batch_fetch_stream.mjs <batchid> <outDir>
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Readable } from "node:stream";

const [ID, OUT] = process.argv.slice(2);
if (!ID || !OUT) { console.error("Uso: node scripts/batch_fetch_stream.mjs <batchid> <outDir>"); process.exit(1); }

const KEY = (fs.readFileSync(".env", "utf8").match(/^OPENAI_API_KEY=(.*)$/m) || [])[1]?.trim();
if (!KEY) { console.error("falta OPENAI_API_KEY en .env"); process.exit(2); }
const H = { Authorization: "Bearer " + KEY };

const b = await (await fetch("https://api.openai.com/v1/batches/" + ID, { headers: H })).json();
if (b.status !== "completed") { console.error("batch en " + b.status); process.exit(3); }
fs.mkdirSync(OUT, { recursive: true });

let ok = 0, fail = 0, bytes = 0, saltadas = 0;
const errores = [];
for (const fid of [b.output_file_id, b.error_file_id].filter(Boolean)) {
  const res = await fetch(`https://api.openai.com/v1/files/${fid}/content`, { headers: H });
  if (!res.ok) { console.error("no pude bajar " + fid + ": " + res.status); continue; }
  const rl = readline.createInterface({ input: Readable.fromWeb(res.body), crlfDelay: Infinity });
  for await (const ln of rl) {
    if (!ln.trim()) continue;
    let r; try { r = JSON.parse(ln); } catch { fail++; continue; }
    const d = r.response?.body?.data?.[0];
    const yaEsta = fs.existsSync(path.join(OUT, r.custom_id + ".jpg")) || fs.existsSync(path.join(OUT, r.custom_id + ".png"));
    if (yaEsta) { saltadas++; continue; }
    if (d?.b64_json) {
      const buf = Buffer.from(d.b64_json, "base64");
      fs.writeFileSync(path.join(OUT, `${r.custom_id}.png`), buf);
      bytes += buf.length; ok++;
      if (ok % 50 === 0) console.log("  " + ok + " imágenes (" + (bytes / 1048576).toFixed(0) + " MB)");
    } else {
      fail++;
      const msg = r.response?.body?.error?.message || r.error?.message || JSON.stringify(r).slice(0, 160);
      errores.push(`${r.custom_id}: ${String(msg).slice(0, 140)}`);
    }
  }
}
console.log(`LISTO · ok ${ok} · saltadas ${saltadas} · fail ${fail} · ${(bytes / 1048576).toFixed(0)} MB`);
if (errores.length) {
  fs.writeFileSync("_v3/_batch_errores.txt", errores.join("\n") + "\n");
  console.log("errores (primeros 5):\n  " + errores.slice(0, 5).join("\n  "));
}
