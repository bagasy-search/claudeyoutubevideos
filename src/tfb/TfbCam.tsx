// TfbCam — cámara VIRTUAL sobre el footage: push-in lento, zoom-punch seco (salto de zoom del vlog), sacudida en los
// impactos (decae en ~10 cuadros) y whip-pan de entrada/salida (barrido con desenfoque de movimiento). Todo por props.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { EASE_IO, clamp } from "./theme";

export type TfbCamProps = {
  children: React.ReactNode;
  push?: { from: number; to: number; s0: number; s1: number; ox?: number; oy?: number };  // push-in (escala) entre cuadros
  punches?: { at: number; dur: number; s: number; ox?: number; oy?: number }[];           // zoom-punch seco
  shakes?: number[];                                                                        // cuadros de impacto
  shakeAmp?: number;
  whipIn?: number; whipOut?: number; dur?: number; whipDir?: 1 | -1;                       // barrido (cuadros)
};

export const TfbCam: React.FC<TfbCamProps> = ({ children, push, punches = [], shakes = [], shakeAmp = 18, whipIn = 0, whipOut = 0, dur = 0, whipDir = 1 }) => {
  const f = useCurrentFrame();
  let s = 1, ox = 50, oy = 45;
  if (push) { s = interpolate(f, [push.from, push.to], [push.s0, push.s1], { ...clamp, easing: EASE_IO }); ox = push.ox ?? ox; oy = push.oy ?? oy; }
  for (const p of punches) if (f >= p.at && f < p.at + p.dur) { s *= p.s; ox = p.ox ?? ox; oy = p.oy ?? oy; }
  let dx = 0, dy = 0, rot = 0;
  for (const k of shakes) { const t = f - k; if (t >= 0 && t < 12) { const a = shakeAmp * Math.exp(-t / 3.5); dx += (random(`sx${k}${t}`) - 0.5) * 2 * a; dy += (random(`sy${k}${t}`) - 0.5) * 2 * a; rot += (random(`sr${k}${t}`) - 0.5) * a * 0.05; } }
  let wx = 0, blur = 0;
  if (whipIn > 0 && f < whipIn) { const p = 1 - f / whipIn; wx = whipDir * p * p * 900; blur = p * 40; }
  if (whipOut > 0 && dur > 0 && f > dur - whipOut) { const p = (f - (dur - whipOut)) / whipOut; wx = -whipDir * p * p * 900; blur = p * 40; }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx + wx}px, ${dy}px) rotate(${rot}deg) scale(${s * (blur ? 1.04 : 1) * (dx || dy ? 1.03 : 1)})`, transformOrigin: `${ox}% ${oy}%`, filter: blur ? `blur(${blur * 0.35}px)` : undefined }}>
        {children}
      </AbsoluteFill>
      {blur > 0 && <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,${blur / 160}), rgba(255,255,255,0))` }} />}
    </AbsoluteFill>
  );
};
