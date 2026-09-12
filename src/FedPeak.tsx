/**
 * FedX — "El Método Piel Joven" — Dr. Federer
 * Dermocosmética natural · romero · piel madura
 * 1920x1080 @ 30fps — dark espresso + dorado/cobre botánico
 *
 * Assets esperados en public/med/:
 *   romero.png · piel.png · aceite.png · vapor.png
 *   cubito.png · colageno.png · crema.png · antes_despues.png
 *
 * BEAT MAP del REEL (980f abs):
 *  S1   0–170   HERO    piel      — "TU PIEL NO ENVEJECIÓ." perfil ocluye + mini colágeno
 *  S2 160–330   ACTIVO  romero    — "ROMERO. EL COLÁGENO DE LAS ABUELAS." rama gigante cruza
 *  S3 320–495   VERSUS  crema vs vapor — whip-pan al método
 *  S4 485–650   DATO    vapor     — count-up 0→87% + polaroid antes/después
 *  S5 640–810   PRUEBA  antes     — scan-line dorado ANTES/DESPUÉS + focus pull
 *  S6 800–980   CTA     crema     — "COMENTÁ: ROMERO" + cubito de hielo
 * Overlaps de 10f => whips cruzados, sin corte seco.
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
const GOLD = '#E3A94E';
const COPPER = '#B06A2E';
const GOLD_PALE = '#F9E3B0';
const CREAM = '#FBF3E4';
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg,${GOLD_PALE} 0%,${GOLD} 48%,${COPPER} 100%)`,
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

/* ========================= PROPS / DURACIONES ===================== */

export type FedXProps = {
  romero: string;
  piel: string;
  aceite: string;
  vapor: string;
  cubito: string;
  colageno: string;
  crema: string;
  antes: string;
};

const D_HERO = 170;
const D_ACTIVO = 170;
const D_VERSUS = 175;
const D_DATO = 165;
const D_PRUEBA = 170;
const D_CTA = 180;
const OV = 10;
const D_REEL = D_HERO + D_ACTIVO + D_VERSUS + D_DATO + D_PRUEBA + D_CTA - OV * 5;

/* ========================= ATOMS / PARTICLES ====================== */

