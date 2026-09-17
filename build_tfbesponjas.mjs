// build_tfbesponjas.mjs — El Constructor Libre · esponjas (clon del motor valvasmix, adaptado al kit TALLER)
// Plan (§0 DIRECTOR) en _v3/tfbesponjas_plan*.mjs → cues anclados al ms (alineación GLOBAL guion↔ASR).
// Salidas: src/tfbesp/cues_tfbesponjas.gen.ts · _tfbesponjas_assets.txt · _work/tfbesponjas/{needs_*.json, av/windows.json, av/w###.wav}
// Uso: node build_tfbesponjas.mjs [--plan]   (--plan = todavía sin assets: exporta ventanas y needs, no exige archivos)
import fs from 'fs';
import {execFileSync} from 'child_process';
import {SECCIONES} from './_v3/tfbesponjas_plan.mjs';
import {SECCIONES_B} from './_v3/tfbesponjas_plan_b.mjs';
import {SECCIONES_C} from './_v3/tfbesponjas_plan_c.mjs';

const PLAN_MODE = process.argv.includes('--plan');
const FPS = 30;
const FF = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe';
const FP = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe';
const PUB = 'public', W = '_work/tfbesponjas';
const WAV = 'out/tfbesponjas/tfbesponjas.wav';
const WAV_S = +execFileSync(FP, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', WAV]).toString().trim();
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync(`${PUB}/${p}`);
let fails = 0;
const FAIL = (m) => { console.log('FALLA', m); fails++; };

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_tfbesponjas.txt', 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync('_v3/tfbesponjas_wordms.json', 'utf8'));
if (WMS.length !== G.length) FAIL(`wordms ${WMS.length} != guion ${G.length}`);
const find = (txt, from, lim = G.length) => { const t = norm(txt).split(' '); for (let k = from; k <= Math.min(lim, G.length - t.length); k++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[k + j] !== t[j]) { ok = false; break; } if (ok) return k; } return -1; };
const ALL = [...SECCIONES, ...SECCIONES_B, ...SECCIONES_C];
const M = [];
{ let cur = 0, i = 0;
  for (const s of ALL) for (const m of s.m) {
    i++;
    const at = find(m.d, cur);
    if (at < 0) { FAIL(`ancla no encontrada: ${m.d}`); continue; }
    if (at - cur > 260) console.log(`  aviso: salto de ${at - cur} palabras antes de "${m.d}"`);
    cur = at + 1;
    M.push({...m, sec: s.id, id: `m${String(i).padStart(3, '0')}`, w: at, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12)});
  } }
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S + 0.4;
// "@frase" → segundos absolutos (buscada desde la palabra del momento)
const atAbs = (m, v) => { if (typeof v !== 'string' || !v.startsWith('@')) return v; const k = find(v.slice(1), m.w, m.w + 400); if (k < 0) { FAIL(`@ no encontrada en ${m.id}: ${v}`); return null; } return WMS[k]; };

// ── needs ──
const N_STOCK = [], N_PHOTO = [], N_GPT = [], N_AGNES = [];
const imgp = (name) => `img/tfbesponjas/${name}.jpg`;
const needPhoto = (name, q) => { const p = imgp(name); if (!has(p)) N_PHOTO.push({kind: 'p', q, dest: `${PUB}/${p}`}); return p; };
const needGpt = (name, prompt, ref) => { const p = imgp(name); if (!has(p)) N_GPT.push({name, prompt, ...(ref ? {ref} : {})}); return p; };
const STYLE = ' Candid everyday photo taken with a phone, natural light, true-to-life colors, sharp focus across the whole scene, nothing blurred out, the background readable, realistic textures and natural hands, ordinary lived-in Latin American home, no text, no letters, no logos, no watermark.';
const PRES = 'The same man from the reference photo (same face): about 50 years old, curly black hair, grey-streaked beard, navy blue work coverall with grease stains. ';
const frameCache = (() => { try { return JSON.parse(fs.readFileSync(`${W}/clipframes.json`, 'utf8')); } catch { return {}; } })();
const clipFrames = (p) => { if (frameCache[p]) return frameCache[p]; let n; try { n = +execFileSync(FP, ['-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', `${PUB}/${p}`]).toString().trim().replace(/\D.*$/, ''); } catch { return 0; } return n > 1 ? (frameCache[p] = n) : 0; };

