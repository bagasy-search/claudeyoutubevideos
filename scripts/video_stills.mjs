// scripts/video_stills.mjs — STILLS del video ARMADO por SEGUNDOS, con UN solo bundle (canal Walt).
//   node scripts/video_stills.mjs <slug> <outDir> <segs: "0,0.5,1.2" | @archivo.txt (uno por línea)> [scale=0.3]
// Usa src/index_<slug>.tsx y la composición <Slug> (la que escribe rksafe_build). Salida: <outDir>/s<seg>.jpg
// + <outDir>/_hoja_NN.jpg (hojas de 4x4 con el segundo escrito) para MIRARLAS. Sin hojas mirada = no revisado.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';

const [slug, outDir, segsArg, sc = '0.3'] = process.argv.slice(2);
if (!slug || !outDir || !segsArg) { console.error('uso: node scripts/video_stills.mjs <slug> <outDir> <segs|@file> [scale]'); process.exit(1); }
const segs = (segsArg.startsWith('@') ? fs.readFileSync(segsArg.slice(1), 'utf8').split(/[\s,]+/) : segsArg.split(','))
  .map(Number).filter((x) => Number.isFinite(x));
fs.mkdirSync(outDir, { recursive: true });
const Cap = process.env.COMP || (slug.charAt(0).toUpperCase() + slug.slice(1));
const serveUrl = await bundle({ entryPoint: path.resolve(`src/index_${slug}.tsx`), publicDir: path.resolve('public') });
const c = (await getCompositions(serveUrl)).find((x) => x.id === Cap);
if (!c) { console.error(`⛔ no existe la composición ${Cap}`); process.exit(2); }
const outs = [];
for (const s of segs) {
  const frame = Math.max(0, Math.min(c.durationInFrames - 1, Math.round(s * c.fps)));
  const out = path.join(outDir, `s${s.toFixed(1).padStart(7, '0')}.jpg`);
  await renderStill({ composition: c, serveUrl, output: out, frame, imageFormat: 'jpeg', jpegQuality: 80, scale: Number(sc) });
  outs.push([out, s]);
}
// hojas 4x4 con el segundo escrito
for (let h = 0; h * 16 < outs.length; h++) {
  const grp = outs.slice(h * 16, h * 16 + 16);
  while (grp.length < 16) grp.push([grp[grp.length - 1][0], -1]);
  const args = ['-v', 'error', '-y'];
  grp.forEach(([f]) => args.push('-i', f));
  const lbl = grp.map(([, s], i) => (s < 0 ? `[${i}]scale=480:270,drawbox=c=black:t=fill[v${i}]` : `[${i}]scale=480:270,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${s.toFixed(1)}s':x=8:y=8:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`)).join(';');
  const lay = grp.map((_, i) => `${(i % 4) * 480}_${Math.floor(i / 4) * 270}`).join('|');
  args.push('-filter_complex', `${lbl};${grp.map((_, i) => `[v${i}]`).join('')}xstack=inputs=16:layout=${lay}`, '-q:v', '3', path.join(outDir, `_hoja_${String(h + 1).padStart(2, '0')}.jpg`));
  execFileSync('ffmpeg', args);
}
console.log(`MEDIDO: ${outs.length} stills de ${Cap} en ${outDir} · ${Math.ceil(outs.length / 16)} hojas _hoja_NN.jpg → MIRARLAS`);
