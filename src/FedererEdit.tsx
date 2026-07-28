/**
 * ============================================================================
 *  DR. FEDERER — "EL PODER REJUVENECEDOR DEL ROMERO" · Edición PRO en Remotion 4.x
 *  ----------------------------------------------------------------------------
 *  · Data-driven: TODO sale del array BEATS (startSec/endSec/kind/avatarPos/payload)
 *  · Los segundos se mapean a frames proporcionalmente a `durationInFrames`
 *    (rellená los tiempos reales de la transcripción y ajustá durationInFrames).
 *  · Avatar REAL (consultorio) con OffthreadVideo: full / left / right / corner(PiP) / hidden
 *  · CSS 3D real (perspective / preserve-3d / translateZ), glassmorphism, grano,
 *    viñeta, partículas botánicas, rack focus, whips encadenados sin cortes secos.
 *  · 100% determinista: random() de remotion, springs con fps real, clamp en todo.
 * ============================================================================
 */
import React from 'react';
import {
  AbsoluteFill, Composition, Easing, Img, OffthreadVideo, Sequence,
  interpolate, random, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

/* ============================== DESIGN SYSTEM ============================== */
const C = {
  cream: '#F6EFE2', cream2: '#EFE4CF', white: '#FDFBF6',
  ink: '#21302A', pine: '#1E3A2B', moss: '#2F5D3E', sage: '#7A9B76',
  gold: '#C9A24B', goldL: '#E7C87E', copper: '#B26A2E', terra: '#A5552B',
};
const SERIF = 'Georgia, "Palatino Linotype", "Book Antiqua", serif';
const SANS = '"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif';
const css = (o: any) => o as React.CSSProperties;
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eo = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const sm = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const spr = (f: number, d: number, fps: number, cfg?: any) =>
  spring({frame: Math.max(0, f - d), fps, config: {damping: 200, stiffness: 120, ...(cfg || {})}});

/* ============================== TIPOS + BEATS ============================== */
type AvatarPos = 'full' | 'left' | 'right' | 'corner' | 'hidden';
type Beat = { id: string; startSec: number; endSec: number; kind: string; tag: string; avatarPos?: AvatarPos; payload?: any };
type Assets = { romero: string; piel: string; aceite: string; vapor: string; cubito: string; colageno: string; crema: string; antes: string };

export const BEATS: Beat[] = [
  {id: 'hook',    startSec: 0,    endSec: 21,   kind: 'hook',    tag: 'INTRO',      avatarPos: 'full'},
  {id: 'reveal',  startSec: 21,   endSec: 33,   kind: 'reveal',  tag: 'INTRO',      avatarPos: 'full'},
  {id: 'science', startSec: 33,   endSec: 38.2, kind: 'chapter', tag: 'LA CIENCIA', avatarPos: 'hidden', payload: {num: '', title: 'LO QUE LA CIENCIA ENCONTRÓ', sub: 'Décadas de estudio en una simple ramita', img: 'colageno'}},
];

/* ============================== ÁTOMOS: TEXTURA ============================ */
const Noise: React.FC<{op?: number}> = ({op = 0.05}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: op, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <filter id="nzf"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter="url(#nzf)" />
  </svg>
);
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const jx = (f % 3) - 1, jy = ((f + 1) % 3) - 1;
  return <AbsoluteFill style={{transform: `translate(${jx * 2}px, ${jy * 2}px)`, pointerEvents: 'none', zIndex: 90}}><Noise op={0.055} /></AbsoluteFill>;
};
const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 45%, transparent 55%, rgba(16,28,20,.4) 100%)', pointerEvents: 'none', zIndex: 91}} />
);
const FrameEdge: React.FC = () => (
  <AbsoluteFill style={{border: '2px solid rgba(201,162,75,.28)', pointerEvents: 'none', zIndex: 92}} />
);
const Scrim: React.FC<{x: number; y: number; w: number; h: number; op?: number}> = ({x, y, w, h, op = 0.55}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 40, background: `radial-gradient(ellipse at 50% 50%, rgba(18,34,24,${op}), rgba(18,34,24,0) 72%)`, filter: 'blur(18px)', pointerEvents: 'none'}} />
);
const darkGlass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(24,42,30,.78), rgba(24,42,30,.58))',
  backdropFilter: 'blur(12px)', border: '1.5px solid rgba(231,200,126,.45)', borderRadius: 22,
  boxShadow: '0 24px 60px -18px rgba(10,25,15,.55), inset 0 1px 0 rgba(255,255,255,.15)', color: C.cream,
};
const lightGlass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(253,251,245,.94), rgba(242,233,216,.88))',
  backdropFilter: 'blur(10px)', border: '1.5px solid rgba(201,162,75,.6)', borderRadius: 22,
  boxShadow: '0 26px 60px -20px rgba(25,45,32,.45), inset 0 1px 0 rgba(255,255,255,.9)', color: C.ink,
};