// ── cues ──
const cues = [], ovs = [], windows = [];
const push = (c) => { if (c.dur > 0.05) cues.push(c); };
let cursor = 0;
for (let i = 0; i < M.length; i++) {
  const m = M[i];
  const s = Math.max(m.start, cursor), e = m.end, span = e - s;
  if (span < 0.6 && m.t !== 'A') { if (cues.length) cues[cues.length - 1].dur += Math.max(0, span); cursor = Math.max(cursor, e); continue; }
  if (m.o) ovs.push({id: `ov_${m.id}`, ...m.o, start: s + 0.35, dur: Math.min(m.o.kind === 'senal' ? 3.6 : 4.2, span - 0.5)});
  if (m.t === 'A') {
    const last = windows[windows.length - 1];
    if (last && Math.abs(last.end - s) < 0.6) last.end = e; else windows.push({start: s, end: e});
    if (m.T) ovs.push({id: `talk_${m.id}`, kind: 'frase', start: s + 0.4, dur: Math.min(6.0, span - 0.7), ...m.T});
    cursor = e; continue;
  }
  if (m.t === 'V') {
    const n = Math.max(1, Math.min(5, Math.round(span / 4.2)));
    const names = Array.from({length: n}, (_, k) => `broll/tfbesponjas_st/${m.id}_${k}.mp4`);
    names.forEach((f, k) => { if (!has(f)) N_STOCK.push({kind: 'v', q: m.q[k % m.q.length], dest: `${PUB}/${f}`}); });
    const d = span / n;
    names.forEach((f, k) => push({id: `${m.id}_${k}`, kind: 'clip', src: f, start: s + d * k, dur: d, real: 1}));
    cursor = e; continue;
  }
  if (m.t === 'I' || m.t === 'P') {
    const prompts = m.t === 'P' ? [PRES + m.p + '.' + STYLE] : m.p.map((p) => p + '.' + STYLE);
    const n = prompts.length;
    if (span / n > 6.5) console.log(`  aviso: ${m.id} ${m.t} ${(span / n).toFixed(1)} s por imagen ("${m.d}")`);
    const d = span / n;
    prompts.forEach((p, k) => {
      const name = `${m.id}_${k}`;
      const img = needGpt(name, p, m.t === 'P' ? 'public/ref_tfbesponjas_face.png' : null);
      const clip = `broll/tfbesponjas/${name}.mp4`;
      N_AGNES.push({name, img, clip, dur: d});
      push(has(clip) ? {id: name, kind: 'clip', src: clip, still: clip.replace(/\.mp4$/, '_last.jpg'), start: s + d * k, dur: d} : {id: name, kind: 'foto', src: img, start: s + d * k, dur: d});
    });
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const c = {...m.c};
    const slot = (key) => { const q = c[key]; delete c[key]; if (!q) return undefined; const sfx = key.slice(2) || 'bed'; return key.startsWith('ip') ? needGpt(`${m.id}_${sfx}`, q + '.' + STYLE) : needPhoto(`${m.id}_${sfx}`, q); };
    const rel = (v) => { const a = atAbs(m, v); return a == null ? null : Math.max(0, Math.round((a - s) * FPS)); };
    const props = {kind: c.kind};
    switch (c.kind) {
      case 'sello': Object.assign(props, {line1: c.line1, line2: c.line2, bed: slot('iq')}); break;
      case 'capitulo': Object.assign(props, {n: c.n, kicker: c.kicker, title: c.title, bed: slot('iq')}); break;
      case 'zoom': Object.assign(props, {image: slot('ip'), x: c.x, y: c.y, label: c.label}); break;
      case 'maceta': Object.assign(props, {mode: c.mode, kicker: c.kicker, title: c.title, labels: c.labels, bed: slot('iq'), hitAt: c.hitAt ? rel(c.hitAt) : 30}); break;
      case 'split': Object.assign(props, {leftLabel: c.leftLabel, leftValue: c.leftValue, rightLabel: c.rightLabel, rightValue: c.rightValue, verdict: c.verdict, leftImage: slot(c.ipL ? 'ipL' : 'iqL'), rightImage: slot(c.ipR ? 'ipR' : 'iqR')}); break;
      case 'chips': Object.assign(props, {kicker: c.kicker, title: c.title, steps: c.steps.map((t) => ({title: t})), bed: slot('iq')}); break;
      case 'route': Object.assign(props, {kicker: c.kicker, title: c.title, steps: c.steps.map((t) => ({label: t})), bed: slot('iq')}); break;
      case 'quote': Object.assign(props, {quote: c.quote, attrib: c.attrib, bed: slot('iq')}); break;
      case 'checkcard': Object.assign(props, {kicker: c.kicker, title: c.title, items: c.items.map((t) => ({text: t})), bed: slot('iq')}); break;
      case 'checklist': Object.assign(props, {kicker: c.kicker, title: c.title, items: c.items.map((t) => ({text: t})), bed: slot('iq')}); break;
      case 'myth': Object.assign(props, {kicker: c.kicker, myth: c.myth, truth: c.truth, mythImg: slot(c.ipM ? 'ipM' : 'iqM'), truthImg: slot(c.ipT ? 'ipT' : 'iqT'), hitAt: rel(c.hitAt), truthAt: rel(c.truthAt)}); props.bed = props.truthImg; break;
      case 'flags': Object.assign(props, {kicker: c.kicker, img: slot('ip'), flags: c.flags.map((f) => ({text: f.text, at: rel(f.at)})), stamp: c.stamp, stampAt: rel(c.stampAt)}); props.bed = props.img; break;
      case 'swap': Object.assign(props, {mode: c.mode, kicker: c.kicker, title: c.title, chip: c.chip, chipAt: rel(c.chipAt), bed: slot('iq'), items: c.items.map((it, k) => ({label: it.label, newLabel: it.newLabel, img: needPhoto(`${m.id}_s${k}a`, it.iq), newImg: needPhoto(`${m.id}_s${k}b`, it.iqN), at: 6 + k * 8, flipAt: rel(it.flipAt)}))}); break;
      case 'selfcheck': Object.assign(props, {kicker: c.kicker, questions: c.questions.map((q, k) => ({text: q.text, tone: q.tone, at: rel(q.at), img: needPhoto(`${m.id}_q${k}`, q.iq)}))}); props.bed = props.questions[0].img; break;
      case 'spots': Object.assign(props, {kicker: c.kicker, title: c.title, spots: c.spots.map((t) => ({label: t})), bed: slot('iq')}); break;
      case 'bigstat': Object.assign(props, {value: c.value, unit: c.unit, caption: c.caption, tone: c.tone, bed: slot('iq')}); break;
      case 'regla': Object.assign(props, {kicker: c.kicker, title: c.title, rows: c.rows.map((r) => ({size: r.size, value: r.value, at: rel(r.at)})), bed: slot('iq')}); break;
      case 'errok': Object.assign(props, {kicker: c.kicker, malLabel: c.malLabel, bienLabel: c.bienLabel, malImg: slot('ipMal'), bienImg: slot('ipBien'), flipAt: rel(c.flipAt)}); break;
      case 'lamina': Object.assign(props, {src: c.src, points: c.points.map((p) => ({x: p.x, y: p.y, z: p.z, at: rel(p.at)}))}); break;
      case 'cta': Object.assign(props, {kicker: c.kicker, title: c.title, items: c.items, portada: 'img/tfbesponjas/portada-coleccion.jpg', peeks: ['img/tfbesponjas/peek1.jpg', 'img/tfbesponjas/peek3.jpg', 'img/tfbesponjas/peek5.jpg', 'img/tfbesponjas/peek7.jpg', 'img/tfbesponjas/manualconstructorlibre.png'], qr: 'img/tfbesponjas/qr_tfbesponjas.png', domain: 'constructorlibre.com', bed: 'img/tfbesponjas/peek2.jpg'}); break;
      default: FAIL(`kind desconocido ${c.kind} en ${m.id}`);
    }
    push({id: m.id, start: s, dur: span, ...props});
    cursor = e; continue;
  }
  FAIL(`tipo desconocido ${m.t} en ${m.id}`);
}
windows.forEach((w, k) => { w.name = `w${String(k + 1).padStart(3, '0')}`; push({id: `av_${w.name}`, kind: 'avatar', src: `avatar_clips/tfbesponjas/${w.name}.mp4`, start: w.start, dur: w.end - w.start}); });

