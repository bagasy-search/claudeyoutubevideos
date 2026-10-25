// Objetos de utilería: se dibujan en el mundo o en la mano (enManoD/enManoI: origen en la mano, eje = antebrazo).
import React from "react";

export const Lata: React.FC<{ x?: number; y?: number; color?: string; s?: number; rot?: number }> = ({ x = 0, y = 0, color = "#e0563a", s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-15} y={-38} width={30} height={40} rx={6} fill={color} />
    <rect x={-15} y={-26} width={30} height={14} fill="#f6efe2" />
    <ellipse cx={0} cy={-38} rx={15} ry={4} fill="#c9c9c4" />
  </g>
);

export const Celular: React.FC<{ brillo?: string; s?: number; prendido?: boolean }> = ({ brillo = "#ff3fa4", s = 1, prendido = true }) => (
  <g transform={`scale(${s}) rotate(90)`}>
    <rect x={-12} y={-34} width={24} height={44} rx={5} fill="#15151a" stroke="#3a3a44" strokeWidth={2} />
    {prendido && <rect x={-9} y={-30} width={18} height={36} rx={3} fill={brillo} opacity={0.85} />}
  </g>
);

export const Taza: React.FC<{ x?: number; y?: number; color?: string; vapor?: number; f?: number }> = ({ x = 0, y = 0, color = "#f4efe6", vapor = 0, f = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-16,-30 L16,-30 L13,0 L-13,0 Z" fill={color} />
    <path d="M16,-24 q12,2 10,12 q-2,8 -12,6" stroke={color} strokeWidth={4} fill="none" />
    {vapor > 0 && [0, 1].map((k) => <path key={k} d={`M${-5 + k * 9},-36 q6,-10 0,-20 q-6,-10 2,-18`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={vapor * (0.3 + 0.2 * Math.sin(f / 8 + k))} />)}
  </g>
);

export const Vaso: React.FC<{ x?: number; y?: number; rot?: number; lleno?: number; color?: string }> = ({ x = 0, y = 0, rot = 0, lleno = 0.6, color = "#7ec8ff" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d="M-18,-56 L18,-56 L14,0 L-14,0 Z" fill="#dff3ff" opacity={0.55} stroke="#ffffff" strokeOpacity={0.8} strokeWidth={2.5} />
    <path d={`M${-14 - 4 * lleno},${-56 * lleno} L${14 + 4 * lleno},${-56 * lleno} L14,0 L-14,0 Z`} fill={color} opacity={0.75} />
    <rect x={-12} y={-52} width={4} height={44} rx={2} fill="#fff" opacity={0.7} />
  </g>
);

export const Libro: React.FC<{ color?: string; abierto?: boolean }> = ({ color = "#8a3a2e", abierto }) =>
  abierto ? (
    <g><path d="M-34,-6 Q-17,-14 0,-6 Q17,-14 34,-6 L34,18 Q17,10 0,18 Q-17,10 -34,18 Z" fill="#f4eedf" stroke={color} strokeWidth={4} /><line x1={0} y1={-6} x2={0} y2={18} stroke={color} strokeWidth={3} /></g>
  ) : (
    <g><rect x={-22} y={-30} width={44} height={60} rx={4} fill={color} /><rect x={-18} y={-30} width={4} height={60} fill="#000" opacity={0.25} /></g>
  );

export const Carrito: React.FC<{ x: number; y: number; dir?: 1 | -1; lleno?: number; rueda?: number }> = ({ x, y, dir = 1, lleno = 0, rueda = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1)`}>
    {lleno > 0 && Array.from({ length: Math.round(lleno * 10) }).map((_, k) => <rect key={k} x={-100 + (k % 5) * 40} y={-200 - Math.floor(k / 5) * 34} width={34} height={42} rx={5} fill={["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a"][k % 4]} />)}
    <path d="M-120,-180 L130,-180 L110,-60 L-95,-60 Z" fill="#9aa3a8" fillOpacity={0.18} stroke="#aab2b7" strokeWidth={7} strokeLinejoin="round" />
    {Array.from({ length: 7 }).map((_, k) => <line key={k} x1={-110 + k * 36} y1={-180} x2={-90 + k * 32} y2={-60} stroke="#aab2b7" strokeWidth={3.5} />)}
    <line x1={-115} y1={-120} x2={122} y2={-120} stroke="#aab2b7" strokeWidth={3.5} />
    <path d="M-120,-180 L-148,-222 L-186,-222" stroke="#8a9297" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-95,-60 L-80,-26 L95,-26 L110,-60" stroke="#aab2b7" strokeWidth={6} fill="none" />
    {[-78, 92].map((cx) => <g key={cx} transform={`translate(${cx},-12) rotate(${rueda})`}><circle r={14} fill="#26262a" /><line x1={-10} y1={0} x2={10} y2={0} stroke="#555" strokeWidth={3} /></g>)}
  </g>
);

export const Bolsa: React.FC<{ color?: string }> = ({ color = "#c9a36a" }) => (
  <g><path d="M-20,0 L20,0 L24,46 L-24,46 Z" fill={color} /><path d="M-10,0 Q0,-16 10,0" stroke={color} strokeWidth={4} fill="none" /></g>
);
