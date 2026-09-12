import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const dir = process.argv[2] || 'public/img/cmecalor_v2';
const images = fs.readdirSync(dir).filter((name) => /\.(png|jpe?g|webp)$/i.test(name) && !/_blur\./i.test(name));
let made = 0;

for (const name of images) {
  const input = path.join(dir, name);
  const output = path.join(dir, `${path.basename(name, path.extname(name))}_blur.jpg`);
  if (fs.existsSync(output)) continue;
  const result = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-vf', 'scale=96:-2,gblur=sigma=18,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080',
    '-frames:v', '1', '-q:v', '8', output,
  ], {stdio: 'inherit'});
  if (result.status !== 0) throw new Error(`blur failed: ${name}`);
  made += 1;
}

console.log(JSON.stringify({dir, images: images.length, made}, null, 2));
