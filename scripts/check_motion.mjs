// check_motion.mjs — COMPUERTA DE MOVIMIENTO. Corre ANTES de agnes, sobre `_v3/<slug>_i2v.json`.
//
//   node scripts/check_motion.mjs <slug>
//
// ⛔⛔ POR QUÉ EXISTE. La skill `narrator-video` dice "NUNCA PIDAS RESPIRAR" desde `dale8`, pero el
// pipeline se arma CLONANDO el `_v3/<slug>_i2v_build.mjs` del video anterior — y once de esos
// archivos siguen teniendo la fórmula vieja ("he breathes and blinks once, his shoulders settle").
// En `tcsalmetal` cloné uno de ésos, no contrasté su lista contra la skill, y los 136 clips del
// presentador salieron con Claudio SUSPIRANDO. El creador lo marcó. Una regla escrita en la skill no
// alcanza cuando el material se clona: hace falta una compuerta que la haga cumplir.
//
// Regla que impone: el micro-movimiento va **de los hombros para arriba**. Todo lo que nombre
// respiración, pecho, torso o hombros EN MOVIMIENTO se lee como un suspiro.
import fs from "node:fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/check_motion.mjs <slug>"); process.exit(1); }
const p = `_v3/${slug}_i2v.json`;
if (!fs.existsSync(p)) { console.error(`⛔ falta ${p}`); process.exit(1); }
const items = JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));

// vocabulario de respiración: inequívoco, se marca siempre
const RESPIRA = [
  /\bbreath(e|es|ing|s)?\b/i,
  /\binhal/i,
  /\bexhal/i,
  /\bsigh/i,
  /\blungs?\b/i,
  /\bribs?\b/i,
];

// ⛔ El torso se marca por el VERBO, no por el sustantivo: el menú de la skill dice
//    "the shoulders do NOT move", que es correcto y deseable. Marcar "shoulders" a secas rechazaba
//    la propia receta de la skill — lo cazó el CONTROL POSITIVO de esta compuerta.
const TORSO_AFIRMATIVO = [
  /\bshoulders?\s+(settle|settles|drop|drops|rise|rises|lift|lifts|relax|relaxes|move|moves|shift|shifts|sag|sags)\b/i,
  /\bchest\s+(rise|rises|fall|falls|move|moves|expand|expands)\b/i,
  /\btorso\s+(move|moves|shift|shifts|turn|turns)\b/i,
  /\bsettles? a fraction\b/i,
  /\bhis body settles\b/i,
];

// movimiento de cuerpo entero: agnes lo aprovecha para redibujar la escena
const CUERPO = [
  /\bshifts? (his|her|their) weight\b/i,
  /\bleans? (in|back|forward)\b/i,
  /\bstands? up\b/i,
  /\bwalks?\b/i,
  /\bturns? around\b/i,
];

const problemas = [];
const P = (i, n, m) => problemas.push(`#${i} ${n}: ${m}`);

items.forEach((it, i) => {
  const mo = String(it.motion || "");
  if (!mo.trim()) { P(i, it.nombre, "sin `motion`"); return; }
  for (const r of RESPIRA) if (r.test(mo)) P(i, it.nombre, `⛔ RESPIRACIÓN: ${r} → "${mo.slice(0, 70)}…"`);
  for (const r of TORSO_AFIRMATIVO) if (r.test(mo)) P(i, it.nombre, `⛔ TORSO EN MOVIMIENTO (se lee como suspiro): ${r}`);
  for (const r of CUERPO) if (r.test(mo)) P(i, it.nombre, `movimiento de cuerpo entero (agnes redibuja): ${r}`);
});

// variedad: dos clips SEGUIDOS no pueden traer el mismo movimiento
for (let k = 1; k < items.length; k++) {
  if (items[k].motion && items[k].motion === items[k - 1].motion) {
    P(k, items[k].nombre, "movimiento IDÉNTICO al anterior (metrónomo)");
  }
}

const usados = new Map();
for (const it of items) usados.set(it.motion, (usados.get(it.motion) || 0) + 1);
console.log(`clips a animar ${items.length} · movimientos distintos ${usados.size}`);
const top = [...usados.entries()].sort((a, b) => b[1] - a[1])[0];
if (top && top[1] / items.length > 0.45) {
  P(0, "(global)", `un solo movimiento cubre el ${Math.round(100 * top[1] / items.length)} % de los clips`);
}

if (problemas.length) {
  console.error(`\n⛔ ${problemas.length} problemas de movimiento — NO LANCES agnes:`);
  problemas.slice(0, 40).forEach((x) => console.error("   " + x));
  if (problemas.length > 40) console.error(`   … y ${problemas.length - 40} más`);
  console.error(`\nMenú breath-free (skill narrator-video, Fase 6 — variar, uno por clip):`);
  console.error(`  · he blinks once, slowly, and his gaze shifts a few degrees to one side; the rest of him is motionless`);
  console.error(`  · his jaw shifts a little as he thinks and one eyebrow moves; nothing below the neck moves at all`);
  console.error(`  · a single slow blink and the smallest tilt of the head; the shoulders do not move`);
  console.error(`  · his eyes move to something off to the side and come back; he holds the same posture throughout`);
  console.error(`  · the fingers already resting adjust their grip by a millimetre and he blinks; nothing else moves`);
  process.exit(1);
}
console.log("✓ MOVIMIENTO LIMPIO — 0 respiraciones, 0 torso, 0 repetidos consecutivos");
