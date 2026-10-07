// radar.mjs — RADAR DE SUBNICHOS: encuentra subnichos donde canales NUEVOS están explotando ahora.
// Genérico (no por slug): los nichos y queries viven en analizador/radar_nichos.json.
// Sin API key: scrapea ytInitialData (search, /videos, /about) + innertube para paginar.
//
// Etapas (cada una lee/escribe en analizador/cache/radar/):
//   node analizador/radar.mjs search   [nicho…]   → videos de "este mes" por query  → videos.json
//   node analizador/radar.mjs channels             → ficha de cada canal con un hit → channels.json
//   node analizador/radar.mjs snowball             → queries nuevas desde títulos ganadores → re-search
//   node analizador/radar.mjs snapshot             → 2ª medición de los hits (velocidad real) → snapshots/
//   node analizador/radar.mjs score                → ranking de subnichos  → radar_report.json
//
// Env: CONC (paralelismo, 4) · PAGES (páginas por query, 2) · HIT (vistas mínimas de un hit, 30000)
//      WINDOW (sp de búsqueda: month|week, month)
import fs from "fs";
import path from "path";

const DIR = "analizador";
const OUT = path.join(DIR, "cache", "radar");
fs.mkdirSync(path.join(OUT, "snapshots"), { recursive: true });
const CFG = JSON.parse(fs.readFileSync(path.join(DIR, "radar_nichos.json"), "utf8"));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const HDR = { "user-agent": UA, "accept-language": "en-US,en;q=0.9", cookie: "CONSENT=YES+1" };
const CONC = +(process.env.CONC || 4);
const PAGES = +(process.env.PAGES || 2);
const HIT = +(process.env.HIT || 30000);
// sp = protobuf {sort: viewCount, filters: {uploadDate: month|week, type: video}}
const SP = { month: "CAMSBAgEEAE%3D", week: "CAMSBAgDEAE%3D" }[process.env.WINDOW || "month"];
const NOW = Date.now();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJ = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")); } catch { return d; } };
const writeJ = (f, o) => fs.writeFileSync(path.join(OUT, f), JSON.stringify(o, null, 1));

// ── parsers ──
export function parseCount(s) {
  if (!s) return 0;
  s = String(s).replace(/,/g, "");
  if (/^no /i.test(s)) return 0;
  const m = s.match(/([\d.]+)\s*([KMB])?/i);
  if (!m) return 0;
  return Math.round(parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[(m[2] || "").toUpperCase()] || 1));
}
export function parseAgo(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)\s*([a-z]+)\s+ago/i);
  if (!m) return null;
  const n = +m[1], u = m[2].toLowerCase();
  const per = u.startsWith("mo") ? 30 : u.startsWith("y") ? 365 : u.startsWith("w") ? 7 : u.startsWith("d") ? 1
    : u.startsWith("h") ? 1 / 24 : 0; // segundos/minutos → 0
  return Math.max(0.5, n * per);
}
// lockup: content "1.2M" + label "1.2 million views" → toma el label (más preciso)
const viewsOf = (parts) => {
  const p = parts.find((x) => /view/i.test(x));
  if (!p) return 0;
  const m = p.match(/([\d,.]+)\s*(thousand|million|billion)?\s*views/i);
  if (m) return Math.round(parseFloat(m[1].replace(/,/g, "")) * ({ thousand: 1e3, million: 1e6, billion: 1e9 }[(m[2] || "").toLowerCase()] || 1));
  return parseCount(p);
};
// mercado objetivo = inglés: descarta títulos con escrituras no latinas
export const isEnglishish = (t) => !/[\u0900-\u0DFF\u0600-\u06FF\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0E00-\u0E7F]/.test(t || "");
const jsonAfter = (h, key) => {
  const i = h.indexOf(key);
  if (i < 0) return null;
  const j = h.indexOf(";</script>", i);
  try { return JSON.parse(h.slice(i + key.length, j)); } catch { return null; }
};
function walk(n, fn) {
  if (!n || typeof n !== "object") return;
  if (fn(n) === false) return;
  for (const k in n) walk(n[k], fn);
}
const txt = (t) => t?.simpleText ?? t?.runs?.map((r) => r.text).join("") ?? t?.content ?? "";

