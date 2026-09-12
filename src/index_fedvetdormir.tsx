import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvetdormir, TOTAL_FRAMES_FEDVETDORMIR } from "./VideoEdit/Main_fedvetdormir";

const RootFedvetdormir: React.FC = () => (
  <Composition id="Fedvetdormir" component={MainFedvetdormir} durationInFrames={TOTAL_FRAMES_FEDVETDORMIR} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvetdormir);
