import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ============================================================================
   LayeredDepthScene — doc/finance scene built as stacked depth planes
   PLANES (back → front):
   1. FONDO      gradiente + viñeta + motas lejanas   blur 14   parallax 0.22
   2. MOTAS MID  particulas medias                    blur 1.5  parallax 0.38
   3. HERO       foto nitida (focus-pull de entrada)  blur 0    parallax 0.62
   4. BOKEH      motas gigantes delante de la foto    blur 6    parallax 1.15
   5. SILUETA    foreground procedural (ocluye)       blur 2.2  parallax 1.35
   6. GRADE      viñeta global
   7. TEXTO      titular palabra por palabra (nitido) parallax 0.80
   Uso:
   <Composition
     id="DepthScene"
     component={LayeredDepthScene}
     durationInFrames={240}
     fps={30}
     width={1920}
     height={1080}
     defaultProps={{
       heroSrc: staticFile('house.jpg'),
       title: 'IF YOU BOUGHT THAT HOUSE FOR $50,000',
       subtitle: 'The math nobody showed you',
       accent: '#F2B33D',
       durationInFrames: 240,
     }}
   />
============================================================================ */

export type LayeredDepthSceneProps = {
  heroSrc: string;
  title: string;
  subtitle?: string;
  accent?: string;
  durationInFrames: number;
};

