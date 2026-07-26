// Inyecta los 9 componentes nuevos en el build ya montado, en los momentos exactos donde
// el guion los pide. Reemplaza el elemento JSX del beat (que referenciaba P[i]) por el
// componente nuevo con props inline. NO toca tiempos: la duración del video no cambia,
// así que un re-render parcial por chunks sigue siendo válido.
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';
const MAIN = `src/VideoEdit/Main_${SLUG}.tsx`;
let src = fs.readFileSync(MAIN, 'utf8');

const IMPORTS = `import {FedBrickWall} from '../FedBrickWall_${SLUG}';
import {FedRivet} from '../FedRivet_${SLUG}';
import {FedTrial} from '../FedTrial_${SLUG}';
import {FedLabelScan} from '../FedLabelScan_${SLUG}';
import {FedSplitFace} from '../FedSplitFace_${SLUG}';
import {FedSeal} from '../FedSeal_${SLUG}';
import {FedOilBars} from '../FedOilBars_${SLUG}';
import {FedBlacklist} from '../FedBlacklist_${SLUG}';
import {FedRoutineRing} from '../FedRoutineRing_${SLUG}';
`;

// serializa props a atributos JSX de forma segura (strings con comillas, objetos, arrays)
const toJsx = (props) =>
  Object.entries(props)
    .map(([k, v]) =>
      typeof v === 'string' && v.startsWith('IMG:')
        ? `${k}={staticFile(${JSON.stringify(v.slice(4))})}`
        : `${k}={${JSON.stringify(v)}}`
    )
    .join(' ');

