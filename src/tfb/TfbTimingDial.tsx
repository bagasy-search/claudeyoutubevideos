// TfbTimingDial — el "reloj del punto": un semicírculo con 3 zonas (temprano / justo / tarde) y una aguja que recorre
// keyframes. La zona donde está la aguja se enciende y su etiqueta crece. Sirve para cualquier "momento justo"
// (lavado, pintura, pegamento, horno…): las etiquetas y colores son props.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, pop, smooth, textShadow } from "./theme";

export type TfbTimingDialProps = {
  dur: number; needle: [number, number][];                  // [cuadro, 0..1]
  zones?: { label: string; to: number; color: string }[];   // límites acumulados 0..1
  title?: string; x?: number; y?: number; size?: number;
};
const DEF = [{ label: "TEMPRANO", to: 0.36, color: "#4DA3FF" }, { label: "JUSTO", to: 0.64, color: C.green }, { label: "TARDE", to: 1, color: C.red }];
const val = (k: [number, number][], f: number) => { if (f <= k[0][0]) return k[0][1]; for (let i = 0; i < k.length - 1; i++) { const [f0, v0] = k[i], [f1, v1] = k[i + 1]; if (f <= f1) return v0 + (v1 - v0) * ease((f - f0) / Math.max(1, f1 - f0)); } return k[k.length - 1][1]; };
export const TfbTimingDial: React.FC<TfbTimingDialProps> = ({ dur, needle, zones = DEF, title, x = 1440, y = 560, size = 420 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const s = pop(f, fps, 0, 13);
  const out = interpolate(f, [dur - 8, dur], [1, 0], { ...clamp, easing: easeIn });
  const v = Math.max(0, Math.min(1, val(needle, f) + smooth(4, f / 5) * 0.006));
  const R = size / 2, cx = R + 20, cy = R + 20, W = size + 40;
  const pt = (t: number, rr: number) => { const a = Math.PI + t * Math.PI; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; };
  const arc = (t0: number, t1: number, rr: number) => { const [x0, y0] = pt(t0, rr), [x1, y1] = pt(t1, rr); return `M${x0},${y0} A${rr},${rr} 0 0 1 ${x1},${y1}`; };
  let z0 = 0; const cur = zones.findIndex(z => v <= z.to + 1e-6);
  const [nx, ny] = pt(v, R - 36);
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - W / 2, width: W, opacity: out, transform: `scale(${0.7 + 0.3 * s})`, transformOrigin: "50% 60%" }}>
      <svg width={W} height={R + 70} style={{ overflow: "visible", filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5))" }}>
        <path d={arc(0, 1, R)} stroke="rgba(10,10,10,0.72)" strokeWidth={70} fill="none" />
        {zones.map((z, i) => { const d = arc(z0 + 0.008, z.to - 0.008, R); z0 = z.to; const on = i === cur;
          return <path key={i} d={d} stroke={z.color} strokeWidth={on ? 50 : 34} opacity={on ? 1 : 0.45} fill="none" strokeLinecap="butt" />; })}
        {Array.from({ length: 21 }, (_, i) => { const [a1, b1] = pt(i / 20, R - 44), [a2, b2] = pt(i / 20, R - (i % 5 ? 54 : 64)); return <line key={i} x1={a1} y1={b1} x2={a2} y2={b2} stroke="rgba(255,255,255,0.7)" strokeWidth={i % 5 ? 2 : 4} />; })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={22} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: R - 10, display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
        {zones.map((z, i) => <div key={i} style={{ fontFamily: F.impact, fontSize: i === cur ? 44 : 30, color: i === cur ? z.color : "rgba(255,255,255,0.75)", textShadow, transition: "none", width: W / 3, textAlign: i === 0 ? "left" : i === zones.length - 1 ? "right" : "center" }}>{z.label}</div>)}
      </div>
      {title ? <div style={{ position: "absolute", left: 0, right: 0, top: -64, textAlign: "center", fontFamily: F.ui, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: C.yellow, textShadow }}>{title}</div> : null}
    </div>
  );
};