const Particles: React.FC<{
  count: number;
  color: string;
  seed: string;
  blur?: number;
  speed?: number;
  opacity?: number;
  sway?: number;
}> = ({count, color, seed, blur = 0, speed = 1, opacity = 1, sway = 14}) => {
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
        const sx = Math.sin(frame / 23 + ph) * sway;
        const o = (0.12 + 0.28 * (0.5 + 0.5 * Math.sin(frame / 19 + ph))) * opacity;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + sx,
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
        const gold = random(`${seed}-bg${i}`) > 0.4;
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
                ? 'radial-gradient(circle, rgba(227,169,78,0.16), rgba(227,169,78,0))'
                : 'radial-gradient(circle, rgba(138,154,91,0.13), rgba(138,154,91,0))',
              filter: 'blur(34px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Mist: React.FC<{seed: string; par: number; opacity?: number}> = ({
  seed,
  par,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(4).fill(0).map((_, i) => {
        const w = 700 + random(`${seed}-mw${i}`) * 520;
        const h = 150 + random(`${seed}-mh${i}`) * 120;
        const y = 600 + random(`${seed}-my${i}`) * 400;
        const x0 = random(`${seed}-mx${i}`) * 2600;
        const sp = 0.5 + random(`${seed}-ms${i}`) * 0.8;
        const x = ((((x0 + frame * sp * par) % 2600) + 2600) % 2600) - 400;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse, rgba(233,180,110,0.10), rgba(233,180,110,0))',
              filter: 'blur(28px)',
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ====================== SILUETAS QUE OCLUYEN ====================== */

const Bust: React.FC<{height: number; color: string}> = ({height, color}) => (
  <svg width={height * 0.95} height={height} viewBox="0 0 200 210">
    <path
      d="M100 10c-25 0-42 19-42 44 0 17 8 31 20 39-36 8-61 38-66 84-2 16 11 29 27 29h122c16 0 29-13 27-29-5-46-30-76-66-84 12-8 20-22 20-39 0-25-17-44-42-44z"
      fill={color}
    />
  </svg>
);

const Profile: React.FC<{height: number; color: string; flip?: boolean}> = ({
  height,
  color,
  flip,
}) => (
  <svg
    width={height * 0.867}
    height={height}
    viewBox="0 0 260 300"
    style={flip ? {transform: 'scaleX(-1)'} : undefined}
  >
    <path
      d="M84 300 C82 274 88 250 104 234 C111 227 113 219 109 210 C101 200 93 191 90 179 C88 173 92 169 90 163 C86 159 86 154 90 150 C94 145 90 141 84 137 C75 131 73 122 79 114 C84 109 88 102 88 94 C88 80 96 62 112 52 C132 39 164 40 184 55 C191 44 205 40 217 46 C231 53 235 68 228 79 C236 88 239 102 234 115 C227 131 217 144 207 154 C199 164 195 176 197 188 C200 208 211 224 227 238 C244 253 254 274 257 300 Z"
      fill={color}
    />
  </svg>
);

const Sprig: React.FC<{height: number; color: string; flip?: boolean}> = ({
  height,
  color,
  flip,
}) => {
  const needles = new Array(14).fill(0);
  return (
    <svg
      width={height * 0.5}
      height={height}
      viewBox="0 0 100 200"
      style={flip ? {transform: 'scaleX(-1)'} : undefined}
    >
      <path
        d="M52 200 C48 150 56 100 50 8"
        stroke={color}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      {needles.map((_, i) => {
        const t = i / 13;
        const y = 192 - t * 176;
        const x = 51 + Math.sin(t * 5.2) * 5 - t * 2;
        const len = 8 + 26 * (1 - t * 0.62);
        const dx = Math.cos(0.62) * len;
        const dy = Math.sin(0.62) * len;
        return (
          <g key={i} stroke={color} strokeWidth={3.4} strokeLinecap="round">
            <line x1={x} y1={y} x2={x - dx} y2={y - dy} />
            <line x1={x} y1={y} x2={x + dx} y2={y - dy} />
          </g>
        );
      })}
    </svg>
  );
};

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
    <filter id="fed-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#fed-grain)" />
  </svg>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(8,4,1,0.66) 100%)',
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
  const breathe = Math.min(1, s * 1.2) * Math.sin((frame - delay) / 34) * 2;
  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: '0.26em',
        fontSize,
        fontWeight: 900,
        fontFamily: FONT,
        letterSpacing: '-0.02em',
        color: gold ? undefined : CREAM,
        ...(gold ? goldText : {}),
        transform: `translateY(${inv * 54 + breathe}px) rotate(${inv * 5}deg) scale(${
          0.85 + 0.15 * s
        })`,
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
        width: 280 * s,
        height: 5,
        borderRadius: 3,
        background: `linear-gradient(90deg,${GOLD},${COPPER})`,
        boxShadow: '0 0 24px rgba(227,169,78,0.5)',
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
        background: `linear-gradient(180deg,${GOLD_PALE},${GOLD} 55%,${COPPER})`,
        color: '#241304',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 42,
        letterSpacing: '-0.02em',
        transform: `scale(${s * (1 + boost * 0.1)}) rotate(-3deg)`,
        opacity: Math.min(1, s * 2),
        boxShadow: '0 18px 50px rgba(0,0,0,0.55), 0 0 60px rgba(227,169,78,0.45)',
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
  const b = `5px solid rgba(227,169,78,0.95)`;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: c,
    height: c,
    filter: 'drop-shadow(0 0 12px rgba(227,169,78,0.7))',
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
          boxShadow: '0 0 18px rgba(227,169,78,0.9)',
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

  const flash = eInv * 0.38;
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
      <div
        style={{
          position: 'absolute',
          top: -220,
          left: 0,
          width: 520,
          height: 1560,
          transform: `rotate(18deg) translateX(${sheenX}px)`,
          background:
            'linear-gradient(90deg,transparent,rgba(255,214,150,0.05),transparent)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: '#E8A95C',
          opacity: flash,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ==================== NIVEL 1: DEPTH SCENE ======================== */
/* 5 planos: fondo blureado -> foto enmarcada nítida -> mini-polaroid ->
   silueta/ramas que OCLUYEN -> texto. Rack focus, scan-line, niebla. */

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
  seed: string;
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
  occ?: {variant: 'profile' | 'bust' | 'sprig'; side: 'l' | 'r'; delay?: number} | null;
  sprigCross?: boolean;
  mini?: {img: string; at: number; caption: string};
  scanAt?: number;
  mist?: boolean;
  dim?: number;
  sat?: number;
  wordDelay?: number;
  stagger?: number;
  fontSize?: number;
  sub?: {text: string; at: number};
}> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = p.dur;
  const layout = p.layout;
  const rect = CARD_RECTS[layout];
  const goldSet = new Set(p.goldWords ?? []);
  const pullTarget = p.pullTarget ?? 'photo';
  const pull = pulses(frame, p.pulls, 26);
  const zoomP = p.zoomAt != null ? pulse1(frame - p.zoomAt, 34) : 0;

  const camS = interpolate(frame, [0, dur], [1.045, 1.12], CL);
  const drift = layout === 'right' ? -1 : 1;
  const camX =
    interpolate(frame, [0, dur], [0, 26 * drift], CL) + Math.sin(frame / 46) * 7;
  const camY = Math.cos(frame / 58) * 5 - interpolate(frame, [0, dur], [0, 12], CL);

  const sat = p.sat ?? 1;
  const bgBlur = 15 + pull * 16;
  const photoBlur = pullTarget === 'photo' ? 0 : pull * 13;
  const textBlur = pullTarget === 'text' ? 0 : pull * 11;
  const occBlur = 9 + pull * 7;

  const bobY = Math.sin((frame + 15) / 27) * 7;
  const bobR = Math.sin(frame / 33) * 0.5;
  const photoScale = camS * (1 + zoomP * 0.22);
  const bracketAmt = Math.max(pullTarget === 'photo' ? pull : 0, zoomP);

  const occ = p.occ ?? null;
  const occDelay = occ?.delay ?? 20;
  const occX = occ
    ? interpolate(
        frame,
        [occDelay, dur * 0.92],
        occ.side === 'l' ? [-1000, 2350] : [2350, -1000],
        CL
      )
    : 0;

  const miniAt = p.mini?.at ?? 99999;
  const miniS = spring({
    frame: Math.max(0, frame - miniAt),
    fps,
    config: {damping: 14, stiffness: 160},
  });

  const scanAt = p.scanAt ?? -99999;
  const scanP = interpolate(frame, [scanAt, scanAt + 56], [0, 1], {
    ...CL,
    easing: Easing.inOut(Easing.cubic),
  });
  const scanO = interpolate(frame, [scanAt, scanAt + 8], [0, 1], CL);

  const wordDelay = p.wordDelay ?? 8;
  const stagger = p.stagger ?? 7;
  const fontSize = p.fontSize ?? 92;

  return (
    <SceneShell dur={dur} enter={p.enter} exit={p.exit}>
      {/* L0 base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 720px at ${
            layout === 'right' ? '74% 42%' : layout === 'left' ? '26% 42%' : '50% 40%'
          }, #241408 0%, #140B05 48%, #090502 100%)`,
        }}
      />
      {/* L1 imagen profunda */}
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
      {/* L2 partículas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${camX * 0.5}px, ${camY * 0.5}px)`,
          zIndex: 2,
        }}
      >
        <Particles count={26} color="#F0C983" seed={`${p.seed}-p`} blur={1} opacity={0.7} />
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
            background: 'linear-gradient(180deg,#22150A,#150C05)',
            border: '1px solid rgba(227,169,78,0.35)',
            boxShadow: '0 44px 120px rgba(0,0,0,0.62), 0 0 90px rgba(227,169,78,0.14)',
          }}
        >
          <div style={{position: 'absolute', inset: 12, borderRadius: 14, overflow: 'hidden'}}>
            <Img
              src={p.img}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${interpolate(frame, [0, dur], [1.03, 1.16], CL)}) brightness(${
                  1 + zoomP * 0.12
                }) saturate(${sat})`,
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
                  'linear-gradient(180deg, rgba(10,5,2,0) 55%, rgba(10,5,2,0.55) 100%)',
              }}
            />
            {/* scan-line ANTES/DESPUÉS */}
            {p.scanAt != null ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: Math.max(0, scanP * (rect.width - 24) - 150),
                    width: 150,
                    background:
                      'linear-gradient(90deg, transparent, rgba(227,169,78,0.14))',
                    opacity: scanO,
                    zIndex: 4,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: scanP * (rect.width - 24),
                    width: 3,
                    background: `linear-gradient(180deg, rgba(227,169,78,0), ${GOLD} 25%, ${GOLD} 75%, rgba(227,169,78,0))`,
                    boxShadow: '0 0 26px rgba(227,169,78,0.8)',
                    opacity: scanO,
                    zIndex: 5,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 26,
                    bottom: 22,
                    fontFamily: FONT_LIGHT,
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: 5,
                    color: 'rgba(251,243,228,0.85)',
                    opacity: scanO * (1 - scanP * 0.35),
                    zIndex: 5,
                  }}
                >
                  ANTES
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: 26,
                    bottom: 22,
                    fontFamily: FONT_LIGHT,
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: 5,
                    color: GOLD,
                    opacity: interpolate(scanP, [0.55, 0.9], [0, 1], CL),
                    zIndex: 5,
                  }}
                >
                  DESPUÉS
                </div>
              </>
            ) : null}
          </div>
        </div>
        {p.tag ? (
          <Tag text={p.tag} at={p.tagAt ?? 24} boost={Math.max(pull, zoomP)} />
        ) : null}
      </div>
      {/* L4 bokeh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${camX * 1.35}px, ${camY * 1.35}px)`,
          zIndex: 4,
        }}
      >
        <Bokeh seed={`${p.seed}-b`} par={1} />
      </div>
      {/* L5 silueta que OCLUYE */}
      {occ ? (
        <div
          style={{
            position: 'absolute',
            left: occX + camX * 1.7,
            bottom: -80,
            filter: `blur(${occBlur}px)`,
            opacity: 0.97,
            zIndex: 5,
          }}
        >
          {occ.variant === 'profile' ? (
            <Profile
              height={layout === 'center' ? 1140 : 1040}
              color="#070402"
              flip={occ.side === 'l'}
            />
          ) : occ.variant === 'sprig' ? (
            <Sprig height={1150} color="#040201" flip={occ.side === 'r'} />
          ) : (
            <Bust height={layout === 'center' ? 1120 : 1010} color="#070402" />
          )}
        </div>
      ) : null}
      {/* ramas cruzadas extra: más planos de oclusión */}
      {p.sprigCross ? (
        <>
          <div
            style={{
              position: 'absolute',
              left:
                interpolate(frame, [0, dur], [-500, 2300], CL) + camX * 1.5,
              bottom: -40,
              filter: 'blur(8px)',
              opacity: 0.9,
              zIndex: 5,
            }}
          >
            <Sprig height={820} color="#050301" />
          </div>
          <div
            style={{
              position: 'absolute',
              left:
                interpolate(frame, [dur * 0.25, dur], [2300, -500], CL) + camX * 1.9,
              bottom: -120,
              filter: 'blur(11px)',
              opacity: 0.85,
              zIndex: 5,
            }}
          >
            <Sprig height={980} color="#030201" flip />
          </div>
        </>
      ) : null}
      {/* L6 dim */}
      <AbsoluteFill
        style={{
          background: '#080401',
          opacity: (p.dim ?? 0) + (pullTarget === 'photo' ? pull * 0.15 : 0),
          zIndex: 6,
        }}
      />
      {/* mini-polaroid secundario (plano extra) */}
      {p.mini ? (
        <div
          style={{
            position: 'absolute',
            ...(layout === 'right'
              ? {left: 170}
              : layout === 'left'
              ? {right: 170}
              : {right: 240}),
            top: layout === 'center' ? 170 : 636,
            width: 302,
            height: 216,
            transform: `translate(${camX * 1.25}px, ${
              camY * 1.25 + Math.sin(frame / 25) * 8
            }px) rotate(${layout === 'left' ? -7 : 7}deg) scale(${miniS})`,
            filter: `blur(${1.5 + (pullTarget === 'photo' ? pull * 5 : 0)}px)`,
            zIndex: 7,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: 9,
              borderRadius: 15,
              background: 'linear-gradient(180deg,#22150A,#150C05)',
              border: '1px solid rgba(227,169,78,0.35)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(227,169,78,0.16)',
              overflow: 'hidden',
            }}
          >
            <Img
              src={p.mini.img}
              style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9}}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 226,
              textAlign: 'center',
              fontFamily: FONT_LIGHT,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 4,
              color: GOLD,
            }}
          >
            {p.mini.caption}
          </div>
        </div>
      ) : null}
      {/* niebla cálida (vapor del ritual) */}
      {p.mist ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camX * 1.1}px, ${camY * 1.1}px)`,
            zIndex: 7,
          }}
        >
          <Mist seed={`${p.seed}-m`} par={1} />
        </div>
      ) : null}
      <FocusBrackets
        left={rect.left}
        top={rect.top}
        width={rect.width}
        height={rect.height}
        amt={bracketAmt}
      />
      {/* L7 texto */}
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
              'linear-gradient(180deg, rgba(227,169,78,0), rgba(227,169,78,0.42))',
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
        border: '3px solid rgba(227,169,78,0.9)',
        transform: `scale(${s})`,
        opacity: o,
        boxShadow: '0 0 60px rgba(227,169,78,0.4)',
        zIndex: 7,
      }}
    />
  );
};

const NumberPunch: React.FC<{
  seed: string;
  img: string;
  enter: Enter;
  exit: Exit;
  dur: number;
  kicker?: string;
  from?: number;
  to?: number;
  format?: 'usd' | 'pct';
  countStart?: number;
  countEnd?: number;
  finalText?: string;
  subline?: string;
  subAt?: number;
  subGold?: boolean;
  foot?: string;
  sideImg?: string;
  side?: 'left' | 'right';
  sideCaption?: string;
  occSprig?: boolean;
  mist?: boolean;
}> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = p.dur;
  const hasCount = p.finalText == null;
  const cs = p.countStart ?? 14;
  const ce = p.countEnd ?? 70;
  const from = p.from ?? 0;
  const to = p.to ?? 100;

  const val = hasCount
    ? interpolate(frame, [cs, ce], [from, to], {...CL, easing: Easing.out(Easing.cubic)})
    : 0;
  const shown = hasCount
    ? p.format === 'pct'
      ? `${Math.round(val)}%`
      : `$${Math.round(val).toLocaleString('en-US')}`
    : p.finalText ?? '';
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
  const fs = p.finalText
    ? p.finalText.length > 13
      ? 118
      : 150
    : p.format === 'pct'
    ? 250
    : shown.length >= 10
    ? 168
    : 196;

  const sideS = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: {damping: 14, stiffness: 160},
  });
  const subAt = p.subAt ?? 70;
  const subWords = (p.subline ?? '').split(' ').filter(Boolean);
  const footO = interpolate(frame, [subAt + 14, subAt + 26], [0, 1], CL);

  return (
    <SceneShell dur={dur} enter={p.enter} exit={p.exit}>
      <AbsoluteFill style={{background: '#120B05'}} />
      <AbsoluteFill
        style={{
          transform: `scale(${1.3 + (camS - 1) * 0.5}) translate(${camX * 0.3}px, ${
            camY * 0.3
          }px)`,
          filter: 'blur(24px) brightness(0.42) saturate(0.9)',
          zIndex: 1,
        }}
      >
        <Img src={p.img} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 900px 560px at 50% 55%, rgba(227,169,78,0.20), rgba(227,169,78,0) 60%)',
          transform: `scale(${1 + lockP * 0.18})`,
          zIndex: 2,
        }}
      />
      <Rays count={22} rot={frame * 0.12} scale={1 + lockP * 0.1} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${camX * 0.7}px, ${camY * 0.7}px)`,
          zIndex: 3,
        }}
      >
        <Particles count={34} color={GOLD} seed={`${p.seed}-n`} speed={1.4} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${camX * 1.3}px, ${camY * 1.3}px)`,
          zIndex: 3,
        }}
      >
        <Bokeh seed={`${p.seed}-b`} par={1} />
      </div>
      {p.mist ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camX * 1.1}px, ${camY * 1.1}px)`,
            zIndex: 4,
          }}
        >
          <Mist seed={`${p.seed}-m`} par={1} />
        </div>
      ) : null}
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
              background: 'linear-gradient(180deg,#22150A,#150C05)',
              border: '1px solid rgba(227,169,78,0.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(227,169,78,0.16)',
              overflow: 'hidden',
            }}
          >
            <Img
              src={p.sideImg}
              style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10}}
            />
          </div>
          {p.sideCaption ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 252,
                textAlign: 'center',
                fontFamily: FONT_LIGHT,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 4,
                color: GOLD,
                opacity: Math.min(1, sideS * 1.5),
              }}
            >
              {p.sideCaption}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* ramas de romero que ocluyen el número */}
      {p.occSprig ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: interpolate(frame, [0, dur], [-420, 2200], CL) + camX * 1.6,
              bottom: -30,
              filter: 'blur(9px)',
              opacity: 0.9,
              zIndex: 7,
            }}
          >
            <Sprig height={760} color="#050301" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: interpolate(frame, [dur * 0.3, dur], [2200, -480], CL) + camX * 2,
              bottom: -90,
              filter: 'blur(12px)',
              opacity: 0.8,
              zIndex: 7,
            }}
          >
            <Sprig height={920} color="#030201" flip />
          </div>
        </>
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
            filter: `drop-shadow(0 12px 60px rgba(227,169,78,0.38)) blur(${inInv * 16}px)`,
          }}
        >
          {shown}
        </div>
        {p.subline ? (
          <div
            style={{
              filter: p.subGold
                ? 'drop-shadow(0 6px 30px rgba(227,169,78,0.35))'
                : undefined,
            }}
          >
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
      {p.foot ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 190,
            textAlign: 'center',
            fontFamily: FONT_LIGHT,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 4,
            color: 'rgba(251,243,228,0.42)',
            opacity: footO,
            zIndex: 8,
          }}
        >
          {p.foot}
        </div>
      ) : null}
    </SceneShell>
  );
};

