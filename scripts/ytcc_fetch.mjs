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
// ⛔⛔ ELEGIR LA FUENTE POR BÚSQUEDA ES UN DADO (medido 21-sep-2026 en tdcfreno): de 10 consultas con
//    títulos impecables, 6 fuentes resultaron inservibles al mirarlas — una era un salvapantallas de
//    vapor blanco donde se pedía humo negro, otra una caldera Beckett donde se pedía fundición al
//    rojo, dos traían marca de agua VIVAVIDEO y una subtítulos quemados. Nada de eso está en el
//    título, y `search` no devuelve el mismo orden dos veces. Por eso una consulta puede ser
//    `id:VIDEOID`: una fuente que ya se miró y sirve queda CLAVADA y una re-corrida no vuelve a tirar
//    el dado. El crédito CC-BY sale igual, pidiendo el título por la API de videos.
const porId = async (id) => {
  for (const key of KEYS) {
    const u = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${key}`;
    let j; try { j = await fetchR(u); } catch { continue; }
    if (j.error || !j.items?.length) continue;
    const s = j.items[0].snippet;
    return [{ id, titulo: s.title, canal: s.channelTitle }];
  }
  return [{ id, titulo: `(sin título: ${id})`, canal: "(sin canal)" }];
};

const buscar = async (q) => {
  const pin = q.match(/^id:([A-Za-z0-9_-]{11})$/);
  if (pin) return porId(pin[1]);
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
  // ⛔ UNA FUENTE NO SIEMPRE ALCANZA (medido en tdcdesmal: una de 39 s para 80 s pedidos, y ahí se
  //    perdían 5 de 9 planos). Se baja de a una y se sigue bajando MIENTRAS falte material, hasta 3
  //    fuentes por consulta. Más variedad de fuentes además evita que media sección salga del mismo
  //    plano fijo, que se lee como repetición.
  const necesita = planos.reduce((a, p) => a + Math.max(MIN_SEG, p.durSec || MIN_SEG) + 6, 3);
  const fuentes = [];
  let disponible = 0;
  for (const c of cands) {
    if (disponible >= necesita || fuentes.length >= 3) break;
    const f = bajarFuente(c.id);
    if (!f) continue;
    const d = dur(f);
    if (d < 20) { console.log(`  fuente ${c.id} dura ${d.toFixed(0)} s: muy corta, sigo`); continue; }
    fuentes.push({ f, c, total: d, t: 3 });
    disponible += d - 6;
    creditos.push({ query: q, id: c.id, titulo: c.titulo, canal: c.canal, url: `https://youtu.be/${c.id}`, licencia: "CC BY" });
  }
  if (!fuentes.length) { planos.forEach((p) => fallidos.push(p.name)); continue; }
  console.log(`  ${fuentes.length} fuente(s) · ${disponible.toFixed(0)} s disponibles para ${necesita.toFixed(0)} s pedidos`);
  let i = 0;
  for (const p of planos) {
    // ⛔ UN CLIP QUE YA ESTÁ EN DISCO NO SE VUELVE A CORTAR. No es sólo ahorro: los cortes salen de un
    //    cursor que avanza por la lista, así que si cambia la cantidad de planos de la consulta, TODOS
    //    los offsets se corren y el material deja de ser el que se auditó. Medido en tdcfreno: sacar
    //    los clips con caras ajenas y re-correr la fase devolvía OTROS tramos del mismo video, y la
    //    auditoría anterior ya no valía para ninguno. Con esto, auditar y sacar converge en vez de
    //    volver a tirar el dado en cada vuelta.
    const yaEsta = path.join(OUT, `${p.name}.mp4`);
    if (fs.existsSync(yaEsta) && fs.statSync(yaEsta).size > 50_000) {
      hechos.push({ name: p.name, fuente: "(ya estaba)", desde: -1, dur: Math.max(MIN_SEG, p.durSec || MIN_SEG) });
      continue;
    }
    const d = Math.max(MIN_SEG, p.durSec || MIN_SEG);
    // busca la próxima fuente con lugar, rotando: reparte los planos entre fuentes en vez de agotar una
    let puesto = false;
    for (let k = 0; k < fuentes.length && !puesto; k++) {
      const F = fuentes[(i + k) % fuentes.length];
      if (F.t + d + 2 > F.total) continue;
      const dst = path.join(OUT, `${p.name}.mp4`);
      execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", F.t.toFixed(2), "-i", F.f, "-t", d.toFixed(2),
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1",
        "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", dst], { timeout: 300_000 });
      hechos.push({ name: p.name, fuente: F.c.id, desde: +F.t.toFixed(2), dur: +d.toFixed(2) });
      F.t += d + 6;   // dos cortes pegados del mismo tramo se leen como repetición
      i = (i + k + 1) % fuentes.length;
      puesto = true;
    }
    if (!puesto) fallidos.push(p.name);
  }
}
fs.writeFileSync(path.join(OUT, "_ytcc_creditos.json"), JSON.stringify(creditos, null, 1));
fs.writeFileSync(path.join(OUT, "_ytcc_hechos.json"), JSON.stringify(hechos, null, 1));
console.log(`\nGATE ytcc: pedidos=${items.length} · bajados=${hechos.length} · sin material=${fallidos.length} · fuentes=${creditos.length}`);
if (fallidos.length) console.log(`  sin material: ${fallidos.slice(0, 12).join(", ")}`);
console.log(`⚠️ FALTA AUDITAR a ojo/por visión: marca de agua, subtítulos quemados, blanco y negro, caras ajenas.`);
console.log(`   créditos CC-BY para la descripción: ${path.join(OUT, "_ytcc_creditos.json")}`);
if (!hechos.length) process.exit(2);
