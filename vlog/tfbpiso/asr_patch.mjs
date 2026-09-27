// re-ASR (whisper-1, palabras) de ventanas donde el ASR global se comió frases; reemplaza esas palabras en captions
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const env = Object.fromEntries(fs.readFileSync(".env","utf8").split(/\r?\n/).filter(l=>l.includes("=")&&!l.startsWith("#")).map(l=>[l.slice(0,l.indexOf("=")).trim(), l.slice(l.indexOf("=")+1).trim().replace(/^"|"$/g,"")]));
const CAP = "public/captions_tfbpiso.json"; let caps = JSON.parse(fs.readFileSync(CAP,"utf8"));
for (const w of process.argv.slice(2)) {
  const [a,b] = w.split("-").map(Number);
  execFileSync("ffmpeg",["-v","error","-y","-ss",String(a),"-to",String(b),"-i","out/tfbpiso/master.wav","-ac","1","-ar","16000","out/_p.mp3"]);
  const fd = new FormData(); fd.append("model","whisper-1"); fd.append("language","es"); fd.append("response_format","verbose_json"); fd.append("timestamp_granularities[]","word");
  fd.append("file", new Blob([fs.readFileSync("out/_p.mp3")]), "p.mp3");
  const j = await (await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY},body:fd})).json();
  const nw = j.words.map(x=>({text:x.word,startMs:Math.round((x.start+a)*1000),endMs:Math.round((x.end+a)*1000),timestampMs:Math.round((x.end+a)*1000),confidence:1}));
  // reemplazo sólo el tramo interior (1 s de margen) para no duplicar bordes
  const lo=(a+1)*1000, hi=(b-1)*1000;
  caps = caps.filter(c=>c.startMs<lo||c.startMs>=hi).concat(nw.filter(c=>c.startMs>=lo&&c.startMs<hi)).sort((x,y)=>x.startMs-y.startMs);
  console.log(w, j.words.length, "palabras ·", j.text.slice(0,120));
}
fs.writeFileSync(CAP, JSON.stringify(caps));
