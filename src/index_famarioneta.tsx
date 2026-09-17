import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFamarioneta, TOTAL_FRAMES_FAMARIONETA } from "./famarioneta/Main";

const RootFamarioneta: React.FC = () => (
  <Composition id="Famarioneta" component={MainFamarioneta} durationInFrames={TOTAL_FRAMES_FAMARIONETA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFamarioneta);
