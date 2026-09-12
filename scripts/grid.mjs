// grid.mjs — AUDITORÍA PREVIA AL RENDER (barata).
// Saca N frames del build en la nube y te baja una cuadrícula de contacto para mirarla.
//
// Para qué: auditar ANTES de rendear. Un render completo son ~20 jobs y varios minutos; esto es 1 job
// de ~2 min. Si hay un frame negro, un asset que no cargó, el avatar ausente en los primeros 2s o un
// visual fuera de tema, lo ves ACÁ — y corregís sin haber pagado un render entero.
//
// Uso:
//   node scripts/grid.mjs <slug> <comp_id> <total_frames> [count=12]
//   (ENTRY=src/index_<slug>.tsx y FARM_REF=molino-<slug> se respetan igual que en farm.mjs)
//
// Requisitos: los assets ya subidos (o sea, corré esto DESPUÉS de que farm.mjs haya hecho el tarball
// al menos una vez para este slug — el workflow baja el release assets-<slug>).
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Saca los flags Y sus valores, si no `--from 3072` metía "3072" entre los posicionales
// (hoy no rompe porque sólo se leen los 4 primeros, pero rompería si los flags van antes).
const argv = process.argv.slice(2);
const pos = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
const [slug, comp, total, count = "12"] = pos;
// Rango opcional: auditar UNA escena de cerca (los N frames caen DENTRO de la ventana) en vez de
// muestrear los 20 min enteros — en un barrido completo una escena de 8s no aparece.
const flag = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : ""; };
const from = flag("--from"), to = flag("--to");
if (!slug || !comp || !total) {
  console.error("Uso: node scripts/grid.mjs <slug> <comp_id> <total_frames> [count] [--from N --to M]");
  process.exit(1);
}
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();
const ref = process.env.FARM_REF ? ` --ref ${process.env.FARM_REF}` : "";
const entry = process.env.ENTRY ? ` -f entry=${process.env.ENTRY}` : "";

console.log("disparando stills.yml (auditoría previa) ...");
const rango = from && to ? ` -f from=${from} -f to=${to}` : "";
if (rango) console.log(`   (rango: frames ${from}–${to} — auditoría de UNA escena)`);
sh(`gh workflow run stills.yml${ref} -f slug=${slug} -f comp_id=${comp} -f total_frames=${total} -f count=${count}${entry}${rango}`);

execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
// filtrar por LA RAMA de este video: con varios agentes, sin -b agarrás la corrida de otro
const runId = out(`gh run list --workflow=stills.yml${process.env.FARM_REF ? ` -b ${process.env.FARM_REF}` : ""} --limit 1 --json databaseId --jq ".[0].databaseId"`);
console.log("corrida:", runId, "— esperando (~2 min) ...");
try { sh(`gh run watch ${runId} --exit-status`); }
catch { console.error("falló; revisá: gh run view " + runId); process.exit(1); }

const dest = path.join("public", "_audit", slug);
fs.mkdirSync(dest, { recursive: true });
sh(`gh run download ${runId} -n stills-${slug} -D "${dest}"`);
console.log(`\n✅ cuadrícula → ${dest}\\grid-${slug}.jpg`);
console.log(`   frames sueltos → ${dest}\\stills\\`);
console.log(`\nMIRALA antes de rendear. Chequeá: (1) frames 15 y 45 = avatar hablando a pantalla completa,`);
console.log(`(2) ningún frame negro o con asset roto, (3) los visuales corresponden a lo que se dice,`);
console.log(`(4) hay b-roll de verdad y no solo avatar + carteles.`);
process.exit(0);
