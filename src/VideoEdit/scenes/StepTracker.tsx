import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── STEP TRACKER ──────────────────────────────────────────────────────────────
// Rastreador de paso en la esquina: "PASO 2 / 3" + puntos de progreso. El
// espectador ve que faltan pasos → lo retiene hasta el final.
export const StepTracker: React.FC<{
  durationInFrames: number;
  step: number;
  total?: number;
  label?: string;          // "PASO"
  accent?: "amber" | "danger" | "good";
}> = ({ durationInFrames, step, total = 3, label = "PASO", accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent === "danger" ? COLORS.danger : accent === "good" ? COLORS.good : COLORS.amber;
  const DARK = "#15120E", CREAM = "#FDF7EA";
  const inS = spring({ frame, fps, config: { damping: 15, mass: 0.8, stiffness: 170 } });
  const x = interpolate(inS, [0, 1], [120, 0]);
  const numS = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 200 } });
  const outO = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", opacity: outO }}>
      <div style={{ margin: "64px 72px 0 0", transform: `translateX(${x}px)`, background: DARK, padding: "16px 28px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, clipPath: "polygon(16px 0, 100% 0, 100% 100%, 0 100%)", boxShadow: "0 12px 34px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: IMPACT, color: "rgba(253,247,234,0.7)", fontSize: 26, letterSpacing: 3 }}>{label}</span>
          <span style={{ fontFamily: IMPACT, color: C, fontSize: 54, lineHeight: 1, transform: `scale(${0.6 + 0.4 * numS})`, transformOrigin: "center bottom" }}>{step}</span>
          <span style={{ fontFamily: IMPACT, color: "rgba(253,247,234,0.55)", fontSize: 30 }}>/ {total}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{ width: i < step ? 32 : 20, height: 8, borderRadius: 4, background: i < step ? C : "rgba(253,247,234,0.22)", transition: "all .2s" }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
