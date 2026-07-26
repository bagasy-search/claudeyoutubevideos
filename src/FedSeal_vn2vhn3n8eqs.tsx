/**
 * ============================================================================
 * FED_SEAL — "El aceite es la TAPA, no el contenido"
 * ----------------------------------------------------------------------------
 * Payoff visual del video: un aceite vegetal puro es ANHIDRO (0% de agua), así
 * que no puede hidratar. Lo único que hace es OCLUIR: una película que frena la
 * evaporación del agua que YA está abajo. Si abajo hay agua, la retiene. Si
 * abajo no hay nada, sella una piel seca.
 *
 * COMPARACIÓN A/B en dos mitades, todo procedural (cero imágenes externas):
 *   IZQ  · corte transversal de piel SECA (estrato córneo escamoso agrietado,
 *          capas profundas apagadas). Cae la película dorada y se asienta como
 *          tapa brillante. Debajo NO hay gotas: el corte se ve vacío.
 *   DER  · el mismo corte, con GOTAS DE AGUA azuladas entre las células. Cae la
 *          misma película y las gotas quedan ATRAPADAS, con glow creciente.
 *
 * CAPAS (orden de composición, estilo After Effects):
 *   L0  fondo por mood + wash A/B + viñeta
 *   L1  bokeh grande fuera de foco
 *   L2  polvo fino con deriva
 *   L3  cortes de piel — 5 estratos, cada uno su propio div con textura
 *       procedural (células irregulares por semilla) y parallax por profundidad
 *   L4  gotas de agua con specular + halo (solo mitad húmeda)
 *   L5  película de aceite: cuerpo + espesor + reflejo animado + goteo
 *   L6  flechas de vapor con estela (escapan / rebotan contra la película)
 *   L7  divisor vertical dorado con glow + barrido y bead viajero
 *   8   medidores/contadores + placas de etiqueta + placa de título
 *   L9  gota gigante "0% de agua" que cae y se aplasta en película
 *   L10 GrainOverlay
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

/* ============================== CONTRATO ================================= */

export type FedSealProps = {
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  title?: string;
  sub?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftNote?: string;
  rightNote?: string;
  dropLabel?: string;
};

/* =========================== GEOMETRÍA DE ESCENA ========================== */

const PANEL_W = 620;
const PANEL_H = 336;
const PANEL_TOP = 356;
const CX_L = 480;
const CX_R = 1440;

/* ====================== TEXTURA PROCEDURAL DE PIEL ======================== */

type Cell = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  tone: number;
  rad: string;
  ph: number;
};

const makeCells = (seed: string, cols: number, rows: number, jit: number): Cell[] => {
  const out: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const jx = (random(`${seed}-jx-${i}`) - 0.5) * (100 / cols) * 0.62;
      const jy = (random(`${seed}-jy-${i}`) - 0.5) * (100 / rows) * 0.46;
      out.push({
        x: ((c + 0.5) / cols) * 100 + jx,
        y: ((r + 0.5) / rows) * 100 + jy,
        w: (100 / cols) * (1.06 + random(`${seed}-w-${i}`) * jit),
        h: (100 / rows) * (1.02 + random(`${seed}-h-${i}`) * jit * 0.7),
        rot: (random(`${seed}-rt-${i}`) - 0.5) * 15,
        tone: random(`${seed}-tn-${i}`),
        rad:
          `${34 + random(`${seed}-a-${i}`) * 30}% ${42 + random(`${seed}-b-${i}`) * 26}% ` +
          `${36 + random(`${seed}-c-${i}`) * 30}% ${44 + random(`${seed}-d-${i}`) * 24}% / ` +
          `${40 + random(`${seed}-e-${i}`) * 26}% ${36 + random(`${seed}-f-${i}`) * 30}% ` +
          `${44 + random(`${seed}-g-${i}`) * 24}% ${38 + random(`${seed}-h-${i}`) * 28}%`,
        ph: random(`${seed}-ph-${i}`) * Math.PI * 2,
      });
    }
  }
  return out;
};

type BandCfg = {
  key: string;
  top: number; // % del panel
  h: number; // % del panel
  cols: number;
  rows: number;
  depth: number; // 0 = superficie, 4 = profundo (parallax)
  jit: number;
};

const BANDS: BandCfg[] = [
  {key: 'corneo', top: 0, h: 26, cols: 14, rows: 4, depth: 0, jit: 0.7},
  {key: 'granuloso', top: 26, h: 15, cols: 10, rows: 2, depth: 1, jit: 0.5},
  {key: 'espinoso', top: 41, h: 23, cols: 7, rows: 2, depth: 2, jit: 0.4},
  {key: 'basal', top: 64, h: 13, cols: 15, rows: 1, depth: 3, jit: 0.24},
];

/* ------------------------------ un estrato ------------------------------- */

