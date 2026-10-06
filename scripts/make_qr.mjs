// make_qr.mjs — genera un QR CUADRADO para el slot de RayCta (104x104, objectFit:"contain")
// y VERIFICA que decodifique al tamaño REAL de pantalla (104 px), no al tamaño del PNG.
// uso: node scripts/make_qr.mjs "<url>" <out.png> [ecc=L] [size=1040]
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import fs from 'fs';
import { execFileSync } from 'child_process';

const url = process.argv[2];
const out = process.argv[3];
const ecc = process.argv[4] || 'L';
const size = +(process.argv[5] || 1040);
if (!url || !out) { console.error('uso: node scripts/make_qr.mjs "<url>" <out.png> [ecc] [size]'); process.exit(1); }

await QRCode.toFile(out, url, {
  errorCorrectionLevel: ecc,
  type: 'png',
  width: size,
  margin: 4,                 // ZONA DE SILENCIO — sin esto no decodifica al bajar de tamaño
  color: { dark: '#000000ff', light: '#ffffffff' },
});

const meta = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', out]).toString().trim();
const [w, h] = meta.split(',').map(Number);
console.log('PNG      :', w + 'x' + h, w === h ? '(CUADRADO ✓)' : '⛔ NO ES CUADRADO');

// --- compuerta: decodificar al TAMAÑO REAL en pantalla ---
for (const px of [104, 128, 208]) {
  const tmp = out.replace(/\.png$/, `_t${px}.png`);
  execFileSync('ffmpeg', ['-v', 'error', '-i', out, '-vf', `scale=${px}:${px}:flags=area`, '-y', tmp]);
  const png = PNG.sync.read(fs.readFileSync(tmp));
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  console.log(`decode @${String(px).padStart(3)}px:`, res ? '✓ ' + res.data : '⛔ NO DECODIFICA');
  fs.unlinkSync(tmp);
}
