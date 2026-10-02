// LorStepCount — la tarjeta de capítulo "Step 3 of 8": un cartón de huevos de 8 copitas que se va llenando (un huevo por
// paso ya hecho, el del paso actual cae y rebota), nombre del paso en serif grande y una línea manuscrita. Whip-pan de entrada.
// Reusable por el canal (cualquier receta por pasos). Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, gingham } from "./LorTheme";

export const LorStepCount: React.FC<{ n: number; total?: number; name: string; sub?: string; word?: string; color?: string }> = ({ n, total = 8, name, sub, word = "STEP", color = LOR.butter }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const whip = interpolate(f, [0, 9], [1, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
  const cols = Math.ceil(total / 2);
  const cups = Array.from({ length: total }).map((_, i) => {
    const r = Math.floor(i / cols), c = i % cols; const cx = 52 + c * 74, cy = 52 + r * 84;
    const on = i < n - 1 ? 1 : i === n - 1 ? interpolate(f, [12, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.4, 0.4, 1) }) : 0;
    return (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="31" ry="34" fill="#A99472" stroke="#85714F" strokeWidth="3" />
        <ellipse cx={cx} cy={cy + 3} rx="25" ry="27" fill="#B9A482" />
        {on > 0 ? <g transform={`translate(${cx} ${cy - (1 - on) * 50}) scale(${Math.max(0.01, on)})`} opacity={on}><ellipse rx="22" ry="27" fill={i === n - 1 ? color : "#FFFBF0"} stroke="#D9C79C" strokeWidth="3" /></g> : null}
      </g>
    );
  });
  const tIn = interpolate(f, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const sIn = interpolate(f, [18, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = f / fps;
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 64, 0.22), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.92) 0%, rgba(246,238,220,0.75) 55%, rgba(246,238,220,0.35) 100%)" }} />
      <AbsoluteFill style={{ translate: `${whip * 1400}px 0px`, filter: `blur(${whip * 18}px)`, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70 }}>
        <svg width={cols * 74 + 60} height={230} viewBox={`0 0 ${cols * 74 + 60} 230`} style={{ rotate: `${Math.sin(drift) * 1.5}deg` }}>
          <rect x="6" y="6" width={cols * 74 + 48} height="176" rx="22" fill="#C9B494" stroke="#9C8767" strokeWidth="5" />
          {cups}
        </svg>
        <div style={{ maxWidth: 1000 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: LOR.gingham, letterSpacing: 4, opacity: tIn }}>{word} {n} OF {total}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 132, color: LOR.ink, lineHeight: 0.98, opacity: tIn, translate: `0px ${(1 - tIn) * 30}px` }}>{name}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LOR.greenDeep, marginTop: 12, clipPath: `inset(0 ${100 - sIn}% 0 0)` }}>{sub}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
