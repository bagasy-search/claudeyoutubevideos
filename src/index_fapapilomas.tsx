import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFapapilomas, TOTAL_FRAMES_FAPAPILOMAS } from "./VideoEdit/Main_fapapilomas";

const RootFapapilomas: React.FC = () => (
  <Composition id="Fapapilomas" component={MainFapapilomas} durationInFrames={TOTAL_FRAMES_FAPAPILOMAS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFapapilomas);
