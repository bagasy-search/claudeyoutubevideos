// fetch_belleza_stock.mjs — baja stock REAL de Pexels para el video de belleza.
// video (b-roll) → public/broll/<name>.mp4 · foto (tarjetas carrusel + imágenes de componente) → public/img/<name>.jpg
// Dedup por query. Escribe los nombres de asset de vuelta en _v3/secretos_plan.json.
import fs from 'fs';
import path from 'path';

const KEY = (fs.readFileSync('.env', 'utf8').match(/PEXELS_API_KEY=(\S+)/) || [])[1];
if (!KEY) { console.error('sin PEXELS_API_KEY'); process.exit(1); }
const PLAN = '_v3/secretos_plan.json';
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8').replace(/^﻿/, ''));
fs.mkdirSync('public/broll', {recursive: true});
fs.mkdirSync('public/img', {recursive: true});
const SLUG = 'belleza';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pexJSON(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, {headers: {Authorization: KEY}});
      if (r.status === 429) { await sleep(3000); continue; }
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
  const j = await pexJSON(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape&size=medium`);
  if (!j || !j.videos || !j.videos.length) return false;
  for (const v of j.videos) {
    // preferir un mp4 ~1280-1920 de ancho
    const files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.width);
    files.sort((a, b) => Math.abs((a.width || 0) - 1440) - Math.abs((b.width || 0) - 1440));
    if (files[0] && (await download(files[0].link, dest))) return true;
  }
  return false;
}
async function fetchPhoto(query, dest) {
  const j = await pexJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`);
  if (!j || !j.photos || !j.photos.length) return false;
  for (const p of j.photos) {
    const src = p.src && (p.src.large2x || p.src.large || p.src.original);
    if (src && (await download(src, dest))) return true;
  }
  return false;
}

// ── recolectar necesidades ──
const videoJobs = new Map(); // query -> {name}
const photoJobs = new Map();
let bi = 0, ci = 0;
for (const b of plan.beats) {
  if (b.role === 'broll' && b.query) {
    const name = `${SLUG}_sb${String(bi).padStart(3, '0')}`; bi++;
    b.asset = `broll/${name}.mp4`;
    if (!videoJobs.has(b.query)) videoJobs.set(b.query, {name});
    else b.asset = `broll/${videoJobs.get(b.query).name}.mp4`; // reuse
  }
  if (b.role === 'component' && b.payload && typeof b.payload.image === 'string' && /[a-z]{4}/i.test(b.payload.image) && !b.payload.image.startsWith('img/') && !b.payload.image.startsWith('broll/')) {
    const q = b.payload.image; const name = `${SLUG}_ci${String(ci).padStart(3, '0')}`; ci++;
    if (!photoJobs.has(q)) { photoJobs.set(q, {name}); b.payload.image = `img/${name}.jpg`; }
    else b.payload.image = `img/${photoJobs.get(q).name}.jpg`;
  }
  // imageA/imageB (BeforeAfter)
  for (const k of ['imageA', 'imageB']) {
    if (b.role === 'component' && b.payload && typeof b.payload[k] === 'string' && /[a-z]{4}/i.test(b.payload[k]) && !b.payload[k].startsWith('img/')) {
      const q = b.payload[k]; const name = `${SLUG}_ci${String(ci).padStart(3, '0')}`; ci++;
      if (!photoJobs.has(q)) { photoJobs.set(q, {name}); b.payload[k] = `img/${name}.jpg`; }
      else b.payload[k] = `img/${photoJobs.get(q).name}.jpg`;
    }
  }
}
// tarjetas del carrusel → foto
for (const c of plan.carouselCards || []) {
  const name = `${SLUG}_card${c.index}`;
  c.image = `img/${name}.jpg`;
  if (!photoJobs.has(c.query)) photoJobs.set(c.query, {name});
  else c.image = `img/${photoJobs.get(c.query).name}.jpg`;
}

console.log(`videos únicos: ${videoJobs.size} · fotos únicas: ${photoJobs.size}`);

let okV = 0, okP = 0, fail = [];
let n = 0;
for (const [q, {name}] of videoJobs) {
  const dest = `public/broll/${name}.mp4`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) { okV++; continue; }
  const ok = await fetchVideo(q, dest);
  if (ok) okV++; else fail.push(['V', q]);
  if (++n % 10 === 0) console.log(`  video ${n}/${videoJobs.size}…`);
  await sleep(250);
}
n = 0;
for (const [q, {name}] of photoJobs) {
  const dest = `public/img/${name}.jpg`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) { okP++; continue; }
  const ok = await fetchPhoto(q, dest);
  if (ok) okP++; else fail.push(['P', q]);
  if (++n % 10 === 0) console.log(`  foto ${n}/${photoJobs.size}…`);
  await sleep(200);
}

fs.writeFileSync(PLAN, JSON.stringify(plan, null, 1));
fs.writeFileSync('_v3/stock_fail.json', JSON.stringify(fail, null, 1));
console.log(`LISTO · videos ok ${okV}/${videoJobs.size} · fotos ok ${okP}/${photoJobs.size} · faltantes ${fail.length}`);
if (fail.length) console.log('faltantes:', fail.slice(0, 20).map((f) => f[0] + ':' + f[1]).join(' | '));
