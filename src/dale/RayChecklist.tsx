// RayChecklist.tsx — checklist con casilla de latón que se "tilda" (el ✓ se dibuja trazándose).
// Uso: "the tells" (las señales) y el recap. Filas escalonadas top→bottom, ~14 frames de stagger.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, PhotoBed, rgba, enter, clamp01 } from "./RayStage";

export const RayChecklist: React.FC<{
  items?: { text: string }[];
  title?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  items = [
    { text: "Flatten the box, printing hidden" },
    { text: "Close the curtains on the prize" },
    { text: "Keep it quiet" },
  ],
  title = "Your house tells him",
  kicker = "BEFORE HE EVER KNOCKS",
  bed,
}) => {
  const frame = useCurrentFrame();
  const aHead = enter(frame, 10);
  const rule = clamp01(interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const ROW_STAGGER = 14;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8%" }}>
        {/* Header */}
        <div style={{ opacity: aHead, transform: `translateY(${((1 - aHead) * 14).toFixed(1)}px)`, marginBottom: 12 }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6, textTransform: "uppercase", color: V.brass, textShadow: "0 3px 14px rgba(0,0,0,0.85)" }}>
            {kicker}
          </div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 1.03, color: V.white, marginTop: 6, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)" }}>
            {title}
          </div>
        </div>
        {/* Regla brass que se dibuja */}
        <div style={{ height: 3, width: `${(rule * 46).toFixed(1)}%`, background: `linear-gradient(90deg, ${V.brass}, ${rgba(V.brass, 0.15)})`, borderRadius: 2, marginBottom: 30, boxShadow: `0 0 18px ${rgba(V.brass, 0.4)}` }} />
        {/* Filas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((it, i) => {
            const local = frame - (18 + i * ROW_STAGGER);
            const aRow = clamp01(interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
            // El ✓ se traza: dashoffset de 40 → 0
            const draw = clamp01(interpolate(local, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
            const dash = 40;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: aRow, transform: `translateX(${((1 - aRow) * -26).toFixed(1)}px)` }}>
                {/* Casilla de latón */}
                <div style={{ flex: "0 0 auto", width: 58, height: 58, borderRadius: 8, border: `3px solid ${V.brass}`, background: rgba(V.ink0, 0.66), boxShadow: `0 4px 16px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(V.brass, 0.25)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={40} height={40} viewBox="0 0 40 40">
                    <path d="M8 21 L17 30 L33 11" fill="none" stroke={V.brassSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)}
                      style={{ filter: `drop-shadow(0 0 6px ${rgba(V.brass, 0.5)})` }} />
                  </svg>
                </div>
                {/* Plato oscuro + texto */}
                <div style={{ flex: "1 1 auto", padding: "14px 26px", background: rgba(V.ink0, 0.6), borderLeft: `4px solid ${rgba(V.brass, 0.7)}`, borderRadius: 4, boxShadow: "0 5px 20px rgba(0,0,0,0.55)" }}>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 1.05, color: V.white, letterSpacing: "0.005em" }}>
                    {it.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
