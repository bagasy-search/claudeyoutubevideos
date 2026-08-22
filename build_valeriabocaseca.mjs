// build_valeriabocaseca.mjs — Doctora Valeria Alcázar · "¿Despiertas con la BOCA SECA? 7 SEÑALES +60"
// Kit valeria-vintage (editorial claro). DIRECTOR + generador anclado al ms de Whisper.
//   Motor: L0 avatar EN BUCLE + audio master aparte (Main_valeriabocaseca.tsx).
//   B-roll: 260 clips agnes (4,04s c/u) + su foto de respaldo del MISMO prompt (tapa la cola del momento).
//   Salidas: src/valeria/cues_valeriabocaseca.gen.ts · _valeriabocaseca_assets.txt
//   CTA = RETENCIÓN (guardar/suscribir/medidas en descripción). SIN precio ni link en voz.
import fs from 'fs';

const SLUG = 'valeriabocaseca';
const PFX = 'vbs_';
const TOTAL = 1687.41;           // master wav exacto (ffprobe)
const CAP_COMP = 6.5;            // tope de un componente antes de volver al avatar
const CAP_CLIP = 4.0;            // duración real del clip de agnes (97f @24 = 4,04s)
const CAP_PHOTO = 6.4;           // foto de respaldo que tapa la cola del momento (aguanta plano largo)

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, 'utf8').replace(/^﻿/, ''));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const W = caps.map((c) => ({n: norm(c.text), ms: c.startMs})).filter((w) => w.n);
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
const atc = (p) => { const v = at(p); if (v == null) { console.warn('⚠ anchor:', p); missing++; } return v; };

// ── assets ──
const haveVid = (id) => fs.existsSync(`public/broll/${id}.mp4`);
const havePhoto = (id) => fs.existsSync(`public/img/${id}.jpg`) || fs.existsSync(`public/img/${id}.png`);
const photoPath = (id) => (fs.existsSync(`public/img/${id}.jpg`) ? `img/${id}.jpg` : (fs.existsSync(`public/img/${id}.png`) ? `img/${id}.png` : null));
const MOM = JSON.parse(fs.readFileSync('_v3/valeriabocaseca_moments.json', 'utf8').replace(/^﻿/, ''));
// primera foto disponible como último recurso
const FB = (() => {
  for (const m of MOM) { const p = photoPath(PFX + m.n); if (p) return p; }
  return null;
})();
/** foto del presentador (gpt-image-2 con ref) para los componentes de identidad */
const hero = (tag) => photoPath(`${PFX}h_${tag}`) || FB;

/** foto agnes del MISMO momento (el componente lleva la imagen de SU tema, no una generica) */
const imgOf = (n) => photoPath(PFX + n) || FB;

const P = [];
let _id = 0;
function S(p, kind, props = {}) {
  const start = p === 0 ? 0 : atc(p);
  if (start == null) return;
  P.push({id: `${kind}_${++_id}`, start, kind, ...props});
}

/* ══════════════════ COMPONENTES (DIRECTOR, por secciones) ══════════════════ */

