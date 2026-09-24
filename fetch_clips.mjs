// fetch_clips.mjs — baja TRAMOS CORTOS de videos de YouTube (b-roll real específico
// al guión), recortando solo el segmento pedido (no el video entero). Estilo de los
// canales faceless: clip real de otro creador → recorte → tu narración encima.
//
// ⚠ Zona gris de copyright: es metraje de terceros. Útil para probar; revisá antes
//    de monetizar en serio.
//
// Requisitos (ya en el repo): bin/yt-dlp.exe + el ffmpeg de Remotion (n7.1).
//
// Lista de tomas — public/broll/clips_<video>.json:
//   [
//     { "name":"vaca_bosta",  "url":"https://youtu.be/XXXX", "start":"00:01:12", "dur":6 },
//     { "name":"lombrices",   "url":"https://youtu.be/YYYY", "find":"worm",      "dur":7 },
//     { "name":"compost",     "url":"https://youtu.be/ZZZZ", "find":["dig","spade"], "dur":8, "lead":1.5 }
//   ]
//   · start = segundos (número) o "HH:MM:SS" / "MM:SS"  (momento fijo)
//   · find  = palabra(s) clave → ★ ubica el momento EXACTO usando los SUBTÍTULOS del
//            video fuente (cuando el creador DICE la acción, casi siempre la MUESTRA).
//            Mucho más preciso que un start al azar. Si encuentra, IGNORA `start`.
//   · lead  = segundos a arrancar ANTES de la palabra hallada (default 1.2)
//   · dur   = segundos del recorte
//
// Variables de entorno:
//   FORCE=1  → re-baja aunque el archivo ya exista (útil al corregir starts/find).
//
// Uso:
//   node fetch_clips.mjs [clips_<video>.json=public/broll/clips_estiercol.json] [outDir=public/broll]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { probeMedia } from "./match_v3/lib.mjs";

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FFDIR = process.env.FETCH_FFDIR || path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc");
const FORCE = process.env.FORCE === "1";
// COOKIES de cuentas QUEMADAS (cookies/*.txt) para esquivar throttle. Rota por toma entre
// cuentas. Sin carpeta cookies/ → baja sin cookies (como antes).
const cookieDir = process.env.COOKIE_DIR || "cookies";
let cookieFiles = [];
try { cookieFiles = fs.readdirSync(cookieDir).filter((f) => f.endsWith(".txt") && f !== "proxies.txt").sort().map((f) => path.join(cookieDir, f)); } catch { /* sin cookies */ }
const cookieArg = (i) => (cookieFiles.length ? ["--cookies", cookieFiles[i % cookieFiles.length]] : []);
if (cookieFiles.length) console.log(`usando ${cookieFiles.length} cuenta(s) de cookies (rotando)`);
// PROXY dedicado al scraping (NO el de tus canales). cookies/proxies.txt = 1 por línea
// (mismo orden que las cookies → empareja cuenta↔IP). Fallback YTPROXY. Vacío → IP local.
// YTPROXY (si está) MANDA y NO se pisa con proxies.txt → permite fijar 1 worker = 1 IP
// (fetch_parallel.mjs). Sin YTPROXY → rota por proxies.txt como siempre.
let proxyList = process.env.YTPROXY ? [process.env.YTPROXY] : [];
if (!proxyList.length) { try { const px = fs.readFileSync(path.join(cookieDir, "proxies.txt"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); if (px.length) proxyList = px; } catch { /* sin proxies.txt */ } }
const proxyArg = (i) => (proxyList.length ? ["--proxy", proxyList[i % proxyList.length]] : []);
if (proxyList.length) console.log(`usando ${proxyList.length} proxy(s) (rotando por toma)`);

// ⛔⛔ REGLA DURA: NUNCA bajar de YouTube por la IP del creador — mancharía su IP (donde viven sus
// canales conectados). Si no hay proxy válido, YouTube se APAGA por completo y el pipeline usa
// stock/web/IA (que no necesitan proxy). Para bajar igual por tu IP a propósito: ALLOW_LOCAL_IP=1.
if (!proxyList.length && process.env.ALLOW_LOCAL_IP !== "1") {
  console.error("⛔ SIN PROXY: no bajo de YouTube por tu IP (la mancharía). Fuentes sin YouTube = stock/web/IA.");
  console.error("   Poné proxies en cookies/proxies.txt, o forzá tu IP con ALLOW_LOCAL_IP=1 (NO recomendado).");
  process.exit(3);   // 3 = apagado a propósito → el pipeline cae a stock/web/IA, no es un error real
}

const rawArgs = process.argv.slice(2);
// slug del video: por --slug <x>, env SLUG, o derivado de clips_<slug>_matched.json / clips_<slug>.json
let slug = process.env.SLUG || "";
const si = rawArgs.indexOf("--slug");
if (si >= 0) { slug = rawArgs[si + 1] || ""; rawArgs.splice(si, 2); }
const [listArg, outArg] = rawArgs;
const LIST = listArg || "public/broll/clips_estiercol.json";
if (!slug) { const m = /^clips_(.+?)(?:_matched)?\.json$/i.exec(path.basename(LIST)); if (m) slug = m[1]; }
// ★ AISLAMIENTO POR VIDEO: cada video baja sus clips a su PROPIA subcarpeta public/broll/<slug>/, así
// dos videos NUNCA se pisan los clips. Si pasás outDir explícito, se respeta (backward-compatible).
const OUT = outArg || (slug ? path.join("public/broll", slug) : "public/broll");
const SUBDIR = path.join(OUT, "_subs");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SUBDIR, { recursive: true });
if (slug) console.log(`[aislamiento] clips de este video → ${OUT}/`);
else console.warn("[aislamiento] ⚠ sin slug: bajando a public/broll/ compartida — pasá --slug <slug> o usá clips_<slug>_matched.json para AISLAR.");

