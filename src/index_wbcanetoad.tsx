import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbcanetoad, TOTAL_FRAMES_WBCANETOAD } from "./VideoEdit/Main_wbcanetoad";

const RootWbcanetoad: React.FC = () => (
  <Composition id="Wbcanetoad" component={MainWbcanetoad} durationInFrames={TOTAL_FRAMES_WBCANETOAD} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbcanetoad);
