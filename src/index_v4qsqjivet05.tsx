import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v4qsqjivet05} from "./VideoEdit/Main_v4qsqjivet05";

const Root: React.FC = () => <Composition
  id="Bagasy-v4qsqjivet05"
  component={BagasyTimeline_v4qsqjivet05}
  durationInFrames={41810}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
