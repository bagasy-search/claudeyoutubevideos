import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCymouse, TOTAL_FRAMES_CYMOUSE } from "./VideoEdit/Main_cymouse";

// Entry DEDICADO de cymouse. La comp se declara ACÁ MISMO (no importada de otro Root)
// por dos razones: el pre-vuelo del farm busca el id en este archivo, y así el runner
// no ve ninguna otra composición — src/index.ts es compartido y otras sesiones lo pisan.
const RootCymouse: React.FC = () => (
  <Composition
    id="Cymouse"
    component={MainCymouse}
    durationInFrames={TOTAL_FRAMES_CYMOUSE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootCymouse);
