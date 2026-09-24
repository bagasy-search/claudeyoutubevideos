// pace_shou.mjs — pacing (tomas ≤5s ancladas a palabra) + emisión de TODOS los prompts.
// Igual que pace_restaura pero: (a) slug shou, (b) shou NO tiene imágenes base, así
// que emite prompts_shou_all.json con TODAS las tomas (base 207 + toma-2/3 nuevas).
//   node pace_shou.mjs
//   node gen_gptimage.mjs prompts_shou_all.json public/img 1792x1008 low
//   node build_shou.mjs && node beatsheet.mjs beatsheet/shou.json
import fs from "fs";

const TARGET = 2.6, MIN = 1.7;
const caps = JSON.parse(fs.readFileSync("public/captions_shou.json", "utf8"));
const beats = JSON.parse(fs.readFileSync("_v3/shou_beats.json", "utf8"));
beats.sort((a, b) => a.ms - b.ms);

const IMPERF = "Que se vea como una foto casera real sacada con celular: leve desenfoque en algunas zonas, ligera inclinacion de camara, luz desigual, piel con textura real, manos naturales relajadas, fondo algo desordenado, pequenas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental autentico, saturacion baja, colores suaves y ligeramente apagados. Sin texto ni carteles legibles. Sin primeros planos de dedos. No bokeh, todo en foco nitido.";
const WRAP = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
const FRAMES = [
  "a slightly different camera angle of the same scene, medium shot",
  "a closer detail shot of the same subject, tighter crop",
  "a wider shot of the same scene showing more of the surroundings",
  "an over-the-shoulder / side view of the same moment",
  "a low angle shot of the same subject",
];

const newBeats = [];
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextMs = i + 1 < beats.length ? beats[i + 1].ms : caps[caps.length - 1].endMs + 1500;
  const ws = caps.filter((c) => c.startMs >= b.ms - 40 && c.startMs < nextMs - 40);
  if (ws.length === 0) { newBeats.push(b); continue; }
  const shots = [];
  let cur = [ws[0]];
  for (let k = 1; k < ws.length; k++) {
    const span = (ws[k].startMs - cur[0].startMs) / 1000;
    const restAfter = (nextMs - ws[k].startMs) / 1000;
    if (span >= TARGET && restAfter >= MIN) { shots.push(cur); cur = [ws[k]]; }
    else cur.push(ws[k]);
  }
  shots.push(cur);
  shots.forEach((shot, si) => {
    let phraseWords = shot.map((w) => w.text);
    let gi = caps.indexOf(shot[shot.length - 1]);
    while (phraseWords.join(" ").trim().split(/\s+/).length < 9 && gi + 1 < caps.length) { gi++; phraseWords.push(caps[gi].text); }
    const phrase = phraseWords.join(" ").replace(/\s+/g, " ").trim();
    if (si === 0) newBeats.push({ ...b, phrase });
    else {
      const name = `${b.name}_${String.fromCharCode(97 + si)}`;
      const frame = FRAMES[(i + si) % FRAMES.length];
      newBeats.push({ name, section: b.section, ms: shot[0].startMs, phrase, dur: 4, desc: `${b.desc}, ${frame}`, anchor: b.anchor, shot: b.shot, src: "photo" });
    }
  });
}

fs.copyFileSync("_v3/shou_beats.json", "_v3/shou_beats_pre_pace.json");
fs.writeFileSync("_v3/shou_beats.json", JSON.stringify(newBeats, null, 1));
// prompts de TODAS las tomas (base + nuevas)
const prompts = newBeats.map((b) => ({ name: b.name, prompt: WRAP(b.desc) }));
fs.writeFileSync("prompts_shou_all.json", JSON.stringify(prompts, null, 1));

const durs = [];
for (let i = 0; i < newBeats.length; i++) {
  const t = newBeats[i].ms, nt = i + 1 < newBeats.length ? newBeats[i + 1].ms : caps[caps.length - 1].endMs;
  durs.push((nt - t) / 1000);
}
durs.sort((a, b) => a - b);
console.log(`beats: ${beats.length} → ${newBeats.length} tomas · prompts: ${prompts.length}`);
console.log(`dur/toma medio ${(durs.reduce((a,b)=>a+b,0)/durs.length).toFixed(1)}s · >5s: ${durs.filter(d=>d>5).length}`);
