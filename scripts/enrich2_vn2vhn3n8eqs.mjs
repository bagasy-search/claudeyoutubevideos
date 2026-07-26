// 2ª pasada: mete FedCohort (las personitas del estudio que se dividen en grupos) y
// FedPaper (la página del paper que se desliza y se resalta en amarillo) — las dos ideas
// que pidió el creador. Matchea por el NOMBRE de la Sequence (name="<Comp> bNNN"), así
// funciona tanto en beats vírgenes como en los que ya reemplazó la 1ª pasada.
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';
const MAIN = `src/VideoEdit/Main_${SLUG}.tsx`;
let src = fs.readFileSync(MAIN, 'utf8');

const IMPORTS = `import {FedCohort} from '../FedCohort_${SLUG}';
import {FedPaper} from '../FedPaper_${SLUG}';
`;

// ⚠️ los IMG: pueden venir ANIDADOS (groups[].image), así que la sustitución se hace
// sobre el JSON ya serializado, no solo sobre los valores de primer nivel.
const withStaticFiles = (json) =>
  json.replace(/"IMG:([^"]+)"/g, (_m, p) => `staticFile(${JSON.stringify(p)})`);

const toJsx = (props) =>
  Object.entries(props)
    .map(([k, v]) => `${k}={${withStaticFiles(JSON.stringify(v))}}`)
    .join(' ');

const P = (n) => `IMG:img/vn2_prod_${n}.png`;

