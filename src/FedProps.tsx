import React from 'react';
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

/* ================= PALETA FEDERER ================= */
const C = {
  bg0: '#0B0805', bg1: '#16100A', panel: '#1D150C', panel2: '#261B0F',
  gold: '#E0A83F', goldHi: '#F6D78B', goldSoft: '#C89234',
  copper: '#B87333', bronze: '#8C6239', bronzeDark: '#5C3F22',
  cream: '#F4EAD6', creamDim: '#CBB892', paper: '#F2E7CE', paperHi: '#FBF4E4',
  sage: '#93A86B', sageDeep: '#5A6B3E',
  ink: '#241A0E', inkSoft: '#5A452B', dark: '#120D07',
};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FI = (f: number, a: number, b: number, v0 = 0, v1 = 1) =>
  interpolate(f, [a, b], [v0, v1], CL);
const SPR = (f: number, fps: number, delay = 0, damping = 16, stiffness = 140, mass = 0.9) =>
  spring({frame: f - delay, fps, config: {damping, stiffness, mass}});
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Segoe UI", Tahoma, Verdana, sans-serif';
const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 55%, ${C.copper} 100%)`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
};
const Kicker: React.FC<{text: string; color?: string; size?: number; style?: React.CSSProperties}> =
  ({text, color = C.gold, size = 26, style}) => (
    <div style={{fontFamily: SANS, fontSize: size, letterSpacing: size * 0.42, color, fontWeight: 600, ...style}}>
      {text}
    </div>
  );

/* ================= BACKDROP CINEMATOGRÁFICO ================= */
const Backdrop: React.FC<{seed?: string; glowX?: number; glowY?: number; glowColor?: string; grid?: number; dust?: number}> =
  ({seed = 'bg', glowX = 0.74, glowY = 0.26, glowColor = C.gold, grid = 1, dust = 26}) => {
    const frame = useCurrentFrame();
    const {width, height} = useVideoConfig();
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < dust; i++) {
      const rx = random(`${seed}-x${i}`);
      const ry = random(`${seed}-y${i}`);
      const rr = random(`${seed}-r${i}`);
      const rs = random(`${seed}-s${i}`);
      const y = (((ry * height - frame * (0.25 + rs * 0.8)) % height) + height) % height;
      const x = rx * width + Math.sin(frame / 50 + i) * 12;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 30 + i * 1.7));
      dots.push(<circle key={i} cx={x} cy={y} r={1.2 + rr * 2.6} fill={C.goldHi} opacity={0.1 + 0.3 * tw} />);
    }
    const bokeh: React.ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      bokeh.push(
        <circle key={i} cx={random(`${seed}-bx${i}`) * width} cy={random(`${seed}-by${i}`) * height}
          r={60 + random(`${seed}-br${i}`) * 150} fill={C.gold} opacity={0.05} filter={`url(#${seed}-blur)`} />
      );
    }
    const drift = frame * 0.08;
    return (
      <AbsoluteFill style={{background: `radial-gradient(130% 100% at 50% 12%, ${C.bg1} 0%, ${C.bg0} 58%, #060402 100%)`}}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute'}}>
          <defs>
            <pattern id={`${seed}-gf`} width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0H0V26" fill="none" stroke={C.gold} strokeOpacity="0.035" strokeWidth="1" />
            </pattern>
            <pattern id={`${seed}-gc`} width="130" height="130" patternUnits="userSpaceOnUse">
              <path d="M130 0H0V130" fill="none" stroke={C.gold} strokeOpacity="0.07" strokeWidth="1" />
            </pattern>
            <radialGradient id={`${seed}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={glowColor} stopOpacity="0.2" />
              <stop offset="55%" stopColor={glowColor} stopOpacity="0.05" />
              <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${seed}-vig`} cx="50%" cy="48%" r="78%">
              <stop offset="52%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
            </radialGradient>
            <filter id={`${seed}-blur`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <rect width={width} height={height} fill={`url(#${seed}-gf)`} opacity={grid} />
          <g transform={`translate(${-(drift % 130)} ${-((drift * 0.6) % 130)})`}>
            <rect x={-130} y={-130} width={width + 260} height={height + 260} fill={`url(#${seed}-gc)`} opacity={grid} />
          </g>
          {bokeh}
          <ellipse cx={width * glowX} cy={height * glowY} rx={width * 0.55} ry={height * 0.6} fill={`url(#${seed}-glow)`} />
          {dots}
          <rect width={width} height={height} fill={`url(#${seed}-vig)`} />
        </svg>
      </AbsoluteFill>
    );
  };

