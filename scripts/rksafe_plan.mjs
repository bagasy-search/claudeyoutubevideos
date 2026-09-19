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

const esClip = (d) => Math.abs(d - 4.03) < 0.06 || Math.abs(d - 8.07) < 0.06;

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
});

// ── armado de beats ───────────────────────────────────────────────────────
const beats = [];
const compsUsados = [];
const usadosPool = {};
const cursorPool = {};

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
    const bed = pool.length ? pool[cursorPool[sec.sec] % pool.length].id : null;
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
      // ⛔⛔ EL CURSOR NO PUEDE COMERSE LOS PLANOS QUE SALTEA (rkfob: 7 de 13 planos del hook nunca
      //    se montaron). Se lleva un set de USADOS; los salteados quedan disponibles.
      usadosPool[sec.sec] ||= new Set();
      const used = usadosPool[sec.sec];
      if (used.size >= pool.length) used.clear();
      const forz = (cfg.ORDEN_FORZADO[sec.sec] || []).find((id) => !used.has(id));
      let elegido = forz ? pool.find((c) => c.id === forz) : null;
      if (!elegido) elegido = pool.find((c) => !used.has(c.id) && (!quiereClip || c.hayClip)) || pool.find((c) => !used.has(c.id));
      if (!elegido) { used.clear(); elegido = pool[0]; }
      if (!elegido) break;
      used.add(elegido.id);

      const usaClip = quiereClip && elegido.hayClip;
      // ⛔ LA VELOCIDAD SE DECIDE CON LA DURACIÓN PLANEADA, NO CON LA RECORTADA. Medido acá: un slot
      //    de 8,07 (clip a 0,5×) recortado a 7,02 por el borde de sección dejaba de parecerse a 8,07,
      //    el ternario le ponía rate 1 y el plano pedía 7,02 s de una fuente de 4,03 → se CONGELA.
      const rate = usaClip ? (Math.abs(dur - 8.07) < 0.06 ? 0.5 : 1) : undefined;
      if (!usaClip) dur = Math.min(dur, CAP_IMG);
      else dur = Math.min(dur, 4.033 / rate);       // nunca más allá del archivo
      dur = Math.min(dur, li1 - t);
      if (dur < 1.2) break;
      beats.push({
        t: +t.toFixed(3), dur: +dur.toFixed(3), sec: sec.sec, lugar: elegido.lugar,
        kind: usaClip ? 'clip' : 'imagen',
        asset: usaClip ? `broll/${SLUG}/${elegido.id}.mp4` : `img/${elegido.id}.jpg`,
        rate,
      });
      t += dur;
    }
  }
}

// ── VENTANAS DE AVATAR: sólo ANTES de AVATAR_END ──────────────────────────
const OBJ_COB_T1 = 0.755;
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
