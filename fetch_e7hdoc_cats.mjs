// fetch_e7hdoc_cats.mjs — segundo pase: baja por CATEGORÍA de Commons (mucho más preciso que
// la búsqueda de texto para sitios arqueológicos). Rellena los sitios que quedaron cortos.
import fs from 'fs';

const UA = 'e7h-doc/1.0 (documental educativo; contacto via canal)';
const OK_LIC = /^(cc[ -]by([ -]sa)?[ -][0-9.]+|public domain|cc0|pd-.*)/i;

// [slug, [categorías], objetivo total incluyendo lo ya bajado]
const OBJETIVO = [
  ['pumapunku', ['Category:Pumapunku', 'Category:Puma Punku', 'Category:Tiwanaku (archaeological site)'], 7],
  ['gobekli',   ['Category:Göbekli Tepe', 'Category:Pillars of Göbekli Tepe'], 8],
  ['kailasa',   ['Category:Kailasanatha Temple, Ellora', 'Category:Kailash temple, Ellora', 'Category:Ellora Caves'], 7],
  ['giza',      ['Category:Great Pyramid of Giza'], 8],
  ['baalbek',   ['Category:Trilithon (Baalbek)', 'Category:Baalbek'], 8],
];

const api = async (params) => {
  const url = 'https://commons.wikimedia.org/w/api.php?format=json&origin=*&' + new URLSearchParams(params);
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, {headers: {'User-Agent': UA}});
      if (r.ok) return await r.json();
    } catch {}
    await new Promise((s) => setTimeout(s, 900));
  }
  return null;
};
const strip = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function porCategoria(cat, n = 60) {
  const j = await api({action: 'query', generator: 'categorymembers', gcmtitle: cat,
    gcmtype: 'file', gcmlimit: String(n), prop: 'imageinfo',
    iiprop: 'url|size|extmetadata', iiurlwidth: '2400'});
  const pages = j && j.query && j.query.pages ? Object.values(j.query.pages) : [];
  return pages.map((p) => {
    const ii = (p.imageinfo || [])[0] || {};
    const m = ii.extmetadata || {};
    return {
      title: p.title, url: ii.thumburl || ii.url,
      ow: ii.width, oh: ii.height,
      lic: strip(m.LicenseShortName && m.LicenseShortName.value),
      art: strip(m.Artist && m.Artist.value),
      page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
    };
  })
    .filter((x) => x.url && x.ow >= 1500 && x.oh >= 950 && OK_LIC.test(x.lic || ''))
    .filter((x) => !/\.svg|map|plan|diagram|drawing/i.test(x.title))
    .sort((a, b) => (b.ow * b.oh) - (a.ow * a.oh));   // las de mayor resolución primero
}

async function bajar(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, {headers: {'User-Agent': UA}});
      if (!r.ok) { await new Promise((s) => setTimeout(s, 900)); continue; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 40000) return false;
      fs.writeFileSync(dest, b);
      return true;
    } catch { await new Promise((s) => setTimeout(s, 900)); }
  }
  return false;
}

const previos = fs.existsSync('_e7hdoc_commons.json')
  ? JSON.parse(fs.readFileSync('_e7hdoc_commons.json', 'utf8')) : [];
const vistos = new Set(previos.map((p) => p.title));
const creditos = [...previos];

for (const [slug, cats, objetivo] of OBJETIVO) {
  let i = previos.filter((p) => p.sitio === slug).length;
  if (i >= objetivo) { console.log(`${slug}: ya tiene ${i}`); continue; }
  for (const cat of cats) {
    if (i >= objetivo) break;
    const res = await porCategoria(cat);
    console.log(`  ${cat} → ${res.length} candidatas`);
    for (const r of res) {
      if (i >= objetivo) break;
      if (vistos.has(r.title)) continue;
      vistos.add(r.title);
      const name = `e7hd_${slug}_${String(i + 1).padStart(2, '0')}`;
      const dest = `public/img/${name}.jpg`;
      if (await bajar(r.url, dest)) {
        creditos.push({name, dest, sitio: slug, query: cat, ...r});
        console.log('  OK', name, '|', r.lic, '|', r.title.slice(0, 62));
        i++;
      }
      await new Promise((s) => setTimeout(s, 220));
    }
  }
  console.log(`${slug}: ${i}/${objetivo}\n`);
}

fs.writeFileSync('_e7hdoc_commons.json', JSON.stringify(creditos, null, 1));
console.log(`TOTAL ${creditos.length} imágenes`);
