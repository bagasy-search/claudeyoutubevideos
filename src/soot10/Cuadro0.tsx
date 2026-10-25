import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { S } from "./obj";

// CUADRO 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot10_elegida.png) sin texto ni flecha, rehecha en código.
// Coordenadas de la miniatura (1672x941). A los 0 s está quieta e idéntica; después cobra vida (lluvia, balas que vuelan,
// el grumete fregando y llorando, el capitán sacudiendo el dedo) y la bala grande viene a cámara: tapa todo y abre al mundo.
const W = 1672, H = 941;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

const Bala: React.FC<{ x: number; y: number; r: number; fuego?: number; t: number; dir?: number }> = ({ x, y, r, fuego = 1, t, dir = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <g opacity={fuego}>
      <path d={`M ${dir * r * 0.4} ${-r * 0.55} L ${dir * r * (3.6 + Math.sin(t * 30) * 0.3)} ${-r * 0.05} L ${dir * r * 0.4} ${r * 0.55} Z`} fill="#ffb347" opacity={0.85} />
      <path d={`M ${dir * r * 0.5} ${-r * 0.3} L ${dir * r * 2.4} 0 L ${dir * r * 0.5} ${r * 0.3} Z`} fill="#fff3c4" />
      <circle cx={dir * r * 0.5} r={r * 0.9} fill="#ffcf5a" opacity={0.45} />
    </g>
    <circle r={r} fill="#25232e" />
    <circle r={r} fill="none" stroke="#0d0c14" strokeWidth={r * 0.08} />
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.32} ry={r * 0.18} fill="#8a8698" opacity={0.6} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.4})`} />
    <circle cx={r * 0.3} cy={r * 0.2} r={r * 0.08} fill="#c98a4a" opacity={0.7} />
    <circle cx={-r * 0.1} cy={r * 0.45} r={r * 0.06} fill="#c98a4a" opacity={0.7} />
  </g>
);

const Barril: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M ${-w / 2} 0 Q ${-w * 0.6} ${h / 2} ${-w / 2} ${h} L ${w / 2} ${h} Q ${w * 0.6} ${h / 2} ${w / 2} 0 Z`} fill="#8a4a20" />
    {[-0.3, -0.1, 0.1, 0.3].map((k) => <line key={k} x1={k * w} y1={0} x2={k * w} y2={h} stroke="#5a2d14" strokeWidth={4} />)}
    {[0.12, 0.88].map((k) => <rect key={k} x={-w * 0.58} y={h * k - 9} width={w * 1.16} height={18} rx={6} fill="#3a2a22" />)}
    <ellipse cx={0} cy={0} rx={w / 2} ry={w * 0.12} fill="#b8743a" stroke="#5a2d14" strokeWidth={5} />
    <path d={`M ${-w * 0.42} ${h * 0.2} Q ${-w * 0.5} ${h * 0.5} ${-w * 0.42} ${h * 0.8}`} stroke="#ffcf8a" strokeWidth={8} fill="none" opacity={0.5} strokeLinecap="round" />
  </g>
);

const Soga: React.FC<{ x: number; y: number; rx: number; ry: number; n?: number }> = ({ x, y, rx, ry, n = 3 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={x} cy={y - i * ry * 0.55} rx={rx - i * 6} ry={ry} fill="none" stroke="#c99a5a" strokeWidth={ry * 0.5} />)}
    {Array.from({ length: n }, (_, i) => <ellipse key={`b${i}`} cx={x} cy={y - i * ry * 0.55} rx={rx - i * 6} ry={ry} fill="none" stroke="#7a5228" strokeWidth={3} strokeDasharray="10 12" />)}
  </g>
);

