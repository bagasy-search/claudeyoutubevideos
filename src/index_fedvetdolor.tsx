import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvetdolor, TOTAL_FRAMES_FEDVETDOLOR } from "./VideoEdit/Main_fedvetdolor";

const RootFedvetdolor: React.FC = () => (
  <Composition id="Fedvetdolor" component={MainFedvetdolor} durationInFrames={TOTAL_FRAMES_FEDVETDOLOR} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvetdolor);
