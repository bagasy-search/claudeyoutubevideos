import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Cámara a mano virtual: el balanceo lento de alguien que filma sosteniendo la cámara.
// No es el temblor que se sacó de CinematicWrap en jun-2026 (oscilaciones rápidas que movían el cuadro de una pieza):
// acá todo es ruido suave de 0,4-1,8 Hz, sobre todo giro (paneo/inclinación/rolido) con perspectiva y poco desplazamiento.
// En un mundo three.js usar manoCam() sobre la cámara 3D en vez del envoltorio CSS.

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ruido de valor 1D con interpolación quíntica (continuo en velocidad y aceleración → sin tirones)
const ruido = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * f * (f * (f * 6 - 15) + 10);
  const a = hash(i + seed * 57.31) * 2 - 1;
  const b = hash(i + 1 + seed * 57.31) * 2 - 1;
  return a + (b - a) * u;
};

// respiración lenta + reencuadre medio + pulso mínimo
const capas = (t: number, seed: number) =>
  ruido(t * 0.4, seed) + ruido(t * 0.9, seed + 11) * 0.35 + ruido(t * 1.8, seed + 23) * 0.06;

export type Mano = { pan: number; tilt: number; roll: number; x: number; y: number };

/** Desvío de cámara en el segundo t: grados (pan/tilt/roll) y px a 1920 de ancho (x/y). */
export const manoCam = (t: number, intensidad = 1, seed = 1): Mano => ({
  pan: capas(t, seed) * 0.6 * intensidad,
  tilt: capas(t, seed + 101) * 0.45 * intensidad,
  roll: capas(t, seed + 202) * 0.3 * intensidad,
  x: capas(t, seed + 303) * 8 * intensidad,
  y: capas(t, seed + 404) * 7 * intensidad,
});

/** Envuelve una capa 2D (avatar, foto, clip) como si la filmara alguien a mano. */
export const CamaraMano: React.FC<{ children: React.ReactNode; intensidad?: number; seed?: number }> = ({
  children,
  intensidad = 1,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const m = manoCam(frame / fps, intensidad, seed);
  const k = width / 1920;
  // margen para que el giro nunca deje ver el borde
  const escala = 1 + 0.05 * Math.min(1.5, intensidad);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1600 * k }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${m.x * k}px, ${m.y * k}px, 0) rotateX(${m.tilt}deg) rotateY(${m.pan}deg) rotateZ(${m.roll}deg) scale(${escala})`,
          willChange: "transform",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
