import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFamanchascara, TOTAL_FRAMES_FAMANCHASCARA } from "./famanchascara/Main_famanchascara";

const RootFamanchascara: React.FC = () => (
  <Composition id="Famanchascara" component={MainFamanchascara} durationInFrames={TOTAL_FRAMES_FAMANCHASCARA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFamanchascara);
