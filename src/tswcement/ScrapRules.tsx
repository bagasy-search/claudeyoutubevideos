// ScrapRules.tsx — las reglas numeradas del bloque de seguridad, como una lista clavada en la
// pared del taller. Aparecen de a una, ancladas a la frase que las nombra.
// ⛔ Va en `overlays[]`, nunca como cue base: es un PANEL, no dibuja fondo completo.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Panel, Kick, V, F_DISPLAY, F_BODY } from "./ScrapStage";

export const ScrapRules: React.FC<{
  durationInFrames: number;
  kicker?: string;
  items: { n: string; t: string; d?: string }[];
  bed?: string;
}> = ({ durationInFrames, kicker = "SHOP RULES", items, bed }) => {
  const frame = useCurrentFrame();
  return (
    <Panel durationInFrames={durationInFrames} bed={bed} width={880}>
      <Kick>{kicker}</Kick>
      <div style={{ height: 22 }} />
      {items.map((it, i) => {
        const t0 = 12 + i * 13;
        const a = interpolate(frame, [t0, t0 + 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
        const dx = interpolate(frame, [t0, t0 + 11], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{ opacity: a, transform: `translateX(${dx.toFixed(2)}px)`, display: "flex", gap: 22, alignItems: "flex-start", marginBottom: i === items.length - 1 ? 0 : 24 }}>
            <div style={{
              minWidth: 54, height: 54, background: V.red, color: V.white,
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{it.n}</div>
            <div style={{ paddingTop: 1 }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, lineHeight: 1.06, color: V.white, letterSpacing: "0.005em" }}>{it.t}</div>
              {it.d ? <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 27, lineHeight: 1.3, color: V.bone, marginTop: 7 }}>{it.d}</div> : null}
            </div>
          </div>
        );
      })}
    </Panel>
  );
};

export default ScrapRules;
