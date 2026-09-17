// valvaselina15_juez.mjs — §2 JUEZ + descarga del stock Pexels (clon de valvasmix_juez, adaptado).
// Por cada plano de stock pendiente (_work/valvaselina15/needs.json): búsqueda (caché), grilla 4x2 de pósters → visión
// (gpt-4.1-mini) elige el que muestra LITERAL lo que se dice → baja, recorta y conforma 1920x1080 30 CFR sin audio.
// Uso: node _v3/valvaselina15_juez.mjs [--only m003_0,m014_1] [--reject]   (reanudable: _work/valvaselina15/judge/picks.json)
import fs from 'fs';
import {execFile} from 'child_process';

const env = {}; for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEYS = [...new Set(['PEXELS_API_KEY2', 'PEXELS_API_KEY', ...Object.keys(env).filter((k) => /^PEXELS_API_KEY\d*$/.test(k))].map((k) => env[k]).filter(Boolean))];
const J = '_work/valvaselina15/judge'; fs.mkdirSync(J, {recursive: true});
fs.mkdirSync('public/broll/valvaselina15_st', {recursive: true});
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? new Set(process.argv[i + 1].split(',')) : null; })();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ff = (args) => new Promise((res) => execFile('ffmpeg', ['-v', 'error', '-y', ...args], {timeout: 300000}, (e) => res(!e)));

// contexto: la frase completa alrededor del ancla
const RAW = fs.readFileSync('GUION_valvaselina15.txt', 'utf8');
const normc = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const ctxOf = (d) => { const i = normc(RAW).indexOf(normc(d)); return i < 0 ? d : RAW.slice(i, i + 220).replace(/\s+/g, ' '); };

const CACHE_F = `${J}/pexels_cache.json`;
let CACHE = {}; try { CACHE = JSON.parse(fs.readFileSync(CACHE_F, 'utf8')); } catch {}
const deadUntil = KEYS.map(() => 0);
async function search(q, page = 1) {
  const u = new URL('https://api.pexels.com/videos/search');
  u.searchParams.set('query', q); u.searchParams.set('orientation', 'landscape'); u.searchParams.set('per_page', '24'); u.searchParams.set('page', String(page));
  const key = String(u);
  if (CACHE[key]) return CACHE[key];
  for (let a = 0; a < 400; a++) {
    const k = deadUntil.findIndex((t) => t <= Date.now());
    if (k < 0) { await sleep(30000); continue; }
    let r; try { r = await fetch(u, {headers: {Authorization: KEYS[k]}, signal: AbortSignal.timeout(30000)}); } catch { await sleep(4000); continue; }
    if (r.status === 200) { const j = await r.json(); CACHE[key] = j; fs.writeFileSync(CACHE_F, JSON.stringify(CACHE)); return j; }
    if (r.status === 401 || r.status === 429) { deadUntil[k] = Date.now() + 15 * 60000; console.log(`  [${r.status}] key${k} fuera 15 min`); continue; }
    if (r.status >= 500) { await sleep(5000); continue; }
    return null;
  }
  return null;
}
async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try { const r = await fetch(url, {signal: AbortSignal.timeout(300000)}); if (r.ok) { fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); if (fs.statSync(dest).size > 3000) return true; } } catch {}
    await sleep(2000);
  }
  return false;
}
async function judge(tile, texto, n) {
  const b64 = fs.readFileSync(tile).toString('base64');
  const sys = 'Sos el editor de un canal de YouTube de belleza para mujeres de 60 a 80 años (una doctora da trucos con vaselina). Elegís metraje de stock REAL que muestre LITERALMENTE lo que la narradora dice en esa frase. Rechazás: personas jóvenes (menores de ~50 años) como protagonistas, médicos/doctores/enfermeras (la única doctora del video es la presentadora), marcas de agua o logos, marcas comerciales visibles, desnudos o escotes, planos oscuros, animaciones 3D, y todo lo que sea sólo "del tema" pero no muestre el sujeto concreto de la frase. REGLA DURA: si en la opción se ve CUALQUIER persona joven (cara, labios, ojos o piel lisa de menos de ~50 años) o piel desnuda (espalda, pecho, tirantes), esa opción NO sirve aunque sea perfecta. Un plano sólo de OBJETOS relacionados con la frase sí sirve (y si la búsqueda es de objetos, rechazá toda opción con personas). Si la frase es sobre un objeto o una parte del cuerpo en primer plano (manos, labios, talones), la edad importa menos, pero preferí piel madura.';
  const user = `La imagen es una grilla de ${n} opciones numeradas de izquierda a derecha y de arriba abajo (1 a ${n}, 4 por fila).\n${texto}\nElegí la opción que mejor muestre el SUJETO CONCRETO de la frase. Respondé SOLO JSON: {"pick": <número 1-${n}, o 0 si ninguna sirve>, "reason": "<máx 12 palabras>"}`;
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', signal: AbortSignal.timeout(60000),
        headers: {Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({model: 'gpt-4.1-mini', temperature: 0, response_format: {type: 'json_object'},
          messages: [{role: 'system', content: sys}, {role: 'user', content: [{type: 'text', text: user}, {type: 'image_url', image_url: {url: `data:image/jpeg;base64,${b64}`, detail: 'high'}}]}]}),
      });
      if (!r.ok) { await sleep(3000 * (a + 1)); continue; }
      const j = await r.json();
      return JSON.parse(j.choices[0].message.content);
    } catch { await sleep(3000); }
  }
  return {pick: 0, reason: 'sin respuesta de visión'};
}

