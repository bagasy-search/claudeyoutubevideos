// varcheck.mjs — FORCING FUNCTION de variedad de componentes (doc-broll-video).
// Razón de existir: históricamente ~85% de cada video terminaba siendo 5 formatos
// (foto full-screen + headline + quote + stat + diagram) y el resto del kit quedaba
// sin usar. Este script FRENA (exit 1) si la variedad es baja → hay que rebalancear
// el beatsheet ANTES de generar/renderizar. Correr SIEMPRE después de build + beatsheet:
//   node scripts/varcheck.mjs <slug>
import fs from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/varcheck.mjs <slug>"); process.exit(1); }
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const beats = bs.beats || [];
const tot = beats.length;

// clasificar
const kindOf = (b) => {
  if (b.kind !== "raw") return b.kind;
  if (b.src?.startsWith("real/")) return "raw_real";
  if (b.src?.startsWith("broll/")) return "raw_stock";
  if (b.src?.includes("vid/")) return "raw_clip";
  return "raw_gen";
};
const count = {};
for (const b of beats) { const k = kindOf(b); count[k] = (count[k] || 0) + 1; }

const rawShare = ((count.raw_real || 0) + (count.raw_gen || 0) + (count.raw_stock || 0) + (count.raw_clip || 0)) / tot;
// grupo "estructurado" = los formatos que SIEMPRE se subusan
const STRUCT = ["bars", "vs", "cross", "process", "journey", "infzoom", "annotated", "callout", "checklist", "splitlist", "aged",
  "perox", "bigstat", "statgrid", "bulletlist", "numberedsteps", "timeline", "comparetwo", "barchart", "rankingbars", "donutstat",
  "partsdiagram", "crosssection", "flowarrows", "cyclediagram", "mappin", "annotatedphoto", "quotecard", "equation", "ingredientscard",
  "costtally", "gaugemeter", "stampreveal", "labelcallout", "splitpanel", "processgrid", "closingcard",
  "pxbottle", "pxsoil", "pxseed", "pxrescue", "pxmildew", "pxsun", "pxdose", "pxfizz", "pxamber", "pxgnats",
  "pxwater", "pxcost", "pxforge", "pxdrown", "pxmyth", "pxseven"];
const structKinds = STRUCT.filter((k) => count[k] > 0);
const structCount = STRUCT.reduce((a, k) => a + (count[k] || 0), 0);
const nonRawDistinct = Object.keys(count).filter((k) => !k.startsWith("raw")).length;

// ── umbrales (la regla dura) ────────────────────────────────────────────────
// Modo TUTORIAL (videos how-to con literalidad de imagen por micro-acción, estilo
// competidor): el tope de fotos sube a 65% PORQUE las muchas imágenes literales son
// intencionales y suben comprensión. Se mantienen TODOS los demás guards de variedad
// para que no sea spam perezoso. Activar con `"tutorial": true` en el beatsheet.
const TUTORIAL = !!bs.tutorial || process.env.VARCHECK_TUTORIAL === "1";
// CLIPS-FIRST (documental/tutorial de cientos de clips reales, estilo barcos/huron/
// peroxide): el footage real ES la espina dorsal → el tope de raw% NO aplica (sería
// contraproducente: el usuario PIDE cientos de clips). Pero TODOS los guards de
// anti-monotonía siguen DUROS (≥11 tipos, ≥6 formatos estructurados, bars≥2) y el
// peso de estructurados se relaja a ≥6% (no pueden ser 1-2 migajas, pero tampoco 12%
// en un video que es 80% video real). Activar con `"clipsfirst": true` en el beatsheet.
const CLIPSFIRST = !!bs.clipsfirst || process.env.VARCHECK_CLIPSFIRST === "1";
const RAW_CAP = TUTORIAL ? 0.65 : 0.55;
const STRUCT_MIN = CLIPSFIRST ? 0.06 : 0.12;
const RULES = [
  { ok: CLIPSFIRST || rawShare <= RAW_CAP, msg: `fotos/clips full-screen = ${(rawShare * 100).toFixed(0)}% (debe ser ≤${(RAW_CAP * 100).toFixed(0)}%${TUTORIAL ? " · modo tutorial" : ""})` },
  { ok: nonRawDistinct >= 11, msg: `tipos NO-raw distintos = ${nonRawDistinct} (debe ser ≥11 — usá más del catálogo)` },
  { ok: structKinds.length >= 6, msg: `formatos estructurados presentes = ${structKinds.length}/${STRUCT.length} [${structKinds.join(",")}] (≥6; faltan: ${STRUCT.filter(k=>!count[k]).join(",")})` },
  { ok: structCount / tot >= STRUCT_MIN, msg: `peso de estructurados = ${(100 * structCount / tot).toFixed(0)}% (≥${(STRUCT_MIN*100).toFixed(0)}% — bars/cross/process/journey/etc. no pueden ser migajas)` },
  { ok: ((count.bars || 0) + (count.vs || 0)) >= 2 && (count.checklist || 0) >= 1, msg: `bars+vs=${(count.bars||0)+(count.vs||0)} (≥2), checklist=${count.checklist||0} (≥1)` },
];
if (CLIPSFIRST) console.log("(modo CLIPS-FIRST: tope de raw% desactivado; variedad de componentes SÍ exigida)");

console.log(`\n=== variedad de componentes: ${slug} (${tot} beats) ===`);
for (const [k, v] of Object.entries(count).sort((a, b) => b[1] - a[1]))
  console.log(String(v).padStart(3), (100 * v / tot).toFixed(0).padStart(3) + "%", k);

const fails = RULES.filter((r) => !r.ok);
console.log("");
if (fails.length === 0) {
  console.log("✅ variedad OK — pasa el gate.");
} else {
  console.error("❌ VARIEDAD INSUFICIENTE — rebalanceá el beatsheet antes de renderizar:");
  for (const f of fails) console.error("  · " + f.msg);
  console.error("\nIdea: por cada CIFRA→stat/bars, LUGAR→journey/map, CRONOLOGÍA→timeline/journey,");
  console.error("COMPARACIÓN→bars/cross/splitlist, PROCESO→process/checklist, FOTO con partes→annotated/callout.");
  process.exit(1);
}
