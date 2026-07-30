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

type MeasuredDecisionLoopProps = {
  durationInFrames: number;
  image: string;
};

const STEPS = ["OBSERVE", "IDENTIFY", "COUNT", "COMPARE", "ACT", "CHECK AGAIN"];
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const MeasuredDecisionLoop_v0tohhe3cvs6: React.FC<
  MeasuredDecisionLoopProps
> = ({durationInFrames, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 84, mass: 0.9},
  });
  const photoScale = interpolate(
    frame,
    [0, Math.max(durationInFrames - 1, 1)],
    [1.02, 1.075],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const trace = interpolate(frame, [15, 88], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#1b1d15",
        color: "#fff9e9",
        opacity: endFade,
      }}
    >
      <Media
        src={image}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${photoScale})`,
          filter: "brightness(.48) saturate(.7) blur(3px)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(83,84,55,.06), rgba(12,13,10,.78) 78%), linear-gradient(90deg, rgba(13,14,11,.74), rgba(13,14,10,.24), rgba(13,14,10,.74))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 110,
          top: 64,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 20}px)`,
        }}
      >
        <div
          style={{
            color: "#dcc37e",
            font: "700 19px/1 Inter, Arial, sans-serif",
            letterSpacing: 5,
          }}
        >
          THE BRILLIANCE IS THE LOOP
        </div>
        <div
          style={{
            marginTop: 12,
            font: "700 66px/.98 Georgia, serif",
            letterSpacing: -2.2,
            textShadow: "0 5px 24px rgba(0,0,0,.42)",
          }}
        >
          THE DECISION BEFORE THE TOOL
        </div>
      </div>

      <svg
        viewBox="0 0 1920 1080"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
      >
        <path
          d="M 550 620 C 560 390, 780 285, 1010 330 C 1260 380, 1390 585, 1285 790 C 1180 980, 850 970, 645 805 C 585 755, 552 690, 550 620"
          fill="none"
          stroke="rgba(226,194,111,.82)"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - trace}
          style={{filter: "drop-shadow(0 3px 12px rgba(0,0,0,.42))"}}
        />
      </svg>

      {STEPS.map((step, index) => {
        const angle = (-132 + index * 60) * (Math.PI / 180);
        const x = 960 + Math.cos(angle) * 400;
        const y = 640 + Math.sin(angle) * 285;
        const delay = 15 + index * 11;
        const entrance = spring({
          frame: frame - delay,
          fps,
          config: {damping: 17, stiffness: 118, mass: 0.72},
        });
        const active = interpolate(
          frame,
          [delay, delay + 7, delay + 20, delay + 29],
          [0, 1, 1, 0.42],
          clamp,
        );
        return (
          <div
            key={step}
            style={{
              position: "absolute",
              left: x - 128,
              top: y - 43,
              width: 256,
              height: 86,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 26,
              opacity: entrance,
              transform: `scale(${0.88 + entrance * 0.12}) translateY(${(1 - entrance) * 14}px)`,
              background:
                "linear-gradient(145deg, rgba(255,250,232,.94), rgba(223,214,185,.9))",
              border: `1px solid rgba(244,219,157,${0.34 + active * 0.45})`,
              boxShadow: `0 22px 52px rgba(0,0,0,.36), 0 0 ${22 * active}px rgba(214,180,92,.22)`,
              color: "#293022",
              font: "800 20px/1 Inter, Arial, sans-serif",
              letterSpacing: 1.8,
            }}
          >
            <span
              style={{
                marginRight: 12,
                color: "#9b7830",
                fontSize: 17,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 538,
          width: 440,
          padding: "26px 32px",
          borderRadius: 31,
          textAlign: "center",
          opacity: interpolate(frame, [66, 82], [0, 1], clamp),
          transform: "translateX(-50%)",
          background: "rgba(37,41,29,.9)",
          border: "1px solid rgba(228,197,118,.34)",
          boxShadow: "0 26px 60px rgba(0,0,0,.4)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            color: "#f3e3b7",
            font: "700 25px/1.18 Georgia, serif",
            letterSpacing: 0.7,
          }}
        >
          MEASURE BEFORE YOU BUY
        </div>
        <div
          style={{
            marginTop: 11,
            color: "#c9c1a9",
            font: "500 18px/1.3 Inter, Arial, sans-serif",
          }}
        >
          The final step returns to the first.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MeasuredDecisionLoop: React.FC<MeasuredDecisionLoopProps> =
  MeasuredDecisionLoop_v0tohhe3cvs6;
