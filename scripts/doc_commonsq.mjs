// doc_commonsq.mjs — fotos REALES puntuales de Wikimedia Commons (CC/PD) por consulta, para planos literales.
// Uso: node scripts/doc_commonsq.mjs <raiz> <consultas.tsv> [porConsulta=8]
//   tsv: clave \t tipo (r=foto, h=histórico: acepta vertical y ≥800 px) \t consulta1|consulta2…
//   → <raiz>/fotos/<clave>/q<linea>_<n>.jpg  + fuentes en <raiz>/fotos/_fuentes_q.json (créditos para la descripción)
import fs from "fs";
import path from "path";
const [R, Q, PER = "8"] = process.argv.slice(2);
const UA = { "User-Agent": "cronicas-doc/1.0 (documentary research; commons API)" };
const BAD = /\bmap\b|plan of|diagram|logo|\.svg|\.pdf|chart|coat of arms|flag|stamp|coin|poster/i;
const fuentes = path.join(R, "fotos", "_fuentes_q.json");
const meta = fs.existsSync(fuentes) ? JSON.parse(fs.readFileSync(fuentes, "utf8")) : {};
const lineas = fs.readFileSync(Q, "utf8").split(/\r?\n/).filter((l) => l.trim());
for (const [li, l] of lineas.entries()) {
  const [k, tipo, qs] = l.split("\t"); const hist = tipo === "h";
  const dir = path.join(R, "fotos", k); fs.mkdirSync(dir, { recursive: true });
  const seen = new Map();
  for (const q of qs.split("|")) {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1920`;
    let j = {};
    for (let a = 0; a < 4; a++) { j = await fetch(u, { headers: UA }).then((r) => r.json()).catch(() => ({ error: 1 })); if (!j.error) break; await new Promise((r) => setTimeout(r, 5000 * (a + 1))); }
    const pages = Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index);
    for (const p of pages) {
      const ii = p.imageinfo?.[0]; if (!ii || BAD.test(p.title) || seen.has(p.title)) continue;
      if (hist ? ii.width < 640 && ii.height < 640 : ii.width < 640 || ii.width < ii.height * 1.05) continue;   // <1400 px → va en tarjeta, no a pantalla completa
      const lic = ii.extmetadata?.LicenseShortName?.value || ""; if (!/cc|public domain|pd/i.test(lic)) continue;
      seen.set(p.title, { q, w: ii.width, h: ii.height, title: p.title, url: ii.thumburl, lic, artist: (ii.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 80), page: ii.descriptionurl });
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  const arr = [...seen.values()].slice(0, +PER * qs.split("|").length > 16 ? 16 : +PER * 2); let n = 0;
  for (const [i, f] of arr.entries()) {
    const out = path.join(dir, `q${String(li).padStart(2, "0")}_${String(i).padStart(2, "0")}.jpg`); f.f = path.relative(R, out).split(path.sep).join("/");
    if (fs.existsSync(out)) continue;
    const r = await fetch(f.url, { headers: UA }).catch(() => null);
    if (r?.ok) { fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); n++; }
    await new Promise((r) => setTimeout(r, 300));
  }
  meta[`q${li}`] = arr; console.log(li, k, qs.split("|")[0], "→", arr.length, "(nuevas", n + ")");
  fs.writeFileSync(fuentes, JSON.stringify(meta, null, 1));
}
