// TfbScribble — trazos HECHOS A MANO que se dibujan sobre el footage: círculo, flecha curva, subrayado o cruz.
// El trazo "hierve" (leve temblor por cuadro, determinista) como un marcador real; nota manuscrita opcional.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeOut, jitter, outro, pop } from "./theme";

export type Mark = { kind: "circle" | "arrow" | "underline" | "cross" | "check"; x: number; y: number; w?: number; h?: number; to?: { x: number; y: number };
  at?: number; color?: string; note?: string; noteDx?: number; noteDy?: number };
export const TfbScribble: React.FC<{ dur: number; marks: Mark[]; width?: number }> = ({ dur, marks, width = 10 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 7), W = 1920, H = 1080;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs><filter id="sc-sh"><feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.5" /></filter></defs>
        {marks.map((m, i) => {
          const a = m.at ?? i * 8, prog = interpolate(f, [a, a + 14], [0, 1], { ...clamp, easing: easeOut });
          if (prog <= 0) return null;
          const col = m.color ?? (m.kind === "cross" ? TFB.red : m.kind === "check" ? TFB.green : TFB.yellow);
          const cx = m.x * W, cy = m.y * H, bw = (m.w ?? 0.12) * W, bh = (m.h ?? 0.1) * H, j = (s: number) => jitter(Math.floor(f / 2), s, 1.6);
          let d = "";
          if (m.kind === "circle") { // elipse abierta que se pasa un poco de largo, como a mano
            const pts: string[] = []; for (let k = 0; k <= 44; k++) { const t = (k / 40) * Math.PI * 2 - 0.6; const rr = 1 + Math.sin(k * 1.3 + i) * 0.03;
              pts.push(`${(cx + Math.cos(t) * bw / 2 * rr + j(k)).toFixed(1)},${(cy + Math.sin(t) * bh / 2 * rr + j(k + 9)).toFixed(1)}`); }
            d = "M" + pts.join(" L");
          } else if (m.kind === "underline") d = `M${cx - bw / 2 + j(1)},${cy + j(2)} Q${cx},${cy + 14 + j(3)} ${cx + bw / 2 + j(4)},${cy - 6 + j(5)}`;
          else if (m.kind === "arrow" && m.to) { const tx = m.to.x * W, ty = m.to.y * H, mx = (cx + tx) / 2 + (ty - cy) * 0.25, my = (cy + ty) / 2 - (tx - cx) * 0.25;
            d = `M${cx + j(1)},${cy + j(2)} Q${mx + j(3)},${my + j(4)} ${tx},${ty}`; }
          else if (m.kind === "cross") d = `M${cx - bw / 2},${cy - bh / 2} L${cx + bw / 2 + j(1)},${cy + bh / 2 + j(2)} M${cx + bw / 2},${cy - bh / 2} L${cx - bw / 2 + j(3)},${cy + bh / 2 + j(4)}`;
          else if (m.kind === "check") d = `M${cx - bw / 2},${cy} L${cx - bw / 8 + j(1)},${cy + bh / 2 + j(2)} L${cx + bw / 2 + j(3)},${cy - bh / 2 + j(4)}`;
          let head = null;
          if (m.kind === "arrow" && m.to && prog > 0.85) { const tx = m.to.x * W, ty = m.to.y * H, mx = (cx + tx) / 2 + (ty - cy) * 0.25, my = (cy + ty) / 2 - (tx - cx) * 0.25;
            const ang = Math.atan2(ty - my, tx - mx), L = 38, hp = interpolate(prog, [0.85, 1], [0, 1], clamp);
            head = <path d={`M${tx - Math.cos(ang - 0.5) * L * hp},${ty - Math.sin(ang - 0.5) * L * hp} L${tx},${ty} L${tx - Math.cos(ang + 0.5) * L * hp},${ty - Math.sin(ang + 0.5) * L * hp}`}
              stroke={col} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#sc-sh)" />; }
          return (
            <g key={i}>
              <path d={d} stroke={col} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} filter="url(#sc-sh)" />
              {head}
            </g>
          );
        })}
      </svg>
      {marks.filter(m => m.note).map((m, i) => { const a = (m.at ?? i * 8) + 10, p = pop(f, fps, a, 12, 0.6); return (
        <div key={i} style={{ position: "absolute", left: m.x * W + (m.noteDx ?? 0), top: m.y * H + (m.noteDy ?? -130), transform: `translate(-50%,0) rotate(-3deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
          opacity: p, fontFamily: CAVEAT, fontWeight: 700, fontSize: 66, color: m.color ?? TFB.white, whiteSpace: "nowrap",
          textShadow: "0 3px 0 rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.55)" }}>{m.note}</div>); })}
    </AbsoluteFill>
  );
};
