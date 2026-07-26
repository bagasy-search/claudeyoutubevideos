/* ############################################################################
 * FED_TRIAL — "EL ENSAYO CLÍNICO"
 *   Escena de kit dark-cinematic (Dr. Federer) que dramatiza un estudio como
 *   EXPERIMENTO, no como cartel. Multicapa estilo After Effects:
 *
 *     L0  fondo mood + wash de acento + viñeta (deriva lenta de cámara)
 *     L1  grilla técnica de laboratorio (líneas finas) + línea de escaneo
 *     L2  bokeh grande fuera de foco
 *     L3  polvo / motas finas
 *     L4  ESTELAS de los participantes (motion trails reales, por muestreo)
 *     L5  PUNTOS: nube → migración a dos grupos (stagger + arco + micro-float)
 *     L6  BARRAS con máscara de llenado, glow, shimmer y tapa luminosa
 *     L7  CONTADORES numéricos sincronizados + unidad
 *     L8  LLAVE de delta (se dibuja) + número de diferencia
 *     L9  placa de fuente (journal · year) con barrido de luz + placa veredicto
 *     L10 título / subtítulo serif itálica / tira de DISEÑO en small-caps
 *     L11 GrainOverlay
 *
 *   Todos los tiempos son FRACCIONES de totalF: funciona igual de bien de 3s
 *   (90f) a 7s (210f). Nada estático: cámara, motas, flotación, shimmer y
 *   respiración de la grilla corren siempre.
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
  moodBg,
  rgba,
  shade,
  type FedMood,
} from './FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedTrialGroup = {
  label: string;
  value: number;
  suffix?: string;
  tone?: 'good' | 'bad';
};

export type FedTrialProps = {
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  journal?: string;
  year?: string;
  n?: number;
  design?: string;
  groupA?: FedTrialGroup;
  groupB?: FedTrialGroup;
  unit?: string;
  title?: string;
  sub?: string;
  verdict?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;

const BAR_W = 88;
const BAR_H = 286;
const BASE_Y = 760; // pie de las barras
const TOP_Y = BASE_Y - BAR_H; // 474 — tope del riel

const CLUSTER_Y = 296; // centro vertical de cada nube ya ordenada
const DOT_GAP = 24;
const DOT_SIZE = 11;
const MAX_DOTS = 60;

/* --------------------------------------------------------------- color mix */

type RGB = [number, number, number];

const toRgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = Number.parseInt(full.length === 6 ? full : 'ffffff', 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const mixRgb = (a: string, b: string, t: number): RGB => {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(ca[0] + (cb[0] - ca[0]) * k),
    Math.round(ca[1] + (cb[1] - ca[1]) * k),
    Math.round(ca[2] + (cb[2] - ca[2]) * k),
  ];
};

const css = (c: RGB, alpha = 1): string => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

/* --------------------------------------------------------------- utilidad */

const fmt = (v: number, dec: number): string =>
  dec > 0 ? v.toFixed(dec) : String(Math.round(v));

const EASE_MOVE = Easing.bezier(0.22, 0.9, 0.2, 1);
const EASE_FILL = Easing.bezier(0.16, 0.86, 0.24, 1);

/* ---------------------------------------------------------- puntos (datos) */

type DotSpec = {
  cx: number; // nube (caos)
  cy: number;
  tx: number; // destino (grupo ordenado)
  ty: number;
  bow: number; // curvatura del vuelo
  phase: number;
  amp: number;
  born: number; // 0..1 dentro de la ventana de aparición
  fly: number; // 0..1 dentro de la ventana de migración
  group: 0 | 1;
  row: number;
};

