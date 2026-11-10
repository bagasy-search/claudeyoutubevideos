import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainMeihua01, TOTAL_FRAMES_MEIHUA01 } from "./meihua/Main";

const Root: React.FC = () => (
  <Composition id="Meihua01" component={MainMeihua01}
    durationInFrames={TOTAL_FRAMES_MEIHUA01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