const SkinBand: React.FC<{
  cfg: BandCfg;
  dry: boolean;
  accent: string;
  reveal: number;
  life: number; // 0..1 — cuánto "revive" (solo lado húmedo)
}> = ({cfg, dry, accent, reveal, life}) => {
  const frame = useCurrentFrame();
  const cells = React.useMemo(
    () => makeCells(`${cfg.key}-${dry ? 'd' : 'w'}`, cfg.cols, cfg.rows, cfg.jit),
    [cfg.key, cfg.cols, cfg.rows, cfg.jit, dry]
  );

  // parallax: los estratos profundos se mueven menos y más tarde
  const par = Math.sin(frame * 0.017 + cfg.depth * 0.8) * (2.6 - cfg.depth * 0.5);
  const parX = Math.cos(frame * 0.013 + cfg.depth * 1.3) * (1.9 - cfg.depth * 0.35);
  const bandIn = interpolate(reveal, [cfg.depth * 0.1, 0.62 + cfg.depth * 0.1], [0, 1], CLAMP);

  // base del estrato: seca = grisácea/parda apagada · húmeda = más viva
  const warm = dry ? 0.34 : 0.6 + 0.4 * life;
  const baseTop = dry ? '#585049' : '#715e4c';
  const baseBot = dry ? '#332e2a' : '#4d3e32';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${cfg.top}%`,
        height: `${cfg.h}%`,
        transform: `translate(${parX.toFixed(2)}px, ${par.toFixed(2)}px)`,
        opacity: bandIn,
        overflow: 'hidden',
        background: `linear-gradient(to bottom, ${baseTop}, ${baseBot})`,
        filter: `saturate(${(0.3 + 0.7 * warm).toFixed(2)}) brightness(${(
          0.62 +
          0.42 * warm
        ).toFixed(2)})`,
        willChange: 'transform, opacity',
      }}
    >
      {/* ruido de fondo del estrato */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            `repeating-linear-gradient(${
              cfg.depth % 2 === 0 ? 116 : 64
            }deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent ${
              7 + cfg.depth * 3
            }px)`,
            'radial-gradient(120% 140% at 30% 0%, rgba(255,236,200,0.12), transparent 62%)',
            'radial-gradient(80% 120% at 78% 100%, rgba(0,0,0,0.35), transparent 60%)',
          ].join(', '),
          opacity: 0.75,
        }}
      />
      {cells.map((c, i) => {
        const brea = 1 + Math.sin(frame * 0.028 + c.ph) * (dry ? 0.006 : 0.014 * (0.4 + life));
        const t = c.tone;
        const lite = dry ? 0.34 + t * 0.3 : 0.42 + t * 0.38 + 0.12 * life;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.w}%`,
              height: `${c.h}%`,
              borderRadius: c.rad,
              // OJO: marginTop en % se resuelve contra el ANCHO. Centrar por transform.
              transform: `translate(-50%, -50%) rotate(${c.rot.toFixed(2)}deg) scale(${brea.toFixed(
                4
              )})`,
              background: `linear-gradient(${140 + t * 60}deg, ${rgba(
                dry ? '#d8c5aa' : '#f0d7b4',
                0.2 + lite * 0.55
              )} 0%, ${rgba('#000000', 0.3 + (1 - t) * 0.32)} 100%)`,
              boxShadow: `inset 0 1px 0 ${rgba(
                '#fff0d4',
                dry ? 0.24 : 0.3 + 0.22 * life
              )}, inset 0 -3px 6px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.5)`,
              border: `1px solid ${rgba(dry ? '#120c07' : accent, dry ? 0.62 : 0.26 + 0.16 * life)}`,
              willChange: 'transform',
            }}
          />
        );
      })}
      {/* grietas — sólo la piel seca se resquebraja */}
      {dry &&
        cfg.depth < 2 &&
        new Array(6).fill(0).map((_, i) => {
          const x = 7 + random(`crack-x-${cfg.key}-${i}`) * 86;
          const rot = (random(`crack-r-${cfg.key}-${i}`) - 0.5) * 26;
          const h = 58 + random(`crack-h-${cfg.key}-${i}`) * 46;
          const w = 2 + random(`crack-w-${cfg.key}-${i}`) * 3;
          return (
            <div
              key={`k${i}`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${random(`crack-y-${cfg.key}-${i}`) * 22}%`,
                width: w,
                height: `${h}%`,
                transformOrigin: '50% 0%',
                transform: `rotate(${rot.toFixed(1)}deg)`,
                clipPath: 'polygon(50% 0%, 100% 12%, 62% 100%, 38% 100%, 0% 12%)',
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.1))',
                boxShadow: '0 0 4px rgba(0,0,0,0.7)',
                opacity: bandIn * 0.95,
              }}
            />
          );
        })}
      {/* separador del estrato */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${rgba('#ffd9a0', 0.22)}, transparent)`,
        }}
      />
    </div>
  );
};

/* ------------------------------- la dermis ------------------------------- */

const Dermis: React.FC<{dry: boolean; accent: string; reveal: number}> = ({
  dry,
  accent,
  reveal,
}) => {
  const frame = useCurrentFrame();
  const fibers = React.useMemo(
    () =>
      new Array(11).fill(0).map((_, i) => ({
        y: random(`fib-y-${dry}-${i}`) * 92,
        rot: (random(`fib-r-${dry}-${i}`) - 0.5) * 22,
        w: 40 + random(`fib-w-${dry}-${i}`) * 58,
        x: random(`fib-x-${dry}-${i}`) * 70,
        ph: random(`fib-p-${dry}-${i}`) * Math.PI * 2,
      })),
    [dry]
  );
  const inn = interpolate(reveal, [0.35, 1], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '77%',
        bottom: 0,
        overflow: 'hidden',
        opacity: inn,
        background: `linear-gradient(to bottom, ${shade(dry ? '#4a3a30' : '#5a4536', 0.72)}, ${shade(
          '#1a1310',
          0.9
        )})`,
        transform: `translateY(${(Math.sin(frame * 0.012) * 1.4).toFixed(2)}px)`,
      }}
    >
      {fibers.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.w}%`,
            height: 2,
            borderRadius: 2,
            transform: `rotate(${(f.rot + Math.sin(frame * 0.02 + f.ph) * 1.1).toFixed(2)}deg)`,
            background: `linear-gradient(to right, transparent, ${rgba(
              dry ? '#8f8270' : '#a8927a',
              dry ? 0.24 : 0.34
            )}, transparent)`,
            opacity: 0.5 + 0.3 * Math.sin(frame * 0.03 + f.ph),
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(90% 120% at 50% 100%, ${rgba(accent, 0.08)}, transparent 66%)`,
        }}
      />
    </div>
  );
};

