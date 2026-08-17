// fetch_alimentos60_stock.mjs — baja stock REAL de Pexels para el video de belleza +60.
//   video → public/broll/al_<name>.mp4   ·   photo → public/img/al_<name>.jpg
// Lee _alimentos60_stock.json = [{name, query, type}]. Dedup por id de Pexels. Rota 2 keys.
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const KEYS = [env.match(/PEXELS_API_KEY=(\S+)/), env.match(/PEXELS_API_KEY2=(\S+)/)].filter(Boolean).map((m) => m[1]);
if (!KEYS.length) { console.error('sin PEXELS_API_KEY'); process.exit(1); }
let ki = 0;
const key = () => KEYS[ki % KEYS.length];

const needs = JSON.parse(fs.readFileSync('_alimentos60_stock.json', 'utf8'));
fs.mkdirSync('public/broll', {recursive: true});
fs.mkdirSync('public/img', {recursive: true});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const usedIds = new Set();

async function pexJSON(url) {
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, {headers: {Authorization: key()}});
      if (r.status === 429) { ki++; await sleep(2500); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(1200); }
  }
  return null;
}
async function download(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(900); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 4000) { await sleep(700); continue; }
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(1000); }
  }
  return false;
}
async function fetchVideo(query, dest) {
  const j = await pexJSON(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape&size=medium`);
  if (!j || !j.videos) return false;
  for (const v of j.videos) {
    if (usedIds.has('v' + v.id)) continue;
    const files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.width);
    files.sort((a, b) => Math.abs((a.width || 0) - 1600) - Math.abs((b.width || 0) - 1600));
    if (files[0] && (await download(files[0].link, dest))) { usedIds.add('v' + v.id); return true; }
  }
  return false;
}
async function fetchPhoto(query, dest) {
  const j = await pexJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`);
  if (!j || !j.photos) return false;
  for (const p of j.photos) {
    if (usedIds.has('p' + p.id)) continue;
    const src = p.src && (p.src.large2x || p.src.large || p.src.original);
    if (src && (await download(src, dest))) { usedIds.add('p' + p.id); return true; }
  }
  return false;
}

let okV = 0, okP = 0, fail = 0;
for (const n of needs) {
  const isVid = n.type === 'video';
  const dest = isVid ? `public/broll/al_${n.name}.mp4` : `public/img/al_${n.name}.jpg`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) { isVid ? okV++ : okP++; continue; }
  const ok = isVid ? await fetchVideo(n.query, dest) : await fetchPhoto(n.query, dest);
  if (ok) { isVid ? okV++ : okP++; process.stdout.write(isVid ? 'V' : 'p'); }
  else {
    // video fallido → intentar foto de rescate (nunca hueco)
    if (isVid && (await fetchPhoto(n.query, `public/img/al_${n.name}.jpg`))) { okP++; process.stdout.write('r'); }
    else { fail++; process.stdout.write('x'); console.warn('\n  ⚠ sin stock:', n.name, '·', n.query); }
  }
  await sleep(350);
}
console.log(`\n=== stock alimentos60 === video:${okV} foto:${okP} fallos:${fail} / ${needs.length}`);
