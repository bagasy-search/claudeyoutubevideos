// scripts/check_contexto.mjs <slug>  —  COMPUERTA DE CONTEXTO (cross-nicho, obligatoria).
//
//   ⛔ REGLA DEL CREADOR (ago-2026), vale para TODOS los videos de TODOS los canales:
//   "Cada plano tiene que mostrar exactamente lo que el presentador esta diciendo EN ESE SEGUNDO,
//    no algo del tema general del bloque. Si dice 'el regulador se come dieciocho vatios', se ve EL
//    REGULADOR. Aunque todo ese tramo hable de energia solar, no vale poner el panel, ni la bateria,
//    ni el techo. Nada de generar material 'del tema' y despues repartirlo por bloques. Si para un
//    momento no hay material que muestre eso exacto, mejor dejar al presentador hablando."
//
// El build tiene que emitir `public/<slug>_contexto.json`:
//   [{ t: <segundo>, dice: "<la frase de ese momento>", asset: "<nombre>", prompt: "<prompt del asset>" }]
//
// Falla (exit 1) si algun plano NO muestra ninguno de los sustantivos de SU frase.
// Uso:  node scripts/check_contexto.mjs cmetemu
import fs from "node:fs";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/check_contexto.mjs <slug>"); process.exit(1); }
const P = `public/${slug}_contexto.json`;
if (!fs.existsSync(P)) {
  console.error(`⛔ falta ${P} — el build tiene que emitirlo (ver cabecera de este archivo)`);
  process.exit(1);
}
const items = JSON.parse(fs.readFileSync(P, "utf8"));

// sustantivo en español -> como aparece en el prompt (inglés). Ampliá por nicho, no lo achiques.
const DIC = {
  panel:["panel","solar"], caja:["box","carton"], pinza:["clamp"], bateria:["battery"],
  estacion:["power station"], cable:["cable","lead","wire"], controlador:["controller"],
  inversor:["inverter"], etiqueta:["label","specification"], celda:["cell"], pasto:["grass","lawn"],
  sombra:["shadow"], tienda:["store","shop"], refrigerador:["refrigerator","fridge"],
  mostrador:["counter"], calendario:["calendar"], pantalla:["screen","display"], lampara:["lamp","bulb"],
  ventilador:["fan"], borne:["terminal","post"], cuaderno:["notebook"], telefono:["phone"],
  marco:["frame"], mano:["hand"], noche:["night","dark"], sol:["sun","midday"], techo:["roof"],
  pared:["wall"], ventana:["window"], puerta:["door"], enchufe:["plug","socket","outlet"],
  medidor:["meter"], llave:["switch","breaker"], tornillo:["screw"], generador:["generator"],
  agua:["water"], vaso:["glass"], olla:["pot","pan"], cocina:["kitchen"], piel:["skin"],
  cara:["face"], pie:["foot","feet"], rodilla:["knee"], planta:["plant"], hoja:["leaf","leaves"],
  frasco:["jar"], cuchara:["spoon"], taza:["cup","mug"], moho:["mold","mould"], caño:["pipe"],
};
const norm = (s) => (s || "").toLowerCase()
  .replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i")
  .replace(/[óòö]/g,"o").replace(/[úùü]/g,"u");
const quiere = (dice) => {
  // ⛔ sin regex: los escapes se rompen entre capas y el chequeo pasa en verde sin comparar nada.
  // Parto en palabras y comparo por igualdad (singular o plural).
  const pal = new Set(norm(dice).split(/[^a-z]+/).filter(Boolean));
  const out = new Set();
  for (const [es, ens] of Object.entries(DIC)) {
    if (pal.has(es) || pal.has(es + "s") || pal.has(es + "es")) ens.forEach((e) => out.add(e));
  }
  return [...out];
};

let mal = 0, sin = 0, ok = 0;
const fallos = [];
for (const it of items) {
  const w = quiere(it.dice);
  if (!w.length) { sin++; continue; }                       // frase sin sustantivo mapeable: no opina
  const txt = norm(`${it.prompt || ""} ${it.asset || ""}`);
  if (w.some((x) => txt.includes(x))) ok++;
  else { mal++; fallos.push({ ...it, quiere: w }); }
}

// repetidos consecutivos: dos planos seguidos con el MISMO asset se lee como que falta material
// ⛔ NO cuenta las dos mitades de un mismo momento (clip + foto del mismo sujeto): eso es la regla,
// no un defecto. Cuenta cuando dos MOMENTOS DISTINTOS seguidos muestran lo mismo.
let rep = 0;
const repEj = [];
for (let i = 1; i < items.length; i++) {
  const a = items[i-1], b = items[i];
  if (b.asset && b.asset === a.asset && (b.dice || "") !== (a.dice || "")) { rep++; repEj.push(b); }
}

console.log(`contexto: ${ok} planos muestran su frase · ${mal} NO · ${sin} sin sustantivo mapeable`);
console.log(`repetidos consecutivos: ${rep}`);
for (const f of fallos.slice(0, 25)) {
  const m = Math.floor((f.t || 0) / 60), s = Math.round((f.t || 0) % 60);
  console.log(`   ${String(m).padStart(2)}:${String(s).padStart(2,"0")}  «${(f.dice||"").slice(0,44)}»`);
  console.log(`            quiere ${JSON.stringify(f.quiere.slice(0,3))} · tiene ${f.asset}`);
}
if (mal || rep) {
  console.log(`\n⛔ NO RENDEES. Para cada uno, en este orden:`);
  console.log(`   1) buscá en TODO el pool ya generado el asset cuyo prompt tenga los sustantivos de ESA frase`);
  console.log(`   2) si no hay, GENERALO (una imagen sale casi gratis y vale mas que dejar un plano que no corresponde)`);
  console.log(`   3) recien ahi, dejá al presentador hablando. NUNCA un plano "del tema".`);
  process.exit(1);
}
console.log("\n✓ cada plano muestra lo que se dice en ese segundo.");
