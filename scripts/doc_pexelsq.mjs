// doc_pexelsq.mjs — metraje REAL en HD de Pexels (licencia libre) por consulta, para planos literales de documentales.
// Baja la versión chica (≤640) para indexar con CLIP (doc_clipidx) y anota el link HD (1920) para el armado.
// Uso: node scripts/doc_pexelsq.mjs <raiz> <consultas.tsv> [porConsulta=10]
//   tsv: clave \t consulta1|consulta2…   → <raiz>/p360/<clave>/px_<id>.mp4 + <raiz>/pexels.json {px_<id>: {hd, w, h, dur, url, user, q}}
import fs from "fs";
import path from "path";
const [R, Q, PER = "10"] = process.argv.slice(2);
const KEY = process.env.PEXELS_API_KEY || (fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", ".env"), "utf8").match(/^PEXELS_API_KEY=(.*)$/m) || [])[1]?.trim();
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }
const META = path.join(R, "pexels.json");
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, "utf8")) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const l of fs.readFileSync(Q, "utf8").split(/\r?\n/).filter((x) => x.trim() && !x.startsWith("#"))) {
  const [k, qs] = l.split("\t"); const dir = path.join(R, "p360", k); fs.mkdirSync(dir, { recursive: true });
  let nuevos = 0;
  for (const q of qs.split("|")) {
    let j = {};
    for (let a = 0; a < 4; a++) {
      const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${PER}&orientation=landscape`, { headers: { Authorization: KEY } }).catch(() => null);
      if (r?.ok) { j = await r.json(); break; }
      await sleep(4000 * (a + 1));
    }
    for (const v of j.videos || []) {
      const id = `px_${v.id}`; if (meta[id]) continue;
      const fl = (v.video_files || []).filter((f) => f.file_type === "video/mp4" && f.width >= f.height);
      const hd = fl.filter((f) => f.width >= 1900 && f.width <= 2600).sort((a, b) => a.width - b.width)[0] || fl.filter((f) => f.width >= 1280).sort((a, b) => b.width - a.width)[0];
      const sd = fl.filter((f) => f.width >= 480 && f.width <= 960).sort((a, b) => a.width - b.width)[0];
      if (!hd || !sd) continue;
      const out = path.join(dir, `${id}.mp4`);
      if (!fs.existsSync(out)) { const r = await fetch(sd.link).catch(() => null); if (!r?.ok) continue; fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); }
      meta[id] = { k, hd: hd.link, w: hd.width, h: hd.height, dur: v.duration, url: v.url, user: v.user?.name || "", q };
      nuevos++;
    }
    await sleep(400);
  }
  fs.writeFileSync(META, JSON.stringify(meta, null, 1));
  console.log(k, qs.split("|")[0], "→ nuevos", nuevos);
}
