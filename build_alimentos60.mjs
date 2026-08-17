// build_alimentos60.mjs — Doctora Valeria Alcázar · "Come ESTOS 3 ALIMENTOS" (piel/belleza +60)
// Kit valeria-vintage. DIRECTOR + generador: escenas ancladas al ms de Whisper.
//   Motor: L0 avatar persistente + escenas Val* opacas (Main_alimentos60.tsx).
//   Salidas: src/valeria/cues_alimentos60.gen.ts  ·  _alimentos60_stock.json (needs)
//            _alimentos60_assets.txt (para el farm)
// 2 pasadas: 1) corré → escribe needs → fetch stock → 2) corré → mapea assets.
import fs from 'fs';

const SLUG = 'alimentos60';
const TOTAL = 1328.34;               // duración exacta del avatar (ffprobe)
const CAP_COMP = 6.5;                // tope de un componente antes de volver al avatar
const CAP_FULL = 5.0;                // tope de un b-roll fullshot

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
const atc = (p) => { const v = at(p); if (v == null) { console.warn('⚠ anchor:', p); missing++; } return v; };

// ── asset helpers ──
const haveVid = (id) => fs.existsSync(`public/broll/al_${id}.mp4`);
const havePhoto = (id) => fs.existsSync(`public/img/al_${id}.jpg`);
const MED = (f) => (fs.existsSync(`public/med/${f}`) ? `med/${f}` : null);
// fallback garantizado (nunca 404): una foto stock ya bajada > un med existente
function fallbackImg() {
  const imgs = fs.existsSync('public/img') ? fs.readdirSync('public/img').filter((f) => /^al_.*\.jpg$/i.test(f)) : [];
  if (imgs.length) return `img/${imgs[Math.floor(imgs.length / 2)]}`;
  return MED('crema.png') || MED('colageno.png') || MED('aceite.png');
}

// ── PLAN (DIRECTOR) ──
// S(anchorPhrase, kind, props). props.stock = {q, type:'video'|'photo'} registra un asset.
const needs = [];          // {name, query, type}
let _id = 0;
const P = [];
function S(p, kind, props = {}) {
  const start = p === 0 ? 0 : atc(p);
  if (start == null) return;
  const id = `${kind}_${++_id}`;
  const c = {id, start, kind, ...props};
  if (props.stock) {
    const type = props.stock.type || 'video';
    needs.push({name: id, query: props.stock.q, type});
    c._stock = {id, type};
    delete c.stock;
  }
  P.push(c);
}

const CARDS = [
  {index: 'N.º 01', name: 'El huevo', tag: 'Ladrillos', img: 'huevo', q: 'eggs white bowl rustic'},
  {index: 'N.º 02', name: 'La sardina', tag: 'Humedad', img: 'sardina', q: 'canned sardines tin'},
  {index: 'N.º 03', name: 'Vitamina C', tag: 'Cemento', img: 'vitc', q: 'red bell pepper citrus'},
];
for (const c of CARDS) needs.push({name: c.img, query: c.q, type: 'photo'});

// POOL "ambiente" on-topic para cutaways en los tramos largos de charla (rota, sin repetir adyacente)
const AMBIENT = [
  'mature woman touching face skin', 'older woman smiling outdoors sunlight', 'fresh vegetables wooden table',
  'hands cracking egg bowl', 'water splash fresh skin', 'sliced oranges citrus closeup',
  'grandmother hands kitchen cooking', 'woman applying face cream mirror', 'red bell peppers market',
  'healthy breakfast plate eggs', 'sardines olive oil plate', 'elderly woman laughing portrait',
  'skin texture macro close up', 'green salad fresh vegetables',
  'woman drinking glass of water', 'fresh eggs basket farm', 'senior woman wellness peaceful',
  'close up forehead wrinkles skin', 'lemons limes citrus fresh', 'cooking vegetables pan kitchen',
  'mature woman looking window calm', 'guava tropical fruit fresh', 'tomato cucumber salad bowl', 'face serum dropper skincare',
].map((q, i) => ({name: `amb${i + 1}`, query: q}));
for (const a of AMBIENT) needs.push({name: a.name, query: a.query, type: 'video'});
const cardImgs = () => CARDS.map((c) => ({index: c.index, name: c.name, tag: c.tag, image: (havePhoto(c.img) ? `img/al_${c.img}.jpg` : (MED('crema.png') || fallbackImg()))}));

