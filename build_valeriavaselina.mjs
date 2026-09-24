// build_valeriavaselina.mjs — Doctora Valeria Alcázar · "VASELINA mezclada con vitamina E" (piel +60)
// Kit valeria-vintage (editorial claro). DIRECTOR + generador: escenas ancladas al ms de Whisper.
//   Motor: L0 avatar persistente + escenas Val* opacas (Main_valeriavaselina.tsx).
//   Salidas: src/valeria/cues_valeriavaselina.gen.ts · _valeriavaselina_stock.json (needs)
//            _valeriavaselina_assets.txt (para el farm)
//   CTA = RETENCIÓN (guardar/suscribir/medidas en descripción). SIN QR, sin precio/link en voz.
//   Material 100% stock real (Pexels) + avatar. Prefijo vv_ (anti-colisión public/broll compartida).
// 2 pasadas: 1) corré → escribe needs → fetch stock → 2) corré → mapea assets.
import fs from 'fs';

const SLUG = 'valeriavaselina';
const PFX = 'vv_';
const TOTAL = 1392.58;               // duración exacta del avatar (ffprobe opt.mp4)
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
const haveVid = (id) => fs.existsSync(`public/broll/${PFX}${id}.mp4`);
const havePhoto = (id) => fs.existsSync(`public/img/${PFX}${id}.jpg`);
const MED = (f) => (fs.existsSync(`public/med/${f}`) ? `med/${f}` : null);
function fallbackImg() {
  const imgs = fs.existsSync('public/img') ? fs.readdirSync('public/img').filter((f) => new RegExp(`^${PFX}.*\\.jpg$`, 'i').test(f)) : [];
  if (imgs.length) return `img/${imgs[Math.floor(imgs.length / 2)]}`;
  return MED('crema.png') || MED('vaselina.png') || null;
}

// ── PLAN (DIRECTOR) ──
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

// ── CARRUSEL: las 7 formas de usar la mezcla (ValOilCarousel) ──
const CARDS = [
  {index: 'N.º 01', name: 'Contorno de ojos', tag: 'Arrugas finas', img: 'card_ojos', q: 'woman eye area skincare fingertip closeup'},
  {index: 'N.º 02', name: 'Manos', tag: 'Manchas de edad', img: 'card_manos', q: 'older woman hands age spots close up'},
  {index: 'N.º 03', name: 'Surcos y boca', tag: 'Líneas marcadas', img: 'card_surcos', q: 'nasolabial folds woman face skincare'},
  {index: 'N.º 04', name: 'Cuello y escote', tag: 'Firmeza', img: 'card_cuello', q: 'woman neck decollete skincare cream'},
  {index: 'N.º 05', name: 'Labios', tag: 'Hidratación', img: 'card_labios', q: 'woman applying lip balm closeup'},
  {index: 'N.º 06', name: 'Pestañas y cejas', tag: 'Cuidado', img: 'card_cejas', q: 'eyelashes eyebrows brush closeup woman'},
  {index: 'N.º 07', name: 'Codos y talones', tag: 'Piel áspera', img: 'card_pies', q: 'dry heels feet cracked skin cream'},
];
for (const c of CARDS) needs.push({name: c.img, query: c.q, type: 'photo'});
const cardImgs = () => CARDS.map((c) => ({index: c.index, name: c.name, tag: c.tag, image: (havePhoto(c.img) ? `img/${PFX}${c.img}.jpg` : (fallbackImg() || `img/${PFX}${CARDS[0].img}.jpg`))}));

// POOL "ambiente" on-topic para cutaways en tramos largos de charla (rota, sin repetir adyacente)
const AMBIENT = [
  'mature woman touching face skin glow', 'petroleum jelly jar open close up', 'amber dropper oil bottle drops',
  'older woman applying face cream night', 'water drop skin hydration macro', 'age spots hands mature woman',
  'woman looking mirror morning skin', 'skin texture macro close up smooth', 'vitamin E capsules golden oil',
  'senior woman smiling portrait natural', 'rosemary sprig herb close up', 'woman neck skincare cream applying',
  'vintage vanity mirror makeup table', 'hand scooping cream jar finger', 'glowing hydrated skin cheek closeup',
  'elderly woman peaceful window light', 'facial oil dropper skincare routine', 'woman eye wrinkles crows feet closeup',
  'cotton gloves hands night care', 'soft muted botanical oil bottle', 'mature woman relaxed bedroom night',
  'fingertip cream forehead wrinkle', 'clean minimal bathroom shelf jar', 'dry cracked heel foot skin',
].map((q, i) => ({name: `amb${i + 1}`, query: q}));
for (const a of AMBIENT) needs.push({name: a.name, query: a.query, type: 'video'});

