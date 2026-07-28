// ============================================================================
// FED PROMO — "El Método Piel Joven" · CTA/Promo Kit · Remotion 4.x
// 3 Compositions: FedPromo-Note (150f) · FedPromo-Character (150f) · FedPromo-Full (240f)
// 1920x1080 @30fps · Todo animado por código · Sin assets externos
// Paleta: dark cinematic + dorado/cobre · botánico · dermocosmética premium
// ============================================================================
import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  random,
  registerRoot,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'Arial, Helvetica, sans-serif';

// ---------------------------------------------------------------- PALETA ----
const C = {
  bg0: '#0b0806',
  bg1: '#17110a',
  bg2: '#241a0e',
  gold: '#d9b45c',
  goldHi: '#f3dfa0',
  copper: '#b87333',
  copperDeep: '#8a5524',
  cream: '#f2e7cf',
  paper: '#f3e9d3',
  paperShade: '#e0d0ac',
  ink: '#3a2c18',
  inkSoft: '#4a3820',
  green: '#7d9068',
  greenDeep: '#43543a',
  amberGlass: '#8a5524',
};

// ---------------------------------------------------------------- TIPOS -----
export type FedStep = {num: string; label: string};
export type FedPromoProps = {
  kicker: string;
  headline: string;
  noteTitle: string;
  bullets: string[];
  stepsLabel: string;
  steps: FedStep[];
  ctaText: string;
  ctaSub: string;
  cornerTag: string;
  accent: string;
  copper: string;
};

const DEFAULTS: FedPromoProps = {
  kicker: 'GUÍA GRATUITA · DR. FEDERER',
  headline: 'El Método Piel Joven',
  noteTitle: 'Protocolo esencial:',
  bullets: [
    'Romero + péptidos: firmeza en 21 días',
    'Rutina nocturna de 3 pasos',
    'Nutrición dérmica desde adentro',
    'Sin ácidos agresivos, ideal piel madura',
  ],
  stepsLabel: 'LOS 3 PILARES DEL MÉTODO',
  steps: [
    {num: '01', label: 'RENOVÁ'},
    {num: '02', label: 'NUTRÍ'},
    {num: '03', label: 'PROTEGÉ'},
  ],
  ctaText: 'DESCARGÁ LA GUÍA GRATIS',
  ctaSub: 'Acceso inmediato · Cupos limitados',
  cornerTag: 'PIEL MADURA · 50+',
  accent: '#d9b45c',
  copper: '#b87333',
};

