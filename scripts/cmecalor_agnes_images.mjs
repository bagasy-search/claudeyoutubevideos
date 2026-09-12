import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const [listFile, outDir = 'public/img/cmecalor/mass'] = process.argv.slice(2);
if (!listFile) throw new Error('Usage: node scripts/cmecalor_agnes_images.mjs <shots.json> [outDir]');

const allKeys = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || '').split(',').map((s) => s.trim()).filter(Boolean);
const shardIndex = Number(process.env.AGNES_SHARD_INDEX || 0);
const shardCount = Math.max(1, Number(process.env.AGNES_SHARD_COUNT || 1));
const keys = allKeys.filter((_, index) => index % shardCount === shardIndex);
if (!keys.length) throw new Error(`No AGNES keys in shard ${shardIndex}/${shardCount}`);

const base = process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1';
const model = 'agnes-image-2.1-flash';
const referenceFiles = (process.env.AGNES_REF || '').split(',').map((s) => s.trim()).filter(Boolean);
if (!referenceFiles.length) throw new Error('AGNES_REF must point to the approved Claudio identity reference');
const items = JSON.parse(fs.readFileSync(listFile, 'utf8').replace(/^﻿/, ''));
fs.mkdirSync(outDir, {recursive: true});

const mime = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const dataUri = (file) => {
  const absolute = path.isAbsolute(file) ? file : path.resolve(file);
  return `data:${mime[path.extname(absolute).toLowerCase()] || 'image/png'};base64,${fs.readFileSync(absolute).toString('base64')}`;
};
const references = referenceFiles.map(dataUri);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cooldownMs = 32000;
const maxTries = 40;
const freeAt = keys.map(() => 0);
let keyCursor = 0;
let ok = 0;
let failed = 0;
let rateLimited = 0;

const identity = 'Preserve the exact identity, face, dark curly hair, salt-and-pepper beard, age, skin tone, grey work shirt over a black T-shirt, body proportions and natural facial asymmetry of Claudio in the reference. Change only the requested action or environment.';
const casual = 'Looks like an ordinary practical photo Claudio or a family member took to document the exact step: normal smartphone perspective, eye-level or useful close-up, natural auto-exposure, ordinary home or workshop light, realistic wear and dust, casual framing. No cinematic lighting, no dramatic color grade, no shallow-focus glamour, no advertising polish, no staged hero pose, no text, no logo, no watermark.';
const hands = 'Hands and tools must be anatomically and mechanically correct. Electrical boxes stay closed unless the exact sentence is about a qualified inspection. Never show energized bare conductors, sparks, backfeeding or a dangerous connection being performed.';

const exists = (name) => ['png','jpg','jpeg','webp'].some((ext) => fs.existsSync(path.join(outDir, `${name}.${ext}`)));
const queue = items.filter((item) => item.nombre && !exists(item.nombre));

async function generate(item) {
  const usesClaudio = item.tipo === 'claudio' || item.tipo === 'claudio_pov';
  const scene = item.change || item.prompt;
  if (!scene) throw new Error(`Shot ${item.nombre} has no change/prompt`);
  const exact = `Exact narrated anchor: ${item.anchor}. The frame must visibly prove these nouns: ${(item.nouns || []).join(', ')}. Literal action: ${item.action || item.dice}. Do not substitute a thematically related object.`;
  const prompt = [usesClaudio ? identity : '', exact, scene, casual, hands].filter(Boolean).join('\n');

  for (let attempt = 0; attempt < maxTries; attempt++) {
    const now = Date.now();
    let keyIndex = -1;
    for (let offset = 0; offset < keys.length; offset++) {
      const candidate = (keyCursor + offset) % keys.length;
      if (freeAt[candidate] <= now) { keyIndex = candidate; keyCursor = (candidate + 1) % keys.length; break; }
    }
    if (keyIndex < 0) { await sleep(2000); continue; }
    try {
      const response = await fetch(`${base}/images/generations`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${keys[keyIndex]}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          model,
          prompt,
          size: '2K',
          ratio: '16:9',
          extra_body: usesClaudio ? {image: references, response_format: 'url'} : {response_format: 'url'},
        }),
      });
      if (response.status === 429) {
        freeAt[keyIndex] = Date.now() + cooldownMs;
        rateLimited++;
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} ${(await response.text()).slice(0, 180)}`);
      const result = await response.json();
      const data = result?.data?.[0];
      let buffer;
      if (data?.b64_json) buffer = Buffer.from(data.b64_json, 'base64');
      else if (data?.url) buffer = Buffer.from(await (await fetch(data.url)).arrayBuffer());
      else throw new Error('No image URL or base64 in response');
      fs.writeFileSync(path.join(outDir, `${item.nombre}.png`), buffer);
      ok++;
      console.log(`done ${item.nombre}`);
      return;
    } catch (error) {
      if (attempt === maxTries - 1) {
        failed++;
        console.log(`failed ${item.nombre}: ${String(error.message).slice(0, 180)}`);
        return;
      }
      await sleep(1800);
    }
  }
}

const workers = Array.from({length: Math.min(keys.length, Number(process.env.AGNES_IMAGE_CONC || keys.length))}, async () => {
  while (queue.length) await generate(queue.shift());
});
await Promise.all(workers);
console.log(JSON.stringify({ok, failed, total: items.length, shardIndex, shardCount, keys: keys.length, rateLimited}, null, 2));
if (failed) process.exitCode = 1;
