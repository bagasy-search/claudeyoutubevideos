// check_props.mjs — COMPUERTA DE CONTRATOS: valida cada beat del beatsheet contra lo que el
// componente REALMENTE lee, ANTES de gastar una corrida del farm.
//
// Por que existe: en grvaseline los 7 chunks con `blurexplainer` murieron con
// "undefined was passed to staticFile()" porque BlurExplainer declara `clip: string`
// OBLIGATORIO (es el video borroso del fondo) y el beat solo traia `image`. tsc no lo ve
// —los beats son `any[]`— y el density_gate tampoco. Se descubre recien en el farm, con
// 60 chunks ya lanzados.
//
//   node scripts/check_props.mjs <slug>     exit 1 = no rendees
//
// Chequea las TRES familias de error del pipeline:
//   1. prop REQUERIDA ausente        -> crashea el chunk (esta al menos avisa)
//   2. FORMA equivocada              -> React lo renderiza como nada: componente VACIO en verde
//   3. ruta de imagen/clip inexistente -> EncodingError, chunk muerto
import fs from "fs";
import path from "path";

const SLUG = process.argv[2];
if (!SLUG) { console.error("uso: node scripts/check_props.mjs <slug>"); process.exit(1); }

const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8").replace(/^﻿/, "")).beats;

// prop -> como tiene que venir. `req` = obligatoria. `items` describe la forma de cada elemento.
const CONTRACT = {
  blurexplainer: { req: ["clip", "image"], assets: ["clip", "image"] },
  freezezoom:    { req: ["image"], assets: ["image"] },
  chips:         { req: ["chips"], arrayOfString: ["chips"], assets: ["image"] },
  splitlist:     { req: ["items"], arrayOfString: ["items"] },
  checklist:     { req: ["items"], itemKey: { items: "text" } },
  process:       { req: ["steps"], itemKey: { steps: "title" } },
  ingredients:   { req: ["items"], itemKey: { items: "name" }, itemAssets: { items: "image" } },
  annotated:     { req: ["image", "annotations"], itemKey: { annotations: "label" }, assets: ["image"] },
  pricewar:      { req: ["leftImage", "rightImage"], assets: ["leftImage", "rightImage"] },
  ingredientduo: { req: ["leftImg", "rightImg"], assets: ["leftImg", "rightImg"] },
  frasecinetica: { req: ["words"], itemKey: { words: "t" } },
  headline:      { req: ["tokens"], itemKey: { tokens: "t" } },
  bars:          { req: ["bars"], itemKey: { bars: "label" } },
  stat:          { req: ["value"], numeric: ["value"] },
  hourdial:      { req: ["hour"], numeric: ["hour"] },
  nametag:       { assets: ["image"] },
  guardaesto:    { req: ["items"], arrayOfString: ["items"] },
  avatarpizarra: { req: ["items"], itemKey: { items: "card" } },
  mitoverdad:    { req: ["myth", "truth"] },   // _fed6/scenes/MitoVerdad.tsx usa myth/truth (el contrato viejo en ES era de otro kit)
  quote:         { req: ["text"] },
  callout:       { req: ["caption"] },
  rule:          { req: ["title"] },
  lowerthird:    { req: ["title"] },
  errorstinger:  { req: ["title"] },
};

const errs = [];
const has = (v) => v !== undefined && v !== null && v !== "";