// ----------------------------------------------------- ROMERO (botánico) ----
const RosemarySprig: React.FC<{
  len?: number;
  color?: string;
  seed?: string;
}> = ({len = 130, color = C.green, seed = 'sprig'}) => {
  const needles = useMemo(() => {
    const arr: {y: number; jitter: number; l: number}[] = [];
    const n = Math.max(4, Math.floor(len / 15));
    for (let i = 1; i <= n; i++) {
      arr.push({
        y: (i / n) * len,
        jitter: (random(`${seed}-a${i}`) - 0.5) * 16,
        l: 13 + random(`${seed}-l${i}`) * 10,
      });
    }
    return arr;
  }, [len, seed]);
  return (
    <g>
      <path
        d={`M0 0 Q 8 ${-len * 0.5} 0 ${-len}`}
        stroke={color}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {needles.map((nd, i) => (
        <g key={i} transform={`translate(2 ${-nd.y}) rotate(${nd.jitter * 0.4})`}>
          <line x1={0} y1={0} x2={-nd.l} y2={-nd.l * 0.55} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={0} x2={nd.l} y2={-nd.l * 0.55} stroke={color} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
      <circle cx={0} cy={-len - 2} r={4} fill={color} />
    </g>
  );
};

// ----------------------------------------------------------- PAPEL ROTO -----
function tornPath(w: number, h: number, tear: number, seed: string): string {
  const step = 22;
  const pts: Array<[number, number]> = [];
  const j = (n: string) => (random(seed + n) - 0.5) * 2 * tear;
  for (let x = 0; x <= w; x += step) pts.push([x + j(`t${x}`), j(`ty${x}`)]);
  for (let y = step; y <= h; y += step) pts.push([w + j(`r${y}`), y + j(`ry${y}`)]);
  for (let x = w - step; x >= 0; x -= step) pts.push([x + j(`b${x}`), h + j(`by${x}`)]);
  for (let y = h - step; y > 0; y -= step) pts.push([j(`l${y}`), y + j(`ly${y}`)]);
  return 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') + ' Z';
}

// -------------------------------------------------------------- BACKDROP ----
const Backdrop: React.FC<{frame: number}> = ({frame}) => {
  const fade = interpolate(frame, [0, 14], [0, 1], CLAMP);
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 30% 18%, ${C.bg2} 0%, ${C.bg1} 46%, ${C.bg0} 100%)`,
        }}
      />
      {/* Grid técnico con deriva lenta */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: fade * 0.9}}>
        <defs>
          <pattern id="fedGs" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="rgba(217,180,92,0.05)" strokeWidth="1" />
          </pattern>
          <pattern id="fedGl" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M240 0H0V240" fill="none" stroke="rgba(217,180,92,0.1)" strokeWidth="1" />
            <circle cx="0" cy="0" r="2" fill="rgba(217,180,92,0.16)" />
          </pattern>
        </defs>
        <g transform={`translate(${Math.sin(frame / 140) * 6} 0)`}>
          <rect width="1920" height="1080" fill="url(#fedGs)" />
          <rect width="1920" height="1080" fill="url(#fedGl)" />
        </g>
      </svg>
      {/* Luz volumétrica cálida */}
      <div
        style={{
          position: 'absolute',
          inset: '-10% -20%',
          background: 'linear-gradient(105deg, transparent 40%, rgba(233,199,120,0.09) 50%, transparent 62%)',
          filter: 'blur(24px)',
          transform: `translateX(${Math.sin(frame / 110) * 70}px)`,
          opacity: fade,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-10% -20%',
          background: 'linear-gradient(118deg, transparent 55%, rgba(184,115,51,0.08) 66%, transparent 78%)',
          filter: 'blur(32px)',
          transform: `translateX(${Math.sin(frame / 90 + 2) * -60}px)`,
          opacity: fade,
        }}
      />
      {/* Glow ambiental superior-izquierdo */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          top: -260,
          width: 900,
          height: 700,
          background: 'radial-gradient(closest-side, rgba(217,180,92,0.14), transparent)',
          filter: 'blur(40px)',
          opacity: fade,
        }}
      />
    </>
  );
};

// ------------------------------------------------------------------ DUST ----
const Dust: React.FC<{count: number; seed: string; near?: boolean; frame: number}> = ({
  count,
  seed,
  near = false,
  frame,
}) => {
  const motes = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        x: random(`${seed}-x${i}`) * 1920,
        y0: random(`${seed}-y${i}`) * 1250,
        s: (near ? 3 : 1.2) + random(`${seed}-s${i}`) * (near ? 4.5 : 2.4),
        sp: 0.3 + random(`${seed}-sp${i}`) * 0.7,
        o: 0.14 + random(`${seed}-o${i}`) * 0.4,
        drift: (random(`${seed}-d${i}`) - 0.5) * 46,
      })),
    [count, seed, near]
  );
  return (
    <>
      {motes.map((m, i) => {
        const y = 1160 - ((m.y0 + frame * m.sp * 2.4) % 1260);
        const x = m.x + Math.sin((frame * m.sp + i * 37) / 55) * m.drift;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: m.s,
              height: m.s,
              borderRadius: 99,
              background: '#e8cf8f',
              opacity: m.o,
              filter: near ? 'blur(2.6px)' : 'blur(0.6px)',
              boxShadow: '0 0 8px rgba(232,207,143,0.55)',
            }}
          />
        );
      })}
    </>
  );
};

// --------------------------------------------------------------- VIGNETTE ---
const Vignette: React.FC = () => (
  <>
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(6,4,2,0.62) 100%)'}}
    />
    <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(6,4,2,0.5), transparent 22%)'}} />
  </>
);

const FilmGrain: React.FC = () => (
  <svg
    width="1920"
    height="1080"
    style={{position: 'absolute', inset: 0, opacity: 0.55, mixBlendMode: 'overlay', pointerEvents: 'none'}}
  >
    <filter id="fedFilm">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" stitchTiles="stitch" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1  0 0 0 0 0.92  0 0 0 0 0.75  0 0 0 0.05 0"
      />
    </filter>
    <rect width="1920" height="1080" filter="url(#fedFilm)" />
  </svg>
);

// ============================================================ FICHA PAPEL ===
const PaperNote: React.FC<{
  cfg: FedPromoProps;
  delay: number;
  left: number;
  top: number;
  scale?: number;
}> = ({cfg, delay, left, top, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 88, mass: 1.15}});
  const rot = interpolate(enter, [0, 1], [-13, -2.4]) + Math.sin((frame - delay) / 40) * 0.6 * enter;
  const ex = interpolate(enter, [0, 1], [-220, 0]);
  const ey = interpolate(enter, [0, 1], [130, 0]);

  const paperD = useMemo(() => tornPath(800, 640, 9, 'fedpaper'), []);

  // Tipeo del título
  const t0 = delay + 24;
  const typed = Math.floor(
    interpolate(frame - t0, [0, cfg.noteTitle.length * 2.3], [0, cfg.noteTitle.length], CLAMP)
  );
  const typing = frame >= t0 && frame < t0 + cfg.noteTitle.length * 2.3 + 8;
  const caretOp = frame % 16 < 10 ? 1 : 0;
  const dividerW = interpolate(frame, [t0 + 12, t0 + 38], [0, 620], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const bStart = delay + 56;
  const sigP = interpolate(frame, [delay + 108, delay + 134], [0, 1], CLAMP);
  const seal = spring({frame: frame - (delay + 112), fps, config: {damping: 9, stiffness: 130}});

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translate(${ex}px, ${ey}px) rotate(${rot}deg) scale(${scale * (0.86 + 0.14 * enter)})`,
        opacity: enter,
        filter: 'drop-shadow(0 30px 44px rgba(0,0,0,0.6))',
        transformOrigin: '50% 60%',
      }}
    >
      <svg width={880} height={720} viewBox="0 0 880 720">
        <defs>
          <linearGradient id="fedNpaper" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#f7eeda" />
            <stop offset="0.55" stopColor={C.paper} />
            <stop offset="1" stopColor={C.paperShade} />
          </linearGradient>
          <radialGradient id="fedNseal" cx="0.35" cy="0.3" r="1">
            <stop offset="0" stopColor="#e2a45e" />
            <stop offset="0.55" stopColor={C.copper} />
            <stop offset="1" stopColor="#6e4318" />
          </radialGradient>
          <linearGradient id="fedNcurl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d8c69e" />
            <stop offset="1" stopColor="#b6a176" />
          </linearGradient>
          <filter id="fedNtear">
            <feTurbulence type="turbulence" baseFrequency="0.028" numOctaves="4" seed="11" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="fedNgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.1  0 0 0 0.08 0" />
          </filter>
          <filter id="fedNblur2">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <clipPath id="fedNclip">
            <path d={paperD} transform="translate(40 40)" />
          </clipPath>
        </defs>

        {/* Cuerpo del papel con borde rasgado */}
        <g filter="url(#fedNtear)">
          <path d={paperD} transform="translate(40 40)" fill="url(#fedNpaper)" />
          <path d={paperD} transform="translate(40 40)" fill="none" stroke="rgba(58,44,24,0.12)" strokeWidth="2" />
        </g>
        {/* Textura + sombra interna + mancha de café */}
        <g clipPath="url(#fedNclip)">
          <rect x="40" y="40" width="800" height="640" filter="url(#fedNgrain)" />
          <rect x="40" y="40" width="800" height="120" fill="url(#fedNpaper)" opacity="0" />
          <rect x="40" y="40" width="800" height="90" fill="rgba(58,44,24,0.07)" />
          <circle cx="668" cy="182" r="58" fill="none" stroke="rgba(133,94,40,0.1)" strokeWidth="6" filter="url(#fedNblur2)" />
        </g>

        {/* Cinta adhesiva dorada */}
        <g transform="translate(440 38) rotate(-3)" opacity={0.95 * enter}>
          <rect x={-118} y={-26} width={236} height={52} rx={5} fill="rgba(217,180,92,0.34)" stroke="rgba(255,246,220,0.35)" strokeWidth="1.5" />
          <line x1={-104} y1={0} x2={104} y2={0} stroke="rgba(255,246,220,0.25)" strokeWidth="1" />
        </g>

        {/* Título que se escribe solo */}
        <text x={96} y={152} fontFamily={SERIF} fontWeight={700} fontSize={46} fill={C.ink}>
          {cfg.noteTitle.slice(0, typed)}
        </text>
        {typing && (
          <rect x={96 + typed * 21.6} y={118} width={5} height={42} fill={cfg.accent} opacity={caretOp} />
        )}
        <line x1={96} y1={184} x2={96 + dividerW} y2={184} stroke={cfg.accent} strokeWidth={3} opacity={0.85} />

        {/* Bullets con resorte escalonado */}
        {cfg.bullets.map((b, i) => {
          const b0 = bStart + i * 13;
          const be = spring({frame: frame - b0, fps, config: {damping: 13, stiffness: 115}});
          const mk = spring({frame: frame - (b0 + 2), fps, config: {damping: 8, stiffness: 160}});
          const by = 252 + i * 88;
          return (
            <g key={i} transform={`translate(${(1 - be) * 40} ${by})`} opacity={be}>
              <g transform={`translate(112 -8) rotate(45) scale(${mk})`}>
                <rect x={-8} y={-8} width={16} height={16} fill={cfg.accent} />
                <rect x={-3} y={-3} width={6} height={6} fill={C.paper} />
              </g>
              <text x={142} y={2} fontFamily={SANS} fontWeight={600} fontSize={30} letterSpacing={0.3} fill={C.inkSoft}>
                {b}
              </text>
              <line x1={142} y1={18} x2={142 + b.length * 14.2} y2={18} stroke="rgba(184,115,51,0.28)" strokeWidth={2} />
            </g>
          );
        })}

        {/* Firma + flourish */}
        <g opacity={interpolate(frame, [delay + 100, delay + 116], [0, 1], CLAMP)}>
          <text x={96} y={618} fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.copperDeep}>
            Dr. Federer
          </text>
          <path
            d="M96 632 Q 185 648 308 626"
            fill="none"
            stroke={C.copper}
            strokeWidth={2.4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - sigP}
          />
        </g>

        {/* Sello de cera con monograma */}
        <g transform={`translate(736 600) rotate(-8) scale(${seal})`} opacity={seal}>
          <circle r={48} fill="rgba(0,0,0,0.25)" cy={4} />
          <circle r={46} fill="url(#fedNseal)" />
          <circle r={36} fill="none" stroke={C.goldHi} strokeWidth={2} opacity={0.8} />
          <text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={38} fill={C.cream}>
            F
          </text>
        </g>

        {/* Curl de esquina */}
        <g opacity={enter}>
          <path d="M758 678 L838 598 L838 678 Z" fill="url(#fedNcurl)" />
          <path d="M758 678 L838 598" stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
        </g>
      </svg>
    </div>
  );
};