/* ------------------------------------------------------------------ TABLA */
// pi = índice del beat en P[] · comp = componente nuevo · props = props inline
const OVER = [
  // — el ensayo de Danby (oliva vs girasol), el dato que abre el video
  {pi: 8, comp: 'FedTrial', props: {journal: 'Pediatric Dermatology', year: '2013', n: 19, design: 'aleatorizado · dos antebrazos · 4 semanas', title: 'El equipo del Dr. Simon Danby', sub: 'Universidad de Sheffield', groupA: {label: 'Aceite de oliva', value: 19, suffix: '', tone: 'bad'}, groupB: {label: 'Aceite de girasol', value: 19, suffix: '', tone: 'good'}, unit: 'adultos por brazo'}},
  {pi: 12, comp: 'FedTrial', props: {journal: 'Pediatric Dermatology', year: '2013', n: 19, design: 'pérdida de agua medida a las 4 semanas', title: 'El brazo del oliva perdió MÁS agua', sub: 'que antes de empezar', groupA: {label: 'Oliva', value: 24, suffix: '%', tone: 'bad'}, groupB: {label: 'Girasol', value: 7, suffix: '%', tone: 'good'}, unit: 'pérdida de agua', verdict: 'El oliva desarma la barrera'}},

  // — el mecanismo: la pared de ladrillos
  {pi: 42, comp: 'FedBrickWall', props: {state: 'build', title: 'La pared de su piel', sub: 'ladrillos de células muertas, cemento de grasa', legend: [{label: 'Ceramidas', pct: '50%'}, {label: 'Colesterol', pct: '25%'}, {label: 'Ácidos grasos', pct: '25%'}], brickLabel: 'Células muertas', cementLabel: 'Cemento de grasa'}},
  {pi: 43, comp: 'FedBrickWall', props: {state: 'leaking', title: 'Cuando el cemento se desarma', sub: 'picazón, tirantez, y la crema que se va en dos horas', legend: [{label: 'Juntas vacías', pct: '—'}], brickLabel: 'Células muertas', cementLabel: 'Cemento faltante'}},

  // — el remache molecular (linoleico) y el desorden (oleico)
  {pi: 52, comp: 'FedRivet', props: {mode: 'rivet', title: 'Sin linoleico no hay remache', sub: 'y sin remache, la pared filtra', chainLabel: 'Ácido linoleico', targetLabel: 'Ceramida', resultLabel: 'Acilceramida · el remache'}},
  {pi: 60, comp: 'FedRivet', props: {mode: 'disorder', title: 'El oleico abre la puerta', sub: 'la industria lo usa para que un medicamento atraviese la piel', chainLabel: 'Ácido oleico', targetLabel: 'Láminas de grasa', resultLabel: 'La pared filtra'}},

  // — la tabla que decide todo
  {pi: 63, comp: 'FedOilBars', props: {title: 'La proporción decide', sub: 'no el precio, no la marca, no el aroma', highlight: 'Oliva', cutoff: 40, cutoffLabel: 'mínimo útil', foot: 'El oliva tiene la peor relación de la lista.'}},
  {pi: 356, comp: 'FedOilBars', props: {title: 'Los siete, de un vistazo', sub: 'el linoleico y el oleico de cada uno', cutoff: 40, cutoffLabel: 'mínimo útil', foot: 'La ficha completa está en la descripción.'}},

  // — la etiqueta del girasol: el dato más práctico del video
  {pi: 88, comp: 'FedLabelScan', props: {title: 'El girasol común', sub: 'este es el que le sirve', labelName: 'ACEITE DE GIRASOL', labelSub: 'alto linoleico', verdict: 'ok', verdictLabel: 'PARA LA PIEL', liquid: '#D8A33C', bars: [{label: 'Linoleico', pct: 60, tone: 'good'}, {label: 'Oleico', pct: 25, tone: 'bad'}]}},
  {pi: 97, comp: 'FedLabelScan', props: {title: 'Si dice ALTO OLEICO', sub: 'esa es para la sartén', labelName: 'ACEITE DE GIRASOL', labelSub: 'alto oleico', verdict: 'bad', verdictLabel: 'PARA LA SARTÉN', liquid: '#C9932F', bars: [{label: 'Oleico', pct: 90, tone: 'bad'}, {label: 'Linoleico', pct: 8, tone: 'good'}]}},

  // — el único ensayo en piel madura (coco)
  {pi: 105, comp: 'FedTrial', props: {journal: 'Acta Medica Philippina', year: '2023', n: 148, design: 'aleatorizado · evaluador ciego · piel madura', title: '148 personas, 68 años de promedio', sub: 'coco virgen contra aceite mineral', groupA: {label: 'Coco virgen', value: 68, suffix: '%', tone: 'good'}, groupB: {label: 'Aceite mineral', value: 38, suffix: '%', tone: 'bad'}, unit: 'mejoría', verdict: 'Ganó el coco'}},

  // — el camionero del NEJM
  {pi: 160, comp: 'FedSplitFace', props: {image: "IMG:img/vn2_c32.png", title: 'La misma cara, dos edades', sub: 'veinte años más de un solo lado', leftLabel: '25 años contra la ventanilla', rightLabel: 'el otro lado, 69 años', callouts: ['Piel engrosada y colgada', 'Surcos profundos', 'Poros dilatados y tapados'], journal: 'New England Journal of Medicine', year: '2012'}},

  // — el argán
  {pi: 173, comp: 'FedTrial', props: {journal: 'Clinical Interventions in Aging', year: '2015', n: 60, design: 'mujeres posmenopáusicas de 49 a 61 años · 60 días', title: 'Medido con cutómetro', sub: 'el aparato que succiona la piel y mide cuánto tarda en volver', groupA: {label: 'Argán', value: 15, suffix: '%', tone: 'good'}, groupB: {label: 'Oliva', value: 0, suffix: '%', tone: 'bad'}, unit: 'elasticidad'}},

  // — la lista negra, ficha por ficha
  {pi: 234, comp: 'FedBlacklist', props: {index: '01 / 03', name: 'Aceite de oliva', reason: 'Aumentó significativamente la pérdida de agua por la piel — también en piel perfectamente sana.', evidence: 'Danby · Pediatric Dermatology · 2013', stamp: 'NO SE PONE'}},
  {pi: 245, comp: 'FedBlacklist', props: {index: '02 / 03', name: 'Vitamina E y germen de trigo', reason: 'En el 90% de los casos no tuvo ningún efecto o empeoró la cicatriz. Un tercio de los pacientes hizo dermatitis de contacto.', evidence: 'Dermatologic Surgery · 1999 · 15 pacientes operados', stamp: 'NO SE PONE'}},
  {pi: 254, comp: 'FedBlacklist', props: {index: '03 / 03', name: 'Cítricos prensados en frío', reason: 'Las furocumarinas se activan con la luz, se pegan al ADN y dejan una mancha que a veces no se va nunca.', evidence: 'Bergamota, lima, limón · tope de la industria: 0,4%', stamp: 'PELIGRO'}},

  // — lo que SÍ funciona: el protector solar
  {pi: 287, comp: 'FedTrial', props: {journal: 'Annals of Internal Medicine', year: '2013', n: 903, design: 'el único ensayo aleatorizado de prevención que existe · Australia', title: 'Protector solar todos los días', sub: 'contra usarlo cuando uno quiere', groupA: {label: 'Uso diario', value: 24, suffix: '%', tone: 'good'}, groupB: {label: 'Discrecional', value: 0, suffix: '%', tone: 'bad'}, unit: 'menos envejecimiento', verdict: '24% menos'}},

  // — el payoff: el aceite es la tapa, no el contenido
  {pi: 309, comp: 'FedSeal', props: {title: 'El aceite es la tapa, no el contenido', sub: 'un aceite vegetal puro es anhidro', leftLabel: 'Aceite sobre piel SECA', rightLabel: 'Aceite sobre piel HÚMEDA', leftNote: 'sella la nada', rightNote: 'sella el agua', dropLabel: '0% de agua'}},

  // — la rutina, paso a paso
  {pi: 323, comp: 'FedRoutineRing', props: {step: 1, kicker: 'Esta noche'}},
  {pi: 325, comp: 'FedRoutineRing', props: {step: 2, kicker: 'Esta noche'}},
  {pi: 327, comp: 'FedRoutineRing', props: {step: 3, kicker: 'Esta noche'}},
  {pi: 330, comp: 'FedRoutineRing', props: {step: 4, kicker: 'Esta noche'}},
  {pi: 335, comp: 'FedRoutineRing', props: {step: 5, kicker: 'Esta noche'}},
];

/* --------------------------------------------------------------- APLICAR */
// ⚠️ el Main viene de git con finales de línea CRLF: el ancla tiene que tolerar \r
if (!src.includes(`FedBrickWall_${SLUG}`)) {
  const before = src;
  src = src.replace(/\} from '\.\.\/FedererKit';\r?\n/, (mm) => mm + IMPORTS);
  if (src === before) {
    console.error('✗ no pude insertar los imports (¿cambió el import de FedererKit?)');
    process.exit(1);
  }
}

let ok = 0;
const fallos = [];
for (const o of OVER) {
  const re = new RegExp(
    `<(\\w+) \\{\\.\\.\\.P\\[${o.pi}\\]\\} totalF=\\{(\\d+)\\} accent=\\{ACCENT\\} \\/>`
  );
  const m = src.match(re);
  if (!m) {
    fallos.push(o.pi);
    continue;
  }
  src = src.replace(re, `<${o.comp} ${toJsx(o.props)} totalF={${m[2]}} accent={ACCENT} />`);
  ok++;
}

if (fallos.length) {
  console.error('✗ no encontré los beats:', fallos.join(', '));
  process.exit(1);
}
fs.writeFileSync(MAIN, src);
console.log('componentes nuevos inyectados:', ok);
