import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, SERIF } from "../theme";
import { Padlock } from "./CropReel3D";

/**
 * CropChapter3D — the "chapter opener" for ONE crop, as a single continuous
 * camera move (no cuts). Storyboard (all one oner, curved slow-fast-slow speed):
 *   1. focused card unlocks (padlock pops) + slight zoom in
 *   2. camera eases, the card slides to the LEFT and tilts (depth)
 *   3. top-right: the crop name types in (typewriter) with a blinking cursor
 *   4. camera pulls back a touch (inconsistent easing) → a short description fades in
 *   5. camera pans right to reveal new space → "mejores meses para sembrar" strip
 *   6. a pastel floating TIP card appears; a drawn arrow points onward and the
 *      camera drifts "predicting" toward it
 *
 * Parametrised per crop so all five reuse it; anchor `durationInFrames` to the
 * spoken span of that crop's intro.
 */

export type CropChapter3DProps = {
  durationInFrames: number;
  image: string; // staticFile
  number: string; // "1".."5"
  name: string; // "Col rizada"
  description: string; // one short line
  months: number[]; // best sowing months, 1..12
  tip: string; // one short tip line
  accent?: string; // pastel accent for this crop
  pastel?: string; // pastel bg for the tip card
};

const MONTHS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// piecewise keyframe ramp with per-segment bezier easing (curved velocity)
function ramp(
  t: number,
  stops: Array<[number, number]>,
  ease = Easing.bezier(0.5, 0, 0.2, 1),
) {
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, v0] = stops[i];
    const [t1, v1] = stops[i + 1];
    if (t <= t1) {
      const k = ease(clamp01((t - t0) / (t1 - t0)));
      return v0 + (v1 - v0) * k;
    }
  }
  return stops[stops.length - 1][1];
}