/* ===================== HOOK / APERTURA ===================== */
S(0, 'talk', {title: 'Un frasco de 2 €. Su piel, años más joven.', hot: ['2 €'], kicker: 'Dra. Valeria Alcázar · Belleza vintage'});
S('se convierte en la crema antiedad', 'full', {stock: {q: 'luxury face cream jars expensive cosmetics', type: 'video'}, ken: 'in'});
S('estoy hablando de la vaselina', 'hero', {kicker: 'El secreto de 2 euros', title: 'La vaselina de toda la vida', hot: ['vaselina'], sub: 'Sí, esa misma que ya tiene en el cajón del baño.', image: 'PHOTO:jar', side: 'right', mood: 'gold'});
S('que las estrellas de cine escondian', 'full', {stock: {q: 'vintage hollywood glamour woman vanity', type: 'video'}, ken: 'out'});
S('mas rellena mas firme mas suave', 'full', {stock: {q: 'mature woman smooth glowing skin face', type: 'video'}, ken: 'in'});
S('las manchas de la edad cada vez mas tenues', 'full', {stock: {q: 'even skin tone mature woman cheek', type: 'video'}, ken: 'left'});
S('yo soy la doctora valeria alcazar', 'lowerthird', {name: 'Dra. Valeria Alcázar', role: 'Medicina estética · Belleza vintage', topic: 'Vaselina + vitamina E'});
S('que se quede conmigo hasta el final', 'talk', {title: 'Quédese hasta el final: la receta y las 7 formas.', hot: ['7 formas'], kicker: 'No se lo pierda'});
S('cuando uno entiende el por que', 'talk', {title: 'Cuando entiende el porqué, deja de gastar de más.', hot: ['porqué']});

/* ===================== MECANISMO 1 · EL SELLADO 98% ===================== */
S('mucha gente creyo que la vaselina era un producto pobre', 'full', {stock: {q: 'petroleum jelly jar simple product', type: 'video'}, ken: 'in'});
S('cuyo nombre tecnico es petrolato', 'hero', {kicker: 'Su función secreta', title: 'Sella el agua dentro de la piel', hot: ['agua'], sub: 'El ingrediente más eficaz del mundo para una sola cosa.', image: 'PHOTO:seal', side: 'left', mood: 'science'});
S('en mas de un 98', 'stat', {kicker: 'Estudios dermatológicos', value: 98, suffix: '%', label: 'menos pérdida de agua en la piel', sub: 'El sellador más potente que existe. Ninguna crema se acerca.', image: 'PHOTO:waterdrop', mood: 'science'});
S('entre un 20 y un 30', 'beforeafter', {kicker: 'Vaselina vs. aceite de oliva', title: 'No hay comparación', hot: ['comparación'], imageA: 'PHOTO:oliveoil', imageB: 'PHOTO:vaselineseal', labelA: 'Oliva: 20-30 %', labelB: 'Vaselina: 98 %', mood: 'science'});
S('170 veces mas capacidad', 'stat', {kicker: 'Frente al aceite de oliva', value: 170, suffix: '×', label: 'más capacidad de frenar la evaporación', sub: 'Ciento setenta veces. No es una diferencia: es otro mundo.', image: 'PHOTO:vaselineseal', mood: 'cool'});
S('una piel deshidratada se ve apagada', 'full', {stock: {q: 'dry dull mature skin texture closeup', type: 'video'}, ken: 'in'});
S('la piel se rellena desde dentro', 'full', {stock: {q: 'plump hydrated skin glow woman face', type: 'video'}, ken: 'out'});
S('lo llaman en ingles slugging', 'talk', {title: 'Lo llaman "slugging". Su abuela ya lo hacía.', hot: ['slugging'], accent: '#B08D3C'});

