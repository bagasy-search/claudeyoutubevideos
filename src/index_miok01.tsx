import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainMiok01, TOTAL_FRAMES_MIOK01 } from "./miok/Main";

const Root: React.FC = () => (
  <Composition id="Miok01" component={MainMiok01}
    durationInFrames={TOTAL_FRAMES_MIOK01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
