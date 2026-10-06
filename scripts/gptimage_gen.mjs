// gptimage_gen.mjs — objetos SIN referencia con gpt-image-2 /v1/images/generations, quality low.
//   node scripts/gptimage_gen.mjs <lista.json> <outDir> [size] [quality] [conc]
import fs from "node:fs"; import path from "node:path"; import "dotenv/config";
const [LIST, OUT, SIZE="1792x1008", QUALITY="low", CONC="4"] = process.argv.slice(2);
const KEY = process.env.OPENAI_API_KEY; if(!KEY){console.error("falta OPENAI_API_KEY");process.exit(1);}
const items = JSON.parse(fs.readFileSync(LIST,"utf8").replace(/^﻿/,""));
fs.mkdirSync(OUT,{recursive:true});
const todo = items.filter((it)=>!fs.existsSync(path.join(OUT,`${it.name}.png`)));
console.log(`gpt-image-2 gen · ${SIZE} · ${QUALITY} · ${todo.length}/${items.length}`);
let ok=0,fail=0;
const one=async(it)=>{
  for(let t=1;t<=4;t++){
    try{
      const r=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",
        headers:{Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({model:"gpt-image-2",prompt:it.prompt,size:it.size||SIZE,quality:QUALITY,n:1})});
      const txt=await r.text();
      if(!r.ok){ if(t===4){console.error(`FAIL ${it.name}: ${txt.slice(0,160)}`);fail++;} else {await new Promise(s=>setTimeout(s,1500*t));continue;} return;}
      const d=JSON.parse(txt); const b64=d.data[0].b64_json;
      fs.writeFileSync(path.join(OUT,`${it.name}.png`),Buffer.from(b64,"base64"));
      ok++; console.log(`ok ${it.name} (${ok}/${todo.length})`); return;
    }catch(e){ if(t===4){console.error(`ERR ${it.name}: ${e.message}`);fail++;} else await new Promise(s=>setTimeout(s,1500*t)); }
  }
};
const q=[...todo]; const workers=Array.from({length:+CONC},async()=>{while(q.length){await one(q.shift());}});
await Promise.all(workers); console.log(`DONE ok=${ok} fail=${fail}`);
