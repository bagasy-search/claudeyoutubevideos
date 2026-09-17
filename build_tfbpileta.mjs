// build_tfbpileta.mjs — El Constructor Libre · "NUNCA Destapes la Pileta con Bicarbonato y Vinagre — Usá Esto"
// Plan (§0 DIRECTOR) en _v3/tfbpileta_plan.mjs → cues anclados al ms (alineación GLOBAL guion↔ASR).
// Salidas: src/tfbpileta/cues_tfbpileta.gen.ts · _tfbpileta_assets.txt · _work/tfbpileta/{needs.json, av/windows.json, av/w###.wav}
// Uso: node build_tfbpileta.mjs [--plan]   (--plan = sin avatar/imagenes todavía: exporta necesidades y ventanas)
import fs from 'fs';
import {execFileSync} from 'child_process';
import {SECCIONES} from './_v3/tfbpileta_plan.mjs';

const PLAN = process.argv.includes('--plan');
const FPS = 30, PUB = 'public', W = '_work/tfbpileta';
const WAV = 'public/tfbpileta.wav';
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const WAV_S = dur(WAV);
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync(`${PUB}/${p}`);
let fails = 0;
const FAIL = (m) => { console.log('⛔', m); fails++; };
process.exitCode = 0;

// ── anclaje ──
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_tfbpileta.txt', 'utf8')).split(' ');
const WMS = JSON.parse(fs.readFileSync('_v3/tfbpileta_wordms.json', 'utf8'));
if (WMS.length !== G.length) FAIL(`wordms ${WMS.length} != guion ${G.length}`);
const find = (txt, from) => { const t = norm(txt).split(' '); for (let k = from; k <= G.length - t.length; k++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[k + j] !== t[j]) { ok = false; break; } if (ok) return k; } return -1; };
const M = [];
{
  let cur = 0, i = 0;
  for (const s of SECCIONES) for (const m of s.m) {
    i++;
    const at = find(m.d, cur);
    if (at < 0) { if (m.t !== 'X') FAIL(`ancla no encontrada: ${m.d}`); continue; }
    cur = at + 1;
    M.push({...m, sec: s.id, id: `m${String(i).padStart(3, '0')}`, w: at, start: M.length === 0 ? 0 : Math.max(0, WMS[at] - 0.12)});
  }
}
if (process.argv.includes('--dumpM')) fs.writeFileSync(`${W}/M.json`, JSON.stringify(M.map((m) => ({id: m.id, t: m.t, w: m.w, start: m.start}))));
for (let i = 0; i < M.length; i++) M[i].end = i + 1 < M.length ? M[i + 1].start : WAV_S;

// ── assets ──
const IMG = (n) => ['jpg', 'png'].map((e) => `img/tfbpileta/${n}.${e}`).find(has);
const frameCache = (() => { try { return JSON.parse(fs.readFileSync(`${W}/clipframes.json`, 'utf8')); } catch { return {}; } })();
const clipFrames = (p) => {
  if (frameCache[p]) return frameCache[p];
  const n = +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', `${PUB}/${p}`]).toString().trim().replace(/\D.*$/, '');
  return (frameCache[p] = n);
};
const NEEDS = {img: [], stock: []};   // img: {name, prompt, ref?, motion, person}  stock: {kind, q, dest, texto}
const PRES = 'The same man from the reference photo (same face): around 50 years old, black curly hair, salt-and-pepper grey beard, navy blue work coverall with a few grease stains. ';
const STYLE = ' Candid photo taken on a modern smartphone, natural light, true-to-life colors, sharp focus, deep depth of field with the whole scene in focus, nothing blurred out, realistic textures and skin, an ordinary lived-in Latin American middle-class home, no text, no letters, no labels, no logos, no watermark.';
const VARI = ['', ' Seen a few seconds later from a slightly different angle, a closer framing on the main action.', ' Seen a few seconds later from a wider angle that shows more of the surroundings.', ' Seen from a low side angle, the same moment continuing.', ' Seen from above at a three-quarter angle, the same moment continuing.', ' A detail shot of the same moment, very close on the hands and the object.'];