/* ------------------------------- utilidades ------------------------------ */

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const hexToRgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (full.length !== 6) return hex;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8)} & 255}, ${n & 255}, ${alpha})`.replace(
    '} &',
    '} &'
  );
};

// (fix de template: versión segura)
const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.length === 6 ? full : '000000', 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ------------------------------ partículas ------------------------------- */

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
  const RANGE = 118; // % de recorrido vertical (con overscan)
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

/* ------------------------------ CAPA: FONDO ------------------------------ */

const BackgroundLayer: React.FC<{accent: string}> = ({accent}) => {
  const {height} = useVideoConfig();
  const farMotes = React.useMemo(
    () => makeMotes(16, 'far', 4, 11, 0.05, 0.11, 0.15, 0.38),
    []
  );
  return (
    <AbsoluteFill style={{filter: 'blur(14px)', transform: 'scale(1.16)'}}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(90% 70% at 68% 30%, ${rgba(accent, 0.16)} 0%, transparent 55%)`,
            'radial-gradient(120% 90% at 72% 28%, rgba(40, 82, 155, 0.55) 0%, rgba(17, 38, 84, 0.35) 40%, transparent 72%)',
            'radial-gradient(90% 75% at 18% 88%, rgba(22, 54, 116, 0.45) 0%, transparent 62%)',
            'linear-gradient(158deg, #0a1530 0%, #060d20 46%, #03060f 100%)',
          ].join(', '),
        }}
      />
      <MotesLayer motes={farMotes} blur={0} scale={height / 1080} tint="170, 200, 245" />
      {/* viñeta propia del fondo (se desenfoca con él) */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(115% 92% at 50% 42%, transparent 40%, rgba(2, 5, 13, 0.85) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------- CAPA: HERO ------------------------------ */

const HeroLayer: React.FC<{src: string; accent: string}> = ({src, accent}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Entrada con focus-pull (blur 18 → 0) + asentamiento
  const enter = spring({
    frame: frame - Math.round(0.35 * fps),
    fps,
    config: {damping: 24, stiffness: 65, mass: 1},
  });
  const over = Math.max(0, enter - 1);
  const focusBlur = Math.max(0, interpolate(enter, [0, 1], [18, 0], CLAMP));
  const enterScale = interpolate(enter, [0, 1], [1.13, 1], CLAMP) * (1 + over * 0.12);
  const enterY = interpolate(enter, [0, 1], [54, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);

  // Vida propia: flotado vertical + micro rotación
  const floatY = Math.sin(frame * 0.085 + 0.6) * height * 0.007;
  const rot = -1.6 + Math.sin(frame * 0.06) * 0.5;

  // Glow pulsante detrás de la foto
  const glowPulse = 0.3 + 0.08 * Math.sin(frame * 0.07);

  // Brackets tipo viewfinder (aparecen cuando el foco asienta)
  const br = spring({
    frame: frame - Math.round(1.05 * fps),
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.7},
  });
  const brOp = interpolate(br, [0, 1], [0, 0.9], CLAMP);
  const brScale = interpolate(br, [0, 1], [1.5, 1], CLAMP) * (1 + Math.max(0, br - 1) * 0.2);

  // Barrido de luz (sheen) una sola pasada
  const sheenStart = Math.round(1.45 * fps);
  const sheenP = interpolate(frame, [sheenStart, sheenStart + Math.round(0.8 * fps)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const sheenX = interpolate(sheenP, [0, 1], [-120, 220], CLAMP);
  const sheenOp = interpolate(sheenP, [0, 0.15, 0.85, 1], [0, 1, 1, 0], CLAMP);

  const heroW = Math.min(width * 0.5, height * 0.72);
  const bracket = 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: '46%',
        top: '46%',
        zIndex: 3,
        transform: `translate(-50%, -50%) translateY(${enterY + floatY}px) rotate(${rot}deg) scale(${enterScale})`,
        opacity,
        width: heroW,
        willChange: 'transform, filter, opacity',
      }}
    >
      <div style={{position: 'relative', width: '100%'}}>
        {/* glow detrás */}
        <div
          style={{
            position: 'absolute',
            inset: '-22%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
              accent,
              glowPulse
            )} 0%, ${rgba(accent, glowPulse * 0.35)} 42%, transparent 72%)`,
            filter: 'blur(30px)',
            zIndex: -1,
          }}
        />
        {/* tarjeta / foto */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3 / 2',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.14)',
            background: '#0a1226',
            filter: `blur(${focusBlur}px) drop-shadow(0 ${height * 0.03}px ${
              height * 0.05
            }px rgba(1, 4, 12, 0.6))`,
          }}
        >
          {src ? (
            <Img
              src={src}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${rgba(accent, 0.35)}, #12234a 55%, #070f22)`,
              }}
            />
          )}
          {/* luz superior + viñeta interna */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.09), transparent 28%)',
              boxShadow: 'inset 0 0 70px rgba(2, 6, 16, 0.4)',
            }}
          />
          {/* sheen */}
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
        {/* brackets */}
        <div
          style={{
            position: 'absolute',
            inset: -16,
            opacity: brOp,
            transform: `scale(${brScale})`,
            pointerEvents: 'none',
          }}
        >
          {([
            {top: 0, left: 0, borderTop: `${bracket}px solid ${accent}`, borderLeft: `${bracket}px solid ${accent}`, borderTopLeftRadius: 6},
            {top: 0, right: 0, borderTop: `${bracket}px solid ${accent}`, borderRight: `${bracket}px solid ${accent}`, borderTopRightRadius: 6},
            {bottom: 0, left: 0, borderBottom: `${bracket}px solid ${accent}`, borderLeft: `${bracket}px solid ${accent}`, borderBottomLeftRadius: 6},
            {bottom: 0, right: 0, borderBottom: `${bracket}px solid ${accent}`, borderRight: `${bracket}px solid ${accent}`, borderBottomRightRadius: 6},
          ] as React.CSSProperties[]).map((s, i) => (
            <div key={i} style={{position: 'absolute', width: 28, height: 28, ...s}} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- CAPA: SILUETA (SVG) ------------------------ */

const BODY_PATH =
  'M 216 342 ' +
  'C 192 306 178 254 180 198 ' +
  'C 182 140 208 96 256 88 ' +
  'C 300 81 332 106 338 148 ' +
  'C 341 164 346 176 354 188 ' +
  'C 364 200 369 210 364 221 ' +
  'C 361 229 351 233 345 235 ' +
  'C 352 242 353 249 346 255 ' +
  'C 342 261 344 267 338 273 ' +
  'C 334 284 324 290 312 291 ' +
  'C 297 294 287 307 284 323 ' +
  'C 282 333 282 342 284 350 ' +
  'C 308 362 348 377 390 396 ' +
  'C 436 416 464 452 472 496 ' +
  'C 478 534 474 566 460 594 ' +
  'C 494 612 510 646 504 686 ' +
  'C 498 726 472 750 438 760 ' +
  'C 452 806 462 866 464 930 ' +
  'L 466 1080 L -80 1080 L -80 430 ' +
  'C 10 406 118 380 190 356 ' +
  'C 202 351 211 347 216 342 Z';

const RIM_PATH =
  'M 338 148 C 341 164 346 176 354 188 C 364 200 369 210 364 221 ' +
  'C 361 229 351 233 345 235 C 352 242 353 249 346 255 ' +
  'C 342 261 344 267 338 273 C 334 284 324 290 312 291';

const ARM_PATH =
  'M 100 748 C 160 706 268 660 378 626 C 428 612 458 618 462 640 ' +
  'C 466 664 446 682 406 692 C 306 720 210 758 148 798 ' +
  'C 114 820 90 802 92 774 C 93 763 95 755 100 748 Z';

const FIST_PATH =
  'M 428 616 C 456 606 482 618 484 642 C 486 666 468 684 442 682 ' +
  'C 418 680 408 660 414 638 C 417 627 421 620 428 616 Z';

const Silhouette: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const fgIn = spring({
    frame: frame - Math.round(0.55 * fps),
    fps,
    config: {damping: 23, stiffness: 58, mass: 1.15},
  });
  const xIn = interpolate(fgIn, [0, 1], [-width * 0.3, 0], CLAMP);
  const focusBlur = Math.max(0, interpolate(fgIn, [0, 1], [9, 2.2], CLAMP));

  // micro-movimiento: sway + respiración
  const sway = Math.sin(frame * 0.055 + 1.3) * width * 0.0028;
  const breathe = 1 + Math.sin(frame * 0.045) * 0.004;
  const rotS = Math.sin(frame * 0.05 + 0.4) * 0.35;

  const silH = Math.min(height * 1.06, (width * 0.6) / 0.6667);

  return (
    <div
      style={{
        position: 'absolute',
        left: -width * 0.02,
        bottom: '-3%',
        height: silH,
        zIndex: 5,
        transform: `translate(${xIn + sway}px, 0px) rotate(${rotS}deg) scale(${breathe})`,
        transformOrigin: '50% 100%',
        filter: `blur(${focusBlur}px) drop-shadow(${width * 0.012}px 6px ${
          width * 0.02
        }px rgba(2, 6, 16, 0.6))`,
        willChange: 'transform, filter',
      }}
    >
      <svg viewBox="0 0 720 1080" style={{height: '100%', display: 'block'}}>
        <defs>
          <linearGradient id="silBody" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#1c3a6b" />
            <stop offset="0.5" stopColor="#0d1c3a" />
            <stop offset="1" stopColor="#060c1c" />
          </linearGradient>
          <linearGradient id="silArm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2c5288" />
            <stop offset="1" stopColor="#13264a" />
          </linearGradient>
        </defs>

        {/* torso + cabeza (perfil mirando a la derecha) */}
        <path d={BODY_PATH} fill="url(#silBody)" />
        {/* antebrazo cruzado + puño (plano propio, tono más claro) */}
        <path d={ARM_PATH} fill="url(#silArm)" opacity={0.95} />
        <path d={FIST_PATH} fill="url(#silArm)" opacity={0.95} />
        {/* solapas del traje */}
        <path
          d="M 296 360 C 326 402 352 446 372 496"
          fill="none"
          stroke="rgba(160, 195, 240, 0.22)"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M 314 352 C 346 396 374 440 396 490"
          fill="none"
          stroke="rgba(160, 195, 240, 0.16)"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* pañuelo de bolsillo (acento) */}
        <path d="M 428 494 L 458 499 L 443 518 Z" fill={accent} opacity={0.55} />
        {/* rim light en el perfil de la cara */}
        <path
          d={RIM_PATH}
          fill="none"
          stroke="rgba(150, 200, 255, 0.5)"
          strokeWidth={4}
          strokeLinecap="round"
          style={{filter: 'blur(1.5px)'}}
        />
      </svg>
    </div>
  );
};

/* ------------------------------- CAPA: TEXTO ----------------------------- */

const WORD_START = 1.15; // segundos — mover para sincronizar con la VO
const WORD_STAGGER = 0.3; // segundos base por palabra (se adapta a la duración)

const TitleLayer: React.FC<{
  title: string;
  subtitle?: string;
  accent: string;
  durationInFrames: number;
}> = ({title, subtitle, accent, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const words = React.useMemo(() => title.trim().split(/\s+/).filter(Boolean), [title]);

  // stagger adaptativo: garantiza que todas las palabras entren antes del final
  const tailReserve = 1.3;
  const windowSec = Math.max(0.6, durationInFrames / fps - WORD_START - tailReserve);
  const stagger =
    words.length > 1
      ? Math.min(WORD_STAGGER + 0.02, Math.max(0.13, windowSec / (words.length - 1)))
      : 0;
  const subStart = WORD_START + stagger * (words.length - 1) + 0.45;

  const fontSize = Math.round(Math.min(width * 0.055, height * 0.082));

  // regla de acento sobre el titular
  const rb = spring({
    frame: frame - Math.round((WORD_START - 0.15) * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.8},
  });
  const ruleW = interpolate(rb, [0, 1], [0, Math.min(width * 0.1, 150)], CLAMP);

  const subP = spring({
    frame: frame - Math.round(subStart * fps),
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.9},
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '8.5%',
        top: '43%',
        width: '60%',
        zIndex: 7,
      }}
    >
      <div
        style={{
          width: ruleW,
          height: 5,
          borderRadius: 3,
          background: accent,
          boxShadow: `0 0 18px ${rgba(accent, 0.6)}`,
          marginBottom: fontSize * 0.3,
          opacity: interpolate(rb, [0, 0.4], [0, 0.95], CLAMP),
        }}
      />
      <div
        style={{
          fontFamily: "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 800,
          fontSize,
          lineHeight: 1.05,
          letterSpacing: '-0.015em',
          textTransform: 'uppercase',
          color: '#f4f7ff',
        }}
      >
        {words.map((word, i) => {
          const startI = Math.round((WORD_START + i * stagger) * fps);
          const w = spring({
            frame: frame - startI,
            fps,
            config: {damping: 13, stiffness: 170, mass: 0.7},
          });
          const y = interpolate(w, [0, 1], [30, 0], CLAMP);
          const b = Math.max(0, interpolate(w, [0, 1], [12, 0], CLAMP));
          const o = interpolate(w, [0, 0.35], [0, 1], CLAMP);
          const s =
            interpolate(w, [0, 1], [0.72, 1], CLAMP) * (1 + Math.max(0, w - 1) * 0.25);
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
                color: hot ? accent : '#f4f7ff',
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
      {subtitle ? (
        <div
          style={{
            marginTop: fontSize * 0.38,
            paddingLeft: 16,
            borderLeft: `3px solid ${accent}`,
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 500,
            fontSize: Math.round(fontSize * 0.32),
            lineHeight: 1.35,
            color: 'rgba(214, 228, 255, 0.88)',
            maxWidth: '88%',
            opacity: interpolate(subP, [0, 1], [0, 0.95], CLAMP),
            transform: `translateY(${interpolate(subP, [0, 1], [18, 0], CLAMP)}px)`,
            filter: `blur(${Math.max(0, interpolate(subP, [0, 1], [8, 0], CLAMP))}px)`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------ overlays de post ------------------------- */

const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      mixBlendMode: 'overlay',
      zIndex: 20,
      pointerEvents: 'none',
    }}
  >
    <filter id="docGrain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#docGrain)" />
  </svg>
);

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

/* ------------------------------ ESCENA PRINCIPAL ------------------------- */

export const LayeredDepthScene: React.FC<LayeredDepthSceneProps> = ({
  heroSrc,
  title,
  subtitle,
  accent = '#F2B33D',
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const dur = Math.max(1, durationInFrames);

  // Cámara: push-in + drift a la derecha (la silueta "come" el borde del hero)
  const push = interpolate(frame, [0, dur], [1, 1.05], CLAMP);
  const camX = interpolate(frame, [0, dur], [0, width * 0.016], CLAMP);
  const handX = Math.sin(frame * 0.05) * width * 0.0016 + Math.sin(frame * 0.013 + 1.2) * width * 0.0022;
  const handY = Math.cos(frame * 0.04 + 0.8) * height * 0.0018;
  const px = camX + handX;
  const py = handY;

  // fundidos
  const fadeIn = interpolate(frame, [0, Math.max(1, Math.round(0.4 * fps))], [1, 0], CLAMP);
  const foStart = Math.max(0, dur - Math.round(0.5 * fps));
  const fadeOut = interpolate(frame, [foStart, Math.max(foStart + 1, dur - 2)], [0, 1], CLAMP);

  const midMotes = React.useMemo(
    () => makeMotes(14, 'mid', 2, 5.5, 0.03, 0.08, 0.3, 0.7),
    []
  );
  const frontMotes = React.useMemo(
    () => makeMotes(6, 'front', 16, 34, 0.012, 0.03, 0.08, 0.16),
    []
  );

  return (
    <AbsoluteFill style={{background: '#03060f', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, willChange: 'transform'}}>
        {/* 1 · fondo desenfocado */}
        <ParallaxLayer factor={0.22} z={1} px={px} py={py}>
          <BackgroundLayer accent={accent} />
        </ParallaxLayer>

        {/* 2 · motas medias */}
        <ParallaxLayer factor={0.38} z={2} px={px} py={py}>
          <MotesLayer motes={midMotes} blur={1.5} scale={height / 1080} tint="185, 212, 255" />
        </ParallaxLayer>

        {/* 3 · hero nítido */}
        <ParallaxLayer factor={0.62} z={3} px={px} py={py}>
          <HeroLayer src={heroSrc} accent={accent} />
        </ParallaxLayer>

        {/* 4 · bokeh delante de la foto */}
        <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
          <MotesLayer motes={frontMotes} blur={6} scale={height / 1080} tint="225, 232, 255" />
        </ParallaxLayer>

        {/* 5 · silueta foreground (ocluye) */}
        <ParallaxLayer factor={1.35} z={5} px={px} py={py}>
          <Silhouette accent={accent} />
        </ParallaxLayer>

        {/* 6 · viñeta + grade global (bajo el texto) */}
        <AbsoluteFill
          style={{
            zIndex: 6,
            pointerEvents: 'none',
            background: [
              'radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(1, 3, 9, 0.5) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.35), transparent 18%, transparent 82%, rgba(2,4,10,0.45))',
            ].join(', '),
          }}
        />

        {/* 7 · texto */}
        <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
          <TitleLayer
            title={title}
            subtitle={subtitle}
            accent={accent}
            durationInFrames={dur}
          />
        </ParallaxLayer>
      </AbsoluteFill>

      {/* grano + fundidos (espacio de pantalla) */}
      <GrainOverlay />
      <AbsoluteFill
        style={{
          zIndex: 30,
          background: '#02040a',
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default LayeredDepthScene;
