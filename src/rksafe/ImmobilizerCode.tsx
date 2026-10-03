// ImmobilizerCode.tsx — EL INMOVILIZADOR ESCONDIDO, SOBRE EL TABLERO REAL (canal Ray Kessler, rkkeyless v2).
//
// v2 (3-oct, "componentes flojos"): la foto real del botón START (`bgStart`, botón en `startAt`) y la
// del volante con sus botones (`bgWheel`, `wheelAt`).
//   · fase THIEF — sobre el START real llegan pulsos rojos (el relay), el botón se enciende y... nada:
//     sello NO START.
//   · fase OWNER — corte al volante real: cuatro puntos de luz marcan TU orden secreto (3-1-4-2) sobre
//     los botones, un indicador se completa, y el START se enciende verde: RUNNING.
// ⛔ No muestra cableado ni instalación. Coreografía en FRACCIONES.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };
const ORDEN = [2, 0, 3, 1];

export const ImmobilizerCode: React.FC<{
  mode?: "thief" | "owner" | "both";
  kicker?: string;
  verdict?: string;
  bgStart?: string;
  bgWheel?: string;
  startAt?: [number, number];
  wheelAt?: [number, number];
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "both", kicker = "THE HIDDEN IMMOBILIZER", verdict = "", bgStart, bgWheel, startAt = [58, 35], wheelAt = [52, 46], durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const both = mode === "both";
  const owner = mode === "owner" || (both && t > 0.5);
  const tt = both ? clamp01((owner ? t - 0.5 : t) / 0.48) : t;
  const tag = interpolate(t, [0, 0.07], [0, 1], ease);
  const vA = interpolate(t, [0.9, 0.96], [0, 1], ease);
  const sx = startAt[0] * 19.2, sy = startAt[1] * 10.8;
  if (!owner) {
    const ondas = clamp01((tt - 0.08) / 0.4);
    const press = interpolate(tt, [0.5, 0.58], [0, 1], ease);
    return (
      <AbsoluteFill>
        <WorldBed src={bgStart} push={0.2} fx={startAt[0]} fy={startAt[1]} dim={0.14} durationInFrames={D} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {[0, 1, 2, 3].map((k) => {
            const q = clamp01(ondas * 1.5 - k * 0.15);
            if (q <= 0 || q >= 1) return null;
            const x = 1920 - (1920 - sx) * q;
            return <path key={k} d={`M ${x} ${sy - 60} Q ${x - 40} ${sy} ${x} ${sy + 60}`} stroke={rgba(V.dangerSoft, 1 - q)} strokeWidth={7} fill="none" />;
          })}
          <circle cx={sx} cy={sy} r={70} fill="none" stroke={rgba(V.dangerSoft, press)} strokeWidth={6} />
        </svg>
        <div style={{ position: "absolute", right: 80, top: sy - 160, fontFamily: F_BODY, fontWeight: 700, fontSize: 34, color: V.dangerSoft, opacity: ondas > 0 ? 1 : 0, textShadow: "0 3px 14px rgba(0,0,0,.95)" }}>Key signal: accepted</div>
        <Stamp text="NO START" color={V.dangerSoft} p={clamp01((tt - 0.62) / 0.14)} x={50} y={70} size={110} rot={-6} />
        <Tag kicker={kicker} title="The relay" a={tag} />
      </AbsoluteFill>
    );
  }
  const pulsados = ORDEN.filter((_, i) => tt > 0.1 + i * 0.13).length;
  const wx = wheelAt[0], wy = wheelAt[1];
  const offs = [[-6, -5], [4, -5], [-6, 4], [4, 4]];
  const run = clamp01((tt - 0.68) / 0.12);
  return (
    <AbsoluteFill>
      <WorldBed src={bgWheel} push={0.16} fx={wx} fy={wy} dim={0.12} durationInFrames={D} />
      {ORDEN.slice(0, pulsados).map((b, i) => (
        <Pulse key={i} x={wx + offs[b][0]} y={wy + offs[b][1]} color={V.brassSoft} t={1} r={70} on={i === pulsados - 1 ? 1 : 0.45} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 34, height: 34, borderRadius: 17, border: `4px solid ${V.brassSoft}`, background: i < pulsados ? V.brassSoft : "rgba(0,0,0,.4)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: F_BODY, fontWeight: 700, fontSize: 34, color: V.white, textShadow: "0 3px 14px rgba(0,0,0,.95)" }}>Your secret order</div>
      <Stamp text="RUNNING" color={V.ok} p={run} x={50} y={30} size={110} rot={-5} />
      <Tag kicker={kicker} title="You" a={tag} />
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", opacity: vA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.95)" }}>{verdict}</div>
      ) : null}
    </AbsoluteFill>
  );
};
