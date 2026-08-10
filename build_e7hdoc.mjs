// build_e7hdoc.mjs — resuelve cada ancla textual de e7hdoc_beats.mjs contra las captions de Whisper
// y escribe _v3/e7hdoc_timeline.json + src/VideoEdit/e7hdoc_timeline.gen.ts
//
// Dos cosas que aprendió a la fuerza:
//  1) Whisper transcribe los nombres propios FONÉTICAMENTE (Davidovits→davidovitz, Posnansky→poznanski,
//     Bekaa→beca, Schoch→schock) y pasa los números escritos a dígitos. Por eso el match es DIFUSO.
//  2) Una cuadrícula pensada "a ojo" deja huecos de 30 s. Por eso los planos largos se PARTEN
//     automáticamente con assets del mismo bloque, respetando los que llevan componente pesado.
import fs from 'fs';
import {execFileSync} from 'child_process';
import {BLOQUES} from './e7hdoc_beats.mjs';

const CAPS = 'public/captions_e7hdoc.json';
if (!fs.existsSync(CAPS)) { console.error(`falta ${CAPS} — corré Whisper primero`); process.exit(1); }

const norm = (s) => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();

const caps = JSON.parse(fs.readFileSync(CAPS, 'utf8').replace(/^\uFEFF/, ''));
const palabras = caps.map((c) => ({t: norm(c.text), ms: c.startMs})).filter((w) => w.t);

// ── similitud tolerante a la fonética de Whisper ──
const lev = (a, b) => {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
};
const parecido = (a, b) => 1 - lev(a, b) / Math.max(a.length, b.length);

// score de una ventana de palabras contra el ancla: cuenta tokens que matchean (exacto o ≥0,72 de parecido)
const scoreVentana = (tokAncla, tokVent) => {
  let hits = 0;
  const usados = new Set();
  for (const ta of tokAncla) {
    let mejor = -1, mejorS = 0;
    tokVent.forEach((tv, i) => {
      if (usados.has(i)) return;
      const s = ta === tv ? 1 : (ta.length > 3 && tv.length > 3 ? parecido(ta, tv) : 0);
      if (s > mejorS) { mejorS = s; mejor = i; }
    });
    if (mejorS >= 0.72) { hits += mejorS; usados.add(mejor); }
  }
  return hits / tokAncla.length;
};

// busca el ancla desde `desdeIdx`; devuelve {idx, score}
function buscar(ancla, desdeIdx) {
  const tok = norm(ancla).split(' ').filter(Boolean);
  const L = tok.length;
  let mejor = {idx: -1, score: 0};
  const hasta = palabras.length - 1;
  for (let i = desdeIdx; i <= hasta; i++) {
    const vent = palabras.slice(i, i + L + 2).map((w) => w.t);
    if (!vent.length) break;
    const s = scoreVentana(tok, vent);
    if (s > mejor.score) { mejor = {idx: i, score: s}; if (s > 0.97) break; }
  }
  return mejor;
}

let cursor = 0;
const noEncontradas = [];
let timeline = [];

for (const bloque of BLOQUES) {
  for (const beat of bloque.beats) {
    let r = buscar(beat.at, cursor);
    if (r.score < 0.55) {                       // reintento global, por si el orden se corrió
      const g = buscar(beat.at, 0);
      if (g.score > r.score) r = g;
    }
    if (r.idx < 0 || r.score < 0.5) { noEncontradas.push(`${bloque.id} :: ${beat.at} (score ${r.score.toFixed(2)})`); continue; }
    cursor = Math.max(cursor, r.idx + 1);
    timeline.push({
      bloque: bloque.id, at: beat.at, score: +r.score.toFixed(2),
      s: +(palabras[r.idx].ms / 1000).toFixed(3), bg: {...beat.bg}, ov: beat.ov || [],
    });
  }
}

