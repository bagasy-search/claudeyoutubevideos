// Overlays del canal Rhonda (van ENCIMA de la toma, sin taparla): RhNameTag (cartel de nombre, sin apellido ni empresa) ·
// RhAsk (la pregunta para los comentarios, firmada por Rhonda)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RH, SERIF, LABEL, HAND } from "./RhTheme";
import { lin, pop, useOut } from "./RhParts";

export const RhNameTag: React.FC<{ name?: string; sub?: string }> = ({ name = "Rhonda", sub }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8); const p = pop(f, fps, 4); const w = lin(f, 12, 28);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 100, opacity: out * Math.min(1, p * 1.4), translate: `${(1 - p) * -80}px 0` }}>
        <div style={{ background: RH.white, padding: "16px 36px 14px", borderRadius: 12, borderLeft: `14px solid ${RH.blue}`, boxShadow: `0 14px 30px ${RH.shadow}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: RH.ink, lineHeight: 1 }}>{name}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: RH.blueDeep, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RhAsk: React.FC<{ q: string; sign?: string }> = ({ q, sign = "— Rhonda" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8); const p = pop(f, fps, 6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 90, top: 90, width: 760, opacity: out * Math.min(1, p * 1.3), scale: String(0.8 + 0.2 * p), rotate: "1.5deg" }}>
        <div style={{ background: RH.yellow, borderRadius: 26, padding: "34px 44px", boxShadow: `0 18px 40px ${RH.shadow}`, position: "relative" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 3, color: RH.ink, opacity: 0.75 }}>TELL ME IN THE COMMENTS</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: RH.ink, lineHeight: 1.08, marginTop: 8 }}>{q}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: RH.blueDeep, textAlign: "right", opacity: lin(f, 30, 44) }}>{sign}</div>
          <div style={{ position: "absolute", left: 80, bottom: -36, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `40px solid ${RH.yellow}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
