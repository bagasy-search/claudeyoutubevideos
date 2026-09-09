// BigStat.tsx — UN número enorme que "pop-ea" al valor con un asentamiento mínimo.
// Marca Ray Kessler: negro + brass; ROJO sólo si tone="danger" (la alerta).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Keyring } from "./RayStage";

export const BigStat: React.FC<{
  value?: string;
  unit?: string;
  caption?: string;
  tone?: "brass" | "danger";
  bed?: string;
  durationInFrames?: number;
}> = ({
  value = "8–12",
  unit = "minutes",
  caption = "The average break-in is over this fast.",
  tone = "brass",
  bed,
}) => {
  const frame = useCurrentFrame();
  const color = tone === "danger" ? V.danger : V.brass;

  // pop + asentamiento: escala sube por encima de 1 y baja al reposo
  const pop = interpolate(frame, [0, 9, 18], [0.62, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const aNum = enter(frame, 7);
  const aCap = enter(frame - 12, 9);
  const glow = 0.34 + Math.sin(frame / 26) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.66} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 22,
            opacity: aNum,
            transform: `scale(${pop.toFixed(4)})`,
            transformOrigin: "center bottom",
          }}
        >
          <div
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 800,
              fontSize: 300,
              lineHeight: 0.86,
              color,
              letterSpacing: "-0.01em",
              textShadow: `0 0 90px ${rgba(color, glow)}, 0 0 34px ${rgba(color, glow * 0.9)}, 0 10px 40px rgba(0,0,0,0.92)`,
            }}
          >
            {value}
          </div>
          {unit ? (
            <div
              style={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: 78,
                lineHeight: 1,
                paddingBottom: 42,
                color: rgba(color, 0.92),
                textShadow: "0 6px 24px rgba(0,0,0,0.9)",
              }}
            >
              {unit}
            </div>
          ) : null}
        </div>

        {/* regla brass fina */}
        <div
          style={{
            marginTop: 30,
            width: interpolate(aCap, [0, 1], [0, 340]),
            height: 3,
            background: rgba(color, 0.9),
            borderRadius: 2,
            boxShadow: `0 0 18px ${rgba(color, 0.4)}`,
          }}
        />

        {caption ? (
          <div
            style={{
              marginTop: 26,
              opacity: aCap,
              transform: `translateY(${((1 - aCap) * 14).toFixed(1)}px)`,
              padding: "14px 30px",
              background: rgba(V.ink0, 0.72),
              borderRadius: 6,
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: F_BODY,
                fontWeight: 500,
                fontSize: 34,
                lineHeight: 1.28,
                color: V.white,
                textShadow: "0 3px 16px rgba(0,0,0,0.85)",
              }}
            >
              {caption}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>

      <div style={{ position: "absolute", right: "5%", bottom: "7%", opacity: aCap * 0.9 }}>
        <Keyring size={30} />
      </div>
    </AbsoluteFill>
  );
};
