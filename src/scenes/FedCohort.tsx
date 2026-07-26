/* ############################################################################
 * FED_COHORT — "LA COHORTE" · ficha de estudio sobre PAPEL CLARO
 *
 *   EXCEPCIÓN DELIBERADA al kit dark-cinematic: fondo blanco hueso con grilla.
 *   El resto del video es oscuro; este momento respira en blanco y corta.
 *   Se mantiene el acento dorado del canal (#E9B44C) y la misma tipografía.
 *
 *   GUION VISUAL (todo en fracciones del hold = totalF - FED_WHIP_F):
 *     1. entra el papel: hueso, degradado de luz, viñeta suave, textura
 *     2. se DIBUJA la grilla (puntos finos + rieles mayores con stagger)
 *     3. aparecen las personitas UNA POR UNA (pop de escala + subida) con
 *        sombra proyectada, desplazada y desenfocada, en capa propia
 *     4. RANDOMIZACIÓN: las figuras migran a dos bloques con arco y delay
 *        propio; la sombra las acompaña (se achica y aclara cuando despegan)
 *     5. baja la ETIQUETA DE TRATAMIENTO sobre cada grupo: tarjeta con la
 *        foto del producto en mixBlendMode multiply (el blanco desaparece)
 *        o, si no hay imagen, un frasco dibujado a mano en SVG
 *     6. rótulo de grupo + RESULTADO con contador; el ganador se resalta con
 *        barra dorada y escala, el otro baja opacidad
 *
 *   CAPAS
 *     L0  papel: base hueso + luz cálida + degradado de profundidad
 *     L1  textura de papel (fractalNoise en multiply, muy suave)
 *     L2  grilla que se dibuja: puntos finos + rieles mayores con stagger
 *     L3  polvo en multiply (motas cálidas, no brillos)
 *     L4  SOMBRAS de las figuras (capa propia, desenfocada y desplazada)
 *     L5  FIGURAS en SVG (silueta persona, gradiente propio, respiración)
 *     L6  conector punteado + CHIPS de producto con su propia sombra
 *     L7  rótulos de grupo (pastilla con conteo real)
 *     L8  RESULTADOS: contador gigante + barra del ganador + subtítulo
 *     L9  cabecera: kicker, título, subtítulo, regla que se dibuja, ficha N
 *     L10 viñeta + grano MUY bajado (el grano fuerte arruina el blanco)
 *
 *   Escala de 3s (90f) a 6s (180f) y funciona con 1 o 2 grupos.
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {
  CLAMP,
  COOL_BLUE,
  DEFAULT_ACCENT,
  FED_SCENE_F,
  FED_WHIP_F,
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  MotesLayer,
  TEAL,
  TransitionShell,
  makeMotes,
  rgba,

  type FedTransitionVariant,
} from '../FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedCohortGroup = {
  label: string;
  image?: string; // ruta ya resuelta con staticFile por quien lo usa
  result?: string; // ej '46,8% de mejoría'
  value?: number; // para el contador
  suffix?: string;
  tone?: 'good' | 'bad' | 'neutral';
  count?: number; // cuántas figuras van a este grupo
};

export type FedCohortProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  n?: number;
  maxFigures?: number;
  kicker?: string;
  title?: string;
  sub?: string;
  groups?: FedCohortGroup[];
  unit?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;
const CX = STAGE_W / 2;

const HEAD_X = 118;
const RULE_Y = 226;

const CHIP_TOP = 268;
const CHIP_W = 306;
const CHIP_H = 186;

const CLUSTER_CY = 620; // centro vertical de las figuras
const BAND_H = 234; // alto máximo que puede ocupar un bloque de figuras
const GROUND_Y = 752; // piso donde apoyan las sombras
const PILL_Y = 770;
const RESULT_Y = 828;

const SPLIT_DX = 330; // separación de los dos bloques respecto del centro
const CLUSTER_MAX_W2 = 468; // ancho máximo de un bloque con 2 grupos
const ROSTER_MAX_W = 1480;

const EASE_MOVE = Easing.bezier(0.24, 0.9, 0.18, 1);
const EASE_SOFT = Easing.out(Easing.cubic);

/* ------------------------------------------------------------------ color */

