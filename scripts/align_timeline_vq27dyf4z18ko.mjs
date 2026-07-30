import {readFileSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";

const slug = "vq27dyf4z18ko";
const fps = 30;
const timelinePath = resolve("src", "VideoEdit", `timeline_${slug}.json`);
const bagasyTimelinePath = resolve(".bagasy", `timeline_${slug}.json`);
const captionsPath = resolve("public", `captions_${slug}.json`);
const timeline = JSON.parse(readFileSync(timelinePath, "utf8"));
const captions = JSON.parse(readFileSync(captionsPath, "utf8"));

const normalize = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const captionTokens = captions.map((word, index) => ({
  token: normalize(word.text),
  index,
  startMs: Number(word.startMs),
  endMs: Number(word.endMs),
}));

const findExact = (target, cursor) => {
  const start = Math.max(0, cursor - 3);
  const max = Math.min(captionTokens.length - target.length, cursor + 220);
  for (let index = start; index <= max; index += 1) {
    let matches = true;
    for (let offset = 0; offset < target.length; offset += 1) {
      if (captionTokens[index + offset]?.token !== target[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return index;
  }
  return -1;
};

const findBest = (target, cursor) => {
  const start = Math.max(0, cursor - 3);
  const max = Math.min(captionTokens.length - target.length, cursor + 260);
  let best = {index: -1, score: 0};
  for (let index = start; index <= max; index += 1) {
    let score = 0;
    for (let offset = 0; offset < target.length; offset += 1) {
      if (captionTokens[index + offset]?.token === target[offset]) score += 1;
    }
    const ratio = score / Math.max(1, target.length);
    if (ratio > best.score) best = {index, score: ratio};
  }
  return best.score >= 0.72 ? best.index : -1;
};

let cursor = 0;
let exact = 0;
let fuzzy = 0;
const unresolved = [];
const provisional = timeline.scenes.map((scene) => {
  const target = normalize(scene.narration).split(" ").filter(Boolean);
  let index = findExact(target, cursor);
  if (index >= 0) exact += 1;
  if (index < 0) {
    index = findBest(target, cursor);
    if (index >= 0) fuzzy += 1;
  }
  if (index < 0) {
    unresolved.push({id: scene.id, narration: scene.narration, cursor, words: target.length});
    return {scene, targetWords: target.length, aligned: null};
  }
  const first = captionTokens[index];
  const last = captionTokens[index + target.length - 1] || first;
  const from = Math.max(0, Math.floor(first.startMs / 1000 * fps));
  const end = Math.max(from + 2, Math.ceil(last.endMs / 1000 * fps));
  cursor = index + target.length;
  return {scene, targetWords: target.length, aligned: {...scene, from, duration: end - from}};
});

const lastCaption = captions.at(-1);
const durationInFrames = Math.ceil((Number(lastCaption?.endMs || 0) + 250) / 1000 * fps);
const alignedScenes = provisional.map((entry) => entry.aligned);
let interpolated = 0;
for (let index = 0; index < provisional.length; index += 1) {
  if (alignedScenes[index]) continue;
  const blockStart = index;
  while (index + 1 < provisional.length && !alignedScenes[index + 1]) index += 1;
  const blockEnd = index;
  const previous = alignedScenes[blockStart - 1];
  const next = alignedScenes[blockEnd + 1];
  const availableStart = previous ? previous.from + previous.duration : 0;
  const availableEnd = next ? next.from : durationInFrames;
  const totalWords = provisional
    .slice(blockStart, blockEnd + 1)
    .reduce((sum, item) => sum + Math.max(1, item.targetWords), 0);
  let frameCursor = availableStart;
  let wordsUsed = 0;
  for (let sceneIndex = blockStart; sceneIndex <= blockEnd; sceneIndex += 1) {
    wordsUsed += Math.max(1, provisional[sceneIndex].targetWords);
    const isLast = sceneIndex === blockEnd;
    const end = isLast
      ? availableEnd
      : Math.round(availableStart + (availableEnd - availableStart) * (wordsUsed / totalWords));
    alignedScenes[sceneIndex] = {
      ...provisional[sceneIndex].scene,
      from: frameCursor,
      duration: Math.max(2, end - frameCursor),
    };
    frameCursor = end;
    interpolated += 1;
  }
}

const output = {
  ...timeline,
  duration_in_frames: durationInFrames,
  scenes: alignedScenes,
  alignment: {
    source: `public/captions_${slug}.json`,
    method: "sequential normalized word alignment",
    exact,
    fuzzy,
    interpolated,
    unresolved: unresolved.map(({id, narration}) => ({id, narration})),
  },
};
const encoded = `${JSON.stringify(output, null, 2)}\n`;
writeFileSync(timelinePath, encoded, "utf8");
writeFileSync(bagasyTimelinePath, encoded, "utf8");
console.log(JSON.stringify({
  ok: true,
  slug,
  scenes: alignedScenes.length,
  exact,
  fuzzy,
  interpolated,
  unresolved: 0,
  duration_in_frames: durationInFrames,
  duration_seconds: Number((durationInFrames / fps).toFixed(2)),
}, null, 2));