// ── orden + alineación a cuadro (base contigua) ──
const base = cues.sort((a, b) => a.start - b.start);
const relKeys = ['hitAt', 'truthAt', 'stampAt', 'chipAt', 'flipAt'];
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); let f1 = nx ? F(nx.start) : F(WAV_S + 0.4);
  const shift = F(c.start) - Math.round(c.start * FPS);
  void shift;
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS;
  if (c.kind === 'clip' || c.kind === 'foto') c.seed = f0;
  if (c.kind === 'clip' && has(c.src)) c.frames = clipFrames(c.src);
}
for (const w of windows) { const c = base.find((b) => b.id === `av_${w.name}`); w.start = c.start; w.end = c.start + c.dur; }
fs.writeFileSync(`${W}/clipframes.json`, JSON.stringify(frameCache));
const overlays = ovs.filter((o) => o.dur > 1.2).map((o) => ({...o, start: F(o.start) / FPS, dur: F(o.dur) / FPS}));
const TOTAL_F = F(base[base.length - 1].start + base[base.length - 1].dur);
const TOTAL_S = TOTAL_F / FPS;

// ── SFX (mezclados bajo la voz) ──
const SFX = [];
const WHOOSH = ['sfx/cp_whoosh.wav', 'sfx/ksjsbwuil-whoosh3-481204.mp3', 'sfx/freesound_community-whoosh-blow-flutter-shortwav-14678.mp3'];
let wk = 0;
for (const c of base) {
  if (['clip', 'foto', 'avatar'].includes(c.kind)) continue;
  SFX.push({from: F(c.start), src: WHOOSH[wk++ % WHOOSH.length], vol: 0.22});
  if (c.kind === 'sello') SFX.push({from: F(c.start) + 12, src: 'sfx/impacto_hit.mp3', vol: 0.3});
  if (['zoom', 'errok'].includes(c.kind)) SFX.push({from: F(c.start) + (c.kind === 'zoom' ? 20 : 14), src: 'sfx/cam_zoom_punch.mp3', vol: 0.25});
}
for (const o of overlays) SFX.push({from: F(o.start), src: o.kind === 'etiqueta' ? 'sfx/layer_drop.mp3' : 'sfx/kicker_type.mp3', vol: 0.18});

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues base ${base.length} · overlays ${overlays.length} · ventanas avatar ${windows.length} · sfx ${SFX.length}`);
if (base[0].kind !== 'avatar' || base[0].dur < 2.5) FAIL(`apertura: primer cue ${base[0].kind} ${base[0].dur.toFixed(2)}s`);
{ let hue = 0, n = 0, j = 0; for (let t = 0; t < TOTAL_S - 0.05; t += 0.2) { n++; while (j < base.length && base[j].start + base[j].dur <= t) j++; if (!(j < base.length && base[j].start <= t)) hue++; } console.log(`cobertura: ${n} instantes · huecos ${hue}`); if (hue) FAIL('huecos de cobertura'); }
{ const d = base.map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))];
  console.log(`pacing: ${d.length} planos · mediana ${q(0.5).toFixed(2)} · p75 ${q(0.75).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · ≥5s ${(100 * d.filter((x) => x >= 5).length / d.length).toFixed(0)}% · max ${d[d.length - 1].toFixed(1)}`);
  const longImg = base.filter((c) => c.kind === 'foto' && c.dur > 6.5); if (longImg.length) console.log(`  fotos >6,5 s: ${longImg.map((c) => c.id + ':' + c.dur.toFixed(1)).join(' ')}`); }
const sum = (f) => base.filter(f).reduce((a, c) => a + c.dur, 0);
const pct = (x) => (100 * x / TOTAL_S).toFixed(1);
const AV = sum((c) => c.kind === 'avatar'), REAL = sum((c) => c.real), COMP = sum((c) => !['clip', 'foto', 'avatar'].includes(c.kind)), AI = sum((c) => ['clip', 'foto'].includes(c.kind) && !c.real);
console.log(`visible: avatar ${AV.toFixed(0)} s (${pct(AV)}%) · stock real ${REAL.toFixed(0)} s (${pct(REAL)}%) · componentes ${COMP.toFixed(0)} s (${pct(COMP)}%) · IA ${AI.toFixed(0)} s (${pct(AI)}%)`);
const reel = windows.reduce((a, w) => a + (w.end - w.start), 0); console.log(`reel avatar ${reel.toFixed(1)} s`); if (reel > 590) FAIL('reel > 590 s');
if (AV / TOTAL_S < 0.25 || AV / TOTAL_S > 0.31) FAIL(`avatar visible ${pct(AV)}% fuera de 25-30`);
if (REAL / TOTAL_S < 0.25) FAIL(`stock real ${pct(REAL)}% < 25`);
// componentes: cantidad, tipos, props obligatorias, tiempos dentro del componente, ≤12 palabras
{ const OB = {sello: ['line1', 'line2', 'bed'], capitulo: ['n', 'kicker', 'title', 'bed'], zoom: ['image', 'label'], maceta: ['mode', 'kicker', 'title', 'labels', 'bed'], split: ['leftLabel', 'leftValue', 'rightLabel', 'rightValue', 'verdict', 'leftImage', 'rightImage'], chips: ['kicker', 'title', 'steps', 'bed'], route: ['kicker', 'title', 'steps', 'bed'], quote: ['quote', 'attrib', 'bed'], checkcard: ['kicker', 'title', 'items', 'bed'], checklist: ['kicker', 'title', 'items', 'bed'], myth: ['kicker', 'myth', 'truth', 'mythImg', 'truthImg', 'hitAt', 'truthAt'], flags: ['kicker', 'img', 'flags', 'stamp', 'stampAt'], swap: ['kicker', 'title', 'items', 'chip', 'chipAt', 'bed'], selfcheck: ['kicker', 'questions'], spots: ['kicker', 'title', 'spots', 'bed'], bigstat: ['value', 'caption', 'bed'], regla: ['kicker', 'title', 'rows', 'bed'], errok: ['kicker', 'malLabel', 'bienLabel', 'malImg', 'bienImg', 'flipAt'], lamina: ['src', 'points'], cta: ['kicker', 'title', 'items', 'portada', 'qr', 'domain']};
  const kinds = {}; let def = 0, bad = 0;
  const words = (c) => ['kicker', 'title', 'label', 'line1', 'line2', 'myth', 'truth', 'quote', 'verdict', 'caption'].map((k) => c[k]).filter(Boolean).join(' ').split(/\s+/).length;
  for (const c of base) {
    if (!OB[c.kind]) continue;
    kinds[c.kind] = (kinds[c.kind] || 0) + 1;
    for (const k of OB[c.kind]) if (c[k] == null || c[k] === '') { console.log(`   prop vacía ${c.id}.${k}`); def++; }
    const df = F(c.dur);
    const times = [...relKeys.map((k) => c[k]), ...(c.flags || []).map((f) => f.at), ...(c.questions || []).map((q) => q.at), ...(c.rows || []).map((r) => r.at), ...(c.items || []).map((it) => it && it.flipAt), ...(c.points || []).map((p) => p.at)].filter((x) => typeof x === 'number');
    for (const t of times) if (t < 0 || t > df - 10) { console.log(`   tiempo fuera ${c.id} (${c.kind}): ${t} de ${df}`); bad++; }
    if (words(c) > 12 && !['lamina', 'cta'].includes(c.kind)) console.log(`   aviso >12 palabras ${c.id} (${words(c)})`);
    if (c.dur > 16 && !['lamina', 'cta', 'regla'].includes(c.kind)) console.log(`   aviso componente largo ${c.id} ${c.kind} ${c.dur.toFixed(1)} s`);
  }
  const nComp = Object.values(kinds).reduce((a, b) => a + b, 0);
  const oKinds = {}; for (const o of overlays) oKinds[o.kind] = (oKinds[o.kind] || 0) + 1;
  console.log(`componentes ${nComp} base + ${overlays.length} overlays · tipos ${Object.keys(kinds).length + Object.keys(oKinds).length}`, JSON.stringify(kinds), JSON.stringify(oKinds), `· props vacías ${def} · tiempos fuera ${bad}`);
  if (nComp + overlays.length < 40) FAIL('<40 componentes'); if (Object.keys(kinds).length + Object.keys(oKinds).length < 15) FAIL('<15 tipos');
  if (def && !PLAN_MODE) FAIL('props vacías'); if (bad) FAIL('tiempos fuera del componente');
  const lam = base.find((c) => c.kind === 'lamina'); if (lam) { console.log(`lámina ${lam.dur.toFixed(1)} s en ${(lam.start / 60).toFixed(2)} min`); if (lam.dur < 25 || lam.dur > 40) FAIL('lámina fuera de 25-40 s'); }
  const ctas = base.filter((c) => c.kind === 'cta'); console.log(`CTAs ${ctas.length}: ${ctas.map((c) => `${(c.start / 60).toFixed(2)}min/${c.dur.toFixed(1)}s`).join(' · ')}`); if (ctas.some((c) => c.start < 360)) FAIL('CTA antes del min 6'); }
// assets
const assets = new Set(['tfbesponjas.m4a', ...SFX.map((s) => s.src)]);
const addA = (v) => { if (typeof v === 'string' && /\.(jpg|png|mp4)$/.test(v)) assets.add(v); };
for (const c of [...base, ...overlays]) for (const [k, v] of Object.entries(c)) { if (typeof v === 'string') addA(v); else if (Array.isArray(v)) v.forEach((x) => (typeof x === 'string' ? addA(x) : x && typeof x === 'object' && Object.values(x).forEach(addA))); }
{ let miss = 0; for (const a of assets) if (!has(a)) { if (!PLAN_MODE) console.log('   falta', a); miss++; } console.log(`assets: ${assets.size} · faltan ${miss}`); if (miss && !PLAN_MODE) FAIL('assets faltantes'); }
{ const bad = base.filter((c) => c.kind === 'clip' && has(c.src) && !(c.frames > 1)); if (bad.length) FAIL(`${bad.length} clips sin cuadros`);
  const short = base.filter((c) => c.kind === 'clip' && c.frames && c.frames < F(c.dur) && !c.real); if (short.length) console.log(`  clips agnes más cortos que su plano (se congela el último cuadro con KB): ${short.length}`); }

// ── salidas ──
fs.mkdirSync(`${W}/av`, {recursive: true});
fs.writeFileSync(`${W}/needs_stock.json`, JSON.stringify(N_STOCK, null, 1));
fs.writeFileSync(`${W}/needs_photo.json`, JSON.stringify(N_PHOTO, null, 1));
fs.writeFileSync(`${W}/needs_gpt.json`, JSON.stringify(N_GPT, null, 1));
fs.writeFileSync(`${W}/needs_agnes.json`, JSON.stringify(N_AGNES, null, 1));
console.log(`needs: stock ${N_STOCK.length} · fotos ${N_PHOTO.length} · gpt ${N_GPT.length} (${N_GPT.filter((x) => x.ref).length} con ref) · agnes ${N_AGNES.length}`);
fs.mkdirSync('src/tfbesp', {recursive: true});
fs.writeFileSync('src/tfbesp/cues_tfbesponjas.gen.ts', `// GENERADO por build_tfbesponjas.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_TFBESP = ${TOTAL_F};\nexport const BEATS: any[] = ${JSON.stringify(base)};\nexport const OVERLAYS: any[] = ${JSON.stringify(overlays)};\nexport const SFX: {from: number; src: string; vol: number}[] = ${JSON.stringify(SFX)};\n`);
fs.writeFileSync('_v3/tfbesponjas_cues.json', JSON.stringify(base.filter((c) => c.kind === 'clip' && !c.real).map((c) => ({key: c.id, src: c.src, start: c.start, dur: c.frames ? Math.min(c.dur, (c.frames - 1) / FPS) : c.dur}))));
for (const c of base) if (c.kind === 'clip' && c.still && !has(c.still) && has(c.src)) execFileSync(FF, ['-v', 'error', '-y', '-sseof', '-0.1', '-i', `${PUB}/${c.src}`, '-frames:v', '1', '-q:v', '2', `${PUB}/${c.still}`]);
fs.writeFileSync('_tfbesponjas_assets.txt', [...assets].sort().join('\n') + '\n');
fs.writeFileSync(`${W}/av/windows.json`, JSON.stringify(windows, null, 1));
if (process.argv.includes('--wavs')) for (const w of windows) execFileSync(FF, ['-v', 'error', '-y', '-ss', w.start.toFixed(3), '-to', w.end.toFixed(3), '-i', WAV, '-ar', '16000', '-ac', '1', `${W}/av/${w.name}.wav`]);
console.log(`TOTAL ${TOTAL_F} cuadros (${TOTAL_S.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · fallas ${fails}${PLAN_MODE ? ' (modo plan)' : ''}`);
process.exitCode = fails ? 1 : 0;
