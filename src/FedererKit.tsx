/**
 * ============================================================================
 * FED KIT — 10 escenas reutilizables · Dr. Federer (dermocosmética natural)
 * ----------------------------------------------------------------------------
 * EL SET (director):
 *   01 Fed_Chapter     · título de capítulo (letters blur-in + ghost index)
 *   02 Fed_Hero        · foto flotante con glow + parallax + texto (depth)
 *   03 Fed_Stat        · número gigante con count-up + track + rack focus
 *   04 Fed_Quote       · cita serif centrada, polvo, comilla con glow
 *   05 Fed_Molecule    · diagrama nodo central + líneas que se dibujan
 *   06 Fed_Step        · tarjeta de paso (ghost number + dots de progreso)
 *   07 Fed_BeforeAfter · antes/después con divisor dorado que barre
 *   08 Fed_LowerThird  · lower-third sobre avatar (OffthreadVideo)
 *   09 Fed_Checklist   · items con check que se dibuja, stagger
 *   10 Fed_CTA         · cierre con botón dorado (sheen periódico)
 *
 * CONTRATO DE TRANSICIÓN (compartido por las 10):
 *   - Toda escena vive dentro de <TransitionShell> (whip/blur/slide + light-sweep).
 *   - Entrada: frames [0 .. WHIP]  · Salida: frames [TOTAL-WHIP .. TOTAL]
 *   - Para encadenar SIN cortes: la siguiente escena arranca WHIP frames antes
 *     de que termine la anterior  →  STEP = SCENE_F - WHIP_F = 150 - 12 = 138.
 *   - Ver 'Fed-KitReel' (abajo) como referencia de encadenado.
 *
 * Comp: 1920×1080 @ 30fps · escena = 150 frames (5s) · reel = 1392 frames.
 * Assets: public/med/{romero,piel,aceite,vapor,cubito,colageno,crema,
 * antes_despues}.png · avatar opcional public/med/avatar.mp4
 * ============================================================================
 */

import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ============================ CONTRATO / CONSTANTES ====================== */

export const FED_SCENE_F = 150; // 5s @30fps — duración estándar de cada escena
export const FED_WHIP_F = 12; // 0.4s — solape de entrada/salida (CONTRATO)
export const FED_STEP_F = FED_SCENE_F - FED_WHIP_F; // 138 — distancia entre cortes
export const FED_REEL_F = FED_SCENE_F + 9 * FED_STEP_F; // 1392 — 10 escenas

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FONT_SANS = "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

const DEFAULT_ACCENT = '#E9B44C';
const TEAL = '#8FD0C8';
const COOL_BLUE = '#8FB4E8';

export const FED_ASSETS = {
  romero: staticFile('med/romero.png'),
  piel: staticFile('med/piel.png'),
  aceite: staticFile('med/aceite.png'),
  vapor: staticFile('med/vapor.png'),
  cubito: staticFile('med/cubito.png'),
  colageno: staticFile('med/colageno.png'),
  crema: staticFile('med/crema.png'),
  antes_despues: staticFile('med/antes_despues.png'),
} as const;

export type FedMood = 'cool' | 'gold' | 'warmdark' | 'science';

/* ================================ UTILIDADES ============================= */

const mod = (n: number, m: number) => ((n % m) + m) % m;

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.length === 6 ? full : '000000', 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const shade = (hex: string, f: number): string => {
  const h = hex.replace('#', '');
  const n = Number.parseInt(h.length === 6 ? h : '000000', 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r}, ${g}, ${b})`;
};

const normWord = (w: string): string =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9$%]/g, '');

const wordStagger = (n: number, max = 0.26): number =>
  n > 1 ? Math.min(max, Math.max(0.09, 2.4 / n)) : 0;

/* ------------------------------ partículas ------------------------------ */

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
  tint: string;
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
              boxShadow: `0 0 ${s * 2.2}px ${s * 0.55}px rgba(${tint}, ${
                m.opacity * 0.5 * tw
              })`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

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

const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      mixBlendMode: 'overlay',
      zIndex: 40,
      pointerEvents: 'none',
    }}
  >
    <filter id="fedGrain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#fedGrain)" />
  </svg>
);

/* ================== CONTRATO: TRANSITION SHELL COMPARTIDO ================
 * TODAS las escenas del kit entran y salen igual:
 *   whip desde la derecha (blur 18→0, x +5%→0, scale 1.08→1) + light-sweep,
 *   hold, whip hacia la izquierda (blur 0→18, x 0→-5%) + light-sweep.
 * Encadenado: Sequence(from = i * (SCENE_F - WHIP_F), durationInFrames = SCENE_F).
 * ======================================================================= */

const TransitionShell: React.FC<{
  accent: string;
  totalF?: number;
  whipF?: number;
  children: React.ReactNode;
}> = ({accent, totalF = FED_SCENE_F, whipF = FED_WHIP_F, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  const en = interpolate(frame, [0, whipF], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exS = totalF - whipF;
  const ex = interpolate(frame, [exS, totalF], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });

  const opacity = Math.min(en, 1 - ex);
  const blur = (1 - en) * 18 + ex * 18;
  const x = (1 - en) * width * 0.05 - ex * width * 0.05;
  const scale = 1 + (1 - en) * 0.08 - ex * 0.05;

  const flashIn = Math.sin(Math.min(1, en) * Math.PI);
  const flashOut = Math.sin(ex * Math.PI);
  const flashX = interpolate(en, [0, 1], [125, -65], CLAMP);
  const flashX2 = interpolate(ex, [0, 1], [125, -65], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur.toFixed(2)}px)`,
        transform: `translateX(${x.toFixed(1)}px) scale(${scale.toFixed(4)})`,
        willChange: 'transform, filter, opacity',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          bottom: '-12%',
          width: '42%',
          left: 0,
          transform: `translateX(${flashX}%) skewX(-16deg)`,
          background: `linear-gradient(100deg, transparent 22%, ${rgba(
            accent,
            0.3
          )} 50%, transparent 78%)`,
          mixBlendMode: 'screen',
          opacity: flashIn * 0.85,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          bottom: '-12%',
          width: '42%',
          left: 0,
          transform: `translateX(${flashX2}%) skewX(-16deg)`,
          background: `linear-gradient(100deg, transparent 22%, ${rgba(
            accent,
            0.26
          )} 50%, transparent 78%)`,
          mixBlendMode: 'screen',
          opacity: flashOut * 0.65,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ============================ PIEZAS DE TEXTO ============================ */

const Kicker: React.FC<{text: string; accent: string; startSec: number}> = ({
  text,
  accent,
  startSec,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const k = spring({
    frame: frame - Math.round(startSec * fps),
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.8},
  });
  const ruleW = interpolate(k, [0, 1], [0, 64], CLAMP);
  const track = interpolate(k, [0, 1], [0.46, 0.3], CLAMP);
  const o = interpolate(k, [0, 0.4], [0, 1], CLAMP);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: o}}>
      <div
        style={{
          width: ruleW,
          height: 3,
          borderRadius: 2,
          background: accent,
          boxShadow: `0 0 14px ${rgba(accent, 0.6)}`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(width * 0.011),
          letterSpacing: `${track}em`,
          textTransform: 'uppercase',
          color: rgba(accent, 0.95),
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const KickerCenter: React.FC<{text: string; accent: string; startSec: number}> = ({
  text,
  accent,
  startSec,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const k = spring({
    frame: frame - Math.round(startSec * fps),
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.8},
  });
  const ruleW = interpolate(k, [0, 1], [0, 44], CLAMP);
  const o = interpolate(k, [0, 0.4], [0, 1], CLAMP);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        opacity: o,
      }}
    >
      <div
        style={{
          width: ruleW,
          height: 2,
          background: `linear-gradient(to left, ${accent}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(width * 0.011),
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: rgba(accent, 0.95),
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: ruleW,
          height: 2,
          background: `linear-gradient(to right, ${accent}, transparent)`,
        }}
      />
    </div>
  );
};

const Words: React.FC<{
  text: string;
  hot?: string[];
  accent: string;
  startSec: number;
  size: number;
  weight?: number;
  serif?: boolean;
  italic?: boolean;
  uppercase?: boolean;
  color?: string;
  maxStagger?: number;
  staggerSec?: number;
}> = ({
  text,
  hot = [],
  accent,
  startSec,
  size,
  weight = 800,
  serif = false,
  italic = false,
  uppercase = true,
  color = '#f4f7ff',
  maxStagger = 0.26,
  staggerSec,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = React.useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const hotSet = React.useMemo(() => new Set(hot.map(normWord)), [hot]);
  const stagger = staggerSec ?? wordStagger(words.length, maxStagger);
  return (
    <span
      style={{
        fontFamily: serif ? FONT_SERIF : FONT_SANS,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: uppercase ? '-0.012em' : '0',
        textTransform: uppercase ? 'uppercase' : 'none',
      }}
    >
      {words.map((word, i) => {
        const startI = Math.round((startSec + i * stagger) * fps);
        const w = spring({
          frame: frame - startI,
          fps,
          config: {damping: 13, stiffness: 165, mass: 0.7},
        });
        const y = interpolate(w, [0, 1], [serif ? 14 : 28, 0], CLAMP);
        const b = Math.max(0, interpolate(w, [0, 1], [serif ? 8 : 12, 0], CLAMP));
        const o = interpolate(w, [0, 0.35], [0, 1], CLAMP);
        const s = serif
          ? 1
          : interpolate(w, [0, 1], [0.76, 1], CLAMP) * (1 + Math.max(0, w - 1) * 0.22);
        const isHot = hotSet.has(normWord(word));
        const glowPulse = isHot ? 0.4 + 0.15 * Math.sin(frame * 0.09 + i * 1.3) : 0;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.27em',
              transform: `translateY(${y}px) scale(${s})`,
              opacity: o,
              filter: `blur(${b}px)`,
              color: isHot ? accent : color,
              textShadow: isHot
                ? `0 0 26px ${rgba(accent, glowPulse)}, 0 4px 18px rgba(0,0,0,0.55)`
                : '0 4px 22px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.7)',
              willChange: 'transform, filter, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

const SubLine: React.FC<{
  text: string;
  accent: string;
  startSec: number;
  size: number;
  align?: 'left' | 'center';
  withBar?: boolean;
}> = ({text, accent, startSec, size, align = 'left', withBar = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - Math.round(startSec * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 0.95], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [16, 0], CLAMP)}px)`,
        filter: `blur(${Math.max(0, interpolate(p, [0, 1], [8, 0], CLAMP))}px)`,
        textAlign: align,
        paddingLeft: withBar ? 16 : 0,
        borderLeft: withBar ? `3px solid ${accent}` : 'none',
        fontFamily: FONT_SERIF,
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.4,
        color: 'rgba(216, 226, 246, 0.88)',
      }}
    >
      {text}
    </div>
  );
};

/* ====================== HERO CARD (foto flotante) ======================== */

