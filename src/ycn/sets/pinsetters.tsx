// SET · CUARTO DE MÁQUINAS (detrás de los pinos): el taller de Cal. Pasarela de rejilla y 8 pares de pinsetters
// de los años 60 (torreta que gira, mesa de pinos, barra de barrido, cinta del pozo, elevador de bolas).
//   x -900…-60 banco de trabajo con tablero de herramientas + TABLERO ELÉCTRICO con la palanca general (x -760)
//   máquina de la pista n en PIN_X(n) (n 1..16, de a pares, 240 px)
// Piso: PIN_PISO. props: encendidas (true | número de pistas prendidas), palanca 0 (arriba, prendido) .. 1 (abajo, cortado), luz "prendida" | "noche"
import React from "react";
import { Halo, LamparaColgante } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { SetProps } from "../../anikit/sets/comun";
import { Pino } from "../utileria";

export const PIN_PISO = 900;
export const PIN_X = (n: number) => 240 + (n - 1) * 240;
export const PIN_PUNTOS = { banco: -480, tablero: -1040, palanca: -1040, pista8: PIN_X(8), pista16: PIN_X(16) };
const P = PIN_PISO;

const Maquina: React.FC<{ x: number; n: number; on: boolean; f: number }> = ({ x, n, on, f }) => {
  const giro = on ? f * 2.4 : 0;
  const cinta = on ? (f * 4) % 40 : 0;
  return (
    <g>
      {/* bastidor */}
      <rect x={x - 110} y={P - 620} width={220} height={620} rx={8} fill="#3d5048" />
      <rect x={x - 100} y={P - 610} width={200} height={600} rx={6} fill="#4a6056" />
      {/* torreta con 10 pinos */}
      <g transform={`translate(${x},${P - 500}) rotate(${giro})`}>
        <circle r={86} fill="#2e3c36" stroke="#8a9a90" strokeWidth={5} />
        {Array.from({ length: 10 }).map((_, k) => <g key={k} transform={`rotate(${k * 36}) translate(0,-62)`}><Pino s={0.42} y={14} /></g>)}
        <circle r={14} fill="#c9a24a" />
      </g>
      {/* mesa de pinos + barra de barrido */}
      <rect x={x - 96} y={P - 360} width={192} height={40} rx={4} fill="#2a3530" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={x - 80 + k * 44} y={P - 352} width={30} height={22} rx={3} fill="#8a9a90" />)}
      <rect x={x - 104} y={P - 290 + (on ? Math.max(0, Math.sin(f / 18 + n)) * 30 : 0)} width={208} height={14} rx={3} fill="#e2b23a" />
      {/* pozo con cinta */}
      <rect x={x - 100} y={P - 170} width={200} height={110} rx={10} fill="#1a2420" />
      <rect x={x - 90} y={P - 120} width={180} height={34} rx={17} fill="#2a2a2a" />
      {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={x - 86 + ((k * 40 + cinta) % 180)} y={P - 116} width={10} height={26} fill="#5a5a5a" />)}
      {/* elevador de bolas */}
      <rect x={x + 112} y={P - 560} width={22} height={520} rx={8} fill="#2e3c36" />
      {on && <circle cx={x + 123} cy={P - 60 - ((f * 6 + n * 70) % 500)} r={16} fill="#2f6fd0" />}
      {/* lucecita de estado + número */}
      <circle cx={x - 78} cy={P - 588} r={9} fill={on ? "#7dff8a" : "#5a2a2a"} />
      {on && <Halo x={x - 78} y={P - 588} r={40} color="#7dff8a" fuerza={0.5} />}
      <text x={x + 60} y={P - 576} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#f2e8c8">{n}</text>
    </g>
  );
};

