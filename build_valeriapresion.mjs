// build_valeriapresion.mjs — Doctora Valeria Alcázar · "NUNCA TOMES las pastillas para la PRESIÓN a ESTA HORA"
// Kit valeria-vintage (editorial claro). DIRECTOR + generador: escenas ancladas al ms de Whisper.
//   Motor: L0 avatar persistente EN BUCLE Y MUDO + <Audio> master aparte + escenas Val* opacas.
//   Avatar real = 0..584.5s (leyó la parte A del guion). 584.5..1880.6s = voz Fish clonada.
//   => En la zona Fish los labios NO sincronizan: cobertura visual ~100% y el avatar sólo como fondo.
//   B-roll: 432 clips + 432 fotos agnes (prefijo vp_), uno por beat de la grilla.
//   CTA = RETENCIÓN (guardar/suscribir/medidas en descripción). SIN QR, sin precio ni link en voz.
import fs from 'fs';

const SLUG = 'valeriapresion';
const PFX = 'vp_';
const TOTAL = 1880.61;          // master de audio (avatar + Fish)
const AVATAR_END = 584.53;      // fin del avatar real
const CLIP_DUR = 4.04;          // 97 frames @24 -> lo que devuelve agnes
const CAP_COMP = 6.5;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, 'utf8').replace(/^﻿/, ''));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const W = caps.map((c) => ({n: norm(c.text), ms: c.startMs}));
function at(phrase) {
  const t = norm(phrase).split(' ');
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return +(W[i].ms / 1000).toFixed(2);
  }
  return null;
}
let missing = 0;
const atc = (p) => { const v = at(p); if (v == null) { console.warn('anchor NO encontrado:', p); missing++; } return v; };

const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, 'utf8').replace(/^﻿/, ''));
const haveVid = (id) => fs.existsSync(`public/broll/${PFX}${id}.mp4`);
const havePhoto = (id) => fs.existsSync(`public/img/${PFX}${id}.jpg`) || fs.existsSync(`public/img/${PFX}${id}.png`);
const photoPath = (id) => (fs.existsSync(`public/img/${PFX}${id}.jpg`) ? `img/${PFX}${id}.jpg` : `img/${PFX}${id}.png`);

/* ===================== PLAN DEL DIRECTOR (componentes) ===================== */
// Cada componente reemplaza el b-roll de su beat. Anclado a la frase EXACTA del transcript.
const COMP = [];
const C = (phrase, kind, props = {}, dur = CAP_COMP) => {
  const start = phrase === 0 ? 0 : atc(phrase);
  if (start == null) return;
  COMP.push({start, dur, kind, ...props});
};

// — apertura
C(0, 'talk', {title: 'Nunca tome la pastilla de la tensión a esta hora', hot: ['a esta hora'], kicker: 'Dra. Valeria Alcázar'}, 5.5);

// — las cinco pistas = divisores de capítulo
C('Primera pista', 'chapter', {index: 'Pista 1', title: 'El blíster encima del microondas', sub: 'La hora que no era una hora'}, 6.5);
C('Segunda pista', 'chapter', {index: 'Pista 2', title: 'El vaso de zumo', sub: 'Un desayuno que peleaba contra la pastilla'}, 6.5);
C('Tercera pista', 'chapter', {index: 'Pista 3', title: 'La libreta', sub: 'Dos años de números falsos'}, 6.5);
C('Cuarta pista', 'chapter', {index: 'Pista 4', title: 'Los huecos en el blíster', sub: 'Las dosis que faltaban'}, 6.5);
C('Quinta pista', 'chapter', {index: 'Pista 5', title: 'La caída de febrero', sub: 'Lo que no le contó a nadie'}, 6.5);

// — mecanismo del reloj interno
C('entre un diez y un veinte por ciento', 'stat', {value: 20, suffix: '%', label: 'Lo que debe BAJAR su tensión mientras duerme', sub: 'A eso se le llama ser descendedor', mood: 'sage'}, 6.0);
C('late unas cien mil veces al dia', 'stat', {value: 100000, label: 'Latidos al día, todos los días', sub: 'El corazón no se jubila', mood: 'gold'}, 6.0);
C('Suelta cortisol', 'molecule', {centerLabel: 'Ascenso matutino', nodes: [{label: 'Cortisol'}, {label: 'Adrenalina'}, {label: 'Vasos estrechos'}, {label: 'Sangre espesa'}], sub: 'Su cuerpo se prepara para despertarse desde las cuatro'}, 6.5);
C('La mayoria ocurre entre las seis y las doce', 'stat', {value: 40, suffix: '%', prefix: '+', label: 'Más infartos entre las 6 y las 12 de la mañana', sub: 'La franja más peligrosa del día', mood: 'terracotta'}, 6.5);