const BarcoNegro: React.FC<{ x: number; y: number; s: number; t: number; op?: number }> = ({ x, y, s, t, op = 1 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.4 + x) * 6}) scale(${s}) rotate(${Math.sin(t * 1.1 + x) * 2})`} opacity={op}>
    <path d="M -150 120 L 150 120 L 120 190 L -120 190 Z" fill="#3a2a2a" />
    <rect x={-4} y={-170} width={8} height={300} fill="#2a1a1a" />
    <rect x={-90} y={-60} width={6} height={190} fill="#2a1a1a" />
    <path d="M -10 -150 Q 70 -110 90 -40 L 100 90 Q 30 70 -10 90 Z" fill="#1d2234" />
    <path d="M -96 -40 Q -40 -20 -20 30 L -20 110 Q -60 100 -100 110 Z" fill="#1d2234" />
    <g transform="translate(45 -10)"><circle r={20} fill="#e8e2f0" /><path d="M -30 22 L 30 50 M 30 22 L -30 50" stroke="#e8e2f0" strokeWidth={9} strokeLinecap="round" /><circle cx={-7} cy={-2} r={5} fill="#1d2234" /><circle cx={7} cy={-2} r={5} fill="#1d2234" /></g>
  </g>
);

const Grumete: React.FC<{ t: number }> = ({ t }) => {
  const fr = Math.sin(t * 12) * 18 * interpolate(t, [0, 0.15], [0, 1], cl); // friega
  const parp = (t % 2.7) > 2.6 ? 0.1 : 1;
  const lag = (t * 1.2) % 1;
  const resp = Math.sin(t * 5) * 4;
  return (
    <g>
      {/* piernas: rodilla en el piso y pie descalzo atrás */}
      <path d="M 1110 470 Q 1200 470 1250 520 L 1240 640 Q 1190 660 1140 640 L 1120 560 Z" fill="#2a2630" />
      <path d="M 1150 640 L 1165 668 L 1185 642 L 1205 672 L 1225 640" stroke="#2a2630" strokeWidth={12} fill="none" />
      <path d="M 1230 560 Q 1300 560 1320 620 L 1300 650 Q 1250 640 1225 610 Z" fill="#2a2630" />
      <path d="M 1300 600 Q 1350 590 1370 625 Q 1360 650 1320 650 Q 1290 645 1290 620 Z" fill="#f2b48a" />
      <path d="M 1190 630 Q 1220 660 1215 690 Q 1180 700 1150 685 Q 1140 660 1150 640 Z" fill="#f2b48a" />
      {/* torso con camisa rota y faja roja */}
      <path d={`M 870 590 Q 930 ${470 + resp} 1060 ${450 + resp} Q 1120 455 1130 520 Q 1120 610 1050 650 Q 960 690 900 700 Z`} fill="#f4ead2" />
      <path d="M 960 690 L 975 715 L 995 688 L 1015 712 L 1035 676" stroke="#f4ead2" strokeWidth={10} fill="none" />
      {[[980, 540], [1040, 590], [930, 640]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={14} ry={8} fill="#d8c8a8" />)}
      <path d={`M 1085 ${455 + resp} Q 1130 470 1140 520 L 1125 620 Q 1100 640 1080 640 L 1095 540 Z`} fill="#c92436" />
      {/* brazo trasero */}
      <path d={`M 960 640 Q 930 740 ${910 + fr} 815 L ${955 + fr} 818 Q 985 740 1005 660 Z`} fill="#f4ead2" />
      <ellipse cx={930 + fr} cy={825} rx={36} ry={20} fill="#f2b48a" />
      {/* cepillo */}
      <g transform={`translate(${fr} 0)`}>
        <path d="M 640 830 L 940 830 L 950 860 L 630 860 Z" fill="#8a4a20" />
        <path d="M 650 810 L 930 810 L 940 832 L 640 832 Z" fill="#a8622a" />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={636 + i * 10.6} y1={860} x2={632 + i * 10.6 + Math.sin(t * 20 + i) * 3} y2={900} stroke="#e0b070" strokeWidth={6} />)}
      </g>
      {/* espuma y salpicones */}
      {Array.from({ length: 26 }, (_, i) => { const r = rnd(i + 5); const a = r() * Math.PI, d = 20 + ((r() * 90 + t * 160) % 120); return <circle key={i} cx={620 + r() * 60 + Math.cos(a) * d * -1} cy={860 - Math.sin(a) * d * 0.6} r={3 + r() * 7} fill="#ffffff" opacity={0.85 - d / 200} />; })}
      {/* cabeza */}
      <g transform={`translate(850 635) rotate(${Math.sin(t * 6) * 1.5})`}>
        <ellipse cx={0} cy={0} rx={122} ry={115} fill="#f2b48a" />
        <ellipse cx={122} cy={10} rx={18} ry={26} fill="#e9a07a" />
        <path d="M -124 -10 Q -128 -118 0 -126 Q 120 -124 126 -30 Q 70 -70 -10 -60 Q -80 -50 -124 -10 Z" fill="#d8443a" />
        <path d="M 110 -60 Q 165 -55 190 -10 L 150 -12 Z M 118 -40 Q 175 -10 165 32 L 135 0 Z" fill="#c92436" />
        <path d="M -118 -20 Q -150 10 -128 44 L -112 10 Z" fill="#c98a4a" />
        {[[-52, -5], [42, -10]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(1 ${parp})`}>
            <ellipse rx={38} ry={44} fill="#fff" stroke="#3a1a10" strokeWidth={5} />
            <circle cx={-6} cy={-16} r={22} fill="#1d1420" />
            <circle cx={-14} cy={-24} r={8} fill="#fff" />
          </g>
        ))}
        <path d="M -92 -55 Q -60 -40 -22 -58 M 18 -62 Q 55 -45 88 -66" stroke="#a0602c" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M -40 60 Q -10 40 28 55 Q 22 95 -5 95 Q -35 92 -40 60 Z" fill="#7a1a20" />
        <rect x={-30} y={56} width={50} height={9} rx={4} fill="#fff" />
        <path d="M -25 84 Q -5 74 12 86 Q 0 94 -12 92 Z" fill="#e8607a" />
        <path d={`M 62 30 Q 72 ${60 + lag * 30} 64 ${90 + lag * 40}`} stroke="#7ad8ff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
        <circle cx={65} cy={100 + lag * 60} r={10} fill="#7ad8ff" opacity={1 - lag} />
        <path d="M -82 28 Q -90 50 -84 70" stroke="#7ad8ff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
        <ellipse cx={-92} cy={45} rx={18} ry={9} fill="#ff8a8a" opacity={0.5} />
        <ellipse cx={95} cy={40} rx={18} ry={9} fill="#ff8a8a" opacity={0.5} />
      </g>
      {/* brazo delantero (por delante de la cara, abajo) */}
      <path d={`M 800 720 Q 780 770 ${800 + fr} 815 L ${850 + fr} 818 Q 850 770 860 735 Z`} fill="#f4ead2" />
      <ellipse cx={825 + fr} cy={826} rx={40} ry={22} fill="#f2b48a" />
    </g>
  );
};

