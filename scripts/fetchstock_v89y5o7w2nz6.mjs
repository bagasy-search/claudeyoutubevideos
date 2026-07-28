// fetchstock_v89y5o7w2nz6.mjs — baja el b-roll de Pexels para ESTE slug.
// Aislado por NOMBRE: bd_v89y5o7w2nz6_NNN.mp4 dentro de public/broll (carpeta compartida).
// - dedup por id de Pexels (la misma query dos veces da dos clips DISTINTOS)
// - throttle + backoff exponencial ante 429
// - saltea los que ya existen en disco
import fs from "fs";
import path from "path";

const SLUG = "v89y5o7w2nz6";
const OUT = "public/broll";
const LIST = `public/broll/shots_${SLUG}.json`;

for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error("Falta PEXELS_API_KEY"); process.exit(1); }

const shots = JSON.parse(fs.readFileSync(LIST, "utf8"));
const usedIds = new Set();
const idxFile = `public/broll/_index_${SLUG}.json`;
if (fs.existsSync(idxFile)) for (const r of JSON.parse(fs.readFileSync(idxFile, "utf8"))) usedIds.add(r.id);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const index = [];
let ok = 0, skip = 0, fail = 0;

const search = async (query, page) => {
  let wait = 1500;
  for (let a = 0; a < 6; a++) {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&page=${page}&orientation=landscape`;
    const r = await fetch(url, { headers: { Authorization: KEY } });
    if (r.status === 429) { await sleep(wait); wait = Math.min(wait * 2, 90000); continue; }
    if (!r.ok) return null;
    return await r.json();
  }
  return null;
};

const download = async (url, dest) => {
  const r = await fetch(url);
  if (!r.ok) return false;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 20000) return false;
  fs.writeFileSync(dest, buf);
  return true;
};

for (let i = 0; i < shots.length; i++) {
  const s = shots[i];
  const dest = path.join(OUT, `${s.name}.mp4`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) { skip++; continue; }
  const j = await search(s.query, s.page > 2 ? 2 : 1);
  if (!j || !j.videos || !j.videos.length) { fail++; console.log(`✗ ${s.name} · "${s.query}" sin resultados`); continue; }
  const cand = j.videos.filter((v) => !usedIds.has(v.id));
  const vid = cand[0] || j.videos[0];
  const files = (vid.video_files || []).filter((f) => f.width && f.width >= 960).sort((a, b) => a.width - b.width);
  const vf = files[0] || vid.video_files[0];
  if (!vf) { fail++; continue; }
  if (await download(vf.link, dest)) {
    usedIds.add(vid.id);
    index.push({ name: s.name, query: s.query, id: vid.id, w: vf.width, h: vf.height, dur: vid.duration });
    ok++;
    if (ok % 10 === 0) console.log(`  ${ok + skip}/${shots.length} (ok ${ok} · saltados ${skip} · fallados ${fail})`);
  } else { fail++; }
  await sleep(700);
}

const prev = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, "utf8")) : [];
fs.writeFileSync(idxFile, JSON.stringify([...prev, ...index], null, 1));
console.log(`=== LISTO · ok ${ok} · saltados ${skip} · fallados ${fail} de ${shots.length} ===`);
