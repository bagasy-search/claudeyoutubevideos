// objetos de la cocina de Rosa para los componentes (todo en código, con material: esmalte, vidrio, hierro, papel, cinta de pintor).
// Todo determinista en t (nada de Math.random sin semilla).
import React from "react";
import { HAND, MARK, TX, AMB, cl, phys } from "./hkit";
export { HAND, MARK };

// vapor: 3 hilos que suben y se deshacen (≤1 Hz)
export const Steam: React.FC<{ tt: number; x: number; y: number; w?: number; h?: number; o?: number }> = ({ tt, x, y, w = 120, h = 180, o = 1 }) => (
  <svg width={w + 80} height={h + 40} style={{ position: "absolute", left: x - w / 2 - 40, top: y - h - 20, overflow: "visible" }}>
    {[0, 1, 2].map((i) => {
      const cx = 40 + (w / 3) * (i + 0.5), ph = (tt * 0.45 + i * 0.33) % 1;
      return <path key={i} d={`M ${cx} ${h + 20} c -24 -${h * 0.2} 24 -${h * 0.35} 0 -${h * 0.5} c -24 -${h * 0.15} 24 -${h * 0.3} 0 -${h * 0.5}`} fill="none"
        stroke="rgba(255,255,255,.5)" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="0.32 0.68" strokeDashoffset={-ph}
        style={{ filter: "blur(3px)" }} opacity={o * (0.7 - 0.25 * Math.sin(ph * Math.PI))} />;
    })}
  </svg>
);

// etiqueta de cinta de pintor escrita a mano
export const Tape: React.FC<{ txt: string; x: number; y: number; rot?: number; s?: number; size?: number; col?: string; anchor?: "c" | "l" }> = ({ txt, x, y, rot = -3, s = 1, size = 44, col = "#2b2620", anchor = "c" }) => {
  if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"},-50%) rotate(${rot + (1 - s) * 10}deg) scale(${0.7 + 0.3 * s})`, opacity: cl(s * 2.5),
    background: "linear-gradient(180deg,#f3e7c4,#e6d6a8)", padding: "6px 22px 4px", borderRadius: 3, boxShadow: "0 6px 14px rgba(0,0,0,.4)", fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap",
    clipPath: "polygon(1% 4%, 99% 0, 100% 96%, 0 100%)" }}>{txt}</div>;
};

// rótulo grande (≤5 palabras) que cae con peso y se asienta
export const Big: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; hand?: boolean; anchor?: "c" | "l" }> = ({ tt, at, x, y, txt, col = TX, size = 64, hand, anchor = "c" }) => {
  const s = phys(tt, at, 6.5, 0.45);
  if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"},-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2),
    fontFamily: hand ? HAND : undefined, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: hand ? 0 : 1, textShadow: "0 8px 28px rgba(0,0,0,.7)" }}>{txt}</div>;
};