/* ============================== ÁTOMOS: ICONOS SVG ========================= */
type Ico = { size?: number; color?: string; style?: React.CSSProperties };
const LeafSVG: React.FC<Ico> = ({size = 48, color = C.moss, style}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
    <path d="M32 5 C14 17 11 41 32 59 C53 41 50 17 32 5 Z" fill={color} opacity=".22" />
    <path d="M32 5 C14 17 11 41 32 59 C53 41 50 17 32 5 Z" fill="none" stroke={color} strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M32 13 V51 M32 24 L23 19 M32 24 L41 19 M32 36 L22 30 M32 36 L42 30" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
);
const RosemarySVG: React.FC<{h?: number}> = ({h = 300}) => {
  const uid = React.useId().replace(/:/g, '');
  const levels = [26, 54, 82, 110, 138, 166, 194, 222, 250];
  return (
    <svg width={h * 0.4} height={h} viewBox="0 0 120 300">
      <defs><linearGradient id={`st${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3E7350" /><stop offset="1" stopColor="#23402E" /></linearGradient></defs>
      <path d="M60 8 C55 90 66 200 60 294" stroke={`url(#st${uid})`} strokeWidth="6" fill="none" strokeLinecap="round" />
      {levels.map((y, i) => (
        <g key={i} stroke={i % 2 ? '#2F5D3E' : '#7A9B76'} strokeWidth="4.6" strokeLinecap="round" fill="none">
          <path d={`M60 ${y} Q 40 ${y - 8} 22 ${y - 24}`} /><path d={`M60 ${y} Q 80 ${y - 8} 98 ${y - 24}`} />
          <path d={`M60 ${y + 10} Q 44 ${y + 4} 30 ${y - 8}`} opacity=".7" /><path d={`M60 ${y + 10} Q 76 ${y + 4} 90 ${y - 8}`} opacity=".7" />
        </g>
      ))}
      <path d="M60 8 Q 48 2 40 -4 M60 8 Q 72 2 80 -4" stroke="#3E7350" strokeWidth="4" fill="none" strokeLinecap="round" transform="translate(0 8)" />
    </svg>
  );
};
const DropSVG: React.FC<Ico> = ({size = 48, style}) => {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <defs><radialGradient id={`dr${uid}`} cx=".35" cy=".3" r="1"><stop offset="0" stopColor="#F3DCA2" /><stop offset=".6" stopColor="#C9A24B" /><stop offset="1" stopColor="#8F6420" /></radialGradient></defs>
      <path d="M32 4 C44 23 53 33 53 45 a21 21 0 1 1 -42 0 C11 33 20 23 32 4 Z" fill={`url(#dr${uid})`} />
      <ellipse cx="25" cy="40" rx="5" ry="8" fill="#FFF7E0" opacity=".55" transform="rotate(-18 25 40)" />
    </svg>
  );
};
const FlaskSVG: React.FC<Ico> = ({size = 56, color = C.moss}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M26 6 h12 v10 c8 3 14 11 14 21 a20 20 0 1 1 -40 0 c0 -10 6 -18 14 -21 Z" fill="none" stroke={color} strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M14 38 q6 -5 12 0 t12 0 t12 0 V44 a16 14 0 0 1 -32 0 Z" fill={color} opacity=".28" />
    <path d="M24 6 h16" stroke={C.copper} strokeWidth="5" strokeLinecap="round" />
  </svg>
);
const SteamSVG: React.FC<Ico> = ({size = 56, color = C.copper}) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M10 46 h44 a22 12 0 0 1 -44 0 Z" fill="none" stroke={color} strokeWidth="3.4" />
      {[18, 30, 42].map((x, i) => {
        const t = ((f * 1.1 + i * 16) % 34) / 34;
        return <path key={i} d={`M${x} 40 q6 -7 0 -14 q-6 -7 0 -14`} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" opacity={1 - t} transform={`translate(0 ${-t * 10})`} />;
      })}
    </svg>
  );
};
const IceSVG: React.FC<Ico> = ({size = 56, color = '#5E8C8A'}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="8" y="10" width="48" height="44" rx="10" fill={color} opacity=".2" />
    <rect x="8" y="10" width="48" height="44" rx="10" fill="none" stroke={color} strokeWidth="3.4" />
    <path d="M16 40 L28 26 L38 34 M30 48 L40 38 M20 22 L26 28" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <path d="M14 16 q10 -4 18 0" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity=".7" fill="none" />
  </svg>
);
const SunSVG: React.FC<Ico> = ({size = 52, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="12" fill="none" stroke={color} strokeWidth="3.6" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line key={a} x1="32" y1="8" x2="32" y2="16" stroke={color} strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${a} 32 32)`} />
    ))}
  </svg>
);
const MoonSVG: React.FC<Ico> = ({size = 52, color = C.pine}) => (
  <svg width={size} height={size} viewBox="0 0 64 64"><path d="M42 8 A24 24 0 1 0 42 56 A19 19 0 1 1 42 8 Z" fill="none" stroke={color} strokeWidth="3.4" strokeLinejoin="round" /></svg>
);
const ShieldSVG: React.FC<Ico> = ({size = 52, color = C.moss}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 4 L55 13 V32 C55 48 45 56 32 61 C19 56 9 48 9 32 V13 Z" fill={color} opacity=".16" />
    <path d="M32 4 L55 13 V32 C55 48 45 56 32 61 C19 56 9 48 9 32 V13 Z" fill="none" stroke={color} strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M32 20 C25 26 24 37 32 45 C40 37 39 26 32 20 Z" fill="none" stroke={color} strokeWidth="2.6" />
  </svg>
);
const FlameSVG: React.FC<Ico> = ({size = 52, color = C.terra}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 C38 16 48 22 48 36 a16 16 0 1 1 -32 0 C16 26 24 22 26 12 c3 4 5 6 6 -6 Z" fill={color} opacity=".2" />
    <path d="M32 6 C38 16 48 22 48 36 a16 16 0 1 1 -32 0 C16 26 24 22 26 12 c3 4 5 6 6 -6 Z" fill="none" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
  </svg>
);
const RadicalSVG: React.FC<Ico> = ({size = 52, color = C.copper}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="8" fill={color} opacity=".3" /><circle cx="32" cy="32" r="8" fill="none" stroke={color} strokeWidth="3" />
    <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke={color} strokeWidth="2.4" transform="rotate(30 32 32)" />
    <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke={color} strokeWidth="2.4" transform="rotate(-40 32 32)" />
    <path d="M54 8 l3 5 M58 18 l5 2 M8 50 l4 3" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
const PulseSVG: React.FC<Ico> = ({size = 52, color = C.moss}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="3" opacity=".4" />
    <path d="M10 34 h10 l5 -12 l8 22 l6 -14 h15" fill="none" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CrossSVG: React.FC<Ico> = ({size = 52, color = C.copper}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="27" fill="none" stroke={color} strokeWidth="3.4" />
    <path d="M32 20 v24 M20 32 h24" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
const BacteriaSVG: React.FC<Ico> = ({size = 52, color = C.sage}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="14" y="24" width="36" height="16" rx="8" fill="none" stroke={color} strokeWidth="3.2" transform="rotate(-18 32 32)" />
    <circle cx="26" cy="32" r="2.6" fill={color} /><circle cx="36" cy="29" r="2.6" fill={color} />
    <path d="M50 20 q6 -6 10 -4 M12 44 q-6 6 -10 4" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M10 12 L54 52" stroke={C.terra} strokeWidth="4.4" strokeLinecap="round" />
  </svg>
);
const BandageSVG: React.FC<Ico> = ({size = 52, color = C.copper}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="8" y="22" width="48" height="20" rx="10" fill="none" stroke={color} strokeWidth="3.2" transform="rotate(-14 32 32)" />
    <circle cx="26" cy="30" r="1.8" fill={color} /><circle cx="33" cy="28" r="1.8" fill={color} /><circle cx="40" cy="26" r="1.8" fill={color} />
  </svg>
);
const ClockSVG: React.FC<Ico> = ({size = 52, color = C.moss}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="25" fill="none" stroke={color} strokeWidth="3.4" />
    <path d="M32 18 v14 l10 6" stroke={color} strokeWidth="3.6" strokeLinecap="round" fill="none" />
  </svg>
);
const HeartSVG: React.FC<Ico> = ({size = 52, color = C.terra}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 54 C12 40 8 26 16 18 c6 -6 14 -4 16 2 c2 -6 10 -8 16 -2 c8 8 4 22 -16 36 Z" fill="none" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
  </svg>
);
const BookSVG: React.FC<Ico> = ({size = 52, color = C.pine}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M12 8 h30 a10 10 0 0 1 10 10 v38 h-30 a10 10 0 0 1 -10 -10 Z" fill="none" stroke={color} strokeWidth="3.4" />
    <path d="M12 46 a10 10 0 0 1 10 -10 h30" fill="none" stroke={color} strokeWidth="3" />
    <path d="M32 22 c-6 4 -7 12 0 17 c7 -5 6 -13 0 -17 Z" fill={C.gold} opacity=".85" />
  </svg>
);
const CheckDraw: React.FC<{size?: number; delay?: number; color?: string}> = ({size = 44, delay = 0, color = C.moss}) => {
  const f = useCurrentFrame();
  const p1 = eo((f - delay) / 14), p2 = eo((f - delay - 10) / 12);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p1} strokeLinecap="round" />
      <path d="M20 34 l9 9 l17 -20" fill="none" stroke={C.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} />
    </svg>
  );
};
const MoleculeSVG: React.FC<{size?: number; accent?: string}> = ({size = 130, accent = C.goldL}) => {
  const f = useCurrentFrame();
  const pts = [0, 60, 120, 180, 240, 300].map((a) => { const r = (a * Math.PI) / 180; return [70 + 46 * Math.cos(r), 70 + 46 * Math.sin(r)]; });
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" style={{transform: `rotate(${Math.sin(f / 40) * 3}deg)`}}>
      <defs><radialGradient id={`at${accent.replace('#', '')}`} cx=".35" cy=".3" r="1"><stop offset="0" stopColor="#FFF6E2" /><stop offset="1" stopColor={accent} /></radialGradient></defs>
      {pts.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={pts[(i + 1) % 6][0]} y2={pts[(i + 1) % 6][1]} stroke={accent} strokeWidth="3" opacity=".85" />)}
      <circle cx="70" cy="70" r="26" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="4 5" opacity=".6" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i % 2 ? 9 : 12} fill={`url(#at${accent.replace('#', '')})`} stroke="#7A5A1E" strokeWidth="1.5" />)}
      <text x={pts[1][0] + 8} y={pts[1][1] - 10} fontSize="15" fill={accent} fontFamily={SANS} fontWeight="700">OH</text>
      <text x={pts[4][0] - 34} y={pts[4][1] + 26} fontSize="15" fill={accent} fontFamily={SANS} fontWeight="700">O</text>
    </svg>
  );
};

