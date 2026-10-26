import React from "react";
import { AbsoluteFill } from "remotion";
import { ent, prog } from "./kit";
import { NINO, GenteFab } from "./mundo";
import { Persona } from "./persona";

// vuelta 10 OJO: contraplano bajo del mule (rompe la pared de husos repetida). Ventanales con haces de luz,
// el carro de husos yendo y viniendo a la altura de la cabeza, pelusa en el aire y el niño grande en primer plano.
export const ContraMula: React.FC<{ t: number; t0: number; t1: number; x?: number; g?: Partial<GenteFab>; vel?: number }> = ({ t, t0, t1, x = 1300, g = {}, vel = 1.6 }) => {
  if (t < t0 || t > t1) return null;
  const op = prog(t, t0, t0 + 0.3) * (1 - prog(t, t1 - 0.3, t1));
  const carro = Math.sin((t - t0) * vel) * 420;
  const cerca = Math.max(0, 1 - Math.abs(carro - (x - 960)) / 300);
  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2d9ac,#d8ae7c 70%,#b98a5a)" }} />
      {[260, 960, 1660].map((wx, i) => (
        <React.Fragment key={wx}>
          <div style={{ position: "absolute", left: wx - 150, top: 60, width: 300, height: 360, borderRadius: "150px 150px 0 0", background: "#fff4d8", border: "14px solid #7a5230" }} />
          <div style={{ position: "absolute", left: wx - 150, top: 400, width: 300, height: 700, background: "linear-gradient(180deg,rgba(255,244,216,.45),rgba(255,244,216,0))", transform: `skewX(${-14 + i * 2}deg)`, transformOrigin: "50% 0" }} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "#7a5230" }} />
      <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 18, background: "#5c3c22" }} />
      {/* el carro */}
      <div style={{ position: "absolute", left: -300 + carro, top: 430, width: 2520, height: 70, background: "#6b4a2e", borderBottom: "12px solid #2a1530", borderTop: "8px solid #2a1530" }} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: -280 + carro + i * 84, top: 500, width: 22, height: 120, borderRadius: 10, background: `repeating-linear-gradient(${(t * 900) % 360}deg,#f4efe4 0 8px,#c9c2dc 8px 16px)`, border: "4px solid #2a1530" }} />)}
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 167 + t * 50) % 2000) - 40, top: 200 + ((i * 89) % 600) + Math.sin(t * 1.4 + i) * 24, width: 16, height: 11, borderRadius: 8, background: "#fff", opacity: 0.6 }} />)}
      <div style={{ transform: `scale(${0.96 + 0.04 * ent(t, t0)})`, transformOrigin: `${x}px 1000px`, position: "absolute", inset: 0 }}>
        <Persona t={t} seed={2} ropa={NINO} gorro="gorra" x={x} y={1010} h={720} expr="miedo" mira={carro < x - 960 ? -1 : 1} inclina={-8 * cerca} ladea={6 * cerca} {...g} />
      </div>
    </AbsoluteFill>
  );
};