// ===================================================== PERSONAJE (GOTERO) ===
const BotCharacter: React.FC<{
  cfg: FedPromoProps;
  delay: number;
  cx: number;
  cy: number;
  scale?: number;
  cheerAt?: number;
}> = ({cfg, delay, cx, cy, scale = 1, cheerAt = 182}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 92, mass: 1}});
  const ex = interpolate(enter, [0, 1], [430, 0]);
  const erot = interpolate(enter, [0, 1], [16, 0]);

  const floatY = Math.sin((frame - delay) / 22) * 10 * enter;
  const jt = frame - cheerAt;
  const jump = jt > 0 && jt < 26 ? Math.sin((jt / 26) * Math.PI) * -36 : 0;
  const wob = jt > 0 ? Math.sin(jt / 3) * Math.exp(-jt / 34) * 4 : 0;
  const rot = erot + Math.sin((frame - delay) / 34) * 1.6 * enter + wob;

  // Parpadeo determinista
  const bt = (frame + 30) % 84;
  const blink = bt < 9 ? interpolate(bt, [0, 4.5, 9], [1, 0.06, 1], CLAMP) : 1;
  const eyeGlow = 0.85 + Math.sin(frame / 18) * 0.15;

  const wave = Math.sin(frame / 9) * 12 * enter + (jt > 0 && jt < 34 ? Math.sin(jt / 4) * 22 * (1 - jt / 34) : 0);
  const sprigSway = Math.sin(frame / 30) * 5;
  const shineT = ((frame + 60) % 220) / 220;
  const shineX = interpolate(shineT, [0, 1], [-120, 420]);
  const spark = jt > 2 && jt < 22 ? Math.sin(((jt - 2) / 20) * Math.PI) : 0;

  const bodyClip = 'fedCbody';

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 230 * scale,
        top: cy - 300 * scale,
        transform: `translate(${ex}px, ${floatY + jump}px) rotate(${rot}deg) scale(${scale * (0.7 + 0.3 * enter)})`,
        opacity: enter,
        transformOrigin: '50% 70%',
      }}
    >
      <svg width={460} height={600} viewBox="0 0 460 600">
        <defs>
          <linearGradient id="fedCamber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f2410" />
            <stop offset="0.45" stopColor={C.amberGlass} />
            <stop offset="0.75" stopColor="#c98a3d" />
            <stop offset="1" stopColor="#7a4a1e" />
          </linearGradient>
          <linearGradient id="fedCgold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.goldHi} />
            <stop offset="0.5" stopColor={cfg.accent} />
            <stop offset="1" stopColor={cfg.copper} />
          </linearGradient>
          <radialGradient id="fedCeye" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor="#fff6da" />
            <stop offset="1" stopColor="#ffd98a" />
          </radialGradient>
          <filter id="fedCglow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={bodyClip}>
            <rect x={115} y={190} width={230} height={290} rx={64} />
          </clipPath>
        </defs>

        {/* Sombra dinámica */}
        <ellipse
          cx={230}
          cy={548}
          rx={118 * (1 + floatY * 0.004)}
          ry={19}
          fill="black"
          opacity={0.34 - floatY * 0.004}
        />

        {/* Brazo-hoja izquierdo */}
        <g transform={`translate(116 352) rotate(${-24 - wave * 0.4})`}>
          <line x1={0} y1={0} x2={-26} y2={6} stroke={C.greenDeep} strokeWidth={5} strokeLinecap="round" />
          <path d="M-26 6 Q -58 -14 -88 2 Q -56 18 -26 6 Z" fill={C.green} stroke={C.greenDeep} strokeWidth={2} />
        </g>
        {/* Brazo-hoja derecho (saluda) */}
        <g transform={`translate(344 352) rotate(${18 + wave})`}>
          <line x1={0} y1={0} x2={26} y2={6} stroke={C.greenDeep} strokeWidth={5} strokeLinecap="round" />
          <path d="M26 6 Q 58 -14 88 2 Q 56 18 26 6 Z" fill={C.green} stroke={C.greenDeep} strokeWidth={2} />
        </g>

        {/* Cuerpo de vidrio ámbar */}
        <rect x={115} y={190} width={230} height={290} rx={64} fill="url(#fedCamber)" stroke="rgba(243,223,160,0.25)" strokeWidth={2} />
        <g clipPath={`url(#${bodyClip})`}>
          <path d="M115 302 Q 172 290 230 302 T 345 302 V 480 H 115 Z" fill="#2e1a0a" opacity={0.85} />
          <rect x={140} y={215} width={24} height={195} rx={12} fill="white" opacity={0.16} />
          <rect x={174} y={225} width={9} height={120} rx={4.5} fill="white" opacity={0.1} />
          <rect
            x={shineX}
            y={170}
            width={64}
            height={330}
            fill="white"
            opacity={0.1}
            transform="skewX(-18)"
          />
        </g>

        {/* Cuello + collarín + tapa gotero dorada */}
        <rect x={196} y={160} width={68} height={26} fill="#5b3413" />
        <rect x={178} y={178} width={104} height={18} rx={9} fill={C.copperDeep} />
        <rect x={180} y={86} width={100} height={80} rx={14} fill="url(#fedCgold)" stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
        {[196, 214, 232, 250, 266].map((rx) => (
          <line key={rx} x1={rx} y1={94} x2={rx} y2={158} stroke="rgba(58,36,8,0.22)" strokeWidth={4} strokeLinecap="round" />
        ))}
        <rect x={192} y={56} width={76} height={34} rx={17} fill="#5c3a16" stroke="rgba(243,223,160,0.3)" strokeWidth={1.5} />

        {/* Ramita de romero en la tapa */}
        <g transform={`translate(286 92) rotate(${30 + sprigSway})`}>
          <RosemarySprig len={118} seed="fedchar" />
        </g>

        {/* Ojos luminosos con parpadeo */}
        {[185, 275].map((ecx) => (
          <g key={ecx} transform={`translate(${ecx} 300) scale(1 ${blink}) translate(${-ecx} -300)`}>
            <ellipse cx={ecx} cy={300} rx={17} ry={30} fill="url(#fedCeye)" opacity={eyeGlow} filter="url(#fedCglow)" />
            <circle cx={ecx - 4} cy={288} r={4.5} fill="white" opacity={0.9} />
          </g>
        ))}
        {/* Sonrisa + rubor */}
        <path d="M206 358 Q 230 375 254 358" fill="none" stroke="#7a4a1e" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={156} cy={342} rx={14} ry={8} fill="#c97b4a" opacity={0.3} />
        <ellipse cx={304} cy={342} rx={14} ry={8} fill="#c97b4a" opacity={0.3} />

        {/* Chispa de alegría al celebrar */}
        {spark > 0 && (
          <path
            d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z"
            transform={`translate(322 236) scale(${spark}) rotate(${frame * 3})`}
            fill={C.goldHi}
            opacity={spark}
          />
        )}

        {/* Etiqueta premium */}
        <g>
          <rect x={145} y={402} width={170} height={62} rx={10} fill={C.paper} stroke={cfg.accent} strokeWidth={2} />
          <text x={230} y={432} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={19} letterSpacing={2.5} fill="#7a5a26">
            PIEL JOVEN
          </text>
          <text x={230} y={452} textAnchor="middle" fontFamily={SANS} fontSize={10.5} letterSpacing={2} fill="#8a6a3a">
            ROMERO · DR. FEDERER
          </text>
        </g>
      </svg>
    </div>
  );
};

