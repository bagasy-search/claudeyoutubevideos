// gen_rkfob_plan.mjs — BEATSHEET de `rkfob`, anclado al ms del máster real.
//   node gen_rkfob_plan.mjs
//
// ═══ LAS REGLAS QUE ESTE GENERADOR TIENE QUE CUMPLIR (todas medidas, todas dolieron una vez) ═══
//
// 1.bis EL VIDEO ABRE CON EL AVATAR HABLANDO. El primer cue de b-roll no puede empezar antes de
//       max(3 s, fin del primer momento). No se negocia con el gancho.
// PACING NO METRÓNOMO. Si todos los planos duran lo mismo, cansa — y "lento parejo" es el mismo
//       defecto que "rápido parejo" (rkbill: mediana 5,90 = p75 = p90, diez milésimas de spread).
//       Objetivo: mediana 3,5-4,5 s · p75 > 5 s · ~40 % de planos ≥ 5 s · techo 12 s salvo texto.
// COBERTURA ≥ 90 %, medida POR TERCIO. Y el tercio final NO puede ser el más pelado.
// ⛔⛔ DESPUÉS DE AVATAR_END EL AVATAR CORRE EN BUCLE Y SUS LABIOS NO COINCIDEN. Ahí la cobertura
//       tiene que ser ≥ 95 % y NO se abre ninguna ventana de avatar. Ninguna compuerta vieja lo ve:
//       hay imagen, hay avatar, no hay negro — y son minutos de boca desincronizada a la vista.
// TIEMPO DE LECTURA de los componentes: piso 2,8 s + 0,28 s por palabra más allá de 3 (techo 13 s).
//       Los momentos que caen adentro se ABSORBEN, si no el build los recorta contra el vecino.
import fs from 'node:fs';
import { ITEMS } from './_v3/rkfob_prompts.mjs';

const FPS = 30;
const AVATAR_END = 933.845;
const TOTAL = 1409.218;
const APERTURA_MIN = 3.0;             // regla 1.bis
const CAP_IMG = 9.5;                  // techo de foto (subir a 9,5 evita que la escalera larga se recorte)

const words = JSON.parse(fs.readFileSync('_v3/rkfob_words.json', 'utf8'));
const secciones = JSON.parse(fs.readFileSync('_v3/rkfob_secciones.json', 'utf8'));
const guion = fs.readFileSync('canales/rkfob_GUION.txt', 'utf8');

// ── ROL de cada sección → escalera de duraciones ──────────────────────────
// Cicladas para que dos planos seguidos NUNCA duren igual (el defecto de raygarage: un cap único
// hace que TODOS los planos duren lo mismo).
const ROL = {
  S0: 'medio', S1: 'lento', S2: 'rapido', S3: 'medio', S4: 'rapido', S5: 'lento',
  S6: 'medio', S7: 'medio', S8: 'rapido', S9: 'rapido', S10: 'lento', S11: 'lento', S12: 'lento',
};
const ESCALERA = {
  rapido: [2.7, 4.03, 3.4, 5.6, 2.9, 5.2, 3.2, 4.03],
  medio: [3.8, 4.03, 6.4, 5.2, 8.07, 4.03, 5.1, 3.6],
  lento: [8.5, 4.03, 6.2, 8.07, 4.6, 9.2, 4.03, 7.1],
};
// Las duraciones 4,03 y 8,07 son EXACTAS a propósito: son el clip de agnes (121f @60 → setpts 2.0
// = 4,033 s @30) a 1× y a 0,5×. El resto son fotos.
const esClip = (d) => Math.abs(d - 4.03) < 0.06 || Math.abs(d - 8.07) < 0.06;