const PAPER = '#F2EFE9';
const INK = '#1C212A';
const GRAPHITE = '#454F5E'; // figura sin asignar

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = Number.parseInt(full.length === 6 ? full : '000000', 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const hex2 = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');

const toHex = (c: [number, number, number]) => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}`;

/** aclara/oscurece manteniendo hex (shade() del kit devuelve rgb(), no sirve para rgba()) */
const tone = (hex: string, f: number): string => {
  const c = toRgb(hex);
  return toHex([c[0] * f, c[1] * f, c[2] * f]);
};

const mixHex = (a: string, b: string, t: number): string => {
  const k = clamp01(t);
  const ca = toRgb(a);
  const cb = toRgb(b);
  return toHex([
    ca[0] + (cb[0] - ca[0]) * k,
    ca[1] + (cb[1] - ca[1]) * k,
    ca[2] + (cb[2] - ca[2]) * k,
  ]);
};

/* --------------------------------------------------------------- utilidad */

const fmtEs = (v: number, dec: number): string =>
  dec > 0 ? v.toFixed(dec).replace('.', ',') : String(Math.round(v));

/* --------------------------------------------------- layout de la cohorte */

type FigSpec = {
  g: number; // grupo destino
  sx: number; // roster (nube inicial ordenada)
  sy: number;
  tx: number; // bloque del grupo
  ty: number;
  bow: number; // arco de la migración
  phase: number; // fase de respiración
  jitter: number; // stagger de la migración
  tint: number; // micro-variación de tono
  lean: number; // micro-rotación
};

type Layout = {
  W: number;
  H: number;
  figs: FigSpec[];
};

const colsForCluster = (c: number): number =>
  c <= 5 ? Math.max(1, c) : c <= 12 ? Math.ceil(c / 2) : c <= 21 ? Math.ceil(c / 3) : Math.ceil(c / 4);

const buildLayout = (drawn: number, drawnCounts: number[], centers: number[]): Layout => {
  const nGroups = drawnCounts.length;

  /* tamaño base según cuántas figuras hay que dibujar */
  const baseW = drawn <= 12 ? 80 : drawn <= 24 ? 64 : drawn <= 32 ? 54 : 46;

  /* roster: bloque ancho de 2-4 filas, se lee como "la sala llena" */
  const rows0 = drawn <= 20 ? 2 : drawn <= 33 ? 3 : 4;
  const cols0 = Math.max(1, Math.ceil(drawn / rows0));
  const rows0Real = Math.max(1, Math.ceil(drawn / cols0));

  const colsT = drawnCounts.map((c) => Math.max(1, colsForCluster(Math.max(1, c))));
  const rowsT = drawnCounts.map((c, i) => Math.max(1, Math.ceil(Math.max(1, c) / colsT[i])));

  /* ancho = W*(1.40*cols - 0.40) · alto = W*(1.581*rows - 0.031) */
  const wUnit = (cols: number) => 1.4 * cols - 0.4;
  const hUnit = (rows: number) => 1.581 * rows - 0.031;

  const maxRows = Math.max(rows0Real, ...rowsT);
  const maxClusterW = Math.max(...colsT.map((c) => wUnit(c)));
  const clusterCap = nGroups > 1 ? CLUSTER_MAX_W2 : 1180;

  const W = Math.min(
    baseW,
    BAND_H / hUnit(maxRows),
    clusterCap / maxClusterW,
    ROSTER_MAX_W / wUnit(cols0)
  );
  const H = W * 1.55;
  const gapX = W * 1.4;
  const gapY = W * 1.581;

  /* asignación ALEATORIZADA (es un ensayo: el reparto no es por orden) */
  const idx = new Array(drawn).fill(0).map((_, i) => i);
  const shuffled = idx
    .slice()
    .sort((a, b) => random(`fedcohort-alloc-${a}`) - random(`fedcohort-alloc-${b}`));

  const groupOf = new Array<number>(drawn).fill(0);
  let cursor = 0;
  for (let g = 0; g < nGroups; g++) {
    const take = g === nGroups - 1 ? drawn - cursor : drawnCounts[g];
    for (let k = 0; k < take && cursor < drawn; k++) {
      groupOf[shuffled[cursor]] = g;
      cursor += 1;
    }
  }

  /* slots por grupo, en orden de lectura del roster (evita cruces feos) */
  const slotCursor = new Array<number>(nGroups).fill(0);
  const figs: FigSpec[] = [];

  for (let i = 0; i < drawn; i++) {
    const col0 = i % cols0;
    const row0 = Math.floor(i / cols0);
    const rowCount0 = Math.min(cols0, drawn - row0 * cols0);
    const sx = CX + (col0 - (rowCount0 - 1) / 2) * gapX;
    const sy = CLUSTER_CY + (row0 - (rows0Real - 1) / 2) * gapY;

    const g = groupOf[i];
    const slot = slotCursor[g];
    slotCursor[g] += 1;

    const cols = colsT[g];
    const rows = rowsT[g];
    const count = Math.max(1, drawnCounts[g]);
    const col = slot % cols;
    const row = Math.floor(slot / cols);
    const rowCount = Math.min(cols, count - row * cols);
    const tx = centers[g] + (col - (Math.max(1, rowCount) - 1) / 2) * gapX;
    const ty = CLUSTER_CY + (row - (rows - 1) / 2) * gapY;

    const s = `fedcohort-fig-${i}`;
    figs.push({
      g,
      sx,
      sy,
      tx,
      ty,
      bow: 0.5 + random(`${s}-bow`) * 0.7,
      phase: random(`${s}-ph`) * Math.PI * 2,
      jitter: random(`${s}-j`),
      tint: 0.9 + random(`${s}-t`) * 0.2,
      lean: (random(`${s}-l`) - 0.5) * 3.4,
    });
  }

  return {W, H, figs};
};

/* ---------------------------------------------------------------- figura */

/** silueta de persona: cabeza + torso con hombros redondeados. 100% SVG. */
const Person: React.FC<{
  w: number;
  h: number;
  fill: string;
  gradId: string;
  rim: string;
}> = ({w, h, fill, gradId, rim}) => {
  const top = tone(fill, 1.16);
  const bot = tone(fill, 0.78);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 60 96"
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={gradId} x1="0.18" y1="0" x2="0.82" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="52%" stopColor={fill} />
          <stop offset="100%" stopColor={bot} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradId})`}>
        <circle cx="30" cy="16.5" r="12.4" />
        <path d="M30 33.4c-11.1 0-19.2 7.1-20.6 17.2L6.1 76.7c-.55 4.1 2 6.7 5.7 6.7h36.4c3.7 0 6.25-2.6 5.7-6.7L50.6 50.6C49.2 40.5 41.1 33.4 30 33.4z" />
      </g>
      {/* luz de borde arriba-izquierda: da volumen sin romper el plano */}
      <g fill="none" stroke={rim} strokeWidth="1.5" strokeLinecap="round">
        <path d="M20.2 10.4a12.4 12.4 0 0 1 8.2-4.2" />
        <path d="M12.6 46.6c1.9-6.4 6.6-10.6 12.6-12.3" />
      </g>
    </svg>
  );
};

