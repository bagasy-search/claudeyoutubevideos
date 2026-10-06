// ScrapFlame.tsx — la lectura de la llama: AZUL = completa · NARANJA = falta aire.
// Es el único diagnóstico del aparato y el espectador lo va a usar parado frente al fuego,
// así que va grande, con las dos columnas enfrentadas y cero adorno.
// ⛔ Va en `overlays[]`. Panel lateral, no pantalla completa.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Panel, Kick, V, F_DISPLAY, F_BODY } from "./ScrapStage";

const Side: React.FC<{ tone: string; label: string; verdict: string; lines: string[]; frame: number; off: number }> = ({ tone, label, verdict, lines, frame, off }) => {
  const a = interpolate(frame, [off, off + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const dy = interpolate(frame, [off, off + 12], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ flex: 1, opacity: a, transform: `translateY(${dy.toFixed(2)}px)`, borderTop: `6px solid ${tone}`, paddingTop: 16 }}>
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: tone }}>{label}</div>
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: V.white, margin: "8px 0 13px" }}>{verdict}</div>
      {lines.map((s, i) => (
        <div key={i} style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 26, lineHeight: 1.3, color: V.bone, marginBottom: 8 }}>{s}</div>
      ))}
    </div>
  );
};

export const ScrapFlame: React.FC<{
  durationInFrames: number;
  kicker?: string;
  // ⛔ UNA prop por línea: `check_props.mjs` parte la firma por ";" y con varias props en la
  //    misma línea reporta "forma equivocada" sobre props que están perfectas.
  goodLabel?: string;
  goodVerdict: string;
  good: string[];
  badLabel?: string;
  badVerdict: string;
  bad: string[];
  bed?: string;
}> = ({ durationInFrames, kicker = "READ THE FLAME", goodLabel = "BLUE", goodVerdict, good, badLabel = "ORANGE", badVerdict, bad, bed }) => {
  const frame = useCurrentFrame();
  return (
    <Panel durationInFrames={durationInFrames} bed={bed} width={980}>
      <Kick>{kicker}</Kick>
      <div style={{ height: 24 }} />
      <div style={{ display: "flex", gap: 42 }}>
        <Side tone={V.flame} label={goodLabel} verdict={goodVerdict} lines={good} frame={frame} off={12} />
        <Side tone={V.warn} label={badLabel} verdict={badVerdict} lines={bad} frame={frame} off={26} />
      </div>
    </Panel>
  );
};

export default ScrapFlame;
