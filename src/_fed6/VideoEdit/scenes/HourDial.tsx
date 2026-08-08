import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── HourDial — "it only happens at ONE hour of the day" ──────────────────────
// Reloj de 24h: 24 marcas grises alrededor de un círculo. Una manecilla barre y
// se DETIENE en la hora nocturna, que se ENCIENDE en dorado/teal y pulsa. Centro
// con el número/etiqueta. Firma nocturna del canal hecha visual. Reutilizable.
//
// Props:
//   hour     índice 0..23 que se enciende (default 2 = ~2am, ventana de reparación)
//   big      texto grande del centro (default "1")
//   unit     texto chico bajo el número (default "hour")
//   label    caption inferior

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE";
const GOLD = "#E9B24A";
const CREAM = "#F5F9FA";
const INK = "#0A151A";

export const HourDial: React.FC<{
  durationInFrames: number;
  hour?: number;
  big?: string;
  unit?: string;
  label?: string;
  tone?: "teal" | "gold";
}> = ({ durationInFrames, hour = 2, big = "1", unit = "hour", label, tone = "gold" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "gold" ? GOLD : TEAL;

  const cx = 960, cy = 500, R = 300;
  const targetAng = (hour / 24) * 360 - 90; // -90 = arriba

  // manecilla: gira ~1.75 vueltas y frena en la hora
  const handSp = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 40 }, durationInFrames: 70 });
  const handAng = interpolate(handSp, [0, 1], [-90, targetAng + 360 * 1.75]);
  const ignited = spring({ frame: frame - 62, fps, config: { damping: 14, stiffness: 120 } });
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);

  const centerSp = spring({ frame: frame - 66, fps, config: { damping: 16, stiffness: 130 } });
  const labelSp = spring({ frame: frame - 74, fps, config: { damping: 18, stiffness: 120 } });

  const ticks = Array.from({ length: 24 }, (_, i) => i);

  return (
    <AbsoluteFill style={{ fontFamily: INTER, background: `radial-gradient(circle at 50% 40%, #12242B 0%, ${INK} 70%)` }}>
      {/* aro base */}
      <div style={{ position: "absolute", left: cx - R - 26, top: cy - R - 26, width: (R + 26) * 2, height: (R + 26) * 2, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.06)" }} />

      {/* marcas de hora */}
      {ticks.map((i) => {
        const a = ((i / 24) * 360 - 90) * (Math.PI / 180);
        const isNight = i >= 22 || i <= 5;
        const isHit = i === hour;
        const rOuter = R, rInner = i % 6 === 0 ? R - 34 : R - 20;
        const x1 = cx + Math.cos(a) * rInner, y1 = cy + Math.sin(a) * rInner;
        const x2 = cx + Math.cos(a) * rOuter, y2 = cy + Math.sin(a) * rOuter;
        const col = isHit ? accent : isNight ? "rgba(233,178,74,0.28)" : "rgba(255,255,255,0.16)";
        return (
          <svg key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={isHit ? 8 : i % 6 === 0 ? 5 : 3} strokeLinecap="round"
              opacity={isHit ? ignited : 1} style={isHit ? { filter: `drop-shadow(0 0 ${10 * glow}px ${accent})` } : undefined} />
          </svg>
        );
      })}

      {/* punto encendido de la hora nocturna */}
      {(() => {
        const a = (targetAng) * (Math.PI / 180);
        const px = cx + Math.cos(a) * (R + 4), py = cy + Math.sin(a) * (R + 4);
        return (
          <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${ignited})`, width: 42, height: 42, borderRadius: 24, background: accent, boxShadow: `0 0 ${26 * glow}px 8px ${accent}, 0 0 60px ${accent}88` }} />
        );
      })()}

      {/* manecilla */}
      <div style={{ position: "absolute", left: cx, top: cy, width: R - 30, height: 6, background: `linear-gradient(90deg, ${accent}00, ${accent})`, transformOrigin: "0% 50%", transform: `rotate(${handAng}deg)`, borderRadius: 4, boxShadow: `0 0 18px ${accent}aa` }} />
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", width: 26, height: 26, borderRadius: 14, background: CREAM, boxShadow: `0 0 14px ${accent}` }} />

      {/* centro: número + unidad */}
      <div style={{ position: "absolute", left: cx, top: cy + R + 92, transform: `translate(-50%,0) scale(${centerSp})`, textAlign: "center" }}>
        <div style={{ fontSize: 150, fontWeight: 900, color: accent, lineHeight: 0.9, textShadow: `0 0 40px ${accent}66` }}>{big}</div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 8, color: CREAM, textTransform: "uppercase", marginTop: 6 }}>{unit}</div>
      </div>

      {/* caption inferior */}
      {label && (
        <div style={{ position: "absolute", left: "50%", bottom: 54, transform: `translateX(-50%) translateY(${(1 - labelSp) * 18}px)`, opacity: labelSp, maxWidth: 1500, textAlign: "center" }}>
          <span style={{ fontSize: 46, fontWeight: 800, color: CREAM }}>{label}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
