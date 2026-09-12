import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── STAT SLAM ─────────────────────────────────────────────────────────────────
// Número GIGANTE que entra con un golpe (escala + sacudida + destello). Para datos
// fuertes ("9 DE CADA 10"). Overlay centrado, marca oscura + ámbar.
export const StatSlam: React.FC<{
  durationInFrames: number;
  figure: string;          // "9 de cada 10"
  caption?: string;        // "mueren ahogadas, no de sed"
  eyebrow?: string;        // "el dato que nadie te dice"
  accent?: "danger" | "amber" | "good";
}> = ({ durationInFrames, figure, caption = "", eyebrow = "", accent = "danger" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent === "amber" ? COLORS.amber : accent === "good" ? COLORS.good : COLORS.danger;
  const CREAM = "#FDF7EA";
  const slam = spring({ frame, fps, config: { damping: 10, mass: 0.9, stiffness: 210 } });
  const scale = interpolate(slam, [0, 1], [1.5, 1]);
  const shake = frame < 9 ? Math.sin(frame * 2.4) * (9 - frame) * 1.1 : 0;
  const flash = interpolate(frame, [0, 3, 12], [0.5, 0.22, 0], { extrapolateRight: "clamp" });
  const capS = spring({ frame: frame - 7, fps, config: { damping: 20 } });
  const ebS = spring({ frame: frame - 3, fps, config: { damping: 22 } });
  const outO = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  const scrimO = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" }) * outO;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: outO }}>
      {/* SCRIM oscuro para contraste sobre cualquier fondo */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(68% 58% at 50% 50%, rgba(0,0,0,0.70), rgba(0,0,0,0.30) 66%, rgba(0,0,0,0) 100%)", opacity: scrimO }} />
      <div style={{ position: "absolute", width: 720, height: 720, borderRadius: 999, background: C, opacity: flash, filter: "blur(60px)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateX(${shake}px)` }}>
        {eyebrow && <span style={{ fontFamily: IMPACT, color: CREAM, fontSize: 34, letterSpacing: 4, textTransform: "uppercase", opacity: ebS, marginBottom: 8, textShadow: `0 2px 10px rgba(0,0,0,0.8)`, borderBottom: `3px solid ${C}`, paddingBottom: 4 }}>{eyebrow}</span>}
        <span style={{ fontFamily: IMPACT, color: CREAM, fontSize: 190, lineHeight: 0.9, letterSpacing: 1, textTransform: "uppercase", transform: `scale(${scale})`, textShadow: `0 6px 0 rgba(0,0,0,0.45), 0 4px 24px rgba(0,0,0,0.9), 0 0 46px ${C}66` }}>{figure}</span>
        {caption && (
          <span style={{ fontFamily: IMPACT, color: CREAM, fontSize: 52, letterSpacing: 1, textTransform: "uppercase", marginTop: 18, opacity: capS, background: "rgba(21,18,14,0.72)", padding: "8px 28px", borderBottom: `6px solid ${C}` }}>{caption}</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
