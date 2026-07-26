/* ############################################################################
 * FED_TWO_PATHS — "LA BIFURCACIÓN" · una pregunta parte el diagnóstico en dos
 *
 *   Dark-cinematic del kit. Una sola pregunta arriba; de ella nace un NODO
 *   luminoso y del nodo salen DOS caminos curvos que se dibujan hacia abajo,
 *   cada uno con un pulso de luz que viaja hasta su tarjeta.
 *
 *   GUION VISUAL (todo en fracciones del hold = totalF - FED_WHIP_F):
 *     1. kicker fino arriba
 *     2. la PREGUNTA entra palabra por palabra (Words del kit)
 *     3. la pregunta "cae" en un NODO: halo + anillos que respiran
 *     4. se dibujan los dos RIELES curvos (SVG, cúbicas, nunca rectas),
 *        izquierda primero, derecha unos frames después
 *     5. por cada riel viaja un PULSO (dash corto + cabeza luminosa calculada
 *        sobre la propia cúbica) que aterriza en el ancla de la tarjeta
 *     6. las TARJETAS entran ALTERNADAS: primero la izquierda, después la
 *        derecha; al entrar la segunda, la primera baja opacidad y escala
 *        (el ojo va donde toca) y recién al final vuelven a emparejarse
 *     7. footer: hairline + una línea fina centrada que cierra
 *
 *   CAPAS
 *     L0  fondo moodBg + resplandor propio del nodo
 *     L1  motas (profundidad)
 *     L2  SVG: rieles fantasma, rieles dibujados, pulsos, nodo
 *     L3  tarjetas (HTML) + anclas
 *     L4  cabecera (kicker + pregunta) y footer
 *     L5  viñeta + grano
 *
 *   Escala: probado a totalF=110 (3.7s) y totalF=260 (8.7s).
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
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
  Words,
  makeMotes,
  moodBg,
  rgba,
  shade,
  type FedMood,
  type FedTransitionVariant,
} from '../../FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedTwoPathsBranch = {
  answer: string;
  verdict: string;
  sub?: string;
  tone?: 'cool' | 'warm';
};

export type FedTwoPathsProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  question?: string;
  left?: FedTwoPathsBranch;
  right?: FedTwoPathsBranch;
  footer?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;
const CX = STAGE_W / 2;

const KICKER_Y = 86;
const Q_TOP = 150;

const NODE_X = CX;
const NODE_Y = 372;

const CARD_W = 680;
const CARD_H = 286;
const CARD_TOP = 640;
const CARD_L_X = 140;
const CARD_R_X = STAGE_W - CARD_L_X - CARD_W; // 1100

const FOOT_Y = 992;

type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];

/** cúbicas espejadas: bajan del nodo, se abren y vuelven a bajar */
const CURVE_L: Cubic = [
  [NODE_X, NODE_Y + 6],
  [NODE_X, NODE_Y + 118],
  [CARD_L_X + CARD_W / 2 + 128, NODE_Y + 110],
  [CARD_L_X + CARD_W / 2, CARD_TOP - 16],
];
const CURVE_R: Cubic = [
  [NODE_X, NODE_Y + 6],
  [NODE_X, NODE_Y + 118],
  [CARD_R_X + CARD_W / 2 - 128, NODE_Y + 110],
  [CARD_R_X + CARD_W / 2, CARD_TOP - 16],
];

const dOf = (c: Cubic): string =>
  `M ${c[0][0]} ${c[0][1]} C ${c[1][0]} ${c[1][1]}, ${c[2][0]} ${c[2][1]}, ${c[3][0]} ${c[3][1]}`;

/** punto sobre la cúbica: la cabeza del pulso va EXACTO sobre el riel */
const bez = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [
    a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0],
    a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1],
  ];
};

const EASE_SOFT = Easing.out(Easing.cubic);
const EASE_DRAW = Easing.bezier(0.32, 0.86, 0.18, 1);
const EASE_LAND = Easing.bezier(0.2, 0.92, 0.16, 1);

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

