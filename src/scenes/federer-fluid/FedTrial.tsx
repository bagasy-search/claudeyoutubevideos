/* ############################################################################
 * FED_TRIAL — "EL ENSAYO CLÍNICO"
 *   Escena de kit dark-cinematic (Dr. Federer) que dramatiza un estudio como
 *   EXPERIMENTO, no como cartel. Multicapa estilo After Effects.
 *
 *   JERARQUÍA (v2, escala emparejada con FedOilBars / FedSeal / FedLabelScan):
 *     arriba ....... placa de fuente (journal · year) con barrido de luz
 *     costado izq .. ficha del DISEÑO del estudio (rail vertical)
 *     centro ....... EL EXPERIMENTO, dominante: nube de participantes →
 *                    dos grupos → barras anchas con ticks de escala y
 *                    contadores gigantes (porte FedStat) + llave de delta
 *     costado der .. la N grande y el reparto por grupo
 *     abajo ........ título con peso + subtítulo serif; veredicto estampado
 *
 *   CAPAS
 *     L0  fondo mood + wash + viñeta (deriva de cámara)
 *     L1  grilla técnica de laboratorio + línea de escaneo
 *     L2  bokeh grande fuera de foco
 *     L3  polvo fino
 *     L4  ESTELAS de los participantes (motion trails por muestreo real)
 *     L5  PUNTOS: nube → migración a dos grupos (stagger, arco, micro-float)
 *     L6  EJES: ticks de escala numerados al costado de cada barra
 *     L7  BARRAS anchas con máscara de llenado, shimmer, halo y tapa luminosa
 *     L8  CONTADORES gigantes sincronizados + unidad
 *     L9  LLAVE de delta que se dibuja + número de diferencia
 *     L10 rails de contexto: ficha de DISEÑO (izq) + N grande (der)
 *     L11 placa de fuente + placa de VEREDICTO estampada
 *     L12 título / subtítulo + GrainOverlay
 *
 *   Todos los tiempos son FRACCIONES de totalF: aguanta de 3s (90f) a 7s
 *   (210f). Nada estático: cámara, motas, flotación, shimmer y respiración
 *   de la grilla corren siempre.
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

  type FedTransitionVariant,
} from '../../FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedTrialGroup = {
  label: string;
  value: number;
  suffix?: string;
  tone?: 'good' | 'bad';
};

export type FedTrialProps = {
  variant?: FedTransitionVariant;
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

/* barras: anchas y altas — junto con los números, el elemento dominante */
const BAR_W = 200;
const BAR_H = 340;
const BASE_Y = 820;
const TOP_Y = BASE_Y - BAR_H; // 480
const CX = 960;
const X_A = CX - 215; // 745
const X_B = CX + 215; // 1175

const CLUSTER_Y = 232; // centro vertical de cada nube ya ordenada
const MAX_DOTS = 60;

/* rails de contexto que llenan los costados */
const RAIL_L = 92;
const RAIL_R = 1452;
const RAIL_W = 376;

/* --------------------------------------------------------------- color mix */

type RGB = [number, number, number];

const toRgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = Number.parseInt(full.length === 6 ? full : 'ffffff', 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const mixRgb = (a: RGB, b: RGB, t: number): RGB => {
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
};

const css = (c: RGB, alpha = 1): string => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

const NEUTRAL: RGB = [186, 226, 220]; // participante todavía sin asignar

/* --------------------------------------------------------------- utilidad */

const fmt = (v: number, dec: number): string =>
  dec > 0 ? v.toFixed(dec) : String(Math.round(v));

const EASE_MOVE = Easing.bezier(0.22, 0.9, 0.2, 1);
const EASE_FILL = Easing.bezier(0.16, 0.86, 0.24, 1);

/* la nube tiene que leerse como GENTE, no como ruido: puntos grandes,
 * bien separados, y la separación crece cuando hay pocos participantes */
const dotMetrics = (count: number): {size: number; gap: number; cols: number} => {
  const size = count <= 10 ? 30 : count <= 16 ? 26 : count <= 25 ? 22 : 18;
  const cols =
    count <= 12
      ? Math.min(4, Math.max(1, count))
      : Math.min(6, Math.ceil(Math.sqrt(count * 1.1)));
  return {size, gap: size * 2, cols};
};

/* ---------------------------------------------------------- puntos (datos) */

type DotSpec = {
  cx: number;
  cy: number;
  tx: number;
  ty: number;
  bow: number;
  phase: number;
  amp: number;
  born: number;
  fly: number;
  group: 0 | 1;
  row: number;
  size: number;
};

const buildDots = (drawn: number, seed: string): DotSpec[] => {
  const nA = Math.ceil(drawn / 2);
  const out: DotSpec[] = [];

  for (let g = 0; g < 2; g++) {
    const count = g === 0 ? nA : drawn - nA;
    if (count <= 0) continue;
    const {size, gap, cols} = dotMetrics(count);
    const rows = Math.ceil(count / cols);
    const clusterX = g === 0 ? X_A : X_B;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rowCount = Math.min(cols, count - row * cols);
      const s = `${seed}-${g}-${i}`;

      // nube inicial: elipse ancha que ocupa el centro del cuadro
      const ang = random(`${s}-a`) * Math.PI * 2;
      const rad = 0.34 + 0.66 * random(`${s}-r`);

      out.push({
        cx: CX + Math.cos(ang) * rad * 500,
        cy: 400 + Math.sin(ang) * rad * 195,
        tx: clusterX + (col - (rowCount - 1) / 2) * gap,
        ty: CLUSTER_Y + (row - (rows - 1) / 2) * gap,
        bow: (random(`${s}-b`) - 0.5) * 230,
        phase: random(`${s}-p`) * Math.PI * 2,
        amp: 2.4 + random(`${s}-m`) * 4.6,
        born: random(`${s}-n`),
        fly: random(`${s}-f`),
        group: g as 0 | 1,
        row,
        size,
      });
    }
  }
  return out;
};

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

  const bow = Math.sin(q * Math.PI) * d.bow;
  const floatAmp = d.amp * (1 - 0.6 * q);
  const x =
    d.cx + (d.tx - d.cx) * q + bow * 0.34 + Math.sin(frame * 0.036 + d.phase) * floatAmp;
  const y =
    d.cy +
    (d.ty - d.cy) * q -
    Math.sin(q * Math.PI) * 54 +
    Math.cos(frame * 0.045 + d.phase * 1.7) * floatAmp;

  return {x, y, q, born};
};

/* ================================ COMPONENTE ============================== */

