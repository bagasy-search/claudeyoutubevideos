// CheckCard.tsx — tarjeta "buy the right thing": 3 atributos positivos con badge ✓ verde (V.ok).
// Más cálida/positiva que RayChecklist. Pills en columna, brass rule bajo el título.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, PhotoBed, rgba, enter, clamp01 } from "./RayStage";

export const CheckCard: React.FC<{
  items?: { text: string }[];
  title?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  items = [{ text: "Fire-rated" }, { text: "Bolted down" }, { text: "A boring room" }],
  title = "Fire-rated. Bolted. Boring.",
  kicker = "THE SAFE ITSELF",
  bed,
}) => {
  const frame = useCurrentFrame();
  const aHead = enter(frame, 10);
  const rule = clamp01(interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const PILL_STAGGER = 12;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 9%" }}>
        {/* Header */}
        <div style={{ opacity: aHead, transform: `translateY(${((1 - aHead) * 14).toFixed(1)}px)` }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6, textTransform: "uppercase", color: V.brass, textShadow: "0 3px 14px rgba(0,0,0,0.85)" }}>
            {kicker}
          </div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 1.03, color: V.white, marginTop: 6, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)" }}>
            {title}
          </div>
        </div>
        {/* Brass rule bajo el título */}
        <div style={{ height: 3, width: `${(rule * 40).toFixed(1)}%`, background: `linear-gradient(90deg, ${V.brass}, ${rgba(V.brass, 0.15)})`, borderRadius: 2, margin: "18px 0 30px", boxShadow: `0 0 18px ${rgba(V.brass, 0.4)}` }} />
        {/* Pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((it, i) => {
            const local = frame - (18 + i * PILL_STAGGER);
            // pop-in: escala con overshoot suave
            const pop = clamp01(interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)) }));
            const badge = clamp01(interpolate(local, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) }));
            const draw = clamp01(interpolate(local, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
            const dash = 34;
            return (
              <div key={i} style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 20, padding: "14px 30px 14px 18px", background: rgba(V.ink1, 0.82), border: `1px solid ${rgba(V.brass, 0.32)}`, borderRadius: 999, boxShadow: "0 6px 22px rgba(0,0,0,0.5)", opacity: pop, transform: `scale(${(0.86 + pop * 0.14).toFixed(3)}) translateY(${((1 - pop) * 14).toFixed(1)}px)` }}>
                {/* Badge verde ✓ */}
                <div style={{ flex: "0 0 auto", width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${rgba(V.ok, 0.95)}, ${rgba(V.ok, 0.7)})`, boxShadow: `0 0 20px ${rgba(V.ok, 0.5)}, inset 0 0 0 2px ${rgba("#FFFFFF", 0.18)}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${badge.toFixed(3)})` }}>
                  <svg width={34} height={34} viewBox="0 0 34 34">
                    <path d="M7 18 L14 25 L27 9" fill="none" stroke={V.white} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
                  </svg>
                </div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, lineHeight: 1.02, color: V.white, letterSpacing: "0.005em", paddingBottom: 2 }}>
                  {it.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
