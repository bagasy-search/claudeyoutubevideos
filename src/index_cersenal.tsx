import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCersenal, TOTAL_FRAMES_CERSENAL } from "./cersenal/Main";

const Root: React.FC = () => (
  <Composition id="Cersenal" component={MainCersenal}
    durationInFrames={TOTAL_FRAMES_CERSENAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
