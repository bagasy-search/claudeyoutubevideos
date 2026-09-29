// FlowSplit — un total que se parte en dos caminos (diagrama de flujo tipo Sankey): el ancho de cada cinta es
// proporcional a su cantidad. Pensado para "5,195 iguanas → ≈1,600 vivas fuera del estado / ≈3,580 sacrificadas".
// Cada rama puede llevar una flecha de salida (p. ej. hacia el norte, fuera de Florida). La fuente va al pie.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut } from "../theme";

type Branch = { value: number; label: string; sub?: string; color?: string; approx?: boolean; exit?: string };
export const FlowSplit: React.FC<{ total: number; totalLabel: string; branches: Branch[]; source?: string; kicker?: string }> = ({
  total, totalLabel, branches, source, kicker,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = clamp(f / Math.max(1, D - 1));
  const H = 520, X0 = 520, X1 = 1250, top = 280;          // la columna del total mide H px
  const sum = branches.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const lanes = branches.map((b, i) => {
    const h = (H * b.value) / sum; const y0 = top + acc; acc += h;
    const yT = i === 0 ? 170 : 620 + (i - 1) * 60;           // destino: arriba (sale) / abajo
    return { ...b, h, y0, yT };
  });
  const grow = (i: number) => easeInOut(clamp((t - 0.22 - i * 0.18) / 0.3));
  const cnt = (v: number, i: number, approx?: boolean) => approx ? Math.round((v * grow(i)) / 100) * 100 : Math.round(v * grow(i));

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #12302C 0%, #081413 70%)", overflow: "hidden" }}>
      {kicker ? <div style={{ position: "absolute", left: 80, top: 60, fontFamily: SANS, fontSize: 32, letterSpacing: 10, color: HK.bone, opacity: ease(f / 14) }}>{kicker}</div> : null}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          {lanes.map((l, i) => (
            <linearGradient key={i} id={`lg${i}`} x1="0" x2="1"><stop offset="0" stopColor={HK.bone} stopOpacity={0.9} /><stop offset="1" stopColor={l.color ?? HK.orange} stopOpacity={0.95} /></linearGradient>
          ))}
        </defs>
        {/* columna del total */}
        <rect x={X0 - 60} y={top} width={60} height={H * ease(clamp(t / 0.18))} fill={HK.bone} opacity={0.92} />
        {lanes.map((l, i) => {
          const g = grow(i); const xe = X0 + (X1 - X0) * g;
          const c1 = X0 + (X1 - X0) * 0.5;
          // cinta: curva de Bézier entre la franja de origen y la de destino, recortada por el avance
          const d = `M${X0} ${l.y0} C ${c1} ${l.y0}, ${c1} ${l.yT}, ${X1} ${l.yT} L ${X1} ${l.yT + l.h} C ${c1} ${l.yT + l.h}, ${c1} ${l.y0 + l.h}, ${X0} ${l.y0 + l.h} Z`;
          return (
            <g key={i}>
              <clipPath id={`cp${i}`}><rect x={X0} y={0} width={xe - X0} height={1080} /></clipPath>
              <path d={d} fill={`url(#lg${i})`} opacity={0.85} clipPath={`url(#cp${i})`} />
              {l.exit && g > 0.95 ? (
                <g opacity={ease(clamp((t - 0.22 - i * 0.18 - 0.3) / 0.1))}>
                  <path d={`M${X1 + 20} ${l.yT + l.h / 2} l 90 0 l 0 -120`} stroke={l.color ?? HK.orange} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${X1 + 110 - 26} ${l.yT + l.h / 2 - 104} l 26 -32 l 26 32`} stroke={l.color ?? HK.orange} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <text x={X1 + 150} y={l.yT + l.h / 2 - 118} fontFamily={SANS} fontSize={28} letterSpacing={5} fill={l.color ?? HK.orange}>{l.exit}</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {/* total */}
      <div style={{ position: "absolute", left: 80, top: top + H / 2 - 110, width: 360, textAlign: "right", opacity: ease(clamp(t / 0.12)) }}>
        <div style={{ fontFamily: SERIF, fontSize: 124, lineHeight: 1, color: HK.bone }}>{total.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: HK.bone, opacity: 0.85, marginTop: 8 }}>{totalLabel}</div>
      </div>
      {/* ramas */}
      {lanes.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: X1 + (l.exit ? 150 : 30), top: l.yT + (l.exit ? l.h / 2 - 60 : l.h / 2 - 70), opacity: ease(clamp((grow(i) - 0.6) / 0.3)) }}>
          <div style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1, color: l.color ?? HK.orange, fontVariantNumeric: "tabular-nums" }}>{l.approx ? "≈" : ""}{cnt(l.value, i, l.approx).toLocaleString("en-US")}</div>
          <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 4, color: HK.bone, marginTop: 6 }}>{l.label}</div>
          {l.sub ? <div style={{ fontFamily: MONO, fontSize: 22, color: "rgba(241,235,221,0.7)", marginTop: 4 }}>{l.sub}</div> : null}
        </div>
      ))}
      {source ? <div style={{ position: "absolute", left: 80, bottom: 50, fontFamily: MONO, fontSize: 20, color: "rgba(241,235,221,0.65)", opacity: ease(clamp((t - 0.5) / 0.1)) }}>{source}</div> : null}
      <AbsoluteFill style={{ background: "#000", opacity: clamp((f - (D - 10)) / 10), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
