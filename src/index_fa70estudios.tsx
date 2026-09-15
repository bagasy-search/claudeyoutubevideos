import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFa70estudios, TOTAL_FRAMES_FA70ESTUDIOS } from "./VideoEdit/Main_fa70estudios";

const RootFa70estudios: React.FC = () => (
  <Composition id="Fa70estudios" component={MainFa70estudios} durationInFrames={TOTAL_FRAMES_FA70ESTUDIOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFa70estudios);
