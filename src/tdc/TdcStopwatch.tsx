// TdcStopwatch — cronómetro que corre sobre el footage y se CONGELA con un golpe en el valor medido (p.ej. "8,0 s").
// Sólo pide el valor final (lo que se ve en la escena); cuenta linealmente hasta `to` durante `runFrames`, retiene y sale.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, inOut, pop } from "./theme";

const fmt = (s: number) => {
  const m = Math.floor(s / 60), r = s - m * 60;
  return (m ? `${m}:` : "") + (m ? r.toFixed(1).padStart(4, "0") : r.toFixed(1)).replace(".", ",");
};

export const TdcStopwatch: React.FC<{ dur: number; to: number; label?: string; at?: [number, number]; runFrames?: number; unit?: string; tone?: "yellow" | "red" }> = ({
  dur, to, label, at = [82, 16], runFrames, unit = "s", tone = "yellow" }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  const run = Math.max(12, runFrames ?? Math.round(dur * 0.62));
  const t = interpolate(f, [8, 8 + run], [0, to], { ...clamp, easing: (x) => x });
  const done = f >= 8 + run, hit = pop(f, fps, 8 + run, 8);
  const o = inOut(f, dur, 6, 10), s = pop(f, fps, 0, 12);
  const col = tone === "red" ? C.red : C.yellow;
  const R = 118, ang = (t / to) * 360;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: (at[0] / 100) * W, top: (at[1] / 100) * H, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * s) * (done ? 1 + 0.12 * (1 - hit) : 1)})`, display: "flex", alignItems: "center", gap: 22,
        background: "rgba(14,14,14,0.88)", padding: "16px 34px 16px 18px", borderRadius: 26, boxShadow: `0 16px 44px rgba(0,0,0,0.55), 0 0 0 ${done ? 4 : 0}px ${col}` }}>
        <svg viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`} style={{ width: 130, height: 130 }}>
          <circle cx={0} cy={0} r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={14} />
          <circle cx={0} cy={0} r={R} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${(ang / 360) * 2 * Math.PI * R} 9999`} transform="rotate(-90)" />
          <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * (R - 26)} y2={-Math.cos((ang * Math.PI) / 180) * (R - 26)} stroke={C.white} strokeWidth={9} strokeLinecap="round" />
          <circle r={12} fill={C.white} />
        </svg>
        <div>
          {label && <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 26, color: "rgba(255,255,255,0.75)", letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>}
          <div style={{ fontFamily: F_DISPLAY, fontSize: 118, lineHeight: 1, color: done ? col : C.white, fontVariantNumeric: "tabular-nums" }}>{fmt(t)}<span style={{ fontSize: 52, opacity: 0.7 }}> {unit}</span></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
