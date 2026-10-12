import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoMin1 } from "./Min1";

const Root: React.FC = () => (
  <Composition id="SuenganoMin1" component={SuenganoMin1} durationInFrames={1950} fps={30} width={1280} height={720} />
);

registerRoot(Root);
