// check_props.mjs — COMPUERTA DE CONTRATOS DE COMPONENTES (video-pipeline).
//   node scripts/check_props.mjs <slug> [Main_path]
//
// Por que existe: un beat con la forma equivocada rompe de TRES maneras y solo una avisa fuerte.
//   1) prop REQUERIDA faltante -> `undefined was passed to staticFile()` y el chunk MUERE.
//      (Medido en grcoffee: `blurexplainer` pide clip Y image; con solo image se cayeron 6 de 60
//       chunks del farm despues de 20 min de render.)
//   2) prop con la forma equivocada que NO crashea -> el componente sale VACIO con el chunk EN VERDE.
//   3) la prop existe en el beat pero el Main NO LA REENVIA -> se usa el DEFAULT, que suele ser
//      texto de OTRO video ("Guardá esto" en voseo, "Rosemary + a glass of water").
//
// Chequea las tres, mas que toda ruta de asset citada exista EN DISCO.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/check_props.mjs <slug> [Main_path]"); process.exit(1); }

const mainCand = [
  process.argv[3],
  `src/_fed6/VideoEdit/Main_${slug}.tsx`,
  `src/VideoEdit/Main_${slug}.tsx`,
  `src/valeria/Main_${slug}.tsx`,
  `src/peroxide/Main_${slug}.tsx`,
].filter(Boolean);
const mainPath = mainCand.find((p) => existsSync(p));
if (!mainPath) { console.error(`✗ no encontre el Main de ${slug}`); process.exit(1); }

const beatsCand = [
  `src/_fed6/VideoEdit/${slug}_beats.ts`,
  `src/VideoEdit/cues_${slug}.gen.tsx`,
  `beatsheet/${slug}.json`,
];
const beatsPath = beatsCand.find((p) => existsSync(p));
if (!beatsPath) { console.error(`✗ no encontre los beats de ${slug}`); process.exit(1); }

const beatsSrc = readFileSync(beatsPath, "utf8");
const m = beatsSrc.match(/[A-Z_]+_BEATS[^=]*=\s*(\[[\s\S]*?\]);/) || beatsSrc.match(/"beats":\s*(\[[\s\S]*\])\s*\}/);
if (!m) { console.error("✗ no pude parsear los beats"); process.exit(1); }
const beats = JSON.parse(m[1]);
const mainSrc = readFileSync(mainPath, "utf8");

// ── firmas REALES de los componentes del kit ─────────────────────────────────
// ⚠ El MISMO nombre de componente existe en mas de un kit con firmas DISTINTAS
// (src/VideoEdit/scenes/AvatarPizarra.tsx pide `clip`; la de _fed6 no). Si se recorren todos los
// directorios, el ultimo pisa al primero y el validador inventa props que ese kit no pide.
// El kit que manda es el del MAIN: su carpeta va primera y NO se deja sobrescribir.
const dirDelMain = join(mainPath, "..", "scenes").replace(/\\/g, "/");
const SCENE_DIRS = [dirDelMain, "src/_fed6/VideoEdit/scenes", "src/VideoEdit/scenes"]
  .filter((d, i, a) => existsSync(d) && a.indexOf(d) === i);
const sigs = new Map();               // Componente -> {required:[], optional:[]}
for (const dir of SCENE_DIRS) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".tsx")) continue;
    const s = readFileSync(join(dir, f), "utf8");
    const g = s.match(/export const ([A-Z][A-Za-z0-9]*): React\.FC<\{([\s\S]*?)\}> =/);
    if (!g) continue;
    const req = [], opt = [];
    for (const line of g[2].split("\n")) {
      const p = line.match(/^\s*([a-zA-Z][A-Za-z0-9]*)(\??):/);
      if (!p) continue;
      if (p[1] === "durationInFrames") continue;
      (p[2] === "?" ? opt : req).push(p[1]);
    }
    if (!sigs.has(g[1])) sigs.set(g[1], { required: req, optional: opt });  // el kit del Main gana
  }
}

// ── kind del beat -> Componente + props que el MAIN reenvia ──────────────────
const kindToComp = new Map();
const forwarded = new Map();   // prop reenviada TAL CUAL desde el beat: prop={b.prop}
const garantizada = new Map(); // prop que el Main SIEMPRE resuelve y nunca puede quedar undefined:
                               //   avatar={b.clip || "x_opt.mp4"} · objectPos="50% 26%"