async function get(url, tries = 3) {
  for (let a = 0; a < tries; a++) {
    try {
      const r = await fetch(url, { headers: HDR });
      if (r.status === 200) return await r.text();
      if (r.status === 429) await sleep(20000 * (a + 1));
    } catch {}
    await sleep(2000 * (a + 1));
  }
  return null;
}
async function post(endpoint, body, ver) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(`https://www.youtube.com/youtubei/v1/${endpoint}?prettyPrint=false`, {
        method: "POST", headers: { ...HDR, "content-type": "application/json" },
        body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: ver, hl: "en", gl: "US" } }, ...body }),
      });
      if (r.status === 200) return await r.json();
    } catch {}
    await sleep(2000 * (a + 1));
  }
  return null;
}
async function pool(items, fn, conc = CONC) {
  let i = 0, done = 0;
  const res = new Array(items.length);
  await Promise.all(Array.from({ length: conc }, async () => {
    while (i < items.length) {
      const k = i++;
      res[k] = await fn(items[k], k);
      if (++done % 25 === 0) process.stderr.write(`  · ${done}/${items.length}\n`);
      await sleep(300 + Math.random() * 500);
    }
  }));
  return res;
}

// ── search: videos de un query (orden por vistas, ventana month/week) ──
function videosFromSearch(d) {
  const out = [];
  let cont = null;
  walk(d, (n) => {
    if (n.videoRenderer) {
      const v = n.videoRenderer, o = v.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint;
      out.push({
        id: v.videoId, title: txt(v.title), views: parseCount(txt(v.viewCountText)),
        ageDays: parseAgo(txt(v.publishedTimeText)), len: txt(v.lengthText),
        channel: txt(v.ownerText), channelId: o?.browseId || null, handle: o?.canonicalBaseUrl?.replace(/^\//, "") || null,
      });
      return false;
    }
    if (n.continuationCommand?.token && !cont) cont = n.continuationCommand.token;
  });
  return { out, cont };
}
async function searchQuery(q) {
  const h = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=${SP}`);
  if (!h) return [];
  const ver = h.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] || "2.20261006.01.00";
  let { out, cont } = videosFromSearch(jsonAfter(h, "var ytInitialData = "));
  for (let p = 1; p < PAGES && cont; p++) {
    const d = await post("search", { continuation: cont }, ver);
    if (!d) break;
    const r = videosFromSearch(d);
    out = out.concat(r.out);
    cont = r.cont;
  }
  return out;
}
async function cmdSearch(only) {
  const db = readJ("videos.json", {});
  const jobs = [];
  for (const [nicho, qs] of Object.entries(CFG.nichos)) {
    if (only.length && !only.includes(nicho)) continue;
    for (const q of qs) jobs.push({ nicho, q });
  }
  const extra = readJ("snowball_queries.json", []);
  if (!only.length || only.includes("snowball")) for (const j of extra) jobs.push(j);
  console.error(`search: ${jobs.length} queries`);
  await pool(jobs, async ({ nicho, q }) => {
    const vids = await searchQuery(q);
    for (const v of vids) {
      const prev = db[v.id];
      db[v.id] = { ...v, nichos: [...new Set([...(prev?.nichos || []), nicho])], queries: [...new Set([...(prev?.queries || []), q])], seenAt: NOW };
    }
  });
  writeJ("videos.json", db);
  console.error(`videos únicos: ${Object.keys(db).length}`);
}

// ── channel: /about (subs, joined, views, nvideos, país) + /videos (últimos ~30) ──
async function channelInfo(id) {
  const h = await get(`https://www.youtube.com/channel/${id}/about`);
  if (!h) return null;
  const pick = (re) => h.match(re)?.[1];
  const info = {
    id,
    name: pick(/"channelMetadataRenderer":\{"title":"((?:[^"\\]|\\.)*)"/),
    handle: pick(/"canonicalChannelUrl":"http:\/\/www\.youtube\.com\/(@[^"]+)"/),
    subs: parseCount(pick(/"subscriberCountText":"([^"]+)"/)),
    totalViews: parseCount(pick(/"aboutChannelViewModel":\{[^]*?"viewCountText":"([^"]+)"/) || pick(/"viewCountText":"([\d,]+ views)"/)),
    nVideos: parseCount(pick(/"videoCountText":"([^"]+)"/)),
    joined: pick(/"joinedDateText":\{"content":"Joined ([^"]+)"/),
    country: pick(/"country":"([^"]+)"/),
    description: (pick(/"channelMetadataRenderer":\{[^]*?"description":"((?:[^"\\]|\\.)*)"/) || "").slice(0, 300),
  };
  info.ageDays = info.joined ? Math.round((NOW - Date.parse(info.joined)) / 864e5) : null;
  // canales viejos (>1 año) solo cuentan como oferta/competencia: no hace falta su lista de videos
  const vids = [];
  info.videos = vids;
  info.fetchedAt = NOW;
  if ((info.ageDays ?? 0) > 365 && process.env.FULL !== "1") return info;
  const hv = await get(`https://www.youtube.com/channel/${id}/videos`);
  if (hv) {
    walk(jsonAfter(hv, "var ytInitialData = "), (n) => {
      if (n.lockupViewModel?.contentId) {
        const l = n.lockupViewModel, md = l.metadata?.lockupMetadataViewModel;
        const parts = [];
        walk(md?.metadata, (m) => { if (m.metadataParts) { for (const p of m.metadataParts) parts.push(`${p.text?.content || ""} ${p.accessibilityLabel || ""}`); return false; } });
        let len = "";
        walk(l.contentImage, (m) => { if (m.thumbnailBadgeViewModel?.text) { len = m.thumbnailBadgeViewModel.text; return false; } });
        vids.push({
          id: l.contentId, title: md?.title?.content || "",
          views: viewsOf(parts), ageDays: parseAgo(parts.find((p) => /ago/i.test(p))), len,
        });
        return false;
      }
      if (n.videoRenderer) {
        const v = n.videoRenderer;
        vids.push({ id: v.videoId, title: txt(v.title), views: parseCount(txt(v.viewCountText)), ageDays: parseAgo(txt(v.publishedTimeText)), len: txt(v.lengthText) });
        return false;
      }
    });
  }
  info.videos = vids;
  info.fetchedAt = NOW;
  return info;
}
async function cmdChannels() {
  const vids = Object.values(readJ("videos.json", {}));
  const chans = readJ("channels.json", {});
  // canal candidato = tiene al menos un video ≥ HIT/3 en la ventana (los hits fuertes sobran; los medianos sirven para saturación)
  const want = new Map();
  for (const v of vids) if (v.channelId && v.views >= HIT / 3 && isEnglishish(v.title)) want.set(v.channelId, true);
  const todo = [...want.keys()].filter((id) => !chans[id] || NOW - chans[id].fetchedAt > 864e5);
  console.error(`channels: ${want.size} candidatos, ${todo.length} a bajar`);
  let k = 0;
  await pool(todo, async (id) => {
    const c = await channelInfo(id);
    // JSON round-trip: los substrings de V8 retienen el HTML entero (~1MB) → OOM a los ~3000 canales
    if (c) chans[id] = JSON.parse(JSON.stringify(c));
    if (++k % 50 === 0) writeJ("channels.json", chans);
  });
  writeJ("channels.json", chans);
}

