// valavena_reel.mjs — arma el reel de audio (todas las ventanas visibles concatenadas, sin silencios),
// lo sube con la referencia al bucket público de Supabase y dispara UN /run en RunPod InfiniteTalk.
// Uso: node _v3/valavena_reel.mjs [--build] [--submit]
import fs from 'fs';
import {execFileSync} from 'child_process';
import {supaCreds} from '../scripts/supa_creds.mjs';
const W = '_work/valavena/av';
const WAVD = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'public/valavena.wav']).toString().trim();
// colchón ±PAD por ventana (permite retocar el plan sin pagar otro /run); se unen las que se pisan
const PAD = 0.8;
const win = [];
for (const w of JSON.parse(fs.readFileSync(`${W}/windows.json`, 'utf8'))) {
  const s = Math.max(0, w.start - PAD), e = Math.min(WAVD, w.end + PAD), l = win[win.length - 1];
  if (l && s <= l.end) l.end = e; else win.push({start: s, end: e});
}
win.forEach((w, k) => (w.name = `r${String(k + 1).padStart(3, '0')}`));
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).map((l) => l.match(/^([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
if (process.argv.includes('--build')) {
  const list = [];
  for (const w of win) {
    const f = `${W}/${w.name}.wav`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', w.start.toFixed(3), '-to', w.end.toFixed(3), '-i', 'public/valavena.wav', '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', f]);
    list.push(`file '${w.name}.wav'`);
  }
  fs.writeFileSync(`${W}/list.txt`, list.join('\n') + '\n');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${W}/list.txt`, '-c', 'copy', `${W}/reel.wav`]);
  let off = 0; for (const w of win) { w.off = +off.toFixed(4); w.wdur = dur(`${W}/${w.name}.wav`); off += w.wdur; }
  fs.writeFileSync(`${W}/windows_reel.json`, JSON.stringify(win, null, 1));
  console.log(`reel ${dur(`${W}/reel.wav`).toFixed(2)} s · suma ventanas ${off.toFixed(2)} s · ${win.length} ventanas`);
}
if (process.argv.includes('--submit')) {
  const {U, K} = supaCreds();
  const up = async (local, remote, type) => {
    const r = await fetch(`${U}/storage/v1/object/thumbnails/${remote}`, {method: 'POST', headers: {apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': type, 'x-upsert': 'true'}, body: fs.readFileSync(local)});
    if (!r.ok) throw new Error(`upload ${remote} ${r.status} ${await r.text()}`);
    const url = `${U}/storage/v1/object/public/thumbnails/${remote}`;
    const h = await fetch(url, {method: 'HEAD'}); console.log('subido', remote, h.status);
    return url;
  };
  const img = await up('public/ref_valavena.png', 'runpod/valavena/ref_valavena.png', 'image/png');
  const aud = await up(`${W}/reel.wav`, 'runpod/valavena/reel_valavena.wav', 'audio/wav');
  const body = {input: {prompt: 'a warm mature woman doctor talking naturally to the camera, gentle head movements, natural blinking, expressive face', image: img, audio: aud, size: '720p', enable_safety_checker: false}, policy: {executionTimeout: 7200000}};
  const r = await fetch('https://api.runpod.ai/v2/infinitetalk/run', {method: 'POST', headers: {Authorization: `Bearer ${env.RUNPOD_API_KEY}`, 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  const j = await r.json();
  fs.writeFileSync(`${W}/runpod_job.json`, JSON.stringify({...j, submitted: new Date().toISOString(), reel_s: dur(`${W}/reel.wav`)}, null, 1));
  console.log('runpod', r.status, j.id, j.status);
}
