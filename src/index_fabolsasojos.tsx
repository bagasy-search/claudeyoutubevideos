import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFabolsasojos, TOTAL_FRAMES_FABOLSASOJOS } from "./VideoEdit/Main_fabolsasojos";

const RootFabolsasojos: React.FC = () => (
  <Composition id="Fabolsasojos" component={MainFabolsasojos} durationInFrames={TOTAL_FRAMES_FABOLSASOJOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFabolsasojos);
