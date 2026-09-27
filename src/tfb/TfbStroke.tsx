// TfbStroke — trazos "a mano" que se DIBUJAN sobre el footage: flecha curva, círculo irregular, subrayado o cruz.
// Coordenadas en fracción del cuadro. El trazo tiene temblor de mano (seed), se traza con stroke-dashoffset y deja
// una sombra suave para leerse sobre cualquier fondo. `label` opcional en letra de marcador (≤3 palabras).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from "remotion";
import { TFB, F_HAND, EASE_IN, EASE_OUT, clamp } from "./theme";

type P = { x: number; y: number };
export type TfbStrokeProps = {
  kind: "arrow" | "circle" | "underline" | "cross";
  a: P; b?: P;                 // arrow/underline/cross: de a → b · circle: centro a, radios b (fracción)
  drawAt?: number; drawDur?: number; outAt?: number;
  color?: string; width?: number; seed?: number;
  label?: string; labelAt?: P;
};

export const TfbStroke: React.FC<TfbStrokeProps> = ({ kind, a, b = { x: 0.1, y: 0.1 }, drawAt = 0, drawDur = 14, outAt, color = TFB.yellow, width = 12, seed = 1, label, labelAt }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const p = interpolate(f, [drawAt, drawAt + drawDur], [0, 1], { ...clamp, easing: EASE_IN });
  const o = outAt == null ? 1 : 1 - interpolate(f, [outAt - 8, outAt], [0, 1], { ...clamp, easing: EASE_OUT });
  const j = (i: number, k = 8) => (random(`${seed}-${i}`) - 0.5) * k;
  const A = { x: a.x * W, y: a.y * H }, Bp = { x: b.x * W, y: b.y * H };
  let d = "", head = "";
  if (kind === "circle") {
    const rx = b.x * W, ry = b.y * H, N = 28; const pts: string[] = [];
    for (let i = 0; i <= N + 3; i++) { const t = (i / N) * Math.PI * 2 - 2.2; const r = 1 + j(i, 0.08) + (i > N ? 0.07 : 0); pts.push(`${A.x + Math.cos(t) * rx * r},${A.y + Math.sin(t) * ry * r}`); }
    d = "M " + pts.join(" L ");
  } else if (kind === "cross") {
    d = `M ${A.x} ${A.y} L ${Bp.x + j(1)} ${Bp.y + j(2)} M ${Bp.x} ${A.y} L ${A.x + j(3)} ${Bp.y + j(4)}`;
  } else {
    const mx = (A.x + Bp.x) / 2 + j(5, 30) + (kind === "arrow" ? (Bp.y - A.y) * 0.25 : 0), my = (A.y + Bp.y) / 2 + j(6, 30) - (kind === "arrow" ? (Bp.x - A.x) * 0.25 : 0);
    d = `M ${A.x} ${A.y} Q ${mx} ${my} ${Bp.x} ${Bp.y}`;
    if (kind === "arrow") { const ang = Math.atan2(Bp.y - my, Bp.x - mx), L = 46; head = `M ${Bp.x - Math.cos(ang - 0.5) * L} ${Bp.y - Math.sin(ang - 0.5) * L} L ${Bp.x} ${Bp.y} L ${Bp.x - Math.cos(ang + 0.5) * L} ${Bp.y - Math.sin(ang + 0.5) * L}`; }
  }
  const hp = interpolate(p, [0.8, 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 4px 6px rgba(0,0,0,.55))" }}>
        <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
        {head && <path d={head} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - hp} />}
      </svg>
      {label && labelAt && (
        <div style={{ position: "absolute", left: labelAt.x * W, top: labelAt.y * H, transform: `translate(-50%,-50%) rotate(-4deg) scale(${0.7 + 0.3 * hp})`, opacity: hp, fontFamily: F_HAND, fontSize: 64, color, textShadow: "0 3px 0 rgba(0,0,0,.6), 0 6px 18px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{label}</div>
      )}
    </AbsoluteFill>
  );
};