/* ============================ GOTAS DE AGUA ============================== */

type Drop = {x: number; y: number; r: number; ph: number; d: number};

const makeDrops = (seed: string, n: number): Drop[] =>
  new Array(n).fill(0).map((_, i) => ({
    x: 6 + random(`${seed}-x-${i}`) * 88,
    y: 4 + random(`${seed}-y-${i}`) * 56,
    r: 9 + random(`${seed}-r-${i}`) * 15,
    ph: random(`${seed}-p-${i}`) * Math.PI * 2,
    d: random(`${seed}-d-${i}`),
  }));

const WaterDrops: React.FC<{show: number; glow: number}> = ({show, glow}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drops = React.useMemo(() => makeDrops('sealwater', 15), []);
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {drops.map((d, i) => {
        const s = spring({
          frame: frame - Math.round(show) - i * 2,
          fps,
          config: {damping: 12, mass: 0.5},
        });
        const wob = 1 + Math.sin(frame * 0.06 + d.ph) * 0.06;
        const size = d.r * (0.9 + 0.35 * glow) * s * wob;
        const halo = (10 + 26 * glow) * (0.6 + d.d * 0.7);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: size * 2,
              height: size * 1.82,
              marginLeft: -size,
              marginTop: -size * 0.91,
              borderRadius: '50% 50% 52% 48% / 46% 46% 54% 54%',
              transform: `translateY(${(Math.sin(frame * 0.04 + d.ph) * 1.6).toFixed(2)}px) rotate(${(
                Math.sin(frame * 0.02 + d.ph) * 6
              ).toFixed(2)}deg)`,
              background: [
                'radial-gradient(36% 30% at 33% 26%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 62%)',
                `radial-gradient(circle at 52% 58%, ${rgba(COOL_BLUE, 0.9)} 0%, ${rgba(
                  '#3d6cb4',
                  0.66
                )} 58%, ${rgba('#12294f', 0.3)} 100%)`,
              ].join(', '),
              boxShadow: `0 0 ${halo.toFixed(0)}px ${rgba(
                COOL_BLUE,
                0.28 + 0.42 * glow
              )}, inset 0 -3px 6px ${rgba('#ffffff', 0.24)}, 0 3px 8px rgba(0,0,0,0.5)`,
              opacity: s,
              willChange: 'transform, box-shadow',
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------------------- huecos vacíos (lado seco) ------------------------ */

const EmptyPockets: React.FC<{show: number}> = ({show}) => {
  const frame = useCurrentFrame();
  const pockets = React.useMemo(() => makeDrops('sealempty', 11), []);
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {pockets.map((d, i) => {
        const s = interpolate(show, [i * 0.03, 0.4 + i * 0.03], [0, 1], CLAMP);
        const r = d.r * 0.95;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: r * 2,
              height: r * 1.8,
              marginLeft: -r,
              marginTop: -r * 0.9,
              borderRadius: '50%',
              border: `1px dashed ${rgba('#c9bda8', 0.17)}`,
              background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.42), transparent 72%)`,
              opacity: s * (0.5 + 0.2 * Math.sin(frame * 0.03 + d.ph)),
            }}
          />
        );
      })}
    </div>
  );
};

/* ========================= PELÍCULA DE ACEITE ============================ */

const OilFilm: React.FC<{accent: string; p: number; side: number}> = ({accent, p, side}) => {
  const frame = useCurrentFrame();
  const h = 4 + 24 * p; // espesor
  const w = interpolate(p, [0, 1], [16, 100], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const sweep = ((frame * 0.9 + side * 60) % 260) - 60;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: -h * 0.55,
        width: `${w}%`,
        height: h,
        marginLeft: `${-w / 2}%`,
        borderRadius: `${h}px ${h}px ${h * 0.5}px ${h * 0.5}px`,
        overflow: 'hidden',
        opacity: Math.min(1, p * 3),
        background: [
          `linear-gradient(to bottom, ${rgba('#fff0c8', 0.96)} 0%, ${rgba(accent, 0.92)} 38%, ${rgba(
            shade(accent, 0.45),
            0.9
          )} 78%, ${rgba('#2a1c07', 0.86)} 100%)`,
        ].join(', '),
        boxShadow: `0 ${(6 + 10 * p).toFixed(0)}px ${(18 + 26 * p).toFixed(0)}px ${rgba(
          '#000000',
          0.55
        )}, 0 0 ${(20 + 44 * p).toFixed(0)}px ${rgba(accent, 0.34 * p)}, inset 0 -2px 3px ${rgba(
          '#000000',
          0.4
        )}`,
        willChange: 'width, height, box-shadow',
      }}
    >
      {/* gloss superior */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1,
          height: Math.max(1, h * 0.22),
          background: `linear-gradient(to right, transparent, ${rgba('#fffdf0', 0.85)} 30%, ${rgba(
            '#fffdf0',
            0.55
          )} 66%, transparent)`,
          filter: 'blur(0.6px)',
        }}
      />
      {/* reflejo que barre */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          bottom: '-40%',
          left: `${sweep}%`,
          width: '34%',
          transform: 'skewX(-22deg)',
          background: `linear-gradient(100deg, transparent 12%, ${rgba(
            '#ffffff',
            0.5
          )} 50%, transparent 88%)`,
          mixBlendMode: 'screen',
          opacity: 0.7 * p,
        }}
      />
      {/* espesor / borde inferior */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: Math.max(1, h * 0.18),
          background: `linear-gradient(to right, ${rgba('#150d02', 0.2)}, ${rgba(
            '#150d02',
            0.62
          )}, ${rgba('#150d02', 0.2)})`,
        }}
      />
    </div>
  );
};

/* ----------------------- goteo colgando de la tapa ----------------------- */

const FilmDrips: React.FC<{accent: string; p: number; seed: string}> = ({accent, p, seed}) => {
  const frame = useCurrentFrame();
  const drips = React.useMemo(
    () =>
      new Array(3).fill(0).map((_, i) => ({
        x: 18 + random(`${seed}-dx-${i}`) * 64,
        r: 5 + random(`${seed}-dr-${i}`) * 5,
        ph: random(`${seed}-dp-${i}`) * Math.PI * 2,
      })),
    [seed]
  );
  return (
    <>
      {drips.map((d, i) => {
        const bob = Math.sin(frame * 0.045 + d.ph);
        const grow = interpolate(p, [0.35, 1], [0, 1], CLAMP);
        const r = d.r * grow * (1 + bob * 0.14);
        if (r < 0.6) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${d.x}%`,
              top: 8 + bob * 2,
              width: r * 2,
              height: r * 2.4,
              marginLeft: -r,
              borderRadius: '50% 50% 55% 45% / 40% 40% 60% 60%',
              background: `linear-gradient(to bottom, ${rgba('#ffe9b4', 0.9)}, ${rgba(
                shade(accent, 0.5),
                0.9
              )})`,
              boxShadow: `0 4px 10px rgba(0,0,0,0.5), 0 0 12px ${rgba(accent, 0.35)}`,
              opacity: grow,
            }}
          />
        );
      })}
    </>
  );
};

