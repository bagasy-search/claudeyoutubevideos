// fix_prompts_cmeciclo.mjs — parches del DIRECTOR sobre los prompts, después del lint.
//
// Tres familias de arreglo, todas cazadas por `lint_prompts_cmeciclo.mjs`:
//  1. MOMENTOS QUE NO SE GENERAN: el gancho lee un comentario real y el CTA muestra el QR.
//     Esos planos son TARJETAS ya dibujadas (texto legible de verdad). gpt-image garabatea
//     cualquier texto largo, así que estos cuatro planos NO van al generador.
//  2. LAS PALMAS ABIERTAS HACIA LA CÁMARA: es la peor composición posible para las manos
//     (medido: agnes/gpt deforman los dedos justo ahí). Se reencuadra con las manos ocupadas
//     en algo o fuera de cuadro, y el gesto se lee en hombros y cara.
//  3. CONSECUTIVOS CASI IGUALES: dos planos seguidos con la misma escena se leen como un
//     congelado. Se cambia el sujeto del segundo, no el adjetivo.
import fs from "node:fs";

const SLUG = "cmeciclo";
const GRUPOS = ["G1", "G2", "G3", "G4", "G5", "G6"];
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));

const PRE = "Claudio, the man in the reference photo (curly dark hair, salt-and-pepper stubble beard, charcoal grey work overshirt over a black t-shirt), ";
const POST_P = " Candid photo taken on a phone by someone standing nearby, true-to-life colors, sharp focus, natural hands with five separate fingers, nothing polished, no filter, no ai look, no text, no letters, no labels.";
const POST_O = " Bright natural daylight, true-to-life colors, sharp focus, realistic, nothing polished, no filter, no ai look, no text, no letters, no labels, no signs.";

// ── 1 · planos que son TARJETA, no imagen generada ────────────────────────────
const TARJETAS = {
  m002: "img/cmeciclo/cmeciclo_com_top.png",       // "el comentario más votado... dice esto"
  m004: "img/cmeciclo/cmeciclo_com_hora.png",      // "abajo de ese hay otros seis"
  m005: "img/cmeciclo/cmeciclo_com_arruinar.png",  // "que voy a arruinar la batería"
  m165: "img/cmeciclo/cmeciclo_cta_pages.png",     // "la hoja que más me piden: cuánto me va a durar"
  m166: "img/cmeciclo/cmeciclo_cta_qr.png",        // "el código está acá en la pantalla"
};

// ── 2 y 3 · prompts reescritos por el director ────────────────────────────────
const REESCRITOS = {
  // palmas abiertas → las manos ocupadas, el gesto en la cara y los hombros
  m097: { kind: "object", nouns: ["porcentaje", "batería", "ciclo profundo"], prompt:
    "Candid photo taken on a modern smartphone, the taller black deep-cycle battery standing on the scratched workbench with a short stack of three identical black car starting batteries beside it for comparison, the stack visibly shorter than the single tall one, a steel tape measure lying across the bench between them, sawdust and a coffee ring on the wood, daylight from a side door raking across the bench, in a cluttered home garage." + POST_O },
  m115: { kind: "presenter", nouns: ["pregunta", "batería", "compra"], prompt:
    PRE + "half turned away from the deep-cycle battery with both hands pushed into his trouser pockets, chin tucked and eyebrows raised as if holding a thought back, mouth slightly pursed, in his home garage workshop, the two batteries side by side out of focus behind him, a red rolling tool chest and a coil of extension cord on a nail, daylight from the open side door falling across his shoulder." + POST_P },
  m154: { kind: "object", nouns: ["garaje", "lavadero", "aire"], prompt:
    "Candid photo taken on a modern smartphone, a black deep-cycle battery sitting on a low wooden crate in the corner of an airy home laundry room, an open window above it with a light curtain lifting in the draught, a washing machine and a folded clothes rack beside it, a charger with its cable coiled on the floor nearby, bright daylight and moving air filling the room." + POST_O },
  m169: { kind: "presenter", nouns: ["mostrador", "luz", "año"], prompt:
    PRE + "standing behind the workbench with both forearms resting flat on it, leaning in toward the camera, a calm level expression as if giving a straight verdict, the deep-cycle battery on his left and the scuffed car battery on his right within reach, a clamp meter and a grease-stained notepad between them, warm daylight from the side door across the bench top." + POST_P },
  // consecutivos casi iguales: cambia el SUJETO, no el adjetivo
  m134: { kind: "presenter", nouns: ["amperios", "arranque", "caja", "ciclos"], prompt:
    PRE + "crouched in the store aisle turning a battery box a quarter turn to read its side panel, brow furrowed and lips pressed in concentration, one knee on the floor and the other box still on the shelf at eye level, metal shelving and price rails out of focus behind him, cold fluorescent light from the ceiling." + POST_P },
  m141: { kind: "object", nouns: ["arranque", "etiqueta"], prompt:
    "Candid photo taken on a modern smartphone, a single battery box left alone on an otherwise empty stretch of metal store shelving, its cardboard corner dented and the printed panel scuffed pale from handling, a gap in the row where the other boxes were, a dropped price rail hanging loose below the shelf edge, cold fluorescent light from overhead." + POST_O },
  m166_alt: null,
};

const patched = {};
for (const g of GRUPOS) {
  const p = `_v3/${SLUG}_prompts_${g}.json`;
  const arr = rd(p);
  let n = 0;
  for (const it of arr) {
    if (TARJETAS[it.id]) { it.kind = "card"; it.asset = TARJETAS[it.id]; delete it.prompt; n += 1; continue; }
    if (REESCRITOS[it.id]) { Object.assign(it, REESCRITOS[it.id]); n += 1; }
  }
  fs.writeFileSync(p, JSON.stringify(arr, null, 1));
  patched[g] = n;
}
console.log(`parches aplicados por grupo: ${JSON.stringify(patched)}`);
console.log(`tarjetas (no se generan): ${Object.keys(TARJETAS).length} · prompts reescritos: ${Object.keys(REESCRITOS).filter((k) => REESCRITOS[k]).length}`);
for (const [id, f] of Object.entries(TARJETAS)) {
  if (!fs.existsSync(`public/${f}`)) { console.error(`⛔ la tarjeta de ${id} no existe en disco: public/${f}`); process.exit(1); }
}
console.log("las 5 tarjetas existen en disco ✓");
