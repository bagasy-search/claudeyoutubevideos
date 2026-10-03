// ChipTap.tsx — POR QUÉ ARRANCA CON LA PILA MUERTA (canal Ray Kessler, rkdeadfob).
//
// Sobre la FOTO real del fob apoyado en el botón START (`bg`, contacto en `at`):
//   1) la pila se "apaga" (ícono de pila que se vacía, RADIO: OFF en rojo),
//   2) desde el botón salen anillos cortos que "despiertan" el chip (dibujado como un cuadradito dorado
//      que se enciende dentro del fob) — "powered from the button",
//   3) el tablero responde: sello STARTS.
// Comparación con la tarjeta del súper: chip de texto "Like tapping a card at the store".
// ⛔ Coreografía en FRACCIONES de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const ChipTap: React.FC<{ bg?: string; at?: [number, number]; kicker?: string; bed?: string; durationInFrames?: number }> = ({
  bg, at = [55, 45], kicker = "NUMBER 6 · THE ONE THAT SAVES THE NIGHT", durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const pila = interpolate(t, [0.08, 0.3], [1, 0], ease);
  const anillos = clamp01((t - 0.34) / 0.2);
  const chip = interpolate(t, [0.48, 0.58], [0, 1], ease);
  const ax = at[0] * 19.2, ay = at[1] * 10.8;
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.22} fx={at[0]} fy={at[1]} dim={0.14} durationInFrames={D} />
      <Pulse x={at[0]} y={at[1]} color={V.brassSoft} t={anillos} r={120} on={anillos} />
      {/* panel de la pila */}
      <div style={{ position: "absolute", left: 90, top: 300, width: 520, padding: "26px 30px", borderRadius: 18, background: "rgba(10,10,12,.72)", border: `2px solid ${rgba(V.bone, 0.25)}` }}>
        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 30, color: V.bone }}>Remote battery</div>
        <div style={{ marginTop: 14, width: 420, height: 56, borderRadius: 10, border: `4px solid ${V.bone}`, position: "relative" }}>
          <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: `${Math.max(2, pila * 98)}%`, borderRadius: 6, background: pila > 0.3 ? V.ok : V.danger }} />
        </div>
        <div style={{ marginTop: 14, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: pila < 0.1 ? V.dangerSoft : V.white }}>{pila < 0.1 ? "RADIO: OFF" : "RADIO: ON"}</div>
        <div style={{ marginTop: 22, fontFamily: F_BODY, fontWeight: 700, fontSize: 30, color: V.bone, opacity: chip }}>Tiny chip inside</div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 16, opacity: chip }}>
          <div style={{ width: 54, height: 54, borderRadius: 8, background: V.brassSoft, boxShadow: `0 0 ${20 + 20 * Math.sin(frame / 4)}px ${V.brassSoft}` }} />
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: V.brassSoft }}>NO BATTERY NEEDED</div>
        </div>
      </div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={610} y1={500} x2={610 + (ax - 610) * chip} y2={500 + (ay - 500) * chip} stroke={V.brassSoft} strokeWidth={4} strokeDasharray="10 8" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: clamp01((t - 0.62) * 8), fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: V.white, textShadow: "0 3px 16px rgba(0,0,0,.95)" }}>Like tapping a card at the store</div>
      <Stamp text="STARTS" color={V.ok} p={clamp01((t - 0.72) / 0.12)} x={at[0] > 60 ? 40 : 70} y={28} size={100} rot={-6} />
      <Tag kicker={kicker} a={interpolate(t, [0, 0.07], [0, 1], ease)} />
    </AbsoluteFill>
  );
};
