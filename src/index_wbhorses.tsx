import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbhorses, TOTAL_FRAMES_WBHORSES } from "./VideoEdit/Main_wbhorses";

const RootWbhorses: React.FC = () => (
  <Composition id="Wbhorses" component={MainWbhorses} durationInFrames={TOTAL_FRAMES_WBHORSES} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbhorses);
