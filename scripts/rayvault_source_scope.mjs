import fs from 'node:fs';
import path from 'node:path';
export function rayvaultSourceScope(entry='src/index_rayvault.tsx') {
 const seen=new Map(),queue=[entry];
 while(queue.length){
  const file=queue.pop();if(seen.has(file))continue;
  const text=fs.readFileSync(file,'utf8');seen.set(file,text);
  for(const m of text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){
   const stem=path.posix.normalize(path.posix.join(path.posix.dirname(file),m[1]));
   const found=['','.ts','.tsx','/index.ts','/index.tsx'].map(e=>stem+e).find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
   if(!found)throw Error('Missing transitive import '+stem);queue.push(found);
  }
 }
 const source=[...seen.values()].join('\n');
 const code=source.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').filter(l=>!l.trim().startsWith('//')).join('\n');
 if(/<Video(?:\s|>)/.test(code))throw Error('Legacy Video in actual source tree');
 const refs=new Set([...source.matchAll(/(?:img|broll|sfx|med)\/[A-Za-z0-9_./-]+\.(?:jpg|png|webp|mp4|mp3|wav)/g)].map(m=>m[0]));
 const list=new Set(fs.readFileSync('_rayvault_assets.txt','utf8').trim().split(/\r?\n/));
 for(const ref of refs){if(!fs.existsSync('public/'+ref)||!list.has(ref))throw Error('Missing or unpackaged asset '+ref);}
 console.log(`Rayvault source scope: ${seen.size} transitive files, ${refs.size} concrete assets verified`);
 return {source,files:[...seen.keys()],refs:[...refs]};
}
