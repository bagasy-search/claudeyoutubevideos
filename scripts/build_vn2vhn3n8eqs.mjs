// build_vn2vhn3n8eqs.mjs — funde los 6 mapas del DIRECTOR, inserta el carrusel 3D en los
// 7 "Número X", normaliza al contrato del FedererKit y emite:
//   src/beats_vn2vhn3n8eqs.ts            (BEATS + CARDS + TOTAL_F)
//   public/broll/shots_vn2vhn3n8eqs.json (lista para fetchstock --slug)
//   public/_audit/vn2vhn3n8eqs/imgs.json (lista para gen_gptimage)
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';
const FPS = 30;
const AUD = `public/_audit/${SLUG}`;
const TOTAL_SEC = 1263.6; // largo real del audio del avatar (nunca menor, o corta la última frase)
const TOTAL_F = Math.round(TOTAL_SEC * FPS);

/* ---------------------------------------------------------------- 1 · merge */
let moments = [];
for (const k of ['A', 'B', 'C', 'D', 'E', 'F']) {
  const p = `${AUD}/dir_${k}.json`;
  if (!fs.existsSync(p)) throw new Error('falta ' + p);
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const m of arr) moments.push(m);
}
moments = moments.filter((m) => m && typeof m.t === 'number' && typeof m.e === 'number');
moments.sort((a, b) => a.t - b.t);

/* ------------------------------------------------- 2 · ventanas del carrusel */
const CARDS = [
  {image: 'img/vn2_card_1_girasol.png', index: 'ACEITE 1', name: 'Girasol alto linoleico', tag: 'el campeón olvidado'},
  {image: 'img/vn2_card_2_coco.png', index: 'ACEITE 2', name: 'Coco virgen', tag: 'el único probado en piel madura'},
  {image: 'img/vn2_card_3_rosamosqueta.png', index: 'ACEITE 3', name: 'Rosa mosqueta', tag: 'la mejor fórmula, la peor prueba'},
  {image: 'img/vn2_card_4_argan.png', index: 'ACEITE 4', name: 'Argán', tag: 'el de la elasticidad medida'},
  {image: 'img/vn2_card_5_jojoba.png', index: 'ACEITE 5', name: 'Jojoba', tag: 'lo más parecido a su propia grasa'},
  {image: 'img/vn2_card_6_sesamo.png', index: 'ACEITE 6', name: 'Sésamo', tag: 'el aceite del masaje'},
  {image: 'img/vn2_card_7_almendras.png', index: 'ACEITE 7', name: 'Almendras dulces', tag: 'el clásico de la abuela'},
];

// anclas exactas de Whisper (los 5,6,7 caen en el silencio donde Whisper se comió el número)
const CAR = [
  {t: 271.0, e: 276.5, focus: -1, intro: true, kicker: 'Los siete'},
  {t: 276.5, e: 282.2, focus: 0},
  {t: 358.4, e: 363.6, focus: 1},
  {t: 443.9, e: 449.2, focus: 2},
  {t: 595.8, e: 601.0, focus: 3},
  {t: 668.3, e: 673.2, focus: 4},
  {t: 709.9, e: 714.6, focus: 5},
  {t: 751.3, e: 756.2, focus: 6},
];

// sacar del mapa del DIRECTOR todo lo que se pise con una ventana del carrusel
const overlaps = (a1, a2, b1, b2) => a1 < b2 - 0.05 && b1 < a2 - 0.05;
moments = moments.filter((m) => !CAR.some((c) => overlaps(m.t, m.e, c.t, c.e)));

for (const c of CAR) {
  moments.push({
    t: c.t,
    e: c.e,
    kind: 'depth',
    comp: 'FedOilCarousel',
    props: {focus: c.focus, intro: !!c.intro, kicker: c.kicker},
    asset: {type: 'none'},
    says: c.focus < 0 ? 'Vamos a los siete' : 'Número ' + (c.focus + 1),
  });
}
moments.sort((a, b) => a.t - b.t);

/* --------------------------------------------- 3 · saneo temporal + apertura */
// los primeros 2s son avatar full sin nada encima, sin excepción
moments = moments.filter((m) => m.e > 2.05);
moments.unshift({t: 0, e: 2.6, kind: 'avatar', comp: '', props: {}, asset: {type: 'none'}, says: 'apertura'});

