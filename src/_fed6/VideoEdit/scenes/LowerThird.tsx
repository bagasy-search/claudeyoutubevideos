import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── LowerThird (COMPONENTE #3) — BANNER estilo NOTICIERO ─────────────────────
// Formato "breaking news": banner HORIZONTAL (largo y bajo) con bordes inclinados:
//   [ bloque de acento: ETIQUETA ] [ barra clara: TÍTULO ]
//   ── línea fina debajo: descripción · · · DR. FEDERER
// Para advertencias / datos / remarcar algo shockeante. tone: "teal" | "warn"(rojo).

const INTER = loadInter().fontFamily;
const SK = -11; // grados de inclinación (parallelogramo)

export const LowerThird: React.FC<{
  durationInFrames: number;
  title: string;
  desc?: string;
  tag?: string;              // 3er textito (marca), default "DR. FEDERER"
  tone?: "teal" | "warn";
  kicker?: string;           // etiqueta del bloque de acento (ej. "ADVERTENCIA", "DATO")
}> = ({ durationInFrames, title, desc, tag = "DR. FEDERER", tone = "teal", kicker = "DR. FEDERER" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? "#E4141B" : "#12B3AE";
  const accentDark = tone === "warn" ? "#B00E13" : "#0C8A86";

  // entrada: slide desde la izquierda + la barra del título "crece"
  const inS = spring({ frame, fps, config: { damping: 20, mass: 0.8, stiffness: 120 } });
  // SALIDA = CORTE LIMPIO. Antes se disolvía en 12f, y sobre un gráfico de bordes duros como este
  // el cross-fade se ve como un fantasma: el banner entra con movimiento (slide + la barra que
  // crece) y salía derritiéndose en el lugar. Esa asimetría es lo que quedaba mal. Un banner de
  // noticiero no se disuelve: está o no está. (Regla del creador: corte limpio, cero fades.)
  const out = 1;
  const x = interpolate(inS, [0, 1], [-620, 0]);
  const barGrow = interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * out;
  const op = Math.min(inS, out);

  const H = 92; // alto del banner principal (bajito, tipo noticiero)

  const skew = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
    transform: `skewX(${SK}deg)`, background: bg, height: H, display: "flex", alignItems: "center", ...extra,
  });
  const unskew: React.CSSProperties = { transform: `skewX(${-SK}deg)`, display: "flex", alignItems: "center" };

  return (
    <AbsoluteFill style={{ fontFamily: INTER, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, bottom: 104, transform: `translateX(${x}px)`, opacity: op }}>
        {/* ── BANNER PRINCIPAL ── */}
        <div style={{ display: "flex", alignItems: "stretch", filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.45))" }}>
          {/* bloque de acento (etiqueta) */}
          <div style={{ ...skew(`linear-gradient(180deg, ${accent}, ${accentDark})`), padding: "0 34px 0 40px", marginRight: 4 }}>
            <div style={{ ...unskew, color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</div>
          </div>
          {/* barra clara con el TÍTULO (crece al entrar) */}
          <div style={{ ...skew("linear-gradient(180deg, #FBFEFE, #E9F1F2)"), padding: "0 56px 0 40px", transformOrigin: "left center", overflow: "hidden", maxWidth: barGrow * 1400 }}>
            <div style={{ ...unskew, color: "#0E1B22", fontSize: 46, fontWeight: 900, letterSpacing: -0.4, whiteSpace: "nowrap" }}>{title}</div>
          </div>
        </div>

        {/* ── LÍNEA FINA DEBAJO: descripción · · · DR. FEDERER ── */}
        {(desc || tag) && (
          <div style={{ display: "flex", alignItems: "stretch", marginTop: 6, opacity: subOp }}>
            <div style={{ ...skew("linear-gradient(180deg, rgba(12,22,28,0.94), rgba(12,22,28,0.9))", { height: 46 }), padding: "0 26px 0 34px" }}>
              <div style={{ ...unskew, gap: 16 }}>
                {desc && <span style={{ color: "rgba(245,249,250,0.9)", fontSize: 26, fontWeight: 600, whiteSpace: "nowrap" }}>{desc}</span>}
                <span style={{ width: 3, height: 22, background: accent, display: "inline-block", opacity: desc ? 1 : 0 }} />
                <span style={{ color: accent, fontSize: 22, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap" }}>{tag}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
