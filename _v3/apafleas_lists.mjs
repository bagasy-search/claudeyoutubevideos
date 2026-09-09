// Listas de generacion — apafleas. Rutea CADA plano a su motor y corre la COMPUERTA DE PROMPT.
//   P  -> gpt-image-2 low /edits + ref de cara 128x192 por BATCH  ($0,00207)
//   O  -> FLUX.2 klein-4b (Cloudflare)                            ($0,00115)
//   DG -> gpt-image-2 low /generations (laminas del SectionDiagram, sin texto)
//   A  -> no genera nada: el avatar real cubre ese momento a pantalla completa
import fs from "node:fs";

const passes = [];
for (const n of [1, 2, 3, 4]) passes.push((await import(`./apafleas_dir_${n}.mjs`)).default);
const shots = passes.flat().flatMap((x) => x.s.map((s) => ({ u: x.u, ...s })));

// ⛔⛔ IDENTIDAD — sale del PLATE REAL que anima AvatarForever (public/ref_apafleas_face.png),
// recortado del mismo cuadro que genera el avatar. Asi la cara del avatar y la de las ~250 fotos
// son la MISMA por construccion (mina medida en ohftermite: 398 planos con la cara equivocada).
// Con la referencia sola no alcanza: el resto del prompt empuja al arquetipo de granjero viejo y
// le dibuja barba igual, asi que lo que NO tiene va explicito y repetido.
const IDENT =
  "The man must be EXACTLY the person in the reference image: a lean weathered American man in his " +
  "sixties, CLEAN-SHAVEN with no beard, no moustache, no goatee and no stubble, with straight " +
  "silver-blond hair combed back off a high forehead, pale blue eyes, deep sun lines across his " +
  "forehead and cheeks, a strong straight nose and a lined weathered neck. He wears a soft cream " +
  "cotton work shirt with the sleeves rolled to the elbow and black elastic suspenders over it, and " +
  "brown canvas work trousers. He is BAREHEADED, wearing no hat and no cap. Keep his exact face and " +
  "bone structure. Do not give him a beard. Do not put a hat on his head. ";

// FORMULA VALIDADA (A/B del creador): foto de celular real, colores vivos, fondo NITIDO y legible.
// ⛔ Prohibido cinematic / 35mm / bokeh / 8k / grainy / muted / low saturation / nothing polished,
//    y prohibido el desenfoque de fondo, que es la gramatica de la foto de banco.
const STYLE =
  " Candid photograph taken on a modern smartphone, bright natural daylight, true-to-life colors, " +
  "sharp focus, deep depth of field with the whole scene in focus, the background full of ordinary " +
  "everyday objects that stay readable, nothing blurred out, realistic everyday snapshot, no filter, " +
  "no ai look, no text, no letters, no labels, no signs, no watermark. Landscape 16:9 framing.";

// Las escenas de ATARDECER/NOCHE (el test de las medias, los nematodos) no pueden pedir pleno dia.
const NOCHE = /\bnight\b|\bdusk\b|\btwilight\b|after sunset|evening light|last light/i;
const STYLE_NOCHE =
  " Candid photograph taken on a modern smartphone at dusk, true-to-life colors, sharp focus, " +
  "deep depth of field, the surroundings dim but still readable, nothing blurred out, realistic " +
  "everyday snapshot, no filter, no ai look, no text, no letters, no labels, no signs, no watermark. " +
  "Landscape 16:9 framing.";
const estilo = (p, esP) => {
  const base = NOCHE.test(p) ? STYLE_NOCHE : STYLE;
  return esP
    ? IDENT + p + base + " Natural skin texture with visible pores and sun damage, correct hands with exactly five fingers."
    : p + base;
};

const P = [], O = [];
for (const s of shots) {
  if (s.k === "P") P.push({ name: s.n, ref: "public/ref_apafleas_face.png", prompt: estilo(s.p, true) });
  else if (s.k === "O") O.push({ name: s.n, prompt: estilo(s.p, false) });
}

// ── LAMINAS del SectionDiagram: el componente dibuja los rotulos ENCIMA, asi que van SIN TEXTO.
const DG_STYLE =
  " Clean educational cutaway illustration in the style of an old field guide plate, painted in " +
  "earthy browns, ochre, olive and cream on an aged cream paper ground, clear simple shapes, no " +
  "shading tricks. Absolutely no text, no letters, no numbers, no labels, no arrows, no captions, " +
  "no watermark anywhere in the image. Landscape 16:9.";
