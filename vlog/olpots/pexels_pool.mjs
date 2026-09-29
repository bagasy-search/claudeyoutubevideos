// POOL de stock Pexels para olpots: queries genéricas del nicho → metadatos + póster (para hoja de contactos y juez).
// node vlog/olpots/pexels_pool.mjs  → D:/rtmp/olpots_src/pex/pool.json + posters/
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OUT = "D:/rtmp/olpots_src/pex/";
const Q = ["cast iron dutch oven", "dutch oven campfire coals", "cooking over campfire cast iron pot", "charcoal briquettes glowing", "cast iron skillet frying", "frying potatoes skillet", "cornbread cast iron skillet", "pork chop searing skillet", "seasoning cast iron oil", "scrubbing cast iron pan", "washing pan hot water", "drying pan stove", "enamel pot speckled", "enamelware camping pot", "big stockpot soup", "stainless steel pot boiling", "stainless steel pot stove", "soup simmering pot lid", "saucepan oatmeal", "rice pot lid steam", "milk boiling pot", "gravy stirring pan", "nonstick frying pan", "scratched frying pan", "aluminum pot stove", "ceramic pottery pot clay", "cookware store shopping", "shopping cart kitchen aisle", "flea market cookware", "yard sale kitchen items", "bread baking dutch oven", "pot of beans cooking", "stew cooking pot wood stove", "wood stove cooking", "hands stirring pot wooden spoon", "kitchen cabinet pots pans", "rusty cast iron", "tapping pot knuckle", "kitchen shelf pots hanging", "cast iron pan oven"];
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