/* ===================== HOOK / APERTURA ===================== */
S(0, 'talk', {title: 'Tres alimentos. Tu piel más joven desde el plato.', hot: ['Tres'], kicker: 'Dra. Valeria Alcázar · Belleza natural'});
S('por menos de lo que cuesta una crema', 'full', {caption: 'No en un frasco caro.', stock: {q: 'cosmetic cream jars luxury', type: 'video'}, ken: 'in'});
S('en la piel de las mujeres', 'full', {caption: 'La piel más envidiada del mundo.', stock: {q: 'mature woman beautiful skin face', type: 'video'}, ken: 'out'});
S('mientras gastas dinero en cremas', 'full', {caption: 'Cremas que prometen y no cumplen.', stock: {q: 'skincare cream shelf store', type: 'video'}, ken: 'left'});
S('esta manana te miraste al espejo', 'full', {caption: 'Esta mañana, frente al espejo.', stock: {q: 'senior woman looking mirror bathroom', type: 'video'}, ken: 'in'});
S('unas lineas nuevas alrededor de los ojos', 'full', {caption: 'Líneas nuevas. Un tono apagado.', stock: {q: 'older woman face wrinkles closeup', type: 'video'}, ken: 'in'});
S('la piel es el unico organo que ves por fuera', 'talk', {title: 'Tu piel es tu boletín de calificaciones.', hot: ['boletín'], accent: VAL_gold()});
S('va en contra de casi todo lo que te vendieron', 'talk', {title: 'Va en contra de todo lo que te vendieron.', hot: ['todo'], accent: '#B5643C'});
S('se construye por dentro desde el plato', 'talk', {title: 'La piel firme se construye por dentro.', hot: ['dentro']});
S('tu piel se renueva a cualquier edad', 'talk', {title: 'Tu piel se renueva a cualquier edad.', hot: ['cualquier']});
S('son tres comidas de toda la vida', 'hero', {kicker: 'Los 3 alimentos', title: 'Huevo, sardina y vitamina C', hot: ['Huevo'], sub: 'Baratos, de toda la vida, y con respaldo de la ciencia.', image: 'img/al_huevo.jpg', side: 'right', mood: 'gold'});
S('esa abuela que a los 80 tenia una piel', 'full', {caption: 'La piel que tenían nuestras abuelas.', stock: {q: 'elderly woman beautiful smiling face portrait', type: 'video'}, ken: 'out'});
S('yo soy el doctor bastida', 'lowerthird', {name: 'Dra. Valeria Alcázar', role: 'Medicina estética · Belleza natural', topic: '3 alimentos para la piel +60'});
S('no por una crema nueva por tres alimentos', 'talk', {title: 'No una crema. Tres alimentos.', hot: ['Tres']});
S('quedate hasta el final', 'talk', {title: 'El tercero hace que los otros dos funcionen.', hot: ['tercero'], kicker: 'Quédese hasta el final'});

