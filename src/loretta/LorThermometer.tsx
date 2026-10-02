// LorThermometer — el termómetro de carne en grande: una aguja que sube por el dial hasta cada parada (120°F glaseado,
// 140°F listo, 160°F "te pasaste") con su etiqueta a mano; la zona segura en verde y la que seca el jamón en rojo.
// Todo por props (texto en inglés, números), todo por useCurrentFrame. Reusable por el canal (jamón, pollo, pavo, pan).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, paperBg } from "./LorTheme";

type Stop = { temp: number; label: string };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const A0 = -215, A1 = 35; // grados del arco (de abajo-izquierda a abajo-derecha)

export const LorThermometer: React.FC<{ from?: number; min?: number; max?: number; stops: Stop[]; title?: string; sub?: string; goodFrom?: number; goodTo?: number }> = ({ from = 60, min = 60, max = 180, stops, title, sub, goodFrom = 130, goodTo = 145 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inn = interpolate(f, [0, 16], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const n = stops.length, t0 = 14, t1 = Math.max(t0 + 30, durationInFrames - 14), seg = (t1 - t0) / n;
  // la aguja sube parada por parada, con un respiro en cada una
  let temp = from; let idx = -1;
  for (let i = 0; i < n; i++) {
    const a = t0 + i * seg, b = a + seg * 0.72, prev = i === 0 ? from : stops[i - 1].temp;
    if (f >= a) { temp = interpolate(f, [a, b], [prev, stops[i].temp], { ...cl, easing: Easing.inOut(Easing.cubic) }); }
    if (f >= b) idx = i;
  }
  const ang = (v: number) => A0 + ((v - min) / (max - min)) * (A1 - A0);
  const P = (a: number, r: number) => [500 + r * Math.cos((a * Math.PI) / 180), 470 + r * Math.sin((a * Math.PI) / 180)];
  const arc = (v0: number, v1: number, r: number) => { const [x0, y0] = P(ang(v0), r), [x1, y1] = P(ang(v1), r); return `M ${x0} ${y0} A ${r} ${r} 0 ${ang(v1) - ang(v0) > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const ticks: number[] = []; for (let v = min; v <= max; v += 10) ticks.push(v);
  const wob = Math.sin(f * 0.9) * (idx < 0 ? 0.5 : 0.15);
  const hot = temp >= goodFrom && temp <= goodTo;
  return (
    <AbsoluteFill style={{ ...paperBg(LOR.paper2) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.55), transparent 70%)" }} />
      {title ? <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: LOR.ink, opacity: inn, letterSpacing: -1 }}>{title}</div> : null}
      {sub ? <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LOR.gingham, opacity: inn }}>{sub}</div> : null}
      <svg viewBox="0 0 1000 760" style={{ position: "absolute", left: "26%", top: "14%", width: "48%", height: "86%", opacity: inn, transform: `scale(${0.92 + 0.08 * inn})` }}>
        <defs>
          <radialGradient id="face" cx="50%" cy="42%" r="60%"><stop offset="0%" stopColor="#FFFDF7" /><stop offset="100%" stopColor="#EADFC4" /></radialGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4F1EA" /><stop offset="50%" stopColor="#B8B2A5" /><stop offset="100%" stopColor="#7C766B" /></linearGradient>
        </defs>
        <circle cx="500" cy="470" r="330" fill="url(#rim)" />
        <circle cx="500" cy="470" r="306" fill="url(#face)" stroke="#8E8576" strokeWidth="3" />
        <path d={arc(goodFrom, goodTo, 262)} stroke={LOR.green} strokeWidth="38" fill="none" strokeLinecap="butt" opacity={0.85} />
        <path d={arc(150, max, 262)} stroke={LOR.gingham} strokeWidth="38" fill="none" opacity={0.75} />
        {ticks.map((v) => { const [x0, y0] = P(ang(v), 292), [x1, y1] = P(ang(v), v % 20 === 0 ? 270 : 280); const [tx, ty] = P(ang(v), 232); return (
          <g key={v}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={LOR.ink} strokeWidth={v % 20 === 0 ? 5 : 3} />{v % 20 === 0 ? <text x={tx} y={ty + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill={LOR.ink}>{v}</text> : null}</g>); })}
        <text x="500" y="610" textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={LOR.inkSoft}>°F</text>
        <g transform={`rotate(${ang(temp) + wob} 500 470)`}>
          <polygon points="500,462 500,478 800,470" fill={LOR.gingham} stroke="#7a1e24" strokeWidth="2" /><circle cx="500" cy="470" r="26" fill={LOR.ink} /><circle cx="500" cy="470" r="9" fill="#C9C0AE" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: "6%", top: "38%", width: "20%", textAlign: "center", opacity: inn }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 1, color: hot ? LOR.greenDeep : LOR.ink, letterSpacing: -4 }}>{Math.round(temp)}°</div>
      </div>
      <div style={{ position: "absolute", right: "5%", top: "30%", width: "22%", display: "flex", flexDirection: "column", gap: 22 }}>
        {stops.map((s, i) => { const on = interpolate(f, [t0 + i * seg + seg * 0.7, t0 + i * seg + seg * 0.7 + 10], [0, 1], cl); return (
          <div key={i} style={{ opacity: on, translate: `${(1 - on) * 40}px 0px`, background: LOR.white, borderRadius: 16, padding: "14px 22px", boxShadow: `0 10px 24px ${LOR.shadow}`, borderLeft: `10px solid ${s.temp >= 150 ? LOR.gingham : LOR.green}` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: LOR.ink, lineHeight: 1 }}>{s.temp}°F</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.inkSoft, lineHeight: 1.05 }}>{s.label}</div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};
