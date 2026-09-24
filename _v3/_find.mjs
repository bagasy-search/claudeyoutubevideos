import fs from "node:fs";
const caps = JSON.parse(fs.readFileSync("public/captions_mdtoilet.json","utf8").replace(/^﻿/,""));
const flat=[];
for(const c of caps){const n=c.text.toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim(); if(!n)continue; for(const w of n.split(" ")) flat.push({w,s:c.startMs/1000});}
const find=(p)=>{const q=p.toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim().split(" ");
 for(let i=0;i+q.length<=flat.length;i++){let ok=true;for(let j=0;j<q.length;j++)if(flat[i+j].w!==q[j]){ok=false;break;} if(ok)return flat[i].s;} return null;};
const A=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const out={};
for(const [k,p] of Object.entries(A)){const s=find(p); out[k]={ms:s==null?null:Math.round(s*1000),s,phrase:p}; console.log((s==null?"  ⛔ ":"  ✓ ")+k.padEnd(24)+(s==null?"NO ENCONTRADA":s.toFixed(2)+"s")+"   «"+p+"»");}
fs.writeFileSync("_v3/mdtoilet_anchors.json",JSON.stringify({totalMs:caps[caps.length-1].endMs,anchors:out},null,1));
