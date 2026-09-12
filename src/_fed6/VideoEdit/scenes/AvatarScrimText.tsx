import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

type AccentKey = "accent" | "amber" | "good" | "cold" | "danger";

// ── AvatarScrimText ──────────────────────────────────────────────────────────
// Texto del HOOK / re-hook que va ENCIMA del avatar VIVO: oscurece la imagen del
// presentador (scrim radial) y pone el texto arriba, en vez de cortar a un color
// sólido o a una foto estática. Mucho más profesional: el avatar sigue hablando
// detrás, atenuado, y el texto resalta con scrim + sombra (siempre legible).
// Se renderiza DESPUÉS del <AvatarLayer> (full) en el Main.
export const AvatarScrimText: React.FC<{
  durationInFrames: number;
  setup?: string;       // línea chica arriba (serif itálica, crema)
  impact: string;       // línea grande (acento)
  impactAccent?: AccentKey;
  fontSize?: number;
  accentColor?: string; // override directo del color de acento (ej. teal clínico)
  font?: string;        // override de la tipografía (ej. Inter para el look médico)
}> = ({ durationInFrames, setup, impact, impactAccent = "amber", fontSize = 150, accentColor, font }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = accentColor ?? COLORS[impactAccent];
  const FONT = font ?? FONT_STACK;
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const outP = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], cl);
  // 1) el SCRIM oscurece PRIMERO (0→18f), fuerte
  const scrimOp = interpolate(frame, [0, 18], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  // 2) el setup entra con el scrim
  const setupOp = interpolate(frame, [4, 20], [0, 1], cl);
  // 3) la PALABRA hace BUM DESPUÉS (delay ~14f): escala 1.4→1 con rebote + blur→nítido
  const boom = spring({ frame: frame - 14, fps, config: { damping: 11, mass: 0.9, stiffness: 130 } });
  const wordOp = interpolate(frame, [14, 24], [0, 1], cl);
  const wordScale = interpolate(boom, [0, 1], [1.42, 1]);
  const wordBlur = interpolate(interpolate(frame, [14, 28], [0, 1], cl), [0, 1], [24, 0]);
  // 4) flash corto del acento al impactar (el "choque")
  const flash = interpolate(frame, [18, 22, 30], [0, 0.5, 0], cl);
  const underline = interpolate(frame, [28, 46], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ opacity: outP, pointerEvents: "none" }}>
      {/* SCRIM: oscurece al avatar (aparece primero, fuerte) */}
      <AbsoluteFill style={{ opacity: scrimOp, background: `radial-gradient(120% 95% at 50% 54%, rgba(12,10,8,0.86) 0%, rgba(12,10,8,0.72) 46%, rgba(12,10,8,0.6) 100%)` }} />
      {/* flash del acento al impactar */}
      <AbsoluteFill style={{ opacity: flash, background: `radial-gradient(60% 45% at 50% 52%, ${accent}, transparent 70%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: "0 10%" }}>
        {setup && (
          <div style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 46, color: "rgba(255,247,232,0.94)", textAlign: "center", textShadow: "0 2px 18px rgba(0,0,0,0.85)", opacity: setupOp }}>
            {setup}
          </div>
        )}
        <div style={{ position: "relative", opacity: wordOp, transform: `scale(${wordScale})`, filter: `blur(${wordBlur}px)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize, lineHeight: 1.02, color: accent, textAlign: "center", textShadow: "0 6px 34px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.7)" }}>
            {impact}
          </div>
          <div style={{ height: 8, marginTop: 12, marginLeft: "14%", marginRight: "14%", background: accent, borderRadius: 6, transform: `scaleX(${underline})`, transformOrigin: "left center", boxShadow: `0 0 22px ${accent}` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
