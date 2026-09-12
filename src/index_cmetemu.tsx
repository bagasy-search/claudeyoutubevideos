import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmetemu, TOTAL_FRAMES_CMETEMU } from "./cmetemu/Main_cmetemu";
const RootCmetemu: React.FC = () => (
  <Composition id="Cmetemu" component={MainCmetemu} durationInFrames={TOTAL_FRAMES_CMETEMU} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmetemu);
