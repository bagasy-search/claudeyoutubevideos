// LorPieCount — la tarjeta de capítulo "Pie #3 of 7": un pie que se completa por porciones (una porción por pie ya
// visto), el nombre del pie en serif grande y una línea manuscrita. Transición de entrada tipo whip-pan.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, gingham } from "./LorTheme";

export const LorPieCount: React.FC<{ n: number; total?: number; name: string; sub?: string; color?: string }> = ({ n, total = 7, name, sub, color = LOR.butter }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const whip = interpolate(f, [0, 9], [1, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
  const slices = Array.from({ length: total }).map((_, i) => {
    const a0 = (i / total) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2;
    const on = i < n - 1 ? 1 : i === n - 1 ? interpolate(f, [12, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.4, 0.4, 1) }) : 0;
    const r = 150, mid = (a0 + a1) / 2, off = (1 - on) * 60;
    const cx = 170 + Math.cos(mid) * off, cy = 170 + Math.sin(mid) * off;
    const d = `M${cx} ${cy} L${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r} Z`;
    return <path key={i} d={d} fill={i === n - 1 ? color : i < n - 1 ? "#E8B563" : "rgba(59,42,30,0.08)"} stroke={i <= n - 1 ? "#B87835" : "rgba(59,42,30,0.25)"} strokeWidth={i <= n - 1 ? 6 : 3} strokeDasharray={i > n - 1 ? "10 8" : undefined} opacity={i === n - 1 ? on : 1} />;
  });
  const tIn = interpolate(f, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const sIn = interpolate(f, [18, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = f / fps;
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 64, 0.22), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.92) 0%, rgba(246,238,220,0.75) 55%, rgba(246,238,220,0.35) 100%)" }} />
      <AbsoluteFill style={{ translate: `${whip * 1400}px 0px`, filter: `blur(${whip * 18}px)`, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70 }}>
        <svg width={340} height={340} viewBox="0 0 340 340" style={{ rotate: `${drift * 4}deg` }}>{slices}</svg>
        <div style={{ maxWidth: 1000 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: LOR.gingham, letterSpacing: 4, opacity: tIn }}>PIE #{n} OF {total}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 132, color: LOR.ink, lineHeight: 0.98, opacity: tIn, translate: `0px ${(1 - tIn) * 30}px` }}>{name}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LOR.greenDeep, marginTop: 12, clipPath: `inset(0 ${100 - sIn}% 0 0)` }}>{sub}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
