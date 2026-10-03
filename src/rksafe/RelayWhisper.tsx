// RelayWhisper.tsx — CÓMO "HABLA" UNA LLAVE SIN LLAVE (canal Ray Kessler, rkkeyless).
//
// Casa a la izquierda (la llave en la mesa de la cocina), auto a la derecha.
//   · mode="normal" — el auto pregunta "is my key here?" con ondas cortas; el alcance de la llave
//     (un círculo de pocos pies) NO llega al auto: el candado del auto queda cerrado.
//   · mode="relay"  — aparecen dos cajitas (una junto a la casa, otra junto al auto) y la respuesta
//     viaja de caja en caja como un "alargue de radio": el auto se destraba.
// ⛔ Encuadre DEFENSIVO: las cajas son genéricas, sin antenas ni detalle técnico; explica POR QUÉ funciona.
// ⛔ Toda la coreografía va en FRACCIONES de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

const Onda: React.FC<{ x0: number; x1: number; y: number; p: number; color: string; dir?: 1 | -1 }> = ({ x0, x1, y, p, color, dir = 1 }) => (
  <>
    {[0, 1, 2].map((k) => {
      const q = clamp01(p * 1.4 - k * 0.2);
      if (q <= 0 || q >= 1) return null;
      const x = x0 + (x1 - x0) * q;
      return <path key={k} d={`M ${x} ${y - 34} Q ${x + 26 * dir} ${y} ${x} ${y + 34}`} stroke={rgba(color, 1 - q * 0.7)} strokeWidth={6} fill="none" strokeLinecap="round" />;
    })}
  </>
);

