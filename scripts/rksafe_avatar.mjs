// scripts/rksafe_avatar.mjs <slug> [reel|run|cut|todo] — el AVATAR del canal Ray Kessler, por
// VENTANAS, en UN solo /run del endpoint PUBLICO de RunPod (InfiniteTalk). Camino compartido.
//
// ⛔⛔ EL PLAN VA ANTES DE DISPARAR. Dos agentes pagaron 4x y 9x de mas por generar lipsync del audio
//    COMPLETO cuando el avatar se ve ~20 %. El orden es: plan -> medir los segundos VISIBLES ->
//    concatenar SOLO esas ventanas en un reel -> UN /run. Un job = US$0,25 flat.
// ⛔⛔ RUNPOD SIEMPRE, NUNCA VAST (regla del creador).
// ⛔⛔ LA REFERENCIA NUNCA SALE DE UN FRAME DE UN AVATAR YA GENERADO: sale blanda y el avatar nuevo
//    hereda esa blandura. Tiene que ser una FOTO nitida en plano MEDIO 16:9. Un crop apretado sale
//    con la cara GIGANTE.
// ⛔⛔ EL HEADER MIENTE: la duracion real es la del ULTIMO FRAME DE VIDEO, no `format=duration`.
//    Medido en fapiel60: header 134,16 s y los frames terminaban en 51,04 s.
// ⛔ Los labios vienen ADELANTADOS 0,25 s CONSTANTE: se corrige con `tpad=start_duration=0.25:
//    start_mode=clone` sobre el REEL, antes de cortarlo (asi toda ventana hereda la correccion).
// ⛔ 25 -> 30 fps con `fps=30` (DUPLICACION SIMPLE), nunca `minterpolate`: reparte el movimiento
//    desparejo y eso se lee como tiron.
// ⛔⛔ EL AVATAR VA A PANTALLA COMPLETA, SIEMPRE (regla dura del creador, jul-2026 y reafirmada el
//    20-sep-2026): 'usa o el avatar pantalla completa, o la foto/video pantalla completa, porque queda
//    raro sino'. El PiP en panel se ve amateur. ⚠️ Un intento anterior conformaba el reel a 960x540
//    para bajar el upscale a 1,154x: RECHAZADO a la primera.
// ⛔ El endpoint publico devuelve 832x464 FIJO (tambien con size 720p: esta medido), asi que a full
//    frame el estiramiento es 2,31x. Eso NO se combate achicando el avatar: se combate en el
//    CONFORMADO (lanczos + un unsharp FUERTE, 0,95 — a 2,31x es donde se juega que no se vea
//    plastico) y con una REFERENCIA nitida en plano medio 16:9.
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { supaCreds } from './supa_creds.mjs';

const SLUG = process.argv[2];
const ETAPA = process.argv[3] || 'todo';
if (!SLUG) { console.error('uso: node scripts/rksafe_avatar.mjs <slug> [reel|run|cut|todo]'); process.exit(1); }
const corre = (e) => ETAPA === 'todo' || ETAPA === e;

const A = `_v3/${SLUG}/av`;
const JOBS = `${A}/jobs.json`;
const WAV = `public/${SLUG}.wav`;
const REF = `public/${SLUG}_avref.png`;
const WINS = `_v3/${SLUG}_avwins.json`;
fs.mkdirSync(A, { recursive: true });

const KEY = (fs.readFileSync('.env', 'utf8').match(/^RUNPOD_API_KEY\s*=\s*(.*)$/m) || [])[1]?.trim();
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).match(/[\d.]+/)[0];
/** El ULTIMO FRAME REAL de video. Esta es la verdad; el header miente. */
const ultimoFrame = (f) => {
  const o = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'frame=best_effort_timestamp_time', '-of', 'csv=p=0', f], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const ls = o.trim().split('\n').filter(Boolean);
  return +(ls.at(-1) || '0').replace(/,/g, '');
};