/* ================= RAMITA DE ROMERO (procedural) ================= */
const Sprig: React.FC<{len?: number; color?: string; tip?: string; draw?: number; w?: number}> =
  ({len = 220, color = C.sageDeep, tip = C.sage, draw = 1, w = 5}) => {
    const P1 = {x: len * 0.09, y: -len * 0.36};
    const P2 = {x: -len * 0.07, y: -len * 0.72};
    const P3 = {x: len * 0.05, y: -len};
    const pt = (t: number) => ({
      x: 3 * (1 - t) ** 2 * t * P1.x + 3 * (1 - t) * t * t * P2.x + t ** 3 * P3.x,
      y: 3 * (1 - t) ** 2 * t * P1.y + 3 * (1 - t) * t * t * P2.y + t ** 3 * P3.y,
    });
    const needles: React.ReactNode[] = [];
    const n = Math.max(6, Math.floor(len / 15));
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const p = pt(t);
      const p2 = pt(Math.min(1, t + 0.02));
      const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      const L = (10 + 16 * (1 - t)) * (w / 5);
      const vis = FI(draw, t * 0.9, t * 0.9 + 0.12);
      if (vis <= 0.01) continue;
      const col = t > 0.6 ? tip : color;
      needles.push(
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${ang})`} opacity={vis}>
          <line x1="0" y1="0" x2={L} y2={-L * 0.5} stroke={col} strokeWidth={w * 0.55} strokeLinecap="round" />
          <line x1="0" y1="0" x2={L * 0.9} y2={L * 0.55} stroke={col} strokeWidth={w * 0.55} strokeLinecap="round" />
        </g>
      );
    }
    return (
      <g>
        <path d={`M0 0 C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`} fill="none"
          stroke={color} strokeWidth={w} strokeLinecap="round"
          pathLength={1} strokeDasharray="1" strokeDashoffset={1 - FI(draw, 0, 0.35)} />
        {needles}
        <circle cx={P3.x} cy={P3.y} r={w * 0.9} fill={tip} opacity={FI(draw, 0.9, 1)} />
      </g>
    );
  };

/* ================= BORDE RASGADO DE PAPEL ================= */
const tornEdgePath = (w: number, h: number, seed: string, jag = 14, step = 42) => {
  const pts: Array<[number, number]> = [];
  const nx = Math.max(4, Math.floor(w / step));
  const ny = Math.max(4, Math.floor(h / step));
  for (let i = 0; i <= nx; i++) pts.push([(i / nx) * w, (random(`${seed}t${i}`) - 0.5) * jag]);
  for (let i = 1; i <= ny; i++) pts.push([w + (random(`${seed}r${i}`) - 0.5) * jag, (i / ny) * h]);
  for (let i = nx - 1; i >= 0; i--) pts.push([(i / nx) * w, h + (random(`${seed}b${i}`) - 0.5) * jag * 1.7]);
  for (let i = ny - 1; i >= 1; i--) pts.push([(random(`${seed}l${i}`) - 0.5) * jag, (i / ny) * h]);
  return 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L') + ' Z';
};

/* ================= ESTRELLA DE BRILLO ================= */
const Star4: React.FC<{x: number; y: number; r: number; op?: number; rot?: number; color?: string}> =
  ({x, y, r, op = 1, rot = 0, color = C.goldHi}) => (
    <path d={`M0 ${-r} Q ${r * 0.18} ${-r * 0.18} ${r} 0 Q ${r * 0.18} ${r * 0.18} 0 ${r} Q ${-r * 0.18} ${r * 0.18} ${-r} 0 Q ${-r * 0.18} ${-r * 0.18} 0 ${-r} Z`}
      fill={color} opacity={op} transform={`translate(${x} ${y}) rotate(${rot})`} />
  );

/* ================= ROMY — LA MASCOTA BOTÁNICA ================= */
type RomyPose = 'idle' | 'wave' | 'think' | 'cheer' | 'point';
const Romy: React.FC<{frame: number; pose?: RomyPose; x?: number; y?: number; scale?: number; seed?: string}> =
  ({frame, pose = 'idle', x = 0, y = 0, scale = 1, seed = 'romy'}) => {
    const breathe = Math.sin(frame / 22) * 1.5;
    const jump = pose === 'cheer' ? Math.abs(Math.sin(frame / 9)) * 30 : 0;
    const lean = pose === 'point' ? -4 : pose === 'think' ? 3 : Math.sin(frame / 40) * 1.2;
    const waveA = Math.sin(frame / 6) * 16;
    const bl = (frame + 37) % 120;
    const eyeSY = bl < 7 ? interpolate(bl, [0, 3.5, 7], [1, 0.1, 1], CL) : 1;
    let armL = 14 + breathe;
    let armR = -14 - breathe;
    if (pose === 'wave') armR = -150 + waveA;
    if (pose === 'cheer') {armL = 150 + waveA * 0.5; armR = -150 - waveA * 0.5;}
    if (pose === 'think') {armR = 150; armL = 18;}
    if (pose === 'point') {armL = 90; armR = -16;}
    const lookY = pose === 'think' ? -9 : 0;
    const lookX = pose === 'point' ? -7 : 0;
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <ellipse cx="240" cy="512" rx={150 - jump * 0.9} ry="22" fill="#000" opacity={Math.max(0.1, 0.45 - jump * 0.006)} />
        <g transform={`translate(0 ${-jump}) rotate(${lean} 240 300)`}>
          <defs>
            <linearGradient id={`${seed}-body`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C98F3E" />
              <stop offset="55%" stopColor="#A66A26" />
              <stop offset="100%" stopColor="#6E4416" />
            </linearGradient>
            <radialGradient id={`${seed}-visor`} cx="50%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#2A1C0D" />
              <stop offset="100%" stopColor="#140C05" />
            </radialGradient>
            <filter id={`${seed}-glow`} x="-220%" y="-220%" width="540%" height="540%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect x="168" y="452" width="64" height="30" rx="15" fill="#4A2E12" />
          <rect x="248" y="452" width="64" height="30" rx="15" fill="#4A2E12" />
          <g transform={`translate(112 300) rotate(${armL})`}>
            <line x1="0" y1="0" x2="0" y2="88" stroke="#8A5A22" strokeWidth="30" strokeLinecap="round" />
            <circle cx="0" cy="98" r="21" fill="#C98F3E" stroke="#5C3F22" strokeWidth="4" />
          </g>
          <g transform={`translate(368 300) rotate(${armR})`}>
            <line x1="0" y1="0" x2="0" y2="88" stroke="#8A5A22" strokeWidth="30" strokeLinecap="round" />
            <circle cx="0" cy="98" r="21" fill="#C98F3E" stroke="#5C3F22" strokeWidth="4" />
          </g>
          <g transform={`translate(240 285) scale(1 ${1 + breathe * 0.004}) translate(-240 -285)`}>
            <path d="M240 58 C 152 58 108 158 108 262 C 108 384 168 468 240 468 C 312 468 372 384 372 262 C 372 158 328 58 240 58 Z"
              fill={`url(#${seed}-body)`} stroke="#4A2C10" strokeWidth="5" />
            <ellipse cx="196" cy="150" rx="66" ry="42" fill={C.goldHi} opacity="0.16" transform="rotate(-18 196 150)" />
            <ellipse cx="240" cy="382" rx="98" ry="62" fill={C.goldHi} opacity="0.07" />
          </g>
          <g transform="translate(246 64) rotate(-14)">
            <Sprig len={120} w={6} draw={1} color={C.sageDeep} tip={C.sage} />
          </g>
          <ellipse cx="240" cy="212" rx="120" ry="94" fill={`url(#${seed}-visor)`} stroke="#3A2410" strokeWidth="4" />
          <ellipse cx="168" cy="248" rx="18" ry="11" fill={C.copper} opacity="0.5" />
          <ellipse cx="312" cy="248" rx="18" ry="11" fill={C.copper} opacity="0.5" />
          <g transform={`translate(${lookX} ${lookY})`}>
            {pose === 'cheer' ? (
              <g stroke={C.goldHi} strokeWidth="11" strokeLinecap="round" fill="none" filter={`url(#${seed}-glow)`}>
                <path d="M186 202 Q 202 184 218 202" />
                <path d="M262 202 Q 278 184 294 202" />
              </g>
            ) : (
              <g filter={`url(#${seed}-glow)`}>
                <g transform={`translate(200 205) scale(1 ${eyeSY}) translate(-200 -205)`}>
                  <rect x="188" y="176" width="24" height="58" rx="12" fill="#FFE9B0" />
                </g>
                <g transform={`translate(280 205) scale(1 ${eyeSY}) translate(-280 -205)`}>
                  <rect x="268" y="176" width="24" height="58" rx="12" fill="#FFE9B0" />
                </g>
              </g>
            )}
            {pose === 'think' ? (
              <circle cx="240" cy="258" r="8" fill="none" stroke={C.creamDim} strokeWidth="5" opacity="0.8" />
            ) : pose === 'cheer' ? (
              <path d="M214 246 Q 240 280 266 246 Q 240 260 214 246 Z" fill="#FFE9B0" opacity="0.95" />
            ) : (
              <path d="M222 250 Q 240 264 258 250" fill="none" stroke={C.creamDim} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            )}
          </g>
          {pose === 'think' && (
            <g transform={`translate(336 96) rotate(${Math.sin(frame / 14) * 8})`}>
              <text x="0" y="0" fontFamily={SERIF} fontSize="66" fill={C.goldHi} fontWeight="bold" textAnchor="middle">?</text>
            </g>
          )}
        </g>
      </g>
    );
  };