const NEEDS = JSON.parse(fs.readFileSync('_work/valvaselina15/needs.json', 'utf8')).filter((n) => n.what === 'stock');
const OVR = (() => { try { return JSON.parse(fs.readFileSync('_work/valvaselina15/q_override.json', 'utf8')); } catch { return {}; } })();
const shots = NEEDS.map((n) => ({id: n.p.split('/').pop().replace('.mp4', ''), dest: `public/${n.p}`, qs: OVR[n.p.split('/').pop().replace('.mp4', '')] || [n.q, ...n.alt.filter((x) => x !== n.q)], need: n.dur || 5, texto: (q) => `Frase que se escucha: "${ctxOf(n.d)}" · Búsqueda: ${q}`}))
  .filter((s) => !ONLY || ONLY.has(s.id));
const PICKS_F = `${J}/picks.json`;
let PICKS = {}; try { PICKS = JSON.parse(fs.readFileSync(PICKS_F, 'utf8')); } catch {}
const REJ_F = `${J}/rejected.json`;
let REJ = []; try { REJ = JSON.parse(fs.readFileSync(REJ_F, 'utf8')); } catch {}
const USED = new Set([...Object.values(PICKS).map((p) => p.pid).filter(Boolean), ...REJ]);
const save = () => fs.writeFileSync(PICKS_F, JSON.stringify(PICKS, null, 1));
console.log(`planos ${shots.length} · keys ${KEYS.length}`);

async function doShot(s) {
  if (fs.existsSync(s.dest)) return 'skip';
  const queue = [...new Set([...s.qs, s.qs[0].split(' ').slice(0, 3).join(' ')])];
  while (queue.length) {
    const q = queue.shift();
    const res = await search(q); if (!res) continue;
    const cands = (res.videos || []).map((it) => {
      const pid = `v${it.id}`;
      if (USED.has(pid) || (it.duration || 0) < Math.min(16, s.need + 2)) return null;
      const f = (it.video_files || []).filter((x) => (x.width || 0) >= 1280 && (x.width || 0) > (x.height || 0)).sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920))[0];
      return f && it.image ? {pid, poster: it.image, link: f.link, dur: it.duration} : null;
    }).filter(Boolean).slice(0, 8);
    if (!cands.length) continue;
    const posters = [];
    for (let i = 0; i < cands.length; i++) { const p = `${J}/${s.id}_p${i}.jpg`; posters.push((await dl(cands[i].poster, p)) ? p : null); }
    const ok = cands.map((c, i) => ({...c, poster: posters[i]})).filter((c) => c.poster);
    if (!ok.length) continue;
    const tile = `${J}/${s.id}_grid.jpg`;
    const cols = 4;
    const fc = ok.map((_, i) => `[${i}:v]scale=400:225:force_original_aspect_ratio=increase,crop=400:225,setsar=1[t${i}]`).join(';') + ';' + ok.map((_, i) => `[t${i}]`).join('') + `xstack=inputs=${ok.length}:layout=${ok.map((_, i) => `${(i % cols) * 400}_${Math.floor(i / cols) * 225}`).join('|')}:fill=black[o]`;
    if (ok.length === 1) fs.copyFileSync(ok[0].poster, tile); else if (!(await ff([...ok.flatMap((c) => ['-i', c.poster]), '-filter_complex', fc, '-map', '[o]', '-frames:v', '1', tile]))) continue;
    const v = await judge(tile, s.texto(q), ok.length);
    const pick = +v.pick || 0;
    if (pick < 1 || pick > ok.length) { console.log(`  · ${s.id} ninguna en "${q}" (${v.reason})`); continue; }
    const c = ok[pick - 1];
    if (USED.has(c.pid)) { if ((s._col = (s._col || 0) + 1) <= 3) queue.unshift(q); continue; }
    USED.add(c.pid);
    const tmp = s.dest.replace(/\.mp4$/, '_raw.mp4');
    if (!(await dl(c.link, tmp))) { USED.delete(c.pid); continue; }
    const len = Math.min(c.dur - 0.8, Math.max(16, s.need + 1));
    const good = await ff(['-ss', '0.6', '-i', tmp, '-t', len.toFixed(2), '-an', '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-c:v', 'libx264', '-crf', '21', '-preset', 'veryfast', '-g', '30', s.dest]);
    try { fs.unlinkSync(tmp); } catch {}
    if (!good) continue;
    const ys = await new Promise((res) => execFile('ffmpeg', ['-v', 'info', '-t', '4', '-i', s.dest, '-an', '-vf', 'fps=4,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'], {timeout: 120000, maxBuffer: 1 << 24}, (e, so, se) => res([...String(se).matchAll(/YAVG=([0-9.]+)/g)].map((x) => +x[1]))));
    const mean = ys.reduce((a, b) => a + b, 0) / Math.max(1, ys.length);
    if (!ys.length || Math.min(...ys.slice(0, 3)) < 40 || mean < 45) { console.log(`  ◐ ${s.id} oscuro, descarto`); try { fs.unlinkSync(s.dest); } catch {} continue; }
    PICKS[s.id] = {pid: c.pid, q, pick, reason: v.reason}; save();
    return 'ok';
  }
  PICKS[s.id] = {pid: null, reason: 'ninguna opción sirvió'}; save();
  return 'none';
}
let n = 0, okN = 0, none = 0, next = 0;
async function worker() {
  while (next < shots.length) {
    const s = shots[next++];
    const r = await doShot(s); n++;
    if (r === 'ok' || r === 'skip') okN++; else { none++; console.log(`  ✗ ${s.id}`); }
    if (n % 10 === 0) console.log(`  … ${n}/${shots.length} ok ${okN} sin material ${none}`);
  }
}
await Promise.all(Array.from({length: 4}, worker));
console.log(`JUEZ LISTO: ok ${okN} · sin material ${none} · de ${shots.length}`);
