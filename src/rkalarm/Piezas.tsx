// src/rkalarm/Piezas.tsx — piezas PROPIAS de rkalarm.
//
// ⛔ POR QUE EXISTE ESTE ARCHIVO Y NO SE TOCA `rksafe/RayStage.tsx`:
//    RayStage es COMPARTIDO por raybar1 / raydoor1 / rkbottle / raygarage / rkbill (y hay otra
//    sesion trabajando en el repo ahora mismo). Cambiar su `Foto` cambiaria el movimiento de
//    cinco videos ya entregados. Las piezas que este video necesita distintas viven aca.
//
// ⛔ QUE ARREGLA (regla PERMANENTE del creador, cross-nicho):
//    *"todos los zooms en imagenes son IDENTICOS, algunos deben ser zoom out no todos zoom in
//      hacia el centro, y al azar — no siempre zoom out luego in luego out perfecto sino al azar"*
//    *"no estas animando ninguna imagen"*
//    El `Foto` de RayStage hace SIEMPRE: 1.02 -> 1.075 (zoom IN), la MISMA cantidad, hacia el
//    CENTRO. Son ~0,63 %/s — por debajo del 1,5 %/s que el creador lee como imagen quieta. Lo
//    unico que variaba con el seed era el SIGNO del paneo lateral.
//
// ⛔ EL GENERADOR PSEUDOALEATORIO IMPORTA: `Math.sin(seed*12.9898)*43758.5453` con seeds grandes
//    (el seed es el frame de arranque del plano) pierde precision y se CORRELACIONA — medido en
//    `pinluz`: racha de 11 y reparto 43/57. Con un hash entero (mulberry-ish sobre Math.imul) dio
//    racha 8 y 47/53, que es la mediana exacta del azar.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, Loop } from "remotion";
import { V, enter } from "../rksafe/RayStage";

/** Hash entero determinista (el farm rinde en 60 chunks: NUNCA Math.random). */
export const hrnd = (seed: number, sal: number) => {
  let t = (Math.imul(seed | 0, 0x9e3779b1) ^ Math.imul(sal | 0, 0x85ebca6b)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Ken-Burns con las CUATRO cosas sorteadas por plano (sentido, recorrido, foco y deriva).
 * `ampSeg` = [min,max] de % de escala POR SEGUNDO. Fotos 1,8-4,0 · clips 0,6-1,4 (ya se mueven).
 */
export const useKB = (seed: number, base: number, ampSegMin: number, ampSegMax: number, dur?: number) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const n = Math.max(2, dur ?? cfg.durationInFrames);
  const segs = n / 30;

  // 1) SENTIDO — al azar por plano, NO alternado (alternar es otro metronomo)
  const acerca = hrnd(seed, 1) < 0.5;
  // 2) RECORRIDO — %/s sorteado, con techo total de 20% para que no se empaste
  const ampSeg = ampSegMin + (ampSegMax - ampSegMin) * hrnd(seed, 2);
  const amp = Math.min(0.20, (ampSeg * segs) / 100);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  // 3) FOCO — el zoom NO va siempre al centro
  const ox = 30 + 40 * hrnd(seed, 3);
  const oy = 30 + 40 * hrnd(seed, 4);
  // 4) DERIVA — atada a la ESCALA, no al tiempo, asi el traslado maximo coincide con la escala
  //    maxima y NUNCA asoma el fondo. techo = min(ox,100-ox,oy,100-oy) * (escalaMIN - 1)
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = hrnd(seed, 5) * Math.PI * 2;

  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.3, 1) });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** FOTO a sangre — Ken-Burns sorteado de verdad. */
export const Foto: React.FC<{ src: string; seed?: number; durationInFrames?: number }> = ({ src, seed = 1, durationInFrames }) => {
  const t = useKB(seed, 1.06, 1.8, 4.0, durationInFrames);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/**
 * CLIP a sangre. OffthreadVideo SIEMPRE (con <Video> el render sirve cuadros EQUIVOCADOS).
 * ⛔ `loop` NO es prop de OffthreadVideo: cae en ...props y se ignora EN SILENCIO, y el clip se
 *    CONGELA el resto del slot. Va <Loop durationInFrames={frames}> con los cuadros REALES.
 */
export const Clip: React.FC<{ src: string; rate?: number; frames?: number; seed?: number; durationInFrames?: number }> = ({ src, rate = 1, frames, seed = 1, durationInFrames }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 6);
  const t = useKB(seed, 1.03, 0.6, 1.4, durationInFrames);
  const v = (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate}
      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: a, ...t }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={Math.round(frames / Math.max(0.01, rate))}>{v}</Loop> : v}
    </AbsoluteFill>
  );
};
