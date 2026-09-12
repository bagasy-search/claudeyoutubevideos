// g0_cmeciclo.mjs — prompts de las MINI-FRASES del primer tramo (pedido del creador: una imagen
// por mini-frase, animada, para que el arranque se sienta real y no lento).
//
// Reparto pensado para que NO se congele: las tarjetas del comentario real entran donde se lee el
// comentario, y entre medio se corta a imagen. Card → imagen → imagen → card → imagen → card → card.
import fs from "node:fs";

// ⛔⛔ La CLAUSULA DE PROFUNDIDAD. El fondo cremoso no viene de pedirlo: es el DEFAULT del modelo
// cuando no decis nada del fondo, y es lo primero que el ojo lee como "esto lo hizo una IA".
// Prohibir `bokeh` NO alcanza; la instruccion va en POSITIVO y en TODOS los prompts.
// Regla: si el fondo se puede describir, la foto se lee real; si es una mancha, se lee IA.
const DEEP = "deep depth of field with the whole garage in focus, the background cluttered with ordinary everyday objects that stay readable, nothing blurred out.";
const PRE = "Claudio, the man in the reference photo (curly dark hair, salt-and-pepper stubble beard, charcoal grey work overshirt over a black t-shirt), ";
const PP = " Candid photo taken on a phone by someone standing nearby, true-to-life colors, sharp focus, natural hands with five separate fingers, nothing polished, no filter, no ai look, no text, no letters, no labels." + DEEP;
const PO = " Bright natural daylight, true-to-life colors, sharp focus, realistic, nothing polished, no filter, no ai look, no text, no letters, no labels, no signs." + DEEP;
const O = "Candid photo taken on a modern smartphone, ";

const items = [
  { id: "n001", kind: "presenter", nouns: ["video", "batería", "auto"], prompt: PRE + "lifting the scuffed black car starting battery out of the open engine bay of his car in the driveway with both hands, a ten millimetre wrench still hooked in two fingers, jaw set with the effort, the raised hood above him and the radiator hoses and dusty air filter box around the empty battery tray, flat morning daylight outside." + PP },
  { id: "n002", kind: "presenter", nouns: ["banco de trabajo", "batería"], prompt: PRE + "setting the black car battery down onto the scratched wooden workbench, both hands still on its casing and his shoulders dropping as the weight lands, a satisfied half-smile, a coiled extension cord on a nail and a red rolling tool chest behind him, daylight from the open side door across the bench." + PP },
  { id: "n003", kind: "presenter", nouns: ["inversor", "apagón", "casa"], prompt: PRE + "clipping a red crocodile clamp onto the battery post, leaning in close and watching the contact, the small black inverter box with its fan grille sitting beside the battery and a cable running off toward the house, a work lamp throwing warm light across the bench in an otherwise dim garage." + PP },
  { id: "n004", kind: "presenter", nouns: ["video", "personas"], prompt: PRE + "sitting on an upturned plastic crate in the garage looking down at the phone in one hand, eyebrows lifted in mild surprise, his other hand resting on his knee, the two batteries and a socket set on the bench behind him, daylight from the side door." + PP },
  { id: "n005", kind: "object", nouns: ["comentario"], prompt: O + "a scratched phone lying face up among a socket set and a rag on the scratched wooden workbench, its screen glowing pale with the reflection of the garage window across the glass, a mug ring stained into the wood beside it, daylight from a side door." + PO },
  { id: "n007", kind: "object", nouns: ["baterías", "arranque"], prompt: O + "the scuffed black car starting battery alone in the middle of the empty workbench, white powdery corrosion crusted around one lead post, its plastic casing dulled and scratched from years in an engine bay, sawdust and a dropped washer on the wood around it, daylight raking in from the side." + PO },
  { id: "n008", kind: "object", nouns: ["vida útil"], prompt: O + "an old dead car battery pushed into the corner of the garage floor on a square of cardboard, a grey film of dust over its top, both posts thick with white and blue-green corrosion, a broom and a paint tin leaning beside it, dim daylight reaching the corner." + PO },
  { id: "n010", kind: "presenter", nouns: ["comentarios"], prompt: PRE + "standing at the bench with his thumb mid-scroll on the phone screen, his mouth pressed flat in a resigned patient expression, the other hand hanging at his side, the deep-cycle battery on the bench beside his elbow, daylight from the open side door behind him." + PP },
  { id: "n013", kind: "presenter", nouns: ["razón"], prompt: PRE + "nodding once with his chin dipped and one hand lifted at chest height, fingers loosely curled in a conceding gesture, a straight honest look toward the camera, a pegboard of hanging tools and a coiled yellow hose behind him, even daylight in the garage." + PP },
  { id: "n014", kind: "presenter", nouns: ["opiniones"], prompt: PRE + "shaking his head slightly while closing his hand around a yellow and black digital clamp meter lying on the bench, the meter's hinged jaw and its grey rectangular digital screen clearly visible, his eyes already on the tool, a small determined set to his mouth, the two batteries standing on the bench behind his forearm and a red tool chest against the wall, daylight from the side door." + PP },
  { id: "n015", kind: "presenter", nouns: ["batería", "ciclo profundo"], prompt: PRE + "heaving a tall black lead-acid deep-cycle battery onto the workbench with both hands under it, the battery a plain rectangular black plastic box with a row of six round screw caps along its top and two lead posts at one end and a black fabric carry strap, no dials and no gauges and no meters on it, cheeks puffed with the effort and eyes on where he is setting it down, the shorter scuffed car battery already on the bench to one side, daylight from the open door." + PP },
  { id: "n016", kind: "presenter", nouns: ["auto", "video anterior"], prompt: PRE + "resting one flat hand on the top of the old car battery on the bench and glancing sideways at the camera with a small fond smile, his other hand in his trouser pocket, the red tool chest and a wall of hanging spanners behind him, warm daylight from the side." + PP },
  { id: "n017", kind: "object", nouns: ["años"], prompt: O + "a close medium shot of the top of the old car battery, its plastic scuffed to a matte grey, one lead post crusted with white corrosion and the other smeared with grease, a faded blank sticker peeling at one corner, fine dust settled into the moulded ridges, daylight from a side window." + PO },
  { id: "n018", kind: "object", nouns: ["inversor", "refrigerador"], prompt: O + "the small black inverter box with its fan grille sitting on the concrete garage floor with its cable running up to an ordinary white two-door fridge standing against the garage wall, a couple of magnets on the fridge door, a folded moving blanket and a paint tin beside it, daylight from the open garage door." + PO },
  { id: "n019", kind: "object", nouns: ["pinza amperimétrica", "garaje"], prompt: O + "the yellow and black clamp meter hanging by its jaw from a hook on a pegboard, spanners and pliers hanging in a row beside it, the cluttered garage behind with a workbench, a red tool chest and a concrete floor stained with oil, daylight from the side door." + PO },
  { id: "n020", kind: "object", nouns: ["baterías", "prueba"], prompt: O + "the two batteries standing side by side in the middle of the scratched workbench, the tall deep-cycle one with its row of round screw caps clearly taller and wider than the scuffed shorter car battery beside it, a steel tape measure lying across the wood in front of them, daylight from the open side door." + PO },
  { id: "n021", kind: "presenter", nouns: ["refrigerador", "casa"], prompt: PRE + "crouched beside the white fridge with one hand steadying the cable running from it down to the inverter on the floor, his head turned to follow the cable, a focused practical expression, the fridge door closed and a coil of cable at his feet, daylight from the open garage door." + PP },
  { id: "n022", kind: "object", nouns: ["cronómetro", "segundo"], prompt: O + "a phone propped against a wooden block on the workbench with a running stopwatch on its screen, the yellow clamp meter lying beside it with its jaw around a cable, a pencil and a spiral notepad next to them, daylight from a side window across the bench." + PO },
];