/* ==================== NIVEL 3: SPLIT COMPARE ====================== */

const SplitCompare: React.FC<{
  leftImg: string;
  rightImg: string;
  leftKicker: string;
  rightKicker: string;
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
    kicker: string;
    title: string[];
    sub: string[];
    side: 'l' | 'r';
    enterV: number;
    delay: number;
  }) => {
    const isL = cfg.side === 'l';
    const enterX = inv(cfg.enterV) * (isL ? -1150 : 1150);
    const enterB = inv(cfg.enterV) * 16;
    const sat = isL ? 0.32 : 1.05;
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
            ? '1px solid rgba(251,243,228,0.10)'
            : `1px solid rgba(227,169,78,${0.25 + glow * 0.5})`,
          boxShadow: isL
            ? '0 40px 100px rgba(0,0,0,0.55)'
            : `0 40px 100px rgba(0,0,0,0.55), 0 0 ${110 * glow}px rgba(227,169,78,${
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
              'linear-gradient(180deg, rgba(10,5,2,0.15) 30%, rgba(10,5,2,0.88) 100%)',
          }}
        />
        <div style={{position: 'absolute', left: 44, bottom: 40, right: 40}}>
          <div
            style={{
              fontFamily: FONT_LIGHT,
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 6,
              color: isL ? 'rgba(251,243,228,0.45)' : GOLD,
              marginBottom: 14,
            }}
          >
            {cfg.kicker}
          </div>
          <div style={{marginBottom: 14}}>
            {cfg.title.map((w, i) => (
              <Word
                key={w + i}
                text={w}
                delay={cfg.delay + i * 5}
                fontSize={62}
                gold={!isL && rightGoldSet.has(w)}
              />
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
            'radial-gradient(1100px 700px at 50% 45%, #1B1007 0%, #120B05 55%, #080401 100%)',
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
        {panel({
          img: p.leftImg,
          kicker: p.leftKicker,
          title: p.leftTitle,
          sub: p.leftSub,
          side: 'l',
          enterV: inL,
          delay: 12,
        })}
        <div style={{width: 40}} />
        {panel({
          img: p.rightImg,
          kicker: p.rightKicker,
          title: p.rightTitle,
          sub: p.rightSub,
          side: 'r',
          enterV: inR,
          delay: 16,
        })}
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
          background: `linear-gradient(180deg, rgba(227,169,78,0), ${GOLD} 30%, ${COPPER} 70%, rgba(227,169,78,0))`,
          boxShadow: '0 0 40px rgba(227,169,78,0.55)',
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
          border: `2px solid rgba(227,169,78,0.85)`,
          background: 'rgba(10,5,2,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${-380 * pan}px) scale(${vsS * (1 + pan * 0.15)}) rotate(${
            Math.sin(frame / 50) * 4
          }deg)`,
          boxShadow: '0 0 50px rgba(227,169,78,0.35)',
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
        background: '#050201',
        boxShadow: '0 1px 0 rgba(227,169,78,0.18)',
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
        background: '#050201',
        boxShadow: '0 -1px 0 rgba(227,169,78,0.18)',
        zIndex: 60,
      }}
    />
  </>
);

