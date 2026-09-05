import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkbottle, TOTAL_FRAMES_RKBOTTLE } from "./VideoEdit/Main_rkbottle";

const RootRkbottle: React.FC = () => (
  <Composition id="Rkbottle" component={MainRkbottle} durationInFrames={TOTAL_FRAMES_RKBOTTLE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkbottle);
