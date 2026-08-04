import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v4qsqjivs53o} from "./VideoEdit/Main_v4qsqjivs53o";

const Root: React.FC = () => <Composition
  id="Bagasy-v4qsqjivs53o"
  component={BagasyTimeline_v4qsqjivs53o}
  durationInFrames={40884}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
