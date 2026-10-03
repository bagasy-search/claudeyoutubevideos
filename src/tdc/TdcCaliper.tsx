// TdcCaliper — cota técnica sobre el footage: dos marcas + línea con flechas que se traza entre dos puntos (% del cuadro)
// y el valor medido en un chip ("68 mm"). Con varias cotas en `dims` se comparan (70 mm vs 68 mm), cada una entra `gap` cuadros después.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, clamp, ease, inOut, pop } from "./theme";

type Dim = { from: [number, number]; to: [number, number]; value: string; tone?: "yellow" | "red" | "white" };
const One: React.FC<{ d: Dim; f: number; delay: number; W: number; H: number; fps: number }> = ({ d, f, delay, W, H, fps }) => {
  const p = interpolate(f, [delay, delay + 14], [0, 1], { ...clamp, easing: ease }), s = pop(f, fps, delay + 10, 10);
  const x1 = (d.from[0] / 100) * W, y1 = (d.from[1] / 100) * H, x2 = (d.to[0] / 100) * W, y2 = (d.to[1] / 100) * H;
  const col = d.tone === "red" ? C.red : d.tone === "white" ? C.white : C.yellow;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, ex = x1 + dx * p, ey = y1 + dy * p, ah = 26;
  const ux = dx / L, uy = dy / L;
  return (
    <g>
      {[[x1, y1], [x2, y2]].map(([x, y], i) => <line key={i} x1={x - nx * 30} y1={y - ny * 30} x2={x + nx * 30} y2={y + ny * 30} stroke={col} strokeWidth={5} strokeLinecap="round" opacity={p} />)}
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={col} strokeWidth={5} strokeLinecap="round" />
      {p > 0.98 && <>
        <polygon points={`${x1},${y1} ${x1 + ux * ah + nx * 9},${y1 + uy * ah + ny * 9} ${x1 + ux * ah - nx * 9},${y1 + uy * ah - ny * 9}`} fill={col} />
        <polygon points={`${x2},${y2} ${x2 - ux * ah + nx * 9},${y2 - uy * ah + ny * 9} ${x2 - ux * ah - nx * 9},${y2 - uy * ah - ny * 9}`} fill={col} />
      </>}
      <g transform={`translate(${(x1 + x2) / 2 + nx * 58} ${(y1 + y2) / 2 + ny * 58}) scale(${0.4 + 0.6 * s})`} opacity={Math.min(1, s)}>
        <rect x={-108} y={-40} width={216} height={80} rx={14} fill="rgba(14,14,14,0.9)" stroke={col} strokeWidth={4} />
        <text x={0} y={22} textAnchor="middle" fontFamily={F_DISPLAY} fontSize={64} fill={col}>{d.value}</text>
      </g>
    </g>
  );
};
export const TdcCaliper: React.FC<{ dur: number; dims: Dim[]; gap?: number }> = ({ dur, dims, gap = 14 }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: inOut(f, dur, 4, 8), pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.55))" }}>
        {dims.map((d, i) => <One key={i} d={d} f={f} delay={i * gap} W={W} H={H} fps={fps} />)}
      </svg>
    </AbsoluteFill>
  );
};