timeline.sort((a, b) => a.s - b.s);
const finAudio = Math.max(...caps.map((c) => c.endMs)) / 1000;
const TOTAL = +(finAudio + 2.0).toFixed(3);
const cerrar = (tl) => tl.forEach((t, i) => {
  t.e = i + 1 < tl.length ? tl[i + 1].s : TOTAL;
  t.dur = +(t.e - t.s).toFixed(3);
});
cerrar(timeline);

// ── pools de b-roll por bloque, para partir los planos largos sin salirse de tema ──
const PREFIJOS = {
  pro: ['pro_', 'cl_'], bk: ['bk_', 'baalbek'], gz: ['gz_', 'giza'], sq: ['sq_', 'sacsay'],
  pp: ['pp_', 'pumapunku'], kl: ['kl_', 'kailasa'], yg: ['yg_', 'yonaguni'],
  gt: ['gt_', 'gobekli'], cl: ['cl_', 'pro_'],
};
const clips = fs.readdirSync('public/broll').filter((f) => f.startsWith('e7hd_') && f.endsWith('.mp4'));
const imgs = fs.readdirSync('public/img').filter((f) => f.startsWith('e7hd_') && f.endsWith('.jpg') && !f.includes('_blur'));
const MALAS = ['pumapunku_05'];                 // cartel informativo del sitio: inservible como plano
const pool = {};
for (const [id, pref] of Object.entries(PREFIJOS)) {
  pool[id] = [
    ...clips.filter((f) => pref.some((p) => f.includes(p))).map((f) => ({src: `broll/${f}`})),
    ...imgs.filter((f) => pref.some((p) => f.includes(p)) && !MALAS.some((m) => f.includes(m)))
      .map((f) => ({src: `img/${f}`, kind: 'img'})),
  ];
}

// ── partir los planos largos ──
const PESADOS = ['TheoryCard', 'DeepTime', 'KnownUnknown', 'TheorySplit', 'BlockCard'];
// ciclo de duraciones IRREGULAR: la regla dura del pipeline prohíbe la sucesión pareja.
// mezcla planos de respiro (3s) con planos que dejan entender (8s) → mediana ~4,5 y p75 alto.
const CICLO = [3.2, 5.0, 3.6, 7.5, 4.2, 6.2, 3.4, 8.5, 4.8, 5.6];
const FOCOS = ['50% 50%', '46% 44%', '54% 56%', '50% 40%', '52% 60%'];
const ZOOMS = [[1.05, 1.16], [1.12, 1.02], [1.08, 1.20], [1.16, 1.05], [1.04, 1.14]];

const conRelleno = [];
let rellenados = 0, nuevos = 0;
for (const t of timeline) {
  const pesado = (t.ov || []).some((o) => PESADOS.includes(o.c));
  const techo = pesado ? 13 : 7.5;               // un componente pesado necesita sostenerse
  if (t.dur <= techo || !pool[t.bloque] || pool[t.bloque].length < 2) { conRelleno.push(t); continue; }

  const primera = pesado ? Math.min(t.dur, 11) : Math.min(t.dur, 4.6);
  conRelleno.push({...t, e: +(t.s + primera).toFixed(3), dur: +primera.toFixed(3)});
  let cur = t.s + primera;
  const p = pool[t.bloque];
  let k = Math.abs(t.at.length * 7) % p.length;
  let anterior = t.bg.src;
  while (t.e - cur > 1.6) {
    const trozo = Math.min(CICLO[nuevos % CICLO.length], t.e - cur);
    let cand = p[k % p.length]; k++;
    if (cand.src === anterior) { cand = p[k % p.length]; k++; }
    anterior = cand.src;
    conRelleno.push({
      bloque: t.bloque, at: `${t.at} · relleno`, relleno: true,
      s: +cur.toFixed(3), e: +(cur + trozo).toFixed(3), dur: +trozo.toFixed(3),
      bg: {...cand, focus: FOCOS[nuevos % FOCOS.length], z: ZOOMS[nuevos % ZOOMS.length]},
      ov: [],
    });
    cur += trozo; nuevos++;
  }
  if (t.e - cur > 0.05) {                        // el resto se lo come el último trozo
    const u = conRelleno[conRelleno.length - 1];
    u.e = t.e; u.dur = +(u.e - u.s).toFixed(3);
  }
  rellenados++;
}
timeline = conRelleno;
cerrar(timeline);

