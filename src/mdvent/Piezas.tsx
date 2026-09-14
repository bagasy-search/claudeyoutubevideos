// src/mdgrout/Piezas.tsx — piezas de render del video `mdgrout` (canal Mike Dalton, EN).
// ⛔ Los `export const` son PROPIOS (MdgFoto/MdgClip/MdgBed): clonar un archivo y dejarle el
//    nombre viejo hace que el import nombrado llegue `undefined` -> React #130 -> mueren los 60
//    chunks, y `tsc` no lo marca.
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// hash entero determinista. ⛔ NUNCA Math.random (el farm rinde en 60 chunks y cada uno tiene que
// dar lo mismo), y ⛔ NUNCA Math.sin(seed*12.9898)*43758.5453: con seeds grandes pierde precisión
// y se correlaciona (medido: racha de 11 del mismo sentido y reparto 43/57).
const rnd = (s: number): number => {
  let h = Math.imul(Math.round(s) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// KEN BURNS AL AZAR — regla dura del creador, cross-nicho: "todos los zooms son IDÉNTICOS, algunos
// deben ser zoom out, y AL AZAR, no out-in-out-in perfecto". Varían CUATRO cosas por plano:
// sentido (50/50), amplitud, origen (no siempre el centro) y el ángulo de la deriva.
const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed * 2654435761 + o * 40503);
  const acerca = r(0) < 0.5;                       // AL AZAR, jamás alternado
  const amp = ampMin + (ampMax - ampMin) * r(7);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + 40 * r(13), oy = 30 + 40 * r(21);
  // COBERTURA DE BORDE: con objectFit cover y escala>=1 el cuadro está cubierto; lo que puede
  // destapar el fondo es la DERIVA. Se ata a la escala MÍNIMA y al origen, no al tiempo.
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

export const MdgFoto: React.FC<{ durationInFrames: number; src: string; seed: number; darken?: number }> = ({ src, seed, darken = 0.08 }) => {
  const kb = useKenBurns(seed, 1.06, 0.045, 0.12);   // fotos: 4,5%-12% de recorrido
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...COVER, ...kb }} />
      {darken > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${darken})` }} /> : null}
    </AbsoluteFill>
  );
};

export const MdgClip: React.FC<{
  durationInFrames: number; src: string; seed: number; frames?: number; darken?: number;
}> = ({ durationInFrames, src, seed, frames, darken = 0.1 }) => {
  const kb = useKenBurns(seed, 1.03, 0.045, 0.075);  // clips: ya tienen movimiento propio
  // ⛔ `loop` NO es una prop de OffthreadVideo: cae en ...props y se ignora EN SILENCIO, y el
  //    clip de agnes (~4-5 s) se CONGELA el resto de un plano de 8 s. El bucle va con <Loop>,
  //    con los cuadros REALES del archivo medidos por el build con ffprobe.
  const video = (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      // ⛔ `speed` default de Media.tsx es 0.6 = cámara lenta + judder. Va explícito en 1.
      playbackRate={1}
      style={{ ...COVER, ...kb }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      {frames && frames > 1 && frames < durationInFrames ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      {darken > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${darken})` }} /> : null}
    </AbsoluteFill>
  );
};

// CAMA DE FOTO bajo todo componente full-screen: sin ella el marco del componente muestra el
// fondo plano (y un ChapterTrailCard arranca sobre NEGRO ~1 s, que es pantalla muerta por capítulo).
export const MdgBed: React.FC<{ durationInFrames: number; src: string; seed: number; children?: React.ReactNode }> = ({ durationInFrames, src, seed, children }) => (
  <AbsoluteFill>
    <MdgFoto durationInFrames={durationInFrames} src={src} seed={seed} darken={0.42} />
    {children}
  </AbsoluteFill>
);
