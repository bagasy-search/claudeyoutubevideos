// valvasmix_juez.mjs — §2 JUEZ + descarga del stock Pexels. Por cada plano: búsqueda (caché en disco, keys con castigo),
// grilla 4x2 de hasta 8 pósters → visión (gpt-4.1-mini) elige el que muestra LITERAL lo que dice la frase → baja y conforma.
// Si ninguno sirve (0), prueba la otra query del momento. Sin repetir un mismo video/foto en todo el video.
// Uso: node _v3/valvasmix_juez.mjs [--only m015,m017]   (reanudable: D:/vvm/judge/picks.json)
import fs from 'fs';
import {execFile} from 'child_process';

const env = {}; for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEYS = [...new Set(Object.keys(env).filter((k) => /^PEXELS_API_KEY\d*$/.test(k)).map((k) => env[k]).filter(Boolean))];
const FF = 'ffmpeg';
const J = '_work/vallimon/judge'; fs.mkdirSync(J, {recursive: true});
fs.mkdirSync('public/broll/vallimon_st', {recursive: true}); fs.mkdirSync('public/img/vallimon', {recursive: true});
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? new Set(process.argv[i + 1].split(',')) : null; })();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ff = (args) => new Promise((res) => { try { execFile(FF, ['-v', 'error', '-y', ...args], {timeout: 240000}, (e) => res(!e)); } catch (e) { setTimeout(() => res(false), 2000); } });

// ── Pexels con caché + castigo por key ──
const CACHE_F = '_work/vallimon/pexels_cache.json';
let CACHE = {}; try { CACHE = JSON.parse(fs.readFileSync(CACHE_F, 'utf8')); } catch {}
const deadUntil = KEYS.map(() => 0);
async function search(kind, q) {
  const u = new URL(kind === 'v' ? 'https://api.pexels.com/videos/search' : 'https://api.pexels.com/v1/search');
  u.searchParams.set('query', q); u.searchParams.set('orientation', 'landscape'); u.searchParams.set('per_page', '15');
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
    try { const r = await fetch(url, {signal: AbortSignal.timeout(180000)}); if (r.ok) { fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); if (fs.statSync(dest).size > 3000) return true; } } catch {}
    await sleep(2000);
  }
  return false;
}

