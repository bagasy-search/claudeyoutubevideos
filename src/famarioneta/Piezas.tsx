// Piezas.tsx — planos base del video `famarioneta`: Foto, Clip, AvatarClip y la LÁMINA (EL momento).
// ⛔ OffthreadVideo siempre. ⛔ Ken-Burns AL AZAR por plano (sentido, amplitud, foco, deriva) con hash entero.
// ⛔ `loop` no es prop de OffthreadVideo: el build nunca estira un clip más allá de su archivo.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// amplitud atada a la duración: 1,8-4 %/s con techo 20 % (fotos) · la mitad para clips
const useKenBurns = (seed: number, base: number, rateMin: number, rateMax: number, cap: number, driftMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const secs = n / 30;
  const acerca = hash01(seed, 1) < 0.5;
  const amp = Math.min(cap, secs * (rateMin + hash01(seed, 2) * (rateMax - rateMin)));
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 35 + hash01(seed, 3) * 30, oy = 35 + hash01(seed, 4) * 30;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  const kz = amp > 0 ? (z - base) / amp : 0;              // paneo atado a la escala: nunca destapa borde
  const ang = hash01(seed, 5) * Math.PI * 2;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * driftMax * kz).toFixed(3)}%, ${(Math.sin(ang) * driftMax * 0.6 * kz).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

export const Foto: React.FC<{ src: string; seed: number; punch?: boolean }> = ({ src, seed, punch }) => {
  const kb = useKenBurns(punch ? seed * 31 + 7 : seed, punch ? 1.18 : 1.06, 0.018, 0.04, 0.2, 2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDD", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; startFrom?: number }> = ({ src, seed, startFrom = 0 }) => {
  const kb = useKenBurns(seed, 1.04, 0.006, 0.014, 0.08, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDD", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

// avatar: push lento (nunca quieto), sin filtro, sin fade
export const AvatarClip: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = frame / Math.max(1, durationInFrames);
  const acerca = hash01(seed, 9) < 0.6;
  const s = acerca ? 1.0 + 0.05 * k : 1.05 - 0.05 * k;
  const dx = (hash01(seed, 10) - 0.5) * 1.2 * (s - 1) * 20;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDD", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`, transformOrigin: "50% 35%" }} />
    </AbsoluteFill>
  );
};

// LÁMINA a pantalla completa: cada momento acerca a la zona que se nombra (origen %, escala);
// arranca desde la zona anterior → un solo movimiento de cámara punto por punto.
const ZONAS: Record<string, [number, number, number]> = {
  completa: [50, 50, 1.0],
  paso1: [2, 30, 1.6],
  paso2: [2, 43, 1.6],
  paso3: [2, 56, 1.6],
  paso4: [2, 69, 1.6],
  paso5: [2, 82, 1.6],
  diagrama: [97, 38, 1.55],
  errores: [97, 86, 1.6],
  plazo: [50, 100, 1.18],
};
export const Lamina: React.FC<{ src: string; zoom?: string; desde?: string }> = ({ src, zoom = "completa", desde }) => {
  const frame = useCurrentFrame();
  const [ox, oy, z] = ZONAS[zoom] || ZONAS.completa;
  const [px, py, pz] = ZONAS[desde || zoom] || ZONAS[zoom] || ZONAS.completa;
  const k = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const drift = interpolate(frame, [24, 400], [0, 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = (pz + (z - pz) * k) * (1 + drift);
  const x = px + (ox - px) * k, y = py + (oy - py) * k;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EEDD", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})`, transformOrigin: `${x.toFixed(2)}% ${y.toFixed(2)}%` }} />
    </AbsoluteFill>
  );
};
