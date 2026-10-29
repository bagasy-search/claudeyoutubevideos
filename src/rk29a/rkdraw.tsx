// rk29a · dibujos base de los componentes (SVG con volumen): la llave (fob), las ondas, el plano de la casa, la bolsa,
// la pila, el auto visto de arriba. Todo se mueve desde afuera (props), acá sólo se dibuja.
import React from "react";
import { cl } from "./hkit";

export const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd6ff", GRN = "#6fe39a", TX = "#f7f4ee";

// la llave: carcasa negra con brillo, 3 botones, la luz roja (led 0..1) y el aro
export const Fob: React.FC<{ w?: number; led?: number; open?: number; rot?: number; dim?: number; style?: React.CSSProperties }> = ({ w = 220, led = 0, open = 0, rot = 0, dim = 0, style }) => {
  const h = w * 1.7;
  return <svg width={w} height={h} viewBox="0 0 100 170" style={{ overflow: "visible", transform: `rotate(${rot}deg)`, filter: `drop-shadow(0 ${w * 0.12}px ${w * 0.14}px rgba(0,0,0,.6)) brightness(${1 - dim})`, ...style }}>
    <defs>
      <linearGradient id="fobg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#3a3d44" /><stop offset=".45" stopColor="#15161a" /><stop offset="1" stopColor="#050506" /></linearGradient>
      <radialGradient id="fobl"><stop offset="0" stopColor="#ffd2c8" /><stop offset=".35" stopColor="#ff3b2a" /><stop offset="1" stopColor="#ff3b2a" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx="50" cy="8" r="7" fill="none" stroke="#9aa0a8" strokeWidth="3" />
    <g transform={`translate(0 ${-open * 8})`}><path d="M18 22 Q50 8 82 22 L86 84 L14 84 Z" fill="url(#fobg)" stroke="#55585f" strokeWidth="1.2" /></g>
    <g transform={`translate(0 ${open * 8})`}><path d="M14 86 L86 86 L82 150 Q50 166 18 150 Z" fill="url(#fobg)" stroke="#55585f" strokeWidth="1.2" /></g>
    {[46, 72, 98].map((y, i) => <g key={i} transform={`translate(0 ${y > 85 ? open * 8 : -open * 8})`}><rect x="32" y={y} width="36" height="18" rx="9" fill="#26282d" stroke="#60646c" strokeWidth="1" /><rect x="36" y={y + 3} width="28" height="4" rx="2" fill="rgba(255,255,255,.12)" /></g>)}
    <path d="M24 26 Q50 16 76 26" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2" />
    <circle cx="50" cy="32" r="3" fill={led > 0.05 ? "#ff3b2a" : "#3a1512"} />
    {led > 0.05 && <circle cx="50" cy="32" r={14} fill="url(#fobl)" opacity={led} />}
  </svg>;
};

// ondas que salen de (x,y): k = fase 0..1 que avanza, n anillos; col; arc limita a un abanico hacia ang
export const Waves: React.FC<{ x: number; y: number; k: number; n?: number; r?: number; col?: string; ang?: number; spread?: number; op?: number }> = ({ x, y, k, n = 4, r = 260, col = ICE, ang, spread = 70, op = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const f = ((k + i / n) % 1), rr = 20 + f * r, o = (1 - f) * op;
      if (ang === undefined) return <circle key={i} cx={x} cy={y} r={rr} fill="none" stroke={col} strokeWidth={5 - 3 * f} opacity={o} />;
      const a0 = (ang - spread / 2) * Math.PI / 180, a1 = (ang + spread / 2) * Math.PI / 180;
      return <path key={i} d={`M${x + rr * Math.cos(a0)} ${y + rr * Math.sin(a0)} A${rr} ${rr} 0 0 1 ${x + rr * Math.cos(a1)} ${y + rr * Math.sin(a1)}`} fill="none" stroke={col} strokeWidth={6 - 3 * f} strokeLinecap="round" opacity={o} />;
    })}
  </svg>
);

