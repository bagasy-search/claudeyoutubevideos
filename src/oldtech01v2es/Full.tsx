// oldtech01v2 · VIDEO ENTERO: los 10 minutos hechos a mano, encadenados en el tiempo absoluto de la voz.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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
import { MA, OFFA } from "./MA";
import { MB, OFFB } from "./MB";
import { MC, OFFC } from "./MC";
import { MD, OFFD } from "./MD";

// versión 20 min: los bloques A-D (voz Fish nueva, misma voz) se intercalan en los cortes de capítulo; los minutos viejos
// conservan su tiempo interno y se corren por lo que suman los bloques anteriores (ver D:/rtmp/oldtech01v2/ext/splice.json).
export const LA = 149.335, LB = 113.5, LC = 128.173, LD = 122.942;
const PARTS: [React.FC<{ farm?: boolean }>, number][] = [[M1, 0], [M2, OFF2], [MA, OFFA], [M3, OFF3 + LA], [M4, OFF4 + LA], [MB, OFFB],
  [M5, OFF5 + LA + LB], [MC, OFFC], [M6, OFF6 + LA + LB + LC], [M7, OFF7 + LA + LB + LC], [M8, OFF8 + LA + LB + LC], [MD, OFFD],
  [M9, OFF9 + LA + LB + LC + LD], [M10, OFF10 + LA + LB + LC + LD]];
export const FULL_END = 675.55 + LA + LB + LC + LD;
export const FULL_FRAMES = Math.round((FULL_END + 1) * FPS);
export const Full: React.FC<{ farm?: boolean }> = ({ farm }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {!farm && <Audio src={staticFile("oldtech01v2_full.wav")} />}
    {PARTS.map(([C, off], i) => {
      const from = Math.round(off * FPS), to = Math.round((PARTS[i + 1]?.[1] ?? FULL_END + 1) * FPS);
      return <Sequence key={i} from={from} durationInFrames={to - from}><C farm /></Sequence>;
    })}
  </AbsoluteFill>
);
