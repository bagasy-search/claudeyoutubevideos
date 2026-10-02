// build_valarroz.mjs — Doctora Valeria Alcázar · crema de arroz japonesa (valarroz) · montaje kit Federer (FedKit)
// Plan (§0 DIRECTOR) en _v3/valarroz_plan.mjs → cues anclados al ms (alineación GLOBAL guion↔ASR).
// Salidas: src/valarroz/cues_valarroz.gen.ts · _valarroz_assets.txt · _work/valarroz/av/{windows.json,w###.wav}
//          _work/valarroz/needs_{stock,gen}.json
// Uso: node _v3/build_valarroz.mjs [--plan]   (--plan = todavía faltan assets: no exige mp4/jpg)
import fs from 'fs';
import {execFileSync} from 'child_process';
import {SECCIONES} from './valarroz_plan.mjs';

const PLAN_MODE = process.argv.includes('--plan');
const FPS = 30;
const PUB = 'public';
const W = '_work/valarroz';
const WAV = 'public/valarroz.wav';
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const WAV_S = dur(WAV);
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync(`${PUB}/${p}`);
let fails = 0;
const FAIL = (m) => { console.log('⛔', m); fails++; };

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_valarroz.txt', 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync('_v3/valarroz_wordms.json', 'utf8'));
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
    const hitsS = [];
    let hc = at;
    for (const h of m.c?.hits || []) { const x = find(h, hc); if (x < 0) FAIL(`hit no encontrado ${m.d} → ${h}`); else { hitsS.push(WMS[x]); hc = x; } }
    M.push({...m, sec: s.id, id: `m${String(i).padStart(3, '0')}`, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12), hitsS});
    let xc = at;
    (m.x || []).forEach((x, j) => { const ax = find(x.at, xc + 1); if (ax < 0) { FAIL(`ancla x no encontrada: ${x.at}`); return; } xc = ax; M.push({d: x.at, t: x.t || 'V', q: x.q, p: x.p, T: x.T, sec: s.id, id: `m${String(i).padStart(3, '0')}x${j}`, start: Math.max(0, WMS[ax] - 0.12), hitsS: []}); });
  }
}
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S + 0.4;

const frameCache = (() => { try { return JSON.parse(fs.readFileSync(`${W}/clipframes.json`, 'utf8')); } catch { return {}; } })();
const clipFrames = (p) => {
  const key = `${p}:${fs.statSync(`${PUB}/${p}`).size}`;
  if (frameCache[key]) return frameCache[key];
  const n = +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', `${PUB}/${p}`]).toString().trim().replace(/\D.*$/, '');
  return (frameCache[key] = n);
};

