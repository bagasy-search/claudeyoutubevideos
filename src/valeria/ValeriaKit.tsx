/**
 * ============================================================================
 * VAL KIT — 11 escenas reutilizables · Doctora Valeria Alcázar
 *   (belleza vintage-editorial · papel crema · tinta espresso · latón/oro)
 * ----------------------------------------------------------------------------
 * FORK del FedererKit (dark-cinematic) re-pieleado a LUZ EDITORIAL CLARA.
 * Se conserva el 100% del CRAFT de movimiento (springs, interpolaciones,
 * push-in de cámara, whips, parallax, staggers). Sólo cambia la PIEL:
 *   oscuro→claro · azul/teal→oro · Georgia/Archivo→Playfair/Garamond/Caveat.
 *
 * EL SET (directora):
 *   01 Val_Chapter     · título de capítulo (letras blur-in + índice fantasma)
 *   02 Val_Hero        · foto flotante con glow + parallax + texto (depth)
 *   03 Val_Stat        · número gigante con count-up + track + rack focus
 *   04 Val_Quote       · cita serif centrada, polvo cálido, comilla latón
 *   05 Val_Molecule    · diagrama nodo central + líneas que se dibujan
 *   06 Val_Step        · tarjeta de paso (índice fantasma + dots de progreso)
 *   07 Val_BeforeAfter · antes/después con divisor dorado que barre
 *   08 Val_LowerThird  · lower-third sobre avatar (OffthreadVideo)
 *   09 Val_Checklist   · items con check que se dibuja, stagger
 *   10 Val_CTA         · cierre con botón latón (sheen periódico)
 *   11 Val_OilCarousel · anillo 3D de tarjetas (listas enumeradas: "25 secretos")
 *   +  Val_FullShot    · visual a pantalla completa (Ken-Burns)
 *
 * CONTRATO DE TRANSICIÓN (compartido): toda escena vive dentro de
 *   <TransitionShell> (whip/lift/iris/fold + light-sweep dorado).
 * Comp: 1920×1080 @ 30fps · escena = 150 frames (5s) · reel = 1392 frames.
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
import {
  VAL,
  FONT_DISPLAY,
  FONT_SERIF,
  FONT_SERIF_FINE,
  FONT_HAND,
  FONT_SANS,
  ValMood,
  CLAMP,
  rgba,
  shade,
  moodBg,
  CARD_SHADOW,
  CARD_SHADOW_SOFT,
  PaperGrain,
  WarmVignette,
} from './theme';

/* ============================ CONTRATO / CONSTANTES ====================== */

export const VAL_SCENE_F = 150; // 5s @30fps — duración estándar de cada escena
export const VAL_WHIP_F = 12; // 0.4s — solape de entrada/salida (CONTRATO)
export const VAL_STEP_F = VAL_SCENE_F - VAL_WHIP_F; // 138 — distancia entre cortes
export const VAL_REEL_F = VAL_SCENE_F + 9 * VAL_STEP_F; // 1392 — 10 escenas

export const DEFAULT_ACCENT = VAL.gold;

/** triplet "r, g, b" para el polvo dorado flotante (dust en luz cálida) */
const MOTE_TINT = '208, 164, 94';

export const VAL_ASSETS = {
  romero: staticFile('med/romero.png'),
  miel: staticFile('med/miel.png'),
  aceite: staticFile('med/aceite.png'),
  avena: staticFile('med/avena.png'),
  arcilla: staticFile('med/arcilla.png'),
  pepino: staticFile('med/pepino.png'),
  rostro: staticFile('med/rostro.png'),
  antes_despues: staticFile('med/antes_despues.png'),
} as const;

/* ================================ UTILIDADES ============================= */

const mod = (n: number, m: number) => ((n % m) + m) % m;

const normWord = (w: string): string =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9$%]/g, '');

const wordStagger = (n: number, max = 0.26): number =>
  n > 1 ? Math.min(max, Math.max(0.09, 2.4 / n)) : 0;

/* ------------------------------ partículas ------------------------------ */

export type Mote = {
  x: number;
  y0: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
};

export const makeMotes = (
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

/** Polvo cálido flotante — motas de latón suave a baja opacidad (luz de estudio vintage). */
export const MotesLayer: React.FC<{
  motes: Mote[];
  blur: number;
  scale: number;
  tint?: string;
}> = ({motes, blur, scale, tint = MOTE_TINT}) => {
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
                m.opacity * 0.42 * tw
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

/* ================== CONTRATO: TRANSITION SHELL COMPARTIDO ================
 * TODAS las escenas del kit entran y salen igual:
 *   whip (blur 18→0, x +5%→0, scale 1.10→1) + light-sweep dorado cálido,
 *   hold, whip de salida. El ADN de movimiento es idéntico al del canal madre;
 *   sólo el color del barrido es oro/crema (no azul frío).
 * ======================================================================= */

const DNA_BLUR = 18; // px que resuelven
const DNA_WHIP = 0.05; // desplazamiento = 5% del ancho
const DNA_SCALE_IN = 0.1; // entra en 1.10 → 1
const DNA_SCALE_OUT = 0.06; // sale a 0.94
const DNA_SWEEP = 42; // % que ocupa el barrido de luz

/** whip · lift · iris · fold · none — mismo ADN, distinto gesto. */
export type ValTransitionVariant = 'none' | 'whip' | 'lift' | 'iris' | 'fold';

export const TransitionShell: React.FC<{
  accent: string;
  totalF?: number;
  whipF?: number;
  variant?: ValTransitionVariant;
  children: React.ReactNode;
}> = ({accent, totalF = VAL_SCENE_F, whipF = VAL_WHIP_F, variant = 'whip', children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  if (variant === 'none') return <AbsoluteFill>{children}</AbsoluteFill>;

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
  const blur = (1 - en) * DNA_BLUR + ex * DNA_BLUR;
  const scale = 1 + (1 - en) * DNA_SCALE_IN - ex * DNA_SCALE_OUT;
  const push = (1 - en) - ex;
  const flashIn = Math.sin(Math.min(1, en) * Math.PI);
  const flashOut = Math.sin(ex * Math.PI);
  const sweep = Math.max(flashIn * 0.7, flashOut * 0.5);
  const sweepT = flashOut > flashIn ? ex : en;

  let transform: string;
  let mask: string | undefined;
  if (variant === 'lift') {
    transform = `translateY(${(push * height * DNA_WHIP).toFixed(1)}px) scale(${scale.toFixed(4)})`;
  } else if (variant === 'fold') {
    transform = `perspective(1800px) rotateY(${(push * 9).toFixed(2)}deg) translateX(${(
      push *
      width *
      DNA_WHIP *
      0.45
    ).toFixed(1)}px) scale(${scale.toFixed(4)})`;
  } else if (variant === 'iris') {
    const r = interpolate(Math.min(en, 1 - ex), [0, 1], [18, 165], CLAMP);
    mask = `radial-gradient(circle at 50% 50%, #000 ${(r * 0.62).toFixed(1)}%, transparent ${r.toFixed(1)}%)`;
    transform = `scale(${scale.toFixed(4)})`;
  } else {
    transform = `translateX(${(push * width * DNA_WHIP).toFixed(1)}px) scale(${scale.toFixed(4)})`;
  }

  // — BARRIDO DE LUZ CÁLIDA: sheen oro/crema sutil, orientado según el gesto —
  const sweepPos = interpolate(sweepT, [0, 1], [125, -65], CLAMP);
  const sweepNode =
    variant === 'iris' ? (
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `radial-gradient(circle at 50% 50%, transparent ${interpolate(
            sweepT,
            [0, 1],
            [0, 58],
            CLAMP
          ).toFixed(1)}%, ${rgba(accent, 0.26)} ${interpolate(sweepT, [0, 1], [6, 71], CLAMP).toFixed(
            1
          )}%, transparent ${interpolate(sweepT, [0, 1], [14, 84], CLAMP).toFixed(1)}%)`,
          mixBlendMode: 'soft-light',
          opacity: sweep,
          pointerEvents: 'none',
        }}
      />
    ) : variant === 'lift' ? (
      <div
        style={{
          position: 'absolute',
          left: '-12%',
          right: '-12%',
          height: `${DNA_SWEEP}%`,
          top: 0,
          transform: `translateY(${sweepPos}%) skewY(-9deg)`,
          background: `linear-gradient(190deg, transparent 22%, ${rgba(
            VAL.onAccent,
            0.55
          )} 50%, transparent 78%)`,
          mixBlendMode: 'soft-light',
          opacity: sweep,
          pointerEvents: 'none',
        }}
      />
    ) : (
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          bottom: '-12%',
          width: `${DNA_SWEEP}%`,
          left: 0,
          transform: `translateX(${sweepPos}%) skewX(${variant === 'fold' ? -26 : -16}deg)`,
          background: `linear-gradient(100deg, transparent 22%, ${rgba(
            VAL.onAccent,
            0.5
          )} 50%, transparent 78%)`,
          mixBlendMode: 'soft-light',
          opacity: sweep,
          pointerEvents: 'none',
        }}
      />
    );

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur.toFixed(2)}px)`,
        transform,
        transformOrigin: variant === 'fold' ? '18% 50%' : '50% 50%',
        maskImage: mask,
        WebkitMaskImage: mask,
        willChange: 'transform, filter, opacity',
      }}
    >
      {children}
      {sweepNode}
    </AbsoluteFill>
  );
};

/* ============================ PIEZAS DE TEXTO ============================ */

export const Kicker: React.FC<{text: string; accent: string; startSec: number}> = ({
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
  const track = interpolate(k, [0, 1], [0.4, 0.24], CLAMP);
  const o = interpolate(k, [0, 0.4], [0, 1], CLAMP);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: o}}>
      <div
        style={{
          width: ruleW,
          height: 2,
          borderRadius: 2,
          background: accent,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(width * 0.0115),
          letterSpacing: `${track}em`,
          textTransform: 'uppercase',
          color: accent,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const KickerCenter: React.FC<{text: string; accent: string; startSec: number}> = ({
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
          height: 1.5,
          background: `linear-gradient(to left, ${accent}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(width * 0.0115),
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: accent,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: ruleW,
          height: 1.5,
          background: `linear-gradient(to right, ${accent}, transparent)`,
        }}
      />
    </div>
  );
};

