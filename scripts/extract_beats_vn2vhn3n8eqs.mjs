// Extrae los beats del build generado (src/VideoEdit/Main_vn2vhn3n8eqs.tsx) a un JSON editable.
// Hace falta porque los mapas del DIRECTOR (public/_audit/.../dir_*.json) se perdieron en el reset
// del worktree: el Main commiteado es ahora la ÚNICA fuente de verdad del montaje.
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';
const FPS = 30;
const MAIN = `src/VideoEdit/Main_${SLUG}.tsx`;
const src = fs.readFileSync(MAIN, 'utf8');

/* ---- 1 · props: cada entrada es una línea `  /* bNNN Ts *​/ {...},` ---- */
const props = [];
const reProp = /\/\* (b\d{3}) ([\d.]+)s \*\/ (\{.*\}),\s*$/gm;
let m;
while ((m = reProp.exec(src))) {
  props.push({id: m[1], t: +m[2], raw: m[3]});
}

/* ---- 2 · sequences ---- */
const beats = [];
const reSeq =
  /<Sequence from=\{(\d+)\} durationInFrames=\{(\d+)\} name="([^"]+)">\s*\n\s*<(\w+) \{\.\.\.P\[(\d+)\]\}([^/]*)\/>/g;
while ((m = reSeq.exec(src))) {
  const [, from, dur, name, comp, pi, extra] = m;
  const isLT = name.startsWith('LT ');
  beats.push({
    id: name.replace(/^(LT )?\w+ /, '').trim() || name,
    name,
    comp,
    from: +from,
    dur: +dur,
    t: +(+from / FPS).toFixed(2),
    e: +((+from + +dur - (isLT ? 0 : 12)) / FPS).toFixed(2),
    pi: +pi,
    lt: isLT,
    extra: extra.trim(),
  });
}

/* ---- 3 · texto de cada beat (el comentario que lo precede) ---- */
const says = {};
const reSay = /\{\/\* ([\d.]+)s · ([^*]*)\*\/\}/g;
while ((m = reSay.exec(src))) says[(+m[1]).toFixed(2)] = m[2].trim();
for (const b of beats) b.says = says[b.t.toFixed(2)] || '';

const out = {slug: SLUG, fps: FPS, props, beats};
fs.mkdirSync(`public/_audit/${SLUG}`, {recursive: true});
fs.writeFileSync(`public/_audit/${SLUG}/beats.json`, JSON.stringify(out, null, 1));

const byComp = {};
for (const b of beats) byComp[b.comp] = (byComp[b.comp] || 0) + 1;
console.log('props:', props.length, '| sequences:', beats.length);
console.log('lower-thirds:', beats.filter((b) => b.lt).length);
console.log(JSON.stringify(byComp));
console.log('span:', beats[0]?.t, '→', beats[beats.length - 1]?.e);
