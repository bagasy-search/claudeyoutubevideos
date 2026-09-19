// scripts/rksafe_stock_audit.mjs <slug> — audita a OJO (visión) el metraje REAL ya conformado y
// escribe `_v3/<slug>_real.mjs` sólo con los que sobreviven. Camino compartido del canal Ray Kessler.
//
//   node scripts/rksafe_stock_audit.mjs <slug> [--frames] [--solo-frames]
//
// ⛔⛔ NINGÚN MEDIDOR NUMÉRICO VE ESTO. La luma está bien, el fps está bien, el archivo existe — y el
//    clip igual muestra a un DESCONOCIDO MIRANDO A CÁMARA, o una palabra ambigua trajo otra cosa
//    ("gas meter" devolvió una estación de servicio; "barbecue", costillas a la parrilla). Se auditan
//    DOS cuadros por clip a 400 px, y se descarta toda persona reconocible: en un video sobre dónde
//    esconder objetos de valor, un extraño identificable en el cuadro es una persona real a la que el
//    montaje le estaría insinuando algo.
// ⛔ El único juez que sirve acá es de VISIÓN (gratis, agnes) + la hoja de contactos. Ver
//    reference_stock_gente_ajena_y_palabras_ambiguas.
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_stock_audit.mjs <slug>'); process.exit(1); }
const SOLO_FRAMES = process.argv.includes('--solo-frames');
const DIR = `public/broll/${SLUG}_real`;
const FR = `_v3/${SLUG}_stockframes`;
const MAPA = `_v3/${SLUG}_stockmap.json`;
fs.mkdirSync(FR, { recursive: true });

if (!fs.existsSync(DIR)) { console.error(`⛔ no existe ${DIR} — corré antes rksafe_stock_conform.mjs`); process.exit(1); }
const clips = fs.readdirSync(DIR).filter((f) => f.endsWith('.mp4')).map((f) => f.replace(/\.mp4$/, '')).sort();
console.log('═'.repeat(74));
console.log(`MEDIDO: ${clips.length} clips conformados en ${DIR}`);
if (!clips.length) process.exit(1);

const durDe = (p) => {
  try {
    const o = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], { encoding: 'utf8' });
    return +(o.match(/[\d.]+/) || [0])[0];
  } catch { return 0; }
};

// ── DOS cuadros por clip, a 400 px ────────────────────────────────────────────────────────────
const manifest = [];
let sacados = 0;
for (const id of clips) {
  const p = `${DIR}/${id}.mp4`;
  const d = durDe(p);
  for (const [tag, frac] of [['a', 0.15], ['b', 0.70]]) {
    const out = `${FR}/${id}_${tag}.jpg`;
    if (!fs.existsSync(out)) {
      const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-ss', (d * frac).toFixed(2), '-i', p,
        '-frames:v', '1', '-vf', 'scale=400:-2', '-q:v', '3', out], { encoding: 'utf8' });
      if (r.status === 0) sacados++;
    }
    if (fs.existsSync(out)) manifest.push({ name: `${id}_${tag}`, path: out, phrase: 'stock clip for a video about where people hide valuables at home' });
  }
}
console.log(`MEDIDO: ${manifest.length} cuadros (2 por clip) · ${sacados} extraídos ahora`);
fs.writeFileSync(`_v3/${SLUG}_stock_manifest.json`, JSON.stringify(manifest, null, 1));
if (SOLO_FRAMES) process.exit(0);

// ── el juez de visión: ¿hay una persona? ──────────────────────────────────────────────────────
const vOut = `_v3/${SLUG}_stock_gente.json`;
const r = spawnSync('node', ['scripts/vision_haygente.mjs', `_v3/${SLUG}_stock_manifest.json`, vOut],
  { encoding: 'utf8', stdio: 'inherit', maxBuffer: 1 << 26 });
if (r.status !== 0 || !fs.existsSync(vOut)) { console.error('⛔ el juez de visión no dejó veredictos'); process.exit(2); }
const ver = JSON.parse(fs.readFileSync(vOut, 'utf8'));
if (!Array.isArray(ver) || ver.length < manifest.length * 0.9) {
  console.error(`⛔ el juez midió ${ver.length} de ${manifest.length} cuadros — NO es un OK`); process.exit(2);
}

// un clip cae si CUALQUIERA de sus dos cuadros tiene persona
const conGente = new Map();
for (const v of ver) {
  const id = String(v.name).replace(/_[ab]$/, '');
  if (v.ok === false) conGente.set(id, (conGente.get(id) || []).concat(v.reason || v.issue || 'persona'));
}
const mapa = fs.existsSync(MAPA) ? JSON.parse(fs.readFileSync(MAPA, 'utf8')) : {};
const vivos = clips.filter((id) => !conGente.has(id));
const caidos = clips.filter((id) => conGente.has(id));
console.log(`MEDIDO: ${clips.length} clips juzgados · ${vivos.length} sin persona · ${caidos.length} DESCARTADOS por persona reconocible`);
for (const id of caidos) console.log(`   ✗ ${id}  «${(conGente.get(id) || [])[0]}»  (${mapa[id]?.prompt || '?'})`);

fs.writeFileSync(`_v3/${SLUG}_stock_rechazados.json`, JSON.stringify(
  caidos.map((id) => ({ id, motivo: conGente.get(id), query: mapa[id]?.prompt || null })), null, 1));

const REAL = vivos.map((id) => ({
  id: id.replace(new RegExp(`^${SLUG}_`), ''),
  sec: mapa[id]?.sec || 'S1',
  lugar: mapa[id]?.lugar || 'stock',
  prompt: mapa[id]?.prompt || id,
}));
const cab = `// _v3/${SLUG}_real.mjs — METRAJE REAL (stock de Pexels) conformado a 1920x1080 30/1 CFR.
// GENERADO por scripts/rksafe_stock_audit.mjs — no editar a mano.
//
// ⛔⛔ AUDITADO A OJO CON VISIÓN, 2 CUADROS POR CLIP a 400 px: de ${clips.length} conformados se
//    DESCARTARON ${caidos.length} por mostrar una PERSONA RECONOCIBLE. El detalle de los rechazos está
//    en _v3/${SLUG}_stock_rechazados.json.
// ⛔ El metraje real NO se ralentiza (rate 1): el 0,5x existe para esconder los artefactos de agnes.
export const REAL = `;
fs.writeFileSync(`_v3/${SLUG}_real.mjs`, cab + JSON.stringify(REAL, null, 1) + ';\n');
console.log(`→ _v3/${SLUG}_real.mjs con ${REAL.length} clips`);
console.log('═'.repeat(74));
