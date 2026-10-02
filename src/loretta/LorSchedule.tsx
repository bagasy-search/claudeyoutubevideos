// LorSchedule — el almanaque de la iglesia: hojas de calendario (Thursday / Friday / Saturday...) que caen una a una
// con sus tareas escritas a mano. Reusable por el canal para cualquier "cronograma de la receta". Textos por props.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, gingham, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const LorSchedule: React.FC<{ title?: string; days: { day: string; sub?: string; items: string[]; mark?: boolean }[]; perDay?: number }> = ({ title, days, perDay = 40 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 14], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.18) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.96) 0%, rgba(246,238,220,0.86) 70%, rgba(246,238,220,0.6) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 58, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: LOR.ink, opacity: inn }}>{title}</div> : null}
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 46, paddingTop: 90 }}>
        {days.map((d, i) => {
          const t0 = 16 + i * perDay; const s = spring({ frame: f - t0, fps, config: { damping: 12, stiffness: 140 } });
          const rot = (rnd(i + 11) - 0.5) * 5;
          const n = d.items.length;
          return (
            <div key={i} style={{ width: 520, minHeight: 640, background: LOR.white, borderRadius: 18, boxShadow: `0 26px 60px ${LOR.shadow}`, overflow: "hidden", opacity: Math.min(1, s * 1.4), translate: `0 ${(1 - s) * -260}px`, rotate: `${rot * s}deg`, transformOrigin: "50% 0%" }}>
              <div style={{ background: d.mark ? LOR.gingham : LOR.green, padding: "18px 28px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.white }}>{d.day}</div>
                {d.sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.butterSoft }}>{d.sub}</div> : null}
              </div>
              <div style={{ padding: "26px 30px" }}>
                {d.items.map((it, k) => {
                  const o = interpolate(f, [t0 + 12 + k * 10, t0 + 22 + k * 10], [0, 1], cl);
                  const w = interpolate(f, [t0 + 12 + k * 10, t0 + 30 + k * 10], [0, 100], cl);
                  return <div key={k} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#1F2F5C", lineHeight: "62px", marginBottom: 14, opacity: o, clipPath: `inset(0 ${100 - w}% 0 0)` }}>{"✓"} {it}</div>;
                })}
                {n === 0 ? null : null}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