if (!fs.existsSync(YTDLP)) {
  console.error("Falta bin/yt-dlp.exe");
  process.exit(1);
}
if (!fs.existsSync(LIST)) {
  console.error("No existe la lista:", LIST);
  process.exit(1);
}
const clips = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));

// "HH:MM:SS" | "MM:SS" | número → segundos
const toSec = (v) => {
  if (typeof v === "number") return v;
  const parts = String(v).split(":").map(Number);
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const vidId = (url) => {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || url.match(/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

// VTT "HH:MM:SS.mmm" → segundos
const vttToSec = (t) => {
  const m = t.match(/(\d{2}):(\d{2}):(\d{2})[.,](\d{3})/);
  if (!m) return null;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

// baja (una vez por id) los subs y devuelve [{start, text}]
// `ci` = índice de toma → usa la MISMA cuenta+IP que la descarga (pareja cuenta↔IP;
// antes iba todo por la cuenta 0 y concentraba los pedidos en un solo proxy).
const subsCache = new Map();
const getSubs = (url, ci = 0) => {
  const id = vidId(url);
  if (!id) return [];
  if (subsCache.has(id)) return subsCache.get(id);
  // ¿ya están en disco?
  let vtt = fs.readdirSync(SUBDIR).find((f) => f.startsWith(id) && f.endsWith(".vtt"));
  if (!vtt) {
    spawnSync(YTDLP, [
      url, ...cookieArg(ci), ...proxyArg(ci), "--skip-download", "--write-auto-subs", "--write-subs",
      "--sub-langs", "en.*,es.*", "--sub-format", "vtt", "--convert-subs", "vtt",
      "--no-playlist", "-o", path.join(SUBDIR, "%(id)s.%(ext)s"),
      "--quiet", "--no-warnings",
    ], { encoding: "utf8" });
    vtt = fs.readdirSync(SUBDIR).find((f) => f.startsWith(id) && f.endsWith(".vtt"));
  }
  if (!vtt) { subsCache.set(id, []); return []; }
  const raw = fs.readFileSync(path.join(SUBDIR, vtt), "utf8");
  const cues = [];
  const blocks = raw.split(/\r?\n\r?\n/);
  for (const b of blocks) {
    const lines = b.split(/\r?\n/);
    const tl = lines.find((l) => l.includes("-->"));
    if (!tl) continue;
    const start = vttToSec(tl.split("-->")[0].trim());
    if (start == null) continue;
    const text = lines.filter((l) => !l.includes("-->") && !/^WEBVTT|^\d+$|^Kind:|^Language:/.test(l))
      .join(" ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) cues.push({ start, text });
  }
  subsCache.set(id, cues);
  return cues;
};

// ubica el primer momento (después de `after` seg) donde se dice alguna keyword
const findMoment = (url, find, lead, after = 0, ci = 0) => {
  const keys = (Array.isArray(find) ? find : [find]).map(norm);
  const cues = getSubs(url, ci);
  for (const c of cues) {
    if (c.start < after) continue; // saltea intro/menciones tempranas
    const t = norm(c.text);
    if (keys.some((k) => t.includes(k))) return Math.max(0, c.start - lead);
  }
  return null;
};

// ── GATE TÉCNICO de lo bajado (antes: éxito = exit 0 + el archivo existe → un mp4
// truncado de 50KB contaba como OK y quedaba para siempre por el skip-si-existe).
const MIN_H = +(process.env.FETCH_MIN_HEIGHT || 480);
const validClip = (file, wantDur) => {
  const m = probeMedia(file);
  if (!m) return "ffprobe falló";
  if (m.duration < Math.min(wantDur * 0.7, wantDur - 1.5)) return `truncado ${m.duration.toFixed(1)}s de ${wantDur}s`;
  if (m.width && m.height && m.width < m.height) return `vertical ${m.width}x${m.height}`;
  if (m.height && m.height < MIN_H) return `baja res ${m.width}x${m.height}`;
  return null;
};

let ok = 0, fail = 0, refound = 0, _ci = -1;
const badList = [];
for (const c of clips) {
  _ci++;
  const { name, url, dur = 6, find, lead = 1.2, after = 0 } = c;
  if (!name || !url) { console.warn("Toma inválida:", JSON.stringify(c)); continue; }
  const dest = path.join(OUT, `${name}.mp4`);
  if (fs.existsSync(dest) && !FORCE) {
    // revalidar lo ya bajado: un clip roto en disco no puede "aprobar" por existir
    const why = validClip(dest, toSec(dur));
    if (!why) { console.log(`• ${name}  (ya existe, válido, salteo)`); ok++; continue; }
    console.log(`• ${name}  (existía pero ${why} → re-bajo)`);
    fs.rmSync(dest, { force: true });
  }

  let s = toSec(c.start ?? 0);
  let how = "start";
  if (find) {
    const m = findMoment(url, find, lead, after, _ci);
    if (m != null) { s = +m.toFixed(2); how = `find:"${Array.isArray(find) ? find.join("|") : find}"`; refound++; }
    else how = `start (find sin subs/match)`;
  }
  const e = s + toSec(dur);
  process.stdout.write(`• ${name}  ${url}  [${s}s → ${e.toFixed(1)}s · ${how}] … `);

  const args = [
    url,
    ...cookieArg(_ci), ...proxyArg(_ci),
    // ★★★ SOLVER DEL DESAFÍO JS DE YOUTUBE (deno) — SIN ESTO NO BAJA NADA.
    // YouTube exige resolver un "n challenge" en JS para entregar los formatos de video. Sin el
    // solver, yt-dlp SOLO ve imágenes y toda descarga falla con "Requested format is not available".
    // Medido 24-jul-2026: mismo video+cookie → sin el flag ERROR · con el flag OK.
    // Ese fallo se venía leyendo como "el nicho no tiene clips" y se anotó como regla en la memoria
    // de un canal (falso). Si vuelve a fallar, revisar ESTO antes de culpar al nicho o a las cookies.
    "--remote-components", "ejs:github",
    "--download-sections", `*${s}-${e}`,
    "--force-keyframes-at-cuts",
    // piso de resolución: sin fuente ≥480p el download FALLA → el beat cae a stock
    // (quality-first: mejor un Pexels limpio que un 240p pixelado al aire)
    "-f", `bv*[height<=1080][height>=${MIN_H}]+ba/b[height<=1080][height>=${MIN_H}]`,
    "--ffmpeg-location", FFDIR,
    "--merge-output-format", "mp4",
    "--no-playlist",
    "-o", dest,
    "--force-overwrites",
    // ★ PACING: delay aleatorio antes de cada descarga → no gatilla rate-limit ni a volumen
    //   (clave para automatización 1/día sostenible). Tunear con FETCH_SLEEP_MIN/MAX (def 1.5/5s).
    "--sleep-interval", String(+(process.env.FETCH_SLEEP_MIN || 1.5)),
    "--max-sleep-interval", String(+(process.env.FETCH_SLEEP_MAX || 5)),
    "--retries", "3", "--fragment-retries", "3",
    "--quiet", "--no-warnings",
  ];
  const r = spawnSync(YTDLP, args, { encoding: "utf8" });
  // ★ auto-cooldown: si YouTube tira rate-limit, espero antes de seguir (no quema más la cuenta)
  if (r.status !== 0 && /rate.?limit/i.test(r.stderr || "")) { const cd = +(process.env.FETCH_COOLDOWN || 30); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, cd * 1000); }
  if (r.status === 0 && fs.existsSync(dest)) {
    const why = validClip(dest, toSec(dur));
    if (why) {
      console.log(`✗ bajó pero ${why} → descartado`);
      fs.rmSync(dest, { force: true });
      badList.push({ name, concept: c.concept || "", query: c.query, dur, why });
      fail++;
    } else {
      const kb = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`✓ broll/${name}.mp4  (${kb} KB)`);
      ok++;
    }
  } else {
    console.log(`✗ ${(r.stderr || "").trim().split("\n").slice(-1)[0] || "error"}`);
    badList.push({ name, concept: c.concept || "", query: c.query, dur, why: "descarga falló" });
    fail++;
  }
}
// los fallidos/descartados quedan listos para la cascada de stock
if (badList.length) {
  const failPath = LIST.replace(/\.json$/, "_failed.json");
  fs.writeFileSync(failPath, JSON.stringify(badList, null, 2));
  console.log(`\n${badList.length} tomas sin clip válido → ${failPath} (correr stockfallback/fetchstock sobre esa lista)`);
}
console.log(`\n=== ${ok} OK · ${fail} fallos · ${refound} ubicados por subtítulos ===  → ${OUT}`);
