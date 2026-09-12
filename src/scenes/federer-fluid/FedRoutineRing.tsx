/* ############################################################################
 * FED_ROUTINERING — anillo de progreso circular con 5 estaciones ("La rutina")
 *   Variante del kit dark-cinematic "Dr. Federer" (NO es un kit aparte).
 *   Multicapa, estilo After Effects:
 *     L0 fondo por mood + wash + viñeta (push-in + handheld)
 *     L1 bokeh grande fuera de foco
 *     L2 polvo en suspensión
 *     L3 ticks de instrumento alrededor del anillo (contra-rotan)
 *     L4 anillo base + anillo de progreso con gradiente y glow (dashoffset)
 *     L5 los N nodos con su ícono SVG procedural y sus 3 estados
 *     L6 satélite luminoso con estela que aterriza en el nodo activo
 *     L7 número fantasma + contenido central (número, título, bajada)
 *     L8 tira inferior con los N títulos en small-caps
 *     L9 barrido de luz del TransitionShell + GrainOverlay
 *   El satélite es el RELOJ MAESTRO: cada nodo se enciende cuando el satélite
 *   cruza su ángulo, así el dibujo del arco, el tilde y el pulso del activo
 *   quedan sincronizados sin timings sueltos.
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CLAMP,
  FONT_SANS,
  FONT_SERIF,
  DEFAULT_ACCENT,
  TEAL,
  rgba,
  shade,
  makeMotes,
  MotesLayer,
  GrainOverlay,
  TransitionShell,
  moodBg,
  FED_SCENE_F,
  FED_WHIP_F,
  type FedMood,

  type FedTransitionVariant,
} from '../../FedererKit';

export type FedRoutineRingProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'gold'
  step?: number; // 1..5, cuál está activo
  steps?: {title: string; sub?: string}[]; // los 5 pasos
  kicker?: string; // 'Esta noche'
};

/* --------------------------------- geometría ------------------------------ */

const CX = 960;
const CY = 506;
const R = 336; // radio del anillo
const NODE_R = 40; // radio del disco de cada nodo
const SAT_START = -58; // el satélite entra desde antes de la estación 1

const ID = 'frr'; // prefijo de ids de <defs>

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return {x: CX + r * Math.cos(a), y: CY + r * Math.sin(a)};
};

const DEFAULT_STEPS: {title: string; sub?: string}[] = [
  {
    title: 'Agua tibia, nunca caliente',
    sub: 'El agua caliente disuelve el cemento de grasa que sostiene la piel.',
  },
  {
    title: 'No se seque del todo',
    sub: 'Deje la piel apenas húmeda al salir. La toalla sólo pasa por encima.',
  },
  {
    title: 'La crema o el gel, ahora',
    sub: 'Si tiene glicerina, ácido hialurónico o urea, va sobre la piel húmeda.',
  },
  {
    title: 'Recién ahora el aceite',
    sub: 'De 3 a 5 gotas para toda la cara, presionando, nunca frotando.',
  },
  {
    title: 'Cuatro semanas',
    sub: 'Ese es el plazo real. Antes de eso, nadie puede juzgar el resultado.',
  },
];

/* ------------------------- íconos SVG procedurales ------------------------- */
/* Todos viven en una caja 44x44 y se dibujan con pathLength=1 + dashoffset.   */

