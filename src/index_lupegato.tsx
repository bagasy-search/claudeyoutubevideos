import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupegato, TOTAL_FRAMES_LUPEGATO } from "./VideoEdit/Main_lupegato";

const RootLupegato: React.FC = () => (
  <Composition id="Lupegato" component={MainLupegato} durationInFrames={TOTAL_FRAMES_LUPEGATO} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupegato);
