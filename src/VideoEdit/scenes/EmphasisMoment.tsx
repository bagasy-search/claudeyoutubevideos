import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── EmphasisMoment ────────────────────────────────────────────────────────────
// En una FRASE CLAVE ("escúchame bien", "empieza hoy"), el avatar salta a PANTALLA
// COMPLETA (encima de todo) por el tiempo que la dice + la frase entra grande,
// palabra por palabra. Da el golpe de énfasis. Se cablea en el overlay del Main.
const TEAL = "#12B3AE";

export const EmphasisMoment: React.FC<{
  durationInFrames: number;
  avatarFromSec: number; // seg globales donde empieza la ventana (para seekear el avatar)
  text: string;
  avatarSrc?: string; // mp4 del avatar (default federer)
}> = ({ durationInFrames: D, avatarFromSec, text, avatarSrc = "federer_opt.mp4" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const inO = interpolate(frame, [0, 6], [0, 1], cl);
  const outO = interpolate(frame, [D - 9, D], [1, 0], cl);
  const op = Math.min(inO, outO);
  const words = text.split(" ");

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo
        src={staticFile(avatarSrc)}
        trimBefore={Math.max(0, Math.round(avatarFromSec * fps))}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* scrim inferior para legibilidad */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(7,13,17,0.9) 0%, rgba(7,13,17,0.35) 38%, transparent 66%)" }} />
      {/* barra de acento arriba (marca de "momento clave") */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(90deg, ${TEAL}, transparent)`, transform: `scaleX(${interpolate(frame, [0, 14], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) })})`, transformOrigin: "left" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "13%", textAlign: "center", padding: "0 7%", lineHeight: 1.1 }}>
        {words.map((w, i) => {
          const at = 8 + i * 5;
          const e = interpolate(frame, [at, at + 9], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
          const sc = spring({ frame: frame - at, fps, config: { damping: 12, mass: 0.7, stiffness: 150 } });
          return (
            <span
              key={i}
              style={{
                fontFamily: F_INTER, fontWeight: 900, fontSize: 98, color: "#fff",
                opacity: e, margin: "0 14px", display: "inline-block",
                transform: `translateY(${interpolate(e, [0, 1], [24, 0])}px) scale(${interpolate(sc, [0, 1], [1.25, 1])})`,
                textShadow: "0 8px 34px rgba(0,0,0,0.85)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