const Brand: React.FC<{tag: string}> = ({tag}) => (
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
          color: 'rgba(251,243,228,0.5)',
        }}
      >
        DR. FEDERER · PIEL JOVEN
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
        color: 'rgba(251,243,228,0.35)',
        zIndex: 55,
      }}
    >
      {tag}
    </div>
  </>
);

const Progress: React.FC<{dur: number}> = ({dur}) => {
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
        background: 'rgba(251,243,228,0.10)',
        zIndex: 55,
      }}
    >
      <div
        style={{
          width: `${(frame / (dur - 1)) * 100}%`,
          height: '100%',
          borderRadius: 2,
          background: `linear-gradient(90deg,${GOLD},${COPPER})`,
          boxShadow: '0 0 16px rgba(227,169,78,0.6)',
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
        background: '#050201',
        opacity: interpolate(frame, [0, 10], [from, to], CL),
        zIndex: 58,
      }}
    />
  );
};

const ReelFrame: React.FC<{dur: number; tag: string; children: React.ReactNode}> = ({
  dur,
  tag,
  children,
}) => (
  <AbsoluteFill style={{background: '#090502'}}>
    {children}
    <Grain />
    <Vignette />
    <Sequence durationInFrames={10}>
      <Fade from={1} to={0} />
    </Sequence>
    <Sequence from={dur - 10} durationInFrames={10}>
      <Fade from={0} to={1} />
    </Sequence>
    <Brand tag={tag} />
    <Progress dur={dur} />
    <Letterbox />
  </AbsoluteFill>
);

