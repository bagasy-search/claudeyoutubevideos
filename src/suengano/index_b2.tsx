import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoB2 } from "./B2";

const Root: React.FC = () => (
  <Composition id="SuenganoB2" component={SuenganoB2} durationInFrames={4200} fps={30} width={1280} height={720} />
);
registerRoot(Root);
