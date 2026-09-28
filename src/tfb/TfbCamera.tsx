// TfbCamera — cámara virtual sobre cualquier capa: push-in lento, "zoom punch" en un cuadro (golpe de escala con
// rebote), sacudidas en impactos (decaen solas) y whip-pan de entrada/salida (desplazamiento + desenfoque de
// movimiento horizontal). Todo por props; envuelve al footage (children).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, ease, wobble } from "./theme";

export const TfbCamera: React.FC<{
  children: React.ReactNode; dur: number;
  push?: [number, number];            // escala inicio→fin (push-in continuo)
  origin?: [number, number];          // % del punto hacia el que empuja
  punches?: { at: number; amount?: number }[];   // zoom punch
  shakes?: { at: number; amp?: number; len?: number }[];
  whipIn?: number; whipOut?: number;  // cuadros de whip de entrada / salida (0 = nada)
  whipDir?: 1 | -1;
}> = ({ children, dur, push = [1, 1], origin = [50, 50], punches = [], shakes = [], whipIn = 0, whipOut = 0, whipDir = 1 }) => {
  const f = useCurrentFrame();
  let s = interpolate(f, [0, dur], push, clamp);
  for (const p of punches) {
    const t = f - p.at; if (t < 0 || t > 14) continue;
    s *= 1 + (p.amount ?? 0.12) * (t < 3 ? t / 3 : Math.exp(-(t - 3) / 3.5) * Math.cos((t - 3) / 2.2));
  }
  let sx = 0, sy = 0;
  for (const k of shakes) {
    const t = f - k.at, L = k.len ?? 10; if (t < 0 || t > L) continue;
    const a = (k.amp ?? 16) * (1 - t / L);
    sx += wobble(f, k.at, a, 2.1); sy += wobble(f, k.at + 5, a, 2.6);
  }
  let wx = 0, blur = 0;
  if (whipIn && f < whipIn) { const p = interpolate(f, [0, whipIn], [1, 0], { ...clamp, easing: ease }); wx = -whipDir * p * 900; blur = p * 40; }
  if (whipOut && f > dur - whipOut) { const p = interpolate(f, [dur - whipOut, dur], [0, 1], { ...clamp, easing: (x) => x * x }); wx = whipDir * p * 900; blur = p * 40; }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx + wx}px, ${sy}px) scale(${s})`, transformOrigin: `${origin[0]}% ${origin[1]}%`,
        filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
