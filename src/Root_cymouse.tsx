import React from "react";
import { Composition } from "remotion";
import { MainCymouse, TOTAL_FRAMES_CYMOUSE } from "./VideoEdit/Main_cymouse";

// Root DEDICADO de cymouse. Existe para que el farm NO caiga en src/index.ts, que es
// compartido: otras sesiones lo repisan y el render sale con el video de otro
// ("Available compositions: Azotea2"). Con este entry, el runner sólo ve esta comp.
export const RootCymouse: React.FC = () => (
  <>
    <Composition
      id="Cymouse"
      component={MainCymouse}
      durationInFrames={TOTAL_FRAMES_CYMOUSE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
