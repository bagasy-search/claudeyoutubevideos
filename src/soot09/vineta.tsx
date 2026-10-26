import React from "react";
import { ent, prog, fontFamily } from "./kit";

// VIÑETA: plano medio en pantalla (como la tarjeta de Gates y Somers). Una ventana grande con cielo, suelo y
// personajes que ACTÚAN lo que dice la voz; el mundo queda de fondo. Los hijos van en coordenadas de la viñeta.
export const Vineta: React.FC<{
  t: number; t0: number; t1: number; x?: number; y?: number; w?: number; h?: number; rot?: number;
  cielo?: string; cielo2?: string; suelo?: string; sueloY?: number; titulo?: string; colorTitulo?: string; borde?: string;
  sacude?: number; children: React.ReactNode;
}> = ({ t, t0, t1, x = 960, y = 560, w = 1240, h = 720, rot = 1.2, cielo = "#cfe0ea", cielo2, suelo = "#8a5a2e", sueloY, titulo, colorTitulo = "#c0392b", borde = "#2a1408", sacude = 0, children }) => {
  if (t < t0 - 0.05 || t > t1) return null;
  const e = ent(t, t0) * (1 - prog(t, t1 - 0.35, t1));
  const sx = sacude ? Math.sin(t * 37) * sacude : 0, sy = sacude ? Math.cos(t * 29) * sacude * 0.6 : 0;
  const sY = sueloY ?? h * 0.74;
  return (
    <div style={{ position: "absolute", left: x + sx, top: y + sy, width: w, height: h, transform: `translate(-50%,-50%) scale(${e}) rotate(${rot}deg)`, background: cielo2 ? `linear-gradient(${cielo}, ${cielo2})` : cielo, border: `10px solid ${borde}`, borderRadius: 28, overflow: "hidden", boxShadow: "0 18px 0 rgba(0,0,0,.25)" }}>
      <div style={{ position: "absolute", left: 0, top: sY, width: w, height: h - sY, background: suelo }} />
      {children}
      {titulo && <div style={{ position: "absolute", left: 0, top: 0, width: w, textAlign: "center", whiteSpace: "nowrap" }}><span style={{ display: "inline-block", marginTop: 18, padding: "4px 26px", fontFamily, fontWeight: 700, fontSize: 50, color: "#fff", background: colorTitulo, border: "5px solid #1b1240", borderRadius: 14, transform: `scale(${ent(t, t0 + 0.15)})` }}>{titulo}</span></div>}
    </div>
  );
};

// etiqueta pegada arriba de un personaje dentro de la viñeta
export const Rotulo: React.FC<{ t: number; t0: number; x: number; y: number; text: string; color: string; tinta?: string; size?: number }> = ({ t, t0, x, y, text, color, tinta = "#fff", size = 40 }) =>
  t < t0 ? null : <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0)})`, whiteSpace: "nowrap", padding: "2px 18px", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, border: "5px solid #1b1240", borderRadius: 12 }}>{text}</div>;
