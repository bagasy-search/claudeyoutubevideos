// Kit "LOS 5 LUGARES" (Claudio el Fumigador ep. 7 furatones5, vlog continuo): ClCasa5 = la casa de los Ramírez vista desde arriba
// sobre una hoja de papel apoyada en la cama (cuadro del vlog), el haz de la linterna barriendo el plano, y los 5 lugares por donde
// entra el ratón numerados: los que ya se taparon tienen ✓ verde; `to` > `from` = se tachan DURANTE el componente; `focus` late en rojo.
// Movimiento continuo (acercamiento lento + haz + latido): nunca congelado.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, HAND, clamp01, ease } from "./ClTheme";
import { Bed, Card, pop, useOut } from "./ClParts";

const PINS: { n: number; x: number; y: number; t: string; lx: number; ly: number }[] = [
  { n: 1, x: 640, y: 590, t: "PUERTAS", lx: 600, ly: 640 },
  { n: 2, x: 330, y: 150, t: "CAÑOS", lx: 380, ly: 165 },
  { n: 3, x: 60, y: 330, t: "REJILLAS", lx: -40, ly: 410 },
  { n: 4, x: 420, y: 470, t: "CABLES", lx: 330, ly: 380 },
  { n: 5, x: 1030, y: 250, t: "GARAJE", lx: 920, ly: 140 },
];

export const ClCasa5: React.FC<{ from?: number; to?: number; focus?: number; title?: string; note?: string; bed?: string }> = ({ from = 0, to, focus, title = "LOS 5 LUGARES", note = "si entra la moneda, entra el ratón", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const end = to ?? from;
  const pin = pop(f, fps, 2, 14);
  const draw = ease(clamp01((f - 4) / 22));                                // las paredes se dibujan
  const push = 1 + 0.045 * (f / T);                                         // acercamiento continuo
  const beamX = 120 + 960 * (0.5 + 0.5 * Math.sin(f / 26)), beamY = 330 + 170 * Math.sin(f / 37);
  const checkAt = (n: number) => n <= from ? -1 : n <= end ? 20 + ((n - from - 1) / Math.max(1, end - from)) * (T * 0.62) : Infinity;
  const W = 1180, H = 660;
  const wall = { stroke: CL.ink, strokeWidth: 9, fill: "none", strokeLinejoin: "round" as const, strokeDasharray: 4200, strokeDashoffset: 4200 * (1 - draw) };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={77} dim={0.34} />
      <div style={{ position: "absolute", left: 960, top: 560, translate: `-50% -50%`, scale: String((0.82 + 0.18 * pin) * push), rotate: `${-1.6 + 1.2 * pin}deg` }}>
        <Card style={{ width: W + 140, padding: "34px 70px 40px", background: "#FFFDF6" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginBottom: 10 }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: CL.navy, letterSpacing: 3 }}>{title}</div>
            <div style={{ fontFamily: HAND, fontSize: 52, color: CL.red, rotate: "-2deg" }}>{note}</div>
          </div>
          <svg width={W} height={H} viewBox={`-60 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="beam5"><stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.85" /><stop offset="60%" stopColor="#FFE680" stopOpacity="0.25" /><stop offset="100%" stopColor="#FFE680" stopOpacity="0" /></radialGradient>
              <pattern id="leaf5" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#E9E4D3" /><path d="M8 12 q6 -6 12 0 q-6 6 -12 0z M26 30 q6 -6 12 0 q-6 6 -12 0z" fill="#C9A35C" opacity="0.6" /></pattern>
            </defs>
            {/* patio lateral (afuera) */}
            <rect x={-40} y={60} width={80} height={520} fill="url(#leaf5)" stroke="#B9B19A" strokeWidth={2} strokeDasharray="10 8" />
            {/* casa */}
            <path d="M40 60 H 880 V 600 H 40 Z" {...wall} />
            <path d="M40 300 H 560 M560 60 V 600 M300 300 V 600" {...wall} strokeWidth={6} />
            {/* garaje y lavadero */}
            <path d="M880 60 H 1120 V 600 H 880" {...wall} />
            <path d="M880 470 H 1120" {...wall} strokeWidth={6} />
            <g opacity={draw} fontFamily={LABEL} fontSize={30} fill={CL.inkSoft} letterSpacing={2}>
              <text x={180} y={120}>COCINA</text><text x={620} y={120}>COMEDOR</text><text x={80} y={560}>SALA</text>
              <text x={330} y={560}>ENTRADA</text><text x={620} y={420}>PASILLO</text><text x={900} y={530}>LAVADERO</text>
              <text x={-30} y={40} fontSize={24}>PATIO</text>
            </g>
            {/* puerta de entrada y del patio, caños, rejilla, cable, calentador */}
            <g opacity={draw} stroke={CL.navy} strokeWidth={5} fill="none">
              <path d="M600 600 h 80" stroke="#FFFDF6" strokeWidth={12} /><path d="M600 600 a 80 80 0 0 1 80 -80" />
              <path d="M150 60 h 120" stroke="#2F6FB0" strokeWidth={8} /><circle cx={330} cy={76} r={10} fill="#E0B020" stroke="none" />
              <rect x={30} y={300} width={22} height={60} fill="#9BA3AE" stroke="none" />
              <path d="M420 300 v 40" stroke="#555" strokeWidth={4} strokeDasharray="6 5" />
              <circle cx={1080} cy={250} r={26} fill="#F4F4F4" stroke={CL.ink} strokeWidth={3} />
            </g>
            <ellipse cx={beamX} cy={beamY} rx={230} ry={150} fill="url(#beam5)" style={{ mixBlendMode: "multiply" }} />
            {PINS.map((p, i) => {
              const ap = pop(f, fps, 10 + i * 5, 12), ca = checkAt(p.n), ck = ca < 0 ? 1 : ease(clamp01((f - ca) / 14));
              const isF = focus === p.n && ck < 0.5, beat = isF ? 1 + 0.14 * Math.abs(Math.sin(f / 7)) : 1;
              const done = ck > 0.02, col = done ? CL.nitrile : isF ? CL.red : CL.navy;
              return (
                <g key={p.n} transform={`translate(${p.x} ${p.y}) scale(${ap * beat})`}>
                  <circle r={40} fill={col} stroke="#fff" strokeWidth={6} />
                  {done ? <path d="M-17 2 L-5 15 L19 -13" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - ck)} />
                    : <text textAnchor="middle" y={15} fontFamily={LABEL} fontWeight={700} fontSize={44} fill="#fff">{p.n}</text>}
                  <g transform={`translate(${p.lx - p.x} ${p.ly - p.y})`}>
                    <rect x={-6} y={-30} width={p.t.length * 25 + 26} height={42} rx={8} fill="#fff" stroke={col} strokeWidth={3} />
                    <text x={5} y={2} fontFamily={LABEL} fontWeight={700} fontSize={30} fill={col} letterSpacing={2} textDecoration={done ? "line-through" : undefined}>{p.t}</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
