// rewire_lamina15.mjs — pasada propia sobre `cues_lamina15.gen.tsx`, DESPUÉS de beatsheet.mjs.
// `beatsheet.mjs` es COMPARTIDO y no se toca: los arreglos específicos de un video van acá.
//
// Hace dos cosas con las 3 variantes propias del hook:
//  1) IMPORT — el caso `premium` del generador asume que todo componente vive en
//     `./kit/premium`. Las mías viven en `./kit/lamina15/HookKit_lamina15`.
//  2) DESENVOLVER `PremiumOverlay` — ese wrapper existe para hundir y DESENFOCAR el
//     b-roll y hacer flotar piezas encima. Mis tres variantes TRAEN SU PROPIO PLATE
//     (la termografía ES la imagen, el polvo ES la imagen): envueltas, el overlay
//     desenfocaría su propio fondo y les pondría un tratamiento arriba. Van desnudas.
//
// Idempotente: se puede re-correr después de cada `node beatsheet.mjs`.
import fs from "node:fs";

const F = "src/VideoEdit/cues_lamina15.gen.tsx";
const OWN = ["ThermalWipe_lamina15", "CaliperReveal_lamina15", "DustDecay_lamina15"];
let s = fs.readFileSync(F, "utf8");
const before = s;

// 1) import
const rx = new RegExp(`import \\{([^}]*)\\} from "\\./kit/premium";`);
const m = s.match(rx);
if (m) {
  const names = m[1].split(",").map((x) => x.trim()).filter(Boolean);
  const mine = names.filter((n) => OWN.includes(n));
  const rest = names.filter((n) => !OWN.includes(n));
  if (mine.length) {
    const lines = [];
    if (rest.length) lines.push(`import { ${rest.join(", ")} } from "./kit/premium";`);
    lines.push(`import { ${mine.join(", ")} } from "./kit/lamina15/HookKit_lamina15";`);
    s = s.replace(rx, lines.join("\n"));
  }
}

// 2) desenvolver el PremiumOverlay SOLO alrededor de las mías
let unwrapped = 0;
for (const comp of OWN) {
  const re = new RegExp(
    `<PremiumOverlay[^>]*>(\\s*<${comp}\\b[\\s\\S]*?/>)\\s*</PremiumOverlay>`,
    "g",
  );
  s = s.replace(re, (_all, inner) => { unwrapped++; return inner.trim(); });
}

if (s !== before) {
  fs.writeFileSync(F, s, "utf8");
  console.log(`rewire: import corregido · ${unwrapped} PremiumOverlay desenvueltos`);
} else {
  console.log("rewire: nada que cambiar (ya estaba aplicado)");
}

// verificación dura: que no quede ninguna de las mías envuelta ni importada del lugar equivocado
const bad = OWN.filter((c) => new RegExp(`<PremiumOverlay[^>]*>\\s*<${c}\\b`).test(s));
if (bad.length) { console.error("⛔ siguen envueltas:", bad.join(", ")); process.exit(1); }
if (new RegExp(`import \\{[^}]*(${OWN.join("|")})[^}]*\\} from "\\./kit/premium"`).test(s)) {
  console.error("⛔ siguen importadas desde ./kit/premium"); process.exit(1);
}
// ⛔ COMPUERTA: ninguna prop de IMAGEN puede apuntar a un .mp4. Los componentes
// dibujan su plate con <ImgOr>/<Img>, que no cargan video: un mp4 ahí mata los 60
// chunks con "Error loading image with src". Apareció al meter los clips de H3 en
// momentos que hasta entonces sólo tenían foto.
const vid = [...s.matchAll(/(image|bg|back|fore|leftImage|rightImage|beforeImage|afterImage)="([^"]*\.mp4)"/g)];
if (vid.length) {
  console.error(`⛔ ${vid.length} props de imagen apuntan a un .mp4:`);
  for (const v of vid.slice(0, 8)) console.error(`   ${v[1]}="${v[2]}"`);
  process.exit(1);
}
console.log("rewire ✓ (0 props de imagen con video)");
