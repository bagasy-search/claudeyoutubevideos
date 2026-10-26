// El Aerial Lift Bridge de Duluth en vector: 2 torres de celosía, viga superior de celosía y el tablero que sube (`alza`).
// Se dibuja con la base de las torres en (x, y), ancho total W (luz entre torres = W − 2·torre). color = acero oscuro.
import React from "react";
import { osc } from "../../anikit/sets/comun";

const Celosia: React.FC<{ x: number; y: number; w: number; h: number; paso: number; color: string; grosor?: number }> = ({ x, y, w, h, paso, color, grosor = 3 }) => {
  const n = Math.max(1, Math.round(h / paso));
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = y + i * (h / n), b = y + (i + 1) * (h / n);
    d.push(`M${x},${a} L${x + w},${b} M${x + w},${a} L${x},${b} M${x},${b} L${x + w},${b}`);
  }
  return <path d={d.join(" ")} stroke={color} strokeWidth={grosor} fill="none" />;
};
const CelosiaH: React.FC<{ x: number; y: number; w: number; h: number; paso: number; color: string; grosor?: number }> = ({ x, y, w, h, paso, color, grosor = 3 }) => {
  const n = Math.max(1, Math.round(w / paso));
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = x + i * (w / n), b = x + (i + 1) * (w / n);
    d.push(`M${a},${y} L${b},${y + h} M${a},${y + h} L${b},${y} M${b},${y} L${b},${y + h}`);
  }
  return <path d={d.join(" ")} stroke={color} strokeWidth={grosor} fill="none" />;
};

export const PuenteLift: React.FC<{ x: number; y: number; W?: number; H?: number; color?: string; alza?: number; luces?: number; detalle?: number; nieve?: number }> = ({ x, y, W = 1000, H = 560, color = "#241c2e", alza = 0, luces = 0, detalle = 1, nieve = 0 }) => {
  const T = W * 0.075; // ancho de torre
  const vh = H * 0.17; // alto de la viga superior
  const deckY = y - H * 0.18 - alza * H * 0.55; // tablero levadizo
  const g = Math.max(1.5, 3 * detalle);
  const c2 = osc(color, 0.8);
  return (
    <g>
      {/* torres */}
      {[x, x + W - T].map((tx, i) => (
        <g key={i}>
          <rect x={tx} y={y - H} width={T} height={H} fill="none" stroke={color} strokeWidth={g * 2} />
          <Celosia x={tx} y={y - H} w={T} h={H} paso={T * 1.1} color={color} grosor={g} />
          <rect x={tx - T * 0.15} y={y - 14} width={T * 1.3} height={14} fill={color} />
        </g>
      ))}
      {/* viga superior */}
      <rect x={x} y={y - H} width={W} height={vh} fill="none" stroke={color} strokeWidth={g * 2} />
      <CelosiaH x={x + T} y={y - H} w={W - 2 * T} h={vh} paso={vh * 1.1} color={color} grosor={g} />
      {nieve > 0 && <rect x={x - 4} y={y - H - 7} width={W + 8} height={8} rx={3} fill="#e9eef8" opacity={nieve} />}
      {/* cables y contrapesos */}
      {[x + T * 0.5, x + W - T * 0.5].map((cx, i) => <line key={i} x1={cx} y1={y - H + vh} x2={cx} y2={deckY - 20} stroke={c2} strokeWidth={g} />)}
      {/* tablero levadizo */}
      <rect x={x + T} y={deckY - H * 0.06} width={W - 2 * T} height={H * 0.06} fill={color} />
      <CelosiaH x={x + T} y={deckY - H * 0.06} w={W - 2 * T} h={H * 0.06} paso={H * 0.07} color={c2} grosor={g * 0.7} />
      {/* luces del puente (sus focos de navegación) */}
      {luces > 0 && [x + T * 0.5, x + W - T * 0.5, x + W / 2].map((lx, i) => <circle key={i} cx={lx} cy={i === 2 ? deckY - H * 0.07 : y - H - 6} r={Math.max(3, 6 * detalle)} fill={i === 2 ? "#ff6a4a" : "#ffcf6e"} opacity={luces} />)}
    </g>
  );
};