const HeroCard: React.FC<{
  src: string;
  accent: string;
  delayF: number;
  w: number;
  cx: number;
  cy: number;
  rot: number;
  framed: boolean;
  floatSeed: string;
  cool?: boolean;
  extraBlur?: number;
  brackets?: boolean;
  bracketOp?: number;
}> = ({
  src,
  accent,
  delayF,
  w,
  cx,
  cy,
  rot,
  framed,
  floatSeed,
  cool = false,
  extraBlur = 0,
  brackets = false,
  bracketOp = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();

  const enter = spring({
    frame: frame - delayF,
    fps,
    config: {damping: 24, stiffness: 65, mass: 1},
  });
  const over = Math.max(0, enter - 1);
  const focusBlur = Math.max(0, interpolate(enter, [0, 1], [16, 0], CLAMP)) + extraBlur;
  const enterScale = interpolate(enter, [0, 1], [1.12, 1], CLAMP) * (1 + over * 0.1);
  const enterY = interpolate(enter, [0, 1], [48, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);

  const fs = random(floatSeed + '-fs') * Math.PI * 2;
  const floatY = Math.sin(frame * 0.08 + fs) * height * 0.007;
  const floatX = Math.cos(frame * 0.062 + fs * 1.7) * 4;
  const rotA = rot + Math.sin(frame * 0.055 + fs) * 0.5;
  const glowPulse = 0.26 + 0.08 * Math.sin(frame * 0.07 + fs);

  const sheenStart = delayF + Math.round(0.9 * fps);
  const sheenP = interpolate(
    frame,
    [sheenStart, sheenStart + Math.round(0.8 * fps)],
    [0, 1],
    {...CLAMP, easing: Easing.inOut(Easing.quad)}
  );
  const sheenX = interpolate(sheenP, [0, 1], [-120, 220], CLAMP);
  const sheenOp = interpolate(sheenP, [0, 0.15, 0.85, 1], [0, 1, 1, 0], CLAMP);

  const br = spring({
    frame: frame - (delayF + Math.round(0.5 * fps)),
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.7},
  });
  const brOp = interpolate(br, [0, 1], [0, 0.9], CLAMP) * bracketOp;
  const brScale = interpolate(br, [0, 1], [1.4, 1], CLAMP);

  const tone = cool ? 'saturate(0.78) brightness(0.97) ' : '';
  const bk = 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${cy}%`,
        width: w,
        transform: `translate(-50%, -50%) translate(${floatX}px, ${
          enterY + floatY
        }px) rotate(${rotA}deg) scale(${enterScale})`,
        opacity,
        willChange: 'transform, filter, opacity',
      }}
    >
      <div style={{position: 'relative', width: '100%'}}>
        <div
          style={{
            position: 'absolute',
            inset: '-22%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
              accent,
              glowPulse
            )} 0%, ${rgba(accent, glowPulse * 0.32)} 42%, transparent 72%)`,
            filter: 'blur(30px)',
            zIndex: -1,
          }}
        />
        {framed ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 2',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.14)',
              background: '#0a1226',
              filter: `blur(${focusBlur}px) ${tone}drop-shadow(0 ${
                height * 0.028
              }px ${height * 0.05}px rgba(1, 4, 12, 0.6))`,
            }}
          >
            <Img
              src={src}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.09), transparent 28%)',
                boxShadow: 'inset 0 0 70px rgba(2, 6, 16, 0.4)',
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
                  'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                mixBlendMode: 'screen',
                opacity: sheenOp,
              }}
            />
          </div>
        ) : (
          <Img
            src={src}
            style={{
              width: '100%',
              display: 'block',
              filter: `blur(${focusBlur}px) ${tone}drop-shadow(0 ${
                height * 0.03
              }px ${height * 0.045}px rgba(1, 4, 12, 0.65))`,
            }}
          />
        )}
        {brackets && brOp > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              inset: -14,
              opacity: brOp,
              transform: `scale(${brScale})`,
              pointerEvents: 'none',
            }}
          >
            {(
              [
                {top: 0, left: 0, borderTop: `${bk}px solid ${accent}`, borderLeft: `${bk}px solid ${accent}`, borderTopLeftRadius: 6},
                {top: 0, right: 0, borderTop: `${bk}px solid ${accent}`, borderRight: `${bk}px solid ${accent}`, borderTopRightRadius: 6},
                {bottom: 0, left: 0, borderBottom: `${bk}px solid ${accent}`, borderLeft: `${bk}px solid ${accent}`, borderBottomLeftRadius: 6},
                {bottom: 0, right: 0, borderBottom: `${bk}px solid ${accent}`, borderRight: `${bk}px solid ${accent}`, borderBottomRightRadius: 6},
              ] as React.CSSProperties[]
            ).map((s, i) => (
              <div key={i} style={{position: 'absolute', width: 26, height: 26, ...s}} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ============== ramas de romero procedurales (foreground) ================ */

const Sprig: React.FC<{seed: string; h: number; color: string}> = ({seed, h, color}) => {
  const data = React.useMemo(() => {
    const N = 24;
    const phase = random(seed + '-ph') * Math.PI * 2;
    const amp = 9 + random(seed + '-amp') * 9;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= N; i++) {
      const y = 830 - i * (800 / N);
      const grow = 0.35 + 0.65 * (i / N);
      const x = 100 + Math.sin(i * 0.3 + phase) * amp * grow;
      pts.push([x, y]);
    }
    const stem = 'M ' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ');
    const leaves: Array<{d: string; o: number; w: number}> = [];
    for (let i = 2; i < N - 1; i++) {
      for (const side of [-1, 1]) {
        const r1 = random(`${seed}-lf-${i}-${side}-a`);
        const r2 = random(`${seed}-lf-${i}-${side}-l`);
        const r3 = random(`${seed}-lf-${i}-${side}-o`);
        const px = pts[i][0];
        const py = pts[i][1];
        const ang = (32 + r1 * 26) * (Math.PI / 180);
        const len = Math.max(10, 34 - i * 0.7) * (0.75 + r2 * 0.5);
        const x2 = px + side * Math.sin(ang) * len;
        const y2 = py - Math.cos(ang) * len;
        leaves.push({
          d: `M ${px.toFixed(1)} ${py.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
          o: 0.55 + r3 * 0.45,
          w: 3.4 + r2 * 1.8,
        });
      }
    }
    return {stem, leaves};
  }, [seed]);

  return (
    <svg viewBox="0 0 200 840" style={{height: h, display: 'block', overflow: 'visible'}}>
      <path d={data.stem} stroke={color} strokeWidth={7.5} fill="none" strokeLinecap="round" />
      {data.leaves.map((l, i) => (
        <path
          key={i}
          d={l.d}
          stroke={color}
          strokeWidth={l.w}
          strokeLinecap="round"
          opacity={l.o}
          fill="none"
        />
      ))}
    </svg>
  );
};

const ForegroundSprigs: React.FC<{seed: string; color: string}> = ({seed, color}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const sway1 = Math.sin(frame * 0.05 + random(seed + '-a') * 6) * 0.9;
  const sway2 = Math.sin(frame * 0.06 + random(seed + '-b') * 6) * 1.1;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '-3%',
          bottom: '-6%',
          transform: `rotate(${sway1}deg)`,
          transformOrigin: '50% 100%',
          filter: 'blur(6px)',
          opacity: 0.9,
        }}
      >
        <Sprig seed={seed + '-l'} h={height * 0.92} color={color} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: '-4%',
          bottom: '-10%',
          transform: `scaleX(-1) rotate(${sway2}deg)`,
          transformOrigin: '50% 100%',
          filter: 'blur(4px)',
          opacity: 0.7,
        }}
      >
        <Sprig seed={seed + '-r'} h={height * 0.7} color={color} />
      </div>
    </>
  );
};

/* ============================ FONDOS POR MOOD ============================ */

const moodBg = (mood: FedMood, accent: string): string => {
  switch (mood) {
    case 'cool':
      return [
        `radial-gradient(85% 65% at 66% 30%, ${rgba(accent, 0.14)} 0%, transparent 55%)`,
        'radial-gradient(120% 90% at 70% 26%, rgba(46, 74, 128, 0.5) 0%, rgba(20, 34, 66, 0.32) 42%, transparent 72%)',
        'radial-gradient(90% 75% at 16% 88%, rgba(28, 44, 84, 0.42) 0%, transparent 62%)',
        'linear-gradient(160deg, #0b1322 0%, #070d1a 48%, #04070f 100%)',
      ].join(', ');
    case 'warmdark':
      return [
        `radial-gradient(75% 55% at 50% 34%, ${rgba(accent, 0.12)} 0%, transparent 55%)`,
        'radial-gradient(110% 80% at 50% 30%, rgba(70, 52, 30, 0.34) 0%, transparent 60%)',
        'linear-gradient(165deg, #0e0b08 0%, #080605 50%, #030202 100%)',
      ].join(', ');
    case 'science':
      return [
        `radial-gradient(85% 62% at 62% 30%, ${rgba(accent, 0.13)} 0%, transparent 55%)`,
        'radial-gradient(115% 85% at 64% 28%, rgba(24, 78, 96, 0.42) 0%, rgba(12, 34, 52, 0.3) 44%, transparent 72%)',
        'radial-gradient(85% 70% at 18% 86%, rgba(16, 52, 74, 0.4) 0%, transparent 60%)',
        'linear-gradient(160deg, #08121b 0%, #060d16 48%, #03060b 100%)',
      ].join(', ');
    case 'gold':
    default:
      return [
        `radial-gradient(80% 60% at 34% 40%, ${rgba(accent, 0.2)} 0%, transparent 58%)`,
        'radial-gradient(110% 85% at 30% 34%, rgba(64, 84, 44, 0.4) 0%, rgba(26, 36, 20, 0.3) 45%, transparent 72%)',
        'radial-gradient(90% 70% at 84% 88%, rgba(52, 44, 22, 0.4) 0%, transparent 60%)',
        'linear-gradient(158deg, #0c1009 0%, #070a06 46%, #030503 100%)',
      ].join(', ');
  }
};

const sprigColor = (mood: FedMood): string =>
  ({cool: '#0a1526', gold: '#0c1106', warmdark: '#100b06', science: '#08131d'} as Record<
    FedMood,
    string
  >)[mood];

/* ================== STAGE (cámara + capas de profundidad) ================ */

type CamVec = {px: number; py: number};

const Stage: React.FC<{
  mood: FedMood;
  accent: string;
  seed: string;
  kickF?: number;
  kickAmt?: number;
  sprigs?: boolean;
  panDir?: number;
  pushTo?: number;
  children: (cam: CamVec) => React.ReactNode;
}> = ({
  mood,
  accent,
  seed,
  kickF,
  kickAmt = 0.02,
  sprigs = false,
  panDir = 1,
  pushTo = 1.045,
  children,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const seedN = React.useMemo(() => random(seed + '-cam') * 10, [seed]);

  const push = interpolate(frame, [0, FED_SCENE_F], [1, pushTo], CLAMP);
  const kickP =
    kickF != null ? interpolate(frame, [kickF, kickF + 16], [0, 1], CLAMP) : 0;
  const camScale = push * (1 + Math.sin(kickP * Math.PI) * kickAmt);

  const handX =
    Math.sin(frame * 0.05 + seedN) * width * 0.0016 +
    Math.sin(frame * 0.014 + seedN * 2) * width * 0.0022;
  const handY = Math.cos(frame * 0.042 + seedN) * height * 0.0018;
  const panX = interpolate(frame, [0, FED_SCENE_F], [0, width * 0.012 * panDir], CLAMP);
  const px = handX + panX;
  const py = handY;

  const farMotes = React.useMemo(
    () => makeMotes(14, seed + '-far', 4, 10, 0.05, 0.1, 0.14, 0.34),
    [seed]
  );
  const midMotes = React.useMemo(
    () => makeMotes(12, seed + '-mid', 2, 5.5, 0.03, 0.075, 0.28, 0.62),
    [seed]
  );
  const bokeh = React.useMemo(
    () => makeMotes(4, seed + '-bok', 90, 200, 0.008, 0.02, 0.05, 0.1),
    [seed]
  );

  const moteTint = mood === 'gold' || mood === 'warmdark' ? '240, 208, 150' : '190, 214, 250';

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${camScale})`, willChange: 'transform'}}>
        {/* 1 · fondo desenfocado */}
        <ParallaxLayer factor={0.22} z={1} px={px} py={py}>
          <AbsoluteFill style={{filter: 'blur(13px)', transform: 'scale(1.16)'}}>
            <AbsoluteFill style={{background: moodBg(mood, accent)}} />
            <MotesLayer motes={farMotes} blur={0} scale={height / 1080} tint={moteTint} />
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(115% 92% at 50% 42%, transparent 42%, rgba(2, 5, 11, 0.8) 100%)',
              }}
            />
          </AbsoluteFill>
        </ParallaxLayer>

        {/* 2 · motas medias */}
        <ParallaxLayer factor={0.4} z={2} px={px} py={py}>
          <MotesLayer motes={midMotes} blur={1.5} scale={height / 1080} tint={moteTint} />
        </ParallaxLayer>

        {/* 3 · contenido de la escena (hero z3, texto z7, etc.) */}
        {children({px, py})}

        {/* 4 · bokeh gigante delante */}
        <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
          <MotesLayer motes={bokeh} blur={9} scale={height / 1080} tint={moteTint} />
        </ParallaxLayer>

        {/* 5 · ramas de romero en foreground (opcional) */}
        {sprigs ? (
          <ParallaxLayer factor={1.32} z={5} px={px} py={py}>
            <ForegroundSprigs seed={seed} color={sprigColor(mood)} />
          </ParallaxLayer>
        ) : null}

        {/* 6 · viñeta / grade */}
        <AbsoluteFill
          style={{
            zIndex: 6,
            pointerEvents: 'none',
            background: [
              'radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(1, 3, 9, 0.5) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.32), transparent 18%, transparent 82%, rgba(2,4,10,0.42))',
            ].join(', '),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================== LiveDrift (nada queda quieto >1.5s) ================== */

const LiveDrift: React.FC<{
  style?: React.CSSProperties;
  zoom?: number;
  drift?: number;
  centerX?: boolean;
  centerY?: boolean;
  origin?: string;
  children: React.ReactNode;
}> = ({style, zoom = 0.018, drift = 1, centerX = false, centerY = false, origin, children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const z = interpolate(frame, [0, FED_SCENE_F], [1, 1 + zoom], CLAMP);
  const dy = Math.sin(frame * 0.045) * height * 0.0022 * drift;
  const dx = Math.cos(frame * 0.038) * width * 0.001 * drift;
  const tx = centerX ? `calc(-50% + ${dx.toFixed(2)}px)` : `${dx.toFixed(2)}px`;
  const ty = centerY ? `calc(-50% + ${dy.toFixed(2)}px)` : `${dy.toFixed(2)}px`;
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${tx}, ${ty}) scale(${z.toFixed(4)})`,
        transformOrigin: origin ?? '50% 50%',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ############################################################################
 * ESCENA 01 · FED_CHAPTER — título de capítulo
 * ########################################################################## */

export type FedChapterProps = {
  totalF?: number;
  kicker?: string;
  index?: string;
  title?: string;
  sub?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedChapter: React.FC<FedChapterProps> = ({
  totalF,
  kicker = 'Capítulo',
  index = '01',
  title = 'El Romero',
  sub = 'De la cocina al laboratorio',
  accent = DEFAULT_ACCENT,
  mood = 'gold',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const words = React.useMemo(() => title.trim().split(/\s+/).filter(Boolean), [title]);
  const wordsWithIdx = React.useMemo(() => {
    let acc = 0;
    return words.map((w) => {
      const o = acc;
      acc += w.length;
      return {w, o};
    });
  }, [words]);

  const size = Math.round(Math.min(width * 0.088, height * 0.165));

  const ghostIn = spring({
    frame: frame - Math.round(0.35 * fps),
    fps,
    config: {damping: 22, stiffness: 70, mass: 1},
  });
  const ghostPush = interpolate(frame, [0, FED_SCENE_F], [1, 1.06], CLAMP);

  const subP = spring({
    frame: frame - Math.round(1.8 * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-chapter" kickF={Math.round(0.7 * fps)} sprigs panDir={1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.5} z={3} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    right: '2%',
                    bottom: '-9%',
                    fontFamily: FONT_SANS,
                    fontWeight: 800,
                    fontSize: Math.round(height * 0.52),
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${rgba(accent, 0.14)}`,
                    opacity: interpolate(ghostIn, [0, 1], [0, 1], CLAMP),
                    transform: `scale(${ghostPush})`,
                    transformOrigin: '100% 100%',
                  }}
                >
                  {index}
                </div>
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: 0, right: 0, top: '50%', textAlign: 'center'}} centerY zoom={0.02}>
                  <KickerCenter text={`${kicker} ${index}`} accent={accent} startSec={0.4} />
                  <div
                    style={{
                      marginTop: height * 0.02,
                      fontFamily: FONT_SANS,
                      fontWeight: 800,
                      fontSize: size,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {wordsWithIdx.map(({w, o}, wi) => (
                      <span
                        key={wi}
                        style={{display: 'inline-block', marginRight: '0.28em', whiteSpace: 'nowrap'}}
                      >
                        {w.split('').map((L, li) => {
                          const st = 0.6 + (o + li) * 0.045;
                          const sp = spring({
                            frame: frame - Math.round(st * fps),
                            fps,
                            config: {damping: 13, stiffness: 150, mass: 0.75},
                          });
                          const y = interpolate(sp, [0, 1], [34, 0], CLAMP);
                          const b = Math.max(0, interpolate(sp, [0, 1], [20, 0], CLAMP));
                          const oo = interpolate(sp, [0, 0.3], [0, 1], CLAMP);
                          const s =
                            interpolate(sp, [0, 1], [1.5, 1], CLAMP) *
                            (1 + Math.max(0, sp - 1) * 0.18);
                          return (
                            <span
                              key={li}
                              style={{
                                display: 'inline-block',
                                transform: `translateY(${y}px) scale(${s})`,
                                opacity: oo,
                                filter: `blur(${b}px)`,
                                color: '#F3E3B6',
                                textShadow: `0 0 44px ${rgba(accent, 0.55)}, 0 6px 30px rgba(0,0,0,0.65)`,
                                willChange: 'transform, filter, opacity',
                              }}
                            >
                              {L}
                            </span>
                          );
                        })}
                      </span>
                    ))}
                  </div>
                  {sub ? (
                    <div
                      style={{
                        marginTop: height * 0.028,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        opacity: interpolate(subP, [0, 1], [0, 1], CLAMP),
                        transform: `translateY(${interpolate(subP, [0, 1], [14, 0], CLAMP)}px)`,
                        filter: `blur(${Math.max(0, interpolate(subP, [0, 1], [8, 0], CLAMP))}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: interpolate(subP, [0, 1], [0, 38], CLAMP),
                          height: 1,
                          background: rgba(accent, 0.7),
                        }}
                      />
                      <div
                        style={{
                          fontFamily: FONT_SERIF,
                          fontStyle: 'italic',
                          fontSize: Math.round(height * 0.028),
                          color: 'rgba(222, 228, 240, 0.85)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {sub}
                      </div>
                      <div
                        style={{
                          width: interpolate(subP, [0, 1], [0, 38], CLAMP),
                          height: 1,
                          background: rgba(accent, 0.7),
                        }}
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 02 · FED_HERO — foto flotante de profundidad + texto
 * ########################################################################## */

export type FedHeroProps = {
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  image?: string;
  accent?: string;
  mood?: FedMood;
  side?: 'left' | 'right';
  framed?: boolean;
};

export const FedHero: React.FC<FedHeroProps> = ({
  totalF,
  kicker = 'Dermocosmética natural',
  title = 'El secreto ya crece en su jardín',
  hot = ['crece'],
  sub = 'Rosmarinus officinalis · ciencia y tradición',
  image = FED_ASSETS.romero,
  accent = DEFAULT_ACCENT,
  mood = 'gold',
  side = 'left',
  framed = true,
}) => {
  const {fps, width, height} = useVideoConfig();
  const isLeft = side === 'left';
  const cx = isLeft ? 68 : 32;

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-hero" sprigs panDir={isLeft ? 1 : -1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <HeroCard
                  src={image}
                  accent={accent}
                  delayF={Math.round(0.35 * fps)}
                  w={Math.min(width * 0.32, height * 0.58)}
                  cx={cx}
                  cy={50}
                  rot={isLeft ? 1.6 : -1.8}
                  framed={framed}
                  floatSeed="fed-hero"
                  cool={mood === 'cool'}
                />
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift
                  style={{
                    ...(isLeft ? {left: '8%'} : {right: '8%'}),
                    top: '50%',
                    width: '46%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isLeft ? 'flex-start' : 'flex-end',
                    textAlign: isLeft ? 'left' : 'right',
                  }}
                  centerY
                  origin={isLeft ? '0% 50%' : '100% 50%'}
                >
                  {kicker ? <Kicker text={kicker} accent={accent} startSec={0.45} /> : null}
                  <div style={{marginTop: height * 0.022}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.62}
                      size={Math.round(Math.min(width * 0.048, height * 0.078))}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.026}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={1.9}
                        size={Math.round(height * 0.027)}
                        withBar={isLeft}
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 03 · FED_STAT — número gigante con count-up
 * ########################################################################## */

export type FedStatProps = {
  totalF?: number;
  kicker?: string;
  value?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label?: string;
  sub?: string;
  image?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedStat: React.FC<FedStatProps> = ({
  totalF,
  kicker = 'Estudio clínico · 12 semanas',
  value = 87,
  suffix = '%',
  prefix = '',
  decimals = 0,
  label = 'notó la piel más firme',
  sub = 'Aplicación tópica diaria, todos los días.',
  image = FED_ASSETS.piel,
  accent = TEAL,
  mood = 'science',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const startF = Math.round(0.55 * fps);
  const endF = startF + Math.round(1.6 * fps);
  const cnt = interpolate(frame, [startF, endF], [0, value], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const shown = decimals > 0 ? cnt.toFixed(decimals) : String(Math.round(cnt));
  const trackP = interpolate(frame, [startF, endF], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const fillPct = suffix === '%' ? Math.min(100, Math.max(0, value)) / 100 : 1;

  const landP = interpolate(frame, [endF, endF + 12], [0, 1], CLAMP);
  const land = Math.sin(landP * Math.PI);
  const glowBase = 0.3 + land * 0.35 + 0.08 * Math.sin(frame * 0.08);

  const numSize = Math.round(Math.min(width * 0.1, height * 0.19));

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-stat" kickF={endF} panDir={-1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <HeroCard
                  src={image}
                  accent={accent}
                  delayF={Math.round(0.4 * fps)}
                  w={Math.min(width * 0.22, height * 0.42)}
                  cx={73}
                  cy={50}
                  rot={1.8}
                  framed
                  brackets
                  floatSeed="fed-stat"
                  cool
                />
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '8%', top: '50%', width: '52%'}} centerY origin="0% 50%">
                  {kicker ? <Kicker text={kicker} accent={accent} startSec={0.4} /> : null}
                  <div
                    style={{
                      marginTop: height * 0.015,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 12,
                      transform: `scale(${1 + land * 0.03})`,
                      transformOrigin: '0% 100%',
                      willChange: 'transform',
                    }}
                  >
                    {prefix ? (
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: Math.round(numSize * 0.5),
                          color: accent,
                          textShadow: `0 0 30px ${rgba(accent, glowBase)}`,
                        }}
                      >
                        {prefix}
                      </span>
                    ) : null}
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: numSize,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        fontVariantNumeric: 'tabular-nums',
                        color: '#f4f7ff',
                        textShadow: `0 0 ${34 + land * 26}px ${rgba(
                          accent,
                          glowBase
                        )}, 0 6px 30px rgba(0,0,0,0.6)`,
                      }}
                    >
                      {shown}
                    </span>
                    {suffix ? (
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: Math.round(numSize * 0.42),
                          color: accent,
                          textShadow: `0 0 30px ${rgba(accent, glowBase)}`,
                        }}
                      >
                        {suffix}
                      </span>
                    ) : null}
                  </div>
                  {/* track de progreso */}
                  <div
                    style={{
                      marginTop: height * 0.02,
                      width: Math.min(width * 0.24, 480),
                      height: 5,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.12)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${(trackP * fillPct * 100).toFixed(2)}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: `linear-gradient(to right, ${rgba(accent, 0.55)}, ${accent})`,
                        boxShadow: `0 0 16px ${rgba(accent, 0.55)}`,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${(trackP * fillPct * 100).toFixed(2)}%`,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: accent,
                        boxShadow: `0 0 18px ${rgba(accent, 0.9)}`,
                        transform: 'translate(-50%, -50%)',
                        opacity: trackP > 0.02 ? 1 : 0,
                      }}
                    />
                  </div>
                  <div style={{marginTop: height * 0.024}}>
                    <Words
                      text={label}
                      accent={accent}
                      startSec={1.05}
                      size={Math.round(Math.min(width * 0.026, height * 0.046))}
                      weight={700}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.018}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={2.35}
                        size={Math.round(height * 0.024)}
                        withBar
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 04 · FED_QUOTE — cita / claim centrado
 * ########################################################################## */

export type FedQuoteProps = {
  totalF?: number;
  kicker?: string;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedQuote: React.FC<FedQuoteProps> = ({
  totalF,
  kicker = 'Nuestra filosofía',
  quote = 'La piel no necesita más química. Necesita menos.',
  author = 'Dr. Federer',
  role = 'Dermocosmética natural',
  image,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const mark = spring({
    frame: frame - Math.round(0.42 * fps),
    fps,
    config: {damping: 14, stiffness: 120, mass: 0.8},
  });
  const markGlow = 0.4 + 0.12 * Math.sin(frame * 0.07);

  const authP = spring({
    frame: frame - Math.round(2.3 * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-quote" panDir={1} pushTo={1.035}>
          {(cam) => (
            <>
              {image ? (
                <ParallaxLayer factor={0.3} z={2} px={cam.px} py={cam.py}>
                  <AbsoluteFill
                    style={{filter: 'blur(22px)', transform: 'scale(1.15)', opacity: 0.14}}
                  >
                    <Img src={image} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </AbsoluteFill>
                </ParallaxLayer>
              ) : null}
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift
                  style={{left: '12%', right: '12%', top: '50%', textAlign: 'center'}}
                  centerY
                  zoom={0.015}
                >
                  {kicker ? (
                    <div style={{marginBottom: height * 0.02}}>
                      <KickerCenter text={kicker} accent={accent} startSec={0.35} />
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: Math.round(height * 0.15),
                      lineHeight: 0.5,
                      color: accent,
                      textShadow: `0 0 40px ${rgba(accent, markGlow)}`,
                      opacity: interpolate(mark, [0, 0.4], [0, 1], CLAMP),
                      transform: `scale(${
                        interpolate(mark, [0, 1], [1.7, 1], CLAMP) *
                        (1 + Math.max(0, mark - 1) * 0.2)
                      })`,
                      filter: `blur(${Math.max(0, interpolate(mark, [0, 1], [14, 0], CLAMP))}px)`,
                      marginBottom: height * 0.045,
                    }}
                  >
                    “
                  </div>
                  <Words
                    text={quote}
                    accent={accent}
                    startSec={0.7}
                    size={Math.round(Math.min(width * 0.032, height * 0.056))}
                    serif
                    italic
                    uppercase={false}
                    weight={500}
                    staggerSec={0.14}
                    color="rgba(232, 238, 250, 0.96)"
                  />
                  {author ? (
                    <div
                      style={{
                        marginTop: height * 0.04,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        opacity: interpolate(authP, [0, 1], [0, 1], CLAMP),
                        transform: `translateY(${interpolate(authP, [0, 1], [12, 0], CLAMP)}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: interpolate(authP, [0, 1], [0, 40], CLAMP),
                          height: 2,
                          background: accent,
                          boxShadow: `0 0 12px ${rgba(accent, 0.6)}`,
                        }}
                      />
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 700,
                          fontSize: Math.round(height * 0.021),
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase',
                          color: '#eef3ff',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {author}
                      </div>
                      {role ? (
                        <div
                          style={{
                            fontFamily: FONT_SANS,
                            fontWeight: 500,
                            fontSize: Math.round(height * 0.018),
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'rgba(200, 210, 230, 0.6)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {role}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 05 · FED_MOLECULE — diagrama nodo central + líneas conectoras
 * ########################################################################## */

export type FedMoleculeNode = {label: string};

export type FedMoleculeProps = {
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  centerLabel?: string;
  image?: string;
  nodes?: FedMoleculeNode[];
  accent?: string;
  mood?: FedMood;
};

export const FedMolecule: React.FC<FedMoleculeProps> = ({
  totalF,
  kicker = 'Activo estrella',
  title = 'Ácido carnósico',
  hot = ['carnósico'],
  sub = 'Uno de los antioxidantes más potentes que existen en la naturaleza.',
  centerLabel = 'Romero',
  image = FED_ASSETS.romero,
  nodes = [{label: 'Antioxidante'}, {label: 'Antiinflamatorio'}, {label: 'Estimula el colágeno'}],
  accent = TEAL,
  mood = 'science',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const list = nodes.slice(0, 4);
  const n = Math.max(1, list.length);
  const R = 33;
  const pts = list.map((_, i) => {
    const a = ((-90 + i * (360 / n)) * Math.PI) / 180;
    return {x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a)};
  });

  const size = Math.round(height * 0.72);
  const breathe = 1 + 0.012 * Math.sin(frame * 0.05);

  const centerIn = spring({
    frame: frame - Math.round(0.5 * fps),
    fps,
    config: {damping: 16, stiffness: 90, mass: 0.9},
  });

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-molecule" panDir={-1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    right: '4%',
                    top: '50%',
                    width: size,
                    height: size,
                    transform: `translateY(-50%) scale(${breathe})`,
                    willChange: 'transform',
                  }}
                >
                  {/* líneas + pulsos + anillo */}
                  <svg
                    viewBox="0 0 100 100"
                    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}
                  >
                    <circle
                      cx={50}
                      cy={50}
                      r={20}
                      fill="none"
                      stroke={rgba(accent, 0.4)}
                      strokeWidth={0.35}
                      strokeDasharray="2 2.6"
                      transform={`rotate(${(frame * 0.25).toFixed(2)} 50 50)`}
                      opacity={interpolate(centerIn, [0, 1], [0, 1], CLAMP)}
                    />
                    {pts.map((p, i) => {
                      const len = Math.hypot(p.x - 50, p.y - 50);
                      const start = Math.round((0.75 + i * 0.22) * fps);
                      const d = interpolate(frame, [start, start + Math.round(0.55 * fps)], [0, 1], {
                        ...CLAMP,
                        easing: Easing.out(Easing.cubic),
                      });
                      const pp = mod(frame * 0.006 + i * 0.37, 1);
                      const px2 = 50 + (p.x - 50) * pp;
                      const py2 = 50 + (p.y - 50) * pp;
                      const pop = Math.sin(pp * Math.PI) * d;
                      const linePulse = 0.34 + 0.1 * Math.sin(frame * 0.05 + i * 1.4);
                      return (
                        <g key={i}>
                          <line
                            x1={50}
                            y1={50}
                            x2={p.x}
                            y2={p.y}
                            stroke={rgba(accent, linePulse)}
                            strokeWidth={0.4}
                            strokeLinecap="round"
                            strokeDasharray={len}
                            strokeDashoffset={len * (1 - d)}
                          />
                          <circle cx={px2} cy={py2} r={1.15} fill={accent} opacity={pop * 0.9} />
                        </g>
                      );
                    })}
                  </svg>

                  {/* nodo central */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '32%',
                      aspectRatio: '1',
                      transform: `translate(-50%, -50%) scale(${interpolate(
                        centerIn,
                        [0, 1],
                        [0.5, 1],
                        CLAMP
                      )})`,
                      opacity: interpolate(centerIn, [0, 0.35], [0, 1], CLAMP),
                      filter: `blur(${Math.max(0, interpolate(centerIn, [0, 1], [12, 0], CLAMP))}px)`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-30%',
                        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                          accent,
                          0.3 + 0.08 * Math.sin(frame * 0.07)
                        )} 0%, transparent 70%)`,
                        filter: 'blur(24px)',
                        zIndex: -1,
                      }}
                    />
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${rgba(accent, 0.55)}`,
                        boxShadow: `0 0 40px ${rgba(accent, 0.35)}, inset 0 0 30px rgba(2,6,16,0.5)`,
                      }}
                    >
                      <Img src={image} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '108%',
                        transform: 'translateX(-50%)',
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: Math.round(height * 0.017),
                        letterSpacing: '0.26em',
                        textTransform: 'uppercase',
                        color: '#eef3ff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {centerLabel}
                    </div>
                  </div>

                  {/* chips de nodos */}
                  {pts.map((p, i) => {
                    const st = Math.round((1.1 + i * 0.22) * fps);
                    const c = spring({
                      frame: frame - st,
                      fps,
                      config: {damping: 15, stiffness: 130, mass: 0.7},
                    });
                    const pulse = 0.92 + 0.08 * Math.sin(frame * 0.07 + i);
                    return (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          transform: `translate(-50%, -50%) scale(${interpolate(
                            c,
                            [0, 1],
                            [0.4, 1],
                            CLAMP
                          )})`,
                          opacity: interpolate(c, [0, 0.4], [0, 1], CLAMP) * pulse,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 20px',
                          borderRadius: 999,
                          border: `1px solid ${rgba(accent, 0.4)}`,
                          background: 'rgba(4, 8, 16, 0.6)',
                          backdropFilter: 'blur(8px)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: accent,
                            boxShadow: `0 0 12px ${rgba(accent, 0.85)}`,
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontWeight: 600,
                            fontSize: Math.round(height * 0.017),
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#eef3ff',
                          }}
                        >
                          {list[i].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '8%', top: '50%', width: '42%'}} centerY origin="0% 50%">
                  {kicker ? <Kicker text={kicker} accent={accent} startSec={0.4} /> : null}
                  <div style={{marginTop: height * 0.02}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.58}
                      size={Math.round(Math.min(width * 0.042, height * 0.072))}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.024}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={1.6}
                        size={Math.round(height * 0.026)}
                        withBar
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 06 · FED_STEP — tarjeta de paso (ritual)
 * ########################################################################## */

export type FedStepProps = {
  totalF?: number;
  step?: number;
  total?: number;
  title?: string;
  hot?: string[];
  sub?: string;
  image?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedStep: React.FC<FedStepProps> = ({
  totalF,
  step = 1,
  total = 3,
  title = 'Infusioná en aceite',
  hot = ['aceite'],
  sub = '20 minutos a fuego mínimo, sin hervir.',
  image = FED_ASSETS.aceite,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const ghostIn = spring({
    frame: frame - Math.round(0.3 * fps),
    fps,
    config: {damping: 22, stiffness: 70, mass: 1},
  });
  const ghostPush = interpolate(frame, [0, FED_SCENE_F], [1, 1.05], CLAMP);

  const chipIn = spring({
    frame: frame - Math.round(0.45 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  const stepStr = String(step).padStart(2, '0');

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-step" panDir={1} sprigs>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.45} z={2} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    right: '1%',
                    top: '50%',
                    transform: `translateY(-50%) scale(${ghostPush})`,
                    transformOrigin: '100% 50%',
                    fontFamily: FONT_SANS,
                    fontWeight: 800,
                    fontSize: Math.round(height * 0.58),
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${rgba(accent, 0.15)}`,
                    opacity: interpolate(ghostIn, [0, 1], [0, 1], CLAMP),
                  }}
                >
                  {stepStr}
                </div>
              </ParallaxLayer>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <HeroCard
                  src={image}
                  accent={accent}
                  delayF={Math.round(0.35 * fps)}
                  w={Math.min(width * 0.26, height * 0.5)}
                  cx={63}
                  cy={50}
                  rot={1.6}
                  framed
                  brackets
                  floatSeed="fed-step"
                />
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '8%', top: '50%', width: '44%'}} centerY origin="0% 50%">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      opacity: interpolate(chipIn, [0, 0.4], [0, 1], CLAMP),
                      transform: `translateY(${interpolate(chipIn, [0, 1], [14, 0], CLAMP)}px)`,
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 22px',
                        borderRadius: 999,
                        border: `1px solid ${rgba(accent, 0.45)}`,
                        background: rgba(accent, 0.1),
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: Math.round(height * 0.017),
                        letterSpacing: '0.26em',
                        textTransform: 'uppercase',
                        color: accent,
                        whiteSpace: 'nowrap',
                        boxShadow: `0 0 20px ${rgba(accent, 0.25)}`,
                      }}
                    >
                      {`Paso ${step} de ${total}`}
                    </div>
                    <div style={{display: 'flex', gap: 9, alignItems: 'center'}}>
                      {Array.from({length: total}).map((_, i) => {
                        const active = i === step - 1;
                        const done = i < step - 1;
                        const dIn = spring({
                          frame: frame - Math.round((0.6 + i * 0.12) * fps),
                          fps,
                          config: {damping: 16, stiffness: 140, mass: 0.7},
                        });
                        const wDot = active ? interpolate(dIn, [0, 1], [8, 30], CLAMP) : 8;
                        const bg = active
                          ? accent
                          : done
                          ? rgba(accent, 0.45)
                          : 'rgba(255,255,255,0.18)';
                        return (
                          <div
                            key={i}
                            style={{
                              width: wDot,
                              height: 8,
                              borderRadius: 6,
                              background: bg,
                              boxShadow: active ? `0 0 14px ${rgba(accent, 0.8)}` : 'none',
                              opacity: interpolate(dIn, [0, 0.4], [0, 1], CLAMP),
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div style={{marginTop: height * 0.026}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.62}
                      size={Math.round(Math.min(width * 0.042, height * 0.075))}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.024}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={1.6}
                        size={Math.round(height * 0.027)}
                        withBar
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 07 · FED_BEFOREAFTER — antes/después con divisor que barre
 * ########################################################################## */

export type FedBeforeAfterProps = {
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  imageA?: string;
  imageB?: string;
  labelA?: string;
  labelB?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedBeforeAfter: React.FC<FedBeforeAfterProps> = ({
  totalF,
  kicker = 'Semana 12 · Ritual de romero',
  title = 'Los resultados hablan',
  hot = ['hablan'],
  imageA = FED_ASSETS.piel,
  imageB = FED_ASSETS.piel,
  labelA = 'Antes',
  labelB = 'Después',
  accent = COOL_BLUE,
  mood = 'cool',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const delayF = Math.round(0.3 * fps);
  const enter = spring({
    frame: frame - delayF,
    fps,
    config: {damping: 24, stiffness: 65, mass: 1},
  });
  const over = Math.max(0, enter - 1);
  const focusBlur = Math.max(0, interpolate(enter, [0, 1], [16, 0], CLAMP));
  const enterScale = interpolate(enter, [0, 1], [1.1, 1], CLAMP) * (1 + over * 0.08);
  const enterY = interpolate(enter, [0, 1], [44, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);
  const floatY = Math.sin(frame * 0.08 + 1.3) * height * 0.006;

  const pStart = Math.round(0.95 * fps);
  const pEnd = pStart + Math.round(1.9 * fps);
  const clipRight = interpolate(frame, [pStart, pEnd], [100, 8], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const dividerLeft = 100 - clipRight;
  const divOp = interpolate(frame, [pStart, pStart + 8], [0, 1], CLAMP);
  const divGlow = 0.55 + 0.2 * Math.sin(frame * 0.08);

  const labelBOp = interpolate(frame, [pStart + Math.round(0.55 * fps), pEnd], [0, 1], CLAMP);

  const cardW = Math.round(Math.min(width * 0.44, height * 1.02));

  const chip: React.CSSProperties = {
    position: 'absolute',
    top: '5%',
    padding: '8px 20px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(4, 8, 16, 0.55)',
    backdropFilter: 'blur(8px)',
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: Math.round(height * 0.016),
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-ba" panDir={-1} kickF={pEnd} kickAmt={0.012}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '56%',
                    width: cardW,
                    transform: `translate(-50%, -50%) translateY(${
                      enterY + floatY
                    }px) scale(${enterScale})`,
                    opacity,
                    willChange: 'transform, filter, opacity',
                  }}
                >
                  <div style={{position: 'relative', width: '100%'}}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-18%',
                        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                          accent,
                          0.2
                        )} 0%, transparent 70%)`,
                        filter: 'blur(30px)',
                        zIndex: -1,
                      }}
                    />
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '3 / 2',
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: '#0a1226',
                        filter: `blur(${focusBlur}px) drop-shadow(0 ${height * 0.03}px ${
                          height * 0.05
                        }px rgba(1, 4, 12, 0.65))`,
                      }}
                    >
                      {/* ANTES (base, tratada fría) */}
                      <AbsoluteFill>
                        <Img
                          src={imageA}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'saturate(0.5) brightness(0.82) contrast(0.95)',
                          }}
                        />
                        <div style={{...chip, left: '4%', color: 'rgba(220,228,244,0.85)'}}>
                          {labelA}
                        </div>
                      </AbsoluteFill>
                      {/* DESPUÉS (clip revela de izquierda a derecha) */}
                      <AbsoluteFill
                        style={{clipPath: `inset(0 ${clipRight.toFixed(2)}% 0 0)`}}
                      >
                        <Img
                          src={imageB}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                        <div
                          style={{
                            ...chip,
                            left: '4%',
                            color: '#eef3ff',
                            border: `1px solid ${rgba(accent, 0.5)}`,
                            boxShadow: `0 0 18px ${rgba(accent, 0.3)}`,
                            opacity: labelBOp,
                          }}
                        >
                          {labelB}
                        </div>
                      </AbsoluteFill>
                      {/* divisor dorado */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: `${dividerLeft.toFixed(2)}%`,
                          width: 3,
                          background: accent,
                          boxShadow: `0 0 22px ${rgba(accent, divGlow)}`,
                          opacity: divOp,
                          transform: 'translateX(-50%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: `${dividerLeft.toFixed(2)}%`,
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          border: `2px solid ${accent}`,
                          background: 'rgba(4, 8, 16, 0.75)',
                          backdropFilter: 'blur(6px)',
                          boxShadow: `0 0 24px ${rgba(accent, divGlow)}`,
                          transform: 'translate(-50%, -50%)',
                          opacity: divOp,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width={22} height={22} viewBox="0 0 24 24">
                          <polyline
                            points="M14 5 L8 12 L14 19"
                            fill="none"
                            stroke={accent}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="M10 5 L16 12 L10 19"
                            fill="none"
                            stroke={rgba(accent, 0.55)}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          boxShadow: 'inset 0 0 70px rgba(2, 6, 16, 0.4)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: 0, right: 0, top: '9%', textAlign: 'center'}} zoom={0.012}>
                  <KickerCenter text={kicker} accent={accent} startSec={0.4} />
                  <div style={{marginTop: height * 0.014}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.55}
                      size={Math.round(Math.min(width * 0.03, height * 0.052))}
                    />
                  </div>
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 08 · FED_LOWERTHIRD — lower-third sobre avatar (video persistente)
 * ########################################################################## */

export type FedLowerThirdProps = {
  totalF?: number;
  name?: string;
  role?: string;
  topic?: string;
  accent?: string;
  avatarSrc?: string | null;
};

export const FedLowerThird: React.FC<FedLowerThirdProps> = ({
  totalF,
  name = 'Dr. Federer',
  role = 'Dermocosmética natural',
  topic = 'Romero · Ep. 01',
  accent = DEFAULT_ACCENT,
  avatarSrc = staticFile('med/avatar.mp4'),
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const push = interpolate(frame, [0, FED_SCENE_F], [1, 1.05], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;

  const dust = React.useMemo(
    () => makeMotes(7, 'fed-lt-dust', 2, 5, 0.008, 0.02, 0.05, 0.13),
    []
  );

  const lt = spring({
    frame: frame - Math.round(0.5 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });
  const ltX = interpolate(lt, [0, 1], [-46, 0], CLAMP);
  const ltB = Math.max(0, interpolate(lt, [0, 1], [12, 0], CLAMP));
  const ltO = interpolate(lt, [0, 0.35], [0, 1], CLAMP);
  const barH = interpolate(lt, [0, 1], [0, 100], CLAMP);

  const chip = spring({
    frame: frame - Math.round(1.15 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  const driftY = Math.sin(frame * 0.045) * height * 0.002;

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <AbsoluteFill style={{background: '#0a0805', overflow: 'hidden'}}>
          {/* avatar o fallback cálido */}
          <AbsoluteFill
            style={{
              transform: `translate(${handX}px, ${handY}px) scale(${push})`,
              willChange: 'transform',
            }}
          >
            {avatarSrc ? (
              <OffthreadVideo
                src={avatarSrc}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <AbsoluteFill style={{background: moodBg('warmdark', accent)}} />
            )}
            <AbsoluteFill
              style={{
                pointerEvents: 'none',
                background: `linear-gradient(160deg, ${rgba(
                  accent,
                  0.05
                )}, transparent 38%, transparent 68%, rgba(2, 6, 14, 0.28))`,
              }}
            />
          </AbsoluteFill>

          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="235, 205, 150" />

          {/* scrim de legibilidad */}
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              background:
                'linear-gradient(to top, rgba(3,6,13,0.62) 0%, rgba(3,6,13,0.2) 22%, transparent 46%)',
            }}
          />

          {/* chip de tema (arriba-izquierda) */}
          {topic ? (
            <div
              style={{
                position: 'absolute',
                left: '7%',
                top: '7%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 20px',
                borderRadius: 999,
                border: `1px solid ${rgba(accent, 0.35)}`,
                background: 'rgba(4, 8, 16, 0.5)',
                backdropFilter: 'blur(8px)',
                opacity: interpolate(chip, [0, 0.4], [0, 1], CLAMP),
                transform: `translateY(${interpolate(chip, [0, 1], [-12, 0], CLAMP)}px)`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 12px ${rgba(accent, 0.9)}`,
                  display: 'inline-block',
                  opacity: 0.7 + 0.3 * Math.sin(frame * 0.12),
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: Math.round(height * 0.016),
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#eef3ff',
                  whiteSpace: 'nowrap',
                }}
              >
                {topic}
              </span>
            </div>
          ) : null}

          {/* lower-third */}
          <div
            style={{
              position: 'absolute',
              left: '7%',
              bottom: '9%',
              display: 'flex',
              alignItems: 'stretch',
              gap: 20,
              opacity: ltO,
              filter: `blur(${ltB}px)`,
              transform: `translate(${ltX}px, ${driftY}px)`,
              willChange: 'transform, filter, opacity',
            }}
          >
            <div
              style={{
                width: 5,
                borderRadius: 3,
                background: accent,
                boxShadow: `0 0 18px ${rgba(accent, 0.7)}`,
                height: `${barH}%`,
                alignSelf: 'center',
                minHeight: 8,
              }}
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: Math.round(height * 0.042),
                  letterSpacing: '-0.01em',
                  color: '#f6f9ff',
                  textShadow: '0 4px 22px rgba(0,0,0,0.65)',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: Math.round(height * 0.018),
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: rgba(accent, 0.95),
                  whiteSpace: 'nowrap',
                }}
              >
                {role}
              </div>
            </div>
          </div>

          {/* viñeta */}
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              background:
                'radial-gradient(120% 100% at 50% 42%, transparent 62%, rgba(2, 5, 12, 0.42) 100%)',
            }}
          />
        </AbsoluteFill>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 09 · FED_CHECKLIST — lista con checks que se dibujan
 * ########################################################################## */

export type FedChecklistProps = {
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  items?: string[];
  accent?: string;
  mood?: FedMood;
};

export const FedChecklist: React.FC<FedChecklistProps> = ({
  totalF,
  kicker = 'Ritual nocturno',
  title = 'Antes de dormir',
  hot = ['dormir'],
  items = [
    'Limpiá suavemente el rostro',
    'Aplicá 3 gotas de aceite de romero',
    'Masajeá 60 segundos hacia arriba',
    'Dejá actuar toda la noche',
  ],
  accent = DEFAULT_ACCENT,
  mood = 'gold',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const list = items.slice(0, 4);
  const CIRC = 2 * Math.PI * 15;
  const CHECK_LEN = 22;

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-check" panDir={1} sprigs>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '8%', top: '50%', width: '30%'}} centerY origin="0% 50%">
                  {kicker ? <Kicker text={kicker} accent={accent} startSec={0.4} /> : null}
                  <div style={{marginTop: height * 0.02}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.58}
                      size={Math.round(Math.min(width * 0.034, height * 0.062))}
                    />
                  </div>
                </LiveDrift>
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift
                  style={{left: '44%', top: '50%', width: '48%'}}
                  centerY
                  origin="0% 50%"
                  zoom={0.012}
                >
                  {list.map((item, i) => {
                    const st = 0.75 + i * 0.5;
                    const rowIn = spring({
                      frame: frame - Math.round(st * fps),
                      fps,
                      config: {damping: 18, stiffness: 120, mass: 0.8},
                    });
                    const circleP = interpolate(
                      frame,
                      [Math.round(st * fps), Math.round((st + 0.4) * fps)],
                      [0, 1],
                      {...CLAMP, easing: Easing.out(Easing.cubic)}
                    );
                    const checkP = interpolate(
                      frame,
                      [Math.round((st + 0.18) * fps), Math.round((st + 0.48) * fps)],
                      [0, 1],
                      {...CLAMP, easing: Easing.out(Easing.cubic)}
                    );
                    const fillO = interpolate(checkP, [0.6, 1], [0, 1], CLAMP);
                    const lineP = interpolate(
                      frame,
                      [Math.round((st + 0.1) * fps), Math.round((st + 0.7) * fps)],
                      [0, 1],
                      {...CLAMP, easing: Easing.out(Easing.cubic)}
                    );
                    return (
                      <div key={i} style={{marginBottom: height * 0.008}}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 22,
                            padding: `${height * 0.016}px 0`,
                            opacity: interpolate(rowIn, [0, 0.4], [0, 1], CLAMP),
                            transform: `translateY(${interpolate(rowIn, [0, 1], [18, 0], CLAMP)}px)`,
                            filter: `blur(${Math.max(0, interpolate(rowIn, [0, 1], [8, 0], CLAMP))}px)`,
                          }}
                        >
                          <svg width={38} height={38} viewBox="0 0 34 34" style={{flexShrink: 0}}>
                            <circle
                              cx={17}
                              cy={17}
                              r={15}
                              fill={rgba(accent, 0.14)}
                              fillOpacity={fillO}
                              stroke={accent}
                              strokeWidth={2.2}
                              strokeDasharray={CIRC}
                              strokeDashoffset={CIRC * (1 - circleP)}
                              strokeLinecap="round"
                              transform="rotate(-90 17 17)"
                            />
                            <path
                              d="M10.5 17.5 L15 22 L24 12"
                              fill="none"
                              stroke={accent}
                              strokeWidth={2.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray={CHECK_LEN}
                              strokeDashoffset={CHECK_LEN * (1 - checkP)}
                            />
                          </svg>
                          <div
                            style={{
                              fontFamily: FONT_SANS,
                              fontWeight: 600,
                              fontSize: Math.round(height * 0.028),
                              color: 'rgba(232, 238, 250, 0.94)',
                              textShadow: '0 2px 14px rgba(0,0,0,0.5)',
                            }}
                          >
                            {item}
                          </div>
                        </div>
                        {i < list.length - 1 ? (
                          <div
                            style={{
                              height: 1,
                              width: `${(lineP * 100).toFixed(1)}%`,
                              background: 'rgba(255,255,255,0.09)',
                            }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 10 · FED_CTA — cierre con botón
 * ########################################################################## */

export type FedCtaProps = {
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  buttonLabel?: string;
  image?: string;
  accent?: string;
  mood?: FedMood;
};

export const FedCta: React.FC<FedCtaProps> = ({
  totalF,
  kicker = 'Empiece hoy',
  title = 'Su piel se lo va a agradecer',
  hot = ['agradecer'],
  sub = 'La receta completa, paso a paso, en la descripción.',
  buttonLabel = 'Suscríbase al canal',
  image = FED_ASSETS.romero,
  accent = DEFAULT_ACCENT,
  mood = 'gold',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const btnStart = Math.round(1.35 * fps);
  const btn = spring({
    frame: frame - btnStart,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.8},
  });
  const btnY = interpolate(btn, [0, 1], [28, 0], CLAMP);
  const btnB = Math.max(0, interpolate(btn, [0, 1], [10, 0], CLAMP));
  const btnO = interpolate(btn, [0, 0.35], [0, 1], CLAMP);
  const btnS = interpolate(btn, [0, 1], [0.88, 1], CLAMP) * (1 + Math.max(0, btn - 1) * 0.15);

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.09);
  const cycLen = Math.round(2.4 * fps);
  const cyc = mod(frame - btnStart, cycLen) / cycLen;
  const shX = interpolate(cyc, [0.5, 0.95], [-80, 200], CLAMP);
  const shO = interpolate(cyc, [0.5, 0.58, 0.86, 0.95], [0, 1, 1, 0], CLAMP) * btnO;

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF}>
        <Stage mood={mood} accent={accent} seed="fed-cta" kickF={btnStart + 8} sprigs panDir={-1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <HeroCard
                  src={image}
                  accent={accent}
                  delayF={Math.round(0.35 * fps)}
                  w={Math.min(width * 0.3, height * 0.56)}
                  cx={70}
                  cy={50}
                  rot={-2}
                  framed
                  floatSeed="fed-cta"
                />
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '8%', top: '50%', width: '50%'}} centerY origin="0% 50%">
                  {kicker ? <Kicker text={kicker} accent={accent} startSec={0.4} /> : null}
                  <div style={{marginTop: height * 0.02}}>
                    <Words
                      text={title}
                      hot={hot}
                      accent={accent}
                      startSec={0.58}
                      size={Math.round(Math.min(width * 0.046, height * 0.076))}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.022}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={1.5}
                        size={Math.round(height * 0.026)}
                        withBar
                      />
                    </div>
                  ) : null}
                  {/* botón */}
                  <div
                    style={{
                      marginTop: height * 0.04,
                      opacity: btnO,
                      filter: `blur(${btnB}px)`,
                      transform: `translateY(${btnY}px) scale(${btnS})`,
                      transformOrigin: '0% 50%',
                      willChange: 'transform, filter, opacity',
                      display: 'inline-block',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '22px 46px',
                        borderRadius: 999,
                        background: `linear-gradient(135deg, ${accent}, ${shade(accent, 0.78)})`,
                        overflow: 'hidden',
                        boxShadow: `0 12px ${44 + pulse * 14}px ${rgba(
                          accent,
                          0.3 + pulse * 0.16
                        )}, 0 2px 10px rgba(0,0,0,0.4)`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: Math.round(height * 0.023),
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#221804',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {buttonLabel}
                      </span>
                      <svg width={20} height={20} viewBox="0 0 20 20">
                        <path
                          d="M3 10 H15 M11 4.5 L16.5 10 L11 15.5"
                          fill="none"
                          stroke="#221804"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: '45%',
                          transform: `translateX(${shX}%) skewX(-16deg)`,
                          background:
                            'linear-gradient(100deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
                          mixBlendMode: 'screen',
                          opacity: shO,
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * FED_FULLSHOT — variante del kit: visual a PANTALLA COMPLETA (foto o clip) con
 *   Ken-Burns, grade por mood, viñeta y grano. Es el "visual full" del contrato
 *   avatar-full ↔ visual-full (nunca PiP). Acepta un pie de foto opcional.
 * ########################################################################## */

export type FedFullShotProps = {
  totalF?: number;
  src?: string;
  video?: boolean;
  caption?: string;
  kicker?: string;
  accent?: string;
  mood?: FedMood;
  ken?: 'in' | 'out' | 'left' | 'right';
  startFrom?: number;
};

export const FedFullShot: React.FC<FedFullShotProps> = ({
  totalF,
  src = FED_ASSETS.aceite,
  video = false,
  caption,
  kicker,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  ken = 'in',
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const dur = totalF ?? FED_SCENE_F;

  const p = interpolate(frame, [0, dur], [0, 1], CLAMP);
  const zoom = ken === 'out' ? 1.14 - 0.1 * p : 1.04 + 0.1 * p;
  const tx =
    ken === 'left' ? -width * 0.022 * p : ken === 'right' ? width * 0.022 * p : 0;
  const ty = ken === 'in' || ken === 'out' ? -height * 0.012 * p : 0;
  const hx = Math.sin(frame * 0.041) * width * 0.0012;
  const hy = Math.cos(frame * 0.034) * height * 0.0011;

  const dust = React.useMemo(
    () => makeMotes(9, 'fullshot-dust', 2, 6, 0.01, 0.026, 0.05, 0.14),
    []
  );

  const capIn = spring({
    frame: frame - Math.round(0.35 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF}>
        <AbsoluteFill
          style={{
            transform: `translate(${(tx + hx).toFixed(1)}px, ${(ty + hy).toFixed(
              1
            )}px) scale(${zoom.toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {video ? (
            <OffthreadVideo
              src={src}
              startFrom={startFrom}
              muted
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          ) : (
            <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          )}
        </AbsoluteFill>

        {/* grade por mood + viñeta */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              mood === 'cool'
                ? `linear-gradient(160deg, ${rgba(COOL_BLUE, 0.16)}, transparent 46%)`
                : mood === 'science'
                ? `linear-gradient(160deg, ${rgba(TEAL, 0.14)}, transparent 46%)`
                : `linear-gradient(160deg, ${rgba(accent, 0.14)}, transparent 46%)`,
              'radial-gradient(118% 96% at 50% 45%, transparent 52%, rgba(1,3,9,0.62) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.34), transparent 20%, transparent 74%, rgba(2,4,10,0.6))',
            ].join(', '),
          }}
        />
        <MotesLayer motes={dust} blur={1.3} scale={height / 1080} tint="238, 212, 165" />

        {kicker && (
          <div
            style={{
              position: 'absolute',
              top: height * 0.1,
              left: width * 0.07,
              fontFamily: FONT_SANS,
              fontSize: 16,
              letterSpacing: 8,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: rgba(accent, 0.92),
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
              opacity: interpolate(frame, [3, 16], [0, 1], CLAMP),
            }}
          >
            {kicker}
          </div>
        )}

        {caption && (
          <div
            style={{
              position: 'absolute',
              left: width * 0.07,
              right: width * 0.07,
              bottom: height * 0.11,
              opacity: interpolate(capIn, [0, 0.35], [0, 1], CLAMP),
              transform: `translateY(${interpolate(capIn, [0, 1], [26, 0], CLAMP).toFixed(1)}px)`,
            }}
          >
            <div
              style={{
                width: 58,
                height: 3,
                background: accent,
                marginBottom: 16,
                borderRadius: 2,
                boxShadow: `0 0 14px ${rgba(accent, 0.6)}`,
              }}
            />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: -0.4,
                color: '#F4EFE6',
                lineHeight: 1.12,
                textShadow: '0 4px 26px rgba(0,0,0,0.82)',
                maxWidth: '70%',
              }}
            >
              {caption}
            </div>
          </div>
        )}
      </TransitionShell>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * FED_OILCAROUSEL — carrusel 3D de tarjetas 3:4 flotantes sobre fondo borroso
 *   Variante del kit (NO es un kit aparte). Multicapa, estilo After Effects:
 *     L0 fondo fotográfico desenfocado con deriva lenta
 *     L1 wash de color + viñeta
 *     L2 bokeh grande de fondo
 *     L3 motas de polvo
 *     L4 anillo 3D con N tarjetas (cilindro, billboard parcial)
 *     L5 halo detrás de la tarjeta enfocada
 *     L6 bokeh de primer plano (fuera de foco)
 *     L7 placa de título de la tarjeta enfocada (reveal por máscara)
 *     L8 barrido de luz dorada + grano
 *   focus = -1 → giro libre, todas suaves.  focus = i → el anillo gira una
 *   vuelta y ATERRIZA con la tarjeta i al frente: esa sale de foco a foco
 *   (blur 18→0), sube de brillo y saturación, se cuadra a cámara y las demás
 *   se van a blur alto y penumbra.
 * ########################################################################## */

export type FedCarouselCard = {
  image: string;
  index: string;
  name: string;
  tag?: string;
};

export type FedOilCarouselProps = {
  cards: FedCarouselCard[];
  focus?: number;
  kicker?: string;
  bg?: string;
  accent?: string;
  intro?: boolean;
  spinSec?: number;
  landF?: number;
};

const CARD_W = 400;
const CARD_H = 533; // 3:4 exacto
const RING_R = 640;

const CarouselCard: React.FC<{
  card: FedCarouselCard;
  i: number;
  localAngle: number; // posición fija en el anillo (el anillo ya rota por fuera)
  worldAngle: number; // ángulo real frente a cámara = rot + localAngle
  accent: string;
  focused: boolean;
  anyFocus: boolean;
  p: number;
  intro: boolean;
}> = ({card, i, localAngle, worldAngle, accent, focused, anyFocus, p, intro}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rad = (worldAngle * Math.PI) / 180;
  const front = Math.cos(rad); // 1 = al frente, -1 = atrás
  const front01 = (front + 1) / 2;

  // entrada escalonada (ensamblado del anillo)
  const s = intro
    ? spring({frame: frame - i * 4, fps, config: {damping: 15, mass: 0.7}})
    : 1;

  // flotación propia de cada tarjeta
  const bobY = Math.sin(frame * 0.031 + i * 1.7) * 9;
  const bobR = Math.sin(frame * 0.024 + i * 2.3) * 1.6;

  // la enfocada se cuadra a cámara; el resto queda tangente al cilindro
  const bill = focused ? 0.25 + 0.75 * p : 0.28;

  const depthScale = 0.8 + 0.2 * front01;
  const scale = depthScale * (focused ? 1 + 0.24 * p : anyFocus ? 1 - 0.08 * p : 1) * s;

  const blur = focused
    ? 18 * (1 - p)
    : anyFocus
    ? 3 + 4 * (1 - front01) + 6 * p
    : 1.4 + 5.2 * (1 - front01);

  // las vecinas se apagan, pero NO desaparecen: si no, deja de leerse como carrusel
  const bright = focused ? 0.6 + 0.55 * p : anyFocus ? 0.95 - 0.38 * p : 0.62 + 0.38 * front01;
  const sat = focused ? 0.65 + 0.45 * p : anyFocus ? 1 - 0.34 * p : 0.85;

  const backFade = interpolate(front, [-1, -0.25], [0.18, 1], CLAMP);
  const opacity = s * backFade * (anyFocus && !focused ? 1 - 0.25 * p : 1);

  // barrido dorado que cruza la tarjeta justo cuando entra en foco
  const sweep = focused ? Math.sin(interpolate(p, [0.3, 0.95], [0, 1], CLAMP) * Math.PI) : 0;
  const sweepX = interpolate(p, [0.3, 0.95], [-130, 130], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: CARD_W,
        height: CARD_H,
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        transformStyle: 'preserve-3d',
        transform: [
          `rotateY(${localAngle}deg)`,
          `translateZ(${RING_R}px)`,
          `rotateY(${(-worldAngle * bill).toFixed(2)}deg)`,
          `translateY(${(bobY + (1 - s) * 480).toFixed(1)}px)`,
          `rotateX(${(bobR + (1 - s) * 34).toFixed(2)}deg)`,
          `scale(${scale.toFixed(4)})`,
        ].join(' '),
        opacity,
        zIndex: Math.round(front * 100) + 200,
        willChange: 'transform, opacity, filter',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          overflow: 'hidden',
          filter: `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(2)}) saturate(${sat.toFixed(2)})`,
          boxShadow: focused
            ? `0 42px 90px rgba(0,0,0,0.72), 0 0 0 2px ${rgba(accent, 0.34 + 0.36 * p)}, 0 0 ${(
                40 * p
              ).toFixed(0)}px ${rgba(accent, 0.3 * p)}`
            : '0 26px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
          background: '#0a0d14',
        }}
      >
        <Img
          src={card.image}
          style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
        />
        {/* grade interno: sombra abajo + luz arriba-izq */}
        <AbsoluteFill
          style={{
            background: [
              'linear-gradient(to bottom, rgba(0,0,0,0) 46%, rgba(2,4,9,0.82) 100%)',
              `linear-gradient(142deg, ${rgba(accent, 0.14)} 0%, transparent 44%)`,
            ].join(', '),
            pointerEvents: 'none',
          }}
        />
        {/* reflejo de vidrio permanente */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            left: 0,
            width: '38%',
            transform: `translateX(${(-40 + front01 * 150).toFixed(0)}%) skewX(-14deg)`,
            background:
              'linear-gradient(100deg, transparent 18%, rgba(255,255,255,0.11) 50%, transparent 82%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        {/* barrido dorado del enfoque */}
        {sweep > 0.01 && (
          <div
            style={{
              position: 'absolute',
              top: '-24%',
              bottom: '-24%',
              left: 0,
              width: '46%',
              transform: `translateX(${sweepX}%) skewX(-16deg)`,
              background: `linear-gradient(100deg, transparent 20%, ${rgba(
                accent,
                0.55
              )} 50%, transparent 80%)`,
              mixBlendMode: 'screen',
              opacity: sweep,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {/* número al pie de cada tarjeta (chiquito, siempre) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontSize: 15,
          letterSpacing: 4,
          fontWeight: 700,
          color: focused ? accent : 'rgba(255,255,255,0.42)',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          filter: focused ? 'none' : `blur(${(blur * 0.5).toFixed(1)}px)`,
          opacity: opacity,
        }}
      >
        {card.index}
      </div>
    </div>
  );
};

export const FedOilCarousel: React.FC<FedOilCarouselProps> = ({
  cards,
  focus = -1,
  kicker,
  bg,
  accent = DEFAULT_ACCENT,
  intro = false,
  spinSec = 26,
  landF = 34,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const n = Math.max(1, cards.length);
  const step = 360 / n;
  const anyFocus = focus >= 0 && focus < n;

  const degPerFrame = 360 / (spinSec * fps);
  const rotFree = -frame * degPerFrame;

  const p = anyFocus
    ? interpolate(frame, [0, landF], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)})
    : 0;

  const target = -focus * step - 360; // una vuelta entera + aterrizaje
  const rot = anyFocus
    ? interpolate(p, [0, 1], [0, target], CLAMP) + Math.sin(frame * 0.021) * 1.4
    : rotFree;

  // cámara: push-in lento + micro handheld
  const push = interpolate(frame, [0, 240], [1, 1.055], CLAMP);
  const hx = Math.sin(frame * 0.019) * width * 0.0018;
  const hy = Math.cos(frame * 0.026) * height * 0.0015;

  const farMotes = React.useMemo(
    () => makeMotes(16, 'oilcar-far', 3, 9, 0.05, 0.1, 0.12, 0.32),
    []
  );
  const nearBokeh = React.useMemo(
    () => makeMotes(5, 'oilcar-bok', 110, 240, 0.01, 0.026, 0.05, 0.12),
    []
  );

  const focusedCard = anyFocus ? cards[focus] : null;
  const plate = anyFocus ? interpolate(p, [0.42, 0.92], [0, 1], CLAMP) : 0;

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      {/* L0 · fondo fotográfico desenfocado con deriva */}
      {bg ? (
        <AbsoluteFill
          style={{
            transform: `scale(${(1.24 * push).toFixed(4)}) translate(${(hx * 2).toFixed(
              1
            )}px, ${(hy * 2).toFixed(1)}px)`,
            filter: 'blur(26px) saturate(0.8) brightness(0.44)',
          }}
        >
          <Img src={bg} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : null}

      {/* L1 · wash + viñeta */}
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(90% 80% at 50% 40%, ${rgba(accent, 0.1)} 0%, transparent 62%)`,
            'radial-gradient(120% 100% at 50% 46%, transparent 44%, rgba(1,3,8,0.88) 100%)',
            'linear-gradient(to bottom, rgba(2,4,10,0.5), transparent 26%, transparent 68%, rgba(2,4,10,0.72))',
          ].join(', '),
        }}
      />

      {/* L2 · bokeh de fondo */}
      <MotesLayer motes={nearBokeh} blur={14} scale={height / 1080} tint="240, 208, 150" />

      {/* L3 · polvo */}
      <MotesLayer motes={farMotes} blur={1.4} scale={height / 1080} tint="235, 210, 160" />

      {/* L5 · halo detrás de la tarjeta enfocada */}
      {anyFocus && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(38% 46% at 50% 48%, ${rgba(
              accent,
              0.3 * p
            )} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* L4 · anillo 3D */}
      <AbsoluteFill
        style={{
          perspective: 1500,
          perspectiveOrigin: '50% 48%',
          transform: `translate(${hx.toFixed(1)}px, ${hy.toFixed(1)}px) scale(${push.toFixed(4)})`,
        }}
      >
        <AbsoluteFill
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateY(-14px) rotateX(-7deg) rotateY(${rot.toFixed(3)}deg)`,
          }}
        >
          {cards.map((c, i) => (
            <CarouselCard
              key={c.index + i}
              card={c}
              i={i}
              localAngle={i * step}
              worldAngle={rot + i * step}
              accent={accent}
              focused={anyFocus && i === focus}
              anyFocus={anyFocus}
              p={p}
              intro={intro}
            />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* L6 · bokeh de primer plano fuera de foco */}
      <AbsoluteFill style={{filter: 'blur(16px)', opacity: 0.5, pointerEvents: 'none'}}>
        <MotesLayer motes={nearBokeh} blur={0} scale={height / 1080} tint="245, 216, 165" />
      </AbsoluteFill>

      {/* L7 · placa de la tarjeta enfocada */}
      {focusedCard && plate > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: height * 0.085,
            textAlign: 'center',
            clipPath: `inset(0 ${((1 - plate) * 50).toFixed(1)}% 0 ${((1 - plate) * 50).toFixed(
              1
            )}%)`,
            opacity: plate,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '18px 46px 20px',
              background:
                'linear-gradient(180deg, rgba(8,12,20,0.62), rgba(4,7,13,0.86))',
              border: `1px solid ${rgba(accent, 0.32)}`,
              borderRadius: 6,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 22px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15,
                letterSpacing: 7,
                fontWeight: 700,
                color: accent,
                marginBottom: 8,
              }}
            >
              {focusedCard.index}
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: -0.6,
                color: '#F4EFE6',
                lineHeight: 1.05,
                textShadow: '0 4px 24px rgba(0,0,0,0.7)',
                transform: `translateY(${((1 - plate) * 14).toFixed(1)}px)`,
              }}
            >
              {focusedCard.name}
            </div>
            {focusedCard.tag && (
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: 'italic',
                  fontSize: 25,
                  color: 'rgba(232,224,210,0.72)',
                  marginTop: 8,
                }}
              >
                {focusedCard.tag}
              </div>
            )}
          </div>
        </div>
      )}

      {/* kicker */}
      {kicker && (
        <div
          style={{
            position: 'absolute',
            top: height * 0.085,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_SANS,
            fontSize: 17,
            letterSpacing: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: rgba(accent, 0.9),
            textShadow: '0 2px 16px rgba(0,0,0,0.8)',
            opacity: interpolate(frame, [4, 20], [0, 1], CLAMP),
          }}
        >
          {kicker}
        </div>
      )}

      <GrainOverlay />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * FED_KITREEL — las 10 escenas encadenadas con el contrato (sin cortes duros)
 *   Cada escena arranca FED_WHIP_F frames antes de que termine la anterior:
 *   from = i * (FED_SCENE_F - FED_WHIP_F) = i * 138 · total = 1392 frames.
 * ########################################################################## */

export type FedKitReelProps = {
  accent?: string;
  avatarSrc?: string | null;
};

export const FedKitReel: React.FC<FedKitReelProps> = ({
  accent = DEFAULT_ACCENT,
  avatarSrc = staticFile('med/avatar.mp4'),
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const scenes: Array<{id: string; node: React.ReactNode}> = [
    {id: 'Chapter', node: <FedChapter accent={accent} />},
    {id: 'Hero', node: <FedHero accent={accent} />},
    {id: 'Stat', node: <FedStat />},
    {id: 'Quote', node: <FedQuote accent={accent} image={FED_ASSETS.romero} />},
    {id: 'Molecule', node: <FedMolecule />},
    {id: 'Step', node: <FedStep accent={accent} />},
    {id: 'BeforeAfter', node: <FedBeforeAfter />},
    {id: 'Checklist', node: <FedChecklist accent={accent} />},
    {id: 'LowerThird', node: <FedLowerThird accent={accent} avatarSrc={avatarSrc} />},
    {id: 'CTA', node: <FedCta accent={accent} />},
  ];

  const fadeIn = interpolate(frame, [0, 10], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - 14);
  const fadeOut = interpolate(frame, [foS, durationInFrames - 1], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      {scenes.map((s, i) => (
        <Sequence
          key={s.id}
          from={i * FED_STEP_F}
          durationInFrames={FED_SCENE_F}
          premountFor={30}
          name={`${String(i + 1).padStart(2, '0')} · ${s.id}`}
        >
          {s.node}
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          zIndex: 90,
          background: '#020409',
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ================================ ROOT =================================== */

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Fed-Chapter"
        component={FedChapter}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Capítulo',
          index: '01',
          title: 'El Romero',
          sub: 'De la cocina al laboratorio',
          accent: DEFAULT_ACCENT,
          mood: 'gold',
        }}
      />
      <Composition
        id="Fed-Hero"
        component={FedHero}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Dermocosmética natural',
          title: 'El secreto ya crece en su jardín',
          hot: ['crece'],
          sub: 'Rosmarinus officinalis · ciencia y tradición',
          image: FED_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'gold',
          side: 'left',
          framed: true,
        }}
      />
      <Composition
        id="Fed-Stat"
        component={FedStat}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Estudio clínico · 12 semanas',
          value: 87,
          suffix: '%',
          prefix: '',
          decimals: 0,
          label: 'notó la piel más firme',
          sub: 'Aplicación tópica diaria, todos los días.',
          image: FED_ASSETS.piel,
          accent: TEAL,
          mood: 'science',
        }}
      />
      <Composition
        id="Fed-Quote"
        component={FedQuote}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Nuestra filosofía',
          quote: 'La piel no necesita más química. Necesita menos.',
          author: 'Dr. Federer',
          role: 'Dermocosmética natural',
          image: FED_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'warmdark',
        }}
      />
      <Composition
        id="Fed-Molecule"
        component={FedMolecule}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Activo estrella',
          title: 'Ácido carnósico',
          hot: ['carnósico'],
          sub: 'Uno de los antioxidantes más potentes que existen en la naturaleza.',
          centerLabel: 'Romero',
          image: FED_ASSETS.romero,
          nodes: [
            {label: 'Antioxidante'},
            {label: 'Antiinflamatorio'},
            {label: 'Estimula el colágeno'},
          ],
          accent: TEAL,
          mood: 'science',
        }}
      />
      <Composition
        id="Fed-Step"
        component={FedStep}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          step: 1,
          total: 3,
          title: 'Infusioná en aceite',
          hot: ['aceite'],
          sub: '20 minutos a fuego mínimo, sin hervir.',
          image: FED_ASSETS.aceite,
          accent: DEFAULT_ACCENT,
          mood: 'warmdark',
        }}
      />
      <Composition
        id="Fed-BeforeAfter"
        component={FedBeforeAfter}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Semana 12 · Ritual de romero',
          title: 'Los resultados hablan',
          hot: ['hablan'],
          imageA: FED_ASSETS.piel,
          imageB: FED_ASSETS.piel,
          labelA: 'Antes',
          labelB: 'Después',
          accent: COOL_BLUE,
          mood: 'cool',
        }}
      />
      <Composition
        id="Fed-LowerThird"
        component={FedLowerThird}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: 'Dr. Federer',
          role: 'Dermocosmética natural',
          topic: 'Romero · Ep. 01',
          accent: DEFAULT_ACCENT,
          avatarSrc: staticFile('med/avatar.mp4'),
        }}
      />
      <Composition
        id="Fed-Checklist"
        component={FedChecklist}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Ritual nocturno',
          title: 'Antes de dormir',
          hot: ['dormir'],
          items: [
            'Limpiá suavemente el rostro',
            'Aplicá 3 gotas de aceite de romero',
            'Masajeá 60 segundos hacia arriba',
            'Dejá actuar toda la noche',
          ],
          accent: DEFAULT_ACCENT,
          mood: 'gold',
        }}
      />
      <Composition
        id="Fed-CTA"
        component={FedCta}
        durationInFrames={FED_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Empiece hoy',
          title: 'Su piel se lo va a agradecer',
          hot: ['agradecer'],
          sub: 'La receta completa, paso a paso, en la descripción.',
          buttonLabel: 'Suscríbase al canal',
          image: FED_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'gold',
        }}
      />
      <Composition
        id="Fed-KitReel"
        component={FedKitReel}
        durationInFrames={FED_REEL_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          accent: DEFAULT_ACCENT,
          avatarSrc: staticFile('med/avatar.mp4'),
        }}
      />
    </>
  );
};
