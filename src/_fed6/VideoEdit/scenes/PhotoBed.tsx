import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

// ═══════════════════════════════════════════════════════════════════════════
// PHOTO BED — la CAMA de un cue de componente. Port del `PhotoBed` de
// `src/abuela/RayStage.tsx`, que es el mecanismo con el que el MOLDE
// (`fcsmanos10`) viene renderizando: 53 de 53 componentes con `props.bed`, y
// `blackdetect d=0.2 pix_th=0.10` da **0 tramos negros**.
//
// ⛔ POR QUÉ EXISTE (ver _BUGS_fed6_integracion.md #6 y #6-bis). En el kit _fed6
//    `Panel` y `Cinema` NO pintan una placa opaca: son TRATAMIENTOS del footage
//    (`Cinema paper={0}`; el propio Panel dice "NADA DE PLACA/MARCO … el fondo se
//    DESENFOCA y las piezas flotan sobre él"). Un componente montado como cue
//    BASE no tiene footage, así que el tratamiento se aplica al vacío y da negro;
//    encima `useBeat` arranca con `op = 0` y los primeros cuadros son negro PURO.
//    Medido: `fcsunaclavada` entregado = 57 tramos negros, los 57 en el arranque
//    de un cue de componente. `fcspuntos` = 119.
//
// ★ LA PROPIEDAD QUE IMPORTA: sin `src` NO se cae a transparente — pinta un
//   degradado OPACO. Así, aunque se escape un bed sin imagen, nunca vuelve a
//   haber un cuadro negro. Es la red de seguridad, no el camino feliz: el build
//   falla si un componente no trae cama.
// ═══════════════════════════════════════════════════════════════════════════

const INK0 = "#08110F";
const INK2 = "#16261F";

export const PhotoBed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.50 }) => {
  const frame = useCurrentFrame();
  // respiración lentísima: que la cama no quede clavada detrás del gráfico
  const z = 1.04 + Math.sin(frame / 240) * 0.012;
  if (!src) {
    return <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, ${INK2} 0%, ${INK0} 70%)` }} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: INK0, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${(1 - dim).toFixed(2)}) saturate(0.82)`,
          transform: `scale(${z.toFixed(4)})`,
        }}
      />
      {/* scrim: hunde arriba y abajo para que el gráfico despegue */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(8,17,15,0.50) 0%, rgba(8,17,15,0.32) 46%, rgba(8,17,15,0.72) 100%)` }} />
      <AbsoluteFill
        style={{
          opacity: 0.045,
          backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
