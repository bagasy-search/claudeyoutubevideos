import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SLUG='rayvault', FPS=30;
const plan=JSON.parse(fs.readFileSync('_v3/rayvault/anchored_plan.json','utf8').replace(/^\uFEFF/,''));
// Put detailed lists on the actual spoken enumeration, after its short introduction.
for(const [introId,listId]of [['rv_165','rv_165b'],['rv_236','rv_236b']]){
 const intro=plan.beats.find(b=>b.id===introId),list=plan.beats.find(b=>b.id===listId);
 if(intro&&list){list.component=intro.component;list.tipo='componente';list.props={...intro.props,bed:list.assetPath};intro.component=null;intro.props=null;intro.tipo='imagen';}
}
const budgetIntro=plan.beats.find(b=>b.id==='rv_226');
if(budgetIntro){budgetIntro.component=null;budgetIntro.props=null;budgetIntro.tipo='imagen';}
const orderIntro=plan.beats.find(b=>b.id==='rv_200');
if(orderIntro){
 const props=orderIntro.props;
 for(const [id,startIndex,steps]of [['rv_200b',1,props.steps.slice(0,2)],['rv_200c',3,props.steps.slice(2)]]){
  const beat=plan.beats.find(b=>b.id===id);beat.component='ProcessChips';beat.tipo='componente';beat.props={...props,steps,startIndex,bed:beat.assetPath};
 }
 orderIntro.component=null;orderIntro.props=null;orderIntro.tipo='imagen';
}
const probe=(rel)=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',path.join('public',rel)],{encoding:'utf8'}));
const master=probe('rayvault.wav');
const totalMs=Number(master.format.duration)*1000;
const totalFrames=Math.ceil(totalMs/1000*FPS);
const avatar=probe('rayvault_avatar.mp4');
const av=avatar.streams.find(s=>s.codec_type==='video');
if(av.r_frame_rate!=='30/1'||av.width!==1920||av.height!==1080)throw Error('Avatar must be 1080p30');
const avatarFrames=Number(av.nb_frames)||Math.floor(Number(av.duration)*30);
const repairs={rayvault_h_01:'rayvault_h_01_r1',rayvault_h_09:'rayvault_h_09_r1',rayvault_m_09:'rayvault_m_09_r1'};
const canonical=(s)=>{
 if(typeof s!=='string')return s;
 s=s.replace(/rayvault_rayvault_/g,'rayvault_');
 for(const [a,b]of Object.entries(repairs))s=s.replace(new RegExp(a+'(?=\\.jpg$|$)'),b);
 return s;
};
const deep=(v)=>typeof v==='string'?canonical(v):Array.isArray(v)?v.map(deep):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,deep(x)])):v;
const basename=(id)=>canonical(id.startsWith('rayvault_')?id:'rayvault_'+id);
const clipsPath='_v3/rayvault/clip_verdicts.json';
const clipVerdicts=fs.existsSync(clipsPath)?JSON.parse(fs.readFileSync(clipsPath,'utf8')):[];
const clipRows=Array.isArray(clipVerdicts)?clipVerdicts:Object.entries(clipVerdicts).map(([name,v])=>({name,...v}));
const goodClips=new Set(clipRows.filter(v=>v.ok).map(v=>v.name||v.id));
const overrides=fs.existsSync('_v3/rayvault/asset_overrides.json')?JSON.parse(fs.readFileSync('_v3/rayvault/asset_overrides.json','utf8')):{};
const applyOverride=(s)=>{s=canonical(s);for(const [a,b]of Object.entries(overrides))s=s.replace(new RegExp(a+'(?=\\.(?:jpg|mp4)$|$)'),b);return s;};
const overrideDeep=(v)=>typeof v==='string'?applyOverride(v):Array.isArray(v)?v.map(overrideDeep):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,overrideDeep(x)])):v;
const assets=new Set(['rayvault_avatar.mp4','rayvault_fish.wav']);
const owners=new Map();
const useAssets=(v,id)=>{
 if(typeof v==='string'&&/^(img\/.*\.(?:jpg|png|webp)|broll\/.*\.mp4)$/.test(v)){
  if(!fs.existsSync(path.join('public',v)))throw Error(`Missing ${v}`);
  const family=v.replace(/^(img|broll)\//,'').replace(/\.(jpg|png|mp4|webp)$/,'').replace(/_blur$/,'');
  if(owners.has(family)&&owners.get(family)!==id)throw Error(`Repeated asset ${family}: ${owners.get(family)},${id}`);
  owners.set(family,id);assets.add(v);
 }else if(Array.isArray(v))v.forEach(x=>useAssets(x,id));
 else if(v&&typeof v==='object')Object.values(v).forEach(x=>useAssets(x,id));
};
const beats=plan.beats.map(b=>{
 if(!Number.isFinite(b.ms_in)||!Number.isFinite(b.ms_out))throw Error(`Unanchored ${b.id}`);
 const from=Math.round(b.ms_in/1000*30),to=Math.round(b.ms_out/1000*30);
 const id=b.id||`beat_${from}`;
 const component=b.component||b.componente||null;
 const asset=applyOverride(basename(b.assetId||b.imagen||''));
 const props=overrideDeep(deep(b.props||{}));
 let tipo=b.tipo;
 if(component&&b.layer!=='over'&&tipo!=='imagen')tipo='componente';
 let src=tipo==='avatar'?'rayvault_avatar.mp4':applyOverride(b.assetPath||`img/${asset}.jpg`);
 if(tipo==='imagen'&&(to-from)/30<=6.8&&goodClips.has(asset)&&fs.existsSync(`public/broll/${asset}.mp4`)) {tipo='clip';src=`broll/${asset}.mp4`;}
 return {...b,id,from,to,component,props,tipo,src};
}).sort((a,b)=>a.from-b.from);
if(beats[0].tipo!=='avatar'||beats[0].from!==0)throw Error('Open with actual avatar');
for(let i=0;i<beats.length;i++){
 const b=beats[i],next=beats[i+1];
 if(next&&Math.abs(next.from-b.to)<=1)b.to=next.from;
 if(!next)b.to=totalFrames;
 if(b.to<=b.from)throw Error('Zero duration '+b.id);
 if(next&&b.to!==next.from)throw Error(`Gap/overlap ${b.id}`);
 if(b.tipo==='avatar'&&b.to>avatarFrames)throw Error('Avatar past real footage '+b.id);
 if((b.to-b.from)/30>10.5)throw Error('Unbroken shot over10.5seconds '+b.id);
 if(b.tipo!=='avatar'){if(b.tipo==='componente')useAssets(b.props,b.id);else useAssets(b.src,b.id);}
}
const overlays=(plan.overlays||[]).map((o)=>({...o,id:o.id||`ov_${o.ms_in}`,from:Math.round(o.ms_in/1000*30),to:Math.round(o.ms_out/1000*30),component:o.component||o.componente,props:overrideDeep(deep(o.props||{}))})).reduce((out,o)=>{
 if(o.component==='RayCta')o.props.sub='The door inspection guide is in development.';
 const previous=out.at(-1);
 if(previous&&previous.component===o.component&&previous.to===o.from&&JSON.stringify(previous.props)===JSON.stringify(o.props)){previous.to=o.to;previous.ms_out=o.ms_out;}
 else out.push(o);
 return out;
},[]);
for(const o of overlays){if(!Number.isFinite(o.from)||o.to<=o.from)throw Error('Unanchored overlay '+o.id);useAssets(o.props,o.id);}
const components=new Set([...beats,...overlays].map(b=>b.component).filter(Boolean));
if(components.size<6)throw Error('Insufficient kit variety');
const stage=new Set(['Label','StatBug','Keyring']);
const imports=[`import React from 'react';`,`import {AbsoluteFill,Audio,OffthreadVideo,Sequence,staticFile,useCurrentFrame} from 'remotion';`,`import {Foto${[...components].filter(c=>stage.has(c)).map(c=>', '+c).join('')}} from '../rksafe/RayStage';`,...[...components].filter(c=>!stage.has(c)).map(c=>`import {${c}} from '../rksafe/${c}';`)];
const avatarComponent=`const RayvaultAvatar:React.FC<{start:number}>=({start})=>{const f=useCurrentFrame();return <OffthreadVideo muted src={staticFile('rayvault_avatar.mp4')} startFrom={start} style={{width:'100%',height:'100%',objectFit:'cover',transform:\`scale(\${(1.006+f*0.000035).toFixed(5)})\`}} />;};`;
const expressions=[];
const clipReport=[];
for(const b of beats){
 const d=b.to-b.from;
 let el;
 if(b.tipo==='avatar')el=`<RayvaultAvatar start={${b.from}} />`;
 else if(b.tipo==='imagen')el=`<Foto src=${JSON.stringify(b.src)} seed={${b.from}} />`;
 else if(b.tipo==='clip'){
  const v=probe(b.src).streams.find(s=>s.codec_type==='video');
  if(v.r_frame_rate!=='30/1'||Math.abs(v.width/v.height-16/9)>0.01)throw Error('Clip format mismatch '+b.src);
  const rate=Math.min(1,(Number(v.duration)-0.05)/(d/30));
  if(rate<0.5)throw Error('Clip would be too slow '+b.id);
  el=`<OffthreadVideo muted src={staticFile(${JSON.stringify(b.src)})} playbackRate={${rate.toFixed(6)}} style={{width:'100%',height:'100%',objectFit:'cover'}} />`;
  clipReport.push({id:b.id,src:b.src,rate});
 }else if(b.tipo==='componente')el=`<${b.component} durationInFrames={${d}} {...(${JSON.stringify(b.props)} as any)} />`;
 else throw Error('Unknown type '+b.tipo);
 expressions.push(`<Sequence key=${JSON.stringify(b.id)} from={${b.from}} durationInFrames={${d}}><AbsoluteFill>${el}</AbsoluteFill></Sequence>`);
}
for(const o of overlays)expressions.push(`<Sequence key=${JSON.stringify('over_'+o.id)} from={${o.from}} durationInFrames={${o.to-o.from}} layout="none"><${o.component} durationInFrames={${o.to-o.from}} {...(${JSON.stringify(o.props)} as any)} /></Sequence>`);
fs.mkdirSync('src/VideoEdit',{recursive:true});
fs.writeFileSync('src/VideoEdit/Main_rayvault.tsx',`${imports.join('\n')}\n${avatarComponent}\nexport const TOTAL_FRAMES_RAYVAULT=${totalFrames};\nexport const MainRayvault:React.FC=()=> <AbsoluteFill style={{backgroundColor:'#0A0A0C'}}>\n${expressions.join('\n')}\n<Audio src={staticFile('rayvault_fish.wav')} />\n</AbsoluteFill>;\n`);
fs.writeFileSync('src/index_rayvault.tsx',`import React from 'react';\nimport {Composition,registerRoot} from 'remotion';\nimport {MainRayvault,TOTAL_FRAMES_RAYVAULT} from './VideoEdit/Main_rayvault';\nconst Root=()=> <Composition id="Rayvault" component={MainRayvault} durationInFrames={TOTAL_FRAMES_RAYVAULT} fps={30} width={1920} height={1080} />;\nregisterRoot(Root);\n`);
const listing=[];
for(const asset of assets){listing.push(asset);if(asset.startsWith('img/')){const blur=asset.replace(/\.(jpg|png|webp)$/,'_blur.jpg');if(!fs.existsSync('public/'+blur))throw Error('Missing blur '+blur);listing.push(blur);}}
fs.writeFileSync('_rayvault_assets.txt',[...new Set(listing)].sort().join('\n')+'\n');
const report={totalMs,totalFrames,beats:beats.length,overlays:overlays.length,components:[...components],uniqueImages:owners.size,assetCount:assets.size,clips:clipReport,avatarSeconds:beats.filter(b=>b.tipo==='avatar').reduce((n,b)=>n+(b.to-b.from)/30,0),maxShot:Math.max(...beats.map(b=>(b.to-b.from)/30))};
fs.writeFileSync('_v3/rayvault/build_report.json',JSON.stringify(report,null,2));
fs.writeFileSync('_v3/rayvault/final_plan.json',JSON.stringify({beats,overlays,totalMs,totalFrames},null,2));
console.log(JSON.stringify(report,null,2));
