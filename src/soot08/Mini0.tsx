import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";

// CUADRO 0 = la miniatura elegida (soot08_elegida.png) SIN el texto y SIN la flecha, rehecha en código.
// Coordenadas en píxeles de la miniatura (1672x941). 0-1,2 s la escena cobra vida (engranaje, pelusa,
// parpadeo, el bastón); 1,2-2,05 s la cámara se zambulle en el reloj de la pared, las agujas corren
// hacia atrás a las 5:30 y el reloj calza exacto sobre el reloj de la torre del gancho (fundido 2,05-2,25).
export const MINI_FIN = 2.25;
const W = 1672, H = 941, K = 1920 / W;
// reloj de la pared (miniatura) → reloj de la torre a los 2,05 s (centro 966,506, esfera r 312 px)
const RX = 240, RY = 266, RR = 118;
const Z1 = 312 / (RR * K);

const ease = Easing.inOut(Easing.cubic);
const pr = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const Pelusa: React.FC<{ x: number; y: number; r: number; o?: number; seed: number }> = ({ x, y, r, o = 1, seed }) => {
  const q = rnd(seed);
  const n = 7;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + q();
        const d = r * (0.35 + q() * 0.3);
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.8} r={r * (0.45 + q() * 0.25)} fill={i % 3 ? "#fbf6ec" : "#efe4d2"} />;
      })}
      <circle r={r * 0.6} fill="#fffaf2" />
    </g>
  );
};

const Engranaje: React.FC<{ x: number; y: number; r: number; dientes: number; rot: number; c1: string; c2: string }> = ({ x, y, r, dientes, rot, c1, c2 }) => {
  const d: string[] = [];
  for (let i = 0; i < dientes; i++) {
    const a0 = (i / dientes) * Math.PI * 2, a1 = ((i + 0.5) / dientes) * Math.PI * 2, s = Math.PI / dientes;
    const p = (a: number, rr: number) => `${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
    d.push(`${i ? "L" : "M"} ${p(a0 - s * 0.45, r - 22)} L ${p(a0 - s * 0.3, r)} L ${p(a0 + s * 0.3, r)} L ${p(a0 + s * 0.45, r - 22)} L ${p(a1, r - 22)}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d.join(" ") + " Z"} fill={c1} stroke="#2a2420" strokeWidth={4} />
      <circle r={r - 40} fill={c2} />
      <circle r={r - 62} fill="none" stroke="#3a342f" strokeWidth={8} opacity={0.6} />
      {[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x={-18} y={-(r - 70)} width={36} height={r - 150} rx={8} fill="#4a4540" transform={`rotate(${a})`} opacity={0.55} />)}
      <circle r={r * 0.32} fill="#7c7873" stroke="#2f2a26" strokeWidth={6} />
      <circle r={r * 0.17} fill="#56524d" />
      <circle r={r * 0.07} fill="#2b2724" />
      <path d={`M ${-r * 0.62} ${-r * 0.5} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.2} ${-r * 0.78}`} stroke="#c9c3ba" strokeWidth={10} fill="none" opacity={0.5} strokeLinecap="round" />
    </g>
  );
};

