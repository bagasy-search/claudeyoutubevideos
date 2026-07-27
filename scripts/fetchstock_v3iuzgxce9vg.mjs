// fetchstock_v3iuzgxce9vg.mjs — Pexels con CONCURRENCIA + backoff 429 + DEDUP de clips.
// El fetchstock.mjs original baja de a uno, sin reintento, y puede repetir el mismo video en
// dos queries parecidas (el creador prohibió repetir clips). Este:
//   · baja N en paralelo (default 5)
//   · reintenta 429/5xx con backoff exponencial
//   · pide per_page=15 y elige el PRIMER video cuyo id no se usó todavía (dedup global)
//   · AISLA por slug → public/broll/v3iuzgxce9vg/
//   · deja las que fallaron en public/broll/_missing_v3iuzgxce9vg.json (para tapar con imagen IA)
import fs from "fs";
import path from "path";

const SLUG = "v3iuzgxce9vg";
const OUT = path.join("public/broll", SLUG);
const SHOTS = process.argv[2] || `public/broll/shots_dense_${SLUG}.json`;
const CONC = +(process.argv[3] || 5);

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.PEXELS_API_KEY || env.PEXELS_API_KEY;
if (!KEY) { console.error("Falta PEXELS_API_KEY"); process.exit(1); }

fs.mkdirSync(OUT, { recursive: true });
const shots = JSON.parse(fs.readFileSync(SHOTS, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ids ya usados (dedup) — también relee lo que ya está bajado en corridas previas
const usedIds = new Set();
const idxPath = path.join(OUT, `index_${SLUG}.json`);
let index = [];
try { index = JSON.parse(fs.readFileSync(idxPath, "utf8")); for (const r of index) if (r.pexels_id) usedIds.add(r.pexels_id); } catch {}

const pickFile = (files) => {
  const ok = (files || []).filter((f) => f.file_type === "video/mp4").map((f) => ({ ...f, w: f.width || 0 })).sort((a, b) => a.w - b.w);
  const upTo = ok.filter((f) => f.w <= 1920);
  return (upTo.length ? upTo[upTo.length - 1] : ok[ok.length - 1]) || null;
};

async function apiSearch(query, attempt = 1) {
  const u = new URL("https://api.pexels.com/videos/search");
  u.searchParams.set("query", query);
  u.searchParams.set("orientation", "landscape");
  u.searchParams.set("per_page", "15");
  u.searchParams.set("size", "medium");
  const res = await fetch(u, { headers: { Authorization: KEY } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 6) throw new Error("API " + res.status + " (sin reintentos)");
    const wait = Math.min(60000, 3000 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 1500);
    await sleep(wait);
    return apiSearch(query, attempt + 1);
  }
  if (!res.ok) throw new Error("API " + res.status);
  return res.json();
}

async function download(url, dest, attempt = 1) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("dl " + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 20000) throw new Error("archivo sospechosamente chico");
    fs.writeFileSync(dest, buf);
    return buf.length;
  } catch (e) {
    if (attempt > 3) throw e;
    await sleep(2000 * attempt);
    return download(url, dest, attempt + 1);
  }
}

const missing = [];
let ok = 0, fail = 0, skipped = 0;

async function one(shot) {
  const dest = path.join(OUT, `${shot.name}.mp4`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) { skipped++; return; }
  try {
    const data = await apiSearch(shot.query);
    const vids = data.videos || [];
    // dedup: primer video no usado
    const vid = vids.find((v) => !usedIds.has(v.id));
    if (!vid) throw new Error(vids.length ? "todos repetidos" : "sin resultados");
    usedIds.add(vid.id);
    const vf = pickFile(vid.video_files);
    if (!vf) throw new Error("sin mp4");
    const bytes = await download(vf.link, dest);
    index.push({ name: shot.name, query: shot.query, pexels_id: vid.id, w: vf.width, h: vf.height, durationSec: vid.duration, bytes });
    ok++;
    if (ok % 25 === 0) console.log(`  ... ${ok} bajados`);
  } catch (e) {
    fail++;
    missing.push({ name: shot.name, query: shot.query, error: String(e.message || e) });
  }
}

const queue = shots.slice();
async function worker() { while (queue.length) { const s = queue.shift(); await one(s); } }

console.log(`Pexels → ${OUT}/ · ${shots.length} tomas · ${CONC} workers · dedup activo`);
await Promise.all(Array.from({ length: CONC }, () => worker()));

fs.writeFileSync(idxPath, JSON.stringify(index, null, 1));
fs.writeFileSync(`public/broll/_missing_${SLUG}.json`, JSON.stringify(missing, null, 1));
console.log(`\n=== LISTO === ${ok} bajados · ${skipped} ya estaban · ${fail} fallaron`);
if (fail) console.log(`faltantes en public/broll/_missing_${SLUG}.json (se tapan con imagen IA)`);