/* ===================== MECANISMO 2 · EL DATO ÚNICO (2016) ===================== */
S('en el ano 2016 se publico', 'stat', {kicker: 'J. Allergy Clin. Immunol.', value: 2016, label: 'el estudio que lo cambió todo', sub: 'Descubrieron que la vaselina NO es un ingrediente inerte.', image: 'PHOTO:study', mood: 'science', decimals: 0});
S('la vaselina no es inerte en absoluto', 'talk', {title: 'No solo sella: le da una orden a su piel.', hot: ['orden']});
S('se llaman filagrina y loricrina', 'molecule', {kicker: 'Las proteínas de la piel joven', title: 'Filagrina y loricrina', hot: ['juventud'], centerLabel: 'Piel firme', sub: 'El ladrillo y el cemento de la muralla de su piel.', nodes: [{label: 'Filagrina'}, {label: 'Loricrina'}, {label: 'Firmeza'}], image: 'PHOTO:collagen', mood: 'science'});
S('se volvia mas grueso mas resistente', 'full', {stock: {q: 'skin cross section layers macro', type: 'video'}, ken: 'in'});
S('lo hace un frasco de menos de dos', 'hero', {kicker: 'La piel se reconstruye sola', title: 'Lo que no hace una crema de 30 €', hot: ['30 €'], sub: 'Lo hace un frasco de menos de dos.', image: 'PHOTO:jar2', side: 'right', mood: 'gold'});

/* ===================== MITO · LOS POROS ===================== */
S('el mito mas grande que existe sobre la vaselina', 'talk', {title: 'El mito más grande sobre la vaselina.', hot: ['mito'], kicker: 'A desmontar', accent: '#B5643C'});
S('la vaselina tapa los poros', 'beforeafter', {kicker: 'Mito vs. verdad', title: '¿Tapa los poros?', hot: ['poros'], imageA: 'PHOTO:pores', imageB: 'PHOTO:cleanskin', labelA: 'El mito', labelB: 'No comedogénico', mood: 'science'});
S('se clasifica como no comedogenico', 'hero', {kicker: 'Lo que dice la ciencia', title: 'No tapona los poros', hot: ['No'], sub: 'Sus moléculas son demasiado grandes para meterse dentro del poro.', image: 'PHOTO:cleanskin', side: 'left', mood: 'science'});

/* ===================== EXPECTATIVAS REALES ===================== */
S('muy clara con los tiempos', 'talk', {title: 'Sea justa consigo misma. Le doy los tiempos.', hot: ['tiempos'], kicker: 'Nada de promesas infladas'});
S('la piel se ve mas rellena mas jugosa', 'stat', {kicker: 'La primera mañana', value: 1, suffix: '.ª noche', label: 'ya la nota más rellena y suave', sub: 'El efecto inmediato del agua sellada. Por eso: al instante.', image: 'PHOTO:morningskin', mood: 'cool'});
S('eso se construye semana a semana', 'stat', {kicker: 'Lo que se queda', value: 4, suffix: ' semanas', label: 'firmeza y manchas más tenues', sub: 'Compare una foto de hoy con una de dentro de un mes.', image: 'PHOTO:month', mood: 'gold'});
S('lo inmediato la engancha lo constante la transforma', 'quote', {kicker: 'Recuérdelo', quote: 'Lo inmediato la engancha; lo constante la transforma.', author: 'Dra. Valeria Alcázar', role: 'Belleza vintage', image: 'PHOTO:calmwoman', mood: 'warmdark'});