/* ---- HOOK: la escena de las 4 de la mañana + la ordalía del arroz ---- */
S(0, 'talk', {title: 'Las cuatro de la mañana. Otra vez el vaso de agua.', kicker: 'Dra. Valeria Alcázar · Belleza y salud'});
S('mas antiguos y mas honestos', 'hero', {kicker: 'El aviso más antiguo del mundo', title: 'Su boca le está avisando', hot: ['avisando'], sub: 'No es la calefacción. No es la edad.', image: hero('mirror'), side: 'right', mood: 'gold'});
S('se lo cuento porque esta historia', 'chapter', {kicker: 'India antigua', index: 'La prueba del arroz', title: 'El primer detector de mentiras', sub: 'Sin médicos, sin aparatos: solo un puñado de arroz seco.'});
S('ese era senalado como el culpable', 'quote', {kicker: 'La ordalía del arroz', quote: 'El que escupía el arroz seco era el culpable.', author: 'Ordalía del arroz', role: 'India antigua', image: imgOf('v021'), mood: 'gold'});
S('que cuando una persona tiene miedo', 'molecule', {kicker: 'Lo que la ciencia tardó siglos en explicar', title: 'El miedo cierra el grifo', hot: ['miedo'], centerLabel: 'Sin saliva', sub: 'El sistema de alarma decide que salivar no es prioritario.', nodes: [{label: 'Alarma'}, {label: 'Glándulas'}, {label: 'Boca seca'}], image: imgOf('v025'), mood: 'science'});
S('yo soy la doctora valeria alcazar', 'lowerthird', {name: 'Dra. Valeria Alcázar', role: 'Medicina estética · Belleza vintage', topic: 'Boca seca: 7 señales después de los 60'});
S('su boca es el tablero de instrumentos', 'hero', {kicker: 'La idea que cambia todo', title: 'Su boca es el salpicadero', hot: ['salpicadero'], sub: 'Las lucecitas se encienden por lo que pasa debajo del capó.', image: imgOf('v027'), side: 'left', mood: 'science'});
S('7 senales quedese conmigo', 'chapter', {kicker: 'Lo que vamos a ver', index: '7 señales', title: 'Lo que su cuerpo le avisa', sub: 'De menos a más importante. La séptima se ve en el espejo.'});
S('pero antes dejeme presentarle a carmen', 'hero', {kicker: 'Una paciente real', title: 'Carmen, 68 años', hot: ['68'], sub: 'Vino por un motivo estético. Salió con otra cosa.', image: hero('carmen'), side: 'right', mood: 'gold'});

/* ---- MECANISMO: qué es la saliva y por qué se seca a los 60 ---- */
S('la saliva no es agua', 'checklist', {kicker: 'Lo que hace su saliva cada noche', title: 'El líquido más inteligente del cuerpo', hot: ['inteligente'], items: ['Repara el esmalte con calcio y fosfato', 'Frena a millones de bacterias', 'Lubrica y protege la mucosa', 'Empieza la digestión antes del estómago'], mood: 'science'});
S('pasan cuatro cosas a la vez', 'checklist', {kicker: 'Por qué justo ahora', title: 'Cuatro cosas pasan a la vez', hot: ['Cuatro'], items: ['Las glándulas producen menos y más espeso', 'Casi todas tomamos alguna pastilla', 'La sed llega tarde: el aviso se apaga', 'La menopausia reseca las mucosas'], mood: 'gold'});
S('la sensacion de sed se apaga con la edad', 'hero', {kicker: 'El dato que casi nadie sabe', title: 'A esta edad la sed llega tarde', hot: ['tarde'], sub: 'Puede estar deshidratada de verdad y no sentir nada.', image: hero('agua'), side: 'left', mood: 'cool'});
S('se estima que alrededor de una de cada cuatro personas', 'stat', {suffix: '', kicker: 'Mayores de 65 años', value: 1, label: 'de cada 4 convive con la boca seca', sub: 'Y entre quienes toman varias pastillas, muchísimos más.', image: imgOf('v054'), mood: 'science', decimals: 0});
S('que sea frecuente no significa que sea normal', 'quote', {kicker: 'La frase más importante del vídeo', quote: 'Frecuente y normal no son la misma cosa.', author: 'Dra. Valeria Alcázar', role: 'Medicina estética', image: hero('consulta'), mood: 'gold'});

/* ---- SEÑAL 1 · APNEA ---- */
S('senal numero uno', 'chapter', {kicker: 'Señal', index: 'N.º 01', title: 'Seca al despertar, bien de día', sub: 'Está durmiendo con la boca abierta.'});
S('durmiendo con la boca abierta', 'hero', {kicker: 'Ocho horas de aire por la boca', title: 'Como la ropa al viento', hot: ['viento'], sub: 'La mucosa se seca igual que una sábana tendida.', image: imgOf('v062'), side: 'right', mood: 'cool'});
S('esa combinacion merece una consulta', 'checklist', {kicker: 'Si se junta con esto, consulte', title: 'Los tres rastros de la apnea', hot: ['apnea'], items: ['Ronca o le han dicho que ronca', 'Se levanta cansada tras ocho horas', 'Dolor de cabeza al despertar', 'Cabezadas por la tarde sin querer'], mood: 'science'});
S('se duerme mal porque hay algo que arreglar', 'quote', {kicker: 'Quince años pensando que era la edad', quote: 'Se duerme mal porque hay algo que arreglar.', author: 'Dra. Valeria Alcázar', role: 'Medicina estética', image: imgOf('v076'), mood: 'gold'});

