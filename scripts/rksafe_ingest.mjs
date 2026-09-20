// scripts/rksafe_ingest.mjs <slug> [srcDir] — PNG privados → `public/img/` en JPG, con sus hermanos
// `_blur.jpg`, y las compuertas de ASPECTO y LUMA. Camino compartido del canal Ray Kessler.
//
// ⛔⛔ POR QUÉ EL POOL SE GENERA EN UN DIRECTORIO PRIVADO Y RECIÉN DESPUÉS SE INGESTA:
//    `public/img/` es COMPARTIDO entre sesiones y el estado reanudable de los generadores vive ahí
//    (`_gptimg_batches.json`). Medido: una corrida bajó 191 imágenes de OTRO slug y otra sesión
//    canceló dos batches míos a mitad. Cada sesión genera en `_v3/<slug>/img` y después ingesta.
//
// ⛔ El hermano `<name>_blur.jpg` lo pide el KIT en RUNTIME: no sale de ningún beat, así que ningún
//    escaneo de assets lo ve y el chunk muere con 404 en el farm.
// ⛔ Aspecto: el kit dibuja con `objectFit:"cover"`. Una imagen cuadrada pierde 22 % arriba y 22 %
//    abajo. Se exige 16:9 ± 4 %.
// ⛔ Luma: `metadata=print` escribe en STDERR — con `-v error` el medidor mide CERO y da verde.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_ingest.mjs <slug> [srcDir]'); process.exit(1); }
const SRC = process.argv[3] || `_v3/${SLUG}/img`;
const DST = 'public/img';
fs.mkdirSync(DST, { recursive: true });

const pngs = fs.readdirSync(SRC).filter((f) => /\.png$/i.test(f));
console.log('═'.repeat(70));
console.log(`MEDIDO: ${pngs.length} PNG en ${SRC}`);
if (!pngs.length) { console.error('⛔ nada que ingestar'); process.exit(1); }

const lumaDe = (p) => {
  // ⛔⛔ `metadata=print` escribe en STDERR y ffmpeg SALE CON 0: `execFileSync` devuelve stdout
  //    (vacío) y no hay excepción de la que sacar el stderr, así que el medidor daba "no pude medir"
  //    en las 247. Va `spawnSync`, que devuelve las DOS corrientes pase lo que pase.
  const r = spawnSync('ffmpeg', ['-v', 'info', '-i', p, '-vf',
    'scale=320:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 26 });
  const m = (String(r.stdout || '') + String(r.stderr || '')).match(/YAVG=([\d.]+)/);
  if (m) return +m[1];
  // ⛔⛔ Y UN REINTENTO, PORQUE EL PRIMER PASE MIDE UN JPG RECIÉN ESCRITO. Medido en rkspots: la
  //    primera corrida dio "sin poder medir la luma: 215" y la segunda —con los mismos archivos ya
  //    en disco— midió 215/215. En Windows el archivo puede quedar un instante tomado por el
  //    antivirus/indexador justo después de que ffmpeg lo cierra. Sin este reintento la compuerta
  //    avisa que no midió (bien) pero obliga a correr todo de nuevo para saber si había algo oscuro.
  const r2 = spawnSync('ffmpeg', ['-v', 'info', '-i', p, '-vf',
    'scale=320:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 26 });
  const m2 = (String(r2.stdout || '') + String(r2.stderr || '')).match(/YAVG=([\d.]+)/);
  return m2 ? +m2[1] : null;
};
const dimDe = (p) => {
  const o = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries',
    'stream=width,height', '-of', 'csv=p=0:s=x', p], { encoding: 'utf8' });
  const m = o.match(/(\d+)x(\d+)/);
  return m ? [+m[1], +m[2]] : null;
};

let ok = 0, malAspecto = [], oscuras = [], sinMedir = 0;
const lumas = [];
for (const f of pngs) {
  const name = f.replace(/\.png$/i, '');
  const src = path.join(SRC, f);
  const jpg = path.join(DST, name + '.jpg');
  const blur = path.join(DST, name + '_blur.jpg');
  const d = dimDe(src);
  if (!d) { malAspecto.push(name + ' (ilegible)'); continue; }
  const ar = d[0] / d[1];
  if (Math.abs(ar - 16 / 9) / (16 / 9) > 0.04) { malAspecto.push(`${name} ${d[0]}x${d[1]} (${ar.toFixed(3)})`); continue; }
  if (!fs.existsSync(jpg) || fs.statSync(jpg).size < 8000) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', 'scale=1920:1080:flags=lanczos',
      '-q:v', '4', jpg]);
  }
  if (!fs.existsSync(blur) || fs.statSync(blur).size < 4000) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', jpg, '-vf',
      'scale=480:270,gblur=sigma=14,scale=1920:1080', '-q:v', '6', blur]);
  }
  const L = lumaDe(jpg);
  if (L === null) sinMedir++;
  else { lumas.push(L); if (L < 45) oscuras.push(`${name} YAVG=${L.toFixed(1)}`); }
  ok++;
}

lumas.sort((a, b) => a - b);
console.log(`   ingestadas ${ok} · JPG + hermano _blur.jpg en ${DST}`);
console.log(`   LUMA medida en ${lumas.length} de ${ok}: min ${lumas[0]?.toFixed(1)} · mediana ${lumas[lumas.length >> 1]?.toFixed(1)} · max ${lumas[lumas.length - 1]?.toFixed(1)}`);
console.log(`   ${(sinMedir ? '⛔' : '✓')} sin poder medir la luma: ${sinMedir}`);
console.log(`   ${(oscuras.length ? '⛔' : '✓')} por debajo de YAVG 45: ${oscuras.length}${oscuras.length ? ' → ' + oscuras.slice(0, 8).join(' · ') : ''}`);
console.log(`   ${(malAspecto.length ? '⛔' : '✓')} fuera de 16:9: ${malAspecto.length}${malAspecto.length ? ' → ' + malAspecto.slice(0, 8).join(' · ') : ''}`);
console.log('═'.repeat(70));
process.exit(malAspecto.length || sinMedir ? 2 : 0);
