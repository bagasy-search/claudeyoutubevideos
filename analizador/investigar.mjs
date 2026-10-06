// investigar.mjs — Investigador de nicho para "Crónicas Perdidas".
// Escanea canales del nicho (misterio/descubrimientos imposibles), rankea VIDEOS por
// OUTLIER SCORE (no por views crudo), filtra por fórmula del nicho, DEDUPea contra lo ya
// hecho, y con el juicio de Claude (visión de miniaturas) propone la versión Crónicas.
//
// Uso:
//   node analizador/investigar.mjs                 → todos los canales semilla
//   node analizador/investigar.mjs @KRONVEIL1      → un solo canal (verificación)
//   NO_JUDGE=1 ...                                 → salta el juicio de Claude (solo score+dedup mecánico)
//   FRESH=1 ...                                    → ignora el cache y re-baja
import fs from "fs";
import path from "path";
import { execFileSync, spawnSync } from "child_process";

const DIR = "analizador";
const CACHE = path.join(DIR, "cache");
const THUMBS = path.join(CACHE, "thumbs");
fs.mkdirSync(THUMBS, { recursive: true });

const TODAY = process.env.TODAY || new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
const CACHE_HOURS = +(process.env.CACHE_HOURS || 6);
const TOPK = +(process.env.TOPK || 8);           // cuántos candidatos van al juicio de Claude
const LIMIT = +(process.env.CHAN_LIMIT || 40);   // videos por canal a extraer