// ── COMPONENTES: ¶ donde anclan, y sus props ──────────────────────────────
const COMPONENTES = [
  { p: 3, comp: 'BigStat', props: { value: '3:47', unit: 'a.m.', caption: 'Nobody touched a lock.', tone: 'danger' } },
  { p: 9, comp: 'ProcessChips', props: { kicker: 'THIRTY SECONDS', title: 'Put the key to sleep', steps: [{ title: 'Hold the lock button' }, { title: 'Press unlock twice' }, { title: 'Watch the red blink' }, { title: 'Test the handle' }] } },
  { p: 15, comp: 'BigStat', props: { value: 'BATTERY', unit: '', caption: "That's the word in the index. Not 'theft'.", tone: 'brass' } },
  { p: 20, comp: 'MythTruth', props: { kicker: 'WHAT IT IS DOING', myth: "It's asleep in the bowl", truth: 'It transmits until the battery dies' } },
  { p: 27, comp: 'RouteFlow', props: { kicker: 'THE RELAY', title: 'Your key never left the kitchen', steps: [{ label: 'The bowl' }, { label: 'Through the glass' }, { label: 'The bag' }, { label: 'The handle' }, { label: 'Your driveway' }] } },
  { p: 31, comp: 'SplitVs', props: { leftLabel: 'COPY THE KEY', leftValue: 'Dead number', rightLabel: 'MOVE THE KEY', rightValue: 'Every lock works', verdict: "They don't have to break anything." } },
  { p: 33, comp: 'PullQuote', props: { quote: 'You were defeated. Because you left your key talking.', attrib: '— Ray' } },
  { p: 36, comp: 'WorstSpots', props: { kicker: 'WHAT EVERYBODY TELLS ME', title: 'The four that get people', spots: [{ label: "It's an old base model" }, { label: "I've got an alarm" }, { label: 'I park in the garage' }, { label: 'Not in my neighborhood' }] } },
  { p: 46, comp: 'BigStat', props: { value: 'TWO', unit: 'fobs', caption: "You got two. Where's the other one?", tone: 'brass' } },
  { p: 53, comp: 'CheckCard', props: { kicker: 'THE SPARE', title: 'Three things nobody told you', items: [{ text: "Sleep it too — the bag doesn't care which one talks" }, { text: 'Pull the coin cell and tape it inside the drawer' }, { text: "There's a real metal key hiding in the fob" }] } },
  { p: 56, comp: 'CheckCard', props: { kicker: 'WHAT ACTUALLY BLOCKS IT', title: 'Metal, all the way round', items: [{ text: 'A tin with the lid ON' }, { text: 'A pouch — but test it' }, { text: 'A box with the lid off is a bowl' }] } },
  { p: 59, comp: 'RayChecklist', props: { kicker: 'TWENTY SECONDS', title: 'Test the thing you trust', items: [{ text: 'Key in the tin, lid on' }, { text: 'Walk to the car' }, { text: 'Pull the handle' }, { text: "If it opens, it doesn't work" }] } },
  { p: 65, comp: 'RayChecklist', props: { kicker: 'IN A PARKING LOT', title: 'No chirp? Go back.', items: [{ text: 'You pressed lock' }, { text: 'Nothing flashed' }, { text: "Don't shrug" }, { text: 'Walk back and pull the handle' }] } },
  { p: 70, comp: 'RouteFlow', props: { kicker: 'WHAT ACTUALLY LEAVES', title: 'It stops being a car job', steps: [{ label: 'The truck' }, { label: 'The key' }, { label: 'The garage remote' }, { label: 'Your address' }, { label: 'Your front door' }] } },
  { p: 72, comp: 'BigStat', props: { value: '4 days', unit: 'and eleven phone calls', caption: 'Against thirty seconds and a button you already own.', tone: 'danger' } },
  { p: 74, comp: 'PullQuote', props: { quote: 'Ray, was there something I was supposed to know?', attrib: '— a customer, in her own doorway' } },
  { p: 77, comp: 'RayCta', props: { eyebrow: 'BEFORE YOU FORGET', title: 'The Thousand Dollar Afternoon', sub: 'The one-afternoon door, the eleven-o-clock phone call, and thirty-seven fixes that cost nothing.', domain: 'raykessler.vercel.app', showQr: true, qr: 'img/rkfob_qr.png' } },
  { p: 79, comp: 'BigStat', props: { value: '40', unit: 'seconds', caption: 'They heard nothing, and they left.', tone: 'brass' } },
];
// tiempo de lectura: piso 2,8 s + 0,28 s por palabra más allá de 3, techo 13 s
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
const tDeChar = (c) => { const w = words.find(x => x.c0 >= c); return w ? w.t : TOTAL; };
const tPara = (n) => tDeChar(paras[n - 1].s);
// La regla 1.bis dice "hasta el fin del primer MOMENTO, piso 3 s" — un momento es una FRASE, no un
// párrafo entero. Con el párrafo el b-roll no entraba hasta los 14,4 s y el gancho se quedaba sin
// la cámara de seguridad justo cuando se la está describiendo.
const tFinPrimeraFrase = (t0) => {
  const m = guion.match(/^[^.!?]*[.!?]/);
  return m ? Math.max(t0, tDeChar(m[0].length)) : t0 + 3;
};

