// PullQuote.tsx — pull-quote cinematográfico. Cita grande centrada, gran comilla de latón detrás,
// subrayado brass que se traza, atribución chica. Holds largos: los beats emocionales.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, PhotoBed, rgba, enter, clamp01 } from "./RayStage";

export const PullQuote: React.FC<{
  quote?: string;
  attrib?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  quote = "You don't need a bunker. You need to think like the guy who's coming for you.",
  attrib = "— Ray",
  bed,
}) => {
  const frame = useCurrentFrame();
  const words = quote.split(" ");
  const aMark = enter(frame, 16);
  const rule = clamp01(interpolate(frame, [26, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const aAttrib = clamp01(interpolate(frame, [46, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.7} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12%" }}>
        {/* Gran comilla brass translúcida detrás */}
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: `translateX(-50%) scale(${(0.82 + aMark * 0.18).toFixed(3)})`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 340, lineHeight: 0.7, color: rgba(V.brass, 0.16), opacity: aMark, pointerEvents: "none", userSelect: "none" }}>
          &ldquo;
        </div>
        {/* Cita: los bloques de palabra suben/aparecen */}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 1360, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 8px rgba(0,0,0,0.9)" }}>
          {words.map((w, i) => {
            const local = frame - (6 + i * 3);
            const aw = clamp01(interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
            return (
              <span key={i} style={{ display: "inline-block", marginRight: "0.28em", opacity: aw, transform: `translateY(${((1 - aw) * 22).toFixed(1)}px)`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, lineHeight: 1.14, color: V.white, letterSpacing: "0.004em" }}>
                {w}
              </span>
            );
          })}
        </div>
        {/* Subrayado brass que se traza */}
        <div style={{ marginTop: 34, height: 4, width: `${(rule * 34).toFixed(1)}%`, background: `linear-gradient(90deg, ${rgba(V.brass, 0.1)}, ${V.brass} 40%, ${V.brassSoft} 60%, ${rgba(V.brass, 0.1)})`, borderRadius: 3, boxShadow: `0 0 22px ${rgba(V.brass, 0.5)}` }} />
        {/* Atribución */}
        <div style={{ marginTop: 24, opacity: aAttrib, transform: `translateY(${((1 - aAttrib) * 10).toFixed(1)}px)`, fontFamily: F_BODY, fontWeight: 600, fontSize: 34, letterSpacing: 2, color: V.brassSoft, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>
          {attrib}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