/* ===================== ESCENAS (contenido) ======================== */

const HeroScene: React.FC<{dur: number; enter: Enter; exit: Exit; img: string; mini: string}> = ({
  dur,
  enter,
  exit,
  img,
  mini,
}) => (
  <DepthScene
    seed="hero"
    img={img}
    kicker="MÉTODO PIEL JOVEN"
    words={['TU', 'PIEL', 'NO', 'ENVEJECIÓ.']}
    goldWords={['NO']}
    layout="right"
    enter={enter}
    exit={exit}
    dur={dur}
    tag="PIEL +40"
    tagAt={30}
    pulls={[96]}
    pullTarget="photo"
    occ={{variant: 'profile', side: 'l', delay: 18}}
    sprigCross
    mini={{img: mini, at: 54, caption: 'COLÁGENO NATURAL'}}
    mist
    dim={0.16}
    sat={0.95}
    fontSize={96}
    wordDelay={10}
    stagger={9}
    sub={{text: 'PERDIÓ SU RITUAL.', at: 118}}
  />
);

const ActivoScene: React.FC<{dur: number; enter: Enter; exit: Exit; img: string; mini: string}> = ({
  dur,
  enter,
  exit,
  img,
  mini,
}) => (
  <DepthScene
    seed="activo"
    img={img}
    kicker="EL ACTIVO OLVIDADO"
    words={['ROMERO.', 'EL', 'COLÁGENO', 'DE', 'LAS', 'ABUELAS.']}
    goldWords={['ROMERO.', 'COLÁGENO']}
    layout="left"
    enter={enter}
    exit={exit}
    dur={dur}
    tag="100% NATURAL"
    tagAt={28}
    zoomAt={74}
    pulls={[100]}
    pullTarget="photo"
    occ={{variant: 'sprig', side: 'l', delay: 8}}
    mini={{img: mini, at: 52, caption: 'MACERADO · 21 DÍAS'}}
    dim={0.2}
    sat={1.05}
    fontSize={84}
    wordDelay={8}
    stagger={8}
    sub={{text: 'LO TENÍAS EN TU COCINA.', at: 116}}
  />
);

