// scripts/rksafe_sfx.mjs <slug> [--vol 0.16] — MEZCLA los SFX sutiles del kit al MÁSTER (camino rksafe).
//   Lee `_v3/<slug>_plan.json` (entrada de cada componente) y `src/VideoEdit/cues_<slug>.gen.tsx`
//   (arranque de cada transición RayTrans) y escribe `public/<slug>.m4a` = máster + SFX.
//
// ⛔ Por qué al MÁSTER y no con <Audio> por cue: la receta de entrega re-encodea con el audio del
//    máster y los SFX cableados en Remotion se PIERDEN (medido en roweshower). Mezclados acá, el
//    m4a que rinde el farm y el que se entrega son el mismo.
// ⛔ La DURACIÓN no cambia (amix duration=first): el lipsync del avatar está anclado al ms del wav.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_sfx.mjs <slug> [--vol 0.16]'); process.exit(1); }
const vi = process.argv.indexOf('--vol');
const VOL = vi > 0 ? +process.argv[vi + 1] : 0.16;
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const WAV = `public/${SLUG}.wav`;
const OUT = `public/${SLUG}.m4a`;

const POR_COMP = {
  BigStat: 'number_slam.mp3', PullQuote: 'sfx_paper_tick.mp3', SplitVs: 'sfx_whoosh_soft.mp3',
  CrossSection: 'line_draw.mp3', MythTruth: 'sfx_text_thud.mp3', SafeXRay: 'line_draw.mp3',
  CheckCard: 'sfx_pop.mp3', RayChecklist: 'sfx_pop.mp3', FireWallSection: 'line_draw.mp3',
  ProcessChips: 'chip_pop3d.mp3', SafeRoomMap: 'marker_drive.mp3', BoltDownCut: 'counter_up.mp3',
  ThirtySecondTest: 'digit_tick.mp3', RatingLadder: 'bar_grow.mp3', RayCta: 'sfx_chime.mp3',
  WorstSpots: 'sfx_pop.mp3', RouteFlow: 'line_draw.mp3', ScrewHero: 'sfx_thump.mp3',
};
const TRANS = ['sfx_trans1.mp3', 'sfx_trans2.mp3', 'sfx_trans3.mp3', 'sfx_trans4.mp3'];

const eventos = [];
for (const b of plan.beats) {
  if (b.kind !== 'componente') continue;
  const f = POR_COMP[b.comp];
  if (f && fs.existsSync(`public/sfx/${f}`)) eventos.push({ t: b.t, f, v: VOL });
}
const cues = fs.existsSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`) ? fs.readFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, 'utf8') : '';
let k = 0;
for (const m of cues.matchAll(/start: ([\d.]+), dur: [\d.]+, el: \(d\) => <RayTrans kind="(\w+)"/g)) {
  const t = +m[1];
  // no pisar el golpe de un componente que entra en el mismo instante
  if (eventos.some((e) => Math.abs(e.t - t) < 0.5)) continue;
  eventos.push({ t, f: TRANS[k++ % TRANS.length], v: VOL * 0.7 });
}
eventos.sort((a, b) => a.t - b.t);

const args = ['-v', 'error', '-y', '-i', WAV];
for (const e of eventos) args.push('-i', `public/sfx/${e.f}`);
const fil = eventos.map((e, i) => `[${i + 1}:a]aresample=44100,aformat=channel_layouts=mono,volume=${e.v.toFixed(3)},adelay=${Math.round(e.t * 1000)}:all=1[s${i}]`);
const mix = `[0:a]${eventos.map((_, i) => `[s${i}]`).join('')}amix=inputs=${eventos.length + 1}:duration=first:normalize=0:dropout_transition=0[m]`;
fs.writeFileSync(`_v3/${SLUG}_sfx_filter.txt`, [...fil, mix].join(';\n'));
args.push('-filter_complex_script', `_v3/${SLUG}_sfx_filter.txt`, '-map', '[m]', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT);
execFileSync('ffmpeg', args, { windowsHide: true, stdio: 'inherit' });

const dur = (p) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], { encoding: 'utf8', windowsHide: true }).trim();
const dw = dur(WAV), dm = dur(OUT);
console.log('═'.repeat(66));
console.log(`MEDIDO: ${eventos.length} SFX (${eventos.filter((e) => !TRANS.includes(e.f)).length} de componente · ${eventos.filter((e) => TRANS.includes(e.f)).length} de transición) · vol ${VOL}`);
console.log(`   máster ${dw.toFixed(3)} s → ${OUT} ${dm.toFixed(3)} s ${Math.abs(dw - dm) < 0.06 ? '✓' : '⛔ cambió la duración'}`);
console.log('═'.repeat(66));
if (Math.abs(dw - dm) >= 0.06) process.exit(2);
