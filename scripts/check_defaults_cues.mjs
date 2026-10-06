// check_defaults.mjs — caza LA FALLA MÁS CARA: un componente que se ve lleno y está VACÍO, porque
// se montó sin pasarle sus props y quedó mostrando los DEFAULTS de la firma (el texto de OTRO video).
//
//   node scripts/check_defaults.mjs src/VideoEdit/Main_<slug>.tsx
//
// ⛔⛔ EL FALSO POSITIVO QUE AVISÓ TRES VIDEOS SEGUIDOS (rkbottle, raygarage, rkbill):
//    la versión vieja buscaba el componente POR NOMBRE en todo el repo. Hay **6 `MythTruth`
//    distintos**, y resolvía el de otro kit → avisaba de `mythLabel="Mito"` / `truthLabel="Verdad"`
//    que NO EXISTEN en el de `src/rksafe/`. Peor: al "arreglarlo" se pasaban props que no están en
//    la firma y se ignoran en silencio.
//    ✅ ACÁ el componente se resuelve **por su import REAL dentro del Main**, así que no puede
//    agarrar el de otro kit. Si un componente no se puede resolver por import, lo DICE y no adivina.
import fs from 'node:fs';
import path from 'node:path';

// ⛔ los componentes del kit NO se montan sólo en el Main: en este pipeline viven en el
//    `cues_<slug>.gen.tsx`. Si le pasás sólo el Main, mide 1 componente y te dice que está todo
//    bien. Se le pasan TODOS los archivos que montan JSX del kit.
const mains = process.argv.slice(2).filter(Boolean);
if (!mains.length) { console.error('uso: node scripts/check_defaults.mjs <Main_slug.tsx> [cues_slug.gen.tsx ...]'); process.exit(1); }
for (const m of mains) if (!fs.existsSync(m)) { console.error('⛔ no existe: ' + m); process.exit(1); }
const main = mains[0];
const src = mains.map(m => fs.readFileSync(m, 'utf8')).join('\n');

// 1) mapa nombre → archivo, SÓLO desde los imports de ESTE Main
const EXT = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'];
const resolveFrom = (spec) => {
  if (!spec.startsWith('.')) return null;
  for (const m of mains) {
    const base = path.resolve(path.dirname(m), spec);
    for (const e of EXT) { const c = base + e; if (fs.existsSync(c) && fs.statSync(c).isFile()) return c; }
  }
  return null;
};
const mapa = new Map();
for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g)) {
  const file = resolveFrom(m[2]);
  if (!file) continue;
  for (let n of m[1].split(',')) {
    n = n.trim().split(/\s+as\s+/).pop().trim();
    if (n) mapa.set(n, file);
  }
}

