import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── ALERT WIPE ────────────────────────────────────────────────────────────────
// Flash "ATENCIÓN" (barra que barre la pantalla) — transición corta entre beats
// para el momento del error/aviso. Sube la energía. Overlay, dur corta (~0.8s).
export const AlertWipe: React.FC<{
  durationInFrames: number;
  text?: string;           // "ATENCIÓN"
  accent?: "danger" | "amber";
}> = ({ durationInFrames, text = "ATENCIÓN", accent = "danger" }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const C = accent === "amber" ? COLORS.amber : COLORS.danger;
  const DARK = "#15120E";
  const p = frame / durationInFrames;
  // la banda entra por la izq (0→50%) y sale por la der (50→100%)
  const enter = interpolate(p, [0, 0.5], [-1.2, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const exit = interpolate(p, [0.5, 1], [0, 1.4], { extrapolateLeft: "clamp", easing: Easing.in(Easing.cubic) });
  const tx = (enter + exit) * width;
  const textO = interpolate(p, [0.15, 0.35, 0.62, 0.82], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strip = text + "   ●   " + text + "   ●   " + text + "   ●   ";

  return (
    <AbsoluteFill style={{ justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "34%", height: "32%", left: 0, right: 0, background: C, transform: `translateX(${tx}px) skewX(-8deg)`, display: "flex", alignItems: "center", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}>
        <div style={{ whiteSpace: "nowrap", fontFamily: IMPACT, color: DARK, fontSize: 112, letterSpacing: 6, opacity: textO, transform: "skewX(8deg)", paddingLeft: 40 }}>{strip}</div>
      </div>
      {/* filo oscuro delante de la banda para el borde */}
      <div style={{ position: "absolute", top: "34%", height: "32%", width: 10, left: 0, background: DARK, transform: `translateX(${tx + width * 0.5 + 6}px)`, opacity: 0.9 }} />
    </AbsoluteFill>
  );
};
