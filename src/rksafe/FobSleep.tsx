// FobSleep.tsx — LA LLAVE SE VA A DORMIR (rktoyota, oct-2026).
//
// Sobre la foto real de la llave en la mano (`bg`, punto `at` = la llave): primero ondas de radio salen
// de la llave (la llave "habla"); se encienden los pasos (HOLD LOCK → UNLOCK ×2 con dos toques), la luz
// de la llave parpadea 4 veces con contador, y las ondas se apagan: sello ASLEEP. Todo dentro de la escena.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01, rgba } from "./RayStage";
import { WorldBed, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const FobSleep: React.FC<{
  bg?: string;
  at?: [number, number];
  kicker?: string;
  steps?: string[];
  stamp?: string;
  durationInFrames?: number;
}> = ({ bg, at = [50, 50], kicker = "", steps = ["Hold LOCK", "Press UNLOCK twice", "4 blinks"], stamp = "ASLEEP", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seq);
  const t = frame / D;
  const ax = at[0] * 19.2, ay = at[1] * 10.8;
  const talk = 1 - clamp01((t - 0.7) / 0.1); // las ondas se apagan cuando duerme
  const s1 = clamp01((t - 0.12) / 0.06), s2 = clamp01((t - 0.3) / 0.06), s3 = clamp01((t - 0.5) / 0.06);
  const taps = [0.34, 0.42].map((x) => clamp01((t - x) / 0.07));
  // 4 parpadeos entre 0.5 y 0.7
  const bl = t >= 0.5 && t < 0.7 ? Math.floor((t - 0.5) / 0.05) : t >= 0.7 ? 4 : 0;
  const on = t >= 0.5 && t < 0.7 && ((t - 0.5) % 0.05) < 0.025;
  const st = clamp01((t - 0.74) / 0.1);
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.14} fx={at[0]} fy={at[1]} dim={0.18} durationInFrames={D} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {[0, 1, 2, 3].map((k) => {
          const q = (frame / 40 + k / 4) % 1;
          return <circle key={k} cx={ax} cy={ay} r={60 + q * 520} fill="none" stroke={rgba(V.dangerSoft, (1 - q) * 0.7 * talk)} strokeWidth={4} strokeDasharray="18 14" />;
        })}
        {taps.map((p, i) => p > 0 && p < 1 ? <circle key={i} cx={ax} cy={ay} r={30 + p * 90} fill="none" stroke={rgba(V.brassSoft, 1 - p)} strokeWidth={6} /> : null)}
        <circle cx={ax} cy={ay} r={on ? 26 : 12} fill={on ? V.dangerSoft : rgba(V.dangerSoft, 0.25)} />
      </svg>
      {bl > 0 ? (
        <div style={{ position: "absolute", left: ax + 70, top: ay - 120, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 4px 20px rgba(0,0,0,.9)" }}>
          {bl}/4 <span style={{ fontSize: 32, color: V.brassSoft }}>blinks</span>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", gap: 22 }}>
        {steps.map((s, i) => {
          const a = [s1, s2, s3][i] ?? 0;
          return (
            <div key={i} style={{ opacity: 0.3 + 0.7 * a, transform: `scale(${0.92 + 0.08 * a})`, display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 40, background: "rgba(10,10,12,.75)", border: `3px solid ${a > 0.5 ? V.brassSoft : "rgba(255,255,255,.25)"}` }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: V.brassSoft }}>{i + 1}</div>
              <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 34, color: V.white }}>{s}</div>
            </div>
          );
        })}
      </div>
      <Tag kicker={kicker} a={interpolate(t, [0, 0.07], [0, 1], ease)} />
      {stamp ? <Stamp text={stamp} color={V.ok} p={st} x={50} y={30} size={110} rot={-7} /> : null}
    </AbsoluteFill>
  );
};
