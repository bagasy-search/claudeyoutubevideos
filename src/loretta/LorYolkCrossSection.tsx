// LorYolkCrossSection — el huevo duro cortado al medio, dibujado en SVG: clara + yema; si "overcooked", el anillo
// gris-verdoso crece alrededor de la yema y se rotulan sus causas con textos a mano. Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LOR, SERIF, HAND, gingham, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const eggPath = "M0,-300 C150,-300 215,-110 215,40 C215,190 120,300 0,300 C-120,300 -215,190 -215,40 C-215,-110 -150,-300 0,-300 Z";

export const LorYolkCrossSection: React.FC<{ stage?: "overcooked" | "perfect"; title?: string; sub?: string; callouts?: { at: number; text: string; x: number; y: number; color?: string }[] }> = ({ stage = "overcooked", title, sub, callouts = [] }) => {
  const f = useCurrentFrame();
  const intro = interpolate(f, [0, 20], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const ringP = stage === "overcooked" ? interpolate(f, [26, 70], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) }) : 0;
  const speck = Array.from({ length: 46 }, (_, i) => ({ x: (rnd(i * 3 + 1) - 0.5) * 150, y: (rnd(i * 3 + 2) - 0.5) * 130, r: 1.5 + rnd(i * 3 + 3) * 3 }));
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: LOR.ink, opacity: intro }}>{title}</div> : null}
      {sub ? <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LOR.gingham, opacity: intro }}>{sub}</div> : null}
      <svg viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform={`translate(0 40) scale(${0.9 + 0.1 * intro})`} opacity={intro}>
          <path d={eggPath} transform="translate(8 14)" fill="rgba(59,42,30,0.18)" />
          <path d={eggPath} fill="#FFFBF0" stroke="#E6D9BA" strokeWidth="6" />
          <path d={eggPath} transform="scale(0.93)" fill="none" stroke="#F1E8CF" strokeWidth="3" />
          {ringP > 0 ? <ellipse cx="0" cy="40" rx={128 + 18 * ringP} ry={118 + 16 * ringP} fill="#8A9A5E" opacity={0.9 * ringP} /> : null}
          <ellipse cx="0" cy="40" rx="118" ry="108" fill={stage === "overcooked" ? "#E9C968" : "#F2AE22"} />
          <ellipse cx="-28" cy="12" rx="62" ry="52" fill={stage === "overcooked" ? "#F1D98B" : "#FFCE55"} opacity="0.75" />
          {stage === "overcooked" ? speck.map((s, i) => <circle key={i} cx={s.x} cy={40 + s.y} r={s.r} fill={i % 2 ? "#D5B04A" : "#F7E7A8"} opacity="0.8" />) : null}
        </g>
      </svg>
      {callouts.map((c, i) => {
        const o = interpolate(f, [c.at, c.at + 12], [0, 1], cl);
        return (
          <div key={i} style={{ position: "absolute", left: `${c.x * 100}%`, top: `${c.y * 100}%`, opacity: o, translate: `0 ${(1 - o) * 24}px`, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: c.color || LOR.gingham, lineHeight: 1.0, textAlign: "center", textShadow: "0 2px 0 rgba(255,253,247,0.9)", maxWidth: 560 }}>{c.text}</div>
        );
      })}
    </AbsoluteFill>
  );
};
