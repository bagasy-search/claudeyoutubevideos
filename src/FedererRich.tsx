/* ============================================================================
   FED2 — Sistema de escenas en capas para el canal del Dr. Federer
   ----------------------------------------------------------------------------
   DENSIDAD DE PROFUNDIDAD por escena (back → front):
   fondo blureado+graded · motas lejanas · motas medias · luz volumétrica ·
   ecos del asset (fantasmas desenfocados) · HERO con focus-pull · energía /
   vapor / órbitas · bokeh gigante · oclusor foreground · viñeta+grade · texto.
   ----------------------------------------------------------------------------
   CONTRATO DE TRANSICIÓN (compartido, TransitionShell):
   · TR = 12 frames (0.4s @30fps) de overlap.
   · Whip-pan horizontal + blur 16px + stretch + barrido de luz dorada + flash.
   · En el Reel: <Series.Sequence offset={-TR}> → el whip entrante cubre al
     saliente; los dos light-sweeps se funden en el corte. Sin cortes duros.
   ----------------------------------------------------------------------------
   ASSETS (public/med/): romero.png · piel.png · aceite.png · vapor.png ·
   cubito.png · colageno.png · crema.png · antes_despues.png
============================================================================ */

import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  random,
  registerRoot,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ============================== CONSTANTES ================================= */

const SCENE_DUR = 150; // 5s @30fps
const TR = 12; // 0.4s — overlap del contrato de transición
const REEL_DUR = SCENE_DUR * 5 - TR * 4; // 702

const GOLD = '#E3B45C';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ============================== UTILIDADES ================================= */

const mod = (n: number, m: number) => ((n % m) + m) % m;

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.length === 6 ? full : '000000', 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/* ------------------------------ partículas -------------------------------- */

type Mote = {
  x: number;
  y0: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
};

const makeMotes = (
  count: number,
  seed: string,
  sizeMin: number,
  sizeMax: number,
  spMin: number,
  spMax: number,
  oMin: number,
  oMax: number
): Mote[] =>
  new Array(count).fill(0).map((_, i) => ({
    x: random(`${seed}-x-${i}`) * 100,
    y0: random(`${seed}-y-${i}`),
    size: sizeMin + random(`${seed}-s-${i}`) * (sizeMax - sizeMin),
    speed: spMin + random(`${seed}-sp-${i}`) * (spMax - spMin),
    phase: random(`${seed}-ph-${i}`) * Math.PI * 2,
    opacity: oMin + random(`${seed}-o-${i}`) * (oMax - oMin),
  }));

