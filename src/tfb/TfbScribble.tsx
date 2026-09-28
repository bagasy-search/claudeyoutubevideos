// TfbScribble — trazo "a mano" que se DIBUJA sobre el footage: flecha curva, círculo irregular o subrayado, con una
// nota manuscrita opcional. El trazo tiene un leve temblor determinista (no es un vector perfecto) y un borde oscuro
// para leerse sobre cualquier fondo. Coordenadas en % del cuadro.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeInOut, outro } from "./theme";

type P = { x: number; y: number };
export const TfbScribble: React.FC<{
  kind: "arrow" | "circle" | "underline"; from?: P; to?: P; center?: P; rx?: number; ry?: number; color?: string;
  label?: string; labelAt?: P; dur: number; drawFrames?: number; seed?: number; width?: number;
}> = ({ kind, from, to, center, rx = 12, ry = 9, color = TFB.yellow, label, labelAt, dur, drawFrames = 14, seed = 1, width = 12 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const X = (v: number) => (v / 100) * W, Y = (v: number) => (v / 100) * H;
  const t = interpolate(f, [0, drawFrames], [0, 1], { ...clamp, easing: easeInOut });
  const o = outro(f, dur, 8);
  const wob = (i: number) => Math.sin(i * 1.3 + seed * 7.7) * 6 + Math.sin(i * 0.47 + seed) * 4;
  let d = "", head = "";
  if (kind === "circle" && center) {
    const pts: string[] = []; const N = 48;
    for (let i = 0; i <= N + 5; i++) { // da un poco más de una vuelta, como un círculo hecho a mano
      const a = (i / N) * Math.PI * 2 - Math.PI * 0.6, rr = 1 + wob(i) / 260 + i * 0.0012;
      pts.push(`${(X(center.x) + Math.cos(a) * X(rx) * rr).toFixed(1)},${(Y(center.y) + Math.sin(a) * Y(ry) * rr).toFixed(1)}`);
    }
    d = "M" + pts.join(" L");
  } else if (kind === "underline" && from && to) {
    const x1 = X(from.x), y1 = Y(from.y), x2 = X(to.x), y2 = Y(to.y);
    d = `M${x1},${y1} C${x1 + (x2 - x1) * 0.3},${y1 + 10} ${x1 + (x2 - x1) * 0.7},${y2 - 8} ${x2},${y2}`;
  } else if (from && to) {
    const x1 = X(from.x), y1 = Y(from.y), x2 = X(to.x), y2 = Y(to.y);
    const mx = (x1 + x2) / 2 - (y2 - y1) * 0.28, my = (y1 + y2) / 2 + (x2 - x1) * 0.28; // curva
    d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    const ang = Math.atan2(y2 - my, x2 - mx), L = 46;
    head = `M${x2 - L * Math.cos(ang - 0.5)},${y2 - L * Math.sin(ang - 0.5)} L${x2},${y2} L${x2 - L * Math.cos(ang + 0.5)},${y2 - L * Math.sin(ang + 0.5)}`;
  }
  const headT = interpolate(f, [drawFrames - 2, drawFrames + 4], [0, 1], clamp);
  const lab = labelAt ?? (from ? { x: from.x, y: from.y - 6 } : center ? { x: center.x + rx, y: center.y - ry - 4 } : { x: 50, y: 20 });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {[{ c: "rgba(0,0,0,0.55)", w: width + 8 }, { c: color, w: width }].map((s, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={s.c} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
            {head && <path d={head} fill="none" stroke={s.c} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" opacity={headT} />}
          </g>
        ))}
      </svg>
      {label && (
        <div style={{ position: "absolute", left: X(lab.x), top: Y(lab.y), transform: `translate(-50%,-100%) rotate(-3deg) scale(${interpolate(f, [drawFrames - 4, drawFrames + 6], [0.7, 1], clamp)})`,
          opacity: interpolate(f, [drawFrames - 4, drawFrames + 4], [0, 1], clamp), fontFamily: CAVEAT, fontWeight: 700, fontSize: 80, color, whiteSpace: "nowrap",
          textShadow: "0 3px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000, 0 0 20px rgba(0,0,0,0.8)" }}>{label}</div>
      )}
    </AbsoluteFill>
  );
};