const VersusScene: React.FC<{dur: number; exit: Exit; left: string; right: string}> = ({
  dur,
  exit,
  left,
  right,
}) => (
  <SplitCompare
    leftImg={left}
    rightImg={right}
    leftKicker="LO DE SIEMPRE"
    rightKicker="EL MÉTODO"
    leftTitle={['CREMA', 'COMÚN']}
    rightTitle={['MÉTODO', 'PIEL', 'JOVEN']}
    leftSub={['TAPA.', 'PERFUME.', 'PROMETE.']}
    rightSub={['ACTIVA', 'TU', 'PROPIO', 'COLÁGENO.']}
    rightGold={['COLÁGENO.']}
    panAt={Math.round(dur * 0.46)}
    dur={dur}
    exit={exit}
  />
);

const DatoScene: React.FC<{dur: number; enter: Enter; exit: Exit; bg: string; side: string}> = ({
  dur,
  enter,
  exit,
  bg,
  side,
}) => (
  <NumberPunch
    seed="dato"
    img={bg}
    enter={enter}
    exit={exit}
    dur={dur}
    kicker="EN 21 DÍAS DE RITUAL"
    from={0}
    to={87}
    format="pct"
    countStart={16}
    countEnd={66}
    subline="MÁS FIRMEZA PERCIBIDA."
    subAt={74}
    subGold
    foot="*AUTOEVALUACIÓN · 214 ALUMNAS DEL MÉTODO"
    sideImg={side}
    side="right"
    sideCaption="ANTES / DESPUÉS"
    occSprig
    mist
  />
);

