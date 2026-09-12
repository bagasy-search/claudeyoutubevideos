// scripts/stock_lib.mjs — adquisición de STOCK multi-fuente, quality-first.
// CASCADA por beat: Pexels video → Pixabay video → Archive.org → foto (Pexels/Pixabay)
// convertida a mp4 con Ken-Burns. Con:
//   · DEDUP GLOBAL persistente (public/broll/_stock_used.json): dos beats nunca
//     terminan con el mismo clip de stock, ni dentro del video ni entre videos
//     recientes del mismo slug — el "primer resultado para todos" era la causa
//     de stock repetido.
//   · SELECCIÓN POR CALIDAD, no videos[0]: entre los resultados se puntúa
//     resolución (≥1280 de ancho), duración vs lo que pide el beat, y novedad.
//   · Queries en INGLÉS (Pexels/Pixabay indexan mejor EN): si el beat trae `desc`
//     EN de la autoría se usa esa; si no, la query/concept tal cual.
// Keys en .env: PEXELS_API_KEY (existe) · PIXABAY_KEY (opcional) — sin key, esa
// fuente se saltea sola. Archive.org no necesita key.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// .env
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
export const PEXELS_KEY = process.env.PEXELS_API_KEY;
export const PIXABAY_KEY = process.env.PIXABAY_KEY || process.env.PIXABAY_API_KEY;

const FFDIR = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc");
const FF = fs.existsSync(path.join(FFDIR, "ffmpeg.exe")) ? path.join(FFDIR, "ffmpeg.exe") : (process.env.FFMPEG || "ffmpeg");

// ── registro global de stock usado (dedup entre beats y entre corridas) ──────
const USED_PATH = path.join("public", "broll", "_stock_used.json");
let _used = null;
export function usedRegistry() {
  if (_used) return _used;
  try { _used = new Set(JSON.parse(fs.readFileSync(USED_PATH, "utf8"))); } catch { _used = new Set(); }
  return _used;
}
export function markUsed(key) {
  const u = usedRegistry();
  u.add(key);
  try { fs.mkdirSync(path.dirname(USED_PATH), { recursive: true }); fs.writeFileSync(USED_PATH, JSON.stringify([...u], null, 1)); } catch {}
}

const dl = async (url, dest, headers = {}) => {
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(120000) });
  if (!r.ok) throw new Error("dl " + r.status);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  return fs.statSync(dest).size > 20000;
};

// puntúa un candidato de stock: resolución + ajuste de duración + novedad
const scoreCand = (w, h, vidDur, wantDur, novel) => {
  let s = 0;
  if (w >= 1920) s += 3; else if (w >= 1280) s += 2; else if (w >= 960) s += 1; else s -= 2;
  if (h > w) s -= 5;                                   // vertical no
  if (vidDur >= wantDur) s += 2; else if (vidDur >= wantDur * 0.7) s += 0; else s -= 2;
  if (vidDur > 60) s -= 1;                             // clips eternos suelen ser loops raros
  if (!novel) s -= 10;                                 // ya usado en otro beat/video
  return s;
};

