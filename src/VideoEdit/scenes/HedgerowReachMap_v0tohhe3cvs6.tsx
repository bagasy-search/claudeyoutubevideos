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

type HedgerowReachMapProps = {
  durationInFrames: number;
  fieldImage: string;
  insectImages?: string[];
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const HedgerowReachMap_v0tohhe3cvs6: React.FC<
  HedgerowReachMapProps
> = ({durationInFrames, fieldImage, insectImages = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame: frame - 3,
    fps,
    config: {damping: 19, stiffness: 86, mass: 0.9},
  });
  const metricIn = spring({
    frame: frame - 30,
    fps,
    config: {damping: 18, stiffness: 108, mass: 0.78},
  });
  const caveatIn = spring({
    frame: frame - 57,
    fps,
    config: {damping: 20, stiffness: 96, mass: 0.82},
  });
  const line = interpolate(frame, [24, 58], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const backgroundScale = interpolate(
    frame,
    [0, Math.max(durationInFrames - 1, 1)],
    [1.035, 1.085],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const glint = interpolate(frame, [52, 76], [-120, 650], clamp);
  const glintOpacity = interpolate(frame, [51, 56, 70, 77], [0, 0.36, 0.28, 0], clamp);
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
        backgroundColor: "#152017",
        color: "#fff9e9",
        opacity: endFade,
      }}
    >
      <Media
        src={fieldImage}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${backgroundScale})`,
          filter: "saturate(.82) contrast(1.02) brightness(.68)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(10,17,11,.7), rgba(10,15,10,.12) 56%, rgba(10,14,9,.56)), linear-gradient(180deg, rgba(8,12,8,.18), rgba(8,11,8,.68))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 105,
          top: 66,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 22}px)`,
        }}
      >
        <div
          style={{
            color: "#dfc77e",
            font: "700 19px/1 Inter, Arial, sans-serif",
            letterSpacing: 5.2,
          }}
        >
          HABITAT BEFORE TREATMENT
        </div>
        <div
          style={{
            marginTop: 12,
            font: "700 62px/.98 Georgia, serif",
            letterSpacing: -2,
            textShadow: "0 6px 25px rgba(0,0,0,.42)",
          }}
        >
          BENEFICIAL-INSECT REACH
        </div>
      </div>

      <svg
        viewBox="0 0 1920 1080"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
      >
        <path
          d="M 245 620 C 545 570, 845 548, 1365 505"
          fill="none"
          stroke="rgba(255,238,178,.9)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="15 15"
          pathLength="1"
          strokeDashoffset={1 - line}
          style={{filter: "drop-shadow(0 2px 8px rgba(0,0,0,.42))"}}
        />
        <circle
          cx="245"
          cy="620"
          r="13"
          fill="rgba(227,193,103,.95)"
          opacity={line}
        />
        <circle
          cx="1365"
          cy="505"
          r="15"
          fill="rgba(255,244,202,.98)"
          opacity={line}
          style={{filter: "drop-shadow(0 0 16px rgba(255,229,135,.8))"}}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 143,
          top: 562,
          display: "flex",
          gap: 14,
          opacity: interpolate(frame, [12, 27], [0, 1], clamp),
        }}
      >
        {insectImages.slice(0, 2).map((src, index) => (
          <div
            key={src}
            style={{
              position: "relative",
              width: 110,
              height: 110,
              overflow: "hidden",
              borderRadius: "50%",
              border: "3px solid rgba(248,225,160,.78)",
              boxShadow: "0 16px 42px rgba(0,0,0,.42)",
              transform: `translateY(${index * 13}px)`,
              background: "#273122",
            }}
          >
            <Media
              src={src}
              style={{width: "100%", height: "100%", objectFit: "cover"}}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 365,
          width: 520,
          padding: "30px 34px 34px",
          overflow: "hidden",
          borderRadius: 34,
          opacity: metricIn,
          transform: `translateY(${(1 - metricIn) * 30}px) scale(${0.96 + metricIn * 0.04})`,
          background:
            "linear-gradient(145deg, rgba(255,250,232,.96), rgba(226,218,186,.9))",
          border: "1px solid rgba(255,244,205,.72)",
          boxShadow: "0 36px 90px rgba(0,0,0,.42)",
          color: "#252a1e",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: glint,
            top: -90,
            width: 90,
            height: 560,
            opacity: glintOpacity,
            transform: "rotate(18deg)",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)",
          }}
        />
        <div
          style={{
            color: "#6d7f47",
            font: "800 21px/1 Inter, Arial, sans-serif",
            letterSpacing: 3,
          }}
        >
          DETECTED
        </div>
        <div
          style={{
            marginTop: 6,
            font: "700 76px/.95 Georgia, serif",
            letterSpacing: -3,
          }}
        >
          100 m
        </div>
        <div
          style={{
            marginTop: 11,
            font: "650 27px/1.2 Inter, Arial, sans-serif",
            color: "#4b5439",
          }}
        >
          INTO WORKING FIELDS
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1120,
          top: 696,
          width: 650,
          padding: "25px 30px",
          borderRadius: 27,
          opacity: caveatIn,
          transform: `translateY(${(1 - caveatIn) * 24}px)`,
          color: "#fff6df",
          background: "rgba(48,47,31,.88)",
          border: "1px solid rgba(217,188,113,.34)",
          boxShadow: "0 20px 55px rgba(0,0,0,.34)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            font: "750 25px/1.18 Inter, Arial, sans-serif",
            letterSpacing: 0.4,
          }}
        >
          HABITAT SUPPORT ≠ PROVEN PEST CONTROL
        </div>
        <div
          style={{
            marginTop: 14,
            color: "#dccb9e",
            font: "650 19px/1 Inter, Arial, sans-serif",
            letterSpacing: 2,
          }}
        >
          LOCAL • NON-INVASIVE • STAGGERED BLOOM
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HedgerowReachMap: React.FC<HedgerowReachMapProps> =
  HedgerowReachMap_v0tohhe3cvs6;
