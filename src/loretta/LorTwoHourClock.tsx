// LorTwoHourClock — la regla de seguridad dicha simple: un reloj cuya cuña se llena de verde a rojo en 2 horas
// (1 hora si afuera hace más de 90°F) + un termómetro con la marca de 40°F del refrigerador. Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LOR, SERIF, HAND, gingham } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const pt = (r: number, a: number) => [Math.sin(a) * r, -Math.cos(a) * r];
const wedge = (r: number, a0: number, a1: number) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M0,0 L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`; };

export const LorTwoHourClock: React.FC<{ title?: string; hours?: number; hotNote?: string; coldNote?: string; coldTemp?: string; hotTemp?: string }> = ({ title, hours = 2, hotNote, coldNote, coldTemp = "40°F", hotTemp = "90°F" }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 16], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const p = interpolate(f, [18, 120], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const sweep = p * Math.PI * 2 * (hours / 12);
  const col = p < 0.6 ? LOR.green : p < 0.9 ? LOR.butter : LOR.gingham;
  const hot = interpolate(f, [90, 118], [0, 1], cl);
  const therm = interpolate(f, [30, 90], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: LOR.ink, opacity: inn }}>{title}</div> : null}
      <svg viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(-340 50)" opacity={inn}>
          <circle r="330" fill="#FFFDF7" stroke={LOR.ink} strokeWidth="14" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const [x0, y0] = pt(290, a), [x1, y1] = pt(318, a); const [tx, ty] = pt(250, a); return <g key={i}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={LOR.ink} strokeWidth="8" strokeLinecap="round" /><text x={tx} y={ty + 18} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize="52" fill={LOR.ink}>{i === 0 ? 12 : i}</text></g>; })}
          <path d={wedge(300, 0, sweep)} fill={col} opacity="0.55" />
          <line x1="0" y1="0" x2={pt(280, sweep)[0]} y2={pt(280, sweep)[1]} stroke={LOR.ink} strokeWidth="12" strokeLinecap="round" />
          <circle r="18" fill={LOR.ink} />
          <text y="420" textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize="120" fill={col === LOR.butter ? LOR.crustDark : col}>{hours} hours</text>
        </g>
        <g transform="translate(430 20)" opacity={inn}>
          <rect x="-40" y="-330" width="80" height="560" rx="40" fill="#FFFDF7" stroke={LOR.ink} strokeWidth="10" />
          <circle cx="0" cy="250" r="78" fill="#FFFDF7" stroke={LOR.ink} strokeWidth="10" />
          <rect x="-24" y={-310 + (1 - therm) * 380} width="48" height={380 * therm + 180} rx="24" fill="#3E8FB0" />
          <circle cx="0" cy="250" r="62" fill="#3E8FB0" />
          <line x1="40" y1="130" x2="120" y2="130" stroke={LOR.ink} strokeWidth="8" /><text x="136" y="148" fontFamily={SERIF} fontWeight={900} fontSize="64" fill="#2C6F8C">{coldTemp}</text>
          <line x1="40" y1="-250" x2="120" y2="-250" stroke={LOR.ink} strokeWidth="8" opacity={hot} /><text x="136" y="-232" fontFamily={SERIF} fontWeight={900} fontSize="64" fill={LOR.gingham} opacity={hot}>{hotTemp}</text>
        </g>
      </svg>
      {coldNote ? <div style={{ position: "absolute", right: 80, top: 640, width: 560, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#2C6F8C", lineHeight: 1.0, opacity: interpolate(f, [60, 84], [0, 1], cl) }}>{coldNote}</div> : null}
      {hotNote ? <div style={{ position: "absolute", right: 80, top: 190, width: 560, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: LOR.gingham, lineHeight: 1.0, opacity: hot }}>{hotNote}</div> : null}
    </AbsoluteFill>
  );
};