/* ===================== MECANISMO: COLÁGENO ===================== */
S('debajo de tu piel sosteniendola hay una red', 'full', {caption: 'Bajo tu piel: una malla que la sostiene.', stock: {q: 'collagen skin structure macro fibers', type: 'video'}, ken: 'in'});
S('se llama colageno', 'molecule', {kicker: 'La malla de la piel', title: 'Colágeno', hot: ['Colágeno'], centerLabel: 'Colágeno', sub: 'La proteína que mantiene tu piel firme, tensa y rellena.', nodes: [{label: 'Firmeza'}, {label: 'Elasticidad'}, {label: 'Relleno'}], image: MED('colageno.png') || 'PHOTO:collagen', mood: 'science'});
S('cuando eres joven esa malla esta espesa', 'full', {caption: 'Piel joven: la malla rebota.', stock: {q: 'young woman smooth skin face', type: 'video'}, ken: 'out'});
S('puede perder cerca de un tercio', 'stat', {kicker: 'Tras la menopausia · 5 años', value: 30, suffix: '%', label: 'del colágeno de la piel se pierde', sub: 'Por eso la piel se afloja casi de un año a otro.', image: 'PHOTO:menopause', mood: 'cool'});
S('aparecen las arrugas profundas', 'full', {caption: 'Se afloja la malla: arrugas y flacidez.', stock: {q: 'deep wrinkles skin sagging closeup', type: 'video'}, ken: 'in'});
S('habia una hormona el estrogeno', 'talk', {title: 'El estrógeno era la capataz de la fábrica.', hot: ['capataz']});
S('y ahora escucha esta alerta', 'talk', {title: 'Alerta: algo en tu plato destruye tu colágeno.', hot: ['Alerta'], accent: '#B5643C', kicker: 'Atención'});
S('hay algo en tu plato que esta destruyendo tu colageno', 'full', {caption: 'El enemigo escondido.', stock: {q: 'white sugar cubes spoon', type: 'video'}, ken: 'left'});
S('el exceso de azucar', 'hero', {kicker: 'El enemigo #1 del colágeno', title: 'El azúcar', hot: ['azúcar'], sub: 'Se pega a tus fibras y las endurece como caramelo.', image: MED('cubito.png') || 'PHOTO:sugar', side: 'right', mood: 'warmdark'});
S('los cientificos a esto le dicen glicacion', 'molecule', {kicker: 'El nombre técnico', title: 'Glicación', hot: ['Glicación'], centerLabel: 'Azúcar', sub: 'La reacción que "caramela" tu piel por dentro.', nodes: [{label: 'Fibras rígidas'}, {label: 'Se quiebran'}, {label: 'Más arrugas'}], mood: 'warmdark', image: MED('cubito.png') || 'PHOTO:sugar'});
S('baja el azucar baja el pan blanco', 'talk', {title: 'Baja el azúcar. Es la mitad de la batalla.', hot: ['mitad'], accent: '#7A8B5A'});
S('tu cuerpo sabe fabricar colageno nuevo a cualquier edad', 'talk', {title: 'Tu cuerpo sabe fabricar colágeno nuevo.', hot: ['nuevo'], kicker: 'La buena noticia'});
S('vienen de la comida no de un pomo', 'talk', {title: 'Solo le faltan los materiales. Vienen del plato.', hot: ['materiales']});

