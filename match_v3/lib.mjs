// match_v3/lib.mjs — plomería compartida del matcheo "editado a mano".
// Reusa las técnicas ya validadas de match_sb.mjs: YouTube Data API (multi-key + retry),
// storyboards de i.ytimg (CDN, no bloqueado), geometría de tiles. NO decide con CLIP.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

// ── .env (raíz del repo video2) ──
export function loadEnv(root = ".") {
  try {
    for (const line of fs.readFileSync(path.join(root, ".env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();

export const YT_API_KEYS = [
  process.env.YT_API_KEY, process.env.YT_API_KEY2, process.env.YT_API_KEY3,
  process.env.YT_API_KEY4, process.env.YT_API_KEY5, process.env.YT_API_KEY6,
].map((k) => (k || "").trim()).filter(Boolean);
export const YTDLP = process.env.YTDLP || "yt-dlp";
export const FF = process.env.FFMPEG || "ffmpeg";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (b, s) => b + Math.floor(Math.random() * s);
export const vidId = (u) => (String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || String(u).match(/([A-Za-z0-9_-]{11})/) || [])[1];

// ── BLOCKLIST persistente (match_v3/blocklist.json) ─────────────────────────
// Videos/canales que un juez o verificador ya reprobó una vez NO vuelven a
// aparecer como candidatos en NINGÚN video futuro. La escriben 5_apply_verdicts
// y (a mano) cualquier auditoría. { videos: ["id",...], channels: ["nombre",...] }
const BL_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "blocklist.json");
export function loadBlocklist() {
  try {
    const b = JSON.parse(fs.readFileSync(BL_PATH, "utf8").replace(/^﻿/, ""));
    return { videos: new Set(b.videos || []), channels: new Set((b.channels || []).map((c) => c.toLowerCase())) };
  } catch { return { videos: new Set(), channels: new Set() }; }
}
export function appendBlocklist({ videos = [], channels = [] }) {
  let cur = { videos: [], channels: [] };
  try { cur = JSON.parse(fs.readFileSync(BL_PATH, "utf8").replace(/^﻿/, "")); } catch {}
  cur.videos = [...new Set([...(cur.videos || []), ...videos])];
  cur.channels = [...new Set([...(cur.channels || []), ...channels])];
  fs.writeFileSync(BL_PATH, JSON.stringify(cur, null, 2));
  return cur;
}

// ── YouTube Data API con retry + multi-key + failover ──
let keyPtr = 0;
const deadKeys = new Set();
const nextKey = () => {
  for (let i = 0; i < YT_API_KEYS.length; i++) {
    const k = YT_API_KEYS[keyPtr % YT_API_KEYS.length]; keyPtr++;
    if (!deadKeys.has(k)) return k;
  }
  return null;
};
async function apiGet(buildUrl, ctx) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const key = nextKey();
    if (!key) { console.error(`  [API] ${ctx}: sin keys vivas`); return null; }
    try {
      await sleep(jitter(120, 220));
      const res = await fetch(buildUrl(key), { signal: AbortSignal.timeout(30000) });
      const j = await res.json().catch(() => ({}));
      if (!j.error) return j;
      const reason = j.error.errors?.[0]?.reason || j.error.code;
      if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") { deadKeys.add(key); console.error(`  [API] ${ctx}: quota agotada …${key.slice(-4)} → rota`); continue; }
      if (res.status === 429 || reason === "rateLimitExceeded" || reason === "userRateLimitExceeded") { await sleep(jitter(1000 * 2 ** attempt, 500)); continue; }
      console.error(`  [API] ${ctx}: ${res.status} ${reason}`); return null;
    } catch (e) { await sleep(jitter(1000 * 2 ** attempt, 500)); }
  }
  return null;
}

const searchCache = new Map();
const qNorm = (q) => (q || "").trim().toLowerCase().replace(/\s+/g, " ");

// Fallback SIN API: yt-dlp ytsearch por la IP de casa (no toca cuota ni el rate-limit
// per-IP de la Data API). Más lento y algo menos preciso, pero no se traba cuando la
// API está saturada (429 en masa). flat-playlist = rápido (no extrae cada video).
let ytSearchOff = false;
export function ytSearch(q, n = 20) {
  const r = spawnSync(YTDLP, [`ytsearch${n}:${q}`, "--flat-playlist", "--no-warnings",
    "--print", "%(id)s\t%(channel)s\t%(duration)s\t%(title)s", "--socket-timeout", "30"], { encoding: "utf8", maxBuffer: 1 << 24 });
  if (r.status !== 0 || !r.stdout) return [];
  return r.stdout.trim().split("\n").map((line) => {
    const [id, channel, dur, ...t] = line.split("\t");
    return { id: (id || "").trim(), channel: (channel || "").trim(), duration: +dur || 0, title: (t.join("\t") || "").trim() };
  }).filter((x) => x.id && x.id.length === 11);
}

export async function apiSearch(q, maxResults = 20) {
  const key = qNorm(q);
  if (searchCache.has(key)) return searchCache.get(key);
  let rows = null;
  if (!ytSearchOff && !process.env.FORCE_YTSEARCH) {
    // videoEmbeddable descarta streams/miembros; NO se pide videoDefinition=high
    // (mataría footage casero real bueno de 480p que igual filtra fetch_clips).
    const j = await apiGet((k) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${maxResults}`
      + `&relevanceLanguage=es&q=${encodeURIComponent(q)}&key=${k}`, `search "${q}"`);
    if (j) rows = (j.items || []).map((it) => ({
      id: it.id?.videoId,
      title: it.snippet?.title || "",
      channel: it.snippet?.channelTitle || "",
      live: it.snippet?.liveBroadcastContent && it.snippet.liveBroadcastContent !== "none",
    })).filter((r) => r.id);
  }
  // API vacía/muerta (429 en masa o quota) → caer a ytsearch (IP de casa, sin límite)
  if (rows == null) {
    if (!ytSearchOff && !process.env.FORCE_YTSEARCH) { console.error(`  [API→ytsearch] "${q}"`); ytSearchOff = true; }
    rows = ytSearch(q, maxResults);
  }
  searchCache.set(key, rows);
  return rows;
}
export const searchStats = () => ({ uniqueQueries: searchCache.size });

const iso8601ToSec = (s) => {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(s || "");
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
};
export async function apiDurations(ids) {
  const out = new Map();
  if (!YT_API_KEYS.length || !ids.length) return out;
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const j = await apiGet((key) => `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${key}`, `videos.list (${batch.length})`);
    if (!j) continue;
    for (const it of (j.items || [])) out.set(it.id, iso8601ToSec(it.contentDetails?.duration));
  }
  return out;
}

// ── FILTRO DURO pre-juez ─────────────────────────────────────────────────────
// La basura del video "ventilador" (youtubers cara-a-cámara, shorts, compilaciones)
// entró porque ganaba el orden crudo de la Search API. Acá se filtra EN CÓDIGO,
// antes de gastar mosaicos y ojos del juez.
const BAD = /(reaction|react|podcast|full episode|interview|tier list|gameplay|trailer|unboxing|vlog|prank|lyric|music video|official music|\bsong\b|cover|remix|karaoke|instrumental|playlist|relaj|sue[ñn]o|dormir|8 horas|asmr sleep|meditaci|#shorts|\bshorts?\b|reacci[óo]n|reaccion(a|o|amos)|prob[ée] |probando |top \d|los \d+ (mejores|peores)|recopilaci[óo]n|compilaci[óo]n|compilation|en vivo|\blive\b|directo\b|stream|storytime|story time|mi opini[óo]n|debate|charla|entrevista|noticias?\b|resumen semanal|q ?& ?a|preguntas y respuestas|challenge|reto\b|24 horas|48 horas|vlogmas|rutina de|un d[íi]a (conmigo|en mi vida)|day in (the|my) life)/i;
const BADCHAN = /(podcast|vlogs?\b|noticias|news\b|tv\b|radio\b|oficial? music|topic\b|gaming|juegos|reacciona)/i;
// duración: <60s = Shorts/clips basura · >40min = streams/documentales enteros
// (para docs largos está docextract, que escanea el video entero a propósito).
export const DUR_MIN = +(process.env.V3_DUR_MIN || 60);
export const DUR_MAX = +(process.env.V3_DUR_MAX || 2400);

const STOP = new Set(("a an the de la el los las un una y o para con por en al del que se su lo".split(" ")));
const kw = (s) => [...new Set((s || "").toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)))];

// rows: [{id,title,channel,duration?,live?}] · durMap: Map(id→sec) (de apiDurations)
// Devuelve hasta `limit` candidatos LIMPIOS, rankeados por léxico título↔queries.
export function filterAndRank(rows, queries, limit, durMap = new Map(), blocklist = loadBlocklist()) {
  const want = new Set(queries.flatMap(kw));
  const seen = new Map();
  const dropped = { bad: 0, chan: 0, dur: 0, block: 0, live: 0 };
  rows.forEach((r, ri) => {
    const { id, title = "", channel = "" } = r;
    if (!id) return;
    if (seen.has(id)) { seen.get(id).rank = Math.min(seen.get(id).rank, ri); return; }
    if (blocklist.videos.has(id)) { dropped.block++; return; }
    if (channel && blocklist.channels.has(channel.toLowerCase())) { dropped.block++; return; }
    if (r.live) { dropped.live++; return; }
    if (BAD.test(title)) { dropped.bad++; return; }
    if (channel && BADCHAN.test(channel)) { dropped.chan++; return; }
    const dur = r.duration || durMap.get(id) || 0;
    if (dur && (dur < DUR_MIN || dur > DUR_MAX)) { dropped.dur++; return; }
    const t = title.toLowerCase();
    const lex = [...want].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    seen.set(id, { id, title, channel, duration: dur, rank: ri, lex });
  });
  const out = [...seen.values()].sort((a, b) => (b.lex - a.lex) || (a.rank - b.rank)).slice(0, limit);
  out._dropped = dropped;
  return out;
}
// compat: firma vieja (sin filtro de duración/canal). Preferí filterAndRank.
export function rerank(rows, queries, limit) { return filterAndRank(rows, queries, limit, new Map(), { videos: new Set(), channels: new Set() }); }

// ── ANCLA DE SUJETO en código (regla #1 de match_v3, antes solo prompt) ──────
// Toda query DEBE contener al menos un término del ancla (el nombre del sujeto).
// Si no lo tiene, se le antepone el ancla — el fix automático vale más que el warning.
const deaccent = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export function enforceAnchor(queries, anchorTerms) {
  const terms = (anchorTerms || []).map(deaccent).filter(Boolean);
  if (!terms.length) return { queries, fixed: 0 };
  let fixed = 0;
  const out = (queries || []).map((q) => {
    const qn = deaccent(q);
    if (terms.some((t) => qn.includes(t))) return q;
    fixed++;
    return `${anchorTerms[0]} ${q}`;
  });
  return { queries: out, fixed };
}

// ── STORYBOARD ──
// MEMOIZADO por id: el mismo video suele ser candidato de VARIOS beats, y cada ytInfo
// es un spawn de yt-dlp de segundos. Medido: 660 llamadas para 345 ids únicos → 48% eran
// re-probes del MISMO video. Mismo patrón que searchCache, arriba.
const infoCache = new Map();
export function ytInfo(id) {
  if (infoCache.has(id)) return infoCache.get(id);
  const r = spawnSync(YTDLP, [`https://youtu.be/${id}`, "-J", "--skip-download", "--no-warnings", "--socket-timeout", "30"],
    { encoding: "utf8", maxBuffer: 1 << 28, timeout: 60000, killSignal: "SIGKILL" });
  let out = null;
  if (r.status === 0 && r.stdout) { try { out = JSON.parse(r.stdout); } catch { out = null; } }
  // cacheamos también el null: un id que no resolvió no mejora reintentándolo en la misma corrida
  infoCache.set(id, out);
  return out;
}
export function pickStoryboard(info) {
  const sbs = (info.formats || []).filter((f) => String(f.format_id || "").startsWith("sb") && (f.fragments || []).length && f.columns && f.rows);
  if (!sbs.length) return null;
  sbs.sort((a, b) => (a.format_id === "sb0" ? -1 : b.format_id === "sb0" ? 1 : (b.columns * b.rows * b.fragments.length) - (a.columns * a.rows * a.fragments.length)));
  return sbs[0];
}

// ── GEOMETRÍA REAL por fragmento (fix del bug de interval) ──────────────────
// El cálculo viejo `interval = duration / (cols*rows*nFrags)` asume que TODOS los
// mosaicos vienen llenos; el último casi siempre está a medias → interval chico →
// el ts calculado caía ANTES del momento que el juez eligió (decenas de segundos
// de error en fragmentos altos). yt-dlp trae `duration` POR fragmento: usarla.
// Devuelve por fragmento { start, interval } (start = suma de durs previas).
export function sbGeometry(sb, videoDuration) {
  const per = sb.columns * sb.rows;
  const frags = [];
  let start = 0;
  const fallback = videoDuration && sb.fragments.length ? videoDuration / sb.fragments.length : 0;
  for (const f of sb.fragments) {
    const fdur = +f.duration || fallback || per; // último recurso: 1s/tile
    frags.push({ start: +start.toFixed(2), interval: +(fdur / per).toFixed(4), dur: +fdur.toFixed(2) });
    start += fdur;
  }
  return { cols: sb.columns, rows: sb.rows, frags };
}
// ts exacto de un tile: fragmento fi, fila r, col c (0-based)
export const tileTsFrag = (geo, fi, r, c) => {
  const f = geo.frags[Math.min(fi, geo.frags.length - 1)];
  return +(f.start + (r * geo.cols + c + 0.5) * f.interval).toFixed(1);
};
// compat: índice global con interval uniforme (SOLO para archivos viejos)
export const tileTs = (globalIdx, interval) => +((globalIdx + 0.5) * interval).toFixed(1);

export function curl(url, dest) {
  const r = spawnSync("curl", ["-s", "-L", "--max-time", "30", url, "-o", dest], { encoding: "utf8", timeout: 40000 });
  return r.status === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 500;
}

// ── ffprobe local (gate técnico de clips bajados) ────────────────────────────
export function ffprobePath() {
  const remotion = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffprobe.exe");
  if (fs.existsSync(remotion)) return remotion;
  return process.env.FFPROBE || "ffprobe";
}
export function probeMedia(file) {
  const r = spawnSync(ffprobePath(), ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,duration:format=duration", "-of", "json", file],
    { encoding: "utf8", timeout: 20000 });
  if (r.status !== 0 || !r.stdout) return null;
  try {
    const j = JSON.parse(r.stdout);
    const s = (j.streams || [])[0] || {};
    return { width: +s.width || 0, height: +s.height || 0, duration: +(s.duration || j.format?.duration) || 0 };
  } catch { return null; }
}
