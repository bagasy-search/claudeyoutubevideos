// POOL de stock Pexels para ollarder2: queries genéricas del nicho → metadatos + póster (para hoja de contactos y juez).
// node vlog/ollarder2/pexels_pool.mjs  → D:/rtmp/ollarder2_src/pex/pool.json + posters/
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OUT = "D:/rtmp/ollarder2_src/pex/";
const Q = ["root cellar", "potatoes in crate", "potato sack", "digging potatoes", "onions braid", "hanging onions", "garlic bulbs", "carrots harvest", "carrots in sand", "beets harvest", "parsnips", "cabbage harvest", "hanging cabbage", "apples crate", "wrapping apples newspaper", "apple orchard autumn", "winter squash", "pumpkins harvest", "sweet potatoes", "straw bales", "garden snow", "snow covered garden", "basement stairs", "old basement", "wooden shelves jars", "thermometer cold", "porch winter", "drying apple slices", "apple rings", "dried herbs hanging", "dried mushrooms", "green beans", "beef jerky", "slicing beef", "sauerkraut", "shredding cabbage", "fermenting crock", "pickles jar", "pickled eggs", "flour sack", "pouring flour", "cornmeal", "cheese wax", "cheddar block", "lard jar", "bacon fat", "snowy forest", "logging trees winter", "log cabin winter", "horse sled snow", "frozen river ice", "wood burning stove", "kerosene lantern", "old man cooking", "shovel digging", "glass jars pantry", "winter forest snow"];
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
