// build_valromero.mjs — Doctora Valeria Alcázar · "El Romero: 3 Remedios en Uno para Arrugas, Manchas y Canas"
// Plan (§0 DIRECTOR) en _v3/valromero_plan.mjs → cues anclados al ms (alineación GLOBAL guion↔ASR).
// Salidas: src/valromero/cues_valromero.gen.ts · _valromero_assets.txt · _v3/valromero_cues.json (agnes_qc)
//          D:/vrm/av/{windows.json, w###.wav} · D:/vrm/needs_{stock,img}.json
// Uso: node build_valromero.mjs [--plan]   (--plan = sin assets todavía: exporta ventanas/necesidades y no exige archivos)
import fs from 'fs';
import {execFileSync} from 'child_process';
import {SECCIONES} from './_v3/valromero_plan.mjs';

const PLAN_MODE = process.argv.includes('--plan');
const FPS = 30;
const FP = 'ffprobe', FF = 'ffmpeg';
const PUB = 'public';
const WAV = 'public/valromero/valromero.wav';
const WAV_S = +execFileSync(FP, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', WAV]).toString().trim();
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync(`${PUB}/${p}`);
let fails = 0;
const FAIL = (m) => { console.log('⛔', m); fails++; };
const W = 'D:/vrm'; fs.mkdirSync(`${W}/av`, {recursive: true});

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_valromero.txt', 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync('_v3/valromero_wordms.json', 'utf8'));
if (WMS.length !== G.length) FAIL(`wordms ${WMS.length} != guion ${G.length}`);
const find = (txt, from) => { const t = norm(txt).split(' '); for (let k = from; k <= G.length - t.length; k++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[k + j] !== t[j]) { ok = false; break; } if (ok) return k; } return -1; };
const M = [];
{
  let cur = 0, i = 0;
  for (const s of SECCIONES) for (const m of s.m) {
    i++;
    const at = find(m.d, cur);
    if (at < 0) { FAIL(`ancla no encontrada: ${m.d}`); continue; }
    cur = at + 1;
    M.push({...m, sec: s.id, id: `m${String(i).padStart(3, '0')}`, wi: at, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12)});
  }
}
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S + 0.4;
// frase interna → segundos desde el inicio del momento (busca DESDE la palabra del ancla)
const phraseAt = (m, txt, label) => { const k = find(txt, m.wi); if (k < 0 || WMS[k] - 0.1 > m.end + 30) { FAIL(`${m.id} ${label}: frase "${txt}" no encontrada`); return null; } return WMS[k]; };

