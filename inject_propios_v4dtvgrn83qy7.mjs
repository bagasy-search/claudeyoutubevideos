// inject_propios_v4dtvgrn83qy7.mjs — mete los 3 componentes DISEÑADOS PARA ESTE VIDEO en el cues.
// Se hace acá y no en beatsheet.mjs a propósito: beatsheet.mjs es COMPARTIDO con los otros agentes
// y agregarle kinds propios de un video se los pisa. El cues_<slug>.gen.tsx sí es mío.
// Re-ejecutable: si ya están inyectados, no duplica.
import fs from "fs";

const CUES = "src/VideoEdit/cues_v4dtvgrn83qy7.gen.tsx";
let s = fs.readFileSync(CUES, "utf8");

const MARK = "/* ── COMPONENTES PROPIOS v4dtvgrn83qy7 ── */";
if (s.includes(MARK)) { console.log("ya inyectado — nada que hacer"); process.exit(0); }

// 0) SWAP a las variantes en ESPAÑOL. Cinco componentes del kit traen texto hardcodeado en inglés
//    (vienen de un video sobre hielo): "FROM ONE JANUARY CUT", "Ice that lasts into the fall",
//    "Heat escapes to the cold sky", "JAN FEB MAR", "Why it barely melts", "Fierce fire"…
//    En un documental en español eso es inusable, y salió en la cuadrícula de auditoría.
//    Se cambia el import, no el componente compartido — los otros videos lo siguen usando igual.
const SWAP = [
  ["ColdRadiationSky", "RadSkyV4dt", "RadSky_v4dtvgrn83qy7"],
  ["ColdCalendar", "ColdCalV4dt", "ColdCal_v4dtvgrn83qy7"],
  ["WinterBank", "WinterBankV4dt", "WinterBank_v4dtvgrn83qy7"],
  ["HeatSlowDiagram", "HeatSlowV4dt", "HeatSlow_v4dtvgrn83qy7"],
  ["MassHeaterDiagram", "MassHeaterV4dt", "MassHeater_v4dtvgrn83qy7"],
];
let swaps = 0;
for (const [viejo, nuevo, archivo] of SWAP) {
  if (!s.includes(`<${viejo}`)) continue;
  s = s.replace(new RegExp(`import \\{ ${viejo} \\} from "\\./scenes/${viejo}";`), `import { ${nuevo} } from "./scenes/${archivo}";`);
  s = s.replace(new RegExp(`<${viejo}\\b`, "g"), () => { swaps++; return `<${nuevo}`; });
}
console.log(`componentes cambiados por su variante en español: ${swaps} usos`);

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
// Insertar antes del cierre DEL ARRAY OVERLAYS. Con `lastIndexOf("];")` caía en el cierre de
// SFX_CUES (que va después) y los 3 componentes quedaban FUERA del array → el bundle no compila.
const ini = s.indexOf("export const OVERLAYS");
if (ini < 0) { console.error("✖ no encontré el array OVERLAYS"); process.exit(1); }
const rel = s.slice(ini).indexOf("\n];");
if (rel < 0) { console.error("✖ no encontré el cierre de OVERLAYS"); process.exit(1); }
const idx = ini + rel + 1; // justo antes del "];"
s = s.slice(0, idx) + bloque + s.slice(idx);

fs.writeFileSync(CUES, s);
console.log(`inyectados ${PROPIOS.length} componentes propios · overlays del kit quitados de esas ventanas: ${quitados}`);