// ==================================================== NODOS DEL MÉTODO =====
const MethodNodes: React.FC<{
  cfg: FedPromoProps;
  delay: number;
  pts: {x: number; y: number}[];
}> = ({cfg, delay, pts}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const segDur = 22;
  const segGap = 16;
  const all = useMemo(
    () => [{x: pts[0].x - 170, y: pts[0].y + 30}, ...pts, {x: pts[pts.length - 1].x + 130, y: pts[pts.length - 1].y - 14}],
    [pts]
  );
  const nSeg = all.length - 1;
  const doneAt = delay + nSeg * (segDur + segGap);
  const labelOp = interpolate(frame, [delay - 4, delay + 10], [0, 1], CLAMP);

  // Pulso viajero
  const pt = (frame - doneAt - 6) / 150;
  const pulseOn = pt > 0;
  const tp = pulseOn ? pt % 1 : 0;
  const segF = Math.min(nSeg - 1, Math.floor(tp * nSeg));
  const local = tp * nSeg - segF;
  const px = all[segF].x + (all[segF + 1].x - all[segF].x) * local;
  const py = all[segF].y + (all[segF + 1].y - all[segF].y) * local;
  const pulseOp = pulseOn ? Math.sin(tp * Math.PI) : 0;

  return (
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <radialGradient id="fedSfill" cx="0.5" cy="0.38" r="0.9">
          <stop offset="0" stopColor="#2c2010" />
          <stop offset="1" stopColor="#100b06" />
        </radialGradient>
        <radialGradient id="fedSglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(217,180,92,0.4)" />
          <stop offset="1" stopColor="rgba(217,180,92,0)" />
        </radialGradient>
        <linearGradient id="fedSnum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.goldHi} />
          <stop offset="0.55" stopColor={cfg.accent} />
          <stop offset="1" stopColor={cfg.copper} />
        </linearGradient>
        <filter id="fedSsoft" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rótulo de la tira */}
      <g opacity={labelOp}>
        <rect x={all[0].x - 4} y={pts[0].y - 102} width={44} height={3} fill={cfg.accent} />
        <text x={all[0].x - 6} y={pts[0].y - 114} fontFamily={SANS} fontWeight={700} fontSize={18} letterSpacing={5} fill={cfg.accent} opacity={0.9}>
          {cfg.stepsLabel}
        </text>
      </g>

      {/* Líneas que se dibujan */}
      {all.slice(0, -1).map((a, i) => {
        const b = all[i + 1];
        const s0 = delay + i * (segDur + segGap);
        const p = interpolate(frame, [s0, s0 + segDur], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(217,180,92,0.14)" strokeWidth={7} strokeLinecap="round" />
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={cfg.accent}
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={0.95}
            />
          </g>
        );
      })}

      {/* Nodos numerados */}
      {pts.map((ptPos, i) => {
        const popAt = delay + i * (segDur + segGap) + segDur - 6;
        const pop = spring({frame: frame - popAt, fps, config: {damping: 10, stiffness: 150}});
        const lab = interpolate(frame, [popAt + 6, popAt + 18], [0, 1], CLAMP);
        return (
          <g key={i} transform={`translate(${ptPos.x} ${ptPos.y}) scale(${pop})`} opacity={pop}>
            <circle r={86} fill="url(#fedSglow)" />
            <circle r={70} fill="none" stroke="rgba(217,180,92,0.4)" strokeWidth={2} strokeDasharray="4 14" transform={`rotate(${frame * 0.5 + i * 40})`} />
            <circle r={58} fill="url(#fedSfill)" stroke={cfg.accent} strokeWidth={3} />
            <circle r={58} fill="none" stroke="rgba(243,223,160,0.5)" strokeWidth={1} strokeDasharray={`${0.35 * Math.PI * 116} ${999}`} transform="rotate(-100)" opacity={0.7} />
            <text y={17} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={46} fill="url(#fedSnum)">
              {cfg.steps[i]?.num ?? `0${i + 1}`}
            </text>
            <text y={104} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={21} letterSpacing={4} fill={C.cream} opacity={lab}>
              {cfg.steps[i]?.label ?? ''}
            </text>
          </g>
        );
      })}

      {/* Pulso de luz viajero */}
      {pulseOn && (
        <circle cx={px} cy={py} r={6} fill="#ffe9a8" opacity={pulseOp} filter="url(#fedSsoft)" />
      )}
    </svg>
  );
};

