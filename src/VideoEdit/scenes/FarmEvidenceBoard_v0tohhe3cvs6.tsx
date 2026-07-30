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

export type FarmEvidenceItem_v0tohhe3cvs6 = {
  label: string;
  value?: string;
  note?: string;
  image?: string;
  tone?: "warm" | "green" | "rust" | "cream";
};

export type FarmEvidenceBoard_v0tohhe3cvs6Props = {
  durationInFrames: number;
  image: string;
  secondaryImage?: string;
  eyebrow?: string;
  title: string;
  metric?: string;
  footer?: string;
  variant?: "cards" | "compare" | "steps" | "grid" | "orbit" | "gate";
  items: FarmEvidenceItem_v0tohhe3cvs6[];
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const palette = {
  warm: {ink: "#f3d49b", wash: "rgba(190,132,55,0.34)", edge: "rgba(244,210,151,0.55)"},
  green: {ink: "#d8e5bd", wash: "rgba(104,137,72,0.35)", edge: "rgba(189,217,153,0.52)"},
  rust: {ink: "#efc1a0", wash: "rgba(155,73,41,0.38)", edge: "rgba(226,150,111,0.52)"},
  cream: {ink: "#fff7e5", wash: "rgba(218,199,160,0.24)", edge: "rgba(255,247,229,0.48)"},
};

const Photo: React.FC<{src: string; position?: string; dim?: number}> = ({
  src,
  position = "50% 50%",
  dim = 0,
}) => (
  <AbsoluteFill>
    <Media
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        filter: `saturate(0.86) contrast(1.04) brightness(${1 - dim})`,
      }}
    />
  </AbsoluteFill>
);

const Card: React.FC<{
  item: FarmEvidenceItem_v0tohhe3cvs6;
  index: number;
  progress: number;
  compact?: boolean;
}> = ({item, index, progress, compact = false}) => {
  const p = palette[item.tone ?? (index % 3 === 0 ? "warm" : index % 3 === 1 ? "green" : "cream")];
  const lift = interpolate(progress, [0, 1], [30, 0], clamp);
  const scale = interpolate(progress, [0, 1], [0.94, 1], clamp);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: compact ? 128 : 172,
        borderRadius: compact ? 26 : 34,
        padding: compact ? "22px 26px" : "28px 32px",
        transform: `translateY(${lift}px) scale(${scale})`,
        opacity: progress,
        background:
          "linear-gradient(145deg, rgba(38,35,27,0.88), rgba(18,20,16,0.78))",
        border: `1px solid ${p.edge}`,
        boxShadow:
          "0 28px 80px rgba(7,8,5,0.36), inset 0 1px 0 rgba(255,255,255,0.19)",
        backdropFilter: "blur(18px) saturate(0.82)",
      }}
    >
      {item.image ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: compact ? 122 : 166,
            height: "100%",
            opacity: 0.38,
            maskImage: "linear-gradient(90deg, transparent, black 40%)",
          }}
        >
          <Media
            src={item.image}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </div>
      ) : null}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: item.image ? "72%" : "100%",
        }}
      >
        {item.value ? (
          <div
            style={{
              color: p.ink,
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: compact ? 48 : 64,
              lineHeight: 0.95,
              fontWeight: 760,
              letterSpacing: "-0.045em",
              marginBottom: 13,
            }}
          >
            {item.value}
          </div>
        ) : null}
        <div
          style={{
            color: "#fff8e8",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: compact ? 29 : 37,
            lineHeight: 1.05,
            fontWeight: 650,
          }}
        >
          {item.label}
        </div>
        {item.note ? (
          <div
            style={{
              color: "rgba(255,247,227,0.68)",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: compact ? 19 : 22,
              lineHeight: 1.25,
              marginTop: 11,
              letterSpacing: "0.015em",
            }}
          >
            {item.note}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 5,
          height: "100%",
          background: p.ink,
          opacity: 0.72,
        }}
      />
    </div>
  );
};

export const FarmEvidenceBoard_v0tohhe3cvs6: React.FC<
  FarmEvidenceBoard_v0tohhe3cvs6Props
