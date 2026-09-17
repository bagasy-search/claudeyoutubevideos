// valvaselina15_reel.mjs — arma el REEL del avatar: todas las ventanas visibles (+0,3 s de margen) concatenadas SIN silencios.
// Salidas: _work/valvaselina15/av/reel.wav (16 kHz mono) + segs.json [{start,end,off}] (off = segundo del reel donde arranca el tramo)
import fs from 'fs';
import {execFileSync} from 'child_process';
const W = '_work/valvaselina15/av';
const wins = JSON.parse(fs.readFileSync(`${W}/windows.json`, 'utf8'));
const DUR = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'public/valvaselina15.wav']).toString().trim();
const segs = [];
for (const w of wins) {
  const s = Math.max(0, w.start - 0.3), e = Math.min(DUR, w.end + 0.3);
  const last = segs[segs.length - 1];
  if (last && s <= last.end + 0.6) last.end = Math.max(last.end, e); else segs.push({start: s, end: e});
}
// cola de 1 s de audio real al final (InfiniteTalk trunca ~0,3 s al final de la llamada)
segs[segs.length - 1].end = Math.min(DUR, segs[segs.length - 1].end + 1.0);
fs.mkdirSync(`${W}/parts`, {recursive: true});
let off = 0; const list = [];
segs.forEach((g, k) => {
  const f = `${W}/parts/s${String(k).padStart(3, '0')}.wav`;
  // corte por MUESTRAS (16 kHz) para que off sea exacto
  const a = Math.round(g.start * 16000), b = Math.round(g.end * 16000);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'public/valvaselina15.wav', '-af', `aresample=16000,atrim=start_sample=${a}:end_sample=${b},asetpts=N/SR/TB`, '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', f]);
  g.start = a / 16000; g.end = b / 16000; g.off = off; off += (b - a) / 16000;
  list.push(`file '${f.split('/').pop()}'`);
});
fs.writeFileSync(`${W}/parts/list.txt`, list.join('\n'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${W}/parts/list.txt`, '-c', 'copy', `${W}/reel.wav`]);
const real = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${W}/reel.wav`]).toString().trim();
fs.writeFileSync(`${W}/segs.json`, JSON.stringify(segs, null, 1));
console.log(`tramos ${segs.length} · reel ${real.toFixed(3)} s (esperado ${off.toFixed(3)}) · ${real > 590 ? '⛔ > 590 s' : 'ok ≤ 590'}`);
