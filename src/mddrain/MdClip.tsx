// MdClip.tsx — el plano de b-roll del video `mdmold`: un pedazo de los clips i2v de Mike
// (`public/broll/mdmold_h*.mp4`, 1280x704, 5,04 s) recortado a la duración que pide el beat.
//
// Por qué existe: el kit del canal (`RawShot`) está hecho para FOTOS con Ken-Burns. Acá el
// material ya se mueve solo, así que:
//   · nada de Ken-Burns encima (el movimiento ya está adentro del clip),
//   · `startFrom` para entrar en el momento útil del clip y poder reusar el mismo asset en
//     varios beats sin que se note (cada uso entra por otro lado),
//   · grade del canal (negro levantado, leve viraje rojo) para que pegue con los movimientos.
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

export const MdClip: React.FC<{
  durationInFrames: number;
  src: string;          // "broll/mdmold_h07_toothbrush.mp4"
  startFrom?: number;   // frame de entrada DENTRO del clip (24 fps de origen → ver build)
  darken?: number;
  push?: number;        // empuje sutil de cámara; 0 = ninguno
  flash?: boolean;      // destello de entrada (para las ráfagas cortas)
}> = ({ durationInFrames, src, startFrom = 0, darken = 0.1, push = 0.012, flash = false }) => {
  const frame = useCurrentFrame();
  // empuje muy leve: el clip ya tiene movimiento propio, esto sólo evita que se sienta pegado
  const s = 1 + push * interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const fl = flash ? interpolate(frame, [0, 3], [0.22, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        startFrom={startFrom}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }}
      />
      {/* grade del canal: negro levantado + viraje rojo muy leve */}
      <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${darken})` }} />
      <AbsoluteFill
        style={{ background: "radial-gradient(88% 74% at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.5) 100%)" }}
      />
      {fl > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${fl})` }} />}
    </AbsoluteFill>
  );
};