/* ===================== EL TRUCO · CANDADO VACÍO + VITAMINA E ===================== */
S('es como un candado perfecto', 'hero', {kicker: 'El error de usarla sola', title: 'El mejor candado del mundo', hot: ['candado'], sub: 'Pero un candado vacío: sella, pero no nutre.', image: 'PHOTO:lock', side: 'right', mood: 'warmdark'});
S('en el frasquito con gotero el aceite', 'full', {stock: {q: 'amber glass dropper bottle oil drops', type: 'video'}, ken: 'in'});
S('el aceite de vitamina e', 'hero', {kicker: 'Con qué se mezcla', title: 'Vaselina + aceite de vitamina E', hot: ['vitamina E'], sub: 'El antioxidante más estudiado para la piel, por muy poco dinero.', image: 'PHOTO:vite', side: 'left', mood: 'gold'});
S('se llaman radicales libres', 'molecule', {kicker: 'Qué envejece su piel', title: 'Los radicales libres', hot: ['oxidan'], centerLabel: 'Daño', sub: 'La chispa que oxida la piel: sol, contaminación, años.', nodes: [{label: 'Manchas'}, {label: 'Flacidez'}, {label: 'Menos luz'}], image: 'PHOTO:oxidation', mood: 'warmdark'});
S('igual que se oxida un clavo a la intemperie', 'full', {stock: {q: 'rusty nail metal oxidation close up', type: 'video'}, ken: 'in'});
S('la vitamina e es como el bombero', 'molecule', {kicker: 'Qué hace la vitamina E', title: 'El bombero de su piel', hot: ['antioxidante'], centerLabel: 'Vitamina E', sub: 'Neutraliza los radicales libres antes de que hagan daño.', nodes: [{label: 'Protege del sol'}, {label: 'Aclara manchas'}, {label: 'Repara'}], image: 'PHOTO:vite2', mood: 'science'});
S('la hiperpigmentacion se vean mas tenues', 'beforeafter', {kicker: 'Con constancia', title: 'Las manchas, más tenues', hot: ['manchas'], imageA: 'PHOTO:spots', imageB: 'PHOTO:clearskin', labelA: 'Con manchas', labelB: 'Más parejo', mood: 'science'});
S('ocurren tres cosas a la vez', 'checklist', {kicker: 'Por qué funciona tan bien', title: 'Tres efectos en un solo gesto', hot: ['Tres'], items: ['Sella su propia agua → piel rellena a la mañana', 'Atrapa la vitamina E toda la noche → combate manchas', 'Ordena a la piel fabricar proteínas de firmeza'], mood: 'gold'});

/* ===================== HISTORIA VINTAGE ===================== */
S('se patento en el ano 1872', 'stat', {kicker: 'No es un invento moderno', value: 1872, label: 'el año en que se patentó la vaselina', sub: 'Más de 150 años ganándose la confianza de la gente.', image: 'PHOTO:vintage', mood: 'warmdark', decimals: 0});
S('un joven quimico llamado robert chesebrough', 'full', {stock: {q: 'vintage oil field workers old photo', type: 'video'}, ken: 'out'});
S('una lata de vaselina cada minuto', 'stat', {kicker: 'Estados Unidos, 1874', value: 1, suffix: ' lata/min', label: 'se vendía en todo el país', sub: 'Apenas dos años después de su lanzamiento.', image: 'PHOTO:vintagejar', mood: 'gold'});
S('tomaba una cucharada de vaselina cada dia', 'talk', {title: 'Su inventor la tomaba a diario. Vivió 96 años.', hot: ['96'], kicker: 'Anécdota'});
S('marilyn monroe aquella mujer de piel luminosa', 'full', {stock: {q: 'classic hollywood beauty vintage portrait woman', type: 'video'}, ken: 'in'});
S('el mismo secreto humilde en el cajon', 'full', {stock: {q: 'vintage bathroom cabinet jar cream', type: 'video'}, ken: 'left'});

