import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFacrema81, TOTAL_FRAMES_FACREMA81 } from "./VideoEdit/Main_facrema81";

const RootFacrema81: React.FC = () => (
  <Composition id="Facrema81" component={MainFacrema81} durationInFrames={TOTAL_FRAMES_FACREMA81} fps={30} width={1920} height={1080} />
);
registerRoot(RootFacrema81);
