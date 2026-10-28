// v6a · vuelta 6 de lc02 (P19, P32, P56, P59, P79): piezas nuevas (sólo las usan lc02_planos1 / lc02_planos2).
// - RecuerdoV6: tratamiento del recuerdo SIN velo plano encima (el velo color crema lavaba el cuadro de P19): la escena
//   va con filtro de saturación/contraste, un tinte cálido por MULTIPLY (oscurece y calienta, no blanquea) y viñeta.
// - GloboV6: globo de diálogo OPACO que entra con resorte (escala 0→1, opacidad plena desde el primer cuadro) y sale
//   encogiéndose en `sale` cuadros (nunca un fundido gris translúcido).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_GLOBO } from "../../anikit/pantalla";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------------------------------------------------------------------------------------------------------------
export const RecuerdoV6: React.FC<{ children: React.ReactNode; tinte?: string }> = ({ children, tinte = "#ffd9a6" }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: "saturate(1.35) contrast(1.12) brightness(0.98)" }}>{children}</AbsoluteFill>
    <AbsoluteFill style={{ background: tinte, mixBlendMode: "multiply", opacity: 0.55 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,12,6,0.42) 100%)" }} />
    <AbsoluteFill style={{ border: "22px solid rgba(20,14,10,0.6)" }} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------
// globo opaco con pop: (x, y) = centro del borde de ABAJO de la caja (la cola sale hacia abajo, en colaX relativo)
export const GloboV6: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; sale?: number; colaX?: number }> = ({ texto, x, y, desde, hasta = 1e9, tam = 60, sale = 6, colaX = 0.3 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f >= hasta + sale) return null;
  const sIn = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 160, mass: 0.8 } });
  const sOut = interpolate(f, [hasta, hasta + sale], [1, 0], { ...cl, easing: Easing.in(Easing.cubic) });
  const s = sIn * sOut;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: `${colaX * 100}% 120%` }}>
      <div style={{ position: "relative", background: "#fbf8f1", color: "#221c18", fontFamily: F_GLOBO, fontSize: tam, padding: `${tam * 0.18}px ${tam * 0.5}px ${tam * 0.22}px`, borderRadius: 26, border: "4px solid #221c18", whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        {texto}
        <svg width={90} height={46} style={{ position: "absolute", left: `calc(${colaX * 100}% - 44px)`, top: "100%", marginTop: -4, overflow: "visible" }}>
          <path d="M30,0 L44,30 L60,0 Z" fill="#fbf8f1" stroke="#221c18" strokeWidth={4} strokeLinejoin="round" />
          <rect x={27} y={-5} width={36} height={7} fill="#fbf8f1" />
        </svg>
      </div>
    </div>
  );
};
