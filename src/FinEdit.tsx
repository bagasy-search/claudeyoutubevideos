/**
 * FinEdit — "The 1985 House" — 750f @ 30fps — 1920x1080
 * Cinematic dark-blue finance edit for retirees. Gold numbers, heavy type.
 *
 * BEAT MAP (abs frames):
 *  S1   0–132  DepthScene  HOUSE 1985 — "$50,000" tag, focus-pull al tag
 *  S2 120–250  NumberPunch $50k → $800k (count-up, ring burst)
 *  S3 240–380  DepthScene  CITY — "what no one ever told you", silueta lenta
 *  S4 370–465  DepthScene  MARKET — zoom al detalle del chart
 *  S5 455–555  NumberPunch $50k → $2.3M + polaroid de cash
 *  S6 545–669  SplitCompare HOUSE "comfortable" vs MARKET "rich" (whip-pan)
 *  S7 659–721  DepthScene  RETIREE — "never ran the numbers"
 *  S8 711–750  NumberPunch FINAL "YOU JUST DID."
 * Overlaps de 10–12f en Series => whips cruzados, sin corte seco.
 */

import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  Series,
  interpolate,
  random,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ============================= TOKENS ============================= */

const FONT = "'Arial Black','Helvetica Neue',Arial,sans-serif";
const FONT_LIGHT = "'Helvetica Neue',Arial,sans-serif";
const GOLD = '#F5C04E';
const GOLD_DEEP = '#C8862A';
const GOLD_PALE = '#FFE9A8';
const PAPER = '#F4F7FF';
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg,${GOLD_PALE} 0%,${GOLD} 48%,${GOLD_DEEP} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const pulse1 = (d: number, len: number) =>
  d <= 0 || d >= len ? 0 : Math.sin((d / len) * Math.PI);

const pulses = (frame: number, times: number[] | undefined, len: number) =>
  !times || times.length === 0
    ? 0
    : times.reduce((a, t) => Math.max(a, pulse1(frame - t, len)), 0);

/* ========================= PROPS DEL VIDEO ======================== */

export type FinEditProps = {
  house: string;
  market: string;
  cash: string;
  retiree: string;
  city: string;
};

/* ========================= ATOMS / PARTICLES ====================== */

const Particles: React.FC<{
  count: number;
  color: string;
  seed: string;
  blur?: number;
  speed?: number;
  opacity?: number;
}> = ({count, color, seed, blur = 0, speed = 1, opacity = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}-x${i}`) * 1920;
        const y0 = random(`${seed}-y${i}`) * 1080;
        const r = 1.5 + random(`${seed}-r${i}`) * 3.5;
        const sp = (0.3 + random(`${seed}-s${i}`) * 0.9) * speed;
        const ph = random(`${seed}-p${i}`) * Math.PI * 2;
        const y = (((y0 - frame * sp) % 1080) + 1080) % 1080;
        const o = (0.12 + 0.28 * (0.5 + 0.5 * Math.sin(frame / 19 + ph))) * opacity;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              background: color,
              opacity: o,
              filter: blur ? `blur(${blur}px)` : undefined,
              boxShadow: `0 0 ${r * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Bokeh: React.FC<{seed: string; par: number}> = ({seed, par}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(6).fill(0).map((_, i) => {
        const size = 120 + random(`${seed}-bs${i}`) * 170;
        const x = random(`${seed}-bx${i}`) * 1820;
        const y = random(`${seed}-by${i}`) * 980;
        const gold = random(`${seed}-bg${i}`) > 0.5;
        const dx = Math.sin(frame / 74 + i * 1.7) * 34 * par;
        const dy = Math.cos(frame / 90 + i) * 20 * par;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + dx,
              top: y + dy,
              width: size,
              height: size,
              borderRadius: '50%',
              background: gold
                ? 'radial-gradient(circle, rgba(245,192,78,0.16), rgba(245,192,78,0))'
                : 'radial-gradient(circle, rgba(80,130,230,0.14), rgba(80,130,230,0))',
              filter: 'blur(34px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Silhouette: React.FC<{height: number; color: string}> = ({height, color}) => (
  <svg width={height * 0.95} height={height} viewBox="0 0 200 210">
    <path
      d="M100 10c-25 0-42 19-42 44 0 17 8 31 20 39-36 8-61 38-66 84-2 16 11 29 27 29h122c16 0 29-13 27-29-5-46-30-76-66-84 12-8 20-22 20-39 0-25-17-44-42-44z"
      fill={color}
    />
  </svg>
);

const Grain: React.FC = () => (
  <svg
    width={1920}
    height={1080}
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.055,
      mixBlendMode: 'overlay',
      zIndex: 45,
      pointerEvents: 'none',
    }}
  >
    <filter id="fin-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#fin-grain)" />
  </svg>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(1,3,10,0.62) 100%)',
      zIndex: 40,
      pointerEvents: 'none',
    }}
  />
);

/* ============================ TYPO ATOMS ========================== */