/* ---- SEÑAL 2 · AZÚCAR ---- */
S('senal numero dos', 'chapter', {kicker: 'Señal', index: 'N.º 02', title: 'Bebe y la sed no se calma', sub: 'Cuando el agua no apaga la sed, hay que mirar el azúcar.'});
S('doctora yo me hidrato muy bien', 'beforeafter', {kicker: 'La jarra de Marisa', title: 'Eso no era hidratarse', hot: ['hidratarse'], imageA: imgOf('v080'), imageB: imgOf('v081'), labelA: 'Al acostarse: llena', labelB: 'Al despertar: vacía', mood: 'cool'});
S('eso es motivo para pedir cita', 'checklist', {kicker: 'Pida un análisis si se junta', title: 'Sed + baño + estos avisos', hot: ['análisis'], items: ['Sed que no se calma por más que beba', 'Se levanta varias veces al baño', 'Ha perdido peso sin proponérselo', 'Una herida que tarda en cerrar'], mood: 'science'});
S('es el mensajero y matar', 'hero', {kicker: 'No mate al mensajero', title: 'La boca seca solo avisa', hot: ['avisa'], sub: 'Beber agua y no hacer nada más es lo peor que podemos hacer.', image: imgOf('v088'), side: 'left', mood: 'gold'});

/* ---- SEÑAL 3 · LOS MEDICAMENTOS (la causa nº 1) ---- */
S('senal numero 3', 'chapter', {kicker: 'Señal', index: 'N.º 03', title: 'Su lista de medicamentos', sub: 'La causa número uno a esta edad. Probablemente la suya.'});
S('4 pastillas cada manana', 'stat', {suffix: '', kicker: 'El pastillero de Carmen', value: 4, label: 'pastillas cada mañana', sub: 'Tensión, diurético, antihistamínico y una para dormir.', image: hero('pastillero'), mood: 'gold', decimals: 0});
S('medicamentos de uso corriente que resecan la boca', 'stat', {suffix: '', kicker: 'Efecto secundario', value: 400, prefix: '+', label: 'medicamentos corrientes resecan la boca', sub: 'No son medicinas raras: son las de todos los días.', image: imgOf('v097'), mood: 'science', decimals: 0});
S('son las de todos los dias', 'checklist', {kicker: 'Las que están en casi todos los pastilleros', title: 'Las de todos los días', hot: ['días'], items: ['Tensión, y sobre todo los diuréticos', 'Antihistamínicos de la alergia', 'Antidepresivos y ansiolíticos', 'Pastillas para dormir', 'Vejiga, mareo y dolor'], mood: 'science'});
S('usted no va a suspender ni a reducir', 'hero', {kicker: 'Orden médica', title: 'No suspenda nada por su cuenta', hot: ['nada'], sub: 'Jamás. Lo que hay que hacer es otra cosa, mucho más inteligente.', image: hero('receta'), side: 'right', mood: 'alert'});
S('le va a decir a su medico esta frase exacta', 'quote', {kicker: 'Dígalo con estas palabras', quote: 'Doctor, tengo la boca muy seca por las noches: ¿alguno de estos medicamentos me la puede estar resecando?', author: 'La frase que abre la conversación', role: 'Llévela apuntada', image: imgOf('v109'), mood: 'gold'});
S('le movieron la toma del diuretico', 'step', {step: 3, total: 7, title: 'A veces se arregla con la hora', hot: ['hora'], sub: 'Mover una toma de la noche a la mañana puede cambiarle el descanso.', image: imgOf('v110'), mood: 'science'});

