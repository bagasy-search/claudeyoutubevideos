import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsmanos10, TOTAL_FRAMES_FCSMANOS10 } from "./VideoEdit/Main_fcsmanos10";

const RootFcsmanos10: React.FC = () => (
  <Composition id="Fcsmanos10" component={MainFcsmanos10} durationInFrames={TOTAL_FRAMES_FCSMANOS10} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsmanos10);