/* =========================== FLECHAS DE VAPOR ============================ */

const VaporArrows: React.FC<{
  blocked: number; // 0 = escapan · 1 = la película las frena
  accent: string;
  seed: string;
  show: number;
}> = ({blocked, accent, seed, show}) => {
  const frame = useCurrentFrame();
  const arrows = React.useMemo(
    () =>
      new Array(7).fill(0).map((_, i) => ({
        x: 8 + (i / 6) * 84 + (random(`${seed}-ax-${i}`) - 0.5) * 7,
        ph: random(`${seed}-ap-${i}`),
        sp: 0.011 + random(`${seed}-as-${i}`) * 0.008,
        sc: 0.78 + random(`${seed}-ac-${i}`) * 0.5,
      })),
    [seed]
  );
  const tint = blocked > 0.5 ? accent : TEAL;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: show}}>
      {arrows.map((a, i) => {
        const t = (frame * a.sp + a.ph) % 1;
        const reach = 1 - 0.62 * blocked;
        const y = interpolate(t, [0, 1], [104, 104 - 128 * reach], CLAMP);
        const hit = blocked > 0.15 ? interpolate(t, [0.5, 1], [0, 1], CLAMP) : 0;
        const fade = blocked > 0.15
          ? interpolate(t, [0, 0.12, 0.62, 1], [0, 1, 0.9, 0], CLAMP)
          : interpolate(t, [0, 0.14, 0.74, 1], [0, 1, 0.85, 0], CLAMP);
        const sx = 1 + hit * 1.5 * blocked;
        const sy = 1 - hit * 0.72 * blocked;
        const w = 17 * a.sc;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${a.x}%`,
              top: `${y}%`,
              width: w,
              height: w * 1.5,
              marginLeft: -w / 2,
              transform: `scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`,
              opacity: fade,
              willChange: 'top, transform, opacity',
            }}
          >
            {/* estela */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                width: Math.max(2, w * 0.2),
                height: 52 * a.sc * (1 - hit * 0.7),
                marginLeft: -Math.max(1, w * 0.1),
                background: `linear-gradient(to bottom, ${rgba(tint, 0.5)}, transparent)`,
                filter: 'blur(1.6px)',
              }}
            />
            {/* punta de flecha */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                clipPath:
                  'polygon(50% 0%, 100% 52%, 74% 52%, 74% 100%, 26% 100%, 26% 52%, 0% 52%)',
                background: `linear-gradient(to bottom, ${rgba(tint, 0.95)}, ${rgba(tint, 0.4)})`,
                boxShadow: `0 0 12px ${rgba(tint, 0.5)}`,
              }}
            />
          </div>
        );
      })}
      {/* onda de choque contra la tapa */}
      {blocked > 0.2 && (
        <div
          style={{
            position: 'absolute',
            left: '6%',
            right: '6%',
            bottom: '-2%',
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(to right, transparent, ${rgba(accent, 0.6)}, transparent)`,
            filter: 'blur(2px)',
            opacity: blocked * (0.5 + 0.5 * Math.sin(frame * 0.18)),
          }}
        />
      )}
    </div>
  );
};

