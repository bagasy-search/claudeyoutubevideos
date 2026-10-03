import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupealma, TOTAL_FRAMES_LUPEALMA } from "./VideoEdit/Main_lupealma";

const RootLupealma: React.FC = () => (
  <Composition id="Lupealma" component={MainLupealma} durationInFrames={TOTAL_FRAMES_LUPEALMA} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupealma);