// ── visión ──
async function judge(tile, texto, n) {
  const b64 = fs.readFileSync(tile).toString('base64');
  const sys = 'Sos el editor de un canal de YouTube de belleza para mujeres de 60 a 80 años. Elegís metraje de stock REAL que muestre LITERALMENTE lo que la narradora dice en esa frase. REGLA DURA: si en la opción se ve la cara de una persona, tiene que ser claramente una MUJER MAYOR de 55 años (canas, arrugas); una persona joven o de mediana edad, o un hombre, descalifica la opción aunque haga lo pedido. Planos de manos sin cara sí sirven. También rechazás: logos o marcas en envases, médicos o enfermeras (la única doctora del canal es la presentadora), marcas de agua o logos de bancos de stock, marcas comerciales visibles en primer plano, desnudos o escotes, planos oscuros o casi negros, animaciones 3D baratas, y todo lo que sea sólo "del tema" pero no muestre el sujeto concreto de la frase.';
  const user = `La imagen es una grilla de ${n} opciones numeradas de izquierda a derecha y de arriba abajo (1 a ${n}, 4 por fila).\n${texto}\nCriterio: elegí la opción que mejor muestre el SUJETO CONCRETO de la búsqueda (el objeto, la persona o la acción). No exijas que la foto tenga texto, números, años ni la metáfora completa: el texto lo pone la edición encima. Rechazá sólo lo que muestre otra cosa o tenga los defectos listados.\nRespondé SOLO JSON: {"pick": <número 1-${n}, o 0 si ninguna muestra lo pedido>, "reason": "<máx 12 palabras>"}`;
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

// ── lista de planos (de _work/vallimon/needs_stock.json, lo arma el build) ──
const shots = JSON.parse(fs.readFileSync(process.env.NEEDS || '_work/vallimon/needs_stock.json', 'utf8'))
  .filter((n) => !ONLY || ONLY.has(n.id))
  .map((n) => ({id: `${n.id}_${n.k}`, kind: n.kind, qs: [...new Set([n.q, ...n.alt].flatMap((x) => (/woman|women/.test(x) && !/senior|elderly|older|mature|old /.test(x) ? [x.replace(/wom(a|e)n/, 'elderly wom$1n'), x] : [x])))], dest: n.dest,
    texto: (q) => `Frase que se escucha: "${n.texto}…" · Búsqueda: ${q}`}));
const PICKS_F = `${J}/picks.json`;
let PICKS = {}; try { PICKS = JSON.parse(fs.readFileSync(PICKS_F, 'utf8')); } catch {}
const USED = new Set([...Object.values(PICKS).map((p) => p.pid).filter(Boolean), ...(fs.existsSync('_work/vallimon/banned.json') ? JSON.parse(fs.readFileSync('_work/vallimon/banned.json', 'utf8')) : [])]);
const save = () => fs.writeFileSync(PICKS_F, JSON.stringify(PICKS, null, 1));
console.log(`planos ${shots.length} · ya juzgados ${shots.filter((s) => PICKS[s.id]?.pid && fs.existsSync(s.dest)).length} · keys ${KEYS.length}`);

async function doShot(s) {
  if (PICKS[s.id]?.pid && fs.existsSync(s.dest)) return 'skip';
  const queue = [...new Set([...s.qs, s.qs[0].split(' ').slice(0, 3).join(' ')])];
  while (queue.length) {
    const q = queue.shift();
    const res = await search(s.kind, q); if (!res) continue;
    const items = (s.kind === 'v' ? res.videos : res.photos) || [];
    const cands = items.map((it) => {
      const pid = `${s.kind}${it.id}`;
      if (USED.has(pid)) return null;
      if (s.kind === 'v') {
        const f = (it.video_files || []).filter((x) => (x.width || 0) >= 1280 && (x.width || 0) > (x.height || 0)).sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920))[0];
        return f && it.image && (it.duration || 0) >= 16 ? {pid, poster: it.image, link: f.link} : null;
      }
      return it.src ? {pid, poster: it.src.medium, link: it.src.large2x || it.src.original} : null;
    }).filter(Boolean).slice(0, 8);
    if (!cands.length) continue;
    const posters = [];
    for (let i = 0; i < cands.length; i++) { const p = `${J}/${s.id}_p${i}.jpg`; if (await dl(cands[i].poster, p)) posters.push(p); else posters.push(null); }
    const ok = cands.map((c, i) => ({...c, poster: posters[i]})).filter((c) => c.poster);
    if (!ok.length) continue;
    const tile = `${J}/${s.id}_grid.jpg`;
    const inputs = ok.flatMap((c) => ['-i', c.poster]);
    const cols = 4, rows = Math.ceil(ok.length / cols);
    const fc = ok.map((_, i) => `[${i}:v]scale=400:225:force_original_aspect_ratio=increase,crop=400:225,setsar=1[t${i}]`).join(';') + ';' +
      ok.map((_, i) => `[t${i}]`).join('') + `xstack=inputs=${ok.length}:layout=${ok.map((_, i) => `${(i % cols) * 400}_${Math.floor(i / cols) * 225}`).join('|')}:fill=black[o]`;
    if (ok.length === 1) { fs.copyFileSync(ok[0].poster, tile); } else if (!(await ff([...inputs, '-filter_complex', fc, '-map', '[o]', '-frames:v', '1', tile]))) continue;
    const v = await judge(tile, s.texto(q), ok.length);
    const pick = +v.pick || 0;
    if (pick < 1 || pick > ok.length) { console.log(`  · ${s.id} ninguna en "${q}" (${v.reason})`); continue; }
    const c = ok[pick - 1];
    // carrera entre workers: otro plano pudo quedarse con el mismo video mientras se juzgaba → otra vuelta con la misma query
    if (USED.has(c.pid)) { console.log(`  ↺ ${s.id} colisión ${c.pid}, re-juzgo`); if ((s._col = (s._col || 0) + 1) <= 3) { queue.unshift(q); } continue; }
    USED.add(c.pid);
    const tmp = s.dest.replace(/\.(mp4|jpg)$/, '_raw.$1');
    if (!(await dl(c.link, tmp))) { USED.delete(c.pid); continue; }
    const good = s.kind === 'v'
      ? await ff(['-ss', '0.6', '-i', tmp, '-t', '16', '-an', '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1,format=yuv420p', '-c:v', 'libx264', '-crf', '21', '-preset', 'veryfast', s.dest])
      : await ff(['-i', tmp, '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuvj420p', '-map_metadata', '-1', '-q:v', '3', s.dest]);
    try { fs.unlinkSync(tmp); } catch {}
    if (!good) { continue; }
    // luma: el clip no puede arrancar en negro ni ser oscuro entero (sin reescalar: el promedio reescalado miente)
    if (s.kind === 'v') {
      const ys = await new Promise((res) => { try { execFile(FF, ['-v', 'info', '-t', '6', '-i', s.dest, '-an', '-vf', 'fps=4,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'], {timeout: 120000, maxBuffer: 1 << 24}, (e, so, se) => res([...String(se).matchAll(/YAVG=([0-9.]+)/g)].map((x) => +x[1]))); } catch { res([]); } });
      const mean = ys.reduce((a, b) => a + b, 0) / Math.max(1, ys.length);
      if (!ys.length || ys[0] < 40 || mean < 45) { console.log(`  ◐ ${s.id} oscuro (inicio ${ys[0]?.toFixed(0)} media ${mean.toFixed(0)}), descarto`); try { fs.unlinkSync(s.dest); } catch {} ; continue; }
    }
    PICKS[s.id] = {pid: c.pid, q, pick, reason: v.reason}; save();
    return 'ok';
  }
  PICKS[s.id] = {pid: null, reason: 'ninguna opción sirvió'}; save();
  try { if (fs.existsSync(s.dest)) fs.renameSync(s.dest, s.dest.replace(/\.(mp4|jpg)$/, '_rechazado.$1')); } catch {}
  return 'none';
}

let n = 0, ok = 0, none = 0, next = 0;
async function worker() {
  while (next < shots.length) {
    const s = shots[next++];
    const r = await doShot(s); n++;
    if (r === 'ok' || r === 'skip') ok++; else none++;
    if (n % 10 === 0) console.log(`  … ${n}/${shots.length} ok ${ok} sin material ${none}`);
  }
}
await Promise.all(Array.from({length: 5}, worker));
console.log(`JUEZ LISTO: ok ${ok} · sin material ${none} · de ${shots.length}`);
