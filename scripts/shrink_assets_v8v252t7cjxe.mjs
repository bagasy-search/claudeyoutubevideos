// shrink_assets_v8v252t7cjxe.mjs — deja los assets por debajo del tope de 2 GB del release del farm.
// Gotcha documentado del canal (2026-07-26 #2): un video largo da 3 GB y el release lo rechaza.
//   · b-roll  → 720p, RECORTADO a la duración que realmente usa el build (+0.5s de cola) y sin audio
//   · imágenes→ JPG q3 (las PNG de gpt-image pesan ~2.3 MB cada una)
// Después hay que reapuntar las rutas .png → .jpg en los archivos GENERADOS (gotcha #3: si queda una
// ruta .png escrita a mano, el asset da 404 y el chunk MUERE).
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "v8v252t7cjxe";
const modo = process.argv[2] || "all";

const MB = (p) => { try { return fs.statSync(p).size / 1048576; } catch { return 0; } };

if (modo === "broll" || modo === "all") {
  const ts = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8");
  const usados = new Map();
  for (const m of ts.matchAll(/"src":"broll\/([^"]+)\.mp4","start":[\d.]+,"dur":([\d.]+)/g)) usados.set(m[1], +m[2]);
  let antes = 0, despues = 0, n = 0;
  for (const [name, dur] of usados) {
    const src = `public/broll/${name}.mp4`;
    const tmp = `public/broll/${name}.tmp.mp4`;
    if (!fs.existsSync(src)) continue;
    const a = MB(src);
    // +0.5s de cola: el Main solapa 3 frames entre tomas
    const t = Math.max(1.2, dur + 0.5);
    try {
      execFileSync("ffmpeg", ["-y", "-t", String(t.toFixed(2)), "-i", src,
        "-vf", "scale=-2:720", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
        "-g", "30", "-keyint_min", "30", "-tune", "fastdecode", "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp],
        { stdio: "ignore" });
      if (MB(tmp) > 0.02) { fs.rmSync(src); fs.renameSync(tmp, src); }
      else { fs.rmSync(tmp, { force: true }); }
    } catch { try { fs.rmSync(tmp, { force: true }); } catch {} continue; }
    antes += a; despues += MB(src); n++;
  }
  console.log(`b-roll: ${n} clips · ${antes.toFixed(0)} MB → ${despues.toFixed(0)} MB`);
}

if (modo === "img" || modo === "all") {
  const files = fs.readdirSync("public/img").filter((f) => f.includes(SLUG) && f.endsWith(".png"));
  let antes = 0, despues = 0, n = 0, fail = 0;
  for (const f of files) {
    const src = `public/img/${f}`;
    const dst = src.replace(/\.png$/, ".jpg");
    const a = MB(src);
    try {
      execFileSync("ffmpeg", ["-y", "-i", src, "-q:v", "3", dst], { stdio: "ignore" });
      // ⚠ nunca borres el original sin comprobar que el destino salió bien (un JPG de 0 bytes
      // hace que ffmpeg reviente después y en Windows abre un cartel que BLOQUEA el pipeline)
      if (MB(dst) > 0.01) { fs.rmSync(src); despues += MB(dst); n++; }
      else { fs.rmSync(dst, { force: true }); fail++; }
    } catch { fail++; }
    antes += a;
  }
  console.log(`imágenes: ${n} convertidas (${fail} falladas) · ${antes.toFixed(0)} MB → ${despues.toFixed(0)} MB`);

  // reapuntar las rutas en TODO lo generado
  const tocar = [
    `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
    `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
    `beatsheet/${SLUG}.json`,
  ];
  for (const p of tocar) {
    if (!fs.existsSync(p)) continue;
    const s = fs.readFileSync(p, "utf8");
    const s2 = s.replace(new RegExp(`(img/[a-z0-9_]*${SLUG}[a-z0-9_]*)\\.png`, "gi"), "$1.jpg");
    if (s2 !== s) { fs.writeFileSync(p, s2); console.log(`  ↻ rutas .png→.jpg en ${p}`); }
  }
}

// verificación final: ninguna ruta del build puede apuntar a un archivo que no existe
const chequear = [`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`, `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`];
const faltan = new Set();
for (const p of chequear) {
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, "utf8").matchAll(/"((?:img|broll|vid|real)\/[^"]+)"/g)) {
    if (!fs.existsSync(`public/${m[1]}`)) faltan.add(m[1]);
  }
}
if (faltan.size) { console.error(`\n⛔ ${faltan.size} rutas ROTAS (404 en el farm = chunk muerto):`, [...faltan].slice(0, 10)); process.exit(1); }
console.log("✓ todas las rutas del build existen en disco");
