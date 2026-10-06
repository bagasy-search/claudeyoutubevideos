// Piezas.tsx — piezas de escena del video `fcsmanos10` (canal Federer Consejos Salud).
// ⛔ OffthreadVideo SIEMPRE (nunca <Video>). ⛔ Ken-Burns AL AZAR por plano (sentido, amplitud, foco,
//    deriva) con hash ENTERO — regla 1.ter del pipeline. ⛔ `loop` no es prop de OffthreadVideo: <Loop>.
// Este video NO tiene avatar de fondo: el presentador aparece por VENTANAS renderizadas con
// AvatarForever (AvatarClip), así que cada frame lo tiene que cubrir un plano.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// paleta del canal inline: no dependemos de src/fcsclv (no está en la rama base del farm)
const V = { ink0: "#08110F" };

// hash entero (mulberry-ish): seeds grandes y correlativas no degeneran en patrón
const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number, driftMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const acerca = hash01(seed, 1) < 0.5;
  const amp = ampMin + hash01(seed, 2) * (ampMax - ampMin);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 32 + hash01(seed, 3) * 36, oy = 32 + hash01(seed, 4) * 36;
  // la deriva nunca puede destapar un borde: |d| <= min(o,100-o) * (escalaMIN - 1)
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(driftMax, Math.max(0, techo));
  const ang = hash01(seed, 5) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

// punch = 2º corte de la MISMA foto: arranca más cerrado (otro encuadre), como un corte de cámara
export const Foto: React.FC<{ src: string; seed: number; punch?: boolean }> = ({ src, seed, punch }) => {
  const kb = useKenBurns(punch ? seed * 31 + 7 : seed, punch ? 1.2 : 1.06, 0.06, punch ? 0.1 : 0.16, 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

// frames = cuadros REALES del archivo (lo mide el build): si el plano dura más, <Loop> en vez de congelar
// startFrom = segundos del archivo donde arranca este corte (2º corte de un plano largo partido)
export const Clip: React.FC<{ src: string; seed: number; frames?: number; startFrom?: number }> = ({ src, seed, frames, startFrom = 0 }) => {
  const kb = useKenBurns(seed, 1.03, 0.025, 0.06, 0.6);
  const video = <OffthreadVideo src={staticFile(src)} muted playbackRate={1} startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

// ventana de AVATAR (AvatarForever): lipsync del propio audio de esa ventana, a pantalla completa,
// muteado (el audio es el master). Push lento, nunca estático; sin fade (corte duro).
// startFrom = segundos del clip donde arranca (la ventana se recortó para esquivar un corte de audio de RunPod
// que congela la boca: el lipsync va atado al clip, así que se entra al clip en ese mismo segundo)
export const AvatarClip: React.FC<{ src: string; seed: number; startFrom?: number }> = ({ src, seed, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const dir = hash01(seed, 9) < 0.5 ? 1 : -1;
  const s = 1.02 + frame * 0.00012;
  const dx = dir * Math.min(0.8, frame * 0.004);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${Math.min(1.06, s).toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};