/* ===================== LA RECETA ===================== */
S('le voy a dar la receta', 'talk', {title: 'La receta, y las 7 formas de usarla.', hot: ['receta'], kicker: 'Tome nota'});
S('va a necesitar vaselina pura', 'step', {step: 1, total: 3, title: 'Vaselina pura y neutra', hot: ['pura'], sub: 'La blanca de siempre, sin perfumes ni colores.', image: 'PHOTO:vaselinepure', mood: 'gold'});
S('va a necesitar aceite de vitamina e', 'step', {step: 2, total: 3, title: 'Aceite de vitamina E', hot: ['vitamina E'], sub: 'En gotero de farmacia, o cápsulas pinchadas con un alfiler.', image: 'PHOTO:vitecaps', mood: 'science'});
S('mezcla bien con el mango de una cucharilla', 'step', {step: 3, total: 3, title: 'Mezcle en un frasquito', hot: ['frasquito'], sub: 'Hasta una crema homogénea. Le dura semanas.', image: 'PHOTO:mixjar', mood: 'gold'});
S('las cantidades exactas estan apuntadas abajo', 'talk', {title: 'Las medidas exactas, apuntadas en la descripción.', hot: ['descripción'], kicker: 'Ahí abajo'});
S('de aceite de rosa mosqueta', 'full', {stock: {q: 'rosehip oil dropper bottle botanical', type: 'video'}, ken: 'in'});
S('una ramita de romero limpia y seca', 'full', {stock: {q: 'fresh rosemary sprig herb close up', type: 'video'}, ken: 'out'});

/* ===================== LAS 7 FORMAS (CARRUSEL) ===================== */
S('y es la reina de todas el contorno de los ojos', 'carousel', {kicker: 'Forma 1 · Contorno de ojos', cards: 'CARDS', focus: 0, intro: true, accent: '#B08D3C'});
S('las famosas patas de gallo', 'full', {stock: {q: 'crows feet eye wrinkles woman closeup', type: 'video'}, ken: 'in'});
S('con el dedo anular que es el mas delicado', 'full', {stock: {q: 'ring finger dabbing eye cream skincare', type: 'video'}, ken: 'out'});
S('las manchas de la edad en el dorso de las manos', 'carousel', {kicker: 'Forma 2 · Manos', cards: 'CARDS', focus: 1});
S('unos guantes de algodon finos para dormir', 'full', {stock: {q: 'cotton gloves hands night skincare', type: 'video'}, ken: 'in'});
S('los surcos que van de la nariz a la boca', 'carousel', {kicker: 'Forma 3 · Surcos y boca', cards: 'CARDS', focus: 2});
S('siempre hacia arriba nunca hacia abajo', 'full', {stock: {q: 'woman face massage upward skincare', type: 'video'}, ken: 'out'});
S('el cuello y el escote', 'carousel', {kicker: 'Forma 4 · Cuello y escote', cards: 'CARDS', focus: 3});
S('la piel muy fina y con pocas glandulas de grasa', 'full', {stock: {q: 'woman neck decollete skin closeup', type: 'video'}, ken: 'in'});
S('los labios y el contorno de la boca', 'carousel', {kicker: 'Forma 5 · Labios', cards: 'CARDS', focus: 4});
S('las pestanas y las cejas', 'carousel', {kicker: 'Forma 6 · Pestañas y cejas', cards: 'CARDS', focus: 5});
S('los codos las rodillas y los talones', 'carousel', {kicker: 'Forma 7 · Codos y talones', cards: 'CARDS', focus: 6});
S('un calcetin de algodon encima', 'full', {stock: {q: 'foot heel cream cotton sock night', type: 'video'}, ken: 'out'});

/* ===================== PRECAUCIONES ===================== */
S('siempre siempre haga una prueba antes', 'talk', {title: 'Yo soy médica: no la dejo sin precauciones.', hot: ['precauciones'], kicker: 'Importante', accent: '#B5643C'});
S('la cara interna del antebrazo', 'step', {step: 1, total: 4, title: 'Prueba en el antebrazo', hot: ['prueba'], sub: 'Un poco en la cara interna del brazo. Espere 24 horas.', image: 'PHOTO:patchtest', mood: 'science'});
S('esta mezcla es un tratamiento de noche', 'step', {step: 2, total: 4, title: 'Solo de noche', hot: ['noche'], sub: 'De día, su protector solar. Eso no se lo salta nadie.', image: 'PHOTO:night', mood: 'cool'});
S('si usted tiene la piel muy grasa', 'step', {step: 3, total: 4, title: 'Piel grasa o con acné', hot: ['grasa'], sub: 'En la cara, no. Resérvela para manos, cuello, codos y pies.', image: 'PHOTO:oilyskin', mood: 'warmdark'});
S('use siempre vaselina pura y neutra', 'step', {step: 4, total: 4, title: 'Productos simples', hot: ['simples'], sub: 'Sin perfumes ni colorantes: son los que dan reacciones.', image: 'PHOTO:vaselinepure', mood: 'gold'});

