// GENERADO por build_cmepanel30.mjs — no editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CUES, MOVS, renderCue, renderMov } from "./cues_cmepanel30.gen";

export const TOTAL_FRAMES_CMEPANEL30 = 43657;

const AVATAR = "cmepanel30_opt.mp4";
const V = { width: "100%", height: "100%", objectFit: "cover" } as const;

/**, NUNCA <Video>. Medido en cmepanel30 (ago-2026): con <Video> el avatar servia
 *  CUADROS EQUIVOCADOS -- cuatro cuadros seguidos del render mostraban los fotogramas
 *  13952, 13948, 13954, 13953 de la fuente (desfases +2, -3, +2, 0). El creador lo vio
 *  como 'el avatar se re contra lagea', y es el MISMO bug en todos los videos del repo
 *  que usan <Video>. Causa: el farm rinde en chunks paralelos y cada Chrome le pide al
 *  elemento de video que salte a un tiempo; con un mp4 largo el decodificador no llega
 *  y devuelve el cuadro que tiene a mano. OffthreadVideo extrae el cuadro exacto con
 *  ffmpeg y no depende del navegador. */
/** El avatar del creador dura 18683 f y el audio 43657: va en BUCLE, dos pasadas.
 *  Los dos saltos (18695 y 37378) los tapa contenido a pantalla completa. */
const AvatarLayer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <Sequence from={0} durationInFrames={18683}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
    <Sequence from={18695} durationInFrames={18683}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
    <Sequence from={37378} durationInFrames={43657 - 37378}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
  </AbsoluteFill>
);

export const MainCmepanel30: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <AvatarLayer />
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        {renderCue(c)}
      </Sequence>
    ))}
    {MOVS.map((m) => (
      <Sequence key={m.key} from={m.from} durationInFrames={m.dur} layout="none">
        {renderMov(m)}
      </Sequence>
    ))}
    {/* un solo <Audio> con el master completo; el <Video> va MUTEADO */}
    <Audio src={staticFile("cmepanel30.wav")} />
  </AbsoluteFill>
);
