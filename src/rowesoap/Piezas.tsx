import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Piezas de rowesoap (canal Dr. Emmett Rowe, EN clínico).
// ⛔ NUNCA <Video>: en el render busca por tiempo y repite/saltea cuadros → tirón.
// ⛔ Ken-Burns por plano AL AZAR (regla 1.ter): sentido, amplitud, foco y deriva sorteados con un
//    hash ENTERO del seed (no Math.sin: pierde precisión con seeds grandes y se correlaciona).

const hash = (n: number): number => {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};
const rnd = (seed: number, salt: number) => hash(Math.imul(seed + 1, 2654435761) ^ Math.imul(salt + 7, 40503));

// %/s de zoom: fotos 1,8-4,0 · clips 0,6-1,4 · techo total 20 %
export const kenBurns = (seed: number, frame: number, n: number, fps: number, kind: "foto" | "clip") => {
  const dur = Math.max(0.5, n / fps);
  const [lo, hi] = kind === "foto" ? [1.8, 4.0] : [0.6, 1.4];
  const rate = lo + (hi - lo) * rnd(seed, 1);
  const amp = Math.min(0.2, (rate / 100) * dur);
  const zBase = 1.06;
  const acerca = rnd(seed, 2) < 0.5;
  const k = interpolate(frame, [0, Math.max(1, n - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kk = acerca ? k : 1 - k;
  const z = zBase + amp * kk;
  const ox = 35 + 30 * rnd(seed, 3);
  const oy = 35 + 30 * rnd(seed, 4);
  const ang = rnd(seed, 5) * Math.PI * 2;
  // paneo atado a la ESCALA (kk), así el traslado máximo coincide con el zoom máximo
  const tx = Math.cos(ang) * 2.0 * kk;
  const ty = Math.sin(ang) * 1.2 * kk;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
    acerca,
  };
};

const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const kb = kenBurns(seed, frame, durationInFrames, fps, "foto");
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <Img src={staticFile(src)} style={{ ...cover, transform: kb.transform, transformOrigin: kb.transformOrigin }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; frames: number }> = ({ src, seed, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const kb = kenBurns(seed, frame, durationInFrames, fps, "clip");
  const video = <OffthreadVideo src={staticFile(src)} muted style={cover} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <AbsoluteFill style={{ transform: kb.transform, transformOrigin: kb.transformOrigin }}>
        {frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Ventana del avatar: un tramo del reel de RunPod (832x464) recortado con trimBefore, muteado
// (el audio sale del <Audio> máster). Push lento obligatorio (nunca estático), sin fade.
export const AvatarWin: React.FC<{ src: string; trimFrames: number; seed: number }> = ({ src, trimFrames, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const acerca = rnd(seed, 9) < 0.65;
  const k = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = 1.02 + 0.05 * (acerca ? k : 1 - k);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <OffthreadVideo src={staticFile(src)} trimBefore={trimFrames} muted
        style={{ ...cover, transform: `scale(${z.toFixed(4)})`, transformOrigin: "46% 32%" }} />
    </AbsoluteFill>
  );
};
