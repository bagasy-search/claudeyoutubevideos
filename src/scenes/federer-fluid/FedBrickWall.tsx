/**
 * ============================================================================
 * FED_BRICKWALL — "La pared de ladrillos" · kit dark-cinematic Dr. Federer
 * ----------------------------------------------------------------------------
 * El mecanismo central del video: la barrera de la piel es una pared.
 *   · LADRILLOS  = células muertas (corneocitos)
 *   · CEMENTO    = las grasas de la barrera (ceramidas / colesterol / ác. grasos)
 *   Cemento bien armado → el agua se queda adentro.  Cemento roto → filtra.
 *
 * CAPAS (estilo After Effects, todo procedural, sin un solo asset externo):
 *   L0  fondo por mood + wash de acento + viñeta + halo detrás de la pared
 *   L1  bokeh grande desenfocado de fondo
 *   L2  polvo en suspensión (MotesLayer)
 *   L3  PARED 3D en perspective — cada ladrillo su div, textura procedural
 *       seeded, sombra interior, bisel de luz superior, relieve por translateZ
 *   L4  cemento en las juntas — recess oscuro + relleno enmascarado (scaleY
 *       desde abajo / scaleX en las horizontales) + cabeza "húmeda" con glow
 *   L5  agua: gotas que impactan y se quedan (sealed) · vapor que se fuga
 *       con estela por las juntas faltantes (leaking)
 *   L6  barrido de luz cálida sobre la pared
 *   L7  bokeh de primer plano fuera de foco
 *   L8  callouts con leader-line SVG (ladrillo / cemento)
 *   L9  placa de título + leyenda de las 3 grasas con su porcentaje
 *   L10 GrainOverlay (fuera del shell)
 *
 * 1920×1080 @ 30fps. Determinista: random('semilla'), nunca Math.random().
 * ============================================================================
 */

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
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  MotesLayer,
  TransitionShell,
  makeMotes,
  moodBg,
  rgba,
  shade,
  type FedMood,

  type FedTransitionVariant,
} from '../../FedererKit';

/* ============================== CONTRATO ================================= */

export type FedBrickWallProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  state?: 'build' | 'sealed' | 'leaking';
  title?: string;
  sub?: string;
  legend?: {label: string; pct: string}[];
  brickLabel?: string;
  cementLabel?: string;
};

/* ============================ GEOMETRÍA DE LA PARED ====================== */

const BRICK_W = 262;
const BRICK_H = 112;
const GAP = 15;
const COLS = 6;
const ROWS = 5;
const COL_PITCH = BRICK_W + GAP;
const ROW_PITCH = BRICK_H + GAP;
const WALL_W = COLS * BRICK_W + (COLS - 1) * GAP; // 1647
const WALL_H = ROWS * BRICK_H + (ROWS - 1) * GAP; // 620
const MAX_ORDER = (ROWS - 1) * 7 + 6;

type Brick = {
  id: string;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  order: number;
};

type Joint = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  horiz: boolean;
  cx: number;
  cy: number;
};

const buildBricks = (): Brick[] => {
  const out: Brick[] = [];
  for (let r = 0; r < ROWS; r++) {
    const y = r * ROW_PITCH;
    const offset = r % 2 === 1;
    const n = offset ? COLS + 1 : COLS;
    for (let c = 0; c < n; c++) {
      let x = offset ? c * COL_PITCH - COL_PITCH / 2 : c * COL_PITCH;
      let w = BRICK_W;
      if (x < 0) {
        w = BRICK_W + x;
        x = 0;
      }
      if (x + w > WALL_W) w = WALL_W - x;
      if (w < 10) continue;
      out.push({
        id: `b${r}-${c}`,
        row: r,
        x,
        y,
        w,
        h: BRICK_H,
        // se levanta como una pared de verdad: desde la hilada de abajo
        order: (ROWS - 1 - r) * 7 + c,
      });
    }
  }
  return out;
};

const buildJoints = (bricks: Brick[]): Joint[] => {
  const out: Joint[] = [];
  // juntas horizontales (tendel)
  for (let r = 1; r < ROWS; r++) {
    const y = r * ROW_PITCH - GAP;
    out.push({
      id: `jh${r}`,
      x: 0,
      y,
      w: WALL_W,
      h: GAP,
      horiz: true,
      cx: WALL_W / 2,
      cy: y + GAP / 2,
    });
  }
  // juntas verticales (llaga), entre ladrillos consecutivos de cada hilada
  for (let r = 0; r < ROWS; r++) {
    const row = bricks.filter((b) => b.row === r).sort((a, b) => a.x - b.x);
    for (let i = 0; i < row.length - 1; i++) {
      const a = row[i];
      const x = a.x + a.w;
      out.push({
        id: `jv${r}-${i}`,
        x,
        y: a.y,
        w: GAP,
        h: BRICK_H,
        horiz: false,
        cx: x + GAP / 2,
        cy: a.y + BRICK_H / 2,
      });
    }
  }
  return out;
};