const cues = [], over = [], windows = [];
const push = (c) => { if (c.dur > 0.05) cues.push(c); };
const wordsOf = (c) => JSON.stringify(c).replace(/"[a-zA-Z]+P":"[^"]*"/g, '').replace(/"(kind|zone|side|tier|year|number)":"[^"]*"/g, '').match(/"[^"]{2,}"/g)?.filter((s) => /[a-záéíóúñ]/i.test(s) && !/^"[a-z]+"$/.test(s)).join(' ').split(/\s+/).length || 0;
const CAP = {chapter: 5.5, stat: 7, karaoke: 7, hook: 7.5, myth: 9, vs: 9, checklist: 10, steps: 10, flow: 9, cutaway: 9, beforeafter: 9, carousel: 11, tier: 9, duel: 9, bullets: 9, split: 8, quote: 8, cycle: 9, layers: 8, map: 6, timeline: 10, stamp: 4.5};
let lastBed = null;
const bedFor = () => lastBed || 'img/tfbpileta/lamina.jpg';

let cursor = 0;
for (let i = 0; i < M.length; i++) {
  const m = M[i];
  const s = Math.max(m.start, cursor), e = m.end, span = e - s;
  if (span < 0.6 && m.t !== 'A') { if (cues.length) cues[cues.length - 1].dur += Math.max(0, span); cursor = Math.max(cursor, e); continue; }
  if (m.t === 'A') {
    const last = windows[windows.length - 1];
    if (last && s - last.end < 0.6) { last.end = e; if (m.o) over.push({id: `ov_${m.id}`, kind: 'over', ok: m.o.k, start: s + 0.25, dur: Math.min(4.2, span - 0.4), ...m.o}); }
    else { windows.push({start: s, end: e, punch: m.punch ? 1 : 0, mid: m.id}); if (m.o) over.push({id: `ov_${m.id}`, kind: 'over', ok: m.o.k, start: s + 0.35, dur: Math.min(4.2, span - 0.5), ...m.o}); }
    cursor = e; continue;
  }
  if (m.t === 'V' || m.t === 'F') {
    const n = m.t === 'V' ? Math.max(1, Math.min(6, Math.round(span / 3.3))) : Math.max(1, Math.round(span / 3));
    const names = Array.from({length: n}, (_, k) => (m.t === 'V' ? `broll/tfbpileta_st/${m.id}_${k}.mp4` : `img/tfbpileta/st_${m.id}_${k}.jpg`));
    names.forEach((f, k) => { if (!has(f)) NEEDS.stock.push({id: `${m.id}_${k}`, kind: m.t === 'V' ? 'v' : 'p', qs: [m.q[k % m.q.length], ...m.q.filter((_, j) => j !== k % m.q.length)], dest: `${PUB}/${f}`, texto: `Frase que se escucha: "${m.d}…" · Qué tiene que verse: ${m.why || ''}`}); });
    const files = names.filter(has);
    if (!files.length && PLAN) { const d = span / n; names.forEach((f, k) => push({id: `${m.id}_${k}`, kind: 'clip', stock: 1, src: f, start: s + d * k, dur: d, _pending: 1})); cursor = e; continue; }
    if (!files.length) { FAIL(`sin stock ${m.id} (${m.q[0]})`); cursor = e; continue; }
    const d = Math.min(span / files.length, lastBed ? 5 : 99);
    files.forEach((f, k) => push({id: `${m.id}_${k}`, kind: m.t === 'V' ? 'clip' : 'foto', stock: 1, src: f, start: s + d * k, dur: d}));
    const resto = span - d * files.length;
    if (resto > 0.05) { const nr = Math.ceil(resto / 3.4); for (let k = 0; k < nr; k++) push({id: `${m.id}_f${k}`, kind: 'foto', src: lastBed, start: s + d * files.length + (resto / nr) * k, dur: resto / nr, _bedrest: 1}); }
    cursor = e; continue;
  }
  if (m.t === 'G' || m.t === 'H') {
    const n = Math.max(1, Math.min(VARI.length, Math.ceil(span / 3.6)));
    const d = span / n;
    for (let k = 0; k < n; k++) {
      const name = `${m.id}_${k}`;
      const img = IMG(name);
      if (!img) NEEDS.img.push({name, prompt: (m.t === 'H' ? PRES : '') + m.p + '.' + VARI[k] + STYLE, ref: m.t === 'H' ? 'public/ref_tfbpileta_face.png' : undefined, motion: m.mo, pres: m.t === 'H' ? 1 : 0, gente: m.gente ? 1 : 0});
      const clip = `broll/tfbpileta/${name}.mp4`;
      if (has(clip)) push({id: name, kind: 'clip', src: clip, start: s + d * k, dur: d});
      else if (img) push({id: name, kind: 'foto', src: img, start: s + d * k, dur: d});
      else if (PLAN) push({id: name, kind: 'foto', src: `img/tfbpileta/${name}.jpg`, start: s + d * k, dur: d, _pending: 1});
      else FAIL(`falta imagen ${name}`);
      if (img) lastBed = img;
    }
    cursor = e; continue;
  }
  if (m.t === 'C') {
    const {kind: ck, bedP, ...c} = m.c;
    // imágenes: toda clave "xxxP" → img/tfbpileta/<id>_<ruta>.jpg
    const walk = (o, path) => {
      if (Array.isArray(o)) return o.map((v, j) => walk(v, `${path}${j}`));
      if (o && typeof o === 'object') {
        const r = {};
        for (const [k, v] of Object.entries(o)) {
          if (k.endsWith('P') && typeof v === 'string') {
            const name = `${m.id}_${path}${k.slice(0, -1)}`;
            const img = IMG(name);
            if (!img) NEEDS.img.push({name, prompt: v + '.' + STYLE, still: 1});
            r[k.slice(0, -1)] = img || `img/tfbpileta/${name}.jpg`;
          } else r[k] = walk(v, `${path}${k}`);
        }
        return r;
      }
      return o;
    };
    const props = walk(c, '');
    let bed = bedFor();
    if (bedP) { const name = `${m.id}_bed`; const img = IMG(name); if (!img) NEEDS.img.push({name, prompt: bedP + '.' + STYLE, still: 1}); bed = img || `img/tfbpileta/${name}.jpg`; }
    const nw = wordsOf(c);
    const floor = 2.6 + 0.3 * Math.max(0, nw - 3) + (ck === 'chapter' ? 1 : 0);
    const cap = CAP[ck] || 8;
    const dd = Math.min(Math.max(span, floor), cap);
    push({id: m.id, kind: 'comp', ck, start: s, dur: dd, bed, _words: nw, _floor: floor, ...props});
    const rest = e - (s + dd);
    if (rest > 0.6) {
      // el resto se cubre con la cama en planos de ≤3,4 s
      const nr = Math.ceil(rest / 3.4);
      for (let k = 0; k < nr; k++) push({id: `${m.id}_r${k}`, kind: 'foto', src: bed, start: s + dd + (rest / nr) * k, dur: rest / nr, _bedrest: 1});
      cursor = e;
    } else cursor = s + dd;
    continue;
  }
  if (m.t === 'L') {
    const keys = m.keys.map((k) => { const at = find(k.at, m.w); if (at < 0) { FAIL(`lámina: ancla ${k.at}`); return null; } return {t: WMS[at] - 0.1, x: k.x, y: k.y, z: k.z, at: k.at}; }).filter(Boolean);
    push({id: m.id, kind: 'lamina', src: 'img/tfbpileta/lamina.jpg', start: s, dur: span, _keys: keys});

    cursor = e; continue;
  }
  if (m.t === 'Q') {
    const ap = find('apunta', m.w);
    const peeks = ['peek1', 'peek2', 'peek3', 'peek4', 'peek5', 'peek6', 'peek7', 'peek8'].map((p) => `img/tfbpileta/${p}.jpg`).concat(['img/tfbpileta/manualconstructorlibre.png']);
    const kick = {1: 'Mismo estilo que la guía completa', 2: 'Todo ordenado, con medidas', 3: 'La casa entera, resuelta'}[m.v];
    push({id: m.id, kind: 'cta', v: m.v, start: s, dur: span, cover: 'img/tfbpileta/portada-coleccion.jpg', peeks, qr: 'img/tfbpileta/qr_tfbpileta.png',
      bed: m.v === 1 ? 'img/tfbpileta/lamina.jpg' : 'img/tfbpileta/portada-coleccion.jpg', url: 'constructorlibre.com', kicker: kick,
      items: ['76 arreglos en 8 módulos', 'Guía Anti-Humedad, Moho y Goteras', 'El Taller de $50', 'Hoja de Compras y Fichas de Emergencia'], _apunta: ap >= 0 ? WMS[ap] : -1});
    cursor = e; continue;
  }
}
windows.forEach((w, k) => { w.name = process.env.OLDNAMES ? `w${String(k + 1).padStart(3, '0')}` : `w_${w.mid}`; push({id: `av_${w.name}`, kind: 'avatar', src: `avatar_clips/tfbpileta/${w.name}.mp4`, start: w.start, dur: w.end - w.start, punch: w.punch}); });

