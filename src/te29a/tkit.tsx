// kit chico de piezas para los componentes del te29 (31-oct): suelo de contacto, número que cae con peso, losa con canto, mar, monedas, billetes,
// y el reloj de la ventana (W/K/LIN): la acción principal se estira a TODA la ventana para que el final nunca quede quieto.
import React from "react";
import { H, cl, eio, phys } from "./hkit";

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
export const W = (h: H) => Math.max(3, (h.out - h.at) * (h.sp ?? 1));
export const K = (tt: number, h: H, a = 0.3) => eio(tt, a, W(h) - 0.45);
export const LIN = (tt: number, h: H, a = 0.3) => cl((tt - a) / (W(h) - 0.45 - a));
export const PAPER = "#f1ead9", PAPERD = "#cdbb92", INK = "#2b2620", GOLD = "#e9b949", GOLDD = "#a87a1c", BRASS = "#c9a35a";
export const Floor: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.65 }) => <div style={{ ...at(x - w / 2, y - 26), width: w, height: 52, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o}), transparent 70%)`, filter: "blur(7px)" }} />;
export const Num: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 110 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(0,0,0,.25), 0 20px 44px rgba(0,0,0,.75)" }}>{txt}</div>;
};
export const Slab: React.FC<{ w: number; h: number; depth: number; top: string; side: string; br?: string; clip?: string; children?: React.ReactNode }> = ({ w, h, depth, top, side, br, clip, children }) => <div style={{ position: "relative", width: w, height: h + depth }}>
  {Array.from({ length: Math.ceil(depth / 3) }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: depth - i * 3, width: w, height: h, borderRadius: br, clipPath: clip, background: side, filter: `brightness(${0.55 + 0.35 * (i / (depth / 3))})` }} />)}
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: br, clipPath: clip, background: top, overflow: "hidden" }}>{children}<div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.2), transparent 45%, rgba(0,0,0,.25))" }} /></div>
</div>;
export const Coin: React.FC<{ r: number; silver?: boolean; copper?: boolean; txt?: string }> = ({ r, silver, copper, txt }) => { const [a, b, c] = silver ? ["#ffffff", "#c9d1d8", "#6d7680"] : copper ? ["#ffd2a8", "#c9733a", "#6a3414"] : ["#fff1b8", GOLD, "#8a6414"];
  return <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${a}, ${b} 45%, ${c})`, boxShadow: `inset 0 0 0 ${r * 0.13}px rgba(0,0,0,.18), 0 ${r * 0.22}px 0 ${c}, 0 ${r * 0.4}px ${r * 0.6}px rgba(0,0,0,.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: r * 0.7, color: c }}>{txt}</div>; };
export const Bill: React.FC<{ w: number; txt?: string }> = ({ w, txt }) => <div style={{ width: w, height: w * 0.45, borderRadius: 6, background: "linear-gradient(135deg,#d6e4c4,#86ad6e)", border: "4px solid #3f6a35", boxShadow: "0 6px 10px rgba(0,0,0,.35)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: w * 0.12, color: "#2a4a22" }}>
  {txt ?? <div style={{ width: w * 0.2, height: w * 0.2, borderRadius: "50%", border: "4px solid #3f6a35" }} />}</div>;
export const Sea: React.FC<{ tt: number; y: number; front?: boolean }> = ({ tt, y, front }) => <svg width={1920} height={1080 - y} style={{ ...at(0, y), overflow: "visible" }}>
  {[0, 1, 2].map((i) => { const yy = i * 26 + (front ? 30 : 0), o = (tt * (30 + i * 14)) % 240;
    return <path key={i} d={`M${-240 + o} ${yy} ${Array.from({ length: 10 }, () => `q60 ${-14 + i * 2} 120 0 t120 0`).join(" ")} V${1080} H-240 Z`} fill={front ? `rgba(16,50,70,${0.75 + i * 0.08})` : `rgba(28,78,104,${0.6 + i * 0.1})`} stroke="rgba(230,245,255,.35)" strokeWidth={3} />; })}
</svg>;
export const Person: React.FC<{ w: number; col?: string }> = ({ w, col = "#1d1a16" }) => <svg width={w} height={w * 2.4} viewBox="0 0 46 110"><circle cx={23} cy={16} r={14} fill={col} /><path d="M4 110 Q4 40 23 34 Q42 40 42 110 Z" fill={col} /></svg>;
// la banda presidencial peruana: rojo-blanco-rojo en diagonal
export const Sash: React.FC<{ w: number }> = ({ w }) => <div style={{ width: w, height: w * 0.22, background: "linear-gradient(90deg,#d91023 0 33%,#ffffff 33% 66%,#d91023 66%)", transform: "rotate(-32deg)", boxShadow: "0 6px 10px rgba(0,0,0,.4)", borderRadius: 4 }} />;