const buildDots = (
  drawn: number,
  cxA: number,
  cxB: number,
  seed: string
): DotSpec[] => {
  const nA = Math.ceil(drawn / 2);
  const out: DotSpec[] = [];

  for (let g = 0; g < 2; g++) {
    const count = g === 0 ? nA : drawn - nA;
    if (count <= 0) continue;
    const cols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(count))));
    const rows = Math.ceil(count / cols);
    const clusterX = g === 0 ? cxA : cxB;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rowCount = Math.min(cols, count - row * cols);
      const s = `${seed}-${g}-${i}`;

      // nube inicial: elipse ancha centrada en el escenario
      const ang = random(`${s}-a`) * Math.PI * 2;
      const rad = 0.35 + 0.65 * random(`${s}-r`);
      const midX = (cxA + cxB) / 2;

      out.push({
        cx: midX + Math.cos(ang) * rad * 430,
        cy: 372 + Math.sin(ang) * rad * 168,
        tx: clusterX + (col - (rowCount - 1) / 2) * DOT_GAP,
        ty: CLUSTER_Y + (row - (rows - 1) / 2) * DOT_GAP,
        bow: (random(`${s}-b`) - 0.5) * 190,
        phase: random(`${s}-p`) * Math.PI * 2,
        amp: 1.6 + random(`${s}-m`) * 3.4,
        born: random(`${s}-n`),
        fly: random(`${s}-f`),
        group: g as 0 | 1,
        row,
      });
    }
  }
  return out;
};

/* ------------------------------------------------------- posición de un punto */

const dotAt = (
  d: DotSpec,
  frame: number,
  bornA: number,
  bornB: number,
  flyA: number,
  flyB: number
): {x: number; y: number; q: number; born: number} => {
  const b0 = bornA + (bornB - bornA) * d.born;
  const born = interpolate(frame, [b0, b0 + (bornB - bornA) * 0.55 + 4], [0, 1], CLAMP);

  const f0 = flyA + (flyB - flyA) * 0.55 * d.fly;
  const f1 = f0 + (flyB - flyA) * 0.55;
  const q = interpolate(frame, [f0, f1], [0, 1], {...CLAMP, easing: EASE_MOVE});

  // vuelo con arco perpendicular + micro-flotación (más amplia mientras flota)
  const bow = Math.sin(q * Math.PI) * d.bow;
  const floatAmp = d.amp * (1 - 0.62 * q);
  const x =
    d.cx + (d.tx - d.cx) * q + bow * 0.34 + Math.sin(frame * 0.036 + d.phase) * floatAmp;
  const y =
    d.cy +
    (d.ty - d.cy) * q -
    Math.sin(q * Math.PI) * 46 +
    Math.cos(frame * 0.045 + d.phase * 1.7) * floatAmp;

  return {x, y, q, born};
};

/* ================================ COMPONENTE ============================== */

