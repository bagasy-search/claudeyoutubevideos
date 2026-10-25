import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";

// CUADRO 0 = la miniatura elegida (soot08_elegida.png) SIN el texto y SIN la flecha, rehecha en código.
// Coordenadas en píxeles de la miniatura (1672x941). 0-1,2 s la escena cobra vida (engranaje, correa,
// pelusa, parpadeo, el bastón); 1,2-2,05 s la cámara se zambulle en el reloj de la pared, las agujas
// corren hacia atrás a las 5:30 y el reloj calza exacto sobre el reloj de la torre del gancho (fundido 2,05-2,25).
export const MINI_FIN = 2.25;
const W = 1672, H = 941, K = 1920 / W;
// reloj de la pared (miniatura) → reloj de la torre a los 2,05 s (centro 966,506, esfera r 312 px)
const RX = 240, RY = 266, RR = 118;
const Z1 = 312 / (RR * K);

const ease = Easing.inOut(Easing.cubic);
const pr = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// copo de algodón: racimo de bolitas con sombra abajo y brillo arriba
const Pelusa: React.FC<{ x: number; y: number; r: number; o?: number; seed: number; blur?: boolean; tinte?: string }> = ({ x, y, r, o = 1, seed, blur, tinte = "#efe3cf" }) => {
  const q = rnd(seed);
  const n = 9;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o} filter={blur ? "url(#m0bl)" : undefined}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + q();
        const d = r * (0.3 + q() * 0.35);
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.75 + r * 0.08} r={r * (0.4 + q() * 0.25)} fill={tinte} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + q();
        const d = r * (0.2 + q() * 0.3);
        return <circle key={`b${i}`} cx={Math.cos(a) * d - r * 0.08} cy={Math.sin(a) * d * 0.7 - r * 0.12} r={r * (0.3 + q() * 0.2)} fill="#fffdf7" />;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const a = q() * Math.PI * 2;
        return <path key={`f${i}`} d={`M ${Math.cos(a) * r * 0.6} ${Math.sin(a) * r * 0.5} q ${Math.cos(a) * r * 0.4} ${Math.sin(a) * r * 0.2} ${Math.cos(a) * r * 0.7} ${Math.sin(a) * r * 0.5}`} stroke="#fffaf0" strokeWidth={Math.max(1, r * 0.06)} fill="none" opacity={0.8} />;
      })}
    </g>
  );
};