const Word: React.FC<{
  text: string;
  delay: number;
  gold?: boolean;
  fontSize: number;
}> = ({text, delay, gold, fontSize}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 15, stiffness: 170, mass: 0.8},
  });
  const inv = Math.max(0, 1 - Math.min(1, s));
  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: '0.26em',
        fontSize,
        fontWeight: 900,
        fontFamily: FONT,
        letterSpacing: '-0.02em',
        color: gold ? undefined : PAPER,
        ...(gold ? goldText : {}),
        transform: `translateY(${inv * 54}px) rotate(${inv * 5}deg) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.5),
        filter: `blur(${inv * 12}px)`,
        textShadow: gold ? undefined : '0 8px 34px rgba(0,0,0,0.55)',
      }}
    >
      {text}
    </span>
  );
};

const Kicker: React.FC<{text: string; delay: number; center?: boolean}> = ({
  text,
  delay,
  center,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 18, stiffness: 150},
  });
  const inv = Math.max(0, 1 - Math.min(1, s));
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        justifyContent: center ? 'center' : 'flex-start',
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${inv * 22}px)`,
        filter: `blur(${inv * 8}px)`,
      }}
    >
      <div style={{width: 40, height: 3, background: GOLD, borderRadius: 2}} />
      <div
        style={{
          fontFamily: FONT_LIGHT,
          fontWeight: 700,
          fontSize: 25,
          letterSpacing: `${15 - 8 * Math.min(1, s)}px`,
          color: GOLD,
          textTransform: 'uppercase',
        }}
      >
        {text}
      </div>
      {center ? <div style={{width: 40, height: 3, background: GOLD, borderRadius: 2}} /> : null}
    </div>
  );
};

const UnderBar: React.FC<{at: number; center?: boolean}> = ({at, center}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: {damping: 200},
    durationInFrames: 14,
  });
  return (
    <div
      style={{
        width: 260 * s,
        height: 5,
        borderRadius: 3,
        background: `linear-gradient(90deg,${GOLD},${GOLD_DEEP})`,
        boxShadow: '0 0 24px rgba(245,192,78,0.5)',
        alignSelf: center ? 'center' : 'flex-start',
      }}
    />
  );
};

const SubNote: React.FC<{text: string; at: number; center?: boolean}> = ({text, at, center}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: {damping: 13, stiffness: 190},
  });
  const inv = Math.max(0, 1 - Math.min(1, s));
  return (
    <div
      style={{
        ...goldText,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 36,
        letterSpacing: 7,
        alignSelf: center ? 'center' : 'flex-start',
        transform: `translateY(${inv * 26}px) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.5),
        filter: `blur(${inv * 9}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Tag: React.FC<{text: string; at: number; boost: number}> = ({text, at, boost}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: {damping: 11, stiffness: 210, mass: 0.6},
  });
  return (
    <div
      style={{
        position: 'absolute',
        right: 22,
        bottom: -30,
        padding: '16px 30px',
        borderRadius: 16,
        background: `linear-gradient(180deg,${GOLD_PALE},${GOLD} 55%,${GOLD_DEEP})`,
        color: '#1A1206',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 42,
        letterSpacing: '-0.02em',
        transform: `scale(${s * (1 + boost * 0.1)}) rotate(-3deg)`,
        opacity: Math.min(1, s * 2),
        boxShadow:
          '0 18px 50px rgba(0,0,0,0.55), 0 0 60px rgba(245,192,78,0.45)',
        zIndex: 6,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const FocusBrackets: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  amt: number;
}> = ({left, top, width, height, amt}) => {
  const pad = 22;
  const c = 54;
  const b = `5px solid rgba(245,192,78,0.95)`;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: c,
    height: c,
    filter: 'drop-shadow(0 0 12px rgba(245,192,78,0.7))',
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: left - pad,
        top: top - pad,
        width: width + pad * 2,
        height: height + pad * 2,
        opacity: amt,
        transform: `scale(${1 + (1 - amt) * 0.05})`,
        zIndex: 8,
        pointerEvents: 'none',
      }}
    >
      <div style={{...base, left: 0, top: 0, borderLeft: b, borderTop: b}} />
      <div style={{...base, right: 0, top: 0, borderRight: b, borderTop: b}} />
      <div style={{...base, left: 0, bottom: 0, borderLeft: b, borderBottom: b}} />
      <div style={{...base, right: 0, bottom: 0, borderRight: b, borderBottom: b}} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: 5,
          background: GOLD,
          boxShadow: '0 0 18px rgba(245,192,78,0.9)',
        }}
      />
    </div>
  );
};

/* =========================== SCENE SHELL ========================== */

type Enter = 'fromR' | 'fromL' | 'zoom' | 'none';
type Exit = 'toL' | 'toR' | 'zoomOut' | 'none';

