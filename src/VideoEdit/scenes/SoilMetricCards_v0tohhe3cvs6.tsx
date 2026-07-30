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

type SoilMetricCardsProps = {
  durationInFrames: number;
  image: string;
};

type Metric = {
  value: number;
  direction: "LESS" | "MORE";
  label: string;
  kicker: string;
  accent: string;
  imagePosition: string;
};

const METRICS: Metric[] = [
  {
    value: 8,
    direction: "LESS",
    label: "root resistance",
    kicker: "ROOT PENETRATION",
    accent: "#d49a43",
    imagePosition: "46% 66%",
  },
  {
    value: 16,
    direction: "MORE",
    label: "nutrient-holding capacity",
    kicker: "NUTRIENT RETENTION",
    accent: "#809e63",
    imagePosition: "62% 42%",
  },
  {
    value: 157,
    direction: "MORE",
    label: "extractable organic carbon",
    kicker: "SOIL CARBON",
    accent: "#c9ad72",
    imagePosition: "32% 58%",
  },
  {
    value: 62,
    direction: "MORE",
    label: "microbial biomass",
    kicker: "LIVING SOIL",
    accent: "#9db57e",
    imagePosition: "72% 60%",
  },
];

const MetricCard: React.FC<{
  metric: Metric;
  index: number;
  image: string;
}> = ({metric, index, image}) => {
  const frame = useCurrentFrame();
  const delay = 12 + index * 8;
  const glint = interpolate(
    frame,
    [delay + 22, delay + 48],
    [-120, 700],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const glintOpacity = interpolate(
    frame,
    [delay + 21, delay + 27, delay + 41, delay + 49],
    [0, 0.16, 0.1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "relative",
        height: 252,
        borderRadius: 32,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        alignItems: "center",
        gap: 28,
        padding: "22px 34px 22px 22px",
        boxSizing: "border-box",
        color: "#213025",
        background:
          "linear-gradient(135deg, rgba(255,252,240,0.97) 0%, rgba(241,235,214,0.95) 100%)",
        border: "1px solid rgba(234,217,174,0.78)",
        boxShadow:
          "0 22px 55px rgba(14,24,17,0.28), inset 0 1px 0 rgba(255,255,255,0.92)",
        opacity: 1,
        transform: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 180,
          height: 204,
          borderRadius: 24,
          overflow: "hidden",
          background: "#2b392c",
          boxShadow:
            `0 12px 28px rgba(30,43,31,0.26), 0 0 0 3px ${metric.accent}44`,
        }}
      >
        <Media
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: metric.imagePosition,
            transform: "scale(1)",
            filter: "saturate(0.92) contrast(1.05) brightness(0.88)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, rgba(18,29,19,0.56) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            width: 42,
            height: 4,
            borderRadius: 99,
            background: metric.accent,
            boxShadow: `0 0 13px ${metric.accent}99`,
          }}
        />
      </div>

      <div style={{minWidth: 0}}>
        <div
          style={{
            fontFamily:
              '"Avenir Next", "Segoe UI", Arial, sans-serif',
            fontSize: 17,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 3.1,
            color: "#68735d",
            marginBottom: 16,
          }}
        >
          {metric.kicker}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 13,
            whiteSpace: "nowrap",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontFamily:
                '"Avenir Next", "Segoe UI", Arial, sans-serif',
              fontSize: 86,
              lineHeight: 0.88,
              fontWeight: 820,
              letterSpacing: -4,
              color: "#26392b",
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 2px 0 rgba(255,255,255,0.75)",
            }}
          >
              {metric.value}%
          </div>
          <div
            style={{
              fontFamily:
                '"Avenir Next", "Segoe UI", Arial, sans-serif',
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 2.6,
              color: metric.accent,
            }}
          >
            {metric.direction}
          </div>
        </div>

        <div
          style={{
            maxWidth: 440,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 31,
            lineHeight: 1.08,
            fontWeight: 700,
            color: "#354137",
          }}
        >
          {metric.label}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: -80,
          bottom: -80,
          left: glint,
          width: 82,
          transform: "rotate(17deg)",
          opacity: glintOpacity,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.46), transparent)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

export const SoilMetricCards_v0tohhe3cvs6: React.FC<
  SoilMetricCardsProps
> = ({durationInFrames, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({
    frame: frame - 3,
    fps,
    config: {damping: 18, stiffness: 90, mass: 0.9},
  });
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), durationInFrames - 1],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const backgroundScale = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1.045, 1.085],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#172119",
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
          transform: `scale(${backgroundScale})`,
          filter: "blur(12px) brightness(0.38) saturate(0.78)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(89,111,71,0.13), rgba(10,18,12,0.58) 72%), linear-gradient(180deg, rgba(12,20,14,0.26), rgba(12,18,13,0.76))",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.45,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "58px 150px 64px",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Avenir Next", "Segoe UI", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 35,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * -20}px)`,
          }}
        >
          <div>
            <div
              style={{
                color: "#d7be86",
                fontSize: 17,
                fontWeight: 850,
                letterSpacing: 5.2,
                marginBottom: 12,
              }}
            >
              WHAT THE SOIL TEST REVEALED
            </div>
            <div
              style={{
                color: "#fff9e9",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 54,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: -1.4,
                textShadow: "0 5px 24px rgba(0,0,0,0.3)",
              }}
            >
              Healthier soil, measured four ways
            </div>
          </div>
          <div
            style={{
              width: 116,
              height: 2,
              marginBottom: 11,
              background:
                "linear-gradient(90deg, rgba(215,190,134,0), #d7be86)",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "252px 252px",
            gap: 24,
          }}
        >
          {METRICS.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              image={image}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "rgba(255,249,233,0.78)",
            fontSize: 18,
            fontWeight: 650,
            letterSpacing: 0.6,
            opacity: interpolate(frame, [45, 62], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              display: "block",
              width: 7,
              height: 7,
              borderRadius: 99,
              background: "#d7be86",
              boxShadow: "0 0 12px rgba(215,190,134,0.75)",
            }}
          />
          The advantage is biological—not industrial.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SoilMetricCards: React.FC<SoilMetricCardsProps> =
  SoilMetricCards_v0tohhe3cvs6;
