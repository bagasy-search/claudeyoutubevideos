import fs from 'fs';
const caps = JSON.parse(fs.readFileSync('public/captions_bastidarenal5.json','utf8'));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
// build word stream with ms
const words = caps.map(c=>({t:norm(c.text), ms:c.startMs}));
const full = words.map(w=>w.t).filter(Boolean);
// map each word position -> ms (skip empties)
const pos = []; caps.forEach(c=>{const t=norm(c.text); if(t) pos.push({t,ms:c.startMs});});
function findFrame(phrase){
  const ws = norm(phrase).split(' ').filter(Boolean);
  for(let i=0;i<=pos.length-ws.length;i++){
    let ok=true;
    for(let j=0;j<ws.length;j++){ if(pos[i+j].t!==ws[j]){ok=false;break;} }
    if(ok) return {frame: Math.round(pos[i].ms*30/1000), ms:pos[i].ms};
  }
  return null;
}
const queries = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const out={};
for(const q of queries){ const r=findFrame(q.phrase); out[q.id]= r?{...r,phrase:q.phrase}:{frame:null,phrase:q.phrase,MISS:true}; }
console.log(JSON.stringify(out,null,1));
