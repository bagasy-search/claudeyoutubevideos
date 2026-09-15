// Piezas.tsx — planos base de farinon (Federer Archivos · riñón y verduras).
// ⛔ OffthreadVideo SIEMPRE, nunca <Video>. ⛔ Sin filtros de color sobre b-roll.
// ⛔ Regla 1.ter (creador, cross-nicho): el Ken Burns se SORTEA por plano — sentido (in/out al azar,
//    no alternado), amplitud, foco (transformOrigin 35-65 %) y ángulo del paneo — con un hash ENTERO
//    (Math.sin con seeds grandes se correlaciona). El paneo está atado a la escala: nunca asoma el fondo.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#08110F";

export const hash01 = (seed: number, salt: number) => {
  let h = (Math.imul((seed | 0) ^ 0x9e3779b9, 0x85ebca6b) + Math.imul(salt | 0, 0xc2b2ae35)) | 0;
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12; h = Math.imul(h, 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
};

// fotos: 1,8-4,0 %/s, techo 20 % · clips: la mitad (ya tienen movimiento propio)
export const kenBurns = (seed: number, frame: number, n: number, fps: number, esClip: boolean) => {
  const dur = Math.max(1, n) / fps;
  const vMin = esClip ? 0.006 : 0.018, vMax = esClip ? 0.014 : 0.04;
  const vel = vMin + (vMax - vMin) * hash01(seed, 2);
  const amp = Math.min(esClip ? 0.1 : 0.2, vel * dur);
  const zBase = 1.06;
  const acerca = hash01(seed, 1) < 0.5;
  const k = interpolate(frame, [0, Math.max(1, n)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const z = acerca ? zBase + amp * k : zBase + amp * (1 - k);
  const kk = amp > 0 ? (z - zBase) / amp : 0;   // paneo atado a la escala
  const ang = hash01(seed, 5) * Math.PI * 2;
  const tx = Math.cos(ang) * 2.0 * kk, ty = Math.sin(ang) * 1.2 * kk;
  const ox = 35 + 30 * hash01(seed, 3), oy = 35 + 30 * hash01(seed, 4);
  return { transform: `scale(${z.toFixed(4)}) translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%)`, transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, acerca };
};

export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const { transform, transformOrigin } = kenBurns(seed, frame, durationInFrames, fps, false);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform, transformOrigin }} />
    </AbsoluteFill>
  );
};

// start = segundo desde donde arranca el stock (salta el fundido desde negro de muchos clips de Pexels)
export const Clip: React.FC<{ src: string; rate?: number; seed?: number; startFrom?: number }> = ({ src, rate = 1, seed = 7, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const { transform, transformOrigin } = kenBurns(seed, frame, durationInFrames, fps, true);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} startFrom={Math.round(startFrom * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform, transformOrigin }} />
    </AbsoluteFill>
  );
};

// LA LÁMINA a pantalla completa, con zoom PUNTO POR PUNTO: cada cue va de `from` (el foco del cue
// anterior) a `to` en el primer 35 % y después se sostiene con una deriva mínima, así la cámara
// "camina" por la página sin cortes. x/y = centro del foco en fracción de la imagen, z = zoom.
type Foco = { x: number; y: number; z: number };
export const LaminaZoom: React.FC<{ src: string; from?: Foco; to: Foco; durationInFrames?: number }> = ({ src, from, to }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = from || to;
  const ease = Easing.bezier(0.45, 0, 0.2, 1);
  const k = interpolate(frame, [0, Math.max(8, Math.round(durationInFrames * 0.35))], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const drift = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 0.025], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = a.z + (to.z - a.z) * k + drift;
  const cx = a.x + (to.x - a.x) * k, cy = a.y + (to.y - a.y) * k;
  // clamp: con zoom z, el centro visible no puede acercarse al borde más de 1/(2z)
  const half = 0.5 / Math.max(1, z);
  const px = Math.min(1 - half, Math.max(half, cx)), py = Math.min(1 - half, Math.max(half, cy));
  const tx = (0.5 - px) * 100 * z, ty = (0.5 - py) * 100 * z;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDC", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: `translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%) scale(${z.toFixed(4)})`, transformOrigin: "50% 50%" }} />
    </AbsoluteFill>
  );
};