const SceneShell: React.FC<{
  dur: number;
  enter: Enter;
  exit: Exit;
  children: React.ReactNode;
}> = ({dur, enter, exit, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e =
    enter === 'none'
      ? 1
      : spring({frame, fps, config: {damping: 24, stiffness: 220, mass: 0.9}});
  const eInv = Math.max(0, 1 - e);
  const ex = interpolate(frame, [dur - 12, dur], [0, 1], {
    ...CL,
    easing: Easing.in(Easing.quad),
  });

  let x = enter === 'fromR' ? eInv * 1050 : enter === 'fromL' ? eInv * -1050 : 0;
  let s = enter === 'zoom' ? 1.5 - 0.5 * e : 1;
  let b = eInv * 24;
  let o = 1;
  let r = enter === 'fromR' ? eInv * 2.5 : enter === 'fromL' ? eInv * -2.5 : 0;

  if (exit === 'toL') {
    x += ex * -950;
    b += ex * 18;
    r += ex * -2;
  } else if (exit === 'toR') {
    x += ex * 950;
    b += ex * 18;
    r += ex * 2;
  } else if (exit === 'zoomOut') {
    s += ex * 0.4;
    b += ex * 24;
    o = 1 - ex * 0.5;
  }
  s += ex * 0.05;
  b = Math.max(0, b);

  const flash = eInv * 0.4;
  const sheenX = interpolate(frame, [0, dur], [-800, 2700], CL);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px) scale(${s}) rotate(${r}deg)`,
        filter: `blur(${b}px)`,
        opacity: o,
      }}
    >
      {children}
      {/* sheen de vida permanente */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          left: 0,
          width: 520,
          height: 1560,
          transform: `rotate(18deg) translateX(${sheenX}px)`,
          background:
            'linear-gradient(90deg,transparent,rgba(160,190,255,0.05),transparent)',
          pointerEvents: 'none',
        }}
      />
      {/* flash de whip en la entrada: pega los cortes */}
      <AbsoluteFill
        style={{
          background: '#8FB2FF',
          opacity: flash,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ==================== NIVEL 1: DEPTH SCENE ======================== */
/* Fondo blureado + foto nítida flotante con glow + silueta que ocluye +
   texto cinético. Parallax por factor de profundidad, rack focus, zoom a detalle. */

type Layout = 'left' | 'right' | 'center';

const CARD_RECTS: Record<
  Layout,
  {left: number; top: number; width: number; height: number; rotate: number}
> = {
  right: {left: 1020, top: 196, width: 790, height: 614, rotate: 2.2},
  left: {left: 110, top: 196, width: 790, height: 614, rotate: -2.2},
  center: {left: 480, top: 150, width: 960, height: 600, rotate: 0},
};

const TEXT_POS: Record<Layout, React.CSSProperties> = {
  right: {left: 120, top: 340, width: 840, alignItems: 'flex-start', textAlign: 'left'},
  left: {left: 1010, top: 340, width: 790, alignItems: 'flex-start', textAlign: 'left'},
  center: {left: 160, top: 420, width: 1600, alignItems: 'center', textAlign: 'center'},
};

const DepthScene: React.FC<{
  img: string;
  kicker: string;
  words: string[];
  goldWords?: string[];
  layout: Layout;
  enter: Enter;
  exit: Exit;
  dur: number;
  pulls?: number[];
  pullTarget?: 'photo' | 'text';
  tag?: string;
  tagAt?: number;
  zoomAt?: number;
  occluder?: 'l' | 'r' | null;
  occDelay?: number;
  dim?: number;
  sat?: number;
  wordDelay?: number;
  stagger?: number;
  fontSize?: number;
  sub?: {text: string; at: number};
}> = (p) => {
  const frame = useCurrentFrame();
  const dur = p.dur;
  const layout = p.layout;
  const rect = CARD_RECTS[layout];
  const goldSet = new Set(p.goldWords ?? []);
  const pullTarget = p.pullTarget ?? 'photo';
  const pull = pulses(frame, p.pulls, 26);
  const zoomP = p.zoomAt != null ? pulse1(frame - p.zoomAt, 34) : 0;

  // cámara: push-in permanente + drift
  const camS = interpolate(frame, [0, dur], [1.045, 1.12], CL);
  const drift = layout === 'right' ? -1 : 1;
  const camX =
    interpolate(frame, [0, dur], [0, 26 * drift], CL) + Math.sin(frame / 46) * 7;
  const camY = Math.cos(frame / 58) * 5 - interpolate(frame, [0, dur], [0, 12], CL);

  // blurs por capa + rack focus
  const sat = p.sat ?? 1;
  const bgBlur = 15 + (pullTarget === 'bg' ? 0 : pull * 16);
  const photoBlur = pullTarget === 'photo' ? 0 : pull * 13;
  const textBlur = pullTarget === 'text' ? 0 : pull * 11;
  const occBlur = 9 + pull * 7;

  const bobY = Math.sin((frame + 15) / 27) * 7;
  const bobR = Math.sin(frame / 33) * 0.5;
  const photoScale = camS * (1 + zoomP * 0.22);
  const bracketAmt = Math.max(pullTarget === 'photo' ? pull : 0, zoomP);

  const occDelay = p.occDelay ?? 20;
  const occX = p.occluder
    ? interpolate(
        frame,
        [occDelay, dur * 0.92],
        p.occluder === 'l' ? [-620, 2250] : [2250, -620],
        CL
      )
    : 0;

  const wordDelay = p.wordDelay ?? 8;
  const stagger = p.stagger ?? 7;
  const fontSize = p.fontSize ?? 92;

  return (
    <SceneShell dur={dur} enter={p.enter} exit={p.exit}>
      {/* L0 base gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 720px at ${
            layout === 'right' ? '74% 42%' : layout === 'left' ? '26% 42%' : '50% 40%'
          }, #12264D 0%, #081226 48%, #04060F 100%)`,
        }}
      />
      {/* L1 imagen profunda blureada */}
      <AbsoluteFill
        style={{
          transform: `scale(${1.35 + (camS - 1) * 0.6}) translate(${camX * 0.25}px, ${
            camY * 0.25
          }px)`,
          filter: `blur(${bgBlur}px) brightness(0.5) saturate(${sat})`,
          zIndex: 1,
        }}
      >
        <Img src={p.img} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* L2 partículas mid */}
      <div style={{position: 'absolute', inset: 0, transform: `translate(${camX * 0.5}px, ${camY * 0.5}px)`, zIndex: 2}}>
        <Particles count={26} color="#9DB9FF" seed={`d-${p.kicker}`} blur={1} opacity={0.7} />
      </div>
      {/* L3 foto nítida flotante */}
      <div
        style={{
          position: 'absolute',
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          transform: `translate(${camX * 0.8 - zoomP * 60}px, ${
            camY * 0.8 + bobY - zoomP * 30
          }px) rotate(${rect.rotate + bobR}deg) scale(${photoScale})`,
          filter: `blur(${photoBlur}px)`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 12,
            borderRadius: 22,
            background: 'linear-gradient(180deg,#0E1B36,#081226)',
            border: '1px solid rgba(245,192,78,0.35)',
            boxShadow:
              '0 44px 120px rgba(0,0,0,0.62), 0 0 90px rgba(245,192,78,0.14)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 12,
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <Img
              src={p.img}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${interpolate(
                  frame,
                  [0, dur],
                  [1.03, 1.16],
                  CL
                )}) brightness(${1 + zoomP * 0.12}) saturate(${sat})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -60,
                left: 0,
                width: 190,
                height: 900,
                transform: `rotate(16deg) translateX(${interpolate(
                  frame,
                  [0, dur],
                  [-260, rect.width + 320],
                  CL
                )}px)`,
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(4,8,20,0) 55%, rgba(4,8,20,0.55) 100%)',
              }}
            />
          </div>
        </div>
        {p.tag ? <Tag text={p.tag} at={p.tagAt ?? 24} boost={Math.max(pull, zoomP)} /> : null}
      </div>
      {/* L4 bokeh foreground */}
      <div style={{position: 'absolute', inset: 0, transform: `translate(${camX * 1.35}px, ${camY * 1.35}px)`, zIndex: 4}}>
        <Bokeh seed={`b-${p.kicker}`} par={1} />
      </div>
      {/* L5 silueta que ocluye */}
      {p.occluder ? (
        <div
          style={{
            position: 'absolute',
            left: occX + camX * 1.7,
            bottom: -70,
            filter: `blur(${occBlur}px)`,
            opacity: 0.97,
            zIndex: 5,
          }}
        >
          <Silhouette height={layout === 'center' ? 1160 : 1010} color="#02040C" />
        </div>
      ) : null}
      {/* L6 dim (oscurece todo menos el texto) */}
      <AbsoluteFill
        style={{background: '#020612', opacity: (p.dim ?? 0) + (pullTarget === 'photo' ? pull * 0.15 : 0), zIndex: 6}}
      />
      {/* brackets de rack focus */}
      <FocusBrackets
        left={rect.left}
        top={rect.top}
        width={rect.width}
        height={rect.height}
        amt={bracketAmt}
      />
      {/* L7 texto cinético */}
      <div
        style={{
          position: 'absolute',
          ...TEXT_POS[layout],
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          transform: `translate(${camX * 0.95}px, ${camY * 0.95}px)`,
          filter: `blur(${textBlur}px)`,
          opacity: 1 - (pullTarget === 'photo' ? pull * 0.3 : 0),
          zIndex: 9,
        }}
      >
        <Kicker text={p.kicker} delay={2} center={layout === 'center'} />
        <div>
          {p.words.map((w, i) => (
            <Word
              key={`${w}-${i}`}
              text={w}
              delay={wordDelay + i * stagger}
              gold={goldSet.has(w)}
              fontSize={fontSize}
            />
          ))}
        </div>
        <UnderBar at={wordDelay + p.words.length * stagger + 2} center={layout === 'center'} />
        {p.sub ? (
          <SubNote text={p.sub.text} at={p.sub.at} center={layout === 'center'} />
        ) : null}
      </div>
    </SceneShell>
  );
};

