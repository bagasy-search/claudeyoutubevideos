// StvCreosoteWarning — el caño POR DENTRO, en corte: la creosota crece por capas (hollín → costra escamosa → vidrio negro brillante)
// hasta el grosor de 1/8 de pulgada (una moneda de 5c + una de 10c apiladas) y ahí se dispara la alarma. PAGO: «sweep it at an eighth of an inch».
// Props: stage labels y unidad por props (sin texto quemado). `fire`: al final el vidrio prende (chimney fire) para el aviso de emergencia.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { StvBed } from "./StvBed";
import { OLE, LABEL, HAND, woodBg, hexA, rnd } from "./OleTheme";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));

export const StvCreosoteWarning: React.FC<{ bed?: string;  stages?: string[]; limit?: string; fire?: boolean; coins?: boolean; coinsLabel?: string }> = ({ bed, stages = ["SOOT", "FLAKY TAR", "BLACK GLAZE"], limit = "1/8 inch: sweep it", fire = false, coins = true, coinsLabel = "nickel + dime" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;
  const g = interpolate(t, [0.4, dur * (fire ? 0.62 : 0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const stage = g < 0.34 ? 0 : g < 0.72 ? 1 : 2;
  const th = 14 + 96 * g;
  const boil = fire ? c01((t - dur * 0.66) / (dur * 0.1)) : 0;
  const pulse = 0.6 + 0.4 * Math.sin(t * 14);
  const X0 = 560, W = 360, H0 = 40, H1 = 1040;
  const flakes = Array.from({ length: 34 }, (_, i) => ({ y: H0 + 60 + rnd(i * 3) * (H1 - H0 - 120), side: i % 2, w: 10 + rnd(i * 3 + 1) * 26, h: 8 + rnd(i * 3 + 2) * 18 }));
  const layerFill = stage === 0 ? "#4a4642" : stage === 1 ? "#26221f" : "#0b0a0a";
  return (
    <AbsoluteFill style={bed ? undefined : woodBg("#B98C5A")}>
      {bed ? <StvBed src={bed} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 45%, ${hexA("#FFF4DE", 0.55)}, transparent 62%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stopColor="#000" /><stop offset="0.4" stopColor="#3a3a3a" /><stop offset="0.5" stopColor="#111" /><stop offset="1" stopColor="#000" /></linearGradient></defs>
        <rect x={X0 - 30} y={H0} width={W + 60} height={H1 - H0} fill="#2A2725" stroke="#0a0a0a" strokeWidth="6" />
        <rect x={X0} y={H0} width={W} height={H1 - H0} fill="#F4E8CF" />
        <rect x={X0} y={H0} width={th} height={H1 - H0} fill={layerFill} />
        <rect x={X0 + W - th} y={H0} width={th} height={H1 - H0} fill={layerFill} />
        {stage === 2 ? <><rect x={X0 + th - 10} y={H0} width="10" height={H1 - H0} fill="url(#gl)" opacity="0.9" /><rect x={X0 + W - th} y={H0} width="10" height={H1 - H0} fill="url(#gl)" opacity="0.9" /></> : null}
        {stage >= 1 ? flakes.map((f, i) => <rect key={i} x={f.side ? X0 + W - th - f.w * 0.6 : X0 + th - 2} y={f.y} width={f.w * 0.6} height={f.h} rx="3" fill="#15110f" transform={`rotate(${(rnd(i) - 0.5) * 30} ${X0} ${f.y})`} />) : null}
        {Array.from({ length: 12 }, (_, i) => { const u = ((t * 0.35 + rnd(i * 5)) % 1); return <ellipse key={i} cx={X0 + W / 2 + Math.sin(u * 8 + i) * (W / 2 - th - 24) * 0.6} cy={H1 - u * (H1 - H0)} rx={26 + 30 * u} ry={20 + 24 * u} fill={hexA("#6E6A65", 0.32 * (1 - u))} />; })}
        {boil > 0 ? <rect x={X0 + th} y={H0} width={W - 2 * th} height={H1 - H0} fill={hexA("#FF7A20", 0.55 * boil * pulse)} /> : null}
        {boil > 0 ? Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={X0 + W / 2 + Math.sin(t * 9 + i) * 30} cy={H0 + 80 + i * 120} rx={40} ry={90} fill={hexA("#FFC050", 0.7 * boil)} />) : null}
        {coins ? (
          <g transform={`translate(${X0 + W + 120},${500})`} opacity={c01(g * 4)}>
            <g transform="translate(0,-92)">
              <rect x="0" y="0" width={th} height="184" fill={layerFill} stroke={OLE.iron} strokeWidth="3" />
              <line x1={th + 30} y1="0" x2={th + 30} y2="184" stroke={OLE.iron} strokeWidth="4" />
              <line x1={th + 20} y1="0" x2={th + 40} y2="0" stroke={OLE.iron} strokeWidth="4" /><line x1={th + 20} y1="184" x2={th + 40} y2="184" stroke={OLE.iron} strokeWidth="4" />
            </g>
            <g transform={`translate(${th + 90},-40)`}>
              <rect x="0" y="0" width="118" height="20" rx="3" fill="#C9CDD2" stroke="#7d8288" strokeWidth="3" /><rect x="6" y="20" width="106" height="14" rx="3" fill="#B7BCC2" stroke="#7d8288" strokeWidth="3" />
              <text x="59" y="72" textAnchor="middle" fontFamily={HAND} fontSize="34" fill={OLE.pencil}>{coinsLabel}</text>
            </g>
          </g>
        ) : null}
        <text x="1290" y="900" textAnchor="middle" fontFamily={LABEL} fontSize="54" letterSpacing="6" fill={g > 0.95 ? "#B3261E" : OLE.iron}>{(g > 0.95 ? limit : stages[stage]).toUpperCase()}</text>
      </svg>
    </AbsoluteFill>
  );
};
export default StvCreosoteWarning;
