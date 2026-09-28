// TfbHandDraw — flechas, subrayados y círculos "a mano" que se TRAZAN sobre el footage (trazo irregular,
// doble pasada como marcador), con rótulo manuscrito opcional. Coordenadas en % del cuadro.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_HAND, TEXT_SHADOW, clamp, ease, inOut } from "./theme";

type Pt = [number, number];
const jitter = (i: number, seed: number) => Math.sin(i * 12.9898 + seed * 4.1414) * 43758.5453 % 1;
function roughPath(pts: Pt[], seed: number, W: number, H: number, amp = 3) {
  const P = pts.map(([x, y], i) => [(x / 100) * W + jitter(i, seed) * amp, (y / 100) * H + jitter(i + 7, seed) * amp]);
  let d = `M ${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; d += ` Q ${x0 + (x1 - x0) * 0.5 + jitter(i + 3, seed) * amp * 3} ${y0 + (y1 - y0) * 0.5 + jitter(i + 5, seed) * amp * 3} ${x1} ${y1}`; }
  return d;
}
export const TfbHandDraw: React.FC<{
  dur: number; kind: "arrow" | "underline" | "circle"; pts?: Pt[]; /** circle: centro y radios en % */ cx?: number; cy?: number; rx?: number; ry?: number;
  label?: string; labelAt?: Pt; color?: string; width?: number; drawFrames?: number; seed?: number;
}> = ({ dur, kind, pts = [], cx = 50, cy = 50, rx = 10, ry = 8, label, labelAt, color = C.yellow, width = 11, drawFrames = 16, seed = 1 }) => {
  const f = useCurrentFrame(), { width: W, height: H } = useVideoConfig();
  const o = inOut(f, dur, 2, 8);
  const p = interpolate(f, [0, drawFrames], [0, 1], { ...clamp, easing: ease });
  let d = "";
  if (kind === "circle") {
    const N = 40, ptsC: Pt[] = [];
    for (let i = 0; i <= N + 4; i++) { const a = -Math.PI * 0.6 + (i / N) * Math.PI * 2; ptsC.push([cx + rx * Math.cos(a) * (1 + 0.04 * Math.sin(i)), cy + ry * Math.sin(a) * (1 + 0.04 * Math.cos(i))]); }
    d = roughPath(ptsC, seed, W, H, 2);
  } else d = roughPath(pts, seed, W, H);
  // punta de flecha
  let head = "";
  if (kind === "arrow" && pts.length > 1) {
    const [x1, y1] = pts[pts.length - 1], [x0, y0] = pts[pts.length - 2];
    const X1 = (x1 / 100) * W, Y1 = (y1 / 100) * H, a = Math.atan2(Y1 - (y0 / 100) * H, X1 - (x0 / 100) * W), L = 46;
    head = `M ${X1 - L * Math.cos(a - 0.5)} ${Y1 - L * Math.sin(a - 0.5)} L ${X1} ${Y1} L ${X1 - L * Math.cos(a + 0.5)} ${Y1 - L * Math.sin(a + 0.5)}`;
  }
  const hp = interpolate(f, [drawFrames - 2, drawFrames + 5], [0, 1], clamp);
  const lp = interpolate(f, [drawFrames * 0.6, drawFrames + 8], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[0, 1].map((k) => (
          <path key={k} d={d} fill="none" stroke={k ? color : "rgba(0,0,0,0.4)"} strokeWidth={k ? width : width + 7} strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={k ? "" : "translate(2 4)"} />
        ))}
        {head && [0, 1].map((k) => (
          <path key={"h" + k} d={head} fill="none" stroke={k ? color : "rgba(0,0,0,0.4)"} strokeWidth={k ? width : width + 7} strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - hp} transform={k ? "" : "translate(2 4)"} />
        ))}
      </svg>
      {label && labelAt && (
        <div style={{ position: "absolute", left: `${labelAt[0]}%`, top: `${labelAt[1]}%`, transform: `translate(-50%,-50%) rotate(-4deg) scale(${0.7 + 0.3 * lp})`, opacity: lp,
          fontFamily: F_HAND, fontWeight: 700, fontSize: 92, color, textShadow: TEXT_SHADOW, whiteSpace: "nowrap", lineHeight: 1 }}>{label}</div>
      )}
    </AbsoluteFill>
  );
};