const Capitan: React.FC<{ t: number }> = ({ t }) => {
  const sac = Math.sin(t * 9) * 8 * interpolate(t, [0, 0.2], [0, 1], cl);
  return (
    <g>
      {/* piernas y botas */}
      <path d="M 1320 560 L 1300 680 L 1330 680 L 1360 580 Z" fill="#2a2630" />
      <path d="M 1290 660 Q 1280 700 1300 690 L 1350 690 L 1345 650 Z" fill="#141018" />
      <path d="M 1430 560 L 1500 700 L 1540 690 L 1470 560 Z" fill="#2a2630" />
      {/* casaca roja */}
      <path d="M 1170 260 Q 1300 210 1480 250 Q 1560 300 1560 420 L 1540 560 L 1290 560 L 1250 400 Z" fill="#b8202f" />
      <path d="M 1290 300 L 1400 300 L 1410 400 L 1300 400 Z" fill="#f4ead2" />
      <rect x={1270} y={390} width={260} height={46} rx={10} fill="#3a2418" />
      <rect x={1395} y={384} width={70} height={58} rx={8} fill="none" stroke="#f7c548" strokeWidth={10} />
      {[300, 340, 380, 470, 510].map((y) => <circle key={y} cx={1450} cy={y} r={9} fill="#f7c548" />)}
      <path d="M 1480 250 Q 1600 280 1640 360 L 1610 420 Q 1570 340 1500 320 Z" fill="#9e1a28" />
      <path d="M 1600 380 L 1660 400 L 1650 430 L 1600 420 Z" fill="#f7c548" />
      {/* brazo que señala */}
      <g transform={`rotate(${sac * 0.3} 1230 290)`}>
        <path d="M 1250 250 Q 1160 260 1100 270 L 1100 310 Q 1180 310 1260 320 Z" fill="#b8202f" />
        <rect x={1085} y={262} width={32} height={54} rx={8} fill="#1d1420" />
        <path d={`M 1090 275 L ${1010} ${284 + sac * 0.2} Q 1000 292 1012 300 L 1090 305 Z`} fill="#f2b48a" />
        <path d="M 1060 300 Q 1070 325 1090 312" stroke="#d98d66" strokeWidth={6} fill="none" />
      </g>
      {/* cabeza */}
      <g transform={`translate(1320 220) rotate(${sac * 0.15})`}>
        <ellipse cx={0} cy={0} rx={86} ry={92} fill="#e0a07a" />
        {/* barba */}
        <path d="M -95 -10 Q -110 120 -20 150 Q 40 170 90 120 Q 120 60 95 -10 Q 60 60 0 60 Q -60 60 -95 -10 Z" fill="#4a2a17" />
        <path d="M -60 30 Q 0 0 60 30 Q 40 50 0 45 Q -40 50 -60 30 Z" fill="#3a1d10" />
        {/* boca gritando */}
        <path d="M -30 55 Q 0 35 30 55 Q 25 95 0 98 Q -25 95 -30 55 Z" fill="#5a0f14" />
        <rect x={-22} y={52} width={44} height={10} rx={4} fill="#fff" />
        {/* ojos furiosos */}
        {[[-34, -15], [34, -15]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}><ellipse rx={25} ry={23} fill="#fff" stroke="#3a1a10" strokeWidth={4} /><circle cx={i ? -5 : 5} cy={2} r={10} fill="#1d1420" /></g>
        ))}
        <path d="M -65 -48 L -12 -30 M 65 -48 L 12 -30" stroke="#2a140a" strokeWidth={14} strokeLinecap="round" />
        <circle cx={92} cy={20} r={16} fill="none" stroke="#f7c548" strokeWidth={6} />
        <path d="M -95 -40 Q -100 20 -80 40 L -95 -20 Z M 95 -40 Q 104 10 88 30 Z" fill="#4a2a17" />
        {/* tricornio */}
        <path d="M -190 -40 Q -150 -110 -60 -130 Q 0 -230 80 -150 Q 180 -150 210 -60 Q 120 -90 0 -80 Q -110 -80 -190 -40 Z" fill="#141018" />
        <path d="M -190 -40 Q -100 -85 0 -82 Q 120 -90 210 -60" stroke="#f7c548" strokeWidth={10} fill="none" />
        <g transform="translate(20 -128)"><circle r={24} fill="#f4ead2" /><path d="M -34 24 L 34 52 M 34 24 L -34 52" stroke="#f4ead2" strokeWidth={10} strokeLinecap="round" /><circle cx={-8} cy={-2} r={6} fill="#141018" /><circle cx={8} cy={-2} r={6} fill="#141018" /></g>
      </g>
    </g>
  );
};