// ⛔ EL HOOK Y EL CIERRE SON UNA SECUENCIA, NO UN POOL. Los planos de la cámara de vigilancia
//    cuentan una historia en orden (la entrada → los dos hombres subiendo → el de la ventana → la
//    mano en la manija → se van). Si el reparto round-robin los intercala con otros planos, deja
//    de leerse como metraje y pasa a ser una colección de fotos nocturnas. Estos van PRIMERO y EN
//    ESTE ORDEN; el resto de la sección sigue con el reparto normal.
const ORDEN_FORZADO = {
  S0: ['rkfob_s0_01', 'rkfob_s0_02', 'rkfob_s0_03', 'rkfob_s0_04', 'rkfob_s0_05', 'rkfob_s0_06'],
  S4: ['rkfob_s4_02', 'rkfob_s4_03', 'rkfob_s4_04'],
  S12: ['rkfob_s12_01', 'rkfob_s12_02', 'rkfob_s12_03'],
};

// ── pool por sección ──────────────────────────────────────────────────────
const clipsEnDisco = new Set(fs.readdirSync('public/broll/rkfob').filter(f => f.endsWith('.mp4')).map(f => f.replace(/\.mp4$/, '')));
const poolPorSec = {};
for (const it of ITEMS) (poolPorSec[it.sec] ||= []).push({ id: 'rkfob_' + it.id, lugar: it.lugar, hayClip: clipsEnDisco.has('rkfob_' + it.id) });

// ── armado de beats ───────────────────────────────────────────────────────
const beats = [];
const compsUsados = [];
let cursorPool = {};
const usadosPool = {};

for (const sec of secciones) {
  const esc = ESCALERA[ROL[sec.sec]];
  const pool = poolPorSec[sec.sec] || [];
  cursorPool[sec.sec] = 0;
  // componentes que caen en esta sección
  const comps = COMPONENTES.filter(c => c.p >= sec.p0 && c.p <= sec.p1)
    .map(c => ({ ...c, t: tPara(c.p), dur: lectura(c.props) }))
    .sort((a, b) => a.t - b.t);

  // ⛔⛔ LOS COMPONENTES SE RESERVAN PRIMERO, Y LOS PLANOS SE TEJEN ALREDEDOR.
  //    La primera versión los buscaba mientras avanzaba el cursor (`t <= x.t+1.2 && t >= x.t-3`):
  //    si la escalera de duraciones pasaba de largo esa ventana, el componente **desaparecía sin
  //    avisar**. Medido acá: se perdieron 5 de 18, y uno era el `RayCta` — el CTA del video entero.
  //    Un generador que puede tirar un componente en silencio es el mismo defecto que una compuerta
  //    que da verde sin mirar.
  const arrancaEn = sec.sec === 'S0'
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
  // sin solapes entre componentes
  for (let i = 1; i < reservas.length; i++) {
    const prev = reservas[i - 1];
    if (reservas[i].t < prev.t + prev.dur) reservas[i].t = prev.t + prev.dur;
    reservas[i].dur = Math.min(reservas[i].dur, sec.t1 - reservas[i].t);
  }
  const vivas = reservas.filter(r => r.dur >= 2.4);
  if (vivas.length !== comps.length) {
    console.error('⛔ ' + sec.sec + ': ' + (comps.length - vivas.length) + ' componente(s) no entran en la sección');
    process.exit(4);
  }
  for (const r of vivas) {
    const bed = pool.length ? pool[cursorPool[sec.sec] % pool.length].id : null;
    beats.push({ t: +r.t.toFixed(3), dur: +r.dur.toFixed(3), kind: 'componente', sec: sec.sec, comp: r.c.comp, props: r.c.props, bed: bed ? `img/${bed}_blur.jpg` : undefined });
    compsUsados.push(r.c.comp);
  }
  // intervalos LIBRES de la sección (lo que queda entre reservas)
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
    // elegir asset: si quiere clip, buscar uno que tenga clip
    // ⛔⛔ EL CURSOR NO PUEDE COMERSE LOS PLANOS QUE SALTEA.
    //    La primera versión hacía `cursor += intento + 1` al buscar un plano CON clip: los que
    //    saltaba en el camino quedaban consumidos y no se usaban NUNCA. Medido acá: 7 de los 13
    //    planos del tratamiento de cámara de vigilancia — que a propósito no tienen clip — se
    //    cayeron del video entero, incluido casi todo el hook que el creador pidió explícitamente.
    //    ✅ Se lleva un set de USADOS por sección; se elige el primer no-usado que cumpla, y los
    //    salteados quedan disponibles para el próximo plano que sí los pueda tomar.
    usadosPool[sec.sec] ||= new Set();
    const used = usadosPool[sec.sec];
    if (used.size >= pool.length) used.clear();
    // primero, lo que la sección tiene FORZADO y todavía no salió (ignora la preferencia de clip:
    // estos planos no tienen clip a propósito y la secuencia manda sobre el tratamiento)
    const forz = (ORDEN_FORZADO[sec.sec] || []).find(id => !used.has(id));
    let elegido = forz ? pool.find(c => c.id === forz) : null;
    if (!elegido) elegido = pool.find(c => !used.has(c.id) && (!quiereClip || c.hayClip))
      || pool.find(c => !used.has(c.id));
    if (!elegido) { used.clear(); elegido = pool[0]; }
    if (!elegido) break;
    used.add(elegido.id);

    const usaClip = quiereClip && elegido.hayClip;
    if (!usaClip) dur = Math.min(dur, CAP_IMG);
    dur = Math.min(dur, li1 - t);
    if (dur < 1.2) break;
    beats.push({
      t: +t.toFixed(3), dur: +dur.toFixed(3), sec: sec.sec, lugar: elegido.lugar,
      kind: usaClip ? 'clip' : 'imagen',
      asset: usaClip ? `broll/rkfob/${elegido.id}.mp4` : `img/${elegido.id}.jpg`,
      rate: usaClip ? (Math.abs(dur - 8.07) < 0.3 ? 0.5 : 1) : undefined,
    });
    t += dur;
  }
  }
}

