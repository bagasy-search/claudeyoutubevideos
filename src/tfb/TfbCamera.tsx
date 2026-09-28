// TfbCamera — CÁMARA VIRTUAL sobre la capa base: envuelve el footage y le aplica eventos por cuadro global:
//   punch  → zoom-punch seco (entra rápido, se asienta) para golpes y revelaciones
//   push   → acercamiento lento sostenido (tensión) hacia un punto
//   shake  → sacudón amortiguado en impactos (rotura, golpe de martillo)
//   whip   → barrido lateral con desenfoque de movimiento (transición entre escenas, centrado en el corte)
// Todo determinista (el farm rinde en chunks). Los eventos se pasan ya ordenados o no: se suman.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, easeInOut, easeOut } from "./theme";

export type CamEvent = { f: number; kind: "punch" | "push" | "shake" | "whip"; dur?: number; amt?: number; x?: number; y?: number; dir?: 1 | -1 };
export const TfbCamera: React.FC<{ events: CamEvent[]; children: React.ReactNode }> = ({ events, children }) => {
  const g = useCurrentFrame();
  let scale = 1, tx = 0, ty = 0, rot = 0, blur = 0, ox = 50, oy = 50;
  for (const e of events) {
    const d = e.dur ?? (e.kind === "push" ? 90 : e.kind === "whip" ? 10 : e.kind === "shake" ? 18 : 14);
    const t = g - e.f;
    if (e.kind === "whip") { if (t < -d / 2 || t > d / 2) continue; }
    else if (t < 0 || t > d) continue;
    const a = e.amt ?? 1;
    if (e.kind === "punch") {
      const k = t < 4 ? interpolate(t, [0, 4], [0, 1], { ...clamp, easing: easeOut }) : interpolate(t, [4, d], [1, 0.35], { ...clamp, easing: easeInOut });
      scale *= 1 + 0.12 * a * k; ox = e.x ?? ox; oy = e.y ?? oy;
    } else if (e.kind === "push") {
      scale *= 1 + 0.08 * a * interpolate(t, [0, d], [0, 1], { ...clamp, easing: easeInOut }); ox = e.x ?? ox; oy = e.y ?? oy;
    } else if (e.kind === "shake") {
      const damp = Math.exp(-t / (d / 3)) * a;
      tx += Math.sin(t * 2.9) * 22 * damp; ty += Math.cos(t * 3.7) * 16 * damp; rot += Math.sin(t * 2.3) * 0.9 * damp; scale *= 1 + 0.03 * damp;
    } else if (e.kind === "whip") {
      const u = t / (d / 2); // -1..1, el corte está en 0
      const m = 1 - Math.abs(u);
      tx += (e.dir ?? 1) * -u * 140 * a; blur += 26 * m * a; scale *= 1.16 + 0.04 * m; // 1,16 tapa los 140 px de corrimiento
    }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${scale})`, transformOrigin: `${ox}% ${oy}%`,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Destello de luz + rayas de movimiento sobre un corte (acompaña al whip o a un punch fuerte). */
export const TfbFlash: React.FC<{ dur?: number; color?: string; streaks?: boolean }> = ({ dur = 8, color = "#ffffff", streaks = true }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 2, dur], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: color, opacity: a * 0.6 }} />
      {streaks && <AbsoluteFill style={{ opacity: a, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 40px, rgba(255,255,255,0.35) 40px 44px, rgba(255,255,255,0) 44px 120px)",
        transform: `translateX(${interpolate(f, [0, dur], [-200, 200])}px)` }} />}
    </AbsoluteFill>
  );
};
