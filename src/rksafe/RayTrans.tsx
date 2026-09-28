// RayTrans.tsx — TRANSICIONES CON MOVIMIENTO entre planos de la capa base (canal Ray Kessler).
//
// El build (scripts/rksafe_build.mjs, con `TRANSICIONES = true` en el cfg) alarga cada plano base `ov`
// cuadros POR DEBAJO del siguiente, y el siguiente ENTRA encima con uno de estos movimientos:
//   · "push"  — el plano nuevo empuja al anterior (entra por la derecha, el viejo sale por la izquierda)
//   · "wipe"  — máscara que barre de derecha a izquierda con un filo de latón
//   · "iris"  — máscara circular que se abre desde el centro de interés
//   · "zoom"  — el nuevo entra desde un 18 % más grande (punch-in) mientras aparece
//   · "cut"   — corte seco (la mayoría: un video con transición en cada plano es una plantilla)
// ⛔ NO se corre ningún tiempo: el plano nuevo sigue arrancando en su cuadro exacto (la sincro de la
//    voz y de las ventanas de avatar no se toca); sólo se agrega el solape por debajo.
// ⛔ Sin fundidos a negro: el fondo en modo ventanas es NEGRO y un fundido lo muestra.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { V } from "./RayStage";

export type TransKind = "push" | "wipe" | "iris" | "zoom" | "cut";

export const RayTrans: React.FC<{
  inKind?: TransKind;
  outKind?: TransKind;
  d: number;          // duración PROPIA del plano (sin el solape)
  ov?: number;        // cuadros de solape por debajo del siguiente
  children: React.ReactNode;
}> = ({ inKind = "cut", outKind = "cut", d, ov = 10, children }) => {
  const f = useCurrentFrame();
  const e = Easing.bezier(0.6, 0, 0.2, 1);
  const pin = interpolate(f, [0, ov], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const pout = interpolate(f, [d, d + ov], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  let style: React.CSSProperties = {};
  let filo: React.ReactNode = null;
  if (f < ov && inKind !== "cut") {
    if (inKind === "push") style = { transform: `translateX(${((1 - pin) * 100).toFixed(2)}%)` };
    else if (inKind === "wipe") {
      style = { clipPath: `inset(0 0 0 ${((1 - pin) * 100).toFixed(2)}%)` };
      filo = <div style={{ position: "absolute", top: 0, bottom: 0, left: `${((1 - pin) * 100).toFixed(2)}%`, width: 6, marginLeft: -3, background: V.brass, boxShadow: `0 0 24px ${V.brass}` }} />;
    } else if (inKind === "iris") style = { clipPath: `circle(${(pin * 78).toFixed(2)}% at 50% 46%)` };
    else if (inKind === "zoom") style = { transform: `scale(${(1.18 - 0.18 * pin).toFixed(4)})`, opacity: Math.min(1, pin * 1.6) };
  } else if (f >= d && outKind === "push") {
    style = { transform: `translateX(${(-pout * 100).toFixed(2)}%)` };
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {filo}
    </AbsoluteFill>
  );
};
