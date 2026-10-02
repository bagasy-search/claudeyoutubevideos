// LorSieve — el colador de malla con el dorso de una cuchara que aprieta las yemas: caen hebras finas como arena
// en el bol de abajo, que se llena. Set-piece 2D en SVG animado (PRNG determinista). Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LOR, SERIF, HAND, gingham, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const LorSieve: React.FC<{ title?: string; note?: string; smooth?: string; lumpy?: string }> = ({ title, note, smooth, lumpy }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 16], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const fill = interpolate(f, [24, 130], [0, 1], { ...cl, easing: Easing.out(Easing.quad) });
  const sx = Math.sin(f * 0.22) * 70; // la cuchara va y viene
  const strands = Array.from({ length: 70 }, (_, i) => {
    const x0 = (rnd(i * 5 + 1) - 0.5) * 300, ph = rnd(i * 5 + 2), sp = 2.2 + rnd(i * 5 + 3) * 2.2;
    const t = ((f * 0.034 * sp + ph) % 1);
    return { x: x0, y: 40 + t * 250, len: 18 + rnd(i * 5 + 4) * 26, o: f > 20 ? Math.min(1, t * 6) * (1 - Math.max(0, t - 0.82) * 5) : 0 };
  });
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: LOR.ink, opacity: inn }}>{title}</div> : null}
      <svg viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(0 -20)" opacity={inn}>
          <path d="M-250,150 L250,150 L200,330 L-200,330 Z" fill="#F1E8D0" stroke="#C9B48A" strokeWidth="6" />
          <clipPath id="bowlclip"><path d="M-244,156 L244,156 L196,324 L-196,324 Z" /></clipPath>
          <g clipPath="url(#bowlclip)"><path d={`M-260,${324 - 170 * fill} Q-120,${300 - 170 * fill} 0,${318 - 170 * fill} T260,${322 - 170 * fill} L260,340 L-260,340 Z`} fill="#F6C23E" /></g>
          {strands.map((s, i) => <line key={i} x1={s.x * 0.8} y1={s.y} x2={s.x * 0.8} y2={s.y + s.len} stroke={i % 3 ? "#F3B72E" : "#FFD66B"} strokeWidth="3.5" strokeLinecap="round" opacity={s.o} />)}
          <path d="M-210,-90 Q0,170 210,-90 Z" fill="rgba(210,214,220,0.55)" stroke="#8C9298" strokeWidth="8" />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-190 + i * 47},-80 Q${-190 + i * 47},60 ${(-190 + i * 47) * 0.1},120`} stroke="rgba(120,126,134,0.35)" strokeWidth="2" fill="none" />)}
          <rect x="-250" y="-100" width="500" height="16" rx="8" fill="#8C9298" /><path d="M210,-96 L420,-150" stroke="#8C9298" strokeWidth="18" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={-90 + i * 38 + (rnd(i) - 0.5) * 20} cy={-60 - (i % 2) * 14 + 30 * fill} rx="34" ry="24" fill="#F2AE22" opacity={1 - fill * 0.7} />)}
          <g transform={`translate(${sx} ${-10 + Math.cos(f * 0.22) * 10}) rotate(${sx * 0.12})`}>
            <ellipse cx="0" cy="-70" rx="74" ry="46" fill="#D9DEE3" stroke="#8C9298" strokeWidth="6" /><path d="M20,-100 L250,-250" stroke="#B9BEC4" strokeWidth="22" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      {note ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: LOR.gingham, opacity: interpolate(f, [50, 70], [0, 1], cl) }}>{note}</div> : null}
      {smooth ? <div style={{ position: "absolute", right: 90, top: 250, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LOR.greenDeep, opacity: interpolate(f, [70, 90], [0, 1], cl) }}>{smooth}</div> : null}
      {lumpy ? <div style={{ position: "absolute", left: 90, top: 250, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LOR.gingham, opacity: interpolate(f, [40, 60], [0, 1], cl) }}>{lumpy}</div> : null}
    </AbsoluteFill>
  );
};
