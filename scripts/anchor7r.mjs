// anchor7r.mjs — busca frases en las captions COMPLETAS de bastidarenal7 (avatar + cola Fish)
// y devuelve el frame (30fps). Uso: node scripts/anchor7r.mjs queries.json
import fs from 'fs';

const AV = JSON.parse(fs.readFileSync('public/captions_bastidarenal7.json', 'utf8'));
const CO = JSON.parse(fs.readFileSync('public/captions_bastidarenal7cola.json', 'utf8'));
export const AVATAR_FRAMES = 28375;      // 945.826s * 30
export const COLA_START = 28384;          // avatar + 0.3s de aire
const OFF = Math.round((COLA_START / 30) * 1000);

const all = [
  ...AV.map((c) => ({...c})),
  ...CO.map((c) => ({...c, startMs: c.startMs + OFF, endMs: c.endMs + OFF})),
];
fs.writeFileSync('public/captions_bastidarenal7_full.json', JSON.stringify(all));

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const pos = [];
all.forEach((c) => { const t = norm(c.text); if (t) t.split(' ').forEach((w) => pos.push({t: w, ms: c.startMs})); });

function findFrame(phrase, fromFrame = 0) {
  const ws = norm(phrase).split(' ').filter(Boolean);
  const fromMs = (fromFrame / 30) * 1000;
  for (let i = 0; i <= pos.length - ws.length; i++) {
    if (pos[i].ms < fromMs) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (pos[i + j].t !== ws[j]) { ok = false; break; }
    if (ok) return {frame: Math.round((pos[i].ms * 30) / 1000), ms: pos[i].ms};
  }
  return null;
}

if (process.argv[2]) {
  const queries = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = {};
  for (const q of queries) {
    const r = findFrame(q.phrase, q.from || 0);
    out[q.id] = r ? {frame: r.frame, phrase: q.phrase} : {frame: null, phrase: q.phrase, MISS: true};
  }
  console.log(JSON.stringify(out, null, 1));
  const miss = Object.values(out).filter((o) => o.MISS).length;
  console.error(`\ntotal ${Object.keys(out).length} · MISS ${miss} · ultimo frame captions ${Math.round((all[all.length-1].endMs*30)/1000)}`);
}
