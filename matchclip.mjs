// matchclip.mjs — ELIGE automáticamente el clip de YouTube + el SEGUNDO exacto que mejor
// MUESTRAN lo que dice el guión, usando CLIP local (visión gratis, 0 tokens de Claude).
//
// v2 — búsqueda reescrita. Mejoras sobre la versión vieja ("la búsqueda era muy mala"):
//   1) BÚSQUEDA ANCHA + RE-RANK POR TÍTULO. Antes `ytsearch` traía lo más POPULAR (no lo
//      más relevante) y bajaba proxies del primer resultado. Ahora junta varias queries,
//      trae POOL candidatos con su título/duración, los REORDENA por relevancia léxica al
//      concepto (y penaliza reacciones/podcasts/gameplay), y baja proxies SOLO de los
//      CANDS más on-topic. El presupuesto de CLIP se gasta en videos que de verdad pegan.
//   2) ESCANEO DEL VIDEO ENTERO (coarse→fine). Antes solo miraba [after, after+180] = los
//      primeros 3 min, así que el mejor plano (minuto 8) jamás se veía. Ahora hace una
//      pasada GRUESA sobre todo el video (saltando intro/outro) y luego AFINA a 0.5s
//      alrededor del mejor frame → timestamp preciso y cobertura completa.
//   3) PENALIZACIÓN DE TEXTO/MARCA GRADUADA (antes era un cliff duro en 0.16 con bug).
//   4) MODO --probe: validás una query en segundos sin bajar nada (antes había que correr
//      2 h para descubrir que la query era mala).
//
// Requisitos: bin/yt-dlp.exe, ffmpeg de Remotion, @huggingface/transformers (instalado).
//
// Entrada — public/broll/match_<slug>.json:
//   [
//     { "name":"rb_dig", "concept":"hands digging dark soil with a shovel",
//       "query":"digging garden soil shovel" , "dur":5 },
//     // query puede ser un ARRAY de variantes: "query":["a","b","c"]
//     // si NO ponés after/scan → escanea el VIDEO ENTERO (recomendado).
//     // si ponés after/scan → respeta esa ventana (compatibilidad hacia atrás).
//     { "name":"rb_manure", "concept":"pile of cow manure on a farm",
//       "urls":["https://youtu.be/XXad","https://youtu.be/YYYY"], "dur":7 }
//   ]
//   · concept = texto EN que describe lo que se debe VER (no lo que se dice).
//   · query   = búsqueda(es) YouTube  |  urls = candidatos explícitos (sin buscar).
//   · dur/lead = como en fetch_clips.
//
// Uso:   node matchclip.mjs <slug>            (lee public/broll/match_<slug>.json)
//        node matchclip.mjs --probe "<query>" ["<concept opcional>"]   (test rápido, 0 descargas)
// Salida: public/broll/clips_<slug>_matched.json  (→ pasar a fetch_clips.mjs)
//
// Env tuneables:
//   MATCH_CANDS=6     proxies que se analizan por beat (más = mejor match, más lento)
//   MATCH_POOL=16     títulos que se traen de YouTube antes de re-rankear
//   MATCH_MAXSPAN=360 máx. segundos de cada video a escanear en modo "video entero"
//   MATCH_COARSE=44   cantidad de frames de la pasada gruesa
//   MATCH_FINE=0.5    paso (seg) de la pasada fina
//   MATCH_HEAD=6      seg a saltear al inicio (intros)
//   MATCH_MODEL=Xenova/clip-vit-base-patch32  (o ...-large-patch14 = más preciso, más lento)
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { pipeline } from "@huggingface/transformers";

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");

const CANDS = +(process.env.MATCH_CANDS || 6);
const POOL = +(process.env.MATCH_POOL || 16);
const MAXSPAN = +(process.env.MATCH_MAXSPAN || 360);
const COARSE = +(process.env.MATCH_COARSE || 44);
const FINE = +(process.env.MATCH_FINE || 0.5);
const HEAD = +(process.env.MATCH_HEAD || 6);
const TAIL = 0.06; // saltea el último 6% (créditos/outro)
// MATCH_REUSE=1 → permite SACAR VARIOS CLIPS de un mismo video/documental, en timestamps
// distintos (gap ≥ MATCH_MINGAP s). Sin el flag, se mantiene la diversidad por-video de antes.
const REUSE = process.env.MATCH_REUSE === "1";
const MINGAP_SAME = +(process.env.MATCH_MINGAP || 10);

const TMP = process.env.MATCH_TMP || "_match";
const vidId = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || u.match(/([A-Za-z0-9_-]{11})/) || [])[1];