// engranaje con dientes, brazos, cubo y brillo de canto
const Engranaje: React.FC<{ r: number; dientes: number; rot: number; c1: string; c2: string; brazos?: number }> = ({ r, dientes, rot, c1, c2, brazos = 6 }) => {
  const d: string[] = [];
  for (let i = 0; i < dientes; i++) {
    const a0 = (i / dientes) * Math.PI * 2, a1 = ((i + 0.5) / dientes) * Math.PI * 2, s = Math.PI / dientes;
    const p = (a: number, rr: number) => `${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
    d.push(`${i ? "L" : "M"} ${p(a0 - s * 0.5, r - 26)} L ${p(a0 - s * 0.32, r)} L ${p(a0 + s * 0.32, r)} L ${p(a0 + s * 0.5, r - 26)} L ${p(a1, r - 26)}`);
  }
  return (
    <g transform={`rotate(${rot})`}>
      <path d={d.join(" ") + " Z"} fill={c1} stroke="#1e1b19" strokeWidth={5} />
      <circle r={r - 30} fill="none" stroke="#9a948c" strokeWidth={5} opacity={0.5} />
      <circle r={r - 46} fill={c2} />
      {Array.from({ length: brazos }, (_, i) => (
        <path key={i} d={`M ${-r * 0.1} ${-r * 0.3} L ${-r * 0.07} ${-(r - 50)} L ${r * 0.07} ${-(r - 50)} L ${r * 0.1} ${-r * 0.3} Z`} fill={c1} stroke="#24201d" strokeWidth={3} transform={`rotate(${(i * 360) / brazos})`} />
      ))}
      <circle r={r - 60} fill="none" stroke="#1e1b19" strokeWidth={10} opacity={0.35} />
      <circle r={r * 0.34} fill="#6c6761" stroke="#24201d" strokeWidth={6} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={Math.cos((i * Math.PI) / 3) * r * 0.25} cy={Math.sin((i * Math.PI) / 3) * r * 0.25} r={r * 0.025} fill="#2a2623" />)}
    </g>
  );
};

// mancha de mugre irregular
const Mugre: React.FC<{ x: number; y: number; r: number; seed: number; o?: number }> = ({ x, y, r, seed, o = 0.7 }) => {
  const q = rnd(seed);
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.55 + q() * 0.6);
    return [Math.cos(a) * rr, Math.sin(a) * rr * 0.75];
  });
  const d = pts.map(([px, py], i) => `${i ? "L" : "M"} ${px.toFixed(1)} ${py.toFixed(1)}`).join(" ") + " Z";
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={d} fill="#5a3e28" strokeLinejoin="round" stroke="#5a3e28" strokeWidth={r * 0.25} />
      {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={(q() - 0.5) * r * 3} cy={(q() - 0.5) * r * 2} r={r * (0.1 + q() * 0.18)} fill="#5a3e28" />)}
    </g>
  );
};

// mano apoyada en el piso, vista desde adelante: palma + 4 dedos + pulgar
const Mano: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -60 -6 Q -62 -40 -30 -48 Q 10 -52 40 -40 Q 62 -26 60 -4 Z" fill="#f4b98c" />
    {[[-52, 0, 22], [-24, 4, 24], [6, 4, 23], [34, 0, 20]].map(([fx, fy, l], i) => (
      <g key={i}>
        <path d={`M ${fx - 11} ${fy - 14} Q ${fx - 13} ${fy + l * 0.5} ${fx - 6} ${fy + l * 0.55} Q ${fx + 4} ${fy + l * 0.62} ${fx + 12} ${fy + l * 0.45} Q ${fx + 13} ${fy} ${fx + 11} ${fy - 14} Z`} fill="#f6c29a" stroke="#d48a62" strokeWidth={2} />
        <path d={`M ${fx - 5} ${fy + l * 0.28} Q ${fx} ${fy + l * 0.34} ${fx + 6} ${fy + l * 0.28}`} stroke="#d48a62" strokeWidth={1.6} fill="none" />
        <path d={`M ${fx - 5} ${fy + l * 0.5} Q ${fx} ${fy + l * 0.42} ${fx + 6} ${fy + l * 0.5}`} stroke="#fde3cc" strokeWidth={2} fill="none" />
      </g>
    ))}
    <path d="M 52 -30 Q 82 -26 86 -6 Q 84 6 70 4 Q 62 -10 46 -14 Z" fill="#f4b98c" stroke="#d48a62" strokeWidth={2} />
    <path d="M -40 -38 Q 0 -46 40 -34" stroke="#ffe0c6" strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);

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
  const vuelan = Array.from({ length: 12 }, () => ({ x: 1050 + q() * 520, y: 300 + q() * 380, r: 14 + q() * 24, vx: -50 - q() * 90, vy: 30 + q() * 60, f: q() * 6 }));
  const motas = Array.from({ length: 70 }, () => ({ x: q() * 900, y: q() * H * 0.9, r: 1.5 + q() * 3.5, f: q() * 6 }));
  const tablas = Array.from({ length: 18 }, (_, i) => i);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <defs>
        <linearGradient id="m0pared" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#f7dcae" /><stop offset="0.18" stopColor="#c99a68" /><stop offset="0.42" stopColor="#6e5040" /><stop offset="0.7" stopColor="#3a2e2a" /><stop offset="1" stopColor="#25201f" />
        </linearGradient>
        <linearGradient id="m0piso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5430" /><stop offset="0.3" stopColor="#56321c" /><stop offset="1" stopColor="#24130a" />
        </linearGradient>
        <linearGradient id="m0pisoLuz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" /><stop offset="0.5" stopColor="#ffcf8a" stopOpacity="0.12" /><stop offset="1" stopColor="#ffcf8a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="m0luz" cx="0.05" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#fff0c8" stopOpacity="0.95" /><stop offset="0.3" stopColor="#ffc870" stopOpacity="0.42" /><stop offset="1" stopColor="#ffdca0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m0frio" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.4" stopColor="#1a2436" stopOpacity="0" /><stop offset="1" stopColor="#1a2436" stopOpacity="0.38" />
        </linearGradient>
        <radialGradient id="m0contraluz" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd28a" stopOpacity="0.9" /><stop offset="1" stopColor="#ffb860" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m0ventana" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#fdf0d4" /><stop offset="1" stopColor="#f0d5a0" />
        </linearGradient>
        <linearGradient id="m0cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9ecf7" /><stop offset="1" stopColor="#f6f0df" />
        </linearGradient>
        <linearGradient id="m0madera" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2a20" /><stop offset="0.3" stopColor="#5a4232" /><stop offset="0.5" stopColor="#3e2d22" /><stop offset="1" stopColor="#24190f" />
        </linearGradient>
        <linearGradient id="m0hierro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#56504a" /><stop offset="0.25" stopColor="#3a3632" /><stop offset="1" stopColor="#1c1916" />
        </linearGradient>
        <linearGradient id="m0rodillo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#efe6d6" /><stop offset="1" stopColor="#b9aa92" />
        </linearGradient>
        <linearGradient id="m0pantalon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a4a32" /><stop offset="0.5" stopColor="#4a321f" /><stop offset="1" stopColor="#2a1a10" />
        </linearGradient>
        <linearGradient id="m0camisa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2ebdc" /><stop offset="0.6" stopColor="#d6cbb6" /><stop offset="1" stopColor="#a89a84" />
        </linearGradient>
        <linearGradient id="m0gorra" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#b88a5c" /><stop offset="0.6" stopColor="#8a6240" /><stop offset="1" stopColor="#5e4028" />
        </linearGradient>
        <radialGradient id="m0cara" cx="0.42" cy="0.38" r="0.72">
          <stop offset="0" stopColor="#ffe0c0" /><stop offset="0.7" stopColor="#f6bc8e" /><stop offset="1" stopColor="#e09a6c" />
        </radialGradient>
        <radialGradient id="m0brazo" cx="0.3" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffd6b2" /><stop offset="1" stopColor="#e8a476" />
        </radialGradient>
        <linearGradient id="m0saco" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5c5654" /><stop offset="0.35" stopColor="#3a3534" /><stop offset="1" stopColor="#24201f" />
        </linearGradient>
        <linearGradient id="m0correa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c07a3e" /><stop offset="0.5" stopColor="#8a4a20" /><stop offset="1" stopColor="#5e2e12" />
        </linearGradient>
        <radialGradient id="m0metal" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#b4aea6" /><stop offset="0.5" stopColor="#6e6963" /><stop offset="1" stopColor="#36322f" />
        </radialGradient>
        <filter id="m0bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="m0bl2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="m0grano" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves={3} seed={4} />
          <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0.55 -0.12" />
        </filter>
        <filter id="m0yeso" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} seed={9} />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0.35 -0.08" />
        </filter>
        <clipPath id="m0clipPiso"><path d={`M 0 765 L 720 640 L ${W} 655 L ${W} ${H} L 0 ${H} Z`} /></clipPath>
      </defs>
      <g transform={`translate(${tx} ${ty}) scale(${s}) translate(${-fx} ${-fy}) scale(${K})`}>
        {/* ── fondo: pared de yeso y ladrillo, ventanales con cielo, techo de vigas ── */}
        <rect x={0} y={0} width={W} height={H} fill="url(#m0pared)" />
        <rect x={0} y={0} width={W} height={H} filter="url(#m0yeso)" />
        <path d="M 0 0 L 700 0 L 430 110 L 0 160 Z" fill="#3a2a22" opacity={0.85} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${20 + i * 150} 0 L ${0 + i * 115} 150`} stroke="#22170f" strokeWidth={18} opacity={0.75} />)}
        <path d="M 0 150 L 430 108" stroke="#5a4232" strokeWidth={10} />
        {/* ventanal izquierdo: marcos con 4 columnas de vidrios */}
        <g>
          <rect x={-10} y={115} width={100} height={560} fill="url(#m0cielo)" />
          {[150, 215, 280, 345, 410, 475, 540, 605].map((y) => <rect key={y} x={-10} y={y} width={100} height={6} fill="#7a5a40" opacity={0.85} />)}
          {[22, 55].map((x) => <rect key={x} x={x} y={115} width={6} height={560} fill="#7a5a40" opacity={0.85} />)}
          <rect x={88} y={105} width={24} height={580} fill="#4a3424" /><rect x={90} y={105} width={6} height={580} fill="#8a6a4a" />
          <rect x={290} y={330} width={90} height={300} fill="url(#m0cielo)" opacity={0.9} />
          {[380, 430, 480, 530, 580].map((y) => <rect key={y} x={290} y={y} width={90} height={5} fill="#7a5a40" opacity={0.7} />)}
          {[318, 348].map((x) => <rect key={x} x={x} y={330} width={5} height={300} fill="#7a5a40" opacity={0.7} />)}
          <rect x={424} y={282} width={64} height={146} fill="url(#m0cielo)" />
          <rect x={453} y={282} width={5} height={146} fill="#6b4a32" /><rect x={424} y={330} width={64} height={5} fill="#6b4a32" /><rect x={424} y={378} width={64} height={5} fill="#6b4a32" />
          <rect x={418} y={276} width={76} height={158} fill="none" stroke="#4a3424" strokeWidth={8} />
        </g>
        {/* rayos de luz polvorienta desde el ventanal */}
        <g opacity={0.2 + 0.03 * Math.sin(t * 2)} filter="url(#m0bl2)">
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${60 + i * 8} ${170 + i * 120} L ${760 + i * 110} ${610 + i * 50} L ${760 + i * 110} ${700 + i * 50} L ${60 + i * 8} ${240 + i * 120} Z`} fill="#fff1c9" />)}
        </g>
        {/* ── reloj de la pared ── */}
        <g transform={`translate(${RX} ${RY})`}>
          <circle r={RR + 26} cx={6} cy={8} fill="#1a120c" opacity={0.45} />
          <circle r={RR + 24} fill="#2a211b" />
          <circle r={RR + 16} fill="url(#m0metal)" opacity={0.55} />
          <circle r={RR + 9} fill="#3a2e26" />
          <circle r={RR} fill="#f3ead4" />
          <circle r={RR} fill="none" stroke="#d9c9a4" strokeWidth={8} />
          {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-RR + 6} x2={0} y2={i % 5 ? -RR + 12 : -RR + 18} stroke="#3a2e26" strokeWidth={i % 5 ? 1.5 : 4} transform={`rotate(${i * 6})`} />)}
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) / 12) * Math.PI * 2;
            return <text key={i} x={Math.sin(a) * (RR - 36)} y={-Math.cos(a) * (RR - 36) + 11} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize={30} fill="#2a221c">{i + 1}</text>;
          })}
          <path d={`M -5 12 L -3 -58 L 0 -64 L 3 -58 L 5 12 Z`} fill="#1e1915" transform={`rotate(${am})`} />
          <path d={`M -3.5 16 L -2 -90 L 0 -96 L 2 -90 L 3.5 16 Z`} fill="#1e1915" transform={`rotate(${mm})`} />
          <line x1={0} y1={18} x2={0} y2={-98} stroke="#7a1e14" strokeWidth={2} transform={`rotate(${t * 360})`} />
          <circle r={8} fill="#1e1915" /><circle r={3} fill="#9a8a6a" />
          <path d={`M ${-RR * 0.8} ${-RR * 0.4} Q ${-RR * 0.45} ${-RR * 0.92} ${RR * 0.15} ${-RR * 0.95}`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.3} strokeLinecap="round" />
          <circle r={RR} fill="url(#m0luz)" opacity={0.25} />
        </g>
        {/* ── piso de tablones con veta, brillo de la ventana y polvo ── */}
        <path d={`M 0 765 L 720 640 L ${W} 655 L ${W} ${H} L 0 ${H} Z`} fill="url(#m0piso)" />
        <g clipPath="url(#m0clipPiso)">
          <rect x={0} y={600} width={W} height={400} filter="url(#m0grano)" />
          {tablas.map((i) => <line key={i} x1={730} y1={640} x2={-1300 + i * 230} y2={H + 60} stroke="#24140a" strokeWidth={3.5} opacity={0.6} />)}
          {[690, 715, 750, 800, 870].map((y, i) => <path key={i} d={`M 0 ${y + 80 - i * 8} Q 700 ${y - 10} ${W} ${y + 5}`} stroke="#24140a" strokeWidth={2} opacity={0.35} fill="none" />)}
          <path d={`M 0 800 Q 400 720 900 700 L 1000 730 Q 400 770 0 900 Z`} fill="url(#m0pisoLuz)" />
          {/* contraluz cálido debajo de la máquina, al fondo */}
          <ellipse cx={1250} cy={680} rx={420} ry={40} fill="url(#m0contraluz)" opacity={0.75} />
          {Array.from({ length: 40 }, (_, i) => { const k = rnd(300 + i); return <ellipse key={i} cx={k() * W} cy={760 + k() * 180} rx={4 + k() * 14} ry={2 + k() * 4} fill="#f6efe2" opacity={0.75} />; })}
        </g>
        {/* ── el capataz al fondo a la izquierda: galera, bigote, bastón en alto ── */}
        <g transform="translate(205 0)">
          <ellipse cx={0} cy={768} rx={130} ry={16} fill="#1a100a" opacity={0.45} />
          {/* piernas con pliegues */}
          <path d="M -78 640 L -96 752 L -40 758 L -24 650 Z" fill="#28221f" />
          <path d="M 22 650 L 50 752 L 104 752 L 78 638 Z" fill="#221d1a" />
          <path d="M -70 680 L -60 700 M 40 690 L 56 710" stroke="#4a4240" strokeWidth={3} />
          <path d="M -112 752 Q -100 740 -40 746 L -36 766 L -114 766 Z" fill="#100c0b" />
          <path d="M 46 748 Q 100 738 118 752 L 118 766 L 44 766 Z" fill="#100c0b" />
          {/* levita */}
          <path d="M -112 520 Q -10 480 100 518 L 136 692 Q 60 714 18 690 L 0 640 L -18 690 Q -70 712 -128 690 Z" fill="url(#m0saco)" />
          <path d="M -112 520 Q -150 600 -128 690 L -110 692 Q -125 610 -100 528 Z" fill="#7a706a" opacity={0.6} />
          <path d="M -46 512 L -10 600 L -26 640 L -60 530 Z" fill="#2e2a29" /><path d="M 46 512 L 10 600 L 26 640 L 60 530 Z" fill="#2e2a29" />
          {/* chaleco, camisa, moño, cadena de reloj */}
          <path d="M -40 515 L 0 605 L 40 515 Z" fill="#f6f1e8" />
          <path d="M -30 548 L 0 640 L 30 548 L 26 660 L -26 660 Z" fill="#3c3634" />
          {[580, 605, 630].map((y) => <circle key={y} cx={0} cy={y} r={4} fill="#c9b07a" />)}
          <path d="M -24 616 Q -6 632 16 616" stroke="#d6b46a" strokeWidth={3} fill="none" />
          <path d="M -20 518 L 0 528 L 20 518 L 20 540 L 0 530 L -20 540 Z" fill="#0e0c0b" />
          {/* brazo con el bastón */}
          <g transform={`rotate(${baston} -85 530)`}>
            <path d="M -102 525 Q -150 565 -128 612 L -100 608 Q -100 575 -72 548 Z" fill="url(#m0saco)" />
            <line x1={-108} y1={392} x2={-48} y2={652} stroke="#5a341c" strokeWidth={12} strokeLinecap="round" />
            <line x1={-106} y1={392} x2={-50} y2={640} stroke="#9a6a3e" strokeWidth={3} strokeLinecap="round" />
            <path d="M -134 588 Q -136 612 -114 618 Q -92 616 -92 596 Q -96 580 -116 580 Z" fill="#e89a74" />
            <path d="M -120 588 L -96 590 M -122 598 L -96 600 M -120 607 L -98 608" stroke="#c0704c" strokeWidth={2} />
          </g>
          <path d="M 98 525 Q 146 570 128 628 L 104 626 Q 110 586 82 552 Z" fill="#2e2a29" />
          <path d="M 104 616 Q 102 646 122 648 Q 140 646 138 624 Q 132 610 116 612 Z" fill="#e89a74" />
          {/* cabeza roja de rabia */}
          <ellipse cx={0} cy={480} rx={54} ry={52} fill="#ec9a72" />
          <ellipse cx={-6} cy={470} rx={38} ry={30} fill="#f6b48c" opacity={0.6} />
          <ellipse cx={-30} cy={500} rx={16} ry={10} fill="#e0705a" opacity={0.6} /><ellipse cx={30} cy={500} rx={16} ry={10} fill="#e0705a" opacity={0.6} />
          <ellipse cx={-52} cy={484} rx={11} ry={15} fill="#e08a64" /><ellipse cx={52} cy={484} rx={11} ry={15} fill="#d07a58" />
          <ellipse cx={-18} cy={472} rx={10} ry={9} fill="#fff" /><ellipse cx={18} cy={472} rx={10} ry={9} fill="#fff" />
          <circle cx={-15} cy={474} r={5.5} fill="#1a0e08" /><circle cx={15} cy={474} r={5.5} fill="#1a0e08" />
          <circle cx={-17} cy={472} r={1.8} fill="#fff" /><circle cx={13} cy={472} r={1.8} fill="#fff" />
          <path d="M -40 448 L -4 464 L -6 458 L -38 442 Z" fill="#1a1310" /><path d="M 40 448 L 4 464 L 6 458 L 38 442 Z" fill="#1a1310" />
          <path d="M -6 462 Q 0 468 6 462" stroke="#a0503a" strokeWidth={2} fill="none" />
          <path d="M -8 478 Q -12 494 0 496 Q 12 494 8 478 Z" fill="#d97a58" />
          <path d="M -48 512 Q -30 490 -4 498 Q 0 494 4 498 Q 30 490 48 512 Q 30 506 18 510 Q 8 504 0 508 Q -8 504 -18 510 Q -30 506 -48 512 Z" fill="#140e0b" />
          <path d="M -14 520 Q 0 512 14 520" stroke="#5a2016" strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* galera */}
          <ellipse cx={0} cy={438} rx={70} ry={14} fill="#100d0c" />
          <path d="M -42 438 L -46 366 Q 0 354 46 366 L 42 438 Z" fill="#1b1817" />
          <path d="M -44 366 Q 0 356 46 366 Q 0 376 -44 366 Z" fill="#2c2826" />
          <rect x={-43} y={420} width={86} height={14} fill="#3a2e2a" />
          <path d="M -32 372 L -30 428" stroke="#fff" strokeWidth={6} opacity={0.12} />
          {/* luz de borde desde el ventanal */}
          <path d="M -128 690 Q -150 600 -112 520 Q -60 498 -40 446" stroke="#ffdca6" strokeWidth={4} fill="none" opacity={0.55} />
        </g>
        {/* ── la hiladora: patas de hierro remachadas, rodillos de algodón, viga con conos ── */}
        <g>
          {/* fondo oscuro de la máquina */}
          <path d="M 380 610 L 1180 200 L 1330 250 L 1330 650 L 1000 670 L 420 770 Z" fill="#1e1814" />
          <path d="M 380 610 L 1180 200 L 1330 250 L 1330 650 L 1000 670 L 420 770 Z" fill="url(#m0frio)" />
          {/* rodillos de algodón (3 filas) entre las patas izquierdas */}
          {[0, 1, 2].map((f) => (
            <g key={f}>
              <path d={`M ${392} ${470 + f * 62} L ${700} ${300 + f * 62 - 40} L ${706} ${338 + f * 62 - 40} L ${398} ${508 + f * 62} Z`} fill="url(#m0rodillo)" />
              {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${400 + i * 22} ${474 + f * 62 - i * 12.2} q 4 18 0 34`} stroke="#c9bba2" strokeWidth={2} fill="none" opacity={0.8} />)}
              <path d={`M ${392} ${464 + f * 62} L ${700} ${294 + f * 62 - 40}`} stroke="#8a6a40" strokeWidth={7} />
            </g>
          ))}
          <path d="M 380 445 L 740 250" stroke="#b08a50" strokeWidth={14} /><path d="M 380 441 L 740 246" stroke="#e0c08a" strokeWidth={3} />
          <path d="M 376 395 L 760 190" stroke="#6a4a2a" strokeWidth={12} />
          {/* engranajes chicos y ejes en la parte baja */}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${430 + i * 45} ${690 - i * 14}) scale(0.09)`}><Engranaje r={300} dientes={16} rot={rot * (i % 2 ? -3 : 3)} c1="#4a4038" c2="#2e2722" brazos={4} /></g>
          ))}
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={600 + i * 70} y1={580 - i * 32} x2={600 + i * 70} y2={680 - i * 4} stroke="#3a2e26" strokeWidth={5} />)}
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={620} y1={600 + i * 8} x2={1200} y2={320 + i * 36} stroke="#4a3a2e" strokeWidth={3} opacity={0.6} />)}
          {/* patas de hierro con remaches */}
          {[[345, 300, 52, 470], [502, 250, 70, 540]].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="url(#m0hierro)" />
              <rect x={x + 4} y={y} width={w * 0.18} height={h} fill="#7a6e64" opacity={0.6} />
              <rect x={x - 12} y={y + h - 34} width={w + 24} height={36} rx={4} fill="#1e1a17" />
              <rect x={x - 12} y={y + h - 34} width={w + 24} height={6} fill="#5a5048" />
              {Array.from({ length: Math.floor(h / 70) }, (_, j) => <circle key={j} cx={x + w * 0.6} cy={y + 40 + j * 70} r={5} fill="#8a7e72" stroke="#1a1612" strokeWidth={2} />)}
            </g>
          ))}
          <path d="M 330 590 L 600 450 L 610 470 L 340 612 Z" fill="#3a2a1e" /><path d="M 330 590 L 600 450" stroke="#7a5a3a" strokeWidth={3} />
          {/* cuerpo superior de la hiladora: llena la franja de arriba, con dos filas de rollos de algodón y varillas de bronce */}
          <path d={`M 340 300 L 740 -10 L ${W} -10 L ${W} 0 L 1480 10 L 600 410 L 380 520 Z`} fill="#1c1611" />
          <path d={`M 340 300 L 740 -10 L ${W} -10 L ${W} 0 L 1480 10 L 600 410 L 380 520 Z`} fill="url(#m0frio)" opacity={0.6} />
          {[0, 1].map((f) => (
            <g key={f}>
              {Array.from({ length: 16 }, (_, i) => {
                const k = i / 15;
                const cx = 380 + f * 120 + k * (480 + f * 260), cy = 330 - f * 20 - k * (360 + f * 40), r = 30 + k * 26 + f * 6;
                return (
                  <g key={i} transform={`translate(${cx} ${cy}) rotate(-36)`}>
                    <ellipse cx={0} cy={r * 0.5} rx={r * 1.15} ry={r * 0.55} fill="#120d09" opacity={0.6} />
                    <Pelusa x={0} y={0} r={r * 1.05} seed={200 + i + f * 20} tinte="#e8dcc6" />
                  </g>
                );
              })}
              <path d={`M ${360 + f * 120} ${372 - f * 20} L ${880 + f * 380} ${-40 - f * 60}`} stroke="#9a7444" strokeWidth={10} />
              <path d={`M ${360 + f * 120} ${368 - f * 20} L ${880 + f * 380} ${-44 - f * 60}`} stroke="#e8c88e" strokeWidth={2.5} />
            </g>
          ))}
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={560 + i * 150} y={300 - i * 80} width={14} height={140} fill="#2a2018" transform={`rotate(-30 ${567 + i * 150} ${370 - i * 80})`} />)}
          {/* viga superior grande: tablón con veta y borde iluminado */}
          <path d="M 560 330 L 1400 -60 L 1480 10 L 600 410 Z" fill="url(#m0madera)" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${575 + i * 6} ${345 + i * 9} L ${1420 + i * 8} ${-40 + i * 7}`} stroke="#22170f" strokeWidth={1.5} opacity={0.6} />)}
          <path d="M 560 330 L 1400 -60 L 1404 -46 L 566 346 Z" fill="#b08a62" opacity={0.75} />
          <path d="M 600 410 L 1480 10" stroke="#120c08" strokeWidth={14} />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={620 + i * 95} cy={380 - i * 43} r={5} fill="#a08a6a" stroke="#1a120c" strokeWidth={2} />)}
          {/* hilos que bajan de los conos */}
          {Array.from({ length: 34 }, (_, i) => <line key={i} x1={620 + i * 24} y1={345 - i * 11} x2={628 + i * 24} y2={430 - i * 7} stroke="#e8dcc4" strokeWidth={1.2} opacity={0.55} />)}
        </g>
        {/* ── derecha: engranaje gigante en perspectiva, ménsula, correa de cuero ── */}
        <g>
          <rect x={1268} y={70} width={84} height={300} fill="url(#m0hierro)" /><rect x={1272} y={70} width={10} height={300} fill="#7a6e64" opacity={0.5} />
          {Array.from({ length: 4 }, (_, j) => <circle key={j} cx={1320} cy={110 + j * 70} r={6} fill="#8a7e72" stroke="#1a1612" strokeWidth={2} />)}
          {/* rueda grande del fondo */}
          <g transform="translate(1640 300) scale(0.75 1)"><Engranaje r={330} dientes={44} rot={-rot * 0.7} c1="#4a4744" c2="#3a3734" /></g>
          <g transform="translate(1330 600) scale(0.8 1)"><Engranaje r={130} dientes={18} rot={-rot * 1.9 + 7} c1="#4e4a46" c2="#34302d" brazos={4} /></g>
          {/* engranaje principal visto de costado */}
          <g transform="translate(1515 300) scale(0.72 1)">
            <ellipse cx={-34} cy={0} rx={300} ry={300} fill="#1a1715" />
            <Engranaje r={300} dientes={42} rot={rot} c1="#6e6a65" c2="#58544f" />
            <circle r={300} fill="url(#m0frio)" opacity={0.6} />
          </g>
          {/* cubo cilíndrico que sobresale */}
          <ellipse cx={1468} cy={290} rx={52} ry={88} fill="#3a3632" />
          <rect x={1390} y={202} width={78} height={176} fill="url(#m0metal)" />
          <ellipse cx={1390} cy={290} rx={46} ry={88} fill="#8a847c" stroke="#2a2623" strokeWidth={5} />
          <ellipse cx={1384} cy={290} rx={22} ry={42} fill="#4a4540" />
          <path d="M 1360 230 Q 1370 214 1392 210" stroke="#d8d2c8" strokeWidth={6} fill="none" opacity={0.7} />
          {/* correa de cuero que abraza el engranaje */}
          <g transform="rotate(-24 1380 300)">
            <ellipse cx={1380} cy={300} rx={215} ry={300} fill="none" stroke="#2a150a" strokeWidth={30} opacity={0.5} />
            <ellipse cx={1380} cy={300} rx={215} ry={300} fill="none" stroke="url(#m0correa)" strokeWidth={24} />
            <ellipse cx={1380} cy={300} rx={203} ry={288} fill="none" stroke="#e0a56a" strokeWidth={3} opacity={0.6} />
            <ellipse cx={1380} cy={300} rx={215} ry={300} fill="none" stroke="#5a2a10" strokeWidth={4} strokeDasharray="6 40" strokeDashoffset={-t * 420} opacity={0.7} />
          </g>
          <rect x={1460} y={640} width={90} height={160} fill="url(#m0hierro)" />
          <rect x={1440} y={780} width={130} height={30} rx={4} fill="#151210" />
          {/* estela de fibras que escupe el engranaje */}
          {Array.from({ length: 22 }, (_, i) => { const k = rnd(500 + i); const a = 0.5 + k() * 0.7; const l = 120 + k() * 200; const x0 = 1280 - k() * 60, y0 = 360 + k() * 200; return <line key={i} x1={x0} y1={y0} x2={x0 - Math.cos(a) * l} y2={y0 - Math.sin(a) * l * 0.4 + 40} stroke="#f2e9d8" strokeWidth={1 + k() * 1.5} opacity={0.35 + k() * 0.3} />; })}
        </g>
        {/* ── el chico gateando, cara de terror (cara ~825,545) ── */}
        <g transform={`translate(0 ${resp * 0.5})`}>
          <ellipse cx={960} cy={845} rx={440} ry={32} fill="#1a0e06" opacity={0.55} />
          {/* espalda y piernas (pantalón con pliegues, manchas y parche cosido) */}
          <path d="M 1000 560 Q 1130 535 1255 615 Q 1335 690 1345 790 L 1255 832 Q 1150 832 1080 792 L 990 700 Z" fill="url(#m0pantalon)" />
          <path d="M 1050 600 Q 1120 640 1110 700 M 1180 620 Q 1230 660 1220 720 M 1270 690 Q 1300 740 1290 790" stroke="#2a1a10" strokeWidth={5} fill="none" opacity={0.7} />
          <path d="M 1010 575 Q 1130 548 1240 610" stroke="#8a6a4a" strokeWidth={5} fill="none" opacity={0.6} />
          <path d="M 1228 690 Q 1320 718 1346 800 L 1352 838 L 1262 842 Q 1250 790 1205 760 Z" fill="#2e1c10" />
          <path d="M 1248 802 Q 1300 790 1352 798 L 1362 842 L 1252 846 Z" fill="#1a110b" />
          <path d="M 1255 838 L 1360 836" stroke="#4a3426" strokeWidth={4} />
          <g transform="rotate(-14 1190 768)">
            <rect x={1156} y={736} width={70} height={64} rx={4} fill="#b0804e" />
            <rect x={1156} y={736} width={70} height={64} rx={4} fill="none" stroke="#5a3a1e" strokeWidth={3} strokeDasharray="7 6" />
            <path d="M 1160 750 L 1220 744 M 1162 780 L 1222 776" stroke="#8a6038" strokeWidth={2} opacity={0.6} />
          </g>
          <Mugre x={1090} y={640} r={14} seed={11} o={0.5} /><Mugre x={1190} y={612} r={12} seed={12} o={0.5} /><Mugre x={1290} y={700} r={16} seed={13} o={0.45} />
          {/* torso: camisa con pliegues, tiradores, mugre */}
          <path d="M 660 650 Q 720 572 860 568 Q 1000 564 1062 618 L 1042 762 L 720 772 Z" fill="url(#m0camisa)" />
          <path d="M 760 620 Q 800 680 780 740 M 900 600 Q 930 660 920 740 M 960 610 Q 1000 670 980 750" stroke="#a89880" strokeWidth={3} fill="none" opacity={0.8} />
          <path d="M 800 580 Q 840 600 870 580" stroke="#a89880" strokeWidth={4} fill="none" />
          <path d="M 845 575 L 880 770" stroke="#3a2416" strokeWidth={26} /><path d="M 1000 585 L 1020 760" stroke="#3a2416" strokeWidth={26} />
          <path d="M 840 580 L 873 770" stroke="#6a4a32" strokeWidth={4} /><path d="M 994 590 L 1012 760" stroke="#6a4a32" strokeWidth={4} />
          <circle cx={866} cy={700} r={6} fill="#b89a6a" />
          {[[740, 690, 13, 21], [930, 640, 12, 22], [975, 708, 10, 23], [800, 735, 11, 24], [700, 660, 9, 25]].map(([x, y, r, sd], i) => <Mugre key={i} x={x} y={y} r={r} seed={sd} o={0.55} />)}
          {/* brazo izquierdo de pantalla: manga arremangada → antebrazo → mano */}
          <path d="M 670 660 Q 622 700 616 748 L 682 762 Q 692 722 738 690 Z" fill="url(#m0camisa)" />
          <path d="M 610 742 Q 650 770 690 760 Q 696 744 684 736 Q 650 742 616 730 Z" fill="#cbbea6" />
          <path d="M 612 748 Q 650 760 686 752" stroke="#9a8a72" strokeWidth={3} fill="none" />
          <path d="M 622 760 Q 598 786 592 812 L 656 816 Q 664 790 682 768 Z" fill="url(#m0brazo)" />
          <Mugre x={642} y={786} r={11} seed={31} o={0.65} />
          <Mano x={612} y={822} s={0.9} />
          {/* brazo derecho */}
          <path d="M 975 660 Q 1032 700 1024 762 L 962 770 Q 962 722 932 690 Z" fill="url(#m0camisa)" />
          <path d="M 956 758 Q 990 780 1030 766 Q 1032 752 1022 744 Q 990 752 960 744 Z" fill="#cbbea6" />
          <path d="M 962 772 L 1016 772 L 1002 834 L 946 834 Z" fill="url(#m0brazo)" />
          <Mugre x={986} y={798} r={14} seed={32} o={0.7} />
          <Mano x={944} y={840} s={0.9} flip />
          {/* orejas y cara */}
          <ellipse cx={690} cy={598} rx={30} ry={34} fill="#f2b088" /><path d="M 682 584 Q 700 598 688 616" stroke="#d0805c" strokeWidth={5} fill="none" />
          <ellipse cx={950} cy={540} rx={26} ry={30} fill="#eca47c" />
          <ellipse cx={822} cy={548} rx={135} ry={122} fill="url(#m0cara)" />
          <path d="M 700 600 Q 760 668 860 664 Q 920 650 948 590 Q 930 640 860 652 Q 760 656 700 600 Z" fill="#d88a60" opacity={0.45} />
          {/* pelo pelirrojo que asoma */}
          <path d="M 688 520 Q 668 570 700 604 L 704 576 L 716 590 L 714 548 Z" fill="#e39a45" />
          <path d="M 696 530 Q 690 560 704 580" stroke="#f2b868" strokeWidth={3} fill="none" />
          <path d="M 928 470 Q 962 500 950 538 L 940 520 L 930 528 L 924 494 Z" fill="#d88a38" />
          {/* ojos grandes con iris degradado y brillo */}
          {[[767, 552, 40], [868, 508, 38]].map(([x, y, r], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={r} ry={r * 1.08 * parp} fill="#fff" stroke="#2a180c" strokeWidth={3.5} />
              {parp > 0.5 && (
                <>
                  <path d={`M ${x - r} ${y - 4} Q ${x} ${y - r * 1.2} ${x + r} ${y - 4}`} fill="#e6e0dc" opacity={0.5} />
                  <circle cx={x - 6} cy={y + 1} r={r * 0.58} fill="#7a4420" />
                  <circle cx={x - 6} cy={y + 1} r={r * 0.58} fill="none" stroke="#3a1c0a" strokeWidth={3} />
                  <circle cx={x - 4} cy={y + 6} r={r * 0.4} fill="#a0602c" opacity={0.6} />
                  <circle cx={x - 7} cy={y + 2} r={r * 0.32} fill="#140a04" />
                  <circle cx={x - 16} cy={y - 11} r={r * 0.19} fill="#fff" /><circle cx={x + 4} cy={y + 12} r={r * 0.08} fill="#fff" />
                </>
              )}
            </g>
          ))}
          <path d="M 728 512 Q 760 504 794 486" stroke="#9a6030" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M 838 462 Q 868 460 900 476" stroke="#9a6030" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M 812 512 Q 818 520 822 528" stroke="#e09a70" strokeWidth={2.5} fill="none" opacity={0.7} />
          <ellipse cx={740} cy={614} rx={28} ry={17} fill="#f07a68" opacity={0.45} /><ellipse cx={905} cy={570} rx={26} ry={16} fill="#f07a68" opacity={0.45} />
          <Mugre x={912} y={570} r={14} seed={41} o={0.6} /><Mugre x={758} y={642} r={9} seed={42} o={0.5} /><Mugre x={895} y={600} r={7} seed={43} o={0.5} />
          <path d="M 818 572 Q 826 580 834 571" stroke="#c97a52" strokeWidth={3} fill="none" />
          <ellipse cx={826} cy={566} rx={10} ry={6} fill="#fff" opacity={0.25} />
          {/* boca abierta de terror: comisuras abajo */}
          <path d="M 806 636 Q 818 606 842 604 Q 868 604 878 630 Q 870 652 842 654 Q 816 654 806 636 Z" fill="#5a1414" />
          <path d="M 822 646 Q 842 634 862 644 Q 852 654 842 654 Q 830 654 822 646 Z" fill="#e66a6a" />
          <path d="M 816 618 Q 842 608 868 618 L 865 624 Q 842 616 819 624 Z" fill="#fff" />
          <path d="M 806 636 Q 818 606 842 604 Q 868 604 878 630" stroke="#3a0e0a" strokeWidth={3} fill="none" />
          {/* lágrima y gota de sudor */}
          <path d={`M 718 ${582 + lagr} q -10 18 0 25 q 10 -7 0 -25 Z`} fill="#c6eaff" stroke="#5a9ac6" strokeWidth={2} />
          <path d={`M 716 ${592 + lagr} q -2 6 1 9`} stroke="#fff" strokeWidth={2} fill="none" />
          <path d="M 912 486 q -7 14 0 19 q 7 -5 0 -19 Z" fill="#c6eaff" stroke="#5a9ac6" strokeWidth={2} />
          {/* gorra plana marrón, ladeada, con costuras y botón */}
          <g transform="translate(-6 -30) translate(830 470) scale(0.88) translate(-830 -470)">
            <path d="M 588 545 Q 560 450 640 385 Q 740 320 860 330 Q 950 345 940 410 Q 915 440 860 455 Q 720 495 588 545 Z" fill="url(#m0gorra)" />
            <path d="M 640 385 Q 720 380 770 348 M 700 470 Q 760 400 860 330 M 610 500 Q 700 430 800 410" stroke="#6a4628" strokeWidth={3} fill="none" opacity={0.6} strokeDasharray="8 5" />
            <path d="M 575 540 Q 720 478 870 445 Q 925 432 945 412 Q 942 450 880 470 Q 730 510 590 568 Z" fill="#5e3e22" />
            <path d="M 580 548 Q 720 490 880 456" stroke="#9a7046" strokeWidth={3} fill="none" opacity={0.7} />
            <path d="M 650 400 Q 750 345 880 350" stroke="#e0b888" strokeWidth={7} fill="none" opacity={0.55} />
            <circle cx={770} cy={348} r={11} fill="#7a5232" /><circle cx={767} cy={345} r={4} fill="#b08a5a" />
          </g>
        </g>
        {/* ── pelusa: montones desenfocados en las esquinas, copos en el piso y copos que vuelan ── */}
        {[[60, 860, 95], [170, 910, 85], [10, 940, 80], [1600, 890, 120], [1470, 930, 95], [1660, 800, 85]].map(([x, y, r], i) => <Pelusa key={i} x={x} y={y} r={r} seed={60 + i} blur />)}
        {[[460, 800, 20], [740, 808, 22], [1250, 868, 30], [1420, 830, 26], [300, 860, 16], [1100, 870, 18]].map(([x, y, r], i) => <Pelusa key={i} x={x} y={y} r={r} seed={80 + i} />)}
        {vuelan.map((p, i) => {
          const k = ((t * 0.6 + p.f) % 1.6);
          return <Pelusa key={i} x={p.x + p.vx * k} y={p.y + p.vy * k} r={p.r} o={0.92} seed={100 + i} blur={p.r > 30} />;
        })}
        {/* motas de polvo flotando en la luz */}
        {motas.map((p, i) => <circle key={i} cx={p.x + Math.sin(t * 1.5 + p.f) * 12} cy={(p.y + t * 18) % H} r={p.r} fill="#fff6e0" opacity={0.55 + 0.3 * Math.sin(t * 3 + p.f)} />)}
        {/* luz cálida de la izquierda contra sombra fría a la derecha */}
        <rect x={0} y={0} width={W} height={H} fill="url(#m0luz)" />
        <rect x={0} y={0} width={W} height={H} fill="url(#m0frio)" />
      </g>
    </svg>
  );
};