export const FedTrial: React.FC<FedTrialProps> = ({
  variant,
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
  const at = (a: number) => T * a;
  const holdEnd = T - FED_WHIP_F;

  /* ---- datos ----------------------------------------------------------- */
  const nSafe = Math.max(2, Math.round(n));
  const drawn = Math.min(MAX_DOTS, nSafe);
  const capped = nSafe > MAX_DOTS;
  const splitA = Math.ceil(nSafe / 2);
  const splitB = nSafe - splitA;

  const dots = React.useMemo(() => buildDots(drawn, 'fedtrial-dots'), [drawn]);

  const vA = groupA.value;
  const vB = groupB.value;
  const maxV = Math.max(Math.abs(vA), Math.abs(vB), 0.0001);
  const scaleMax = maxV * 1.14;
  const dec = maxV < 10 ? 1 : 0;

  const hexA = groupA.tone === 'good' ? accent : groupA.tone === 'bad' ? COOL_BLUE : TEAL;
  const hexB = groupB.tone === 'good' ? accent : groupB.tone === 'bad' ? COOL_BLUE : TEAL;
  const cA = toRgb(hexA);
  const cB = toRgb(hexB);
  const glowA = groupA.tone === 'good';
  const glowB = groupB.tone === 'good';
  const dimA = groupA.tone === 'bad';
  const dimB = groupB.tone === 'bad';

  const designParts = React.useMemo(
    () =>
      design
        .split(/\s*[·|]\s*/)
        .map((s) => s.trim())
        .filter(Boolean),
    [design]
  );

  /* ---- ventanas de tiempo (fracciones de T) ----------------------------- */
  const bornA = at(0.04);
  const bornB = at(0.22);
  const flyA = at(0.2);
  const flyB = at(0.48);

  const plate = interpolate(frame, [at(0.03), at(0.17)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const plateSweep = interpolate(frame, [at(0.04), at(0.28)], [0, 1], CLAMP);
  const railP = interpolate(frame, [at(0.08), at(0.28)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const axisP = interpolate(frame, [at(0.32), at(0.5)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const fillA = interpolate(frame, [at(0.36), at(0.62)], [0, 1], {
    ...CLAMP,
    easing: EASE_FILL,
  });
  const fillB = interpolate(frame, [at(0.4), at(0.66)], [0, 1], {
    ...CLAMP,
    easing: EASE_FILL,
  });

  const deltaP = interpolate(frame, [at(0.64), at(0.76)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const titleP = interpolate(frame, [at(0.26), at(0.42)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const subP = interpolate(frame, [at(0.36), at(0.52)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const vStart = at(0.7);
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

  /* ---- alturas de barra -------------------------------------------------- */
  const hA = (Math.abs(vA) / scaleMax) * BAR_H * fillA;
  const hB = (Math.abs(vB) / scaleMax) * BAR_H * fillB;
  const yTopA = BASE_Y - hA;
  const yTopB = BASE_Y - hB;
  const deltaVal = Math.abs(vA - vB);
  const deltaSuffix = groupA.suffix ?? groupB.suffix ?? '';

  /* ---- cámara ------------------------------------------------------------ */
  const push = interpolate(frame, [0, T], [1.008, 1.042], CLAMP);
  const camX = Math.sin(frame * 0.017) * 5.5;
  const camY = Math.cos(frame * 0.0225) * 4.2;
  const stageScale = (width / STAGE_W) * push;

  /* ---- partículas -------------------------------------------------------- */
  const bokeh = React.useMemo(
    () => makeMotes(6, 'fedtrial-bok', 130, 280, 0.008, 0.022, 0.038, 0.095),
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
    const a: number[] = [];
    for (let x = 80; x < STAGE_W; x += 80) a.push(x);
    return a;
  }, []);
  const hLines = React.useMemo(() => {
    const a: number[] = [];
    for (let y = 80; y < STAGE_H; y += 80) a.push(y);
    return a;
  }, []);

  /* ---- ticks de escala --------------------------------------------------- */
  const TICKS = [0, 0.25, 0.5, 0.75, 1];

  const renderAxis = (x: number, side: -1 | 1, key: string) => (
    <div key={key} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {TICKS.map((t, i) => {
        const y = BASE_Y - BAR_H * t;
        const p = interpolate(axisP, [i * 0.11, i * 0.11 + 0.5], [0, 1], CLAMP);
        const major = t === 0 || t === 1;
        const edge = x + side * (BAR_W / 2);
        const len = (major ? 30 : 18) * p;
        return (
          <React.Fragment key={t}>
            <div
              style={{
                position: 'absolute',
                left: side < 0 ? edge - len - 8 : edge + 8,
                top: y,
                width: len,
                height: 1,
                background: rgba(TEAL, major ? 0.5 : 0.28),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: side < 0 ? edge - 130 : edge + 48,
                top: y - 11,
                width: 82,
                textAlign: side < 0 ? 'right' : 'left',
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 1,
                color: rgba(TEAL, major ? 0.6 : 0.34),
                fontVariantNumeric: 'tabular-nums',
                opacity: p,
              }}
            >
              {fmt(scaleMax * t, dec)}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ---- barra ------------------------------------------------------------- */
  const renderBar = (
    g: FedTrialGroup,
    x: number,
    h: number,
    f: number,
    c: RGB,
    hex: string,
    glow: boolean,
    dim: boolean,
    realCount: number,
    key: string
  ) => {
    const yTop = BASE_Y - h;
    const shimmer = ((frame * 2.6) % 240) / 240;
    const capGlow = 0.35 + 0.35 * Math.sin(frame * 0.09 + (glow ? 0 : 1.6));
    const counter = g.value * f;
    const pop = interpolate(f, [0.88, 1], [0, 1], CLAMP);

    return (
      <React.Fragment key={key}>
        {/* halo grande detrás de la barra dorada */}
        {glow && (
          <div
            style={{
              position: 'absolute',
              left: x - 260,
              top: yTop - 200,
              width: 520,
              height: h + 400,
              background: `radial-gradient(50% 50% at 50% 50%, ${css(
                c,
                0.24 * f + 0.06 * capGlow
              )} 0%, transparent 68%)`,
              filter: 'blur(18px)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* sombra proyectada al piso */}
        <div
          style={{
            position: 'absolute',
            left: x - BAR_W * 0.85,
            top: BASE_Y - 16,
            width: BAR_W * 1.7,
            height: 46,
            borderRadius: '50%',
            background: `radial-gradient(50% 50% at 50% 50%, ${css(
              c,
              (glow ? 0.34 : 0.16) * f
            )} 0%, transparent 72%)`,
            filter: 'blur(9px)',
            pointerEvents: 'none',
          }}
        />

        {/* riel / probeta */}
        <div
          style={{
            position: 'absolute',
            left: x - BAR_W / 2,
            top: TOP_Y,
            width: BAR_W,
            height: BAR_H,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${glow ? rgba(hex, 0.32) : 'rgba(255,255,255,0.09)'}`,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.4))',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* marcas internas del riel */}
          {TICKS.slice(1, 4).map((t) => (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: BAR_H * (1 - t),
                height: 1,
                background: 'rgba(255,255,255,0.07)',
              }}
            />
          ))}

          {/* MÁSCARA DE LLENADO */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(${((1 - h / BAR_H) * 100).toFixed(3)}% 0 0 0)`,
              background: `linear-gradient(180deg, ${css(c, glow ? 1 : 0.88)} 0%, ${css(
                c,
                glow ? 0.84 : 0.66
              )} 46%, ${shade(hex, glow ? 0.52 : 0.4)} 100%)`,
              boxShadow: glow ? `0 0 48px ${css(c, 0.52)}` : `0 0 16px ${css(c, 0.18)}`,
              filter: dim ? 'saturate(0.66) brightness(0.9)' : 'none',
            }}
          >
            {/* trama diagonal en el grupo descartado */}
            {dim && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'repeating-linear-gradient(48deg, rgba(0,0,0,0.17) 0px, rgba(0,0,0,0.17) 7px, transparent 7px, transparent 20px)',
                }}
              />
            )}
            {/* shimmer recorriendo el líquido */}
            <div
              style={{
                position: 'absolute',
                left: '-30%',
                right: '-30%',
                top: `${(shimmer * 130 - 15).toFixed(1)}%`,
                height: '22%',
                background:
                  'linear-gradient(180deg, transparent, rgba(255,255,255,0.32), transparent)',
                mixBlendMode: 'screen',
                opacity: glow ? 0.7 : 0.3,
              }}
            />
            {/* brillo de vidrio */}
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 0,
                bottom: 0,
                width: 14,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.32), transparent)',
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
              left: x - BAR_W / 2 - 14,
              top: yTop - 2,
              width: BAR_W + 28,
              height: 4,
              borderRadius: 3,
              background: css(c, glow ? 1 : 0.8),
              boxShadow: `0 0 ${(glow ? 34 : 12) + capGlow * (glow ? 20 : 6)}px ${css(
                c,
                glow ? 0.9 : 0.35
              )}`,
            }}
          />
        )}

        {/* ---- CONTADOR GIGANTE (porte FedStat) ---- */}
        <div
          style={{
            position: 'absolute',
            left: x - 240,
            top: 318,
            width: 480,
            textAlign: 'center',
            opacity: interpolate(f, [0, 0.05], [0, 1], CLAMP),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 4,
              transform: `scale(${(1 + pop * 0.045).toFixed(4)})`,
              transformOrigin: '50% 100%',
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 112,
                lineHeight: 1,
                letterSpacing: '-0.035em',
                fontVariantNumeric: 'tabular-nums',
                color: glow ? '#FFF6E2' : 'rgba(206,222,240,0.86)',
                textShadow: glow
                  ? `0 0 46px ${css(c, 0.62)}, 0 0 14px ${css(
                      c,
                      0.5
                    )}, 0 6px 30px rgba(0,0,0,0.7)`
                  : '0 6px 28px rgba(0,0,0,0.8)',
              }}
            >
              {fmt(counter, dec)}
            </span>
            {g.suffix ? (
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: 50,
                  color: glow ? css(c, 1) : 'rgba(180,200,224,0.7)',
                  textShadow: glow ? `0 0 26px ${css(c, 0.55)}` : 'none',
                }}
              >
                {g.suffix}
              </span>
            ) : null}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 4.2,
              textTransform: 'uppercase',
              color: glow ? rgba(hex, 0.72) : 'rgba(214,226,240,0.4)',
            }}
          >
            {unit}
          </div>
        </div>

        {/* ---- etiqueta del grupo, bajo la barra ---- */}
        <div
          style={{
            position: 'absolute',
            left: x - 250,
            top: BASE_Y + 26,
            width: 500,
            textAlign: 'center',
            opacity: interpolate(frame, [flyB - 8, flyB + 12], [0, 1], CLAMP),
            transform: `translateY(${interpolate(
              frame,
              [flyB - 8, flyB + 12],
              [14, 0],
              CLAMP
            ).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 11,
              padding: '9px 22px',
              borderRadius: 5,
              border: `1px solid ${glow ? rgba(hex, 0.44) : 'rgba(255,255,255,0.12)'}`,
              background: glow
                ? `linear-gradient(180deg, ${rgba(hex, 0.16)}, rgba(4,7,13,0.82))`
                : 'linear-gradient(180deg, rgba(9,13,21,0.62), rgba(4,7,13,0.82))',
              boxShadow: glow ? `0 0 26px ${rgba(hex, 0.22)}` : 'none',
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: css(c, glow ? 1 : 0.6),
                boxShadow: glow ? `0 0 12px ${css(c, 0.95)}` : 'none',
              }}
            />
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: glow ? '#F7EEDC' : 'rgba(206,220,238,0.72)',
                whiteSpace: 'nowrap',
              }}
            >
              {g.label}
            </span>
          </div>
          <div
            style={{
              marginTop: 9,
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: 2.6,
              textTransform: 'uppercase',
              color: 'rgba(200,214,232,0.36)',
            }}
          >
            {`${realCount} personas`}
          </div>
        </div>
      </React.Fragment>
    );
  };

  /* ============================== RENDER ================================= */

  return (
    <>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
          {/* ---------- L0 · fondo + wash + viñeta ---------- */}
          <AbsoluteFill style={{background: moodBg(mood, accent)}} />
          <AbsoluteFill
            style={{
              background: [
                `radial-gradient(58% 50% at 50% 30%, ${rgba(TEAL, 0.1)} 0%, transparent 66%)`,
                `radial-gradient(40% 42% at ${((X_B / STAGE_W) * 100).toFixed(
                  1
                )}% 62%, ${rgba(accent, 0.12)} 0%, transparent 68%)`,
                'radial-gradient(124% 104% at 50% 46%, transparent 42%, rgba(1,3,8,0.9) 100%)',
                'linear-gradient(to bottom, rgba(2,4,10,0.6), transparent 20%, transparent 68%, rgba(2,4,10,0.82))',
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
              <line
                x1={X_A - 330}
                y1={BASE_Y}
                x2={X_B + 330}
                y2={BASE_Y}
                stroke={rgba(TEAL, 0.36)}
                strokeWidth={1.6}
                strokeDasharray="16 10"
                strokeDashoffset={-frame * 0.5}
              />
            </svg>
          </AbsoluteFill>

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${((scanY / STAGE_H) * 100).toFixed(3)}%`,
              height: 130,
              background: `linear-gradient(180deg, transparent, ${rgba(
                TEAL,
                0.05
              )} 48%, transparent)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />

          {/* ---------- L2 · bokeh ---------- */}
          <MotesLayer motes={bokeh} blur={22} scale={height / 1080} tint="150, 200, 210" />
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
              {/* ---------- L4 · ESTELAS ---------- */}
              <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
                {dots.map((d, i) => {
                  const cur = dotAt(d, frame, bornA, bornB, flyA, flyB);
                  if (cur.born <= 0.02) return null;
                  const prev = dotAt(d, frame - 4, bornA, bornB, flyA, flyB);
                  const dx = cur.x - prev.x;
                  const dy = cur.y - prev.y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  if (len < 2.4) return null;
                  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
                  const tc = mixRgb(NEUTRAL, d.group === 0 ? cA : cB, cur.q);
                  const o = Math.min(0.8, len / 30) * cur.born;
                  return (
                    <div
                      key={`tr${i}`}
                      style={{
                        position: 'absolute',
                        left: prev.x,
                        top: prev.y - d.size * 0.18,
                        width: len,
                        height: Math.max(3, d.size * 0.36),
                        transformOrigin: '0% 50%',
                        transform: `rotate(${ang.toFixed(2)}deg)`,
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${css(tc, 0)}, ${css(tc, 0.6)})`,
                        filter: 'blur(3px)',
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
                  const isB = d.group === 1;
                  const gc = isB ? cB : cA;
                  const gGlow = isB ? glowB : glowA;
                  const c = mixRgb(NEUTRAL, gc, Math.min(1, p.q * 1.25));
                  const active = isB ? fillB : fillA;
                  const pulse =
                    active > 0.02
                      ? 0.4 *
                        Math.max(0, Math.sin(frame * 0.16 - d.row * 0.7)) *
                        Math.min(1, active * 3)
                      : 0;
                  const s = d.size * (0.55 + 0.45 * p.born) * (1 + pulse * 0.24);
                  const halo = (gGlow ? 0.7 : 0.4) + 0.4 * p.q + pulse;
                  const dimmed = (isB ? dimB : dimA) ? 0.62 + 0.38 * (1 - p.q) : 1;
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
                        background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.98), ${css(
                          c,
                          0.98
                        )} 58%, ${css(c, 0.42)} 100%)`,
                        boxShadow: `0 0 ${(s * 1.7).toFixed(1)}px ${(s * 0.42).toFixed(
                          1
                        )}px ${css(c, 0.42 * halo)}`,
                        opacity: p.born * dimmed,
                      }}
                    />
                  );
                })}
              </div>

              {/* ---------- L6 · ejes con ticks ---------- */}
              {renderAxis(X_A, -1, 'axA')}
              {renderAxis(X_B, 1, 'axB')}

              {/* ---------- L7+L8 · BARRAS y CONTADORES ---------- */}
              {renderBar(groupA, X_A, hA, fillA, cA, hexA, glowA, dimA, splitA, 'A')}
              {renderBar(groupB, X_B, hB, fillB, cB, hexB, glowB, dimB, splitB, 'B')}

              {/* ---------- L9 · LLAVE DE DELTA ---------- */}
              {deltaP > 0.005 && (
                <>
                  <svg
                    style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                    width={STAGE_W}
                    height={STAGE_H}
                    viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
                  >
                    <line
                      x1={X_A + BAR_W / 2}
                      y1={yTopA}
                      x2={X_A + BAR_W / 2 + (CX - X_A - BAR_W / 2) * deltaP}
                      y2={yTopA}
                      stroke={rgba(accent, 0.55)}
                      strokeWidth={1.6}
                      strokeDasharray="8 7"
                    />
                    <line
                      x1={X_B - BAR_W / 2}
                      y1={yTopB}
                      x2={X_B - BAR_W / 2 - (X_B - BAR_W / 2 - CX) * deltaP}
                      y2={yTopB}
                      stroke={rgba(accent, 0.55)}
                      strokeWidth={1.6}
                      strokeDasharray="8 7"
                    />
                    <path
                      d={`M ${CX - 15} ${yTopA} L ${CX} ${yTopA} L ${CX} ${(
                        yTopA +
                        (yTopB - yTopA) * deltaP
                      ).toFixed(2)}${deltaP > 0.96 ? ` L ${CX - 15} ${yTopB}` : ''}`}
                      fill="none"
                      stroke={rgba(accent, 0.95)}
                      strokeWidth={3}
                      strokeLinecap="round"
                      style={{filter: `drop-shadow(0 0 10px ${rgba(accent, 0.6)})`}}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      left: CX - 190,
                      top: (yTopA + yTopB) / 2 - 52,
                      width: 380,
                      textAlign: 'center',
                      opacity: interpolate(deltaP, [0.4, 1], [0, 1], CLAMP),
                      transform: `translateY(${interpolate(
                        deltaP,
                        [0.4, 1],
                        [12, 0],
                        CLAMP
                      ).toFixed(1)}px)`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 5,
                        textTransform: 'uppercase',
                        color: rgba(accent, 0.78),
                      }}
                    >
                      diferencia
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: 62,
                        lineHeight: 1.05,
                        letterSpacing: '-0.03em',
                        color: accent,
                        textShadow: `0 0 30px ${rgba(
                          accent,
                          0.6
                        )}, 0 4px 18px rgba(0,0,0,0.85)`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fmt(deltaVal, dec)}
                      <span style={{fontSize: 34, opacity: 0.85}}>{deltaSuffix}</span>
                    </div>
                  </div>
                </>
              )}

              {/* ---------- L10a · RAIL IZQUIERDO · ficha del diseño ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: RAIL_L,
                  top: 336,
                  width: RAIL_W,
                  opacity: railP,
                  transform: `translateX(${((1 - railP) * -26).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 5.6,
                    textTransform: 'uppercase',
                    color: rgba(TEAL, 0.62),
                    marginBottom: 14,
                  }}
                >
                  diseño del estudio
                </div>
                <div
                  style={{
                    height: 1,
                    width: RAIL_W * railP,
                    background: `linear-gradient(90deg, ${rgba(TEAL, 0.45)}, transparent)`,
                    marginBottom: 18,
                  }}
                />
                {designParts.map((d, i) => {
                  const p = interpolate(
                    railP,
                    [0.3 + i * 0.14, 0.75 + i * 0.14],
                    [0, 1],
                    CLAMP
                  );
                  return (
                    <div
                      key={d}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        marginBottom: 15,
                        opacity: p,
                        transform: `translateX(${((1 - p) * -14).toFixed(1)}px)`,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          transform: 'rotate(45deg)',
                          background: rgba(accent, 0.85),
                          boxShadow: `0 0 10px ${rgba(accent, 0.55)}`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 600,
                          fontSize: 20,
                          letterSpacing: 2.4,
                          textTransform: 'uppercase',
                          color: 'rgba(226,236,246,0.78)',
                          lineHeight: 1.2,
                        }}
                      >
                        {d}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ---------- L10b · RAIL DERECHO · la N grande ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: RAIL_R,
                  top: 330,
                  width: RAIL_W,
                  textAlign: 'right',
                  opacity: railP,
                  transform: `translateX(${((1 - railP) * 26).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 5.6,
                    textTransform: 'uppercase',
                    color: rgba(TEAL, 0.62),
                    marginBottom: 6,
                  }}
                >
                  participantes
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'flex-end',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontStyle: 'italic',
                      fontSize: 46,
                      color: rgba(TEAL, 0.7),
                    }}
                  >
                    n =
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 800,
                      fontSize: 118,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: '#EAF4F2',
                      fontVariantNumeric: 'tabular-nums',
                      textShadow: `0 0 34px ${rgba(TEAL, 0.35)}, 0 6px 26px rgba(0,0,0,0.7)`,
                    }}
                  >
                    {nSafe}
                  </span>
                </div>
                <div
                  style={{
                    height: 1,
                    width: RAIL_W * railP,
                    background: `linear-gradient(90deg, transparent, ${rgba(TEAL, 0.45)})`,
                    margin: '16px 0 14px auto',
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: 18,
                    letterSpacing: 2.2,
                    textTransform: 'uppercase',
                    color: 'rgba(214,228,242,0.5)',
                  }}
                >
                  {`${splitA} · ${splitB} por grupo`}
                </div>
                {capped && (
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: 14,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: 'rgba(214,228,242,0.3)',
                    }}
                  >
                    muestra visual · 60
                  </div>
                )}
              </div>

              {/* ---------- L11a · PLACA DE FUENTE ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 52,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: plate,
                  transform: `translateY(${((1 - plate) * -20).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 22,
                    padding: '16px 40px 17px',
                    borderRadius: 6,
                    border: `1px solid ${rgba(TEAL, 0.3)}`,
                    background:
                      'linear-gradient(180deg, rgba(10,16,24,0.66), rgba(4,7,13,0.88))',
                    boxShadow: `0 22px 54px rgba(0,0,0,0.62), inset 0 0 36px ${rgba(
                      TEAL,
                      0.07
                    )}`,
                    clipPath: `inset(0 ${((1 - plate) * 50).toFixed(1)}% 0 ${(
                      (1 - plate) *
                      50
                    ).toFixed(1)}%)`,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: accent,
                      boxShadow: `0 0 14px ${rgba(accent, 0.9)}`,
                      opacity: 0.6 + 0.4 * Math.sin(frame * 0.13),
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 26,
                      letterSpacing: 5,
                      textTransform: 'uppercase',
                      color: '#EAF2F0',
                    }}
                  >
                    {journal}
                  </span>
                  <span
                    style={{width: 1, height: 26, background: 'rgba(255,255,255,0.18)'}}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 26,
                      letterSpacing: 3.4,
                      color: accent,
                    }}
                  >
                    {year}
                  </span>
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

              {/* ---------- L12 · TÍTULO + SUB (banda inferior con peso) ---------- */}
              <div
                style={{
                  position: 'absolute',
                  left: verdict ? 96 : 150,
                  width: verdict ? 1080 : STAGE_W - 300,
                  bottom: 52,
                  textAlign: verdict ? 'left' : 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 800,
                    fontSize: 58,
                    lineHeight: 1.08,
                    letterSpacing: '-0.022em',
                    color: '#F6F1E7',
                    textShadow: '0 6px 30px rgba(0,0,0,0.8)',
                    clipPath: `inset(0 ${((1 - titleP) * 100).toFixed(1)}% 0 0)`,
                    transform: `translateY(${((1 - titleP) * 18).toFixed(1)}px)`,
                    opacity: interpolate(titleP, [0, 0.1], [0, 1], CLAMP),
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: verdict ? 'flex-start' : 'center',
                    gap: 16,
                    opacity: subP,
                    transform: `translateY(${((1 - subP) * 12).toFixed(1)}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 74 * subP,
                      height: 2,
                      background: `linear-gradient(90deg, ${rgba(accent, 0.9)}, ${rgba(
                        accent,
                        0
                      )})`,
                      boxShadow: `0 0 12px ${rgba(accent, 0.5)}`,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: FONT_SERIF,
                      fontStyle: 'italic',
                      fontSize: 31,
                      color: 'rgba(234,228,216,0.76)',
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </div>

              {/* ---------- L11b · VEREDICTO estampado ---------- */}
              {verdict && vIn > 0.001 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 1372,
                    bottom: 54,
                    width: 476,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    opacity: Math.min(vIn, 1) * Math.min(1, (holdEnd + 6 - frame) / 6),
                    transform: [
                      `translateY(${interpolate(vSpring, [0, 1], [30, 0], CLAMP).toFixed(
                        1
                      )}px)`,
                      `rotate(${interpolate(vSpring, [0, 1], [-9, -2.2], CLAMP).toFixed(
                        2
                      )}deg)`,
                      `scale(${interpolate(vSpring, [0, 1], [1.5, 1], CLAMP).toFixed(4)})`,
                    ].join(' '),
                    transformOrigin: '70% 50%',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      padding: '20px 28px 22px',
                      borderRadius: 7,
                      border: `2px solid ${rgba(accent, 0.66)}`,
                      background:
                        'linear-gradient(180deg, rgba(14,19,29,0.78), rgba(4,7,13,0.92))',
                      boxShadow: `0 28px 68px rgba(0,0,0,0.7), 0 0 ${(
                        28 +
                        stampFlash * 52
                      ).toFixed(0)}px ${rgba(accent, 0.26 + stampFlash * 0.42)}`,
                      textAlign: 'right',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 6.5,
                        textTransform: 'uppercase',
                        color: rgba(accent, 0.85),
                        marginBottom: 10,
                      }}
                    >
                      resultado
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: 34,
                        lineHeight: 1.15,
                        letterSpacing: '-0.015em',
                        color: '#F9F3E8',
                        textShadow: '0 4px 22px rgba(0,0,0,0.8)',
                      }}
                    >
                      {verdict}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: 10,
                        border: `2px solid ${rgba(accent, stampFlash * 0.7)}`,
                        transform: `scale(${(1 + stampFlash * 0.08).toFixed(4)})`,
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </AbsoluteFill>

          {/* ---------- bokeh de primer plano fuera de foco ---------- */}
          <AbsoluteFill style={{filter: 'blur(20px)', opacity: 0.4, pointerEvents: 'none'}}>
            <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="235, 214, 168" />
          </AbsoluteFill>
        </AbsoluteFill>
      </TransitionShell>

      <GrainOverlay />
    </>
  );
};

export default FedTrial;
