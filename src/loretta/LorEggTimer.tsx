// LorEggTimer — el reloj del huevo: una olla (tapa puesta, fuego apagado) cuenta 13:00 y un bol con hielo cuenta 15:00.
// Cuenta regresiva acelerada pero legible, anillo de progreso, burbujas / cubitos animados. Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LOR, SERIF, HAND, gingham, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export type TimerStep = { kind: "pot" | "ice"; minutes: number; label: string; sub?: string };

const Pot: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <ellipse cx="0" cy="170" rx="210" ry="26" fill="rgba(59,42,30,0.2)" />
    <rect x="-190" y="-40" width="380" height="210" rx="22" fill="#B9BEC4" stroke="#8C9298" strokeWidth="6" />
    <rect x="-176" y="-30" width="352" height="190" rx="16" fill="#CDD2D7" />
    <ellipse cx="0" cy="-48" rx="200" ry="26" fill="#9EA4AA" stroke="#7C8289" strokeWidth="6" />
    <ellipse cx="0" cy="-58" rx="176" ry="18" fill="#8C9298" />
    <circle cx="0" cy="-92" r="16" fill="#3B2A1E" />
    <rect x="-230" y="40" width="46" height="18" rx="8" fill="#3B2A1E" /><rect x="184" y="40" width="46" height="18" rx="8" fill="#3B2A1E" />
    {[0, 1, 2, 3].map((i) => { const t = ((f * 0.03 + i * 0.25) % 1); return <circle key={i} cx={-60 + i * 40} cy={-130 - t * 120} r={10 + 8 * t} fill="rgba(255,255,255,0.65)" opacity={1 - t} />; })}
  </g>
);
const Ice: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <ellipse cx="0" cy="170" rx="230" ry="26" fill="rgba(59,42,30,0.2)" />
    <path d="M-230,-30 L230,-30 L190,160 L-190,160 Z" fill="#DCEBF1" stroke="#9DB6C0" strokeWidth="6" />
    <path d="M-222,0 L222,0 L186,152 L-186,152 Z" fill="#B7DCEA" opacity="0.8" />
    {Array.from({ length: 9 }, (_, i) => { const x = -150 + (i % 5) * 75 + (i > 4 ? 36 : 0), y = -22 + Math.floor(i / 5) * 46 + Math.sin(f * 0.06 + i) * 5; return <rect key={i} x={x} y={y} width="58" height="52" rx="9" fill="#F4FBFF" stroke="#BFD8E2" strokeWidth="4" transform={`rotate(${(rnd(i + 3) - 0.5) * 24} ${x + 29} ${y + 26})`} />; })}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={-60 + i * 60} cy={-70 - Math.sin(f * 0.05 + i) * 6} rx="26" ry="38" fill="#FFFBF0" stroke="#E6D9BA" strokeWidth="4" />)}
  </g>
);

export const LorEggTimer: React.FC<{ steps: TimerStep[]; stepFrames?: number }> = ({ steps, stepFrames = 90 }) => {
  const f = useCurrentFrame();
  const idx = Math.min(steps.length - 1, Math.floor(f / stepFrames));
  const s = steps[idx], lf = f - idx * stepFrames;
  const p = interpolate(lf, [8, stepFrames - 10], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const left = Math.max(0, Math.round(s.minutes * 60 * (1 - p)));
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  const inn = interpolate(lf, [0, 14], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const C = 2 * Math.PI * 250;
  const col = s.kind === "pot" ? LOR.gingham : "#3E8FB0";
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      <svg viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(-470 20)" opacity={inn}>
          <circle r="260" fill="#FFFDF7" stroke="rgba(59,42,30,0.25)" strokeWidth="6" />
          <circle r="250" fill="none" stroke="#EFE3C8" strokeWidth="26" />
          <circle r="250" fill="none" stroke={col} strokeWidth="26" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * p} transform="rotate(-90)" />
          <text y="30" textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize="170" fill={LOR.ink}>{mm}:{ss}</text>
          <text y="108" textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize="58" fill={col}>{s.sub || ""}</text>
        </g>
        <g transform="translate(430 70) scale(1.15)" opacity={inn}>{s.kind === "pot" ? <Pot f={f} /> : <Ice f={f} />}</g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: LOR.ink, opacity: inn }}>{s.label}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", gap: 18, opacity: inn }}>
        {steps.map((_, i) => <div key={i} style={{ width: i === idx ? 56 : 18, height: 18, borderRadius: 9, background: i === idx ? col : "rgba(59,42,30,0.25)" }} />)}
      </div>
    </AbsoluteFill>
  );
};
