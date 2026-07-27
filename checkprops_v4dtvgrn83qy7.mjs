// checkprops_v4dtvgrn83qy7.mjs — COMPUERTA propia: caza props que el componente usa como RUTA DE
// IMAGEN pero que en el cues llegan con TEXTO. Existe porque costó un render entero de 20 chunks:
// DepthText declara `back`/`fore` como rutas (foto de fondo + PNG recortado) y los directores les
// pusieron frases; Remotion intentó cargar http://localhost:3000/public/Un%20pedacito%20de%20sol,
// tiró CancelledError y se cayeron 9 chunks. Ni tsc ni esbuild lo ven: los dos tipos son `string`.
import fs from "fs";

const CUES = "src/VideoEdit/cues_v4dtvgrn83qy7.gen.tsx";
const DIR = "src/VideoEdit/scenes";

// 1) por cada componente: qué props terminan como src de un <Media>/<Img>/<OffthreadVideo>
const esperaRuta = {};
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith(".tsx")) continue;
  const src = fs.readFileSync(`${DIR}/${f}`, "utf8");
  const comp = (src.match(/export const ([A-Z]\w*)\s*:\s*React\.FC/) || [])[1];
  if (!comp) continue;
  const s = new Set();
  for (const m of src.matchAll(/<(?:Media|Img|OffthreadVideo|Video|Image)\b[^>]*?\bsrc=\{([A-Za-z_]\w*)/g)) s.add(m[1]);
  for (const m of src.matchAll(/staticFile\(\s*([A-Za-z_]\w*)\s*\)/g)) s.add(m[1]);
  if (s.size) esperaRuta[comp] = [...s];
}

// 2) validar cada uso en el cues
const cues = fs.readFileSync(CUES, "utf8");
const malos = [];
for (const m of cues.matchAll(/<([A-Z][A-Za-z0-9]*)\b([^>]*?)\/>/g)) {
  const [, comp, attrs] = m;
  for (const p of esperaRuta[comp] || []) {
    const v = attrs.match(new RegExp(`\\b${p}="([^"]*)"`));
    if (!v) continue;
    const val = v[1];
    if (!/^(img|broll|vid|real|sfx)\//.test(val)) { malos.push(`${comp}.${p} = "${val.slice(0, 45)}"  ← texto donde va una ruta`); continue; }
    if (!fs.existsSync(`public/${val}`)) malos.push(`${comp}.${p} = "${val}"  ← el archivo NO existe`);
  }
}

if (malos.length) {
  console.error(`\n✖ ${malos.length} prop(s) de imagen mal pasados — esto revienta el render:`);
  for (const b of [...new Set(malos)]) console.error("   " + b);
  process.exit(1);
}
console.log("✓ todos los props de imagen apuntan a un archivo que existe");
