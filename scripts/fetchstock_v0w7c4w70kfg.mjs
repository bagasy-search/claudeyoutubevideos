// fetchstock_v0w7c4w70kfg.mjs — Pexels THROTTLEADO con backoff y DEDUP por id.
// Aprendizajes del canal (memoria 2026-07-27):
//   · concurrencia 5 → 429 duro a los ~11 clips. 1 request cada 1.3s aguanta.
//   · en cada 429 se espera 20-90 s (backoff) y se sigue: la cuota se DRENA.
//   · DEDUP por id de Pexels → la misma query dos veces da dos clips DISTINTOS
//     (el creador prohíbe repetir clips).
//   · queries CORTAS (2-3 palabras) o no matchea nada.
// Aislamiento: todo cae en public/broll/<slug>/ (broll_isolation_gate lo exige).
import fs from "fs";
import path from "path";

const SLUG = "v0w7c4w70kfg";
const OUT = `public/broll/${SLUG}`;
const KEY = (fs.readFileSync(".env", "utf8").match(/PEXELS_API_KEY=(.+)/) || [])[1]?.trim();
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }

fs.mkdirSync(OUT, { recursive: true });
const LIST = JSON.parse(fs.readFileSync("_dir/clips.json", "utf8"));
const STATE = "_dir/_fetched.json";
const done = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {};
const seenIds = new Set(Object.values(done).map((d) => d.id));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0, ok = 0, fail = 0, skip = 0;

for (const item of LIST) {
  n++;
  const dest = path.join(OUT, item.name + ".mp4");
  if (done[item.name] && fs.existsSync(dest) && fs.statSync(dest).size > 20000) { skip++; continue; }

  let got = false;
  for (let attempt = 0; attempt < 4 && !got; attempt++) {
    try {
      const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(item.query)}&per_page=15&orientation=landscape`;
      const r = await fetch(url, { headers: { Authorization: KEY } });
      if (r.status === 429) {
        const wait = 20000 + attempt * 25000;
        process.stdout.write(`\n  429 · espero ${wait / 1000}s ... `);
        await sleep(wait);
        continue;
      }
      if (!r.ok) { fail++; break; }
      const j = await r.json();
      // DEDUP: el primer video de esta query cuyo id no se haya usado todavía
      const cand = (j.videos || []).find((v) => !seenIds.has(v.id));
      if (!cand) { fail++; break; }
      const files = (cand.video_files || [])
        .filter((f) => f.width && f.width >= 960 && f.width <= 2200)
        .sort((a, b) => a.width - b.width);
      const pick = files[0] || (cand.video_files || [])[0];
      if (!pick) { fail++; break; }
      const vr = await fetch(pick.link);
      if (!vr.ok) { fail++; break; }
      const buf = Buffer.from(await vr.arrayBuffer());
      if (buf.length < 20000) { fail++; break; }
      fs.writeFileSync(dest, buf);
      seenIds.add(cand.id);
      done[item.name] = { id: cand.id, query: item.query, sec: item.sec };
      fs.writeFileSync(STATE, JSON.stringify(done, null, 1));
      ok++; got = true;
    } catch (e) {
      await sleep(4000);
    }
  }
  if (n % 10 === 0) process.stdout.write(`\n[${n}/${LIST.length}] ok ${ok} · skip ${skip} · fail ${fail}`);
  await sleep(1300);
}
console.log(`\n\nFIN · bajados ${ok} · ya estaban ${skip} · sin resultado ${fail} · total en disco ${fs.readdirSync(OUT).filter((f) => f.endsWith(".mp4")).length}`);
