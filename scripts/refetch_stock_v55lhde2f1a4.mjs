import fs from "node:fs";
import path from "node:path";

const slug = "v55lhde2f1a4";
const outDir = `public/broll/${slug}`;
const indexPath = path.join(outDir, "supplemental_index.json");
fs.mkdirSync(outDir, { recursive: true });

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error("Falta PEXELS_API_KEY");

const requests = [
  ["willow", "willow tree branches river close up"],
  ["willow", "willow leaves branch breeze"],
  ["willow", "gardener pruning willow tree branch"],
  ["willow", "young tree branch buds macro"],
  ["willow", "flexible green tree twig close up"],
  ["willow", "riverside willow tree landscape"],
  ["willow", "hands cutting thin tree twigs"],
  ["willow", "fresh tree branches on wooden table"],
  ["cutting", "hands preparing plant cuttings close up"],
  ["cutting", "gardener cutting green stem pruning shears"],
  ["cutting", "clean pruning scissors plant stem macro"],
  ["cutting", "hands removing lower leaves plant cutting"],
  ["cutting", "plant stem node macro close up"],
  ["cutting", "fresh herb cuttings wooden workbench"],
  ["cutting", "gardener collecting cuttings early morning"],
  ["cutting", "green branch cutting below leaf node"],
  ["jar", "plant cuttings in glass jars window"],
  ["jar", "pothos propagation roots glass water"],
  ["jar", "basil cuttings rooting in water"],
  ["jar", "mint cuttings in glass water"],
  ["jar", "ivy cuttings roots in water"],
  ["jar", "two glass jars plant experiment"],
  ["jar", "hands placing plant cutting in water jar"],
  ["jar", "pouring water into jar with plant cutting"],
  ["jar", "hands labeling glass plant jars"],
  ["jar", "changing water plant propagation jar"],
  ["roots", "white roots growing from plant cutting macro"],
  ["roots", "plant roots visible in clear water close up"],
  ["roots", "rooted cutting held in gardener hands"],
  ["roots", "fine new plant roots macro"],
  ["roots", "houseplant propagation root system close up"],
  ["roots", "roots emerging from stem node close up"],
  ["roots", "transplant rooted cutting from water to pot"],
  ["roots", "healthy plant roots and soil close up"],
  ["substrate", "hands mixing potting soil and perlite"],
  ["substrate", "perlite potting mix close up"],
  ["substrate", "filling small nursery pots with soil"],
  ["substrate", "pencil making hole in potting soil"],
  ["substrate", "hands planting cutting in small pot"],
  ["substrate", "pressing soil around plant stem close up"],
  ["substrate", "watering propagation tray gently"],
  ["substrate", "airy potting soil texture macro"],
  ["humidity", "clear plastic humidity dome seedlings"],
  ["humidity", "plastic bag covering plant cutting pot"],
  ["humidity", "opening greenhouse humidity dome"],
  ["humidity", "misting plant cuttings greenhouse"],
  ["humidity", "condensation greenhouse propagation tray"],
  ["humidity", "plant cuttings bright indirect window light"],
  ["humidity", "seedlings protected from direct sunlight"],
  ["nursery", "plant nursery propagation trays"],
  ["nursery", "greenhouse worker inspecting cuttings"],
  ["nursery", "rows of young plants greenhouse"],
  ["nursery", "garden center seedling trays close up"],
  ["nursery", "nursery worker transplanting young plants"],
  ["nursery", "plant propagation bench greenhouse"],
  ["nursery", "rooting cuttings under mist nursery"],
  ["species", "rosemary cuttings gardening hands"],
  ["species", "lavender cuttings propagation"],
  ["species", "hydrangea stem cutting garden"],
  ["species", "grapevine pruning close up"],
  ["species", "fig tree branch pruning"],
  ["species", "citrus tree grafting hands"],
  ["species", "apple tree grafting orchard"],
  ["species", "herb cuttings basil mint rosemary"],
  ["process", "hot water poured over herbs glass jar"],
  ["process", "straining herbal infusion metal sieve"],
  ["process", "golden herbal water in clear jar"],
  ["process", "measuring water kitchen glass jug"],
  ["process", "hands cutting twigs into small pieces"],
  ["process", "soaking plant stem base in water"],
  ["process", "cleaning garden scissors with alcohol"],
  ["limits", "wilted plant cutting in cloudy water"],
  ["limits", "brown rotten plant stem close up"],
  ["limits", "healthy cutting beside wilted cutting"],
  ["limits", "flowering branch pruning close up"],
  ["limits", "gardener checking plant cutting resistance"],
  ["limits", "callus on plant cutting macro"],
  ["limits", "fertilizer granules beside young plant"],
  ["close", "rustic garden shed workbench plants"],
  ["close", "gardener notebook plant experiment"],
  ["close", "hands writing plant dates notebook"],
  ["close", "country vegetable garden sunrise"],
];

const used = new Set();
if (fs.existsSync(indexPath)) {
  for (const item of JSON.parse(fs.readFileSync(indexPath, "utf8"))) {
    if (item.pexels_id) used.add(item.pexels_id);
  }
}

const pickFile = (files) => {
  const landscape = files
    .filter((f) => f.file_type === "video/mp4" && f.width >= f.height && f.height >= 720)
    .sort((a, b) => Math.abs(1920 - a.width) - Math.abs(1920 - b.width));
  return landscape[0] || null;
};

const download = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return buffer.length;
};

const index = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, "utf8")) : [];
for (let i = 0; i < requests.length; i++) {
  const [category, query] = requests[i];
  const name = `u${String(i + 1).padStart(3, "0")}`;
  const dest = path.join(outDir, `${name}.mp4`);
  if (fs.existsSync(dest)) {
    console.log(`= ${name} ya existe`);
    continue;
  }
  try {
    const url = new URL("https://api.pexels.com/videos/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("size", "medium");
    url.searchParams.set("per_page", "40");
    const res = await fetch(url, { headers: { Authorization: key } });
    if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 120)}`);
    const data = await res.json();
    const candidates = (data.videos || []).filter(
      (v) => !used.has(v.id) && v.duration >= 5 && v.duration <= 120 && pickFile(v.video_files),
    );
    if (!candidates.length) throw new Error("sin candidato horizontal único");
    const video = candidates[0];
    const file = pickFile(video.video_files);
    const bytes = await download(file.link, dest);
    used.add(video.id);
    index.push({
      name,
      category,
      query,
      file: `${name}.mp4`,
      pexels_id: video.id,
      durationSec: video.duration,
      width: file.width,
      height: file.height,
      url: video.url,
    });
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log(`↓ ${name} ${category} · ${(bytes / 1e6).toFixed(1)}MB · ${file.width}x${file.height} · ${video.duration}s`);
  } catch (error) {
    index.push({ name, category, query, error: error.message });
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.error(`✗ ${name} ${category} · ${error.message}`);
  }
}

const ok = index.filter((x) => !x.error && fs.existsSync(path.join(outDir, x.file))).length;
const unique = new Set(index.filter((x) => x.pexels_id).map((x) => x.pexels_id)).size;
console.log(`LISTO ${ok}/${requests.length} descargados · ${unique} IDs únicos · ${indexPath}`);
