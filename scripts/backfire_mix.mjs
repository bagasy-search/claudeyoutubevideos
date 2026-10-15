// scripts/backfire_mix.mjs <slug> [--db -21] — MÁSTER del canal Walt Brennecke: la VOZ + el AUDIO REAL de
// los clips de archivo, bajo, debajo de la voz. NADA MÁS (sin música, sin ambientes, sin whooshes).
//   Correr DESPUÉS de rksafe_build (lee el plan ALINEADO). Entrada: public/<slug>.wav (voz, loudnorm -14).
//   Salida: public/<slug>_mix.wav (48 kHz estéreo, para encfin) + public/<slug>.m4a (lo que monta el Main).
// ⛔ Los clips reales tienen que conformarse con KEEP_AUDIO=1 (rksafe_stock_conform) o no traen audio.
// ⛔ La DURACIÓN del máster es la de la voz, al cuadro: el anclaje y las ventanas de avatar dependen de eso.
// ⛔ La voz no se toca (ni atempo ni resample de tono): sólo se le suma la cama y se pasa a 48 kHz.
import fs from 'node:fs';
import { execFileSync as _x } from 'node:child_process';
const run = (c, a) => _x(c, a, { windowsHide: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/backfire_mix.mjs <slug> [--db -21]'); process.exit(1); }
const idb = process.argv.indexOf('--db');
const DB = idb > 0 ? +process.argv[idb + 1] : -21;
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const VOZ = `public/${SLUG}.wav`;
if (!fs.existsSync(VOZ)) { console.error('⛔ falta ' + VOZ); process.exit(1); }
const durVoz = +run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', VOZ]).trim();
const tieneAudio = (f) => { try { return run('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f]).trim().length > 0; } catch { return false; } };

const clips = plan.beats.filter((b) => b.kind === 'clip' && b.real).sort((a, b) => a.t - b.t);
const conAudio = [];
for (const b of clips) { const f = 'public/' + b.asset; if (fs.existsSync(f) && tieneAudio(f)) conAudio.push(b); }
console.log(`clips reales: ${clips.length} · con audio: ${conAudio.length} · cama a ${DB} dB`);

const args = ['-v', 'error', '-y', '-i', VOZ];
for (const b of conAudio) args.push('-i', 'public/' + b.asset);
const g = Math.pow(10, DB / 20).toFixed(4);
const parts = ['[0:a]aresample=48000,aformat=channel_layouts=stereo[v]'];
const labs = ['[v]'];
conAudio.forEach((b, i) => {
  const d = b.dur * (b.rate ?? 1);
  const ms = Math.round(b.t * 1000);
  const fo = Math.max(0, d - 0.15).toFixed(3);
  parts.push(`[${i + 1}:a]atrim=0:${d.toFixed(3)},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=${g},afade=t=in:d=0.12,afade=t=out:st=${fo}:d=0.15,adelay=${ms}|${ms}[c${i}]`);
  labs.push(`[c${i}]`);
});
parts.push(`${labs.join('')}amix=inputs=${labs.length}:normalize=0:duration=first,atrim=0:${durVoz.toFixed(3)}[m]`);
args.push('-filter_complex', parts.join(';'), '-map', '[m]', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '2', `public/${SLUG}_mix.wav`);
run('ffmpeg', args);
run('ffmpeg', ['-v', 'error', '-y', '-i', `public/${SLUG}_mix.wav`, '-c:a', 'aac', '-b:a', '192k', `public/${SLUG}.m4a`]);
const durMix = +run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `public/${SLUG}_mix.wav`]).trim();
console.log(`MEDIDO: voz ${durVoz.toFixed(3)} s · mezcla ${durMix.toFixed(3)} s (dif ${(durMix - durVoz).toFixed(3)}) ${Math.abs(durMix - durVoz) < 0.05 ? '✓' : '⛔'} · → public/${SLUG}_mix.wav + .m4a`);
if (Math.abs(durMix - durVoz) >= 0.05) process.exit(2);