/* ===================== ALIMENTO 1 · HUEVO ===================== */
S('el primer alimento son los ladrillos', 'talk', {title: 'El primero: los ladrillos del colágeno.', hot: ['ladrillos'], kicker: 'Alimento 1 de 3'});
S('sí el huevo', 'hero', {kicker: 'Alimento 1 · Los ladrillos', title: 'El huevo', hot: ['huevo'], sub: 'La proteína completa que reconstruye tu colágeno.', image: 'img/al_huevo.jpg', side: 'left', mood: 'gold'});
S('ese que durante 40 anos te dijeron', 'full', {caption: '40 años de miedo… para nada.', stock: {q: 'eggs bowl rustic kitchen', type: 'video'}, ken: 'in'});
S('un huevo al dia no dana el corazon', 'stat', {kicker: 'Estudio · +250.000 personas', value: 1, suffix: '/día', label: 'un huevo al día no daña el corazón', sub: 'Cuarenta años de miedo desmentidos.', image: 'PHOTO:egg', mood: 'science'});
S('esta hecho de aminoacidos', 'molecule', {kicker: 'De qué está hecho', title: 'Aminoácidos = ladrillos', hot: ['ladrillos'], centerLabel: 'Colágeno', sub: 'Tres ladrillos que tu piel necesita para armar colágeno.', nodes: [{label: 'Glicina'}, {label: 'Prolina'}, {label: 'Del huevo'}], mood: 'science', image: 'PHOTO:egg'});
S('la regla de oro con la que miden', 'hero', {kicker: 'Proteína patrón oro', title: 'La mejor proteína, la más barata', hot: ['mejor'], sub: 'Los científicos miden todas las demás contra el huevo.', image: 'PHOTO:eggyolk', side: 'left', mood: 'gold'});
S('sin ladrillos no hay obra', 'talk', {title: 'Sin ladrillos no hay obra. Sin proteína, no hay colágeno.', hot: ['obra']});
S('hay una vitamina que se llama biotina', 'molecule', {kicker: 'La vitamina de la belleza', title: 'Biotina', hot: ['Biotina'], centerLabel: 'Yema', sub: 'En la yema que te dijeron que tiraras.', nodes: [{label: 'Cabello'}, {label: 'Uñas'}, {label: 'Piel'}], mood: 'gold', image: 'PHOTO:eggyolk'});
S('es la vitamina de la belleza', 'full', {caption: 'Cabello con cuerpo, uñas fuertes.', stock: {q: 'healthy shiny hair woman brushing', type: 'video'}, ken: 'out'});
S('para unas que no se quiebren', 'full', {caption: 'Uñas que dejan de quebrarse.', stock: {q: 'healthy natural nails hands manicure', type: 'video'}, ken: 'in'});
S('dos pigmentos luteina', 'molecule', {kicker: 'Escudo contra el sol', title: 'Luteína y zeaxantina', hot: ['sol'], centerLabel: 'Piel', sub: 'Un escudo natural contra el enemigo #1: el sol.', nodes: [{label: 'Anti-manchas'}, {label: 'Anti-arrugas'}, {label: 'Protege'}], mood: 'science', image: 'PHOTO:sun'});
S('dejame contarte de una paciente', 'talk', {title: 'Déjame contarte de una paciente.', hot: ['paciente'], kicker: 'Caso real'});
S('dona elvira 72 anos', 'full', {caption: 'Doña Elvira, 72 · cabello y uñas frágiles.', stock: {q: 'senior woman worried mirror hair', type: 'photo'}, ken: 'in'});
S('lo primero que me dijo con una sonrisa', 'full', {caption: 'Tres meses después: uñas firmes, cabello con cuerpo.', stock: {q: 'happy senior woman smiling healthy', type: 'photo'}, ken: 'out'});
S('el zinc y el selenio', 'molecule', {kicker: 'Dos minerales más', title: 'Zinc y selenio', hot: ['Zinc'], centerLabel: 'Huevo', sub: 'Reparan y protegen la piel del desgaste.', nodes: [{label: 'Cicatriza'}, {label: 'Antioxidante'}, {label: 'Repara'}], mood: 'science', image: 'PHOTO:egg'});
S('una farmacia de belleza completa', 'hero', {kicker: 'Todo en uno', title: 'Una farmacia de belleza por centavos', hot: ['centavos'], sub: 'Más barato que un solo día de crema.', image: 'PHOTO:eggs2', side: 'right', mood: 'gold'});
S('no lo frias nadando en aceite', 'step', {step: 1, total: 2, title: 'Cómo comerlo', hot: ['comerlo'], sub: 'Hervido, tibio o revuelto suave. Nunca frito en aceite requemado.', image: 'PHOTO:boiledegg', mood: 'warmdark'});
S('dos huevos en el desayuno la mayoria de los dias', 'step', {step: 2, total: 2, title: 'Dos huevos al desayuno', hot: ['Dos'], sub: 'La mayoría de los días de la semana.', image: 'PHOTO:breakfast', mood: 'gold'});

/* ===================== CTA 1 ===================== */
S('todo eso lo dejé ordenado', 'talk', {title: 'Las cantidades exactas, ordenadas para ti.', hot: ['exactas']});
S('ahi esta un codigo un cuadrito lleno de puntitos', 'qr', {kicker: 'Su guía, gratis', title: 'Apunte su cámara al código', hot: ['código'], sub: 'Abra la cámara del teléfono y apúntela al recuadro. Es gratis.'});
S('ella es rosa de guadalajara', 'full', {caption: 'Rosa · Guadalajara · ya va por su 3.er día', kicker: 'Historias reales', stock: {q: 'happy mature latina woman smiling phone', type: 'photo'}, ken: 'in'});

