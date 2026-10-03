// ImmobilizerCode.tsx — EL INMOVILIZADOR ESCONDIDO (canal Ray Kessler, rkkeyless).
//
// Un tablero estilizado: botón START, cuatro botones del volante y un medidor de "motor".
//   · mode="thief" — llegan las ondas de la llave (el relay), el auto las acepta, pero al tocar START
//     el medidor no sube y aparece "NO START": el inmovilizador no escucha a la llave.
//   · mode="owner" — el dueño marca su secuencia (los botones se encienden en SU orden: 3-1-4-2),
//     se completan los puntos del código y el medidor sube: "RUNNING".
//   · mode="both"  — primero thief y después owner (la comparación que se transforma).
// ⛔ No muestra cableado ni instalación; ≤12 palabras de texto. Coreografía en FRACCIONES.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };
const ORDEN = [2, 0, 3, 1];

const Tablero: React.FC<{ t: number; owner: boolean; frame: number }> = ({ t, owner, frame }) => {
  const ondas = !owner ? clamp01((t - 0.08) / 0.22) : 0;
  const pulsados = owner ? ORDEN.filter((_, i) => t > 0.12 + i * 0.12).length : 0;
  const start = interpolate(t, [0.62, 0.7], [0, 1], ease);
  const motor = owner ? interpolate(t, [0.7, 0.86], [0, 1], ease) : interpolate(t, [0.7, 0.76, 0.84], [0, 0.12, 0], ease);
  const res = interpolate(t, [0.76, 0.84], [0, 1], ease);
  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* volante */}
        <circle cx={760} cy={600} r={250} fill="none" stroke={V.bone} strokeWidth={22} />
        <rect x={620} y={560} width={280} height={90} rx={30} fill={V.ink2} stroke={V.bone} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => {
          const on = owner && ORDEN.slice(0, pulsados).includes(i);
          const ultimo = owner && ORDEN[pulsados - 1] === i && frame % 20 < 10;
          return <rect key={i} x={640 + i * 64} y={585} width={50} height={40} rx={10} fill={on ? (ultimo ? V.brassSoft : V.brass) : "#3A3A40"} stroke={V.bone} strokeWidth={2} />;
        })}
        {/* botón START */}
        <g transform="translate(1240 480)">
          <circle r={86} fill={V.ink2} stroke={start > 0.5 ? V.white : V.bone} strokeWidth={6} />
          <circle r={70} fill={rgba(owner ? V.ok : V.danger, 0.25 * start)} />
          <text y={12} textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight={700} fontSize={36} fill={V.white}>START</text>
        </g>
        {/* medidor del motor */}
        <g transform="translate(1240 760)">
          <path d="M -150 0 A 150 150 0 0 1 150 0" stroke={rgba(V.bone, 0.4)} strokeWidth={14} fill="none" />
          <path d="M -150 0 A 150 150 0 0 1 150 0" stroke={owner ? V.ok : V.danger} strokeWidth={14} fill="none" strokeDasharray={471} strokeDashoffset={471 * (1 - motor)} />
          <line x1={0} y1={0} x2={-130 * Math.cos(Math.PI * motor)} y2={-130 * Math.sin(Math.PI * motor)} stroke={V.white} strokeWidth={6} strokeLinecap="round" />
        </g>
        {/* ondas del relay que llegan y rebotan */}
        {!owner ? [0, 1, 2].map((k) => {
          const q = clamp01(ondas * 1.4 - k * 0.2);
          if (q <= 0 || q >= 1) return null;
          const x = 1860 - 380 * q;
          return <path key={k} d={`M ${x} 300 Q ${x - 26} 340 ${x} 380`} stroke={rgba(V.dangerSoft, 1 - q)} strokeWidth={6} fill="none" />;
        }) : null}
        {/* puntos del código */}
        {owner ? [0, 1, 2, 3].map((i) => <circle key={i} cx={640 + i * 64 + 25} cy={900} r={14} fill={i < pulsados ? V.brassSoft : "none"} stroke={V.brassSoft} strokeWidth={3} />) : null}
      </svg>
      {!owner ? (
        <div style={{ position: "absolute", left: 1450, top: 260, width: 420, fontFamily: F_BODY, fontSize: 28, color: V.bone, opacity: ondas > 0 ? 1 : 0 }}>Key signal: accepted</div>
      ) : (
        <div style={{ position: "absolute", left: 600, top: 940, width: 340, textAlign: "center", fontFamily: F_BODY, fontSize: 28, color: V.bone }}>Your secret order</div>
      )}
      <div style={{ position: "absolute", left: 1040, top: 820, width: 400, textAlign: "center", opacity: res, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: 2, color: owner ? V.ok : V.dangerSoft }}>
        {owner ? "RUNNING" : "NO START"}
      </div>
    </>
  );
};

export const ImmobilizerCode: React.FC<{
  mode?: "thief" | "owner" | "both";
  kicker?: string;
  verdict?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "both", kicker = "THE HIDDEN IMMOBILIZER", verdict = "", bed, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const both = mode === "both";
  const fase2 = both && t > 0.5;
  const tt = both ? clamp01((fase2 ? t - 0.5 : t) / 0.48) : t;
  const owner = mode === "owner" || fase2;
  const vA = interpolate(t, [0.88, 0.95], [0, 1], ease);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.88} />
      <div style={{ position: "absolute", left: 96, top: 60, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
      <div style={{ position: "absolute", left: 96, top: 100, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, color: owner ? V.white : V.dangerSoft }}>
        {owner ? "You" : "The relay"}
      </div>
      <Tablero t={tt} owner={owner} frame={frame} />
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", opacity: vA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.9)" }}>{verdict}</div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
