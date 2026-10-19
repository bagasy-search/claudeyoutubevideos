// apex02 · VIDEO ENTERO: los 15 minutos hechos a mano, encadenados en el tiempo absoluto de la voz (+1 s de cola en negro).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FPS } from "./lib";
import { M1 } from "./M1";
import { M2, OFF2 } from "./M2";
import { M3, OFF3 } from "./M3";
import { M4, OFF4 } from "./M4";
import { M5, OFF5 } from "./M5";
import { M6, OFF6 } from "./M6";
import { M7, OFF7 } from "./M7";
import { M8, OFF8 } from "./M8";
import { M9, OFF9 } from "./M9";
import { M10, OFF10 } from "./M10";
import { M11, OFF11 } from "./M11";
import { M12, OFF12 } from "./M12";
import { M13, OFF13 } from "./M13";
import { M14, OFF14 } from "./M14";
import { M15, OFF15 } from "./M15";

const PARTS: [React.FC<{ farm?: boolean }>, number][] = [[M1, 0], [M2, OFF2], [M3, OFF3], [M4, OFF4], [M5, OFF5], [M6, OFF6], [M7, OFF7], [M8, OFF8], [M9, OFF9], [M10, OFF10], [M11, OFF11], [M12, OFF12], [M13, OFF13], [M14, OFF14], [M15, OFF15]];
export const FULL_END = 980.66;
// GANCHO (19-oct): clip LTX en mano, ultra real, antes de la narración. Su sonido nativo va en la mezcla
// (aud/apex02_mix.wav ya viene corrida GANCHO segundos); acá va muteado.
export const GANCHO = 14.0;
export const GANCHO_SRC = "apex02/ltx/gancho.mp4";
export const FULL_FRAMES = Math.round((GANCHO + FULL_END + 1) * FPS);
export const Full: React.FC<{ farm?: boolean }> = ({ farm }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {!farm && <Audio src={staticFile("apex02_mix.wav")} />}
    <Sequence from={0} durationInFrames={Math.round(GANCHO * FPS)}>
      <AbsoluteFill><OffthreadVideo src={staticFile(GANCHO_SRC)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>
    {PARTS.map(([C, off], i) => {
      const from = Math.round((GANCHO + off) * FPS), to = Math.round((GANCHO + (PARTS[i + 1]?.[1] ?? FULL_END + 1)) * FPS);
      return <Sequence key={i} from={from} durationInFrames={to - from}><C farm /></Sequence>;
    })}
  </AbsoluteFill>
);
