/**
 * ============================================================================
 * ValeriaFluid — intro belleza vintage-editorial · Doctora Valeria Alcázar
 * ----------------------------------------------------------------------------
 * FORK del FedererFluid re-pieleado a LUZ EDITORIAL CLARA (papel crema / oro).
 * Se conserva el CRAFT: un solo <OffthreadVideo> persistente (audio perfecto),
 * escenas de profundidad encima con TransitionShell (whip + overlap), parallax
 * por capa, rack-focus, push-in de cámara, polvo cálido, drift/zoom de textos.
 *
 * DATA-DRIVEN: editar el array BEATS y todo se reconstruye solo.
 * Comp 1080p30. Importa los componentes de ./ValeriaKit y la piel de ./theme.
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
import {
  VAL,
  FONT_DISPLAY,
  FONT_SERIF_FINE,
  FONT_SANS,
  ValMood,
  CLAMP,
  rgba,
  moodBg,
  PaperGrain,
  WarmVignette,
} from './theme';
import {
  MotesLayer,
  makeMotes,
  Kicker,
  Words,
  VAL_ASSETS,
  RemotionRoot as KitRoot,
} from './ValeriaKit';

/* =============================== TIPOS / DATA ============================ */

export type AssetKey =
  | 'romero'
  | 'miel'
  | 'aceite'
  | 'avena'
  | 'arcilla'
  | 'pepino'
  | 'rostro'
  | 'antes_despues';

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
  mood?: ValMood; // paleta de la escena depth
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
      kicker: 'Dra. Valeria Alcázar · Belleza natural',
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
      hero: 'aceite',
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
      title: 'Lo que la industria no le va a decir',
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
      hero: 'miel',
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
      duo: ['rostro', 'antes_despues'],
      kicker: 'Décadas de ciencia',
      captionA: 'Colágeno',
      captionB: 'Su piel',
      sub: 'y lo que encontró es sorprendente.',
    },
  },
];

const DEFAULT_ASSETS: Record<AssetKey, string> = {
  romero: VAL_ASSETS.romero,
  miel: VAL_ASSETS.miel,
  aceite: VAL_ASSETS.aceite,
  avena: VAL_ASSETS.avena,
  arcilla: VAL_ASSETS.arcilla,
  pepino: VAL_ASSETS.pepino,
  rostro: VAL_ASSETS.rostro,
  antes_despues: VAL_ASSETS.antes_despues,
};

export type ValeriaFluidProps = {
  avatarSrc?: string;
  accent?: string;
  assets?: Partial<Record<AssetKey, string>>;
  beats?: Beat[];
};

/* =============================== UTILIDADES ============================== */

const OVERLAP_SEC = 0.45; // duración del solape de cada transición (whip)

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

  // barrido de luz cálida (entra y sale con el whip)
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
          background: `linear-gradient(100deg, transparent 22%, ${rgba(VAL.onAccent, 0.5)} 50%, transparent 78%)`,
          mixBlendMode: 'soft-light',
          opacity: flashIn * 0.7,
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
          background: `linear-gradient(100deg, transparent 22%, ${rgba(accent, 0.28)} 50%, transparent 78%)`,
          mixBlendMode: 'soft-light',
          opacity: flashOut * 0.5,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ====================== CAPA AVATAR (video persistente) ================== */

const AvatarLayer: React.FC<{src: string; accent: string; cuts: number[]}> = ({src, accent, cuts}) => {
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
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const handY = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  const x = handX - act * width * 0.022;
  const blur = act * 8;
  const scale = push * (1 + act * 0.018);

  const dust = React.useMemo(() => makeMotes(7, 'val-avatar-dust', 2, 5, 0.008, 0.02, 0.05, 0.12), []);

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${handY}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {/* wash cálido apenas visible */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `linear-gradient(160deg, ${rgba(accent, 0.06)}, transparent 40%)`,
          }}
        />
      </AbsoluteFill>
      {/* polvo dorado flotando en la luz del estudio */}
      <MotesLayer motes={dust} blur={1.2} scale={height / 1080} />
      {/* viñeta cálida suave permanente */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <WarmVignette strength={0.2} />
      </AbsoluteFill>
    </>
  );
};