// plano de la casa visto de arriba (planta): paredes gruesas, cocina, sala, dormitorios, garage; s = cuánto se dibujó (0..1)
export const Plan: React.FC<{ x: number; y: number; w: number; s?: number; tilt?: number; children?: React.ReactNode }> = ({ x, y, w, s = 1, tilt = 52, children }) => {
  const h = w * 0.58, L = 2 * (w + h);
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `perspective(1800px) rotateX(${tilt}deg)`, transformOrigin: "50% 60%" }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={w} height={h} fill="#e9e1d1" opacity={0.95 * cl(s * 3)} rx={6} />
      <rect x={0} y={0} width={w} height={h} fill="none" stroke="#3a2f25" strokeWidth={14} strokeDasharray={L} strokeDashoffset={L * (1 - cl(s))} rx={6} />
      {[[w * 0.36, 0, w * 0.36, h * 0.62], [w * 0.36, h * 0.5, w, h * 0.5], [w * 0.68, 0, w * 0.68, h * 0.5], [0, h * 0.62, w * 0.25, h * 0.62]].map(([a, b, c, d], i) =>
        <line key={i} x1={a} y1={b} x2={a + (c - a) * cl(s * 1.5 - 0.3)} y2={b + (d - b) * cl(s * 1.5 - 0.3)} stroke="#3a2f25" strokeWidth={9} strokeLinecap="round" />)}
      <rect x={w * 0.03} y={h * 0.66} width={w * 0.3} height={h * 0.3} fill="#cfc6b6" opacity={cl(s * 2 - 1)} />
      {children}
    </svg>
  </div>;
};

// la bolsa de señal (bolsa negra con tapa enrollada); open 0..1 abre la tapa
export const Pouch: React.FC<{ w?: number; open?: number; lining?: number }> = ({ w = 260, open = 0, lining = 0 }) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 100 125" style={{ overflow: "visible", filter: "drop-shadow(0 30px 30px rgba(0,0,0,.55))" }}>
    <defs><linearGradient id="pch" x1="0" x2="1"><stop offset="0" stopColor="#2a2b30" /><stop offset=".5" stopColor="#141518" /><stop offset="1" stopColor="#202126" /></linearGradient>
      <linearGradient id="lin" x1="0" x2="1"><stop offset="0" stopColor="#8e959e" /><stop offset=".5" stopColor="#e8edf2" /><stop offset="1" stopColor="#7c838c" /></linearGradient></defs>
    <rect x="8" y="22" width="84" height="100" rx="8" fill="url(#pch)" />
    {lining > 0 && <rect x="14" y="28" width="72" height="88" rx="5" fill="url(#lin)" opacity={lining} />}
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={14 + i * 9} y1="28" x2={14 + i * 9} y2="116" stroke="rgba(255,255,255,.04)" />)}
    <g transform={`translate(50 22) rotate(${-150 * open}) translate(-50 -22)`}><rect x="8" y="4" width="84" height="22" rx="6" fill="#1b1c20" stroke="#34363c" /><rect x="30" y="12" width="40" height="6" rx="3" fill="#3a3c42" /></g>
  </svg>
);

// pila de botón vista de canto/arriba (moneda plateada con relieve)
export const Coin: React.FC<{ d?: number; label?: string; spin?: number }> = ({ d = 160, label = "+", spin = 0 }) => (
  <div style={{ width: d, height: d, borderRadius: "50%", transform: `rotateY(${spin}deg)`, background: "radial-gradient(circle at 35% 30%, #ffffff, #c9ced4 30%, #8b9097 70%, #5d6168)", boxShadow: `0 ${d * 0.12}px ${d * 0.2}px rgba(0,0,0,.6), inset 0 0 0 ${d * 0.05}px rgba(255,255,255,.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: d * 0.2, color: "#4a4e55", letterSpacing: 1 }}>{label}</div>
);

// auto visto de arriba (techo, parabrisas, luces); lights 0..1
export const CarTop: React.FC<{ w?: number; col?: string; lights?: number }> = ({ w = 170, col = "#c9ccd1", lights = 0 }) => (
  <svg width={w} height={w * 2} viewBox="0 0 80 160" style={{ overflow: "visible", filter: "drop-shadow(0 18px 18px rgba(0,0,0,.5))" }}>
    <rect x="6" y="6" width="68" height="148" rx="22" fill={col} />
    <rect x="14" y="34" width="52" height="26" rx="8" fill="#2a3340" /><rect x="14" y="108" width="52" height="20" rx="8" fill="#2a3340" />
    <rect x="12" y="62" width="56" height="44" rx="6" fill="rgba(255,255,255,.18)" />
    {[[14, 8], [58, 8]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="6" rx="3" fill={lights > 0.05 ? "#fff6c8" : "#8a8a80"} opacity={0.5 + 0.5 * lights} />)}
    {[[12, 148], [60, 148]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="6" rx="3" fill={lights > 0.05 ? "#ff3b2a" : "#5a1a16"} />)}
  </svg>
);

// silueta de persona vista de arriba (puck con hombros), para el relevo y la calle
export const Puck: React.FC<{ s?: number; col?: string }> = ({ s = 70, col = "#1a1c22" }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" style={{ overflow: "visible", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.6))" }}>
    <ellipse cx="20" cy="22" rx="17" ry="11" fill={col} /><circle cx="20" cy="20" r="9" fill="#2b2e36" stroke="#55585f" strokeWidth="1.5" />
  </svg>
);
