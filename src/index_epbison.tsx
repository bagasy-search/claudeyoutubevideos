import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainEpbison, TOTAL_FRAMES_EPBISON } from "./VideoEdit/Main_epbison";

const RootEpbison: React.FC = () => (
  <Composition id="Epbison" component={MainEpbison} durationInFrames={TOTAL_FRAMES_EPBISON} fps={30} width={1920} height={1080} />
);
registerRoot(RootEpbison);
