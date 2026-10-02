// stills de prueba: un cuadro por tipo de componente (o los ids pasados) → _work/valavena/stills/*.jpg
import fs from 'fs';
import path from 'path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const src = fs.readFileSync('src/valavena/cues_valavena.gen.ts', 'utf8');
const BEATS = JSON.parse(src.slice(src.indexOf('BEATS: any[] = ') + 15).replace(/;\s*$/, ''));
const want = process.argv.slice(2);
const seen = new Set();
const picks = BEATS.filter((b) => (want.length ? want.includes(b.id) : !['clip', 'foto', 'gen', 'avatar', 'talk'].includes(b.kind) && !seen.has(b.kind) && seen.add(b.kind)));
const out = '_work/valavena/stills'; fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index_valavena.tsx'), publicDir: path.resolve('public')});
const comp = await selectComposition({serveUrl, id: 'ValAvena'});
for (const b of picks) {
  const frac = +(process.env.FRAC || 0.8);
  const frame = Math.round((b.start + b.dur * frac) * 30);
  try {
    await renderStill({composition: comp, serveUrl, frame, output: `${out}/${b.kind}_${b.id}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.5});
    console.log('ok', b.kind, b.id);
  } catch (e) { console.log('ERR', b.kind, b.id, String(e.message).slice(0, 200)); }
}
