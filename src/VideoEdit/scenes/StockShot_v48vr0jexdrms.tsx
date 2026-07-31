import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Video} from "@remotion/media";

export type StockShotProps_v48vr0jexdrms = {
  durationInFrames: number;
  src: string;
  label?: string;
  eyebrow?: string;
  layout?: "corner" | "rule" | "badge" | "lower";
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const StockShot_v48vr0jexdrms: React.FC<StockShotProps_v48vr0jexdrms> = ({
  durationInFrames,
  src,
  label,
  eyebrow,
  layout = "corner",
}) => {
  const frame = useCurrentFrame();
  let seed = 0;
  for (let index = 0; index < src.length; index++) {
    seed = (seed * 31 + src.charCodeAt(index)) >>> 0;
  }
  // Most stock moments stay completely clean. A sparse editorial rail is
  // reserved for roughly one shot in four, so footage—not a template—leads.
  const showEditorialRail = Boolean(label) && seed % 4 === 0;
  const drift = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [seed % 2 ? -10 : 10, seed % 2 ? 10 : -10],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const zoom = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1.025, 1.082],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const entrance = interpolate(frame, [4, 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(
    frame,
    [Math.max(1, durationInFrames - 10), Math.max(2, durationInFrames - 1)],
    [1, 0.95],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{overflow: "hidden", background: "#10140f", opacity: exit}}
    >
      <Video
        src={staticFile(src)}
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateX(${drift}px) scale(${zoom})`,
          filter: "saturate(.92) contrast(1.055) brightness(1.02)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(8,12,9,.04),transparent 62%,rgba(8,12,9,.18)),radial-gradient(circle at 50% 45%,transparent 62%,rgba(5,8,6,.12))",
          boxShadow: "inset 0 0 90px rgba(5,8,6,.18)",
        }}
      />
      {showEditorialRail ? (
        <div
          style={{
            position: "absolute",
            left: layout === "badge" ? "auto" : 70,
            right: layout === "badge" ? 70 : "auto",
            top: layout === "rule" || layout === "badge" ? 58 : "auto",
            bottom: layout === "corner" || layout === "lower" ? 58 : "auto",
            maxWidth: layout === "lower" ? 960 : 650,
            padding: "0 0 0 23px",
            opacity: entrance,
            transform: `translate3d(${(1 - entrance) * (layout === "badge" ? 32 : -32)}px,0,0)`,
            filter: `blur(${(1 - entrance) * 7}px)`,
            textAlign: layout === "badge" ? "right" : "left",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                color: "#b7ead4",
                fontFamily: "Arial, sans-serif",
                fontSize: 17,
                fontWeight: 850,
                letterSpacing: 4.2,
                marginBottom: 8,
                textShadow: "0 2px 14px rgba(0,0,0,.75)",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              color: "#fff8e8",
              fontFamily: "Georgia, serif",
              fontSize: layout === "badge" ? 30 : 39,
              lineHeight: 1.03,
              fontWeight: 700,
              letterSpacing: -1,
              textShadow: "0 4px 18px rgba(0,0,0,.78)",
            }}
          >
            {label}
          </div>
          <div
            style={{
              position: "absolute",
              left: layout === "badge" ? "auto" : 0,
              right: layout === "badge" ? 0 : "auto",
              top: 0,
              bottom: 0,
              width: 3,
              background: "linear-gradient(180deg,#e4c77e,#75cfc4)",
            }}
          />
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          opacity: 0.055,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.4) .55px,transparent .55px)",
          backgroundSize: "4px 4px",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const StockCornerEvidence_v48vr0jexdrms: React.FC<
  StockShotProps_v48vr0jexdrms
> = (props) => <StockShot_v48vr0jexdrms {...props} layout="corner" />;
export const StockTopRule_v48vr0jexdrms: React.FC<
  StockShotProps_v48vr0jexdrms
> = (props) => <StockShot_v48vr0jexdrms {...props} layout="rule" />;
export const StockFieldBadge_v48vr0jexdrms: React.FC<
  StockShotProps_v48vr0jexdrms
> = (props) => <StockShot_v48vr0jexdrms {...props} layout="badge" />;
export const StockLowerEvidence_v48vr0jexdrms: React.FC<
  StockShotProps_v48vr0jexdrms
> = (props) => <StockShot_v48vr0jexdrms {...props} layout="lower" />;
