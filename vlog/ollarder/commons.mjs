// Busca en Wikimedia Commons SÓLO dominio público / CC0 y lista candidatos (título, licencia, autor, url). node vlog/olcast/commons.mjs "query" ...
const qs = process.argv.slice(2);
for (const q of qs) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600`;
  const r = await fetch(u, { headers: { "User-Agent": "olcast-research/1.0 (bautielcrack4@gmail.com)" } });
  const d = await r.json(); const pages = Object.values(d.query?.pages || {});
  console.log("##", q, pages.length);
  for (const p of pages) {
    const ii = p.imageinfo?.[0]; if (!ii) continue; const m = ii.extmetadata || {};
    const lic = (m.LicenseShortName?.value || "").trim();
    if (!/public domain|pd|cc0/i.test(lic)) continue;
    console.log(p.title.replace("File:", "").slice(0, 80), "|", lic, "|", (m.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 40), "|", ii.width + "x" + ii.height, "|", ii.thumburl);
  }
}
