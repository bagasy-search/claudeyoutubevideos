// rewire_vxsag2ipph2js.mjs — post-proceso del cues GENERADO.
// beatsheet.mjs importa siempre el componente COMPARTIDO; acá re-cableo los que
// tienen variante propia de ESTE video. Se corre DESPUÉS de beatsheet.mjs.
import fs from "node:fs";

const F = "src/VideoEdit/cues_vxsag2ipph2js.gen.tsx";
let s = fs.readFileSync(F, "utf8");
let n = 0;

// AlertWipe → AlertWipeVx (el compartido corta el texto de las advertencias largas)
if (s.includes('import { AlertWipe } from "./scenes/AlertWipe";')) {
  s = s.replace('import { AlertWipe } from "./scenes/AlertWipe";',
    'import { AlertWipeVx as AlertWipe } from "./scenes/AlertWipe_vxsag2ipph2js";');
  n++;
}

fs.writeFileSync(F, s);
console.log(n ? `re-cableados ${n} import(s) a variantes propias` : "sin cambios (¿ya estaba re-cableado?)");
