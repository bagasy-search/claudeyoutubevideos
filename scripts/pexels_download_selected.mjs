import fs from 'fs';
import path from 'path';

const [indexPath, selectedPath, outDir = 'public/broll'] = process.argv.slice(2);
if (!indexPath || !selectedPath) {
  console.error('Uso: node scripts/pexels_download_selected.mjs <_candidates.json> <selected.json> [outdir]');
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, ''));
const selected = JSON.parse(fs.readFileSync(selectedPath, 'utf8').replace(/^\uFEFF/, ''));
fs.mkdirSync(outDir, {recursive: true});
let ok = 0;
for (const [name, choice] of Object.entries(selected)) {
  if (choice === null || choice === false) continue;
  const cand = index[name]?.candidates?.find((c) => c.index === Number(choice));
  if (!cand) continue;
  const response = await fetch(cand.video, {signal: AbortSignal.timeout(120000)});
  if (!response.ok) continue;
  fs.writeFileSync(path.join(outDir, `${name}.mp4`), Buffer.from(await response.arrayBuffer()));
  ok++;
  console.log(`✓ ${name} <- candidato ${choice}`);
}
console.log(`${ok} clips descargados`);