// — pista 1: la hora
C('Y aqui esta el error numero uno', 'hero', {kicker: 'Error 1', title: 'No tener una hora. Tener un rato.', sub: 'El valle del medicamento se mueve con usted', mood: 'terracotta'}, 6.0);
C('esa pastilla se toma por la mañana', 'lowerthird', {title: 'Diuréticos: SIEMPRE por la mañana', sub: 'Nunca después de la merienda'}, 5.5);
C('La mejor hora no es la que dice internet', 'quote', {quote: 'La mejor hora es la que usted puede repetir los 365 días del año.', author: 'Dra. Valeria Alcázar'}, 6.5);

// — pista 2: el desayuno (carrusel de los cuatro enemigos)
const CARDS = [
  {index: 'N.º 01', name: 'Pomelo', tag: 'Bloquea la enzima', img: 'b132'},
  {index: 'N.º 02', name: 'Sal de potasio', tag: 'El bote azul', img: 'b143'},
  {index: 'N.º 03', name: 'Regaliz', tag: 'La infusión de la noche', img: 'b159'},
  {index: 'N.º 04', name: 'Antiinflamatorio', tag: 'El de todos los días', img: 'b168'},
];
const cardImgs = () => CARDS.map((c) => ({index: c.index, name: c.name, tag: c.tag, image: havePhoto(c.img) ? photoPath(c.img) : photoPath('b001')}));
C('Empecemos por el pomelo', 'carousel', {cards: cardImgs(), focus: 0, intro: true, title: 'Lo que pelea contra su pastilla'}, 6.5);
C('Sigamos con el bote azul', 'carousel', {cards: cardImgs(), focus: 1, intro: false, title: 'Lo que pelea contra su pastilla'}, 6.0);
C('Vamos con la infusion de la noche', 'carousel', {cards: cardImgs(), focus: 2, intro: false, title: 'Lo que pelea contra su pastilla'}, 6.0);
C('el ibuprofeno de cada mañana', 'carousel', {cards: cardImgs(), focus: 3, intro: false, title: 'Lo que pelea contra su pastilla'}, 6.0);
C('recomienda quedarse por debajo de 5 gramos al dia', 'stat', {value: 5, suffix: ' g', label: 'Sal al día como máximo', sub: 'Una cucharadita rasa, contando la que ya viene escondida', mood: 'gold'}, 6.0);

// — pista 3: medir mal
C('Medir con la vejiga llena', 'checklist', {title: 'Lo que le falsea la medición', items: ['La vejiga llena', 'El brazo colgando', 'Las piernas cruzadas', 'Sin la espalda apoyada', 'Hablando mientras mide', 'El manguito sobre el jersey'], mood: 'terracotta'}, 6.5);
C('Ahora como se hace bien', 'checklist', {title: 'Cómo se mide de verdad', items: ['Al baño primero', 'Silla con respaldo, pies planos', 'Brazo desnudo a la altura del corazón', 'Cinco minutos quieto y callado', 'Dos mediciones y la media'], mood: 'sage'}, 6.5);
C('su libreta decia 12 y 8', 'beforeafter', {title: 'La misma señora, el mismo día', labelA: 'Su libreta decía', labelB: 'Su cuerpo decía', imageA: havePhoto('b186') ? photoPath('b186') : photoPath('b001'), imageB: havePhoto('b230') ? photoPath('b230') : photoPath('b001')}, 6.5);