const clean = [];
let cursor = 0;
for (const m of moments) {
  let t = Math.max(m.t, cursor);
  let e = Math.min(m.e, TOTAL_SEC);
  if (e - t < 0.9) continue; // demasiado corto para leerse
  m.t = +t.toFixed(2);
  m.e = +e.toFixed(2);
  cursor = m.e;
  clean.push(m);
}
moments = clean;
if (moments.length && moments[moments.length - 1].e < TOTAL_SEC) {
  moments[moments.length - 1].e = TOTAL_SEC;
}

/* ------------------------------------------------------- 4 · normalización */
const IMG_NEEDED = new Set([
  'FedHero',
  'FedStat',
  'FedQuote',
  'FedMolecule',
  'FedStep',
  'FedCta',
]);
const FALLBACK = {
  gold: 'img/vn2_fb_gold.png',
  cool: 'img/vn2_fb_cool.png',
  science: 'img/vn2_fb_science.png',
  warmdark: 'img/vn2_fb_warm.png',
};

const shots = []; // pexels
const imgs = []; // gpt-image
const seenImg = new Set();
const seenShot = new Set();

const addImg = (name, prompt, ref) => {
  if (seenImg.has(name)) return `img/${name}.png`;
  seenImg.add(name);
  const it = {name, prompt};
  if (ref) it.ref = `public/ref_${SLUG}.png`;
  imgs.push(it);
  return `img/${name}.png`;
};
const addShot = (name, query) => {
  if (seenShot.has(name)) return `broll/${SLUG}/${name}.mp4`;
  seenShot.add(name);
  shots.push({name, query, type: 'video', orientation: 'landscape'});
  return `broll/${SLUG}/${name}.mp4`;
};

const PHOTO_TAIL =
  ', real amateur photograph taken on a phone, natural available light, slight noise and imperfections, shallow depth of field, no text, no labels, no logos, no lettering, not 3d, not a render, not glossy CGI';

const arr = (v) => (v == null ? undefined : Array.isArray(v) ? v : [String(v)]);

