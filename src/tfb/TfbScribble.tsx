// TfbScribble — trazos "a mano" que se dibujan sobre el footage: flecha, círculo, subrayado, tilde, cruz.
// El trazo tiene jitter determinista (no es una línea de CAD) y un doble pase como marcador real. Etiqueta opcional
// en Permanent Marker. Coordenadas en px sobre 1920x1080.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F, clamp, ease, easeIn, noise, textShadow } from "./theme";

export type TfbScribbleProps = {
  kind: "arrow" | "circle" | "underline" | "check" | "cross";
  dur: number; delay?: number; draw?: number;           // cuadros para dibujar
  from?: [number, number]; to?: [number, number];        // arrow / underline
  box?: [number, number, number, number];                // circle / check / cross: x, y, w, h
  color?: string; width?: number; seed?: number;
  label?: string; labelAt?: [number, number]; labelSize?: number; labelColor?: string;
};
const jitter = (pts: [number, number][], seed: number, amp: number) => pts.map(([x, y], i) => [x + noise(seed, i) * amp, y + noise(seed + 7, i) * amp] as [number, number]);
const toPath = (pts: [number, number][]) => pts.reduce((d, [x, y], i) => d + (i ? ` L${x.toFixed(1)},${y.toFixed(1)}` : `M${x.toFixed(1)},${y.toFixed(1)}`), "");
function curve(a: [number, number], b: [number, number], bend: number, n = 28): [number, number][] {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  const cx = mx - dy * bend, cy = my + dx * bend;
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * cx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * cy + t * t * b[1]]; });
}
export const TfbScribble: React.FC<TfbScribbleProps> = ({ kind, dur, delay = 0, draw = 14, from = [300, 300], to = [600, 500], box = [700, 400, 300, 200], color = C.yellow, width = 11, seed = 3, label, labelAt, labelSize = 58, labelColor = C.white }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + draw], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [dur - 7, dur], [1, 0], { ...clamp, easing: easeIn });
  const paths: string[] = [];
  let head: string | null = null;
  if (kind === "arrow" || kind === "underline") {
    const pts = jitter(curve(from, to, kind === "arrow" ? 0.18 : 0.03), seed, kind === "arrow" ? 2.2 : 1.6);
    paths.push(toPath(pts));
    if (kind === "underline") paths.push(toPath(jitter(curve([from[0] + 18, from[1] + 12], [to[0] - 10, to[1] + 9], -0.02), seed + 1, 2)));
    if (kind === "arrow") {
      const [x1, y1] = pts[pts.length - 3], [x2, y2] = pts[pts.length - 1], ang = Math.atan2(y2 - y1, x2 - x1), L = 46;
      head = `M${(x2 - L * Math.cos(ang - 0.5)).toFixed(1)},${(y2 - L * Math.sin(ang - 0.5)).toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} L${(x2 - L * Math.cos(ang + 0.5)).toFixed(1)},${(y2 - L * Math.sin(ang + 0.5)).toFixed(1)}`;
    }
  } else if (kind === "circle") {
    const [x, y, w, h] = box, n = 48, pts: [number, number][] = [];
    for (let i = 0; i <= n + 6; i++) { const t = (i / n) * Math.PI * 2 - 2.2, r = 1 + noise(seed, i) * 0.035 + (i > n ? 0.06 : 0); pts.push([x + w / 2 + Math.cos(t) * w / 2 * r, y + h / 2 + Math.sin(t) * h / 2 * r]); }
    paths.push(toPath(pts));
  } else if (kind === "check") {
    const [x, y, w, h] = box; paths.push(toPath(jitter([[x, y + h * 0.55], [x + w * 0.2, y + h * 0.75], [x + w * 0.38, y + h], [x + w * 0.7, y + h * 0.45], [x + w, y]], seed, 2)));
  } else {
    const [x, y, w, h] = box; paths.push(toPath(jitter(curve([x, y], [x + w, y + h], 0.04, 10), seed, 2)), toPath(jitter(curve([x + w, y], [x, y + h], -0.04, 10), seed + 2, 2)));
  }
  const headP = interpolate(p, [0.85, 1], [0, 1], clamp);
  const lp = interpolate(f, [delay + draw * 0.6, delay + draw * 0.6 + 8], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}>
        {paths.map((d, i) => {
          const pi = kind === "cross" ? interpolate(p, [i * 0.5, i * 0.5 + 0.5], [0, 1], clamp) : kind === "underline" ? interpolate(p, [i * 0.35, 0.65 + i * 0.35], [0, 1], clamp) : p;
          return <path key={i} d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width * (i && kind === "underline" ? 0.6 : 1)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - pi} />;
        })}
        {head ? <path d={head} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - headP} /> : null}
      </svg>
      {label && labelAt ? (
        <div style={{ position: "absolute", left: labelAt[0], top: labelAt[1], transform: `translate(-50%,-50%) rotate(-4deg) scale(${0.8 + 0.2 * lp})`, opacity: lp, fontFamily: F.hand, fontSize: labelSize, color: labelColor, textShadow, whiteSpace: "nowrap" }}>{label}</div>
      ) : null}
    </div>
  );
};
