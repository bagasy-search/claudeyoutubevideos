import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPinservice, TOTAL_FRAMES_PINSERVICE } from "./pinservice/Main_pinservice";

const Root: React.FC = () => (
  <Composition id="Pinservice" component={MainPinservice}
    durationInFrames={TOTAL_FRAMES_PINSERVICE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
