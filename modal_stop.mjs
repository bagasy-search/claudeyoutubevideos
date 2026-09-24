// modal_stop.mjs — KILL SWITCH. Detiene TODOS los contenedores Modal activos al instante.
// Corré esto cuando quieras asegurarte de que NADA quede corriendo (cero cobro de GPU).
// Las apps siguen deployadas (los endpoints funcionan); solo mata los contenedores prendidos.
//
// ⛔ NO ES SEGURO CON VARIOS VIDEOS EN PRODUCCIÓN. Mata TODOS los contenedores del workspace, sin
// distinguir de quién son: si otro agente está generando imágenes o transcribiendo, le tirás el
// trabajo abajo y tiene que rehacerlo. Por eso ahora exige confirmación explícita.
//   node modal_stop.mjs            → NO hace nada, solo te muestra qué mataría
//   MODAL_KILL=si node modal_stop.mjs → mata de verdad
import { execSync } from "child_process";
const kenv = { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" };
const k = (a) => execSync(`python -m modal ${a}`, { env: kenv }).toString();
const ARMADO = process.env.MODAL_KILL === "si" || process.argv.includes("--force");

let out = "";
try { out = k("container list"); } catch (e) { out = e.stdout?.toString() || ""; }
const ids = [...new Set([...out.matchAll(/ta-[A-Za-z0-9]+/g)].map((m) => m[0]))];
if (!ids.length) { console.log("✓ Nada corriendo — cero contenedores activos."); process.exit(0); }
if (!ARMADO) {
  console.log(`⛔ FRENO DE SEGURIDAD — no maté nada.\n`);
  console.log(`Hay ${ids.length} contenedor(es) activo(s): ${ids.join(", ")}`);
  console.log(`Estos contenedores pueden ser de OTRO video que se está produciendo ahora mismo`);
  console.log(`(imágenes, TTS o Whisper de otro agente). Matarlos le tira el trabajo abajo.\n`);
  console.log(`Si igual querés matar TODO:  MODAL_KILL=si node modal_stop.mjs`);
  console.log(`Si solo querés dejar de gastar GPU: no hagas nada — Modal apaga los contenedores`);
  console.log(`solos por scaledown_window apenas terminan de trabajar.`);
  process.exit(0);
}
console.log(`deteniendo ${ids.length} contenedor(es)...`);
for (const id of ids) {
  try { k(`container stop ${id} -y`); console.log("  ✓ detenido", id); } catch (e) { console.log("  ✗", id, e.message?.slice(0, 80)); }
}
console.log("✓ Listo — nada quedó corriendo.");
