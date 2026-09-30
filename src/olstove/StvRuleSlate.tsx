// StvRuleSlate — tarjeta de regla a pantalla completa con FONDO VIVO (foto/clip de la cabaña con Ken-Burns y velo cálido) y una placa de papel
// kraft grande: número gigante, título en serif de 100 px y una línea de apoyo. Reemplaza las tarjetas planas sobre crema lisa.
// Props: n, title, sub?, bed (foto o mp4), ruleWord. Sin texto quemado.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, kraftBg, hexA } from "./OleTheme";
import { OleBed } from "./OleBookPage";

const c01 = (x: number) => Math.max(0, Math.min(1, x));

export const StvRuleSlate: React.FC<{ n: number | string; title: string; sub?: string; bed: string; ruleWord?: string }> = ({ n, title, sub, bed, ruleWord = "SAFETY" }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame: f - 3, fps, config: { damping: 14, mass: 0.8 } });
  const out = interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ul = c01((f - 10) / 16);
  const rot = -2.2 + (1 - inS) * 6;
  return (
    <AbsoluteFill style={{ opacity: 0.4 + 0.6 * out }}>
      <OleBed src={bed} veil={0.35} veilColor={OLE.forest2} push={0.08} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 50%, rgba(20,12,6,0.10), rgba(20,12,6,0.55))" }} />
      <div style={{ position: "absolute", left: 130, top: 250, width: 1240, height: 560, transform: `translateX(${(1 - inS) * -420}px) rotate(${rot}deg)`, ...kraftBg(OLE.kraftL), boxShadow: "0 30px 70px rgba(10,6,2,0.65)", borderRadius: 6 }}>
        <div style={{ position: "absolute", left: -40, top: 18, width: 190, height: 50, background: "rgba(233,217,184,0.85)", transform: "rotate(-28deg)", clipPath: "polygon(3% 8%, 97% 0, 100% 90%, 1% 100%)" }} />
        <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontSize: 46, letterSpacing: 10, color: OLE.plaid }}>{ruleWord}</div>
        <div style={{ position: "absolute", left: 50, top: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 420, lineHeight: "420px", color: OLE.fire, fontVariantNumeric: "lining-nums", textShadow: "6px 6px 0 rgba(120,60,20,0.25)" }}>{n}</div>
        <div style={{ position: "absolute", left: 400, top: 110, right: 50, fontFamily: SERIF, fontWeight: 900, fontSize: title.length > 14 ? 86 : 104, lineHeight: title.length > 14 ? "94px" : "112px", color: OLE.forest }}>{title}</div>
        <div style={{ position: "absolute", left: 400, top: 380, width: 720 * ul, height: 8, background: OLE.fire, borderRadius: 4 }} />
        {sub ? <div style={{ position: "absolute", left: 400, top: 412, right: 50, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: OLE.pencil, opacity: c01((f - 16) / 12) }}>{sub}</div> : null}
      </div>
      <div style={{ position: "absolute", right: 90, bottom: 70, fontFamily: LABEL, fontSize: 30, letterSpacing: 8, color: hexA(OLE.cream, 0.85) }}>OLE'S CAMP KITCHEN</div>
    </AbsoluteFill>
  );
};
export default StvRuleSlate;