/* ==================== NIVEL 2: NUMBER PUNCH ======================= */
/* Count-up dorado gigante: rays, rings de impacto, glow radial, polaroid lateral. */

const Rays: React.FC<{count: number; rot: number; scale: number}> = ({count, rot, scale}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '54%',
      width: 0,
      height: 0,
      transform: `scale(${scale})`,
      zIndex: 2,
    }}
  >
    {new Array(count).fill(0).map((_, i) => {
      const a = (360 / count) * i + rot;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -2,
            top: 0,
            width: 4,
            height: 780,
            transformOrigin: '50% 0',
            transform: `rotate(${a}deg) translateY(-30px)`,
            background:
              'linear-gradient(180deg, rgba(245,192,78,0), rgba(245,192,78,0.42))',
            opacity: 0.16,
            filter: 'blur(1px)',
          }}
        />
      );
    })}
  </div>
);

const Ring: React.FC<{at: number; size: number}> = ({at, size}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = interpolate(frame, [at, at + 24], [0.25, 2.1], CL);
  const o = interpolate(frame, [at, at + 24], [0.9, 0], CL);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '54%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        border: '3px solid rgba(245,192,78,0.9)',
        transform: `scale(${s})`,
        opacity: o,
        boxShadow: '0 0 60px rgba(245,192,78,0.4)',
        zIndex: 7,
      }}
    />
  );
};

