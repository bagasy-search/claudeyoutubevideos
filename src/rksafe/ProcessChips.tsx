// ProcessChips.tsx — proceso como chips numerados que entran izq→der, unidos por flecha brass.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, clamp01, PhotoBed, Keyring } from "./RayStage";

export const ProcessChips: React.FC<{
  steps?: { title: string }[];
  title?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "TWENTY MINUTES",
  title = "Bolt it down",
  steps = [
    { title: "Mark the holes" },
    { title: "Drill" },
    { title: "Four anchor bolts" },
    { title: "Tug test" },
  ],
  bed,
}) => {
  const frame = useCurrentFrame();
  const aK = enter(frame, 8);
  const aTitle = enter(frame - 4, 9);
  const list = steps && steps.length ? steps : [{ title: "" }];
  const startChips = 20;
  const perChip = 12;

  // avance de la flecha (línea) según cuántos chips ya entraron
  const arrowP = clamp01((frame - startChips) / (perChip * Math.max(1, list.length - 1) + 10));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.66} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          gap: 46,
        }}
      >
        {/* encabezado */}
        <div style={{ textAlign: "center" }}>
          {kicker ? (
            <div
              style={{
                opacity: aK,
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: 27,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: V.brass,
                textShadow: "0 3px 14px rgba(0,0,0,0.8)",
                marginBottom: 10,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              opacity: aTitle,
              transform: `translateY(${((1 - aTitle) * 12).toFixed(1)}px)`,
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: 78,
              lineHeight: 1.02,
              color: V.white,
              textShadow: "0 6px 30px rgba(0,0,0,0.92)",
            }}
          >
            {title}
          </div>
        </div>

        {/* fila de chips con la flecha detrás */}
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          {/* línea/flecha brass que se dibuja */}
          <svg
            width="100%"
            height="40"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", zIndex: 0 }}
          >
            <line
              x1="40"
              y1="20"
              x2="960"
              y2="20"
              stroke={rgba(V.brass, 0.85)}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="920"
              strokeDashoffset={920 * (1 - arrowP)}
            />
            <path
              d="M948 12 L968 20 L948 28"
              fill="none"
              stroke={rgba(V.brass, 0.85)}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={interpolate(arrowP, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          </svg>

          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 30, flexWrap: "nowrap", justifyContent: "center", width: "100%" }}>
            {list.map((s, i) => {
              const local = frame - (startChips + i * perChip);
              const a = enter(local, 9);
              const pop = interpolate(local, [0, 8, 14], [0.5, 1.08, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={i}
                  style={{
                    flex: "1 1 0",
                    maxWidth: 300,
                    opacity: a,
                    transform: `translateY(${((1 - a) * 22).toFixed(1)}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    padding: "28px 20px 26px",
                    background: rgba(V.ink0, 0.8),
                    borderRadius: 12,
                    border: `1.5px solid ${rgba(V.brass, 0.32)}`,
                    boxShadow: "0 12px 34px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* badge número */}
                  <div
                    style={{
                      transform: `scale(${pop.toFixed(3)})`,
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      background: V.brass,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 26px ${rgba(V.brass, 0.4)}, inset 0 2px 6px ${rgba(V.white, 0.25)}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F_DISPLAY,
                        fontWeight: 800,
                        fontSize: 40,
                        color: V.ink0,
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: 30,
                      lineHeight: 1.18,
                      color: V.white,
                      textAlign: "center",
                      textShadow: "0 3px 16px rgba(0,0,0,0.85)",
                    }}
                  >
                    {s.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", right: "5%", bottom: "7%", opacity: aTitle * 0.9 }}>
        <Keyring size={30} />
      </div>
    </AbsoluteFill>
  );
};
