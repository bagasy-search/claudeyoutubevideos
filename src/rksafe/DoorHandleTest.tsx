// DoorHandleTest.tsx — LA PRUEBA DE LA MANIJA, SOBRE LAS FOTOS REALES (canal Ray Kessler, rkkeyless v2).
//
// v2 (3-oct, "componentes flojos"): la foto real de la bolsa / la lata (`bgFail`, `bgPass`) llena el
// cuadro con empuje de cámara; un anillo marca el objeto (`at`), una flecha de tirón late, y el
// veredicto cae como SELLO de goma sobre la escena: IT LEAKS (rojo) / STAYS LOCKED (verde).
//   · result="both" — pantalla partida que se abre como una puerta: izquierda falla, derecha pasa.
// ⛔ Coreografía en FRACCIONES de la duración; ≤12 palabras.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };

const Lado: React.FC<{ t: number; ok: boolean; bg?: string; at: [number, number]; label: string; D: number }> = ({ t, ok, bg, at, label, D }) => {
  const ring = interpolate(t, [0.1, 0.25], [0, 1], ease);
  const sello = clamp01((t - 0.55) / 0.12);
  const col = ok ? V.ok : V.dangerSoft;
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.16} fx={at[0]} fy={at[1]} dim={0.1} durationInFrames={D} />
      <Pulse x={at[0]} y={at[1]} color={sello > 0 ? col : V.brassSoft} t={ring} r={170} on={ring} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: V.white, opacity: ring, textShadow: "0 3px 16px rgba(0,0,0,.95)" }}>{label}</div>
      <Stamp text={ok ? "STAYS LOCKED" : "IT LEAKS"} color={col} p={sello} x={50} y={72} size={96} rot={ok ? -6 : 7} />
    </AbsoluteFill>
  );
};

export const DoorHandleTest: React.FC<{
  result?: "pass" | "fail" | "both";
  kicker?: string;
  title?: string;
  bgFail?: string;
  bgPass?: string;
  atFail?: [number, number];
  atPass?: [number, number];
  bed?: string;
  durationInFrames?: number;
}> = ({ result = "both", kicker = "THE ONLY TEST THAT MATTERS", title = "Pull the handle", bgFail, bgPass, atFail = [47, 77], atPass = [63, 65], durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const tag = interpolate(t, [0, 0.07], [0, 1], ease);
  if (result !== "both") {
    const ok = result === "pass";
    return (
      <AbsoluteFill>
        <Lado t={t} ok={ok} bg={ok ? bgPass : bgFail} at={ok ? atPass : atFail} label={ok ? "Key in the tin" : "Key in a worn pouch"} D={D} />
        <Tag kicker={kicker} title={title} a={tag} />
      </AbsoluteFill>
    );
  }
  // pantalla partida: el divisor entra barriendo y cada lado corre su prueba desfasada
  const corte = interpolate(t, [0.02, 0.14], [100, 50], ease);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - corte}% 0 0)` }}>
        <AbsoluteFill style={{ transform: "translateX(-25%)" }}><Lado t={clamp01(t / 0.8)} ok={false} bg={bgFail} at={atFail} label="Worn-out pouch" D={D} /></AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${corte}%)` }}>
        <AbsoluteFill style={{ transform: "translateX(25%)" }}><Lado t={clamp01((t - 0.18) / 0.8)} ok bg={bgPass} at={atPass} label="Old cookie tin" D={D} /></AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: `${corte}%`, top: 0, bottom: 0, width: 6, marginLeft: -3, background: V.brass, boxShadow: "0 0 30px rgba(200,145,47,.7)" }} />
      <Tag kicker={kicker} title={title} a={tag} />
      <div style={{ position: "absolute", right: 70, top: 80, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: V.white, opacity: tag, textShadow: "0 3px 14px rgba(0,0,0,.9)" }}>PULL · NOTHING · PASS</div>
    </AbsoluteFill>
  );
};
