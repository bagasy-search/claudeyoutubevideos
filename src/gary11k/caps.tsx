// gary11k · la frase-remate de cada componente y la ficha "MISTAKE n" van en PANTALLA (no en el piso 3D: ahí se cortaban por cámara).
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, FONT } from "./hkit";
import { pop } from "./gk";

export const Cap: React.FC<{ tt: number; at: number; txt: string; col?: string; bg?: string; i?: number; until?: number }> = ({ tt, at, txt, col = "#0e1013", bg = "#ffd23a", i = 0, until }) => {
  const op = cl((tt - at + 0.1) / 0.2) * (until ? 1 - cl((tt - until + 0.1) / 0.15) : 1);
  if (op <= 0) return null;
  const s = pop(tt, at);
  return <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 + i * 92, pointerEvents: "none" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, letterSpacing: 1, textTransform: "uppercase", color: col, background: bg, padding: "12px 30px 10px",
      borderRadius: 8, transform: `rotate(-1.2deg) scale(${s})`, opacity: op, boxShadow: "0 10px 30px rgba(0,0,0,.45)", maxWidth: 1500, textAlign: "center" }}>{txt}</div>
  </AbsoluteFill>;
};

export const Mist: React.FC<{ tt: number; n: number }> = ({ tt, n }) => {
  const k = cl((tt - 0.3) / 0.25);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 70, top: 64, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#f7f1e3", background: "#8a2a20", padding: "10px 26px 8px",
      borderRadius: 8, transform: `translateX(${(1 - k) * -60}px)`, opacity: k, boxShadow: "0 10px 30px rgba(0,0,0,.45)", letterSpacing: 2 }}>MISTAKE {n}</div>
  </AbsoluteFill>;
};
