import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLinh01, TOTAL_FRAMES_LINH01 } from "./linh/Main";

const Root: React.FC = () => (
  <Composition id="Linh01" component={MainLinh01}
    durationInFrames={TOTAL_FRAMES_LINH01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
