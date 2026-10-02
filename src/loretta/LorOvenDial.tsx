// LorOvenDial — el dial del horno esmaltado de los 50 que gira hasta la temperatura, con el reloj-timer de cocina
// que corre los minutos. Opcional: segunda etapa (p. ej. 400°F 10 min → 350°F 45 min).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND } from "./LorTheme";
import { Bed } from "./LorRecipeCard";

const TEMP_MIN = 200, TEMP_MAX = 550;
const angOf = (t: number) => -135 + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 270;

export const LorOvenDial: React.FC<{ stages: { temp: number; minutes: string }[]; bed?: string; caption?: string }> = ({ stages, bed, caption }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inP = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const segDur = (durationInFrames - 20) / stages.length;
  const si = Math.min(stages.length - 1, Math.floor(Math.max(0, f - 10) / segDur));
  const local = f - 10 - si * segDur;
  const prevT = si === 0 ? TEMP_MIN : stages[si - 1].temp;
  const temp = interpolate(local, [0, 0.9 * fps], [prevT, stages[si].temp], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 1.25, 0.5, 1) });
  const ang = angOf(temp);
  const timerAng = interpolate(local, [0.9 * fps, Math.max(0.9 * fps + 1, segDur)], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ticks = [];
  for (let t = 200; t <= 550; t += 50) {
    const a = (angOf(t) - 90) * Math.PI / 180;
    ticks.push(<text key={t} x={200 + Math.cos(a) * 150} y={200 + Math.sin(a) * 150 + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill={LOR.ink}>{t}</text>);
  }
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90, opacity: inP, scale: String(0.9 + 0.1 * inP) }}>
        {/* panel esmaltado blanco del horno */}
        <div style={{ position: "relative", width: 620, height: 620, borderRadius: 40, background: "linear-gradient(160deg,#FFFFFF,#E6E2DA)", boxShadow: `0 30px 60px ${LOR.shadow}, inset 0 2px 0 #fff` }}>
          <svg width={620} height={620} viewBox="-10 -10 420 420">
            <circle cx={200} cy={200} r={190} fill="#F4F1EA" stroke="#C9C3B6" strokeWidth={4} />
            {ticks}
            <circle cx={200} cy={200} r={110} fill="url(#knob)" stroke="#9E9A92" strokeWidth={3} />
            <defs><radialGradient id="knob" cx="40%" cy="35%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#BDB7AC" /></radialGradient></defs>
            <g transform={`rotate(${ang} 200 200)`}>
              <rect x={188} y={100} width={24} height={200} rx={12} fill="#E9E5DC" stroke="#9E9A92" strokeWidth={3} />
              <polygon points="200,92 190,112 210,112" fill={LOR.gingham} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LOR.ink }}>{Math.round(temp)}°F</div>
        </div>
        {/* timer de cocina */}
        <div style={{ position: "relative", width: 380, height: 380 }}>
          <svg width={380} height={380} viewBox="0 0 200 200">
            <circle cx={100} cy={105} r={86} fill={LOR.butter} stroke="#C9A232" strokeWidth={5} />
            <circle cx={100} cy={105} r={70} fill={LOR.white} />
            {Array.from({ length: 12 }).map((_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <line key={i} x1={100 + Math.cos(a) * 60} y1={105 + Math.sin(a) * 60} x2={100 + Math.cos(a) * 68} y2={105 + Math.sin(a) * 68} stroke={LOR.ink} strokeWidth={3} />; })}
            <path d={`M100 105 L100 37 A68 68 0 ${timerAng > 180 ? 1 : 0} 1 ${100 + Math.sin(timerAng * Math.PI / 180) * 68} ${105 - Math.cos(timerAng * Math.PI / 180) * 68} Z`} fill="rgba(200,50,58,0.35)" />
            <line x1={100} y1={105} x2={100 + Math.sin(timerAng * Math.PI / 180) * 58} y2={105 - Math.cos(timerAng * Math.PI / 180) * 58} stroke={LOR.gingham} strokeWidth={5} strokeLinecap="round" />
            <rect x={90} y={8} width={20} height={12} rx={3} fill="#C9A232" />
          </svg>
          <div style={{ position: "absolute", left: -40, right: -40, bottom: -70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: LOR.gingham }}>{stages[si].minutes}</div>
        </div>
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: LOR.ink }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
