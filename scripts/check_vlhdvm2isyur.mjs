// check_vlhdvm2isyur.mjs — pre-vuelo: frames totales + todos los assets que el build referencia.
import fs from "fs";
const rd = (f) => {
  const s = fs.readFileSync(f, "utf8");
  const a = s.indexOf("= [") + 2;
  const b = s.lastIndexOf("]") + 1;
  return JSON.parse(s.slice(a, b));
};
const beats = rd("src/_fed6/VideoEdit/federer_vlhdvm2isyur_beats.ts");
const broll = rd("src/_fed6/VideoEdit/federer_vlhdvm2isyur_broll.ts");
const end = Math.max(
  Math.max(...beats.map((x) => x.start + x.dur)),
  broll.length ? broll[broll.length - 1].start + broll[broll.length - 1].dur : 0
) + 1.2;
console.log(`beats ${beats.length} · broll ${broll.length}`);
console.log(`VIDEO_END ${end.toFixed(2)}s → TOTAL_FRAMES ${Math.round(end * 30)}`);

const refs = new Set();
const walk = (o) => {
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === "string" && /\.(png|jpg|jpeg|mp4|webp)$/i.test(v)) refs.add(v);
    else if (typeof v === "object") walk(v);
  }
};
beats.forEach(walk); broll.forEach(walk);
const miss = [...refs].filter((p) => !fs.existsSync("public/" + p));
console.log(`assets referenciados: ${refs.size} · FALTANTES: ${miss.length}`);
if (miss.length) { console.log(miss.join("\n")); process.exit(1); }

// FocusCards exige el derivado _blur.jpg de cada imagen
const fc = beats.filter((b) => b.kind === "focuscards").flatMap((b) => b.items || []);
const missBlur = fc.map((i) => i.image.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg")).filter((p) => !fs.existsSync("public/" + p));
console.log(`focuscards: ${fc.length} tarjetas · blur faltantes: ${missBlur.length}`);
if (missBlur.length) { console.log(missBlur.join("\n")); process.exit(1); }
console.log("✓ pre-vuelo OK");