> = ({
  durationInFrames,
  image,
  secondaryImage,
  eyebrow,
  title,
  metric,
  footer,
  variant = "cards",
  items,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 82, mass: 0.9},
  });
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 13), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  const camera = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1.025, 1.085],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const glint = interpolate(frame, [Math.round(fps * 0.9), Math.round(fps * 1.7)], [-20, 120], clamp);
  const glintOpacity = interpolate(
    frame,
    [Math.round(fps * 0.82), Math.round(fps * 0.98), Math.round(fps * 1.48), Math.round(fps * 1.72)],
    [0, 0.24, 0.16, 0],
    clamp,
  );
  const titleY = interpolate(intro, [0, 1], [26, 0]);
  const cardProgress = (index: number) =>
    spring({
      frame: frame - 10 - index * 7,
      fps,
      config: {damping: 19, stiffness: 100, mass: 0.78},
    });

  const cards =
    variant === "compare"
      ? {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }
      : variant === "grid"
        ? {
            display: "grid",
            gridTemplateColumns: items.length > 4 ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
            gap: 20,
          }
        : {
            display: "grid",
            gridTemplateColumns: variant === "steps" || variant === "gate" ? "1fr" : "repeat(2, 1fr)",
            gap: variant === "steps" || variant === "gate" ? 15 : 22,
          };

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#171912",
        color: "#fff8e8",
        opacity: endFade,
      }}
    >
      <div style={{position: "absolute", inset: -42, transform: `scale(${camera})`}}>
        <Photo src={image} dim={0.04} />
      </div>
      {secondaryImage && variant === "compare" ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            opacity: 0.58,
            maskImage: "linear-gradient(90deg, transparent, black 24%)",
          }}
        >
          <Media
            src={secondaryImage}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 72% 42%, rgba(208,164,83,0.09), transparent 34%), linear-gradient(90deg, rgba(14,16,11,0.93) 0%, rgba(16,18,12,0.72) 48%, rgba(12,14,10,0.52) 100%)",
          backdropFilter: "blur(7px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "74px 84px 64px",
          display: "grid",
          gridTemplateColumns: variant === "orbit" ? "0.83fr 1.17fr" : "0.72fr 1.28fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div style={{transform: `translateY(${titleY}px)`, opacity: intro}}>
          <div
            style={{
              color: "#d9bc80",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 20,
              fontWeight: 760,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            {eyebrow ?? "FIELD EVIDENCE"}
          </div>
          {metric ? (
            <div
              style={{
                color: "#f4d79d",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: metric.length > 7 ? 74 : 116,
                lineHeight: 0.88,
                fontWeight: 800,
                letterSpacing: "-0.055em",
                marginBottom: 24,
              }}
            >
              {metric}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: title.length > 54 ? 54 : 66,
              lineHeight: 1.02,
              fontWeight: 660,
              letterSpacing: "-0.028em",
              textShadow: "0 8px 30px rgba(0,0,0,0.42)",
            }}
          >
            {title}
          </div>
          {footer ? (
            <div
              style={{
                marginTop: 26,
                color: "rgba(255,247,226,0.72)",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: 23,
                lineHeight: 1.35,
                maxWidth: 650,
              }}
            >
              {footer}
            </div>
          ) : null}
        </div>
        <div
          style={{
            ...cards,
            alignContent: "center",
            position: "relative",
            padding: variant === "orbit" ? "72px 0" : 0,
          }}
        >
          {items.map((item, index) => (
            <Card
              key={`${item.label}-${index}`}
              item={item}
              index={index}
              progress={cardProgress(index)}
              compact={variant === "grid" || variant === "steps" || variant === "gate"}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "-8%",
          left: `${glint}%`,
          width: 170,
          height: "116%",
          transform: "skewX(-17deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,238,194,0.28), transparent)",
          filter: "blur(18px)",
          opacity: glintOpacity,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 150px rgba(6,7,4,0.48)",
          backgroundImage:
            "radial-gradient(rgba(255,248,228,0.05) 0.7px, transparent 0.7px)",
          backgroundSize: "5px 5px",
          opacity: 0.36,
        }}
      />
    </AbsoluteFill>
  );
};

export const FarmEvidenceBoard: React.FC<
  FarmEvidenceBoard_v0tohhe3cvs6Props
> = FarmEvidenceBoard_v0tohhe3cvs6;
