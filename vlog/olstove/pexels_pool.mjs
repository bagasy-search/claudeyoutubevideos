// POOL de stock Pexels para olstove: queries genéricas del nicho → metadatos + póster (para hoja de contactos y juez).
// node vlog/olstove/pexels_pool.mjs  → D:/rtmp/olstove_src/pex/pool.json + posters/
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OUT = "D:/rtmp/olstove_src/pex/";
const QK = {"fire": ["wood stove fire flames", "burning logs in fireplace", "fire flames close up dark", "campfire logs burning"], "stove": ["cast iron wood stove", "old wood burning stove cabin", "black stove with pipe rustic"], "cabin": ["log cabin winter snow", "snowy cabin forest chimney smoke", "rustic cabin interior fireplace"], "smoke": ["chimney smoke winter roof", "smoke rising from chimney"], "woodpile": ["stacked firewood", "firewood pile outdoors", "split logs stacked wall"], "chop": ["splitting firewood with axe", "chopping wood log", "cutting logs chainsaw firewood"], "kindling": ["kindling sticks", "lighting fire with match", "lighting fireplace newspaper kindling"], "embers": ["glowing embers fire", "hot coals glowing"], "ash": ["cleaning ash from fireplace", "shoveling ashes", "metal bucket ash"], "winter": ["snow falling window frost", "frost on window glass", "snowy forest trees winter", "winter sunrise forest"], "cozy": ["cozy cabin winter warm", "hands warming near fire", "warm living room fireplace"], "cook": ["cast iron pot on stove cooking", "chicken and dumplings pot", "simmering broth pot steam", "stirring stew wooden spoon", "cast iron skillet cooking"], "alarm": ["carbon monoxide detector", "smoke detector ceiling"], "sweep": ["chimney sweep brush", "cleaning chimney flue"], "roof": ["metal chimney pipe on roof", "chimney cap roof snow"], "draft": ["sealing window draft caulk", "door weather stripping", "towel under door draft"], "measure": ["measuring tape wood stack", "man carrying firewood", "wheelbarrow firewood"], "calendar": ["calendar pages autumn", "autumn leaves fall forest"]};
const Q = Object.values(QK).flat();
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
