import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v68a7e4bfb40} from "./VideoEdit/Main_v68a7e4bfb40";

const Root: React.FC = () => <Composition
  id="Bagasy-v68a7e4bfb40"
  component={BagasyTimeline_v68a7e4bfb40}
  durationInFrames={46474}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