// ── COMPUERTA: `from` + duración no puede pasarse del clip (si no, último frame congelado) ──
const FP = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe';
const largo = {};
const durClip = (src) => {
  if (largo[src] == null) {
    try {
      largo[src] = Number(execFileSync(FP, ['-v', 'error', '-show_entries', 'format=duration',
        '-of', 'csv=p=0', 'public/' + src], {encoding: 'utf8'}).trim());
    } catch { largo[src] = 999; }
  }
  return largo[src];
};
let ajustados = 0;
for (const t of timeline) {
  if (t.bg.kind === 'img') continue;
  const total = durClip(t.bg.src);
  const from = t.bg.from || 0;
  if (from + t.dur > total - 0.15) {
    const nuevo = Math.max(0, +(total - t.dur - 0.15).toFixed(2));
    if (Math.abs(nuevo - from) > 0.05) { t.bg.from = nuevo; ajustados++; }
  }
}

// ── informe ──
const durs = timeline.map((t) => t.dur).sort((a, b) => a - b);
const pct = (p) => durs[Math.min(durs.length - 1, Math.floor(durs.length * p))];
const largos = durs.filter((d) => d >= 5).length;
const cortos = timeline.filter((t) => t.dur < 1.2);
const flojos = timeline.filter((t) => t.score != null && t.score < 0.8);

fs.mkdirSync('_v3', {recursive: true});
fs.writeFileSync('_v3/e7hdoc_timeline.json', JSON.stringify({
  totalS: TOTAL, totalFrames: Math.round(TOTAL * 30), beats: timeline,
}, null, 1));
fs.writeFileSync('src/VideoEdit/e7hdoc_timeline.gen.ts', [
  '// GENERADO por build_e7hdoc.mjs — no editar a mano',
  `export const TOTAL_FRAMES_E7HDOC = ${Math.round(TOTAL * 30)};`,
  'export type Beat = {bloque: string; at: string; s: number; e: number; dur: number; bg: any; ov: any[]};',
  `export const TIMELINE: Beat[] = ${JSON.stringify(timeline.map(({score, relleno, ...r}) => r), null, 1)};`,
  '',
].join('\n'));

console.log(`anclas resueltas : ${timeline.filter((t) => !t.relleno).length} / ${BLOQUES.reduce((a, b) => a + b.beats.length, 0)}`);
console.log(`planos partidos  : ${rellenados}  →  ${nuevos} planos de relleno`);
console.log(`TOTAL planos     : ${timeline.length}`);
console.log(`duración         : ${TOTAL.toFixed(1)}s  (${Math.round(TOTAL * 30)} frames)`);
console.log(`mediana plano    : ${pct(0.5).toFixed(2)}s   p75: ${pct(0.75).toFixed(2)}s   p90: ${pct(0.9).toFixed(2)}s`);
console.log(`planos >= 5s     : ${largos} (${(largos / durs.length * 100).toFixed(0)}%)`);
console.log(`\`from\` ajustados : ${ajustados}`);
if (cortos.length) console.log(`⚠ ${cortos.length} planos < 1,2s`);
if (flojos.length) { console.log(`\n⚠ ${flojos.length} anclas con match dudoso (<0,80):`); flojos.forEach((f) => console.log(`   ${f.score} ${f.bloque} :: ${f.at.slice(0, 46)}`)); }
if (noEncontradas.length) { console.log(`\n⛔ ${noEncontradas.length} SIN RESOLVER:`); noEncontradas.forEach((n) => console.log('  ', n)); }
console.log('\n_v3/e7hdoc_timeline.json + e7hdoc_timeline.gen.ts escritos');
