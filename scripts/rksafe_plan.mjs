// scripts/rksafe_plan.mjs — BEATSHEET del camino curado `rksafe` (canal Ray Kessler), anclado al ms.
//   node scripts/rksafe_plan.mjs <slug>
//
// ⛔ NO se clona por slug: todo lo específico del video vive en `_v3/<slug>_cfg.mjs` (secciones,
//    escalera, componentes, tratamiento de cámara) y el pool en `_v3/<slug>_prompts.mjs`.
//    Este archivo es el que shipearon rkfob/rkslide, generalizado.
//
// ═══ LAS REGLAS QUE ESTE GENERADOR TIENE QUE CUMPLIR (todas medidas, todas dolieron una vez) ═══
// 1.bis EL VIDEO ABRE CON EL AVATAR HABLANDO. El primer cue de b-roll no puede empezar antes de
//       max(3 s, fin de la primera FRASE). No se negocia con el gancho.
// PACING NO METRÓNOMO: "lento parejo" es el mismo defecto que "rápido parejo" (rkbill: mediana =
//       p75 = p90). Objetivo mediana 3,5-4,5 s · p75 > 5 s · ~40 % ≥ 5 s · dispersión p25↔p75 ~1,8 s.
// COBERTURA ≥ 90 %, medida POR TERCIO, y el tercio final no puede ser el más pelado.
// ⛔⛔ Después de AVATAR_END el avatar corre en BUCLE y sus labios no coinciden: ahí la cobertura
//       tiene que ser ≥ 95 % y NO se abre ninguna ventana de avatar.
// TIEMPO DE LECTURA de los componentes: piso 2,8 s + 0,28 s por palabra más allá de 3 (techo 13 s).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_plan.mjs <slug>'); process.exit(1); }
const raiz = process.cwd();
const cfg = await import(path.resolve(raiz, `_v3/${SLUG}_cfg.mjs`).replace(/\\/g, '/').replace(/^/, 'file:///'));
const { ITEMS } = await import(path.resolve(raiz, `_v3/${SLUG}_prompts.mjs`).replace(/\\/g, '/').replace(/^/, 'file:///'));

const FPS = 30;
const APERTURA_MIN = 3.0;
const CAP_IMG = 9.5;                 // techo de foto: por debajo, la escalera larga se recorta y vuelve el metrónomo

const tiempos = JSON.parse(fs.readFileSync(`_v3/${SLUG}_tiempos.json`, 'utf8'));
const TOTAL = tiempos.total;
const AVATAR_END = tiempos.avatarEnd;
const words = JSON.parse(fs.readFileSync(`_v3/${SLUG}_words.json`, 'utf8'));
const guion = fs.readFileSync(`canales/${SLUG}_GUION.txt`, 'utf8');
const clipsEnDisco = new Set(
  fs.existsSync(`public/broll/${SLUG}`)
    ? fs.readdirSync(`public/broll/${SLUG}`).filter((f) => f.endsWith('.mp4')).map((f) => f.replace(/\.mp4$/, ''))
    : []);
// ── METRAJE REAL (stock ya conformado a 30/1 CFR) ────────────────────────────────────────────
// ⛔ El metraje real NO se ralentiza: `rate` siempre 1 (el 0,5× existe para esconder los
//    artefactos de agnes, y sobre una toma de cámara real sólo se ve como cámara lenta rara).
const REAL_DIR = `public/broll/${SLUG}_real`;
const realEnDisco = new Set(fs.existsSync(REAL_DIR)
  ? fs.readdirSync(REAL_DIR).filter((f) => f.endsWith('.mp4')).map((f) => f.replace(/\.mp4$/, ''))
  : []);
let REAL = [];
try { ({ REAL } = await import(path.resolve(raiz, `_v3/${SLUG}_real.mjs`).replace(/\\/g, '/').replace(/^/, 'file:///'))); } catch { /* el video puede no tener metraje real */ }
// ⛔ NO SE SUPONE LA DURACIÓN DEL METRAJE REAL. Se bajan con `-t 8.2` pero la FUENTE puede ser más
//    corta: medido acá, 5 clips tenían entre 4,83 y 7,80 s y el build avisó que el plano los
//    CONGELARÍA. Se mide cada archivo una vez con ffprobe.
const durReal = {};
for (const id of realEnDisco) {
  try {
    const o = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
      `${REAL_DIR}/${id}.mp4`], { encoding: 'utf8' });
    durReal[id] = Math.max(0, (+(o.match(/[\d.]+/) || [0])[0]) - 0.08);
  } catch { durReal[id] = 0; }
}

