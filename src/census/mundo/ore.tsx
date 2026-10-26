// ORE, el labrador negro de Gus (lc-c, primera aparición en el Ep.5). 4 patas, vector plano, rim light de color.
// x,y = pies; dir 1 mira a la derecha; cola = meneo 0..1; echado 0..1 (patas que se acortan); cabeza = grados.
import React from "react";
import { osc } from "../../anikit/sets/comun";

export const Ore: React.FC<{ x: number; y: number; dir?: 1 | -1; s?: number; f?: number; cola?: number; echado?: number; cabeza?: number; luz?: string }> = ({ x, y, dir = 1, s = 1, f = 0, cola = 0, echado = 0, cabeza = 0, luz = "#ffcf6e" }) => {
  const c = "#1b1716", L = 0.72 * (1 - echado) + 0.12;
  const men = Math.sin(f / 2.2) * 26 * cola;
  return (
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
      <ellipse cx={0} cy={2} rx={110} ry={10} fill="#000" opacity={0.25} />
      {[-62, -40, 48, 68].map((px, i) => <rect key={i} x={px - 8} y={-88 * L} width={16} height={88 * L} rx={7} fill={i % 2 ? osc(c, 0.85) : c} />)}
      <path d={`M-86,${-86 * L - 30} Q-90,${-86 * L - 74} -40,${-86 * L - 78} L54,${-86 * L - 80} Q96,${-86 * L - 70} 86,${-86 * L - 24} Q40,${-86 * L - 10} -40,${-86 * L - 14} Q-80,${-86 * L - 12} -86,${-86 * L - 30} Z`} fill={c} />
      <path d={`M-84,${-86 * L - 60} q-30,-10 -44,${-30} `} stroke={c} strokeWidth={14} strokeLinecap="round" fill="none" transform={`rotate(${men} -84 ${-86 * L - 60})`} />
      <g transform={`translate(78,${-86 * L - 72}) rotate(${cabeza})`}>
        <rect x={-14} y={-40} width={34} height={50} rx={14} fill={c} />
        <path d="M0,-74 Q34,-82 50,-60 L74,-52 Q86,-42 74,-30 L40,-26 Q8,-24 -4,-42 Z" fill={c} />
        <circle cx={78} cy={-46} r={6} fill="#3a2a2a" />
        <circle cx={36} cy={-58} r={5} fill="#f6ecd2" /><circle cx={37.5} cy={-58} r={2.6} fill={c} />
        <path d="M10,-66 Q-6,-60 -2,-30 Q10,-34 16,-56 Z" fill={osc(c, 0.75)} />
        <path d={`M6,-70 Q44,-90 60,-60`} stroke={luz} strokeWidth={3} fill="none" opacity={0.6} />
      </g>
      <path d={`M-80,${-86 * L - 72} Q0,${-86 * L - 88} 60,${-86 * L - 82}`} stroke={luz} strokeWidth={3} fill="none" opacity={0.55} />
    </g>
  );
};