const cues = [];
const NEEDS = [], NEEDS_GEN = [], NEEDS_G = [];
const push = (c) => { if (c.dur > 0.05) cues.push(c); };
const txt = (x) => (typeof x === 'string' ? x : x ? [x.t, x.q, x.title, x.sub, x.text, x.day, x.label, x.name, x.desc, x.verdict].filter(Boolean).join(' ') : '');
const words = (c) => [c.title, c.caption, c.quote, c.sub, c.statement, c.truth, c.note, c.name, c.detail, c.verdict && typeof c.verdict === 'string' ? c.verdict : '', ...['items', 'steps', 'ing', 'chips', 'questions', 'days', 'cards', 'methods', 'zones'].flatMap((k) => (c[k] || []).map(txt)), txt(c.left), txt(c.right)].filter(Boolean).join(' ').split(/\s+/).length;
const CAP = {chapter: 4.5, stat: 6, redflags: 11.5, cross: 8.5, checklist: 11.5, steps: 14, myth: 9.5, split: 11, chips: 11, quote: 8, story: 7, questions: 10, loop: 8, timeline: 17, board: 15, trio: 10, recipe: 24, zones: 13, lamina: 40, qrcta: 13};
const MIN = {qrcta: 5, lamina: 25};
const ACC = {};
let cursor = 0;
const windows = [];
const addWin = (s, e) => { const last = windows[windows.length - 1]; if (last && Math.abs(last.end - s) < 0.6) last.end = e; else windows.push({start: s, end: e}); };
const genImg = (m) => `img/valarroz/vn_${m.id}.jpg`;
const genClip = (m) => `broll/valarroz/vn_${m.id}.mp4`;
for (let i = 0; i < M.length; i++) {
  const m = M[i];
  const s = Math.max(m.start, cursor);
  const e = m.end;
  const span = e - s;
  if (span < 0.6 && m.t !== 'A') { if (cues.length) cues[cues.length - 1].dur += Math.max(0, span); cursor = Math.max(cursor, e); continue; }
  if (m.t === 'A') {
    if (span < 0.6) { if (cues.length) cues[cues.length - 1].dur += Math.max(0, span); cursor = Math.max(cursor, e); console.log(`  ventana ${m.id} absorbida (${span.toFixed(2)} s)`); continue; }
    addWin(s, e);
    if (m.T) push({id: `talk_${m.id}`, kind: 'talk', start: s + 0.5, dur: Math.min(6.5, span - 0.9), ...m.T});
    cursor = e; continue;
  }
  if (m.t === 'V' || m.t === 'F') {
    const n = m.t === 'V' ? Math.max(1, Math.min(6, Math.ceil(span / 5))) : Math.max(1, Math.ceil(span / 3));
    const names = Array.from({length: n}, (_, k) => (m.t === 'V' ? `broll/valarroz_st/${m.id}_${k}.mp4` : `img/valarroz/st_${m.id}_${k}.jpg`));
    names.forEach((f, k) => { if (!has(f)) NEEDS.push({id: m.id, k, kind: m.t === 'V' ? 'v' : 'p', q: m.q[k % m.q.length], alt: m.q, texto: m.d, dest: `${PUB}/${f}`}); });
    const gslot = (k) => ({clip: `broll/valarroz/g_${m.id}_${k}.mp4`, img: `img/valarroz/g_${m.id}_${k}.jpg`});
    names.forEach((f, k) => { if (!has(f) && m.t === 'V') { const g = gslot(k); if (!has(g.img)) NEEDS_G.push({id: `${m.id}_${k}`, texto: m.d, q: m.q[k % m.q.length]}); } });
    const slots = names.map((f, k) => (has(f) ? {kind: m.t === 'V' ? 'clip' : 'foto', real: 1, src: f} : m.t === 'V' && has(`img/valarroz/stp_${m.id}_${k}.jpg`) ? {kind: 'foto', real: 1, src: `img/valarroz/stp_${m.id}_${k}.jpg`} : m.t === 'V' && has(gslot(k).img) ? {kind: 'gen', src: has(gslot(k).clip) ? gslot(k).clip : null, still: gslot(k).img} : null)).filter(Boolean);
    const files = slots;
    if (!files.length && PLAN_MODE) { const d = span / n; names.forEach((f, k) => push({id: `${m.id}_${k}`, kind: m.t === 'V' ? 'clip' : 'foto', real: 1, src: f, start: s + d * k, dur: d, _pending: 1})); cursor = e; continue; }
    if (!files.length) { const pv = cues[cues.length - 1]; if (pv && !['avatar', 'talk'].includes(pv.kind) && pv.dur + span <= (['clip', 'foto', 'gen'].includes(pv.kind) ? 7.5 : 16)) { pv.dur += span; console.log(`  ⚠ sin stock ${m.id} → estira ${pv.id} a ${pv.dur.toFixed(1)} s`); } else FAIL(`sin asset ${m.id} (${m.q[0]}) y sin vecino estirable`); cursor = e; continue; }
    const d = span / files.length;
    files.forEach((f, k) => push({id: `${m.id}_${k}`, ...f, start: s + d * k, dur: d}));
    cursor = e; continue;
  }
  if (m.t === 'H' || m.t === 'G') {
    if (!has(genImg(m))) NEEDS_GEN.push({id: m.id, kind: m.t, p: m.p});
    const clip = has(genClip(m)) ? genClip(m) : null;
    if (!has(genImg(m)) && !PLAN_MODE) FAIL(`falta imagen ${m.id}`);
    push({id: m.id, kind: 'gen', src: clip, still: genImg(m), start: s, dur: span, _pending: has(genImg(m)) ? 0 : 1});
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const {iq, iqA, iqB, hits, gp, gpA, gpB, ...c} = m.c;
    const im = (slot) => `img/valarroz/${m.id}_${slot}.jpg`;
    const props = {...c};
    for (const [slot, q] of [['iq', iq], ['iqA', iqA], ['iqB', iqB]]) if (q) { const key = slot === 'iq' ? 'image' : slot === 'iqA' ? 'imageA' : 'imageB'; props[key] = im(slot); if (!has(im(slot))) NEEDS.push({id: m.id, k: slot, kind: 'p', q, alt: [q], texto: m.d, dest: `${PUB}/${im(slot)}`}); }
    if (gp) { props.image = genImg(m); if (!has(genImg(m))) NEEDS_GEN.push({id: m.id, kind: 'G', p: gp}); }
    for (const [g, key, suf] of [[gpA, 'imageA', 'A'], [gpB, 'imageB', 'B']]) if (g) { const pth = `img/valarroz/vn_${m.id}_${suf}.jpg`; props[key] = pth; if (!has(pth)) NEEDS_GEN.push({id: `${m.id}_${suf}`, kind: 'G', p: g}); }
    if (c.kind === 'lamina') props.image = 'img/valarroz/lamina.jpg';
    if (c.kind === 'qrcta') { props.qr = 'img/valarroz/qr_valarroz.png'; props.url = 'recetario-doctora.vercel.app'; props.cover = 'img/valarroz/cover.jpg'; }
    if (props.accent) props.accent = ACC[props.accent] || props.accent;
    const lastHit = m.hitsS.length ? m.hitsS[m.hitsS.length - 1] - s : 0;
    const floor = Math.max(2.8 + 0.28 * Math.max(0, words(c) - 3) + (c.kind === 'chapter' ? 1.5 : 0), lastHit + 2.4, MIN[c.kind] || 0);
    const cap = Math.max(CAP[c.kind] || 8, MIN[c.kind] || 0);
    const tight = m.hitsS.length ? lastHit + 3.2 : Math.max(5.5, floor);
    let d = Math.min(Math.max(Math.min(span, tight), floor), cap);
    if (c.kind === 'lamina' || c.kind === 'qrcta') d = Math.min(span, cap);
    props.hitAt = m.hitsS.map((h) => +(h - s).toFixed(3));
    push({id: m.id, start: s, dur: d, ...props});
    const rest = e - (s + d);
    const bed = props.image || props.imageB || props.imageA;
    if (rest > 0.6) {
      if (bed && !['lamina', 'qrcta', 'board'].includes(c.kind)) {
        const bd = rest - 3.2 > 0.6 ? 3.2 : rest;
        push({id: `${m.id}_bed`, kind: 'foto', src: bed, start: s + d, dur: bd, real: /^img\/valarroz\/m\d+_iq/.test(bed) ? 1 : 0});
        if (rest - bd > 0.6) addWin(s + d + bd, e);
      }
      else addWin(s + d, e);
      cursor = e;
    } else cursor = s + d;
    continue;
  }
}
windows.forEach((w, k) => { w.name = `w${String(k + 1).padStart(3, '0')}`; push({id: `av_${w.name}`, kind: 'avatar', src: `avatar_clips/valarroz/${w.name}.mp4`, start: w.start, dur: w.end - w.start}); });

