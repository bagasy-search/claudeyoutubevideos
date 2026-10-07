// OpThermo — el termómetro de dial viejo del porche, clavado a la pared de tablas DENTRO de la escena (foto/clip de cama
// con Ken-Burns): esfera de chapa con escala °F, la aguja roja baja de `from` a `to`, la escarcha va ganando el vidrio
// desde los bordes a medida que enfría, y una etiqueta kraft colgada dice qué noche era. Props por props.
// Props: from, to, label, sub, bed, min, max.
import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { OP, LABEL, HAND, SLAB, rnd } from "./OpTheme";
import { OpBed, ease } from "./OpParts";

export const OpThermo: React.FC<{ from?: number; to?: number; label?: string; sub?: string; bed?: string; min?: number; max?: number; seed?: number }> = ({ from = 28, to = -15, label = "", sub, bed, min = -40, max = 120, seed = 31 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const k = interpolate(f, [12, Math.max(40, Math.min(durationInFrames - 20, 110))], [0, 1], { ...ease, easing: Easing.inOut(Easing.cubic) });
  const t = from + (to - from) * k;
  const R = 300, CX = 330, CY = 330;
  const ang = (v: number) => (-225 + ((v - min) / (max - min)) * 270) * (Math.PI / 180); // arco de 270°
  const pt = (v: number, r: number) => [CX + Math.cos(ang(v)) * r, CY + Math.sin(ang(v)) * r];
  const ticks: React.ReactNode[] = [];
  for (let v = min; v <= max; v += 5) {
    const big = v % 20 === 0; const [x1, y1] = pt(v, R - 18); const [x2, y2] = pt(v, R - (big ? 58 : 38));
    ticks.push(<line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke={v <= 32 ? "#2a5d8f" : OP.pencil} strokeWidth={big ? 6 : 3} />);
    if (big) { const [tx, ty] = pt(v, R - 92); ticks.push(<text key={"t" + v} x={tx} y={ty + 13} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={36} fill={v <= 32 ? "#2a5d8f" : OP.pencil}>{v}</text>); }
  }
  const [nx, ny] = pt(t, R - 40); const [bx, by] = pt(t + (max - min) / 2, 46);
  // escarcha: cristales en el borde del vidrio, más hacia adentro cuanto más frío
  const frost = Math.max(0, Math.min(1, (32 - t) / 47));
  const cr: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const a = rnd(seed + i) * Math.PI * 2, d = R - 6 - rnd(seed + 99 + i) * 150 * frost, s = 10 + rnd(seed + 7 + i) * 26;
    const x = CX + Math.cos(a) * d, y = CY + Math.sin(a) * d, ro = rnd(seed + 3 + i) * 180;
    cr.push(<g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ro.toFixed(0)})`} opacity={(0.25 + 0.6 * frost).toFixed(2)}>
      <line x1={-s} y1={0} x2={s} y2={0} stroke="#ffffff" strokeWidth={2} /><line x1={-s / 2} y1={-s * 0.87} x2={s / 2} y2={s * 0.87} stroke="#ffffff" strokeWidth={2} /><line x1={-s / 2} y1={s * 0.87} x2={s / 2} y2={-s * 0.87} stroke="#ffffff" strokeWidth={2} />
    </g>);
  }
  const shown = Math.round(t);
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.25} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(170,200,230,${(0.25 * frost).toFixed(3)}) 100%)` }} />
      <div style={{ position: "absolute", left: 230, top: 150, width: 660, height: 660, transform: `perspective(1400px) rotateY(-12deg) rotateZ(${(rnd(seed) * 4 - 2).toFixed(2)}deg)` }}>
        <svg width={660} height={660} style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.55))" }}>
          <defs>
            <radialGradient id="rim" cx="40%" cy="35%"><stop offset="0%" stopColor="#d9d6cf" /><stop offset="70%" stopColor="#8d8a84" /><stop offset="100%" stopColor="#5e5b56" /></radialGradient>
            <radialGradient id="face" cx="45%" cy="40%"><stop offset="0%" stopColor="#fffdf5" /><stop offset="100%" stopColor="#e7dfc8" /></radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R + 26} fill="url(#rim)" />
          <circle cx={CX} cy={CY} r={R} fill="url(#face)" />
          <path d={`M ${pt(min, R - 10).join(" ")} A ${R - 10} ${R - 10} 0 0 1 ${pt(32, R - 10).join(" ")}`} fill="none" stroke="#8fb6dc" strokeWidth={14} opacity={0.6} />
          {ticks}
          <text x={CX} y={CY + 120} textAnchor="middle" fontFamily={SLAB} fontWeight={700} fontSize={44} fill={OP.pencilSoft}>°F</text>
          <line x1={bx} y1={by} x2={nx} y2={ny} stroke={OP.red} strokeWidth={10} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={22} fill={OP.redDeep} />
          {cr}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
          <circle cx={CX - 20} cy={14} r={12} fill="#4a4540" />
        </svg>
      </div>
      <div style={{ position: "absolute", right: 170, top: 300, width: 640, transform: "rotate(2deg)" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 210, lineHeight: 1, color: shown <= 0 ? "#cfe6ff" : OP.white, textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>{shown}°F</div>
        {label ? <div style={{ marginTop: 18, display: "inline-block", background: OP.kraft, padding: "14px 30px", boxShadow: "0 14px 24px rgba(0,0,0,0.45)", opacity: interpolate(f, [30, 40], [0, 1], ease) }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: OP.pencil }}>{label}</div>
          {sub ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: OP.redDeep, textTransform: "uppercase" }}>{sub}</div> : null}
        </div> : null}
      </div>
    </AbsoluteFill>
  );
};
