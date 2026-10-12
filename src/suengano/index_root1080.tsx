import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoRoot1080 } from "./Root1080";

// duracion real: 974,57 s originales - 20,18 s de corrimiento = 954,39 s = 28 632 frames
const Root: React.FC = () => (
  <Composition id="SuenganoRoot1080" component={SuenganoRoot1080} durationInFrames={28632} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
