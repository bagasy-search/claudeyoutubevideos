// rksmart_varagate.mjs — LA VARA DE LOS PROMPTS (cross-nicho, permanente) medida sobre ESTE spec.
//   node _v3/rksmart_varagate.mjs
// ⛔ El ENCUADRE sale del campo `enc` que DECLARA el plan, nunca de adivinar frases en el prompt
//    (un detector por texto dio "83 % sin encuadre" sobre un plan que lo declaraba al 100 %).
// ⛔ Toda compuerta imprime CUÁNTO midió. Si el número es sospechosamente redondo, el roto es el medidor.
import { ITEMS } from "./rksmart_prompts.mjs";
import fs from "node:fs";

const imgs = ITEMS.filter((i) => i.k === "img");
const av = ITEMS.filter((i) => i.k === "av");
const comps = ITEMS.filter((i) => i.k === "comp");
const mom = JSON.parse(fs.readFileSync("_v3/rksmart_mom.json", "utf8"));

// ── cobertura de momentos: TODOS tienen que estar ────────────────────────────
const cubiertos = new Set(ITEMS.map((i) => i.m));
const faltan = mom.map((_, k) => k).filter((k) => !cubiertos.has(k));

// ── emoción nombrada en los planos con presentador ───────────────────────────
const EMO = /(expression|smile|smiling|frown|frowning|eyebrow|eyebrows|mouth|grin|nod|nodding|jaw|amused|worried|patient|unimpressed|deadpan|wry|weary|resigned|reflective|concentration|concentrating|disbelief|approving|skeptical|pleased|serious|calm|tired|exasperated|settled|warm|neutral|shrug)/i;
const conRay = imgs.filter((i) => i.c === 1);
const conEmo = conRay.filter((i) => EMO.test(i.escena));

// ── objetos de entorno por prompt (contados sobre la ESCENA, por comas) ──────
const props = imgs.map((i) => (i.escena.match(/,/g) || []).length);
props.sort((a, b) => a - b);
const q = (p) => props[Math.min(props.length - 1, Math.floor(props.length * p))];

// ── rachas de LUGAR ──────────────────────────────────────────────────────────
const porT = [...imgs].sort((a, b) => a.m - b.m || a.part - b.part);
let mxRacha = 1, cur = 1, dondeR = "";
for (let k = 1; k < porT.length; k++) {
  cur = porT[k].lug === porT[k - 1].lug ? cur + 1 : 1;
  if (cur > mxRacha) { mxRacha = cur; dondeR = porT[k].lug; }
}

// ── animado: ≤50 % de las fotos lleva agnes ──────────────────────────────────
const anim = imgs.filter((i) => i.q === 0);
const sinMo = anim.filter((i) => !i.mo);

const pct = (a, b) => (100 * a / Math.max(1, b)).toFixed(1);
const enc = (n) => imgs.filter((i) => i.enc === n).length;
const L = [];
const chk = (etiq, val, ok, vara) => { L.push([etiq, val, ok, vara]); };

chk("momentos del guion cubiertos", `${cubiertos.size}/${mom.length}`, faltan.length === 0, "todos");
chk("planos de imagen", imgs.length, imgs.length > 150, ">150");
chk("momentos de AVATAR", av.length, av.length >= 60, "≥60");
chk("componentes (usos)", comps.length, comps.length >= 15, "≥15");
chk("componentes DISTINTOS", new Set(comps.map((c) => c.comp)).size, new Set(comps.map((c) => c.comp)).size >= 6, "≥6");
chk("presentador EN CUADRO", `${pct(conRay.length, imgs.length)} %`, conRay.length / imgs.length >= 0.30, "≥30 % (con avatar real)");
chk("  de ésos, con EMOCIÓN nombrada", `${pct(conEmo.length, conRay.length)} %`, conEmo.length / conRay.length >= 0.90, "≥90 %");
chk("encuadre CERRADO", `${pct(enc("close"), imgs.length)} %`, enc("close") / imgs.length <= 0.30, "≤30 %");
chk("encuadre MEDIO", `${pct(enc("medium"), imgs.length)} %`, enc("medium") / imgs.length >= 0.50, "≥50 %");
chk("encuadre ABIERTO", `${pct(enc("wide"), imgs.length)} %`, enc("wide") / imgs.length >= 0.05, "≥5 %");
chk("objetos de entorno (mediana)", q(0.5), q(0.5) >= 5, "≥5");
chk("racha máx en el mismo LUGAR", `${mxRacha} (${dondeR})`, mxRacha <= 8, "≤8");
chk("fotos que se ANIMAN con agnes", `${pct(anim.length, imgs.length)} %`, anim.length / imgs.length <= 0.50, "≤50 %");
chk("  animadas SIN motion escrito", sinMo.length, sinMo.length === 0, "0");
chk("planos con presentador que se animan", imgs.filter((i) => i.c === 1 && i.q === 0).length, imgs.filter((i) => i.c === 1 && i.q === 0).length === 0, "0 (se rechazan el doble)");

let malos = 0;
console.log("═".repeat(78));
for (const [e, v, ok, vara] of L) {
  if (!ok) malos++;
  console.log(`${ok ? "✓" : "⛔"} ${e.padEnd(34)} ${String(v).padStart(12)}   vara ${vara}`);
}
console.log("═".repeat(78));
console.log(`MEDIDO: ${ITEMS.length} planos · ${imgs.length} imágenes (${imgs.filter(i=>i.c===1).length} con ref de cara) · ` +
  `${anim.length} clips agnes · ${comps.length} componentes · ${av.length} momentos de avatar`);
if (faltan.length) console.log("⛔ momentos sin plano: " + faltan.join(","));
if (imgs.length < 100) { console.error("⛔ medí muy pocas imágenes — el medidor está roto"); process.exit(2); }
process.exit(malos ? 3 : 0);
