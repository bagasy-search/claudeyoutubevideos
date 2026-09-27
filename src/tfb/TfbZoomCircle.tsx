// TfbZoomCircle — la lupa amarilla de las miniaturas, VIVA: un anillo que se dibuja, sigue al objeto (keyframes) y
// adentro muestra el MISMO footage ampliado (children = el medio a pantalla completa, sincronizado). Afuera se oscurece
// apenas. Etiqueta a mano opcional con su línea.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, pop, textShadow } from "./theme";

export type TfbZoomCircleProps = {
  dur: number; children: React.ReactNode;
  path: [number, number, number][];     // [cuadro, x, y] en px de 1920x1080 (el centro sigue estos puntos)
  r?: number; zoom?: number; label?: string; labelDx?: number; labelDy?: number; dim?: number;
};
function at(path: [number, number, number][], f: number): [number, number] {
  if (f <= path[0][0]) return [path[0][1], path[0][2]];
  for (let i = 0; i < path.length - 1; i++) {
    const [f0, x0, y0] = path[i], [f1, x1, y1] = path[i + 1];
    if (f <= f1) { const t = ease((f - f0) / Math.max(1, f1 - f0)); return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; }
  }
  const l = path[path.length - 1]; return [l[1], l[2]];
}
export const TfbZoomCircle: React.FC<TfbZoomCircleProps> = ({ dur, children, path, r = 210, zoom = 1.9, label, labelDx = 300, labelDy = -170, dim = 0.3 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const [cx, cy] = at(path, f);
  const s = pop(f, fps, 0, 12);
  const out = interpolate(f, [dur - 8, dur], [1, 0], { ...clamp, easing: easeIn });
  const ring = interpolate(f, [2, 16], [0, 1], { ...clamp, easing: ease });
  const R = r * (0.6 + 0.4 * s) * (0.9 + 0.1 * out);
  const z = 1 + (zoom - 1) * s;
  const lp = interpolate(f, [12, 22], [0, 1], { ...clamp, easing: ease });
  const lx = cx + labelDx, ly = cy + labelDy;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      {/* velo afuera del círculo */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, rgba(0,0,0,${dim}) ${R + 2}px)` }} />
      {/* el footage ampliado adentro */}
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${R}px at ${cx}px ${cy}px)` }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${z})` }}>{children}</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={R + 4} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={16} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-110 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.yellow} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-110 ${cx} ${cy})`} />
        {label ? <path d={`M${cx + (labelDx > 0 ? R * 0.72 : -R * 0.72)},${cy + (labelDy > 0 ? R * 0.7 : -R * 0.7)} L${lx - (labelDx > 0 ? 24 : -24)},${ly + 30}`} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} /> : null}
      </svg>
      {label ? <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(${labelDx > 0 ? "0" : "-100%"},-50%) rotate(-3deg)`, opacity: lp, fontFamily: F.hand, fontSize: 60, color: C.white, textShadow, whiteSpace: "nowrap" }}>{label}</div> : null}
    </div>
  );
};
