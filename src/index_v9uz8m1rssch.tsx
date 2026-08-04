import React from "react";
import {Composition, registerRoot} from "remotion";
import {BagasyTimeline_v9uz8m1rssch} from "./VideoEdit/Main_v9uz8m1rssch";

const Root: React.FC = () => <Composition
  id="Bagasy-v9uz8m1rssch"
  component={BagasyTimeline_v9uz8m1rssch}
  durationInFrames={45929}
  fps={30}
  width={1920}
  height={1080}
/>;
registerRoot(Root);