/* ===================== ALIMENTO 2 · SARDINA ===================== */
S('el segundo alimento viene en una latita', 'hero', {kicker: 'Alimento 2 · La humedad', title: 'La sardina', hot: ['sardina'], sub: 'Omega-3 que rellena e hidrata la piel desde adentro.', image: 'img/al_sardina.jpg', side: 'right', mood: 'cool'});
S('la sardina', 'full', {caption: 'La sardina. Humilde y poderosa.', stock: {q: 'canned sardines tin fish', type: 'video'}, ken: 'out'});
S('humedad retenida por dentro', 'full', {caption: 'Piel joven = humedad retenida por dentro.', stock: {q: 'water drop skin hydration macro', type: 'video'}, ken: 'in'});
S('la piel se reseca se pone tirante', 'full', {caption: 'Piel seca: las líneas se marcan más.', stock: {q: 'dry skin texture closeup', type: 'video'}, ken: 'in'});
S('la sardina esta repleta de omega 3', 'molecule', {kicker: 'La grasa buena', title: 'Omega-3', hot: ['Omega-3'], centerLabel: 'Sardina', sub: 'El material con el que tu piel retiene el agua por dentro.', nodes: [{label: 'Hidrata'}, {label: 'Rellena'}, {label: 'Calma'}], mood: 'cool', image: 'PHOTO:sardines2'});
S('tu piel se vuelve mas jugosa', 'full', {caption: 'Piel jugosa, rellena, desde adentro.', stock: {q: 'glowing hydrated skin woman face', type: 'video'}, ken: 'out'});
S('el envejecimiento por inflamacion', 'hero', {kicker: 'El fuego escondido', title: 'Envejecimiento por inflamación', hot: ['inflamación'], sub: 'Un fueguito que quema tu colágeno. El omega-3 lo apaga.', image: 'PHOTO:calmskin', side: 'left', mood: 'warmdark'});
S('esos huesitos blandos que trae la sardina', 'molecule', {kicker: 'Y hay más adentro', title: 'Calcio, vitamina D y B12', hot: ['Calcio'], centerLabel: 'Sardina', sub: 'Huesos, renovación de la piel y color vivo.', nodes: [{label: 'Calcio'}, {label: 'Vitamina D'}, {label: 'B12'}], mood: 'science', image: 'PHOTO:sardines2'});
S('es la diferencia entre una uva y una pasa', 'beforeafter', {kicker: 'La prueba del espejo', title: 'Uva o pasa: es el agua', hot: ['agua'], imageA: 'PHOTO:grape', imageB: 'PHOTO:raisin', labelA: 'Hidratada', labelB: 'Seca', mood: 'cool'});
S('el contorno de los ojos', 'full', {caption: 'El contorno de ojos delata la edad.', stock: {q: 'woman eye area wrinkles crows feet', type: 'video'}, ken: 'in'});
S('como la comes para que sepa rico', 'step', {step: 1, total: 1, title: 'Cómo comerla', hot: ['comerla'], sub: 'Sobre tostada integral, con limón y aceite de oliva. 2-3 veces por semana, con sus huesitos.', image: 'PHOTO:sardinetoast', mood: 'gold'});

/* ===================== CTA 2 ===================== */
S('no te lo guardes solo en la cabeza', 'talk', {title: 'No lo dejes solo en la cabeza. Guárdalo.', hot: ['Guárdalo']});
S('ahi sigue el codigo en la pantalla', 'qr', {kicker: 'Su guía, gratis', title: 'Escanee ahora, toma 10 segundos', hot: ['ahora'], sub: 'Abra la cámara, apunte al recuadro, y listo.'});
S('dona alfonsina de monterrey', 'full', {caption: 'Alfonsina · Monterrey · 79 años', kicker: 'Historias reales', stock: {q: 'elderly woman smiling grandmother portrait', type: 'photo'}, ken: 'out'});

