// Piezas.tsx — primitivas visuales de olivares2.
//
// ⛔ TODO VIDEO VA CON OffthreadVideo, NUNCA <Video>. Al renderizar, <Video> monta un elemento HTML
//    que busca por TIEMPO y no acierta el cuadro exacto: repite y saltea cuadros de forma IRREGULAR
//    y eso se lee como tirón en TODO el metraje. OffthreadVideo lo extrae con ffmpeg.
// ⛔ EL KEN-BURNS ES DISTINTO EN CADA PLANO. Sentido, amplitud, origen y deriva se sortean por
//    semilla (el cuadro de arranque del cue). Nunca Math.random: el farm rinde en 60 chunks y cada
//    uno tiene que dar lo mismo. Nunca alternar in/out/in/out: eso es otro metrónomo.
// ⛔ El generador pseudoaleatorio va con hash ENTERO (mulberry): Math.sin(seed*12.9898)*43758.5453
//    con semillas grandes pierde precisión y se correlaciona (racha de 11 y reparto 43/57 medidos).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const OL = {
  ink0: "#0C1412",
  paper: "#F4F1EA",
  green: "#2E7D57",
  amber: "#E8B14C",
};

/** hash entero -> [0,1). Determinista y sin correlación entre semillas correlativas. */
export const rnd = (seed: number) => {
  let t = (Math.imul(seed | 0, 0x6d2b79f5) + 0x9e3779b9) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Ken-Burns sorteado por plano. `ampMax` en fracción (0.12 = 12%). */
const useKenBurns = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r1 = rnd(seed * 1.7 + 11), r2 = rnd(seed * 3.1 + 37), r3 = rnd(seed * 5.3 + 71);
  const r4 = rnd(seed * 7.9 + 113), r5 = rnd(seed * 11.3 + 167);
  const acerca = r1 < 0.5;                               // AL AZAR, no alternado
  const amp = 0.045 + r2 * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + r3 * 40, oy = 30 + r4 * 40;            // el zoom NO va siempre al centro
  // el paneo se ata a la ESCALA: el traslado máximo coincide con la escala mínima y nunca destapa el fondo
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

const LLENA: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

/** CLIP animado: se reproduce UNA SOLA VEZ.
 *
 * ⛔ NUNCA <Loop>. Regla permanente del creador: no se repite un clip para rellenar un slot —
 *    y loopear es, literalmente, poner el mismo clip dos veces seguidas. Para llegar a la duración
 *    del slot se RALENTIZA, y a lo sumo a 0,5× (el doble de su largo real). Si aun así no llega,
 *    debajo está la FOTO BASE DEL MISMO PLANO con su propio Ken-Burns: misma escena, así que no es
 *    "repetir una imagen", es el plano que sigue vivo después de que el movimiento terminó.
 * `frames` = cuadros REALES del archivo · `dur` = cuadros del slot (los dos los mide el build).
 */
export const Clip: React.FC<{ src: string; img: string; seed: number; frames: number; dur: number }> = ({ src, img, seed, frames, dur }) => {
  const tv = useKenBurns(seed, 1.03, 0.075);
  const tf = useKenBurns(seed + 91, 1.06, 0.12);
  const rate = Math.max(0.5, Math.min(1, frames / Math.max(1, dur)));
  const cuadrosDelClip = Math.min(dur, Math.max(2, Math.round(frames / rate)));
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ ...LLENA, ...tf }} />
      <Sequence durationInFrames={cuadrosDelClip}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ ...LLENA, ...tv }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns propio. */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const t = useKenBurns(seed, 1.06, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...LLENA, ...t }} />
    </AbsoluteFill>
  );
};

/** EL AVATAR — fondo garantizado de todo el video. Nunca estático: push lento determinista. */
export const OlivAvatar: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: OL.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted
        style={{ ...LLENA, transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};