// ── snowball: los títulos de los hits de canales nuevos → nuevas queries (mismo nicho) ──
function cmdSnowball() {
  const vids = Object.values(readJ("videos.json", {}));
  const chans = readJ("channels.json", {});
  const seen = new Set(Object.values(CFG.nichos).flat().map((q) => q.toLowerCase()));
  const prev = readJ("snowball_queries.json", []);
  for (const p of prev) seen.add(p.q.toLowerCase());
  const stop = new Set("the a an and or of to in on for with your you this that is are was it its why how what who when never ever every just my our their from after before than then they them these those will can could would should do does did not no yes all any".split(" "));
  const add = [];
  const hits = vids.filter((v) => v.views >= HIT && chans[v.channelId] && (chans[v.channelId].ageDays ?? 9999) <= 365).sort((a, b) => b.views - a.views);
  for (const v of hits.slice(0, 120)) {
    const words = v.title.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stop.has(w) && !/^\d+$/.test(w));
    const q = words.slice(0, 5).join(" ");
    if (q.split(" ").length >= 3 && !seen.has(q)) { seen.add(q); add.push({ nicho: v.nichos[0], q, from: v.id }); }
  }
  writeJ("snowball_queries.json", [...prev, ...add]);
  console.error(`snowball: +${add.length} queries (total ${prev.length + add.length})`);
}

