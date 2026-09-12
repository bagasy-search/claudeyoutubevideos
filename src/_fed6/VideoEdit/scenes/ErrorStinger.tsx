import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { SfxCue, SFX, BOOMS } from "../components/Sfx";

// ── ErrorStinger — pattern interrupt entre secciones ("ERROR 04") ────────────
// Golpe full-screen rápido (~1.8s): swipe diagonal + número gigante + título que
// aterriza, con boom grave. Cada ~3-4 min corta la monotonía (la data lo pide).

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", RED = "#E4141B", INK = "#0A141A", CREAM = "#F5F9FA";

export const ErrorStinger: React.FC<{
  durationInFrames: number;
  number: string;   // "04" o "★"
  title: string;
  tone?: "teal" | "warn";
  eyebrow?: string; // "ERROR" | "BENEFICIO" | "PASO" | "EL ESTUDIO" …
}> = ({ durationInFrames, number, title, tone = "teal", eyebrow = "Error" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? RED : TEAL;

  // swipe diagonal que barre la pantalla
  const swipe = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swipeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numSp = spring({ frame: frame - 8, fps, config: { damping: 12, mass: 0.6, stiffness: 150 } });
  const titSp = spring({ frame: frame - 16, fps, config: { damping: 16, stiffness: 130 } });
  const shake = frame < 20 ? Math.sin(frame * 1.6) * (20 - frame) * 0.4 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK, opacity: interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" }) }}>
      {/* barrido diagonal de acento */}
      <AbsoluteFill style={{ transform: `translateX(${interpolate(swipe, [0, 1], [-2200, 0])}px) translateX(${interpolate(swipeOut, [0, 1], [0, 2200])}px) skewX(-14deg)`, background: `linear-gradient(90deg, ${accent}, ${accent}dd)`, left: "-20%", width: "80%" }} />
      <AbsoluteFill style={{ background: "radial-gradient(90% 90% at 50% 50%, transparent, rgba(10,20,26,0.6))" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 10, textTransform: "uppercase", color: CREAM, opacity: titSp }}>{eyebrow}</div>
          <div style={{ fontSize: 340, fontWeight: 900, lineHeight: 0.9, color: "#fff", opacity: numSp, transform: `scale(${interpolate(numSp, [0, 1], [1.4, 1])})`, textShadow: `0 0 60px ${accent}` }}>{number}</div>
          <div style={{ fontSize: 74, fontWeight: 900, color: CREAM, letterSpacing: -0.5, opacity: titSp, transform: `translateY(${(1 - titSp) * 24}px)` }}>{title}</div>
        </div>
      </AbsoluteFill>

      <SfxCue at={2} src={SFX.whoosh ?? SFX.kickerType} volume={0.22} />
      <SfxCue at={9} src={BOOMS?.[0] ?? SFX.kickerType} volume={0.42} />
    </AbsoluteFill>
  );
};