const ICONS: {d: string; circles?: {cx: number; cy: number; r: number}[]}[] = [
  // 1 · gota de agua + termómetro
  {
    d:
      'M17 9 C17 9 26 19.5 26 25.5 A9 9 0 0 1 8 25.5 C8 19.5 17 9 17 9 Z ' +
      'M35 11 L35 27 M38 15 H41.5 M38 20 H41.5',
    circles: [{cx: 35, cy: 31, r: 4}],
  },
  // 2 · toalla + la gota que queda en la piel
  {
    d:
      'M9 13 H29 A3 3 0 0 1 32 16 V33 A3 3 0 0 1 29 36 H9 A3 3 0 0 1 6 33 V16 A3 3 0 0 1 9 13 Z ' +
      'M6 20.5 H32 M11.5 13 V36 ' +
      'M37 20 C37 20 41 24.8 41 27.4 A4 4 0 0 1 33 27.4 C33 24.8 37 20 37 20 Z',
  },
  // 3 · frasco con gotero
  {
    d:
      'M17 9 H27 V13 H17 Z M19 13 V16 M25 13 V16 ' +
      'M13 16 H31 A4 4 0 0 1 35 20 V34 A4 4 0 0 1 31 38 H13 A4 4 0 0 1 9 34 V20 A4 4 0 0 1 13 16 Z ' +
      'M9 27 H35',
    circles: [{cx: 22, cy: 5, r: 3.4}],
  },
  // 4 · gota de aceite entre dos palmas
  {
    d:
      'M15 12 C7 17 6 28 14 35 M14 35 L11.5 39 ' +
      'M29 12 C37 17 38 28 30 35 M30 35 L32.5 39 ' +
      'M22 14 C22 14 28 22 28 26.2 A6 6 0 0 1 16 26.2 C16 22 22 14 22 14 Z',
  },
  // 5 · calendario con luna
  {
    d:
      'M15 6 V12 M29 6 V12 ' +
      'M11 9 H33 A3 3 0 0 1 36 12 V35 A3 3 0 0 1 33 38 H11 A3 3 0 0 1 8 35 V12 A3 3 0 0 1 11 9 Z ' +
      'M8 18 H36 ' +
      'M24 21 A7.2 7.2 0 1 0 24 35 A14 14 0 0 1 24 21 Z',
  },
];

const StepIcon: React.FC<{i: number; color: string; draw: number; w: number}> = ({
  i,
  color,
  draw,
  w,
}) => {
  const ic = ICONS[i % ICONS.length];
  const common = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth: w,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
  };
  return (
    <g transform="translate(-22,-22)">
      <path d={ic.d} {...common} />
      {(ic.circles ?? []).map((c, k) => (
        <circle key={k} cx={c.cx} cy={c.cy} r={c.r} {...common} />
      ))}
    </g>
  );
};

/* ------------------------------- un nodo ---------------------------------- */

const RingNode: React.FC<{
  i: number;
  angle: number;
  ringRot: number;
  accent: string;
  state: 'done' | 'active' | 'future';
  lit: number; // 0..1 — lo enciende el satélite al pasar
  pop: number; // 0..1 — entrada del disco
}> = ({i, angle, ringRot, accent, state, lit, pop}) => {
  const frame = useCurrentFrame();
  const p = polar(R, angle);

  const breathe = 0.5 + 0.5 * Math.sin(frame * 0.12 + i * 0.7);
  const pulse = state === 'active' ? lit * (0.06 + 0.06 * breathe) : 0;
  const disc = NODE_R * (0.55 + 0.45 * pop) * (1 + pulse);

  const rimBright = state === 'future' ? 0.14 : 0.2 + 0.72 * lit;
  const iconColor =
    state === 'future'
      ? 'rgba(226,220,208,0.4)'
      : state === 'done'
      ? rgba(accent, 0.55)
      : shade(accent, 1.18);
  const iconDraw =
    state === 'future' ? Math.min(1, pop) : interpolate(lit, [0, 0.7], [0.25, 1], CLAMP);
  const iconFade = state === 'done' ? 1 - lit * 0.85 : 1;

  const check = state === 'done' ? interpolate(lit, [0.35, 1], [0, 1], CLAMP) : 0;

  return (
    <g
      transform={`translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) rotate(${(-ringRot).toFixed(3)})`}
      style={{
        opacity: pop * (state === 'future' ? 0.5 : 1),
        filter: state === 'future' ? 'blur(1.4px)' : 'none',
      }}
    >
      {/* halo que respira (sólo el activo) */}
      {state === 'active' && lit > 0.01 && (
        <circle
          r={disc + 26 + 8 * breathe}
          fill="none"
          stroke={rgba(accent, (0.16 + 0.16 * breathe) * lit)}
          strokeWidth={20}
          filter={`url(#${ID}-soft)`}
        />
      )}
      {/* anillo exterior que gira (sólo el activo) */}
      {state === 'active' && (
        <circle
          r={disc + 15}
          fill="none"
          stroke={rgba(accent, 0.45 * lit)}
          strokeWidth={1.6}
          strokeDasharray="7 13"
          strokeLinecap="round"
          transform={`rotate(${(frame * 1.7).toFixed(2)})`}
        />
      )}
      {/* disco */}
      <circle r={disc} fill={`url(#${ID}-disc)`} />
      <circle r={disc} fill={rgba(accent, 0.11 * lit)} />
      <circle
        r={disc}
        fill="none"
        stroke={rgba(accent, rimBright)}
        strokeWidth={state === 'active' ? 2.6 : 1.7}
      />
      {/* filo de luz superior */}
      <path
        d={`M ${-disc * 0.72} ${-disc * 0.5} A ${disc} ${disc} 0 0 1 ${disc * 0.72} ${
          -disc * 0.5
        }`}
        fill="none"
        stroke={rgba('#FFFFFF', 0.16 + 0.12 * lit)}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* ícono */}
      <g style={{opacity: iconFade}} transform={`scale(${(disc / NODE_R) * 0.92})`}>
        <StepIcon i={i} color={iconColor} draw={iconDraw} w={state === 'active' ? 2.1 : 1.7} />
      </g>
      {/* tilde de los cumplidos */}
      {check > 0.01 && (
        <path
          d="M-10 0 L-3.5 6.5 L10 -7.5"
          fill="none"
          stroke={shade(accent, 1.25)}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - check}
          style={{filter: `drop-shadow(0 0 6px ${rgba(accent, 0.7)})`}}
        />
      )}
      {/* numerito al pie del nodo */}
      <text
        y={disc + 26}
        textAnchor="middle"
        style={{
          fontFamily: FONT_SANS,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 2,
          fill: state === 'active' ? shade(accent, 1.2) : 'rgba(236,230,218,0.4)',
        }}
      >
        {String(i + 1).padStart(2, '0')}
      </text>
    </g>
  );
};

