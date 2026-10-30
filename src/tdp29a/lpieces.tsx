// lin29 · piezas chicas del canal de Linda: la ETIQUETA DE EQUIPAJE de aerolínea que marca cada número (cae de su
// tira elástica y se balancea con peso; el nombre se escribe al lado) y la tarjeta de embarque de «subscribe» colgada.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "./lib";
import { HAND, cl, phys } from "./hkit";

const swing = (t: number, a: number) => { const x = t - a; return x <= 0 ? 0 : 20 * Math.exp(-x * 1.6) * Math.cos(x * 6.2); };
const bars = (n: number) => Array.from({ length: 28 }, (_, i) => <div key={i} style={{ width: 2 + ((i * 7 + n * 3) % 4), height: 40, background: "#1b1b1f", marginRight: 2 }} />);

export const StepTag: React.FC<{ t: number; at: number; out: number; n: number; name: string; side?: boolean }> = ({ t, at, out, n, name, side }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const drop = phys(t, at, 5.5, 0.4), up = cl((t - out) / 0.8), y = -330 + 600 * drop - 760 * up * up;
  const x = side ? 330 : 280, sc = side ? 0.68 : 0.95, w = cl(phys(t, at + 0.45, 6, 0.7)) * (1 - up);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: 0, transform: `scale(${sc}) rotate(${swing(t, at + 0.35)}deg)`, transformOrigin: "50% 0" }}>
      {/* tira elástica */}
      <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: Math.max(0, y + 20), background: "linear-gradient(90deg,#9c2a22,#d9483a,#9c2a22)" }} />
      {/* la etiqueta de equipaje: cartulina blanca con franja azul, código de barras y el número enorme */}
      <div style={{ position: "absolute", left: -95, top: y, width: 190, height: 330, borderRadius: 14, background: "linear-gradient(180deg,#fbfaf6,#e9e5da)", boxShadow: "0 28px 56px rgba(0,0,0,.6)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", height: 54, background: "#1d2f5a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#141414", boxShadow: "0 0 0 6px #f4efe3" }} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "#1d2f5a", marginTop: 14 }}>NUMBER</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 128, lineHeight: 1, color: "#c0392b", marginTop: 4 }}>{n}</div>
        <div style={{ display: "flex", marginTop: 18 }}>{bars(n)}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: y + 120, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 24px rgba(0,0,0,.85)", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// tarjeta de embarque colgada a la derecha con «Subscribe» escrito a mano
export const SubTag: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const d = phys(t, at, 5, 0.38), up = cl((t - out) / 0.8), y = -380 + 500 * d - 650 * up * up, wr = cl((t - at - 0.6) / 0.9);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 1590, top: 0, transform: `rotate(${swing(t, at + 0.4) * 0.8}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: Math.max(0, y + 20), background: "#d9cdb2" }} />
      <div style={{ position: "absolute", left: -140, top: y, width: 280, height: 360, borderRadius: 16, background: "linear-gradient(170deg,#fbfaf6,#e7e1d2)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", height: 64, background: "#1d2f5a", color: "#f4efe3", fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>BOARDING PASS</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#a32a1e", marginTop: 34, transform: "rotate(-5deg)", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)` }}>Subscribe</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#2a3346", marginTop: 20, opacity: cl((t - at - 1.6) * 2), textAlign: "center", lineHeight: 1.05 }}>a new one<br />every week</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: "#2a3346", marginTop: 14, opacity: cl((t - at - 2.4) * 2) }}>— Linda</div>
        <div style={{ position: "absolute", bottom: 74, left: 0, right: 0, borderTop: "3px dashed rgba(29,47,90,.35)" }} />
      </div>
    </div>
  </AbsoluteFill>;
};
