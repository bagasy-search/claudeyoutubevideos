// TfbTitleSlam — el golpe tipográfico de las miniaturas del canal: líneas en Anton que caen con resorte, una por una,
// con resaltado amarillo, caja roja o blanco con contorno. ≤ 12 palabras en total. Sin texto quemado: todo por props.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, TFB, clamp, outro, pop, strokeText } from "./theme";

export type SlamLine = { t: string; style?: "white" | "yellow" | "redbox" | "yellowbox"; size?: number };
export const TfbTitleSlam: React.FC<{
  lines: SlamLine[]; dur: number; x?: number; y?: number; align?: "left" | "center" | "right"; stagger?: number; tilt?: number; scrim?: boolean;
}> = ({ lines, dur, x = 50, y = 50, align = "center", stagger = 5, tilt = -2, scrim = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 7);
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0%";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {scrim && <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,${0.42 * o}) 0%, rgba(0,0,0,0) 60%)` }} />}
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(${tx},-50%) rotate(${tilt}deg)`, display: "flex", flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", gap: 10, opacity: o }}>
        {lines.map((l, i) => {
          const p = pop(f, fps, i * stagger, 11, 0.6);
          const sc = interpolate(p, [0, 1], [1.9, 1]);
          const op = interpolate(p, [0, 0.25], [0, 1], clamp);
          const size = l.size ?? 118;
          const st = l.style ?? "white";
          const box = st === "redbox" || st === "yellowbox";
          return (
            <div key={i} style={{ transform: `scale(${sc})`, opacity: op, transformOrigin: "50% 60%" }}>
              <span style={{
                fontFamily: ANTON, fontSize: size, lineHeight: 1.02, letterSpacing: 1, textTransform: "uppercase",
                color: st === "yellow" ? TFB.yellow : st === "yellowbox" ? TFB.ink : TFB.white,
                ...(box ? { background: st === "redbox" ? TFB.red : TFB.yellow, padding: "4px 26px 8px", borderRadius: 14, display: "inline-block",
                  boxShadow: "0 10px 0 rgba(0,0,0,0.35)" } : strokeText(Math.round(size / 16))),
              }}>{l.t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
