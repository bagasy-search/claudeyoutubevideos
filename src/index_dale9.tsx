import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale9, TOTAL_FRAMES_DALE9 } from "./VideoEdit/Main_dale9";

const RootDale9: React.FC = () => (
  <Composition id="Dale9" component={MainDale9} durationInFrames={TOTAL_FRAMES_DALE9} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale9);
