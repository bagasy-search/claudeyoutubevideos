// dress_cuts_vucm3bvd869j.mjs — re-viste los cortes de un cues_<slug>.gen.tsx YA generado.
// Motivo (corrección del creador, 2026-07-26): "usás siempre la misma transición y cansa;
// a veces simplemente es sin transición".
//   · CORTE SECO (sin transición) para la mayoría de las tomas rápidas: se logra alargando
//     totalF en 2·WHIP y montando la escena con <Sequence from={-WHIP}> en el Main, así el
//     TransitionShell ya está asentado cuando aparece y nunca llega a su salida.
//   · Cuando SÍ hay transición, rota entre las 4 variantes del kit (whip/lift/iris/fold).
// Trabaja sobre el archivo generado (no necesita captions ni assets en disco).
import fs from "fs";

const P = "src/VideoEdit/cues_vucm3bvd869j.gen.tsx";
const WHIP = 12;
const VARIANTES = ["whip", "lift", "iris", "fold"];
const PATRON_TOMA = [null, null, 0, null, 1, null, 2]; // 4 secas + 3 con transición
let src = fs.readFileSync(P, "utf8");

src = src.replace(
  "export type Cue = {start: number; dur: number; node: React.ReactNode};",
  "export type Cue = {start: number; dur: number; cut?: boolean; node: React.ReactNode};"
);

let vi = 0, nComp = 0, nShot = 0, cuts = 0, trans = 0;
const nextVar = () => VARIANTES[(vi = (vi + 1) % VARIANTES.length)];

src = src.replace(
  /\{start: ([\d.]+), dur: ([\d.]+), node: \(\r?\n    (<[^\r\n]*)\r?\n  \)\},/g,
  (_m, start, dur, node) => {
    const esToma = /^<FedFullShot\b/.test(node);
    let treat;
    if (esToma) { treat = PATRON_TOMA[nShot++ % PATRON_TOMA.length]; treat = treat === null ? null : VARIANTES[treat]; }
    else { treat = (nComp++ % 4 === 3) ? null : nextVar(); }

    if (!/totalF=\{/.test(node)) { trans++; return `{start: ${start}, dur: ${dur}, node: (\n    ${node}\n  )},`; }
    if (treat === null) {
      cuts++;
      const n2 = node.replace(/totalF=\{(\d+)\}/, (_x, n) => `totalF={${+n + 2 * WHIP}}`);
      return `{start: ${start}, dur: ${dur}, cut: true, node: (\n    ${n2}\n  )},`;
    }
    trans++;
    const n2 = node.replace(/^<([A-Za-z0-9]+)/, (_x, c) => `<${c} variant="${treat}"`);
    return `{start: ${start}, dur: ${dur}, node: (\n    ${n2}\n  )},`;
  }
);

fs.writeFileSync(P, src);
console.log(`cortes SECOS: ${cuts} · con transición: ${trans} (tomas ${nShot}, componentes ${nComp})`);
