import fs from 'node:fs';
import path from 'node:path';
const dir='_v3/rayvault';
const approval=JSON.parse(fs.readFileSync(`${dir}/image_approval_final.json`,'utf8'));
const rows=Array.isArray(approval)?approval:approval.items||approval.approvals||[];
const goodImages=new Set(rows.filter(v=>v.ok===true).map(v=>v.name));
const clipRows=JSON.parse(fs.readFileSync(`${dir}/clip_verdicts.json`,'utf8'));
const goodClips=new Set(clipRows.filter(v=>v.ok===true).map(v=>v.name));
const list=fs.readFileSync('_rayvault_assets.txt','utf8').trim().split(/\r?\n/);
const missing=[];let images=0,clips=0;
for(const file of list){
 const name=path.posix.basename(file).replace(/\.[^.]+$/,'');
 if(file.startsWith('img/')&&!name.endsWith('_blur')){images++;if(!goodImages.has(name))missing.push(file);}
 if(file.startsWith('broll/')){clips++;if(!goodClips.has(name))missing.push(file);}
 if(!fs.existsSync('public/'+file))missing.push('Absent '+file);
}
const report={status:missing.length?'FAIL':'PASS',images,clips,unapproved:missing};
fs.writeFileSync(`${dir}/media_approval_gate.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(missing.length)process.exit(1);
