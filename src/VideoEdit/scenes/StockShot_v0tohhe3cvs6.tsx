import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export type StockShot_v0tohhe3cvs6Props = {
  durationInFrames: number;
  src: string;
  startFromSeconds?: number;
  focus?: string;
  cool?: boolean;
  label?: string;
  eyebrow?: string;
  layout?: "corner" | "rule" | "badge" | "lower";
};

const VIDEO = /\.(mp4|webm|mov)$/i;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const StockShot_v0tohhe3cvs6: React.FC<
  StockShot_v0tohhe3cvs6Props
> = ({
  durationInFrames,
  src,
  startFromSeconds = 0,
  focus = "50% 50%",
  cool = false,
  label,
  eyebrow,
  layout = "corner",
}) => {
  const frame = useCurrentFrame();
  let seed = 0;
  for (let index = 0; index < src.length; index++) {
    seed = (seed * 31 + src.charCodeAt(index)) >>> 0;
  }
  const zoomIn = seed % 2 === 0;
  const span = Math.min(0.065, Math.max(0.025, durationInFrames / 30 * 0.008));
  const start = zoomIn ? 1.018 : 1.018 + span;
  const end = zoomIn ? 1.018 + span : 1.018;
  const scale = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [start, end], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const driftX = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [seed % 3 === 0 ? -8 : 8, seed % 3 === 0 ? 8 : -8],
    clamp,
  );
  const fade = interpolate(
    frame,
    [0, Math.min(8, durationInFrames - 1), Math.max(1, durationInFrames - 10), Math.max(1, durationInFrames - 1)],
    [0.92, 1, 1, 0.96],
    clamp,
  );
  const labelIn = interpolate(frame, [5, 23], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const labelY = interpolate(labelIn, [0, 1], [22, 0], clamp);
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: focus,
    transform: `translateX(${driftX}px) scale(${scale})`,
    filter: cool
      ? "saturate(0.78) contrast(1.06) brightness(0.94)"
      : "saturate(0.88) contrast(1.04) brightness(0.97)",
  };

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#11130e", opacity: fade}}>
      {VIDEO.test(src) ? (
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.max(0, Math.round(startFromSeconds * 30))}
          muted
          style={mediaStyle}
        />
      ) : (
        <Img src={staticFile(src)} style={mediaStyle} />
      )}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 118px rgba(9,9,5,0.38)",
          background:
            "linear-gradient(180deg, rgba(23,22,15,0.06), transparent 28%, transparent 72%, rgba(14,14,9,0.16))",
        }}
      />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: layout === "badge" ? "auto" : 72,
            right: layout === "badge" ? 72 : "auto",
            top: layout === "rule" || layout === "badge" ? 68 : "auto",
            bottom: layout === "corner" || layout === "lower" ? 68 : "auto",
            maxWidth: layout === "lower" ? 1060 : 720,
            padding:
              layout === "badge" ? "18px 24px" : "22px 29px 24px",
            borderRadius: layout === "rule" ? 16 : 28,
            opacity: labelIn,
            transform: `translateY(${labelY}px)`,
            background:
              layout === "rule"
                ? "linear-gradient(90deg, rgba(29,27,20,0.88), rgba(29,27,20,0.42))"
                : "linear-gradient(145deg, rgba(38,35,27,0.84), rgba(18,20,16,0.72))",
            border: "1px solid rgba(244,216,160,0.4)",
            boxShadow:
              "0 20px 52px rgba(7,8,5,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px) saturate(0.86)",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                marginBottom: 9,
                color: "#dfc286",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: 17,
                fontWeight: 780,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              color: "#fff8e8",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: layout === "badge" ? 34 : 45,
              lineHeight: 1.03,
              fontWeight: 660,
              letterSpacing: "-0.024em",
              textShadow: "0 5px 22px rgba(0,0,0,0.38)",
            }}
          >
            {label}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 18,
              bottom: 18,
              width: 4,
              borderRadius: 4,
              background: "#d9b875",
              opacity: 0.82,
            }}
          />
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: 0.11,
          backgroundImage:
            "radial-gradient(rgba(255,248,229,0.42) 0.55px, transparent 0.55px)",
          backgroundSize: "4px 4px",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

export const StockEvidenceCard: React.FC<StockShot_v0tohhe3cvs6Props> =
  StockShot_v0tohhe3cvs6;

// Deliberate documentary treatments. These are not naming aliases: each
// wrapper locks a different composition so neighboring evidence shots do not
// repeat the same card placement.
export const StockCornerEvidence_v0tohhe3cvs6: React.FC<
  StockShot_v0tohhe3cvs6Props
> = (props) => <StockShot_v0tohhe3cvs6 {...props} layout="corner" />;

export const StockTopRule_v0tohhe3cvs6: React.FC<
  StockShot_v0tohhe3cvs6Props
> = (props) => <StockShot_v0tohhe3cvs6 {...props} layout="rule" />;

export const StockFieldBadge_v0tohhe3cvs6: React.FC<
  StockShot_v0tohhe3cvs6Props
> = (props) => <StockShot_v0tohhe3cvs6 {...props} layout="badge" />;

export const StockLowerEvidence_v0tohhe3cvs6: React.FC<
  StockShot_v0tohhe3cvs6Props
> = (props) => <StockShot_v0tohhe3cvs6 {...props} layout="lower" />;