/* ===================== ALIMENTO 3 · VITAMINA C ===================== */
S('tu cuerpo no puede armar ni una sola fibra', 'talk', {title: 'Sin este ingrediente, nada se arma.', hot: ['nada'], kicker: 'El secreto que lo une todo'});
S('ese cemento es la vitamina c', 'hero', {kicker: 'Alimento 3 · El cemento', title: 'La vitamina C', hot: ['vitamina'], sub: 'Sin ella, los ladrillos nunca se vuelven piel firme.', image: 'img/al_vitc.jpg', side: 'left', mood: 'science'});
S('el pimiento rojo que tiene mas vitamina c que una naranja', 'full', {caption: 'Pimiento rojo: más vitamina C que una naranja.', stock: {q: 'red bell pepper fresh', type: 'video'}, ken: 'in'});
S('la guayaba que revienta de vitamina c', 'full', {caption: 'Guayaba: revienta de vitamina C.', stock: {q: 'guava fruit fresh sliced', type: 'video'}, ken: 'out'});
S('los citricos la naranja la mandarina', 'full', {caption: 'Naranja, mandarina, limón, kiwi, fresa.', stock: {q: 'citrus oranges slices fresh', type: 'video'}, ken: 'left'});
S('la herramienta que tu cuerpo usa para pegar', 'molecule', {kicker: 'El cemento del colágeno', title: 'Vitamina C = cofactor', hot: ['cofactor'], centerLabel: 'Vitamina C', sub: 'Pega los ladrillos y los convierte en colágeno firme.', nodes: [{label: 'Une aminoácidos'}, {label: 'Forma fibras'}, {label: 'Piel firme'}], mood: 'science', image: 'PHOTO:pepper2'});
S('pero sin vitamina c esos ladrillos no se convierten', 'talk', {title: 'Sin vitamina C, los ladrillos nunca son piel firme.', hot: ['nunca']});
S('ese dano que te llena de manchas', 'full', {caption: 'El sol te llena de manchas y arrugas finas.', stock: {q: 'age spots skin hands sun damage', type: 'video'}, ken: 'in'});
S('ayude a emparejar el tono', 'beforeafter', {kicker: 'Con constancia', title: 'Empareja el tono, aclara manchas', hot: ['manchas'], imageA: 'PHOTO:spots', imageB: 'PHOTO:clearskin', labelA: 'Con manchas', labelB: 'Más parejo', mood: 'science'});
S('la vitamina c y el huevo del desayuno se potencian', 'talk', {title: 'Vitamina C + huevo: se potencian entre sí.', hot: ['potencian']});
S('como la comes fresca y cruda', 'step', {step: 1, total: 1, title: 'Cómo comerla', hot: ['comerla'], sub: 'Fresca y cruda: el calor la destruye. Media naranja junto a tus huevos.', image: 'PHOTO:salad', mood: 'gold'});

/* ===================== RECAP + CIERRE ===================== */
S('dejame juntarlo todo', 'talk', {title: 'Juntémoslo todo.', hot: ['todo'], kicker: 'El resumen'});
S('para reconstruirla necesitas tres cosas', 'checklist', {kicker: 'Tu piel joven, en 3', title: 'Ladrillos, humedad y cemento', hot: ['tres'], items: ['Huevo → los ladrillos (proteína + biotina)', 'Sardina → la humedad (omega-3, calcio, B12)', 'Vitamina C → el cemento (pega el colágeno)'], mood: 'gold'});
S('empieza con uno', 'talk', {title: 'No los tres perfectos. Empieza con uno.', hot: ['uno']});
S('la belleza no estaba en el pomo caro', 'quote', {kicker: 'Recuérdalo', quote: 'La belleza no estaba en el pomo caro. Estaba en tu cocina.', author: 'Dra. Valeria Alcázar', role: 'Belleza natural', image: 'PHOTO:kitchen', mood: 'warmdark'});
S('la segunda si esto te hizo sentido suscribete', 'cta', {kicker: 'Antes de irte', title: 'Suscríbete y guarda el video', hot: ['Suscríbete'], sub: 'Cada semana, otro secreto de belleza barato que sí funciona.', buttonLabel: 'Suscríbete al canal', image: 'PHOTO:kitchen', mood: 'gold'});
S('la tercera ahi sigue el codigo', 'qr', {kicker: 'Su guía, gratis', title: 'Una última vez: escanee el código', hot: ['código'], sub: 'Abra la cámara, apunte al recuadro, y guárdelo. Toma 10 segundos.'});
S('ella es carmen de puebla', 'full', {caption: 'Carmen · Puebla · 68 · "Gracias"', kicker: 'Historias reales', stock: {q: 'happy older woman smiling grateful portrait', type: 'photo'}, ken: 'in'});
S('cuidate mucho que te quiero bella', 'talk', {title: 'Cuídate. Te quiero bella, sana y radiante.', hot: ['radiante'], kicker: 'Nos vemos pronto'});