/* ---- SEÑAL 4 · SJÖGREN ---- */
S('senal numero 4', 'chapter', {kicker: 'Señal', index: 'N.º 04', title: 'Boca seca y ojos secos', sub: 'Juntas son una pareja que los médicos conocemos bien.'});
S('tres piezas del rompecabezas', 'molecule', {kicker: 'Los siete años de Pilar', title: 'Tres piezas que nadie juntó', hot: ['juntó'], centerLabel: 'Un solo cuadro', sub: 'Cada médico miraba su trozo. Júntelas usted.', nodes: [{label: 'Ojos secos'}, {label: 'Boca seca'}, {label: 'Articulaciones'}], image: imgOf('v120'), mood: 'science'});
S('afecta muchisimo mas a mujeres que a hombres', 'hero', {kicker: 'Por qué se lo cuento a usted', title: 'Sobre todo a mujeres', hot: ['mujeres'], sub: 'Y suele dar la cara en los años que siguen a la menopausia.', image: imgOf('v124'), side: 'left', mood: 'gold'});
S('pida cita y digalo entero', 'quote', {kicker: 'Dígalo entero, en la misma frase', quote: 'Tengo la boca seca, los ojos secos y me duelen las articulaciones.', author: 'Las tres piezas, juntas', role: 'Con un análisis se empieza a estudiar', image: imgOf('v126'), mood: 'science'});

/* ---- SEÑAL 5 · ALIENTO Y LENGUA ---- */
S('senal numero 5', 'chapter', {kicker: 'Señal', index: 'N.º 05', title: 'Mal aliento y lengua que arde', sub: 'No es falta de higiene: es falta de riego.'});
S('que es la que arrastra y limpia', 'hero', {kicker: 'La saliva es el riego', title: 'Sin riego, las bacterias trabajan', hot: ['bacterias'], sub: 'Por eso no mejora por más que se cepille.', image: imgOf('v131'), side: 'right', mood: 'science'});
S('se llama sindrome de boca ardiente', 'checklist', {kicker: 'Qué puede haber detrás', title: 'La lengua que arde', hot: ['arde'], items: ['Falta de hierro', 'Falta de vitamina B12', 'Falta de zinc', 'Un hongo aprovechando la sequedad', 'Un efecto de la medicación'], mood: 'science'});
S('no lo aguante callada', 'quote', {kicker: 'Se ve, se trata y se acaba', quote: 'No lo aguante callada.', author: 'Dra. Valeria Alcázar', role: 'Medicina estética', image: hero('consulta2'), mood: 'gold'});

/* ---- SEÑAL 6 · CARIES DEL CUELLO ---- */
S('senal numero 6', 'chapter', {kicker: 'Señal', index: 'N.º 06', title: 'Encías que sangran y caries nuevas', sub: 'A una edad en la que ya no debería tenerlas.'});
S('le encontraron 5', 'stat', {suffix: '', kicker: 'Veinte años sin una caries', value: 5, label: 'caries en una sola revisión', sub: 'No fue mala suerte: se le había secado la boca.', image: imgOf('v145'), mood: 'alert', decimals: 0});
S('esas son las caries de la boca seca', 'beforeafter', {kicker: 'La reparación que ocurre mientras duerme', title: 'Con saliva y sin saliva', hot: ['saliva'], imageA: imgOf('v148'), imageB: imgOf('v254'), labelA: 'Con saliva: el esmalte se repara', labelB: 'Sin saliva: el esmalte se pica', mood: 'science'});
S('su dentista exactamente estas cuatro palabras', 'quote', {kicker: 'Cuatro palabras que cambian la revisión', quote: 'Tengo la boca seca.', author: 'Dígaselo a su dentista', role: 'Le cambia el plan entero', image: imgOf('v118'), mood: 'gold'});