// — pista 4: adherencia
C('la mitad de las personas con la tension alta', 'stat', {value: 50, suffix: '%', label: 'No toman su medicación como se la recetaron', sub: 'No es descuido: es lo normal sin un sistema', mood: 'terracotta'}, 6.5);
C('no se tome dos juntas', 'lowerthird', {title: 'Si olvidó una dosis: NUNCA dos juntas', sub: 'Mareo, visión borrosa y caída'}, 5.5);
C('Efecto rebote', 'lowerthird', {title: 'Betabloqueantes: jamás dejarlos de golpe', sub: 'Se retiran con el médico y poco a poco'}, 5.5);

// — CTA de retención (sin precio, sin link hablado)
C('Guarde este video', 'cta', {title: 'Guarde este video', sub: 'Las tres hojas para su médico están escritas en la descripción', buttonLabel: 'Guardar · Suscribirse', items: ['Hoja para medirse en casa', 'Alimentos y medicamentos que interfieren', 'Registro semanal para la consulta']}, 6.5);

// — pista 5: levantarse
C('Primero quedese tumbado', 'step', {step: 1, total: 3, title: 'Tumbado', sub: 'Unos segundos con los ojos abiertos'}, 5.0);
C('Despues sientese en el borde de la cama', 'step', {step: 2, total: 3, title: 'Sentado', sub: 'Cuente hasta treinta moviendo los tobillos'}, 5.0);
C('Y solo entonces pongase de pie', 'step', {step: 3, total: 3, title: 'De pie', sub: 'Una mano apoyada en algo firme'}, 5.0);

// — los dos estudios (honestidad)
C('En 2019 se publico un estudio español enorme', 'stat', {value: 20000, label: 'Pacientes · estudio español de 2019', sub: 'A favor de tomarla de noche', mood: 'sage'}, 6.0);
C('En 2022 se publico otro estudio', 'stat', {value: 21000, label: 'Pacientes · estudio británico de 2022', sub: 'No encontró diferencia — pero confirmó que de noche no es peligroso', mood: 'gold'}, 6.5);

// — el payoff: el aparato de 24 horas
C('se llama monitorizacion ambulatoria', 'hero', {kicker: 'El sexto error', title: 'Monitorización de 24 horas', sub: 'El aparato que mide su tensión mientras usted duerme', image: havePhoto('b349') ? photoPath('b349') : photoPath('b029'), side: 'right', mood: 'gold'}, 6.5);
C('Ese es el sexto error', 'hero', {kicker: 'Error 6', title: 'Decidir todo esto a ciegas', sub: 'Como buscar una gotera mirando el techo a mediodía', mood: 'terracotta'}, 6.0);
C('Seria posible hacerme una monitorizacion', 'quote', {quote: 'Doctor, ¿sería posible hacerme una monitorización de 24 horas para ver cómo tengo la tensión por la noche?', author: 'La frase que hay que llevar a la consulta'}, 7.0);

// — recap y cierre
C('Recapitulemos', 'checklist', {title: 'Los cinco, para llevarse', items: ['Una hora fija — diuréticos por la mañana', 'Cuidado con lo que la acompaña', 'Mídase bien: sentado, callado, dos veces', 'Ni saltarse ni doblar la dosis', 'Levántese en tres pasos'], mood: 'sage'}, 7.0);
C('Porque su tension de noche es la que manda', 'quote', {quote: 'Su tensión de noche es la que manda.', author: 'Dra. Valeria Alcázar'}, 6.0);

