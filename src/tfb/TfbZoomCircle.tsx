// TfbZoomCircle — la LUPA amarilla de las miniaturas, sobre el footage: marca un punto (anillo que late), y una
// lente circular al costado muestra ESE punto aumentado — es el mismo video, recortado y ampliado en vivo, y la lente
// SIGUE al objeto por teclas {f, x, y}. Rótulo opcional escrito a mano. Sin texto quemado: todo por props.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeInOut, outro, pop } from "./theme";

export type ZKey = { f: number; x: number; y: number }; // x/y en fracción del cuadro (0-1)
const at = (keys: ZKey[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1];
    if (f <= b.f) { const t = interpolate(f, [a.f, b.f], [0, 1], { ...clamp, easing: easeInOut }); return { f, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; } }
  return keys[keys.length - 1];
};
export const TfbZoomCircle: React.FC<{
  dur: number; src: string; video?: boolean; startFrom?: number; keys: ZKey[]; zoom?: number; r?: number;
  lens?: { x: number; y: number }; label?: string; labelSide?: "left" | "right";
}> = ({ dur, src, video = true, startFrom = 0, keys, zoom = 2.4, r = 230, lens, label, labelSide = "right" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const W = 1920, H = 1080, o = outro(f, dur, 7);
  const p = at(keys, f), px = p.x * W, py = p.y * H;
  // la lente va al lado opuesto del punto si no se fija
  const L = lens ? { x: lens.x * W, y: lens.y * H } : { x: px > W / 2 ? px - 520 : px + 520, y: Math.min(H - r - 60, Math.max(r + 60, py - 120)) };
  const pin = pop(f, fps, 0, 12, 0.6), pl = pop(f, fps, 6, 12, 0.7);
  const pulse = 1 + Math.sin(f / 5) * 0.06;
  const media: React.CSSProperties = { position: "absolute", width: W * zoom, height: H * zoom, left: L.x - px * zoom, top: L.y - py * zoom, objectFit: "cover" };
  const ang = Math.atan2(py - L.y, px - L.x), sx = L.x + Math.cos(ang) * r, sy = L.y + Math.sin(ang) * r;
  const lineLen = Math.hypot(px - sx, py - sy) - 44 * pin;
  const draw = interpolate(f, [4, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={px} cy={py} r={44 * pin * pulse} fill="none" stroke={TFB.yellow} strokeWidth={9} />
        <line x1={sx} y1={sy} x2={sx + Math.cos(ang) * Math.max(0, lineLen) * draw} y2={sy + Math.sin(ang) * Math.max(0, lineLen) * draw} stroke={TFB.yellow} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: L.x - r, top: L.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden",
        transform: `scale(${pl})`, border: `12px solid ${TFB.yellow}`, boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: -(L.x - r), top: -(L.y - r), width: W, height: H }}>
          {video ? <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={media} /> : <Img src={staticFile(src)} style={media} />}
        </div>
      </div>
      {label && (() => { const q = pop(f, fps, 12, 12, 0.6); return (
        <div style={{ position: "absolute", top: L.y + r + 18, left: labelSide === "right" ? L.x - r + 20 : undefined, right: labelSide === "left" ? W - L.x - r + 20 : undefined,
          fontFamily: CAVEAT, fontWeight: 700, fontSize: 62, color: TFB.white, opacity: q, transform: `rotate(-3deg) translateY(${(1 - q) * 16}px)`,
          textShadow: "0 3px 0 rgba(0,0,0,0.75), 0 0 18px rgba(0,0,0,0.6)" }}>{label}</div>); })()}
    </AbsoluteFill>
  );
};