export const Mini0: React.FC<{ t: number }> = ({ t }) => {
  if (t >= MINI_FIN) return null;
  // cámara: quieta en el cuadro 0, respira un poco, y a los 1,2 s se zambulle en el reloj
  const z = pr(t, 1.2, 2.05, Easing.in(Easing.cubic));
  const s = 1 + 0.035 * pr(t, 0, 1.2, Easing.out(Easing.quad)) + (Z1 - 1.035) * z;
  // punto de la miniatura que queda en el centro de la toma (en px de pantalla 1920)
  const fx = interpolate(z, [0, 1], [W / 2 * K, RX * K]), fy = interpolate(z, [0, 1], [H / 2 * K, RY * K]);
  const tx = interpolate(z, [0, 1], [960, 966]), ty = interpolate(z, [0, 1], [540, 506]);
  const op = 1 - pr(t, 2.05, 2.25, Easing.linear);
  const rot = t * 38; // engranaje
  // agujas: 7:44 → corren hacia atrás hasta 5:30
  const hora = interpolate(pr(t, 1.3, 1.95), [0, 1], [7 + 44 / 60, 5.5]);
  const am = (hora % 12) * 30, mm = (hora % 1) * 360 - (pr(t, 1.3, 1.95) * 360 * 2);
  const parp = (t > 0.85 && t < 0.97) ? 0.1 : 1;
  const resp = Math.sin(t * 5) * 3;
  const baston = -4 * Math.sin(Math.max(0, t - 0.3) * 7) * Math.exp(-Math.max(0, t - 0.3) * 1.2);
  const lagr = pr(t, 0.2, 1.6, Easing.linear) * 26;
  const q = rnd(77);
  const vuelan = Array.from({ length: 16 }, () => ({ x: 980 + q() * 620, y: 280 + q() * 420, r: 10 + q() * 22, vx: -40 - q() * 90, vy: 30 + q() * 60, f: q() * 6 }));
  const caen = Array.from({ length: 22 }, () => ({ x: q() * W, y: q() * H * 0.8, r: 3 + q() * 6, f: q() * 6 }));
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <defs>
        <linearGradient id="m0pared" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#f2d2a0" /><stop offset="0.25" stopColor="#a8754a" /><stop offset="0.55" stopColor="#4e3628" /><stop offset="1" stopColor="#2a1f1a" />
        </linearGradient>
        <linearGradient id="m0piso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a36" /><stop offset="0.5" stopColor="#5a3721" /><stop offset="1" stopColor="#3a2416" />
        </linearGradient>
        <radialGradient id="m0luz" cx="0.08" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#fff2cf" stopOpacity="0.5" /><stop offset="0.45" stopColor="#ffd796" stopOpacity="0.14" /><stop offset="1" stopColor="#ffd796" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m0ventana" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#f3d9a6" />
        </linearGradient>
        <linearGradient id="m0pantalon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a3b26" /><stop offset="1" stopColor="#3a2518" />
        </linearGradient>
        <linearGradient id="m0gorra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8784a" /><stop offset="1" stopColor="#7a5232" />
        </linearGradient>
        <radialGradient id="m0cara" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffd8b4" /><stop offset="1" stopColor="#f0b083" />
        </radialGradient>
      </defs>
      <g transform={`translate(${tx} ${ty}) scale(${s}) translate(${-fx} ${-fy}) scale(${K})`}>
        {/* fondo: pared del galpón con ventanales a la izquierda, la luz entra a raudales */}
        <rect x={0} y={0} width={W} height={H} fill="url(#m0pared)" />
        <path d="M 0 0 L 640 0 L 380 120 L 0 150 Z" fill="#4a3426" opacity={0.75} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${30 + i * 150} 0 L ${10 + i * 120} 140`} stroke="#2e2019" strokeWidth={16} opacity={0.6} />)}
        <g opacity={0.95}>
          <rect x={-10} y={120} width={95} height={540} fill="url(#m0ventana)" />
          {[200, 290, 380, 470, 560].map((y) => <rect key={y} x={-10} y={y} width={95} height={7} fill="#6b4a32" opacity={0.7} />)}
          <rect x={38} y={120} width={7} height={540} fill="#6b4a32" opacity={0.7} />
          <rect x={85} y={110} width={20} height={560} fill="#5a3d2a" />
          <rect x={300} y={330} width={70} height={310} fill="url(#m0ventana)" opacity={0.85} />
          <rect x={425} y={285} width={60} height={140} fill="#e6eef5" />
          <rect x={453} y={285} width={5} height={140} fill="#6b4a32" /><rect x={425} y={350} width={60} height={5} fill="#6b4a32" />
        </g>
        {/* rayos de luz desde los ventanales */}
        <g opacity={0.14 + 0.03 * Math.sin(t * 2)}>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${40 + i * 10} ${150 + i * 90} L ${700 + i * 120} ${560 + i * 70} L ${700 + i * 120} ${640 + i * 70} L ${40 + i * 10} ${200 + i * 90} Z`} fill="#fff1c9" />)}
        </g>
        {/* reloj de la pared */}
        <g transform={`translate(${RX} ${RY})`}>
          <circle r={RR + 22} fill="#2e2620" />
          <circle r={RR + 12} fill="#5a4a3e" />
          <circle r={RR} fill="#f1e7cf" />
          {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-RR + 6} x2={0} y2={i % 5 ? -RR + 12 : -RR + 18} stroke="#3a2e26" strokeWidth={i % 5 ? 1.5 : 4} transform={`rotate(${i * 6})`} />)}
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) / 12) * Math.PI * 2;
            return <text key={i} x={Math.sin(a) * (RR - 36)} y={-Math.cos(a) * (RR - 36) + 10} textAnchor="middle" fontFamily="Georgia, serif" fontSize={28} fill="#2a221c">{i + 1}</text>;
          })}
          <line x1={0} y1={10} x2={0} y2={-58} stroke="#1e1915" strokeWidth={8} strokeLinecap="round" transform={`rotate(${am})`} />
          <line x1={0} y1={14} x2={0} y2={-92} stroke="#1e1915" strokeWidth={5} strokeLinecap="round" transform={`rotate(${mm})`} />
          <line x1={0} y1={16} x2={0} y2={-96} stroke="#5a1a14" strokeWidth={2} transform={`rotate(${t * 360})`} />
          <circle r={8} fill="#1e1915" />
          <path d={`M ${-RR * 0.75} ${-RR * 0.45} Q ${-RR * 0.4} ${-RR * 0.9} ${RR * 0.15} ${-RR * 0.92}`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.35} strokeLinecap="round" />
        </g>
        {/* piso de tablones en perspectiva */}
        <path d={`M 0 760 L 700 640 L ${W} 660 L ${W} ${H} L 0 ${H} Z`} fill="url(#m0piso)" />
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={720} y1={642} x2={-900 + i * 240} y2={H + 40} stroke="#2f1d12" strokeWidth={3} opacity={0.55} />)}
        <path d={`M 0 860 Q 500 760 1100 800 L 1100 830 Q 500 800 0 900 Z`} fill="#fff0cc" opacity={0.12} />
        {/* el capataz, al fondo a la izquierda, bastón en alto */}
        <g transform="translate(205 0)">
          <ellipse cx={0} cy={765} rx={110} ry={14} fill="#1e140e" opacity={0.4} />
          <path d="M -70 640 L -80 755 L -30 760 L -20 650 Z" fill="#26201d" />
          <path d="M 25 650 L 45 758 L 100 758 L 80 640 Z" fill="#26201d" />
          <ellipse cx={-55} cy={760} rx={38} ry={12} fill="#141010" /><ellipse cx={75} cy={760} rx={38} ry={12} fill="#141010" />
          <path d="M -105 520 Q -5 485 95 520 L 125 690 Q 10 720 -115 690 Z" fill="#33302e" />
          <path d="M -40 515 L 0 610 L 40 515 Z" fill="#f3efe8" />
          <path d="M -30 540 L 0 640 L 30 540 L 25 650 L -25 650 Z" fill="#3e3a37" />
          <path d="M -18 520 L 0 530 L 18 520 L 18 538 L 0 530 L -18 538 Z" fill="#111" />
          {/* brazo con el bastón */}
          <g transform={`rotate(${baston} -85 530)`}>
            <path d="M -95 525 Q -140 560 -120 600 L -95 600 Q -95 570 -70 545 Z" fill="#33302e" />
            <line x1={-150} y1={380} x2={-50} y2={690} stroke="#6a4024" strokeWidth={11} strokeLinecap="round" transform="translate(45 0) rotate(-12 -100 535)" />
            <circle cx={-110} cy={598} r={22} fill="#e9a07a" />
          </g>
          <path d="M 95 525 Q 140 570 120 625 L 98 622 Q 105 585 78 550 Z" fill="#33302e" />
          <circle cx={112} cy={630} r={20} fill="#e9a07a" />
          {/* cabeza */}
          <ellipse cx={0} cy={478} rx={52} ry={50} fill="#e9a07a" />
          <circle cx={-48} cy={482} r={12} fill="#df9470" /><circle cx={48} cy={482} r={12} fill="#df9470" />
          <circle cx={-18} cy={470} r={9} fill="#fff" /><circle cx={18} cy={470} r={9} fill="#fff" />
          <circle cx={-16} cy={471} r={5} fill="#111" /><circle cx={16} cy={471} r={5} fill="#111" />
          <path d="M -36 450 L -6 462" stroke="#1a1310" strokeWidth={8} strokeLinecap="round" /><path d="M 36 450 L 6 462" stroke="#1a1310" strokeWidth={8} strokeLinecap="round" />
          <ellipse cx={0} cy={485} rx={9} ry={8} fill="#d47e5a" />
          <path d="M -40 505 Q -20 486 0 496 Q 20 486 40 505 Q 20 498 0 504 Q -20 498 -40 505 Z" fill="#1a1310" />
          <path d="M -12 512 Q 0 506 12 512" stroke="#5a2a1a" strokeWidth={3} fill="none" />
          {/* galera */}
          <ellipse cx={0} cy={436} rx={66} ry={13} fill="#151212" />
          <path d="M -40 436 L -44 368 Q 0 358 44 368 L 40 436 Z" fill="#1d1a19" />
          <rect x={-42} y={420} width={84} height={12} fill="#3a2e2a" />
          <path d="M -30 372 L -28 425" stroke="#fff" strokeWidth={4} opacity={0.15} />
        </g>
        {/* la hiladora (mule): patas, rodillos de algodón y viga que viene hacia cámara */}
        <g>
          <path d="M 380 540 L 1100 160 L 1150 220 L 400 610 Z" fill="#3a2a20" />
          <path d="M 360 400 L 760 190 L 780 225 L 380 440 Z" fill="#6a4a30" />
          {Array.from({ length: 9 }, (_, i) => {
            const k = i / 8;
            return <ellipse key={i} cx={400 + k * 330} cy={455 - k * 175} rx={26 + k * 8} ry={44 + k * 10} fill={i % 2 ? "#f4ede0" : "#fbf7ee"} transform={`rotate(-28 ${400 + k * 330} ${455 - k * 175})`} />;
          })}
          {Array.from({ length: 10 }, (_, i) => {
            const k = i / 9;
            return <ellipse key={i} cx={410 + k * 320} cy={525 - k * 170} rx={22 + k * 8} ry={36 + k * 8} fill={i % 2 ? "#ece2d0" : "#f6efe2"} transform={`rotate(-28 ${410 + k * 320} ${525 - k * 170})`} />;
          })}
          <path d="M 370 455 L 760 245" stroke="#8a5a32" strokeWidth={12} />
          <path d="M 375 540 L 760 330" stroke="#8a5a32" strokeWidth={10} />
          {/* maquinaria oscura bajo la viga */}
          <path d="M 380 600 L 1150 230 L 1300 300 L 1320 640 L 1000 660 L 420 760 Z" fill="#2a201b" />
          {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={430 + i * 38} cy={680 - i * 12} r={22} fill="none" stroke="#4a3a30" strokeWidth={6} strokeDasharray="6 5" />)}
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={600 + i * 90} y1={560 - i * 40} x2={600 + i * 90} y2={660} stroke="#3e302a" strokeWidth={6} />)}
          {/* patas de hierro */}
          <rect x={345} y={300} width={50} height={470} fill="#2c2420" /><rect x={352} y={300} width={10} height={470} fill="#4a3c33" />
          <rect x={335} y={735} width={70} height={30} fill="#231c18" />
          <rect x={505} y={250} width={65} height={540} fill="#2c2420" /><rect x={512} y={250} width={12} height={540} fill="#4e4036" />
          <rect x={492} y={760} width={92} height={36} fill="#231c18" />
          {[340, 420, 520, 640, 700].map((y, i) => <circle key={i} cx={537} cy={y} r={6} fill="#6a5a4e" />)}
          {/* viga superior grande con los conos de algodón, viene hacia la cámara arriba a la derecha */}
          <path d="M 560 330 L 1380 -40 L 1460 20 L 600 400 Z" fill="#4a3628" />
          <path d="M 560 330 L 1380 -40 L 1390 -20 L 575 352 Z" fill="#7a5a3e" />
          <path d="M 600 395 L 1460 15" stroke="#2a1d16" strokeWidth={16} />
          {Array.from({ length: 11 }, (_, i) => {
            const k = i / 10;
            const cx = 640 + k * 640, cy = 335 - k * 300, r = 26 + k * 26;
            return <Pelusa key={i} x={cx} y={cy} r={r} seed={i + 5} />;
          })}
          {Array.from({ length: 22 }, (_, i) => <line key={i} x1={640 + i * 30} y1={355 - i * 14} x2={650 + i * 30} y2={470 - i * 10} stroke="#d8cbb4" strokeWidth={1.5} opacity={0.5} />)}
        </g>
        {/* engranaje gigante + correa a la derecha */}
        <rect x={1270} y={80} width={80} height={280} fill="#24201d" />
        <Engranaje x={1330} y={600} r={130} dientes={18} rot={-rot * 1.9 + 7} c1="#4e4a46" c2="#3e3a36" />
        <Engranaje x={1525} y={330} r={300} dientes={40} rot={rot} c1="#5e5a56" c2="#4c4844" />
        <g transform="rotate(-18 1290 385)">
          <ellipse cx={1290} cy={385} rx={195} ry={225} fill="none" stroke="#7a4220" strokeWidth={20} />
          <ellipse cx={1290} cy={385} rx={195} ry={225} fill="none" stroke="#b06a36" strokeWidth={6} strokeDasharray="40 30" strokeDashoffset={-t * 300} opacity={0.6} />
        </g>
        {/* estela de pelusa que escupe el engranaje */}
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={1000 + i * 22} y1={300 + i * 22} x2={1180 + i * 18} y2={340 + i * 24} stroke="#efe6d6" strokeWidth={2} opacity={0.35} />)}
        {/* el chico gateando, cara de terror (cara ~825,545) */}
        <g transform={`translate(0 ${resp * 0.5})`}>
          <ellipse cx={960} cy={845} rx={430} ry={30} fill="#1e130b" opacity={0.5} />
          {/* espalda y piernas (pantalón con parche), se van hacia el fondo a la derecha */}
          <path d="M 1000 560 Q 1130 540 1250 620 Q 1330 690 1340 790 L 1250 830 Q 1150 830 1080 790 L 990 700 Z" fill="url(#m0pantalon)" />
          <path d="M 1230 690 Q 1320 720 1345 800 L 1352 838 L 1262 842 Q 1250 790 1205 760 Z" fill="#33200f" />
          <path d="M 1250 805 L 1350 800 L 1356 840 L 1255 845 Z" fill="#1f140d" />
          <rect x={1158} y={738} width={66} height={62} fill="#a5764a" transform="rotate(-14 1190 768)" stroke="#6a4628" strokeWidth={3} strokeDasharray="6 5" />
          {[[1090, 640], [1180, 610], [1280, 700]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={18} ry={10} fill="#7a5a3a" opacity={0.5} />)}
          {/* torso: camisa sucia y tiradores */}
          <path d="M 660 650 Q 720 575 860 572 Q 1000 568 1060 620 L 1040 760 L 720 770 Z" fill="#d9cfbf" />
          <path d="M 845 575 L 880 770" stroke="#3a2518" strokeWidth={26} /><path d="M 1000 585 L 1020 760" stroke="#3a2518" strokeWidth={26} />
          {[[740, 690], [930, 640], [975, 700], [800, 735], [700, 660]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={15} ry={9} fill="#7a5a3a" opacity={0.6} />)}
          {/* brazo izquierdo de pantalla: hombro 700,690 → mano 600,815 */}
          <path d="M 670 660 Q 625 700 620 745 L 680 760 Q 690 720 735 690 Z" fill="#d9cfbf" />
          <ellipse cx={650} cy={752} rx={40} ry={22} fill="#cbbea8" />
          <path d="M 622 760 Q 600 785 595 812 L 655 815 Q 662 790 680 768 Z" fill="#f6c49a" />
          <ellipse cx={640} cy={790} rx={12} ry={8} fill="#7a5a3a" opacity={0.55} />
          <path d="M 540 832 Q 552 800 605 800 Q 665 800 685 832 Q 645 846 540 840 Z" fill="#f6c49a" />
          {[555, 580, 607, 635].map((x) => <line key={x} x1={x} y1={828} x2={x + 6} y2={840} stroke="#d9946c" strokeWidth={3} />)}
          {/* brazo derecho: hombro 1000,680 → mano 940,825 */}
          <path d="M 975 660 Q 1030 700 1022 760 L 965 768 Q 965 720 935 690 Z" fill="#d9cfbf" />
          <ellipse cx={992} cy={762} rx={40} ry={22} fill="#cbbea8" />
          <path d="M 962 772 L 1015 772 L 1000 832 L 948 832 Z" fill="#f6c49a" />
          <ellipse cx={985} cy={795} rx={13} ry={9} fill="#7a5a3a" opacity={0.55} />
          <path d="M 870 848 Q 882 812 935 812 Q 995 812 1010 848 Q 960 860 870 852 Z" fill="#f6c49a" />
          {[888, 915, 943, 972].map((x) => <line key={x} x1={x} y1={840} x2={x + 4} y2={852} stroke="#d9946c" strokeWidth={3} />)}
          {/* cabeza */}
          <circle cx={688} cy={598} r={30} fill="#f0b48a" /><circle cx={690} cy={600} r={14} fill="#e0997a" />
          <circle cx={950} cy={540} r={26} fill="#f0b48a" />
          <ellipse cx={822} cy={548} rx={135} ry={122} fill="url(#m0cara)" />
          <path d="M 690 520 Q 672 570 700 600 L 712 540 Z" fill="#e39a45" />
          <path d="M 930 470 Q 960 500 948 535 L 925 495 Z" fill="#e39a45" />
          {/* ojos grandes */}
          {[[767, 552, 40], [868, 508, 38]].map(([x, y, r], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={r} ry={r * 1.08 * parp} fill="#fff" stroke="#3a2416" strokeWidth={3} />
              {parp > 0.5 && <><circle cx={x - 6} cy={y + 1} r={r * 0.56} fill="#6a3c1c" /><circle cx={x - 7} cy={y + 2} r={r * 0.33} fill="#1a0f08" /><circle cx={x - 15} cy={y - 10} r={r * 0.18} fill="#fff" /></>}
            </g>
          ))}
          <path d="M 728 512 Q 760 506 794 488" stroke="#8a5a2a" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 838 462 Q 868 462 900 476" stroke="#8a5a2a" strokeWidth={7} fill="none" strokeLinecap="round" />
          <ellipse cx={742} cy={612} rx={26} ry={16} fill="#f08a7a" opacity={0.5} /><ellipse cx={905} cy={570} rx={24} ry={15} fill="#f08a7a" opacity={0.5} />
          <circle cx={912} cy={566} r={15} fill="#6a4a30" opacity={0.6} /><circle cx={900} cy={588} r={9} fill="#6a4a30" opacity={0.5} /><circle cx={760} cy={640} r={10} fill="#6a4a30" opacity={0.45} />
          <path d="M 818 572 Q 826 578 832 571" stroke="#c9845e" strokeWidth={3} fill="none" />
          {/* boca abierta de terror: comisuras abajo */}
          <path d="M 806 636 Q 818 606 842 604 Q 868 604 878 630 Q 870 652 842 654 Q 816 654 806 636 Z" fill="#5a1a1a" />
          <path d="M 822 646 Q 842 634 862 644 Q 852 654 842 654 Q 830 654 822 646 Z" fill="#e66a6a" />
          <path d="M 816 618 Q 842 608 868 618 L 865 624 Q 842 616 819 624 Z" fill="#fff" />
          {/* lágrima y gota de sudor */}
          <path d={`M 718 ${582 + lagr} q -9 16 0 22 q 9 -6 0 -22 Z`} fill="#bfe6ff" stroke="#6aaad6" strokeWidth={2} />
          <path d="M 912 488 q -6 12 0 16 q 6 -4 0 -16 Z" fill="#bfe6ff" stroke="#6aaad6" strokeWidth={2} />
          {/* gorra plana marrón, ladeada */}
          <g transform="translate(-6 -30) translate(830 470) scale(0.88) translate(-830 -470)">
          <path d="M 588 545 Q 560 450 640 385 Q 740 320 860 330 Q 950 345 940 410 Q 915 440 860 455 Q 720 495 588 545 Z" fill="url(#m0gorra)" />
          <path d="M 575 540 Q 720 478 870 445 Q 925 432 945 412 Q 942 450 880 470 Q 730 510 590 568 Z" fill="#6a4426" />
          <path d="M 650 400 Q 750 345 880 350" stroke="#c49a6a" strokeWidth={6} fill="none" opacity={0.55} />
          <circle cx={770} cy={348} r={10} fill="#8a6038" />
          </g>
        </g>
        {/* pelusa: montones en las esquinas, copos en el piso y copos que vuelan del engranaje */}
        {[[60, 850, 90], [150, 900, 80], [20, 930, 70], [1580, 880, 110], [1470, 920, 90], [1650, 800, 80], [460, 800, 22], [740, 805, 24], [1250, 865, 28], [1420, 830, 30]].map(([x, y, r], i) => <Pelusa key={i} x={x} y={y} r={r} seed={60 + i} />)}
        {vuelan.map((p, i) => {
          const k = ((t * 0.6 + p.f) % 1.6);
          return <Pelusa key={i} x={p.x + p.vx * k} y={p.y + p.vy * k} r={p.r} o={0.9} seed={100 + i} />;
        })}
        {caen.map((p, i) => <circle key={i} cx={p.x + Math.sin(t * 2 + p.f) * 10} cy={(p.y + t * 40) % H} r={p.r} fill="#fff8ea" opacity={0.7} />)}
        {/* luz cálida que baña todo desde la izquierda */}
        <rect x={0} y={0} width={W} height={H} fill="url(#m0luz)" />
      </g>
    </svg>
  );
};
