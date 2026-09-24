import fs from "node:fs";
const caps = JSON.parse(fs.readFileSync("public/captions_mdtoilet.json","utf8").replace(/^﻿/,""));
let cur=[], out=[];
for (const c of caps){ cur.push(c); if(/[.!?]$/.test(c.text.trim())){ out.push(cur); cur=[]; } }
if(cur.length) out.push(cur);
let acc=[], accStart=null;
for (const s of out){
  const t=s.map(w=>w.text).join("").trim();
  if(accStart===null) accStart=s[0].startMs;
  acc.push(t);
  const joined=acc.join(" ");
  if(joined.length>110){ const m=Math.floor(accStart/60000), sec=((accStart%60000)/1000).toFixed(1);
    console.log(`[${String(m).padStart(2,"0")}:${sec.padStart(4,"0")}] ${joined}`); acc=[]; accStart=null; }
}
if(acc.length){const m=Math.floor(accStart/60000), sec=((accStart%60000)/1000).toFixed(1);console.log(`[${String(m).padStart(2,"0")}:${sec.padStart(4,"0")}] ${acc.join(" ")}`);}
console.log("TOTAL_MS", caps[caps.length-1].endMs);
