// antihueco_clembudo.mjs — COMPUERTA ANTI-HUECO de `clembudo`.
//
//   node scripts/antihueco_clembudo.mjs
//
// Qué mide: cada 0,2 s de los 731,14 s, si el avatar está OCULTO y no hay NINGÚN cue tapando ese
// instante, el cuadro se queda sin nada. `blackdetect` no siempre lo ve (pide 0,5 s seguidos) y la
// luma tampoco, si el hueco dura menos que el muestreo.
//
// ⛔⛔ SE MIDE SOBRE LO GENERADO, NO SOBRE EL PLAN. El plan trae beats de avatar que cubren todo,
// pero después el build le saca b-roll (las 2 ventanas del QR + los solapes de los componentes) y
// recién ahí aparecen los huecos. Así que la fuente de verdad son `cues_clembudo.gen.tsx` y
// `avatar_clembudo.gen.ts`, los dos archivos que realmente se rinden.
//
// ⛔ Y VA CON CONTROL POSITIVO. Una compuerta que puede dar "0 huecos" sin haber mirado nada es un
// fallo silencioso: hay que sacar un cue que SÍ estaba tapando y verificar que aparezcan huecos.
// (La primera versión de esta compuerta sacaba un cue de un tramo ya cubierto por un movimiento,
// así que no creaba ningún hueco y "confirmaba" el gate sin probar nada.)
import { readFileSync } from "node:fs";

const FPS = 30;
const STEP = 0.2;

const cuesSrc = readFileSync("src/VideoEdit/cues_clembudo.gen.tsx", "utf8");
const avSrc = readFileSync("src/VideoEdit/avatar_clembudo.gen.ts", "utf8");

const TOTAL_FRAMES = +avSrc.match(/TOTAL_FRAMES_CLEMBUDO\s*=\s*(\d+)/)[1];
const TOTAL = TOTAL_FRAMES / FPS;
const WINDOWS = JSON.parse(avSrc.match(/AVATAR_WINDOWS\s*=\s*(\[[\s\S]*?\])\s*as const/)[1]);

// sólo los CUES tapan: los OVERLAYS (el QR) flotan al costado y no ocultan el avatar
const cuesBlock = cuesSrc.slice(cuesSrc.indexOf("export const CUES"), cuesSrc.indexOf("export const OVERLAYS"));
// ⛔ TODO EN FRAMES ENTEROS, NUNCA EN SEGUNDOS FLOTANTES. Acumular `t += 0.2` arrastra error de
// coma flotante y en un borde exacto (un componente que arranca en 176,00 s) el muestreo cae en
// 175,99999999 y la compuerta reporta un hueco que NO EXISTE: reportó 5 fantasmas. El build
// convierte con Math.round(s*30), así que hay que medir en los MISMOS frames que se rinden.
const parseCues = (txt) =>
  [...txt.matchAll(/key:\s*"([^"]+)",\s*start:\s*([\d.]+),\s*dur:\s*([\d.]+)/g)].map((m) => ({
    key: m[1],
    a: Math.round(+m[2] * FPS),
    z: Math.round(+m[2] * FPS) + Math.max(1, Math.round(+m[3] * FPS)),
  }));
const CUES = parseCues(cuesBlock);

const modoEn = (fr) => {
  let m = "full";
  for (const w of WINDOWS) { if (Math.round(w.start * FPS) <= fr) m = w.mode; else break; }
  return m;
};

const medir = (cues) => {
  const paso = Math.round(STEP * FPS);   // 6 frames
  let huecos = 0, medidos = 0, primero = null;
  for (let fr = 0; fr < TOTAL_FRAMES; fr += paso) {
    medidos++;
    if (modoEn(fr) !== "hidden") continue;
    if (!cues.some((c) => c.a <= fr && c.z > fr)) {
      huecos++;
      if (primero === null) primero = fr / FPS;
    }
  }
  return { huecos, medidos, primero };
};

const real = medir(CUES);
console.log(`ANTI-HUECO · clembudo · ${TOTAL.toFixed(2)}s (${TOTAL_FRAMES} frames)`);
console.log(`  instantes MEDIDOS : ${real.medidos}   (cada ${STEP}s · ${CUES.length} cues · ${WINDOWS.length} ventanas de avatar)`);
console.log(`  instantes con el avatar oculto y NADA debajo : ${real.huecos}`);
if (real.huecos) console.log(`  primero en ${real.primero.toFixed(2)}s`);

// ── CONTROL POSITIVO ─────────────────────────────────────────────────────────────────────────
// Sacar un cue que SÍ estaba tapando (uno cuyo tramo esté en `hidden` y que nadie más cubra) y
// comprobar que la compuerta lo acusa. Si no aparecen huecos, la compuerta no mide nada.
const candidato = CUES.find((c) => {
  const fr = Math.floor((c.a + c.z) / 2);
  return modoEn(fr) === "hidden" && !CUES.some((o) => o !== c && o.a <= fr && o.z > fr);
});
if (!candidato) {
  console.log("\n⛔ CONTROL POSITIVO IMPOSIBLE: no encontré un cue que sea el único que tapa su tramo.");
  process.exit(1);
}
const ctrl = medir(CUES.filter((c) => c !== candidato));
console.log(`\nCONTROL POSITIVO · saco el cue ${candidato.key} (${(candidato.a / FPS).toFixed(2)}-${(candidato.z / FPS).toFixed(2)}s, el único que tapaba ahí)`);
console.log(`  huecos con ese cue fuera : ${ctrl.huecos}   (esperado: > 0)`);

if (ctrl.huecos <= real.huecos) {
  console.log("⛔ LA COMPUERTA NO MIDE NADA: saqué un cue que tapaba y no aparecieron huecos.");
  process.exit(1);
}
if (real.huecos > 0) {
  console.log("\n⛔ HAY HUECOS. Después de cualquier splice hay que volver a tapar con avatar.");
  process.exit(1);
}
console.log("\n✅ 0 instantes con el avatar oculto y nada debajo — y la compuerta demostró que mide.");
