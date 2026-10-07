// gemas.mjs — ARQUEOLOGÍA de moldes (método Elias Yoder, skill plan-canal-clon §2E), versión nube.
// Busca videos VIEJOS (≥ 2 años) que siguen trayendo tráfico, de canales chicos, que NADIE re-empaquetó.
// El outlier de esta semana ya lo copian 8 granjas; la joya es el video real de hace 3 años.
//
//   node analizador/gemas.mjs "semilla 1" "semilla 2" ...      → analizador/cache/radar/gemas.json
//
// Compuertas (env para aflojar):
//   G1 edad ≥ AGE meses (24) · G2 views ≥ MINV (300000) · G3 vistas/día de vida ≥ VPD (100)
//   G4 subs ≤ MAXSUBS (800000) y views/subs ≥ MULT (5) · G5 ningún clon de los últimos 12 meses ≥ 40%
// ⚠ G3 es el promedio de vida (views/edad), no la velocidad de HOY: es un piso, no una medición.
import fs from "fs";
import path from "path";

const OUT = path.join("analizador", "cache", "radar");
fs.mkdirSync(OUT, { recursive: true });
const AGE = +(process.env.AGE || 24), MINV = +(process.env.MINV || 300000), VPD = +(process.env.VPD || 100);
const MAXSUBS = +(process.env.MAXSUBS || 800000), MULT = +(process.env.MULT || 5);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const HDR = { "user-agent": UA, "accept-language": "en-US,en;q=0.9", cookie: "CONSENT=YES+1" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pc = (s) => { if (!s) return 0; s = String(s).replace(/,/g, ""); const m = s.match(/([\d.]+)\s*([KMB])?/i); return m ? Math.round(parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[(m[2] || "").toUpperCase()] || 1)) : 0; };
const meses = (s) => { const m = String(s || "").match(/(\d+)\s*([a-z]+)/i); if (!m) return 0; const n = +m[1], u = m[2].toLowerCase();
  return u.startsWith("y") ? n * 12 : u.startsWith("mo") ? n : u.startsWith("w") ? n / 4.3 : u.startsWith("d") ? n / 30 : 0; };
async function get(url) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url, { headers: HDR }); if (r.ok) return await r.text(); } catch {} await sleep(1500 * (a + 1)); } return null; }
function vids(h) {
  const i = h?.indexOf("var ytInitialData = "); if (!(i >= 0)) return [];
  let d; try { d = JSON.parse(h.slice(i + 20, h.indexOf(";</script>", i))); } catch { return []; }
  const out = [];
  (function w(n) { if (!n || typeof n !== "object") return; if (n.videoRenderer) { const v = n.videoRenderer, o = v.ownerText?.runs?.[0];
    out.push({ id: v.videoId, title: v.title?.runs?.map((r) => r.text).join("") || "", views: pc(v.viewCountText?.simpleText), meses: meses(v.publishedTimeText?.simpleText),
      when: v.publishedTimeText?.simpleText || "", len: v.lengthText?.simpleText || "", channel: o?.text, channelId: o?.navigationEndpoint?.browseEndpoint?.browseId }); return; }
    for (const k in n) w(n[k]); })(d);
  return out;
}
async function subsDe(id) {
  const h = await get(`https://www.youtube.com/channel/${id}/about`);
  const subs = pc(h?.match(/"subscriberCountText":"([^"]+)"/)?.[1]);
  const last = h?.match(/"publishedTimeText":\{"simpleText":"([^"]+)"/)?.[1] || "";
  return { subs, ultimo: last };
}

const seeds = process.argv.slice(2);
if (!seeds.length) { console.error('uso: node analizador/gemas.mjs "semilla 1" "semilla 2" ...'); process.exit(1); }
const cand = new Map();
for (const q of seeds) {
  // sp=CAM%3D → orden por vistas, sin filtro de fecha (lo viejo aparece)
  for (const sp of ["CAM%253D", ""]) {
    const h = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}${sp ? `&sp=${sp}` : ""}`);
    for (const v of vids(h)) if (v.channelId && !cand.has(v.id)) cand.set(v.id, { ...v, seed: q });
    await sleep(700);
  }
}
const pre = [...cand.values()].filter((v) => v.meses >= AGE && v.views >= MINV && v.views / (v.meses * 30.4) >= VPD);
console.error(`candidatos ${cand.size} · pasan G1-G3: ${pre.length}`);
const joyas = [], descartadas = [];
const subsCache = {};
for (const v of pre) {
  subsCache[v.channelId] ||= await subsDe(v.channelId);
  const { subs, ultimo } = subsCache[v.channelId];
  v.subs = subs; v.mult = +(v.views / Math.max(subs, 1)).toFixed(1); v.vpd = Math.round(v.views / (v.meses * 30.4)); v.ultimoVideo = ultimo;
  if (subs > MAXSUBS || v.mult < MULT) { descartadas.push({ ...v, por: "G4" }); continue; }
  // G5: ¿alguien lo re-empaquetó en el último año y le fue bien?
  const h = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(v.title.slice(0, 90))}&sp=EgQIBRAB`);
  const clones = vids(h).filter((c) => c.id !== v.id && c.meses <= 12);
  const mejor = clones.sort((a, b) => b.views - a.views)[0];
  v.clones = clones.length; v.mejorClon = mejor ? { title: mejor.title, views: mejor.views, when: mejor.when, channel: mejor.channel } : null;
  if (mejor && mejor.views >= 0.4 * v.views) { descartadas.push({ ...v, por: "G5" }); continue; }
  joyas.push(v);
  await sleep(600);
}
joyas.sort((a, b) => b.vpd - a.vpd);
fs.writeFileSync(path.join(OUT, "gemas.json"), JSON.stringify({ seeds, at: new Date().toISOString(), joyas, descartadas }, null, 1));
for (const j of joyas) console.log(`💎 ${String(j.views).padStart(9)} · ${j.when.padEnd(12)} · ${String(j.vpd).padStart(5)}/día · x${j.mult} (${j.subs} subs, último video ${j.ultimoVideo || "?"}) · ${j.channel} · ${j.id} · ${j.title.slice(0, 80)}${j.mejorClon ? `  [mejor clon ${j.mejorClon.views}]` : ""}`);
console.error(`joyas ${joyas.length} · descartadas ${descartadas.length} (G4 ${descartadas.filter((d) => d.por === "G4").length}, G5 ${descartadas.filter((d) => d.por === "G5").length})`);
