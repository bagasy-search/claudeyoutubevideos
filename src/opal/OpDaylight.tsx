// OpDaylight — horas de luz por mes, dibujadas a lápiz sobre papel de libreta con un horizonte de campo: el sol baja
// por la curva mes a mes, la línea de "laying steady" (14 h) y la de "slows way down" (12 h) quedan marcadas, y el
// mes actual se encierra en rojo. Props: points [{m, h}], steady, slow, mark (índice), title.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL, HAND, SLAB, notebookBg } from "./OpTheme";
import { PencilCircle, ease, useIn } from "./OpParts";

export const OpDaylight: React.FC<{ points: { m: string; h: number }[]; steady?: number; slow?: number; mark?: number; title?: string; unit?: string; seed?: number }> = ({ points, steady = 14, slow = 12, mark = -1, title = "Hours of daylight", unit = "h", seed = 9 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 14, 100);
  const X0 = 260, X1 = 1500, Y0 = 860, Y1 = 230, HMIN = 8, HMAX = 16;
  const x = (i: number) => X0 + ((X1 - X0) * i) / Math.max(1, points.length - 1);
  const y = (h: number) => Y0 - ((h - HMIN) / (HMAX - HMIN)) * (Y0 - Y1);
  const draw = interpolate(f, [10, 10 + points.length * 7], [0, 1], ease);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.h).toFixed(1)}`).join(" ");
  const len = 2600;
  const si = Math.min(points.length - 1, draw * (points.length - 1));
  const i0 = Math.floor(si), fr = si - i0, i1 = Math.min(points.length - 1, i0 + 1);
  const sx = x(i0) + (x(i1) - x(i0)) * fr, sy = y(points[i0].h) + (y(points[i1].h) - y(points[i0].h)) * fr;
  const line = (h: number, label: string, color: string, at: number) => {
    const o = interpolate(f, [at, at + 8], [0, 1], ease);
    return (
      <g opacity={o}>
        <line x1={X0 - 20} x2={X1 + 20} y1={y(h)} y2={y(h)} stroke={color} strokeWidth={5} strokeDasharray="18 14" />
        <text x={X1 + 40} y={y(h) + 14} fontFamily={HAND} fontWeight={700} fontSize={44} fill={color}>{label}</text>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ ...notebookBg(), transform: `translateY(${(1 - k) * 60}px)`, opacity: k }}>
      <div style={{ position: "absolute", left: 160, top: 60, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: OP.red, textTransform: "uppercase" }}>{title}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M0,${Y0 + 40} C400,${Y0 + 10} 800,${Y0 + 60} 1200,${Y0 + 30} S1800,${Y0 + 20} 1920,${Y0 + 40} L1920,1080 L0,1080 Z`} fill={OP.green} opacity={0.85} />
        {line(steady, `${steady} ${unit} · laying steady`, OP.green, 20)}
        {line(slow, `${slow} ${unit} · slows way down`, OP.red, 30)}
        <path d={path} fill="none" stroke={OP.pencil} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        {points.map((p, i) => {
          const o = interpolate(f, [10 + i * 7, 14 + i * 7], [0, 1], ease);
          return (
            <g key={i} opacity={o}>
              <circle cx={x(i)} cy={y(p.h)} r={11} fill={OP.pencil} />
              <text x={x(i)} y={Y0 + 120} textAnchor="middle" fontFamily={SLAB} fontWeight={700} fontSize={44} fill={OP.white}>{p.m}</text>
              <text x={x(i)} y={y(p.h) - 30} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={48} fill={OP.pencil}>{p.h.toFixed(1).replace(/\.0$/, "")}</text>
            </g>
          );
        })}
        <circle cx={sx} cy={sy - 6} r={34} fill={OP.yolk} stroke="#E08E1B" strokeWidth={5} />
      </svg>
      {mark >= 0 ? <PencilCircle cx={x(mark)} cy={y(points[mark].h) - 10} rx={90} ry={80} at={14 + points.length * 7} seed={seed} /> : null}
    </AbsoluteFill>
  );
};
