// Piezas.tsx — los dos planos de b-roll de `clembudo`: CLIP (i2v, ya se mueve) y FOTO (Ken-Burns).
//
// ⛔⛔⛔ EL KEN-BURNS ES LA REGLA QUE MÁS SE ROMPE, y el creador la marcó cross-nicho:
//   "todos los zooms en imágenes son IDÉNTICOS, algunos deben ser zoom out no todos zoom in hacia
//    el centro, y al azar — no siempre out luego in luego out perfecto sino al azar"
//   y en el mismo mensaje: "no estás animando ninguna imagen".
// Son EL MISMO defecto. El helper típico recibe `from`/`to` CONSTANTES: todas las fotos hacen el
// mismo zoom in, a la misma velocidad, hacia el mismo centro, y el seed sólo elige el lado del
// paneo. Además 7 % repartidos en todo el plano son ~1,5 %/s, que el ojo lee como foto quieta.
//
// Lo que el seed decide acá, TODO por plano y TODO al azar (no alternado):
//   · sentido: ~50 % in / ~50 % out  (⛔ nunca un patrón out-in-out-in: es tan mecánico como
//     que sean todos iguales)
//   · amplitud: 1,8-4,0 %/s con techo total 20 %  (1,5 %/s es lo que se vio como "no animaste nada")
//   · foco: transformOrigin sorteado en 35-65 % en los dos ejes, para que el zoom NO vaya siempre
//     al centro, más un paneo en un ángulo cualquiera (no sólo horizontal)
//   · seguridad de borde: el paneo va atado a la ESCALA (k = (z-zBase)/amp), así el traslado máximo
//     coincide con la escala máxima y nunca asoma el fondo.
//
// ⛔ Y EL GENERADOR IMPORTA: `Math.sin(seed*12.9898)*43758.5453` con seeds grandes (el seed es el
// frame de arranque) pierde precisión y se correlaciona — medido: racha de 11 y reparto 43/57.
// Con hash entero da racha 8 y 47/53, que es la mediana exacta del azar justo.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

const hash = (n: number): number => {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const GRADE = (
  <>
    {/* grade terroso del canal: nada de filtro de color, sólo negro levantado y viraje mínimo */}
    <AbsoluteFill style={{ background: "rgba(169,121,74,0.045)", mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: "radial-gradient(92% 78% at 50% 46%, rgba(0,0,0,0) 52%, rgba(28,24,18,0.34) 100%)" }} />
  </>
);

// ── CLIP: el material ya se mueve solo. NADA de Ken-Burns encima, sólo un empuje mínimo ──────
export const ClClip: React.FC<{ durationInFrames: number; src: string; startFrom?: number }> =
  ({ durationInFrames, src, startFrom = 0 }) => {
    const f = useCurrentFrame();
    // para los CLIPS alcanza con la mitad de la amplitud (0,6-1,4 %/s): ya tienen movimiento propio
    const s = hash(startFrom * 31 + src.length * 7);
    const pps = 0.006 + s * 0.008;
    const amp = Math.min(pps * (durationInFrames / 30), 0.09);
    const out = hash(src.length * 977 + startFrom) < 0.5;
    const z = 1.02 + (out ? amp : 0) + (out ? -1 : 1) * amp * interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.25, 1) });
    return (
      <AbsoluteFill style={{ backgroundColor: "#1C1812", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})` }}
        />
        {GRADE}
      </AbsoluteFill>
    );
  };

// ── FOTO: acá SÍ va el Ken-Burns, y va sorteado ──────────────────────────────────────────────
export const ClPhoto: React.FC<{ durationInFrames: number; src: string; seed?: number }> =
  ({ durationInFrames, src, seed = 0 }) => {
    const f = useCurrentFrame();
    const S = seed || src.length * 131 + durationInFrames;

    const esOut = hash(S * 3) < 0.5;                       // ~50/50, sorteado, NO alternado
    const pps = 0.018 + hash(S * 5) * 0.022;               // 1,8-4,0 %/s
    const segs = durationInFrames / 30;
    const amp = Math.min(pps * segs, 0.20);                // techo total 20 %
    const ox = 35 + hash(S * 7) * 30;                      // foco 35-65 %, los dos ejes
    const oy = 35 + hash(S * 11) * 30;
    const ang = hash(S * 13) * Math.PI * 2;                // paneo en un ángulo CUALQUIERA

    const zBase = 1.06;
    const t = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.28, 1),
    });
    const z = esOut ? zBase + amp * (1 - t) : zBase + amp * t;
    // ⛔ el paneo va atado a la ESCALA, no al tiempo: así el traslado máximo coincide siempre con
    // la escala máxima y el fondo no asoma nunca por el borde.
    const k = amp > 0 ? (z - zBase) / amp : 0;
    const dx = Math.cos(ang) * 2.0 * k;                    // ≤2 % en X
    const dy = Math.sin(ang) * 1.2 * k;                    // ≤1,2 % en Y

    return (
      <AbsoluteFill style={{ backgroundColor: "#1C1812", overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
            // el movimiento va por el transform de Remotion (subpíxel), NUNCA horneado con
            // `zoompan` de ffmpeg, que cuantiza a píxel entero y se lee como tirón.
            transform: `scale(${z.toFixed(4)}) translate(${dx.toFixed(3)}%, ${dy.toFixed(3)}%)`,
          }}
        />
        {GRADE}
      </AbsoluteFill>
    );
  };
