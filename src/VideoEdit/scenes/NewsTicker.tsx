import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── NEWS TICKER ───────────────────────────────────────────────────────────────
// Cinta de datos que corre abajo (crawl de noticiero): label fijo + texto que
// scrollea sin fin. Llena el borde inferior y sube retención. Marca oscura + ámbar.
export const NewsTicker: React.FC<{
  durationInFrames: number;
  items: string[];         // datos que rotan
  label?: string;          // "DATO" / "EN VIVO"
  accent?: "amber" | "danger" | "good";
  speed?: number;          // px/frame (default 5)
}> = ({ durationInFrames, items, label = "DATO", accent = "danger", speed = 5 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const C = accent === "amber" ? COLORS.amber : accent === "good" ? COLORS.good : COLORS.danger;
  const DARK = "#15120E", CREAM = "#FDF7EA";
  const inS = spring({ frame, fps, config: { damping: 20, mass: 0.8, stiffness: 150 } });
  const y = interpolate(inS, [0, 1], [70, 0]);
  const outO = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const dot = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2.2));
  const text = items.join("      ◆      ") + "      ◆      ";
  const shift = ((frame * speed) % 4000);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", opacity: outO }}>
      <div style={{ transform: `translateY(${y}px)`, display: "flex", alignItems: "stretch", height: 72, boxShadow: "0 -6px 24px rgba(0,0,0,0.35)" }}>
        <div style={{ background: C, display: "flex", alignItems: "center", gap: 12, padding: "0 32px 0 36px", clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)", zIndex: 2 }}>
          <span style={{ width: 15, height: 15, borderRadius: 999, background: "#fff", opacity: dot }} />
          <span style={{ fontFamily: IMPACT, color: "#fff", fontSize: 30, letterSpacing: 2 }}>{label}</span>
        </div>
        <div style={{ flex: 1, background: DARK, overflow: "hidden", display: "flex", alignItems: "center", marginLeft: -8, borderTop: `2px solid ${C}` }}>
          <div style={{ whiteSpace: "nowrap", transform: `translateX(${-shift}px)`, fontFamily: IMPACT, color: CREAM, fontSize: 30, letterSpacing: 1, textTransform: "uppercase" }}>
            {text}{text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