// ============================================================= HEADLINE =====
const Headline: React.FC<{cfg: FedPromoProps; delay: number}> = ({cfg, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kOp = interpolate(frame, [delay, delay + 14], [0, 1], CLAMP);
  const kX = interpolate(frame, [delay, delay + 16], [-30, 0], CLAMP);
  const words = cfg.headline.split(' ');
  const under = interpolate(frame, [delay + 26, delay + 52], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  return (
    <div style={{position: 'absolute', left: 140, top: 66}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: kOp,
          transform: `translateX(${kX}px)`,
        }}
      >
        <div style={{width: 46, height: 2, background: cfg.accent}} />
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: cfg.accent}}>
          {cfg.kicker}
        </div>
      </div>
      <div style={{marginTop: 18, fontFamily: SERIF, fontWeight: 700, fontSize: 68, color: C.cream, lineHeight: 1.04}}>
        {words.map((w, i) => {
          const ws = spring({frame: frame - (delay + 8 + i * 7), fps, config: {damping: 16, stiffness: 120}});
          const goldWord = /piel|joven/i.test(w);
          return (
            <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: 20, paddingBottom: 6}}>
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${(1 - ws) * 115}%)`,
                  ...(goldWord
                    ? {
                        backgroundImage: `linear-gradient(100deg, ${C.goldHi}, ${cfg.accent} 55%, ${cfg.copper})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }
                    : {}),
                }}
              >
                {w}
              </span>
            </span>
          );
        })}
      </div>
      <svg width={540} height={24} style={{marginTop: 10}}>
        <path
          d="M2 14 C 130 2, 340 26, 538 10"
          fill="none"
          stroke={cfg.accent}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - under}
        />
        <circle cx={540 * under} cy={12} r={4} fill={C.goldHi} opacity={under > 0.02 && under < 0.98 ? 1 : 0} />
      </svg>
    </div>
  );
};

