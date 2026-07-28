import fs from 'fs';
import path from 'path';
import {spawnSync} from 'child_process';

const [manifestPath, outDir] = process.argv.slice(2);
if (!manifestPath || !outDir) {
  console.error('Uso: node scripts/pexels_candidate_sheets.mjs <manifest.json> <outdir>');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Falta PEXELS_API_KEY');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
fs.mkdirSync(outDir, {recursive: true});
const index = {};

for (const item of manifest) {
  const url = new URL('https://api.pexels.com/videos/search');
  url.searchParams.set('query', item.query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('size', 'medium');
  url.searchParams.set('per_page', '12');
  const response = await fetch(url, {headers: {Authorization: key}, signal: AbortSignal.timeout(30000)});
  if (!response.ok) continue;
  const videos = (await response.json()).videos ?? [];
  const candidates = [];
  for (const v of videos) {
    const files = (v.video_files ?? [])
      .filter((f) => /mp4/i.test(f.file_type ?? 'mp4') && (f.width ?? 0) >= (f.height ?? 0) && (f.width ?? 0) >= 960)
      .sort((a, b) => Math.abs((a.width ?? 0) - 1920) - Math.abs((b.width ?? 0) - 1920));
    if (!files[0] || !v.image) continue;
    const i = candidates.length;
    const file = `${item.name}_${String(i).padStart(2, '0')}.jpg`;
    const img = await fetch(v.image, {signal: AbortSignal.timeout(30000)});
    if (!img.ok) continue;
    fs.writeFileSync(path.join(outDir, file), Buffer.from(await img.arrayBuffer()));
    candidates.push({index: i, id: v.id, duration: v.duration, thumb: file, video: files[0].link, width: files[0].width, height: files[0].height});
    if (candidates.length === 8) break;
  }
  index[item.name] = {concept: item.concept, query: item.query, candidates};

  if (candidates.length) {
    const inputs = [];
    candidates.forEach((c) => inputs.push('-i', path.join(outDir, c.thumb)));
    const scale = candidates.map((_, i) => `[${i}:v]scale=480:270:force_original_aspect_ratio=increase,crop=480:270,setsar=1,format=rgb24[t${i}]`).join(';');
    const cat = candidates.map((_, i) => `[t${i}]`).join('');
    const filter = `${scale};${cat}concat=n=${candidates.length}:v=1:a=0[cat];[cat]tile=4x2:padding=4:color=white[out]`;
    spawnSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', filter, '-map', '[out]', '-q:v', '3', path.join(outDir, `${item.name}_sheet.jpg`)], {encoding: 'utf8', timeout: 120000});
  }
  process.stdout.write('.');
}

fs.writeFileSync(path.join(outDir, '_candidates.json'), JSON.stringify(index, null, 2));
console.log(`\n${Object.keys(index).length} conceptos -> ${outDir}`);