// ── orden + alineación a cuadro (base contigua) ──
const base = cues.filter((c) => c.kind !== 'talk').sort((a, b) => a.start - b.start);
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); let f1 = nx ? F(nx.start) : F(WAV_S + 0.4);
  if (!nx && F(c.start + c.dur) > f1) f1 = F(c.start + c.dur);
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS;
  if (['clip', 'foto', 'gen'].includes(c.kind)) c.seed = f0;
  if (c.kind === 'clip' && has(c.src)) c.frames = clipFrames(c.src);
  if (c.kind === 'gen' && c.src) { c.frames = clipFrames(c.src); const l = c.src.replace('broll/valarroz/', 'img/valarroz/').replace('.mp4', '_last.jpg'); if (has(l)) c.last = l; else FAIL(`falta último cuadro ${l}`); }
}
for (const w of windows) { const c = base.find((b) => b.id === `av_${w.name}`); w.start = c.start; w.end = c.start + c.dur; }
fs.mkdirSync(W, {recursive: true});
if (fs.existsSync(`${W}/av/windows_reel.json`)) { const RW = JSON.parse(fs.readFileSync(`${W}/av/windows_reel.json`, 'utf8'));
  let bad = 0;
  for (const c of base.filter((b) => b.kind === 'avatar')) {
    const rw = RW.find((r) => c.start >= r.start - 0.05 && c.start + c.dur <= r.end + 0.5);
    if (!rw) { console.log(`   avatar ${c.id} ${c.start.toFixed(2)}-${(c.start + c.dur).toFixed(2)} fuera de toda ventana generada`); bad++; continue; }
    c.src = `avatar_clips/valarroz/${rw.name}.mp4`; c.from = +Math.max(0, c.start - rw.start).toFixed(3);
  }
  console.log(`avatar: ${base.filter((b) => b.kind === 'avatar').length} planos dentro de ${RW.length} ventanas generadas · fuera ${bad}`); if (bad) FAIL('avatar fuera de las ventanas generadas'); } else if (!PLAN_MODE) FAIL('falta windows_reel.json (reel del avatar)');
