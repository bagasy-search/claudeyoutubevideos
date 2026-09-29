// Fotos de ARCHIVO real (dominio público) de Wikimedia Commons (LoC/NARA/MNHS subidas ahí): búsqueda → sólo licencia PD/CC0 → miniatura 1920 px + créditos.
// node vlog/olstove/archive_get.mjs   → D:/rtmp/olstove_src/arch/{raw/*.jpg, cand.json}
import fs from "node:fs";
const OUT = "D:/rtmp/olstove_src/arch/";
fs.mkdirSync(OUT + "raw", { recursive: true });
const QS = {
  camp: ["logging camp Minnesota winter", "lumber camp cook shanty interior", "lumberjack camp bunkhouse stove", "logging camp dining hall cook", "lumber camp cookhouse cook"],
  stove: ["wood cookstove kitchen 1900", "pot-bellied stove interior", "cast iron stove old photograph farmhouse kitchen", "Franklin stove antique"],
  cabin: ["log cabin winter snow historic", "log cabin interior stove pioneer"],
  wood: ["cordwood pile farm winter", "splitting wood axe historic photograph", "woodpile stacked firewood old photo", "sawing firewood buzz saw farm"],
  chimney: ["chimney sweep historic photograph", "chimney sweep 1900"],
  winter: ["farmhouse winter snow historic photograph", "horse sled winter logging"],
};
const cand = fs.existsSync(OUT + "cand.json") ? JSON.parse(fs.readFileSync(OUT + "cand.json", "utf8")) : {};
const okLic = (l = "") => /public domain|^pd|cc0|no known copyright|no restrictions/i.test(l);
for (const [k, qs] of Object.entries(QS)) for (const q of qs) {
  const u = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch=" + encodeURIComponent(q + " filetype:bitmap") + "&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1920";
  let d; for (let t = 0; t < 3 && !d; t++) { try { const r = await fetch(u, { headers: { "User-Agent": "olstove-video/1.0 (educational; contact via project)" } }); if (r.ok) d = await r.json(); else await new Promise((s) => setTimeout(s, 4000)); } catch { await new Promise((s) => setTimeout(s, 4000)); } }
  let n = 0;
  for (const p of Object.values(d?.query?.pages || {})) {
    const ii = p.imageinfo?.[0]; if (!ii || cand[p.pageid]) continue;
    const m = ii.extmetadata || {}; const lic = m.LicenseShortName?.value || "";
    if (!okLic(lic) || ii.width < 1000) continue;
    cand[p.pageid] = { id: p.pageid, k, q, title: p.title, lic, credit: (m.Credit?.value || "").replace(/<[^>]+>/g, "").slice(0, 160), artist: (m.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 100), desc: (m.ImageDescription?.value || "").replace(/<[^>]+>/g, "").slice(0, 200), page: ii.descriptionshorturl || ii.descriptionurl, url: ii.thumburl || ii.url, w: ii.width, h: ii.height, date: m.DateTimeOriginal?.value || "" };
    n++;
  }
  console.log(k, q, n);
  await new Promise((s) => setTimeout(s, 1200));
}
for (const c of Object.values(cand)) {
  const f = OUT + `raw/${c.id}.jpg`; if (fs.existsSync(f)) continue;
  try { const r = await fetch(c.url, { headers: { "User-Agent": "olstove-video/1.0 (educational)" } }); if (r.ok) fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); else console.log("x", c.id, r.status); } catch (e) { console.log("x", c.id, String(e).slice(0, 50)); }
  await new Promise((s) => setTimeout(s, 700));
}
fs.writeFileSync(OUT + "cand.json", JSON.stringify(cand, null, 1));
console.log("candidatas PD:", Object.keys(cand).length);
