// valnacar_rpwait.mjs — espera el job de RunPod (poll cada 3 min) y baja el mp4 a _work/valnacar/av/reel.mp4
import fs from 'fs';
const W = '_work/valnacar/av';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).map((l) => l.match(/^([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const job = JSON.parse(fs.readFileSync(`${W}/runpod_job.json`, 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const findUrl = (o) => { if (!o) return null; if (typeof o === 'string') return /^https?:\/\/.*\.mp4/i.test(o) || /^https?:\/\//.test(o) ? o : null; for (const v of Object.values(o)) { const u = findUrl(v); if (u) return u; } return null; };
for (let i = 0; i < 60; i++) {
  let j; try { j = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${job.id}`, {headers: {Authorization: `Bearer ${env.RUNPOD_API_KEY}`}})).json(); } catch (e) { console.log('poll err', e.message); await sleep(60000); continue; }
  console.log(new Date().toISOString().slice(11, 19), j.status, j.executionTime || '');
  if (j.status === 'COMPLETED') {
    fs.writeFileSync(`${W}/runpod_result.json`, JSON.stringify(j, null, 1).slice(0, 20000));
    const url = findUrl(j.output);
    if (url) { const r = await fetch(url); fs.writeFileSync(`${W}/reel.mp4`, Buffer.from(await r.arrayBuffer())); console.log('BAJADO', fs.statSync(`${W}/reel.mp4`).size); }
    else if (typeof j.output?.video === 'string') { fs.writeFileSync(`${W}/reel.mp4`, Buffer.from(j.output.video.replace(/^data:.*?,/, ''), 'base64')); console.log('BAJADO b64'); }
    else console.log('SIN URL en output', JSON.stringify(j.output).slice(0, 300));
    process.exit(0);
  }
  if (['FAILED', 'CANCELLED', 'TIMED_OUT'].includes(j.status)) { console.log('FALLÓ', JSON.stringify(j).slice(0, 500)); process.exit(1); }
  await sleep(180000);
}
