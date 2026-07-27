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

// ── AJUSTE DE RITMO de las listas escalonadas ────────────────────────────────
// Los componentes de lista revelan un ítem cada `stagger` frames, con un default
// pensado para escenas largas (ProcessSteps: 1.9s por paso). En una toma de 3.7s,
// un proceso de 4 pasos NUNCA termina de revelarse: se ve media lista y corta.
// Acá comprimo el stagger para que TODO entre en el ~80% del beat. Nunca lo hago
// más lento que el default, así las escenas holgadas quedan como están.
const LISTAS = {
  ProcessSteps: { prop: "steps", cuenta: /"title":/g, def: 57 },
  Checklist: { prop: "items", cuenta: /"text":/g, def: 21 },
  BarCompare: { prop: "bars", cuenta: /"label":/g, def: 45 },
  CrossSection: { prop: "layers", cuenta: /"label":/g, def: 37 },
  AgedDoc: { prop: "lines", cuenta: /"text":/g, def: 18 },
};
let ritmo = 0;
for (const [comp, cfg] of Object.entries(LISTAS)) {
  const re = new RegExp(`<${comp} durationInFrames=\\{d\\}([\\s\\S]*?) />`, "g");
  s = s.replace(re, (full, props) => {
    if (props.includes("stagger=")) return full;
    const arr = props.match(new RegExp(`${cfg.prop}=\\{(\\[[\\s\\S]*?\\])\\}`));
    if (!arr) return full;
    const N = (arr[1].match(cfg.cuenta) || []).length;
    if (N < 2) return full;
    ritmo++;
    return `<${comp} durationInFrames={d}${props} startAt={10} stagger={Math.max(7, Math.min(${cfg.def}, Math.floor((d * 0.8 - 10) / ${N - 1})))} />`;
  });
}

fs.writeFileSync(F, s);
console.log(`${n ? `re-cableados ${n} import(s) a variantes propias · ` : ""}ritmo ajustado en ${ritmo} listas escalonadas`);