export const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.62) return null;
  const vivo = interpolate(t, [0, 0.12], [0, 1], cl);
  const push = 1 + interpolate(t, [0, 1.1], [0, 0.05], cl);
  // la bala grande viene a cámara y tapa todo
  const viene = interpolate(t, [0.95, 1.38], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const bx = 565 + viene * (836 - 565), by = 375 + viene * (470 - 375), br = 80 + viene * 1300;
  const sale = interpolate(t, [1.38, 1.6], [1, 0], cl);
  const rayo = (t > 0.32 && t < 0.42) || (t > 0.5 && t < 0.56);
  const r = rnd(3);
  const gotas = Array.from({ length: 140 }, () => [r() * W, r() * H, 30 + r() * 50]);
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="c0cielo" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#13284a" /><stop offset="0.5" stopColor="#2a7096" /><stop offset="1" stopColor="#1f5a78" /></linearGradient>
          <linearGradient id="c0piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b3a1f" /><stop offset="1" stopColor="#3a1d10" /></linearGradient>
          <radialGradient id="c0luz"><stop offset="0" stopColor="#ffcf5a" stopOpacity={0.9} /><stop offset="1" stopColor="#ff8a3a" stopOpacity={0} /></radialGradient>
          <linearGradient id="c0ola" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3fd8e0" /><stop offset="1" stopColor="#0d5a8a" /></linearGradient>
        </defs>
        <g transform={`translate(${W / 2} ${H * 0.55}) scale(${push}) translate(${-W / 2} ${-H * 0.55})`}>
          <rect width={W} height={H} fill="url(#c0cielo)" />
          {/* nubes de tormenta */}
          {[[200, 80, 260], [520, 40, 220], [820, 120, 240], [1150, 60, 260], [380, 220, 200]].map(([x, y, rr], i) => (
            <g key={i} transform={`translate(${x + Math.sin(t + i) * 8 * vivo} ${y})`} opacity={0.75}>
              <ellipse rx={rr} ry={rr * 0.38} fill="#24385c" /><ellipse cx={-rr * 0.4} cy={-rr * 0.15} rx={rr * 0.5} ry={rr * 0.3} fill="#3a5a84" /><ellipse cx={rr * 0.35} cy={-rr * 0.1} rx={rr * 0.45} ry={rr * 0.28} fill="#2d4a72" />
            </g>
          ))}
          <path d="M 900 0 L 870 90 L 905 95 L 860 210" stroke="#bff3ff" strokeWidth={rayo ? 8 : 4} fill="none" opacity={rayo ? 1 : 0.55} />
          <path d="M 120 140 L 95 220 L 125 225 L 90 320" stroke="#bff3ff" strokeWidth={4} fill="none" opacity={0.45} />
          {/* barcos enemigos y mar embravecido a la izquierda */}
          {[[600, 560, 0.5], [450, 610, 0.4]].map(([x, y, a], i) => <circle key={i} cx={x} cy={y} r={60} fill="url(#c0luz)" opacity={a + 0.2 * Math.sin(t * 9 + i)} />)}
          <path d={`M 0 420 Q 90 ${250 - Math.sin(t * 2) * 12 * vivo} 260 270 Q 380 290 420 380 Q 360 330 300 360 Q 380 470 520 560 Q 640 640 760 700 L 760 941 L 0 941 Z`} fill="url(#c0ola)" />
          <path d={`M 40 330 Q 150 ${240 - Math.sin(t * 2) * 12 * vivo} 280 285 Q 370 310 410 370`} stroke="#e8ffff" strokeWidth={18} fill="none" opacity={0.8} strokeLinecap="round" />
          <path d={`M 0 600 Q 160 520 300 600 Q 450 680 640 690`} stroke="#bff8ff" strokeWidth={14} fill="none" opacity={0.7} />
          <BarcoNegro x={600} y={470} s={0.55} t={t * vivo} op={0.6} />
          <BarcoNegro x={300} y={520} s={0.75} t={t * vivo} op={0.75} />
          <BarcoNegro x={190} y={410} s={1.15} t={t * vivo} />
          {Array.from({ length: 60 }, (_, i) => { const q = rnd(i + 50); const x = q() * 520, y = 470 + q() * 200 - ((t * 120 * vivo + q() * 60) % 60); return <circle key={i} cx={x} cy={y} r={3 + q() * 9} fill="#fff" opacity={0.6 + q() * 0.4} />; })}
          {/* jarcia y mástil a la derecha */}
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1060 + i * 50} y1={0} x2={1150 + i * 60} y2={600} stroke="#3a2418" strokeWidth={6} />)}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={`h${i}`} x1={1040} y1={60 + i * 70} x2={1420} y2={30 + i * 70} stroke="#3a2418" strokeWidth={4} />)}
          <rect x={1500} y={0} width={80} height={700} fill="#5a3418" />
          <rect x={1515} y={0} width={14} height={700} fill="#7a4a22" />
          <g transform={`translate(1620 140)`}>
            <circle r={90} fill="url(#c0luz)" opacity={0.7 + 0.2 * Math.sin(t * 13)} />
            <rect x={-30} y={-50} width={60} height={90} rx={10} fill="#ffcf5a" stroke="#3a2418" strokeWidth={8} />
            <path d="M -30 -50 L 0 -80 L 30 -50 Z" fill="#3a2418" />
          </g>
          {/* barandas y cubierta */}
          <path d="M 180 650 L 1150 560 L 1170 600 L 200 700 Z" fill="#6b3a1f" />
          {[260, 380, 500, 620, 740, 860, 980, 1100].map((x, i) => <rect key={x} x={x} y={650 - i * 11} width={22} height={70} fill="#4a2a17" />)}
          <path d="M 0 790 L 1672 590 L 1672 941 L 0 941 Z" fill="url(#c0piso)" />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} y1={810 + i * 22} x2={1672} y2={600 + i * 48} stroke="#2a140a" strokeWidth={4} opacity={0.7} />)}
          {Array.from({ length: 14 }, (_, i) => <path key={`w${i}`} d={`M ${200 + i * 110} ${930 - i * 15} l 60 -8`} stroke="#ffcf8a" strokeWidth={5} opacity={0.35} strokeLinecap="round" />)}
          {/* cañón disparando a la derecha */}
          <g transform="translate(1210 490)">
            <rect x={-60} y={-24} width={130} height={48} rx={20} fill="#2a2a34" />
            <circle cx={-20} cy={40} r={26} fill="#5a3418" />
            <circle cx={-110} cy={0} r={70 + Math.sin(t * 20) * 8} fill="url(#c0luz)" />
          </g>
          {/* balas */}
          <Bala x={960 - t * 180 * vivo} y={170 + t * 40 * vivo} r={38} t={t} />
          <Bala x={845 - t * 160 * vivo} y={255 + t * 30 * vivo} r={36} t={t} />
          <Bala x={460 - t * 140 * vivo} y={585 + t * 20 * vivo} r={32} t={t} />
          {Array.from({ length: 10 }, (_, i) => { const q = rnd(i + 90); return <rect key={i} x={700 + q() * 300 - t * 100 * vivo} y={260 + q() * 300} width={14} height={10} fill="#6b3a1f" transform={`rotate(${q() * 90 + t * 200} ${700 + q() * 300} ${260 + q() * 300})`} />; })}
          {/* barriles y sogas */}
          <Barril x={70} y={600} w={230} h={360} />
          <Soga x={110} y={860} rx={150} ry={34} n={3} />
          <Barril x={1620} y={520} w={170} h={220} />
          <Barril x={1570} y={680} w={250} h={300} />
          <Soga x={1600} y={560} rx={90} ry={22} n={4} />
          <g transform="translate(1320 157) scale(1.08) translate(-1320 -220)"><Capitan t={t * vivo} /></g>
          <circle cx={1650} cy={520} r={160} fill="url(#c0luz)" opacity={0.75 + 0.15 * Math.sin(t * 11)} />
          <Grumete t={t * vivo} />
          {/* la bala grande (la del gancho) */}
          {viene < 0.98 && <Bala x={bx} y={by} r={br} t={t} dir={-1} fuego={1 - viene} />}
          {/* lluvia */}
          {gotas.map(([x, y, l], i) => { const yy = (y + t * 1400 * vivo) % H; const xx = x - (t * 500 * vivo) % 200; return <line key={i} x1={xx} y1={yy} x2={xx - l * 0.35} y2={yy + l} stroke="#bfe4ff" strokeWidth={2.5} opacity={0.45} />; })}
          {rayo && <rect width={W} height={H} fill="#e8f0ff" opacity={0.25} />}
        </g>
        {viene >= 0.98 && <rect width={W} height={H} fill="#25232e" />}
      </svg>
      <S t={0.05} p="thunder" g={-10} />
      <S t={0.15} p="cannon" g={-10} />
      <S t={0.2} p="cloth" g={-10} />
      <S t={0.55} p="cloth" g={-10} pitch={1.1} />
      <S t={0.6} p="splash" g={-12} />
      <S t={0.95} p="whoosh_big" g={-4} />
      <S t={1.38} p="wood_hit" g={-6} />
    </AbsoluteFill>
  );
};