// ── relevancia léxica del título al concepto ────────────────────────────────
const STOP = new Set(("a an the of to in on at by for with and or from into is are was were be " +
  "being this that it its as close up shot footage video clip hd 4k uhd full real best top").split(/\s+/));
const kw = (s) => [...new Set((s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
  .filter((w) => w.length > 2 && !STOP.has(w)))];
const BAD = /(reaction|react|podcast|full episode|interview|tier list|gameplay|let'?s play|trailer|unboxing|vlog|prank|asmr mukbang|tutorial how to draw|lyric|lyrics|music video|official video|official music|\bsong\b|cover|remix|karaoke|instrumental|playlist|audio only|full album)/i;

// busca varias queries, junta candidatos únicos y los REORDENA por relevancia al concepto.
// Devuelve [{url,id,title,dur}] (top CANDS). Trae título+duración → re-rank antes de bajar.
const searchRanked = (queries, concept, limit = CANDS) => {
  const want = new Set([...kw(concept), ...queries.flatMap(kw)]);
  const seen = new Map();
  for (const q of queries) {
    if (!q) continue;
    const r = spawnSync(YTDLP, [
      `ytsearch${POOL}:${q}`, "--skip-download", "--no-warnings",
      "--socket-timeout", "20",
      "--match-filter", "duration>40 & duration<3000 & !is_live",
      "--print", "%(id)s\t%(title)s\t%(duration)s",
    ], { encoding: "utf8", maxBuffer: 1 << 26, timeout: 60000 });
    const lines = (r.stdout || "").trim().split(/\r?\n/).filter(Boolean);
    lines.forEach((line, ri) => {
      const [id, title = "", durS = ""] = line.split("\t");
      if (!id) return;
      if (seen.has(id)) { const e = seen.get(id); e.rank = Math.min(e.rank, ri); return; }
      const t = title.toLowerCase();
      const lex = [...want].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
      const pen = BAD.test(t) ? 3 : 0; // empuja reacciones/podcasts/gameplay al fondo
      seen.set(id, { url: `https://youtu.be/${id}`, id, title, dur: +durS || 0, rank: ri, lex: lex - pen });
    });
  }
  // relevancia léxica manda; el ranking de YouTube desempata (sigue siendo señal útil)
  return [...seen.values()].sort((a, b) => (b.lex - a.lex) || (a.rank - b.rank)).slice(0, limit);
};

// ── modo PROBE: validar una query sin bajar nada ────────────────────────────
if (process.argv[2] === "--probe") {
  const q = process.argv[3];
  const concept = process.argv[4] || q;
  if (!q) { console.error('Uso: node matchclip.mjs --probe "<query>" ["<concept>"]'); process.exit(1); }
  const top = searchRanked(Array.isArray(q) ? q : [q], concept, 12);
  console.log(`\nTOP candidatos para "${q}"  (concepto: "${concept}")\n`);
  top.forEach((c, i) => console.log(
    `${String(i + 1).padStart(2)}. lex=${c.lex}  ${Math.floor(c.dur / 60)}:${String(c.dur % 60).padStart(2, "0")}  ${c.id}  ${c.title.slice(0, 80)}`));
  console.log("\n(lex = palabras del concepto que aparecen en el título; más alto = más on-topic)");
  process.exit(0);
}

const slug = process.argv[2];
if (!slug) { console.error("Uso: node matchclip.mjs <slug>   |   node matchclip.mjs --probe \"<query>\""); process.exit(1); }
const LIST = `public/broll/match_${slug}.json`;
if (!fs.existsSync(LIST)) { console.error("No existe:", LIST); process.exit(1); }
const beats = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(TMP, { recursive: true });

// ── descarga proxy 240p de [a,b] y extrae frames ────────────────────────────
const dlProxy = (url, a, b, tag) => {
  const proxy = path.join(TMP, `${tag}.mp4`);
  const dl = spawnSync(YTDLP, [
    url, "--download-sections", `*${Math.max(0, a)}-${b}`, "--force-keyframes-at-cuts",
    "-f", "bv*[height<=240]/wv*/w", "--ffmpeg-location", path.dirname(FF),
    "--socket-timeout", "20",
    "--merge-output-format", "mp4", "--no-playlist", "-o", proxy,
    "--force-overwrites", "--quiet", "--no-warnings",
  ], { encoding: "utf8", timeout: +(process.env.MATCH_DLTIMEOUT || 75000) });
  return (dl.status === 0 && fs.existsSync(proxy)) ? proxy : null;
};
// extrae frames del proxy. baseT = tiempo REAL del 1er frame. ss = seek dentro del proxy.
// ⚠ este ffmpeg (Remotion n7.1) falla con `-vf fps=`; usar `-r` (+ `-ss` antes de `-i`).
const extract = (proxy, baseT, step, maxF, tag, ss = 0) => {
  const fdir = path.join(TMP, `${tag}_f`);
  fs.rmSync(fdir, { recursive: true, force: true });
  fs.mkdirSync(fdir, { recursive: true });
  const args = ["-y"];
  if (ss > 0) args.push("-ss", String(ss));
  args.push("-i", proxy, "-r", String(1 / step), "-frames:v", String(maxF), path.join(fdir, "f%04d.png"));
  spawnSync(FF, args, { encoding: "utf8" });
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort() : [];
  return files.map((f, i) => ({ file: path.join(fdir, f), t: +(baseT + i * step).toFixed(1) }));
};

const MODEL = process.env.MATCH_MODEL || "Xenova/clip-vit-base-patch32";
// GPU por DirectML (Win) por defecto → ~3-4x más rápido que CPU. Override: MATCH_DEVICE=cpu
const DEVICE = process.env.MATCH_DEVICE || "dml";
const DTYPE = DEVICE === "cpu" ? "q8" : "fp32";
console.log(`cargando CLIP local (${MODEL}, ${DTYPE}, ${DEVICE.toUpperCase()})...`);
let clf;
try {
  clf = await pipeline("zero-shot-image-classification", MODEL, { device: DEVICE, dtype: DTYPE });
} catch (e) {
  console.log(`(${DEVICE} falló: ${String(e.message || e).slice(0, 60)} → CPU q8)`);
  clf = await pipeline("zero-shot-image-classification", MODEL, { dtype: "q8" });
}
const DISTRACTORS = [
  "a person talking to the camera, a talking head",
  "a blurry or unrelated indoor scene",
];
const TEXT_LABELS = [
  "a title card or large bold text overlay across the screen",
  "big subtitles or captions text on screen",
  "a channel logo, watermark or banner",
];
const scoreFrame = async (file, concept) => {
  const out = await clf(file, [concept, ...DISTRACTORS, ...TEXT_LABELS]);
  const get = (l) => out.find((o) => o.label === l)?.score || 0;
  const c = get(concept);
  const textMax = Math.max(...TEXT_LABELS.map(get));
  // penalización GRADUADA por texto/marca quemada (antes: cliff duro ×0.12 en 0.16).
  const penalty = textMax <= 0.10 ? 1 : textMax >= 0.30 ? 0.10 : 1 - ((textMax - 0.10) / 0.20) * 0.90;
  return c * penalty;
};

// analiza UN candidato: pasada gruesa por todo el video + pasada fina alrededor del pico.
const analyze = async (cand, beat, tag, avoidTs = []) => {
  const near = (t) => avoidTs.some((u) => Math.abs(u - t) < MINGAP_SAME);
  const explicitWindow = beat.after != null || beat.scan != null;
  const a0 = explicitWindow ? (beat.after ?? 0) : HEAD;
  const dur = cand.dur || 0;
  const end = explicitWindow
    ? a0 + (beat.scan ?? 180)
    : Math.min(a0 + MAXSPAN, dur ? Math.floor(dur * (1 - TAIL)) : a0 + MAXSPAN);
  const span = Math.max(2, end - a0);
  const proxy = dlProxy(cand.url, a0, end, tag);
  if (!proxy) return null;
  const coarseStep = explicitWindow ? (beat.step || 2) : Math.max(2, +(span / COARSE).toFixed(2));
  const coarse = extract(proxy, a0, coarseStep, Math.ceil(span / coarseStep) + 2, tag + "_c");
  if (!coarse.length) return null;
  const cs = [];
  for (const fr of coarse) { const s = await scoreFrame(fr.file, beat.concept); cs.push({ t: fr.t, score: s }); }
  // si hay tramos ya usados de este video (modo REUSE), descartá los frames cercanos;
  // si TODO queda descartado (video chico/agotado), caé al mejor igual.
  let pool = REUSE && avoidTs.length ? cs.filter((f) => !near(f.t)) : cs;
  if (!pool.length) pool = cs;
  let bf = pool.reduce((m, f) => (f.score > m.score ? f : m), { score: -1, t: a0 });
  // pasada FINA: ±un paso grueso alrededor del mejor, a FINE seg, desde el MISMO proxy.
  if (coarseStep > FINE) {
    const fa = Math.max(a0, +(bf.t - coarseStep).toFixed(2));
    const fb = Math.min(end, +(bf.t + coarseStep).toFixed(2));
    const fine = extract(proxy, fa, FINE, Math.ceil((fb - fa) / FINE) + 2, tag + "_x", fa - a0);
    for (const fr of fine) { if (REUSE && avoidTs.length && near(fr.t)) continue; const s = await scoreFrame(fr.file, beat.concept); if (s > bf.score) bf = { score: s, t: fr.t }; }
  }
  return { score: bf.score, t: bf.t, url: cand.url, id: cand.id };
};

const outPath = `public/broll/clips_${slug}_matched.json`;
// RESUME: si ya hay matched.json, retomo donde quedó (no re-matcheo lo hecho).
const results = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : [];
const doneNames = new Set(results.map((r) => r.name));
const usedIds = new Set(results.map((r) => vidId(r.url)).filter(Boolean)); // diversidad por-video
// timestamps ya extraídos por video (para sacar VARIOS clips de un doc sin repetir tramo)
const usedTs = new Map();
for (const r of results) { const id = vidId(r.url); if (id) { const a = usedTs.get(id) || []; a.push((r.start || 0) + 1); usedTs.set(id, a); } }
const avoidFor = (id) => usedTs.get(id) || [];
if (doneNames.size) console.log(`resume: ${doneNames.size} beats ya matcheados → los salteo`);
for (const b of beats) {
  const { name, concept, dur = 6, lead = 1.0 } = b;
  if (doneNames.has(name)) continue;
  let cands;
  if (b.urls) cands = b.urls.map((u) => ({ url: u, id: vidId(u), title: "", dur: 0 }));
  else {
    const queries = Array.isArray(b.query) ? b.query : [b.query];
    cands = searchRanked(queries, concept);
  }
  if (!cands.length) { console.log(`✗ ${name}: sin candidatos`); continue; }
  process.stdout.write(`• ${name}  "${concept}"  (${cands.length} candidatos)\n`);
  const scored = [];
  for (let i = 0; i < cands.length; i++) {
    const res = await analyze(cands[i], b, `${name}_${i}`, avoidFor(cands[i].id));
    if (!res) { console.log(`    cand ${i + 1} (${cands[i].id}): sin frames`); continue; }
    console.log(`    cand ${i + 1} (${res.id}): mejor ${res.score.toFixed(3)} @ ${res.t}s`);
    scored.push(res);
  }
  if (!scored.length) { console.log(`✗ ${name}: sin frames en ningún candidato`); continue; }
  // En modo REUSE penalizamos LEVE al video ya usado (variar fuentes) pero permitimos reusarlo
  // a otro timestamp; sin REUSE, mantenemos la diversidad dura por-video como antes.
  scored.sort((a, b2) => (b2.score - (REUSE && usedIds.has(b2.id) ? 0.03 : 0)) - (a.score - (REUSE && usedIds.has(a.id) ? 0.03 : 0)));
  let best = scored[0];
  let fresh = null;
  if (!REUSE) {
    fresh = scored.find((c) => c.id && !usedIds.has(c.id) && c.score >= scored[0].score * 0.88);
    if (fresh) best = fresh;
  }
  const reusedTs = REUSE && (avoidFor(best.id) || []).length > 0; // sacó OTRO tramo del mismo doc
  if (best.id) { usedIds.add(best.id); usedTs.set(best.id, [...avoidFor(best.id), best.t]); }
  const start = Math.max(0, +(best.t - lead).toFixed(1));
  const flag = best.score < 0.55 ? "  ⚠ DUDOSO" : "";
  console.log(`  → ${name}: ${best.score.toFixed(3)} @ ${best.t}s  start=${start}${flag}${fresh ? " (diverso)" : ""}${reusedTs ? " (multi-doc)" : ""}`);
  results.push({ name, url: best.url, start, dur, _score: +best.score.toFixed(3) });
  fs.writeFileSync(outPath + ".tmp", JSON.stringify(results, null, 2)); fs.renameSync(outPath + ".tmp", outPath); // guardado INCREMENTAL atómico
}

fs.writeFileSync(outPath + ".tmp", JSON.stringify(results, null, 2)); fs.renameSync(outPath + ".tmp", outPath);
console.log(`\n=== ${results.length} beats → ${outPath} ===`);
console.log("Revisá los _score (números, 0 tokens). Luego: node fetch_clips.mjs " + outPath);
fs.rmSync(TMP, { recursive: true, force: true });