/* ===================== RESOLVER ASSETS + DUR + FILL ===================== */
const FB = fallbackImg();
const photoNeed = [];   // PHOTO:tag placeholders → foto stock
function resolvePhoto(tag) {
  const map = {
    collagen: 'collagen skin fibers macro', menopause: 'mature woman thoughtful portrait', egg: 'eggs white bowl', eggyolk: 'egg yolk close up', eggs2: 'eggs carton rustic',
    sun: 'woman sun protection skin', boiledegg: 'boiled eggs halved plate', breakfast: 'healthy breakfast eggs plate', sugar: 'sugar cubes white',
    sardines2: 'sardines tin oil', calmskin: 'calm smooth woman skin', grape: 'green grapes fresh', raisin: 'raisins dried fruit', pepper2: 'red peppers fresh market',
    spots: 'age spots woman cheek', clearskin: 'even skin tone woman face', kitchen: 'rustic kitchen fresh vegetables', salad: 'fresh salad peppers citrus', sardinetoast: 'sardine toast bread',
  };
  const name = `ph_${tag}`;
  if (!needs.find((n) => n.name === name)) needs.push({name, query: map[tag] || tag, type: 'photo'});
  return havePhoto(name) ? `img/al_${name}.jpg` : FB;
}
// resolver placeholders PHOTO: en image/imageA/imageB
for (const c of P) {
  for (const k of ['image', 'imageA', 'imageB']) {
    if (typeof c[k] === 'string' && c[k].startsWith('PHOTO:')) c[k] = resolvePhoto(c[k].slice(6));
    if (c[k] == null && (c.kind === 'stat' || c.kind === 'hero' || c.kind === 'molecule' || c.kind === 'step' || c.kind === 'quote' || c.kind === 'cta')) c[k === 'image' ? 'image' : k] = c[k];
  }
  if (c.cards === 'CARDS') c.cards = cardImgs();
  // stock del propio beat (full)
  if (c._stock) {
    const {id, type} = c._stock;
    if (type === 'video') { c.src = haveVid(id) ? `broll/al_${id}.mp4` : null; c.video = true; }
    else { c.src = havePhoto(id) ? `img/al_${id}.jpg` : FB; c.video = false; }
    if (c.src == null) { c.src = FB; c.video = false; }  // sin clip → foto fallback (nunca hueco)
    delete c._stock;
  }
  // garantizar image no-nula en componentes que la muestran
  if (['stat', 'hero', 'quote', 'cta', 'beforeafter', 'step', 'molecule'].includes(c.kind)) {
    for (const k of ['image', 'imageA', 'imageB']) if (c[k] === null) c[k] = FB;
  }
}

// ordenar + dur hasta el próximo + cap con relleno de avatar (talk)
P.sort((a, b) => a.start - b.start);
const beats = [];
for (let i = 0; i < P.length; i++) {
  const c = P[i];
  const next = i + 1 < P.length ? P[i + 1].start : TOTAL;
  const gap = +(next - c.start).toFixed(2);
  const cap = c.kind === 'talk' ? Infinity : (c.kind === 'full' ? CAP_FULL : CAP_COMP);
  const dur = Math.max(0.6, Math.min(gap, cap));
  beats.push({...c, dur: +dur.toFixed(2)});
  // si un componente no llena el hueco hasta el próximo beat → avatar (talk) rellena
  if (gap - dur > 0.35 && c.kind !== 'talk') {
    beats.push({id: `fill_${c.id}`, start: +(c.start + dur).toFixed(2), dur: +(gap - dur).toFixed(2), kind: 'talk'});
  }
}
beats.sort((a, b) => a.start - b.start);

