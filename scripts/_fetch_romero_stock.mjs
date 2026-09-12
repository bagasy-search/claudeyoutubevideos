// Descarga stock Pexels para los beats tipo "clip" del plan del romero.
import fs from 'fs';
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from './stock_lib.mjs';

const plan = JSON.parse(fs.readFileSync('_v3/truco-romero-joven_plan.json', 'utf8').replace(/^﻿/, ''));
const beats = plan.beats.filter((b) => b.tipo === 'clip' && b.query && b.query !== '-');
fs.mkdirSync('public/broll', { recursive: true });
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(800); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 20000) { await sleep(600); continue; }
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(1000); }
  }
  return false;
}

let ok = 0, miss = 0;
for (const b of beats) {
  const dest = `public/broll/truco-romero-joven_${b.name}.mp4`;
  if (fs.existsSync(dest)) { ok++; continue; }
  const parts = String(b.query).split(';').map((s) => s.trim()).filter(Boolean);
  const q = parts[1] || parts[0]; // preferir EN
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) {
    try { hit = await fn(q, b.seg || 5, used); } catch { hit = null; }
    if (hit && hit.link) break;
  }
  if (!hit || !hit.link) { console.log('MISS', b.name, '|', q); miss++; continue; }
  const done = await dl(hit.link, dest);
  if (done) { ok++; if (hit.key) used.add(hit.key); console.log('OK', b.name, hit.src || ''); }
  else { console.log('DLFAIL', b.name); miss++; }
  await sleep(300);
}
console.log(`\n=== stock: ${ok} OK · ${miss} MISS de ${beats.length} clips ===`);
