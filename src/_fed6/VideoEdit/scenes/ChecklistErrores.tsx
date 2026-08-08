import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── ChecklistErrores — panel lateral persistente de "los 6 errores" ──────────
// ANTI-SPOILER: los errores que TODAVÍA no llegaron aparecen BLUREADOS (se ve que
// faltan X, pero no cuáles → curiosidad, no spoiler). Se revelan al llegar. Entrada
// SUAVE con zoom leve al recuadro, y ritmo tranquilo.

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", CREAM = "#F5F9FA";

export const ChecklistErrores: React.FC<{
  durationInFrames: number;
  title?: string;
  items: string[];   // los 6 (o N) errores, en orden
  active: number;    // índice del actual (0..N-1)
  side?: "left" | "right";
}> = ({ durationInFrames, title = "Los 6 errores de la noche", items, active, side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // entrada SUAVE (spring lento) + zoom leve al recuadro
  const inS = spring({ frame, fps, config: { damping: 26, mass: 1, stiffness: 78 } });
  // SALIDA = CORTE LIMPIO (antes: disolvía en 18f, casi 3/4 de segundo de panel fantasma).
  const out = 1;
  const W = 640;
  const x = interpolate(inS, [0, 1], [side === "right" ? 90 : -90, 0]); // se corre poquito (no vuela)
  const zoom = interpolate(inS, [0, 1], [0.9, 1]) * interpolate(frame, [0, durationInFrames], [1, 1.03], { extrapolateRight: "clamp" });
  const op = Math.min(inS, out);
  const left = items.length - 1 - active;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, pointerEvents: "none" }}>
      <div style={{ position: "absolute", [side]: 72, top: "50%", width: W, transform: `translateY(-50%) translateX(${x}px) scale(${zoom})`, transformOrigin: side === "right" ? "right center" : "left center", opacity: op }}>
        <div style={{ background: "linear-gradient(180deg, rgba(12,22,28,0.94), rgba(12,22,28,0.89))", borderRadius: 26, padding: "36px 36px 32px", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 34px 90px rgba(0,0,0,0.5)", backdropFilter: "blur(7px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ fontSize: 31, fontWeight: 900, color: CREAM, letterSpacing: -0.3 }}>{title}</div>
            <div style={{ fontSize: 23, fontWeight: 800, color: TEAL, background: `${TEAL}22`, padding: "7px 15px", borderRadius: 11 }}>faltan {left}</div>
          </div>
          {items.map((it, i) => {
            const done = i < active, cur = i === active, future = i > active;
            // aparición lenta y escalonada de cada FILA (solo la estructura, no el texto futuro)
            const rowSp = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 24, mass: 1, stiffness: 90 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "15px 16px", borderRadius: 15, marginBottom: 9, background: cur ? `${TEAL}20` : "transparent", border: cur ? `1px solid ${TEAL}66` : "1px solid transparent", opacity: (done ? 0.42 : cur ? 1 : 0.7) * rowSp, transform: `translateX(${(1 - rowSp) * 12}px)` }}>
                <div style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 23, background: cur ? TEAL : done ? "rgba(255,255,255,0.10)" : "transparent", border: cur ? "none" : `2px solid rgba(255,255,255,0.28)`, color: cur ? "#fff" : "rgba(255,255,255,0.75)", fontSize: 21, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? "✓" : items.length - i}
                </div>
                {/* TEXTO: los futuros van BLUREADOS (anti-spoiler) */}
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: cur ? 800 : 600, color: CREAM, textDecoration: done ? "line-through" : "none", textDecorationColor: "rgba(255,255,255,0.4)", lineHeight: 1.15, filter: future ? "blur(9px)" : "none", opacity: future ? 0.7 : 1, userSelect: "none" }}>
                    {future ? "•••••• •••••" : it}
                  </div>
                  {future && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,22,28,0.15), rgba(12,22,28,0.35))" }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
