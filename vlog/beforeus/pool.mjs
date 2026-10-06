// pool.mjs — metraje REAL del canal Before Us (genérico, por slug).
//   node vlog/beforeus/pool.mjs <slug> <queries.json>
// queries.json = { "pexels": [{q, tags:[..], n?}], "wiki": [{q, tags:[..], n?}] }
// Salida: D:/rtmp/<slug>/footage/{px_*.mp4, wm_*.jpg, catalog.json}  (reanudable: no re-baja lo que ya está)
// Pexels: clips HD ≤40 s, se corta un tramo de 7 s del medio y se conforma a 1920x1080 30/1 CFR sin audio.
// Wikimedia: imágenes ≥1100 px de ancho, sólo licencias libres (CC/PD), se guarda autor+licencia para la descripción.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const [SLUG, QF] = process.argv.slice(2);
if (!SLUG || !QF) { console.error("uso: pool.mjs <slug> <queries.json>"); process.exit(2); }
for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const PX = process.env.PEXELS_API_KEY;
const OUT = `D:/rtmp/${SLUG}/footage/`;
fs.mkdirSync(OUT, { recursive: true });
const CAT = OUT + "catalog.json";
const cat = fs.existsSync(CAT) ? JSON.parse(fs.readFileSync(CAT, "utf8")) : [];
const have = new Set(cat.map((c) => c.id));
const Q = JSON.parse(fs.readFileSync(QF, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const save = () => fs.writeFileSync(CAT, JSON.stringify(cat, null, 1));
const ff = (args) => spawnSync("ffmpeg", ["-y", "-v", "error", ...args], { encoding: "utf8" });
const UA = { "User-Agent": "BeforeUsDoc/1.0 (documentary research; contact via github bagasy-search)" };

async function dl(url, dst, headers = {}) {
  const r = await fetch(url, { headers: { ...UA, ...headers }, signal: AbortSignal.timeout(120000) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  fs.writeFileSync(dst, Buffer.from(await r.arrayBuffer()));
}

let nPx = 0, nWm = 0, fail = 0;
for (const it of (process.env.ONLY_WIKI ? [] : Q.pexels ?? [])) {
  if (!PX) { console.error("sin PEXELS_API_KEY"); break; }
  try {
    const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(it.q)}&per_page=15&orientation=landscape`, { headers: { Authorization: PX }, signal: AbortSignal.timeout(30000) });
    const js = await r.json();
    let k = 0;
    for (const v of js.videos ?? []) {
      if (k >= (it.n ?? 3)) break;
      const id = "px_" + v.id;
      if (have.has(id)) { k++; continue; }
      if (v.duration > 45 || v.duration < 4) continue;
      const f = (v.video_files || []).filter((x) => x.width >= 1280 && x.width <= 2600 && /mp4/.test(x.file_type)).sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920))[0];
      if (!f) continue;
      const raw = OUT + id + "_raw.mp4", dst = OUT + id + ".mp4";
      try {
        await dl(f.link, raw);
        const ss = Math.max(0, v.duration / 2 - 3.5), len = Math.min(7, v.duration);
        const o = ff(["-ss", String(ss), "-t", String(len), "-i", raw, "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-r", "30", dst]);
        fs.rmSync(raw, { force: true });
        if (o.status !== 0 || !fs.existsSync(dst)) throw new Error("ffmpeg " + (o.stderr || "").slice(-200));
        cat.push({ id, file: dst, type: "video", start: 0, end: len, desc: it.q + " · " + (v.url || "").split("/").filter(Boolean).pop(), tags: it.tags ?? [], credit: `Pexels / ${v.user?.name ?? ""}`, src: v.url });
        have.add(id); nPx++; k++; save();
      } catch (e) { fail++; console.log("px fallo", id, e.message); }
    }
  } catch (e) { fail++; console.log("pexels query fallo", it.q, e.message); }
  await sleep(400);
}

for (const it of Q.wiki ?? []) {
  try {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch=${encodeURIComponent(it.q + " filetype:bitmap")}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=1920`;
    const js = await (await fetch(u, { headers: UA, signal: AbortSignal.timeout(30000) })).json();
    const pages = Object.values(js.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    let k = 0;
    for (const p of pages) {
      if (k >= (it.n ?? 3)) break;
      const ii = p.imageinfo?.[0]; if (!ii) continue;
      if (!/jpeg|png/.test(ii.mime) || ii.width < 1100) continue;
      const md = ii.extmetadata || {};
      const lic = (md.LicenseShortName?.value || "").trim();
      if (!/CC|Public domain|PD|CC0/i.test(lic) || /NC|ND/.test(lic)) continue;
      const id = "wm_" + p.pageid;
      if (have.has(id)) { k++; continue; }
      const dst = OUT + id + ".jpg";
      try {
        await dl(ii.thumburl || ii.url, OUT + id + "_raw");
        const o = ff(["-i", OUT + id + "_raw", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", dst]);
        fs.rmSync(OUT + id + "_raw", { force: true });
        if (o.status !== 0) throw new Error("ffmpeg");
        const artist = String(md.Artist?.value || "").replace(/<[^>]+>/g, "").trim().slice(0, 80);
        cat.push({ id, file: dst, type: "photo", desc: it.q + " · " + p.title.replace(/^File:/, ""), tags: it.tags ?? [], credit: `${artist} / ${lic} / Wikimedia Commons`, src: ii.descriptionurl, ratio: +(ii.width / ii.height).toFixed(2) });
        have.add(id); nWm++; k++; save();
      } catch (e) { fail++; console.log("wm fallo", id, e.message); }
      await sleep(300);
    }
  } catch (e) { fail++; console.log("wiki query fallo", it.q, e.message); await sleep(30000); }
  await sleep(2500);
}
save();
console.log(`MEDIDO: pexels +${nPx} · wikimedia +${nWm} · fallos ${fail} · catálogo ${cat.length}`);
process.exit(cat.length ? 0 : 2);
