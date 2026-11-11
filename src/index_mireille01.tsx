import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainMireille01, TOTAL_FRAMES_MIREILLE01 } from "./mireille/Main";

const Root: React.FC = () => (
  <Composition id="Mireille01" component={MainMireille01}
    durationInFrames={TOTAL_FRAMES_MIREILLE01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
