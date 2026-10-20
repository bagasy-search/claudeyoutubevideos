// Plan B para bajar de YouTube desde el farm SIN proxies pagos (20-oct-2026). YouTube le pide "no soy un bot"
// a las IPs de GitHub (y las cookies no lo arreglan), así que se baja POR MEDIO de frontends públicos que
// hacen de túnel: instancias de Invidious (local=true), de Piped y de cobalt. Nunca la IP de la casa.
// Uso: import { bajarAlt } from "./ytalt.mjs"; await bajarAlt("https://youtu.be/ID" | "ytsearch1:texto", "/tmp/x/v.mp4", { alto: 720, audio: true })
//   → { ok, via, id, info: { title, channel, duration, view_count }, subs: "/tmp/x/v.vtt"|null }
// Probar a mano en el runner: node scripts/biblioteca/ytalt.mjs <url> <salida.mp4>
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const log = (...a) => console.log("  [alt]", ...a);
const idDe = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1] || (/^[\w-]{11}$/.test(u) ? u : null);

async function jget(url, opts = {}, ms = 15000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { ...opts, signal: ctl.signal, headers: { "user-agent": UA, accept: "application/json", ...(opts.headers || {}) } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally { clearTimeout(t); }
}

// curl con reintentos y tope; descarta respuestas chicas (páginas de error, 0 bytes)
function curl(url, out, minBytes = 200000) {
  const r = spawnSync("curl", ["-sfL", "--retry", "3", "--retry-delay", "2", "--connect-timeout", "20", "--max-time", "1500",
    "-A", UA, "-o", out, url], { encoding: "utf8", timeout: 1600000, killSignal: "SIGKILL" });
  const ok = r.status === 0 && fs.existsSync(out) && fs.statSync(out).size >= minBytes;
  if (!ok) { try { fs.unlinkSync(out); } catch {} }
  return ok;
}

// une video + audio (o sólo video) en un mp4 sano; verifica que ffmpeg lo lea entero
function armar(vid, aud, out) {
  const a = ["-hide_banner", "-y", "-i", vid, ...(aud ? ["-i", aud] : []), "-map", "0:v:0", ...(aud ? ["-map", "1:a:0"] : ["-map", "0:a:0?"]), "-c", "copy", "-movflags", "+faststart", out];
  const r = spawnSync("ffmpeg", a, { encoding: "utf8", timeout: 600000 });
  return r.status === 0 && fs.existsSync(out) && fs.statSync(out).size > 200000;
}

function elegirVideo(lista, alto, campoAlto, esAvc) {
  const c = lista.filter((f) => f.url && campoAlto(f) && campoAlto(f) <= alto).sort((x, y) => campoAlto(y) - campoAlto(x) || (esAvc(y) - esAvc(x)));
  return c.find(esAvc) || c[0];
}

// ───────── Invidious ─────────
async function instanciasInvidious() {
  const fijas = ["https://inv.nadeko.net", "https://yewtu.be", "https://invidious.nerdvpn.de", "https://id.420129.xyz", "https://invidious.f5.si", "https://inv.tux.pizza"];
  try {
    const j = await jget("https://api.invidious.io/instances.json?sort_by=health", {}, 12000);
    const vivas = j.filter(([, d]) => d?.type === "https" && d?.api !== false).map(([, d]) => d.uri.replace(/\/$/, ""));
    return [...new Set([...vivas, ...fijas])].slice(0, 14);
  } catch { return fijas; }
}
async function porInvidious(id, dir, alto, audio) {
  for (const base of await instanciasInvidious()) {
    try {
      const j = await jget(`${base}/api/v1/videos/${id}?local=true`, {}, 20000);
      const abs = (u) => (u.startsWith("http") ? u : base + u);
      const altoDe = (f) => +((f.resolution || f.qualityLabel || "").match(/(\d{3,4})p/) || [])[1] || 0;
      const vids = (j.adaptiveFormats || []).filter((f) => /^video\/mp4/.test(f.type || ""));
      const v = elegirVideo(vids, alto, altoDe, (f) => /avc1/.test(f.type || ""));
      const a = audio ? (j.adaptiveFormats || []).find((f) => /^audio\/mp4/.test(f.type || "")) : null;
      const info = { title: j.title, channel: j.author, duration: j.lengthSeconds, view_count: j.viewCount, upload_date: null, webpage_url: `https://www.youtube.com/watch?v=${id}` };
      let okv = v && curl(abs(v.url), `${dir}/alt_v.mp4`);
      if (!okv) { // a veces sólo sirve el progresivo (360p/720p con audio)
        const p = elegirVideo((j.formatStreams || []).filter((f) => /mp4/.test(f.type || f.container || "")), alto, altoDe, () => 1);
        if (p && curl(abs(p.url), `${dir}/alt_v.mp4`)) { log(`invidious ${base} (progresivo ${altoDe(p)}p)`); return { via: `invidious ${base}`, info, alto: altoDe(p), cap: j.captions, base }; }
        log(`invidious ${base}: sin video`); continue;
      }
      const oka = a && curl(abs(a.url), `${dir}/alt_a.m4a`, 20000);
      log(`invidious ${base} ${altoDe(v)}p${oka ? " + audio" : ""}`);
      return { via: `invidious ${base}`, info, alto: altoDe(v), audio: oka, cap: j.captions, base };
    } catch (e) { log(`invidious ${base}: ${e.message}`); }
  }
  return null;
}

// ───────── Piped ─────────
async function porPiped(id, dir, alto, audio) {
  let apis = ["https://pipedapi.kavin.rocks", "https://pipedapi.adminforge.de", "https://api.piped.private.coffee", "https://pipedapi.leptons.xyz", "https://piped-api.lunar.icu"];
  try { const j = await jget("https://piped-instances.kavin.rocks/", {}, 12000); apis = [...new Set([...j.map((x) => x.api_url), ...apis])].slice(0, 12); } catch {}
  for (const api of apis) {
    try {
      const j = await jget(`${api}/streams/${id}`, {}, 20000);
      if (j.error) throw new Error(j.error.slice(0, 80));
      const altoDe = (f) => +((f.quality || "").match(/(\d{3,4})p/) || [])[1] || 0;
      const v = elegirVideo((j.videoStreams || []).filter((f) => f.format === "MPEG_4"), alto, altoDe, (f) => /avc1/.test(f.codec || ""));
      if (!v || !curl(v.url, `${dir}/alt_v.mp4`)) { log(`piped ${api}: sin video`); continue; }
      const a = audio && !v.videoOnly ? null : audio ? (j.audioStreams || []).find((f) => f.format === "M4A") : null;
      const oka = a && curl(a.url, `${dir}/alt_a.m4a`, 20000);
      const sub = (j.subtitles || []).find((s) => /^(en|es)/.test(s.code));
      log(`piped ${api} ${altoDe(v)}p${oka ? " + audio" : ""}`);
      return { via: `piped ${api}`, info: { title: j.title, channel: j.uploader, duration: j.duration, view_count: j.views, webpage_url: `https://www.youtube.com/watch?v=${id}` },
        alto: altoDe(v), audio: oka, subUrl: sub?.url };
    } catch (e) { log(`piped ${api}: ${e.message}`); }
  }
  return null;
}

// ───────── cobalt (instancias de la comunidad sin clave) ─────────
async function porCobalt(id, dir, alto) {
  let apis = [];
  try {
    const j = await jget("https://instances.cobalt.best/api/instances.json", {}, 12000);
    apis = j.filter((x) => x.online && x.services?.youtube && !x.info?.auth && !x.info?.turnstile)
      .map((x) => `${x.protocol || "https"}://${x.api}`).slice(0, 10);
  } catch (e) { log(`cobalt lista: ${e.message}`); }
  for (const api of apis) {
    try {
      const j = await jget(api.replace(/\/$/, "") + "/", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${id}`, videoQuality: String(alto), youtubeVideoCodec: "h264", downloadMode: "auto" }) }, 30000);
      if (!["tunnel", "redirect"].includes(j.status) || !j.url) { log(`cobalt ${api}: ${j.status} ${j.error?.code || ""}`); continue; }
      if (!curl(j.url, `${dir}/alt_v.mp4`)) { log(`cobalt ${api}: túnel vacío`); continue; }
      log(`cobalt ${api}`);
      return { via: `cobalt ${api}`, info: { webpage_url: `https://www.youtube.com/watch?v=${id}` }, alto, audio: false, conAudioAdentro: true };
    } catch (e) { log(`cobalt ${api}: ${e.message}`); }
  }
  return null;
}

// "ytsearch1:texto" → id (por la búsqueda de Invidious o de Piped)
async function buscarId(q) {
  for (const base of (await instanciasInvidious()).slice(0, 8)) {
    try { const j = await jget(`${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video`, {}, 15000); if (j[0]?.videoId) return j[0].videoId; } catch {}
  }
  for (const api of ["https://pipedapi.kavin.rocks", "https://pipedapi.adminforge.de"]) {
    try { const j = await jget(`${api}/search?q=${encodeURIComponent(q)}&filter=videos`, {}, 15000); const u = j.items?.[0]?.url; if (u) return idDe(u); } catch {}
  }
  return null;
}

export async function bajarAlt(url, out, { alto = 720, audio = true } = {}) {
  const dir = path.dirname(out);
  const id = url.startsWith("ytsearch1:") ? await buscarId(url.slice(10)) : idDe(url);
  if (!id) { log("no saqué el id del video"); return { ok: false }; }
  for (const via of [porInvidious, porPiped, porCobalt]) {
    const r = await via(id, dir, alto, audio);
    if (!r) continue;
    const aud = r.audio ? `${dir}/alt_a.m4a` : null;
    if (!armar(`${dir}/alt_v.mp4`, aud, out)) { log(`${r.via}: el mp4 no se pudo armar`); continue; }
    let subs = null;
    try { // subtítulos (en/es) si la vía los da
      const c = (r.cap || []).find((x) => /^(en|es)/.test(x.language_code || x.languageCode || ""));
      const su = c ? (c.url.startsWith("http") ? c.url : r.base + c.url) : r.subUrl;
      if (su && curl(su, `${dir}/alt.vtt`, 200)) subs = `${dir}/alt.vtt`;
    } catch {}
    for (const f of ["alt_v.mp4", "alt_a.m4a"]) try { fs.unlinkSync(`${dir}/${f}`); } catch {}
    return { ok: true, via: r.via, id, alto: r.alto, info: { id, ...r.info }, subs };
  }
  return { ok: false, id };
}

if (process.argv[1]?.endsWith("ytalt.mjs") && process.argv[2]) {
  const r = await bajarAlt(process.argv[2], process.argv[3] || "/tmp/alt/v.mp4");
  console.log(JSON.stringify(r));
  process.exit(r.ok ? 0 : 1);
}
