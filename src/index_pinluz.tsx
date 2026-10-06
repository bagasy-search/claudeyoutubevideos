import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPinluz, TOTAL_FRAMES_PINLUZ } from "./pinluz/Main_pinluz";

const Root: React.FC = () => (
  <Composition id="Pinluz" component={MainPinluz}
    durationInFrames={TOTAL_FRAMES_PINLUZ} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
