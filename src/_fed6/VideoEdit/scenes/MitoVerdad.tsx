import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── MitoVerdad — la tarjeta MITO → (flip) → VERDAD ───────────────────────────
// Aparece el MITO tachado en rojo (X); en `flipAt` hace un FLIP 3D y muestra la
// VERDAD en teal (✓). El desmentido, que es la firma del canal.

const INTER = loadInter().fontFamily;
const RED = "#E4141B", TEAL = "#12B3AE", INK = "#0E1B22", CREAM = "#F5F9FA";

export const MitoVerdad: React.FC<{
  durationInFrames: number;
  myth: string;
  truth: string;
  flipAt?: number; // frame del flip (default a la mitad)
  mythLabel?: string;
  truthLabel?: string;
}> = ({ durationInFrames, myth, truth, flipAt, mythLabel = "MITO", truthLabel = "LA VERDAD" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fA = flipAt ?? Math.round(durationInFrames * 0.42);

  const inS = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const deg = interpolate(frame, [fA, fA + 16], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const front = deg < 90;

  const Face: React.FC<{ back?: boolean; children: React.ReactNode }> = ({ back, children }) => (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateX(180deg)" : undefined, borderRadius: 30, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: `2px solid ${back ? TEAL : RED}66`, boxShadow: "0 40px 110px rgba(0,0,0,0.5)" }}>
      {children}
    </div>
  );

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK }}>
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 40%, rgba(20,35,43,0.4), rgba(10,20,26,0.92))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ perspective: 1600, opacity: inS, transform: `scale(${interpolate(inS, [0, 1], [0.92, 1])})` }}>
          <div style={{ position: "relative", width: 1240, height: 460, transformStyle: "preserve-3d", transform: `rotateX(${deg}deg)` }}>
            {/* FRENTE — MITO */}
            <Face>
              <Chip color={RED} icon="✕" label={mythLabel} />
              <div style={{ fontSize: 66, fontWeight: 900, color: CREAM, lineHeight: 1.1, marginTop: 26, textDecoration: front ? "line-through" : "none", textDecorationColor: `${RED}cc`, textDecorationThickness: 6 }}>{myth}</div>
            </Face>
            {/* DORSO — VERDAD */}
            <Face back>
              <Chip color={TEAL} icon="✓" label={truthLabel} />
              <div style={{ fontSize: 66, fontWeight: 900, color: CREAM, lineHeight: 1.1, marginTop: 26 }}>{truth}</div>
            </Face>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ color: string; icon: string; label: string }> = ({ color, icon, label }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, alignSelf: "flex-start" }}>
    <div style={{ width: 54, height: 54, borderRadius: 14, background: color, color: "#fff", fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
    <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color }}>{label}</div>
  </div>
);