/* ================= 1) NOTA PROTOCOLO ================= */
const NotaProtocolo: React.FC<{titulo?: string; items?: string[]; pie?: string}> = ({
  titulo = 'Protocolo de la mañana',
  items = ['Agua tibia con limón', 'Limpiador botánico suave', 'Tónico de romero (3 gotas)', 'Sérum nutritivo', 'Protector solar'],
  pie = '— pegada en el espejo del baño',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = SPR(frame, fps, 4, 15, 110, 1);
  const rot = interpolate(s, [0, 1], [-7, -2.2], CL);
  const floatY = Math.sin(frame / 26) * 5;
  const d = tornEdgePath(840, 660, 'nota', 16, 46);
  const underP = FI(frame, 20, 38);
  const sealS = SPR(frame, fps, 96, 11, 160, 1.1);
  return (
    <AbsoluteFill>
      <Backdrop seed="nota" glowX={0.3} glowY={0.25} />
      <AbsoluteFill style={{transform: `scale(${FI(frame, 0, 150, 1.06, 1)})`}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
          <defs>
            <linearGradient id="np-paper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.paperHi} />
              <stop offset="60%" stopColor={C.paper} />
              <stop offset="100%" stopColor="#E4D4B2" />
            </linearGradient>
            <filter id="np-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="26" stdDeviation="30" floodColor="#000" floodOpacity="0.55" />
            </filter>
            <filter id="np-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.15  0 0 0 0.05 0" />
            </filter>
            <clipPath id="np-clip"><path d={d} /></clipPath>
            <radialGradient id="np-seal" cx="38%" cy="32%" r="80%">
              <stop offset="0%" stopColor="#D98E45" />
              <stop offset="55%" stopColor={C.copper} />
              <stop offset="100%" stopColor="#7A4A1E" />
            </radialGradient>
          </defs>
          <g transform={`translate(560 540) rotate(${rot}) scale(${s}) translate(-420 -330) translate(0 ${floatY})`} filter="url(#np-shadow)">
            <path d={d} fill="url(#np-paper)" />
            <g clipPath="url(#np-clip)">
              <rect width="840" height="660" filter="url(#np-grain)" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={i} x1="56" y1={236 + i * 72} x2="784" y2={236 + i * 72} stroke="#B9A077" strokeOpacity="0.45" strokeWidth="2" />
              ))}
              <line x1="70" y1="40" x2="70" y2="620" stroke={C.copper} strokeOpacity="0.5" strokeWidth="3" />
            </g>
            <g transform="translate(120 -14) rotate(-5)" opacity="0.85">
              <rect x="-70" y="-14" width="190" height="46" rx="4" fill={C.gold} opacity="0.4" />
              <rect x="-70" y="-14" width="190" height="46" rx="4" fill="none" stroke="#FFF3D0" strokeOpacity="0.5" />
            </g>
            <text x="100" y="120" fontFamily={SERIF} fontSize="58" fontWeight="bold" fill={C.ink}>{titulo}</text>
            <path d="M100 150 C 240 138, 420 162, 640 146" fill="none" stroke={C.gold} strokeWidth="7"
              strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - underP} />
            {items.map((it, i) => {
              const a0 = 30 + i * 13;
              const row = SPR(frame, fps, a0, 16, 170, 0.8);
              const chk = FI(frame, a0 + 8, a0 + 18);
              const y = 236 + i * 72;
              return (
                <g key={i} opacity={row} transform={`translate(${(1 - row) * -26} 0)`}>
                  <circle cx="112" cy={y - 14} r="19" fill="none" stroke={C.gold} strokeWidth="5"
                    pathLength={1} strokeDasharray="1" strokeDashoffset={1 - chk} />
                  <path d={`M102 ${y - 14} L110 ${y - 5} L124 ${y - 24}`} fill="none" stroke={C.ink} strokeWidth="6"
                    strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - chk} />
                  <text x="156" y={y - 6} fontFamily={SERIF} fontSize="37" fill={C.ink}>{it}</text>
                </g>
              );
            })}
            <text x="100" y="640" fontFamily={SERIF} fontStyle="italic" fontSize="27" fill={C.inkSoft}>{pie}</text>
            <g transform={`translate(700 556) scale(${sealS}) rotate(${(1 - sealS) * 40})`} opacity={FI(frame, 92, 100)}>
              <circle r="62" fill="url(#np-seal)" stroke="#5C3A16" strokeWidth="4" />
              <circle r="46" fill="none" stroke={C.goldHi} strokeOpacity="0.7" strokeWidth="2.5" strokeDasharray="4 7" />
              <g transform="translate(4 20) scale(0.55)"><Sprig len={70} w={7} draw={1} color={C.goldHi} tip="#FFE9B0" /></g>
            </g>
          </g>
        </svg>
        <div style={{position: 'absolute', right: 150, top: 380, width: 470, opacity: FI(frame, 60, 80),
          transform: `translateY(${FI(frame, 60, 80, 24, 0)}px)`}}>
          <Kicker text="EL MÉTODO PIEL JOVEN" />
          <div style={{fontFamily: SERIF, fontSize: 54, color: C.cream, lineHeight: 1.15, marginTop: 18}}>
            Cinco pasos, <span style={{...goldText, fontStyle: 'italic'}}>cinco minutos</span>, cada mañana.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================= 2) ROMY SALUDA ================= */
const MascotaSaluda: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = SPR(frame, fps, 6, 14, 100, 1.1);
  const k1 = FI(frame, 14, 30), k2 = FI(frame, 26, 44), k3 = FI(frame, 40, 58);
  const bubble = SPR(frame, fps, 55, 12, 150, 0.9);
  return (
    <AbsoluteFill>
      <Backdrop seed="sal" glowX={0.72} glowY={0.3} />
      <div style={{position: 'absolute', left: 150, top: 290, width: 800}}>
        <div style={{opacity: k1, transform: `translateY(${(1 - k1) * 26}px)`}}><Kicker text="TE PRESENTO A TU GUÍA" size={28} /></div>
        <div style={{opacity: k2, transform: `translateY(${(1 - k2) * 40}px)`, fontFamily: SERIF, fontSize: 175,
          lineHeight: 1, marginTop: 12, fontWeight: 'bold', ...goldText}}>Romy</div>
        <div style={{opacity: k3, transform: `translateY(${(1 - k3) * 30}px)`, fontFamily: SERIF, fontSize: 44,
          color: C.cream, lineHeight: 1.3, marginTop: 28, fontStyle: 'italic'}}>
          el guardián botánico del<br />Método Piel Joven
        </div>
        <div style={{opacity: k3, marginTop: 36, height: 3, width: 140 * k3, background: C.gold}} />
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform={`translate(0 ${(1 - enter) * 420})`}>
          <Romy frame={frame} pose="wave" x={1066} y={330} scale={1.35} seed="romy-sal" />
        </g>
        <g transform={`translate(1150 232) scale(${bubble}) rotate(${(1 - bubble) * -14})`} opacity={bubble}>
          <path d="M-40 40 L-8 40 L-52 84 Z" fill={C.paper} stroke={C.bronze} strokeWidth="3" strokeLinejoin="round" />
          <rect x="-170" y="-64" width="340" height="106" rx="26" fill={C.paper} stroke={C.bronze} strokeWidth="3" />
          <text x="0" y="4" textAnchor="middle" fontFamily={SERIF} fontSize="42" fontWeight="bold" fill={C.ink}>¡Hola, piel!</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 3) ROMY PENSANDO ================= */
