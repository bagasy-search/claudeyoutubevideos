// dark_gate.mjs — caza FRAMES NEGROS / casi negros en clips e imagenes. GRATIS y determinista.
//   node scripts/dark_gate.mjs <dir> [umbral=8]
//     <dir> = carpeta de stills .jpg  (o public/broll para sacar el still solo)
//
// Por que existe: NINGUN modelo de vision los caza. En el bake-off del 23/08/2026 sobre un frame
// practicamente negro, gpt-4o-mini, gpt-4.1-mini y gpt-4.1-nano dijeron los tres "ok:true".
// Medir la luminancia media cuesta 0 y los caza al 100%.
//
// Medido en grcoffee: 7 clips salieron con luminancia 0-7 sobre 255 — TODOS del mismo ambiente
// ("dressing table en un cuarto oscuro, una bombilla"). Y las IMAGENES del mismo prompt salieron
// bien (37-109): agnes-VIDEO oscurece mucho mas que agnes-IMAGEN. O sea que la solucion no es
// regenerar el clip, es degradar ese momento a su foto de respaldo.
import { readdirSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const DIR = process.argv[2];
const UMBRAL = +(process.argv[3] || 8);
if (!DIR || !existsSync(DIR)) { console.error("uso: node scripts/dark_gate.mjs <dir de stills> [umbral]"); process.exit(1); }
const FF = process.env.FFMPEG || "ffmpeg";

const lum = (f) => {
  try {
    const out = execFileSync(FF, ["-v", "error", "-i", f, "-vf", "scale=1:1", "-f", "rawvideo",
                                  "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 20 });
    return out.length ? out[0] : null;
  } catch { return null; }
};

const files = readdirSync(DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f)).sort();
const rows = [];
for (const f of files) { const v = lum(join(DIR, f)); if (v !== null) rows.push([f, v]); }
rows.sort((a, b) => a[1] - b[1]);

const negros = rows.filter(([, v]) => v <= UMBRAL);
console.log(`── LUMINANCIA · ${rows.length} archivos · umbral ${UMBRAL}/255`);
console.log("   los 8 más oscuros:");
for (const [f, v] of rows.slice(0, 8)) console.log(`     ${String(v).padStart(3)}  ${f}`);
if (!negros.length) { console.log("\n✅ ninguno por debajo del umbral — sin frames negros"); process.exit(0); }
console.log(`\n⛔ ${negros.length} prácticamente NEGROS (ningún modelo de visión los caza):`);
for (const [f, v] of negros) console.log(`   ${String(v).padStart(3)}  ${f}`);
console.log("\n   → degradá esos momentos a su FOTO de respaldo (_asimage.json). Regenerar el clip");
console.log("     no suele servir: es el ambiente del prompt lo que sale oscuro en video.");
process.exit(1);
