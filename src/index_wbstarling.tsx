import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbstarling, TOTAL_FRAMES_WBSTARLING } from "./VideoEdit/Main_wbstarling";

const RootWbstarling: React.FC = () => (
  <Composition id="Wbstarling" component={MainWbstarling} durationInFrames={TOTAL_FRAMES_WBSTARLING} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbstarling);
