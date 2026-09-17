// build_valvaselina15.mjs — Doctora Valeria Alcázar · "15 Trucos de Belleza con Vaselina"
// Plan (§0 DIRECTOR) en _v3/valvaselina15_plan.mjs → cues anclados al ms (alineación GLOBAL guion↔ASR).
// Salidas: src/vvs/cues_valvaselina15.gen.ts · _valvaselina15_assets.txt · _work/valvaselina15/av/{windows.json,reel.wav}
// Uso: node build_valvaselina15.mjs [--plan]   (--plan = sin assets todavía: exporta ventanas/necesidades y no exige archivos)
import fs from 'fs';
import {execFileSync} from 'child_process';
import crypto from 'crypto';
import {SECCIONES, CARDS, QA} from './_v3/valvaselina15_plan.mjs';

const PLAN_MODE = process.argv.includes('--plan');
const SLUG = 'valvaselina15', FPS = 30;
const PUB = 'public';
const IMG = `img/${SLUG}`, ST = `broll/${SLUG}_st`, AG = `broll/${SLUG}`, AV = `avatar_clips/${SLUG}`;
const WAV = `${PUB}/${SLUG}.wav`;
const WORK = `_work/${SLUG}`;
const probe = (f, e) => execFileSync('ffprobe', ['-v', 'error', ...e, '-of', 'csv=p=0', f]).toString().trim();
const WAV_S = +probe(WAV, ['-show_entries', 'format=duration']);
const F = (s) => Math.round(s * FPS);
const has = (p) => !!p && fs.existsSync(`${PUB}/${p}`);
let fails = 0;
const FAIL = (m) => { console.log('⛔', m); fails++; };
const NEEDS = [];

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync(`GUION_${SLUG}.txt`, 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, 'utf8'));
if (WMS.length !== G.length) FAIL(`wordms ${WMS.length} != guion ${G.length}`);
const find = (s, from) => { const t = norm(s).split(' '); for (let k = from; k <= G.length - t.length; k++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[k + j] !== t[j]) { ok = false; break; } if (ok) return k; } return -1; };
const M = [];
{
  let cur = 0, i = 0;
  for (const s of SECCIONES) for (const m of s.m) {
    i++;
    const at = find(m.d, cur);
    if (at < 0) { FAIL(`ancla no encontrada: ${m.d}`); continue; }
    cur = at + 1;
    M.push({...m, sec: s.id, id: 'k' + crypto.createHash('sha1').update(norm(m.d)).digest('hex').slice(0, 7), wi: at, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12)});
  }
}
{ const ids = new Set(); for (const m of M) { if (ids.has(m.id)) FAIL(`id repetido ${m.id} (${m.d})`); ids.add(m.id); } }
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S + 0.4;
// frase interna → segundos absolutos (desde el ancla del momento)
const phraseT = (m, p) => { const k = find(p, m.wi); return k < 0 ? null : Math.max(0, WMS[k] - 0.1); };

// ── cues ──
const cues = [];
const push = (c) => { if (c.dur > 0.05) cues.push(c); return c; };
const words = (c) => [c.title, c.label, c.quote, c.sub, c.myth, c.truth, ...(c.items || []).map((x) => (typeof x === 'string' ? x : x.label))].filter(Boolean).join(' ').split(/\s+/).length;
const CAP = {chapter: 5.5, stat: 5.5, checklist: 8, beforeafter: 7, molecule: 7, hero: 6, quote: 6.5, step: 5.5, carousel: 6, mythtruth: 10, redflags: 16, routineswap: 11, falltease: 7.5, selfcheck: 6, qr: 16, lamina: 40};
const img = (name) => `${IMG}/${name}.jpg`;
const need = (p, what) => { if (!has(p)) NEEDS.push({p, what}); return p; };
let cursor = 0;
const windows = [];
const lastBase = () => { for (let k = cues.length - 1; k >= 0; k--) if (cues[k].kind !== 'talk') return cues[k]; return null; };
const cardsResolved = CARDS.map((cd, k) => ({index: cd.index, name: cd.name, image: need(img(`card${k}`), 'card')}));
const swaps = {};
const qaGroup = {start: null, questions: QA.qa.questions.map((q, k) => ({text: q.text, img: need(img(`qa${k}`), 'qa'), at: 0}))};
const qaCues = [];
const laminaCues = [];

