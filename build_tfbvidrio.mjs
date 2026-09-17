// build_tfbvidrio.mjs — El Constructor Libre · "Ventana de Vidrio Doble Empañada: El Arreglo Que Nadie Te Cuenta"
// Clon del motor valvasmix: plan (§0 DIRECTOR) → cues anclados al ms (alineación GLOBAL guion↔ASR) → compuertas.
// Salidas: src/tfbvidrio/cues.gen.ts · _tfbvidrio_assets.txt · _work/tfbvidrio/av/{windows.json,reel.wav} · _work/tfbvidrio/needs.json
// Uso: node build_tfbvidrio.mjs [--plan]   (--plan = sin avatar/stock/agnes todavía: exporta ventanas y necesidades)
import fs from 'fs';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { SECCIONES } from './_v3/tfbvidrio_plan.mjs';
import { hname } from './_v3/tfbvidrio_imgs.mjs';

const PLAN_MODE = process.argv.includes('--plan');
const FPS = 30, PUB = 'public', AV = '_work/tfbvidrio/av';
const WAV = 'out/tfbvidrio/master_n.wav';
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const WAV_S = dur(WAV);
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync(`${PUB}/${p}`);
let fails = 0; const FAIL = (m) => { console.log('⛔', m); process.exitCode = 1; fails++; };

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_tfbvidrio.txt', 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync('_v3/tfbvidrio_wordms.json', 'utf8'));
if (WMS.length !== G.length) FAIL(`wordms ${WMS.length} != guion ${G.length}`);
const find = (txt, from) => { const t = norm(txt).split(' '); for (let k = from; k <= G.length - t.length; k++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[k + j] !== t[j]) { ok = false; break; } if (ok) return k; } return -1; };
const M = [];
{ let cur = 0, i = 0;
  for (const s of SECCIONES) for (const m of s.m) {
    i++; const at = find(m.d, cur);
    if (at < 0) { FAIL(`ancla no encontrada: ${m.d}`); continue; }
    cur = at + 1;
    M.push({ ...m, sec: s.id, id: `m${String(i).padStart(3, '0')}`, w: at, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12) });
  } }
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S + 0.5;