// ── proxies (rota por índice) ──
const PROXIES = (() => {
  for (const p of ["cookies/proxies.txt", "_matchpx/proxies.txt"]) {
    try { const l = fs.readFileSync(p, "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); if (l.length) return l; } catch {}
  }
  return [];
})();
const proxyFor = (i) => (PROXIES.length ? PROXIES[i % PROXIES.length] : null);

const ageDays = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return 999;
  const d = (s) => new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  return Math.max(0, Math.round((d(TODAY) - d(yyyymmdd)) / 86400000));
};

// ── OUTLIER SCORE = (views/subs) × velocidad(views/día) × recencia(<30d pesa más) ──
function outlier(v, subs) {
  const views = v.views || 0;
  const age = Math.max(1, ageDays(v.date));
  const ratio = views / Math.max(subs, 1);      // cuánto le pegó por encima de su tamaño
  const velocity = views / age;                 // views por día
  const recency = age <= 30 ? 1 + (30 - age) / 30 : 1; // hasta 2× para recién salidos
  return { score: ratio * velocity * recency, ratio, velocity, age, views };
}

// ── fetch de un canal (yt-dlp full extraction, con cache anti rate-limit) ──
function fetchChannel(handle, idx) {
  const safe = handle.replace(/[^a-zA-Z0-9_-]/g, "");
  const raw = path.join(CACHE, `${safe}_raw.json`);
  const fresh = process.env.FRESH === "1";
  const stale = !fs.existsSync(raw) || (Date.now() - fs.statSync(raw).mtimeMs) / 3.6e6 > CACHE_HOURS;
  if (fresh || stale) {
    const proxy = proxyFor(idx);
    const args = ["--playlist-end", String(LIMIT), "-J", "-i", "--no-warnings",
      "--extractor-args", "youtube:lang=en",
      ...(proxy ? ["--proxy", proxy] : []),
      `https://www.youtube.com/${handle}/videos`];
    try {
      const out = execFileSync("yt-dlp", args, { maxBuffer: 256 * 1024 * 1024, encoding: "utf8", timeout: 300000 });
      fs.writeFileSync(raw, out);
    } catch (e) {
      if (!fs.existsSync(raw)) { console.error(`  ✗ ${handle}: fetch falló (${(e.message || "").slice(0, 80)})`); return null; }
      console.error(`  ⚠ ${handle}: fetch falló, uso cache viejo`);
    }
  }
  let d; try { d = JSON.parse(fs.readFileSync(raw, "utf8")); } catch { return null; }
  const ents = (d.entries || []).filter(Boolean);
  const subs = ents.map((e) => e.channel_follower_count).find((x) => x) || d.channel_follower_count || 0;
  const videos = ents.filter((e) => e.view_count != null).map((e) => ({
    id: e.id, title: e.title || "", views: e.view_count || 0, date: e.upload_date || "",
    duration: e.duration || 0, thumb: e.thumbnail || (e.thumbnails && e.thumbnails.at(-1)?.url) || "",
    url: `https://youtu.be/${e.id}`,
  }));
  return { handle, channel: d.channel || d.title || handle, subs, videos };
}

// ── prefiltro mecánico barato: forma de listicle (empieza con número) para no tirar todo al LLM ──
const listNum = (t) => { const m = (t || "").match(/(?:^|\s)([0-9]{1,2})\b/); return m ? +m[1] : null; };

// ── dedup mecánico (multilingüe por keywords) como red de seguridad antes del LLM ──
const DONE = JSON.parse(fs.readFileSync(path.join(DIR, "done_topics.json"), "utf8")).done;
function mechDedup(title) {
  const t = (title || "").toLowerCase();
  for (const d of DONE) for (const k of d.keywords) if (t.includes(k.toLowerCase())) return d.slug;
  return null;
}

function downloadThumb(v) {
  const f = path.join(THUMBS, `${v.id}.jpg`);
  if (fs.existsSync(f) && fs.statSync(f).size > 1000) return f;
  try { execFileSync("curl", ["-s", "-L", "-o", f, "--max-time", "25", v.thumb], { stdio: "ignore" }); }
  catch {}
  return fs.existsSync(f) && fs.statSync(f).size > 1000 ? f : null;
}

// ── juicio de Claude (Opus + visión de miniaturas): nicho + dedup semántico + propuesta ──
function judge(cands) {
  const thumbs = cands.map((c) => ({ ...c, thumbPath: downloadThumb(c) }));
  const list = thumbs.map((c, i) => `[#${i}] "${c.title}"\n  views=${c.views} subs=${c.subs} multiplicador=${(c.views / Math.max(c.subs, 1)).toFixed(1)}x edad=${c.age}d link=${c.url}\n  miniatura(archivo para que la MIRES): ${c.thumbPath || "(no se pudo bajar)"}`).join("\n\n");
  const doneList = DONE.map((d) => `- ${d.slug}: ${d.title}`).join("\n");
  const prompt = `Sos el investigador de nicho del canal faceless "Crónicas Perdidas" (español, misterio/descubrimientos, formato listicle "6-7 X que…"). Te paso videos VIRALES de la competencia. Para CADA uno decidí y proponé.

FÓRMULA GANADORA del nicho (validada con videos de 1M+):
- Título: número mágico 6 o 7 + verbo-gancho ("que la ciencia no puede explicar", "que no deberían existir", "prohibido abrir", "rompen la historia oficial") + tema UNIVERSAL e IMPOSIBLE.
- RECHAZAR lo geográfico/específico: un país ("maravillas de Nepal"), un lugar/persona/evento nombrado (Angkor Wat, Blackbeard, Krakatoa), un solo objeto. Eso NO escala.
- Miniatura ganadora: paisaje épico a plena LUZ DE DÍA, color vivo y saturado, UNA estructura colosal imposible, figura humana diminuta para escala, flecha amarilla apuntándola, cielo azul/dramático. NO oscuro. Sin texto quemado.

YA HECHOS por Crónicas Perdidas (para DEDUP — los títulos de la competencia pueden estar en otro idioma, matcheá por SIGNIFICADO):
${doneList}

CANDIDATOS (mirá el archivo de miniatura de cada uno con tu visión):
${list}

Devolvé SOLO un JSON válido (sin texto alrededor, sin markdown) con esta forma:
{"resultados":[{"i":0,"titulo_en":"traducción al inglés/español del título","nicho_fit":true,"motivo_fit":"por qué entra o no","geografico":false,"dedup":"fresh|angle|done","dedup_slug":"slug o null","por_que_exploto":"1 frase","propuesta":{"titulo":"título Crónicas con hook","miniatura":"concepto de miniatura (colosal+flecha+día)","items":["item 1","...7 items"]}}]}
Reglas: si dedup="done" o nicho_fit=false, propuesta=null. "angle" = mismo tema pero otro ángulo (se puede hacer). Incluí TODOS los candidatos por su índice i.`;

  const r = spawnSync("claude", ["-p", prompt, "--model", process.env.JUDGE_MODEL || "claude-opus-4-8",
    "--output-format", "json", "--dangerously-skip-permissions"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
  if (r.status !== 0) { console.error("juicio Claude falló:", (r.stderr || "").slice(0, 200)); return null; }
  try {
    const outer = JSON.parse(r.stdout);
    let txt = (outer.result || "").trim().replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(txt);
  } catch (e) { console.error("no pude parsear el juicio:", e.message, "\n", (r.stdout || "").slice(0, 400)); return null; }
}

// ── main ──
const arg = process.argv[2];
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, "channels.json"), "utf8"));
const handles = arg ? [arg] : [...cfg.seed, ...(cfg.discovered || [])];
console.log(`🔎 Investigando ${handles.length} canal(es) · hoy=${TODAY} · proxies=${PROXIES.length}`);

