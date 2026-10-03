// DoorHandleTest.tsx — LA PRUEBA DE LA MANIJA (canal Ray Kessler, rkkeyless).
//
// La manija de la puerta del auto en primer plano. La llave entra en la bolsa/lata (se pliega la tapa),
// la mano tira de la manija y el resultado se escribe:
//   · result="pass" — la puerta NO se mueve, candado verde: "STAYS LOCKED".
//   · result="fail" — la puerta se despega 1 cm y el candado se abre en rojo: "IT LEAKS".
//   · result="both" — primero falla con la bolsa gastada y después pasa con la lata (comparación).
// ⛔ Coreografía en FRACCIONES de la duración; ≤12 palabras de texto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };

const Prueba: React.FC<{ t: number; ok: boolean; label: string; x: number; w: number }> = ({ t, ok, label, x, w }) => {
  const enBolsa = interpolate(t, [0.05, 0.3], [0, 1], ease);   // la llave baja a la bolsa
  const tapa = interpolate(t, [0.3, 0.42], [0, 1], ease);       // se cierra la tapa
  const tiron = interpolate(t, [0.48, 0.62], [0, 1], ease);     // la mano tira
  const veredicto = interpolate(t, [0.66, 0.78], [0, 1], ease);
  const abre = !ok ? tiron * veredicto : 0;
  const cx = x + w / 2;
  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* panel de la puerta */}
        <rect x={x + 30} y={200} width={w - 60} height={520} rx={26} fill={V.ink2} stroke={V.bone} strokeWidth={4} transform={`translate(${abre * 26} 0)`} />
        <line x1={x + 30} y1={200} x2={x + 30} y2={720} stroke={abre > 0.1 ? V.dangerSoft : rgba(V.bone, 0.4)} strokeWidth={abre > 0.1 ? 8 : 3} />
        {/* manija */}
        <g transform={`translate(${cx + abre * 26} 360)`}>
          <rect x={-120} y={-26} width={240} height={52} rx={26} fill={V.steel} stroke={V.white} strokeWidth={3} />
          <rect x={-110} y={-14 + tiron * 10} width={220} height={28} rx={14} fill="#B9B9C0" />
        </g>
        {/* bolsa/lata */}
        <g transform={`translate(${cx} 560)`}>
          <rect x={-90} y={-60} width={180} height={140} rx={ok ? 10 : 22} fill={ok ? "#9EA3A8" : "#3B3D44"} stroke={V.bone} strokeWidth={3} />
          {!ok ? <path d="M -60 70 L -40 50 L -20 70" stroke={V.dangerSoft} strokeWidth={4} fill="none" /> : null}
          <rect x={-94} y={-62 - (1 - tapa) * 40} width={188} height={20} rx={6} fill={ok ? "#B9BEC3" : "#4A4C54"} transform={`rotate(${(1 - tapa) * -18})`} />
          {/* la llave bajando */}
          <g transform={`translate(0 ${-200 + enBolsa * 190})`} opacity={1 - tapa * 0.85}>
            <rect x={-20} y={-30} width={40} height={60} rx={12} fill="#2B2B30" stroke={V.brassSoft} strokeWidth={3} />
          </g>
        </g>
        {/* candado del resultado */}
        <g transform={`translate(${cx} 160)`} opacity={veredicto}>
          <path d={ok ? "M -14 -6 L -14 -26 Q -14 -42 0 -42 Q 14 -42 14 -26 L 14 -6" : "M -14 -6 L -14 -30 Q -14 -46 2 -46 Q 18 -46 18 -36"} stroke={ok ? V.ok : V.dangerSoft} strokeWidth={6} fill="none" />
          <rect x={-22} y={-8} width={44} height={34} rx={6} fill={ok ? V.ok : V.danger} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: x, width: w, top: 760, textAlign: "center", fontFamily: F_BODY, fontSize: 30, color: V.bone, opacity: clamp01(t * 6) }}>{label}</div>
      <div style={{ position: "absolute", left: x, width: w, top: 820, textAlign: "center", opacity: veredicto, transform: `translateY(${(1 - veredicto) * 16}px)`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 56, letterSpacing: 2, color: ok ? V.ok : V.dangerSoft }}>
        {ok ? "STAYS LOCKED" : "IT LEAKS"}
      </div>
    </>
  );
};

export const DoorHandleTest: React.FC<{
  result?: "pass" | "fail" | "both";
  kicker?: string;
  title?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ result = "both", kicker = "THE ONLY TEST THAT MATTERS", title = "Pull the handle", bed, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const head = interpolate(t, [0, 0.06], [0, 1], ease);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.86} />
      <div style={{ position: "absolute", left: 96, top: 60, opacity: head }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 60, color: V.white, marginTop: 4 }}>{title}</div>
      </div>
      {result === "both" ? (
        <>
          <Prueba t={clamp01(t / 0.95)} ok={false} label="Worn-out pouch" x={160} w={760} />
          <div style={{ position: "absolute", left: 958, top: 210, width: 4, height: 680, background: rgba(V.bone, 0.25) }} />
          <Prueba t={clamp01((t - 0.04) / 0.95)} ok label="Old cookie tin" x={1000} w={760} />
        </>
      ) : (
        <Prueba t={t} ok={result === "pass"} label={result === "pass" ? "Key in the tin" : "Key in the pouch"} x={560} w={800} />
      )}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