// — REFUERZO DE EXPLICACION VISUAL (claims reales del guion, no relleno decorativo)
C('El hervidor silbando', 'lowerthird', {title: '7:12 de la mañana', sub: 'Elena se toma su pastilla, como cada día desde hace nueve años'}, 5.0);
C('nadie le pregunto a Elena a que hora', 'checklist', {title: 'Lo que nadie le preguntó en dos años', items: ['A qué hora se toma la pastilla', 'Con qué se la traga', 'Qué hace su tensión mientras duerme'], mood: 'terracotta'}, 6.5);
C('Su medico tiene siete minutos por paciente', 'stat', {value: 7, suffix: ' min', label: 'Por paciente, con la sala llena', sub: 'En siete minutos se mira un número, y el número miente', mood: 'terracotta'}, 6.0);
C('Su tension no es un numero', 'beforeafter', {title: 'Lo que le miden y lo que pasa de verdad', labelA: 'Una fotografía', labelB: 'Una película de 24 horas', imageA: havePhoto('b051') ? photoPath('b051') : photoPath('b001'), imageB: havePhoto('b053') ? photoPath('b053') : photoPath('b001')}, 6.5);
C('Hay un momento de maxima concentracion', 'molecule', {centerLabel: 'El valle', nodes: [{label: 'Sube'}, {label: 'Máximo'}, {label: 'Baja'}, {label: 'Valle'}], title: 'Toda pastilla tiene un punto flojo', sub: 'Usted no lo puede eliminar: sólo decidir dónde cae'}, 6.5);
C('con el paraguas cerrado', 'quote', {quote: 'Nueve años entrando en la franja más peligrosa del día con el paraguas cerrado.', author: 'El caso de Elena'}, 6.0);
C('El pomelo bloquea una enzima', 'molecule', {centerLabel: 'Enzima bloqueada', nodes: [{label: 'Pomelo'}, {label: 'Intestino'}, {label: 'Hígado'}, {label: 'Se acumula'}], title: 'Por qué la misma pastilla pasa a ser una dosis mayor', sub: 'Amlodipino, felodipino, nifedipino'}, 6.5);
C('les quitan el sodio y le ponen potasio', 'beforeafter', {title: 'La sal que se compra para cuidarse', labelA: 'Dice: bajo en sodio', labelB: 'Trae: potasio', imageA: havePhoto('b143') ? photoPath('b143') : photoPath('b001'), imageB: havePhoto('b146') ? photoPath('b146') : photoPath('b001')}, 6.0);
C('Para bajar la sal de verdad', 'checklist', {title: 'Para bajar la sal sin bote azul', items: ['Limón', 'Ajo', 'Pimentón', 'Comino', 'Orégano', 'Vinagre y hierbas frescas'], mood: 'sage'}, 6.0);
C('retenga sodio y pierda potasio', 'molecule', {centerLabel: 'Regaliz', nodes: [{label: 'Retiene sodio'}, {label: 'Pierde potasio'}, {label: 'Sube la tensión'}], title: 'La tacita de la noche', sub: 'Dele la vuelta a la caja y lea los ingredientes'}, 6.0);
C('Los antiinflamatorios hacen que su cuerpo retenga', 'hero', {kicker: 'El más frecuente', title: 'El antiinflamatorio de cada mañana', sub: 'Retiene líquido y sal, y le quita fuerza a casi toda la medicación', mood: 'terracotta'}, 6.0);
C('antes de subirle la dosis a nadie', 'quote', {quote: 'Muchas veces el problema no está en la pastilla: está en lo que la rodea.', author: 'Dra. Valeria Alcázar'}, 6.0);
C('Si los numeros estan mal', 'stat', {value: 10, prefix: '+', label: 'Puntos que sube una medición mal hecha', sub: 'La vejiga llena, hablar, el brazo colgando', mood: 'terracotta'}, 6.0);
C('midase en los dos brazos', 'lowerthird', {title: 'La primera vez: los dos brazos', sub: 'Desde ahí, siempre el que dio el número más alto'}, 5.5);
C('una semana ordenada', 'checklist', {title: 'La semana que sí le sirve a su médico', items: ['Dos por la mañana, antes de la pastilla', 'Dos por la noche, antes de cenar', 'Con su fecha y su hora'], mood: 'sage'}, 6.0);
C('La tension alta no duele', 'hero', {kicker: 'Por qué es peligroso', title: 'No duele. No avisa.', sub: 'Encontrarse bien no es una prueba de nada', mood: 'terracotta'}, 6.0);
C('Contra los olvidos no sirve la fuerza de voluntad', 'checklist', {title: 'Sistemas, no fuerza de voluntad', items: ['Pastillero semanal de siete', 'Alarma en el teléfono', 'La caja siempre en el mismo sitio'], mood: 'sage'}, 6.0);
C('Caidas que a cierta edad no son un susto', 'stat', {value: 3, label: 'Pasos antes de ponerse de pie', sub: 'Tumbado, sentado, de pie', mood: 'gold'}, 5.5);
C('En verano los vasos se dilatan', 'beforeafter', {title: 'La misma dosis, distinta estación', labelA: 'En enero, perfecta', labelB: 'En agosto, demasiado baja', imageA: havePhoto('b321') ? photoPath('b321') : photoPath('b001'), imageB: havePhoto('b316') ? photoPath('b316') : photoPath('b001')}, 6.0);
C('A las 4 de la madrugada Elena', 'stat', {value: 4, suffix: ' AM', label: 'Su tensión, más alta que a mediodía', sub: 'Mientras dormía. Todas las noches, durante nueve años', mood: 'terracotta'}, 6.5);
C('la tension de bata blanca', 'beforeafter', {title: 'Las dos trampas que destapa la hoja', labelA: 'Bata blanca: alta sólo en la consulta', labelB: 'Enmascarada: buena en la consulta, mala en casa', imageA: havePhoto('b386') ? photoPath('b386') : photoPath('b001'), imageB: havePhoto('b388') ? photoPath('b388') : photoPath('b001')}, 6.5);
C('Elena hoy toma dos de sus pastillas', 'checklist', {title: 'Lo que cambió en casa de Elena', items: ['Dos pastillas pasaron a la noche', 'El diurético, con el desayuno', 'Una luz pequeña en el pasillo', 'El blíster, junto al cepillo de dientes'], mood: 'sage'}, 6.5);

