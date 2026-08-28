// Piezas.tsx — las tres primitivas de la capa base/overlay del montaje de `cmeurgente`.
// Las escenas premium viven en Mov*.tsx; esto es lo que dibuja el material CRUDO entre medio.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, rnd } from "./VoltStage";

/** CLIP real. Va a sangre y NO se corta (`noSplit`): el movimiento ya es dinámico.
 *  Cama de negro abajo para que nunca asome el avatar por los bordes del objectFit. */
export const Clip: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
    <OffthreadVideo src={staticFile(src)} muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

/** FOTO con Ken-Burns lento. `seed` la hace determinista (nunca Math.random: el farm
 *  renderiza en 60 chunks separados y cada uno tiene que dar exactamente lo mismo). */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const r = rnd(seed);
  const dir = r > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, Math.max(2, durationInFrames)], [1.04, 1.11], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const px = interpolate(frame, [0, Math.max(2, durationInFrames)], [0, dir * 1.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${z.toFixed(4)}) translateX(${px.toFixed(2)}%)`,
      }} />
    </AbsoluteFill>
  );
};

/** ICONO + número. Va ENCIMA de lo que ya se está viendo y NO tapa la capa de abajo:
 *  el número nunca va solo ni sobre fondo plano (regla de la vara). */
export const IconoNum: React.FC<{ src: string; texto?: string }> = ({ src, texto }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(8, durationInFrames - 6), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  const y = (1 - inP) * 26;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "6.5%", top: "12%",
        display: "flex", alignItems: "center", gap: 22,
        opacity: a, transform: `translateY(${y.toFixed(1)}px)`,
      }}>
        <Img src={staticFile(src)} style={{
          width: 118, height: 118, objectFit: "contain",
          filter: `drop-shadow(0 10px 26px ${rgba(V.ink0, 0.75)})`,
        }} />
        {texto ? (
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 96, lineHeight: 1, letterSpacing: "-0.01em",
            color: V.volt, textShadow: `0 6px 30px ${rgba(V.ink0, 0.9)}`,
            padding: "10px 22px", borderLeft: `5px solid ${rgba(V.volt, 0.85)}`,
          }}>{texto}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