/* ---- SEÑAL 7 · BOQUERAS Y CÓDIGO DE BARRAS ---- */
S('llegamos a la senal numero siete', 'chapter', {kicker: 'Señal', index: 'N.º 07', title: 'Lo que confunde con una arruga', sub: 'La única que se mira cada mañana en el espejo.'});
S('que ilitis angular', 'hero', {kicker: 'Queilitis angular', title: 'Las boqueras de toda la vida', hot: ['boqueras'], sub: 'Y no salen porque sí.', image: imgOf('v161'), side: 'right', mood: 'alert'});
S('una se lame los labios sin darse cuenta', 'molecule', {kicker: 'El gesto que agrieta', title: 'El círculo del labio', hot: ['círculo'], centerLabel: 'Más seco', sub: 'La saliva se evapora y se lleva la grasa que protegía el labio.', nodes: [{label: 'Se lame'}, {label: 'Se evapora'}, {label: 'Se agrieta'}], image: imgOf('v170'), mood: 'alert'});
S('que sobre un labio jugoso', 'beforeafter', {kicker: 'El código de barras', title: 'El mismo labio, con agua y sin agua', hot: ['agua'], imageA: imgOf('v173'), imageB: imgOf('v174'), labelA: 'Deshidratado: se marca', labelB: 'Hidratado: se difumina', mood: 'gold'});
S('empieza en la saliva', 'quote', {kicker: 'Lo que de verdad rejuvenece esa zona', quote: 'No empieza en un tarro caro. Empieza en la saliva.', author: 'Dra. Valeria Alcázar', role: 'Medicina estética', image: hero('labios'), mood: 'gold'});

/* ---- EL RITUAL: 7 REMEDIOS (carrusel + pasos) ---- */
S('son siete cosas todas de andar por casa', 'chapter', {kicker: 'El papel que le escribí a Carmen', index: 'El ritual', title: 'Siete cosas para esta noche', sub: 'Las medidas exactas, apuntadas en la descripción.'});
S('cambia la forma de beber agua', 'step', {step: 1, total: 7, title: 'Beba repartido, no de golpe', hot: ['repartido'], sub: 'Sorbos pequeños todo el día. Un vaso enorme de noche solo llena la vejiga.', image: hero('vaso'), mood: 'cool'});
S('el enjuague casero', 'step', {step: 2, total: 7, title: 'Enjuague de bicarbonato y sal', hot: ['bicarbonato'], sub: 'Agua templada. Las cantidades exactas, en la descripción.', image: hero('bicarbonato'), mood: 'science'});
S('todo lo que reseca', 'step', {step: 3, total: 7, title: 'Fuera lo que reseca', hot: ['reseca'], sub: 'Tabaco, alcohol de la cena, café de después y caramelos con azúcar.', image: imgOf('v197'), mood: 'alert'});
S('hay que despertar a las fabricas', 'step', {step: 4, total: 7, title: 'Despierte las glándulas', hot: ['glándulas'], sub: 'Chicle sin azúcar con xilitol y medio minuto de masaje por cada lado.', image: hero('masaje'), mood: 'gold'});
S('las infusiones de antes', 'step', {step: 5, total: 7, title: 'Infusión de malva templada', hot: ['malva'], sub: 'Los mucílagos tapizan la mucosa y calman la aspereza.', image: hero('malva'), mood: 'science'});
S('el aire de su habitacion', 'step', {step: 6, total: 7, title: 'Humedad en la habitación', hot: ['Humedad'], sub: 'Y trabaje la nariz: el objetivo es dormir con la boca cerrada.', image: imgOf('v222'), mood: 'cool'});
S('cuide el borde los labios', 'step', {step: 7, total: 7, title: 'Bálsamo espeso en los labios', hot: ['Bálsamo'], sub: 'Y no se los lama durante el día, por mucho que le tire la piel.', image: hero('balsamo'), mood: 'gold'});
S('mantenga la zona seca y limpia', 'checklist', {kicker: 'Si tiene las boqueras abiertas', title: 'Qué hacer con las comisuras', hot: ['comisuras'], items: ['Zona seca y limpia durante el día', 'No taparlas con maquillaje', 'Si en diez días no cierran, al médico', 'Que le miren si la mordida ha bajado'], mood: 'alert'});

/* ---- CARMEN VUELVE ---- */
S('carmen volvio a los 3 meses', 'chapter', {kicker: 'Tres meses después', index: 'Carmen', title: 'Y no le pusimos ni una inyección', sub: 'Solo el papel que se llevó aquel martes.'});
S('ya no tengo cara de enfadada', 'beforeafter', {kicker: 'El mismo espejito, tres meses después', title: 'Carmen, antes y después', hot: ['después'], imageA: hero('carmen'), imageB: hero('carmen2'), labelA: 'Comisuras agrietadas', labelB: 'Labio liso y cerrado', mood: 'gold'});
S('me habria ahorrado dos anos', 'quote', {kicker: 'Lo que dijo al salir', quote: 'Si llego a saber que era eso, me habría ahorrado dos años.', author: 'Carmen', role: '68 años', image: imgOf('v237'), mood: 'gold'});

