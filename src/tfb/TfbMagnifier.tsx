// TfbMagnifier — la LUPA amarilla de las miniaturas, hecha de verdad: un círculo que AMPLÍA el mismo video que está
// debajo (misma fuente, mismo cuadro) alrededor de un punto que puede moverse (sigue al objeto por keyframes).
// Entra con resorte, el aro se dibuja, y una etiqueta corta cuelga al costado. Props sin texto quemado.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeInOut, outro, pop } from "./theme";

export type MagKey = { f: number; x: number; y: number }; // x,y en % del cuadro (del video de abajo)
export const TfbMagnifier: React.FC<{
  src: string; startFrom?: number; image?: boolean; path: MagKey[]; dur: number;
  zoom?: number; r?: number; label?: string; labelSide?: "left" | "right"; lensAt?: { x: number; y: number };
}> = ({ src, startFrom = 0, image = false, path, dur, zoom = 2.4, r = 230, label, labelSide = "right", lensAt }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig();
  const ks = path.map((p) => p.f);
  const at = (k: "x" | "y") => (path.length > 1 ? interpolate(f, ks, path.map((p) => p[k]), { ...clamp, easing: easeInOut }) : path[0][k]);
  const px = (at("x") / 100) * W, py = (at("y") / 100) * H;
  // la lente puede estar desplazada del punto (lensAt), con un "tallo" que los une
  const lx = lensAt ? (lensAt.x / 100) * W : px, ly = lensAt ? (lensAt.y / 100) * H : py;
  const p = pop(f, fps, 0, 12, 0.7), o = outro(f, dur, 8);
  const rr = r * interpolate(p, [0, 1], [0.2, 1]);
  const ring = interpolate(f, [2, 16], [0, 1], { ...clamp, easing: easeInOut });
  const C = 2 * Math.PI * (r + 6);
  const media = { position: "absolute" as const, left: lx - px * zoom, top: ly - py * zoom, width: W * zoom, height: H * zoom, objectFit: "cover" as const };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {lensAt && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={px} y1={py} x2={lx} y2={ly} stroke={TFB.yellow} strokeWidth={7} strokeLinecap="round" opacity={ring} />
          <circle cx={px} cy={py} r={20 * ring} fill="none" stroke={TFB.yellow} strokeWidth={6} />
        </svg>
      )}
      <div style={{ position: "absolute", left: lx - rr, top: ly - rr, width: rr * 2, height: rr * 2, borderRadius: "50%", overflow: "hidden",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: -(lx - rr), top: -(ly - rr), width: W, height: H }}>
          {image ? <Img src={staticFile(src)} style={media} /> : <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={media} />}
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 60px rgba(0,0,0,0.35), inset 0 -20px 40px rgba(255,255,255,0.08)" }} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={lx} cy={ly} r={r + 6} fill="none" stroke={TFB.yellow} strokeWidth={13} strokeDasharray={C} strokeDashoffset={C * (1 - ring)}
          transform={`rotate(-90 ${lx} ${ly})`} strokeLinecap="round" opacity={p > 0.05 ? 1 : 0} />
      </svg>
      {label && (
        <div style={{ position: "absolute", top: ly + r * 0.55, left: labelSide === "right" ? lx + r * 0.75 : undefined, right: labelSide === "left" ? W - lx + r * 0.75 : undefined,
          transform: `rotate(${labelSide === "right" ? -4 : 4}deg) scale(${interpolate(f, [10, 20], [0.6, 1], clamp)})`, opacity: interpolate(f, [10, 18], [0, 1], clamp),
          fontFamily: CAVEAT, fontSize: 74, color: TFB.yellow, fontWeight: 700, whiteSpace: "nowrap",
          textShadow: "0 3px 0 #000, 0 0 18px rgba(0,0,0,0.8), 2px 2px 0 #000, -2px -2px 0 #000" }}>{label}</div>
      )}
    </AbsoluteFill>
  );
};