// ── VENTANAS DE AVATAR: sólo ANTES de AVATAR_END ──────────────────────────
// Después el avatar está en bucle y sus labios no coinciden: ahí no se abre ninguna.
const OBJ_COB_T1 = 0.72;      // dejamos ~28 % del tramo 1 para que se vea su cara
let quitados = 0;
{
  const t1 = beats.filter(b => b.t + b.dur <= AVATAR_END && b.kind !== 'componente');
  const durT1 = t1.reduce((a, b) => a + b.dur, 0);
  const objetivo = AVATAR_END * OBJ_COB_T1;
  let sobra = durT1 - objetivo;
  // se sacan planos repartidos, preferentemente al INICIO de un párrafo (lee como cambio de idea)
  const inicios = new Set(paras.map(p => +tDeChar(p.s).toFixed(3)));
  // ⛔ LOS PLANOS DE LA SECUENCIA FORZADA NO SE PUEDEN SACAR. Al abrir ventanas de avatar, el
  //    reparto eligió sacar justo el plano del hombre con la bolsa contra la ventana — el plano
  //    del hook — y lo dejó fuera del video. Una ventana de avatar se abre en cualquier lado;
  //    ese plano, no.
  const protegidos = new Set(Object.values(ORDEN_FORZADO).flat());
  const idDe = (a) => (a || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '');
  const candidatos = t1.filter(b => b.dur <= 6.5 && !(b.asset && protegidos.has(idDe(b.asset)))).sort((a, b) => {
    const ai = inicios.has(b.t) ? 1 : 0, bi = inicios.has(a.t) ? 1 : 0;
    return ai - bi;
  });
  const paso = Math.max(1, Math.floor(candidatos.length / Math.max(1, Math.ceil(sobra / 4.5))));
  for (let i = 0; i < candidatos.length && sobra > 0; i += paso) {
    candidatos[i]._quitar = true; sobra -= candidatos[i].dur; quitados++;
  }
}
const finales = beats.filter(b => !b._quitar);

// ── ⛔⛔ CERRAR LOS HUECOS DE LA CAPA BASE DESPUÉS DE AVATAR_END ───────────
// Ahí el avatar corre en BUCLE y sus labios no coinciden: medio segundo de su cara con la boca
// fuera de sincronía se ve igual. Los huecos salen de dos lados: el borde entre secciones (la
// escalera de duraciones no llega justo al límite) y el final del video.
// ⛔ El RayCta NO cuenta como cobertura: es un OVERLAY, va encima y no tapa nada. Medirlo como
//    beat es lo que dejó pasar 8,12 s de avatar en bucle debajo del CTA.
{
  const OV = new Set(['RayCta']);
  const base = finales.filter(b => !(b.kind === 'componente' && OV.has(b.comp)))
    .sort((a, b) => a.t - b.t);
  let cerrados = 0, seg = 0;
  for (let i = 0; i < base.length; i++) {
    const fin = base[i].t + base[i].dur;
    const sig = i + 1 < base.length ? base[i + 1].t : TOTAL;
    if (fin < AVATAR_END - 0.05) continue;          // antes de AVATAR_END la cara SÍ puede verse
    if (sig - fin > 0.05) { seg += sig - fin; base[i].dur = +(sig - base[i].t).toFixed(3); cerrados++; }
  }
  console.log('huecos de base cerrados en el tramo 2: ' + cerrados + ' (' + seg.toFixed(2) + ' s de avatar en bucle evitados)');
}