// ── snapshot: re-medir los videos de los canales hit → delta de vistas real ──
async function cmdSnapshot() {
  const chans = readJ("channels.json", {});
  const ids = Object.values(chans).filter((c) => c.videos?.some((v) => v.views >= HIT)).map((c) => c.id);
  const snap = {};
  await pool(ids, async (id) => {
    const hv = await get(`https://www.youtube.com/channel/${id}/videos`);
    if (!hv) return;
    walk(jsonAfter(hv, "var ytInitialData = "), (n) => {
      if (n.lockupViewModel?.contentId) {
        const parts = [];
        walk(n.lockupViewModel.metadata, (m) => { if (m.metadataParts) { for (const p of m.metadataParts) parts.push(`${p.text?.content || ""} ${p.accessibilityLabel || ""}`); return false; } });
        snap[n.lockupViewModel.contentId] = viewsOf(parts);
        return false;
      }
    });
  });
  const f = `snapshots/${new Date(NOW).toISOString().slice(0, 16).replace(/[:T]/g, "-")}.json`;
  writeJ(f, { at: NOW, views: snap });
  console.error(`snapshot ${f}: ${Object.keys(snap).length} videos`);
}

// ── score: métricas por canal y por subnicho ──
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
function cmdScore() {
  const vids = readJ("videos.json", {});
  const chans = readJ("channels.json", {});
  const snaps = fs.readdirSync(path.join(OUT, "snapshots")).filter((f) => f.endsWith(".json")).sort().map((f) => readJ(`snapshots/${f}`));
  // velocidad medida: (vistas en el último snapshot − vistas en el primero) / días entre ellos
  const vel = {};
  if (snaps.length >= 2) {
    const a = snaps[0], b = snaps[snaps.length - 1], dd = (b.at - a.at) / 864e5;
    if (dd >= 0.5) for (const [id, v] of Object.entries(b.views)) if (a.views[id] != null) vel[id] = (v - a.views[id]) / dd;
  }
  // nicho de cada canal = el nicho con más apariciones de sus videos en las búsquedas
  const chanNicho = {};
  for (const v of Object.values(vids)) {
    if (!v.channelId) continue;
    const m = (chanNicho[v.channelId] ||= {});
    for (const n of v.nichos) m[n] = (m[n] || 0) + 1;
  }
  const rows = [];
  for (const c of Object.values(chans)) {
    const vs = (c.videos || []).filter((v) => v.ageDays != null);
    if (!vs.length) continue;
    const med = median(vs.map((v) => v.views));
    const recent = vs.filter((v) => v.ageDays <= 30);
    const last14 = vs.filter((v) => v.ageDays <= 14);
    const best = [...recent].sort((a, b) => b.views - a.views)[0] || null;
    const nm = chanNicho[c.id] || {};
    const nicho = Object.entries(nm).sort((a, b) => b[1] - a[1])[0]?.[0] || "?";
    rows.push({
      id: c.id, name: c.name, handle: c.handle, nicho, subs: c.subs, totalViews: c.totalViews, nVideos: c.nVideos,
      joined: c.joined, ageDays: c.ageDays, country: c.country,
      views14: last14.reduce((s, v) => s + v.views, 0),
      views30: recent.reduce((s, v) => s + v.views, 0),
      hits30: recent.filter((v) => v.views >= HIT).length,
      median: med,
      best: best && { ...best, perDay: Math.round(best.views / Math.max(best.ageDays, 1)), measuredPerDay: vel[best.id] != null ? Math.round(vel[best.id]) : null, xMedian: +(best.views / Math.max(med, 1)).toFixed(1) },
      newChannel: (c.ageDays ?? 9999) <= 365,
    });
  }
  // por subnicho
  const byN = {};
  for (const r of rows) (byN[r.nicho] ||= []).push(r);
  const nichos = Object.entries(byN).map(([n, rs]) => {
    const active = rs.filter((r) => r.views30 > 0);
    const nuevos = active.filter((r) => r.newChannel);
    const nuevosHit = nuevos.filter((r) => r.hits30 > 0);
    const veryNew = active.filter((r) => (r.ageDays ?? 9999) <= 120);
    const searchVids = Object.values(vids).filter((v) => v.nichos.includes(n));
    const supply = new Set(searchVids.filter((v) => v.channelId).map((v) => v.channelId)).size; // canales publicando este mes
    const top = [...nuevos].sort((a, b) => (b.best?.views || 0) - (a.best?.views || 0));
    const demand = nuevosHit.reduce((s, r) => s + r.views30, 0);
    return {
      nicho: n, cpm: CFG.cpm?.[n] ?? null,
      canalesActivos: active.length, canalesPublicandoEsteMes: supply,
      nuevos: nuevos.length, nuevosConHit: nuevosHit.length, nuevosMenos120d: veryNew.length,
      tasaExito: nuevos.length ? +(nuevosHit.length / nuevos.length).toFixed(2) : 0,
      vistas30NuevosConHit: demand,
      mejor: top[0] ? { name: top[0].name, handle: top[0].handle, joined: top[0].joined, subs: top[0].subs, nVideos: top[0].nVideos, video: top[0].best } : null,
      top: top.slice(0, 6).map((r) => ({ name: r.name, handle: r.handle, joined: r.joined, ageDays: r.ageDays, subs: r.subs, nVideos: r.nVideos, views30: r.views30, hits30: r.hits30, median: r.median, best: r.best })),
      // HUECO: demanda que capturan los nuevos ÷ (oferta+10), × tasa de éxito
      hueco: Math.round((demand / (supply + 10)) * (0.5 + (nuevos.length ? nuevosHit.length / nuevos.length : 0))),
    };
  }).sort((a, b) => b.hueco - a.hueco);
  writeJ("radar_channels_scored.json", rows);
  writeJ("radar_report.json", { generatedAt: new Date(NOW).toISOString(), hitThreshold: HIT, snapshots: snaps.length, nichos });
  for (const n of nichos.slice(0, 40)) {
    const m = n.mejor;
    console.log(`${String(n.hueco).padStart(9)} | ${n.nicho.padEnd(28)} | nuevos ${n.nuevosConHit}/${n.nuevos} hit | oferta ${n.canalesPublicandoEsteMes} | ${m ? `${m.handle} (${m.joined}, ${m.subs} subs) ${m.video?.views} vistas en ${m.video?.ageDays}d — ${m.video?.title?.slice(0, 60)}` : ""}`);
  }
}