/* ======================== DIBUJOS A MANO (subrayado/flecha/círculo) ======== */
const Underline: React.FC<{w?: number; color?: string; delay?: number; dur?: number; sw?: number}> = ({w = 220, color = C.gold, delay = 0, dur = 16, sw = 5}) => {
  const f = useCurrentFrame();
  const p = eo((f - delay) / dur);
  return (
    <svg width={w} height={16} viewBox={`0 0 ${w} 16`} style={{display: 'block', overflow: 'visible'}}>
      <path d={`M3 10 C ${w * 0.3} 3, ${w * 0.62} 16, ${w - 3} 8`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity=".92" />
    </svg>
  );
};
const CircleDraw: React.FC<{w: number; h: number; color?: string; delay?: number; style?: React.CSSProperties}> = ({w, h, color = C.gold, delay = 0, style}) => {
  const f = useCurrentFrame();
  const p = eo((f - delay) / 20);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', overflow: 'visible', transform: 'rotate(-2deg)', ...style}}>
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 6} ry={h / 2 - 6} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity=".9" />
    </svg>
  );
};
const ArrowHand: React.FC<{delay?: number; color?: string; flip?: boolean; w?: number; style?: React.CSSProperties}> = ({delay = 0, color = C.copper, flip = false, w = 130, style}) => {
  const f = useCurrentFrame();
  const p = eo((f - delay) / 16);
  const h = spr(f, delay + 12, 30, {damping: 12, stiffness: 200});
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 120 60" style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}}>
      <path d="M8 52 C 40 10, 78 6, 110 28" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <g transform={`translate(110 28) scale(${h})`}><path d="M-16 -6 L2 0 L-12 10" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></g>
    </svg>
  );
};

/* ============================ PARTÍCULAS BOTÁNICAS ========================= */
const Particles: React.FC<{n?: number; seed: string; color?: string; gold?: boolean}> = ({n = 12, seed, color = C.sage, gold = false}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {new Array(n).fill(0).map((_, i) => {
        const r1 = random(`${seed}-x${i}`), r2 = random(`${seed}-s${i}`), r3 = random(`${seed}-p${i}`), r4 = random(`${seed}-r${i}`);
        const size = 9 + r2 * 15, speed = 0.5 + r3 * 0.9, span = 1250;
        const y = 1150 - ((f * speed + r3 * span) % span);
        const x = r1 * 1900 + Math.sin((f + r4 * 200) / 30) * 22;
        const op = clamp01((1150 - y) / 120) * clamp01((y + 60) / 140) * 0.5;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: op, transform: `rotate(${f * (r4 - 0.5) + r4 * 360}deg)`}}>
            <svg width={size} height={size} viewBox="0 0 64 64"><path d="M32 5 C14 17 11 41 32 59 C53 41 50 17 32 5 Z" fill={gold ? C.gold : color} opacity=".8" /></svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ============================ RACK FOCUS / KEN BURNS ======================= */
const RackImg: React.FC<{src: string; blur?: number; zoom?: number; style?: React.CSSProperties; imgStyle?: React.CSSProperties}> = ({src, blur = 12, zoom = 0.08, style, imgStyle}) => {
  const f = useCurrentFrame();
  const b = interpolate(f, [0, 22], [blur, 0], CL);
  const s = interpolate(f, [0, 260], [1 + zoom, 1], {...CL, easing: Easing.out(Easing.quad)});
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, filter: `blur(${b}px) saturate(1.03)`, ...imgStyle}} />
    </div>
  );
};

/* ================================ CARD 3D ================================== */
const Card3D: React.FC<{w: number; h: number; delay?: number; idle?: boolean; flipAxis?: 'x' | 'y'; style?: React.CSSProperties; face?: React.CSSProperties; children?: React.ReactNode}> =
  ({w, h, delay = 0, idle = true, flipAxis = 'y', style, face, children}) => {
    const f = useCurrentFrame(); const {fps} = useVideoConfig();
    const e = spr(f, delay, fps, {damping: 17, stiffness: 95});
    const flip = (1 - e) * (flipAxis === 'y' ? 78 : -62);
    const ix = idle ? Math.sin((f + delay * 13) / 55) * 3.4 : 0;
    const iy = idle ? Math.cos((f + delay * 7) / 65) * 4.4 : 0;
    const fy = idle ? Math.sin((f + delay * 5) / 48) * 9 : 0;
    const tf = flipAxis === 'y' ? `rotateY(${flip + iy}deg) rotateX(${ix}deg)` : `rotateX(${flip + ix}deg) rotateY(${iy}deg)`;
    return (
      <div style={{width: w, height: h, perspective: 1400, opacity: e, ...style}}>
        <div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `translateY(${fy}px) ${tf}`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: 'rgba(22,40,29,.42)', filter: 'blur(30px)', transform: 'translateZ(-56px) translateY(22px)'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: 'linear-gradient(150deg,#274632,#152A1D)', transform: 'translateZ(-16px)'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', ...lightGlass, ...face}}>
            {children}
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,.4) 46%, rgba(255,255,255,.05) 54%, transparent 66%)', backgroundSize: '250% 100%', backgroundPosition: `${((f * 0.7) % 220) - 60}% 0`, mixBlendMode: 'screen', pointerEvents: 'none'}} />
          </div>
        </div>
      </div>
    );
  };

/* ======================== INGREDIENTE 3D (ROMERO + GOTA) =================== */
const IngredientCard3D: React.FC<{x: number; y: number; w?: number; h?: number; delay?: number}> = ({x, y, w = 400, h = 520, delay = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{position: 'absolute', left: w / 2 - 220, top: h / 2 - 220, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,.4), transparent 65%)', filter: 'blur(30px)'}} />
      <Card3D w={w} h={h} delay={delay}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 26}}>
          <div style={{height: h * 0.52, display: 'flex', alignItems: 'flex-end'}}><RosemarySVG h={h * 0.5} /></div>
          <DropSVG size={54} style={{position: 'absolute', right: 42, top: 60, transform: `translateY(${Math.sin(f / 26) * 8}px) rotate(8deg)`}} />
          <div style={{fontFamily: SERIF, fontSize: 46, color: C.pine, letterSpacing: 4, marginTop: 6}}>ROMERO</div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: C.copper}}>Rosmarinus officinalis</div>
          <div style={{width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '14px 0'}} />
          <div style={{fontFamily: SANS, fontSize: 21, letterSpacing: 3, color: C.moss, border: `1.5px solid ${C.sage}`, borderRadius: 999, padding: '7px 20px'}}>ANTIOXIDANTE NATURAL</div>
        </div>
      </Card3D>
    </div>
  );
};

/* ============================== STAT PUNCH ================================= */
const StatPunch: React.FC<{value: number | string; suffix?: string; label?: string; sub?: string; delay?: number; size?: number; x: number; y: number; w?: number; dark?: boolean}> =
  ({value, suffix = '', label, sub, delay = 0, size = 150, x, y, w = 460, dark = true}) => {
    const f = useCurrentFrame(); const {fps} = useVideoConfig();
    const e = spr(f, delay, fps, {damping: 11, stiffness: 170, mass: 0.75});
    const shown = typeof value === 'number'
      ? Math.round(interpolate(clamp01((f - delay) / 22), [0, 1], [0, value], {easing: Easing.out(Easing.cubic)})) : value;
    return (
      <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', transform: `scale(${0.4 + 0.6 * e})`, opacity: e}}>
        <div style={css({fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1, color: dark ? C.goldL : C.copper, textShadow: dark ? '0 6px 30px rgba(0,0,0,.5), 0 0 60px rgba(201,162,75,.5)' : '0 0 50px rgba(201,162,75,.45)'})}>
          {shown}<span style={{fontSize: size * 0.42}}>{suffix}</span>
        </div>
        {label && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 27, letterSpacing: 2, color: dark ? C.cream : C.pine, marginTop: 10, textShadow: dark ? '0 2px 14px rgba(0,0,0,.5)' : undefined}}>{label}</div>}
        {sub && <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, color: dark ? '#E9DFC8' : C.copper, marginTop: 6}}>{sub}</div>}
      </div>
    );
  };

