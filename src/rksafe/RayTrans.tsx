// RayTrans.tsx — TRANSICIÓN DE ENTRADA con movimiento para un plano de la capa base (camino rksafe).
// El build arranca el plano `f` cuadros ANTES (solapado sobre el anterior, que sigue debajo) y este
// envoltorio lo revela con un EMPUJE, una MÁSCARA de barrido, un IRIS o un ZOOM de impacto.
// Sólo fotos y componentes: un clip no se adelanta (pediría cuadros que su archivo no tiene) y una
// ventana de avatar no se mueve (su audio está cortado al ms).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, rgba } from "./RayStage";

export type TransKind = "push" | "wipe" | "iris" | "zoom";

export const RayTrans: React.FC<{ kind: TransKind; f?: number; dir?: number; children: React.ReactNode }> = ({
  kind, f = 8, dir = 1, children,
}) => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [0, f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.6, 0, 0.2, 1) });
  if (k >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  let style: React.CSSProperties = {};
  if (kind === "push") style = { transform: `translateX(${((1 - k) * 100 * dir).toFixed(2)}%)`, boxShadow: `${-dir * 30}px 0 60px ${rgba(V.ink0, 0.8)}` };
  if (kind === "wipe") style = { clipPath: dir > 0 ? `inset(0 ${((1 - k) * 100).toFixed(2)}% 0 0)` : `inset(0 0 0 ${((1 - k) * 100).toFixed(2)}%)` };
  if (kind === "iris") style = { clipPath: `circle(${(k * 80).toFixed(2)}% at 50% 50%)` };
  if (kind === "zoom") style = { transform: `scale(${(1.18 - 0.18 * k).toFixed(4)})`, opacity: k };
  return (
    <AbsoluteFill style={style}>
      {children}
      {kind === "wipe" ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 6, background: V.brass, boxShadow: `0 0 24px ${rgba(V.brass, 0.8)}`,
          ...(dir > 0 ? { left: `${(k * 100).toFixed(2)}%` } : { right: `${(k * 100).toFixed(2)}%` }) }} />
      ) : null}
    </AbsoluteFill>
  );
};
