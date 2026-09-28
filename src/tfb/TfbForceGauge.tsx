// TfbForceGauge — medidor de CARGA cualitativo (sin kg inventados): una columna que sube a tirones con la carga,
// tiembla al acercarse al límite y, en el cuadro de rotura, destella con una grieta y un cartel de resultado.
// `breakAt` = cuadro local de la rotura (o null si no se rompe). Marcas de texto, no números.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, jitter, outro, pop } from "./theme";

export const TfbForceGauge: React.FC<{
  dur: number; breakAt?: number | null; label?: string; result?: string; side?: "left" | "right"; marks?: string[]; riseFrames?: number;
}> = ({ dur, breakAt = null, label = "CARGA", result, side = "right", marks = ["POCA", "MUCHA", "LÍMITE"], riseFrames }) => {
  const f = useCurrentFrame(); const { fps, height: H } = useVideoConfig();
  const o = outro(f, dur, 10), inn = pop(f, fps, 0, 14, 0.8);
  const rise = riseFrames ?? (breakAt ?? dur) - 4;
  // sube a escalones (cada pesa que se suma) con un leve rebote
  const steps = 5; const raw = interpolate(f, [6, rise], [0, 1], clamp);
  const stepped = Math.floor(raw * steps) / steps + (raw * steps % 1) ** 3 / steps;
  const broke = breakAt != null && f >= breakAt;
  const level = broke ? interpolate(f, [breakAt!, breakAt! + 10], [0.97, 0.05], clamp) : Math.min(0.97, stepped);
  const nearing = !broke && level > 0.7;
  const sh = nearing ? jitter(f, 3, 4 * (level - 0.7) / 0.3) : 0;
  const GH = 560, GW = 70, top = H / 2 - GH / 2;
  const flash = broke ? interpolate(f, [breakAt!, breakAt! + 6], [1, 0], clamp) : 0;
  const col = level > 0.8 ? TFB.red : level > 0.5 ? TFB.yellow : TFB.green;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", top, [side]: 110, transform: `translate(${sh}px,0) scale(${interpolate(inn, [0, 1], [0.6, 1])})`, opacity: inn,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14 } as React.CSSProperties}>
        <div style={{ fontFamily: ANTON, fontSize: 48, color: TFB.white, textShadow: "0 4px 0 rgba(0,0,0,0.6)", letterSpacing: 2 }}>{label}</div>
        <div style={{ position: "relative", width: GW, height: GH, borderRadius: GW / 2, background: "rgba(10,10,10,0.72)", border: `6px solid ${TFB.white}`,
          overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${level * 100}%`, background: `linear-gradient(0deg, ${TFB.green} 0%, ${TFB.yellow} 55%, ${TFB.red} 100%)`,
            backgroundSize: `100% ${GH}px`, backgroundPosition: "bottom" }} />
          {[0.25, 0.5, 0.75].map((m) => <div key={m} style={{ position: "absolute", bottom: `${m * 100}%`, left: 0, width: "40%", height: 4, background: "rgba(255,255,255,0.7)" }} />)}
        </div>
        <div style={{ position: "absolute", top: 64, [side === "right" ? "right" : "left"]: GW + 30, height: GH, display: "flex", flexDirection: "column-reverse", justifyContent: "space-between",
          padding: "40px 0" } as React.CSSProperties}>
          {marks.map((m, i) => <div key={i} style={{ fontFamily: INTER, fontWeight: 900, fontSize: 24, color: i === marks.length - 1 ? TFB.red : "rgba(255,255,255,0.85)", letterSpacing: 2,
            textShadow: "0 2px 6px rgba(0,0,0,0.9)", textAlign: side === "right" ? "right" : "left" }}>{m}</div>)}
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: col, boxShadow: `0 0 ${20 + 30 * level}px ${col}` }} />
      </div>
      {broke && (
        <>
          <AbsoluteFill style={{ background: `rgba(255,255,255,${0.55 * flash})` }} />
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
            <path d="M960,120 L930,300 L990,420 L940,560 L1000,700 L950,900" fill="none" stroke={TFB.white} strokeWidth={10 * flash} strokeLinejoin="round" />
          </svg>
          {result && (() => { const p = pop(f, fps, breakAt! + 4, 10, 0.6); return (
            <div style={{ position: "absolute", left: "50%", top: "16%", transform: `translateX(-50%) rotate(-3deg) scale(${interpolate(p, [0, 1], [2, 1])})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
              background: TFB.red, color: TFB.white, fontFamily: ANTON, fontSize: 92, padding: "6px 34px 12px", borderRadius: 16, boxShadow: "0 12px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>{result}</div>); })()}
        </>
      )}
    </AbsoluteFill>
  );
};
