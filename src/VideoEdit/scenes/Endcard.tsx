import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── Endcard ───────────────────────────────────────────────────────────────────
// Remate de cierre: tarjeta glassmórfica con CTA de suscripción sobre el avatar.
const TEAL = "#12B3AE";
const INK = "#12222B";

export const Endcard: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 110 } });
  const outO = interpolate(frame, [D - 10, D], [1, 0], cl);
  const op = Math.min(enter, outO);
  const pulse = 1 + 0.03 * Math.sin(frame / 7);

  return (
    <AbsoluteFill style={{ opacity: op, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 50%, rgba(7,13,17,0.55), rgba(7,13,17,0.78))", opacity: interpolate(enter, [0, 1], [0, 1]) }} />
      <div
        style={{
          position: "relative",
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          padding: "56px 80px",
          borderRadius: 40,
          textAlign: "center",
          background: "linear-gradient(150deg, rgba(255,255,255,0.9), rgba(240,248,249,0.82))",
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: TEAL, textTransform: "uppercase", opacity: interpolate(frame, [6, 20], [0, 1], cl) }}>Dr. Federer</div>
        <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 88, color: INK, marginTop: 12, letterSpacing: -1, opacity: interpolate(frame, [10, 24], [0, 1], cl) }}>Suscríbete</div>
        <div style={{ fontFamily: F_INTER, fontWeight: 500, fontSize: 34, color: "rgba(20,34,43,0.7)", marginTop: 14, maxWidth: 760, opacity: interpolate(frame, [16, 30], [0, 1], cl) }}>
          Cada semana, un truco que los laboratorios prefieren callar
        </div>
        {/* botón CTA */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, marginTop: 34, padding: "20px 44px", borderRadius: 999, background: `linear-gradient(150deg, ${TEAL}, #0c8f8b)`, boxShadow: `0 16px 40px ${TEAL}66`, transform: `scale(${pulse})`, opacity: interpolate(frame, [22, 36], [0, 1], cl) }}>
          <svg width="42" height="42" viewBox="0 0 42 42"><rect x="3" y="8" width="36" height="26" rx="7" fill="#fff" /><path d="M18 15 L28 21 L18 27 Z" fill={TEAL} /></svg>
          <span style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 38, color: "#fff" }}>SUSCRIBIRME</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
