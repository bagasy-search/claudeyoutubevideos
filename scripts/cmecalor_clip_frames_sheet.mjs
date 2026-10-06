import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = '_v3/_clipaudit';
const output = 'work/cmecalor/agnes_clip_frames.jpg';
const names = fs.readdirSync(inputDir).filter((name) => /^cmec_.*_t\d+\.jpg$/i.test(name)).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
const cols = 4;
const cellWidth = 480;
const cellHeight = 270;
const labelHeight = 34;
const rows = Math.ceil(names.length / cols);
const composites = [];

for (let index = 0; index < names.length; index++) {
  const name = names[index];
  const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#071014"/><text x="9" y="23" font-family="Arial" font-size="16" fill="#f4efe4">${name.replace(/[<&]/g, '')}</text></svg>`);
  const cell = await sharp(path.join(inputDir, name)).resize(cellWidth, cellHeight, {fit: 'cover'})
    .extend({bottom: labelHeight, background: '#071014'})
    .composite([{input: label, top: cellHeight, left: 0}]).toBuffer();
  composites.push({input: cell, left: (index % cols) * cellWidth, top: Math.floor(index / cols) * (cellHeight + labelHeight)});
}

await sharp({create: {width: cols * cellWidth, height: rows * (cellHeight + labelHeight), channels: 3, background: '#071014'}})
  .composite(composites).jpeg({quality: 90}).toFile(output);
console.log(JSON.stringify({frames: names.length, output}, null, 2));