// ── saturation: para cada cluster (formato concreto) mide oferta y tasa de éxito de canales NUEVOS ──
// Busca cada query 2 veces (orden por vistas + relevancia, ventana mes) para ver ganadores Y perdedores,
// baja la ficha de TODOS los canales que publican y calcula: cuántos publican, cuántos son nuevos (<180d),
// qué % de los nuevos tiene un video ≥100k en 30 días, y los ejemplos concretos.
async function cmdSaturation(only) {
  const clusters = Object.entries(CFG.clusters || {}).filter(([k]) => !only.length || only.includes(k));
  const sat = readJ("saturation_videos.json", {});
  const jobs = [];
  for (const [k, c] of clusters) for (const q of c.q) for (const sp of ["CAMSBAgEEAE%3D", "EgQIBBAB"]) jobs.push({ k, q, sp });
  console.error(`saturation: ${clusters.length} clusters, ${jobs.length} búsquedas`);
  await pool(jobs, async ({ k, q, sp }) => {
    const h = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=${sp}`);
    if (!h) return;
    const ver = h.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] || "2.20261006.01.00";
    let { out, cont } = videosFromSearch(jsonAfter(h, "var ytInitialData = "));
    for (let p = 1; p < 3 && cont; p++) {
      const d = await post("search", { continuation: cont }, ver);
      if (!d) break;
      const r = videosFromSearch(d);
      out = out.concat(r.out);
      cont = r.cont;
    }
    const m = (sat[k] ||= {});
    for (const v of out) if (v.channelId && isEnglishish(v.title)) m[v.id] = v;
  });
  writeJ("saturation_videos.json", sat);
  const chans = readJ("channels.json", {});
  const need = [...new Set(Object.values(sat).flatMap((m) => Object.values(m).map((v) => v.channelId)))].filter((id) => !chans[id]);
  console.error(`saturation: ${need.length} canales nuevos a bajar`);
  let n = 0;
  await pool(need, async (id) => {
    const c = await channelInfo(id);
    if (c) chans[id] = JSON.parse(JSON.stringify(c));
    if (++n % 50 === 0) writeJ("channels.json", chans);
  });
  writeJ("channels.json", chans);

  const rep = [];
  for (const [k, c] of Object.entries(CFG.clusters)) {
    const vids = Object.values(sat[k] || {}).filter((v) => v.ageDays != null && v.ageDays <= 31);
    if (!vids.length) continue;
    const byCh = {};
    for (const v of vids) (byCh[v.channelId] ||= []).push(v);
    const rows = Object.entries(byCh).map(([id, vs]) => {
      const ch = chans[id] || {};
      const own = (ch.videos || []).filter((v) => v.ageDays != null && v.ageDays <= 30);
      const all = [...vs, ...own];
      const best = all.sort((a, b) => b.views - a.views)[0];
      const best14 = all.filter((v) => v.ageDays <= 14).sort((a, b) => b.views - a.views)[0] || null;
      return { id, name: ch.name || vs[0].channel, handle: ch.handle || vs[0].handle, joined: ch.joined, ageDays: ch.ageDays ?? null, subs: ch.subs ?? null, nVideos: ch.nVideos ?? null, best, best14 };
    });
    const nuevos = rows.filter((r) => r.ageDays != null && r.ageDays <= 180);
    const hit = (r) => (r.best?.views || 0) >= 100000;
    const ganadores = nuevos.filter(hit).sort((a, b) => (b.best14?.views || 0) - (a.best14?.views || 0) || b.best.views - a.best.views);
    const views = vids.map((v) => v.views).sort((a, b) => a - b);
    rep.push({
      cluster: k, desc: c.desc,
      canalesPublicando: rows.length, nuevos: nuevos.length, nuevosConHit: ganadores.length,
      tasaExitoNuevos: nuevos.length ? +(ganadores.length / nuevos.length).toFixed(2) : 0,
      videosMes: vids.length, medianaVistas: views[Math.floor(views.length / 2)],
      pctVideos100k: +(vids.filter((v) => v.views >= 100000).length / vids.length).toFixed(2),
      viejosConHit: rows.filter((r) => (r.ageDays ?? 0) > 180 && hit(r)).length,
      ganadores: ganadores.slice(0, 8).map((r) => ({ name: r.name, handle: r.handle, joined: r.joined, ageDays: r.ageDays, subs: r.subs, nVideos: r.nVideos, best: r.best && { id: r.best.id, title: r.best.title, views: r.best.views, ageDays: r.best.ageDays, len: r.best.len }, best14: r.best14 && { id: r.best14.id, title: r.best14.title, views: r.best14.views, ageDays: r.best14.ageDays } })),
    });
  }
  writeJ("saturation_report.json", rep);
  for (const r of rep.sort((a, b) => b.tasaExitoNuevos - a.tasaExitoNuevos)) {
    const g = r.ganadores[0];
    console.log(`${r.cluster.padEnd(32)} canales ${String(r.canalesPublicando).padStart(3)} | nuevos ${String(r.nuevosConHit).padStart(2)}/${String(r.nuevos).padStart(3)} hit (${Math.round(r.tasaExitoNuevos * 100)}%) | mediana ${r.medianaVistas} | ${g ? `${g.handle} ${g.ageDays}d ${g.best14 ? `${g.best14.views} en ${g.best14.ageDays}d` : `${g.best.views} en ${g.best.ageDays}d`}` : "-"}`);
  }
}

// ── verify: vistas EXACTAS + fecha de publicación EXACTA de los videos de referencia (heroes.json).
// Cada corrida agrega una medición; con 2+ mediciones da vistas/día medidas, no estimadas.
async function cmdVerify() {
  const heroes = readJ("heroes.json", []);
  const hist = readJ("verify_history.json", {});
  await pool(heroes, async (h) => {
    // la watch page cae en captcha tras muchas requests; /next (innertube) sigue respondiendo
    const d = await post("next", { videoId: h.id }, "2.20261006.01.00");
    if (!d) return;
    const js = JSON.stringify(d);
    const views = parseCount(js.match(/"videoViewCountRenderer":\{"viewCount":\{"simpleText":"([^"]+)"/)?.[1]);
    const dt = js.match(/"dateText":\{"simpleText":"([^"]+)"/)?.[1] || "";
    const published = Date.parse(dt.replace(/^(Premiered|Streamed live on) /, "")) ? new Date(Date.parse(dt.replace(/^(Premiered|Streamed live on) /, "")) + 12 * 36e5).toISOString() : null;
    const title = js.match(/"videoPrimaryInfoRenderer":\{"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1] || "";
    const lengthSeconds = 0;
    const e = (hist[h.id] ||= { id: h.id, handle: h.handle, title, published, lengthSeconds, m: [] });
    e.title = title || e.title; e.published = published || e.published; e.lengthSeconds = lengthSeconds || e.lengthSeconds;
    e.m.push({ at: NOW, views });
  });
  writeJ("verify_history.json", hist);
  for (const e of Object.values(hist).sort((a, b) => (b.m.at(-1)?.views || 0) - (a.m.at(-1)?.views || 0))) {
    const last = e.m.at(-1), first = e.m[0];
    const age = e.published ? (last.at - Date.parse(e.published)) / 864e5 : null;
    const dd = (last.at - first.at) / 864e5;
    const vel = e.m.length > 1 && dd > 0.04 ? Math.round((last.views - first.views) / dd) : null;
    console.log(`${String(last.views).padStart(9)} | ${e.published?.slice(0, 10)} (${age?.toFixed(1)}d) | ${vel != null ? `${vel}/día medido` : "-"} | ${e.handle} | ${e.title.slice(0, 70)}`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const cmds = { verify: cmdVerify, saturation: () => cmdSaturation(rest), search: () => cmdSearch(rest), channels: cmdChannels, snowball: cmdSnowball, snapshot: cmdSnapshot, score: cmdScore };
if (!cmds[cmd]) { console.error("uso: node analizador/radar.mjs search|channels|snowball|snapshot|score"); process.exit(1); }
await cmds[cmd]();