const PruebaScene: React.FC<{dur: number; enter: Enter; exit: Exit; img: string}> = ({
  dur,
  enter,
  exit,
  img,
}) => (
  <DepthScene
    seed="prueba"
    img={img}
    kicker="LA PRUEBA, NO LA PROMESA"
    words={['MISMA', 'CARA.', 'MISMA', 'LUZ.']}
    layout="center"
    enter={enter}
    exit={exit}
    dur={dur}
    tag="SIN FILTROS"
    tagAt={26}
    scanAt={62}
    pulls={[62]}
    pullTarget="photo"
    occ={{variant: 'bust', side: 'r', delay: 6}}
    mist
    dim={0.34}
    sat={1}
    fontSize={84}
    wordDelay={8}
    stagger={8}
    sub={{text: '21 DÍAS DESPUÉS.', at: 104}}
  />
);

const CtaScene: React.FC<{dur: number; enter: Enter; exit: Exit; bg: string; side: string}> = ({
  dur,
  enter,
  exit,
  bg,
  side,
}) => (
  <NumberPunch
    seed="cta"
    img={bg}
    enter={enter}
    exit={exit}
    dur={dur}
    kicker="LA GUÍA ES GRATIS"
    finalText="COMENTÁ: ROMERO"
    subline="TE LA MANDO CON EL RITUAL DE HIELO."
    subAt={16}
    subGold
    foot="DR. FEDERER · MÉTODO PIEL JOVEN"
    sideImg={side}
    side="left"
    sideCaption="RITUAL DE HIELO"
    occSprig
    mist
  />
);