// ── cues ──
const cues = [], overlays = [], windows = [], NEEDS = { stock: [], agnes: [] };
const push = (c) => { if (c.dur > 0.05) cues.push(c); };
const clipFrames = (p) => +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', `${PUB}/${p}`]).toString().trim().replace(/\D.*$/, '');
const CAP = { lamina: 42, cta: 40, capitulo: 6, golpe: 4.5, pregunta: 9, alerta: 19, calzos: 19 };
const FLOOR = { golpe: 2.2, capitulo: 3.2, pregunta: 3.5, lamina: 25 };
let cursor = 0;
for (let i = 0; i < M.length; i++) {
  const m = M[i]; const s = Math.max(m.start, cursor); const e = m.end; const span = e - s;
  if (span < 0.6 && m.t !== 'A') {
    const last = cues[cues.length - 1];
    if (last) { last.dur += Math.max(0, span); if (last.kind === 'avatar') windows[windows.length - 1].end = e; }
    cursor = Math.max(cursor, e); continue;
  }
  if (m.t === 'A') {
    const last = windows[windows.length - 1];
    const lastCue = cues[cues.length - 1];
    if (last && s - last.end < 0.6 && lastCue?.kind === 'avatar') { last.end = e; lastCue.dur = e - lastCue.start; }
    else { windows.push({ start: s, end: e }); push({ id: `av_${m.id}`, kind: 'avatar', start: s, dur: e - s }); }
    if (m.T) overlays.push({ id: `talk_${m.id}`, kind: 'talk', start: s + 0.4, dur: Math.min(5.5, span - 0.7), ...m.T });
    cursor = e; continue;
  }
  if (m.t === 'V') {
    const n = Math.max(1, Math.min(6, Math.round(span / 3.6)));
    const sid = 'st_' + crypto.createHash('sha1').update(m.d).digest('hex').slice(0, 8);   // nombre estable (no depende del orden)
    const names = Array.from({ length: n }, (_, k) => `broll/tfbvidrio_st/${sid}_${k}.mp4`);
    names.forEach((f, k) => { if (!has(f)) NEEDS.stock.push({ id: `${sid}_${k}`, q: m.q[k % m.q.length], alt: m.q[(k + 1) % m.q.length], texto: m.d, dest: `${PUB}/${f}` }); });
    const files = names.filter(has);
    if (!files.length && m.p && fs.existsSync('_work/tfbvidrio/stock_done.flag')) { m.t = 'G'; i--; M[i + 1] = m; continue; }   // sin stock on-topic → foto IA ya generada
    if (!files.length && !m.p && fs.existsSync('_work/tfbvidrio/stock_done.flag') && i + 1 < M.length) {   // sin stock y sin foto: lo cubre un vecino (nunca estira una ventana de avatar)
      const last = cues[cues.length - 1];
      if (last && last.kind !== 'avatar') last.dur += span; else M[i + 1].start = s;
      console.log(`  ↪ ${m.id} sin stock (${m.d}) → vecino`); cursor = last && last.kind !== 'avatar' ? e : s; continue;
    }
    const use = files.length ? files : (PLAN_MODE ? names : []);
    if (!use.length) { FAIL(`sin stock ${m.id} (${m.q[0]})`); cursor = e; continue; }
    const d = span / use.length;
    use.forEach((f, k) => push({ id: `${m.id}_${k}`, kind: 'clip', src: f, start: s + d * k, dur: d, _pending: !has(f) }));
    if (m.o) overlays.push({ ...m.o, shape: m.o.kind, id: `mk_${m.id}`, kind: 'mark', start: s, dur: Math.min(d, 4) });
    cursor = e; continue;
  }
  if (m.t === 'G') {
    const d = span / m.p.length;
    m.p.forEach((p, k) => {
      const h = hname(p); const img = `img/tfbvidrio/g/${h}.jpg`; const clip = `broll/tfbvidrio/${h}.mp4`;
      if (!has(img)) FAIL(`falta imagen ${m.id} ${h}`);
      if (!has(clip)) NEEDS.agnes.push({ nombre: h, id: m.id, pres: !!m.pres, texto: m.d, p });
      push(has(clip) ? { id: `${m.id}_${k}`, kind: 'ag', src: clip, still: `img/tfbvidrio/g/${h}_last.jpg`, start: s + d * k, dur: d }
        : { id: `${m.id}_${k}`, kind: 'foto', src: img, start: s + d * k, dur: d, _pending: !PLAN_MODE ? 0 : 1 });
    });
    if (m.o) overlays.push({ ...m.o, shape: m.o.kind, id: `mk_${m.id}`, kind: 'mark', start: s, dur: Math.min(d, 4) });
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const { at, atS, img, items, ...c } = m.c;
    const props = { ...c };
    if (img) props.img = `img/tfbvidrio/g/${hname(img)}.jpg`;
    if (items) props.items = items.map((it) => (typeof it === 'string' ? it : { ...it, img: it.img ? `img/tfbvidrio/g/${hname(it.img)}.jpg` : undefined }));
    if (c.kind === 'lamina') props.img = 'img/tfbvidrio/lamina_vidrio.png';
    if (c.kind === 'cta' && c.variant === 1) props.lamina = 'img/tfbvidrio/lamina_vidrio.png';
    const cap = CAP[c.kind] ?? 16; const floor = FLOOR[c.kind] ?? 3;
    let dd = Math.min(Math.max(span, floor), cap);
    const h = {};
    for (const [k, ph] of Object.entries(at || {})) { const w = find(ph, m.w); h[k] = w < 0 ? -1 : +(WMS[w] - s).toFixed(3); }
    Object.assign(h, atS || {});
    push({ id: m.id, start: s, dur: dd, ...props, h, _span: span });
    const rest = e - (s + dd);
    if (rest > 0.6) FAIL(`${m.id} ${c.kind} queda corto: span ${span.toFixed(1)} s > cap ${cap}`);
    cursor = Math.max(e, s + dd); continue;
  }
}
// ── orden + alineación a cuadro (base contigua) ──
const base = cues.sort((a, b) => a.start - b.start);
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); const f1 = nx ? F(nx.start) : Math.max(F(WAV_S + 0.5), F(c.start + c.dur));
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS; c.seed = f0;
  if (c.kind === 'clip' && has(c.src)) c.frames = clipFrames(c.src);
  if (c.kind === 'ag') { c.frames = clipFrames(c.src); if (!has(c.still)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.1', '-i', `${PUB}/${c.src}`, '-frames:v', '1', '-q:v', '3', `${PUB}/${c.still}`]); }
}
// ventanas = cues de avatar ya alineados
windows.length = 0;
for (const c of base.filter((b) => b.kind === 'avatar')) windows.push({ name: `w${String(windows.length + 1).padStart(3, '0')}`, start: c.start, end: c.start + c.dur, cue: c });
for (const w of windows) { w.cue.src = `avatar_clips/tfbvidrio/${w.name}.mp4`; delete w.cue; }
const TOTAL_F = F(base[base.length - 1].start + base[base.length - 1].dur);
const TOT = TOTAL_F / FPS;
const ov = overlays.map((c) => ({ ...c, start: F(c.start) / FPS, dur: Math.max(1, F(c.dur)) / FPS }));

// ── SFX (mezclados bajo la voz) ──
const SFX = { golpe: ['sfx/cam_zoom_punch.mp3', 0.55], tachado: ['sfx/gentle_papercard_pop_#2-1780923860389.mp3', 0.4], capitulo: ['sfx/smooth_sliding_exten_#3-1780923878335.mp3', 0.45], trapo: ['sfx/px_wipe.mp3', 0.45], senales: ['sfx/layer_drop.mp3', 0.35], opciones: ['sfx/sfx_paper_tick.mp3', 0.45], cinta: ['sfx/soft_padded_stop_thu_#1-1780923893866.mp3', 0.4], corte: ['sfx/line_draw.mp3', 0.35], ciclo: ['sfx/warm_rising_tonal_sw_#3-1780924218410.mp3', 0.3], cifra: ['sfx/number_roll.mp3', 0.35], nota: ['sfx/marker_drive.mp3', 0.35], mito: ['sfx/sfx_text_thud.mp3', 0.45], ficha: ['sfx/gentle_papercard_pop_#2-1780923860389.mp3', 0.4], contras: ['sfx/sfx_text_thud.mp3', 0.35], lamina: ['sfx/deep-cinematic-zoom-3.mp3', 0.35], cta: ['sfx/warm_short_pleasant__#1-1780923958442.mp3', 0.4], muro: ['sfx/universfield-camera-shutter-199580.mp3', 0.4], paso: ['sfx/smooth_sliding_exten_#3-1780923878335.mp3', 0.4], medida: ['sfx/smooth_sliding_exten_#3-1780923878335.mp3', 0.35], duelo: ['sfx/sfx_trans2.mp3', 0.35], repaso: ['sfx/sfx_paper_tick.mp3', 0.4], secuencia: ['sfx/node_pop.mp3', 0.4], pregunta: ['sfx/keyboard_type.mp3', 0.35], alerta: ['sfx/stinger_hit.mp3', 0.35], calzos: ['sfx/soft_organic_wooden__#4-1780923840971.mp3', 0.4], talk: ['sfx/floraphonic-casual-click-pop-ui-2-262119.mp3', 0.3], mark: ['sfx/marker_drive.mp3', 0.35] };
const HIT = ['sfx/sfx_pop.mp3', 0.35];
const sfx = [];
for (const c of [...base, ...ov]) {
  const k = SFX[c.kind]; if (!k) continue;
  sfx.push({ src: k[0], at: c.start + (c.kind === 'talk' ? 0.1 : 0), vol: k[1] });
  for (const v of Object.values(c.h || {})) if (v > 0) sfx.push({ src: HIT[0], at: c.start + v, vol: HIT[1] });
}
let lastA = -9; const sfxF = sfx.sort((a, b) => a.at - b.at).filter((x) => { const ok = x.at - lastA > 0.35; if (ok) lastA = x.at; return ok; });

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues ${base.length} · overlays ${ov.length} · ventanas ${windows.length} · sfx ${sfxF.length}`);
if (base[0].kind !== 'avatar') FAIL(`apertura: primer cue ${base[0].kind}`);
{ let hue = 0, n = 0, j = 0; for (let t = 0; t < TOT - 0.05; t += 0.2) { n++; while (j < base.length && base[j].start + base[j].dur <= t) j++; if (!(j < base.length && base[j].start <= t)) hue++; } console.log(`cobertura: ${n} instantes · huecos ${hue}`); if (hue) FAIL('huecos'); }
{ const d = base.map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))]; console.log(`pacing: ${d.length} planos · mediana ${q(0.5).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${d[d.length - 1].toFixed(1)}`); }
const sum = (k) => base.filter((c) => k.includes(c.kind)).reduce((a, c) => a + c.dur, 0);
const COMPK = Object.keys(SFX).filter((k) => !['talk', 'mark'].includes(k));
console.log(`visible: avatar ${(100 * sum(['avatar']) / TOT).toFixed(1)}% · REAL stock ${(100 * sum(['clip']) / TOT).toFixed(1)}% · IA ${(100 * sum(['ag', 'foto']) / TOT).toFixed(1)}% · componentes ${(100 * sum(COMPK) / TOT).toFixed(1)}%`);
{ const planos = base.filter((c) => ['ag', 'foto'].includes(c.kind)); const largos = planos.filter((c) => c.dur > 4.6); console.log(`planos IA ${planos.length} · >4,6 s: ${largos.length} (${largos.slice(0, 6).map((c) => `${c.id}:${c.dur.toFixed(1)}`).join(' ')})`); }
{ const clips = base.filter((c) => c.kind === 'clip'); const l = clips.filter((c) => c.dur > 6); console.log(`planos stock ${clips.length} · >6 s: ${l.length}`); }
// componentes: variedad + props obligatorias + tiempos por frase DENTRO del componente
{ const OB = { golpe: ['words', 'img'], tachado: ['kicker', 'items', 'img'], capitulo: ['index', 'kicker', 'title', 'img'], trapo: ['focus'], senales: ['kicker', 'items'], opciones: ['focus'], cinta: ['kicker', 'items', 'img'], corte: ['focus'], ciclo: [], cifra: ['value', 'kicker', 'label', 'img'], nota: ['text'], mito: ['claim', 'truth', 'img'], ficha: ['kicker', 'name', 'place', 'lines', 'img'], contras: ['kicker', 'items', 'img'], lamina: ['img'], cta: ['variant', 'kicker', 'title'], muro: ['kicker', 'items'], paso: ['step', 'total', 'title', 'sub', 'img'], medida: ['focus'], duelo: ['kicker', 'left', 'right'], repaso: ['kicker', 'items'], secuencia: ['kicker', 'items'], pregunta: ['q'], alerta: ['kicker', 'items'], calzos: [] };
  const kinds = {}; let n = 0;
  for (const c of base) { if (!(c.kind in OB)) continue; n++; kinds[c.kind] = (kinds[c.kind] || 0) + 1;
    for (const k of OB[c.kind]) if (c[k] == null || c[k] === '') FAIL(`prop vacía ${c.id}.${k}`);
    for (const [k, v] of Object.entries(c.h || {})) if (!(v > 0.2 && v < c.dur - 0.3)) FAIL(`tiempo fuera del componente ${c.id}.${k}=${v} (dur ${c.dur.toFixed(2)})`);
    if (c.kind === 'lamina' && !(c.dur >= 25 && c.dur <= 40)) FAIL(`lámina ${c.dur.toFixed(1)} s fuera de 25-40`);
  }
  console.log(`componentes ${n} + overlays ${ov.length} · tipos ${Object.keys(kinds).length}`, JSON.stringify(kinds));
  if (n < 40 || Object.keys(kinds).length < 15) FAIL('<40 componentes o <15 tipos');
  const cta = base.filter((c) => c.kind === 'cta'); console.log('CTA en', cta.map((c) => `${(c.start / 60).toFixed(1)} min (${(100 * c.start / TOT).toFixed(0)}%) dur ${c.dur.toFixed(1)}`).join(' · '));
  if (cta.some((c) => c.start < 360)) FAIL('CTA antes del min 6');
  const lam = base.find((c) => c.kind === 'lamina'); if (lam) console.log(`lámina ${(lam.start / 60).toFixed(2)} min · ${lam.dur.toFixed(1)} s`);
}
// assets
const assets = new Set(['tfbvidrio/tfbvidrio.m4a', 'img/tfbvidrio/qr_tfbvidrio.png', 'img/tfbvidrio/portada-coleccion.jpg', 'img/tfbvidrio/manualconstructorlibre.png', ...Array.from({ length: 8 }, (_, i) => `img/tfbvidrio/peek${i + 1}.jpg`)]);
for (const c of base) { for (const k of ['src', 'img', 'still', 'lamina']) if (c[k]) assets.add(c[k]); (Array.isArray(c.items) ? c.items : []).forEach((it) => it?.img && assets.add(it.img)); }
for (const x of sfxF) assets.add(x.src);
{ let miss = 0; for (const a of assets) if (!has(a)) { if (!PLAN_MODE) console.log('   falta', a); miss++; } console.log(`assets ${assets.size} · faltan ${miss}`); if (miss && !PLAN_MODE) FAIL('assets faltantes'); }
if (!PLAN_MODE) { const bad = base.filter((c) => ['clip', 'ag'].includes(c.kind) && !(c.frames > 1)); if (bad.length) FAIL(`${bad.length} clips sin cuadros`); }

// ── salidas ──
fs.mkdirSync('src/tfbvidrio', { recursive: true }); fs.mkdirSync(AV, { recursive: true });
const out = base.map(({ _pending, _span, ...c }) => c);
fs.writeFileSync('src/tfbvidrio/cues.gen.ts', `// GENERADO por build_tfbvidrio.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_TFBVIDRIO = ${TOTAL_F};\nexport const BEATS: any[] = ${JSON.stringify(out)};\nexport const OVERLAYS: any[] = ${JSON.stringify(ov)};\nexport const SFX: any[] = ${JSON.stringify(sfxF)};\n`);
// agnes_qc: planos de clip (ag = corre su clip y el resto es su último cuadro con la misma curva Ken-Burns)
fs.writeFileSync('_v3/tfbvidrio_cues.json', JSON.stringify(out.filter((c) => ['ag', 'clip'].includes(c.kind)).map((c) => ({ key: c.id, src: c.src, dur: c.kind === 'ag' ? Math.min(c.dur, (c.frames || 0) / FPS) : c.dur }))));
fs.writeFileSync('_tfbvidrio_assets.txt', [...assets].join('\n') + '\n');
fs.writeFileSync('_work/tfbvidrio/needs.json', JSON.stringify(NEEDS, null, 1));
let off = 0; for (const w of windows) { w.off = +off.toFixed(3); off += w.end - w.start; }
fs.writeFileSync(`${AV}/windows.json`, JSON.stringify(windows, null, 1));
console.log(`avatar: ${windows.length} ventanas · reel ${off.toFixed(1)} s · needs stock ${NEEDS.stock.length} · agnes ${NEEDS.agnes.length}`);
console.log(`TOTAL ${TOTAL_F} cuadros (${TOT.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · fallas ${fails}${PLAN_MODE ? ' (modo plan)' : ''}`);
