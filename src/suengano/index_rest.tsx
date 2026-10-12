import React from "react";
import { Composition, registerRoot } from "remotion";
import { SuenganoRest } from "./Rest";

const Root: React.FC = () => (
  <Composition id="SuenganoRest" component={SuenganoRest} durationInFrames={fr(335)} fps={30} width={1280} height={720} />
);
const fr = (s: number) => Math.round(s * 30);
registerRoot(Root);
