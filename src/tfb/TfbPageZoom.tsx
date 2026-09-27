// TfbPageZoom — una lámina/ficha a pantalla completa recorrida PUNTO POR PUNTO: teclas [segundo, cx, cy, escala]
// (cx/cy en fracción de la imagen), tramos suaves entre teclas, y un marcador amarillo que resalta la zona activa
// (rectángulo con esquinas redondeadas que se dibuja). Papel con sombra, entra con un leve giro.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, clamp, easeInOut, outro } from "./theme";

export type PageKey = [number, number, number, number];
export type PageMark = { from: number; to: number; x: number; y: number; w: number; h: number }; // segundos + fracciones de la imagen
export const TfbPageZoom: React.FC<{ dur: number; src: string; keys: PageKey[]; marks?: PageMark[]; bg?: string }> = ({ dur, src, keys, marks = [], bg = "#1b1712" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  let i = 0; while (i < keys.length - 1 && t >= keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)], T = 0.8;
  const p = b === a ? 0 : interpolate(t, [b[0] - T, b[0]], [0, 1], { ...clamp, easing: easeInOut });
  const cx = a[1] + (b[1] - a[1]) * p, cy = a[2] + (b[2] - a[2]) * p, s = a[3] + (b[3] - a[3]) * p;
  const W = 1920, H = 1080;
  let tx = W / 2 - cx * W * s, ty = H / 2 - cy * H * s;
  tx = Math.min(0, Math.max(W - W * s, tx)); ty = Math.min(0, Math.max(H - H * s, ty));
  const inP = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: easeInOut });
  const o = outro(f, dur, 6);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: o }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(inP, [0, 1], [0.9, 1])}) rotate(${interpolate(inP, [0, 1], [-2.5, 0])}deg)`, opacity: inP }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
          <Img src={staticFile(src)} style={{ width: W, height: H, display: "block", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {marks.map((m, k) => { if (t < m.from || t > m.to + 0.3) return null;
              const d = interpolate(t, [m.from, m.from + 0.5], [0, 1], clamp), out = interpolate(t, [m.to, m.to + 0.3], [1, 0], clamp);
              return <rect key={k} x={m.x * W} y={m.y * H} width={m.w * W} height={m.h * H} rx={14} fill="rgba(255,210,26,0.12)" stroke={TFB.yellow} strokeWidth={6 / s}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} opacity={out} />; })}
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
