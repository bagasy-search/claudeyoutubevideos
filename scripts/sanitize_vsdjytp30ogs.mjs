/**
 * sanitize_vsdjytp30ogs.mjs — dos arreglos que sólo se ven DESPUÉS de renderizar:
 *
 *  1. TEXTOS HEREDADOS: todos los componentes de FedererKit tienen sus defaults escritos para el
 *     video del ROMERO ("Semana 12 · Ritual de romero", "El secreto ya crece en su jardín",
 *     "Estudio clínico · 12 semanas", centerLabel "Romero"…). Cualquier prop de texto que el
 *     director no haya pasado sale con el texto de OTRO video. Acá se rellena TODO prop de texto
 *     con un valor propio de ESTE video. Lo cazó la cuadrícula del auditor en un FedBeforeAfter.
 *  2. TILDES Y EÑES: los directores escribieron varios rótulos sin acentos ("anios", "Ruben",
 *     "Despues del banio"). En pantalla se leen mal.
 */
import fs from 'node:fs';

const SLUG = 'vsdjytp30ogs';
const F = `src/VideoEdit/beats_${SLUG}.ts`;
let src = fs.readFileSync(F, 'utf8');
const beats = JSON.parse(src.match(/export const BEATS: VBeat\[\] = ([\s\S]*);\n$/)[1]);

/* ------------------------- 1 · textos por componente -------------------- */
// campos de texto que cada componente pinta, y el relleno propio de ESTE video
const RELLENO = {
  FedChapter: {kicker: 'Capítulo', index: '01', title: 'Las manos', sub: 'Lo que la piel del dorso cuenta'},
  FedHero: {kicker: 'Manos después de los 60', title: 'El dorso envejece distinto', sub: ''},
  FedStat: {kicker: 'El dato', value: 1, suffix: '', prefix: '', decimals: 0, label: 'en el dorso de la mano', sub: ''},
  FedQuote: {kicker: 'Dr. Federer', quote: 'La mancha no la hizo el tiempo. La hizo la luz.', author: 'Dr. Federer', role: 'Federer Archivos'},
  FedMolecule: {kicker: 'Cómo funciona', title: 'El mecanismo', sub: '', centerLabel: 'Regaliz', nodes: [{label: 'Glabridina'}, {label: 'Tirosinasa'}, {label: 'Pigmento'}]},
  FedStep: {step: 1, total: 5, title: 'El paso', sub: ''},
  FedBeforeAfter: {kicker: 'La comparación', title: 'Mirá la diferencia', labelA: 'Antes', labelB: 'Después'},
  FedChecklist: {kicker: 'Para tener a mano', title: 'Lo importante', items: ['—']},
  FedCta: {kicker: 'Empezá hoy', title: 'Tus manos te lo van a agradecer', sub: 'Las cantidades exactas, en la descripción.', buttonLabel: 'Suscribite al canal'},
  FedLowerThird: {name: 'Dr. Federer', role: 'Médico · +10 años de consultorio', topic: 'Federer Archivos'},
  FedFullShot: {},
};

let rellenados = 0;
for (const b of beats) {
  const r = RELLENO[b.comp];
  if (!r) continue;
  b.props = b.props || {};
  for (const [k, v] of Object.entries(r)) {
    const cur = b.props[k];
    const vacio =
      cur === undefined ||
      cur === null ||
      (typeof cur === 'string' && cur.trim() === '') ||
      (Array.isArray(cur) && cur.length === 0);
    if (vacio) {
      b.props[k] = v;
      rellenados++;
    }
  }
  // FedMolecule: máximo 4 nodos, y cada uno tiene que ser {label}
  if (b.comp === 'FedMolecule' && Array.isArray(b.props.nodes)) {
    b.props.nodes = b.props.nodes
      .slice(0, 4)
      .map((n) => (typeof n === 'string' ? {label: n} : n))
      .filter((n) => n && typeof n.label === 'string' && n.label.trim());
    if (!b.props.nodes.length) b.props.nodes = RELLENO.FedMolecule.nodes;
  }
  // FedChecklist: máximo 4 items, strings no vacíos
  if (b.comp === 'FedChecklist' && Array.isArray(b.props.items)) {
    b.props.items = b.props.items
      .map((i) => (typeof i === 'string' ? i : i?.title || i?.label || ''))
      .filter((s) => s && s.trim())
      .slice(0, 4);
    if (!b.props.items.length) b.props.items = RELLENO.FedChecklist.items;
  }
  // FedStat: value tiene que ser número
  if (b.comp === 'FedStat' && typeof b.props.value !== 'number') {
    const n = Number(String(b.props.value ?? '').replace(/[^\d.]/g, ''));
    b.props.value = Number.isFinite(n) && n !== 0 ? n : 1;
  }
  // FedHero: `hot` tiene que ser array de palabras que ESTÉN en el título
  if (Array.isArray(b.props.hot)) {
    const t = String(b.props.title || '').toLowerCase();
    b.props.hot = b.props.hot.filter((w) => typeof w === 'string' && t.includes(w.toLowerCase()));
  }
}