const MotesLayer: React.FC<{
  motes: Mote[];
  blur: number;
  scale: number;
  tint: string; // "r, g, b"
}> = ({motes, blur, scale, tint}) => {
  const frame = useCurrentFrame();
  const RANGE = 118;
  return (
    <AbsoluteFill style={{filter: `blur(${blur}px)`, pointerEvents: 'none'}}>
      {motes.map((m, i) => {
        const y = mod(m.y0 * RANGE - frame * m.speed, RANGE) - 9;
        const x = m.x + Math.sin(frame * 0.02 + m.phase) * 1.6;
        const tw = 0.55 + 0.45 * Math.sin(frame * 0.045 + m.phase * 2);
        const s = m.size * scale;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              borderRadius: '50%',
              background: `rgba(${tint}, ${m.opacity * tw})`,
              boxShadow: `0 0 ${s * 2.5}px ${s * 0.6}px rgba(${tint}, ${
                m.opacity * 0.5 * tw
              })`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------- bokeh ------------------------------------ */

type Bokeh = {x: number; y: number; r: number; sp: number; ph: number; o: number; gold: boolean};

const makeBokeh = (count: number, seed: string): Bokeh[] =>
  new Array(count).fill(0).map((_, i) => ({
    x: random(`${seed}-bx-${i}`) * 100,
    y: random(`${seed}-by-${i}`),
    r: 42 + random(`${seed}-br-${i}`) * 110,
    sp: 0.012 + random(`${seed}-bs-${i}`) * 0.028,
    ph: random(`${seed}-bp-${i}`) * Math.PI * 2,
    o: 0.05 + random(`${seed}-bo-${i}`) * 0.12,
    gold: random(`${seed}-bg-${i}`) > 0.45,
  }));

const BokehLayer: React.FC<{
  seed: string;
  count: number;
  blur: number;
  tintGold: string;
  tintPale: string;
  scale: number;
}> = ({seed, count, blur, tintGold, tintPale, scale}) => {
  const frame = useCurrentFrame();
  const items = React.useMemo(() => makeBokeh(count, seed), [count, seed]);
  return (
    <AbsoluteFill style={{filter: `blur(${blur}px)`, pointerEvents: 'none'}}>
      {items.map((b, i) => {
        const yy = mod(b.y * 120 - frame * b.sp, 120) - 10;
        const xx = b.x + Math.sin(frame * 0.014 + b.ph) * 2.2;
        const tw = 0.6 + 0.4 * Math.sin(frame * 0.05 + b.ph * 3);
        const r = b.r * scale;
        const col = b.gold ? tintGold : tintPale;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xx}%`,
              top: `${yy}%`,
              width: r,
              height: r,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${col}, ${b.o * tw}) 0%, rgba(${col}, ${
                b.o * 0.5 * tw
              }) 55%, transparent 72%)`,
              border: `1px solid rgba(${col}, ${b.o * 0.55 * tw})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* --------------------------- luz volumétrica ------------------------------ */

const VolumetricLayer: React.FC<{
  accent: string;
  side?: 'left' | 'right';
  intensity?: number;
  blur?: number;
}> = ({accent, side = 'right', intensity = 1, blur = 16}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.018) * 3;
  const breathe = 0.7 + 0.3 * Math.sin(frame * 0.027 + 1.1);
  const baseX = side === 'right' ? 56 : 10;
  const angBase = side === 'right' ? 20 : -20;
  return (
    <AbsoluteFill
      style={{mixBlendMode: 'screen', filter: `blur(${blur}px)`, opacity: intensity, pointerEvents: 'none'}}
    >
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: `${baseX - 8}%`,
          width: '55%',
          height: '65%',
          background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, 0.38 * breathe)}, transparent 70%)`,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-35%',
            left: `${baseX + i * 11}%`,
            width: '13%',
            height: '175%',
            transform: `rotate(${angBase + i * 8 + sway}deg)`,
            transformOrigin: '50% 0%',
            background: `linear-gradient(to bottom, ${rgba(
              accent,
              (0.14 - i * 0.03) * breathe
            )}, transparent 72%)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------- vapor ------------------------------------ */

type Wisp = {x: number; size: number; speed: number; ph: number; o: number; drift: number};

const makeWisps = (count: number, seed: string, xMin: number, xMax: number): Wisp[] =>
  new Array(count).fill(0).map((_, i) => ({
    x: xMin + random(`${seed}-wx-${i}`) * (xMax - xMin),
    size: 60 + random(`${seed}-ws-${i}`) * 100,
    speed: 0.5 + random(`${seed}-wsp-${i}`) * 0.7,
    ph: random(`${seed}-wph-${i}`),
    o: 0.13 + random(`${seed}-wo-${i}`) * 0.15,
    drift: 2 + random(`${seed}-wd-${i}`) * 5,
  }));

const SteamLayer: React.FC<{
  seed: string;
  count: number;
  blur: number;
  xMin?: number;
  xMax?: number;
  brightness?: number;
}> = ({seed, count, blur, xMin = 20, xMax = 80, brightness = 1}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const wisps = React.useMemo(() => makeWisps(count, seed, xMin, xMax), [count, seed, xMin, xMax]);
  return (
    <AbsoluteFill style={{filter: `blur(${blur}px)`, mixBlendMode: 'screen', pointerEvents: 'none'}}>
      {wisps.map((w, i) => {
        const cyc = mod(w.ph + frame * w.speed * 0.006, 1);
        const y = 82 - cyc * 72;
        const x = w.x + Math.sin(frame * 0.03 + w.ph * 9 + cyc * 5) * w.drift * (1 + cyc);
        const s = w.size * (0.45 + cyc * 1.5) * (height / 1080);
        const o = w.o * brightness * Math.sin(Math.PI * Math.min(1, cyc * 1.12));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s * 1.7,
              borderRadius: '50%',
              background: `radial-gradient(50% 50% at 50% 50%, rgba(238, 232, 218, ${o}), transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------------- fantasma de asset (eco / oclusor) ----------------- */

const DepthGhost: React.FC<{
  src: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width: string;
  rotate?: number;
  blur: number;
  opacity?: number;
  brightness?: number;
  flip?: boolean;
  swayAmp?: number;
  swaySpeed?: number;
  phase?: number;
  blendScreen?: boolean;
}> = (p) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * (p.swaySpeed ?? 0.045) + (p.phase ?? 0)) * (p.swayAmp ?? 14);
  const rot = (p.rotate ?? 0) + Math.sin(frame * 0.04 + (p.phase ?? 1)) * 1.3;
  const pos: React.CSSProperties = {
    position: 'absolute',
    width: p.width,
    ...(p.left !== undefined ? {left: p.left} : {}),
    ...(p.right !== undefined ? {right: p.right} : {}),
    ...(p.top !== undefined ? {top: p.top} : {}),
    ...(p.bottom !== undefined ? {bottom: p.bottom} : {}),
  };
  return (
    <div
      style={{
        ...pos,
        transform: `translateX(${sway}px) rotate(${rot}deg) ${p.flip ? 'scaleX(-1)' : ''}`,
        filter: `blur(${p.blur}px) brightness(${p.brightness ?? 0.55}) drop-shadow(0 30px 60px rgba(0,0,0,0.55))`,
        opacity: p.opacity ?? 0.9,
        mixBlendMode: p.blendScreen ? 'screen' : 'normal',
        willChange: 'transform, filter',
        pointerEvents: 'none',
      }}
    >
      <Img src={p.src} style={{width: '100%', display: 'block'}} />
    </div>
  );
};

/* ------------------------------- HERO card -------------------------------- */

const HeroCard: React.FC<{
  src: string;
  accent: string;
  left: string;
  top: string;
  w: number;
  aspect?: number;
  rotBase?: number;
  delay?: number;
  brackets?: boolean;
  sheenAt?: number;
  glowMul?: number;
  floatAmp?: number;
}> = ({
  src,
  accent,
  left,
  top,
  w,
  aspect = 3 / 2,
  rotBase = -2,
  delay = 0.35,
  brackets = true,
  sheenAt = 1.4,
  glowMul = 1,
  floatAmp = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();

  const enter = spring({
    frame: frame - Math.round(delay * fps),
    fps,
    config: {damping: 24, stiffness: 65, mass: 1},
  });
  const over = Math.max(0, enter - 1);
  const focusBlur = Math.max(0, interpolate(enter, [0, 1], [18, 0], CLAMP));
  // rack-focus respirando (sólo cuando ya asentó)
  const rack = (enter >= 1 ? 0.5 + 0.5 * Math.sin(frame * 0.045) : 0) * 0.9;
  const enterScale = interpolate(enter, [0, 1], [1.12, 1], CLAMP) * (1 + over * 0.1);
  const enterY = interpolate(enter, [0, 1], [54, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);
  const floatY = Math.sin(frame * 0.08 + 0.6) * height * 0.006 * floatAmp;
  const rot = rotBase + Math.sin(frame * 0.05) * 0.5;
  const glowPulse = (0.24 + 0.08 * Math.sin(frame * 0.06)) * glowMul;

  const br = spring({
    frame: frame - Math.round((delay + 0.7) * fps),
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.7},
  });
  const brOp = interpolate(br, [0, 1], [0, 0.9], CLAMP);
  const brScale = interpolate(br, [0, 1], [1.5, 1], CLAMP) * (1 + Math.max(0, br - 1) * 0.2);

  const sheenStart = Math.round(sheenAt * fps);
  const sheenP = interpolate(frame, [sheenStart, sheenStart + Math.round(0.8 * fps)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const sheenX = interpolate(sheenP, [0, 1], [-120, 220], CLAMP);
  const sheenOp = interpolate(sheenP, [0, 0.15, 0.85, 1], [0, 1, 1, 0], CLAMP);

  const bracket = 2;
  const corners: React.CSSProperties[] = [
    {top: 0, left: 0, borderTop: `${bracket}px solid ${accent}`, borderLeft: `${bracket}px solid ${accent}`, borderTopLeftRadius: 6},
    {top: 0, right: 0, borderTop: `${bracket}px solid ${accent}`, borderRight: `${bracket}px solid ${accent}`, borderTopRightRadius: 6},
    {bottom: 0, left: 0, borderBottom: `${bracket}px solid ${accent}`, borderLeft: `${bracket}px solid ${accent}`, borderBottomLeftRadius: 6},
    {bottom: 0, right: 0, borderBottom: `${bracket}px solid ${accent}`, borderRight: `${bracket}px solid ${accent}`, borderBottomRightRadius: 6},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        transform: `translate(-50%, -50%) translateY(${enterY + floatY}px) rotate(${rot}deg) scale(${enterScale})`,
        opacity,
        willChange: 'transform, filter, opacity',
      }}
    >
      <div style={{position: 'relative', width: '100%'}}>
        <div
          style={{
            position: 'absolute',
            inset: '-22%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, glowPulse)} 0%, ${rgba(
              accent,
              glowPulse * 0.35
            )} 42%, transparent 72%)`,
            filter: 'blur(30px)',
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: String(aspect),
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,240,210,0.16)',
            background: '#0b0f0a',
            filter: `blur(${focusBlur + rack}px) drop-shadow(0 ${height * 0.03}px ${
              height * 0.05
            }px rgba(1,3,2,0.6))`,
          }}
        >
          <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(255,246,225,0.1), transparent 26%)',
              boxShadow: 'inset 0 0 70px rgba(2,4,2,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '60%',
              transform: `translateX(${sheenX}%) skewX(-14deg)`,
              background:
                'linear-gradient(100deg, transparent 30%, rgba(255,246,225,0.18) 50%, transparent 70%)',
              mixBlendMode: 'screen',
              opacity: sheenOp,
            }}
          />
        </div>
        {brackets ? (
          <div
            style={{
              position: 'absolute',
              inset: -16,
              opacity: brOp,
              transform: `scale(${brScale})`,
              pointerEvents: 'none',
            }}
          >
            {corners.map((s, i) => (
              <div key={i} style={{position: 'absolute', width: 28, height: 28, ...s}} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* --------------------- anillos orbitales (Activo) ------------------------- */

const OrbitField: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  count: number;
  seed: string;
  accent: string;
  speed: number;
  half: 'front' | 'back' | 'all';
  blur?: number;
  showPath?: boolean;
}> = ({cx, cy, rx, ry, count, seed, accent, speed, half, blur = 0, showPath = false}) => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        ph: random(`${seed}-op-${i}`) * Math.PI * 2,
        s: 4 + random(`${seed}-os-${i}`) * 7,
        o: 0.5 + random(`${seed}-oo-${i}`) * 0.5,
        spMul: 0.8 + random(`${seed}-osp-${i}`) * 0.4,
      })),
    [count, seed]
  );
  return (
    <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined, pointerEvents: 'none'}}>
      {showPath ? (
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={rgba(accent, 0.18)}
            strokeWidth={1.5}
            strokeDasharray="2 10"
          />
        </svg>
      ) : null}
      {dots.map((d, i) => {
        const ang = d.ph + frame * speed * d.spMul;
        const z = Math.sin(ang);
        if (half === 'front' && z < -0.05) return null;
        if (half === 'back' && z > 0.05) return null;
        const x = cx + Math.cos(ang) * rx;
        const y = cy + z * ry;
        const depth = (z + 1) / 2;
        const edgeFade = Math.min(1, Math.abs(z) * 4 + 0.15);
        const op = (0.25 + depth * 0.75) * d.o * edgeFade;
        const s = d.s * (0.55 + depth * 0.75);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: '50%',
              background: rgba(accent, op),
              boxShadow: `0 0 ${s * 3}px ${s * 0.8}px ${rgba(accent, op * 0.7)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* --------------------- conectores de energía (Activo) --------------------- */

const EnergyConnectors: React.FC<{
  accent: string;
  from: {x: number; y: number};
  to: {x: number; y: number}[];
}> = ({accent, from, to}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {to.map((p, i) => {
          const mx = (from.x + p.x) / 2;
          const my = Math.min(from.y, p.y) - 90;
          const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${p.x} ${p.y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={rgba(accent, 0.2)} strokeWidth={1.4} />
              <path
                d={d}
                fill="none"
                stroke={rgba(accent, 0.75)}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeDasharray="2 34"
                strokeDashoffset={-frame * 2.4 - i * 18}
              />
            </g>
          );
        })}
      </svg>
      {to.map((p, i) => {
        const t = mod(frame * 0.016 + i * 0.37, 1);
        const breathe = 0.7 + 0.3 * Math.sin(frame * 0.08 + i * 2.1);
        return (
          <div
            key={i}
            style={{position: 'absolute', left: p.x, top: p.y, width: 0, height: 0}}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 54,
                height: 54,
                transform: `translate(-50%, -50%) scale(${0.6 + t * 1.5})`,
                borderRadius: '50%',
                border: `1px solid ${rgba(accent, (1 - t) * 0.5)}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 11,
                height: 11,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: accent,
                opacity: 0.85 * breathe,
                boxShadow: `0 0 ${16 * breathe}px ${6 * breathe}px ${rgba(accent, 0.8)}`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------- marca molecular (Activo) ----------------------- */

const MoleculeMark: React.FC<{
  cx: number;
  cy: number;
  r: number;
  accent: string;
  speed: number;
  opacity: number;
}> = ({cx, cy, r, accent, speed, opacity}) => {
  const frame = useCurrentFrame();
  const hex = Array.from({length: 6}, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${100 + 78 * Math.cos(a)},${100 + 78 * Math.sin(a)}`;
  }).join(' ');
  const verts = Array.from({length: 6}, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return {x: 100 + 78 * Math.cos(a), y: 100 + 78 * Math.sin(a)};
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        transform: `rotate(${frame * speed}deg)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <polygon points={hex} fill="none" stroke={rgba(accent, 0.5)} strokeWidth={1.2} />
        <circle
          cx={100}
          cy={100}
          r={30}
          fill="none"
          stroke={rgba(accent, 0.35)}
          strokeWidth={1}
          strokeDasharray="3 6"
        />
        {verts.map((v, i) => (
          <g key={i}>
            <circle cx={v.x} cy={v.y} r={5} fill="#0a120c" stroke={rgba(accent, 0.7)} strokeWidth={1.4} />
            <circle
              cx={v.x + (v.x - 100) * 0.28}
              cy={v.y + (v.y - 100) * 0.28}
              r={2.4}
              fill={rgba(accent, 0.8)}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/* --------------------- rayos + halos (Cierre) ----------------------------- */

const RayBurst: React.FC<{cx: number; cy: number; accent: string}> = ({cx, cy, accent}) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.12;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: 'blur(3px)',
        mixBlendMode: 'screen',
        opacity: 0.5 + 0.1 * Math.sin(frame * 0.05),
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%">
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {new Array(16).fill(0).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const len = 900 + (i % 3) * 180;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(a) * len}
                y2={cy + Math.sin(a) * len}
                stroke={rgba(accent, i % 2 ? 0.1 : 0.05)}
                strokeWidth={i % 2 ? 5 : 10}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const HaloRings: React.FC<{cx: number; cy: number; accent: string}> = ({cx, cy, accent}) => {
  const frame = useCurrentFrame();
  const rings = [
    {r: 300, w: 1.6, o: 0.4, dash: '2 14', sp: 0.6},
    {r: 392, w: 1.1, o: 0.28, dash: '1 22', sp: -0.4},
    {r: 486, w: 0.9, o: 0.18, dash: '1 30', sp: 0.25},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        {rings.map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r.r + Math.sin(frame * 0.04 + i * 1.7) * 7}
            fill="none"
            stroke={rgba(accent, r.o)}
            strokeWidth={r.w}
            strokeDasharray={r.dash}
            strokeDashoffset={frame * r.sp}
          />
        ))}
      </svg>
    </div>
  );
};

/* ------------------------------ post: grade ------------------------------- */

const GradeOverlay: React.FC<{accent: string}> = ({accent}) => (
  <AbsoluteFill
    style={{
      zIndex: 6,
      pointerEvents: 'none',
      background: [
        'radial-gradient(125% 100% at 50% 44%, transparent 52%, rgba(3,2,1,0.55) 100%)',
        'linear-gradient(to bottom, rgba(5,4,2,0.5), transparent 16%, transparent 82%, rgba(5,4,2,0.55))',
        `linear-gradient(115deg, ${rgba(accent, 0.06)}, transparent 32%, transparent 68%, rgba(10,6,2,0.18))`,
      ].join(', '),
    }}
  />
);

const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const q = Math.floor(frame / 2);
  const jx = (random(`grain-x-${q}`) - 0.5) * 10;
  const jy = (random(`grain-y-${q}`) - 0.5) * 10;
  return (
    <div
      style={{
        position: 'absolute',
        inset: '-5%',
        zIndex: 20,
        pointerEvents: 'none',
        opacity: 0.055,
        mixBlendMode: 'overlay',
        transform: `translate(${jx}px, ${jy}px)`,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="fed2Grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fed2Grain)" />
      </svg>
    </div>
  );
};

/* --------------------------- backdrop de escena --------------------------- */

const SceneBackdrop: React.FC<{bg: string; moteTint: string; seed: string}> = ({
  bg,
  moteTint,
  seed,
}) => {
  const {height} = useVideoConfig();
  const farMotes = React.useMemo(
    () => makeMotes(14, `${seed}-far`, 3, 9, 0.05, 0.1, 0.12, 0.3),
    [seed]
  );
  return (
    <AbsoluteFill style={{filter: 'blur(12px)', transform: 'scale(1.18)'}}>
      <AbsoluteFill style={{background: bg}} />
      <MotesLayer motes={farMotes} blur={0} scale={height / 1080} tint={moteTint} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(115% 95% at 50% 42%, transparent 42%, rgba(2,3,2,0.8) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------ parallax ---------------------------------- */

const ParallaxLayer: React.FC<{
  factor: number;
  z: number;
  px: number;
  py: number;
  children: React.ReactNode;
}> = ({factor, z, px, py, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: z,
      transform: `translate(${px * factor}px, ${py * factor}px)`,
      willChange: 'transform',
    }}
  >
    {children}
  </div>
);

const useDepthCamera = (dur: number) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const push = interpolate(frame, [0, dur], [1, 1.05], CLAMP);
  const camX = interpolate(frame, [0, dur], [0, width * 0.014], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0015 + Math.sin(frame * 0.013 + 1.2) * width * 0.002;
  const handY = Math.cos(frame * 0.04 + 0.8) * height * 0.0016;
  return {push, px: camX + handX, py: handY};
};

/* ========================= TRANSITION SHELL (contrato) =====================
   whip-pan + blur + stretch + light-sweep dorado + flash de exposición.
   Entrada: frames 0..TR · Salida: frames dur-TR..dur-1 · Overlap: TR (12f). */

const TransitionShell: React.FC<{
  durationInFrames: number;
  accent: string;
  children: React.ReactNode;
}> = ({durationInFrames, accent, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const dur = Math.max(TR * 2 + 2, durationInFrames);

  const inP = interpolate(frame, [0, TR], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const outP = interpolate(frame, [dur - TR, dur - 1], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });

  const wx = (1 - inP) * width * 0.5 - outP * width * 0.5;
  const blur = (1 - inP) * 16 + outP * 16;
  const stretch = 1 + (1 - inP + outP) * 0.06;
  const flashEnv = Math.max(inP * (1 - inP), outP * (1 - outP)) * 4;
  const sweepProg = frame < dur / 2 ? inP : outP;
  const sweepLeft = interpolate(sweepProg, [0, 1], [-35, 135], CLAMP);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#050403'}}>
      <AbsoluteFill
        style={{
          transform: `translateX(${wx}px) scaleX(${stretch})`,
          filter: `blur(${blur}px)`,
          transformOrigin: '50% 50%',
          willChange: 'transform, filter',
        }}
      >
        {children}
      </AbsoluteFill>
      {/* barrido de luz */}
      <AbsoluteFill
        style={{
          zIndex: 40,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: Math.min(1, flashEnv * 0.95),
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            left: `${sweepLeft}%`,
            width: '36%',
            transform: 'translateX(-50%) skewX(-16deg)',
            background: `linear-gradient(90deg, transparent, ${rgba(
              accent,
              0.5
            )} 42%, rgba(255,242,218,0.85) 55%, ${rgba(accent, 0.4)} 68%, transparent)`,
          }}
        />
      </AbsoluteFill>
      {/* flash de exposición */}
      <AbsoluteFill
        style={{
          zIndex: 41,
          pointerEvents: 'none',
          background: `linear-gradient(120deg, rgba(255,240,208,0.95), ${rgba(accent, 0.85)})`,
          opacity: flashEnv * 0.2,
        }}
      />
    </AbsoluteFill>
  );
};

/* ============================== TEXTO DE ESCENA ============================ */

const SceneCaption: React.FC<{
  kicker?: string;
  title: string;
  sub?: string;
  accent: string;
  left?: string;
  top?: string;
  width?: string;
  align?: 'left' | 'center';
  startAt?: number;
  durationInFrames: number;
  subPill?: boolean;
}> = ({
  kicker,
  title,
  sub,
  accent,
  left = '7%',
  top = '40%',
  width = '52%',
  align = 'left',
  startAt = 0.9,
  durationInFrames,
  subPill = false,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: vw, height: vh} = useVideoConfig();
  const center = align === 'center';

  const words = React.useMemo(() => title.trim().split(/\s+/).filter(Boolean), [title]);
  const tailReserve = 1.1;
  const windowSec = Math.max(0.5, durationInFrames / fps - startAt - tailReserve);
  const stagger =
    words.length > 1 ? Math.min(0.34, Math.max(0.12, windowSec / (words.length - 1))) : 0;
  const subStart = startAt + stagger * (words.length - 1) + 0.4;

  const fontSize = Math.round(Math.min(vw * 0.052, vh * 0.08));

  const rb = spring({
    frame: frame - Math.round((startAt - 0.2) * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.8},
  });
  const ruleW = interpolate(rb, [0, 1], [0, Math.min(vw * 0.07, 110)], CLAMP);

  const subP = spring({
    frame: frame - Math.round(subStart * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });
  const pulse = 0.55 + 0.45 * Math.sin(frame * 0.09);

  return (
    <div style={{position: 'absolute', left, top, width, textAlign: center ? 'center' : 'left'}}>
      {kicker ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            justifyContent: center ? 'center' : 'flex-start',
            marginBottom: fontSize * 0.28,
            opacity: interpolate(rb, [0, 0.4], [0, 0.95], CLAMP),
          }}
        >
          <div style={{width: ruleW, height: 2, background: accent, boxShadow: `0 0 12px ${rgba(accent, 0.7)}`}} />
          <div
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 600,
              fontSize: Math.round(fontSize * 0.21),
              letterSpacing: '0.34em',
              color: accent,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {kicker}
          </div>
          {center ? (
            <div style={{width: ruleW, height: 2, background: accent, boxShadow: `0 0 12px ${rgba(accent, 0.7)}`}} />
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 800,
          fontSize,
          lineHeight: 1.04,
          letterSpacing: '-0.015em',
          textTransform: 'uppercase',
          color: '#f7f2e6',
        }}
      >
        {words.map((word, i) => {
          const s0 = Math.round((startAt + i * stagger) * fps);
          const wsp = spring({frame: frame - s0, fps, config: {damping: 13, stiffness: 170, mass: 0.7}});
          const y = interpolate(wsp, [0, 1], [30, 0], CLAMP);
          const b = Math.max(0, interpolate(wsp, [0, 1], [12, 0], CLAMP));
          const o = interpolate(wsp, [0, 0.35], [0, 1], CLAMP);
          const s = interpolate(wsp, [0, 1], [0.72, 1], CLAMP) * (1 + Math.max(0, wsp - 1) * 0.25);
          const hot = /[\d$€%]/.test(word);
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: 'inline-block',
                marginRight: '0.26em',
                transform: `translateY(${y}px) scale(${s})`,
                opacity: o,
                filter: `blur(${b}px)`,
                color: hot ? accent : '#f7f2e6',
                textShadow: hot
                  ? `0 0 26px ${rgba(accent, 0.45)}, 0 4px 18px rgba(0,0,0,0.55)`
                  : '0 4px 22px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.7)',
                willChange: 'transform, filter, opacity',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: fontSize * 0.34,
            opacity: interpolate(subP, [0, 1], [0, 0.96], CLAMP),
            transform: `translateY(${interpolate(subP, [0, 1], [16, 0], CLAMP)}px)`,
            filter: `blur(${Math.max(0, interpolate(subP, [0, 1], [8, 0], CLAMP))}px)`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: subPill ? 600 : 500,
              fontSize: Math.round(fontSize * 0.3),
              letterSpacing: subPill ? '0.14em' : '0.02em',
              textTransform: subPill ? 'uppercase' : 'none',
              color: subPill ? accent : 'rgba(232,228,214,0.9)',
              ...(subPill
                ? {
                    border: `1.5px solid ${rgba(accent, 0.75)}`,
                    borderRadius: 999,
                    padding: '0.55em 1.4em',
                    boxShadow: `0 0 ${14 + pulse * 10}px ${rgba(accent, 0.25 + 0.2 * pulse)}, inset 0 0 18px ${rgba(accent, 0.12)}`,
                    background: 'rgba(10,8,4,0.35)',
                  }
                : {borderLeft: `3px solid ${accent}`, paddingLeft: 14}),
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            {sub}
          </span>
        </div>
      ) : null}
    </div>
  );
};

/* ================================ BACKGROUNDS ============================== */

const BG_HERO = [
  'radial-gradient(95% 75% at 68% 26%, rgba(227,180,92,0.15) 0%, transparent 55%)',
  'radial-gradient(120% 95% at 74% 30%, rgba(86,110,62,0.5) 0%, rgba(28,38,22,0.35) 42%, transparent 74%)',
  'radial-gradient(85% 75% at 14% 90%, rgba(52,68,38,0.42) 0%, transparent 60%)',
  'linear-gradient(158deg, #12140c 0%, #0a0c07 46%, #050604 100%)',
].join(', ');

const BG_ACTIVO = [
  'radial-gradient(70% 60% at 50% 46%, rgba(227,180,92,0.13) 0%, transparent 60%)',
  'radial-gradient(120% 95% at 50% 40%, rgba(20,68,48,0.55) 0%, rgba(8,26,18,0.35) 48%, transparent 78%)',
  'radial-gradient(80% 70% at 85% 90%, rgba(16,52,38,0.4) 0%, transparent 62%)',
  'linear-gradient(165deg, #08140e 0%, #050d09 50%, #020604 100%)',
].join(', ');

const BG_RITUAL = [
  'radial-gradient(90% 70% at 30% 20%, rgba(214,226,220,0.1) 0%, transparent 55%)',
  'radial-gradient(120% 90% at 30% 30%, rgba(34,72,66,0.5) 0%, rgba(12,28,26,0.32) 45%, transparent 75%)',
  'radial-gradient(70% 60% at 82% 88%, rgba(196,123,67,0.12) 0%, transparent 60%)',
  'linear-gradient(160deg, #0a1211 0%, #060b0a 48%, #030505 100%)',
].join(', ');

const BG_PRUEBA = [
  'radial-gradient(110% 85% at 50% 40%, rgba(90,74,54,0.4) 0%, rgba(30,24,18,0.3) 45%, transparent 75%)',
  'radial-gradient(80% 65% at 50% 105%, rgba(227,180,92,0.1) 0%, transparent 60%)',
  'linear-gradient(160deg, #14110d 0%, #0b0908 50%, #050403 100%)',
].join(', ');

const BG_CIERRE = [
  'radial-gradient(75% 62% at 50% 42%, rgba(227,180,92,0.22) 0%, rgba(120,80,32,0.12) 40%, transparent 68%)',
  'radial-gradient(130% 100% at 50% 45%, rgba(66,44,20,0.5) 0%, rgba(24,16,8,0.35) 50%, transparent 80%)',
  'linear-gradient(160deg, #14100a 0%, #0a0705 52%, #040302 100%)',
].join(', ');

/* ============================ 1 · FED2-HERO ================================ */

export type HeroProps = {
  src: string;
  ghostSrc: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  durationInFrames: number;
};

export const HeroScene: React.FC<HeroProps> = ({
  src,
  ghostSrc,
  kicker,
  title,
  sub,
  accent = GOLD,
  durationInFrames,
}) => {
  const {width: vw, height: vh} = useVideoConfig();
  const {push, px, py} = useDepthCamera(durationInFrames);
  const midMotes = React.useMemo(
    () => makeMotes(14, 'hero-mid', 2, 5.5, 0.03, 0.08, 0.28, 0.65),
    []
  );
  const heroW = Math.min(vw * 0.4, vh * 0.66 * 1.5);

  return (
    <TransitionShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: '#050604', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
          {/* 1 · fondo */}
          <ParallaxLayer factor={0.2} z={1} px={px} py={py}>
            <SceneBackdrop bg={BG_HERO} moteTint="214, 226, 190" seed="hero" />
          </ParallaxLayer>
          {/* 2 · motas medias */}
          <ParallaxLayer factor={0.38} z={2} px={px} py={py}>
            <MotesLayer motes={midMotes} blur={1.5} scale={vh / 1080} tint="222, 210, 170" />
          </ParallaxLayer>
          {/* 3 · luz volumétrica detrás */}
          <ParallaxLayer factor={0.5} z={2} px={px} py={py}>
            <VolumetricLayer accent={accent} side="right" intensity={0.9} />
          </ParallaxLayer>
          {/* 4 · eco fantasma del romero (atrás-izquierda) */}
          <ParallaxLayer factor={0.45} z={2} px={px} py={py}>
            <DepthGhost
              src={ghostSrc}
              left="-5%"
              top="6%"
              width="36%"
              rotate={-18}
              blur={7}
              brightness={0.4}
              opacity={0.7}
              swayAmp={10}
              phase={2}
            />
          </ParallaxLayer>
          {/* 5 · HERO nítido */}
          <ParallaxLayer factor={0.65} z={3} px={px} py={py}>
            <HeroCard
              src={src}
              accent={accent}
              left="62%"
              top="47%"
              w={heroW}
              rotBase={-2.5}
              glowMul={1.1}
            />
          </ParallaxLayer>
          {/* 6 · velo de luz delante del hero */}
          <ParallaxLayer factor={0.9} z={4} px={px} py={py}>
            <VolumetricLayer accent={accent} side="right" intensity={0.32} blur={24} />
          </ParallaxLayer>
          {/* 7 · bokeh delante */}
          <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
            <BokehLayer
              seed="hero-bk"
              count={7}
              blur={7}
              tintGold="238, 206, 140"
              tintPale="235, 232, 220"
              scale={vh / 1080}
            />
          </ParallaxLayer>
          {/* 8 · oclusor foreground: rama gigante desenfocada */}
          <ParallaxLayer factor={1.35} z={5} px={px} py={py}>
            <DepthGhost
              src={ghostSrc}
              right="-7%"
              bottom="-14%"
              width="42%"
              rotate={24}
              blur={10}
              brightness={0.3}
              opacity={0.95}
              swayAmp={18}
              phase={0.6}
              flip
            />
          </ParallaxLayer>
          {/* 9 · grade */}
          <GradeOverlay accent={accent} />
          {/* 10 · texto */}
          <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
            <SceneCaption
              kicker={kicker}
              title={title}
              sub={sub}
              accent={accent}
              left="7%"
              top="37%"
              width="42%"
              durationInFrames={durationInFrames}
            />
          </ParallaxLayer>
        </AbsoluteFill>
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* =========================== 2 · FED2-ACTIVO =============================== */

export type ActivoProps = {
  src: string;
  echoSrc: string;
  ghostSrc: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  durationInFrames: number;
};

export const ActivoScene: React.FC<ActivoProps> = ({
  src,
  echoSrc,
  ghostSrc,
  kicker,
  title,
  sub,
  accent = GOLD,
  durationInFrames,
}) => {
  const {width: vw, height: vh} = useVideoConfig();
  const {push, px, py} = useDepthCamera(durationInFrames);
  const midMotes = React.useMemo(
    () => makeMotes(12, 'act-mid', 2, 5, 0.03, 0.07, 0.25, 0.6),
    []
  );
  const heroW = Math.min(vw * 0.24, vh * 0.6 * 0.8);
  const cx = vw * 0.5;
  const cy = vh * 0.47;

  return (
    <TransitionShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: '#020604', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
          {/* 1 · fondo esmeralda */}
          <ParallaxLayer factor={0.2} z={1} px={px} py={py}>
            <SceneBackdrop bg={BG_ACTIVO} moteTint="200, 230, 200" seed="activo" />
          </ParallaxLayer>
          {/* 2 · eco del colágeno, muy atrás */}
          <ParallaxLayer factor={0.3} z={1} px={px} py={py}>
            <DepthGhost
              src={echoSrc}
              left="72%"
              top="58%"
              width="24%"
              rotate={14}
              blur={9}
              brightness={0.35}
              opacity={0.55}
              swayAmp={8}
              phase={3}
            />
          </ParallaxLayer>
          {/* 3 · motas medias */}
          <ParallaxLayer factor={0.38} z={2} px={px} py={py}>
            <MotesLayer motes={midMotes} blur={1.5} scale={vh / 1080} tint="210, 226, 190" />
          </ParallaxLayer>
          {/* 4 · marcas moleculares contra-rotando */}
          <ParallaxLayer factor={0.48} z={2} px={px} py={py}>
            <MoleculeMark cx={vw * 0.26} cy={vh * 0.68} r={120} accent={accent} speed={0.1} opacity={0.5} />
            <MoleculeMark cx={vw * 0.76} cy={vh * 0.28} r={88} accent={accent} speed={-0.14} opacity={0.35} />
          </ParallaxLayer>
          {/* 5 · anillo orbital TRASERO (pasa por detrás del núcleo) */}
          <ParallaxLayer factor={0.58} z={2} px={px} py={py}>
            <OrbitField cx={cx} cy={cy} rx={460} ry={150} count={16} seed="orb1" accent={accent} speed={0.014} half="back" showPath />
            <OrbitField cx={cx} cy={cy} rx={570} ry={215} count={12} seed="orb2" accent={accent} speed={-0.009} half="back" />
          </ParallaxLayer>
          {/* 6 · NÚCLEO: el activo */}
          <ParallaxLayer factor={0.65} z={3} px={px} py={py}>
            <HeroCard
              src={src}
              accent={accent}
              left="50%"
              top="47%"
              w={heroW}
              aspect={4 / 5}
              rotBase={0}
              glowMul={1.6}
              floatAmp={0.8}
              sheenAt={1.6}
            />
          </ParallaxLayer>
          {/* 7 · conectores de energía hacia satélites */}
          <ParallaxLayer factor={0.7} z={3} px={px} py={py}>
            <EnergyConnectors
              accent={accent}
              from={{x: cx, y: cy}}
              to={[
                {x: vw * 0.22, y: vh * 0.26},
                {x: vw * 0.8, y: vh * 0.24},
                {x: vw * 0.76, y: vh * 0.72},
              ]}
            />
          </ParallaxLayer>
          {/* 8 · anillo orbital DELANTERO (desenfocado, ocluye) */}
          <ParallaxLayer factor={0.85} z={4} px={px} py={py}>
            <OrbitField cx={cx} cy={cy} rx={460} ry={150} count={16} seed="orb1" accent={accent} speed={0.014} half="front" blur={2} />
            <OrbitField cx={cx} cy={cy} rx={570} ry={215} count={12} seed="orb2" accent={accent} speed={-0.009} half="front" blur={3} />
          </ParallaxLayer>
          {/* 9 · bokeh */}
          <ParallaxLayer factor={1.2} z={4} px={px} py={py}>
            <BokehLayer
              seed="act-bk"
              count={6}
              blur={8}
              tintGold="238, 206, 140"
              tintPale="226, 238, 226"
              scale={vh / 1080}
            />
          </ParallaxLayer>
          {/* 10 · oclusor */}
          <ParallaxLayer factor={1.35} z={5} px={px} py={py}>
            <DepthGhost
              src={ghostSrc}
              left="-6%"
              bottom="-12%"
              width="34%"
              rotate={-20}
              blur={10}
              brightness={0.28}
              opacity={0.9}
              swayAmp={16}
              phase={1.4}
            />
          </ParallaxLayer>
          {/* 11 · grade */}
          <GradeOverlay accent={accent} />
          {/* 12 · texto */}
          <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
            <SceneCaption
              kicker={kicker}
              title={title}
              sub={sub}
              accent={accent}
              left="6.5%"
              top="26%"
              width="30%"
              durationInFrames={durationInFrames}
            />
          </ParallaxLayer>
        </AbsoluteFill>
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* =========================== 3 · FED2-RITUAL =============================== */

export type RitualProps = {
  src: string;
  echoSrc: string;
  steamSrc: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  durationInFrames: number;
};

export const RitualScene: React.FC<RitualProps> = ({
  src,
  echoSrc,
  steamSrc,
  kicker,
  title,
  sub,
  accent = GOLD,
  durationInFrames,
}) => {
  const {width: vw, height: vh} = useVideoConfig();
  const {push, px, py} = useDepthCamera(durationInFrames);
  const midMotes = React.useMemo(
    () => makeMotes(12, 'rit-mid', 2, 5, 0.025, 0.06, 0.22, 0.55),
    []
  );
  const heroW = Math.min(vw * 0.3, vh * 0.58);

  return (
    <TransitionShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: '#030505', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
          {/* 1 · fondo teal */}
          <ParallaxLayer factor={0.2} z={1} px={px} py={py}>
            <SceneBackdrop bg={BG_RITUAL} moteTint="214, 228, 224" seed="ritual" />
          </ParallaxLayer>
          {/* 2 · motas */}
          <ParallaxLayer factor={0.36} z={2} px={px} py={py}>
            <MotesLayer motes={midMotes} blur={1.5} scale={vh / 1080} tint="206, 224, 218" />
          </ParallaxLayer>
          {/* 3 · luz volumétrica superior-izquierda */}
          <ParallaxLayer factor={0.5} z={2} px={px} py={py}>
            <VolumetricLayer accent="#DfE8DC" side="left" intensity={0.7} />
          </ParallaxLayer>
          {/* 4 · ecos del cubito a dos profundidades */}
          <ParallaxLayer factor={0.42} z={2} px={px} py={py}>
            <DepthGhost
              src={echoSrc}
              left="74%"
              top="10%"
              width="16%"
              rotate={-12}
              blur={5}
              brightness={0.5}
              opacity={0.6}
              swayAmp={9}
              phase={2.2}
            />
          </ParallaxLayer>
          <ParallaxLayer factor={0.32} z={2} px={px} py={py}>
            <DepthGhost
              src={echoSrc}
              left="6%"
              bottom="-10%"
              width="26%"
              rotate={15}
              blur={9}
              brightness={0.32}
              opacity={0.55}
              swayAmp={7}
              phase={4}
            />
          </ParallaxLayer>
          {/* 5 · vapor TRASERO */}
          <ParallaxLayer factor={0.55} z={2} px={px} py={py}>
            <SteamLayer seed="st-back" count={9} blur={18} xMin={22} xMax={52} brightness={0.7} />
          </ParallaxLayer>
          {/* 6 · HERO cubito */}
          <ParallaxLayer factor={0.65} z={3} px={px} py={py}>
            <HeroCard
              src={src}
              accent={accent}
              left="37%"
              top="50%"
              w={heroW}
              aspect={1}
              rotBase={2}
              glowMul={0.9}
              sheenAt={1.5}
            />
          </ParallaxLayer>
          {/* 7 · vapor DELANTERO (envuelve el hero) */}
          <ParallaxLayer factor={0.9} z={4} px={px} py={py}>
            <SteamLayer seed="st-front" count={7} blur={9} xMin={18} xMax={58} brightness={1} />
          </ParallaxLayer>
          {/* 8 · bokeh */}
          <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
            <BokehLayer
              seed="rit-bk"
              count={6}
              blur={7}
              tintGold="238, 206, 140"
              tintPale="228, 238, 234"
              scale={vh / 1080}
            />
          </ParallaxLayer>
          {/* 9 · velo de vapor near-field cruzando cámara */}
          <ParallaxLayer factor={1.4} z={5} px={px} py={py}>
            <DepthGhost
              src={steamSrc}
              right="-10%"
              bottom="-18%"
              width="62%"
              rotate={6}
              blur={16}
              brightness={1.05}
              opacity={0.32}
              swayAmp={26}
              swaySpeed={0.03}
              blendScreen
            />
          </ParallaxLayer>
          {/* 10 · grade */}
          <GradeOverlay accent={accent} />
          {/* 11 · texto */}
          <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
            <SceneCaption
              kicker={kicker}
              title={title}
              sub={sub}
              accent={accent}
              left="61%"
              top="34%"
              width="33%"
              durationInFrames={durationInFrames}
            />
          </ParallaxLayer>
        </AbsoluteFill>
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* =========================== 4 · FED2-PRUEBA =============================== */

const ProofCard: React.FC<{
  src: string;
  label: string;
  active: number; // 0..1 — controla rack-focus
  accent: string;
  left: string;
  top: string;
  w: number;
  rot: number;
  delay: number;
}> = ({src, label, active, accent, left, top, w, rot, delay}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const enter = spring({
    frame: frame - Math.round(delay * fps),
    fps,
    config: {damping: 22, stiffness: 70, mass: 1},
  });
  const eBlur = Math.max(0, interpolate(enter, [0, 1], [16, 0], CLAMP));
  const eY = interpolate(enter, [0, 1], [40, 0], CLAMP);
  const eOp = interpolate(enter, [0, 0.3], [0, 1], CLAMP);
  const rack = (enter >= 1 ? 0.5 + 0.5 * Math.sin(frame * 0.05 + delay * 4) : 0) * 0.7;
  const blur = eBlur + (1 - active) * 11 + rack;
  const bright = 0.55 + 0.45 * active;
  const sc = interpolate(enter, [0, 1], [1.1, 1], CLAMP) * (0.93 + 0.07 * active);
  const floatY = Math.sin(frame * 0.07 + delay * 3) * height * 0.004;
  const glowA = 0.08 + 0.3 * active;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        transform: `translate(-50%, -50%) translateY(${eY + floatY}px) rotate(${rot}deg) scale(${sc})`,
        opacity: eOp,
        willChange: 'transform, filter, opacity',
      }}
    >
      <div style={{position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            inset: '-14%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, glowA)}, transparent 70%)`,
            filter: 'blur(24px)',
            zIndex: -1,
          }}
        />
        {/* chip de estado */}
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: 18,
            transform: 'translateY(-100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 0.4 + 0.6 * active,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 ${8 + active * 12}px ${rgba(accent, 0.85)}`,
            }}
          />
          <div
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontWeight: 700,
              fontSize: Math.round(w * 0.048),
              letterSpacing: '0.3em',
              color: '#f2ecdc',
            }}
          >
            {label}
          </div>
          <div style={{width: 44, height: 2, background: rgba(accent, 0.25 + 0.75 * active)}} />
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: String(4 / 3),
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${rgba(accent, 0.12 + 0.28 * active)}`,
            background: '#0c0a08',
            filter: `blur(${blur}px) brightness(${bright}) drop-shadow(0 ${height * 0.025}px ${
              height * 0.045
            }px rgba(0,0,0,0.55))`,
          }}
        >
          <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(255,246,225,0.08), transparent 25%)',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: -26,
            height: 30,
            borderRadius: '50%',
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.5), transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </div>
    </div>
  );
};

export type PruebaProps = {
  beforeSrc: string;
  afterSrc: string;
  ghostSrc: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  durationInFrames: number;
};

export const PruebaScene: React.FC<PruebaProps> = ({
  beforeSrc,
  afterSrc,
  ghostSrc,
  kicker,
  title,
  sub,
  accent = GOLD,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: vw, height: vh} = useVideoConfig();
  const {push, px, py} = useDepthCamera(durationInFrames);
  const midMotes = React.useMemo(
    () => makeMotes(12, 'pru-mid', 2, 5, 0.03, 0.07, 0.22, 0.5),
    []
  );

  // rack-focus entre estados: swap 2.3s → 3.2s
  const sw0 = Math.round(2.3 * fps);
  const sw1 = Math.round(3.2 * fps);
  const swap = interpolate(frame, [sw0, sw1], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const scanX = interpolate(frame, [sw0, sw1], [26, 74], CLAMP);
  const scanEnv = interpolate(
    frame,
    [sw0, sw0 + 6, sw1 - 6, sw1],
    [0, 1, 1, 0],
    CLAMP
  );
  // retícula de foco viajando de ANTES a DESPUÉS
  const retX = interpolate(swap, [0, 1], [31, 67], CLAMP);
  const retY = interpolate(swap, [0, 1], [50, 52], CLAMP);
  const retOp = interpolate(frame, [sw0 - 5, sw0, sw1, sw1 + 5], [0, 0.9, 0.9, 0], CLAMP);
  const retR = 120 - swap * 30 + Math.sin(frame * 0.2) * 3;

  const wBefore = vw * 0.3;
  const wAfter = vw * 0.315;

  return (
    <TransitionShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: '#050403', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
          {/* 1 · fondo + eco gigante de piel */}
          <ParallaxLayer factor={0.2} z={1} px={px} py={py}>
            <SceneBackdrop bg={BG_PRUEBA} moteTint="230, 214, 186" seed="prueba" />
          </ParallaxLayer>
          <ParallaxLayer factor={0.26} z={1} px={px} py={py}>
            <DepthGhost
              src={afterSrc}
              left="-15%"
              top="-18%"
              width="130%"
              rotate={0}
              blur={34}
              brightness={0.5}
              opacity={0.28}
              swayAmp={6}
              swaySpeed={0.02}
            />
          </ParallaxLayer>
          {/* 2 · motas */}
          <ParallaxLayer factor={0.38} z={2} px={px} py={py}>
            <MotesLayer motes={midMotes} blur={1.5} scale={vh / 1080} tint="230, 214, 180" />
          </ParallaxLayer>
          {/* 3 · divisor central hairline */}
          <ParallaxLayer factor={0.5} z={2} px={px} py={py}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '18%',
                height: '64%',
                width: 1,
                background: `linear-gradient(to bottom, transparent, ${rgba(accent, 0.3)} 30%, ${rgba(
                  accent,
                  0.3
                )} 70%, transparent)`,
                boxShadow: `0 0 14px ${rgba(accent, 0.25)}`,
              }}
            />
          </ParallaxLayer>
          {/* 4 · ANTES (plano trasero) */}
          <ParallaxLayer factor={0.5} z={3} px={px} py={py}>
            <ProofCard
              src={beforeSrc}
              label="ANTES"
              active={1 - swap}
              accent={accent}
              left="31%"
              top="50%"
              w={wBefore}
              rot={-2}
              delay={0.35}
            />
          </ParallaxLayer>
          {/* 5 · DESPUÉS (plano delantero, parallax distinto → se separan) */}
          <ParallaxLayer factor={0.72} z={4} px={px} py={py}>
            <ProofCard
              src={afterSrc}
              label="DESPUÉS"
              active={swap}
              accent={accent}
              left="67%"
              top="52%"
              w={wAfter}
              rot={1.5}
              delay={0.5}
            />
          </ParallaxLayer>
          {/* 6 · retícula de foco */}
          <ParallaxLayer factor={0.8} z={5} px={px} py={py}>
            <div
              style={{
                position: 'absolute',
                left: `${retX}%`,
                top: `${retY}%`,
                width: retR * 2,
                height: retR * 2,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `1.5px solid ${rgba(accent, 0.85)}`,
                boxShadow: `0 0 20px ${rgba(accent, 0.35)}, inset 0 0 20px ${rgba(accent, 0.15)}`,
                opacity: retOp,
                pointerEvents: 'none',
              }}
            >
              <div style={{position: 'absolute', left: '50%', top: -12, width: 1.5, height: 16, background: accent, transform: 'translateX(-50%)'}} />
              <div style={{position: 'absolute', left: '50%', bottom: -12, width: 1.5, height: 16, background: accent, transform: 'translateX(-50%)'}} />
              <div style={{position: 'absolute', top: '50%', left: -12, height: 1.5, width: 16, background: accent, transform: 'translateY(-50%)'}} />
              <div style={{position: 'absolute', top: '50%', right: -12, height: 1.5, width: 16, background: accent, transform: 'translateY(-50%)'}} />
            </div>
          </ParallaxLayer>
          {/* 7 · banda scanner del swap */}
          <ParallaxLayer factor={0.85} z={5} px={px} py={py}>
            <div
              style={{
                position: 'absolute',
                top: '12%',
                bottom: '12%',
                left: `${scanX}%`,
                width: '6%',
                transform: 'translateX(-50%) skewX(-6deg)',
                background: `linear-gradient(90deg, transparent, ${rgba(accent, 0.35)} 40%, rgba(255,242,218,0.5) 52%, ${rgba(
                  accent,
                  0.3
                )} 62%, transparent)`,
                filter: 'blur(2px)',
                mixBlendMode: 'screen',
                opacity: scanEnv,
                pointerEvents: 'none',
              }}
            />
          </ParallaxLayer>
          {/* 8 · bokeh */}
          <ParallaxLayer factor={1.15} z={5} px={px} py={py}>
            <BokehLayer
              seed="pru-bk"
              count={6}
              blur={7}
              tintGold="238, 206, 140"
              tintPale="235, 228, 214"
              scale={vh / 1080}
            />
          </ParallaxLayer>
          {/* 9 · oclusor */}
          <ParallaxLayer factor={1.35} z={5} px={px} py={py}>
            <DepthGhost
              src={ghostSrc}
              right="-5%"
              bottom="-16%"
              width="30%"
              rotate={20}
              blur={10}
              brightness={0.28}
              opacity={0.9}
              swayAmp={15}
              phase={0.9}
              flip
            />
          </ParallaxLayer>
          {/* 10 · grade */}
          <GradeOverlay accent={accent} />
          {/* 11 · texto */}
          <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
            <SceneCaption
              kicker={kicker}
              title={title}
              sub={sub}
              accent={accent}
              left="7%"
              top="9%"
              width="40%"
              startAt={0.7}
              durationInFrames={durationInFrames}
            />
          </ParallaxLayer>
        </AbsoluteFill>
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* =========================== 5 · FED2-CIERRE =============================== */

export type CierreProps = {
  src: string;
  ghostSrc: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  durationInFrames: number;
};

export const CierreScene: React.FC<CierreProps> = ({
  src,
  ghostSrc,
  kicker,
  title,
  sub,
  accent = GOLD,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {width: vw, height: vh} = useVideoConfig();
  const {push, px, py} = useDepthCamera(durationInFrames);
  const riseMotes = React.useMemo(
    () => makeMotes(18, 'cie-rise', 2, 6, 0.14, 0.26, 0.25, 0.6),
    []
  );
  const heroW = Math.min(vw * 0.22, vh * 0.46 * 0.8);
  const cx = vw * 0.5;
  const cy = vh * 0.42;
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [0, 1],
    CLAMP
  );

  return (
    <TransitionShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: '#040302', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
          {/* 1 · fondo dorado profundo */}
          <ParallaxLayer factor={0.2} z={1} px={px} py={py}>
            <SceneBackdrop bg={BG_CIERRE} moteTint="240, 214, 160" seed="cierre" />
          </ParallaxLayer>
          {/* 2 · rayos radiales rotando */}
          <ParallaxLayer factor={0.42} z={2} px={px} py={py}>
            <RayBurst cx={cx} cy={cy} accent={accent} />
          </ParallaxLayer>
          {/* 3 · halos concéntricos */}
          <ParallaxLayer factor={0.5} z={2} px={px} py={py}>
            <HaloRings cx={cx} cy={cy} accent={accent} />
          </ParallaxLayer>
          {/* 4 · motas doradas ascendentes */}
          <ParallaxLayer factor={0.38} z={2} px={px} py={py}>
            <MotesLayer motes={riseMotes} blur={1} scale={vh / 1080} tint="240, 208, 140" />
          </ParallaxLayer>
          {/* 5 · ecos del producto flanqueando */}
          <ParallaxLayer factor={0.45} z={2} px={px} py={py}>
            <DepthGhost
              src={src}
              left="10%"
              bottom="-8%"
              width="20%"
              rotate={9}
              blur={6}
              brightness={0.42}
              opacity={0.6}
              swayAmp={10}
              phase={2.6}
            />
            <DepthGhost
              src={src}
              right="10%"
              bottom="-10%"
              width="23%"
              rotate={-11}
              blur={8}
              brightness={0.34}
              opacity={0.55}
              swayAmp={12}
              phase={5}
              flip
            />
          </ParallaxLayer>
          {/* 6 · HERO producto */}
          <ParallaxLayer factor={0.65} z={3} px={px} py={py}>
            <HeroCard
              src={src}
              accent={accent}
              left="50%"
              top="42%"
              w={heroW}
              aspect={4 / 5}
              rotBase={0}
              glowMul={1.5}
              floatAmp={0.75}
              sheenAt={1.5}
            />
          </ParallaxLayer>
          {/* 7 · bokeh dorado */}
          <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
            <BokehLayer
              seed="cie-bk"
              count={8}
              blur={8}
              tintGold="240, 208, 138"
              tintPale="238, 230, 212"
              scale={vh / 1080}
            />
          </ParallaxLayer>
          {/* 8 · oclusor: rama de romero, firma del canal */}
          <ParallaxLayer factor={1.35} z={5} px={px} py={py}>
            <DepthGhost
              src={ghostSrc}
              left="-6%"
              bottom="-14%"
              width="32%"
              rotate={-16}
              blur={10}
              brightness={0.3}
              opacity={0.9}
              swayAmp={16}
              phase={1.8}
            />
          </ParallaxLayer>
          {/* 9 · grade */}
          <GradeOverlay accent={accent} />
          {/* 10 · CTA centrado con pill */}
          <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
            <SceneCaption
              kicker={kicker}
              title={title}
              sub={sub}
              accent={accent}
              left="15%"
              top="71%"
              width="70%"
              align="center"
              startAt={1.0}
              subPill
              durationInFrames={durationInFrames}
            />
          </ParallaxLayer>
        </AbsoluteFill>
        <GrainOverlay />
        {/* fundido final (fin del reel) */}
        <AbsoluteFill
          style={{zIndex: 25, background: '#030202', opacity: fadeOut, pointerEvents: 'none'}}
        />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* ================================ EL REEL ================================== */

const HERO_DEFAULTS: HeroProps = {
  src: staticFile('med/romero.png'),
  ghostSrc: staticFile('med/romero.png'),
  kicker: 'Dr. Federer · Dermocosmética natural',
  title: 'Romero',
  sub: 'La farmacia que crece en tu jardín.',
  durationInFrames: SCENE_DUR,
};

const ACTIVO_DEFAULTS: ActivoProps = {
  src: staticFile('med/aceite.png'),
  echoSrc: staticFile('med/colageno.png'),
  ghostSrc: staticFile('med/romero.png'),
  kicker: 'El activo estrella',
  title: 'Ácido carnósico',
  sub: 'Antioxidante que protege tu colágeno.',
  durationInFrames: SCENE_DUR,
};

const RITUAL_DEFAULTS: RitualProps = {
  src: staticFile('med/cubito.png'),
  echoSrc: staticFile('med/cubito.png'),
  steamSrc: staticFile('med/vapor.png'),
  kicker: 'El ritual',
  title: 'Vapor frío',
  sub: 'Dos minutos. Mañana y noche.',
  durationInFrames: SCENE_DUR,
};

const PRUEBA_DEFAULTS: PruebaProps = {
  beforeSrc: staticFile('med/antes_despues.png'),
  afterSrc: staticFile('med/piel.png'),
  ghostSrc: staticFile('med/romero.png'),
  kicker: 'La prueba',
  title: '28 días',
  sub: 'Misma luz. Misma piel. Otro espejo.',
  durationInFrames: SCENE_DUR,
};

const CIERRE_DEFAULTS: CierreProps = {
  src: staticFile('med/crema.png'),
  ghostSrc: staticFile('med/romero.png'),
  kicker: 'Dr. Federer',
  title: 'Método Piel Joven',
  sub: 'Tu ritual empieza hoy',
  durationInFrames: SCENE_DUR,
};

export const Fed2Reel: React.FC = () => (
  <AbsoluteFill style={{background: '#050403'}}>
    <Series>
      <Series.Sequence durationInFrames={SCENE_DUR}>
        <HeroScene {...HERO_DEFAULTS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DUR} offset={-TR}>
        <ActivoScene {...ACTIVO_DEFAULTS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DUR} offset={-TR}>
        <RitualScene {...RITUAL_DEFAULTS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DUR} offset={-TR}>
        <PruebaScene {...PRUEBA_DEFAULTS} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DUR} offset={-TR}>
        <CierreScene {...CIERRE_DEFAULTS} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

/* ================================ ROOT ===================================== */

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Fed2-Hero"
      component={HeroScene}
      durationInFrames={SCENE_DUR}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={HERO_DEFAULTS}
    />
    <Composition
      id="Fed2-Activo"
      component={ActivoScene}
      durationInFrames={SCENE_DUR}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={ACTIVO_DEFAULTS}
    />
    <Composition
      id="Fed2-Ritual"
      component={RitualScene}
      durationInFrames={SCENE_DUR}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={RITUAL_DEFAULTS}
    />
    <Composition
      id="Fed2-Prueba"
      component={PruebaScene}
      durationInFrames={SCENE_DUR}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={PRUEBA_DEFAULTS}
    />
    <Composition
      id="Fed2-Cierre"
      component={CierreScene}
      durationInFrames={SCENE_DUR}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={CIERRE_DEFAULTS}
    />
    <Composition
      id="Fed2-Reel"
      component={Fed2Reel}
      durationInFrames={REEL_DUR}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RemotionRoot);
