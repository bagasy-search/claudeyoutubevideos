/* ############################################################################
 * FED_NIGHT_PUMP — "LA BOMBA Y EL SILENCIO" · díptico día / noche
 *
 *   Por qué el hormigueo aparece justo al acostarse: de día la PANTORRILLA es
 *   una bomba (el "segundo corazón") que empuja sangre hacia arriba a cada
 *   paso, y encima el ruido de la casa TAPA el ruidito del nervio. De noche se
 *   apaga la bomba, se apaga la tele, y recién ahí el nervio queda SOLO.
 *
 *   GUION VISUAL (todo en fracciones del hold = totalF - FED_WHIP_F):
 *     1. entran los dos paneles y se DIBUJA el separador vertical
 *     2. IZQUIERDA: la pierna camina en loop, la pantorrilla se contrae y unas
 *        burbujas/flechas suben por la vena a cada contracción
 *     3. IZQUIERDA: suben las barras del ruido ambiente y TAPAN la onda fina
 *        y roja del nervio (que ya está ahí, pero casi no se ve)
 *     4. DERECHA: la misma pierna aparece y se ACUESTA sobre la cama
 *     5. DERECHA: tres latidos y un ÚLTIMO latido más fuerte — la bomba para
 *     6. DERECHA: las barras del ruido CAEN a casi cero
 *     7. DERECHA: la onda del nervio queda SOLA, brilla y pulsa (paquete que
 *        viaja + punto luminoso) con su rótulo
 *
 *   CAPAS
 *     L0  Stage del kit (moodBg + motas + viñeta) con cámara suave
 *     L1  paneles día/noche (tinte cálido vs tinte frío) + separador
 *     L2  cabecera: kicker + título con `hot`
 *     L3  rótulos de panel + subtítulo + chip de estado de la bomba
 *     L4  piso (día) / cama (noche) con sombra propia
 *     L5  PIERNA en SVG: silueta, músculo que se contrae, vena y burbujas
 *     L6  ZONA DE ONDAS: nervio (atrás) + barras de ruido ambiente (adelante)
 *     L7  rótulo del nervio con línea guía (solo de noche)
 *     L8  pie de escena + grano
 *
 *   Escala de 100f a 240f: NADA está anclado a un frame absoluto.
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
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
  Kicker,
  Stage,
  TransitionShell,
  Words,
  rgba,
  type FedMood,
  type FedTransitionVariant,
} from '../../FedererKit';

/* ------------------------------------------------------------------ color */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = Number.parseInt(full.length === 6 ? full : '000000', 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const hex2 = (v: number) =>
  Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');

const toHex = (c: [number, number, number]) => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}`;

/** aclara/oscurece devolviendo HEX (shade() del kit devuelve rgb() y no sirve para rgba()) */
const tint = (hex: string, f: number): string => {
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

const NERVE = '#FF6B5A';
const INK = '#EAF0FF';

const EASE_SOFT = Easing.out(Easing.cubic);
const EASE_MOVE = Easing.bezier(0.24, 0.9, 0.18, 1);

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;

const PANEL_W = 830;
const PANEL_TOP = 214;
const PANEL_H = 702;
const DAY_X = 92;
const NIGHT_X = 998;
const SPLIT_X = 960;
const PAD = 44;

const LEG_TOP = 372;
const LEG_H = 264;
const LEG_W = 123;

const GROUND_Y = 626; // piso del día
const BED_Y = 600; // superficie de la cama (noche)

const WAVE_Y = 692;
const WAVE_H = 204;
const WAVE_W = PANEL_W - PAD * 2; // 742
const WAVE_BASE = 192; // línea de base de las barras, en coords del svg
const WAVE_MID = 126; // altura de la onda del nervio, en coords del svg
const BAR_MAX = 150;
const N_BARS = 24;

/* silueta de la pierna: muslo, rodilla, pantorrilla, tobillo y pie */
const LEG_D =
  'M 48 4 L 88 4 C 92 56 90 108 84 150 C 82 186 80 224 78 254 L 118 260 ' +
  'C 126 262 126 276 117 278 L 62 281 C 52 282 47 274 50 263 ' +
  'C 44 232 33 202 40 166 C 45 132 46 70 48 4 Z';

/* vena que sube del tobillo al muslo (una cúbica; la evaluamos para las burbujas) */
const VEIN_D = 'M 58 264 C 34 196 86 132 66 12';
const VEIN_P: [number, number][] = [
  [58, 264],
  [34, 196],
  [86, 132],
  [66, 12],
];

const veinAt = (t: number): [number, number] => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * VEIN_P[0][0] + b * VEIN_P[1][0] + c * VEIN_P[2][0] + d * VEIN_P[3][0],
    a * VEIN_P[0][1] + b * VEIN_P[1][1] + c * VEIN_P[2][1] + d * VEIN_P[3][1],
  ];
};

const frac = (v: number) => v - Math.floor(v);

/* =========================== PIERNA (100% SVG) =========================== */

const LegFigure: React.FC<{
  uid: string;
  top: string; // hex claro
  bot: string; // hex oscuro
  rim: string; // rgba del filo de luz
  vein: string; // rgba de la vena
  flowColor: string; // hex de las burbujas
  pump: number; // 0..1 contracción de la pantorrilla
  flow: number; // 0..1 cuánta sangre está subiendo
  cycle: number; // fase continua de las burbujas
  draw: number; // 0..1 aparición
}> = ({uid, top, bot, rim, vein, flowColor, pump, flow, cycle, draw}) => {
  const bubbles: React.ReactNode[] = [];
  if (flow > 0.01) {
    for (let i = 0; i < 7; i++) {
      const t = frac(cycle - i * 0.135);
      const o = Math.sin(t * Math.PI) * flow;
      if (o <= 0.02) continue;
      const [bx, by] = veinAt(t);
      const s = 0.82 + 0.34 * Math.sin(t * Math.PI);
      bubbles.push(
        <g key={`b-${i}`} transform={`translate(${bx.toFixed(2)} ${by.toFixed(2)}) scale(${s.toFixed(3)})`} opacity={o}>
          <circle r="7.6" fill={rgba(flowColor, 0.16)} />
          <circle r="3.1" fill={flowColor} />
          <path
            d="M -5.2 -5.4 L 0 -11.4 L 5.2 -5.4"
            fill="none"
            stroke={flowColor}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </g>
      );
    }
  }

  const muscle = 1 + 0.15 * pump; // se ensancha
  const muscleY = 1 - 0.1 * pump; // y se acorta
  const dash = 640;

  return (
    <svg
      width={LEG_W}
      height={LEG_H}
      viewBox="0 0 140 300"
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0.1" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="46%" stopColor={mixHex(top, bot, 0.45)} />
          <stop offset="100%" stopColor={bot} />
        </linearGradient>
        <radialGradient id={`${uid}-musc`} cx="0.42" cy="0.4" r="0.7">
          <stop offset="0%" stopColor={rgba(top, 0.85)} />
          <stop offset="62%" stopColor={rgba(top, 0.26)} />
          <stop offset="100%" stopColor={rgba(top, 0)} />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={LEG_D} />
        </clipPath>
      </defs>

      {/* silueta: se DIBUJA el contorno y después se rellena */}
      <path
        d={LEG_D}
        fill={`url(#${uid}-skin)`}
        opacity={interpolate(draw, [0.35, 1], [0, 1], CLAMP)}
      />
      <g clipPath={`url(#${uid}-clip)`}>
        {/* músculo de la pantorrilla: LA BOMBA */}
        <g
          transform={`translate(55 196) scale(${muscle.toFixed(3)} ${muscleY.toFixed(
            3
          )}) translate(-55 -196)`}
        >
          <ellipse
            cx="55"
            cy="196"
            rx="23"
            ry="43"
            fill={`url(#${uid}-musc)`}
            opacity={(0.5 + 0.5 * pump) * draw}
          />
          <path
            d="M 41 162 C 34 182 34 210 44 232"
            fill="none"
            stroke={rim}
            strokeWidth={1.6 + 1.4 * pump}
            strokeLinecap="round"
            opacity={(0.4 + 0.6 * pump) * draw}
          />
        </g>
        {/* vena + burbujas de flujo, recortadas dentro de la pierna */}
        <path
          d={VEIN_D}
          fill="none"
          stroke={vein}
          strokeWidth="4.6"
          strokeLinecap="round"
          opacity={draw}
        />
        {bubbles}
      </g>

      {/* filo de luz arriba-izquierda: da volumen sin romper el plano */}
      <g fill="none" stroke={rim} strokeWidth="1.6" strokeLinecap="round" opacity={draw * 0.9}>
        <path d="M 51 22 C 50 70 49 112 47 142" />
        <path d="M 84 40 C 87 78 86 116 82 148" opacity="0.45" />
      </g>

      {/* contorno que se dibuja de arriba hacia abajo */}
      <path
        d={LEG_D}
        fill="none"
        stroke={rgba(top, 0.55)}
        strokeWidth="1.8"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - clamp01(draw))}
      />

      {/* articulaciones: cadera, rodilla, tobillo */}
      {[
        [68, 10],
        [63, 152],
        [64, 256],
      ].map(([jx, jy], i) => (
        <circle
          key={`j-${i}`}
          cx={jx}
          cy={jy}
          r={3.4}
          fill="none"
          stroke={rim}
          strokeWidth="1.5"
          opacity={interpolate(draw, [0.5, 1], [0, 0.75], CLAMP)}
        />
      ))}
    </svg>
  );
};