// ── CUTAWAYS: romper los tramos largos de charla con b-roll ambiente ──
const ambFiles = AMBIENT.map((a) => a.name).filter((n) => fs.existsSync(`public/broll/al_${n}.mp4`) || fs.existsSync(`public/img/al_${n}.jpg`));
const KENS = ['in', 'out', 'left', 'right'];
let ambK = 0;
const lastUsed = [];                     // evita repetir el mismo clip en ventana de 3
function nextAmb() {
  if (!ambFiles.length) return null;
  for (let tries = 0; tries < ambFiles.length; tries++) {
    const cand = ambFiles[ambK % ambFiles.length]; ambK++;
    if (!lastUsed.includes(cand)) { lastUsed.push(cand); if (lastUsed.length > 3) lastUsed.shift(); return cand; }
  }
  const c = ambFiles[ambK % ambFiles.length]; ambK++; return c;
}
const cutaways = [];
const CUT = 3.2, LEAD = 4.0, SEG = 6.6;  // avatar ~4s entre cutaways de 3.2s → ningún hueco solo-avatar >~5s
// operar sobre los HUECOS VISUALES reales (avatar solo), no sobre beats de charla sueltos
{
  const vis = beats.filter((b) => b.kind !== 'talk').map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
  const gaps = [];
  let prev = 0;
  for (const [s, e] of vis) { if (s - prev > 7.0) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (TOTAL - 9 - prev > 7.0) gaps.push([prev, TOTAL - 9]);  // últimos 9s = cierre a cara del doctor
  for (const [gs, ge] of gaps) {
    for (let off = LEAD; off + CUT <= (ge - gs) - 0.5; off += SEG) {
      const nm = nextAmb(); if (!nm) break;
      const isVid = fs.existsSync(`public/broll/al_${nm}.mp4`);
      cutaways.push({
        id: `cut_${nm}_${(gs + off).toFixed(0)}`, start: +(gs + off).toFixed(2), dur: CUT, kind: 'full',
        src: isVid ? `broll/al_${nm}.mp4` : `img/al_${nm}.jpg`, video: isVid, ken: KENS[cutaways.length % KENS.length], variant: 'whip',
      });
    }
  }
}
beats.push(...cutaways);
beats.sort((a, b) => a.start - b.start);
console.log(`cutaways ambiente insertados: ${cutaways.length}`);

// limpiar campos internos
for (const b of beats) { delete b._stock; delete b.stock; }
// SIN TEXTO sobre los videos de stock (el creador: cansa) → b-roll limpio, cero overlay
for (const b of beats) { if (b.kind === 'full') { delete b.caption; delete b.kicker; } }

/* ===================== EMITIR ===================== */
const TOTAL_FRAMES = Math.round(TOTAL * 30);
const header = `// cues_alimentos60.gen.ts — GENERADO por build_alimentos60.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_AL60 = ${TOTAL_FRAMES};
export const BEATS: Cue[] = ${JSON.stringify(beats, null, 2)};
`;
fs.writeFileSync('src/valeria/cues_alimentos60.gen.ts', header);

// needs de stock (dedup)
const seen = new Set();
const needsOut = needs.filter((n) => { if (seen.has(n.name)) return false; seen.add(n.name); return true; });
fs.writeFileSync('_alimentos60_stock.json', JSON.stringify(needsOut, null, 2));

// lista de assets para el farm
const assetSet = new Set();
for (const b of beats) {
  for (const k of ['src', 'image', 'imageA', 'imageB']) if (typeof b[k] === 'string' && !/^https?:/.test(b[k])) assetSet.add(b[k]);
  if (Array.isArray(b.cards)) for (const cd of b.cards) if (cd.image) assetSet.add(cd.image);
}
assetSet.add('qr_drfederer.png');
const assetsArr = [...assetSet];
// (kit valeria NO usa _blur.jpg → no se listan)
fs.writeFileSync(`_${SLUG}_assets.txt`, [`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...assetsArr].join('\n') + '\n');

// stats
const nComp = beats.filter((b) => !['talk', 'full'].includes(b.kind)).length;
const nFull = beats.filter((b) => b.kind === 'full').length;
const nTalk = beats.filter((b) => b.kind === 'talk').length;
const kinds = [...new Set(beats.filter((b) => b.kind !== 'talk').map((b) => b.kind))];
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${beats.length} · componentes: ${nComp} · b-roll: ${nFull} · talk: ${nTalk}`);
console.log(`tipos distintos: ${kinds.length} → ${kinds.join(', ')}`);
console.log(`anchors faltantes: ${missing} · needs de stock: ${needsOut.length}`);
console.log(`TOTAL_FRAMES: ${TOTAL_FRAMES} (${(TOTAL / 60).toFixed(1)}min)`);

function VAL_gold() { return '#B08D3C'; }
