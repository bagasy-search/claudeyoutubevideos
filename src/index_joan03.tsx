import React from "react";
import { Composition, registerRoot } from "remotion";
import { makeMain } from "./joan16/Main";
import { cues } from "./joan16/cues_joan03.gen";

const Main = makeMain(cues);
const Root: React.FC = () => (
  <Composition id="Joan03" component={Main} durationInFrames={cues.TOTAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
