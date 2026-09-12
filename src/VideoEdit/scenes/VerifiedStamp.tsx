import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── VERIFIED STAMP ────────────────────────────────────────────────────────────
// Sello tipo estampa que GOLPEA sobre una afirmación (rota + escala con overshoot):
// "PROBADO" / "VERIFICADO" + tilde. Da credibilidad (y prepara la venta de la guía).
export const VerifiedStamp: React.FC<{
  durationInFrames: number;
  text?: string;           // "PROBADO"
  accent?: "good" | "danger" | "amber";
  angle?: number;          // inclinación final (deg)
}> = ({ durationInFrames, text = "PROBADO", accent = "good", angle = -12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent === "danger" ? COLORS.danger : accent === "amber" ? COLORS.amber : COLORS.good;
  const slam = spring({ frame, fps, config: { damping: 9, mass: 0.8, stiffness: 220 } });
  const scale = interpolate(slam, [0, 1], [1.9, 1]);
  const rot = interpolate(slam, [0, 1], [angle - 22, angle]);
  const op = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  // sacudida leve al impactar
  const shake = frame < 8 ? Math.sin(frame * 3) * (8 - frame) * 0.6 : 0;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: outO }}>
      <div style={{ transform: `rotate(${rot}deg) scale(${scale}) translateX(${shake}px)`, opacity: op, border: `9px solid ${C}`, borderRadius: 16, padding: "22px 50px", background: "rgba(21,18,14,0.86)", display: "flex", alignItems: "center", gap: 26, boxShadow: `0 0 0 4px rgba(21,18,14,0.5), 0 14px 40px rgba(0,0,0,0.4)` }}>
        <div style={{ width: 78, height: 78, borderRadius: 999, border: `7px solid ${C}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: C, fontSize: 54, fontFamily: IMPACT, lineHeight: 1, marginTop: -5 }}>✓</span>
        </div>
        <span style={{ fontFamily: IMPACT, color: C, fontSize: 98, letterSpacing: 4, lineHeight: 1, textShadow: "0 2px 0 rgba(0,0,0,0.3)" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
