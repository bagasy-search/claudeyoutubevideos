import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v89mlm0ixyno} from "./VideoEdit/Main_v89mlm0ixyno";

const Root: React.FC = () => <Composition
  id="Bagasy-v89mlm0ixyno"
  component={BagasyTimeline_v89mlm0ixyno}
  durationInFrames={43744}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
