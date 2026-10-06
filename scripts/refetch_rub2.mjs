import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";
const outDir = "public/broll/rosemaryrub";
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FIX = [
  ["d075", "mature woman facial massage fingertips cheek"],
  ["d094", "mature woman itchy skin allergy"],
  ["d107", "woman rinsing face at sink"],
  ["d109", "senior woman touching face gently"],
];
async function dl(url, dest){for(let a=0;a<3;a++){try{const r=await fetch(url);if(!r.ok){await sleep(700);continue;}const b=Buffer.from(await r.arrayBuffer());if(b.length<20000){await sleep(500);continue;}fs.writeFileSync(dest,b);return true;}catch{await sleep(900);}}return false;}
let ok=0,miss=0;
for(const [name,q] of FIX){const dest=`${outDir}/${name}.mp4`;try{fs.rmSync(dest,{force:true});}catch{}let hit=null;for(const fn of [pexelsVideo,pixabayVideo,archiveVideo]){try{hit=await fn(q,5,used);}catch{hit=null;}if(hit&&hit.link)break;}if(!hit||!hit.link){console.log("MISS",name,q);miss++;continue;}const d=await dl(hit.link,dest);if(d){ok++;if(hit.key)used.add(hit.key);console.log("OK",name,(hit.src||"").slice(0,26),"|",q);}else{console.log("DLFAIL",name);miss++;}await sleep(250);}
console.log(`refetch2: ${ok} OK ${miss} MISS`);
