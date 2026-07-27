// stock_retry_vucm3bvd4u3k.mjs — segunda pasada de Pexels, THROTTLEADA.
//
// Contexto: la primera pasada agotó la cuota horaria del tier free (429 duro) y
// bajó sólo 11 de 139. Este script espera a que se abra la ventana y después pide
// DESPACIO (1 request cada ~1,3 s, sin concurrencia), con queries CORTAS — Pexels
// indexa mal las frases largas: "extreme macro of an old frayed electrical cable"
// no matchea nada y "frayed cable" sí.
//
//   node scripts/stock_retry_vucm3bvd4u3k.mjs [objetivoClips=70] [maxMin=25]
import fs from "fs";
import path from "path";

try {
  for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }

const SLUG = "vucm3bvd4u3k";
const OUT = `public/broll/${SLUG}`;
const META = 3;
const OBJ = +(process.argv[2] || 70);
const MAXMS = +(process.argv[3] || 25) * 60000;
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T0 = Date.now();

/* ── queries CORTAS: 2-3 palabras de contenido sacadas del desc en inglés ────── */
const STOP = new Set(("a an the of in on at to for with and or from into over under his her its their "
  + "extreme macro closeup close up shot overhead wide medium slow motion camera view angle "
  + "amateur phone photo real footage handheld静").split(/\s+/));
function shortQueries(desc, esQueries) {
  const words = String(desc || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  const qs = [];
  if (words.length >= 2) qs.push(words.slice(0, 2).join(" "));
  if (words.length >= 3) qs.push(words.slice(0, 3).join(" "));
  if (words.length >= 4) qs.push(words.slice(1, 3).join(" "));
  if (words.length) qs.push(words[0]);
  return [...new Set(qs)].slice(0, 4);
}

/* ── Pexels con espera de ventana ───────────────────────────────────────────── */
let esperas = 0;
async function pexels(q) {
  for (let intento = 0; intento < 8; intento++) {
    if (Date.now() - T0 > MAXMS) return "timeout";
    const u = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=8&orientation=landscape&size=medium`;
    const r = await fetch(u, { headers: { Authorization: KEY }, signal: AbortSignal.timeout(25000) }).catch(() => null);
    if (r && r.ok) return r.json();
    if (r && r.status === 429) {
      esperas++;
      const w = Math.min(90, 20 + intento * 15);
      process.stdout.write(`\r  · 429, esperando ${w}s que se abra la ventana (espera nº ${esperas})            `);
      await sleep(w * 1000);
      continue;
    }
    await sleep(3000);
  }
  return null;
}

const usadosPath = `_v3/${SLUG}_stock_used.json`;
const usados = new Set(fs.existsSync(usadosPath) ? JSON.parse(fs.readFileSync(usadosPath, "utf8")) : []);

async function bajar(url, dest) {
  const r = await fetch(url, { signal: AbortSignal.timeout(120000) }).catch(() => null);
  if (!r || !r.ok) return false;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 60000) return false;
  fs.writeFileSync(dest, buf);
  return true;
}

/* ── main ───────────────────────────────────────────────────────────────────── */
const pend = JSON.parse(fs.readFileSync(`_v3/${SLUG}_sinstock.json`, "utf8"))
  .filter((b) => !fs.existsSync(path.join(OUT, `${b.name}.mp4`)));
const yaHay = () => fs.readdirSync(OUT).filter((f) => /\.mp4$/i.test(f)).length;

console.log(`reintento Pexels · ${pend.length} pendientes · ya hay ${yaHay()} clips · objetivo ${OBJ} · tope ${MAXMS / 60000} min`);

let ok = 0, sin = 0;
for (const b of pend) {
  if (yaHay() >= OBJ) { console.log(`\n  objetivo alcanzado (${yaHay()} clips)`); break; }
  if (Date.now() - T0 > MAXMS) { console.log(`\n  tope de tiempo alcanzado`); break; }
  let hecho = false;
  for (const q of shortQueries(b.concept, b.queries)) {
    const j = await pexels(q);
    if (j === "timeout") { hecho = false; break; }
    await sleep(1300);
    if (!j || !j.videos || !j.videos.length) continue;
    for (const v of j.videos) {
      if (usados.has(String(v.id))) continue;
      const files = (v.video_files || [])
        .filter((f) => f.width >= 1280 && f.height >= 700 && /mp4/i.test(f.file_type || "mp4"))
        .sort((x, y) => Math.abs(1920 - x.width) - Math.abs(1920 - y.width));
      if (!files.length) continue;
      if (await bajar(files[0].link, path.join(OUT, `${b.name}.mp4`))) {
        usados.add(String(v.id));
        ok++; hecho = true;
        console.log(`  ↓ ${b.name}.mp4  ("${q}")  ${files[0].width}x${files[0].height}`);
        break;
      }
    }
    if (hecho) break;
  }
  if (!hecho) { sin++; }
}

fs.writeFileSync(usadosPath, JSON.stringify([...usados], null, 1));
const restantes = pend.filter((b) => !fs.existsSync(path.join(OUT, `${b.name}.mp4`)));
fs.writeFileSync(`_v3/${SLUG}_sinstock2.json`, JSON.stringify(restantes, null, 1));
console.log(`\n=== reintento: +${ok} clips · ${sin} sin resultado · TOTAL ${yaHay()} clips en ${OUT}/ ===`);
console.log(`   quedan ${restantes.length} beats para imagen generada → _v3/${SLUG}_sinstock2.json`);