let chapterN = 1;
const beats = [];
for (const m of moments) {
  let comp = (m.comp || '').trim();
  const props = {...(m.props || {})};
  const asset = m.asset || {type: 'none'};
  const mood = props.mood && FALLBACK[props.mood] ? props.mood : 'warmdark';

  // taxonomías que no existen en el kit → variante real del kit
  if (comp === 'RawShot' || comp === 'FedFullShot') comp = 'FedFullShot';
  if (comp === 'FedWhiteboard') comp = 'FedMolecule'; // el pizarrón trae PiP propio: prohibido acá
  if (comp === 'CAROUSEL_RESERVED' || comp === 'none' || comp === 'null') comp = '';

  if (props.hot != null) props.hot = arr(props.hot);
  if (props.items != null && !Array.isArray(props.items)) delete props.items;
  if (props.nodes != null && !Array.isArray(props.nodes)) delete props.nodes;
  if (comp === 'FedMolecule' && (!props.nodes || !props.nodes.length)) {
    props.nodes = [{label: 'Barrera'}, {label: 'Ceramidas'}, {label: 'Linoleico'}, {label: 'Agua'}];
  }
  if (comp === 'FedChecklist' && (!props.items || !props.items.length)) comp = 'FedHero';
  if (comp === 'FedStat' && typeof props.value !== 'number') comp = 'FedHero';

  // ⛔ NADA DE TEXTO DE RELLENO: si el componente no trae su texto propio y la frase de ese
  // instante no entra entera, se degrada (a visual full si hay material, si no a avatar).
  // Antes esto producía titulares cortados a la mitad en pantalla.
  {
    const saysFits = (n) => {
      const s = (m.says || '').replace(/^[\s,.;:¿¡]+/, '').replace(/[.,;:]+$/, '').trim();
      return !!s && s.length <= n;
    };
    const needsText =
      (['FedChapter', 'FedHero', 'FedMolecule', 'FedStep', 'FedBeforeAfter', 'FedChecklist', 'FedCta'].includes(comp) &&
        !props.title) ||
      (comp === 'FedStat' && !props.label) ||
      (comp === 'FedQuote' && !props.quote);
    const limit = comp === 'FedQuote' ? 120 : comp === 'FedStat' ? 40 : 52;
    if (needsText && !saysFits(limit)) {
      comp = (m.asset && m.asset.type === 'img') || (m.asset && m.asset.type === 'clip') ? 'FedFullShot' : '';
      if (!comp) m.kind = 'avatar';
    }
  }

  // ---- resolución del asset
  let file = null;
  const id = asset.id || `vn2_x${beats.length}`;
  if (asset.type === 'clip' && asset.query) {
    file = addShot(id, asset.query);
  } else if (asset.type === 'img' && asset.prompt) {
    file = addImg(id, asset.prompt + PHOTO_TAIL, asset.ref);
  }

  if (comp === 'FedFullShot') {
    if (!file) {
      // un visual full sin material: lo pasamos a avatar en vez de mostrar un cartel vacío
      comp = '';
      m.kind = 'avatar';
    } else {
      props.src = file;
      props.video = file.endsWith('.mp4');
      props.mood = mood;
      if (!props.ken) props.ken = ['in', 'out', 'left', 'right'][beats.length % 4];
      delete props.image;
    }
  } else if (comp === 'FedBeforeAfter') {
    const a =
      file && !file.endsWith('.mp4')
        ? file
        : addImg(
            id + '_a',
            (asset.prompt || asset.query || 'dry dull mature skin close up') + PHOTO_TAIL
          );
    const b = addImg(
      id + '_b',
      (asset.prompt ? asset.prompt + ' — the opposite, improved version' : 'smooth hydrated mature skin close up') +
        PHOTO_TAIL
    );
    props.imageA = a;
    props.imageB = b;
    props.mood = mood;
  } else if (IMG_NEEDED.has(comp)) {
    props.image = file && !file.endsWith('.mp4') ? file : FALLBACK[mood];
    props.mood = mood;
  } else if (comp === 'FedLowerThird') {
    props.avatarSrc = null; // el avatar ya está montado abajo, no se monta dos veces
    if (!props.name) props.name = 'Dr. Valler';
    if (!props.role) props.role = 'Medicina de la piel';
  } else if (comp === 'FedChapter' || comp === 'FedChecklist' || comp === 'FedOilCarousel') {
    if (comp !== 'FedOilCarousel') props.mood = mood;
  }

  if (comp === 'FedOilCarousel') {
    props.cards = 'CARDS';
    props.bg = 'img/vn2_bg_kitchen.png';
  }

  // ⛔ SIN DEFAULTS DEL KIT: los valores por defecto de FedererKit son del video de ROMERO
  // ("Ácido carnósico", centerLabel "Romero", "Semana 12 · Ritual de romero"...). Si un prop
  // queda undefined, ESE texto sale al aire en un video de aceites. Se rellenan TODOS.
  // La frase ENTERA o nada: cortarla a n caracteres producía fragmentos sin sentido en
  // pantalla ("Y cuando entra, la", "69% DE"). Si no entra, el beat pierde el componente
  // y queda como avatar full, que siempre se lee bien.
  const short = (n) => {
    const s = (m.says || '')
      .replace(/^[\s,.;:¿¡]+/, '')
      .replace(/[.,;:]+$/, '')
      .trim();
    if (!s || s.length > n) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const need = (k, v) => {
    if (props[k] === undefined || props[k] === null) props[k] = v;
  };
  if (comp === 'FedChapter') {
    need('kicker', '');
    need('index', String(chapterN++).padStart(2, '0'));
    need('title', short(40) || 'Aceites para la piel madura');
    need('sub', '');
  } else if (comp === 'FedHero') {
    need('kicker', '');
    need('title', short(52) || 'Aceites para la piel madura');
    need('sub', '');
    need('hot', []);
  } else if (comp === 'FedStat') {
    need('kicker', '');
    need('label', short(40));
    need('sub', '');
    need('suffix', '');
    need('prefix', '');
    need('decimals', 0);
  } else if (comp === 'FedQuote') {
    need('kicker', '');
    need('quote', short(120) || 'La barrera de la piel no es cosmética.');
    need('author', 'Dr. Valler');
    need('role', 'Medicina de la piel');
  } else if (comp === 'FedMolecule') {
    need('kicker', '');
    need('title', short(44) || 'La barrera de la piel');
    need('sub', '');
    need('centerLabel', String(props.title).slice(0, 18));
    need('hot', []);
  } else if (comp === 'FedStep') {
    need('title', short(46) || 'Cómo se hace bien');
    need('sub', '');
    need('step', 1);
    need('total', 5);
    need('hot', []);
  } else if (comp === 'FedBeforeAfter') {
    need('kicker', '');
    need('title', short(46) || 'La diferencia');
    need('labelA', 'Antes');
    need('labelB', 'Después');
    need('hot', []);
  } else if (comp === 'FedLowerThird') {
    need('name', 'Dr. Valler');
    need('role', 'Medicina de la piel');
    need('topic', 'Siete aceites para la piel madura');
  } else if (comp === 'FedChecklist') {
    need('kicker', '');
    need('title', short(44) || 'Para tener en cuenta');
    need('hot', []);
  } else if (comp === 'FedCta') {
    need('kicker', '');
    need('title', short(46) || 'La ficha completa');
    need('sub', '');
    need('buttonLabel', 'Mire la descripción');
    need('hot', []);
  }

  beats.push({
    id: `b${String(beats.length).padStart(3, '0')}`,
    t: m.t,
    e: m.e,
    kind: comp === '' ? 'avatar' : m.kind === 'avatar' ? 'avatar' : 'depth',
    comp,
    props,
    says: (m.says || '').slice(0, 90),
  });
}

/* -------------------------------------------------- 5 · fallbacks genéricos */
addImg(
  'vn2_fb_gold',
  'Extreme macro of golden oil droplets sliding over a dark textured stone surface, warm amber rim light, very dark background, cinematic' + PHOTO_TAIL
);
addImg(
  'vn2_fb_cool',
  'Extreme macro of a water droplet on cold dark slate with a faint blue rim light, deep shadows, very dark background, cinematic' + PHOTO_TAIL
);
addImg(
  'vn2_fb_science',
  'Close up of a glass pipette above a petri dish on a dark laboratory bench, cold teal rim light, very dark background, cinematic' + PHOTO_TAIL
);
addImg(
  'vn2_fb_warm',
  'Close up of aged human skin on a forearm in warm low side light, visible pores and fine lines, very dark background, cinematic' + PHOTO_TAIL
);

/* ------------------------------------------------------------- 6 · salidas */
fs.mkdirSync('public/broll', {recursive: true});
fs.writeFileSync(`public/broll/shots_${SLUG}.json`, JSON.stringify(shots, null, 1));
fs.writeFileSync(`${AUD}/imgs.json`, JSON.stringify(imgs, null, 1));

/* ---- emisión del build EXPLÍCITO (un JSX por beat) en src/VideoEdit/ ------ */
const WHIP = 12;
const f = (sec) => Math.round(sec * FPS);
const KIT = [
  'FedChapter',
  'FedHero',
  'FedStat',
  'FedQuote',
  'FedMolecule',
  'FedStep',
  'FedBeforeAfter',
  'FedLowerThird',
  'FedChecklist',
  'FedCta',
  'FedFullShot',
  'FedOilCarousel',
];

const jsonProps = (o) =>
  JSON.stringify(o)
    .replace(/"(img\/[^"]+|broll\/[^"]+)"/g, `staticFile('$1')`)
    .replace(/"cards":"CARDS"/g, '"cards":CARDS');

const propLines = beats.map((b) => `  /* ${b.id} ${b.t}s */ ${jsonProps(b.props)},`).join('\n');

const depth = beats.filter((b) => b.kind === 'depth' && b.comp);
const lowers = beats.filter((b) => b.kind === 'avatar' && b.comp === 'FedLowerThird');
const idxOf = new Map(beats.map((b, i) => [b.id, i]));

const seqLine = (b) => {
  const s = f(b.t);
  const e = f(b.e);
  const dur = Math.max(4, e - s + WHIP);
  const i = idxOf.get(b.id);
  const says = (b.says || '').replace(/[*/]/g, ' ').slice(0, 62);
  return `      {/* ${b.t}s · ${says} */}
      <Sequence from={${s}} durationInFrames={${dur}} name="${b.comp} ${b.id}">
        <${b.comp} {...P[${i}]} totalF={${dur}} accent={ACCENT} />
      </Sequence>`;
};

const ltLine = (b) => {
  const s = f(b.t);
  const e = f(b.e);
  const dur = Math.max(4, e - s);
  const i = idxOf.get(b.id);
  return `      <Sequence from={${s}} durationInFrames={${dur}} name="LT ${b.id}">
        <FedLowerThird {...P[${i}]} totalF={${dur}} accent={ACCENT} avatarSrc={null} />
      </Sequence>`;
};

const main = `/**
 * ============================================================================
 * Main_${SLUG} — "Tu PIEL Arrugada Tiene SOLUCIÓN en tu Cocina (7 Aceites)"
 * Canal: Dr Valler · kit: Dr. Federer Fluid (dark-cinematic)
 * GENERADO por scripts/build_${SLUG}.mjs — no editar a mano.
 * ----------------------------------------------------------------------------
 * ARQUITECTURA (la de FedererFluid):
 *   L0 · UN solo <OffthreadVideo> del avatar, PERSISTENTE: nunca se desmonta,
 *        de ahí sale el audio y por eso no glitchea en ningún corte.
 *   L1 · lower-thirds sutiles sobre los beats de avatar.
 *   L2 · escenas de profundidad (avatar oculto) = componentes de FedererKit,
 *        cada una con SOLAPE de whip → sin cortes duros.
 * ${beats.length} beats · ${depth.length} escenas de profundidad · media ${(TOTAL_SEC / beats.length).toFixed(2)}s
 * ============================================================================
 */
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
${KIT.map((k) => '  ' + k + ',').join('\n')}
  type FedCarouselCard,
} from '../FedererKit';

export const TOTAL_FRAMES_VN2 = ${TOTAL_F};
const ACCENT = '#E9B44C';
const AVATAR = staticFile('${SLUG}_opt.mp4');
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CARDS: FedCarouselCard[] = ${JSON.stringify(CARDS, null, 2).replace(
  /"image": "(.*?)"/g,
  `"image": staticFile('$1')`
)};

/* props de cada beat (rutas literales de assets: el gate de densidad las cuenta acá) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const P: any[] = [
${propLines}
];

/* ---------------------- L0 · avatar persistente (audio) ------------------- */
const CUTS: number[] = [${depth.map((b) => b.t).join(', ')}];

const AvatarLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let act = 0;
  for (let i = 0; i < CUTS.length; i++) {
    const d = Math.abs(t - CUTS[i]);
    if (d > 0.5) continue;
    const b = interpolate(d, [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045], CLAMP);
  const hx =
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const hy = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  return (
    <>
      <AbsoluteFill
        style={{
          transform: \`translate(\${(hx - act * width * 0.02).toFixed(1)}px, \${hy.toFixed(
            1
          )}px) scale(\${(push * (1 + act * 0.016)).toFixed(4)})\`,
          filter: \`blur(\${(act * 7).toFixed(2)}px)\`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo src={AVATAR} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background:
              'linear-gradient(160deg, rgba(233,180,76,0.05), transparent 38%, transparent 68%, rgba(2,6,14,0.3))',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%, transparent 60%, rgba(2,5,12,0.46) 100%)',
        }}
      />
    </>
  );
};

/* ================================ COMPOSICIÓN ============================= */

export const MainVn2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, Math.round(0.4 * fps)], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - Math.round(0.7 * fps));
  const fadeOut = interpolate(frame, [foS, Math.max(foS + 1, durationInFrames - 1)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      <AvatarLayer />

${lowers.map(ltLine).join('\n')}

${depth.map(seqLine).join('\n')}

      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: 'none',
          background:
            'radial-gradient(125% 105% at 50% 46%, transparent 62%, rgba(1,3,8,0.3) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: '#020409',
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default MainVn2;
`;
fs.mkdirSync('src/VideoEdit', {recursive: true});
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, main);
fs.writeFileSync(
  `${AUD}/beats_${SLUG}.json`,
  JSON.stringify(beats.map(({id, t, e, kind, comp, says}) => ({id, t, e, kind, comp, says})), null, 0)
);

/* --------------------------------------------------------------- 7 · reporte */
const byComp = {};
for (const b of beats) byComp[b.comp || '(avatar)'] = (byComp[b.comp || '(avatar)'] || 0) + 1;
const avatarSec = beats.filter((b) => b.kind === 'avatar').reduce((s, b) => s + (b.e - b.t), 0);
const maxShot = Math.max(...beats.filter((b) => b.kind === 'depth').map((b) => b.e - b.t));
console.log('beats:', beats.length, '| total frames:', TOTAL_F);
console.log('avatar:', beats.filter((b) => b.kind === 'avatar').length, `(${((avatarSec / TOTAL_SEC) * 100).toFixed(0)}% del tiempo)`);
console.log('componentes:', JSON.stringify(byComp));
console.log('clips pexels:', shots.length, '| imágenes:', imgs.length);
console.log('toma depth más larga:', maxShot.toFixed(1) + 's');
console.log('media por beat:', (TOTAL_SEC / beats.length).toFixed(2) + 's');
