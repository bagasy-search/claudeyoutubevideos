import "./index.css";
import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainCmeciclo, TOTAL_FRAMES_CMECICLO} from "./cmeciclo/Main_cmeciclo";
const RootCmeciclo: React.FC = () => (
  <Composition id="Cmeciclo" component={MainCmeciclo} durationInFrames={TOTAL_FRAMES_CMECICLO}
    fps={30} width={1920} height={1080} />
);
registerRoot(RootCmeciclo);
