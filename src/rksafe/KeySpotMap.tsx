// KeySpotMap.tsx — DÓNDE DEJAR LA LLAVE EN LA CASA (canal Ray Kessler, rkkeyless).
//
// Plano de la casa visto desde arriba, dibujado trazo a trazo. La llave aparece en un lugar y su
// "alcance" (pocos pies) se expande:
//   · spot="door"   — el bol junto a la puerta: el alcance SALE de la casa y toca el porche (rojo).
//   · spot="center" — el medio de la casa / arriba: el alcance queda adentro (verde).
//   · spot="move"   — empieza en la puerta y la llave se MUDA al centro (la comparación que se transforma).
// ⛔ Coreografía en FRACCIONES de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };

export const KeySpotMap: React.FC<{
  spot?: "door" | "center" | "move";
  kicker?: string;
  verdict?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ spot = "move", kicker = "WHERE THE KEY SLEEPS", verdict = "", bed, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const dibujo = interpolate(t, [0.02, 0.3], [0, 1], ease);
  const L = 3600; // largo aprox. de los trazos para el dash
  const puerta = { x: 700, y: 820 }, centro = { x: 1080, y: 480 };
  const mudanza = spot === "move" ? interpolate(t, [0.55, 0.72], [0, 1], ease) : spot === "center" ? 1 : 0;
  const kx = puerta.x + (centro.x - puerta.x) * mudanza, ky = puerta.y + (centro.y - puerta.y) * mudanza;
  const rA = interpolate(t, spot === "move" ? [0.3, 0.45] : [0.3, 0.5], [0, 1], ease);
  const fuera = mudanza < 0.5;
  const col = fuera ? V.danger : V.ok;
  const vA = interpolate(t, [0.82, 0.9], [0, 1], ease);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.88} />
      <div style={{ position: "absolute", left: 96, top: 60, opacity: clamp01(t * 12), fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* paredes exteriores e interiores (plano) */}
        <path d="M 460 200 L 1460 200 L 1460 860 L 760 860 M 640 860 L 460 860 L 460 200 M 900 200 L 900 560 L 460 560 M 1180 560 L 1460 560 M 900 700 L 900 860"
          stroke={V.bone} strokeWidth={8} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - dibujo)} strokeLinecap="square" />
        {/* porche y vereda */}
        <rect x={560} y={870} width={280} height={90} fill={rgba(V.bone, 0.08 * dibujo)} stroke={rgba(V.bone, 0.5 * dibujo)} strokeWidth={3} />
        <text x={700} y={930} textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize={28} fill={rgba(V.bone, dibujo)}>PORCH</text>
        {/* alcance de la llave */}
        <circle cx={kx} cy={ky} r={30 + 170 * rA} fill={rgba(col, 0.16 * rA)} stroke={rgba(col, 0.9 * rA)} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-frame * 2} />
        {/* la llave */}
        <g transform={`translate(${kx} ${ky})`} opacity={clamp01((t - 0.24) * 10)}>
          <rect x={-18} y={-28} width={36} height={56} rx={12} fill="#2B2B30" stroke={V.brassSoft} strokeWidth={3} />
          <circle cx={0} cy={-8} r={6} fill={V.brassSoft} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1520, top: 380, width: 340, opacity: rA }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, color: fuera ? V.dangerSoft : V.ok }}>{fuera ? "BOWL BY THE DOOR" : "MIDDLE OF THE HOUSE"}</div>
        <div style={{ fontFamily: F_BODY, fontSize: 30, color: V.bone, marginTop: 8 }}>{fuera ? "Reach spills onto the porch" : "Reach stays inside"}</div>
      </div>
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", opacity: vA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.9)" }}>{verdict}</div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
