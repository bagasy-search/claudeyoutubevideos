import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmekitsinpanel, TOTAL_FRAMES_CMEKITSINPANEL } from "./cmekitsinpanel/Main_cmekitsinpanel";

const Root: React.FC = () => (
  <Composition id="Cmekitsinpanel" component={MainCmekitsinpanel}
    durationInFrames={TOTAL_FRAMES_CMEKITSINPANEL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
