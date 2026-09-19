// rksmart_propgate.mjs — CONTRATO DE CADA COMPONENTE, incluidos LOS CAMPOS DE LOS ELEMENTOS
// de sus arrays, que es justo lo que `check_props` deja pasar.
//   node _v3/rksmart_propgate.mjs
//
// La falla que caza es la QUINTA FAMILIA: el componente NO crashea ni sale vacío — dibuja la
// tarjeta, el eyebrow, el título y las viñetas, y adentro no hay nada, o peor, sale su DEFAULT
// (texto de otro video, o un slot de imagen con un placeholder). Pasa densidad, pasa el auditor de
// visión y pasa tsc (los beats son `any`). En fedguante fueron 17 láminas en blanco, ~145 s.
//
// Se valida contra la FIRMA REAL de cada .tsx de src/rksafe/, leída acá, no contra lo que yo creo.
// ⛔ CONTROL POSITIVO incluido (`--self`): la compuerta tiene que CAZAR tres fallas inyectadas.
import fs from "node:fs";
import { ITEMS } from "./rksmart_prompts.mjs";

const KIT = "src/rksafe";
const firmas = {};
for (const f of fs.readdirSync(KIT).filter((x) => x.endsWith(".tsx"))) {
  const n = f.replace(/\.tsx$/, "");
  const s = fs.readFileSync(`${KIT}/${f}`, "utf8");
  const m = s.match(new RegExp(`export const ${n}: React\\.FC<\\{([\\s\\S]*?)\\}>\\s*=`));
  if (!m) continue;
  const cuerpo = m[1];
  const props = {};
  // cada línea "nombre?: tipo;" del bloque de props de primer nivel
  for (const l of cuerpo.split("\n")) {
    const p = l.match(/^\s*(\w+)(\??):\s*(.+?);\s*(\/\/.*)?$/);
    if (!p) continue;
    // el array puede venir inline (`{ text: string }[]`) o por ALIAS local (`Piece[]`):
    // sin resolver el alias la compuerta dice "no es un array" sobre un array perfectamente válido
    // — un falso positivo que invita a "arreglar" lo que está bien.
    let tipo = p[3];
    const alias = tipo.match(/^(\w+)\[\]$/);
    if (alias) {
      const t = s.match(new RegExp(`type ${alias[1]}\\s*=\\s*\\{([\\s\\S]*?)\\};`));
      if (t) tipo = `{${t[1].replace(/\/\/[^\n]*/g, "")}}[]`;
    }
    const arr = tipo.match(/\{\s*([\s\S]*)\}\s*\[\]/);
    props[p[1]] = {
      opcional: p[2] === "?",
      tipo: p[3].trim(),
      // campos que el elemento del array declara: "text: string" / "kind: ...; x: number; ..."
      campos: arr ? [...arr[1].matchAll(/(\w+)\??:/g)].map((x) => x[1]) : null,
      obligatoriosEl: arr ? [...arr[1].matchAll(/(\w+):/g)].map((x) => x[1]) : null,
    };
  }
  // defaults de texto: prop = "..." en la desestructuración
  const d = s.match(new RegExp(`export const ${n}[\\s\\S]*?=\\s*\\(\\{([\\s\\S]*?)\\}\\)\\s*=>`));
  const defaults = {};
  if (d) for (const x of d[1].matchAll(/(\w+)\s*=\s*("(?:[^"\\]|\\.)*")/g)) defaults[x[1]] = JSON.parse(x[2]);
  firmas[n] = { props, defaults };
}

function revisar(comp, props) {
  const F = firmas[comp];
  const malos = [];
  if (!F) return [`no pude leer la firma de ${comp}`];
  for (const [k, v] of Object.entries(props)) {
    const d = F.props[k];
    if (!d) { malos.push(`${comp}.${k} NO existe en la firma`); continue; }
    if (Array.isArray(v)) {
      if (!d.campos) { malos.push(`${comp}.${k} no es un array en la firma (${d.tipo})`); continue; }
      for (const [i, el] of v.entries()) {
        const sobra = Object.keys(el).filter((c) => !d.campos.includes(c));
        const falta = d.obligatoriosEl.filter((c) => !(c in el));
        if (sobra.length) malos.push(`${comp}.${k}[${i}] trae {${sobra}} y el componente lee {${d.campos}}`);
        if (falta.length) malos.push(`${comp}.${k}[${i}] NO trae los obligatorios {${falta}}`);
      }
    }
  }
  // toda prop REQUERIDA (sin ?) tiene que venir en el beat
  for (const [k, d] of Object.entries(F.props)) {
    if (!d.opcional && k !== "durationInFrames" && !(k in props)) malos.push(`${comp}.${k} es REQUERIDA y el beat no la trae`);
  }
  // defaults de texto sin pisar (el que se ve LLENO y está mal: texto de otro video)
  for (const [k, v] of Object.entries(F.defaults)) {
    if (k === "durationInFrames" || k in props) continue;
    if (/^(brass|danger|bl|tl|br|The Four Thousand Doors|)$/.test(v)) continue;   // tono/posición/firma de la serie
    malos.push(`${comp}.${k} se queda con su DEFAULT "${v.slice(0, 48)}" (texto de otro video)`);
  }
  return malos;
}

const comps = ITEMS.filter((i) => i.k === "comp");
let problemas = [];
for (const c of comps) problemas.push(...revisar(c.comp, c.props).map((p) => `m${c.m}: ${p}`));

// ── CONTROL POSITIVO: tres fallas inyectadas tienen que caer ────────────────
if (process.argv.includes("--self")) {
  const casos = [
    ["CheckCard", { kicker: "X", title: "Y", items: [{ t: "malo" }] }, "items con {t} en vez de {text}"],
    ["ScrewHero", { kicker: "X", title: "Y", sub: "Z", pieces: [{ label: "malo" }] }, "pieces con {label}"],
    ["RayCta", { title: "T", sub: "S", domain: "d", showQr: false }, "eyebrow sin pisar = 'Free walkthrough'"],
  ];
  let cazadas = 0;
  for (const [c, p, q] of casos) { const r = revisar(c, p); console.log(`  control ${r.length ? "CAZADO" : "⛔ SE ESCAPÓ"}: ${q}${r.length ? " → " + r[0] : ""}`); if (r.length) cazadas++; }
  console.log(`CONTROL POSITIVO: ${cazadas}/3 cazadas`);
  if (cazadas < 3) process.exit(2);
}

const nArrays = comps.reduce((a, c) => a + Object.values(c.props).filter(Array.isArray).length, 0);
console.log("═".repeat(72));
console.log(`MEDIDO: ${comps.length} usos de componente · ${new Set(comps.map((c) => c.comp)).size} distintos · ` +
  `${Object.keys(firmas).length} firmas leídas de ${KIT}/ · ${nArrays} arrays con elementos revisados`);
console.log(`PROBLEMAS: ${problemas.length}`);
for (const p of problemas) console.log("  ⛔ " + p);
if (Object.keys(firmas).length < 8 || nArrays < 5) { console.error("⛔ medí muy poco: el medidor está roto"); process.exit(2); }
process.exit(problemas.length ? 3 : 0);