// ── orden + alineación a cuadro (base contigua) ──
const base = cues.sort((a, b) => a.start - b.start);
for (let i = 0; i < base.length; i++) {
  const c = base[i], nx = base[i + 1];
  const f0 = F(c.start); let f1 = nx ? F(nx.start) : F(WAV_S);
  if (!nx && F(c.start + c.dur) > f1) f1 = F(c.start + c.dur);
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS; c.seed = f0;
  if (c.kind === 'clip' && has(c.src)) c.frames = clipFrames(c.src);
  if (c.kind === 'lamina') c.keys = c._keys.map((k) => ({f: Math.max(0, F(k.t) - f0), x: k.x, y: k.y, z: k.z}));
}
for (const w of windows) { const c = base.find((b) => b.id === `av_${w.name}`); w.start = c.start; w.end = c.start + c.dur; }
fs.writeFileSync(`${W}/clipframes.json`, JSON.stringify(frameCache));
const TOTAL_F = F(base[base.length - 1].start + base[base.length - 1].dur);
const TOT = TOTAL_F / FPS;
const overs = over.map((c) => ({...c, start: F(c.start) / FPS, dur: Math.max(1, F(c.dur)) / FPS}));

// ── COMPUERTAS ──
console.log(`momentos ${M.length} · cues base ${base.length} · overlays ${overs.length} · ventanas avatar ${windows.length}`);
if (base[0].kind !== 'avatar' || base[0].dur < 2.5) FAIL(`apertura: primer cue ${base[0].kind} ${base[0].dur.toFixed(2)}s`);
{ let hue = 0, n = 0, j = 0; for (let t = 0; t < TOT - 0.05; t += 0.2) { n++; while (j < base.length && base[j].start + base[j].dur <= t) j++; if (!(j < base.length && base[j].start <= t)) hue++; } console.log(`cobertura: ${n} instantes · huecos ${hue} (${(100 - 100 * hue / n).toFixed(1)}%)`); if (hue / n > 0.1) FAIL('cobertura <90%'); }
{ const d = base.filter((c) => ['clip', 'foto'].includes(c.kind)).map((c) => c.dur).sort((a, b) => a - b); const q = (p) => d[Math.floor(p * (d.length - 1))];
  const fotos = base.filter((c) => c.kind === 'foto' && c.dur > 3.6);
  console.log(`pacing planos: ${d.length} · mediana ${q(0.5).toFixed(2)} · p90 ${q(0.9).toFixed(2)} · max ${d[d.length - 1].toFixed(1)} · fotos >3,6 s: ${fotos.length}`); }
