// fetchstock_vdjso9de381j.mjs — baja b-roll de Pexels AISLADO POR SLUG a public/broll/<slug>/.
//   node scripts/fetchstock_vdjso9de381j.mjs [--retry]
// Lee public/broll/_fetch_vdjso9de381j.json ([{name, query}]).
// · 5 workers + backoff exponencial en 429 (el tier free corta cerca de los 200/hora)
// · DEDUP por id de Pexels: la misma query dos veces devuelve dos clips DISTINTOS
//   (el creador prohíbe repetir clips).
import fs from "fs";
import path from "path";

const SLUG = "vdjso9de381j";
const OUT = `public/broll/${SLUG}`;
fs.mkdirSync(OUT, { recursive: true });

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.PEXELS_API_KEY || env.PEXELS_API_KEY;
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }

const RETRY = process.argv.includes("--retry");
const LIST = JSON.parse(fs.readFileSync(`public/broll/_fetch_${SLUG}.json`, "utf8"));
const usedIds = new Set();
const idxFile = `public/broll/_ids_${SLUG}.json`;
if (fs.existsSync(idxFile)) JSON.parse(fs.readFileSync(idxFile, "utf8")).forEach((i) => usedIds.add(i));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const todo = LIST.filter((x) => !fs.existsSync(path.join(OUT, `${x.name}.mp4`)));
console.log(`b-roll ${SLUG}: total ${LIST.length} · faltan ${todo.length}`);

let ok = 0, fail = 0, n429 = 0;
const failed = [];

async function search(q, attempt = 1) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape`;
  const r = await fetch(url, { headers: { Authorization: KEY } });
  if (r.status === 429) {
    n429++;
    if (attempt > 6) return null;
    const wait = RETRY ? 20000 + attempt * 15000 : 3000 * attempt;
    await sleep(wait);
    return search(q, attempt + 1);
  }
  if (!r.ok) return null;
  return r.json();
}

async function one(item) {
  const dest = path.join(OUT, `${item.name}.mp4`);
  if (fs.existsSync(dest)) return;
  const j = await search(item.query);
  if (!j || !j.videos || !j.videos.length) { failed.push(item); fail++; return; }
  const vid = j.videos.find((v) => !usedIds.has(v.id)) || j.videos[0];
  usedIds.add(vid.id);
  const files = (vid.video_files || []).filter((f) => f.width >= 1280).sort((a, b) => a.width - b.width);
  const f = files[0] || (vid.video_files || [])[0];
  if (!f) { failed.push(item); fail++; return; }
  try {
    const res = await fetch(f.link);
    if (!res.ok) throw new Error(res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 20000) throw new Error("tiny");
    fs.writeFileSync(dest, buf);
    ok++;
    if (ok % 20 === 0) console.log(`  ${ok} bajados (${fail} fallos, ${n429} throttles)`);
  } catch { failed.push(item); fail++; }
}

const CONC = RETRY ? 1 : 5;
const queue = [...todo];
async function worker() {
  while (queue.length) {
    const it = queue.shift();
    await one(it);
    if (RETRY) await sleep(1300);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

fs.writeFileSync(idxFile, JSON.stringify([...usedIds]));
fs.writeFileSync(`public/broll/_failed_${SLUG}.json`, JSON.stringify(failed, null, 1));
console.log(`\nlisto: ${ok} bajados · ${fail} sin resultado · ${n429} throttles`);
console.log(`en disco: ${fs.readdirSync(OUT).filter((f) => f.endsWith(".mp4")).length}/${LIST.length}`);