/* ============================== LOWER THIRD ================================ */
const LowerThird: React.FC<{delay?: number}> = ({delay = 0}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const e = spr(f, delay, fps, {damping: 20, stiffness: 110});
  return (
    <div style={{position: 'absolute', left: 64, bottom: 52, transform: `translateY(${(1 - e) * 40}px)`, opacity: e, ...darkGlass, borderRadius: 18, display: 'flex', alignItems: 'stretch', overflow: 'hidden', clipPath: `inset(0 ${(1 - e) * 100}% 0 0 round 18px)`}}>
      <div style={{width: 7, background: `linear-gradient(180deg, ${C.goldL}, ${C.copper})`}} />
      <div style={{padding: '18px 30px 16px 24px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <LeafSVG size={40} color={C.goldL} />
          <div style={{fontFamily: SERIF, fontSize: 44, color: C.cream, lineHeight: 1}}>Dr. Federer</div>
        </div>
        <div style={{fontFamily: SANS, fontSize: 22, letterSpacing: 3, color: C.goldL, marginTop: 8}}>DERMATOLOGÍA · DERMOCOSMÉTICA NATURAL</div>
      </div>
    </div>
  );
};

/* ============================ CALLOUT CON CONECTOR ========================= */
const CalloutCard: React.FC<{x: number; y: number; w: number; tx: number; ty: number; delay?: number; title: string; sub: string; tag?: string; icon?: React.ReactNode}> =
  ({x, y, w, tx, ty, delay = 0, title, sub, tag, icon}) => {
    const f = useCurrentFrame(); const {fps} = useVideoConfig();
    const e = spr(f, delay, fps, {damping: 16, stiffness: 120});
    const line = eo((f - delay - 8) / 16);
    const sx = x + w / 2, sy = y + 210;
    const pulse = (f % 30) / 30;
    return (
      <>
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <path d={`M${sx} ${sy} C ${sx} ${sy + 90}, ${tx} ${ty - 110}, ${tx} ${ty}`} fill="none" stroke={C.goldL} strokeWidth="3.4" strokeDasharray="7 8" pathLength={1} strokeDashoffset={1 - line} opacity=".95" />
          <circle cx={tx} cy={ty} r={8 + pulse * 22} fill="none" stroke={C.goldL} strokeWidth="2.4" opacity={(1 - pulse) * line} />
          <circle cx={tx} cy={ty} r={7} fill={C.goldL} opacity={line} />
        </svg>
        <div style={{position: 'absolute', left: x, top: y, width: w, ...darkGlass, padding: '22px 24px', display: 'flex', gap: 18, alignItems: 'center', transform: `scale(${0.7 + 0.3 * e}) translateY(${(1 - e) * 24}px)`, opacity: e}}>
          {icon}
          <div>
            <div style={{fontFamily: SERIF, fontSize: 32, color: C.goldL, lineHeight: 1.1}}>{title}</div>
            <div style={{fontFamily: SANS, fontSize: 22, color: C.cream, marginTop: 6, opacity: .92}}>{sub}</div>
            {tag && <div style={{display: 'inline-block', fontFamily: SANS, fontSize: 18, letterSpacing: 2, color: C.pine, background: C.goldL, borderRadius: 999, padding: '4px 14px', marginTop: 10, fontWeight: 700}}>{tag}</div>}
          </div>
        </div>
      </>
    );
  };

/* ============================== ANTES / DESPUÉS ============================ */
const BeforeAfter: React.FC<{src: string; x: number; y: number; w?: number; h?: number; delay?: number}> = ({src, x, y, w = 560, h = 370, delay = 0}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const e = spr(f, delay, fps, {damping: 18, stiffness: 100});
  const p = lerp(86, 40, sm((f - delay - 10) / 46));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${(1 - e) * 60}px) rotate(-2deg)`, opacity: e}}>
      <div style={{position: 'absolute', inset: -8, borderRadius: 28, background: 'radial-gradient(circle, rgba(201,162,75,.35), transparent 70%)', filter: 'blur(18px)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', border: `3px solid ${C.gold}`, boxShadow: '0 34px 70px -20px rgba(10,25,15,.6)'}}>
        <Img src={src} style={{width: w, height: h, objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p}%`, overflow: 'hidden', borderRight: `4px solid ${C.goldL}`}}>
          <Img src={src} style={{width: w, height: h, objectFit: 'cover', filter: 'grayscale(.92) sepia(.22) brightness(.9)'}} />
        </div>
        <div style={{position: 'absolute', left: `calc(${p}% - 16px)`, top: '50%', width: 30, height: 30, marginTop: -15, borderRadius: '50%', background: C.goldL, border: `3px solid ${C.pine}`, boxShadow: '0 4px 14px rgba(0,0,0,.4)'}} />
        <div style={{position: 'absolute', left: 14, top: 12, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.cream, background: 'rgba(20,35,25,.7)', padding: '5px 14px', borderRadius: 999}}>ANTES</div>
        <div style={{position: 'absolute', right: 14, top: 12, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.pine, background: C.goldL, padding: '5px 14px', borderRadius: 999}}>DESPUÉS</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: -44, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 23, color: C.cream, textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>Constancia, semana a semana</div>
    </div>
  );
};

/* ============================ ANILLOS DE PULSO ============================= */
const PulseRings: React.FC<{x: number; y: number; color?: string; n?: number}> = ({x, y, color = C.goldL, n = 3}) => {
  const f = useCurrentFrame();
  const per = 38;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const t = ((f + (i * per) / n) % per) / per;
        return <div key={i} style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', border: `4px solid ${color}`, transform: `scale(${0.35 + t * 1.6})`, opacity: (1 - t) * 0.75}} />;
      })}
    </>
  );
};

/* ========================== SHELL: WHIP IN/OUT ============================= */
const BeatShell: React.FC<{dur: number; dir: number; children?: React.ReactNode}> = ({dur, dir, children}) => {
  const f = useCurrentFrame();
  const v = Math.min(eo(f / 13), clamp01((dur - f) / 9));
  return (
    <AbsoluteFill style={{transform: `translateX(${dir * (1 - v) * 320}px) skewX(${dir * (1 - v) * 5}deg)`, opacity: clamp01(v * 1.25), filter: v < 0.995 ? `blur(${(1 - v) * 12}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

/* ============================ FONDO DE ESCENA ============================== */
const SceneBackdrop: React.FC<{img?: string; dim?: number; seed: string; gold?: boolean}> = ({img, dim = 0.4, seed, gold = false}) => (
  <AbsoluteFill style={{background: `radial-gradient(1300px 800px at 18% -10%, #FBF5E8 0%, ${C.cream} 46%, #EADF C7 100%)`, backgroundColor: C.cream}}>
    {img && (
      <AbsoluteFill>
        <RackImg src={img} blur={16} zoom={0.1} />
        <AbsoluteFill style={{background: `linear-gradient(155deg, rgba(28,52,38,${dim + 0.42}), rgba(28,52,38,${dim + 0.1}) 45%, rgba(246,239,226,.92) 96%)`}} />
      </AbsoluteFill>
    )}
    <Particles n={13} seed={seed} gold={gold} />
    <Noise op={0.05} />
  </AbsoluteFill>
);

type SceneProps = { a: Assets; p: any; dur: number; dir: number; pos: AvatarPos };

/* ================================ ESCENAS ================================== */
const HookScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <Scrim x={30} y={90} w={1020} h={400} op={0.6} />
      <div style={{position: 'absolute', left: 90, top: 140, width: 980}}>
        {['¿Cuántas cremas ha comprado', 'en los últimos 10 años?'].map((t, i) => {
          const e = spr(f, 4 + i * 8, 30, {damping: 18, stiffness: 110});
          return (
            <div key={i} style={{fontFamily: SERIF, fontSize: 62, color: C.cream, lineHeight: 1.14, textShadow: '0 3px 22px rgba(8,20,12,.65)', opacity: e, transform: `translateY(${(1 - e) * 30}px)`}}>{t}</div>
          );
        })}
        <div style={{marginTop: 10, opacity: spr(f, 22, 30)}}><Underline w={360} delay={22} /></div>
      </div>
      <Card3D w={330} h={400} delay={16} style={{position: 'absolute', left: 690, top: 590}}>
        <RackImg src={a.crema} blur={8} zoom={0.12} style={{borderRadius: 0}} imgStyle={{height: '72%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', padding: '10px 18px', background: 'linear-gradient(180deg,#FBF4E4,#F0E3C9)'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.pine}}>Crema “milagrosa”</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 4}}>
            <span style={{position: 'relative', fontFamily: SERIF, fontSize: 30, color: C.terra}}>200 USD
              <svg width="110" height="34" viewBox="0 0 110 34" style={{position: 'absolute', left: -6, top: -2}}><path d="M4 22 C 40 12, 70 26, 106 14" stroke={C.terra} strokeWidth="4.6" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - 30) / 12)} /></svg>
            </span>
            <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, color: C.copper}}>misma decepción</span>
          </div>
        </div>
      </Card3D>
      <StatPunch x={1330} y={170} value={10} suffix=" AÑOS" label="buscando la firmeza perdida" delay={26} size={150} />
      <LowerThird delay={38} />
    </BeatShell>
  );
};

const RevealScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <IngredientCard3D x={120} y={250} delay={4} />
      <Scrim x={600} y={200} w={1250} h={560} op={0.55} />
      <div style={{position: 'absolute', left: 660, top: 270}}>
        <div style={{fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: C.goldL, opacity: spr(f, 8, 30)}}>LE PRESENTO AL</div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 165, color: C.cream, letterSpacing: 6, lineHeight: 1, textShadow: '0 8px 40px rgba(8,20,12,.6)', opacity: spr(f, 12, 30, {damping: 14}), transform: `scale(${0.7 + 0.3 * spr(f, 12, 30, {damping: 14})})`, transformOrigin: 'left center'}}>ROMERO</div>
          <CircleDraw w={660} h={190} delay={30} style={{left: -18, top: -14}} />
        </div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 34, color: '#EFE5CE', marginTop: 18, opacity: spr(f, 26, 30)}}>El rejuvenecedor que ya crece en su cocina.</div>
        <div style={{display: 'flex', gap: 16, marginTop: 30}}>
          {['Antioxidante', 'Circulación', 'Antiinflamatorio'].map((t, i) => {
            const e = spr(f, 34 + i * 7, 30, {damping: 14});
            return <div key={t} style={{...darkGlass, borderRadius: 999, padding: '12px 26px', fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: 1.5, transform: `translateY(${(1 - e) * 26}px)`, opacity: e}}>{t}</div>;
          })}
        </div>
      </div>
      <LowerThird delay={14} />
    </BeatShell>
  );
};

const ChapterScene: React.FC<SceneProps> = ({a, p, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop img={a[p.img as keyof Assets]} dim={0.55} seed={p.num} />
      <div style={{position: 'absolute', left: 110, top: 90, fontFamily: SANS, fontSize: 24, letterSpacing: 6, color: C.goldL, opacity: spr(f, 4, 30)}}>CAPÍTULO {p.num}</div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={css({fontFamily: SERIF, fontSize: 190, lineHeight: 0.9, color: 'transparent', WebkitTextStroke: '3px rgba(231,200,126,.75)', opacity: spr(f, 6, 30)})}>{p.num}</div>
        <div style={{perspective: 1200, marginTop: 8}}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 86, color: C.cream, textAlign: 'center', textShadow: '0 8px 34px rgba(8,20,12,.55)', transform: `rotateX(${(1 - spr(f, 10, 30, {damping: 16})) * -75}deg)`, transformOrigin: 'center bottom', opacity: spr(f, 10, 30)}}>{p.title}</div>
        </div>
        <div style={{marginTop: 22}}><Underline w={440} delay={20} sw={6} /></div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: '#F0E7D2', marginTop: 22, opacity: spr(f, 26, 30)}}>{p.sub}</div>
      </div>
    </BeatShell>
  );
};

const ENEMIES = [
  {Icon: RadicalSVG, t: 'Radicales libres', d: 'Sol, contaminación y estrés rompen su colágeno.'},
  {Icon: PulseSVG, t: 'Circulación lenta', d: 'Menos oxígeno y nutrientes: piel apagada y cansada.'},
  {Icon: FlameSVG, t: 'Inflamación silenciosa', d: 'Invisible, pero acelera todo el proceso, día tras día.'},
];
const EnemiesScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop img={a.colageno} dim={0.25} seed="enem" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 66, color: C.pine, opacity: spr(f, 4, 30)}}>LOS 3 ENEMIGOS DE SU PIEL</div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 12}}><Underline w={420} delay={12} /></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 110}}>
        {ENEMIES.map((E, i) => (
          <Card3D key={i} w={480} h={470} delay={10 + i * 10} flipAxis="y">
            <div style={{padding: '40px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
              <div style={css({position: 'absolute', right: 14, top: 2, fontFamily: SERIF, fontSize: 130, color: 'transparent', WebkitTextStroke: '2px rgba(201,162,75,.5)'})}>{i + 1}</div>
              <div style={{width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBF3E0, #EBDCBB)', border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px -10px rgba(25,45,32,.4), inset 0 2px 6px rgba(255,255,255,.9)'}}>
                <E.Icon size={66} />
              </div>
              <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 37, color: C.pine, marginTop: 22}}>{E.t}</div>
              <div style={{fontFamily: SANS, fontSize: 25, color: '#41544A', marginTop: 12, lineHeight: 1.35}}>{E.d}</div>
            </div>
          </Card3D>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center'}}>
        <div style={{...darkGlass, borderRadius: 999, padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 16, fontFamily: SERIF, fontSize: 32, opacity: spr(f, 44, 30)}}>
          <LeafSVG size={38} color={C.goldL} /> El romero actúa sobre los tres — <span style={{color: C.goldL, fontStyle: 'italic'}}>a la vez.</span>
        </div>
      </div>
    </BeatShell>
  );
};

const RulesScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <Scrim x={20} y={130} w={900} h={560} op={0.6} />
      <div style={{position: 'absolute', left: 84, top: 190, width: 840}}>
        <div style={{fontFamily: SANS, fontSize: 24, letterSpacing: 5, color: C.goldL, opacity: spr(f, 4, 30)}}>AQUÍ ES DONDE EL ROMERO</div>
        <div style={{fontFamily: SERIF, fontSize: 68, color: C.cream, lineHeight: 1.1, textShadow: '0 3px 22px rgba(8,20,12,.6)', marginTop: 8, opacity: spr(f, 8, 30)}}>cambia las reglas<br />del juego</div>
        <div style={{marginTop: 14}}><Underline w={380} delay={16} /></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30}}>
          {['Frena a los radicales libres', 'Activa la circulación del rostro', 'Calma la inflamación'].map((t, i) => {
            const e = spr(f, 22 + i * 9, 30, {damping: 15});
            return (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, transform: `translateX(${(1 - e) * -60}px)`, opacity: e}}>
                <CheckDraw size={46} delay={22 + i * 9} color={C.goldL} />
                <div style={{...darkGlass, borderRadius: 14, padding: '12px 24px', fontFamily: SANS, fontWeight: 600, fontSize: 27}}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
      <IngredientCard3D x={1380} y={180} w={340} h={440} delay={10} />
    </BeatShell>
  );
};

const MoleculesScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <CalloutCard x={80} y={110} w={470} tx={905} ty={600} delay={4} title="ÁCIDO CARNÓSICO" sub="Escudo antioxidante de sus células" tag="NEUTRALIZA RADICALES" icon={<MoleculeSVG size={128} />} />
      <CalloutCard x={1370} y={110} w={470} tx={1015} ty={600} delay={16} title="ÁCIDO ROSMARÍNICO" sub="Defensa antiinflamatoria natural" tag="PROTEGE EL COLÁGENO" icon={<MoleculeSVG size={128} accent="#D9B96A" />} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center'}}>
        <div style={{...darkGlass, borderRadius: 999, padding: '18px 44px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: SERIF, fontSize: 33, opacity: spr(f, 34, 30), transform: `translateY(${(1 - spr(f, 34, 30)) * 30}px)`}}>
          <ShieldSVG size={46} color={C.goldL} /> DOS ESCUDOS QUE DEFIENDEN SU COLÁGENO
        </div>
      </div>
    </BeatShell>
  );
};

const UVStatScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop img={a.colageno} dim={0.6} seed="uv" />
      <div style={{position: 'absolute', left: '50%', top: '44%', width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: '50%', border: '3px dashed rgba(231,200,126,.4)', transform: `rotate(${f * 0.5}deg)`}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={css({fontFamily: SERIF, fontWeight: 700, fontSize: 330, lineHeight: 0.9, background: 'linear-gradient(180deg,#F3DCA2,#C9A24B 55%,#8F5A1E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transform: `scale(${0.5 + 0.5 * spr(f, 4, 30, {damping: 10, stiffness: 150})})`, filter: 'drop-shadow(0 16px 40px rgba(0,0,0,.45))'})}>#1</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: C.cream, marginTop: 14, opacity: spr(f, 16, 30)}}>CAUSA DEL ENVEJECIMIENTO PREMATURO</div>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: C.goldL, marginTop: 8, opacity: spr(f, 22, 30), textShadow: '0 6px 26px rgba(0,0,0,.5)'}}>RADIACIÓN ULTRAVIOLETA</div>
        <div style={{...darkGlass, borderRadius: 999, padding: '15px 38px', marginTop: 34, display: 'flex', alignItems: 'center', gap: 16, fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, opacity: spr(f, 32, 30)}}>
          <ShieldSVG size={42} color={C.goldL} /> El ácido carnósico ayuda a proteger las células de su piel
        </div>
      </div>
    </BeatShell>
  );
};

const CirculationScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop seed="circ" />
      <div style={{position: 'absolute', left: 110, top: 180, width: 520, height: 640}}>
        <Card3D w={520} h={640} delay={4} flipAxis="x">
          <RackImg src={a.piel} blur={10} zoom={0.1} style={{borderRadius: 0}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 62%, rgba(214,120,88,.34), transparent 55%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(transparent, rgba(24,42,30,.75))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.goldL}}>PIEL VIVA</div>
          </div>
        </Card3D>
        <PulseRings x={260} y={330} />
      </div>
      <div style={{position: 'absolute', left: 780, top: 200, width: 1060}}>
        <div style={{fontFamily: SANS, fontSize: 25, letterSpacing: 5, color: C.copper, opacity: spr(f, 6, 30)}}>EL ROMERO DESPIERTA</div>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: C.pine, lineHeight: 1.05, opacity: spr(f, 10, 30)}}>SU CIRCULACIÓN</div>
        <div style={{marginTop: 12}}><Underline w={380} delay={16} /></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 34}}>
          {['Más sangre a la superficie', 'Más oxígeno en cada célula', 'Más nutrientes para el colágeno'].map((t, i) => {
            const e = spr(f, 20 + i * 9, 30, {damping: 15});
            return (
              <div key={t} style={{...lightGlass, borderRadius: 16, padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 18, width: 620, transform: `translateX(${(1 - e) * 70}px)`, opacity: e}}>
                <PulseSVG size={42} /><span style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.ink}}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 34, display: 'inline-block', background: `linear-gradient(120deg, ${C.gold}, ${C.goldL})`, borderRadius: 999, padding: '16px 40px', fontFamily: SERIF, fontWeight: 700, fontSize: 31, color: C.pine, boxShadow: '0 18px 40px -12px rgba(143,100,32,.6)', opacity: spr(f, 48, 30), transform: `scale(${0.7 + 0.3 * spr(f, 48, 30, {damping: 12})})`}}>
          Rubor sano · la luminosidad de los 20
        </div>
      </div>
    </BeatShell>
  );
};

const AntiScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  const items = [
    {Icon: ShieldSVG, t: 'Calma la piel irritada'},
    {Icon: LeafSVG, t: 'Ayuda a desinflamar'},
    {Icon: BacteriaSVG, t: 'Antibacteriano comprobado'},
  ];
  return (
    <BeatShell dur={dur} dir={dir}>
      <div style={{position: 'absolute', left: 80, top: 190, display: 'flex', flexDirection: 'column', gap: 24}}>
        {items.map((it, i) => {
          const e = spr(f, 5 + i * 10, 30, {damping: 15});
          return (
            <div key={it.t} style={{...darkGlass, borderRadius: 20, padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 22, width: 620, transform: `translateX(${(1 - e) * -90}px)`, opacity: e}}>
              <div style={{width: 84, height: 84, borderRadius: '50%', background: 'rgba(231,200,126,.14)', border: `2px solid ${C.goldL}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><it.Icon size={52} color={C.goldL} /></div>
              <div style={{fontFamily: SERIF, fontSize: 36, color: C.cream}}>{it.t}</div>
            </div>
          );
        })}
      </div>
      <Scrim x={420} y={840} w={1080} h={200} op={0.55} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, color: C.cream, textShadow: '0 3px 20px rgba(8,20,12,.65)', opacity: spr(f, 34, 30)}}>“Una piel menos inflamada es, sencillamente, una piel más joven.”</div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}><Underline w={520} delay={40} /></div>
      </div>
    </BeatShell>
  );
};

const StepScene: React.FC<SceneProps> = ({a, p, dir, dur}) => {
  const f = useCurrentFrame();
  const accent = p.accent || C.moss;
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop seed={`st${p.n}`} />
      <div style={css({position: 'absolute', left: 84, top: 86, fontFamily: SERIF, fontWeight: 700, fontSize: 190, lineHeight: 1, color: 'transparent', WebkitTextStroke: '3px rgba(178,106,46,.55)', opacity: spr(f, 2, 30)})}>{p.n}</div>
      <div style={{position: 'absolute', left: 300, top: 130, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: accent, opacity: spr(f, 4, 30)}}>PASO {p.n} DE 4</div>
      <Card3D w={440} h={540} delay={6} flipAxis="x" style={{position: 'absolute', left: 90, top: 300}}>
        <RackImg src={a[p.img as keyof Assets]} blur={9} zoom={0.11} style={{borderRadius: 0}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px', background: 'linear-gradient(transparent, rgba(24,42,30,.8))', textAlign: 'center'}}>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.goldL}}>{String(p.sub).toUpperCase()}</span>
        </div>
      </Card3D>
      <ArrowHand delay={14} style={{position: 'absolute', left: 545, top: 350}} color={accent} />
      <div style={{position: 'absolute', left: 700, top: 160, width: 800}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 62, color: C.pine, opacity: spr(f, 8, 30)}}>{p.title}</div>
        <div style={{marginTop: 8}}><Underline w={320} delay={14} color={accent} /></div>
      </div>
      <div style={{position: 'absolute', left: 700, top: 300, display: 'flex', flexDirection: 'column', gap: 20, width: 800}}>
        {(p.points as string[]).map((t, i) => {
          const e = spr(f, 16 + i * 9, 30, {damping: 15});
          return (
            <div key={i} style={{...lightGlass, borderRadius: 18, padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 20, transform: `translateX(${(1 - e) * 80}px)`, opacity: e, borderLeft: `6px solid ${accent}`}}>
              <div style={{minWidth: 48, height: 48, borderRadius: '50%', border: `2.5px solid ${accent}`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 26}}>{i + 1}</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 27, color: C.ink, lineHeight: 1.3}}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 90, bottom: 84, width: 880, background: 'linear-gradient(120deg,#F3E9D2,#EBDCBB)', border: `1.5px solid ${C.gold}`, borderRadius: 18, padding: '18px 26px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 18px 40px -16px rgba(25,45,32,.4)', opacity: spr(f, 44, 30), transform: `translateY(${(1 - spr(f, 44, 30)) * 30}px)`}}>
        <LeafSVG size={42} color={C.copper} />
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 26, color: C.pine}}><b style={{fontStyle: 'normal', letterSpacing: 2, fontSize: 20, color: C.copper}}>CONSEJO DEL DR. · </b>{p.tip}</div>
      </div>
    </BeatShell>
  );
};

const RoutineScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  const cols = [
    {Icon: SunSVG, h: 'EN LA MAÑANA', items: ['Cubito de romero', 'Crema hidratante habitual', 'Protector solar, siempre'], accent: C.gold},
    {Icon: MoonSVG, h: 'EN LA NOCHE', items: ['Limpie su rostro', 'Aplique el tónico', '1× por semana: aceite o vapor'], accent: C.moss},
  ];
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop seed="rut" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 74, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.pine, opacity: spr(f, 4, 30)}}>SU RUTINA SIMPLE</div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}><Underline w={360} delay={10} /></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', gap: 90}}>
        {cols.map((col, ci) => (
          <Card3D key={ci} w={760} h={590} delay={10 + ci * 12} flipAxis="x">
            <div style={{padding: '36px 44px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <div style={{width: 92, height: 92, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBF3E0, #EBDCBB)', border: `2px solid ${col.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><col.Icon size={52} color={col.accent === C.gold ? C.copper : C.moss} /></div>
                <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: C.pine}}>{col.h}</div>
              </div>
              <div style={{width: '100%', height: 2, background: `linear-gradient(90deg, ${col.accent}, transparent)`, margin: '24px 0'}} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
                {col.items.map((t, i) => {
                  const e = spr(f, 20 + ci * 12 + i * 8, 30, {damping: 15});
                  return (
                    <div key={t} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: e, transform: `translateX(${(1 - e) * 50}px)`}}>
                      <CheckDraw size={46} delay={20 + ci * 12 + i * 8} color={col.accent} />
                      <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink}}>{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card3D>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 66, display: 'flex', justifyContent: 'center'}}>
        <div style={{...darkGlass, borderRadius: 999, padding: '14px 42px', fontFamily: SERIF, fontStyle: 'italic', fontSize: 30, opacity: spr(f, 52, 30)}}>Nada complicado. Constancia: lo único que su piel de verdad necesita.</div>
      </div>
    </BeatShell>
  );
};

const WarningScene: React.FC<SceneProps> = ({dir, dur}) => {
  const f = useCurrentFrame();
  const bullets = [
    {Icon: ClockSVG, t: 'Pruebe en el antebrazo y espere 24 horas para descartar alergias.'},
    {Icon: BandageSVG, t: 'No aplique romero sobre heridas abiertas ni piel lastimada.'},
    {Icon: HeartSVG, t: 'Embarazo o medicación: consulte a su médico antes del aceite esencial.'},
  ];
  return (
    <BeatShell dur={dur} dir={dir}>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, transparent 30%, rgba(246,239,226,.96) 58%)'}} />
      <div style={{position: 'absolute', left: 1020, top: 110, width: 830, bottom: 100, ...lightGlass, borderRadius: 30, border: `2px solid ${C.copper}`, padding: '40px 44px', opacity: spr(f, 6, 30), transform: `translateX(${(1 - spr(f, 6, 30, {damping: 16})) * 120}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <CrossSVG size={64} />
          <div>
            <div style={{fontFamily: SANS, fontSize: 20, letterSpacing: 4, color: C.copper, fontWeight: 700}}>SU SEGURIDAD VA PRIMERO</div>
            <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: C.pine}}>Advertencias de médico</div>
          </div>
        </div>
        <div style={{width: '100%', height: 2, background: `linear-gradient(90deg, ${C.copper}, transparent)`, margin: '26px 0'}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {bullets.map((b, i) => {
            const e = spr(f, 14 + i * 10, 30, {damping: 15});
            return (
              <div key={i} style={{display: 'flex', gap: 20, alignItems: 'center', background: 'rgba(178,106,46,.08)', border: '1.5px solid rgba(178,106,46,.4)', borderRadius: 18, padding: '18px 22px', opacity: e, transform: `translateY(${(1 - e) * 26}px)`}}>
                <b.Icon size={56} />
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 27, color: C.ink, lineHeight: 1.32}}>{b.t}</div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26}}>
          <StatPunch x={0} y={0} w={200} dark={false} value={24} suffix=" H" label="de prueba" delay={40} size={84} />
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 25, color: C.copper, width: 480, textAlign: 'right', opacity: spr(f, 46, 30)}}>“El romero es un aliado, no un reemplazo del buen criterio.”</div>
        </div>
      </div>
    </BeatShell>
  );
};

const TruthScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  return (
    <BeatShell dur={dur} dir={dir}>
      <Scrim x={360} y={60} w={1200} h={300} op={0.6} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontSize: 78, color: C.cream, textShadow: '0 4px 26px rgba(8,20,12,.65)', opacity: spr(f, 4, 30)}}>“La piel joven no se compra.</div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.goldL, textShadow: '0 4px 26px rgba(8,20,12,.65)', opacity: spr(f, 12, 30, {damping: 13}), transform: `scale(${0.7 + 0.3 * spr(f, 12, 30, {damping: 13})})`}}>Se cuida.”</div>
          <CircleDraw w={460} h={130} delay={24} style={{left: -20, top: -8}} />
        </div>
      </div>
      <BeforeAfter src={a.antes} x={70} y={560} delay={14} />
      <div style={{position: 'absolute', right: 90, top: 570, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-end'}}>
        {['Antioxidante', 'Activador de la circulación', 'Antiinflamatorio'].map((t, i) => {
          const e = spr(f, 22 + i * 8, 30, {damping: 14});
          return <div key={t} style={{...darkGlass, borderRadius: 999, padding: '12px 28px', fontFamily: SANS, fontWeight: 700, fontSize: 25, opacity: e, transform: `translateX(${(1 - e) * 60}px)`}}>{t}</div>;
        })}
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, color: C.goldL, marginTop: 6, opacity: spr(f, 48, 30)}}>= una simple ramita verde</div>
      </div>
    </BeatShell>
  );
};

const CTAScene: React.FC<SceneProps> = ({a, dir, dur}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 14) * 0.03;
  return (
    <BeatShell dur={dur} dir={dir}>
      <SceneBackdrop img={a.romero} dim={0.62} seed="cta" gold />
      <Card3D w={470} h={620} delay={6} style={{position: 'absolute', left: 150, top: 220}} face={{background: 'linear-gradient(160deg,#26462F,#16281D)', border: `2px solid ${C.gold}`}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 34, background: 'linear-gradient(90deg, rgba(0,0,0,.4), transparent)'}} />
        <div style={{padding: '52px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%'}}>
          <div style={{width: 130, height: 130, borderRadius: '50%', border: `2.5px solid ${C.goldL}`, background: 'radial-gradient(circle at 35% 30%, rgba(231,200,126,.3), rgba(231,200,126,.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(201,162,75,.4)'}}><LeafSVG size={72} color={C.goldL} /></div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: C.goldL, marginTop: 34}}>EL MÉTODO</div>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: C.cream, lineHeight: 1.02, marginTop: 6}}>PIEL<br />JOVEN</div>
          <div style={{width: 130, height: 2, background: `linear-gradient(90deg, transparent, ${C.goldL}, transparent)`, margin: '26px 0'}} />
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 25, color: '#E8DCC2'}}>paso a paso · ingrediente por ingrediente</div>
          <BookSVG size={54} color={C.goldL} style={{marginTop: 'auto'}} />
        </div>
      </Card3D>
      <div style={{position: 'absolute', left: 740, top: 240, width: 1100}}>
        <div style={{fontFamily: SERIF, fontSize: 52, color: C.cream, textShadow: '0 3px 20px rgba(8,20,12,.5)', opacity: spr(f, 10, 30)}}>Imagínese lo que logra<br />con el <span style={{color: C.goldL, fontStyle: 'italic'}}>método completo:</span></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 36}}>
          {['Qué ingredientes naturales combinar', 'En qué orden aplicarlos', 'A qué edad, según su piel'].map((t, i) => {
            const e = spr(f, 18 + i * 9, 30, {damping: 14});
            return (
              <div key={t} style={{...darkGlass, borderRadius: 16, padding: '18px 30px', display: 'flex', alignItems: 'center', gap: 20, width: 700, opacity: e, transform: `translateX(${(1 - e) * 70}px)`}}>
                <CheckDraw size={46} delay={18 + i * 9} color={C.goldL} />
                <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 30}}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 44, display: 'inline-block', transform: `scale(${pulse * spr(f, 44, 30, {damping: 12})})`, opacity: spr(f, 44, 30)}}>
          <div style={{background: `linear-gradient(120deg, ${C.gold}, ${C.goldL})`, borderRadius: 999, padding: '22px 64px', fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: C.pine, boxShadow: '0 24px 60px -14px rgba(201,162,75,.7), inset 0 2px 0 rgba(255,255,255,.6)'}}>EMPEZAR AHORA →</div>
        </div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 26, color: '#EFE4CC', marginTop: 30, opacity: spr(f, 54, 30)}}>Su piel lleva años esperando que alguien le diga la verdad. Hoy la escuchó.</div>
        <div style={{fontFamily: SANS, fontSize: 20, letterSpacing: 4, color: C.goldL, marginTop: 18, opacity: spr(f, 58, 30)}}>DR. FEDERER · DERMOCOSMÉTICA NATURAL</div>
      </div>
    </BeatShell>
  );
};

const FallbackScene: React.FC<SceneProps> = ({p, dir, dur}) => (
  <BeatShell dur={dur} dir={dir}><SceneBackdrop seed="fb" /><div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 60, color: C.pine}}>{p.title || 'Dr. Federer'}</div></BeatShell>
);

const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: HookScene, reveal: RevealScene, chapter: ChapterScene, enemies: EnemiesScene, rules: RulesScene,
  molecules: MoleculesScene, uvstat: UVStatScene, circulation: CirculationScene, anti: AntiScene,
  step: StepScene, routine: RoutineScene, warning: WarningScene, truth: TruthScene, cta: CTAScene,
};

/* ============================== HUD GLOBAL ================================= */
const ProgressHUD: React.FC<{bf: Array<Beat & {from: number; dur: number}>}> = ({bf}) => {
  const frame = useCurrentFrame();
  const cur = bf.find((b) => frame < b.from + b.dur) ?? bf[bf.length - 1];
  return (
    <>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: 4, padding: '9px 14px 0', zIndex: 80}}>
        {bf.map((b) => {
          const p = clamp01((frame - b.from) / b.dur);
          return (
            <div key={b.id} style={{flexGrow: b.dur, height: 5, borderRadius: 3, background: 'rgba(24,40,30,.35)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.25)'}}>
              <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', padding: '8px 24px', borderRadius: 999, background: 'rgba(24,42,30,.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(231,200,126,.5)', color: C.cream, fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: 4, zIndex: 80}}>
        {cur.tag}
      </div>
    </>
  );
};

/* ============================ COMPONENTE PRINCIPAL ========================= */
type FedererProps = {
  avatarSrc?: string; romero?: string; piel?: string; aceite?: string; vapor?: string;
  cubito?: string; colageno?: string; crema?: string; antes?: string; durationInFrames?: number;
};

export const FedererEdit: React.FC<FedererProps> = (props) => {
  const {width: W, height: H, durationInFrames: DF} = useVideoConfig();
  const frame = useCurrentFrame();
  const a: Assets = {
    romero: props.romero ?? staticFile('med/romero.png'), piel: props.piel ?? staticFile('med/piel.png'),
    aceite: props.aceite ?? staticFile('med/aceite.png'), vapor: props.vapor ?? staticFile('med/vapor.png'),
    cubito: props.cubito ?? staticFile('med/cubito.png'), colageno: props.colageno ?? staticFile('med/colageno.png'),
    crema: props.crema ?? staticFile('med/crema.png'), antes: props.antes ?? staticFile('med/antes_despues.png'),
  };
  const avatarSrc = props.avatarSrc ?? staticFile('med/avatar.mp4');

  /* Mapeo data-driven: segundos → frames (proporcional a durationInFrames) */
  const TOTAL = BEATS[BEATS.length - 1].endSec;
  const bf = BEATS.map((b) => {
    const from = Math.round((b.startSec * DF) / TOTAL);
    const to = Math.round((b.endSec * DF) / TOTAL);
    return {...b, from, dur: Math.max(1, to - from)};
  });

  /* Avatar: blending continuo entre modos (sin cortes secos) */
  let ci = bf.findIndex((b) => frame < b.from + b.dur);
  if (ci < 0) ci = bf.length - 1;
  const cur = bf[ci], prev = bf[Math.max(0, ci - 1)];
  const t = sm((frame - cur.from) / 12);
  const mp = (pos?: AvatarPos) => {
    switch (pos) {
      case 'left': return {o: 1, x: -W * 0.28, y: 0, s: 1.16, c: 0};
      case 'right': return {o: 1, x: W * 0.28, y: 0, s: 1.16, c: 0};
      case 'corner': return {o: 1, x: W * 0.305, y: H * 0.285, s: 0.34, c: 1};
      case 'hidden': return {o: 0, x: 0, y: H * 0.06, s: 1.06, c: 0};
      default: return {o: 1, x: 0, y: 0, s: 1, c: 0};
    }
  };
  const A0 = mp(prev.avatarPos), A1 = mp(cur.avatarPos);
  const push = 1 + 0.045 * eo((frame - cur.from) / Math.max(1, cur.dur));
  const av = {o: lerp(A0.o, A1.o, t), x: lerp(A0.x, A1.x, t), y: lerp(A0.y, A1.y, t), s: lerp(A0.s, A1.s, t) * push, c: lerp(A0.c, A1.c, t)};
  const mainO = av.o * (1 - av.c);
  const pipO = av.c;

  return (
    <AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
      {/* CAPA 0 · base crema botánica */}
      <AbsoluteFill style={{background: `radial-gradient(1300px 800px at 15% -10%, #FBF5E8, ${C.cream} 50%, #E7DAC0 100%)`}}>
        <div style={{position: 'absolute', right: -180, bottom: -180, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,155,118,.28), transparent 65%)', filter: 'blur(30px)'}} />
        <div style={{position: 'absolute', left: -140, top: -140, width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,.22), transparent 65%)', filter: 'blur(30px)'}} />
      </AbsoluteFill>

      {/* CAPA 1 · AVATAR principal (consultorio real, audio continuo) */}
      <AbsoluteFill style={{opacity: mainO, overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `translate(${av.x}px, ${av.y}px) scale(${av.s})`, transformOrigin: 'center'}}>
          <OffthreadVideo src={avatarSrc} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.06) contrast(1.03)'}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,30,21,.4), transparent 16%, transparent 60%, rgba(16,30,21,.55))', pointerEvents: 'none'}} />
      </AbsoluteFill>

      {/* CAPA 2 · BEATS (Series/Sequence leyendo el array) */}
      {bf.map((b, i) => {
        const Sc = SCENES[b.kind] ?? FallbackScene;
        return (
          <Sequence key={b.id} from={b.from} durationInFrames={b.dur} premountFor={Math.min(24, Math.max(0, b.dur - 1))} name={b.id}>
            <Sc a={a} p={b.payload ?? {}} dur={b.dur} dir={i % 2 === 0 ? 1 : -1} pos={b.avatarPos ?? 'full'} />
          </Sequence>
        );
      })}

      {/* CAPA 3 · AVATAR PiP (modo 'corner', por encima de las gráficas) */}
      <AbsoluteFill style={{opacity: pipO, pointerEvents: 'none', zIndex: 60}}>
        <AbsoluteFill style={{transform: `translate(${av.x}px, ${av.y}px) scale(${av.s})`, transformOrigin: 'center'}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 36, overflow: 'hidden', border: '7px solid rgba(231,200,126,.95)', boxShadow: '0 46px 100px -22px rgba(12,26,17,.65)'}}>
            <OffthreadVideo muted src={avatarSrc} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div style={{position: 'absolute', left: '50%', bottom: 64, transform: 'translateX(-50%)', background: 'rgba(24,42,30,.85)', border: `2px solid ${C.goldL}`, borderRadius: 999, padding: '10px 42px', fontFamily: SERIF, fontSize: 58, color: C.cream, whiteSpace: 'nowrap'}}>Dr. Federer</div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* CAPA 4 · HUD + acabado de postproducción */}
      <ProgressHUD bf={bf} />
      <Grain />
      <Vignette />
      <FrameEdge />
    </AbsoluteFill>
  );
};

/* ================================= ROOT ==================================== */
const Root: React.FC = () => (
  <Composition
    id="FedererEdit"
    component={FedererEdit}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={1146}
    calculateMetadata={({props}) => ({durationInFrames: (props as FedererProps).durationInFrames ?? 1146})}
    defaultProps={{
      avatarSrc: staticFile('med/avatar.mp4'),
      romero: staticFile('med/romero.png'),
      piel: staticFile('med/piel.png'),
      aceite: staticFile('med/aceite.png'),
      vapor: staticFile('med/vapor.png'),
      cubito: staticFile('med/cubito.png'),
      colageno: staticFile('med/colageno.png'),
      crema: staticFile('med/crema.png'),
      antes: staticFile('med/antes_despues.png'),
      durationInFrames: 1146,
    }}
  />
);
registerRoot(Root);
