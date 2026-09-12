// batch_fetch_stream.mjs — baja el resultado de un Batch de imágenes SIN meter todo el archivo
// en un string. Reemplaza al `fetch` de openai_batch_images.mjs, que hace `await r.text()` y
// muere con ERR_STRING_TOO_LONG cuando el output trae decenas de imágenes en base64 INLINE
// (y sale con código 0, así que parece que anduvo).
//
//   node scripts/batch_fetch_stream.mjs <batch_id> <outDir> [--jpg]
//
// --jpg: además del .png escribe un .jpg de calidad 3 (el pool de b-roll va en JPG; baja el tar
//        del farm ~94%). Necesita el ffmpeg COMPLETO de WinGet, no el mínimo de Remotion.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import 'dotenv/config';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('falta OPENAI_API_KEY en .env'); process.exit(1); }
const [batchId, outDir, ...flags] = process.argv.slice(2);
if (!batchId || !outDir) { console.error('uso: node scripts/batch_fetch_stream.mjs <batch_id> <outDir> [--jpg]'); process.exit(1); }
const WANT_JPG = flags.includes('--jpg');
const FFMPEG = process.env.FFMPEG_FULL ||
  `${process.env.USERPROFILE || process.env.HOME}/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe`;

const H = { Authorization: `Bearer ${KEY}` };
const b = await (await fetch(`https://api.openai.com/v1/batches/${batchId}`, { headers: H })).json();
console.log(`batch ${batchId} · status ${b.status} · ${JSON.stringify(b.request_counts || {})}`);
if (!b.output_file_id) { console.error('⛔ sin output_file_id todavía (status ' + b.status + ')'); process.exit(3); }

fs.mkdirSync(outDir, { recursive: true });
const res = await fetch(`https://api.openai.com/v1/files/${b.output_file_id}/content`, { headers: H });
if (!res.ok) { console.error('⛔ HTTP ' + res.status); process.exit(2); }

let ok = 0, bad = 0, toks = 0, bytes = 0, lines = 0;
let buf = '';
const dec = new TextDecoder();

function handleLine(ln) {
  if (!ln.trim()) return;
  lines++;
  let row;
  try { row = JSON.parse(ln); } catch { console.log('✗ línea ilegible (' + ln.length + ' chars)'); bad++; return; }
  const body = row.response?.body;
  toks += body?.usage?.output_tokens || 0;
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) {
    console.log('✗ ' + row.custom_id + ' → ' + JSON.stringify(body || row.error).slice(0, 180));
    bad++; return;
  }
  const png = path.join(outDir, `${row.custom_id}.png`);
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(png, buffer);
  bytes += buffer.length;
  if (WANT_JPG) {
    try {
      execFileSync(FFMPEG, ['-v', 'error', '-i', png, '-q:v', '3', '-y', png.replace(/\.png$/, '.jpg')]);
    } catch (e) { console.log('  ⚠️ jpg falló en ' + row.custom_id + ': ' + String(e.message).slice(0, 80)); }
  }
  ok++;
  if (ok % 25 === 0) console.log('  … ' + ok + ' bajadas');
}

for await (const chunk of res.body) {
  buf += dec.decode(chunk, { stream: true });
  let nl;
  while ((nl = buf.indexOf('\n')) >= 0) {
    handleLine(buf.slice(0, nl));
    buf = buf.slice(nl + 1);
  }
}
handleLine(buf);

console.log('─'.repeat(60));
console.log(`LÍNEAS LEÍDAS ${lines}  ·  bajadas ${ok}  ·  fallidas ${bad}`);
console.log(`tokens_out totales ${toks}  ·  ${(bytes / 1048576).toFixed(1)} MB en disco`);
if (lines === 0) { console.error('⛔ 0 líneas leídas — el medidor no midió nada, no confíes en el verde'); process.exit(4); }
if (bad > 0) process.exit(5);
