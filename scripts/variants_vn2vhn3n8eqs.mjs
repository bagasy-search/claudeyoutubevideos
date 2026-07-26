// 1) Pasa el prop `variant` por los 21 componentes (los 10 del kit + los 11 nuevos)
//    hasta su TransitionShell, para que el ADN quede compartido por construcción.
// 2) Asigna la variante de CADA corte del Main según el CAMBIO DE BEAT, nunca al azar.
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';

/* ---------------- 1 · pass-through en los componentes del kit ------------- */
const KIT = 'src/FedererKit.tsx';
let k = fs.readFileSync(KIT, 'utf8');
const kitComps = [
  'FedChapter',
  'FedHero',
  'FedStat',
  'FedQuote',
  'FedMolecule',
  'FedStep',
  'FedBeforeAfter',
  'FedLowerThird',
  'FedChecklist',
  'FedCta',
  'FedFullShot',
];
let a = 0;
let b = 0;
for (const c of kitComps) {
  const t = `export type ${c}Props = {`;
  if (k.includes(t) && !k.includes(`${t}\n  variant?: FedTransitionVariant;`)) {
    k = k.split(t).join(`${t}\n  variant?: FedTransitionVariant;`);
    a++;
  }
  const d = `export const ${c}: React.FC<${c}Props> = ({`;
  if (k.includes(d) && !k.includes(`${d}\n  variant,`)) {
    k = k.split(d).join(`${d}\n  variant,`);
    b++;
  }
}
const n1 = k.split('<TransitionShell accent={accent} totalF={totalF}>').length - 1;
k = k
  .split('<TransitionShell accent={accent} totalF={totalF}>')
  .join('<TransitionShell accent={accent} totalF={totalF} variant={variant}>');
fs.writeFileSync(KIT, k);
console.log(`kit → types ${a} · destructurings ${b} · shells ${n1}`);

/* -------------- 1b · pass-through en los 11 componentes nuevos ------------ */
const NEW = [
  'FedBrickWall',
  'FedRivet',
  'FedTrial',
  'FedLabelScan',
  'FedSplitFace',
  'FedSeal',
  'FedOilBars',
  'FedBlacklist',
  'FedRoutineRing',
  'FedCohort',
  'FedPaper',
];
let touched = 0;
for (const c of NEW) {
  const f = `src/${c}_${SLUG}.tsx`;
  if (!fs.existsSync(f)) {
    console.error('  ✗ falta', f);
    continue;
  }
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes('variant?: FedTransitionVariant')) continue;

  // importar el tipo desde el kit
  s = s.replace(/(import\s*\{)([\s\S]*?)(\}\s*from\s*'\.\/FedererKit';)/, (m0, p1, p2, p3) =>
    /FedTransitionVariant/.test(p2) ? m0 : `${p1}${p2}${p2.trim().endsWith(',') ? '' : ','}\n  type FedTransitionVariant,\n${p3}`
  );
  // prop en el type
  s = s.replace(new RegExp(`(export type ${c}Props = \\{)`), '$1\n  variant?: FedTransitionVariant;');
  // destructuring
  s = s.replace(
    new RegExp(`(export const ${c}: React\\.FC<${c}Props> = \\(\\{)`),
    '$1\n  variant,'
  );
  // pasarlo al shell (cualquier forma de invocación)
  s = s.replace(/<TransitionShell([^>]*?)>/g, (m0, attrs) =>
    /variant=/.test(attrs) ? m0 : `<TransitionShell${attrs} variant={variant}>`
  );
  fs.writeFileSync(f, s);
  touched++;
}
console.log('componentes nuevos con variant:', touched);

/* ------------- 2 · asignar la variante por CAMBIO DE BEAT ---------------- */
// El gesto sale de QUÉ entra, no de un random:
//   fold · llega un capítulo / un documento nuevo → gira como una página
//   iris · aterriza un dato duro → resuelve desde el centro
//   lift · se abre una escena de mundo → sube desde abajo
//   whip · el corte neutro del kit
const VAR = {
  FedChapter: 'fold',
  FedPaper: 'fold',
  FedOilCarousel: 'fold',
  FedStat: 'iris',
  FedTrial: 'iris',
  FedCohort: 'iris',
  FedOilBars: 'iris',
  FedMolecule: 'iris',
  FedRivet: 'iris',
  FedFullShot: 'lift',
  FedBeforeAfter: 'lift',
  FedSplitFace: 'lift',
  FedSeal: 'lift',
  FedBrickWall: 'lift',
  FedLabelScan: 'lift',
};

const MAIN = `src/VideoEdit/Main_${SLUG}.tsx`;
let m = fs.readFileSync(MAIN, 'utf8');
const counts = {};
m = m.replace(
  /<(Fed\w+)([\s\S]*?)totalF=\{(\d+)\} accent=\{ACCENT\}( avatarSrc=\{null\})? \/>/g,
  (m0, comp, mid, tf, av) => {
    if (/variant=/.test(mid)) return m0;
    const v = VAR[comp] || 'whip';
    counts[v] = (counts[v] || 0) + 1;
    return `<${comp}${mid}totalF={${tf}} accent={ACCENT} variant="${v}"${av || ''} />`;
  }
);
fs.writeFileSync(MAIN, m);
console.log('cortes por variante:', JSON.stringify(counts));
