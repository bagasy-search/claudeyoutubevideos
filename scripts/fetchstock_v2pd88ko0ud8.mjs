// fetchstock_v2pd88ko0ud8.mjs — baja el b-roll de Pexels AISLADO por slug.
//   node scripts/fetchstock_v2pd88ko0ud8.mjs [reintentos]
// · 4 workers · backoff exponencial en 429 · DEDUP por id de Pexels (la misma query
//   dos veces devuelve dos clips DISTINTOS → se respeta "no repetir clips").
// · Destino: public/broll/v2pd88ko0ud8/dNNN.mp4  (nunca la carpeta compartida).
import fs from "fs";
import path from "path";

const SLUG = "v2pd88ko0ud8";
const OUT = `public/broll/${SLUG}`;
fs.mkdirSync(OUT, { recursive: true });

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.PEXELS_API_KEY || env.PEXELS_API_KEY;
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }

const list = JSON.parse(fs.readFileSync(`_pexels_${SLUG}.json`, "utf8"));
const usedFile = `_pexids_${SLUG}.json`;
const used = new Set(fs.existsSync(usedFile) ? JSON.parse(fs.readFileSync(usedFile, "utf8")) : []);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const todo = list.filter((it) => !fs.existsSync(path.join(OUT, `${it.name}.mp4`)));
console.log(`pexels · ${list.length} pedidos · faltan ${todo.length} · ya hay ${list.length - todo.length}`);

let ok = 0, fail = 0;
const failed = [];

async function search(q, page) {
  for (let a = 1; a <= 6; a++) {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&page=${page}&orientation=landscape`;
    const r = await fetch(url, { headers: { Authorization: KEY } });
    if (r.status === 429) { await sleep(Math.min(90000, 4000 * 2 ** a)); continue; }
    if (!r.ok) { await sleep(1500 * a); continue; }
    return (await r.json()).videos || [];
  }
  return [];
}

async function grab(it) {
  for (let page = 1; page <= 3; page++) {
    const vids = await search(it.query, page);
    for (const v of vids) {
      if (used.has(v.id)) continue;
      // el mejor archivo <= 1920 de ancho
      const f = (v.video_files || []).filter((x) => x.width && x.width <= 1920 && /mp4/.test(x.file_type || "video/mp4"))
        .sort((a, b) => b.width - a.width)[0];
      if (!f) continue;
      try {
        const res = await fetch(f.link);
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 40000) continue;
        fs.writeFileSync(path.join(OUT, `${it.name}.mp4`), buf);
        used.add(v.id);
        ok++;
        return true;
      } catch { /* siguiente candidato */ }
    }
    await sleep(900);
  }
  fail++; failed.push(it);
  return false;
}

const WORKERS = 4;
let idx = 0;
async function worker(w) {
  while (idx < todo.length) {
    const it = todo[idx++];
    await grab(it);
    if ((ok + fail) % 15 === 0) {
      fs.writeFileSync(usedFile, JSON.stringify([...used]));
      console.log(`  ${ok + fail}/${todo.length} · ok ${ok} · fail ${fail}`);
    }
    await sleep(1300);
  }
}
await Promise.all(Array.from({ length: WORKERS }, (_, w) => worker(w)));
fs.writeFileSync(usedFile, JSON.stringify([...used]));
fs.writeFileSync(`_pexfail_${SLUG}.json`, JSON.stringify(failed, null, 1));
console.log(`LISTO · ok ${ok} · fail ${fail} · faltantes en _pexfail_${SLUG}.json`);
