// WorldBed.tsx — piezas compartidas para componentes "DENTRO DEL MUNDO" (canal Ray Kessler, oct-2026).
//
// ⛔ Regla del creador (ahnight 29-sep y rkkeyless 3-oct: "los componentes quedaron muy flojos,
//    aburridos"): nada de número + etiqueta sobre fondo negro. El gráfico vive SOBRE la foto/clip real
//    del momento: la escena se ve (dim bajo), la cámara empuja, y lo dibujado brilla encima como si
//    estuviera en el lugar (ondas que salen de la ventana real, el sello sobre la manija real).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, clamp01 } from "./RayStage";

// Foto o clip a pantalla completa con empuje de cámara lento hacia (fx, fy) en % y grade sobrio.
export const WorldBed: React.FC<{ src?: string; push?: number; fx?: number; fy?: number; dim?: number; tint?: string; durationInFrames?: number }> = ({
  src, push = 0.12, fx = 50, fy = 50, dim = 0.18, tint, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seq);
  const s = 1.04 + push * clamp01(frame / D);
  if (!src) return <AbsoluteFill style={{ background: V.ink0 }} />;
  const url = staticFile(src);
  const media = /\.mp4$/i.test(src)
    ? <OffthreadVideo src={url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: V.ink0 }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${fx}% ${fy}%` }}>{media}</AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(6,6,8,${dim})` }} />
      {tint ? <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// Anillos de luz que laten desde un punto de la escena (x, y en %).
export const Pulse: React.FC<{ x: number; y: number; color: string; t: number; r?: number; on?: number }> = ({ x, y, color, t, r = 160, on = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <radialGradient id={`g${x}${y}`}><stop offset="0%" stopColor={color} stopOpacity={0.55 * on} /><stop offset="100%" stopColor={color} stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={x * 19.2} cy={y * 10.8} r={r * 0.55} fill={`url(#g${x}${y})`} />
      {[0, 1, 2].map((k) => {
        const q = ((frame / 34 + k / 3) % 1);
        return <circle key={k} cx={x * 19.2} cy={y * 10.8} r={18 + q * r} fill="none" stroke={rgba(color, (1 - q) * 0.9 * on * clamp01(t * 8))} strokeWidth={5 - q * 3} />;
      })}
    </svg>
  );
};

// Sello de goma que golpea la pantalla (veredicto).
export const Stamp: React.FC<{ text: string; color: string; p: number; x?: number; y?: number; rot?: number; size?: number }> = ({ text, color, p, x = 50, y = 50, rot = -8, size = 110 }) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.35, 0.55, 1], [2.4, 0.92, 1.04, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: clamp01(p * 4),
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 4, color, padding: "8px 34px",
      border: `10px solid ${color}`, borderRadius: 16, background: "rgba(0,0,0,.35)", textShadow: "0 6px 30px rgba(0,0,0,.8)", whiteSpace: "nowrap",
    }}>{text}</div>
  );
};

// Rótulo de esquina sobrio (kicker + título) con barra de latón.
export const Tag: React.FC<{ kicker?: string; title?: string; a: number }> = ({ kicker, title, a }) => (
  <div style={{ position: "absolute", left: 90, top: 70, opacity: a, transform: `translateX(${(1 - a) * -30}px)`, borderLeft: `6px solid ${V.brass}`, paddingLeft: 20 }}>
    {kicker ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.4, color: V.brassSoft, textShadow: "0 3px 14px rgba(0,0,0,.9)" }}>{kicker}</div> : null}
    {title ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 4px 22px rgba(0,0,0,.95)" }}>{title}</div> : null}
  </div>
);
