// pace_restaura.mjs — PASADA DE PACING (regla: ningún plano >5s; todo anclado al ms
// de lo que dice el avatar). Parte cada beat b-roll de _v3/restaura_beats.json en 2-3
// tomas de ~3.4-4.6s cortadas en LÍMITE DE PALABRA real (captions). La 1ª toma reusa la
// imagen existente; las tomas extra son una "toma 2/3" del MISMO momento (ángulo/plano
// distinto = dinámico, sin repetir) → nuevas imágenes gpt-image-2 low.
//
//   node pace_restaura.mjs
//   node gen_gptimage.mjs prompts_restaura_pacing.json public/img 1792x1008 low
//   node build_restaura.mjs && node beatsheet.mjs beatsheet/restaura.json
import fs from "fs";

const TARGET = 4.3, MIN = 2.6;   // seg por toma
const caps = JSON.parse(fs.readFileSync("public/captions_restaura.json", "utf8"));
const beats = JSON.parse(fs.readFileSync("_v3/restaura_beats.json", "utf8"));
beats.sort((a, b) => a.ms - b.ms);

const IMPERF = "Que se vea como una foto casera real sacada con celular: leve desenfoque en algunas zonas, ligera inclinacion de camara, luz desigual, piel con textura real, manos naturales relajadas, fondo algo desordenado, pequenas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental autentico, saturacion baja, colores suaves y ligeramente apagados. Sin texto ni carteles legibles. Sin primeros planos de dedos. No bokeh, todo en foco nitido.";
const WRAP = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
// variantes de encuadre para la 2ª/3ª toma del mismo momento (dinámico, no repite)
const FRAMES = [
  "a slightly different camera angle of the same scene, medium shot",
  "a closer detail shot of the same subject, tighter crop",
  "a wider shot of the same scene showing more of the surroundings",
  "an over-the-shoulder / side view of the same moment",
  "a low angle shot of the same subject",
];

const newBeats = [];
const newPrompts = [];
let nShots = 0;

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextMs = i + 1 < beats.length ? beats[i + 1].ms : caps[caps.length - 1].endMs + 1500;
  // palabras del beat (por startMs) dentro de su ventana
  const ws = caps.filter((c) => c.startMs >= b.ms - 40 && c.startMs < nextMs - 40);
  if (ws.length === 0) { newBeats.push(b); continue; }
  // partir en tomas por tiempo, cortando en límite de palabra
  const shots = [];
  let cur = [ws[0]];
  for (let k = 1; k < ws.length; k++) {
    const span = (ws[k].startMs - cur[0].startMs) / 1000;
    const restAfter = (nextMs - ws[k].startMs) / 1000;
    if (span >= TARGET && restAfter >= MIN) { shots.push(cur); cur = [ws[k]]; }
    else cur.push(ws[k]);
  }
  shots.push(cur);
  // emitir sub-beats
  shots.forEach((shot, si) => {
    // phrase = palabras de la toma + hasta completar ≥8 tokens para match único
    let phraseWords = shot.map((w) => w.text);
    let gi = caps.indexOf(shot[shot.length - 1]);
    while (phraseWords.join(" ").trim().split(/\s+/).length < 9 && gi + 1 < caps.length) {
      gi++; phraseWords.push(caps[gi].text);
    }
    const phrase = phraseWords.join(" ").replace(/\s+/g, " ").trim();
    if (si === 0) {
      newBeats.push({ ...b, phrase });
    } else {
      const name = `${b.name}_${String.fromCharCode(97 + si)}`; // _b, _c
      const frame = FRAMES[(i + si) % FRAMES.length];
      const desc = `${b.desc}, ${frame}`;
      newBeats.push({ name, section: b.section, ms: shot[0].startMs, phrase, dur: 4, desc, anchor: b.anchor, shot: b.shot, src: "photo" });
      newPrompts.push({ name, prompt: WRAP(desc) });
    }
    nShots++;
  });
}

fs.copyFileSync("_v3/restaura_beats.json", "_v3/restaura_beats_pre_pace.json");
fs.writeFileSync("_v3/restaura_beats.json", JSON.stringify(newBeats, null, 1));
fs.writeFileSync("prompts_restaura_pacing.json", JSON.stringify(newPrompts, null, 1));

const durs = [];
for (let i = 0; i < newBeats.length; i++) {
  const t = newBeats[i].ms, nt = i + 1 < newBeats.length ? newBeats[i + 1].ms : caps[caps.length - 1].endMs;
  durs.push((nt - t) / 1000);
}
durs.sort((a, b) => a - b);
const avg = durs.reduce((a, b) => a + b, 0) / durs.length;
console.log(`beats: ${beats.length} → ${newBeats.length} tomas · imágenes nuevas: ${newPrompts.length}`);
console.log(`dur/toma  medio ${avg.toFixed(1)}s · min ${durs[0].toFixed(1)}s · max ${durs[durs.length-1].toFixed(1)}s · >5s: ${durs.filter(d=>d>5).length}`);