/** aclara/oscurece devolviendo HEX (shade() del kit devuelve rgb(), no sirve para rgba()) */
const lift = (hex: string, f: number): string => {
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

/* ================================ COMPONENTE ============================== */

export const FedTwoPaths: React.FC<FedTwoPathsProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  kicker = 'Una pregunta parte el diagnóstico',
  question = '¿Cuándo te alivia?',
  left = {
    answer: 'Mejora apenas me muevo',
    verdict: 'Nervio',
    sub: 'Raíz irritada · compresión',
    tone: 'cool',
  },
  right = {
    answer: 'Empeora al caminar, calma al parar',
    verdict: 'Circulación',
    sub: 'Riego arterial insuficiente',
    tone: 'warm',
  },
  footer = 'El mismo hormigueo, dos caminos distintos',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const T = Math.max(60, totalF);
  const HOLD = Math.max(40, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});

  /* ---- paleta por rama --------------------------------------------------- */
  const hueOf = (t?: 'cool' | 'warm') => (t === 'warm' ? accent : COOL_BLUE);
  const hueL = hueOf(left.tone ?? 'cool');
  const hueR = hueOf(right.tone ?? 'warm');
  const nodeHue = mixHex(hueL, hueR, 0.5);

  /* ---- ventanas de tiempo (fracciones del hold) -------------------------- */
  const kickP = ip(0.01, 0.12);
  const nodeP = ip(0.17, 0.29, EASE_LAND);
  const drawL = ip(0.26, 0.47, EASE_DRAW);
  const drawR = ip(0.32, 0.53, EASE_DRAW);
  const pulseL = ip(0.34, 0.5, Easing.bezier(0.4, 0.02, 0.3, 1));
  const pulseR = ip(0.52, 0.68, Easing.bezier(0.4, 0.02, 0.3, 1));
  const cardL = ip(0.44, 0.6, EASE_LAND);
  const cardR = ip(0.62, 0.78, EASE_LAND);
  const footP = ip(0.82, 0.94);

  /* la pregunta: palabra por palabra, ritmo atado al hold */
  const qStartSec = at(0.04) / fps;
  const qWords = Math.max(1, question.trim().split(/\s+/).length);
  const qStagger = Math.min(0.19, Math.max(0.07, (HOLD * 0.03) / fps));
  const qSize = question.length > 34 ? 46 : question.length > 22 ? 54 : 64;
  const qDoneSec = qStartSec + qWords * qStagger;

  /* ---- cámara ------------------------------------------------------------ */
  const push = interpolate(frame, [0, T], [1.006, 1.032], CLAMP);
  const camX = Math.sin(frame * 0.0132) * 4.2;
  const camY = Math.cos(frame * 0.0176) * 3.2;
  const stageScale = (width / STAGE_W) * push;

  const motes = React.useMemo(
    () => makeMotes(16, 'fedtwopaths-motes', 2, 6, 0.03, 0.085, 0.1, 0.3),
    []
  );
  const moteTint = mood === 'gold' || mood === 'warmdark' ? '240, 208, 150' : '190, 214, 250';

  /* ---- pulso: cabeza sobre la propia cúbica ------------------------------ */
  const SEG = 0.085;
  const renderPulse = (curve: Cubic, hue: string, p: number, key: string) => {
    if (p <= 0.001 || p >= 0.999) return null;
    const shift = interpolate(p, [0, 1], [-SEG, 1], CLAMP);
    const glow = Math.sin(clamp01(p) * Math.PI) ** 0.55;
    const head = bez(curve, clamp01(p));
    return (
      <g key={key} opacity={glow}>
        <path
          d={dOf(curve)}
          pathLength={1}
          fill="none"
          stroke={lift(hue, 1.25)}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${SEG} ${1 - SEG}`}
          strokeDashoffset={-shift}
          filter="url(#fedtwopaths-glow)"
        />
        <circle cx={head[0]} cy={head[1]} r={7.5} fill={rgba('#FFFFFF', 0.92)} />
        <circle
          cx={head[0]}
          cy={head[1]}
          r={17}
          fill={rgba(hue, 0.34)}
          filter="url(#fedtwopaths-glow)"
        />
      </g>
    );
  };

  /* ---- riel: fantasma + trazo que se dibuja ------------------------------ */
  const renderRail = (curve: Cubic, hue: string, p: number, gradId: string, key: string) => (
    <g key={key}>
      <path
        d={dOf(curve)}
        fill="none"
        stroke={rgba(hue, 0.1 * nodeP)}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="7 11"
      />
      <path
        d={dOf(curve)}
        pathLength={1}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={1 - p}
      />
      <path
        d={dOf(curve)}
        pathLength={1}
        fill="none"
        stroke={rgba(hue, 0.3)}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        filter="url(#fedtwopaths-glow)"
      />
      {/* ancla: se enciende cuando el trazo llega */}
      <circle
        cx={curve[3][0]}
        cy={curve[3][1]}
        r={5 + 2 * interpolate(p, [0.86, 1], [0, 1], CLAMP)}
        fill={lift(hue, 1.2)}
        opacity={interpolate(p, [0.8, 1], [0, 1], CLAMP)}
      />
    </g>
  );

  /* ---- tarjeta ----------------------------------------------------------- */
  const renderCard = (
    b: FedTwoPathsBranch,
    hue: string,
    x: number,
    p: number,
    dim: number,
    key: string
  ) => {
    if (p <= 0.001) return null;
    const y = (1 - p) * 34;
    const blur = (1 - p) * 9;
    const rowP = clamp01((p - 0.28) / 0.72);
    const vSize =
      b.verdict.length > 13 ? 52 : b.verdict.length > 9 ? 64 : b.verdict.length > 6 ? 74 : 82;
    const ink = lift(hue, 1.18);

    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          left: x,
          top: CARD_TOP,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 24,
          overflow: 'hidden',
          background: [
            `linear-gradient(168deg, ${rgba(hue, 0.16)} 0%, ${rgba(hue, 0.03)} 46%, ${rgba(
              '#02040A',
              0.62
            )} 100%)`,
            shade(mixHex(hue, '#0A0F19', 0.9), 0.9),
          ].join(', '),
          border: `1px solid ${rgba(hue, 0.34)}`,
          boxShadow: [
            `0 28px 70px ${rgba('#000000', 0.55)}`,
            `0 0 ${(46 * p).toFixed(0)}px ${rgba(hue, 0.22 * p)}`,
            `inset 0 1px 0 ${rgba('#FFFFFF', 0.07)}`,
          ].join(', '),
          opacity: p * dim,
          filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
          transform: `translateY(${y.toFixed(1)}px) scale(${(
            0.955 +
            0.045 * p -
            0.02 * (1 - dim)
          ).toFixed(4)})`,
          transformOrigin: '50% 0%',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* barra superior del color de la rama */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 3,
            width: '100%',
            background: `linear-gradient(90deg, ${rgba(hue, 0)}, ${ink} 26%, ${ink} 74%, ${rgba(
              hue,
              0
            )})`,
            transform: `scaleX(${p.toFixed(3)})`,
            opacity: 0.9,
          }}
        />
        {/* barrido de luz al aterrizar */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            bottom: '-30%',
            left: 0,
            width: '46%',
            transform: `translateX(${interpolate(p, [0.1, 1], [-80, 250], CLAMP).toFixed(
              0
            )}%) skewX(-16deg)`,
            background: `linear-gradient(100deg, transparent 18%, ${rgba(hue, 0.2)} 50%, transparent 82%)`,
            mixBlendMode: 'screen',
            opacity: Math.sin(clamp01(p) * Math.PI) * 0.9,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '30px 36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* respuesta del paciente: serif itálica, la voz */}
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: b.answer.length > 42 ? 27 : 31,
              lineHeight: 1.28,
              color: rgba('#E4ECFA', 0.84),
              textShadow: '0 3px 16px rgba(0,0,0,0.6)',
              opacity: rowP,
              transform: `translateY(${((1 - rowP) * 8).toFixed(1)}px)`,
            }}
          >
            {b.answer}
          </div>

          <div>
            {/* hairline */}
            <div
              style={{
                height: 1,
                width: '100%',
                marginBottom: 16,
                background: `linear-gradient(90deg, ${rgba(hue, 0.5)}, ${rgba(hue, 0.06)})`,
                transform: `scaleX(${rowP.toFixed(3)})`,
                transformOrigin: '0% 50%',
              }}
            />
            {/* veredicto */}
            <div
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: vSize,
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: ink,
                textShadow: `0 0 30px ${rgba(hue, 0.45 * p)}, 0 5px 22px rgba(0,0,0,0.65)`,
                opacity: rowP,
                transform: `translateY(${((1 - rowP) * 14).toFixed(1)}px)`,
              }}
            >
              {b.verdict}
            </div>
            {b.sub ? (
              <div
                style={{
                  marginTop: 12,
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 2.4,
                  textTransform: 'uppercase',
                  color: rgba('#C9D6EA', 0.5),
                  opacity: interpolate(p, [0.5, 1], [0, 1], CLAMP),
                }}
              >
                {b.sub}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  /* al entrar la SEGUNDA, la PRIMERA baja; al final se emparejan un poco */
  const dimL = 1 - 0.4 * cardR * (1 - 0.55 * footP);
  const dimR = 1;

  /* ============================== RENDER ================================= */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
        {/* =============== L0 · fondo dark-cinematic del kit =============== */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        {/* resplandor propio del nodo */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(38% 34% at 50% ${(
              (NODE_Y / STAGE_H) * 100
            ).toFixed(1)}%, ${rgba(nodeHue, 0.2 * nodeP)} 0%, transparent 68%)`,
          }}
        />
        {/* halos de cada rama, abajo */}
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(30% 26% at 25% 74%, ${rgba(hueL, 0.16 * cardL)} 0%, transparent 70%)`,
              `radial-gradient(30% 26% at 75% 74%, ${rgba(hueR, 0.16 * cardR)} 0%, transparent 70%)`,
            ].join(', '),
          }}
        />

        {/* =============== L1 · motas =============== */}
        <MotesLayer motes={motes} blur={1.4} scale={1} tint={moteTint} />

        {/* ============ ESCENARIO 1920x1080 con cámara mínima ============ */}
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
            {/* =========== L2 · SVG: rieles + pulsos + nodo =========== */}
            <svg
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
            >
              <defs>
                <filter id="fedtwopaths-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
                <linearGradient
                  id="fedtwopaths-grad-l"
                  gradientUnits="userSpaceOnUse"
                  x1={CURVE_L[0][0]}
                  y1={CURVE_L[0][1]}
                  x2={CURVE_L[3][0]}
                  y2={CURVE_L[3][1]}
                >
                  <stop offset="0%" stopColor={rgba(nodeHue, 0.95)} />
                  <stop offset="100%" stopColor={lift(hueL, 1.16)} />
                </linearGradient>
                <linearGradient
                  id="fedtwopaths-grad-r"
                  gradientUnits="userSpaceOnUse"
                  x1={CURVE_R[0][0]}
                  y1={CURVE_R[0][1]}
                  x2={CURVE_R[3][0]}
                  y2={CURVE_R[3][1]}
                >
                  <stop offset="0%" stopColor={rgba(nodeHue, 0.95)} />
                  <stop offset="100%" stopColor={lift(hueR, 1.16)} />
                </linearGradient>
                <radialGradient id="fedtwopaths-node-halo">
                  <stop offset="0%" stopColor={rgba('#FFFFFF', 0.9)} />
                  <stop offset="34%" stopColor={rgba(nodeHue, 0.55)} />
                  <stop offset="100%" stopColor={rgba(nodeHue, 0)} />
                </radialGradient>
              </defs>

              {renderRail(CURVE_L, hueL, drawL, 'fedtwopaths-grad-l', 'rail-l')}
              {renderRail(CURVE_R, hueR, drawR, 'fedtwopaths-grad-r', 'rail-r')}
              {renderPulse(CURVE_L, hueL, pulseL, 'pulse-l')}
              {renderPulse(CURVE_R, hueR, pulseR, 'pulse-r')}

              {/* ---- NODO: halo + anillos + núcleo ---- */}
              <g
                opacity={nodeP}
                transform={`translate(${NODE_X} ${NODE_Y}) scale(${(
                  0.6 +
                  0.4 * nodeP
                ).toFixed(4)})`}
              >
                <circle r={62} fill="url(#fedtwopaths-node-halo)" opacity={0.55} />
                {[0, 1].map((k) => {
                  const t = ((frame * 0.011 + k * 0.5) % 1 + 1) % 1;
                  return (
                    <circle
                      key={`ring-${k}`}
                      r={14 + t * 52}
                      fill="none"
                      stroke={rgba(nodeHue, (1 - t) * 0.4)}
                      strokeWidth={1.6}
                    />
                  );
                })}
                <circle
                  r={13 + Math.sin(frame * 0.06) * 0.8}
                  fill="none"
                  stroke={rgba(nodeHue, 0.75)}
                  strokeWidth={2}
                />
                <circle r={6.5} fill="#FFFFFF" filter="url(#fedtwopaths-glow)" />
                <circle r={4.6} fill="#FFFFFF" />
              </g>

              {/* bajada corta desde la pregunta hasta el nodo */}
              <line
                x1={NODE_X}
                y1={Q_TOP + 118}
                x2={NODE_X}
                y2={NODE_Y - 26}
                stroke={rgba(nodeHue, 0.32 * nodeP)}
                strokeWidth={1.4}
                strokeDasharray="5 8"
              />
            </svg>

            {/* =========== L3 · TARJETAS =========== */}
            {renderCard(left, hueL, CARD_L_X, cardL, dimL, 'card-l')}
            {renderCard(right, hueR, CARD_R_X, cardR, dimR, 'card-r')}

            {/* =========== L4 · cabecera =========== */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: KICKER_Y,
                display: 'flex',
                justifyContent: 'center',
                opacity: kickP,
                transform: `translateY(${((1 - kickP) * -10).toFixed(1)}px)`,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: 4.6,
                  textTransform: 'uppercase',
                  color: rgba(accent, 0.9),
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: 34 * kickP,
                    height: 2,
                    background: `linear-gradient(to left, ${accent}, transparent)`,
                  }}
                />
                {kicker}
                <span
                  style={{
                    width: 34 * kickP,
                    height: 2,
                    background: `linear-gradient(to right, ${accent}, transparent)`,
                  }}
                />
              </span>
            </div>

            {/* la PREGUNTA, palabra por palabra */}
            <div
              style={{
                position: 'absolute',
                left: 160,
                right: 160,
                top: Q_TOP,
                textAlign: 'center',
              }}
            >
              <Words
                text={question}
                accent={accent}
                startSec={qStartSec}
                staggerSec={qStagger}
                size={qSize}
                weight={800}
                uppercase
                color="#EEF3FF"
              />
            </div>
            {/* subrayado que se abre bajo la pregunta, ya terminada de escribir */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: Q_TOP + 104,
                width: 260 * nodeP,
                marginLeft: -130 * nodeP,
                height: 2,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${rgba(nodeHue, 0)}, ${rgba(
                  nodeHue,
                  0.75
                )} 50%, ${rgba(nodeHue, 0)})`,
                opacity: interpolate(
                  frame,
                  [Math.round(qDoneSec * fps), Math.round(qDoneSec * fps) + 8],
                  [0, 1],
                  CLAMP
                ),
              }}
            />

            {/* =========== L4 · FOOTER =========== */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: FOOT_Y,
                textAlign: 'center',
                opacity: footP,
                transform: `translateY(${((1 - footP) * 10).toFixed(1)}px)`,
              }}
            >
              <div
                style={{
                  height: 1,
                  width: 620 * footP,
                  margin: '0 auto 16px',
                  background: `linear-gradient(90deg, transparent, ${rgba(
                    TEAL,
                    0.32
                  )} 50%, transparent)`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: 21,
                  letterSpacing: 3.2,
                  textTransform: 'uppercase',
                  color: rgba('#D6E2F4', 0.56),
                  textShadow: '0 2px 14px rgba(0,0,0,0.6)',
                }}
              >
                {footer}
              </span>
            </div>
          </div>
        </AbsoluteFill>

        {/* =============== L5 · viñeta + grano =============== */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              'radial-gradient(122% 100% at 50% 44%, transparent 48%, rgba(1, 3, 9, 0.62) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.34), transparent 16%, transparent 84%, rgba(2,4,10,0.46))',
            ].join(', '),
          }}
        />
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

export default FedTwoPaths;
