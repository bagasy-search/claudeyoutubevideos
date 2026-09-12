import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── DocNameCard ───────────────────────────────────────────────────────────────
// Tarjeta de presentación GLASSMÓRFICA (canal Dr. Federer). Se renderiza como
// OVERLAY sobre el avatar vivo en el hook (cuando dice "Soy el doctor Federer"),
// como un lower-third flotante que NO tapa la cara. Vidrio esmerilado, bordes muy
// redondeados, foto casual + nombre + rol, acento teal clínico. Entra deslizando.
const TEAL = "#12B3AE";
const INK = "#14232B";

export const DocNameCard: React.FC<{
  durationInFrames: number;
  image?: string;   // foto casual (img/federer_casual.png)
  name?: string;
  role?: string;
  side?: "left" | "right";
  focus?: string;   // objectPosition de la foto (apuntar a la cara)
}> = ({
  durationInFrames,
  image = "img/federer_casual.png",
  name = "Dr. Federer",
  role = "Médico",
  side = "left",
  focus = "34% 28%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 130 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = Math.min(enter, out);
  const dx = interpolate(enter, [0, 1], [side === "left" ? -70 : 70, 0]);

  // acento y foto entran con un pelín de delay
  const accent = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 96,
          [side]: 92,
          opacity: op,
          transform: `translateX(${dx}px)`,
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "22px 40px 22px 22px",
          borderRadius: 34,
          // vidrio esmerilado
          background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.52))",
          backdropFilter: "blur(22px) saturate(150%)",
          WebkitBackdropFilter: "blur(22px) saturate(150%)",
          border: "1.5px solid rgba(255,255,255,0.85)",
          boxShadow:
            "0 30px 70px rgba(20,35,43,0.34), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* foto casual en recuadro redondeado */}
        <div
          style={{
            width: 130,
            height: 150,
            borderRadius: 24,
            overflow: "hidden",
            flex: "0 0 auto",
            boxShadow: "0 10px 26px rgba(20,35,43,0.28)",
            border: "3px solid rgba(255,255,255,0.95)",
            transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
          }}
        >
          <Img
            src={staticFile(image)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus }}
          />
        </div>

        {/* textos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingRight: 8 }}>
          <div
            style={{
              fontFamily: F_INTER,
              fontWeight: 800,
              fontSize: 58,
              lineHeight: 1,
              color: INK,
              letterSpacing: -0.5,
            }}
          >
            {name}
          </div>
          {/* barra de acento que se dibuja */}
          <div
            style={{
              height: 6,
              width: 96,
              borderRadius: 4,
              background: TEAL,
              transform: `scaleX(${accent})`,
              transformOrigin: "left center",
              boxShadow: `0 0 16px ${TEAL}88`,
            }}
          />
          <div
            style={{
              fontFamily: F_INTER,
              fontWeight: 500,
              fontSize: 27,
              lineHeight: 1.25,
              color: "rgba(20,35,43,0.72)",
              maxWidth: 560,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
