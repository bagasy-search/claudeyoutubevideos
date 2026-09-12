import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainAloebrazo, TOTAL_FRAMES_ALOEBRAZO } from "./aloebrazo/Main_aloebrazo";
const RootAloebrazo: React.FC = () => (
  <Composition id="Aloebrazo" component={MainAloebrazo} durationInFrames={TOTAL_FRAMES_ALOEBRAZO} fps={30} width={1920} height={1080} />
);
registerRoot(RootAloebrazo);