/* ============================ PIEZAS DE TEXTO ============================ */

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
  const stagger = wordsArr.length > 1 ? Math.min(0.26, Math.max(0.09, 2.4 / wordsArr.length)) : 0;
  const subStart = 0.55 + stagger * Math.max(0, wordsArr.length - 1) + 0.4;

  const OUTRO = 0.45;
  const out = interpolate(frame, [beatF - Math.round(OUTRO * fps), beatF - 2], [0, 1], CLAMP);

  // vida permanente: drift + zoom lentísimo
  const driftY = Math.sin(frame * 0.045) * height * 0.0024;
  const driftX = Math.cos(frame * 0.038) * width * 0.0012;
  const slowZoom = interpolate(frame, [0, beatF], [1, 1.02], CLAMP);

  const fontSize = Math.round(Math.min(width * 0.033, height * 0.054));

  const k = spring({
    frame: frame - Math.round(0.26 * fps),
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.8},
  });
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);

  return (
    <>
      {/* scrim de legibilidad CÁLIDO (crema, no negro) — tinta espresso sobre él */}
      <AbsoluteFill
        style={{
          opacity: 0.92 * scrimO,
          pointerEvents: 'none',
          background: `linear-gradient(to top, ${rgba(VAL.paper, 0.82)} 0%, ${rgba(
            VAL.paper,
            0.3
          )} 26%, transparent 52%), radial-gradient(75% 65% at 16% 84%, ${rgba(VAL.paper, 0.5)}, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '7%',
          bottom: '10.5%',
          width: '56%',
          opacity: 1 - out,
          filter: `blur(${out * 9}px)`,
          transform: `translate(${driftX}px, ${driftY + out * 26}px) scale(${slowZoom})`,
          transformOrigin: '0% 100%',
          willChange: 'transform, filter, opacity',
        }}
      >
        {payload.kicker ? <Kicker text={payload.kicker} accent={accent} startSec={0.26} /> : null}
        <div style={{marginTop: height * 0.02}}>
          <Words
            text={payload.title ?? ''}
            hot={payload.hot}
            accent={accent}
            startSec={0.5}
            size={fontSize}
            staggerSec={stagger}
            uppercase={false}
          />
        </div>
        {payload.sub ? (
          <div style={{marginTop: height * 0.02}}>
            <SubLine text={payload.sub} accent={accent} startSec={subStart} size={Math.round(fontSize * 0.5)} withBar />
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
  const {fps, width, height} = useVideoConfig();

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
  const floatX = Math.cos(frame * 0.062 + fs * 1.7) * width * 0.0022;
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
        transform: `translate(-50%, -50%) translate(${floatX}px, ${enterY + floatY}px) rotate(${rotA}deg) scale(${enterScale})`,
        opacity,
        willChange: 'transform, filter, opacity',
      }}
    >
      <div style={{position: 'relative', width: '100%'}}>
        {/* halo cálido detrás */}
        <div
          style={{
            position: 'absolute',
            inset: '-20%',
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, glowPulse)} 0%, ${rgba(
              accent,
              glowPulse * 0.3
            )} 42%, transparent 72%)`,
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
              filter: `blur(${focusBlur}px) ${tone}drop-shadow(0 ${height * 0.026}px ${
                height * 0.05
              }px ${rgba(VAL.ink, 0.28)})`,
            }}
          >
            <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
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
                background: `linear-gradient(100deg, transparent 30%, ${rgba(VAL.onAccent, 0.4)} 50%, transparent 70%)`,
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
              filter: `blur(${focusBlur}px) ${tone}drop-shadow(0 ${height * 0.028}px ${
                height * 0.045
              }px ${rgba(VAL.ink, 0.3)})`,
            }}
          />
        )}
        {brackets && brOp > 0.001 ? (
          <div style={{position: 'absolute', inset: -14, opacity: brOp, transform: `scale(${brScale})`, pointerEvents: 'none'}}>
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
        border: `1px solid ${rgba(accent, 0.45)}`,
        background: rgba(VAL.card, 0.92),
        backdropFilter: 'blur(4px)',
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
          display: 'inline-block',
        }}
      />
      <span
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: Math.round(height * 0.019),
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: VAL.ink,
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