/* ============================== MEDIDOR =================================- */

const Meter: React.FC<{
  from: number;
  to: number;
  p: number;
  accent: string;
  good: boolean;
  caption: string;
}> = ({from, to, p, accent, good, caption}) => {
  const frame = useCurrentFrame();
  const v = interpolate(p, [0, 1], [from, to], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const col = good ? COOL_BLUE : rgba('#d8cbb4', 0.85);
  const pulse = good ? 0.5 + 0.5 * Math.sin(frame * 0.1) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 330,
        marginLeft: -165,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 15,
          letterSpacing: 4.4,
          fontWeight: 700,
          color: rgba('#ffffff', 0.5),
          textTransform: 'uppercase',
        }}
      >
        {caption}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.05,
          color: col,
          letterSpacing: -1,
          textShadow: good
            ? `0 0 ${(16 + 22 * pulse).toFixed(0)}px ${rgba(COOL_BLUE, 0.55)}, 0 4px 18px rgba(0,0,0,0.8)`
            : '0 4px 18px rgba(0,0,0,0.8)',
        }}
      >
        {Math.round(v)}
        <span style={{fontSize: 30, opacity: 0.7}}>%</span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 6,
          borderRadius: 6,
          background: rgba('#ffffff', 0.09),
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${v}%`,
            background: good
              ? `linear-gradient(to right, ${rgba(COOL_BLUE, 0.5)}, ${COOL_BLUE})`
              : `linear-gradient(to right, ${rgba(accent, 0.28)}, ${rgba('#b8a98e', 0.6)})`,
            boxShadow: good ? `0 0 14px ${rgba(COOL_BLUE, 0.7)}` : 'none',
          }}
        />
      </div>
    </div>
  );
};

/* ============================ MITAD (A o B) ============================== */

const Half: React.FC<{
  cx: number;
  dry: boolean;
  accent: string;
  reveal: number;
  filmP: number;
  waterShow: number;
  glow: number;
  blocked: number;
  label: string;
  note: string;
  labelP: number;
  meterP: number;
  vaporShow: number;
}> = ({
  cx,
  dry,
  accent,
  reveal,
  filmP,
  waterShow,
  glow,
  blocked,
  label,
  note,
  labelP,
  meterP,
  vaporShow,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.021 + (dry ? 0 : 1.6)) * 3.2;
  const tilt = Math.sin(frame * 0.015 + (dry ? 0.9 : 2.4)) * 0.5;
  const enter = interpolate(reveal, [0, 1], [46, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 480,
        top: 0,
        width: 960,
        height: 1080,
      }}
    >
      {/* wash de la mitad */}
      <AbsoluteFill
        style={{
          background: dry
            ? `radial-gradient(62% 46% at 50% 46%, ${rgba('#7a6242', 0.16)}, transparent 70%)`
            : `radial-gradient(62% 46% at 50% 46%, ${rgba(COOL_BLUE, 0.06 + 0.16 * glow)}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* medidor arriba */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 82, opacity: labelP}}>
        <Meter
          from={dry ? 14 : 15}
          to={dry ? 13 : 44}
          p={meterP}
          accent={accent}
          good={!dry}
          caption="Agua retenida"
        />
      </div>

      {/* zona de vapor */}
      <div
        style={{
          position: 'absolute',
          left: cxInsetLeft(),
          top: 232,
          width: PANEL_W,
          height: 108,
        }}
      >
        <VaporArrows
          blocked={dry ? 0 : blocked}
          accent={accent}
          seed={dry ? 'vapdry' : 'vapwet'}
          show={vaporShow}
        />
      </div>

      {/* corte de piel + película */}
      <div
        style={{
          position: 'absolute',
          left: cxInsetLeft(),
          top: PANEL_TOP,
          width: PANEL_W,
          height: PANEL_H,
          transform: `translateY(${(enter + bob).toFixed(2)}px) rotate(${tilt.toFixed(3)}deg)`,
          willChange: 'transform',
        }}
      >
        {/* panel clipeado */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            overflow: 'hidden',
            clipPath: `inset(${((1 - reveal) * 100).toFixed(2)}% 0% 0% 0%)`,
            background: '#120d09',
            boxShadow: dry
              ? '0 34px 74px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)'
              : `0 34px 74px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.07), 0 0 ${(
                  20 +
                  60 * glow
                ).toFixed(0)}px ${rgba(COOL_BLUE, 0.26 * glow)}`,
          }}
        >
          {BANDS.map((b) => (
            <SkinBand
              key={b.key}
              cfg={b}
              dry={dry}
              accent={accent}
              reveal={reveal}
              life={dry ? 0 : glow}
            />
          ))}
          <Dermis dry={dry} accent={accent} reveal={reveal} />

          {dry ? (
            <EmptyPockets show={waterShow} />
          ) : (
            <WaterDrops show={waterShow} glow={glow} />
          )}

          {/* grade interno del corte */}
          <AbsoluteFill
            style={{
              background: [
                'linear-gradient(to bottom, rgba(255,240,210,0.10) 0%, transparent 24%)',
                'linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.55) 100%)',
                'radial-gradient(120% 100% at 50% 40%, transparent 48%, rgba(0,0,0,0.5) 100%)',
              ].join(', '),
              pointerEvents: 'none',
            }}
          />
          {/* aceite que impregna la superficie */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: `${(6 + 12 * filmP).toFixed(1)}%`,
              background: `linear-gradient(to bottom, ${rgba(accent, 0.34 * filmP)}, transparent)`,
              mixBlendMode: 'screen',
              opacity: filmP,
            }}
          />
        </div>

        {/* película de aceite (fuera del clip: se apoya en el borde) */}
        <OilFilm accent={accent} p={filmP} side={dry ? 0 : 1} />
        <FilmDrips accent={accent} p={filmP} seed={dry ? 'dripd' : 'dripw'} />
      </div>

      {/* etiqueta + nota */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: PANEL_TOP + PANEL_H + 38,
          textAlign: 'center',
          clipPath: `inset(0% ${((1 - labelP) * 100).toFixed(1)}% 0% 0%)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: 2.2,
            textTransform: 'uppercase',
            color: dry ? rgba('#e6dcc8', 0.9) : '#ffffff',
            textShadow: '0 3px 16px rgba(0,0,0,0.85)',
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 10,
            height: 2,
            width: 96,
            marginLeft: 'auto',
            marginRight: 'auto',
            background: dry
              ? `linear-gradient(to right, transparent, ${rgba('#c8b795', 0.5)}, transparent)`
              : `linear-gradient(to right, transparent, ${COOL_BLUE}, transparent)`,
            boxShadow: dry ? 'none' : `0 0 12px ${rgba(COOL_BLUE, 0.8)}`,
          }}
        />
        <div
          style={{
            marginTop: 12,
            fontFamily: FONT_SERIF,
            fontStyle: 'italic',
            fontSize: 26,
            color: dry ? rgba('#d6c9ae', 0.62) : rgba(COOL_BLUE, 0.95),
            textShadow: '0 3px 14px rgba(0,0,0,0.8)',
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
};

const cxInsetLeft = (): number => (960 - PANEL_W) / 2;

/* ============================== COMPONENTE =============================== */

export const FedSeal: React.FC<FedSealProps> = ({
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  title = 'El aceite es la tapa, no el contenido',
  sub = 'Un aceite puro es anhidro: 0% de agua. No hidrata — ocluye.',
  leftLabel = 'Aceite sobre piel SECA',
  rightLabel = 'Aceite sobre piel HÚMEDA',
  leftNote = 'sella la nada',
  rightNote = 'sella el agua',
  dropLabel = '0% de agua',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  /* --------- línea de tiempo normalizada: todo escala con totalF -------- */
  const T = Math.max(60, totalF);
  const at = (f: number): number => f * T;
  const seg = (a: number, b: number, ease?: (n: number) => number): number =>
    interpolate(frame, [at(a), at(b)], [0, 1], {
      ...CLAMP,
      easing: ease ?? Easing.out(Easing.cubic),
    });

  const revealL = seg(0.02, 0.24);
  const revealR = seg(0.06, 0.28);
  const dividerP = seg(0.05, 0.26);
  const dropFall = seg(0.12, 0.36, Easing.in(Easing.quad)); // gravedad
  const splat = seg(0.33, 0.45);
  const filmP = seg(0.36, 0.6);
  const waterShow = at(0.15); // frame de arranque del stagger
  const emptyShow = seg(0.16, 0.42);
  const blocked = seg(0.5, 0.68);
  const glow = seg(0.52, 0.94, Easing.inOut(Easing.cubic));
  const labelP = seg(0.26, 0.44);
  const meterP = seg(0.48, 0.95);
  const vaporShow = seg(0.2, 0.34);
  const platePop = spring({
    frame: frame - Math.round(at(0.6)),
    fps,
    config: {damping: 17, mass: 0.75},
  });

  /* ---------------------------- cámara ---------------------------------- */
  const push = interpolate(frame, [0, T], [1.045, 1.0], CLAMP);
  const hx = Math.sin(frame * 0.018) * width * 0.0016;
  const hy = Math.cos(frame * 0.0245) * height * 0.0013;
  const hr = Math.sin(frame * 0.0132) * 0.16;

  /* --------------------------- partículas ------------------------------- */
  const bokeh = React.useMemo(
    () => makeMotes(6, 'seal-bokeh', 120, 250, 0.008, 0.022, 0.05, 0.11),
    []
  );
  const dust = React.useMemo(
    () => makeMotes(20, 'seal-dust', 2, 8, 0.05, 0.11, 0.1, 0.3),
    []
  );

  /* --------------- gota gigante "0% de agua" que cae -------------------- */
  const dropY = interpolate(dropFall, [0, 1], [-190, PANEL_TOP - 26], CLAMP);
  const dropSquash = interpolate(splat, [0, 0.42, 1], [1, 0.28, 0.06], CLAMP);
  const dropSpread = interpolate(splat, [0, 1], [1, 4.6], CLAMP);
  const dropOp = interpolate(splat, [0.45, 1], [1, 0], CLAMP);
  const dropR = 52;
  const chipOp = Math.min(
    interpolate(dropFall, [0.05, 0.28], [0, 1], CLAMP),
    interpolate(splat, [0.1, 0.5], [1, 0], CLAMP)
  );

  return (
    <AbsoluteFill style={{background: '#03020a', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF} whipF={FED_WHIP_F}>
        {/* ================= L0 · fondo por mood + viñeta ================= */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(46% 60% at 25% 50%, ${rgba('#6b5432', 0.16)}, transparent 72%)`,
              `radial-gradient(46% 60% at 75% 50%, ${rgba(COOL_BLUE, 0.05 + 0.1 * glow)}, transparent 72%)`,
              'radial-gradient(120% 100% at 50% 48%, transparent 40%, rgba(1,2,6,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,3,8,0.62), transparent 22%, transparent 62%, rgba(2,3,8,0.8))',
            ].join(', '),
          }}
        />

        {/* cámara: todo lo que sigue respira */}
        <AbsoluteFill
          style={{
            transform: `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px) scale(${push.toFixed(
              4
            )}) rotate(${hr.toFixed(3)}deg)`,
            willChange: 'transform',
          }}
        >
          {/* ============= L1 · bokeh fuera de foco ==================== */}
          <MotesLayer motes={bokeh} blur={18} scale={height / 1080} tint="238, 204, 146" />

          {/* ============= L2 · polvo fino ============================= */}
          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="236, 216, 178" />

          {/* ====== L3/L4/L5/L6 · las dos mitades comparadas =========== */}
          <Half
            cx={CX_L}
            dry
            accent={accent}
            reveal={revealL}
            filmP={filmP}
            waterShow={emptyShow}
            glow={0}
            blocked={0}
            label={leftLabel}
            note={leftNote}
            labelP={labelP}
            meterP={meterP}
            vaporShow={vaporShow}
          />
          <Half
            cx={CX_R}
            dry={false}
            accent={accent}
            reveal={revealR}
            filmP={filmP}
            waterShow={waterShow}
            glow={glow}
            blocked={blocked}
            label={rightLabel}
            note={rightNote}
            labelP={labelP}
            meterP={meterP}
            vaporShow={vaporShow}
          />

          {/* ============= L7 · divisor dorado con glow ================ */}
          <div
            style={{
              position: 'absolute',
              left: 960 - 1.5,
              top: 0,
              width: 3,
              height: 1080,
              transformOrigin: '50% 50%',
              transform: `scaleY(${dividerP.toFixed(4)})`,
              background: `linear-gradient(to bottom, transparent, ${rgba(
                accent,
                0.85
              )} 14%, ${rgba('#fff2cf', 0.95)} 50%, ${rgba(accent, 0.85)} 86%, transparent)`,
              boxShadow: `0 0 26px ${rgba(accent, 0.65)}, 0 0 68px ${rgba(accent, 0.3)}`,
              opacity: 0.9,
            }}
          />
          {/* bead que baja por el divisor */}
          {dividerP > 0.02 && dividerP < 0.999 && (
            <div
              style={{
                position: 'absolute',
                left: 960 - 9,
                top: dividerP * 1080 - 9,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${rgba('#fffaea', 0.95)}, ${rgba(
                  accent,
                  0.2
                )} 70%, transparent)`,
                boxShadow: `0 0 34px ${rgba(accent, 0.9)}`,
              }}
            />
          )}
          {/* halo del divisor */}
          <div
            style={{
              position: 'absolute',
              left: 960 - 90,
              top: 0,
              width: 180,
              height: 1080,
              background: `linear-gradient(to right, transparent, ${rgba(
                accent,
                0.1 * dividerP
              )}, transparent)`,
              filter: 'blur(14px)',
              pointerEvents: 'none',
            }}
          />

          {/* ===== L9 · gota gigante "0% de agua" (alimenta ambas) ===== */}
          {dropOp > 0.01 && (
            <div
              style={{
                position: 'absolute',
                left: 960,
                top: dropY,
                width: dropR * 2,
                height: dropR * 2.3,
                marginLeft: -dropR,
                transform: `scale(${(dropSpread * (1 - splat * 0.1)).toFixed(3)}, ${dropSquash.toFixed(
                  3
                )})`,
                transformOrigin: '50% 100%',
                borderRadius: '52% 48% 50% 50% / 68% 68% 32% 32%',
                background: [
                  'radial-gradient(30% 24% at 36% 24%, rgba(255,255,255,0.9), transparent 60%)',
                  `linear-gradient(to bottom, ${rgba('#ffeec2', 0.96)}, ${rgba(
                    accent,
                    0.95
                  )} 52%, ${rgba(shade(accent, 0.42), 0.95)} 100%)`,
                ].join(', '),
                boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 0 46px ${rgba(accent, 0.5)}`,
                opacity: dropOp,
                willChange: 'top, transform, opacity',
              }}
            />
          )}
          {/* estela de la gota */}
          {dropFall > 0.04 && dropFall < 0.99 && (
            <div
              style={{
                position: 'absolute',
                left: 960 - 5,
                top: dropY - 150,
                width: 10,
                height: 160,
                borderRadius: 10,
                background: `linear-gradient(to bottom, transparent, ${rgba(accent, 0.34)})`,
                filter: 'blur(5px)',
                opacity: 0.8,
              }}
            />
          )}
          {/* chip "0% de agua" pegado a la gota */}
          {chipOp > 0.01 && (
            <div
              style={{
                position: 'absolute',
                left: 960 + 74,
                top: dropY + 24,
                padding: '8px 18px',
                borderRadius: 999,
                border: `1px solid ${rgba(accent, 0.6)}`,
                background: 'rgba(6,5,3,0.72)',
                boxShadow: `0 0 26px ${rgba(accent, 0.3)}`,
                fontFamily: FONT_SANS,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 2.4,
                color: accent,
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                opacity: chipOp,
              }}
            >
              {dropLabel}
            </div>
          )}

          {/* ============= L8 · placa de título abajo ================== */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 38,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateY(${((1 - platePop) * 46).toFixed(1)}px)`,
              opacity: platePop,
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '18px 50px 20px',
                borderRadius: 6,
                background:
                  'linear-gradient(to bottom, rgba(10,8,5,0.72), rgba(4,3,2,0.86))',
                boxShadow: `inset 0 0 0 1px ${rgba(accent, 0.22)}, 0 26px 60px rgba(0,0,0,0.7)`,
                overflow: 'hidden',
                clipPath: `inset(0% ${((1 - platePop) * 100).toFixed(1)}% 0% 0%)`,
                maxWidth: 1400,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 46,
                  fontWeight: 800,
                  letterSpacing: -0.4,
                  lineHeight: 1.08,
                  textAlign: 'center',
                  color: '#fff8ea',
                  textShadow: `0 4px 26px rgba(0,0,0,0.9), 0 0 34px ${rgba(accent, 0.2)}`,
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
                  textAlign: 'center',
                  color: rgba('#f0e4cc', 0.72),
                  textShadow: '0 3px 18px rgba(0,0,0,0.85)',
                }}
              >
                {sub}
              </div>
              {/* barrido de luz sobre la placa */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40%',
                  bottom: '-40%',
                  left: `${interpolate(platePop, [0.2, 1], [-40, 130], CLAMP)}%`,
                  width: '30%',
                  transform: 'skewX(-18deg)',
                  background: `linear-gradient(100deg, transparent 18%, ${rgba(
                    accent,
                    0.34
                  )} 50%, transparent 82%)`,
                  mixBlendMode: 'screen',
                  opacity: Math.sin(Math.min(1, platePop) * Math.PI),
                }}
              />
            </div>
            <div
              style={{
                marginTop: 14,
                width: interpolate(platePop, [0, 1], [0, 260], CLAMP),
                height: 2,
                background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
                boxShadow: `0 0 16px ${rgba(accent, 0.7)}`,
              }}
            />
          </div>
        </AbsoluteFill>

        {/* viñeta final por encima de todo */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(130% 105% at 50% 46%, transparent 52%, rgba(0,0,0,0.62) 100%)',
            pointerEvents: 'none',
          }}
        />
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedSeal;
