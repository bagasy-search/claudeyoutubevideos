import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainApamole, TOTAL_FRAMES_APAMOLE } from "./VideoEdit/Main_apamole";

const RootApamole: React.FC = () => (
  <Composition id="Apamole" component={MainApamole} durationInFrames={TOTAL_FRAMES_APAMOLE} fps={30} width={1920} height={1080} />
);
registerRoot(RootApamole);
