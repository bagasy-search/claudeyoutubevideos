// check_redibujo.mjs — COMPUERTA: caza los clips que agnes REDIBUJO (cambio de escena o de persona).
//   node scripts/check_redibujo.mjs <slug> [umbral=0.35]   -> _v3/<slug>_redibujados.json
//
// SALTO INICIAL: frame 0 vs frame a 0.5 s. En medio segundo un clip sano (respirar/parpadear/zoom
// lento) casi no cambia; uno que agnes redibujo ya es OTRA escena. Separa limpio, a diferencia de
// comparar contra el final (que mide ZOOM).
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const FF="C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";
const SLUG=process.argv[2]; const UMBRAL=+(process.argv[3]||0.35);
if(!SLUG){console.error("uso: node scripts/check_redibujo.mjs <slug> [umbral=0.35]");process.exit(1);}
const dir=`public/broll/${SLUG}`, W=64,H=36;
const grab=(f,ss)=>{ try{ return execFileSync(FF,["-v","error",...(ss?["-ss",String(ss)]:[]),"-i",f,"-frames:v","1",
  "-vf",`scale=${W}:${H},format=gray`,"-f","rawvideo","-"],{maxBuffer:1e7}); }catch{ return null; } };
const norm=b=>{ const o=Float64Array.from(b); let m=0; for(const v of o)m+=v; m/=o.length;
  let s=0; for(const v of o)s+=(v-m)*(v-m); s=Math.sqrt(s/o.length)||1;
  for(let i=0;i<o.length;i++)o[i]=(o[i]-m)/s; return o; };
const out=[];
for (const f of fs.readdirSync(dir).filter(x=>x.endsWith(".mp4")).sort()){
  const p=`${dir}/${f}`; const A=grab(p,0), B=grab(p,0.5);
  if(!A||!B){ out.push([f,-1]); continue; }
  const a=norm(A), b=norm(B); let s=0; for(let i=0;i<a.length;i++) s+=Math.abs(a[i]-b[i]);
  out.push([f,+(s/a.length).toFixed(4)]);
}
fs.writeFileSync(`_v3/${SLUG}_salto.json`, JSON.stringify(out));
// el nombre del clip puede ser `algo_123.mp4` o `p123.mp4`: se guarda el NOMBRE, no un numero
const mal=out.filter(x=>x[1]>UMBRAL).map(x=>x[0].replace(/\.mp4$/,"")).sort();
fs.writeFileSync(`_v3/${SLUG}_redibujados.json`, JSON.stringify(mal));
const v=out.map(x=>x[1]).filter(x=>x>=0).sort((a,b)=>a-b);
const q=p=>v[Math.floor(v.length*p)].toFixed(3);
console.log(`clips ${v.length} · mediana ${q(.5)} · p75 ${q(.75)} · p90 ${q(.9)}`);
console.log(`REDIBUJADOS (salto > ${UMBRAL}): ${mal.length} (${Math.round(100*mal.length/v.length)}%) -> _v3/${SLUG}_redibujados.json`);
console.log(mal.join(","));
