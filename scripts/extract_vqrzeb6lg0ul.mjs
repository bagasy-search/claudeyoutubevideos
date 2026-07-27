import fs from "fs";
const SLUG="vqrzeb6lg0ul";
const plan=JSON.parse(fs.readFileSync(`_v3/plan_${SLUG}.json`,"utf8"));
const imgs=new Map(); const clips=[];
const walk=(o)=>{
  if(!o||typeof o!=="object") return;
  if(Array.isArray(o)){o.forEach(walk);return;}
  if(typeof o.img==="string" && typeof o.prompt==="string" && !imgs.has(o.img)) imgs.set(o.img,o.prompt);
  for(const v of Object.values(o)) if(v&&typeof v==="object") walk(v);
};
plan.forEach((c,i)=>{
  walk(c);
  if(c.kind==="clip"){
    const q=(c.queries||[]).filter(x=>typeof x==="string"&&x.trim());
    clips.push({name:`${SLUG}_c${String(clips.length).padStart(3,"0")}`, beat:c.name, idx:i, queries:q.length?q:["home humidity"], kicker:c.kicker||""});
  }
});
fs.writeFileSync(`_v3/imgs_${SLUG}.json`,JSON.stringify([...imgs].map(([name,prompt])=>({name,prompt})),null,1));
fs.writeFileSync(`_v3/clips_${SLUG}.json`,JSON.stringify(clips,null,1));
console.log("IMÁGENES únicas:",imgs.size);
console.log("CLIPS a bajar:",clips.length);
const long=[...imgs].filter(([n,p])=>p.length<80);
console.log("prompts sospechosamente cortos:",long.length, long.slice(0,3).map(x=>x[0]));
const dupQ=clips.flatMap(c=>c.queries);
console.log("queries totales:",dupQ.length,"| únicas:",new Set(dupQ).size);
console.log("VISUALES estimados (imgs+clips):", imgs.size+clips.length);
