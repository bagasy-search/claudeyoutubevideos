// FixCostLadder.tsx — LOS 12 ARREGLOS EN UNA ESCALERA DE COSTO (canal Ray Kessler, rkkeyless).
//
// Una columna de peldaños de abajo (gratis) hacia arriba (lo más caro). Los peldaños se construyen
// uno a uno; el `active` (1-based) se enciende en latón y la cámara virtual sube hasta él.
// Con `picks` (lista de índices) marca en verde "los tres de esta noche" para el repaso.
// ⛔ Staggers como FRACCIÓN de la duración; ≤12 palabras visibles por peldaño.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const FixCostLadder: React.FC<{
  items?: { label: string; cost: string }[];
  active?: number;
  picks?: number[];
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ items = [], active = 0, picks = [], kicker = "TWELVE WAYS · CHEAPEST FIRST", bed, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const n = Math.max(1, items.length);
  const ROW = Math.min(84, Math.floor(840 / n));
  const target = active ? active - 1 : n - 1;
  // cámara: sube suave hasta el peldaño activo (o muestra todo si no hay activo)
  const cam = interpolate(t, [0.25, 0.6], [0, 1], ease);
  const centerY = 560;
  const offY = 0 * cam * target; // los 12 peldaños entran enteros: sin cámara (antes se iban por arriba)
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.88} />
      <div style={{ position: "absolute", left: 96, top: 60, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass, opacity: clamp01(t * 12) }}>{kicker}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${offY}px)` }}>
        {items.map((it, i) => {
          const a = clamp01((t - (0.03 + (i / n) * 0.3)) / 0.06);
          const on = active === i + 1;
          const pick = picks.includes(i + 1);
          const y = centerY + 400 - (i + 1) * ROW;
          const ancho = 760 + i * 30;
          const col = on ? V.brassSoft : pick ? V.ok : V.bone;
          return (
            <div key={i} style={{
              position: "absolute", left: (1920 - ancho) / 2, top: y, width: ancho, height: ROW - 12, opacity: a * (active && !on && !pick ? 0.55 : 1),
              transform: `translateX(${(1 - a) * -40}px) scale(${on ? 1 + 0.04 * Math.sin(frame / 6) ** 2 : 1})`,
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px",
              background: on ? rgba(V.brass, 0.22) : rgba(V.ink2, 0.92), border: `3px solid ${rgba(col, on || pick ? 1 : 0.35)}`, borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(ROW * 0.46), color: col, width: 52 }}>{i + 1}</div>
                <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: Math.round(ROW * 0.42), color: V.white }}>{it.label}</div>
              </div>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(ROW * 0.44), color: it.cost.toLowerCase() === "free" ? V.ok : V.brassSoft }}>{it.cost}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