fs.writeFileSync(`${W}/clipframes.json`, JSON.stringify(frameCache));
const talks = cues.filter((c) => c.kind === 'talk').map((c) => ({...c, start: F(c.start) / FPS, dur: F(c.dur) / FPS}));
const TOTAL_F = F(base[base.length - 1].start + base[base.length - 1].dur);
const TOT = TOTAL_F / FPS;

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues base ${base.length} · talk ${talks.length} · ventanas avatar ${windows.length}`);
if (base[0].kind !== 'avatar' || base[0].dur < 3) FAIL(`apertura: primer cue ${base[0].kind} ${base[0].dur.toFixed(2)}s`);
{ let hue = 0, n = 0, j = 0; for (let t = 0; t < TOT - 0.05; t += 0.2) { n++; while (j < base.length && base[j].start + base[j].dur <= t) j++; if (!(j < base.length && base[j].start <= t + 1e-6)) hue++; } console.log(`cobertura: ${n} instantes · huecos ${hue}`); if (hue) FAIL('huecos de cobertura'); }
{ const d = base.map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))];
  console.log(`pacing: ${d.length} planos · mediana ${q(0.5).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${d[d.length - 1].toFixed(1)}`); }
const sum = (f) => base.filter(f).reduce((a, c) => a + c.dur, 0);
const COMP = new Set(Object.keys(CAP));
const avS = sum((c) => c.kind === 'avatar'), realS = sum((c) => c.real), genS = sum((c) => c.kind === 'gen'), compS = sum((c) => COMP.has(c.kind));
console.log(`VISIBLE: avatar ${(100 * avS / TOT).toFixed(1)}% · real ${(100 * realS / TOT).toFixed(1)}% · IA ${(100 * genS / TOT).toFixed(1)}% · componentes ${(100 * compS / TOT).toFixed(1)}% · fotos bed no-real ${(100 * sum((c) => c.kind === 'foto' && !c.real) / TOT).toFixed(1)}%`);
if (avS / TOT < 0.25 || avS / TOT > 0.31) FAIL('avatar visible fuera de 25-30 %');
if (realS / TOT < 0.25) FAIL('metraje real < 25 %');
// planos quietos largos: foto > 3 s, gen sin clip > 3 s, stock > 7,5 s
{ const long = base.filter((c) => (c.kind === 'foto' && c.dur > 3.2) || (c.kind === 'gen' && !c.src && c.dur > 3.2) || (c.kind === 'clip' && c.dur > 7.5));
  console.log(`planos largos: ${long.length}`, long.slice(0, 8).map((c) => `${c.id}:${c.kind}:${c.dur.toFixed(1)}`).join(' ')); }
// hits dentro del componente
{ let bad = 0; for (const c of base) for (const h of c.hitAt || []) if (h < 0 || h > c.dur - 0.4) { console.log(`   hit fuera ${c.id} ${c.kind} ${h.toFixed(2)} / ${c.dur.toFixed(2)}`); bad++; } if (bad) FAIL(`${bad} hits fuera de su componente`); }
// componentes: variedad + props obligatorias
{ const OB = {chapter: ['kicker', 'index', 'title'], stat: ['kicker', 'value', 'caption'], redflags: ['kicker', 'title', 'items'], cross: ['kicker', 'title', 'items'], checklist: ['kicker', 'title', 'items'], steps: ['kicker', 'title', 'steps'],
    myth: ['kicker', 'statement', 'truth', 'verdict'], split: ['title', 'left', 'right', 'verdict'], chips: ['title', 'chips'], quote: ['quote', 'attrib', 'image'], story: ['name', 'age', 'image'], questions: ['kicker', 'title', 'questions'], loop: ['title', 'cards'],
    timeline: ['kicker', 'title', 'days'], board: ['title', 'cards', 'imageA', 'imageB'], trio: ['kicker', 'title', 'methods'], recipe: ['kicker', 'title', 'ing', 'steps'], zones: ['kicker', 'title', 'zones'], lamina: ['image'], qrcta: ['qr', 'url', 'title', 'kicker']};
  const kinds = {}; let def = 0;
  for (const c of base) { if (!OB[c.kind]) continue; kinds[c.kind] = (kinds[c.kind] || 0) + 1; for (const k of OB[c.kind]) if (c[k] == null || c[k] === '') { console.log(`   prop vacía ${c.id}.${k}`); def++; } }
  const nComp = Object.values(kinds).reduce((a, b) => a + b, 0);
  console.log(`componentes ${nComp} · tipos ${Object.keys(kinds).length}`, JSON.stringify(kinds));
  const minComp = Math.min(40, Math.round(2.5 * TOT / 60)); if (nComp < minComp || Object.keys(kinds).length < 15) FAIL(`<${minComp} componentes (2,5/min) o <15 tipos`); if (def) FAIL('props que caen al default');
  const lam = base.find((c) => c.kind === 'lamina'); console.log(`lámina: ${lam ? lam.dur.toFixed(1) : 0} s en ${lam ? (lam.start / 60).toFixed(2) : '-'} min`); if (!lam || lam.dur < 25 || lam.dur > 40) FAIL('lámina fuera de 25-40 s');
  base.filter((c) => c.kind === 'qrcta').forEach((c) => { console.log(`CTA ${c.id} @ ${(c.start / 60).toFixed(2)} min · ${c.dur.toFixed(1)} s`); if (c.dur < 5) FAIL('CTA < 5 s'); });
}
const assets = new Set(['med/valarroz.m4a', ...fs.readdirSync(`${PUB}/sfx`).map((f) => `sfx/${f}`)]);
for (const c of base) { for (const k of ['src', 'still', 'last', 'image', 'imageA', 'imageB', 'qr', 'cover']) if (c[k]) assets.add(c[k]); (c.pages || []).forEach((p) => assets.add(p)); }
{ let miss = 0; for (const a of assets) if (!has(a)) { if (!PLAN_MODE) console.log('   falta', a); miss++; } console.log(`assets: ${assets.size} · faltan ${miss}`); if (miss && !PLAN_MODE) FAIL('assets faltantes'); }
{ const bad = base.filter((c) => (c.kind === 'clip' || (c.kind === 'gen' && c.src)) && has(c.src) && !(c.frames > 1)); if (bad.length) FAIL(`${bad.length} clips sin cuadros medidos`); }

// ── salidas ──
fs.mkdirSync('src/valarroz', {recursive: true});
const out = [...base, ...talks].map(({_pending, real, ...c}) => c);
fs.writeFileSync('src/valarroz/cues_valarroz.gen.ts', `// GENERADO por _v3/build_valarroz.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_VV = ${TOTAL_F};\nexport const BEATS: any[] = ${JSON.stringify(out)};\n`);
fs.writeFileSync('_v3/valarroz_cues.json', JSON.stringify(base.filter((c) => c.src && /\.mp4$/.test(c.src) && c.kind !== 'avatar').map((c) => ({key: c.id, src: c.src, start: c.start, dur: c.kind === 'gen' ? Math.min(c.dur, c.frames / FPS) : c.dur}))));
fs.writeFileSync('_valarroz_assets.txt', [...assets].join('\n') + '\n');
fs.writeFileSync(`${W}/needs_stock.json`, JSON.stringify(NEEDS, null, 1));
fs.writeFileSync(`${W}/needs_gen.json`, JSON.stringify(NEEDS_GEN, null, 1));
fs.writeFileSync(`${W}/needs_g.json`, JSON.stringify(NEEDS_G, null, 1));
fs.mkdirSync(`${W}/av`, {recursive: true});
fs.writeFileSync(`${W}/av/windows.json`, JSON.stringify(windows, null, 1));
console.log(`needs: stock ${NEEDS.length} · gen ${NEEDS_GEN.length}`);
console.log(`TOTAL ${TOTAL_F} cuadros (${TOT.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · reel avatar ${avS.toFixed(1)} s · fallas ${fails}${PLAN_MODE ? ' (modo plan)' : ''}`);
process.exitCode = fails ? 1 : 0;
