// TfbCureCalendar — el CURADO húmedo como tira de días: cada casillero cae, recibe su lluvia de gotas y queda
// "mojado" (azul) mientras una barra de FUERZA sube. Si `dryAt` se define, desde ese día el cemento se seca (naranja)
// y la barra se frena: la idea de "si se seca antes, deja de ganar fuerza". Sin cifras inventadas: los rótulos van
// por props (p. ej. "DÍA 1", "DÍA 2", "…").
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, easeOut, outro, pop } from "./theme";

export const TfbCureCalendar: React.FC<{ dur: number; days: string[]; title?: string; every?: number; dryAt?: number; meter?: string }> = ({ dur, days, title, every = 12, dryAt, meter = "FUERZA" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 8) * interpolate(f, [0, 8], [0, 1], clamp);
  const n = days.length, CW = 250, GAP = 34, X0 = (1920 - (n * CW + (n - 1) * GAP)) / 2, Y0 = 400;
  const rnd = (i: number, s: number) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
  const fillTo = (i: number) => (dryAt != null && i >= dryAt ? 0 : 1);
  const lastWet = dryAt ?? n;
  const strength = interpolate(f, [10, 10 + every * lastWet], [0.08, dryAt != null ? 0.45 : 0.92], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(10,10,10,0.6), rgba(0,0,0,0.86))" }} />
      {title && <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 86, color: TFB.white, textTransform: "uppercase", textShadow: "0 6px 0 rgba(0,0,0,0.45)" }}>{title}</div>}
      {days.map((d, i) => {
        const a = 8 + i * every, p = pop(f, fps, a, 12, 0.6), wet = fillTo(i), dry = 1 - wet;
        const rain = interpolate(f, [a + 4, a + 22], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (CW + GAP), top: Y0, width: CW, height: 290, transform: `translateY(${(1 - p) * -80}px)`, opacity: p }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: dry ? "#c98a3a" : `rgba(70,140,220,${0.35 + 0.45 * rain})`, border: `5px solid ${dry ? TFB.red : TFB.white}`, boxShadow: "0 10px 0 rgba(0,0,0,0.35)", overflow: "hidden" }}>
              {!dry && Array.from({ length: 14 }).map((_, k) => { const ph = (f * 3 + rnd(k, i) * 230) % 290;
                return <div key={k} style={{ position: "absolute", left: 12 + rnd(k, i + 7) * (CW - 30), top: ph - 20, width: 7, height: 16, borderRadius: 6, background: "rgba(220,240,255,0.9)", opacity: rain * (ph < 260 ? 1 : 0) }} />; })}
              {dry > 0 && Array.from({ length: 5 }).map((_, k) => <div key={k} style={{ position: "absolute", left: 20 + k * 32, top: 40 + rnd(k, 3) * 120, width: 60, height: 3, background: "#6b3d12", transform: `rotate(${rnd(k, 9) * 80 - 40}deg)` }} />)}
            </div>
            <div style={{ position: "absolute", bottom: -64, width: "100%", textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 40, color: TFB.white, textShadow: "0 3px 8px rgba(0,0,0,0.8)" }}>{d}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X0, width: n * CW + (n - 1) * GAP, top: Y0 + 350 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: TFB.yellow, letterSpacing: 3, marginBottom: 10 }}>{meter}</div>
        <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.18)", overflow: "hidden", border: "3px solid rgba(255,255,255,0.5)" }}>
          <div style={{ width: `${strength * 100}%`, height: "100%", background: dryAt != null && f > 10 + every * dryAt ? TFB.red : TFB.yellow }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