/* ------------------------------------------------------------------ TABLA */
const OVER = [
  /* ---------- FedPaper · el estudio que se desliza y se resalta ---------- */
  {pi: 7, comp: 'FedPaper', props: {journal: 'Pediatric Dermatology', year: '2013', meta: 'Vol. 30 · Nº 1 · pp. 42–50', paperTitle: 'Effect of olive and sunflower seed oil on the adult skin barrier', authors: 'Danby SG, AlEnezi T, Sultan A, Chittock J, Brown K, Cork MJ · University of Sheffield', lines: ['Diecinueve adultos, seis gotas de aceite por antebrazo.', 'Dos veces por día durante cuatro semanas.', 'El aceite de oliva aumentó significativamente la pérdida de agua.', 'El aceite de girasol conservó la barrera.'], highlight: 2, note: 'también en piel sana', side: 'left'}},
  {pi: 82, comp: 'FedPaper', props: {journal: 'The Lancet', year: '', meta: 'Terapia de barrera en prematuros · Dhaka Shishu Hospital', paperTitle: 'Skin barrier therapy with sunflower seed oil in preterm infants', authors: 'Ensayo hospitalario · Bangladesh', lines: ['Aceite de girasol aplicado sobre la piel de bebés prematuros.', 'Reducción de alrededor del 26% en la mortalidad.', 'La barrera de la piel no es cosmética: es defensa.'], highlight: 1, note: 'un aceite de cocina', side: 'right'}},
  {pi: 152, comp: 'FedPaper', props: {journal: 'New England Journal of Medicine', year: '2012', meta: 'Images in Clinical Medicine · 366(16):e25', paperTitle: 'Unilateral dermatoheliosis', authors: 'Gordon JRS, Brieva JC · Northwestern University', lines: ['Hombre de 69 años, camionero de reparto.', 'Veinticinco años con el lado izquierdo contra la ventanilla.', 'Engrosamiento y arrugamiento gradual de ese lado de la cara.'], highlight: 1, note: 'con la ventana cerrada', side: 'left'}},
  {pi: 167, comp: 'FedPaper', props: {journal: 'Clinical, Cosmetic and Investigational Dermatology', year: '2013', meta: 'Vol. 6 · pp. 221–232', paperTitle: 'Effect of the sun on visible clinical signs of aging in Caucasian skin', authors: 'Flament F, Bazin R, Laquieze S, Rubert V, Simonpietri E, Piot B', lines: ['Se midieron los signos visibles del envejecimiento facial.', 'La exposición solar explica el 80,3% de esos signos.', 'No es el calendario: es el sol.'], highlight: 1, note: '80%', side: 'right'}},
  {pi: 228, comp: 'FedPaper', props: {journal: 'New England Journal of Medicine', year: '2003', meta: 'Cohorte de ~14.000 niños seguidos desde el embarazo', paperTitle: 'Factors associated with the development of peanut allergy in childhood', authors: 'Lack G, Fox D, Northstone K, Golding J', lines: ['El 84% de los que terminaron alérgicos al maní', 'había estado expuesto a cremas con aceite de maní de bebé.', 'La piel dañada es una puerta de entrada.'], highlight: 2, note: 'ojo con los frutos secos', side: 'left'}},
  {pi: 287, comp: 'FedPaper', props: {journal: 'Annals of Internal Medicine', year: '2013', meta: '158(11):781–790 · Nambour, Australia', paperTitle: 'Sunscreen and prevention of skin aging: a randomized trial', authors: 'Hughes MCB, Williams GM, Baker P, Green AC', lines: ['Novecientos tres adultos, asignados al azar.', 'Unos con protector solar todos los días, otros cuando querían.', 'El envejecimiento de la piel fue un 24% menor con el uso diario.'], highlight: 2, note: 'el único ensayo que existe', side: 'right'}},
  {pi: 292, comp: 'FedPaper', props: {journal: 'New England Journal of Medicine', year: '1993', meta: '329(8):530–535 · 29 pacientes, 10 a 12 meses', paperTitle: 'Restoration of collagen formation in photodamaged human skin by tretinoin', authors: 'Griffiths CE, Russman AN, Majmudar G, Singer RS, Hamilton TA, Voorhees JJ', lines: ['Tretinoína tópica contra vehículo, medido en biopsia.', 'La formación de colágeno tipo uno aumentó un 80%.', 'Con el vehículo, bajó un 14%.'], highlight: 1, note: 'esto sí toca el colágeno', side: 'left'}},

  /* ---------- FedCohort · las personitas que se dividen en grupos -------- */
  {pi: 8, comp: 'FedCohort', props: {n: 19, kicker: 'Universidad de Sheffield · 2013', title: 'Diecinueve adultos, un brazo cada uno', sub: 'seis gotas, dos veces por día, cuatro semanas', unit: 'adultos', groups: [{label: 'Aceite de oliva', image: P('oliva'), tone: 'bad', count: 10, result: 'perdió más agua'}, {label: 'Aceite de girasol', image: P('girasol'), tone: 'good', count: 9, result: 'conservó la barrera'}]}},
  {pi: 110, comp: 'FedCohort', props: {n: 20, kicker: 'Cabeza a cabeza · coco contra oliva', title: 'Veinte pacientes con estafilococo dorado', sub: 'la piel colonizada antes de empezar', unit: 'pacientes', groups: [{label: 'Coco virgen', image: P('coco'), tone: 'good', count: 8, result: 'quedó 1'}, {label: 'Aceite de oliva', image: P('oliva'), tone: 'bad', count: 12, result: 'quedaron 6'}]}},
  {pi: 132, comp: 'FedCohort', props: {n: 27, kicker: 'Rosa mosqueta · estudio piloto', title: 'Veintisiete personas, sin grupo control', sub: 'sin placebo y sin ciego: es una señal, no una prueba', unit: 'voluntarios', groups: [{label: 'Rosa mosqueta', image: P('argan'), tone: 'neutral', count: 27, result: 'sin comparador'}]}},
  {pi: 173, comp: 'FedCohort', props: {n: 60, kicker: 'Clinical Interventions in Aging · 2015', title: 'Sesenta mujeres, sesenta días', sub: 'de cuarenta y nueve a sesenta y un años', unit: 'mujeres', groups: [{label: 'Argán', image: P('argan'), tone: 'good', count: 30, value: 15, suffix: '%', result: 'más elasticidad'}, {label: 'Aceite de oliva', image: P('oliva'), tone: 'bad', count: 30, value: 0, suffix: '%', result: 'no mejoró'}]}},
  {pi: 242, comp: 'FedCohort', props: {n: 15, kicker: 'Dermatologic Surgery · 1999', title: 'Quince pacientes operados', sub: 'cada cicatriz partida en dos mitades', unit: 'pacientes', groups: [{label: 'Crema sola', image: P('nada'), tone: 'neutral', count: 8, result: 'mitad A'}, {label: 'Crema + vitamina E', image: P('vitE'), tone: 'bad', count: 7, value: 90, suffix: '%', result: 'sin efecto o peor'}]}},
  {pi: 288, comp: 'FedCohort', props: {n: 903, maxFigures: 36, kicker: 'Nambour, Australia', title: 'Novecientos tres adultos', sub: 'repartidos al azar durante cuatro años y medio', unit: 'adultos', groups: [{label: 'Protector todos los días', image: P('solar'), tone: 'good', count: 18, value: 24, suffix: '%', result: 'menos envejecimiento'}, {label: 'Cuando querían', image: P('nada'), tone: 'bad', count: 18, result: 'sin cambio'}]}},
];

/* --------------------------------------------------------------- APLICAR */
if (!src.includes(`FedCohort_${SLUG}`)) {
  const before = src;
  src = src.replace(/\} from '\.\.\/FedererKit';\r?\n/, (mm) => mm + IMPORTS);
  if (src === before) {
    console.error('✗ no pude insertar los imports');
    process.exit(1);
  }
}

let ok = 0;
const fallos = [];
for (const o of OVER) {
  const id = 'b' + String(o.pi).padStart(3, '0');
  // el elemento JSX que está adentro de la Sequence de ESE beat, sea cual sea el componente
  const re = new RegExp(
    `(name="[^"]* ${id}">\\s*\\r?\\n\\s*)<\\w+[\\s\\S]*?totalF=\\{(\\d+)\\} accent=\\{ACCENT\\} \\/>`
  );
  const m = src.match(re);
  if (!m) {
    fallos.push(o.pi);
    continue;
  }
  src = src.replace(re, `$1<${o.comp} ${toJsx(o.props)} totalF={${m[2]}} accent={ACCENT} />`);
  ok++;
}

if (fallos.length) {
  console.error('✗ no encontré los beats:', fallos.join(', '));
  process.exit(1);
}
fs.writeFileSync(MAIN, src);
console.log('FedCohort + FedPaper inyectados:', ok);
