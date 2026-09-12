// check_defaults.mjs — CAZA LOS TEXTOS POR DEFECTO que se cuelan en el render.
//
//   node scripts/check_defaults.mjs <slug>
//
// El kit está lleno de microcopy hardcodeada del video para el que se escribió cada componente
// (y casi toda en español). Si no pisás una prop de texto, el componente NO queda vacío: queda con
// el texto de OTRO video, y como "se ve lleno" ni el auditor de densidad ni el de visión lo marcan.
// Medido en `mdmold`: el HookCaption del hook salió con "y se arregla con lo que ya tenés en tu
// casa" debajo de un titular en inglés, en el segundo 6 del video.
//
// Qué hace: por cada componente usado en el plan, lee su firma real, saca TODA prop con default
// string no vacío, y avisa de las que el plan no está pisando. Marca aparte las que tienen acentos
// o palabras en español, que son las que se ven feo en un canal en inglés.
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/check_defaults.mjs <slug>"); process.exit(2); }

const plan = JSON.parse(fs.readFileSync(`_v3/${slug}_plan.json`, "utf8").replace(/^﻿/, ""));
const usos = [
  ...(plan.beats || []).filter((b) => b.tipo === "componente").map((b) => ({ comp: b.componente, props: b.props || {}, ms: b.ms_in })),
  ...(plan.overlays || []).map((o) => ({ comp: o.componente, props: o.props || {}, ms: o.ms_in })),
];
if (!usos.length) { console.log("no hay componentes con props en el plan"); process.exit(0); }

// buscar el archivo donde vive cada componente
const roots = ["src/VideoEdit/kit/premium", "src/VideoEdit/kit", "src/peroxide", "src/VideoEdit/scenes",
  "src/_fed6/VideoEdit/scenes", "src/_fed6/VideoEdit", "src"];   // + el kit _fed6 (Federer), que faltaba
const files = [];
const walk = (d) => {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p); else if (/\.tsx?$/.test(f.name)) files.push(p);
  }
};
roots.forEach(walk);

const ES = /[áéíóúñ¿¡]|\b(el|la|los|las|de|del|que|con|para|por|una|como|más|cada|tenés|tu|se|es|no|sin|lo|al|un|esto|esta|hacer|cómo|qué)\b/i;

// saca los defaults de texto de la firma de un componente
const defaultsDe = (comp) => {
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const i = src.indexOf(`export const ${comp}: React.FC<`);
    if (i < 0) continue;
    // el bloque de destructuring con defaults viene después de "}> = ({"
    const j = src.indexOf("}> = ({", i);
    if (j < 0) return { file: f, defs: [] };
    const k = src.indexOf("}) =>", j);
    const block = src.slice(j, k > 0 ? k : j + 2500);
    const defs = [];
    // prop = "texto"  ·  prop = 'texto'  ·  prop = [ ... ] con strings
    for (const m of block.matchAll(/(\w+)\s*=\s*"([^"]{2,})"/g)) defs.push({ prop: m[1], val: m[2] });
    for (const m of block.matchAll(/(\w+)\s*=\s*'([^']{2,})'/g)) defs.push({ prop: m[1], val: m[2] });
    for (const m of block.matchAll(/(\w+)\s*=\s*(\[[\s\S]{2,400}?\])\s*,\n/g)) defs.push({ prop: m[1], val: m[2].replace(/\s+/g, " ").slice(0, 90) });
    return { file: f, defs };
  }
  return { file: null, defs: [] };
};

const cache = {};
let problemas = 0, avisos = 0;
const vistos = new Set();
for (const u of usos) {
  const key = u.comp + JSON.stringify(Object.keys(u.props).sort());
  if (vistos.has(key)) continue;
  vistos.add(key);
  const info = (cache[u.comp] ||= defaultsDe(u.comp));
  if (!info.file) { console.log(`  ? ${u.comp}: no encontré el archivo`); continue; }
  const faltan = info.defs.filter((d) => !(d.prop in u.props));
  if (!faltan.length) continue;
  const es = faltan.filter((d) => ES.test(d.val));
  const otros = faltan.filter((d) => !ES.test(d.val));
  if (es.length) {
    problemas += es.length;
    console.log(`\n⛔ ${u.comp} (${Math.round(u.ms / 1000)}s) — ${es.length} default(s) EN ESPAÑOL sin pisar:`);
    for (const d of es) console.log(`     ${d.prop} = ${JSON.stringify(d.val).slice(0, 110)}`);
  }
  if (otros.length) {
    avisos += otros.length;
    console.log(`\n⚠ ${u.comp} (${Math.round(u.ms / 1000)}s) — default(s) sin pisar (revisar si aplican):`);
    for (const d of otros) console.log(`     ${d.prop} = ${JSON.stringify(d.val).slice(0, 110)}`);
  }
}
// ── HUECOS DE IMAGEN ────────────────────────────────────────────────────────────────────────
// Misma familia de bug que los defaults de texto: el componente NO queda vacío, queda con un
// PLACEHOLDER (marco negro / paisaje lavado) que "se ve lleno" y pasa todas las compuertas.
// Medido en `mdmold`: el VsDuel del sellador salió con los dos paneles en negro.
// slot = ruta dentro de las props que TIENE que traer una imagen.
const SLOTS = {
  VsDuel: ["left.image", "right.image"],
  CtaCard: ["image"],
  LightTrailCards: ["images"],
  BeforeAfter: ["beforeImage", "afterImage"],
  FloatingCutout: ["image"],
  DocNameCard: ["image"],
  BlurExplainer: ["image", "clip"],
};
const get = (o, ruta) => ruta.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
let huecos = 0;
for (const u of usos) {
  const slots = SLOTS[u.comp];
  if (!slots) continue;
  for (const sl of slots) {
    const v = get(u.props, sl);
    if (v == null || (Array.isArray(v) && !v.length)) {
      huecos++;
      console.log(`\n⛔ ${u.comp} (${Math.round(u.ms / 1000)}s) — SIN IMAGEN en \`${sl}\` → renderiza un placeholder vacío`);
    } else if (typeof v === "string" && !fs.existsSync(`public/${v}`)) {
      huecos++;
      console.log(`\n⛔ ${u.comp} (${Math.round(u.ms / 1000)}s) — \`${sl}\` apunta a public/${v} que NO EXISTE (404 mata el chunk)`);
    }
  }
}

console.log(`\n=== ${problemas} defaults en ESPAÑOL sin pisar · ${huecos} huecos de imagen · ${avisos} avisos ===`);
if (problemas || huecos) { console.log("Arreglalo en el plan y volvé a buildear ANTES de rendear."); process.exit(1); }
