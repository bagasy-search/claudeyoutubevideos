// pkit — «tú» haciendo cada oficio: el Person del kit btg (sólo lectura) + herramientas dibujadas por código, sin IA.
// Todo sale de useCurrentFrame(); coordenadas absolutas 1920×1080 (x,y = pie del muñeco).
import React from "react";
import { Person } from "../kits/btg/kit";
import { useCurrentFrame } from "remotion";
import { F } from "./ukit";

export const SV: React.FC<{ children: React.ReactNode; z?: number }> = ({ children, z }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: z }}>{children}</svg>
);
// el muñeco con inclinación (agacharse, empujar), rebote y herramienta en la mano
export const Tu: React.FC<{ x: number; y: number; s?: number; rot?: number; bob?: number; walk?: boolean; arms?: "down" | "up" | "spear"; flip?: boolean; dark?: boolean; op?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, bob = 0, walk, arms, flip, dark, op = 1, children }) => (
  <div style={{ position: "absolute", inset: 0, transformOrigin: `${x}px ${y}px`, transform: `translateY(${bob}px) rotate(${rot}deg)`, opacity: op }}>
    <Person x={x} y={y} s={s} walk={walk} arms={arms} flip={flip} dark={dark} />
    {children && <SV>{children}</SV>}
  </div>
);
// mano derecha aproximada del Person (para colgar herramientas)
export const hand = (x: number, y: number, s: number, flip = false): [number, number] => [x + (flip ? -26 : 26) * s, y - 105 * s];

export const Shovel: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-4} y={-150} width={8} height={160} rx={3} fill="#7a5532" /><rect x={-16} y={-160} width={32} height={10} rx={4} fill="#5a3c22" />
    <path d="M-26,8 L26,8 L20,58 Q0,74 -20,58 Z" fill="#8c9399" stroke="#4b5156" strokeWidth={3} />
  </g>
);
export const Barrow: React.FC<{ x: number; y: number; s?: number; load?: number; tilt?: number; col?: string }> = ({ x, y, s = 1, load = 1, tilt = 0, col = "#efe6cf" }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
      <circle cx={-70} cy={-22} r={22} fill="#2a1d12" stroke="#6b4a2a" strokeWidth={6} /><line x1={-70} y1={-22} x2={-70 + 16 * Math.cos(f / 5)} y2={-22 + 16 * Math.sin(f / 5)} stroke="#6b4a2a" strokeWidth={4} />
      <path d="M-110,-70 L40,-70 L20,-30 L-90,-30 Z" fill="#6b4a2a" stroke="#3a2614" strokeWidth={4} />
      {load > 0 && <path d={`M-104,-70 Q-40,${-70 - 46 * load} 34,-70 Z`} fill={col} />}
      <line x1={30} y1={-60} x2={120} y2={-40} stroke="#5a3c22" strokeWidth={9} strokeLinecap="round" /><line x1={0} y1={-32} x2={10} y2={0} stroke="#3a2614" strokeWidth={7} />
    </g>
  );
};
export const Bucket: React.FC<{ x: number; y: number; s?: number; fill?: number; col?: string; lid?: boolean }> = ({ x, y, s = 1, fill = 0, col = "#5a4632", lid }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-30,-20 Q0,-60 30,-20" fill="none" stroke="#3b3b3b" strokeWidth={4} />
    <path d="M-30,-20 L30,-20 L24,40 L-24,40 Z" fill="#7d8287" stroke="#43474b" strokeWidth={4} />
    {fill > 0 && <rect x={-26} y={-18 + 52 * (1 - fill)} width={52} height={4 + 52 * fill * 0.2} fill={col} opacity={0.9} />}
    {lid && <rect x={-34} y={-28} width={68} height={10} rx={4} fill="#5c6166" />}
  </g>
);
export const Lantern: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame(); const fl = 0.85 + 0.15 * Math.sin(f / 3) * Math.sin(f / 7);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={120} fill="rgba(255,190,90,.16)" opacity={fl} /><circle r={60} fill="rgba(255,200,110,.25)" opacity={fl} />
      <path d="M-8,-40 Q0,-54 8,-40" fill="none" stroke="#2a2a2a" strokeWidth={4} /><rect x={-16} y={-40} width={32} height={46} rx={5} fill="rgba(255,210,120,.85)" stroke="#2a2a2a" strokeWidth={4} />
      <path d={`M0,-8 q-6,-10 0,-20 q6,10 0,20`} fill="#fff1c2" opacity={fl} />
    </g>
  );
};
export const Basket: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-34,-70 L34,-70 L26,40 L-26,40 Z" fill="#9c7444" stroke="#5e4326" strokeWidth={4} />
    {[-50, -26, -2, 22].map((yy) => <line key={yy} x1={-32} y1={yy} x2={32} y2={yy} stroke="#5e4326" strokeWidth={3} />)}
    {[-18, 0, 18].map((xx) => <line key={xx} x1={xx} y1={-70} x2={xx * 0.8} y2={40} stroke="#6e5130" strokeWidth={3} />)}
  </g>
);
// estrella de «arde»: rayitas que salen de un punto (ojos que arden, golpe, pinchazo)
export const Sting: React.FC<{ x: number; y: number; k: number; c?: string; n?: number; r?: number }> = ({ x, y, k, c = "#ffd23a", n = 7, r = 46 }) => (
  <g opacity={k}>{Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2; return <line key={i} x1={x + Math.cos(a) * r * 0.45} y1={y + Math.sin(a) * r * 0.45} x2={x + Math.cos(a) * r * (0.6 + 0.4 * k)} y2={y + Math.sin(a) * r * (0.6 + 0.4 * k)} stroke={c} strokeWidth={5} strokeLinecap="round" />; })}</g>
);
// medidor vertical/horizontal con número (cuotas, profundidad, plomo en el cuerpo)
export const Meter: React.FC<{ x: number; y: number; w: number; h: number; k: number; col: string; label: string; val: string; size?: number }> = ({ x, y, w, h, k, col, label, val, size = 64 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: F }}>
    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3, color: "rgba(240,235,229,.75)" }}>{label}</div>
    <div style={{ fontSize: size, fontWeight: 900, color: col, fontVariantNumeric: "tabular-nums", lineHeight: 1.05, whiteSpace: "nowrap" }}>{val}</div>
    <div style={{ marginTop: 10, width: w, height: h, borderRadius: h / 2, background: "rgba(240,235,229,.16)", overflow: "hidden" }}><div style={{ width: `${Math.max(0, Math.min(1, k)) * 100}%`, height: "100%", background: col, borderRadius: h / 2 }} /></div>
  </div>
);
