// KeySpotMap.tsx — DÓNDE DUERME LA LLAVE, EN LA CASA REAL (canal Ray Kessler, rkkeyless v2).
//
// v2 (3-oct, "componentes flojos"): en vez de un plano dibujado sobre negro, dos FOTOS reales.
//   1) el bol junto a la puerta (`bgDoor`, llave en `atDoor`): su alcance late en ROJO y una lengua de
//      luz sale por la puerta hacia afuera (`doorAt`) — "reach spills onto the porch".
//   2) mode="move": la cámara barre (whip) a la mesa de luz del cuarto del medio (`bgSafe`, `atSafe`)
//      y el alcance late en VERDE, contenido.
// ⛔ Coreografía en FRACCIONES de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };

export const KeySpotMap: React.FC<{
  spot?: "door" | "center" | "move";
  kicker?: string;
  verdict?: string;
  bgDoor?: string;
  bgSafe?: string;
  atDoor?: [number, number];
  doorAt?: [number, number];
  atSafe?: [number, number];
  bed?: string;
  durationInFrames?: number;
}> = ({ spot = "move", kicker = "WHERE THE KEY SLEEPS", verdict = "", bgDoor, bgSafe, atDoor = [85, 72], doorAt = [25, 45], atSafe = [49, 52], durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const tag = interpolate(t, [0, 0.07], [0, 1], ease);
  const whip = spot === "move" ? interpolate(t, [0.5, 0.6], [0, 1], ease) : spot === "center" ? 1 : 0;
  const tDoor = clamp01(t / 0.5), tSafe = spot === "move" ? clamp01((t - 0.58) / 0.42) : t;
  const fuga = interpolate(tDoor, [0.35, 0.8], [0, 1], ease);
  const blurW = Math.sin(whip * Math.PI) * 18;
  const vA = interpolate(t, [0.84, 0.92], [0, 1], ease);
  return (
    <AbsoluteFill>
      {whip < 1 ? (
        <AbsoluteFill style={{ transform: `translateX(${-whip * 100}%)`, filter: `blur(${blurW}px)` }}>
          <WorldBed src={bgDoor} push={0.12} fx={atDoor[0]} fy={atDoor[1]} dim={0.12} durationInFrames={D} />
          <Pulse x={atDoor[0]} y={atDoor[1]} color={V.dangerSoft} t={tDoor} r={260} on={clamp01(tDoor * 4)} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d={`M ${atDoor[0] * 19.2} ${atDoor[1] * 10.8} Q ${(atDoor[0] + doorAt[0]) * 9.6} ${(atDoor[1] - 6) * 10.8} ${atDoor[0] * 19.2 + (doorAt[0] - atDoor[0]) * 19.2 * fuga} ${atDoor[1] * 10.8 + (doorAt[1] - atDoor[1]) * 10.8 * fuga}`}
              stroke={rgba(V.dangerSoft, 0.85)} strokeWidth={10} fill="none" strokeDasharray="22 14" strokeDashoffset={-frame * 5} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: doorAt[0] * 19.2 - 200, top: doorAt[1] * 10.8 - 120, width: 400, textAlign: "center", opacity: fuga, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, color: V.dangerSoft, textShadow: "0 4px 18px rgba(0,0,0,.95)" }}>REACHES THE PORCH</div>
          <Stamp text="WORST SPOT" color={V.dangerSoft} p={clamp01((tDoor - 0.6) / 0.15)} x={60} y={30} size={80} rot={-5} />
        </AbsoluteFill>
      ) : null}
      {whip > 0 ? (
        <AbsoluteFill style={{ transform: `translateX(${(1 - whip) * 100}%)`, filter: `blur(${blurW}px)` }}>
          <WorldBed src={bgSafe} push={0.12} fx={atSafe[0]} fy={atSafe[1]} dim={0.1} durationInFrames={D} />
          <Pulse x={atSafe[0]} y={atSafe[1]} color={V.ok} t={tSafe} r={170} on={clamp01(tSafe * 4)} />
          <div style={{ position: "absolute", left: atSafe[0] * 19.2 - 260, top: atSafe[1] * 10.8 + 140, width: 520, textAlign: "center", opacity: clamp01(tSafe * 3), fontFamily: F_BODY, fontWeight: 700, fontSize: 38, color: V.white, textShadow: "0 3px 16px rgba(0,0,0,.95)" }}>Middle of the house · reach stays inside</div>
        </AbsoluteFill>
      ) : null}
      <Tag kicker={kicker} a={tag} />
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", opacity: vA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 56, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.95)" }}>{verdict}</div>
      ) : null}
    </AbsoluteFill>
  );
};
