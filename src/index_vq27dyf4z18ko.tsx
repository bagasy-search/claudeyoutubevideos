import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_vq27dyf4z18ko} from "./VideoEdit/Main_vq27dyf4z18ko";

const Root: React.FC = () => <Composition
  id="Bagasy-vq27dyf4z18ko"
  component={BagasyTimeline_vq27dyf4z18ko}
  durationInFrames={41394}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
