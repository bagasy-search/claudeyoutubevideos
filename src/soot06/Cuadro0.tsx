import React from "react";
import { interpolate, Easing } from "remotion";

// CUADRO 0 = la miniatura (soot_ola/minis/soot06_elegida.png) sin texto ni flecha, rehecha en SVG puro.
// Se dibuja en las coordenadas de la miniatura (1672x941) y se estira a 1920x1080.
// 0-2,3 s la escena cobra vida (vela, temblor, ratas, viento, nieve); 2,2-3,3 s la cámara entra por la ventana
// hasta el castillo nevado y funde al mundo del gancho (la bandera de la torre).
export const C0_FIN = 3.3;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1672, H = 941;

const Piedras: React.FC<{ x: number; y: number; w: number; h: number; bw: number; bh: number; fill: string; line: string; seed: number }> = ({ x, y, w, h, bw, bh, fill, line, seed }) => {
  const r: React.ReactNode[] = [];
  let k = 0;
  for (let j = 0; j * bh < h; j++) {
    const off = j % 2 ? bw / 2 : 0;
    for (let i = -1; i * bw < w; i++) {
      const v = Math.sin((i + 3) * 12.9898 + (j + seed) * 78.233) * 43758.5453;
      const f = v - Math.floor(v);
      r.push(<rect key={k++} x={x + i * bw + off + 3} y={y + j * bh + 3} width={bw - 6} height={bh - 6} rx={6} fill={fill} opacity={0.75 + f * 0.25} stroke={line} strokeWidth={3} />);
    }
  }
  return <g>{r}</g>;
};

const Rata: React.FC<{ x: number; y: number; s: number; flip?: boolean; t: number; seed: number; dx?: number }> = ({ x, y, s, flip, t, seed, dx = 0 }) => {
  const cola = Math.sin(t * 7 + seed) * 18;
  const pasito = Math.sin(t * 16 + seed) * 2.5;
  const bigote = Math.sin(t * 20 + seed) * 3;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={`M -105 10 C -160 ${30 + cola} -200 ${-10 - cola} -235 ${20 + cola}`} stroke="#e98a9a" strokeWidth={9} fill="none" strokeLinecap="round" />
      <ellipse cx={-10} cy={0} rx={105} ry={50} fill="#3d3a42" />
      <ellipse cx={-20} cy={-14} rx={80} ry={28} fill="#55515c" />
      <ellipse cx={-60} cy={44 + pasito} rx={20} ry={9} fill="#f0a3b0" />
      <ellipse cx={30} cy={44 - pasito} rx={20} ry={9} fill="#f0a3b0" />
      <path d="M 70 -25 Q 120 -10 135 18 Q 110 40 60 35 Z" fill="#3d3a42" />
      <ellipse cx={136} cy={18} rx={8} ry={7} fill="#ff8fa3" />
      <circle cx={64} cy={-40} r={24} fill="#55515c" />
      <circle cx={64} cy={-40} r={14} fill="#f2a0ae" />
      <circle cx={98} cy={-2} r={13} fill="#fff" />
      <circle cx={101} cy={-1} r={8} fill="#111" />
      <circle cx={103} cy={-4} r={3} fill="#fff" />
      <g stroke="#ddd" strokeWidth={2.5} strokeLinecap="round">
        <path d={`M 125 14 L 175 ${0 + bigote}`} /><path d={`M 125 18 L 178 ${20 + bigote}`} /><path d={`M 125 22 L 170 ${38 + bigote}`} />
      </g>
    </g>
  );
};

