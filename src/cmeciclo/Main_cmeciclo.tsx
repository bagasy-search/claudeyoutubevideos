// GENERADO por build_cmeciclo.mjs. Sin subtítulos, por diseño.
import React from "react";
import {AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile} from "remotion";
import {RawShot} from "../VideoEdit/scenes/RawShot";
import {CUES_CMECICLO} from "./cues_cmeciclo.gen";

export const TOTAL_FRAMES_CMECICLO = 40181;
export const AVATAR_FRAMES_CMECICLO = 12374;

// ⛔ OffthreadVideo, NUNCA <Video>: en el render <Video> monta un <video> del navegador que
// busca por TIEMPO y devuelve el cuadro más cercano que tenga listo. Sobre un mp4 largo y con
// 60 chunks arrancando cada uno en otro punto, sirve cuadros equivocados = tirón irregular.
const AvatarVid: React.FC = () => (
  <OffthreadVideo
    src={staticFile("cmeciclo_opt.mp4")}
    muted
    style={{width:"100%",height:"100%",objectFit:"cover"}}
  />
);

// El avatar es el PISO del video: está FULL siempre. El creador grabó 6.9 min
// de un video de 22.3 min, así que a partir de ahí entra en bucle. El bucle
// arranca EXACTAMENTE en AVATAR_FRAMES: un solo frame de aire ahí sería pantalla negra.
const AvatarFloor: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:"#10100d",overflow:"hidden"}}>
    <Sequence from={0} durationInFrames={AVATAR_FRAMES_CMECICLO}><AvatarVid /></Sequence>
    <Sequence from={AVATAR_FRAMES_CMECICLO} durationInFrames={Math.max(1, TOTAL_FRAMES_CMECICLO - AVATAR_FRAMES_CMECICLO)}>
      <Loop durationInFrames={AVATAR_FRAMES_CMECICLO}><AvatarVid /></Loop>
    </Sequence>
  </AbsoluteFill>
);

export const MainCmeciclo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:"#10100d"}}>
    <AvatarFloor />
    {CUES_CMECICLO.map((cue) => (
      <Sequence key={cue.key} from={cue.f0} durationInFrames={cue.f1 - cue.f0} premountFor={30}>
        {cue.kind === "clip" ? (
          <OffthreadVideo src={staticFile(cue.src)} muted playbackRate={1}
            style={{width:"100%",height:"100%",objectFit:"cover"}} />
        ) : (
          <RawShot durationInFrames={cue.f1 - cue.f0} src={cue.src} darken={0} blur={0}
            kbBoost={cue.card ? 0.12 : 0.5} fit={cue.card ? "contain" : "cover"} />
        )}
      </Sequence>
    ))}
    <Audio src={staticFile("cmeciclo.m4a")} />
  </AbsoluteFill>
);