export const CropChapter3D: React.FC<CropChapter3DProps> = ({
  durationInFrames,
  image,
  number,
  name,
  description,
  months,
  tip,
  accent = COLORS.accent,
  pastel = "#EAF0DB",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1 over the chapter

  // ── Camera: pans across a wider-than-frame canvas, curved speed ─────────────
  // stage marks: 0 unlock · .12 slide · .30 name · .46 desc/pullback · .64 months · .82 tip
  const camX = ramp(t, [
    [0, 0],
    [0.3, 0],
    [0.46, width * 0.02],
    [0.64, -width * 0.34], // pan right → reveal months strip
    [0.82, -width * 0.62], // drift toward the tip card
    [1, -width * 0.66],
  ]);
  const camScale = ramp(t, [
    [0, 1.12], // zoom in on unlock
    [0.12, 1.05],
    [0.3, 1.0],
    [0.46, 0.955], // slight pullback (inconsistent)
    [0.64, 0.99],
    [0.82, 1.0],
    [1, 1.02],
  ]);
  // subtle never-constant handheld drift on top
  const driftX = Math.sin(frame * 0.02) * 8 + Math.sin(frame * 0.045) * 3;
  const driftY = Math.cos(frame * 0.016) * 6;

  // ── Hero card: center → left, unlock, tilt ──────────────────────────────────
  const unlock = interpolate(t, [0.02, 0.14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const cardX = ramp(t, [
    [0, width * 0.5],
    [0.12, width * 0.5],
    [0.3, width * 0.27], // slid to the left third
    [1, width * 0.27],
  ]);
  const cardY = height * 0.5;
  const cardTilt = ramp(t, [
    [0, 0],
    [0.3, 7], // gentle rotateY once on the left
    [1, 7],
  ]);
  const cardScale = ramp(t, [
    [0, 0.9],
    [0.12, 1.02],
    [0.3, 1.0],
    [1, 1.0],
  ]);
  const cardW = Math.min(width, height) * 0.40;
  const cardH = cardW * 1.32;

  // ── Typewriter name (top-right of the card) ─────────────────────────────────
  const nameStart = 0.3,
    nameEnd = 0.44;
  const nameProg = clamp01((t - nameStart) / (nameEnd - nameStart));
  const shownName = name.slice(0, Math.round(nameProg * name.length));
  const cursorOn = t > nameStart && t < 0.5 && Math.floor(frame / 8) % 2 === 0;

  // description
  const descOp = interpolate(t, [0.46, 0.56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(t, [0.46, 0.56], [16, 0], { extrapolateRight: "clamp" });

  // months strip
  const monthsOp = interpolate(t, [0.6, 0.68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // tip card + arrow
  const tipOp = interpolate(t, [0.82, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tipY = interpolate(t, [0.82, 0.92], [26, 0], { extrapolateRight: "clamp" });
  const arrowDraw = interpolate(t, [0.86, 0.96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const textPanelX = width * 0.52; // near top-right of hero card (canvas coords)

  return (
    <AbsoluteFill style={{ background: "#f3efe6", overflow: "hidden" }}>
      {/* bright bokeh background (continuity with the reel) */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: -80,
            background:
              "radial-gradient(120% 90% at 42% 34%, #fdfbf6 0%, #f1ece0 55%, #e6dcc7 100%)",
          }}
        />
        {[
          { x: 0.12, y: 0.22, r: 260, c: "rgba(124,138,90,0.24)" },
          { x: 0.9, y: 0.34, r: 320, c: "rgba(169,121,74,0.20)" },
          { x: 0.36, y: 0.86, r: 240, c: "rgba(110,139,71,0.22)" },
          { x: 0.7, y: 0.72, r: 220, c: "rgba(255,255,255,0.5)" },
        ].map((b, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: b.x * width,
              top: b.y * height,
              width: b.r,
              height: b.r,
              marginLeft: -b.r / 2,
              marginTop: -b.r / 2,
              borderRadius: "50%",
              background: b.c,
              filter: "blur(60px)",
              transform: `translate(${Math.sin(frame * 0.01 + k) * 16}px, ${Math.cos(frame * 0.013 + k) * 12}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* camera rig over a wide canvas */}
      <AbsoluteFill
        style={{
          transform: `translate(${camX + driftX}px, ${driftY}px) scale(${camScale})`,
          transformOrigin: "42% 50%",
        }}
      >
        <AbsoluteFill style={{ perspective: 1500 }}>
          {/* hero card */}
          <div
            style={{
              position: "absolute",
              left: cardX - cardW / 2,
              top: cardY - cardH / 2,
              width: cardW,
              height: cardH,
              transform: `rotateY(${-cardTilt}deg) scale(${cardScale})`,
              transformStyle: "preserve-3d",
              borderRadius: 24,
              overflow: "hidden",
              border: "7px solid #fbf8f1",
              boxShadow: "0 34px 80px rgba(42,38,32,0.30)",
              background: "#e8e2d4",
            }}
          >
            <Img
              src={image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `blur(${(1 - unlock) * 15}px)`,
                transform: `scale(${1.05 + (1 - unlock) * 0.05})`,
              }}
            />
            {unlock < 0.99 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(247,243,235,0.55)",
                  opacity: 1 - clamp01((unlock - 0.6) / 0.4),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Padlock open={unlock} size={cardW * 0.32} />
              </div>
            )}
            {/* number badge bottom-left */}
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 14,
                fontFamily: SERIF,
                fontSize: cardH * 0.16,
                fontWeight: 700,
                color: "#faf6ec",
                opacity: unlock,
                textShadow: "0 3px 10px rgba(0,0,0,0.6)",
                lineHeight: 1,
              }}
            >
              {number}
            </div>
          </div>

          {/* name (typewriter) + description — top-right of the card */}
          <div
            style={{
              position: "absolute",
              left: textPanelX,
              top: height * 0.28,
              width: width * 0.34,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: height * 0.11,
                fontWeight: 700,
                color: COLORS.text,
                lineHeight: 1.02,
                letterSpacing: 0.2,
              }}
            >
              {shownName}
              <span style={{ opacity: cursorOn ? 1 : 0, color: accent }}>|</span>
            </div>
            <div
              style={{
                marginTop: 18,
                opacity: descOp,
                transform: `translateY(${descY}px)`,
                fontFamily: SERIF,
                fontSize: height * 0.036,
                color: COLORS.textSoft,
                lineHeight: 1.35,
                maxWidth: width * 0.3,
              }}
            >
              {description}
            </div>
            {/* accent underline that draws under the name */}
            <div
              style={{
                marginTop: 12,
                height: 4,
                width: interpolate(t, [0.42, 0.56], [0, width * 0.2], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                background: accent,
                borderRadius: 2,
              }}
            />
          </div>

          {/* best-months strip (revealed by the pan) */}
          <div
            style={{
              position: "absolute",
              left: width * 0.9,
              top: height * 0.52,
              opacity: monthsOp,
              transform: `translateY(${interpolate(monthsOp, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: height * 0.03,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.textSoft,
                marginBottom: 14,
              }}
            >
              Mejores meses para sembrar
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {MONTHS.map((m, i) => {
                const on = months.includes(i + 1);
                const pop = interpolate(
                  t,
                  [0.64 + i * 0.006, 0.7 + i * 0.006],
                  [0.4, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={i}
                    style={{
                      width: height * 0.062,
                      height: height * 0.062,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: SERIF,
                      fontSize: height * 0.03,
                      fontWeight: on ? 700 : 400,
                      color: on ? "#faf6ec" : COLORS.textDim,
                      background: on ? accent : "rgba(42,38,32,0.06)",
                      border: `2px solid ${on ? accent : "rgba(42,38,32,0.12)"}`,
                      transform: `scale(${on ? pop : 0.9})`,
                      boxShadow: on ? "0 8px 20px rgba(124,138,90,0.35)" : "none",
                    }}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>

          {/* pastel tip card + drawn arrow pointing onward */}
          <div
            style={{
              position: "absolute",
              left: width * 1.16,
              top: height * 0.4,
              width: width * 0.3,
              opacity: tipOp,
              transform: `translateY(${tipY}px)`,
            }}
          >
            {/* arrow drawn from the left edge into the card */}
            <svg
              width={160}
              height={80}
              viewBox="0 0 160 80"
              style={{ position: "absolute", left: -150, top: 30 }}
            >
              <path
                d="M4 40 C 50 40, 90 20, 140 34"
                fill="none"
                stroke={accent}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={260}
                strokeDashoffset={260 * (1 - arrowDraw)}
              />
              {arrowDraw > 0.8 && (
                <path d="M128 24 L144 34 L126 44" fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            <div
              style={{
                background: pastel,
                border: `2px solid ${accent}`,
                borderRadius: 20,
                padding: "26px 28px",
                boxShadow: "0 22px 50px rgba(42,38,32,0.16)",
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: height * 0.028,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: accent,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                El truco
              </div>
              <div style={{ fontFamily: SERIF, fontSize: height * 0.04, color: COLORS.text, lineHeight: 1.32 }}>
                {tip}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default CropChapter3D;