// ── cues ──
const cues = [], SFX = [], NEEDS_STOCK = [], NEEDS_IMG = [];
const push = (c) => { if (c.dur > 0.05) cues.push(c); };
const words = (c) => [c.title, c.label, c.quote, c.sub, c.myth, c.truth, c.note, ...(c.items || []).map((x) => (typeof x === 'string' ? x : `${x.amt} ${x.what}`)), ...(c.flags || [])].filter(Boolean).join(' ').split(/\s+/).length;
const CAP = {chapter: 5, stat: 7, checklist: 10, beforeafter: 10, molecule: 10, hero: 7.5, quote: 8, step: 6.5, teaser: 6.5, dial: 6, drops: 6.5, error: 6.5, myth: 9, redflags: 14, recipe: 18, week: 30, timeline: 30, lamina: 40, qr: 16};
const IMGK = ['image', 'imageA', 'imageB'];
const SLOT = {image: 'iq', imageA: 'iqA', imageB: 'iqB'};
const img = (id, slot) => `valromero/img/${id}_${slot}.jpg`;
const AG_DUR = 4.03;
const QR = {qr: 'img/valromero/qr_valromero.png', cover: 'valromero/img/cover.jpg', pages: ['valromero/img/pag1.jpg', 'valromero/img/pag2.jpg', 'valromero/img/pag3.jpg'], url: 'recetario-doctora.vercel.app'};
const sfx = (t, src, vol = 0.35) => SFX.push({t, src, vol});
const SFX_IN = {chapter: 'sfx/sfx_trans2.mp3', recipe: 'sfx/gentle_papercard_pop_#2-1780923860389.mp3', dial: 'sfx/sfx_whoosh_soft.mp3', drops: 'sfx/sfx_whoosh_soft.mp3', error: 'sfx/sfx_whoosh_soft.mp3', myth: 'sfx/sfx_trans1.mp3', redflags: 'sfx/sfx_trans3.mp3', week: 'sfx/gentle_papercard_pop_#2-1780923860389.mp3', timeline: 'sfx/sfx_trans1.mp3', teaser: 'sfx/sfx_whoosh_soft.mp3', lamina: 'sfx/cam_zoom_out.mp3', qr: 'sfx/sfx_trans4.mp3', hero: 'sfx/sfx_whoosh_soft.mp3', stat: 'sfx/sfx_whoosh_soft.mp3', quote: 'sfx/sfx_paper_tick.mp3', checklist: 'sfx/sfx_paper_tick.mp3', beforeafter: 'sfx/sfx_trans1.mp3', molecule: 'sfx/sfx_whoosh_soft.mp3', step: 'sfx/sfx_paper_tick.mp3'};
let cursor = 0;
const windows = [];
const agList = [];
for (let i = 0; i < M.length; i++) {
  const m = M[i];
  const s = i === 0 ? 0 : cursor; // base contigua: arranca donde terminó lo anterior (resto de un componente recortado o que se pasó)
  const e = m.end;
  const span = e - s;
  if (span < 0.6) { if (cues.length) cues[cues.length - 1].dur += Math.max(0, span); cursor = e; continue; }
  if (m.t === 'A') {
    const last = windows[windows.length - 1];
    if (last && Math.abs(last.end - s) < 0.6) last.end = e; else windows.push({start: s, end: e});
    if (m.T) push({id: `talk_${m.id}`, kind: 'talk', start: m.start + 0.35, dur: Math.min(5.5, e - m.start - 0.6), ...m.T});
    cursor = e; continue;
  }
  if (m.t === 'V' || m.t === 'F') {
    const n = m.t === 'V' ? Math.max(1, Math.min(6, Math.round(span / 3.6))) : Math.max(1, Math.round(span / 3));
    const names = Array.from({length: n}, (_, k) => (m.t === 'V' ? `valromero/broll/${m.id}_${k}.mp4` : `valromero/img/${m.id}_${k}.jpg`));
    names.forEach((f, k) => { if (!has(f)) NEEDS_STOCK.push({id: `${m.id}_${k}`, kind: m.t === 'V' ? 'v' : 'p', q: m.q[k % m.q.length], dest: `${PUB}/${f}`}); });
    const files = PLAN_MODE ? names : names.filter(has);
    if (!files.length) { console.log(`  ⚠ sin stock ${m.id} (${m.q[0]}) → estira el vecino`); if (cues.length && cues[cues.length - 1].kind !== 'talk') cues[cues.length - 1].dur += span; else FAIL(`sin asset y sin vecino ${m.id}`); cursor = e; continue; }
    const d = span / files.length;
    files.forEach((f, k) => push({id: `${m.id}_${k}`, kind: m.t === 'V' ? 'clip' : 'foto', real: 1, src: f, start: s + d * k, dur: d}));
    cursor = e; continue;
  }
  if (m.t === 'G' || m.t === 'H') {
    const n = m.p.length;
    const d = span / n;
    m.p.forEach((p, k) => {
      const nombre = `vr_${m.id}_${k}`;
      const jpg = `valromero/img/${nombre}.jpg`, mp4 = `valromero/ag/${nombre}.mp4`, last = `valromero/ag/${nombre}_last.jpg`;
      NEEDS_IMG.push({name: nombre, pres: m.t === 'H', p, ctx: m.d});
      agList.push({nombre, pres: m.t === 'H', p});
      if (has(mp4) && has(last)) push({id: `${m.id}_${k}`, kind: 'ag', src: mp4, last, clipDur: AG_DUR, start: s + d * k, dur: d});
      else if (has(jpg) || PLAN_MODE) push({id: `${m.id}_${k}`, kind: 'foto', src: jpg, start: s + d * k, dur: d, _pending: !has(jpg)});
      else FAIL(`falta imagen ${jpg}`);
    });
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const c = {...m.c};
    const props = {...c};
    for (const k of IMGK) if (typeof c[k] === 'string' && c[k].startsWith('G:')) { const f = img(m.id, SLOT[k]); props[k] = f; NEEDS_IMG.push({name: `${m.id}_${SLOT[k]}`, pres: false, p: c[k].slice(2), ctx: m.d, direct: true}); }
    if (c.kind === 'qr') Object.assign(props, QR, {image: QR.cover});
    // tiempos por frase
    const rel = (txt, label) => { const t = phraseAt(m, txt, label); return t == null ? null : +(t - s).toFixed(2); };
    if (c.atw) { props.ats = c.atw.map((w, k) => rel(w, `atw[${k}]`)); delete props.atw; }
    if (c.flipW) { props.flipAt = rel(c.flipW, 'flipW'); delete props.flipW; }
    if (c.stampW) { props.stampAt = rel(c.stampW, 'stampW'); delete props.stampW; }
    if (c.hitW) { props.hitAt = rel(c.hitW, 'hitW'); delete props.hitW; }
    if (c.focus) props.focus = c.focus.map((f, k) => ({x: f.x, y: f.y, z: f.z, at: rel(f.w, `focus[${k}]`)}));
    const lastT = Math.max(0, ...(props.ats || []), props.flipAt || 0, props.stampAt || 0, props.hitAt || 0, ...((props.focus || []).map((f) => f.at)));
    const floor = 2.8 + 0.25 * Math.max(0, words(c) - 3) + (c.kind === 'chapter' ? 1.2 : 0);
    const cap = CAP[c.kind] || 8;
    const need = Math.max(floor, lastT + 2.2);
    const nx = M[i + 1];
    let dur = span;
    if (!(nx && nx.t === 'C')) { if (span > cap) dur = Math.max(cap, need); if (dur < need) dur = Math.min(need, span + 2.5); }
    for (const t of ['ats']) (props[t] || []).forEach((x, k) => { if (x == null || x < 0 || x > dur - 0.4) FAIL(`${m.id} ${c.kind} ${t}[${k}]=${x} fuera de 0..${dur.toFixed(2)}`); });
    for (const t of ['flipAt', 'stampAt', 'hitAt']) if (t in props && (props[t] == null || props[t] < 0 || props[t] > dur - 0.4)) FAIL(`${m.id} ${c.kind} ${t}=${props[t]} fuera de 0..${dur.toFixed(2)}`);
    (props.focus || []).forEach((f, k) => { if (f.at == null || f.at < 0 || f.at > dur - 1) FAIL(`${m.id} lamina focus[${k}]=${f.at} fuera`); });
    push({id: m.id, start: s, dur, ...props});
    if (SFX_IN[c.kind]) sfx(s, SFX_IN[c.kind], c.kind === 'lamina' ? 0.3 : 0.32);
    for (const t of (props.ats || [])) if (t != null) sfx(s + t, 'sfx/sfx_pop.mp3', 0.22);
    for (const t of ['flipAt', 'stampAt', 'hitAt']) if (props[t] != null) sfx(s + props[t], 'sfx/sfx_text_thud.mp3', 0.3);
    if (c.kind === 'dial') sfx(s + 1.6, 'sfx/sfx_chime.mp3', 0.25);
    cursor = s + dur;
    continue;
  }
  FAIL(`tipo desconocido ${m.t} en ${m.id}`);
}
// ventanas de avatar
windows.forEach((w, k) => { w.name = `w${String(k + 1).padStart(3, '0')}`; push({id: `av_${w.name}`, kind: 'avatar', src: `valromero/av/${w.name}.mp4`, start: w.start, dur: w.end - w.start}); });

