// scripts/rksafe_sfx.mjs <slug> — SFX SUTILES del kit MEZCLADOS AL MÁSTER (canal Ray Kessler).
//
// ⛔⛔ POR QUÉ AL MÁSTER Y NO CABLEADOS EN REMOTION: la receta de entrega re-encodea el MP4 del farm
//    con el WAV máster (pts==dts) y un SFX cableado como <Audio> en el Main se PIERDE ahí
//    (reference_farm_stitch_raw_422: "se PIERDEN los SFX cableados"). Mezclado en el audio, viaja solo.
// ⛔ El avatar se genera con la VOZ SOLA (`public/<slug>.wav`, intacto). La mezcla va a
//    `public/<slug>_mix.wav` y de ahí al `public/<slug>.m4a` que usa el render.
// Lee el plan YA ALINEADO por el build y `_v3/<slug>_transiciones.json`:
//   · transición con movimiento -> whoosh suave (-19 dB)
//   · entrada de componente     -> pop/tick (-21 dB); mecanismos animados -> mecánico (-22 dB)
//   node scripts/rksafe_sfx.mjs <slug>
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_sfx.mjs <slug>'); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const trs = fs.existsSync(`_v3/${SLUG}_transiciones.json`) ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_transiciones.json`, 'utf8')) : [];
const D = 'public/sfx/';
const SFX = {
  whoosh: [D + 'sfx_whoosh_soft.mp3', D + 'smooth_airy_whoosh_m_#2-1780923688387.mp3', D + 'ksjsbwuil-whoosh3-481204.mp3'],
  pop: [D + 'soft_3D_pop-in_with__#3-1780924131285.mp3', D + 'tiny_soft_tickclick__#3-1780923823227.mp3', D + 'sfx_paper_tick.mp3'],
  mech: [D + 'soft_mechanical_odom_#3-1780923982906.mp3', D + 'fast_vintage_mechani_#2-1780924051971.mp3'],
};
for (const l of Object.values(SFX)) for (const f of l) if (!fs.existsSync(f)) { console.error('⛔ falta ' + f); process.exit(1); }
const MECA = new Set(['LatchCutaway', 'DoorEdgeCount', 'GapScanTest', 'BoltMorph', 'HingeScrewPull', 'LatchGuardInstall', 'FixLadder', 'ScrewHero']);
const GAIN = { whoosh: 0.08, pop: 0.09, mech: 0.08 };

const eventos = [];
trs.forEach((x, i) => eventos.push({ t: Math.max(0, x.t - 0.12), tipo: 'whoosh', f: SFX.whoosh[i % SFX.whoosh.length] }));
plan.beats.filter((b) => b.kind === 'componente').forEach((b, i) => {
  const tipo = MECA.has(b.comp) ? 'mech' : 'pop';
  eventos.push({ t: b.t + 0.05, tipo, f: SFX[tipo][i % SFX[tipo].length] });
});
eventos.sort((a, b) => a.t - b.t);
// no dos SFX a menos de 0,35 s (se pisan y suenan a error)
const ev = [];
for (const e of eventos) if (!ev.length || e.t - ev.at(-1).t >= 0.35) ev.push(e);

const files = [...new Set(ev.map((e) => e.f))];
const args = ['-v', 'error', '-y', '-i', `public/${SLUG}.wav`];
for (const f of files) args.push('-i', f);
const parts = [];
const porArchivo = {};
ev.forEach((e) => { (porArchivo[e.f] ||= []).push(e); });
const labels = [];
files.forEach((f, fi) => {
  const lst = porArchivo[f];
  parts.push(`[${fi + 1}:a]aformat=sample_rates=44100:channel_layouts=mono,asplit=${lst.length}${lst.map((_, k) => `[s${fi}_${k}]`).join('')}`);
  lst.forEach((e, k) => {
    const ms = Math.round(e.t * 1000);
    parts.push(`[s${fi}_${k}]volume=${GAIN[e.tipo]},adelay=${ms}:all=1[d${fi}_${k}]`);
    labels.push(`[d${fi}_${k}]`);
  });
});
parts.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest[sfx]`);
parts.push(`[0:a][sfx]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[out]`);
fs.writeFileSync(`_v3/${SLUG}_sfx_filter.txt`, parts.join(';\n'));
execFileSync('ffmpeg', [...args, '-filter_complex_script', `_v3/${SLUG}_sfx_filter.txt`, '-map', '[out]', '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', `public/${SLUG}_mix.wav`], { windowsHide: true, maxBuffer: 1 << 26 });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `public/${SLUG}_mix.wav`, '-c:a', 'aac', '-b:a', '192k', `public/${SLUG}.m4a`], { windowsHide: true });
const dur = (p) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], { encoding: 'utf8', windowsHide: true }).trim();
const dv = dur(`public/${SLUG}.wav`), dm = dur(`public/${SLUG}_mix.wav`), da = dur(`public/${SLUG}.m4a`);
const cnt = {}; for (const e of ev) cnt[e.tipo] = (cnt[e.tipo] || 0) + 1;
console.log('═'.repeat(66));
console.log(`MEDIDO: ${ev.length} SFX (${JSON.stringify(cnt)}) de ${eventos.length} eventos · ${files.length} archivos`);
console.log(`  voz ${dv.toFixed(3)} s · mezcla ${dm.toFixed(3)} s · m4a ${da.toFixed(3)} s ${Math.abs(dv - dm) < 0.05 ? '✓' : '⛔ la mezcla cambió la duración'}`);
console.log(`  -> public/${SLUG}_mix.wav (entrega) · public/${SLUG}.m4a (render)`);
console.log('═'.repeat(66));
if (Math.abs(dv - dm) >= 0.05) process.exit(2);
