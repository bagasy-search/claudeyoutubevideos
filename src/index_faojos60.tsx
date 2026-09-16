import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFaojos60, TOTAL_FRAMES_FAOJOS60 } from "./VideoEdit/Main_faojos60";

const RootFaojos60: React.FC = () => (
  <Composition id="Faojos60" component={MainFaojos60} durationInFrames={TOTAL_FRAMES_FAOJOS60} fps={30} width={1920} height={1080} />
);
registerRoot(RootFaojos60);
