import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCk11a, TOTAL_FRAMES_CK11A } from "./ck11a/Main";

const Root: React.FC = () => (
  <Composition id="Ck11a" component={MainCk11a}
    durationInFrames={TOTAL_FRAMES_CK11A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
