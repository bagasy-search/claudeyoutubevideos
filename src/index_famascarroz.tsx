import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFamascarroz, TOTAL_FRAMES_FAMASCARROZ } from "./VideoEdit/Main_famascarroz";

const RootFamascarroz: React.FC = () => (
  <Composition id="Famascarroz" component={MainFamascarroz} durationInFrames={TOTAL_FRAMES_FAMASCARROZ} fps={30} width={1920} height={1080} />
);
registerRoot(RootFamascarroz);