const Llama: React.FC<{ x: number; y: number; s: number; t: number; seed: number }> = ({ x, y, s, t, seed }) => {
  const f = 1 + Math.sin(t * 23 + seed) * 0.08 + Math.sin(t * 37 + seed * 2) * 0.05;
  const sw = Math.sin(t * 11 + seed) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * f})`}>
      <circle cx={0} cy={-20} r={90} fill="url(#c0halo)" />
      <path d={`M 0 -62 C ${18 + sw} -30 16 -6 0 4 C -16 -6 ${-18 + sw} -30 0 -62 Z`} fill="#ffb020" />
      <path d={`M 0 -40 C ${8 + sw} -22 8 -6 0 0 C -8 -6 ${-8 + sw} -22 0 -40 Z`} fill="#fff3c4" />
    </g>
  );
};

export const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t >= C0_FIN) return null;
  // empuje hacia la ventana (foco en el castillo de la ventana) y fundido
  const ent = interpolate(t, [2.2, 3.25], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const zoom = 1 + 0.06 * interpolate(t, [0, 2.2], [0, 1], cl) + 7 * ent;
  const fx = 215, fy = 330;
  const op = interpolate(t, [2.85, 3.3], [1, 0], cl);
  const tiembla = Math.sin(t * 55) * 3.2;
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(t * 9));
  const brillo = 1 + Math.sin(t * 19) * 0.04;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="c0halo"><stop offset="0" stopColor="#ffcf66" stopOpacity={0.55} /><stop offset="1" stopColor="#ffcf66" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0luz" cx="0.47" cy="0.35" r="0.6"><stop offset="0" stopColor="#c77a3a" /><stop offset="0.55" stopColor="#5a3a3a" /><stop offset="1" stopColor="#1d1d3a" /></radialGradient>
          <linearGradient id="c0cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1a5a" /><stop offset="1" stopColor="#2b5cc8" /></linearGradient>
          <radialGradient id="c0luna"><stop offset="0" stopColor="#ffffff" stopOpacity={0.9} /><stop offset="1" stopColor="#9fc4ff" stopOpacity={0} /></radialGradient>
          <linearGradient id="c0casco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd75a" /><stop offset="1" stopColor="#c98a12" /></linearGradient>
          <linearGradient id="c0piel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b6a52" /><stop offset="1" stopColor="#4e3527" /></linearGradient>
          <linearGradient id="c0hielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f6ff" /><stop offset="1" stopColor="#7cc3ff" /></linearGradient>
          <linearGradient id="c0madera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a3016" /><stop offset="0.5" stopColor="#9a5a2a" /><stop offset="1" stopColor="#4a250f" /></linearGradient>
          <clipPath id="c0vent"><path d="M 40 560 L 40 300 Q 40 180 190 170 Q 340 180 340 300 L 340 560 Z" /></clipPath>
        </defs>
        <g transform={`translate(${fx + (W / 2 - fx) * ent} ${fy + (H / 2 - fy) * ent}) scale(${zoom}) translate(${-fx} ${-fy})`}>
          {/* fondo: pared de piedra, cálida detrás de la cama, fría a los lados */}
          <rect x={0} y={0} width={W} height={H} fill="url(#c0luz)" />
          <Piedras x={0} y={0} w={560} h={620} bw={110} bh={62} fill="#223258" line="#121a38" seed={1} />
          <Piedras x={1180} y={0} w={220} h={700} bw={100} bh={58} fill="#7a4a30" line="#3e2216" seed={2} />
          <rect x={1180} y={0} width={220} height={700} fill="#ffb060" opacity={0.12 * brillo} />
          {/* ventana con luna y castillo nevado */}
          <g clipPath="url(#c0vent)">
            <rect x={30} y={160} width={320} height={410} fill="url(#c0cielo)" />
            <circle cx={180} cy={370} r={70} fill="url(#c0luna)" />
            <circle cx={180} cy={370} r={36} fill="#eef3ff" />
            <circle cx={168} cy={360} r={7} fill="#c8d4f0" /><circle cx={192} cy={382} r={5} fill="#c8d4f0" />
            {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={50 + ((i * 97) % 290)} cy={190 + ((i * 53) % 120)} r={2 + (i % 2)} fill="#fff" opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i))} />)}
            <g fill="#141a46">
              <rect x={70} y={430} width={250} height={140} />
              <rect x={95} y={385} width={52} height={110} /><path d="M 90 385 L 152 385 L 152 372 L 140 372 L 140 380 L 128 380 L 128 372 L 116 372 L 116 380 L 104 380 L 104 372 L 90 372 Z" />
              <rect x={215} y={350} width={46} height={140} /><path d="M 210 352 L 238 300 L 266 352 Z" />
              <rect x={280} y={410} width={40} height={90} />
              <path d="M 70 430 L 70 420 L 82 420 L 82 428 L 94 428 L 94 420 L 106 420 L 106 428 L 118 428 L 118 420 L 300 420 L 300 430 Z" />
            </g>
            {[[120, 420], [232, 380], [245, 420], [160, 470], [300, 450], [110, 500]].map(([x, y], i) => <rect key={i} x={x} y={y} width={8} height={12} fill="#ffcc55" opacity={0.7 + 0.3 * Math.sin(t * 5 + i)} />)}
            <path d="M 30 520 Q 120 495 200 512 Q 280 500 350 515 L 350 570 L 30 570 Z" fill="#dfe9ff" />
            {Array.from({ length: 30 }, (_, i) => {
              const x0 = 30 + ((i * 113) % 320), v = 60 + (i % 5) * 20;
              const y = 160 + ((i * 71 + t * v) % 410);
              return <circle key={i} cx={x0 + Math.sin(t * 2 + i) * 10} cy={y} r={2.5 + (i % 3)} fill="#fff" opacity={0.85} />;
            })}
          </g>
          <path d="M 40 560 L 40 300 Q 40 180 190 170 Q 340 180 340 300 L 340 560" fill="none" stroke="#2c3a66" strokeWidth={22} />
          <rect x={20} y={548} width={360} height={30} rx={6} fill="#3a4a7a" />
          <path d="M 22 550 Q 90 534 180 546 Q 280 532 378 548 L 378 556 L 22 556 Z" fill="#eaf2ff" />
          {/* cortinas rojas */}
          <path d="M 0 0 L 70 0 Q 60 120 30 220 L 0 230 Z" fill="#8a1424" />
          <path d="M 380 0 L 560 0 Q 545 200 560 470 Q 470 480 420 460 Q 440 250 380 0 Z" fill="#9a1a2c" />
          <path d="M 430 0 Q 470 220 450 450" stroke="#6a0d1a" strokeWidth={10} fill="none" /><path d="M 500 0 Q 520 220 505 460" stroke="#6a0d1a" strokeWidth={10} fill="none" />
          <path d="M 900 0 L 1240 0 L 1240 360 Q 1070 380 900 360 Z" fill="#8f1626" />
          {/* estandarte azul con flores de lis */}
          <path d="M 975 20 L 1095 20 L 1095 330 L 1035 300 L 975 330 Z" fill="#1d2f7a" stroke="#d9a63a" strokeWidth={6} />
          {[[1035, 150, 1.4], [930, 255, 0.9], [1120, 230, 0.9]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#e3b440">
              <path d="M 0 -50 C 18 -30 18 -5 0 15 C -18 -5 -18 -30 0 -50 Z" />
              <path d="M -6 0 C -30 -20 -55 -5 -40 20 C -32 8 -18 6 -6 12 Z" /><path d="M 6 0 C 30 -20 55 -5 40 20 C 32 8 18 6 6 12 Z" />
              <rect x={-26} y={14} width={52} height={10} rx={3} /><path d="M -5 24 L 5 24 L 0 46 Z" />
            </g>
          ))}
          <path d="M 1150 0 L 1235 0 L 1230 420 Q 1190 430 1160 410 Z" fill="#a51d30" />
          {/* candelabro de pared y escudo */}
          <g>
            <path d="M 1290 230 Q 1290 260 1260 262 L 1250 200 M 1290 230 Q 1300 200 1325 205 L 1330 190" stroke="#3a2a1a" strokeWidth={8} fill="none" />
            <rect x={1283} y={225} width={16} height={60} fill="#3a2a1a" />
            <rect x={1255} y={160} width={14} height={40} fill="#f3e2b5" /><rect x={1293} y={140} width={16} height={50} fill="#f3e2b5" />
            <Llama x={1262} y={158} s={0.55} t={t} seed={3} /><Llama x={1301} y={138} s={0.6} t={t} seed={5} />
          </g>
          <path d="M 1262 300 L 1350 300 L 1350 380 Q 1350 430 1306 445 Q 1262 430 1262 380 Z" fill="#a3172a" stroke="#d9a63a" strokeWidth={6} />
          <path d="M 1306 300 L 1306 445" stroke="#d9a63a" strokeWidth={4} />
          <path d="M 1280 340 Q 1300 320 1320 345 Q 1335 360 1322 390 Q 1300 380 1290 400 Q 1285 370 1280 340 Z" fill="#e3b440" />
          {/* torre helada a la derecha con la letrina */}
          <Piedras x={1370} y={0} w={310} h={940} bw={105} bh={64} fill="#5d7fb3" line="#2a3d6a" seed={4} />
          <path d="M 1470 650 L 1470 300 Q 1470 200 1545 195 Q 1620 200 1620 300 L 1620 650 Z" fill="#101833" />
          <path d="M 1470 650 L 1470 300 Q 1470 200 1545 195 Q 1620 200 1620 300 L 1620 650" fill="none" stroke="#9ec0ea" strokeWidth={14} />
          <path d="M 1600 330 L 1672 300 L 1672 640 L 1600 625 Z" fill="#7a4a24" stroke="#3a2010" strokeWidth={6} />
          <rect x={1608} y={400} width={60} height={12} fill="#2a2a2a" /><rect x={1608} y={540} width={60} height={12} fill="#2a2a2a" />
          <path d="M 1405 610 Q 1525 570 1640 610 L 1640 700 Q 1525 730 1405 700 Z" fill="#7b97c4" stroke="#2a3d6a" strokeWidth={6} />
          <ellipse cx={1525} cy={612} rx={70} ry={20} fill="#0a0f22" />
          <path d="M 1405 612 Q 1525 575 1640 612" stroke="#eaf6ff" strokeWidth={10} fill="none" />
          {[1395, 1420, 1450, 1480, 1560, 1590, 1625].map((x, i) => <path key={i} d={`M ${x - 9} 690 L ${x + 9} 690 L ${x} ${740 + (i % 3) * 25} Z`} fill="url(#c0hielo)" />)}
          {[1380, 1400, 1440, 1600, 1640, 1660].map((x, i) => <path key={i} d={`M ${x - 10} 0 L ${x + 10} 0 L ${x} ${60 + (i % 3) * 35} Z`} fill="url(#c0hielo)" />)}
          {[1390, 1420, 1580, 1610, 1650].map((x, i) => <path key={i} d={`M ${x - 9} 140 L ${x + 9} 140 L ${x} ${190 + (i % 2) * 30} Z`} fill="url(#c0hielo)" />)}
          <path d="M 1370 140 L 1672 120 L 1672 145 L 1370 160 Z" fill="#eaf6ff" opacity={0.9} />
          {/* viento que sale de la letrina */}
          {[0, 1, 2, 3, 4].map((i) => {
            const u = (t * 0.9 + i * 0.21) % 1;
            const y = 400 + i * 45;
            return <path key={i} d={`M ${1650 - u * 120} ${y} C ${1560 - u * 120} ${y - 30} ${1480 - u * 120} ${y + 30} ${1400 - u * 120} ${y - 10}`} stroke="#8fd0ff" strokeWidth={10 - i} fill="none" strokeLinecap="round" opacity={0.75 * Math.sin(u * Math.PI)} />;
          })}
          {/* cama: cabecero, postes y almohadas */}
          <rect x={540} y={360} width={700} height={240} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={8} />
          {[600, 700, 800, 900, 1000, 1100].map((x) => <rect key={x} x={x} y={385} width={70} height={190} rx={6} fill="#6a3a1a" stroke="#2e170a" strokeWidth={4} />)}
          <rect x={520} y={330} width={740} height={40} rx={6} fill="#8a4f22" stroke="#2e170a" strokeWidth={6} />
          <rect x={525} y={340} width={60} height={240} fill="#6e3c18" stroke="#2e170a" strokeWidth={6} />
          <path d="M 535 340 L 575 340 L 565 300 L 555 280 L 545 300 Z" fill="#8a4f22" stroke="#2e170a" strokeWidth={5} />
          <rect x={1180} y={240} width={70} height={360} fill="#6e3c18" stroke="#2e170a" strokeWidth={6} />
          <path d="M 1185 245 L 1245 245 L 1238 225 Q 1215 180 1212 205 L 1192 225 Z" fill="#8a4f22" stroke="#2e170a" strokeWidth={5} />
          <path d="M 590 470 Q 610 440 720 450 Q 760 470 750 560 Q 650 590 600 570 Z" fill="#a51d30" stroke="#5a0d18" strokeWidth={6} />
          <path d="M 1040 460 Q 1180 440 1210 480 Q 1215 560 1180 600 Q 1080 600 1045 560 Z" fill="#a51d30" stroke="#5a0d18" strokeWidth={6} />
          <path d="M 1150 510 Q 1215 500 1225 540 L 1220 620 L 1160 610 Z" fill="#f1e6cf" />
          {/* el chico: tiembla agarrado a la manta */}
          <g transform={`translate(${tiembla} 0)`}>
            <path d="M 730 560 Q 750 450 860 440 L 1010 440 Q 1080 470 1070 580 Z" fill="#a31a2a" />
            <path d="M 740 520 Q 760 440 870 450 Q 930 480 1000 450 Q 1070 450 1065 540 Q 1010 500 940 510 Q 860 500 740 520 Z" fill="#f4efe6" stroke="#cfc3ad" strokeWidth={5} />
            <circle cx={900} cy={505} r={8} fill="#e3b440" /><circle cx={980} cy={505} r={8} fill="#e3b440" />
            <ellipse cx={935} cy={395} rx={98} ry={92} fill="#ffd2ad" />
            <ellipse cx={865} cy={428} rx={22} ry={13} fill="#ff9a9a" opacity={0.7} /><ellipse cx={1008} cy={428} rx={22} ry={13} fill="#ff9a9a" opacity={0.7} />
            <ellipse cx={886} cy={390} rx={27} ry={30} fill="#fff" stroke="#333" strokeWidth={4} /><circle cx={876} cy={402} r={15} fill="#1a1a1a" /><circle cx={880} cy={397} r={5} fill="#fff" />
            <ellipse cx={968} cy={390} rx={27} ry={30} fill="#fff" stroke="#333" strokeWidth={4} /><circle cx={958} cy={402} r={15} fill="#1a1a1a" /><circle cx={962} cy={397} r={5} fill="#fff" />
            <path d="M 860 352 L 905 362 M 1000 352 L 955 362" stroke="#6b3a1a" strokeWidth={7} strokeLinecap="round" />
            <path d="M 875 440 Q 930 418 995 440 Q 1000 470 990 476 Q 930 462 880 476 Q 868 465 875 440 Z" fill="#fff" stroke="#333" strokeWidth={5} />
            <path d="M 876 458 Q 935 444 996 458 M 900 432 L 902 472 M 925 426 L 926 468 M 950 426 L 950 468 M 975 431 L 973 472" stroke="#333" strokeWidth={4} fill="none" />
            <path d="M 832 380 Q 820 260 940 255 Q 1060 260 1050 380 Q 940 340 832 380 Z" fill="url(#c0casco)" stroke="#8a5a08" strokeWidth={6} />
            <path d="M 825 378 Q 940 330 1060 378 L 1066 398 Q 940 352 818 398 Z" fill="#e0a52a" stroke="#8a5a08" strokeWidth={5} />
            <circle cx={985} cy={258} r={14} fill="#e0a52a" stroke="#8a5a08" strokeWidth={4} />
            <path d="M 890 280 Q 940 268 990 285" stroke="#fff3c4" strokeWidth={9} fill="none" opacity={0.6} strokeLinecap="round" />
            <ellipse cx={905} cy={540} rx={34} ry={26} fill="#ffd2ad" stroke="#d9a07a" strokeWidth={4} />
            <ellipse cx={975} cy={545} rx={34} ry={26} fill="#ffd2ad" stroke="#d9a07a" strokeWidth={4} />
          </g>
          {/* rayitas de temblor */}
          <g stroke="#5fb4ff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={pulso}>
            <path d="M 790 400 q 10 -10 0 -20 q -10 -10 0 -20" /><path d="M 1075 380 q 10 -10 0 -20 q -10 -10 0 -20 q 10 -10 0 -20" />
            <path d="M 725 480 q 10 -8 0 -16 q -10 -8 0 -16" /><path d="M 1100 545 q 10 -8 0 -16 q -10 -8 0 -16" />
          </g>
          {/* manta de piel enorme */}
          <path d="M 130 720 Q 300 610 560 600 Q 760 560 900 560 Q 1100 560 1300 620 Q 1380 700 1420 940 L 130 941 Z" fill="url(#c0piel)" />
          {Array.from({ length: 60 }, (_, i) => {
            const x = 150 + ((i * 211) % 1240), y = 600 + ((i * 97) % 330);
            return <path key={i} d={`M ${x} ${y} q ${8} ${18} ${-4} ${36}`} stroke={i % 2 ? "#a3836a" : "#3e2a1e"} strokeWidth={5} fill="none" strokeLinecap="round" />;
          })}
          <path d="M 130 720 Q 300 610 560 600 Q 760 560 900 560 Q 1100 560 1300 620" stroke="#c9ad92" strokeWidth={8} fill="none" strokeDasharray="14 10" />
          {[[700, 840], [900, 880], [1100, 800]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={14} ry={9} fill="#1e140e" />)}
          <path d="M 900 860 Q 1080 830 1230 820 L 1230 941 L 860 941 Z" fill="#9a1a2c" />
          <path d="M 1060 845 L 1080 941 M 1110 838 L 1130 941" stroke="#e3b440" strokeWidth={10} />
          {/* ratas sobre la manta */}
          <Rata x={385} y={690} s={0.7} t={t} seed={1} dx={interpolate(t, [0, 3], [0, 26])} />
          <Rata x={680} y={665} s={1.15} t={t} seed={2} dx={interpolate(t, [0, 3], [0, 34])} />
          <Rata x={1010} y={725} s={0.82} flip t={t} seed={3} dx={interpolate(t, [0, 3], [0, -28])} />
          {/* poste delantero */}
          <rect x={1230} y={560} width={95} height={381} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={6} />
          <rect x={1220} y={620} width={115} height={40} rx={6} fill="#8a4f22" stroke="#2e170a" strokeWidth={5} />
          <path d="M 1238 560 L 1318 560 L 1305 530 Q 1278 490 1250 530 Z" fill="#8a4f22" stroke="#2e170a" strokeWidth={5} />
          <rect x={1370} y={770} width={45} height={171} fill="#6e3c18" stroke="#2e170a" strokeWidth={5} />
          <path d="M 1372 772 L 1413 772 L 1405 745 Q 1392 720 1380 745 Z" fill="#8a4f22" stroke="#2e170a" strokeWidth={4} />
          <path d="M 1430 860 L 1672 840 L 1672 941 L 1440 941 Z" fill="#a3172a" stroke="#d9a63a" strokeWidth={6} />
          {/* mesita: vela y jarra */}
          <rect x={0} y={790} width={420} height={160} fill="#6e3c18" stroke="#2e170a" strokeWidth={6} />
          <rect x={0} y={770} width={430} height={30} fill="#8a4f22" stroke="#2e170a" strokeWidth={5} />
          <path d="M 0 840 L 420 840" stroke="#2e170a" strokeWidth={4} />
          <rect x={350} y={815} width={40} height={30} fill="#9a9a9a" stroke="#333" strokeWidth={3} />
          <path d="M 40 820 L 160 820 L 140 800 L 60 800 Z" fill="#7a5a28" stroke="#3a2a10" strokeWidth={4} />
          <rect x={88} y={680} width={24} height={125} fill="#7a5a28" stroke="#3a2a10" strokeWidth={4} />
          <path d="M 50 690 Q 100 670 150 690 L 140 700 L 60 700 Z" fill="#9a7a38" stroke="#3a2a10" strokeWidth={4} />
          <path d="M 68 690 L 68 595 Q 100 585 132 595 L 132 690 Z" fill="#f5e7c2" stroke="#c9b48a" strokeWidth={4} />
          <path d="M 70 600 Q 76 640 72 660" stroke="#e8d6a8" strokeWidth={6} fill="none" />
          <Llama x={100} y={588} s={1.25} t={t} seed={1} />
          <path d="M 220 790 L 230 690 Q 240 660 265 660 L 300 660 Q 320 660 325 690 L 335 790 Z" fill="#6a6a72" stroke="#2a2a30" strokeWidth={5} />
          <path d="M 330 700 Q 370 710 345 760" stroke="#2a2a30" strokeWidth={10} fill="none" />
          <path d="M 240 660 Q 275 630 315 660" fill="#8a8a92" stroke="#2a2a30" strokeWidth={4} />
          {/* luz cálida de la vela */}
          <circle cx={100} cy={560} r={260} fill="url(#c0halo)" opacity={0.35 * brillo} />
        </g>
      </svg>
    </div>
  );
};