// las tarjetas del comentario REAL, donde se está leyendo el comentario
const CARDS = {
  n006: "img/cmeciclo/cmeciclo_com_top.png",       // "...dice esto." → entra la tarjeta
  n009: "img/cmeciclo/cmeciclo_com_top.png",       // "lo adecuado es ciclo profundo" → el remate
  n011: "img/cmeciclo/cmeciclo_com_hora.png",      // "no dura ni una hora"
  n012: "img/cmeciclo/cmeciclo_com_arruinar.png",  // "voy a arruinar la batería"
};
for (const [id, asset] of Object.entries(CARDS)) items.push({ id, kind: "card", asset, nouns: ["comentario"] });
items.sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync("_v3/cmeciclo_prompts_G0.json", JSON.stringify(items, null, 1));
const gen = items.filter((i) => i.kind !== "card");
console.log(`mini-frases ${items.length} · a generar ${gen.length} · tarjetas ${items.length - gen.length}`);
console.log(`  presenter ${gen.filter((i) => i.kind === "presenter").length} · object ${gen.filter((i) => i.kind === "object").length}`);

const REF = "public/ref_cmeciclo_face.png";
fs.writeFileSync("_v3/cmeciclo_list2_presenter.json", JSON.stringify(
  gen.filter((i) => i.kind === "presenter").map((i) => ({ name: `cmeciclo_${i.id}`, ref: REF, prompt: i.prompt })), null, 1));
fs.writeFileSync("_v3/cmeciclo_list2_object.json", JSON.stringify(
  gen.filter((i) => i.kind === "object").map((i) => ({ name: `cmeciclo_${i.id}`, prompt: i.prompt })), null, 1));

// compuerta: ningún plano igual al anterior.
// ⛔ Comparar el principio del prompt NO sirve: los planos del presentador comparten el bloque de
// identidad (~130 chars) y darían todos como repetidos. Se compara la parte DISTINTIVA (la escena).
const orden = items.map((i) => i.kind === "card" ? i.asset : i.prompt.replace(PRE, "").replace(O, "").slice(0, 90));
let malos = 0;
for (let i = 1; i < orden.length; i += 1) if (orden[i] === orden[i - 1]) { console.log(`⛔ ${items[i].id} repite el plano anterior`); malos += 1; }
console.log(malos ? `⛔ ${malos} repeticiones consecutivas` : "✓ 0 planos consecutivos iguales");
