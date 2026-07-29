import fs from "node:fs";

const slug = "v7ior5j7vkw9";
const beats = JSON.parse(fs.readFileSync(`_v3/${slug}_beats.json`, "utf8"));
const clips = beats.filter((b) => b.tipo === "clip");

const variants = {
  rot: [
    "tomato blossom end rot close up",
    "damaged tomato fruit garden close up",
    "gardener inspecting rotten tomato fruit",
  ],
  crack: [
    "cracked tomatoes on vine close up",
    "gardener harvesting split tomatoes",
    "ripe damaged tomatoes garden",
  ],
  pot: [
    "watering tomato plant in pot",
    "container tomato gardening drainage",
    "gardener caring tomato plants pots",
    "large tomato planter garden",
    "water draining plant pot close up",
    "vegetable container garden care",
  ],
  mulch: [
    "mulching tomato plants with straw",
    "hands spreading straw vegetable garden",
    "tomato garden organic mulch",
    "garden mulch around vegetable plants",
    "straw ground cover gardening hands",
    "mulched raised bed tomatoes",
  ],
  wilt: [
    "wilted tomato plant hot sun",
    "tomato leaves summer heat garden",
    "gardener checking wilted vegetable plant",
    "vegetable leaves wilting in sunlight",
    "tomato garden hot afternoon",
    "drooping tomato leaves close up",
    "gardener inspecting stressed tomato plant",
    "healthy tomato leaves morning light",
  ],
  soil: [
    "hands checking soil moisture garden",
    "gardener digging soil near tomato plant",
    "wet soil close up vegetable garden",
    "hands comparing sandy clay soil",
    "soil moisture finger test garden",
    "garden trowel checking wet soil",
    "dry soil vegetable garden close up",
    "rich garden soil in hands",
    "tomato roots soil gardening",
    "raised bed soil close up",
  ],
  water: [
    "watering tomato plants at soil level",
    "drip irrigation tomato garden",
    "gardener watering vegetable garden roots",
    "soaker hose tomato plants",
    "watering tomatoes early morning",
    "slow watering tomato plant base",
    "water soaking garden soil close up",
    "hands using watering can tomatoes",
    "irrigation hose vegetable garden",
    "tomato plants garden sprinkler ground",
    "deep watering vegetable plants",
    "morning irrigation raised garden bed",
  ],
  harvest: [
    "hands harvesting ripe tomatoes garden",
    "tomatoes ripening on vine close up",
    "healthy tomato plants vegetable garden",
    "basket fresh tomatoes garden",
    "red tomatoes hanging on plant",
    "gardener inspecting green tomatoes",
    "tomato crop raised bed",
    "close up homegrown tomatoes",
  ],
  store: [
    "garden center fertilizer shelves",
    "gardener choosing plant care products store",
    "gardening supplies shelf close up",
  ],
  morning: [
    "tomato garden sunrise",
    "watering vegetable garden early morning",
    "morning light tomato plants",
  ],
  general: [
    "gardener working tomato garden",
    "hands caring tomato plants",
    "vegetable garden tomato rows",
    "tomato plant close up natural",
  ],
};

const category = (b) => {
  const t = `${b.phrase}`.toLowerCase();
  if (/podredumbre|mancha negra|extremo floral/.test(t)) return "rot";
  if (/grieta|rajad/.test(t)) return "crack";
  if (/maceta|recipiente|balde|drenaje/.test(t)) return "pot";
  if (/acolchado|paja|cobertura/.test(t)) return "mulch";
  if (/calor|marchit|caída|decaimiento|hojas/.test(t)) return "wilt";
  if (/manguera|goteo|regadera|riega|agua|mañana/.test(t)) return "water";
  if (/arena|arcilla|tierra|suelo|perfil|húmed|raíz/.test(t)) return "soil";
  if (/fruto|tomate|cosecha/.test(t)) return "harvest";
  if (/vivero|botella|producto|vendedor/.test(t)) return "store";
  if (/amanecer|temprano/.test(t)) return "morning";
  return "general";
};

const perCategory = new Map();
const dense = [];
const shots = [];
const map = [];

for (let i = 0; i < clips.length; i++) {
  const b = clips[i];
  const cat = category(b);
  const n = perCategory.get(cat) || 0;
  perCategory.set(cat, n + 1);
  const query = variants[cat][n % variants[cat].length];
  const name = `d${String(i).padStart(3, "0")}`;
  const at = +(b.ms / 1000).toFixed(3);
  dense.push({ name, at, t: b.dur, query, beat: b.name, dice: b.phrase });
  shots.push({ name, query, type: "video", orientation: "landscape" });
  map.push({
    beat: b.name,
    ms: b.ms,
    dur: b.dur,
    file: `broll/${slug}/${name}.mp4`,
    query,
  });
}

fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/dense_${slug}.json`, JSON.stringify(dense, null, 2));
fs.writeFileSync(
  `public/broll/shots_dense_${slug}.json`,
  JSON.stringify(shots, null, 2),
);
fs.writeFileSync(`_v3/${slug}_broll_map.json`, JSON.stringify(map, null, 2));

console.log(
  JSON.stringify(
    {
      clips: clips.length,
      categorias: Object.fromEntries(perCategory),
      dense: `public/broll/dense_${slug}.json`,
      shots: `public/broll/shots_dense_${slug}.json`,
    },
    null,
    2,
  ),
);
