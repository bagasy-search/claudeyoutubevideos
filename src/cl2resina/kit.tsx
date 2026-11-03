// cl2resina · piezas mínimas que comparten los componentes: tarjeta de vidrio, número que cuenta, trazo que se dibuja,
// tilde y cruz dibujadas, aparición con resorte. Todo f(t).
import React from "react";
import { C, FONT, BODY, cl, e, spr, shadowTxt } from "./lib";

export type FxP = { t: number; a: number; b: number; m: Record<string, number> };
export const glass = (o = 1): React.CSSProperties => ({ background: `rgba(40,30,18,${0.58 * o})`, border: `1.5px solid rgba(255,236,200,${0.30 * o})`, borderRadius: 26, boxShadow: `0 30px 80px rgba(0,0,0,${0.45 * o}), inset 0 1px 0 rgba(255,255,255,${0.14 * o})`, backdropFilter: "blur(14px)" });
// aparece con resorte en `at` (escala + subida); sale en `out`
export const Pop: React.FC<{ t: number; at: number; out?: number; x: number; y: number; k?: number; from?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ t, at, out = 1e9, x, y, k = 1, from = 60, style, children }) => {
  const p = spr(t, at, k), o = cl((t - at) * 7) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - p) * from}px) scale(${0.7 + 0.3 * p})`, ...style }}>{children}</div>;
};
// número que cuenta de `de` a `a` entre t0 y t1 (con decimales opcionales)
export const num = (t: number, t0: number, t1: number, de: number, a: number, dec = 0) => (de + (a - de) * e(t, t0, t1)).toFixed(dec).replace(".", ",");
export const Big: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, size = 160, col = C.ink, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 0.92, color: col, textShadow: shadowTxt, letterSpacing: 1, ...style }}>{children}</div>
);
export const Txt: React.FC<{ children: React.ReactNode; size?: number; col?: string; w?: number; style?: React.CSSProperties }> = ({ children, size = 38, col = C.dim, w, style }) => (
  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: size, color: col, width: w, lineHeight: 1.15, textShadow: shadowTxt, ...style }}>{children}</div>
);
// trazo SVG que se dibuja de 0 a 1 (pathLength normalizado)
export const Draw: React.FC<{ d: string; p: number; col?: string; w?: number; glow?: boolean; dash?: string; fill?: string }> = ({ d, p, col = C.ink, w = 5, glow, dash, fill = "none" }) =>
  p <= 0.001 ? null : <path d={d} pathLength={1} fill={fill} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ?? `${cl(p)} 1`} style={glow ? { filter: `drop-shadow(0 0 10px ${col})` } : undefined} />;
// tilde / cruz dibujadas sobre (x, y), radio r
export const Tick: React.FC<{ t: number; at: number; x: number; y: number; r?: number; col?: string }> = ({ t, at, x, y, r = 40, col = C.ok }) => (
  <g transform={`translate(${x},${y})`}><circle r={r * 1.35 * spr(t, at, 1.3)} fill="rgba(169,230,108,.14)" stroke={col} strokeWidth={4} opacity={cl((t - at) * 6)} /><Draw d={`M${-r * 0.55},0 L${-r * 0.12},${r * 0.45} L${r * 0.6},${-r * 0.45}`} p={e(t, at + 0.1, at + 0.45)} col={col} w={r * 0.2} /></g>
);
export const Cross: React.FC<{ t: number; at: number; x: number; y: number; r?: number; col?: string }> = ({ t, at, x, y, r = 40, col = C.red }) => (
  <g transform={`translate(${x},${y})`}><circle r={r * 1.35 * spr(t, at, 1.3)} fill="rgba(255,85,70,.14)" stroke={col} strokeWidth={4} opacity={cl((t - at) * 6)} /><Draw d={`M${-r * 0.5},${-r * 0.5} L${r * 0.5},${r * 0.5}`} p={e(t, at + 0.1, at + 0.3)} col={col} w={r * 0.2} /><Draw d={`M${r * 0.5},${-r * 0.5} L${-r * 0.5},${r * 0.5}`} p={e(t, at + 0.25, at + 0.45)} col={col} w={r * 0.2} /></g>
);
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>{children}</svg>;
// sacudida corta en `at` (golpe): devuelve px
export const shake = (t: number, at: number, amp = 14) => { const u = t - at; return u < 0 || u > 0.5 ? 0 : amp * Math.sin(u * 60) * Math.exp(-u * 9); };
