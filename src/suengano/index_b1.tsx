import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoB1 } from "./B1";

const Root: React.FC = () => (
  <Composition id="SuenganoB1" component={SuenganoB1} durationInFrames={4200} fps={30} width={1280} height={720} />
);
registerRoot(Root);
