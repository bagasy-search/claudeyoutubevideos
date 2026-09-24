import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFalifting, TOTAL_FRAMES_FALIFTING } from "./VideoEdit/Main_falifting";

const RootFalifting: React.FC = () => (
  <Composition id="Falifting" component={MainFalifting} durationInFrames={TOTAL_FRAMES_FALIFTING} fps={30} width={1920} height={1080} />
);
registerRoot(RootFalifting);
