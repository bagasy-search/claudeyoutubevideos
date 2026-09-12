import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

// Warm PAPER/parchment background (brand: earthy vintage): layered cream gradient
// (COLORS.bg2→bg0) + a faint INK dotted grid + soft warm glow + drifting earthy
// orbs + a gentle sepia vignette. Built in parallax layers so callers can pass a
// `glowX/glowY` to move the focus around for the push-zoom moves (Rules 1 & 5).
// (Was a dark navy "tech" bg; flipped to the light brand — all tones read COLORS.)
export const TechBackground: React.FC<{
  glowX?: number; // 0..100 (% of width) where the soft glow sits
  glowY?: number;
  hue?: "blue" | "cold" | "amber" | "red";
  drift?: number; // parallax drift multiplier
}> = ({ glowX = 50, glowY = 42, hue = "blue", drift = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;

  const glowColor =
    hue === "amber"
      ? "rgba(169,121,74,0.20)" // sepia / tobacco warmth
      : hue === "red"
        ? "rgba(176,80,60,0.18)" // faded terracotta
        : hue === "cold" || hue === "blue"
          ? "rgba(111,132,120,0.18)" // muted eucalyptus (cool / problem beats)
          : "rgba(124,138,90,0.16)"; // neutral fallback: faint sage

  // slow breathing of the glow
  const breathe = interpolate(Math.sin(t * 0.9), [-1, 1], [0.85, 1.12]);
  // gentle parallax drift of the grid
  const gridX = Math.sin(t * 0.25) * 14 * drift;
  const gridY = Math.cos(t * 0.2) * 10 * drift;

  return (
    <AbsoluteFill>
      {/* base navy gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${COLORS.bg2} 0%, ${COLORS.bg1} 45%, ${COLORS.bg0} 100%)`,
        }}
      />

      {/* soft radial glow (the focal "light") */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 50% at ${glowX}% ${glowY}%, ${glowColor} 0%, rgba(0,0,0,0) 60%)`,
          transform: `scale(${breathe})`,
        }}
      />

      {/* dotted grid — faint INK dots on the cream paper (mid layer, parallax) */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(42,38,32,0.10) 1.4px, transparent 1.4px)",
          backgroundSize: "46px 46px",
          backgroundPosition: `${gridX}px ${gridY}px`,
          maskImage:
            "radial-gradient(75% 75% at 50% 45%, #000 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(75% 75% at 50% 45%, #000 30%, transparent 85%)",
          opacity: 0.8,
        }}
      />

      {/* drifting soft orbs for depth — baked as radial-gradients (no live
          blur filter, much cheaper to render, identical look) */}
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            left: `${10 + Math.sin(t * 0.5) * 4 * drift}%`,
            top: `${52 + Math.cos(t * 0.4) * 5 * drift}%`,
            background:
              "radial-gradient(circle, rgba(169,121,74,0.14) 0%, rgba(0,0,0,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 540,
            height: 540,
            right: `${8 + Math.cos(t * 0.45) * 4 * drift}%`,
            top: `${6 + Math.sin(t * 0.35) * 4 * drift}%`,
            background:
              "radial-gradient(circle, rgba(124,138,90,0.12) 0%, rgba(0,0,0,0) 68%)",
          }}
        />
      </AbsoluteFill>

      {/* gentle warm sepia vignette (soft, so the paper doesn't go muddy) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(82% 82% at 50% 48%, rgba(0,0,0,0) 58%, rgba(80,55,20,0.20) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
