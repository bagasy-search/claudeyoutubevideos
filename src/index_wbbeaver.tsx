import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbbeaver, TOTAL_FRAMES_WBBEAVER } from "./VideoEdit/Main_wbbeaver";

const RootWbbeaver: React.FC = () => (
  <Composition id="Wbbeaver" component={MainWbbeaver} durationInFrames={TOTAL_FRAMES_WBBEAVER} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbbeaver);