COMP.sort((a, b) => a.start - b.start);

/* ===================== B-ROLL 1:1 CON LA GRILLA ===================== */
const occupied = COMP.map((c) => [c.start, c.start + c.dur]);
const overlaps = (s, e) => occupied.some(([a, b]) => s < b && e > a);

const beats = [];
let idc = 0;
for (const c of COMP) beats.push({id: `${c.kind}_${++idc}`, ...c});

let nClip = 0, nPhoto = 0, nAvatar = 0;
for (let i = 0; i < skel.length; i++) {
  const b = skel[i];
  const s = +(b.ms / 1000).toFixed(2);
  const next = i + 1 < skel.length ? skel[i + 1].ms / 1000 : TOTAL;
  const slot = +(next - s).toFixed(2);
  if (slot <= 0.4) continue;
  const id = `b${String(i).padStart(3, '0')}`;
  // En la zona del avatar real dejamos respirar la cara: 1 de cada 3 beats sin tapar.
  const enAvatar = s < AVATAR_END;
  if (enAvatar && i % 3 === 2) { nAvatar++; continue; }
  if (overlaps(s, s + slot)) continue;
  const vid = haveVid(id);
  const ph = havePhoto(id);
  if (!vid && !ph) continue;
  const ken = ['in', 'out', 'left', 'right'][i % 4];
  if (vid) {
    const d = Math.min(slot, CLIP_DUR);
    beats.push({id: `full_${id}`, start: s, dur: +d.toFixed(2), kind: 'full', src: `broll/${PFX}${id}.mp4`, video: true, ken});
    nClip++;
    const tail = +(slot - d).toFixed(2);
    if (tail > 0.7 && ph) { beats.push({id: `tail_${id}`, start: +(s + d).toFixed(2), dur: tail, kind: 'full', src: photoPath(id), video: false, ken: ken === 'in' ? 'out' : 'in'}); nPhoto++; }
  } else {
    beats.push({id: `full_${id}`, start: s, dur: slot, kind: 'full', src: photoPath(id), video: false, ken});
    nPhoto++;
  }
}
beats.sort((a, b) => a.start - b.start);

/* ============ RELLENO ANTI-HUECO DE LA ZONA FISH ============
   Del minuto 9:44 en adelante el avatar va en bucle y NO sincroniza labios:
   no puede quedar a la vista. Donde un componente desplaza beats y deja aire,
   se mete la foto del beat mas cercano (mismo tema, ya generada).            */
{
  const porMs = skel.map((b, i) => ({t: b.ms / 1000, id: `b${String(i).padStart(3, '0')}`}));
  const cercano = (t) => {
    let best = null, bd = 1e9;
    for (const c of porMs) { const d = Math.abs(c.t - t); if (d < bd && havePhoto(c.id)) { bd = d; best = c.id; } }
    return best;
  };
  const rellenos = [];
  const segs = beats.map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
  let cur = AVATAR_END;
  const huecos = [];
  for (const [s2, e2] of segs) {
    if (e2 <= AVATAR_END) continue;
    const ini = Math.max(s2, AVATAR_END);
    if (ini - cur > 0.5) huecos.push([cur, ini]);
    cur = Math.max(cur, e2);
  }
  if (TOTAL - cur > 0.5) huecos.push([cur, TOTAL]);
  for (const [gs, ge] of huecos) {
    let t = gs;
    while (ge - t > 0.5) {
      const d = Math.min(4.2, ge - t);
      const id = cercano(t);
      if (!id) break;
      rellenos.push({id: `gap_${id}_${t.toFixed(0)}`, start: +t.toFixed(2), dur: +d.toFixed(2), kind: 'full',
                     src: photoPath(id), video: false, ken: rellenos.length % 2 ? 'out' : 'in', variant: 'whip'});
      t += d;
    }
  }
  beats.push(...rellenos);
  beats.sort((a, b) => a.start - b.start);
  console.log(`relleno anti-hueco (zona Fish): ${rellenos.length} planos`);
}

