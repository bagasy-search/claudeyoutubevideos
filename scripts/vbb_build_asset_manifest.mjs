import fs from 'fs';

const source = fs.readFileSync('src/VideoEdit/Main_vbb0rdkrfduo.tsx', 'utf8');
const stockNames = [...source.matchAll(/stock\('([^']+)'/g)].map((match) => match[1]);
const imageNames = [...source.matchAll(/img\('([^']+)'/g)].map((match) => match[1]);
const directImages = [...source.matchAll(/'img\/(vbb[^']+\.png)'/g)].map((match) => match[1].replace(/^img\//, '').replace(/\.png$/, ''));
const rows = [
  ...new Set(stockNames.map((name) => `broll/${name}.mp4`)),
  ...new Set([...imageNames, ...directImages].map((name) => `img/${name}.png`)),
].sort();
const missing = rows.filter((row) => !fs.existsSync(`public/${row}`) || fs.statSync(`public/${row}`).size <= 0);
if (missing.length) throw new Error(`Assets faltantes:\n${missing.join('\n')}`);
fs.writeFileSync('@_vbb0rdkrfduo_assets.txt', `${rows.join('\n')}\n`);
fs.writeFileSync('_vbb0rdkrfduo_assets.txt', `${rows.join('\n')}\n`);
console.log(`${rows.length} assets explícitos; ${missing.length} faltantes.`);
