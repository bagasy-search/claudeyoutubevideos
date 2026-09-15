// MdgFoto — foto con Ken-Burns ALEATORIO por plano (sentido/amplitud/origen/deriva sorteados,
// determinista por seed = frame de arranque). Para camas de componente y respaldo de clip.
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// hash entero mulberry-ish (no Math.sin, que se correlaciona con seeds grandes)
const rnd = (n: number) => {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const useKenBurns = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r1 = rnd(seed * 1.7 + 11.3), r2 = rnd(seed * 3.1 + 37.7), r3 = rnd(seed * 5.3 + 71.1);
  const r4 = rnd(seed * 7.9 + 113.9), r5 = rnd(seed * 11.3 + 167.3);
  const acerca = r1 < 0.5;
  const amp = 0.045 + r2 * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + r3 * 40, oy = 30 + r4 * 40;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r5 * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

export const MdgFoto: React.FC<{ durationInFrames: number; src: string; seed: number; darken?: number }> = ({
  src, seed, darken = 0,
}) => {
  const t = useKenBurns(seed, 1.06, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
      {darken > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${darken})` }} />}
    </AbsoluteFill>
  );
};
