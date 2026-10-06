// verify_clips.mjs — PASE DE VERIFICACIÓN con ojo de editor (visión-LLM) para el matcheo.
//
// El problema que resuelve: el `_text` de matchclip usa CLIP, y CLIP NO LEE TEXTO
// (un slide entero en inglés puntúa _text=0). Y CLIP tampoco distingue "esto es
// Antikythera" de "esto es un engranaje cualquiera". Resultado: pasan slides de
// infografía, talking-heads, dibujitos, ads, deportes.
//
// Este pase automatiza LA revisión de contact-sheets a mano: por cada clip matcheado
// extrae un frame, los agrupa en sheets, y `claude` (visión) da un veredicto cruzando
// el CONCEPTO del beat vs lo que REALMENTE se ve. Marca keep/reject + razón, y si
// rechaza sugiere una query mejor para re-matchear ESE slot.
//
//   node verify_clips.mjs <slug> [--dir public/broll] [--batch 12] [--model haiku|sonnet]
// Lee:   public/broll/match_<slug>.json (name→concept) + los <name>.mp4 del dir
// Sale:  public/broll/verdicts_<slug>.json  [{name,keep,has_text,on_topic,reason,requery}]
//        imprime resumen + lista de cull sugerida.
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node verify_clips.mjs <slug> [--dir ...] [--batch N] [--model haiku|sonnet]"); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DIR = arg("--dir", "public/broll");
const BATCH = +arg("--batch", 12);
const MODEL = arg("--model", "haiku") === "sonnet" ? "claude-sonnet-5" : "claude-haiku-4-5-20251001";

// name → concepto del beat (lo que se DEBE ver). Fallback: el nombre.
const concepts = {};
try {
  for (const r of JSON.parse(fs.readFileSync(`public/broll/match_${slug}.json`, "utf8")))
    concepts[r.name] = r.concept || (Array.isArray(r.query) ? r.query[0] : r.query) || "";
} catch { console.error("⚠ no pude leer match_" + slug + ".json (sin conceptos, verifico solo calidad)"); }

const clips = fs.readdirSync(DIR).filter((f) => /^w\d+\.mp4$/.test(f)).map((f) => f.replace(".mp4", ""))
  .sort((a, b) => +a.slice(1) - +b.slice(1));
if (!clips.length) { console.error("sin clips en", DIR); process.exit(1); }
console.log(`verificando ${clips.length} clips · lotes de ${BATCH} · modelo ${MODEL}`);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "verify_"));
const ff = (args) => { try { execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args], { timeout: 60000 }); return true; } catch { return false; } };

// 1 frame representativo (mitad del clip) etiquetado con el nombre
function thumb(name, idx) {
  const src = path.join(DIR, name + ".mp4");
  const out = path.join(TMP, String(idx).padStart(3, "0") + ".jpg");
  ff(["-ss", "1", "-i", src, "-frames:v", "1",
    "-vf", `scale=400:225:force_original_aspect_ratio=increase,crop=400:225,drawtext=text='${name}':x=6:y=6:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.7`,
    "-y", out]);
  return out;
}

const STRICT = process.argv.includes("--strict"); // modo watermark-cero
const STRICT_RULE = `MODO ESTRICTO — WATERMARK CERO. Rechazá (keep:false, text:true) CUALQUIER marca EDITORIAL añadida por el que editó el video fuente, por mínima que sea: logo/marca de agua de canal (aunque esté en una esquina y sea chica), subtítulos quemados, lower-thirds, chyrons, texto de infografía, gráficos/anotaciones sobreimpresos, "4K"/branding.
⚠ PERO NO confundas eso con TEXTO QUE ES PARTE FÍSICA DE LA ESCENA REAL — eso se ACEPTA (keep:true): inscripciones/jeroglíficos tallados en el artefacto, letras grabadas en el objeto, un cartel/placa de museo que está físicamente en la toma, escritura en una tablilla antigua. Ese texto ES el metraje documental del artefacto, no un overlay. La pregunta clave: ¿el texto lo agregó el EDITOR encima (rechazar) o estaba EN EL MUNDO filmado (aceptar)?
⚠ EN MODO ESTRICTO SOLO evaluás WATERMARKS/OVERLAYS editoriales. NO re-juzgues si el clip "matchea" el concepto: si NO hay marca editorial, keep:true aunque el encuadre no sea perfecto. La relevancia no es asunto de este pase.`;