/** frasco procedural para cuando el grupo no trae imagen */
const Flask: React.FC<{accentHex: string; liquid: string}> = ({accentHex, liquid}) => (
  <svg
    viewBox="0 0 100 128"
    style={{display: 'block', height: '100%', width: 'auto', maxHeight: 132}}
  >
    <defs>
      <linearGradient id="fedcohort-flask-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={rgba(INK, 0.1)} />
        <stop offset="34%" stopColor={rgba(INK, 0.02)} />
        <stop offset="100%" stopColor={rgba(INK, 0.12)} />
      </linearGradient>
      <linearGradient id="fedcohort-flask-liq" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={tone(liquid, 1.12)} />
        <stop offset="100%" stopColor={tone(liquid, 0.72)} />
      </linearGradient>
    </defs>
    <rect x="38" y="6" width="24" height="18" rx="4" fill={tone(accentHex, 0.62)} />
    <rect x="42" y="22" width="16" height="12" fill={rgba(INK, 0.3)} />
    <path
      d="M28 46c0-7 6-12 12-13.6V32h20v.4C69.9 34 76 39 76 46v62c0 6-4.4 10-10 10H38c-5.6 0-10-4-10-10z"
      fill="url(#fedcohort-flask-glass)"
      stroke={rgba(INK, 0.26)}
      strokeWidth="2"
    />
    <path
      d="M30 62h44v46c0 5-3.6 8-8.4 8H38.4C33.6 116 30 113 30 108z"
      fill="url(#fedcohort-flask-liq)"
    />
    <rect x="34" y="74" width="36" height="24" rx="3" fill={rgba(PAPER, 0.88)} />
    <rect x="39" y="81" width="26" height="3.4" rx="1.7" fill={rgba(INK, 0.34)} />
    <rect x="39" y="88" width="18" height="3" rx="1.5" fill={rgba(INK, 0.2)} />
    <path d="M36 50c1.4-5 5-8 9-9" stroke={rgba(PAPER, 0.9)} strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

/* ================================ COMPONENTE ============================== */

export const FedCohort: React.FC<FedCohortProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  n = 19,
  maxFigures = 40,
  kicker = 'Pediatric Dermatology · 2013',
  title = 'Diecinueve adultos, dos aceites',
  sub = 'Un antebrazo con oliva, el otro con girasol, durante cuatro semanas',
  groups = [
    {
      label: 'Aceite de oliva',
      result: 'la barrera perdió MÁS agua',
      value: 24,
      suffix: '%',
      tone: 'bad',
      count: 10,
    },
    {
      label: 'Aceite de girasol',
      result: 'la barrera retuvo el agua',
      value: 7,
      suffix: '%',
      tone: 'good',
      count: 9,
    },
  ],
  unit = 'adultos',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const T = Math.max(60, totalF);
  const HOLD = Math.max(40, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});

  /* ---- datos ------------------------------------------------------------ */
  const gs = React.useMemo(
    () => (groups.length > 0 ? groups.slice(0, 2) : [{label: 'Grupo 1'}]),
    [groups]
  );
  const nGroups = gs.length;

  const nSafe = Math.max(1, Math.round(n));
  const cap = Math.max(4, Math.round(maxFigures));
  const drawn = Math.min(cap, nSafe);
  const capped = nSafe > cap;

  /* conteos reales por grupo (los que se muestran en el rótulo) */
  const realCounts = React.useMemo(() => {
    const given = gs.map((g) => (typeof g.count === 'number' ? Math.max(0, Math.round(g.count)) : -1));
    if (given.every((v) => v >= 0)) return given;
    const base = Math.floor(nSafe / nGroups);
    return gs.map((_, i) => (i === 0 ? nSafe - base * (nGroups - 1) : base));
  }, [gs, nGroups, nSafe]);

  /* cuántas figuras DIBUJADAS le tocan a cada grupo (proporcional) */
  const drawnCounts = React.useMemo(() => {
    const sum = realCounts.reduce((a, b) => a + b, 0) || 1;
    const raw = realCounts.map((c) => Math.max(1, Math.round((c / sum) * drawn)));
    let diff = raw.reduce((a, b) => a + b, 0) - drawn;
    let i = 0;
    while (diff > 0 && i < 200) {
      const k = i % raw.length;
      if (raw[k] > 1) {
        raw[k] -= 1;
        diff -= 1;
      }
      i += 1;
    }
    while (diff < 0 && i < 400) {
      raw[i % raw.length] += 1;
      diff += 1;
      i += 1;
    }
    return raw;
  }, [realCounts, drawn]);

  const centers = React.useMemo(
    () => (nGroups > 1 ? [CX - SPLIT_DX, CX + SPLIT_DX] : [CX]),
    [nGroups]
  );

  const layout = React.useMemo(
    () => buildLayout(drawn, drawnCounts, centers),
    [drawn, drawnCounts, centers]
  );
  const {W: FW, H: FH, figs} = layout;

  /* colores por grupo, calibrados para leerse sobre papel claro */
  const goodInk = tone(accent, 0.7); // dorado profundo, legible en hueso
  const badInk = tone(COOL_BLUE, 0.6);
  const neuInk = tone(TEAL, 0.56);
  const inkOf = (t?: FedCohortGroup['tone']) =>
    t === 'good' ? goodInk : t === 'bad' ? badInk : neuInk;
  const figOf = (t?: FedCohortGroup['tone']) =>
    t === 'good' ? tone(accent, 0.9) : t === 'bad' ? tone(COOL_BLUE, 0.72) : tone(TEAL, 0.68);

  const winner = gs.findIndex((g) => g.tone === 'good');

  /* ---- ventanas de tiempo ----------------------------------------------- */
  const bornA = at(0.05);
  const bornB = at(0.34);
  const flyA = at(0.37);
  const flyB = at(0.62);

  const paperP = interpolate(frame, [0, at(0.1)], [0, 1], {...CLAMP, easing: EASE_SOFT});
  const gridP = ip(0.02, 0.2);
  const headP = ip(0.03, 0.18);
  const subP = ip(0.09, 0.24);
  const ruleP = ip(0.06, 0.26);
  const nCardP = ip(0.11, 0.28);
  const countP = ip(0.66, 0.86, Easing.bezier(0.16, 0.86, 0.24, 1));
  const winP = ip(0.8, 0.94);
  const footP = ip(0.7, 0.84);

  /* ---- cámara: mínima, el papel pide sutileza --------------------------- */
  const push = interpolate(frame, [0, T], [1.004, 1.026], CLAMP);
  const camX = Math.sin(frame * 0.0145) * 3.6;
  const camY = Math.cos(frame * 0.0192) * 2.8;
  const stageScale = (width / STAGE_W) * push;

  /* ---- partículas de polvo (en multiply: sombras, no brillos) ----------- */
  const dust = React.useMemo(
    () => makeMotes(22, 'fedcohort-dust', 2, 6, 0.03, 0.085, 0.05, 0.14),
    []
  );

  /* ---- grilla ------------------------------------------------------------ */
  const vRails = React.useMemo(() => {
    const a: number[] = [];
    for (let x = 120; x < STAGE_W; x += 120) a.push(x);
    return a;
  }, []);
  const hRails = React.useMemo(() => {
    const a: number[] = [];
    for (let y = 120; y < STAGE_H; y += 120) a.push(y);
    return a;
  }, []);
  const gridBreath = 0.86 + 0.14 * Math.sin(frame * 0.024);

  /* ---- estado por figura -------------------------------------------------- */
  type FigState = {
    x: number;
    y: number;
    q: number;
    pop: number;
    lift: number;
    scale: number;
    k: number;
    breath: number;
    g: number;
    tint: number;
    lean: number;
  };

  const states: FigState[] = figs.map((f, i) => {
    const b0 = bornA + ((bornB - bornA) * i) / Math.max(1, drawn);
    const s = spring({
      frame: frame - b0,
      fps,
      config: {damping: 11.5, stiffness: 165, mass: 0.62},
      durationInFrames: Math.max(12, Math.round(HOLD * 0.16)),
    });
    const pop = clamp01(s);
    const appear = interpolate(frame, [b0, b0 + 3], [0, 1], CLAMP);

    const f0 = flyA + (flyB - flyA) * 0.5 * f.jitter;
    const f1 = f0 + (flyB - flyA) * 0.5;
    const q = interpolate(frame, [f0, f1], [0, 1], {...CLAMP, easing: EASE_MOVE});
    const arc = Math.sin(q * Math.PI);

    const breath = Math.sin(frame * 0.038 + f.phase);
    const floatAmp = 1.9 * (1 - 0.45 * arc);

    /* el roster arranca más grande y la cámara "se abre" cuando se reparten */
    const k = 1 + 0.15 * (1 - q);

    const xb = CX + (f.sx + (f.tx - f.sx) * q - CX) * k;
    const yb = CLUSTER_CY + (f.sy + (f.ty - f.sy) * q - CLUSTER_CY) * k;

    /* el salto es proporcional a lo que viaja: el que casi no se mueve no rebota */
    const dist = Math.hypot(f.tx - f.sx, f.ty - f.sy);
    const travel = Math.min(1, dist / 260);
    const lift = arc * 46 * f.bow * travel;

    return {
      x: xb + breath * 0.6,
      y: yb - lift + breath * floatAmp - (1 - pop) * 34,
      q,
      pop: pop * appear,
      lift: arc * f.bow * travel,
      scale: (0.42 + 0.58 * pop) * k,
      k,
      breath,
      g: f.g,
      tint: f.tint,
      lean: f.lean * (0.4 + 0.6 * arc),
    };
  });

  /* ---- helpers de dibujo --------------------------------------------------- */

  const renderChip = (g: FedCohortGroup, gi: number) => {
    const p = interpolate(
      frame,
      [at(0.62 + gi * 0.045), at(0.79 + gi * 0.045)],
      [0, 1],
      {...CLAMP, easing: EASE_SOFT}
    );
    const drop = spring({
      frame: frame - at(0.62 + gi * 0.045),
      fps,
      config: {damping: 13, stiffness: 130, mass: 0.8},
      durationInFrames: Math.max(14, Math.round(HOLD * 0.2)),
    });
    const y = (1 - clamp01(drop)) * -74;
    const rot = (1 - clamp01(drop)) * (gi === 0 ? -3.4 : 3.4);
    const ink = inkOf(g.tone);
    const isWin = winner === gi;
    const boost = isWin ? winP : 0;
    const left = centers[gi] - CHIP_W / 2;

    return (
      <React.Fragment key={`chip-${gi}`}>
        {/* sombra propia de la tarjeta (capa aparte, desplazada) */}
        <div
          style={{
            position: 'absolute',
            left: left + 16,
            top: CHIP_TOP + CHIP_H - 22,
            width: CHIP_W - 32,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(INK, 0.2)} 0%, transparent 72%)`,
            filter: 'blur(10px)',
            opacity: p * 0.9,
            transform: `translateY(${(y * 0.24).toFixed(1)}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left,
            top: CHIP_TOP,
            width: CHIP_W,
            height: CHIP_H,
            borderRadius: 20,
            background: `linear-gradient(168deg, #FFFFFF 0%, ${mixHex('#FFFFFF', PAPER, 0.75)} 100%)`,
            border: `1px solid ${rgba(INK, 0.1)}`,
            boxShadow: [
              `0 22px 44px ${rgba(INK, 0.13)}`,
              `0 4px 10px ${rgba(INK, 0.07)}`,
              isWin ? `0 0 0 ${(2 * boost).toFixed(2)}px ${rgba(accent, 0.55 * boost)}` : '0 0 0 0 transparent',
            ].join(', '),
            transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${(
              0.94 +
              0.06 * clamp01(drop) +
              0.02 * boost
            ).toFixed(4)})`,
            transformOrigin: '50% 0%',
            opacity: p,
            overflow: 'hidden',
          }}
        >
          {/* barrido de luz al aterrizar */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              bottom: '-30%',
              left: 0,
              width: '48%',
              transform: `translateX(${interpolate(p, [0.15, 1], [-70, 250], CLAMP).toFixed(
                0
              )}%) skewX(-16deg)`,
              background: `linear-gradient(100deg, transparent 16%, ${rgba(
                accent,
                0.2
              )} 50%, transparent 84%)`,
              opacity: Math.sin(clamp01(p) * Math.PI),
              pointerEvents: 'none',
            }}
          />
          {/* imagen del producto (arriba) + nombre (abajo), sin pisarse nunca */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '14px 14px 22px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mixBlendMode: 'multiply',
              }}
            >
              {g.image ? (
                <Img
                  src={g.image}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    transform: `scale(${(0.9 + 0.1 * clamp01(drop)).toFixed(3)})`,
                  }}
                />
              ) : (
                <Flask
                  accentHex={accent}
                  liquid={isWin ? accent : mixHex(accent, '#6E6A58', 0.62)}
                />
              )}
            </div>
            {/* nombre del tratamiento */}
            <div
              style={{
                marginTop: 8,
                textAlign: 'center',
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: g.label.length > 18 ? 19 : 21,
                letterSpacing: 1.3,
                lineHeight: 1.12,
                textTransform: 'uppercase',
                color: ink,
              }}
            >
              {g.label}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 8,
              width: 46,
              marginLeft: -23,
              height: 2,
              borderRadius: 1,
              background: rgba(ink, 0.4),
              transform: `scaleX(${p.toFixed(3)})`,
            }}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderConnector = (gi: number) => {
    const p = interpolate(frame, [at(0.66 + gi * 0.04), at(0.8 + gi * 0.04)], [0, 1], {
      ...CLAMP,
      easing: EASE_SOFT,
    });
    const top = CHIP_TOP + CHIP_H + 6;
    const h = 34;
    return (
      <div
        key={`conn-${gi}`}
        style={{
          position: 'absolute',
          left: centers[gi] - 1,
          top,
          width: 2,
          height: h * p,
          background: `repeating-linear-gradient(to bottom, ${rgba(
            inkOf(gs[gi].tone),
            0.5
          )} 0px, ${rgba(inkOf(gs[gi].tone), 0.5)} 5px, transparent 5px, transparent 11px)`,
          opacity: p,
        }}
      />
    );
  };

  const renderPill = (g: FedCohortGroup, gi: number) => {
    const p = interpolate(frame, [at(0.58 + gi * 0.04), at(0.72 + gi * 0.04)], [0, 1], {
      ...CLAMP,
      easing: EASE_SOFT,
    });
    const ink = inkOf(g.tone);
    const isWin = winner === gi;
    const dim = winner >= 0 && !isWin ? 1 - 0.38 * winP : 1;
    return (
      <div
        key={`pill-${gi}`}
        style={{
          position: 'absolute',
          left: centers[gi] - 240,
          top: PILL_Y,
          width: 480,
          textAlign: 'center',
          opacity: p * dim,
          transform: `translateY(${((1 - p) * 12).toFixed(1)}px)`,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '7px 18px',
            borderRadius: 999,
            background: isWin ? rgba(accent, 0.14) : rgba(INK, 0.05),
            border: `1px solid ${isWin ? rgba(accent, 0.42) : rgba(INK, 0.12)}`,
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 2.6,
            textTransform: 'uppercase',
            color: isWin ? tone(accent, 0.6) : rgba(INK, 0.62),
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: ink,
            }}
          />
          {nGroups > 1 ? `Grupo ${gi + 1}` : 'Cohorte'}
          <span style={{opacity: 0.42}}>·</span>
          {`${realCounts[gi]} ${unit}`}
        </span>
      </div>
    );
  };

  const renderResult = (g: FedCohortGroup, gi: number) => {
    const isWin = winner === gi;
    const dim = winner >= 0 && !isWin ? 1 - 0.42 * winP : 1;
    const ink = inkOf(g.tone);
    const hasVal = typeof g.value === 'number';
    const dec = hasVal && !Number.isInteger(g.value as number) ? 1 : 0;
    const cur = hasVal ? (g.value as number) * countP : 0;
    const pop = interpolate(countP, [0.86, 1], [0, 1], CLAMP);
    const capP = interpolate(frame, [at(0.72), at(0.9)], [0, 1], {...CLAMP, easing: EASE_SOFT});

    return (
      <div
        key={`res-${gi}`}
        style={{
          position: 'absolute',
          left: centers[gi] - 290,
          top: RESULT_Y,
          width: 580,
          textAlign: 'center',
          opacity: dim,
          transform: `scale(${(1 + (isWin ? 0.045 * winP : 0)).toFixed(4)})`,
          transformOrigin: '50% 20%',
        }}
      >
        {/* barra dorada del ganador */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -12,
            width: 300 * (isWin ? winP : 0),
            marginLeft: -150 * (isWin ? winP : 0),
            height: 5,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${rgba(accent, 0)}, ${accent} 22%, ${accent} 78%, ${rgba(
              accent,
              0
            )})`,
            boxShadow: `0 3px 14px ${rgba(accent, 0.5 * (isWin ? winP : 0))}`,
            opacity: isWin ? winP : 0,
          }}
        />
        {hasVal ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 3,
              opacity: interpolate(countP, [0, 0.05], [0, 1], CLAMP),
              transform: `scale(${(1 + pop * 0.03).toFixed(4)})`,
              transformOrigin: '50% 100%',
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 92,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
                color: isWin ? tone(accent, 0.66) : rgba(INK, 0.74),
                textShadow: isWin
                  ? `0 4px 22px ${rgba(accent, 0.34 * winP)}`
                  : `0 3px 14px ${rgba(INK, 0.1)}`,
              }}
            >
              {fmtEs(cur, dec)}
            </span>
            {g.suffix ? (
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: 44,
                  color: isWin ? tone(accent, 0.72) : rgba(INK, 0.5),
                }}
              >
                {g.suffix}
              </span>
            ) : null}
          </div>
        ) : null}
        {g.result ? (
          <div
            style={{
              marginTop: hasVal ? 6 : 26,
              fontFamily: hasVal ? FONT_SANS : FONT_SERIF,
              fontWeight: hasVal ? 600 : 400,
              fontStyle: hasVal ? 'normal' : 'italic',
              fontSize: hasVal ? 21 : 30,
              letterSpacing: hasVal ? 1.6 : 0.4,
              textTransform: hasVal ? 'uppercase' : 'none',
              color: isWin ? tone(accent, 0.58) : rgba(INK, 0.52),
              opacity: capP,
              transform: `translateY(${((1 - capP) * 10).toFixed(1)}px)`,
            }}
          >
            {g.result}
          </div>
        ) : null}
        <div
          style={{
            marginTop: 10,
            height: 1,
            width: 200 * capP,
            marginLeft: 'auto',
            marginRight: 'auto',
            background: rgba(ink, 0.24),
          }}
        />
      </div>
    );
  };

  /* ============================== RENDER ================================= */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: PAPER, overflow: 'hidden'}}>
        {/* =============== L0 · PAPEL: base + luz + profundidad =============== */}
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(72% 58% at 28% 16%, ${rgba('#FFFFFF', 0.95)} 0%, transparent 62%)`,
              `radial-gradient(52% 46% at 78% 84%, ${rgba(accent, 0.11)} 0%, transparent 68%)`,
              `linear-gradient(160deg, ${mixHex(PAPER, '#FFFFFF', 0.55)} 0%, ${PAPER} 44%, ${mixHex(
                PAPER,
                '#D9D2C4',
                0.42
              )} 100%)`,
            ].join(', '),
            opacity: paperP,
          }}
        />

        {/* =============== L1 · textura de papel (multiply muy suave) ========= */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.05 * paperP,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        >
          <filter id="fedCohortPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fedCohortPaper)" />
        </svg>

        {/* ============ ESCENARIO 1920x1080 con cámara mínima ================= */}
        <AbsoluteFill
          style={{
            transform: `scale(${stageScale.toFixed(5)}) translate(${camX.toFixed(
              2
            )}px, ${camY.toFixed(2)}px)`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: STAGE_W,
              height: STAGE_H,
              marginLeft: -STAGE_W / 2,
              marginTop: -STAGE_H / 2,
            }}
          >
            {/* =========== L2 · GRILLA que se dibuja =========== */}
            {/* puntos finos */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(${rgba(INK, 0.16)} 1.05px, transparent 1.05px)`,
                backgroundSize: '30px 30px',
                opacity: gridP * 0.85 * gridBreath,
                maskImage:
                  'radial-gradient(120% 100% at 50% 48%, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 88%)',
                WebkitMaskImage:
                  'radial-gradient(120% 100% at 50% 48%, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 88%)',
              }}
            />
            {/* rieles mayores verticales: se dibujan de arriba hacia abajo */}
            {vRails.map((x, i) => {
              const p = interpolate(gridP, [i * 0.028, i * 0.028 + 0.42], [0, 1], CLAMP);
              return (
                <div
                  key={`v-${x}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: 0,
                    width: 1,
                    height: `${(p * 100).toFixed(2)}%`,
                    background: `linear-gradient(to bottom, ${rgba(INK, 0.055)}, ${rgba(
                      INK,
                      0.085
                    )} 46%, ${rgba(INK, 0.03)})`,
                  }}
                />
              );
            })}
            {/* rieles mayores horizontales: se dibujan del centro hacia afuera */}
            {hRails.map((y, i) => {
              const p = interpolate(gridP, [0.1 + i * 0.026, 0.1 + i * 0.026 + 0.42], [0, 1], CLAMP);
              return (
                <div
                  key={`h-${y}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: y,
                    width: `${(p * 100).toFixed(2)}%`,
                    marginLeft: `${(-p * 50).toFixed(2)}%`,
                    height: 1,
                    background: rgba(INK, 0.07),
                  }}
                />
              );
            })}
            {/* línea de piso donde apoyan las sombras */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: GROUND_Y,
                width: `${(gridP * 92).toFixed(1)}%`,
                marginLeft: `${(-gridP * 46).toFixed(1)}%`,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${rgba(INK, 0.16)} 18%, ${rgba(
                  INK,
                  0.16
                )} 82%, transparent)`,
              }}
            />

            {/* =========== L3 · polvo en multiply =========== */}
            <div style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.5}}>
              <MotesLayer motes={dust} blur={1.1} scale={1} tint="96, 86, 68" />
            </div>

            {/* =========== L4 · SOMBRAS de las figuras (capa propia) =========== */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                filter: 'blur(7px)',
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
              }}
            >
              {states.map((s, i) => {
                if (s.pop <= 0.005) return null;
                const spread = 1 + 0.34 * s.lift;
                const sw = FW * s.k * 1.16 * spread;
                const sh = FH * s.k * 0.2;
                const fade = (0.26 - 0.13 * s.lift) * s.pop;
                return (
                  <div
                    key={`sh-${i}`}
                    style={{
                      position: 'absolute',
                      left: s.x - sw / 2 + FW * s.k * 0.3 + s.lift * 10,
                      top: s.y + FH * s.k * 0.42 + s.lift * 24,
                      width: sw,
                      height: sh,
                      borderRadius: '50%',
                      background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                        '#2A3040',
                        fade
                      )} 0%, ${rgba('#2A3040', fade * 0.45)} 52%, transparent 76%)`,
                      transform: `skewX(-19deg)`,
                    }}
                  />
                );
              })}
            </div>

            {/* =========== L5 · FIGURAS =========== */}
            <div style={{position: 'absolute', inset: 0}}>
              {states.map((s, i) => {
                if (s.pop <= 0.005) return null;
                const g = gs[s.g];
                const target = figOf(g?.tone);
                const base = mixHex(GRAPHITE, target, s.q);
                const fill = tone(base, s.tint);
                const isWin = winner === s.g && s.q > 0.4;
                const dim = winner >= 0 && s.g !== winner ? 1 - 0.26 * winP * s.q : 1;
                const breathScale = 1 + s.breath * 0.008;
                return (
                  <div
                    key={`fig-${i}`}
                    style={{
                      position: 'absolute',
                      left: s.x - FW / 2,
                      top: s.y - FH / 2,
                      width: FW,
                      height: FH,
                      transform: `scale(${(s.scale * breathScale).toFixed(4)}) rotate(${s.lean.toFixed(
                        2
                      )}deg)`,
                      transformOrigin: '50% 88%',
                      opacity: s.pop * dim,
                      filter: isWin
                        ? `drop-shadow(0 0 ${(9 * winP).toFixed(1)}px ${rgba(accent, 0.5 * winP)})`
                        : 'none',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <Person
                      w={FW}
                      h={FH}
                      fill={fill}
                      gradId={`fedcohort-grad-${i}`}
                      rim={rgba('#FFFFFF', 0.42)}
                    />
                  </div>
                );
              })}
            </div>

            {/* =========== L6 · conectores + CHIPS de producto =========== */}
            {gs.map((_, gi) => renderConnector(gi))}
            {gs.map((g, gi) => renderChip(g, gi))}

            {/* =========== L7 · rótulos de grupo =========== */}
            {gs.map((g, gi) => renderPill(g, gi))}

            {/* =========== L8 · resultados con contador =========== */}
            {gs.map((g, gi) => renderResult(g, gi))}

            {/* =========== L9 · CABECERA + ficha N =========== */}
            {/* kicker */}
            <div
              style={{
                position: 'absolute',
                left: HEAD_X,
                top: 58,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: headP,
                transform: `translateY(${((1 - headP) * -12).toFixed(1)}px)`,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 3,
                  borderRadius: 2,
                  background: accent,
                  transform: `scaleX(${headP.toFixed(3)})`,
                  transformOrigin: '0% 50%',
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: 4.4,
                  textTransform: 'uppercase',
                  color: tone(accent, 0.62),
                }}
              >
                {kicker}
              </span>
            </div>
            {/* título */}
            <div
              style={{
                position: 'absolute',
                left: HEAD_X,
                top: 96,
                width: 1200,
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 56,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: INK,
                opacity: headP,
                transform: `translateY(${((1 - headP) * 18).toFixed(1)}px)`,
              }}
            >
              {title}
            </div>
            {/* subtítulo serif */}
            <div
              style={{
                position: 'absolute',
                left: HEAD_X + 2,
                top: 172,
                width: 1180,
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 27,
                lineHeight: 1.25,
                color: rgba(INK, 0.56),
                opacity: subP,
                transform: `translateY(${((1 - subP) * 12).toFixed(1)}px)`,
              }}
            >
              {sub}
            </div>
            {/* regla que se dibuja */}
            <div
              style={{
                position: 'absolute',
                left: HEAD_X,
                top: RULE_Y,
                width: (STAGE_W - HEAD_X * 2) * ruleP,
                height: 1,
                background: `linear-gradient(90deg, ${rgba(INK, 0.3)}, ${rgba(INK, 0.08)})`,
              }}
            />
            {/* ficha N, arriba a la derecha */}
            <div
              style={{
                position: 'absolute',
                left: STAGE_W - HEAD_X - 344,
                top: 54,
                width: 344,
                padding: '14px 18px 16px',
                borderRadius: 14,
                background: rgba('#FFFFFF', 0.72),
                border: `1px solid ${rgba(INK, 0.1)}`,
                boxShadow: `0 12px 28px ${rgba(INK, 0.08)}`,
                textAlign: 'right',
                opacity: nCardP,
                transform: `translateY(${((1 - nCardP) * -14).toFixed(1)}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 3.6,
                  textTransform: 'uppercase',
                  color: rgba(INK, 0.42),
                }}
              >
                Participantes
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  gap: 8,
                  marginTop: 2,
                  flexWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontSize: 34,
                    color: rgba(INK, 0.42),
                    whiteSpace: 'nowrap',
                  }}
                >
                  n =
                </span>
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 800,
                    fontSize: nSafe >= 1000 ? 46 : nSafe >= 100 ? 54 : 62,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                    color: INK,
                  }}
                >
                  {Math.round(interpolate(nCardP, [0, 1], [0, nSafe], CLAMP))}
                </span>
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: tone(accent, 0.66),
                  }}
                >
                  {unit}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${rgba(accent, 0)}, ${accent})`,
                  transform: `scaleX(${nCardP.toFixed(3)})`,
                  transformOrigin: '100% 50%',
                }}
              />
            </div>
            {/* nota de muestra parcial */}
            {capped ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 1002,
                  textAlign: 'center',
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 2.4,
                  textTransform: 'uppercase',
                  color: rgba(INK, 0.34),
                  opacity: footP,
                }}
              >
                {`muestra visual parcial · ${drawn} de ${nSafe} ${unit}`}
              </div>
            ) : null}
          </div>
        </AbsoluteFill>

        {/* =============== L10 · viñeta + grano MUY bajo =============== */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(126% 108% at 50% 46%, transparent 46%, ${rgba(
              '#8C8271',
              0.2
            )} 84%, ${rgba('#6E6555', 0.3)} 100%)`,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
        <div style={{position: 'absolute', inset: 0, opacity: 0.34, pointerEvents: 'none'}}>
          <GrainOverlay />
        </div>
      </AbsoluteFill>
    </TransitionShell>
  );
};

export default FedCohort;