/* ==================== ZONA DE ONDAS (ruido + nervio) ===================== */

const NoiseWaves: React.FC<{
  uid: string;
  bars: {ph: number; sp: number; h: number}[];
  amp: number; // 0..1 ruido ambiente
  barColor: string; // hex
  frame: number;
  nerveAmp: number; // px
  nerveOpacity: number; // 0..1
  glow: number; // 0..1
  packet: number; // 0..1 intensidad del paquete viajero
  draw: number; // 0..1 aparición general
}> = ({uid, bars, amp, barColor, frame, nerveAmp, nerveOpacity, glow, packet, draw}) => {
  /* onda fina del nervio */
  const px = frac(frame * 0.0068) * (WAVE_W + 200) - 100;
  const N = 110;
  const pts: string[] = [];
  let dotY = WAVE_MID;
  for (let i = 0; i <= N; i++) {
    const x = (WAVE_W * i) / N;
    const ripple =
      0.56 * Math.sin(x * 0.085 + frame * 0.36) + 0.44 * Math.sin(x * 0.037 - frame * 0.19);
    const pk = packet > 0 ? Math.exp(-Math.pow((x - px) / 78, 2)) * packet : 0;
    const edge = Math.sin((i / N) * Math.PI);
    const y = WAVE_MID - ripple * nerveAmp * (0.42 + 0.58 * edge) * (1 + pk * 1.5);
    if (Math.abs(x - px) < WAVE_W / N) dotY = y;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const polyline = pts.join(' ');

  return (
    <svg
      width={WAVE_W}
      height={WAVE_H}
      viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={`${uid}-bar`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={rgba(barColor, 0.95)} />
          <stop offset="58%" stopColor={rgba(barColor, 0.6)} />
          <stop offset="100%" stopColor={rgba(barColor, 0.14)} />
        </linearGradient>
      </defs>

      {/* línea de base */}
      <rect
        x={0}
        y={WAVE_BASE}
        width={WAVE_W * clamp01(draw)}
        height={1.4}
        fill={rgba(INK, 0.16)}
      />

      {/* ---- NERVIO (detrás de las barras: de día queda tapado) ---- */}
      {glow > 0.01 ? (
        <polyline
          points={polyline}
          fill="none"
          stroke={rgba(NERVE, 0.3 * glow)}
          strokeWidth={16}
          strokeLinecap="round"
          style={{filter: `blur(${(7 * glow).toFixed(1)}px)`}}
        />
      ) : null}
      <polyline
        points={polyline}
        fill="none"
        stroke={NERVE}
        strokeWidth={1.5 + 2 * glow}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={nerveOpacity * draw}
      />
      {glow > 0.15 ? (
        <g opacity={glow}>
          <circle cx={px} cy={dotY} r={12} fill={rgba(NERVE, 0.22)} />
          <circle cx={px} cy={dotY} r={4.2} fill="#FFD9D2" />
        </g>
      ) : null}

      {/* ---- RUIDO AMBIENTE: barras que tapan ---- */}
      {bars.map((b, i) => {
        const pitch = WAVE_W / N_BARS;
        const w = pitch * 0.54;
        const x = i * pitch + (pitch - w) / 2;
        const wob = 0.34 + 0.66 * Math.abs(Math.sin(frame * b.sp + b.ph));
        const grow = clamp01(interpolate(draw, [i * 0.012, i * 0.012 + 0.4], [0, 1], CLAMP));
        const h = Math.max(1.5, BAR_MAX * b.h * wob * amp * grow);
        return (
          <rect
            key={`bar-${i}`}
            x={x}
            y={WAVE_BASE - h}
            width={w}
            height={h}
            rx={w / 2}
            fill={`url(#${uid}-bar)`}
          />
        );
      })}
    </svg>
  );
};

/* ================================ ESCENA ================================= */

export const FedNightPump: React.FC<{
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  title?: string;
  hot?: string[];
  dayLabel?: string;
  nightLabel?: string;
  daySub?: string;
  nightSub?: string;
  footer?: string;
}> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'cool',
  kicker = 'El segundo corazón',
  title = 'De día la bomba lo tapa. De noche, aparece.',
  hot = ['bomba', 'aparece.'],
  dayLabel = 'De día',
  nightLabel = 'De noche',
  daySub = 'Caminás: la pantorrilla bombea la sangre hacia arriba a cada paso, y el ruido de la casa tapa todo lo demás.',
  nightSub = 'Te acostás: se apaga la bomba, se apaga la tele, la casa queda en silencio.',
  footer = 'El hormigueo estuvo ahí todo el día. Recién ahora lo escuchás.',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const T = Math.max(48, totalF);
  const HOLD = Math.max(36, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const sec = (f: number) => at(f) / fps;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});
  const prog = frame / HOLD;

  /* ---- paleta ----------------------------------------------------------- */
  const dayTop = tint(accent, 1.06);
  const dayBot = tint(accent, 0.4);
  const nightTop = COOL_BLUE;
  const nightBot = tint(COOL_BLUE, 0.36);

  /* ---- barras del ruido (fase propia por barra) -------------------------- */
  const bars = React.useMemo(
    () =>
      new Array(N_BARS).fill(0).map((_, i) => ({
        ph: random(`fnp-bar-ph-${i}`) * Math.PI * 2,
        sp: 0.14 + random(`fnp-bar-sp-${i}`) * 0.26,
        h: 0.44 + random(`fnp-bar-h-${i}`) * 0.56,
      })),
    []
  );

  /* ---- DÍA: la bomba anda ------------------------------------------------ */
  const PERIOD = 26; // frames por paso
  const ph = (frame / PERIOD) * Math.PI * 2;
  const dayDraw = ip(0.1, 0.3);
  const dayOn = ip(0.16, 0.3);
  const dayPump = Math.pow(Math.max(0, Math.sin(ph - 0.6)), 1.4) * dayOn;
  const daySwing = Math.sin(ph) * 8.5 * dayOn;
  const dayBob = -Math.abs(Math.sin(ph)) * 5 * dayOn;
  const dayFlow = ip(0.2, 0.34);
  const dayBarsAmp = ip(0.24, 0.42);
  const dayDim = 1 - 0.32 * ip(0.62, 0.8);

  /* ---- NOCHE: la bomba se para con un ÚLTIMO latido ---------------------- */
  const nightDraw = ip(0.34, 0.48);
  const nightLie = ip(0.4, 0.56, EASE_MOVE);
  const beat = (t0: number, w: number) => Math.exp(-Math.pow((prog - t0) / w, 2));
  const nightPump =
    clamp01(0.82 * beat(0.455, 0.014) + 0.72 * beat(0.492, 0.014) + 1 * beat(0.545, 0.018)) *
    (1 - ip(0.6, 0.68));
  const nightFlow = nightPump * 0.95;
  const nightBarsAmp = ip(0.36, 0.5) * (1 - 0.955 * ip(0.58, 0.74));
  const nightOff = ip(0.58, 0.72); // chip "bomba apagada"

  /* ---- el nervio queda solo --------------------------------------------- */
  const reveal = ip(0.64, 0.84);
  const nervePulse = 0.78 + 0.22 * Math.sin(frame * 0.17);
  const nerveLabel = ip(0.74, 0.9);
  const splitP = ip(0.05, 0.26);
  const dayPanelP = ip(0, 0.14);
  const nightPanelP = ip(0.04, 0.2);
  const dayLabelP = ip(0.06, 0.18);
  const daySubP = ip(0.1, 0.24);
  const nightLabelP = ip(0.34, 0.46);
  const nightSubP = ip(0.38, 0.5);
  const footP = ip(0.8, 0.94);

  const DAY_CX = DAY_X + PANEL_W / 2;
  const NIGHT_CX = NIGHT_X + PANEL_W / 2;
  const dayLegLeft = DAY_CX - LEG_W / 2;
  const nightLegLeft = NIGHT_CX - LEG_W / 2;
  const footCx = dayLegLeft + 88 * (LEG_W / 140);

  const stageScale = width / STAGE_W;
  const wordStag = Math.min(0.2, (HOLD / fps) * 0.055);

  /* ------------------------- piezas repetidas ---------------------------- */

  const panel = (x: number, p: number, warm: boolean) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: PANEL_TOP,
        width: PANEL_W,
        height: PANEL_H,
        borderRadius: 26,
        border: `1px solid ${rgba(warm ? accent : COOL_BLUE, 0.13 + 0.07 * p)}`,
        background: warm
          ? [
              `radial-gradient(92% 62% at 50% 16%, ${rgba(accent, 0.14)} 0%, transparent 70%)`,
              `linear-gradient(180deg, ${rgba('#2E2210', 0.5)} 0%, ${rgba('#0A0806', 0.18)} 100%)`,
            ].join(', ')
          : [
              `radial-gradient(92% 62% at 50% 16%, ${rgba(COOL_BLUE, 0.11)} 0%, transparent 70%)`,
              `linear-gradient(180deg, ${rgba('#0C1A34', 0.58)} 0%, ${rgba('#03060E', 0.26)} 100%)`,
            ].join(', '),
        opacity: p,
        transform: `translateY(${((1 - p) * 22).toFixed(1)}px) scale(${(0.985 + 0.015 * p).toFixed(4)})`,
        boxShadow: `inset 0 1px 0 ${rgba(INK, 0.05)}`,
      }}
    />
  );

  const chip = (x: number, p: number, color: string, text: string, live: number) => (
    <div
      style={{
        position: 'absolute',
        left: x + PANEL_W - PAD - 300,
        top: PANEL_TOP + 34,
        width: 300,
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: p,
        transform: `translateY(${((1 - p) * -10).toFixed(1)}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          padding: '6px 14px',
          borderRadius: 999,
          background: rgba(color, 0.1),
          border: `1px solid ${rgba(color, 0.34)}`,
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 2.4,
          textTransform: 'uppercase',
          color: rgba(color, 0.92),
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            opacity: 0.35 + 0.65 * live,
            boxShadow: `0 0 ${(10 * live).toFixed(1)}px ${rgba(color, 0.8 * live)}`,
          }}
        />
        {text}
      </span>
    </div>
  );

  const heading = (x: number, label: string, sub: string, lp: number, sp: number, color: string) => (
    <>
      <div
        style={{
          position: 'absolute',
          left: x + PAD,
          top: PANEL_TOP + 14,
          width: PANEL_W - PAD * 2 - 300,
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: '-0.015em',
          color: INK,
          opacity: lp,
          transform: `translateY(${((1 - lp) * 16).toFixed(1)}px)`,
          textShadow: `0 6px 26px ${rgba('#000000', 0.6)}`,
        }}
      >
        {label}
        <span
          style={{
            display: 'block',
            marginTop: 10,
            width: 74 * lp,
            height: 3,
            borderRadius: 2,
            background: color,
            boxShadow: `0 0 14px ${rgba(color, 0.6)}`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: x + PAD,
          top: PANEL_TOP + 92,
          width: PANEL_W - PAD * 2,
          fontFamily: FONT_SERIF,
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.36,
          color: rgba(INK, 0.66),
          opacity: sp,
          transform: `translateY(${((1 - sp) * 12).toFixed(1)}px)`,
        }}
      >
        {sub}
      </div>
    </>
  );

  const waveLabel = (x: number, text: string, p: number, color: string) => (
    <div
      style={{
        position: 'absolute',
        left: x + PAD,
        top: WAVE_Y - 34,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        opacity: p,
        fontFamily: FONT_SANS,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: rgba(color, 0.8),
      }}
    >
      <span style={{width: 16, height: 2, background: rgba(color, 0.7)}} />
      {text}
    </div>
  );

  /* ============================== RENDER ================================= */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <Stage mood={mood} accent={accent} seed="fed-night-pump" sprigs={false} pushTo={1.03} panDir={-1}>
        {(cam) => (
          <AbsoluteFill style={{zIndex: 3}}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: STAGE_W,
                height: STAGE_H,
                marginLeft: -STAGE_W / 2,
                marginTop: -STAGE_H / 2,
                transform: `scale(${stageScale.toFixed(5)}) translate(${(cam.px * 0.55).toFixed(
                  2
                )}px, ${(cam.py * 0.55).toFixed(2)}px)`,
                transformOrigin: '50% 50%',
                willChange: 'transform',
              }}
            >
              {/* ============ L2 · CABECERA ============ */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <Kicker text={kicker} accent={accent} startSec={sec(0.01)} />
                <div style={{width: 1500, textAlign: 'center'}}>
                  <Words
                    text={title}
                    hot={hot}
                    accent={accent}
                    startSec={sec(0.04)}
                    size={50}
                    weight={800}
                    maxStagger={wordStag}
                  />
                </div>
              </div>

              {/* ============ L1 · PANELES + SEPARADOR ============ */}
              <div style={{opacity: dayDim}}>{panel(DAY_X, dayPanelP, true)}</div>
              {panel(NIGHT_X, nightPanelP, false)}

              <div
                style={{
                  position: 'absolute',
                  left: SPLIT_X - 1,
                  top: PANEL_TOP + PANEL_H / 2,
                  width: 2,
                  height: PANEL_H * splitP,
                  marginTop: (-PANEL_H * splitP) / 2,
                  background: `linear-gradient(to bottom, ${rgba(INK, 0)} 0%, ${rgba(
                    accent,
                    0.42
                  )} 46%, ${rgba(COOL_BLUE, 0.42)} 54%, ${rgba(INK, 0)} 100%)`,
                  boxShadow: `0 0 18px ${rgba(accent, 0.2 * splitP)}`,
                }}
              />

              {/* ================== PANEL DÍA ================== */}
              <div style={{opacity: dayDim}}>
                {heading(DAY_X, dayLabel, daySub, dayLabelP, daySubP, accent)}
                {chip(DAY_X, dayOn, accent, 'Bomba encendida', dayPump)}

                {/* L4 · piso + sombra del pie */}
                <div
                  style={{
                    position: 'absolute',
                    left: DAY_CX - 320 * dayDraw,
                    top: GROUND_Y,
                    width: 640 * dayDraw,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${rgba(accent, 0.34)} 22%, ${rgba(
                      accent,
                      0.34
                    )} 78%, transparent)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: footCx - 84,
                    top: GROUND_Y - 8,
                    width: 168,
                    height: 20,
                    borderRadius: '50%',
                    background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                      '#000000',
                      0.62
                    )} 0%, transparent 74%)`,
                    filter: 'blur(6px)',
                    opacity: dayDraw * (0.85 - 0.3 * dayPump),
                  }}
                />

                {/* L5 · pierna caminando */}
                <div
                  style={{
                    position: 'absolute',
                    left: dayLegLeft,
                    top: LEG_TOP + dayBob,
                    width: LEG_W,
                    height: LEG_H,
                    transform: `rotate(${daySwing.toFixed(2)}deg)`,
                    transformOrigin: '49% 3%',
                    willChange: 'transform',
                  }}
                >
                  <LegFigure
                    uid="fnp-day"
                    top={dayTop}
                    bot={dayBot}
                    rim={rgba('#FFF6E2', 0.5)}
                    vein={rgba(accent, 0.26)}
                    flowColor={accent}
                    pump={dayPump}
                    flow={dayFlow}
                    cycle={frame / PERIOD}
                    draw={dayDraw}
                  />
                </div>

                {/* L6 · ruido alto que TAPA el nervio */}
                {waveLabel(DAY_X, 'Ruido de la casa', dayBarsAmp, accent)}
                <div style={{position: 'absolute', left: DAY_X + PAD, top: WAVE_Y}}>
                  <NoiseWaves
                    uid="fnp-day-w"
                    bars={bars}
                    amp={dayBarsAmp}
                    barColor={mixHex(accent, '#FFFFFF', 0.12)}
                    frame={frame}
                    nerveAmp={9}
                    nerveOpacity={0.26 * ip(0.28, 0.4)}
                    glow={0}
                    packet={0}
                    draw={dayBarsAmp}
                  />
                </div>
              </div>

              {/* ================== PANEL NOCHE ================== */}
              {heading(NIGHT_X, nightLabel, nightSub, nightLabelP, nightSubP, COOL_BLUE)}
              {chip(NIGHT_X, nightOff, COOL_BLUE, 'Bomba apagada', 1 - nightOff)}

              {/* L4 · cama */}
              <div
                style={{
                  position: 'absolute',
                  left: NIGHT_CX - 300,
                  top: BED_Y,
                  width: 600,
                  height: 20,
                  borderRadius: 10,
                  background: `linear-gradient(180deg, ${rgba(COOL_BLUE, 0.22)} 0%, ${rgba(
                    '#0A1830',
                    0.1
                  )} 100%)`,
                  border: `1px solid ${rgba(COOL_BLUE, 0.2)}`,
                  opacity: nightLie,
                  transform: `scaleX(${(0.7 + 0.3 * nightLie).toFixed(3)})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: NIGHT_CX - 220,
                  top: BED_Y - 10,
                  width: 440,
                  height: 22,
                  borderRadius: '50%',
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba('#000000', 0.6)} 0%, transparent 74%)`,
                  filter: 'blur(7px)',
                  opacity: nightLie * 0.9,
                }}
              />

              {/* L5 · la misma pierna, que se acuesta */}
              <div
                style={{
                  position: 'absolute',
                  left: nightLegLeft,
                  top: LEG_TOP,
                  width: LEG_W,
                  height: LEG_H,
                  transform: `rotate(${(78 * nightLie).toFixed(2)}deg)`,
                  transformOrigin: '50% 50%',
                  willChange: 'transform',
                }}
              >
                <LegFigure
                  uid="fnp-night"
                  top={nightTop}
                  bot={nightBot}
                  rim={rgba('#DCEBFF', 0.42)}
                  vein={rgba(COOL_BLUE, 0.2 + 0.16 * nightPump)}
                  flowColor={mixHex(COOL_BLUE, '#FFFFFF', 0.2)}
                  pump={nightPump}
                  flow={nightFlow}
                  cycle={frame / PERIOD}
                  draw={nightDraw}
                />
              </div>

              {/* L6 · el ruido CAE y el nervio queda solo */}
              {/* los dos rótulos se cruzan: el ruido se apaga y entra el silencio */}
              {waveLabel(NIGHT_X, 'Ruido de la casa', ip(0.38, 0.5) * (1 - ip(0.58, 0.66)), COOL_BLUE)}
              {waveLabel(NIGHT_X, 'Silencio', ip(0.67, 0.78), COOL_BLUE)}
              <div style={{position: 'absolute', left: NIGHT_X + PAD, top: WAVE_Y}}>
                <NoiseWaves
                  uid="fnp-night-w"
                  bars={bars}
                  amp={nightBarsAmp}
                  barColor={mixHex(COOL_BLUE, '#FFFFFF', 0.1)}
                  frame={frame + 41}
                  nerveAmp={9 + 20 * reveal}
                  nerveOpacity={0.26 + 0.72 * reveal * nervePulse}
                  glow={reveal * nervePulse}
                  packet={reveal}
                  draw={Math.max(ip(0.36, 0.5), reveal)}
                />
              </div>

              {/* L7 · rótulo del nervio con línea guía */}
              <div
                style={{
                  position: 'absolute',
                  left: NIGHT_X + PAD + 8,
                  top: WAVE_Y + 34,
                  opacity: nerveLabel,
                  transform: `translateY(${((1 - nerveLabel) * -10).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: 3.2,
                    textTransform: 'uppercase',
                    color: NERVE,
                    textShadow: `0 0 22px ${rgba(NERVE, 0.55 * nervePulse)}`,
                  }}
                >
                  El nervio
                </div>
                <div
                  style={{
                    width: 1.6,
                    height: 46 * nerveLabel,
                    marginLeft: 12,
                    marginTop: 6,
                    background: `linear-gradient(to bottom, ${rgba(NERVE, 0.75)}, ${rgba(NERVE, 0)})`,
                  }}
                />
              </div>

              {/* ============ L8 · PIE DE ESCENA ============ */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 942,
                  textAlign: 'center',
                  opacity: footP,
                  transform: `translateY(${((1 - footP) * 12).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    width: 120 * footP,
                    height: 2,
                    margin: '0 auto 14px',
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${rgba(accent, 0)}, ${accent}, ${rgba(
                      accent,
                      0
                    )})`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontSize: 27,
                    color: rgba(INK, 0.72),
                    textShadow: `0 4px 20px ${rgba('#000000', 0.7)}`,
                  }}
                >
                  {footer}
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}
      </Stage>
      <div style={{position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none'}}>
        <GrainOverlay />
      </div>
    </TransitionShell>
  );
};

export default FedNightPump;
