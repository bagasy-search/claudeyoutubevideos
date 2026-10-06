// Compuerta de ENCUADRE y RIQUEZA DE ESCENA.
// ⛔ El encuadre sale del campo `encuadre` que declara el plan (autoritativo), NO de adivinar
//    frases en el prompt: los AUTOR escriben "a wide shot from the doorway", "seen from across
//    the patio", "stepping back", y un detector por frases da 83% de "sin encuadre" sobre un
//    plan que lo declara en el 100%. Para los planes VIEJOS (que no tienen el campo) se cae al
//    detector por texto y se avisa, para que el número no se lea como comparable.
const fs = require("fs");

const CERRADO = /\b(close-?up|close view|close medium|macro|extreme close|tight shot|close angled|detail shot|close shot)\b/i;
const ABIERTO = /\b(wide shot|wide view|wide angle|full shot|from across the|from the doorway|stepping back|looking down the|establishing)\b/i;
const MEDIO = /\b(medium shot|medium view|mid shot|waist-up|three-quarter)\b/i;

const PROPS = [
  "shelf", "shelves", "table", "chair", "chairs", "sofa", "armchair", "window", "doorway", "curtain",
  "bucket", "broom", "towel", "towels", "mug", "cup", "plant", "plants", "pot", "pots", "box", "boxes",
  "cardboard", "clothesline", "laundry", "washing machine", "fridge", "freezer", "counter", "drawer",
  "toolbox", "notebook", "clipboard", "cable", "cables", "bag", "shoes", "slippers", "rug", "carpet",
  "lamp", "bulb", "bottle", "bottles", "jar", "jars", "newspaper", "magazines", "calendar",
  "picture frame", "ceiling fan", "stool", "ladder", "hose", "tyre", "tire", "tires", "bicycle",
  "kettle", "mate gourd", "thermos", "pencil", "remote", "television", "tv stand", "sink", "tap",
  "mirror", "hook", "dustpan", "rag", "rags", "sponge", "crate", "bench", "doormat", "blanket",
  "cushion", "pillow", "socket", "switch", "screwdriver", "pliers", "tape", "sack", "basket",
  "tin", "cans", "paint", "brush", "glove", "gloves", "apron", "watch", "charger", "router", "modem",
  "speaker", "console", "microwave", "oven", "pan", "plate", "plates", "tray", "bin", "stairs",
  "gate", "fence", "grass", "weeds", "leaves", "brick wall", "peeling plaster", "floor tiles",
];
const contarProps = (p) => {
  const s = p.toLowerCase();
  let n = 0;
  for (const w of PROPS) if (s.includes(w)) n++;
  return n;
};

for (const f of process.argv.slice(2)) {
  let d;
  try { d = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { console.log("ERR " + f + " " + e.message); continue; }
  const arr = (Array.isArray(d) ? d : d.items || []).filter((x) => x && typeof x.prompt === "string" && x.prompt.length);
  if (!arr.length) { console.log("ERR " + f + " -> 0 prompts con texto"); continue; }

  const declara = arr.filter((x) => x.encuadre).length;
  const fuente = declara === arr.length ? "campo" : declara === 0 ? "TEXTO(aprox)" : "MIXTO";
  const enc = { wide: 0, medium: 0, close: 0 };
  for (const x of arr) {
    let e = (x.encuadre || "").toLowerCase();
    if (!["wide", "medium", "close"].includes(e)) {
      e = CERRADO.test(x.prompt) ? "close" : ABIERTO.test(x.prompt) ? "wide" : MEDIO.test(x.prompt) ? "medium" : "";
    }
    if (e) enc[e]++;
  }
  const medidos = enc.wide + enc.medium + enc.close;
  const props = arr.map((x) => contarProps(x.prompt)).sort((a, b) => a - b);
  const med = props[Math.floor(props.length / 2)];
  const pobres = props.filter((n) => n < 3).length;
  const pct = (n) => (100 * n / arr.length).toFixed(0) + "%";

  console.log(f.replace("_v3/", "").padEnd(28) +
    " n=" + String(arr.length).padStart(4) +
    " | encuadre medido en " + String(medidos).padStart(4) + " (" + fuente + ")" +
    "  close " + pct(enc.close).padStart(4) +
    " · medium " + pct(enc.medium).padStart(4) +
    " · wide " + pct(enc.wide).padStart(4) +
    " | props mediana " + String(med).padStart(2) +
    " · planos con <3 props: " + pobres);
}
