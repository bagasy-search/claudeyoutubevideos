// Kit COCINA del canal Claudio Vaquero (EN), dentro del mundo (cama real + sombra + luz):
//   CvMeatThermo  termómetro de carne de aguja (°F): la aguja sube de `from` a `to`; marca la línea USDA (`mark`, 145 °F)
//                 con su rótulo; pasado el blanco (`over`) se pone rojo ("DRY")
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const OK = "#3E8A3A", HOT = "#C8372D";
const Tag: React.FC<{ text: string; color: string; o?: number }> = ({ text, color, o = 1 }) => (
  <div style={{ opacity: o, display: "inline-block", background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);

// ───────────────── CvMeatThermo
export const CvMeatThermo: React.FC<{ from?: number; to?: number; mark?: number; over?: number; label?: string; sub?: string; bed?: string }> = ({ from = 70, to = 145, mark = 145, over = 160, label, sub, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  const v = from + (to - from) * ease(clamp01((f - 14) / (T * 0.5)));
  const LO = 40, HI = 200, ang = (t: number) => -120 + 240 * clamp01((t - LO) / (HI - LO)); // esfera de -120° a +120°
  const R = 300, cx = 360, cy = 360;
  const pt = (t: number, r: number) => { const a = (ang(t) - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const hot = v > over, done = v >= mark - 0.5;
  const col = hot ? HOT : done ? OK : CL.navy;
  const [mx1, my1] = pt(mark, R - 10), [mx2, my2] = pt(mark, R - 70);
  const [nx, ny] = pt(v, R - 40);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={161} dim={0.3} />
      <Contact x={760} y={930} w={620} o={0.35} />
      <div style={{ position: "absolute", left: 760, top: 520, translate: "-50% -50%", scale: String(0.85 + 0.15 * p) }}>
        <Card style={{ width: 720, height: 720, borderRadius: "50%", padding: 0, position: "relative", background: "radial-gradient(circle at 40% 35%,#FFFFFF,#E9E4DA)" }}>
          <svg width={720} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
            <circle cx={cx} cy={cy} r={R + 16} fill="none" stroke="#9AA0A6" strokeWidth={14} />
            {Array.from({ length: 17 }, (_, i) => LO + i * 10).map((t) => { const [a1, b1] = pt(t, R - 6), [a2, b2] = pt(t, t % 20 === 0 ? R - 46 : R - 28); const [tx, ty] = pt(t, R - 82);
              return <g key={t}><line x1={a1} y1={b1} x2={a2} y2={b2} stroke={CL.ink} strokeWidth={t % 20 === 0 ? 6 : 3} />{t % 40 === 0 ? <text x={tx} y={ty + 12} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.ink}>{t}</text> : null}</g>; })}
            {[[mark, over, OK], [over, HI, HOT]].map(([a, b, c], i) => { const r = R - 18, [x1, y1] = pt(a as number, r), [x2, y2] = pt(b as number, r);
              return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={c as string} strokeWidth={22} opacity={0.35 * lin(f, 6, 14)} />; })}
            <line x1={mx1} y1={my1} x2={mx2} y2={my2} stroke={OK} strokeWidth={14} strokeLinecap="round" opacity={lin(f, 6, 14)} />
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={col} strokeWidth={12} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={26} fill={CL.ink} />
            <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill="#7A7F86">°F</text>
          </svg>
        </Card>
        <div style={{ position: "absolute", left: 800, top: 140, fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: col, whiteSpace: "nowrap", lineHeight: 1 }}>{Math.round(v)}°F</div>
        {label ? <div style={{ position: "absolute", left: 800, top: 370, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.ink, whiteSpace: "nowrap", opacity: lin(f, 8, 16) }}>{label}</div> : null}
        {sub ? <div style={{ position: "absolute", left: 800, top: 470 }}><Tag text={sub} color={hot ? HOT : OK} o={lin(f, T * 0.55, T * 0.65)} /></div> : null}
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