export const SalaPinsetters: React.FC<SetProps & { encendidas?: boolean | number[]; palanca?: number | ((f: number) => number); luz?: "prendida" | "noche" }> = ({ capa, f, encendidas = true, palanca = 0, luz = "prendida" }) => {
  const oscuro = luz === "noche";
  const pal = typeof palanca === "function" ? palanca(f) : palanca;
  const on = (n: number) => (Array.isArray(encendidas) ? encendidas.includes(n) : encendidas);
  if (capa === "lejos") return <rect x={-3000} y={-1500} width={9000} height={4000} fill="#0d1210" />;
  if (capa === "frente") return <g />;
  return (
    <g>
      {/* pared de bloques */}
      <rect x={-1400} y={-1500} width={6000} height={P + 1500} fill="#3a3a34" />
      {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={-1400} y={-1500 + i * 48} width={6000} height={3} fill="#302f2a" />)}
      {Array.from({ length: 120 }).map((_, i) => <rect key={`v${i}`} x={-1400 + (i % 60) * 100 + (Math.floor(i / 60) % 2) * 50} y={-1500} width={3} height={P + 1500} fill="#302f2a" opacity={0.5} />)}
      {/* caños y bandeja de cables */}
      <rect x={-1400} y={-200} width={6000} height={22} fill="#5a4a3a" /><rect x={-1400} y={-150} width={6000} height={10} fill="#8a6a3a" />
      {/* lámparas enjauladas */}
      {[-500, 600, 1560, 2520, 3480].map((x) => <LamparaColgante key={x} x={x} y={-140} piso={P} color="#ffd38a" pantalla="#3a3a34" fuerza={oscuro ? 0.15 : 0.7} techo={-500} f={f} />)}
      {/* banco de trabajo de Cal */}
      <rect x={-900} y={P - 700} width={840} height={360} fill="#8a6a44" />
      {Array.from({ length: 14 }).map((_, k) => {
        const x = -870 + k * 58, y = P - 640 + (k % 3) * 100;
        return k % 3 === 0 ? <g key={k}><rect x={x} y={y} width={10} height={70} fill="#c23a2e" /><rect x={x - 12} y={y} width={34} height={14} fill="#9aa3aa" /></g> : k % 3 === 1 ? <path key={k} d={`M${x},${y} l14,60 l-6,0 Z M${x + 10},${y} a12,12 0 1 1 0.1,0`} fill="#b9c0c6" /> : <rect key={k} x={x} y={y + 10} width={36} height={18} rx={4} fill="#f2c230" />;
      })}
      <rect x={-920} y={P - 300} width={880} height={22} rx={4} fill="#6a4a2c" />
      <rect x={-900} y={P - 278} width={18} height={278} fill="#4a3a2a" /><rect x={-80} y={P - 278} width={18} height={278} fill="#4a3a2a" />
      <rect x={-760} y={P - 360} width={160} height={60} rx={6} fill="#2f6fd0" /><rect x={-520} y={P - 340} width={120} height={40} rx={4} fill="#c23a2e" />
      {/* tablero eléctrico con la palanca general */}
      <g transform={`translate(${PIN_PUNTOS.tablero},0)`}>
        <rect x={-90} y={P - 640} width={180} height={260} rx={8} fill="#8a9298" />
        <rect x={-74} y={P - 620} width={148} height={30} fill="#f2c230" /><text x={0} y={P - 598} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#2a2420">PINSETTERS</text>
        <rect x={-12} y={P - 560} width={24} height={130} rx={6} fill="#3a3a40" />
        <g transform={`translate(0,${P - 495}) rotate(${-60 + pal * 120})`}><rect x={-8} y={-80} width={16} height={80} rx={6} fill="#c23a2e" /><circle cy={-80} r={14} fill="#e2483a" /></g>
        <text x={-60} y={P - 540} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#2a2420">ON</text>
        <text x={-66} y={P - 440} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#2a2420">OFF</text>
      </g>
      {/* las máquinas */}
      {Array.from({ length: 16 }).map((_, i) => <Maquina key={i} x={PIN_X(i + 1)} n={i + 1} on={on(i + 1) && pal < 0.5} f={f} />)}
      {/* pasarela de rejilla */}
      <rect x={-1400} y={P} width={6000} height={900} fill="#2a2e2c" />
      {Array.from({ length: 140 }).map((_, i) => <rect key={i} x={-1400 + i * 44} y={P} width={4} height={160} fill="#3a403c" />)}
      <rect x={-1400} y={P} width={6000} height={8} fill="#e2b23a" />
      {oscuro && <rect x={-1400} y={-1500} width={6000} height={3000} fill="#05080a" opacity={0.5} />}
    </g>
  );
};
