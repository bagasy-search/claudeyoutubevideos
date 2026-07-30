import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Media } from "../components/Media";
import { COLORS, FONT_STACK } from "../theme";

export type PlainAlmanacQuietCTA_v0tohhe3cvs6Props = {
  durationInFrames: number;
  image: string;
  coverImage?: string;
};

const OFFER_LINES = [
  "90 ILLUSTRATED METHODS",
  "13 PRACTICAL SECTIONS",
  "$47 · PAY ONCE",
  "7-DAY REFUND PERIOD",
] as const;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const PlainAlmanacQuietCTA_v0tohhe3cvs6: React.FC<
  PlainAlmanacQuietCTA_v0tohhe3cvs6Props
> = ({ durationInFrames, image, coverImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeDuration = Math.max(1, durationInFrames);
  const safeLastFrame = Math.max(1, safeDuration - 1);
  const fadeIn = interpolate(
    frame,
    [0, Math.max(1, Math.min(14, safeDuration - 1))],
    [0, 1],
    clamp,
  );
  const fadeOutStart = Math.max(0, safeDuration - 12);
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, Math.max(fadeOutStart + 1, safeDuration - 1)],
    [1, 0],
    clamp,
  );

  const backgroundScale = interpolate(
    frame,
    [0, safeLastFrame],
    [1.035, 1.075],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );

  const cardIn = spring({
    frame: frame - Math.round(fps * 0.18),
    fps,
    durationInFrames: Math.max(18, Math.round(fps * 0.9)),
    config: { damping: 24, stiffness: 78, mass: 1.05 },
  });
  const cardY = interpolate(cardIn, [0, 1], [30, 0], clamp);

  const coverIn = spring({
    frame: frame - Math.round(fps * 0.35),
    fps,
    durationInFrames: Math.max(18, Math.round(fps * 0.9)),
    config: { damping: 26, stiffness: 72, mass: 1.05 },
  });

  const linesIn = OFFER_LINES.map((_, index) =>
    interpolate(
      frame,
      [
        Math.round(fps * (0.72 + index * 0.16)),
        Math.round(fps * (1.12 + index * 0.16)),
      ],
      [0, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) },
    )
  );

  const glintStart = Math.min(
    Math.round(fps * 1.55),
    Math.max(0, safeDuration - Math.round(fps * 1.2)),
  );
  const glintEnd = Math.min(
    safeDuration - 1,
    glintStart + Math.max(18, Math.round(fps * 0.95)),
  );
  const glintX = interpolate(
    frame,
    [glintStart, Math.max(glintStart + 1, glintEnd)],
    [-240, 1480],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const glintOpacity = interpolate(
    frame,
    [
      glintStart,
      glintStart + Math.max(2, Math.round(fps * 0.16)),
      Math.max(glintStart + 3, glintEnd - Math.round(fps * 0.18)),
      Math.max(glintStart + 4, glintEnd),
    ],
    [0, 0.22, 0.15, 0],
    clamp,
  );

  // A designed in-component cover keeps the product visible even when the
  // creator has not supplied a separate cover bitmap.
  const hasCover = true;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#211b14",
        fontFamily: FONT_STACK,
        opacity: fadeIn * fadeOut,
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
          filter: "saturate(0.72) contrast(1.03) brightness(0.58)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(24,19,14,0.68) 0%, rgba(24,19,14,0.32) 48%, rgba(24,19,14,0.56) 100%), radial-gradient(ellipse at 52% 42%, rgba(231,216,177,0.08), rgba(26,20,14,0.48) 74%)",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow:
            "inset 0 0 220px rgba(16,12,9,0.58), inset 0 -120px 170px rgba(16,12,9,0.35)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "84px 118px",
          display: "grid",
          gridTemplateColumns: hasCover
            ? "390px minmax(0, 1fr)"
            : "minmax(0, 1fr)",
          alignItems: "center",
          justifyContent: "center",
          gap: hasCover ? 58 : 0,
        }}
      >
        {
          (
            <div
              style={{
                width: 366,
                height: 548,
                justifySelf: "center",
                opacity: coverIn,
                transform: `translateY(${
                  interpolate(coverIn, [0, 1], [24, 0], clamp)
                }px) scale(${
                  interpolate(
                    coverIn,
                    [0, 1],
                    [0.965, 1],
                    clamp,
                  )
                })`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 24,
                  border: "1px solid rgba(248,239,214,0.58)",
                  boxShadow:
                    "0 32px 75px rgba(12,9,7,0.5), 0 5px 16px rgba(12,9,7,0.3), inset 0 1px 0 rgba(255,255,255,0.45)",
                  backgroundColor: COLORS.bg1,
                }}
              >
                {coverImage ? (
                  <Media
                    src={coverImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      boxSizing: "border-box",
                      padding: "48px 38px",
                      color: "#2e3327",
                      background:
                        "linear-gradient(160deg, #eee3c7 0%, #d8c89f 100%)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 18,
                        border: "2px solid rgba(77,83,59,.5)",
                        borderRadius: 11,
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        color: "#7d4e27",
                        fontSize: 17,
                        fontWeight: 800,
                        letterSpacing: 4.4,
                      }}
                    >
                      LANCASTER COUNTY · NO. I
                    </div>
                    <div
                      style={{
                        position: "relative",
                        marginTop: 76,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontSize: 52,
                        lineHeight: 0.94,
                        fontWeight: 700,
                        letterSpacing: -1.8,
                      }}
                    >
                      THE PLAIN
                      <br />
                      ALMANAC
                    </div>
                    <div
                      style={{
                        position: "relative",
                        width: 74,
                        height: 4,
                        marginTop: 34,
                        borderRadius: 99,
                        background: "#7d4e27",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 38,
                        right: 38,
                        bottom: 64,
                        fontSize: 27,
                        fontWeight: 850,
                        letterSpacing: 1.8,
                      }}
                    >
                      90 NUMBERED METHODS
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        }

        <div
          style={{
            position: "relative",
            width: hasCover ? "100%" : 1260,
            maxWidth: "100%",
            justifySelf: "center",
            overflow: "hidden",
            boxSizing: "border-box",
            padding: hasCover ? "58px 62px 52px" : "64px 76px 58px",
            borderRadius: 38,
            color: COLORS.text,
            background:
              "linear-gradient(145deg, rgba(247,240,221,0.96), rgba(229,219,191,0.93))",
            border: "1px solid rgba(255,249,229,0.78)",
            boxShadow:
              "0 38px 100px rgba(14,11,8,0.45), 0 8px 26px rgba(14,11,8,0.22), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px) saturate(112%)",
            WebkitBackdropFilter: "blur(18px) saturate(112%)",
            opacity: cardIn,
            transform: `translateY(${cardY}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.14,
              backgroundImage:
                "radial-gradient(circle at 20% 12%, rgba(124,138,90,0.34), transparent 38%), repeating-linear-gradient(0deg, rgba(42,38,32,0.04) 0, rgba(42,38,32,0.04) 1px, transparent 1px, transparent 5px)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                color: COLORS.amber,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 6.2,
                lineHeight: 1,
                marginBottom: 21,
              }}
            >
              THE PLAIN ALMANAC
            </div>

            <div
              style={{
                width: 104,
                height: 3,
                borderRadius: 99,
                marginBottom: 34,
                background: COLORS.accent,
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: hasCover
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(4, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              {OFFER_LINES.map((line, index) => (
                <div
                  key={line}
                  style={{
                    minHeight: hasCover ? 88 : 122,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: hasCover ? "flex-start" : "center",
                    padding: hasCover ? "18px 25px" : "20px 24px",
                    borderRadius: 24,
                    border: "1px solid rgba(84,74,57,0.17)",
                    background:
                      "linear-gradient(145deg, rgba(255,252,240,0.82), rgba(239,231,211,0.68))",
                    boxShadow:
                      "0 12px 28px rgba(67,54,37,0.12), inset 0 1px 0 rgba(255,255,255,0.78)",
                    color: index === 1 ? COLORS.good : COLORS.text,
                    fontSize: hasCover ? 29 : 27,
                    fontWeight: 700,
                    letterSpacing: 1.3,
                    lineHeight: 1.08,
                    textAlign: hasCover ? "left" : "center",
                    opacity: linesIn[index],
                    transform: `translateY(${(1 - linesIn[index]) * 13}px)`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 34,
                paddingTop: 27,
                borderTop: "1px solid rgba(84,74,57,0.2)",
                color: COLORS.textSoft,
                fontSize: 25,
                fontWeight: 600,
                letterSpacing: 3.5,
                lineHeight: 1,
                textAlign: "center",
                opacity: interpolate(
                  frame,
                  [Math.round(fps * 1.2), Math.round(fps * 1.65)],
                  [0, 1],
                  { ...clamp, easing: Easing.out(Easing.cubic) },
                ),
              }}
            >
              USE ONLY WHAT FITS.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: -150,
              bottom: -150,
              left: glintX,
              width: 78,
              opacity: glintOpacity,
              transform: "rotate(17deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PlainAlmanacQuietCTA: React.FC<
  PlainAlmanacQuietCTA_v0tohhe3cvs6Props
> = PlainAlmanacQuietCTA_v0tohhe3cvs6;