/* ===================== EMITIR ===================== */
const TOTAL_FRAMES = Math.round(TOTAL * 30);
const header = `// cues_valeriapresion.gen.ts — GENERADO por build_valeriapresion.mjs. NO editar a mano.
export type Cue = {
  id: string; start: number; dur: number;
  kind: 'talk'|'full'|'chapter'|'hero'|'stat'|'quote'|'molecule'|'step'|'beforeafter'|'checklist'|'cta'|'carousel'|'lowerthird'|'qr';
  title?: string; kicker?: string; sub?: string; hot?: string[]; accent?: string; mood?: string; variant?: string;
  index?: string; side?: 'left'|'right';
  image?: string; imageA?: string; imageB?: string; labelA?: string; labelB?: string;
  src?: string; video?: boolean; caption?: string; ken?: 'in'|'out'|'left'|'right';
  value?: number; suffix?: string; prefix?: string; decimals?: number; label?: string;
  quote?: string; author?: string; role?: string; centerLabel?: string; nodes?: {label: string}[];
  step?: number; total?: number; items?: string[]; buttonLabel?: string;
  name?: string; topic?: string; cards?: {image: string; index: string; name: string; tag?: string}[]; focus?: number; intro?: boolean;
};
export const TOTAL_FRAMES_VP = ${TOTAL_FRAMES};
export const AVATAR_END_F = ${Math.round(AVATAR_END * 30)};
export const BEATS: Cue[] = ${JSON.stringify(beats, null, 2)};
`;
fs.writeFileSync('src/valeria/cues_valeriapresion.gen.ts', header);

const assetSet = new Set();
for (const b of beats) {
  for (const k of ['src', 'image', 'imageA', 'imageB']) if (typeof b[k] === 'string' && !/^https?:/.test(b[k])) assetSet.add(b[k]);
  if (Array.isArray(b.cards)) for (const cd of b.cards) if (cd.image) assetSet.add(cd.image);
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...assetSet].join('\n') + '\n');

// ── cobertura: en la zona Fish no puede haber avatar descubierto (labios fuera de sync)
const segs = beats.map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
let cursor = AVATAR_END, huecoFish = 0, peor = 0;
for (const [s, e] of segs) {
  if (e <= AVATAR_END) continue;
  const ini = Math.max(s, AVATAR_END);
  if (ini > cursor) { const g = ini - cursor; huecoFish += g; if (g > peor) peor = g; }
  cursor = Math.max(cursor, e);
}
if (TOTAL - cursor > 0) { huecoFish += TOTAL - cursor; peor = Math.max(peor, TOTAL - cursor); }

const nComp = beats.filter((b) => !['talk', 'full'].includes(b.kind)).length;
const kinds = [...new Set(beats.filter((b) => b.kind !== 'full').map((b) => b.kind))];
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${beats.length} · componentes: ${nComp} · clips: ${nClip} · fotos: ${nPhoto} · avatar libre: ${nAvatar}`);
console.log(`tipos distintos: ${kinds.length} -> ${kinds.join(', ')}`);
console.log(`anchors faltantes: ${missing}`);
console.log(`ZONA FISH descubierta: ${huecoFish.toFixed(1)}s (peor hueco ${peor.toFixed(1)}s)`);
console.log(`TOTAL_FRAMES: ${TOTAL_FRAMES} (${(TOTAL / 60).toFixed(1)} min)`);
