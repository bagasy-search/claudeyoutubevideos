// len29 · piezas chicas del canal de Lenny (sin pastillas ni placas): la CHAPITA de válvula que marca cada número
// (cuelga de su cadena y se balancea con peso) y la ETIQUETA de suscribirse colgada de la canilla.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "./lib";
import { HAND, cl, phys } from "./hkit";

const swing = (t: number, a: number) => { const x = t - a; return x <= 0 ? 0 : 22 * Math.exp(-x * 1.6) * Math.cos(x * 6.2); };

// chapita redonda de bronce estampada con el número, colgada de una cadena que baja desde arriba; el nombre se escribe al lado
export const StepTag: React.FC<{ t: number; at: number; out: number; n: number; name: string; side?: boolean }> = ({ t, at, out, n, name, side }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const drop = phys(t, at, 5.5, 0.4), up = cl((t - out) / 0.8), y = -260 + 560 * drop - 700 * up * up;
  const x = side ? 360 : 300, sc = side ? 0.7 : 1, w = cl(phys(t, at + 0.45, 6, 0.7)) * (1 - up);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: 0, transform: `scale(${sc}) rotate(${swing(t, at + 0.35)}deg)`, transformOrigin: "50% 0" }}>
      {/* cadena de bolitas */}
      <div style={{ position: "absolute", left: -4, top: 0, width: 8, height: Math.max(0, y), background: "repeating-linear-gradient(180deg,#b9b2a2 0 8px,transparent 8px 12px)" }} />
      <div style={{ position: "absolute", left: -72, top: y, width: 144, height: 144, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f3d593, #c9963f 55%, #8a5e22)", boxShadow: "0 24px 50px rgba(0,0,0,.6), inset 0 0 0 6px rgba(120,80,30,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 10, width: 18, height: 18, borderRadius: "50%", background: "#2a2016", boxShadow: "inset 0 2px 3px rgba(0,0,0,.8)" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 78, color: "#4a3214", textShadow: "0 2px 0 rgba(255,235,190,.6), 0 -2px 0 rgba(0,0,0,.35)", marginTop: 12 }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: y + 46, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 50, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 24px rgba(0,0,0,.8)", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// etiqueta de cartón con ojal y piolín, colgada de la derecha de cuadro como de una canilla: «SUBSCRIBE» escrito a mano
export const SubTag: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const d = phys(t, at, 5, 0.38), up = cl((t - out) / 0.8), y = -330 + 470 * d - 600 * up * up, wr = cl((t - at - 0.6) / 0.9);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 1600, top: 0, transform: `rotate(${swing(t, at + 0.4) * 0.8}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: Math.max(0, y + 20), background: "#d9cdb2" }} />
      <div style={{ position: "absolute", left: -120, top: y, width: 240, height: 330, background: "linear-gradient(170deg,#e9d9b4,#cdb789)", clipPath: "polygon(22% 0, 78% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
        <div style={{ position: "absolute", top: 22, width: 30, height: 30, borderRadius: "50%", background: "#1a1612", boxShadow: "0 0 0 7px #f3ead6" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#7a1f14", transform: "rotate(-6deg)", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)` }}>Subscribe</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#3a2f22", marginTop: 26, opacity: cl((t - at - 1.6) * 2), textAlign: "center", lineHeight: 1.05 }}>a new one<br />every week</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: "#3a2f22", marginTop: 14, opacity: cl((t - at - 2.4) * 2) }}>— Lenny</div>
      </div>
    </div>
  </AbsoluteFill>;
};
