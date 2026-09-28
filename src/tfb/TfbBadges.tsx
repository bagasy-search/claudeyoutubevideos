// TfbBadges — piezas chicas de información sobre el footage, todas dibujadas con código:
//   · TfbWarning   → sello de SEGURIDAD con íconos (guantes / gafas / niños) que golpea y queda latiendo.
//   · TfbTimerChip → reloj cuya aguja gira + texto de tiempo (p. ej. "TODA LA NOCHE", "24 H").
//   · TfbTag       → etiqueta colgante (cartel de precio de ferretería) que se balancea con física.
//   · TfbChecklist → lista corta que se tilda línea por línea (✓ o ✗).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, CAVEAT, INTER, TFB, clamp, outro, pop } from "./theme";

type Pos = { x: number; y: number };
const at = (p: Pos) => ({ position: "absolute" as const, left: `${p.x}%`, top: `${p.y}%` });

const GlovesIcon = () => (<g><path d="M-30,40 L-30,-10 Q-30,-22 -22,-22 L-22,-40 Q-22,-48 -15,-48 Q-8,-48 -8,-40 L-8,-44 Q-8,-52 0,-52 Q8,-52 8,-44 L8,-40 Q8,-48 15,-48 Q22,-48 22,-40 L22,-10 L34,-24 Q42,-30 46,-22 L26,20 L26,40 Z" fill={TFB.yellow} stroke={TFB.ink} strokeWidth={5} strokeLinejoin="round" /></g>);
const GogglesIcon = () => (<g><path d="M-54,-6 Q-54,-26 -30,-26 L30,-26 Q54,-26 54,-6 Q54,18 30,18 Q14,18 6,6 L-6,6 Q-14,18 -30,18 Q-54,18 -54,-6 Z" fill="#bfe7ff" stroke={TFB.ink} strokeWidth={5} strokeLinejoin="round" />
  <path d="M-54,-8 L-70,-12 M54,-8 L70,-12" stroke={TFB.ink} strokeWidth={6} strokeLinecap="round" /></g>);
const KidIcon = () => (<g><circle cx={0} cy={-28} r={16} fill={TFB.white} stroke={TFB.ink} strokeWidth={5} /><path d="M-22,34 L-14,-6 L14,-6 L22,34 Z" fill={TFB.white} stroke={TFB.ink} strokeWidth={5} strokeLinejoin="round" />
  <path d="M-52,-52 L52,52" stroke={TFB.red} strokeWidth={10} strokeLinecap="round" /><circle r={62} fill="none" stroke={TFB.red} strokeWidth={10} /></g>);

