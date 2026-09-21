// ytcc_fetch.mjs — METRAJE REAL GRATIS desde YouTube con licencia CREATIVE COMMONS.
//
//   node scripts/ytcc_fetch.mjs <lista.json> <outDir> [--min-seg 2.5]
//   lista = [{ "name": "p012", "query": "waste oil drip burner", "durSec": 4.2 }, ...]
//
// Por qué existe: en taller/metal Pexels no tiene nada y devuelve genéricos off-topic, que el creador
// rechaza con razón (un stock que no es del tema es PEOR que la imagen IA). YouTube CC sí tiene el
// material exacto — quemadores de aceite usado, despiece de cadena, hacks de desmalezadora — y es
// gratis. Medido 21-sep-2026: 5 CC on-topic por consulta en los tres temas del canal.
//
// ⭐ LA DECISIÓN DE DISEÑO: bajar UN TRAMO LARGO POR FUENTE y cortar muchos planos de ahí.
//    Bajar clip por clip tarda ~3 min CADA UNO (YouTube estrangula la descarga, no es el tamaño):
//    30 planos = 90 min. Con una fuente de 4 min por consulta se baja una vez y se cortan todos los
//    planos de esa consulta en segundos.
//
// ⛔ Lo que NO hace y hay que hacer aparte: auditar los cuadros (marca de agua, subtítulos quemados,
//    blanco y negro, CARAS de gente ajena) con `vision_haygente.mjs`/`imgaudit_vision.mjs`, y poner
//    los créditos CC-BY en la descripción — sale en `<outDir>/_ytcc_creditos.json`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [LISTA, OUT] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const MIN_SEG = Number((process.argv.find((a) => a.startsWith("--min-seg=")) || "").split("=")[1] || 2.5);
if (!LISTA || !OUT) { console.error("uso: node scripts/ytcc_fetch.mjs <lista.json> <outDir>"); process.exit(1); }
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => /^[A-Z_0-9]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = ["YT_API_KEY", "YT_API_KEY2", "YT_API_KEY3", "YT_API_KEY4"].map((k) => env[k]).filter(Boolean);
if (!KEYS.length) { console.error("faltan YT_API_KEY* en .env"); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const items = JSON.parse(fs.readFileSync(LISTA, "utf8"));
const CACHE = path.join(OUT, "_ytcc_fuentes");
fs.mkdirSync(CACHE, { recursive: true });

// la API de YouTube corta conexiones de a ratos (ECONNABORTED): sin reintento, una consulta perdida
// se lleva puestos todos los planos de ese tema.
const fetchR = async (u, intentos = 3) => {
  for (let i = 1; i <= intentos; i++) {
    try { return await (await fetch(u, { signal: AbortSignal.timeout(20_000) })).json(); }
    catch (e) { if (i === intentos) throw e; await new Promise((r) => setTimeout(r, 1500 * i)); }
  }
};
const buscar = async (q) => {
  for (const key of KEYS) {
    const u = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoLicense=creativeCommon&videoEmbeddable=true&maxResults=8&q=${encodeURIComponent(q)}&key=${key}`;
    let j; try { j = await fetchR(u); } catch (e) { console.log(`  (red: ${String(e.message).slice(0, 40)})`); continue; }
    if (j.error) { console.log(`  (clave agotada o error: ${j.error.message.slice(0, 50)})`); continue; }
    return (j.items || []).map((it) => ({ id: it.id.videoId, titulo: it.snippet.title, canal: it.snippet.channelTitle }));
  }
  return [];
};

// Un tramo del MEDIO: el arranque de un video de YouTube es intro/careta y el final es despedida.
const bajarFuente = (id, seg = 240) => {
  const dst = path.join(CACHE, `${id}.mp4`);
  if (fs.existsSync(dst) && fs.statSync(dst).size > 200_000) return dst;
  try {
    execFileSync("yt-dlp", ["--quiet", "--no-warnings", "-N", "8", "-f", "bv*[height<=1080][ext=mp4]/bv*[height<=1080]/b",
      "--download-sections", `*60-${60 + seg}`, "-o", dst, `https://www.youtube.com/watch?v=${id}`],
      { stdio: ["ignore", "pipe", "pipe"], timeout: 12 * 60_000 });
  } catch (e) { console.log(`  ⛔ no se pudo bajar ${id}: ${String(e.stderr || e.message).slice(0, 80)}`); return null; }
  return fs.existsSync(dst) ? dst : null;
};

const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim());

const porQuery = new Map();
for (const it of items) { if (!porQuery.has(it.query)) porQuery.set(it.query, []); porQuery.get(it.query).push(it); }
const creditos = [], hechos = [], fallidos = [];
let cursor = new Map();   // por fuente: desde qué segundo cortar el próximo plano (nunca el mismo tramo dos veces)

for (const [q, planos] of porQuery) {
  console.log(`· "${q}" → ${planos.length} plano(s)`);
  const cands = await buscar(q);
  if (!cands.length) { console.log("  sin resultados CC"); planos.forEach((p) => fallidos.push(p.name)); continue; }
  let fuente = null, elegido = null;
  for (const c of cands) { const f = bajarFuente(c.id); if (f && dur(f) > 30) { fuente = f; elegido = c; break; } }
  if (!fuente) { planos.forEach((p) => fallidos.push(p.name)); continue; }
  creditos.push({ query: q, id: elegido.id, titulo: elegido.titulo, canal: elegido.canal, url: `https://youtu.be/${elegido.id}`, licencia: "CC BY" });
  const total = dur(fuente);
  let t = cursor.get(fuente) ?? 3;
  for (const p of planos) {
    const d = Math.max(MIN_SEG, p.durSec || MIN_SEG);
    if (t + d + 2 > total) { fallidos.push(p.name); continue; }
    const dst = path.join(OUT, `${p.name}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(2), "-i", fuente, "-t", d.toFixed(2),
      "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1",
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", dst], { timeout: 300_000 });
    hechos.push({ name: p.name, fuente: elegido.id, desde: +t.toFixed(2), dur: +d.toFixed(2) });
    t += d + 6;   // salto entre planos: dos cortes seguidos del mismo tramo se leen como repetición
  }
  cursor.set(fuente, t);
}
fs.writeFileSync(path.join(OUT, "_ytcc_creditos.json"), JSON.stringify(creditos, null, 1));
fs.writeFileSync(path.join(OUT, "_ytcc_hechos.json"), JSON.stringify(hechos, null, 1));
console.log(`\nGATE ytcc: pedidos=${items.length} · bajados=${hechos.length} · sin material=${fallidos.length} · fuentes=${creditos.length}`);
if (fallidos.length) console.log(`  sin material: ${fallidos.slice(0, 12).join(", ")}`);
console.log(`⚠️ FALTA AUDITAR a ojo/por visión: marca de agua, subtítulos quemados, blanco y negro, caras ajenas.`);
console.log(`   créditos CC-BY para la descripción: ${path.join(OUT, "_ytcc_creditos.json")}`);
if (!hechos.length) process.exit(2);