// taza de esmalte blanca con borde azul (vista 3/4)
export const Cup: React.FC<{ w?: number; glow?: number }> = ({ w = 120, glow = 0 }) => {
  const h = w * 0.82;
  return <div style={{ position: "relative", width: w * 1.3, height: h }}>
    <div style={{ position: "absolute", right: 0, top: h * 0.2, width: w * 0.42, height: h * 0.5, borderRadius: "50%", border: `${w * 0.08}px solid #e9eef2`, boxShadow: "0 4px 8px rgba(0,0,0,.3)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: `${w * 0.06}px ${w * 0.06}px ${w * 0.3}px ${w * 0.3}px`,
      background: "linear-gradient(90deg,#c9d2da,#fbfdff 35%,#e8eef3 60%,#b9c3cc)", boxShadow: `0 ${w * 0.12}px ${w * 0.2}px rgba(0,0,0,.45), 0 0 ${40 * glow}px rgba(255,190,110,${0.7 * glow})` }} />
    <div style={{ position: "absolute", left: 0, top: -w * 0.06, width: w, height: w * 0.16, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, #3a2414 0 55%, #1d4e8f 57% 70%, #e9eef2 72%)" }} />
    <div style={{ position: "absolute", left: 0, bottom: 0, width: w, height: w * 0.07, borderRadius: "0 0 50% 50%", background: "#1d4e8f", opacity: 0.85 }} />
  </div>;
};

// moneda (vista cenital levemente inclinada)
export const Coin: React.FC<{ d?: number; v?: string }> = ({ d = 90, v = "" }) => (
  <div style={{ width: d, height: d * 0.92, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff3c4, #e0b44a 40%, #9c7420 75%, #6b4f12)",
    boxShadow: `0 ${d * 0.08}px 0 #6b4f12, 0 ${d * 0.18}px ${d * 0.3}px rgba(0,0,0,.5), inset 0 0 0 ${d * 0.06}px rgba(255,240,190,.45)`, display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 900, fontSize: d * 0.32, color: "#6b4f12" }}>{v}</div>
);

// frasco de vidrio con tapa; lleno = 0..1 (contenido de color col)
export const Jar: React.FC<{ w?: number; fill?: number; col?: string; lid?: string; label?: string; ls?: number }> = ({ w = 150, fill = 0, col = "#d8c39a", lid = "#b33a2c", label, ls = 1 }) => {
  const h = w * 1.35;
  return <div style={{ position: "relative", width: w, height: h + w * 0.14 }}>
    <div style={{ position: "absolute", left: w * 0.06, top: 0, width: w * 0.88, height: w * 0.16, borderRadius: 8, background: `linear-gradient(180deg, ${lid}, #000 160%)`, boxShadow: "0 4px 8px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 0, top: w * 0.14, width: w, height: h, borderRadius: `${w * 0.1}px ${w * 0.1}px ${w * 0.16}px ${w * 0.16}px`, overflow: "hidden",
      background: "linear-gradient(90deg, rgba(255,255,255,.10), rgba(255,255,255,.03) 40%, rgba(255,255,255,.12) 80%)", border: "3px solid rgba(255,255,255,.35)", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: `linear-gradient(180deg, ${col}, ${col} 60%, rgba(0,0,0,.25))` }} />
      <div style={{ position: "absolute", left: "12%", top: "6%", width: "12%", height: "80%", borderRadius: 20, background: "linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,.05))" }} />
    </div>
    {label && <Tape txt={label} x={w / 2} y={w * 0.14 + h * 0.5} s={ls} size={w * 0.26} rot={-2} />}
  </div>;
};

// plato hondo de barro visto 3/4 con contenido (col) y reflejo
export const Bowl: React.FC<{ w?: number; col?: string; top?: React.ReactNode }> = ({ w = 220, col = "#e8d9b0", top }) => (
  <div style={{ position: "relative", width: w, height: w * 0.62 }}>
    <div style={{ position: "absolute", left: 0, top: w * 0.12, width: w, height: w * 0.5, borderRadius: `0 0 ${w / 2}px ${w / 2}px / 0 0 ${w * 0.42}px ${w * 0.42}px`, background: "linear-gradient(90deg,#7a3b1f,#b4623a 40%,#9a4d2a 70%,#5e2c16)", boxShadow: `0 ${w * 0.1}px ${w * 0.16}px rgba(0,0,0,.5)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.26, borderRadius: "50%", background: "#a5552f" }} />
    <div style={{ position: "absolute", left: w * 0.06, top: w * 0.03, width: w * 0.88, height: w * 0.2, borderRadius: "50%", background: `radial-gradient(ellipse at 45% 40%, #fff8, ${col} 40%, ${col})`, overflow: "hidden" }}>{top}</div>
  </div>
);

// la mesa de madera de la escena (piso de los objetos)
export const Table: React.FC<{ y?: number; o?: number }> = ({ y = 760, o = 1 }) => (
  <div style={{ position: "absolute", left: -100, right: -100, top: y, bottom: -200, opacity: o, transform: "perspective(900px) rotateX(58deg)", transformOrigin: "50% 0",
    background: "repeating-linear-gradient(90deg, #5b3a22 0 140px, #4e321d 140px 143px, #63412a 143px 300px, #4a2f1b 300px 303px), linear-gradient(180deg,#6b4a30,#3a2414)",
    backgroundBlendMode: "multiply", boxShadow: "inset 0 40px 80px rgba(0,0,0,.5)" }} />
);

// sombra de contacto que se aprieta al apoyarse (s = cuánto llegó)
export const Shadow: React.FC<{ x: number; y: number; w: number; s?: number }> = ({ x, y, w, s = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.08, width: w, height: w * 0.16, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.6), transparent 70%)", transform: `scale(${0.5 + 0.5 * cl(s)})`, opacity: cl(s) }} />
);

export const glowTxt = (c = AMB) => `0 0 30px ${c}88, 0 8px 28px rgba(0,0,0,.7)`;