// ================================================================== CTA =====
const CtaButton: React.FC<{
  cfg: FedPromoProps;
  delay: number;
  left: number;
  top: number;
}> = ({cfg, delay, left, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 125, mass: 0.9}});
  const sub = interpolate(frame, [delay + 12, delay + 26], [0, 1], CLAMP);

  const shT = frame - delay - 26;
  const sh = shT > 0 ? (shT % 55) / 55 : 0;
  const shX = interpolate(sh, [0, 1], [-220, 560]);
  const pu = ((frame - delay) % 48) / 48;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translateY(${(1 - e) * 60}px) scale(${0.55 + 0.45 * e})`,
        opacity: e,
        transformOrigin: '50% 50%',
      }}
    >
      {/* Anillo de pulso */}
      <div
        style={{
          position: 'absolute',
          inset: -7,
          borderRadius: 60,
          border: `2px solid rgba(217,180,92,${0.55 * (1 - pu)})`,
          transform: `scale(${1 + pu * 0.13})`,
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          inset: -18,
          borderRadius: 70,
          background: 'radial-gradient(closest-side, rgba(217,180,92,0.35), transparent)',
          filter: 'blur(14px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: 460,
          height: 92,
          borderRadius: 46,
          background: `linear-gradient(120deg, ${C.goldHi}, ${cfg.accent} 45%, ${cfg.copper})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.25), 0 14px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Shimmer */}
        {shT > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -20,
              bottom: -20,
              left: shX,
              width: 90,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              transform: 'skewX(-18deg)',
            }}
          />
        )}
        <svg width={30} height={30} viewBox="0 0 28 28">
          <path d="M5 18 v5 h18 v-5 M14 4 v13 M8.5 12 L14 17.5 L19.5 12" fill="none" stroke="#3a2408" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: '#3a2408'}}>
          {cfg.ctaText}
        </span>
      </div>
      <div
        style={{
          marginTop: 16,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: 3,
          color: 'rgba(242,231,207,0.75)',
          opacity: sub,
        }}
      >
        {cfg.ctaSub}
      </div>
    </div>
  );
};

