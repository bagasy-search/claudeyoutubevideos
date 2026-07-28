/**
 * gen_vsdjytp30ogs.mjs — compila el mapa de los 7 directores en:
 *   · src/VideoEdit/beats_vsdjytp30ogs.ts        (data del build)
 *   · src/VideoEdit/avatar_vsdjytp30ogs.gen.ts   (ventanas del avatar, para density_gate)
 *   · _imgs_vsdjytp30ogs.json                    (lista para gen_gptimage.mjs)
 *   · public/broll/shots_vsdjytp30ogs.json       (lista para fetchstock.mjs)
 *   · MANIFIESTO cronológico dentro de Main_vsdjytp30ogs.tsx (para density_gate)
 */
import fs from 'node:fs';

const SLUG = 'vsdjytp30ogs';
const FPS = 30;
const TOTAL_SEC = 1495.42;
const TOTAL_FRAMES = Math.ceil(TOTAL_SEC * FPS);
const ACCENT = '#E9B44C';

const MIN_DUR = 2.0;
const MAX_DUR = 9.0;

/* ------------------------------- 1 · leer ------------------------------- */
let raw = [];
for (let i = 0; i < 7; i++) {
  const f = `_beats_${SLUG}_${i}.json`;
  if (!fs.existsSync(f)) {
    console.error(`⚠ falta ${f}`);
    continue;
  }
  let j;
  try {
    j = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    console.error(`⚠ ${f} no parsea: ${e.message}`);
    continue;
  }
  if (!Array.isArray(j)) continue;
  raw.push(...j.map((b) => ({...b, _dir: i})));
}
raw.sort((a, b) => a.at - b.at);
console.log(`momentos crudos: ${raw.length}`);

/* --------------------------- 2 · normalizar ----------------------------- */
// sin solapes ni huecos: cada beat termina donde arranca el siguiente
const beats = [];
for (let i = 0; i < raw.length; i++) {
  const b = raw[i];
  const at = Math.max(0, Number(b.at) || 0);
  const nextAt = i + 1 < raw.length ? Number(raw[i + 1].at) : TOTAL_SEC;
  let dur = Number(b.dur) || 0;
  const gap = nextAt - at;
  if (gap <= 0.4) continue; // beat aplastado por el siguiente
  dur = Math.min(Math.max(dur, MIN_DUR), MAX_DUR);
  if (dur > gap) dur = gap; // no pisar al siguiente
  if (gap - dur > 0.35) dur = Math.min(gap, MAX_DUR); // no dejar hueco
  if (dur < 1.2) continue;
  beats.push({...b, at, dur});
}
// último llega al final
if (beats.length) {
  const last = beats[beats.length - 1];
  last.dur = Math.max(1.5, TOTAL_SEC - last.at);
}

/* ---------------- 3 · asignar assets y componentes ---------------------- */
const imgs = [];
const shots = [];
const VARIANTS = ['whip', 'lift', 'iris', 'fold'];
const MOODS = ['gold', 'cool', 'warmdark', 'science'];

// prompts: cabecera común para que todas las fotos tengan el mismo idioma visual
const IMG_STYLE =
  'real amateur photo taken with a phone camera, natural imperfect lighting, slight grain and noise, ' +
  'shallow depth of field, no text, no watermark, no illustration, no 3d render, photorealistic, candid';

