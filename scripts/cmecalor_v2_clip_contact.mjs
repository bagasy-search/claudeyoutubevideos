import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';

const inputDir = process.argv[2] || 'public/broll/cmecalor_v2_agnes';
const outDir = process.argv[3] || 'work/cmecalor_v2/clip_contact_sheets';
const names = fs.readdirSync(inputDir).filter((name) => name.endsWith('.mp4')).sort();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cmecalor-clips-'));
fs.mkdirSync(outDir, {recursive: true});

const tileWidth = 480;
const tileHeight = 270;
const perSheet = 16;
const extracted = [];
for (const name of names) {
  const frame = path.join(tmp, `${path.basename(name, '.mp4')}.jpg`);
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '2.2', '-i', path.join(inputDir, name), '-frames:v', '1', '-vf', 'scale=960:-2', frame]);
  if (result.status === 0 && fs.existsSync(frame)) extracted.push({name, frame});
}

for (let offset = 0; offset < extracted.length; offset += perSheet) {
  const group = extracted.slice(offset, offset + perSheet);
  const composites = [];
  for (let cell = 0; cell < group.length; cell += 1) {
    const {name, frame} = group[cell];
    const labelText = path.basename(name, '.mp4').replaceAll('&', '&amp;');
    const label = Buffer.from(`<svg width="${tileWidth}" height="34"><rect width="${tileWidth}" height="34" fill="rgba(0,0,0,.78)"/><text x="10" y="24" fill="white" font-size="20" font-family="Arial">${labelText}</text></svg>`);
    const tile = await sharp(frame).resize(tileWidth, tileHeight, {fit: 'cover'}).composite([{input: label, left: 0, top: tileHeight - 34}]).jpeg({quality: 88}).toBuffer();
    composites.push({input: tile, left: (cell % 4) * tileWidth, top: Math.floor(cell / 4) * tileHeight});
  }
  const sheet = String(Math.floor(offset / perSheet) + 1).padStart(2, '0');
  await sharp({create: {width: 1920, height: 1080, channels: 3, background: '#202020'}}).composite(composites).jpeg({quality: 90}).toFile(path.join(outDir, `sheet_${sheet}.jpg`));
}

fs.rmSync(tmp, {recursive: true, force: true});
console.log(JSON.stringify({clips: names.length, extracted: extracted.length, sheets: Math.ceil(extracted.length / perSheet), outDir}, null, 2));
