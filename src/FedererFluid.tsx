/**
 * ============================================================================
 * FedererFluid — intro dermocosmética natural (ROMERO) · Dr. Federer
 * ----------------------------------------------------------------------------
 * EDICIÓN FLUIDA A/B:
 *   (A) AVATAR real full-frame (consultorio) + overlays SUTILES (menos es más)
 *   (B) ESCENAS DE PROFUNDIDAD cinematográficas (foto real flotando, glow,
 *       rack-focus, parallax por capa, ramas de romero procedurales en foreground)
 * Transiciones: whip/blur CON OVERLAP (sin cortes secos) + light-sweep.
 * Nada queda quieto: push-in global del avatar, handheld, polvo flotante,
 * drift/zoom lento de textos, focus-pulls y rack-focus dentro de escena.
 *
 * DATA-DRIVEN: editar el array BEATS (startSec/endSec/kind/payload) y todo
 * se reconstruye solo (entrances, staggers, solapes de transición).
 *
 * Comp 1080p30: durationInFrames 1146 (38.2s).
 * ============================================================================
 */

import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  registerRoot,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* =============================== TIPOS / DATA ============================ */

export type AssetKey =
  | 'romero'
  | 'piel'
  | 'aceite'
  | 'vapor'
  | 'cubito'
  | 'colageno'
  | 'crema'
  | 'antes_despues';

export type BeatMood = 'cool' | 'gold' | 'warmdark' | 'science';

export type BeatPayload = {
  kicker?: string; // sobre-título small caps
  title?: string; // titular (palabra por palabra)
  hot?: string[]; // palabras a resaltar en acento
  sub?: string; // línea serif itálica
  hero?: AssetKey; // foto flotante (escena depth simple)
  duo?: [AssetKey, AssetKey]; // rack-focus A→B (escena depth doble)
  bigTitle?: string; // REVEAL tipo display (ROMERO)
  captionA?: string; // chip bajo la card A (duo)
  captionB?: string; // chip bajo la card B (duo)
  mood?: BeatMood; // paleta de la escena depth
  accent?: string; // override de acento por beat
  framed?: boolean; // false si el PNG es recorte transparente (default true)
};

export type Beat = {
  id: string;
  startSec: number;
  endSec: number;
  kind: 'avatar' | 'depth';
  avatarPos: 'full' | 'hidden';
  payload: BeatPayload;
};

/* ----------------------------------------------------------------------------
 * BEATS — editá tiempos/textos acá. Los cortes de transición salen SOLOS de
 * startSec/endSec (overlap automático entre beats vecinos).
 * ------------------------------------------------------------------------- */
export const BEATS: Beat[] = [
  {
    id: 'pregunta',
    startSec: 0,
    endSec: 8.3,
    kind: 'avatar',
    avatarPos: 'full',
    payload: {
      kicker: 'Dr. Federer · Dermocosmética natural',
      title: '¿Cuántas cremas ha comprado en los últimos 10 años?',
      hot: ['10'],
      sub: 'Buscando esa firmeza que su piel tenía antes.',
    },
  },
  {
    id: 'industria',
    startSec: 8.3,
    endSec: 13.8,
    kind: 'depth',
    avatarPos: 'hidden',
    payload: {
      mood: 'cool',
      accent: '#8FB4E8',
      hero: 'crema',
      kicker: 'La industria',
      title: 'Frascos caros. Promesas enormes.',
      hot: ['enormes'],
      sub: 'Y frente al espejo, la misma decepción.',
    },
  },
  {
    id: 'secreto',
    startSec: 13.8,
    endSec: 21.3,
    kind: 'avatar',
    avatarPos: 'full',
    payload: {
      kicker: 'Hoy quiero contarle algo',
      title: 'Lo que los dermatólogos no le van a decir',
      hot: ['no'],
      sub: 'Porque no se puede patentar.',
    },
  },
  {
    id: 'build',
    startSec: 21.3,
    endSec: 25.2,
    kind: 'avatar',
    avatarPos: 'full',
    payload: {
      kicker: 'Para rejuvenecer su piel',
      title: 'Ya crece en su cocina… o en su jardín',
      hot: ['crece'],
    },
  },
  {
    id: 'teaser',
    startSec: 25.2,
    endSec: 28.5,
    kind: 'depth',
    avatarPos: 'hidden',
    payload: {
      mood: 'warmdark',
      hero: 'vapor',
      sub: 'algo mucho más simple',
    },
  },
  {
    id: 'reveal',
    startSec: 28.5,
    endSec: 32.7,
    kind: 'depth',
    avatarPos: 'hidden',
    payload: {
      mood: 'gold',
      hero: 'romero',
      kicker: 'Se llama',
      bigTitle: 'ROMERO',
      sub: 'Rosmarinus officinalis',
    },
  },
  {
    id: 'ciencia',
    startSec: 32.7,
    endSec: 38.2,
    kind: 'depth',
    avatarPos: 'hidden',
    payload: {
      mood: 'science',
      duo: ['colageno', 'piel'],
      kicker: 'Décadas de ciencia',
      captionA: 'Colágeno',
      captionB: 'Su piel',
      sub: 'y lo que encontró es sorprendente.',
    },
  },
];

