// Main_cmesodimac.tsx — GENERADO por build_cmesodimac.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMESODIMAC } from "./cues_cmesodimac.gen";

export const TOTAL_FRAMES_CMESODIMAC = 44281;
const AVATAR_FRAMES = 22834;
const LOOP_START = 22844;

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo.
 *  ⛔ NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Lleva un push lento
 *  y cíclico (período 30 s) que nunca recorta al sujeto y que hace que los tramos en los que se
 *  lo ve solo —el hook de los primeros 14 s, el escudo de honestidad, la confesión— respiren. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <Video src={staticFile("cmesodimac_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_CMESODIMAC - LOOP_START}>
        <Video src={staticFile("cmesodimac_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainCmesodimac: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMESODIMAC.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMESODIMAC.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmesodimac.wav")} />
    </AbsoluteFill>
  );
};
