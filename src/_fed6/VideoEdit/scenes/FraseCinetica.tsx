import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── FraseCinetica — la frase clave aparece PALABRA POR PALABRA ───────────────
// Sincronizada a la voz; las palabras marcadas caen en acento (teal/rojo) con un
// resaltado. Para las líneas que importan → engancha línea a línea (retención).

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", RED = "#E4141B", CREAM = "#F5F9FA";

export type FWord = { t: string; hl?: boolean };

export const FraseCinetica: React.FC<{
  durationInFrames: number;
  words: FWord[];
  perWord?: number;   // frames entre palabra y palabra (si no hay `ats`)
  ats?: number[];     // frame EXACTO de cada palabra (ms del avatar) — opcional
  tone?: "teal" | "warn";
  onImage?: boolean;  // si va sobre foto/oscuro → agrega scrim
}> = ({ durationInFrames, words, perWord = 9, ats, tone = "teal", onImage = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? RED : TEAL;
  const starts = words.map((_, i) => (ats && ats[i] != null ? ats[i] : i * perWord));
  // SALIDA = CORTE LIMPIO (antes: disolvía en 12f). Las palabras entran una por una clavadas a la
  // voz; que después se desvanezcan todas juntas rompe justamente el efecto de sincronía.
  const out = 1;

  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      {onImage && <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 62%, rgba(10,20,26,0.15), rgba(10,20,26,0.78))" }} />}
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 150, opacity: out }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 22px", justifyContent: "center", lineHeight: 1.14 }}>
          {words.map((w, i) => {
            const p = spring({ frame: frame - starts[i], fps, config: { damping: 15, mass: 0.5, stiffness: 150 } });
            if (frame < starts[i] - 2) return null;
            return (
              <span key={i} style={{ position: "relative", display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
                {w.hl && (
                  <span style={{ position: "absolute", inset: "6px -12px", background: `${accent}`, borderRadius: 10, transform: `scaleX(${interpolate(p, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, transformOrigin: "left", opacity: 0.9, zIndex: 0 }} />
                )}
                <span style={{ position: "relative", zIndex: 1, fontSize: 82, fontWeight: 900, letterSpacing: -1, color: w.hl ? "#fff" : CREAM, textShadow: w.hl ? "none" : "0 4px 24px rgba(0,0,0,0.6)" }}>{w.t}</span>
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
