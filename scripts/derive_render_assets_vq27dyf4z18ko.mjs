import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

const slug = "vq27dyf4z18ko";
const timeline = JSON.parse(
  readFileSync(resolve("src", "VideoEdit", `timeline_${slug}.json`), "utf8"),
);

const mediaScenes = timeline.scenes.filter((scene) => {
  const type = scene.layers?.[0]?.type;
  return type === "video" || type === "image";
});

if (!mediaScenes.length) throw new Error("timeline contains no media scenes");

const nearestMedia = (scene) =>
  mediaScenes.reduce((best, candidate) =>
    Math.abs(candidate.from - scene.from) < Math.abs(best.from - scene.from)
      ? candidate
      : best,
  mediaScenes[0]);

const semanticOverride = (scene) => {
  const layer = scene.layers?.[0] || {};
  const text = `${scene.narration || ""} ${layer.title || ""} ${layer.detail || ""}`.toLowerCase();
  if (/thermal battery|need a freezer|recharge|crystallize again/.test(text)) {
    return `img/${slug}_image_045.png`;
  }
  if (/hard labor|metabolic heat|direct sun toward shade|shaded recovery/.test(text)) {
    return `img/${slug}_image_347.png`;
  }
  if (/confused|collapse|emergency services|vigorous air movement/.test(text)) {
    return `img/${slug}_image_331.png`;
  }
  if (/fully melted|remove it|honest claim|charged ones/.test(text)) {
    return `img/${slug}_image_008.png`;
  }
  if (/seal inspection|weak seam|leak|witness layer/.test(text)) {
    return `img/${slug}_image_177.png`;
  }
  if (layer.type === "video" || layer.type === "image") return layer.src;
  return nearestMedia(scene).layers[0].src;
};

const selected = [];
let lastFrom = -10_000;
for (const scene of timeline.scenes) {
  if (scene.layers?.[0]?.type === "avatar") continue;
  if (scene.from - lastFrom < 150) continue;
  selected.push(scene);
  lastFrom = scene.from;
}

const assets = new Set([timeline.audio_src]);
for (const scene of selected) assets.add(semanticOverride(scene));

const missing = [...assets].filter((asset) => !existsSync(resolve("public", asset)));
if (missing.length) {
  throw new Error(`missing ${missing.length} render assets:\n${missing.join("\n")}`);
}

const entries = [...assets].sort();
const bytes = entries.reduce(
  (sum, entry) => sum + statSync(resolve("public", entry)).size,
  0,
);
const output = resolve(".bagasy", `farm-assets-final-${slug}.txt`);
mkdirSync(dirname(output), {recursive: true});
writeFileSync(output, `${entries.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  ok: true,
  slug,
  selected_cues: selected.length,
  assets: entries.length,
  bytes,
  gib: Number((bytes / 1024 ** 3).toFixed(3)),
  output,
}, null, 2));