for (let i = 0; i < M.length; i++) {
  const m = M[i];
  const s = Math.max(m.start, cursor);
  const e = m.end;
  const span = e - s;
  if (span < 0.6 && m.t !== 'A') { const lb = lastBase(); if (lb) lb.dur += Math.max(0, span); cursor = Math.max(cursor, e); continue; }
  if (m.t === 'A' && span < 1.2 && lastBase() && lastBase().kind !== 'avatar') { lastBase().dur += span; cursor = e; continue; }
  if (m.t === 'A') {
    const last = windows[windows.length - 1];
    if (last && Math.abs(last.end - s) < 0.6) last.end = e; else windows.push({start: s, end: e});
    if (m.T) push({id: `talk_${m.id}`, kind: 'talk', start: s + 0.5, dur: Math.min(6.5, span - 0.9), ...m.T, accent: m.T.accent});
    cursor = e; continue;
  }
  if (m.t === 'V') {
    // planos de stock ≤7,5 s, sin partir un mismo clip en dos
    const n = Math.max(1, Math.min(m.q.length + 2, Math.ceil(span / 7.5)));
    const names = Array.from({length: n}, (_, k) => `${ST}/${m.id}_${k}.mp4`);
    const files = names.filter(has);
    names.forEach((f, k) => { if (!has(f)) NEEDS.push({p: f, what: 'stock', q: m.q[k % m.q.length], alt: m.q, d: m.d, dur: span / n}); });
    if (!files.length) {
      if (PLAN_MODE) { push({id: `${m.id}_0`, kind: 'clip', src: names[0], start: s, dur: span, real: 1, _pending: 1}); cursor = e; continue; }
      const lb = lastBase(); if (lb && lb.kind !== 'avatar') { console.log(`  ⚠ sin stock ${m.id} → estira el vecino`); lb.dur += span; } else FAIL(`sin stock y sin vecino ${m.id}`);
      cursor = e; continue;
    }
    const d = span / files.length;
    files.forEach((f, k) => push({id: `${m.id}_${k}`, kind: 'clip', src: f, start: s + d * k, dur: d, real: 1}));
    cursor = e; continue;
  }
  if (m.t === 'G' || m.t === 'H') {
    const a = need(img(m.id), m.t), b = img(`${m.id}b`);
    const clipA = `${AG}/${m.id}.mp4`, clipB = `${AG}/${m.id}b.mp4`;
    const part = (id, still, clip, st, du) => push(has(clip) ? {id, kind: 'clip', src: clip, start: st, dur: du, gen: 1} : {id, kind: 'foto', src: still, start: st, dur: du, gen: 1});
    if (span > 5.5 && (has(b) || PLAN_MODE)) { part(m.id, a, clipA, s, span * 0.5); part(`${m.id}b`, b, clipB, s + span * 0.5, span * 0.5); }
    else part(m.id, a, clipA, s, span);
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const {cardsRef, ip, ipA, ipB, ipMyth, ipTruth, ipL, ipR, ...c} = m.c;
    const props = {...c};
    if (ip) props.image = need(img(`${m.id}_ip`), 'comp');
    if (ipA) { props.imageA = need(img(`${m.id}_ipA`), 'comp'); props.imageB = need(img(`${m.id}_ipB`), 'comp'); }
    if (c.kind === 'carousel') props.cards = cardsResolved;
    if (c.kind === 'mythtruth') { props.mythImg = need(img(`${m.id}_ipMyth`), 'comp'); props.truthImg = need(img(`${m.id}_ipTruth`), 'comp'); }
    if (c.kind === 'falltease') { props.image = need(img(`${m.id}_ip`), 'comp'); props.sideL = need(img(`${m.id}_ipL`), 'comp'); props.sideR = need(img(`${m.id}_ipR`), 'comp'); }
    if (c.kind === 'qr') { props.pageImg = need(`${IMG}/${c.page}.jpg`, 'page'); props.qrImg = need(`${IMG}/qr_${SLUG}.png`, 'qr'); props.url = 'recetario-doctora.vercel.app'; }
    if (c.kind === 'lamina') { props.image = need(`${IMG}/lamina.jpg`, 'lamina'); }
    // tiempos internos por FRASE (segundos relativos al inicio del componente)
    const rel = (p, label) => { const t = phraseT(m, p); if (t == null) { FAIL(`${m.id} frase interna no encontrada: ${p}`); return 0; } return +(t - s).toFixed(3); };
    const marks = [];
    if (c.kind === 'mythtruth') { props.hitAtS = rel(c.hitAt); props.truthAtS = rel(c.truthAt); marks.push(props.hitAtS, props.truthAtS); delete props.hitAt; delete props.truthAt; }
    if (c.kind === 'falltease') { props.hitAtS = rel(c.hitAt); marks.push(props.hitAtS); delete props.hitAt; }
    if (c.kind === 'redflags') { props.flags = c.flags.map((f) => ({text: f.text, atS: rel(f.at)})); props.stampAtS = rel(c.stampAt); marks.push(...props.flags.map((f) => f.atS), props.stampAtS); delete props.stampAt; }
    if (c.kind === 'routineswap' && c.mode === 'old') {
      props.items = c.items.map((it, k) => ({label: it.label, img: need(img(`${m.id}_it${k}`), 'comp'), atS: rel(it.at), hitAtS: rel(it.hitAt), newLabel: it.newLabel, newImg: it.newIp ? need(img(`${m.id}_it${k}n`), 'comp') : undefined}));
      marks.push(...props.items.flatMap((it) => [it.atS, it.hitAtS]));
      swaps[m.d] = props.items;
    }
    if (c.kind === 'routineswap' && c.mode === 'new') {
      const src = swaps[c.flipRef]; if (!src) FAIL(`${m.id} flipRef sin origen`);
      props.items = (src || []).map((it, k) => ({label: it.label, img: it.img, newLabel: it.newLabel, newImg: it.newImg, flipAtS: rel(c.flips[k])}));
      props.chipAtS = rel(c.chipAt); marks.push(...props.items.map((it) => it.flipAtS), props.chipAtS);
      delete props.flipRef; delete props.flips; delete props.chipAt;
    }
    if (c.kind === 'selfcheck') { if (qaGroup.start == null) qaGroup.start = s; qaGroup.questions[c.q].atS = +(s - qaGroup.start + 0.25).toFixed(3); props.group = 'qa'; }
    const lastMark = marks.length ? Math.max(...marks) : 0;
    const floor = Math.max(2.8 + 0.28 * Math.max(0, words(c) - 3) + (c.kind === 'chapter' ? 1.5 : 0) + (c.kind === 'carousel' && c.intro ? 3 : 0) + (c.kind === 'qr' ? 3 : 0), lastMark + 2.2);
    const cap = Math.max((CAP[c.kind] || 8) + (c.kind === 'carousel' && c.intro ? 4 : 0), lastMark + 2.2);
    const dur = Math.min(Math.max(span, floor), cap);
    const cue = push({id: m.id, start: s, dur, ...props});
    if (c.kind === 'selfcheck') qaCues.push(cue);
    if (c.kind === 'lamina') laminaCues.push(cue);
    for (const mk of marks) if (!(mk >= 0 && mk <= dur - 0.5)) FAIL(`${m.id} (${c.kind}) tiempo interno ${mk}s fuera del componente (dur ${dur.toFixed(2)})`);
    const rest = e - (s + dur);
    const bed = props.image || props.imageB || props.truthImg;
    if (rest > 2 && m.aq) {
      const n = Math.max(1, Math.ceil(rest / 7.5));
      const names = Array.from({length: n}, (_, k) => `${ST}/${m.id}_a${k}.mp4`);
      names.forEach((f, k) => { if (!has(f)) NEEDS.push({p: f, what: 'stock', q: m.aq[k % m.aq.length], alt: m.aq, d: m.d, dur: rest / n}); });
      const files = PLAN_MODE ? names : names.filter(has);
      if (files.length) { const d = rest / files.length; files.forEach((f, k) => push({id: `${m.id}_a${k}`, kind: 'clip', src: f, start: s + dur + d * k, dur: d, real: 1})); cursor = e; continue; }
    }
    if (rest > 0.6) {
      if (bed && !['lamina', 'qr'].includes(c.kind)) push({id: `${m.id}_bed`, kind: 'foto', src: bed, start: s + dur, dur: rest});
      else cue.dur += rest;
      cursor = e;
    } else cursor = s + dur;
    continue;
  }
}
windows.forEach((w, k) => { w.name = `w${String(k + 1).padStart(3, '0')}`; push({id: `av_${w.name}`, kind: 'avatar', src: `${AV}/${w.name}.mp4`, start: w.start, dur: w.end - w.start}); });

