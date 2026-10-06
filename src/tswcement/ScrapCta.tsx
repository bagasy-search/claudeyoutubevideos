// ScrapCta.tsx — el cierre del canal. ⛔ ESTE CANAL NO TIENE EMBUDO NI GUÍA NI LANDING:
// el CTA es SUSCRIBIRSE + el próximo video + el comentario. No inventar una URL ni prometer
// un PDF que no existe (mina de `dale5`: el CTA heredado prometía capítulos inexistentes).
// ⛔ Va en `overlays[]`, NUNCA como cue base: como plano base queda solo sobre el fondo de
// marca y deja segundos de pantalla muerta (mina de `dale1`).
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Panel, Kick, V, F_DISPLAY, F_BODY } from "./ScrapStage";

export const ScrapCta: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  sub?: string;
  next?: string;
  bed?: string;
}> = ({ durationInFrames, kicker = "THE SCRAP WORKSHOP", title, sub, next, bed }) => {
  const frame = useCurrentFrame();
  const a1 = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const a2 = interpolate(frame, [22, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const pulse = 1 + Math.sin(frame / 21) * 0.014;
  return (
    <Panel durationInFrames={durationInFrames} bed={bed} width={900}>
      <Kick>{kicker}</Kick>
      <div style={{ height: 20 }} />
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 1.03, color: V.white, letterSpacing: "0.004em" }}>{title}</div>
      {sub ? <div style={{ opacity: a1, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: V.bone, marginTop: 16 }}>{sub}</div> : null}
      {next ? (
        <div style={{ opacity: a2, marginTop: 26, transform: `scale(${pulse.toFixed(4)})`, transformOrigin: "left center", display: "inline-block", background: V.red, padding: "13px 26px" }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 31, letterSpacing: 2.2, textTransform: "uppercase", color: V.white }}>{next}</div>
        </div>
      ) : null}
    </Panel>
  );
};

export default ScrapCta;
