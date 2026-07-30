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
  mode: "parts" | "failures";
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const parts = [
  ["01", "Drive pipe"],
  ["02", "Waste valve"],
  ["03", "Check valve"],
  ["04", "Pressure chamber"],
] as const;
const failures = [
  ["FLOW", "Continuous water"],
  ["FALL", "Enough elevation"],
  ["VALVES", "Clean and tight"],
  ["PIPE", "Pressure rated"],
] as const;

export const RamPumpExplainer_v0tohhe3cvs6: React.FC<Props> = ({
  durationInFrames,
  image,
  mode,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 19, stiffness: 88, mass: 0.9},
  });
  const exit = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  const cameraX = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, -28],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const data = mode === "parts" ? parts : failures;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#101a18",
        color: "#f8f2df",
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
          objectPosition: "56% 52%",
          transform: `translateX(${cameraX}px) scale(1.075)`,
          filter: "saturate(.74) sepia(.08) contrast(1.05) brightness(.64)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(12,22,20,.96) 0%, rgba(12,22,20,.8) 47%, rgba(11,19,18,.32) 100%), radial-gradient(circle at 74% 72%, rgba(80,165,142,.22), transparent 36%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "72px 86px 66px",
          display: "grid",
          gridTemplateColumns: "0.75fr 1.25fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: intro,
            transform: `translateY(${(1 - intro) * 25}px)`,
          }}
        >
          <div
            style={{
              color: "#9fd6bf",
              fontSize: 20,
              fontWeight: 850,
              letterSpacing: 5.2,
              marginBottom: 22,
            }}
          >
            NEXT: HYDRAULIC RAM
          </div>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 66,
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: -2,
              textShadow: "0 9px 30px rgba(0,0,0,.44)",
            }}
          >
            {mode === "parts"
              ? "FOUR PARTS MOVE WATER UPHILL"
              : "FOUR CONDITIONS DECIDE IF IT WORKS"}
          </div>
          <div
            style={{
              marginTop: 28,
              color: "rgba(244,239,221,.72)",
              fontSize: 25,
              lineHeight: 1.25,
              maxWidth: 600,
            }}
          >
            {mode === "parts"
              ? "No electricity. Site geometry supplies the energy."
              : "Wrong pressure pipe can fail dangerously."}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 19,
          }}
        >
          {data.map(([value, label], index) => {
            const p = spring({
              frame: frame - 8 - index * 7,
              fps,
              config: {damping: 19, stiffness: 100, mass: 0.78},
            });
            return (
              <div
                key={value}
                style={{
                  minHeight: 185,
                  padding: "27px 29px",
                  borderRadius: 31,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px) scale(${0.95 + p * 0.05})`,
                  background:
                    "linear-gradient(145deg, rgba(27,51,45,.89), rgba(14,29,27,.8))",
                  border: "1px solid rgba(159,214,191,.38)",
                  boxShadow:
                    "0 24px 68px rgba(4,10,9,.38), inset 0 1px 0 rgba(255,255,255,.16)",
                  backdropFilter: "blur(17px)",
                }}
              >
                <div
                  style={{
                    color: "#9fd6bf",
                    fontSize: mode === "parts" ? 52 : 28,
                    lineHeight: 1,
                    fontWeight: 850,
                    letterSpacing: mode === "parts" ? -1.2 : 2.6,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    marginTop: 17,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 34,
                    lineHeight: 1.04,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