const SYS = `Sos editor de un documental de misterio/arqueología (canal español "Crónicas Perdidas"). Te paso un CONTACT-SHEET con varios clips de b-roll etiquetados (w001, w002...) y, por cada uno, el CONCEPTO que ese momento del guion necesita mostrar. Juzgá con criterio de editor profesional.
${STRICT ? STRICT_RULE + "\n" : ""}
Por CADA clip devolvé un veredicto. RECHAZÁ (keep:false) si:
- Tiene TEXTO quemado en pantalla: slides de infografía, subtítulos, títulos, chyrons de noticiero, marcas de agua grandes, listas de bullets (¡CLIP no detecta esto, vos SÍ!).
- Es contenido AJENO al tema: deportes, autos, publicidades, dibujitos/cartoons, videojuegos, gente hablando a cámara (talking heads/vloggers), aulas, gráficos de bolsa, capturas de software.
- NO muestra el concepto pedido (off-topic respecto al guion).
ACEPTÁ (keep:true) el metraje real y limpio que muestra el concepto: objetos de museo, ruinas, excavaciones, primeros planos, aéreas, laboratorio real, reconstrucciones cinematográficas SIN texto.
Si rechazás por off-topic, sugerí en "requery" una query en INGLÉS (2-4 palabras) concreta y filmable para re-buscar ESE slot.
Si hay texto, indicá en "loc" DÓNDE está: "bottom" (franja/subtítulo inferior), "top" (encabezado), "corner" (esquina/watermark), "full" (slide/infografía que ocupa toda la pantalla), "none" (sin texto). Esto define si el clip se puede SALVAR recortando (band=bottom/top/corner) o no (full).
Devolvé SOLO JSON (sin markdown): {"v":[{"n":"w001","keep":true,"text":false,"topic":true,"loc":"none","why":"...","requery":""}, ...]} un item por clip del sheet.`;

function askSheet(sheetPath, items) {
  const list = items.map((it) => `${it.name}: "${(concepts[it.name] || "?").slice(0, 90)}"`).join("\n");
  const user = `CONTACT-SHEET: ${sheetPath}\n\nConcepto que cada clip debe mostrar:\n${list}\n\nJuzgá cada uno.`;
  for (let a = 0; a < 3; a++) {
    try {
      const out = execFileSync("claude", ["-p", user, "--model", MODEL, "--append-system-prompt", SYS,
        "--output-format", "json", "--dangerously-skip-permissions"],
        { cwd: TMP, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 300000 });
      let txt = (JSON.parse(out).result || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
      const m = txt.match(/\{[\s\S]*\}/);
      return JSON.parse(m ? m[0] : txt).v || [];
    } catch (e) { if (a === 2) { console.error("  batch falló:", (e.message || "").slice(0, 120)); return []; } }
  }
  return [];
}

const verdicts = [];
for (let b = 0; b < clips.length; b += BATCH) {
  const group = clips.slice(b, b + BATCH).map((name, j) => ({ name, idx: b + j }));
  group.forEach((g) => (g.thumb = thumb(g.name, g.idx)));
  // tile del lote a un solo sheet (cols dinámicas)
  const cols = Math.min(4, group.length), rows = Math.ceil(group.length / cols);
  const sheet = path.join(TMP, `sheet_${b}.jpg`);
  ff(["-framerate", "1", "-start_number", String(b), "-i", path.join(TMP, "%03d.jpg"),
    "-frames:v", "1", "-vf", `tile=${cols}x${rows}:padding=4:color=white`, "-y", sheet]);
  const v = askSheet(sheet, group);
  const byN = {}; for (const x of v) byN[x.n] = x;
  for (const g of group) {
    const x = byN[g.name] || {};
    const keep = x.keep !== false && x.text !== true;
    verdicts.push({ name: g.name, keep, has_text: !!x.text, on_topic: x.topic !== false, loc: x.loc || (x.text ? "full" : "none"), reason: x.why || "(sin veredicto)", requery: x.requery || "" });
  }
  const kept = group.filter((g) => (byN[g.name] || {}).keep !== false && (byN[g.name] || {}).text !== true).length;
  console.log(`  lote ${b}-${b + group.length - 1}: ${kept}/${group.length} keep`);
}

fs.rmSync(TMP, { recursive: true, force: true });
const outP = `public/broll/verdicts_${slug}.json`;
fs.writeFileSync(outP, JSON.stringify(verdicts, null, 1));
const cull = verdicts.filter((v) => !v.keep);
console.log(`\n✅ ${outP}: ${verdicts.length} juzgados · ${verdicts.length - cull.length} keep · ${cull.length} reject`);
console.log("REJECT (cull sugerido):");
for (const c of cull) console.log(`  ✗ ${c.name} ${c.has_text ? "[TEXTO]" : c.on_topic ? "" : "[OFF-TOPIC]"} — ${c.reason}${c.requery ? ` → requery: "${c.requery}"` : ""}`);
