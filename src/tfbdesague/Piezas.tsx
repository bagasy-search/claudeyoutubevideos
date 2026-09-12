// Piezas.tsx — primitivas del montaje de `tfbdesague` (The Free Builder / El Constructor Libre).
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>`. Al RENDERIZAR, `<Video>` monta un
// elemento HTML que busca POR TIEMPO y no acierta el cuadro exacto: repite y saltea cuadros de forma
// IRREGULAR, y eso se lee como TIRÓN. Es la causa #1 del "se ve todo lageado".
import React from "react";
import {
  AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

const INK = "#0A0B08";

/** Hash ENTERO determinista (mulberry-ish).
 *  ⛔ NO `Math.sin(seed*12.9898)*43758.5453`: con seeds grandes (acá el seed es el frame de arranque
 *  del plano) pierde precisión y se CORRELACIONA — medido en `pinluz`: racha de 11 planos con el
 *  mismo sentido de zoom y reparto 43/57. Con hash entero dio racha 8 y 47/53, la mediana exacta
 *  del azar. Y el farm rinde en 60 chunks separados: cada uno tiene que dar EXACTAMENTE lo mismo,
 *  así que nunca `Math.random`.
 *  ⚠️ Esta función es la MISMA que replica la compuerta de Ken-Burns del build: si se toca una,
 *  se toca la otra, o la compuerta mide una cosa distinta de la que se dibuja. */
export const hash2 = (a: number, b: number): number => {
  let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (b | 0) ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};

/** KEN-BURNS VARIADO — ⛔ REGLA DURA, CROSS-NICHO (creador, 2026-09-10):
 *  *"todos los zooms en imágenes son IDÉNTICOS, algunos deben ser zoom out no todos zoom in hacia
 *  el centro, y al azar — no siempre zoom out luego in luego out perfecto sino al azar"*.
 *  Cuatro cosas varían por plano, todas del MISMO seed:
 *    1. SENTIDO   in/out sorteado (⛔ NO alternado: alternar es otro metrónomo)
 *    2. RECORRIDO cuánto zoom (no todos el mismo salto)
 *    3. ORIGEN    30-70 % en los dos ejes (el zoom NO va siempre al centro)
 *    4. DERIVA    ángulo propio en X e Y
 *  ⚠️ COBERTURA: la deriva se ata a la ESCALA, no al tiempo, y se topa en
 *  min(o,100-o)·(escalaMIN-1) para que el paneo NUNCA destape el fondo. */
const useKenBurns = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);

  const acerca = hash2(seed, 2) > 0.5;
  const amp = 0.045 + hash2(seed, 3) * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi;
  const hasta = acerca ? hi : lo;

  const ox = 30 + hash2(seed, 5) * 40;
  const oy = 30 + hash2(seed, 7) * 40;

  const escalaMin = Math.min(desde, hasta);
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (escalaMin - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = hash2(seed, 11) * Math.PI * 2;

  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP real a sangre.
 *  ⛔ `loop` NO es una prop de `OffthreadVideo`: cae en el `...props`, se ignora en SILENCIO, y el
 *  último cuadro se CONGELA el resto del plano (el "plano muerto"). Se envuelve en `<Loop>` con los
 *  cuadros REALES del archivo, que el build mide con `ffprobe -count_packets`.
 *  ⛔ `speed` no se toca: `Media.tsx` del kit tiene `speed = 0.6` por defecto y todo clip montado sin
 *  él sale en cámara lenta — acá no pasamos por ese componente, se monta el video directo. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const t = useKenBurns(seed, 1.03, 0.075);   // el clip ya se mueve solo: recorrido más corto
  const video = (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", ...t }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.05, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** CAMA DE FOTO debajo de TODO componente.
 *  ⛔ Los componentes full-screen del kit dejan margen alrededor; con el avatar tapado y nada
 *  debajo, ese marco muestra el fondo plano (medido: 256 instantes de fondo a la vista en
 *  `paredhidro`). Va SIEMPRE, en todo el video, no sólo donde no hay avatar. */
export const Cama: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.06, 0.06);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.62)", ...t }}
      />
    </AbsoluteFill>
  );
};
