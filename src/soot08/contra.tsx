import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ent, prog } from "./kit";
import { Campana } from "./kit2";
import { Reloj } from "./kit3";
import { Espacio, NINO, GenteFab } from "./mundo";
import { MulaPerfil, carroX } from "./perfil";
import { Persona } from "./persona";

// vuelta 11 OJO: la mula DE COSTADO (el corte lateral que ya funcionaba en C4) para reemplazar los planos del nene
// de frente contra la pared de husos. u0→u1 = de dónde a dónde va el carro durante el plano; x = el nene en el mundo.
export const ContraMula: React.FC<{ t: number; t0: number; t1: number; x?: number; g?: Partial<GenteFab>; u0?: number; u1?: number; z?: number }> = ({ t, t0, t1, x = -250, g = {}, u0 = 1, u1 = 0.36, z = 1.25 }) => {
  if (t < t0 || t > t1) return null;
  const op = prog(t, t0, t0 + 0.3) * (1 - prog(t, t1 - 0.3, t1));
  const u = interpolate(t, [t0 + 0.2, t1 - 0.4], [u0, u1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cerca = Math.max(0, 1 - Math.abs(carroX(u) - x) / 500);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "#c9a27a" }} />
      <Espacio cam={{ x: -320, y: -330, z }}>
        <MulaPerfil t={t} u={u} peligro={cerca}>
          <Persona t={t} seed={2} ropa={NINO} gorro="gorra" x={x} y={0} h={430} expr={cerca > 0.5 ? "miedo" : "neutro"} mira={1} bD={150 + 14 * Math.sin(t * 9)} cD={30} inclina={-6 - 10 * cerca} descalzo {...g} />
        </MulaPerfil>
      </Espacio>
    </AbsoluteFill>
  );
};

// A8: «YOUR SHIFT STARTS NOW» = la torre de la fábrica a las 5:30, la campana sonando y el nene corriendo por los adoquines.
export const Campanazo: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  if (t < t0 || t > t1) return null;
  const op = prog(t, t0, t0 + 0.25) * (1 - prog(t, t1 - 0.2, t1));
  const k = t - t0;
  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#2a2350,#6b4a7a 70%,#d98a6a)" }} />
      <div style={{ position: "absolute", left: 1180, top: 120, width: 420, height: 900, background: "#8a3b2e", borderTop: "16px solid #2a1530" }} />
      <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 400, background: "#9c4535" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 210, top: 70, width: 110, height: 170, borderRadius: "55px 55px 0 0", background: i % 3 ? "#ffcf6b" : "#3a2340", border: "8px solid #2a1530" }} />)}
      </div>
      <div style={{ position: "absolute", left: 1390, top: 470 }}><div style={{ position: "relative" }}><Reloj x={0} y={0} s={0.55} hora={5.5} /></div></div>
      <Campana t={t} t0={t0} t0b={t0 + 0.2} x={1390} y={120} s={0.9} />
      <div style={{ position: "absolute", left: 0, top: 940, width: 1920, height: 140, background: "repeating-linear-gradient(90deg,#4a4560 0 90px,#3e3a55 90px 180px)" }} />
      <Persona t={t} seed={2} ropa={NINO} gorro="gorra" x={interpolate(k, [0, 1.7], [150, 900], { extrapolateRight: "clamp" })} y={1000} h={560} expr="miedo" camina={3.2} inclina={14} mira={1} descalzo />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, t0)})` }} />
    </AbsoluteFill>
  );
};
