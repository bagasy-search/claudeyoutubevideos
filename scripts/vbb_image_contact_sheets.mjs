import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = 'public/img';
const outDir = '_audit_vbb_images';
const names = fs.readdirSync(inputDir).filter((name) => /^vbb_new_.*\.png$/i.test(name)).sort();
const cols = 4;
const rows = 4;
const perSheet = cols * rows;
const cellWidth = 480;
const cellHeight = 270;
const labelHeight = 42;
fs.mkdirSync(outDir, {recursive: true});
const manifest = [];

for (let sheetIndex = 0; sheetIndex < Math.ceil(names.length / perSheet); sheetIndex++) {
  const batch = names.slice(sheetIndex * perSheet, (sheetIndex + 1) * perSheet);
  const composites = [];
  for (let index = 0; index < batch.length; index++) {
    const name = batch[index];
    const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#071014"/><text x="10" y="28" font-family="Arial" font-size="17" fill="#f4efe4">${name.replace(/[<&]/g, '')}</text></svg>`);
    const cell = await sharp(path.join(inputDir, name))
      .resize(cellWidth, cellHeight, {fit: 'cover'})
      .extend({bottom: labelHeight, background: '#071014'})
      .composite([{input: label, top: cellHeight, left: 0}])
      .toBuffer();
    composites.push({input: cell, left: (index % cols) * cellWidth, top: Math.floor(index / cols) * (cellHeight + labelHeight)});
    manifest.push({sheet: sheetIndex, index, name});
  }
  await sharp({create: {width: cols * cellWidth, height: rows * (cellHeight + labelHeight), channels: 3, background: '#071014'}})
    .composite(composites)
    .jpeg({quality: 85})
    .toFile(path.join(outDir, `sheet_${String(sheetIndex).padStart(2, '0')}.jpg`));
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`${names.length} imágenes en ${Math.ceil(names.length / perSheet)} hojas -> ${outDir}`);