const NumberPunch: React.FC<{
  img: string;
  enter: Enter;
  exit: Exit;
  dur: number;
  kicker?: string;
  from?: number;
  to?: number;
  countStart?: number;
  countEnd?: number;
  finalText?: string;
  subline?: string;
  subAt?: number;
  subGold?: boolean;
  sideImg?: string;
  side?: 'left' | 'right';
}> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = p.dur;
  const hasCount = p.finalText == null;
  const cs = p.countStart ?? 14;
  const ce = p.countEnd ?? 70;
  const from = p.from ?? 0;
  const to = p.to ?? 0;

  const val = hasCount
    ? interpolate(frame, [cs, ce], [from, to], {...CL, easing: Easing.out(Easing.cubic)})
    : 0;
  const shown = hasCount ? `$${Math.round(val).toLocaleString('en-US')}` : p.finalText!;
  const lockAt = hasCount ? ce : 6;
  const lockP = pulse1(frame - lockAt, 20);

  const inS = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: {damping: 13, stiffness: 180},
  });
  const inInv = Math.max(0, 1 - Math.min(1, inS));

  const camS = interpolate(frame, [0, dur], [1.06, 1.16], CL);
  const camX = Math.sin(frame / 52) * 8 + interpolate(frame, [0, dur], [0, -16], CL);
  const camY = Math.cos(frame / 64) * 5;

  const jitter = hasCount && frame < ce ? Math.sin(frame * 2.1) * 3 : 0;
  const numScale = (0.75 + 0.25 * inS) * (1 + lockP * 0.06);
  const fs = p.finalText ? 148 : shown.length >= 10 ? 168 : 196;

  const sideS = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: {damping: 14, stiffness: 160},
  });
  const subAt = p.subAt ?? 70;
  const subWords = (p.subline ?? '').split(' ').filter(Boolean);

  return (
    <SceneShell dur={dur} enter={p.enter} exit={p.exit}>
      <AbsoluteFill style={{background: '#060C1D'}} />
      {/* fondo profundo */}
      <AbsoluteFill
        style={{
          transform: `scale(${1.3 + (camS - 1) * 0.5}) translate(${camX * 0.3}px, ${
            camY * 0.3
          }px)`,
          filter: 'blur(24px) brightness(0.38) saturate(0.85)',
          zIndex: 1,
        }}
      >
        <Img src={p.img} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* glow radial dorado */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 900px 560px at 50% 55%, rgba(245,192,78,0.20), rgba(245,192,78,0) 60%)',
          transform: `scale(${1 + lockP * 0.18})`,
          zIndex: 2,
        }}
      />
      <Rays count={22} rot={frame * 0.12} scale={1 + lockP * 0.1} />
      <div style={{position: 'absolute', inset: 0, transform: `translate(${camX * 0.7}px, ${camY * 0.7}px)`, zIndex: 3}}>
        <Particles count={34} color={GOLD} seed={`n-${p.kicker ?? 'final'}`} speed={1.4} />
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${camX * 1.3}px, ${camY * 1.3}px)`, zIndex: 3}}>
        <Bokeh seed={`nb-${p.kicker ?? 'f'}`} par={1} />
      </div>
      {/* polaroid lateral */}
      {p.sideImg ? (
        <div
          style={{
            position: 'absolute',
            ...(p.side === 'left' ? {left: 150} : {right: 150}),
            top: 600,
            width: 330,
            height: 240,
            transform: `translate(${camX * 1.15}px, ${
              camY * 1.15 + Math.sin(frame / 26) * 9
            }px) rotate(${p.side === 'left' ? 7 : -7}deg) scale(${sideS})`,
            filter: 'blur(1.5px)',
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: 10,
              borderRadius: 16,
              background: 'linear-gradient(180deg,#0E1B36,#081226)',
              border: '1px solid rgba(245,192,78,0.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,192,78,0.16)',
              overflow: 'hidden',
            }}
          >
            <Img
              src={p.sideImg}
              style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10}}
            />
          </div>
        </div>
      ) : null}
      <Ring at={lockAt} size={720} />
      <Ring at={lockAt + 7} size={720} />
      {/* columna central */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          transform: `translate(${camX * 0.9}px, ${camY * 0.9 + jitter}px) scale(${numScale})`,
          zIndex: 8,
        }}
      >
        {p.kicker ? <Kicker text={p.kicker} delay={4} center /> : null}
        <div
          style={{
            ...goldText,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: fs,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, inS * 1.6),
            filter: `drop-shadow(0 12px 60px rgba(245,192,78,0.38)) blur(${inInv * 16}px)`,
          }}
        >
          {shown}
        </div>
        {p.subline ? (
          <div style={{filter: p.subGold ? 'drop-shadow(0 6px 30px rgba(245,192,78,0.35))' : undefined}}>
            {subWords.map((w, i) => (
              <Word
                key={`${w}-${i}`}
                text={w}
                delay={subAt + i * 3}
                gold={p.subGold}
                fontSize={36}
              />
            ))}
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};

/* ==================== NIVEL 3: SPLIT COMPARE ====================== */
/* Dos paneles con wipe, divider dorado, whip-pan al ganador. */

const SplitCompare: React.FC<{
  leftImg: string;
  rightImg: string;
  leftTitle: string[];
  rightTitle: string[];
  leftSub: string[];
  rightSub: string[];
  rightGold: string[];
  panAt: number;
  dur: number;
  exit: Exit;
}> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = p.dur;

  const inL = spring({frame, fps, config: {damping: 22, stiffness: 200}});
  const inR = spring({frame: Math.max(0, frame - 3), fps, config: {damping: 22, stiffness: 200}});
  const pan = spring({
    frame: Math.max(0, frame - p.panAt),
    fps,
    config: {damping: 200},
    durationInFrames: 18,
  });
  const divS = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: {damping: 200},
    durationInFrames: 12,
  });
  const vsS = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 12, stiffness: 200}});

  const camS = interpolate(frame, [0, dur], [1.03, 1.1], CL);
  const inv = (v: number) => Math.max(0, 1 - Math.min(1, v));
  const rightGoldSet = new Set(p.rightGold);

  const panel = (cfg: {
    img: string;
    title: string[];
    sub: string[];
    side: 'l' | 'r';
    enterV: number;
    delay: number;
  }) => {
    const isL = cfg.side === 'l';
    const enterX = inv(cfg.enterV) * (isL ? -1150 : 1150);
    const enterB = inv(cfg.enterV) * 16;
    const sat = isL ? 0.35 : 1.05;
    const bright = isL ? 0.72 - pan * 0.25 : 0.95 + pan * 0.05;
    const scale = isL ? 1 - pan * 0.02 : 1 + pan * 0.045;
    const labelBlur = isL ? pan * 5 : 0;
    const glow = isL ? 0 : pan;
    return (
      <div
        style={{
          position: 'relative',
          width: 860,
          height: 780,
          borderRadius: 24,
          overflow: 'hidden',
          transform: `translateX(${enterX}px) scale(${scale})`,
          filter: `saturate(${sat}) brightness(${bright}) blur(${enterB + labelBlur}px)`,
          border: isL
            ? '1px solid rgba(255,255,255,0.10)'
            : `1px solid rgba(245,192,78,${0.25 + glow * 0.5})`,
          boxShadow: isL
            ? '0 40px 100px rgba(0,0,0,0.55)'
            : `0 40px 100px rgba(0,0,0,0.55), 0 0 ${110 * glow}px rgba(245,192,78,${
                0.12 + glow * 0.3
              })`,
        }}
      >
        <Img
          src={cfg.img}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${interpolate(frame, [0, dur], [1.06, 1.16], CL)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(4,8,20,0.15) 30%, rgba(4,8,20,0.88) 100%)',
          }}
        />
        <div style={{position: 'absolute', left: 44, bottom: 40, right: 40}}>
          <div style={{marginBottom: 14}}>
            {cfg.title.map((w, i) => (
              <Word key={w + i} text={w} delay={cfg.delay + i * 5} fontSize={62} gold={!isL && rightGoldSet.has(w)} />
            ))}
          </div>
          <div>
            {cfg.sub.map((w, i) => (
              <Word
                key={w + i}
                text={w}
                delay={cfg.delay + 14 + i * 3}
                fontSize={28}
                gold={!isL && rightGoldSet.has(w)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <SceneShell dur={dur} enter="none" exit={p.exit}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(1100px 700px at 50% 45%, #0A1430 0%, #060C1D 55%, #04060F 100%)',
        }}
      />
      <Particles count={22} color={GOLD} seed="split" speed={0.8} opacity={0.6} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          transform: `translateX(${-380 * pan}px) scale(${camS})`,
        }}
      >
        {panel({img: p.leftImg, title: p.leftTitle, sub: p.leftSub, side: 'l', enterV: inL, delay: 12})}
        <div style={{width: 40}} />
        {panel({img: p.rightImg, title: p.rightTitle, sub: p.rightSub, side: 'r', enterV: inR, delay: 16})}
      </div>
      {/* divider dorado */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 5,
          height: 830,
          marginLeft: -2.5,
          marginTop: -415 + Math.sin(frame / 40) * 4,
          borderRadius: 3,
          background: `linear-gradient(180deg, rgba(245,192,78,0), ${GOLD} 30%, ${GOLD_DEEP} 70%, rgba(245,192,78,0))`,
          boxShadow: '0 0 40px rgba(245,192,78,0.55)',
          transform: `scaleY(${divS}) translateX(${-380 * pan}px)`,
          zIndex: 6,
        }}
      />
      {/* VS */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 92,
          height: 92,
          marginLeft: -46,
          marginTop: -46,
          borderRadius: 46,
          border: `2px solid rgba(245,192,78,0.85)`,
          background: 'rgba(4,8,20,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${-380 * pan}px) scale(${vsS * (1 + pan * 0.15)}) rotate(${Math.sin(frame / 50) * 4}deg)`,
          boxShadow: '0 0 50px rgba(245,192,78,0.35)',
          zIndex: 7,
        }}
      >
        <span style={{...goldText, fontFamily: FONT, fontWeight: 900, fontSize: 34}}>VS</span>
      </div>
    </SceneShell>
  );
};