// ── 1 · REEL: el audio de las ventanas, pegado ──────────────────────────────────────────────────
if (corre('reel')) {
  const W = JSON.parse(fs.readFileSync(WINS, 'utf8')).sort((a, b) => a.t - b.t);
  const TOTAL = dur(WAV);
  const lst = [];
  let off = 0;
  for (const w of W) {
    const f = `${A}/w${String(w.i).padStart(3, '0')}.wav`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', w.t.toFixed(3), '-t', w.dur.toFixed(3),
      '-i', WAV, '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', f]);
    const real = dur(f);
    w.real = +real.toFixed(3);
    w.reel_off = +off.toFixed(3);
    off += real;
    lst.push(`file '${process.cwd().replace(/\\/g, '/')}/${f}'`);
  }
  fs.writeFileSync(`${A}/cat.txt`, lst.join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${A}/cat.txt`,
    '-c:a', 'pcm_s16le', `${A}/reel.wav`]);
  fs.writeFileSync(WINS, JSON.stringify(W, null, 1));
  const reelSec = dur(`${A}/reel.wav`);
  const solapa = W.some((w, i) => i && w.t < W[i - 1].t + W[i - 1].dur - 0.01);
  console.log('═'.repeat(70));
  console.log(`MEDIDO: ${W.length} ventanas · reel ${reelSec.toFixed(1)} s de ${TOTAL.toFixed(1)} s = ${(100 * reelSec / TOTAL).toFixed(1)} % del video`);
  console.log(`  más corta ${Math.min(...W.map((w) => w.dur)).toFixed(2)} s · más larga ${Math.max(...W.map((w) => w.dur)).toFixed(2)} s`);
  console.log(`  apertura: la ventana 0 arranca en ${W[0].t.toFixed(2)} s y dura ${W[0].dur.toFixed(2)} s`);
  console.log(`  solapes: ${solapa ? '⛔ SÍ' : 'no ✓'}`);
  console.log(`  REEL ${reelSec.toFixed(1)} s → ${reelSec <= 595 ? 'UN job de RunPod (US$0,25) ✓' : '⛔ pasa el cap ~595 s: habrá 2º /run con la cola'}`);
  console.log('═'.repeat(70));
  if (solapa) process.exit(3);
}

// ── 2 · RUN: UN solo /run con TODO el reel ──────────────────────────────────────────────────────
async function hostear(nombre, local, ct) {
  const { U, K } = supaCreds();
  const obj = `tmp_avatar/${SLUG}_${nombre}`;
  const r = await fetch(`${U}/storage/v1/object/thumbnails/${obj}`, {
    method: 'POST', headers: { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': ct, 'x-upsert': 'true' },
    body: fs.readFileSync(local), signal: AbortSignal.timeout(900_000),
  });
  if (!r.ok) throw new Error(`subida ${nombre}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const url = `${U}/storage/v1/object/public/thumbnails/${obj}`;
  const h = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(60_000) });
  if (h.status !== 200) throw new Error(`${nombre} no quedó público (${h.status})`);
  console.log(`  hosteado ${nombre} · ${h.headers.get('content-length')} B`);
  return { url, borrar: () => fetch(`${U}/storage/v1/object/thumbnails/${obj}`, { method: 'DELETE', headers: { apikey: K, Authorization: `Bearer ${K}` } }).catch(() => {}) };
}