// 2) firma de cada componente. Hacen falta DOS lecturas distintas y confundirlas canta falso:
//    · el BLOQUE DE TIPO `React.FC<{ ... }>`  → TODAS las props que existen
//    · el DESTRUCTURING `= ({ prop = valor })` → sólo las que tienen DEFAULT
//    ⛔ Mi primera versión leía sólo el destructuring: un componente sin defaults (RayAvatar) daba
//       firma VACÍA y sus props legítimas (`src`, `loopFrames`) salían como "fantasma". El
//       smoke-test lo cazó. Un medidor que mide la mitad de la firma inventa hallazgos.
function firmaDe(file, comp) {
  const t = fs.readFileSync(file, 'utf8');
  const i = t.indexOf('export const ' + comp);
  if (i < 0) return null;

  // bloque de TIPO: desde el primer `<{` después del nombre hasta su `}>` balanceado
  const abre = t.indexOf('<{', i);
  if (abre < 0) return null;
  let depth = 0, fin = -1;
  for (let k = abre + 1; k < t.length; k++) {
    if (t[k] === '{') depth++;
    else if (t[k] === '}') { depth--; if (depth === 0) { fin = k; break; } }
  }
  if (fin < 0) return null;
  const tipo = t.slice(abre + 2, fin);
  const todas = new Set();
  // ⛔ el separador NO es sólo el salto de línea: una firma de una sola línea usa `;` o `,`
  //    (`{ src: string; loopFrames: number }`). Con /\n/ sólo salía `src`, y `loopFrames`
  //    —una prop REAL— se reportaba como fantasma en los dos controles. Lo cazó el positivo.
  //    Y hay que ignorar lo que está dentro de `{...}` anidados (props objeto) para no leer
  //    sus campos internos como props del componente.
  const plano = tipo.replace(/\{[^{}]*\}/g, '{}');
  // además del nombre, guardo el TIPO declarado: sirve para separar COPY de ESTILO más abajo.
  const tipos = {};
  for (const m of plano.matchAll(/(?:^|[\n;,{])\s*(?:\/\*\*[\s\S]*?\*\/\s*)?(\w+)\s*\??\s*:([^;\n]*)/g)) {
    todas.add(m[1]);
    tipos[m[1]] = m[2].trim();
  }

  // bloque de DESTRUCTURING: `= ({ ... })` justo después del tipo
  const eq = t.indexOf('= ({', fin);
  const defaults = {};
  if (eq >= 0 && eq - fin < 12) {
    let d2 = 0, fin2 = -1;
    for (let k = eq + 3; k < t.length; k++) {
      if (t[k] === '{') d2++;
      else if (t[k] === '}') { d2--; if (d2 === 0) { fin2 = k; break; } }
    }
    if (fin2 > 0) {
      const bloque = t.slice(eq + 4, fin2);
      for (const m of bloque.matchAll(/(\w+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\[[\s\S]*?\]|\{[\s\S]*?\}|[^,\n]+)/g)) {
        if (todas.has(m[1])) defaults[m[1]] = m[2].trim().replace(/\s+/g, ' ').slice(0, 70);
      }
    }
  }
  return { todas, defaults, tipos };
}

// 3) usos en el Main: <Comp ... />
let usos = 0, hallazgos = 0, estiloTot = 0, sinResolver = [];
console.log('═'.repeat(74));
console.log('ARCHIVOS: ' + mains.join(' · '));
console.log('MEDIDO: ' + mapa.size + ' componentes importados con ruta resuelta');
if (mapa.size === 0) { console.error('⛔ 0 componentes resueltos — el medidor no midió nada'); process.exit(1); }
console.log('');

// ⛔⛔ EL FALSO POSITIVO QUE CAZÓ EL CONTROL POSITIVO (y que habría mandado a "arreglar" un video
//    que salió bien): en `cues_<slug>.gen.tsx` las props NO van como atributos, van por SPREAD de
//    un objeto literal — `<ProcessChips durationInFrames={d} {...({"kicker":"…","steps":[…]} as any)} />`.
//    Leyendo sólo `prop=` daban CERO props pasadas y los 15 componentes del rkbill entregado salían
//    como "se monta SIN nada". Hay que leer las claves del objeto spreadeado también.
const propsPasadas = (attrs) => {
  const s = new Set([...attrs.matchAll(/(\w+)\s*=/g)].map(x => x[1]));
  // claves de primer nivel de cada `{...({ ... })}`
  for (const sp of attrs.matchAll(/\{\s*\.\.\.\s*\(?\s*(\{[\s\S]*?\})\s*(?:as\s+\w+\s*)?\)?\s*\}/g)) {
    const obj = sp[1];
    let depth = 0;
    for (let k = 0; k < obj.length; k++) {
      const c = obj[k];
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') depth--;
      else if (depth === 1 && (c === '"' || c === "'")) {
        const end = obj.indexOf(c, k + 1);
        if (end < 0) break;
        const key = obj.slice(k + 1, end);
        const after = obj.slice(end + 1).match(/^\s*:/);
        if (after) s.add(key);
        k = end;
      }
    }
  }
  return s;
};

for (const m of src.matchAll(/<([A-Z]\w+)([^>]*?)\/?>/g)) {
  const comp = m[1], attrs = m[2];
  if (!mapa.has(comp)) continue;
  usos++;
  const f = firmaDe(mapa.get(comp), comp);
  if (f === null) { sinResolver.push(comp + ' (' + path.relative('.', mapa.get(comp)).replace(/\\/g, '/') + ')'); continue; }
  const { todas, defaults, tipos } = f;
  const pasadas = propsPasadas(attrs);
  // sólo canta las que TIENEN default y no se pasaron: ésas muestran texto de otro video
  // ⛔ NO todo default sin pasar es la falla cara. La falla cara es que se vea TEXTO DE OTRO VIDEO.
  //    `tone = "brass"` es un enum de ESTILO (tipo `"brass" | "danger"`): que caiga en su default
  //    es correcto, no un bug. Lo decide el TIPO DECLARADO, no una heurística sobre el valor:
  //    union de literales string => estilo · `string` pelado o array de objetos => COPY.
  const esCopy = (p) => {
    const t = (tipos[p] || '').replace(/\s+/g, ' ');
    if (/\|/.test(t) && /"/.test(t)) return false;           // union de literales = enum de estilo
    if (/^(boolean|number)$/.test(t)) return false;
    return /string|\[\]|\{/.test(t);
  };
  const IGNORAR = new Set(['durationInFrames', 'bed']);
  const faltan = Object.keys(defaults).filter(p => !pasadas.has(p) && !IGNORAR.has(p) && esCopy(p));
  const estiloEnDefault = Object.keys(defaults).filter(p => !pasadas.has(p) && !IGNORAR.has(p) && !esCopy(p));
  if (faltan.length) {
    hallazgos++;
    console.log('⛔ <' + comp + '> se monta SIN: ' + faltan.join(', '));
    for (const p of faltan) console.log('      → va a mostrar el default: ' + p + ' = ' + defaults[p]);
  }
  estiloTot += estiloEnDefault.length;
  // props pasadas que NO están en el BLOQUE DE TIPO: se ignoran EN SILENCIO
  // `durationInFrames` lo pasa el generador de cues a TODOS los componentes por igual; los que no
  // lo declaran simplemente lo ignoran y no se rompe nada. No es un hallazgo accionable.
  const fantasma = [...pasadas].filter(p => !todas.has(p) && !['key', 'style', 'durationInFrames'].includes(p));
  if (fantasma.length) {
    hallazgos++;
    console.log('⛔ <' + comp + '> recibe props que NO están en su firma (se IGNORAN en silencio): ' + fantasma.join(', '));
  }
}
console.log('');
console.log('USOS REVISADOS: ' + usos + '  ·  hallazgos: ' + hallazgos + (hallazgos ? '  ⛔' : '  ✓'));
console.log('   (defaults de ESTILO sin pasar, que NO son hallazgo: ' + estiloTot + ')');
if (sinResolver.length) {
  console.log('NO PUDE LEER LA FIRMA de: ' + sinResolver.join(' · '));
  console.log('   (no adivino por nombre: hay 6 MythTruth en este repo y resolver por nombre miente)');
}
if (usos === 0) { console.error('⛔ 0 usos revisados — o el Main no monta componentes del kit, o el regex no los ve'); process.exit(1); }
console.log('═'.repeat(74));
process.exit(hallazgos ? 2 : 0);