const sum = (f) => base.filter(f).reduce((a, c) => a + c.dur, 0);
const avS = sum((c) => c.kind === 'avatar'), realS = sum((c) => c.stock), compS = sum((c) => ['comp', 'lamina', 'cta'].includes(c.kind));
console.log(`VISIBLE: avatar ${avS.toFixed(0)} s (${(100 * avS / TOT).toFixed(1)}%) · real ${realS.toFixed(0)} s (${(100 * realS / TOT).toFixed(1)}%) · componentes ${compS.toFixed(0)} s (${(100 * compS / TOT).toFixed(1)}%)`);
if (!PLAN && (avS / TOT < 0.25 || avS / TOT > 0.31)) FAIL('avatar visible fuera de 25-30%');
if (!PLAN && realS / TOT < 0.25) FAIL('metraje real < 25%');
{ const comps = base.filter((c) => c.kind === 'comp'); const tipos = new Set(comps.map((c) => c.ck)); const ovT = new Set(overs.map((o) => o.ok));
  const nT = tipos.size + ovT.size + 2;
  console.log(`componentes: ${comps.length + overs.length + base.filter((c) => ['lamina', 'cta'].includes(c.kind)).length} · tipos ${nT} (${[...tipos].join(',')} + ${[...ovT].join(',')} + lamina,cta)`);
  if (comps.length + overs.length < 40 || nT < 15) FAIL('<40 componentes o <15 tipos');
  const lectura = comps.filter((c) => c.dur + 0.05 < c._floor); if (lectura.length) console.log(`   ⚠ tiempo de lectura corto: ${lectura.map((c) => `${c.id}(${c.dur.toFixed(1)}<${c._floor.toFixed(1)})`).join(' ')}`);
  const OB = {hook: ['words', 'sub'], flow: ['kicker', 'title', 'nodes'], cutaway: ['eyebrow', 'title', 'image', 'callouts'], chapter: ['number', 'title', 'sub'], stat: ['eyebrow', 'value', 'suffix', 'support'], karaoke: ['eyebrow', 'phrase'], vs: ['eyebrow', 'title', 'left', 'right'], checklist: ['kicker', 'title', 'items', 'stamp'], tier: ['title', 'rows'], myth: ['myth', 'truth', 'mythLabel', 'truthLabel'], map: ['place', 'region'], timeline: ['title', 'events'], beforeafter: ['eyebrow', 'beforeLabel', 'afterLabel', 'beforeImage', 'afterImage'], layers: ['title', 'layers'], carousel: ['title', 'items'], steps: ['eyebrow', 'title', 'steps'], duel: ['title', 'leftName', 'rightName', 'rows'], bullets: ['eyebrow', 'bullets'], split: ['eyebrow', 'title', 'image', 'bullets'], quote: ['quote', 'author'], cycle: ['title', 'center', 'nodes'], stamp: ['text', 'sub']};
  let def = 0; for (const c of comps) { if (!OB[c.ck]) { FAIL(`tipo sin contrato ${c.ck}`); continue; } for (const k of OB[c.ck]) if (c[k] == null || c[k] === '') { console.log(`   prop vacía ${c.id}.${k}`); def++; } }
  for (const c of comps) { if (c.left && !c.left.label) def++; if (c.right && !c.right.label) def++; (c.items || []).forEach((it) => { if (typeof it === 'object' && (!it.label || !it.image)) def++; }); }
  for (const o of overs) { if (o.ok === 'frase' && !(o.words || []).length) def++; if (o.ok === 'eyebrow' && !(o.eyebrow && o.text)) def++; if (o.ok === 'stamp' && !o.text) def++; }
  console.log(`props obligatorias vacías: ${def}`); if (def) FAIL('props que caen al default');
  const largos = comps.filter((c) => c._words > 24); if (largos.length) console.log(`   ⚠ texto largo: ${largos.map((c) => `${c.id}(${c._words})`).join(' ')}`);
}
// tiempos por frase DENTRO del componente
{ const L = base.find((c) => c.kind === 'lamina');
  if (L) { const out = L.keys.filter((k) => k.f < 0 || k.f > F(L.dur)); console.log(`lámina: ${L.dur.toFixed(1)} s en pantalla · ${L.keys.length} puntos · fuera ${out.length}`); if (out.length) FAIL('punto de la lámina fuera del plano'); if (L.dur < 25 || L.dur > 40) FAIL('lámina fuera de 25-40 s'); } else FAIL('sin lámina');
  const Q = base.filter((c) => c.kind === 'cta'); console.log(`CTAs: ${Q.map((q) => `v${q.v} ${q.start.toFixed(0)}s ${q.dur.toFixed(1)}s apunta@${q._apunta.toFixed(1)}`).join(' | ')}`);
  for (const q of Q) { if (q._apunta < q.start + 0.8 || q._apunta > q.start + q.dur) FAIL(`CTA v${q.v}: "apunta" fuera del plano con QR`); if (q.dur < 5) FAIL(`CTA v${q.v} < 5 s`); }
  if (Q.length !== 3) FAIL('no son 3 CTAs'); if (Q[0] && Q[0].start < 360) FAIL('CTA antes del minuto 6');
  for (const o of overs) { const host = base.find((b) => b.kind === 'avatar' && b.start <= o.start + 0.01 && b.start + b.dur >= o.start + o.dur - 0.01); if (!host) FAIL(`overlay ${o.id} fuera de su ventana de avatar`); } }
