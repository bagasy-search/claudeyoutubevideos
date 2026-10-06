// Medidas del kit Rhonda, apoyadas en el mundo (sobre la cama real del baño):
//   RhMeasureCup  taza medidora de vidrio que se llena hasta ½ / 1 taza, con la medida y DÓNDE va (en la mano de Rhonda)
//   RhTimer30     reloj de cocina blanco de cuerda sobre la mesada: el sector rojo baja de N minutos a 0 y suena "ding";
//                 `overnight` = luna → sol (para las tiras de toda la noche)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA, rnd } from "./RhTheme";
import { Bed, Card, lin, pop, useOut } from "./RhParts";

export const RhMeasureCup: React.FC<{ fill?: number; label?: string; where?: string; bed?: string }> = ({ fill = 0.5, label = "½ cup", where, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0);
  const lv = interpolate(f, [8, Math.max(20, durationInFrames * 0.55)], [0, fill], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const H = 420, W = 330, top = 120, yL = top + H - lv * (H - 70);
  const wob = Math.sin(f / 4) * 6 * (1 - lin(f, durationInFrames * 0.55, durationInFrames * 0.75));
  const tl = lin(f, 14, 30);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={71} dim={0.18} />
      <div style={{ position: "absolute", left: 300, top: 130, opacity: out, translate: `0 ${(1 - p) * 120}px`, rotate: "-3deg" }}>
        <svg width={560} height={640} viewBox="0 0 560 640">
          <defs>
            <linearGradient id="gl" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.55)" /><stop offset="0.25" stopColor="rgba(255,255,255,0.12)" /><stop offset="0.8" stopColor="rgba(255,255,255,0.08)" /><stop offset="1" stopColor="rgba(255,255,255,0.45)" /></linearGradient>
            <clipPath id="cupIn"><path d={`M 115 ${top} L ${115 + W} ${top} L ${105 + W} ${top + H} Q ${100 + W} ${top + H + 20} ${80 + W} ${top + H + 20} L 145 ${top + H + 20} Q 125 ${top + H + 20} 120 ${top + H} Z`} /></clipPath>
          </defs>
          <ellipse cx={280} cy={top + H + 34} rx={200} ry={20} fill="rgba(0,0,0,0.16)" />
          <g clipPath="url(#cupIn)">
            <path d={`M 90 ${yL + wob} Q 280 ${yL - wob} 470 ${yL + wob} L 470 640 L 90 640 Z`} fill={hexA("#CFE7F7", 0.85)} />
            {Array.from({ length: 10 }, (_, i) => { const by = yL + 30 + ((i * 37 + f * 3) % Math.max(30, top + H - yL)); return lv > 0.05 ? <circle key={i} cx={150 + rnd(i) * 260} cy={by} r={3 + rnd(i + 7) * 4} fill="rgba(255,255,255,0.8)" /> : null; })}
          </g>
          <path d={`M 115 ${top} L ${115 + W} ${top} L ${105 + W} ${top + H} Q ${100 + W} ${top + H + 20} ${80 + W} ${top + H + 20} L 145 ${top + H + 20} Q 125 ${top + H + 20} 120 ${top + H} Z`} fill="url(#gl)" stroke="rgba(160,190,210,0.9)" strokeWidth={5} />
          <path d={`M ${115 + W} ${top + 40} C ${115 + W + 90} ${top + 50}, ${115 + W + 90} ${top + 220}, ${110 + W} ${top + 240}`} fill="none" stroke="rgba(160,190,210,0.9)" strokeWidth={22} strokeLinecap="round" />
          {[["1 CUP", 1], ["¾", 0.75], ["½", 0.5], ["¼", 0.25]].map(([t, v], i) => { const y = top + H - (v as number) * (H - 70); return (<g key={i}><line x1={130} x2={190} y1={y} y2={y} stroke={RH.red} strokeWidth={5} /><text x={200} y={y + 11} fontFamily={LABEL} fontWeight={600} fontSize={32} fill={RH.red}>{t as string}</text></g>); })}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 960, top: 300, opacity: out * tl, translate: `${(1 - tl) * 60}px 0` }}>
        <Card style={{ padding: "40px 56px", borderLeft: `18px solid ${RH.yellow}`, rotate: "1.5deg" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: RH.ink, lineHeight: 1 }}>{label}</div>
          {where ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: RH.blueDeep, marginTop: 6 }}>{where}</div> : null}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const RhTimer30: React.FC<{ minutes?: number; unit?: string; label?: string; fast?: boolean; overnight?: boolean; bed?: string }> = ({ minutes = 30, unit, label, fast, overnight, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0);
  const end = Math.max(12, durationInFrames - (fast ? 4 : 18));
  const k = interpolate(f, [fast ? 2 : 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const ding = f > end ? lin(f, end, end + 14) : 0;
  const R = 230, cx = 300, cy = 300, a = unit ? 2 * Math.PI * 0.999 * k : (2 * Math.PI * minutes * k) / 60;
  const arc = (ang: number) => { const x = cx + R * 0.82 * Math.sin(ang), y = cy - R * 0.82 * Math.cos(ang); return `M ${cx} ${cy} L ${cx} ${cy - R * 0.82} A ${R * 0.82} ${R * 0.82} 0 ${ang > Math.PI ? 1 : 0} 1 ${x} ${y} Z`; };
  const shake = ding > 0 && ding < 1 ? Math.sin(f * 2.2) * 3 : 0;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={81} dim={0.15} />
      <div style={{ position: "absolute", left: "50%", top: 70, translate: `-50% ${(1 - p) * 140}px`, rotate: `${shake}deg`, opacity: out }}>
        <svg width={600} height={700} viewBox="0 0 600 700">
          <ellipse cx={300} cy={630} rx={230} ry={26} fill="rgba(0,0,0,0.18)" />
          <rect x={200} y={560} width={200} height={60} rx={20} fill="#ECEAE6" />
          <circle cx={cx} cy={cy} r={R + 22} fill="#F7F6F3" stroke="#D8D4CC" strokeWidth={6} />
          <circle cx={cx} cy={cy} r={R} fill="#FFFFFF" />
          {overnight ? (
            <g>
              <circle cx={cx} cy={cy} r={R * 0.82} fill={hexA("#1F3A68", 0.18 + 0.7 * k)} />
              <circle cx={cx - 40 + 80 * (1 - k)} cy={cy - 20} r={70} fill={k > 0.5 ? "#F3F0D8" : RH.yellow} />
              {k > 0.5 ? <circle cx={cx - 10 + 80 * (1 - k)} cy={cy - 40} r={62} fill={hexA("#1F3A68", 0.18 + 0.7 * k)} /> : null}
            </g>
          ) : <path d={arc(a)} fill={hexA(RH.red, 0.85)} />}
          {!overnight ? Array.from({ length: 12 }, (_, i) => { const ang = (i / 12) * 2 * Math.PI, r1 = R - 14, r2 = R - (i % 3 === 0 ? 44 : 28);
            return (<g key={i}><line x1={cx + r1 * Math.sin(ang)} y1={cy - r1 * Math.cos(ang)} x2={cx + r2 * Math.sin(ang)} y2={cy - r2 * Math.cos(ang)} stroke={RH.ink} strokeWidth={i % 3 === 0 ? 7 : 4} />
              {i % 3 === 0 ? <text x={cx + (R - 80) * Math.sin(ang)} y={cy - (R - 80) * Math.cos(ang) + 14} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={40} fill={RH.ink}>{i * 5}</text> : null}</g>); }) : null}
          <circle cx={cx} cy={cy} r={40} fill="#EDEBE7" stroke="#CFCBC2" strokeWidth={4} />
          <rect x={cx - 12} y={cy - 70} width={24} height={60} rx={10} fill="#E3E0DA" />
          {ding > 0 ? [0, 1, 2].map((i) => <path key={i} d={`M ${120 - i * 30} ${110 - i * 30} q -30 -30 -10 -70`} stroke={RH.yellow} strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - ding * 0.6} />) : null}
        </svg>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 760, translate: "-50% 0", opacity: out * lin(f, 6, 16), display: "flex", gap: 22, alignItems: "center" }}>
        <div style={{ background: RH.yellow, color: RH.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 84, padding: "4px 34px", borderRadius: 14, boxShadow: `0 14px 30px ${RH.shadow}` }}>{overnight ? "Overnight" : `${minutes} ${unit || "minutes"}`}</div>
        {label && !overnight ? <div style={{ background: RH.white, color: RH.blueDeep, fontFamily: HAND, fontWeight: 700, fontSize: 60, padding: "4px 28px", borderRadius: 14, boxShadow: `0 14px 30px ${RH.shadow}` }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
