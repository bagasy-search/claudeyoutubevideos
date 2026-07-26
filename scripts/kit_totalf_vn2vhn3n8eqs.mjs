// Agrega un prop opcional totalF a los componentes del kit y lo pasa a su TransitionShell,
// para que la duración del whip de salida siga la duración REAL del beat (no los 150f fijos).
import fs from 'fs';

const F = 'src/FedererKit.tsx';
let s = fs.readFileSync(F, 'utf8');
const comps = [
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
];
let a = 0;
let b = 0;
for (const c of comps) {
  const tMark = `export type ${c}Props = {`;
  if (s.includes(tMark) && !s.includes(`${tMark}\n  totalF?: number;`)) {
    s = s.split(tMark).join(`${tMark}\n  totalF?: number;`);
    a++;
  }
  const dMark = `export const ${c}: React.FC<${c}Props> = ({`;
  if (s.includes(dMark) && !s.includes(`${dMark}\n  totalF,`)) {
    s = s.split(dMark).join(`${dMark}\n  totalF,`);
    b++;
  }
}
const src = '<TransitionShell accent={accent}>';
const dst = '<TransitionShell accent={accent} totalF={totalF}>';
const n = s.split(src).length - 1;
s = s.split(src).join(dst);
fs.writeFileSync(F, s);
console.log('types:', a, '| destructurings:', b, '| TransitionShell:', n);