// ── orden + alineación a cuadro (base contigua) ──
const base = cues.filter((c) => c.kind !== 'talk').sort((a, b) => a.start - b.start);
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); let f1 = nx ? F(nx.start) : F(WAV_S + 0.4);
  if (!nx && F(c.start + c.dur) > f1) f1 = F(c.start + c.dur);
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS;
  if (c.kind === 'clip' || c.kind === 'foto') c.seed = f0;
}
for (const w of windows) { const c = base.find((b) => b.id === `av_${w.name}`); w.start = c.start; w.end = c.start + c.dur; }
// cuadros internos (después de alinear)
for (const c of base) {
  const f = (x) => (x == null ? undefined : Math.round(x * FPS));
  if (c.hitAtS != null) c.hitAt = f(c.hitAtS);
  if (c.truthAtS != null) c.truthAt = f(c.truthAtS);
  if (c.stampAtS != null) c.stampAt = f(c.stampAtS);
  if (c.chipAtS != null) c.chipAt = f(c.chipAtS);
  if (c.flags) c.flags = c.flags.map((x) => ({text: x.text, at: f(x.atS)}));
  if (c.items && c.kind === 'routineswap') c.items = c.items.map(({atS, hitAtS, flipAtS, ...x}) => ({...x, at: f(atS), hitAt: f(hitAtS), flipAt: f(flipAtS)}));
  for (const k of ['hitAtS', 'truthAtS', 'stampAtS', 'chipAtS']) delete c[k];
  if (c.kind === 'lamina') {
    const D = c.dur;
    c.stops = c.part === 0
      ? [{t: 0, x: 0.5, y: 0.5, z: 1}, {t: 1.8, x: 0.5, y: 0.5, z: 1}, {t: 3.6, x: 0.25, y: 0.42, z: 1.95}, {t: Math.max(4, D - 4.5), x: 0.25, y: 0.76, z: 1.95}, {t: D - 1.2, x: 0.5, y: 0.5, z: 1.08}]
      : [{t: 0, x: 0.5, y: 0.5, z: 1}, {t: 1.5, x: 0.5, y: 0.5, z: 1}, {t: 3.2, x: 0.32, y: 0.91, z: 2.1}, {t: Math.max(4, D - 3.5), x: 0.68, y: 0.94, z: 2.1}, {t: D - 0.8, x: 0.5, y: 0.5, z: 1.05}];
  }
  if (c.kind === 'selfcheck') { c.offset = Math.round((c.start - qaGroup.start) * FPS); c.questions = qaGroup.questions.map((q) => ({text: q.text, img: q.img, at: Math.round(q.atS * FPS)})); c.kicker = QA.qa.kicker; }
}
// clips: cuadros reales
const frameCache = (() => { try { return JSON.parse(fs.readFileSync(`${WORK}/clipframes.json`, 'utf8')); } catch { return {}; } })();
for (const c of base) if (c.kind === 'clip' && has(c.src)) {
  if (!frameCache[c.src]) frameCache[c.src] = +probe(`${PUB}/${c.src}`, ['-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets']).replace(/\D.*$/, '');
  c.frames = frameCache[c.src];
  if (c.frames < Math.round(c.dur * FPS)) {
    if (!c.gen) FAIL(`clip de stock más corto que su plano: ${c.id} (${c.frames} < ${Math.round(c.dur * FPS)})`);
    c.lastImg = c.src.replace(/\.mp4$/, '_last.jpg');
    if (!has(c.lastImg)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.1', '-i', `${PUB}/${c.src}`, '-frames:v', '1', '-vf', 'format=yuvj420p', '-q:v', '2', `${PUB}/${c.lastImg}`]);
  }
}
fs.mkdirSync(WORK, {recursive: true});
fs.writeFileSync(`${WORK}/clipframes.json`, JSON.stringify(frameCache));
const talks = cues.filter((c) => c.kind === 'talk').map((c) => ({...c, start: F(c.start) / FPS, dur: F(c.dur) / FPS}));
const TOTAL_F = F(base[base.length - 1].start + base[base.length - 1].dur);
const TOT = TOTAL_F / FPS;

// ── SFX (entradas de componente + golpes internos) ──
const SFX = [];
const sfx = (src, sec, vol) => SFX.push({src: `sfx/${src}`, from: Math.max(0, Math.round(sec * FPS)), vol});
for (const c of base) {
  const k = c.kind;
  if (['chapter', 'hero', 'molecule', 'quote', 'beforeafter', 'checklist', 'step', 'stat'].includes(k)) sfx('sfx_whoosh_soft.mp3', c.start, 0.35);
  if (k === 'stat') sfx('number_roll.mp3', c.start + 0.5, 0.25);
  if (k === 'carousel') sfx(c.intro ? 'smooth_airy_whoosh_m_#2-1780923688387.mp3' : 'gentle_papercard_pop_#2-1780923860389.mp3', c.start, 0.4);
  if (k === 'mythtruth') { sfx('sfx_whoosh_soft.mp3', c.start, 0.35); sfx('sfx_text_thud.mp3', c.start + c.hitAt / FPS, 0.45); sfx('sfx_chime.mp3', c.start + c.truthAt / FPS, 0.3); }
  if (k === 'redflags') { c.flags.forEach((f) => sfx('sfx_paper_tick.mp3', c.start + f.at / FPS, 0.45)); sfx('sfx_thump.mp3', c.start + c.stampAt / FPS, 0.45); }
  if (k === 'routineswap') c.items.forEach((it) => (c.mode === 'old' ? sfx('sfx_text_thud.mp3', c.start + it.hitAt / FPS, 0.35) : sfx('gentle_papercard_pop_#2-1780923860389.mp3', c.start + it.flipAt / FPS, 0.4)));
  if (k === 'falltease') sfx('sfx_thump.mp3', c.start + c.hitAt / FPS, 0.4);
  if (k === 'selfcheck' && c.offset === 0) sfx('smooth_airy_whoosh_m_#2-1780923688387.mp3', c.start, 0.35);
  if (k === 'qr' || k === 'lamina') sfx('sfx_chime.mp3', c.start, 0.3);
}

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues base ${base.length} · talk ${talks.length} · ventanas avatar ${windows.length} · sfx ${SFX.length}`);
if (base[0].kind !== 'avatar' || base[0].dur < 3) FAIL(`apertura: primer cue ${base[0].kind} ${base[0].dur.toFixed(2)}s`);
{ let hue = 0, n = 0, j = 0; for (let t = 0; t < TOT - 0.05; t += 0.2) { n++; while (j < base.length && base[j].start + base[j].dur <= t) j++; if (!(j < base.length && base[j].start <= t)) hue++; } console.log(`cobertura: ${n} instantes · huecos ${hue}`); if (hue) FAIL('huecos de cobertura'); }
if (Math.abs(TOT - WAV_S) > 1) FAIL(`duración ${TOT.toFixed(2)} vs wav ${WAV_S.toFixed(2)}`);
const sum = (f) => base.filter(f).reduce((a, c) => a + c.dur, 0);
const avS = sum((c) => c.kind === 'avatar'), realS = sum((c) => c.real), genS = sum((c) => c.gen), compS = sum((c) => !['avatar', 'clip', 'foto'].includes(c.kind)), bedS = sum((c) => c.kind === 'foto' && !c.gen);
console.log(`VISIBLE: avatar ${(100 * avS / TOT).toFixed(1)}% (${avS.toFixed(0)} s) · real ${(100 * realS / TOT).toFixed(1)}% · generado ${(100 * genS / TOT).toFixed(1)}% · componentes ${(100 * compS / TOT).toFixed(1)}% · camas ${(100 * bedS / TOT).toFixed(1)}%`);
if (!PLAN_MODE) { if (avS / TOT < 0.25 || avS / TOT > 0.31) FAIL('avatar visible fuera de 25-30%'); if (realS / TOT < 0.25) FAIL('metraje real < 25%'); }
if (avS > 590) FAIL(`reel de avatar ${avS.toFixed(0)} s > 590`);
{ const d = base.map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))]; console.log(`pacing: ${d.length} planos · mediana ${q(0.5).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${d[d.length - 1].toFixed(1)}`);
  const longFoto = base.filter((c) => c.kind === 'foto' && c.dur > 6); if (longFoto.length) console.log(`  ⚠ fotos > 6 s: ${longFoto.map((c) => `${c.id}:${c.dur.toFixed(1)}`).join(' ')}`);
  const longAv = base.filter((c) => c.kind === 'avatar' && c.dur > 20); if (longAv.length) console.log(`  ⚠ avatar > 20 s: ${longAv.map((c) => `${c.id}:${c.dur.toFixed(1)}`).join(' ')}`); }
{ const OB = {chapter: ['kicker', 'index', 'title'], hero: ['kicker', 'title', 'image'], stat: ['kicker', 'label', 'image', 'suffix'], quote: ['kicker', 'quote', 'author', 'role', 'image'], molecule: ['kicker', 'title', 'centerLabel', 'image', 'nodes'], step: ['title', 'image', 'step', 'total'], beforeafter: ['kicker', 'title', 'labelA', 'labelB', 'imageA', 'imageB'], checklist: ['kicker', 'title', 'items'], carousel: ['cards', 'kicker'], mythtruth: ['kicker', 'myth', 'truth', 'mythImg', 'truthImg', 'hitAt', 'truthAt'], redflags: ['kicker', 'flags', 'image', 'stamp', 'stampAt'], routineswap: ['kicker', 'title', 'items', 'mode'], falltease: ['kicker', 'title', 'image', 'sideL', 'sideR', 'hitAt'], selfcheck: ['kicker', 'questions', 'offset'], qr: ['kicker', 'title', 'sub', 'pageImg', 'qrImg', 'url'], lamina: ['image', 'part']};
  const kinds = {}; let def = 0;
  for (const c of base) { if (!OB[c.kind]) continue; kinds[c.kind] = (kinds[c.kind] || 0) + 1; for (const k of OB[c.kind]) if (c[k] == null || (c[k] === '' && !['suffix', 'role'].includes(k))) { console.log(`   prop vacía ${c.id}.${k}`); def++; } }
  if (talks.length) kinds.talk = talks.length;
  const nComp = Object.entries(kinds).reduce((a, [, v]) => a + v, 0);
  console.log('componentes:', JSON.stringify(kinds), `· total ${nComp} · tipos ${Object.keys(kinds).length} · props vacías ${def}`);
  if (Object.keys(kinds).length < 15) FAIL('<15 tipos'); if (nComp < 40) FAIL('<40 componentes'); if (def) FAIL('props vacías');
  // lectura: ≤12 palabras en títulos
  for (const c of [...base, ...talks]) for (const k of ['title', 'label', 'quote', 'myth', 'truth']) if (c[k] && c[k].split(/\s+/).length > 12) FAIL(`${c.id}.${k} > 12 palabras`);
}
{ const lam = base.filter((c) => c.kind === 'lamina').reduce((a, c) => a + c.dur, 0); console.log(`lámina en pantalla: ${lam.toFixed(1)} s`); if (!PLAN_MODE && (lam < 25 || lam > 40)) FAIL('lámina fuera de 25-40 s'); }
{ const q = base.filter((c) => c.kind === 'qr'); console.log(`CTAs con QR: ${q.map((c) => `${(c.start / 60).toFixed(1)}min/${c.dur.toFixed(1)}s`).join(' ')}`); if (q.some((c) => c.start < 360)) FAIL('CTA antes del minuto 6'); if (q.some((c) => c.dur < 4)) FAIL('QR < 4 s'); }
const assets = new Set([`med/${SLUG}.m4a`]);
for (const c of base) { for (const k of ['src', 'lastImg', 'image', 'imageA', 'imageB', 'mythImg', 'truthImg', 'sideL', 'sideR', 'pageImg', 'qrImg']) if (c[k]) assets.add(c[k]); (c.cards || []).forEach((cd) => assets.add(cd.image)); (c.items || []).forEach((it) => { if (it.img) assets.add(it.img); if (it.newImg) assets.add(it.newImg); }); (c.questions || []).forEach((q) => assets.add(q.img)); }
for (const s of SFX) assets.add(s.src);
{ let miss = 0; for (const a of assets) if (!has(a)) { miss++; if (!PLAN_MODE) console.log('   falta', a); } console.log(`assets: ${assets.size} · faltan ${miss}`); if (miss && !PLAN_MODE) FAIL('assets faltantes'); }
{ const bad = base.filter((c) => c.kind === 'clip' && !(c.frames > 1)); if (bad.length && !PLAN_MODE) FAIL(`${bad.length} clips sin cuadros medidos`); }
{ const seen = new Map(); for (const c of base) if (['clip', 'foto'].includes(c.kind) && !c.id.endsWith('_bed')) { if (seen.has(c.src)) FAIL(`plano repetido ${c.src} (${seen.get(c.src)} y ${c.id})`); seen.set(c.src, c.id); } }

// ── salidas ──
fs.mkdirSync('src/vvs', {recursive: true});
const out = [...base, ...talks].map(({_pending, wi, ...c}) => c);
fs.writeFileSync('src/vvs/cues_valvaselina15.gen.ts', `// GENERADO por build_valvaselina15.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_VVS = ${TOTAL_F};\nexport const SFX: any[] = ${JSON.stringify(SFX)};\nexport const BEATS: any[] = ${JSON.stringify(out, null, 1)};\n`);
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(base.filter((c) => c.kind === 'clip').map((c) => ({key: c.id, src: c.src, dur: c.lastImg ? (c.frames - 1) / FPS : c.dur}))));
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].join('\n') + '\n');
fs.writeFileSync(`${WORK}/needs.json`, JSON.stringify(NEEDS, null, 1));
fs.mkdirSync(`${WORK}/av`, {recursive: true});
fs.writeFileSync(`${WORK}/av/windows.json`, JSON.stringify(windows, null, 1));
console.log(`needs: ${NEEDS.length} (${[...new Set(NEEDS.map((n) => n.what))].map((w) => `${w} ${NEEDS.filter((n) => n.what === w).length}`).join(' · ')})`);
console.log(`TOTAL ${TOTAL_F} cuadros (${TOT.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · fallas ${fails}${PLAN_MODE ? ' (modo plan)' : ''}`);
process.exitCode = fails ? 1 : 0;
