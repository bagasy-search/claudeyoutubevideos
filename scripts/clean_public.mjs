// clean_public.mjs -- higiene del public/ compartido (28GB, todos los videos apilan assets aca).
//
//   node scripts/clean_public.mjs            # DRY-RUN: reporta, no borra
//   node scripts/clean_public.mjs --apply    # borra los PNG redundantes (con gemelo .jpg)
//
// QUE HACE, cero riesgo:
//   1) PNG redundante = un .png que tiene un .jpg con el MISMO basename -> el jpg conserva el
//      contenido (el resolver y el tar usan jpg), asi que el png es copia muerta. Solo esos se borran.
//   2) Reporta el footprint por VIDEO (prefijo del slug) para decidir a mano que video viejo purgar.
// NUNCA toca: jpg, mp4, wav, ni ningun png sin gemelo jpg (iconos/QR con alpha quedan intactos).
import fs from "node:fs";
import path from "node:path";

const APPLY = process.argv.includes("--apply");
const ROOT = "public";
const DIRS = ["img", "broll", "."].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d));
const GB = (n) => (n / 1e9).toFixed(2) + " GB";
const MB = (n) => (n / 1e6).toFixed(1) + " MB";

// 1) PNG redundantes
let redun = [], freed = 0;
for (const dir of DIRS) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.toLowerCase().endsWith(".png")) continue;
    const jpg = path.join(dir, f.slice(0, -4) + ".jpg");
    if (fs.existsSync(jpg)) {
      const p = path.join(dir, f);
      try { redun.push(p); freed += fs.statSync(p).size; } catch {}
    }
  }
}
console.log(`PNG redundantes (con gemelo .jpg): ${redun.length} = ${GB(freed)}`);
if (APPLY) {
  let n = 0; for (const p of redun) { try { fs.unlinkSync(p); n++; } catch (e) { console.log("  skip", p, e.message); } }
  console.log(`  BORRADOS ${n} PNG -> liberado ${GB(freed)}`);
} else if (redun.length) {
  console.log(`  (dry-run) corre con --apply para borrarlos`);
}

// 2) Footprint por video (prefijo del slug = primer token antes de "_")
const img = path.join(ROOT, "img"), broll = path.join(ROOT, "broll");
const bucket = new Map();
for (const dir of [img, broll].filter((d) => fs.existsSync(d))) {
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^([a-z0-9]+?)_/i);
    const key = m ? m[1] : "(otros)";
    let sz = 0; try { sz = fs.statSync(path.join(dir, f)).size; } catch {}
    const b = bucket.get(key) || { n: 0, bytes: 0 };
    b.n++; b.bytes += sz; bucket.set(key, b);
  }
}
const top = [...bucket.entries()].sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 25);
console.log(`\nFootprint por prefijo de video (top 25 · img+broll):`);
let total = 0;
for (const [k, v] of top) { console.log(`  ${String(k).padEnd(18)} ${String(v.n).padStart(5)} archivos  ${MB(v.bytes).padStart(11)}`); total += v.bytes; }
console.log(`  ${"—".repeat(40)}`);
console.log(`  top-25 suman ${GB(total)}. Para purgar un video viejo: borra a mano public/img/<slug>_* y public/broll/<slug>_*`);
