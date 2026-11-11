import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCk11b, TOTAL_FRAMES_CK11B } from "./ck11b/Main";

const Root: React.FC = () => (
  <Composition id="Ck11b" component={MainCk11b}
    durationInFrames={TOTAL_FRAMES_CK11B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