for (const mm of mainSrc.matchAll(/b\.kind === "([a-z0-9_]+)"\s*\?\s*<([A-Z][A-Za-z0-9]*)([^>]*)>/g)) {
  kindToComp.set(mm[1], mm[2]);
  const attrs = mm[3];
  forwarded.set(mm[1], new Set([...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)=\{b\.([a-zA-Z][A-Za-z0-9]*)\}/g)].map((x) => x[1])));
  garantizada.set(mm[1], new Set([
    ...[...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)=\{[^}]*\|\|[^}]*\}/g)].map((x) => x[1]),   // con fallback
    ...[...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)="[^"]*"/g)].map((x) => x[1]),               // literal
  ]));
}

// ⛔ PUNTO CIEGO QUE COSTO 6 CHUNKS: los kinds que el Main NO tiene en su cadena de ternarios los
// resuelve `renderFederer2Comp` / `renderFedererComp` con un switch en FedererComponents*.tsx.
// Mirando solo el Main, `blurexplainer` (que pide clip Y image) nunca se validaba — y ese fue
// exactamente el que rompio el render. Se parsean tambien esos `case`.
for (const f of ["src/_fed6/VideoEdit/FedererComponents.tsx", "src/_fed6/VideoEdit/FedererComponents2.tsx",
                 "src/VideoEdit/FedererComponents.tsx"]) {
  if (!existsSync(f)) continue;
  const s = readFileSync(f, "utf8");
  for (const cm of s.matchAll(/case "([a-z0-9_]+)":\s*\n?\s*return\s*\(?\s*<([A-Z][A-Za-z0-9]*)([\s\S]*?)\/>/g)) {
    if (kindToComp.has(cm[1])) continue;            // el Main manda si ya lo mapea
    kindToComp.set(cm[1], cm[2]);
    const attrs = cm[3];
    forwarded.set(cm[1], new Set([...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)=\{(?:sf\()?beat\.([a-zA-Z][A-Za-z0-9]*)/g)].map((x) => x[1])));
    garantizada.set(cm[1], new Set([
      ...[...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)=\{[^}]*\|\|[^}]*\}/g)].map((x) => x[1]),
      ...[...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)="[^"]*"/g)].map((x) => x[1]),
      ...[...attrs.matchAll(/([a-zA-Z][A-Za-z0-9]*)=\{\(beat\.[a-zA-Z]+ \|\| \[\]\)/g)].map((x) => x[1]),
    ]));
  }
}

const problemas = [];
const assetRe = /^(img|broll|vid|real|assets)\//;
const vistos = new Set();

for (const b of beats) {
  if (!b || !b.kind || b.kind === "raw") continue;
  const comp = kindToComp.get(b.kind);
  if (!comp) continue;                       // lo resuelve renderFederer2Comp (contrato aparte)
  const sig = sigs.get(comp);
  if (!sig) continue;
  const key = `${b.kind}`;
  if (!vistos.has(key)) {
    vistos.add(key);
    for (const r of sig.required) {
      // el Main la resuelve solo (fallback o literal) → el beat no tiene por qué traerla
      if ((garantizada.get(b.kind) || new Set()).has(r)) continue;
      if (b[r] === undefined)
        problemas.push(`⛔ ${b.kind} (${comp}) · falta la prop REQUERIDA "${r}" → staticFile(undefined) o render vacío`);
      else if (!(forwarded.get(b.kind) || new Set()).has(r))
        problemas.push(`⛔ ${b.kind} (${comp}) · el beat trae "${r}" pero el MAIN NO LA REENVÍA → se usa el default de otro video`);
    }
  }
  // toda ruta de asset citada tiene que existir en disco
  for (const [k, v] of Object.entries(b)) {
    if (typeof v === "string" && assetRe.test(v) && !existsSync("public/" + v))
      problemas.push(`⛔ ${b.kind}.${k} → public/${v} NO existe en disco`);
    if (Array.isArray(v)) for (const it of v) if (it && typeof it === "object")
      for (const [k2, v2] of Object.entries(it))
        if (typeof v2 === "string" && assetRe.test(v2) && !existsSync("public/" + v2))
          problemas.push(`⛔ ${b.kind}.${k}[].${k2} → public/${v2} NO existe en disco`);
  }
}

const uso = new Map();
for (const b of beats) if (b && b.kind && b.kind !== "raw") uso.set(b.kind, (uso.get(b.kind) || 0) + 1);
console.log(`── CONTRATOS · ${slug} · ${beats.length} beats · ${uso.size} kinds de componente`);
console.log(`   Main: ${mainPath}`);
const uniq = [...new Set(problemas)];
if (!uniq.length) { console.log("✅ contratos OK — cada componente recibe sus props requeridas y todos los assets existen"); process.exit(0); }
for (const p of uniq) console.log("  " + p);
console.log(`\n⛔ ${uniq.length} problema(s) — arreglalos ANTES de farmear (cada uno es un chunk muerto o un cartel en blanco).`);
process.exit(1);