/* ------------- 1.5 · un .mp4 NUNCA puede ir en un prop de IMAGEN -------- */
// `image`/`imageA`/`imageB` los pinta <Img>: un .mp4 ahí da "EncodingError: The source image
// cannot be decoded" y mata el chunk entero. Pasaba con los beats de b-roll montados con tarjeta
// (FedHero) y con los componentes a los que se les inyectó el asset vecino. Sólo `src` de
// FedFullShot con video:true admite un .mp4.
const imgPool = beats
  .map((b) => b.props?.src)
  .filter((p) => typeof p === 'string' && /^img\/.+\.(jpg|png)$/.test(p));
const cercana = (start) => {
  let best = imgPool[0] || null;
  let bd = Infinity;
  for (const b of beats) {
    const p = b.props?.src;
    if (typeof p !== 'string' || !/^img\/.+\.(jpg|png)$/.test(p)) continue;
    const d = Math.abs(b.start - start);
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
};
let mp4EnImagen = 0;
for (const b of beats) {
  if (!b.props) continue;
  for (const f of ['image', 'imageA', 'imageB', 'bg', 'poster']) {
    const v = b.props[f];
    if (typeof v === 'string' && /\.(mp4|webm|mov)$/i.test(v)) {
      const n = cercana(b.start);
      if (n) b.props[f] = n;
      else delete b.props[f];
      mp4EnImagen++;
    }
  }
  // y al revés: un FedFullShot con src de video tiene que declarar video:true
  if (b.comp === 'FedFullShot' && typeof b.props.src === 'string') {
    b.props.video = /\.(mp4|webm|mov)$/i.test(b.props.src);
  }
}
console.log(`.mp4 sacados de props de imagen: ${mp4EnImagen}`);

/* ---------------------------- 2 · tildes y eñes ------------------------- */
const FIX = [
  [/\banios\b/g, 'años'], [/\bAnios\b/g, 'Años'], [/\banio\b/g, 'año'], [/\bAnio\b/g, 'Año'],
  [/\bbanio\b/g, 'baño'], [/\bBanio\b/g, 'Baño'], [/\bmanana\b/g, 'mañana'], [/\bManana\b/g, 'Mañana'],
  [/\bsenal\b/g, 'señal'], [/\bSenal\b/g, 'Señal'], [/\bsenales\b/g, 'señales'], [/\bSenales\b/g, 'Señales'],
  [/\bRuben\b/g, 'Rubén'], [/\bdespues\b/g, 'después'], [/\bDespues\b/g, 'Después'],
  [/\bdias\b/g, 'días'], [/\bDias\b/g, 'Días'], [/\besta igual\b/g, 'está igual'],
  [/\blampara\b/g, 'lámpara'], [/\bLampara\b/g, 'Lámpara'], [/\bmedico\b/g, 'médico'], [/\bMedico\b/g, 'Médico'],
  [/\bmas\b/g, 'más'], [/\bMas\b/g, 'Más'], [/\baqui\b/g, 'aquí'], [/\bpiel mas\b/g, 'piel más'],
  [/\bnumero\b/g, 'número'], [/\bNumero\b/g, 'Número'], [/\bquimica\b/g, 'química'],
  [/\bproteccion\b/g, 'protección'], [/\bProteccion\b/g, 'Protección'],
  [/\bcirculacion\b/g, 'circulación'], [/\bCirculacion\b/g, 'Circulación'],
  [/\boclusion\b/g, 'oclusión'], [/\bOclusion\b/g, 'Oclusión'],
  [/\balgodon\b/g, 'algodón'], [/\bAlgodon\b/g, 'Algodón'],
  [/\bmancha aburrida\b/g, 'mancha aburrida'],
];
let arreglos = 0;
const fixStr = (s) => {
  let o = s;
  for (const [re, to] of FIX) o = o.replace(re, to);
  if (o !== s) arreglos++;
  return o;
};
const walk = (v) => {
  if (typeof v === 'string') return fixStr(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = k === 'src' || k === 'image' || k === 'imageA' || k === 'imageB' ? x : walk(x);
    return o;
  }
  return v;
};
for (let i = 0; i < beats.length; i++) beats[i] = walk(beats[i]);

fs.writeFileSync(
  F,
  src.replace(/export const BEATS: VBeat\[\] = [\s\S]*;\n$/, `export const BEATS: VBeat[] = ${JSON.stringify(beats, null, 1)};\n`),
  'utf8'
);

// control: ¿queda algo del video del romero?
const txt = JSON.stringify(beats);
const fugas = ['omero', 'jardín', 'Rosmarinus', 'carnósico', 'Semana 12'].filter((s) => txt.includes(s));
console.log(`props de texto rellenados: ${rellenados}`);
console.log(`strings con tildes/eñes corregidas: ${arreglos}`);
console.log(fugas.length ? `⚠ quedan referencias al video viejo: ${fugas.join(', ')}` : '✅ sin textos heredados del video del romero');
