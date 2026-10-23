// tdccalor3 · GANCHO en frío (antes de la locución): la toma LTX de las 3 de la mañana (ventana con escarcha → el fósforo en las manos).
// El audio nativo de la toma va en la mezcla (encfin), no acá.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COL, FONT, e } from "./lib";
import { Clip, World } from "./parts";

export const HOOK = 11.0;
export const Gancho: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const o = e(t, 0.8, 1.3) * (1 - e(t, 9.6, 10.4));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip k="g_gancho_s3" t={t} a={0} z={[1.0, 1.06]}><World t={0} /></Clip>
      {/* sello de hora tipo cámara casera, chiquito en la esquina */}
      <div style={{ position: "absolute", left: 70, bottom: 60, opacity: o * 0.9, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.ice2, letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
        3:02 AM · 4 °C
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: 1 - e(t, 0, 0.5) }} />
    </AbsoluteFill>
  );
};