/* ======================== ROOT OVERLAYS =========================== */

const Letterbox: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#01020A',
        boxShadow: '0 1px 0 rgba(245,192,78,0.18)',
        zIndex: 60,
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#01020A',
        boxShadow: '0 -1px 0 rgba(245,192,78,0.18)',
        zIndex: 60,
      }}
    />
  </>
);

const Brand: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 90,
        left: 64,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        zIndex: 55,
      }}
    >
      <div style={{width: 10, height: 10, background: GOLD, borderRadius: 2}} />
      <span
        style={{
          fontFamily: FONT_LIGHT,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 6,
          color: 'rgba(244,247,255,0.5)',
        }}
      >
        THE RETIREMENT FILES
      </span>
    </div>
    <div
      style={{
        position: 'absolute',
        top: 90,
        right: 64,
        fontFamily: FONT_LIGHT,
        fontWeight: 700,
        fontSize: 19,
        letterSpacing: 6,
        color: 'rgba(244,247,255,0.35)',
        zIndex: 55,
      }}
    >
      FIN — 01
    </div>
  </>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: 80,
        height: 3,
        borderRadius: 2,
        background: 'rgba(244,247,255,0.10)',
        zIndex: 55,
      }}
    >
      <div
        style={{
          width: `${(frame / 749) * 100}%`,
          height: '100%',
          borderRadius: 2,
          background: `linear-gradient(90deg,${GOLD},${GOLD_DEEP})`,
          boxShadow: '0 0 16px rgba(245,192,78,0.6)',
        }}
      />
    </div>
  );
};

