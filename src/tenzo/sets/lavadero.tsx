// SET · SPIN CITY 24H LAUNDROMAT (Broadway y Lawrence, 3 a.m.): 40 máquinas (20 lavarropas abajo + 20 secarropas arriba)
// contra la pared del fondo, tubos fluorescentes fríos (el del rincón titila), mesa de doblar con el farol de Tenzo,
// sillas de plástico, carritos, la máquina expendedora rota y el ventanal a Broadway con el tren elevado que pasa.
// Piso: LAV_PISO. x útil: -500 … 4400. Puntos en LAV_PUNTOS.
// setProps: tren (cuadro en que el tren cruza el ventanal; -1 = no pasa), girando (índices de máquinas que giran),
//           titila (el tubo del rincón parpadea), nieve (por el ventanal), luzFarol 0..1 (el halo cálido del rincón).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Polvo } from "../../anikit/luz";
import { Ladrillos, SetProps, osc } from "../../anikit/sets/comun";
import { FarolPapel } from "../utileria";
import { ORO, FRIO } from "../elenco";
import { Nieve, TrenElevado, Skyline, ViaElevada } from "./chicago";

export const LAV_PISO = 900;
export const LAV_PUNTOS = { maqIni: -380, maqFin: 2240, mesa: 1500, farol: 1640, tenzo: 1720, silla: 1180, leo: 1180, secadoraLeo: 1060, expendedora: 2420, ventana: 3300, puerta: 4180, carrito: 760 };
const MW = 131; // ancho de cada máquina
const COL = 20;
export const maquinaX = (i: number) => LAV_PUNTOS.maqIni + (i % COL) * MW + MW / 2; // centro de la columna
const fil = (i: number) => (i < COL ? "abajo" : "arriba");

const Maquina: React.FC<{ i: number; f: number; gira: boolean; seed: number }> = ({ i, f, gira, seed }) => {
  const x = maquinaX(i) - MW / 2 + 6, w = MW - 12;
  const arriba = fil(i) === "arriba";
  const y = arriba ? LAV_PISO - 470 : LAV_PISO - 230;
  const h = arriba ? 230 : 222;
  const cx = x + w / 2, cy = y + (arriba ? 120 : 128), r = 42;
  const ang = gira ? f * (arriba ? 9 : 14) : 0;
  const ropa = ["#7d8796", "#c9ccd2", "#4a5262", "#a3aab4", "#e3e1dc"][Math.floor(random(`rp${seed}`) * 5)];
  const num = String(i + 1).padStart(2, "0");
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={arriba ? "#c9cdd3" : "#dfe2e6"} />
      <rect x={x} y={y} width={w} height={34} rx={8} fill={arriba ? "#b5bac2" : "#cdd1d7"} />
      <rect x={x + 10} y={y + 9} width={34} height={14} rx={3} fill="#1b2230" />
      <text x={x + 27} y={y + 20} fontSize={10} fill={gira ? "#9fd0ff" : "#3d4a60"} textAnchor="middle" fontFamily="monospace">{gira ? String(38 - Math.floor(f / 60) % 38).padStart(2, "0") : "--"}</text>
      <text x={x + w - 12} y={y + 22} fontSize={11} fill="#5a6270" textAnchor="end" fontFamily="sans-serif" fontWeight={700}>{num}</text>
      <circle cx={x + w - 34} cy={y + 16} r={4} fill={gira ? "#9fd0ff" : "#8a929e"} />
      {/* puerta */}
      <circle cx={cx} cy={cy} r={r + 8} fill="#a7adb6" />
      <circle cx={cx} cy={cy} r={r} fill="#1e2632" />
      {gira && (
        <g transform={`rotate(${ang} ${cx} ${cy})`}>
          <path d={`M${cx - r + 6},${cy + 8} Q${cx - 10},${cy - 20} ${cx + r - 8},${cy + 4} L${cx + r - 10},${cy + 22} Q${cx},${cy + 36} ${cx - r + 10},${cy + 24} Z`} fill={ropa} opacity={0.9} />
          <circle cx={cx + 12} cy={cy - 14} r={9} fill={osc(ropa, 0.75)} opacity={0.8} />
        </g>
      )}
      <ellipse cx={cx - 14} cy={cy - 16} rx={14} ry={8} fill="#ffffff" opacity={0.18} transform={`rotate(-30 ${cx - 14} ${cy - 16})`} />
      {!arriba && <rect x={x + 12} y={y + h - 26} width={w - 24} height={12} rx={4} fill="#b9bec6" />}
    </g>
  );
};

