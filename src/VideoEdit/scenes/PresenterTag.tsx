import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS, SERIF } from "../theme";
import { Media } from "../components/Media";

const { fontFamily: IMPACT } = loadFont();

// ── PRESENTER TAG ─────────────────────────────────────────────────────────────
// Placa de presentador (lower-third de nombre) tipo noticiero premium: autoridad
// instantánea cuando arranca a hablar. Marca del canal (oscuro + ámbar).
export const PresenterTag: React.FC<{
  durationInFrames: number;
  name: string;            // "LEVI LAPP"
  subtitle?: string;       // "Huerta a la vieja usanza · 3ª generación"
  image?: string;          // retrato opcional (imagen/clip)
  accent?: "amber" | "danger" | "good" | "accent";
}> = ({ durationInFrames, name, subtitle = "", image, accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent === "amber" ? COLORS.amber : accent === "danger" ? COLORS.danger : accent === "good" ? COLORS.good : COLORS.accent;
  const DARK = "#15120E", CREAM = "#FDF7EA";
  const inS = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 150 } });
  const x = interpolate(inS, [0, 1], [-80, 0]);
  const wipe = interpolate(frame, [0, 13], [0, 100], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const barW = interpolate(frame - 6, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outO = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", opacity: outO }}>
      <div style={{ display: "flex", alignItems: "flex-end", margin: "0 0 92px 72px", transform: `translateX(${x}px)`, clipPath: `inset(0 ${100 - wipe}% 0 0)`, boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
        {image && (
          <div style={{ width: 134, height: 134, overflow: "hidden", border: `5px solid ${C}`, background: DARK }}>
            <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ background: DARK, padding: "20px 50px 20px 32px", display: "flex", flexDirection: "column", justifyContent: "center", clipPath: "polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%)" }}>
          <div style={{ fontFamily: IMPACT, color: CREAM, fontSize: 60, lineHeight: 1, letterSpacing: 1 }}>{name}</div>
          {subtitle && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
              <div style={{ height: 4, width: 54 * barW, background: C }} />
              <span style={{ fontFamily: SERIF, color: "rgba(253,247,234,0.82)", fontSize: 28, fontStyle: "italic" }}>{subtitle}</span>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
