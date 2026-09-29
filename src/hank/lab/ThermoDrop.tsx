// ThermoDrop — el termómetro que baja (°F) al lado de una foto que se va enfriando: la escarcha avanza desde los
// bordes, la imagen pierde color, y en cada umbral se clava un rótulo (50 °F "SLOWS DOWN", 40 °F "LOCKS UP").
// Lectura grande del número; los umbrales son los de la FWC / USDA (rango, no ley exacta).
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HAND, HK, clamp, ease, easeInOut, rnd } from "../theme";

type Mark = { t: number; label: string; sub?: string };
export const ThermoDrop: React.FC<{ from?: number; to?: number; marks?: Mark[]; photo: string; kicker?: string; note?: string }> = ({
  from = 75, to = 35,
  marks = [{ t: 50, label: "SLOWS DOWN", sub: "heart and breathing slow" }, { t: 40, label: "LOCKS UP", sub: "can't hold on · lets go" }],
  photo, kicker = "WHY THEY FALL", note = "Thresholds: FWC · USDA (approximate)",
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = clamp(f / Math.max(1, D - 1));
  const p = easeInOut(clamp((t - 0.08) / 0.72));          // avance de la bajada
  const temp = from + (to - from) * p;
  const cold = clamp((from - temp) / (from - to));          // 0 cálido → 1 helado
  const tube = { x: 330, y: 150, h: 720 };
  const yOf = (v: number) => tube.y + tube.h * (1 - (v - 20) / 70); // escala 20..90 °F
  const crystals = useMemo(() => Array.from({ length: 90 }, (_, i) => ({ a: rnd(i) * Math.PI * 2, r: 0.55 + rnd(i + 9) * 0.5, s: 20 + rnd(i + 3) * 60, rot: rnd(i + 5) * 180 })), []);
  const camS = 1 + 0.05 * t;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0B1716 0%, #0F2426 60%, #07100F 100%)", overflow: "hidden" }}>
      {/* foto que se enfría */}
      <div style={{ position: "absolute", left: 640, top: 110, width: 1180, height: 860, borderRadius: 6, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transform: `scale(${camS}) rotate(${-0.6 + 0.6 * t}deg)` }}>
        <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `saturate(${1 - 0.75 * cold}) brightness(${1 - 0.15 * cold}) hue-rotate(${-12 * cold}deg)` }} />
        <AbsoluteFill style={{ background: `rgba(150,200,235,${0.28 * cold})`, mixBlendMode: "screen" }} />
        {/* escarcha desde los bordes */}
        <svg width={1180} height={860} style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="fr" cx="50%" cy="50%" r="70%"><stop offset={`${Math.max(0, 70 - cold * 45)}%`} stopColor="white" stopOpacity="0" /><stop offset="100%" stopColor="#EAF6FF" stopOpacity={0.85 * cold} /></radialGradient></defs>
          <rect width={1180} height={860} fill="url(#fr)" />
          {crystals.map((c, i) => {
            const show = clamp((cold - (1 - c.r) * 0.9) * 3);
            const cx = 590 + Math.cos(c.a) * 700 * c.r, cy = 430 + Math.sin(c.a) * 560 * c.r;
            return <g key={i} transform={`translate(${cx},${cy}) rotate(${c.rot}) scale(${show})`} opacity={0.75 * show}>
              {[0, 60, 120].map((r) => <line key={r} x1={-c.s} y1={0} x2={c.s} y2={0} transform={`rotate(${r})`} stroke="#F4FBFF" strokeWidth={2} />)}
            </g>;
          })}
        </svg>
      </div>
      {/* termómetro */}
      <svg width={640} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.18)" /><stop offset="0.5" stopColor="rgba(255,255,255,0.04)" /><stop offset="1" stopColor="rgba(255,255,255,0.14)" /></linearGradient></defs>
        <rect x={tube.x - 34} y={tube.y - 30} width={68} height={tube.h + 60} rx={34} fill="url(#glass)" stroke="rgba(241,235,221,0.5)" strokeWidth={3} />
        <circle cx={tube.x} cy={tube.y + tube.h + 70} r={62} fill={cold > 0.6 ? "#6FB7E8" : HK.red} stroke="rgba(241,235,221,0.5)" strokeWidth={3} />
        <rect x={tube.x - 16} y={yOf(temp)} width={32} height={tube.y + tube.h + 40 - yOf(temp)} rx={16} fill={cold > 0.6 ? "#6FB7E8" : HK.red} />
        {Array.from({ length: 15 }, (_, k) => { const v = 20 + k * 5; const y = yOf(v); return <g key={k}><line x1={tube.x + 40} x2={tube.x + (k % 2 ? 58 : 72)} y1={y} y2={y} stroke="rgba(241,235,221,0.6)" strokeWidth={2} />{k % 2 === 0 ? <text x={tube.x + 84} y={y + 8} fontFamily={MONO} fontSize={24} fill="rgba(241,235,221,0.7)">{v}°</text> : null}</g>; })}
        {marks.map((m, i) => { const y = yOf(m.t); const on = ease(clamp((from - temp - (from - m.t)) / 3 + 1)); return (
          <g key={i} opacity={on}>
            <line x1={tube.x - 60} x2={tube.x + 150} y1={y} y2={y} stroke={HK.orange} strokeWidth={3} strokeDasharray="10 8" />
            <text x={40} y={y - 16} fontFamily={SANS} fontSize={34} letterSpacing={4} fill={HK.orange} transform={`translate(${(1 - on) * -30},0)`}>{m.label}</text>
            {m.sub ? <text x={40} y={y + 34} fontFamily={HAND} fontSize={34} fill={HK.bone}>{m.sub}</text> : null}
          </g>); })}
      </svg>
      {/* lectura grande */}
      <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SANS, fontSize: 30, letterSpacing: 10, color: HK.bone, opacity: ease(f / 14) }}>{kicker}</div>
      <div style={{ position: "absolute", left: 680, top: 120, padding: "8px 26px", background: "rgba(7,16,15,0.8)", borderLeft: `6px solid ${cold > 0.6 ? "#6FB7E8" : HK.orange}` }}>
        <div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1, color: HK.bone, fontVariantNumeric: "tabular-nums" }}>{Math.round(temp)}°F</div>
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 60, fontFamily: MONO, fontSize: 20, color: "rgba(241,235,221,0.65)" }}>{note}</div>
      <AbsoluteFill style={{ background: "#000", opacity: clamp((f - (D - 10)) / 10), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