const DEFAULT_ASSETS: Record<AssetKey, string> = {
  romero: staticFile('med/romero.png'),
  piel: staticFile('med/piel.png'),
  aceite: staticFile('med/aceite.png'),
  vapor: staticFile('med/vapor.png'),
  cubito: staticFile('med/cubito.png'),
  colageno: staticFile('med/colageno.png'),
  crema: staticFile('med/crema.png'),
  antes_despues: staticFile('med/antes_despues.png'),
};

export type FedererFluidProps = {
  avatarSrc?: string;
  accent?: string;
  assets?: Partial<Record<AssetKey, string>>;
  beats?: Beat[];
};

/* =============================== UTILIDADES ============================== */

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const OVERLAP_SEC = 0.45; // duración del solape de cada transición (whip)

const FONT_SANS = "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

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
    <filter id="ffGrain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#ffGrain)" />
  </svg>
);

/* ===================== TRANSITION SHELL (whip + overlap) ================= */

const TransitionShell: React.FC<{
  enterF: number;
  holdF: number;
  accent: string;
  children: React.ReactNode;
}> = ({enterF, holdF, accent, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  const en = interpolate(frame, [0, enterF], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exS = enterF + holdF;
  const ex = interpolate(frame, [exS, exS + enterF], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });

  const opacity = Math.min(en, 1 - ex);
  const blur = (1 - en) * 18 + ex * 18;
  const x = (1 - en) * width * 0.05 - ex * width * 0.05;
  const scale = 1 + (1 - en) * 0.1 - ex * 0.06;

  // barrido de luz (entra y sale con el whip)
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

/* ====================== CAPA AVATAR (video persistente) ================== */

const AvatarLayer: React.FC<{src: string; accent: string; cuts: number[]}> = ({
  src,
  accent,
  cuts,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  // actividad de corte: bump en cada boundary (blur + latigazo del video)
  let act = 0;
  for (let i = 0; i < cuts.length; i++) {
    const d = Math.abs(t - cuts[i]);
    const b = interpolate(d, [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }

  const push = interpolate(frame, [0, durationInFrames], [1, 1.055], CLAMP);
  const handX =
    Math.sin(frame * 0.05) * width * 0.0012 +
    Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  const x = handX - act * width * 0.022;
  const blur = act * 8;
  const scale = push * (1 + act * 0.018);

  const dust = React.useMemo(
    () => makeMotes(7, 'avatar-dust', 2, 5, 0.008, 0.02, 0.05, 0.13),
    []
  );

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${handY}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo
          src={src}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
        {/* wash cálido apenas visible + sombra inferior */}
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
      {/* polvo flotando en la luz del consultorio */}
      <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="235, 205, 150" />
      {/* viñeta suave permanente */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%, transparent 62%, rgba(2, 5, 12, 0.42) 100%)',
        }}
      />
    </>
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
        lineHeight: 1.1,
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

/* ====================== OVERLAY DE BEATS DE AVATAR ======================= */

const AvatarOverlay: React.FC<{
  payload: BeatPayload;
  accent: string;
  beatF: number;
}> = ({payload, accent, beatF}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const wordsArr = React.useMemo(
    () => (payload.title ?? '').trim().split(/\s+/).filter(Boolean),
    [payload.title]
  );
  const stagger = wordStagger(wordsArr.length);
  const subStart = 0.55 + stagger * Math.max(0, wordsArr.length - 1) + 0.4;

  const OUTRO = 0.45;
  const out = interpolate(frame, [beatF - Math.round(OUTRO * fps), beatF - 2], [0, 1], CLAMP);

  // vida permanente: drift + zoom lentísimo
  const driftY = Math.sin(frame * 0.045) * height * 0.0024;
  const driftX = Math.cos(frame * 0.038) * width * 0.0012;
  const slowZoom = interpolate(frame, [0, beatF], [1, 1.02], CLAMP);

  const fontSize = Math.round(Math.min(width * 0.031, height * 0.052));

  const k = spring({
    frame: frame - Math.round(0.26 * fps),
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.8},
  });
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);

  return (
    <>
      {/* scrim de legibilidad (sin caja, gradiente suave) */}
      <AbsoluteFill
        style={{
          opacity: 0.9 * scrimO,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(3,6,13,0.6) 0%, rgba(3,6,13,0.22) 24%, transparent 50%), radial-gradient(75% 65% at 16% 84%, rgba(3,6,13,0.42), transparent 72%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '7%',
          bottom: '10.5%',
          width: '54%',
          opacity: 1 - out,
          filter: `blur(${out * 9}px)`,
          transform: `translate(${driftX}px, ${driftY + out * 26}px) scale(${slowZoom})`,
          transformOrigin: '0% 100%',
          willChange: 'transform, filter, opacity',
        }}
      >
        {payload.kicker ? (
          <Kicker text={payload.kicker} accent={accent} startSec={0.26} />
        ) : null}
        <div style={{marginTop: height * 0.02}}>
          <Words
            text={payload.title ?? ''}
            hot={payload.hot}
            accent={accent}
            startSec={0.5}
            size={fontSize}
            staggerSec={stagger}
          />
        </div>
        {payload.sub ? (
          <div style={{marginTop: height * 0.02}}>
            <SubLine
              text={payload.sub}
              accent={accent}
              startSec={subStart}
              size={Math.round(fontSize * 0.5)}
              withBar
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

/* ====================== DEPTH: foto flotante (hero) ====================== */

const HeroCard: React.FC<{
  src: string;
  accent: string;
  delayF: number;
  w: number;
  cx: number; // % dentro del layer
  cy: number; // %
  rot: number;
  framed: boolean;
  floatSeed: string;
  cool?: boolean;
  extraBlur?: number; // rack-focus externo
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
  const {fps, width, height} = useVideoConfig();

  const enter = spring({
    frame: frame - delayF,
    fps,
    config: {damping: 24, stiffness: 65, mass: 1},
  });
  const over = Math.max(0, enter - 1);
  const focusBlur = Math.max(0, interpolate(enter, [0, 1], [16, 0], CLAMP)) + extraBlur;
  const enterScale =
    interpolate(enter, [0, 1], [1.12, 1], CLAMP) * (1 + over * 0.1);
  const enterY = interpolate(enter, [0, 1], [48, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);

  const fs = random(floatSeed + '-fs') * Math.PI * 2;
  const floatY = Math.sin(frame * 0.08 + fs) * height * 0.007;
  const floatX = Math.cos(frame * 0.062 + fs * 1.7) * width * 0.0022;
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
        {/* glow detrás */}
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

/* ================== DEPTH: rack-focus A→B (escena ciencia) =============== */

const FocusDuo: React.FC<{
  a: string;
  b: string;
  accent: string;
  enterF: number;
  captionA?: string;
  captionB?: string;
  seed: string;
}> = ({a, b, accent, enterF, captionA, captionB, seed}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const mixStart = enterF + Math.round(2.2 * fps);
  const mix = interpolate(frame, [mixStart, mixStart + Math.round(1.15 * fps)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const wA = Math.min(width * 0.29, height * 0.5);
  const wB = Math.min(width * 0.33, height * 0.56);

  const chipIn = spring({
    frame: frame - (enterF + Math.round(0.8 * fps)),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });
  const chipBase = interpolate(chipIn, [0, 1], [0, 1], CLAMP);

  const Chip: React.FC<{label: string; op: number; top: number}> = ({label, op, top}) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        transform: `translateX(-50%) translateY(${(1 - op) * 12}px)`,
        opacity: op,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 20px',
        borderRadius: 999,
        border: `1px solid ${rgba(accent, 0.35)}`,
        background: 'rgba(4, 8, 16, 0.55)',
        backdropFilter: 'blur(8px)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 12px ${rgba(accent, 0.8)}`,
          display: 'inline-block',
        }}
      />
      <span
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(height * 0.019),
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#eef3ff',
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '29%',
          top: '53%',
          transform: `scale(${1 - mix * 0.04}) translateX(${-mix * width * 0.008}px)`,
          zIndex: mix < 0.5 ? 2 : 1,
        }}
      >
        <HeroCard
          src={a}
          accent={accent}
          delayF={enterF + Math.round(0.15 * fps)}
          w={wA}
          cx={0}
          cy={0}
          rot={-1.6}
          framed
          floatSeed={seed + 'a'}
          extraBlur={mix * 11}
          brackets
          bracketOp={1 - mix}
        />
        {captionA ? <Chip label={captionA} op={(1 - mix) * chipBase} top={wA / 3 + 26} /> : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '67%',
          top: '50%',
          transform: `scale(${0.93 + mix * 0.07}) translateX(${mix * width * 0.006}px)`,
          zIndex: mix < 0.5 ? 1 : 2,
        }}
      >
        <HeroCard
          src={b}
          accent={accent}
          delayF={enterF + Math.round(0.35 * fps)}
          w={wB}
          cx={0}
          cy={0}
          rot={1.8}
          framed
          floatSeed={seed + 'b'}
          extraBlur={(1 - mix) * 11}
          brackets
          bracketOp={mix}
        />
        {captionB ? <Chip label={captionB} op={mix} top={wB / 3 + 26} /> : null}
      </div>
    </>
  );
};

/* ============== DEPTH: ramas de romero procedurales (foreground) ========= */

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

/* ===================== DEPTH: textos según layout ======================== */

const DepthText: React.FC<{
  payload: BeatPayload;
  accent: string;
  enterF: number;
  holdF: number;
  layout: 'left' | 'caption' | 'reveal' | 'duo';
}> = ({payload, accent, enterF, holdF, layout}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t0 = enterF / fps; // instante en que el whip ya asentó
  const holdSec = holdF / fps;

  if (layout === 'left') {
    return (
      <div
        style={{
          position: 'absolute',
          left: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '46%',
        }}
      >
        {payload.kicker ? (
          <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.25} />
        ) : null}
        <div style={{marginTop: height * 0.022}}>
          <Words
            text={payload.title ?? ''}
            hot={payload.hot}
            accent={accent}
            startSec={t0 + 0.45}
            size={Math.round(Math.min(width * 0.048, height * 0.078))}
          />
        </div>
        {payload.sub ? (
          <div style={{marginTop: height * 0.026}}>
            <SubLine
              text={payload.sub}
              accent={accent}
              startSec={t0 + 1.8}
              size={Math.round(height * 0.027)}
              withBar
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === 'caption') {
    return (
      <div style={{position: 'absolute', left: '8%', bottom: '15%'}}>
        <Words
          text={payload.sub ?? ''}
          accent={accent}
          startSec={t0 + 0.7}
          size={Math.round(height * 0.034)}
          serif
          italic
          uppercase={false}
          weight={500}
          maxStagger={0.16}
          color="rgba(226, 232, 246, 0.92)"
        />
      </div>
    );
  }

  if (layout === 'reveal') {
    const letters = (payload.bigTitle ?? '').split('');
    const size = Math.round(Math.min(width * 0.098, height * 0.185));
    const subP = spring({
      frame: frame - Math.round((t0 + 1.9) * fps),
      fps,
      config: {damping: 20, stiffness: 90, mass: 0.9},
    });
    return (
      <div
        style={{
          position: 'absolute',
          left: '55%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '41%',
        }}
      >
        {payload.kicker ? (
          <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.2} />
        ) : null}
        <div
          style={{
            marginTop: height * 0.018,
            fontFamily: FONT_SANS,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {letters.map((L, i) => {
            const st = t0 + 0.5 + i * 0.055;
            const w = spring({
              frame: frame - Math.round(st * fps),
              fps,
              config: {damping: 13, stiffness: 150, mass: 0.75},
            });
            const y = interpolate(w, [0, 1], [34, 0], CLAMP);
            const b = Math.max(0, interpolate(w, [0, 1], [20, 0], CLAMP));
            const o = interpolate(w, [0, 0.3], [0, 1], CLAMP);
            const s =
              interpolate(w, [0, 1], [1.5, 1], CLAMP) * (1 + Math.max(0, w - 1) * 0.18);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${y}px) scale(${s})`,
                  opacity: o,
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
        </div>
        {payload.sub ? (
          <div
            style={{
              marginTop: height * 0.024,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: interpolate(subP, [0, 1], [0, 1], CLAMP),
              transform: `translateY(${interpolate(subP, [0, 1], [14, 0], CLAMP)}px)`,
              filter: `blur(${Math.max(0, interpolate(subP, [0, 1], [8, 0], CLAMP))}px)`,
            }}
          >
            <div
              style={{
                width: interpolate(subP, [0, 1], [0, 34], CLAMP),
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
              {payload.sub}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // layout 'duo' (ciencia)
  const duoSubStart = Math.min(t0 + 3.9, t0 + Math.max(0.6, holdSec - 1.5));
  return (
    <>
      <div style={{position: 'absolute', left: '8%', top: '10%'}}>
        {payload.kicker ? (
          <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.25} />
        ) : null}
      </div>
      {payload.sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: '9%', textAlign: 'center'}}>
          <SubLine
            text={payload.sub}
            accent={accent}
            startSec={duoSubStart}
            size={Math.round(height * 0.03)}
            align="center"
          />
        </div>
      ) : null}
    </>
  );
};

/* =========================== ESCENA DE PROFUNDIDAD ======================= */

const moodBg = (mood: BeatMood, accent: string): string => {
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

const sprigColor = (mood: BeatMood): string =>
  ({cool: '#0a1526', gold: '#0c1106', warmdark: '#100b06', science: '#08131d'} as Record<
    BeatMood,
    string
  >)[mood];

const heroLayout = (
  id: string,
  width: number,
  height: number
): {cx: number; cy: number; w: number; rot: number} => {
  switch (id) {
    case 'industria':
      return {cx: 68, cy: 50, w: Math.min(width * 0.34, height * 0.62), rot: 1.6};
    case 'teaser':
      return {cx: 50, cy: 46, w: Math.min(width * 0.38, height * 0.66), rot: -1.2};
    case 'reveal':
      return {cx: 31, cy: 50, w: Math.min(width * 0.32, height * 0.58), rot: -2};
    default:
      return {cx: 60, cy: 50, w: Math.min(width * 0.34, height * 0.6), rot: 1.4};
  }
};

const DepthScene: React.FC<{
  beat: Beat;
  assets: Record<AssetKey, string>;
  globalAccent: string;
  enterF: number;
  holdF: number;
}> = ({beat, assets, globalAccent, enterF, holdF}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const p = beat.payload;
  const mood: BeatMood = p.mood ?? 'gold';
  const accent = p.accent ?? globalAccent;
  const total = enterF + holdF + enterF;

  // cámara: push-in + paneo + handheld
  const seedN = random(beat.id + '-cam') * 10;
  const basePush = interpolate(frame, [0, total], [1, 1.05], CLAMP);
  // micro "punch" sincronizado con el reveal del bigTitle
  const kickT0 = enterF + Math.round(0.55 * fps);
  const kickP = interpolate(frame, [kickT0, kickT0 + Math.round(0.55 * fps)], [0, 1], CLAMP);
  const kick = p.bigTitle ? Math.sin(kickP * Math.PI) * 0.02 : 0;
  const camScale = basePush * (1 + kick);

  const handX =
    Math.sin(frame * 0.05 + seedN) * width * 0.0016 +
    Math.sin(frame * 0.014 + seedN * 2) * width * 0.0022;
  const handY = Math.cos(frame * 0.042 + seedN) * height * 0.0018;
  const panX = interpolate(frame, [0, total], [0, width * 0.012], CLAMP);
  const px = handX + panX;
  const py = handY;

  const farMotes = React.useMemo(
    () => makeMotes(14, beat.id + '-far', 4, 10, 0.05, 0.1, 0.14, 0.34),
    [beat.id]
  );
  const midMotes = React.useMemo(
    () => makeMotes(12, beat.id + '-mid', 2, 5.5, 0.03, 0.075, 0.28, 0.62),
    [beat.id]
  );
  const bokeh = React.useMemo(
    () => makeMotes(4, beat.id + '-bok', 90, 200, 0.008, 0.02, 0.05, 0.1),
    [beat.id]
  );

  const moteTint = mood === 'gold' || mood === 'warmdark' ? '240, 208, 150' : '190, 214, 250';
  const hl = heroLayout(beat.id, width, height);
  const layout: 'left' | 'caption' | 'reveal' | 'duo' = p.bigTitle
    ? 'reveal'
    : p.duo
    ? 'duo'
    : p.title
    ? 'left'
    : 'caption';

  const heroNode = p.duo ? (
    <FocusDuo
      a={assets[p.duo[0]]}
      b={assets[p.duo[1]]}
      accent={accent}
      enterF={enterF}
      captionA={p.captionA}
      captionB={p.captionB}
      seed={beat.id}
    />
  ) : p.hero ? (
    <HeroCard
      src={assets[p.hero]}
      accent={accent}
      delayF={enterF + Math.round(0.15 * fps)}
      w={hl.w}
      cx={hl.cx}
      cy={hl.cy}
      rot={hl.rot}
      framed={p.framed ?? true}
      floatSeed={beat.id}
      cool={mood === 'cool'}
    />
  ) : null;

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

        {/* 3 · hero / duo */}
        <ParallaxLayer factor={0.62} z={3} px={px} py={py}>
          {heroNode}
        </ParallaxLayer>

        {/* 4 · bokeh gigante delante */}
        <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
          <MotesLayer motes={bokeh} blur={9} scale={height / 1080} tint={moteTint} />
        </ParallaxLayer>

        {/* 5 · ramas de romero en foreground (ocultan) */}
        <ParallaxLayer factor={1.32} z={5} px={px} py={py}>
          <ForegroundSprigs seed={beat.id} color={sprigColor(mood)} />
        </ParallaxLayer>

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

        {/* 7 · texto */}
        <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
          <DepthText payload={p} accent={accent} enterF={enterF} holdF={holdF} layout={layout} />
        </ParallaxLayer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================ COMPONENTE PRINCIPAL ======================= */

export const FedererFluid: React.FC<FedererFluidProps> = ({
  avatarSrc = staticFile('med/avatar.mp4'),
  accent = '#E9B44C',
  assets: assetsProp,
  beats = BEATS,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const assets = React.useMemo(
    () => ({...DEFAULT_ASSETS, ...(assetsProp ?? {})}),
    [assetsProp]
  );

  const ovF = Math.max(2, Math.round(OVERLAP_SEC * fps));
  const cuts = React.useMemo(() => beats.slice(1).map((b) => b.startSec), [beats]);

  const fadeIn = interpolate(frame, [0, Math.max(1, Math.round(0.5 * fps))], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - Math.round(0.6 * fps));
  const fadeOut = interpolate(frame, [foS, Math.max(foS + 1, durationInFrames - 1)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      {/* L0 · avatar persistente (nunca se desmonta → sync perfecto) */}
      <AvatarLayer src={avatarSrc} accent={accent} cuts={cuts} />

      {/* L1 · overlays de los beats de avatar */}
      {beats
        .filter((b) => b.kind === 'avatar')
        .map((b) => {
          const s = Math.round(b.startSec * fps);
          const e = Math.round(b.endSec * fps);
          return (
            <Sequence key={b.id} from={s} durationInFrames={Math.max(1, e - s)} name={`UI · ${b.id}`}>
              <AvatarOverlay payload={b.payload} accent={accent} beatF={e - s} />
            </Sequence>
          );
        })}

      {/* L2 · escenas de profundidad (con whip/overlap vía TransitionShell) */}
      {beats
        .filter((b) => b.kind === 'depth')
        .map((b) => {
          const s = Math.round(b.startSec * fps);
          const e = Math.round(b.endSec * fps);
          const holdF = Math.max(1, e - s);
          const from = Math.max(0, s - ovF);
          const enterF = s - from;
          const dur = holdF + enterF + ovF;
          return (
            <Sequence key={b.id} from={from} durationInFrames={dur} name={`Depth · ${b.id}`}>
              <TransitionShell enterF={enterF} holdF={holdF} accent={b.payload.accent ?? accent}>
                <DepthScene
                  beat={b}
                  assets={assets}
                  globalAccent={accent}
                  enterF={enterF}
                  holdF={holdF}
                />
              </TransitionShell>
            </Sequence>
          );
        })}

      {/* viñeta global muy suave (unifica) */}
      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: 'none',
          background:
            'radial-gradient(125% 105% at 50% 46%, transparent 62%, rgba(1, 3, 8, 0.32) 100%)',
        }}
      />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: '#020409',
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default FedererFluid;

/* ================================ ROOT =================================== */

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FedererFluid"
        component={FedererFluid}
        durationInFrames={1146}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          avatarSrc: staticFile('med/avatar.mp4'),
          accent: '#E9B44C',
          assets: DEFAULT_ASSETS,
          beats: BEATS,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