/* ---- BANDERAS ROJAS + DENTISTA ---- */
S('apunte estas cinco', 'checklist', {kicker: 'Pida cita sin dejarlo para el mes que viene', title: 'Cinco avisos que no se tratan en casa', hot: ['Cinco'], items: ['Sed intensa con orina abundante y pérdida de peso', 'Un bulto delante de la oreja o bajo la mandíbula', 'Una llaga que no cura en dos semanas', 'Dificultad para tragar', 'Fiebre, dolor o cara hinchada'], mood: 'alert'});
S('llevele la lista escrita', 'step', {step: 1, total: 1, title: 'Al dentista, con la lista en la mano', hot: ['lista'], sub: 'Dígale: tengo la boca seca por las noches y tomo estos medicamentos.', image: imgOf('v245'), mood: 'science'});

/* ---- CIERRE ---- */
S('es una manta que echamos por encima', 'quote', {kicker: 'La frase que lo tapa todo', quote: 'Es la edad: una manta que echamos por encima de cosas que tienen arreglo.', author: 'Dra. Valeria Alcázar', role: 'Medicina estética', image: hero('cierre'), mood: 'gold'});
S('el resumen para que se le quede grabado', 'checklist', {kicker: 'Las siete señales, en una', title: 'Guarde esto', hot: ['Guarde'], items: ['Seca al despertar + ronquido: descarte apnea', 'Sed que no se calma: análisis de azúcar', 'Revise el pastillero con su médico', 'Boca y ojos secos: que se lo estudien', 'Lengua que arde: hierro, B12 o zinc', 'Caries en el cuello del diente', 'Boqueras y código de barras'], mood: 'science'});
S('y esta misma noche', 'checklist', {kicker: 'Esta misma noche', title: 'El ritual, en siete gestos', hot: ['siete'], items: ['Sorbos repartidos durante el día', 'Enjuague de bicarbonato con una pizca de sal', 'Nada de alcohol ni colutorios que piquen', 'Chicle sin azúcar y masaje de glándulas', 'Infusión de malva templada', 'Humedad en el cuarto y respirar por la nariz', 'Bálsamo en los labios antes de dormir'], mood: 'gold'});
S('guardelo para tenerlo a mano', 'cta', {kicker: 'Si le ha servido', title: 'Guarde el vídeo y suscríbase', hot: ['suscríbase'], sub: 'Las medidas exactas del enjuague y de la infusión están apuntadas en la descripción, con las siete señales por escrito.', buttonLabel: 'Medidas en la descripción', image: hero('cierre'), mood: 'gold'});

/* ══════════════════ CLIPS agnes: uno por frase ══════════════════ */
const clipBeats = [];
for (const m of MOM) {
  const id = PFX + m.n;
  const v = haveVid(id);
  const ph = photoPath(id);
  if (!v && !ph) continue;
  clipBeats.push({id: `clip_${m.n}`, start: m.start, kind: 'full', _clip: true,
    src: v ? `broll/${id}.mp4` : ph, video: !!v, _photo: ph, ken: 'in'});
}
console.log(`clips con asset: ${clipBeats.length} de ${MOM.length}`);

/* ══════════════════ MONTAJE: orden, duraciones, cola de foto ══════════════════ */

/* Tiempo de LECTURA por componente (feedback_componentes_tiempo_de_lectura): un checklist de
   5 items no se lee en 4s. El componente GANA: se lleva su ventana y los clips que caen dentro
   se suprimen. Sin esto el montaje queda a 3,4s clavados — metrónomo, y no da tiempo a leer.  */
