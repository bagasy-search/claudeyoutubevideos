// StvCreosoteWarning — el caño POR DENTRO, en corte, con LUPA: a la izquierda el tramo de caño (acero, costura, remaches) con el
// depósito creciendo en las paredes; a la derecha la lupa sobre la pared con las 3 capas (hollín esponjoso → costra escamosa →
// vidrio negro brillante) y una REGLA real en dieciseisavos de pulgada: la capa llega a 1/8 y ahí salta la alarma. Al lado, la
// moneda de 5c + la de 10c de canto (≈ 1/8 de pulgada, a escala de la regla). PAGO: «sweep it at an eighth of an inch».
// `fire`: el vidrio prende (chimney fire) para el aviso de emergencia. Sin texto quemado: todo por props.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { StvBed } from "./StvBed";
import { OLE, LABEL, HAND, woodBg, hexA, rnd } from "./OleTheme";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));

// lupa
const CX = 1230, CY = 480, R = 310;          // círculo
const WX = CX - R + 40;                       // x donde arranca el depósito (pared de acero a la izquierda)
const PX = 230;                               // px por 1/16 de pulgada
const T0 = 26, TMAX = 2 * PX;                 // grosor inicial y límite (1/8" = 2 x 1/16")

export const StvCreosoteWarning: React.FC<{ bed?: string; stages?: string[]; limit?: string; fire?: boolean; coins?: boolean; coinsLabel?: string; rulerLabels?: string[] }> = ({
  bed, stages = ["SOOT", "FLAKY TAR", "BLACK GLAZE"], limit = "1/8 inch: sweep it", fire = false, coins = true, coinsLabel = "nickel + dime", rulerLabels = ["0", "1/16", "1/8"],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, dur = durationInFrames / fps;
  const g = interpolate(t, [0.4, dur * (fire ? 0.62 : 0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const stage = g < 0.34 ? 0 : g < 0.72 ? 1 : 2;
  const alarm = g > 0.95;
  const boil = fire ? c01((t - dur * 0.66) / (dur * 0.1)) : 0;
  const pulse = 0.6 + 0.4 * Math.sin(t * 14);
  const appear = c01(t / 0.5);
  const TH = T0 + (TMAX - T0) * g;                     // grosor en la lupa (px)
  const b1 = T0 + (TMAX - T0) * 0.34, b2 = T0 + (TMAX - T0) * 0.72;
  const soot = Math.min(TH, b1), flaky = Math.max(0, Math.min(TH, b2) - b1), glaze = Math.max(0, TH - b2);
  // caño (izquierda)
  const PX0 = 120, PW = 360, WALL = 30, PY0 = 0, PY1 = 1080;
  const thp = 6 + 70 * g;
  const inL = PX0 + WALL, inR = PX0 + PW - WALL;
  const wobble = (i: number, y: number) => Math.sin(y * 0.045 + i * 2.1) * 4 + Math.sin(y * 0.13 + i) * 2.5;
  const edge = (side: 0 | 1) => {
    let d = "";
    for (let y = PY0; y <= PY1; y += 24) { const x = side ? inR - thp - wobble(7, y) * (0.5 + g) : inL + thp + wobble(3, y) * (0.5 + g); d += `${d ? "L" : "M"}${x} ${y} `; }
    return d;
  };
  const edgeL = edge(0), edgeR = edge(1);
  const layerColor = stage === 0 ? "#57524C" : stage === 1 ? "#2C2622" : "#0C0B0B";
  const layerFillL = `${edgeL}L${inL} ${PY1} L${inL} ${PY0} Z`, layerFillR = `${edgeR}L${inR} ${PY1} L${inR} ${PY0} Z`;
  const flakes = Array.from({ length: 30 }, (_, i) => ({ y: 80 + rnd(i * 3) * (PY1 - 160), side: i % 2, w: 12 + rnd(i * 3 + 1) * 26, h: 8 + rnd(i * 3 + 2) * 18, a: (rnd(i) - 0.5) * 50 }));
  // lupa: flecos y brillos
  const fluff = Array.from({ length: 46 }, (_, i) => ({ y: CY - R + 20 + rnd(i * 7) * (2 * R - 40), x: WX + 6 + rnd(i * 7 + 1) * (soot - 10), r: 6 + rnd(i * 7 + 2) * 14 }));
  const curls = Array.from({ length: 18 }, (_, i) => ({ y: CY - R + 50 + rnd(i * 5 + 3) * (2 * R - 100), x: WX + b1 + rnd(i * 5 + 4) * Math.max(6, flaky - 14), w: 34 + rnd(i * 5 + 5) * 50, a: (rnd(i * 5 + 6) - 0.5) * 70 }));
  const rx0 = WX + 0; // regla parte del inicio del depósito
  const RY = 900;
  const limitX = WX + TMAX;
  return (
    <AbsoluteFill style={bed ? undefined : woodBg("#B98C5A")}>
      {bed ? <StvBed src={bed} cream={0.62} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 40%, ${hexA("#FFF4DE", 0.5)}, transparent 65%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="stl" x1="0" x2="1"><stop offset="0" stopColor="#1e1d1c" /><stop offset="0.22" stopColor="#6a6c6e" /><stop offset="0.4" stopColor="#3b3c3d" /><stop offset="1" stopColor="#151515" /></linearGradient>
          <linearGradient id="flue" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#151210" /><stop offset="1" stopColor={boil > 0 ? "#6a2a0c" : "#241c16"} /></linearGradient>
          <linearGradient id="glz" x1="0" x2="1"><stop offset="0" stopColor="#000" /><stop offset="0.5" stopColor="#1d1d1f" /><stop offset="1" stopColor="#000" /></linearGradient>
          <radialGradient id="fireg" cx="0.5" cy="1" r="0.8"><stop offset="0" stopColor="#FFD27A" stopOpacity="0.95" /><stop offset="0.5" stopColor="#FF7A20" stopOpacity="0.6" /><stop offset="1" stopColor="#FF7A20" stopOpacity="0" /></radialGradient>
          <clipPath id="lupa"><circle cx={CX} cy={CY} r={R} /></clipPath>
          <clipPath id="flueclip"><rect x={inL} y={PY0} width={inR - inL} height={PY1} /></clipPath>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.4" /></filter>
        </defs>

        {/* ── CAÑO (izquierda) ── */}
        <g opacity={appear} filter="url(#sh)">
          <rect x={PX0} y={PY0} width={PW} height={PY1} fill="url(#stl)" />
          <rect x={inL} y={PY0} width={inR - inL} height={PY1} fill="url(#flue)" />
          <g clipPath="url(#flueclip)">
            <path d={layerFillL} fill={layerColor} /><path d={layerFillR} fill={layerColor} />
            {stage === 2 ? <><path d={edgeL} stroke="#666" strokeWidth="3" fill="none" opacity="0.55" /><path d={edgeR} stroke="#666" strokeWidth="3" fill="none" opacity="0.55" /></> : null}
            {stage >= 1 ? flakes.map((f, i) => <rect key={i} x={f.side ? inR - thp - f.w * 0.7 : inL + thp - 2} y={f.y} width={f.w * 0.7} height={f.h} rx="3" fill="#15110f" transform={`rotate(${f.a} ${f.side ? inR - thp : inL + thp} ${f.y})`} />) : null}
            {Array.from({ length: 10 }, (_, i) => { const u = (t * 0.3 + rnd(i * 5)) % 1; return <ellipse key={i} cx={(inL + inR) / 2 + Math.sin(u * 8 + i) * 40} cy={PY1 - u * PY1} rx={30 + 34 * u} ry={22 + 26 * u} fill={hexA("#8B867F", 0.26 * (1 - u))} />; })}
            {boil > 0 ? <rect x={inL} y={PY0} width={inR - inL} height={PY1} fill={hexA("#FF7A20", 0.5 * boil * pulse)} /> : null}
            {boil > 0 ? Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={(inL + inR) / 2 + Math.sin(t * 9 + i * 1.7) * 26} cy={60 + i * 120 + Math.sin(t * 7 + i) * 18} rx={34} ry={84} fill={hexA("#FFC050", 0.72 * boil)} />) : null}
          </g>
          {/* costura y remaches */}
          <line x1={PX0 + 12} y1={PY0} x2={PX0 + 12} y2={PY1} stroke="#9b9da0" strokeWidth="2" opacity="0.5" />
          {Array.from({ length: 10 }, (_, i) => <g key={i}><circle cx={PX0 + 12} cy={60 + i * 110} r="4" fill="#8f9194" /><circle cx={PX0 + PW - 14} cy={60 + i * 110} r="4" fill="#5d5f61" /></g>)}
          <rect x={PX0} y={PY0} width={PW} height={PY1} fill="none" stroke="#0a0a0a" strokeWidth="5" />
          {/* anillo de inspección */}
          <circle cx={inL + thp / 2} cy={CY + 60} r={44 + 4 * pulse} fill="none" stroke={alarm ? "#B3261E" : OLE.fire} strokeWidth="6" strokeDasharray="14 10" />
        </g>
        <path d={`M${inL + thp / 2 + 30} ${CY + 28} L${CX - R * Math.cos(0.55) + 4} ${CY - R * Math.sin(0.55)} M${inL + thp / 2 + 30} ${CY + 92} L${CX - R * Math.cos(0.55) + 4} ${CY + R * Math.sin(0.55)}`} stroke={hexA(OLE.iron, 0.55)} strokeWidth="4" strokeDasharray="10 8" fill="none" opacity={appear} />

        {/* ── LUPA ── */}
        <g opacity={appear} filter="url(#sh)">
          <circle cx={CX} cy={CY} r={R + 14} fill="#2A2725" />
          <circle cx={CX} cy={CY} r={R + 4} fill="#8a6a3c" />
        </g>
        <g clipPath="url(#lupa)" opacity={appear}>
          <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="url(#flue)" />
          {boil > 0 ? <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="url(#fireg)" opacity={boil * pulse} /> : null}
          {/* pared de acero */}
          <rect x={CX - R} y={CY - R} width={WX - (CX - R)} height={2 * R} fill="url(#stl)" />
          <rect x={WX - 8} y={CY - R} width="8" height={2 * R} fill="#0a0a0a" />
          {/* capa 1: hollín */}
          <rect x={WX} y={CY - R} width={soot} height={2 * R} fill="#5a554f" />
          {fluff.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={i % 3 ? "#6b665f" : "#4a4641"} opacity="0.85" />)}
          {/* capa 2: costra escamosa */}
          {flaky > 0 ? <rect x={WX + b1} y={CY - R} width={flaky} height={2 * R} fill="#2b2521" /> : null}
          {flaky > 0 ? curls.map((c, i) => <path key={i} d={`M${c.x} ${c.y} q${c.w * 0.4} -18 ${c.w * 0.8} 4`} stroke="#4a3f36" strokeWidth="6" fill="none" strokeLinecap="round" transform={`rotate(${c.a} ${c.x} ${c.y})`} />) : null}
          {/* capa 3: vidrio negro brillante */}
          {glaze > 0 ? <><rect x={WX + b2} y={CY - R} width={glaze} height={2 * R} fill="url(#glz)" /><rect x={WX + b2 + glaze * 0.3} y={CY - R} width="9" height={2 * R} fill="#fff" opacity="0.18" /><rect x={WX + b2 + glaze * 0.65} y={CY - R} width="4" height={2 * R} fill="#fff" opacity="0.12" /></> : null}
          {boil > 0 ? Array.from({ length: 14 }, (_, i) => <circle key={i} cx={WX + TH + 20 + ((t * 120 + i * 57) % 160)} cy={CY - R + 30 + rnd(i) * (2 * R - 60)} r={3 + rnd(i + 9) * 4} fill="#FFC050" opacity={boil * (0.4 + 0.6 * Math.sin(t * 10 + i) ** 2)} />) : null}
          {/* línea del límite 1/8" */}
          <line x1={limitX} y1={CY - R} x2={limitX} y2={CY + R} stroke="#B3261E" strokeWidth="5" strokeDasharray="16 10" opacity={0.35 + 0.65 * c01((g - 0.6) / 0.3)} />
          {/* brillo del cristal */}
          <ellipse cx={CX - 120} cy={CY - 190} rx="170" ry="64" fill="#fff" opacity="0.08" transform={`rotate(-28 ${CX - 120} ${CY - 190})`} />
        </g>

        {/* ── REGLA ── */}
        <g opacity={appear}>
          <rect x={rx0 - 30} y={RY} width={TMAX + 60} height="46" rx="6" fill="#E8D7AE" stroke={OLE.iron} strokeWidth="3" />
          {Array.from({ length: 3 }, (_, i) => <g key={i}><line x1={rx0 + i * PX} y1={RY} x2={rx0 + i * PX} y2={RY + (i === 2 ? 36 : 28)} stroke={OLE.iron} strokeWidth={i === 2 ? 5 : 3} /><text x={rx0 + i * PX} y={RY + 78} textAnchor="middle" fontFamily={LABEL} fontSize="34" fill={i === 2 && alarm ? "#B3261E" : OLE.pencil}>{rulerLabels[i]}</text></g>)}
          {[0.5, 1.5].map((k) => <line key={k} x1={rx0 + k * PX} y1={RY} x2={rx0 + k * PX} y2={RY + 18} stroke={OLE.iron} strokeWidth="2" />)}
          {/* la capa medida (se ve crecer) */}
          <rect x={rx0} y={RY - 26} width={Math.max(2, TH)} height="20" rx="3" fill={alarm ? "#B3261E" : layerColor} stroke={OLE.iron} strokeWidth="2" />
          {/* monedas de canto, a la misma escala: ~1/8" = nickel (2 mm) + dime (1,35 mm) */}
          {coins ? (
            <g transform={`translate(${rx0},${RY - 100})`} opacity={c01(g * 4)}>
              <rect x="0" y="0" width={TMAX * 0.59} height="62" rx="5" fill="#C9CDD2" stroke="#7d8288" strokeWidth="3" />
              <rect x={TMAX * 0.59} y="0" width={TMAX * 0.41} height="62" rx="5" fill="#B7BCC2" stroke="#7d8288" strokeWidth="3" />
              <text x={TMAX + 24} y="44" fontFamily={HAND} fontSize="38" fill={OLE.pencil}>{coinsLabel}</text>
            </g>
          ) : null}
        </g>

        {/* ── ETAPAS / ALARMA ── */}
        {!alarm ? stages.map((s, i) => {
          const on = i === stage, done = i < stage;
          return (
            <g key={i} transform={`translate(${640 + i * 330},34)`} opacity={appear}>
              <rect x="0" y="0" width="300" height="74" rx="37" fill={on ? OLE.iron : hexA(OLE.cream, 0.85)} stroke={on ? OLE.fire : OLE.ironL} strokeWidth={on ? 5 : 3} />
              <circle cx="38" cy="37" r="14" fill={done ? OLE.forest : on ? OLE.fire : "transparent"} stroke={on ? OLE.fire : OLE.mute} strokeWidth="3" />
              <text x="168" y="50" textAnchor="middle" fontFamily={LABEL} fontSize="34" letterSpacing="3" fill={on ? OLE.cream : OLE.pencil}>{s.toUpperCase()}</text>
            </g>
          );
        }) : (
          <g transform={`translate(640,28)`}>
            <rect x="0" y="0" width="980" height="96" rx="12" fill="#B3261E" opacity={0.75 + 0.25 * pulse} />
            {Array.from({ length: 10 }, (_, i) => <polygon key={i} points={`${i * 98},0 ${i * 98 + 34},0 ${i * 98 - 10},96 ${i * 98 - 44},96`} fill="#000" opacity="0.18" />)}
            <text x="490" y="68" textAnchor="middle" fontFamily={LABEL} fontSize="64" letterSpacing="6" fill="#FFF6E8">{limit.toUpperCase()}</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
export default StvCreosoteWarning;
