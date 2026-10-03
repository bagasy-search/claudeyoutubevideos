// TdcWaterTest — capa de "prueba de agua" sobre el footage: gotas que resbalan por la pared con estela y
// partículas de salpicadura (física simple: aceleración + zigzag), sello de CÁMARA LENTA que late y un
// cronómetro que corre. Las gotas se generan con semilla: mismo resultado en cada render (determinístico).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut } from "./theme";

const rnd = (i: number, s: number) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
export const TdcWaterTest: React.FC<{ dur: number; area?: [number, number, number, number]; drops?: number; slowLabel?: string; timer?: boolean; seed?: number }> = ({ dur, area = [8, 10, 60, 85], drops = 26, slowLabel, timer = true, seed = 3 }) => {
  const f = useCurrentFrame(), { width: W, height: H, fps } = useVideoConfig();
  const o = inOut(f, dur, 6, 10);
  const [ax, ay, aw, ah] = area.map((v, i) => (i % 2 ? (v / 100) * H : (v / 100) * W));
  const D = Array.from({ length: drops }, (_, i) => {
    const t0 = Math.floor(rnd(i, seed) * Math.max(1, dur - 30)), t = f - t0;
    if (t < 0) return null;
    const x0 = ax + rnd(i + 1, seed) * aw, y0 = ay + rnd(i + 2, seed) * ah * 0.35;
    const y = y0 + 0.45 * t * t * (0.35 + rnd(i + 3, seed) * 0.5) + t * 2;
    if (y > ay + ah + 40) return null;
    const x = x0 + Math.sin(t / 6 + i) * 3;
    const r = 5 + rnd(i + 4, seed) * 7, tail = Math.min(160, (y - y0) * 0.9);
    return { x, y, r, tail, i };
  }).filter(Boolean) as { x: number; y: number; r: number; tail: number; i: number }[];
  const secs = f / fps;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="wt_tail" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="rgba(220,245,255,0.75)" /><stop offset="1" stopColor="rgba(220,245,255,0)" /></linearGradient>
          <radialGradient id="wt_drop" cx="0.35" cy="0.35" r="0.7"><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="rgba(190,235,255,0.9)" /><stop offset="1" stopColor="rgba(80,150,200,0.55)" /></radialGradient>
        </defs>
        {D.map((d) => (
          <g key={d.i}>
            <rect x={d.x - d.r * 0.45} y={d.y - d.tail} width={d.r * 0.9} height={d.tail} rx={d.r * 0.45} fill="url(#wt_tail)" />
            <ellipse cx={d.x} cy={d.y} rx={d.r} ry={d.r * 1.25} fill="url(#wt_drop)" />
            <ellipse cx={d.x - d.r * 0.3} cy={d.y - d.r * 0.4} rx={d.r * 0.25} ry={d.r * 0.35} fill="#fff" />
          </g>
        ))}
      </svg>
      {slowLabel && (
        <div style={{ position: "absolute", top: 54, right: 60, display: "flex", alignItems: "center", gap: 14, background: "rgba(10,10,10,0.8)", padding: "12px 24px", borderRadius: 999,
          transform: `scale(${interpolate(f, [0, 10], [0.6, 1], { ...clamp, easing: ease })})` }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: C.red, opacity: 0.55 + 0.45 * Math.sin(f / 4) }} />
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 36, color: C.white, letterSpacing: 2, textTransform: "uppercase" }}>{slowLabel}</div>
        </div>
      )}
      {timer && (
        <div style={{ position: "absolute", bottom: 60, left: 60, fontFamily: F_DISPLAY, fontSize: 84, color: C.water, textShadow: "0 4px 0 rgba(0,0,0,0.6)",
          background: "rgba(10,10,10,0.6)", padding: "4px 26px", borderRadius: 16 }}>
          {`00:${String(Math.floor(secs)).padStart(2, "0")}.${String(Math.floor((secs % 1) * 100)).padStart(2, "0")}`}
        </div>
      )}
    </AbsoluteFill>
  );
};
