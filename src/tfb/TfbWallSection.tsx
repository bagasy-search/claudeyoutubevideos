// TfbWallSection — corte "rayos X" animado de la pared: por qué una pintura mineral no se descascara y una
// plástica sí. Izquierda: repello con poros; la cal entra en los poros, llegan partículas de CO₂ del aire y la
// capa se vuelve piedra (cristaliza). Derecha: película plástica sobre el repello; entra humedad por detrás, se
// ampolla y se levanta. Rótulos por props (sin texto quemado).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, TEXT_SHADOW, clamp, ease, inOut } from "./theme";

const pores = Array.from({ length: 11 }, (_, i) => ({ x: 40 + i * 62 + ((i * 17) % 23), d: 70 + ((i * 41) % 60), w: 14 + ((i * 7) % 10) }));
export const TfbWallSection: React.FC<{ dur: number; leftTitle: string; rightTitle: string; leftTag?: string; rightTag?: string; airLabel?: string }> = ({ dur, leftTitle, rightTitle, leftTag, rightTag, airLabel }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 12, 12);
  const sc = Math.min(1, (dur - 12) / 150), T = (x: number) => x * sc; // la animación se ajusta al largo del plano
  const pen = interpolate(f, [T(15), T(70)], [0, 1], { ...clamp, easing: ease });      // la cal entra en los poros
  const co2 = interpolate(f, [T(55), T(130)], [0, 1], clamp);                           // aire que llega
  const stone = interpolate(f, [T(90), T(150)], [0, 1], { ...clamp, easing: ease });   // cristaliza
  const blister = interpolate(f, [T(40), T(140)], [0, 1], { ...clamp, easing: ease }); // plástica se ampolla
  const Panel = (side: "L" | "R") => {
    const W = 780, H = 520;
    const plaster = <>
      <rect x={0} y={200} width={W} height={H - 200} fill="#8d8a84" />
      {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={(i * 97) % W} cy={215 + ((i * 61) % (H - 225))} r={2 + (i % 4)} fill={i % 3 ? "#7a7771" : "#a3a09a"} />)}
      {pores.map((p, i) => <path key={"p" + i} d={`M ${p.x} 200 q ${p.w / 2} ${p.d * 0.5} ${p.w * 0.2} ${p.d} l ${p.w * 0.6} 0 q ${-p.w * 0.1} ${-p.d * 0.5} ${p.w * 0.6} ${-p.d} Z`} fill="#4f4c48" />)}
    </>;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
        <rect width={W} height={200} fill="#cfe6f3" />
        {plaster}
        {side === "L" ? (<>
          {pores.map((p, i) => <path key={"l" + i} d={`M ${p.x} 200 q ${p.w / 2} ${p.d * 0.5 * pen} ${p.w * 0.2} ${p.d * pen} l ${p.w * 0.6} 0 q ${-p.w * 0.1} ${-p.d * 0.5 * pen} ${p.w * 0.6} ${-p.d * pen} Z`}
            fill={stone > 0.5 ? "#f4f1ea" : "#f7f7f5"} opacity={0.95} />)}
          <rect x={0} y={186} width={W} height={16} fill="#fbfaf7" />
          {Array.from({ length: 16 }, (_, i) => { const t = (co2 * 1.6 - (i % 8) * 0.1); const y = interpolate(t, [0, 1], [20, 186], clamp);
            return <g key={"c" + i} opacity={t > 0 && t < 1 ? 1 : 0}><circle cx={30 + i * 48} cy={y} r={9} fill="#2d6f9c" /><circle cx={30 + i * 48 - 15} cy={y} r={7} fill="#7fb6da" /><circle cx={30 + i * 48 + 15} cy={y} r={7} fill="#7fb6da" /></g>; })}
          {Array.from({ length: 40 }, (_, i) => <path key={"s" + i} d={`M ${(i * 71) % W} ${190 + ((i * 29) % 10)} l 7 -6 l 7 6 l -7 6 Z`} fill="#d9d2c3" opacity={stone} />)}
        </>) : (<>
          {Array.from({ length: 9 }, (_, i) => { const x = i * 90 + 20, b = blister * (i % 3 === 1 ? 1 : 0.35);
            return <path key={"b" + i} d={`M ${x} 188 Q ${x + 45} ${188 - 70 * b} ${x + 90} 188`} fill={b > 0.5 ? "rgba(90,150,200,0.35)" : "none"} stroke="#f2efe6" strokeWidth={12} />; })}
          {Array.from({ length: 12 }, (_, i) => { const t = (blister * 1.5 - (i % 6) * 0.12); const y = interpolate(t, [0, 1], [H - 10, 205], clamp);
            return <circle key={"w" + i} cx={60 + i * 60} cy={y} r={7} fill={C.water} opacity={t > 0 && t < 1 ? 0.9 : 0} />; })}
        </>)}
      </svg>
    );
  };
  const tag = (t: string | undefined, color: string, d: number) => t ? (
    <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 34, color: C.ink, background: color, padding: "8px 18px", borderRadius: 10, marginTop: 14,
      opacity: interpolate(f, [d, d + 10], [0, 1], clamp), transform: `scale(${interpolate(f, [d, d + 10], [0.7, 1], { ...clamp, easing: ease })})`, textTransform: "uppercase" }}>{t}</div>) : null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse at center, rgba(20,20,20,0.9), rgba(5,5,5,0.97))", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 60, transform: `scale(${0.94 + 0.06 * o})` }}>
        {(["L", "R"] as const).map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 64, color: s === "L" ? C.yellow : C.white, textShadow: TEXT_SHADOW, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>{s === "L" ? leftTitle : rightTitle}</div>
            <div style={{ position: "relative" }}>
              {Panel(s)}
              {s === "L" && airLabel && <div style={{ position: "absolute", top: 18, left: 24, fontFamily: F_UI, fontWeight: 800, fontSize: 30, color: "#2d6f9c", opacity: interpolate(f, [T(55), T(70)], [0, 1], clamp) * (1 - stone * 0.7) }}>{airLabel}</div>}
            </div>
            {s === "L" ? tag(leftTag, C.yellow, T(110)) : tag(rightTag, "#ff6b5e", T(100))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
