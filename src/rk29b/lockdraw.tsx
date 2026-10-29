// rk29b · dibujos base (SVG/CSS con volumen): la cerradura con teclado, el teléfono con su interruptor, la puerta de frente,
// el tornillo, el cerradero. Cada componente de heroesA/B arma su mecanismo con estas piezas.
import React from "react";
import { FONT } from "./lib";

export const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd6ff", GRN = "#6fe39a", TX = "#f7f4ee", BRASS = "#c9a24a";
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const At: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; z?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, o = 1, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o }}>{children}</div>
);

// teclado de la cerradura (lado de afuera): 10 botones en 5 filas de 2; glow[i] 0..1 por botón, wear[i] = brillo de gastado
export const Keypad: React.FC<{ w?: number; lit?: number; glow?: number[]; wear?: number[]; led?: string; ledOn?: number }> = ({ w = 220, lit = 0, glow = [], wear = [], led = GRN, ledOn = 0 }) => {
  const h = w * 2.2, keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  return <div style={{ width: w, height: h, borderRadius: w * 0.16, position: "relative", background: "linear-gradient(160deg,#2b2d33,#111216 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.12), inset 0 -6px 14px rgba(0,0,0,.6)" }}>
    <div style={{ position: "absolute", left: "50%", top: w * 0.12, width: w * 0.1, height: w * 0.1, borderRadius: "50%", transform: "translateX(-50%)", background: ledOn > 0.05 ? led : "#3a3c40", boxShadow: ledOn > 0.05 ? `0 0 ${24 * ledOn}px ${led}` : "none" }} />
    {keys.map((k, i) => {
      const r = Math.floor(i / 2), c = i % 2, g = glow[i] ?? 0, ws = wear[i] ?? 0;
      return <div key={i} style={{ position: "absolute", left: w * (0.17 + c * 0.38), top: w * (0.36 + r * 0.33), width: w * 0.28, height: w * 0.24, borderRadius: w * 0.06, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontWeight: 800, fontSize: w * 0.13, color: g > 0.1 ? "#fff" : `rgba(190,220,255,${0.25 + 0.6 * lit})`,
        background: g > 0.05 ? `rgba(143,214,255,${0.25 + 0.5 * g})` : ws > 0.05 ? `linear-gradient(135deg, rgba(255,255,255,${0.32 * ws}), rgba(255,255,255,${0.06 * ws}) 60%), #26282d` : "#1d1f23",
        boxShadow: g > 0.05 ? `0 0 ${30 * g}px rgba(143,214,255,.8)` : "inset 0 2px 0 rgba(255,255,255,.07), 0 3px 4px rgba(0,0,0,.6)" }}>{k}</div>;
    })}
    <div style={{ position: "absolute", left: "50%", bottom: w * 0.1, width: w * 0.2, height: w * 0.2, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(#7a6a40,#3a3020)", boxShadow: "inset 0 2px 4px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: "45%", top: "20%", width: "10%", height: "60%", background: "#141414", borderRadius: 2 }} /></div>
  </div>;
};

// teléfono: marco con pantalla clara; children = lo que muestra
export const Phone: React.FC<{ w?: number; glow?: number; children?: React.ReactNode; dark?: boolean }> = ({ w = 300, glow = 1, children, dark }) => (
  <div style={{ width: w, height: w * 2.05, borderRadius: w * 0.14, padding: w * 0.045, background: "linear-gradient(150deg,#3b3e45,#16171b)", boxShadow: `0 50px 90px rgba(0,0,0,.65), 0 0 ${60 * glow}px rgba(143,214,255,${0.18 * glow}), inset 0 1px 0 rgba(255,255,255,.2)` }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.1, overflow: "hidden", position: "relative", background: dark ? "#0d0f14" : `linear-gradient(180deg,#f4f2ee,#e6e3dc)`, filter: `brightness(${0.35 + 0.65 * glow})`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: "50%", top: w * 0.03, width: w * 0.3, height: w * 0.07, borderRadius: w, background: "#111", transform: "translateX(-50%)" }} />
      {children}
    </div>
  </div>
);

// interruptor grande (on 0..1)
export const Toggle: React.FC<{ w?: number; on: number; col?: string }> = ({ w = 160, on, col = GRN }) => (
  <div style={{ width: w, height: w * 0.58, borderRadius: w, position: "relative", background: on > 0.5 ? col : "#b9b6ae", transition: "none", boxShadow: "inset 0 3px 8px rgba(0,0,0,.25)" }}>
    <div style={{ position: "absolute", top: w * 0.05, left: w * (0.05 + 0.42 * on), width: w * 0.48, height: w * 0.48, borderRadius: "50%", background: "#fff", boxShadow: "0 6px 12px rgba(0,0,0,.3)" }} />
  </div>
);

// fila de ajustes dentro del teléfono
export const Row: React.FC<{ w: number; txt: string; on?: number; hl?: number; col?: string }> = ({ w, txt, on, hl = 0, col }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${w * 0.035}px ${w * 0.06}px`, margin: `0 ${w * 0.04}px ${w * 0.025}px`, borderRadius: w * 0.04, background: hl > 0.05 ? `rgba(255,178,87,${0.35 * hl})` : "rgba(0,0,0,.04)", boxShadow: hl > 0.05 ? `0 0 0 ${3 * hl}px ${AMB}` : "none" }}>
    <div style={{ fontWeight: 800, fontSize: w * 0.075, color: "#24262b" }}>{txt}</div>
    {on !== undefined && <Toggle w={w * 0.2} on={on} col={col} />}
  </div>
);

// puerta de frente con marco, cerradura y manija; open 0..1 = cuánto gira hacia adentro
export const Door: React.FC<{ w?: number; open?: number; col?: string; lock?: React.ReactNode; glass?: "none" | "side" | "both"; night?: number }> = ({ w = 420, open = 0, col = "#7a2f25", lock, glass = "none", night = 0 }) => {
  const h = w * 2.1, sw = glass === "none" ? 0 : w * 0.26;
  return <div style={{ position: "relative", width: w + 2 * sw + w * 0.14, height: h + w * 0.08, perspective: 1600 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(90deg,#e8e2d6,#d8d1c3)", boxShadow: "0 40px 80px rgba(0,0,0,.55)" }} />
    {glass !== "none" && [0, 1].filter((i) => glass === "both" || i === 0).map((i) => <div key={i} style={{ position: "absolute", top: w * 0.07, left: i ? w * 0.07 + sw + w : w * 0.035, width: sw - w * 0.04, height: h - w * 0.06, borderRadius: 4, background: `linear-gradient(160deg, rgba(190,220,240,${0.75 - 0.5 * night}), rgba(90,120,150,${0.6 - 0.3 * night}))`, boxShadow: "inset 0 0 0 6px #cfc7b8" }} />)}
    <div style={{ position: "absolute", top: w * 0.07, left: w * 0.07 + sw, width: w, height: h - w * 0.06, background: "#0b0b0d" }} />
    <div style={{ position: "absolute", top: w * 0.07, left: w * 0.07 + sw, width: w, height: h - w * 0.06, transformOrigin: "0% 50%", transform: `rotateY(${-70 * open}deg)`, borderRadius: 3,
      background: `linear-gradient(90deg, ${col}, color-mix(in srgb, ${col} 80%, #000))`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4)" }}>
      {[0.07, 0.55].map((y, i) => <div key={i} style={{ position: "absolute", left: w * 0.12, top: h * y, width: w * 0.76, height: h * 0.36, borderRadius: 4, boxShadow: "inset 0 0 0 5px rgba(0,0,0,.18), inset 0 0 0 9px rgba(255,255,255,.05)" }} />)}
      <div style={{ position: "absolute", right: w * 0.08, top: h * 0.47, width: w * 0.09, height: w * 0.09, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #f3d98a, ${BRASS} 60%, #6d5420)` }} />
      {lock && <div style={{ position: "absolute", right: w * 0.04, top: h * 0.3, transform: "translateY(-50%)" }}>{lock}</div>}
    </div>
  </div>;
};

// tornillo de costado, largo en px (escala: 1 pulgada = 90 px por defecto)
export const Screw: React.FC<{ len?: number; w?: number; col?: string; rot?: number }> = ({ len = 270, w = 26, col = "#b9bcc2", rot = 0 }) => (
  <svg width={len + w * 1.2} height={w * 2.2} viewBox={`0 0 ${len + w * 1.2} ${w * 2.2}`} style={{ overflow: "visible", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.5))" }}>
    <defs><linearGradient id={`sc${len}${w}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".4" stopColor={col} /><stop offset="1" stopColor="#4a4d52" /></linearGradient></defs>
    <path d={`M0 ${w * 0.1} L${w * 0.5} ${w * 0.1} L${w * 1.1} ${w * 0.7} L${w * 1.1} ${w * 1.5} L${w * 0.5} ${w * 2.1} L0 ${w * 2.1} Z`} fill={`url(#sc${len}${w})`} />
    <rect x={w * 1.1} y={w * 0.7} width={len - w * 0.6} height={w * 0.8} fill={`url(#sc${len}${w})`} />
    <path d={`M${len + w * 0.5} ${w * 0.7} L${len + w * 1.2} ${w * 1.1} L${len + w * 0.5} ${w * 1.5} Z`} fill={col} />
    {Array.from({ length: Math.floor(len / (w * 0.42)) }, (_, i) => <line key={i} x1={w * 1.4 + i * w * 0.42} y1={w * 0.58} x2={w * 1.6 + i * w * 0.42} y2={w * 1.62} stroke="#5d6066" strokeWidth={w * 0.09} />)}
  </svg>
);

// cerradero (strike plate) de frente
export const Strike: React.FC<{ w?: number; screws?: string }> = ({ w = 120, screws = "#8d9096" }) => (
  <div style={{ width: w, height: w * 2.6, borderRadius: w * 0.12, position: "relative", background: `linear-gradient(90deg,#8a6f2c,${BRASS} 40%,#e6cf86 55%,#8a6f2c)`, boxShadow: "0 18px 30px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", left: "26%", top: "34%", width: "48%", height: "32%", borderRadius: w * 0.08, background: "#141210", boxShadow: "inset 0 4px 8px #000" }} />
    {[0.13, 0.8].map((y, i) => <div key={i} style={{ position: "absolute", left: "38%", top: `${y * 100}%`, width: "24%", height: w * 0.24, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #fff, ${screws})` }} />)}
  </div>
);

// silueta de persona simple (cabeza + cuerpo), para planos vistos de arriba o de frente
export const Person: React.FC<{ s?: number; col?: string; lying?: number }> = ({ s = 1, col = "#d9d2c4", lying = 0 }) => (
  <div style={{ width: 90 * s, height: 200 * s, position: "relative", transform: `rotate(${-90 * lying}deg)` }}>
    <div style={{ position: "absolute", left: 25 * s, top: 0, width: 40 * s, height: 40 * s, borderRadius: "50%", background: col }} />
    <div style={{ position: "absolute", left: 8 * s, top: 46 * s, width: 74 * s, height: 150 * s, borderRadius: `${36 * s}px ${36 * s}px ${12 * s}px ${12 * s}px`, background: col }} />
  </div>
);

// casita de frente (para mapas de puertas, garage)
export const House: React.FC<{ w?: number; col?: string; win?: number }> = ({ w = 520, col = "#8c4b3a", win = 0 }) => (
  <svg width={w} height={w * 0.78} viewBox="0 0 200 156" style={{ overflow: "visible", filter: "drop-shadow(0 26px 26px rgba(0,0,0,.55))" }}>
    <path d="M6 70 L100 10 L194 70 Z" fill="#3b3330" /><rect x="18" y="68" width="164" height="86" fill={col} />
    <rect x="34" y="88" width="34" height="28" fill={win > 0.05 ? `rgba(255,214,140,${0.4 + 0.6 * win})` : "#2b3440"} /><rect x="132" y="88" width="34" height="28" fill={win > 0.05 ? `rgba(255,214,140,${0.4 + 0.6 * win})` : "#2b3440"} />
    <rect x="86" y="104" width="28" height="50" fill="#4a2a20" /><circle cx="108" cy="130" r="2.4" fill={BRASS} />
  </svg>
);
