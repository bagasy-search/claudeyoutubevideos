// TfbCam — cámara virtual sobre cualquier plano: push-in / encuadre por keyframes, temblor de impacto que decae,
// whip-pan de entrada/salida con desenfoque de movimiento, y destello de impacto. Envuelve el medio (children).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, ease, easeIn, smooth } from "./theme";

export type CamKey = [number, number, number, number]; // [cuadro, escala, x px, y px]
export type TfbCamProps = {
  dur: number; children: React.ReactNode;
  keys?: CamKey[];                 // encuadre (push-in, reencuadre); default quieto
  shakes?: [number, number][];     // [cuadro, intensidad px] impulsos que decaen en ~10 cuadros
  handheld?: number;               // deriva suave tipo cámara en mano (px)
  whipIn?: number; whipOut?: number; whipDir?: 1 | -1; // cuadros de whip al entrar/salir
  flash?: number[];                // cuadros con destello blanco corto
};
const keyAt = (k: CamKey[], f: number): [number, number, number] => {
  if (f <= k[0][0]) return [k[0][1], k[0][2], k[0][3]];
  for (let i = 0; i < k.length - 1; i++) { const [f0, s0, x0, y0] = k[i], [f1, s1, x1, y1] = k[i + 1]; if (f <= f1) { const t = ease((f - f0) / Math.max(1, f1 - f0)); return [s0 + (s1 - s0) * t, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; } }
  const l = k[k.length - 1]; return [l[1], l[2], l[3]];
};
export const TfbCam: React.FC<TfbCamProps> = ({ dur, children, keys = [[0, 1, 0, 0]], shakes = [], handheld = 0, whipIn = 0, whipOut = 0, whipDir = 1, flash = [] }) => {
  const f = useCurrentFrame();
  const [s, kx, ky] = keyAt(keys, f);
  let sx = 0, sy = 0;
  for (const [f0, a] of shakes) { const d = f - f0; if (d >= 0 && d < 12) { const e = a * Math.exp(-d / 3.2); sx += Math.sin(d * 2.9) * e; sy += Math.cos(d * 3.7) * e * 0.7; } }
  const hx = handheld ? smooth(11, f / 17) * handheld : 0, hy = handheld ? smooth(23, f / 21) * handheld * 0.6 : 0;
  const wi = whipIn ? interpolate(f, [0, whipIn], [1, 0], { ...clamp, easing: ease }) : 0;
  const wo = whipOut ? interpolate(f, [dur - whipOut, dur], [0, 1], { ...clamp, easing: easeIn }) : 0;
  const wx = (-wi + wo) * 1400 * whipDir, blur = (wi + wo) * 26;
  const fl = flash.reduce((m, f0) => Math.max(m, f >= f0 && f < f0 + 5 ? 1 - (f - f0) / 5 : 0), 0);
  const zs = s * (1 + 0.02 * (wi + wo)) + (handheld ? 0.02 : 0);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${kx + sx + hx + wx}px, ${ky + sy + hy}px) scale(${zs})`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>{children}</div>
      {fl > 0 ? <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: fl * 0.85 }} /> : null}
    </div>
  );
};