/* ===================== CIERRE + CTA RETENCIÓN ===================== */
S('la piel no entiende de precios ni de marcas', 'quote', {kicker: 'La verdad de fondo', quote: 'La piel no entiende de precios. Entiende de constancia.', author: 'Dra. Valeria Alcázar', role: 'Belleza vintage', image: 'PHOTO:calmwoman2', mood: 'warmdark'});
S('estaba todo este tiempo en el cajon de su bano', 'hero', {kicker: 'No estaba en la crema cara', title: 'Estaba en el cajón de su baño', hot: ['baño'], sub: 'La juventud de la piel, por menos de dos euros.', image: 'PHOTO:jar3', side: 'right', mood: 'gold'});
S('esta misma noche antes de acostarse', 'talk', {title: 'Esta misma noche: prepare su frasquito.', hot: ['noche'], kicker: 'Empiece hoy'});
S('guardelo para que no lo pierda', 'cta', {kicker: 'Antes de irse', title: 'Guarde el video y suscríbase', hot: ['Suscríbase'], sub: 'Cada semana, otro secreto de belleza barato que sí funciona.', buttonLabel: 'Suscríbase al canal', image: 'PHOTO:calmwoman', mood: 'gold'});
S('se las he dejado apuntadas ahi abajo', 'talk', {title: 'Las medidas exactas están en la descripción.', hot: ['descripción'], kicker: 'Ahí abajo, gratis'});
S('un abrazo grande de su doctora', 'talk', {title: 'Cuídese esa piel. Un abrazo, doctora Valeria.', hot: ['abrazo'], kicker: 'Nos vemos pronto'});

/* ===================== RESOLVER ASSETS + DUR + FILL ===================== */
const FB = fallbackImg();
function resolvePhoto(tag) {
  const map = {
    jar: 'petroleum jelly jar open', jar2: 'vaseline jar white blue lid', jar3: 'petroleum jelly jar bathroom',
    seal: 'water sealed skin barrier macro', waterdrop: 'water drop skin macro hydration', oliveoil: 'olive oil pouring bottle',
    vaselineseal: 'petroleum jelly texture close up', collagen: 'collagen skin fibers macro', study: 'medical research paper microscope',
    pores: 'facial pores skin close up', cleanskin: 'clear smooth skin woman face', morningskin: 'woman fresh morning skin glow',
    month: 'mature woman radiant skin smiling', calmwoman: 'calm mature woman peaceful portrait', calmwoman2: 'serene older woman natural beauty',
    lock: 'brass padlock closed close up', vite: 'vitamin E oil golden dropper', vite2: 'vitamin E capsules oil golden',
    oxidation: 'cut apple oxidizing brown', spots: 'age spots woman cheek closeup', clearskin: 'even skin tone woman face',
    vintage: 'vintage apothecary jar antique', vintagejar: 'old vaseline tin antique', vitecaps: 'vitamin E soft capsules gold',
    vaselinepure: 'white petroleum jelly jar plain', mixjar: 'small glass jar cream mixing', patchtest: 'forearm skin patch test cream',
    night: 'woman night skincare routine bedroom', oilyskin: 'woman oily skin face closeup',
  };
  const name = `ph_${tag}`;
  if (!needs.find((n) => n.name === name)) needs.push({name, query: map[tag] || tag, type: 'photo'});
  return havePhoto(name) ? `img/${PFX}${name}.jpg` : FB;
}
for (const c of P) {
  for (const k of ['image', 'imageA', 'imageB']) {
    if (typeof c[k] === 'string' && c[k].startsWith('PHOTO:')) c[k] = resolvePhoto(c[k].slice(6));
  }
  if (c.cards === 'CARDS') c.cards = cardImgs();
  if (c._stock) {
    const {id, type} = c._stock;
    if (type === 'video') { c.src = haveVid(id) ? `broll/${PFX}${id}.mp4` : null; c.video = true; }
    else { c.src = havePhoto(id) ? `img/${PFX}${id}.jpg` : FB; c.video = false; }
    if (c.src == null) { c.src = FB; c.video = false; }
    delete c._stock;
  }
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
  const cap = c.kind === 'talk' ? Infinity : (c.kind === 'full' ? CAP_FULL : (c.kind === 'carousel' ? 5.5 : CAP_COMP));
  const dur = Math.max(0.6, Math.min(gap, cap));
  beats.push({...c, dur: +dur.toFixed(2)});
  if (gap - dur > 0.35 && c.kind !== 'talk') {
    beats.push({id: `fill_${c.id}`, start: +(c.start + dur).toFixed(2), dur: +(gap - dur).toFixed(2), kind: 'talk'});
  }
}
beats.sort((a, b) => a.start - b.start);

