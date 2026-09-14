// src/mdsmell/Piezas.tsx — piezas de render de `mdsmell` (canal Mike Dalton, EN).
// Clon de mdgrout/Piezas con exports PROPIOS (Mds*) — ⛔ renombrar el export o el import nombrado
// llega undefined -> React #130 -> mueren los 60 chunks, y tsc no lo marca.
// Arquitectura POR VENTANAS: el avatar NO es piso continuo; son clips (MdsAvatar) por corte, y el
// b-roll cubre el resto.
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const rnd = (s: number): number => {
  let h = Math.imul(Math.round(s) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// KEN BURNS AL AZAR (regla cross-nicho): sentido 50/50, amplitud, origen y angulo por plano.
const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed * 2654435761 + o * 40503);
  const acerca = r(0) < 0.5;
  const amp = ampMin + (ampMax - ampMin) * r(7);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + 40 * r(13), oy = 30 + 40 * r(21);
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r(33) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

const COVER = { width: "100%", height: "100%", objectFit: "cover" as const };

export const MdsFoto: React.FC<{ durationInFrames: number; src: string; seed: number; darken?: number }> = ({ src, seed, darken = 0.08 }) => {
  const kb = useKenBurns(seed, 1.06, 0.045, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...COVER, ...kb }} />
      {darken > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${darken})` }} /> : null}
    </AbsoluteFill>
  );
};

export const MdsClip: React.FC<{
  durationInFrames: number; src: string; seed: number; frames?: number; darken?: number;
}> = ({ durationInFrames, src, seed, frames, darken = 0.1 }) => {
  const kb = useKenBurns(seed, 1.03, 0.045, 0.075);
  const video = (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={1} style={{ ...COVER, ...kb }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      {frames && frames > 1 && frames < durationInFrames ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      {darken > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${darken})` }} /> : null}
    </AbsoluteFill>
  );
};

// AVATAR: el talking-head de AvatarForever, full-screen por corte. Push MUY leve (regla 2: avatar
// full con Ken-Burns lento, nunca estático), sin oscurecer, sin loop (dura lo que dura su audio).
// ⛔ OffthreadVideo (nunca <Video>): en el render <Video> sirve cuadros equivocados = tirón.
export const MdsAvatar: React.FC<{ durationInFrames: number; src: string; seed: number }> = ({ seed, src }) => {
  const kb = useKenBurns(seed, 1.02, 0.02, 0.04);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={1} style={{ ...COVER, ...kb }} />
    </AbsoluteFill>
  );
};

// CAMA DE FOTO bajo todo componente full-screen.
export const MdsBed: React.FC<{ durationInFrames: number; src: string; seed: number; children?: React.ReactNode }> = ({ durationInFrames, src, seed, children }) => (
  <AbsoluteFill>
    <MdsFoto durationInFrames={durationInFrames} src={src} seed={seed} darken={0.42} />
    {children}
  </AbsoluteFill>
);
