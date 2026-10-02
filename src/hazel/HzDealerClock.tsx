// HzDealerClock — el reloj de pared del porche marcando las 6:5x y avanzando hasta la hora de apertura, sobre la
// foto de la puerta; abajo la fila de dealers (siluetas con chaleco) que se va alargando. Props: bed, from ("6:52"),
// to ("7:00"), label ("SATURDAY"), people.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, TYPE } from "./HzTheme";
import { HzBed, ease, useIn } from "./HzParts";

const mins = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

export const HzDealerClock: React.FC<{ bed?: string; from?: string; to?: string; label?: string; people?: number; caption?: string; seed?: number }> = ({ bed, from = "6:52", to = "7:00", label = "Saturday", people = 0, caption = "doors open at", seed = 31 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inn = useIn(0, 14, 120);
  const t = interpolate(f, [8, Math.max(20, durationInFrames - 20)], [mins(from), mins(to)], ease);
  const hh = Math.floor(t / 60), mm = t % 60;
  const ha = ((hh % 12) + mm / 60) * 30, ma = mm * 6;
  const shown = `${hh}:${String(Math.floor(mm)).padStart(2, "0")}`;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.2} />
      <div style={{ position: "absolute", left: 140, top: 110, transform: `scale(${inn})` }}>
        <svg width="460" height="460" viewBox="-230 -230 460 460" style={{ filter: `drop-shadow(0 20px 30px ${HZ.shadow})` }}>
          <circle r="220" fill={HZ.gold} /><circle r="200" fill={HZ.paper} />
          {Array.from({ length: 60 }).map((_, i) => { const a = (i * 6 * Math.PI) / 180; const L = i % 5 === 0 ? 26 : 10; return <line key={i} x1={Math.sin(a) * 186} y1={-Math.cos(a) * 186} x2={Math.sin(a) * (186 - L)} y2={-Math.cos(a) * (186 - L)} stroke={HZ.ink} strokeWidth={i % 5 === 0 ? 6 : 2} />; })}
          {[12, 3, 6, 9].map((n, i) => <text key={n} x={Math.sin((i * Math.PI) / 2) * 135} y={-Math.cos((i * Math.PI) / 2) * 135 + 18} textAnchor="middle" fontSize="54" fontFamily="serif" fill={HZ.ink}>{n}</text>)}
          <line x1="0" y1="0" x2={Math.sin((ha * Math.PI) / 180) * 100} y2={-Math.cos((ha * Math.PI) / 180) * 100} stroke={HZ.ink} strokeWidth="14" strokeLinecap="round" />
          <line x1="0" y1="0" x2={Math.sin((ma * Math.PI) / 180) * 160} y2={-Math.cos((ma * Math.PI) / 180) * 160} stroke={HZ.ink} strokeWidth="8" strokeLinecap="round" />
          <circle r="14" fill={HZ.red} />
        </svg>
        <div style={{ marginTop: 20, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: HZ.white, textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{label} · {shown} a.m.</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 150, background: HZ.paper, padding: "18px 30px", transform: `rotate(-2deg) scale(${inn})`, boxShadow: `0 16px 30px ${HZ.shadow}` }}>
        <div style={{ fontFamily: TYPE, fontSize: 34, color: HZ.inkSoft }}>{caption}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 96, color: HZ.red, lineHeight: 1 }}>{to} a.m.</div>
      </div>
      <svg style={{ position: "absolute", left: 0, bottom: 0 }} width="1920" height="360" viewBox="0 0 1920 360">
        {Array.from({ length: people }).map((_, i) => {
          const a = 6 + i * 7; const op = interpolate(f, [a, a + 8], [0, 1], ease); const x = 1650 - i * 150; const s = 0.9 + ((i * 37) % 10) / 50;
          return (
            <g key={i} transform={`translate(${x},${360 - 360 * s}) scale(${s})`} opacity={op}>
              <circle cx="0" cy="70" r="34" fill="#2a2420" />
              <path d="M -52 360 L -48 150 Q -46 112 0 108 Q 46 112 48 150 L 52 360 Z" fill="#3b332c" />
              <path d="M -40 150 L -36 300 L 36 300 L 40 150 Q 0 132 -40 150 Z" fill={i % 2 ? "#5a4a3a" : "#2f3a44"} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
