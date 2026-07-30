import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Media} from "../components/Media";

type Props = {
  durationInFrames: number;
  image: string;
  mode: "injection" | "boundary";
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const injection = [
  ["HIGH PRESSURE", "Pinhole leak"],
  ["THROUGH SKIN", "Never use a hand"],
  ["EMERGENCY", "Immediate medical care"],
] as const;

const boundary = [
  "Gas cylinders",
  "Brake systems",
  "Mains voltage",
  "Pressure vessels",
  "Missing guards",
  "High-pressure hydraulics",
  "Stored energy",
] as const;

export const SafetyBoundaryPanel_v0tohhe3cvs6: React.FC<Props> = ({
  durationInFrames,
  image,
  mode,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 86, mass: 0.9},
  });
  const exit = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  const camera = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1.02, 1.08],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const cards = mode === "injection" ? injection : boundary;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#17120f",
        color: "#fff8eb",
        opacity: exit,
        fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
      }}
    >
      <Media
        src={image}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${camera})`,
          filter: "saturate(.62) sepia(.14) brightness(.54) contrast(1.08)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(19,12,9,.95) 0%, rgba(20,13,10,.82) 47%, rgba(15,10,8,.5) 100%), radial-gradient(circle at 76% 45%, rgba(190,72,38,.2), transparent 38%)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "76px 88px 70px",
          display: "grid",
          gridTemplateColumns: mode === "injection" ? "0.9fr 1.1fr" : "0.72fr 1.28fr",
          alignItems: "center",
          gap: 58,
        }}
      >
        <div
          style={{
            opacity: intro,
            transform: `translateY(${(1 - intro) * 24}px)`,
          }}
        >
          <div
            style={{
              color: "#efaa78",
              fontSize: 20,
              fontWeight: 850,
              letterSpacing: 5.5,
              marginBottom: 22,
            }}
          >
            {mode === "injection" ? "HYDRAULIC WARNING" : "CALL A PROFESSIONAL"}
          </div>
          <div
            style={{
              width: 76,
              height: 5,
              borderRadius: 99,
              background: "#e36f3d",
              boxShadow: "0 0 24px rgba(227,111,61,.45)",
              marginBottom: 27,
            }}
          />
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: mode === "injection" ? 70 : 62,
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 650,
              textShadow: "0 10px 36px rgba(0,0,0,.45)",
            }}
          >
            {mode === "injection"
              ? "FLUID CAN PASS THROUGH SKIN"
              : "SEVEN REPAIRS CROSS THE LINE"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              mode === "injection" ? "1fr" : "repeat(2, minmax(0, 1fr))",
            gap: mode === "injection" ? 20 : 15,
          }}
        >
          {cards.map((card, index) => {
            const p = spring({
              frame: frame - 9 - index * 5,
              fps,
              config: {damping: 19, stiffness: 104, mass: 0.75},
            });
            const label = Array.isArray(card) ? card[0] : card;
            const note = Array.isArray(card) ? card[1] : null;
            return (
              <div
                key={label}
                style={{
                  minHeight: mode === "injection" ? 164 : 104,
                  padding: mode === "injection" ? "25px 30px" : "17px 22px",
                  borderRadius: mode === "injection" ? 31 : 23,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  opacity: p,
                  transform: `translateX(${(1 - p) * 35}px) scale(${0.96 + p * 0.04})`,
                  background:
                    "linear-gradient(145deg, rgba(56,31,24,.9), rgba(27,20,17,.82))",
                  border: "1px solid rgba(241,157,106,.42)",
                  boxShadow:
                    "0 22px 60px rgba(6,4,3,.34), inset 0 1px 0 rgba(255,255,255,.14)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <div
                  style={{
                    color: index === 2 && mode === "injection" ? "#ffd8b4" : "#efaa78",
                    fontSize: mode === "injection" ? 38 : 25,
                    lineHeight: 1,
                    fontWeight: 850,
                    letterSpacing: mode === "injection" ? 1.1 : 0.2,
                  }}
                >
                  {label}
                </div>
                {note ? (
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: 28,
                      color: "rgba(255,248,235,.8)",
                    }}
                  >
                    {note}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

