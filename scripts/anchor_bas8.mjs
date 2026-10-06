// Ancla frases del guion → frame (30fps) usando el mapa palabra→ms (_bastidarenal8_wordms.json).
// Uso: node scripts/anchor_bas8.mjs queries.json   (queries=[{id,phrase,from?}])
import fs from 'fs';
const M = JSON.parse(fs.readFileSync('_bastidarenal8_wordms.json','utf8'));
const norm = (s)=> s.toLowerCase().replace(/[áéíóúüñ]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u','ñ':'n'}[c])).replace(/[^0-9a-zñ ]/g,' ').split(/\s+/).filter(Boolean);
const W = M.words.map(w=>norm(w)[0]||'');
function findFrame(phrase, fromFrame=0){
  const ws = norm(phrase); const fromMs = fromFrame*1000/30;
  for(let i=0;i<=W.length-ws.length;i++){
    if(M.ms[i] < fromMs) continue;
    let ok=true; for(let j=0;j<ws.length;j++){ if(W[i+j]!==ws[j]){ok=false;break;} }
    if(ok) return {frame: Math.round(M.ms[i]*30/1000), ms:M.ms[i]};
  }
  return null;
}
const qs = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const out={}; let miss=0;
for(const q of qs){ const r=findFrame(q.phrase,q.from||0); out[q.id]=r?r.frame:null; if(!r){miss++; console.error('MISS',q.id,'::',q.phrase);} }
console.error(`\nframes: ${Object.keys(out).length} · MISS ${miss} · TOTAL_FRAMES ${Math.round(M.ms[M.ms.length-1]*30/1000)}`);
fs.writeFileSync('_bastidarenal8_frames.json', JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
