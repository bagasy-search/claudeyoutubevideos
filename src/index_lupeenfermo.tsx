import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupeenfermo, TOTAL_FRAMES_LUPEENFERMO } from "./VideoEdit/Main_lupeenfermo";

const RootLupeenfermo: React.FC = () => (
  <Composition id="Lupeenfermo" component={MainLupeenfermo} durationInFrames={TOTAL_FRAMES_LUPEENFERMO} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupeenfermo);