export const FedTrial: React.FC<FedTrialProps> = ({
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  journal = 'Pediatric Dermatology',
  year = '2013',
  n = 19,
  design = 'aleatorizado · evaluador ciego · 4 semanas',
  groupA = {label: 'Aceite de oliva', value: 24, suffix: '%', tone: 'bad'},
  groupB = {label: 'Aceite de girasol', value: 7, suffix: '%', tone: 'good'},
  unit = 'pérdida de agua transepidérmica',
  title = 'Un antebrazo con oliva, el otro con girasol',
  sub = 'Seis gotas, dos veces por día, durante cuatro semanas',
  verdict = 'El brazo del oliva perdió MÁS agua',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const T = Math.max(45, totalF);
  const at = (a: number) => T * a; // marca temporal relativa
  const holdEnd = T - FED_WHIP_F;

  /* ---- geometría dependiente del veredicto (equilibrio de la composición) */
  const CX = verdict ? 830 : 960;
  const xA = CX - 196;
  const xB = CX + 196;

  /* ---- datos ----------------------------------------------------------- */
  const nSafe = Math.max(2, Math.round(n));
  const drawn = Math.min(MAX_DOTS, nSafe);
  const capped = nSafe > MAX_DOTS;

  const dots = React.useMemo(() => buildDots(drawn, xA, xB, 'fedtrial-dots'), [
    drawn,
    xA,
    xB,
  ]);

  const vA = groupA.value;
  const vB = groupB.value;
  const maxV = Math.max(Math.abs(vA), Math.abs(vB), 0.0001);
  const scaleMax = maxV * 1.14;
  const dec = maxV < 10 ? 1 : 0;

  const goldRgb = toRgb(accent);
  const coldRgb = toRgb(COOL_BLUE);
  const tealRgb = toRgb(TEAL);

  const colorFor = (g: FedTrialGroup): RGB =>
    g.tone === 'good' ? goldRgb : g.tone === 'bad' ? coldRgb : tealRgb;

  const cA = colorFor(groupA);
  const cB = colorFor(groupB);
  const hexA = groupA.tone === 'good' ? accent : groupA.tone === 'bad' ? COOL_BLUE : TEAL;
  const hexB = groupB.tone === 'good' ? accent : groupB.tone === 'bad' ? COOL_BLUE : TEAL;
  const glowA = groupA.tone === 'good';
  const glowB = groupB.tone === 'good';

  /* ---- ventanas de tiempo (todas relativas a T) ------------------------- */
  const bornA = at(0.05);
  const bornB = at(0.26);
  const flyA = at(0.24);
  const flyB = at(0.56);

  const plate = interpolate(frame, [at(0.03), at(0.19)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const plateSweep = interpolate(frame, [at(0.04), at(0.28)], [0, 1], CLAMP);

  const nLbl = interpolate(frame, [at(0.1), at(0.24)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const fillA = interpolate(frame, [at(0.46), at(0.76)], [0, 1], {
    ...CLAMP,
    easing: EASE_FILL,
  });
  const fillB = interpolate(frame, [at(0.5), at(0.8)], [0, 1], {
    ...CLAMP,
    easing: EASE_FILL,
  });

  const deltaP = interpolate(frame, [at(0.78), at(0.9)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const titleP = interpolate(frame, [at(0.3), at(0.46)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const subP = interpolate(frame, [at(0.38), at(0.54)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const desP = interpolate(frame, [at(0.46), at(0.64)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const vStart = at(0.72);
  const vSpring = spring({
    frame: frame - vStart,
    fps,
    config: {damping: 9.5, stiffness: 140, mass: 0.85},
    durationInFrames: Math.max(14, Math.round(T * 0.24)),
  });
  const vIn = interpolate(frame, [vStart, vStart + 3], [0, 1], CLAMP);
  const stampFlash = Math.sin(
    interpolate(frame, [vStart, vStart + Math.max(8, T * 0.09)], [0, 1], CLAMP) * Math.PI
  );

  /* ---- alturas actuales de barra --------------------------------------- */
  const hA = (Math.abs(vA) / scaleMax) * BAR_H * fillA;
  const hB = (Math.abs(vB) / scaleMax) * BAR_H * fillB;
  const yTopA = BASE_Y - hA;
  const yTopB = BASE_Y - hB;

  const deltaVal = Math.abs(vA - vB);
  const deltaSuffix = groupA.suffix ?? groupB.suffix ?? '';
  const bx = CX; // eje de la llave

  /* ---- cámara ----------------------------------------------------------- */
  const push = interpolate(frame, [0, T], [1.012, 1.055], CLAMP);
  const camX = Math.sin(frame * 0.017) * 5.5;
  const camY = Math.cos(frame * 0.0225) * 4.2;
  const stageScale = (width / STAGE_W) * push;

  /* ---- partículas -------------------------------------------------------- */
  const bokeh = React.useMemo(
    () => makeMotes(6, 'fedtrial-bok', 120, 265, 0.008, 0.022, 0.04, 0.1),
    []
  );
  const dust = React.useMemo(
    () => makeMotes(30, 'fedtrial-dust', 2, 7, 0.04, 0.115, 0.1, 0.3),
    []
  );

  /* ---- grilla técnica ---------------------------------------------------- */
  const gridBreath = 0.5 + 0.5 * Math.sin(frame * 0.021);
  const scanY = ((frame * 3.2) % (STAGE_H + 420)) - 210;

  const vLines = React.useMemo(() => {
    const arr: number[] = [];
    for (let x = 80; x < STAGE_W; x += 80) arr.push(x);
    return arr;
  }, []);
  const hLines = React.useMemo(() => {
    const arr: number[] = [];
    for (let y = 80; y < STAGE_H; y += 80) arr.push(y);
    return arr;
  }, []);

  /* ---- helper de barra --------------------------------------------------- */
  const renderBar = (
    g: FedTrialGroup,
    x: number,
    h: number,
    f: number,
    c: RGB,
    hex: string,
    glow: boolean,
    key: string
  ) => {
    const yTop = BASE_Y - h;
    const shimmer = ((frame * 2.6) % 240) / 240;
    const capGlow = 0.35 + 0.35 * Math.sin(frame * 0.09 + (glow ? 0 : 1.6));
    const counter = g.value * f;
    const pop = interpolate(f, [0.9, 1], [0, 1], CLAMP);

    return (
      <React.Fragment key={key}>
        {/* halo detrás de la barra ganadora */}
        {glow && (
          <div
            style={{
              position: 'absolute',
              left: x - 170,
              top: yTop - 130,
              width: 340,
              height: h + 260,
              background: `radial-gradient(50% 50% at 50% 50%, ${css(
                c,
                0.2 * f + 0.05 * capGlow
              )} 0%, transparent 70%)`,
              filter: 'blur(14px)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* riel / probeta */}
        <div
          style={{
            position: 'absolute',
            left: x - BAR_W / 2,
            top: TOP_Y,
            width: BAR_W,
            height: BAR_H,
            borderRadius: 7,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.085)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(0,0,0,0.34))',
            boxShadow: 'inset 0 0 26px rgba(0,0,0,0.55)',
          }}
        >
          {/* marcas de escala del riel */}
          {[0.25, 0.5, 0.75].map((t) => (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: BAR_H * t,
                height: 1,
                background: 'rgba(255,255,255,0.07)',
              }}
            />
          ))}

          {/* MÁSCARA DE LLENADO: el degradado existe entero, la máscara lo revela */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(${((1 - h / BAR_H) * 100).toFixed(3)}% 0 0 0)`,
              background: `linear-gradient(180deg, ${css(c, 0.98)} 0%, ${css(
                c,
                0.62
              )} 46%, ${shade(hex, 0.34)} 100%)`,
              boxShadow: glow ? `0 0 30px ${css(c, 0.45)}` : `0 0 14px ${css(c, 0.16)}`,
            }}
          >
            {/* shimmer interno recorriendo el líquido */}
            <div
              style={{
                position: 'absolute',
                left: '-30%',
                right: '-30%',
                top: `${(shimmer * 130 - 15).toFixed(1)}%`,
                height: '22%',
                background:
                  'linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)',
                mixBlendMode: 'screen',
                opacity: 0.55,
              }}
            />
            {/* brillo lateral de vidrio */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 0,
                bottom: 0,
                width: 9,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.34), transparent)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>

        {/* tapa luminosa del nivel */}
        {h > 1 && (
          <div
            style={{
              position: 'absolute',
              left: x - BAR_W / 2 - 9,
              top: yTop - 1.5,
              width: BAR_W + 18,
              height: 3,
              borderRadius: 2,
              background: css(c, 0.95),
              boxShadow: `0 0 ${(glow ? 24 : 12) + capGlow * 12}px ${css(
                c,
                glow ? 0.85 : 0.45
              )}`,
            }}
          />
        )}

        {/* CONTADOR que sube con el nivel */}
        <div
          style={{
            position: 'absolute',
            left: x - 150,
            top: yTop - 84 - pop * 3,
            width: 300,
            textAlign: 'center',
            opacity: interpolate(f, [0, 0.06], [0, 1], CLAMP),
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 700,
              fontSize: 56,
              lineHeight: 1,
              letterSpacing: -1.6,
              color: css(c, 1),
              textShadow: glow
                ? `0 0 26px ${css(c, 0.6)}, 0 4px 18px rgba(0,0,0,0.8)`
                : '0 4px 18px rgba(0,0,0,0.85)',
              transform: `scale(${(1 + pop * 0.06).toFixed(4)})`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(counter, dec)}
            <span style={{fontSize: 30, marginLeft: 2, opacity: 0.8}}>
              {g.suffix ?? ''}
            </span>
          </div>
          <div
            style={{
              marginTop: 7,
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 3.4,
              textTransform: 'uppercase',
              color: 'rgba(226,232,240,0.42)',
            }}
          >
            {unit}
          </div>
        </div>

        {/* etiqueta del grupo */}
        <div
          style={{
            position: 'absolute',
            left: x - 175,
            top: BASE_Y + 20,
            width: 350,
            textAlign: 'center',
            opacity: interpolate(frame, [flyB - 6, flyB + 12], [0, 1], CLAMP),
            transform: `translateY(${interpolate(
              frame,
              [flyB - 6, flyB + 12],
              [10, 0],
              CLAMP
            ).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '6px 15px',
              borderRadius: 4,
              border: `1px solid ${css(c, 0.28)}`,
              background: 'linear-gradient(180deg, rgba(9,13,21,0.6), rgba(4,7,13,0.8))',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: css(c, 1),
                boxShadow: `0 0 10px ${css(c, 0.9)}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 2.6,
                textTransform: 'uppercase',
                color: glow ? css(c, 0.98) : 'rgba(224,232,244,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              {g.label}
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  };

  /* ============================== RENDER ================================= */

  return (
    <>
      <TransitionShell accent={accent} totalF={totalF}>
        <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
          {/* ---------- L0 · fondo mood + wash + viñeta ---------- */}
          <AbsoluteFill style={{background: moodBg(mood, accent)}} />
          <AbsoluteFill
            style={{
              background: [
                `radial-gradient(64% 58% at ${(50 + camX * 0.4).toFixed(
                  2
                )}% 40%, ${rgba(TEAL, 0.1)} 0%, transparent 66%)`,
                `radial-gradient(46% 40% at 50% 74%, ${rgba(accent, 0.09)} 0%, transparent 70%)`,
                'radial-gradient(122% 104% at 50% 46%, transparent 40%, rgba(1,3,8,0.9) 100%)',
                'linear-gradient(to bottom, rgba(2,4,10,0.6), transparent 22%, transparent 66%, rgba(2,4,10,0.8))',
              ].join(', '),
            }}
          />

          {/* ---------- L1 · grilla técnica + escaneo ---------- */}
          <AbsoluteFill
            style={{
              opacity: 0.34 + 0.14 * gridBreath,
              transform: `translate(${(camX * 1.6).toFixed(2)}px, ${(camY * 1.6).toFixed(
                2
              )}px)`,
              pointerEvents: 'none',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              preserveAspectRatio="none"
            >
              {vLines.map((x) => (
                <line
                  key={`v${x}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={STAGE_H}
                  stroke="rgba(143,208,200,0.062)"
                  strokeWidth={x % 320 === 0 ? 1.4 : 0.7}
                />
              ))}
              {hLines.map((y) => (
                <line
                  key={`h${y}`}
                  x1={0}
                  y1={y}
                  x2={STAGE_W}
                  y2={y}
                  stroke="rgba(143,208,200,0.05)"
                  strokeWidth={y % 320 === 0 ? 1.3 : 0.7}
                />
              ))}
              {/* línea base del experimento */}
              <line
                x1={CX - 470}
                y1={BASE_Y}
                x2={CX + 470}
                y2={BASE_Y}
                stroke={rgba(TEAL, 0.34)}
                strokeWidth={1.4}
                strokeDasharray="14 9"
                strokeDashoffset={-frame * 0.5}
              />
            </svg>
          </AbsoluteFill>

          {/* línea de escaneo del laboratorio */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${((scanY / STAGE_H) * 100).toFixed(3)}%`,
              height: 120,
              background: `linear-gradient(180deg, transparent, ${rgba(
                TEAL,
                0.05
              )} 48%, transparent)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />

          {/* ---------- L2 · bokeh ---------- */}
          <MotesLayer motes={bokeh} blur={16} scale={height / 1080} tint="150, 200, 210" />

          {/* ---------- L3 · polvo ---------- */}
          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="228, 224, 208" />

          {/* ================= ESCENARIO 1920x1080 ESCALADO ================= */}
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div
              style={{
                position: 'relative',
                width: STAGE_W,
                height: STAGE_H,
                transform: `scale(${stageScale.toFixed(5)}) translate(${camX.toFixed(
                  2
                )}px, ${camY.toFixed(2)}px)`,
                willChange: 'transform',
              }}
            >
              {/* ---------- L4 · ESTELAS de los puntos ---------- */}
              <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
                {dots.map((d, i) => {
                  const cur = dotAt(d, frame, bornA, bornB, flyA, flyB);
                  if (cur.born <= 0.02) return null;
                  const prev = dotAt(d, frame - 4, bornA, bornB, flyA, flyB);
                  const dx = cur.x - prev.x;
                  const dy = cur.y - prev.y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  if (len < 2.2) return null;
                  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
                  const tc = mixRgb(
                    `#${tealRgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`,
                    d.group === 0 ? hexA : hexB,
                    cur.q
                  );
                  const o = Math.min(0.75, len / 34) * cur.born;
                  return (
                    <div
                      key={`tr${i}`}
                      style={{
                        position: 'absolute',
                        left: prev.x,
                        top: prev.y - 1.5,
                        width: len,
                        height: 3,
                        transformOrigin: '0% 50%',
                        transform: `rotate(${ang.toFixed(2)}deg)`,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${css(tc, 0)}, ${css(
                          tc,
                          0.55
                        )})`,
                        filter: 'blur(2px)',
                        opacity: o,
                      }}
                    />
                  );
                })}
              </div>

              {/* ---------- L5 · PUNTOS (participantes) ---------- */}
              <div style={{position: 'absolute', inset: 0}}>
                {dots.map((d, i) => {
                  const p = dotAt(d, frame, bornA, bornB, flyA, flyB);
                  if (p.born <= 0.01) return null;
                  const gHex = d.group === 0 ? hexA : hexB;
                  const c = mixRgb('#B9E4DE', gHex, Math.min(1, p.q * 1.25));
                  // pulso que recorre el grupo cuando la barra empieza a llenarse
                  const active = d.group === 0 ? fillA : fillB;
                  const pulse =
                    active > 0.02
                      ? 0.35 *
                        Math.max(0, Math.sin(frame * 0.16 - d.row * 0.7)) *
                        Math.min(1, active * 3)
                      : 0;
                  const s = (DOT_SIZE * (0.6 + 0.4 * p.born)) * (1 + pulse * 0.28);
                  const halo = 0.45 + 0.35 * p.q + pulse;
                  return (
                    <div
                      key={`dt${i}`}
                      style={{
                        position: 'absolute',
                        left: p.x - s / 2,
                        top: p.y - s / 2,
                        width: s,
                        height: s,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.96), ${css(
                          c,
                          0.98
                        )} 62%, ${css(c, 0.5)} 100%)`,
                        boxShadow: `0 0 ${(s * 1.9).toFixed(1)}px ${(s * 0.5).toFixed(
                          1
                        )}px ${css(c, 0.4 * halo)}`,
                        opacity: p.born,
                        filter: p.q < 0.06 ? 'blur(0.6px)' : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* ---------- L6+L7 · BARRAS y CONTADORES ---------- */}
              {renderBar(groupA, xA, hA, fillA, cA, hexA, glowA, 'A')}
              {renderBar(groupB, xB, hB, fillB, cB, hexB, glowB, 'B')}

              {/* ---------- L8 · LLAVE de delta ---------- */}
              {deltaP > 0.005 && (
                <>
                  <svg
                    style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                    width={STAGE_W}
                    height={STAGE_H}
                    viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
                  >
                    <line
                      x1={xA + BAR_W / 2}
                      y1={yTopA}
                      x2={xA + BAR_W / 2 + (bx - xA - BAR_W / 2) * deltaP}
                      y2={yTopA}
                      stroke={rgba(accent, 0.5)}
                      strokeWidth={1.3}
                      strokeDasharray="7 6"
                    />
                    <line
                      x1={xB - BAR_W / 2}
                      y1={yTopB}
                      x2={xB - BAR_W / 2 - (xB - BAR_W / 2 - bx) * deltaP}
                      y2={yTopB}
                      stroke={rgba(accent, 0.5)}
                      strokeWidth={1.3}
                      strokeDasharray="7 6"
                    />
                    <path
                      d={`M ${bx - 11} ${yTopA} L ${bx} ${yTopA} L ${bx} ${(
                        yTopA +
                        (yTopB - yTopA) * deltaP
                      ).toFixed(2)}${
                        deltaP > 0.96 ? ` L ${bx - 11} ${yTopB}` : ''
                      }`}
                      fill="none"
                      stroke={rgba(accent, 0.85)}
                      strokeWidth={2}
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 7px ${rgba(accent, 0.55)})`,
                      }}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      left: bx - 130,
                      top: (yTopA + yTopB) / 2 - 40,
                      width: 260,
                      textAlign: 'center',
                      opacity: interpolate(deltaP, [0.42, 1], [0, 1], CLAMP),
                      transform: `translateX(${interpolate(
                        deltaP,
                        [0.42, 1],
                        [-14, 0],
                        CLAMP
                      ).toFixed(1)}px)`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: rgba(accent, 0.72),
                      }}
                    >
                      diferencia
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 40,
                        letterSpacing: -1,
                        color: accent,
                        textShadow: `0 0 22px ${rgba(accent, 0.5)}, 0 3px 14px rgba(0,0,0,0.8)`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fmt(deltaVal, dec)}
                      <span style={{fontSize: 24, opacity: 0.82}}>{deltaSuffix}</span>
                    </div>
                  </div>
                </>
              )}

              {/* ---------- n = X ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: CX - 300,
                  top: 176,
                  width: 600,
                  textAlign: 'center',
                  opacity: nLbl,
                  transform: `translateY(${((1 - nLbl) * 12).toFixed(1)}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 5,
                    textTransform: 'uppercase',
                    color: rgba(TEAL, 0.86),
                    textShadow: `0 0 16px ${rgba(TEAL, 0.35)}`,
                  }}
                >
                  {`n = ${nSafe} participantes`}
                </span>
                {capped && (
                  <span
                    style={{
                      marginLeft: 12,
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: 12,
                      letterSpacing: 2.6,
                      textTransform: 'uppercase',
                      color: 'rgba(226,232,240,0.36)',
                    }}
                  >
                    · muestra visual 60
                  </span>
                )}
              </div>

              {/* ---------- L9a · PLACA DE FUENTE ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 62,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: plate,
                  transform: `translateY(${((1 - plate) * -18).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '13px 30px 14px',
                    borderRadius: 5,
                    border: `1px solid ${rgba(TEAL, 0.28)}`,
                    background:
                      'linear-gradient(180deg, rgba(10,16,24,0.62), rgba(4,7,13,0.86))',
                    boxShadow: `0 18px 46px rgba(0,0,0,0.6), inset 0 0 30px ${rgba(
                      TEAL,
                      0.06
                    )}`,
                    clipPath: `inset(0 ${((1 - plate) * 50).toFixed(1)}% 0 ${(
                      (1 - plate) *
                      50
                    ).toFixed(1)}%)`,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: accent,
                      boxShadow: `0 0 12px ${rgba(accent, 0.9)}`,
                      opacity: 0.6 + 0.4 * Math.sin(frame * 0.13),
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 20,
                      letterSpacing: 4.4,
                      textTransform: 'uppercase',
                      color: '#EAF2F0',
                    }}
                  >
                    {journal}
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 20,
                      background: 'rgba(255,255,255,0.16)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 20,
                      letterSpacing: 3.2,
                      color: accent,
                    }}
                  >
                    {year}
                  </span>
                  {/* barrido de luz que cruza la placa al entrar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-40%',
                      bottom: '-40%',
                      left: 0,
                      width: '42%',
                      transform: `translateX(${interpolate(
                        plateSweep,
                        [0, 1],
                        [-150, 260],
                        CLAMP
                      ).toFixed(1)}%) skewX(-18deg)`,
                      background: `linear-gradient(100deg, transparent 18%, ${rgba(
                        accent,
                        0.42
                      )} 50%, transparent 82%)`,
                      mixBlendMode: 'screen',
                      opacity: Math.sin(plateSweep * Math.PI) * 0.95,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* ---------- L9b · PLACA DE VEREDICTO (estampado) ---------- */}
              {verdict && vIn > 0.001 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 1240,
                    top: 372,
                    width: 600,
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: Math.min(vIn, 1) * Math.min(1, (holdEnd + 6 - frame) / 6),
                    transform: [
                      `translateY(${interpolate(vSpring, [0, 1], [26, 0], CLAMP).toFixed(
                        1
                      )}px)`,
                      `rotate(${interpolate(vSpring, [0, 1], [-9, -2.4], CLAMP).toFixed(
                        2
                      )}deg)`,
                      `scale(${interpolate(vSpring, [0, 1], [1.55, 1], CLAMP).toFixed(4)})`,
                    ].join(' '),
                    transformOrigin: '50% 50%',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      padding: '22px 34px 24px',
                      borderRadius: 6,
                      border: `2px solid ${rgba(accent, 0.62)}`,
                      background:
                        'linear-gradient(180deg, rgba(12,17,26,0.74), rgba(4,7,13,0.9))',
                      boxShadow: `0 26px 64px rgba(0,0,0,0.66), 0 0 ${(
                        26 +
                        stampFlash * 46
                      ).toFixed(0)}px ${rgba(accent, 0.24 + stampFlash * 0.4)}`,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: 6,
                        textTransform: 'uppercase',
                        color: rgba(accent, 0.8),
                        marginBottom: 9,
                      }}
                    >
                      resultado
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 34,
                        lineHeight: 1.16,
                        letterSpacing: -0.3,
                        color: '#F6F1E7',
                        textShadow: '0 4px 20px rgba(0,0,0,0.75)',
                      }}
                    >
                      {verdict}
                    </div>
                    {/* destello del estampado */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: -3,
                        borderRadius: 8,
                        border: `2px solid ${rgba(accent, stampFlash * 0.65)}`,
                        transform: `scale(${(1 + stampFlash * 0.09).toFixed(4)})`,
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ---------- L10 · TÍTULO / SUB / DISEÑO ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  right: 120,
                  top: 856,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 46,
                    lineHeight: 1.1,
                    letterSpacing: -0.8,
                    color: '#F4EFE6',
                    textShadow: '0 5px 26px rgba(0,0,0,0.75)',
                    clipPath: `inset(0 ${((1 - titleP) * 100).toFixed(1)}% 0 0)`,
                    transform: `translateY(${((1 - titleP) * 16).toFixed(1)}px)`,
                    opacity: interpolate(titleP, [0, 0.12], [0, 1], CLAMP),
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontSize: 27,
                    color: 'rgba(232,226,214,0.74)',
                    opacity: subP,
                    transform: `translateY(${((1 - subP) * 12).toFixed(1)}px)`,
                  }}
                >
                  {sub}
                </div>

                {/* tira fina con el DISEÑO del estudio */}
                <div
                  style={{
                    marginTop: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    opacity: desP,
                  }}
                >
                  <div
                    style={{
                      height: 1,
                      width: 160 * desP,
                      background: `linear-gradient(90deg, transparent, ${rgba(
                        TEAL,
                        0.5
                      )})`,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: 14,
                      letterSpacing: 6.4,
                      textTransform: 'uppercase',
                      color: rgba(TEAL, 0.82),
                      whiteSpace: 'nowrap',
                      textShadow: `0 0 18px ${rgba(TEAL, 0.28)}`,
                    }}
                  >
                    {design}
                  </div>
                  <div
                    style={{
                      height: 1,
                      width: 160 * desP,
                      background: `linear-gradient(90deg, ${rgba(
                        TEAL,
                        0.5
                      )}, transparent)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </AbsoluteFill>

          {/* ---------- bokeh de primer plano fuera de foco ---------- */}
          <AbsoluteFill style={{filter: 'blur(18px)', opacity: 0.42, pointerEvents: 'none'}}>
            <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="235, 214, 168" />
          </AbsoluteFill>
        </AbsoluteFill>
      </TransitionShell>

      <GrainOverlay />
    </>
  );
};

export default FedTrial;
