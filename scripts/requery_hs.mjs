import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";
const ALT = {
  d060: "medicinal dried herbs and roots", d066: "apothecary dried herbs jars", d068: "licorice sticks close up",
  d072: "dried ginger root pile", d074: "old person hands macro texture", d115: "senior hand veins close up", d118: "wrinkled skin texture macro",
};
const used = usedRegistry();
const outDir = "public/broll/handsage";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function dl(url, dest){ for(let a=0;a<3;a++){ try{ const r=await fetch(url); if(!r.ok){await sleep(700);continue;} const b=Buffer.from(await r.arrayBuffer()); if(b.length<20000){await sleep(600);continue;} fs.writeFileSync(dest,b); return true;}catch{await sleep(900);} } return false; }
let ok=0;
for (const [name,q] of Object.entries(ALT)){
  const dest=`${outDir}/${name}.mp4`;
  if(fs.existsSync(dest)&&fs.statSync(dest).size>20000){ok++;continue;}
  let hit=null; for(const fn of [pexelsVideo,pixabayVideo,archiveVideo]){ try{hit=await fn(q,6,used);}catch{hit=null;} if(hit&&hit.link)break; }
  if(hit&&hit.link&&await dl(hit.link,dest)){ ok++; if(hit.key)used.add(hit.key); console.log("OK",name,"|",q);} else console.log("STILL MISS",name,"|",q);
  await sleep(300);
}
console.log(`requery: ${ok}/${Object.keys(ALT).length}`);
