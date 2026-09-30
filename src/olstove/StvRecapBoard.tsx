// StvRecapBoard — el repaso de las cuatro reglas en un cartel grande de madera/kraft sobre fondo vivo. Cada regla se tilda a lápiz cuando Ole la dice.
// Props: items[], beats[] (s de cada tilde), bed, title. Tipografía grande (renglón de 92 px), nada de tarjetita.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, kraftBg } from "./OleTheme";
import { OleBed } from "./OleBookPage";

const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const StvRecapBoard: React.FC<{ title?: string; items?: string[]; beats?: number[]; bed: string }> = ({ title = "Before you light anything", items = ["A CO alarm that works", "Nothing from a can", "Space around the stove", "Ashes in a metal pail"], beats, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps, dur = durationInFrames / fps;
  const inS = spring({ frame: f - 2, fps, config: { damping: 15, mass: 0.9 } });
  const out = interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bs = items.map((_, i) => beats?.[i] ?? dur * (0.18 + 0.2 * i));
  return (
    <AbsoluteFill style={{ opacity: 0.4 + 0.6 * out }}>
      <OleBed src={bed} veil={0.35} veilColor={OLE.forest2} push={0.06} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(20,12,6,0.10), rgba(20,12,6,0.6))" }} />
      <div style={{ position: "absolute", left: 210, top: 110 + (1 - inS) * 90, width: 1500, height: 860, ...kraftBg(OLE.kraftL), boxShadow: "0 34px 80px rgba(10,6,2,0.7)", borderRadius: 8, transform: "rotate(-0.8deg)" }}>
        <div style={{ position: "absolute", left: 70, top: 44, fontFamily: LABEL, fontSize: 50, letterSpacing: 9, color: OLE.plaid }}>{title.toUpperCase()}</div>
        {items.map((it, i) => {
          const ck = c01((t - bs[i]) / 0.35);
          return (
            <div key={i} style={{ position: "absolute", left: 70, top: 150 + i * 168, right: 60, height: 140, display: "flex", alignItems: "center", opacity: c01((t - 0.3 - i * 0.12) / 0.3) }}>
              <svg width="120" height="120" viewBox="0 0 60 60" style={{ marginRight: 40, flex: "none" }}>
                <rect x="6" y="6" width="48" height="48" rx="6" fill="rgba(255,255,255,0.35)" stroke={OLE.pencil} strokeWidth="4" />
                <path d="M14 32 L26 44 L52 12" fill="none" stroke="#2F7A45" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - ck)} />
              </svg>
              <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, lineHeight: "96px", color: OLE.forest }}>{it}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
export default StvRecapBoard;