for (const b of beats) {
  const c = CONTRACT[b.kind];
  if (!c) continue;
  const at = `${b.kind} @${b.start}s (${b.id || "?"})`;

  for (const k of c.req || []) {
    if (!has(b[k])) errs.push(`${at}: falta la prop REQUERIDA \`${k}\` -> el chunk crashea`);
  }
  for (const k of c.numeric || []) {
    if (has(b[k]) && typeof b[k] !== "number")
      errs.push(`${at}: \`${k}\` debe ser NUMERO (le pasaste ${JSON.stringify(b[k])}) -> rinde "000" sin crashear`);
  }
  for (const k of c.arrayOfString || []) {
    const v = b[k];
    if (Array.isArray(v) && v.some((x) => typeof x !== "string"))
      errs.push(`${at}: \`${k}\` debe ser string[] (le pasaste objetos) -> React error #31`);
  }
  for (const [k, key] of Object.entries(c.itemKey || {})) {
    for (const [i, it] of (b[k] || []).entries()) {
      if (it && typeof it === "object" && !has(it[key]))
        errs.push(`${at}: \`${k}[${i}]\` no tiene \`${key}\` -> el componente sale VACIO y el chunk pasa en VERDE`);
    }
  }
  for (const k of c.assets || []) {
    if (has(b[k]) && !fs.existsSync(path.join("public", b[k])))
      errs.push(`${at}: \`${k}\` apunta a public/${b[k]} y NO EXISTE -> EncodingError`);
  }
  for (const [k, ik] of Object.entries(c.itemAssets || {})) {
    for (const [i, it] of (b[k] || []).entries()) {
      if (it && has(it[ik]) && !fs.existsSync(path.join("public", it[ik])))
        errs.push(`${at}: \`${k}[${i}].${ik}\` -> public/${it[ik]} NO EXISTE`);
    }
  }
}

// 4) EL MAIN TIENE QUE REENVIAR CADA PROP DEL BEAT.
// Esta es la que caza el caso mas traicionero: el beat trae `mito`/`verdad` pero el
// componente lee `myth`/`truth` -> el Main nunca pasa nada, el componente sale VACIO y
// el chunk termina en VERDE. Se grepea el renderComp del Main por `b.<prop>`.
const MAIN = process.argv[3] || `src/_fed6/VideoEdit/Main_${SLUG[0].toUpperCase() + SLUG.slice(1)}.tsx`;
const mainPath = fs.existsSync(MAIN) ? MAIN : `src/_fed6/VideoEdit/Main_${SLUG}.tsx`;
// Ademas del Main hay que mirar los renderers compartidos: los kinds que resuelve
// `renderFederer2Comp(beat, d)` reciben el beat ENTERO y leen `beat.<prop>`, no `b.<prop>`.
const RENDERERS = ["src/_fed6/VideoEdit/FedererComponents.tsx", "src/_fed6/VideoEdit/FedererComponents2.tsx"];
if (fs.existsSync(mainPath)) {
  const main = [mainPath, ...RENDERERS].filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, "utf8")).join(String.fromCharCode(10));
  const IGNORAR = new Set(["id", "start", "dur", "key", "kind", "src", "medico"]);
  const vistos = new Set();
  for (const b of beats) {
    if (!b.kind || b.kind === "raw" || !CONTRACT[b.kind]) continue;
    for (const k of Object.keys(b)) {
      if (IGNORAR.has(k)) continue;
      const id = `${b.kind}.${k}`;
      if (vistos.has(id)) continue;
      vistos.add(id);
      if (!main.includes(`b.${k}`) && !main.includes(`beat.${k}`))
        errs.push(`${b.kind}: el beat trae \`${k}\` pero ${mainPath} NUNCA lo reenvia (no aparece \`b.${k}\`) -> el componente usa su DEFAULT o sale VACIO, y el chunk pasa en VERDE`);
    }
  }
} else {
  console.log(`  ⚠ no encontre el Main (${mainPath}) — salteo el chequeo de reenvio de props`);
}

const kinds = [...new Set(beats.filter((b) => b.kind && b.kind !== "raw").map((b) => b.kind))];
const sinContrato = kinds.filter((k) => !CONTRACT[k]);
console.log(`── CONTRATOS · ${SLUG} · ${beats.length} beats · ${kinds.length} kinds`);
if (sinContrato.length) console.log(`  ⚠ sin contrato declarado (no validados): ${sinContrato.join(", ")}`);

if (errs.length) {
  console.log(`\n⛔ ${errs.length} PROBLEMA(S) DE CONTRATO — NO RENDEES:`);
  for (const e of errs) console.log("  · " + e);
  process.exit(1);
}
console.log("✅ contratos OK — todas las props requeridas presentes y todos los assets existen.");
