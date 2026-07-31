import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

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
      <OffthreadVideo
        src={staticFile(src)}
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateX(${drift}px) scale(${zoom})`,
          filter: "saturate(.84) contrast(1.065) brightness(.94)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(8,12,9,.06),transparent 45%,rgba(8,12,9,.32)),radial-gradient(circle at 50% 45%,transparent 48%,rgba(5,8,6,.27))",
          boxShadow: "inset 0 0 120px rgba(5,8,6,.35)",
        }}
      />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: layout === "badge" ? "auto" : 72,
            right: layout === "badge" ? 72 : "auto",
            top: layout === "rule" || layout === "badge" ? 64 : "auto",
            bottom: layout === "corner" || layout === "lower" ? 66 : "auto",
            maxWidth: layout === "lower" ? 1080 : 760,
            padding: "20px 28px 23px",
            borderRadius: layout === "rule" ? 16 : 27,
            opacity: entrance,
            transform: `translateY(${(1 - entrance) * 24}px)`,
            background:
              "linear-gradient(145deg,rgba(28,34,28,.88),rgba(12,17,14,.72))",
            border: "1px solid rgba(198,223,188,.4)",
            boxShadow:
              "0 22px 58px rgba(3,7,5,.34),inset 0 1px rgba(255,255,255,.15)",
            backdropFilter: "blur(16px) saturate(.82)",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                color: "#a8d7c0",
                fontFamily: "Arial, sans-serif",
                fontSize: 17,
                fontWeight: 850,
                letterSpacing: 4.2,
                marginBottom: 9,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              color: "#fff8e8",
              fontFamily: "Georgia, serif",
              fontSize: layout === "badge" ? 35 : 46,
              lineHeight: 1.03,
              fontWeight: 700,
              letterSpacing: -1,
              textShadow: "0 5px 22px rgba(0,0,0,.42)",
            }}
          >
            {label}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 16,
              bottom: 16,
              width: 5,
              borderRadius: 5,
              background: "#7fc8ad",
            }}
          />
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          opacity: 0.11,
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