/**
 * Words — reparte la frase en palabras con stagger; resalta `hot` en acento.
 * serif=false → título display (Playfair) · serif=true → cita (Garamond itálica).
 * En papel crema la tinta es espresso; las sombras son suaves y cálidas.
 */
export const Words: React.FC<{
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
  color = VAL.ink,
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
        fontFamily: serif ? FONT_SERIF : FONT_DISPLAY,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        lineHeight: serif ? 1.24 : 1.08,
        letterSpacing: uppercase ? '-0.005em' : '0',
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
          : interpolate(w, [0, 1], [0.78, 1], CLAMP) * (1 + Math.max(0, w - 1) * 0.2);
        const isHot = hotSet.has(normWord(word));
        const glow = isHot ? 0.28 + 0.12 * Math.sin(frame * 0.09 + i * 1.3) : 0;
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
                ? `0 1px 1px ${rgba(VAL.paper, 0.6)}, 0 0 22px ${rgba(accent, glow)}`
                : `0 1px 1px ${rgba(VAL.paper, 0.55)}`,
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
        opacity: interpolate(p, [0, 1], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [16, 0], CLAMP)}px)`,
        filter: `blur(${Math.max(0, interpolate(p, [0, 1], [8, 0], CLAMP))}px)`,
        textAlign: align,
        paddingLeft: withBar ? 16 : 0,
        borderLeft: withBar ? `2px solid ${accent}` : 'none',
        fontFamily: FONT_SERIF_FINE,
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.35,
        color: VAL.ink2,
      }}
    >
      {text}
    </div>
  );
};

/** Anotación "a mano" (Caveat) opcional — como los rótulos de la miniatura. */
const HandNote: React.FC<{
  text: string;
  accent?: string;
  startSec: number;
  size: number;
  style?: React.CSSProperties;
}> = ({text, accent = VAL.gold, startSec, size, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - Math.round(startSec * fps),
    fps,
    config: {damping: 16, stiffness: 120, mass: 0.8},
  });
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: FONT_HAND,
        fontWeight: 700,
        fontSize: size,
        color: accent,
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP),
        transform: `rotate(-7deg) translateY(${interpolate(p, [0, 1], [10, 0], CLAMP)}px)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ====================== HERO CARD (foto flotante clara) ================== */

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
  const glowPulse = 0.2 + 0.06 * Math.sin(frame * 0.07 + fs);

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

  const tone = cool ? 'saturate(0.92) brightness(1.01) ' : '';
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
        {/* halo cálido detrás (suave, sobre crema) */}
        <div
          style={{
            position: 'absolute',
            inset: '-20%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
              accent,
              glowPulse
            )} 0%, ${rgba(accent, glowPulse * 0.3)} 42%, transparent 72%)`,
            filter: 'blur(34px)',
            zIndex: -1,
          }}
        />
        {framed ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 2',
              borderRadius: 18,
              overflow: 'hidden',
              border: `1px solid ${VAL.cardEdge}`,
              background: VAL.card,
              filter: `blur(${focusBlur}px) ${tone}drop-shadow(0 ${
                height * 0.026
              }px ${height * 0.05}px ${rgba(VAL.ink, 0.28)})`,
            }}
          >
            <Img
              src={src}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
            />
            {/* doble filete de etiqueta cosmética vintage */}
            <div
              style={{
                position: 'absolute',
                inset: 8,
                borderRadius: 12,
                border: `1px solid ${rgba(VAL.onAccent, 0.4)}`,
                boxShadow: `inset 0 0 0 3px ${rgba(accent, 0.16)}`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, ${rgba(VAL.onAccent, 0.14)}, transparent 30%)`,
                boxShadow: `inset 0 -40px 60px ${rgba(VAL.ink, 0.14)}`,
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
                background: `linear-gradient(100deg, transparent 30%, ${rgba(
                  VAL.onAccent,
                  0.4
                )} 50%, transparent 70%)`,
                mixBlendMode: 'soft-light',
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
                height * 0.028
              }px ${height * 0.045}px ${rgba(VAL.ink, 0.3)})`,
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

/* ============ rama de laurel/romero procedural (foreground) ============== */

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
      <path d={data.stem} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
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
          filter: 'blur(2px)',
          opacity: 0.5,
        }}
      >
        <Sprig seed={seed + '-l'} h={height * 0.9} color={color} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: '-4%',
          bottom: '-10%',
          transform: `scaleX(-1) rotate(${sway2}deg)`,
          transformOrigin: '50% 100%',
          filter: 'blur(1.5px)',
          opacity: 0.4,
        }}
      >
        <Sprig seed={seed + '-r'} h={height * 0.68} color={color} />
      </div>
    </>
  );
};

const sprigColor = (mood: ValMood): string =>
  ({
    cool: rgba(VAL.goldDark, 0.4),
    gold: rgba(VAL.gold, 0.5),
    warmdark: rgba(VAL.terracotta, 0.34),
    science: rgba(VAL.sage, 0.42),
  } as Record<ValMood, string>)[mood];

/* ================== STAGE (cámara + capas de profundidad) ================ */

type CamVec = {px: number; py: number};

export const Stage: React.FC<{
  mood: ValMood;
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

  const push = interpolate(frame, [0, VAL_SCENE_F], [1, pushTo], CLAMP);
  const kickP = kickF != null ? interpolate(frame, [kickF, kickF + 16], [0, 1], CLAMP) : 0;
  const camScale = push * (1 + Math.sin(kickP * Math.PI) * kickAmt);

  const handX =
    Math.sin(frame * 0.05 + seedN) * width * 0.0016 +
    Math.sin(frame * 0.014 + seedN * 2) * width * 0.0022;
  const handY = Math.cos(frame * 0.042 + seedN) * height * 0.0018;
  const panX = interpolate(frame, [0, VAL_SCENE_F], [0, width * 0.012 * panDir], CLAMP);
  const px = handX + panX;
  const py = handY;

  const farMotes = React.useMemo(
    () => makeMotes(14, seed + '-far', 4, 10, 0.05, 0.1, 0.1, 0.26),
    [seed]
  );
  const midMotes = React.useMemo(
    () => makeMotes(12, seed + '-mid', 2, 5.5, 0.03, 0.075, 0.2, 0.42),
    [seed]
  );
  const bokeh = React.useMemo(
    () => makeMotes(4, seed + '-bok', 90, 200, 0.008, 0.02, 0.04, 0.09),
    [seed]
  );

  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${camScale})`, willChange: 'transform'}}>
        {/* 1 · fondo cálido desenfocado (por mood) */}
        <ParallaxLayer factor={0.22} z={1} px={px} py={py}>
          <AbsoluteFill style={{filter: 'blur(13px)', transform: 'scale(1.16)'}}>
            <AbsoluteFill style={{background: moodBg(mood)}} />
            <MotesLayer motes={farMotes} blur={0} scale={height / 1080} />
            <AbsoluteFill
              style={{
                background: `radial-gradient(115% 92% at 50% 42%, transparent 46%, ${rgba(
                  VAL.paperEdge,
                  0.55
                )} 100%)`,
              }}
            />
          </AbsoluteFill>
        </ParallaxLayer>

        {/* 2 · motas medias */}
        <ParallaxLayer factor={0.4} z={2} px={px} py={py}>
          <MotesLayer motes={midMotes} blur={1.5} scale={height / 1080} />
        </ParallaxLayer>

        {/* 3 · contenido de la escena */}
        {children({px, py})}

        {/* 4 · bokeh grande delante */}
        <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
          <MotesLayer motes={bokeh} blur={9} scale={height / 1080} />
        </ParallaxLayer>

        {/* 5 · ramas de laurel en foreground (opcional) */}
        {sprigs ? (
          <ParallaxLayer factor={1.32} z={5} px={px} py={py}>
            <ForegroundSprigs seed={seed} color={sprigColor(mood)} />
          </ParallaxLayer>
        ) : null}

        {/* 6 · viñeta cálida / grade */}
        <AbsoluteFill style={{zIndex: 6, pointerEvents: 'none'}}>
          <WarmVignette strength={0.22} />
        </AbsoluteFill>
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
  const z = interpolate(frame, [0, VAL_SCENE_F], [1, 1 + zoom], CLAMP);
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
 * ESCENA 01 · VAL_CHAPTER — título de capítulo
 * ########################################################################## */

