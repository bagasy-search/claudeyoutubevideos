// TdcZoomCircle — el círculo amarillo de la miniatura, sobre el footage y SIGUIENDO al objeto.
// El aro se dibuja (trazo), late suave, oscurece lo de afuera (foco) y puede agrandar lo de adentro
// (lupa real: vuelve a pintar el mismo cuadro del video escalado dentro del círculo).
// Props: track = keyframes {f,x,y,r} (f relativo al Sequence; x/y en % del cuadro; r en px) · label opcional.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_UI, clamp, ease, inOut, pop } from "./theme";

export type TrackKey = { f: number; x: number; y: number; r: number };
export const TdcZoomCircle: React.FC<{
  dur: number; track: TrackKey[]; label?: string; labelSide?: "left" | "right" | "top" | "bottom";
  dim?: number; color?: string;
  /** lupa: el mismo video de fondo (src/startFrom en cuadros del clip) agrandado `mag` veces dentro del aro */
  loupe?: { src: string; startFrom: number; mag: number };
}> = ({ dur, track, label, labelSide = "right", dim = 0.45, color = C.yellow, loupe }) => {
  const f = useCurrentFrame(), { fps, width, height } = useVideoConfig();
  const ks = track.map((k) => k.f);
  const at = (p: "x" | "y" | "r") => (track.length > 1 ? interpolate(f, ks, track.map((k) => k[p]), { ...clamp, easing: ease }) : track[0][p]);
  const x = (at("x") / 100) * width, y = (at("y") / 100) * height;
  const o = inOut(f, dur, 8, 8);
  const draw = interpolate(f, [2, 18], [0, 1], { ...clamp, easing: ease });
  const s = pop(f, fps, 0, 11);
  const r = at("r") * (0.6 + 0.4 * s) * (1 + 0.025 * Math.sin(f / 5));
  const circ = 2 * Math.PI * r;
  const lx = labelSide === "left" ? x - r - 40 : labelSide === "right" ? x + r + 40 : x;
  const ly = labelSide === "top" ? y - r - 40 : labelSide === "bottom" ? y + r + 40 : y;
  const lo = interpolate(f, [14, 24], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      {dim > 0 && (
        <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})`,
          WebkitMaskImage: `radial-gradient(circle ${r + 6}px at ${x}px ${y}px, transparent 98%, black 100%)`,
          maskImage: `radial-gradient(circle ${r + 6}px at ${x}px ${y}px, transparent 98%, black 100%)` }} />
      )}
      {loupe && (
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
          <AbsoluteFill style={{ transform: `scale(${1 + (loupe.mag - 1) * s})`, transformOrigin: `${x}px ${y}px` }}>
            <OffthreadVideo src={staticFile(loupe.src)} startFrom={loupe.startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <circle cx={x} cy={y} r={r + 7} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={16} strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} transform={`rotate(-90 ${x} ${y})`} />
        <circle cx={x} cy={y} r={r + 7} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} transform={`rotate(-90 ${x} ${y})`} />
        {label && <line x1={labelSide === "left" ? x - r - 7 : labelSide === "right" ? x + r + 7 : x} y1={labelSide === "top" ? y - r - 7 : labelSide === "bottom" ? y + r + 7 : y}
          x2={lx} y2={ly} stroke={color} strokeWidth={6} strokeLinecap="round" opacity={lo} />}
      </svg>
      {label && (
        <div style={{ position: "absolute", left: lx, top: ly, opacity: lo,
          transform: `translate(${labelSide === "left" ? "-100%" : labelSide === "right" ? "0" : "-50%"}, ${labelSide === "top" ? "-100%" : labelSide === "bottom" ? "0" : "-50%"}) scale(${0.85 + 0.15 * lo})`,
          background: color, color: C.ink, fontFamily: F_UI, fontWeight: 800, fontSize: 44, letterSpacing: 0.5, padding: "10px 22px", borderRadius: 10,
          boxShadow: "0 10px 28px rgba(0,0,0,0.45)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{label}</div>
      )}
    </AbsoluteFill>
  );
};