// ── MÉTRICAS ──────────────────────────────────────────────────────────────
const durs = finales.filter(b => b.kind !== 'componente').map(b => b.dur).sort((a, b) => a - b);
const q = (p) => durs.length ? durs[Math.min(durs.length - 1, Math.floor(durs.length * p))] : 0;
const cob = (a, b) => {
  const d = finales.filter(x => x.t < b && x.t + x.dur > a)
    .reduce((s, x) => s + (Math.min(b, x.t + x.dur) - Math.max(a, x.t)), 0);
  return d / (b - a);
};
console.log('═'.repeat(74));
console.log('BEATS: ' + finales.length + ' (' + finales.filter(b => b.kind === 'clip').length + ' clip · ' +
  finales.filter(b => b.kind === 'imagen').length + ' foto · ' + finales.filter(b => b.kind === 'componente').length + ' componente)');
console.log('ventanas de avatar abiertas en el tramo 1: ' + quitados);
console.log('');
console.log('PACING  mediana ' + q(0.5).toFixed(2) + 's (3,5-4,5) · p75 ' + q(0.75).toFixed(2) + 's (>5) · ' +
  '≥5s: ' + (durs.filter(d => d >= 5).length / durs.length * 100).toFixed(0) + '% (~40) · max ' + q(0.999).toFixed(2) + 's');
console.log('COBERTURA total ' + (cob(0, TOTAL) * 100).toFixed(1) + '%');
console.log('   tercio 1 ' + (cob(0, TOTAL / 3) * 100).toFixed(1) + '% · tercio 2 ' + (cob(TOTAL / 3, 2 * TOTAL / 3) * 100).toFixed(1) +
  '% · tercio 3 ' + (cob(2 * TOTAL / 3, TOTAL) * 100).toFixed(1) + '%');
const cobT2 = cob(AVATAR_END, TOTAL);
console.log('   ⛔ TRAMO 2 (avatar en bucle) ' + (cobT2 * 100).toFixed(1) + '%  (piso 95) ' + (cobT2 >= 0.95 ? '✓' : '⛔'));
console.log('COMPONENTES: ' + new Set(compsUsados).size + ' distintos · ' + compsUsados.length + ' usos');
console.log('   ' + [...new Set(compsUsados)].join(' · '));
const primer = finales.filter(b => b.kind !== 'componente').sort((a, b) => a.t - b.t)[0];
console.log('APERTURA: primer b-roll en ' + primer.t.toFixed(2) + 's  (piso ' + APERTURA_MIN + ') ' + (primer.t >= APERTURA_MIN ? '✓' : '⛔'));

// huecos ≥6 s, con la frase que se está diciendo adentro
const orden = [...finales].sort((a, b) => a.t - b.t);
const huecos = []; let cur = 0;
for (const b of orden) { if (b.t - cur >= 6) huecos.push({ t: cur, dur: +(b.t - cur).toFixed(1) }); cur = Math.max(cur, b.t + b.dur); }
if (TOTAL - cur >= 6) huecos.push({ t: cur, dur: +(TOTAL - cur).toFixed(1) });
console.log('');
console.log('HUECOS ≥6 s: ' + huecos.length);
for (const h of huecos.slice(0, 20)) {
  const w = words.filter(x => x.t >= h.t && x.t < h.t + h.dur).map(x => x.w).slice(0, 14).join(' ');
  const tr = h.t >= AVATAR_END ? '  ⛔ TRAMO 2' : '';
  console.log('   ' + Math.floor(h.t / 60) + ':' + String(Math.round(h.t % 60)).padStart(2, '0') + '  ' + h.dur + 's' + tr + '  «' + w + '»');
}
fs.writeFileSync('_v3/rkfob_plan.json', JSON.stringify({ total: TOTAL, avatarEnd: AVATAR_END, fps: FPS, beats: finales }, null, 1));
fs.writeFileSync('_v3/rkfob_huecos.json', JSON.stringify(huecos, null, 1));
console.log('');
console.log('→ _v3/rkfob_plan.json · _v3/rkfob_huecos.json');
console.log('═'.repeat(74));
