import fs from "node:fs";

const slug = process.argv[2];
const durationSec = Number(process.argv[3]);
if (!slug || !Number.isFinite(durationSec) || durationSec <= 0) {
  console.error("Usage: node scripts/retime_timeline_from_captions.mjs <slug> <durationSec>");
  process.exit(1);
}

const timelinePath = `src/VideoEdit/timeline_${slug}.json`;
const captionsPath = `public/captions_${slug}.json`;
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf8"));
const captionsRaw = JSON.parse(fs.readFileSync(captionsPath, "utf8"));
const captions = Array.isArray(captionsRaw) ? captionsRaw : captionsRaw.words || [];
const fps = Number(timeline.fps || 30);

const normalizeWord = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "")
  .trim();

const capWords = captions.map((caption) => normalizeWord(caption.text));
let cursor = 0;
let exact = 0;
let fuzzy = 0;
let fallback = 0;
const fallbackScenes = [];
const starts = [];

for (const scene of timeline.scenes) {
  const words = String(scene.narration || "").split(/\s+/).map(normalizeWord).filter(Boolean);
  const needle = words.slice(0, Math.min(8, words.length));
  let bestIndex = -1;
  let bestScore = -1;
  const from = Math.max(0, cursor - 4);
  const to = Math.min(capWords.length, cursor + 260);

  for (let index = from; index < to; index += 1) {
    let matches = 0;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (capWords[index + offset] === needle[offset]) matches += 1;
    }
    const score = needle.length ? matches / needle.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
    if (score === 1) break;
  }

  if (bestScore === 1) exact += 1;
  else if (bestScore >= 0.62) fuzzy += 1;
  else {
    fallback += 1;
    fallbackScenes.push({ id: scene.id, narration: scene.narration });
    bestIndex = Math.min(capWords.length - 1, cursor);
  }

  const startMs = captions[Math.max(0, bestIndex)]?.startMs ?? 0;
  starts.push(Math.max(starts.at(-1) ?? 0, Math.round(startMs * fps / 1000)));
  cursor = Math.max(cursor, bestIndex + Math.max(1, words.length));
}

const totalFrames = Math.ceil(durationSec * fps);
for (let index = 0; index < timeline.scenes.length; index += 1) {
  const from = Math.min(totalFrames - 1, starts[index]);
  const next = index + 1 < starts.length ? starts[index + 1] : totalFrames;
  timeline.scenes[index].from = from;
  timeline.scenes[index].duration = Math.max(1, next - from);
}

timeline.duration_in_frames = totalFrames;
timeline.audio_src = `avatar_${slug}.mp4`;
timeline.captions_src = `captions_${slug}.json`;
timeline.metrics = {
  ...(timeline.metrics || {}),
  retimed_from_hidden_captions: true,
  retime_alignment: { exact, fuzzy, fallback, scenes: timeline.scenes.length },
};

const backupPath = `${timelinePath}.before-correct-avatar`;
if (!fs.existsSync(backupPath)) fs.copyFileSync(timelinePath, backupPath);
fs.writeFileSync(timelinePath, `${JSON.stringify(timeline, null, 2)}\n`);
console.log(JSON.stringify({ totalFrames, durationSec, exact, fuzzy, fallback, fallbackScenes, scenes: timeline.scenes.length }));
