// ScrapParts.tsx — la lista de materiales partida en dos columnas: lo que se junta de la chatarra
// y lo poco que se paga. Es el único momento del video donde una lista en pantalla gana contra
// un plano crudo, porque el espectador quiere ANOTARLA.
// ⛔ Va en `overlays[]`. Panel lateral: el plano de abajo sigue vivo a la derecha.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Panel, Kick, V, F_DISPLAY, F_BODY } from "./ScrapStage";

const Col: React.FC<{ title: string; color: string; items: string[]; frame: number; off: number }> = ({ title, color, items, frame, off }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 2.6, textTransform: "uppercase", color, borderBottom: `3px solid ${color}`, paddingBottom: 9, marginBottom: 16 }}>{title}</div>
    {items.map((s, i) => {
      const t0 = off + i * 9;
      const a = interpolate(frame, [t0, t0 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
      const dy = interpolate(frame, [t0, t0 + 10], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
      return (
        <div key={i} style={{ opacity: a, transform: `translateY(${dy.toFixed(2)}px)`, display: "flex", gap: 12, alignItems: "baseline", marginBottom: 11 }}>
          <div style={{ color, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, lineHeight: 1 }}>—</div>
          <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 28, lineHeight: 1.25, color: V.white }}>{s}</div>
        </div>
      );
    })}
  </div>
);

export const ScrapParts: React.FC<{
  durationInFrames: number;
  kicker?: string;
  freeTitle?: string;
  buyTitle?: string;
  free: string[];
  buy: string[];
  bed?: string;
}> = ({ durationInFrames, kicker = "THE BUILD LIST", freeTitle = "SCROUNGE IT", buyTitle = "BUY IT", free, buy, bed }) => {
  const frame = useCurrentFrame();
  return (
    <Panel durationInFrames={durationInFrames} bed={bed} width={950}>
      <Kick>{kicker}</Kick>
      <div style={{ height: 22 }} />
      <div style={{ display: "flex", gap: 44 }}>
        <Col title={freeTitle} color={V.concrete} items={free} frame={frame} off={12} />
        <Col title={buyTitle} color={V.red} items={buy} frame={frame} off={12 + free.length * 9} />
      </div>
    </Panel>
  );
};

export default ScrapParts;
