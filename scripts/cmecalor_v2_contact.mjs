import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = process.argv[2] || 'public/img/cmecalor_v2';
const outDir = process.argv[3] || 'work/cmecalor_v2/contact_sheets';
const names = fs.readdirSync(inputDir)
  .filter((name) => /\.(png|jpe?g|webp)$/i.test(name) && !/_blur\./i.test(name))
  .sort();
fs.mkdirSync(outDir, {recursive: true});

const tileWidth = 480;
const tileHeight = 270;
const perSheet = 16;
for (let offset = 0; offset < names.length; offset += perSheet) {
  const group = names.slice(offset, offset + perSheet);
  const composites = [];
  for (let cell = 0; cell < group.length; cell += 1) {
    const name = group[cell];
    const labelText = path.basename(name, path.extname(name)).replaceAll('&', '&amp;');
    const label = Buffer.from(`<svg width="${tileWidth}" height="34"><rect width="${tileWidth}" height="34" fill="rgba(0,0,0,.78)"/><text x="10" y="24" fill="white" font-size="20" font-family="Arial">${labelText}</text></svg>`);
    const tile = await sharp(path.join(inputDir, name))
      .resize(tileWidth, tileHeight, {fit: 'cover'})
      .composite([{input: label, left: 0, top: tileHeight - 34}])
      .jpeg({quality: 88})
      .toBuffer();
    composites.push({input: tile, left: (cell % 4) * tileWidth, top: Math.floor(cell / 4) * tileHeight});
  }
  const sheet = String(Math.floor(offset / perSheet) + 1).padStart(2, '0');
  await sharp({create: {width: 1920, height: 1080, channels: 3, background: '#202020'}})
    .composite(composites)
    .jpeg({quality: 90})
    .toFile(path.join(outDir, `sheet_${sheet}.jpg`));
}

console.log(JSON.stringify({images: names.length, sheets: Math.ceil(names.length / perSheet), outDir}, null, 2));
