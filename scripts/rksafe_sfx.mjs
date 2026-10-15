// scripts/rksafe_sfx.mjs <slug> — SFX SUTILES del kit mezclados AL MÁSTER (canal Ray Kessler).
//   node scripts/rksafe_sfx.mjs <slug> [--vol 0.18]
// Lee el plan ALINEADO (correr DESPUÉS de rksafe_build.mjs) y `_v3/<slug>_trans.json`, y pega sobre
// `public/<slug>.wav` (la voz) un whoosh en cada transición con movimiento y un acento por componente
// (pop de entrada, tics de cuenta, sello). Sale `public/<slug>.m4a`, que es lo que monta el Main.
// ⛔ La DURACIÓN del m4a tiene que ser la de la voz: el anclaje al ms y las ventanas de avatar dependen
//    de eso. Se mide al final.
// ⛔ Sutiles: la voz manda. Transiciones ~-16 dB, acentos ~-15 dB por debajo de la voz.
import fs from 'node:fs';
import { execFileSync as _execFileSync } from 'node:child_process';
const execFileSync = (c, a, o) => _execFileSync(c, a, { windowsHide: true, ...(o || {}) }); // sin ventanas de consola (27-sep)

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_sfx.mjs <slug> [--vol 0.18]'); process.exit(1); }
const iv = process.argv.indexOf('--vol');
const VOL = iv > 0 ? +process.argv[iv + 1] : 0.18;
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const trans = fs.existsSync(`_v3/${SLUG}_trans.json`) ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_trans.json`, 'utf8')) : [];
const SFX = 'public/sfx/';
const ok = (f) => fs.existsSync(SFX + f);
const WHOOSH = ['sfx_whoosh_soft.mp3', 'smooth_airy_whoosh_m_#2-1780923688387.mp3', 'sfx_trans1.mp3', 'sfx_trans3.mp3'].filter(ok);

const ev = [];   // { t, f, v }
trans.forEach((x, i) => { if (x.tin && x.tin !== 'cut' && WHOOSH.length) ev.push({ t: Math.max(0, x.t - 0.12), f: WHOOSH[i % WHOOSH.length], v: VOL * 0.9 }); });
for (const b of plan.beats.filter((x) => x.kind === 'componente')) {
  const at = (q) => b.t + b.dur * q;
  const p = b.props || {};
  switch (b.comp) {
    case 'LearnButtonWipe':
      ev.push({ t: at(0.03), f: 'sfx_pop.mp3', v: VOL });
      if (p.mode === 'wipe') { for (let k = 0; k < 6; k++) ev.push({ t: at(0.26 + k * 0.09), f: 'digit_tick.mp3', v: VOL * 0.8 }); ev.push({ t: at(0.8), f: 'sfx_chime.mp3', v: VOL * 1.1 }); }
      break;
    case 'RemoteTally': {
      const n = (p.items || []).length || 1;
      for (let i = 0; i < n; i++) ev.push({ t: at(0.12 + (i / n) * 0.58), f: 'node_pop.mp3', v: VOL });
      if (p.final) ev.push({ t: at(0.8), f: 'number_slam.mp3', v: VOL });
      break;
    }
    case 'RollingCodeWaves': {
      const n = (p.mode === 'both' ? (p.clicks || 4) : (p.clicks || 4) + 1);
      for (let i = 0; i < n; i++) ev.push({ t: at(0.14 + (i / Math.max(1, n - 1)) * 0.66), f: 'tiny_soft_tickclick__#3-1780923823227.mp3', v: VOL });
      break;
    }
    case 'DipSwitchReveal': ev.push({ t: at(0.26), f: 'smooth_sliding_exten_#3-1780923878335.mp3', v: VOL }); ev.push({ t: at(0.78), f: 'sfx_text_thud.mp3', v: VOL }); break;
    case 'HomeLinkClear': ev.push({ t: at(0.3), f: 'pin_plop.mp3', v: VOL }); if (p.mode === 'clear') ev.push({ t: at(0.74), f: 'sfx_chime.mp3', v: VOL }); break;
    case 'LastDoorCutaway': ev.push({ t: at(0.02), f: 'line_draw.mp3', v: VOL * 0.8 }); ev.push({ t: at(0.58), f: 'sfx_thump.mp3', v: VOL }); break;
    case 'BigStat': ev.push({ t: at(0.0), f: 'number_slam.mp3', v: VOL }); break;
    case 'RayCta': ev.push({ t: at(0.0), f: 'warm_short_pleasant__#1-1780923958442.mp3', v: VOL }); break;
    default: ev.push({ t: at(0.0), f: 'sfx_pop.mp3', v: VOL * 0.9 });
  }
}
const eventos = ev.filter((e) => ok(e.f)).sort((a, b) => a.t - b.t);
const faltan = ev.length - eventos.length;

const voz = `public/${SLUG}.wav`;
const durDe = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).match(/[\d.]+/)[0];
const DV = durDe(voz);
// una pista de SFX por tandas de 60 entradas (ffmpeg aguanta, pero la línea de comando de Windows no)
const TANDA = 60;
const partes = [];
for (let i = 0; i < eventos.length; i += TANDA) {
  const lote = eventos.slice(i, i + TANDA);
  const args = ['-v', 'error', '-y', '-f', 'lavfi', '-t', DV.toFixed(3), '-i', 'anullsrc=r=44100:cl=stereo'];
  for (const e of lote) args.push('-i', SFX + e.f);
  const fl = lote.map((e, k) => `[${k + 1}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=${e.v.toFixed(3)},adelay=${Math.round(e.t * 1000)}|${Math.round(e.t * 1000)}[s${k}]`);
  fl.push(`[0:a]${lote.map((_, k) => `[s${k}]`).join('')}amix=inputs=${lote.length + 1}:normalize=0:duration=first[m]`);
  const out = `_v3/${SLUG}_sfx_${partes.length}.wav`;
  execFileSync('ffmpeg', [...args, '-filter_complex', fl.join(';'), '-map', '[m]', '-c:a', 'pcm_s16le', out]);
  partes.push(out);
}
const args = ['-v', 'error', '-y', '-i', voz];
for (const p of partes) args.push('-i', p);
const mix = `[0:a]aformat=channel_layouts=stereo[v];[v]${partes.map((_, k) => `[${k + 1}:a]`).join('')}amix=inputs=${partes.length + 1}:normalize=0:duration=first,alimiter=limit=0.95[o]`;
execFileSync('ffmpeg', [...args, '-filter_complex', mix, '-map', '[o]', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', `public/${SLUG}.m4a`]);
const DM = durDe(`public/${SLUG}.m4a`);
console.log('═'.repeat(66));
console.log(`MEDIDO: ${eventos.length} SFX mezclados (${trans.filter((x) => x.tin && x.tin !== 'cut').length} de transición) · ${faltan} sin archivo`);
console.log(`voz ${DV.toFixed(3)} s → m4a ${DM.toFixed(3)} s ${Math.abs(DM - DV) < 0.08 ? '✓' : '⛔ la duración cambió'}`);
console.log('═'.repeat(66));
if (Math.abs(DM - DV) >= 0.08) process.exit(2);