// ── orden + alineación a cuadro (base contigua) ──
const base = cues.filter((c) => c.kind !== 'talk').sort((a, b) => a.start - b.start);
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); let f1 = nx ? F(nx.start) : F(WAV_S + 0.4);
  if (!nx && F(c.start + c.dur) > f1) f1 = F(c.start + c.dur);
  c.from = f0; c.frames_ = Math.max(1, f1 - f0);
  c.start = f0 / FPS; c.dur = c.frames_ / FPS;
  if (['clip', 'foto', 'ag'].includes(c.kind)) c.seed = f0;
}
for (const w of windows) { const c = base.find((b) => b.id === `av_${w.name}`); w.start = c.start; w.end = c.start + c.dur; }
const talks = cues.filter((c) => c.kind === 'talk').map((c) => ({...c, from: F(c.start), frames_: Math.max(1, F(c.dur))}));
// talk sólo encima de avatar: recortar al final de su ventana
for (const t of talks) { const w = base.find((b) => b.kind === 'avatar' && b.from <= t.from && t.from < b.from + b.frames_); if (!w) { console.log(`  ⚠ talk ${t.id} fuera de ventana (se descarta)`); t._drop = 1; continue; } t.frames_ = Math.min(t.frames_, w.from + w.frames_ - t.from - 6); if (t.frames_ < 45) t._drop = 1; }
const TOTAL_F = base[base.length - 1].from + base[base.length - 1].frames_;
const TOT = TOTAL_F / FPS;

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues base ${base.length} · talk ${talks.filter((t) => !t._drop).length} · ventanas avatar ${windows.length}`);
if (base[0].kind !== 'avatar' || base[0].dur < 3) FAIL(`apertura: primer cue ${base[0].kind} ${base[0].dur.toFixed(2)}s`);
{ let hue = 0; for (let i = 1; i < base.length; i++) if (base[i].from !== base[i - 1].from + base[i - 1].frames_) hue++; if (hue) FAIL(`${hue} discontinuidades en la base`); }
const sumK = (f) => base.filter(f).reduce((a, c) => a + c.dur, 0);
const av = sumK((c) => c.kind === 'avatar'), real = sumK((c) => c.real), comps = sumK((c) => !['avatar', 'clip', 'foto', 'ag'].includes(c.kind)), ia = sumK((c) => ['ag'].includes(c.kind) || (c.kind === 'foto' && !c.real));
console.log(`visible: avatar ${(100 * av / TOT).toFixed(1)}% · REAL ${(100 * real / TOT).toFixed(1)}% · componentes ${(100 * comps / TOT).toFixed(1)}% · IA ${(100 * ia / TOT).toFixed(1)}% · total ${TOT.toFixed(1)} s`);
if (av / TOT < 0.25 || av / TOT > 0.31) FAIL('avatar visible fuera de 25-31%');
if (real / TOT < 0.25) FAIL('metraje real < 25%');
const reelS = windows.reduce((a, w) => a + (w.end - w.start), 0);
console.log(`reel avatar ${reelS.toFixed(1)} s en ${windows.length} ventanas`); if (reelS > 590) FAIL('reel > 590 s');
{ const d = base.filter((c) => ['foto', 'ag'].includes(c.kind) && !c.real).map((c) => c.dur); const over = d.filter((x) => x > 4.5).length; console.log(`imágenes IA: ${d.length} planos · >4,5 s: ${over}`); }
{ const d = base.map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))];
  console.log(`pacing: ${d.length} planos · mediana ${q(0.5).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${d[d.length - 1].toFixed(1)}`); }
// componentes: tipos + props obligatorias (sin texto por defecto del kit)
{ const OB = {chapter: ['kicker', 'index', 'title', 'sub'], hero: ['kicker', 'title', 'image', 'sub'], stat: ['kicker', 'label', 'image', 'suffix'], quote: ['kicker', 'quote', 'author', 'role', 'image'], molecule: ['kicker', 'title', 'centerLabel', 'image', 'nodes'], step: ['title', 'image', 'sub'], beforeafter: ['kicker', 'title', 'labelA', 'labelB', 'imageA', 'imageB'], checklist: ['kicker', 'title', 'items'],
    recipe: ['kicker', 'title', 'items', 'ats', 'image'], dial: ['kicker', 'value', 'max', 'unit', 'label', 'image'], drops: ['kicker', 'title', 'count', 'image'], error: ['index', 'kicker', 'title', 'image', 'hitAt'], myth: ['kicker', 'myth', 'truth', 'flipAt', 'image'], redflags: ['kicker', 'title', 'flags', 'ats', 'stamp', 'stampAt', 'image'], week: ['kicker', 'title', 'rows', 'ats', 'image'], timeline: ['kicker', 'title', 'marks', 'ats', 'image'], teaser: ['kicker', 'title', 'note', 'image'], lamina: ['image', 'focus'], qr: ['kicker', 'title', 'sub', 'url', 'qr', 'cover', 'pages', 'tvLabel', 'phoneLabel', 'image']};
  const kinds = {}; let def = 0;
  for (const c of base) { if (!OB[c.kind]) continue; kinds[c.kind] = (kinds[c.kind] || 0) + 1; for (const k of OB[c.kind]) if (c[k] == null || (c[k] === '' && !['suffix', 'role'].includes(k))) { console.log(`   prop vacía ${c.id}.${k}`); def++; } }
  const nComp = Object.values(kinds).reduce((a, b) => a + b, 0);
  console.log(`componentes ${nComp} · tipos ${Object.keys(kinds).length} (+talk) · props vacías ${def}`, JSON.stringify(kinds));
  if (nComp < 40) FAIL('<40 componentes'); if (Object.keys(kinds).length < 15) FAIL('<15 tipos'); if (def) FAIL('props que caen al default');
  const lam = base.filter((c) => c.kind === 'lamina'); lam.forEach((l) => { console.log(`lámina ${l.dur.toFixed(1)} s`); if (l.dur < 25 || l.dur > 40.5) FAIL('lámina fuera de 25-40 s'); });
  const qr = base.filter((c) => c.kind === 'qr'); console.log(`CTAs QR: ${qr.map((q) => `${(q.start / 60).toFixed(1)}min ${q.dur.toFixed(1)}s`).join(' · ')}`); if (qr.length !== 3 || qr[0].start < 360 || qr.some((q) => q.dur < 4)) FAIL('CTAs QR: tienen que ser 3, ≥4 s, la primera después del min 6');
}
// assets
const assets = new Set(['valromero/valromero.m4a', ...SFX.map((x) => x.src)]);
for (const c of base) { for (const k of ['src', 'last', 'image', 'imageA', 'imageB', 'qr', 'cover']) if (c[k]) assets.add(c[k]); (c.pages || []).forEach((p) => assets.add(p)); }
{ let miss = 0; for (const a of assets) if (!has(a)) { if (!PLAN_MODE) console.log('   falta', a); miss++; } console.log(`assets: ${assets.size} · faltan ${miss}`); if (miss && !PLAN_MODE) FAIL('assets faltantes'); }
// cuadros de clips de stock (Loop) — medidos
if (!PLAN_MODE) for (const c of base.filter((b) => b.kind === 'clip')) {
  c.frames = +execFileSync(FP, ['-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', `${PUB}/${c.src}`]).toString().trim().replace(/\D.*$/, '');
  if (!(c.frames > 1)) FAIL(`clip sin cuadros ${c.src}`);
  if (c.frames_ > c.frames) FAIL(`stock ${c.id} plano ${c.dur.toFixed(1)}s > clip ${(c.frames / 30).toFixed(1)}s (se repetiría)`);
}
{ const u = {}; for (const c of base) if (['clip', 'ag', 'foto'].includes(c.kind)) u[c.src] = (u[c.src] || 0) + 1; const rep = Object.entries(u).filter(([, v]) => v > 1); if (rep.length) FAIL(`repetidos: ${rep.map(([k]) => k).join(', ')}`); }

// ── salidas ──
fs.writeFileSync(`${W}/needs_stock.json`, JSON.stringify(NEEDS_STOCK, null, 1));
fs.writeFileSync(`${W}/needs_img.json`, JSON.stringify(NEEDS_IMG, null, 1));
fs.writeFileSync(`${W}/ag_list.json`, JSON.stringify(agList, null, 1));
fs.mkdirSync('src/valromero', {recursive: true});
const clean = (c) => { const {_pending, frames_, from, ...r} = c; return {...r, from, dur: frames_}; };
const out = {BASE: base.map(clean), TALK: talks.filter((t) => !t._drop).map(clean), SFX: SFX.map((x) => ({from: F(x.t), src: x.src, vol: x.vol}))};
fs.writeFileSync('src/valromero/cues_valromero.gen.ts', `// GENERADO por build_valromero.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_VR = ${TOTAL_F};\nexport const BASE: any[] = ${JSON.stringify(out.BASE)};\nexport const TALK: any[] = ${JSON.stringify(out.TALK)};\nexport const SFX: any[] = ${JSON.stringify(out.SFX)};\n`);
fs.writeFileSync('_v3/valromero_cues.json', JSON.stringify(base.filter((c) => c.kind === 'ag').map((c) => ({key: c.id, src: c.src, dur: Math.min(c.dur, c.clipDur)})), null, 1));
fs.writeFileSync('_valromero_assets.txt', [...assets].join('\n') + '\n');
fs.writeFileSync(`${W}/av/windows.json`, JSON.stringify(windows, null, 1));
console.log(`TOTAL ${TOTAL_F} cuadros (${TOT.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · fallas ${fails}${PLAN_MODE ? ' (modo plan)' : ''}`);
process.exitCode = fails ? 1 : 0;