/* ------------------------------ el componente ------------------------------ */

export const FedRoutineRing: React.FC<FedRoutineRingProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'gold',
  step = 1,
  steps,
  kicker = 'Esta noche',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const items = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  const N = items.length;
  const SEG = 360 / N;
  const cur = Math.max(1, Math.min(N, Math.round(step)));
  const active = items[cur - 1];

  const T = Math.max(60, totalF);
  const at = (a: number) => a * T;
  /** rampa normalizada entre dos fracciones de la escena */
  const ramp = (a: number, b: number, ease?: (n: number) => number) =>
    interpolate(frame, [at(a), at(b)], [0, 1], ease ? {...CLAMP, easing: ease} : CLAMP);

  /* cámara: push-in lento + micro handheld (nada estático) */
  const push = interpolate(frame, [0, T], [1.015, 1.075], CLAMP);
  const hx = Math.sin(frame * 0.021) * width * 0.0022;
  const hy = Math.cos(frame * 0.029) * height * 0.0017;

  /* rotación lentísima del anillo entero */
  const ringRot = frame * 0.055 + Math.sin(frame * 0.017) * 0.45;

  /* satélite = reloj maestro */
  const satTarget = (cur - 1) * SEG;
  const travel = ramp(0.14, 0.66, Easing.inOut(Easing.cubic));
  const land = spring({
    frame: frame - Math.round(at(0.62)),
    fps,
    config: {damping: 13, mass: 0.5, stiffness: 90},
  });
  // al aterrizar, un rebote mínimo + micro-oscilación (nunca queda muerto)
  const satAng =
    interpolate(travel, [0, 1], [SAT_START, satTarget], CLAMP) +
    Math.sin(land * Math.PI) * 1.6 +
    Math.sin(frame * 0.09) * 0.35 * land;
  const satPos = polar(R, satAng);

  /* arco de progreso: desde la estación 1 hasta donde llegó el satélite */
  const C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, satAng / 360));
  const ringDraw = ramp(0.02, 0.34, Easing.out(Easing.cubic));

  /* estelas del satélite */
  const trail = React.useMemo(
    () =>
      new Array(18).fill(0).map((_, k) => ({
        k,
        back: 2.1 * (k + 1),
        o: Math.pow(1 - k / 18, 2.1),
      })),
    []
  );

  /* ticks de instrumento */
  const ticks = React.useMemo(
    () =>
      new Array(84).fill(0).map((_, k) => {
        const a = (k * 360) / 84;
        const major = k % 7 === 0;
        return {a, major, jitter: 0.55 + random(`frr-tick-${k}`) * 0.45};
      }),
    []
  );

  const farMotes = React.useMemo(
    () => makeMotes(18, 'frr-dust', 2, 6.5, 0.04, 0.09, 0.1, 0.3),
    []
  );
  const bokeh = React.useMemo(() => makeMotes(6, 'frr-bok', 110, 250, 0.008, 0.022, 0.04, 0.11), []);

  /* reveals del centro */
  const numIn = ramp(0.26, 0.46, Easing.out(Easing.cubic));
  const titleIn = ramp(0.34, 0.56, Easing.out(Easing.cubic));
  const subIn = ramp(0.42, 0.64, Easing.out(Easing.cubic));
  const kickIn = ramp(0.03, 0.16, Easing.out(Easing.cubic));
  const ghostPush = interpolate(frame, [0, T], [0.94, 1.06], CLAMP);
  const holdOut = interpolate(
    frame,
    [T - FED_WHIP_F * 1.6, T - FED_WHIP_F],
    [1, 0.86],
    CLAMP
  );

  const gStart = shade(accent, 1.3);
  const gMid = accent;
  const gEnd = shade(accent, 0.72);

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        {/* ============ L0 · fondo por mood + wash + viñeta ============ */}
        <AbsoluteFill
          style={{
            background: moodBg(mood, accent),
            transform: `scale(${(push * 1.04).toFixed(4)}) translate(${(hx * 1.8).toFixed(
              1
            )}px, ${(hy * 1.8).toFixed(1)}px)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(46% 52% at 50% ${((CY / 1080) * 100).toFixed(1)}%, ${rgba(
                accent,
                0.16
              )} 0%, transparent 68%)`,
              `radial-gradient(80% 60% at 82% 88%, ${rgba(TEAL, 0.06)} 0%, transparent 60%)`,
              'radial-gradient(118% 96% at 50% 46%, transparent 40%, rgba(1,3,8,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.55), transparent 22%, transparent 66%, rgba(2,4,10,0.78))',
            ].join(', '),
          }}
        />

        {/* ============ L1 · bokeh grande fuera de foco ============ */}
        <MotesLayer motes={bokeh} blur={16} scale={height / 1080} tint="240, 208, 150" />

        {/* ============ L2 · polvo en suspensión ============ */}
        <MotesLayer motes={farMotes} blur={1.3} scale={height / 1080} tint="235, 212, 166" />

        {/* ===== bloque del instrumento: L3..L6 en un solo SVG con cámara ===== */}
        <AbsoluteFill
          style={{
            transform: `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px) scale(${push.toFixed(
              4
            )})`,
            willChange: 'transform',
          }}
        >
          <svg
            viewBox="0 0 1920 1080"
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
          >
            <defs>
              <linearGradient id={`${ID}-prog`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={gStart} />
                <stop offset="52%" stopColor={gMid} />
                <stop offset="100%" stopColor={gEnd} />
              </linearGradient>
              <radialGradient id={`${ID}-disc`}>
                <stop offset="0%" stopColor="rgba(20,26,38,0.96)" />
                <stop offset="72%" stopColor="rgba(9,13,21,0.96)" />
                <stop offset="100%" stopColor="rgba(4,6,12,0.98)" />
              </radialGradient>
              <radialGradient id={`${ID}-halo`}>
                <stop offset="0%" stopColor={rgba(accent, 0.34)} />
                <stop offset="60%" stopColor={rgba(accent, 0.08)} />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <filter id={`${ID}-soft`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <filter id={`${ID}-glow`} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="13" />
              </filter>
            </defs>

            {/* halo suave detrás del anillo */}
            <circle
              cx={CX}
              cy={CY}
              r={R * 1.06}
              fill={`url(#${ID}-halo)`}
              opacity={0.55 * ringDraw}
            />

            {/* ---------- grupo que rota lentísimo ---------- */}
            <g transform={`rotate(${ringRot.toFixed(3)} ${CX} ${CY})`}>
              {/* ===== L3 · ticks de instrumento (contra-rotan: paralaje) ===== */}
              <g transform={`rotate(${(-ringRot * 2.1).toFixed(3)} ${CX} ${CY})`}>
                {ticks.map((t) => {
                  const rev = interpolate(
                    frame,
                    [at(0.0) + (t.a / 360) * at(0.26), at(0.06) + (t.a / 360) * at(0.26)],
                    [0, 1],
                    CLAMP
                  );
                  const r0 = R + 24;
                  const r1 = R + (t.major ? 44 : 33);
                  const a = polar(r0, t.a);
                  const b = polar(r0 + (r1 - r0) * rev, t.a);
                  return (
                    <line
                      key={t.a}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={rgba(
                        t.major ? accent : '#E8E2D6',
                        (t.major ? 0.42 : 0.16) * t.jitter * rev
                      )}
                      strokeWidth={t.major ? 2.2 : 1.1}
                      strokeLinecap="round"
                    />
                  );
                })}
                {/* aro fino exterior */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R + 54}
                  fill="none"
                  stroke={rgba('#E8E2D6', 0.07 * ringDraw)}
                  strokeWidth={1}
                  strokeDasharray="2 9"
                />
              </g>

              {/* ===== L4 · anillo base + progreso con glow ===== */}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="rgba(232,226,214,0.09)"
                strokeWidth={12}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ringDraw}
                transform={`rotate(-90 ${CX} ${CY})`}
                strokeLinecap="round"
              />
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={rgba(accent, 0.14 * ringDraw)}
                strokeWidth={1.4}
                strokeDasharray="1 7"
              />
              {/* glow del progreso */}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={rgba(accent, 0.55)}
                strokeWidth={17}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - frac)}
                transform={`rotate(-90 ${CX} ${CY})`}
                filter={`url(#${ID}-glow)`}
              />
              {/* progreso nítido */}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={`url(#${ID}-prog)`}
                strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - frac)}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
              {/* filo interior de luz sobre el progreso */}
              <circle
                cx={CX}
                cy={CY}
                r={R - 6.5}
                fill="none"
                stroke={rgba('#FFF6E2', 0.34)}
                strokeWidth={1.2}
                strokeDasharray={C}
                strokeDashoffset={(C - 4) * (1 - frac)}
                transform={`rotate(-90 ${CX} ${CY})`}
              />

              {/* ===== L6a · estela del satélite ===== */}
              {trail.map((t) => {
                const a = satAng - t.back;
                if (a < SAT_START - 1) return null;
                const p = polar(R, a);
                return (
                  <circle
                    key={t.k}
                    cx={p.x}
                    cy={p.y}
                    r={7.5 * (1 - t.k / 22)}
                    fill={rgba(shade(accent, 1.22), 0.5 * t.o)}
                  />
                );
              })}

              {/* ===== L5 · los nodos ===== */}
              {items.map((_, i) => {
                const ang = i * SEG;
                const state: 'done' | 'active' | 'future' =
                  i + 1 < cur ? 'done' : i + 1 === cur ? 'active' : 'future';
                const lit = interpolate(satAng, [ang - 7, ang + 11], [0, 1], CLAMP);
                const pop = spring({
                  frame: frame - Math.round(at(0.05) + i * at(0.035)),
                  fps,
                  config: {damping: 14, mass: 0.6, stiffness: 110},
                });
                return (
                  <RingNode
                    key={i}
                    i={i}
                    angle={ang}
                    ringRot={ringRot}
                    accent={accent}
                    state={state}
                    lit={lit}
                    pop={Math.min(1, Math.max(0, pop))}
                  />
                );
              })}

              {/* ===== L6b · cabeza del satélite ===== */}
              <g opacity={interpolate(frame, [at(0.1), at(0.16)], [0, 1], CLAMP)}>
                <circle
                  cx={satPos.x}
                  cy={satPos.y}
                  r={26}
                  fill={rgba(accent, 0.5)}
                  filter={`url(#${ID}-soft)`}
                />
                <circle cx={satPos.x} cy={satPos.y} r={7.5} fill={shade(accent, 1.4)} />
                <circle cx={satPos.x} cy={satPos.y} r={3} fill="#FFFBF2" />
              </g>
            </g>
          </svg>
        </AbsoluteFill>

        {/* ============ L7 · número fantasma + contenido central ============ */}
        <div
          style={{
            position: 'absolute',
            left: CX,
            top: CY,
            transform: `translate(-50%,-50%) translate(${(hx * 0.6).toFixed(2)}px, ${(
              hy * 0.6
            ).toFixed(2)}px) scale(${(ghostPush * push).toFixed(4)})`,
            fontFamily: FONT_SANS,
            fontSize: 430,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -18,
            color: rgba(accent, 0.075),
            opacity: numIn * holdOut,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {String(cur).padStart(2, '0')}
        </div>

        <div
          style={{
            position: 'absolute',
            left: CX - 250,
            top: CY - 176,
            width: 500,
            height: 352,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transform: `translate(${(hx * 0.6).toFixed(2)}px, ${(hy * 0.6).toFixed(
              2
            )}px) scale(${push.toFixed(4)})`,
          }}
        >
          {/* número gigante del paso activo */}
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 118,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -5,
              color: shade(accent, 1.22),
              textShadow: `0 0 46px ${rgba(accent, 0.5)}, 0 6px 26px rgba(0,0,0,0.75)`,
              opacity: numIn,
              transform: `translateY(${((1 - numIn) * 22).toFixed(1)}px) scale(${(
                0.9 +
                0.1 * numIn
              ).toFixed(3)})`,
            }}
          >
            {String(cur).padStart(2, '0')}
          </div>
          {/* filete */}
          <div
            style={{
              width: 108 * numIn,
              height: 2,
              margin: '16px 0 18px',
              background: `linear-gradient(90deg, transparent, ${rgba(accent, 0.85)}, transparent)`,
              opacity: numIn,
            }}
          />
          {/* título — reveal por máscara */}
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 43,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -0.6,
              color: '#F4EFE6',
              textShadow: '0 4px 26px rgba(0,0,0,0.8)',
              clipPath: `inset(0 ${((1 - titleIn) * 100).toFixed(1)}% 0 0)`,
              transform: `translateY(${((1 - titleIn) * 12).toFixed(1)}px)`,
              opacity: Math.min(1, titleIn * 1.6),
            }}
          >
            {active.title}
          </div>
          {/* bajada — reveal por máscara, serif itálica */}
          {active.sub && (
            <div
              style={{
                marginTop: 16,
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 24,
                lineHeight: 1.42,
                color: 'rgba(232,224,210,0.76)',
                textShadow: '0 2px 16px rgba(0,0,0,0.8)',
                clipPath: `inset(0 0 ${((1 - subIn) * 100).toFixed(1)}% 0)`,
                opacity: Math.min(1, subIn * 1.5),
              }}
            >
              {active.sub}
            </div>
          )}
        </div>

        {/* ============ kicker ============ */}
        <div
          style={{
            position: 'absolute',
            top: 66,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_SANS,
            fontSize: 17,
            letterSpacing: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: rgba(accent, 0.92),
            textShadow: '0 2px 18px rgba(0,0,0,0.85)',
            opacity: kickIn,
            transform: `translateY(${((1 - kickIn) * -10).toFixed(1)}px)`,
          }}
        >
          {kicker}
        </div>

        {/* ============ L8 · tira inferior con los N títulos ============ */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 74,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 10,
            padding: '0 90px',
          }}
        >
          {items.map((s, i) => {
            const on = i + 1 === cur;
            const past = i + 1 < cur;
            const inn = interpolate(
              frame,
              [at(0.2) + i * at(0.032), at(0.32) + i * at(0.032)],
              [0, 1],
              {...CLAMP, easing: Easing.out(Easing.cubic)}
            );
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: 320,
                  textAlign: 'center',
                  opacity: inn * (on ? 1 : past ? 0.62 : 0.34),
                  transform: `translateY(${((1 - inn) * 14).toFixed(1)}px)`,
                  filter: on ? 'none' : 'blur(0.4px)',
                }}
              >
                <div
                  style={{
                    height: 2,
                    marginBottom: 12,
                    background: on
                      ? `linear-gradient(90deg, transparent, ${rgba(accent, 0.95)}, transparent)`
                      : past
                      ? rgba(accent, 0.3)
                      : 'rgba(232,226,214,0.12)',
                    boxShadow: on ? `0 0 14px ${rgba(accent, 0.7)}` : 'none',
                    transform: `scaleX(${(0.35 + 0.65 * inn).toFixed(3)})`,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontVariant: 'small-caps',
                    fontSize: on ? 19 : 17,
                    fontWeight: on ? 700 : 500,
                    letterSpacing: on ? 2.4 : 1.8,
                    lineHeight: 1.28,
                    color: on ? shade(accent, 1.2) : 'rgba(232,224,210,0.82)',
                    textShadow: on
                      ? `0 0 22px ${rgba(accent, 0.45)}, 0 2px 12px rgba(0,0,0,0.85)`
                      : '0 2px 12px rgba(0,0,0,0.8)',
                  }}
                >
                  {s.title}
                </div>
              </div>
            );
          })}
        </div>
      </TransitionShell>

      {/* ============ L9 · grano ============ */}
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedRoutineRing;