// ── PEXELS ───────────────────────────────────────────────────────────────────
export async function pexelsVideo(query, wantDur, used = usedRegistry()) {
  if (!PEXELS_KEY) return null;
  const u = new URL("https://api.pexels.com/videos/search");
  u.searchParams.set("query", query); u.searchParams.set("orientation", "landscape");
  u.searchParams.set("per_page", "12"); u.searchParams.set("size", "medium");
  const r = await fetch(u, { headers: { Authorization: PEXELS_KEY }, signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const vids = ((await r.json()).videos || []);
  const cands = vids.map((v) => {
    const files = (v.video_files || []).filter((f) => /mp4/i.test(f.file_type || "mp4") && (f.width || 0) >= (f.height || 0));
    files.sort((a, b) => Math.abs((a.width || 0) - 1920) - Math.abs((b.width || 0) - 1920));
    const f = files[0];
    if (!f) return null;
    const key = `pexels:${v.id}`;
    return { key, link: f.link, w: f.width || 0, h: f.height || 0, dur: v.duration || 0, score: scoreCand(f.width || 0, f.height || 0, v.duration || 0, wantDur, !used.has(key)) };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
  return cands[0]?.score > -2 ? { ...cands[0], src: "pexels" } : null;
}
export async function pexelsPhoto(query, used = usedRegistry()) {
  if (!PEXELS_KEY) return null;
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", query); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "8");
  const r = await fetch(u, { headers: { Authorization: PEXELS_KEY }, signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const ph = ((await r.json()).photos || []).find((p) => !used.has(`pexelsphoto:${p.id}`));
  return ph ? { key: `pexelsphoto:${ph.id}`, link: ph.src?.large2x || ph.src?.original || ph.src?.large, src: "pexels-photo" } : null;
}

// ── PIXABAY ──────────────────────────────────────────────────────────────────
export async function pixabayVideo(query, wantDur, used = usedRegistry()) {
  if (!PIXABAY_KEY) return null;
  const u = new URL("https://pixabay.com/api/videos/");
  u.searchParams.set("key", PIXABAY_KEY); u.searchParams.set("q", query);
  u.searchParams.set("per_page", "12"); u.searchParams.set("safesearch", "true");
  const r = await fetch(u, { signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const hits = ((await r.json()).hits || []);
  const cands = hits.map((v) => {
    const f = v.videos?.large?.url ? v.videos.large : v.videos?.medium;
    if (!f?.url) return null;
    const key = `pixabay:${v.id}`;
    return { key, link: f.url, w: f.width || 0, h: f.height || 0, dur: v.duration || 0, score: scoreCand(f.width || 0, f.height || 0, v.duration || 0, wantDur, !used.has(key)) };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
  return cands[0]?.score > -2 ? { ...cands[0], src: "pixabay" } : null;
}
export async function pixabayPhoto(query, used = usedRegistry()) {
  if (!PIXABAY_KEY) return null;
  const u = new URL("https://pixabay.com/api/");
  u.searchParams.set("key", PIXABAY_KEY); u.searchParams.set("q", query);
  u.searchParams.set("per_page", "8"); u.searchParams.set("orientation", "horizontal"); u.searchParams.set("min_width", "1600");
  const r = await fetch(u, { signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const hit = ((await r.json()).hits || []).find((p) => !used.has(`pixabayphoto:${p.id}`));
  return hit ? { key: `pixabayphoto:${hit.id}`, link: hit.largeImageURL, src: "pixabay-photo" } : null;
}

// ── ARCHIVE.ORG (dominio público / CC — bueno para "los de antes", archivo, época) ──
export async function archiveVideo(query, wantDur, used = usedRegistry()) {
  if (process.env.NO_ARCHIVE === "1") return null;
  const u = new URL("https://archive.org/advancedsearch.php");
  u.searchParams.set("q", `(${query}) AND mediatype:(movies) AND format:(MPEG4|h.264)`);
  u.searchParams.set("fl[]", "identifier"); u.searchParams.set("rows", "6"); u.searchParams.set("output", "json");
  const r = await fetch(u, { signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const docs = ((await r.json()).response?.docs || []);
  for (const d of docs) {
    const key = `archive:${d.identifier}`;
    if (usedRegistry().has(key) || used.has(key)) continue;
    const mr = await fetch(`https://archive.org/metadata/${d.identifier}`, { signal: AbortSignal.timeout(30000) }).catch(() => null);
    if (!mr?.ok) continue;
    const meta = await mr.json();
    const files = (meta.files || []).filter((f) => /\.mp4$/i.test(f.name || "") && +(f.size || 0) < 300e6);
    files.sort((a, b) => +(a.size || 0) - +(b.size || 0));
    const f = files.find((x) => +(x.size || 0) > 2e6) || files[0];
    if (!f) continue;
    return { key, link: `https://archive.org/download/${d.identifier}/${encodeURIComponent(f.name)}`, src: "archive", w: 0, h: 0, dur: 0 };
  }
  return null;
}

// ── foto → mp4 con Ken-Burns (para que el beat siga siendo un "clip") ─────────
export function photoToMp4(jpg, dest, dur) {
  const fr = 30, frames = Math.ceil((dur + 1) * fr);
  const r = spawnSync(FF, ["-y", "-loop", "1", "-i", jpg, "-vf",
    `scale=2400:-1,zoompan=z='min(zoom+0.0008,1.15)':d=${frames}:s=1920x1080:fps=${fr}`,
    "-t", String(dur + 1), "-c:v", "libx264", "-pix_fmt", "yuv420p", dest], { encoding: "utf8" });
  return r.status === 0 && fs.existsSync(dest);
}

// keywords EN cortas desde un desc/concept (para proveedores que indexan en inglés)
const STOPW = new Set("a an the of to in on at by for with and or from into is are was were be this that it its as close up shot footage video clip hd 4k uhd full dark deep una unas unos el la los las de del para con".split(/\s+/));
export const stockQuery = (s) => [...new Set(String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOPW.has(w)))].slice(0, 4).join(" ");

// ── CASCADA completa para UN beat ─────────────────────────────────────────────
// beat: {name, concept (desc EN preferida), query?/queries?, dur}
// outDir: public/broll → escribe <name>.mp4. Devuelve {src} o null.
export async function acquireStock(beat, outDir) {
  const dest = path.join(outDir, `${beat.name}.mp4`);
  const wantDur = +(beat.dur || 6);
  const used = usedRegistry();
  const qs = [...new Set([
    stockQuery(beat.concept),
    beat.concept,
    ...(Array.isArray(beat.query) ? beat.query : beat.query ? [beat.query] : []),
    ...(Array.isArray(beat.queries) ? beat.queries : []),
  ].filter(Boolean))];

  const tryVideo = async (fn, label) => {
    for (const q of qs) {
      const cand = await fn(q, wantDur, used).catch(() => null);
      if (!cand) continue;
      try {
        if (await dl(cand.link, dest)) {
          markUsed(cand.key);
          console.log(`  ↓ ${label}  ${beat.name}.mp4  ("${q}") ${cand.w ? `${cand.w}x${cand.h} ${cand.dur}s` : ""}`);
          return { src: label };
        }
      } catch {}
    }
    return null;
  };
  let got = await tryVideo(pexelsVideo, "pexels");
  if (!got) got = await tryVideo(pixabayVideo, "pixabay");
  if (!got) got = await tryVideo(archiveVideo, "archive");
  if (!got) {
    for (const q of qs) {
      const ph = (await pexelsPhoto(q, used).catch(() => null)) || (await pixabayPhoto(q, used).catch(() => null));
      if (!ph) continue;
      const tmp = path.join(outDir, `_sf_${beat.name}.jpg`);
      try {
        await dl(ph.link, tmp);
        if (photoToMp4(tmp, dest, wantDur)) { markUsed(ph.key); console.log(`  ↓ FOTO→mp4  ${beat.name}.mp4  ("${q}") [${ph.src}]`); got = { src: ph.src }; }
      } catch {}
      fs.rmSync(tmp, { force: true });
      if (got) break;
    }
  }
  return got;
}