const Caja: React.FC<{ x: number; y: number; a: number; on: boolean }> = ({ x, y, a, on }) => (
  <g opacity={a} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * a})`}>
    <rect x={-34} y={-24} width={68} height={48} rx={8} fill={V.ink2} stroke={on ? V.danger : V.bone} strokeWidth={3} />
    <circle cx={18} cy={-8} r={5} fill={on ? V.dangerSoft : "#444"} />
  </g>
);

export const RelayWhisper: React.FC<{
  mode?: "normal" | "relay";
  kicker?: string;
  verdict?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "relay", kicker = "HOW THE KEY TALKS", verdict = "", bed, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const relay = mode === "relay";
  const intro = interpolate(t, [0, 0.1], [0, 1], ease);
  const pregunta = clamp01((t - 0.12) / 0.16);            // el auto pregunta
  const rango = interpolate(t, [0.18, 0.32], [0, 1], ease); // alcance de la llave
  const cajas = relay ? interpolate(t, [0.34, 0.44], [0, 1], ease) : 0;
  const tramo1 = relay ? clamp01((t - 0.46) / 0.1) : 0;   // llave → caja casa
  const tramo2 = relay ? clamp01((t - 0.56) / 0.12) : 0;  // caja casa → caja auto
  const tramo3 = relay ? clamp01((t - 0.68) / 0.08) : 0;  // caja auto → auto
  const abierto = relay && t > 0.77;
  const vA = interpolate(t, [0.82, 0.9], [0, 1], ease);
  const HX = 430, CX = 1490, Y = 560, KEYX = HX + 40, KEYY = Y + 40;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.86} />
      <div style={{ position: "absolute", left: 96, top: 70, opacity: intro, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* casa */}
        <g opacity={intro}>
          <path d={`M ${HX - 230} ${Y - 60} L ${HX} ${Y - 250} L ${HX + 230} ${Y - 60} Z`} fill={V.ink2} stroke={V.bone} strokeWidth={4} />
          <rect x={HX - 200} y={Y - 60} width={400} height={300} fill={V.ink1} stroke={V.bone} strokeWidth={4} />
          <rect x={HX - 160} y={Y + 70} width={70} height={170} fill={V.ink2} stroke={V.bone} strokeWidth={3} />
          <rect x={HX - 10} y={Y + 70} width={190} height={14} fill={rgba(V.bone, 0.5)} />
        </g>
        {/* la llave en la mesa */}
        <g opacity={intro} transform={`translate(${KEYX} ${KEYY})`}>
          <rect x={-22} y={-34} width={44} height={68} rx={14} fill="#2B2B30" stroke={V.brassSoft} strokeWidth={3} />
          <circle cx={0} cy={-12} r={7} fill={pregunta > 0.5 ? V.brassSoft : "#555"} />
          <rect x={-10} y={6} width={20} height={10} rx={3} fill="#555" />
        </g>
        {/* alcance real de la llave: pocos pies */}
        <circle cx={KEYX} cy={KEYY} r={40 + 150 * rango} fill={rgba(V.brass, 0.08 * rango)} stroke={rgba(V.brass, 0.7 * rango)} strokeWidth={3} strokeDasharray="10 10" />
        {/* auto */}
        <g opacity={intro} transform={`translate(${CX} ${Y + 120})`}>
          <path d="M -230 40 L -200 -40 Q -150 -110 -40 -116 L 90 -116 Q 170 -110 210 -40 L 240 40 Z" fill={V.ink2} stroke={V.bone} strokeWidth={4} />
          <rect x={-250} y={30} width={510} height={70} rx={20} fill={V.ink1} stroke={V.bone} strokeWidth={4} />
          <circle cx={-140} cy={104} r={38} fill={V.ink0} stroke={V.bone} strokeWidth={4} />
          <circle cx={150} cy={104} r={38} fill={V.ink0} stroke={V.bone} strokeWidth={4} />
          {/* candado del auto */}
          <g transform="translate(0 -40)">
            <path d={abierto ? "M -16 -8 L -16 -34 Q -16 -52 2 -52 Q 20 -52 20 -40" : "M -16 -8 L -16 -30 Q -16 -48 0 -48 Q 16 -48 16 -30 L 16 -8"} stroke={abierto ? V.dangerSoft : V.ok} strokeWidth={6} fill="none" />
            <rect x={-24} y={-10} width={48} height={38} rx={6} fill={abierto ? V.danger : V.ok} />
          </g>
        </g>
        {/* el auto pregunta: ondas cortas hacia la casa */}
        <Onda x0={CX - 270} x1={CX - 520} y={Y + 40} p={pregunta} color={V.bone} dir={-1} />
        {/* relay: cajas y tramos */}
        {relay ? (
          <>
            <Caja x={HX + 290} y={Y + 210} a={cajas} on={tramo1 > 0} />
            <Caja x={CX - 330} y={Y + 210} a={cajas} on={tramo2 > 0} />
            <Onda x0={KEYX + 40} x1={HX + 250} y={Y + 140} p={tramo1} color={V.brassSoft} />
            <line x1={HX + 330} y1={Y + 210} x2={HX + 330 + (CX - 330 - HX - 330 - 40) * tramo2} y2={Y + 210} stroke={V.danger} strokeWidth={6} strokeDasharray="18 12" strokeDashoffset={-frame * 3} />
            <Onda x0={CX - 300} x1={CX - 240} y={Y + 150} p={tramo3} color={V.dangerSoft} />
          </>
        ) : null}
      </svg>
      {/* rótulos */}
      <div style={{ position: "absolute", left: KEYX - 140, top: KEYY + 250, width: 280, textAlign: "center", opacity: rango, fontFamily: F_BODY, fontSize: 28, color: V.brassSoft }}>
        Reaches a few feet
      </div>
      <div style={{ position: "absolute", left: CX - 300, top: Y - 150, width: 600, textAlign: "center", opacity: pregunta, fontFamily: F_DISPLAY, fontSize: 40, color: V.white }}>
        "Is my key here?"
      </div>
      {relay ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: Y + 280, textAlign: "center", opacity: tramo2, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 36, letterSpacing: 2, color: V.dangerSoft }}>
          A RADIO EXTENSION CORD
        </div>
      ) : null}
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: vA, transform: `translateY(${(1 - vA) * 20}px)`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.9)" }}>{verdict}</div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
