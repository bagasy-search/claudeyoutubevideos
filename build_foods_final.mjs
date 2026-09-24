// build_foods_final.mjs — video FINAL clips-first. Cold-open (IA+KenBurns) + CUERPO
// (200 clips matcheados por frase: YT real + stock video, movimiento) + cierre + avatar.
import fs from "node:fs";

// beats del build estático anterior: reuso SOLO cold-open (<208.96) y cierre (>=1021.6) — imágenes+componentes de acento.
const prev = JSON.parse(fs.readFileSync("beatsheet/foods.json", "utf8")).beats;
const coldopen = prev.filter((b) => b.start < 208.96);
const close    = prev.filter((b) => b.start >= 1021.6);

// CUERPO: 200 beats matcheados (213.92–1021.6). Todos tienen broll/<name>.mp4 en disco.
const body = JSON.parse(fs.readFileSync("_v3/foods_body.json", "utf8"))
  .map((b) => ({ id: b.name, start: +(b.ms / 1000).toFixed(2), _bodyDur: b.dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0 }));

// ── avatar windows (mismo esquema; avatar full en picos+headers de capítulo+cierre) ──
const AV = [
  { start:0, mode:"full" }, { start:5.2, mode:"hidden" }, { start:95.92, mode:"full" },
  { start:112.05, mode:"hidden" }, { start:117.2, mode:"full" }, { start:139.9, mode:"hidden" },
  { start:155.52, mode:"full" }, { start:173.36, mode:"hidden" }, { start:179.68, mode:"right" },
  { start:195.0, mode:"full" }, { start:213.92, mode:"hidden" }, { start:269.6, mode:"full" },
  { start:283.36, mode:"hidden" }, { start:304.32, mode:"full" }, { start:306.24, mode:"hidden" },
  { start:576.56, mode:"full" }, { start:590.72, mode:"hidden" }, { start:732.93, mode:"full" },
  { start:735.92, mode:"hidden" }, { start:867.84, mode:"full" }, { start:874.53, mode:"hidden" },
  { start:1030.0, mode:"full" }, { start:1066.72, mode:"hidden" }, { start:1088.08, mode:"full" },
  { start:1113.0, mode:"full" },
];
const TOTAL = 1125.7;
const boundaryAfter = (t) => { for (const w of AV) if (w.start > t + 1e-6) return w.start; return TOTAL; };

// merge + tileo contiguo por tramo visible (clamp en límites de ventana avatar)
const cues = [...coldopen.map(b=>({...b})), ...body, ...close.map(b=>({...b}))].sort((a,b)=>a.start-b.start);
for (let i=0;i<cues.length;i++){
  const ns = i+1<cues.length ? cues[i+1].start : TOTAL;
  const bnd = boundaryAfter(cues[i].start);
  const d = +(Math.min(ns,bnd) - cues[i].start).toFixed(2);
  cues[i].dur = d;
  delete cues[i]._bodyDur;
}
const beats = cues.filter(c=>c.dur>0.2);

const visible=[]; for(let i=0;i<AV.length;i++){ const w=AV[i]; if(w.mode==="hidden")continue; visible.push({name:`w${i}`,from:w.start,to:i+1<AV.length?AV[i+1].start:TOTAL}); }

fs.writeFileSync("beatsheet/foods.json", JSON.stringify({ video:"foods", avatar:"foods_opt.mp4", clipsfirst:false, maxRawDur:6, beats }, null, 2));
fs.writeFileSync("public/avatar_windows_foods.json", JSON.stringify(visible,null,2));
fs.writeFileSync("src/VideoEdit/avatar_foods.gen.ts",
  `// GENERADO por build_foods_final.mjs. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_FOODS = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(AV,null,2)};\n`);

const bodyClips=beats.filter(b=>b.src&&b.src.startsWith("broll/fo_")).length;
const comps=beats.filter(b=>b.kind!=="raw").length;
console.log(`beats:${beats.length} · clips cuerpo(mov):${bodyClips} · componentes acento:${comps} · cold/close img:${beats.length-bodyClips-comps}`);
// gaps
let prevEnd=null,gaps=0; const winAt=(t)=>{let m=AV[0].mode;for(const w of AV)if(t+1e-6>=w.start)m=w.mode;return m;};
for(const c of beats){ if(prevEnd!==null && c.start-prevEnd>0.1 && winAt(prevEnd)!=="full"){gaps++;} prevEnd=+(c.start+c.dur).toFixed(2);}
console.log(gaps?`⚠ ${gaps} gaps`:"sin gaps ✓");
