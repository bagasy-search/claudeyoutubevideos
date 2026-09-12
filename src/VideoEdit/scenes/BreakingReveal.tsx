import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { COLORS, sec } from "../theme";

const { fontFamily: IMPACT } = loadFont();

// ── BREAKING REVEAL ───────────────────────────────────────────────────────────
// Lower-third estilo "última hora" de noticiero (dispara retención) adaptado a la
// marca del canal (oscuro + ámbar/rojo, Anton de impacto). Se usa cuando Levi
// REVELA algo con un titular exagerado, o para anunciar "SECRETO Nº X".
// Overlay-friendly: banner abajo, resto transparente. Animado: barra entra por izq,
// chip pop, titular con wipe, brillo que barre, badge con punto que late.

type AccentKey = "danger" | "amber" | "good" | "accent";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger,
  amber: COLORS.amber,
  good: COLORS.good,
  accent: COLORS.accent,
};

export const BreakingReveal: React.FC<{
  durationInFrames: number;
  headline: string;        // el titular exagerado (la revelación)
  label?: string;          // chip izquierdo, ej "AL DESCUBIERTO" / "ATENCIÓN"
  number?: string;         // si viene → chip muestra "SECRETO Nº X"
  badge?: string;          // badge tipo "LIVE", ej "AHORA" / "DATO"
  ticker?: string;         // línea de apoyo abajo (opcional)
  accent?: AccentKey;      // color del chip/acento
}> = ({
  durationInFrames,
  headline,
  label = "AL DESCUBIERTO",
  number,
  badge = "AHORA",
  ticker,
  accent = "danger",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const C = TONE[accent];
  const DARK = "#15120E";
  const CREAM = "#FDF7EA";

  // barra entra por la izquierda con snap
  const inS = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 150 } });
  const barX = interpolate(inS, [0, 1], [-60, 0]);
  // wipe de la barra (se dibuja de izq a der)
  const wipe = interpolate(frame, [0, sec(0.45)], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // titular: wipe de izq a der + leve subida
  const hlWipe = interpolate(frame - sec(0.35), [0, sec(0.5)], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const chipS = spring({ frame: frame - sec(0.15), fps, config: { damping: 11, mass: 0.7, stiffness: 200 } });
  // brillo que barre una vez
  const shine = interpolate(frame, [sec(0.5), sec(1.15)], [-0.3, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // punto del badge que late
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin((frame / fps) * Math.PI * 2.2));
  // salida: leve fade al final
  const outO = interpolate(frame, [durationInFrames - sec(0.4), durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  const barShadow = "0 18px 50px rgba(0,0,0,0.55)";

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", opacity: outO }}>
      <div
        style={{
          position: "relative",
          margin: "0 0 96px 72px",
          transform: `translateX(${barX}px)`,
          display: "flex",
          flexDirection: "column",
          maxWidth: width - 220,
          clipPath: `inset(0 ${100 - wipe}% 0 0)`,
        }}
      >
        {/* fila principal: chip + titular */}
        <div style={{ display: "flex", alignItems: "stretch", boxShadow: barShadow }}>
          {/* CHIP izquierdo */}
          <div
            style={{
              background: C,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: number ? "10px 26px 10px 28px" : "0 30px",
              transform: `scale(${0.7 + 0.3 * chipS})`,
              transformOrigin: "left center",
              clipPath: "polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%)",
              minHeight: 116,
            }}
          >
            {number ? (
              <>
                <span style={{ fontFamily: IMPACT, color: "rgba(255,255,255,0.9)", fontSize: 28, letterSpacing: 3, lineHeight: 1 }}>
                  SECRETO
                </span>
                <span style={{ fontFamily: IMPACT, color: "#fff", fontSize: 84, lineHeight: 0.9, textShadow: "0 3px 0 rgba(0,0,0,0.25)" }}>
                  Nº{number}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontFamily: IMPACT,
                  color: "#fff",
                  fontSize: 52,
                  letterSpacing: 2,
                  lineHeight: 1,
                  textShadow: "0 2px 0 rgba(0,0,0,0.25)",
                }}
              >
                {label}
              </span>
            )}
          </div>

          {/* BARRA titular */}
          <div
            style={{
              position: "relative",
              background: DARK,
              display: "flex",
              alignItems: "center",
              padding: "0 44px 0 34px",
              clipPath: "polygon(0 0, 100% 0, calc(100% - 26px) 100%, 0 100%)",
              overflow: "hidden",
              minHeight: 116,
            }}
          >
            <span
              style={{
                fontFamily: IMPACT,
                color: CREAM,
                fontSize: 58,
                letterSpacing: 1,
                lineHeight: 1,
                textTransform: "uppercase",
                clipPath: `inset(0 ${100 - hlWipe}% 0 0)`,
                whiteSpace: "nowrap",
              }}
            >
              {headline}
            </span>
            {/* brillo que barre */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shine * 100}%`,
                width: "22%",
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent)",
                transform: "skewX(-18deg)",
                pointerEvents: "none",
              }}
            />
            {/* filo ámbar inferior */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: COLORS.amber }} />
          </div>
        </div>

        {/* fila inferior: badge + ticker */}
        {(ticker || badge) && (
          <div style={{ display: "flex", alignItems: "stretch", marginTop: 4, boxShadow: barShadow }}>
            {badge && (
              <div
                style={{
                  background: COLORS.amber,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 18px",
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: 999, background: COLORS.danger, opacity: pulse, boxShadow: `0 0 8px ${COLORS.danger}` }} />
                <span style={{ fontFamily: IMPACT, color: DARK, fontSize: 26, letterSpacing: 2 }}>{badge}</span>
              </div>
            )}
            {ticker && (
              <div
                style={{
                  flex: 1,
                  background: "rgba(21,18,14,0.92)",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 22px",
                  marginLeft: badge ? -10 : 0,
                }}
              >
                <span style={{ fontFamily: IMPACT, color: "rgba(253,247,234,0.86)", fontSize: 26, letterSpacing: 0.5, lineHeight: 1.1, textTransform: "uppercase" }}>
                  {ticker}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
