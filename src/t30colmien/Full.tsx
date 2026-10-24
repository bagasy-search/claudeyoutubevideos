// t30colmien — video completo: 16 minutos (M1..M16). Sin audio (la mezcla va aparte, encfin la pega).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { END, S } from "./Shot";
import { M1 } from "./M1";
import { M2 } from "./M2";
import { M3 } from "./M3";
import { M4 } from "./M4";
import { M5 } from "./M5";
import { M6 } from "./M6";
import { M7 } from "./M7";
import { M8 } from "./M8";
import { M9 } from "./M9";
import { M10 } from "./M10";
import { M11 } from "./M11";
import { M12 } from "./M12";
import { M13 } from "./M13";
import { M14 } from "./M14";
import { M15 } from "./M15";
import { M16 } from "./M16";
const MS = [M1,M2,M3,M4,M5,M6,M7,M8,M9,M10,M11,M12,M13,M14,M15,M16];
export const FULL_FRAMES = S(END);
export const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {MS.map((M, i) => <Sequence key={i} from={i * 1800}><M /></Sequence>)}
  </AbsoluteFill>
);
