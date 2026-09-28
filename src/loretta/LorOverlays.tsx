// Overlays del canal (van ENCIMA del avatar o de una toma, sin taparla entera):
//   LorNameTag (cartel manuscrito de nombre) · LorComments (lo que "ustedes escribieron", notitas que caen)
//   LorNote (nota manuscrita pegada) · LorArrow (anotación a mano con flecha sobre la toma congelada)
//   LorAsk (pregunta para comentar) · LorSubscribe (nota con botón que se aprieta)
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "./LorTheme";

const pop = (f: number, fps: number, at = 0) => spring({ frame: f - at, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });

export const LorNameTag: React.FC<{ name: string; sub?: string; side?: "left" | "right" }> = ({ name, sub, side = "left" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 6); const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(f, [12, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", [side]: 80, bottom: 90, opacity: out, translate: `0px ${(1 - p) * 60}px`, rotate: `${side === "left" ? -2 : 2}deg` }}>
        <div style={{ background: LOR.white, padding: "16px 34px 14px", borderRadius: 8, boxShadow: `0 12px 28px ${LOR.shadow}`, borderLeft: `10px solid ${LOR.gingham}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: LOR.ink, lineHeight: 1 }}>{name}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: LOR.greenDeep, clipPath: `inset(0 ${100 - w}% 0 0)` }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LorComments: React.FC<{ items: { at: number; text: string }[] }> = ({ items }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      {items.map((it, i) => {
        const p = pop(f, fps, it.at * fps); if (f < it.at * fps) return null;
        const x = [70, 1150, 120][i % 3], y = [120, 190, 640][i % 3], r = (rnd(i + 5) - 0.5) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 660, rotate: `${r}deg`, scale: String(0.7 + 0.3 * p), opacity: Math.min(1, p * 1.4), background: i % 2 ? LOR.butterSoft : LOR.white, padding: "22px 28px", borderRadius: 6, boxShadow: `0 14px 30px ${LOR.shadow}` }}>
            <div style={{ position: "absolute", top: -14, left: "42%", width: 110, height: 30, background: hexA(LOR.gingham, 0.55), rotate: "-4deg" }} />
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: LOR.inkSoft, letterSpacing: 2 }}>YOU WROTE:</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: LOR.ink, lineHeight: "52px" }}>“{it.text}”</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const LorNote: React.FC<{ text: string; x?: number; y?: number; rot?: number }> = ({ text, x = 0.6, y = 0.45, rot = -5 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 8); const w = interpolate(f, [16, 40], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(0.6 + 0.4 * p), opacity: p, background: "#FFFBEA", padding: "26px 40px", boxShadow: `0 16px 30px ${LOR.shadow}`, borderRadius: 4 }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#1F2F5C", clipPath: `inset(0 ${100 - w}% 0 0)`, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

export const LorArrow: React.FC<{ text: string; x?: number; y?: number }> = ({ text, x = 0.5, y = 0.5 }) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const t = interpolate(f, [18, 38], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = x * 1920, cy = y * 1080;
  const ring = 2 * Math.PI * 150;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={cx} cy={cy} rx={170} ry={130} fill="none" stroke={LOR.gingham} strokeWidth={9} strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - d)} transform={`rotate(-8 ${cx} ${cy})`} style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }} />
        <path d={`M ${cx + 180} ${cy - 150} Q ${cx + 320} ${cy - 250} ${cx + 430} ${cy - 250}`} fill="none" stroke={LOR.gingham} strokeWidth={8} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - d)} style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }} />
      </svg>
      <div style={{ position: "absolute", left: cx + 440, top: cy - 300, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: LOR.white, textShadow: `0 3px 0 ${LOR.gingham}, 0 6px 16px rgba(0,0,0,0.6)`, clipPath: `inset(0 ${100 - t}% 0 0)`, whiteSpace: "nowrap", rotate: "-4deg", translate: cx > 1100 ? "-120% 0" : "0 0" }}>{text}</div>
    </AbsoluteFill>
  );
};

export const LorAsk: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 6); const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 80, width: 760, opacity: out * Math.min(1, p * 1.3), scale: String(0.8 + 0.2 * p), rotate: "2deg", background: LOR.white, borderRadius: 18, padding: "26px 34px", boxShadow: `0 18px 40px ${LOR.shadow}`, border: `4px solid ${LOR.green}` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: LOR.ink, lineHeight: 1.08 }}>{text}</div>
        {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.gingham, marginTop: 8 }}>{sub} ↓</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export const LorSubscribe: React.FC<{ text?: string; sub?: string }> = ({ text = "Subscribe", sub }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 4); const press = interpolate(f, [34, 40, 46], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = f > 40; const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, bottom: 90, opacity: out, translate: `0 ${(1 - p) * 80}px`, display: "flex", alignItems: "center", gap: 26, background: LOR.white, borderRadius: 20, padding: "20px 28px", boxShadow: `0 18px 40px ${LOR.shadow}` }}>
        <div style={{ scale: String(press), background: done ? LOR.inkSoft : LOR.gingham, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 46, padding: "12px 34px", borderRadius: 14 }}>{done ? "Subscribed ✓" : text}</div>
        {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.ink, maxWidth: 560 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