const READ = {checklist: 8.5, cta: 8.0, step: 7.0, beforeafter: 7.0, molecule: 7.0, quote: 6.8,
  stat: 6.5, hero: 6.0, chapter: 5.0, lowerthird: 4.5};
{
  const comps = P.filter((c) => c.kind !== 'talk').sort((a, b) => a.start - b.start);
  for (let i = 0; i < comps.length; i++) {
    const c = comps[i];
    const nextComp = i + 1 < comps.length ? comps[i + 1].start : TOTAL;
    c._win = Math.max(2.5, Math.min(READ[c.kind] || CAP_COMP, nextComp - c.start - 0.2));
  }
  const before = clipBeats.length;
  for (let i = clipBeats.length - 1; i >= 0; i--) {
    const s = clipBeats[i].start;
    if (comps.some((c) => s >= c.start - 0.2 && s < c.start + c._win)) clipBeats.splice(i, 1);
  }
  console.log(`clips suprimidos por caer bajo un componente: ${before - clipBeats.length}`);
}

/* RITMO VARIADO (regla 1 del pipeline): con un clip por frase cada ~5s TODOS los planos duran
   4,04s y el montaje queda de metrónomo ("cambia una por segundo, cansa"). Se adelgazan SOLO las
   rachas más apretadas: en una corrida de 3+ clips separados <6,2s se saca uno de cada tres, y la
   FOTO del clip anterior se estira para llenar. El resultado alterna 4s / 6s en vez de 4s clavado. */
{
  clipBeats.sort((a, b) => a.start - b.start);
  const drop = new Set();
  let run = 0;
  for (let i = 1; i < clipBeats.length; i++) {
    const d = clipBeats[i].start - clipBeats[i - 1].start;
    if (d < 6.2) { run++; } else { run = 0; continue; }
    if (run >= 2 && !drop.has(clipBeats[i - 1].id)) { drop.add(clipBeats[i].id); run = 0; }
  }
  const before = clipBeats.length;
  for (let i = clipBeats.length - 1; i >= 0; i--) if (drop.has(clipBeats[i].id)) clipBeats.splice(i, 1);
  console.log(`clips adelgazados para variar el ritmo: ${before - clipBeats.length}`);
}

const ALL = [...P, ...clipBeats].sort((a, b) => a.start - b.start);
const KENS = ['in', 'out', 'left', 'right'];
const beats = [];
let ki = 0;
for (let i = 0; i < ALL.length; i++) {
  const c = ALL[i];
  const next = i + 1 < ALL.length ? ALL[i + 1].start : TOTAL;
  const gap = +(next - c.start).toFixed(2);
  if (c.kind === 'talk') { beats.push({...c, dur: +Math.max(0.6, gap).toFixed(2)}); continue; }
  const cap = c._clip ? (c.video ? CAP_CLIP : CAP_PHOTO) : (c._win || CAP_COMP);
  const dur = Math.max(0.6, Math.min(gap, cap));
  const b = {...c, dur: +dur.toFixed(2)};
  if (c._clip) b.ken = KENS[ki++ % KENS.length];
  delete b._clip; delete b._photo; delete b._win;
  beats.push(b);
  let rest = +(gap - dur).toFixed(2);
  // la FOTO del mismo prompt tapa la cola del momento (un corte más, mismo tema).
  // Duración ALTERNADA (2.2 / 3.0 / 3.8) para romper el metrónomo de cortes parejos.
  if (rest > 1.2 && c._clip && c.video && c._photo) {
    // planos LARGOS alternados: sin esto todo dura 4s y el montaje es un metronomo (regla 1)
    // la foto se queda con TODO lo que sobra (hasta 6,4s) cuando hay hueco: asi aparecen los
    // planos largos que dejan entender; si sobra poco, se alterna corto para no acartonar.
    const varia = [3.2, 5.6, 4.0, 6.2][ki % 4];
    const pd = Math.min(rest, rest >= 4.5 ? CAP_PHOTO : varia);
    beats.push({id: `ph_${c.id}`, start: +(c.start + dur).toFixed(2), dur: +pd.toFixed(2), kind: 'full',
      src: c._photo, video: false, ken: KENS[ki++ % KENS.length]});
    rest = +(rest - pd).toFixed(2);
  }
  if (rest > 0.35) beats.push({id: `fill_${c.id}`, start: +(next - rest).toFixed(2), dur: rest, kind: 'talk'});
}
beats.sort((a, b) => a.start - b.start);

