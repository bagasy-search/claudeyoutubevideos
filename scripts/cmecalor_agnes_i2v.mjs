import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const [listFile, outDir = 'public/broll/cmecalor_agnes', imgDir = 'public/img/cmecalor'] = process.argv.slice(2);
if (!listFile) throw new Error('Usage: node scripts/cmecalor_agnes_i2v.mjs <actions.json> [outDir] [imgDir]');

const keys = (process.env.AGNES_KEYS || process.env.AGNES_API_KEY || '').split(',').map((s) => s.trim()).filter(Boolean);
if (!keys.length) throw new Error('Missing AGNES_KEYS');
const api = process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1';
const root = api.replace(/\/v1$/, '');
const items = JSON.parse(fs.readFileSync(listFile, 'utf8').replace(/^﻿/, ''));
fs.mkdirSync(outDir, {recursive: true});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cooldownMs = 62000;
const pollMs = 12000;
const maxWaitMs = 25 * 60 * 1000;
const maxInflight = Number(process.env.AGNES_INFLIGHT || 12);
const nextFree = keys.map(() => 0);
const queue = items.filter((item) => {
  const source = path.join(imgDir, `${item.nombre}.png`);
  const output = path.join(outDir, `${item.nombre}.mp4`);
  if (!fs.existsSync(source)) throw new Error(`Missing source image: ${source}`);
  return !fs.existsSync(output);
});
const inflight = new Map();
let ok = 0;
let failed = 0;

const mime = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const dataUri = (file) => `data:${mime[path.extname(file).toLowerCase()] || 'image/png'};base64,${fs.readFileSync(file).toString('base64')}`;
const negative = [
  'new object', 'missing object', 'object morphing', 'changed wiring', 'changed labels', 'invented text',
  'logo', 'watermark', 'extra fingers', 'melting hands', 'camera movement', 'zoom', 'pan', 'dolly',
  'scene cut', 'new scene', 'cinematic lighting', 'smoke', 'sparks', 'fire growth', 'unsafe electrical action'
].join(', ');
const promptFor = (item) => [
  'Preserve the exact input photograph and its physical layout for the entire shot.',
  'Every appliance, cable, switch, pipe, hand and background object remains identical in shape, position, material and color unless the requested motion explicitly moves it.',
  `Continuity: ${item.change}`,
  `One literal action only: ${item.motion}`,
  item.causality ? `Physical causality: ${item.causality}` : '',
  'Locked camera. No pan, tilt, zoom, dolly, reframing, cuts or transitions.',
  'Ordinary documentary realism with existing practical light; no cinematic treatment.',
  'Do not create text, numbers, labels, logos, smoke, sparks, hazards or additional people.'
].filter(Boolean).join('\n');

const chooseKey = () => {
  const now = Date.now();
  let choice = -1;
  let earliest = Infinity;
  for (let i = 0; i < keys.length; i++) {
    if (nextFree[i] < earliest) { earliest = nextFree[i]; choice = i; }
  }
  return earliest <= now ? choice : -1;
};

async function submit(item, keyIndex) {
  const source = path.join(imgDir, `${item.nombre}.png`);
  const response = await fetch(`${api}/videos`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${keys[keyIndex]}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: 'agnes-video-v2.0',
      image: dataUri(source),
      prompt: promptFor(item),
      negative_prompt: negative,
      width: 1280,
      height: 720,
      num_frames: 121,
      frame_rate: 24,
    }),
  });
  const result = await response.json().catch(() => ({}));
  const id = result.video_id || result.id;
  const raw = JSON.stringify(result);
  if (!id) {
    if (/queue is full|queue_full|rate limit|too many/i.test(raw)) {
      queue.unshift(item);
      nextFree[keyIndex] = Date.now() + (/queue is full|queue_full/i.test(raw) ? 8000 : cooldownMs);
      return;
    }
    throw new Error(raw.slice(0, 240));
  }
  nextFree[keyIndex] = Date.now() + cooldownMs;
  inflight.set(id, {item, startedAt: Date.now()});
  console.log(`submitted ${item.nombre}`);
}

async function poll(id, state) {
  try {
    const key = keys[Math.floor(Math.random() * keys.length)];
    const response = await fetch(`${root}/agnesapi?video_id=${encodeURIComponent(id)}`, {headers: {Authorization: `Bearer ${key}`}});
    const result = await response.json().catch(() => ({}));
    if (result.url) {
      const video = await fetch(result.url);
      const output = path.join(outDir, `${state.item.nombre}.mp4`);
      fs.writeFileSync(output, Buffer.from(await video.arrayBuffer()));
      inflight.delete(id);
      ok++;
      console.log(`done ${state.item.nombre}`);
      return;
    }
    const raw = JSON.stringify(result);
    if (/rate limit|too many|429/i.test(raw) && !/failed/i.test(String(result.status || ''))) return;
    if (result.status === 'failed' || result.error || Date.now() - state.startedAt > maxWaitMs) {
      inflight.delete(id);
      failed++;
      console.log(`failed ${state.item.nombre}: ${raw.slice(0, 180)}`);
    }
  } catch {
    // Polling failures are transient; the server-side job remains active.
  }
}

while (queue.length || inflight.size) {
  while (queue.length && inflight.size < maxInflight) {
    const keyIndex = chooseKey();
    if (keyIndex < 0) break;
    const item = queue.shift();
    try {
      await submit(item, keyIndex);
    } catch (error) {
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < 3) queue.push(item);
      else { failed++; console.log(`failed submit ${item.nombre}: ${String(error.message).slice(0, 180)}`); }
    }
  }
  if (queue.length || inflight.size) await sleep(pollMs);
  await Promise.all([...inflight].map(([id, state]) => poll(id, state)));
}

console.log(JSON.stringify({ok, failed, total: items.length, outDir}, null, 2));
if (failed) process.exitCode = 1;
