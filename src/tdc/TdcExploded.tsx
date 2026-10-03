// TdcExploded — vista explotada 2D de la herramienta: las piezas se separan en vertical con una línea de ensamble punteada y, con
// `assemble`, bajan una a una hasta encajar. Cada pieza lleva su nombre y de qué chatarra salió. Las formas son genéricas (caño, chapa,
// vástago, madera): sirven para cualquier "herramienta de chatarra"; piezas y textos llegan por props.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut, pop } from "./theme";

export type ExPart = { shape: "shank" | "disc" | "pipe" | "stake"; name: string; origin: string };
const DEF: ExPart[] = [
  { shape: "shank", name: "Vástago SDS-max", origin: "mecha rota" },
  { shape: "disc", name: "Tapa 10 mm", origin: "tapa de alcantarilla" },
  { shape: "pipe", name: "Copa Ø76", origin: "bastidor de cama" },
  { shape: "stake", name: "Estaca 2×2", origin: "eucalipto" },
];
const Shape: React.FC<{ s: ExPart["shape"] }> = ({ s }) => {
  const steel = "#9aa3ab", dark = "#5b636a", wood = "#c9a06a";
  if (s === "shank") return <g><rect x={-14} y={-70} width={28} height={140} rx={4} fill={steel} stroke={dark} strokeWidth={4} /><rect x={-14} y={-30} width={28} height={14} fill={dark} opacity={0.5} /></g>;
  if (s === "disc") return <g><ellipse cx={0} cy={0} rx={130} ry={30} fill={steel} stroke={dark} strokeWidth={4} /><ellipse cx={0} cy={-8} rx={130} ry={26} fill="#b9c1c8" stroke={dark} strokeWidth={3} /><ellipse cx={0} cy={-8} rx={16} ry={6} fill="#222" /></g>;
  if (s === "pipe") return <g><path d="M-120,-46 L-120,52 A120,26 0 0 0 120,52 L120,-46 Z" fill={steel} stroke={dark} strokeWidth={4} /><ellipse cx={0} cy={-46} rx={120} ry={26} fill="#3a3f44" stroke={dark} strokeWidth={4} /><ellipse cx={0} cy={-46} rx={100} ry={19} fill="#1b1e21" /></g>;
  return <g><rect x={-46} y={-96} width={92} height={192} fill={wood} stroke="#7a5a30" strokeWidth={4} /><path d="M-46,96 L0,150 L46,96 Z" fill={wood} stroke="#7a5a30" strokeWidth={4} /><line x1={-14} y1={-80} x2={-14} y2={80} stroke="#a37c48" strokeWidth={3} /><line x1={16} y1={-80} x2={16} y2={70} stroke="#a37c48" strokeWidth={3} /></g>;
};
export const TdcExploded: React.FC<{ dur: number; parts?: ExPart[]; assemble?: boolean; at?: [number, number]; scale?: number }> = ({ dur, parts = DEF, assemble = false, at = [38, 52], scale = 0.8 }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  const n = parts.length, gapY = 190 * scale;
  const items = parts.map((p, i) => {
    const local = assemble ? interpolate(f, [16 + i * 10, 16 + i * 10 + 22], [1, 0], { ...clamp, easing: ease }) : 1;
    const y = (i - (n - 1) / 2) * gapY * (0.45 + 0.55 * local);
    return { p, i, y, s: pop(f, fps, i * 5, 12) };
  });
  const cx = (at[0] / 100) * W, cy = (at[1] / 100) * H;
  return (
    <AbsoluteFill style={{ opacity: inOut(f, dur, 8, 12), pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,8,0.78), rgba(10,10,8,0.4) 65%, rgba(10,10,8,0))" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line x1={cx} y1={H * 0.06} x2={cx} y2={H * 0.94} stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="4 12" />
        {items.map(({ p, i, y, s }) => (
          <g key={i} transform={`translate(${cx} ${cy + y}) scale(${scale * (0.6 + 0.4 * s)})`} opacity={Math.min(1, s)}>
            <Shape s={p.shape} />
          </g>
        ))}
      </svg>
      {items.map(({ p, i, y, s }) => (
        <div key={i} style={{ position: "absolute", left: cx + 190 * scale, top: cy + y, transform: `translateY(-50%) translateX(${(1 - s) * 40}px)`, opacity: Math.min(1, s) }}>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 54, color: C.white, textTransform: "uppercase", lineHeight: 1 }}>{p.name}</div>
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 30, color: C.yellow, textTransform: "uppercase", letterSpacing: 1 }}>← {p.origin}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