const MascotaPensando: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = SPR(frame, fps, 6, 14, 100, 1.1);
  const k1 = FI(frame, 10, 26), k2 = FI(frame, 20, 40), k3 = FI(frame, 30, 50);
  const ans = SPR(frame, fps, 92, 14, 130, 1);
  return (
    <AbsoluteFill>
      <Backdrop seed="think" glowX={0.75} glowY={0.28} />
      <div style={{position: 'absolute', left: 150, top: 250, width: 920}}>
        <div style={{opacity: k1}}><Kicker text="LA PREGUNTA DEL MILLÓN" size={28} /></div>
        <div style={{opacity: k2, transform: `translateX(${(1 - k2) * -40}px)`, fontFamily: SERIF, fontSize: 82,
          color: C.cream, lineHeight: 1.12, marginTop: 22}}>¿Puede la piel madura</div>
        <div style={{opacity: k3, transform: `translateX(${(1 - k3) * -40}px)`, fontFamily: SERIF, fontSize: 96,
          fontStyle: 'italic', fontWeight: 'bold', lineHeight: 1.1, ...goldText}}>renovarse?</div>
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform={`translate(0 ${(1 - enter) * 420})`}>
          <Romy frame={frame} pose="think" x={1120} y={350} scale={1.25} seed="romy-th" />
        </g>
        {[[1190, 250], [1405, 165], [1580, 320]].map(([cx, cy], i) => {
          const p = SPR(frame, fps, 34 + i * 12, 12, 160, 0.9);
          const fy = Math.sin(frame / 18 + i * 2) * 8;
          return (
            <g key={i} transform={`translate(${cx} ${cy + fy}) scale(${p})`} opacity={p}>
              <circle r="46" fill={C.panel} stroke={C.gold} strokeWidth="3.5" />
              <text y="16" textAnchor="middle" fontFamily={SERIF} fontSize="52" fontWeight="bold" fill={C.goldHi}>?</text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center',
        opacity: FI(frame, 88, 98), transform: `translateY(${(1 - ans) * 60}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, background: C.panel2, border: `2px solid ${C.gold}`,
          borderRadius: 999, padding: '22px 46px'}}>
          <svg width="44" height="44" viewBox="-22 -22 44 44">
            <circle r="20" fill={C.gold} />
            <path d="M-9 1 L-3 8 L10 -8" fill="none" stroke={C.dark} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{fontFamily: SERIF, fontSize: 42, color: C.cream}}>
            Sí — con <span style={{...goldText, fontStyle: 'italic'}}>método, romero y constancia</span>.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4) ROMY FESTEJA ================= */
const MascotaFesteja: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = SPR(frame, fps, 4, 13, 110, 1.1);
  const burst = FI(frame, 14, 30);
  const rib = SPR(frame, fps, 30, 13, 120, 1);
  const pieces: React.ReactNode[] = [];
  for (let i = 0; i < 80; i++) {
    const a = random(`cf-a${i}`) * Math.PI * 2;
    const v = 9 + random(`cf-v${i}`) * 15;
    const t = Math.max(0, frame - 14);
    if (t === 0) continue;
    const x = 960 + Math.cos(a) * v * t * 0.9;
    const y = 430 + Math.sin(a) * v * t * 0.9 + 0.55 * t * t;
    if (y > 1120) continue;
    const rotC = random(`cf-r${i}`) * 360 + t * (4 + random(`cf-s${i}`) * 8);
    const colr = [C.gold, C.goldHi, C.cream, C.sage, C.copper][i % 5];
    const w = 8 + random(`cf-w${i}`) * 10;
    pieces.push(
      <rect key={i} x={-w / 2} y={-w / 4} width={w} height={w / 2} rx="2" fill={colr}
        opacity={FI(frame, 84, 106, 1, 0)}
        transform={`translate(${x} ${y}) rotate(${rotC}) scale(${Math.sin((frame + i * 7) / 5) > 0 ? 1 : 0.35} 1)`} />
    );
  }
  return (
    <AbsoluteFill>
      <Backdrop seed="fest" glowX={0.5} glowY={0.35} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="fest-rib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.goldHi} />
            <stop offset="55%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.goldSoft} />
          </linearGradient>
        </defs>
        {Array.from({length: 10}).map((_, i) => {
          const ang = (i / 10) * Math.PI * 2;
          return (
            <line key={i} x1={960 + Math.cos(ang) * 230} y1={430 + Math.sin(ang) * 230}
              x2={960 + Math.cos(ang) * (230 + 90 * burst)} y2={430 + Math.sin(ang) * (230 + 90 * burst)}
              stroke={C.gold} strokeWidth="5" strokeLinecap="round"
              opacity={0.5 * burst * (0.5 + 0.5 * Math.sin(frame / 8 + i))} />
          );
        })}
        {pieces}
        <g transform={`translate(0 ${(1 - enter) * 420})`}>
          <Romy frame={frame} pose="cheer" x={648} y={330} scale={1.3} seed="romy-fest" />
        </g>
        <g transform={`translate(960 886) scale(${Math.max(0.001, rib)})`} opacity={FI(frame, 28, 40)}>
          <path d="M-520 -52 L-592 -26 L-560 0 L-592 26 L-520 52 Z" fill={C.bronzeDark} />
          <path d="M520 -52 L592 -26 L560 0 L592 26 L520 52 Z" fill={C.bronzeDark} />
          <rect x="-520" y="-52" width="1040" height="104" fill="url(#fest-rib)" />
          <text x="0" y="16" textAnchor="middle" fontFamily={SERIF} fontSize="46" fontWeight="bold" fill={C.dark}
            style={{letterSpacing: '5px'}}>DÍA 21 · ¡CONSTANCIA LOGRADA!</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 5) NODOS DEL MÉTODO ================= */
type Paso = {n: string; titulo: string; desc: string};
const NodosMetodo: React.FC<{pasos?: Paso[]}> = ({
  pasos = [
    {n: '01', titulo: 'Limpieza botánica', desc: 'Agua tibia y limpiador suave. Nunca jabón común.'},
    {n: '02', titulo: 'Activación con romero', desc: 'Tónico tibio, 3 gotas, presión de palmas hacia arriba.'},
    {n: '03', titulo: 'Nutrición profunda', desc: 'Sérum y crema selladora. El cuello también cuenta.'},
  ],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pathP = FI(frame, 8, 66);
  const pts = [{x: 1420, y: 200}, {x: 1150, y: 540}, {x: 1420, y: 880}];
  const hit = [10, 38, 66];
  const pathD = `M${pts[0].x} ${pts[0].y} L${pts[1].x} ${pts[1].y} L${pts[2].x} ${pts[2].y}`;
  const seg = pathP < 0.5 ? 0 : 1;
  const lt = pathP < 0.5 ? pathP * 2 : (pathP - 0.5) * 2;
  const tipX = pts[seg].x + (pts[seg + 1].x - pts[seg].x) * lt;
  const tipY = pts[seg].y + (pts[seg + 1].y - pts[seg].y) * lt;
  return (
    <AbsoluteFill>
      <Backdrop seed="nodos" glowX={0.78} glowY={0.5} />
      <div style={{position: 'absolute', left: 150, top: 64, opacity: FI(frame, 4, 18)}}>
        <Kicker text="EL MÉTODO PIEL JOVEN · 3 PASOS" size={24} />
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="nd-node" cx="42%" cy="36%" r="80%">
            <stop offset="0%" stopColor={C.paperHi} />
            <stop offset="70%" stopColor={C.cream} />
            <stop offset="100%" stopColor="#D9C69E" />
          </radialGradient>
          <filter id="nd-blur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <path d={pathD} fill="none" stroke={C.gold} strokeWidth="16" strokeLinejoin="round" opacity="0.35"
          filter="url(#nd-blur)" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - pathP} />
        <path d={pathD} fill="none" stroke={C.cream} strokeWidth="9" strokeLinejoin="round" opacity="0.95"
          pathLength={1} strokeDasharray="1" strokeDashoffset={1 - pathP} />
        {frame > 8 && frame < 70 && (
          <g>
            <circle cx={tipX} cy={tipY} r="18" fill={C.goldHi} opacity="0.5" filter="url(#nd-blur)" />
            <circle cx={tipX} cy={tipY} r="8" fill={C.goldHi} />
          </g>
        )}
        {pts.map((p, i) => {
          const pop = SPR(frame, fps, hit[i], 12, 150, 1);
          const pp = ((frame - hit[i]) % 55 + 55) % 55 / 55;
          return (
            <g key={i}>
              {frame > hit[i] && (
                <circle cx={p.x} cy={p.y} r={96 + pp * 50} fill="none" stroke={C.gold} strokeWidth="3" opacity={(1 - pp) * 0.5} />
              )}
              <g transform={`translate(${p.x} ${p.y}) scale(${pop})`} opacity={FI(frame, hit[i], hit[i] + 8)}>
                <circle r="118" fill="none" stroke={C.bronze} strokeWidth="2" strokeDasharray="3 9" opacity="0.6" />
                <circle r="96" fill="url(#nd-node)" stroke={C.gold} strokeWidth="6" />
                <text y="30" textAnchor="middle" fontFamily={SERIF} fontSize="86" fontWeight="bold" fill={C.bronze}>{pasos[i].n}</text>
              </g>
            </g>
          );
        })}
      </svg>
      {pasos.map((p, i) => {
        const r = SPR(frame, fps, hit[i] + 6, 16, 140, 0.9);
        return (
          <div key={i} style={{position: 'absolute', left: 150, top: pts[i].y - 78, width: 680,
            opacity: r, transform: `translateX(${(1 - r) * -50}px)`}}>
            <Kicker text={`PASO ${p.n}`} size={24} />
            <div style={{fontFamily: SERIF, fontSize: 58, color: C.cream, lineHeight: 1.1, marginTop: 10}}>{p.titulo}</div>
            <div style={{fontFamily: SANS, fontSize: 27, color: C.creamDim, lineHeight: 1.4, marginTop: 12}}>{p.desc}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================= 6) NÚMERO / DATO ================= */
const NumeroDato: React.FC<{valor?: number; sufijo?: string; titulo?: string; nota?: string}> = ({
  valor = 87, sufijo = '%',
  titulo = 'notaron la piel más firme y luminosa',
  nota = '*Percepción propia tras 4 semanas de rutina guiada.',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [16, 78], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const v = Math.round(p * valor);
  const ringP = p * 0.87;
  return (
    <AbsoluteFill>
      <Backdrop seed="dato" glowX={0.32} glowY={0.45} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="dt-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.goldHi} /><stop offset="100%" stopColor={C.copper} />
          </linearGradient>
        </defs>
        {Array.from({length: 48}).map((_, i) => {
          const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
          const on = i / 48 < ringP;
          return (
            <line key={i} x1={620 + Math.cos(a) * 256} y1={520 + Math.sin(a) * 256}
              x2={620 + Math.cos(a) * 272} y2={520 + Math.sin(a) * 272}
              stroke={on ? C.gold : '#332614'} strokeWidth={on ? 4 : 3} opacity={on ? 0.95 : 0.5} />
          );
        })}
        <circle cx="620" cy="520" r="216" fill="none" stroke="#2A2015" strokeWidth="16" />
        <circle cx="620" cy="520" r="216" fill="none" stroke="url(#dt-gold)" strokeWidth="16" strokeLinecap="round"
          transform="rotate(-90 620 520)" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - ringP} />
        {[0.28, 0.5, 0.72, 0.95].map((h, i) => {
          const bp = FI(frame, 70 + i * 8, 86 + i * 8);
          return <rect key={i} x={486 + i * 64} y={900 - 140 * h * bp} width="34" height={140 * h * bp} rx="6"
            fill={i === 3 ? C.gold : C.bronze} opacity={0.4 + 0.6 * bp} />;
        })}
        <line x1="460" y1="900" x2="790" y2="900" stroke={C.bronze} strokeWidth="3" opacity="0.6" />
        {[[400, 330], [850, 300], [880, 720], [390, 730]].map(([sx, sy], i) => {
          const sp = SPR(frame, fps, 82 + i * 5, 12, 180, 0.7);
          return <g key={i} transform={`translate(${sx} ${sy}) scale(${sp})`} opacity={sp}>
            <Star4 x={0} y={0} r={20} rot={frame * 0.5 + i * 30} />
          </g>;
        })}
      </svg>
      <div style={{position: 'absolute', left: 620, top: 520, transform: 'translate(-50%,-54%)', textAlign: 'center'}}>
        <span style={{fontFamily: SERIF, fontSize: 240, fontWeight: 'bold', lineHeight: 1, ...goldText}}>{v}</span>
        <span style={{fontFamily: SERIF, fontSize: 100, fontWeight: 'bold', ...goldText}}>{sufijo}</span>
      </div>
      <div style={{position: 'absolute', left: 1080, top: 360, width: 680, opacity: FI(frame, 50, 70),
        transform: `translateY(${FI(frame, 50, 70, 30, 0)}px)`}}>
        <Kicker text="DATO DEL MÉTODO" />
        <div style={{fontFamily: SERIF, fontSize: 58, color: C.cream, lineHeight: 1.18, marginTop: 20}}>{titulo}</div>
        <div style={{fontFamily: SANS, fontSize: 25, color: C.creamDim, fontStyle: 'italic', marginTop: 26}}>{nota}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 7) ANTES / DESPUÉS ================= */
const FaceAD: React.FC<{skin: string; shade: string; wrinkles?: boolean; blush?: boolean}> =
  ({skin, shade, wrinkles = false, blush = false}) => (
    <g>
      <rect x="530" y="520" width="140" height="200" rx="40" fill={shade} />
      <ellipse cx="600" cy="360" rx="205" ry="245" fill={skin} />
      <path d="M420 260 Q 600 120 780 260 Q 780 150 600 130 Q 420 150 420 260 Z" fill={C.paper} opacity="0.95" />
      <path d="M440 262 Q 600 132 760 262" fill="none" stroke={shade} strokeWidth="6" opacity="0.5" />
      <path d="M505 330 Q 530 318 555 330" fill="none" stroke="#4A3018" strokeWidth="7" strokeLinecap="round" />
      <path d="M645 330 Q 670 318 695 330" fill="none" stroke="#4A3018" strokeWidth="7" strokeLinecap="round" />
      <path d="M600 340 Q 592 400 584 420 Q 600 432 616 420" fill="none" stroke={shade} strokeWidth="6" strokeLinecap="round" />
      <path d="M560 470 Q 600 492 640 470 Q 600 480 560 470 Z" fill="#A05A3A" />
      {blush && <ellipse cx="505" cy="420" rx="30" ry="18" fill={C.copper} opacity="0.4" />}
      {blush && <ellipse cx="695" cy="420" rx="30" ry="18" fill={C.copper} opacity="0.4" />}
      {wrinkles && (
        <g stroke="#6B4A28" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M500 240 Q 600 228 700 240" />
          <path d="M510 270 Q 600 258 690 270" />
          <path d="M470 320 L 440 310 M470 335 L 444 335 M470 350 L 442 358" />
          <path d="M730 320 L 760 310 M730 335 L 756 335 M730 350 L 758 358" />
          <path d="M530 440 Q 520 480 536 508" />
          <path d="M670 440 Q 680 480 664 508" />
          <path d="M520 380 Q 545 392 570 384" />
          <path d="M630 384 Q 655 392 680 380" />
        </g>
      )}
    </g>
  );

const AntesDespues: React.FC = () => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [8, 58, 100], [0.06, 0.6, 0.5],
    {...CL, easing: Easing.inOut(Easing.cubic)});
  const hx = s * 1200;
  return (
    <AbsoluteFill>
      <Backdrop seed="ad" glowX={0.5} glowY={0.4} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', justifyContent: 'center', opacity: FI(frame, 4, 18)}}>
        <Kicker text="EL CAMBIO REAL" size={28} />
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="ad-after" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.panel2} /><stop offset="100%" stopColor="#3A2812" />
          </linearGradient>
          <clipPath id="ad-card"><rect x="0" y="0" width="1200" height="720" rx="36" /></clipPath>
          <clipPath id="ad-before"><rect x="0" y="0" width={hx} height="720" /></clipPath>
          <radialGradient id="ad-glow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.28" />
            <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(360 180)">
          <g clipPath="url(#ad-card)">
            <rect width="1200" height="720" fill="url(#ad-after)" />
            <ellipse cx="600" cy="330" rx="480" ry="380" fill="url(#ad-glow)" />
            <FaceAD skin="#E7B787" shade="#C98F5E" blush />
            <g clipPath="url(#ad-before)">
              <rect width="1200" height="720" fill="#17110C" />
              <FaceAD skin="#B98B62" shade="#96703F" wrinkles />
              <rect width="1200" height="720" fill="#241A10" opacity="0.35" />
            </g>
            <line x1={hx} y1="0" x2={hx} y2="720" stroke={C.cream} strokeWidth="5" opacity="0.95" />
            <g transform={`translate(${hx} 360)`}>
              <circle r="36" fill={C.dark} stroke={C.gold} strokeWidth="5" />
              <path d="M-18 0 L-6 -10 L-6 10 Z" fill={C.goldHi} />
              <path d="M18 0 L6 -10 L6 10 Z" fill={C.goldHi} />
            </g>
            <g opacity={FI(frame, 18, 32)}>
              <rect x="40" y="36" width="160" height="56" rx="28" fill="#000000" opacity="0.55" />
              <text x="120" y="73" textAnchor="middle" fontFamily={SANS} fontSize="26" fill={C.creamDim} style={{letterSpacing: '5px'}}>ANTES</text>
            </g>
            <g opacity={FI(frame, 44, 58)}>
              <rect x="1000" y="36" width="190" height="56" rx="28" fill={C.gold} opacity="0.95" />
              <text x="1095" y="73" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="700" fill={C.dark} style={{letterSpacing: '5px'}}>DESPUÉS</text>
            </g>
          </g>
          <rect x="0" y="0" width="1200" height="720" rx="36" fill="none" stroke={C.bronze} strokeWidth="3" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center',
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 42, color: C.cream, opacity: FI(frame, 55, 75)}}>
        Misma luz. Misma mujer. <span style={goldText}>Cuatro semanas de método.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 8) SELLO DEL MÉTODO ================= */
const SelloMetodo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = SPR(frame, fps, 8, 11, 80, 1.5);
  const sc = interpolate(stamp, [0, 1], [2.4, 1], CL);
  const ro = interpolate(stamp, [0, 1], [-22, 0], CL);
  return (
    <AbsoluteFill>
      <Backdrop seed="sello" glowX={0.5} glowY={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', opacity: FI(frame, 40, 60)}}>
        <Kicker text="GARANTÍA DEL DR. FEDERER" size={28} />
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="sl-out" cx="42%" cy="34%" r="85%">
            <stop offset="0%" stopColor={C.paperHi} /><stop offset="65%" stopColor={C.cream} /><stop offset="100%" stopColor="#D3BE93" />
          </radialGradient>
          <radialGradient id="sl-in" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#2C1F0E" /><stop offset="100%" stopColor={C.dark} />
          </radialGradient>
          <clipPath id="sl-clip"><circle r="250" /></clipPath>
          <path id="sl-circ" d="M 0 -190 a 190 190 0 1 1 0 380 a 190 190 0 1 1 0 -380" fill="none" />
        </defs>
        {frame >= 26 && (
          <g transform="translate(960 540)">
            <circle r={FI(frame, 26, 52, 250, 430)} fill="none" stroke={C.gold} strokeWidth="5" opacity={FI(frame, 26, 52, 0.8, 0)} />
            {Array.from({length: 12}).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r = FI(frame, 26, 50, 250, 370);
              return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="5" fill={C.goldHi} opacity={FI(frame, 26, 50, 0.9, 0)} />;
            })}
          </g>
        )}
        <g transform={`translate(960 540) scale(${sc}) rotate(${ro})`} opacity={FI(frame, 6, 14)}>
          <circle r="250" fill="url(#sl-out)" stroke={C.bronze} strokeWidth="6" />
          <circle r="222" fill="none" stroke={C.bronze} strokeWidth="2.5" strokeDasharray="2 10" opacity="0.8" />
          <text fontFamily={SERIF} fontSize="31" fontWeight="bold" fill={C.bronze} style={{letterSpacing: '7px'}}>
            <textPath href="#sl-circ">EL MÉTODO PIEL JOVEN ✦ DR. FEDERER ✦ BOTÁNICO ✦</textPath>
          </text>
          <circle r="128" fill="url(#sl-in)" stroke={C.gold} strokeWidth="4" />
          <g transform="translate(6 78) scale(1.15)">
            <Sprig len={130} w={7} draw={FI(frame, 34, 60)} color={C.gold} tip={C.goldHi} />
          </g>
          <Star4 x={-78} y={-58} r={12} op={FI(frame, 50, 62)} />
          <Star4 x={82} y={-44} r={9} op={FI(frame, 56, 68)} />
          <g clipPath="url(#sl-clip)">
            <ellipse rx="250" ry="70" fill={C.goldHi} opacity="0.12" transform={`rotate(${frame * 1.1})`} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 9) TICKET RUTINA ================= */
const TicketRutina: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = SPR(frame, fps, 5, 14, 100, 1.1);
  const rot = interpolate(e, [0, 1], [-9, -2], CL);
  const chip = SPR(frame, fps, 42, 12, 160, 0.9);
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < 22; i++) {
    const bw = 2 + random(`tk-b${i}`) * 5;
    bars.push(<rect key={i} x={300 + i * 8.5} y={118} width={bw} height={64} fill={C.ink} opacity="0.85" />);
  }
  return (
    <AbsoluteFill>
      <Backdrop seed="ticket" glowX={0.5} glowY={0.45} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="tk-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.paperHi} /><stop offset="100%" stopColor="#E2D1AC" />
          </linearGradient>
          <filter id="tk-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="24" stdDeviation="28" floodColor="#000" floodOpacity="0.55" />
          </filter>
          <mask id="tk-cut">
            <rect x="-490" y="-210" width="980" height="420" rx="26" fill="white" />
            <circle cx="250" cy="-210" r="24" fill="black" />
            <circle cx="250" cy="210" r="24" fill="black" />
            <circle cx="-490" cy="0" r="28" fill="black" />
            <circle cx="490" cy="0" r="28" fill="black" />
          </mask>
        </defs>
        <g transform={`translate(960 ${540 + (1 - e) * 380}) rotate(${rot})`} filter="url(#tk-shadow)" opacity={FI(frame, 5, 15)}>
          <g mask="url(#tk-cut)">
            <rect x="-490" y="-210" width="980" height="420" fill="url(#tk-paper)" />
            <rect x="-490" y="-210" width="980" height="14" fill={C.gold} />
            <rect x="-490" y="196" width="980" height="14" fill={C.gold} />
          </g>
          <line x1="250" y1="-186" x2="250" y2="186" stroke={C.bronze} strokeWidth="3" strokeDasharray="10 12" opacity="0.8" />
          <text x="-440" y="-128" fontFamily={SANS} fontSize="24" fill={C.copper} fontWeight="700" style={{letterSpacing: '6px'}}>MÉTODO PIEL JOVEN</text>
          <text x="-440" y="-30" fontFamily={SERIF} fontSize="82" fontWeight="bold" fill={C.ink}>Rutina Nocturna</text>
          {[
            {x: -440, w: 190, t: '21:00 h', ic: 'clock'},
            {x: -230, w: 250, t: '3 gotas de romero', ic: 'drop'},
            {x: 40, w: 180, t: '5 minutos', ic: 'leaf'},
          ].map((c, i) => {
            const cp = SPR(frame, fps, 24 + i * 7, 15, 170, 0.8);
            return (
              <g key={i} transform={`translate(${c.x} 60) scale(${cp})`} opacity={cp}>
                <rect width={c.w} height="62" rx="31" fill="#E7D7B4" stroke={C.bronze} strokeWidth="2" />
                {c.ic === 'clock' && (
                  <g transform="translate(36 31)">
                    <circle r="14" fill="none" stroke={C.copper} strokeWidth="3.5" />
                    <path d="M0 -8 L0 0 L6 4" fill="none" stroke={C.copper} strokeWidth="3.5" strokeLinecap="round" />
                  </g>
                )}
                {c.ic === 'drop' && (
                  <path d="M36 18 C 43 28 46 33 46 38 a10 10 0 1 1 -20 0 C 26 33 29 28 36 18 Z" fill={C.copper} />
                )}
                {c.ic === 'leaf' && (
                  <g transform="translate(36 31)">
                    <ellipse rx="13" ry="8" fill={C.sageDeep} transform="rotate(-30)" />
                    <line x1="-11" y1="8" x2="11" y2="-8" stroke={C.sage} strokeWidth="2.5" />
                  </g>
                )}
                <text x={c.w / 2 + 14} y="40" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="600" fill={C.ink}>{c.t}</text>
              </g>
            );
          })}
          <text x="-440" y="172" fontFamily={SERIF} fontStyle="italic" fontSize="26" fill={C.inkSoft}>Admite: 1 piel con ganas de cuidarse</text>
          <text x="370" y="-120" textAnchor="middle" fontFamily={SANS} fontSize="20" fill={C.copper} fontWeight="700" style={{letterSpacing: '5px'}}>ENTRADA</text>
          <text x="370" y="-40" textAnchor="middle" fontFamily={SERIF} fontSize="64" fontWeight="bold" fill={C.ink}>Nº 021</text>
          {bars}
          <g transform={`translate(150 -150) scale(${chip}) rotate(12)`} opacity={chip}>
            <circle r="56" fill={C.gold} stroke={C.dark} strokeWidth="4" />
            <text y="12" textAnchor="middle" fontFamily={SERIF} fontSize="32" fontWeight="bold" fill={C.dark}>HOY</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 10) BANNER CAPÍTULO ================= */
const CapituloBanner: React.FC<{kicker?: string; titulo?: string; sub?: string; num?: string}> = ({
  kicker = 'CAPÍTULO 03', titulo = 'El romero y el colágeno', sub = 'con el Dr. Federer', num = '03',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rule = FI(frame, 34, 58);
  const dia = SPR(frame, fps, 40, 12, 170, 0.8);
  return (
    <AbsoluteFill>
      <Backdrop seed="cap" glowX={0.5} glowY={0.4} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center',
        fontFamily: SERIF, fontSize: 620, fontWeight: 'bold', color: C.gold, opacity: 0.05,
        transform: `translateY(${Math.sin(frame / 40) * 10}px)`}}>{num}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center'}}>
        <div style={{fontFamily: SANS, fontSize: 30, letterSpacing: 14, color: C.gold, fontWeight: 600}}>
          {kicker.split('').map((ch, i) => (
            <span key={i} style={{opacity: FI(frame, 12 + i * 2, 22 + i * 2)}}>{ch}</span>
          ))}
        </div>
        <div style={{fontFamily: SERIF, fontSize: 108, color: C.cream, lineHeight: 1.1, marginTop: 30,
          opacity: FI(frame, 26, 46), transform: `translateY(${FI(frame, 26, 46, 34, 0)}px)`}}>{titulo}</div>
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform="translate(960 700)">
          <rect x={-280 * rule} y="-1.5" width={560 * rule} height="3" fill={C.gold} />
          <rect x="-11" y="-11" width="22" height="22" fill={C.gold} transform={`rotate(45) scale(${dia})`} opacity={dia} />
          <g transform="translate(-290 0) rotate(-90)"><Sprig len={110} w={5} draw={FI(frame, 50, 80)} color={C.sageDeep} tip={C.sage} /></g>
          <g transform="translate(290 0) rotate(90)"><Sprig len={110} w={5} draw={FI(frame, 50, 80)} color={C.sageDeep} tip={C.sage} /></g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', fontFamily: SERIF,
        fontStyle: 'italic', fontSize: 34, color: C.creamDim, opacity: FI(frame, 64, 84)}}>{sub}</div>
    </AbsoluteFill>
  );
};

/* ================= 11) FICHA INGREDIENTE ================= */
const FichaIngrediente: React.FC<{nombre?: string; latin?: string; props3?: string[]; tags?: string[]}> = ({
  nombre = 'ROMERO', latin = 'Rosmarinus officinalis',
  props3 = ['Estimula la microcirculación', 'Antioxidante natural (carnosol)', 'Aporta firmeza y tono'],
  tags = ['Tónico', 'Circulación', 'Firmeza'],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = SPR(frame, fps, 5, 14, 110, 1);
  const rot = interpolate(e, [0, 1], [7, 1.5], CL);
  const pin = SPR(frame, fps, 18, 11, 180, 0.8);
  return (
    <AbsoluteFill>
      <Backdrop seed="ficha" glowX={0.4} glowY={0.35} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="fc-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.paperHi} /><stop offset="100%" stopColor="#E6D6B4" />
          </linearGradient>
          <filter id="fc-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#000" floodOpacity="0.55" />
          </filter>
          <radialGradient id="fc-pin" cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor={C.goldHi} /><stop offset="60%" stopColor={C.gold} /><stop offset="100%" stopColor={C.copper} />
          </radialGradient>
        </defs>
        <g transform={`translate(960 560) rotate(${rot}) scale(${e})`} filter="url(#fc-shadow)" opacity={FI(frame, 5, 15)}>
          <rect x="-490" y="-310" width="980" height="620" rx="18" fill="url(#fc-paper)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1="-460" y1={-30 + i * 62} x2="460" y2={-30 + i * 62} stroke="#C3AC82" strokeOpacity="0.4" strokeWidth="2" />
          ))}
          <line x1="-400" y1="-260" x2="-400" y2="270" stroke={C.copper} strokeOpacity="0.55" strokeWidth="3" />
          <ellipse cx="0" cy="-296" rx="30" ry="10" fill="#000" opacity="0.25" />
          <g transform={`translate(0 -316) scale(${pin})`} opacity={pin}>
            <circle r="22" fill="url(#fc-pin)" stroke={C.bronzeDark} strokeWidth="3" />
            <circle cx="-6" cy="-7" r="6" fill="#FFF3D0" opacity="0.9" />
          </g>
          <text x="430" y="-252" textAnchor="end" fontFamily={SERIF} fontSize="30" fill={C.bronze} fontStyle="italic">ficha Nº 02</text>
          <text x="-360" y="-180" fontFamily={SERIF} fontSize="86" fontWeight="bold" fill={C.ink} style={{letterSpacing: '6px'}}>{nombre}</text>
          <text x="-360" y="-128" fontFamily={SERIF} fontStyle="italic" fontSize="34" fill={C.copper}>{latin}</text>
          <line x1="-360" y1="-100" x2="-60" y2="-100" stroke={C.gold} strokeWidth="4" />
          {props3.map((t, i) => {
            const rp = SPR(frame, fps, 30 + i * 8, 16, 170, 0.8);
            return (
              <g key={i} opacity={rp} transform={`translate(${(1 - rp) * -22} 0)`}>
                <rect x="-358" y={-56 + i * 62} width="13" height="13" fill={C.gold} transform="rotate(45 -351.5 -49.5)" />
                <text x="-320" y={-42 + i * 62} fontFamily={SERIF} fontSize="36" fill={C.ink}>{t}</text>
              </g>
            );
          })}
          {tags.map((t, i) => {
            const tp = SPR(frame, fps, 58 + i * 6, 13, 180, 0.7);
            return (
              <g key={i} transform={`translate(${-360 + i * 190} 210) scale(${tp})`} opacity={tp}>
                <rect width="170" height="52" rx="26" fill="none" stroke={C.sageDeep} strokeWidth="2.5" />
                <text x="85" y="35" textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="700" fill={C.sageDeep}
                  style={{letterSpacing: '3px'}}>{t}</text>
              </g>
            );
          })}
          <g transform="translate(330 250) scale(1.5)" opacity="0.9">
            <Sprig len={300} w={7} draw={FI(frame, 34, 90)} color={C.sageDeep} tip={C.sage} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 12) VERSUS COLUMNAS ================= */
const VSCard: React.FC<{cx: number; titulo: string; rows: string[]; good: boolean; frame: number; fps: number; delay: number}> =
  ({cx, titulo, rows, good, frame, fps, delay}) => {
    const e = SPR(frame, fps, delay, 15, 90, 1.1);
    const tx = (1 - e) * (good ? 760 : -760);
    const w = 700, h = 640;
    return (
      <g transform={`translate(${cx + tx} 220)`} opacity={FI(frame, delay, delay + 10)}>
        <rect x={-w / 2} y={0} width={w} height={h} rx="28" fill={good ? '#2A1E0E' : '#1B1409'}
          stroke={good ? C.gold : C.bronze} strokeWidth={good ? 3.5 : 2} />
        <path d={`M${-w / 2} 28 a28 28 0 0 1 28 -28 h${w - 56} a28 28 0 0 1 28 28 v76 h${-w} z`}
          fill={good ? '#372812' : '#241A0C'} />
        <text x="0" y="72" textAnchor="middle" fontFamily={SANS} fontSize="34" fontWeight="700"
          fill={good ? C.gold : C.creamDim} style={{letterSpacing: '8px'}}>{titulo}</text>
        {rows.map((t, i) => {
          const rp = FI(frame, delay + 18 + i * 7, delay + 30 + i * 7);
          const cy = 200 + i * 120;
          return (
            <g key={i} opacity={rp} transform={`translate(${(1 - rp) * (good ? 30 : -30)} 0)`}>
              <circle cx={-w / 2 + 78} cy={cy - 12} r="24" fill={good ? C.gold : '#2A2015'} stroke={good ? 'none' : C.bronze} strokeWidth="2" />
              {good ? (
                <path d={`M${-w / 2 + 68} ${cy - 12} L${-w / 2 + 75} ${cy - 4} L${-w / 2 + 90} ${cy - 22}`}
                  fill="none" stroke={C.dark} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d={`M${-w / 2 + 69} ${cy - 21} L${-w / 2 + 87} ${cy - 3} M${-w / 2 + 87} ${cy - 21} L${-w / 2 + 69} ${cy - 3}`}
                  fill="none" stroke="#7A5C38" strokeWidth="5" strokeLinecap="round" />
              )}
              <text x={-w / 2 + 128} y={cy} fontFamily={SERIF} fontSize="34" fill={good ? C.cream : C.creamDim}>{t}</text>
            </g>
          );
        })}
        {good && (
          <g transform={`translate(${w / 2 - 130} ${h - 56})`} opacity={FI(frame, delay + 44, delay + 56)}>
            <rect x="-110" y="-26" width="220" height="52" rx="26" fill={C.gold} />
            <text x="0" y="9" textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="700" fill={C.dark}
              style={{letterSpacing: '3px'}}>RECOMENDADO</text>
          </g>
        )}
      </g>
    );
  };

const VersusColumnas: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const vs = SPR(frame, fps, 32, 10, 200, 0.8);
  return (
    <AbsoluteFill>
      <Backdrop seed="vs" glowX={0.5} glowY={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: FI(frame, 4, 18)}}>
        <Kicker text="LA DIFERENCIA" size={28} />
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="vs-med" cx="42%" cy="34%" r="85%">
            <stop offset="0%" stopColor="#3A2812" /><stop offset="100%" stopColor={C.dark} />
          </radialGradient>
        </defs>
        <VSCard cx={550} titulo="LO DE SIEMPRE" good={false} frame={frame} fps={fps} delay={6}
          rows={['Jabón común, piel tirante', 'Diez productos, cero orden', 'Empezar… y abandonar']} />
        <VSCard cx={1370} titulo="EL MÉTODO FEDERER" good frame={frame} fps={fps} delay={12}
          rows={['Botánico y pH amable', 'Tres pasos, cinco minutos', 'Ritual guiado cada día']} />
        <g transform={`translate(960 540) scale(${vs}) rotate(${(1 - vs) * 90})`} opacity={vs}>
          <circle r="86" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="4 10" opacity="0.6"
            transform={`rotate(${frame * 0.4})`} />
          <circle r="70" fill="url(#vs-med)" stroke={C.gold} strokeWidth="4" />
          <text y="20" textAnchor="middle" fontFamily={SERIF} fontSize="52" fontWeight="bold" fill={C.goldHi}>VS</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 13) LÍNEA DE TIEMPO ================= */
const LineaTiempo: React.FC<{semanas?: Array<{t: string; d: string}>}> = ({
  semanas = [
    {t: 'Rutina base', d: 'La piel deja de tirar'},
    {t: 'Tonificar', d: 'Romero tibio en palmas'},
    {t: 'Nutrir en capas', d: 'Sérum + crema selladora'},
    {t: 'Firmeza visible', d: 'El espejo lo nota'},
  ],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = FI(frame, 10, 52);
  const dotX = 300 + line * 1320;
  const chk = FI(frame, 88, 100);
  return (
    <AbsoluteFill>
      <Backdrop seed="time" glowX={0.5} glowY={0.55} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
        <div style={{opacity: FI(frame, 4, 18), display: 'flex', justifyContent: 'center'}}><Kicker text="TU PROGRESO" size={26} /></div>
        <div style={{fontFamily: SERIF, fontSize: 68, color: C.cream, marginTop: 16, opacity: FI(frame, 12, 28)}}>
          Las primeras <span style={{...goldText, fontStyle: 'italic'}}>4 semanas</span>
        </div>
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="tm-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.bronze} /><stop offset="100%" stopColor={C.goldHi} />
          </linearGradient>
          <filter id="tm-blur" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <line x1="300" y1="580" x2="1620" y2="580" stroke="#2A2015" strokeWidth="6" />
        <line x1="300" y1="580" x2={dotX} y2="580" stroke="url(#tm-line)" strokeWidth="6" />
        {line > 0 && line < 1 && (
          <g>
            <circle cx={dotX} cy="580" r="20" fill={C.goldHi} opacity="0.5" filter="url(#tm-blur)" />
            <circle cx={dotX} cy="580" r="9" fill={C.goldHi} />
          </g>
        )}
        {semanas.map((w, i) => {
          const xi = 300 + i * 440;
          const pop = SPR(frame, fps, 16 + i * 9, 13, 160, 0.9);
          return (
            <g key={i}>
              <line x1={xi} y1="500" x2={xi} y2="660" stroke={C.bronze} strokeWidth="1.5" strokeDasharray="2 8" opacity="0.5" />
              <g transform={`translate(${xi} 580) scale(${pop})`} opacity={pop}>
                <circle r="32" fill={C.panel} stroke={C.gold} strokeWidth="4" />
                <circle r="11" fill={C.gold} />
                {i === 3 && (
                  <path d="M-12 0 L-4 9 L13 -10" fill="none" stroke={C.goldHi} strokeWidth="6" strokeLinecap="round"
                    strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - chk} />
                )}
              </g>
            </g>
          );
        })}
        <g transform={`translate(1620 580) scale(${SPR(frame, fps, 92, 12, 170, 0.8)})`} opacity={FI(frame, 90, 100)}>
          <Star4 x={0} y={-64} r={18} rot={frame * 0.6} />
        </g>
      </svg>
      {semanas.map((w, i) => {
        const r = SPR(frame, fps, 22 + i * 9, 16, 150, 0.9);
        return (
          <div key={i} style={{position: 'absolute', left: 300 + i * 440 - 190, top: 660, width: 380,
            textAlign: 'center', opacity: r, transform: `translateY(${(1 - r) * 26}px)`}}>
            <Kicker text={`SEMANA ${i + 1}`} size={22} />
            <div style={{fontFamily: SERIF, fontSize: 38, color: C.cream, marginTop: 8}}>{w.t}</div>
            <div style={{fontFamily: SANS, fontSize: 25, color: C.creamDim, marginTop: 8}}>{w.d}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================= 14) CITA DORADA ================= */
const CitaDorada: React.FC<{lineas?: string[]; autor?: string; rol?: string}> = ({
  lineas = ['A los 64 creí que mi piel', 'ya no podía cambiar.', 'El romero me desmintió.'],
  autor = 'Marta G. · 64 años', rol = 'alumna del Método Piel Joven',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Backdrop seed="cita" glowX={0.3} glowY={0.3} />
      <div style={{position: 'absolute', left: 260, top: 130, fontFamily: SERIF, fontSize: 420,
        lineHeight: 1, color: C.gold, opacity: 0.14, transform: `translateY(${(1 - FI(frame, 6, 30)) * 40}px)`}}>“</div>
      <div style={{position: 'absolute', left: 380, top: 330, width: 1240}}>
        {lineas.map((l, i) => {
          const r = SPR(frame, fps, 14 + i * 10, 17, 130, 1);
          return (
            <div key={i} style={{overflow: 'hidden'}}>
              <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, color: C.cream, lineHeight: 1.28,
                transform: `translateY(${(1 - r) * 100}px)`}}>{l}</div>
            </div>
          );
        })}
        <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 50, opacity: FI(frame, 52, 70)}}>
          <div style={{width: 80 * FI(frame, 52, 66), height: 3, background: C.gold}} />
          <div>
            <div style={{fontFamily: SERIF, fontSize: 36, color: C.cream}}>{autor}</div>
            <div style={{fontFamily: SANS, fontSize: 24, color: C.creamDim, marginTop: 4}}>{rol}</div>
          </div>
        </div>
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        {[0, 1, 2, 3, 4].map((i) => {
          const sp = SPR(frame, fps, 64 + i * 4, 12, 180, 0.7);
          return (
            <g key={i} transform={`translate(${390 + i * 46} 290) scale(${sp})`} opacity={sp}>
              <Star4 x={0} y={0} r={13} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ================= 15) DIVISOR BOTÁNICO ================= */
const HojaDivisor: React.FC<{texto?: string}> = ({texto = 'EL MÉTODO PIEL JOVEN'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = FI(frame, 10, 42);
  const dia = SPR(frame, fps, 30, 12, 170, 0.8);
  return (
    <AbsoluteFill>
      <Backdrop seed="div" glowX={0.5} glowY={0.5} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <circle cx="960" cy="520" r={FI(frame, 20, 60, 60, 190)} fill="none" stroke={C.gold} strokeWidth="2"
          opacity={FI(frame, 20, 60, 0.4, 0)} />
        <g transform="translate(960 520)">
          <rect x={-450 * line} y="-1.5" width={900 * line} height="3" fill={C.gold} opacity="0.9" />
          <rect x="-13" y="-13" width="26" height="26" fill={C.gold} transform={`rotate(45) scale(${dia})`} opacity={dia} />
          <circle r="5" fill={C.goldHi} opacity={dia} />
          <g transform="translate(-460 0) rotate(-90)"><Sprig len={150} w={5} draw={FI(frame, 36, 72)} color={C.sageDeep} tip={C.sage} /></g>
          <g transform="translate(460 0) rotate(90)"><Sprig len={150} w={5} draw={FI(frame, 36, 72)} color={C.sageDeep} tip={C.sage} /></g>
          <Star4 x={-530} y={0} r={10} op={FI(frame, 60, 74)} />
          <Star4 x={530} y={0} r={10} op={FI(frame, 60, 74)} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontFamily: SANS,
        fontSize: 34, letterSpacing: 16, color: C.gold, fontWeight: 600,
        opacity: FI(frame, 50, 76), transform: `translateY(${FI(frame, 50, 76, 18, 0)}px)`}}>{texto}</div>
    </AbsoluteFill>
  );
};

/* ================= ROOT ================= */
const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Fed3-NotaProtocolo" component={NotaProtocolo} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-MascotaSaluda" component={MascotaSaluda} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-MascotaPensando" component={MascotaPensando} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-MascotaFesteja" component={MascotaFesteja} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-NodosMetodo" component={NodosMetodo} durationInFrames={180} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-NumeroDato" component={NumeroDato} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-AntesDespues" component={AntesDespues} durationInFrames={160} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-SelloMetodo" component={SelloMetodo} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-TicketRutina" component={TicketRutina} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-CapituloBanner" component={CapituloBanner} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-FichaIngrediente" component={FichaIngrediente} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-VersusColumnas" component={VersusColumnas} durationInFrames={160} fps={30} width={1920} height={1080} />
    <Composition id="Fed3-LineaTiempo" component={LineaTiempo} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-CitaDorada" component={CitaDorada} durationInFrames={150} fps={30} width={1920} height={1080}
      defaultProps={{}} />
    <Composition id="Fed3-HojaDivisor" component={HojaDivisor} durationInFrames={120} fps={30} width={1920} height={1080}
      defaultProps={{}} />
  </>
);
registerRoot(RemotionRoot);