export const TfbWarning: React.FC<{ title: string; items: { icon: "gloves" | "goggles" | "kids"; label: string }[]; dur: number; pos?: Pos }> = ({ title, items, dur, pos = { x: 50, y: 50 } }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 0, 9, 0.6), o = outro(f, dur, 8), beat = 1 + 0.025 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * Math.min(1, p)})` }} />
      <div style={{ ...at(pos), transform: `translate(-50%,-50%) rotate(${interpolate(p, [0, 1], [-14, -3])}deg) scale(${interpolate(p, [0, 1], [2.2, 1]) * beat})`, opacity: Math.min(1, p * 2),
        background: TFB.yellow, border: `10px solid ${TFB.ink}`, borderRadius: 26, padding: "22px 40px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        backgroundImage: `repeating-linear-gradient(45deg, ${TFB.yellow} 0 26px, #f2c200 26px 52px)` }}>
        <div style={{ fontFamily: ANTON, fontSize: 88, color: TFB.ink, lineHeight: 1, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <svg width={84} height={76} viewBox="0 0 84 76"><path d="M42,4 L80,72 L4,72 Z" fill={TFB.ink} /><rect x={38} y={26} width={8} height={26} rx={3} fill={TFB.yellow} /><circle cx={42} cy={61} r={5} fill={TFB.yellow} /></svg>{title}</div>
        <div style={{ display: "flex", gap: 36, justifyContent: "center" }}>
          {items.map((it, i) => { const q = pop(f, fps, 10 + i * 6, 11, 0.6); return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${q})` }}>
              <div style={{ width: 150, height: 150, borderRadius: 75, background: TFB.white, border: `6px solid ${TFB.ink}` }}>
                <svg width={150} height={150} viewBox="-75 -75 150 150">{it.icon === "gloves" ? <GlovesIcon /> : it.icon === "goggles" ? <GogglesIcon /> : <KidIcon />}</svg>
              </div>
              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 30, color: TFB.ink, textTransform: "uppercase" }}>{it.label}</div>
            </div>); })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TfbTimerChip: React.FC<{ text: string; sub?: string; dur: number; pos?: Pos; turns?: number }> = ({ text, sub, dur, pos = { x: 6, y: 72 }, turns = 3 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 0, 12, 0.7), o = outro(f, dur, 8);
  const ang = interpolate(f, [4, Math.max(8, dur - 10)], [0, 360 * turns], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ ...at(pos), display: "flex", alignItems: "center", gap: 18, background: "rgba(16,16,16,0.88)", borderRadius: 60, padding: "14px 34px 14px 16px",
        transform: `scale(${p})`, transformOrigin: "left center", boxShadow: "0 14px 34px rgba(0,0,0,0.5)", border: `4px solid ${TFB.yellow}` }}>
        <svg width={96} height={96} viewBox="-50 -50 100 100">
          <circle r={44} fill={TFB.white} stroke={TFB.ink} strokeWidth={5} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-36} x2={0} y2={-30} stroke={TFB.ink} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
          <path d={`M0,0 L0,-40 A40,40 0 ${(ang % 360) > 180 ? 1 : 0},1 ${40 * Math.sin((ang % 360) * Math.PI / 180)},${-40 * Math.cos((ang % 360) * Math.PI / 180)} Z`} fill={TFB.yellow} opacity={0.7} />
          <line x1={0} y1={0} x2={0} y2={-34} stroke={TFB.ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ang})`} />
          <line x1={0} y1={0} x2={0} y2={-22} stroke={TFB.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
          <circle r={5} fill={TFB.ink} />
        </svg>
        <div>
          <div style={{ fontFamily: ANTON, fontSize: 64, color: TFB.white, lineHeight: 1, whiteSpace: "nowrap" }}>{text}</div>
          {sub && <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: TFB.yellow, letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TfbTag: React.FC<{ text: string; sub?: string; dur: number; pos?: Pos }> = ({ text, sub, dur, pos = { x: 76, y: 8 } }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const drop = pop(f, fps, 0, 8, 0.9), o = outro(f, dur, 8);
  const swing = 16 * Math.exp(-f / 22) * Math.sin(f / 3.2); // péndulo amortiguado
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ ...at(pos), transform: `translateY(${(1 - drop) * -300}px) rotate(${swing}deg)`, transformOrigin: "50% 0%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 4, height: 90, background: "#ddd" }} />
        <div style={{ background: TFB.yellow, border: `6px solid ${TFB.ink}`, borderRadius: "18px 18px 18px 18px", padding: "22px 34px 18px", position: "relative", textAlign: "center",
          boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", top: 10, left: "50%", width: 22, height: 22, marginLeft: -11, borderRadius: 11, background: "#333", border: "4px solid #eee" }} />
          <div style={{ fontFamily: ANTON, fontSize: 96, color: TFB.ink, lineHeight: 1, marginTop: 16 }}>{text}</div>
          {sub && <div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 44, color: TFB.red }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TfbChecklist: React.FC<{ title?: string; items: { t: string; ok: boolean; at: number }[]; dur: number; pos?: Pos }> = ({ title, items, dur, pos = { x: 5, y: 20 } }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 12], [0, 1], clamp), o = outro(f, dur, 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.72 * inn}) 0%, rgba(0,0,0,${0.35 * inn}) 45%, rgba(0,0,0,0) 65%)` }} />
      <div style={{ ...at(pos), display: "flex", flexDirection: "column", gap: 20, transform: `translateX(${(1 - inn) * -80}px)`, opacity: inn }}>
        {title && <div style={{ fontFamily: ANTON, fontSize: 72, color: TFB.yellow, textTransform: "uppercase", textShadow: "0 5px 0 rgba(0,0,0,0.5)" }}>{title}</div>}
        {items.map((it, i) => { const q = pop(f, fps, it.at, 12, 0.6), c = interpolate(f, [it.at + 4, it.at + 12], [0, 1], clamp); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: interpolate(q, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - q) * -40}px)` }}>
            <svg width={70} height={70} viewBox="0 0 70 70">
              <rect x={4} y={4} width={62} height={62} rx={12} fill={it.ok ? TFB.yellow : TFB.red} stroke={TFB.ink} strokeWidth={5} />
              <path d={it.ok ? "M16,36 L30,50 L55,20" : "M20,20 L50,50 M50,20 L20,50"} fill="none" stroke={it.ok ? TFB.ink : TFB.white} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} />
            </svg>
            <div style={{ fontFamily: ANTON, fontSize: 64, color: TFB.white, textTransform: "uppercase", lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{it.t}</div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};
