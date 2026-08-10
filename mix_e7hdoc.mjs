// mix_e7hdoc.mjs — mezcla del documental de 25 min: VO Qwen3 + música por bloque + drone + SFX.
// Los SFX NO se escriben a mano: salen del timeline (una cortinilla de bloque = impacto,
// una ficha de teoría = whoosh), así siempre caen al ms de la narración.
import {execFileSync} from 'child_process';
import fs from 'fs';

const FF = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe';
const FP = FF.replace('ffmpeg.exe', 'ffprobe.exe');
const S = 'public/sfx/';

const tl = JSON.parse(fs.readFileSync('_v3/e7hdoc_timeline.json', 'utf8'));
const TOTAL = tl.totalS;
const dur = (f) => Number(execFileSync(FP, ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', f], {encoding: 'utf8'}).trim());

// ── SFX derivados del timeline ──────────────────────────────────────────────
const SFX = [];
for (const b of tl.beats) {
  const comps = (b.ov || []).map((o) => o.c);
  if (comps.includes('BlockCard'))    SFX.push([b.s - 0.35, 'cp_riser.wav', 0.55], [b.s, 'cp_boom.wav', 0.85]);
  else if (comps.includes('TheoryCard'))  SFX.push([b.s, 'deep-cinematic-zoom-3.mp3', 0.5]);
  else if (comps.includes('DeepTime'))    SFX.push([b.s, 'deep-cinematic-impact-1.mp3', 0.8]);
  else if (comps.includes('BigNumber'))   SFX.push([b.s, 'deep-cinematic-impact-1.mp3', 0.6]);
  else if (comps.includes('Stamp'))       SFX.push([b.s, 'impacto_hit.mp3', 0.55]);
  else if (comps.includes('TheorySplit')) SFX.push([b.s, 'whoosh.mp3', 0.42]);
  else if (comps.includes('Forensic'))    SFX.push([b.s, 'sfx_whoosh_soft.mp3', 0.40]);
}
// nunca dos SFX a menos de 0,45 s (se empastan)
SFX.sort((a, b) => a[0] - b[0]);
const LIMPIO = [];
for (const s of SFX) {
  if (s[0] < 0.2 || s[0] > TOTAL - 0.5) continue;
  if (!fs.existsSync(S + s[1])) continue;
  if (LIMPIO.length && s[0] - LIMPIO[LIMPIO.length - 1][0] < 0.45) continue;
  LIMPIO.push(s);
}
console.log(`SFX derivados del timeline: ${LIMPIO.length}`);

// ── música: la cama se repite hasta cubrir 25 min, y baja en los bloques densos ──
const musDur = dur(`${S}cp_music.wav`);
const loops = Math.ceil(TOTAL / musDur);

const inputs = [];
inputs.push('-i', 'public/e7hdoc.wav');                                    // 0 VO
inputs.push('-stream_loop', String(loops), '-i', `${S}cp_music.wav`);      // 1 música en loop
inputs.push('-stream_loop', '-1', '-i', `${S}rumble_const.mp3`);           // 2 drone
LIMPIO.forEach(([, f]) => inputs.push('-i', `${S}${f}`));                  // 3..

let fc = '';
fc += `[0:a]aformat=channel_layouts=stereo:sample_rates=48000,highpass=f=75,`
    + `acompressor=threshold=0.12:ratio=3:attack=8:release=180,volume=1.25,`
    + `apad=whole_dur=${TOTAL},asplit=2[vo][vosc];`;
fc += `[1:a]aformat=channel_layouts=stereo:sample_rates=48000,volume=0.22,`
    + `atrim=0:${TOTAL},afade=t=in:st=0:d=2,afade=t=out:st=${(TOTAL - 6).toFixed(2)}:d=6[mus];`;
fc += `[2:a]aformat=channel_layouts=stereo:sample_rates=48000,volume=0.13,`
    + `atrim=0:${TOTAL},afade=t=out:st=${(TOTAL - 3).toFixed(2)}:d=3[drn];`;
fc += `[mus][drn]amix=inputs=2:normalize=0[bedraw];`;
fc += `[bedraw][vosc]sidechaincompress=threshold=0.03:ratio=10:attack=12:release=320:makeup=1[bed];`;

const labels = [];
LIMPIO.forEach(([t, , v], i) => {
  const ms = Math.round(t * 1000);
  fc += `[${3 + i}:a]aformat=channel_layouts=stereo:sample_rates=48000,volume=${v},adelay=${ms}|${ms}[s${i}];`;
  labels.push(`[s${i}]`);
});
fc += `${labels.join('')}amix=inputs=${LIMPIO.length}:normalize=0,atrim=0:${TOTAL}[sfx];`;
fc += `[vo][bed][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.3:LRA=11[out]`;

const args = ['-y', ...inputs, '-filter_complex', fc, '-map', '[out]',
  '-t', String(TOTAL), '-ar', '48000', '-c:a', 'pcm_s16le', 'public/e7hdoc_mix.wav'];
fs.writeFileSync('_e7hdoc_mix_cmd.txt', 'ffmpeg ' + args.join(' '));
console.log(`mezclando ${TOTAL.toFixed(1)}s ...`);
try {
  execFileSync(FF, args, {stdio: ['ignore', 'ignore', 'pipe'], timeout: 900000});
  console.log('MIX OK -> public/e7hdoc_mix.wav');
} catch (e) {
  console.error('MIX FAIL:', String(e.stderr || e).slice(-1800));
  process.exit(1);
}