let all = [];
handles.forEach((h, i) => {
  const c = fetchChannel(h, i);
  if (!c) return;
  console.log(`  ${c.channel} (${c.handle}) · ${c.subs} subs · ${c.videos.length} videos`);
  for (const v of c.videos) {
    const o = outlier(v, c.subs);
    all.push({ ...v, subs: c.subs, channel: c.channel, ...o, num: listNum(v.title), dupMech: mechDedup(v.title) });
  }
});

all.sort((a, b) => b.score - a.score);
console.log(`\n📊 RANKING por OUTLIER SCORE (${all.length} videos):`);
for (const v of all.slice(0, 12)) {
  console.log(`  ${v.score.toExponential(2).padStart(9)} | ${v.ratio.toFixed(1)}x subs | ${v.views.toString().padStart(8)} v | ${v.age}d | num=${v.num ?? "-"} ${v.dupMech ? `[DUP:${v.dupMech}]` : ""} | ${v.title.slice(0, 52)}`);
}

// candidatos al juicio: top por score que tengan forma de listicle (num presente), sin importar dedup (Claude lo confirma)
const cands = all.filter((v) => v.num).slice(0, TOPK);
if (process.env.NO_JUDGE === "1") { console.log("\n(NO_JUDGE=1 — salto el juicio de Claude)"); process.exit(0); }
if (!cands.length) { console.log("\nsin candidatos con forma de listicle"); process.exit(0); }

console.log(`\n🧠 Juicio de Claude sobre ${cands.length} candidatos (visión de miniaturas)…`);
const j = judge(cands);
if (!j || !j.resultados) { console.log("juicio no disponible"); process.exit(1); }

console.log(`\n════════ PROPUESTAS FRESCAS PARA CRÓNICAS PERDIDAS ════════`);
let n = 0;
for (const r of j.resultados) {
  const c = cands[r.i]; if (!c) continue;
  const tag = r.dedup === "done" ? "🔁 YA HECHO" : r.dedup === "angle" ? "♻️ MISMO TEMA/OTRO ÁNGULO" : !r.nicho_fit ? "❌ FUERA DE NICHO" : "✅ FRESCO";
  console.log(`\n[${tag}] ${r.titulo_en || c.title}`);
  console.log(`   ${c.views} views · ${c.ratio.toFixed(1)}x subs · ${c.age}d · ${c.url}`);
  if (r.dedup === "done") { console.log(`   → dup de: ${r.dedup_slug}`); continue; }
  if (!r.nicho_fit) { console.log(`   → ${r.motivo_fit}${r.geografico ? " (geográfico)" : ""}`); continue; }
  if (r.por_que_exploto) console.log(`   💥 ${r.por_que_exploto}`);
  if (r.propuesta) {
    n++;
    console.log(`   📝 TÍTULO: ${r.propuesta.titulo}`);
    console.log(`   🖼  MINIATURA: ${r.propuesta.miniatura}`);
    console.log(`   📋 ${(r.propuesta.items || []).map((x, k) => `${k + 1}. ${x}`).join(" · ")}`);
  }
}
console.log(`\n${n} propuesta(s) fresca(s) lista(s).`);

// ── dump JSON para el router del grupo (mensaje del Investigador) ──
const fresh = j.resultados
  .filter((r) => r.nicho_fit && r.dedup !== "done" && r.propuesta)
  .map((r) => { const c = cands[r.i] || {}; return { titulo_en: r.titulo_en, url: c.url, views: c.views, ratio: +(c.ratio || 0).toFixed(1), age: c.age, channel: c.channel, dedup: r.dedup, por_que_exploto: r.por_que_exploto, propuesta: r.propuesta }; })
  .sort((a, b) => b.ratio - a.ratio);
const dups = j.resultados.filter((r) => r.dedup === "done").map((r) => ({ titulo_en: r.titulo_en, slug: r.dedup_slug }));
fs.writeFileSync(path.join(DIR, "last_report.json"), JSON.stringify({ generated: TODAY, fresh, dups }, null, 2));
