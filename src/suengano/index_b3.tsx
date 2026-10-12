import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoB3 } from "./B3";

const Root: React.FC = () => (
  <Composition id="SuenganoB3" component={SuenganoB3} durationInFrames={4200} fps={30} width={1280} height={720} />
);
registerRoot(Root);