/* ============== DEPTH: rama de laurel/romero (foreground) ================ */

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
        <path key={i} d={l.d} stroke={color} strokeWidth={l.w} strokeLinecap="round" opacity={l.o} fill="none" />
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
  const t0 = enterF / fps;
  const holdSec = holdF / fps;

  if (layout === 'left') {
    return (
      <div style={{position: 'absolute', left: '8%', top: '50%', transform: 'translateY(-50%)', width: '46%'}}>
        {payload.kicker ? <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.25} /> : null}
        <div style={{marginTop: height * 0.022}}>
          <Words
            text={payload.title ?? ''}
            hot={payload.hot}
            accent={accent}
            startSec={t0 + 0.45}
            size={Math.round(Math.min(width * 0.05, height * 0.082))}
            uppercase={false}
          />
        </div>
        {payload.sub ? (
          <div style={{marginTop: height * 0.026}}>
            <SubLine text={payload.sub} accent={accent} startSec={t0 + 1.8} size={Math.round(height * 0.029)} withBar />
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
          size={Math.round(height * 0.036)}
          serif
          italic
          uppercase={false}
          weight={500}
          maxStagger={0.16}
          color={VAL.ink}
        />
      </div>
    );
  }

  if (layout === 'reveal') {
    const letters = (payload.bigTitle ?? '').split('');
    const size = Math.round(Math.min(width * 0.1, height * 0.19));
    const subP = spring({
      frame: frame - Math.round((t0 + 1.9) * fps),
      fps,
      config: {damping: 20, stiffness: 90, mass: 0.9},
    });
    return (
      <div style={{position: 'absolute', left: '55%', top: '50%', transform: 'translateY(-50%)', width: '41%'}}>
        {payload.kicker ? <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.2} /> : null}
        <div
          style={{
            marginTop: height * 0.018,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.01em',
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
            const s = interpolate(w, [0, 1], [1.5, 1], CLAMP) * (1 + Math.max(0, w - 1) * 0.18);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${y}px) scale(${s})`,
                  opacity: o,
                  filter: `blur(${b}px)`,
                  color: VAL.ink,
                  textShadow: `0 1px 1px ${rgba(VAL.paper, 0.6)}, 0 0 40px ${rgba(accent, 0.3)}`,
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
            <div style={{width: interpolate(subP, [0, 1], [0, 34], CLAMP), height: 1, background: rgba(accent, 0.7)}} />
            <div
              style={{
                fontFamily: FONT_SERIF_FINE,
                fontStyle: 'italic',
                fontSize: Math.round(height * 0.03),
                color: VAL.ink2,
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
        {payload.kicker ? <Kicker text={payload.kicker} accent={accent} startSec={t0 + 0.25} /> : null}
      </div>
      {payload.sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: '9%', textAlign: 'center'}}>
          <SubLine text={payload.sub} accent={accent} startSec={duoSubStart} size={Math.round(height * 0.032)} align="center" />
        </div>
      ) : null}
    </>
  );
};

/* =========================== ESCENA DE PROFUNDIDAD ======================= */

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

const sprigColor = (mood: ValMood): string =>
  ({
    cool: rgba(VAL.goldDark, 0.4),
    gold: rgba(VAL.gold, 0.5),
    warmdark: rgba(VAL.terracotta, 0.34),
    science: rgba(VAL.sage, 0.42),
  } as Record<ValMood, string>)[mood];

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
  const mood: ValMood = p.mood ?? 'gold';
  const accent = p.accent ?? globalAccent;
  const total = enterF + holdF + enterF;

  // cámara: push-in + paneo + handheld
  const seedN = random(beat.id + '-cam') * 10;
  const basePush = interpolate(frame, [0, total], [1, 1.05], CLAMP);
  const kickT0 = enterF + Math.round(0.55 * fps);
  const kickP = interpolate(frame, [kickT0, kickT0 + Math.round(0.55 * fps)], [0, 1], CLAMP);
  const kick = p.bigTitle ? Math.sin(kickP * Math.PI) * 0.02 : 0;
  const camScale = basePush * (1 + kick);

  const handX =
    Math.sin(frame * 0.05 + seedN) * width * 0.0016 + Math.sin(frame * 0.014 + seedN * 2) * width * 0.0022;
  const handY = Math.cos(frame * 0.042 + seedN) * height * 0.0018;
  const panX = interpolate(frame, [0, total], [0, width * 0.012], CLAMP);
  const px = handX + panX;
  const py = handY;

  const farMotes = React.useMemo(() => makeMotes(14, beat.id + '-far', 4, 10, 0.05, 0.1, 0.1, 0.26), [beat.id]);
  const midMotes = React.useMemo(() => makeMotes(12, beat.id + '-mid', 2, 5.5, 0.03, 0.075, 0.2, 0.42), [beat.id]);
  const bokeh = React.useMemo(() => makeMotes(4, beat.id + '-bok', 90, 200, 0.008, 0.02, 0.04, 0.09), [beat.id]);

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
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${camScale})`, willChange: 'transform'}}>
        {/* 1 · fondo cálido desenfocado */}
        <ParallaxLayer factor={0.22} z={1} px={px} py={py}>
          <AbsoluteFill style={{filter: 'blur(13px)', transform: 'scale(1.16)'}}>
            <AbsoluteFill style={{background: moodBg(mood)}} />
            <MotesLayer motes={farMotes} blur={0} scale={height / 1080} />
            <AbsoluteFill
              style={{
                background: `radial-gradient(115% 92% at 50% 42%, transparent 46%, ${rgba(VAL.paperEdge, 0.55)} 100%)`,
              }}
            />
          </AbsoluteFill>
        </ParallaxLayer>

        {/* 2 · motas medias */}
        <ParallaxLayer factor={0.4} z={2} px={px} py={py}>
          <MotesLayer motes={midMotes} blur={1.5} scale={height / 1080} />
        </ParallaxLayer>

        {/* 3 · hero / duo */}
        <ParallaxLayer factor={0.62} z={3} px={px} py={py}>
          {heroNode}
        </ParallaxLayer>

        {/* 4 · bokeh gigante delante */}
        <ParallaxLayer factor={1.15} z={4} px={px} py={py}>
          <MotesLayer motes={bokeh} blur={9} scale={height / 1080} />
        </ParallaxLayer>

        {/* 5 · ramas de laurel en foreground */}
        <ParallaxLayer factor={1.32} z={5} px={px} py={py}>
          <ForegroundSprigs seed={beat.id} color={sprigColor(mood)} />
        </ParallaxLayer>

        {/* 6 · viñeta cálida / grade */}
        <AbsoluteFill style={{zIndex: 6, pointerEvents: 'none'}}>
          <WarmVignette strength={0.2} />
        </AbsoluteFill>

        {/* 7 · texto */}
        <ParallaxLayer factor={0.8} z={7} px={px} py={py}>
          <DepthText payload={p} accent={accent} enterF={enterF} holdF={holdF} layout={layout} />
        </ParallaxLayer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================ COMPONENTE PRINCIPAL ======================= */

export const ValeriaFluid: React.FC<ValeriaFluidProps> = ({
  avatarSrc = staticFile('med/avatar.mp4'),
  accent = VAL.gold,
  assets: assetsProp,
  beats = BEATS,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const assets = React.useMemo(() => ({...DEFAULT_ASSETS, ...(assetsProp ?? {})}), [assetsProp]);

  const ovF = Math.max(2, Math.round(OVERLAP_SEC * fps));
  const cuts = React.useMemo(() => beats.slice(1).map((b) => b.startSec), [beats]);

  const fadeIn = interpolate(frame, [0, Math.max(1, Math.round(0.5 * fps))], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - Math.round(0.6 * fps));
  const fadeOut = interpolate(frame, [foS, Math.max(foS + 1, durationInFrames - 1)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
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
                <DepthScene beat={b} assets={assets} globalAccent={accent} enterF={enterF} holdF={holdF} />
              </TransitionShell>
            </Sequence>
          );
        })}

      {/* viñeta global muy suave (unifica) */}
      <AbsoluteFill style={{zIndex: 30, pointerEvents: 'none'}}>
        <WarmVignette strength={0.16} />
      </AbsoluteFill>
      <PaperGrain />
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: VAL.paper,
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default ValeriaFluid;

/* ================================ ROOT =================================== */

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ValeriaFluid"
        component={ValeriaFluid}
        durationInFrames={1146}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          avatarSrc: staticFile('med/avatar.mp4'),
          accent: VAL.gold,
          assets: DEFAULT_ASSETS,
          beats: BEATS,
        }}
      />
      {/* Contact-sheet: una <Composition> por componente (Val-Hero, Val-Stat, …)
          + Val-KitReel (reel de showcase encadenado). Definidas en ./ValeriaKit. */}
      <KitRoot />
    </>
  );
};

registerRoot(RemotionRoot);
