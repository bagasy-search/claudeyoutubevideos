// scripts/rksafe_gate_timeline.mjs — SIMULA LA LÍNEA DE TIEMPO y mide lo que ninguna otra compuerta ve.
//   node scripts/rksafe_gate_timeline.mjs <slug>
//
// Tres cosas, las tres con el número a la vista (una compuerta que puede dar 0 sin mirar nada no es un OK):
//
// 1. AVATAR TAPADO / FONDO MUERTO. El anti-hueco clásico pregunta "¿hay avatar donde no hay
//    contenido?". En el flujo `rksafe` con `RayAvatar` el avatar es el PISO GARANTIZADO del video
//    entero, así que el fondo muerto es imposible por construcción — pero eso hay que MEDIRLO, no
//    afirmarlo: se simula cada 0,2 s y se cuenta. (En el flujo con `RayAvatarWin`, donde el avatar
//    es un plano más, este número SÍ puede dar distinto de 0.)
// 2. SOLAPES DE LA CAPA BASE. Dos cues base al mismo tiempo = uno tapa al otro, y el que se pierde
//    es material que se generó y se pagó. El CTA no cuenta: es overlay y va ENCIMA a propósito.
// 3. HUECOS DE 1 CUADRO. El Main redondea `from` y `durationInFrames` por SEPARADO, así que
//    53,94 + 0,98 termina en el cuadro 1647 y el siguiente arranca en el 1648: 33 ms de fondo a la
//    vista que `blackdetect` NO ve (pide 0,4 s) y el ojo sí.
import fs from 'node:fs';
import path from 'node:path';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_gate_timeline.mjs <slug>'); process.exit(1); }
const cfg = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_cfg.mjs`).replace(/\\/g, '/'));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const FPS = plan.fps, TOTAL = plan.total, AVATAR_END = plan.avatarEnd;
const OV = new Set(cfg.OVERLAY);
const F = (s) => Math.round(s * FPS);

const base = plan.beats.filter((b) => !(b.kind === 'componente' && OV.has(b.comp)))
  .map((b) => ({ ...b, f0: F(b.t), f1: F(b.t) + Math.max(1, F(b.dur)) }))
  .sort((a, b) => a.f0 - b.f0);
const overlays = plan.beats.filter((b) => b.kind === 'componente' && OV.has(b.comp));

// ── 1 y 3: recorrer la línea de tiempo cuadro a cuadro ────────────────────
const cubierto = new Uint8Array(F(TOTAL) + 2);
for (const b of base) for (let f = b.f0; f < b.f1 && f < cubierto.length; f++) cubierto[f] = 1;

let pasos = 0, tapado = 0;
for (let s = 0; s < TOTAL; s += 0.2) {          // el muestreo que pide la regla anti-hueco
  pasos++;
  const f = F(s);
  // avatar TAPADO = el avatar no está disponible como fondo y tampoco hay contenido encima.
  // Con `RayAvatar` el avatar cubre 0..TOTAL, así que esto sólo puede dispararse si el plan
  // declara un AVATAR_END por debajo del total y ahí no hay nada arriba.
  const avatarDisponible = s < AVATAR_END + 1e-6;
  if (!avatarDisponible && !cubierto[f]) tapado += 0.2;
}

// ── 2: solapes de la capa base ────────────────────────────────────────────
let solapes = 0, segSolape = 0, peor = null;
for (let i = 1; i < base.length; i++) {
  const d = base[i - 1].f1 - base[i].f0;
  if (d > 0) { solapes++; segSolape += d / FPS; if (!peor || d > peor.d) peor = { d, t: base[i].t, a: base[i - 1].asset || base[i - 1].comp, b: base[i].asset || base[i].comp }; }
}

// ── 3: huecos de 1-2 cuadros entre cues consecutivos ──────────────────────
let micro = 0, segMicro = 0;
for (let i = 1; i < base.length; i++) {
  const g = base[i].f0 - base[i - 1].f1;
  if (g > 0 && g <= 3) { micro++; segMicro += g / FPS; }
}
const huecosLargos = [];
for (let i = 1; i < base.length; i++) {
  const g = (base[i].f0 - base[i - 1].f1) / FPS;
  if (g > 0.1) huecosLargos.push({ t: base[i - 1].f1 / FPS, g });
}

const cubiertos = cubierto.reduce((a, b) => a + b, 0);
console.log('═'.repeat(72));
console.log(`TIMELINE · ${SLUG} · ${base.length} cues de base + ${overlays.length} overlay · ${F(TOTAL)} cuadros`);
console.log(`  instantes simulados (cada 0,2 s): ${pasos}`);
console.log(`  AVATAR TAPADO / fondo muerto:     ${tapado.toFixed(2)} s   (tiene que dar 0) ${tapado < 0.05 ? '✓' : '⛔'}`);
console.log(`  SOLAPES de la capa base:          ${solapes} (${segSolape.toFixed(2)} s) ${solapes ? '⛔' : '✓'}`);
if (peor) console.log(`     el peor: ${(peor.d / FPS).toFixed(2)} s en ${(peor.t / 60).toFixed(1)} min · ${peor.a} tapa a ${peor.b}`);
console.log(`  HUECOS de 1-3 cuadros:            ${micro} (${segMicro.toFixed(2)} s) ${micro ? '⚠️ destellos de 33 ms' : '✓'}`);
console.log(`  huecos > 0,1 s (avatar a la vista): ${huecosLargos.length} · el mayor ${huecosLargos.length ? Math.max(...huecosLargos.map((h) => h.g)).toFixed(1) : 0} s`);
console.log(`  cobertura por CUADRO:             ${(cubiertos / F(TOTAL) * 100).toFixed(1)}%`);
console.log(`  avatar a la vista (cara sola):    ${((F(TOTAL) - cubiertos) / FPS).toFixed(0)} s = ${((F(TOTAL) - cubiertos) / F(TOTAL) * 100).toFixed(1)}%`);
console.log('═'.repeat(72));
process.exit(tapado >= 0.05 || solapes ? 2 : 0);