// ── CUTAWAYS ambiente: romper tramos largos de charla (avatar solo) ──
const ambFiles = AMBIENT.map((a) => a.name).filter((n) => fs.existsSync(`public/broll/${PFX}${n}.mp4`) || fs.existsSync(`public/img/${PFX}${n}.jpg`));
const KENS = ['in', 'out', 'left', 'right'];
let ambK = 0;
const lastUsed = [];
function nextAmb() {
  if (!ambFiles.length) return null;
  for (let tries = 0; tries < ambFiles.length; tries++) {
    const cand = ambFiles[ambK % ambFiles.length]; ambK++;
    if (!lastUsed.includes(cand)) { lastUsed.push(cand); if (lastUsed.length > 3) lastUsed.shift(); return cand; }
  }
  const c = ambFiles[ambK % ambFiles.length]; ambK++; return c;
}
const cutaways = [];
const CUT = 3.7, LEAD = 4.2, SEG = 7.6;
{
  const vis = beats.filter((b) => b.kind !== 'talk').map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
  const gaps = [];
  let prev = 0;
  for (const [s, e] of vis) { if (s - prev > 7.0) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (TOTAL - 9 - prev > 7.0) gaps.push([prev, TOTAL - 9]);
  for (const [gs, ge] of gaps) {
    for (let off = LEAD; off + CUT <= (ge - gs) - 0.5; off += SEG) {
      const nm = nextAmb(); if (!nm) break;
      const isVid = fs.existsSync(`public/broll/${PFX}${nm}.mp4`);
      cutaways.push({
        id: `cut_${nm}_${(gs + off).toFixed(0)}`, start: +(gs + off).toFixed(2), dur: CUT, kind: 'full',
        src: isVid ? `broll/${PFX}${nm}.mp4` : `img/${PFX}${nm}.jpg`, video: isVid, ken: KENS[cutaways.length % KENS.length], variant: 'whip',
      });
    }
  }
}
beats.push(...cutaways);
beats.sort((a, b) => a.start - b.start);
console.log(`cutaways ambiente insertados: ${cutaways.length}`);

// limpiar campos internos + b-roll sin overlay de texto
for (const b of beats) { delete b._stock; delete b.stock; }
for (const b of beats) { if (b.kind === 'full') { delete b.caption; delete b.kicker; } }

/* ===================== EMITIR ===================== */
const TOTAL_FRAMES = Math.round(TOTAL * 30);
const header = `// cues_valeriavaselina.gen.ts — GENERADO por build_valeriavaselina.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_VV = ${TOTAL_FRAMES};
export const BEATS: Cue[] = ${JSON.stringify(beats, null, 2)};
`;
fs.writeFileSync('src/valeria/cues_valeriavaselina.gen.ts', header);

// needs de stock (dedup)
const seen = new Set();
const needsOut = needs.filter((n) => { if (seen.has(n.name)) return false; seen.add(n.name); return true; });
fs.writeFileSync('_valeriavaselina_stock.json', JSON.stringify(needsOut, null, 2));

// lista de assets para el farm
const assetSet = new Set();
for (const b of beats) {
  for (const k of ['src', 'image', 'imageA', 'imageB']) if (typeof b[k] === 'string' && !/^https?:/.test(b[k])) assetSet.add(b[k]);
  if (Array.isArray(b.cards)) for (const cd of b.cards) if (cd.image) assetSet.add(cd.image);
}
const assetsArr = [...assetSet];
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
