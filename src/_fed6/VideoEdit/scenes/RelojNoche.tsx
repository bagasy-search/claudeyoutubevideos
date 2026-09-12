import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── RelojNoche (explainer animado, avatar afuera) ────────────────────────────
// La línea de tiempo de la NOCHE: cena → dormir → sueño profundo (ventana de
// reparación del ojo, resaltada) → despertar. Muestra dónde pegan los errores.
// Molde PRO: sobrio, 1 tipografía, paleta mínima, reveal por etapas.

const INTER = loadInter().fontFamily;
const C = {
  bg: "#F7FAFB", ink: "#152430", sub: "#5A6B76",
  teal: "#0E9C99", tealDim: "#D3ECEB", coral: "#E0523E", line: "#DCE6EA",
};
const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// timeline: x de 220 a 1700. hitos por hora relativa (0=8pm ... 11=7am)
const X0 = 240, X1 = 1700, Y = 560;
const at = (h: number) => X0 + (h / 11) * (X1 - X0);

const MARKS_DEF = [
  { h: 0, label: "Cena", sub: "8 pm", at: 40 },
  { h: 3, label: "Dormir", sub: "11 pm", at: 70 },
  { h: 6.5, label: "Sueño profundo", sub: "madrugada", at: 130, big: true },
  { h: 11, label: "Despertar", sub: "7 am", at: 250 },
];
// dónde pegan los errores (coral)
const HITS_DEF = [
  { h: 1.2, label: "café / mate tarde", at: 200 },
  { h: 0.4, label: "azúcar en la cena", at: 220 },
];

export const RelojNoche: React.FC<{
  durationInFrames: number;
  // ⚠️ props OPCIONALES con los valores originales como default → cero regresión en los
  // videos que ya la usan (ojos). Sirven para adaptar la escena al tema de CADA video.
  subtitle?: string;
  marks?: { h: number; label: string; sub: string; at: number; big?: boolean }[];
  hits?: { h: number; label: string; at: number }[];
}> = ({ durationInFrames, subtitle, marks, hits }) => {
  const MARKS = marks ?? MARKS_DEF;
  const HITS = hits ?? HITS_DEF;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // franja de reparación (sueño profundo) que crece
  const repW = interpolate(frame, [130, 175], [0, at(9) - at(4.5)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // línea base que se dibuja
  const lineW = interpolate(frame, [20, 60], [0, X1 - X0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: INTER }}>
      <div style={{ position: "absolute", top: 90, left: 96, opacity: fade(frame, 4, 20) }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.teal }}>La noche</div>
        <div style={{ fontSize: 54, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>{subtitle ?? "La ventana de reparación de tus ojos"}</div>
      </div>

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* franja del sueño profundo (reparación) */}
        <rect x={at(4.5)} y={Y - 60} width={repW} height="120" rx="16" fill={C.tealDim} />
        <text x={at(6.5)} y={Y - 84} fontFamily={INTER} fontSize="26" fontWeight={800} fill={C.teal} textAnchor="middle" opacity={fade(frame, 160, 185)}>
          acá se reparan tus ojos
        </text>

        {/* línea base de la noche */}
        <line x1={X0} y1={Y} x2={X0 + lineW} y2={Y} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />

        {/* hitos */}
        {MARKS.map((m, i) => {
          const app = spring({ frame: frame - m.at, fps, config: { damping: 18, stiffness: 120 } });
          if (frame < m.at - 4) return null;
          const x = at(m.h);
          return (
            <g key={i} opacity={app} transform={`translate(${x} ${Y})`}>
              <circle cx="0" cy="0" r={m.big ? 16 : 11} fill={m.big ? C.teal : "#FFFFFF"} stroke={C.teal} strokeWidth="4" />
              <text x="0" y={m.big ? -34 : 56} fontFamily={INTER} fontSize={m.big ? 30 : 26} fontWeight={800} fill={C.ink} textAnchor="middle">{m.label}</text>
              <text x="0" y={m.big ? -8 : 84} fontFamily={INTER} fontSize="20" fill={C.sub} textAnchor="middle">{m.sub}</text>
            </g>
          );
        })}

        {/* errores que pegan */}
        {HITS.map((h, i) => {
          const app = spring({ frame: frame - h.at, fps, config: { damping: 16, stiffness: 130 } });
          if (frame < h.at - 4) return null;
          const x = at(h.h);
          return (
            <g key={i} opacity={app} transform={`translate(${x} ${Y})`}>
              <line x1="0" y1="0" x2="0" y2="140" stroke={C.coral} strokeWidth="3" strokeDasharray="6 6" />
              <circle cx="0" cy="140" r="9" fill={C.coral} />
              <text x="0" y={180 + i * 34} fontFamily={INTER} fontSize="23" fontWeight={700} fill={C.coral} textAnchor="middle">✕ {h.label}</text>
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 96, bottom: 90, right: 96, opacity: fade(frame, 285, 310), borderTop: `2px solid ${C.line}`, paddingTop: 26 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>
          Lo que hacés antes de dormir decide si esa <span style={{ color: C.teal }}>ventana se abre</span>.
        </span>
      </div>
    </AbsoluteFill>
  );
};
