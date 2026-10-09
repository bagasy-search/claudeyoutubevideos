// POOL de stock Pexels para olwinter2: queries genéricas del nicho → metadatos + póster (para hoja de contactos y juez).
// node vlog/olwinter2/pexels_pool.mjs  → D:/rtmp/olwinter2_src/pex/pool.json + posters/
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OUT = "D:/rtmp/olwinter2_src/pex/";
const Q = ["shredded cabbage frying pan", "sliced cabbage", "egg noodles boiling", "frying onions skillet", "sliced potatoes skillet", "frying eggs skillet", "cracking egg pan", "chicken soup pot", "chicken broth simmering", "chopping carrots celery", "noodle soup bowl", "macaroni tomato", "grated cheddar cheese", "baking dish oven", "ground beef browning", "gravy pan whisk", "mashed potatoes", "black pepper grinder", "lentils cooking", "shepherds pie", "canned salmon", "fish cakes frying", "onion soup", "caramelized onions", "slicing onions", "melted cheese toast", "colcannon", "butter melting potatoes", "spaghetti boiling", "garlic slicing", "toasting bread crumbs", "olive oil garlic pan", "stale bread", "snowy forest", "winter forest snow", "logging trees winter", "chopping firewood", "wood burning stove", "glowing embers", "log cabin winter", "snowstorm cabin", "frozen thermometer", "steam rising pot", "ladle soup pot", "stirring pot wooden spoon", "cast iron skillet", "old man cooking", "kerosene lantern", "enamel coffee mug", "grocery receipt", "coins counting", "handwritten notebook", "shopping list paper", "pantry shelf jars", "refrigerator leftovers containers", "peppercorns", "pepper mill", "salmon patties", "salmon cakes", "frozen lake winter", "cheese toast", "french onion soup", "food storage containers", "soup containers", "mashed potato casserole", "baked potato topping", "steaming pot", "soup pot steam", "hot soup steam"];
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