const Fade: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: '#01020A',
        opacity: interpolate(frame, [0, 10], [from, to], CL),
        zIndex: 58,
      }}
    />
  );
};

/* ============================ MAIN ================================ */

export const FinEdit: React.FC<FinEditProps> = (props) => {
  const {
    house = staticFile('fin/house.png'),
    market = staticFile('fin/market.png'),
    cash = staticFile('fin/cash.png'),
    retiree = staticFile('fin/retiree.png'),
    city = staticFile('fin/city.png'),
  } = props;

  return (
    <AbsoluteFill style={{background: '#04060F'}}>
      <Series>
        {/* S1 — 0.0-4.0s — "In 1985, this house cost fifty thousand dollars." */}
        <Series.Sequence durationInFrames={132}>
          <DepthScene
            img={house}
            kicker="1985"
            words={['THIS', 'HOUSE', 'COST']}
            layout="right"
            enter="zoom"
            exit="toL"
            dur={132}
            tag="$50,000"
            tagAt={26}
            pulls={[82]}
            pullTarget="photo"
            occluder="l"
            occDelay={16}
            dim={0.15}
            sat={0.9}
            fontSize={92}
            wordDelay={8}
            stagger={8}
          />
        </Series.Sequence>

        {/* S2 — 4.0-8.0s — "Today, it is worth over eight hundred thousand." */}
        <Series.Sequence durationInFrames={130} offset={-12}>
          <NumberPunch
            img={house}
            enter="fromR"
            exit="toR"
            dur={130}
            kicker="TODAY, IT IS WORTH"
            from={50000}
            to={800000}
            countStart={16}
            countEnd={76}
            subline="SAME HOUSE. NEW REALITY."
            subAt={82}
            sideImg={market}
            side="left"
          />
        </Series.Sequence>

        {/* S3 — 8.0-12.5s — "But here is what no one ever told you." */}
        <Series.Sequence durationInFrames={140} offset={-10}>
          <DepthScene
            img={city}
            kicker="THE PART THEY SKIP"
            words={['BUT', "HERE'S", 'WHAT', 'NO', 'ONE', 'EVER', 'TOLD', 'YOU']}
            goldWords={['BUT', 'NO', 'ONE']}
            layout="center"
            enter="fromL"
            exit="toL"
            dur={140}
            pulls={[40, 102]}
            pullTarget="text"
            occluder="r"
            occDelay={4}
            dim={0.55}
            sat={0.35}
            fontSize={84}
            wordDelay={10}
            stagger={7}
            sub={{text: 'UNTIL NOW.', at: 104}}
          />
        </Series.Sequence>

        {/* S4 — 12.5-15.5s — "That same fifty grand, invested in the market..." */}
        <Series.Sequence durationInFrames={95} offset={-10}>
          <DepthScene
            img={market}
            kicker="THAT SAME $50,000"
            words={['INVESTED', 'IN', 'THE', 'MARKET']}
            goldWords={['MARKET']}
            layout="left"
            enter="fromR"
            exit="toL"
            dur={95}
            tag="S&P 500 INDEX"
            tagAt={30}
            zoomAt={54}
            pulls={[74]}
            pullTarget="photo"
            occluder="l"
            occDelay={34}
            dim={0.2}
            sat={1}
            fontSize={96}
            wordDelay={6}
            stagger={8}
          />
        </Series.Sequence>

        {/* S5 — 15.2-18.5s — "...would be two point three million today." */}
        <Series.Sequence durationInFrames={100} offset={-10}>
          <NumberPunch
            img={market}
            enter="zoom"
            exit="zoomOut"
            dur={100}
            kicker="TODAY, IT WOULD BE"
            from={50000}
            to={2300000}
            countStart={14}
            countEnd={64}
            subline="TWO POINT THREE MILLION DOLLARS."
            subAt={70}
            subGold
            sideImg={cash}
            side="right"
          />
        </Series.Sequence>

        {/* S6 — 18.2-22.3s — "The house kept you comfortable. The market would have made you rich." */}
        <Series.Sequence durationInFrames={124} offset={-10}>
          <SplitCompare
            leftImg={house}
            rightImg={market}
            leftTitle={['THE', 'HOUSE']}
            rightTitle={['THE', 'MARKET']}
            leftSub={['KEPT', 'YOU', 'COMFORTABLE.']}
            rightSub={['WOULD', 'HAVE', 'MADE', 'YOU', 'RICH.']}
            rightGold={['RICH.']}
            panAt={52}
            dur={124}
            exit="toL"
          />
        </Series.Sequence>

        {/* S7 — 22.0-23.7s — "Most retirees never ran the numbers." */}
        <Series.Sequence durationInFrames={62} offset={-10}>
          <DepthScene
            img={retiree}
            kicker="THE HARD TRUTH"
            words={['MOST', 'RETIREES', 'NEVER', 'RAN', 'THE', 'NUMBERS.']}
            goldWords={['NEVER']}
            layout="right"
            enter="fromR"
            exit="toL"
            dur={62}
            pulls={[30]}
            pullTarget="text"
            occluder={null}
            dim={0.3}
            sat={0.85}
            fontSize={72}
            wordDelay={4}
            stagger={4}
          />
        </Series.Sequence>

        {/* S8 — 23.7-25.0s — "You just did." */}
        <Series.Sequence durationInFrames={39} offset={-10}>
          <NumberPunch
            img={retiree}
            enter="zoom"
            exit="none"
            dur={39}
            finalText="YOU JUST DID."
            subline="RUN THE NUMBERS."
            subAt={12}
            subGold
          />
        </Series.Sequence>
      </Series>

      {/* overlays globales */}
      <Grain />
      <Vignette />
      <Sequence durationInFrames={10}>
        <Fade from={1} to={0} />
      </Sequence>
      <Sequence from={740} durationInFrames={10}>
        <Fade from={0} to={1} />
      </Sequence>
      <Brand />
      <Progress />
      <Letterbox />
    </AbsoluteFill>
  );
};

/* ========================== REGISTRO ============================== */

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FinEdit"
      component={FinEdit}
      durationInFrames={750}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        house: staticFile('fin/house.png'),
        market: staticFile('fin/market.png'),
        cash: staticFile('fin/cash.png'),
        retiree: staticFile('fin/retiree.png'),
        city: staticFile('fin/city.png'),
      }}
    />
  );
};

registerRoot(RemotionRoot);
