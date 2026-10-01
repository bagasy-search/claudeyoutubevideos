// POOL de stock Pexels para olcast: queries genéricas del nicho → metadatos + póster (para hoja de contactos y juez).
// node vlog/olcast/pexels_pool.mjs  → D:/rtmp/ollarder/src/pex/pool.json + posters/
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OUT = "D:/rtmp/ollarder/src/pex/";
const Q = ["potatoes in wooden crate", "root cellar vegetables", "stone cellar shelves jars", "onions hanging braid", "apples in wooden crate", "carrots in sand", "cabbage heads harvest", "shredding cabbage", "sauerkraut jar fermenting", "fermenting vegetables crock", "pickled onions jar", "pickles cucumbers jar", "pouring salt", "salt pork bacon slab", "curing meat salt", "rendering lard pot", "cutting pork fat", "bacon fat jar", "frozen meat", "frozen beef", "meat freezer", "thawing meat", "refrigerator open shelves", "freezer frozen food", "butcher shop meat", "butcher cutting meat", "snow cabin forest", "log cabin snow winter", "winter forest snow trees", "horse drawn sleigh snow", "horses pulling sled snow", "snowy road forest", "icicles melting roof", "thermometer winter outdoor", "thermometer close up", "wood stove fire", "campfire coals pot", "dutch oven fire", "dry beans pouring", "bean pot cooking", "baked beans", "flour sack", "flour pouring", "kneading dough hands", "sorting potatoes hands", "potato sprouts", "moldy bread rot", "rotten fruit mold", "spoiled vegetables", "burlap sacks barn", "wooden barrels", "old wooden barrel cellar", "oil lantern", "old wood table kitchen", "pantry shelves jars", "canning jars pantry", "dried apples", "prunes dried fruit", "molasses pouring", "coffee tea tin", "doughnuts frying", "lumberjack axe forest", "cutting firewood", "men eating table", "cook stirring big pot", "cellar door steps", "basement shelves storage", "garage shelves storage", "porch winter frost", "frost on window", "frozen vegetables", "salt shaker salting meat", "cabbage knife chopping", "mason jar kraut"];
const pool = fs.existsSync(OUT + "pool.json") ? JSON.parse(fs.readFileSync(OUT + "pool.json", "utf8")) : {};
fs.mkdirSync(OUT + "posters", { recursive: true });
let k = 0;
for (const q of Q) {
  if (Object.values(pool).some(v => v.q === q)) continue;
  let d;
  for (let t = 0; t < 4; t++) {
    const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape&size=medium`, { headers: { Authorization: KEYS[k++ % KEYS.length] } });
    if (r.ok) { d = await r.json(); break; }
    await new Promise(s => setTimeout(s, 5000 * (t + 1)));
  }
  if (!d) { console.log("x", q); continue; }
  let n = 0;
  for (const v of d.videos || []) {
    if (pool[v.id] || v.duration < 4) continue;
    const files = (v.video_files || []).filter(f => f.width >= 1280 && f.width <= 1920 && f.file_type === "video/mp4").sort((a, b) => b.width - a.width);
    if (!files.length) continue;
    pool[v.id] = { id: v.id, q, dur: v.duration, w: files[0].width, h: files[0].height, url: files[0].link, fps: files[0].fps, page: v.url, user: v.user?.name, poster: v.image };
    const pf = OUT + `posters/${v.id}.jpg`;
    if (!fs.existsSync(pf)) { try { fs.writeFileSync(pf, Buffer.from(await (await fetch(v.image)).arrayBuffer())); } catch {} }
    n++;
  }
  console.log(q, n);
  fs.writeFileSync(OUT + "pool.json", JSON.stringify(pool, null, 1));
}
console.log("pool", Object.keys(pool).length);
