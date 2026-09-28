// RayEntrance.tsx — ENTRADA con movimiento de un plano sobre el anterior (canal Ray Kessler).
//
// El build (scripts/rksafe_build.mjs, con `cfg.TRANSICIONES`) sortea para cada plano de la capa base
// una entrada; el plano ANTERIOR se estira `tail` cuadros por DEBAJO, así la entrada nunca descubre
// el fondo negro.
//   slide — entra deslizando desde la derecha (empuje), con una línea de latón en el borde
//   wipe  — máscara diagonal que barre de izquierda a derecha, borde de latón
//   zoom  — entra desde 1,14x con fundido corto (punch-in)
//   iris  — círculo que se abre desde el centro de interés
//   cut   — corte seco (la mayoría: un corte bien puesto no necesita adorno)
// ⛔ Nunca sólo fundidos (brief rkcard §5). ⛔ La ventana de avatar ENTRANTE sólo admite cut/wipe/iris:
//    no se escala ni se desplaza la cara (se nota y marea).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { V } from "./RayStage";

export type Entrada = "cut" | "slide" | "wipe" | "zoom" | "iris";

export const RayEntrance: React.FC<{ kind?: Entrada; frames?: number; children: React.ReactNode }> = ({ kind = "cut", frames = 9, children }) => {
  const f = useCurrentFrame();
  if (kind === "cut" || f >= frames) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(f, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  if (kind === "slide") {
    const x = (1 - p) * 100;
    return (
      <AbsoluteFill style={{ transform: `translateX(${x.toFixed(2)}%)` }}>
        {children}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: V.brass, opacity: 1 - p }} />
      </AbsoluteFill>
    );
  }
  if (kind === "wipe") {
    // diagonal: el borde va de -20 % a 120 % (a lo ancho), inclinado
    const e = -20 + p * 140;
    const poly = `polygon(0% 0%, ${e + 10}% 0%, ${e - 10}% 100%, 0% 100%)`;
    return (
      <AbsoluteFill style={{ clipPath: poly, WebkitClipPath: poly }}>
        {children}
      </AbsoluteFill>
    );
  }
  if (kind === "zoom") {
    const s = 1.14 - 0.14 * p;
    return <AbsoluteFill style={{ transform: `scale(${s.toFixed(4)})`, opacity: Math.min(1, p * 1.6) }}>{children}</AbsoluteFill>;
  }
  // iris
  const r = p * 80;
  const c = `circle(${r.toFixed(2)}% at 50% 45%)`;
  return <AbsoluteFill style={{ clipPath: c, WebkitClipPath: c }}>{children}</AbsoluteFill>;
};
