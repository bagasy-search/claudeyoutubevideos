import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';
import sharp from 'sharp';

const video = 'D:/videosdeclaude/vbb0rdkrfduo.mp4';
const outDir = '_audit_vbb0rdkrfduo_final';
const frameDir = path.join(outDir, 'frames');
fs.mkdirSync(frameDir, {recursive: true});

const checkpoints = [
  {label: 'frame_000', time: 0},
  {label: 'frame_015', time: 0.5},
  {label: 'frame_045', time: 1.5},
  {label: 'frame_060', time: 2.0},
  ...Array.from({length: 29}, (_, index) => ({label: `first_${String((index + 1) * 2).padStart(2, '0')}s`, time: (index + 1) * 2})),
  ...[
    63.4, 70, 89.4, 96.1, 116.2, 140, 156.8, 173.3, 212, 248, 278.4,
    287.7, 317.8, 347.1, 378, 411.8, 424, 446.5, 465.4, 482.7, 499.6,
    512.4, 527.5, 546.1, 559, 570.2, 595.2, 603.5, 629.5, 642.6, 651.6,
    659.6, 681, 696.8, 726.3, 750.2, 779.5, 801.6, 834.9, 865.9, 875.1,
    889, 905.3, 925.6, 940.9, 967.9, 989.9, 1015.3, 1026.1, 1040, 1069,
    1099.8, 1123.9, 1127.4, 1157.3, 1185.6, 1208.5, 1217.1, 1240.9, 1243,
    1252.5, 1269.1, 1285.3, 1302.8, 1322.9, 1347.5, 1352.2, 1360.3, 1367.8,
    1377.2, 1387.3, 1392.4, 1399.1, 1409.6, 1430.2, 1451.9, 1470.8, 1487.3,
    1506.4, 1522,
  ].map((time) => ({label: `t_${time.toFixed(1).replace('.', '_')}`, time})),
];

for (const checkpoint of checkpoints) {
  const output = path.join(frameDir, `${checkpoint.label}.jpg`);
  if (!fs.existsSync(output)) {
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-ss', checkpoint.time.toFixed(3), '-i', video, '-frames:v', '1',
      '-vf', 'scale=640:360:force_original_aspect_ratio=increase,crop=640:360', '-q:v', '3', output,
    ], {stdio: 'ignore', timeout: 30000});
  }
}

const cols = 4;
const rows = 4;
const perSheet = cols * rows;
const width = 640;
const height = 360;
const labelHeight = 40;
const sheets = [];
for (let sheetIndex = 0; sheetIndex < Math.ceil(checkpoints.length / perSheet); sheetIndex++) {
  const batch = checkpoints.slice(sheetIndex * perSheet, (sheetIndex + 1) * perSheet);
  const composites = [];
  for (let index = 0; index < batch.length; index++) {
    const checkpoint = batch[index];
    const framePath = path.join(frameDir, `${checkpoint.label}.jpg`);
    const label = Buffer.from(`<svg width="${width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#071014"/><text x="10" y="27" font-family="Arial" font-size="18" fill="#f4efe4">${checkpoint.label} · ${checkpoint.time.toFixed(2)}s</text></svg>`);
    const cell = await sharp(framePath)
      .extend({bottom: labelHeight, background: '#071014'})
      .composite([{input: label, top: height, left: 0}])
      .toBuffer();
    composites.push({input: cell, left: (index % cols) * width, top: Math.floor(index / cols) * (height + labelHeight)});
  }
  const sheet = path.join(outDir, `sheet_${String(sheetIndex).padStart(2, '0')}.jpg`);
  await sharp({create: {width: cols * width, height: rows * (height + labelHeight), channels: 3, background: '#071014'}})
    .composite(composites)
    .jpeg({quality: 87})
    .toFile(sheet);
  sheets.push(sheet);
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({video, checkpoints, sheets}, null, 2));
console.log(`${checkpoints.length} fotogramas · ${sheets.length} hojas -> ${outDir}`);
