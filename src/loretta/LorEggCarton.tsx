// LorEggCarton — vista cenital de un cartón de huevos sin tapa: cada mitad de huevo relleno cae en su copita
// ("una cama para cada uno": no se deslizan, no se tocan). Contador y rótulo por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LOR, SERIF, HAND, gingham, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const LorEggCarton: React.FC<{ title?: string; note?: string; cups?: number; cartons?: number }> = ({ title, note, cups = 12, cartons = 1 }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 16], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const cols = cups / 2;
  const total = cups * cartons;
  const done = Math.min(total, Math.max(0, Math.floor((f - 18) / 4) + 1));
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: LOR.ink, opacity: inn }}>{title}</div> : null}
      <svg viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(0 40)" opacity={inn}>
          <rect x={-cols * 100 - 30} y="-170" width={cols * 200 + 60} height="380" rx="26" fill="#C9B494" stroke="#9C8767" strokeWidth="8" />
          {Array.from({ length: cups }, (_, i) => {
            const r = Math.floor(i / cols), c = i % cols; const cx = -cols * 100 + 100 + c * 200, cy = -70 + r * 190;
            const k = i; const t = interpolate(f, [18 + k * 4, 18 + k * 4 + 12], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) });
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx="82" ry="74" fill="#A99472" stroke="#85714F" strokeWidth="5" />
                <ellipse cx={cx} cy={cy + 6} rx="66" ry="58" fill="#B9A482" />
                <g transform={`translate(${cx} ${cy - (1 - t) * 260}) scale(${Math.max(0.001, t)}) rotate(${(rnd(i + 5) - 0.5) * 16})`} opacity={t}>
                  <ellipse rx="56" ry="68" fill="#FFFBF0" stroke="#E6D9BA" strokeWidth="4" />
                  <ellipse cx="0" cy="2" rx="36" ry="42" fill="#F6C23E" /><ellipse cx="-8" cy="-6" rx="20" ry="22" fill="#FFD966" opacity="0.8" />
                  {[0, 1, 2, 3, 4].map((d) => <circle key={d} cx={(rnd(i * 5 + d) - 0.5) * 50} cy={(rnd(i * 5 + d + 9) - 0.5) * 56} r="2.6" fill="#B8321E" />)}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", right: 90, bottom: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: LOR.ink, opacity: inn }}>{done}<span style={{ fontFamily: HAND, fontSize: 58, color: LOR.gingham }}> / {total}</span></div>
      {note ? <div style={{ position: "absolute", left: 90, bottom: 66, fontFamily: HAND, fontWeight: 700, fontSize: 66, color: LOR.greenDeep, opacity: interpolate(f, [50, 72], [0, 1], cl) }}>{note}</div> : null}
    </AbsoluteFill>
  );
};