let vi = 0;
let prevVariant = '';
let prevComp = '';
const out = [];

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const start = Math.round(b.at * FPS);
  const dur = Math.max(2, Math.round(b.dur * FPS));
  const id = `b${String(i).padStart(3, '0')}`;

  if (b.kind === 'avatar') {
    out.push({id, start, dur, kind: 'avatar'});
    prevComp = 'avatar';
    continue;
  }

  // transición: la mitad SECA, la otra mitad rotando entre las 4 variantes (nunca 2 iguales seguidas)
  const seco = i % 2 === 1 && b.kind !== 'kit';
  let variant = VARIANTS[i % 4];
  if (variant === prevVariant) variant = VARIANTS[(i + 1) % 4];
  prevVariant = variant;

  if (b.kind === 'img' || b.kind === 'broll') {
    let src;
    if (b.kind === 'img') {
      const name = `${SLUG}_${String(vi).padStart(3, '0')}`;
      const entry = {name, prompt: `${b.prompt || 'elderly hands close up'}. ${IMG_STYLE}`};
      if (b.ref) entry.ref = `public/ref_${SLUG}.png`;
      imgs.push(entry);
      src = `img/${name}.png`;
    } else {
      const name = `d${String(vi).padStart(3, '0')}`;
      // queries CORTAS: Pexels no matchea frases largas
      const q = String(b.query || 'elderly hands')
        .split(/\s+/)
        .slice(0, 3)
        .join(' ');
      shots.push({name, query: q, type: 'video', orientation: 'landscape'});
      src = `broll/${SLUG}/${name}.mp4`;
    }
    vi++;

    // ~40% de las tomas se montan con un componente CON TARJETA (FedHero/FedQuote) en vez de
    // toma pelada: sube la densidad de kit y da variedad de lectura.
    const conTarjeta = b.caption && b.kind === 'img' && i % 5 === 0; // NUNCA con broll: FedHero pinta image con <Img> y un .mp4 ahi mata el chunk
    if (conTarjeta && prevComp !== 'FedHero') {
      out.push({
        id,
        start,
        dur,
        kind: 'kit',
        comp: 'FedHero',
        variant,
        cut: false,
        props: {
          image: src,
          kicker: '',
          title: b.caption,
          hot: [],
          sub: '',
          side: i % 4 === 0 ? 'left' : 'right',
          mood: MOODS[i % 4],
        },
      });
      prevComp = 'FedHero';
    } else {
      out.push({
        id,
        start,
        dur,
        kind: 'shot',
        comp: 'FedFullShot',
        variant,
        cut: seco,
        props: {
          src,
          video: b.kind === 'broll',
          caption: b.caption || undefined,
          kicker: b.kicker || undefined,
          ken: ['in', 'out', 'left', 'right'][i % 4],
          mood: b.mood || MOODS[i % 4],
        },
      });
      prevComp = 'FedFullShot';
    }
    continue;
  }

  if (b.kind === 'kit') {
    const comp = b.comp;
    const props = {...(b.props || {})};
    // FedLowerThird NO acepta mood y NECESITA avatarSrc={null} (modo overlay)
    if (comp === 'FedLowerThird') {
      delete props.mood;
      props.avatarSrc = null;
    }
    // los que llevan imagen y no la trajeron: se les asigna la imagen generada más cercana
    out.push({
      id,
      start,
      dur,
      kind: 'kit',
      comp,
      variant,
      cut: false,
      props,
    });
    prevComp = comp;
    continue;
  }

  // kind desconocido → avatar
  out.push({id, start, dur, kind: 'avatar'});
}

/* ------- 3.5 · cartel de presentación (FedLowerThird, modo overlay) ------ */
// "Soy el doctor Federer. Esto es Federer Archivos." → 114.28s. El cartel va ENCIMA del avatar,
// por eso avatarSrc={null} (modo overlay: el avatar ya corre persistente abajo).
const PRESENT_SEC = 114.28;
const presentF = Math.round(PRESENT_SEC * FPS);
{
  const idx = out.findIndex((b) => b.start <= presentF && b.start + b.dur > presentF);
  if (idx >= 0) {
    const b = out[idx];
    const dur = Math.min(b.dur, Math.round(5.2 * FPS));
    out.splice(idx + 1, 0, {
      id: `${b.id}-lt`,
      start: presentF,
      dur,
      kind: 'kit',
      comp: 'FedLowerThird',
      variant: 'lift',
      cut: false,
      props: {
        name: 'Dr. Federer',
        role: 'Médico · +10 años de consultorio',
        topic: 'Federer Archivos',
        avatarSrc: null,
      },
    });
  }
}

