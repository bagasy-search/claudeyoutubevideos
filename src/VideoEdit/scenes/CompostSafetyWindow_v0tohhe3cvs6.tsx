import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Media} from "../components/Media";

export type CompostSafetyWindowV0tohhe3cvs6Props = {
  durationInFrames: number;
  image: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const enter = (frame: number, at: number, duration = 24) =>
  interpolate(frame, [at, at + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const glassCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 34,
  border: "1px solid rgba(255,248,229,0.34)",
  background:
    "linear-gradient(145deg, rgba(52,45,32,0.84) 0%, rgba(28,28,21,0.78) 100%)",
  boxShadow:
    "0 28px 70px rgba(14,12,8,0.34), inset 0 1px 0 rgba(255,255,255,0.24)",
  backdropFilter: "blur(18px) saturate(0.86)",
};

export const CompostSafetyWindow_v0tohhe3cvs6: React.FC<
  CompostSafetyWindowV0tohhe3cvs6Props
> = ({durationInFrames, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exitAt = Math.max(0, durationInFrames - Math.round(fps * 0.45));
  const exit = interpolate(frame, [exitAt, durationInFrames], [1, 0], clamp);

  const titleP = enter(frame, 4, 26);
  const gaugeP = enter(frame, 15, 32);
  const daysP = enter(frame, 30, 28);
  const turnsP = enter(frame, 42, 28);
  const warningP = enter(frame, 72, 28);

  const cameraScale = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [1.035, 1.095],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const cameraX = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [-12, 12],
    clamp,
  );

  const gaugeValue = interpolate(gaugeP, [0, 1], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const gaugeNeedle = interpolate(gaugeValue, [0, 1], [-66, 66], clamp);

  const glintStart = Math.round(durationInFrames * 0.32);
  const glintEnd = glintStart + Math.round(fps * 0.72);
  const glintX = interpolate(
    frame,
    [glintStart, glintEnd],
    [-520, 760],
    clamp,
  );
  const glintOpacity = interpolate(
    frame,
    [glintStart, glintStart + 5, glintEnd - 5, glintEnd],
    [0, 0.34, 0.34, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#1b1a12",
        color: "#fff9e9",
        fontFamily: '"Inter", "Aptos", "Helvetica Neue", Arial, sans-serif',
        opacity: exit,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translateX(${cameraX}px) scale(${cameraScale})`,
        }}
      >
        <Media
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // The audited compost photograph is intentionally used as a
            // softened texture layer; the component graphics carry the data.
            transform: "scale(1.025)",
            filter:
              "blur(5px) saturate(0.78) sepia(0.13) contrast(1.04) brightness(0.82)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(19,19,12,0.82) 0%, rgba(27,25,16,0.46) 50%, rgba(12,13,9,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 82% at 56% 46%, rgba(149,116,58,0.08) 0%, rgba(8,9,6,0.52) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 104,
          top: 78,
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 18}px)`,
        }}
      >
        <div
          style={{
            width: 74,
            height: 5,
            borderRadius: 999,
            background: "#e7b55a",
            marginBottom: 21,
            boxShadow: "0 0 24px rgba(231,181,90,0.34)",
          }}
        />
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 62,
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: -1.5,
            textShadow: "0 4px 22px rgba(0,0,0,0.44)",
          }}
        >
          SAFE WINDROW
          <br />
          COMPOST
        </div>
      </div>

      <div
        style={{
          ...glassCard,
          position: "absolute",
          left: 104,
          top: 336,
          width: 790,
          height: 382,
          opacity: gaugeP,
          transform: `translateY(${(1 - gaugeP) * 26}px) scale(${0.975 + gaugeP * 0.025})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(78% 90% at 18% 0%, rgba(235,180,84,0.17), rgba(0,0,0,0) 66%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 48,
            top: 36,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 80,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#fff7df",
          }}
        >
          131–170°F
        </div>

        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            bottom: 62,
            height: 118,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 7,
              height: 22,
              borderRadius: 999,
              background: "rgba(255,255,255,0.13)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.34)",
            }}
          >
            <div
              style={{
                width: `${gaugeValue * 100}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #d99d43 0%, #f0c46c 53%, #d66f3d 100%)",
                boxShadow: "0 0 28px rgba(231,181,90,0.33)",
              }}
            />
          </div>

          {Array.from({length: 7}, (_, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${8 + index * 14}%`,
                bottom: 37,
                width: index === 0 || index === 6 ? 3 : 2,
                height: index === 0 || index === 6 ? 24 : 14,
                borderRadius: 999,
                background:
                  index === 0 || index === 6
                    ? "rgba(255,247,224,0.9)"
                    : "rgba(255,247,224,0.42)",
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 21,
              width: 5,
              height: 72,
              borderRadius: 999,
              background:
                "linear-gradient(180deg, #fff4d0 0%, rgba(231,181,90,0.25) 100%)",
              boxShadow: "0 0 18px rgba(255,235,184,0.36)",
              transformOrigin: "50% 100%",
              transform: `translateX(-50%) rotate(${gaugeNeedle}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -6,
                width: 15,
                height: 15,
                borderRadius: "50%",
                transform: "translateX(-50%)",
                background: "#fff4d0",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: -90,
            bottom: -90,
            left: 0,
            width: 160,
            opacity: glintOpacity,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,250,227,0.62) 48%, transparent 100%)",
            filter: "blur(14px)",
            transform: `translateX(${glintX}px) rotate(13deg)`,
          }}
        />
      </div>

      <div
        style={{
          ...glassCard,
          position: "absolute",
          left: 932,
          top: 336,
          width: 416,
          height: 176,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: daysP,
          transform: `translateX(${(1 - daysP) * 32}px)`,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -0.8,
          }}
        >
          15 DAYS
        </div>
      </div>

      <div
        style={{
          ...glassCard,
          position: "absolute",
          left: 932,
          top: 542,
          width: 730,
          height: 176,
          padding: "0 36px",
          display: "flex",
          alignItems: "center",
          gap: 34,
          opacity: turnsP,
          transform: `translateX(${(1 - turnsP) * 32}px)`,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 40,
            lineHeight: 1.05,
            fontWeight: 700,
          }}
        >
          TURN AT
          <br />
          LEAST 5×
        </div>
        <div style={{display: "flex", gap: 12}}>
          {Array.from({length: 5}, (_, index) => {
            const markerP = enter(frame, 54 + index * 10, 18);
            return (
              <div
                key={index}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,239,199,0.42)",
                  background:
                    "radial-gradient(circle at 35% 27%, rgba(255,244,212,0.23), rgba(220,161,66,0.12))",
                  color: "#f0c46c",
                  fontSize: 37,
                  lineHeight: 1,
                  opacity: markerP,
                  transform: `scale(${0.72 + markerP * 0.28}) rotate(${(1 - markerP) * -70}deg)`,
                  boxShadow:
                    markerP > 0.95
                      ? "inset 0 1px 0 rgba(255,255,255,0.18)"
                      : "none",
                }}
              >
                ↻
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 104,
          right: 258,
          bottom: 100,
          minHeight: 124,
          borderRadius: 30,
          borderLeft: "8px solid #e7b55a",
          background:
            "linear-gradient(90deg, rgba(21,21,15,0.92), rgba(39,35,24,0.83))",
          boxShadow:
            "0 24px 58px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.13)",
          display: "flex",
          alignItems: "center",
          padding: "0 46px",
          opacity: warningP,
          transform: `translateY(${(1 - warningP) * 22}px)`,
        }}
      >
        <div
          style={{
            fontSize: 38,
            lineHeight: 1.1,
            fontWeight: 760,
            letterSpacing: 1.6,
            color: "#fff4d8",
          }}
        >
          HEAT ALONE IS NOT PROOF
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CompostSafetyWindow: React.FC<
  CompostSafetyWindowV0tohhe3cvs6Props
> = CompostSafetyWindow_v0tohhe3cvs6;
