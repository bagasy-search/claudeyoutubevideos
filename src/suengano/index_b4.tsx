import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoB4 } from "./B4";

const Root: React.FC = () => (
  <Composition id="SuenganoB4" component={SuenganoB4} durationInFrames={4637} fps={30} width={1280} height={720} />
);
registerRoot(Root);
