// TfbGlueSection — "RAYOS X" de una unión encolada: corte de dos piezas de madera con sus fibras, la línea de cola
// entre ellas que se mete en los poros (dedos que penetran), y un estado opcional de FALLA donde la cola queda como
// película grasosa que no entra. Sirve para explicar por qué agarra (o no) una cola. Dibujado 100 % con código.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, CAVEAT, TFB, clamp, easeInOut, outro, pop } from "./theme";

export const TfbGlueSection: React.FC<{ dur: number; mode?: "grip" | "fail"; title?: string; note?: string; x?: number; y?: number; scale?: number }> = ({
  dur, mode = "grip", title, note, x = 50, y = 52, scale = 1 }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig();
  const o = outro(f, dur, 10), p = pop(f, fps, 0, 14, 0.8);
  const scan = interpolate(f, [4, 30], [0, 1], { ...clamp, easing: easeInOut });      // barrido del "escáner"
  const seep = interpolate(f, [26, 70], [0, 1], { ...clamp, easing: easeInOut });     // la cola entra en los poros
  const w = 1100, h = 420, cx = (x / 100) * W, cy = (y / 100) * H;
  const fibers = (y0: number, n: number, seed: number) => Array.from({ length: n }).map((_, i) => {
    const yy = y0 + (i + 0.5) * (170 / n); const a = Math.sin(i * 2.1 + seed) * 5;
    return <path key={i} d={`M-560,${yy} C-300,${yy + a} -100,${yy - a} 120,${yy + a * 0.6} S420,${yy - a} 560,${yy}`} stroke={TFB.woodDark} strokeWidth={3} fill="none" opacity={0.55} />;
  });
  const fingers = Array.from({ length: 22 }).map((_, i) => {
    const xx = -500 + i * 47 + Math.sin(i * 3.3) * 10, dep = (38 + Math.abs(Math.sin(i * 1.7)) * 70) * (mode === "grip" ? seep : 0.08);
    return <g key={i}><path d={`M${xx - 9},-12 Q${xx},${-12 - dep} ${xx + 9},-12 Z`} fill={TFB.glue} /><path d={`M${xx - 9},12 Q${xx},${12 + dep} ${xx + 9},12 Z`} fill={TFB.glue} /></g>;
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(6,18,30,0.86) 0%, rgba(4,10,16,0.94) 70%)", opacity: interpolate(p, [0, 1], [0, 1]) }} />
      {title && <div style={{ position: "absolute", top: cy - h / 2 * scale - 150, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 70, color: TFB.white, letterSpacing: 2 }}>{title}</div>}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cx},${cy}) scale(${scale * interpolate(p, [0, 1], [0.85, 1])})`}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="none" stroke="rgba(120,200,255,0.35)" strokeWidth={2} strokeDasharray="10 10" />
          <rect x={-560} y={-196} width={1120} height={184} fill={TFB.wood} rx={6} />
          <rect x={-560} y={12} width={1120} height={184} fill="#d3a766" rx={6} />
          {fibers(-196, 11, 1)}{fibers(12, 11, 4)}
          <rect x={-560} y={-12} width={1120} height={24} fill={mode === "grip" ? TFB.glue : "#e9e2c8"} />
          {mode === "fail" && Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={-520 + i * 70} cy={Math.sin(i) * 4} rx={16} ry={5} fill="#fff8e0" opacity={0.8} />)}
          {fingers}
          <rect x={-560 + 1120 * scan - 6} y={-210} width={12} height={420} fill="rgba(140,220,255,0.8)" opacity={scan > 0 && scan < 1 ? 1 : 0} />
        </g>
      </svg>
      {note && <div style={{ position: "absolute", top: cy + h / 2 * scale + 40, width: "100%", textAlign: "center", fontFamily: CAVEAT, fontWeight: 700, fontSize: 64,
        color: mode === "grip" ? TFB.yellow : "#ff8a80", opacity: interpolate(f, [60, 72], [0, 1], clamp), textShadow: "0 3px 0 #000" }}>{note}</div>}
    </AbsoluteFill>
  );
};
