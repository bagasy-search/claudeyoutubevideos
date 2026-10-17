import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame, Easing } from "remotion";
import { sf, FPS, FONT, ACC, RED } from "./common";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

// Foto con Ken Burns: el movimiento cambia según una semilla para que no sea un metrónomo
export const Photo: React.FC<{ src: string; dur: number; seed: number; credit?: string; fit?: "cover" | "contain"; shift?: number }> = ({ src, dur, seed, credit, fit, shift = 0 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, dur * FPS], [0, 1], cl);
  const mode = seed % 4;
  const s0 = mode === 1 ? 1.16 : 1.04, s1 = mode === 1 ? 1.04 : 1.16;
  const dx = [0, 0, -40, 40][mode] * (seed % 3 === 0 ? -1 : 1);
  const dy = [-18, 14, 0, 0][mode];
  const s = s0 + (s1 - s0) * k;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {fit === "contain" && <Img src={sf(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(0.45)", transform: "scale(1.1)" }} />}
      <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: fit || "cover", transform: `translateX(${shift}px) scale(${s}) translate(${dx * k}px, ${dy * k}px)` }} />
      {credit && <div style={{ position: "absolute", right: 22, bottom: 16, color: "rgba(255,255,255,0.75)", fontFamily: FONT, fontWeight: 600, fontSize: 18, textShadow: "0 1px 4px #000" }}>{credit}</div>}
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; dur: number; seed: number; rate?: number }> = ({ src, dur, seed, rate = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * FPS], [1.02, 1.08], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={sf(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};

// Cifra grande con rótulo: aparece, se queda, se va
export const Callout: React.FC<{ big: string; sub?: string; dur: number; pos?: "bl" | "br" | "c" | "tl" | "tr"; color?: string; count?: [number, number, (n: number) => string] }> = ({ big, sub, dur, pos = "bl", color = ACC, count }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const o = interpolate(t, [0, 0.35, dur - 0.35, dur], [0, 1, 1, 0], cl);
  const y = interpolate(t, [0, 0.45], [30, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const n = count ? count[2](count[0] + (count[1] - count[0]) * ease(Math.min(1, t / Math.min(1.6, dur * 0.6)))) : big;
  const P: any = { bl: { left: 90, bottom: 90 }, br: { right: 90, bottom: 90, textAlign: "right" }, c: { left: 0, right: 0, top: 330, textAlign: "center" }, tl: { left: 90, top: 80 }, tr: { right: 90, top: 80, textAlign: "right" } }[pos];
  return (
    <div style={{ position: "absolute", ...P, opacity: o, transform: `translateY(${y}px)`, fontFamily: FONT }}>
      <div style={{ fontSize: pos === "c" ? 190 : 140, fontWeight: 900, color, lineHeight: 1, letterSpacing: -2, textShadow: "0 6px 30px rgba(0,0,0,0.85), 0 0 2px #000" }}>{n}</div>
      {sub && <div style={{ fontSize: pos === "c" ? 54 : 46, fontWeight: 800, color: "#fff", marginTop: 10, textShadow: "0 3px 16px rgba(0,0,0,0.95)", textTransform: "uppercase", letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};

export const Chapter: React.FC<{ n: string; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const o = interpolate(t, [0, 0.4, dur - 0.4, dur], [0, 1, 1, 0], cl);
  const w = interpolate(t, [0.2, 1.0], [0, 1], { ...cl, easing: ease });
  return (
    <div style={{ position: "absolute", left: 90, top: 80, opacity: o, fontFamily: FONT }}>
      <div style={{ color: ACC, fontWeight: 900, fontSize: 34, letterSpacing: 6 }}>{n}</div>
      <div style={{ color: "#fff", fontWeight: 900, fontSize: 64, textTransform: "uppercase", textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>{title}</div>
      <div style={{ height: 6, width: 520 * w, background: ACC, marginTop: 8 }} />
    </div>
  );
};

// Barras comparativas horizontales
export const Bars: React.FC<{ title: string; rows: { label: string; v: number; txt: string; color?: string }[]; dur: number; max?: number; lines?: { v: number; label: string; color?: string }[] }> = ({ title, rows, dur, max, lines = [] }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const o = interpolate(t, [0, 0.4, dur - 0.4, dur], [0, 1, 1, 0], cl);
  const M = max || Math.max(...rows.map((r) => r.v), ...lines.map((l) => l.v)) * 1.1;
  const W = 1100;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.25) 100%)" }}>
      <div style={{ position: "absolute", left: 120, top: 150, color: "#fff", fontWeight: 900, fontSize: 56, textTransform: "uppercase", letterSpacing: 2 }}>{title}</div>
      <div style={{ position: "absolute", left: 120, top: 300, width: W + 400 }}>
        {rows.map((r, i) => {
          const g = interpolate(t, [0.4 + i * 0.35, 1.6 + i * 0.35], [0, 1], { ...cl, easing: ease });
          return (
            <div key={i} style={{ marginBottom: 54 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 40, marginBottom: 10 }}>{r.label}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ height: 64, width: Math.max(8, (W * r.v) / M) * g, background: r.color || ACC, borderRadius: 6 }} />
                <div style={{ color: r.color || ACC, fontWeight: 900, fontSize: 50, marginLeft: 24, opacity: g }}>{r.txt}</div>
              </div>
            </div>
          );
        })}
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: (W * l.v) / M, top: 40, bottom: 0, borderLeft: `4px dashed ${l.color || RED}`, opacity: interpolate(t, [1.2 + i * 0.6, 1.7 + i * 0.6], [0, 1], cl) }}>
            <div style={{ position: "absolute", bottom: -54, left: -10, whiteSpace: "nowrap", color: l.color || RED, fontWeight: 900, fontSize: 30 }}>{l.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Quote: React.FC<{ text: string; who: string; dur: number }> = ({ text, who, dur }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const o = interpolate(t, [0, 0.5, dur - 0.4, dur], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", paddingLeft: 140, background: "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.1))" }}>
      <div style={{ color: "#fff", fontSize: 80, fontWeight: 900, maxWidth: 820, lineHeight: 1.1 }}>“{text}”</div>
      <div style={{ color: ACC, fontSize: 40, fontWeight: 800, marginTop: 24, letterSpacing: 3 }}>— {who}</div>
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{ text: string; dur: number; color?: string }> = ({ text, dur, color = RED }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const o = interpolate(t, [0, 0.3, dur - 0.3, dur], [0, 1, 1, 0], cl);
  const s = interpolate(t, [0, 0.35], [0.7, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ position: "absolute", left: 90, bottom: 90, opacity: o, transform: `scale(${s})`, transformOrigin: "left bottom", background: color, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "14px 30px", borderRadius: 999, letterSpacing: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>{text}</div>
  );
};
