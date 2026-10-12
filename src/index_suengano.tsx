import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoRoot1080 } from "./suengano/Root1080";

// entry del farm (scripts/farm.mjs detecta src/index_<slug>.tsx). Duración: 954,39 s = 28 632 frames.
const Root: React.FC = () => (
  <Composition id="SuenganoRoot1080" component={SuenganoRoot1080} durationInFrames={28632} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
