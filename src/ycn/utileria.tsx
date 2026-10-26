// Utilería propia de Yellow Coat Nell (en el mundo o en la mano: origen en la mano).
import React from "react";

// bola de bowling (Lorraine = la rosa de Dot)
export const Bola: React.FC<{ x?: number; y?: number; color?: string; s?: number; rot?: number }> = ({ x = 0, y = 0, color = "#ff5fa8", s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <circle r={26} fill={color} />
    <circle cx={-8} cy={-9} r={9} fill="#ffffff" opacity={0.22} />
    {[[-6, -4], [5, -6], [1, 6]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3.4} fill="#2a1420" />)}
  </g>
);

// pino de bowling (de pie; s = escala, rot = caído)
export const Pino: React.FC<{ x?: number; y?: number; s?: number; rot?: number; o?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path d="M0,-60 C9,-60 9,-48 6,-40 C4,-34 4,-31 9,-22 C15,-11 13,0 7,0 L-7,0 C-13,0 -15,-11 -9,-22 C-4,-31 -4,-34 -6,-40 C-9,-48 -9,-60 0,-60 Z" fill="#f6f2e8" />
    <rect x={-5} y={-42} width={10} height={3} fill="#d8382c" /><rect x={-5} y={-37} width={10} height={3} fill="#d8382c" />
  </g>
);

export const Maletin: React.FC<{ color?: string }> = ({ color = "#5a3a24" }) => (
  <g transform="translate(-4,6)">
    <path d="M-10,-4 q0,-10 10,-10 q10,0 10,10" stroke="#2a1a10" strokeWidth={4} fill="none" />
    <rect x={-30} y={-4} width={60} height={44} rx={5} fill={color} />
    <rect x={-30} y={10} width={60} height={4} fill="#000" opacity={0.25} />
    <rect x={-4} y={8} width={8} height={8} rx={1} fill="#d9b44a" />
  </g>
);

export const Tiza: React.FC = () => <rect x={-4} y={-12} width={8} height={20} rx={3} fill="#f4f1e8" transform="rotate(30)" />;

export const Linterna: React.FC<{ prendida?: boolean }> = ({ prendida = true }) => (
  <g transform="rotate(-90)">
    <rect x={-8} y={-26} width={16} height={40} rx={4} fill="#2a2a30" />
    <rect x={-11} y={-34} width={22} height={10} rx={3} fill="#3a3a44" />
    {prendida && <circle cx={0} cy={-34} r={6} fill="#fff6d8" />}
  </g>
);

// medio pancho y bolsa de papas (raciones)
export const Pancho: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-24} y={-8} width={48} height={14} rx={7} fill="#e8b46a" />
    <rect x={-27} y={-6} width={54} height={8} rx={4} fill="#b8452e" />
    <path d="M-20,-6 q5,-4 10,0 q5,4 10,0 q5,-4 10,0 q5,4 10,0" stroke="#f2d23a" strokeWidth={2.5} fill="none" />
  </g>
);
export const Papas: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#e2483a" }) => (
  <g transform={`scale(${s})`}>
    <path d="M-18,-40 L18,-40 L20,0 L-20,0 Z" fill={color} />
    <path d="M-18,-40 l6,-5 l6,5 l6,-5 l6,5 l6,-5 l6,5" fill={color} />
    <ellipse cx={0} cy={-20} rx={10} ry={8} fill="#f4e2a0" />
  </g>
);
// pote de helado de 3 galones
export const PoteHelado: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-30,-56 L30,-56 L26,0 L-26,0 Z" fill="#f4efe4" />
    <rect x={-32} y={-62} width={64} height={10} rx={3} fill="#e9a0b8" />
    <rect x={-26} y={-38} width={52} height={14} fill="#e9a0b8" opacity={0.8} />
  </g>
);
// anotador de pedidos (la cuenta de las raciones)
export const Anotador: React.FC = () => (
  <g transform="rotate(-80)">
    <rect x={-18} y={-26} width={36} height={48} rx={3} fill="#f8f4e8" />
    <rect x={-18} y={-26} width={36} height={8} fill="#3f9a55" />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-13} y={-12 + k * 8} width={22 - (k % 2) * 6} height={2} fill="#7a7a8a" />)}
  </g>
);
// trapo de bar envolviendo una mano (la venda manchada: sólo color, nunca sangre a la vista)
export const Venda: React.FC<{ color?: string }> = ({ color = "#efe9dc" }) => (
  <g><ellipse cx={0} cy={0} rx={16} ry={12} fill={color} /><ellipse cx={4} cy={2} rx={7} ry={5} fill="#8a6a4a" opacity={0.5} /></g>
);