async function job(parte, faceLocal, audioLocal, outMp4) {
  const jobs = fs.existsSync(JOBS) ? JSON.parse(fs.readFileSync(JOBS, 'utf8')) : {};
  // ⛔ un job ANTERIOR al audio actual NO sirve: seria lipsync contra otra locucion.
  const audioMs = fs.statSync(WAV).mtimeMs;
  if (jobs[parte] && !(jobs[parte].ts >= audioMs)) { console.log(`  olvido el job ${parte}: es anterior al audio actual`); delete jobs[parte]; }
  let borrar = [];
  if (!jobs[parte]?.id) {
    const f = await hostear(`face_${parte}.png`, faceLocal, 'image/png');
    const a = await hostear(`audio_${parte}.wav`, audioLocal, 'audio/wav');
    borrar = [f, a];
    const body = {
      input: {
        prompt: 'A calm older man speaks naturally to the camera in his locksmith workshop, small natural head movements, steady realistic daylight',
        image: f.url, audio: a.url, size: '720p',
      },
      policy: { executionTimeout: 7_200_000 },
    };
    const r = await fetch('https://api.runpod.ai/v2/infinitetalk/run', { method: 'POST', headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout(120_000) });
    const t = await r.text();
    if (!r.ok) { for (const b of borrar) await b.borrar(); throw new Error(`RunPod /run ${r.status}: ${t.slice(0, 300)}`); }
    jobs[parte] = { id: JSON.parse(t).id, ts: Date.now() };
    fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
    console.log(`  RunPod ${parte}: JOB ${jobs[parte].id}`);
  } else console.log(`  RunPod ${parte}: retomo JOB ${jobs[parte].id} (no se vuelve a pagar)`);

  let st;
  try {
    for (let k = 0; k < 900; k++) {
      await sleep(k ? 30_000 : 8_000);
      try { st = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${jobs[parte].id}`, { headers: H, signal: AbortSignal.timeout(60_000) })).json(); }
      catch (e) { console.log(`  poll: ${e.message}`); continue; }
      if (k % 6 === 0) console.log(`  [${new Date().toISOString().slice(11, 19)}] ${parte}: ${st.status}`);
      if (!['IN_QUEUE', 'IN_PROGRESS', 'RUNNING'].includes(st.status)) break;
    }
  } finally { for (const b of borrar) await b.borrar(); }
  if (st?.status !== 'COMPLETED') {
    delete jobs[parte]; fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
    throw new Error(`RunPod ${parte}: ${st?.status} ${JSON.stringify(st?.error || '').slice(0, 300)}`);
  }
  const mp4 = await fetch(st.output.result, { signal: AbortSignal.timeout(3_600_000) });
  fs.writeFileSync(outMp4, Buffer.from(await mp4.arrayBuffer()));
  jobs[parte].costo = st.output?.cost ?? 0.25; jobs[parte].hecho = true;
  fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
}

if (corre('run')) {
  if (!KEY) { console.error('⛔ falta RUNPOD_API_KEY en .env'); process.exit(1); }
  if (!fs.existsSync(REF)) { console.error(`⛔ falta la referencia ${REF} (foto nítida, plano MEDIO 16:9)`); process.exit(1); }
  const rw = `${A}/reel.wav`, reelSec = dur(rw);
  const W = JSON.parse(fs.readFileSync(WINS, 'utf8'));
  console.log(`REEL ${reelSec.toFixed(2)} s · referencia ${REF}`);
  const p1 = `${A}/parte1.mp4`;
  if (!fs.existsSync(p1) || fs.statSync(p1).mtimeMs < fs.statSync(WAV).mtimeMs) await job('parte1', REF, rw, p1);
  const d1 = ultimoFrame(p1);
  console.log(`parte1: header ${dur(p1).toFixed(2)} s · ÚLTIMO FRAME REAL ${d1.toFixed(2)} s · pedido ${reelSec.toFixed(2)} s`);
  const reel = `${A}/reel_crudo.mp4`;
  if (d1 >= reelSec - 0.5) fs.copyFileSync(p1, reel);
  else {
    const corte = Math.max(...W.map((w) => w.reel_off).filter((o) => o <= d1 - 0.3));
    if (!(corte > 0)) throw new Error(`parte1 volvió con ${d1.toFixed(1)} s y no hay borde de ventana antes`);
    console.log(`parte1 corta (cap de RunPod) → 2º /run SÓLO con la cola desde ${corte.toFixed(2)} s`);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(corte), '-i', rw, '-c:a', 'pcm_s16le', `${A}/cola.wav`]);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', p1, '-t', String(corte), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-an', `${A}/parte1_trim.mp4`]);
    const p2 = `${A}/parte2.mp4`;
    if (!fs.existsSync(p2)) await job('parte2', REF, `${A}/cola.wav`, p2);
    const d2 = ultimoFrame(p2), d2p = dur(`${A}/cola.wav`);
    console.log(`parte2: ÚLTIMO FRAME REAL ${d2.toFixed(2)} s · pedido ${d2p.toFixed(2)} s`);
    if (d2 < d2p - 0.5) throw new Error(`⛔ la COLA también volvió truncada (${d2.toFixed(1)}/${d2p.toFixed(1)})`);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${A}/parte1_trim.mp4`, '-i', p2, '-filter_complex',
      '[0:v][1:v]concat=n=2:v=1:a=0[v]', '-map', '[v]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', reel]);
  }
  const dr = ultimoFrame(reel), falta = reelSec - dr;
  console.log(`REEL crudo: último frame real ${dr.toFixed(2)} s · faltante ${falta.toFixed(3)} s`);
  const jobs = JSON.parse(fs.readFileSync(JOBS, 'utf8'));
  const costo = Object.values(jobs).reduce((a, j) => a + (+j.costo || 0), 0);
  console.log(`MEDIDO: ${Object.keys(jobs).length} job(s) de RunPod · costo US$${costo.toFixed(2)}`);
  const res = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', reel], { encoding: 'utf8' }).trim();
  console.log(`  resolución que devolvió el endpoint: ${res}  (a pantalla completa el estiramiento es ${(1920 / +res.split(',')[0]).toFixed(3)}x)`);
}