// tubo fluorescente colgado: cono frío hacia abajo; `p` = intensidad (titilar)
const Tubo: React.FC<{ x: number; y: number; p: number; ancho?: number }> = ({ x, y, p, ancho = 260 }) => (
  <g>
    <line x1={x - ancho * 0.35} y1={-200} x2={x - ancho * 0.35} y2={y} stroke="#111318" strokeWidth={2} />
    <line x1={x + ancho * 0.35} y1={-200} x2={x + ancho * 0.35} y2={y} stroke="#111318" strokeWidth={2} />
    <rect x={x - ancho / 2} y={y} width={ancho} height={16} rx={6} fill="#3a3f48" />
    <rect x={x - ancho / 2 + 8} y={y + 12} width={ancho - 16} height={8} rx={4} fill={p > 0.5 ? "#f2f6ff" : "#6a7080"} />
    <Halo x={x} y={y + 18} r={ancho * 1.1} color="#dfe8ff" fuerza={0.22 * p} />
  </g>
);

export const Lavadero: React.FC<SetProps & { tren?: number; girando?: number[]; titila?: boolean; nieve?: boolean; luzFarol?: number; farol?: boolean }> = ({ capa, f, pal, tren = -1, girando = [3, 7, 8, 12, 15, 22, 27, 31, 36], titila = true, nieve = true, luzFarol = 1, farol = true }) => {
  const P = LAV_PISO;
  const V = { x: 2620, y: 90, w: 1440, h: 650 }; // hueco del ventanal (mundo)
  // Broadway por el ventanal (va en la capa media, recortado al hueco: así no se corre con la paralaje)
  const vista = (
    <g clipPath="url(#lvvista)">
      <rect x={V.x - 400} y={-300} width={V.w + 900} height={1300} fill="#10141c" />
      <Skyline x0={V.x - 300} w={V.w + 700} piso={660} f={f} seed={3} />
      <ViaElevada x0={V.x - 400} w={V.w + 900} y={270} piso={660} />
      {tren >= 0 && <TrenElevado x0={V.x - 400} w={V.w + 900} y={270} f={f - tren} />}
      <rect x={V.x - 400} y={660} width={V.w + 900} height={300} fill="#1c2028" />
      <rect x={V.x - 400} y={660} width={V.w + 900} height={14} fill="#d8dee8" opacity={0.55} />
      {nieve && <Nieve f={f} x0={V.x - 100} w={V.w + 200} y0={0} h={800} n={90} seed={1} />}
    </g>
  );
  if (capa === "lejos") return <rect x={-3000} y={-1500} width={12000} height={4000} fill="#10141c" />;
  if (capa === "frente") {
    return (
      <g>
        <Polvo x={-300} y={200} w={4200} h={650} n={40} f={f} seed={7} color="#dfe6f2" tam={1.8} />
      </g>
    );
  }
  // ---- capa media ----
  const titilar = titila ? (random(`tt${Math.floor(f / 4)}`) > 0.86 ? 0.25 : random(`tu${Math.floor(f / 2)}`) > 0.97 ? 0.5 : 1) : 1;
  return (
    <g>
      {/* pared del fondo: azulejo frío hasta media altura, pintura arriba (con hueco del ventanal) */}
      {/* vista de la calle detrás de la pared */}
      <defs><clipPath id="lvvista"><rect x={V.x} y={V.y} width={V.w} height={V.h} /></clipPath></defs>
      {vista}
      <defs><clipPath id="lvpared"><path clipRule="evenodd" d={`M-900,-600 H5200 V${P} H-900 Z M${V.x},${V.y} V${V.y + V.h} H${V.x + V.w} V${V.y} Z`} /></clipPath></defs>
      <g clipPath="url(#lvpared)">
        <rect x={-900} y={-600} width={6100} height={P + 600} fill="#2b313b" />
        <rect x={-900} y={P - 520} width={6100} height={520} fill="#3a414c" />
        {Array.from({ length: 13 }).map((_, r) => <rect key={r} x={-900} y={P - 520 + r * 40} width={6100} height={2} fill="#2f353f" />)}
        {Array.from({ length: 100 }).map((_, c) => <rect key={c} x={-900 + c * 61} y={P - 520} width={2} height={520} fill="#2f353f" />)}
        <rect x={-900} y={P - 528} width={6100} height={10} fill="#4c5462" />
        {/* cartelería del local */}
        <g transform="translate(400,-110)">
          <rect x={0} y={0} width={560} height={120} rx={10} fill="#1d2129" stroke="#4a5160" strokeWidth={4} />
          <text x={280} y={62} fontSize={56} fill="#e8eef8" textAnchor="middle" fontFamily="sans-serif" fontWeight={800} letterSpacing={6}>SPIN CITY</text>
          <text x={280} y={102} fontSize={26} fill={FRIO} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} letterSpacing={12}>24 HOURS</text>
        </g>
        <g transform="translate(1250,-40)">
          <rect x={0} y={0} width={300} height={150} rx={6} fill="#e8e6e0" />
          {["WASH  $3.75", "DRY  25¢ / 6 MIN", "NO DYEING", "BE KIND"].map((t, k) => <text key={k} x={20} y={36 + k * 32} fontSize={22} fill="#3a3f48" fontFamily="sans-serif" fontWeight={700}>{t}</text>)}
        </g>
        {/* reloj de pared (3:2x) */}
        <g transform="translate(2050,-20)">
          <circle r={52} fill="#e8e6e0" stroke="#4a5160" strokeWidth={6} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-2} y={-46} width={4} height={9} fill="#3a3f48" transform={`rotate(${i * 30})`} />)}
          <rect x={-3} y={-30} width={6} height={32} rx={3} fill="#222" transform={`rotate(${100 + f * 0.004})`} />
          <rect x={-2} y={-42} width={4} height={44} rx={2} fill="#222" transform={`rotate(${120 + f * 0.05})`} />
        </g>
      </g>
      {/* marco del ventanal + letras al revés vistas de adentro + neón OPEN */}
      <rect x={V.x - 14} y={V.y - 14} width={V.w + 28} height={V.h + 28} fill="none" stroke="#4a5160" strokeWidth={28} />
      {[1, 2].map((k) => <rect key={k} x={V.x + (V.w / 3) * k - 9} y={V.y} width={18} height={V.h} fill="#4a5160" />)}
      <text x={V.x + V.w / 2} y={V.y + 90} fontSize={64} fill="#dfe6f2" opacity={0.18} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} letterSpacing={8} transform={`scale(-1,1) translate(${-2 * (V.x + V.w / 2)},0)`}>SPIN CITY 24H</text>
      <g transform={`translate(${V.x + V.w - 300},${V.y + 470})`}>
        <rect x={0} y={0} width={220} height={90} rx={45} fill="none" stroke={FRIO} strokeWidth={6} opacity={0.9} />
        <text x={110} y={62} fontSize={50} fill={FRIO} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} transform={`scale(-1,1) translate(-220,0)`}>OPEN</text>
        <Halo x={110} y={45} r={190} color={FRIO} fuerza={0.3} />
      </g>
      {/* puerta con campanita */}
      <g transform={`translate(${LAV_PUNTOS.puerta},0)`}>
        <rect x={-90} y={P - 560} width={200} height={560} fill="#1a2028" stroke="#4a5160" strokeWidth={12} />
        <rect x={-70} y={P - 540} width={160} height={330} fill="#10141c" />
        <rect x={60} y={P - 300} width={12} height={70} rx={5} fill="#9aa3ad" />
        <path d={`M-90,${P - 560} q30,-30 40,0`} stroke="#9aa3ad" strokeWidth={3} fill="none" />
        <path d={`M-60,${P - 560} q0,30 8,40 q10,-6 8,-16 Z`} fill="#c9a24a" />
      </g>
      {/* 40 máquinas */}
      {Array.from({ length: COL * 2 }).map((_, i) => <Maquina key={i} i={i} f={f} gira={girando.includes(i)} seed={i} />)}
      <rect x={LAV_PUNTOS.maqIni - 10} y={P - 236} width={COL * MW + 20} height={8} fill="#6a717c" />
      {/* máquina expendedora rota */}
      <g transform={`translate(${LAV_PUNTOS.expendedora},0)`}>
        <rect x={-110} y={P - 520} width={220} height={520} rx={10} fill="#2a2f38" />
        <rect x={-92} y={P - 500} width={140} height={360} fill="#141820" />
        {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => <rect key={`${r}${c}`} x={-84 + c * 44} y={P - 490 + r * 70} width={32} height={50} rx={4} fill={r === 1 && c === 2 ? "#141820" : ["#6a7080", "#8a909a", "#4a505c"][(r + c) % 3]} />))}
        <rect x={-92} y={P - 500} width={140} height={360} fill="#9fb8e0" opacity={titilar > 0.9 ? 0.05 : 0.14} />
        <rect x={60} y={P - 480} width={36} height={120} rx={4} fill="#3a404a" />
        <rect x={-80} y={P - 330} width={130} height={56} fill="#f2efe6" transform={`rotate(-4 -15 ${P - 300})`} />
        <text x={-15} y={P - 306} fontSize={17} fill="#2a2a2a" textAnchor="middle" fontFamily="sans-serif" fontWeight={800} transform={`rotate(-4 -15 ${P - 300})`}>OUT OF</text>
        <text x={-15} y={P - 284} fontSize={17} fill="#2a2a2a" textAnchor="middle" fontFamily="sans-serif" fontWeight={800} transform={`rotate(-4 -15 ${P - 300})`}>ORDER</text>
        <rect x={-92} y={P - 110} width={184} height={50} rx={6} fill="#141820" />
      </g>
      {/* piso de baldosas en damero frío */}
      <rect x={-900} y={P} width={6100} height={900} fill="#2a2e35" />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 60 }).map((_, c) => (r + c) % 2 ? null : <rect key={`${r}-${c}`} x={-900 + c * 100 + (r % 2) * 0} y={P + r * 30} width={100} height={30} fill="#33373f" />))}
      <rect x={-900} y={P} width={6100} height={5} fill="#4a505a" />
      {/* reflejos de los tubos en el piso */}
      {[300, 1500, 2700].map((x, k) => <Charco key={k} x={x} y={P + 60} rx={420} color="#dfe8ff" fuerza={0.12 * (k === 1 ? titilar : 1)} />)}
      {/* banco de sillas de plástico (donde se sienta Leo) */}
      <g>
        <rect x={900} y={P - 64} width={560} height={12} rx={4} fill="#4a515c" />
        {[0, 1, 2, 3].map((k) => <g key={k}><rect x={915 + k * 136} y={P - 138} width={110} height={80} rx={16} fill="#6e7684" /><rect x={915 + k * 136} y={P - 76} width={110} height={16} rx={6} fill="#5f6775" /></g>)}
        {[930, 1430].map((x) => <rect key={x} x={x} y={P - 54} width={10} height={54} fill="#3a404a" />)}
      </g>
      {/* mesa de doblar (el rincón de Tenzo) */}
      <g>
        <rect x={LAV_PUNTOS.mesa - 60} y={P - 150} width={520} height={18} rx={4} fill="#c9ccd2" />
        <rect x={LAV_PUNTOS.mesa - 50} y={P - 132} width={500} height={8} fill="#9aa1aa" />
        {[LAV_PUNTOS.mesa - 30, LAV_PUNTOS.mesa + 420].map((x) => <path key={x} d={`M${x},${P - 124} L${x + 20},${P} M${x + 20},${P - 124} L${x},${P}`} stroke="#7d848e" strokeWidth={6} />)}
      </g>
      {farol && <FarolPapel x={LAV_PUNTOS.farol} y={P - 150} s={1} luz={luzFarol} />}
      {farol && <Charco x={LAV_PUNTOS.farol} y={P + 30} rx={520} color={ORO} fuerza={0.3 * luzFarol} />}
      {farol && <Halo x={LAV_PUNTOS.farol} y={P - 260} r={720} color={ORO} fuerza={0.14 * luzFarol} />}
      {/* carrito */}
      <g transform={`translate(${LAV_PUNTOS.carrito},0)`}>
        <path d={`M-70,${P - 150} Q-40,${P - 190} 0,${P - 170} Q40,${P - 196} 72,${P - 150} Z`} fill="#b9bec6" />
        <path d={`M-80,${P - 150} L80,${P - 150} L70,${P - 70} L-70,${P - 70} Z`} fill="#9aa3ad" fillOpacity={0.12} stroke="#aeb5bd" strokeWidth={4} />
        {Array.from({ length: 7 }).map((_, k) => <line key={k} x1={-72 + k * 24} y1={P - 150} x2={-64 + k * 21} y2={P - 70} stroke="#aeb5bd" strokeWidth={2} />)}
        <rect x={-6} y={P - 70} width={10} height={58} fill="#8a9199" /><rect x={-60} y={P - 16} width={120} height={6} fill="#8a9199" />
        {[-55, 55].map((cx) => <circle key={cx} cx={cx} cy={P - 6} r={7} fill="#2a2c30" />)}
      </g>
      {/* tubos del techo (el del rincón titila) */}
      {[0, 650, 1300, 1950, 2700, 3400].map((x, k) => <Tubo key={k} x={x} y={-150} p={k === 2 ? titilar : 1} />)}
      {/* zócalo de ladrillo bajo el ventanal */}
      <rect x={V.x - 28} y={V.y + V.h + 14} width={V.w + 56} height={P - V.y - V.h - 14} fill="#2b2f37" />
      <Ladrillos x={V.x - 28} y={V.y + V.h + 14} w={V.w + 56} h={P - V.y - V.h - 14} color="#1e2128" o={0.6} />
      <Halo x={V.x + V.w / 2} y={V.y + V.h / 2} r={900} color="#6f86b0" fuerza={0.08} />
    </g>
  );
};
