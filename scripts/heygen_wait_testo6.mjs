import fs from "node:fs";
const env={}; for(const l of fs.readFileSync(".env","utf8").split(/\r?\n/)){const m=l.match(/^([A-Z_]+)\s*=\s*(.*)$/);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const KEY=process.env.HEYGEN_API_KEY||env.HEYGEN_API_KEY;
const ID="40fd2cb9e3aa4e0bb5ad87c62c9cd4d5";
const OUT="public/testo6_raw.mp4";
if(!KEY){console.error("no HEYGEN_API_KEY");process.exit(2);}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const deadline=Date.now()+55*60*1000;
let last="";
while(Date.now()<deadline){
  try{
    const r=await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${ID}`,{headers:{"X-Api-Key":KEY}});
    const j=await r.json();
    const d=j.data||{}; const st=d.status;
    if(st!==last){console.log(new Date().toISOString(),"status:",st);last=st;}
    if(st==="completed"&&d.video_url){
      console.log("descargando...",d.video_url.slice(0,80));
      const vr=await fetch(d.video_url); const buf=Buffer.from(await vr.arrayBuffer());
      fs.writeFileSync(OUT,buf);
      fs.writeFileSync("public/testo6_avatar_ready.flag",`${d.video_url}\n${buf.length} bytes\n`);
      console.log("LISTO:",OUT,(buf.length/1e6).toFixed(1),"MB");
      process.exit(0);
    }
    if(st==="failed"){console.error("FAILED:",JSON.stringify(d).slice(0,300));process.exit(3);}
  }catch(e){console.error("poll err:",e.message);}
  await sleep(45000);
}
console.error("timeout esperando avatar");process.exit(4);