const DG = JSON.parse(fs.readFileSync("_v3/apafleas_dg.json", "utf8"));
const D = DG.map(([name, p]) => ({ name, prompt: p + DG_STYLE }));

fs.writeFileSync("_v3/apafleas_list_P.json", JSON.stringify(P, null, 1));
fs.writeFileSync("_v3/apafleas_list_O.json", JSON.stringify(O, null, 1));
fs.writeFileSync("_v3/apafleas_list_DG.json", JSON.stringify(D, null, 1));

// ── COMPUERTA DE PROMPT (barato adelante > auditar caro atras) ────────────────────────────────
const BAN = /\b(cinematic|35\s?mm|bokeh|8k|highly detailed|golden hour|documentary style|low saturation|muted colors?|grainy|nothing polished|photorealistic|shallow depth of field|blurred background|out of focus|soft focus|subject isolation|stock photo)\b/i;
const todos = [...P, ...O, ...D];
let bad = 0, corto = 0, sinIdent = 0, hatEnCabeza = 0;
const A = shots.filter((s) => s.k === "A").length;
const C = shots.filter((s) => s.k === "C").length;
console.log(`MEDIDO: ${shots.length} planos · P ${P.length} · O ${O.length} · DG ${D.length} · comp ${C} · avatar ${A}`);
for (const it of todos) {
  if (BAN.test(it.prompt)) { bad++; console.log(`  ⛔ token prohibido: ${it.name} -> "${it.prompt.match(BAN)[0]}"`); }
  if (it.prompt.length < 200) { corto++; console.log(`  ⛔ prompt corto: ${it.name} (${it.prompt.length})`); }
}
for (const it of P) {
  if (!/CLEAN-SHAVEN/.test(it.prompt)) { sinIdent++; console.log(`  ⛔ sin identidad: ${it.name}`); }
  if (/\b(wearing|wears|in) a (straw|wide-brim|felt) hat\b/i.test(it.prompt)) { hatEnCabeza++; console.log(`  ⛔ sombrero PUESTO: ${it.name}`); }
  if (!fs.existsSync(it.ref)) { console.log(`  ⛔ falta la ref: ${it.ref}`); bad++; }
}
const nombres = todos.map((t) => t.name);
const dup = [...new Set(nombres.filter((n, i) => nombres.indexOf(n) !== i))];
if (dup.length) { console.log(`  ⛔ nombres duplicados: ${dup.join(",")}`); bad += dup.length; }

// las laminas que piden los componentes tienen que existir en la lista DG
const pedidas = [...new Set(shots.filter((s) => s.k === "C")
  .flatMap((s) => JSON.stringify(s.props || {}).match(/img\/(fl_dg_[a-z0-9_]+)\.jpg/g) || [])
  .map((x) => x.replace("img/", "").replace(".jpg", "")))];
const faltan = pedidas.filter((n) => !D.some((d) => d.name === n));
if (faltan.length) { console.log(`  ⛔ laminas pedidas por componentes y sin prompt: ${faltan.join(",")}`); bad += faltan.length; }
const sobran = D.filter((d) => !pedidas.includes(d.name)).map((d) => d.name);
if (sobran.length) console.log(`  ⚠️ laminas con prompt que nadie usa: ${sobran.join(",")}`);

console.log(`tokens prohibidos ${bad} · prompts cortos ${corto} · P sin identidad ${sinIdent} · sombrero puesto ${hatEnCabeza}`);
console.log(`largo medio de prompt: ${Math.round(todos.reduce((a, x) => a + x.prompt.length, 0) / todos.length)} chars`);
const cost = P.length * 0.00207 + O.length * 0.00115 + D.length * 0.00207;
console.log(`costo estimado: US$${cost.toFixed(2)}  (P: batch + crop de cara · O: klein · DG: batch)`);
if (bad || corto || sinIdent || hatEnCabeza) { console.log("⛔ GATE PROMPTS: NO GENERAR"); process.exit(1); }
console.log("✅ GATE PROMPTS: OK");
