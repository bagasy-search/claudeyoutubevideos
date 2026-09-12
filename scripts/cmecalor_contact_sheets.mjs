import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = process.argv[2] || 'public/img/cmecalor/mass';
const outDir = process.argv[3] || 'work/cmecalor/contact_sheets';
const names = fs.readdirSync(inputDir)
  .filter((name) => /^cmec_m_\d{3}(?:_v\d+)?\.png$/i.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

const cols = 5;
const rows = 4;
const perSheet = cols * rows;
const cellWidth = 384;
const cellHeight = 216;
const labelHeight = 34;
fs.mkdirSync(outDir, {recursive: true});
const manifest = [];

for (let sheet = 0; sheet < Math.ceil(names.length / perSheet); sheet++) {
  const batch = names.slice(sheet * perSheet, (sheet + 1) * perSheet);
  const composites = [];
  for (let index = 0; index < batch.length; index++) {
    const name = batch[index];
    const safeName = name.replace(/[<&]/g, '');
    const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#071014"/><text x="9" y="23" font-family="Arial" font-size="16" fill="#f4efe4">${safeName}</text></svg>`);
    const cell = await sharp(path.join(inputDir, name))
      .resize(cellWidth, cellHeight, {fit: 'cover'})
      .extend({bottom: labelHeight, background: '#071014'})
      .composite([{input: label, top: cellHeight, left: 0}])
      .toBuffer();
    composites.push({input: cell, left: (index % cols) * cellWidth, top: Math.floor(index / cols) * (cellHeight + labelHeight)});
    manifest.push({sheet, index, name});
  }
  await sharp({create: {width: cols * cellWidth, height: rows * (cellHeight + labelHeight), channels: 3, background: '#071014'}})
    .composite(composites)
    .jpeg({quality: 88})
    .toFile(path.join(outDir, `sheet_${String(sheet).padStart(2, '0')}.jpg`));
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({images: names.length, sheets: Math.ceil(names.length / perSheet), outDir}, null, 2));
