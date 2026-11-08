// lkit — piezas dibujadas de ap6na (leopardo de Panar): silueta del leopardo con ojos que reflejan, casa kumaoni de piedra y pizarra,
// cresta de montaña en capas, linterna, árbol. Todo vectorial y por useCurrentFrame() (sin estado entre cuadros, sin Math.random).
import React from "react";
import { useCurrentFrame } from "remotion";
import { rnd } from "./ukit";

// leopardo de perfil (mira a la derecha). x,y = punto del suelo bajo el centro; s escala (1 ≈ 440 px de largo con la cola).
// crouch 0-1 lo aplasta contra el suelo (acecho); walk mueve las patas; eye 0-1 prende el reflejo de los ojos.
export const Leo: React.FC<{ x: number; y: number; s?: number; c?: string; crouch?: number; walk?: number; eye?: number; flip?: boolean; op?: number; spots?: boolean }> = ({ x, y, s = 1, c = "#0e0b08", crouch = 0, walk = 0, eye = 0, flip = false, op = 1, spots = false }) => {
  const sw = Math.sin(walk) * 10, sw2 = Math.sin(walk + Math.PI) * 10;
  const sy = 1 - 0.28 * crouch;
  const leg = (x0: number, y0: number, dx: number, k: number) => `M${x0 - 8},${y0} L${x0 - 6 + dx * 0.5},${y0 + 30 * k} L${x0 + dx},${-2} L${x0 + dx + 16},0 L${x0 + 10 + dx * 0.5},${y0 + 30 * k} L${x0 + 10},${y0} Z`;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={op}>
      <ellipse cx={120} cy={2} rx={210} ry={10} fill="rgba(0,0,0,.45)" />
      <g transform={`scale(1,${sy})`}>
        <path d={leg(300, -70, sw, 1)} fill={c} /><path d={leg(272, -66, sw2, 1)} fill={c} />
        <path d={leg(64, -66, sw2, 1)} fill={c} /><path d={leg(34, -70, sw, 1)} fill={c} />
        <path d={`M40,-112 C120,-132 220,-128 285,-126 C306,-142 336,-146 352,-134 L370,-132 L376,-146 L386,-130 C402,-124 412,-110 410,-98 L400,-90 C386,-84 368,-86 356,-92 C346,-80 332,-74 318,-68
          C250,-58 140,-58 70,-62 C30,-64 4,-78 -20,-74 C-70,-66 -120,-${30 - sw * 0.4} -150,-${46 + sw * 0.6} C-168,-60 -162,-74 -150,-70 C-128,-58 -96,-${66 - sw * 0.3} -60,-84 C-20,-104 10,-108 40,-112 Z`} fill={c} />
        {spots && Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={50 + rnd(i, 3) * 250} cy={-118 + rnd(i, 4) * 50} r={4 + rnd(i, 5) * 4} fill="none" stroke="rgba(255,200,120,.25)" strokeWidth={3} />)}
      </g>
      {eye > 0 && <g transform={`scale(1,${sy})`}>
        <circle cx={392} cy={-112} r={9} fill="#d8ff9a" opacity={eye} />
        <circle cx={392} cy={-112} r={26} fill="#d8ff9a" opacity={eye * 0.25} />
      </g>}
    </g>
  );
};
// sólo los dos ojos que reflejan (el leopardo invisible en la oscuridad)
export const Eyes: React.FC<{ x: number; y: number; k: number; s?: number; col?: string }> = ({ x, y, k, s = 1, col = "#d8ff9a" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    {[-18, 18].map((dx) => <g key={dx}><ellipse cx={dx} cy={0} rx={9} ry={6} fill={col} /><ellipse cx={dx} cy={0} rx={30} ry={20} fill={col} opacity={0.18} /></g>)}
  </g>
);
// casa kumaoni: piedra, techo de lajas de pizarra, puerta de madera, cuarto de animales abajo. lit 0-1 = ventana con luz
export const KHouse: React.FC<{ x: number; y: number; s?: number; lit?: number; door?: number; bar?: number; dark?: boolean }> = ({ x, y, s = 1, lit = 0, door = 0, bar = 0, dark = false }) => {
  const st = dark ? "#1a1c22" : "#6d6254", rf = dark ? "#111318" : "#4a4d55";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-110} y={-150} width={220} height={150} fill={st} />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={-110} y1={-150 + i * 25} x2={110} y2={-150 + i * 25} stroke="rgba(0,0,0,.22)" strokeWidth={2} />)}
      <path d="M-134,-148 L0,-222 L134,-148 Z" fill={rf} />
      {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={-120 + i * 8} y1={-155 - i * 13} x2={120 - i * 8} y2={-155 - i * 13} stroke="rgba(255,255,255,.08)" strokeWidth={3} />)}
      <rect x={-80} y={-120} width={44} height={38} fill={`rgba(255,${170 + 40 * lit},90,${0.12 + 0.85 * lit})`} />
      <rect x={20} y={-96} width={48} height={96} fill="#2b1a0f" />
      <rect x={20} y={-96} width={48 * (1 - door)} height={96} fill="#5a3a22" stroke="#2a1a10" strokeWidth={3} />
      {bar > 0 && <rect x={6} y={-54} width={76} height={12} rx={4} fill="#7a5532" opacity={bar} transform={`rotate(${(1 - bar) * -40},44,-48)`} />}
    </g>
  );
};
// crestas en capas (parallax) con niebla: el paisaje de Kumaon
export const Ridges: React.FC<{ n?: number; base?: number; col?: [number, number, number]; pan?: number; fog?: number }> = ({ n = 5, base = 900, col = [20, 34, 52], pan = 0, fog = 0.25 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const k = i / (n - 1), y0 = base - 420 + k * 380, amp = 110 - k * 40;
      const pts = Array.from({ length: 25 }).map((_, j) => { const xx = j * 90 - 120 + pan * (0.2 + k); return `${xx},${y0 - Math.abs(Math.sin(j * 0.7 + i * 1.9)) * amp - Math.sin(j * 1.9 + i) * 26}`; }).join(" L");
      const c = col.map((v) => Math.round(v * (0.45 + 0.9 * k)));
      return <g key={i}><path d={`M-120,1080 L${pts} L2200,1080 Z`} fill={`rgb(${c.join(",")})`} /><rect x={0} y={y0 - 30} width={1920} height={70} fill={`rgba(200,210,230,${fog * (1 - k)})`} style={{ filter: "blur(18px)" }} /></g>;
    })}
  </>
);
// linterna (farol) que tiembla: haz de luz cónico
export const Beam: React.FC<{ x: number; y: number; ang: number; len?: number; w?: number; k?: number }> = ({ x, y, ang, len = 900, w = 260, k = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`} opacity={k}>
    <path d={`M0,-6 L${len},${-w / 2} L${len},${w / 2} L0,6 Z`} fill="url(#beamg)" />
    <defs><linearGradient id="beamg" x1="0" x2="1"><stop offset="0" stopColor="#fff2c8" stopOpacity={0.55} /><stop offset="1" stopColor="#fff2c8" stopOpacity={0} /></linearGradient></defs>
  </g>
);
// árbol de roble/pino simple con copa en capas
export const Tree: React.FC<{ x: number; y: number; s?: number; c?: string; sway?: number }> = ({ x, y, s = 1, c = "#0d1a17", sway = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-10,0 L-6,-260 L6,-260 L10,0 Z" fill={c} />
    <path d="M-6,-150 L-80,-200 M6,-190 L90,-240" stroke={c} strokeWidth={10} strokeLinecap="round" />
    {[[-80, -230, 90], [70, -270, 100], [0, -320, 120], [-40, -290, 80]].map(([cx, cy, r], i) => <circle key={i} cx={cx + sway * (i % 2 ? 1 : -1)} cy={cy} r={r} fill={c} />)}
  </g>
);
export const useT = () => useCurrentFrame() / 30;