// ── 3 · CUT: corregir el adelanto de labios, conformar a 960x540 30 CFR y partir por ventana ─────
if (corre('cut')) {
  const W = JSON.parse(fs.readFileSync(WINS, 'utf8')).sort((a, b) => a.reel_off - b.reel_off);
  const crudo = `${A}/reel_crudo.mp4`, reel = `${A}/reel.mp4`, OUT = `public/broll/${SLUG}`;
  fs.mkdirSync(OUT, { recursive: true });
  const reelSec = dur(`${A}/reel.wav`);
  // ⛔ tpad ANTES de cortar: el adelanto de labios es CONSTANTE, asi que corregirlo una sola vez
  //    sobre el reel deja todas las ventanas alineadas. Se clona tambien el final para cubrir.
  // ⛔ `unsharp` DESPUES del `scale=...:lanczos`: lanczos solo no devuelve el micro-contraste.
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', crudo, '-vf',
    'tpad=start_duration=0.25:start_mode=clone:stop_duration=1.0:stop_mode=clone,' +
    'scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,' +
    'unsharp=5:5:0.95:5:5:0.0,fps=30,setsar=1',
    '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-fps_mode', 'cfr', reel]);
  console.log(`reel conformado: ${ultimoFrame(reel).toFixed(2)} s · 1920x1080 30/1 CFR · lanczos+unsharp 0,95 · labios corregidos 0,25 s`);

  const malos = [], fps = new Set();
  for (const w of W) {
    const dst = `${OUT}/av_w${String(w.i).padStart(3, '0')}.mp4`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', w.reel_off.toFixed(3), '-i', reel, '-t', w.dur.toFixed(3),
      '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-fps_mode', 'cfr', dst]);
    const real = dur(dst);
    if (Math.abs(real - w.dur) > 2 / 30 + 0.02) malos.push(`w${w.i}: ${real.toFixed(3)} vs ${w.dur.toFixed(3)}`);
    fps.add(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', dst], { encoding: 'utf8' }).trim().replace(/,$/, ''));
  }
  console.log(`MEDIDO: ventanas cortadas ${W.length} · mal cortadas ${malos.length} ${malos.length ? '⛔ ' + malos.slice(0, 5).join(' ') : '✓'}`);
  console.log(`fps de los clips de avatar: ${[...fps].join(' ')} ${fps.size === 1 && fps.has('30/1') ? '✓' : '⛔'}`);

  // ⛔ EL REEL CONFORMADO VA `-an`: medir la sincro contra EL no da NaN por casualidad, da NaN
  //    siempre, porque no tiene pista de audio. Se mide contra el CRUDO de RunPod, que si la trae
  //    (y es donde vive el lipsync que interesa verificar; el tpad posterior es una constante).
  const s = spawnSync('node', ['scripts/avatar_sync_gate.mjs', crudo, `${A}/reel.wav`], { encoding: 'utf8' });
  const txt = (s.stdout || '') + (s.stderr || '');
  const corr = Number((txt.match(/correlaci[oó]n m[aá]x:\s*(-?[\d.]+)/) || [])[1]);
  const lag = Number((txt.match(/desfase:\s*(-?[\d.]+)s/) || [])[1]);
  console.log(`SINCRO del reel: correlación ${corr} (piso 0,35) · desfase ${(lag * 1000).toFixed(0)} ms (techo 60) ` +
    (corr >= 0.35 && Math.abs(lag) <= 0.06 ? '✓' : '⚠️ revisar'));
  if (!Number.isFinite(corr)) console.log('  ⚠️ el medidor de sincro no imprimió número — NO es un OK:\n' + txt.slice(0, 400));
  if (malos.length || fps.size !== 1 || !fps.has('30/1')) process.exit(3);
  void reelSec;
}
