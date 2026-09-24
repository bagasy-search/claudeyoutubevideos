// fetch_e7hdoc_commons.mjs — fotos de los 7 sitios desde Wikimedia Commons CON licencia verificada.
// Pexels no tiene Baalbek, Puma Punku, Kailasa ni Göbekli Tepe: el material específico sale de acá.
// Descarta todo lo que no tenga licencia libre reconocida. Escribe _e7hdoc_commons.json con los créditos.
import fs from 'fs';

const UA = 'e7h-doc/1.0 (documental educativo; contacto via canal)';
const OK_LIC = /^(cc[ -]by([ -]sa)?[ -][0-9.]+|public domain|cc0|pd-.*)/i;

// [slug, [queries], cuántas quiero]
const SITIOS = [
  ['baalbek',   ['Baalbek trilithon', 'Baalbek Temple of Jupiter', 'Stone of the Pregnant Woman Baalbek', 'Baalbek quarry megalith'], 6],
  ['giza',      ['Great Pyramid of Giza', 'Giza pyramid casing stones', 'Great Pyramid corner socket', 'Grand Gallery Great Pyramid'], 6],
  ['sacsay',    ['Sacsayhuaman', 'Sacsayhuaman walls', 'Inca polygonal masonry Cusco', 'Twelve angled stone Cusco'], 6],
  ['pumapunku', ['Pumapunku', 'Puma Punku H blocks', 'Tiwanaku Bolivia stonework', 'Tiwanaku Kalasasaya'], 6],
  ['kailasa',   ['Kailasa temple Ellora', 'Ellora Caves cave 16', 'Kailasanatha temple Ellora aerial'], 6],
  ['yonaguni',  ['Yonaguni Monument', 'Yonaguni underwater ruins', 'Yonaguni Jima'], 4],
  ['gobekli',   ['Göbekli Tepe', 'Gobekli Tepe pillar', 'Gobekli Tepe enclosure', 'Gobekli Tepe relief'], 7],
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

async function buscar(query, n = 20) {
  const j = await api({action: 'query', generator: 'search', gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: 6, gsrlimit: String(n), prop: 'imageinfo',
    iiprop: 'url|size|extmetadata', iiurlwidth: '2400'});
  const pages = j && j.query && j.query.pages ? Object.values(j.query.pages) : [];
  return pages.map((p) => {
    const ii = (p.imageinfo || [])[0] || {};
    const m = ii.extmetadata || {};
    return {
      title: p.title,
      url: ii.thumburl || ii.url,
      w: ii.thumbwidth || ii.width, h: ii.thumbheight || ii.height,
      ow: ii.width, oh: ii.height,
      lic: strip(m.LicenseShortName && m.LicenseShortName.value),
      art: strip(m.Artist && m.Artist.value),
      desc: strip(m.ImageDescription && m.ImageDescription.value).slice(0, 140),
      page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
    };
  }).filter((x) => x.url && x.ow >= 1400 && x.oh >= 900 && OK_LIC.test(x.lic || ''));
}

async function bajar(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, {headers: {'User-Agent': UA}});
      if (!r.ok) { await new Promise((s) => setTimeout(s, 900)); continue; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 30000) return false;
      fs.writeFileSync(dest, b);
      return true;
    } catch { await new Promise((s) => setTimeout(s, 900)); }
  }
  return false;
}

fs.mkdirSync('public/img', {recursive: true});
const creditos = [];
const vistos = new Set();

for (const [slug, queries, cuantas] of SITIOS) {
  let i = 0;
  for (const q of queries) {
    if (i >= cuantas) break;
    const res = await buscar(q);
    for (const r of res) {
      if (i >= cuantas) break;
      if (vistos.has(r.title)) continue;
      vistos.add(r.title);
      const name = `e7hd_${slug}_${String(i + 1).padStart(2, '0')}`;
      const dest = `public/img/${name}.jpg`;
      if (await bajar(r.url, dest)) {
        creditos.push({name, dest, sitio: slug, query: q, ...r});
        console.log('OK', name, '|', r.lic, '|', r.art.slice(0, 40), '|', r.title.slice(0, 60));
        i++;
      }
      await new Promise((s) => setTimeout(s, 250));
    }
  }
  if (i < cuantas) console.log(`  ⚠ ${slug}: solo ${i}/${cuantas}`);
}

fs.writeFileSync('_e7hdoc_commons.json', JSON.stringify(creditos, null, 1));
console.log(`\nTOTAL ${creditos.length} imágenes · créditos en _e7hdoc_commons.json`);
