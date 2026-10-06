// snowball.mjs — BOLA DE NIEVE: descubre canales NUEVOS del nicho y los suma a channels.json.
// Tres vías: (a) search-expansion de los temas que explotaron, (b) related sidebar del
// watch-page (ytInitialData — la API ya no lo da), (c) canales de los resultados de búsqueda.
// Cada candidato pasa un niche-check liviano (títulos recientes con forma listicle+gancho).
//
// Uso:  node analizador/snowball.mjs            → usa queries semilla + outliers cacheados
//       ADD=0 node analizador/snowball.mjs      → solo reporta, no escribe channels.json
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const DIR = "analizador";
const CACHE = path.join(DIR, "cache");
const cfgPath = path.join(DIR, "channels.json");
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const known = new Set([...cfg.seed, ...(cfg.discovered || [])].map((s) => s.toLowerCase()));

const PROXIES = (() => {
  for (const p of ["cookies/proxies.txt", "_matchpx/proxies.txt"]) {
    try { const l = fs.readFileSync(p, "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); if (l.length) return l; } catch {}
  }
  return [];
})();
let pi = 0;
const proxy = () => (PROXIES.length ? PROXIES[pi++ % PROXIES.length] : null);
const ytArgs = (extra) => { const px = proxy(); return [...extra, "--no-warnings", ...(px ? ["--proxy", px] : [])]; };

// ── queries semilla: la fórmula ganadora + los títulos de los outliers ya cacheados ──
const SEED_QUERIES = [
  "ancient artifacts that should not exist",
  "structures that cannot be replicated",
  "things science cannot explain",
  "discoveries that rewrite history",
  "objetos imposibles que no deberían existir",
  "lugares que la ciencia no puede explicar",
];
function outlierQueries() {
  const qs = [];
  try {
    for (const f of fs.readdirSync(CACHE).filter((f) => f.endsWith("_raw.json"))) {
      const d = JSON.parse(fs.readFileSync(path.join(CACHE, f), "utf8"));
      const subs = (d.entries || []).map((e) => e && e.channel_follower_count).find(Boolean) || 0;
      for (const e of (d.entries || []).filter(Boolean)) {
        if ((e.view_count || 0) > Math.max(subs * 5, 50000) && /(^|\s)[67]\b/.test(e.title || "")) qs.push(e.title);
      }
    }
  } catch {}
  return qs.slice(0, 8);
}

const handleOf = (e) => {
  const u = e.uploader_url || e.channel_url || "";
  const m = u.match(/@[\w.-]+/);
  if (m) return m[0];
  if (e.channel_id) return `channel/${e.channel_id}`; // fallback: id de canal
  return null;
};

// ── (a)+(c) search-expansion: canales de los top resultados de cada query ──
function fromSearch(query) {
  try {
    const out = execFileSync("yt-dlp", ytArgs(["--flat-playlist", "--playlist-end", "12", "-J", `ytsearch12:${query}`]),
      { maxBuffer: 128 * 1024 * 1024, encoding: "utf8", timeout: 90000 });
    const d = JSON.parse(out);
    return (d.entries || []).filter(Boolean).map((e) => ({ handle: handleOf(e), title: e.title || "", id: e.id }));
  } catch { return []; }
}

// ── (b) related sidebar del watch-page: scrape ytInitialData (la API ya no lo da) ──
function fromRelated(videoId) {
  try {
    const html = execFileSync("curl", ["-s", "-L", "--max-time", "30", ...(PROXIES.length ? ["--proxy", proxy()] : []),
      "-A", "Mozilla/5.0", `https://www.youtube.com/watch?v=${videoId}`], { maxBuffer: 64 * 1024 * 1024, encoding: "utf8" });
    const m = html.match(/ytInitialData\s*=\s*(\{.+?\});<\/script>/s) || html.match(/ytInitialData"\]\s*=\s*(\{.+?\});/s);
    if (!m) return [];
    const data = JSON.parse(m[1]);
    const found = [];
    const walk = (o) => {
      if (!o || typeof o !== "object") return;
      if (o.compactVideoRenderer) {
        const r = o.compactVideoRenderer;
        const runs = (r.longBylineText && r.longBylineText.runs) || [];
        const nav = runs[0] && runs[0].navigationEndpoint && runs[0].navigationEndpoint.browseEndpoint;
        const cUrl = nav && nav.canonicalBaseUrl;
        const title = (r.title && (r.title.simpleText || (r.title.runs && r.title.runs[0].text))) || "";
        if (cUrl) { const h = cUrl.match(/@[\w.-]+/); found.push({ handle: h ? h[0] : (nav.browseId ? `channel/${nav.browseId}` : null), title }); }
      }
      for (const k in o) walk(o[k]);
    };
    walk(data);
    return found.filter((x) => x.handle);
  } catch { return []; }
}

// ── niche-check liviano: ¿los títulos recientes del canal tienen forma del nicho? ──
const HOOK = /(should not exist|shouldn'?t exist|cannot be|can'?t explain|forbidden|rewrite history|no deberían|no puede explicar|prohibido|imposibl|no existen)/i;
const nicheScore = (titles) => titles.filter((t) => /(^|\s)[67]\b/.test(t) || HOOK.test(t)).length;
function isNiche(handle) {
  try {
    const url = handle.startsWith("channel/") ? `https://www.youtube.com/${handle}/videos` : `https://www.youtube.com/${handle}/videos`;
    const out = execFileSync("yt-dlp", ytArgs(["--flat-playlist", "--playlist-end", "8", "-J", "--extractor-args", "youtube:lang=en", url]),
      { maxBuffer: 64 * 1024 * 1024, encoding: "utf8", timeout: 90000 });
    const d = JSON.parse(out);
    const titles = (d.entries || []).filter(Boolean).map((e) => e.title || "");
    const subs = d.channel_follower_count || 0;
    return { ok: nicheScore(titles) >= 2, score: nicheScore(titles), n: titles.length, subs, name: d.channel || d.title || handle };
  } catch { return { ok: false, score: 0, n: 0 }; }
}

// ── main ──
const ADD = process.env.ADD !== "0";
const queries = [...SEED_QUERIES, ...outlierQueries()];
console.log(`🌨  Snowball · ${queries.length} queries · proxies=${PROXIES.length} · conocidos=${known.size}`);

const cand = new Map(); // handle → {title, via}
for (const q of queries) {
  for (const r of fromSearch(q)) if (r.handle) cand.set(r.handle.toLowerCase(), { handle: r.handle, via: "search", vid: r.id });
}
// related sidebar de algunos videos virales (los ids de los outliers cacheados)
const oq = outlierQueries();
const seedVids = [...cand.values()].filter((c) => c.vid).slice(0, 4).map((c) => c.vid);
for (const vid of seedVids) for (const r of fromRelated(vid)) cand.set(r.handle.toLowerCase(), { handle: r.handle, via: "related" });

const fresh = [...cand.values()].filter((c) => !known.has(c.handle.toLowerCase()));
console.log(`  candidatos: ${cand.size} · nuevos (no conocidos): ${fresh.length}`);

const added = [];
for (const c of fresh.slice(0, +(process.env.MAX_CHECK || 25))) {
  const nc = isNiche(c.handle);
  const tag = nc.ok ? "✅ NICHO" : "· fuera";
  console.log(`  ${tag} ${c.handle} (${nc.name || "?"}) · ${nc.subs || 0} subs · score ${nc.score}/${nc.n} · via ${c.via}`);
  if (nc.ok) added.push(c.handle);
}

if (ADD && added.length) {
  cfg.discovered = [...new Set([...(cfg.discovered || []), ...added])];
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
  console.log(`\n➕ Sumados a channels.json (discovered): ${added.join(", ")}`);
  console.log(`   Total ahora: ${cfg.seed.length} seed + ${cfg.discovered.length} discovered. Re-escaneá con: node analizador/investigar.mjs`);
} else {
  console.log(`\n${added.length ? `(ADD=0) habría sumado: ${added.join(", ")}` : "sin canales nuevos del nicho esta vez"}`);
}
