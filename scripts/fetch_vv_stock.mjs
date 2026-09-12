// fetch_vv_stock.mjs — baja stock REAL de Pexels para valeriavaselina.
//   video  → public/broll/vv_<name>.mp4   ·   foto → public/img/vv_<name>.jpg
// Lee _valeriavaselina_stock.json [{name, query, type:'video'|'photo'}]. Idempotente
// (saltea lo ya bajado). Rota a PEXELS_API_KEY2 si la 1ª topa 429.
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const KEYS = [
  (env.match(/PEXELS_API_KEY=(\S+)/) || [])[1],
  (env.match(/PEXELS_API_KEY2=(\S+)/) || [])[1],
].filter(Boolean);
if (!KEYS.length) { console.error('sin PEXELS_API_KEY'); process.exit(1); }
let ki = 0;
const key = () => KEYS[ki % KEYS.length];

const NEEDS = JSON.parse(fs.readFileSync('_valeriavaselina_stock.json', 'utf8').replace(/^﻿/, ''));
fs.mkdirSync('public/broll', {recursive: true});
fs.mkdirSync('public/img', {recursive: true});
const PFX = 'vv_';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pexJSON(url) {
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, {headers: {Authorization: key()}});
      if (r.status === 429) { ki++; await sleep(2500); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(1500); }
  }
  return null;
}
async function download(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(1000); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 4000) { await sleep(800); continue; }
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(1200); }
  }
  return false;
}
async function fetchVideo(query, dest) {
  const j = await pexJSON(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&size=medium`);
  if (!j || !j.videos || !j.videos.length) return false;
  for (const v of j.videos) {
    const files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.width);
    files.sort((a, b) => Math.abs((a.width || 0) - 1440) - Math.abs((b.width || 0) - 1440));
    if (files[0] && (await download(files[0].link, dest))) return true;
  }
  return false;
}
async function fetchPhoto(query, dest) {
  const j = await pexJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`);
  if (!j || !j.photos || !j.photos.length) return false;
  for (const p of j.photos) {
    const src = p.src && (p.src.large2x || p.src.large || p.src.original);
    if (src && (await download(src, dest))) return true;
  }
  return false;
}

let ok = 0, skip = 0, fail = 0;
const failed = [];
for (const n of NEEDS) {
  const isVid = (n.type || 'video') === 'video';
  const dest = isVid ? `public/broll/${PFX}${n.name}.mp4` : `public/img/${PFX}${n.name}.jpg`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) { skip++; continue; }
  const got = isVid ? await fetchVideo(n.query, dest) : await fetchPhoto(n.query, dest);
  if (got) { ok++; process.stdout.write(`✓ ${n.name} (${n.type}) `); }
  else { fail++; failed.push(n); process.stdout.write(`✗ ${n.name} `); }
  await sleep(250);
}
console.log(`\n\n=== fetch_vv_stock === ok:${ok} skip:${skip} fail:${fail}/${NEEDS.length}`);
if (failed.length) {
  fs.writeFileSync('_valeriavaselina_stock_failed.json', JSON.stringify(failed, null, 2));
  console.log('faltantes →', failed.map((f) => `${f.name}:"${f.query}"`).join(', '));
}
