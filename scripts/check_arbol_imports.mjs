// check_arbol_imports.mjs — recorre el árbol de imports DESDE EL ENTRY y verifica que cada archivo
// (a) exista en disco y (b) esté en el ÍNDICE DE GIT, que es lo único que viaja al farm.
//
//   node scripts/check_arbol_imports.mjs src/index_<slug>.tsx
//
// ⛔ POR QUÉ EXISTE: el repo es compartido y los kits nuevos nacen SIN TRACKEAR. El farm hace
//    checkout de una ref: lo que no está en el árbol de git NO LLEGA, y los 60 chunks mueren con
//    un import undefined. Pasó en raybar1, raygarage y rkbill — las tres veces con el MISMO kit.
// ⛔ Y la versión vieja de esta compuerta "sólo miraba los archivos que le pasabas": hay que
//    pasarle el ENTRY y que RECORRA. Si le pasás una lista a mano, mide lo que vos ya sabías.
// ⛔ Leé la CABECERA del output, no la cola: el resumen de arriba es el que dice SIN TRACKEAR.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const entry = process.argv[2];
if (!entry) { console.error('uso: node scripts/check_arbol_imports.mjs <entry.tsx>'); process.exit(1); }
if (!fs.existsSync(entry)) { console.error('⛔ no existe el entry: ' + entry); process.exit(1); }

// índice de git = lo que viaja
const tracked = new Set(
  execFileSync('git', ['ls-files'], { maxBuffer: 64 * 1024 * 1024 }).toString()
    .split(/\r?\n/).filter(Boolean).map(p => p.replace(/\\/g, '/'))
);
// modificados sin commitear (viajan en la versión VIEJA, que es peor que no viajar)
const dirty = new Set(
  execFileSync('git', ['status', '--porcelain'], { maxBuffer: 32 * 1024 * 1024 }).toString()
    .split(/\r?\n/).filter(Boolean)
    .map(l => ({ x: l.slice(0, 2), p: l.slice(3).replace(/\\/g, '/').replace(/^"|"$/g, '') }))
    .filter(o => / M|M |MM|AM/.test(o.x)).map(o => o.p)
);

const EXT = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts', '/index.js'];
const resolve = (from, spec) => {
  if (!spec.startsWith('.')) return null;            // paquete de node_modules
  const base = path.resolve(path.dirname(from), spec);
  for (const e of EXT) { const c = base + e; if (fs.existsSync(c) && fs.statSync(c).isFile()) return c; }
  return { missing: base };
};

const vistos = new Set(), faltan = [], sinTrackear = [], modificados = [];
let leidos = 0, importsVistos = 0;

function walk(file) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  if (vistos.has(rel)) return;
  vistos.add(rel);
  leidos++;
  if (!tracked.has(rel)) sinTrackear.push(rel);
  else if (dirty.has(rel)) modificados.push(rel);

  const src = fs.readFileSync(file, 'utf8');
  const specs = [
    ...src.matchAll(/(?:^|\n)\s*import\s[^;]*?from\s*["']([^"']+)["']/g),
    ...src.matchAll(/(?:^|\n)\s*export\s[^;]*?from\s*["']([^"']+)["']/g),
    ...src.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g),
    ...src.matchAll(/(?:^|\n)\s*import\s*["']([^"']+)["']/g),
  ].map(m => m[1]);

  for (const s of specs) {
    importsVistos++;
    const r = resolve(file, s);
    if (r === null) continue;
    if (r.missing) { faltan.push({ de: rel, spec: s }); continue; }
    walk(r);
  }
}
walk(path.resolve(entry));

// ── CABECERA: lo que importa va ARRIBA ────────────────────────────────────
console.log('═'.repeat(72));
console.log('ENTRY: ' + entry);
console.log('MEDIDO: ' + leidos + ' archivos del árbol · ' + importsVistos + ' imports resueltos · ' +
  tracked.size + ' archivos en el índice de git');
if (leidos <= 1) { console.error('⛔ recorrí 1 archivo o menos — el recorrido está roto, NO es un árbol sano'); process.exit(1); }
console.log('');
console.log('SIN TRACKEAR : ' + sinTrackear.length + (sinTrackear.length ? '   ⛔ NO VIAJAN AL FARM' : '   ✓'));
for (const f of sinTrackear) console.log('     ⛔ ' + f);
console.log('MODIFICADOS  : ' + modificados.length + (modificados.length ? '   ⛔ el farm se lleva la versión VIEJA' : '   ✓'));
for (const f of modificados) console.log('     ⛔ ' + f);
console.log('IMPORTS ROTOS: ' + faltan.length + (faltan.length ? '   ⛔' : '   ✓'));
for (const f of faltan) console.log('     ⛔ ' + f.de + ' → "' + f.spec + '"');
console.log('═'.repeat(72));

if (sinTrackear.length || modificados.length || faltan.length) {
  console.log('');
  console.log('ARREGLO: `git add` de los sin-trackear y los modificados ANTES de armar la ref de render.');
  console.log('         (`git checkout <ref> -- <path>` ya los deja en el índice: es la vía corta.)');
  process.exit(2);
}