// assets
const assets = new Set(['tfbpileta.m4a']);
const addA = (v) => { if (typeof v === 'string' && /^(img|broll|avatar_clips)\//.test(v)) assets.add(v); else if (Array.isArray(v)) v.forEach(addA); else if (v && typeof v === 'object') Object.values(v).forEach(addA); };
for (const c of base) addA(c);
for (const f of ['sfx/sfx_whoosh_soft.mp3', 'sfx/sfx_paper_tick.mp3', 'sfx/sfx_thump.mp3', 'sfx/sfx_trans3.mp3', 'sfx/sfx_trans4.mp3', 'sfx/sfx_pop.mp3', 'sfx/universfield-camera-shutter-199580.mp3']) assets.add(f);
{ let miss = 0; for (const a of assets) if (!has(a)) { if (!PLAN) console.log('   falta', a); miss++; } console.log(`assets: ${assets.size} · faltan ${miss}`); if (miss && !PLAN) FAIL('assets faltantes'); }

// ── salidas ──
fs.mkdirSync(`${W}/av`, {recursive: true});
fs.writeFileSync(`${W}/needs.json`, JSON.stringify(NEEDS, null, 1));
console.log(`needs: imágenes ${NEEDS.img.length} (con presentador ${NEEDS.img.filter((x) => x.ref).length}) · stock ${NEEDS.stock.length}`);
const clean = (c) => Object.fromEntries(Object.entries(c).filter(([k]) => !k.startsWith('_')));
fs.writeFileSync('src/tfbpileta/cues_tfbpileta.gen.ts', `// GENERADO por build_tfbpileta.mjs — NO editar a mano.\nexport const TOTAL_FRAMES_TFBPILETA = ${TOTAL_F};\nexport const BEATS: any[] = ${JSON.stringify([...base, ...overs].map(clean), null, 0).replace(/\},\{/g, '},\n{')};\n`);
fs.writeFileSync('_v3/tfbpileta_cues.json', JSON.stringify(base.filter((c) => c.src).map((c) => ({key: c.id, src: c.src, start: c.start, dur: c.dur}))));
fs.writeFileSync('_tfbpileta_assets.txt', [...assets].join('\n') + '\n');
fs.writeFileSync(`${W}/av/windows.json`, JSON.stringify(windows, null, 1));
console.log(`ventanas: ${windows.length} · reel ${windows.reduce((a, w) => a + w.end - w.start, 0).toFixed(1)} s`);
console.log(`TOTAL ${TOTAL_F} cuadros (${TOT.toFixed(1)} s) · wav ${WAV_S.toFixed(2)} s · fallas ${fails}${PLAN ? ' (modo plan)' : ''}`);
process.exitCode = fails ? 1 : 0;
if (process.argv.includes('--spans')) for (const m of M) console.log(`${m.id} ${m.t} ${(m.end - m.start).toFixed(1).padStart(5)} ${m.t === 'C' ? m.c.kind.padEnd(10) : ''.padEnd(10)} ${m.d.slice(0, 48)}`);