// ============================================== COMP 1 · FICHA AISLADA ======
const FedPromoNoteScene: React.FC<{cfg: FedPromoProps}> = ({cfg}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg0, overflow: 'hidden'}}>
      <Backdrop frame={frame} />
      <Dust count={14} seed="noteFar" frame={frame} />
      <PaperNote cfg={cfg} delay={8} left={520} top={170} scale={1} />
      <Dust count={7} seed="noteNear" near frame={frame} />
      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};

// ========================================= COMP 2 · PERSONAJE AISLADO =======
const FedPromoCharacterScene: React.FC<{cfg: FedPromoProps}> = ({cfg}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg0, overflow: 'hidden'}}>
      <Backdrop frame={frame} />
      <Dust count={14} seed="charFar" frame={frame} />
      <BotCharacter cfg={cfg} delay={10} cx={960} cy={548} scale={1.25} cheerAt={112} />
      <Dust count={7} seed="charNear" near frame={frame} />
      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};

// ============================================= COMP 3 · ESCENA CTA FULL =====
const FedPromoFullScene: React.FC<{cfg: FedPromoProps}> = ({cfg}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Push-in cinematográfico
  const cam = interpolate(frame, [0, durationInFrames], [1, 1.045], CLAMP);
  const camY = interpolate(frame, [0, durationInFrames], [0, -10], CLAMP);
  const par = (f: number) => (cam - 1) * 900 * f;

  const sway = Math.sin(frame / 60) * 3;

  return (
    <AbsoluteFill style={{background: C.bg0, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${cam}) translateY(${camY}px)`}}>
        {/* PLANO 0 · fondo */}
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-par(0.25)}px)`}}>
          <Backdrop frame={frame} />
        </div>
        {/* PLANO 1 · polvo lejano */}
        <Dust count={18} seed="fullFar" frame={frame} />

        {/* PLANO 2 · contenido */}
        <Headline cfg={cfg} delay={14} />
        <div
          style={{
            position: 'absolute',
            right: 140,
            top: 78,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: interpolate(frame, [20, 34], [0, 0.8], CLAMP),
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: 9, background: cfg.accent, boxShadow: `0 0 10px ${cfg.accent}`}} />
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: 4, color: 'rgba(242,231,207,0.8)'}}>
            {cfg.cornerTag}
          </span>
        </div>

        <PaperNote cfg={cfg} delay={10} left={120} top={215} scale={0.95} />
        <MethodNodes cfg={cfg} delay={88} pts={[{x: 470, y: 940}, {x: 790, y: 962}, {x: 1110, y: 936}]} />
        <BotCharacter cfg={cfg} delay={40} cx={1520} cy={498} scale={1.08} cheerAt={182} />
        <CtaButton cfg={cfg} delay={176} left={1270} top={876} />

        {/* PLANO 3 · polvo cercano */}
        <Dust count={10} seed="fullNear" near frame={frame} />

        {/* PLANO 4 · hojas foreground desenfocadas (rack focus) */}
        <svg
          width="1920"
          height="1080"
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(13px)',
            opacity: 0.8,
            transform: `translateX(${par(0.9)}px)`,
            pointerEvents: 'none',
          }}
        >
          <g transform={`translate(-30 1160) rotate(${38 + sway}) scale(4.4)`}>
            <RosemarySprig len={150} color="#141a10" seed="fgA" />
          </g>
          <g transform={`translate(1970 -80) rotate(${165 - sway}) scale(3.6)`}>
            <RosemarySprig len={150} color="#10150c" seed="fgB" />
          </g>
        </svg>
      </AbsoluteFill>

      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};

// ================================================================ ROOT ======
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="FedPromo-Note"
      component={FedPromoNoteScene}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{cfg: DEFAULTS}}
    />
    <Composition
      id="FedPromo-Character"
      component={FedPromoCharacterScene}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{cfg: DEFAULTS}}
    />
    <Composition
      id="FedPromo-Full"
      component={FedPromoFullScene}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{cfg: DEFAULTS}}
    />
  </>
);

registerRoot(RemotionRoot);
