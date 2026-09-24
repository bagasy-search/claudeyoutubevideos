// Piezas.tsx — piezas de escena del video `falifting` (canal Federer Archivos).
// Clon de src/fcsmanos10/Piezas.tsx + la LÁMINA de la guía (EL momento del min ~7, zoom punto por punto).
// ⛔ OffthreadVideo SIEMPRE (nunca <Video>). ⛔ Ken-Burns AL AZAR por plano (sentido, amplitud, foco,
//    deriva) con hash ENTERO — regla 1.ter del pipeline. ⛔ `loop` no es prop de OffthreadVideo: <Loop>.
// Sin avatar de fondo: el presentador aparece por VENTANAS (RunPod), cada frame lo cubre un plano.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V } from "../fcsclv/RayStage";

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

export const Foto: React.FC<{ src: string; seed: number; punch?: boolean }> = ({ src, seed, punch }) => {
  const kb = useKenBurns(punch ? seed * 31 + 7 : seed, punch ? 1.2 : 1.06, 0.06, punch ? 0.1 : 0.16, 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; frames?: number; startFrom?: number }> = ({ src, seed, frames, startFrom = 0 }) => {
  const kb = useKenBurns(seed, 1.03, 0.025, 0.06, 0.6);
  const video = <OffthreadVideo src={staticFile(src)} muted playbackRate={1} startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

/** Clip de agnes que dura menos que su plano: el clip entero y después su ÚLTIMO cuadro, con la MISMA curva Ken-Burns. */
export const ClipHold: React.FC<{ src: string; last: string; seed: number; frames: number }> = ({ src, last, seed, frames }) => {
  const frame = useCurrentFrame();
  const kb = useKenBurns(seed, 1.03, 0.025, 0.06, 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {frame < frames
        ? <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
        : <Img src={staticFile(last)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />}
    </AbsoluteFill>
  );
};

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

/** LÁMINA de la guía a pantalla completa. Cada momento acerca a la zona que él está nombrando
 *  (origen del zoom en % del cuadro, escala). Arranca desde la escala del plano ANTERIOR para que
 *  el paso de una zona a otra se lea como un solo movimiento de cámara, no como cortes. */
const ZONAS: Record<string, [number, number, number]> = {
  completa: [50, 50, 1.0],
  pasos: [0, 34, 2.1],
  paso2: [78, 34, 2.1],
  paso3: [100, 34, 2.1],
  errores: [4, 100, 2.2],
  plazo: [100, 100, 2.2],
};
export const Lamina: React.FC<{ src: string; zoom?: string; desde?: string }> = ({ src, zoom = "completa", desde }) => {
  const frame = useCurrentFrame();
  const [ox, oy, z] = ZONAS[zoom] || ZONAS.completa;
  const [px, py, pz] = ZONAS[desde || zoom] || ZONAS[zoom] || ZONAS.completa;
  const k = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const drift = interpolate(frame, [22, 400], [0, 0.025], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = (pz + (z - pz) * k) * (1 + drift);
  const x = px + (ox - px) * k, y = py + (oy - py) * k;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDD", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})`, transformOrigin: `${x.toFixed(2)}% ${y.toFixed(2)}%` }} />
    </AbsoluteFill>
  );
};
