import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── GuardaEsto — placa RESUMEN compartible (screenshot-worthy) ───────────────
// Tarjeta limpia y premium con el protocolo/resumen numerado + MINIATURA por paso +
// marca "Dr. Federer" + prompt "Guardá esto". El viejo le saca captura → guardados.

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", CREAM = "#F5F9FA", INK = "#0E1B22";

export type GEItem = { text: string; image?: string };

export const GuardaEsto: React.FC<{
  durationInFrames: number;
  title: string;
  items: (string | GEItem)[];
  tag?: string;
  prompt?: string;
}> = ({ durationInFrames, title, items, tag = "Dr. Federer", prompt = "Guardá esto" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK }}>
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 35%, rgba(18,179,174,0.12), rgba(10,20,26,0.94))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1180, borderRadius: 34, background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 50px 130px rgba(0,0,0,0.55)", padding: "56px 70px 50px", opacity: inS, transform: `translateY(${interpolate(inS, [0, 1], [30, 0])}px) scale(${interpolate(inS, [0, 1], [0.95, 1])})` }}>
          {/* prompt guardá */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <div style={{ fontSize: 34 }}>📌</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", color: TEAL }}>{prompt}</div>
          </div>
          <div style={{ fontSize: 62, fontWeight: 900, color: CREAM, letterSpacing: -0.6, lineHeight: 1.05, marginBottom: 34 }}>{title}</div>
          {/* pasos — cada uno con su MINIATURA */}
          {items.map((raw, i) => {
            const it: GEItem = typeof raw === "string" ? { text: raw } : raw;
            const p = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 20, stiffness: 130 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,0.08)" : "none", opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
                {/* Miniatura con badge de número. SIN imagen se dibujaba igual el marco de 118×86
                    vacío con el numerito arrimado a la esquina: una caja hueca al lado de cada
                    paso. Si no hay imagen no hay miniatura — va sólo el número, centrado y del
                    tamaño que corresponde. */}
                {it.image ? (
                  <div style={{ position: "relative", flex: "0 0 auto", width: 118, height: 86, borderRadius: 16, overflow: "hidden", border: "2px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(0,0,0,0.4)", background: "rgba(255,255,255,0.05)" }}>
                    <Media src={it.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", left: 8, top: 8, width: 34, height: 34, borderRadius: 18, background: TEAL, color: "#fff", fontSize: 18, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{i + 1}</div>
                  </div>
                ) : (
                  <div style={{ flex: "0 0 auto", width: 56, height: 56, borderRadius: 28, background: TEAL, color: "#fff", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>{i + 1}</div>
                )}
                <div style={{ fontSize: 38, fontWeight: 700, color: CREAM, lineHeight: 1.2 }}>{it.text}</div>
              </div>
            );
          })}
          {/* marca */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 32, opacity: interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ width: 40, height: 4, background: TEAL, borderRadius: 2 }} />
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", color: TEAL }}>{tag}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
