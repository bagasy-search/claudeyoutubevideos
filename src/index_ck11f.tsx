import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCk11f, TOTAL_FRAMES_CK11B } from "./ck11f/Main";

const Root: React.FC = () => (
  <Composition id="Ck11f" component={MainCk11f}
    durationInFrames={TOTAL_FRAMES_CK11B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
