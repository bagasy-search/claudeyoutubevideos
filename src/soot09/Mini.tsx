import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { prog } from "./kit";

// CUADRO 0 = la miniatura elegida, sin texto ni flecha, rehecha en código: noche de nieve, empalizada con torres y
// antorchas, ojos que brillan en el bosque, cajas y barriles nevados, y el colono asustado mostrando el barril VACÍO.
// Cobra vida (nieve, antorchas, parpadeo, tiembla) y a los 0,55 s la cámara se mete en su cara → la cara del gancho.
const NIEVE = Array.from({ length: 140 }, (_, i) => ({ x: (i * 977) % 1920, y: (i * 613) % 1080, r: 2 + (i % 5) * 1.6, v: 120 + (i % 7) * 40 }));
const OJOS = [[40, 230], [110, 270], [160, 330], [70, 420], [250, 300], [300, 380], [210, 450], [360, 440], [130, 520], [430, 360], [470, 300]];

const Pino: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <path d={`M ${x} ${y - 300 * s} L ${x + 70 * s} ${y - 170 * s} L ${x + 40 * s} ${y - 170 * s} L ${x + 100 * s} ${y - 60 * s} L ${x + 60 * s} ${y - 60 * s} L ${x + 120 * s} ${y + 40 * s} L ${x - 120 * s} ${y + 40 * s} L ${x - 60 * s} ${y - 60 * s} L ${x - 100 * s} ${y - 60 * s} L ${x - 40 * s} ${y - 170 * s} L ${x - 70 * s} ${y - 170 * s} Z`} fill={c} />
);
const Llama: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const f = Math.sin(t * 17 + x) * 6;
  return (
    <g>
      <circle cx={x} cy={y - 20 * s} r={70 * s} fill="#ff9a2a" opacity={0.18} />
      <path d={`M ${x - 18 * s} ${y} Q ${x - 24 * s + f} ${y - 40 * s} ${x + f} ${y - 70 * s} Q ${x + 24 * s} ${y - 40 * s} ${x + 18 * s} ${y} Z`} fill="#ff8a1a" />
      <path d={`M ${x - 9 * s} ${y} Q ${x - 10 * s} ${y - 24 * s} ${x + f * 0.5} ${y - 44 * s} Q ${x + 12 * s} ${y - 24 * s} ${x + 9 * s} ${y} Z`} fill="#ffe27a" />
      <rect x={x - 8 * s} y={y} width={16 * s} height={60 * s} fill="#4a2a14" />
    </g>
  );
};
const Barrilito: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <path d={`M ${x} ${y} Q ${x - 10} ${y + h / 2} ${x} ${y + h} L ${x + w} ${y + h} Q ${x + w + 10} ${y + h / 2} ${x + w} ${y} Z`} fill="#7a4a24" stroke="#3a2010" strokeWidth={5} />
    {[0.22, 0.78].map((k) => <path key={k} d={`M ${x - 4} ${y + h * k} L ${x + w + 4} ${y + h * k}`} stroke="#4a4a52" strokeWidth={8} />)}
    <ellipse cx={x + w / 2} cy={y} rx={w / 2 + 4} ry={14} fill="#f4f8ff" />
  </g>
);
const Caja: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#6a4222" stroke="#2e1a0c" strokeWidth={6} />
    {[1, 2].map((k) => <line key={k} x1={x} y1={y + (h * k) / 3} x2={x + w} y2={y + (h * k) / 3} stroke="#3e2410" strokeWidth={5} />)}
    <rect x={x - 6} y={y - 18} width={w + 12} height={30} rx={14} fill="#f4f8ff" />
    {[0.2, 0.5, 0.8].map((k) => <path key={k} d={`M ${x + w * k - 8} ${y + 8} q 8 26 16 0`} fill="#dfeaff" />)}
  </g>
);

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.0) return null;
  const vive = prog(t, 0.03, 0.3);
  const zoom = prog(t, 0.55, 1.0);
  const k = zoom * zoom;
  const tiembla = Math.sin(t * 60) * 3 * vive;
  const parp = t > 0.3 && t < 0.38 ? 0 : 1;
  const sc = 1 + k * 3.2;
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(t, 0.75, 1.0), transformOrigin: "780px 494px", transform: `translate(${(960 - 780) * k}px, ${(640 - 494) * k}px) scale(${sc})` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="mcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1430" /><stop offset="0.6" stopColor="#1e2c5a" /><stop offset="1" stopColor="#3a4a80" /></linearGradient>
          <linearGradient id="mnieve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8d4f4" /><stop offset="1" stopColor="#f6f9ff" /></linearGradient>
          <radialGradient id="mluz" cx="0.75" cy="0.35" r="0.5"><stop offset="0" stopColor="#ff9a3a" stopOpacity={0.35} /><stop offset="1" stopColor="#ff9a3a" stopOpacity={0} /></radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#mcielo)" />
        {/* bosque oscuro a la izquierda, con ojos */}
        {[[60, 420, 1.5], [220, 380, 1.7], [400, 430, 1.4], [560, 360, 1.3], [700, 330, 1.1], [820, 300, 0.9], [-40, 560, 1.6], [300, 560, 1.5]].map(([x, y, s], i) => <Pino key={i} x={x} y={y} s={s} c={i % 2 ? "#0e1a2e" : "#13223a"} />)}
        {[[960, 250, 0.8], [1060, 230, 0.7], [1560, 200, 0.8], [1880, 170, 0.9]].map(([x, y, s], i) => <Pino key={"f" + i} x={x} y={y} s={s} c="#14223c" />)}
        {OJOS.map(([x, y], i) => {
          const p = Math.sin(t * 5 + i * 2.1) > 0.85 ? 0.15 : 1;
          return <g key={i} opacity={0.95}><ellipse cx={x} cy={y} rx={9} ry={8 * p} fill="#ffd060" /><ellipse cx={x + 26} cy={y} rx={9} ry={8 * p} fill="#ffd060" /></g>;
        })}
        <rect width={1920} height={1080} fill="url(#mluz)" />
        {/* empalizada */}
        <g>
          {Array.from({ length: 24 }, (_, i) => { const x = 880 + i * 46; const top = 250 - Math.min(i, 8) * 4 + (i % 2) * 14; return <g key={i}><path d={`M ${x} 760 L ${x} ${top + 30} L ${x + 21} ${top} L ${x + 42} ${top + 30} L ${x + 42} 760 Z`} fill={i % 2 ? "#5a3a20" : "#4a2e18"} stroke="#24140a" strokeWidth={4} /><path d={`M ${x + 2} ${top + 28} L ${x + 21} ${top + 2} L ${x + 40} ${top + 28} Q ${x + 21} ${top + 40} ${x + 2} ${top + 28} Z`} fill="#f2f6ff" /></g>; })}
          {/* puerta */}
          <rect x={1290} y={300} width={360} height={440} fill="#5e3e22" stroke="#24140a" strokeWidth={6} />
          <line x1={1470} y1={300} x2={1470} y2={740} stroke="#24140a" strokeWidth={6} />
          {[[1290, 1470], [1470, 1650]].map(([a, b], i) => <g key={i}><path d={`M ${a + 10} 320 L ${b - 10} 720`} stroke="#3e2612" strokeWidth={16} /><path d={`M ${b - 10} 320 L ${a + 10} 720`} stroke="#3e2612" strokeWidth={16} /></g>)}
          {[360, 520, 680].map((y) => <rect key={y} x={1290} y={y} width={360} height={14} fill="#3e2612" />)}
          {/* torres */}
          {[[1080, 40, 230], [1790, 0, 220]].map(([x, top, w], i) => (
            <g key={i}>
              <rect x={x - w / 2 + 20} y={top + 120} width={w - 40} height={400} fill="#4a2e18" stroke="#24140a" strokeWidth={6} />
              <rect x={x - w / 2} y={top + 120} width={w} height={70} fill="#5e3e22" stroke="#24140a" strokeWidth={6} />
              {[0, 1, 2].map((k) => <rect key={k} x={x - w / 2 + 30 + k * (w - 60) / 2.4} y={top + 60} width={14} height={70} fill="#3e2612" />)}
              <path d={`M ${x - w / 2 - 30} ${top + 70} L ${x} ${top} L ${x + w / 2 + 30} ${top + 70} Z`} fill="#5e3e22" stroke="#24140a" strokeWidth={6} />
              <path d={`M ${x - w / 2 - 34} ${top + 72} L ${x} ${top - 4} L ${x + w / 2 + 34} ${top + 72} Q ${x} ${top + 40} ${x - w / 2 - 34} ${top + 72} Z`} fill="#f2f6ff" />
              <rect x={x - w / 2 - 6} y={top + 112} width={w + 12} height={18} rx={9} fill="#f2f6ff" />
            </g>
          ))}
          {/* el guardia en la muralla */}
          <g fill="#1e1410">
            <circle cx={1385} cy={170} r={24} /><rect x={1362} y={192} width={46} height={80} rx={14} /><line x1={1420} y1={110} x2={1420} y2={290} stroke="#1e1410" strokeWidth={6} /><path d="M 1412 112 L 1420 86 L 1428 112 Z" />
            <circle cx={1377} cy={168} r={4} fill="#ffd060" /><circle cx={1393} cy={168} r={4} fill="#ffd060" />
          </g>
          <Llama x={1250} y={190} t={t} /><Llama x={1700} y={160} t={t + 1} /><Llama x={1680} y={500} t={t + 2} s={0.9} /><Llama x={890} y={440} t={t + 3} s={0.6} />
        </g>
        {/* suelo nevado */}
        <path d="M 0 600 Q 300 560 620 640 Q 1000 700 1400 720 Q 1700 700 1920 690 L 1920 1080 L 0 1080 Z" fill="url(#mnieve)" />
        <path d="M 0 900 Q 400 820 900 900 Q 1300 960 1920 880 L 1920 1080 L 0 1080 Z" fill="#f8fbff" />
        {/* cajas, barriles, rueda, choclo, cruces */}
        <Caja x={-20} y={380} w={150} h={180} />
        <Caja x={-30} y={640} w={300} h={170} />
        <Barrilito x={140} y={540} w={140} h={150} />
        <Barrilito x={300} y={600} w={110} h={110} />
        <g transform="translate(300 790)"><circle r={110} fill="none" stroke="#4a2e18" strokeWidth={18} />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 4) * 104} y2={Math.sin((i * Math.PI) / 4) * 104} stroke="#4a2e18" strokeWidth={10} />)}<path d="M -112 -14 Q 0 -60 112 -14" stroke="#f4f8ff" strokeWidth={14} fill="none" /></g>
        <Barrilito x={470} y={700} w={150} h={120} />
        <g transform="translate(330 865) rotate(-12)"><ellipse rx={78} ry={26} fill="#e8a83a" />{[-48, -24, 0, 24, 48].map((x) => <line key={x} x1={x} y1={-22} x2={x} y2={22} stroke="#b07a1a" strokeWidth={4} />)}<path d="M -78 0 L -140 -26 L -130 20 Z" fill="#8a7a3a" /></g>
        <Caja x={-20} y={850} w={260} h={230} />
        <Caja x={300} y={880} w={280} h={200} />
        <Caja x={1240} y={820} w={420} h={200} />
        <Barrilito x={1420} y={700} w={140} h={110} />
        <Barrilito x={1680} y={720} w={150} h={120} />
        <g stroke="#3e2612" strokeWidth={26} strokeLinecap="round"><line x1={1720} y1={620} x2={1880} y2={880} /><line x1={1880} y1={600} x2={1730} y2={860} /></g>
        <path d="M 1500 1080 Q 1700 950 1920 960 L 1920 1080 Z" fill="#ffffff" />
      </svg>
      {/* el colono */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${tiembla}px)` }}>
        <Persona x={780} y={1105} h={760} t={t} seed={9} ropa={{ tunica: "#8a2420", tunica2: "#5a1410", cinto: "#2a1a10", piel: "#f6c6a0", piel2: "#d98d66", pelo: "#d0802a" }} gola gorro="morion" expr="miedo" mira={0.4} bD={60} cD={80} bI={0} cI={0} />
        {parp === 0 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={690} y={440} width={190} height={60} rx={20} fill="#f6c6a0" /></svg>}
        {/* nieve sobre el casco */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
          <path d="M 652 336 Q 662 236 778 228 Q 896 236 908 336 Q 862 282 778 270 Q 694 282 652 336 Z" fill="#f4f8ff" /><path d="M 580 430 Q 760 380 990 420 Q 760 400 580 430 Z" fill="#f4f8ff" /><ellipse cx={780} cy={585} rx={40} ry={32} fill="#4a1010" /><ellipse cx={780} cy={604} rx={24} ry={11} fill="#e0606a" />
          {/* el barril vacío, con la boca hacia nosotros */}
          <g transform={`translate(1150 570) rotate(${-14 + Math.sin(t * 9) * 2 * vive})`}>
            <path d="M -40 -230 L 200 -200 Q 240 0 200 200 L -40 230 Z" fill="#7a4a24" stroke="#3a2010" strokeWidth={8} />
            {[-120, 0, 120].map((y) => <path key={y} d={`M ${-40 + Math.abs(y) * 0.05} ${y * 1.1} L 210 ${y}`} stroke="#4a4a52" strokeWidth={14} />)}
            <ellipse cx={-40} cy={0} rx={150} ry={232} fill="#8a5a2c" stroke="#3a2010" strokeWidth={10} />
            <ellipse cx={-40} cy={0} rx={128} ry={206} fill="#3a2212" />
            <ellipse cx={-30} cy={20} rx={100} ry={170} fill="#2a180c" />
            {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-40 + (i - 2.5) * 40} y1={-196 + Math.abs(i - 2.5) * 12} x2={-40 + (i - 2.5) * 40} y2={196 - Math.abs(i - 2.5) * 12} stroke="#24140a" strokeWidth={4} opacity={0.6} />)}
            <path d="M -170 -110 Q -80 -250 60 -220 Q -40 -230 -120 -150 Z" fill="#f4f8ff" />
            {[-150, -100, -40, 20].map((x, i) => <path key={i} d={`M ${x} ${-200 + i * 4} q 6 ${40 + i * 10} 12 0`} fill="#dfeaff" />)}
          </g>
          {/* manos sobre el barril */}
          <circle cx={940} cy={720} r={36} fill="#f6c6a0" stroke="#d98d66" strokeWidth={4} />
          <circle cx={1290} cy={650} r={34} fill="#f6c6a0" stroke="#d98d66" strokeWidth={4} />
          <path d="M 520 1080 Q 560 860 760 850 Q 980 846 1060 1080 Z" fill="#f4f8ff" /><path d="M 600 900 Q 760 870 940 900" stroke="#c8d4f4" strokeWidth={10} fill="none" />
          {/* lágrimas */}
          <path d="M 700 560 q -8 24 0 30 q 8 -6 0 -30 Z" fill="#9ad0ff" />
        </svg>
      </div>
      {/* nieve que cae */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {NIEVE.map((f, i) => { const y = (f.y + t * f.v * vive * 2) % 1120 - 20; const x = (f.x + t * 60 * vive) % 1940; return <circle key={i} cx={x} cy={y} r={f.r} fill="#fff" opacity={0.85} />; })}
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={(i * 331) % 1920} y1={(i * 173) % 1080} x2={(i * 331) % 1920 + 18} y2={(i * 173) % 1080 + 46} stroke="#fff" strokeWidth={6} opacity={0.35} strokeLinecap="round" />)}
      </svg>
    </AbsoluteFill>
  );
};
