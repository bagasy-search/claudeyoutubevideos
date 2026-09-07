// OlivStage.tsx — piezas base del canal "Consultorio Olivares".
//
// Self-contained a propósito: no importa nada de otros canales, así el árbol de imports del entry
// queda chico y la compuerta de git puede verificarlo entero.
//
// ⛔ REGLA DURA DEL PIPELINE: todo video va con OffthreadVideo, NUNCA <Video>. Al renderizar,
//    <Video> monta un elemento HTML que busca por TIEMPO y no acierta el cuadro exacto: repite y
//    saltea cuadros de forma IRREGULAR, y eso se lee como tirón en todo el metraje. OffthreadVideo
//    extrae el cuadro con ffmpeg, fuera del navegador. Vale para el avatar Y para los clips.
// ⛔ El movimiento va por transform de CSS (subpíxel). Horneado con ffmpeg cuantiza a píxel entero
//    y se lee como tirón.
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

export const OL = {
  ink0: "#0C1412",   // negro verdoso: el fondo que nunca se debería ver
  paper: "#F4F1EA",  // papel clínico
  green: "#2E7D57",  // el verde del chip de las miniaturas del canal
  amber: "#E8B14C",
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const rnd = (k: number) => { const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };
const enter = (frame: number, frames = 6) =>
  interpolate(frame, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── CLIP a sangre (metraje real) ──────────────────────────────────────────────────────────────
export const Clip: React.FC<{ src: string; rate?: number }> = ({ src, rate = 1 }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 6);
  const z = interpolate(frame, [0, 180], [1.012, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const x = interpolate(frame, [0, 180], [-0.32, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: a, transform: `scale(${z.toFixed(4)}) translateX(${x.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

// ── FOTO con Ken-Burns casi imperceptible: movimiento de cámara, no efecto de póster ──────────
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const frame = useCurrentFrame();
  const dir = rnd(seed) > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, 260], [1.02, 1.075], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
  const x = interpolate(frame, [0, 260], [dir * -0.7, dir * 0.9], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const y = Math.sin((frame + (seed % 91)) / 99) * 0.15;
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

// ── EL AVATAR — FONDO GARANTIZADO de todo el video ────────────────────────────────────────────
// Está grabada la primera mitad, así que va en BUCLE. Muteado: el audio sale del máster.
// Nunca estático: push lento determinista (el gate de ">4s" dejaba quietos los tramos cortos).
export const OlivAvatar: React.FC<{ src: string; loopFrames: number }> = ({ src, loopFrames }) => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <Loop durationInFrames={loopFrames}>
        <OffthreadVideo src={staticFile(src)} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
      </Loop>
    </AbsoluteFill>
  );
};