const esClip = (d) => Math.abs(d - 4.03) < 0.06 || Math.abs(d - 8.07) < 0.06;

// ⛔⛔ EL ASSET SE ELIGE POR LA FRASE QUE SUENA EN ESE SEGUNDO, NO POR RONDA. Repartir el pool de la
//    sección en round-robin da coherencia de TEMA y no de FRASE: la oración del felpudo agarra el
//    plano del medidor porque le tocó. Medido acá antes del arreglo: 45 % de planos pegaban.
//    Se puntúa cada candidato por los SUSTANTIVOS compartidos con su ventana y se elige el mejor.
const VACIAS = new Set(('a an the and or but of to in on at for with that this it is are was were be been am i you he she they we ' +
  'my your his her their our not no yes so if then than as from by about into out up down over under one two three four five ' +
  'do does did done go going goes get got make makes made take takes took put puts say says said just like can could would ' +
  'will shall may might must have has had there here what when where who how why very really only also even still back ' +
  'thing things something anything nothing somebody everybody nobody people person because before after while all any each ' +
  'own same other another more most less least much many little big good bad right left new old first last next').split(' '));
const tokensDe = (txt) => new Set(String(txt).toLowerCase().match(/[a-z']{4,}/g) || []);
const raiz2 = (w) => w.replace(/(ies|es|s)$/, '');
const puntaje = (sust, tokens) => {
  let n = 0;
  for (const s of sust) if (tokens.has(s) || tokens.has(raiz2(s)) || (s.length > 5 && [...tokens].some((t) => t.startsWith(s.slice(0, 5))))) n++;
  return n;
};

// tiempo de lectura de un componente (el piso sale del TEXTO, no del slot)
const palabrasDe = (props) => {
  let n = 0;
  for (const v of Object.values(props)) {
    if (typeof v === 'string') n += v.split(/\s+/).filter(Boolean).length;
    else if (Array.isArray(v)) for (const it of v) n += String(it.text || it.title || it.label || '').split(/\s+/).filter(Boolean).length;
  }
  return n;
};
const lectura = (props) => Math.min(13, Math.max(2.8, 2.8 + 0.28 * Math.max(0, palabrasDe(props) - 3)));

// ── párrafos → tiempo ─────────────────────────────────────────────────────
const paras = [];
{ let pos = 0; for (const p of guion.trim().split(/\n\s*\n/)) { const s = guion.indexOf(p, pos); paras.push({ s, e: s + p.length }); pos = s + p.length; } }
const tDeChar = (c) => { const w = words.find((x) => x.c0 >= c); return w ? w.t : TOTAL; };
const tPara = (n) => tDeChar(paras[n - 1].s);
const tFinPrimeraFrase = (t0) => { const m = guion.match(/^[^.!?]*[.!?]/); return m ? Math.max(t0, tDeChar(m[0].length)) : t0 + 3; };

// secciones con sus tiempos reales
const secciones = cfg.SECCIONES.map((s, i, arr) => ({
  ...s,
  t0: tPara(s.p0),
  t1: i + 1 < arr.length ? tPara(arr[i + 1].p0) : TOTAL,
}));

// ── pool por sección ──────────────────────────────────────────────────────
const poolPorSec = {};
for (const it of ITEMS) (poolPorSec[it.sec] ||= []).push({
  id: SLUG + '_' + it.id, lugar: it.lugar, hayClip: clipsEnDisco.has(SLUG + '_' + it.id),
  tokens: tokensDe(it.prompt),
});
let nReal = 0;
for (const it of REAL) {
  const id = SLUG + '_' + it.id;
  if (!realEnDisco.has(id)) continue;
  (poolPorSec[it.sec] ||= []).push({ id, lugar: it.lugar, hayClip: true, real: true, tokens: tokensDe(it.prompt) });
  nReal++;
}
console.log('metraje REAL disponible: ' + nReal + ' clips de ' + REAL.length + ' declarados');

// ── armado de beats ───────────────────────────────────────────────────────
const beats = [];
const compsUsados = [];
const usadosPool = {};
const cursorPool = {};
// ⛔ NUNCA REPETIR UN CLIP (regla del creador, todos los canales). El pool de fotos sí se puede
//    reusar dentro de una sección; el CLIP no: agnes_qc bloquea el render si un mp4 aparece dos veces.
const clipsUsados = new Set();
const todos = Object.values(poolPorSec).flat();

for (const sec of secciones) {
  const esc = cfg.ESCALERA[sec.rol];
  const pool = poolPorSec[sec.sec] || [];
  cursorPool[sec.sec] = 0;
  const comps = cfg.COMPONENTES.filter((c) => c.p >= sec.p0 && c.p <= sec.p1)
    .map((c) => ({ ...c, t: tPara(c.p), dur: lectura(c.props) }))
    .sort((a, b) => a.t - b.t);

  // ⛔⛔ LOS COMPONENTES SE RESERVAN PRIMERO Y LOS PLANOS SE TEJEN ALREDEDOR. Buscarlos mientras
  //    avanza el cursor hace que un componente DESAPAREZCA sin avisar si la escalera pasa de largo
  //    (rkfob: se perdieron 5 de 18, uno era el CTA del video entero).
  const arrancaEn = sec === secciones[0]
    ? Math.max(sec.t0, APERTURA_MIN, Math.min(tFinPrimeraFrase(sec.t0), 8.0))
    : sec.t0;
  const reservas = [];
  for (const c of comps) {
    const t0 = Math.max(arrancaEn, Math.min(c.t, sec.t1 - c.dur));
    const t1 = Math.min(sec.t1, t0 + c.dur);
    if (t1 - t0 < 2.4) continue;
    reservas.push({ t: t0, dur: t1 - t0, c });
  }
  reservas.sort((a, b) => a.t - b.t);
  for (let i = 1; i < reservas.length; i++) {
    const prev = reservas[i - 1];
    if (reservas[i].t < prev.t + prev.dur) reservas[i].t = prev.t + prev.dur;
    reservas[i].dur = Math.min(reservas[i].dur, sec.t1 - reservas[i].t);
  }
  const vivas = reservas.filter((r) => r.dur >= 2.4);
  if (vivas.length !== comps.length) {
    console.error('⛔ ' + sec.sec + ': ' + (comps.length - vivas.length) + ' componente(s) no entran en la sección');
    process.exit(4);
  }
  for (const r of vivas) {
    const conFoto = pool.filter((c) => !c.real);
    const bed = conFoto.length ? conFoto[cursorPool[sec.sec] % conFoto.length].id : null;
    beats.push({ t: +r.t.toFixed(3), dur: +r.dur.toFixed(3), kind: 'componente', sec: sec.sec, comp: r.c.comp, props: r.c.props, bed: bed ? `img/${bed}_blur.jpg` : undefined });
    compsUsados.push(r.c.comp);
  }

  const libres = [];
  let cur0 = arrancaEn;
  for (const r of vivas) { if (r.t - cur0 > 1.2) libres.push([cur0, r.t]); cur0 = Math.max(cur0, r.t + r.dur); }
  if (sec.t1 - cur0 > 1.2) libres.push([cur0, sec.t1]);

  let k = 0;
  for (const [li0, li1] of libres) {
    let t = li0;
    while (t < li1 - 0.4) {
      let dur = esc[k % esc.length]; k++;
      const quiereClip = esClip(dur);
      // ⭐ El metraje REAL no está atado a las duraciones de agnes: el archivo dura 8,2 s enteros y
      //    se reproduce a 1×, así que puede llenar CUALQUIER slot de 4,5 s para arriba. Sin esto
      //    sólo entraba en los slots de 4,03/8,07 y el metraje real se quedaba en 9,3 %.
      const admiteReal = dur >= 4.5 && dur <= 9.4;   // el tope real de cada archivo se aplica abajo
      // ⛔⛔ EL CURSOR NO PUEDE COMERSE LOS PLANOS QUE SALTEA (rkfob: 7 de 13 planos del hook nunca
      //    se montaron). Se lleva un set de USADOS; los salteados quedan disponibles.
      usadosPool[sec.sec] ||= new Set();
      const used = usadosPool[sec.sec];
      if (used.size >= pool.length) used.clear();
      const forz = (cfg.ORDEN_FORZADO[sec.sec] || []).find((id) => !used.has(id));
      let elegido = forz ? pool.find((c) => c.id === forz) : null;
      if (!elegido) {
        // sustantivos de la frase que suena EN ESTA ventana
        const sust = words.filter((w) => w.t >= t && w.t < t + (esc[(k - 1) % esc.length] || 4))
          .map((w) => w.w).filter((w) => w.length > 3 && !VACIAS.has(w));
        const anterior = beats.length ? (beats[beats.length - 1].asset || '') : '';
        // ⛔ y con el puntaje empatado, gana el que CAMBIA DE LUGAR: minutos enteros en el mismo
        //    rincón no los ve ningún número suelto, sólo la hoja de contactos (pinvacas: 50 seguidos).
        const lugarPrev = beats.length ? beats[beats.length - 1].lugar : null;
        // ⭐ el metraje REAL gana los empates: es el 25 % que la vara del pipeline exige y es lo
        //    único del pool que no lo dibujó una máquina.
        const mejorDe = (cands) => cands
          .map((c) => ({ c, s: puntaje(sust, c.tokens) + (c.real ? 0.6 : 0) }))
          .sort((a, b) => b.s - a.s)[0]?.c;
        const libres2 = pool.filter((c) => !used.has(c.id) && !anterior.includes(c.id));
        // ⛔ un item REAL no tiene foto: sólo puede entrar en un slot de CLIP
        const soloFoto = (l) => l.filter((c) => !c.real);
        const clipOk = (c) => c.hayClip && !clipsUsados.has(c.id) && (quiereClip || (c.real && admiteReal));
        elegido = mejorDe(libres2.filter(clipOk))
          || mejorDe(soloFoto(libres2)) || mejorDe(soloFoto(pool.filter((c) => !used.has(c.id))));
        // ⛔ UNA SECCIÓN CORTA DE POOL SE REPITE SOLA. S6 (el dintel) tiene 7 planos para 13 slots:
        //    ciclaba los mismos siete. Cuando el propio pool no aporta NADA a la frase, se busca en
        //    TODO el pool del video el plano que sí comparta sustantivos con lo que se está diciendo
        //    (es la red de rescate de la regla 8: buscar en el pool ENTERO antes de repetir).
        const puntajeDe = (c) => (c ? puntaje(sust, c.tokens) : -1);
        if (puntajeDe(elegido) < 1 && sust.length) {
          const recientes = new Set(beats.slice(-14).map((b) => (b.asset || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '')));
          const global = todos.filter((c) => !recientes.has(c.id) && (c.real ? (admiteReal && !clipsUsados.has(c.id)) : (!quiereClip || (c.hayClip && !clipsUsados.has(c.id)))));
          const g = mejorDe(global);
          if (puntajeDe(g) > puntajeDe(elegido)) elegido = g;
        }
      }
      if (!elegido) { used.clear(); elegido = soloFoto(pool)[0] || pool[0]; }
      if (!elegido) break;
      used.add(elegido.id);

      const usaClip = elegido.hayClip && !clipsUsados.has(elegido.id) && (quiereClip || (elegido.real && admiteReal));
      if (usaClip) clipsUsados.add(elegido.id);
      // ⛔ LA VELOCIDAD SE DECIDE CON LA DURACIÓN PLANEADA, NO CON LA RECORTADA. Medido acá: un slot
      //    de 8,07 (clip a 0,5×) recortado a 7,02 por el borde de sección dejaba de parecerse a 8,07,
      //    el ternario le ponía rate 1 y el plano pedía 7,02 s de una fuente de 4,03 → se CONGELA.
      const esReal = usaClip && elegido.real;
      const rate = usaClip ? (esReal ? 1 : (Math.abs(dur - 8.07) < 0.06 ? 0.5 : 1)) : undefined;
      if (!usaClip) dur = Math.min(dur, CAP_IMG);
      else dur = Math.min(dur, esReal ? (durReal[elegido.id] || 0) : 4.033 / rate);   // nunca más allá del archivo
      dur = Math.min(dur, li1 - t);
      if (dur < 1.2) break;
      beats.push({
        t: +t.toFixed(3), dur: +dur.toFixed(3), sec: sec.sec, lugar: elegido.lugar,
        kind: usaClip ? 'clip' : 'imagen', real: esReal || undefined,
        asset: usaClip ? `broll/${SLUG}${esReal ? '_real' : ''}/${elegido.id}.mp4` : `img/${elegido.id}.jpg`,
        rate,
      });
      t += dur;
    }
  }
}

// ── VENTANAS DE AVATAR: sólo ANTES de AVATAR_END ──────────────────────────
const OBJ_COB_T1 = 0.775;
let quitados = 0;
if (AVATAR_END > 1) {
  const t1 = beats.filter((b) => b.t + b.dur <= AVATAR_END && b.kind !== 'componente');
  const durT1 = t1.reduce((a, b) => a + b.dur, 0);
  let sobra = durT1 - AVATAR_END * OBJ_COB_T1;
  const inicios = new Set(paras.map((p) => +tDeChar(p.s).toFixed(3)));
  const protegidos = new Set(Object.values(cfg.ORDEN_FORZADO).flat());
  const idDe = (a) => (a || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '');
  const candidatos = t1.filter((b) => b.dur <= 6.5 && !(b.asset && protegidos.has(idDe(b.asset))))
    .sort((a, b) => (inicios.has(b.t) ? 1 : 0) - (inicios.has(a.t) ? 1 : 0));
  const paso = Math.max(1, Math.floor(candidatos.length / Math.max(1, Math.ceil(sobra / 4.5))));
  for (let i = 0; i < candidatos.length && sobra > 0; i += paso) { candidatos[i]._quitar = true; sobra -= candidatos[i].dur; quitados++; }
}
const finales = beats.filter((b) => !b._quitar);

// ── cerrar los huecos de la capa base DESPUÉS de AVATAR_END ───────────────
// ⛔ El CTA es OVERLAY: va encima y NO cuenta como cobertura (rkfob: 8,12 s de avatar en bucle debajo).
{
  const OV = new Set(cfg.OVERLAY);
  const base = finales.filter((b) => !(b.kind === 'componente' && OV.has(b.comp))).sort((a, b) => a.t - b.t);
  let cerrados = 0, seg = 0;
  for (let i = 0; i < base.length; i++) {
    const fin = base[i].t + base[i].dur;
    const sig = i + 1 < base.length ? base[i + 1].t : TOTAL;
    if (fin < AVATAR_END - 0.05) continue;
    if (sig - fin > 0.05) { seg += sig - fin; base[i].dur = +(sig - base[i].t).toFixed(3); cerrados++; }
  }
  console.log('huecos de base cerrados en el tramo 2: ' + cerrados + ' (' + seg.toFixed(2) + ' s de avatar en bucle evitados)');
}

// ── MÉTRICAS ──────────────────────────────────────────────────────────────
const durs = finales.filter((b) => b.kind !== 'componente').map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => (durs.length ? durs[Math.min(durs.length - 1, Math.floor(durs.length * p))] : 0);
const OV = new Set(cfg.OVERLAY);
const base = finales.filter((b) => !(b.kind === 'componente' && OV.has(b.comp)));
const cob = (a, b) => base.filter((x) => x.t < b && x.t + x.dur > a)
  .reduce((s, x) => s + (Math.min(b, x.t + x.dur) - Math.max(a, x.t)), 0) / (b - a);

console.log('═'.repeat(74));
console.log('BEATS: ' + finales.length + ' (' + finales.filter((b) => b.kind === 'clip').length + ' clip · ' +
  finales.filter((b) => b.kind === 'imagen').length + ' foto · ' + finales.filter((b) => b.kind === 'componente').length + ' componente)');
console.log('ventanas de avatar abiertas en el tramo 1: ' + quitados);
console.log('PACING  min ' + q(0).toFixed(2) + ' · p25 ' + q(0.25).toFixed(2) + ' · mediana ' + q(0.5).toFixed(2) +
  ' · p75 ' + q(0.75).toFixed(2) + ' · max ' + q(0.999).toFixed(2) + '  (dispersión p25↔p75 ' + (q(0.75) - q(0.25)).toFixed(2) + 's, buena ~1,8)');
console.log('   ≥5s: ' + (durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0) + '% (objetivo ~40)');
console.log('COBERTURA total ' + (cob(0, TOTAL) * 100).toFixed(1) + '%  (piso 90)');
console.log('   tercio 1 ' + (cob(0, TOTAL / 3) * 100).toFixed(1) + '% · tercio 2 ' + (cob(TOTAL / 3, 2 * TOTAL / 3) * 100).toFixed(1) +
  '% · tercio 3 ' + (cob(2 * TOTAL / 3, TOTAL) * 100).toFixed(1) + '%');
if (AVATAR_END < TOTAL - 1) {
  const c2 = cob(AVATAR_END, TOTAL);
  console.log('   ⛔ TRAMO 2 (avatar en bucle) ' + (c2 * 100).toFixed(1) + '%  (piso 95) ' + (c2 >= 0.95 ? '✓' : '⛔'));
}
{
  const segReal = finales.filter((b) => b.real).reduce((a, b) => a + b.dur, 0);
  const segClip = finales.filter((b) => b.kind === 'clip' && !b.real).reduce((a, b) => a + b.dur, 0);
  console.log('METRAJE REAL: ' + finales.filter((b) => b.real).length + ' planos · ' + segReal.toFixed(0) + ' s = ' +
    (segReal / TOTAL * 100).toFixed(1) + '% del video  (piso 25) ' + (segReal / TOTAL >= 0.25 ? '✓' : '⛔') +
    '  · clips de agnes ' + segClip.toFixed(0) + ' s');
}
console.log('COMPONENTES: ' + new Set(compsUsados).size + ' distintos (piso 6) · ' + compsUsados.length + ' usos');
console.log('   ' + [...new Set(compsUsados)].join(' · '));
const primer = base.filter((b) => b.kind !== 'componente').sort((a, b) => a.t - b.t)[0];
console.log('APERTURA: primer b-roll en ' + primer.t.toFixed(2) + 's  (piso ' + APERTURA_MIN + ') ' + (primer.t >= APERTURA_MIN ? '✓' : '⛔'));

const orden = [...base].sort((a, b) => a.t - b.t);
const huecos = []; let cur = 0;
for (const b of orden) { if (b.t - cur >= 6) huecos.push({ t: cur, dur: +(b.t - cur).toFixed(1) }); cur = Math.max(cur, b.t + b.dur); }
if (TOTAL - cur >= 6) huecos.push({ t: cur, dur: +(TOTAL - cur).toFixed(1) });
console.log('HUECOS ≥6 s: ' + huecos.length + (huecos.length ? ' · el mayor ' + Math.max(...huecos.map((h) => h.dur)) + 's' : ''));
for (const h of huecos.slice(0, 15)) {
  const w = words.filter((x) => x.t >= h.t && x.t < h.t + h.dur).map((x) => x.w).slice(0, 12).join(' ');
  console.log('   ' + Math.floor(h.t / 60) + ':' + String(Math.round(h.t % 60)).padStart(2, '0') + '  ' + h.dur + 's' + (h.t >= AVATAR_END ? '  ⛔ TRAMO 2' : '') + '  «' + w + '»');
}
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ total: TOTAL, avatarEnd: AVATAR_END, fps: FPS, beats: finales }, null, 1));
fs.writeFileSync(`_v3/${SLUG}_huecos.json`, JSON.stringify(huecos, null, 1));
console.log('→ _v3/' + SLUG + '_plan.json · _v3/' + SLUG + '_huecos.json');
console.log('═'.repeat(74));