/* =========================== TEXTURA PROCEDURAL ========================== */

/** manchas seeded sobre la cara del ladrillo: poros, veta, desgaste */
const brickFaces = (seed: string): string => {
  const parts: string[] = [];
  for (let k = 0; k < 8; k++) {
    const x = random(`${seed}-tx${k}`) * 100;
    const y = random(`${seed}-ty${k}`) * 100;
    const rr = 4 + random(`${seed}-tr${k}`) * 22;
    const a = 0.035 + random(`${seed}-ta${k}`) * 0.095;
    const dark = random(`${seed}-td${k}`) > 0.44;
    parts.push(
      `radial-gradient(${rr.toFixed(1)}% ${(rr * 1.75).toFixed(1)}% at ${x.toFixed(
        1
      )}% ${y.toFixed(1)}%, rgba(${dark ? '0, 0, 0' : '255, 226, 184'}, ${a.toFixed(
        3
      )}) 0%, transparent 72%)`
    );
  }
  return parts.join(', ');
};

/* =============================== LADRILLO ================================ */

const BrickCell: React.FC<{
  brick: Brick;
  accent: string;
  fly: boolean;
  flySpan: number;
  dim: number; // 0 = normal, 1 = apagado (leaking)
}> = ({brick, accent, fly, flySpan, dim}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const delay = fly ? (brick.order / MAX_ORDER) * flySpan : 0;
  const s = fly
    ? spring({
        frame: frame - delay,
        fps,
        config: {damping: 17, mass: 0.85, stiffness: 105},
      })
    : interpolate(frame, [0, 14], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const inv = 1 - s;

  // dirección de entrada seeded: por los costados o desde arriba
  const ds = random(`bwdir-${brick.id}`);
  const fromX = ds < 0.42 ? -1 : ds < 0.84 ? 1 : 0;
  const fromY = fromX === 0 ? -1.15 : (random(`bwdy-${brick.id}`) - 0.5) * 0.9;
  const spin = (random(`bwsp-${brick.id}`) - 0.5) * 52;

  // relieve: cada ladrillo sobresale distinto + respiración mínima
  const zJit = (random(`bwz-${brick.id}`) - 0.35) * 13;
  const breathe = Math.sin(frame * 0.021 + brick.order * 0.7) * 1.2;

  // color base seeded (arcilla oscura cálida)
  const tone = 0.66 + random(`bwt-${brick.id}`) * 0.62;
  const base = shade('#2B2016', tone);
  const lit = shade('#54402A', tone);
  const dark = shade('#0C0806', tone);

  const faces = React.useMemo(() => brickFaces(`bwf-${brick.id}`), [brick.id]);

  // brillo dorado que devuelve el ladrillo cuando el cemento ya está puesto
  const warm = 0.06 + 0.08 * Math.sin(frame * 0.03 + brick.order * 0.42);

  return (
    <div
      style={{
        position: 'absolute',
        left: brick.x,
        top: brick.y,
        width: brick.w,
        height: brick.h,
        transformStyle: 'preserve-3d',
        transform: [
          `translate3d(${(inv * fromX * 1560).toFixed(1)}px, ${(inv * fromY * 860).toFixed(
            1
          )}px, ${(zJit + breathe + inv * 460).toFixed(1)}px)`,
          `rotateZ(${(inv * spin).toFixed(2)}deg)`,
          `rotateX(${(inv * 26).toFixed(2)}deg)`,
          `scale(${(1 - inv * 0.12).toFixed(4)})`,
        ].join(' '),
        opacity: Math.min(1, s * 2.4),
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 4,
          background: [
            faces,
            `linear-gradient(158deg, ${lit} 0%, ${base} 42%, ${dark} 100%)`,
          ].join(', '),
          boxShadow: [
            'inset 0 1.5px 0 rgba(255, 232, 192, 0.19)', // bisel de luz superior
            'inset 1.5px 0 0 rgba(255, 226, 180, 0.07)',
            'inset 0 -3px 9px rgba(0, 0, 0, 0.62)', // sombra interior
            'inset -3px 0 8px rgba(0, 0, 0, 0.44)',
            '0 8px 22px rgba(0, 0, 0, 0.55)',
            `0 0 26px ${rgba(accent, (0.11 + warm * 0.5) * (1 - dim * 0.75))}`,
          ].join(', '),
          filter: `blur(${(inv * 13).toFixed(2)}px) brightness(${(
            (0.94 + s * 0.12) *
            (1 - dim * 0.26)
          ).toFixed(3)}) saturate(${(1 - dim * 0.44).toFixed(3)})`,
        }}
      >
        {/* wash cálido que baja desde el borde superior iluminado */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            background: `linear-gradient(to bottom, ${rgba(
              accent,
              (0.07 + warm * 0.55) * (1 - dim * 0.8)
            )} 0%, transparent 26%, transparent 64%, rgba(0,0,0,0.55) 100%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

/* ============================ JUNTA DE CEMENTO =========================== */

const CementJoint: React.FC<{
  joint: Joint;
  accent: string;
  fill: number; // 0..1
  missing: boolean;
  dim: number;
}> = ({joint, accent, fill, missing, dim}) => {
  const frame = useCurrentFrame();

  const pulse = 0.72 + 0.28 * Math.sin(frame * 0.052 + joint.cy * 0.02);
  // en 'leaking' el cemento que queda titila / está apagado
  const flick = dim > 0 ? 0.55 + 0.45 * random(`bwfl-${joint.id}-${Math.floor(frame / 5)}`) : 1;
  const glow = missing ? 0 : fill * pulse * (1 - dim * 0.62) * flick;

  const grow = joint.horiz
    ? `scaleX(${Math.max(0.001, fill).toFixed(4)})`
    : `scaleY(${Math.max(0.001, fill).toFixed(4)})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: joint.x,
        top: joint.y,
        width: joint.w,
        height: joint.h,
        borderRadius: 2,
        overflow: 'hidden',
        // el hueco: recess oscuro, siempre visible debajo del cemento
        background: missing
          ? 'linear-gradient(180deg, #000103 0%, #01030a 46%, #000102 100%)'
          : 'linear-gradient(180deg, #07090f 0%, #0c0e15 50%, #05070c 100%)',
        boxShadow: missing
          ? `inset 0 0 14px rgba(0,0,0,1), inset 0 3px 6px rgba(0,0,0,1), inset 0 -1px 0 ${rgba(
              COOL_BLUE,
              0.16
            )}, 0 0 16px rgba(0,0,0,0.9)`
          : 'inset 0 0 7px rgba(0,0,0,0.9)',
      }}
    >
      {/* boca del hueco: filo frío, la barrera abierta */}
      {missing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${
              joint.horiz ? '180deg' : '90deg'
            }, ${rgba(COOL_BLUE, 0.2)} 0%, transparent 34%, transparent 66%, ${rgba(
              COOL_BLUE,
              0.12
            )} 100%)`,
            filter: `blur(1px) brightness(${(0.7 + 0.5 * pulse).toFixed(2)})`,
            mixBlendMode: 'screen',
          }}
        />
      )}
      {/* relleno de cemento (máscara animada) */}
      {!missing && fill > 0.002 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: joint.horiz ? 'left center' : 'center bottom',
            transform: grow,
            background: joint.horiz
              ? `linear-gradient(180deg, ${rgba('#F6DFAA', 0.66)} 0%, ${shade(
                  accent,
                  0.86
                )} 40%, ${shade(accent, 0.3)} 100%)`
              : `linear-gradient(90deg, ${shade(accent, 0.32)} 0%, ${shade(
                  accent,
                  0.84
                )} 46%, ${rgba('#F6DFAA', 0.6)} 100%)`,
            filter: `brightness(${(0.4 + 0.52 * glow).toFixed(3)}) saturate(${(
              0.5 +
              0.42 * (1 - dim)
            ).toFixed(3)})`,
            boxShadow: `0 0 ${(6 + 10 * glow).toFixed(1)}px ${rgba(
              accent,
              0.16 + 0.26 * glow
            )}, inset 0 0 4px rgba(255, 246, 216, ${(0.2 * glow).toFixed(
              3
            )}), inset 0 1px 2px rgba(0,0,0,0.4)`,
          }}
        />
      )}

      {/* cabeza "húmeda" del vertido: banda brillante en el frente del relleno */}
      {!missing && fill > 0.02 && fill < 0.985 && (
        <div
          style={{
            position: 'absolute',
            ...(joint.horiz
              ? {
                  top: 0,
                  bottom: 0,
                  left: `${(fill * 100).toFixed(2)}%`,
                  width: 26,
                  marginLeft: -18,
                  background: `linear-gradient(90deg, transparent, ${rgba('#FFF6DC', 0.95)})`,
                }
              : {
                  left: 0,
                  right: 0,
                  bottom: `${(fill * 100).toFixed(2)}%`,
                  height: 22,
                  marginBottom: -16,
                  background: `linear-gradient(0deg, transparent, ${rgba('#FFF6DC', 0.95)})`,
                }),
            filter: 'blur(2.2px)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

/* =============================== AGUA ==================================== */

type Drop = {
  x: number;
  y: number;
  delay: number;
  size: number;
  slide: number;
  ph: number;
};

const makeDrops = (n: number, seed: string): Drop[] =>
  new Array(n).fill(0).map((_, i) => ({
    x: 5 + random(`${seed}-x${i}`) * 89,
    y: 7 + random(`${seed}-y${i}`) * 80,
    delay: Math.round(random(`${seed}-d${i}`) * 76),
    size: 15 + random(`${seed}-s${i}`) * 27,
    slide: random(`${seed}-sl${i}`) > 0.7 ? 40 + random(`${seed}-sd${i}`) * 95 : 0,
    ph: random(`${seed}-p${i}`) * Math.PI * 2,
  }));

const WaterBead: React.FC<{drop: Drop}> = ({drop}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const t = frame - drop.delay;
  if (t < -2) return null;

  const s = spring({frame: t, fps, config: {damping: 13, mass: 0.5, stiffness: 150}});
  const inv = 1 - s;

  // impacto: llega desde adentro (Z+) y rebota contra la cara interna
  const imp = interpolate(t, [0, 7, 26], [0, 1, 0], CLAMP);
  const squash = 1 + imp * 0.32;
  const slideY = drop.slide
    ? drop.slide * interpolate(t, [14, 14 + 96], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)})
    : 0;
  const jig = Math.sin(frame * 0.09 + drop.ph) * 0.9;
  const sz = drop.size;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${drop.x}%`,
        top: `${drop.y}%`,
        width: sz,
        height: sz,
        marginLeft: -sz / 2,
        marginTop: -sz / 2,
        transform: `translate3d(${jig.toFixed(2)}px, ${slideY.toFixed(1)}px, ${(
          34 +
          inv * 300
        ).toFixed(1)}px) scale(${(1 + inv * 0.95).toFixed(3)})`,
        opacity: interpolate(t, [0, 5], [0, 1], CLAMP),
        filter: `blur(${(inv * 8).toFixed(2)}px)`,
        willChange: 'transform, opacity',
      }}
    >
      {/* estela del reguero cuando la gota se desliza */}
      {drop.slide > 0 && slideY > 3 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '58%',
            width: sz * 0.34,
            height: slideY,
            marginLeft: -sz * 0.17,
            borderRadius: sz,
            background: `linear-gradient(0deg, ${rgba(COOL_BLUE, 0.34)}, transparent)`,
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* onda del impacto */}
      {imp > 0.02 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${rgba('#DCEBFF', 0.55 * imp)}`,
            transform: `scale(${(1 + (1 - imp) * 2.6).toFixed(3)})`,
            opacity: imp,
            filter: 'blur(0.6px)',
          }}
        />
      )}

      {/* la perla */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          transform: `scale(${squash.toFixed(3)}, ${(2 - squash).toFixed(3)})`,
          background: [
            'radial-gradient(30% 24% at 32% 24%, rgba(255,255,255,0.98) 0%, rgba(220,238,255,0.35) 34%, transparent 62%)',
            `radial-gradient(circle at 54% 62%, ${rgba(COOL_BLUE, 0.24)} 0%, ${rgba(
              COOL_BLUE,
              0.09
            )} 56%, transparent 76%)`,
          ].join(', '),
          boxShadow: [
            `inset 0 -${(sz * 0.3).toFixed(0)}px ${(sz * 0.42).toFixed(
              0
            )}px rgba(255,255,255,0.26)`,
            `inset 0 ${(sz * 0.1).toFixed(0)}px ${(sz * 0.22).toFixed(0)}px rgba(8,14,26,0.2)`,
            `inset 0 0 0 1px ${rgba('#DCEBFF', 0.18)}`,
            '0 4px 11px rgba(0,0,0,0.42)',
            `0 0 ${(sz * 1.05).toFixed(0)}px ${rgba(COOL_BLUE, 0.22)}`,
          ].join(', '),
        }}
      />
    </div>
  );
};

type Vapor = {x: number; y: number; speed: number; off: number; size: number; ph: number};

const VaporWisp: React.FC<{v: Vapor; accent: string}> = ({v, accent}) => {
  const frame = useCurrentFrame();
  const PER = 78;
  const t = (((frame * v.speed + v.off) % PER) + PER) % PER;
  const p = t / PER;

  const y = v.y - p * 372;
  const x = v.x + Math.sin(p * 5.6 + v.ph) * 34 * p;
  const op = Math.sin(p * Math.PI) * 0.85;
  const sz = v.size * (0.4 + p * 1.75);
  const bl = 1.8 + p * 9;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: sz,
        height: sz,
        marginLeft: -sz / 2,
        marginTop: -sz / 2,
        transform: `translateZ(${(46 + p * 90).toFixed(1)}px)`,
        opacity: op,
        willChange: 'transform, opacity',
      }}
    >
      {/* estela */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: sz * 0.5,
          height: 92 * p,
          marginLeft: -sz * 0.25,
          borderRadius: sz,
          background: `linear-gradient(0deg, transparent, ${rgba(COOL_BLUE, 0.3)} 55%, ${rgba(
            '#FFFFFF',
            0.18
          )})`,
          filter: `blur(${(bl * 0.8).toFixed(1)}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 44% 40%, rgba(236,246,255,0.85) 0%, ${rgba(
            COOL_BLUE,
            0.34
          )} 46%, transparent 74%)`,
          filter: `blur(${bl.toFixed(1)}px)`,
          boxShadow: `0 0 ${(sz * 1.3).toFixed(0)}px ${rgba(accent, 0.1)}`,
        }}
      />
    </div>
  );
};

/* ============================== CALLOUT ================================== */

const Callout: React.FC<{
  label: string;
  kicker: string;
  accent: string;
  side: 'left' | 'right';
  txPct: number;
  tyPct: number;
  axPct: number;
  ayPct: number;
  delay: number;
}> = ({label, kicker, accent, side, txPct, tyPct, axPct, ayPct, delay}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const s = spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 95, mass: 0.9}});
  if (s < 0.001) return null;

  const line = interpolate(s, [0.1, 0.85], [0, 1], CLAMP);
  const TXpx = side === 'left' ? (txPct * width) / 100 : width - (txPct * width) / 100;
  const TYpx = (tyPct * height) / 100;
  const startX = TXpx + (side === 'left' ? 4 : -4);
  const startY = TYpx + 46;
  const elbowX = startX + (side === 'left' ? 74 : -74);
  const AX = (axPct * width) / 100;
  const AY = (ayPct * height) / 100;
  const len = 74 + Math.hypot(AX - elbowX, AY - startY);
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.11);

  return (
    <>
      <svg
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      >
        <path
          d={`M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${elbowX.toFixed(
            1
          )} ${startY.toFixed(1)} L ${AX.toFixed(1)} ${AY.toFixed(1)}`}
          fill="none"
          stroke={rgba(accent, 0.72)}
          strokeWidth={1.6}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - line)}
        />
        <circle
          cx={AX}
          cy={AY}
          r={4.5}
          fill={accent}
          opacity={line}
          style={{filter: `drop-shadow(0 0 ${(7 * pulse).toFixed(1)}px ${rgba(accent, 0.9)})`}}
        />
        <circle
          cx={AX}
          cy={AY}
          r={4.5 + 9 * pulse}
          fill="none"
          stroke={rgba(accent, 0.3 * (1 - pulse))}
          strokeWidth={1.2}
          opacity={line}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: TYpx,
          ...(side === 'left' ? {left: TXpx} : {right: (txPct * width) / 100}),
          textAlign: side === 'left' ? 'left' : 'right',
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [14, 0], CLAMP).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            letterSpacing: 6,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: rgba(accent, 0.85),
            marginBottom: 6,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: '#F2ECE1',
            textShadow: '0 3px 18px rgba(0,0,0,0.9)',
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};

/* ============================== ESCENA =================================== */

const DEFAULT_LEGEND: {label: string; pct: string}[] = [
  {label: 'Ceramidas', pct: '50%'},
  {label: 'Colesterol', pct: '25%'},
  {label: 'Ácidos grasos', pct: '25%'},
];

export const FedBrickWall: React.FC<FedBrickWallProps> = ({
  variant,
  totalF,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  state = 'build',
  title = 'Su piel es una pared',
  sub = 'Ladrillos de células muertas, unidos por un cemento de grasa',
  legend = DEFAULT_LEGEND,
  brickLabel = 'Células muertas',
  cementLabel = 'Cemento de grasa',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const dur = totalF ?? FED_SCENE_F;
  const S = height / 1080;

  const bricks = React.useMemo(() => buildBricks(), []);
  const joints = React.useMemo(() => buildJoints(bricks), [bricks]);

  const missing = React.useMemo(() => {
    const set = new Set<string>();
    if (state !== 'leaking') return set;
    joints.forEach((j) => {
      if (random(`bw-miss-${j.id}`) > 0.74) set.add(j.id);
    });
    // garantía: al menos 3 huecos, pase lo que pase con la semilla
    if (set.size < 3) {
      joints.slice(0, joints.length).forEach((j, i) => {
        if (set.size < 3 && i % 7 === 3) set.add(j.id);
      });
    }
    return set;
  }, [state, joints]);

  const isBuild = state === 'build';
  const isLeak = state === 'leaking';
  const dim = isLeak ? 1 : 0;

  /* --- tiempos ---------------------------------------------------------- */
  const flySpan = dur * 0.3;
  const cemS = Math.round(dur * 0.36);
  const cemE = Math.round(dur * 0.76);
  const cementP = isBuild
    ? interpolate(frame, [cemS, cemE], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
    : interpolate(frame, [0, 16], [0.6, 1], CLAMP);

  const jointFill = (j: Joint): number => {
    const fromBottom = 1 - j.cy / WALL_H; // 0 abajo · 1 arriba
    const start = fromBottom * 0.7;
    return interpolate(cementP, [start, start + 0.3], [0, 1], CLAMP);
  };

  /* --- cámara ----------------------------------------------------------- */
  const push = interpolate(frame, [0, dur], [1, 1.075], CLAMP);
  const hx = Math.sin(frame * 0.0185) * width * 0.0022 + Math.sin(frame * 0.061) * 1.6;
  const hy = Math.cos(frame * 0.0247) * height * 0.0018 + Math.cos(frame * 0.053) * 1.3;
  const ry = -8.5 + Math.sin(frame * 0.0141) * 1.9 + interpolate(frame, [0, dur], [2.6, 0], CLAMP);
  const rx = 3.2 + Math.cos(frame * 0.0119) * 0.9;

  /* --- partículas ------------------------------------------------------- */
  const bokehBack = React.useMemo(
    () => makeMotes(5, 'bw-bok-back', 150, 300, 0.008, 0.02, 0.05, 0.11),
    []
  );
  const dust = React.useMemo(() => makeMotes(20, 'bw-dust', 2, 8, 0.04, 0.1, 0.1, 0.3), []);
  const bokehFront = React.useMemo(
    () => makeMotes(4, 'bw-bok-front', 120, 260, 0.014, 0.03, 0.04, 0.09),
    []
  );

  const drops = React.useMemo(() => makeDrops(15, 'bw-drop'), []);

  const vapors = React.useMemo<Vapor[]>(() => {
    if (state !== 'leaking') return [];
    const out: Vapor[] = [];
    joints
      .filter((j) => missing.has(j.id))
      .forEach((j, k) => {
        for (let i = 0; i < 3; i++) {
          const sd = `bw-vap-${j.id}-${i}`;
          out.push({
            x: j.cx + (random(`${sd}-x`) - 0.5) * (j.horiz ? 150 : j.w * 2.4),
            y: j.cy,
            speed: 0.72 + random(`${sd}-sp`) * 0.6,
            off: random(`${sd}-o`) * 78 + k * 11,
            size: 20 + random(`${sd}-s`) * 24,
            ph: random(`${sd}-ph`) * Math.PI * 2,
          });
        }
      });
    return out;
  }, [state, joints, missing]);

  /* --- textos ----------------------------------------------------------- */
  const statusText = isBuild
    ? 'Cómo se construye la barrera'
    : isLeak
    ? 'Barrera rota · la piel filtra'
    : 'Barrera sellada · el agua se queda';

  const plateIn = spring({
    frame: frame - Math.round(dur * 0.16),
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.9},
  });
  const legendIn = spring({
    frame: frame - Math.round(dur * 0.44),
    fps,
    config: {damping: 21, stiffness: 95, mass: 0.95},
  });

  // barrido de luz cálida que cruza la pared una vez por escena
  const sweepP = interpolate(frame, [dur * 0.44, dur * 0.9], [0, 1], CLAMP);
  const sweepA = Math.sin(sweepP * Math.PI);

  const chip = [accent, shade(accent, 0.76), shade(accent, 0.55)];

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        {/* ---------- L0 · fondo por mood + wash + viñeta ------------------ */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(46% 42% at 50% 47%, ${rgba(
                accent,
                isLeak ? 0.08 : 0.2
              )} 0%, transparent 68%)`,
              isLeak
                ? `radial-gradient(60% 50% at 50% 44%, ${rgba(COOL_BLUE, 0.09)} 0%, transparent 70%)`
                : 'linear-gradient(transparent, transparent)',
              'radial-gradient(122% 100% at 50% 46%, transparent 40%, rgba(1,2,6,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,3,8,0.5), transparent 22%, transparent 62%, rgba(1,2,6,0.82))',
            ].join(', '),
          }}
        />

        {/* ---------- L1 · bokeh grande de fondo --------------------------- */}
        <AbsoluteFill style={{filter: 'blur(26px)', opacity: 0.75}}>
          <MotesLayer motes={bokehBack} blur={0} scale={S} tint="236, 198, 132" />
        </AbsoluteFill>

        {/* ---------- L2 · polvo ------------------------------------------ */}
        <MotesLayer motes={dust} blur={1.3} scale={S} tint="238, 214, 168" />

        {/* ---------- L3/L4/L5 · la pared 3D ------------------------------ */}
        <AbsoluteFill
          style={{
            perspective: 2150,
            perspectiveOrigin: '50% 44%',
            transform: `translate(${hx.toFixed(1)}px, ${hy.toFixed(1)}px)`,
          }}
        >
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: WALL_W,
                height: WALL_H,
                transformStyle: 'preserve-3d',
                transform: [
                  `scale(${(S * 0.855 * push).toFixed(4)})`,
                  `translateY(${(-height * 0.055).toFixed(1)}px)`,
                  `rotateX(${rx.toFixed(2)}deg)`,
                  `rotateY(${ry.toFixed(2)}deg)`,
                ].join(' '),
                willChange: 'transform',
              }}
            >
              {/* sombra proyectada / masa de la pared, bien atrás */}
              <div
                style={{
                  position: 'absolute',
                  inset: -26,
                  transform: 'translateZ(-58px)',
                  background:
                    'radial-gradient(62% 58% at 50% 52%, rgba(10,7,4,0.96) 0%, rgba(3,4,8,0.75) 62%, transparent 100%)',
                  filter: 'blur(16px)',
                }}
              />

              {/* L4 · juntas de cemento (recess, detrás de los ladrillos) */}
              <div style={{position: 'absolute', inset: 0, transform: 'translateZ(-10px)'}}>
                {joints.map((j) => (
                  <CementJoint
                    key={j.id}
                    joint={j}
                    accent={accent}
                    fill={missing.has(j.id) ? 0 : jointFill(j)}
                    missing={missing.has(j.id)}
                    dim={dim}
                  />
                ))}
              </div>

              {/* L3 · ladrillos */}
              {bricks.map((b) => (
                <BrickCell
                  key={b.id}
                  brick={b}
                  accent={accent}
                  fly={isBuild}
                  flySpan={flySpan}
                  dim={dim}
                />
              ))}

              {/* L5a · gotas de agua que rebotan y se quedan (sellada) */}
              {state === 'sealed' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                  }}
                >
                  {drops.map((d, i) => (
                    <WaterBead key={i} drop={d} />
                  ))}
                </div>
              )}

              {/* L5b · vapor que se fuga por las juntas faltantes */}
              {isLeak && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                  }}
                >
                  {vapors.map((v, i) => (
                    <VaporWisp key={i} v={v} accent={accent} />
                  ))}
                </div>
              )}

              {/* L6 · barrido de luz cálida sobre la pared */}
              {sweepA > 0.01 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -90,
                    bottom: -90,
                    left: 0,
                    width: '38%',
                    transform: `translateZ(24px) translateX(${interpolate(
                      sweepP,
                      [0, 1],
                      [-60, 220],
                      CLAMP
                    ).toFixed(1)}%) skewX(-15deg)`,
                    background: `linear-gradient(100deg, transparent 18%, ${rgba(
                      accent,
                      isLeak ? 0.16 : 0.4
                    )} 50%, transparent 82%)`,
                    mixBlendMode: 'screen',
                    opacity: sweepA * 0.9,
                    filter: 'blur(6px)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* ---------- glow de las juntas visto de lejos (bloom) ------------ */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(40% 34% at 50% 45%, ${rgba(
              accent,
              (isLeak ? 0.05 : 0.13) * (0.6 + 0.4 * cementP)
            )} 0%, transparent 72%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* ---------- L7 · bokeh de primer plano fuera de foco -------------- */}
        <AbsoluteFill style={{filter: 'blur(19px)', opacity: 0.55, pointerEvents: 'none'}}>
          <MotesLayer motes={bokehFront} blur={0} scale={S} tint="247, 218, 168" />
        </AbsoluteFill>

        {/* ---------- L8 · callouts ---------------------------------------- */}
        <Callout
          label={brickLabel}
          kicker="Ladrillo"
          accent={accent}
          side="left"
          txPct={6.5}
          tyPct={13}
          axPct={31}
          ayPct={35}
          delay={Math.round(dur * 0.2)}
        />
        <Callout
          label={cementLabel}
          kicker="Junta"
          accent={accent}
          side="right"
          txPct={6.5}
          tyPct={22}
          axPct={68}
          ayPct={53}
          delay={Math.round(dur * 0.46)}
        />

        {/* ---------- L9 · placa de título + leyenda ------------------------ */}
        <div
          style={{
            position: 'absolute',
            left: width * 0.065,
            bottom: height * 0.085,
            maxWidth: width * 0.5,
            opacity: interpolate(plateIn, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${interpolate(plateIn, [0, 1], [30, 0], CLAMP).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 13,
            }}
          >
            <div
              style={{
                width: interpolate(plateIn, [0, 1], [0, 54], CLAMP),
                height: 3,
                background: accent,
                borderRadius: 2,
                boxShadow: `0 0 15px ${rgba(accent, 0.75)}`,
              }}
            />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 14,
                letterSpacing: 7,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: isLeak ? rgba(COOL_BLUE, 0.95) : rgba(accent, 0.95),
                textShadow: '0 2px 14px rgba(0,0,0,0.9)',
              }}
            >
              {statusText}
            </div>
          </div>

          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.05,
              color: '#F5F0E6',
              textShadow: '0 5px 30px rgba(0,0,0,0.9)',
            }}
          >
            {title}
          </div>

          {sub && (
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 27,
                lineHeight: 1.34,
                color: 'rgba(233,225,211,0.76)',
                marginTop: 12,
                textShadow: '0 3px 18px rgba(0,0,0,0.85)',
              }}
            >
              {sub}
            </div>
          )}
        </div>

        {/* leyenda de las 3 grasas */}
        {legend.length > 0 && (
          <div
            style={{
              position: 'absolute',
              right: width * 0.065,
              bottom: height * 0.095,
              width: 330,
              opacity: interpolate(legendIn, [0, 0.3], [0, 1], CLAMP),
              transform: `translateY(${interpolate(legendIn, [0, 1], [24, 0], CLAMP).toFixed(
                1
              )}px)`,
              padding: '20px 24px 18px',
              borderRadius: 6,
              background: 'linear-gradient(180deg, rgba(9,12,19,0.6), rgba(3,5,10,0.86))',
              border: `1px solid ${rgba(accent, 0.26)}`,
              boxShadow: '0 24px 62px rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 12,
                letterSpacing: 6,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: rgba(accent, 0.8),
                marginBottom: 15,
              }}
            >
              {cementLabel}
            </div>
            {legend.map((l, i) => {
              const pv = Math.max(0, Math.min(100, Number.parseFloat(l.pct) || 0));
              const bar = interpolate(
                legendIn,
                [0.18 + i * 0.16, 0.72 + i * 0.16],
                [0, 1],
                CLAMP
              );
              const col = chip[i % chip.length];
              return (
                <div key={l.label + i} style={{marginBottom: i === legend.length - 1 ? 0 : 13}}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 19,
                        fontWeight: 600,
                        color: '#EFE9DE',
                      }}
                    >
                      {l.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 20,
                        fontWeight: 700,
                        color: col,
                        textShadow: `0 0 14px ${rgba(accent, 0.5)}`,
                      }}
                    >
                      {l.pct}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(pv * bar).toFixed(2)}%`,
                        height: '100%',
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${shade(col, 0.6)}, ${col})`,
                        boxShadow: `0 0 12px ${rgba(accent, 0.55)}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedBrickWall;
