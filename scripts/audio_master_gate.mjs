// audio_master_gate.mjs — COMPUERTA: EL AUDIO DEL MP4 CONTRA EL WAV MÁSTER.
//
// Por que existe: el stitch del farm toma el audio del WAV MÁSTER sólo si el wav vino en el tar
// de assets (`[ -s public/<slug>.wav ]`); si no, cae en silencio al audio CONCATENADO chunk por
// chunk. Ese concat pierde ~120 ms en cada costura. En el re-render de `fedrodillas` el wav no
// estaba en el tar, el stitch cayó al concat y el mp4 salió con el audio 7,2 s MÁS CORTO que la
// locución — la voz se va desfasando hasta 1,4 s contra lo que se ve. El video renderiza "bien",
// los chunks salen todos en verde y ninguna compuerta de imagen lo ve.
//
// Chequea DOS cosas:
//   1. DURACIÓN: la pista de audio tiene que durar lo mismo que el wav máster (±0,5 s).
//   2. ALINEACIÓN: correlaciona la envolvente RMS en varias ventanas; el desfase tiene que ser 0.
//
//   node scripts/audio_master_gate.mjs <video.mp4> <master.wav>
//   exit 1 = el audio no es el máster, NO entregues
import { execFileSync } from "child_process";

const [V, W] = process.argv.slice(2);
if (!V || !W) { console.error("uso: node scripts/audio_master_gate.mjs <video.mp4> <master.wav>"); process.exit(1); }
const dur = (f, sel) => Number(execFileSync("ffprobe", ["-v","error","-select_streams",sel,
  "-show_entries","stream=duration","-of","default=nw=1:nk=1", f]).toString().trim().split("\n")[0]);

const aV = dur(V, "a:0"), aW = dur(W, "a:0");
const f = (t) => `${Math.floor(t/60)}:${String(Math.round(t%60)).padStart(2,"0")}`;
console.log(`audio del mp4 : ${aV.toFixed(2)} s (${f(aV)})`);
console.log(`wav máster    : ${aW.toFixed(2)} s (${f(aW)})`);
const gap = aW - aV;
let fail = false;
if (Math.abs(gap) > 0.5) {
  console.error(`\n❌ FALTAN ${gap.toFixed(2)} s DE AUDIO — el stitch no usó el wav máster, cayó al concat por chunks.`);
  fail = true;
} else console.log(`  ✓ duración (dif ${gap.toFixed(2)} s)`);

// alineación por envolvente RMS (robusta al re-encode)
const SR = 8000, WIN = 8, H = 80;
const pcm = (file, t) => {
  const b = execFileSync("ffmpeg", ["-nostdin","-v","error","-i",file,"-ss",String(t),"-t",String(WIN),
    "-ac","1","-ar",String(SR),"-f","s16le","-"], { maxBuffer: 1<<26 });
  const n = b.length>>1, a = new Float32Array(n);
  for (let i=0;i<n;i++) a[i]=b.readInt16LE(i*2)/32768;
  return a;
};
const env = (a) => {
  const m = Math.floor(a.length/H), o = new Float32Array(m);
  for (let i=0;i<m;i++){ let s=0; for(let j=0;j<H;j++){const v=a[i*H+j]; s+=v*v;} o[i]=Math.sqrt(s/H); }
  const mu = o.reduce((x,y)=>x+y,0)/m; for(let i=0;i<m;i++) o[i]-=mu; return o;
};
const pts = [0.08,0.25,0.42,0.58,0.75,0.92].map(p => Math.round(Math.min(aV,aW)*p));
let worst = 0;
console.log("\nalineación:");
for (const t of pts) {
  const A = env(pcm(V,t)), B = env(pcm(W,t));
  const L = Math.round(1.5*SR/H);
  let best=0, bv=-Infinity;
  for (let k=-L;k<=L;k++) {
    let s=0,n=0;
    for (let i=Math.max(0,-k);i<Math.min(A.length,B.length-k);i++){ s+=A[i]*B[i+k]; n++; }
    if (n>100){ const v=s/n; if(v>bv){bv=v;best=k;} }
  }
  const ms = best*10; worst = Math.max(worst, Math.abs(ms));
  console.log(`  ${f(t).padStart(6)}  ${String(ms).padStart(5)} ms`);
}
if (worst > 60) { console.error(`\n❌ DESFASADO hasta ${worst} ms contra la locución.`); fail = true; }
else console.log(`  ✓ alineado (peor ${worst} ms)`);

if (fail) process.exit(1);
console.log("\n✓ el audio ES el máster");
