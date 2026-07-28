// Reescribe el MANIFIESTO cronológico del Main con las rutas FINALES (post-shrink).
// density_gate lee este comentario para contar componentes y assets reales.
import fs from 'node:fs';

const SLUG = 'vsdjytp30ogs';
const src = fs.readFileSync(`src/VideoEdit/beats_${SLUG}.ts`, 'utf8');
const beats = JSON.parse(src.match(/export const BEATS: VBeat\[\] = ([\s\S]*);\n$/)[1]);

const lines = beats.map((b) => {
  if (b.kind === 'avatar') return '  <FedAvatarFull/>';
  const asset = b.props?.src || b.props?.image || b.props?.imageA || '';
  return `  <${b.comp}/>${asset ? ` "${asset}"` : ''}`;
});
const manifest = `/* === MANIFIESTO ${SLUG} (density_gate) — ORDEN CRONOLÓGICO, generado ===\n${lines.join(
  '\n'
)}\n=== FIN MANIFIESTO === */`;

const p = `src/VideoEdit/Main_${SLUG}.tsx`;
let main = fs.readFileSync(p, 'utf8');
main = main.replace(/\/\* === MANIFIESTO[\s\S]*?=== FIN MANIFIESTO === \*\//, '').trimEnd();
fs.writeFileSync(p, main + '\n\n' + manifest + '\n', 'utf8');

const comps = {};
for (const b of beats) comps[b.kind === 'avatar' ? 'FedAvatarFull' : b.comp] = (comps[b.kind === 'avatar' ? 'FedAvatarFull' : b.comp] || 0) + 1;
const assets = new Set(lines.map((l) => l.match(/"(.+)"/)?.[1]).filter(Boolean));
console.log(`manifiesto: ${lines.length} instancias · ${Object.keys(comps).length} componentes · ${assets.size} assets únicos`);
