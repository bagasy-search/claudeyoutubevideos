// clips_bas8.mjs — coloca los 103 clips de agnes en los HUECOS del Main (donde no hay
// componente full-screen ni foto), con el subject correcto por sección, denso en tramo2
// (tapa el avatar en bucle) y más liviano en tramo1 (avatar real visible). Sin repetir consecutivos.
// Salida: src/bastida/bas8_clips.json = [{from,dur,clip,caption,kb}]
import fs from 'node:fs';

const AVATAR_END = 17608, TOTAL = 35880;
const clipFiles = fs.readdirSync('public/broll/bastidarenal8').filter((f) => f.endsWith('.mp4'));
const subjOf = (n) => n.replace(/^bas8_/, '').replace(/\.mp4$/, '').split('_')[0];
const bySubj = {};
for (const f of clipFiles) { const s = subjOf(f); (bySubj[s] ||= []).push(`broll/bastidarenal8/${f}`); }

// secciones [start, end, [subjects en prioridad], caption]
const SEC = [
  [0, 1360, ['veg', 'four', 'market'], ''],
  [3050, 4135, ['dark', 'veg', 'green'], 'Verduras oscuras'],
  [4135, 6161, ['sponge', 'dark', 'mineral'], 'Esponja de minerales'],
  [6161, 7742, ['colander', 'sieve', 'kidney', 'mineral', 'creatinine'], 'El filtro que se tapa'],
  [7188, 7742, ['mineral', 'sieve'], 'Se junta, forma piedras'],
  [7742, 9408, ['cristina', 'blood', 'lab', 'creatinine', 'beet'], 'Doña Cristina'],
  [9408, 10430, ['cabbage'], 'El repollo'],
  [10430, 11587, ['redpepper', 'pepper'], 'El pimiento rojo'],
  [11587, 12718, ['cauliflower'], 'La coliflor'],
  [12718, 14093, ['onion'], 'La cebolla'],
  [14093, 15233, ['four', 'veg', 'cabbage', 'onion'], 'Sus 4 amigas'],
  [15233, 16423, ['spinach', 'green'], 'Espinaca cruda'],
  [16423, 17608, ['potato', 'potatoes'], 'La papa'],
  // tramo2
  [17620, 19331, ['tomato', 'ketchup', 'tomatoes'], 'El tomate concentrado'],
  [19331, 21470, ['beet'], 'La remolacha'],
  [21470, 23608, ['colander', 'pot', 'drain', 'pour', 'potato'], 'Las dos aguas'],
  [23608, 25571, ['colander', 'dark', 'spinach'], 'Hervir y colar'],
  [25571, 28698, ['blood', 'lab', 'creatinine', 'kidney'], 'El órgano callado'],
  [28698, 31979, ['four', 'veg', 'guide', 'phone', 'family'], 'La guía'],
  [31979, 33518, ['teresa', 'cristina'], 'Teresa, de Monterrey'],
  [33518, 35380, ['four', 'veg', 'beet', 'cabbage'], 'Recuerde'],
];

// rangos CUBIERTOS por componentes/fotos (DEPTH + BROLL) — no OVERLAY (transparentes)
const src = fs.readFileSync('src/bastida/Main_bastida8.tsx', 'utf8');
const depthBlock = src.slice(src.indexOf('const DEPTH'), src.indexOf('const OVERLAY'));
const covered = [];
for (const m of depthBlock.matchAll(/\{from:\s*(\d+),\s*dur:\s*(\d+)/g)) covered.push([+m[1], +m[1] + +m[2]]);
const isCov = (a, b) => covered.some(([x, y]) => a < y && b > x);

const used = new Set();
const pick = (subjs, avoid) => {
  for (const s of subjs) {
    const pool = (bySubj[s] || []).filter((c) => !used.has(c) && c !== avoid);
    if (pool.length) { used.add(pool[0]); return pool[0]; }
  }
  // si el subject se agotó, reusar el menos-usado del primer subject disponible
  for (const s of subjs) { const pool = (bySubj[s] || []).filter((c) => c !== avoid); if (pool.length) return pool[0]; }
  return null;
};

const clips = [];
let last = null;
const DUR = [140, 155, 130, 170, 150, 125, 160]; // variedad de pacing (mediana ~4.7s)
let di = 0;
for (const [a, b, subs, cap] of SEC) {
  const tramo2 = a >= AVATAR_END;
  let t = a;
  while (t < b - 60) {
    const dur = DUR[di++ % DUR.length];
    const end = Math.min(t + dur, b);
    if (end - t < 70) break;
    if (!isCov(t, end)) {
      // tramo1: llenar ~55% de los huecos (avatar visible); tramo2: ~95%
      const fill = tramo2 ? true : (di % 20) < 11;
      if (fill) {
        const clip = pick(subs, last);
        if (clip) { clips.push({from: t, dur: end - t, clip, caption: cap, kb: clips.length % 2 ? -1 : 1}); last = clip; }
      }
    }
    t = end;
  }
}
clips.sort((x, y) => x.from - y.from);
fs.writeFileSync('src/bastida/bas8_clips.json', JSON.stringify(clips, null, 1));
const uniq = new Set(clips.map((c) => c.clip)).size;
console.log(`CLIPS: ${clips.length} colocados · ${uniq} clips únicos de ${clipFiles.length} · tramo2 ${clips.filter((c) => c.from >= AVATAR_END).length}`);