/* ================= COMPOSITIONS INDIVIDUALES ====================== */

export const FedXHero: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_HERO} tag="EL PROBLEMA — 01">
    <HeroScene dur={D_HERO} enter="zoom" exit="toL" img={p.piel} mini={p.colageno} />
  </ReelFrame>
);

export const FedXActivo: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_ACTIVO} tag="EL ACTIVO — 02">
    <ActivoScene dur={D_ACTIVO} enter="fromR" exit="toL" img={p.romero} mini={p.aceite} />
  </ReelFrame>
);

export const FedXVersus: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_VERSUS} tag="EL VERSUS — 03">
    <VersusScene dur={D_VERSUS} exit="zoomOut" left={p.crema} right={p.vapor} />
  </ReelFrame>
);

export const FedXDato: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_DATO} tag="EL DATO — 04">
    <DatoScene dur={D_DATO} enter="zoom" exit="zoomOut" bg={p.vapor} side={p.antes} />
  </ReelFrame>
);

export const FedXPrueba: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_PRUEBA} tag="LA PRUEBA — 05">
    <PruebaScene dur={D_PRUEBA} enter="fromL" exit="toL" img={p.antes} />
  </ReelFrame>
);

export const FedXCta: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_CTA} tag="LA GUÍA — 06">
    <CtaScene dur={D_CTA} enter="zoom" exit="none" bg={p.crema} side={p.cubito} />
  </ReelFrame>
);

/* ========================== REEL COMPLETO ========================= */

export const FedXReel: React.FC<FedXProps> = (p) => (
  <ReelFrame dur={D_REEL} tag="MÉTODO PIEL JOVEN">
    <Series>
      <Series.Sequence durationInFrames={D_HERO}>
        <HeroScene dur={D_HERO} enter="zoom" exit="toL" img={p.piel} mini={p.colageno} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={D_ACTIVO} offset={-OV}>
        <ActivoScene dur={D_ACTIVO} enter="fromR" exit="toL" img={p.romero} mini={p.aceite} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={D_VERSUS} offset={-OV}>
        <VersusScene dur={D_VERSUS} exit="toR" left={p.crema} right={p.vapor} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={D_DATO} offset={-OV}>
        <DatoScene dur={D_DATO} enter="zoom" exit="zoomOut" bg={p.vapor} side={p.antes} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={D_PRUEBA} offset={-OV}>
        <PruebaScene dur={D_PRUEBA} enter="fromL" exit="toL" img={p.antes} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={D_CTA} offset={-OV}>
        <CtaScene dur={D_CTA} enter="zoom" exit="none" bg={p.crema} side={p.cubito} />
      </Series.Sequence>
    </Series>
  </ReelFrame>
);

/* ========================== REGISTRO ============================== */

export const RemotionRoot: React.FC = () => {
  const med: FedXProps = {
    romero: staticFile('med/romero.png'),
    piel: staticFile('med/piel.png'),
    aceite: staticFile('med/aceite.png'),
    vapor: staticFile('med/vapor.png'),
    cubito: staticFile('med/cubito.png'),
    colageno: staticFile('med/colageno.png'),
    crema: staticFile('med/crema.png'),
    antes: staticFile('med/antes_despues.png'),
  };
  return (
    <>
      <Composition
        id="FedX-Hero"
        component={FedXHero}
        durationInFrames={D_HERO}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-Activo"
        component={FedXActivo}
        durationInFrames={D_ACTIVO}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-Versus"
        component={FedXVersus}
        durationInFrames={D_VERSUS}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-Dato"
        component={FedXDato}
        durationInFrames={D_DATO}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-Prueba"
        component={FedXPrueba}
        durationInFrames={D_PRUEBA}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-CTA"
        component={FedXCta}
        durationInFrames={D_CTA}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
      <Composition
        id="FedX-Reel"
        component={FedXReel}
        durationInFrames={D_REEL}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={med}
      />
    </>
  );
};

registerRoot(RemotionRoot);