/* -------- 4 · imágenes de apoyo para los componentes que las piden ------- */
// FedHero/FedStat/FedQuote/FedMolecule/FedStep/FedCta/FedBeforeAfter tienen su `image`
// con DEFAULT a med/*.png (romero/piel/aceite) → quedaría off-topic. Les inyectamos la
// imagen generada más cercana en el tiempo, así el fondo pega con lo que se dice.
const NEEDS_IMG = {
  FedHero: ['image'],
  FedStat: ['image'],
  FedQuote: ['image'],
  FedMolecule: ['image'],
  FedStep: ['image'],
  FedCta: ['image'],
  FedBeforeAfter: ['imageA', 'imageB'],
};
const imgBeats = out.filter((b) => b.props?.src?.startsWith('img/'));
const nearestImg = (start) => {
  if (!imgBeats.length) return null;
  let best = imgBeats[0];
  let bd = Math.abs(best.start - start);
  for (const c of imgBeats) {
    const d = Math.abs(c.start - start);
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best.props.src;
};
for (const b of out) {
  const fields = NEEDS_IMG[b.comp];
  if (!fields) continue;
  for (const f of fields) {
    if (!b.props[f] || !/^(img|broll|real|med)\//.test(String(b.props[f]))) {
      const n = nearestImg(b.start);
      if (n) b.props[f] = n;
      else delete b.props[f];
    }
  }
}
// FedBeforeAfter con las dos imágenes iguales queda flojo: la segunda toma otra vecina
for (const b of out) {
  if (b.comp === 'FedBeforeAfter' && b.props.imageA === b.props.imageB) {
    const others = imgBeats.filter((x) => x.props.src !== b.props.imageA);
    if (others.length) {
      let best = others[0];
      let bd = Math.abs(best.start - b.start);
      for (const c of others) {
        const d = Math.abs(c.start - b.start);
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      b.props.imageB = best.props.src;
    }
  }
}

/* --------------------------- 5 · escribir ------------------------------- */
const header = `// GENERADO por scripts/gen_${SLUG}.mjs — no editar a mano
export const ACCENT = '${ACCENT}';
export const TOTAL_FRAMES = ${TOTAL_FRAMES};

export type VBeat = {
  id: string;
  start: number;
  dur: number;
  kind: 'avatar' | 'kit' | 'shot';
  comp?: string;
  variant?: 'whip' | 'lift' | 'iris' | 'fold';
  cut?: boolean;
  props?: Record<string, any>;
};

export const BEATS: VBeat[] = ${JSON.stringify(out, null, 1)};
`;
fs.writeFileSync(`src/VideoEdit/beats_${SLUG}.ts`, header, 'utf8');

// ventanas del avatar para density_gate
const av = out
  .filter((b) => b.kind === 'avatar')
  .map((b) => ({start: b.start, dur: b.dur, mode: 'full'}));
fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// GENERADO — ventanas del presentador a pantalla completa\nexport const TOTAL_SEC = ${TOTAL_SEC};\nexport const TOTAL_FRAMES_AV = ${TOTAL_FRAMES};\nexport const AVATAR_WINDOWS = ${JSON.stringify(
    av,
    null,
    1
  )};\n`,
  'utf8'
);

fs.writeFileSync(`_imgs_${SLUG}.json`, JSON.stringify(imgs, null, 1), 'utf8');
fs.mkdirSync('public/broll', {recursive: true});
fs.writeFileSync(`public/broll/shots_${SLUG}.json`, JSON.stringify(shots, null, 1), 'utf8');

/* ------------- 6 · MANIFIESTO cronológico para density_gate ------------- */
const lines = out.map((b) => {
  if (b.kind === 'avatar') return `  <FedAvatarFull/>`;
  const asset =
    b.props?.src ||
    b.props?.image ||
    b.props?.imageA ||
    '';
  return `  <${b.comp}/>${asset ? ` "${asset}"` : ''}`;
});
const manifest = `/* === MANIFIESTO ${SLUG} (density_gate) — ORDEN CRONOLÓGICO, generado ===\n${lines.join(
  '\n'
)}\n=== FIN MANIFIESTO === */`;

const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
let main = fs.readFileSync(mainPath, 'utf8');
main = main.replace(/\/\* === MANIFIESTO[\s\S]*?=== FIN MANIFIESTO === \*\//, '').trimEnd();
fs.writeFileSync(mainPath, main + '\n\n' + manifest + '\n', 'utf8');

/* ------------------------------ 7 · reporte ----------------------------- */
const durs = out.map((b) => b.dur / FPS).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p90 = durs[Math.floor(durs.length * 0.9)];
const largos = durs.filter((d) => d >= 5).length;
const avSec = out.filter((b) => b.kind === 'avatar').reduce((s, b) => s + b.dur / FPS, 0);
const comps = {};
for (const b of out) if (b.comp) comps[b.comp] = (comps[b.comp] || 0) + 1;

console.log(`beats: ${out.length}`);
console.log(`mediana ${med.toFixed(2)}s · p90 ${p90.toFixed(2)}s · ≥5s: ${((largos / durs.length) * 100).toFixed(0)}%`);
console.log(`avatar full: ${avSec.toFixed(0)}s = ${((avSec / TOTAL_SEC) * 100).toFixed(1)}%`);
console.log(`imágenes a generar: ${imgs.length} · clips a bajar: ${shots.length}`);
console.log('componentes:', JSON.stringify(comps));
