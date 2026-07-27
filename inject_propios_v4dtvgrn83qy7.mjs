// inject_propios_v4dtvgrn83qy7.mjs — mete los 3 componentes DISEÑADOS PARA ESTE VIDEO en el cues.
// Se hace acá y no en beatsheet.mjs a propósito: beatsheet.mjs es COMPARTIDO con los otros agentes
// y agregarle kinds propios de un video se los pisa. El cues_<slug>.gen.tsx sí es mío.
// Re-ejecutable: si ya están inyectados, no duplica.
import fs from "fs";

const CUES = "src/VideoEdit/cues_v4dtvgrn83qy7.gen.tsx";
let s = fs.readFileSync(CUES, "utf8");

const MARK = "/* ── COMPONENTES PROPIOS v4dtvgrn83qy7 ── */";
if (s.includes(MARK)) { console.log("ya inyectado — nada que hacer"); process.exit(0); }

// 1) imports
const imports = `import { PotBurstV4dt } from "./scenes/PotBurst_v4dtvgrn83qy7";
import { PotCutawayV4dt } from "./scenes/PotCutaway_v4dtvgrn83qy7";
import { SameWattsV4dt } from "./scenes/SameWatts_v4dtvgrn83qy7";
`;
s = s.replace(/(import \{ RawShot \} from "\.\/scenes\/RawShot";\n)/, `$1${imports}`);

// 2) los 3 momentos (anclados al ms del segmento que los dice)
const PROPIOS = [
  { key: "own_samewatts", start: 155.08, dur: 5.1,
    el: `<SameWattsV4dt durationInFrames={d} eyebrow="La misma energía" title="Lo único que cambia es a dónde va" watts={80} />` },
  { key: "own_potcutaway", start: 294.66, dur: 6.4,
    el: `<PotCutawayV4dt durationInFrames={d} eyebrow="El corte" title="Dos paredes y un dedo de aire" />` },
  { key: "own_potburst", start: 1170.28, dur: 6.4,
    el: `<PotBurstV4dt durationInFrames={d} eyebrow="Por qué truena" title="El vapor no tiene salida" />` },
];

// 3) sacar los overlays del kit que caen DENTRO de esas ventanas (no amontonar dos carteles encima)
const ventanas = PROPIOS.map((p) => [p.start - 0.6, p.start + p.dur]);
const lineas = s.split("\n");
let quitados = 0;
const out = lineas.filter((ln) => {
  const m = ln.match(/^\s*\{ key: "(ov_[^"]+)", start: ([\d.]+), dur: ([\d.]+)/);
  if (!m) return true;
  const st = +m[2];
  if (ventanas.some(([a, b]) => st >= a && st < b)) { quitados++; return false; }
  return true;
});
s = out.join("\n");

// 4) agregar los propios al final de OVERLAYS
const bloque = MARK + "\n" + PROPIOS.map((p) =>
  `  { key: ${JSON.stringify(p.key)}, start: ${p.start}, dur: ${p.dur}, kind: "propio", el: (d) => ${p.el} },`
).join("\n") + "\n";
// OVERLAYS termina con "];" — insertar antes del cierre del array
const idx = s.lastIndexOf("];");
s = s.slice(0, idx) + bloque + s.slice(idx);

fs.writeFileSync(CUES, s);
console.log(`inyectados ${PROPIOS.length} componentes propios · overlays del kit quitados de esas ventanas: ${quitados}`);