/* ── COSTURAS DEL BUCLE DEL AVATAR ──────────────────────────────────────────
   El avatar real dura 327.786 s y el vídeo 28 min: el <Loop> reinicia el clip
   cada 327.79 s y ese salto SE VE si en ese instante está el avatar a pantalla
   completa. Regla dura: cada costura tiene que caer DEBAJO de un visual opaco.
   Si no lo está, se corre un clip cercano (o se mete su foto) para taparla.    */
const AV = 327.786;
const seams = [];
for (let t = AV; t < TOTAL - 1; t += AV) seams.push(+t.toFixed(2));
const covers = (t) => beats.some((b) => b.kind !== 'talk' && b.start <= t - 0.25 && b.start + b.dur >= t + 0.25);
let tapadas = 0;
for (const t of seams) {
  if (covers(t)) { tapadas++; continue; }
  // buscar el clip con foto más cercano para reubicar su respaldo sobre la costura
  let best = null, bd = 1e9;
  for (const m of MOM) {
    const ph = photoPath(PFX + m.n);
    if (!ph) continue;
    const d = Math.abs(m.start - t);
    if (d < bd) { bd = d; best = {m, ph}; }
  }
  if (!best) { console.warn(`⚠ costura ${t}s SIN tapar (no hay foto)`); continue; }
  beats.push({id: `seam_${t.toFixed(0)}`, start: +(t - 1.5).toFixed(2), dur: 3.0, kind: 'full',
    src: best.ph, video: false, ken: 'in'});
  tapadas++;
}
beats.sort((a, b) => a.start - b.start);
console.log(`costuras del bucle: ${seams.length} · tapadas: ${tapadas}`);

// b-roll sin overlay de texto (el creador: el texto sobre stock cansa)
for (const b of beats) if (b.kind === 'full') { delete b.caption; delete b.kicker; }

/* ══════════════════ EMITIR ══════════════════ */
const TOTAL_FRAMES = Math.round(TOTAL * 30) + 20;  // +0,7s de cola: la comp NUNCA puede cortar la ultima frase
const header = `// cues_valeriabocaseca.gen.ts — GENERADO por build_valeriabocaseca.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_VBS = ${TOTAL_FRAMES};
export const BEATS: Cue[] = ${JSON.stringify(beats, null, 2)};
`;
fs.writeFileSync('src/valeria/cues_valeriabocaseca.gen.ts', header);

// lista de assets para el farm
const assetSet = new Set();
for (const b of beats) {
  for (const k of ['src', 'image', 'imageA', 'imageB']) if (typeof b[k] === 'string' && !/^https?:/.test(b[k])) assetSet.add(b[k]);
  if (Array.isArray(b.cards)) for (const cd of b.cards) if (cd.image) assetSet.add(cd.image);
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...assetSet].join('\n') + '\n');

/* ══════════════════ STATS + GATE DE PACING ══════════════════ */
const vis = beats.filter((b) => b.kind !== 'talk');
const durs = vis.map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.min(durs.length - 1, Math.floor(durs.length * p))];
const nComp = beats.filter((b) => !['talk', 'full'].includes(b.kind)).length;
const kinds = [...new Set(beats.filter((b) => b.kind !== 'talk').map((b) => b.kind))];
const talkSec = beats.filter((b) => b.kind === 'talk').reduce((s, b) => s + b.dur, 0);
const largos = beats.filter((b) => b.kind === 'talk' && b.dur > 7);
console.log(`\n=== build_${SLUG} ===`);
console.log(`beats: ${beats.length} · visuales: ${vis.length} · componentes: ${nComp} · avatar solo: ${beats.length - vis.length} tramos (${(talkSec / 60).toFixed(1)} min, ${(100 * talkSec / TOTAL).toFixed(0)}%)`);
console.log(`tipos distintos: ${kinds.length} → ${kinds.join(', ')}`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`tramos de solo-avatar > 7s: ${largos.length}` + (largos.length ? ` (max ${Math.max(...largos.map((b) => b.dur)).toFixed(1)}s)` : ''));
console.log(`anchors faltantes: ${missing} · assets: ${assetSet.size}`);
console.log(`TOTAL_FRAMES: ${TOTAL_FRAMES} (${(TOTAL / 60).toFixed(1)} min)`);