export type ValChapterProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  index?: string;
  title?: string;
  sub?: string;
  accent?: string;
  mood?: ValMood;
};

export const ValChapter: React.FC<ValChapterProps> = ({
  variant,
  totalF,
  kicker = 'Capítulo',
  index = '01',
  title = 'El Romero',
  sub = 'De la cocina al tocador',
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
  const ghostPush = interpolate(frame, [0, VAL_SCENE_F], [1, 1.06], CLAMP);

  const subP = spring({
    frame: frame - Math.round(1.8 * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-chapter" kickF={Math.round(0.7 * fps)} sprigs panDir={1}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.5} z={3} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    right: '2%',
                    bottom: '-9%',
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: Math.round(height * 0.52),
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${rgba(accent, 0.2)}`,
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
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 800,
                      fontSize: size,
                      lineHeight: 1.02,
                      letterSpacing: '-0.01em',
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
                                color: VAL.ink,
                                textShadow: `0 1px 1px ${rgba(VAL.paper, 0.6)}, 0 0 34px ${rgba(accent, 0.28)}`,
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
                      <div style={{width: interpolate(subP, [0, 1], [0, 38], CLAMP), height: 1, background: rgba(accent, 0.7)}} />
                      <div
                        style={{
                          fontFamily: FONT_SERIF_FINE,
                          fontStyle: 'italic',
                          fontSize: Math.round(height * 0.03),
                          color: VAL.ink2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {sub}
                      </div>
                      <div style={{width: interpolate(subP, [0, 1], [0, 38], CLAMP), height: 1, background: rgba(accent, 0.7)}} />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 02 · VAL_HERO — foto flotante de profundidad + texto
 * ########################################################################## */

export type ValHeroProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  image?: string;
  accent?: string;
  mood?: ValMood;
  side?: 'left' | 'right';
  framed?: boolean;
};

export const ValHero: React.FC<ValHeroProps> = ({
  variant,
  totalF,
  kicker = 'Belleza natural',
  title = 'El secreto ya crece en su cocina',
  hot = ['crece'],
  sub = 'Rosmarinus officinalis · ciencia y tradición',
  image = VAL_ASSETS.romero,
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
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-hero" sprigs panDir={isLeft ? 1 : -1}>
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
                  floatSeed="val-hero"
                  cool={mood === 'cool'}
                />
                {/* anotación "a mano" (Caveat) apuntando a la foto — acento vintage */}
                <HandNote
                  text="↑ natural"
                  accent={accent}
                  startSec={1.3}
                  size={Math.round(height * 0.036)}
                  style={{left: `${cx - 9}%`, top: '30%'}}
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
                      size={Math.round(Math.min(width * 0.05, height * 0.082))}
                      uppercase={false}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.026}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={1.9}
                        size={Math.round(height * 0.029)}
                        withBar={isLeft}
                        align={isLeft ? 'left' : 'center'}
                      />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 03 · VAL_STAT — número gigante con count-up
 * ########################################################################## */

export type ValStatProps = {
  variant?: ValTransitionVariant;
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
  mood?: ValMood;
};

export const ValStat: React.FC<ValStatProps> = ({
  variant,
  totalF,
  kicker = 'Estudio · 12 semanas',
  value = 87,
  suffix = '%',
  prefix = '',
  decimals = 0,
  label = 'notó la piel más firme',
  sub = 'Aplicación tópica, todas las noches.',
  image = VAL_ASSETS.rostro,
  accent = DEFAULT_ACCENT,
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
  const glowBase = 0.24 + land * 0.28 + 0.06 * Math.sin(frame * 0.08);

  const numSize = Math.round(Math.min(width * 0.11, height * 0.2));

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-stat" kickF={endF} panDir={-1}>
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
                  floatSeed="val-stat"
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
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 700,
                          fontSize: Math.round(numSize * 0.5),
                          color: accent,
                        }}
                      >
                        {prefix}
                      </span>
                    ) : null}
                    <span
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 800,
                        fontSize: numSize,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        fontVariantNumeric: 'tabular-nums',
                        color: VAL.ink,
                        textShadow: `0 1px 1px ${rgba(VAL.paper, 0.6)}, 0 0 ${
                          28 + land * 22
                        }px ${rgba(accent, glowBase)}`,
                      }}
                    >
                      {shown}
                    </span>
                    {suffix ? (
                      <span
                        style={{
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 700,
                          fontSize: Math.round(numSize * 0.42),
                          color: accent,
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
                      height: 6,
                      borderRadius: 4,
                      background: rgba(VAL.ink, 0.1),
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${(trackP * fillPct * 100).toFixed(2)}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: `linear-gradient(to right, ${rgba(accent, 0.6)}, ${accent})`,
                        boxShadow: `0 0 12px ${rgba(accent, 0.4)}`,
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
                        boxShadow: `0 0 14px ${rgba(accent, 0.7)}`,
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
                      size={Math.round(Math.min(width * 0.028, height * 0.048))}
                      weight={600}
                      uppercase={false}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.018}}>
                      <SubLine
                        text={sub}
                        accent={accent}
                        startSec={2.35}
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
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 04 · VAL_QUOTE — cita / claim centrado
 * ########################################################################## */

export type ValQuoteProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
  accent?: string;
  mood?: ValMood;
};

export const ValQuote: React.FC<ValQuoteProps> = ({
  variant,
  totalF,
  kicker = 'Mi filosofía',
  quote = 'La piel no necesita más química. Necesita menos.',
  author = 'Dra. Valeria Alcázar',
  role = 'Medicina estética',
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
  const markGlow = 0.32 + 0.1 * Math.sin(frame * 0.07);

  const authP = spring({
    frame: frame - Math.round(2.3 * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-quote" panDir={1} pushTo={1.035}>
          {(cam) => (
            <>
              {image ? (
                <ParallaxLayer factor={0.3} z={2} px={cam.px} py={cam.py}>
                  <AbsoluteFill style={{filter: 'blur(24px)', transform: 'scale(1.15)', opacity: 0.16}}>
                    <Img src={image} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </AbsoluteFill>
                </ParallaxLayer>
              ) : null}
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '12%', right: '12%', top: '50%', textAlign: 'center'}} centerY zoom={0.015}>
                  {kicker ? (
                    <div style={{marginBottom: height * 0.02}}>
                      <KickerCenter text={kicker} accent={accent} startSec={0.35} />
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: Math.round(height * 0.16),
                      lineHeight: 0.5,
                      color: accent,
                      textShadow: `0 0 34px ${rgba(accent, markGlow)}`,
                      opacity: interpolate(mark, [0, 0.4], [0, 1], CLAMP),
                      transform: `scale(${
                        interpolate(mark, [0, 1], [1.7, 1], CLAMP) *
                        (1 + Math.max(0, mark - 1) * 0.2)
                      })`,
                      filter: `blur(${Math.max(0, interpolate(mark, [0, 1], [14, 0], CLAMP))}px)`,
                      marginBottom: height * 0.045,
                    }}
                  >
                    &ldquo;
                  </div>
                  <Words
                    text={quote}
                    accent={accent}
                    startSec={0.7}
                    size={Math.round(Math.min(width * 0.036, height * 0.06))}
                    serif
                    italic
                    uppercase={false}
                    weight={500}
                    staggerSec={0.14}
                    color={VAL.ink}
                  />
                  {author ? (
                    <div
                      style={{
                        marginTop: height * 0.045,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        opacity: interpolate(authP, [0, 1], [0, 1], CLAMP),
                        transform: `translateY(${interpolate(authP, [0, 1], [12, 0], CLAMP)}px)`,
                      }}
                    >
                      <div style={{width: interpolate(authP, [0, 1], [0, 40], CLAMP), height: 2, background: accent}} />
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 700,
                          fontSize: Math.round(height * 0.022),
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: VAL.ink,
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
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: VAL.inkSoft,
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
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 05 · VAL_MOLECULE — diagrama nodo central + líneas conectoras
 * ########################################################################## */

export type ValMoleculeNode = {label: string};

export type ValMoleculeProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  centerLabel?: string;
  image?: string;
  nodes?: ValMoleculeNode[];
  accent?: string;
  mood?: ValMood;
};

export const ValMolecule: React.FC<ValMoleculeProps> = ({
  variant,
  totalF,
  kicker = 'Activo estrella',
  title = 'Ácido carnósico',
  hot = ['carnósico'],
  sub = 'Uno de los antioxidantes más potentes que existen en la naturaleza.',
  centerLabel = 'Romero',
  image = VAL_ASSETS.romero,
  nodes = [{label: 'Antioxidante'}, {label: 'Antiinflamatorio'}, {label: 'Estimula el colágeno'}],
  accent = DEFAULT_ACCENT,
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
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-molecule" panDir={-1}>
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
                  <svg
                    viewBox="0 0 100 100"
                    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}
                  >
                    <circle
                      cx={50}
                      cy={50}
                      r={20}
                      fill="none"
                      stroke={rgba(accent, 0.45)}
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
                      const linePulse = 0.4 + 0.12 * Math.sin(frame * 0.05 + i * 1.4);
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
                      transform: `translate(-50%, -50%) scale(${interpolate(centerIn, [0, 1], [0.5, 1], CLAMP)})`,
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
                          0.24 + 0.06 * Math.sin(frame * 0.07)
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
                        border: `2px solid ${rgba(accent, 0.6)}`,
                        boxShadow: `0 0 34px ${rgba(accent, 0.28)}, inset 0 0 24px ${rgba(VAL.ink, 0.18)}`,
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
                        fontSize: Math.round(height * 0.018),
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: VAL.ink,
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
                          transform: `translate(-50%, -50%) scale(${interpolate(c, [0, 1], [0.4, 1], CLAMP)})`,
                          opacity: interpolate(c, [0, 0.4], [0, 1], CLAMP) * pulse,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 20px',
                          borderRadius: 999,
                          border: `1px solid ${rgba(accent, 0.5)}`,
                          background: rgba(VAL.card, 0.9),
                          boxShadow: CARD_SHADOW_SOFT,
                          backdropFilter: 'blur(4px)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: accent,
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontWeight: 600,
                            fontSize: Math.round(height * 0.017),
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: VAL.ink,
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
                      size={Math.round(Math.min(width * 0.044, height * 0.074))}
                      uppercase={false}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.024}}>
                      <SubLine text={sub} accent={accent} startSec={1.6} size={Math.round(height * 0.028)} withBar />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 06 · VAL_STEP — tarjeta de paso (ritual)
 * ########################################################################## */

export type ValStepProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  step?: number;
  total?: number;
  title?: string;
  hot?: string[];
  sub?: string;
  image?: string;
  accent?: string;
  mood?: ValMood;
};

export const ValStep: React.FC<ValStepProps> = ({
  variant,
  totalF,
  step = 1,
  total = 3,
  title = 'Infusioná en aceite',
  hot = ['aceite'],
  sub = '20 minutos a fuego mínimo, sin hervir.',
  image = VAL_ASSETS.aceite,
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
  const ghostPush = interpolate(frame, [0, VAL_SCENE_F], [1, 1.05], CLAMP);

  const chipIn = spring({
    frame: frame - Math.round(0.45 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  const stepStr = String(step).padStart(2, '0');

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-step" panDir={1} sprigs>
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
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: Math.round(height * 0.58),
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${rgba(accent, 0.2)}`,
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
                  floatSeed="val-step"
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
                        border: `1px solid ${rgba(accent, 0.5)}`,
                        background: rgba(accent, 0.12),
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: Math.round(height * 0.017),
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: VAL.goldDark,
                        whiteSpace: 'nowrap',
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
                        const bg = active ? accent : done ? rgba(accent, 0.5) : rgba(VAL.ink, 0.16);
                        return (
                          <div
                            key={i}
                            style={{
                              width: wDot,
                              height: 8,
                              borderRadius: 6,
                              background: bg,
                              boxShadow: active ? `0 0 10px ${rgba(accent, 0.5)}` : 'none',
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
                      size={Math.round(Math.min(width * 0.044, height * 0.078))}
                      uppercase={false}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.024}}>
                      <SubLine text={sub} accent={accent} startSec={1.6} size={Math.round(height * 0.029)} withBar />
                    </div>
                  ) : null}
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 07 · VAL_BEFOREAFTER — antes/después con divisor que barre
 * ########################################################################## */

export type ValBeforeAfterProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  imageA?: string;
  imageB?: string;
  labelA?: string;
  labelB?: string;
  accent?: string;
  mood?: ValMood;
};

export const ValBeforeAfter: React.FC<ValBeforeAfterProps> = ({
  variant,
  totalF,
  kicker = 'Semana 12 · Ritual de romero',
  title = 'Los resultados hablan',
  hot = ['hablan'],
  imageA = VAL_ASSETS.rostro,
  imageB = VAL_ASSETS.rostro,
  labelA = 'Antes',
  labelB = 'Después',
  accent = DEFAULT_ACCENT,
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
  const divGlow = 0.5 + 0.2 * Math.sin(frame * 0.08);

  const labelBOp = interpolate(frame, [pStart + Math.round(0.55 * fps), pEnd], [0, 1], CLAMP);

  const cardW = Math.round(Math.min(width * 0.44, height * 1.02));

  const chip: React.CSSProperties = {
    position: 'absolute',
    top: '5%',
    padding: '8px 20px',
    borderRadius: 999,
    border: `1px solid ${VAL.cardEdge}`,
    background: rgba(VAL.card, 0.9),
    backdropFilter: 'blur(4px)',
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: Math.round(height * 0.016),
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-ba" panDir={-1} kickF={pEnd} kickAmt={0.012}>
          {(cam) => (
            <>
              <ParallaxLayer factor={0.62} z={3} px={cam.px} py={cam.py}>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '56%',
                    width: cardW,
                    transform: `translate(-50%, -50%) translateY(${enterY + floatY}px) scale(${enterScale})`,
                    opacity,
                    willChange: 'transform, filter, opacity',
                  }}
                >
                  <div style={{position: 'relative', width: '100%'}}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-16%',
                        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, 0.18)} 0%, transparent 70%)`,
                        filter: 'blur(30px)',
                        zIndex: -1,
                      }}
                    />
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '3 / 2',
                        borderRadius: 18,
                        overflow: 'hidden',
                        border: `1px solid ${VAL.cardEdge}`,
                        background: VAL.card,
                        filter: `blur(${focusBlur}px) drop-shadow(0 ${height * 0.028}px ${
                          height * 0.05
                        }px ${rgba(VAL.ink, 0.28)})`,
                      }}
                    >
                      {/* ANTES (base, apagada) */}
                      <AbsoluteFill>
                        <Img
                          src={imageA}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'saturate(0.55) brightness(0.94) contrast(0.96) sepia(0.12)',
                          }}
                        />
                        <div style={{...chip, left: '4%', color: VAL.ink2}}>{labelA}</div>
                      </AbsoluteFill>
                      {/* DESPUÉS (clip revela de izquierda a derecha) */}
                      <AbsoluteFill style={{clipPath: `inset(0 ${clipRight.toFixed(2)}% 0 0)`}}>
                        <Img src={imageB} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        <div
                          style={{
                            ...chip,
                            left: '4%',
                            color: VAL.onAccent,
                            background: accent,
                            border: `1px solid ${rgba(accent, 0.6)}`,
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
                          boxShadow: `0 0 18px ${rgba(accent, divGlow)}`,
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
                          background: rgba(VAL.card, 0.92),
                          backdropFilter: 'blur(4px)',
                          boxShadow: `0 0 20px ${rgba(accent, divGlow)}`,
                          transform: 'translate(-50%, -50%)',
                          opacity: divOp,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width={22} height={22} viewBox="0 0 24 24">
                          <polyline
                            points="14,5 8,12 14,19"
                            fill="none"
                            stroke={accent}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="10,5 16,12 10,19"
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
                          boxShadow: `inset 0 0 60px ${rgba(VAL.ink, 0.12)}`,
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
                      size={Math.round(Math.min(width * 0.032, height * 0.054))}
                      uppercase={false}
                    />
                  </div>
                </LiveDrift>
              </ParallaxLayer>
            </>
          )}
        </Stage>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 08 · VAL_LOWERTHIRD — lower-third sobre avatar (video persistente)
 * ########################################################################## */

export type ValLowerThirdProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  name?: string;
  role?: string;
  topic?: string;
  accent?: string;
  avatarSrc?: string | null;
};

export const ValLowerThird: React.FC<ValLowerThirdProps> = ({
  variant,
  totalF,
  name = 'Dra. Valeria Alcázar',
  role = 'Medicina estética',
  topic = 'Romero · Ep. 01',
  accent = DEFAULT_ACCENT,
  avatarSrc = staticFile('med/avatar.mp4'),
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const push = interpolate(frame, [0, VAL_SCENE_F], [1, 1.05], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;

  const dust = React.useMemo(() => makeMotes(7, 'val-lt-dust', 2, 5, 0.008, 0.02, 0.05, 0.12), []);

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
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        {/* avatarSrc={null} = MODO OVERLAY: el avatar ya está montado abajo por el build
            (un solo OffthreadVideo persistente). Acá NO se pinta fondo ni se monta un
            segundo video, o taparíamos la cara y el audio glitchearía en cada corte. */}
        <AbsoluteFill style={{background: avatarSrc ? VAL.paperDeep : 'transparent', overflow: 'hidden'}}>
          {avatarSrc ? (
            <AbsoluteFill
              style={{
                transform: `translate(${handX}px, ${handY}px) scale(${push})`,
                willChange: 'transform',
              }}
            >
              <OffthreadVideo src={avatarSrc} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <AbsoluteFill
                style={{
                  pointerEvents: 'none',
                  background: `linear-gradient(160deg, ${rgba(accent, 0.06)}, transparent 40%)`,
                }}
              />
            </AbsoluteFill>
          ) : null}

          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} />

          {/* scrim de legibilidad CÁLIDO (crema, no negro) para que la tinta lea */}
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              background: `linear-gradient(to top, ${rgba(VAL.paper, 0.86)} 0%, ${rgba(
                VAL.paper,
                0.34
              )} 20%, transparent 44%)`,
            }}
          />

          {/* chip de tema (arriba-izquierda) — chip de color con tinta crema */}
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
                border: `1px solid ${rgba(VAL.goldDark, 0.5)}`,
                background: accent,
                boxShadow: CARD_SHADOW_SOFT,
                opacity: interpolate(chip, [0, 0.4], [0, 1], CLAMP),
                transform: `translateY(${interpolate(chip, [0, 1], [-12, 0], CLAMP)}px)`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: VAL.onAccent,
                  display: 'inline-block',
                  opacity: 0.7 + 0.3 * Math.sin(frame * 0.12),
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: Math.round(height * 0.016),
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: VAL.onAccent,
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
                boxShadow: `0 0 14px ${rgba(accent, 0.5)}`,
                height: `${barH}%`,
                alignSelf: 'center',
                minHeight: 8,
              }}
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: Math.round(height * 0.044),
                  letterSpacing: '0em',
                  color: VAL.ink,
                  textShadow: `0 1px 2px ${rgba(VAL.paper, 0.7)}`,
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
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: VAL.goldDark,
                  whiteSpace: 'nowrap',
                }}
              >
                {role}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 09 · VAL_CHECKLIST — lista con checks que se dibujan
 * ########################################################################## */

export type ValChecklistProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  items?: string[];
  accent?: string;
  mood?: ValMood;
};

export const ValChecklist: React.FC<ValChecklistProps> = ({
  variant,
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
  const check = VAL.sage;

  return (
    <AbsoluteFill>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-check" panDir={1} sprigs>
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
                      size={Math.round(Math.min(width * 0.036, height * 0.064))}
                      uppercase={false}
                    />
                  </div>
                </LiveDrift>
              </ParallaxLayer>
              <ParallaxLayer factor={0.8} z={7} px={cam.px} py={cam.py}>
                <LiveDrift style={{left: '44%', top: '50%', width: '48%'}} centerY origin="0% 50%" zoom={0.012}>
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
                              fill={rgba(check, 0.16)}
                              fillOpacity={fillO}
                              stroke={check}
                              strokeWidth={2.2}
                              strokeDasharray={CIRC}
                              strokeDashoffset={CIRC * (1 - circleP)}
                              strokeLinecap="round"
                              transform="rotate(-90 17 17)"
                            />
                            <path
                              d="M10.5 17.5 L15 22 L24 12"
                              fill="none"
                              stroke={check}
                              strokeWidth={2.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray={CHECK_LEN}
                              strokeDashoffset={CHECK_LEN * (1 - checkP)}
                            />
                          </svg>
                          <div
                            style={{
                              fontFamily: FONT_SERIF,
                              fontWeight: 500,
                              fontSize: Math.round(height * 0.03),
                              color: VAL.ink,
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
                              background: rgba(VAL.ink, 0.12),
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
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * ESCENA 10 · VAL_CTA — cierre con botón
 * ########################################################################## */

export type ValCtaProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  buttonLabel?: string;
  image?: string;
  accent?: string;
  mood?: ValMood;
};

export const ValCta: React.FC<ValCtaProps> = ({
  variant,
  totalF,
  kicker = 'Empiece hoy',
  title = 'Su piel se lo va a agradecer',
  hot = ['agradecer'],
  sub = 'La receta completa, paso a paso, en la descripción.',
  buttonLabel = 'Suscríbase al canal',
  image = VAL_ASSETS.romero,
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
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <Stage mood={mood} accent={accent} seed="val-cta" kickF={btnStart + 8} sprigs panDir={-1}>
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
                  floatSeed="val-cta"
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
                      size={Math.round(Math.min(width * 0.048, height * 0.08))}
                      uppercase={false}
                    />
                  </div>
                  {sub ? (
                    <div style={{marginTop: height * 0.022}}>
                      <SubLine text={sub} accent={accent} startSec={1.5} size={Math.round(height * 0.028)} withBar />
                    </div>
                  ) : null}
                  {/* botón latón */}
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
                        background: `linear-gradient(135deg, ${VAL.goldLite}, ${shade(accent, -0.22)})`,
                        overflow: 'hidden',
                        boxShadow: `0 12px ${34 + pulse * 12}px ${rgba(
                          accent,
                          0.28 + pulse * 0.14
                        )}, 0 2px 8px ${rgba(VAL.ink, 0.2)}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: Math.round(height * 0.023),
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: VAL.onAccent,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {buttonLabel}
                      </span>
                      <svg width={20} height={20} viewBox="0 0 20 20">
                        <path
                          d="M3 10 H15 M11 4.5 L16.5 10 L11 15.5"
                          fill="none"
                          stroke={VAL.onAccent}
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
                          background: `linear-gradient(100deg, transparent 25%, ${rgba(
                            VAL.onAccent,
                            0.55
                          )} 50%, transparent 75%)`,
                          mixBlendMode: 'soft-light',
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
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * VAL_FULLSHOT — visual a PANTALLA COMPLETA (foto o clip) con Ken-Burns
 * ########################################################################## */

export type ValFullShotProps = {
  variant?: ValTransitionVariant;
  totalF?: number;
  src?: string;
  video?: boolean;
  caption?: string;
  kicker?: string;
  accent?: string;
  mood?: ValMood;
  ken?: 'in' | 'out' | 'left' | 'right';
  startFrom?: number;
};

export const ValFullShot: React.FC<ValFullShotProps> = ({
  variant,
  totalF,
  src = VAL_ASSETS.aceite,
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
  const dur = totalF ?? VAL_SCENE_F;

  const p = interpolate(frame, [0, dur], [0, 1], CLAMP);
  const zoom = ken === 'out' ? 1.14 - 0.1 * p : 1.04 + 0.1 * p;
  const tx = ken === 'left' ? -width * 0.022 * p : ken === 'right' ? width * 0.022 * p : 0;
  const ty = ken === 'in' || ken === 'out' ? -height * 0.012 * p : 0;
  const hx = Math.sin(frame * 0.041) * width * 0.0012;
  const hy = Math.cos(frame * 0.034) * height * 0.0011;

  const dust = React.useMemo(() => makeMotes(9, 'val-fullshot-dust', 2, 6, 0.01, 0.026, 0.05, 0.13), []);

  const capIn = spring({
    frame: frame - Math.round(0.35 * fps),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  return (
    <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        <AbsoluteFill
          style={{
            transform: `translate(${(tx + hx).toFixed(1)}px, ${(ty + hy).toFixed(1)}px) scale(${zoom.toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {video ? (
            <OffthreadVideo src={src} startFrom={startFrom} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          )}
        </AbsoluteFill>

        {/* grade cálido por mood + viñeta suave (nunca a negro) */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              `linear-gradient(160deg, ${rgba(accent, 0.14)}, transparent 46%)`,
              `radial-gradient(118% 96% at 50% 45%, transparent 54%, ${rgba(VAL.ink, 0.34)} 100%)`,
              `linear-gradient(to bottom, ${rgba(VAL.paper, 0.16)}, transparent 20%, transparent 68%, ${rgba(
                VAL.ink,
                0.42
              )})`,
            ].join(', '),
          }}
        />
        <MotesLayer motes={dust} blur={1.3} scale={height / 1080} />

        {kicker && (
          <div
            style={{
              position: 'absolute',
              top: height * 0.1,
              left: width * 0.07,
              fontFamily: FONT_SANS,
              fontSize: 16,
              letterSpacing: 7,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: VAL.onAccent,
              textShadow: `0 2px 12px ${rgba(VAL.ink, 0.7)}`,
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
                boxShadow: `0 0 12px ${rgba(accent, 0.5)}`,
              }}
            />
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: -0.4,
                color: VAL.onAccent,
                lineHeight: 1.14,
                textShadow: `0 4px 22px ${rgba(VAL.ink, 0.8)}`,
                maxWidth: '70%',
              }}
            >
              {caption}
            </div>
          </div>
        )}
      </TransitionShell>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * VAL_OILCAROUSEL — carrusel 3D de tarjetas 3:4 flotantes (listas enumeradas)
 *   THE HERO COMPONENT para "25 secretos": anillo cilíndrico que gira y ATERRIZA
 *   sobre la tarjeta nombrada (focus). Tarjetas = fichas de receta/cosmética
 *   vintage sobre crema. Se conserva push-in + micro-handheld + easing cúbico.
 * ########################################################################## */

export type ValCarouselCard = {
  image: string;
  index: string;
  name: string;
  tag?: string;
};

export type ValOilCarouselProps = {
  cards: ValCarouselCard[];
  focus?: number;
  kicker?: string;
  bg?: string;
  accent?: string;
  intro?: boolean;
  spinSec?: number;
  landF?: number;
};

const CARD_W = 430;
const CARD_H = 573; // 3:4 exacto
const RING_R = 545;

const CarouselCard: React.FC<{
  card: ValCarouselCard;
  i: number;
  localAngle: number;
  worldAngle: number;
  accent: string;
  focused: boolean;
  anyFocus: boolean;
  p: number;
  intro: boolean;
}> = ({card, i, localAngle, worldAngle, accent, focused, anyFocus, p, intro}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rad = (worldAngle * Math.PI) / 180;
  const front = Math.cos(rad);
  const front01 = (front + 1) / 2;

  const s = intro ? spring({frame: frame - i * 4, fps, config: {damping: 15, mass: 0.7}}) : 1;

  const bobY = Math.sin(frame * 0.031 + i * 1.7) * 9;
  const bobR = Math.sin(frame * 0.024 + i * 2.3) * 1.6;

  const bill = focused ? 0.25 + 0.75 * p : 0.28;

  const depthScale = 0.8 + 0.2 * front01;
  const scale = depthScale * (focused ? 1 + 0.14 * p : anyFocus ? 1 - 0.08 * p : 1) * s;

  // ⚠ FARM: blur por-frame en 7 tarjetas es carísimo en Chrome headless (CPU sin GPU) → timeout de
  // chunk. Capamos a ≤5px: el look defocus se mantiene, el costo baja ~10×. (medido: chunks 41-50
  // fallaban justo sobre el carrusel; con esto rinden.)
  const blurRaw = focused
    ? 18 * (1 - p)
    : anyFocus
    ? 3 + 4 * (1 - front01) + 6 * p
    : 1.4 + 5.2 * (1 - front01);
  const blur = Math.min(5, blurRaw);

  const bright = focused ? 0.82 + 0.28 * p : anyFocus ? 1 - 0.2 * p : 0.86 + 0.14 * front01;
  const sat = focused ? 0.85 + 0.25 * p : anyFocus ? 1 - 0.24 * p : 0.9;

  const backFade = interpolate(front, [-1, -0.25], [0.24, 1], CLAMP);
  const opacity = s * backFade * (anyFocus && !focused ? 1 - 0.22 * p : 1);

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
            ? `0 42px 84px ${rgba(VAL.ink, 0.4)}, 0 0 0 2px ${rgba(accent, 0.4 + 0.4 * p)}, 0 0 ${(
                40 * p
              ).toFixed(0)}px ${rgba(accent, 0.3 * p)}`
            : `0 26px 56px ${rgba(VAL.ink, 0.3)}, 0 0 0 1px ${VAL.cardEdge}`,
          background: VAL.card,
        }}
      >
        <Img src={card.image} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        {/* grade interno: base cálida abajo + luz arriba-izq */}
        <AbsoluteFill
          style={{
            background: [
              `linear-gradient(to bottom, ${rgba(VAL.ink, 0)} 44%, ${rgba(VAL.ink, 0.62)} 100%)`,
              `linear-gradient(142deg, ${rgba(VAL.onAccent, 0.16)} 0%, transparent 44%)`,
            ].join(', '),
            pointerEvents: 'none',
          }}
        />
        {/* doble filete de ficha vintage */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: 10,
            border: `1px solid ${rgba(VAL.onAccent, 0.34)}`,
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
            background: `linear-gradient(100deg, transparent 18%, ${rgba(VAL.onAccent, 0.22)} 50%, transparent 82%)`,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
        {sweep > 0.01 && (
          <div
            style={{
              position: 'absolute',
              top: '-24%',
              bottom: '-24%',
              left: 0,
              width: '46%',
              transform: `translateX(${sweepX}%) skewX(-16deg)`,
              background: `linear-gradient(100deg, transparent 20%, ${rgba(accent, 0.5)} 50%, transparent 80%)`,
              mixBlendMode: 'soft-light',
              opacity: sweep,
              pointerEvents: 'none',
            }}
          />
        )}
        {/* nombre al pie de cada tarjeta (sobre el grade oscuro) */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 44,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 1.05,
            color: VAL.onAccent,
            textShadow: `0 2px 12px ${rgba(VAL.ink, 0.75)}`,
            opacity: focused ? 1 : 0.9,
          }}
        >
          {card.name}
        </div>
      </div>
      {/* número al pie de cada tarjeta */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 14,
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontSize: 15,
          letterSpacing: 4,
          fontWeight: 700,
          color: focused ? accent : rgba(VAL.onAccent, 0.7),
          textShadow: `0 2px 8px ${rgba(VAL.ink, 0.8)}`,
          filter: focused ? 'none' : `blur(${(blur * 0.5).toFixed(1)}px)`,
          opacity,
        }}
      >
        {card.index}
      </div>
    </div>
  );
};

export const ValOilCarousel: React.FC<ValOilCarouselProps> = ({
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
  const {width, height} = useVideoConfig();

  const n = Math.max(1, cards.length);
  const step = 360 / n;
  const anyFocus = focus >= 0 && focus < n;

  const degPerFrame = 360 / (spinSec * 30);
  const rotFree = -frame * degPerFrame;

  const p = anyFocus
    ? interpolate(frame, [0, landF], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)})
    : 0;

  const target = -focus * step - 360;
  const rot = anyFocus
    ? interpolate(p, [0, 1], [0, target], CLAMP) + Math.sin(frame * 0.021) * 1.4
    : rotFree;

  const push = interpolate(frame, [0, 240], [1, 1.055], CLAMP);
  const hx = Math.sin(frame * 0.019) * width * 0.0018;
  const hy = Math.cos(frame * 0.026) * height * 0.0015;

  const farMotes = React.useMemo(() => makeMotes(16, 'val-oilcar-far', 3, 9, 0.05, 0.1, 0.1, 0.26), []);
  const nearBokeh = React.useMemo(() => makeMotes(5, 'val-oilcar-bok', 110, 240, 0.01, 0.026, 0.04, 0.1), []);

  const focusedCard = anyFocus ? cards[focus] : null;
  const plate = anyFocus ? interpolate(p, [0.42, 0.92], [0, 1], CLAMP) : 0;

  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      {/* L0 · fondo fotográfico desenfocado con deriva */}
      {bg ? (
        <AbsoluteFill
          style={{
            transform: `scale(${(1.24 * push).toFixed(4)}) translate(${(hx * 2).toFixed(1)}px, ${(hy * 2).toFixed(1)}px)`,
            filter: 'blur(24px) saturate(0.9) brightness(1.02)',
          }}
        >
          <Img src={bg} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{background: moodBg('gold')}} />
      )}

      {/* L1 · wash + viñeta cálida */}
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(90% 80% at 50% 40%, ${rgba(accent, 0.12)} 0%, transparent 62%)`,
            `radial-gradient(120% 100% at 50% 46%, transparent 46%, ${rgba(VAL.paperEdge, 0.7)} 100%)`,
            `linear-gradient(to bottom, ${rgba(VAL.paper, 0.4)}, transparent 26%, transparent 68%, ${rgba(
              VAL.paperEdge,
              0.6
            )})`,
          ].join(', '),
        }}
      />

      {/* L2 · bokeh de fondo (blur bajado 14→6 por costo de render en el farm) */}
      <MotesLayer motes={nearBokeh} blur={6} scale={height / 1080} />

      {/* L3 · polvo */}
      <MotesLayer motes={farMotes} blur={1.4} scale={height / 1080} />

      {/* L5 · halo detrás de la tarjeta enfocada */}
      {anyFocus && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(38% 46% at 50% 48%, ${rgba(accent, 0.28 * p)} 0%, transparent 70%)`,
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

      {/* L6 · bokeh de primer plano fuera de foco (blur 16→7 por costo de render en el farm) */}
      <AbsoluteFill style={{filter: 'blur(7px)', opacity: 0.5, pointerEvents: 'none'}}>
        <MotesLayer motes={nearBokeh} blur={0} scale={height / 1080} />
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
            clipPath: `inset(0 ${((1 - plate) * 50).toFixed(1)}% 0 ${((1 - plate) * 50).toFixed(1)}%)`,
            opacity: plate,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '18px 46px 20px',
              background: VAL.card,
              border: `1px solid ${rgba(accent, 0.4)}`,
              borderRadius: 10,
              boxShadow: CARD_SHADOW,
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15,
                letterSpacing: 6,
                fontWeight: 700,
                color: accent,
                marginBottom: 8,
              }}
            >
              {focusedCard.index}
            </div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: -0.4,
                color: VAL.ink,
                lineHeight: 1.05,
                transform: `translateY(${((1 - plate) * 14).toFixed(1)}px)`,
              }}
            >
              {focusedCard.name}
            </div>
            {focusedCard.tag && (
              <div
                style={{
                  fontFamily: FONT_SERIF_FINE,
                  fontStyle: 'italic',
                  fontSize: 26,
                  color: VAL.ink2,
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
            letterSpacing: 8,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: VAL.goldDark,
            opacity: interpolate(frame, [4, 20], [0, 1], CLAMP),
          }}
        >
          {kicker}
        </div>
      )}

      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ############################################################################
 * VAL_KITREEL — las 10 escenas encadenadas con el contrato (sin cortes duros)
 * ########################################################################## */

export type ValKitReelProps = {
  accent?: string;
  avatarSrc?: string | null;
};

export const ValKitReel: React.FC<ValKitReelProps> = ({
  accent = DEFAULT_ACCENT,
  avatarSrc = staticFile('med/avatar.mp4'),
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const scenes: Array<{id: string; node: React.ReactNode}> = [
    {id: 'Chapter', node: <ValChapter accent={accent} />},
    {id: 'Hero', node: <ValHero accent={accent} />},
    {id: 'Stat', node: <ValStat accent={accent} />},
    {id: 'Quote', node: <ValQuote accent={accent} image={VAL_ASSETS.romero} />},
    {id: 'Molecule', node: <ValMolecule accent={accent} />},
    {id: 'Step', node: <ValStep accent={accent} />},
    {id: 'BeforeAfter', node: <ValBeforeAfter accent={accent} />},
    {id: 'Checklist', node: <ValChecklist accent={accent} />},
    {id: 'LowerThird', node: <ValLowerThird accent={accent} avatarSrc={avatarSrc} />},
    {id: 'CTA', node: <ValCta accent={accent} />},
  ];

  const fadeIn = interpolate(frame, [0, 10], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - 14);
  const fadeOut = interpolate(frame, [foS, durationInFrames - 1], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      {scenes.map((s, i) => (
        <Sequence
          key={s.id}
          from={i * VAL_STEP_F}
          durationInFrames={VAL_SCENE_F}
          premountFor={30}
          name={`${String(i + 1).padStart(2, '0')} · ${s.id}`}
        >
          {s.node}
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          zIndex: 90,
          background: VAL.paper,
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
        id="Val-Chapter"
        component={ValChapter}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Capítulo',
          index: '01',
          title: 'El Romero',
          sub: 'De la cocina al tocador',
          accent: DEFAULT_ACCENT,
          mood: 'gold' as ValMood,
        }}
      />
      <Composition
        id="Val-Hero"
        component={ValHero}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Belleza natural',
          title: 'El secreto ya crece en su cocina',
          hot: ['crece'],
          sub: 'Rosmarinus officinalis · ciencia y tradición',
          image: VAL_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'gold' as ValMood,
          side: 'left' as const,
          framed: true,
        }}
      />
      <Composition
        id="Val-Stat"
        component={ValStat}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Estudio · 12 semanas',
          value: 87,
          suffix: '%',
          prefix: '',
          decimals: 0,
          label: 'notó la piel más firme',
          sub: 'Aplicación tópica, todas las noches.',
          image: VAL_ASSETS.rostro,
          accent: DEFAULT_ACCENT,
          mood: 'science' as ValMood,
        }}
      />
      <Composition
        id="Val-Quote"
        component={ValQuote}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Mi filosofía',
          quote: 'La piel no necesita más química. Necesita menos.',
          author: 'Dra. Valeria Alcázar',
          role: 'Medicina estética',
          image: VAL_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'warmdark' as ValMood,
        }}
      />
      <Composition
        id="Val-Molecule"
        component={ValMolecule}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Activo estrella',
          title: 'Ácido carnósico',
          hot: ['carnósico'],
          sub: 'Uno de los antioxidantes más potentes que existen en la naturaleza.',
          centerLabel: 'Romero',
          image: VAL_ASSETS.romero,
          nodes: [{label: 'Antioxidante'}, {label: 'Antiinflamatorio'}, {label: 'Estimula el colágeno'}],
          accent: DEFAULT_ACCENT,
          mood: 'science' as ValMood,
        }}
      />
      <Composition
        id="Val-Step"
        component={ValStep}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          step: 1,
          total: 3,
          title: 'Infusioná en aceite',
          hot: ['aceite'],
          sub: '20 minutos a fuego mínimo, sin hervir.',
          image: VAL_ASSETS.aceite,
          accent: DEFAULT_ACCENT,
          mood: 'warmdark' as ValMood,
        }}
      />
      <Composition
        id="Val-BeforeAfter"
        component={ValBeforeAfter}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Semana 12 · Ritual de romero',
          title: 'Los resultados hablan',
          hot: ['hablan'],
          imageA: VAL_ASSETS.rostro,
          imageB: VAL_ASSETS.rostro,
          labelA: 'Antes',
          labelB: 'Después',
          accent: DEFAULT_ACCENT,
          mood: 'cool' as ValMood,
        }}
      />
      <Composition
        id="Val-LowerThird"
        component={ValLowerThird}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: 'Dra. Valeria Alcázar',
          role: 'Medicina estética',
          topic: 'Romero · Ep. 01',
          accent: DEFAULT_ACCENT,
          avatarSrc: staticFile('med/avatar.mp4'),
        }}
      />
      <Composition
        id="Val-Checklist"
        component={ValChecklist}
        durationInFrames={VAL_SCENE_F}
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
          mood: 'gold' as ValMood,
        }}
      />
      <Composition
        id="Val-CTA"
        component={ValCta}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: 'Empiece hoy',
          title: 'Su piel se lo va a agradecer',
          hot: ['agradecer'],
          sub: 'La receta completa, paso a paso, en la descripción.',
          buttonLabel: 'Suscríbase al canal',
          image: VAL_ASSETS.romero,
          accent: DEFAULT_ACCENT,
          mood: 'gold' as ValMood,
        }}
      />
      <Composition
        id="Val-Carousel"
        component={ValOilCarousel}
        durationInFrames={VAL_SCENE_F}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: '25 secretos de belleza',
          focus: 2,
          accent: DEFAULT_ACCENT,
          intro: true,
          cards: [
            {image: VAL_ASSETS.romero, index: 'N.º 01', name: 'Romero', tag: 'Firmeza'},
            {image: VAL_ASSETS.miel, index: 'N.º 02', name: 'Miel', tag: 'Humectación'},
            {image: VAL_ASSETS.aceite, index: 'N.º 03', name: 'Aceite de oliva', tag: 'Nutrición'},
            {image: VAL_ASSETS.avena, index: 'N.º 04', name: 'Avena', tag: 'Calma'},
            {image: VAL_ASSETS.arcilla, index: 'N.º 05', name: 'Arcilla', tag: 'Purifica'},
            {image: VAL_ASSETS.pepino, index: 'N.º 06', name: 'Pepino', tag: 'Descongestiona'},
          ],
        }}
      />
      <Composition
        id="Val-KitReel"
        component={ValKitReel}
        durationInFrames={VAL_REEL_F}
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
